<%@page language="java" contentType="text/html; charset=utf-8" %>
<%@include file="/common/jsp/header.jsp"%>
<%--
Program Name  : be_gif_101_ul01.jsp
Description   : 명절선물 신청/승인
Author        : 박영환
History       : 2007-11-16
--%>
<html>
<head>
<title><com:label key='bsi_menu_0019' def='명절선물신청' /></title>
<%@include file="/common/jsp/commonResource.jsp"%>
<script language="javascript">
function LoadPage()
{
    var cfg = {SearchMode:2,Page:50,FrozenCol:3};
    sheet1.SetConfig(cfg);

    // set columns
    var arrC = new Array;
    var col = 0;
    arrC[col++] = {Header:"No",        Type:"Seq",        SaveName:"CSEQ",        Width:35,        Align:"Right"};
    arrC[col++] = {Header:"<com:label key='com_mon' def='명절선물' />",        Type:"Combo",        SaveName:"GIF_TYPE",        Width:75,        Align:"Left",        UpdateEdit:0,        KeyField:1};
    arrC[col++] = {Header:"<com:label key='com_mon' def='회사지원금' />",        Type:"Int",        SaveName:"GIF_MON",        Width:80,        Align:"Right",        Format:"Integer"};
    arrC[col++] = {Header:"<com:label key='note' def='비고' />",        Type:"Text",        SaveName:"NOTE",        Width:140, EditLen:1500};
    arrC[col++] = {Header:"<com:label key='delete' def='삭제' />",        Type:"DelCheck",        SaveName:"CDELETE",        Width:45};
    arrC[col++] = {Header:"<com:label key='stat_cd' def='상태' />",        Type:"Status",        SaveName:"CSTATUS",        Width:35};
    var info = {Sort:1,ColMove:1,ColResize:1,HeaderCheck:1};


    setCombo("<%=hmPreparedData.get("/GI01")%>", arrC, "GIF_TYPE", "N");
    initSheetColumn(sheet1, arrC, info, 1);
   
    //FrozenCols( = 3);
    //WordWrap = false;
    sheet1.SetVisible(1);
    
    //doAction("<com:otp value='search01' />");
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

    $("#S_SAVENAME").val( concatSaveName(sheet1, "|", "CSEQ,CDELETE,CSTATUS"));
    var paramSub = FormQueryStringEnc(document.f1);
    sheet1.DoSearch("/commonAction.do", paramSub);
  }
  break;
  <com:auth btnAuth="WRITE">
  //입력
  case "<com:otp value='insert01' />":
  {
    sheet1.SetDataAutoTrim(0);
    var Row = sheetDataInsert(sheet1);
  }
  break;
  //저장
  case "<com:otp value='save01' />":
  {
    //if ( ! confirm(ajaxMsg("MSG_CONFIRM_SAVE")) ) return;
    var paramSub = FormQueryStringEnc(document.f1);
    sheet1.DoSave("/commonAction.do", paramSub);
  }
  break;
  </com:auth>
  <com:auth btnAuth="PRINT">
  //엑셀다운로드
  case "<com:otp value='down2excel01' />":
  {
    //sheetSpeedDown2Excel(sheet1);
	  export2excel(sheet1, "<com:otp value='search01' />", "명절선물지급기준", null);
  }
  break;
  </com:auth>
  <com:auth btnAuth="WRITE">
  //복사
  case "<com:otp value='copy01' />":
  {
    sheet1.DataCopy();
  }
  break;
  }
  </com:auth>
}

function sheet1_OnSearchEnd(ErrCode, ErrMsg)
{ 
  if ( ! doCheckMsg(ErrMsg) ) return;
  if ( ErrCode )
  {
   alert(ajaxMsg("MSG_ALERT_SEARCH_FAIL") +(ErrMsg ? "\n\n"+ ErrMsg : ""));
  }
}

function sheet1_OnSaveEnd(ErrCode, ErrMsg)
{ 
  if ( ! doCheckMsg(ErrMsg) ) return;
  if ( ErrCode )
  {
    alert(ajaxMsg("MSG_ALERT_SAVE_FAIL") +(ErrMsg ? "\n\n"+ ErrMsg : ""));
  }
  else
  {
    alert(ajaxMsg("MSG_ALERT_SAVE_OK"));
    doAction("<com:otp value='search01' />");
  }
}
</script>
</head>
<body >
  <form id="f1" name="f1" onSubmit="return false;">
    <input type="hidden" id="S_DSCLASS" name="S_DSCLASS" value="<com:otp value='biz.bsi.be_gif.Be_gif_101_ul01' />" />
    <input type="hidden" id="S_DSMETHOD" name="S_DSMETHOD" />
    <input type="hidden" id="S_SAVENAME" name="S_SAVENAME" />
    <div class="wbox">
    	<div class="hbox" boxsize="80">          
        <!--// 타이틀 -->
        <div class="headTit">
          <h2 class="titA">
            <%=StringUtil.nvl(request.getParameter("X_MENU_NM"), "명절선물")%>
          </h2>
        </div>
        <!-- 타이틀 //-->
        <!--// search -->
        <div class="search_typeA clearFix">
          <div class="searchA">
            <div class="sch_area" onkeydown="if(enterKeyDown(event))doAction('<com:otp value='search01' />');">
              <div class="clearFix">
                                
              </div>
            </div>
            <com:auth btnAuth="READ"><span class="btn_search"><input type="button" class="search" value="조회" onClick="doAction('<com:otp value='search01' />');" /></span></com:auth>
          </div>
        </div>
        <!-- search //-->
      </div>
      <div class="hbox" boxsize="35">
        <!--// 타이틀 -->
        <div class="headTit">
          <h2 class="titA">
            <%=StringUtil.nvl(request.getParameter("X_MENU_NM"),resourceLabel.getString("bsi_menu_0018"))%>
          </h2>
          <!--// 버튼 -->
          <div class="btn_areaR">
            <com:auth btnAuth="READ"><span class="btn"><input type="button" value="<com:label key='search' def='조회' />" onclick="doAction('<com:otp value='search01' />');" class="search" /></span></com:auth>
            <com:auth btnAuth="WRITE">
            <span class="btn"><input type="button" value="<com:label key='insert' def='추가' />" onclick="doAction('<com:otp value='insert01' />');" class="insert" BA_TYPE="WRITE" /></span>
            <span class="btn"><input type="button" value="<com:label key='copy' def='복사' />" onclick="doAction('<com:otp value='copy01' />');" class="copy" BA_TYPE="WRITE" id="copy01" /></span>
            <span class="btn"><input type="button" value="<com:label key='save' def='저장' />" onclick="doAction('<com:otp value='save01' />');" class="save" BA_TYPE="WRITE" /></span>
            </com:auth>
            <com:auth btnAuth="PRINT"><span class="btn"><input type="button" value="DOWN" onclick="doAction('<com:otp value='down2excel01' />');" class="ex" BA_TYPE="PRINT" /></span></com:auth>
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