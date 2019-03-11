var MainPage = {

    prevStep : null
   ,curStep : null
   ,$step1 : null
   ,$step2 : null
   ,$step3 : null
   ,$calendar : null
   ,stepDefWidth : 250   //Step Default Width
   ,stepExpWidth : 620   //Step Extension Width
   ,stepMargin : 10 + 2  //Step Margin + Border
   ,aniSpeed : 200       //Animation Speed
   ,sDate : null         //설정한 Date
   ,pDate : null         //설정한 이전 달의 Date(마지막일자 기준)
   ,nDate : null         //설정한 다음 달의 Date(마지막일자 기준)
   ,today : null         //설정한 날짜
   ,sLastDay : null      //설정한 달의 마지막 일자
   ,pLastDay : null      //설정한 이전 달의 마지막 일자
   ,nLastDay : null      //설정한 다음 달의 마지막 일자
   ,calData : null       //Calendar Data
   ,anlIdx : 0           //그래프 관련 인덱스(초기값은 0 이며 이전버튼시 +1, 다음버튼시 -1 된다.)
   ,arrAllCnt : null     //전체근태사용일수+근태사용월 (배열 - 그래프에서 사용)
   ,arrAnlCnt : null     //전체근태사용일수+근태사용월 (배열 - 그래프에서 사용)
   ,arrTamCnt : null    //월별 근태 사용 일수 (배열 - 그래프에서 사용, arrAnlCnt의 0번째배열)
   ,arrMonth : null     //근태 사용 월 (배열 - 그래프에서 사용, arrAnlCnt의 1번째배열)
   ,anlStdMm : null    //연차 기준월( 발생집계기준의 기준이 직접입력,입사일 등이 될 수 있어 개인별로 기준월이 유동적일 수 있음)

    /**
     * Main 초기 설정
     */
   ,init : function()
    {
      //ie8은 filter:inherit를 설정 안해주면 자식 element filter가 작동을 안하고 ie9은 설정을 해주면 작동을 안하기 때문에 filter을 수정해준다.
      //if($.browser.msie && $.browser.version == "9.0"){
      //  $wbox.css({filter:"0"});
      //}
      this.curStep = "step2";
      this.$step1 = $("#step1");
      this.$step2 = $("#step2");
      this.$step3 = $("#step3");
      this.$calendar = $(".cal tbody");
      this.sDate = new Date(); //날짜는 사용자 로컬 시스템 날짜를 설정한다.
      this.today = this.sDate.getDate();
      this.mainBindEvent();
      this.getMainInfo();
    }
      
    /**
     * Main 이벤트 설정
     */
   ,mainBindEvent : function()
    {
      var _self = this;
      //홈버튼
      $("#home_btn").click(function()
      {
        $(location).attr("href","/");
      });
      //help버튼
      $("#help_btn").click(function(e)
      {
        $("#help_select_layer").css({top:20, left:(e.pageX-220)});
        $("#help_select_layer").show();
      });
      //즐겨찾기버튼
      $("#favorite_btn").click(function()
      {
        Hunel.Favorite.showLayer(true);
      });
      //잠금화면버튼
      $("#lock_btn").click(function()
      {
        doAction(hunelOtpVal.blockUI);
      });
      //프로파일 select 클릭
      $("#profile_select").click(function()
      {
        var elementId = "";
        $(this).find(".selectEl").each(function()
        {
          var $element = $(this);
          $element.toggleClass("hiddenZone");
          if(!$element.hasClass("hiddenZone"))
          {
            elementId = $element.attr("id");
          }
        });
        if(elementId == "staffLi")
        {
          doAction(hunelOtpVal.setModuleMenu, { GEN_YN:"N" });
        }
        else if(elementId == "generalLi")
        {
          doAction(hunelOtpVal.setModuleMenu, { GEN_YN:"Y" });
        }
      });
      //logout 클릭
      $("#logout").click(function()
      {
        submit2({target: 'ehrTopFrame', action: '/main/jsp/logout.jsp'}, null);
      });
      //페이지자동닫기 설정
      $("#preference").click(function(e)
      {
        //$("#preferences_layer").css({top:(e.pageY+10), left:(e.pageX-240)});
        $("#preferences_layer").css({top:(e.pageY+10), right:0});
        $("#preferences_layer").show();
      });
      
      //Step 클릭 이벤트
      $(".mSec").on("click", function(e)
      {
        _self.prevStep = _self.curStep;
        _self.curStep = this.id;
        _self.showMain();
      });
        
      //Step1 이벤트 strat
      //신청클릭
      $("#APPL_CNT").click(function()
      {
        var profile_id = "";
        var module_id = "";
        var menu_id = "";
        var enc_val = "";
        var enc_val2 = "";
        ajaxSyncRequestXS( hunelOtpVal.Sy_main_page, hunelOtpVal.searchAuth, {S_PGM_ID:"sy_appl_200_m01",S_PGM_URL:"/sys/sy_appl/sy_appl_200_m01.jsp"}, function(xs)
        {
          profile_id = xs.GetEtcData("PROFILE_ID");
          module_id = xs.GetEtcData("MODULE_ID");
          menu_id = xs.GetEtcData("MENU_ID");
          enc_val = xs.GetEtcData("ENC_VAL");
          enc_val2 = xs.GetEtcData("ENC_VAL2");
        });
        ModalUtil.open({url:"/sys/sy_appl/sy_appl_200_m01.jsp", title: ajaxLabel("appl_history"), param: {
          X_PROFILE_ID: profile_id,
          X_MENU_NM: ajaxLabel("appl_history"),//신청내역
          S_SQL_ID: "",
          X_MODULE_ID:module_id,
          X_MENU_ID:menu_id,
          X_PGM_ID:"sy_appl_200_m01",
          X_PGM_URL:"/sys/sy_appl/sy_appl_200_m01.jsp",
          X_ENC_VAL:enc_val,
          X_ENC_VAL2:enc_val2,
          S_APPL_YMD_FR: addYmd(TO_YMD, 'Y', -1),
          S_APPL_YMD_TO: TO_YMD,
          S_NO_END_ONLY_YN: 'Y'
        }});
      });
      
      //결재클릭
      $("#APPR_CNT").click(function()
      {
        var profile_id = "";
        var module_id = "";
        var menu_id = "";
        var enc_val = "";
        var enc_val2 = "";
        ajaxSyncRequestXS( hunelOtpVal.Sy_main_page, hunelOtpVal.searchAuth, {S_PGM_ID:"sy_appl_210_m01",S_PGM_URL:"/sys/sy_appl/sy_appl_210_m01.jsp"}, function(xs)
        {
          profile_id = xs.GetEtcData("PROFILE_ID");
          module_id = xs.GetEtcData("MODULE_ID");
          menu_id = xs.GetEtcData("MENU_ID");
          enc_val = xs.GetEtcData("ENC_VAL");
          enc_val2 = xs.GetEtcData("ENC_VAL2");
        });
        ModalUtil.open({url:"/sys/sy_appl/sy_appl_210_m01.jsp", title: ajaxLabel("appr_history"), param: {
          X_PROFILE_ID: profile_id,
          X_MENU_NM: ajaxLabel("appr_history"),//결재내역
          S_SQL_ID: "",
          X_MODULE_ID:module_id,
          X_MENU_ID:menu_id,
          X_PGM_ID:"sy_appl_210_m01",
          X_PGM_URL:"/sys/sy_appl/sy_appl_210_m01.jsp",
          X_ENC_VAL:enc_val,
          X_ENC_VAL2:enc_val2,
          S_APPL_YMD_FR: addYmd(TO_YMD, 'Y', -1),
          S_APPL_YMD_TO: TO_YMD,
          S_APPR_STAT_CD: '200'//applStatApprReq
        }});
      });
      
      //승인클릭
      $("#ADMIN_CNT").click(function()
      {
        var profile_id = "";
        var module_id = "";
        var menu_id = "";
        var enc_val = "";
        var enc_val2 = "";
        ajaxSyncRequestXS( hunelOtpVal.Sy_main_page, hunelOtpVal.searchAuth, {S_PGM_ID:"sy_appl_220_m01",S_PGM_URL:"/sys/sy_appl/sy_appl_220_m01.jsp"}, function(xs)
        {
          profile_id = xs.GetEtcData("PROFILE_ID");
          module_id = xs.GetEtcData("MODULE_ID");
          menu_id = xs.GetEtcData("MENU_ID");
          enc_val = xs.GetEtcData("ENC_VAL");
          enc_val2 = xs.GetEtcData("ENC_VAL2");
        });
        ModalUtil.open({url:"/sys/sy_appl/sy_appl_220_m01.jsp", title: ajaxLabel("admin_history"), param: {
          X_PROFILE_ID: profile_id,
          X_MENU_NM: ajaxLabel("admin_history"),//승인내역
          S_SQL_ID: "",
          X_MODULE_ID:module_id,
          X_MENU_ID:menu_id,
          X_PGM_ID:"sy_appl_220_m01",
          X_PGM_URL:"/sys/sy_appl/sy_appl_220_m01.jsp",
          X_ENC_VAL:enc_val,
          X_ENC_VAL2:enc_val2,
          S_APPL_YMD_FR: addYmd(TO_YMD, 'Y', -1),
          S_APPL_YMD_TO: TO_YMD,
          S_APPL_STAT_CD: '500'//applStatAdminReq
        }});
      });
      
      //직원검색
      this.$step1.find("#S_SCH_EMP_NM")
      .click(function(e)
      {
        this.value = "";
      })
      .keydown(function(e)
      {
        if(e.keyCode == 13) //Enter
        {
          _self.searchEmp();
        }
      });
      //직원검색버튼
      this.$step1.find(".inp .btnSch").click(function(e)
      {
        _self.searchEmp();
      });
        
      //정보수정
      this.$step1.find(".team .btnMod").click(function(e)
      { 
        ModalUtil.open({url:"/sys/sy_main/sy_main_416_p01.jsp", title: ajaxLabel("edit_info"), param: {
          X_PROFILE_ID: "ESS",
          X_MENU_NM: ajaxLabel("edit_info") //개인정보수정
        }});
      });
      
      //신청서 리스트 더보기
      this.$step1.find(".appList .btnMore").click(function(e)
      { 
        var profile_id = "";
        var module_id = "";
        var menu_id = "";
        var enc_val = "";
        var enc_val2 = "";
        ajaxSyncRequestXS(hunelOtpVal.Sy_main_page, hunelOtpVal.searchAuth, {S_PGM_ID:"sy_appl_200_m01",S_PGM_URL:"/sys/sy_appl/sy_appl_200_m01.jsp"}, function(xs){
          profile_id = xs.GetEtcData("PROFILE_ID");
          module_id = xs.GetEtcData("MODULE_ID");
          menu_id = xs.GetEtcData("MENU_ID");
          enc_val = xs.GetEtcData("ENC_VAL");
          enc_val2 = xs.GetEtcData("ENC_VAL2");
        });
        ModalUtil.open({url:"/sys/sy_appl/sy_appl_200_m01.jsp", title: ajaxLabel("appl_history"), param: {
          X_PROFILE_ID: profile_id,
          X_MENU_NM: ajaxLabel("appl_history"),//신청내역
          S_SQL_ID: "",
          X_MODULE_ID:module_id,
          X_MENU_ID:menu_id,
          X_PGM_ID:"sy_appl_200_m01",
          X_PGM_URL:"/sys/sy_appl/sy_appl_200_m01.jsp",
          X_ENC_VAL:enc_val,
          X_ENC_VAL2:enc_val2,
          S_APPL_YMD_FR: addYmd(TO_YMD, 'Y', -1),
          S_APPL_YMD_TO: TO_YMD,
          S_NO_END_ONLY_YN: 'Y'
        }});
      });

      //휴가사용 그래프 이전버튼
      this.$step1.find(".chartBox .cPrev")
        .click(function(e)
        {
          var anlIdx = _self.anlIdx;
          if (1 <= anlIdx || anlIdx < 0) return;
          anlIdx = _self.anlIdx = anlIdx + 1;
          _self.setGraphData(anlIdx);
          _self.setGraph();
          _self.setArrowButton(anlIdx);
        });

      //휴가사용 그래프 다음버튼
      this.$step1.find(".chartBox .cNext")
        .click(function(e){
          var anlIdx = _self.anlIdx;
          if (anlIdx <= 0) return;
          anlIdx = _self.anlIdx = anlIdx - 1;
          _self.setGraphData(anlIdx);
          _self.setGraph();
          _self.setArrowButton(anlIdx);
      });

        
      //Step2 이벤트
      //공지사항 더보기 이벤트
      this.$step2.find(".notice .btnMoreImg").click(function(e)
      {
        //공지사항에 프로파일 메뉴에 등록되어있으면 아래와 같이 하면 권한체크 가능
        
        var profile_id = "";
        var module_id = "";
        var menu_id = "";
        var enc_val = "";
        var enc_val2 = "";
        ajaxSyncRequestXS(hunelOtpVal.Sy_main_page, hunelOtpVal.searchAuth, {S_PGM_ID:"sy_main_412_sl01",S_PGM_URL:"/sys/sy_main/sy_main_412_sl01.jsp"}, function(xs)
        {
          profile_id = xs.GetEtcData("PROFILE_ID");
          module_id = xs.GetEtcData("MODULE_ID");
          menu_id = xs.GetEtcData("MENU_ID");
          enc_val = xs.GetEtcData("ENC_VAL");
          enc_val2 = xs.GetEtcData("ENC_VAL2");
        });
        /*
        ModalUtil.open({url:"/sys/sy_main/sy_main_412_sl01.jsp", title:ajaxLabel("ann_noti_search"), param: {
          X_PROFILE_ID: profile_id,
          X_MENU_NM: ajaxLabel("ann_noti_search"),//공지사항조회
          X_MODULE_ID:module_id,
          X_MENU_ID:menu_id,
          //X_PGM_URL:"/sys/sy_main/sy_main_412_sl01.jsp",
          X_POP_URL:"/sys/sy_main/sy_main_412_sl01.jsp",
          X_ENC_VAL:enc_val
          X_ENC_VAL2:enc_val2
        }});
        */
        
        ModalUtil.open({url:"/sys/sy_main/sy_main_412_sl01.jsp", title:ajaxLabel("ann_noti_search"), param: {}});
        
      });
      
      //퀵메뉴
      var $quickUl = this.$step2.find(".quickMenu .list li");
      $quickUl.click(function(e)
      {
        $aTag = $(this);
        switch($aTag.attr("id"))
        {
          case "quickMenu1":
          {
            window.open("http://www.e-hcg.com");
          }
          break;
          case "quickMenu2":
          {
            //근태/휴가신청
            ajaxSyncRequestXS( hunelOtpVal.Sys_common, hunelOtpVal.getFirstPageInfo,{S_PGM_ID:"sy_appl_200_m01_067"} ,function(xs)
            {
              if(xs.RowCount()>0)
              {
                var item = {
                  PROFILE_ID : xs.GetCellValue(0, "PROFILE_ID")
                 ,MODULE_ID : xs.GetCellValue(0, "MODULE_ID")
                 ,MENU_ID : xs.GetCellValue(0,"MENU_ID")
                 ,PGM_ID : xs.GetCellValue(0,"PGM_ID")
                 ,SQL_ID : xs.GetCellValue(0,"SQL_ID")
                 ,PRS_ID : xs.GetCellValue(0,"PRS_ID")
                 ,EMP_SCH_AUTH_CD : xs.GetCellValue(0,"EMP_SCH_AUTH_CD")
                 ,MENU_NM : xs.GetCellValue(0,"MENU_NM")
                 ,ENC_VAL :xs.GetCellValue(0,"ENC_VAL")
                 ,ENC_VAL2 :xs.GetCellValue(0,"ENC_VAL2")
                 ,PGM_URL :xs.GetCellValue(0,"PGM_URL")
                 ,GEN_YN : xs.GetCellValue(0,"GEN_YN")
                 ,EXP_YN : xs.GetCellValue(0,"EXP_YN")
                 ,MENU_NM : xs.GetCellValue(0,"MENU_NM")
                };
                Hunel.Favorite.openFavorite(item,xs.GetCellValue(0,"MODULE_ID"));
              }
              else
              {
                alert(ajaxMsg("MSG_0009"));
              }
            });
          }
          break;
          case "quickMenu3":
          {
            //급여조회
            ajaxSyncRequestXS( hunelOtpVal.Sys_common, hunelOtpVal.getFirstPageInfo,{S_PGM_ID:"py405_sl01"},function(xs)
            {
              if(xs.RowCount()>0)
              {
                var item = {
                  PROFILE_ID : xs.GetCellValue(0, "PROFILE_ID")
                 ,MODULE_ID : xs.GetCellValue(0, "MODULE_ID")
                 ,MENU_ID : xs.GetCellValue(0,"MENU_ID")
                 ,PGM_ID : xs.GetCellValue(0,"PGM_ID")
                 ,SQL_ID : xs.GetCellValue(0,"SQL_ID")
                 ,PRS_ID : xs.GetCellValue(0,"PRS_ID")
                 ,EMP_SCH_AUTH_CD : xs.GetCellValue(0,"EMP_SCH_AUTH_CD")
                 ,MENU_NM : xs.GetCellValue(0,"MENU_NM")
                 ,ENC_VAL :xs.GetCellValue(0,"ENC_VAL")
                 ,ENC_VAL2 :xs.GetCellValue(0,"ENC_VAL2")
                 ,PGM_URL :xs.GetCellValue(0,"PGM_URL")
                 ,GEN_YN : xs.GetCellValue(0,"GEN_YN")
                 ,EXP_YN : xs.GetCellValue(0,"EXP_YN")
                 ,MENU_NM : xs.GetCellValue(0,"MENU_NM")
                };
                Hunel.Favorite.openFavorite(item,xs.GetCellValue(0,"MODULE_ID"));
              }
              else
              {
                alert(ajaxMsg("MSG_0009"));
              }
            });
          }
          break;
          case "quickMenu4":
          {
            //신청내역
            ajaxSyncRequestXS(hunelOtpVal.Sys_common, hunelOtpVal.getFirstPageInfo,{S_PGM_ID:"sy_appl_200_m01"},function(xs)
            {
              if(xs.RowCount()>0)
              {
                var item = {
                  PROFILE_ID : xs.GetCellValue(0, "PROFILE_ID")
                 ,MODULE_ID : xs.GetCellValue(0, "MODULE_ID")
                 ,MENU_ID : xs.GetCellValue(0,"MENU_ID")
                 ,PGM_ID : xs.GetCellValue(0,"PGM_ID")
                 ,SQL_ID : xs.GetCellValue(0,"SQL_ID")
                 ,PRS_ID : xs.GetCellValue(0,"PRS_ID")
                 ,EMP_SCH_AUTH_CD : xs.GetCellValue(0,"EMP_SCH_AUTH_CD")
                 ,MENU_NM : xs.GetCellValue(0,"MENU_NM")
                 ,ENC_VAL :xs.GetCellValue(0,"ENC_VAL")
                 ,ENC_VAL2 :xs.GetCellValue(0,"ENC_VAL2")
                 ,PGM_URL :xs.GetCellValue(0,"PGM_URL")
                 ,GEN_YN : xs.GetCellValue(0,"GEN_YN")
                 ,EXP_YN : xs.GetCellValue(0,"EXP_YN")
                 ,MENU_NM : xs.GetCellValue(0,"MENU_NM")
                };
                Hunel.Favorite.openFavorite(item,xs.GetCellValue(0,"MODULE_ID"));
              }
              else
              {
                alert(ajaxMsg("MSG_0009"));
              }
            });
          }
          break;
          case "quickMenu5":
          {
            //경조금신청
            ajaxSyncRequestXS(hunelOtpVal.Sys_common, hunelOtpVal.getFirstPageInfo,{S_PGM_ID:"sy_appl_200_m01_033"} ,function(xs)
            {
              if(xs.RowCount()>0)
              {
                var item = {
                  PROFILE_ID : xs.GetCellValue(0, "PROFILE_ID")
                 ,MODULE_ID : xs.GetCellValue(0, "MODULE_ID")
                 ,MENU_ID : xs.GetCellValue(0,"MENU_ID")
                 ,PGM_ID : xs.GetCellValue(0,"PGM_ID")
                 ,SQL_ID : xs.GetCellValue(0,"SQL_ID")
                 ,PRS_ID : xs.GetCellValue(0,"PRS_ID")
                 ,EMP_SCH_AUTH_CD : xs.GetCellValue(0,"EMP_SCH_AUTH_CD")
                 ,MENU_NM : xs.GetCellValue(0,"MENU_NM")
                 ,ENC_VAL :xs.GetCellValue(0,"ENC_VAL")
                 ,ENC_VAL2 :xs.GetCellValue(0,"ENC_VAL2")
                 ,PGM_URL :xs.GetCellValue(0,"PGM_URL")
                 ,GEN_YN : xs.GetCellValue(0,"GEN_YN")
                 ,EXP_YN : xs.GetCellValue(0,"EXP_YN")
                 ,MENU_NM : xs.GetCellValue(0,"MENU_NM")
                };
                Hunel.Favorite.openFavorite(item,xs.GetCellValue(0,"MODULE_ID"));
              }
              else
              {
                alert(ajaxMsg("MSG_0009"));
              }
            });
          }
          break;
        }
      });
      
      //Step3 이벤트
      this.$step3.find(".mprev").click(function(e)
      { //이전달로 이동
        _self.setMainDate(-1);
        $(".calLay .close").trigger("click");
        e.stopPropagation();
      });

      this.$step3.find(".mnext").click(function(e)
      { //다음달로 이동
        _self.setMainDate(1);
        $(".calLay .close").trigger("click");
        e.stopPropagation();
      });

      this.$step3.find(".icoInfo div").each(function()
      { //달력 아이콘 설명
        var $self = $(this);
        $self.hover(function(e)
        {
          $self.stop().clearQueue().addClass("on").animate({width:$self.find(".txt").width()}, "slow", "easeOutBack");
        }, function(e)
        {
          $self.stop().clearQueue().removeClass("on").animate({width:0}, "slow", "easeOutBack");
        });
      });

      $(".calLay .close").click(function(e)
      { //일정등록 닫기
        $(this).parent().parent().hide("blind");
        e.stopPropagation();
      });

      //this.setScheduleEvent("I"); //일정등록 추가
    }
      
    /**
     * 메인에서 사용할 정보 가져오기
     */
   ,getMainInfo : function()
    {
      var _self = this;
      var yy = this.sDate.getFullYear();
      var mm = this.sDate.getMonth() + 1;
      var dd = this.sDate.getDate();
      var ymd = yy + ((mm < 10)? "0":"") + mm + ((dd < 10)? "0":"") + dd;
      ajaxRequestXSProg($("#S_DSCLASS").val(), hunelOtpVal.getMainInfo, {S_TO_YMD:ymd}, function(xs) 
      {
        _self.setStep1(xs);
        _self.setStep2(xs);
        //Hunel.$wrap.fadeIn("slow");
      });
      ajaxRequestXSProg($("#S_DSCLASS").val(), hunelOtpVal.getSchedule, {S_TO_YMD:ymd}, function(xs) 
      {
        _self.setStep3(xs);    
      });
    }

    /**
     * Step1 설정
     * @param xs
     */
   ,setStep1 : function(xs)
    {
      //개인정보 영역
      var arrEmpInfo = ["EMP_NM","EMP_GRADE_NM1","EMP_GRADE_NM","DUTY_NM","OFFICE_TEL_NO","MOBILE_NO","MAIL_ADDR","ORG_NM"];
      var arrApplCnt = ["APPL_CNT","APPR_CNT","ADMIN_CNT"];
      var arrVacCnt = ["BLN_D_CNT","GEN_D_CNT","USE_D_CNT"];
      
      this.$step1.find("span[id]").each(function()
      {
        var $self = $(this);
        var selfId = $self.attr("id");
        if($.protify(arrEmpInfo).include(selfId))
        {
          switch(selfId)
          {
            default :
            {
              $self.text(xs.GetCellValue(0, selfId, "empInfo"));
            }
            break;
          }   
        }
        
        if($.protify(arrApplCnt).include(selfId))
        {
          switch(selfId)
          {
            case "ADMIN_CNT":
            {
              $self.find("em").text(xs.GetCellValue(0, selfId, "applCnt"));
            }
            break;
            default :
            {
              $self.text(xs.GetCellValue(0, selfId, "applCnt"));
            }
            break;
          }  
        }
          
        if($.protify(arrVacCnt).include(selfId))
        {
          switch(selfId)
          {
            default :
            {
              $self.text(xs.GetCellValue(0, selfId, "vacCnt"));
            }
            break;
          }  
        }
      });
          
      //월별 근태 그래프 데이터 셋팅
      this.arrAllCnt = xs.GetCellValue(0, "ANL_USE_M_CNT","monVacCnt").split("^"); //전체연차일수&월
      this.anlStdMm = xs.GetCellValue(0, "ANL_STD_MM", "monVacCnt");    //연차시작월
      this.setGraphData(0);
      this.setArrowButton(0);
      //신청서 리스트 관련 영역
      var $applList = this.$step1.find(".appList .listBody tbody").empty();
      if(xs.RowCount("applList") == 0)
      {
        $applList.append("<tr><td colspan='5' class='mainNoData'>" + ajaxLabel("label_no_data") + "</td></tr>");
      }
      else
      {
        var authParam ={};
        xs.eachRow(function(row)
        {
          var tbody = "";
          tbody += "<tr>";
          tbody += "  <td class='hiddenZone'><span>" + xs.GetCellValue(row, "APPL_TYPE","applList") + "</span></td>";
          tbody += "  <td class='subj'><span>" + xs.GetCellValue(row, "APPL_TYPE_NM","applList") + "</span></td>";
          tbody += "  <td>" + xs.GetCellValue(row, "APPL_YMD","applList") + "</td>";
          tbody += "  <td class='name'><span>" + xs.GetCellValue(row, "TRG_EMP_NM","applList") + "</span></td>";
          var applStatCd = xs.GetCellValue(row, "APPL_STAT_CD", "applList");
          if(applStatCd == "200")
          {
            tbody += "  <td><span class='request'>" + xs.GetCellValue(row, "APPL_STAT_NM","applList") + "</span></td>";
          }
          else if(applStatCd == "900")
          {
            tbody += "  <td><span class='finish'>" + xs.GetCellValue(row, "APPL_STAT_NM","applList") + "</span></td>";
          }
          else
          {
            tbody += "  <td>" + xs.GetCellValue(row, "APPL_STAT_NM","applList") + "</td>";  
          }
          
          tbody += "</tr>";
          
          var $tr = $(tbody);  
          var $detail = $("<td applId='"+xs.GetCellValue(row, "APPL_ID","applList")+"'applType='"+xs.GetCellValue(row, "APPL_TYPE","applList")+"'applYmd='"+xs.GetCellValue(row, "APPL_YMD","applList")+"'pgmNm='"+xs.GetCellValue(row, "PGM_NM","applList")+"'><img src='/resource/images/main/bt_detail.gif' alt='상세보기' /></td>")
                        .click(function(e){
                          authParam.S_APPL_MODE = "APPL";
                          authParam.S_APPL_TYPE = $(this).attr("applType");
                          authParam.S_APPL_ID = $(this).attr("applId");
                          authParam.S_TITLE = ajaxLabel("appl_sch");//신청서 조회
                          ModalUtil.open({url:$(this).attr("pgmNm"), title:ajaxLabel("appl_sch"), param:authParam});
                        });
          $tr.append($detail);
          $applList.append($tr);
        }, false, 0, "applList");
      }
    }

    /**
     * Step2 설정
     * @param xs
     */
   ,setStep2 : function(xs)
    {
      //회사정보
      if(xs.RowCount("companyInfo") == 0)
      {
        this.$step2.find(".news .mainNoData").show();
        this.$step2.find(".viewShort .mainNoData").show();
        this.$step2.find(".news ul").hide();
      }
      else
      {
        var $fullList = this.$step2.find(".news ul").empty();
        var $shortList = this.$step2.find(".viewShort ul").empty();
        var viewFull = "";
        var viewShort = "";
        var type = null;
        var typeClass = null;
        xs.eachRow(function(row)
        {
    
          type = xs.GetCellValue(row, "TYPE", "companyInfo");
          typeClass = "";
    
          switch(type)
          {
            case "con" : typeClass = "stA"; break;
            case "enter" : typeClass = "stB"; break;
            case "birth_day" : typeClass = "stC"; break;
          }
          type = ajaxLabel(type);
    
          viewFull += "<li>";
          viewFull += "  <span class='st " + typeClass + "'>" + type + "</span>";
          viewFull += "  <span class='mdate'>[" + xs.GetCellValue(row, "YMD", "companyInfo") + "]</span>";
          viewFull += "  <span class='subj' >" + xs.GetCellValue(row, "TXT", "companyInfo") + "</span>";
          viewFull += "</li>";
    
          if(row < 6){
            viewShort += "<li>";
            viewShort += "  <span class='st " + typeClass + "'>" + type + "</span>";
            viewShort += "  <span class='mdate'>[" + xs.GetCellValue(row, "YMD", "companyInfo") + "]</span>";
            viewShort += "  <span class='subj'>" + xs.GetCellValue(row, "TXT", "companyInfo") + "</span>";
            viewShort += "</li>";
          }
    
        }, false, 0, "companyInfo");
        $fullList.append(viewFull);
        $shortList.append(viewShort);
      }
    
      //공지사항
      if(xs.RowCount("noti") == 0)
      {
        //if(true){
        this.$step2.find(".notice .mainNoData").show();
        this.$step2.find(".notice ul").hide();
      }
      else
      {
        var $List = this.$step2.find(".notice ul").empty();
        var list = "";
    
        xs.eachRow(function(row)
        {
          list += "<li>";
          list += "  <span class='mdate'>[" + xs.GetCellValue(row, "YMD", "noti") + "]</span>";
          list += "  <span class='subj' no='" + xs.GetCellValue(row, "NOTI_NO", "noti") + "' ENC_VAL='" + xs.GetCellValue(row, "ENC_VAL", "noti") + "'>" + xs.GetCellValue(row, "TXT", "noti") + "</span>";
          list += "</li>";
        }, false, 0, "noti");
        $List.append(list).find("li .subj").click(function(e){
          ModalUtil.open({url: "/sys/sy_main/sy_main_411_p04.jsp", title: ajaxLabel('wig_noti',Page.LANG), param: {
             S_MODE: "S", S_NOTI_NO: $(this).attr("no"), S_ENC_VAL: $(this).attr("ENC_VAL")
          }});
        });
      }
    }
      
    /**
     * Step3 설정
     * @param xs
     */
   ,setStep3 : function(xs)
    {
      this.setMainDate(null, xs);
 
      //Short 달력 만들기
      var $calendarClone = this.$step3.find(".viewFull .sche").clone();
      $calendarClone.find(".icoInfo, .sel .mprev, .sel .mnext, p[class!='day'], .calLay, td div").remove();
      this.$step3.find(".scheMini").empty().append($calendarClone.html());
      //Short 리스트 만들기
      var $listB = this.$step3.find(".viewShort .listB").empty();
      var arrLis = [];
      var calData = this.calData;
      var sDate = this.sDate;
      var yy = sDate.getFullYear();   //4자리 년도 반환 (four digits)
      var mm = sDate.getMonth() + 1;  //월 반환 (from 0-11)
      mm = ((mm < 10)? "0":"") + mm;
      var dd = sDate.getDate();
      dd = ((dd < 10)? "0":"") + dd;
      var today = Number(yy + mm + dd);
      var strYmd = "";
      var appendHtml = "";
   
      for(var i in calData)
      {
        var key = Number(i);
        if(key >= today)
        {
          strYmd = i.substr(0, 4) + "." + i.substr(4,2) + "." + i.substr(6, 2);
          for(var j in calData[i])
          {
            if(arrLis.length == 5)
            {
              break;
            }
            var divClass = "";
            if(calData[i][j].CAL_TYPE == "n1")//개인일정
            {
              divClass = "perChk";
            }
            else if(calData[i][j].CAL_TYPE == "n2")//휴가
            {
              divClass = "restChk";
            }
            else if(calData[i][j].CAL_TYPE == "n3")//기념일
            {
              divClass = "dayChk";
            }
            else if(calData[i][j].CAL_TYPE == "n4")//발령종료예정일
            {
              divClass = "timeChk";  
            }
            arrLis.push("<li><div class='date" + ((key == today)? " on":"") + " "+divClass+"'>[" + strYmd + "]</div><p class='subj'>" + calData[i][j].NOTE + "</p></li>");
            appendHtml += "<li><div class='date" + ((key == today)? " on":"") + " "+divClass+"'>[" + strYmd + "]</div><p class='subj'>" + calData[i][j].NOTE + "</p></li>";
          }
        }
        if(arrLis.length == 5) break;
      }
      $listB.append(appendHtml);
    }
    
    /**
     * main 일정 list 가져오기
     */
   ,setListDate : function(param)
    {
      var shortMonFirstDay = $("#step3").find(".viewShort .scheMini .cal tbody tr").first().find("td").first().attr("ymd");
      var shortMonLastDay = $("#step3").find(".viewShort .scheMini .cal tbody tr").last().find("td").last().attr("ymd");
      var shortMonth = $("#step3").find(".viewShort .scheMini .sel .txt").text().replace(".","");
      var calListData = null;
      if(param.S_YMD >= shortMonFirstDay && param.S_YMD <= shortMonLastDay)
      {
        ajaxSyncRequestXS($("#S_DSCLASS").val(), hunelOtpVal.getSchedule, {S_TO_YMD:shortMonth+"01"}, function(xs) 
        {
          var xsData = {}; //달력 컨텐츠
          var hdData = {}; //근태휴일
          var xsKey;
          var holiday;

          xs.eachRow(function(row)
          {
            xsKey = xs.GetCellValue(row, "CAL_YMD");
            holiday = (xs.GetCellValue(row, "CAL_TYPE") == "H"); //휴일여부

            if(holiday)
            {
              hdData[xsKey] = xsKey;
            }
            else
            {
              if(!xsData[xsKey])
              {
                xsData[xsKey] = [];
              }
              var rowData = {};
              rowData.CAL_YMD = xs.GetCellValue(row,"CAL_YMD");
              rowData.CAL_TYPE = xs.GetCellValue(row,"CAL_TYPE");
              rowData.NOTE = xs.GetCellValue(row,"NOTE");
              rowData.DP_ORDER = xs.GetCellValue(row,"DP_ORDER");
              xsData[xsKey].push(rowData);
            }
          });
          calListData = xsData;
        });
        //Short 리스트 만들기
        var $listB = this.$step3.find(".viewShort .listB").empty();
        var arrLis = [];
        var sDate = new Date();
        var yy = sDate.getFullYear();   //4자리 년도 반환 (four digits)
        var mm = sDate.getMonth() + 1;  //월 반환 (from 0-11)
        mm = ((mm < 10)? "0":"") + mm;
        var dd = sDate.getDate();
        dd = ((dd < 10)? "0":"") + dd;
        var today = Number(yy + mm + dd);
        var strYmd = "";
        var appendHtml = "";
        for(var i in calListData)
        {
          var key = Number(i);
          if(key >= today)
          {
            strYmd = i.substr(0, 4) + "." + i.substr(4,2) + "." + i.substr(6, 2);
            for(var j in calListData[i])
            {
              if(arrLis.length == 5)
              {
                break;
              }
              var divClass = "";
              if(calListData[i][j].CAL_TYPE == "n1")//개인일정
              {
                divClass = "perChk";
              }
              else if(calListData[i][j].CAL_TYPE == "n2")//휴가
              {
                divClass = "restChk";
              }
              else if(calListData[i][j].CAL_TYPE == "n3")//기념일
              {
                divClass = "dayChk";
              }
              else if(calListData[i][j].CAL_TYPE == "n4")//발령종료예정일
              {
                divClass = "timeChk";  
              }
              arrLis.push("<li><div class='date" + ((key == today)? " on":"") + " "+divClass+"'>[" + strYmd + "]</div><p class='subj'>" + calListData[i][j].NOTE + "</p></li>");
              appendHtml += "<li><div class='date" + ((key == today)? " on":"") + " "+divClass+"'>[" + strYmd + "]</div><p class='subj'>" + calListData[i][j].NOTE + "</p></li>";
            }
          }
          if(arrLis.length == 5) break;
        }
        $listB.append(appendHtml);
      }
    }
    
    /**
     * Step1의 직원검색
     */
   ,searchEmp : function()
    {
      var S_SCH_TEXT_YN = "";
      var S_SCH_EMP_NM = $("#S_SCH_EMP_NM").val();
      
      if( S_SCH_EMP_NM == "" )
      {
        S_SCH_TEXT_YN = "N";
      }
      else
      {
        S_SCH_TEXT_YN = "Y";
      }
      ModalUtil.open({url: "/pas/pa_stat/pa_stat_480_p01.jsp", title:ajaxLabel("search_emp"),param: {S_SCH_EMP_NM: S_SCH_EMP_NM, S_SCH_TEXT_YN: S_SCH_TEXT_YN }});
    }
 
    /**
     * Step1의 그래프 데이터 설정
     * arrAllCnt 전체근태(일수&월)데이터(0번배열:6월전~현재, 1번배열:12월전~6월전)
     * this.anlIdx(idx) 그래프관련 인덱스로써 DB에서 가져오는 데이터를 ^ 기준으로 나눈 arrAllCnt 의 배열인덱스로 사용된다.
     * arrAnlCnt 근태데이터(0번배열:일수, 1번배열:월)
     * arrTamCnt 월별 근태 사용 일수
     * arrMonth 근태 사용 월
     */
   ,setGraphData : function(idx) 
    {
      this.arrAnlCnt = this.arrAllCnt[idx].split("@");
      var arrTamCnt = this.arrTamCnt = this.arrAnlCnt[0].split(",");
      var arrMonth = this.arrMonth = this.arrAnlCnt[1].split(",");
      $(".chart li .standard .month").each(function(i)
      {
        $(this).text(arrMonth[i]);
      });
      $(".chart li .graph .day").each(function(i)
      {
        $(this).text(arrTamCnt[i]);
      });
    } 
    
    /**
     * Step1의 그래프 설정
     * arrData 근태사용일수
     * toMonth 연차시작월을 의미한다.
     */
   ,setGraph : function()
    {
      var _self = MainPage;
      if(_self.curStep == "step1")
      {
        var arrData = _self.arrTamCnt||0;
        var arrMax = arrayMax(arrData)||0;
        var toMonth = _self.anlStdMm;
        _self.$step1.find(".graph").each(function(idx, elem)
        {
          var $li = $(this).closest("li").removeClass("zero");
          $(this).removeClass("zero").css({height:0}).animate({height: parseInt((arrData[idx]/arrMax) * 52) + "%"}).children().text(arrData[idx]);
          if(arrData[idx] == 0)
          {
            $(this).addClass("zero");
          }
        });
        //그래프 리스트의 활성화 여부(연차 시작월을 활성화한다.)
        _self.$step1.find(".standard .month").each(function(idx, elem)
        {
          var mon = Number($(this).text().substring(5, $(this).text().length));
          if (mon == Number(toMonth))
          {
            $(this).parent().parent().addClass("on");
          }
          else
          {
            $(this).parent().parent().removeClass("on");
          }
        });
        //delete _self.setGraph;
      }
    }
 
    /**
     * Step1 그래프의 화살표 버튼 활성화 제어
     */
   ,setArrowButton : function(idx)
    {
      var _self = MainPage;
      if (idx == 0) 
      {
        _self.$step1.find(".chartBox .cPrev").addClass("on");
        _self.$step1.find(".chartBox .cNext").removeClass("on");
      }
      else
      {
        _self.$step1.find(".chartBox .cNext").addClass("on");
        _self.$step1.find(".chartBox .cPrev").removeClass("on");
      }
    }
    /**
     * Main 화면을 보여준다.
     */
   ,showMain : function()
    {
      //20130129 현재 step의 width를 animation으로 변경시킬 때 div 우측 위치가 미세하게 움직이는 현상이 있어 position으로 위치를 잡아준다.
      if(this.curStep == this.prevStep) return;
      var _self = this;
      $("#" + this.prevStep + " .viewFull").hide();
      $("#" + this.prevStep + " .viewShort").show();
      $("#" + this.curStep + " .viewShort").fadeOut(this.aniSpeed, function()
      {
        $("#" + _self.curStep + " .viewFull").show(0, _self.setGraph);
        //$("#" + _self.curStep + " .viewFull").show();
      });
      
      switch(this.curStep)
      {
        case "step1" : 
        {
          this.$step1.animate({width: this.stepExpWidth}, this.aniSpeed);
          if(this.prevStep == "step2")
          {
            this.$step2.css({right: (this.stepDefWidth + this.stepMargin), left:"auto"}).animate({width: this.stepDefWidth}, this.aniSpeed);  
          }
          else
          {
            this.$step2.css({right: (this.stepExpWidth + this.stepMargin), left:"auto"}).animate({right: (this.stepDefWidth + this.stepMargin)}, this.aniSpeed);
            this.$step3.animate({width: this.stepDefWidth}, this.aniSpeed);
          }
        }
        break;
        case "step2" :
        {
          if(this.prevStep == "step1")
          {
            this.$step1.animate({width: this.stepDefWidth}, this.aniSpeed);
            this.$step2.css({right: (this.stepDefWidth + this.stepMargin), left:"auto"}).animate({width: this.stepExpWidth}, this.aniSpeed);
          }
          else
          {
            this.$step2.css({left: (this.stepDefWidth + this.stepMargin), right:"auto"}).animate({width: this.stepExpWidth}, this.aniSpeed);
            this.$step3.animate({width: this.stepDefWidth}, this.aniSpeed);
          }
        }
        break;
        case "step3" :
        {
          this.$step3.animate({width: this.stepExpWidth}, this.aniSpeed);
          if(this.prevStep == "step2")
          {
            this.$step2.css({left: (this.stepDefWidth + this.stepMargin), right:"auto"}).animate({width: this.stepDefWidth}, this.aniSpeed);
          }
          else
          {
            this.$step1.animate({width: this.stepDefWidth}, this.aniSpeed);
            this.$step2.animate({right: (this.stepExpWidth + this.stepMargin)}, this.aniSpeed); 
          }
        }
        break;
      }
    }
      
    /**
     * 스케쥴 달력 일자를 셋팅한다.
     * @param mon - 변경 월(전월, 후월)
     */
   ,setMainDate : function(mon, xs)
    {
      var sDate = this.sDate;

      if(mon == 1)
      {
        sDate = new Date(sDate.getFullYear(), sDate.getMonth() + mon, (this.today > this.nLastDay)? this.nLastDay:this.today);
      }
      else if(mon == -1)
      {
        sDate = new Date(sDate.getFullYear(), sDate.getMonth() + mon, (this.today > this.pLastDay)? this.pLastDay:this.today);
      }

      this.sDate = sDate;
      this.pDate = new Date(sDate.getFullYear(), sDate.getMonth(), 0);
      this.nDate = new Date(sDate.getFullYear(), sDate.getMonth() + 2, 0);
      this.pLastDay = this.pDate.getDate();
      this.sLastDay = new Date(sDate.getFullYear(), sDate.getMonth() + 1, 0).getDate();
      this.nLastDay = this.nDate.getDate();
      this.sFirstDow = new Date(sDate.getFullYear(), sDate.getMonth(), 1).getDay();

      if(xs)
      {
        this.makeCalendar(xs);
      }
      else
      {
        var yy = this.sDate.getFullYear();
        var mm = this.sDate.getMonth() + 1;
        var dd = this.sDate.getDate();
        var ymd = yy + ((mm < 10)? "0":"") + mm + ((dd < 10)? "0":"") + dd;

        ajaxRequestXSProg($("#S_DSCLASS").val(), hunelOtpVal.getSchedule, {S_TO_YMD:ymd}, function(xs) 
        {
          MainPage.makeCalendar(xs);
        });
      }
    }

    /**
     * 달력
     * @param xs - 달력에 적용할 데이터 xSheet
     */
   ,makeCalendar : function(xs)
    {
      var sDate = this.sDate;
      this.$calendar.empty();
      var yy = sDate.getFullYear();   //4자리 년도 반환 (four digits)
      var mm = sDate.getMonth() + 1;  //월 반환 (from 0-11)
      mm = ((mm < 10)? "0":"") + mm;
      var dow = this.sFirstDow;       //요일 반환 (from 0-6)

      var prevDow = dow - 1; //해당월의 1일이 일요일이 아닐때 사용

      var sDay = 0;   //셋팅 날짜
      var tbody = "";
      var tdClass = "";
      var monthOver = false;  //해당월 초과 여부

      //<-- 현재월의 오늘 날짜를 표현해 줄 때 사용
      var tDate = new Date();
      var isToYm = (tDate.getFullYear() + "" + tDate.getMonth()) == (yy + "" + sDate.getMonth());
      //-->

      this.$step3.find(".sche .sel span.txt").text(yy + "." + mm);

      var calYmd = ""; //년월일
      var pYy = this.pDate.getFullYear();
      var pMm = this.pDate.getMonth() + 1;
      var nYy = this.nDate.getFullYear();
      var nMm = this.nDate.getMonth() + 1;
      pMm = ((pMm < 10)? "0":"") + pMm;
      nMm = ((nMm < 10)? "0":"") + nMm;

      var xsData = {}; //달력 컨텐츠
      var hdData = {}; //근태휴일
      var xsKey;
      var holiday;

      xs.eachRow(function(row)
      {
        xsKey = xs.GetCellValue(row, "CAL_YMD");
        holiday = (xs.GetCellValue(row, "CAL_TYPE") == "H"); //휴일여부

        if(holiday)
        {
          hdData[xsKey] = xsKey;
        }
        else
        {
          if(!xsData[xsKey])
          {
            xsData[xsKey] = [];
          }
          var rowData = {};
          rowData.CAL_YMD = xs.GetCellValue(row,"CAL_YMD");
          rowData.CAL_TYPE = xs.GetCellValue(row,"CAL_TYPE");
          rowData.NOTE = xs.GetCellValue(row,"NOTE");
          rowData.DP_ORDER = xs.GetCellValue(row,"DP_ORDER");
          xsData[xsKey].push(rowData);
        }
      });
      this.calData = xsData;
      
      for(var i=0; i < 6; i++)
      {
        tbody += "<tr>";

        for(var j=0; j < 7; j++)
        {
          tdClass = "";

          if(prevDow > -1)
          { //1일이 일요일이 아니면 이전월의 남을 일자를 셋팅한다.
            sDay = this.pLastDay - prevDow;
            prevDow--;
            tdClass = "other";
            calYmd = pYy + pMm + sDay;
          }
          else
          {
            //이전월 일자 셋팅이 끝남
            if(prevDow == -1)
            {
              sDay = 0;
              prevDow--;
            }
            sDay++;

            if(sDay > this.sLastDay)
            { //해당월의 마지막 일자를 초과하면 다음달 1일부터 셋팅한다.
              monthOver = true;
              sDay = 1;
            }

            if(monthOver)
            {
              tdClass = "other";
              calYmd = nYy + nMm + ((sDay < 10)? "0":"") + sDay;
            }
            else
            {
              if(j == 0)
              { //일요일
                tdClass = "sun";
              }
              else if(j == 6)
              { //토요일
                tdClass = "sat";
              }
                
              calYmd = yy + mm + ((sDay < 10)? "0":"") + sDay;
              if(hdData[calYmd]) tdClass = "sun"; //근태휴일이면

              //if(sDay == this.today) tdClass += " today"; //매월 오늘 날짜를 표현해 줄 때 사용
              if(isToYm && sDay == this.today)
              {
                tdClass += " today"; //현재 월의 오늘 날짜를 표현해 줄 때 사용
              }
            }
          }
          //달력입력 레이어의 border가 일요일,토요일이면 끝부분이 가려지는 현상때문에...
          if(j == 0)
          {
            tdClass += " left";
          }
          else if(j == 6)
          {
            tdClass += " right";
          }

          tbody += "<td class='" + tdClass + "' ymd='" + calYmd + "'>";
          tbody += "  <p class='day'>" + sDay + "</p>";
          tbody += "    <div style='overflow:hidden; height:42px;'>";

          if(xsData[calYmd])
          {
            var more = false;
            for(var k=0; k < xsData[calYmd].length; k++)
            {
              if(k > 2) more = true;
              tbody += "      <p class='" + xsData[calYmd][k].CAL_TYPE + "'>" + xsData[calYmd][k].NOTE + "</p>";
            }
            tbody += "    </div>";
            if(more)
            {
              tbody += "<p class='more'></p>";
            }
          }
          tbody += "</td>";
        }
        tbody += "</tr>";
      }
        
      var mainSelf = this;
      this.$calendar.append(tbody).find("td").click(function(e)
      {
        var $self = $(this);          
        mainSelf.showSchedule($self);
        e.stopPropagation();
      });
    }
      
    /**
     * 스케쥴 에디터를 보여준다.
     * @param $self - 선택한 달력 일자 정보
     */
   ,showSchedule : function($self)
    {
      var $editLayer = this.$step3.find(".viewFull .calLay");
      var editYmd = $self.attr("ymd");

      if(editYmd == $editLayer.data("ymd"))
      {
        $editLayer.toggle("blind");
        return;
      }

      var $cal = this.$step3.find(".viewFull .cal");
      var $selfPos = $self.position();
      var layerTop = $selfPos.top + $self.outerHeight();
      var layerLeft = $selfPos.left;
      
      /*
      if(!$.browser.msie){
        layerTop += this.clientTop;
      }
      */
        
      if(layerTop + $editLayer.outerHeight() > $cal.height() + 61)
      { //달력상단 년월 보여주는 영역의 높이 61px을 더해준다
        layerTop = $selfPos.top - $editLayer.outerHeight();
      }

      if(layerLeft + $editLayer.outerWidth() > $cal.width())
      {
        layerLeft = $selfPos.left - $editLayer.outerWidth() + $self.outerWidth();
      }
      
      if($self.hasClass("left"))
      {
        layerLeft = layerLeft+1;
      }
      else if($self.hasClass("right"))
      {
        layerLeft = layerLeft-1;
      }
      //console.log("$selfPos="+$selfPos);

      $editLayer.data("ymd", editYmd).find(".mdate").text(editYmd.substr(0, 4) + "." + editYmd.substr(4, 2) + "." + editYmd.substr(6));
      var $con = $editLayer.find(".con").empty();
      var strCon = "";
      var limitCnt = 5;
      var calData = this.calData;
      if(calData[editYmd])
      {
        for(var i=0; i < calData[editYmd].length; i++)
        {
          if(i == limitCnt) break;
          strCon += "<div class='n " + calData[editYmd][i].CAL_TYPE + "' seqno='" + calData[editYmd][i].DP_ORDER + "'>";

          if(calData[editYmd][i].CAL_TYPE == "n1")
          {
            strCon += "<input type='text' value='" + calData[editYmd][i].NOTE + "' /><span class='btnMod'><span class='hiddenZone'>수정</span></span><span class='btnDel'><span class='hiddenZone'>삭제</span></span>";
          }
          else
          {
            strCon += calData[editYmd][i].NOTE;
          }

          strCon += "</div>";
        }
        $con.append(strCon);

        this.setScheduleEvent("U");
        this.setScheduleEvent("D");
      }
      var $write = $editLayer.find(".write");
      if($write.children().length == 0)
      {
        $write.append("<input type=\"text\" placeholder=\""+ajaxLabel("sch_input_plz")+"\" onfocus=\"this.value=''\" /><span class='btnAdd'>"+ajaxLabel("insert")+"</span>");
        $write.find("input").placeholder();//ie9이하는 placeholder속성을 알지 못함.
        this.setScheduleEvent("I"); //일정등록 추가
      }
      else
      {
        $write.find("input").val("");
      }
      $editLayer.hide().css({top:layerTop, left:layerLeft}).show("blind");
    }
      
    /**
     * 스케쥴 저장
     * @param param - 서버에 보낼 파라미터
     * @param func - 처리가 끝난 후 실행 할 콜백 함수
     */
   ,saveSchedule : function(param, func)
    {
      ajaxSyncRequestXS($("#S_DSCLASS").val(), hunelOtpVal.saveSchedule, param, function(xs) 
      {
        func(xs);
      });
      MainPage.setListDate(param);
    }
      
    /**
     * 스케쥴 에디터 이벤트 설정
     * @param flag - I, U, D 구분
     */
   ,setScheduleEvent : function(flag)
    {
      var $editLayer = this.$step3.find(".viewFull .calLay");
      switch(flag)
      {
        case "I" :
        {
          $editLayer.find(".write .btnAdd").click(function(e)
          {
            var $self = $(this);
            if($editLayer.find(".con div").length == 5){
              alert(ajaxMsg("MSG_ALERT_MAIN_0001"));//더이상 추가하실 수 없습니다.
              return;
            }
            
            var ymd = $self.closest(".calLay").data("ymd");
            var note = $self.siblings("input").val();
            var param = {S_YMD:ymd, S_NOTE:note, S_CSTATUS:"I"};
 
            if(!note)
            {
              alert(ajaxMsg("MSG_ALERT_MAIN_0002"));//일정을 입력 해주세요
              $self.siblings("input").focus();
              return;
            }

            MainPage.saveSchedule(param, function(xs)
            {
              var calData = MainPage.calData;
              var seqNo = xs.GetEtcData("SEQ_NO");
              var data = {CAL_TYPE:"n1", CAL_YMD:ymd, DP_ORDER:seqNo, NOTE:note};
              var item1 = "<p class='n1'>" + note + "</p>";
              var item2 = "<div class='n n1' seqno='" + seqNo + "'><input type='text' value='" + note + "' /><span class='btnMod'><span class='hiddenZone'>수정</span></span><span class='btnDel'><span class='hiddenZone'>삭제</span></span></div>";

              var $td = MainPage.$calendar.find("td[ymd='" + ymd + "']");
              var $con = $editLayer.find(".con");

              if(!calData[ymd])
              {
                calData[ymd] = [data];
                MainPage.$calendar.find("td[ymd='" + ymd + "'] div").append(item1);
                $con.append(item2);
              }
              else
              {
                var idx = 0;
                for(var i=0; i < calData[ymd].length; i++)
                {
                  if(calData[ymd][i].CAL_TYPE != "n1")
                  {
                    break;
                  }
                  idx++;
                }
                calData[ymd].splice(idx, 0, data);
                if(calData[ymd].length > 3)
                { //일정이 3개 이상이면
                  if(!$td.find("p.more").length)
                  { //more 표시가 없으면
                    $td.append("<p class='more'></p>");
                  }
                }

                if($td.find("div p.n1:eq(-1)").length)
                { //추가할 영역에 n1 클래스가 있으면 마지막 n1 뒤에 추가한다.
                  $td.find("div p.n1:eq(-1)").after(item1);
                  $con.find("div.n1:eq(-1)").after(item2);
                }
                else
                { //n1 클래스가 없으면 맨 앞에 추가한다.
                  $td.find("div").prepend(item1);
                  $con.prepend(item2);
                }
              }
              MainPage.setScheduleEvent("U");
              MainPage.setScheduleEvent("D");
              $self.siblings("input").val("");
            });
          });
        }
        break;
        case "U" :
        {
          $editLayer.find(".con .btnMod").unbind("click").click(function(e)
          {
            if(confirm(ajaxMsg("MSG_CONFIRM_MAIN_0001")))
            {//수정 하시겠습니까?
              var $self = $(this);
              var idx = $editLayer.find(".con .btnMod").index(this);
              var ymd = $self.closest(".calLay").data("ymd");
              var note = $self.siblings("input").val();
              var param = {S_YMD:ymd, S_SEQ_NO:$self.parent().attr("seqno"), S_NOTE:note, S_CSTATUS:"U"};
              MainPage.saveSchedule(param, function()
              {
                MainPage.calData[ymd].NOTE = note;
                MainPage.$calendar.find("td[ymd='" + ymd + "'] div p.n1:eq(" + idx + ")").text(note);
              });
            }
          });
        }
        break;
        case "D" :
        {
          $editLayer.find(".con .btnDel").unbind("click").click(function(e)
          {
            if(confirm(ajaxMsg("MSG_CONFIRM_MAIN_0002")))
            {//삭제 하시겠습니까?
              var $self = $(this);
              var idx = $editLayer.find(".con .btnDel").index(this);
              var ymd = $self.closest(".calLay").data("ymd");
              var param = {S_YMD:ymd, S_SEQ_NO:$self.parent().attr("seqno"), S_CSTATUS:"D"};
              MainPage.saveSchedule(param, function()
              {
                var calData = MainPage.calData[ymd];
                calData.splice(idx, 1);
                var $td = MainPage.$calendar.find("td[ymd='" + ymd + "']");
                $td.find("div p.n1:eq(" + idx + ")").remove();
                if(calData.length < 4){
                  $td.find("p.more").remove();
                }
                $self.parent().remove();
              });
            }
          });
        }
        break;
      }
    }
  
};