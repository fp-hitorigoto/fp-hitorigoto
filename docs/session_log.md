# セッションログ — FPのひとりごと プロジェクト

このファイルは、Claudeとのセッションが切れても作業を引き継げるよう、進捗を記録するためのファイルです。
新しいセッションを開始したら、このファイルをClaudeに読み込ませてください。

---

## 最終更新：2026-07-05（セッション17）

### セッション17の作業内容（2026-07-05）
1. FP2級 A〜F全分野の出題範囲を3点セット（公式PDF・fp2-siken.com過去問データ・FP2級Wiki/FPキャンプBlogの実務的切り口）で調査完了
2. 全6Volの曲リスト確定（Vol.1=14曲、Vol.2=14曲、Vol.3=15曲、Vol.4=16曲、Vol.5=14曲、Vol.6=15曲、合計88曲）
3. 歌い手イメージを分野ごとに決定（各Volは「一人のアーティストのアルバム」構成方針）。Vol.1は竹内まりやイメージの女性ボーカルに確定
4. 歌詞の書き方の基準を確立（事実と事実の間を情景・心情でつなぐ、楽曲構成タグを明記、ルビ言葉遊び、英語フレーズ挿入、曲タイトルを付ける等）。Vol.1・1曲目「My Decades, My Choice」完成（Gemini共同制作）
5. Suno用歌詞の数字は必ずひらがな化する（半角数字は英語読みされるため）というルールを確立
6. **FP2級 Vol.1〜6、全6分野の正方形＋16:9ジャケット画像が完成**（深緑×シルバー、字幕位置`TEXT_TOP_Y`はVol.1〜3が770、Vol.4〜6が830で確定）
7. 詳細はメモリ`project_fp2_songs.md`に集約済み

### 次回やること
- Vol.1の6曲目「Full Coverage〜介護保険〜」をSuno生成（歌詞・スタイルは確定済み、記録参照）
- Vol.1の7〜9曲目（確定拠出年金/企業年金、住宅ローン深掘り、教育資金プランニング等）の歌詞制作を継続
- 次回、文節ごとに半角スペースを入れる書き方を試す（「とびらは ひらくから」のように、助詞のWA/E誤読防止のお試し。まだ未実施）
- Vol.2〜6の曲ごとのSunoスタイルプロンプト作成（Vol.1のみ着手）
- Vol.5・Vol.6（3級）のYouTube公開予約は保留中

### Vol.1歌詞制作で確立したノウハウ（詳細は project_fp2_songs.md 参照）
- 歌声はSuperfly風の力強い女性ボーカルで統一、曲ごとにスタイル（ジャンル・BPM・構成）は変える
- 曲の構成パターン化を避ける（イントロの有無、サビの位置、ブリッジの型、アウトロの締め方を毎回変える）
- 短く仕上がった曲はスタイルそのまま歌詞だけ増補して尺を伸ばす
- Suno用歌詞は数字を必ずひらがな化する

---

## 過去のセッション

## 最終更新：2026-07-05（セッション16）

### セッション16の作業内容（2026-07-04〜07-05）
1. Vol.5・Vol.6の動画パイプライン精度改善（`01_whisper_align.py`：単語レベル精密化・隣接セグメント探索・文字数ペナルティ）
2. `02_render_videos.py`の間奏字幕残留バグ修正（空テキストLRC行が末尾以外で無視されていた）
3. Vol.6「相続・事業承継」全12曲をYUI風に全面書き直し・Suno生成・DL・ジャケット作成・DistroKidアップロード・動画生成・タイミング修正まで完了
4. Vol.6 12曲目を「事業承継の手段」→「自社株評価（取引相場のない株式）」に内容差し替え（3級過去問に出題実績なしのため）
5. DistroKidの演奏者・プロデューサー欄をClaudeが自動入力する方針に変更
6. Downloadsフォルダ整理（音楽制作・スタンプ制作・ブログ note素材の3カテゴリ）
7. **FP2級プロジェクト始動**：HINOMARU Study Musicの中で「FP2級 Vol.1〜」として3級とは別番号体系で展開する方針を決定。分野ごとに音楽スタイルを変える方針も3級同様
8. 日本FP協会公式PDF「学科試験、実技試験の細目」からFP2級のA〜F全6分野・節レベルの詳細出題範囲を取得（`https://www.jafp.or.jp/exam/subjects_02/files/saimoku_2fp.pdf`）
9. fp2-siken.comの過去問データからA分野（ライフプランニングと資金計画）の節ごとの出題数を調査（公的年金96問が最多、以下社会保険76問など）
10. **2級シリーズの画像デザイン方針確定**：配色は深緑×シルバー（3級の紺×金と差別化）、歌詞表示エリアは下から約25%（3級と同じ比率）
11. Vol.1「ライフプランニングと資金計画」の正方形・16:9ジャケット画像完成（保存先：`~/Downloads/音楽制作/FP学習ソング/FP学習ソングVol1_2級/`）
12. `02_render_videos.py`に2級用の環境変数を追加：`TEXT_TOP_Y`（字幕上端Y座標をVolごとに指定）・`TEXT_COLOR`（文字色）。3級の動作には影響なし
13. Vol.1の字幕位置を実測テストで確定：`TEXT_TOP_Y=770` / `TEXT_COLOR=210,210,215`

### 次回やること
- Vol.2「リスク管理」の2級用画像作成（正方形→16:9→字幕位置テスト→確定）を同じ流れで進める
- 続いてVol.3〜6の画像も同様に作成
- 画像が一通り揃ったら、A分野の続き（B〜F）の出題頻度調査 → 各Volの曲テーマ・曲数を確定 → 歌詞制作へ
- Vol.5・Vol.6（3級）のYouTube公開予約は保留中（他の動画との兼ね合いを見てから）

---

## 過去のセッション

### セッション15の作業内容（2026-07-02）
1. Vol.5 LRCファイル12曲作成（仮タイムスタンプ）
2. Vol.6「相続・事業承継」歌詞12曲完成（椎名林檎風・12スタイルのアルバム構成）→ Suno制作が次のステップ
3. 動画自動生成パイプライン構築開始（Whisper＋Pillow＋ffmpeg）→ 太字の潰れ修正から再開

## 現在進行中のプロジェクト

### 🎵 FP3級 学習ソングシリーズ（最優先）

#### Vol.1「ライフプランニングと資金計画」
- [x] Sunoで10曲制作
- [x] WAVダウンロード（`~/Downloads/FP学習ソングVol1/`）
- [x] ジャケット画像作成（新版：`歌で覚えるFP3級_Vol1_ライフプランニング.jpg`）
- [x] DistroKidアップロード完了（HINOMARU名義）
- [ ] DistroKidのジャケットを新版に差し替え（言語エラーで保留中）
  - ⚠️ エラー内容：言語がJapaneseなのにトラック名に英語（Who are you?等）が含まれる
  - → 一旦保留。Vol.2・3完了後に再挑戦
