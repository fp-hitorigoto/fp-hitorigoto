# FPのひとりごと — セットアップガイド

このガイドを上から順番に進めると、ブログが公開できます。
所要時間：約30〜40分（初回のみ）

---

## ステップ1：GitHubアカウントを作成する

1. https://github.com を開く
2. 右上の「Sign up」をクリック
3. メールアドレス・パスワード・ユーザー名を入力して登録

---

## ステップ2：このコードをGitHubにアップロードする

### 2-1. 新しいリポジトリを作成
1. GitHubにログイン後、右上の「＋」→「New repository」をクリック
2. Repository name に `fp-hitorigoto` と入力
3. 「Private」を選択（公開したくない場合）または「Public」
4. 「Create repository」をクリック

### 2-2. GitHubDesktopをインストール（Macの方）
1. https://desktop.github.com/ からダウンロード・インストール
2. GitHubアカウントでログイン

### 2-3. フォルダをアップロード
1. GitHub Desktop を開く
2. 「File」→「Add Local Repository」
3. `fp-hitorigoto` フォルダを選択
4. 「Publish repository」をクリック
5. リポジトリ名が `fp-hitorigoto` になっていることを確認して「Publish Repository」

---

## ステップ3：Anthropic APIキーを取得する

1. https://console.anthropic.com/ にアクセス
2. アカウント登録（メールアドレスとパスワード）
3. ログイン後、左メニューの「API Keys」をクリック
4. 「+ Create Key」をクリック
5. 名前に「fp-hitorigoto」と入力して「Create Key」
6. 表示されたキー（`sk-ant-...`で始まる文字列）をメモ帳にコピー保存
   ⚠️ このキーは一度しか表示されません。必ず保存してください！
7. クレジットカードを登録（「Billing」メニューから）
   → 10ドル（約1,500円）チャージで数ヶ月分以上使えます

---

## ステップ4：GitHubにAPIキーを登録する

1. GitHubの `fp-hitorigoto` リポジトリを開く
2. 上部メニューの「Settings」をクリック
3. 左メニューの「Secrets and variables」→「Actions」をクリック
4. 「New repository secret」をクリック
5. Name に `ANTHROPIC_API_KEY` と入力
6. Secret にステップ3でコピーしたキーを貼り付け
7. 「Add secret」をクリック

---

## ステップ5：Vercelでサイトを公開する

1. https://vercel.com/ にアクセス
2. 「Sign Up」→「Continue with GitHub」でGitHubアカウントと連携
3. 「Add New...」→「Project」をクリック
4. `fp-hitorigoto` リポジトリを選択して「Import」
5. 設定はそのままで「Deploy」をクリック
6. 2〜3分待つとサイトが公開されます！
7. 表示されたURLをブックマーク（例：`https://fp-hitorigoto.vercel.app`）

---

## ステップ6：動作確認

以下を確認しましょう。

- [ ] サイトのURLにアクセスしてトップページが表示される
- [ ] サンプル記事2件が表示される
- [ ] カテゴリページが開ける

---

## 毎日の自動更新について

設定が完了すると、**毎朝7時に自動で以下が行われます**：

1. 財務省・金融庁・厚生労働省などのRSSを取得
2. 新着ニュースをもとにClaude AIが記事を生成
3. GitHubにコミット
4. Vercelが自動でサイトを更新

あなたがすることは何もありません！

### 手動で記事生成を実行したい場合
1. GitHubの `fp-hitorigoto` リポジトリを開く
2. 「Actions」タブをクリック
3. 左の「毎朝自動記事生成」をクリック
4. 「Run workflow」→「Run workflow」

---

## 自分でも記事を書きたい場合

`src/content/articles/` フォルダに以下の形式でMarkdownファイルを追加します。

```markdown
---
title: "記事タイトル"
pubDate: 2024-12-01
category: "NISA・iDeCo"
source: "自筆"
tags: ["NISA", "積立投資"]
excerpt: "記事の要約を2〜3文で書きます。"
---

ここから本文を書きます。

## 見出し

本文...
```

**カテゴリは以下の6つから選んでください：**
- `税務・税制改正`
- `社会保険・年金`
- `NISA・iDeCo`
- `不動産・住宅`
- `金融機関の動向`
- `FP試験情報`

ファイルをGitHubにアップロード（GitHub Desktopでコミット＆プッシュ）すると、
数分後にVercelが自動でサイトを更新します。

---

## サイトURLのカスタマイズ（オプション）

Vercelでは独自ドメイン（例：`fp-hitorigoto.com`）も無料で設定できます。
ドメインを購入後（お名前.com、ムームードメインなど）、Vercelの「Domains」設定から追加できます。

---

## 困ったときは

- サイトが表示されない → Vercelのダッシュボードで「Deployments」を確認
- 記事が生成されない → GitHubの「Actions」タブでエラーログを確認
- APIキーのエラー → ステップ4を再確認
