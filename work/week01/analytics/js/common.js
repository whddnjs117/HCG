
__base_dir = '/';
__baseAction = '/commonAction.do';
RD_WEBROOT = location.protocol + "//" + location.host;  //프로젝트시에는 주석해제
//document.domain = location.host;
//RD_WEBROOT = "http://1.234.41.25:8109";           //프로젝트시에는 주석처리
//RD_DB_PARAM = "/rdebugmode 1 /ruseurlmoniker 0 /rcontype [RDAGENT] /rf ["+location.protocol + "//" + location.host+"/RDServer/rdagent.jsp] /rsn [EHR]";
var winOpen ;
var hmAjaxMsg;  //다국어 cache 역할을 하게 될 해쉬맵

/**
 * 정규 표현에 일치하는 부분의 치환을 실행합니다.
 * @method replaceAll
 * @member String
 * @param {String} regex 정규표현식
 * @param {String} replacement 치환문자
 */
String.prototype.replaceAll = function() { 
    var a = arguments, length = a.length;
    if ( length == 0 ) 
    {
        return this;
    }
    var regExp = new RegExp( a[0], "g");
    if ( length == 1 ) 
    {  
      return this.replace(regExp, "");
    } 
    else 
    {
        return this.replace(regExp, a[1]);
    }
    return this;
};

//jquery의 unique 함수가 sort되어 있지 않은 배열에 대해 중복제거를 하지 못하여 unique2로 재정의(kyn)
/**
 * @class jQuery
 */
jQuery.extend({
  /**
   * 배열의 중복을 제거하여 리턴
   * @member jQuery
   * @method unique2
   * @param {Array} arr
   * @return {Array}
   */
  unique2 : function (arr)
  {
    var i;
    var len = arr.length;
    var rtnArr = [];
    var tmp = {};
    for ( i=0;i<len;i++) 
    {
      tmp[arr[i]] = 0;  
    }
    for(i in tmp){
      rtnArr.push(i);
    }
    return rtnArr;
  },
  /**
   * str에 포함된 %s를 arguments로 대체하여 리턴한다.
   * @member jQuery
   * @method sprintf
   * @param {String} str 문자열
   * @param {String} arguments %s를 대체할 문자열들
   * @return {String} 대체된 문자열
   */
  sprintf : function (str) {
    var args = arguments,
        flag = true,
        i = 1;

    str = str.replace(/%s/g, function () {
        var arg = args[i++];

        if (typeof arg === 'undefined') {
            flag = false;
            return '';
        }
        return arg;
    });
    return flag ? str : '';
  }
});

/**
 * userAgent에서 정보를 추출하여 브라우저 정보와 버전 정보를 JSON형태로 리턴
 * @member jQuery
 * @method uaMatch
 * @param {String} ua navigator.userAgent
 * @return {Json} browser,version
 */
jQuery.uaMatch = function( ua ) {
  ua = ua.toLowerCase();

  var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
    /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
    /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
    /(msie) ([\w.]+)/.exec( ua ) ||
    ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
    [];

  return {
    browser: match[ 1 ] || "",
    version: match[ 2 ] || "0"
  };
};

if ( !jQuery.browser ) {
  matched = jQuery.uaMatch( navigator.userAgent );
  var browser = {};

  if ( matched.browser ) {
    browser[ matched.browser ] = true;
    browser.version = matched.version;
  }

  // Chrome is Webkit, but Webkit is also Safari.
  if ( browser.chrome ) {
    browser.webkit = true;
  } else if ( browser.webkit ) {
    browser.safari = true;
  }

  jQuery.browser = browser;
}

/**
 * jquery datepicker custom
 * [2019-01-18] 9999년도 대응할 수 있도록 함수 재정의
 */
$.extend($.datepicker, {
  _generateMonthYearHeader : function( inst, drawMonth, drawYear, minDate, maxDate, secondary, monthNames, monthNamesShort ) {

    var inMinYear, inMaxYear, month, years, thisYear, determineYear, year, endYear,
      changeMonth = this._get( inst, "changeMonth" ),
      changeYear = this._get( inst, "changeYear" ),
      showMonthAfterYear = this._get( inst, "showMonthAfterYear" ),
      html = "<div class='ui-datepicker-title'>",
      monthHtml = "";

    // Month selection
    if ( secondary || !changeMonth ) {
      monthHtml += "<span class='ui-datepicker-month'>" + monthNames[ drawMonth ] + "</span>";
    } else {
      inMinYear = ( minDate && minDate.getFullYear() === drawYear );
      inMaxYear = ( maxDate && maxDate.getFullYear() === drawYear );
      monthHtml += "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>";
      for ( month = 0; month < 12; month++ ) {
        if ( ( !inMinYear || month >= minDate.getMonth() ) && ( !inMaxYear || month <= maxDate.getMonth() ) ) {
          monthHtml += "<option value='" + month + "'" +
            ( month === drawMonth ? " selected='selected'" : "" ) +
            ">" + monthNamesShort[ month ] + "</option>";
        }
      }
      monthHtml += "</select>";
    }

    if ( !showMonthAfterYear ) {
      html += monthHtml + ( secondary || !( changeMonth && changeYear ) ? "&#xa0;" : "" );
    }

    // Year selection
    if ( !inst.yearshtml ) {
      inst.yearshtml = "";
      if ( secondary || !changeYear ) {
        html += "<span class='ui-datepicker-year'>" + drawYear + "</span>";
      } else {

        // determine range of years to display
        years = this._get( inst, "yearRange" ).split( ":" );
        thisYear = new Date().getFullYear();
        determineYear = function( value ) {
          var year = ( value.match( /c[+\-].*/ ) ? drawYear + parseInt( value.substring( 1 ), 10 ) :
            ( value.match( /[+\-].*/ ) ? thisYear + parseInt( value, 10 ) :
            parseInt( value, 10 ) ) );
          return ( isNaN( year ) ? thisYear : year );
        };
        year = determineYear( years[ 0 ] );
        endYear = Math.max( year, determineYear( years[ 1 ] || "" ) );
        year = ( minDate ? Math.max( year, minDate.getFullYear() ) : year );
        endYear = ( maxDate ? Math.min( endYear, maxDate.getFullYear() ) : endYear );
        inst.yearshtml += "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";
        for ( ; year <= endYear; year++ ) {
          inst.yearshtml += "<option value='" + year + "'" +
            ( year === drawYear ? " selected='selected'" : "" ) +
            ">" + year + "</option>";
        }
        inst.yearshtml += "<option value='9999'" + (drawYear == 9999 ?" selected='selected'" : "" ) + ">9999</option>"
        inst.yearshtml += "</select>";

        html += inst.yearshtml;
        inst.yearshtml = null;
      }
    }

    html += this._get( inst, "yearSuffix" );
    if ( showMonthAfterYear ) {
      html += ( secondary || !( changeMonth && changeYear ) ? "&#xa0;" : "" ) + monthHtml;
    }
    html += "</div>"; // Close datepicker_header
    return html;
  }
});

/*
 * Modal Dialog
 * Version jquery 1.8.2
 *         jquery ui 1.9.1
 */

$(document).ready(function () {
  
  //chkAuthMenu 권한체크를 위해 추가함
  if(window.Page != null)
  {
    form = ($("#f1").length > 0)? $("#f1") : $("form").first();
    form.append('<input type="hidden" id="S_PAGE_PROFILE_ID" name="S_PAGE_PROFILE_ID" value="'+Page.PROFILE_ID+'">');
    form.append('<input type="hidden" id="S_PAGE_MODULE_ID" name="S_PAGE_MODULE_ID" value="'+Page.MODULE_ID+'">');
    form.append('<input type="hidden" id="S_PAGE_MENU_ID" name="S_PAGE_MENU_ID" value="'+Page.MENU_ID+'">');
    form.append('<input type="hidden" id="S_PAGE_PGM_URL" name="S_PAGE_PGM_URL" value="'+Page.PGM_URL+'">');
    form.append('<input type="hidden" id="S_PAGE_ENC_VAL" name="S_PAGE_ENC_VAL" value="'+Page.ENC_VAL+'">');
    form.append('<input type="hidden" id="S_PAGE_ENC_VAL2" name="S_PAGE_ENC_VAL2" value="'+Page.ENC_VAL2+'">');
    form.append('<input type="hidden" id="S_PAGE_PGM_ID" name="S_PAGE_PGM_ID" value="'+Page.PGM_ID+'">');
    form.append('<input type="hidden" id="__viewState" name="__viewState" value="">');
    if(typeof(Page) != "undefined" &&  ! Page.MENU_ID) displayElement($(".btMsg"), false);
  
    applyElementFormat();
    applyElementSearchEmp();
    applyElementSearchOrg();
    setButtonAuth();
    setNotice();
    DevTool.init();
  }
  
  /* 
  * 페이지별 옵션을 주기 위해서는 body tag 에 layoutAuto 속성을 false 로 설정하고 
  * LoadPage() 상단에 Layout.init 속성 설정 한다.
  * Default 로 Layout.init() 설정을 하기 위함.
  */
  if(!!$("body").attr2("layoutAuto")) {} else { console.log(Layout.init()); Layout.init();} 
  if(!!$("body").attr2("layoutAuto")) {} else { console.log(Layout.resize()); setTimeout(function(){Layout.resize();}, 500);}
  if(typeof(LoadPage) == "function"){
    var lp = LoadPage();
    //LoadPage가 끝난 후에 applyElementSessionCon()를 실행하기 위함.
    $(lp).promise().done(function()
    {
      applyElementSessionCon();
      //페이지 로드 후 부모페이지에서 실행해야할 함수가 예약되어있으면 호출
      var parentWidow = window.parent;
      if(parentWidow!=undefined)
      {
        if( parentWidow.childLoadAfter != undefined && typeof(parentWidow.childLoadAfter) == "function")
        {
          parentWidow.childLoadAfter(Page.POP_URL, window);
        }
      }
    });
  }

  /* jquery-migrate 제외시 에러 */
  /* FireFox는 window.event가 없어서 추가 */  
  if($.browser.mozilla){
    $.each(["mousedown", "mouseover", "mouseout", "mousemove", "mousedrag", "click", "dblclick"], function(i, eventName){
      window.addEventListener(eventName, function(e){
        window.event = e;
      });
    });
  }
  
});

/**
 * 브라우저가 IE인지 여부를 리턴해주는 펑션
 * @member global
 * @method isIE
 * @returns {Boolean}
 */
function isIE()
{
  if( navigator.userAgent.indexOf("MSIE")>=0 || navigator.userAgent.indexOf("Trident")>=0)
    return true;
  else 
    return false;
}

/**
 * 브라우저가 Edge인지 여부를 리턴해주는 펑션
 * @member global
 * @method isEdge
 * @returns {Boolean}
 */
function isEdge()
{
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    var isEdge = !isIE && !!window.StyleMedia;
    
    return isEdge;
}


/**
 * 버튼,파일,input박스의 class 적용 및 버튼 권한 적용
 * @member global
 * @method setButtonAuth
 */
function setButtonAuth()
{
  $("img, input, a, button, span, div, textarea").each(function (index)
  {
    var e = $(this);
    var inType = e.attr("type");

    if( inType == "button")  
    {
    e.focus(function(){ e.blur();});
    //버튼로그 관련 시작
    if(Page.PGM_BTN_LOG_YN == "Y" && Page.BUTTON_LOG_YN == "Y")
    {
      e.bind({click : function(){logProgramBtn(e.val(), e.attr("onclick"), S_PGM_OPEN_TIME);}});  // 버튼 로그 추가 20121129 W.Y.C
    }
    //버튼로그 관련 끝
    
    e.parent(".btn,.btn3,.btn4").hover(function(e){ //btn3,btn4추가
      if(!($(this).children("INPUT").prop("disabled"))){
        $(this).addClass("on");
      }
    }, function(e){
      $(this).removeClass("on");
    });
    }
    else if( inType == "file")  
    {
    e.hover(function(e){
      if(!($(this).siblings(".btn2").children("INPUT").prop("disabled"))){
        $(this).siblings(".btn2").addClass("on");
      }
    }, function(e){
      $(this).siblings(".btn2").removeClass("on");
    });
    }
    else if(e.closest(".GridMain").length == 0 && (inType == "text" || e[0].tagName == "TEXTAREA"))
    {
      e.addClass("textForm");
    }

  });
}

/**
 * 버튼을 눌렀을때 로그를 저장하는 펑션
 * @member global
 * @method logProgramBtn
 * @param {String} button_nm 버튼명칭
 * @param {String} action_nm onClick시 호출되는 펑션명
 * @param {String} open_time 버튼이 눌려진 시간
 */
function logProgramBtn(button_nm, action_nm, open_time)
{
  var elemName = "";
  var elemVal = "";
  var retVal = "";
  $(".search_typeA").find("input[type=text]:visible, input[type=checkbox]:visible, input[type=radio]:visible, :selected").each(function(i, elem){
    $elem = $(elem);
    switch ($elem.prop("tagName"))
      {
        case "INPUT":
        {       
          switch ($elem.attr("TYPE"))
          {
            case "text":
            {
              elemName = $elem.attr("korname");
              elemVal = $elem.val();
            }
            break;
            case "checkbox":
            case "radion":
            {
              elemName = $elem.attr("korname");
              elemVal = $elem.attr("checked") ? "checked" : "unchecked";
            }
            break;
          }
        }
        break;
        case "OPTION":
        {
          elemName = $elem.parent().attr("korname");
          elemVal = $elem.text();
        }
        break;
      }
    retVal += "<" + elemName + ":" + elemVal + ">,";
  });
  ajaxSyncRequestXS(commonOtpVal.UserDS, commonOtpVal.logProgramBtn, {S_PROFILE_ID: Page.PROFILE_ID, S_MODULE_ID: Page.MODULE_ID, S_MENU_ID: Page.MENU_ID, 
        S_PGM_ID: Page.PGM_ID, S_BTN_NM: button_nm, S_ACTION_NM: action_nm, S_SCH_COND: retVal.substring(0, retVal.length-1), S_PGM_OPEN_TIME: open_time, S_ENC_OTP_KEY: S_ENC_OTP_KEY}, function(xs)
    {
    });
}

/**
 * 로그아웃 페이지를 호출하는 펑션. 팝업일 경우 닫고 부모에서 로그아웃 페이지 호출.
 * @member global
 * @method checkLogout
 */
function checkLogout()
{
  var logout_page = "/main/jsp/logout.jsp";
  var isPopup = false;
  var top_opener;
  if(top.opener)
  {
    top_opener = top.opener;
    if(top.name != "ehrTopFrame") isPopup = true;
    else top_opener = false;
  }else{
    top_opener = false;
  }
  
  if(isPopup){
    setTimeout(function(){top.close(); top_opener.checkLogout();}, 0);
  }else{
    window.open(logout_page, 'ehrTopFrame');
  }
}


/**
 * xml 문자열을 XmlSheet 객체로 변환해주는 펑션
 * @member global
 * @param {String} xmlText xml문자열
 * @param {String} mode 
 * @return {Object} XmlSheet
 */
function makeXSheetWithXmlText(xmlText, mode)
{
  xmlText = $.trim(xmlText);
  mode = nvl(mode, "xml");
  if ( mode == "xml")
  {
    var xdom = null;  
    //var xdom = $.parseXML(xmlText); //parseXML이 제대로 동작하지 않을때가 있어서 변경
    if(isIE()){
      try{
        xdom = new ActiveXObject("Microsoft.XMLDOM");
      }catch(e){
        try{
          xdom = new ActiveXObject("Msxml2.DOMDocument");
        }catch(e){}
      }
    }else{
      xdom = document.implementation.createDocument("", "", null)
    }
  
    try{
      if(isIE()){
        xdom.async = false;
          xdom.loadXML(xmlText);
      }else{
        xdom = (new DOMParser()).parseFromString(xmlText,"text/xml");
      }
    }
    catch(e){}
    
    if ( xdom == null )
    {
      //alert("XML Parser 생성에 실패하였습니다.");
        alert(ajaxMsg("MSG_ALERT_XML_PARSER_CREATE_ERROR"));
        return null;
    }
      
    if( isIE() )
    {
      if ( xdom.parseError.errorCode != 0 )
        {
          var parseErrMsg = "";
          parseErrMsg += "ErrorCode: "+xdom.parseError.errorCode+"\n";
          parseErrMsg += "Reason: "+xdom.parseError.reason+"\n";
          parseErrMsg += "Line: "+xdom.parseError.line+"\n";
          //alert("Xml Parsing 오류가 발생하였습니다.\n\n"+parseErrMsg);
          alert(ajaxMsg("MSG_ALERT_XML_PARSER_ERROR") + "\n\n"+parseErrMsg);
          return null;
        }
    }
      
    var xsheet = new XmlSheet(xdom);
    var msg = xsheet.getMessage();

    if ( msg )
    {
        if ( doCheckMsg(msg) )
        {
          try{
            alert(ajaxMsg("MSG_ALERT_BATCH_FAIL")+"\n\n"+msg);
          }catch(e){
            //alert("작업 중 오류가 발생하였습니다.\n\n"+msg);
            alert(ajaxMsg("MSG_ALERT_BATCH_FAIL") + "\n\n"+msg);
          }
        }
        
        if(!startsWith(msg,"LOGIN_MAX_USER_FAIL"))
        {
        return null;  
        }
  }
  xsheet.responseText = xmlText;
  return xsheet;
  }
  else if ( mode == "script" )
  {
    var so;
    try
    {
      eval("so = "+xmlText);
    }
    catch(e)
    {
      alert("script error: "+e);
      return null;
    }
    var x = new ScriptSheet(so);
    var msg = x.getMessage();
    if ( msg )
    {
      if ( doCheckMsg(msg) )
      {
        try{
          alert(ajaxMsg("MSG_ALERT_BATCH_FAIL")+"\n\n"+msg);
        }catch(e){
          //alert("작업 중 오류가 발생하였습니다.\n\n"+msg);
          alert(ajaxMsg("MSG_ALERT_BATCH_FAIL") + "\n\n"+msg);
        }
      }
      return null;
    }
    x.responseText = xmlText;
    return x;
  }
}


if ( window.Class )
{
  /**
   * XmlSheet
   * @class XmlSheet
   * @extends Class
   */
  var XmlSheet = Class.$extend({
    /**
     * 생성자
     * @constructor
     * @member XmlSheet
     * @param {Object} xdom XMLDocument
     */
    __init__ : function(xdom)
    {
      /** XMLDocument */
      this.xdom = $(xdom);
      /** data group key */
      this.data_key = "default";
      /** 현재 row index */
      this.currRowIdx = -1;
      /** 데이터를 담아놓는 배열 */
      this.meta = {};
      /** xml데이터를 meta에 담는 펑션 */
      this.createMetaData();
    },
    /**
     * xml형식의 데이터를 meta배열에 json 형식으로 저장한다.
     * @member XmlSheet
     * @method createMetaData
     */
    createMetaData: function()
    {
      var dataNodes = this.xdom.find("SHEET DATA");
      var ColNameMap, NameColMap, columnName, filter, data_key, trNodes;
      for ( var n = 0, nlen = dataNodes.length; n < nlen; n++ )
      {
      data_key = $(dataNodes[n]).attr("KEY");
        filter = "@KEY='"+data_key+"'", ColNameMap = {}, NameColMap = {};
        var htrNode = $(dataNodes[n]).find("HTR");
        for ( var c = 0, clen = $(htrNode).children().length; c < clen; c++ )
        {
          if(isIE()) columnName = $(htrNode).children()[c].text;
          else columnName = $(htrNode).children()[c].childNodes[0].nodeValue;
          ColNameMap[c] = columnName;
          NameColMap[columnName] = c;
        }
        trNodes = $(dataNodes[n]).find("TR");
        this.meta[data_key] = {
          RowCount: trNodes.length,
          ColumnCount: htrNode.children().length,
          ColNameMap: ColNameMap,
          NameColMap: NameColMap,
          trNodes: trNodes
        };
      }
    },
    /**
     * 다음행이 있는지 여부
     * @member XmlSheet
     * @method next
     * @param {String} data_key 데이터 그룹을 구분하는 키
     * @return {Boolean} 행 존재 여부
     */
    next: function(data_key)
    {
      var next = this.RowCount(data_key) > this.currRowIdx + 1;
      if ( next ) this.currRowIdx++;
      return next;
    },
    /**
     * datakey setting
     * @member XmlSheet
     * @method setDataKey
     * @param {String} data_key 데이터 그룹을 구분하는 키
     */
    setDataKey: function(data_key)
    {
      data_key = nvl(data_key, "default");
      this.data_key = data_key;
    },
    /**
     * ETC-DATA를 가져온다
     * @member XmlSheet
     * @method GetEtcData
     * @param {String} key 가져올 ETC-DATA의 key값
     * @return {String} ETC-DATA 값
     */
    GetEtcData: function(key)
    {
      try
      {
        var sRtn = this.xdom.find("SHEET ETC-DATA ETC[KEY='"+key+"']").text();
        return sRtn;
      }
      catch(e)
      {
        return "";
        /*
         * alert("Error at xsheet.GetEtcData !!!"); throw e;
         */
      }
    },
    /**
     * 에러 메시지를 리턴
     * @member XmlSheet
     * @method getMessage
     * @return {String} errorMessage
     */
    getMessage: function()
    {
      var rtn ="";
      var objMessage = this.xdom.find("SHEET MESSAGE")[0];
      if(isIE()){
        rtn =objMessage.text;
      }
      else{
        if(objMessage!=null)
          rtn = objMessage.childNodes[0].nodeValue;
      }
      return rtn;
    },
    /**
     * 데이터 갯수를 리턴
     * @member XmlSheet
     * @method RowCount
     * @param {String} data_key 데이터 그룹을 구분하는 키
     * @return {Number} 데이터 행 수
     */
    RowCount: function(data_key)
    {
      if(this.meta[data_key||this.data_key]!=undefined)
      {
        return this.meta[data_key||this.data_key].RowCount;
      }else
      {
        return 0;
      }
    },
    /**
     * 조회한 컬럼의 갯수를 리턴
     * @member XmlSheet
     * @method ColCount
     * @param {String} data_key 데이터 그룹을 구분하는 키
     * @return {Number} ColumnCount
     */
    ColCount: function(data_key)
    {
      return this.meta[data_key || this.data_key].ColumnCount;
    },
    /**
     * 컬럼의 명칭을 리턴(column name by column index)
     * @member XmlSheet
     * @method ColName
     * @param {Number} col column index
     * @param {String} data_key 데이터 그룹을 구분하는 키
     * @return {String} ColumnName
     */
    ColName: function(col, data_key)
    {
      return this.meta[data_key || this.data_key].ColNameMap[col];
    },
    /**
     * 컬럼의 인덱스를 리턴(column index by colum name)
     * @member XmlSheet
     * @method CellIndex
     * @param {String} colnm column name
     * @param {String} data_key 데이터 그룹을 구분하는 키
     * @return {Number} ColumnIndex
     */
    CellIndex: function(colnm, data_key)
    {
      return this.meta[data_key || this.data_key].NameColMap[colnm];
    },
    /**
     * 조회 값을 리턴
     * @member XmlSheet
     * @method GetCellValue
     * @param {Number} row index
     * @param {String|Number} column index or column name
     * @param {String} data_key 데이터 그룹을 구분하는 키 
     * @return {String} value
     */
    GetCellValue: function(row, col, data_key)
    {
      try
      {
        row = (row == null ? this.currRowIdx : row);
        var colNum = col.constructor == Number ? col : this.meta[data_key||this.data_key].NameColMap[col];
        var rtn="";
        if(isIE()){
          rtn = $(this.meta[data_key||this.data_key].trNodes[row]).find("TD")[colNum].text;
        }else{
          if($(this.meta[data_key||this.data_key].trNodes[row]).find("TD")[colNum]!=null){
            rtn = $(this.meta[data_key||this.data_key].trNodes[row]).find("TD")[colNum].childNodes[0].nodeValue;
          };
        }
        return rtn;
      }
      catch (e)
      {
        alert("Error at xs.GetCellValue("+[row, col, data_key]+") !!!");
        throw e;
      }
    },
    /**
     * data key 존재 여부
     * @member XmlSheet
     * @method exists
     * @param {String} data_key 데이터 그룹을 구분하는 키
     * @return {Boolean}
     */
    exists: function(data_key)
    {
      return this.meta[data_key || this.data_key] != null;
    },
    /**
     * column중에 찾고자 하는 value가 있는지 체크하여 존재하는 row의 index값을 리턴
     * @member XmlSheet
     * @method FindRow
     * @param {String|Number} col 검색하려는 column의 index or name
     * @param {String} val 찾으려는 value
     * @param {Number} row 찾기를 시작하려는 행
     * @param {String} data_key 데이터 그룹을 구분하는 키
     * @return {Number} rowIndex
     */
    FindRow: function(col, val, row, data_key)
    {
      var xs = this;
      for ( var r = nvl(row, 0), rcnt = xs.RowCount(data_key); r < rcnt; r++ )
      {
        if ( xs.GetCellValue(r, col, data_key) == val ) return r;
      }
      return -1;
    },
    /**
     * startRow 로우부터 fFind 함수를 실행하여 true 인 row index를 반환
     * @member XmlSheet
     * @method FindRowWithFunction
     * @param {Function} fFind 사용자 지정 검색 펑션
     * @param {Boolean} reverse 첫 row 부터 검색할지 마지막 row 부터 검색할지 여부 
     * @param {Number} startRow 검색시작 row
     * @param {String} data_key 데이터 그룹을 구분하는 키
     * @return {Number} findRow
     */
    FindRowWithFunction: function(fFind, reverse, startRow, data_key)
    {
      var findRow = -1;
      try{
        this.eachRow(function(row, xs, returnObject)
        {
          if ( fFind(xs, row) )
          {
            findRow = row;
            throw $break;
          }
        }, reverse, startRow, data_key);
      }catch(e){}
      return findRow;
    },
    /**
     * 각 로우를 돌며 함수 실행
     * @member XmlSheet
     * @method eachRow
     * @param {Function} func row별 처리 함수
     * @param {Boolean} reverse 첫 row 부터 실행할지 마지막 row 부터 실행할지 여부
     * @param {Number} startRow 실행시작 row
     * @param {String} data_key 데이터 그룹을 구분하는 키
     */
    eachRow: function(func, reverse, startRow, data_key)
    {
      var xs = this;
      reverse = !!reverse;
      var returnObject = {};

      try
      {
        if ( reverse ){
          for ( var row = nvl(startRow, xs.RowCount(data_key)-1), firstDataRow = 0; row >= firstDataRow; row-- )
          {
            func(row, xs, returnObject);
          }
        }else{
          for ( var row = nvl(startRow, 0), RowCount = xs.RowCount(data_key); row < RowCount; row++)
          {
            func(row, xs, returnObject);
          }
        }
      }
      catch(e)
      {
        if (e == $break) return returnObject.value;
        throw e;
      }
    }
  });
  
  /**
   * ScriptSheet
   * @class ScriptSheet
   * @extends XmlSheet
   */
  var ScriptSheet = XmlSheet.$extend({
    /**
     * 생성자
     * @constructor
     * @member ScriptSheet
     * @param {String} so XmlText
     */
    __init__: function(so)
    {
      /** */
      this.so = so;
      this.GetEtcData = so.GetEtcData;
      this.listData = so.listData;
      this.message = so.message;
      this.data_key = "default";
      this.currRowIdx = -1;
      this.meta = {};
      this.createMetaData();
    },
    /**
     * 배열형식의 데이터를 meta배열에 json 형식으로 저장한다.
     * @member ScriptSheet
     * @method createMetaData
     */    
    createMetaData: function()
    {
      var ColNameMap, NameColMap, columnName;
      for ( var data_key in this.listData)
      {
        ColumnCount = this.listData[data_key].columnNames.length;
        ColNameMap = {}, NameColMap = {};
        for ( var c = 0, clen = ColumnCount; c < clen; c++ )
        {
          columnName = this.listData[data_key].columnNames[c];
          ColNameMap[c] = columnName;
          NameColMap[columnName] = c;
        }
        this.meta[data_key] = {
          RowCount: this.listData[data_key].data.length,
          ColumnCount: ColumnCount,
          ColNameMap: ColNameMap,
          NameColMap: NameColMap
        };
      }
    },
    /**
     * ETC-DATA를 가져온다
     * @member ScriptSheet
     * @method GetEtcData
     * @param {String} key 가져올 ETC-DATA의 key값
     * @return {String} ETC-DATA 값
     */
    GetEtcData: function(key)
    {
      return nvl(this.GetEtcData[key]);
    },
    /**
     * 에러 메시지를 리턴
     * @member ScriptSheet
     * @method getMessage
     * @return {String} errorMessage
     */
    getMessage: function()
    {
      return this.message;
    },
    /**
     * 조회 값을 리턴
     * @member ScriptSheet
     * @method CellValue
     * @param {Number} row row index
     * @param {Number|String} col column index or column name
     * @param {String} data_key 데이터 그룹을 구분하는 키 
     * @return {String} value
     */
    CellValue: function(row, col, data_key)
    {
      try
      {
        row = (row == null ? this.currRowIdx : row);
        var colNum = col.constructor == Number ? col : this.meta[data_key || this.data_key].NameColMap[col];
        return this.listData[data_key || this.data_key].data[row][colNum];
      }
      catch (e)
      {
        //alert("Error at xs.GetCellValue("+[row, col, data_key]+") !!!");
        //throw e;
      }
    }
  });
}

/**
 * 「도움말관리」 프로그램에서 등록된 도움말이 있으면 화면의 도움말 버튼을 그려준다.
 * @member global
 */
function setNotice()
{
  //팝업에서는 도움말 안뜨게 하려면 아래 주석 해제
  //if(!_isPopup && window.name.indexOf("iframe_biz") == 0) {
  //팝업에서 도움말 뜨게 하려면 아래 주석 해제
  if(true){
    if(typeof(Page) != "undefined" && (Page.PGM_ID || Page.HELP_PGM_ID)) {
      
      if($(".btn_areaR").length > 0)
      {
        
        if(Page.HELP_MSG != undefined && Page.HELP_MSG != null && Page.HELP_MSG != "")
        {
          $(".headTit:first:not(:has('.btn_areaR'))").append('<span id="helpBtn" rel="helpMag" class="btMsg" style="display:none;float:right">알림창 열기</span>');
          if($("#helpBtn").length == 0)
          {
              $(".headTit:first .btn_areaR").append('<span id="helpBtn" rel="helpMag" class="btMsg" style="display:none;">알림창 열기</span>');
          }
          displayElement("helpBtn", true);
          setTimeout(function () {
            var cente_html = "<div class='msg' id='helpMag'><div class='in fr-view'>" + Page.HELP_MSG + "</div></div>";
            $("body").append(cente_html);

            var pageHref = window.location.href;
            var pageName = pageHref.substring(pageHref.lastIndexOf("/")+1, pageHref.lastIndexOf("."));
            
            var arrCheck = getCookie(pageName).split("|");
            $(".btMsg").each(function(i){
              var $self = $(this);
              var $box = returnjQueryObj($self.attr("rel"))
              var $close = $("<span class='close'>닫기</span>").click(function(){
                             $box.fadeOut("fast");
                           });
              var $chk = $("<div class='chk'><span class='chkTxt'>다음부터 보지 않기</span></div>");
              var $chkBox = $("<span class='chkBox'>체크박스</span>").click(function(){
                              var $self = $(this);
                              $self.toggleClass("checked");
                              var arrVal = [];
                              $(".msg .chkBox").each(function(){
                                if($(this).hasClass("checked")){
                                  arrVal.push("Y");
                                }else{
                                  arrVal.push("N");
                                }
                                setCookie(pageName, arrVal.join("|"), 9999);
                              });
                            });
              
              $box.append($chk.append($chkBox)).append($close);
                        
              $self.click(function(){      
                $box.fadeIn("fast");
              });
              
              if(arrCheck[i] == "Y"){
                $chkBox.addClass("checked");
                $box.fadeOut(0);
              }
            });
            $('.msg').css({
                "z-index" : "800"
               ,"margin-top": $('#helpBtn').offset().top
               ,"min-width": "200px"
               ,"border-radius": "10px"
               ,"background": "url(/resource/images/button/msg_bg.png)"
               ,"right" : "0px"
               ,"position": "absolute"
          //}).show();   // 항상보여짐.
            });
          }, 500);
        }
        else {
          displayElement("helpBtn", false);  // Help Button Display
        }
      }
    }
  }
}

window.ehrTopFrame = findFrameByName('ehrTopFrame')||top;

//dom.js 시작

/**
 * element를 생성해주는 펑션
 * @class $E
 * @param {String} tagName 생성할 태그
 * @param {Object} props 태그의 속성을 JSON 형식으로 입력받음
 * @param {Array|String} child 생성할 태그의 자식태그 혹은 자식텍스트
 * @return element
 */
$E = function (tagName, props, child)
{
  /**
   * @member $E
   * @method _getCheckChild
   * @param {String} child
   */
  function _getCheckChild(child)
  {
    return (typeof child in {'string':1,'number':1}) ? document.createTextNode(String(child)) : child;
  }
  var newElement = document.createElement(tagName);
  Object.extend2(newElement, props || {});
  if ( child )
  {
    if ( child instanceof Array )
    {
      for ( var n = 0, nlen = child.length; n < nlen; n++ )
      {
        newElement.appendChild(_getCheckChild(child[n]));
      }
    }
    else
    {
      newElement.appendChild(_getCheckChild(child));
    }
  }
  return newElement;
}

/**
 * 객체 내부까지 복사하는 펑션
 * @member Object
 * @method extend2
 * @param {Object} destination 입력객체
 * @param {Object} source 복사객체
 * @returns {Object} destination 복사된 객체
 */
Object.extend2 = function(destination, source) {

  for (var property in source) {
    if ( source[property] == null || source[property].constructor != Object )
    {
      destination[property] = source[property];
    }
    else
    {
      Object.extend2(destination[property], source[property]);
    }

  }
  return destination;
}

/**
 * 반올림 펑션
 * @member Math
 * @method round2
 * @param {Number} number
 * @param {Number} pointCount
 * @returns {Number}
 */
Math.round2 = function(number, pointCount)
{
  pointCount = pointCount == null ? 0 : pointCount;
  return Math.round(number * Math.pow(10, pointCount)) / Math.pow(10, pointCount);
}

/**
 * 버림 펑션
 * @member Math
 * @method floor2
 * @param {Number} number
 * @param {Number} pointCount
 * @returns {Number}
 */
Math.floor2 = function(number, pointCount)
{
  pointCount = pointCount == null ? 0 : pointCount;
  return Math.floor(number * Math.pow(10, pointCount)) / Math.pow(10, pointCount);
}

/**
 * 올림 펑션
 * @member Math
 * @method ceil2
 * @param {number} number
 * @param {pointCount} pointCount
 * @returns {Number}
 */
Math.ceil2 = function(number, pointCount)
{
  pointCount = pointCount == null ? 0 : pointCount;
  return Math.ceil(number * Math.pow(10, pointCount)) / Math.pow(10, pointCount);
}

/**
 * 나눗셈 펑션
 * @member Math
 * @method divide
 * @param {Number} num1 피제수
 * @param {Number} num2 제수
 * @returns {Number} 몫
 */
Math.divide = function(num1, num2)
{
  return num2 == 0 ? 0 : num1/num2;
}

/**
 * input태그에 format 적용하는 펑션
 * @member global
 * @method applyElementFormat
 */
function applyElementFormat()
{
    $("input[type=text], textarea").each(function(index)
    {
      var element = $(this);
      if(element.attr("__formatapplied")) return;
      element.attr("__formatapplied", true);

      var elementAttr = element.attr("data_format");
      if( !isIE() && (elementAttr==""||elementAttr==undefined)) return; //Safari에서 텍스트 지워짐현상이 있어 IE에서만 동작하게 변경 kyn
                                                                        //ie에서는 INPUT에 포커스가 안들어가는 버그가 있어 필요없어도 아래를 실행
      switch ( elementAttr )
      {
        case "dfDateYy":  applyStyle(element, "center", "disabled", "####".length); break;
        case "dfDateMm":  applyStyle(element, "center", "disabled", "##".length); break;
        case "dfDateYmd":
        {
          applyStyle(element, "center", "disabled", "####.##.##".length);
          element.setValue = function(val)
          {
            element.value = formatValue(val, elementAttr);
          };
        }
        break;
        case "dfDateYmd1":
        {
          applyStyle(element, "center", "disabled", "####.##.##".length);
          element.setValue = function(val)
          {
            element.value = formatValue(val, elementAttr);
          };
        }
        break;
        case "dfDateYm":  applyStyle(element, "center", "disabled", "####.##".length); break;
        case "dfDateMd":  applyStyle(element, "center", "disabled", "##.##".length); break;
        case "dfTimeHms": applyStyle(element, "center", "disabled", "##:##:##".length); break;
        case "dfTimeHm":  applyStyle(element, "center", "disabled", "##:##".length); break;
        case "dfTimeYmdhms": applyStyle(element, "center", "disabled", "####.##.## ##:##:##".length); break;
        case "dfIdNo":    applyStyle(element, "center", "disabled", "######-#######".length); break;
        case "dfSaupNo":  applyStyle(element, "center", "disabled", "###-##-#####".length); break;
        case "dfCardNo":  applyStyle(element, "center", "disabled", "####-####-####-####".length); break;
        case "dfPostNo":  applyStyle(element, "center", "disabled", "###-###".length); break;
        case "dfCorpNo":  applyStyle(element, "center", "disabled", "######-#######".length); break;
        case "dfNo":      applyStyle(element, null, "disabled", null); break;
        case "dfInteger1":applyStyle(element, "right", "disabled", "###".length); break;
        case "dfIssueNo":  applyStyle(element, "center", "disabled", "####-######".length); break;
        case "dfInteger+":
        case "dfInteger":
        case "dfFloat+":
        case "dfFloat":   applyStyle(element, "right", "disabled", null); break;
        // case "dfEmail": break;
        default : applyStyle(element,"left", "normal", null);  break; //layer팝업이 닫힌후 일부 text에 포커스가 안가는 오류가 edge와 ie일부 버전에서 생겨추가
      }
      
      if ( element.attr("onkeyupchange") ) element.attr("onkeyupchange", new Function(element.attr("onkeyupchange")));
      if ( element.attr("onkeyupmaxlength") ) element.attr("onkeyupmaxlength", new Function(element.attr("onkeyupmaxlength")));
      if ( element.attr("onblurchange") ) element.attr("onblurchange", new Function(element.attr("onblurchange")));

      element.bind('focus', function()
      {
        //var element = this;
        element.attr("_fvalue", element.val());
        formatInput(element);
        element[0].select();
      });
      
      if(elementAttr==null || elementAttr=="") return;
      
      element.bind('keyup', function()
      {
        //if ( element.attr2("_pvalue") == "" ) element.attr("_pvalue", element.val());
        if (element.val() != element.attr("_pvalue") )
        {
          var agent = navigator.userAgent.toLowerCase();
          //ie가 아닐 경우
          if ( !((navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1))) {
            //ie에서 keyup시 formatInput을 하게되면 onchange이벤트가 일어나지 않는 현상이 발생한다. 
            formatInput(element);
          }
          
          element.attr("_pvalue", element.val());
          if ( element.attr("onkeyupchange") ) eval(element.attr("onkeyupchange"));
          if ( element.val().length == element.attr("maxLength") ) if ( element.attr("onkeyupmaxlength") ) eval(element.attr("onkeyupmaxlength"));
        }
        //element.attr("_pvalue",element.val());
      });
      
      element.bind('blur', function()
      {
        //var element = this;
        formatInput(element);
        if ( element.val() != element.attr("_fvalue") ) if ( element.attr("onblurchange") ) eval(element.attr("onblurchange"));
      });

      if ( element.attr("data_format") == "dfDateYmd" && ! (element.attr2("readOnly") || element.attr2("disabled"))  )
      {
        element.datepicker({
              showOn: "button",
              buttonImage: "/resource/images/icon/icon_calendar.gif",
              buttonImageOnly: true,
              buttonText : "",
              dateFormat : "yy.mm.dd",
              changeYear:true,
              changeMonth:true,
              closeText:"Close",
              yearRange:"1900:2100",
              showOtherMonths:true,
              selectOtherMonths:true,
              showButtonPanel: true,
              //여러가지 달력의 액션이 다를경우 본인의 아이디 값으로 호출하기 위해....lsg1lsg2
              onSelect : function(dateTEXT, inst)
              {
                try
                {
                  if($(element).attr("onblurchange")!=undefined)
                  { 
                    $(element).trigger("blur"); 
                  }
                  if($(element).attr("change")!=undefined)
                  {
                    $(element).trigger("change");
                  }
                }catch(e){
                  alert(e);
                }
              }, //change_date함수를 호출하고 있었으나 남아있지 않아 삭제
              onClose: removeAria
              /*
              //-- activeX 때문에 달력이 가려지는 문제가 생길때 추가하는 로직
              showAnim : "",
              beforeShow: function(){
                setTimeout(function(){
                  $("#ui-datepicker-div").before("<iframe id='ui-datepicker-div-bg-iframe' frameborder='0' scrolling='no' style='filter:alpha(opacity=0); position:absolute; "
                              + "left: " + $("#ui-datepicker-div").css("left") + ";"
                              + "top: " + $("#ui-datepicker-div").css("top") + ";"
                              + "width: " + $("#ui-datepicker-div").outerWidth(true) + "px;"
                              + "height: " + $("#ui-datepicker-div").outerHeight(true) + "px;'></iframe>");
                }, 50);
              },
              onClose: function(){
                $("#ui-datepicker-div-bg-iframe").remove();
              }
              */
        });

        $(".ui-datepicker-trigger").css("vertical-align","middle").css("width","20px"); //px를 강제로 줘서 크롬에서 offset() 을 가져올때 캐쉬에 있는 것을 참고하지 않토록함.
        $('.ui-datepicker-trigger').attr('aria-describedby', 'datepickerLabel');
        
        dayTripper();
      }

    });
    
    //달력 cursor 모양 변경
    $(".ui-datepicker-trigger").mouseover(function() { 
      $(this).css('cursor','pointer');
    });
}

