Feature: サンプルテスト

  Scenario: 建物の有無のテスト

    When 現在位置は、"35.68116699832639/139.7660031421873" である。
    Then そこには建築物がある。

    When 現在位置は、「東京都千代田区永田町２丁目３−１」 である。
    Then そこには建築物がある。

    When 現在位置は、"35.681187147600724/139.76568195845675" である。
    Then  そこには建築物がない。

    When 現在位置は、「東京都千代田区永田町20丁目30-100」 である。
    Then そこには建物がない。
