<%@page import="hcg.hunel.core.util.*"%>
<%@page import="biz.user.*"%>
<%@page language="java" contentType="text/html; charset=utf-8"  isELIgnored="true"  %>
<%
String MESSAGE_LANG_TYPE  = "";
%>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" >
<meta http-equiv="Cache-Control" content="No-Cache" >
<meta http-equiv="Pragma" content="No-Cache" >
<meta name="robots" content="noindex,nofollow" /><%
{
  EHRBean ehrbean2 = EHRLogin.getLoginBean(request);
  MyPage mypage2 = (MyPage)request.getAttribute("mypage");
  if ( ehrbean2 != null && mypage2 != null )
  {
  MESSAGE_LANG_TYPE = "_"+ehrbean2.get("LANG_TYPE");
%><script type='text/javascript' >
var __base_dir = '/';
if ( window.Page == undefined )
{
  Page =
  {
    C_CD: "<%=ehrbean2.getCCD()%>",
    LANG: "<%=ehrbean2.get("LANG_TYPE")%>",
    SKIN_PATH: "<%=mypage2.get("SKIN_PATH")%>",
    PROFILE_ID: "<%=mypage2.get("PROFILE_ID")%>",
    MODULE_ID: "<%=mypage2.get("MODULE_ID")%>",
    AUTH_ADMIN_YN: "<%=ehrbean2.get("AUTH_ADMIN_YN")%>",
    MENU_ID: "<%=mypage2.get("MENU_ID")%>",
    PGM_ID: "<%=mypage2.get("PGM_ID")%>",
    SQL_ID: "<%=mypage2.get("SQL_ID")%>",
    PRS_ID: "<%=mypage2.get("PRS_ID")%>",
    EMP_SCH_AUTH_CD: "<%=mypage2.get("EMP_SCH_AUTH_CD")%>",
    //버튼로그 관련 시작
    BUTTON_LOG_YN: "<%=mypage2.get("BUTTON_LOG_YN")%>",
    PGM_BTN_LOG_YN: "<%=mypage2.get("PGM_BTN_LOG_YN")%>",
    //버튼로그 관련 끝
    NTNL_CD: "<%=ehrbean2.get("COM_NTNL_CD")%>",
    EMP_TYPE: "<%=ehrbean2.get("EMP_TYPE")%>",
    GEN_YN: "<%=mypage2.get("GEN_YN")%>",
    ENC_VAL: "<%=mypage2.get("ENC_VAL")%>",
    ENC_VAL2: "<%=mypage2.get("ENC_VAL2")%>",
    PGM_URL: "<%=mypage2.get("PGM_URL")%>",
    POP_URL: "<%=mypage2.get("POP_URL")%>",
    HELP_PGM_ID : "<%=mypage2.get("HELP_PGM_ID")%>",
    HELP_MSG : "<%=hmPreparedData.get("HELP_MSG")%>"
  }
}
</script><%
  }
}
%>
<script type='text/javascript' >
(function()
{
  var __base_dir = '/';
  var SKIN_PATH = (window.Page && Page.SKIN_PATH) || __base_dir+"resource";
  document.writeln("<link href=\""+__base_dir+"common/css/jquery-ui.css\" rel=stylesheet type=text/css >");
  document.writeln("<link href=\""+__base_dir+"common/css/skin.css\" rel=stylesheet type=text/css >");
  document.writeln("<link href=\""+__base_dir+"common/css/multiple-select.css\" rel=stylesheet type=text/css >");
  //document.writeln("<script type='text/javascript' src='"+__base_dir+"common/js/jquery-3.1.1.min.js'><"+"/script>");
  document.writeln("<script type='text/javascript' src='"+__base_dir+"common/js/jquery-1.12.4.min.js'><"+"/script>");
  document.writeln("<script type='text/javascript' src='"+__base_dir+"common/js/jquery.ui.classy.protify.json2.js'><"+"/script>");
  document.writeln("<script type='text/javascript' src='"+__base_dir+"common/js/layout.js'><"+"/script>");
  document.writeln("<script type='text/javascript' src='"+__base_dir+"common/js/common.js'><"+"/script>");
  document.writeln("<script type='text/javascript' src='"+__base_dir+"common/js/ibchart_com.js'><"+"/script>");
//  document.writeln("<script type='text/javascript' src='"+__base_dir+"common/js/message.js'><"+"/script>    ");
  document.writeln("<script type='text/javascript' src='"+__base_dir+"common/Sheet/ibleaders.js'><"+"/script>");
  document.writeln("<script type='text/javascript' src='"+__base_dir+"common/Sheet/ibsheet.js'><"+"/script>");
  document.writeln("<script type='text/javascript' src='"+__base_dir+"common/Sheet/ibsheetinfo.js'><"+"/script>");
  document.writeln("<script type='text/javascript' src='"+__base_dir+"common/ibchart/ibchart.js'><"+"/script>");
  document.writeln("<script type='text/javascript' src='"+__base_dir+"common/ibchart/ibchartinfo.js'><"+"/script>");
  document.writeln("<script type='text/javascript' src='"+__base_dir+"common/js/multiple-select.js'><"+"/script>");
  
<%
  if("Y".equals(HUNEL_DEV_TOOL_USE_YN))
  {
  %>
    if(!!(document.createElement('canvas').getContext && document.createElement('canvas').getContext('2d')))
    {
      document.writeln("<script type='text/javascript' src='"+__base_dir+"common/js/html2canvas.min.js'><"+"/script>");
    }
  <%
  }
%>
})();
var S_PGM_OPEN_TIME = "<%=StringUtil.nvl((String) request.getAttribute("S_PGM_OPEN_TIME"),"")%>";
var S_ENC_OTP_KEY   = "<%=StringUtil.nvl((String) request.getAttribute("S_ENC_OTP_KEY"),"")%>";
var S_CSRF_SALT     = "<%=StringUtil.nvl((String) request.getAttribute("csrfPreventionSalt"),"")%>";
var HUNEL_DEV_TOOL_USE_YN = "<%=HUNEL_DEV_TOOL_USE_YN%>";

