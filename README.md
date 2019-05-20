# gas-DjangoError2GSheet
Django のエラーメールを Google スプレッドシート に登録する スクリプト

-----------------
## 使用方法      
* **以下のスプレッドシートをコピーする**    
以下のテンプレートスプレッドシート をコピーしてください。     
https://docs.google.com/spreadsheets/d/1uHMYNV4Z7yrE0vZKv_FEkjHa-maMqYmZdzFTZQMfQrc/edit?usp=sharing

* **スクリプトの編集**     
スクリプトエディタで、スクリプトとして登録されている`main.gs`の以下の部分を編集してください。       
```JavaScript
  var strTerms = "[your search Terms] AND is:unread";
```
Django エラーメールの件名などでの、絞り込みを記載してください。      

-----------------
## 設定を変更する     
一部項目が文字数が多くなり、行幅が広くなりすぎるため、項目として除外しています。         
除外を解除、更に項目を追加する場合は、`main.gs` 内の以下の箇所を編集してください。        

```JavaScript
var EXCLUDED_ELEMENTS = [
"Installed Applications:",
"Installed Middleware:",
"Traceback:",
"META:",
"Settings:"
]
```

