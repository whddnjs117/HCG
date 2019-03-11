# document.ready(function(){...}); 분석
- 확인한 파일들
  - pa120_ul01.jsp
  - commonResource.jsp
  - product_info.html
  - ibsheetinfo.js, FormQueryString(form, checkRequired, jsonObj)
  - ibsheet.js
  - main.js
  - hunel.js

## 시작 메소드
```js
$(document).ready(function () { // Native Jquery

    //chkAuthMenu 권한체크를 위해 추가함
    if(window.Page != null)
    {
        form = ($("#f1").length > 0)? $("#f1") : $("form").first();
        // #f1은 정보를 가지는 영역으로 hidden 상태임
        // #f1의 길이(정보)가 담겨있다면 form의 명칭은 #f1
        // form 태그의 가장 첫번째를 form 으로 지정한다.

        form.append('<input type="hidden" id="S_PAGE_PROFILE_ID" name="S_PAGE_PROFILE_ID" value="'+Page.PROFILE_ID+'">');
        form.append('<input type="hidden" id="S_PAGE_MODULE_ID" name="S_PAGE_MODULE_ID" value="'+Page.MODULE_ID+'">');
        form.append('<input type="hidden" id="S_PAGE_MENU_ID" name="S_PAGE_MENU_ID" value="'+Page.MENU_ID+'">');
        form.append('<input type="hidden" id="S_PAGE_PGM_URL" name="S_PAGE_PGM_URL" value="'+Page.PGM_URL+'">');
        form.append('<input type="hidden" id="S_PAGE_ENC_VAL" name="S_PAGE_ENC_VAL" value="'+Page.ENC_VAL+'">');
        form.append('<input type="hidden" id="S_PAGE_ENC_VAL2" name="S_PAGE_ENC_VAL2" value="'+Page.ENC_VAL2+'">');
        form.append('<input type="hidden" id="S_PAGE_PGM_ID" name="S_PAGE_PGM_ID" value="'+Page.PGM_ID+'">');
        // form에 Profile Group 내부의 속성값들을 추가한다.

        form.append('<input type="hidden" id="__viewState" name="__viewState" value="">');
        // ibsheetinfo.js - FormQueryString(form, checkRequired, jsonObj)의 return 값이 plain_text로 QueryString이다.
        // 즉 #f1의 정보를 쿼리스트링으로 조합하고 JsonObject화 시키는게 아닌지 추측해본다.

        // AUTH_ADMIN_YN: "Y"
        // BUTTON_LOG_YN: "Y"
        // C_CD: "10"
        // EMP_SCH_AUTH_CD: "10"
        // EMP_TYPE: "10"
        // ENC_VAL: ""
        // ENC_VAL2: ""
        // GEN_YN: ""
        // HELP_MSG: ""
        // HELP_PGM_ID: ""
        // LANG: "ko"
        // MENU_ID: ""
        // MODULE_ID: ""
        // NTNL_CD: "KOR"
        // PGM_BTN_LOG_YN: "null"
        // PGM_ID: "hunel"
        // PGM_URL: "/main/jsp/hunel.jsp"
        // POP_URL: "/main/jsp/hunel.jsp"
        // PROFILE_ID: ""
        // PRS_ID: ""
        // SKIN_PATH: "/resource"
        // SQL_ID: ""

        if(typeof(Page) != "undefined" &&  ! Page.MENU_ID) displayElement($(".btMsg"), false);
        // Page 객체의 타입을 체크하고
        // hunel.js의 LeftMenu의 makeItem 함수에 $item 객체를 파라미터로 주면 MENU_ID는 nvl함수로 정의할 수 있다.
        // displayElement는 btMsg 클래스를 숨긴다.
        // displayElemeent, .btsMsg 는 Native Jquery이다.

        applyElementFormat();
        // 시간, 달력을 지정된 포맷으로 변환하여 세션에 정리, IE가 아니라면 건너뛴다.
        
        applyElementSearchEmp();
        // 사번/성명 조회기능 조건에 대해 정의

        applyElementSearchOrg();
        // 조직명 조회기능 조건에 대해 정의

        setButtonAuth();
        // 버튼, 파일, input 박스의 class 적용 및 버튼 권한 적용

        setNotice();
        // 도움말관리 프로그램에서 등록된 도움말이 있으면 화면의 도움말 버튼을 그려준다.

        DevTool.init();
    }


    /**
     * jquery attr의 결과가 undefined이면 "" 아니면 결과를 리턴
     * @member jQuery
     * @method attr2
     * @param {String} name element의 속성키
     * @return {String} element 속성 값
     */
    // attr2: function( name ) {
    //     var $tmp;
    //     if(name!=undefined && name!=null )
    //     {
    //         $tmp = $(this).attr(name);
    //     }
    //     return ($tmp == undefined)? "" : $tmp;
    // },


    /*
    * 페이지별 옵션을 주기 위해서는 body tag 에 layoutAuto 속성을 false 로 설정하고
    * LoadPage() 상단에 Layout.init 속성 설정 한다.
    * Default 로 Layout.init() 설정을 하기 위함.
    */

    // Double Exclamation Marks : 느낌표 두개(!!) 연산자는 확실한 논리결과를 가지기 위해 사용
    // <body layoutAuto="false">
    if(!!$("body").attr2("layoutAuto")) {} else { Layout.init();}
    // Layout.init({slidersize:2, color:"#d7262e", solidslider:true}); //slidersize는 두께
    // 이거 안하면 잠금해제 상태에서 새로고침 후 돌아올 때 사이즈 조절 안되서 화면 안보인다.
    if(!!$("body").attr2("layoutAuto")) {} else { setTimeout(function(){Layout.resize();}, 500);}
    // 시간 지연함수 setTimeout으로 Layout.resize()를 0.5 초후에 실행한다.
    // resize 이벤트는 스크립트로 제어했을 때 사이즈가 변경되면 사용한다.

    // setTimeout() 함수 사용 시기
    // i. 접속 후 몇 초 후에 팝업 또는 배너창 띄우기
    // ii. 방문자의 스크롤이 브라우저 일정 위치에 올 경우 몇 초 뒤에 애니메이션 실행
    // iii. 검색창 또는 일부 섹션 몇 초 뒤에 사라질 경우
    // iv. 방문자 접속 후 20-30초가 지난 뒤 메일 구독을 신청하는 팝업창을 띄울 경우

    if(typeof(LoadPage) == "function"){
        var lp = LoadPage();

        // hunel.jsp
        // function LoadPage()
        // {
        //     //페이지탭 자동닫기 체크
        //     if(getCookie("mdiComntYn")=="Y"){
        //         $("#mdiComntYn").attr("checked",true);
        //     }else{
        //         $("#mdiComntYn").attr("checked",false);
        //     }
        //     //화면 잠금상태 확인.
        //     if("Y" == "<%=blockStatus%>")
        //     {
        //         doAction("<com:otp value='blockUI'/>");
        //     }
        //     else
        //     {
        //         displayElement("wrap", true);
        //     }
        //     Layout.init({slidersize:2, color:"#d7262e", solidslider:true}); //slidersize는 두께
        //     //다국어만 필요 start
        //     doAction("<com:otp value='langType'/>");
        //     //다국어만 필요 end
        //     doAction("<com:otp value='init'/>");
        //     setCombo("<%=hmPreparedData.get("cbHelpUrl")%>", "S_FILE_URL");
        //     $("#tab_menu").bind("mousewheel",function(event, delta){ Hunel.MdiTab.wheelTabScroll(event,delta); }); //탭메뉴 마우스 휠 이벤트
        //     MainPage.init();//휴넬 메인페이지 컨트롤
        //     $("#S_SCH_EMP_NM").placeholder();//ie9이하는 placeholder속성을 알지 못함.
        //
        //     //로그인 언어에 따른 간지 변경
        //     if(Page.LANG =="ko")
        //     {
        //         $("#Stage_Biz").attr("class", "hbox Stage_Bg_Kr" );
        //     }
        //     else if(Page.LANG =="en")
        //     {
        //         $("#Stage_Biz").attr("class", "hbox Stage_Bg_En" );
        //     }
        //     else
        //     {
        //         $("#Stage_Biz").attr("class", "hbox Stage_Bg_Ch" );
        //     }
        //
        //     if("<%=firstpage_id%>"!=""){
        //         //firstpage_id가 있는 경우는 첫 페이지를 열어준다.
        //         ajaxSyncRequestXS("<com:otp value='biz.sys.Sys_common'/>","<com:otp value='getFirstPageInfo'/>",{S_PGM_ID:"<%=firstpage_id%>"}
        //             ,function(xs){
        //                 if(xs.RowCount()>0){
        //                     var item = {
        //                         PROFILE_ID : xs.GetCellValue(0, "PROFILE_ID"),
        //                         MODULE_ID : xs.GetCellValue(0, "MODULE_ID"),
        //                         MENU_ID : xs.GetCellValue(0,"MENU_ID"),
        //                         PGM_ID : xs.GetCellValue(0,"PGM_ID"),
        //                         SQL_ID : xs.GetCellValue(0,"SQL_ID"),
        //                         PRS_ID : xs.GetCellValue(0,"PRS_ID"),
        //                         EMP_SCH_AUTH_CD : xs.GetCellValue(0,"EMP_SCH_AUTH_CD"),
        //                         MENU_NM : xs.GetCellValue(0,"MENU_NM"),
        //                         ENC_VAL :xs.GetCellValue(0,"ENC_VAL"),
        //                         ENC_VAL2 :xs.GetCellValue(0,"ENC_VAL2"),
        //                         PGM_URL :xs.GetCellValue(0,"PGM_URL"),
        //                         GEN_YN : xs.GetCellValue(0,"GEN_YN"),
        //                         EXP_YN : xs.GetCellValue(0,"EXP_YN"),
        //                         MENU_NM : xs.GetCellValue(0,"MENU_NM")
        //                     };
        //                     Hunel.Favorite.openFavorite(item, xs.GetCellValue(0,"MODULE_ID"), "<%=menuframe_yn%>");
        //                 }else{
        //                     alert(ajaxMsg("MSG_0009"));
        //                 }
        //             });
        //     }
        //     else
        //     {
        //         //근태연차촉진공지 띄우기
        //         var POP_URL = "";
        //         var PGR_STAT = "";
        //         var POP_TITLE = "";
        //         ajaxSyncRequestXS(hunelOtpVal.Sy_main_page, hunelOtpVal.getTmPromoPgrStat, {}, function(xs)
        //         {
        //             PGR_STAT = xs.GetEtcData("PGR_STAT");
        //         });
        //         //PGR_STAT (10:준비단계, 20:확인대기, 30:사용계획수립중, 40:사용계획수립완료, 50:사용계획통보중, 60:최종완료)
        //         if(PGR_STAT == "20")
        //         {
        //             POP_URL = "/tam/tm_promo/tm_promo_000_p01.jsp";
        //             POP_TITLE = "";
        //         }
        //         else if(PGR_STAT == "50")
        //         {
        //             POP_URL = "/tam/tm_promo/tm_promo_000_p02.jsp";
        //             POP_TITLE = "";
        //         }
        //
        //         if(POP_URL != "")
        //         {
        //             ModalUtil.open({url:POP_URL, title: POP_TITLE, param: {}});
        //         }
        //     }
        // }

        //LoadPage가 끝난 후에 applyElementSessionCon()를 실행하기 위함.
        $(lp).promise().done(function()
        // promise : 컬렉션에 바인딩 된 특정 유형의 모든 작업 (대기 또는 실행)이 완료 될 때 객체를 반환
        {
            applyElementSessionCon();
            // 조회조건을 세션에 저장하는 버튼을 그리고 해당 세션의 조회조건을 프로그램의 조회조건에 셋팅
            // sessionCondition=Y 에 한함

            //페이지 로드 후 부모페이지에서 실행해야할 함수가 예약되어있으면 호출
            var parentWidow = window.parent;
            // 부모 창을 변수로 대입
            if(parentWidow!=undefined)
            {
                if( parentWidow.childLoadAfter != undefined && typeof(parentWidow.childLoadAfter) == "function")
                {
                    parentWidow.childLoadAfter(Page.POP_URL, window);
                }
            }
        });
    }

    // Mozilla Firefox용 스크립트로 마우스관련 이벤트를 추가한다.
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
```