- [x] YouTube動画制作（CapCut・Mac）全10曲完了
- [x] YouTube投稿 全10曲完了（HINOMARUチャンネル）
- [x] X投稿 Day1完了（2026-06-07）

#### Vol.2「リスク管理」
- [x] Sunoで10曲制作
- [x] WAVダウンロード（`~/Downloads/FP学習ソングVol2/`）
- [x] ジャケット画像作成（`歌で覚えるFP3級_Vol2_リスク管理.jpg`・3000×3000px）
- [x] DistroKidアップロード完了（2026-06-05）
- [x] YouTube動画制作 全10曲完了（2026-06-07）
  - 保存先：`~/Downloads/FP学習ソングVol2/YouTube/`
  - 背景画像：`歌で覚えるFP3級_Vol2_リスク管理_v2.png`（CapCut用横型）
  - ファイル名形式：`曲名_横型.mp4`
- [x] YouTube投稿 全10曲完了（2026-06-09）/ HINOMARUチャンネル
  - 再生リスト：歌で覚えるFP3級 Vol.2 リスク管理 — HINOMARU

#### CALM HOURS「Sunday Coffee Sessions」
- [x] Series Bible保存：`~/Downloads/CalmHoursBGM/Sunday_Coffee_Sessions_series_bible.md`
- [x] WAV全10曲DL・整理済み：`~/Downloads/CalmHoursBGM/Sunday Coffee Sessions/`
- [x] ジャケット画像作成（ChatGPT生成・3000×3000px）
  - `SundayCoffeeSessions_cover_text_sq.png`（DistroKid用・テキストあり）
  - `SundayCoffeeSessions_cover_notxt.png`（テキストなし）
  - `SundayCoffeeSessions_YouTube.png`（横長16:9）
- [x] DistroKidアップロード完了（2026-06-08）/ HINOMARU名義
- [x] YouTube動画制作（MP4・ffmpeg生成）全10曲完了
  - 保存先：`~/Downloads/CalmHoursBGM/Sunday Coffee Sessions/YouTube/`
- [x] YouTube投稿 全10曲完了（2026-06-09）/ Calm Hoursチャンネル
  - 再生リスト：Sunday Coffee Sessions — CALM HOURS

#### Vol.3「金融資産運用」
- [x] 歌詞制作（全10曲）完了（2026-06-07）
- [x] Sunoで10曲制作（2026-06-07）
- [x] WAVダウンロード（`~/Downloads/FP学習ソングVol3/`）
- [x] ジャケット画像作成（正方形3000×3000px＋横長16:9版）
  - `歌で覚えるFP3級_Vol3_金融資産運用.jpg`（3000×3000px）
  - `歌で覚えるFP3級_Vol3_金融資産運用_16x9.png`（1920×1080px・CapCut用）
- [x] DistroKidアップロード完了（2026-06-07）
- [x] LRCファイル作成（全10曲）→ `~/Downloads/FP3_Vol3_LRC/`
- [x] YouTube動画制作：全10曲 CapCut完了（2026-06-13）
- [x] YouTube投稿：1曲目 2026-06-13投稿済み
- [x] YouTube予約：2曲目 6/18・3曲目 6/21
- [ ] YouTube予約：4〜10曲目（順次設定）
- 公開スケジュール：水・土 17:00（週2本）

#### CALM HOURS「Rainy Window Sessions」
- [x] Series Bible保存：`~/Downloads/CalmHoursBGM/Rainy Window Sessions/Rainy_Window_Sessions_series_bible.md`
- [x] WAV全20曲DL・整理済み：`~/Downloads/CalmHoursBGM/Rainy Window Sessions/`
- [x] ジャケット画像作成（Gemini生成・3000×3000px）
  - `RainyWindowSessions_cover_base.png`（ベース画像）
  - `RainyWindowSessions_cover.png`（テキスト入り・DistroKid用）
- [x] DistroKidアップロード完了（2026-06-11）/ HINOMARU名義
- [ ] YouTube動画制作
- [ ] YouTube投稿

#### CALM HOURS「Ocean Breeze Sessions」
- [x] Series Bible保存：`~/Downloads/CalmHoursBGM/Ocean Breeze Sessions/Ocean_Breeze_Sessions_series_bible.md`
- [x] WAV全20曲DL・整理済み：`~/Downloads/CalmHoursBGM/Ocean Breeze Sessions/`
- [x] ジャケット画像作成（Gemini生成＋Pillow加工・3000×3000px）
  - ベース：`OceanBreezeSessions_cover_base.jpeg`
  - 完成：`OceanBreezeSessions_cover.png`（Baskerville・DistroKid用）
- [x] DistroKidアップロード完了（2026-06-14）/ HINOMARU名義 / 20曲
- [x] YouTube投稿：Full（42分）2026-06-13投稿済み（Calm Hoursチャンネル）
- [ ] YouTube投稿：5時間版（来夏2027年予定）
- [ ] YouTube投稿：8時間版（来夏2027年予定）
- [ ] YouTube投稿：個別20曲（平日夜・順次）

#### Vol.4「タックスプランニング」
- [x] 歌詞制作（全12曲）完了
- [x] Sunoで12曲制作完了
- [x] WAVダウンロード → `~/Downloads/FP学習ソングVol4/WAV/`
- [x] ジャケット画像作成（ChatGPT生成・3000×3000px）`歌で覚えるFP3級_Vol4_タックスプランニング.png`
- [x] DistroKidアップロード完了（2026-06-13）/ HINOMARU名義
- [x] YouTube動画制作（CapCut）全12曲完了
- [x] YouTube公開予約設定完了（8/22〜9/30・週2本・水土17:00）
- [x] 再生リスト作成：`歌で覚えるFP3級 Vol.4 タックスプランニング — HINOMARU Study Music`
- ⚠️ 169万・207万の壁は暫定数字（要後日確認・歌詞修正）
- ⚠️ YouTube動画末尾に免責テロップ必須
  「※本動画の数字は制作時点の情報です／最新の税制は国税庁HPでご確認ください」
- 歌詞保存先：`~/.claude/projects/-Users-ohatamasanori-fp-hitorigoto/memory/fp_songs.md`（## ④タックスプランニング）

#### TikTok展開
- [x] TikTok用縦型画像作成（Gemini生成）：`FP3級_TikTok_Vol2_リスク管理.png`
- [x] CapCutで縦型動画試作（強制か任意か・9:16）
- [ ] TikTokアカウント作成（スマホアプリから）
- [ ] TikTok動画投稿

#### Vol.4「タックスプランニング」
- [x] 歌詞制作（全12曲）完了（2026-06-13）
- [ ] Sunoで12曲制作
- [ ] WAVダウンロード
- [ ] ジャケット画像作成
- [ ] DistroKidアップロード
- [ ] YouTube動画制作
- [ ] YouTube投稿