/**
 * dataPicker 달력의 오늘 날짜에 focus표시
 * @member global
 * @method dayTripper
 */
function dayTripper() {
  $('.ui-datepicker-trigger').click(function () {
    var $dp_trigger = $(this);
    var dp_input = ($dp_trigger.prev())[0];
    setTimeout(function () {
      var today = $('.ui-datepicker-today a')[0];

      if (!today) {
        today = $('.ui-state-active')[0] ||
                $('.ui-state-default')[0];
      }

      // Hide the entire page (except the date picker)
      // from screen readers to prevent document navigation
      // (by headings, etc.) while the popup is open
      $($(".wbox")[0]).attr('id','dp-container');
      $("#dp-container").attr('aria-hidden','true');
      $("#skipnav").attr('aria-hidden','true');

      // Hide the "today" button because it doesn't do what 
      // you think it supposed to do
      $(".ui-datepicker-current").hide();

      today.focus();
      datePickHandler(dp_input);

    }, 0);
  });
}

/**
 * datePicker의 각종 focus작업 및 Today버튼 숨기기
 * @member global
 * @method datePickHandler
 * @param {Element} input input Element
 */
function datePickHandler(input) {
  var activeDate;
  var container = document.getElementById('ui-datepicker-div');
  
  if (!container || !input) {
    return;
  }

  $(container).find('table').first().attr('role', 'grid');

  container.setAttribute('role', 'application');
  container.setAttribute('aria-label', 'Calendar view date-picker');

    // the top controls:
  var prev = $('.ui-datepicker-prev', container)[0],
      next = $('.ui-datepicker-next', container)[0];
// This is the line that needs to be fixed for use on pages with base URL set in head
  next.href = 'javascript:void(0)';
  prev.href = 'javascript:void(0)';

  next.setAttribute('role', 'button');
  next.removeAttribute('title');
  prev.setAttribute('role', 'button');
  prev.removeAttribute('title');

  appendOffscreenMonthText(next);
  appendOffscreenMonthText(prev);

  // delegation won't work here for whatever reason, so we are
  // forced to attach individual click listeners to the prev /
  // next month buttons each time they are added to the DOM
  $(next).on('click', handleNextClicks);
  $(prev).on('click', handlePrevClicks);

  monthDayYearText();
  
  $(container).focus();
  $(container).on('keydown', function calendarKeyboardListener(keyVent) {
    var which = keyVent.which;
    var target = keyVent.target;
    var dateCurrent = getCurrentDate(container);

    if (!dateCurrent) {
      dateCurrent = $('a.ui-state-default')[0];
      setHighlightState(dateCurrent, container);
    }

    if (27 === which) {
      keyVent.stopPropagation();
      return closeCalendar();
    } else if (which === 9 && keyVent.shiftKey) { // SHIFT + TAB
      keyVent.preventDefault();
      if ($(target).hasClass('ui-datepicker-close')) { // close button
        $('.ui-datepicker-prev')[0].focus();
      } else if ($(target).hasClass('ui-state-default')) { // a date link
        $('.ui-datepicker-close')[0].focus();
      } else if ($(target).hasClass('ui-datepicker-prev')) { // the prev link
        $('.ui-datepicker-next')[0].focus();
      } else if ($(target).hasClass('ui-datepicker-next')) { // the next link
        activeDate = $('.ui-state-highlight') ||
                    $('.ui-state-active')[0];
        if (activeDate) {
          activeDate.focus();
        }
      }
    } else if (which === 9) { // TAB
      keyVent.preventDefault();
      if ($(target).hasClass('ui-datepicker-close')) { // close button
        activeDate = $('.ui-state-highlight') ||
                    $('.ui-state-active')[0];
        if (activeDate) {
          activeDate.focus();
        }
      } else if ($(target).hasClass('ui-state-default')) {
        $('.ui-datepicker-next')[0].focus();
      } else if ($(target).hasClass('ui-datepicker-next')) {
        $('.ui-datepicker-prev')[0].focus();
      } else if ($(target).hasClass('ui-datepicker-prev')) {
        $('.ui-datepicker-close')[0].focus();
      } 
    } else if (which === 37) { // LEFT arrow key
      // if we're on a date link...
      if (!$(target).hasClass('ui-datepicker-close') && $(target).hasClass('ui-state-default')) {
        keyVent.preventDefault(); //keydown외의 별도의 브라우저 행동을 막음 
        previousDay(target);
      }
    } else if (which === 39) { // RIGHT arrow key
      // if we're on a date link...
      if (!$(target).hasClass('ui-datepicker-close') && $(target).hasClass('ui-state-default')) {
        keyVent.preventDefault();
        nextDay(target);
      }
    } else if (which === 38) { // UP arrow key
      if (!$(target).hasClass('ui-datepicker-close') && $(target).hasClass('ui-state-default')) {
        keyVent.preventDefault();
        upHandler(target, container, prev);
      }
    } else if (which === 40) { // DOWN arrow key
      if (!$(target).hasClass('ui-datepicker-close') && $(target).hasClass('ui-state-default')) {
        keyVent.preventDefault();
        downHandler(target, container, next);
      }
    } else if (which === 13) { // ENTER
      if ($(target).hasClass('ui-state-default')) {
        setTimeout(function () {
          closeCalendar();
        }, 100);
      } else if ($(target).hasClass('ui-datepicker-prev')) {
        handlePrevClicks();
      } else if ($(target).hasClass('ui-datepicker-next')) {
        handleNextClicks();
      }
    } else if (32 === which) {
      if ($(target).hasClass('ui-datepicker-prev') || $(target).hasClass('ui-datepicker-next')) {
        target.click();
      }
    } else if (33 === which) { // PAGE UP
      moveOneMonth(target, 'prev');
    } else if (34 === which) { // PAGE DOWN
      moveOneMonth(target, 'next');
    } else if (36 === which) { // HOME
      var firstOfMonth = $(target).closest('tbody').find('.ui-state-default')[0];
      if (firstOfMonth) {
        firstOfMonth.focus();
        setHighlightState(firstOfMonth, $('#ui-datepicker-div')[0]);
      }
    } else if (35 === which) { // END
      var $daysOfMonth = $(target).closest('tbody').find('.ui-state-default');
      var lastDay = $daysOfMonth[$daysOfMonth.length - 1];
      if (lastDay) {
        lastDay.focus();
        setHighlightState(lastDay, $('#ui-datepicker-div')[0]);
      }
    }
    $(".ui-datepicker-current").hide();
  });

}

/**
 * datapicker close
 * @member global
 * @method closeCalendar
 */
function closeCalendar() {
  var container = $('#ui-datepicker-div');
  $(container).off('keydown');
  var input = $('#datepicker')[0];
  $(input).datepicker('hide');
  
  input.focus();
}

/**
 * make the rest of the page accessible again
 * @member global
 * @method removeAria
 */
function removeAria() {
  // make the rest of the page accessible again:
  $("#dp-container").removeAttr('aria-hidden');
  $("#skipnav").removeAttr('aria-hidden');
}

/**
 * num을 2로 나눈 값을 리턴
 * @member global
 * @method isOdd
 * @param {Number} num
 * @returns {Number}
 */
function isOdd(num) {
  return num % 2;
}

/**
 * prev, next 기능 펑션
 * @member global
 * @method moveOneMonth
 * @param {Element} currentDate
 * @param {String} dir
 */
function moveOneMonth(currentDate, dir) {
  var button = (dir === 'next')
              ? $('.ui-datepicker-next')[0]
              : $('.ui-datepicker-prev')[0];

  if (!button) {
    return;
  }

  var ENABLED_SELECTOR = '#ui-datepicker-div tbody td:not(.ui-state-disabled)';
  var $currentCells = $(ENABLED_SELECTOR);
  var currentIdx = $.inArray(currentDate.parentNode, $currentCells);

  button.click();
  setTimeout(function () {
    updateHeaderElements();

    var $newCells = $(ENABLED_SELECTOR);
    var newTd = $newCells[currentIdx];
    var newAnchor = newTd && $(newTd).find('a')[0];

    while (!newAnchor) {
      currentIdx--;
      newTd = $newCells[currentIdx];
      newAnchor = newTd && $(newTd).find('a')[0];
    }

    setHighlightState(newAnchor, $('#ui-datepicker-div')[0]);
    newAnchor.focus();

  }, 0);
}

/**
 * datepicker의 next버튼 focus 효과
 * @member global
 * @method handleNextClicks
 */
function handleNextClicks() {
  setTimeout(function () {
    updateHeaderElements();
    prepHighlightState();
    $('.ui-datepicker-next').focus();
    $(".ui-datepicker-current").hide();
  }, 0);
}

/**
 * datepicker의 prev버튼 focus 효과
 * @member global
 * @method handlePrevClicks
 */
function handlePrevClicks() {
  setTimeout(function () {
    updateHeaderElements();
    prepHighlightState();
    $('.ui-datepicker-prev').focus();
    $(".ui-datepicker-current").hide();
  }, 0);
}

/**
 * datepicker에서 현재 선택되어 있는 전날짜를 focus
 * @member global
 * @method previousDay
 * @param {Element} dateLink
 */
function previousDay(dateLink) {
  var container = document.getElementById('ui-datepicker-div');
  if (!dateLink) {
    return;
  }
  var td = $(dateLink).closest('td');
  if (!td) {
    return;
  }

  var prevTd = $(td).prev(),
      prevDateLink = $('a.ui-state-default', prevTd)[0];

  if (prevTd && prevDateLink) {
    setHighlightState(prevDateLink, container);
    prevDateLink.focus();
  } else {
    handlePrevious(dateLink);
  }
}

/**
 * datepicker에서 현재 선택되어 있는 전 week의 날짜를 focus
 * @member global
 * @method handlePrevious
 * @param {Element} target
 */
function handlePrevious(target) {
  var container = document.getElementById('ui-datepicker-div');
  if (!target) {
    return;
  }
  var currentRow = $(target).closest('tr');
  if (!currentRow) {
    return;
  }
  var previousRow = $(currentRow).prev();

  if (!previousRow || previousRow.length === 0) {
    // there is not previous row, so we go to previous month...
    previousMonth();
  } else {
    var prevRowDates = $('td a.ui-state-default', previousRow);
    var prevRowDate = prevRowDates[prevRowDates.length - 1];

    if (prevRowDate) {
      setTimeout(function () {
        setHighlightState(prevRowDate, container);
        prevRowDate.focus();
      }, 0);
    }
  }
}

/**
 * datepicker에서 현재 선택되어 있는 전 month의 날짜를 focus
 * @member global
 * @method previousMonth
 */
function previousMonth() {
  var prevLink = $('.ui-datepicker-prev')[0];
  var container = document.getElementById('ui-datepicker-div');
  prevLink.click();
  // focus last day of new month
  setTimeout(function () {
    var trs = $('tr', container),
        lastRowTdLinks = $('td a.ui-state-default', trs[trs.length - 1]),
        lastDate = lastRowTdLinks[lastRowTdLinks.length - 1];

    // updating the cached header elements
    updateHeaderElements();

    setHighlightState(lastDate, container);
    lastDate.focus();

  }, 0);
}

///////////////// NEXT /////////////////
/**
 * Handles right arrow key navigation
 * @member global
 * @method nextDay
 * @param  {HTMLElement} dateLink The target of the keyboard event
 */
function nextDay(dateLink) {
  var container = document.getElementById('ui-datepicker-div');
  if (!dateLink) {
    return;
  }
  var td = $(dateLink).closest('td');
  if (!td) {
    return;
  }
  var nextTd = $(td).next(),
      nextDateLink = $('a.ui-state-default', nextTd)[0];

  if (nextTd && nextDateLink) {
    setHighlightState(nextDateLink, container);
    nextDateLink.focus(); // the next day (same row)
  } else {
    handleNext(dateLink);
  }
}

/**
 * datepicker에서 현재 선택되어 있는 다음 week의 날짜를 focus
 * @member global
 * @method handleNext
 * @param {Element} target
 */
function handleNext(target) {
  var container = document.getElementById('ui-datepicker-div');
  if (!target) {
    return;
  }
  var currentRow = $(target).closest('tr'),
      nextRow = $(currentRow).next();

  if (!nextRow || nextRow.length === 0) {
    nextMonth();
  } else {
    var nextRowFirstDate = $('a.ui-state-default', nextRow)[0];
    if (nextRowFirstDate) {
      setHighlightState(nextRowFirstDate, container);
      nextRowFirstDate.focus();
    }
  }
}

/**
 * datepicker에서 현재 선택되어 있는 다음 month의 날짜를 focus
 * @member global
 * @method nextMonth
 */
function nextMonth() {
  nextMon = $('.ui-datepicker-next')[0];
  var container = document.getElementById('ui-datepicker-div');
  nextMon.click();
  // focus the first day of the new month
  setTimeout(function () {
    // updating the cached header elements
    updateHeaderElements();

    var firstDate = $('a.ui-state-default', container)[0];
    setHighlightState(firstDate, container);
    firstDate.focus();
  }, 0);
}

/////////// UP ///////////
/**
 * Handle the up arrow navigation through dates
 * @member global
 * @method upHandler
 * @param  {HTMLElement} target   The target of the keyboard event (day)
 * @param  {HTMLElement} cont     The calendar container
 * @param  {HTMLElement} prevLink Link to navigate to previous month
 */
function upHandler(target, cont, prevLink) {
  prevLink = $('.ui-datepicker-prev')[0];
  var rowContext = $(target).closest('tr');
  if (!rowContext) {
    return;
  }
  var rowTds = $('td', rowContext),
      rowLinks = $('a.ui-state-default', rowContext),
      targetIndex = $.inArray(target, rowLinks),
      prevRow = $(rowContext).prev(),
      prevRowTds = $('td', prevRow),
      parallel = prevRowTds[targetIndex],
      linkCheck = $('a.ui-state-default', parallel)[0];

  if (prevRow && parallel && linkCheck) {
    // there is a previous row, a td at the same index
    // of the target AND theres a link in that td
    setHighlightState(linkCheck, cont);
    linkCheck.focus();
  } else {
    // we're either on the first row of a month, or we're on the
    // second and there is not a date link directly above the target
    prevLink.click();
    setTimeout(function () {
      // updating the cached header elements
      updateHeaderElements();
      var newRows = $('tr', cont),
          lastRow = newRows[newRows.length - 1],
          lastRowTds = $('td', lastRow),
          tdParallelIndex = $.inArray(target.parentNode, rowTds),
          newParallel = lastRowTds[tdParallelIndex],
          newCheck = $('a.ui-state-default', newParallel)[0];

      if (lastRow && newParallel && newCheck) {
        setHighlightState(newCheck, cont);
        newCheck.focus();
      } else {
        // theres no date link on the last week (row) of the new month
        // meaning its an empty cell, so we'll try the 2nd to last week
        var secondLastRow = newRows[newRows.length - 2],
            secondTds = $('td', secondLastRow),
            targetTd = secondTds[tdParallelIndex],
            linkCheck = $('a.ui-state-default', targetTd)[0];

        if (linkCheck) {
          setHighlightState(linkCheck, cont);
          linkCheck.focus();
        }

      }
    }, 0);
  }
}

//////////////// DOWN ////////////////
/**
 * Handles down arrow navigation through dates in calendar
 * @member global
 * @method downHandler
 * @param  {HTMLElement} target   The target of the keyboard event (day)
 * @param  {HTMLElement} cont     The calendar container
 * @param  {HTMLElement} nextLink Link to navigate to next month
 */
function downHandler(target, cont, nextLink) {
  nextLink = $('.ui-datepicker-next')[0];
  var targetRow = $(target).closest('tr');
  if (!targetRow) {
    return;
  }
  var targetCells = $('td', targetRow),
      cellIndex = $.inArray(target.parentNode, targetCells), // the td (parent of target) index
      nextRow = $(targetRow).next(),
      nextRowCells = $('td', nextRow),
      nextWeekTd = nextRowCells[cellIndex],
      nextWeekCheck = $('a.ui-state-default', nextWeekTd)[0];

  if (nextRow && nextWeekTd && nextWeekCheck) {
    // theres a next row, a TD at the same index of `target`,
    // and theres an anchor within that td
    setHighlightState(nextWeekCheck, cont);
    nextWeekCheck.focus();
  } else {
    nextLink.click();

    setTimeout(function () {
      // updating the cached header elements
      updateHeaderElements();

      var nextMonthTrs = $('tbody tr', cont),
          firstTds = $('td', nextMonthTrs[0]),
          firstParallel = firstTds[cellIndex],
          firstCheck = $('a.ui-state-default', firstParallel)[0];

      if (firstParallel && firstCheck) {
        setHighlightState(firstCheck, cont);
        firstCheck.focus();
      } else {
        // lets try the second row b/c we didnt find a
        // date link in the first row at the target's index
        var secondRow = nextMonthTrs[1],
            secondTds = $('td', secondRow),
            secondRowTd = secondTds[cellIndex],
            secondCheck = $('a.ui-state-default', secondRowTd)[0];

        if (secondRow && secondCheck) {
          setHighlightState(secondCheck, cont);
          secondCheck.focus();
        }
      }
    }, 0);
  }
}

/**
 * datepicker달력 감춤
 * @member global
 * @method onCalendarHide
 */
function onCalendarHide() {
  closeCalendar();
}

/**
 * add an aria-label to the date link indicating the currently focused date
 * (formatted identically to the required format: mm/dd/yyyy)
 * @member global
 * @method monthDayYearText
 */
function monthDayYearText() {
  var cleanUps = $('.amaze-date');

  $(cleanUps).each(function (clean) {
  // each(cleanUps, function (clean) {
    clean.parentNode.removeChild(clean);
  });

  var datePickDiv = document.getElementById('ui-datepicker-div');
  // in case we find no datepick div
  if (!datePickDiv) {
    return;
  }

  var dates = $('a.ui-state-default', datePickDiv);

  $(dates).each(function (index, date) {
    var currentRow = $(date).closest('tr'),
        currentTds = $('td', currentRow),
        currentIndex = $.inArray(date.parentNode, currentTds),
        headThs = $('thead tr th', datePickDiv),
        dayIndex = headThs[currentIndex],
        daySpan = $('span', dayIndex)[0],
        monthName = $('.ui-datepicker-month', datePickDiv)[0].innerHTML,
        year = $('.ui-datepicker-year', datePickDiv)[0].innerHTML,
        number = date.innerHTML;

    if (!daySpan || !monthName || !number || !year) {
      return;
    }

    // AT Reads: {month} {date} {year} {day}
    // "December 18 2014 Thursday"
    var dateText = monthName + ' ' + date.innerHTML + ' ' + year + ' ' + daySpan.title;
    // AT Reads: {date(number)} {name of day} {name of month} {year(number)}
    // var dateText = date.innerHTML + ' ' + daySpan.title + ' ' + monthName + ' ' + year;
    // add an aria-label to the date link reading out the currently focused date
    date.setAttribute('aria-label', dateText);
  });
}


/**
 * update the cached header elements because we're in a new month or year
 * @member global
 * @method updateHeaderElements
 */
function updateHeaderElements() {
  var context = document.getElementById('ui-datepicker-div');
  if (!context) {
    return;
  }

  $(context).find('table').first().attr('role', 'grid');

  prev = $('.ui-datepicker-prev', context)[0];
  next = $('.ui-datepicker-next', context)[0];

  //make them click/focus - able
  next.href = 'javascript:void(0)';
  prev.href = 'javascript:void(0)';

  next.setAttribute('role', 'button');
  prev.setAttribute('role', 'button');
  appendOffscreenMonthText(next);
  appendOffscreenMonthText(prev);

  $(next).on('click', handleNextClicks);
  $(prev).on('click', handlePrevClicks);

  // add month day year text
  monthDayYearText();
}

/**
 * prepHighlightState
 * @member global
 * @method prepHighlightState
 */
function prepHighlightState() {
  var highlight;
  var cage = document.getElementById('ui-datepicker-div');
  highlight = $('.ui-state-highlight', cage)[0] ||
              $('.ui-state-default', cage)[0];
  if (highlight && cage) {
    setHighlightState(highlight, cage);
  }
}

/**
 * Set the highlighted class to date elements, when focus is recieved
 * @member global
 * @method setHighlightState
 */
function setHighlightState(newHighlight, container) {
  var prevHighlight = getCurrentDate(container);
  // remove the highlight state from previously
  // highlighted date and add it to our newly active date
  $(prevHighlight).removeClass('ui-state-highlight');
  $(newHighlight).addClass('ui-state-highlight');
}


/**
 * grabs the current date based on the hightlight class
 * @member global
 * @method getCurrentDate
 */
function getCurrentDate(container) {
  var currentDate = $('.ui-state-highlight', container)[0];
  return currentDate;
}

/**
 * Appends logical next/prev month text to the buttons
 * - ex: Next Month, January 2015
 *       Previous Month, November 2014
 * @member global
 * @method appendOffscreenMonthText
 * @param {Element} button
 */
function appendOffscreenMonthText(button) {
  var buttonText;
  var isNext = $(button).hasClass('ui-datepicker-next');
  var months = [
    'january', 'february',
    'march', 'april',
    'may', 'june', 'july',
    'august', 'september',
    'october',
    'november', 'december'
  ];
  var currentMonth = $('.ui-datepicker-title .ui-datepicker-month').text().toLowerCase();
  var monthIndex = $.inArray(currentMonth.toLowerCase(), months);
  var currentYear = $('.ui-datepicker-title .ui-datepicker-year').text().toLowerCase();
  var adjacentIndex = (isNext) ? monthIndex + 1 : monthIndex - 1;

  if (isNext && currentMonth === 'december') {
    currentYear = parseInt(currentYear, 10) + 1;
    adjacentIndex = 0;
  } else if (!isNext && currentMonth === 'january') {
    currentYear = parseInt(currentYear, 10) - 1;
    adjacentIndex = months.length - 1;
  }
  /*
  buttonText = (isNext)
                ? 'Next Month, ' + firstToCap(months[adjacentIndex]) + ' ' + currentYear
                : 'Previous Month, ' + firstToCap(months[adjacentIndex]) + ' ' + currentYear;

  $(button).find('.ui-icon').html(buttonText);
  */
}

/**
 * Returns the string with the first letter capitalized
 * @member global
 * @method firstToCap
 * @param {String} s
 */ 
function firstToCap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * frameName 에 해당하는 프레임이 존재 하는지 여부
 * @member global
 * @method checkExistsFrameByName
 * @param {String} frameName
 * @param {Window} win window
 * @return {boolean}
 */
function checkExistsFrameByName(frameName, win)
{
    // back 했을 경우 웹페이지가 만료되었습니다가 나올 수 있으므로 try catch 처리
    try
    {
      win = win || window.top;
      for ( var n = 0, nlen = win.frames.length; n < nlen; n++ )
      {
        if ( win.frames[n].name == frameName )
          return true;
        if ( checkExistsFrameByName(frameName, win.frames[n]) )
          return true;
      }
      return false;
    }
    catch(exception)
    {
      return false;
    }
}  

/**
 * element show hide
 * @member global
 * @method displayElement
 * @param {String|Element} element
 * @param {Boolean} show
 */
function displayElement(element, show)
{
    element = returnjQueryObj(element);
    //show? element.show():element.hide();
    var display = show?"":"none";
    if(element.hasClass("hiddenZone")) element.removeClass("hiddenZone");
    element.css("display",display);
    element.parent(".btn").removeClass("hiddenZone").css("display", (show? "":"none")); //inline-block으로 했을 경우 원치않는 padding이 먹는 경우가 있어 default값으로 치환 kyn
}
/**
 * 엔터 입력 여부
 * @member global
 * @method enterKeyDown
 * @param {Event} e
 * @return {boolean}
 */
function enterKeyDown(e)
{

    var ele = $(e.target);
    var eCode = (window.netscape) ? e.which : event.keyCode; 
    /* 2017.10.30 익스플로이고, input 박스에 text이면서 포맷이 적용되어있다면 해당 포맷을 설정하고, 조회할수 있도록 한다. */
    if (eCode == 13)
    {
      if(isIE() && (ele.prop("tagName") == "INPUT") && (ele.attr("TYPE") == "text") && (ele.attr("data_format") != "") )
      {
        formatInput(e.target);
      }
      return true;
    } 
    else return false; 
}
/**
 * form element, image, button element 를 활성화 또는 비활성화
 * @member global
 * @method enableInput
 * @author 2013-02-15 서영준(HCG )
 * @param {String|Element} elem
 * @param {Boolean} b
 * @param {Boolean} convertCombo
 * @param {Number} size SELECT 일경우 TEXT로 CONVERT시 TEXT FIELD 사이즈
 */
function enableInput(elem, b, convertCombo, size)
{
    b = !!b;
    if ( elem == null ) alert("enableInput: elem is null !!!");
    
    elem = returnjQueryObj(elem);
    switch (elem.prop("tagName"))
    {
      case "INPUT":
      {       
        switch ( elem.attr("TYPE"))
        {
          //case "hidden":
          case "text":
          case "password":
          {
            elem.attr("readOnly", !(b));
            //elem.removeClass('intxt_bg');
            //b?elem.removeClass('intxt_bg'):elem.addClass('intxt_bg');
            b?elem.css("background", "white"):elem.css("background", "#eee");
            //날짜 형식은 jquery-ui를 사용하기 때문에 따로 처리
            //if(elem.is(".format") && elem.attr("data_format") == "dfDateYmd") elem.datepicker(b? "enable":"disable");
            //input tag가 readOnly일 경우는 applyElementFormat()에서 달력버튼을 안만들어줌. 
        //readOnly가 해제 되었을경우도 달력버튼을 안만들어준상태에서 enable만 시키기 때문에 달력버튼이 나타나지 않음. 아래에 달력버튼 생성로직 추가(20150720)
            if(elem.is(".format") && elem.attr("data_format") == "dfDateYmd"){
              if(elem.attr("readOnly")){
                elem.datepicker("option", "buttonImage", "/resource/images/icon/icon_calendar_off.gif");
                elem.datepicker("disable");
              }else if(elem.attr("readOnly") == undefined || elem.attr("readOnly") == false){
              //img태그가 없을경우에만 새로 생성
                if(!elem.parent().find('img').is('img')){
                  elem.datepicker({
                        showOn: "button",
                        buttonImage: "/resource/images/icon/icon_calendar.gif",
                        buttonImageOnly: true,
                        buttonText : "",
                        dateFormat : "yy.mm.dd",
                        changeYear:true,
                        changeMonth:true,
                        closeText:"Close",
                        yearRange:"1900:2100",
                        showOtherMonths:true,
                        selectOtherMonths:true,
                        showButtonPanel: true,
                        onSelect : function(dateTEXT, inst)
                        {
                          try
                          {
                            if($(elem).attr("onblurchange")!=undefined)
                            {
                              $(elem).trigger("blur"); 
                            }
                            if($(elem).attr("change")!=undefined)
                            {
                              $(elem).trigger("change");
                            }
                          }catch(e){}
                        }
                  });
                  var $elemImg = elem.parent().find('img');
                  $elemImg.css("vertical-align","middle").css("width","20px"); //px를 강제로 줘서 크롬에서 offset() 을 가져올때 캐쉬에 있는 것을 참고하지 않토록함.
                  $elemImg.css('cursor','pointer');
                }
                else
                {
                  elem.datepicker("option", "buttonImage", "/resource/images/icon/icon_calendar.gif");
                }
                elem.datepicker("enable");
                var $elemImg = elem.parent().find('img');
                $elemImg.css('cursor','pointer');
              }
            }
          }
          break;
          case "image":
          case "button":
          {
            elem.prop("disabled", (!b));
            elem.css("cursor", (b ? "pointer":"default"));
            elem.parent().css("cursor", (b ? "pointer":"default")); //버튼의 우측끝처리 때문에 span의 커서모양도 변경
            //elem.removeClass('disabled');
            b?elem.removeClass('disabled'):elem.addClass('disabled');
          }
          break;
          case "checkbox":
          case "radio":
          case "file":
          case "reset":
          case "submit":
          {
            elem.prop("disabled", (!b));
          }
          break;
        }
      }
      break;
      case "SELECT":
      {
        elem.prop("disabled", (!b));
        if ( convertCombo == true) convertCombo2Text(elem, !!b, size);
        b?elem.css("background", "white"):elem.css("background", "#eee");
      }
      break;
      case "TEXTAREA":
      {
        elem.prop("readOnly", (!b));
        //elem.removeClass('disabled');
        //b?elem.removeClass('disabled'):elem.addClass('disabled');
        b?elem.removeClass('disabled'):elem.addClass('disabled');
      }
      break;
      case "IMG":
      {
        elem.prop("disabled", (!b));
        elem.css("cursor", (b ? "hand":""));
        elem.removeClass('disabled');
        b?elem.removeClass('disabled'):elem.addClass('disabled');
      }
      break;
    }
}
/**
 * val 값을 가진 radio 버튼을 check 하고 check된 radio버튼의 index를 리턴
 * @member global
 * @method checkRadio
 * @param {String|Element} radio
 * @param {String} val
 * @param {Boolean} bClick true: check 후 onclick 실행
 * @return {Number} 체크된 radio버튼 index
 */
function checkRadio(radio, val, bClick)
{
    if ( typeof radio == 'string' ) radio = document.getElementsByName(radio);
    var len = radio.length;
    if ( len )
    {
      for ( var n = 0; n < len; n++ )
      {
        if ( radio[n].value == val )
        {
          radio[n].checked = true;
          if ( bClick ) radio[n].onclick();
          return n;
        }
        else
        {
          radio[n].checked = false;
        }
      }
    }
    else
    {
      if ( radio.value == val )
      {
        radio.checked = true;
        if ( bClick ) radio.onclick();
        return 0;
      }
      else
      {
        radio.checked = false;
      }
    }
    return -1;
}

/**
 * 동일한 name의 radio 버튼 모두를 check 또는 uncheck
 * @member global
 * @method checkRadioAll
 * @param {String|Element} radio radio태그 name
 * @param {Boolean} b check uncheck 여부
 */
function checkRadioAll(radio, b)
{
    b = !!b;
    if ( typeof radio == 'string' ) radio = document.getElementsByName(radio);
    var len = radio.length;
    if ( len )
    {
      for ( var n = 0; n < len; n++ )
      {
        radio[n].checked = b;
      }
    }
    else
    {
      radio.checked = b;
    }
} 

/**
 * html문자열에서 &,<,> 를 각각 &amp, &lt, &gt로 변환한다.
 * @member global
 * @method escapeHTML
 * @param {String} str
 * @returns {String}
 */
function escapeHTML(str) 
{
    var rStr = "";
    if(str==null || str==undefined) rStr = "";
    else
      rStr = str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return rStr;
}
/**
 * 이름으로 프레임 찾기
 * @member global
 * @method findFrameByName
 * @param {String} frameName 찾을 프레임명
 * @param {String} direction 시작 프레임에서 찾는 방향 UP: 상위, default: 하위
 * @param {Frame} firstFrame 찾기 시작 프레임
 * @return {Frame}
 */
function findFrameByName(frameName, direction, firstFrame)
    {
      firstFrame = firstFrame || window;
      direction = direction || 'UP';
      if ( direction == 'UP' )
      {
        for ( var frame = firstFrame; ; frame = frame.parent)
        {
          if ( frame.name == frameName )
            return frame;
          if ( frame == top )
            break;
        }
      }
      else
      {
        var frame = firstFrame;
        if ( frame.name == frameName )
          return frame;
        for ( var n = 0, nlen = frame.frames.length; n < nlen; n++ )
        {
          var frame = findFrameByName(frameName, direction, frame.frames[n]);
          if ( frame )
            return frame;
        }
      }
      return null;
}
/**
 * form element 를 map 데이터로 구성
 * @member global
 * @method form_getData
 * @param {Element} form
 * @return {Array} formdata 배열
 */
function form_getData(form)
{

  form = returnjQueryObj(form);
  var element;
  var elearray;
  var formdata = {};

  form.find("input, select, a, button, textarea").each(function (i,v){
  
    element = $(v);
    elearray = formdata[element.attr("name")] == null ? formdata[element.attr2("name")] = new Array : formdata[element.attr2("name")];

    if(element.attr2("name"))
    {
      
      switch ( element.prop("tagName") )
      {
        case "SELECT":
        {
          if ( element.attr2("multiple") )
          {
            element.children().each(function (i,v){
                if($(v).attr("selected") )
                {
                  elearray[elearray.length] = $(v).val();
                }
              }
            );
          }
          else
          {
            elearray[elearray.length] = element.val();
          }
        }
        break;
        case "INPUT":
        {
          switch ( element.attr("type") )
          {
            case "checkbox":
            case "radio":
            {
              if ( element.attr("checked") )
              {
                elearray[elearray.length] = element.val();
              }
            }
            break;
            default:
            {
              elearray[elearray.length] = element.val();
            }
            break;
          }
          break;
        }
        break;
        default:
        {
          elearray[elearray.length] = element.val();
        }
        break;            
      }
    }
  });

  return formdata;
}      
/**
 * radio 버튼의 checked 된 값을 리턴
 * @member global
 * @method getCheckedValue
 * @param {String|Element} radio
 * @return {String} radio버튼 value
 */
function getCheckedValue(radio)
{
  if ( typeof radio == 'string' ) radio = document.getElementsByName(radio);
  var size = radio.length;
  if ( ! size ) {
    return radio.checked ? radio.value : null;
  }
  for ( var n = 0; n < size; n++ ) {
    if ( radio[n].checked ) {
      return radio[n].value;
    }
  }
  return null;
}   


/**
 * val 비밀번호 값을 자릿수 num1만큼 최소 check 및 num2만큼 종류 조합
 * @member global
 * @method chkVaildPwdVar
 * @param {String} password 패스워드
 * @param {Number} num1 최소 자릿수 체크
 * @param {Number} num2 영어 대문자, 영어소문자, 숫자, 특수문자 중 1~4가지 종류 조합
 * @return {Boolean} 체크가 제대로 되었는지 여부
 */
