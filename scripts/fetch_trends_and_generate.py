#!/usr/bin/env python3
"""
FPのひとりごと - トレンド記事生成スクリプト
以下の3ソースから話題を収集し、FP関連記事を自動生成します。
  1. Google Trends デイリーRSS（日本の急上昇ワード）
  2. NHKニュース 経済カテゴリRSS
  3. 日経電子版 RSS（無料部分）
"""

import os
import json
import re
import hashlib
import time
import urllib.request
from datetime import datetime, timezone, timedelta
from pathlib import Path

import feedparser
import anthropic

# ============================================================
# 設定
# ============================================================
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
ARTICLES_DIR = PROJECT_ROOT / "src" / "content" / "articles"

MAX_ARTICLES_PER_RUN = 1  # 1日1本に制限

# ソース一覧
TREND_SOURCES = [
    {
        "name": "Google Trends（日本）",
        "url": "https://trends.google.co.jp/trending/rss?geo=JP",
        "type": "trends",  # タイトル＝キーワード
    },
    {
        "name": "NHKニュース 経済",
        "url": "https://www.nhk.or.jp/rss/news/cat4.xml",
        "type": "news",  # タイトル＝ニュース見出し
    },
    {
        "name": "Yahoo!ニュース 経済",
        "url": "https://news.yahoo.co.jp/rss/categories/business.xml",
        "type": "news",
    },
]

# FP関連キーワード（ニュース記事をフィルタリングするため）
FP_KEYWORDS = [
    "NISA", "iDeCo", "年金", "相続", "保険", "住宅ローン", "金利", "確定申告",
    "税", "投資", "資産", "老後", "社会保険", "雇用", "給付", "介護", "医療",
    "株", "債券", "為替", "日銀", "金融", "不動産", "贈与", "節税", "ふるさと納税",
    "インフレ", "物価", "賃金", "退職", "年収", "所得", "控除", "積立",
]

# カテゴリ推定キーワード
CATEGORY_KEYWORDS = {
    "NISA・iDeCo": ["NISA", "iDeCo", "投資信託", "積立", "資産運用", "株", "ETF", "インデックス"],
    "社会保険・年金": ["年金", "社会保険", "雇用保険", "健康保険", "介護保険", "給付", "育休", "医療", "高額療養費", "傷病手当", "生活保護", "扶養照会", "セーフティネット", "失業", "賃金", "給料", "給与", "労働基準法", "労働法"],
    "税務・税制改正": ["税", "確定申告", "控除", "節税", "ふるさと納税", "インボイス", "相続税", "贈与税"],
    "不動産・住宅": ["住宅ローン", "不動産", "マンション", "金利", "住宅", "賃貸"],
    "リスク管理・保険": ["保険", "生命保険", "医療保険", "がん保険", "火災保険"],
    "相続・事業承継": ["相続", "遺言", "贈与", "事業承継", "後見"],
    "金融機関の動向": ["日銀", "銀行", "金融", "為替", "株価", "利上げ", "政策金利"],
}


def guess_category(text: str) -> str:
    """テキストからカテゴリを推定する"""
    scores = {cat: 0 for cat in CATEGORY_KEYWORDS}
    for cat, keywords in CATEGORY_KEYWORDS.items():
        for kw in keywords:
            if kw in text:
                scores[cat] += 1
    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else "NISA・iDeCo"


def get_recent_titles(days: int = 14) -> list:
    """直近days日以内に公開された記事タイトルを返す（同一ニュース重複判定用）"""
    cutoff = datetime.now(timezone.utc).date() - timedelta(days=days)
    recent = []
    for md_file in ARTICLES_DIR.glob("*.md"):
        try:
            content = md_file.read_text(encoding="utf-8")
            title_match = re.search(r'^title:\s*"?(.+?)"?\s*$', content, re.MULTILINE)
            date_match = re.search(r'^pubDate:\s*"?(\d{4}-\d{2}-\d{2})', content, re.MULTILINE)
            if not title_match or not date_match:
                continue
            pub_date = datetime.strptime(date_match.group(1), "%Y-%m-%d").date()
            if pub_date >= cutoff:
                recent.append(title_match.group(1).strip())
        except Exception:
            continue
    return recent


