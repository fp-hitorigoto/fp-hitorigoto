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
import time
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
    # 総務省（住民税・地方税・マイナンバー ※e-Gov RSS廃止のため代替）
    {
        "url": "https://www.soumu.go.jp/news.rdf",
        "source": "総務省",
        "category": "税務・税制改正",
    },
    # 消費者庁（消費者保護・保険商品・金融トラブル）
    {
        "url": "https://www.caa.go.jp/news.rss",
        "source": "消費者庁",
        "category": "リスク管理・保険",
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
    # 国土交通省（住宅・不動産・住宅ローン関連）
    {
        "url": "https://www.mlit.go.jp/rss/all.rss",
        "source": "国土交通省",
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
    # 内閣府（経済・社会保障政策）
    {
        "url": "https://www.cao.go.jp/rss/news.xml",
        "source": "内閣府",
        "category": "税務・税制改正",
    },
]

# ============================================================
# FP関連キーワードフィルタリングリスト
# タイトルまたは概要にいずれかが含まれる記事のみ記事化する
# ============================================================
FP_KEYWORDS = [
    # ライフプランニング・資金計画
    "年金", "老後", "ライフプラン", "教育資金", "住宅ローン", "キャッシュフロー",
    "社会保険", "健康保険", "雇用保険", "労災", "介護保険", "高額療養費",
    "国民年金", "厚生年金", "iDeCo", "確定拠出", "奨学金", "育児休業",
    "産前産後", "障害年金", "遺族年金", "基礎年金", "繰上受給", "繰下受給",
    "在職老齢", "マクロ経済スライド", "ねんきん定期便", "国民健康保険",
    "後期高齢者医療", "傷病手当", "出産手当", "失業給付", "育児給付",
    "介護休業", "老齢給付", "特別支給", "加給年金", "振替加算",
    "合算対象期間", "カラ期間", "求職者給付", "就職促進給付", "教育訓練給付",
    "雇用継続給付", "高年齢雇用継続", "育児休業給付", "介護休業給付",
    "標準報酬月額", "被保険者", "扶養", "任意継続", "特例退職",
    "ファイナンシャルプランニング", "ライフイベント", "バランスシート",
    "キャッシュフロー表", "純資産", "負債", "可処分所得", "手取り収入",
    "教育費", "大学費用", "私立", "公立", "学費", "授業料",
    "住宅取得", "頭金", "繰上返済", "借換え", "リフォームローン",
    "フラット35", "変動金利", "固定金利", "元利均等", "元金均等",
    "団体信用生命保険", "つみたてNISA", "ジュニアNISA", "新NISA",
    "老齢基礎年金", "老齢厚生年金", "付加年金", "寡婦年金", "死亡一時金",
    "第1号被保険者", "第2号被保険者", "第3号被保険者", "任意加入",
    "保険料免除", "納付猶予", "学生納付特例", "追納", "時効",
    "年金分割", "3号分割", "合意分割", "離婚時年金",
    "企業年金", "確定給付企業年金", "DB", "DC", "厚生年金基金",
    "中退共", "小規模企業共済", "国民年金基金",
    "高額介護サービス費", "高額医療合算", "特定疾病", "限度額適用",
    "傷病手当金", "出産育児一時金", "埋葬料", "家族療養費",
    "訪問看護", "居宅サービス", "施設サービス", "地域密着型",
    "要介護認定", "ケアプラン", "ケアマネジャー", "地域包括支援",
    "高齢化", "少子化", "人口減少", "団塊の世代", "2025年問題",
    "働き方改革", "同一労働同一賃金", "副業", "兼業", "フリーランス",
    "ギグワーカー", "テレワーク", "リスキリング", "人的資本",
    "FIRE", "早期退職", "セミリタイア", "生涯現役", "定年延長",
    "再雇用", "継続雇用", "70歳就業", "高年齢者雇用",
    # リスク管理・保険
    "生命保険", "損害保険", "医療保険", "がん保険", "火災保険", "自動車保険",
    "保険料", "保障", "保険金", "死亡保険", "就業不能", "第三分野",
    "特約", "告知", "解約返戻金", "責任準備金", "純保険料", "付加保険料",
    "収支相等", "大数の法則", "積立保険", "定期保険", "終身保険",
    "養老保険", "個人年金保険", "変額保険", "外貨建て保険", "地震保険",
    "賠償責任", "積立傷害", "団体信用生命", "団信", "逓増定期保険",
    "逓減定期保険", "収入保障保険", "低解約返戻金型", "払済保険",
    "延長保険", "契約転換", "リビングニーズ特約",
    "指定代理請求", "先進医療特約", "三大疾病", "特定疾病保険",
    "賠償責任保険", "傷害保険", "海外旅行保険",
    "事業保険", "経営者保険", "法人保険", "損害率", "事故率",
    "保険法", "保険業法", "ソルベンシーマージン比率", "保険契約者保護機構",
    "生命保険契約者保護機構", "損害保険契約者保護機構",
    "保険料控除", "一般生命保険料控除",
    "介護医療保険料控除", "個人年金保険料控除",
    "自動車損害賠償責任保険", "自賠責", "任意自動車保険",
    "対人賠償", "対物賠償", "車両保険", "人身傷害補償",
    "搭乗者傷害", "無保険車傷害", "弁護士費用特約",
    "住宅火災保険", "住宅総合保険", "家財保険", "水災",
    "風災", "雪災", "盗難", "PL保険",
    "所得補償保険", "団体保険", "総合福祉団体定期保険",
    "キーマン保険", "事業継続", "BCP", "役員賠償責任",
    "サイバー保険", "自然災害", "巨大災害", "再保険",
    "保険代理店", "保険仲立人", "保険募集", "乗合代理店",
    # 金融資産運用
    "株式", "債券", "投資信託", "NISA", "ポートフォリオ", "金利", "為替",
    "投資", "運用", "配当", "利回り", "ETF", "インデックス",
    "金融政策", "日銀", "物価", "インフレ", "デフレ", "普通預金",
    "定期預金", "外貨預金", "ペイオフ", "預金保険", "国債", "地方債",
    "社債", "転換社債", "ワラント債", "ゼロクーポン", "デュレーション",
    "信用格付け", "株価指数", "PER", "PBR", "ROE", "配当利回り",
    "株主優待", "公募増資", "IPO", "MRF", "MMF", "ドルコスト平均",
    "時間分散", "アセットアロケーション", "シャープレシオ", "先物取引",
    "オプション取引", "スワップ", "FX", "外国為替", "景気動向指数",
    "GDP", "消費者物価指数", "為替レート", "長期金利", "短期金利",
    "政策金利", "量的緩和", "マイナス金利", "イールドカーブ",
    "ESG投資", "サステナブル投資", "ロボアドバイザー", "ラップ口座",
    "信用取引", "空売り", "証拠金", "レバレッジ", "ヘッジ",
    "コール", "プット", "ボラティリティ", "ベータ値",
    "相関係数", "標準偏差", "リスクプレミアム",
    "格付け", "デフォルト", "クレジットリスク",
    "流動性リスク", "市場リスク", "カントリーリスク",
    "日経平均", "TOPIX", "ダウ平均", "ナスダック",
    "REIT", "不動産投資信託", "インフラファンド",
    "財形貯蓄", "財形住宅", "財形年金",
    "目論見書", "運用報告書", "基準価額",
    "純資産総額", "信託報酬", "販売手数料",
    "アクティブ運用", "パッシブ運用", "インデックスファンド",
    "バランスファンド", "ターゲットデートファンド",
    "分散投資", "リバランス", "積立投資",
    "複利", "単利", "実質利回り", "インフレ調整",
    "景気循環", "景気回復", "景気後退", "スタグフレーション",
    "金融緩和", "金融引き締め", "財政政策",
    "国際金融", "IMF", "BIS",
    "証券化", "デリバティブ",
    "東京証券取引所", "プライム市場", "スタンダード市場", "グロース市場",
    "インサイダー取引", "相場操縦", "不公正取引",
    "金融商品取引法", "証券会社", "銀行", "信託銀行", "資産管理",
    "つみたて投資枠", "成長投資枠", "生涯投資枠",
    "資産所得倍増", "貯蓄から投資へ", "NISA恒久化", "iDeCo拡充",
    # タックスプランニング
    "所得税", "住民税", "確定申告", "控除", "税制", "税率", "法人税",
    "消費税", "贈与税", "相続税", "税金", "節税", "損益通算",
    "ふるさと納税", "給与所得", "事業所得", "不動産所得", "譲渡所得",
    "一時所得", "雑所得", "退職所得", "配当所得", "利子所得",
    "青色申告", "白色申告", "特別控除", "医療費控除", "社会保険料控除",
    "生命保険料控除", "地震保険料控除", "寄附金控除", "住宅借入金等特別控除",
    "住宅ローン控除", "配偶者控除", "扶養控除", "基礎控除", "障害者控除",
    "源泉徴収", "年末調整", "e-Tax", "インボイス", "電子帳簿",
    "減価償却", "必要経費", "特定口座", "申告分離課税", "総合課税",
    "退職所得控除", "公的年金等控除", "経営セーフティ共済",
    "法人成り", "役員報酬", "役員退職金", "損金算入",
    "繰越欠損金", "国際課税", "二重課税", "租税条約", "外国税額控除",
    "消費税課税事業者", "簡易課税", "免税事業者", "適格請求書",
    "3000万円控除", "軽減税率", "取得費加算",
    "みなし譲渡", "財産評価", "路線価", "倍率方式",
    "純資産価額方式", "類似業種比準方式", "配当還元方式",
    "税務調査", "修正申告", "更正の請求",
    "加算税", "延滞税", "重加算税",
    "税務署", "国税局", "国税庁", "税理士",
    "所得控除", "税額控除", "累進課税",
    "課税所得", "総所得金額", "合計所得金額",
    "住宅耐震改修特別控除", "認定住宅新築等特別税額控除",
    "固定資産税", "都市計画税", "不動産取得税", "登録免許税", "印紙税",
    "自動車税", "軽自動車税", "自動車重量税",
    "タックスプランニング", "租税回避", "節税対策",
    "税制改正", "与党税制改正大綱", "税制調査会",
    "退職金課税見直し", "退職所得課税", "金融所得課税", "1億円の壁",
    # 不動産
    "不動産", "住宅", "マンション", "土地", "賃貸", "売買", "登記",
    "借地", "建築", "不動産取得税",
    "借地権", "借家権", "定期借地", "定期借家", "原状回復",
    "重要事項説明", "瑕疵担保", "手付金", "仲介手数料",
    "抵当権", "根抵当権", "競売", "任意売却",
    "区分所有", "管理組合", "修繕積立", "容積率", "建ぺい率",
    "用途地域", "都市計画", "不動産鑑定", "公示地価",
    "収益還元法", "キャップレート",
    "サブリース", "地価公示", "基準地価",
    "相続税路線価", "長期優良住宅", "低炭素住宅", "ZEH",
    "耐震基準", "瑕疵保険", "宅建業法",
    "宅地建物取引士", "媒介契約", "専任媒介",
    "クーリングオフ", "契約不適合責任",
    "農地法", "土地区画整理", "タワーマンション", "空き家",
    "不動産クラウドファンディング", "NOI", "還元利回り",
    "表面利回り", "実質利回り", "稼働率", "空室率",
    "敷金", "礼金", "更新料", "修繕費", "リノベーション",
    "地上権", "地役権", "仮登記", "差押",
    "不動産証券化", "J-REIT",
    "省エネ基準", "断熱等性能等級",
    "建築確認", "検査済証",
    "土地活用", "等価交換", "定期借地権付き住宅", "事業用定期借地",
    "太陽光発電", "土地信託",
    # 相続・事業承継
    "相続", "遺言", "遺産", "贈与", "事業承継", "財産", "相続人",
    "遺族", "法定相続", "信託", "後見", "法定相続人", "法定相続分",
    "遺留分", "特別受益", "寄与分", "相続放棄", "限定承認",
    "相続税申告", "相続時精算課税", "暦年贈与",
    "教育資金一括贈与", "結婚子育て資金贈与", "小規模宅地等特例",
    "非上場株式", "自社株評価", "株価対策", "民事信託", "家族信託",
    "成年後見", "任意後見", "公正証書遺言", "自筆証書遺言",
    "遺産分割協議", "代償分割", "換価分割",
    "M&A", "持株会社", "種類株式", "相続登記",
    "死因贈与", "名義預金", "みなし相続財産", "生命保険金",
    "死亡退職金", "代襲相続", "数次相続",
    "遺言執行者", "検認", "遺言信託",
    "相続税の2割加算", "配偶者の税額軽減", "未成年者控除",
    "相次相続控除", "物納", "延納",
    "相続税納税猶予", "農地の納税猶予", "事業承継税制",
    "法人版事業承継税制", "個人版事業承継税制",
    "経営承継円滑化法", "経営者保証",
    "会社分割", "合併", "MBO", "TOB",
    "親族内承継", "第三者承継", "廃業",
    "企業価値", "のれん", "デューデリジェンス",
    "戸籍謄本", "遺産分割", "家庭裁判所",
    "配偶者居住権", "配偶者短期居住権", "特別寄与料",
    "遺留分侵害額請求", "遺留分放棄",
    "受益者連続型信託", "後継ぎ遺贈型",
    "オーナー経営者", "同族会社", "黄金株", "議決権制限株式",
    "従業員持株会", "ストックオプション", "新株予約権",
    "民事再生", "破産", "私的整理",
    # 経済・金融・法律全般
    "金融庁", "日本銀行", "財務省", "金融規制",
    "金融商品取引法", "適合性原則", "説明義務",
    "フィンテック", "仮想通貨", "暗号資産", "ブロックチェーン",
    "デジタル円", "CBDC", "マネーロンダリング", "AML", "KYC",
    "高齢者金融", "認知症", "資産凍結",
    "成年年齢", "消費者保護", "特定商取引法",
    "貸金業法", "総量規制", "多重債務",
    "自己破産", "個人再生", "任意整理", "過払い金",
    "借地借家法", "宅地建物取引業法",
    "消費者契約法", "個人情報保護法",
    "マイナンバー", "マイナカード",
    "SDGs", "ESG", "カーボンニュートラル", "脱炭素",
    "コーポレートガバナンス", "コンプライアンス",
    "金融リテラシー", "資産形成", "老後資金", "2000万円問題",
    "人生100年時代", "資産運用", "長寿リスク", "インフレリスク",
    "長期投資", "低コスト投資",
    "金融教育", "NISA恒久化",
    "電子契約", "電子署名", "マイナポータル",
    "FP試験", "ファイナンシャルプランナー", "FP1級", "FP2級", "AFP", "CFP",
    # FP試験・資格関連
    "FP技能検定", "ファイナンシャル・プランニング技能検定", "1級実技", "2級実技",
    "3級実技", "学科試験", "合格者", "合格発表", "CBT試験", "試験結果",
    "金財", "きんざい", "日本FP協会",
    # 日本銀行・経済統計
    "生活意識", "アンケート調査", "外国為替相場", "基準外国為替",
    "裁定外国為替", "短観", "資金循環", "マネーストック", "国際収支統計",
    "物価統計", "家計調査", "企業物価", "輸出入物価",
    # 金融庁・監督
    "監督指針", "保険業者", "認可特定保険", "運用パフォーマンス",
    "国内公募投信", "KPI", "フィデューシャリー・デューティー",
    "スチュワードシップ", "コーポレートガバナンス・コード",
    # 証券・債券
    "公社債", "現先", "店頭売買", "投資家別", "外国投信",
    "運用成績", "公社債投資信託",
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
            raw = None
            for attempt in range(3):
                try:
                    with urllib.request.urlopen(req, timeout=30) as resp:
                        raw = resp.read()
                    break
                except Exception as retry_e:
                    if attempt < 2:
                        print(f"    ⚠️ リトライ ({attempt + 1}/3): {retry_e}")
                        time.sleep(3)
                    else:
                        raise
            feed = feedparser.parse(raw)

            if feed.bozo and not feed.entries:
                print(f"    ⚠️ フィード取得失敗またはエントリなし")
                continue

            # フィードURLからベースURL（スキーム＋ドメイン）を抽出
            from urllib.parse import urlparse
            parsed_feed_url = urlparse(url)
            base_url = f"{parsed_feed_url.scheme}://{parsed_feed_url.netloc}"

            for entry in feed.entries[:10]:  # 最新10件をチェック
                title = entry.get("title", "").strip()
                link = entry.get("link", "").strip()

                if not title or not link:
                    continue

                # 相対URLをベースURLで補完
                if link.startswith("/"):
                    link = base_url + link

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

                # 採用・求人系タイトルを除外
                EXCLUDE_TITLE_KEYWORDS = [
                    "職員募集", "採用", "求人", "職員を募集", "研修生募集", "インターン",
                    "説明会", "業務説明会", "採用情報", "任期付職員",
                ]
                if any(kw in title for kw in EXCLUDE_TITLE_KEYWORDS):
                    print(f"    ⏭️ スキップ（採用・求人関連）: {title[:40]}")
                    processed.add(item_id)
                    continue

                # FP関連キーワードフィルタリング
                search_text = title + " " + description
                if not any(kw in search_text for kw in FP_KEYWORDS):
                    print(f"    ⏭️ スキップ（FP関連キーワードなし）: {title[:40]}")
                    processed.add(item_id)
                    continue

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


def should_generate_article(item: dict, client: anthropic.Anthropic) -> bool:
    """記事化する価値があるかをClaudeに判断させる"""

    prompt = f"""あなたは「FPのひとりごと」というブログの編集者です。
以下のニュース情報をブログ記事として取り上げるべきか判断してください。

【情報源】{item['source']}
【タイトル】{item['title']}
【概要】{item['description'][:300]}

以下の基準で判断してください：
- 読者（FP資格勉強中・資産形成に関心のある一般人）にとって有益か
- 具体的な数字・制度変更・実生活への影響が含まれるか
- 採用・求人・イベント告知のみの内容ではないか
- 統計データでも「家計・資産形成・老後・保険・税金」に関連するものは記事化を検討する
- 読者が「知ってよかった」と感じる情報か

「記事化する」か「スキップ」のどちらかを最初に答え、その後1行で理由を書いてください。
例：記事化する／老後資金に直結する年金改定の内容で読者の関心が高い
例：スキップ／業界内部向けの告知で一般読者への実用情報がない"""

    try:
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=100,
            messages=[{"role": "user", "content": prompt}],
        )
        answer = message.content[0].text.strip()
        print(f"    🤖 判断: {answer[:80]}")
        return answer.startswith("記事化する")
    except Exception as e:
        print(f"    ❌ 判断エラー: {e}")
        return True  # エラー時はとりあえず生成する


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
- マークダウンのfrontmatterブロック（---）は含めない。本文だけを出力する
- 文章の途中や段落の先頭に唐突に「ですね。」を挿入しないこと。会話調の語尾は文章の流れに沿って自然に使うこと。
- 記事本文にURLやリンクを含めないこと。参考リンクや出典URLは記載不要。"""

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

    # sourceUrl の検証：空・相対パス・None は frontmatter から除外
    source_url = item.get("link", "")
    source_url_line = ""
    if source_url and source_url.startswith(("http://", "https://")):
        source_url_line = f'sourceUrl: "{source_url}"\n'

    frontmatter = f"""---
title: "{title_escaped}"
pubDate: {date_str}
category: "{item['category']}"
source: "{item['source']}"
{source_url_line}tags: {json.dumps(tags, ensure_ascii=False)}
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

        if not should_generate_article(item, client):
            print(f"    ⏭️ スキップ（価値なしと判断）")
            processed.add(item["id"])
            continue

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
