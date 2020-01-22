<%@page language="java" contentType="text/html; charset=utf-8" %>
<%@include file="/common/jsp/header.jsp"%>
<%--
/***********************************************************************
Program Name  : rpt_test_100_m01.jsp
Description   : 유니폼 지급 신청/결재/승인
Author        : 소인성
History       : 2019.12.18 신규개발
***********************************************************************/
--%>
<%@ page import="java.util.*" %>
<html>
<head>
<title>::::</title>
<%@include file="/common/jsp/commonResource.jsp"%>
<script type='text/javascript' src='/common/js/sys_appl.js'></script>
<script language="javascript">
var isPopup = _isPopup;
if(isPopup) sizeDialog(900, 600);

<%@include file="/sys/sy_appl/sys_appl_000_c01.jsp"%>
function LoadPage()
{
  setCombo("<%=hmPreparedData.get("/RPT10")%>",'S_RPT_STD_CD', null, 'S');
  setCombo("<%=hmPreparedData.get("/RPT20")%>",'S_RPT_SIZE', null, 'S');
  setCombo("<%=hmPreparedData.get("/RPT30")%>",'S_RPT_BRAND', null, 'S');
  
  Apply.init();
  if ( $("#S_APPL_ID").val() )
  {
  }
  else
  {
  }
  
  inputSetValueAuto("S_YY", "<%=TO_YY%>");
  inputSetValueAuto("F_RPT_CNT", 1);
  inputSetValueAuto("F_RPT_YMD", addYmd("<%=TO_YMD%>", "D", 7));
}

/**
 * 신청서 공통 조회 함수
 * @param applStatus - 신청서 현상태 코드
 * @param isReapply - 반려데이터 재신청 여부
 * @comment - 신청서 공통처리후 조회함수를 doSearch함수를 호출함.
 */
function doSearch(applStatus, isReapply)
{
  var isPrintYn = ($("#S_APPL_ID").val() != null && $("#S_APPL_MODE").val() == "APPL" && applStatus == Apply.Complete);
  
  var isDisabled = (Apply.ApplMode == "APPL" && applStatus > Apply.TempSave)||(Apply.ApplMode != "APPL");
  ajaxSyncRequestXS($("#S_DSCLASS").val(), "<com:otp value='search01' />", {S_APPL_ID:$("#S_APPL_ID").val()}, function(xs){
      
    if ( isReapply ) {
        $("#S_APPL_ID").val("");
    }
    
    if (xs.RowCount() != 0)
    {
      $("[entry]").each(function(idx, elem){
        if($(elem).attr("type")!="button")
        {
          inputSetValueAuto(this.id, xs.GetCellValue(0, this.id.substr(2)));
        }
          if ( isDisabled )
          {
            enableInput(this.id, false);
          }
      });
    }
  });
}

function doAction2(sAction)
{
  inputAutoUnformat("f1");
  $("#S_DSMETHOD").val(sAction);
  switch(sAction)
  {
    // 사번/성명 변경시 결재라인 등 재 셋팅
    case "<com:otp value='changeTRG'/>":
    {
      ajaxSyncRequestXS($("#S_DSCLASS").val(), "<com:otp value='changeTRG'/>", {S_EMP_ID:$("#S_TARGET_EMP_ID").val()}, function(xs)
      {
        if (xs.RowCount() != 0)
        {
          inputSetValueAuto("S_AP_EMP_NM", xs.GetCellValue(0, "EMP_NM"));
          inputSetValueAuto("S_AP_EMP_ID", xs.GetCellValue(0, "EMP_ID"));
          inputSetValueAuto("S_ORG_NM", xs.GetCellValue(0, "ORG_NM"));
        }
      });
    }
    break;
  }
}
function change_date()
{
  inputAutoUnformat("F_RPT_YMD");
  if($("#S_RPT_YMD").val() != "")
  {
    if("<%=TO_YMD%>" >= $("#S_RPT_YMD").val())
    {
      alert("수령일은 신청일보다 작을 수 없습니다. 1주일 후로 자동 설정됩니다.");
      inputSetValueAuto("F_RPT_YMD", addYmd("<%=TO_YMD%>", "D", 7));
      return;
    }
  }
}
</script>
</head>
<body >
<form id="f1" name="f1" onSubmit="return false;">
<input type="hidden" id="S_DSCLASS"       name="S_DSCLASS"        value="<com:otp value='biz.rpt.Rpt_test_100_m01' />" >
<input type="hidden" id="S_DSMETHOD"      name="S_DSMETHOD" >
<input type="hidden" id="S_TARGET_EMP_ID" name="S_TARGET_EMP_ID"  value="<%=StringUtil.nvl(request.getParameter("S_EMP_ID"), ehrbean.get("EMP_ID"))%>" >
<input type="hidden" id="S_TARGET_EMP_NM" name="S_TARGET_EMP_NM"  value="<%=StringUtil.nvl(request.getParameter("S_EMP_NM"), ehrbean.get("EMP_NM"))%>" >
<input type="hidden" id="S_APPL_YMD" name="S_APPL_YMD"  value="<%=TO_YMD%>" >

