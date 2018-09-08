var HTTP_ERROR_MESSAGE_ELEMENTS = ["Request Method:",
"Request URL:",
"Django Version:",
"Python Executable:",
"Python Version:",
"Python Path:",
"Server time:",
"Installed Applications:",
"Installed Middleware:",
"Traceback:",
"Exception Type:",
"Exception Value:",
"Request information:",
"USER:",
"GET:",
"POST:",
"FILES:",
"COOKIES:",
"META:",
"Settings:"];

var BATCH_ERROR_MESSAGE_ELEMENTS = ["Django Version:",
"Python Executable:",
"Python Version:",
"Python Path:",
"Server time:",
"Installed Applications:",
"Installed Middleware:",
"Traceback:",
"Settings:"]

var EXCLUDED_ELEMENTS = [
"Installed Applications:",
"Installed Middleware:",
"Traceback:",
"META:",
"Settings:"
]

function pollMail() {
  var strTerms = "[your search Terms] AND is:unread";
  var numMail = 500; //1度に取得するメール数
  var myThreads; //条件にマッチしたスレッドを取得、最大500通と決まっている
  var myMsgs; //スレッドからメールを取得する　→二次元配列で格納
  var valMsgs;  
  var batchValMsgs;
  valMsgs = [];
  batchValMsgs = [];
  myThreads = GmailApp.search(strTerms, 0, numMail); //条件にマッチしたスレッドを取得、最大500通と決まっている
  myMsgs = GmailApp.getMessagesForThreads(myThreads); //スレッドからメールを取得する　→二次元配列で格納
    
  /* 各メールから日時、送信元、件名、内容を取り出す*/
  for(var j = 0; j < myMsgs.length; j++){
      elem = [];
      elem.push(myMsgs[j][0].getId());
      elem.push(myMsgs[j][0].getDate());
      elem.push(myMsgs[j][0].getFrom());
      elem.push(myMsgs[j][0].getReplyTo());
      elem.push(myMsgs[j][0].getTo());
      elem.push(myMsgs[j][0].getSubject());
      var body = myMsgs[j][0].getBody();
      if(isHTTPMessage_(body)) {
        errorObject = convertBody2ErrorObject_(myMsgs[j][0].getBody(), HTTP_ERROR_MESSAGE_ELEMENTS);
        elem = elem.concat(errorObject);
        valMsgs.push(elem);
      } else {
        errorObject = convertBody2ErrorObject_(myMsgs[j][0].getBody(), BATCH_ERROR_MESSAGE_ELEMENTS);
        elem = elem.concat(errorObject);
        batchValMsgs.push(elem);
      }
  }
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("report");
  /* スプレッドシートに出力 */
  if(valMsgs.length > 0){      
      sheet.getRange(sheet.getLastRow() + 1, 1, valMsgs.length, valMsgs[0].length).setValues(valMsgs); //シートに貼り付け
  }
  var batchSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("batch report");
  /* スプレッドシートに出力 */
  if(batchValMsgs.length > 0){      
      batchSheet.getRange(batchSheet.getLastRow() + 1, 1, batchValMsgs.length, batchValMsgs[0].length).setValues(batchValMsgs); //シートに貼り付け
  }
  for(var i = 0; i < myThreads.length; i++){
      // 既読にする
      myThreads[i].markRead();
  }  
}

function convertBody2ErrorObject_(body, messageElements) {
  var errorObject = [];
  errorObject.push(getSummaryMessage_(body, messageElements));
  for (var i = 0; i < messageElements.length; i++) {
    if (EXCLUDED_ELEMENTS.indexOf(messageElements[i]) >= 0) {
        continue;
    }
    if (i >= 0 && i < messageElements.length -1) {
      var elements = body.split(messageElements[i]);
      if(elements.length == 1){
        errorObject.push("");
        continue;
      }
      var elem= elements[1].split(messageElements[i + 1])[0];
      errorObject.push(elem);
    } else {
      // 最終要素の処理      
      var elem = body.split(messageElements[i])[1];
      errorObject.push(elem);
    }
  }
  return errorObject;
}

function getSummaryMessage_(body, messageElements) {
  for (var i = 0; i < messageElements.length; i++) {
      if (EXCLUDED_ELEMENTS.indexOf(messageElements[i]) >= 0) {
        continue;
      }
      var elements = body.split(messageElements[i]);
      if(elements.length == 1){
        continue;
      }
      return elements[0];
  }
  throw new Error();
}

function isHTTPMessage_(body) {
  return body.indexOf(HTTP_ERROR_MESSAGE_ELEMENTS[0]) != -1;
}
