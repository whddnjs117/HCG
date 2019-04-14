<%@page import="hcg.hunel.core.sql.MemResultSet"%>
<%@page language="java" contentType="text/html; charset=utf-8" %>
<%@include file="/common/jsp/header.jsp"%>
<%--
/***********************************************************************
Program Name  : rpt_isso_010_m01.jsp
Description   : 유니폼 지급 대상자 관리
Author        : 소인성
History       : 2019.04.03 신규개발
                2019.04.04 검색 / 조회시트 수정
***********************************************************************/
--%>
<html>
<head>
<title>::<com:label key='id_mgr' def='사번관리' />::</title>
<%@include file="/common/jsp/commonResource.jsp"%>

<script language="javascript">
function LoadPage()
{
  var cfg = {SearchMode:2,Page:50,FrozenCol:4};
  sheet1.SetConfig(cfg);

  // set columns
  var arrC = new Array;
  var col = 0;
  arrC[col++] = {Header:"No.",                                                Type:"Seq",         SaveName:"CSEQ",            Width:35,       Align:"Right",        InsertEdit:0,       UpdateEdit:0};
  arrC[col++] = {Header:"<com:label key='emp_id' def='사번' />",              Type:"Popup",       SaveName:"EMP_ID",          Width:100,      Align:"Right",        InsertEdit:1,       UpdateEdit:0,        KeyField:1};
  arrC[col++] = {Header:"<com:label key='emp_nm' def='성명' />",              Type:"Text",        SaveName:"EMP_NM",          Width:100,      Align:"Center",       InsertEdit:0,       UpdateEdit:0};
  arrC[col++] = {Header:"<com:label key='org_nm' def='조직' />",              Type:"Text",        SaveName:"ORG_NM",          Width:100,      Align:"Center",       InsertEdit:0,       UpdateEdit:0};
  arrC[col++] = {Header:"<com:label key='emp_title' def='호칭' />",           Type:"Text",        SaveName:"EMP_TITLE_NM",    Width:100,      Align:"Center",       Hidden:1,           InsertEdit:0,        UpdateEdit:0};
  arrC[col++] = {Header:"<com:label key='emp_grade' def='직급' />",           Type:"Combo",       SaveName:"EMP_GRADE_CD",    Width:100,      Align:"Center",       InsertEdit:0,       UpdateEdit:0};
  arrC[col++] = {Header:"<com:label key='duty_nm' def='직책' />",             Type:"Text",        SaveName:"DUTY_NM",         Width:100,      Align:"Center",       InsertEdit:0,       UpdateEdit:0};
  arrC[col++] = {Header:"<com:label key='gender_type' def='성별' />",         Type:"Combo",       SaveName:"GENDER_TYPE",     Width:100,      Align:"Center",       InsertEdit:0,       UpdateEdit:0};
  arrC[col++] = {Header:"<com:label key='giv_std_id' def='지급회차ID' />",    Type:"Text",        SaveName:"GIV_STD_ID",      Width:100,      Align:"Center",       InsertEdit:0,       UpdateEdit:0, Hidden:1};
  arrC[col++] = {Header:"<com:label key='note' def='비고' />",                Type:"Text",        SaveName:"NOTE",            Width:120,      EditLen:500};
  arrC[col++] = {Header:"<com:label key='delete' def='삭제'/>",               Type:"DelCheck",    SaveName:"CDELETE",         Width:45};
  arrC[col++] = {Header:"<com:label key='stat_cd' def='상태' />",             Type:"Status",      SaveName:"CSTATUS",         Width:45,       Align:"Center"};

  setCombo("<%=hmPreparedData.get("/SY04")%>", arrC, "POST_CD", "S");
  setCombo("<%=hmPreparedData.get("/SY03")%>", arrC, "EMP_GRADE_CD", "S");
  setCombo("<%=hmPreparedData.get("00020")%>", arrC, "GENDER_TYPE", "S");
  
  var info = {Sort:1,ColMove:1,ColResize:1,HeaderCheck:1};
  initSheetColumn(sheet1, arrC, info, 1);
  sheet1.SetVisible(1);

  setCombo("<%=hmPreparedData.get("customCombo01")%>",'S_GIV_TRG_NM', null, 'S');
  setCombo("<%=hmPreparedData.get("/SY03")%>", "S_EMP_GRADE_CD", null, "A");
  setCombo("<%=hmPreparedData.get("00020")%>", "S_GENDER_TYPE", null, "A");
  setCombo("<%=hmPreparedData.get("PR3070")%>", "S_BATCH_TYPE", null, "S");
  
  /********************************************* 시트정의 끝 *********************************************/
}