## + 개발툴
```js
// HUNEL_DEV_TOOL_USE_YN
// 개발자 도구를 사용하기 위한 체크 변수
// 개발자 도구에서 파일 업로드를 위하여 개발자모드 일때만 일시적으로 체크하지 않음

var DevTool = {
    init : function()
    {
        if(HUNEL_DEV_TOOL_USE_YN=="Y")
        {
            if(DevTool.getUrl()!="/main/jsp/hunel.jsp")
            {
                setTimeout(function(){
                    // #divHunelDevTool 을 작성하는 함수
                    DevTool.createTool();
                    // #divHunelDevTool을 보여주는 이벤트에 대한 함수
                    // h2, h3 태그가 있을 경우(일반적인 경우) 더블클릭하면 개발자도구 노출
                    // 없다면 body에 바인드하여 더블클릭시 개발자도구 노출
                    DevTool.bindEvent();
                },10);
            }
        }
    }
}
```

## applyElementFormat() 메소드
```js
function applyElementFormat()
{
    $("input[type=text], textarea").each(function(index)
    {
        // 달력에 커서가 위치하면 모양이 변경된다.
        var element = $(this);
        // index 0 = element = n.fn.init [input#S_SCH_EMP_NM, context: input#S_SCH_EMP_NM]
        // index 1 = element = n.fn.init [input#S_ADD_FAVORITE_NM, context: input#S_ADD_FAVORITE_NM]
        // index 2 = element = n.fn.init [textarea#post_it_body_txt.hiddenZone, context: textarea#post_it_body_txt.hiddenZone]
        // index 3 = element = n.fn.init [input#post_it_cmt_txt.postInp, context: input#post_it_cmt_txt.postInp]
        // index 4 = element = n.fn.init [textarea#xml_user_profile, context: textarea#xml_user_profile]
        // index 5 = element = n.fn.init [textarea#xml_lang_type, context: textarea#xml_lang_type]


        if(element.attr("__formatapplied")) return;
        // true로 세팅되어있는지 확인하는 Validation

        element.attr("__formatapplied", true);
        // 세팅되어 있지 않으면 세팅 실시

        var elementAttr = element.attr("data_format");

        if( !isIE() && (elementAttr==""||elementAttr==undefined)) return; //Safari에서 텍스트 지워짐현상이 있어 IE에서만 동작하게 변경 kyn
                                                                          //ie에서는 INPUT에 포커스가 안들어가는 버그가 있어 필요없어도 아래를 실행
        // 브라우저가 IE인지 확인하는 함수, IE가 아니라면 for문 종료

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
        // IE에서 동작하는 코드로 IE에 해당하지 않으면 변환하지 않음

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
```