#### CALM HOURS「Evening Lights Diary」
- [x] Series Bible・全歌詞（11曲）保存済み（memory/project_evening_lights_diary.md）
- [x] WAV全11曲DL・整理済み：`~/Downloads/CalmHoursBGM/Evening Lights Diary/`
  - ファイル名：`01_Dinner_in_the_Air.wav` 〜 `11_Today_Wasnt_Bad_at_All.wav`
- [x] ジャケット画像作成（ChatGPT生成）
  - `Evening Lights Diary_cover.png`（DistroKid用・テキスト入り）
  - `Evening Lights Diary_cover.base16-9.png`（YouTube用16:9）
- [x] DistroKidアップロード完了（2026-06-17）/ HINOMARU名義 / 11曲 / ジャンル：Vocal
- [x] Full Mix WAV作成（473MB）
- [x] Full Mix mp4作成（194MB）
- [x] シングル11曲 mp4作成（YouTube/フォルダ）
- [x] Full Mix YouTube公開済み（2026-06-18）
- [x] シングル11曲 YouTube予約済み（6/21〜7/25・水土17:00）

#### CALM HOURS「Tiny Reasons to Smile」
- [x] Series Bible・全歌詞保存済み（memory/）
- [x] WAV全10曲DL・整理済み：`~/Downloads/CalmHoursBGM/Tiny Reasons to Smile/`
- [x] ジャケット画像作成（ChatGPT生成・2026-06-14）
  - `TinyReasonsToSmile_cover_base.png`（テキストなし）
  - `TinyReasonsToSmile_cover.png`（テキスト入り・DistroKid用）
- [x] DistroKidアップロード完了（2026-06-14）/ HINOMARU名義 / 10曲 / ジャンル：ヴォーカル
- [ ] YouTube用16:9画像作成（後日・ChatGPTに依頼）
- [ ] YouTube動画制作・投稿

#### CALM HOURS YouTube アップロード済み一覧（2026-06-21確認・随時更新）

| 動画 | 種別 | 状況 |
|-----|------|------|
| Lo-fi Cafe Sessions — 5 Hours | 長尺 | ✅公開済 |
| Lo-fi Cafe Sessions — 8 Hours | 長尺 | ✅公開済 |
| Rainy Cafe Sessions — 5 Hours | 長尺 | ✅公開済（著作権フラグあり） |
| Rainy Cafe Sessions — 8 Hours | 長尺 | ✅公開済（著作権フラグあり） |
| Acoustic Cafe Sessions — 5 Hours | 長尺 | ✅公開済 |
| Acoustic Cafe Sessions — 8 Hours | 長尺 | ✅公開済 |
| Ocean Breeze Sessions — Full Album | Full | ✅公開済（2026/06/13） |
| Evening Lights Diary — Full Album | Full | ✅公開済（2026/06/18） |
| Sunday Coffee Sessions — 全10曲シングル | シングル | ✅全曲公開済（2026/06/09） |
| Evening Lights Diary — Dinner in the Air | シングル | ✅公開予約済（2026/06/21） |
| Evening Lights Diary — Grandma's Shoes | シングル | ✅公開予約済（2026/06/24） |
| Evening Lights Diary — The Flowers Were Always There | シングル | ✅公開予約済（2026/06/27） |
| Evening Lights Diary — Just Before the Rain | シングル | ✅公開予約済（2026/07/01） |
| Evening Lights Diary — Full Moon Tonight | シングル | ✅公開予約済（2026/07/04） |
| Evening Lights Diary — The Cashier Remembered Me | シングル | ✅公開予約済（2026/07/08） |
| Evening Lights Diary — The Long Way Home | シングル | ✅公開予約済（2026/07/11） |
| Evening Lights Diary — Stars Above Maple Street | シングル | ✅公開予約済（2026/07/15） |
| Evening Lights Diary — From My Hometown Too | シングル | ✅公開予約済（2026/07/18） |
| Evening Lights Diary — Apartment Lights | シングル | ✅公開予約済（2026/07/22） |
| Evening Lights Diary — Today Wasn't Bad at All | シングル | ✅公開予約済（2026/07/25） |
| Ocean Breeze Sessions — 5 Hours | 長尺 | ✅公開予約済（2026/07/29） |
| Ocean Breeze Sessions — 8 Hours | 長尺 | ✅公開予約済（2026/08/01） |
| Postcards From September — Full Album | Full | ✅公開予約済（2026/08/05） |
| Postcards From September — Track 01 The First Cool Morning | シングル | ✅公開予約済（2026/08/08） |
| Postcards From September — Track 02 One Light Earlier | シングル | ✅公開予約済（2026/08/12） |
| Postcards From September — Track 03 The Last Iced Coffee | シングル | ✅公開予約済（2026/08/15） |
| Postcards From September — Track 04 September Porch | シングル | ✅公開予約済（2026/08/19） |
| Postcards From September — Track 05 The Sweater on the Chair | シングル | ✅公開予約済（2026/08/22） |
| Postcards From September — Track 06 Backyard Fireflies | シングル | ✅公開予約済（2026/08/26） |
| Postcards From September — Track 07 Library Card | シングル | ✅公開予約済（2026/08/29） |
| Postcards From September — Track 08 Windows Open | シングル | ✅公開予約済（2026/09/02） |
| Postcards From September — Track 09 Golden Hour Comes Sooner | シングル | ✅公開予約済（2026/09/05） |
| Postcards From September — Track 10 See You, Summer | シングル | ✅公開予約済（2026/09/09） |

**未投稿・未作成の長尺動画：**

| アルバム | Full mp4 | 5時間 | 8時間 |
|---------|---------|-------|-------|
| Sunday Coffee Sessions | ❌未投稿 | ❌未投稿 | 🔧作成中（2026/06/21） |
| Midnight Library Sessions | ❌未投稿 | ❌未投稿 | ❌未投稿 |
| Morning Garden Sessions | ❌未投稿 | 🔧作成中（2026/06/21） | ❌未投稿 |
| Rainy Window Sessions | ❌未投稿 | ❌未投稿 | ❌未投稿 |

**シングル未投稿アルバム（週2本・水土17:00で予約予定）：**
| アルバム | 曲数 |
|---------|------|
| Evening Lights Diary | 11曲 |
| Ocean Breeze Sessions | 20曲 |
| Rainy Window Sessions | 20曲 |
| Tiny Reasons to Smile | 10曲 |
| 合計 | 61曲（約30週・半年分） |

**投稿スケジュール方針：**
- 週2本（水・土 17:00）固定
- Full Mixは各アルバム初週に即公開（予約枠とは別）
- Evening Lights Diaryから開始

#### CALM HOURS 長尺動画（mp4）作成状況

