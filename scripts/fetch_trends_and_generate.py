#!/usr/bin/env python3
"""
FPのひとりごと - Google Trends連携 記事生成スクリプト
日本でトレンドになっているFP関連キーワードを取得し、記事を自動生成します。
"""

import os
import json
import re
import hashlib
import time
from datetime import datetime, timezone
from pathlib import Path

import anthropic
from pytrends.request import TrendReq

# ============================================================
# 設定
# ============================================================
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
ARTICLES_DIR = PROJECT_ROOT / "src" / "content" / "articles"
PROCESSED_FILE = SCRIPT_DIR / "trends_processed_items.json"

MAX_ARTICLES_PER_RUN = 2  # トレンド記事はSonnet使用のためコスト管理を厳しく

# 検索対象のFPカテゴリキーワード（Google Trendsに投げるシード）
# 急上昇の関連ワードを取得するためのベースキーワード
TREND_SEED_KEYWORDS = [
    "NISA",
    "iDeCo",
    "住宅ローン",
    "相続",
    "年金",
    "確定申告",
    "生命保険",
    "ふるさと納税",
    "投資信託",
    "老後資金",
]

# 記事化するカテゴリの対応表
CATEGORY_MAP = {
    "NISA": "NISA・iDeCo",
    "iDeCo": "NISA・iDeCo",
    "投資信託": "NISA・iDeCo",
    "老後資金": "NISA・iDeCo",
    "住宅ローン": "不動産・住宅",
    "相続": "相続・事業承継",
    "年金": "社会保険・年金",
    "確定申告": "税務・税制改正",
    "ふるさと納税": "税務・税制改正",
    "生命保険": "リスク管理・保険",
}


def load_processed() -> set:
    if PROCESSED_FILE.exists():
        with open(PROCESSED_FILE, "r", encoding="utf-8") as f:
            return set(json.load(f))
    return set()


def save_processed(processed: set):
    with open(PROCESSED_FILE, "w", encoding="utf-8") as f:
        json.dump(list(processed), f, ensure_ascii=False, indent=2)


def get_existing_titles() -> list:
    titles = []
    for md_file in ARTICLES_DIR.glob("*.md"):
        try:
            content = md_file.read_text(encoding="utf-8")
            match = re.search(r'^title:\s*"?(.+?)"?\s*$', content, re.MULTILINE)
            if match:
                titles.append(match.group(1).strip())
        except Exception:
            continue
    return titles


def fetch_rising_keywords() -> list:
    """Google Trendsから急上昇キーワードを取得する"""
    pytrends = TrendReq(hl="ja-JP", tz=540, timeout=(10, 25))
    results = []

    for seed in TREND_SEED_KEYWORDS:
        try:
            pytrends.build_payload([seed], geo="JP", timeframe="now 1-d")
            related = pytrends.related_queries()

            if seed not in related or related[seed]["rising"] is None:
                continue

            rising_df = related[seed]["rising"]
            if rising_df is None or rising_df.empty:
                continue

            for _, row in rising_df.head(3).iterrows():
                keyword = str(row["query"]).strip()
                value = int(row["value"])  # 急上昇スコア（高いほど急上昇）

                results.append({
                    "keyword": keyword,
                    "seed": seed,
                    "rising_score": value,
                    "category": CATEGORY_MAP.get(seed, "NISA・iDeCo"),
                })

            time.sleep(2)  # レート制限対策

        except Exception as e:
            print(f"  ⚠️ {seed} のトレンド取得失敗: {e}")
            continue

    # 急上昇スコア順にソート
    results.sort(key=lambda x: x["rising_score"], reverse=True)
    return results


def should_generate_article(keyword: str, category: str, client: anthropic.Anthropic) -> tuple[bool, str]:
    """記事化する価値があるかをHaikuに判断させる。(判断結果, 記事タイトル案) を返す"""

    prompt = f"""あなたは「FPのひとりごと」というFP受験者・金融機関の若手向けブログの編集者です。
今、日本でGoogleトレンドの急上昇キーワードとして「{keyword}」が浮上しています（カテゴリ：{category}）。

以下の基準で、このキーワードをブログ記事にする価値があるか判断してください：
- FPの試験範囲または実生活のお金に関連しているか
- 読者（FP受験者・金融機関の若手）にとって有益な内容を書けそうか
- 芸能・スポーツ・政治など、FP・お金と無関係ではないか
- 固有名詞（人名・商品名のみ）など、一般的な記事にしにくくないか

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
            max_tokens=150,
            messages=[{"role": "user", "content": prompt}],
        )
        answer = message.content[0].text.strip()
        print(f"    🤖 判断: {answer[:100]}")

        if not answer.startswith("記事化する"):
            return False, ""

        # タイトル案を抽出
        title_match = re.search(r"タイトル案：(.+)", answer)
        title = title_match.group(1).strip() if title_match else f"{keyword}について知っておきたいこと"
        return True, title

    except Exception as e:
        print(f"    ❌ 判断エラー: {e}")
        return False, ""


def generate_article(keyword: str, title: str, category: str, client: anthropic.Anthropic) -> "str | None":
    """Sonnetで記事を生成する（トレンド記事は品質重視）"""

    system_prompt = """あなたは「FPのひとりごと」というブログの筆者です。
