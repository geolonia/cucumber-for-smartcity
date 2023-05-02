# Cucumber for SmartCity

このプロジェクトは、Gherkin Syntax を使った都市のシュミレーションについての実験です。

## Gherkin Syntax とは？

E2E テスト用のフレームワークで用いられる記法で、一般的なテスト用フレームワークに比べて人が読む文章に近い記述でテストを行うことが特徴です。

```
Feature: 災害リスクの有無のテスト

  Scenario: 災害リスクのテスト（高松市内のみ）

    When 現在位置は「高松市役所」である。
    Then そこには建築物がある。
    And  そこには災害リスクがある。

    When 現在位置は「香川県高松市朝日町一丁目2番1号」である。
    Then そこには建築物がある。
    And  そこには災害リスクがない。
```

## Cucumber とは？

Cucumber とは、Gherkin Syntax を用いたテストを行うためのオープンソースのフレームワークです。

https://github.com/cucumber/cucumber-js/

# 開発方法

まず、以下の要領でローカル開発環境を作ってください。

```
$ git clone git@github.com:miya0001/bbd-for-smartcity.git
$ cd bbd-for-smartcity
$ npm install
```

次に、`.envrc.sample` を `.envrc` にリネームして、ご自身の環境にあわせて環境変数を書き換えてください。
書き換えたら、その環境変数を `direnv` や `source` 等でロードしてください。

それぞれの環境変数は以下のとおりです。

* `AWS_ACCESS_KEY_ID`: AWS のアクセスキー
* `AWS_SECRET_ACCESS_KEY`: AWS のシークレットキー
* `API_KEY`: Geolonia Maps の API キー
* `ORIGIN`: Geolonia Maps の API キーを取得したときに設定した Origin の URL

最後に以下の要領でテストを実行してください。

```
$ npm run test:mocha
$ npm test
```