| アルバム | Full mp4 | 5時間 | 8時間 | 16:9画像 |
|---|---|---|---|---|
| Lo-fi Cafe Sessions | ✅YouTube済 | ✅YouTube済 | ✅YouTube済 | ❌要作成 |
| Rainy Cafe Sessions | ✅YouTube済 | ✅YouTube済⚠️著作権 | ✅YouTube済⚠️著作権 | ✅Thumbnail.jpg |
| Acoustic Cafe Sessions | ✅YouTube済 | ✅YouTube済 | ✅YouTube済 | ✅Thumbnail.jpg |
| Midnight Library Sessions | ✅YouTube済 | ✅YouTube済 | ✅YouTube済 | ❌要作成 |
| Morning Garden Sessions | ✅YouTube済 | ❌要作成 | ✅YouTube済 | ❌要作成 |
| Ocean Breeze Sessions | ✅YouTube済 | ❌要作成 | ❌要作成 | ❌要作成 |
| Rainy Window Sessions | ✅YouTube済 | ❌要作成（破損） | ❌要作成（破損） | ❌要作成 |
| Sunday Coffee Sessions | ❌要作成 | ❌要作成 | ❌要作成 | ✅SundayCoffeeSessions_YouTube.png |
| Tiny Reasons to Smile | ❌要作成 | 不要（歌詞あり） | 不要（歌詞あり） | ❌要作成 |
| Evening Lights Diary | ❌要作成 | 不要（歌詞あり） | 不要（歌詞あり） | ✅base16-9.png |

**次回手順：**
1. ChatGPTで16:9画像を作成（Lo-fi・Midnight Library・Morning Garden・Ocean Breeze・Rainy Window・Tiny Reasons to Smile）
2. ffmpegでmp4作成（Full・5時間・8時間）
3. YouTubeにアップロード

#### CALM HOURS「October Window Lights」（＝旧セッションで動画生成済み・YouTube未投稿）
- [x] Series Bible完成：`~/Downloads/CalmHoursBGM/October Window Lights/october_window_lights_master.md`
- [x] Suno制作完了（全10曲）
- [x] 全曲WAVダウンロード・整理済み（~/Downloads/CalmHoursBGM/October Window Lights/）
- [x] ジャケット画像作成（ChatGPT生成）
  - `october_window_lights_cover.png`（DistroKid用・1:1）
  - `october_window_lights_youtube.png`（YouTube用・16:9）
- [x] DistroKidアップロード完了（2026-06-26）/ HINOMARU名義 / 10曲 / ジャンル：ヴォーカル（Vocal）
  - AI申告：歌詞・作曲・音声すべてAI / HINOMARUは「AIペルソナ」/ 全曲に適用
  - ⚠️ 今回は手動アップロード（Playwrightが不安定だったため）
- [x] Full Mix WAV・mp4作成済み（~/Downloads/CalmHoursBGM/October Window Lights/YouTube/）
- [x] シングル10曲 mp4作成済み
- [ ] YouTube投稿（Full Mix・シングル10曲）
- [ ] ループ動画作成（Kling CLI使用予定）
- コンセプト：10月の静かな日常の美しさ / 1曲目〜10曲目で「夕方→帰宅」の一日を描く
- Calm Hoursシリーズ第4弾（ボーカルあり）

#### CALM HOURS「Postcards From September」
- [x] Series Bible完成
- [x] Suno制作完了（全10曲）
- [x] 全曲WAVダウンロード・整理済み（~/Downloads/CalmHoursBGM/Postcards From September/）
- [x] ジャケット画像作成（正方形・16:9・~/Downloads/CalmHoursBGM/Postcards From September/）
- [x] DistroKidアップロード完了（2026-06-21）/ HINOMARU名義 / 10曲 / ジャンル：Vocal
- [x] Full Mix WAV作成（383MB）
- [x] Full Mix mp4作成（166MB）
- [x] シングル10曲 mp4作成（YouTube/フォルダ）
- [ ] 歌詞作成（全10曲）
- [ ] YouTube動画・投稿（2026年9月目標）

#### Vol.5「不動産」
- [x] 歌詞制作（全12曲）完了（2026-06-21）
- [x] Sunoで12曲制作完了（2026-06-27）
- [x] WAVダウンロード → `~/Downloads/FP学習ソング/FP学習ソングVol5/WAV/`
- [x] ジャケット画像作成（ChatGPT生成）`歌で覚えるFP3級_Vol5_不動産.png` / `歌で覚えるFP3級_Vol5_不動産_16x9.png`
- [x] DistroKidアップロード完了（2026-06-27）/ HINOMARU名義
- [x] LRCファイル作成（全12曲・仮タイムスタンプ）→ `~/Downloads/FP学習ソング/FP学習ソングVol5/LRC/`
- [ ] YouTube動画制作（⚠️ 動画自動生成パイプライン構築中 — 下記参照）
- [ ] YouTube投稿
- スタイル：K-pop男性グループ・力強い語尾（〜だ・〜ぞ・〜覚えろ）・曲ごとに異なるスタイル・116〜128BPM
- 歌詞保存先：`~/.claude/projects/-Users-ohatamasanori-fp-hitorigoto/memory/fp_songs.md`（## ⑤不動産）

#### 🔧 動画自動生成パイプライン（2026-07-02構築中・CapCut作業の置き換え）

**仕組み**: Whisperで歌唱タイミング自動取得 → Pillowで字幕入りフレーム合成 → ffmpeg concatで動画化
- 環境確認済み：openai-whisper（Python 3.9・medium モデルDL済み）/ ffmpeg 8.1.1（⚠️ libassなし→Pillow方式で回避）
- テスト動画：`~/Downloads/FP学習ソング/FP学習ソングVol5/test_登記は誰のため_自動生成v2.mp4`
- スクリプト：スクラッチパッドの `render_test3.py`（次回セッションでは残っていない可能性→この仕様から再作成）

**確定した仕様（Vol.4動画の実測値）**:
- フォント：CapCutの「Noto Sans」の実体は `/Applications/CapCut.app/Contents/Resources/Font/SystemFont/ja.ttf`（源ノ角ゴシック JP Medium＝Noto Sans CJK同一デザイン）
- 文字サイズ：84px（1080pで文字高83px＝CapCutの8pt相当）
- 文字色：RGB(239,196,14)（Vol.4動画から実測）
- 位置：Vol.4は紺帯の中央やや上（画面高81.8%）/ Vol.5は全面画像のため画面高86%に配置
- Whisperのコツ：1回で全行取れない→設定を変えて2回実行しマージ、欠落行は前後から補間。誤認識は無視（タイミングだけ使い正しい歌詞に差し替え）

**📖 運用マニュアル: `~/Downloads/FP学習ソング/scripts/README.md`**
（どのモデルでも同じ対応ができるよう、修正手順・既知の問題・スタイル定数の由来まで記載。
動画関連の作業前に必ず読むこと）