FP1級資格を持ち、金融機関でマネジメント職をしているベテランのファイナンシャルプランナーです。

【文体の特徴】
- 「ですね」「ですよね」「〜してみましょう」など、適度にくだけた口調
- 読者に語りかけるような親しみやすいトーン
- でも内容はしっかり専門的で正確

【記事構成の原則】
- 最初に結論・要点を述べる（冒頭の一文で「何の話か」を明確に）
- 見出し（##、###）で構造を整理する
- 具体的な数字・金額・事例を必ず含める
- 「つまり」「要するに」「ポイントは」で要点を締める
- 1000〜1500字程度

【必須セクション構成】
1. 導入段落（なぜ今このキーワードが注目されているか）
2. 基本的な仕組みや背景の解説（2〜3のセクション）
3. 「FP試験のポイント」セクション（試験との関連がある場合）または「実生活への影響・活用法」
4. まとめ段落

【禁止事項】
- 抽象的だけで終わる言い回し
- 曖昧な結論
- 実務・生活に落とし込めない理想論
- マークダウンのfrontmatterブロック（---）は含めない。本文だけを出力する
- 文章の途中や段落の先頭に唐突に「ですね。」を挿入しないこと
- 記事本文にURLやリンクを含めないこと
- 私自身の所属組織や勤務先が特定できる表現は使わないこと。「金融機関の現場では」「実際の相談現場では」のように一般的な表現にすること"""

    user_prompt = f"""今、日本でGoogleトレンドに「{keyword}」が急上昇しています。
このキーワードに関心を持つ読者に向けて、以下のタイトルでブログ記事を書いてください。

【タイトル】{title}
【カテゴリ】{category}

記事の本文のみを出力してください（frontmatterは不要です）。
不確かな情報は断定せず「〜とされています」「要確認です」と明記してください。"""

    try:
        message = client.messages.create(
            model="claude-sonnet-4-6",  # トレンド記事は品質重視でSonnet
            max_tokens=2500,
            messages=[{"role": "user", "content": user_prompt}],
            system=system_prompt,
        )
        return message.content[0].text
    except Exception as e:
        print(f"    ❌ 記事生成エラー: {e}")
        return None


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
    processed = load_processed()
    existing_titles = get_existing_titles()

    print("📈 Google Trendsからキーワードを取得中...")
    rising_keywords = fetch_rising_keywords()

    if not rising_keywords:
        print("✅ 急上昇キーワードは見つかりませんでした")
        return

    print(f"\n🔍 {len(rising_keywords)}件のキーワードを確認します\n")

    generated = 0
    for item in rising_keywords:
        if generated >= MAX_ARTICLES_PER_RUN:
            break

        keyword = item["keyword"]
        category = item["category"]

        # 処理済みキーワードはスキップ
        kw_id = hashlib.md5(keyword.encode()).hexdigest()
        if kw_id in processed:
            print(f"  ⏭️ スキップ（処理済み）: {keyword}")
            continue

        print(f"[急上昇 +{item['rising_score']}%] {keyword}（{item['seed']}関連）")

        should_write, title = should_generate_article(keyword, category, client)
        if not should_write:
            print(f"    ⏭️ スキップ（価値なしと判断）")
            processed.add(kw_id)
            continue

        # 類似タイトルチェック（fetch_and_generate.pyの関数を流用）
        import sys
        sys.path.insert(0, str(SCRIPT_DIR))
        from fetch_and_generate import is_similar_title
        if is_similar_title(title, existing_titles):
            print(f"    ⏭️ スキップ（類似記事が既に存在）: {title}")
            processed.add(kw_id)
            continue

        print(f"    📝 記事生成中: {title}")
        body = generate_article(keyword, title, category, client)
        if body:
            if save_article(title, body, category, keyword):
                existing_titles.append(title)
                generated += 1

        processed.add(kw_id)
        save_processed(processed)
        time.sleep(3)

    save_processed(processed)
    print(f"\n🎉 完了: {generated}件のトレンド記事を生成しました")


if __name__ == "__main__":
    main()