function chkVaildPwdVar(password, num1, num2)
{
    var return_flag = true;
    
    var textRegularUp = /[A-Z]+/;
    var textRegularLo = /[a-z]+/;
    var numberRegular = /[1-9]+/;
    var specialRegular = /[!,@,#,$,%,^,&,*,?,_,~]/;

    var nTU = 0;
    var nTL = 0;
    var nN = 0;
    var nS = 0;
    
    if (textRegularUp.test(password)) nTU++;
    if (textRegularLo.test(password)) nTL++;
    if (numberRegular.test(password)) nN++;;
    if (specialRegular.test(password)) nS++;;
    
    if(password.length < num1){
      //alert("비밀번호는 최소 "+num1+"자리 이상으로 입력해주십시오.");
      alert(ajaxMsg("MSG_ALERT_PW_NUM",null,num1));
      return_flag = false;
    }

    if(return_flag){
      if(Number(nTU)+Number(nTL)+Number(nN)+Number(nS) < num2){
        //alert("비밀번호는 영문대문자, 소문자, 숫자, 특수문자 중 "+num2+"종류를 조합해서 입력해주십시오.");
        alert(ajaxMsg("MSG_ALERT_PW_GUBUN",null,num2));
        return_flag = false;
      }
    }
    
    return return_flag;
}

/**
 * xsheet 로 콤보 값 세팅
 * @member global
 * @method makeComboTextXS
 * @param {Object} xs XmlSheet객체
 * @param {String} data_key
 * @param {String} delCol 컬럼구분
 * @param {String} delRow 로우구분
 * @return {String} comboText
 */
function makeComboTextXS(xs, data_key, delCol, delRow)
{
  delCol = delCol || "□";
  delRow = delRow || "■";
  var tmpArr = [];
  var rowCnt = xs.RowCount(data_key);
  for ( var r = 0, RowCount = rowCnt; r < RowCount; r++ )
  {
    tmpArr.push([xs.GetCellValue(r, 0, data_key), xs.GetCellValue(r, 1, data_key)]);
  }
  var comboText = $.protify(tmpArr).inject([], function(result, v)
  {
    result.push(v.join(delCol));
    return result;
  }).join(delRow);
  return comboText;
}      
/**
 * XmlSheet 객체로 콤보 박스 구성
 * @member global
 * @method makeSelectXS
 * @param {String} sel selectbox Id
 * @param {Object} xsheet xmlSheet
 * @param {String} data_key
 */
function makeSelectXS(sel, xsheet, data_key)
{
  sel = $("#"+sel)[0];
  if ( xsheet == null ) return;
  for ( var row = 0, rcnt = xsheet.RowCount(data_key); row < rcnt; row++ )
  {
    sel.options.add(new Option(xsheet.GetCellValue(row, 0, data_key), xsheet.GetCellValue(row, 1, data_key)));
  }
}      
/**
 * 콤보 세팅
 * @member global
 * @method setCombo
 * @param {String|Object} combo_array 
 * @param {String|Object} comboObj combo적용하려는 selectbox id or ibsheet헤더정보 배열
 * @param {String} saveName combo를 적용하려는 ibsheet의 saveName
 * @param {String} option combo옵션
 * @param {Array} first_append_combo_array combo의 처음에 덧붙여질 배열
 * @param {Number} sheetRow combo를 반영할 row index. 입력하지 않으면 컬럼 전체에 적용됨
 */
function setCombo(combo_array, comboObj, saveName, option, first_append_combo_array, sheetRow)
{
    var comboObj2  =comboObj;
    var value_array = new Array();

    if ( comboObj == null ) alert("Error: setCombo comboObj("+comboObj+") is null");

  //if("S_OBJ_TREE_TYPE" == comboObj2) alert([typeof comboObj,comboObj2, typeof comboObj == "string" ? $("#" + comboObj)[0] : comboObj]);
  comboObj = typeof comboObj == "string" ? $("#" + comboObj)[0] : comboObj;
  if(comboObj == undefined || comboObj == null) return;
  
  combo_array = (typeof combo_array == 'object' && !!combo_array.RowCount) ? makeComboTextXS(combo_array) : combo_array;
 
  if ( typeof combo_array == 'string' )
  {
    combo_array = combo_array.split("■");
    combo_array = $.protify(combo_array).inject([], function(array, elem, idx)
    {
      array.push(elem.split('□'));
      return array;
    });     
  }
  
  //if("S_OBJ_TREE_TYPE" == comboObj2) alert([comboObj2  ,comboObj,_xsApplType.requestText]);
  if ( comboObj.tagName == "SELECT" )
  {
    if($(comboObj).attr("multiple") == "multiple")
    {
    /*
        if(option == "A")
      {
        $(comboObj).change().multipleSelect({selectAll: true});
      }
      */
    }else
    {
      switch ( option )
    {
        case "A":{combo_array = [[ajaxMsg("MSG_all_1"),'']].concat(combo_array);}break; //-전체-
        //콤보리스트에 조회된 데이터들의 value들을 전체의 value로 넣음 w.y.c 2014-02-27
        case "AA":
        {
            //combo_array의 value들만 모음
          for(var i = 0; i < combo_array.length; i++)
        {
          value_array.push(String(combo_array[i]).split(',')[1]);
          }
            combo_array = [[ajaxMsg("MSG_all"),value_array]].concat(combo_array);
        }
        break; //-전체-
        case "A%":{combo_array = [[ajaxMsg("MSG_all"),'%']].concat(combo_array);}break; //전체
        case "S":{combo_array = [[ajaxMsg("MSG_select_1"),'']].concat(combo_array);}break; //-선택-
        case "N":{combo_array = [['','']].concat(combo_array);}break;
        case "U":{combo_array = first_append_combo_array.concat(combo_array);}break;
      }
    }
    $.protify(combo_array).each(function(elem)
    {
      comboObj.options.add(new Option(elem[0], elem[1]));
    });
    // ie8에서 multiple 재선언 하지 않으면 나오지 않음.
    //+ 기본적으로 값을 세팅 해줄때에서 재선언 해야하므로 
    if($(comboObj).attr("multiple") == "multiple" )
    {
    if(option == "A")
      {
      $(comboObj).multipleSelect({selectAll: true});
      }else
      {
        $(comboObj).multipleSelect({selectAll: false});
      }
    }
  }
  else if ( comboObj && sheetRow)  //comboObj로 sheet ID를 받고 sheetRow가 null이 아니면 해당 셀의 콤보리스트만 변경
  {
     switch ( option )
    {
      case "A":{combo_array = [[ajaxMsg("MSG_all"),'%']].concat(combo_array);}break;
      //콤보리스트에 조회된 데이터들의 value들을 전체의 value로 넣음 w.y.c 2014-02-27
      case "AA":
      {
        //combo_array의 value들만 모음
      for(var i = 0; i < combo_array.length; i++)
      {
        value_array.push(String(combo_array[i]).split(',')[1]);
      }
        combo_array = [[ajaxMsg("MSG_all"),value_array]].concat(combo_array);
      }
      break; //-전체-
      case "S":{combo_array = [[ajaxMsg("MSG_select"),'']].concat(combo_array);}break;
      case "N":{combo_array = [['','']].concat(combo_array);}break;
      case "U":{combo_array = first_append_combo_array.concat(combo_array);}break;
    }
     
     
    var combo_text_array = [], combo_value_array = [];
    $.protify(combo_array).each(function(elem)
    {
      combo_text_array.push(elem[0]=='' ? ' ':elem[0]);// sheet 콤보에서 텍스트의는 빈문자를 무시한다
      combo_value_array.push(elem[1]);
    });
    
    var combo_text_string = combo_text_array.join('|');
    var combo_value_string = combo_value_array.join('|');
   
    var info = {ComboCode:combo_value_string, ComboText:combo_text_string};
    //comboObj.CellComboItem(sheetRow, saveName, combo_text_string, combo_value_string);
    comboObj.CellComboItem(sheetRow, saveName, info);
  }
  else if ( !!comboObj.Version ) //sheet는 Version확인 function이 있으므로 sheet객체면 true (sheet의 해당 컬럼 combo값을 변경할때)
  {
    switch ( option ){
      case "A":{combo_array = [[ajaxMsg("MSG_all"),'%']].concat(combo_array);}break;
      //콤보리스트에 조회된 데이터들의 value들을 전체의 value로 넣음 w.y.c 2014-02-27
      case "AA":
      {
        //combo_array의 value들만 모음
      for(var i = 0; i < combo_array.length; i++)
      {
        value_array.push(String(combo_array[i]).split(',')[1]);
      }
        combo_array = [[ajaxMsg("MSG_all"),value_array]].concat(combo_array);
      }
      break; //-전체-
      case "S":{combo_array = [[ajaxMsg("MSG_select"),'']].concat(combo_array);}break;
      case "N":{combo_array = [['','']].concat(combo_array);}break;
      case "U":{combo_array = first_append_combo_array.concat(combo_array);}break;
    }
    
    var combo_text_array = [], combo_value_array = [];
    $.protify(combo_array).each(function(elem){
      combo_text_array.push(elem[0]=='' ? ' ':elem[0]);// sheet 콤보에서 텍스트의는 빈문자를 무시한다
      combo_value_array.push(elem[1]);
    });
    
    var combo_text_string = combo_text_array.join('|');
    var combo_value_string = combo_value_array.join('|');
    var info = {ComboCode:combo_value_string, ComboText:combo_text_string};
    comboObj.SetColProperty(0, saveName, info);
  }
  else if ( comboObj[0].Type )    //comboObj로 cols를 받을때
  {
     switch ( option )
    {
      case "A":{combo_array = [[ajaxMsg("MSG_all"),'%']].concat(combo_array);}break;
      //콤보리스트에 조회된 데이터들의 value들을 전체의 value로 넣음 w.y.c 2014-02-27
      case "AA":
      {
        //combo_array의 value들만 모음
      for(var i = 0; i < combo_array.length; i++)
      {
        value_array.push(String(combo_array[i]).split(',')[1]);
      }
        combo_array = [[ajaxMsg("MSG_all"),value_array]].concat(combo_array);
      }
      break; //-전체-
      case "S":{combo_array = [[ajaxMsg("MSG_select"),'']].concat(combo_array);}break;
      case "N":{combo_array = [['','']].concat(combo_array);}break;
      case "U":{combo_array = first_append_combo_array.concat(combo_array);}break;
    }
    var combo_text_array = [], combo_value_array = [];
    $.protify(combo_array).each(function(elem, val)
    {
      combo_text_array.push(elem[0]=='' ? ' ':elem[0]);// sheet 콤보에서 텍스트의는 빈문자를 무시한다
      combo_value_array.push(elem[1]);
    });
    
    
    //alert([combo_array,combo_text_array,saveName]);
    var combo_text_string = combo_text_array.join('|');
    
    var combo_value_string = combo_value_array.join('|');
    
    if ( sheetRow == null )
    {
      // combo_text_string, combo_value_string
       for(var i=0;i<comboObj.length;i++){
         if(comboObj[i].SaveName == saveName)
         {
           comboObj[i].ComboText = combo_text_string;
           comboObj[i].ComboCode = combo_value_string;
         }
       }
    }
  }
  else
  {
    alert("Wrong...");
    }
}
/**
 * selectBox의 option 을 combo를 생성하기 위한 string 으로 반환
 * @member global
 * @method getComboStr
 * @param {String} combo selectBox Id
 * @param {Boolean} b false : 전체, 선택, ... 제외: true : 전체, 선택, ... 포함
 * @return {String}
 */
function getComboStr(combo, b)
{
  var combo = $("#"+combo);
  var comboStr ="";
  
  if(combo.prop("tagName") != "SELECT") return;
  
  combo.children().each(function (i,v) {
    if( (!b && i != 0) || b ) {
      comboStr += $(this).text()+"□"+$(this).val()+"■";
    }
  }); 
  return comboStr.substring(0,comboStr.length-1);
}

/**
 * text로 selectBox의 value 찾기
 * @member global
 * @method getComboValueByText
 * @param {String|Element} combo selectBox Id or selectBox
 * @param {String} text 검색할 text
 * @returns {String} selectBox option value
 */
function getComboValueByText(combo, text)
{
  combo = returnjQueryObj(combo);
  var option = $.protify(combo.find('option')).detect(function(option){
    return option.text == text;
  });
  return option ? option.value : null;
}

/**
 * 콤보박스 선택 text
 * @member global
 * @method getSelectedText
 * @param {String|Element} sel selectBox Id or selectBox
 * @param {String} defaultText selectBox의 목록이 없을경우 나올 default text
 * @return 
 */
function getSelectedText(sel, defaultText)
{ 
  if(typeof sel == "string") sel = $("#"+sel)[0];
  else sel = $(sel)[0];
  defaultText = defaultText || '';
  return sel.selectedIndex > -1 ? sel.options[sel.selectedIndex].text : defaultText;
  //return $("#"+sel+ " option:selected").length > 0 ?$("#"+sel+ " option:selected").text() : defaultText;
}
/**
 * 콤보박스 option 삭제
 * @member global
 * @method setOptionValuesOnly
 * @param {String} sel selectBox Id
 * @param {Array} values
 */
function setOptionValuesOnly(sel, values)
{
  var val = "" ;
  $(values).each(function (i, v){  $("#"+sel).children("[value="+v+"]").addClass("selectRemove")} );
  $("#"+sel).children(":not(.selectRemove)").remove().removeClass("selectRemove");
}
/**
 * 콤보 권한 체크하여 값 세팅
 * @member global
 * @method makeAuthCombo
 * @param {String|Element} combo selectBox Id or selectBox
 * @param {String} OP_CD 옵션코드
 * @param {String} CD_TXT 찾으려는 text
 * @param {String} exCode 예외코드
 */
function makeAuthCombo(combo, OP_CD, CD_TXT, exCode)
{
  if(typeof combo == "string") combo = $("#"+combo)[0];
  switch ( OP_CD )
  {
    case "ALL":
    {
      //skip
    }
    break;
    case "NOT IN":
    {
      $.protify($.makeArray($(combo).find('option'))).reverse().each(function(item)
      {
        // text, value, index
        if (!item.value){
          combo.options.remove(item.index);
        }else if ( CD_TXT.indexOf("'"+item.value+"'") >= 0 ){
          if ( exCode && exCode == item.value ){
          }else{
            combo.options.remove(item.index);
          }
        }
      });
    }
    break;
    case "IN":
    default:
    {
      $.protify($.makeArray($(combo).find('option'))).reverse().each(function(item)
      {
        // text, value, index
         if (!item.value){
           combo.options.remove(item.index);
        }else if ( CD_TXT.indexOf("'"+item.value+"'") < 0 ){
          if ( exCode && exCode == item.value ){
          }else{
            combo.options.remove(item.index);
          }
        }
      });
    }
    break;
}
  if ( combo.length == 0 )
  {
    combo.options.add(new Option("----", "----"));
  }
}
/**
 * select box 의 값이 있는 첫번째 option 을 선택
 * @member global
 * @method selectFirstValueOption
 * @param {String|Element} sel selectBox Id or selectBox
 */
function selectFirstValueOption(sel)
{
  //$(sel).find('option:eq(0)').each(function(index, opt){
  //  opt.selected = true;
  //});
  
  sel = returnjQueryObj(sel);
  sel.find("option[value!='']:eq(0)").attr("selected", true);
}  
/**
 * select box 를 v 값으로 선택. 없으면 무시
 * @member global
 * @method setSelect
 * @param {String} sel selectBox Id
 * @param {String} v 선택하려는 value
 */
function setSelect(sel, v)
{
 $("#"+sel).val(v).attr2("selected", true);
}

/**
 * property를 form의 속성으로 담고 parameters를 input hidden 으로 만들어 form을 submit
 * @member global
 * @method submit2
 * @param {Json} property
 * @param {Json} parameters
 */
function submit2(property, parameters)
{
  var form = $(document.createElement("form")).attr(property);
  $(form).attr("method", property.method || "post");// default method is post
  var input, value;
  parameters = $.extend(parameters, {__viewState:toJsonString(parameters)});
  for ( var name in parameters )
  {
    value = parameters[name];
    
    if(typeof value == "boolean")
    {
      value = String(value);
    }
    if ( $.protify(["string", "number"]).include(typeof value) )
    {
      form.append($(document.createElement("input")).attr({name: name, type: "hidden", value: value}));
    }
    else if ( typeof value == "array" )
    {
      value.each(function(v)
      {
        form.append($(document.createElement("input")).attr({name: name, type: "hidden", value: v}));
      });
    }
    else
    {
      input = $(document.createElement("input")).attr({name: name, type: "hidden", value: value || ''});
      form.append(input);
    }
  }
  form.insertAfter(document.body);
  form.submit();
  form.remove();
  form = null;
}

/**
 * submit2와 비슷한데 현재 사용 안하는듯. hidden 폼 만들어서 submit(파라미터json방식)
 * @member global
 * @method submit3
 * @param {Json} property
 * @param {Json} parameters
 */
function submit3(property, parameters)
{
  var form = $("<form></form>").attr(property);
  $(form).attr("method", property.method || "post");// default method is post
  var input;
  input = $("<input>").attr({name: "jsonParam", type: "hidden", value: JSON.stringify(parameters)});
  form.append(input);
  form.insertAfter(document.body);
  form.submit();
  form.remove();
  form = null;
} 
/**
 * form의 input tag를 Json 형식으로 반환
 * @member global
 * @method serializeForm
 * @param {String} formName form의 name
 * @return {Json} 
 */
function serializeForm(formName)
{
  formName = nvl(formName, "f1");
  return $("form[name='"+formName+"']").serializeObject();
}
/**
 * 모든 버튼을 enable or disable
 * @member global
 * @method enableInputButtonAll
 * @param {Boolean} tf enable 여부
 */
function enableInputButtonAll(tf)
{
  $("input[type=button]").each(function(){
    enableInput($(this)[0].id, tf);
  });
}
  
/**
 * 콤보를 텍스트 박스 형식으로 변경
 * @member global
 * @method convertCombo2Text
 * @param {String|Element} combo selectBox Id or selectBox
 * @param {Boolean} enable textbox를 감출지 여부
 * @param {Number} size textbox size
 */
function convertCombo2Text(combo, enable, size)
{
  combo = returnjQueryObj(combo);    
  size = nvl(size, "15");
  if ( enable )
  {
    combo.show();
    if ( combo.next() && combo.next().attr("combotextyn") == "Y" )
    {
      combo.next().hide();
    }
  }
  else
  {
    combo.hide();
    if ( combo.next() && combo.next().attr("combotextyn") == "Y" )
    {
      combo.next().val(getSelectedText(combo));        
      combo.next().show();
    }
    else
    {
      var inTxt = $("<input type='text' class='textForm intxt_bg' value='"+getSelectedText(combo)+"' readonly size='"+size+"' combotextyn='Y' />");
      combo.after(inTxt);
    }        
  }
}

//dom.js 끝

//util.js 시작

jQuery.ajaxSettings.traditional = true;

/**
 * @class jQuery
 */
jQuery.fn.extend({
  /**
   * jquery attr의 결과가 undefined이면 "" 아니면 결과를 리턴
   * @member jQuery
   * @method attr2
   * @param {String} name element의 속성키
   * @return {String} element 속성 값
   */
  attr2: function( name ) {
    var $tmp;
    if(name!=undefined && name!=null )
    {
      $tmp = $(this).attr(name);
    }
    return ($tmp == undefined)? "" : $tmp;
  },

  /**
   * 
   * @member jQuery
   * @method val2
   * @param 
   * @return 
   */
  val2: function( value ) {
    var hooks, ret, isFunction,
      elem = this[0];
    var rreturn = /\r/g;

    if ( !arguments.length ) {
      if ( elem ) {
        hooks = jQuery.valHooks[ elem.nodeName.toLowerCase() ] || jQuery.valHooks[ elem.type ];

        if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined && (ret = hooks.get( elem, "value" )) !== "undefined" ) {
          return ret;
        }

        ret = elem.value;

        return typeof ret === "string" ?
          // handle most common string cases
          ret == "undefined" ? "" : ret.replace(rreturn, "") :
          // handle cases where value is null/undef or number
          ret == null ? "" : ret;
      }

      return "";
    }


    isFunction = jQuery.isFunction( value );

    return this.each(function( i ) {
      var self = jQuery(this), val;

      if ( this.nodeType !== 1 ) {
        return "";
      }

      if ( isFunction ) {
        val = value.call( this, i, self.val() );
      } else {
        val = value;
      }

      // Treat null/undefined as ""; convert numbers to string
      if ( val == null ) {
        val = "";
      } else if ( typeof val === "number" ) {
        val += "";
      } else if ( jQuery.isArray( val ) ) {
        val = jQuery.map(val, function ( value ) {
          return value == null ? "" : value + "";
        });
      }

      

      hooks = jQuery.valHooks[ this.nodeName.toLowerCase() ] || jQuery.valHooks[ this.type ];

      // If set returns undefined, fall back to normal setting
      if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
        this.value = val;
      }
    });
  },
  
  /**
   * serializeObject 시 disbled된 input의 값은 넘길수 없으므로 넘길수 있게 수정
   * @member jQuery
   * @method serializeObject
   * @return {Json} 
   */
  serializeObject : function() 
  { 
    //disabled elements는 serialize() 에서 제외되므로 아래 처리를 해준다.
    var disabledElements = $("[disabled]").each(function(i,e){
      return this.disabled;
    });// disabled elements 모으고    
    disabledElements.each(function(i, e) { e.disabled = false; });// enable 해주고
    
    var o = {}; 
    var a = this.serializeArray(); 
    $.each(a, function() { 
        if (o[this.name] !== undefined) { 
            if (!o[this.name].push) { 
                o[this.name] = [o[this.name]]; 
            } 
            o[this.name].push(this.value || ''); 
        } else { 
            o[this.name] = this.value || ''; 
        } 
    }); 
    
    disabledElements.each(function(i, e) { e.disabled = true; });// 다시 disable
    
    return o; 
  },
  /**
   * qurey string 을 Json object 로 변환
   * @member jQuery
   * @method toQueryParams
   * @param {String} separator key,value 한쌍을 구분하는 구분자
   * @return {Json}
   */
  toQueryParams : function(separator)
  {
    var str = {};
    separator = nvl(separator,"&");

    str = this.selector.split(separator);

    var o = {};

    $(str).each(function (i, v) {
      v = v.split("=");
      var key = v[0];
      var value = {};
      value = decodeURIComponent(v[1]||"");
      
      if (o[key] !== undefined)  {
        if (!o[key].push) o[key] = [o[key]]; 
        o[key].push(value); 
      }
      else o[key] = value; 
    });

    return o;
  },
  /**
   * this에 탭효과를 반영하여 jQuery 객체로 반환
   * @member jQuery
   * @method tab
   * @param {String} iframe iframe name 
   * @param {Json} opt 옵션
   * @return {jQuery}
   */
  tab:function(iframe, opt ){
    var oTab = $(this);
    var oUl = oTab.children("ul");
    var nIndex = 0;
    oUl.children("li").each(function(){
      var oLi = $(this);
      oLi.attr("tab_index",nIndex);
      nIndex++;
      oLi.bind("click",function(e){
      
      var iframe = nvl(oTab.attr("iframe"),"iframe01");
      var childFrame = frames[iframe];
      var childDoc = childFrame.document;
      var objA = oLi.children("span").children("a");
      var gridUpdate = false;
      
      var arrSheet = [];
      $(childDoc.getElementsByTagName("TABLE")).each(function(){
        if($(this).hasClass("GMMainTable")) arrSheet.push($(this));
      });
      

      /* 2017.01.17 ibsheet 버전이 .62로 바뀌면서 sheet 그려주는 부분이 변경됨 */
      $(arrSheet).each(function(){
        var sGridId = childFrame.$(this).prop("id");
        if(sGridId.indexOf("-") > 0)
        {
          sGridId = sGridId.replaceAll("-table","");
        }
        if( eval("childFrame."+sGridId+".IsDataModified()") ){
          gridUpdate = true;
        }
      });
      
      if($(childDoc.body).attr("ISUPDATED")=="true" || gridUpdate==true){
        if(!confirm(ajaxMsg("MSG_CONFIRM_TABMOVE"),Page.LANG)) return; //저장되지 않은 정보가 있습니다.\n그래도 진행하시겠습니까
      }
      //MSG_CONFIRM_TABMOVE
        
        oUl.children("li.on").removeClass("on");
        oTab.attr("selectedIndex", oLi.attr("tab_index"));
        oTab.attr("selectedName", oLi.children("span").children("a").html());
        oTab.attr("selectedTab", oLi.children("span").children("a").attr("selTab"));
        oLi.addClass("on");
        
        if(objA.attr("tabFunc") != undefined){
         eval(objA.attr("tabFunc"));
      }else if(objA.attr("href").replace("javascript:","") != ""){
         eval(objA.attr("href"));
      }
      });
    });

    iframe = nvl(iframe,"iframe01");
    window.open("about:blank",iframe);
    oTab.attr("iframe", iframe);

    if(opt==null || opt.selectFirst != false ){
      setTimeout(function(){
        $(oUl.children("li")[0]).trigger("click");
      },0);
    }
    else if(opt.selectFirst == false)
    {
      oTab.attr("selectedIndex", 0);
      oTab.attr("selectedName", oUl.find("li > span > a").html());
      oTab.attr("selectedTab", oUl.find("li > span > a").attr("selTab"));
      oUl.children().first().addClass("on");
    };

    oTab.reSelect = function(){
      var oUl = oTab.children("ul");
        var selectedIndex = oTab.attr("selectedIndex");
        $(oUl.children("li")[selectedIndex]).trigger("click");
    };

    oTab.tabScroll = function(dir){
      var oDiv = $(this);
      var scrollLeft = oDiv.scrollLeft();

      try{
        var addWidth = 0;
          oDiv.find("li").each(function(i,v){
            addWidth +=  $(v)[0].clientWidth;
            if(dir == "L" && scrollLeft <= addWidth)
            {
              oDiv.scrollLeft( addWidth - $(v)[0].clientWidth);
              throw 'break;';
            }else if(dir == "R" && scrollLeft < addWidth)
            {
              oDiv.scrollLeft( addWidth); 
              throw 'break;';            
            }
          });
      }catch(e){}
    
    };
    
    return oTab;
  },
  /**
   * throw $break 사용하기 위하여 추가
   * @member jQuery
   * @method _each
   * @param {Function} callback 사용자 정의 function
   * @param {Object} args callback function 에 적용할 parameter
   * @return {Object} this
   */
  _each: function(  callback, args ) {
    var object = this, 
        name,
        i = 0,
        length = object.length,
        isObj = length === undefined || jQuery.isFunction( object );

    try {
      if ( args ) {
        if ( isObj ) {
          for ( name in object ) {
            if ( callback.apply( object[ name ], args ) === false ) {
              break;
            }
          }
        } else {
          for ( ; i < length; ) {
            if ( callback.apply( object[ i++ ], args ) === false ) {
              break;
            }
          }
        }

      // A special, fast, case for the most common use of each
      } else {
        if ( isObj ) {
          for ( name in object ) {
            if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
              break;
            }
          }
        } else {
          for ( ; i < length; ) {
            if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
              break;
            }
          }
        }
      }
    } catch (e) {
      if (e != $break) { throw e; }
    }
    return object;
  },
  size: function() {
      return this.length
  }
});

var $break = { };

/**
 * 프로그래스 바
 * @class Progress
 */
var Progress = {
      /** 프로그래스 바 갯수 */
      count : 0,
      /** 프로그래스 바가 만들어져 있는지 여부 */
      isMade : false,
      /** 사용안함*/
      cover_elem : null,
      /** 사용안함*/
      progr_elem : null,
      /** 프로그래스 바 레이어 */
      $progLayer : null,
      /**
       * 프로그래스 바 생성
       * @method start
       * @member Progress
       * @param {Object} options 사용안함
       */
      start : function(options) {
        var prog = this;
        var target, top, left;
        
        if ($('.wBox').index() == -1)
        { 
          target = $(window);
          top = target.height();
          left = target.width();
        }
        else
        {
          target = $(".wBox")[0];
          top = target.clientHeight;
          left = target.clientWidth;
        }
        if (!prog.isMade) {
            var cente_html = "<div id=ProgressBar style='position:absolute;top:0px;left:0px;width:159px;height:62px;z-index:10000;' ><img src='/resource/images/common/loading_s_s.gif' ></div>";
            $("body").append(cente_html);
            prog.isMade = true;
        }
        prog.count++;
        
        if (prog.count == 1) {
            $("#ProgressBar").css("display","block");
          
            Progress.$progLayer = $("<div id='progressLayer' tabindex='-1' style='position:absolute; width:100%; height:100%; background-color:#000000; z-index:10000; '/>").css("opacity", "0");
            $("body").append(Progress.$progLayer);
        }
        $('#ProgressBar').css("top", (top / 2 - 31)).css("left", Math.round(left / 2 - 80));
      },
      /**
       * 프로그래스 바 삭제
       * @method stop
       * @member Progress
       */
      stop : function() {
          var prog = this;

        setTimeout(function () {
          prog.count--;
          if (prog.count == 0) {
            $("#ProgressBar").css("display","none");
            $("#progressLayer").remove();
          } else if (prog.count < 0) {
            prog.count = 0;
          }
        },0);
      }
};
/*
 * 2014-01-10 수정
Progress = {
    count : 0,
    isMade : false,
    cover_elem : null,
    progr_elem : null,
    start : function(options) {
      var prog = this;
      var target, top, left;

      if ($('.wbox').index() == -1)
      { 
        target = $(window);
        top = target.height();
        left = target.width();
      }
      else
      {
        target = $(".wbox")[0];
        top = target.clientHeight;
        left = target.clientWidth;
      }

      if (!prog.isMade) {
          var cente_html = "<div id=ProgressBar style='position:absolute;top:0px;left:0px;width:159px;height:62px;z-index:10000;' ><img src='/common/images/common/loading_s_s.gif' ></div>";
          $("body").append(cente_html);
          prog.isMade = true;
      }
      prog.count++;
      if (prog.count == 1) {
          $("#ProgressBar").show();
      }
      $('#ProgressBar').css("top", (top / 2 - 31)).css("left", Math.round(left / 2 - 80));
    },
    stop : function() {
        var prog = this;
        prog.count--;
        if (prog.count == 0) $("#ProgressBar").hide();
        else if (prog.count < 0) prog.count = 0;
    }
};
*/

/**
 * 화면에 시트 그리기
 * @member global
 * @method writeIBSheet
 * @param {String} skin_path 적용디자인css가 있는 경로(현재 사용 안함)
 * @param {String} id sheet id
 * @param {String} width
 * @param {String} height
 */
function writeIBSheet(skin_path, id, width, height) 
{

  id = nvl(id, "sheet1");

  width = nvl(width, "1000px");
  height = nvl(height, "200px");
  lang = Page.LANG;
  /*
   * lsg수정
   * 메시지파일의 확장자가 .ko가 없을 경우 사용
   * 현재 en, cn, jp만 관리 하고 있음.
   * 추후 새로운 언어가 생성되면 common -> Sheet -> ibmsg를 만들어 준다. ex) ibmsg.xx
  */
  if(lang == 'ko')
  {
  createIBSheet(id, width, height);
  }
  else
  {
  createIBSheet(id, width, height, lang);
  }
  /*
             메시지파일의 확장자가 .ko가 있을 경우 사용
  
        createIBSheet(id, width, height, lang);
  */
} 
/**
 * 시트 정의
 * @member global
 * @method initSheetColumn
 * @param {Object} sheet
 * @param {Array} cols 컬럼 정의 배열
 * @param {Number} headerCnt 헤더 Row 수
 */
function initSheetColumn(sheet, cols, info, headerCnt)
{
  for(idx in cols){
    if(cols[idx].Type == "CheckBox" || cols[idx].Type == "Radio" || cols[idx].Type == "DummyCheck"){
      cols[idx].TrueValue = "Y";
      cols[idx].FalseValue = "N";
    }
  }      
  sheet.InitHeaders(setHeaders(cols, headerCnt),info);
  sheet.InitColumns(cols);
  sheet.SetCountPosition(4);
  sheet.SetClipCopyMode(0);
  sheet.SetClipPasteMode(2);
}

/**
 * 시트 조회, 저장 후 넘어오는 메시지를 체크
 * @member global
 * @method doCheckMsg
 * @param {String} msg
 * @return {Boolean}
 */
function doCheckMsg(msg)
{
  //console.log(msg);
  msg = nvl(msg);
  if ( startsWith(msg,"LOGIN_CHECK_FAIL") )
  {
    if ( confirm(msg+"\n\n"+ajaxMsg("MSG_0013", Page.LANG)) )
    {
      checkLogout();
    }
    return false;
  }
  
  //OTP 메시지 재정의를 원할 경우 주석 해제, OTP_IS_WRONG 다국어프로퍼티를 원하는 메시지로 수정
  /*
  if(msg.indexOf("OTP is wrong") != -1)
  {
    if ( confirm(getMultiLang("message", "OTP_IS_WRONG", "Unauthorized request. OTP is wrong.~!~!", Page.LANG)+"\n\n"+ajaxMsg("MSG_0013", Page.LANG)) )
    {
      checkLogout();
    }
    return false;
  }
  */
  
  return true;
}    
/**
 * 시트 컬럼 돌면서 함수 실행
 * @member global
 * @method sheetEachCol
 * @param {Object} sheet IBSheet 객체
 * @param {Function} f 실행할 함수
 * @param {Boolean} reverse 정순,역순 구분
 * @param {Number} startCol 시작컬럼 인덱스
 */
function sheetEachCol(sheet, f, reverse, startCol)
{
  reverse = !!reverse;
  var returnObject = {};
  try
  {
    if ( reverse )
      for ( var c = nvl(startCol, sheet.LastCol()); c >= 0; c-- )
        f(c, sheet.GetCellProperty(0, c, "SaveName"), sheet, returnObject);
    else
      for ( var c = nvl(startCol, 0), lastC = sheet.LastCol(); c <= lastC; c++ )
        f(c, sheet.GetCellProperty(0, c, "SaveName"), sheet, returnObject);
  }
  catch(e)
  {
    if (e == $break) return returnObject.value;
    else throw e;
  }
} 
/**
 * 시트 로우를 돌면서 함수 실행
 * @member global
 * @method sheetEachCol
 * @param {Object} sheet IBSheet 객체
 * @param {Function} f 실행할 함수
 * @param {Boolean} reverse 정순,역순 구분
 * @param {Number} startRow 시작 row index
 * @param {Number} endRow 종료 row index
 */
function sheetEachRow(sheet, f, reverse, startRow, endRow) 
{
  //sheet.Redraw = false;
  reverse = !!reverse;
  var returnObject = {};
  try
  {

    var firstRow = sheet.HeaderRows();
    var lastRow = sheet.HeaderRows() + sheet.RowCount() - 1;

    if ( reverse )
    {
      var loopStartRow = isNull(startRow) ? lastRow : Math.min(startRow, lastRow);
      var loopEndRow = isNull(endRow) ? firstRow : Math.max(endRow, firstRow);
      for ( var row = loopStartRow; row >= loopEndRow; row-- )
      {           
        f(row, sheet, returnObject);
      }
    }
    else
    {
      var loopStartRow = isNull(startRow) ? firstRow : Math.max(startRow, firstRow);
      var loopEndRow = isNull(endRow) ? lastRow : Math.min(endRow, lastRow);

      for ( var row = loopStartRow; row <= loopEndRow; row++)
      {   
        f(row, sheet, returnObject);
      }
    }
  }
  catch(e)
  {
    if (e == $break) return returnObject.value;
    throw e;
  }
  //sheet.Redraw = true;
}
/**
 * 시트에서 함수 결과 true 인 로우
 * @member global
 * @method sheetFindRow
 * @param {Object} sheet IBSheet 객체
 * @param {Function} fFind 실행할 함수
 * @param {Boolean} reverse 정순,역순 구분
 * @param {Number} startRow 시작 row index
 * @return {Number} findRow
 */
function sheetFindRow(sheet, fFind, reverse, startRow)
{
  var findRow = -1;
  sheetEachRow(sheet, function(row, sheet)
  {
    if ( fFind(sheet, row) )
    {
      findRow = row;
      return false;
    }
  }, reverse, startRow);
  return findRow;
}    
/**
 * 시트 파라미터 구성
 * @member global
 * @method sheetGetSaveString
 * @param {Object} sheet IBSheet 객체
 * @param {Json} options
 * @return {String}
 */
function sheetGetSaveString(sheet, options)
{
  options = options || {};
  var saveString = sheet.GetSaveString(!!options.allSave, true).replace(/[+]/g, '%20');
  if ( options.prefix )
  {
    saveString = options.prefix+saveString.replace(/&/g, "&"+options.prefix);
  }
  return saveString;
}
/**
 * 컬럼정의 배열과 헤더의 로우 수를 받아 헤더객체를 리턴한다.
 * @member global
 * @method setHeaders
 * @param {Array} colObject 컬럼 정의 배열
 * @param {Number} headerCnt 헤더 로우 수
 * @param {String} Align 헤더 정렬방법
 * @return {Array}
 */
function setHeaders(colObject, headerCnt, Align) 
{
  var headers = new Array();
  var setHeader = new Array();
  var header_nms = new Array();

  Align = nvl(Align,"Center");
  headerCnt = (headerCnt)? headerCnt : 1;
  
  if(!headerCnt) headerCnt = 1;

  $.each(colObject, function(index, col) {

    header_nms = col.Header.split("|");

    for ( var i = 0; i < headerCnt; i++) {
      setHeader[i] += (header_nms.length == 1 ? header_nms[0]: header_nms[i]) + "|";
    }
  });

  for ( var i = 0; i < headerCnt; i++) {
    headers[i] = {};
    headers[i].Text = setHeader[i].replace("undefined","");
    headers[i].Align = Align;
  }

  return headers;

}
/**
 * ibsheet savename 을 delim 으로 연결하여 문자열로 반환
 * @member global
 * @method concatSaveName
 * @param {Object} sheet IBSheet 객체
 * @param {String} delim 연결할 구분자
 * @param {String} exceptSaveNames 제외컬럼(,로 분리된 문자열) 현재 사용X
 * @return {String}
 */
function concatSaveName(sheet, delim, exceptSaveNames)
{
  var except_save_name_array = exceptSaveNames ? exceptSaveNames.split(",") : [];
  if ( delim == null ) delim = "|";
  var tempSavename = "";
  var array = new Array();
  var rcnt = sheet.HeaderRows(); // 멀티라인을 고려하여 헤더 로우갯수 확인

  for(var c=0;c<=sheet.LastCol();c++){
    for(var r=0;r< rcnt; r++){ 
      tempSavename = sheet.ColSaveName(r,c);
      array.push(tempSavename);
    }
  }
  return array.join(delim);


  /*
  var except_save_name_array = exceptSaveNames ? exceptSaveNames.split(",") : [];
  if ( delim == null ) delim = "|";
  var tempSavename = "";
  var array = new Array();
  for(var c=0;c<=sheet.LastCol();c++){
    tempSavename = sheet.GetCellProperty(0,c,"SaveName");
    //array.push($.protify(except_save_name_array).include(tempSavename)?' ':tempSavename);
    //SAVE NAME을 ' '칸을 넣지 않고 NAME을 넣는다. ->LSG수정
    array.push(tempSavename);
  }
  return array.join(delim);
  */
  /*
  var except_save_name_array = exceptSaveNames ? exceptSaveNames.split(",") : [];
  if ( delim == null ) delim = "|";
  var save_name_array = ___save_name_array_map[sheet.id];
  var result_array = save_name_array.inject([], function(array, value)
  {
    array.push(except_save_name_array.include(value)?' ':value);
    return array;
  });
  return result_array.join(delim);
  */
}
    
/**
 * grid(sheet_getData 로 만들어진 데이터 객체(Json형식))에서 cell data 추출
 * @member global
 * @method concatSaveName
 * @param {Json} grid 그리드 데이터 객체
 * @param {Number} row row index
 * @param {Number} col col index
 * @return {String} grid data
 */
function grid_GetCellValue(grid, row, col)
{
  col = ( typeof col == "number" ) ? col : array_indexOf(grid.arrColName, col);
  return grid.arrData[row][col];
}
    
/**
 * grid 컬럼 명칭을 리턴
 * @member global
 * @method grid_GetColName
 * @param {Json} grid 그리드 데이터 객체
 * @param {Number} col col index
 * @return {String} column name
 */
function grid_GetColName(grid, col)
{
  return grid.arrColName[col];
}
    
/**
 * grid cell 에 값 세팅
 * @member global
 * @method grid_SetCellValue
 * @param {Json} grid 그리드 데이터 객체
 * @param {Number} row row index
 * @param {Number} col col index
 * @param {String} val 입력할 값
 */
function grid_SetCellValue(grid, row, col, val)
{
  col = ( typeof col == "number" ) ? col : array_indexOf(grid.arrColName, col);
  grid.arrData[row][col] = val;
}
    
/**
 * grid 로우를 돌면서 함수실행
 * @member global
 * @method grid_eachRow
 * @param {Json} grid 그리드 데이터 객체
 * @param {Function} f 실행할 함수
 * @param {Boolean} reverse 정순,역순 구분
 * @param {Number} startRow 시작 row index
 * @param {Number} endRow 종료 row index
 */
function grid_eachRow(grid, f, reverse, startRow, endRow)
{
  reverse = !!reverse;
  var returnObject = {};
  try
  {
    var firstRow = 0;
    var lastRow = grid.RowCount-1;
    if ( reverse )
    {
      var loopStartRow = isNull(startRow) ? lastRow : Math.min(startRow, lastRow);
      var loopEndRow = isNull(endRow) ? firstRow : Math.max(endRow, firstRow);
      for ( var row = loopStartRow; row >= loopEndRow; row-- )
      {
        f(row, grid, returnObject);
      }
    }
    else
    {
      var loopStartRow = isNull(startRow) ? firstRow : Math.max(startRow, firstRow);
      var loopEndRow = isNull(endRow) ? lastRow : Math.min(endRow, lastRow);
      for ( var row = loopStartRow; row <= loopEndRow; row++)
      {
        f(row, grid, returnObject);
      }
    }
  }
  catch(e)
  {
    if (e == $break) return returnObject.value;
    else throw e;
  }
}
    
