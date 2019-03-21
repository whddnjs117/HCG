<%@page import="hcg.hunel.core.sql.MemResultSet"%>
<%@page language="java" contentType="text/html; charset=utf-8" %>
<%@include file="/common/jsp/header.jsp"%>
<%--
/***********************************************************************
 Program Name  : pr_bas_100_ul01.jsp
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
  arrC[col++] = {Header:"No.",                                               Type:"Seq",         SaveName:"CSEQ",            Width:35,      Align:"Right",        InsertEdit:0,       UpdateEdit:0};
  arrC[col++] = {Header:"<com:label key='emp_id' def='사번' />",             Type:"Text",       SaveName:"EMP_ID",           Width:60,      Align:"Center",       InsertEdit:0,       UpdateEdit:0};
  arrC[col++] = {Header:"<com:label key='emp_nm' def='성명' />",             Type:"Text",        SaveName:"EMP_NM",          Width:70};
  arrC[col++] = {Header:"<com:label key='sta_ymd' def='시작일' />",          Type:"Date",        SaveName:"STA_YMD",         Width:90,      Align:"Center"};
  arrC[col++] = {Header:"<com:label key='end_ymd' def='종료일' />",          Type:"Date",        SaveName:"END_YMD",         Width:90,      Align:"Center"};
  arrC[col++] = {Header:"<com:label key='equip_cd' def='장비코드' />",       Type:"Text",        SaveName:"EQUIP_CD",        Width:70};
  arrC[col++] = {Header:"<com:label key='note' def='비고' />",               Type:"Text",        SaveName:"NOTE",            Width:100,     EditLen:500};
  // 1500Byte -> 한글(자당 3byte) / 500글자
  // IBSheetHTML개발자가이드_V7.0.13.x
  arrC[col++] = {Header:"<com:label key='last_br_yn_01' def='최종여부' />",  Type:"Combo",       SaveName:"LAST_YN",         Width:80,      Align:"Center"};
  arrC[col++] = {Header:"<com:label key='delete' def='삭제'/>",              Type:"DelCheck",    SaveName:"CDELETE",         Width:45};
  arrC[col++] = {Header:"<com:label key='stat_cd' def='상태' />",            Type:"Status",      SaveName:"CSTATUS",         Width:35,      Align:"Center"};
  arrC[col++] = {Header:"SEQ_NO",                                            Type:"Text",        SaveName:"SEQ_NO",          Hidden:1};

  // 공통 코드는 /SY99 임
  setCombo("<%=hmPreparedData.get("/SY99")%>", arrC, 'LAST_YN', '1');

  var info = {Sort:1,ColMove:1,ColResize:1,HeaderCheck:1};  // HeaderCheck가 0이면 비활성화 됨
  initSheetColumn(sheet1, arrC, info, 1); // common.js에 정의되어 있음
  // Sheet 컬럼의 정보는 무조건 initSheetColumn 함수 위에 존재해야한다.
  // form에 그리는 함수는 상관 없다.
  sheet1.SetVisible(1); // IBSheet visibe

  
  /********************************************* 시트정의 끝 *********************************************/
  
 
<%--   inputSetValueAuto("F_STA_YMD", addYmd("<%=TO_YMD%>", "D", -7)); --%>
<%--   inputSetValueAuto("F_END_YMD", addYmd("<%=TO_YMD%>", "D", 7)); --%>
  // 기간 조회 default 값 설정
  inputSetValueAuto("F_STA_YMD", "<%=TO_YY%>" + "0101");
  inputSetValueAuto("F_END_YMD", "<%=TO_YY%>" + "1231");

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
      var Row = sheetDataInsert(sheet1);  // 시트 로우 추가, common.js 에 정의되어있음, 절대 인덱스를 리턴함
      sheet1.SetCellValue(Row,"STA_YMD", "<%=TO_YY%>" + "0101");
      sheet1.SetCellValue(Row,"END_YMD", "<%=TO_YY%>" + "1231");
      sheet1.SetCellValue(Row,"LAST_YN", "N");
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
  // 휴넬 공통코드, 에러를 체크하고 에러가 있으면 메세지를 출력한다.
  // 코드를 수정할 일은 절대 없음. 그대로 가져다 쓰면 됨
  if ( ! doCheckMsg(ErrMsg) ) return;
  if ( ErrCode )
  {
    alert(ajaxMsg("MSG_ALERT_SEARCH_FAIL") + (ErrMsg ? "\n\n"+ ErrMsg : ""));
  }
  // 다음 로직을 추가할 것이라면 else 문으로 함
//   else
//     alert("조회완료!");
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
  }
}
</script>
</head>
<body >
<form id="f1" name="f1" style="margin:0;" onSubmit="return false;" >

<input type="hidden" id="S_DSCLASS"        name="S_DSCLASS"         value="<com:otp value="biz.pre.pr_bas.Pr_bas_100_ul01" />" />
<input type="hidden" id="S_DSMETHOD"       name="S_DSMETHOD" />
<input type="hidden" id="S_SAVENAME"       name="S_SAVENAME" />

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
</body>
</html>