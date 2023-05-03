# Cucumber for SmartCity

このプロジェクトは、Gherkin Syntax を使った都市のシュミレーションについての実験です。

## Gherkin Syntax とは？

E2E テスト用のフレームワークで用いられる記法で、一般的なテスト用フレームワークに比べて人が読む文章に近い記述でテストを行うことが特徴です。

```
Feature: 災害リスクの有無のテスト（高松市内のみ）

  Scenario: 災害リスクのテスト

    When 現在位置は「高松市役所」である。
    Then そこには建築物がある。
    And  それは堅ろう建物である。
    And  そこには災害リスクがある。

    # サンポート高松
    When 現在位置は "34.35239048395566/134.0455192257034" である。
    Then そこには建築物がある
    And  それは高層建物である。
    And  そこには災害リスクがある。
```

サンプルのテストは以下の URL にあります。

https://github.com/geolonia/cucumber-for-smartcity/blob/main/features/example.feature

## Cucumber とは？

Cucumber とは、Gherkin Syntax を用いたテストを行うためのオープンソースのフレームワークです。

https://github.com/cucumber/cucumber-js/

## 仕組み

Gherkin Syntax によって記述されたテキストは、Step と呼ばれる関数によって解釈され、複数の地理空間情報にアクセスして想定どおりであるかどうかをチェックします。
この例では、「そこに建物があるかどうか？」と「その建物が高層建物かどうか」は国土地理院の最適化ベクトルタイルを参照し、「災害リスクの有無」については高松スマートマッププロジェクトで公開されているベクトルタイルを参照しています。

データの参照には、緯度経度から計算したタイル番号を用いており、これは経産省が標準化をすすめる「空間 ID」と互換性があります。

## 開発方法

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