**本番スクリプト（2026-07-03完成）**: `~/Downloads/FP学習ソング/scripts/`
- `01_whisper_align.py <Volフォルダ> [曲名]` … WAV＋LRC(歌詞)→Whisper 3パス解析→`LRC_auto/*.lrc`（実測タイムスタンプ入り）＋`_align_report.txt`（実測/補間の行別レポート）
  - 3パス：①通常 ②word_timestamps＋prompt ③声帯域強調音声（イントロのボーカル埋もれ対策）
  - 順序制約DPで誤認識だらけでも正しい歌詞行にマッチ。単語タイムスタンプで長セグメントを精密化
- `02_render_videos.py <Volフォルダ> <背景画像> [曲名]` … LRC_auto→`YouTube_auto/*.mp4`（1080p）
- 修正ワークフロー：LRC_autoのLRCを直接編集（歌詞・半角全角・タイミング）→ 02を曲名指定で再実行（2〜3分/曲）
- ストローク幅はsw=1で確定（Vol.4実物と比較検証済み。sw=3は文字が潰れる）

**冒頭タイミングのズレを修正（2026-07-03）**: 「登記は誰のため？」冒頭0〜17秒が早く表示される不具合を修正。
原因はWhisperがイントロの掛け声（Yeah!/Woo!/タタラタタラタ等の囃し）に反応し歌唱開始時刻を誤検出していたため。
対策：mediumモデル→**large-v3-turboモデル**に変更（`01_whisper_align.py`のデフォルト・`WHISPER_MODEL`環境変数で変更可）。
turboは囃し声を英語として認識し歌詞本文と誤マッチしなくなるため、全曲で再解析不要になった。
1曲目の冒頭8行は単語レベルタイムスタンプでさらに精密化（8.62/12.34/15.54/19.16/22.80/26.34/29.96/33.50秒）。
→ **📖 README.mdの「既知の問題と対処」に記録済み。同じ症状が出たら同じ対処でよい。**

**Vol.5 全12曲レンダリング完了（2026-07-03・免責テロップ入り・turboタイムスタンプ版）** → `FP学習ソングVol5/YouTube_auto/*.mp4`
- 免責テロップ：全曲末尾3.5秒・52px（5pt相当）・全角ＨＰ・行間2倍
  - 税金の曲（持つだけ/短期か長期か/３０００万）→「最新の税制は国税庁ＨＰで〜」
  - その他の曲 →「最新の制度は公的機関のＨＰで〜」
  - アウトロが3.5秒未満の曲（接道・買う前に）は動画末尾を無音延長
- 折り返し改良済み：行頭に「・」が来ない（中黒・句読点の直後で折る）
- 1曲目「登記は誰のため？」冒頭6行は手動補正済み（Whisperがイントロを取れなかったため）
- ⚠️ しゅうぞうさん確認時の重点チェック（補間行＝タイミング推定値）：
  - 持つだけでかかる税：冒頭2行（0:04/0:08）※イントロ埋もれパターン
  - 定期か、普通か：「一般定期借地権　５０年以上」（0:51）
  - １３種類の地図：「住居・商業・工業」（0:50）
- 修正手順：`LRC_auto/曲名.lrc` を編集 → `python3 02_render_videos.py <Vol> <画像> 曲名の一部` で再生成

**しゅうぞうさん12曲確認（2026-07-04）→ 9曲・31箇所を精密修正**
- 手法：問題9曲をWhisper large-v3-turboの`word_timestamps=True`で全曲再解析 → 誤認識込みの単語列から該当語句を検索し、正確な秒数を特定（フィードバックの「早い/遅い」に頼らず実測値で修正）
- 「４つの物差し」「マンションのルール」「買う前に知れ」の3曲は確認OKで無修正
- 修正内容の詳細は各LRC_autoファイル参照。傾向として、専門用語の直前で0.5〜3.9秒のズレが集中（Whisperが漢字を誤認識しても音の長さは概ね正確なので、単語レベル解析が有効）
- 「短期か、長期か」で字幕テキストの誤り修正：「１月１日現在で判断する」→「１月１日現在で判断」（実際の歌唱に合わせる）
- 「建物の限界」「借りる側の盾」：イントロの掛け声区間に歌詞が出ていた問題 → 実測の歌い出し時刻（7.78秒/9.16秒）に修正
- 9曲を`02_render_videos.py`で再レンダリング済み → **要・再確認**

**追加の歌詞修正（2026-07-04）**:
- １３種類の地図：ラスト「都市計画法　完璧に制せ」→「制せよ」（実際の歌唱に合わせて字幕修正・再レンダリング済み）

**Vol.5 全12曲、しゅうぞうさん確認OK・アップロード可能（2026-07-04）**

**パイプライン精度改善（2026-07-04・重要）**: Vol.5で「少し早い/遅い」が9曲31箇所も出た反省を踏まえ、
`01_whisper_align.py`のアルゴリズム自体を改修。今後は同じ規模の手動修正が出ないはず。
詳細は`scripts/README.md`の「2026-07-04の精度改善」を参照。要点：
1. 全実行でword_timestamps=True化（以前はrun1が非対応だった）
2. セグメント長に関わらず常に単語レベル精密化（以前は7秒超のみ）
3. word_windowに前後の隣接セグメントも渡す（DPが隣のセグメントを丸ごとスキップする問題に対応）
4. 文字数不足のペナルティを追加（誤字だらけの専門用語で短い部分文字列が誤って高スコアになる問題に対応）
→ 検証：「建物の限界」で手動実測値との差が1〜3.9秒→0.02〜0.14秒に改善

**残タスク**:
1. YouTube投稿・公開予約・再生リスト作成

#### HINOMARU チャンネル リブランディング（2026-06-28完了）
- [x] チャンネル名：`HINOMARU` → `HINOMARU Study Music`
- [x] ハンドル：`@hinomaru_music` → `@hinomaru_study`
- [x] アイコン：夜景 → 音符＋本＋鉛筆（ネイビー×ゴールド）
- [x] バナー：夜景 → HINOMARU Study Music ロゴ入りバナー
- ファイル保存先：`~/Downloads/hinomaru_study_music_icon.png` / `hinomaru_study_music_banner.png`
- [x] 日本語学習ソング10曲 公開予約設定完了（7/18〜8/19・週2本・水土17:00）
- [x] 再生リスト作成：`Japanese Learning Songs — HINOMARU Study Music`（10曲・公開・古い順）

#### Vol.6「相続・事業承継」— 全12曲 歌詞・スタイル確定（2026-07-04）
- [x] 歌詞制作（全12曲）完了
- [x] **方針転換**：当初の椎名林檎風（詩的・多義的）は「学習ソングとして聞き取りにくい」「Sunoに個性が伝わりすぎる」との判断で撤回 → **YUI風**（口語体・断定口調・J-rock/J-pop）に全面書き直し
  - 曲順の設計方針：「隣接曲は対比、ただし機械的な交互パターンにはしない」（1曲目と6曲目が似るのは可、1・2曲目が似るのはNGという緩い基準）
  - CapCut用歌詞のスペース表記ルールを確立（詰める＝一続きの文、残す＝句点で切れる文・列挙・倒置・逆接の間）
  - 数字はCapCut用のみ算用数字＋「円」表記、Suno用ひらがなの読みはそのまま
