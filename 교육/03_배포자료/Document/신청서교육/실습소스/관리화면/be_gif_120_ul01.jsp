<%@page language="java" contentType="text/html; charset=utf-8" %>
<%@include file="/common/jsp/header.jsp"%>
<%--
Program Name  : be_con_120_ul01.jsp
Description   : 명절선물관리
Author        : 정두영
History       : 2009-09-14
--%>
<html>
<head>
<title>명절선물관리</title>
<%@include file="/common/jsp/commonResource.jsp"%>
<script language="javascript">
function LoadPage()
{
  var cfg = {SearchMode:2,Page:50,FrozenCol:5};
  sheet1.SetConfig(cfg);

  // set columns
  var arrC = new Array;
  var col = 0;
  arrC[col++] = {Header:"No",        Type:"Seq",        SaveName:"CSEQ",        Width:35,        Align:"Right"};
  arrC[col++] = {Header:"<com:label key='emp_id' def='사번' />",        Type:"Text",        SaveName:"EMP_ID",        Width:60,        InsertEdit:0,        UpdateEdit:0,        KeyField:1};
  arrC[col++] = {Header:"<com:label key='emp_nm' def='성명' />",        Type:"Popup",        SaveName:"EMP_NM",        Width:60,        UpdateEdit:0};
  arrC[col++] = {Header:"<com:label key='org_nm' def='조직' />",        Type:"Text",        SaveName:"ORG_NM",        Width:100,        InsertEdit:0,        UpdateEdit:0};
  arrC[col++] = {Header:"<com:label key='emp_grade' def='직급' />",        Type:"Text",        SaveName:"EMP_GRADE_NM",        Width:60,        InsertEdit:0,        UpdateEdit:0};
  arrC[col++] = {Header:"<com:label key='enter_class' def='입력구분' />",        Type:"Combo",        SaveName:"IN_TYPE",        Width:70,        InsertEdit:0,        UpdateEdit:0};
  arrC[col++] = {Header:"<com:label key='appl_no1' def='신청서번호' />",        Type:"Text",        SaveName:"APPL_ID",        Width:70,        InsertEdit:0,        UpdateEdit:0};
  arrC[col++] = {Header:"<com:label key='com_mon' def='명절선물' />",        Type:"Combo",        SaveName:"GIF_TYPE",        Width:65};
  arrC[col++] = {Header:"<com:label key='com_mon' def='회사\n지원금' />",        Type:"Int",        SaveName:"GIF_MON",        Width:80,        Align:"Right",        Format:"Integer"};
  arrC[col++] = {Header:"DATA_ID",        Type:"Text",        Hidden:1,        SaveName:"DATA_ID"};
      
  setCombo("<%=hmPreparedData.get("SY110")%>", arrC, "IN_TYPE", "N");
  setCombo("<%=hmPreparedData.get("/GI01")%>", arrC, "GIF_TYPE", "S");

  
  var info = {Sort:1,ColMove:1,ColResize:1,HeaderCheck:1};
  initSheetColumn(sheet1, arrC, info, 1);
  
  sheet1.SetEditable(0);

  doAction("<com:otp value='search01' />");
}

function doAction(sAction)
{
  inputAutoUnformat();
  $("#S_DSMETHOD").val( sAction);
  switch(sAction)
  {
    //조회
    case "<com:otp value='search01' />":
    {
      if ( ! checkForm("f1") ) return;
      $("#S_SAVENAME").val( concatSaveName(sheet1, "|", "CSEQ,CDELETE,CSTATUS"));
      var paramSub = FormQueryStringEnc(document.f1);
      sheet1.DoSearch("/commonAction.do", paramSub);
    }
    break;
    <com:auth btnAuth="PRINT">
    //엑셀다운로드
    case "<com:otp value='down2excel01' />":
    {
      //sheetSpeedDown2Excel(sheet1);
    	export2excel(sheet1, "<com:otp value='search01' />", "명절선물관리", null);
    }
    break;
    </com:auth>
  }
}

function sheet1_OnSearchEnd(ErrCode, ErrMsg)
{
  if ( ! doCheckMsg(ErrMsg) ) return;
  if ( ErrCode )
  {
    alert(ajaxMsg("MSG_ALERT_SEARCH_FAIL") +(ErrMsg ? "\n\n"+ ErrMsg : ""));
  }
}
</script>
</head>
<body >
  <form id="f1" name="f1" onSubmit="return false;">
    <input type="hidden" id="S_DSCLASS" name="S_DSCLASS" value="<com:otp value='biz.bsi.be_gif.Be_gif_120_ul01' />" />
    <input type="hidden" id="S_DSMETHOD" name="S_DSMETHOD" />
    <input type="hidden" id="S_SAVENAME" name="S_SAVENAME" />
    <div class="wbox">
      <div class="hbox" boxsize="84">          
        <!--// 타이틀 -->
        <div class="headTit">
          <h2 class="titA">
            <%=StringUtil.nvl(request.getParameter("X_MENU_NM"), resourceLabel.getString("bsi_menu_0021"))%>
          </h2>
        </div>
        <!-- 타이틀 //-->
        <!--// search -->
        <div class="search_typeA clearFix">
          <div class="searchA">
            <div class="sch_area" onKeyDown="if(enterKeyDown(event))doAction('<com:otp value='search01' />');">
              <div class="clearFix">
               
              </div>
            </div>
            <com:auth btnAuth="READ"><span class="btn_search"><input type="button" value="<com:label key='search' def='검색' />" onClick="doAction('<com:otp value='search01' />');" class="search" /></span></com:auth>
          </div>
        </div>
        <!-- search //-->
      </div>
      <div class="hbox" boxsize="35">
        <!--// 타이틀 -->
        <div class="headTit">
          <h3 class="titB">
            <%=StringUtil.nvl(request.getParameter("X_MENU_NM"), resourceLabel.getString("bsi_menu_0021"))%>
          </h3>
          <!--// 버튼 -->
          <div class="btn_areaR">
            <com:auth btnAuth="WRITE">
            </com:auth>
            <com:auth btnAuth="PRINT"><span class="btn"><input type="button" value="DOWN" onClick="doAction('<com:otp value='down2excel01' />');" class="ex" BA_TYPE="PRINT" /></span></com:auth>
          </div>
          <!-- 버튼 //-->
        </div>
        <!-- 타이틀 //-->
      </div>
      <!--// 그리드 -->
      <div class="hbox">
        <script>writeIBSheet(Page.SKIN_PATH, "sheet1");</script>
      </div>
      <!-- 그리드 //-->
    </div>
  </form>
</body>
</html>