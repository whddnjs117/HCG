var Hunel = 
{
  GrayWrapLayer : {}
 ,LayoutMenuType : 'D'//메인화면의 레이아웃 (D:상단과좌측메뉴, T:상단메뉴만, L:좌측메뉴만, N:메뉴안보이기
 ,showLayoutPop : function(bShow)
  {
    var $layoutPop = $("#layoutLayer");
    var $header    = $("#header");
    var nTop = 1;
    if($header.css("display")!="none")
    {
      nTop += $header.height() + 2;
    }
    $layoutPop.css("top",nTop.toString()+"px");
    if(bShow)
    {
      $layoutPop.css("display","block");
    }
    else
    {
      $layoutPop.css("display","none");
    }
  }
 ,changeLayout : function(sMenuType)
  {
    Hunel.LayoutMenuType = sMenuType;
    var $btnLayoutMenu = $("#btnLayoutMenu");
    switch(sMenuType)
    {
      case "D":
      {
        //상단,좌측메뉴 모두 보이기
        $(".left_toggle_open" ).css("display","none");
        $(".left_toggle_close").css("display","block");
        $(".lnb_top_button").css("display","block");
        Layout.showBox("header",  false);
        Layout.showBox("menubox", false);
        Layout.resize();
        $btnLayoutMenu.prop("class","layoutBtn01");
      }
      break;
      case "T":
      {
        $(".left_toggle_open" ).css("display","block");
        $(".left_toggle_close").css("display","none");
        $(".lnb_top_button").css("display","none");
        //상단메뉴 보이고 좌측메뉴감추기
        Layout.showBox("header",  false);
        Layout.hideBox("menubox", false);
        Layout.resize();
        $btnLayoutMenu.prop("class","layoutBtn02");
      }
      break;
      case "L":
      {
        $(".left_toggle_open" ).css("display","none");
        $(".left_toggle_close").css("display","block");
        $(".lnb_top_button").css("display","block");
        //상단메뉴 감추고 좌축메뉴만 보이기
        Layout.hideBox("header",  false);
        Layout.showBox("menubox", false);
        Layout.resize();
        $btnLayoutMenu.prop("class","layoutBtn03");
      }
      break;
      case "N":
      {
        $(".left_toggle_open" ).css("display","block");
        $(".left_toggle_close").css("display","none");
        $(".lnb_top_button").css("display","none");
        //메뉴 모두 감추기
        Layout.hideBox("header",  false);
        Layout.hideBox("menubox", false);
        Layout.resize();
        $btnLayoutMenu.prop("class","layoutBtn04");
      }
      break;
    }
    Hunel.showLayoutPop(false);
  }
  //Hunel MdiTab start
 ,MdiTab : 
  {
    OpenPageCnt : 0
   ,Page : []
   ,CurrentIFrame : ""
   ,Use : true
   ,DuplicateOpen : false //같은 메뉴를 여러번 열리게 할 건지 여부
   ,UseMaxLimitAlert : true // 설정된 페이지 이상이 열렸을 때 첫 페이지 닫기를 사용자에게 물을건지 여부
   ,removeIcon : function(iframe_name) 
    {
      var icon_name = iframe_name.replace("iframe_biz_", "MDIIconTab_");
      $("#" + icon_name).remove();
    }
   ,removePage : function(iframe_name) 
    {
      var arr = $.protify(Hunel.MdiTab.Page);
      Hunel.MdiTab.Page = arr.without(iframe_name);
    }
   ,addPage : function(iframe_name) 
    {
      Hunel.MdiTab.Page.push(iframe_name);
    }
   ,reorderPage : function() 
    {
      Hunel.MdiTab.Page = [];
      // 사용자가 탭의 위치를 변경했을때 Page 배열의 순서도 변경한다.
      $("#MDI_Icon_List").children().each(function(){
        Hunel.MdiTab.Page.push($(this).attr("IFRAME_NAME"));
      });
    }
   ,reset : function() 
    {
      Hunel.MdiTab.OpenPageCnt = 0;
      Hunel.MdiTab.CurrentIFrame = "";
      Hunel.MdiTab.Page = [];
      $("#MDI_Icon_List").html("");
    }
   ,deActiveIcon : function(icon)  
    {
      // 탭이 비활성화 될 때
      if ($(icon).attr("Lock")=="true") {
        $(icon).attr("class", "lock");
      } else {
        $(icon).attr("class", "");
      }
    }
   ,deActiveIconAll : function() 
    {
      // 모든 탭을 비활성화 시킨다.
      var arr = $.protify(Hunel.MdiTab.Page);
      arr.each(function(item) {
        var icon = $("#" + item.replace("iframe_biz_", "MDIIconTab_"));
        Hunel.MdiTab.deActiveIcon(icon);
      });
    }
   ,activeIcon : function(icon) 
    { 
      // 탭이 활성화 될 때 타이틀을 교체
      if (icon.attr("Lock")=="true") 
      {
        icon.attr("class", "lock_on");
      }
      else
      {
        icon.attr("class", "on");
      }
      Hunel.MdiTab.CurrentPage = icon;
      Hunel.MdiTab.hideIconFuncModal();
    }
   ,chgActiveIcon : function(iframe_name) 
    {
      Hunel.MdiTab.deActiveIconAll();
      var icon = $("#" + iframe_name.replace("iframe_biz_", "MDIIconTab_"));
      Hunel.MdiTab.activeIcon(icon);
    }
   ,makeIconTxt : function(sMenuTxt) 
    {
      if (sMenuTxt.length > nTabIconMaxTxt) 
      {
        sMenuTxt = sMenuTxt.substring(0, nTabIconMaxTxt) + "..";
      }
      return sMenuTxt;
    }
   ,makeIcon : function(menu, iframe_name)
    { 
      // 메뉴가 선택되면 tab 아이콘을 만들어낸다.
      Hunel.MdiTab.deActiveIconAll();
      /*
       * var iconHtml = "<span class='MDITabBtn'>" + "<span
       * class='MDITabBtnTxt' onclick=\"Hunel.MainFrame.showIframe('" +
       * iframe_name + "')\">" +
       * Hunel.MdiTab.makeIconTxt($(menu).attr("MENU_NM")) + "</span>" + "<span
       * class='MDITabClose' onclick=\"Hunel.MainFrame.closeMenu('" +
       * iframe_name + "')\">X</span>" + "</span>";
       */
      var iconHtml = "<a class='MDITabBtn' href=\"javascript:Hunel.MainFrame.showIframe('"
          + iframe_name
          + "')\" class=\"on\">"
          + Hunel.MdiTab.makeIconTxt($(menu).attr("MENU_NM"))
          + "</a>"
          + "<a href=\"javascript:Hunel.MainFrame.closeMenu('"
          + iframe_name + "')\" class=\"btn_close\">닫기</a>";

      // 메뉴와 연결이 끝난뒤에 필요한 정보를 icon에 붙여둔다.
      
      var icon = $("<li></li>");
      icon.attr("id",               iframe_name.replace("iframe_biz_", "MDIIconTab_"));
      icon.attr("class",            "MDITab");
      icon.attr("iconTitle",        $(menu).attr("MENU_NM"));
      icon.attr("PGM_ID",           $(menu).attr("PGM_ID"));
      icon.attr("MODULE_ID",        $(menu).attr("MODULE_ID"));
      icon.attr("PROFILE_ID",       $(menu).attr("PROFILE_ID"));
      icon.attr("POST_CNT",         $(menu).attr("POST_CNT"));
      icon.attr("HELP_YN",          $(menu).attr("HELP_YN"));
      icon.attr("MENU_NM",          $(menu).attr("MENU_NM"));
      icon.attr("MENU_ID",          $(menu).attr("MENU_ID"));
      icon.attr("SQL_ID",           $(menu).attr("SQL_ID"));
      icon.attr("PRS_ID",           $(menu).attr("PRS_ID"));
      icon.attr("EMP_SCH_AUTH_CD",  $(menu).attr("EMP_SCH_AUTH_CD"));
      icon.attr("PGM_URL",          $(menu).attr("PGM_URL"));
      icon.attr("GEN_YN",           $(menu).attr("GEN_YN"));
      icon.attr("MENU_CLASS",       $(menu).attr("MENU_CLASS"));
      icon.attr("ENC_VAL",          $(menu).attr("ENC_VAL"));
      icon.attr("ENC_VAL2",         $(menu).attr("ENC_VAL2"));
      icon.attr("LOCK",             false);
      icon.attr("IFRAME_NAME",      iframe_name);
      icon.html(iconHtml);
      

      Hunel.MdiTab.activeIcon(icon);
      $("#MDI_Icon_List").append(icon);

      $("#MDI_Icon_List").sortable( {
        axis : "x",
        distance : 5,
        update : function(event, ui) {
          Hunel.MdiTab.reorderPage();
        }
      });
    }
   ,lastPageView : function() 
    {
      if ($("#" + Hunel.MdiTab.CurrentIFrame) != undefined)
      {
        $("#" + Hunel.MdiTab.CurrentIFrame).css("display", "none");
      }
      Hunel.MdiTab.CurrentIFrame = $.protify(Hunel.MdiTab.Page).last();
      $("#" + Hunel.MdiTab.CurrentIFrame).css("display", "");
      Hunel.MdiTab.chgActiveIcon(Hunel.MdiTab.CurrentIFrame);
    }
   ,showIconFuncModal : function() 
   {
      $("#Stage_Modal_Icon").css("left", $("#"+ Hunel.MdiTab.CurrentIFrame.replace("iframe_biz_", "MDIIconTab_")).offset().left);
      $("#Stage_Modal_Icon").css("top" , $("#"+ Hunel.MdiTab.CurrentIFrame.replace("iframe_biz_", "MDIIconTab_")).offset().top + 23);

      Hunel.MdiTab.hideAllTabFuncBtns();

      var tabFuncBtns = [];
      if ($(Hunel.MdiTab.CurrentPage).attr("Lock") == "true")
      {
        tabFuncBtns = [ $("#tabFunc1"), $("#tabFunc3"), $("#tabFunc4"), $("#tabFunc5") ];
      }
      else
      {
        tabFuncBtns = [ $("#tabFunc1"), $("#tabFunc2"), $("#tabFunc4"), $("#tabFunc5") ];
      }
      $("#Stage_Modal_Icon").css("display", "block");
      $(tabFuncBtns).each(function() {
        $(this).css("display", "block");
      });
    }
   ,hideIconFuncModal : function() 
    {
      $("#Stage_Modal_Icon").css("display", "none");
    }
   ,hideAllTabFuncBtns : function() 
    {
      var tabFuncBtns = [ $("#tabFunc1"), $("#tabFunc2"), $("#tabFunc3"),$("#tabFunc4"),$("#tabFunc5") ];
      $(tabFuncBtns).each(function() {
        $(this).css("display", "none");
      });
    }
   ,reloadTabPage : function() 
    {
      // 탭페이지를 새로 읽기
      if ( ! confirm(ajaxMsg("MSG_CONFIRM_MAIN_0010", Page.LANG, $(Hunel.MdiTab.CurrentPage).attr("MENU_NM"))) ) return;   // 열려있는 # 페이지를 새로고침하시겠습니까?
      var sMenuClass = $(Hunel.MdiTab.CurrentPage).attr("MENU_CLASS");
      var action = "";
      if (sMenuClass == "40") 
      {
        action = CONDITION_SEARCH_URL;
      }
      else if (sMenuClass == "50") 
      {
        action = PROCESSMAP_URL;  
      }
      else 
      {
        action = $(Hunel.MdiTab.CurrentPage).attr("PGM_URL");
      };

      var param = {
        X_PROFILE_ID : $(Hunel.MdiTab.CurrentPage).attr("PROFILE_ID")
       ,X_MODULE_ID : $(Hunel.MdiTab.CurrentPage).attr("MODULE_ID")
       ,X_MENU_ID : $(Hunel.MdiTab.CurrentPage).attr("MENU_ID")
       ,X_PGM_ID : $(Hunel.MdiTab.CurrentPage).attr("PGM_ID")
       ,X_SQL_ID : $(Hunel.MdiTab.CurrentPage).attr("SQL_ID")
       ,X_PRS_ID : $(Hunel.MdiTab.CurrentPage).attr("PRS_ID")
       ,X_PGM_URL : $(Hunel.MdiTab.CurrentPage).attr("PGM_URL")
       ,X_ENC_VAL : $(Hunel.MdiTab.CurrentPage).attr("ENC_VAL")
       ,X_ENC_VAL2 : $(Hunel.MdiTab.CurrentPage).attr("ENC_VAL2")
       ,X_EMP_SCH_AUTH_CD : $(Hunel.MdiTab.CurrentPage).attr("EMP_SCH_AUTH_CD")
       ,X_MENU_NM : $(Hunel.MdiTab.CurrentPage).attr("MENU_NM")
       ,GEN_YN : $(Hunel.MdiTab.CurrentPage).attr("GEN_YN")
       ,S_SQL_ID : $(Hunel.MdiTab.CurrentPage).attr("SQL_ID") || ""
       ,S_PRS_ID : $(Hunel.MdiTab.CurrentPage).attr("PRS_ID") || ""
       ,S_PROFILE_ID : $(Hunel.MdiTab.CurrentPage).attr("PROFILE_ID") || ""
       ,S_TOP_FRAME_TYPE : S_TOP_FRAME_TYPE
      };
    
      popOpen( {
        url : action
       ,name : Hunel.MdiTab.CurrentIFrame
       ,param : param
      });
    
      //일부 브라우저에서 reload가 post정보를 없애서 다시 전송
      //eval(Hunel.MdiTab.CurrentIFrame + ".document.location.reload()");
      Hunel.MdiTab.hideIconFuncModal();
    }
   ,closeTabPage : function() 
    { 
      // 탭닫기
      Hunel.MainFrame.closeMenu(Hunel.MdiTab.CurrentIFrame);
      Hunel.MdiTab.hideIconFuncModal();
    }
   ,closeOtherTab : function()
    {
      if(!confirm(ajaxMsg( "MSG_SYS_TAB_01" , Page.LANG))) return;// 현재 페이지만 남기고 나머지 페이지를 모두 닫습니다
     
      $.protify(Hunel.MdiTab.Page).each(function(item){
        if( item != $(Hunel.MdiTab.CurrentPage).attr("id").replace("MDIIconTab_","iframe_biz_") ){
          Hunel.MainFrame.removeFrame(item);
        }
      });
      Hunel.MdiTab.hideIconFuncModal();
    }
   ,protectTabPage : function(bProtect) 
    {
      $(Hunel.MdiTab.CurrentPage).attr("Lock", bProtect.toString());
      if (bProtect) 
      {
        $(Hunel.MdiTab.CurrentPage).attr("class", "lock_on");
      }
      else
      {
        $(Hunel.MdiTab.CurrentPage).attr("class", "");
      }
      Hunel.MdiTab.hideIconFuncModal();
    }
   ,closeAllBiz : function() 
    {
      if (Hunel.MdiTab.OpenPageCnt > 0) 
      {
        Hunel.GrayWrapLayer = createEntirePageWrapGrayLayer();
        /*
        $("#dialogCloseAllBiz").html(
            "열려있는 " + Hunel.MdiTab.OpenPageCnt
                + "개의 화면을 어떻게 닫으시겠습니까?");
        */        
        $("#Stage_Biz").css("display","none");
        var MSG = ajaxMsg("MSG_CONFIRM_MAIN_0020", Page.LANG, Hunel.MdiTab.OpenPageCnt);
        $("#dialogCloseAllBiz").html(MSG); // 열려있는 [#] 개의 화면을 어떻게 닫으시겠습니까?

        $("#divCloseAllBiz").css("display","block"); 
      }
      else
      {
        alert(ajaxMsg( "MSG_SYS_MAIN_0010"));  // 열려있는 화면이 없습니다. 중문요청
      }
    }
   ,closeAll : function()
    {
      Hunel.MainFrame.clearAllBizFrame();
      Hunel.MdiTab.reset();
      $("#divCloseAllBiz").css("display","none"); 
      $(Hunel.GrayWrapLayer).remove();
      $("#Stage_Biz").css("display","");
    }
   ,closeUnlockOnly : function()
    {
      Hunel.MainFrame.clearAllUnLockBizFrame();
      $("#divCloseAllBiz").css("display","none"); 
      $(Hunel.GrayWrapLayer).remove();
      $("#Stage_Biz").css("display","");
    }
   ,cancelClose : function()
    {
      $("#divCloseAllBiz").css("display","none"); 
      $(Hunel.GrayWrapLayer).remove();
      $("#Stage_Biz").css("display","");
    }
   ,getUnLockFirstPageName : function() 
    {
      var sPageName = "";
      for ( var i = 0; i < Hunel.MdiTab.Page.length; i++) 
      {
        var iframeName = Hunel.MdiTab.Page[i];
        var tab = $("#"+ iframeName.replace("iframe_biz_", "MDIIconTab_"));
        if (tab.attr("Lock") == "true")
        {
          continue;
        }
        else 
        {
          sPageName = tab.attr("MENU_NM");
          break;
        }
      }
      return sPageName;
    }
   ,tabScroll : function(sDir) 
    {
      Hunel.MdiTab.hideIconFuncModal();
      var oDiv = $("#tab_menu")[0];
      var nPerMove = 120;
      var nMaxLeft = parseInt(oDiv.scrollWidth,10) - parseInt(oDiv.offsetWidth,10);
      if (sDir == "L") 
      {
        if (oDiv.scrollLeft == 0) return;
        if (oDiv.scrollLeft - nPerMove <= 0)
        {
          oDiv.scrollLeft = 0;
        }
        else
        {
          oDiv.scrollLeft = oDiv.scrollLeft - nPerMove;
        }
      } 
      else
      {
        if (oDiv.scrollLeft >= nMaxLeft) return;
        if (oDiv.scrollLeft + nPerMove >= nMaxLeft)
        {
          oDiv.scrollLeft = nMaxLeft;
        }
        else
        {
          oDiv.scrollLeft = oDiv.scrollLeft + nPerMove;
        }
      }
    }
   ,wheelTabScroll : function (e, delta)
    {     
      if (delta > 0) 
      { // 휠을 위로
        Hunel.MdiTab.tabScroll("L");
      }
      else
      {
        Hunel.MdiTab.tabScroll("R");
      }
    }
  }
  //Hunel MdiTab end
 
  //Hunel MainFrame strat
 ,MainFrame : 
  {
    makeBizIFrame : function(menu) 
    {
      if (menu == null || menu == undefined) return null;
      var iframe_name;
      if(!Hunel.MdiTab.DuplicateOpen)
      { 
        iframe_name= "iframe_biz_" + $(menu).attr("MODULE_ID") + $(menu).attr("MENU_ID");
      }
      else 
      { 
        iframe_name= "iframe_biz_" + + $(menu).attr("MODULE_ID") + $(menu).attr("MENU_ID") + nFrameIndex; 
      } 
      var $iframe = $(document.createElement("iframe"));
      $iframe.prop("name",iframe_name);
      $iframe.prop("id",iframe_name);
      $iframe.prop("src","/common/jsp/blank.jsp");
      $iframe.attr("frameborder","0");
      $iframe.css({width:"100%",height:"100%"});
      
      $("#Stage_Biz").append($iframe);

      nFrameIndex++;
      return iframe_name;
    }
   ,addFrame : function(menu) 
    {
      if(!Hunel.MdiTab.DuplicateOpen)
      {
        //같은페이지를 여러번 열지 않는경우
        var iframe_name = "iframe_biz_"+$(menu).attr("MODULE_ID")+$(menu).attr("MENU_ID");
        if($("#"+iframe_name).length > 0)
        { 
          //이미 해당페이지가 열린경우
          Hunel.MainFrame.showIframe(iframe_name);
          return false;
        }
      }
      //페이지를 추가할 수 있는 프레임을 만들수 있는 상태인지를 리턴 ( 만들수 있음 만든다)
      if (Hunel.MdiTab.CurrentIFrame != "" && Hunel.MdiTab.CurrentIFrame != undefined)
      {
        $("#" + Hunel.MdiTab.CurrentIFrame).css("display", "none");
      }

      var bAddEnable = false;
          
      // 열려있는 페이지가 최대 페이지를 넘어서면
      if (Hunel.MdiTab.Page.length >= MAX_DOC_CNT) {
/*        if ((Hunel.MdiTab.UseMaxLimitAlert == true && confirm(MAX_DOC_CNT
            + "개 이상의 페이지가 열려  페이지["
            + Hunel.MdiTab.getUnLockFirstPageName() + "]을(를) 닫습니다."))
            || Hunel.MdiTab.UseMaxLimitAlert == false) {*/
        
        // [#] 개 이상의 페이지가 열려 페이지 [#] 을(를) 닫습니다.
        if(getCookie("mdiComntYn")=="Y")
        {
          Hunel.MdiTab.UseMaxLimitAlert = false;
        }
        else
        {
          Hunel.MdiTab.UseMaxLimitAlert = true;
        }
        
        if ((Hunel.MdiTab.UseMaxLimitAlert == true && confirm(ajaxMsg("MSG_CONFIRM_MAIN_0040", Page.LANG, MAX_DOC_CNT, Hunel.MdiTab.getUnLockFirstPageName() ))) || Hunel.MdiTab.UseMaxLimitAlert == false) 
        {
          for ( var i = 0; i < Hunel.MdiTab.Page.length; i++) 
          {
            var iframeName = Hunel.MdiTab.Page[i];
            var tab = $("#"+ iframeName.replace("iframe_biz_","MDIIconTab_"));
            if (tab.attr("Lock") == "true") continue;
            else 
            {
              Hunel.MainFrame.removeFrame(iframeName);
              bAddEnable = true;
              break;
            }
          }
        } 
        else 
        {
          if (Hunel.MdiTab.CurrentIFrame != ""&& Hunel.MdiTab.CurrentIFrame != undefined)
          {
            $("#" + Hunel.MdiTab.CurrentIFrame).css("display", "");
          }
          return false;
        };
      } 
      else
      {
        bAddEnable = true;
      }

      if (bAddEnable) 
      {
        var iframe_name = Hunel.MainFrame.makeBizIFrame(menu);
        Hunel.MdiTab.CurrentIFrame = iframe_name;
        Hunel.MdiTab.makeIcon(menu, iframe_name);
        Hunel.MdiTab.addPage(iframe_name);
        Hunel.MdiTab.OpenPageCnt++;
        return true;
      }
      else
      {
        alert(ajaxMsg( "MSG_SYS_MAIN_0020"));  // 모든 탭이 보호 되어 있어 새로운 탭을 열 수 없습니다.\n닫혀도 되는 탭의 보호를 해제해 주세요. 중문요청
        return false;
      }
    }
   ,removeFrame : function(iframe_name) 
    {
      var $targetFrame = $("#" + iframe_name);
      $targetFrame.purgeFrame();
      Hunel.MdiTab.removeIcon(iframe_name);
      Hunel.MdiTab.removePage(iframe_name);
      Hunel.MdiTab.OpenPageCnt--;
      return true;
    }
   ,clearAllBizFrame : function() 
    {
      var arr = $.protify(Hunel.MdiTab.Page);
      arr.each(function(item) {
        var $targetFrame = $("#" + item);
        $targetFrame.purgeFrame();
      });
      Hunel.MdiTab.hideIconFuncModal();
    }
   ,clearAllUnLockBizFrame : function() 
    {
      var arr = $.protify(Hunel.MdiTab.Page);
      arr.each(function(item) {
        var tabIcon = $("#"+ item.replace("iframe_biz_", "MDIIconTab_"));
        if (tabIcon.attr("Lock") != "true") 
        {
          if (Hunel.MdiTab.OpenPageCnt <= 1) 
          {
            Hunel.MainFrame.closeAllBiz();
          }
          else
          {
            Hunel.MainFrame.removeFrame(item);
          }
        }
        // Hunel.MdiTab.lastPageView();
          // if($(item).attr("Lock") != true ) $("#"+item).remove();
        });
    }
   ,showIframe : function(iframe_name) 
    {
      if (Hunel.MdiTab.CurrentIFrame != iframe_name) 
      {
        $("#" + Hunel.MdiTab.CurrentIFrame).css("display", "none");
        $("#" + iframe_name).css("display", "block");
        Hunel.MdiTab.CurrentIFrame = iframe_name;
        Hunel.MdiTab.chgActiveIcon(iframe_name);
      }
      else
      {
        // 열려있는 창을 다시 선택한경우
        if($("#Stage_Modal_Icon").css("display") == "none")
        {
          Hunel.MdiTab.showIconFuncModal();
        }
        else
        {  
          Hunel.MdiTab.hideIconFuncModal(); 
        }
      }
    }
   ,closeAllBiz : function() 
    {
      if (Hunel.MdiTab.OpenPageCnt > 1) 
      {
        /* if (!confirm("열려있는 " + Hunel.MdiTab.OpenPageCnt
            + "개의 화면을 모두 닫고 초기 화면으로 돌아갑니다"))
          return;*/
        if ( ! confirm(ajaxMsg("MSG_SYS_MAIN_0030", Page.LANG, Hunel.MdiTab.OpenPageCnt)) ) return;   // 열려있는 # 개의 화면을 모두 닫고 초기 화면으로 돌아갑니다
      }
      Hunel.MainFrame.clearAllBizFrame();
      Hunel.MdiTab.reset();
      // Layout.hideAllBiz();
    }
   ,closeMenu : function(iframe_name) 
    {
      var tabIcon = $("#" + iframe_name.replace("iframe_biz_", "MDIIconTab_"));
      if (tabIcon.attr("Lock") == "true")
      {
        if (!confirm(ajaxMsg("MSG_CONFIRM_MAIN_0030")) )  //보호 설정되어 있는 탭입니다.\n그래도 닫으시겠습니까?
        {
          return;
        }
      }
      if (Hunel.MdiTab.OpenPageCnt <= 1) 
      {
        Hunel.MainFrame.closeAllBiz();
      }
      else
      {
        if (Hunel.MainFrame.removeFrame(iframe_name))
        {
          Hunel.MdiTab.lastPageView();
          Hunel.MdiTab.hideIconFuncModal();
        }
      }
    }
   ,openMenu : function(menu) 
    {
	   var startTime = new Date();
      if (!Hunel.MdiTab.Use) 
      {
        Hunel.MainFrame.clearAllBizFrame();
        Hunel.MdiTab.reset();
      }
      
      var bAdded = Hunel.MainFrame.addFrame(menu); // 프레임을 만듦
      if (bAdded)
      {
        ajaxRequestXS("biz.user.UserDS", "logProgram", { S_PROFILE_ID : $(menu).attr("PROFILE_ID"),S_MODULE_ID : $(menu).attr("MODULE_ID"),S_MENU_ID : $(menu).attr("MENU_ID"),S_PGM_ID : $(menu).attr("PGM_ID")}, function(xs) 
        {
          var sMenuClass = $(menu).attr("MENU_CLASS");
          var action = "";
          if (sMenuClass == "40") 
          {
            action = CONDITION_SEARCH_URL;
          }
          else if (sMenuClass == "50") 
          {
            action = PROCESSMAP_URL;
          }
          else
          {
            action = $(menu).attr("PGM_URL");
          }
          
          var param = {
            X_PROFILE_ID : $(menu).attr("PROFILE_ID")
           ,X_MODULE_ID : $(menu).attr("MODULE_ID")
           ,X_MENU_ID : $(menu).attr("MENU_ID")
           ,X_PGM_ID : $(menu).attr("PGM_ID")
           ,X_SQL_ID : $(menu).attr("SQL_ID")
           ,X_PRS_ID : $(menu).attr("PRS_ID")
           ,X_EMP_SCH_AUTH_CD : $(menu).attr("EMP_SCH_AUTH_CD")
           ,X_MENU_NM : $(menu).attr("MENU_NM")
           ,X_ENC_VAL : $(menu).attr("ENC_VAL")
           ,X_ENC_VAL2 : $(menu).attr("ENC_VAL2")
           ,X_PGM_URL : $(menu).attr("PGM_URL")
           ,GEN_YN : $(menu).attr("GEN_YN")
           ,S_SQL_ID : $(menu).attr("SQL_ID") || ""
           ,S_PRS_ID : $(menu).attr("PRS_ID") || ""
           ,S_PROFILE_ID : $(menu).attr("PROFILE_ID") || ""
           ,S_GEN_YN_YN : $(menu).attr("GEN_YN") || ""
           ,S_TOP_FRAME_TYPE : S_TOP_FRAME_TYPE
          };
   
          if ($(menu).attr("EXP_YN") == "Y") Hunel.LeftMenu.hide();
                
          $("#S_ADD_FAVORITE_NM").val($(menu).attr("MENU_NM"));
            
          popOpen({ url : action ,name : Hunel.MdiTab.CurrentIFrame ,param : param });
          
        });
      }
      var endTime = new Date();
	   console.log(startTime.getHours() + ":" + startTime.getMinutes() + "(" + startTime.getSeconds() + "." + startTime.getMilliseconds() + ")"
			     + " ~ " + endTime.getHours() + ":" + endTime.getMinutes() + "(" + endTime.getSeconds() + "." + endTime.getMilliseconds() + ")"
			     + "(" + Math.abs(startTime.getMilliseconds() - endTime.getMilliseconds()) + " milliseconds)"			     
	   );
    }
  }
 ,LeftMenu : 
  {
    init : function() { }
   ,collapse : function (sLvl)
    {
      switch(sLvl)
      {
        case "+":
        {
          $(".mainStyleWrap").each(function()
          {
            $(this).css("display","block");
          });
          $(".pgmStyleWrap").each(function()
          {
            $(this).css("display","block");
          });
          $("#divMenu span").each(function()
          {
            $(this).addClass("minus");
          });
        }
        break;
        case "-":
        {
          $(".mainStyleWrap").each(function()
          {
            $(this).css("display","none");
          });
          $("#divMenu span").each(function()
          {
            $(this).removeClass("minus");
          });
        }
        break;
        case "1":
        {
          Hunel.LeftMenu.collapse("2");
          $(".mainStyleWrap .pgmStyleWrap").each(function()
          {
            $(this).css("display","none");
            $(this).parent().parent().find("span").removeClass("minus");
          });
        }
        break;
        case "2":
        {
          Hunel.LeftMenu.collapse("3");
          $(".pgmStyleWrap .pgmStyleWrap").each(function()
          {
            $(this).css("display","none");
            $(this).parent().parent().find("span").removeClass("minus");
          });
        }
        break;
        case "3":
        {
          Hunel.LeftMenu.collapse("+");
          $(".pgmStyleWrap .pgmStyleWrap .pgmStyleWrap").each(function()
          {
            $(this).css("display","none");
            $(this).parent().parent().find("span").removeClass("minus");
          });
        }
        break;
      }
    }
   ,bindEvent : function() 
    {
      $(".mainMenuStyle>span").each(function() 
      {
        $(this).bind("click", function(e)
        {
          $(e.target).parent().next().toggle();
        });
      });

      $(".menuStyle>span").each(function() 
      {
        $(this).bind("click", function(e) 
        {
          $(e.target).parent().next().toggle();
          $(e.target).toggleClass("minus");
        });
      });

      $(".menuStyle2>span").each(function() 
      {
        $(this).bind("click", function(e) 
        {
          $(e.target).parent().next().toggle();
          $(e.target).toggleClass("minus");
        });
      });

      $(".pgmStyle>span").each(function() 
      {
        $(this).bind("click", function(e) 
        {
          Hunel.MainFrame.openMenu($(e.target));
          //$(".pgmStyle>span").toggleClass("on",false);//선택지움
          //$(e.target).toggleClass("on");//선택
        });
      });
    }
   ,bindData : function(xs) 
    {
      $("#divMenu").html("");
      $("#menubox")[0].scrollTop = 0;

      var levelLastContainer = [];
      var orgLevel = 0;
      var nowLevel = 0;
      
      if (xs!=null && xs.Data!=null && xs.Data.length > 0) 
      {
        $(xs.Data).each(function(r, x)
        {
          nowLevel = $(this).attr("TLEVEL");
          var oDiv = Hunel.LeftMenu.makeItem($(this));
          if ( $(this).attr("MENU_CLASS") == "10" ||  $(this).attr("MENU_CLASS") == "20") 
          {
            switch (nowLevel) 
            {
              case "1":
              {
                levelLastContainer[0] = oDiv;
              }
              break;
              case "2":
              {
                levelLastContainer[1] = oDiv;
              }
              break;
              case "3":
              {
                levelLastContainer[2] = oDiv;
              }
              break;
              case "4":
              {
                levelLastContainer[3] = oDiv;
              }
              break;
            }
          }

          if (orgLevel == 0 || nowLevel == 1) 
          {
            $("#divMenu").append(oDiv);
          }
          else
          {
            var oCon = $($(levelLastContainer[nowLevel - 2]).children()[1]);
            oCon.append(oDiv);
          }
          orgLevel = nowLevel;
        });
        Hunel.LeftMenu.bindEvent();
      }
    }
   ,bindBaseInit : function(xs) 
    {
      $("#divProfileMenu").html("<select id='PROFILE_ID_MENU' name='PROFILE_ID_MENU' class='insert_select' style='width:100%;' onChange='doAction(hunelOtpVal.changeProfileMenu);' ></select>");
      $("#menubox")[0].scrollTop = 0;
    }
   ,makeItem : function($item) 
    {
      var MENU_CLASS        = nvl($item.attr("MENU_CLASS"));
      var TLEVEL            = nvl($item.attr("TLEVEL"));
      var nLEVEL            = parseInt(TLEVEL,10);
      var PROFILE_ID        = nvl($item.attr("PROFILE_ID"));
      var MODULE_ID         = nvl($item.attr("MODULE_ID"));
      var MENU_ID           = nvl($item.attr("MENU_ID"));
      var MENU_NM           = nvl($item.attr("MENU_NM"));
      var SQL_ID            = nvl($item.attr("SQL_ID"));
      var PRS_ID            = nvl($item.attr("PRS_ID"));
      var PGM_ID            = nvl($item.attr("PGM_ID"));
      var PGM_URL           = nvl($item.attr("PGM_URL"));
      var EXP_YN            = nvl($item.attr("EXP_YN"));
      var GEN_YN            = nvl($item.attr("GEN_YN"));
      var EMP_SCH_AUTH_CD   = nvl($item.attr("EMP_SCH_AUTH_CD"));
      var PAR_MENU_ID       = nvl($item.attr("PAR_MENU_ID"));
      var REG_MENU_ID       = "";
      var ENC_VAL           = nvl($item.attr("ENC_VAL"));
      var ENC_VAL2          = nvl($item.attr("ENC_VAL2"));
      
      var props = "LEVEL='" + nLEVEL 
          + "' MENU_ID='" + MENU_ID
          + "' REG_MENU_ID='" + REG_MENU_ID 
          + "' MENU_NM='" + MENU_NM
          + "' MENU_CLASS='" + MENU_CLASS 
          + "' SQL_ID='" + SQL_ID 
          + "' PRS_ID='" + PRS_ID
          + "' PGM_ID='" + PGM_ID 
          + "' PGM_URL='" + PGM_URL
          + "' EMP_SCH_AUTH_CD='" + EMP_SCH_AUTH_CD 
          + "' PAR_MENU_ID='" + PAR_MENU_ID
          + "' PROFILE_ID='" + PROFILE_ID 
          + "' MODULE_ID='" + MODULE_ID 
          + "' ENC_VAL='" + ENC_VAL 
          + "' ENC_VAL2='" + ENC_VAL2 + "' ";

      var oDiv = $(document.createElement("div"));

      var divClassName = "";
      var wrapClassName = "";
      switch (MENU_CLASS) 
      {
        case "10": 
        {
          divClassName = "mainMenuStyle";
          wrapClassName = "mainStyleWrap";
        }
        break;
        case "20": 
        {
          divClassName = (nLEVEL == 2) ? "menuStyle" : "menuStyle2";
          wrapClassName = "pgmStyleWrap";
        }
        break;
        case "30":
        case "40": 
        case "50": 
        {
          divClassName = "pgmStyle";
          wrapClassName = "";
        }
        break;
      }

      var oDiv1 = $(document.createElement("div"));
      oDiv1.attr("class", divClassName);

      var oSpan = $(document.createElement("span"));
      
      oSpan.html(MENU_NM);
      oSpan.attr("TLEVEL",          TLEVEL);
      oSpan.attr("PROFILE_ID",      PROFILE_ID);
      oSpan.attr("MODULE_ID",       MODULE_ID);
      oSpan.attr("MENU_ID",         MENU_ID);
      oSpan.attr("MENU_NM",         MENU_NM);
      oSpan.attr("SQL_ID",          SQL_ID);
      oSpan.attr("PRS_ID",          PRS_ID);
      oSpan.attr("PGM_ID",          PGM_ID);
      oSpan.attr("PGM_URL",         PGM_URL);
      oSpan.attr("EXP_YN",          EXP_YN);
      oSpan.attr("EMP_SCH_AUTH_CD", EMP_SCH_AUTH_CD);
      oSpan.attr("PAR_MENU_ID",     PAR_MENU_ID);
      oSpan.attr("MENU_CLASS",      MENU_CLASS);
      oSpan.attr("GEN_YN",          GEN_YN);
      oSpan.attr("ENC_VAL",         ENC_VAL);
      oSpan.attr("ENC_VAL2",        ENC_VAL2);
      
      oDiv1.append(oSpan);

      var oDiv2 = $(document.createElement("div"));
      oDiv2.attr("class", wrapClassName);
      oDiv2.attr("wrapper", "true");

      oDiv.append(oDiv1);
      oDiv.append(oDiv2);

      return oDiv;
    }
   ,toggle : function()
    {
     if(Hunel.LayoutMenuType=="T" || Hunel.LayoutMenuType=="N")
     {
       Hunel.LeftMenu.show();
     }
     else
     {
       Hunel.LeftMenu.hide();
     }
    }
   ,show : function()
    {
      if(Hunel.LayoutMenuType=="T")
      {
        Hunel.changeLayout('D');
      }
      else if(Hunel.LayoutMenuType=="N")
      {
        Hunel.changeLayout('L')
      }
    }
   ,hide : function()
    {
      if(Hunel.LayoutMenuType=="D")
      {
        Hunel.changeLayout('T');
      }
      else if(Hunel.LayoutMenuType=="L")
      {
        Hunel.changeLayout('N')
      }
    }
  }
  //Hunel LeftMenu end
  
  //Hunel Favorite(즐겨찾기) start
 ,Favorite : 
  {
    showLayer : function(bShow)
    {
      if(bShow)
      {
        if(bAnimation)
        {
          $(".favoriteLayer").css("top",($("#favorite_layer").height()*-1));
          $(".favoriteLayer").css("right",$("body").scrollLeft()*-1);
          $(".favoriteLayer").css("height",$("#wrap").height());
          $(".favList").css("height",$("#mainbox").height()-121);
          //$("#favorite_layer").animate({right:0,opacity:100},{duration:"fast",easing:"swing"} );
          $("#favorite_layer").animate({top:0,opacity:100},{duration:"fast",easing:"swing"} );
          $("#favorite_layer").show();
          setTimeout(function(){ Hunel.Favorite.getFavorites();},100);
        }
        else
        {
          $("#favorite_layer").show();
          setTimeout(function(){ Hunel.Favorite.getFavorites();},100); 
        }
      }
      else
      {
        if(bAnimation)
        {
          //$("#favorite_layer").animate({right:-($("#favorite_layer").width()+100),opacity:0},{duration:"fast",easing:"swing"} );
          $("#favorite_layer").animate({top:-($("#favorite_layer").height()),opacity:0},{duration:"fast",easing:"swing"} );
          $("#favorite_layer").hide();
        }
        else
        {
          $("#favorite_layer").hide();
        }
      }
    }
   ,addFavorite : function()
    {
       //페이지가 열려있는 상태인지 확인
      if(Hunel.MdiTab.CurrentPage==undefined)
      {
        alert(ajaxMsg("MSG_ALERT_MAIN_0003"));//메인화면은 즐겨찾기 할 수 없습니다.
        return;
      }
      
      if($("#S_ADD_FAVORITE_NM").val()=="")
      {
        alert(ajaxMsg("MSG_ALERT_MAIN_0004"));//즐겨찾기메뉴명을 입력하십시오.
        $("#S_ADD_FAVORITE_NM").focus();
        return;
      }
      if(!confirm(ajaxMsg("MSG_CONFIRM_MAIN_0003",Page.LANG,$("#S_ADD_FAVORITE_NM").val())))//현재 열려 있는 페이지를 ["+$("#S_ADD_FAVORITE_NM").val()+"]로 즐겨찾기 하시겠습니까?
      {
         return;
      }
       
      ajaxRequestXSProg( hunelOtpVal.Sys_common, hunelOtpVal.saveFavorite, { S_MENU_NM : $("#S_ADD_FAVORITE_NM").val()
                                                                           , S_PROFILE_ID : $(Hunel.MdiTab.CurrentPage).attr("PROFILE_ID")
                                                                           , S_MODULE_ID : $(Hunel.MdiTab.CurrentPage).attr("MODULE_ID")
                                                                           , S_REG_MENU_ID : $(Hunel.MdiTab.CurrentPage).attr("MENU_ID")
                                                                           } ,function(xs)
      {
          Hunel.Favorite.getFavorites(true);
          $("#S_ADD_FAVORITE_NM").val("");
      });
    }
   ,delFavorite : function( oImg )
    {
      if(!confirm(ajaxMsg("MSG_CONFIRM_MAIN_0004",Page.LANG,$(oImg).attr("MENU_NM")))) return;
      ajaxRequestXSProg( hunelOtpVal.Sys_common, hunelOtpVal.delFavorite,{S_MENU_ID : $(oImg).attr("MENU_FID") },function(xs)
      {
        Hunel.Favorite.getFavorites(true);
      });
    }
   ,getFavorites : function(bForced)
    {
      bForced = nvl(bForced,false);
      if($("#favorite_list").html()!="" && bForced!=true)
      { //이미 조회된 경우는 다시 조회할 필요 없다
        return;
      }
      ajaxRequestXSProg( hunelOtpVal.MenuDS, hunelOtpVal.searchMyMenu ,{},function(xs)
      {
        $("#favorite_list").html("");
        var html = [];

        xs.eachRow(function(r,x)
        {
          var MENU_CLASS        = nvl(x.GetCellValue(r, "MENU_CLASS"));
          var TLEVEL            = nvl(x.GetCellValue(r, "TLEVEL"));
          var nLEVEL            = parseInt(TLEVEL,10);
          var PROFILE_ID        = nvl(x.GetCellValue(r, "PROFILE_ID"));
          var MODULE_ID         = nvl(x.GetCellValue(r, "MODULE_ID"));
          var MENU_ID           = nvl(x.GetCellValue(r, "MENU_ID"));
          var MENU_FID          = nvl(x.GetCellValue(r, "MENU_FID"));
          var MENU_NM           = nvl(x.GetCellValue(r, "MENU_NM"));
          var SQL_ID            = nvl(x.GetCellValue(r, "SQL_ID"));
          var PRS_ID            = nvl(x.GetCellValue(r, "PRS_ID"));
          var PGM_ID            = nvl(x.GetCellValue(r, "PGM_ID"));
          var PGM_URL           = nvl(x.GetCellValue(r, "PGM_URL"));
          var EXP_YN            = nvl(x.GetCellValue(r, "EXP_YN"));
          var GEN_YN            = nvl(x.GetCellValue(r, "GEN_YN"));
          var EMP_SCH_AUTH_CD   = nvl(x.GetCellValue(r, "EMP_SCH_AUTH_CD"));
          var PAR_MENU_ID       = nvl(x.GetCellValue(r, "PAR_MENU_ID"));
          var REG_MENU_ID       = "";
          var DP_ORDER          = nvl(x.GetCellValue(r, "DP_ORDER"));
          var ENC_VAL           = nvl(x.GetCellValue(r, "ENC_VAL"));
          var ENC_VAL2          = nvl(x.GetCellValue(r, "ENC_VAL2"));
          
          var props = "LEVEL='" + nLEVEL 
              + "' MENU_ID='" + MENU_ID 
              + "' MENU_FID='" + MENU_FID
              + "' REG_MENU_ID='" + REG_MENU_ID 
              + "' MENU_NM='" + MENU_NM
              + "' MENU_CLASS='" + MENU_CLASS 
              + "' SQL_ID='" + SQL_ID 
              + "' PRS_ID='" + PRS_ID
              + "' PGM_ID='" + PGM_ID 
              + "' PGM_URL='" + PGM_URL
              + "' EMP_SCH_AUTH_CD='" + EMP_SCH_AUTH_CD 
              + "' PAR_MENU_ID='" + PAR_MENU_ID 
              + "' DP_ORDER='" + DP_ORDER
              + "' PROFILE_ID='" + PROFILE_ID 
              + "' MODULE_ID='" + MODULE_ID 
              + "' ENC_VAL='" + ENC_VAL
              + "' ENC_VAL2='" + ENC_VAL2 + "' ";

          if( TLEVEL == "1") return;

          html.push("<li><a href='javascript:;' onclick='javascript:Hunel.Favorite.openFavorite(this,\""+MODULE_ID+"\")' "+props+">"+MENU_NM+"</a><img "+props+" src='/resource/images/main/btnClose2.gif' alt='delete favorite' onclick=\"Hunel.Favorite.delFavorite(this)\"  alt='즐겨찾기 목록 삭제' ></li>");
        });

        $("#favorite_list").html(html.join(""));
            
        $("#favorite_list").sortable({axis:"Y",opacity:0.6, update: function(e, ui){
          Hunel.Favorite.updateFavoriteOrder(ui);
        }});
      });
    }
   ,updateFavoriteOrder : function(ui)
    {
      //순서변경시 내용 저장
      var item = $($(ui.item)[0]).children("SPAN");
      var S_ORG_DP_ORDER = item.attr("DP_ORDER");
      var S_NEW_DP_ORDER = (ui.item).index() + 1;
      var S_MENU_ID = item.attr("MENU_FID");
       
      ajaxRequestXSProg( hunelOtpVal.Sys_common, hunelOtpVal.updateFavoriteOrder, {
         S_ORG_DP_ORDER:S_ORG_DP_ORDER
        ,S_NEW_DP_ORDER:S_NEW_DP_ORDER
        ,S_MENU_ID:S_MENU_ID
      },function(xs)
      {
         
      });
    }
   ,openFavorite : function (item, MODULE_ID, menuFrameYn)
    {
      if(menuFrameYn==undefined || menuFrameYn == null) menuFrameYn = "Y";
      //메뉴가 열려있는상태인지확인 아니면 첫번째 모듈을 열어줌
      if(Hunel.MdiTab.CurrentPage==undefined)
      {
        if($("#module_nav li a[MODULE_ID="+MODULE_ID+"]").length > 0)
        {
          $($("#module_nav li a[MODULE_ID="+MODULE_ID+"]")[0]).trigger("click");
        }
        else
        {
          $($("#module_nav li a")[0]).trigger("click");
        }
        setTimeout( function()
        {
             Hunel.MainFrame.openMenu(item);
             Hunel.Favorite.showLayer(false);
             if(menuFrameYn!="Y"){
               Layout.hideBox(['header','menubox','top_mdi']);
             }
        },500);
      }
      else
      {
        Hunel.MainFrame.openMenu(item);
        Hunel.Favorite.showLayer(false);
      }
    }
  }
  //Hunel Favorite(즐겨찾기) end
 ,PostIt : 
  {
    showLayer : function(bShow)
    {
      var onId = $("#MDI_Icon_List>li.on").prop("id");
      var $vital_mdi = (onId)?$("#MDI_Icon_List>li.on"):$("#MDI_Icon_List>li.lock_on");
      if(bShow)
      {
        if (!$vital_mdi.prop("id"))
        {
          alert("메모기능은 활성화된 화면이 있어야 사용할수 있습니다.");
          return;
        }
        $("#post_id").val($vital_mdi.prop("id"));
        $("#post_pgm_id").val($vital_mdi.attr("pgm_id"));
        $("#post_profile_id").val($vital_mdi.attr("profile_id"));
        $("#postItTitle").text("POST-IT [ "+$vital_mdi.find("a.MDITabBtn").text()+" ]");
        $("#postit_layer").show();
        $("#postit_layer").animate({right:0,opacity:100},{duration:"fast",easing:"swing"} );
        setTimeout(function(){ Hunel.PostIt.transType('list');},100);
      }
      else
      {
        $("#post_id").val("");
        $("#post_pgm_id").val("");
        $("#post_profile_id").val("");
        $("#postItTitle").text("POST-IT");
        $("#postit_layer").hide();
        $("#postit_layer").animate({right:-($("#postit_layer").width()+100),opacity:0},{duration:"fast",easing:"swing"} );
      }
    }
    ,transType: function(type, id)
    {
      if ( !type ) return;
      switch(type)
      {
        case 'list':
        {
          $("#post_it_body_txt").addClass("hiddenZone");
          $("#post_it_auth").addClass("hiddenZone");
          $("#post_it_btn").addClass("hiddenZone");
          $("#post_it_cmt").addClass("hiddenZone");
          Hunel.PostIt.getDataSetting('list');
        }
        break;
        case 'insert':
        {
          $("#selAuth01").prop("checked", true);
          $("#selAuth02").prop("checked", false);
          $("#post_it_body_txt").removeClass("hiddenZone");
          $("#post_it_auth").removeClass("hiddenZone");
          $("#post_it_btn").removeClass("hiddenZone");
          $("#post_it_cmt").addClass("hiddenZone");
          Hunel.PostIt.getDataSetting('insert');
        }
        break;
        case 'detaile':
        {
          $("#post_it_body_txt").removeClass("hiddenZone");
          $("#post_it_auth").addClass("hiddenZone");
          $("#post_it_btn").addClass("hiddenZone");
          $("#post_it_cmt").removeClass("hiddenZone");
          Hunel.PostIt.getDataSetting('detaile', id);
          Hunel.PostIt.chgHeight();
        }
        break;
      }
    }
    , getDataSetting: function(type, id)
    {
      if ( !type ) return;
      var pgmId = $("#post_pgm_id").val();
      var profileId = $("#post_profile_id").val();
      var subHtml = "";
      $("#postItTitWrap").html("");
      switch(type)
      {
        case 'list':
        {
          var rowCnt = 0;
          ajaxSyncRequestXS(hunelOtpVal.Main_bas_100_m01DS,hunelOtpVal.getPostItList,{S_PGM_ID: pgmId, S_PROFILE_ID: profileId, S_WRITE_AUTH_YN: "Y"},function(xs)
          {
            rowCnt = xs.RowCount();
            if (rowCnt > 0)
            {
              var title = "";
              xs.eachRow(function(r, x)
              {
                title = xs.GetCellValue(r, "TITLE");
                subHtml += "<li id=post_it_"+xs.GetCellValue(r, "SEQ_NO")+" >";
                subHtml += "  <div>";
                subHtml += "    <p class='postItTitEllipsis'><span >"+title+"</span></p>";
                subHtml += "    <span class='postItDate'>"+xs.GetCellValue(r, "WRITER_NM")+"</span>";
                subHtml += "  </div>";
                subHtml += "</li>";
              });
            }
            else 
            {
              subHtml += "<li id='' >";
              subHtml += "  <div class='alignC'>";
              subHtml += "    등록된 포스트잇이 없습니다.";
              subHtml += "  </div>";
              subHtml += "</li>";
            }
          });
          $("#postItTitWrap").html(subHtml);
          if (rowCnt > 0)
          {
            $("#postItTitWrap>li").bind("click", function(e) {
              Hunel.PostIt.transType('detaile', $(this).prop("id"));
            });
          }
        }
        break;
        case 'insert':
        {
          var nowdate = new Date();
          var date_str = nowdate.getFullYear() + "." + (nowdate.getMonth()+1) + "." + nowdate.getDate();
          subHtml += "<li id='' >";
          subHtml += "  <div>";
          subHtml += "    <p class='postItTit'><input type='text' name='' id='' placeholder='제목을 입력하세요' value='' /></p>";
          subHtml += "    <span class='postItDate'>"+date_str+"</span>";
          subHtml += "  </div>";
          subHtml += "</li>";
          $("#postItTitWrap").html(subHtml);
          $("#post_it_body_txt").val("").text("");
        }
        break;
        case 'detaile':
        {
          var seqNo = id.replace("post_it_", "");
          var reply = "", bodyTxt = "", saveAuth = "", profileLimit = false, writeAuthLimit = false;
          $("#postItTitWrap").html("");
          $("#post_it_cmt_detaile").html("");
          var title = "";
          //메모 상세 제목
          ajaxSyncRequestXS(hunelOtpVal.Main_bas_100_m01DS,hunelOtpVal.getDetail,{S_PGM_ID: pgmId, S_SEQ_NO: seqNo},function(xs)
          {
            xs.eachRow(function(r, x)
            {
              title          = xs.GetCellValue(r, "TITLE");
              saveAuth       = xs.GetCellValue(r, "SAVE_AUTH");
              subHtml += "<li id='post_it_"+xs.GetCellValue(r, "SEQ_NO")+"' >";
              subHtml += "  <div>";
              subHtml += "    <p class='postItTit'><input type='text' name='' id='' placeholder='제목을 입력하세요' value='"+title+"' /></p>";
              subHtml += "    <span class='postItDate'>"+xs.GetCellValue(r, "WRITER_NM")+"</span>";
              subHtml += "    <p class='btnPostClose'><img src='/resource/images/main/btn_postClose.png' alt='포스트 읽기페이지 닫기' /></p>";
              subHtml += "  </div>";
              subHtml += "</li>";
    
              bodyTxt        = xs.GetCellValue(r, "TXT");
              isOpen         = xs.GetCellValue(r, "OPEN_YN") == "Y" ? true : false;
              profileLimit   = xs.GetCellValue(r, "PROFILE_LIMIT_YN") == "Y" ? true : false ;
              writeAuthLimit = xs.GetCellValue(r, "WRITE_AUTH_LIMIT_YN") == "Y" ? true : false ;
            });
          });
          $("#postItTitWrap").html(subHtml);
          $("#postItTitWrap>li>div>p.btnPostClose").bind("click", function(e) 
          {
            Hunel.PostIt.transType('list');
          });
          //본인이 작성한 메모이면 저장 및 삭제 가능
          if (saveAuth == "Y")
          {
            $("#post_it_auth").removeClass("hiddenZone");
            $("#post_it_btn").removeClass("hiddenZone");
          }
    
          //메모 상세 본문, 권한
          $("#post_it_body_txt").val(bodyTxt);
          $("#selAuth01").prop("checked", isOpen);
          $("#selAuth02").prop("checked", !isOpen);
    
          //메모 상세 댓글
          ajaxSyncRequestXS(hunelOtpVal.Main_bas_100_m01DS,hunelOtpVal.getReply,{S_PGM_ID: pgmId, S_SEQ_NO: seqNo},function(xs)
          {
            xs.eachRow(function(r, x)
            {
              reply += "<li id='post_it_cmt_"+xs.GetCellValue(r, "REPLY_NO")+"' >";
              reply += "  <div class='idArea'>";
              reply += "    <p class='userId'>"+xs.GetCellValue(r, "WRITER_NM")+"</p>";
              reply += "    <span>"+xs.GetCellValue(r, "TXT")+"</span>";
              reply += "  </div>";
              reply += "  <a href='javascript:;' class='btnCmtClose'><img src='/resource/images/main/btn_helpClose.gif' alt='댓글을 지웁니다' title='댓글을 지웁니다'/></a>";
              reply += "</li>";
            });
          });
          $("#post_it_cmt_detaile").html(reply);
          $("#post_it_cmt_detaile>li>a").bind("click", function(e) 
          {
            Hunel.PostIt.deletePostIt('reply', pgmId, $("#postItTitWrap>li").prop("id"), $(this).parent().prop("id"));
          });
        }
        break;
      }
    }
   ,savePostIt: function()
    {
      var postSeq = $("#postItTitWrap>li").prop("id").replace("post_it_","");
      var pgmId = $("#post_pgm_id").val();
      var title = $("#postItTitWrap>li>div>p>input").val();
      var txt  = $("#post_it_body_txt").val();
      var profileId = $("#post_profile_id").val();
      var openYn = $("#selAuth01").prop("checked") == true ? "Y" : "N";
      //var profileLimit = $("#selAuth01").prop("checked") == true ? "Y" : "N";
      //var writeAuthLimit = $("#selAuth02").prop("checked") == true ? "Y" : "N";
      if ( !title )
      {
        alert("제목을 입력해 주십시오.");
        return;
      }
      var params = {
                     S_POST_SEQ: postSeq
                    ,S_PGM_ID: pgmId
                    ,S_TITLE: title
                    ,S_TXT: txt
                    ,S_WRITE_PROFILE_ID: profileId
                    ,S_OPEN_YN: openYn
                    //,S_PROFILE_LIMIT_YN: profileLimit
                    //,S_WRITE_AUTH_LIMIT_YN: writeAuthLimit
                   };
      ajaxSyncRequestXS(hunelOtpVal.Main_bas_100_m01DS,hunelOtpVal.savePostIt,params, function(xs){});

      setTimeout(function(){ Hunel.PostIt.transType('list');},100);
    }
   ,saveReply: function()
    {
      var postId = $("#postItTitWrap>li").prop("id");
      var postSeq = postId.replace("post_it_","");
      var pgmId = $("#post_pgm_id").val();
      var txt  = $("#post_it_cmt_txt").val();
     
      if ( !postId )
      {
        alert("먼저 포스트잇을 등록하고 댓글을 달 수 있습니다.");
        return;
      }
      if ( !txt )
      {
        alert("댓글을 입력해 주십시오.");
        return;
      }
      var params = {
                     S_POST_SEQ: postSeq
                    ,S_PGM_ID: pgmId
                    ,S_TXT: txt
                   };
      ajaxSyncRequestXS(hunelOtpVal.Main_bas_100_m01DS,hunelOtpVal.saveReply,params, function(xs){});
      $("#post_it_cmt_txt").val("");
      setTimeout(function(){ Hunel.PostIt.getDataSetting('detaile', postId);},100);
    }
   ,deletePostIt: function(type, pgmId, postItId, replyId)
    {
      var post_seq = "", reply_seq = "";
      if ("post" == type)
      {
        if (!confirm("해당댓글도 모두 삭제됩니다.\n계속하시겠습니까?")) return;

        pgmId    = pgmId||$("#post_pgm_id").val();
        postItId = postItId||$("#postItTitWrap>li").prop("id");
        post_seq = postItId.replace("post_it_","");
      }
      else 
      {
        post_seq = postItId.replace("post_it_","");
        reply_seq = replyId.replace("post_it_cmt_","");
      }
      ajaxSyncRequestXS(hunelOtpVal.Main_bas_100_m01DS,hunelOtpVal.deletePostIt,{S_TYPE: type, S_PGM_ID: pgmId, S_POST_SEQ: post_seq, S_REPLTY_SEQ: reply_seq},function(xs){     });

      if ("post" == type)
      {
        setTimeout(function(){ Hunel.PostIt.transType('list');},100);
      }
      else
      {
        setTimeout(function(){ Hunel.PostIt.transType('detaile', postItId);},100);
      }
    }
   ,chgHeight: function()
    {
      $("#post_it_cmt_detaile").css("height");
      var allHeight = Number($("#postit_layer").css("height").replace("px", ""));
      var headerHeight = Number($("#postItHeader").css("height").replace("px", ""));
      headerHeight = Math.ceil(headerHeight/10)*10;
      var fixHeight = 50;
      var availHeight = allHeight - (headerHeight + fixHeight);
      var ulHeight = Number($("#post_it_cmt_detaile").css("height").replace("px", ""));
      var chgHeight = 0;
      chgHeight = availHeight - 25;
      chgHeight = chgHeight+"px";
      $("#post_it_cmt_detaile").css("height", chgHeight);
    }
  }
  //Hunel Main End
};