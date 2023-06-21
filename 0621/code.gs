// 스프레드시트 메뉴를 생성하고 초기화할 때 호출되는 함수
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('지오유')
    .addItem('본 문서를 전자결재로 생산', 'sendDocument')
    .addSeparator()
    .addSubMenu(ui.createMenu('바로가기')
      .addItem('그룹웨이로 이동', 'openZioYou')
    )
    .addToUi();
}

function fGetPubUrl(){
  //너가 보는 화면의 아이디 가져오기
  var fileId =  SpreadsheetApp.getActiveSpreadsheet().getId();
  //     볼수 있게 바꾸기
  Drive.Revisions.update({published:true,publishedOutsideDomain:true,publishAuto:true},fileId,1 );
  return "https://docs.google.com/spreadsheet/pub?key=" + fileId;
}

function fGetUserInfo(){
  var about = Drive.About.get();
  var user = {
    name: about.name,
    permissionid: about.permissionId,
    driveUser: about.user
  }
  return user;
}

// "본 문서를 전자결재로 생산" 메뉴 클릭 시 실행되는 함수
function sendDocument() {
  var tpl = HtmlService.createTemplateFromFile("index.html");
    tpl.seungyeop=fGetPubUrl();
    tpl.subj = SpreadsheetApp.getActiveSpreadsheet().getName();
    tpl.userID = fGetUserInfo().driveUser.emailAddress;
  var output = tpl.evaluate();
    output.setWidth(1000);
    output.setHeight(1000);
  SpreadsheetApp.getUi().showModalDialog(output,'전자결제 eSign')
}

// "상신하기" 버튼 클릭 시 실행되는 함수
function fSend() {
  if (confirm("위 문서를 정말로 상신하시겠습니까?")) {
    google.script.run.processForm();
  }
}

// "그룹웨이로 이동" 메뉴 클릭 시 실행되는 함수
function openZioYou() {
  var html = '<html><body><a href="https://zioyoucs.com/" target="_blank">지오유로 이동</a></body></html>';
  var htmlOutput = HtmlService.createHtmlOutput(html).setWidth(300).setHeight(100);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, '지오유 사이트');
}

// 전자결재 상신 처리 함수
function processForm() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // A1 셀에 상신 메시지 표시
  sheet.getRange('A1').setValue('상신되었습니다.');
}