- [x] 全12曲 Suno生成完了（2026-07-04）
- [x] WAVダウンロード・整理完了 → `~/Downloads/FP学習ソング/FP学習ソングVol6/WAV/`
- [x] ジャケット画像作成完了（ChatGPT生成・正方形＋16:9）→ `歌で覚えるFP3級_Vol6_相続事業承継.png` / `_16x9.png`
  - モチーフ：遺言書（封蝋・リボン）・家系図（祖父母→父母→長男次男長女）・実印と朱肉・金庫・アンティークキー
- [x] DistroKidアップロード完了（2026-07-04）/ HINOMARU名義 / 12曲 / ジャンル：J-POP
  - Claude in Chrome拡張機能でフォーム入力・全曲アップロードを実施
  - 演奏者・プロデューサー情報も2026-07-04からClaudeが自動入力する方針に変更（詳細は下記ルール参照）
- [x] YouTube動画制作完了（2026-07-04）→ `FP学習ソングVol6/YouTube_auto/*.mp4`（全12曲）
  - ⚠️ フォルダパス変更：`~/Downloads/FP学習ソング/` → `~/Downloads/音楽制作/FP学習ソング/`（Downloads整理のため）
  - Whisper large-v3-turbo解析：12曲中11曲が全行実測（補間0）、1曲のみ1行補間。改良版アルゴリズムが機能
  - 免責テロップ：`02_render_videos.py`に`DISCLAIMER_MODE`環境変数を追加し、`DISCLAIMER_MODE=single`でVol.6統一メッセージに切替可能にした（Vol.5はデフォルトのtax_split方式のまま動作）
  - しゅうぞうさん確認済み・6箇所修正→OK（下記参照）
- **パイプラインの重要バグ修正（2026-07-04）**：`02_render_videos.py`で「曲の途中に間奏があり、その間だけ字幕を消したい」場合、空テキストのLRC行を挿入しても無視される不具合があった。
  - 原因：`lyric_events = [e for e in events if e[1]]` が空テキストを一律除外し、末尾の終了マーカーとしてしか使えない実装だった
  - 症状：「兄弟の子も代わりになれるんだ」（誰が継ぐ？）が次の歌詞まで24秒、間奏中もずっと表示され続けていた
  - 修正：末尾の空行だけ特別扱い（終了マーカー）にし、途中の空行は「字幕を一旦消す」マーカーとして機能するよう`render_song()`を書き換え。**今後、間奏がある曲はLRC_autoに空行を挿入すれば消灯できる**
  - 実際に間奏があった2曲を確認・修正：「誰が継ぐ？」（93.86〜117.76秒、24秒）「誰がいくら？」（79.8〜89.1秒、9.3秒）。「贈与の特例」の大きい間隔は1フレーズが長いだけで間奏ではなかった
- Vol.6タイミング修正6箇所（実測値ベース）：
  - 最低限の権利：「もらえるのは配偶者・子・親」34.86→37.80秒
  - 誰が継ぐ？：「もし子どもが先に死んでたら」72.84→75.20秒、「兄弟の子も〜」後に間奏の空白マーカー追加
  - 誰がいくら？：「もらえる分は半分になるんだ」後に間奏の空白マーカー追加
  - 贈与の特例：「30歳未満の子や孫へ〜」68.46→69.70秒、「使い残したら〜」104.42→101.60秒
- [x] しゅうぞうさん全12曲最終確認OK（2026-07-04）
- [ ] YouTube投稿・公開予約 → **保留（2026-07-04）**：Vol.5もまだYouTube投稿されていないため、Vol.5・Vol.6をまとめて考える。他のCALM HOURS等の動画も投稿したくなる可能性があるとのことで、スケジュールは後日決定
  - 参考計算：水土17:00・週2本で続けるなら Vol.5=10/3〜11/11、Vol.6=11/14〜12/23（Vol.4が8/22〜9/30で終わる前提）
- **免責テロップ（Vol.6は1パターンのみ・全曲共通）**：
  ```
  ※本動画の内容は制作時点の情報です
  最新の法律・税制は関係機関のＨＰでご確認ください
  ```
  Vol.4-5は税制/制度の2パターン分岐だったが、Vol.6は相続分野で法律・税制が混在するため統一文言に変更
- **歌詞・スタイル全文の保存先**：`~/.claude/projects/-Users-ohatamasanori-fp-hitorigoto/memory/fp_songs.md`（## ⑥相続・事業承継、YUI版に完全上書き済み。椎名林檎版は残っていない）
- 曲順：①法定相続人②法定相続分③承認と放棄④遺言3種類⑤遺留分⑥基礎控除⑦相続税計算⑧配偶者特権⑨暦年贈与⑩精算課税⑪贈与特例⑫自社株評価
- ⚠️ 12曲目は2026-07-04に内容変更：「事業承継の手段（親族内承継・M&A・事業承継税制）」→「自社株評価の3方式（配当還元・類似業種比準・純資産価額）」に差し替え。過去問検索（fp3-siken.com）で3級の実出題実績を確認した上での変更。新タイトル「いくらで継ぐ？〜自社株評価の3つの方式〜」
- BPM/ムード一覧：①132明るい②100穏やか③116緊張感④92温かい⑤120力強い⑥128キャッチー⑦110クール⑧78バラード⑨120軽快⑩98ミステリアス⑪114希望⑫140フィナーレ

---

## 免責テロップ（全Vol共通・動画末尾に追加）
```
※本動画の数字は制作時点の情報です
最新の税制は国税庁HPでご確認ください
```
特に税制・控除額・社会保険の数字が含まれる曲は必須。CapCut作業時に末尾へ追加する。

---

## YouTube動画制作の方針（確定）

- ツール：CapCut（MacBook Air）
- 背景画像：各Volのジャケット画像（共通1枚）を流用
- テロップ：LRCファイルをインポート（Add captions → Import file）
- フォント：Noto Sans／色：ゴールド（#FFD700系）
- 解像度：1080P / H.264 / mp4 / 30fps

### CapCut作業手順（確定）
1. 新規プロジェクト作成
2. ジャケット画像＋WAVをインポートしタイムラインに追加
3. 画像クリップを音楽と同じ長さに伸ばす
4. Captions → Add captions → Import file → LRCファイルを選択
5. タイミング・テキストを微調整
6. フォント・色を設定（Apply to allにチェック）
7. Export → mp4 / 1080P

### LRCファイル生成方法
- CapCutのdraft_info.jsonからタイミングを自動取得してLRC生成
- 場所：`~/Movies/CapCut/User Data/Projects/com.lveditor.draft/[プロジェクト名]/draft_info.json`