var commonOtpVal = {
    Sy_com_182_c01      : "<com:otp value='biz.sys.sy_com.Sy_com_182_c01'/>"
  , Sy_com_181_c01      : "<com:otp value='biz.sys.sy_com.Sy_com_181_c01'/>"
  , Sys_file_common     : "<com:otp value='biz.sys.Sys_file_common'/>"
  , Sys_common          : "<com:otp value='biz.sys.Sys_common'/>"
  , UserDS              : "<com:otp value='biz.user.UserDS'/>"
  , CheckExcelEmpId     : "<com:otp value='CheckExcelEmpId'/>"
  , comboAuthOrg        : "<com:otp value='comboAuthOrg'/>"
  , logProgramBtn       : "<com:otp value='logProgramBtn'/>"
  , setOrgInfo01        : "<com:otp value='setOrgInfo01'/>"
  , setOrgInfo02        : "<com:otp value='setOrgInfo02'/>"
  , search_emp01        : "<com:otp value='search_emp01'/>"
  , searchEmp01         : "<com:otp value='searchEmp01'/>"
  , searchEmp02         : "<com:otp value='searchEmp02'/>"
  , searchOrg01         : "<com:otp value='searchOrg01'/>"
  , search_org01        : "<com:otp value='search_org01'/>"
  , searchFileCnt       : "<com:otp value='searchFileCnt'/>"
  , get_emp_info        : "<com:otp value='get_emp_info'/>"
  , getEmp01            : "<com:otp value='getEmp01'/>"
  , getHelpMsg          : "<com:otp value='getHelpMsg'/>"
  , setLoginEmp01       : "<com:otp value='setLoginEmp01'/>"
  , popemp01            : "<com:otp value='popemp01'/>"
  , poporg01            : "<com:otp value='poporg01'/>"
  , saveFileLog         : "<com:otp value='saveFileLog'/>"
  , deleteFile          : "<com:otp value='deleteFile'/>"
};

// 평가관리(pem.js)
var pemOtpVal = {
    Pem_common2         : "<com:otp value='biz.pem.Pem_common2'/>"
  , Pm_exec_600_m01     : "<com:otp value='biz.pem.pm_exec.Pm_exec_600_m01'/>"
  , searchGradCd        : "<com:otp value='searchGradCd'/>"
  , getEmpList          : "<com:otp value='getEmpList'/>"
};
</script>