/**
 * 시트용 트리 레벨 변경 이미지 그리기
 * @member global
 * @method printSheetTreeControl
 * @param {String} sheetId
 */
function printSheetTreeControl(sheetId)
{
  document.write("<ul class='segmentBar'>");
  document.write("<li title='트리 전체열기'><img src="+Page.SKIN_PATH+"/images/icon/icon_plus.gif onclick='"+sheetId+".ShowTreeLevel(-1);' alt='트리 전체열기'></li>");
  document.write("<li title='트리 전체닫기'><img src="+Page.SKIN_PATH+"/images/icon/icon_minus.gif onclick='"+sheetId+".ShowTreeLevel(0, 1);' alt='트리 전체닫기'></li>");
  document.write("<li title='트리 1단계 확장'><img src="+Page.SKIN_PATH+"/images/icon/icon_01.gif onclick='"+sheetId+".ShowTreeLevel(1, 1);' alt='트리 1단계 확장'></li>");
  document.write("<li title='트리 2단계 확장'><img src="+Page.SKIN_PATH+"/images/icon/icon_02.gif onclick='"+sheetId+".ShowTreeLevel(2, 1);' alt='트리 2단계 확장'></li>");
  document.write("<li title='트리 3단계 확장'><img src="+Page.SKIN_PATH+"/images/icon/icon_03.gif onclick='"+sheetId+".ShowTreeLevel(3, 1);' alt='트리 3단계 확장'></li>");
  document.write("</ul>");
}
    
/**
 * merge 때문에 시트에 saveName 구분하여 안보이는 로우 추가
 * @member global
 * @method sheetAddHiddenDivRow
 * @param {Object} sheet IBSheet 객체
 * @param {Number|String} saveName
 */
function sheetAddHiddenDivRow(sheet, saveName)
{
  var prevVal, currVal;
  sheetEachRow(sheet, function(r, x)
  {
    currVal = x.GetCellValue(r, saveName);
    // alert(r);
    if ( prevVal != null && prevVal != currVal )
    {
      x.SetRowHidden(x.DataInsert(r), 1);
    }
    prevVal = currVal;
  }, true);
}
    
/**
 * 시트 로우 추가
 * @member global
 * @method sheetDataInsert
 * @param {Object} sheet IBSheet 객체
 * @return {Number} row index
 */
function sheetDataInsert(sheet)
{
  return sheet.DataInsert(-1);
}
    
/**
 * 강제 저장용 시트 더미 로우 추가
 * @member global
 * @method sheetInsertHiddenDummyRow
 * @param {Object} sheet IBSheet 객체
 * @return {Number} row index
 */
function sheetInsertHiddenDummyRow(sheet)
{
  var NewRow = sheet.DataInsert(-1);
  var savename, keyfield;
  for ( var n = 0; n <= sheet.LastCol(); n++ )
  {
    savename = sheet.GetCellProperty(0, n, dpSaveName);
    keyfield = sheet.GetCellProperty(0, n, dpKeyField);
    if ( keyfield )
    {
      sheet.SetCellValue(NewRow, savename, "0");
    }
  }
  sheet.SetRowHidden(NewRow, 1);
  return NewRow;
}
    
/**
 * ibsheet 에서 체크된 로우의 데이터를 구성
 * @member global
 * @method sheet_getData
 * @param {Object} sheet IBSheet 객체
 * @param {String} chkSvnm 체크 savename
 * @return {Object} grid object
 */
// sheet 에서 체크된 row 데이타를 구성하여 배열로 만들어 return 한다. grid 를 구성한다.
function sheet_getData(sheet, chkSvnm)
{
  var grid = {};
  // set column name
  var arrColName = [];
  var mapColName = {};
  var sheetLastCol = sheet.LastCol();
  for ( var col = 0, LastCol = sheetLastCol; col <= LastCol; col++ )
  {
    arrColName.push(sheet.ColSaveName(col));
    mapColName[sheet.ColSaveName(col)] = col;
  }
  grid.arrColName = arrColName;
  grid.mapColName = mapColName;
  // set data
  var row_array = [];
  sheetEachRow(sheet, function(row)
  {
    if ( chkSvnm == null || (typeof(chkSvnm) == "function" && chkSvnm(sheet, row)) || sheet.GetCellValue(row, chkSvnm) == "Y" )
    {
      //alert([chkSvnm,  sheet.GetCellValue(row, chkSvnm), row]);
      var col_array = [];
      for ( var col = 0, LastCol = sheetLastCol; col <= LastCol; col++ )
      {
        col_array.push(sheet.GetCellValue(row, col));
      }
      row_array.push(col_array);
    }
  });
  grid.arrData = row_array;
  // set interface
  grid.RowCount = row_array.length;
  grid.ColCount = grid.arrColName.length;
  return grid;
}

/**
 * ibsheet 에서 체크된 로우의 데이터를 구성 ( MultiLine 용 )
 * @member global
 * @method sheet_getData2
 * @param sheet sheet IBSheet 객체
 * @param chkSvnm chkSvnm 체크 savename
 * @param oneRowCnt  하나의 데이터 셋을 표시하는 row의 수
 * @returns {Object} grid object
 */
function sheet_getData2(sheet, chkSvnm, oneRowCnt)
{
  var grid = {};
  //set column name
  var arrColName = [];
  var mapColName = {};
  var sheetLastCol = sheet.LastCol();
  for ( var r = 0; r < oneRowCnt; r++ )
  {
    arrColName.push(sheet.ColSaveName(col));
  }
  grid.arrColName = arrColName;
  // set data
  var row_array = [];
  var rowCount = sheet.RowCount() * oneRowCnt;
  var headerRow = sheet.HeaderRow();
  for(var row=HeaderRow;row <= rowCount; row = row + oneRowCnt)
  {
    if ( chkSvnm == null || (typeof(chkSvnm) == "function" && chkSvnm(sheet, row)) || sheet.GetCellValue(row, 1) == "1" )
    {
      var col_array = [];
      for(var r = row; r<= row+1; r++)
      {
        for(var col = 0; col <= sheet.LastCol(); col++ )
        {
          col_array.push(sheet.GetCellValue(r,col));
        }
      }
      row_array.push(col_array);
    }
  }
  grid.arrData = row_array;
  // set interface
  grid.RowCount = row_array.length;
  grid.ColCount = grid.arrColName.length;
  return grid;

}
      
/**
 * silver light 버전 IBOrg를 그린다 
 * @member global
 * @method writeIBOrg
 * @param {String} elem_id object id
 * @param {String} width 가로
 * @param {String} height 세로
 */
function writeIBOrg(elem_id, width, height)
{
  if ( width == 0 ) width = '100%';
  if ( height == 0 ) height = '100%';
  width = width || '100%';
  height = height || '100%';
  var host = location.protocol+"//"+location.host;
  var objectHtml = "";
  objectHtml += "<object width='"+width+"' height="+height+" id='"+elem_id+"' \n";
  objectHtml += " classid='clsid:0E0522FF-A72D-4541-B757-C1541500D6CD' \n";
  objectHtml += " codebase='"+ host +"/IBOrg/obj/IBOrg.2.1.0.0.CAB#version=2,1,0,0'> \n";
  var StartURL = host +"/IBOrg/html/starturl.jsp";
  objectHtml += "<param name=StartURL value='"+ StartURL +"'> \n";
  objectHtml += "<param name=ImagePlus value='"+ host +"/IBOrg/image/plus.gif'> \n";
  objectHtml += "<param name=ImageMinus value='"+ host +"/IBOrg/image/minus.gif'> \n";
  objectHtml += "<param name=ImageExpand value='"+ host +"/IBOrg/image/expand.gif'> \n";
  objectHtml += "<param name=ImagePopup value='"+ host +"/IBOrg/image/popmenu.gif'> \n";
  objectHtml += "</object> ";
  document.write(objectHtml);
}
    
/**
 * 시트의 엑셀을 다운로드
 * 컬럼갯수만큼 루프돌면서 hidden이 아닌 컬럼들만 구분자 '|'로 문자열 생성 후 DownCols 속성으로 넘겨줌
 * @member global
 * @method sheetSpeedDown2Excel
 * @param {Object} sheet IBSheet 객체
 * @param {Json} extParam 옵션
 */
function sheetSpeedDown2Excel(sheet, extParam)
{
  extParam = extParam || {};
  //제외컬럼의 savename들을 구분자 ','로 받음
  var except_save_name_array = extParam.exceptSaveNames ? extParam.exceptSaveNames.split(",") : [];
  //Default 삭제와 상태는 내려받지않음(받고싶으면 downSaveNames에 정의)
  except_save_name_array.push("CDELETE");
  except_save_name_array.push("CSTATUS");
  //설정에 상관없이 무조건 down받을 컬럼들을 구분자 ','로 받음
  var down_save_name_array = extParam.downSaveNames ? extParam.downSaveNames.split(",") : [];
  var tempSavename = "";
  var array = new Array();
  for(var idx = 0; idx <= sheet.LastCol(); idx++){
    tempSavename = sheet.GetCellProperty(0, idx, "SaveName");   
    if( $.protify(down_save_name_array).include(tempSavename))  //다운받을 컬럼이면 무조건 push
    {
      array.push(tempSavename);
    }
    else if( !$.protify(except_save_name_array).include(tempSavename))  //제외컬럼이 아니고
    {
      if(extParam.HiddenColumn == 0){ //Hidden컬럼을 보여주고 싶을때
        array.push(tempSavename);
      }else if(sheet.GetColHidden(idx) == 0){ //Hidden컬럼이 아닌것들
        array.push(tempSavename);
      }
    }
  }
  var downcols = array.join("|");
  var params = {Merge:1,  SheetDesign:1, DownCols:downcols, CheckBoxOnValue:"Y", CheckBoxOffValue:"N", AllTypeToText:1} ;
  $.extend(params, extParam);
  sheet.Down2Excel(params);
}
/**
 * 조회데이터를 엑셀로 바로 다운로드
 * @member global
 * @method sheetSpeedDown2Excel
 * @param {Object} sheet IBSheet 객체
 * @param {String} dsmethod 실행할 메소드 명
 * @param {String} fileName 저장할 excel파일 명
 * @param {String} dsclass 실행할 클라스 명
 * @param {String} checkFormYn 폼 필수입력 체크 여부
 * @param {Json} extParam 옵션
 */
function export2excel(sheet, dsmethod, fileName, dsclass, checkFormYn, extParam)
{
  if(checkFormYn == undefined || checkFormYn == null || checkFormYn == 'Y' ) 
  {
    if ( ! checkForm("f1") ) return;
  }
  //if (! confirm(ajaxMsg("EXCEL_DIRECT_DOWN"))) return;
  
  if(dsclass) $("#S_DSCLASS").val(dsclass);
  var excelName = fileName || "Excel";
  $("#S_DSMETHOD").val(dsmethod);
  
  extParam = extParam || {};
  //제외컬럼의 savename들을 구분자 ','로 받음
  var except_save_name_array = extParam.exceptSaveNames ? extParam.exceptSaveNames.split(",") : [];
  //Default 삭제와 상태는 내려받지않음(받고싶으면 downSaveNames에 정의)
  except_save_name_array.push("CDELETE");
  except_save_name_array.push("CSTATUS");
  //설정에 상관없이 무조건 down받을 컬럼들을 구분자 ','로 받음
  var down_save_name_array = extParam.downSaveNames ? extParam.downSaveNames.split(",") : [];
  var tempSavename = "";
  var array = new Array();
  for(var idx = 0; idx <= sheet.LastCol(); idx++)
  {
    tempSavename = sheet.GetCellProperty(0, idx, "SaveName");   
    if( $.protify(down_save_name_array).include(tempSavename))  //다운받을 컬럼이면 무조건 push
    {
      array.push(tempSavename);
    }
    else if( !$.protify(except_save_name_array).include(tempSavename))  //제외컬럼이 아니고
    {
      if(extParam.HiddenColumn == 0){ //Hidden컬럼을 보여주고 싶을때
        array.push(tempSavename);
      }else if(sheet.GetColHidden(idx) == 0){ //Hidden컬럼이 아닌것들
        array.push(tempSavename);
      }
    }
  }
  var downcols = array.join("|");

  var param = {
              URL:"/common/jsp/export.jsp" //비지니스 로직 페이지
            , ExtendParam:FormQueryString(document.f1)
            , ExtendParamMethod:"POST"
            , FileName:excelName+".xls"
            , DownCols:downcols
            , Merge:1 
            , SheetDesign:1
            , CheckBoxOnValue:"Y"
            , CheckBoxOffValue:"N"
            , AllTypeToText:0  //숫자타입을 제외한 나머지타입은 문자열로 다운로드함
        };
  sheet.DirectDown2Excel(param);
}
/**
 * Tree 일경우 상위 level 객체 row return
 * @member global
 * @method findParentRow
 * @param {Object} mySheet IBSheet 객체
 * @param {Number} row 찾기 시작할 row
 * @return {Number} 상위트리 row
 */
function findParentRow(mySheet,row)
{
  //찾은 행의 레벨을 얻음
  var lev = mySheet.GetRowLevel(row);
  //상위 row를 찾으면서 트리를 펼친다.
  for(var i=row;i>0;i--){
      if(mySheet.GetRowLevel(i)<lev){  
      return i;
    }
  }
}

/**
 * rd 리포트 그리기
 * @member global
 * @method writeRdviewr
 * @param {Json} option
 */
function writeRdviewr(option)
{
  var html = "";

  option = nvl(option, {});
  var _div = $("#" + nvl(option.tagid, "rdview"));

  if (isIE()) 
  {
    html += "<object id=chartdir ";
    html += "  classid='clsid:CDE2DAD1-7132-41A9-A998-844AD7BDAC58' ";
    html += "  codebase='/resource/file/chartdir50.cab#version=5,0,3,2' ";
    html += "  width=0% height=0% style=margin:0; >";
    html += "</object>";
    
    html += "<object id=rdpdf50 ";
    html += "  classid='clsid:0D0862D3-F678-48B5-876B-456457E668BC' ";
    html += "  codebase='/resource/file/rdpdf50.cab#version=2,2,0,99' ";
    html += "  width=0% height=0% style=margin:0; >";
    html += "</object>";
    
    html += "<OBJECT id='"+ nvl(option.id, "rdv1") +"' ";
    html += "  classid='clsid:04931AA4-5D13-442f-AEE8-0F1184002BDD'";
    html += "  codebase='/resource/file/cxviewer60u.cab#version=6,4,4,365'";
    html += "  name='rdv1' width='"+nvl(option.width, "100%")+"' height='"+nvl(option.height, "100%")+"' tabindex='3' >  ";
    html += "</OBJECT>";
    
    if(_div.length){
      _div.html(html);
    }else{
      $(document.body).append(html);  
    }      
  }
  else
  {
    navigator.plugins.refresh(false);
    if(navigator.mimeTypes["application/x-cxviewer60u"]) 
    {
      var _rdPlugin = navigator.mimeTypes["application/x-cxviewer60u"];
      var installedRdPluginVersion = _rdPlugin.description.substr(_rdPlugin.description.indexOf("version=")+8, 9);
      var rdPluginSetupVersion = "6,3,4,277";
      if(installedRdPluginVersion >= rdPluginSetupVersion) 
      {
        html = "<OBJECT id='"+ nvl(option.id, "rdv1") +"' type='application/x-cxviewer60u'  width='"+nvl(option.width, "100%")+"' height='"+nvl(option.height, "100%")+"' ></OBJECT>";
        if(_div.length){
          _div.html(html);
        }else{
          $(document.body).append(html);  
        } 
      } 
      else 
      {
        ModalUtil.open({url: "/common/jsp/rdplugin.jsp", name: "rdplugin"});
        }
      } 
    else 
    {
      ModalUtil.open({url: "/common/jsp/rdplugin.jsp", name: "rdplugin"});
    }
  }
  //라이선스 체크
  if ( $("#"+nvl(option.id, "rdv1"))[0].ZoomRatio != null )
  {
    $("#"+nvl(option.id, "rdv1"))[0].ApplyLicense(RD_WEBROOT + "/DataServer/rdagent.jsp");
  }
}

/**
 * 브라우저에 따라서 RD Viewer 또는 HTML5 Viewer로 RD를 보여줄지 체크하는 메소드 (false:RD Viewer true:HTML5 Viewer)
 * @member global
 * @method isHtml5
 * @param {String} htmlonly
 * @return {Boolean}
 */
function isHtml5(htmlonly)
{
  if(htmlonly == "Y")
  {
    return true;
  }
  else if(htmlonly == "N")
  {
    return false;
  }
  var browser = navigator.userAgent.toLowerCase();
    if(browser.indexOf("windows") > 0 ) //윈도우 운영체제   
    {     
        if(browser.indexOf("msie 6") > 0) // IE 6.x
        {
          return false;
        } 
        else if(browser.indexOf("msie 7") > 0) // IE 7.x
        {
            return false;
        } 
        else if(browser.indexOf("msie 8") > 0 || browser.indexOf("trident/4.0") > 0) // IE 8.x
        {
            return false;
        } 
        else if(browser.indexOf("msie 9") > 0 || browser.indexOf("trident/5.0") > 0) // IE 9.x
        {
            return false;
        } 
        else if(browser.indexOf("msie 10") > 0 || browser.indexOf("trident/6.0") > 0) // IE 10.x
        {
            return false;         
        } 
        else if(browser.indexOf("trident/7.0") > 0) // IE 11.x
        {
            return false;
        } 
        else if(browser.indexOf("firefox") > 0) // Firefox
        {
            return true; 
        } 
        else if(browser.indexOf("opera") > 0) // Opera
        {
            return true;   
        } 
        else if(browser.indexOf("netscape") > 0) // Netscape
        {
            return false;  
        } 
        else if(browser.indexOf("chrome") > 0) // Chrome
        {
            return true;  
        } 
        else if(browser.indexOf("safari") > 0) // Safari
        {
            return false;  
        }else{
            return false; 
        }
    }
    else if(browser.indexOf("iphone") > 0 || browser.indexOf("ipod") > 0 || browser.indexOf("ipad") > 0
            || browser.indexOf("android") > 0 || browser.indexOf("blackberry") > 0 || browser.indexOf("windows ce") > 0
            || browser.indexOf("nokia") > 0 || browser.indexOf("webos") > 0 || browser.indexOf("opera mini") > 0
            || browser.indexOf("sonyericsson") > 0 || browser.indexOf("opera mobi") > 0 || browser.indexOf("iemobile") > 0
            || browser.indexOf("windows phone") > 0 || browser.indexOf("trident/7.0") > 0 
            ) //MOBILE
    {
        return true; 
    }
    else 
    {
        return false;
    }
    return false;
}

/**
 * mrd 파일을 뷰어로 보여줌
 * @member global
 * @method openRdviewer
 * @param {Json} option
 */
function openRdviewer(option)
{
  var rdview = $("#" + nvl(option.rdview, "rdview"));
  var rdframe = nvl(option.rdframe, "rdFrame");
  var htmlonly = nvl(option.htmlonly, "");

  if(isHtml5(htmlonly))
  {
    rdview.append("<iframe id='"+rdframe+"' name='"+rdframe+"'  width='100%' height='100%' frameborder='0' src='/common/jsp/popup_wait.html'></iframe>");
    submit2({target: rdframe, action: "/common/jsp/rdiframe_stream.jsp"}, {S_MRD:option.mrd, S_RDATA:option.rdparam});
  }
  else
  {
    writeRdviewr();
    
    var rdv1 = $("#" + nvl(option.id, "rdv1"))[0];
    if ( rdv1.ZoomRatio == null )
    {
      ajaxMsg("MSG_REPORT_VIEW_NOT_SETUP");
    }

    rdv1.AutoAdjust = false;
    rdv1.setBackGroundColor(255, 255, 255);
    rdv1.ZoomRatio=100;
    rdv1.DisableToolbar(3);
    rdv1.DisableToolbar(14);
    rdv1.ApplyLicense(RD_WEBROOT + "/DataServer/rdagent.jsp"); 
    rdv1.SetParameterEncrypt(1);  //암호화시 주석 삭제
    rdv1.SetKindOfParam(2); //암호화시 주석 삭제
    rdv1.SetRData(option.rdparam);
    
    rdv1.FileOpen(option.mrd,  option.rdoption);  //암호화일때
  }
}
/**
 * 서버에 요청시 꼭 필요한 파라미터들을 만들어주는 펑션
 * @member global
 * @method makeParameters
 * @param {String} dsClass 실행할 class 명
 * @param {String} dsMethod 실행할 method 명
 * @param {Json} otherParams 그외 옵션
 * @return {Json}
 */
function makeParameters(dsClass, dsMethod, otherParams)
{
  otherParams = otherParams||{};
  //otherParams = $(otherParams.toString()).replace(null,"")||{};
  if ( typeof otherParams == 'string' )
  {
    otherParams = toQueryParams(otherParams);
  }
  var forceParams = {S_DSCLASS: dsClass, S_DSMETHOD: dsMethod, S_FORWARD: otherParams.S_FORWARD || "xsheetResultXML"};

  if ( ehrTopFrame._LOGIN_INFO ) forceParams.X_LOGIN_INFO = ehrTopFrame._LOGIN_INFO;
  
  //메뉴별 권한체크를위해 추가함 2014-02-24 w.y.c
  if(window.Page != null)
  {
    forceParams.S_PAGE_PROFILE_ID = Page.PROFILE_ID;
    forceParams.S_PAGE_MODULE_ID = Page.MODULE_ID;
    forceParams.S_PAGE_MENU_ID = Page.MENU_ID;
    forceParams.S_PAGE_PGM_URL = Page.PGM_URL;
    forceParams.S_PAGE_POP_URL = Page.POP_URL;
    forceParams.S_PAGE_PGM_ID = Page.PGM_ID;
    forceParams.S_PAGE_ENC_VAL = Page.ENC_VAL;
    forceParams.S_PAGE_ENC_VAL2 = Page.ENC_VAL2;
  }
  
  var parameters = $.extend(otherParams, forceParams);
  parameters = $.extend(parameters, {__viewState:toJsonString(parameters)});
  parameters = nullToUndefinedForJSON(parameters);
  
  return parameters;
}

/**
 * null 값을 undefined로 치환해서 리턴 해주는 펑션(parameter가 null인경우 java에서 받을때 "null" 로 인식이 됨 undefined일 경우는 null로 인식됨)
 * @member global
 * @method nullToUndefinedForJSON
 * @param {Json} json json파라미터
 * @return {Json}
 */
function nullToUndefinedForJSON(json){
  $.each(json,function(k,v){
  if(json[k]==null){
    json[k] = undefined;
  }
  });
  return json;
}

// message function
// key : 번들키, lang : 언어코드, arguments : 번들메세지 대체 문자열 111
// str 예 ===> 급여작업중 특정사번이 직급수당에서 오류가 발생했습니다. 라면 특정사번, 직급수당이 arguments이 된다.
/**
 * 메세지 다국어 처리 펑션
 * @member global
 * @method ajaxMsg
 * @param {String} key 다국어 메세지 id
 * @param {String} lang 다국어 구분 코드
 * @return {String} 다국어 메세지
 */
function ajaxMsg( key, lang )
{
  /*
  var dsClass = "hcg.hunel.core.resource.hunelJsMsgControl";
  var dsMethod = "getReturnMsg";
  var otherParams = {bname: "message", key: key, lang: lang, S_NO_LOGIN_CHECK: "Y"};
  var result = ""; 
  ajaxSyncRequestXS(dsClass, dsMethod, otherParams, function(xs){
    result = xs.GetEtcData("returnMsg");    
  });
  */
  var defaultStr = "";
  var result =   getMultiLang("message", key, defaultStr, lang);
  if(result==null || result==undefined) result = "";
  if ( arguments.length <= 2 ) 
  {
    return result.replace(/\\n/g,"\n");
  }
  for( var i=0; i<(arguments.length-2); i++ ) 
  {
      result = result.replace( new RegExp( "\\{" + i + "\\}", "gi" ), arguments[ i+2 ] );
  }
  return result.replace(/\\n/g,"\n");
}

/**
 * 라벨 다국어 처리 펑션
 * @member global
 * @method ajaxLabel
 * @param {String} key 다국어 라벨 id
 * @param {String} lang 다국어 구분 코드
 * @return {String} 라벨
 */
function ajaxLabel(key, lang)
{
  
  var defaultStr = "";
  var result =   getMultiLang("label", key, defaultStr, lang);
  if(result==null || result==undefined) result = "";
  
  /*
  var dsClass = "hcg.hunel.core.resource.hunelJsMsgControl";
  var dsMethod = "getReturnMsg";
  var otherParams = {bname: "label", key: key, lang: lang, S_NO_LOGIN_CHECK: "Y"};

  var result = "";
  ajaxSyncRequestXS(dsClass, dsMethod, otherParams, function(xs)
  {
    result = xs.GetEtcData("returnMsg");
  });
  */

  if ( arguments.length <= 2 ) {
    return result;
  }

    for( var i=0; i<(arguments.length-2); i++ ) {
        result = result.replace( new RegExp( "\\{" + i + "\\}", "gi" ), arguments[ i+2 ] );
    }

    return result;
}

/**
 * ajax요청이 성공적으로 끝났을 경우 실행되는 펑션
 * @member global
 * @method onSuccess
 * @param {Anythind} transport 데이터
 * @param {Function} onSuccessXS 다국어 구분 코드
 * @param {Json} options 옵션
 */
function onSuccess(transport, onSuccessXS, options)
{
  //setTimeout(function()
  //{
  options = options || {};
  if(options.Progress == true)
  {
    if(Progress.count > 0) Progress.stop();
  }
  //console.log(transport);
  if(options.dataType=="JSON")
  {
    onSuccessXS(transport);
  }
  else
  {
    var xsheet = makeXSheetWithXmlText($.trim(transport));
    if ( xsheet == null ) return;
    onSuccessXS(xsheet);
  }
  //},1);
}

/**
 * ajax요청에서 error 발생시 실행되는 펑션
 * @member global
 * @method onFailure
 * @param {jqXHR} xhr request
 * @param {String} textStatus 
 * @param {String} thrownError 에러메시지
 */
function onFailure( xhr, textStatus, thrownError){
  alert(ajaxMsg("MSG_ALERT_RESPONSE_ERROR") + textStatus);
}

function ajaxSyncRequestJson(dsClass, dsMethod, otherParams, onSuccessXS){
  send(dsClass, dsMethod, otherParams, onSuccessXS, null, {async: false,  Progress : false, dataType:"JSON"});
}

/**
 * 동기식 ajax호출
 * @member global
 * @method ajaxSyncRequestXS
 * @param {String} dsClass 실행할 class 명
 * @param {String} dsMethod 실행할 method 명 
 * @param {Json} otherParams 파라미터
 * @param {Function} onSuccessXS ajax요청 성공시 실행펑션
 */
function ajaxSyncRequestXS(dsClass, dsMethod, otherParams, onSuccessXS){
  send(dsClass, dsMethod, otherParams, onSuccessXS, null, {async: false,  Progress : false});
}

function ajaxRequestJsonProg(dsClass, dsMethod, otherParams, onSuccessXS, onComplete, options){
  Progress.start();
  options = $.extend( options , { Progress : true, dataType:"JSON" });
  send(dsClass, dsMethod, otherParams, onSuccessXS, function(transport, param){onComplete && onComplete(transport, param); }, options);
}

/**
 * 비동기식 프로그래스 바가 생기는 ajax호출
 * @member global
 * @method ajaxRequestXSProg
 * @param {String} dsClass 실행할 class 명
 * @param {String} dsMethod 실행할 method 명 
 * @param {Json} otherParams 파라미터
 * @param {Function} onSuccessXS ajax요청 성공시 실행펑션
 * @param {Function} onComplete ajax요청 완료시 실행펑션
 * @param {Json} options 옵션
 */
function ajaxRequestXSProg(dsClass, dsMethod, otherParams, onSuccessXS, onComplete, options){
  Progress.start();
  options = $.extend( options , { Progress : true });
  send(dsClass, dsMethod, otherParams, onSuccessXS, function(transport, param){onComplete && onComplete(transport, param); }, options);
}

/**
 * 비동기식 ajax호출
 * @member global
 * @method ajaxRequestXS
 * @param {String} dsClass 실행할 class 명
 * @param {String} dsMethod 실행할 method 명 
 * @param {Json} otherParams 파라미터
 * @param {Function} onSuccessXS ajax요청 성공시 실행펑션
 * @param {Function} onComplete ajax요청 완료시 실행펑션
 * @param {Json} options 옵션
 */
function ajaxRequestXS(dsClass, dsMethod, otherParams, onSuccessXS, onComplete, options){
  options = $.extend( options , { Progress : false });
  send(dsClass, dsMethod, otherParams, onSuccessXS, onComplete, options);
}

/**
 * ajax호출
 * @member global
 * @method send
 * @param {String} dsClass 실행할 class 명
 * @param {String} dsMethod 실행할 method 명 
 * @param {Json} otherParams 파라미터
 * @param {Function} onSuccessXS ajax요청 성공시 실행펑션
 * @param {Function} onComplete ajax요청 완료시 실행펑션
 * @param {Json} options 옵션
 */
function send(dsClass, dsMethod, otherParams, onSuccessXS, onComplete, options)
{
  $.extend(otherParams, {S_PGM_OPEN_TIME:S_PGM_OPEN_TIME, S_ENC_OTP_KEY: S_ENC_OTP_KEY, S_CSRF_SALT: S_CSRF_SALT});
  if(options.dataType=="JSON")
  {
    $.extend(otherParams, {S_FORWARD:"xsheetResultJson"});
  }
  options = options || {};
  $.ajax({
      url : options.url || __baseAction
    , async : options.async==null?true:options.async
    , type : options.type || "POST"
    , beforeSend : function(xhr){ xhr.setRequestHeader( 'ajax' , 'true' ); }
    , data : options.parameters || makeParameters(dsClass, dsMethod, otherParams)
    , dataType : options.dataType || "text"      
    , success : options.onSuccess || function (transport) { onSuccess(transport, onSuccessXS, options);  }
    , complete : options.onComplete || onComplete 
    , error : function(xhr, textStatus, thrownError){
      options.error || onFailure(xhr, textStatus, thrownError);
    }
  })
  .always(function(){
    if(options.Progress == true)
    {
      Progress.stop();
    }
   });  
}

/**
 * emp_id로 직원정보를 검색 후 사용자 입력 펑션을 실행하는 펑션
 * @member global
 * @method ajaxGetEmpId
 * @param {String} emp_id 
 * @param {Function} fn 실행할 펑션
 */
function ajaxGetEmpId(emp_id, fn)
{
     
 ajaxRequestXSProg(commonOtpVal.Sy_com_181_c01, commonOtpVal.getEmp01, {S_EMP_ID: emp_id}, function(xs)
 {
   if ( xs.RowCount() == 0 )
   {
     alert(ajaxMsg("MSG_ALERT_SEARCH_SAWON_NOTHING") + "("+emp_nm+")");
         fn({});
   }
   else
   {
     var emp = {};
     var ColCount = xs.ColCount();
     for ( var col = 0; col < ColCount; col++ )
     {
       emp[xs.ColName(col)] = xs.GetCellValue(0, col);
     }
     fn(emp);
   }
 });
}
/**
 * emp_nm로 직원정보를 검색 후 사용자 입력 펑션을 실행하는 펑션
 * @member global
 * @method ajaxGetEmpNm
 * @param {String} emp_nm 
 * @param {Function} fn 실행할 펑션
 */
function ajaxGetEmpNm(emp_nm, fn)
{
  
  ajaxRequestXSProg(commonOtpVal.Sy_com_181_c01, commonOtpVal.searchEmp01, {S_EMP_NM: emp_nm}, function(xs)
  {
    var RowCount = xs.RowCount();
    if ( RowCount == 0 )
    {
      //alert("검색된 사원이 없습니다.("+emp_nm+")");
      alert(ajaxMsg("MSG_ALERT_SEARCH_SAWON_NOTHING") + "("+emp_nm+")");
      fn({});
    }
    else if ( RowCount > 1 )
    {
      ModalUtil.open({url:__base_dir+"sys/sy_com/sy_com_150_p01.jsp", title:ajaxLabel("search_emp"), param: {S_SELMODE: "S", S_EMP_NM: emp_nm, X_EMP_SCH_AUTH_CD: Page.EMP_SCH_AUTH_CD , S_SEARCH_TYPE: Page.S_SEARCH_TYPE, X_HELP_PGM_ID: "sy_com_150_p01" }}, function(rv){
        if(rv != null)
      {
          var grid = rv;
              var RowCount = grid.RowCount;
              var ColCount = grid.ColCount;
              var emp = {};
              for ( var r = 0; r < RowCount; r++ )
              {
                for ( var col = 0; col < ColCount; col++ )
                {
                  emp[grid_GetColName(grid, col)] = grid_GetCellValue(grid, r, col);
                }
                fn(emp);
                break;// get only one
              }
      }
        else
      {
          fn({});
      }
      });
    }
    else if ( RowCount == 1 )
    {
      // 검색된 사원이 한명이면
      var EMP_ID = xs.GetCellValue(0, "EMP_ID");
          ajaxGetEmp(EMP_ID, fn);
    }
  });
}

  
/**
 * 값이 from to 사이에 포함되는지 여부를 리턴
 * @member global
 * @method between
 * @param {String|Number} o 체크할 값
 * @param {String|Number} from 
 * @param {String|Number} to
 * @return {Boolean}
 */
function between(o, from, to)
{
  return o >= from && o <= to;
}
/**
 * 오라클 decode 함수 구현
 * @member global
 * @method decode
 * @return {Object}
 */
function decode()
{
  var x = arguments[0];
  for ( var n = 1, argsLen = arguments.length; n < argsLen; n+=2 )
  {
    if ( x == arguments[n] )
    {
      return arguments[n+1];
    }
    else
    {
      if ( argsLen <= n+2 ) return null;
      else if ( argsLen == n+3 ) return arguments[n+2];
    }
  }
} 
  
/**
 * 문자열 바이트 수
 * @member global
 * @method getByteLength
 * @param {String} str 문자열
 * @return {Number} 바이트 수
 */
function getByteLength(str)
{
  var rv = 0;
  for ( var n = 0, sz = str.length; n < sz; n++ )
  {
    //rv += str.charCodeAt(n) > 0x00ff ? 2 : 1;
    rv += str.charCodeAt(n) > 0x00ff ? 3 : 1;// utf-8 3바이트
  }
  return rv;
}
/**
 * 쿠키 생성
 * @member global
 * @method setCookie
 * @param {String} name 쿠키명
 * @param {String} value 쿠키값
 * @param {Number} addDays 쿠키 만료일 추가일수
 * @param {Number} addHours 쿠키 만료시간 추가시간
 * @param {Number} addMinutes 쿠키 만료분 추가분
 * @param {Number} addSeconds 쿠키 만료초 추가초
 */
function setCookie( name, value, addDays, addHours, addMinutes, addSeconds)  
{
  var todayDate = new Date();
  todayDate.setDate   ( todayDate.getDate()     + (addDays || 0));
  todayDate.setHours  ( todayDate.getHours()    + (addHours || 0));
  todayDate.setMinutes( todayDate.getMinutes()  + (addMinutes || 0));
  todayDate.setSeconds( todayDate.getSeconds()  + (addSeconds || 0));
  document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";";
}
/**
 * 쿠키값 가져오기
 * @member global
 * @method getCookie
 * @param {String} name 가져올 쿠키명
 * @return {String} 쿠키값
 */
function getCookie( name )
{
  var nameOfCookie = name + "=";
  var x = 0;
  while ( x <= document.cookie.length )
  {
    var y = (x+nameOfCookie.length);
    if ( document.cookie.substring( x, y ) == nameOfCookie )
    {
      if ( (endOfCookie=document.cookie.indexOf( ";", y )) == -1 )
        endOfCookie = document.cookie.length;
      return unescape( document.cookie.substring( y, endOfCookie ) );
    }
    x = document.cookie.indexOf( " ", x ) + 1;
    if ( x == 0 )
      break;
  }
  return "";
} 
/**
 * 객체의 속성을 리턴
 * @member global
 * @method getObjPropStr
 * @param {Object} obj 객체
 * @return {String} 객체 속성
 */
function getObjPropStr(obj)  
{
  var array = [];
  for ( var p in obj ) array.push(p+": "+obj[p]);
  return array.join("\n");
}  
/**
 * arguments 중에서 가장 큰 값을 return
 * @member global
 * @method greatest
 * @param {Array|Object} arguments
 * @return {Object} max값
 */
function greatest()
{
  var max = null;
  $.map(arguments, function(v, i){
    if(i == 0) max = v;
    else if(max < v) max = v;
  });
  return max;  
}
/**
 * isin(x, a, b, c, d) a, b, c, d 중에 x 가 있는지 여부
 * @member global
 * @method isin
 * @param {String} o 
 * @param {String} arguments
 * @return {Boolean} 여부
 */
function isin(o)
{
  for ( var n = 1; n < arguments.length; n++ )
  {
    if ( o == arguments[n] )
    {
      return true;
    }
  }
  return false;
}  
/**
 * null 체크
 * @member global
 * @method isNull
 * @param {Object} x
 * @return {Object|String}
 */
function isNull(x)
{
  return x == null || x == "";
}  
/**
 * 배열안에 값이 있는지 여부
 * @member global
 * @method isinarr
 * @param {String} o value
 * @param {Array} arr 배열
 * @return {Boolean} 여부
 */
function isinarr(o, arr)
{
  for ( var n = 0; n < arr.length; n++ )
  {
    if ( o == arr[n] )
    {
      return true;
    }
  }
  return false;
}  
/**
 * 스트링 배열(arr)의 각 요소(arr[n])를 시작첨자(s), 마지막첨자(e)를 붙인후 구분자(delim)로 연결하여 리턴.
 * @member global
 * @method joinStr
 * @param {Array} arr
 * @param {String} delim
 * @param {String} s
 * @param {String} e
 * @return {String}
 */
function joinStr(arr, delim, s, e)
{
  delim = nvl(delim, ",");
  s = nvl(s);
  e = nvl(e);
  return $.protify(arr).inject([], function(array, item){
    array.push(s+item+e);
    return array;}).join(delim);
} 
/**
 * 문자열(str)의 길이가 (size)가 되도록 왼쪽부터 (padc)문자식으로 채운 표현식을 반환
 * @member global
 * @method lpad
 * @param {String} str 문자열
 * @param {Number} size 자리수
 * @param {String} padc 문자식
 * @return {String}
 */   
function lpad(str, size, padc) 
{
  return padLR(str, size, padc, "L");
}

/**
 * arguments 들중 가장 작은값을 반환
 * @member global
 * @method least
 * @param {String|Number} arguments
 * @return {String|Number}
 */
function least()
{
  var min = null;
  $.map(arguments, function(v, i){
    if(i == 0) min = v;
    else if(min > v) min = v;
  });
  return min;
}    
/**
 * 숫자 lpad
 * @member global
 * @method npad
 * @param {String|Number} str
 * @param {Number} size
 * @return {String}
 */  
function npad(str, size) {
  return lpad(String(str), size, "0");
} 
/**
 * (s)가 null 일 경우 ''(empty)로 변경 null이 아니면 받은 파라미터(s)를 반환
 * @member global
 * @method null2empty
 * @param {Object} s 
 * @return {String|Object}
 */
function null2empty(s) {
  return s == null ? "" : s;
}
/**
 * (s)가 null | "" | undefined 이면 (d)로 대체
 * @member global
 * @method nvl
 * @param {Object} s
 * @param {Object} d
 * @return {Object}
 */
