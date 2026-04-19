#!/usr/bin/env python3
"""
FPのひとりごと - 自動記事生成スクリプト
官公庁・金融機関のRSSフィードを取得し、Claude APIで記事を自動生成します。
"""

import os
import json
import re
import hashlib
import calendar
import feedparser
import anthropic
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from dateutil import parser as dateparser

# ============================================================
# 設定：RSSフィード一覧
# ============================================================
RSS_FEEDS = [
    # e-Gov（法令・行政情報 ※財務省RSS廃止のため代替）
    {
        "url": "https://www.e-gov.go.jp/rss.xml",
        "source": "e-Gov",
        "category": "税務・税制改正",
    },
    # 消費者庁（※国税庁RSS廃止のため代替）
    {
        "url": "https://www.caa.go.jp/news.rss",
        "source": "消費者庁",
        "category": "税務・税制改正",
    },
    # 金融庁（URL変更）
    {
        "url": "https://www.fsa.go.jp/fsaNewsListAll_rss2.xml",
        "source": "金融庁",
        "category": "NISA・iDeCo",
    },
    # 厚生労働省（URL変更）
    {
        "url": "https://www.mhlw.go.jp/stf/news.rdf",
        "source": "厚生労働省",
        "category": "社会保険・年金",
    },
    # 金財（日本FP協会RSS廃止のため代替）
    {
        "url": "https://www.kinzai.or.jp/rss",
        "source": "金財",
        "category": "FP試験情報",
    },
    # 日本銀行（URL変更）
    {
        "url": "https://www.boj.or.jp/rss/whatsnew.xml",
        "source": "日本銀行",
        "category": "金融機関の動向",
    },
    # 経済産業省（※住宅金融支援機構RSS廃止のため代替）
    {
        "url": "https://www.meti.go.jp/ml_index_release_atom.xml",
        "source": "経済産業省",
        "category": "不動産・住宅",
    },
    # 日本証券業協会（※投資信託協会RSS廃止のため代替）
    {
        "url": "https://www.jsda.or.jp/index.rss",
        "source": "日本証券業協会",
        "category": "NISA・iDeCo",
    },
    # 生命保険協会
    {
        "url": "https://www.seiho.or.jp/info/feed/rss.xml",
        "source": "生命保険協会",
        "category": "リスク管理・保険",
    },
    # 全国銀行協会
    {
        "url": "https://www.zenginkyo.or.jp/news/rss/",
        "source": "全国銀行協会",
        "category": "金融機関の動向",
    },
    # 日本税理士会連合会
    {
        "url": "https://www.nichizeiren.or.jp/feed/",
        "source": "日本税理士会連合会",
        "category": "相続・事業承継",
    },
    # 信託協会（URL修正）
    {
        "url": "https://www.shintaku-kyokai.or.jp/rss2.xml",
        "source": "信託協会",
        "category": "相続・事業承継",
    },
    # 中小企業庁
    {
        "url": "https://www.chusho.meti.go.jp/rss/index.xml",
        "source": "中小企業庁",
        "category": "相続・事業承継",
    },
]

# ============================================================
# パス設定
# ============================================================
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
ARTICLES_DIR = PROJECT_ROOT / "src" / "content" / "articles"
PROCESSED_FILE = SCRIPT_DIR / "processed_items.json"

# 1回の実行で生成する記事の最大数（APIコスト管理）
MAX_ARTICLES_PER_RUN = 5


def load_processed() -> set:
    """処理済みアイテムのIDセットを読み込む"""
    if PROCESSED_FILE.exists():
        with open(PROCESSED_FILE, "r", encoding="utf-8") as f:
            return set(json.load(f))
    return set()


def save_processed(processed: set):
    """処理済みアイテムのIDセットを保存する"""
    with open(PROCESSED_FILE, "w", encoding="utf-8") as f:
        json.dump(list(processed), f, ensure_ascii=False, indent=2)


def make_item_id(url: str, title: str) -> str:
    """フィードアイテムの一意IDを生成"""
    return hashlib.md5(f"{url}:{title}".encode()).hexdigest()


def slugify(text: str) -> str:
    """タイトルからスラッグ（ファイル名）を生成"""
    # 英数字以外をハイフンに置換
    text = re.sub(r"[^\w\s-]", "", text, flags=re.UNICODE)
    text = re.sub(r"[\s_]+", "-", text)
    text = text.strip("-")
    # 日本語を含む場合はハッシュで短縮
    if re.search(r"[^\x00-\x7F]", text):
        return hashlib.md5(text.encode()).hexdigest()[:12]
    return text[:50].lower()


