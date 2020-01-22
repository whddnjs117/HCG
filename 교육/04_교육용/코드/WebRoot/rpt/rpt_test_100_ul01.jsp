<%@page import="hcg.hunel.core.sql.MemResultSet"%>
<%@page language="java" contentType="text/html; charset=utf-8" %>
<%@include file="/common/jsp/header.jsp"%>
<%--
/***********************************************************************
Program Name  : rpt_test_100_ul01.jsp
Description   : 유니폼 신청 관리
Author        : 소인성
History       : 2019.12.18 신규개발
***********************************************************************/
--%>
<html>
<head>
<title>유니폼 신청 관리</title>
<%@include file="/common/jsp/commonResource.jsp"%>
<script language="javascript">
function LoadPage()
{
  var cfg = {SearchMode:2,Page:50,FrozenCol:5};
  sheet1.SetConfig(cfg);
  var arrC = new Array;
  var col = 0;
  arrC[col++] = {Header:"No",                                                     Type:"Seq",         SaveName:"CSEQ",            Width:35,        Align:"Right"};
  arrC[col++] = {Header:"<com:label key='choice' def='선택' />",                  Type:"CheckBox",    SaveName:"CCHK",            Width:40,        Align:"Center",        HeaderCheck:0};
  arrC[col++] = {Header:"<com:label key='emp_id' def='사번' />",                  Type:"Text",        SaveName:"EMP_ID",          Width:60,        Align:"Center",        InsertEdit:0,          UpdateEdit:0};
  arrC[col++] = {Header:"<com:label key='emp_nm' def='성명' />",                  Type:"Popup",       SaveName:"EMP_NM",          Width:60,        Align:"Center",        UpdateEdit:0, KeyField:1};
  arrC[col++] = {Header:"<com:label key='org_nm' def='조직' />",                  Type:"Text",        SaveName:"ORG_NM",          Width:100,       Align:"Center",        InsertEdit:0,          UpdateEdit:0};
  arrC[col++] = {Header:"<com:label key='emp_grade_nm' def='직급' />",            Type:"Text",        SaveName:"EMP_GRADE_NM",    Width:60,        Align:"Center",        InsertEdit:0,          UpdateEdit:0};
  arrC[col++] = {Header:"<com:label key='duty_nm' def='직책' />",                 Type:"Text",        SaveName:"DUTY_NM",         Width:60,        Align:"Center",        InsertEdit:0,          UpdateEdit:0};
  arrC[col++] = {Header:"<com:label key='in_type' def='입력구분' />",             Type:"Combo",       SaveName:"IN_TYPE",         Width:65,        Align:"Center",        InsertEdit:0,          UpdateEdit:0};
  arrC[col++] = {Header:"신청일",                                                 Type:"Date",        SaveName:"APPL_YMD",        Width:95,        Align:"Center",        Format:"Ymd",          InsertEdit:0,          UpdateEdit:0};
  arrC[col++] = {Header:"수령일",                                                 Type:"Date",        SaveName:"RPT_YMD",         Width:95,        Align:"Center",        Format:"Ymd",          InsertEdit:1,          UpdateEdit:0};
  arrC[col++] = {Header:"지급회차명",                                             Type:"Combo",       SaveName:"RPT_STD_CD",      Width:140,       Align:"Center",        KeyField:1,            InsertEdit:1,          UpdateEdit:0};
  arrC[col++] = {Header:"유니폼|브랜드",                                          Type:"Combo",       SaveName:"RPT_BRAND",       Width:60,        Align:"Center",        KeyField:1,            InsertEdit:1,          UpdateEdit:0};
  arrC[col++] = {Header:"유니폼|사이즈",                                          Type:"Combo",       SaveName:"RPT_SIZE",        Width:50,        Align:"Center",        KeyField:1,            InsertEdit:1,          UpdateEdit:0};
  arrC[col++] = {Header:"유니폼|수량",                                            Type:"Int",         SaveName:"RPT_CNT",         Width:50,        Align:"Center",        InsertEdit:1,          UpdateEdit:0, Format:"Integer"};
  arrC[col++] = {Header:"<com:label key='note' def='비고' />",                    Type:"Text",        SaveName:"NOTE",            Width:110,       Align:"Left",          InsertEdit:1};
  arrC[col++] = {Header:"지급여부",                                               Type:"CheckBox",    SaveName:"RPT_YN",          Width:70,        Align:"Center",        InsertEdit:0,          UpdateEdit:1};
  arrC[col++] = {Header:"<com:label key='delete' def='삭제' />",                  Type:"DelCheck",    SaveName:"CDELETE",         Width:45,        Align:"Center"};
  arrC[col++] = {Header:"<com:label key='stat_cd' def='상태' />",                 Type:"Status",      SaveName:"CSTATUS",         Width:35,        Align:"Center"};
  arrC[col++] = {Header:"<com:label key='emp_grade_cd' def='직급코드' />",        Type:"Text",        SaveName:"EMP_GRADE_CD",    Hidden:1};
  arrC[col++] = {Header:"<com:label key='duty_cd' def='직책코드' />",             Type:"Text",        SaveName:"DUTY_CD",         Hidden:1};
  arrC[col++] = {Header:"<com:label key='org_id' def='조직ID' />",                Type:"Text",        SaveName:"ORG_ID",          Hidden:1};
  arrC[col++] = {Header:"DATA_ID",                                                Type:"Text",        SaveName:"DATA_ID",         Hidden:1};
  arrC[col++] = {Header:"APPL_ID",                                                Type:"Text",        SaveName:"APPL_ID",         Hidden:1};
  
  setCombo("<%=hmPreparedData.get("SY110")%>", arrC, 'IN_TYPE', 'N');
  setCombo("<%=hmPreparedData.get("/RPT10")%>", arrC, 'RPT_STD_CD', 'N');
  setCombo("<%=hmPreparedData.get("/RPT20")%>", arrC, 'RPT_SIZE', 'N');
  setCombo("<%=hmPreparedData.get("/RPT30")%>", arrC, 'RPT_BRAND', 'N');
  
  sheet1.SetMergeSheet(msHeaderOnly);
  
  var info = {Sort:1,ColMove:1,ColResize:1,HeaderCheck:1};
  
  initSheetColumn(sheet1, arrC, info, 2);
  
  setCombo("<%=hmPreparedData.get("SY110")%>", 'S_IN_TYPE', null, "A");
  setCombo("<%=hmPreparedData.get("/RPT10")%>", 'S_RPT_STD_CD', null, 'A');
  setCombo("<%=hmPreparedData.get("/RPT20")%>", 'S_RPT_SIZE', null, 'A');
  setCombo("<%=hmPreparedData.get("/RPT30")%>", 'S_RPT_BRAND', null, 'A');
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
    
    <com:auth btnAuth="WRITE">
    //입력
    case "<com:otp value='insert01' />":
    {
      var Row = sheetDataInsert(sheet1);
      sheet1.SetCellValue(Row, "APPL_YMD", "<%=TO_YMD%>");
      sheet1.SetCellValue(Row, "IN_TYPE", "10");
      sheet1.SetCellValue(Row, "NOTE", "관리자 일괄 신청");
      sheet1.SetCellValue(Row, "RPT_CNT", 1);
    }
    break;
    
    //복사
    case "<com:otp value='copy01' />":
    {
      var Row = sheet1.DataCopy();
      sheet1.SetCellValue(Row, "IN_TYPE", "10");
    }
    break;
    
    // 저장
    case "<com:otp value='save01' />":
    {
      if ( ! checkForm("f1") ) return;
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
      export2excel(sheet1, "<com:otp value='search01' />", "유니폼신청관리", null);
    }
    break;
    </com:auth>
  }
}
function sheet1_OnPopupClick(Row, Col)
{ 
  var colnm = sheet1.ColSaveName(Col);
  switch ( colnm )
  {
    case "EMP_NM":
    {
      ModalUtil.open({title:"<com:label key='search_emp' def='직원찾기' />", url: "/sys/sy_com/sy_com_150_p01.jsp"}, function(rv){
        if(rv != null)
        {
          var grid = rv;
          for ( var r = 0; r < grid.RowCount; r++ )
          {
            sheet1.SetCellValue(Row, "EMP_ID", grid_GetCellValue(grid, r, "EMP_ID"));
            sheet1.SetCellValue(Row, "EMP_NM", grid_GetCellValue(grid, r, "EMP_NM"));
            sheet1.SetCellValue(Row, "ORG_ID", grid_GetCellValue(grid, r, "ORG_ID"));
            sheet1.SetCellValue(Row, "ORG_NM", grid_GetCellValue(grid, r, "ORG_NM"));
            sheet1.SetCellValue(Row, "EMP_GRADE_NM", grid_GetCellValue(grid, r, "EMP_GRADE_NM"));
            sheet1.SetCellValue(Row, "DUTY_NM", grid_GetCellValue(grid, r, "DUTY_NM"));
            break;
          }
        }
      });
    }
    break;
  }
}