### 完成済み動画
- `Who_are_you_年金の3つの顔_横型.mp4` ✅ → HINOMARUチャンネルに投稿済み
  - URL：https://youtu.be/Lo_7r9avu2M
  - 形式：横型16:9 / 1080P / mp4
  - 背景画像：`歌で覚えるFP3級_Vol1_YouTube.png`（16:9専用）
  - 字幕：LRCファイルインポート・ゴールド色・Noto Sansフォント

### YouTubeチャンネル
- チャンネル名：HINOMARU
- ハンドル：@hinomaru_music
- URL：https://www.youtube.com/channel/UCJaXEOtd9OTSxhg69PyFiTw
- アイコン：東京夜景×女性シルエット（Sunoプロフィール画像と統一）
- バナー：東京夜景×レトロカー×女性（横長）
- チャンネル説明：日本語＋英語で設定済み
- **チャンネル説明・バナーは定期的に更新する（新シリーズ追加時など）**

### 次のステップ
- 残り9曲のLRCファイル作成＋CapCut動画制作
- チャンネルアート・アイコン設定
- TikTok展開（後日）

---

## DistroKid登録情報

- アーティスト名：HINOMARU
- ソングライター：名 HIROMI / 姓 OHATA
- ジャンル：J-Pop
- 言語：Japanese
- AI申告：The lyrics / The music / All of the audio すべてチェック
- 有料オプションはすべてスキップ

---

## セッションが切れたときの引き継ぎ手順

1. 新しいセッションを開始
2. Claudeに以下を伝える：
   ```
   FP学習ソングの続きをお願いします。
   /Users/ohatamasanori/fp-hitorigoto/docs/session_log.md を読んでください。
   ```
3. チェックリストの未完了タスクから再開

---

## Kling AI CLI 操作メモ（2026-06-27確定）

### セットアップ状況
- Kling CLIインストール済み：`npm i -g @klingai/cli-global`
- ログイン済み：`~/.kling/.credentials`にトークン保存
- MCP（Claude Code連携）は認証が通らず断念 → **CLI（Bashコマンド）で代替**
- 残クレジット：504（2026-06-27現在）

### 動画生成コマンド（確定版）
```bash
# 画像アップロード
kling file_upload ~/path/to/image.png

# 動画生成（ループ用・クレジット節約設定）
kling image_to_video \
  --image "アップロード済みURL" \
  --model kling-video-v2_6 \
  --duration 5 \
  --resolution 720p \
  --enable-audio false \
  --poll \
  "プロンプト"
```

### 注意事項
- **画像は必ず16:9版を使用**（1:1だと動画が正方形になる）
- `--enable-audio false`必須（デフォルトは音声生成ON）
- `--resolution 720p`を指定（デフォルト1080pはクレジット消費大）
- 720p×5秒×音声なし = **30クレジット**
- 生成URLは24時間で失効 → 即ダウンロードすること

### Gemini API連携（2026-07-02試行）
- APIキー取得済み・保存先：`~/.gemini_api_key`（chmod 600）
- テキスト生成：✅無料枠で動作確認済み
- **画像生成：API無料枠の対象外**（課金設定が必要）→ 当面は今まで通りAI Studioのサイトで手動生成
- 課金設定すれば1枚数円〜数十円程度で自動化可能（要確認）。必要になったら再検討

### Postcards From Septemberループ動画
- 試作済み：`PostcardsFromSeptember_loop_v1.mp4`（1:1・音声あり・1080p → NG版）
- 次回：16:9画像・音声なし・720pで再生成する
- プロンプト方針：木の葉・枝が大きく揺れる／カメラ固定／女性は静止
- 同じ画像を開始・終了フレームに使うとシームレスループになる

---

## メモ・決定事項

- セッションロック問題：会話が長くなると1Mトークンモードになりセッションがロックされる
  → 新セッション＋このファイルで引き継ぐ運用で対処
- Vol.1のジャケットは後から差し替え可能（DistroKid管理画面から）
- YouTube動画は1曲ずつ投稿（シリーズとして積み上げる）

### DistroKidの基本ルール
- **音源が完成したら、すぐDistroKidにアップロードする**
- YouTubeへの投稿タイミングとは切り離して考える

### DistroKidアップロード時のルール
- **Apple Musicクレジット（演奏者・プロデューサー）は2026-07-04からClaudeが自動入力してよい**（しゅうぞうさんの指示で方針転換。以前は「本名を聞かれるかも」という懸念で手動入力にしていたが、実際は本名ではなくアーティスト名で登録する運用と判明）
  - 演奏者：役割「ボーカル」、名前「HINOMARU」
  - プロデューサー：役割「ビートメーカー」、名前「HINOMARU」
  - トラック1に入力後、「演奏者の情報をすべてのトラックにコピー」「プロデューサー情報をすべてのトラックにコピー」で全曲に反映する
- **途中確認を最小限にする**
  - ターミナルClaudeへの指示に「途中で確認を取らずに最後まで一気に完了させてください」を必ず含める
  - Apple Musicクレジット入力待ち以外は止まらない
- **AI申告（CALM HOURSボーカルアルバム共通）**
  - 「この楽曲にはAIによって生成された音楽・ボーカル・歌詞が含まれますか？」→「はい」
  - 歌詞・作曲・音声すべてにチェック
  - HINOMARUは「AIペルソナ」を選択
  - 「Apply these selections to all songs on this release」にチェック
- **Extrasページのチェックはすべて外す**（DistroKidが自動でチェックを入れるようになったため）
- **WAVアップロードの推奨方法（2026-06-26確認）**
  - Claude in Chrome拡張機能経由でDOMを操作するのが最も安定
  - ただしWAVファイルのアップロード自体はセキュリティ制限で自動化不可 → 手動
  - Playwrightは/tmp/playwright-dk2プロファイルを使うと安定しやすい
- **✨ 次回からは v3スクリプトを使う（2026-06-27作成）**
  - 場所：`~/Downloads/distrokid_scripts/distrokid_upload_v3.js`
  - 使い方：`~/Downloads/distrokid_scripts/README_upload_v3.md` 参照
  - CONFIGを書き換えて `node distrokid_upload_v3.js` を実行するだけ
  - 文言非依存（setInputFilesのみ）・Extras自動オフ・AI申告自動・失敗時debug/に自動保存
  - UIが変わったら `node distrokid_upload_v3.js --inspect` の結果をClaudeに渡す

---

## セッション6（2026-06-07）の作業内容

### Vol.2「リスク管理」YouTube動画制作 全10曲完了
- CapCutで全10曲の動画制作・エクスポート完了
- 保存先：`~/Downloads/FP学習ソングVol2/YouTube/`
- ファイル名形式：`曲名_横型.mp4`
- 背景画像：`歌で覚えるFP3級_Vol2_リスク管理_v2.png`

### CALM HOURS「Sunday Coffee Sessions」制作開始
- Series Bible 保存：`~/Downloads/CalmHoursBGM/Sunday_Coffee_Sessions_series_bible.md`
- WAV 全10曲DL・整理済み：`~/Downloads/CalmHoursBGM/Sunday Coffee Sessions/`
- 曲一覧：Sunday Coffee / Window Seat / Little Things / Morning Latte / Slow Conversation / Across the Street / Paper Cup Dreams / Golden Afternoon / Favorite Place / See You Tomorrow