## applyElementSearchEmp() 메소드
```js
/**
 * 사번/성명 조회조건의 기능들을 정의한다
 * @member global
 * @method applyElementSearchEmp
 */
function applyElementSearchEmp()
{
    // label_ko.properties 에 정의 : 직원찾기, 직원검색, 직원찾기(성명/차량번호)
    // main.js에 search_emp 함수가 있음
    // ModalUtil.open({url: "/pas/pa_stat/pa_stat_480_p01.jsp", title:ajaxLabel("search_emp"),param: {S_SCH_EMP_NM: S_SCH_EMP_NM, S_SCH_TEXT_YN: S_SCH_TEXT_YN }});
    // 팝업화면 제목은 ModalUtil.open 시 타이틀 속성값이다.
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
```

## applyElementSearchOrg() 메소드
```js
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
```

## setButtonAuth() 메소드
```js
/**
 * 버튼,파일,input박스의 class 적용 및 버튼 권한 적용
 * @member global
 * @method setButtonAuth
 */
function setButtonAuth()
{
    $("img, input, a, button, span, div, textarea").each(function (index)

    // index 0: e = n.fn.init [input#S_DSCLASS, context: input#S_DSCLASS]


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
```

## setNotice() 메소드
```js
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
```

## applyElementSessionCon() 메소드
```js
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
```