function sheet1_OnSearchEnd(ErrCode, ErrMsg)
{
  if ( ! doCheckMsg(ErrMsg) ) return;
  if ( ErrCode )
  {
    alert(ajaxMsg("MSG_ALERT_SEARCH_FAIL") +(ErrMsg ? "\n\n"+ ErrMsg : ""));
  }
  else
  {
    // 신청서 입력 구분에 따른 수정 가능 여부 Validation
    sheetEachRow(sheet1, function(r, x){
      x.SetCellEditable(r, "RPT_YMD", x.GetCellValue(r, "IN_TYPE") == "10" ? 1 : 0);
      x.SetCellEditable(r, "NOTE", x.GetCellValue(r, "IN_TYPE") == "10" ? 1 : 0);
    });
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

function sheet1_OnChange(Row, Col, Value)
{
  var colnm = sheet1.ColSaveName(Col);
  switch( colnm )
  {
    // 지급신청일자에 대한 내용
    case "RPT_YMD" :
    {
      if(sheet1.GetCellValue(Row, "RPT_YMD") == "") return;
      
      if(!sheet1.GetCellValue(Row, "EMP_ID"))
      {
        if(sheet1.GetCellValue(Row, "RPT_YMD"))
        {
          alert("사원을 선택해주십시오.");
          sheet1.SetCellValue(Row, "RPT_YMD", "");
        }
      }
      else
      {
        if(sheet1.GetCellValue(Row, "RPT_YMD") < "<%=TO_YMD%>")
        {
          alert("수령일은 신청일보다 작을 수 없습니다. 1주일 후로 자동 설정됩니다.");
          sheet1.SetCellValue(Row, "RPT_YMD", addYmd("<%=TO_YMD%>", "D", 7));
          return;
        }
      }
    }
    break;
    
    // 지급회차명에 대한 내용
    case"RPT_STD_CD" :
    {
      if(!sheet1.GetCellValue(Row, "EMP_ID"))
      {
        if(sheet1.GetCellValue(Row, "RPT_YMD"))
        {
          alert("사원을 선택해주십시오.");
          sheet1.SetCellValue(Row, "RPT_YMD", "");
        }
      }
    }
    break;
  }
}
</script>
</head>
<body >
  <form id="f1" name="f1" onSubmit="return false;">
    <input type="hidden" id="S_DSCLASS" name="S_DSCLASS" value="<com:otp value='biz.rpt.Rpt_test_100_ul01' />" />
    <input type="hidden" id="S_DSMETHOD" name="S_DSMETHOD" />
    <input type="hidden" id="S_SAVENAME" name="S_SAVENAME" />
    <div class="wbox">
      <div class="hbox" boxsize="104">          
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
                <span class="item_area">
                  <jsp:include page="/sys/sy_com/sy_com_181_c01.jsp" flush="true">
                    <jsp:param name="S_MODE01" value="0010" />
                    <jsp:param name="S_REQUIRED" value="N" />
                  </jsp:include>
                  <script>
                  function OnEmpInfo01()
                    {
                      if ( $("#S_EMP_ID").val() )
                      {
                        doAction("<com:otp value='search01' />");
                      }
                    }
                  </script>
                </span>
                <jsp:include page="/sys/sy_com/sy_com_182_c01.jsp" flush="true">
                  <jsp:param name="S_MODE01" value="0020" />
                  <jsp:param name="S_REQUIRED" value="N" />
                </jsp:include>
                <span class="item_area">
                  <span class="point_opt"><com:label key='enter_class' def='입력구분' /></span>
                  <span class="input_area">
                    <select id="S_IN_TYPE" name="S_IN_TYPE" class="insert_select"></select>
                  </span>
                </span>
              </div>
              <div class="clearFix">
                <span class="item_area">
                  <span class="point_opt">지급회차명</span>
                  <span class="input_area">
                    <select id="S_RPT_STD_CD" name="S_RPT_STD_CD" class="insert_select"></select>
                  </span>
                </span>
                <span class="item_area">
                  <span class="point_opt">유니폼 브랜드</span>
                  <span class="input_area">
                    <select id="S_RPT_BRAND" name="S_RPT_BRAND" class="insert_select"></select>
                  </span>
                </span>
                <span class="item_area">
                  <span class="point_opt">유니폼 사이즈</span>
                  <span class="input_area">
                    <select id="S_RPT_SIZE" name="S_RPT_SIZE" class="insert_select"></select>
                  </span>
                </span>
                <span class="item_area">
                  <span class="point_opt">지급완료만 조회</span>
                  <span class="input_area">
                    <input type="checkbox" id="S_RPT_YN" name="S_RPT_YN" value="Y"/>
                  </span>
                </span>
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
            <span class="btn"><input type="button" value="<com:label key='insert' def='추가' />" onClick="doAction('<com:otp value='insert01' />');" class="insert" BA_TYPE="WRITE" /></span>
            <span class="btn"><input type="button" value="<com:label key='copy' def='복사' />" onClick="doAction('<com:otp value='copy01' />');" class="copy" BA_TYPE="WRITE" /></span>
            <span class="btn"><input type="button" value="<com:label key='save' def='저장' />" onClick="doAction('<com:otp value='save01' />');" class="save" BA_TYPE="WRITE" /></span>
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
      <div class="hbox" boxsize="95">
        <dl class="infoCmt">
          <dt><com:label key='use_info' def='사용안내' /></dt>
          <dd>
              <ul>
                <li>개인이 작성한 신청서는 담당자가 <strong>수정할 수 없으며</strong>, 직접 입력한 내용만 수정이 가능합니다.</li>   
                <li>수정의 경우 지급신청일을 먼저 변경한 뒤 지급회차명, 유니폼명을 <strong>순차적</strong>으로 진행해야 합니다.</li>
                <li>지급신청일이 현재보다 이전이라면 <strong>오늘</strong>로 강제변경됩니다.</li>   
             </ul>
          </dd>
       </dl>
      </div>
      <!-- 그리드 //-->
    </div>
  </form>
</body>
</html>