### 次回やること
- Vol.2 YouTube投稿（全10曲）
- Sunday Coffee Sessions：ジャケット画像作成 → DistroKidアップロード
- Vol.3「金融資産運用」YouTube動画制作

---

## セッション3（2026-06-07）の作業内容

### Vol.3「金融資産運用」歌詞・Suno制作

#### 確定したルール（Suno用歌詞）
- 英語略語はカタカナで表記（PER→ピーイーアール、NISA→ニーサ、iDeCo→イデコ、GDP→ジーディーピー、TOPIX→トピックス、ETF→イーティーエフ、TTS→ティーティーエス、TTB→ティーティービー）
- 数字はひらがな（1→いち、20→にじゅう）
- 小数点以下は一桁ずつ読む（20.315→にじゅってんさんいちご）
- 「名詞＋は」の後は半角スペース（Suno用のみ）
- 「÷」は「 わる 」と前後スペースを入れる
- 「1株」は「ひとかぶ」（受験生に伝わりやすいため）

#### 確定したルール（CapCut用歌詞）
- 半角英数・数字はすべて全角（PER→ＰＥＲ、3→３など）
- 英語略語はそのまま全角で（NISA→ＮＩＳＡ）
- タイトルはCapCut用歌詞には含めない（チャット上で上下に表示）
- スペースや読み方の工夫は不要。自然な日本語でOK

#### 制度改正への対応
- NISA・iDeCoなど改正が多い制度の歌詞は要定期確認
- 全歌詞はfp_songs.mdに保存済み。改正時はそのファイルを更新する

#### Vol.3 スタイル一覧
| 曲 | スタイル | BPM |
|----|---------|-----|
| 1 | J-rap, male rap duo, hip-hop, energetic, call and response | 116 |
| 2 | J-rap, male rap duo, boom bap, tense atmosphere, intense | 118 |
| 3 | J-rap, male rap duo, trap beat, confident, punchy | 108 |
| 4 | J-rap, male rap duo, lo-fi hip-hop, chill but sharp | 108 |
| 5 | J-rap, male rap duo, jazzy hip-hop, smooth but sharp | 112 |
| 6 | J-rap, male rap duo, dark hip-hop, heavy beat, menacing | 114 |
| 7 | J-rap, male rap duo, anthemic hip-hop, powerful, uplifting | 120 |
| 8 | J-rap, male rap duo, old school hip-hop, steady beat, heavy bass | 110 |
| 9 | J-rap, male rap duo, west coast hip-hop, smooth flow | 112 |
| 10 | J-rap, male rap duo, epic hip-hop, grand finale, powerful | 116 |

---

## セッション2（2026-06-05）の作業内容

### 歌詞制作ルール（確定）
- Suno用歌詞：漢字→ひらがな、カタカナ・英語はそのまま
- 数字はすべてひらがな（例：3→みっか、4→よっか）
- 「名詞＋は」の後は半角スペースを入れる
- 「はいる」の直前に半角スペースを入れる（例：`たんどくでは はいれない`）
- 構成：[Verse][Chorus][Bridge][Outro]のタグをつける

### Vol.1「ライフプランニングと資金計画」歌詞（全10曲）確定
1. Who are you? 〜年金の3つの顔〜
2. 6 Keys 〜未来を解く6つの鍵〜
3. 金利の罠 〜3つのローンを選べ〜
4. 待て、みっか！〜健康保険の給付を覚えろ〜
5. どっちの保険？〜国保と健保の違い〜
6. 何号？何歳？〜介護保険の境界線〜
7. 失業じゃない、求職だ！〜雇用保険の真実〜
8. それ、仕事中？〜労災保険の境界線〜
9. 家計の地図 〜キャッシュフロー表を読め〜
10. 今日の正味財産 〜バランスシートの真実〜

**スタイル統一**：J-pop・男性ボーカル・クールでエネルギッシュ

### Vol.2「リスク管理」歌詞（全10曲）確定
1. 定期か、終身か、養老か 〜3つの選択〜
2. 誰のための保険？〜契約関係の3人〜
3. 言わなきゃダメ？〜告知義務と通知義務〜
4. 燃えても、壊れても〜損害保険の世界〜
5. 3つの枠〜生命保険料控除を制せ〜
6. 純粋な保険料〜純保険料と付加保険料〜
7. 強制か、任意か〜自動車保険の2つの顔〜
8. 地震は含まれない〜火災保険と地震保険の真実〜
9. 第三の盾〜医療・がん・介護保険〜
10. 戻るお金、戻らないお金〜解約返戻金の真実〜

**スタイル統一**：dark pop・cool female vocal・emotional and powerful・edgy J-pop
**各曲BPM・雰囲気を少しずつ変化**（116〜128BPM・声質は統一）

### 歌詞保存先
- 全曲歌詞：`~/.claude/projects/-Users-ohatamasanori-fp-hitorigoto/memory/fp_songs.md`
- DistroKid引き継ぎ書：`~/.claude/projects/-Users-ohatamasanori-fp-hitorigoto/memory/fp_songs_distrokid_handoff.md`

### Vol.3「金融資産運用」歌詞（全10曲）確定
1. 元本保証か、挑戦か〜金融商品の地図〜
2. 金利が上がれば価格が下がる〜債券の逆説〜
3. PER・PBR・ROE〜株式3つの指標〜
4. 分けて守れ〜ポートフォリオ理論〜
5. 信託報酬という名のコスト〜投資信託の落とし穴〜
6. 外貨の罠〜為替リスクを知れ〜
7. 非課税の王様〜NISAを使い倒せ〜
8. 自分年金を作れ〜iDeCoの3つのメリット〜
9. 20%の壁〜金融所得課税の基本〜
10. 景気と株価〜経済指標を読め〜

**スタイル統一**：J-rap・男性ラップデュオ・hip-hop・call and response・energetic・116〜124BPM

### 次のステップ
- Vol.3のWAVダウンロード → ジャケット画像作成 → DistroKidアップロード
- Vol.2のYouTube動画制作（保留中）
- Vol.4 曲4「配偶者の壁」の数字（１６９万・２０７万）は暫定。令和8年度改正の正確な数字が確認できたら修正する

---

## 📝 ブログ・note記事

- **ブログ記事**：152本公開済み（2026-07-09時点）
  - 確認先：https://fp-hitorigoto.github.io/fp-hitorigoto/
  - 記事ファイル：`src/content/articles/`
- **note**：https://note.com/fp_hitorigoto
- 2026年7月から記事生成・note下書きは自動化済み（1日1本・毎朝のGitHub Actions）
- **詳細な運用フロー・引き継ぎは `docs/session_log_blog_note.md` を参照**
