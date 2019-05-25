<%@page language="java" contentType="text/html; charset=utf-8" %>
<%@include file="/common/jsp/header.jsp"%>
<%--
Program Name  : be_gif_002_m01.jsp
Description   : 명절선물 신청/승인
Author        : 박영환
History       : 2007-11-16
                2014-04-22 박종영 - 고도화
--%>
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
  setCombo("<%=hmPreparedData.get("/GI01")%>", 'S_GIF_TYPE', null, 'N');

  enableInput("F_GIF_MON",false);
  Apply.init();

  if ( $("#S_APPL_ID").val() ) {//APPL_ID가 없으면 신청서추가 상태
      
  } else {
  
  }

  /*
  $(window).resize(function(){
    setTimeout(function(){
      $("#contentsHbox").attr("boxsize", $("#contentsTable")[0].clientHeight);
      Layout.resize();
    }, 100);
  });
  */
}


/**
 * 신청서 공통 조회 함수
 * @param applStatus - 신청서 현상태 코드
 * @param isReapply - 반려데이터 재신청 여부
 * @comment - 신청서 공통처리후 조회함수를 doSearch함수를 호출함.
 */
function doSearch(applStatus, isReapply) {
   
    var isPrintYn = ($("#S_APPL_ID").val() != null && $("#S_APPL_MODE").val() == "APPL" && applStatus == Apply.Complete);
    
    var isDisabled = (Apply.ApplMode == "APPL" && applStatus > Apply.TempSave)||(Apply.ApplMode != "APPL");
    ajaxSyncRequestXS($("#S_DSCLASS").val(), "<com:otp value='search01' />", {S_APPL_ID:$("#S_APPL_ID").val()}, function(xs){
        
        if ( isReapply ) {
            $("#S_APPL_ID").val(""); //반려 재신청의 경우 ID 초기화
        }
        
        if (xs.RowCount() != 0) {
            $("[entry]").each(function(idx, elem){
              if($(elem).attr("type")!="button"){
                  inputSetValueAuto(this.id, xs.GetCellValue(0, this.id.substr(2)));
              }
                if ( isDisabled ) {
                    enableInput(this.id, false);
                }
            });
        } else {
            alert("신청 데이터가 존재하지 않습니다."); return;
        }
    });

}

function doAction2(sAction)
{
  inputAutoUnformat("f1");
  switch(sAction)
  {
      case "<com:otp value='gifType' />":
      {
          ajaxRequestXSProg($("#S_DSCLASS").val(), "<com:otp value='gifType' />", serializeForm(), function(xs)
          {
            setTimeout(function()
            {
              inputSetValueAuto('F_GIF_MON', xs.GetEtcData("GIF_MON"));
              $("#F_GIF_MON").val( $("#F_GIF_MON").val() || "0");
            }, 1);
          });
      }
      break;
  }
}
</script>
</head>
<body >
<form id="f1" name="f1" onSubmit="return false;">
<input type="hidden" id="S_DSCLASS" name="S_DSCLASS" value="<com:otp value='biz.bsi.be_gif.Be_gif_002_m01' />" >
<input type="hidden" id="S_DSMETHOD" name="S_DSMETHOD" >
<input type="hidden" id="S_TARGET_EMP_ID" name="S_TARGET_EMP_ID" value="<%=StringUtil.nvl(request.getParameter("S_LOGIN_EMP_ID"), ehrbean.get("EMP_ID"))%>" >
<input type="hidden" id="S_TARGET_EMP_NM" name="S_TARGET_EMP_NM" value="<%=StringUtil.nvl(request.getParameter("S_LOGIN_EMP_NM"), ehrbean.get("EMP_NM"))%>" >
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
            <col width="28%" />
            <col width="*" />
          </colgroup>
          <tr>
            <th class="blt"> <com:label key='gif_mon' def='명절선물' /></th>
            <td ><select class="insert_select" id="S_GIF_TYPE" name="S_GIF_TYPE" korname="명절선물" entry key_field="Y" onChange="doAction2('<com:otp value='gifType' />');"></select></td>
          </tr>
          <tr>
            <th class="blt" nowrap> <com:label key='com_mon' def='회사지원금' /></th>
            <td>
              <input type="text" class="intxt format" id="F_GIF_MON" name="F_GIF_MON" entry appr data_format="dfInteger" key_field="Y" korname="<com:label key='com_mon' def='회사지원금' />" maxlength="13">
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