function doAction(sAction)
{  
  inputAutoUnformat("f1");
  $("#S_DSMETHOD").val( sAction);
  switch(sAction)
  {
    case "<com:otp value='search01' />":      // 조회
    {
      if ( ! checkForm("f1") ) return;
      
      $("#S_SAVENAME").val( concatSaveName(sheet1, "|", "CSEQ,CDELETE,CSTATUS"));
      var paramSub = FormQueryStringEnc(document.f1);
      sheet1.DoSearch("/commonAction.do", paramSub);
    }
    break;
    
    <com:auth btnAuth="WRITE">
    case "<com:otp value='batch01' />":
    {
      if( ! checkInputNN("S_GIV_TRG_NM") || ! checkInputNN("S_BATCH_TYPE")) return;
      
      var S_GIV_TRG_NM = $("#S_GIV_TRG_NM").val();
      var S_ORG_NM = $("#S_ORG_NM").val();
      var S_EMP_GRADE_CD = $("#S_EMP_GRADE_CD").val();
      var S_BATCH_TYPE = $("#S_BATCH_TYPE").val();
      var S_GENDER_TYPE = $("#S_GENDER_TYPE").val();
      
      if ( ! checkForm("f1") ) return;
     
      var startTime = new Date().getTime();
      ajaxRequestXSProg($("#S_DSCLASS").val(), $("#S_DSMETHOD").val(), serializeForm(), function(xs)
      {
        var endTime = new Date().getTime() ;
        var passedTime = (endTime - startTime) + " ms";
        alert(ajaxMsg("MSG_ALERT_BATCH_OK"));
      });
      
      doAction("<com:otp value='search01' />");
    }
    break;
    
    case "<com:otp value='insert01' />":      // 입력
    {
      var Row = sheetDataInsert(sheet1);  // 시트 로우 추가, common.js 에 정의되어있음, 절대 인덱스를 리턴함
      sheet1.SetCellValue(Row,"STA_YMD", "<%=TO_YY%>" + "0101");
      sheet1.SetCellValue(Row,"END_YMD", "<%=TO_YY%>" + "1231");
      sheet1.SetCellValue(Row,"RETURN_YN", "N");
    }
    break;

    case "<com:otp value='copy01' />":
    {
      var Row = sheet1.DataCopy();
    }
    break;

    case "<com:otp value='save01' />":
    {
      var paramSub = FormQueryStringEnc(document.f1);
      sheet1.DoSave("/commonAction.do", paramSub);  // web.xml에 정의, 어느 서블릿에 포워딩할지
    }
    break;
    </com:auth>

    <com:auth btnAuth="PRINT">
    case "<com:otp value='down2excel01' />":  // 엑셀다운로드
    {
      export2excel(sheet1, "<com:otp value='search01' />", "테스트");
    }
    break;
    </com:auth>

    <com:auth btnAuth="WRITE">
    case "<com:otp value='upload2excel01' />":
    {
     sheet1.LoadExcel();
    }
    break;
    </com:auth>
  }
}

function sheet1_OnSearchEnd(ErrCode, ErrMsg)  // OnSearchEvent, cfm에 기술되어있음
{
  if ( ! doCheckMsg(ErrMsg) ) return;
  if ( ErrCode )
  {
    alert(ajaxMsg("MSG_ALERT_SEARCH_FAIL") + (ErrMsg ? "\n\n"+ ErrMsg : ""));
  }
}

function sheet1_OnSaveEnd(ErrCode, ErrMsg)
{
  if ( ! doCheckMsg(ErrMsg) ) return;
  if ( ErrCode )
  {
    alert(ajaxMsg("MSG_ALERT_SAVE_FAIL") + (ErrMsg ? "\n\n"+ ErrMsg : ""));
  }
  else
    {
     alert(ajaxMsg("MSG_ALERT_SAVE_OK"));
     doAction("<com:otp value='search01' />");
    }
}

function sheet1_OnClick(Row, Col, Value) 
{ 
  var colnm = sheet1.ColSaveName(Col);
  switch ( colnm )
  {
  }
}

function sheet1_OnPopupClick(Row, Col) 
{ 
  var colnm = sheet1.ColSaveName(Col);
  switch ( colnm )
  {
    
  }
}
</script>
</head>
<body >
<form id="f1" name="f1" style="margin:0;" onSubmit="return false;" >

<input type="hidden" id="S_DSCLASS"        name="S_DSCLASS"         value="<com:otp value="biz.rpt.rp_isso.Rpt_isso_100_ul01" />" />
<input type="hidden" id="S_DSMETHOD"       name="S_DSMETHOD" />
<input type="hidden" id="S_SAVENAME"       name="S_SAVENAME" />
<!-- <input type="hidden" id="S_GIV_STD_ID"     name="S_GIV_STD_ID" /> -->