def fetch_all_topics() -> list:
    """全ソースからトピックを収集する"""
    topics = []

    for source in TREND_SOURCES:
        print(f"  📡 {source['name']} を取得中...")
        try:
            req = urllib.request.Request(
                source["url"],
                headers={"User-Agent": "Mozilla/5.0 (compatible; FPHitorigoto/1.0)"},
            )
            with urllib.request.urlopen(req, timeout=20) as resp:
                raw = resp.read()

            feed = feedparser.parse(raw)
            if not feed.entries:
                print(f"    ⚠️ エントリなし")
                continue

            for entry in feed.entries[:15]:
                title = entry.get("title", "").strip()
                description = re.sub(r"<[^>]+>", "", entry.get("summary", "")).strip()
                text = title + " " + description

                # Google Trendsは全トピック対象、ニュースはFPキーワードでフィルタ
                if source["type"] == "news":
                    if not any(kw in text for kw in FP_KEYWORDS):
                        continue

                topics.append({
                    "title": title,
                    "description": description[:300],
                    "source_name": source["name"],
                    "source_type": source["type"],
                    "category": guess_category(text),
                })

            print(f"    ✅ {len([t for t in topics if t['source_name'] == source['name']])}件取得")
            time.sleep(1)

        except Exception as e:
            print(f"    ❌ 取得失敗: {e}")
            continue

    return topics


def should_generate_article(topic: dict, recent_titles: list, client: anthropic.Anthropic) -> tuple[bool, str]:
    """記事化する価値があるかをHaikuに判断させる"""

    keyword = topic["title"]
    category = topic["category"]
    source_name = topic["source_name"]
    description = topic["description"]

    recent_titles_text = "\n".join(f"- {t}" for t in recent_titles) if recent_titles else "（なし）"

    prompt = f"""あなたは「FPのひとりごと」というFP受験者・金融機関の若手向けブログの編集者です。
以下のトピックをブログ記事にする価値があるか判断してください。

【情報源】{source_name}
【トピック】{keyword}
【概要】{description}
【推定カテゴリ】{category}

【直近2週間に公開した既存記事の一覧】
{recent_titles_text}

以下の基準で総合的に判断してください：

①FP・お金に関係があるか
- FPの試験範囲または実生活のお金に関連しているか
- 芸能・スポーツ・政治など、FP・お金と無関係ではないか
- 人名や特定商品名のみで、一般的な記事にしにくくないか

②既存記事と「同一のニュースイベント」ではないか（最重要）
- 上の既存記事一覧の中に、このトピックと同じニュース・同じ統計・同じ発表・同じ出来事を扱った記事があれば、切り口や表現が違っても必ず「スキップ」とする
- 例：同じ「税収が過去最高」「日銀短観の発表」「同じ制度改正」などを別の角度で書くのは重複とみなす
- タイトルの文言が違っても、扱っている事実・数字・出来事が同じならスキップする
- 同一ニュースでスキップする場合、理由に「既存記事『（該当タイトル）』と同一ニュースのため重複」と明記する

③既存記事と異なる角度があるか
- 上記②に該当しない場合、制度改正・新しい動向・別の活用法など新しい角度があれば記事化する
- 関連する既存記事が全くない場合は記事化してよい

「記事化する」か「スキップ」のどちらかを最初に書き、次の行に記事タイトル案（記事化する場合のみ）を書いてください。
形式：
記事化する
タイトル案：〇〇〇〇

または：
スキップ
理由：〇〇〇〇"""

    try:
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=300,
            messages=[{"role": "user", "content": prompt}],
        )
        answer = message.content[0].text.strip()
        print(f"    🤖 判断: {answer[:120]}")

        if not answer.startswith("記事化する"):
            return False, ""

        title_match = re.search(r"タイトル案：(.+)", answer)
        title = title_match.group(1).strip() if title_match else f"{keyword}について知っておきたいこと"
        return True, title

    except Exception as e:
        print(f"    ❌ 判断エラー: {e}")
        return False, ""