def fetch_new_items(processed: set) -> list:
    """全フィードから未処理の新着アイテムを取得"""
    new_items = []

    for feed_config in RSS_FEEDS:
        url = feed_config["url"]
        print(f"  取得中: {feed_config['source']} ({url})")

        try:
            req = urllib.request.Request(
                url,
                headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},
            )
            with urllib.request.urlopen(req, timeout=15) as resp:
                raw = resp.read()
            feed = feedparser.parse(raw)

            if feed.bozo and not feed.entries:
                print(f"    ⚠️ フィード取得失敗またはエントリなし")
                continue

            for entry in feed.entries[:10]:  # 最新10件をチェック
                title = entry.get("title", "").strip()
                link = entry.get("link", "").strip()

                if not title or not link:
                    continue

                item_id = make_item_id(link, title)
                if item_id in processed:
                    continue

                # 公開日時を取得
                now = datetime.now(timezone.utc)
                pub_date = now
                if hasattr(entry, "published_parsed") and entry.published_parsed:
                    pub_date = datetime.fromtimestamp(
                        calendar.timegm(entry.published_parsed), tz=timezone.utc
                    )
                    # 未来日付は現在日時に差し替え
                    if pub_date > now:
                        pub_date = now

                description = entry.get("summary", entry.get("description", ""))
                # HTMLタグを除去
                description = re.sub(r"<[^>]+>", "", description).strip()
                description = description[:500] if len(description) > 500 else description

                new_items.append({
                    "id": item_id,
                    "title": title,
                    "link": link,
                    "description": description,
                    "pub_date": pub_date,
                    "source": feed_config["source"],
                    "category": feed_config["category"],
                })

        except Exception as e:
            print(f"    ❌ エラー: {e}")
            continue

    # 新しい順に並べ、最大数を制限
    new_items.sort(key=lambda x: x["pub_date"], reverse=True)
    return new_items[:MAX_ARTICLES_PER_RUN]


def generate_article(item: dict, client: anthropic.Anthropic) -> str | None:
    """Claude APIを使って記事を生成する"""

    system_prompt = """あなたは「FPのひとりごと」というブログの筆者です。
FP1級資格を持ち、郵便局系の金融機関でマネジメント職をしているベテランのファイナンシャルプランナーです。

【文体の特徴】
- 「ですね」「ですよね」「〜してみましょう」など、適度にくだけた口調
- 読者に語りかけるような親しみやすいトーン
- でも内容はしっかり専門的で正確

【記事構成の原則】
- 最初に結論・要点を述べる（冒頭の一文で「何の話か」を明確に）
- 見出し（##、###）で構造を整理する
- 具体的な数字・金額・事例を必ず含める
- 「つまり」「要するに」「ポイントは」で要点を締める
- 800〜1500字程度

【必須セクション構成】
1. 導入段落（何の話か、なぜ今重要か）
2. 内容の解説（2〜3のセクション、見出しあり）
3. 「FP試験のポイント」セクション（試験に関連する場合）または「実生活への影響・活用法」セクション
4. まとめ段落

【禁止事項】
- 抽象的だけで終わる言い回し（「重要です」「注意が必要です」→ 何がどう重要/注意なのか具体的に）
- 曖昧な結論
- 実務・生活に落とし込めない理想論
- 「この情報は〇〇から得ました」などのメタな説明
- マークダウンのfrontmatterブロック（---）は含めない。本文だけを出力する"""

    user_prompt = f"""以下の公式情報をもとに、ブログ記事の本文（マークダウン形式）を書いてください。

【情報源】{item['source']}
【タイトル】{item['title']}
【URL】{item['link']}
【概要】{item['description']}

記事の本文のみを出力してください（frontmatterは不要です）。"""

    try:
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",  # コスト最適化
            max_tokens=2000,
            messages=[{"role": "user", "content": user_prompt}],
            system=system_prompt,
        )
        return message.content[0].text
    except Exception as e:
        print(f"    ❌ 記事生成エラー: {e}")
        return None


def extract_excerpt(body: str) -> str:
    """記事本文から要約を抽出（最初の段落を使用）"""
    # 見出し行を除いた最初の段落を取得
    lines = body.split("\n")
    for line in lines:
        line = line.strip()
        if line and not line.startswith("#") and not line.startswith("|") and len(line) > 30:
            # 100文字程度に制限
            return line[:100] + ("…" if len(line) > 100 else "")
    return "記事の詳細はこちらをご覧ください。"


def save_article(item: dict, body: str) -> bool:
    """記事をMarkdownファイルとして保存"""
    slug = slugify(item["title"])
    date_str = item["pub_date"].strftime("%Y-%m-%d")
    filename = f"{date_str}-{slug}.md"
    filepath = ARTICLES_DIR / filename

    # 重複ファイル名の回避
    if filepath.exists():
        slug = f"{slug}-{item['id'][:6]}"
        filename = f"{date_str}-{slug}.md"
        filepath = ARTICLES_DIR / filename

    excerpt = extract_excerpt(body)

    # タグを生成（カテゴリから簡易的に）
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
    tags = tag_map.get(item["category"], [])

    title_escaped = item["title"].replace('"', '\\"')
    excerpt_escaped = excerpt.replace('"', '\\"')

    frontmatter = f"""---
title: "{title_escaped}"
pubDate: {date_str}
category: "{item['category']}"
source: "{item['source']}"
sourceUrl: "{item['link']}"
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

    print(f"📡 RSSフィードを取得中... (処理済み: {len(processed)}件)")
    new_items = fetch_new_items(processed)

    if not new_items:
        print("✅ 新着アイテムはありません")
        return

    print(f"\n📝 {len(new_items)}件の新着アイテムを記事化します\n")

    generated = 0
    for item in new_items:
        print(f"[{item['source']}] {item['title'][:50]}...")

        body = generate_article(item, client)
        if body:
            if save_article(item, body):
                processed.add(item["id"])
                generated += 1

        # 処理済みIDは生成成功・失敗にかかわらず保存（再処理防止）
        processed.add(item["id"])

    save_processed(processed)
    print(f"\n🎉 完了: {generated}件の記事を生成しました")


if __name__ == "__main__":
    main()