function nvl(s, d)  {
  return (s == null || s == "" || s == undefined ) ? (d == null ? "" : d) : s;
}    
/**
 * (str)문자열을 (size)길이만큼 (padc)문자열로 (LR)좌우 패딩
 * @member global
 * @method padLR
 * @param {String} str 문자열
 * @param {Number} size 길이
 * @param {String} padc 패딩문자열
 * @param {String} LR 좌우 구분
 * @return {String}
 */    
function padLR(str, size, padc, LR) 
{
  if ( ! padc ) padc = " ";
  if ( size < str.length ) return str;
  var padcs = "";
  for ( var psize = size - str.length; psize > 0; psize-- )
    padcs += padc;
  return LR == "L" ? padcs + str : str + padcs;
}
/**
 * 문자열의 quoto(') 에 역슬래시(\) 를 붙여서 반환
 * @member global
 * @method quoto
 * @param {String} str 문자열
 * @return {String}
 */
function quoto(str) {
  return str ? str.replace(/'/g, '\\\'').replace(/"/g, '\\\"') : str;
}  
/**
 * (str)문자열을 (cnt) 횟수 만큼 반복하여 붙여서 반환
 * @member global
 * @method repeatStr
 * @param {String} str
 * @param {Number} cnt
 * @return {String}
 */
function repeatStr(str, cnt) 
{
  var rslt = "";
  for ( var n = 0; n < cnt; n++ )
  {
    rslt += str;
  }
  return rslt;
}
    
/**
 * (str)문자열의 변수 부분을 (map)에 담긴 값으로 치환하여 반환
 * @member global
 * @method replaceMap
 * @param {String} str 문자열
 * @param {Json} map 치환할 값들
 * @param {String} reg 변수부분을 검색할 정규표현식
 * @return {String} 치환된 문자열
 */
function replaceMap(str, map, reg) 
{
  var result = str, exec;
  reg = nvl(reg, /\$\{([^}]+)\}/);
  while (exec = reg.exec(result))
  {
    result = result.replace("${"+exec[1]+"}", nvl(map[exec[1]]));
  }
  return result;
}  
/**
 * 문자열(str)의 길이가 (size)가 되도록 왼쪽부터 (padc)문자식으로 채운 표현식을 반환
 * @member global
 * @method rpad
 * @param {String} str 문자열
 * @param {Number} size 자리수
 * @param {String} padc 문자식
 * @return {String}
 */
function rpad(str, size, padc) 
{
  return padLR(str, size, padc, "R");
} 
/**
 * 이미지를 원래크기대로 보여주는 DIV를 생성
 * @member global
 * @method showOriginalImage
 * @param {String} imgSrc 이미지 경로
 * @param {Json} options 옵션
 * @param {Event} e 이벤트
 * @return
 */
function showOriginalImage(imgSrc, options, e)
{
  e = e || window.event;

  var e2 = e;

  if ( showOriginalImage.currImageDiv ) document.body.removeChild(showOriginalImage.currImageDiv);
  if ( imgSrc )
  {
    options = options || {};
    if ( options.applyDrag == null ) options.applyDrag = true;
    var div_elem = $E('div', {
      title: 'double click to close',
      style: {position:'absolute', zIndex: 999,  display:'none'}
    });
    var img_elem = $E('img', {
      style: {border:'2px solid #cccccc'}
    });
    $(img_elem).bind("load", function(event)
    {
      var positionType = options.positionType || "eventPosition";

      if ( positionType == "eventPosition" )
      {
        $(div_elem).css("top", Math.max(e2.clientY - img_elem.height/2, 0))
          .css("left", Math.max(e2.clientX - img_elem.width/2, 0)).show();
      }
      else if ( positionType == "center" )
      {
        $(div_elem).show().css("top", Math.max((document.body.clientHeight - img_elem.height)/2, 0))
          .css("left", Math.max((document.body.clientWidth - img_elem.width)/2, 0)).show();
      }

      if ( options.backgroundColor )
      {
        div_elem.style.backgroundColor = options.backgroundColor;
      }
      var applyApperEffect = !! options["applyApperEffect"];
      if ( applyApperEffect )
      {
        try{ $(div_elem).fadeIn(700); }catch(e){}
      }
      if ( options.applyDrag ) $(div_elem).draggable();
    });
    $(div_elem).bind("dblclick", function(x)
    {
      $(div_elem).remove();
      showOriginalImage.currImageDiv = null;
    });
    $(img_elem).bind("error", function(x)
    {
      $(div_elem).remove();
      showOriginalImage.currImageDiv = null;
    });
    $(div_elem).append(img_elem);
    if ( options.withClose )
    {
      $(div_elem).append(
        $E("div", {
          innerHTML:"<span class='btn'><input type=button value=<com:label key='btn_close' def='닫기' /> class='close' ></span>",
          style: {textAlign: "right"}
        }));
    }
    $('body').append(div_elem);
    showOriginalImage.currImageDiv = div_elem;
    $(img_elem).attr("src", imgSrc);
    try { div_elem.focus(); } catch(e) {}
  }
}

/**
 * (str)문자열이 (p)문자열로 시작하는지 여부를 반환
 * @member global
 * @method startsWith
 * @param {String} str
 * @param {String} p
 * @return {Boolean}
 */
function startsWith(str, p)  
{
  return p == str.toString().substr(0, p.length);
} 

/**
 * (str)문자열이 (pattern)문자열로 끝나는지 여부를 반환
 * @member global
 * @method endsWith
 * @param {String} str
 * @param {String} pattern
 * @return {Boolean}
 */
function endsWith(str, pattern) 
{
  var d = str.length - pattern.length;
  return d >= 0 && str.lastIndexOf(pattern) === d;
}

/**
 * 문자열(str)을 바이트 단위로 시작인덱스(bsidx) 부터 사이즈(bsize) 만큼 substr하여 반환
 * @member global
 * @method substrb
 * @param {String} str 문자열
 * @param {Number} bsidx 시작인덱스
 * @param {Number} bsize 보여줄 바이트 수
 * @return {String}
 */
function substrb(str, bsidx, bsize) 
{
  if ( bsidx < 0 )
  {
    bsidx = 0;
  }
  var bsidxc = 0;// 비교대상
  var idx = 0;// char index

  while ( true )
  {
    if ( bsidxc  > bsidx )
    {
      excess = true;  break;
    }
    else if ( bsidxc == bsidx )
    {
      excess = false;
      break;
    }
    if ( idx >= str.length )
    {
      return "";
    }
    bsidxc += str.charCodeAt(idx++) > 0x00ff ? 3:1;
  }

  var bsizec = excess ? 1 : 0 ;
  var sidx = idx;
  var remain = false;//
  var size=0;
  while ( true )
  {
    if ( bsizec  > bsize )
    {
      remain = true;  break;
    }
    else if ( bsizec == bsize ) 
    {
      break;
    }
    if ( idx >= str.length )
    {
      return excess ? " "+ str.substr(sidx) : str.substr(sidx);
    }
    bsizec += str.charCodeAt(idx++) > 0x00ff ? 3:1;
    size++;
  }
  return  (  excess &&   remain) ? " "+ str.substr(sidx, size-1) +" " :
          (  excess && ! remain) ? " "+ str.substr(sidx, size  )      :
          (! excess &&   remain) ?      str.substr(sidx, size-1) +" " :
                                        str.substr(sidx, size  );
}
  
/**
 * 시작값(inputFrom)이 종료값(inputTo)보다 작은지 여부를 반환
 * @member global
 * @method checkFromTo
 * @param {String|Element} inputFrom 시작값을 갖고있는 element Id or element
 * @param {String|Element} inputTo 종료값을 갖고있는 element Id or element
 * @return {Boolean}
 */
function checkFromTo(inputFrom, inputTo)
{
  inputFrom = returnjQueryObj(inputFrom);
  inputTo = returnjQueryObj(inputTo);
  if ( inputFrom.val2() && inputTo.val2() )
  {
    if ( inputFrom.val2() > inputTo.val2() )
    {
      alert(ajaxMsg("MSG_ALERT_COND_OVER12")+"("+inputFrom.attr("korname")+" < "+inputTo.attr("korname")+")");
      input_selectfocus(inputTo);
      return false;
    }
  }
  return true;
}
  
/**
 * element에 select 포커스를 준다
 * @member global
 * @method input_selectfocus
 * @param {String|Element} input element Id or element
 */
function input_selectfocus(input)
{
  input = returnjQueryObj(input);    
  try { if(input.attr("type") != "file") input.focus(); } catch(e) {alert(e);}
}

/**
 * 사번/성명 조회조건의 기능들을 정의한다
 * @member global
 * @method applyElementSearchEmp
 */
function applyElementSearchEmp()
{
  $(".search_emp").each(function()
  {
    if($(this).attr("__searchempapplied")==true)
    {
      return;
    }
    $(this).attr("__searchempapplied",true);
    $(this).attr("progressCount",0);
      
    if ( $(this).ondata!=undefined )
    {
      $(this).ondata = new Function($(this).ondata);
    }
      
    $(this).attr("maxLength","15");
    $(this).css({imeMode: 'active'});
        
    $.fn.extend({
      doAction_emp : function(sAction, p1){            
        var element = $(this);
        if(element[0].type=="button")
        {
          element = element.prev();
        }
        var S_C_CD;
        try
        { 
          S_C_CD = element.attr("C_CD"); 
          if(!S_C_CD)
          {
            S_C_CD = $("#"+element.attr("CCD_INPUT_NAME")).val();
          }
          if(!S_C_CD)
          {
            S_C_CD = Page.C_CD;
          }
        }
        catch(e)
        {
          try
          {
            S_C_CD = $("#"+element.attr("CCD_INPUT_NAME")).val();
          }
          catch(e)
          {
            try
            {
              S_C_CD = Page.C_CD;
            }
            catch(e)
            {}
          }
        }
        var S_SEARCH_TYPE;
        try
        {
          S_SEARCH_TYPE= $(element).attr("S_SEARCH_TYPE");
        }
        catch(e)
        {};
            
        // 권한체크여부 추가
        // 2013-02-18 서영준 ( HCG )
        var S_SEARCH_AUTH_YN;
        try
        {
          S_SEARCH_AUTH_YN= $(element).attr("S_SEARCH_AUTH_YN");
        }
        catch(e)
        {};
            
        switch ( sAction )
        {
          case commonOtpVal.search_emp01:
          {
            // 성명으로 검색
            element.doAction_emp("ajaxLoading", true);
            ajaxRequestXS(commonOtpVal.Sy_com_181_c01, commonOtpVal.searchEmp02, {S_C_CD: S_C_CD, S_EMP_NM: element.val(), S_SEARCH_TYPE: S_SEARCH_TYPE}, function(xs)
            {
              var RowCount = xs.RowCount();
              if ( RowCount == 0 )
              {
                //alert("검색된 사원이 없습니다.");
                alert(ajaxMsg("MSG_ALERT_SEARCH_SAWON_NOTHING"));
                element.select();
                element.focus();
                element.doAction_emp("resetemp01");
              }
              else if ( RowCount > 1 )
              {
                var pre = element.attr("PREFIX");
                var dv = document.createElement("DIV");
                document.body.appendChild(dv);
                dv.id = pre + "_EMP_SCH_LAYER";
                $(dv).css("width","271px");
                $(dv).css("height","275px");
                $(dv).css("border-top","2px solid #d7262e");
                $(dv).css("border-left","2px solid #848484");
                $(dv).css("border-right","2px solid #848484");
                $(dv).css("border-bottom","2px solid #848484");
                $(dv).css("overflow","hidden");
                $(dv).css("position","absolute");
                $(dv).css("zIndex","20000");
                $(dv).css("background-color","white");
                $(dv).css("margin-top",  $(element).offset().top + 20);
                $(dv).css("margin-left",  $(element).offset().left );
                          
                var timeout;
                $(dv).mouseleave(function () {timeout = setTimeout(function () {if(dv.parentNode!=null)dv.parentNode.removeChild(dv);element.select();}, 500);}).mouseenter(function () {clearTimeout(timeout);});

                // Employees Found List
                var dv01 = document.createElement("SPAN");
                dv01.id = pre + "_EMP_FOUND_LIST";
                $(dv01).css("width","115px");
                $(dv01).css("height","97%");
                $(dv01).css("marginRight","5px");
                $(dv01).css("display","inline-block");
                $(dv01).css("background-color","#fff");
                $(dv01).css("overflow","auto");
                $(dv01).css("zIndex","20000");
                dv.appendChild(dv01);
                          
                var ol01 = document.createElement("OL");
                ol01.style.listStyle = "circle";
                var shtml = "";
                var attrs = "";
                for (var i = 0; i < RowCount; i++)
                {
                  attrs = " PRE='" + pre + "' C_CD='" + xs.GetCellValue(i, "C_CD") + "' EMP_ID='" + xs.GetCellValue(i, "EMP_ID") + "' EMP_NM='" + xs.GetCellValue(i, "EMP_NM")  + "'";
                  attrs += " ORG_NM='" + xs.GetCellValue(i, "ORG_NM") + "' EMP_GRADE_NM='" + xs.GetCellValue(i, "EMP_GRADE_NM") + "' DUTY_NM='" + xs.GetCellValue(i, "DUTY_NM") + "' POST_NM='" + xs.GetCellValue(i, "POST_NM") + "'";
                  attrs += " ENTER_YMD='" + xs.GetCellValue(i, "ENTER_YMD") + "' RETIRE_YMD='" + xs.GetCellValue(i, "RETIRE_YMD") + "'";
                  shtml += "<LI style='padding:2px 10px 2px 20px; background:url("+Page.SKIN_PATH+"/images/icon/blt_layer.gif) no-repeat 10px 6px;white-space:nowrap;' onmouseover='EmpSimpleListMO($(this))' onclick='EmpSimpleListClick($(this))'" + attrs + "><a href='javascript:;'>" + xs.GetCellValue(i, "EMP_NM") + "(" + xs.GetCellValue(i, "EMP_ID") + ")</a></LI>";
                }
                ol01.innerHTML = shtml;
                dv01.appendChild(ol01);
                // Employee Simple Information
                var dv02 = document.createElement("SPAN");
                          
                dv02.id = pre + "_EMP_SIMPLE_INFO";
                $(dv02).css("display","inline-block");
                $(dv02).css("overflow","hidden");
                $(dv02).css("width","150px");
                $(dv02).css("height","100%");
                $(dv02).css("background-color","#fff");
                $(dv02).css("border-left","1px solid #e2e2e2");
                $(dv02).css("zIndex","1");
                dv.appendChild(dv02);
                
                //si = Simple Information
                shtml = "";
                shtml += "<div class='dvInfoWrap'>";
                shtml += "<p style='background:#f5f5f5;border-bottom:1px solid #dedede; color:#000;font-weight:bold; height:21px;padding-top:9px;margin-bottom:10px;'><span id='" + pre + "_si_emp_nm'></span></p>";
                shtml += "<img style='border:1px solid #e7e7e7;' id='" + pre + "_si_emp_img' src='"+Page.SKIN_PATH+"/images/main/noPhoto.gif' width='99px' height='118' align='center' onerror='this.src = \""+Page.SKIN_PATH+"/images/main/noPhoto.gif\";' /></div>" ;
                shtml += "<div class='dvSimpleInfo'><dl style='margin-top:10px;'>";
                shtml += "<dt>조직 :</dt> <dd id='" + pre + "_si_org_nm'></dd>";
                shtml += "<dt>직급 :</dt> <dd id='" + pre + "_si_emp_grade_nm'></dd>";
                shtml += "<dt>직책 :</dt> <dd id='" + pre + "_si_duty_nm'></dd>";
                shtml += "<dt>직위 :</dt> <dd id='" + pre + "_si_post_nm'></dd>";
                shtml += "</dl></div>";
                
                $(dv02).html(shtml);

              }
              else if ( RowCount == 1 )
              {
                // 검색된 사원이 한명이면
                var C_CD = xs.GetCellValue(0, "C_CD");
                var EMP_ID = xs.GetCellValue(0, "EMP_ID");
                
                element.doAction_emp(commonOtpVal.get_emp_info, C_CD, EMP_ID);
                element.css("imeMode","active");
              }
            }, function() { $(element).doAction_emp("ajaxLoading", false); });
          }
          break;
          case commonOtpVal.get_emp_info:
          {
            element.doAction_emp("ajaxLoading", true);
            ajaxRequestXS(commonOtpVal.Sy_com_181_c01, commonOtpVal.getEmp01, {S_C_CD: arguments[1], S_EMP_ID: arguments[2]}, function(xs)
            {
              if ( xs.RowCount() == 0 )
              {
                //alert("검색된 사원이 없습니다.");
                alert(ajaxMsg("MSG_ALERT_SEARCH_SAWON_NOTHING"));
              }
              else
              {
                var ColCount = xs.ColCount();
                if(element[0].data==undefined) element[0].data = {};
                for ( var col = 0; col < ColCount; col++ )
                {
                  eval(" element[0].data."+xs.ColName(col)+"=\""+xs.GetCellValue(0, col)+"\"");
                }
                element.val(element.getEmp("EMP_NM"));
                strETC_INFO = element.attr("ETC_INFO") || "";
                strETC_INFO = strETC_INFO.replace(/조직/, $(element).getEmp("ORG_NM"));
                strETC_INFO = strETC_INFO.replace(/직급/, $(element).getEmp("EMP_GRADE_NM"));
                strETC_INFO = strETC_INFO.replace(/직책/, $(element).getEmp("DUTY_NM"));
                strETC_INFO = strETC_INFO.replace(/직위/, $(element).getEmp("POST_NM"));
                strETC_INFO = strETC_INFO.replace(/호칭/, $(element).getEmp("EMP_TITLE_NM"));
                $("#"+$(element).attr("PREFIX")+"_etcinfo").val(strETC_INFO);
              }                        
              if(element.attr("ondata")!=undefined) eval(element.attr("ondata"));
            }, function() { element.doAction_emp("ajaxLoading", false); });
          }
          break;
          case commonOtpVal.setLoginEmp01:
          {
            element.doAction_emp(commonOtpVal.get_emp_info, "");
          }
          break;
          case commonOtpVal.popemp01:
          {
            ModalUtil.open({url:__base_dir+"sys/sy_com/sy_com_150_p01.jsp",title:ajaxLabel("search_emp"),
              param: {
                     S_C_CD: S_C_CD,
                     X_EMP_SCH_AUTH_CD: element.attr("EMP_SCH_AUTH_CD"),
                     X_PROFILE_ID: element.attr("PROFILE_ID"),
                     S_SELMODE: "S",
                     S_EMP_NM: element.val(),
                     S_SEARCH_TYPE: element.attr("S_SEARCH_TYPE"),  
                     S_HIDE_EMP_GRADE: element.attr("HIDE_EMP_GRADE"),
                     S_SEARCH_AUTH_YN:element.attr("S_SEARCH_AUTH_YN"),
                     X_HELP_PGM_ID: "sy_com_150_p01"
                     }
              }, function(rv)
              {
                if(rv != null)
                {
                  var grid = rv;
                  var RowCount = grid.RowCount;
                  var ColCount = grid.ColCount;                        
                  for ( var r = 0; r < RowCount; r++ )
                  {
                    for ( var col = 0; col < ColCount; col++ )
                    {
                      eval("element[0].data."+grid_GetColName(grid, col)+" = \""+grid_GetCellValue(grid, r, col)+"\"");
                    }
                    break;// get only one
                  }
                  element[0].value = element.getEmp("EMP_NM");
                  var strETC_INFO = element.ETC_INFO || "";
                  strETC_INFO = strETC_INFO.replace(/조직/, $(element).getEmp("ORG_NM"));
                  strETC_INFO = strETC_INFO.replace(/직급/, $(element).getEmp("EMP_GRADE_NM"));
                  strETC_INFO = strETC_INFO.replace(/직책/, $(element).getEmp("DUTY_NM"));
                  strETC_INFO = strETC_INFO.replace(/직위/, $(element).getEmp("POST_NM"));
                  strETC_INFO = strETC_INFO.replace(/호칭/, $(element).getEmp("EMP_TITLE_NM"));
                  $("#"+element.attr("PREFIX")+"_etcinfo").val(strETC_INFO);
                  if(element.attr("ondata")!=undefined) eval(element.attr("ondata"));
                }
            });
          }
          break;
          case "resetemp01":
          {
            element[0].data = {};
            element.val("");
            $("#"+element.attr("PREFIX")+"_etcinfo").val("");
            if(element.attr("ondata")!=undefined) eval(element.attr("ondata"));
          }
          break;
          case "ajaxLoading":
          {
            if ( p1 )
            {
              element.progressCount++;
              if ( element.progressCount == 1 )
              {
                element.css("background", "url("+__base_dir+"images/common/indicator.gif)");
                element.css("backgroundRepeat", "no-repeat");
                Progress.start();
              }
            }
            else
            {
              element.progressCount--;
              if ( element.progressCount == 0 )
              {
                element.css("backgroundImage", "");
                Progress.stop();
              }
            }
          }
          break;
        }
      }
    });

    $.fn.extend( {getEmp : function(key)
    {
      var element = $(this);
      return nvl(eval("element[0].data."+key), "");// 사원정보 가져오기 인터페이스
    }});
        
    $(this)[0].data = {};// 저장장소
    //$(this).attr("title","성명 또는 사번을 입력하고 엔터키를 누르면 자동검색됩니다.");
    $(this).attr("title",ajaxMsg("MSG_ALERT_COND_OVER5"));
    $(this).attr("autocomplete","off");
    // element.runtimeStyle.imeMode = "active";
    var EMP_SCH_AUTH_CD = nvl($(this).attr("EMP_SCH_AUTH_CD"), "10");//
    var PROFILE_ID = nvl($(this).attr("PROFILE_ID"));//
    var SKIN_PATH = nvl($(this).attr("SKIN_PATH"),__base_dir+"resource/kr/skin1");//
    var MODE_CHECK = nvl($(this).attr("MODE_CHECK"), "0010");//
    var HIDE_EMP_GRADE = nvl($(this).attr("HIDE_EMP_GRADE"), "N");//
    var PREFIX = nvl($(this).attr("PREFIX"), "S");//
    var GEN_YN_YN = nvl($(this).attr("GEN_YN_YN"), "Y");//
    if ( EMP_SCH_AUTH_CD == "10" )
    {
      enableInput($(this));
      $(this).doAction_emp(commonOtpVal.setLoginEmp01);
    }else if( EMP_SCH_AUTH_CD == "20" && GEN_YN_YN == "Y"){
      var search_button = $("<input type='button' id='icsch_sy181_" + PREFIX + "'  class='btn_search01' />");
      $(this).parent().append(search_button);
      search_button.bind("click", function(e)
      {
        $(this).doAction_emp(commonOtpVal.popemp01);
      }).bind("focus", function(e)
      { //버튼이 focus되면 점선으로 된 테두리 없애기
        $(this).blur();
      });
      
      $(this).doAction_emp(commonOtpVal.setLoginEmp01);
    }
    else
    {
      //var search_button = $("<input>",{id: 'icsch_sy181_'+PREFIX,  type: 'button', "class": 'btn_search01'});      
      var search_button = $("<input type='button' id='icsch_sy181_" + PREFIX + "'  class='btn_search01' />");
      $(this).parent().append(search_button);
      search_button.bind("click", function(e)
      {
        $(this).doAction_emp(commonOtpVal.popemp01);
      }).bind("focus", function(e){ //버튼이 focus되면 점선으로 된 테두리 없애기
        $(this).blur();
      });
    }
    
    $(this).bind("keydown", function(e)
    { 
      if ( e.which == 13 )
      {
        if(!isEdge())
        {
          e.preventDefault();
          e.stopPropagation();
          $(this).blur();
        }
        else
        {
          //edge브라우저에서 blur가 trigger되지 않아 focusout으로 대체
          e.stopPropagation();
          $(this).trigger("focusout");
        }
      }
    });
    $(this).bind("keyup", function(e)
    {
      e?e:e=event;
      var element = this;
      if ( this.value.length == 0 )
      {
        $(element).doAction_emp("resetemp01");
      }
    });
        
    $(this).bind("change",function(e){
      var element = this;
      if ( this.value.length > 0 && $(element).attr("progressCount") == 0)
      {
        $(element).doAction_emp(commonOtpVal.search_emp01);
      }
    });
  });
}
/**
 * 조직명 조회조건의 기능들을 정의한다
 * @member global
 * @method applyElementSearchOrg
 */
function applyElementSearchOrg()
{
    $(".search_org").each(function(index, key)
    {
      if($(this).attr("__searchorgapplied")==true) return;
      $(this).attr("__searchorgapplied",true);
      $(this).attr("progressCount",0);

      if ( $(this).ondata!=undefined) $(this).ondata = new Function($(this).ondata);

      {
        $(this).attr("maxLength","15");
        $(this).css({imeMode: 'active'});

        $.fn.extend({
          doAction_org : function(sAction, p1){

            var element = $(this);

            if(element[0].type=="button") element = $("#" + $(this).attr("PREFIX") + "_ORG_NM");
            var S_C_CD;
            // element 없어도 catch 로 안빠진다....
            // if문으로 순차적으로 비교
            // 2013.03.21 서영준 ( HCG )
            try{ 
              S_C_CD = element.attr("C_CD");
              if(!S_C_CD)
            {
                S_C_CD = $("#"+element.attr("CCD_INPUT_NAME")).val();
            }
              
              if(!S_C_CD)
            {
                S_C_CD = Page.C_CD;
            }
              
               }
            catch(e){
              try{ S_C_CD = $("#"+element.attr("CCD_INPUT_NAME")).val();}
              catch(e){
                try{ S_C_CD = Page.C_CD }catch(e){}
              }
            }

            switch ( sAction ){
              case commonOtpVal.search_org01:
              {
                if ( element.attr("ajaxLoading")!=undefined )
                {
                  alert("검색중입니다...");
                  return;
                }
                if ( $.trim($(element).val()).length == 0 )
                {
                  $(element).doAction_org("resetorg01");
                  return;
                }
                // 조직명으로 검색
                $(element).doAction_org("ajaxLoading", true);
                ajaxRequestXS(commonOtpVal.Sy_com_182_c01, commonOtpVal.searchOrg01, {S_C_CD: S_C_CD, S_ORG_NM: $(element).val(), S_YMD :$("#"+element.attr("PREFIX")+"_SY182_YMD").val()}, function(xs){

                  var RowCount = xs.RowCount();
                  if ( RowCount == 0 ){
                      alert(ajaxMsg("MSG_ALERT_SEARCH_ORG_NOTHING"));
                      element.select();
                      element.focus();
                      element.doAction_org("resetorg01");
                  }else if ( RowCount > 1 ){
                    var pre = element.attr("PREFIX");
                    var dv = document.createElement("DIV");
                    document.body.appendChild(dv);
                      dv.id = pre + "_ORG_SCH_LAYER";
                      $(dv).css("width","170px");
                      $(dv).css("height","100px");
                      $(dv).css("border-top","2px solid #d7262e");
                      $(dv).css("border-left","2px solid #848484");
                      $(dv).css("border-right","2px solid #848484");
                      $(dv).css("border-bottom","2px solid #848484");
                      $(dv).css("overflow","hidden");
                      $(dv).css("position","absolute");
                      $(dv).css("zIndex","20000");
                      $(dv).css("background-color","white");
                      $(dv).css("margin-top",  $(element).offset().top + 20);
                      $(dv).css("margin-left",  $(element).offset().left );

                      var timeout;
                      $(dv).mouseleave(function () {timeout = setTimeout(function () {dv.parentNode.removeChild(dv);}, 500);}).mouseenter(function () {clearTimeout(timeout);});

                      var dv01 = document.createElement("SPAN");
                      dv01.id = pre + "_ORG_FOUND_LIST";
                      $(dv01).css("width","93%");
                      $(dv01).css("height","90%");
                      $(dv01).css("display","inline-block");
                      $(dv01).css("background-color","#fff");
                      $(dv01).css("margin-top","10px");
                      $(dv01).css("margin-left","10px");
                      $(dv01).css("margin-left","10px");
                      $(dv01).css("overflow","auto");
                      $(dv01).css("zIndex","20000");
                      dv.appendChild(dv01);  

                      var ol01 = document.createElement("OL");
                      ol01.style.listStyle = "none";
                      var shtml = "";
                      var attrs = "";
                      for (var i = 0; i < RowCount; i++) {
                        attrs = " PRE='" + pre + "' C_CD='" + xs.GetCellValue(i, "C_CD") + "' ORG_ID='" + xs.GetCellValue(i, "OBJ_ID") + "' ORG_NM='" + xs.GetCellValue(i, "OBJ_NM") + "'";
                        shtml += "<LI style='padding:2px 10px; background:url(/resource/images/icon/blt_layer.gif) no-repeat 0 6px;white-space:nowrap;' onclick='OrgSimpleListClick($(this))'" + attrs + "><a href='javascript:;'>" + xs.GetCellValue(i, "OBJ_NM") + "</a></LI>";
                      }
                      ol01.innerHTML = shtml;
                      dv01.appendChild(ol01);
                    // 두건이상이면 조직찾기 팝업
                    //element.doAction_org("poporg01");
                  }else if ( RowCount == 1 ){
                      // 검색된 조직이 하나면
                    if(element[0].data==undefined) element[0].data = {};
                    element[0].data.ORG_ID = xs.GetCellValue(0, "OBJ_ID");
                    element.val(xs.GetCellValue(0, "OBJ_NM"));
                    if(element.attr("ondata")!=undefined) eval(element.attr("ondata"));
                    try{$(element).css("imeMode", "active");}catch(e){};
                  }
                }, function() { element.doAction_org("ajaxLoading", false); });
              }
              break;
              case commonOtpVal.poporg01:
              {
                ModalUtil.open({url:__base_dir+"sys/sy_com/sy_com_160_p01.jsp",title:ajaxLabel("search_org"), param: {
                  S_C_CD: S_C_CD,
                      X_EMP_SCH_AUTH_CD: element.attr("EMP_SCH_AUTH_CD"),
                      X_PROFILE_ID: element.attr("PROFILE_ID"),
                      S_SELMODE: "S",
                      S_ORG_NM: element.val(),
                      S_YMD: element.attr("S_SY182_YMD"),  
                      S_HIDE_EMP_GRADE: element.attr("HIDE_EMP_GRADE"),
                      X_HELP_PGM_ID: "sy_com_160_p01"
                      }}, function(rv){
                       if(rv != null)
                     {
                        var grid = rv;
                          var RowCount = grid.RowCount;
                          var ColCount = grid.ColCount;
  
                          if(element[0].data==undefined) element[0].data = {};
                          for ( var r = 0; r < RowCount; r++ )
                          {
                            for ( var col = 0; col < ColCount; col++ )
                            {
                              eval("element[0].data."+grid_GetColName(grid, col).replace("OBJ", "ORG")+"=\""+grid_GetCellValue(grid, r, col)+"\"");
                            }
                            break;// get only one
                          } 
  
                          $("#"+element.attr("PREFIX")+"_ORG_NM").val(element.getOrg("ORG_NM"));
                          if(element.attr("ondata")!=undefined) eval(element.attr("ondata"));
                     }
                       else
                     {
                        $("#"+element.attr("PREFIX")+"_ORG_NM").val("");
                          $("#"+element.attr("PREFIX")+"_ORG_ID").val("");
                     }
                });
              }
              break;
              case "resetorg01":
                  {
                    element[0].data = {};
                    element.val("");
                    if(element.attr("ondata")!=undefined) eval(element.attr("ondata"));
                  }
                  break;
              case "ajaxLoading":
              {
                if ( p1 ){
                  element.progressCount++;
                  if ( element.progressCount == 1 )
                  {
                    element.style.background = "url("+__base_dir+"images/common/indicator.gif)";
                    element.style.backgroundRepeat = "no-repeat";
                    Progress.start();
                  }
                }else{
                  element.progressCount--;
                  if ( element.progressCount == 0 ){
                    element.style.backgroundImage = "";
                    Progress.stop();
                  }
                }
              }
              break;
            }
        }
      });
    }

    $.fn.extend( {getOrg : function(key)
    {
      //if(element == undefined) return;
      var element = $(this);
        return nvl(eval("element[0].data."+key), "");
    }});
        
    $(this)[0].data = {};// 저장장소
    $(this).attr("title",ajaxMsg("MSG_ORG_001"));
    $(this).attr("autocomplete","off");
    var EMP_SCH_AUTH_CD = nvl($(this).attr("EMP_SCH_AUTH_CD"), "10");//
    
    var PROFILE_ID = nvl($(this).attr("PROFILE_ID"));//
    var SKIN_PATH = nvl($(this).attr("SKIN_PATH"),__base_dir+"resource/kr/skin1");//
    var MODE_CHECK = nvl($(this).attr("MODE_CHECK"), "0010");//
    var HIDE_EMP_GRADE = nvl($(this).attr("HIDE_EMP_GRADE"), "N");//
    var PREFIX = nvl($(this).attr("PREFIX"), "S");
    
    if ( EMP_SCH_AUTH_CD == "30" )
    {      
      var search_button = $("<input type='button' id='icsch_sy182_" + PREFIX + "' PREFIX='" + PREFIX + "'  class='btn_search01' />");
      $(this).parent().append(search_button);      
      search_button.bind("click", function(e)
        {
        $(this).doAction_org(commonOtpVal.poporg01);
      }).bind("focus", function(e){ //버튼이 focus되면 점선으로 된 테두리 없애기
        $(this).blur();
      })


    }
    
    var EMP_SCH_AUTH_CD = nvl($(this).attr("EMP_SCH_AUTH_CD"), "10");
    if(EMP_SCH_AUTH_CD!="20"){
      $(this).bind("keydown", function(e)
      {
        if ( e.keyCode == 13 )
        {
            e.preventDefault();
            e.stopPropagation();
            $(this).blur();
        }
      });
      $(this).bind("keyup", function(e)
      {
        e?e:e=event;
        var element = this;
        if ( this.value.length == 0 )
        {
          $(element).doAction_org("resetorg01");
        }
      });
          
      $(this).bind("change",function(e){
        var element = this;
        if ( this.value.length > 0 && $(element).attr("progressCount") == 0)
        {
          $(element).doAction_org(commonOtpVal.search_org01);
        }
      });
    }

    });
}
  
  
/**
 * 배열(array)내의 (val)값의 index 위치를 반환
 * @member global
 * @method array_indexOf
 * @param {Array} array
 * @param {Object} val
 * @return {Number}
 */
function array_indexOf(array, val)
{
  for ( var n = 0; n < array.length; n++ )
  {
    if ( array[n] == val )
    {
      return n;
    }
  }
  return -1;
}

/**
 * pre 태그 레이어를 그려준다.
 * @member global
 * @method showLayer
 * @param {Json} options
 */
function showLayer(options)
{
  var e = window.event;
  
  var _layer = $("#show_layer");
  
  if(!_layer.length){
    _layer = $("<pre id='show_layer' style='position:absolute; top:0px; left:0px; padding:5px; display:none; border:1px solid black; background:white;'></pre>");
    _layer.mouseout(function(){
      _layer.hide();
    });
    $("body").append(_layer);      
  }
  
  _layer.html(options.innerText);
  
  var body_w = $("body")[0].offsetWidth;
  var body_h = $("body")[0].offsetHeight;
  var layer_w = Number(_layer.width()) + 10; //ie box model 때문에 여유분으로 10 추가
  var layer_h = Number(_layer.height()) + 10;
  var event_l = e.clientX;
  var event_t = e.clientY;
  
  var gap_l = body_w - event_l - layer_w;
  var gap_t = body_h - event_t - layer_h;
  
  if(gap_l < 0) event_l = event_l - layer_w + 10;
  if(gap_t < 0) event_t = event_t - layer_h + 10;
  
  _layer.css("left", event_l);
  _layer.css("top", event_t);
  
  _layer.show();
}
  
/**
 * 메일/SMS 보내기 팝업을 호출
 * @member global
 * @method popSendAll
 * @param {Json} options S_EMP_IDS:사번을 (,)로 연결한 문자열
 */
function popSendAll(options)
{
  options = options || {};
  ModalUtil.open(args = {title:options.title, url: "/sys/sy_com/sy_com_230_m01.jsp", param: {S_EMP_IDS: options.S_EMP_IDS || ""}});
}
  
/**
 * 메일보내기 팝업을 호출
 * @member global
 * @method popSendMail
 * @param {Json} options S_EMP_IDS:사번을 (,)로 연결한 문자열
 */
function popSendMail(options)
{
  options = options || {};
  ModalUtil.open(args = {title:options.title, url: "/sys/sy_bas/sy_bas_210_f02.jsp", param: {S_EMP_IDS: options.S_EMP_IDS || ""}});
}
  
/**
 * sms보내기 팝업을 호출
 * @member global
 * @method popSendSms
 * @param {Json} options S_EMP_IDS:사번을 (,)로 연결한 문자열
 */
function popSendSms(options)
{
  options = options || {};
  ModalUtil.open(args = {title:options.title, url: "/sys/sy_bas/sy_bas_220_m01.jsp", param: {S_EMP_IDS: options.S_EMP_IDS || ""}});
}
  
/**
 * 시트(sheet)에서 선택한 사원들을 대상으로 메일/SMS 보내기 팝업을 호출
 * @member global
 * @method sheetPopAll
 * @param {Object} sheet IBSheet 객체
 * @param {Json} options emp_ids:사번을 (,)로 연결한 문자열, title:팝업 title, checkSaveName:sheet의 체크박스 savename, empIdSaveName:sheet의 empId savename
 */
function sheetPopAll(sheet, options)
{
  options = options || {};
  title = options.title || ajaxLabel('send_all');
  var checkSaveName = options.checkSaveName || "CCHK";
  var empIdSaveName = options.empIdSaveName || "EMP_ID";
  
  var emp_ids = options.emp_ids || [];
  
  if(emp_ids.length <=0)
  {
    sheetEachRow(sheet, function(r, x)
    {
      if ( x.GetCellValue(r, checkSaveName) == "Y" )
      {
        emp_ids.push(x.GetCellValue(r, empIdSaveName));
      }
    });
  }
  
  if(emp_ids == "" || emp_ids == null || emp_ids == "undefined")
  {
    alert(ajaxMsg("MSG_ALERT_0233"));
    return;
  }
  
  var S_EMP_IDS = emp_ids.join(",");
  this.popSendAll({S_EMP_IDS: S_EMP_IDS, title:title});
}
  
/**
 * 시트(sheet)에서 선택한 사원들을 대상으로 메일보내기 팝업을 호출
 * @member global
 * @method sheetPopAll
 * @param {Object} sheet IBSheet 객체
 * @param {Json} options emp_ids:사번을 (,)로 연결한 문자열, title:팝업 title, checkSaveName:sheet의 체크박스 savename, empIdSaveName:sheet의 empId savename
 */
function sheetPopMail(sheet, options)
{
  options = options || {};
  title = options.title || ajaxLabel('send_mail');
  var checkSaveName = options.checkSaveName || "CCHK";
  var empIdSaveName = options.empIdSaveName || "EMP_ID";
  var emp_ids = options.emp_ids || [];
  
  if(emp_ids.length <=0){
    sheetEachRow(sheet, function(r, x)
    {
      if ( x.GetCellValue(r, checkSaveName) == "Y" )
      {
        emp_ids.push(x.GetCellValue(r, empIdSaveName));
      }
    });      
  }

  var S_EMP_IDS = emp_ids.join(",");
  this.popSendMail({S_EMP_IDS: S_EMP_IDS, title:title});
}
/**
 * 시트(sheet)에서 선택한 사원들을 대상으로 sms보내기 팝업을 호출
 * @member global
 * @method sheetPopAll
 * @param {Object} sheet IBSheet 객체
 * @param {Json} options emp_ids:사번을 (,)로 연결한 문자열, title:팝업 title, checkSaveName:sheet의 체크박스 savename, empIdSaveName:sheet의 empId savename
 */