def generate_article(topic: dict, title: str, client: anthropic.Anthropic) -> "str | None":
    """Sonnetでブログ記事を生成する"""

    system_prompt = """あなたは「FPのひとりごと」というブログの筆者です。
FP1級資格を持ち、金融機関でマネジメント職をしているベテランのファイナンシャルプランナーです。

【ターゲット読者】FP受験者・金融機関の若手。制度・試験との関連を重視。

【文体の特徴】
- 「ですね」「ですよね」「〜してみましょう」など、適度にくだけた口調
- 読者に語りかけるような親しみやすいトーン
- でも内容はしっかり専門的で正確

【記事構成の原則】
- 最初に結論・要点を述べる（冒頭の一文で「何の話か」を明確に）
- 見出し（##、###）で構造を整理する
- 具体的な数字・金額・事例を必ず含める
- 1000〜1500字程度

【必須セクション構成】
1. 導入段落（なぜ今このトピックが注目されているか）
2. 内容の解説（2〜3のセクション）
3. 「FP試験のポイント」セクション（試験との関連がある場合）または「実生活への影響・活用法」
4. まとめ段落

【禁止事項】
- 抽象的だけで終わる言い回し
- 曖昧な結論
- マークダウンのfrontmatterブロック（---）は含めない。本文だけを出力する
- 文章の途中や段落の先頭に唐突に「ですね。」を挿入しないこと
- 記事本文にURLやリンクを含めないこと
- 所属組織や勤務先が特定できる表現は使わないこと。「金融機関の現場では」のように一般的な表現にすること
- 不確かな情報は断定せず「〜とされています」「要確認です」と明記すること
- 事実に基づかない記述は絶対に書かないこと。特に以下は自分の推測で断定しないこと：
  - 「FP試験に出題される」「FP◯級で頻出」など、具体的な試験出題実績・出題範囲の断定（実際に出題されるかどうかは検証できないため、断定的な表現は使わず、一般知識としての解説に留めること）
  - 統計・調査結果の数値（正確な出典を把握していない場合は「〜という調査もあります」など、伝聞・推定であることを明記すること）
  - 法令・制度の施行日や適用条件（不確かな場合は「要確認」と明記すること）
- 「FP試験のポイント」セクションについて：
  - トピックがFP試験の出題範囲（ライフプランニング〈社会保険・年金・住宅ローン等を含む〉、リスク管理、金融資産運用、タックスプランニング、不動産、相続・事業承継）に該当する制度・仕組みの解説であれば、遠慮せず通常通り書いてよい。高額療養費・年金・保険・税制・不動産取引などの制度解説は基本的にこの範囲に含まれる
  - 禁止しているのは「本当にFP試験に出題された実績があるか」を確認できないのに、「近年出題されている」「頻出テーマ」のように出題実績を断定することであり、制度そのものの解説を避けることではない
  - トピックが芸能・スポーツ・企業個別ニュースなど、FP試験の分野に明確に当てはまらない場合のみ、このセクションを書かず「実生活への影響・活用法」にすること"""

    user_prompt = f"""以下のトピックに関心を持つ読者に向けて、ブログ記事を書いてください。

【情報源】{topic['source_name']}
【トピック】{topic['title']}
【概要】{topic['description']}
【タイトル】{title}
【カテゴリ】{topic['category']}

記事の本文のみを出力してください（frontmatterは不要です）。"""

    try:
        message = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=2500,
            messages=[{"role": "user", "content": user_prompt}],
            system=system_prompt,
        )
        return message.content[0].text
    except Exception as e:
        print(f"    ❌ 記事生成エラー: {e}")
        return None


def generate_note_article(topic: dict, title: str, blog_body: str, client: anthropic.Anthropic) -> "str | None":
    """Sonnetでnote向け記事を生成する"""

    system_prompt = """あなたはnote「FPのひとりごと」の筆者です。
FP1級資格を持ち、金融機関でマネジメント職をしているベテランのファイナンシャルプランナーです。

【ターゲット読者】一般の方・お金に関心がある人。実生活への応用・具体的なエピソードを重視。FP受験者にも参考になる内容。

【ブログとの違い】
- FP試験のポイントセクションは不要
- 制度の説明より「自分ごとに引き寄せた話」を中心に
- 「もしあなたが〜だったら」「実際に〜という相談を受けることがあります」のような語りかけ
- 1200〜1800字程度（ブログより少し長め・読み物として）

【文体の特徴】
- 親しみやすく、読んでいて温かみがある
- 専門用語は使うが、必ず平易な言葉で補足する
- 「ですね」「ですよね」を自然に使う

【禁止事項】
- FP試験のポイントセクションを入れない
- マークダウンのfrontmatterブロック（---）は含めない
- 記事本文にURLやリンクを含めない
- 所属組織や勤務先が特定できる表現は使わない
- 不確かな情報は断定せず「〜とされています」と明記する
- 事実に基づかない記述は絶対に書かないこと。統計・調査結果の数値や制度の詳細は、出典を把握していない場合「〜という調査もあります」など伝聞であることを明記すること"""

    user_prompt = f"""以下のトピックについて、note向けの記事を書いてください。
同じトピックのブログ記事も参考に渡しますが、note記事は一般の方向けに書き直してください。

【トピック】{topic['title']}
【概要】{topic['description']}
【タイトル（note用に適宜調整してOK）】{title}

【参考：ブログ記事の内容】
{blog_body[:800]}

note記事の本文のみを出力してください（frontmatterは不要です）。"""

    try:
        message = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=3000,
            messages=[{"role": "user", "content": user_prompt}],
            system=system_prompt,
        )
        return message.content[0].text
    except Exception as e:
        print(f"    ❌ note記事生成エラー: {e}")
        return None