<div class="wbox">
  <div class="hbox" boxsize="35">
      <!--// 타이틀 -->
      <div class="headTit">
          <h2 class="titA"><%=StringUtil.nvl(request.getParameter("X_MENU_NM"), resourceLabel.getString("mm_attn_aggr"))%></h2>
          <!-- // 버튼 -->
          <div class="btn_areaR">
              <com:auth btnAuth="WRITE"><span class="btn"><input type="button" value="대상자집계" class="blt" onclick="doAction('<com:otp value='batch01' />');" BA_TYPE="WRITE" /></span></com:auth>
          </div>
          <!-- 버튼 //-->
      </div>
      <!-- 타이틀 //-->
  </div>

  <div class="hbox" boxsize="104">
  <!--// 입력테이블 -->
      <table class="table_item">
        <colgroup>
          <col width="120px" />
          <col width="*" />
        </colgroup>
          
          <tr>
            <th class="blt"><com:label key='category' def='구분' /></th>
            <td>
              <span class="item_area">
                <span class="point_opt"><com:label key='giv_std_nm' def='지급회차명' />
                  <select id="S_GIV_TRG_NM" name="S_GIV_TRG_NM" class="insert_select" korname="<com:label key='giv_trg_nm' def='지급회차명' />"></select>
                </span>
              </span>
              <span class="item_area">
                <span class="point_opt"><com:label key='batch_type' def='집계구분' />
                  <select id="S_BATCH_TYPE" name="S_BATCH_TYPE" class="insert_select"  korname="<com:label key='batch_type' def='집계구분' />"></select>
                </span>
              </span>
            </td>
          </tr>
           
          <tr>
            <th rowspan="3" class="blt"><com:label key='trg_emp' def='대상자 조회' /></th>
            <td>
              <span class="item_area">
                <jsp:include page="/sys/sy_com/sy_com_160_p01.jsp" flush="true" >
                  <jsp:param name="S_MODE01" value="0020" />
                  <jsp:param name="S_REQUIRED" value="N" />
                  <jsp:param name="S_SIZE" value="15" />
                </jsp:include>
              </span>
            </td>
          </tr>
          
          <tr>
            <td>
              <span class="item_area">
                <span class="point_opt"><com:label key='emp_grade' def='직급' /></span>
                <span class="input_area">
                  <select id="S_EMP_GRADE_CD" name="S_EMP_GRADE_CD" class="insert_select"></select>
                </span>
              </span>
              <span class="item_area">
                <span class="point_opt"><com:label key='gender_type' def='성별' /></span>
                <span class="input_area">
                  <select id="S_GENDER_TYPE" name="S_GENDER_TYPE" class="insert_select"></select>
                </span>
              </span>
            </td>
          </tr>
          
      </table>
  </div>

  <div class="hbox">
      <div class="vbox">
          <div class="hbox" boxsize="35">
              <div class="headTit">
                  <h3 class="titB">
                      <%=StringUtil.nvl(request.getParameter("X_MENU_NM"), resourceLabel.getString("crt_emp_id"))%>
                  </h3>
                  <div class="btn_areaR">
                      <span class="btn"><input type="button" onFocus="blur()" class="search" value="<com:label key='search' def='검색' />" onClick="doAction('<com:otp value='search01' />');" /></span>
                      <span class="btn"><com:auth btnAuth="WRITE"><input type="button" onFocus="blur()" class="insert" BA_TYPE="WRITE" value="<com:label key='insert' def='추가' />" onClick="doAction('<com:otp value='insert01' />');" /></com:auth></span>
                      <span class="btn"><com:auth btnAuth="WRITE"><input type="button" onFocus="blur()" class="copy" BA_TYPE="WRITE" value="<com:label key='copy' def='복사' />" onClick="doAction('<com:otp value='copy01' />');" /></com:auth></span>
                      <span class="btn"><com:auth btnAuth="WRITE"><input type="button" onFocus="blur()" class="save" BA_TYPE="WRITE" value="<com:label key='save' def='저장'/>" onClick="doAction('<com:otp value='save01' />');" /></com:auth></span>
                      <span class="btn"><com:auth btnAuth="PRINT"><input type="button" onFocus="blur()" class="ex" BA_TYPE="PRINT" value="DOWN" onClick="doAction('<com:otp value='down2excel01' />');" /></com:auth></span>
                      <span class="btn"><com:auth btnAuth="WRITE"><input type="button" value="UP" onclick="doAction('<com:otp value='upload2excel01' />');" class="exup" BA_TYPE="WRITE" /></com:auth></span>
                  </div>
              </div>
          </div>
          <!--// 그리드영역 -->
          <div class="hbox">
              <script >writeIBSheet(Page.SKIN_PATH, "sheet1");</script>
          </div>
          <!-- 그리드영역 //-->
      </div>
  </div>
</div>
</form>
</body>
</html>