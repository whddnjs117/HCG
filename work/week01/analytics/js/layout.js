var _layoutMSG = "";
var Layout = {
  wbox : [],
  bGhostShow : false,
  orgSlider : null,
  color : null,
  slidersize : "1", //solid
  slidersize2 : "15", //옆에 이미지가 붙을때 사용
  solidslider : false,
  funcResize : null, //layout의 변경이 일어났을 때 다른 함수를 호출하고자 할때 사용
  grid : {
    padding : 4,
    border : 1
  },
  init : function( opt ) {
    if(opt!=null && opt.slidersize!=undefined) Layout.slidersize = opt.slidersize.toString(); //solid일땐 사이즈 조절 가능
    if(opt!=null && opt.solidslider!=undefined ) Layout.solidslider = opt.solidslider;
    if(Layout.solidslider==false && (opt==null || opt.slidersize==undefined)) Layout.slidersize = Layout.slidersize2;
    if(opt!=null && opt.color!=undefined) Layout.color = opt.color;
    if(opt!=null && opt.funcResize!=undefined) Layout.funcResize = opt.funcResize;
    Layout.makeGhost(); //slider을 움직일때 마다 부하가 걸릴수 있으므로 ghost를 이용해서 event가 끝났을때 처리하게 한다
    Layout.makeSlider(); //solid 타입이 아닐때 사용한다.(slider 안에 이미지 작업하는 것들)
    Layout.resize(); //스크립트로 제어했을때 사이즈가 변경되면 사용

    window.onresize = function() {
    	setTimeout(function(){
			Layout.resize();
    	},0);
	};
	
    $("div.hslider, div.vslider").mouseover(function(e) {
      Layout.showGhost(e);
    });
    $("div.hslider, div.vslider").mouseleave(function() {
      // Layout.hiddenGhost(false);
    });
    $(".sliderghost").dblclick(function(e){
      Layout.restoreSize(e);
    });
  },
  resize : function() {

    Layout.hiddenGhost();
    Layout.wbox = Layout.getWbox();
    Layout.wbox.each(function() {
      Layout.getChildBoxHierachy($(this)[0]);
    });
    
    if(typeof(directResize) == "function")
    {  
      directResize(); //사이즈를 직접 수정하고 싶을때 사용
    }
    
    if(Layout.funcResize!=null){
		Layout.funcResize();
	}
  },
  getWbox : function() {
    return $("div.wbox");
  },
  getChildBoxHierachy : function(parentBox) {
    Layout.setSizeChild(parentBox);
    var arrChild = Layout.getChildBox(parentBox);
    //if(!$(parentBox).is(".noscroll, .autoscroll, .yscroll, .xscroll")) $(parentBox).addClass("noscroll");
    if (arrChild.length > 0) {
      arrChild.each(function() {
        Layout.getChildBoxHierachy(this);
      });
    } else {
       
      return false;
    }
  },
  getChildBox : function(parentBox) {
    return $(parentBox).children(
        "div.hbox, div.vbox, div.hslider, div.vslider");
  },
  setSizeChild : function(parentBox) {
    if(parentBox==null) return;

    var width = parentBox.offsetWidth - (($(parentBox).hasClass("yscroll")) ? 20 : 0);
    var height = parentBox.offsetHeight - (($(parentBox).hasClass("xscroll")) ? 20 : 0);
    var sChildType = "";
    var parSize = 0;
    var arrUndefBox = [];
    var nLeftSize = 0;
    var nTop = 0;
    var nLeft = 0;

    var arrBox = Layout.getChildBox(parentBox);

    if($(parentBox).attr("boxApply") == "false") {
        $(parentBox).hasClass("hbox") ? $(parentBox).css("height","") :  $(parentBox).css("width","");
    }

    if (arrBox.length <= 0) {
      return;
    } else {
      if ($(arrBox[0]).hasClass("hslider")
          || $(arrBox[0]).hasClass("vslider")) {
        alert("슬라이더가 처음에 올수 없습니다.");
        return;
      }
      if ($(arrBox[0]).hasClass("hbox")) {
        sChildType = "H";
        parSize = height;
        nLeftSize = height;
      } else {
        sChildType = "V";
        parSize = width;
        nLeftSize = width;
      }
    }
    for ( var i = 0; i < arrBox.length; i++) {
      
      if($(arrBox[i]).attr("orgboxsize")==undefined){
        $(arrBox[i]).attr("orgboxsize", $(arrBox[i]).attr("boxsize"));
      }
      
      if($(arrBox[i]).css("display")=="none") continue;

      var bxSize = 0;
      if ($(arrBox[i]).hasClass("hslider")|| $(arrBox[i]).hasClass("vslider")) {
        bxSize = Layout.slidersize;
      } else {
        bxSize = $(arrBox[i]).attr("boxsize");

        if (bxSize == null || bxSize == undefined || bxSize == "*") {
          arrUndefBox.push($(arrBox[i]));
          continue;
        }
      }
      var bxCalcSize = Layout.getSize(bxSize, parSize);

      nLeftSize = nLeftSize - bxCalcSize;

      if (sChildType == "H") {
        $(arrBox[i]).width(width);
        $(arrBox[i]).height(bxCalcSize);
        Layout.setGridSize(arrBox[i], width, bxCalcSize);
      } else {
        $(arrBox[i]).width(bxCalcSize);
        $(arrBox[i]).height(height);
        Layout.setGridSize(arrBox[i], bxCalcSize, height);
      }
    }

    var arrUndefBoxlen = arrUndefBox.length;
    for ( var i = 0; i < arrUndefBoxlen; i++) { //사이즈가 정해지고 순서대로 위치를 잡는다.
      if (i == arrUndefBoxlen - 1) {
        if (sChildType == "H") {
          arrUndefBox[i].width(width);
          arrUndefBox[i].height(nLeftSize);
          Layout.setGridSize(arrUndefBox[i],width, nLeftSize);
        } else {
          arrUndefBox[i].width(nLeftSize);
          arrUndefBox[i].height(height);
          Layout.setGridSize(arrUndefBox[i],nLeftSize, height);
        }
      } else {
        var bxCalcSize = Math.round(nLeftSize / (arrUndefBoxlen-i));
        nLeftSize = nLeftSize - bxCalcSize;
        if (sChildType == "H") {
          arrUndefBox[i].width(width);
          arrUndefBox[i].height(bxCalcSize);
          Layout.setGridSize(arrUndefBox[i],width, bxCalcSize);
        } else {
          arrUndefBox[i].width(bxCalcSize);
          arrUndefBox[i].height(height);
          Layout.setGridSize(arrUndefBox[i],bxCalcSize, height);
        }

      }
    }
    Layout.setReposition(sChildType, arrBox);
  },
  setReposition : function(sChildType, arrBox) {
    var nTop = 0;
    var nLeft = 0;
    for ( var i = 0; i < arrBox.length; i++) {
      if( $(arrBox[i]).css("display")=="none") continue;
      var oBefBox = Layout.getBefBox(arrBox[i]);
      if (sChildType == "H") {
        if (oBefBox == null) {
          nTop = 0;
        } else {
          nTop = Layout.getBefBox(arrBox[i]).offsetTop + Layout.getBefBox(arrBox[i]).offsetHeight;
        }
        $(arrBox[i]).css("top", nTop);
        _layoutMSG += $(arrBox[i]).attr("id") + " => " + nTop + "\n"; 
      } else {
        if (oBefBox == null) {
          nLeft = 0;
        } else {
          nLeft = Layout.getBefBox(arrBox[i]).offsetLeft + Layout.getBefBox(arrBox[i]).offsetWidth;
        }
        $(arrBox[i]).css("left", nLeft);
      }
    }
  },
  getBefBox : function(oBox){ //slider 이전 box를 찾는다
    var oBefBox = null;
    
    var oSibBox = $(oBox).prevAll();
    
    for(var i = oSibBox.length-1; 0<=i; i-- ){
      if($(oSibBox[i]).css("display") =="none") continue;
      oBefBox = oSibBox[i];
    }
    
    return oBefBox;
  },
  getSize : function(boxSize, parSize) { //%값이 들어왔때 실제 px로 변환해준다.
    var nRtn = 0;
    if (boxSize == null || boxSize == undefined) {
      nRtn = parSize;
    } else {
      if (boxSize.indexOf("%") > 0) {
        boxSize = boxSize.replace("%", "");
        nRtn = Math.round(parSize * parseInt(boxSize) / 100);
      } else {
        nRtn = boxSize.replace("px", "");
      }
    }
    return nRtn;

  },
  makeGhost : function() {
    var oDiv = $("<div class='sliderghost' style='display:none'></div>");
    oDiv.css( {
      position : "absolute",
      width : 10,
      height : 10,
      left : 0,
      top : 0,
      zindex : 999
    });
    if(Layout.solidslider==true && Layout.color!=null){ oDiv.css("background",Layout.color);}
    
    $(document.body).append(oDiv);
  },
  showGhost : function(e) {
    var oSlider = $(e.currentTarget);
    var ghostType = "";
    var cursorType = "";
    var axisType = "";
    if ($(oSlider).hasClass("vslider")) {
      cursorType = "e-resize";
      ghostType = "V";
      axisType = "x";
    } else {
      cursorType = "n-resize";
      ghostType = "H";
      axisType = "y";
    }
    
    if(!Layout.solidslider){
      $(".sliderghost").html(oSlider.html());
    }
    

    var w = $(oSlider)[0].offsetWidth - (ghostType=="V"?0:2);
    var h = $(oSlider)[0].offsetHeight - (ghostType=="H"?0:2);
    var l = $(oSlider).offset().left;
    var t = $(oSlider).offset().top;
    $(".sliderghost").css( {
      position : "absolute",
      width : w,
      height : h,
      left : l,
      top : t,
      cursor : cursorType,
      border : 0,
      margin: 0,
      padding:0,
      display : "inline-block"
    }).attr("ghostType", ghostType);
    Layout.orgSlider = oSlider;
    
    $(".sliderghost").draggable( {
      axis : axisType,
      containment : 'parent',
      iframeFix: true,
      cursor : cursorType,
      start : function(event, ui) {
        Layout.bGhostShow = true;
      },
      stop : function(event, ui) {
        Layout.chgSize();
        Layout.bGhostShow = false;
        Layout.hiddenGhost();
      }
    });
  },
  chgSize : function() { //ghost box에서 마우스를 띄었을때 사이즈 변경한다.
    var oSlider = $(".sliderghost");
    var w = $(oSlider)[0].offsetWidth;
    var h = $(oSlider)[0].offsetHeight;
    var l = $(oSlider).offset().left;
    var t = $(oSlider).offset().top;

    var befBox = Layout.orgSlider.prev()[0];
    var aftBox = Layout.orgSlider.next()[0];

    var arrBox = Layout.getChildBox(Layout.orgSlider.parent());

    var nStdPosition = 0;
    var nOrgSize = 0;
    var nAftOrgSize = 0;
    var nDiffSize = 0;
    var sChildType = $(oSlider).attr("ghostType");

    if (sChildType == "V") {
      nStdPosition = $(befBox).offset().left;
      nOrgSize = befBox.offsetWidth;
      nAftOrgSize = aftBox.offsetWidth;
      nDiffSize = l - (nStdPosition + nOrgSize);
      $(befBox).width(nOrgSize + nDiffSize);
      //$(befBox).attr("boxsize",(nOrgSize + nDiffSize).toString());
      $(aftBox).width(nAftOrgSize - nDiffSize);
      //$(aftBox).attr("boxsize",(nAftOrgSize - nDiffSize).toString());
    } else {
      if(befBox!=null){
        nStdPosition = $(befBox).offset().top;
        nOrgSize = befBox.offsetHeight;
        nAftOrgSize = aftBox.offsetHeight;
        nDiffSize = t - (nStdPosition + nOrgSize);
        $(befBox).height(nOrgSize + nDiffSize);
        $(aftBox).height(nAftOrgSize - nDiffSize);
      }
    }
    Layout.setReposition(sChildType, arrBox);

    Layout.getChildBoxHierachy(befBox);
    Layout.getChildBoxHierachy(aftBox);
    
    if(Layout.funcResize!=null){
		Layout.funcResize();
	}
  },
  hiddenGhost : function() {
    $(".sliderghost").css("display", "none");
  },
  toggleBox : function ( box ,bResize) {
    if(bResize==null||bResize==undefined) bResize = true;
    var oDiv = null;
    if($.type(box)== "string" ){
      oDiv= $("#"+box);
      oDiv.toggle();
    }
    /* jquery1.12 버전에서 호출하는 방식 변경 배열의 값을 받아서 보여주도록 한다. */
    else if($.type(box)=="array"){
      $(box).each(function(r,v){
        oDiv = $("#"+v);
        //oDiv = $("#"+$(this)[0]);
        oDiv.toggle();
      });
    }
    Layout.hiddenGhost();
    if(bResize)Layout.resize();
  },
  showBox : function ( box , bResize){
    if(bResize==null||bResize==undefined) bResize = true;
    var oDiv = null;
    if($.type(box)== "string" ){
      oDiv= $("#"+box);
      oDiv.css("display","block");
    }
    /* jquery1.12 버전에서 호출하는 방식 변경 배열의 값을 받아서 보여주도록 한다. */
    else if($.type(box)=="array"){
      $(box).each(function(r,v){
        oDiv = $("#"+v);
        //oDiv = $("#"+$(this)[0]);
        oDiv.css("display","block");
      });
    }
    Layout.hiddenGhost();
    if(bResize)Layout.resize();
  },
  hideBox : function (box , bResize){
    if(bResize==null||bResize==undefined) bResize = true;
    var oDiv = null;
    if($.type(box)== "string" ){
      oDiv= $("#"+box);
      oDiv.css("display","none");
    }
    /* jquery1.12 버전에서 호출하는 방식 변경 배열의 값을 받아서 보여주도록 한다. */
    else if($.type(box)=="array"){
      $(box).each(function(r,v){
        oDiv = $("#"+v);
        //oDiv = $("#"+$(this)[0]);
        oDiv.css("display","none");
      });
    }
    Layout.hiddenGhost();
    if(bResize)Layout.resize();
  },
  resizeBox : function(box, nSize, bResize){
    if(bResize==null||bResize==undefined) bResize = true;
    var oDiv = $("#"+box);
    oDiv.attr("boxsize", nSize);
    if(bResize)Layout.resize();
  },
  restoreSize : function(e){ //더블클릭시 원위치
  Layout.hiddenGhost();
    var oParDiv = Layout.orgSlider.parent();
    oParDiv.children().each(function(){
      Layout.restoreOrgSize($(this));
    });
    Layout.resize();
  },
  restoreOrgSize : function (oBox){
    var sOrgSize = oBox.attr("orgboxsize")==undefined?oBox.attr("boxsize"):oBox.attr("orgboxsize");
    oBox.attr("boxsize",sOrgSize);
    Layout.getChildBoxHierachy(oBox);
    Layout.hiddenGhost();
  },
  makeSlider : function(){ //solid slider 이나 일반 slider을 만들어준다.
    $("div.hslider, div.vslider").each(function(){
      if(Layout.color!=null){
        $(this).css("background",Layout.color);
      }
      if(!Layout.solidslider) Layout.insertSliderImage($(this));
    });
  },
  insertSliderImage : function (oSlider){
    var sClass = "";
    if($(oSlider).hasClass("vslider")) sClass = "drag_vslider";
    else sClass = "drag_hslider";
    var div = "<div class='"+sClass+"'></div>";
    oSlider.html(div);
  },
  setGridSize : function( oBox, width , height){
    var oGridDiv;
    var boxDisplay = false;
    oBox = $(oBox);

    if (oBox.children("[boxDisplay='true']").length>0)
    {
      oGridDiv =oBox.children("[boxDisplay='true']");
      boxDisplay = true;
    }
    else 
      oGridDiv = oBox.children("div.tableBox").children("div[id^='DIV_sheet']");

    var boxWplus =  oGridDiv.attr2("boxWplus") ? parseInt(oGridDiv.attr("boxWplus")):0;
    var boxHplus =  oGridDiv.attr2("boxHplus") ? parseInt(oGridDiv.attr("boxHplus")):0;

    if( oGridDiv.length > 0){
      var oGridParIdv = boxDisplay ? oGridDiv.parent() : oGridDiv.parent().parent();
      oGridParIdv.css({padding:"0",margin:"0"});
      var fixHeight = height-((Layout.grid.border*2) + ( boxDisplay ? 0 : (Layout.grid.padding*2)))+(boxHplus);
      var fixWidth = width-((Layout.grid.border*2) +  (boxDisplay ? 0 : (Layout.grid.padding*2)))+(boxWplus);

      oGridDiv.width(fixWidth);
      oGridDiv.height(fixHeight);
      oGridParIdv.width(width);
      oGridParIdv.height(height);
      
    }
  }
};