function sheetPopSms(sheet, options)
{
  options = options || {};
  title = options.title || ajaxLabel('send_sms');
  var checkSaveName = options.checkSaveName || "CCHK";
  var empIdSaveName = options.empIdSaveName || "EMP_ID";
  var emp_ids = [];
  sheetEachRow(sheet, function(r, x)
  {
    if ( x.GetCellValue(r, checkSaveName) == "Y" )
    {
      emp_ids.push(x.GetCellValue(r, empIdSaveName));
    }
  });
  var S_EMP_IDS = emp_ids.join(",");
  this.popSendSms({S_EMP_IDS: S_EMP_IDS, title:title});
}

/**
 * 년월(ym) 에 증가수(inc) 만큼 월을 증가 또는 감소시켜서 반환
 * @member global
 * @method addYm
 * @param {String} ym 년월
 * @param {Number} inc 증가수
 * @return {String}
 */  
function addYm(ym, inc) 
{
  return (addYmd(ym.substr(0, 6)+"01", "M", inc)).substr(0, 6);
}    
/**
 * 년월일(ymd) 에 년, 월, 주, 일(gbn) 단위로 증가수(inc) 만큼 증가 또는 감소시켜서 반환
 * @member global
 * @method addYmd
 * @param {String} ymd 년월일
 * @param {String} gbn Y:년, M:월, W:주, D:일, LOM:
 * @param {Number} inc 증가수
 * @return {String}
 */  
function addYmd( ymd, gbn, inc) 
{
  var dt = new Date(Number(ymd.substr(0, 4)), Number(ymd.substr(4, 2))-1, Number(ymd.substr(6, 2)));
  switch ( gbn )
  {
    case "Y": dt.setFullYear(dt.getFullYear() + inc); break;
    case "M": dt.setMonth(dt.getMonth() + inc); break;
    case "W": dt.setDate(dt.getDate() + inc*7); break;
    case "D": dt.setDate(dt.getDate() + inc); break;
    // last day of month
    case "LOM":
    {
      dt.setDate(1);
      dt.setMonth(dt.getMonth() + 1);
      dt.setDate(dt.getDate() - 1);
    }
    break;
  }
  var result_ymd = npad(String(dt.getFullYear()), 4) + npad(String(dt.getMonth() + 1), 2) + npad(dt.getDate(), 2);
  if ( $.protify(['Y', 'M']).include(gbn) )
  {
    var dd = ymd.substr(6, 2);
    var result_dd = result_ymd.substr(6, 2);
    if ( result_dd != dd )
    {
      result_ymd = addYmd(addYmd(result_ymd, 'M', -1), 'LOM');
    }
  }
  return result_ymd;      
}
/**
 * date 를 format_string 포맷으로 변환
 * @param date
 * @param format_string
 * @return
 */
function date2format(date, format_string)
{
  date = (typeof date == "string") ? new Date(Number(date.substr(0, 4)), Number(date.substr(4, 2))-1, Number(date.substr(6, 2))) : date || new Date();
  format_string = format_string || 'yyyymmdd';

  var yyyy = date.getFullYear();
  var mm = date.getMonth() + 1; /* getMonth 는 0~11 을 반환하기 때문에 실제 월보다 1이 작아 보상한다 */

  var dd = date.getDate();
  var hh = date.getHours();
  var mi = date.getMinutes();
  var ss = date.getSeconds();
  var ms = date.getMilliseconds();
  var val = format_string;
  var val = val.replace(/yyyy/g, npad(yyyy, 4));
  var val = val.replace(/mm/g, npad(mm, 2));
  var val = val.replace(/dd/g, npad(dd, 2));
  var val = val.replace(/hh/g, npad(hh, 2));
  var val = val.replace(/mi/g, npad(mi, 2));
  var val = val.replace(/ss/g, npad(ss, 2));
  var val = val.replace(/ms/g, npad(ms, 3));// 순서
  return val;
}  
  
  /**
   * ymd 형식의 문자열을 date 로 변경
   * @param ymd
   * @return
   */
  function ymd2date(ymd)
  {
    return new Date(
      Number(ymd.substr(0, 4)),
      Number(ymd.substr(4, 2))-1,
      Number(ymd.substr(6, 2)));
  }
  
  /**
   * ymdFr, ymdTo 사이의 일수
   * @param ymdFr
   * @param ymdTo
   * @return
   */
  function getTermDayCnt(ymdFr, ymdTo) 
  {
    var dtFr = new Date(Number(ymdFr.substr(0, 4)), Number(ymdFr.substr(4, 2))-1, Number(ymdFr.substr(6, 2)));
    var dtTo = new Date(Number(ymdTo.substr(0, 4)), Number(ymdTo.substr(4, 2))-1, Number(ymdTo.substr(6, 2)));
    return (dtTo.getTime() - dtFr.getTime()) / (1000 * 60 * 60 * 24);
  }
  /**
   * ymdFr, hmFr, ymdTo, hmTo 사이의 시간수
   * @param ymdFr
   * @param hmFr
   * @param ymdTo
   * @param hmTo
   * @return
   */
  function getTermTimeCnt(ymdFr, hmFr, ymdTo, hmTo) 
  {
    var dtFr = new Date(Number(ymdFr.substr(0, 4)), Number(ymdFr.substr(4, 2))-1, Number(ymdFr.substr(6, 2)), Number(hmFr.substr(0, 2)), Number(hmFr.substr(2, 4)));
    var dtTo = new Date(Number(ymdTo.substr(0, 4)), Number(ymdTo.substr(4, 2))-1, Number(ymdTo.substr(6, 2)), Number(hmTo.substr(0, 2)), Number(hmTo.substr(2, 4)));
    return (dtTo.getTime() - dtFr.getTime()) / (1000 * 60 * 60);
  }

  
  /**
   * 월의 마지막 일 YMD
   */
  function lastDay(ym)
  {
    var ymd = addYmd(ym.substr(0, 6)+"01", "M", 1);
    return addYmd(ymd, "D", -1);
  }
  
  /**
   * YMD 문자열을 date 로 변환
   * @param ymd
   * @return
   */
  function makeYmdToDate(ymd)
  {
    var yy = Number(ymd.substr(0, 4));
    var mm = Number(ymd.substr(4, 2))-1;
    var dd = Number(ymd.substr(6, 2));
    return new Date(yy, mm, dd);
  }
    
  /**
   * 요일문자
   * @param dow_num
   * @param type
   * @return
   */
  function getDayOfWeekText(dow_num, type)
  {
    var text = '';
    switch(dow_num)
    {
      case 0:text = ajaxLabel("MSG_sun");break;
      case 1:text = ajaxLabel("MSG_mon");break;
      case 2:text = ajaxLabel("MSG_tue");break;
      case 3:text = ajaxLabel("MSG_wed");break;
      case 4:text = ajaxLabel("MSG_thu");break;
      case 5:text = ajaxLabel("MSG_fri");break;
      case 6:text = ajaxLabel("MSG_sat");break;
    }
    return text;
  }


  /**
   * xsheet 에서 col 컬럼의 모든 값을 배열로 리턴
   * @param xsheet
   * @param col
   * @param data_key
   * @return
   */
  function getCellValuesXS(xsheet, col, data_key)
  {
    var arr = [];
    for ( var row = 0, rcnt = xsheet.RowCount(data_key); row < rcnt; row++ )
    {
      arr[arr.length] = xsheet.GetCellValue(row, col, data_key);
    }
    return arr;
  }

  function createEntirePageWrapGrayLayer(){
     var _top = window.ehrTopFrame || top;
    var oDiv = $("<div></div>");
    oDiv.css({margin:"0",position:"absolute",width:"100%",height:"100%",top:"0",left:"0",background:"black",filter:"alpha(opacity=70)",opacity:"0.7"});
    _top.$("body").append(oDiv);
    return oDiv;
  }

  function popModaless(args)
  {
    var defaultOpt;    
    defaultOpt = {width:args.width||"900", height:args.height||"700", toolbar:"no",directories:"no",status:"no",linemenubar:"no",scrollbars:args.scrollbars||"yes",resizable:args.resizable||"yes",dependent:"yes"};
    
    var dialogOptionStr = "";
    
    $.each(defaultOpt, function(key, value) {
      dialogOptionStr += (dialogOptionStr==""?"":",")+key+"="+value;
    });
      
    var args = args || {};
    var param = args.param || args.parameters || {};
    if ( window.Page )
    {
      param.X_PROFILE_ID = param.X_PROFILE_ID || Page.PROFILE_ID;
        param.X_MODULE_ID = param.X_MODULE_ID || Page.MODULE_ID;
        param.X_MENU_ID = param.X_MENU_ID || Page.MENU_ID;
        param.X_PGM_ID = param.X_PGM_ID || Page.PGM_ID;
        param.X_SQL_ID = param.X_SQL_ID || Page.SQL_ID;
        param.X_EMP_SCH_AUTH_CD = param.X_EMP_SCH_AUTH_CD || Page.EMP_SCH_AUTH_CD;
        param.X_MENU_NM = param.X_MENU_NM || "";
        param.X_PGM_URL = param.X_PGM_URL || Page.PGM_URL;
        param.X_ENC_VAL = param.X_ENC_VAL || Page.ENC_VAL;
        param.X_ENC_VAL2 = param.X_ENC_VAL2 || Page.ENC_VAL2;
        param.X_POP_URL = args.url;
        param.X_HELP_PGM_ID = param.X_HELP_PGM_ID || Page.HELP_PGM_ID;
        if ( ehrTopFrame._LOGIN_INFO ) param.X_LOGIN_INFO = ehrTopFrame._LOGIN_INFO;// for security
    }
    args.param = param;// 반드시 해야함...
    args.openerWindow = window;
    args.opener = window;
    
    try
    {
      if(args.name)
      {
        window.open("", args.name, dialogOptionStr);
            var param = args.param || args.parameters;
            if ( param.X_LOGIN_INFO ) top._LOGIN_INFO = param.X_LOGIN_INFO;
            submit2({target: args.name, action: __base_dir+"menuAction.do"}, $.extend(param, {url:args.url}));
      }
      else
      {
        if(winOpen == undefined ||winOpen == '') {
          winOpen = window.open("", "pcmPopup", dialogOptionStr);
          var param = args.param || args.parameters;
          if ( param.X_LOGIN_INFO ) top._LOGIN_INFO = param.X_LOGIN_INFO;
          //submit3({target: "pcmPopup", action: __base_dir+"common/jsp/popModaless.jsp"}, $.extend(param, {url:args.url})); 
          submit2({target: "pcmPopup", action: __base_dir+"menuAction.do"}, $.extend(param, {url:args.url}));
        }else{
          for ( var name in args.param )
          {
            if(name=='S_SCH_EMP_NM') value = winOpen.modalFrame.$("#S_EMP_NM").val(args.param[name]);
          if(name=='S_SCH_EMP_ID') value = winOpen.modalFrame.$("#S_EMP_ID").val(args.param[name]);
          }
          winOpen.modalFrame.doAction('search01');
        } 
        winOpen.focus(); 
        return winOpen;
      }
    }
    catch(poperror)
    {
      if(winOpen != undefined) {
        winOpen ='';
        popModaless(args);
      }else{
          alert(ajaxMsg("MSG_ALERT_INTERCEPT_POP"));
            //alert('팝업오류가 발생하였습니다. 팝업 차단을 해제해주세요.');
      }
    }
  }

  /**
   * 공통 윈도우 팝업, 공통 iframe 세팅
   * @param option
   * @return
   */
  function popOpen(option)
  {
    var features = option.features || {};
    var w = Number(features.width) || 200, h = Number(features.height) || 150;
    var features = $.extend(features,{
      top: ((window.screen.height - h)/2),
      left: ((window.screen.width - w)/2),
      width: w,
      height: h,
      directories: "no",
      location: "no",
      menubar: "no",
      scrollbars: "yes",
      status: "no",
      titlebar: "no",
      toolbar: "no",
      resizable: "yes"
    });
    
    var sFeatures = "";
    $.each(features, function(key, val){
      sFeatures = sFeatures +(sFeatures?",":"")+key+"="+val;
    });
    
    // frames 에 option.name 에 해당하는 frame 이 존재하지 않으면 popup
    // alert(option.name);
    var popopen = !option.name || ! checkExistsFrameByName(option.name);
    // alert(popopen);
    var newWin = null;
    if ( popopen )
    {
      newWin = window.open(__base_dir+"common/jsp/popup_wait.html", option.name, sFeatures);
      try { newWin.focus(); } catch(e) {}
    }
    // 권한...세팅 start
    var param = option.param || option.parameters || {};
    if ( window.Page )
    {
      param.X_PROFILE_ID = param.X_PROFILE_ID || Page.PROFILE_ID;
      param.X_MODULE_ID = param.X_MODULE_ID || Page.MODULE_ID;
      param.X_MENU_ID = param.X_MENU_ID || Page.MENU_ID;
      param.X_PGM_ID = param.X_PGM_ID || Page.PGM_ID;
      param.X_SQL_ID = param.X_SQL_ID || Page.SQL_ID;
      param.X_EMP_SCH_AUTH_CD = param.X_EMP_SCH_AUTH_CD || Page.EMP_SCH_AUTH_CD;
      param.X_MENU_NM = param.X_MENU_NM || "";
      param.X_PGM_URL = param.X_PGM_URL || Page.PGM_URL;
      param.X_ENC_VAL = param.X_ENC_VAL || Page.ENC_VAL;
      param.X_ENC_VAL2 = param.X_ENC_VAL2 || Page.ENC_VAL2;
      param.X_POP_URL = option.url;
      param.X_HELP_PGM_ID = param.X_HELP_PGM_ID || Page.HELP_PGM_ID;
      if ( ehrTopFrame._LOGIN_INFO ) param.X_LOGIN_INFO = ehrTopFrame._LOGIN_INFO;// for security
    }
    else
    {
      param.X_POP_URL = option.url;
    }
    // 권한...세팅 end
    submit2({target: option.name, action: "/menuAction.do"}, param);

    if ( popopen )
    {
      // 곧바로 호출하면 setting 안되므로 시간차 이용
      setTimeout(function(){
        newWin.top._LOGIN_INFO = top._LOGIN_INFO;
      },100);
    }
    return frames[option.name] || newWin;
  }

  function sizeDialog(w, h, popTitle, pageTitle)
  { 
  popTitle = nvl(popTitle,'popTitle');
  pageTitle = nvl(pageTitle,'pageTitle');
  displayElement(popTitle, true);
  displayElement(pageTitle, false);
  var _top = window.ehrTopFrame || top;
  ModalUtil.resize({width:w||$(_top).outerWidth()-20, height:h||$(_top).outerHeight()-20});
  /*
    // 모달이 모달로도 뜨는 프로그램을 iframe 으로 호출하는 문제 해결 위해
    if ( parent && parent.__sizeDialog )
    {
      __sizeDialog = true;
      return;
    }
    document.documentElement.style.display = "none";
    var _top = window.ehrTopFrame || top;
    //if(top.dialogArguments){
    if(typeof w == "string"){
      w = w.replace("px", "");
      h = h.replace("px", "");
    }

    if(isIE() && top.dialogArguments){

      _top.dialogWidth = w + "px";
      _top.dialogHeight = (h+55) + "px";// for ie7.0
      _top.dialogTop = (window.screen.height - Number(_top.dialogHeight.replace(/\D/g, "")))/2;
      _top.dialogLeft = (window.screen.width - Number(_top.dialogWidth.replace(/\D/g, "")))/2;
    }else{
      var wtop = (window.screen.height - h)/2;
      var wleft = (window.screen.width - w)/2;
      _top.moveTo(wleft, wtop);
      _top.resizeTo(w, h);
    }
    document.documentElement.style.display = "";
    __sizeDialog = true;

    //setTimeout("Layout.resize()",100);
    setTimeout("Layout.resize()",200);
    */
  }
  
  function sizeWindow(w, h)
  {
    var _top = window.ehrTopFrame || top;
    var wtop = (window.screen.height - h)/2;
    var wleft = (window.screen.width - w)/2;
    _top.moveTo(wleft, wtop);
    _top.resizeTo(w, h);
  }
  
  //기존소스의 호환을 위해 남겨놓음. sizeDialog로 대체
  function popTitle(w, h, popTitle, pageTitle)
  {
    sizeDialog(w, h, popTitle, pageTitle);
  }


/**
 * 파일 업 다운 유틸
 */
var FileUpDn =
{
  popUploadFile: function(options, rvF, closeF)
  {
    url = "sys/sy_com/sy_com_140_p01.jsp";
    if(isHtml5())
    {
      url = "sys/sy_com/sy_com_140_p02.jsp";  //멀티파일업로드
    }
    
    options = options || {};
    ModalUtil.open({title:ajaxLabel("upload"), url: __base_dir+url, param: 
    {S_FILE_NO: options.S_FILE_NO||"",
      S_READONLY_YN: options.S_READONLY_YN||"Y",
      S_ONE_FILE_MGSIZE: options.S_ONE_FILE_MGSIZE||"10",
      S_FILE_LIMIT_CNT: options.S_FILE_LIMIT_CNT||"5",
      S_SAVE_DIR_KEY: options.S_SAVE_DIR_KEY||'',
      S_FILE_NO_FORCE_SAVE_YN: options.S_FILE_NO_FORCE_SAVE_YN||'N',
      X_HELP_PGM_ID:"sy_com_140_p01"
    }}, rvF, closeF);
  },
  setSpanFileCnt: function(options)
  {
    options = options || {};
    //$("#"+options.layerId).html('');
    if ( options.S_FILE_NO )
    {
      ajaxRequestXSProg(commonOtpVal.Sys_file_common, commonOtpVal.searchFileCnt, {S_FILE_NO: options.S_FILE_NO}, function(xs)
      {
        $("#"+options.layerId).html('<span style="font-weight:bold; color:blue; cursor:pointer; " >'+xs.GetEtcData('FILE_CNT')+'</span>');
      });
    }
  },
  setLayerFileCnt: function(options)
  {
    options = options || {};
    $("#"+options.layerId).html('');
    if ( options.S_FILE_NO )
    {
      ajaxRequestXSProg(commonOtpVal.Sys_file_common, commonOtpVal.searchFileCnt, {S_FILE_NO: options.S_FILE_NO}, function(xs)
      {
        $("#"+options.layerId).html('<span style="font-weight:bold; color:blue; cursor:pointer; " >FILE('+xs.GetEtcData('FILE_CNT')+')</span>');
      });
    }
  },
  // 아래는 파일다운로드...
  fileDownIframe: null,
  fileDownIframeName: "_fileDownloadFrame"+new Date().getTime(),
  fileNo: '',
  iframeId : '',
  showDownFrame: function(options, e)
  {
    var w = 250;
    var h = 150;
    options = options||{};
    var iframe = this.fileDownIframe;
    var iframeName = this.fileDownIframeName;
    if ( ! iframe )
    {
      iframe = $E("iframe", {
        id: iframeName,
        name: iframeName,
        frameBorder: 0,
        //src: __base_dir+"common/jsp/fileDownList.jsp?X_PGM_ID="+Page.PGM_ID,
        style: {
          position: "absolute",
          display: "none",
          width: w + "px",
          height: h + "px",
          zIndex: "999999"
        }});

      document.body.appendChild(iframe);
      
      //$("#"+iframe.id).mouseout(function(){FileUpDn.hideDownFrame(); window.open("about:blank", iframe.id);});
      //$("#"+iframe.id).mouseout(function(){FileUpDn.hideDownFrame();});
    }
    else
    {
      $(iframe).attr('src', 'about:blank');
    }

    var param = {
        S_PGM_OPEN_TIME: S_PGM_OPEN_TIME,
        S_ENC_OTP_KEY: S_ENC_OTP_KEY,
        S_CSRF_SALT: S_CSRF_SALT,
        S_PDF_SHOW : (options.S_PDF_SHOW==undefined?"N":options.S_PDF_SHOW),
        X_PGM_ID: Page.PGM_ID
      };
    popOpen({url: __base_dir+"common/jsp/fileDownList.jsp", name: iframeName, param: param});
  
    e = e || window.event;
    //var evEle = (typeof e.target != undefined) ? e.target : e.srcElement;

    if ( options.posLeft != null && options.posTop != null )
    {
      //iframe.style.left = (options.posLeft < w ? options.posLeft : (options.posLeft - w));
      //iframe.style.top = options.posTop;
      $(iframe).css("left", options.posLeft - w );
      $(iframe).css("top", options.posTop - h + 10);
    }
    /*
    else if ( evEle )
    {
      
      iframe.style.left = e.clientX - 30;
      iframe.style.top = e.clientY - 15;
      
       $("#"+iframe.id).offset({ top : e.clientY-30, left : e.clientX-30 });
    }
    */
    else
    {
      //$(iframe).css("top",e.clientY).css("left",e.clientX);
      var _layer = $(iframe);
      var body_w = $("body")[0].offsetWidth;
      var body_h = $("body")[0].offsetHeight;
      var layer_w = Number(_layer.css("width").replace("px","")) + 10; //ie box model 때문에 여유분으로 10 추가
      var layer_h = Number(_layer.css("height").replace("px","")) + 10;
      var event_l = e.clientX;
      var event_t = e.clientY;
      
      var gap_l = body_w - event_l - layer_w;
      var gap_t = body_h - event_t - layer_h;
      
      if(gap_l < 0) event_l = event_l - layer_w + 10;
      if(gap_t < 0) event_t = event_t - layer_h + 10;
      
      _layer.css("left", event_l);
      _layer.css("top", event_t);
    }

    this.fileNo = options.fileNo||'';
    this.iframeId = iframe.id;
    this.fileDownIframe = iframe;
    this.onShowDownFrame();
  },
  hideDownFrame: function()
  {
    $("#"+this.iframeId).remove();
  this.fileDownIframe = null; //filedownlist가 깜빡이는 현상때문
  },
  onShowDownFrame: function()
  {
    $("#"+this.iframeId).show();
  },
  buttonUploadFile: function(options)
  {
    options = options || {};
    var file_no_name = options.file_no_name || 'S_FILE_NO';
    var file_down_layer_id = options.file_down_layer_id || 'fileDownSpan';
    inputSetValueAuto(
      file_no_name,
      FileUpDn.popUploadFile({S_FILE_NO:$("#"+file_no_name).val(),S_READONLY_YN:'N'}));
    FileUpDn.setLayerFileCnt({S_FILE_NO:$("#"+file_no_name).val(),layerId:file_down_layer_id});
  },
  /**
   * 파일업로드 하면서 form submit
   * @param options
   * @return
   */
  uploadFile : function (options)
  {
    //Progress.start();
    if ( window.Page == undefined )
    {
      Page =
      {
        PROFILE_ID: "",
        PGM_ID: ""
      }
    }

    var f = nvl(options.form, document.forms[0]);
    // 임시저장
    var f_encoding = f.encoding;
    var f_method = f.method;
    var f_target = f.target;
    var f_action = f.action;
    // submit
    f.encoding = "multipart/form-data";
    f.method = "post";
    f.target = nvl(options.target, window.frames[0].name);

    if ( typeof options.OnResult == "function")
    {
      var OnResultFunctionName = "OnResult_"+new Date().getTime();
      window[OnResultFunctionName] = options.OnResult;
      options.OnResult = OnResultFunctionName;
    }
    
    console.log(options);
    
    var param = "";
    if(options.queryString == undefined)
    {
      param = $(options.queryString).toQueryParams();
    }
    else
    {
      param = toQueryParams(options.queryString);
    }
    param = $.extend(param, {__viewState:toJsonString(param)});
    options.queryString = $.param(param);
    
    f.action =
      __baseAction+"?S_FORWARD=iframeResultXML&S_DSCLASS="+encodeURIComponent(options.S_DSCLASS)+"&S_DSMETHOD="+encodeURIComponent(options.S_DSMETHOD)+
      "&S_ID="+nvl(options.ID, "")+"&S_FUNCTION="+nvl(options.OnResult, "OnResult")+
      "&S_PGM_OPEN_TIME="+S_PGM_OPEN_TIME+"&S_ENC_OTP_KEY="+encodeURIComponent(S_ENC_OTP_KEY)+"&S_CSRF_SALT="+encodeURIComponent(S_CSRF_SALT)+
      "&S_PAGE_PGM_ID="+Page.PGM_ID+"&S_PAGE_PROFILE_ID="+Page.PROFILE_ID+
      (options.getparam ? "&"+$.param(options.getparam) : "")+
      (options.queryString ? "&"+options.queryString : "");
    
    // submit 시 disabled 된 element 는 안나가므로...다음과 같은 처리가 필요
    //var disabledElements = $A(f1.elements).select(function(x) { return x.disabled; });// disabled elements 모으고
    var disabledElements = $("[disabled]").each(function(i,e){
       return this.disabled;
     });// disabled elements 모으고

    f.submit();
    disabledElements.each(function(i, e) { e.disabled = true; });// disable
    // 원복
    f.encoding = f_encoding;
    f.method = f_method;
    f.target = f_target;
    f.action = f_action;
  },
  /**
   * 팝업 다운로드
   * @param target
   * @param S_FILE_PATH
   * @param S_ORG_FILE_NM
   * @return
   */
  downloadFile : function (target, S_FILE_PATH, S_ORG_FILE_NM, S_FILE_NO, S_C_CD, S_SEQ_NO, Page)
  {
    //파일다운로드로그
    var param = {
       S_C_CD : S_C_CD
      ,S_FILE_NO: S_FILE_NO
      ,S_SEQ_NO: S_SEQ_NO
      ,S_PGM_URL : Page.PGM_URL
    };
    ajaxRequestXSProg(commonOtpVal.Sys_file_common, commonOtpVal.saveFileLog, param, function(xs){});
    parameters = {
            S_FILE_PATH: S_FILE_PATH
          , S_ORG_FILE_NM: S_ORG_FILE_NM
          , S_FILE_NO: S_FILE_NO
          , S_C_CD: S_C_CD
          , S_SEQ_NO: S_SEQ_NO  
          }
    parameters = $.extend(parameters, {__viewState:toJsonString(parameters)});
    
    popOpen({url: __base_dir+"common/jsp/download.jsp", name: "downloadWindow", param: parameters});
  }
}

function InitPage(){

}

//util.js 끝

//validation.js 시작

//삭제예정
//getUnformat = getNormalValue;
//formatThis = formatInput;
//getMonthLastYmd = lastDay;

/**
 * form 의 element 들의 validation check
 * @param f
 * @param bJustCheck
 * @return
 */
function checkForm(f, bJustCheck)
{
  //f = typeof f == "string" ? document.forms[f] : f;
f = (typeof f == "string")? $("#" + f)[0] : ((f)? $(f):$("form")[0]);
  var input;
  for ( var n = 0, sz = f.elements.length; n < sz; n++ )
  {
    input = f.elements[n];
    if ( ! input.name && ! input.id ) continue;
    switch ( input.type )
    { 
      case "button":
      case "image":
      case "submit":
      case "reset": continue;
    }
    if ( ! checkInput(input, bJustCheck) ) return false;
  }
  return true;
}

/**
 * form element validation check
 * @param input
 * @param bJustCheck
 * @return
 */
function checkInput(input, bJustCheck)
{
  // 1. required 필수여부
  // 2. minv, maxv
  // 4. minbl, maxbl
  // 5. email
    
  input = returnjQueryObj(input);
  var str = input.val2();  
  var msg_prefix2 = this.getJosa(input.attr2("korname"), "을")+" "; // (input.attr2("korname")) ? input.attr2("korname") +" 을(를) " : "";  
  if ( $.protify(["Y", "true"]).include( input.attr2("required") || input.attr2("key_field") ) && !str )
  {
    if ( ! bJustCheck )
    {
      //alert(msg_prefix2 + "입력해주세요.");
      alert(ajaxMsg("MSG_ALERT_INPUT_001", Page.LANG, msg_prefix2)); // + ajaxMsg("MSG_ALERT_COND_OVER6"));
      input_selectfocus(input);
    }
    return false;
  }
  
  if ( str )
  {
    
    if ( $(input).attr2("data_format") && ! checkFormatInput(input, true) ) return false;
    // 숫자에서만 사용
    if ( input.attr2("minv") && ! checkMinMaxVal(Number(getNormalValue(input)), Number(input.attr2("minv")), null) )
    {
      if ( ! bJustCheck )
      {
        //alert(msg_prefix2 + input.minv +" 이상으로 입력해주세요.");
        alert(msg_prefix2 + input.attr2("minv") + " " + ajaxMsg("MSG_ALERT_COND_OVER7"));
        input_selectfocus(input);
      }
      return false;
    }
    if ( input.attr2("maxv") && ! checkMinMaxVal(Number(getNormalValue(input)), null, Number(input.attr2("maxv"))) )
    {
      if ( ! bJustCheck )
      {
        //alert(msg_prefix2 + input.attr2("maxv") +" 이하로 입력해주세요.");
        alert(msg_prefix2 + input.attr2("maxv") + " " + ajaxMsg("MSG_ALERT_COND_OVER8"));
        input_selectfocus(input);
      }
      return false;
    }
    // 문자에서만 사용    
    if ( input.attr2("minbl") && ! checkMinMaxByteLen(str, Number(input.attr2("minbl")), null) )
    {
      if ( ! bJustCheck )
      {
        //alert(msg_prefix2 + input.attr2("minbl") +" byte(s) 이상으로 입력해주세요.(현재 "+getByteLength(str)+" byte(s))");
        alert(msg_prefix2 + input.attr2("minbl") + " " + ajaxMsg("MSG_ALERT_COND_OVER9") + "("+ajaxMsg("MSG_prefix3") + getByteLength(str)+" byte(s))");
        input_selectfocus(input);
      }
      return false;
    }
    if ( input.attr2("maxbl") && ! checkMinMaxByteLen(str, null, Number(input.attr2("maxbl"))) )
    {
      if ( ! bJustCheck )
      {
        //alert(msg_prefix2 + input.attr2("maxbl") +" byte(s) 이하로 입력해주세요.(현재 "+getByteLength(str)+" byte(s))");
        alert(msg_prefix2 + input.attr2("maxbl") + " " + ajaxMsg("MSG_ALERT_COND_OVER10") + "("+ajaxMsg("MSG_prefix3") +getByteLength(str)+" byte(s))");
        input_selectfocus(input);
      }
      return false;
    }
  }
  return true;
}

/**
 * element not null 강제 체크
 * @param input
 * @param bJustCheck
 * @return
 */
function checkInputNN(input, bJustCheck)
{
  input = returnjQueryObj(input);
  var str = input.val2();
  var msg_prefix2 = input.attr2("korname") ? input.attr2("korname") : " ";
  if ( ! str )
  {
    if ( ! bJustCheck )
    {
      //alert(msg_prefix2 + "입력해주세요.");
      alert(ajaxMsg("MSG_ALERT_COND_OVER6").replace(new RegExp( "\\{0\\}", "gi" ), this.getJosa(msg_prefix2, "을")+" "));
      input_selectfocus(input);
    }
    return false;
  }
  return checkInput(input, bJustCheck);
}

/**
 * 대입된 문자가 한글일때 적절한 조사를 선택해준다.
 * @param txt
 * @param josa
 * @return
 */
function getJosa(txt, josa){
  var code = txt.charCodeAt(txt.length-1) - 44032;

  // 원본 문구가 없을때는 빈 문자열 반환
  if (txt.length == 0) return '';

  // 한글이 아닐때
  if (code < 0 || code > 11171) return txt;
  
  if (code % 28 == 0) return txt + get(josa, false);
  else return txt + get(josa, true); 
}

function get(josa, jong) {
    // jong : true면 받침있음, false면 받침없음
    if (josa == '을' || josa == '를') return (jong?'을':'를');
    if (josa == '이' || josa == '가') return (jong?'이':'가');
    if (josa == '은' || josa == '는') return (jong?'은':'는');
    // 알 수 없는 조사
    return '**';
  }   

/**
 * element 최소, 최대값 체크
 * @param v
 * @param min
 * @param max
 * @return
 */
function checkMinMaxVal(v, min, max)
{
  var check = true;
  if ( min != null ) check = v >= min;
  if ( ! check ) return false;
  if ( max != null ) check = v <= max;
  return check;
}

/**
 * element 최소, 최대 바이트 체크
 * @param str
 * @param min
 * @param max
 * @return
 */
function checkMinMaxByteLen(str, min, max)
{
  var v = getByteLength(str);
  return checkMinMaxVal(v, min, max);
}
  
/**
 * 문자열 포매팅
 * @param str
 * @param data_format
 * @param point_count
 * @return
 */
function formatValue(str, data_format, point_count)
{
  if(str == null) return "";
  if(typeof str == "number") str = str.toString();
  
  var rv = "";
  switch ( data_format )
  {
    case "dfDateYy":  rv = formatValueMask(str, "####"); break;
    case "dfDateMm":  rv = formatValueMask(str, "##"); break;
    case "dfDateYmd": rv = formatValueMask(str, "####.##.##"); break;
    case "dfDateYmd1": rv = formatValueMask(str, "####.##.##"); break;
    case "dfDateYm":  rv = formatValueMask(str, "####.##"); break;
    case "dfDateMd":  rv = formatValueMask(str, "##.##"); break;
    case "dfTimeHms": rv = formatValueMask(str, "##:##:##"); break;
    case "dfTimeHm":  rv = formatValueMask(str, "##:##"); break;
    case "dfTimeYmdhms":  rv = formatValueMask(str, "####.##.## ##:##:##"); break;
    case "dfIdNo":    rv = formatValueMask(str, "######-#######"); break;
    case "dfSaupNo":  rv = formatValueMask(str, "###-##-#####"); break;
    case "dfCardNo":  rv = formatValueMask(str, "####-####-####-####"); break;
    case "dfPostNo":  rv = formatValueMask(str, "###-###"); break;
    case "dfCorpNo":  rv = formatValueMask(str, "######-#######"); break;
    case "dfIssueNo": rv = formatValueMask(str, "####-######"); break;
    case "dfNo":      rv = str.replace(/\D/g, ""); break;
    case "dfInteger+":rv = formatComma(str.replace(/\D/g, "")); break;
    case "dfInteger1":rv = formatComma(str.replace(/\D/g, "")); break;
    case "dfInteger":
    {
      var sign = str.substr(0, 1) == "-" ? "-" : "";
      rv = sign + formatComma(str.replace(/\D/g, ""));
    }
    break;
    case "dfFloat+":
    {
      var pointidx = str.indexOf(".");
      var pointbelow = ( pointidx >= 0 ) ? "."+ str.substr(pointidx).replace(/\D/g, "") : "";
      var numvalue = formatComma(str.substr(0, pointidx >= 0 ? pointidx : str.length).replace(/\D/g, ""));
      if ( point_count != null)
      {
        numvalue = numvalue == "" ? "0" : numvalue;
        pointbelow = rpad(pointbelow || ".", point_count+1, "0");
      }
      rv = numvalue + pointbelow;
    }
    break;
    case "dfFloat":
    {
      var sign = str.substr(0, 1) == "-" ? "-" : "";
      var pointidx = str.indexOf(".");
      var pointbelow = ( pointidx >= 0 ) ? "."+str.substr(pointidx).replace(/\D/g, "") : "";
      var numvalue = formatComma(str.substr(0, pointidx >= 0 ? pointidx : str.length).replace(/\D/g, ""));
      if ( point_count != null)
      {
        numvalue = numvalue == "" ? "0" : numvalue;
        pointbelow = rpad(pointbelow || ".", point_count+1, "0");
      }
      rv = sign + (sign && pointbelow && ! numvalue ? "0" : numvalue) + pointbelow;
    }
    break;
    //case "dfEmail":
    default:          rv = str; break;
  }
  return rv;
}

/**
 * element format check
 * @param input
 * @param bShowMsg
 * @return
 */
function checkFormatInput(input, bShowMsg)
{  
  input = returnjQueryObj(input);  
  var check = checkFormatValue(input.val2(), input.attr2("data_format"));
  if ( ! check && bShowMsg )
  {
    alert( (input.attr2("korname") ? input.attr2("korname") + " " : "") + getFormatErrMsg(input.attr2("data_format")));
    input_selectfocus(input);
  }
  return check;
}

/**
 * 문자열 format check
 * @param str
 * @param data_format
 * @param bShowMsg
 * @return
 */