def save_note_draft(title: str, body: str, topic_title: str) -> bool:
    """note下書きをdocs/に保存する"""
    note_dir = PROJECT_ROOT / "docs"
    date_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    slug = re.sub(r"[^\w]", "-", topic_title, flags=re.UNICODE)
    slug = re.sub(r"-+", "-", slug).strip("-")
    if re.search(r"[^\x00-\x7F]", slug):
        slug = hashlib.md5(topic_title.encode()).hexdigest()[:8]
    filename = f"note_{date_str}_{slug[:30]}.md"
    filepath = note_dir / filename

    note_dir.mkdir(parents=True, exist_ok=True)

    content = f"""# {title}

{body}
"""
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"    ✅ note下書き保存: docs/{filename}")
    return True


def extract_excerpt(body: str) -> str:
    lines = body.split("\n")
    for line in lines:
        line = line.strip()
        if line and not line.startswith("#") and not line.startswith("|") and len(line) > 30:
            return line[:100] + ("…" if len(line) > 100 else "")
    return "記事の詳細はこちらをご覧ください。"


def slugify(text: str) -> str:
    text = re.sub(r"[^\w\s-]", "", text, flags=re.UNICODE)
    text = re.sub(r"[\s_]+", "-", text)
    text = text.strip("-")
    if re.search(r"[^\x00-\x7F]", text):
        return "trends-" + hashlib.md5(text.encode()).hexdigest()[:10]
    return "trends-" + text[:40].lower()


def save_article(title: str, body: str, category: str, keyword: str) -> bool:
    slug = slugify(title)
    date_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    filename = f"{date_str}-{slug}.md"
    filepath = ARTICLES_DIR / filename

    if filepath.exists():
        slug = slug + "-" + hashlib.md5(keyword.encode()).hexdigest()[:6]
        filename = f"{date_str}-{slug}.md"
        filepath = ARTICLES_DIR / filename

    excerpt = extract_excerpt(body)

    tag_map = {
        "税務・税制改正": ["税金", "税制改正"],
        "社会保険・年金": ["社会保険", "年金"],
        "NISA・iDeCo": ["NISA", "iDeCo", "資産運用"],
        "不動産・住宅": ["不動産", "住宅"],
        "金融機関の動向": ["金融", "銀行"],
        "FP試験情報": ["FP試験", "資格"],
        "相続・事業承継": ["相続", "事業承継"],
        "リスク管理・保険": ["保険", "リスク管理"],
    }
    tags = tag_map.get(category, [])

    title_escaped = title.replace('"', '\\"')
    excerpt_escaped = excerpt.replace('"', '\\"')

    frontmatter = f"""---
title: "{title_escaped}"
pubDate: {date_str}
category: "{category}"
source: "FPひとりごと編集部"
tags: {json.dumps(tags, ensure_ascii=False)}
excerpt: "{excerpt_escaped}"
---

"""

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(frontmatter + body)

    print(f"    ✅ 保存: {filename}")
    return True


def main():
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("❌ ANTHROPIC_API_KEY が設定されていません")
        return

    client = anthropic.Anthropic(api_key=api_key)
    # 直近2週間の記事タイトルを同一ニュース重複判定に使う
    recent_titles = get_recent_titles(14)

    print("📡 トピックを収集中...\n")
    topics = fetch_all_topics()

    if not topics:
        print("✅ 新着トピックは見つかりませんでした")
        return

    print(f"\n🔍 {len(topics)}件のトピックを確認します\n")

    seen_titles = set()
    generated_keywords = []  # 生成済み記事のキーワード（重複テーマ検出用）
    generated = 0

    for topic in topics:
        if generated >= MAX_ARTICLES_PER_RUN:
            break

        # 同一実行内での重複スキップ
        if topic["title"] in seen_titles:
            continue
        seen_titles.add(topic["title"])

        # 生成済み記事と同じキーワードを含むトピックはスキップ
        topic_lower = topic["title"].lower()
        duplicate_theme = False
        for kw in generated_keywords:
            if kw in topic_lower or topic_lower in kw:
                print(f"    ⏭️ スキップ（同テーマ既出: {kw}）")
                duplicate_theme = True
                break
        if duplicate_theme:
            continue

        print(f"[{topic['source_name']}] {topic['title'][:50]}")

        should_write, title = should_generate_article(topic, recent_titles, client)
        if not should_write:
            print(f"    ⏭️ スキップ")
            continue

        print(f"    📝 記事生成中: {title}")
        body = generate_article(topic, title, client)
        if body:
            if save_article(title, body, topic["category"], topic["title"]):
                recent_titles.append(title)
                generated_keywords.append(topic["title"].lower())
                generated += 1

            time.sleep(2)
            print(f"    📝 note下書き生成中...")
            note_body = generate_note_article(topic, title, body, client)
            if note_body:
                save_note_draft(title, note_body, topic["title"])

        time.sleep(3)

    print(f"\n🎉 完了: {generated}件のトレンド記事を生成しました")


if __name__ == "__main__":
    main()