<%@include file="/sys/sy_appl/sys_appl_100_c01.jsp"%>  

  <!--// wbox  -->
  <div class="wbox">
    <!--// 버튼 -->
    <!-- // 신청서 공통 영역 --> 
    <div class="hbox" boxsize="35" id="applButton"></div>
    <div class="hbox" boxsize="125" id="applTop" style="display:none"></div>
    <!-- 신청서 공통 영역 // -->    
    <!-- 버튼 //-->
    <!--// 본문  -->
    <div class="hbox yscroll" id="maincontent">        
      <div class="hbox" id="contentsHbox"  boxsize="400">
        <div class="table_border">
          <table class="table_item" id="contentsTable">
            <colgroup>
              <col width="14%" />
              <col width="10%" />
              <col width="20%" />
              <col width="10%" />
              <col width="14%" />
              <col width="5%" />
              <col width="10%" />
              <col width="14%" />
            </colgroup>
            <tr>
              <th class="blt"><com:label key='jsp_label_03119' def='사번/성명' /></th>
              <td colspan="2">
                <jsp:include page="/sys/sy_com/sy_com_181_c01.jsp" flush="true" >
                <jsp:param name="S_MODE01" value="0060" />
                <jsp:param name="S_REQUIRED" value="N" />
                <jsp:param name="S_PREFIX" value="S_AP" />
                <jsp:param name="S_SIZE" value="8" />
                <jsp:param name="S_FUNCTION" value="changeTRG" />
                </jsp:include>
                <script>
                  function changeTRG()
                  {
                    doAction2("<com:otp value='changeTRG'/>");
                  }
                </script>
              </td>
              <th>
                <com:label key='org_nm_001' def='소속' />
              </th>
              <td colspan="4">
                <input type="text" class="intxt_bg60" id="S_ORG_NM" name="S_ORG_NM" readonly/>
              </td>
            </tr>
            <tr>
              <th class="blt">지급회차명</th>
              <td colspan="2">
                <select class="insert_select" id="S_RPT_STD_CD" name="S_RPT_STD_CD" entry key_field="Y" ></select>
              </td>
              <th>지급년도</th>
              <td colspan="4">
                <input type="text" class="intxt_bg format" id="S_YY" name="S_YY" readonly entry appr data_format="dfDateYy" />
              </td>
            </tr>
            <tr>
              <th>유니폼 선택</th>
              <th class="blt">브랜드</th>
              <td>
                <select class="insert_select" id="S_RPT_BRAND" name="S_RPT_BRAND" entry key_field="Y" ></select>
              </td>
              <th class="blt">사이즈</th>
              <td colspan="2">
                <select class="insert_select" id="S_RPT_SIZE" name="S_RPT_SIZE" entry key_field="Y" ></select>
              </td>
              <th>수량</th>
              <td>
                <input type="text" class="intxt20 format alignR" id="F_RPT_CNT" name="F_RPT_CNT" entry data_format="Integer">
              </td>
            </tr>
            <tr>
              <th>수령일</th>
              <td colspan="7">
                <input type="text" class="intxt format" id="F_RPT_YMD" name="F_RPT_YMD" entry korname="<com:label key='giv_ymd' def='지급 신청일' />" data_format="dfDateYmd"  onblurchange="change_date()">
              </td>
            </tr>
            <tr>
              <th>
                <com:label key='note' def='비고' />
              </th>
              <td colspan="7">
                <input type="text" class="intxt wp90 alignL" id="S_NOTE" name="S_NOTE" entry  />
              </td>
            </tr>
          </table>
        </div>
      </div>        
    </div>
    <!-- 본문 //-->
    </div>
    <!-- wbox  //-->
  </form>
  <!-- 신청서 공통 start -->
  <div class = "hiddenZone" >
    <textarea id="xmlApplTypeInfo"><%=hmPreparedData.get("xmlApplTypeInfo")%></textarea>
  </div>
  <!-- end -->
</body>
</html>