function checkFormatValue(str, data_format, bShowMsg)
{
  var numstr;
  var check = false;
  switch ( data_format )
  {
    case "dfDateYy":  check = /^\d{4}$/.test(str); break;
    case "dfDateMm":
    {
      check = /^\d{2}$/.test(str);
      if ( ! check ) break;
      var mm = Number(str.substr(0, 2));//-1 안함
      check = between(mm, 1, 12);
    }
    break;
    case "dfDateYmd":
    {
      check = /^\d{4}\.\d{2}\.\d{2}$/.test(str);
      if ( ! check ) break;
      numstr = str.replace(/\D/g, "");
      var yy = Number(numstr.substr(0, 4));
      var mm = Number(numstr.substr(4, 2))-1;
      var dd = Number(numstr.substr(6, 2));
      var dt = new Date(yy, mm, dd);
      check = yy == dt.getFullYear() && mm == dt.getMonth() && dd == dt.getDate();
    }
    break;
    case "dfDateYmd1":
    {
      check = /^\d{4}\.\d{2}\.\d{2}$/.test(str);
      if ( ! check ) break;
      numstr = str.replace(/\D/g, "");
      var yy = Number(numstr.substr(0, 4));
      var mm = Number(numstr.substr(4, 2))-1;
      var dd = Number(numstr.substr(6, 2));
      var dt = new Date(yy, mm, dd);
      check = yy == dt.getFullYear() && mm == dt.getMonth() && dd == dt.getDate();
    }
    break;
    case "dfDateYm":
    {
      check = /^\d{4}\.\d{2}$/.test(str);
      if ( ! check ) break;
      numstr = str.replace(/\D/g, "");
      var mm = Number(numstr.substr(4, 2));//-1 안함
      check = between(mm, 1, 12);
    }
    break;
    case "dfDateMd":
    {
      check = /^\d{2}\.\d{2}$/.test(str);
      if ( ! check ) break;
      numstr = str.replace(/\D/g, "");
      var mm = Number(numstr.substr(0, 2));//-1 안함
      var dd = Number(numstr.substr(2, 2));
      check = between(mm, 1, 12);
      if ( ! check ) break;
      return mm == 1 ? between(dd, 1, 31) :
             mm == 2 ? between(dd, 1, 29) ://<--
             mm == 3 ? between(dd, 1, 31) :
             mm == 4 ? between(dd, 1, 30) :
             mm == 5 ? between(dd, 1, 31) :
             mm == 6 ? between(dd, 1, 30) :
             mm == 7 ? between(dd, 1, 31) :
             mm == 8 ? between(dd, 1, 31) :
             mm == 9 ? between(dd, 1, 30) :
             mm ==10 ? between(dd, 1, 31) :
             mm ==11 ? between(dd, 1, 30) :
             mm ==12 ? between(dd, 1, 31) : false;
    }
    //break;
    case "dfTimeHms":
    {
      check = /^\d{2}:\d{2}:\d{2}$/.test(str);
      if ( ! check ) break;
      numstr = str.replace(/\D/g, "");
      var hh = Number(numstr.substr(0, 2));
      var mi = Number(numstr.substr(2, 2));
      var ss = Number(numstr.substr(4, 2));
      check = between(hh, 0, 23) && between(mi, 0, 59) && between(ss, 0, 59);
    }
    break;
    case "dfTimeHm":
    {
      check = /^\d{2}:\d{2}$/.test(str);
      if ( ! check ) break;
      numstr = str.replace(/\D/g, "");
      var hh = Number(numstr.substr(0, 2));
      var mi = Number(numstr.substr(2, 2));
      check = between(hh, 0, 23) && between(mi, 0, 59);
    }
    break;
    case "dfTimeYmdhms":
    {
      check = /^\d{4}\.\d{2}\.\d{2}[ ]\d{2}:\d{2}:\d{2}$/.test(str);
      if ( ! check ) break;
      numstr = str.replace(/\D/g, "");
      var yy = Number(numstr.substr(0, 4));
      var mm = Number(numstr.substr(4, 2))-1;
      var dd = Number(numstr.substr(6, 2));
      var dt = new Date(yy, mm, dd);
      check = yy == dt.getFullYear() && mm == dt.getMonth() && dd == dt.getDate();
      if ( ! check ) break;
      var hh = Number(numstr.substr(8, 2));
      var mi = Number(numstr.substr(10, 2));
      var ss = Number(numstr.substr(12, 2));
      check = between(hh, 0, 23) && between(mi, 0, 59) && between(ss, 0, 59);
    }
    break;
    case "dfIdNo":
    {
      check = /^\d{6}-\d{7}$/.test(str);
      if ( ! check ) break;
      check = checkJuminNo(restoreValue(str, data_format));
      if ( ! check )
      {
        //if ( confirm("주민번호 형식이 맞지 않습니다. 계속 진행하시겠습니까?") ) check = true;
        if ( confirm(ajaxMsg("MSG_CONFIRM_INVALID_PER_NO")) ) check = true;
        else break;
      }
    }
    break;
    case "dfSaupNo":
    {
      check = /^\d{3}-\d{2}-\d{5}$/.test(str);
      if ( ! check ) break;
      check = checkSaupNo(restoreValue(str, data_format));
      if ( ! check )
      {
        //if ( confirm("사업자번호 형식이 맞지 않습니다. 계속 진행하시겠습니까?") ) check = true;
        if ( confirm(ajaxMsg("MSG_CONFIRM_INVALID_SAUP")) ) check = true;
        else break;
      }
    }
    break;
    case "dfCorpNo":  check = /^\d{6}-\d{7}$/.test(str); break;
    case "dfCardNo":  check = /^\d{4}-\d{4}-\d{4}-\d{4}$/.test(str); break;
    case "dfPostNo":  check = (/^\d{3}-\d{3}$/.test(str))||(/^\d{3}-\d{2}$/.test(str)); break;
    case "dfNo":      check = /^\d+$/.test(str); break;
    case "dfInteger+":check = /^0|([1-9]\d*)$/.test(restoreValue(str, data_format)); break;
    case "dfInteger1":check = /^0|([1-9]\d*)$/.test(restoreValue(str, data_format)); break;
    case "dfInteger": check = /^-?(0|([1-9]\d*))$/.test(restoreValue(str, data_format)); break;
    case "dfFloat+":  check = /^(0|([1-9]\d*))(\.\d*)?$/.test(restoreValue(str, data_format)); break;
    case "dfFloat":   check = /^-?(0|([1-9]\d*))(\.\d*)?$/.test(restoreValue(str, data_format)); break;
    case "dfEmail":   check = /^[^@]+@[^@]+$/.test(str);
    default:          check = true; break;
  }
  if ( ! check && bShowMsg )
  {
    alert(getFormatErrMsg(data_format));
  }
  return check;
}

/**
 * 포맷 체크 에러메시지
 * @param data_format
 * @return
 */
function getFormatErrMsg(data_format)
{
  var rv = "";
  switch ( data_format )
  {
    case "dfDateYy":  rv = ajaxMsg("MSG_ALERT_INVALID_FORMAT_YY"); break;
    case "dfDateMm":  rv = ajaxMsg("MSG_ALERT_INVALID_FORMAT_MM"); break;
    case "dfDateYmd": rv = ajaxMsg("MSG_ALERT_INVALID_FORMAT_YMD"); break;
    case "dfDateYmd1": rv = ajaxMsg("MSG_ALERT_INVALID_FORMAT_YMD"); break;
    case "dfDateYm":  rv = ajaxMsg("MSG_ALERT_INVALID_FORMAT_YM"); break;
    case "dfDateMd":  rv = ajaxMsg("MSG_ALERT_INVALID_FORMAT_MD"); break;
    case "dfTimeHms": rv = ajaxMsg("MSG_ALERT_INVALID_FORMAT_HMS"); break;
    case "dfTimeHm":  rv = ajaxMsg("MSG_ALERT_INVALID_FORMAT_HM"); break;
    case "dfTimeYmdhms": rv = ajaxMsg("MSG_ALERT_INVALID_FORMAT_YMDHMS"); break;
    case "dfIdNo":    rv = ajaxMsg("MSG_ALERT_INVALID_FORMAT_IDNO"); break;
    case "dfSaupNo":  rv = ajaxMsg("MSG_ALERT_INVALID_FORMAT_SAUP"); break;
    case "dfCardNo":  rv = ajaxMsg("MSG_ALERT_INVALID_FORMAT_CARD"); break;
    case "dfPostNo":  rv = ajaxMsg("MSG_ALERT_INVALID_FORMAT_POST"); break;
    case "dfCorpNo":  rv = ajaxMsg("MSG_ALERT_INVALID_FORMAT_CORP"); break;
    case "dfNo":      rv = ajaxMsg("MSG_ALERT_INVALID_FORMAT_NO"); break;
    case "dfInteger+":rv = ajaxMsg("MSG_ALERT_INVALID_FORMAT_INT"); break;
    case "dfInteger1":rv = ajaxMsg("MSG_ALERT_INVALID_FORMAT_INT"); break;
    case "dfInteger": rv = ajaxMsg("MSG_ALERT_INVALID_FORMAT_INT_1"); break;
    case "dfFloat+":  rv = ajaxMsg("MSG_ALERT_INVALID_FORMAT_FLO"); break;
    case "dfFloat":   rv = ajaxMsg("MSG_ALERT_INVALID_FORMAT_FLO_1"); break;
    case "dfEmail":   rv = ajaxMsg("MSG_ALERT_INVALID_FORMAT_EMAIL"); break;
    default:          rv = ajaxMsg("MSG_ALERT_INVALID_FORMAT_DEFALUT"); break;
  }
  return rv;
}

/**
 * 포맷 제거한 원 데이터
 * @param str
 * @param data_format
 * @return
 */
function restoreValue(str, data_format)
{
  var rv = "";
  switch ( data_format )
  {
    case "dfDateYy":
    case "dfDateMm":
    case "dfDateYmd":
    case "dfDateYmd1":
    case "dfDateYm":
    case "dfDateMd":
    case "dfTimeHms":
    case "dfTimeHm":
    case "dfTimeYmdhms":
    case "dfIdNo":
    case "dfSaupNo":
    case "dfCardNo":
    case "dfPostNo":  rv = str.replace(/\D/g, ""); break;
    case "dfCorpNo":
    //case "dfNo":
    case "dfInteger+":
    case "dfInteger1":
    case "dfInteger":
    case "dfFloat+":
    case "dfFloat":   rv = str.replace(/,/g, ""); break;
    //case "dfEmail":
    default:          rv = str; break;
  }
  return rv;
}

/**
 * element 의 포맷 안된 원데이터
 * @param input
 * @param data_format
 * @return
 */
// display 용 값이 아닌 DB에 넣을 값을 가져온다.
function getNormalValue(input, data_format)
{
input = returnjQueryObj(input); 
  return restoreValue(input.val2(), data_format || input.attr2("data_format"));
}

/**
 * element value 를 포매팅한다.
 * @param input
 * @param data_format
 * @return
 */
function formatInput(input, data_format)
{
  input = returnjQueryObj(input);
  input.val( formatValue(input.val(), nvl(data_format, input.attr2("data_format"))) );
}

/**
 * element 에 str 을 data_format 에 맞게 세팅한다.
 * @param input
 * @param str
 * @param data_format default 는 input 의 data_format
 * @return
 */
function inputSetFormatValue(input, str, data_format)
{
  input = returnjQueryObj(input);
  input.val( formatValue(str, data_format || input.attr2("data_format")) );
}

/**
 * element 에 포맷에 맞게 값을 세팅
 * @param input
 * @param str
 * @param data_format
 * @param default_value
 * @return
 */
function inputSetValueAuto(input, str, data_format, default_value, deReplaceXssYn)
{
  var orgInput = input;
  input = returnjQueryObj(input);
  if ( input.length == 0 ) alert("inputSetValueAuto: input("+input+","+orgInput+") is not defined...");
  if ( default_value != null && (str == null || str == "")) str = default_value;
  str = String(str);

  if(deReplaceXssYn=="Y")
  {
    str = deReplaceXss(str);
  }
  
  switch ( input.prop("tagName") )
  {
    case "SELECT": input.val(str).attr2("selected", true); break;
    case "INPUT":
    {
      if ( array_indexOf(["radio"], input.attr2("type")  ) >=0 ){
        input.attr("checked", input.val() == str);
      }else if ( array_indexOf(["checkbox"], input.attr2("type")  ) >=0 ){
        input.prop("checked", input.val() == str);
      }else if ( input.attr2("data_format") ){
        inputSetFormatValue(input, str, input.attr2("data_format"));
      }else{
        input.val(str);
      }
    }
    break;
    default: input.val(str); break;
  }

}
  
/**
 * 형식화된 숫자 문자열을 포매팅
 * @param str
 * @param format
 * @return
 */
function formatValueMask(str, format)
{
  var rv = "";
  var numcount = countChr(format, '#');
  str = str.replace(/\D/g, "").substr(0, numcount);
  var chrAt;
  var validx = 0;
  for ( var n = 0; n < format.length; n++ )
  {
    chrAt = format.charAt(n);
    rv += ( chrAt == '#' ) ? str.charAt(validx++) : chrAt;
    if ( validx >= str.length ) break;
  }
  return rv;
}

/**
 * 문자열에서 chr 포함 갯수
 * @param str
 * @param chr
 * @return
 */
function countChr(str, chr)
{
  var count = 0;
  var length = str.length;
  for ( var n = 0; n < length; n++ )
  {
    if ( chr == str.charAt(n) ) count++;
  }
  return count;
}

/**
 * 문자열에서 str 포함 갯수
 * @param str
 * @param chr
 * @return
 */
function countStr(text, str)
{
  var count = 0;
  var start_index = 0;
  var str_length = str.length;
  if ( str_length == 0 ) return null;
  while ( true )
  {
    var find_index = text.indexOf(str, start_index);
    if ( find_index < 0 ) break;
    count++;
    start_index = find_index + str_length;
  }
  return count;
}

/**
 * 숫자 문자열에 ,(콤마)
 * @param numstr
 * @return
 */
function formatComma(numstr)
{
  numstr = deletePrecedingZero(numstr.replace(/\D/g, ""));// 선행하는 zero 를 지운다.
  var rv = "";
  var idx = 0;
  for ( var n = numstr.length - 1; n >= 0; n-- )
  {
    if ( idx != 0 && idx % 3 == 0 ) rv = "," + rv;
    rv = numstr.charAt(n) + rv;
    idx++;
  }
  return rv;
}

/**
 * 주민번호 체크
 * @param numstr
 * @return
 */
function checkJuminNo(numstr)
{
  if ( ! /^\d{13}$/.test(numstr) ) return false;  
  return checkKoreanJuminNo(numstr) || checkForeignJuminNo(numstr);
}

/**
 * 내국인 주민번호 체크
 * @param numstr
 * @return
 */
function checkKoreanJuminNo(numstr)
{
  var cBit = 0;
  var sCode="234567892345";
  for ( var n = 0; n < 12; n++)
  {
    cBit += Number(numstr.charAt(n)) * Number(sCode.charAt(n));
  }
  cBit = 11 - ( cBit % 11);
  cBit = cBit % 10;
  return Number(numstr.charAt(12)) == cBit;
}

/**
 * 외국인 주민번호 체크
 * @param numstr
 * @return
 */
function checkForeignJuminNo(numstr)
{
  var sum=0;
  var odd=0;
  buf = new Array(13);
  for(i=0; i<13; i++) { buf[i] = Number(numstr.charAt(i)); }
  odd = buf[7]*10 + buf[8];
  if(odd%2 != 0) { return false; }
  if( (buf[11]!=6) && (buf[11]!=7) && (buf[11]!=8) && (buf[11]!=9) ) {
    return false;
  }
  var multipliers = [2,3,4,5,6,7,8,9,2,3,4,5];
  for(i=0, sum=0; i<12; i++) { sum += (buf[i] *= multipliers[i]); }
  sum = 11 - (sum%11);
  if(sum >= 10) { sum -= 10; }
  sum += 2;
  if(sum >= 10) { sum -= 10; }
  if(sum != buf[12]) { return false; }
  return true;
}

/**
 * 사업자등록번호 체크
 * @param numstr
 * @return
 */
function checkSaupNo(numstr)
{
  if ( ! /^\d{10}$/.test(numstr) ) return false;
  var sCode = "137137135";
  var sum = 0;
  for ( var n = 0; n < 9; n++)
  {
    sum += Number(numstr.charAt(n)) * Number(sCode.charAt(n));
  }
  sum += parseInt(Number(numstr.charAt(8)) * 5 / 10,10);
  var sidliy = sum % 10;
  var sidchk = ( sidliy != 0 ) ? 10 - sidliy : 0;
  return sidchk == Number(numstr.charAt(9));
}
  
/**
 * 선행하는 0 제거
 * @param numstr
 * @return
 */
function deletePrecedingZero(numstr)
{
  var replaced = numstr.replace(/^0+/, "");
  return numstr && ! replaced ? "0" : replaced;
}

/**
 * 텍스트정렬, 한영입력, 최대글자수제하 스타일 적용
 * @param e
 * @param textAlign
 * @param imeMode
 * @param maxLength
 * @return
 */
function applyStyle(e, textAlign, imeMode, maxLength)
{
  e = returnjQueryObj(e);
  if ( textAlign ) e.css({textAlign: textAlign});
  if ( imeMode ) e.css({imeMode: imeMode});
  if ( maxLength != null )
  {
    e.attr("maxLength", maxLength);
    e.attr("size", maxLength + 2);
  }
}

/**
 * F_ format element 를 자동으로 원래값이 들어간 S_ hidden element 생성
 * @param form
 * @param f
 * @param s
 * @return
 */
function inputAutoUnformat(form, f, s)
{
  form = ($(form).length > 0)? $(form) : $("form").first();
  f = f == null ? "F" : f;
  s = s == null ? "S" : s;
  var f_ = f + "_";
  var s_ = s + "_";
  var s_name;
  
  $("#"+form.prop("id")+" input[id^='" + f_ + "']").each(function(index){
    s_name = s_ + $(this).attr("id").substr(f_.length);  
  
    if($("#" + s_name).length == 0){
    var tmpHidden = $("<input type='hidden' id='" + s_name + "' name='" + s_name + "' />"); 
      form.append(tmpHidden);    
    }

    $("#" + s_name).val(getNormalValue($(this)));      
  });  
  

  //multi-combobox F_ 의 value 가 아닌 val() 를 hidden에 2016.10.13
  $("#"+form.prop("id")+" select[id^='" + f_ + "']").each(function(index){
    
    s_name = s_ + $(this).attr("id").substr(f_.length);  
    if($("#" + s_name).length == 0){
    var tmpHidden = $("<input type='hidden' id='" + s_name + "' name='" + s_name + "' />"); 
      form.append(tmpHidden);    
    }
    $("#" + s_name).val($(this).val());      
  });
}

/**
 * (?)폼의 모든 입력가능한 컨트롤 value를 묶는다. (출력 당시의 입력값들을 모두 저장한다.)
 * @param f
 * @return
 */
function inputElementsValues(f)
{
  f = returnjQueryObj(f);
  var input, str = "";
  
  f.find("input, select, textarea").each(function(i,v) {
    
    input = $(v);
    if ( ! input.attr2("name") ) return true;
    switch ( input.attr2("type") )
    {
      case "button":
      case "image":
      case "submit":
      case "hidden":
      {
        if(input.attr2("name")!="S_DSCLASS" && input.attr2("name")!="S_DSMETHOD" && input.attr2("name")!="S_SAVENAME")
        {
          if(input.attr2("name")!="S_APPL_TYPE" && input.attr2("name")!="S_APPL_ID" && input.attr2("name")!="S_LOGIN_EMP_ID" && input.attr2("name")!="S_APPR_SEQ_NO" && input.attr2("name")!="S_APPL_MODE")
          break;
        }
      }
      case "form":
      case "div":
      case "reset": return true;
    }
    //select-one, text
    str = str + input.attr2("name") + "=" + input.val() + ",";
  });

  str = str.substring(0,str.length-1);
  return str;
}

  function previousSiblings(element) {
    return recursivelyCollect(element, 'previousSibling');
  }
  
   function recursivelyCollect(element, property) {
      element = $(element);
      var elements = [];
      while (element = element[property])
        if (element.nodeType == 1)
          elements.push(Element.extend(element));
      return elements;
    }
   
   function detect(iterator, context) {
      var result;
      this.each(function(value, index) {
        if (iterator.call(context, value, index)) {
          result = value;
          
        }
      });
      return result;
    }
/**
 * 시작일 종료일에 조회기간 세팅
 * @param elem1
 * @param elem2
 * @param options
 * @return
 */
function setYmdPeriod(obj,elem1, elem2, options)
{
    var dv = document.createElement("DIV");
    document.body.appendChild(dv);

    dv.id ="EMP_SCH_LAYER";
    dv.style.width = "300px";
    dv.style.height = "240px";
    dv.style.border = "0";
    dv.style.overflow = "hidden";
    dv.style.zIndex = "1999999";
    dv.style.position = "absolute";
    $(dv).css("margin-top", obj.offset().top + 15);
    $(dv).css("margin-left", obj.offset().left + -5);
    var timeout;
    $(dv).mouseleave(function () {timeout = setTimeout(function () {dv.parentNode.removeChild(dv);}, 500);}).mouseenter(function () {clearTimeout(timeout);});

    var dv00 = document.createElement("DIV");
    dv00.id = "EMP_SCH_LAYER";
    dv00.style.padding = "5px";
    dv00.style.zIndex = "9999";
    dv00.style.position = "absolute";
    dv00.style.overflow = "hidden";
    dv00.style.top = 0;
    dv00.style.left = 0;
    dv.appendChild(dv00);
   
   
  var html = ' <div class="hide_list01">';
      html +=' <iframe style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:-1;" frameborder="0" ></iframe>';
      html +=' <div class="titleLayout"><h3>'+ajaxLabel('period_sel')+'</h3></div>\ ';
      html +='<div class="hide_conWrap" >\ ';
      html +='<div class="hide_con" >\ ';
      html +='<span class="hide_conList"><input type=radio onclick=setPeriod("1W","'+$(obj).attr("id")+'"); ><span>1'+ajaxLabel('week')+'</span></span>\ ';
      html +='<span class="hide_conList"><input type=radio onclick=setPeriod("2W","'+$(obj).attr("id")+'"); ><span>2'+ajaxLabel('week')+'</span></span>\ ';
      html +='<span class="hide_conList"><input type=radio onclick=setPeriod("3W","'+$(obj).attr("id")+'"); ><span>3'+ajaxLabel('week')+'</span></span>\ ';
      html +='<div>\ ';
      html +='<div class="hide_con" >\ ';
      html +='<span class="hide_conList"><input type=radio onclick=setPeriod("1M","'+$(obj).attr("id")+'"); ><span>1'+ajaxLabel('month')+'</span></span>\ ';
      html +='<span class="hide_conList"><input type=radio onclick=setPeriod("2M","'+$(obj).attr("id")+'"); ><span>2'+ajaxLabel('month')+'</span></span>\ ';
      html +='<span class="hide_conList"><input type=radio onclick=setPeriod("3M","'+$(obj).attr("id")+'"); ><span>3'+ajaxLabel('month')+'</span></span>\ ';
      html +='<div>\ ';
      html +='<div class="hide_con last" >\ ';
      html +='<span class="hide_conList"><input type=radio onclick=setPeriod("1Y","'+$(obj).attr("id")+'"); ><span>1'+ajaxLabel('yr')+'</span></span>\ ';
      html +='<span class="hide_conList"><input type=radio onclick=setPeriod("2Y","'+$(obj).attr("id")+'"); ><span>2'+ajaxLabel('yr')+'</span></span>\ ';
      html +='<span class="hide_conList"><input type=radio onclick=setPeriod("3Y","'+$(obj).attr("id")+'"); ><span>3'+ajaxLabel('yr')+'</span></span>\ ';
      html +='</div> '; 
      html +='</div> '; 
      $(dv00).html(html);
}

function setPeriod(period_type,id)
{
  $("#"+id).siblings().each(function(i){
    if(isin($(this).attr("data_format"), "dfDateYmd", "dfDateYmd1"))
    {  
      elem2 = $(this);
    } 
  });
    
  elem2.siblings().each(function(i){
    if(isin($(this).attr("data_format"), "dfDateYmd", "dfDateYmd1"))
    {
      elem1 = $(this);
    } 
   });
   var val2 = getNormalValue(elem2) || date2format(new Date(), 'yyyymmdd');
   var period_gbn = period_type.split('')[1];
   var inc = Number(period_type.split('')[0]);
   var val1 = addYmd(val2, period_gbn, -1*inc);
   
   inputSetValueAuto($(elem1).attr("name"), val1);
   inputSetValueAuto($(elem2).attr("name"), val2);
   $("#EMP_SCH_LAYER").remove();

}


function EmpSimpleListMO(o) 
{
  var pre = o.attr("PRE");
    var src = Page.SKIN_PATH + "/images/emp/" + o.attr("C_CD") + "/" + o.attr("EMP_ID") + ".jpg";
    $("#" + pre + "_si_emp_img").attr("src", src);
    $("#" + pre + "_si_emp_nm").html(o.attr("EMP_NM"));
    $("#" + pre + "_si_org_nm").html(o.attr("ORG_NM"));
    $("#" + pre + "_si_emp_grade_nm").html(o.attr("EMP_GRADE_NM"));
    $("#" + pre + "_si_duty_nm").html(o.attr("DUTY_NM"));
    $("#" + pre + "_si_post_nm").html(o.attr("POST_NM"));
}
        
function EmpSimpleListClick(o) 
{ 
  var pre = o.attr("PRE");
  //사원 기타정보
  var EMP_ETC_DATA = "{BE_ORG_NM : " + "'" + o.attr("ORG_NM") + "', " +
    "BE_EMP_GRADE_NM : " + "'" + o.attr("EMP_GRADE_NM") + "', " + 
    "BE_DUTY_NM : " + "'" + o.attr("DUTY_NM") + "', " +
    "BE_POST_NM : " + "'" + o.attr("POST_NM") + "'," +
    "BE_EMP_TYPE_NM : " + "'" + o.attr("EMP_TYPE_NM") + "'," +
    "BE_ENTER_YMD : " + "'" + o.attr("ENTER_YMD") + "'," +
    "BE_RETIRE_YMD : " + "'" + o.attr("RETIRE_YMD") + "'," +
    "BE_STAT_NM : " + "'" + o.attr("STAT_NM") + "'" + "}";
  
  $("#Q_EMP_ETC_DATA").val(EMP_ETC_DATA);
  
  $("#" + pre + "_C_CD").val(o.attr("C_CD"));
  $("#" + pre + "_EMP_ID").val(o.attr("EMP_ID"));
  $("#" + pre + "_EMP_NM").val(o.attr("EMP_NM"));
  $("#" + pre + "_EMP_SCH_LAYER").mouseleave();
  if(eval("window."+$("#" + pre + "_EMP_NM").attr("AFTER_FUNC"))!=undefined){
    eval($("#" + pre + "_EMP_NM").attr("AFTER_FUNC"))();
  }
}
    
function OrgSimpleListClick(o) 
{
  var pre = o.attr("PRE");
  $("#" + pre + "_ORG_ID").val(o.attr("ORG_ID"));
  $("#" + pre + "_ORG_NM").val(o.attr("ORG_NM"));
  $("#" + pre + "_ORG_SCH_LAYER").mouseleave();
  $("#" + pre + "_ORG_NM")[0].data.ORG_ID = $("#" + pre + "_ORG_ID").val();
  if($("#" + pre + "_ORG_NM").attr("ondata") != undefined)
  {
    setTimeout(function(){eval($("#" + pre + "_ORG_NM").attr("ondata"));}, 500);
  }
}

function checkExcelEmpId(obj, col)
{
  var array = [];
  var array2 = [];
  sheetEachRow(obj, function(r, x)
  {
    array.push(x.GetCellValue(r, col));
    array2.push(r);
  });
  if ( array.length )
  {
  var emp_ids = array.join(",");
  }
  
  ajaxRequestXSProg(commonOtpVal.biz.sys.Sys_common, commonOtpVal.CheckExcelEmpId, {S_EMP_IDS: emp_ids}, function(xs)
  {
  var no_emp_id = xs.GetEtcData("NO_EMP_ID");
  if( no_emp_id != "" )
  {
    alert(ajaxMsg("MSG_ALERT_NO_EMP_ID") + "[" + no_emp_id + "]");
  }
  });
}

//콤보에 만들어진 option을 모두 없앤다.
function clearCombo(comboObj)
{
  if ( comboObj == null ) alert("Error: setCombo comboObj("+comboObj+") is null");
  comboObj = typeof comboObj == "string" ? $(comboObj) : comboObj;
  for(var i=comboObj.options.length; i>0;i--)
  {
    comboObj.remove( comboObj.options[i] );
  }
}

var TabUtil = {
/**
  * 탭을 제외한 탭 으로 구성된 화면에서의 스크롤이동
  * @param elem   : element
  * @param dir     : 구분자
  * @param prev   : 이전
  * @param next   : 다음
  * @return
  */
  tabScroll : function(elem, dir){
    var $tabUl = elem;
    var scrollLeft = $tabUl.scrollLeft();
    var addWidth = 0;
    $tabUl.children().each(function(idx, elem){
      addWidth +=  elem.clientWidth;
      if(dir.match(new RegExp("^prev")) && scrollLeft <= addWidth) {
        $tabUl.scrollLeft( addWidth - elem.clientWidth);
        return false;
      } else if (dir.match(new RegExp("^next")) && scrollLeft < addWidth) {
        $tabUl.scrollLeft(addWidth);
        return false;
      }
    });
    //탭 화살표의 활성화 표시
    TabUtil.tabActive($tabUl,"click");
  },

 /**
  * 활성화되어 있는 탭의 위치를 찾아간다.
  * @param elem   : element
  * @param dir     : 구분자
  * @param prev   : 이전
  * @param next   : 다음
  * @return
  */
  tabAutoMove : function(elem, dir){
    var $tabUl = elem;
    var displayWidth = $tabUl[0].clientWidth; //화면에 보여지는 가로
    var scrollLeft = $tabUl.scrollLeft();         //좌측길이
    var allWidth = 0;         //탭 구성영역의 전체 가로폭을 구한다.
    var selectWidth = 0;     //선택된 영역의 가로폭
    var selectStaPoint = 0;  //선택된 영역의 시작점
    $tabUl.children().each(function(idx, elem){
      if ($(this).attr("class") == "on") {
        selectStaPoint = allWidth;
        selectWidth = $(this)[0].clientWidth;
      }
      allWidth +=  $(this)[0].clientWidth;
    });

    //console.log("03 ==>  displayWidth: " , displayWidth + " /  scrollLeft :"+scrollLeft + " /  allWidth :"+allWidth + " /  selectWidth :"+selectWidth + " /  selectStaPoint :"+selectStaPoint );

    if (displayWidth <= (selectStaPoint + selectWidth)) {
      $tabUl.scrollLeft( (selectStaPoint + selectWidth) - displayWidth);
    }
    //탭 화살표의 활성화 표시
    TabUtil.tabActive($tabUl,"click");
  },

  /**
  * 탭 좌우 화살표 활성화
  * @param elem   : element
  * @param dir     : 구분자
  * @param first    : 최초의 활성화 상태
  * @param click   : 버튼이 클릭된 후 화살표의 활성화 상태
  */
  tabActive : function(elem, dir) {
    var $tabUl = elem;
    var $tab = $tabUl.parent();

    //탭 구성영역의 전체 가로폭을 구한다.
    var clientWidth = 0;
    $tabUl.children().each(function(idx, elem){
      clientWidth +=  elem.clientWidth;
    });

    if (dir == "first") {
      if ($tabUl.width() <= clientWidth) {
        $tab.find(".next").addClass("on");
      }
    }

    if (dir == "click") {
      //우측에 숨겨진 폭을 구한다.
      var rightWidth = clientWidth - $tabUl.width();
      if ($tabUl.scrollLeft() > 0) {
        $tab.find(".prev").addClass("on");
      } else {
        $tab.find(".prev").removeClass("on");
      }
  
      //우측의 숨겨진 폭이 왼쪽의 폭보다 작거나 같으면 next 버튼 비활성화
      if (rightWidth <= $tabUl.scrollLeft()) {
        $tab.find(".next").removeClass("on");
      } else {
        $tab.find(".next").addClass("on");
      }
    }
  }
  ,Check : {
      init : function(){
        $(document.body).attr("ISUPDATED", false);
        var arrInputs = $("INPUT[type=text],TEXTAREA,SELECT");
        arrInputs.bind("change",function(){
          if($(this).attr("tabCheck")==undefined || ($(this).attr("tabCheck")).toUpperCase()!="FALSE")
          {
            $(document.body).attr("ISUPDATED", true);
          }
        });
      }
     ,isUpdated : function(){
        return $(document.body).attr("ISUPDATED");
      }
     ,reset : function(){
        $(document.body).attr("ISUPDATED", false);
      }
     ,update : function(){
        $(document.body).attr("ISUPDATED", true);
     }
   }
};

//modal layer start
var ModalUtil = {
  _top : window.ehrTopFrame || top
  ,init : function()
  {
    this._top.ModalDialog.topFrame = null;              //최상위 Frame - Window Object
    this._top.ModalDialog.width = 300;                  //Default Width
    this._top.ModalDialog.height = 300;                 //Default Height
    this._top.ModalDialog.$layer = null;                //Modal Dialog Background Layer - jQuery Object
    this._top.ModalDialog.iframeError = false;          //Modal iframe에서 호출한 페이지가 에러가 나거나 resize 함수를 호출하지 않았을때 여부

  }
  /**
   * Open
   * @param winobj : modal을 호출하는 window object 모달을 호출하는 window 는 실제로 hunel.jsp 가 된다.
   * @param options
   *   - title : 제목 (string)
   *   - url   : iframe에 호출할 url (string)
   *   - param : iframe에 전송할 파라미터 (json)
   *   - width : resize를 하지 않았을 때 width 값 (int)
   *   - height : resize를 하지 않았을 때 height 값 (int)
   * @param returnFn : modal에서 return value 값을 갖고 실행할 funtion
   * @param closeFn : modal에서 return value 값 없이 닫기 이후에 실행할 funtion     
   * @param winOpener : 팝업을 호출하는 곳에서 자신의 form태그 전체를 보내고 싶을때 사용
   */
  ,open : function(options, returnFn, closeFn, winObj, winOpener)
    {
      if( (window.ehrTopFrame||top).returnFunction == null ) (window.ehrTopFrame||top).returnFunction = [];
      if( (window.ehrTopFrame||top).closeFunction == null ) (window.ehrTopFrame||top).closeFunction = [];
      if( (window.ehrTopFrame||top).winOpener == null ) (window.ehrTopFrame||top).winOpener = [];
      if( (window.ehrTopFrame||top).lastPopIndex == null ) (window.ehrTopFrame||top).lastPopIndex = -1;
      if( (window.ehrTopFrame||top).bLastPop == null ) (window.ehrTopFrame||top).bLastPop =false;
      
      var $layer = this._top.$("#ModalLayer");

      // main에 ModalLayer 가 있는 경우 삭제한다.
      if($layer.length != 0) $layer.remove();
        
      this._top.$("body").append('<div tabindex="-1" class="ModalLayer" id="ModalLayer" style="min-width:1145px;min-height:750px; left: 0px; top: 0px; width: 100%; height: 100%; display: none; position: absolute; z-index: 900; opacity: 0.3; background-color: rgb(0, 0, 0);"></div>');
    
      options = options || {};
      $collect = this._top.$(".ModalPop");
      $collect.each(function(){
       $(this).css("z-index",$(this).css("z-index") - 3); 
      });

      var tmpId = (new Date()).getTime() + $collect.length; //collect(팝업순서제어) 를 위해 필요한 id 값을 생성한다.
      
      var width, height, extYn; //외부페이지열때는 3개 값들이 있어야 함

      if(options.width && options.height){
        width = options.width;
        height = options.height;
      }else{
        width = this._top.ModalDialog.width;
        height = this._top.ModalDialog.height;

        setTimeout(function(){ ModalUtil.onError();}, 3000);
      }
      extYn = options.extYn || "N";   //외부페이지열때는 Y로 넘어와야함
      
      //var pos = _top.ModalDialog.position( width, height); //중앙의 위치를 잡는다.
      
      if(width==undefined) width = "300";
      if(height==undefined) height = "300";
      
      var nFirstTop   = (this._top.document.body.clientHeight / 2) - 150;
      var nFirstLeft  = (this._top.document.body.clientWidth / 2) - 150;
      
      var $body = this._top.$("body:first");
      var $div = ModalUtil.tagCreate("div",{"class":"ModalPop"}, {"display":"none", "position":"absolute",  "width":+width+"px;", "height":+height + "px", "top":+nFirstTop+"px", "left":+nFirstLeft+"px", "z-index":"901", "padding":"0px" });
      
      $div.innerHTML = "<div class='modalPop'>"
          +"    <span class='modalTitle'>" + ((options.title)? options.title:"") + "</span>"
          +"    <span id='layerClose' class='layerClose' onClick='ModalUtil.close()' title='다이얼로그창 닫기'></span>"
          +"  </div>"  
          +"  <div class='modalCon'>"
          +"    <div style='background:#FFFFFF;width:100%;height:100%;display:none;filter:alpha(opacity=50); opacity:0.5;position:absolute;z-index:90;left:0;top:0;'></div>"
          +"    <iframe id='dialogframe_" + tmpId + "' extyn='" + extYn + "' popsection name='dialogframe_" + tmpId + "' frameborder='0' src='about:blank' width='100%' height='100%' ></iframe>"
          +"  </div>";
          +"</div>";
      
      //layer resize and drag
      if(options.resizable == undefined || options.resizable == true)
      {
        this._top.$($div).resizable({
          iframeFix:true
        , containment:"parent"
        , aspectRatio:false
        , minWidth:300
        , minHeight:300
        , disabled:false
        , handles:"n, e, s, w, se"
        , alsoResize:".modalCon:last"
        , start:function(event,ui){
          $(this).find("iframe").prev().css("display","");
          }
              , stop:function(event,ui){
                $(this).find("iframe").prev().css("display","none");
                }
              });
      }
      this._top.$($div).draggable({
                    containment:"parent"
                  , handle:".modalTitle"
                  , opacity:"0.5"
                  , delay:100
                  , scrollSensitivity:1
                  , scrollSpeed:100
                  , iframeFix:true
                  , revert:false});

      $body.append($div);
      
      $collect = this._top.$(".ModalPop");
      var nPop = $collect.length;
      
      if(returnFn)
      {
        (window.ehrTopFrame||top).returnFunction[nPop-1] = returnFn;
    }else{
      (window.ehrTopFrame||top).returnFunction[nPop-1] = null;
    }
      
      if(winOpener)
      {
        (window.ehrTopFrame||top).winOpener[nPop-1] = winOpener;
    }else{
      (window.ehrTopFrame||top).winOpener[nPop-1] = window;
    }
      
      var opener = ModalUtil.getOpener();
      if(opener.ModalUtil.onOpen!=undefined && typeof opener.ModalUtil.onOpen == "function")
      {
        opener.ModalUtil.onOpen();
      }
      
    if(closeFn)
    {
      (window.ehrTopFrame||top).closeFunction[nPop-1] = closeFn;
    }else{
      (window.ehrTopFrame||top).closeFunction[nPop-1] = null;
    }
    
    ModalUtil.showLayer();   

      ModalUtil.popOpen({name: "dialogframe_" + tmpId, url: options.url, param: options.param || options.parameters}, winObj );
      if(options.width && options.height){
        ModalUtil.resize({width:width, height:height});
      }
      (window.ehrTopFrame||top).bLastPop =true;
    }
  ,popOpen : function(option, winObj)
  {
    winObj = winObj || window;
    // 권한...세팅 start
    var param = option.param || {};
    var winPage = winObj.Page;
    if ( winPage )
    {
      param.X_PROFILE_ID = param.X_PROFILE_ID || winPage.PROFILE_ID;
      param.X_MODULE_ID = param.X_MODULE_ID || winPage.MODULE_ID;
      param.X_MENU_ID = param.X_MENU_ID || winPage.MENU_ID;
      param.X_PGM_ID = param.X_PGM_ID || winPage.PGM_ID;
      param.X_SQL_ID = param.X_SQL_ID || winPage.SQL_ID;
      param.X_EMP_SCH_AUTH_CD = param.X_EMP_SCH_AUTH_CD || winPage.EMP_SCH_AUTH_CD;
      param.X_MENU_NM = param.X_MENU_NM || "";
      param.X_PGM_URL = param.X_PGM_URL || winPage.PGM_URL;
      param.X_POP_URL = option.url;
      param.X_ENC_VAL = param.X_ENC_VAL || winPage.ENC_VAL;
      param.X_ENC_VAL2 = param.X_ENC_VAL2 || winPage.ENC_VAL2;
      param.X_HELP_PGM_ID = param.X_HELP_PGM_ID || winPage.HELP_PGM_ID;
      if ( ehrTopFrame._LOGIN_INFO ) param.X_LOGIN_INFO = ehrTopFrame._LOGIN_INFO;// for security
    }
    // 권한...세팅 end
    submit2({target: option.name, action: "/menuAction.do"}, param);
  }

    , onError : function()
    {
      if(this._top.ModalDialog.iframeError){
        ModalUtil.resize();
      }
    }
   
   /**
    * Modal Dialog Resize
    * @param options - width, height
    */
    , resize : function(options)
    {
      $collect = this._top.$(".ModalPop");
      if($collect.length == 0) return;
      
      //20130425 options 값이 없으면 전체창 크기로 변경
      //options = options || {width: this.width, height: this.height};
      var $modal = $collect[$collect.length-1];

      var tWidth = $(this._top).width();    //창너비
      var tHeight = $(this._top).height();     //창높이

      options = options || {width: tWidth, height: tHeight};
      
      options.width = (options.width >= tWidth ? tWidth : options.width) || this._top.ModalDialog.width;
      options.height = (options.height >= tHeight ? tHeight : options.height) || this._top.ModalDialog.height;
      
      var pos = ModalUtil.position(options.width, options.height);

      $modal.style.width = options.width+"px";
      $modal.style.height = options.height+"px";
      $modal.style.top = pos.top+"px";
      $modal.style.left = pos.left+"px";
      
      $modal.children[1].style.width  = ( options.width - 30 )+"px";
      $modal.children[1].style.height = ( options.height - 65 )+"px";

      this._top.ModalDialog.iframeError = false;
      
      displayElement(this._top.$(".ModalPop"), true);
    }
    , position : function(width, height)
    {
        var $body = this._top.document.body;

        var tHeight = $body.clientHeight;
        var tWidth = $body.clientWidth;
        
        var top = (tHeight/2) - (height/2);
        var left = (tWidth/2) - (width/2);

        if (top < 0) top = 0;
        return {top: top, left: left};
    }
   
   /**
    * Modal Dialog Close
    * @param rv - Return Value
    */
    , close : function(rv, retFun)
    {
      
      var opener = (ModalUtil.getOpener()==null)?window:ModalUtil.getOpener();
      if(opener.ModalUtil.onClose!=undefined && typeof opener.ModalUtil.onClose == "function")
      {
        opener.ModalUtil.onClose();
      }
      
      var $collect = this._top.$(".ModalPop");
      var $modal = $collect[$collect.length - 1];
      var nPop = $collect.length;
      
      var returnFunction = null;
      var closeFunction = null;

      if(retFun){
        returnFunction = (window.ehrTopFrame||top).returnFunction[nPop-1];
        closeFunction  = (window.ehrTopFrame||top).closeFunction[nPop-1];
      }else{
        closeFunction = (window.ehrTopFrame||top).closeFunction[nPop-1];
      }
      
      if( (window.ehrTopFrame||top).lastPopIndex == (nPop-1) && !(window.ehrTopFrame||top).bLastPop ){
        setTimeout(function(){ ModalUtil.close(rv, retFun); } , 200);
        return;
      }
      
      if(returnFunction) { returnFunction(rv);}
      if(closeFunction)  { closeFunction(rv); }

      if((nPop-1) != 0){
        (window.ehrTopFrame||top).lastPopIndex = (nPop-1);
      }else{
      (window.ehrTopFrame||top).lastPopIndex = -1;
      }
      (window.ehrTopFrame||top).bLastPop =false;
      
      setTimeout(function(){
        ModalUtil.hideLayer();
        var $targetFrame = $($modal).find("iframe");
        $targetFrame.purgeFrame();
        $modal.parentNode.removeChild($modal);
        (window.ehrTopFrame||top).lastPopIndex = -1;
        },100);
      
    }
   , tagCreate : function (tag, attr, css) 
   {
       var obj = this._top.document.createElement(tag);
       for(var key in attr) {
           $(obj).attr(key,attr[key]);
         }; 
       for(var key in css) {
           $(obj).css(key,css[key]);
         }; 
       return obj;
    }
   , hideLayer : function(fn)
   {
     var $layer    = this._top.$("#ModalLayer");
     var $collect = this._top.$(".ModalPop");
     
     if($collect.length > 1){ //Modal
       $collect.each(function(){
         var $modal = $(this);
         $modal.css("z-index" , Number($modal.css("z-index")) + 3);
       });
    
       if(fn) fn();
     }
     else
     { //Alert, Confirm
        $layer.css("opacity", 0);
        $layer.css("filter", "alpha(opacity=0)");
        $layer.css("zIndex", -999);
        $layer.css("display", "none");
  
        if(fn) fn();  
     }
     
    //rd가 있다면 보이게하기
     var topRd = this._top.$("iframe[extyn!='Y']"); 
     if((topRd != null) && (topRd != undefined))
     {
       if((topRd.contents() != null) && (topRd.contents() != undefined))
       {
         topRd.contents().find("object").each(function(){
           if($(".ModalPop").length == 1 && $(this).css("visibility") == "hidden")
           {
             $(this).css("visibility", "visible");
           }
         });
       }
     }
   }
   , showLayer : function(fn)
   {
     //화면에 RD가 있으면 안보이게 한 후 팝업띄움
     
     $("object").each(function(){
       if($(this).attr("data") == null || $(this).attr("data").indexOf("silverlight") <= 0)
       {
         $(this).css("visibility", "hidden");
       }
       }); 
     var $body = this._top.$("body");
       var $layer = this._top.$("#ModalLayer");
       $layer.css("display", "block");
       $layer.css("zIndex", 900);
       $layer.css("width", "100%");//$body.clientWidth;
       $layer.css("height", "100%");// $body.clientHeight;
       $layer.css("BackgroundColor", "#000000");
       $layer.css("opacity", "0.3");
       $layer.css("filter", "alpha(opacity=30)");
   }
   , returnValue : function(rv){
       ModalUtil.close(rv, true);
   }
   /**
    * Modal Dialog setCloseFn
    * @param rv - Return Value
    * layer 창을 닫는순간 callback 함수 호출시 rv값 불러옴(파일업로드시 사용함)
    */
   , setCloseFn : function(rv){
     var $collect = this._top.$(".ModalPop");
       var $modal = $collect[$collect.length - 1];
     var $close = $modal.children[0].children[1];
     
     if($($close).attr("onClick") != undefined)
     {
       $($close).removeAttr("onClick");
       $($close).click(function(e){
         ModalUtil.close(rv);
       }); 
     }
  }
   ,getOpener : function(){
     $collect = this._top.$(".ModalPop");
     var rtn;
     if($collect.length>1)
     {
       rtn = (window.ehrTopFrame||top).winOpener[$collect.length-1];
     }
     else if($collect.length == 1)
     {
       rtn = (window.ehrTopFrame||top).winOpener[0];
     }
     else
     {
       rtn = null;
     }
     return rtn;
   }
};

