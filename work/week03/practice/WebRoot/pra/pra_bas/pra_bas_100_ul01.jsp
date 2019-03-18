<%@page import="hcg.hunel.core.sql.MemResultSet"%>
<%@page language="java" contentType="text/html; charset=utf-8" %>
<%@include file="/common/jsp/header.jsp"%>
<%--
/***********************************************************************
 Program Name  : pra_bas_100_ul01.jsp
 Description   : 개인별 노트북렌탈 관리
 Author        : 소인성
 History       : 2019.03.18 신규개발
***********************************************************************/
--%>
<html>
<head>
<title>::<com:label key='id_mgr' def='사번관리' />::</title>
<%@include file="/common/jsp/commonResource.jsp"%>

<script language="javascript">
/**
 * 페이지 오픈시 IBSheet 및 ComboBox 초기화
 */
function LoadPage()
{
  var cfg = {SearchMode:2,Page:50,FrozenCol:4};
  sheet1.SetConfig(cfg);

  // set columns
  var arrC = new Array;
  var col = 0;
  arrC[col++] = {Header:"No.",                                              Type:"Seq",         SaveName:"CSEQ",            Width:35,      Align:"Right",        InsertEdit:0,       UpdateEdit:0};
  arrC[col++] = {Header:"<com:label key='emp_id' def='사번' />",            Type:"Text",        SaveName:"EMP_ID",          Width:60,      Align:"Center",       InsertEdit:0,       UpdateEdit:0};
  arrC[col++] = {Header:"<com:label key='emp_nm' def='성명' />",            Type:"Text",        SaveName:"EMP_NM",          Width:70};
  arrC[col++] = {Header:"<com:label key='sta_ymd' def='시작일' />",         Type:"Date",        SaveName:"STA_YMD",         Width:90,      Align:"Center"};
  arrC[col++] = {Header:"<com:label key='end_ymd' def='종료일' />",         Type:"Date",        SaveName:"END_YMD",         Width:90,      Align:"Center"};
  arrC[col++] = {Header:"<com:label key='equip_cd' def='장비코드' />",      Type:"Text",        SaveName:"EQUIP_CD",       Width:70};
  arrC[col++] = {Header:"<com:label key='note' def='비고' />",              Type:"Text",        SaveName:"NOTE",            Width:100,     EditLen:500};
  // 1500Byte -> 한글(자당 3byte) / 500글자
  arrC[col++] = {Header:"<com:label key='last_br_yn_01' def='최종여부' />",     Type:"Text",             SaveName:"LAST_YN",            Align:"Center"};
  arrC[col++] = {Header:"<com:label key='delete' def='삭제'/>",              Type:"DelCheck",    SaveName:"CDELETE",         Width:45};
  arrC[col++] = {Header:"<com:label key='stat_cd' def='상태' />",            Type:"Status",      SaveName:"CSTATUS",         Width:35,      Align:"Center"};
  
  arrC[col++] = {Header:"SEQ_NO",                                           Type:"Text",        SaveName:"SEQ_NO", Hidden:1};
  setCombo("<%=hmPreparedData.get("C_CD")%>", arrC, "C_CD", "N");
  setCombo("<%=hmPreparedData.get("/SY01")%>", arrC, "EMP_TYPE");
  setCombo("<%=hmPreparedData.get("CP_CD")%>", arrC, "BF_C_CD", "N");
  setCombo("<%=hmPreparedData.get("03000")%>", arrC, "RE_TYPE");
  setCombo("<%=hmPreparedData.get("00060")%>", arrC, "COM_NTNL_CD"); //법인국가코드

  var info = {Sort:1,ColMove:1,ColResize:1,HeaderCheck:1};
  initSheetColumn(sheet1, arrC, info, 1);
  sheet1.SetVisible(1); // IBSheet visibe

  inputSetValueAuto("F_STA_YMD", addYmd("<%=TO_YMD%>", "D", -7));
  inputSetValueAuto("F_END_YMD", addYmd("<%=TO_YMD%>", "D", 7));

  // 회사권한정보
  var xs = _xmlCcdAuth = makeXSheetWithXmlText($("#xmlCcdAuth").val());
  makeAuthCombo("S_C_CD", xs.GetEtcData("OP_CD"), xs.GetEtcData("CD_TXT"), Page.C_CD);
  setSelect("S_C_CD", Page.C_CD);

  displayElement("reZone", true);
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
    case "<com:otp value='insert01' />":      // 입력
    {
      var Row = sheetDataInsert(sheet1);
      sheet1.SetCellValue(Row,"STD_YY", "<%=TO_YY%>");
      sheet1.SetCellValue(Row,"EXPT_ENTER_YMD", "<%=TO_YMD%>");
      sheet1.SetCellValue(Row, "C_CD",$('#S_C_CD').val());

      ajaxRequestXSProg($("#S_DSCLASS").val(), "<com:otp value='sh_NTNL_CODE' />",  {}, function(xs){
        var ETC_COM_NTNL_CD = xs.GetEtcData("COM_NTNL_CD");
       // sheet1.SetCellValue(Row, "COM_NTNL_CD",ETC_COM_NTNL_CD);
      });
    }
    break;

    case "<com:otp value='copy01' />":
    {
      var Row = sheet1.DataCopy();
      sheet1.SetCellValue(Row,"STD_YY", "<%=TO_YY%>");
    }
    break;

    case "<com:otp value='save01' />":
    {
      var paramSub = FormQueryStringEnc(document.f1);
        sheet1.DoSave("/commonAction.do", paramSub);
    }
    break;
  </com:auth>
  
    case "<com:otp value='re_sch' />":
    {
      ModalUtil.open({title:"<com:label key='main_quick2' def='채용'/><com:label key='choice' def='선택'/>", url: "/rem/re_step/re_step_160_p01.jsp", param: {S_YY : $('#RE_YY').val(), PROFILE_ID: Page.PROFILE_ID, RE_STAT : "0070", X_HELP_PGM_ID: " "}}, function(rv){
        if(rv != null)
        {
          var grid = rv;
          var RE_SEQ_NO = grid_GetCellValue(grid, 0, "RE_SEQ_NO");

              ajaxRequestXSProg($('#S_DSCLASS').val(), "<com:otp value='enter_plan' />", {S_C_CD: $("#S_C_CD").val(), RE_NO: RE_SEQ_NO, S_PROFILE_ID: Page.PROFILE_ID}, function(xs){
                if(xs.RowCount()== '0'){
                    alert(ajaxMsg("MSG_ALERT_0326")); //해당 채용에는 존재하는 합격자가 없습니다.
                }
                for ( var r = 0; r < xs.RowCount(); r++ )
                {
                  var NewRow = sheetDataInsert(sheet1);

                  sheet1.SetCellValue(NewRow, "EMP_ID", xs.GetCellValue(r, "EMP_ID"));
                  sheet1.SetCellValue(NewRow, "EMP_NM", xs.GetCellValue(r, "NM"));
                  sheet1.SetCellValue(NewRow, "PER_NO", xs.GetCellValue(r, "PER_NO"));
                  //sheet1.SetCellValue(NewRow, "EMP_TYPE", xs.GetCellValue(r, "EMP_TYPE"));
                  //sheet1.SetCellValue(NewRow, "RE_TYPE", xs.GetCellValue(r, "RE_TYPE"));
                  //sheet1.SetCellValue(NewRow, "EXPT_ENTER_YMD", xs.GetCellValue(r, "EXPT_ENTER_YMD"));
                  sheet1.SetCellValue(NewRow, "SUPT_NO", xs.GetCellValue(r, "SUPT_NO"));
                  sheet1.SetCellValue(NewRow, "RE_SEQ_NO", xs.GetCellValue(r, "RE_NO"));
                }
              });
        }
      });

    }
    break;

    <com:auth btnAuth="PRINT">
    case "<com:otp value='down2excel01' />":  // 엑셀다운로드
    {
      export2excel(sheet1, "<com:otp value='search01' />", "");
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

function sheet1_OnSearchEnd(ErrCode, ErrMsg)
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

function sheet1_OnChange(Row, Col, Value)
{
  var colnm = sheet1.ColSaveName(Col);
  switch ( colnm )
  {
    case "PER_NO":
    {
      if( ! checkJuminNo(Value))
      {
        if( !confirm(ajaxMsg("MSG_CONFIRM_INVALID_PER_NO")) )
        {
          sheet1.SetCellValue(Row,"PER_NO", "", 0);
          return false;
        }
      }

      // 중국 주민번호 유효성검사 추가
      // 2013-03-06 서영준 ( HCG )
      <%--
      else
      {

          ajaxRequestXSProg($("#S_DSCLASS").val(), "chkPerNo",  {S_PER_NO:Value}, function(xs){
      var isNum = xs.GetEtcData("ISNUM");
      var LENG = xs.GetEtcData("LENG");
      var BIRTH_YN = xs.GetEtcData("BIRTH_YN");

      // 1. 18자리 확인
              if(LENG != 18)
            {
              alert(ajaxMsg("MSG_CONFIRM_INVALID_PER_NO2"));
              sheet1.SetCellValue(Row,"PER_NO", "", 0);
              return false;
            }
             // 2. 17번째 자릿수 숫자여부 판단 ( 성별 )
             // 3. 7번째 ~ 14번째 자리 숫자 판단 ( 생년월일 )
              if(isNum == "F" || BIRTH_YN == "F")
            {

              alert(ajaxMsg("MSG_CONFIRM_INVALID_PER_NO2"));
              sheet1.SetCellValue(Row,"PER_NO", "", 0);
              return false;
            }
           });

      }
      --%>
    }
    break;
    case "EMP_ID":
    {
      if(Value == "") return
      var s_emp_id = sheet1.GetCellValue(Row,"EMP_ID");
    }
    break;
  }
}
</script>
</head>
<body >
<form id="f1" name="f1" style="margin:0;" onSubmit="return false;" >
<input type="hidden" id="S_DSCLASS"        name="S_DSCLASS"         value="<com:otp value="biz.pas.pa_bas.Pa_bas_120_ul01" />" />
<input type="hidden" id="S_DSMETHOD"       name="S_DSMETHOD" />
<input type="hidden" id="S_SAVENAME"       name="S_SAVENAME" />
<input type="hidden" id="S_C_CD"           name="S_C_CD"            value="<%=ehrbean.getCCD()%>" />
<input type="hidden" id="S_COM_NTNL_CD"    name="S_COM_NTNL_CD"     value="<%=ehrbean.get("COM_NTNL_CD")%>" />
<input type="hidden" id="S_LANG_TYPE"      name="S_LANG_TYPE"       value="<%=ehrbean.get("LANG_TYPE")%>" />
<div class="wbox">
   <div class="hbox overflow" id="searchhbox" boxsize="80" >
    <!--// 타이틀 -->
    <div class="headTit">
      <h2 class="titA">
        <%=StringUtil.nvl(request.getParameter("X_MENU_NM"), resourceLabel.getString("crt_emp_id"))%>
      </h2>
    </div>
    <!-- 타이틀 //-->
    <!--// search -->
    <div class="search_typeA clearFix">
      <div class="searchA">
        <div class="sch_area" onKeyDown="if(enterKeyDown(event))doAction('<com:otp value='search01' />');">
          <!--// 1줄의 검색조건 -->
          <div class="clearFix">
            <span class="item_area">
              <span class="point_opt"><com:label key="period" def="기간" /></span>
              <span class="input_area">
                <input type="text" id="F_STA_YMD" name="F_STA_YMD" class="intxt format" key_field="Y" data_format="dfDateYmd" korname="<com:label key='search_sta_ymd' def='조회시작일' />" /> ~
                <input type=text id="F_END_YMD" name="F_END_YMD" class="intxt format" key_field="Y" data_format="dfDateYmd" korname="<com:label key='search_end_ymd' def='조회종료일' />" />
                <input type=button id="click_Ymd" onclick=setYmdPeriod($(this)); class="btn_period" value="<com:label key='period_sel' def='기간선택' />" >
              </span>
            </span>
            <!-- 성명/사번 -->
            <span class="item_area">
             <span class="point_opt"><com:label key='jsp_label_03119' def='성명/사번' /></span>
                <jsp:include page="/sys/sy_com/sy_com_181_c01.jsp" flush="true" >
                <jsp:param name="S_MODE01" value="0060" />
                <jsp:param name="S_REQUIRED" value="N" />
                <jsp:param name="S_SIZE" value="10" />
                </jsp:include>
            </span>
          </div>
        </div>
          <span class="btn_search"><com:auth btnAuth="READ"><input type="button" onFocus="blur()" class="search" value="<com:label key='search' def='조회' />" onclick=doAction("<com:otp value='search01' />"); /></com:auth></span>
      </div>
    </div>
    <!-- search //-->
  </div>
  <div class="hbox" boxsize="35">
    <div class="headTit">
        <h3 class="titB">
          <%=StringUtil.nvl(request.getParameter("X_MENU_NM"), resourceLabel.getString("crt_emp_id"))%>
        </h3>
      <div class="btn_areaR">
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
</form>
<div class="hiddenZone">
  <textarea id="xmlCcdAuth" >
    <%=hmPreparedData.get("xmlCcdAuth")%>
  </textarea>
</div>
</body>
</html>