if( window.ehrTopFrame.ModalDialog == undefined){
  window.ehrTopFrame.ModalDialog = {};
}
if( window.ehrTopFrame.ModalDialog.isCreated == undefined ) ModalUtil.init();

var _isPopup = (window.frameElement != null && window.frameElement.getAttributeNode("popsection") != null)?true:false;

//modal layer end

/**
 * 쿼리스트링을 JSON형태로 변환함
 * @param queryStr
 * @param separator
 * @return
 */
function toQueryParams(queryStr, separator)
{
  var str = {};
  separator = nvl(separator,"&");

  str = queryStr.split(separator);
  var o = {};

  $(str).each(function (i, v) {
    v = v.split("=");
    var key = v[0];
    var value = {};
    value = decodeURIComponent(v[1]||"");
    
    if (o[key] !== undefined)  {
      if (!o[key].push) o[key] = [o[key]]; 
      o[key].push(value); 
    }
    else o[key] = value; 
  });

  return o;
}

function toJsonString(obj)
{
  var order = "";
  var hash = "";
  var hash2 = "";
  var retVal = "";
    for(var i in obj) 
    {
      if(i != "__viewState" && i != "undefined")
      {
        order += i + ",";
        hash += (obj[i] == undefined ? "" : encodeURIComponent(String(obj[i]).replace(/ |,|\s/gi, "")).replace(/\W/gi,"").replace("　",""));
      }
    }
    retVal = "{\"order\":\"" + order + "\", \"hash\":\"" + calcHash(hash) + "\", \"test\":\"" + hash + "\"}";
    return retVal;
}

function calcHash(hashInput) 
{
  try 
  {
    var hashRounds = 3;
    var hashOutputType = "HEX";
    var hashObj = new jsSHA("SHA-256", "TEXT", {numRounds: parseInt(hashRounds, 10)});
    hashObj.update(hashInput);
    return hashObj.getHash(hashOutputType);
  } 
  catch(e) 
  {
    alert(e.message);
  }
}

/**
 * json을 qurey string 로 변환
 * @param json
 * @return
 */
function serializeJson(json)
{
  var str = "";
  
  $.each(json, function (k,v) {
    str += "&"+k+"="+v;
  });
  
  return str;
}

/**
 * element 또는 배열 값 리턴 (_each 에서 사용)
 * @param obj     : element 또는 배열 object
 * @param value   : element 또는 배열 value
 * @return
 */
function objVal(obj, value)
{
  return  ((obj+"").indexOf("Element") > 0) ? $(obj)._val() : value;
}

/**
 * 가장 큰 값
 * @param obj     : element 또는 배열 object
 * @return
 */
function arrayMax(obj)
{
  var max = null,
      value = null;
  $(obj)._each( function(index, value){
    value = objVal(this, value) ;
    max = value >= max ? value : max;
  });
  return max;  
}

/**
 * 가장 작은 값
 * @param obj     : element 또는 배열 object
 * @return
 */
function arrayMin(obj)
{
  var min = null;
  $(obj)._each( function(index, value){
    value = objVal(this, value) ;
    if(index === 0)  min = value;
    else min = (value <= min) ? value : min;
  });
  return min;  
}


/**
 * 프로세스의 조회조건을 세션으로 관리하기 위함.
 * 
 * !!필요조건!!
 * - 태그에 sessionCondition 속성 필요
 * - 태그에 korname 속성 필요
 * - selectbox, input[Text]
 */
var SessionConditionUtil = {
  init : function()
  {
    //레이어 hover event
    $("#OPTION_BUTTON").bind("mouseover",function(e){
      $("#OPTION_LIST").show();
    });
    //세션조건 리스트 조회
    var moduleId = Page.MODULE_ID;
    
    var ehrTopFrame = (window.ehrTopFrame||top);
    if( ehrTopFrame.SessionCondition == null || ehrTopFrame.SessionCondition == undefined )
    {
      console.log("SessionCondition is null");
      return;
    }
    
    var objSessionCondition = ehrTopFrame.SessionCondition;
    
    //console.log(objSessionCondition);
    //if()
    var objModule = objSessionCondition[moduleId];
    //console.log(objModule);
    for(key in objModule){
      if(typeof(objModule[key]) === "object")
      {
        //console.log("key type:"+typeof(objModule[key]));
        var S_ID = objModule[key].S_ID;
        var S_KOR_NAME = objModule[key].S_KOR_NAME;
        var S_MODULE_ID = objModule[key].S_MODULE_ID;
        var S_TAG_TYPE = objModule[key].S_TAG_TYPE;
        var S_TEXT = objModule[key].S_TEXT;
        var S_VALUE = "";
        if(typeof(objModule[key].S_VALUE) === "object")
        {
          var array = objModule[key].S_VALUE;
          for(var i=0; i<array.length; i++)
          {
            if(i != 0)
            {
              S_VALUE += ",";
            }
            S_VALUE += array[i];
          }
        }
        else
        {
          S_VALUE = objModule[key].S_VALUE;
        }
        
        if(S_TAG_TYPE == "SELECT")
        {
          $(document).find("#OPTION_LIST ul").append("<li colName="+S_ID+" colValue="+S_VALUE+" colText="+S_TEXT+"><span class='floatL session_text'>"+S_KOR_NAME+" : "+S_TEXT+" : "+S_VALUE+"</span><span class='btnR_close' onClick=\"SessionConditionUtil.close(this,'"+S_ID+"','"+S_MODULE_ID+"');\"><img src='/resource/images/main/sche_write_close.gif' /></span></li>");
        }
        else
        {
          var liText = "";
          if(S_TEXT != "")
          {
            liText = S_KOR_NAME+" : "+S_VALUE+" : "+S_TEXT;
          }
          else
          {
            liText = S_KOR_NAME+" : "+S_VALUE;
          }
          
          $(document).find("#OPTION_LIST ul").append("<li colName="+S_ID+" colValue="+S_VALUE+" colText="+S_TEXT+"><span class='floatL session_text'>"+liText+"</span><span class='btnR_close' onClick=\"SessionConditionUtil.close(this,'"+S_ID+"','"+S_MODULE_ID+"');\"><img src='/resource/images/main/sche_write_close.gif' /></span></li>");
        }
      }
    }
  }
  ,hideLayer : function() {
    $("#OPTION_LIST").css("display", "none");
  }
  ,add : function(tagId, moduleId)
  {
    var tagId = tagId;
    var tagKorName = $("#"+tagId).attr("korname");
    var tagText = "";
    var tagValue = "";
    var tagType = $("#"+tagId)[0].tagName;
    if(tagType == "SELECT")
    {
      tagText = $("#"+tagId+" option:selected").text();
      if($("#"+tagId).attr("multiple") == "multiple")
      {
        tagValue = $("#"+tagId).val();
      }
      else
      {
        tagValue = $("#"+tagId+" option:selected").val();
      }
      
      //동일한 조회조건이 이미존재하면 수정, 아니면 추가
      /*
      if(tagValue == "")
      {
        return;
      }
      */
      if($(parent.document).find("#OPTION_LIST ul li").is("[colName="+tagId+"]"))
      {
        $(parent.document).find("#OPTION_LIST ul li[colName="+tagId+"]").attr("colValue",tagValue).attr("colText",tagText).html("<span class='floatL session_text'>"+tagKorName+" : "+tagText+" : "+tagValue+"</span><span class='btnR_close' onClick=\"SessionConditionUtil.close(this,'"+tagId+"','"+moduleId+"');\"><img src='/resource/images/main/sche_write_close.gif' /></span>");
      }
      else
      {
        $(parent.document).find("#OPTION_LIST ul").append("<li colName="+tagId+" colValue="+tagValue+" colText="+tagText+"><span class='floatL session_text'>"+tagKorName+" : "+tagText+" : "+tagValue+"</span><span class='btnR_close' onClick=\"SessionConditionUtil.close(this,'"+tagId+"','"+moduleId+"');\"><img src='/resource/images/main/sche_write_close.gif' /></span></li>");
      }
    }
    else if(tagType == "INPUT")
    {
      if($("#"+tagId).attr("type") == "text")
      {
        tagValue = $("#"+tagId).val();
      
        if(tagValue == "")
        {
          return;
        }
      
        var liText = "";
        var n = tagId.indexOf("ORG_NM") + tagId.indexOf("EMP_ID");
        var tagId2 = "";
        if(n > 0)
        {
          if(tagId.indexOf("ORG_NM") > 0)
          {
            tagId2 = tagId.substr(0,n)+"_ORG_ID";
          }
          else if(tagId.indexOf("EMP_ID") > 0)
          {
            tagId2 = tagId.substr(0,n)+"_EMP_NM";
          }
        
          if($("#"+tagId2).length > 0)
          {
            tagText = $("#"+tagId2).val();
            if(tagText != "")
            {
              liText = tagKorName+" : "+tagValue+" : "+tagText;
            }
          }
        }
      
        if(liText == "")
        {
          liText = tagKorName+" : "+tagValue;
        }
      }
      else if($("#"+tagId).attr("type") == "checkbox")
      {
        tagValue = $("#"+tagId).is(":checked")?"Y":"N";
        liText = tagKorName+" : "+tagValue;
      }
      
      //동일한 조회조건이 이미존재하면 수정, 아니면 추가
      if($(parent.document).find("#OPTION_LIST ul li").is("[colName="+tagId+"]"))
      {
        $(parent.document).find("#OPTION_LIST ul li[colName="+tagId+"]").attr("colValue",tagValue).attr("colText",tagText).html("<span class='floatL session_text'>"+liText+"</span><span class='btnR_close' onClick=\"SessionConditionUtil.close(this,'"+tagId+"','"+moduleId+"');\"><img src='/resource/images/main/sche_write_close.gif' /></span>");
      }
      else
      {
        $(parent.document).find("#OPTION_LIST ul").append("<li colName="+tagId+" colValue="+tagValue+" colText="+tagText+"><span class='floatL session_text'>"+liText+"</span><span class='btnR_close' onClick=\"SessionConditionUtil.close(this,'"+tagId+"','"+moduleId+"');\"><img src='/resource/images/main/sche_write_close.gif' /></span></li>");
      }
    }
    
    $(parent.document).find("#OPTION_LIST").show();
    setTimeout(function(){$(parent.document).find("#OPTION_LIST").hide( "slow" );}, 1000);
    
    //window.ehrTopFrame.SessionCondition에 조건을 담아둠
    if( (window.ehrTopFrame||top).SessionCondition == null )
    {
      console.log("SessionCondition 초기화");
      (window.ehrTopFrame||top).SessionCondition = {};
    }
    
    var obj = {S_ID:tagId, S_VALUE:tagValue, S_TEXT:tagText, S_MODULE_ID:moduleId, S_TAG_TYPE:tagType, S_KOR_NAME:tagKorName};
    
    var $objSessionCondition = $(window.ehrTopFrame.SessionCondition);
    
    if($objSessionCondition.attr(moduleId) == undefined)
    {
      $objSessionCondition.attr(moduleId,{});
    }
    
    var $objModule = $($objSessionCondition.attr(moduleId));
    $objModule.attr(tagId,obj);
    SessionConditionUtil.checkPayrollComponent(tagId, moduleId, "add");
  }
  ,close : function(obj,tagId,moduleId)
  {
    var $objSessionCondition = $(window.ehrTopFrame.SessionCondition);
    var objModule = $objSessionCondition.attr(moduleId);
    
    eval("delete objModule."+tagId+";");
    
    SessionConditionUtil.checkPayrollComponent(tagId, moduleId, "close", $(obj).parent().parent());
    $(obj).parent().remove();
  }
  /**
   * 급여일조회조건이 세션에 저장되면 년도, 급여영역도 같이 셋팅해주기 위함
   * 세션에서 급여년도 가 삭제되면 급여영역, 급여일도 삭제하기 위함
   */
  ,checkPayrollComponent : function(tagId, moduleId, eventName, $obj)
  {
    if(eventName == "add")
    {
      if(tagId.indexOf("_PAYROLL_NO") > -1)
      {
        var index = tagId.indexOf("_PAYROLL_NO");
        var prefix = tagId.substr(0,index);
        SessionConditionUtil.add(prefix+"_PAY_AREA_CD", moduleId);
      }
      else if(tagId.indexOf("_PAY_AREA_CD") > -1)
      {
        var index = tagId.indexOf("_PAY_AREA_CD");
        var prefix = tagId.substr(0,index);
        SessionConditionUtil.add(prefix+"_YY", moduleId);
      }
    }
    else if(eventName == "close")
    {
      if(tagId.indexOf("_YY") > -1)
      {
        var index = tagId.indexOf("_YY");
        var prefix = tagId.substr(0,index);
        var $closeObj = $obj.find("li[colName="+prefix+"_PAY_AREA_CD] .btnR_close");
        console.log($closeObj.length);
        if($closeObj.length > 0)
        {
          SessionConditionUtil.close($closeObj, prefix+"_PAY_AREA_CD", moduleId);
        }
      }
      else if(tagId.indexOf("_PAY_AREA_CD") > -1)
      {
        var index = tagId.indexOf("_PAY_AREA_CD");
        var prefix = tagId.substr(0,index);
        var $closeObj = $obj.find("li[colName="+prefix+"_PAYROLL_NO] .btnR_close");
        console.log($closeObj.length);
        if($closeObj.length > 0)
        {
          SessionConditionUtil.close($closeObj, prefix+"_PAYROLL_NO", moduleId);
        }
      }
    }
  }
}

/**
 * 조회조건을 세션에 저장하는 버튼을 그려줌
 * 세션의 조회조건을 프로그램의 조회조건에 셋팅해줌. (sessionCondition=Y) 의 값을 갖고있는 element에 한해서
 */
function applyElementSessionCon()
{
  var $parentDocument = $(parent.document);
  if($parentDocument.find("iframe[processIframe=Y]").length <= 0)
  {
    return;
  }

  $("input, select").filter("[sessionCondition=Y]").each(function(index)
  {
    var id = $(this).attr("id");
    setSearchConditionValue($parentDocument, id);
    var moduleId = Page.MODULE_ID;
    var html = "<input class='btn_auto_cal' type='button' targetId='"+$(this).attr("id")+"' onclick=\"SessionConditionUtil.add('"+id+"','"+moduleId+"');\" ></input>";
    if($("#"+id).next().is("img") || $("#"+id).next().is("input[type=button]") || $("#"+id).attr("multiple") == "multiple")
    {
      $(html).insertAfter($(this).next());
    }
    else
    {
      $(html).insertAfter(this);
    }
  });
}

/**
 * 세션조회조건 layer에 있는 값을 찾아 화면의 조회조건에 넣어주는 펑션.
 * @param doc : OPTION_LIST가 존재하는 document
 * @param tagId : 태그 id
 */
function setSearchConditionValue(doc, tagId)
{
  var n = tagId.indexOf("ORG_NM") + tagId.indexOf("EMP_ID");
  var tagId2="";
  if(doc.find("#OPTION_LIST").find("ul li").is("[colName='"+tagId+"']"))
  {
    if($("#"+tagId).attr("multiple") == "multiple")
    {
      //console.log("setSearchConditionValue 시작");
      var count = 0;
      var interval = setInterval(function(){
        var objArray = doc.find("#OPTION_LIST").find("ul li[colName='"+tagId+"']").attr("colValue").split(",");
        $("#"+tagId).multipleSelect("setSelects", objArray);
        if(count==2)
        {
          clearInterval(interval);
        }
        count++;
      },300);
    }
    else
    {
      if(tagId.indexOf("ORG_NM") > 0)
      {
        tagId2 = tagId.substr(0,n)+"_ORG_ID";
      }
      else if(tagId.indexOf("EMP_ID") > 0)
      {
        tagId2 = tagId.substr(0,n)+"_EMP_NM";
      }
      
      if($("#"+tagId2).length > 0)
      {
        inputSetValueAuto(tagId2, doc.find("#OPTION_LIST").find("ul li[colName='"+tagId+"']").attr("colText"));
      }
      inputSetValueAuto(tagId, doc.find("#OPTION_LIST").find("ul li[colName='"+tagId+"']").attr("colValue"));
    }
  }
}

function deReplaceXss(value)
{
  var valueRst = value;
  valueRst = valueRst.replaceAll("&#35;", "#");
  return valueRst;
}

/**
 * element 혹은 element id 를 입력받아 jQuery 객체로 리턴 
 * @param {String|Element} element
 * @returns {Jquery}
 */
function returnjQueryObj(element)
{
//  return (typeof element == "string") ?  $("#"+element) : $(element);
  return (typeof element == "string" && element != "") ?  $("#"+element) : $(element);
}

/**
 * 현재 사용중인 브라우저가 Canvas를 지원하는지 여부 리턴
 * @returns
 */
function isCanvasSupported()
{
  var elem = document.createElement('canvas');
  return !!(document.createElement('canvas').getContext && document.createElement('canvas').getContext('2d'));
}

/**
 * table 또는 table을 포함하는 태그를 보내면 해당 table을 엑셀로 내려받음
 * @param {String} table element's id
 * @param {String} name of excel file
 * @param {String} other parameters
 * @returns {Jquery}
 */
function exportExcelByTable(sTableId, sTitle, parameters )
{
  var dataAttrNm = "export_data";
  var $table = $("#"+sTableId);
  //테이블 태그가 아닌경우 자식 테이블 객체를 찾아냄
  if(!($table.length>0 && $table[0].tagName=="TABLE"))
  {
    $table = $($table.find("TABLE")[0]);
  }
  if($table.length <= 0 )
  {
    alert(sTableId+" is not a table");
    return;
  }
  
  if(parameters == null || parameters == undefined)
  {
    parameters = {};
  }
  parameters.X_MODULE_ID           =  Page.MODULE_ID;
  parameters.X_MENU_ID             =  Page.MENU_ID;
  parameters.X_PGM_URL             =  Page.PGM_URL;
  parameters.X_ENC_VAL             =  Page.ENC_VAL;
  parameters.X_PROFILE_ID          =  Page.PROFILE_ID;
  parameters.X_MENU_NM             =  sTitle;
  
  setTimeout(function(){ Progress.start(); },1);
  
  var $form = $(document.createElement("FORM"));
  
  var headercnt = 0;
  var $thtrs = $table.children("thead").children("tr");
  var $trs   = $table.children("tbody").children("tr");
  
  var nStaCol = 0;
  var nStaRow = 0;
  var nEndCol = 0;
  var nEndRow = 0;
  var arrRegion;
  var arrListRegion = [];
  var arrHeader;
  var arrHeaderList = [];
  var arrColumn = [];
  var arrCellPosList = [];
  var arrCellPos = [];
  
  //헤더처리
  for(var i=0;i<$thtrs.length;i++)
  {
    var $ths = $($thtrs[i]).children("th,td");
    
    if($thtrs.length > 0 )
    {
      headercnt++;
      
      nStaCow = 0;
      arrHeader  = [];
      arrCellPos = [];
      
      for(var h=0;h<$ths.length;h++)
      {
        var nColSpan = 1;
        var nRowSpan = 1;
        arrRegion = [];
        
        var $th = $($ths[h]);
        
        arrHeader.push( $th[0].hasAttribute(dataAttrNm) ? $th.attr(dataAttrNm) : $th.text());
        arrCellPos.push( ($th.cellPos()==undefined)?(h):$th.cellPos().left );
        
        var colspan = $th.attr("colspan"); 
        nColSpan = isNaN(colspan)?1:new Number(colspan);
        var rowspan = $th.attr("rowspan"); 
        nRowSpan = isNaN(rowspan)?1:new Number(rowspan);
        
        nEndCol = nStaCol + nColSpan - 1;
        nEndRow = nStaRow + nRowSpan - 1;
        
        //region 정보
        arrRegion.push(nStaRow);
        arrRegion.push(nStaCol);
        arrRegion.push(nEndRow);
        arrRegion.push(nEndCol);
        
        var sRegion = arrRegion.join(",");
        
        arrListRegion.push(sRegion);
        
        nStaCol = nEndCol+1;
      }
      
      arrHeaderList.push(arrHeader.join("‡"));
      arrCellPosList.push(arrCellPos.join("‡"));
    }
    else
    {
      break;
    }
    
    nStaRow++;
    
  }
  
  var $inp_header = $(document.createElement("input")).attr({name:"headers",type:"hidden", value : arrHeaderList.join("¶") });
  $form.append($inp_header );
  var $inp_cellpos = $(document.createElement("input")).attr({name:"cellpos",type:"hidden", value : arrCellPosList.join("¶") });
  $form.append($inp_cellpos );
  
  var $inp_region = $(document.createElement("input"));
  $inp_region.prop("name", "regions");
  $inp_region.prop("type", "hidden");
  $inp_region.val(arrListRegion.join("¶"));
  $form.append($inp_region);
  
  var $inp_head_cnt = $(document.createElement("input"));
  $inp_head_cnt.prop("name", "headercnt");
  $inp_head_cnt.prop("type", "hidden");
  $inp_head_cnt.val(headercnt);  
  $form.append($inp_head_cnt);
  
  //내용처리
  var $tds;
  var nRowCnt = 0;
  for(var i=0;i<$trs.length;i++)
  {
    $tds = $($trs[i]).children("th,td");
      
    $tds.each(function(idx,item)
    {
      if(i==0) //첫번째행인경우
      {
        arrColumn.push("COL"+idx);
      }
      
      var $inp_colval = $(document.createElement("input"));
      $inp_colval.prop("name","COL"+idx)
      $inp_colval.prop("type", "hidden");
      $inp_colval.val($(item)[0].hasAttribute(dataAttrNm) ? $(item).attr(dataAttrNm) : $(item).text());
      $form.append($inp_colval);
    });
    
    nRowCnt++;
  }
  
  var $inp_row_cnt = $(document.createElement("input"));
  $inp_row_cnt.prop("name","rowcnt");
  $inp_row_cnt.prop("type","hidden");
  $inp_row_cnt.prop("value", nRowCnt);
  $form.append($inp_row_cnt);
  
  var $inp_col  = $(document.createElement("input"));
  $inp_col.prop("name", "columns");
  $inp_col.prop("type", "hidden");
  $inp_col.val(arrColumn.join(","));
  $form.append($inp_col);
  
  //넘어온 파라미터도 같이 넘긴다.
  for ( var name in parameters )
  {
    var value = parameters[name];
    
    if(typeof value == "boolean")
    {
      value = String(value);
    }
    if ( $.protify(["string", "number"]).include(typeof value) )
    {
      $form.append($("<input>").attr({name: name, type: "hidden", value: value}));
    }
    else if ( typeof value == "array" )
    {
      value.each(function(v)
      {
        $form.append($("<input>").attr({name: name, type: "hidden", value: v}));
      });
    }
    else
    {
      input = $("<input>").attr({name: name, type: "hidden", value: value || ''});
      $form.append(input);
    }
  }
  
  var $ifr;
  if($("#iframe_export_to_excel").length>0)
  {
    $ifr = $("#iframe_export_to_excel");
  }
  else
  {
    $ifr = $(document.createElement("iframe"));
    $ifr.prop("id", "iframe_export_to_excel");
    $ifr.prop("name", "iframe_export_to_excel");
    $ifr.css("display","none");
    $(document.body).append($ifr);
  }
  
  var $inp_exnm = $(document.createElement("input"));
  $inp_exnm.prop("name", "excelName");
  $inp_exnm.prop("type", "hidden");
  $inp_exnm.val(sTitle);
  $form.append($inp_exnm);
  
  $form.prop("action", "/common/jsp/excelDownloadTable.jsp");
  $form.prop("method", "post");
  $form.prop("target", "iframe_export_to_excel");
  
  $form.appendTo("body").submit().remove();
  
  setTimeout( function(){ Progress.stop(); },1);
  
}

(function($){
  /* scan individual table and set "cellPos" data in the form { left: x-coord, top: y-coord } */
  function scanTable( $table ) {
      var m = [];
      $table.children( "tr" ).each( function( y, row ) {
          $( row ).children( "td, th" ).each( function( x, cell ) {
              var $cell = $( cell ),
                  cspan = $cell.attr( "colspan" ) | 0,
                  rspan = $cell.attr( "rowspan" ) | 0,
                  tx, ty;
              cspan = cspan ? cspan : 1;
              rspan = rspan ? rspan : 1;
              for( ; m[y] && m[y][x]; ++x );  //skip already occupied cells in current row
              for( tx = x; tx < x + cspan; ++tx ) {  //mark matrix elements occupied by current cell with true
                  for( ty = y; ty < y + rspan; ++ty ) {
                      if( !m[ty] ) {  //fill missing rows
                          m[ty] = [];
                      }
                      m[ty][tx] = true;
                  }
              }
              var pos = { top: y, left: x };
              $cell.data( "cellPos", pos );
          } );
      } );
  };

  /* plugin */
  $.fn.cellPos = function( rescan ) {
      var $cell = this.first(),
          pos = $cell.data( "cellPos" );
      if( !pos || rescan ) {
          var $table = $cell.closest( "table, thead, tbody, tfoot" );
          scanTable( $table );
      }
      pos = $cell.data( "cellPos" );
      return pos;
  }
})(jQuery);


/**
 * HashMap을 사용할 수 있도록 구현
 */
var HashMap = function()
{
  this.map = new Array();
};

HashMap.prototype = {
    put : function(key, value){
      this.map[key] = value;
    },
    get : function(key){
      return this.map[key];
    },
    clear:function(){
      this.map = new Array();
    },
    getKeys : function(){
      var keys = new Array();
      for(i in this.map)
      {
        keys.push(i);
      }
      return keys;
    }
};



var DevTool = {
  captureImage : null
 ,init : function() 
  {
    if(HUNEL_DEV_TOOL_USE_YN=="Y")
    {
      if(DevTool.getUrl()!="/main/jsp/hunel.jsp")
      {
        setTimeout(function(){
          DevTool.createTool();
          DevTool.bindEvent();
        },10);
      }
    }
  }
 ,createTool : function()
  {
     var oToolDiv = $("#divHunelDevTool");
     if(oToolDiv.length>0) return; //이미만들어진 상태면 만들지 않음
     
     oToolDiv = $(document.createElement("div"));
     oToolDiv.prop("id","divHunelDevTool");
     
     var oDivInfo = $(document.createElement("ul"));
     oDivInfo.addClass("divDevInfo");
     
     var oLi1 = $(document.createElement("li"));
     oLi1.addClass("url");
     
     var oInput = $(document.createElement("input"));
     oInput.prop("type", "text");
     oInput.val(DevTool.getUrl());
     oLi1.append(oInput);
     
     var oLi2 = $(document.createElement("li"));
     oLi2.addClass("btnDev");
     
     var btnCapture = $(document.createElement("a"));
     btnCapture.addClass("btnCapture");
     btnCapture.attr("title","캡쳐");
     btnCapture.prop("href","javascript:;");
     var oSpan1 = $(document.createElement("span"));
     oSpan1.addClass("hidden");
     oSpan1.html("캡쳐");
     btnCapture.append(oSpan1);
     btnCapture.bind("click",function(){ DevTool.toImage(); });
     
     var btnBoard = $(document.createElement("a"));
     btnBoard.addClass("btnBoard");
     btnBoard.attr("title","의견");
     btnBoard.prop("href","javascript:;");
     var oSpan2 = $(document.createElement("span"));
     oSpan2.addClass("hidden");
     oSpan2.html("의견");
     btnBoard.append(oSpan2);
     btnBoard.bind("click",function(){ DevTool.popBoard();});
     
     var btnClose = $(document.createElement("a"));
     btnClose.addClass("btnToolClose");
     btnClose.attr("title","닫기");
     btnClose.prop("href","javascript:;");
     var oSpan3 = $(document.createElement("span"));
     oSpan3.addClass("hidden");
     oSpan3.html("닫기");
     btnClose.append(oSpan3);
     btnClose.bind("click",function(){ DevTool.hide(); });
     
     oLi2.append(btnCapture);
     oLi2.append(btnBoard);
     oLi2.append(btnClose);
     
     oDivInfo.append(oLi1);
     oDivInfo.append(oLi2);
     
     oToolDiv.append(oDivInfo);
     oToolDiv.addClass("divDevTool");
     oToolDiv.attr("toggle","N");
     oToolDiv.css("display","none");
     
     $(document.body).append(oToolDiv);
     
     /*
      *  <div id="divHunelDevTool" class="divDevTool">
  <ul class="divDevInfo">
    <li class="url">
      <input type="text" name="" value="" />
    </li>
    <li class="btnDev">
      <a href="javascript:;" class="btnCapture" title="캡쳐"><span class="hidden">캡쳐</span></a>
      <a href="javascript:;" class="btnBoard" title="의견"><span class="hidden">의견</span></a>
      <a href="javascript:;" class="btnToolClose" title="닫기"><span class="hidden">닫기</span></a>
    </li>
  </ul>
</div>
      */
  }
 ,bindEvent : function()
  {
    //일반적인 페이지는 타이틀을 더블클릭했을 때 보이도록 조정
    var hTitle = $("h2,h3");
    if(hTitle.length > 0 )
    {
      $(hTitle[0]).bind("dblclick", function(){
        DevTool.toggle();
      });
    }
    else
    {
      //타이틀이 없는 경우는 
      $(document.body).bind("dblclick", function(e){
        if( !$.contains($("#divHunelDevTool")[0], e.target) )
        {
          DevTool.toggle();
        }
      });
    }
  }
 ,getUrl : function()
  {
    if(window.Page != undefined)
    {
      return window.Page.POP_URL;
    }
  }
 ,toImage : function()
  {
   if(!isCanvasSupported())
   {
     alert("사용하고 있는 브라우저가 구형이라 해당기능을 사용할 수 없습니다.");
     return;
   }
   if(!confirm("화면을 캡쳐하여 이미지로 다운 받습니다.")) return;
    //$("#divHunelDevTool").hide();
    DevTool.hideAll();
    DevTool.captureImage = null;
    setTimeout(function()
    {
      var wbox = $("#wbox");
      html2canvas(document.body).then(function(canvas) 
      {
        Progress.start();
        var aTitle = $(".titA");
        var sTitle = "";
        if(aTitle.length>0)
        {
          sTitle = $(aTitle[0]).html();
        }
        var imageData = canvas.toDataURL("image/png");
        var a = $("<a>").attr("href", imageData).attr("download", $.trim(sTitle) +"_" + $.trim($.now())+".png").appendTo("body");
        a[0].click();
        a.remove();
        
        //DevTool.showAll();
        Progress.stop();
      });
    }, 500);
  }
 ,popBoard : function()
  {
    ModalUtil.open({title:"프로그램정보", url: "/sys/sy_project/sy_project_210_p01.jsp", param: {C_PROFILE_ID: Page.PROFILE_ID, C_MODULE_ID: Page.MODULE_ID, C_MENU_ID: Page.MENU_ID, 
      C_PGM_ID: Page.PGM_ID, C_URL: Page.PGM_URL, C_SQL_ID: Page.SQL_ID, C_PRS_ID: Page.PRS_ID, S_POPUP_YN:"Y", X_PGM_ID: "sy_project_210_p01", S_ERR_YN: "Y", S_MEMO_YN: "Y"}});
    
  }
 ,toggle : function()
  {
    var $oToolDiv =  $("#divHunelDevTool");
    if($oToolDiv.attr("toggle") == undefined) $oToolDiv.attr("toggle", "N");
    if($oToolDiv.attr("toggle") == "N" )
    {
      $oToolDiv.show();
      $oToolDiv.attr("toggle","Y");
    }
    else
    {
      $oToolDiv.hide();
      $oToolDiv.attr("toggle","N");
    }
  }
 ,hideAll : function()
  {
     DevTool.hideTool( $(document.body), false);
  }
 ,showAll : function()
 {
   DevTool.hideTool( $(document.body), true);
 }
 ,hideTool : function( $node , bShow )
  {
    var $tool =  $node.find("#divHunelDevTool");
    if(bShow)
    {
      $tool.show();
    }
    else
    {
      $tool.hide();
    }
   
     var $iframe  = $node.find("iframe");
     if( $iframe.length > 0)
     {
       $iframe.each(function(idx,item)
       {
         DevTool.showDevTool(item, bShow);
         
         DevTool.hideTool($(item), bShow);
         
       });
     }
     
  }
 ,showDevTool : function ( iframe, bShow )
  {
    var $tool =  $(iframe).contents().find("#divHunelDevTool");
    if(bShow)
    {
      $tool.show();
    }
    else
    {
      $tool.hide();
    }
  }
 ,show : function()
  {
    $("#divHunelDevTool").show();
  }
 ,hide : function()
  {
    $("#divHunelDevTool").hide();
  }
};

(function($) {
  $.fn.purgeFrame = function() {
      var deferred;
      if ($.browser.msie && parseFloat($.browser.version, 10) < 9) {
          deferred = purge(this);
      } else {
          this.remove();
          deferred = $.Deferred();
          deferred.resolve();
      }
      return deferred;
  };
  function purge($frame) {
      var sem = $frame.length
        , deferred = $.Deferred();
      $frame.load(function() {
          var frame = this;
          frame.contentWindow.document.innerHTML = '';
          sem -= 1;
          if (sem <= 0) {
              $frame.remove();
              deferred.resolve();
          }
      });
      $frame.attr('src', 'about:blank');
      if ($frame.length === 0) {
          deferred.resolve();
      }
      return deferred.promise();
  }
})(jQuery);


function getMultiLang(type, key, defaultStr, lang)
{
  var rtnStr = defaultStr;
  window.ehrTopFrame = findFrameByName('ehrTopFrame')||top;
  var ml;
  if(type=="message")
  {
    ml = ehrTopFrame.MultiMessage;
  }
  else
  {
    ml = ehrTopFrame.MultiLabel;
  }
  if(lang==undefined)
  {
    lang = ehrTopFrame.LANG_TYPE;
  }
  if(ml!=null && ml!=undefined)
  {
    try
    {
      rtnStr = ml[key];
    }
    catch(e)
    {
      rtnStr = defaultStr;
    }
  }
  
  return rtnStr;
}