# 개발정리mobile 목차

# 기본 정보
## Vue.js의 간략한 개요
> MVVM 패턴을 사용한 `프로그레시브 프레임워크`

### Vue의 인스턴스

### Vue의 라이프사이클

### Vue의 컴포넌트

<hr>
<br>

## project `Venus`(hunel Mobile Version)
### 데이터 프로세스
<div align=center>

<img src="img2/00.jpg" alt="00" width="400"/>

</div>

<br>

### 요구 스택 
<div align=center>

|구분|세부 내용|
|----|---------|
|O/S|`Windows`, `Unix / Linux`|
|JDK Version|`jdk1.7` 이상|
|DBMS|`OracleDB 11g` 이상|
|Web Server|제약 없으나 hunel 구축 사례를 참고할 것|
|Web Application Server|제약 없으나 hunel 구축 사례를 참고할 것|
|Language|`Java`|
|Server-Side Template|`jsp`|
|Front-end Framework|`jQuery`, `Vue.js`, `Bootstrap4.x` 이상|
|UI Component|Vuetify.js|
|CSS Preprocessor|`SASS`|

</div>

<hr>
<br>

# 모바일 개발 표준
## 기본 코드(포맷) 소개
```jsp
<%@page language="java" contentType="text/html; charset=utf-8" %>
<%@include file="/common/jsp/header.jsp"%>
<html>
<head>
<title>:: HCG hunel Mobile v.3.0 ::</title>
<%@include file="/common/jsp/commonResource.jsp"%>
<script>
var vmMaster;

function LoadPage()
{
  initVueApp();
}

function initVueApp()
{
  var pageVueParam = {

    // 각 페이지에서 개발자가 작성한 Vue 옵션

  }; //common.js의 baseVueParam과 merge됨

  vmMaster = HCG.initVue(pageVueParam);
}
</script>
</head>
<body class="vh100">
<%@include file="/main/jsp/menu.jsp"%>
<div id="vmMaster" class="container-fluid pt50">
<v-app class="h-app">
<v-form ref="f1" name="f1" method="post" onsubmit="return false">

<!-- Freeform 등 페이지 디자인 -->

</v-form>
</v-app>
</div>
</body>
</html>
```

<hr>
<br>

## 인스턴스 생성
> Vue 앱은 Vue 인스턴스를 생성해야 사용할 수 있음
Vue 인스턴스는 new Vue()로 만드는 것이 기본 방법이지만 미리 만들어 놓은  baseVueParam과 개발자가 페이지에서 만들어 놓은 pageVueParam을 merge하여 개발의 편의성을 보장하기 위해 HCG.initVue를 통해 인스턴스를 만듭니다.

```js
var pageVueParam = 
{

    // 각 페이지에서 개발자가 작성한 Vue 옵션

};


var vmMaster = HCG.initVue( pageVueParam );
// common.js의 baseVueParam과 pageVueParam을 merge하여 공통함수를 매번 정의하지 않아도 됨
```

<hr>
<br>

## 페이지별 Vue 옵션 작성
작성되는 페이지에는 반드시 Vue 인스턴스를 만들기 위한 옵션을 작성해야 하며 pageVueParam 이란 이름으로 작성합니다.
이렇게 작성된 Vue 인스턴스 생성을 위한 옵션은 추가적으로 common.js의 baseVueParam 객체와 merge 되어 Vue 인스턴스를 생성합니다.

Merge된 옵션으로 Vue 인스턴스를 작성하는 방법은 HCG.initVue( pageVueParam)을 이용하는 것입니다.

```js
var pageVueParam = 
{ 
    el:"#vmMaster"  //Vue 인스턴스를 만들 컨테이너 ( body태그는 안됨 )
    ,data :
    {
       dsClass : "<com:otp value="Biz클래스명"/>" //Biz Class명 ( OTP로 1회용 암호화  )
      ,dsMethod : ""     //Biz Method명 ( 로직에 따라 변경되므로 스크립트로 지정 )
      ,resultSet : {}    //조회된 결과
      ,combo : {}        //combo등에 사용될 Prepared Data
      ,condition: { }    //조회조건에 사용될 파라미터
      ,visible : {}      //팝업이나 버튼 등의 show를 조절할 변수
    }
    ,methods : 
    {
      v_함수명: function() //뷰 전용 함수는 함수명 앞에 v_를 붙여 일반 함수와 구분함
      {
        
      }
    }
};


var vmMaster = HCG.initVue( pageVueParam );
```

- 공통 옵션인 baseVueParam을 수정하면 모든 Vue 인스턴스에 baseVueParam의 옵션이 적용되게 할 수 있습니다.
- 다만 baseVueParam과  pageVueParam이 같은 내용을 동시에 정의 하면 pageVueParam의 내용이 적용됩니다.


<hr>
<br>

## 다국어 출력
- 다국어 프로퍼티에 설정된 다국어는 기존과 같이 Label 또는 Message로 표시
- 단, 뷰와 일반적인 스크립트는 함수명이 다르므로 사용에 주의
- 휴넬과의 호환을 위해 ajaxMsg 등의 함수는 같은 이름으로 구현 되어 있지만 ajax로 동작하지는 않습니다.

- Label 다국어
  ```js
  v_getLabel("fam","가족");                 //뷰함수로 이용해야 할 경우
  HCG.getLabel("fam","가족");               //기본 script 함수로 이용해야 할 경우
  HCG.getMultiLang("label", "fam", "가족"); //기본 script 함수로 이용해야 할 경우 ( HCG.getLabel과 동일 )
  ```

- Message 다국어
  ```js
  v_getMessage("MSG_ALERT_NOT_FOUND","조회된 데이터가 없습니다.")                 //뷰함수로 이용해야 할 경우
  HCG.getMessage(" MSG_ALERT_NOT_FOUND ","조회된 데이터가 없습니다.");            //기본 script 함수로 이용해야 할 경우
  HCG.getMultiLang("message", " MSG_ALERT_NOT_FOUND ", "조회된 데이터가 없습니다."); //HCG.getMessage와 동일
  HCG.ajaxMsg("MSG_ALERT_NOT_FOUND","조회된 데이터가 없습니다.");                    //HCG.getMessage와 동일
  ```

<hr>
<br>

## 보이기 / 감추기 (열기 / 닫기)
데이터의 visible 객체에는 버튼, 입력폼, 팝업 등의 보이기, 감추기 또는 열기, 닫기를 의미하는 여러 변수를 담습니다.
버튼은 btn, 팝업은 pop, 입력폼 관련은 inp, 기타 블럭은 box의 접두사를 붙여 사용합니다

```js
data :
{
  // 생략
  ,visible :
  {
    btnSave : false      //버튼 show, hidden 용 변수 btn으로 시작
    ,popInfo : false     //팝업 open, close 용 변수 pop으로 시작
    ,inpStaYmd : false   //입력폼 show, hidden 용 변수 inp로 시작
    ,boxArea : false     //기타 블럭 show, hidden 용 변수 box로 시작
  }
  // 생략
}
```

동적으로 보이기/감추기를 변경하려면 Vue.set을 이용하여 visible 변수를 변경합니다

```js
Vue.set( this.visible     , "btnSave", true ); //뷰 함수 내부에서 사용할 때에는 this를 사용할 수 있음
Vue.set( vmMaster.visible , "btnSave", true ); //일반 함수에서 사용할 때에는 this 대신 vmMaster 등 뷰앱을 이용해야 함
```

Visible 변수는 v-show 또는 v-if로 연결하여 사용합니다.

```html
<div id="h-detail-layer" class="h-detail-layer" v-show="visible.boxArea"><!-- 코드 작성 --></div>
<div id="h-detail-layer" class="h-detail-layer" v-if="visible.boxArea"><!-- 코드 작성 --></div>
```

<hr>
<br>

## Combo 생성용 데이터 준비 및 바인드
> PreparedData로 준비된 데이터는 combo 객체에 담습니다. cb 접두사를 붙이고 뒤에 해당 인덱스 코드나 구분할 수 있는 이름을 붙여 사용합니다.

```js
data : 
{
   // 생략
   ,combo : 
   {
      cbSY03  : HCG.setCombo(<%=hmPreparedData.get("SY03")%>)
     ,cbSY04  : HCG.setCombo(<%=hmPreparedData.get("SY04")%>)
     ,cbTAM_CD : HCG.setCombo(<%=hmPreparedData.get("TAM_CD")%>)
   }
   // 생략
}

```

v-select 컴포넌트에 items 속성으로 combo 데이터를 연결합니다.
Item-text는 명칭 컬럼, item-value는 코드컬럼을 설정할 수 있습니다.
디자인 적용을 위해 
<v-fade-transition slot=＂append＂>
  <i class=＂icon-select_arrow＂></i>
</v-fade-transition>
를 함께 작성합니다.

```html
<v-select outline :items="combo.cbSY04" class="h-combo" v-model="뷰모델" ref="명칭" item-text="CD_NM" item-value="CD" >
  <v-fade-transition slot="append">
    <i class="icon-select_arrow"></i>
  </v-fade-transition>
</v-select>
```

<hr>
<br>

## 데이터 조회
pageVueParam에 사용할 로직이 있는 class명을 dsClass로, method명을 dsMethod로 설정하고 (OTP 태그 사용) 조회조건으로 서버에 넘겨야 하는 것들은 condition 객체에 넣어둡니다.
조회하여 얻은 결과는 resultSet 객체의 메소드명 객체에 담습니다.

```js
var pageVueParam = 
{ 
    // 생략
    ,data :
    {
       dsClass : "<com:otp value="Biz클래스명"/>"
      ,dsMethod : ""
      // 생략
      ,condition: 
      {
         S_EMP_ID : ""
        ,S_EMP_GRADE_CD : "" 
      }
      ,resultSet:
      {
         search01 : []
      }
      // 생략
    }
    ,methods : 
    {
      v_search01: function()
      {
         search01();
      }
    }
};

function search01()
{
  if( !vmMaster.v_checkForm("f1") )
  {
    return false;
  }

  Vue.set(vmMaster, "dsMethod", "<com:otp value="search01"/>");
  Vue.set(vmMaster.condition, “S_EMP_ID”, “1801001”);
  Vue.set(vmMaster.condition, “S_EMP_GRADE_CD”, “A001”);

  HCG.ajaxRequestJson( vmMaster , function( response )
  {
    if(!HCG.chkResponse(response)) return;
    if(HCG.isArray(response.Data))
    {
      Vue.set(vmMaster.resultSet, "search01", response.Data);
    }
    else
    {
      Vue.set(vmMaster.resultSet, "search01", []);
    }
  });
}
```

## 조회조건 뷰모델과 컴포넌트의 연결
조회조건으로 사용되는 데이터는 condition 객체에 담아두어야 하며 다른 데이터와 구분하기 위해 S_ 접두사를 이용하여 작명합니다.(S_ + DB컬럼명)
컴포넌트와는 v-model 속성을 이용하여 연결합니다.

```js
var pageVueParam = 
{ 
    // 생략
    ,data :
    {
       dsClass : "<com:otp value="Biz클래스명"/>"
      ,dsMethod : ""
      // 생략
      ,condition: 
      {
         S_EMP_ID : ""
        ,S_EMP_GRADE_CD : "" 
      }
      ,resultSet:
      {
         search01 : []
      }
      // 생략
    }
    ,methods : 
    {
      v_search01: function()
      {
         search01();
      }
    }
};
```

```html
<v-text-field v-model="condition.S_EMP_ID"></v-text-field>
<v-select v-model="condition.S_EMP_GRADE_CD"></v-select>
```

<hr>
<br>

## 리스트 데이터 표시
resultSet에 배열로 담겨 조회된 내용을 화면에 표시 하기 위해선 v-for를 이용하여 화면에 표시합니다.
v-for 루프안에서 배열을 구성하는 객체를 의미하는 item과 index를 사용할 수 있습니다.

```html
<ul>
  <li v-for="(item, index) in resultSet.search01"> 
    순번 : {{index}}, 성명 : {{item.EMP_NM}} , 사번 : {{item.EMP_ID}} 
  </li>
</ul>
```

배열 안에 배열이 있는 2중 배열 구조의 데이터를 표시할 땐 v-for 안에 v-for를 사용해야 합니다.
Item 안의 item은 itemD로 명명합니다. ( 동일한 item명을 사용하면 안됨 )

```html
<ul>
  <li v-for="(item, index) in resultSet.search01"> 
    <ul>
      <li v-for="(itemD, indexD) in item"></li>
    </ul>
  </li>
</ul>

```

<hr>
<br>

## 포맷 입력폼 ( h-format-field ) 컴포넌트
포맷 입력폼 컴포넌트는 숫자 표시, 주민번호, 사업자 번호 등의 format을 설정할 수 있는 입력폼 입니다.
단, 년월일 타입(dfDateYmd)의 경우 포맷은 적용되지만 달력을 사용할 수 없습니다.
달력에서 선택하는 년월일 입력폼을 원할 경우는 h-date-field를 사용해야 합니다.

```html
<h-format-field data-format="dfDateYy"></h-format-field>
<h-format-field data-format="dfInteger"></h-format-field>
<h-format-field data-format="dfInteger"></h-format-field>
<h-format-field data-format="dfInteger"></h-format-field>
```

|이름|적용형태|내용|
|dfTimeHms|##:##:##|시간분초|
|dfTimeHm|##:##|시간분|
|dfIdNo|######-#######|주민번호|
|dfSaupNo|###-##-#####|사업자번호|
|dfCardNo|####-####-####-####|카드번호|
|dfPostNo|###-###|(구)우편번호|
|dfCorpNo|######-#######|법인번호|
|dfIssueNo|####-######|이슈번호|
|dfInteger1|###|숫자|

|dfDateYy|####|년도|
|dfDateMm|##|월|
|dfDateYmd|####.##.##|년월일|
|dfDateYmd1|####.##.##|년월일|
|dfDateYm|####.##|년월|
|dfDateMd|##.##|월일|
|dfTimeHms|##:##:##|시분초|
|dfTimeHm|##:##|시분|
|dfTimeYmdhms|####.##.## ##:##:##|년월일시분초|
|dfIdNo|######-#######|주민번호|
|dfSaupNo|###-##-#####|사업자번호|
|dfCardNo|####-####-####-####|카드번호|
|dfPostNo|###-###|(구)우편번호|
|dfCorpNo|######-#######|법인번호|
|dfIssueNo|####-######|이슈번호|
|dfNo|######|숫자|
|dfInteger+|천단위 , 숫자|
|dfInteger1|천단위 , 숫자|
|dfInteger|천단위 , 숫자|
|dfFloat+|-|-|
|dfFloat|-|-|
|dfTel|-|-|

<hr>
<br>

## 날짜 입력폼 ( h-date-field ) 컴포넌트
날짜 입력폼 컴포넌트는 calendar 컴포넌트와 함께 사용하여 달력 팝업을 통해 데이터를 입력 받을 수 있는 컴포넌트 입니다.
반드시 h-calendar-dialog와 함께 사용해야 하며 h-date-field가 한 페이지에 여러개라 하여도 h-calendar-dialog는 하나만 있으면 됩니다.

컴포넌트 자신의 ref, 달력컴포넌트의 ref를 반드시 지정해 주어야 합니다.

```html
<!-- 캘린더 컴포넌트 -->
<h-calendar-dialog ref="calendar"></h-calendar-dialog>
<!-- 시작일 -->
<h-date-field calendar-ref="calendar“ ref=“STA_YMD” v-model=“formValue.STA_YMD” :rules="[rules.ymd]“></h-date-field>
```

<hr>
<br>

## 저장 데이터 뷰모델과 컴포넌트의 연결
사용자의 입력값을 받아 저장하려는 용도로 사용되는 데이터는 formValue 객체에 담아두는것이 원칙이며 DB에서 사용되는 컬럼명과 동일하게 작명합니다.
컴포넌트와는 v-model 속성을 이용하여 연결합니다.

```js
var pageVueParam = 
{ 
    // 생략
    ,data :
    {
       dsClass : "<com:otp value="Biz클래스명"/>"
      ,dsMethod : ""
      // 생략
      ,formValue: 
      {
         EMP_ID : ""
        ,EMP_GRADE_CD : "" 
      }
      // 생략
    }
    ,methods : 
    {
      v_save01: function()
      {
         save01();
      }
    }
};

```
```html
<v-text-field v-model="formValue.EMP_ID"></v-text-field>
<v-select v-model="formValue.EMP_GRADE_CD" ></v-select>

```

<hr>
<br>

## 폼데이터 저장하기
pageVueParam에 사용할 로직이 있는 class명을 dsClass로, method명을 dsMethod로 설정하고 (OTP 태그 사용)
서버에 넘겨 저장해야 하는 것들은 formValue 객체에 넣어둡니다.
조회와 저장이 동시에 하나의 화면에 있는 경우는 저장을 위한 form과 조회를 위한 form을 따로 사용해야 합니다.
HCG.ajaxRequestJsonProg를 사용하여 저장을 진행합니다.

```js
function save01()
{
  Vue.set(vmMaster, "dsMethod", "<com:otp value='save01' />");    //method명 변경
  if(!vmMaster.$refs["f1"].validate()) return;                    //validation 체크
  var param = vmMaster.formValue;                                 //저장할 객체 지정
  HCG.ajaxRequestJsonProg(vmMaster.dsClass, vmMaster.dsMethod, param, function( response )
  {
    if(!HCG.chkResponse(response)) return;
    search01();
  });
}
```

## 팝업 기본 Markup
### 앱을 분리하지 않는 팝업
```html
<v-dialog v-model="visible변수" scrollable >
  <v-card>
    <v-card-title>
      <hgroup class="h-popup-header">
        <h1>
          <span><!-- 팝업타이틀 --></span>
          <v-btn class="h-popup-close-btn">
            <i class="icon-close" @click="v_popClose"></i>
          </v-btn>
        </h1>
      </hgroup>
    </v-card-title>
      
    <v-divider light class="m-0"></v-divider>
    
    <v-card-text>
    
      <!-- 코드 작성 -->

    </v-card-text>
      
    <v-card-actions>
      <v-btn flat class="h-button-positive1st" >선택</v-btn>
      <v-btn flat class="h-button-negative1st" @click="v_popClose">닫기</v-btn>
    </v-card-actions>
  
  </v-card>
</v-dialog>
```

<br>

### 앱(Vue instance)으로 분리되는 팝업
프로그램의 복잡도를 낮추고 재사용을 수월하게 하기 위해 Vue 인스턴스를 분리하는 형태의 팝업은 다음과 같은 기본 MarkUp을 갖습니다
이런 형태의 Vue 인스턴스는 페이지의 eventBus에 등록하여 다른 인스턴스에서 참조할 수 있도록 합니다. 

```html
<div id="<%=S_MODAL_NM%>">
<v-app v-show="visible.popModal" class="position-absolute">
<v-form id="f1" name="f1" ref="f1" method="post" v-model="valid">
  <v-dialog v-model="visible.popModal" scrollable max-width="700">
    <v-card> 
      <v-card-title>
        <hgroup class="h-popup-header">
          <h1>
            <span><!-- 팝업 타이틀 --></span>
            <v-btn class="h-popup-close-btn">
              <i class="icon-close" @click="visible.popModal=false"></i>
            </v-btn>
          </h1>
        </hgroup>
      </v-card-title>
      
      <v-card-text class="h-popup-content">    
      <!-- 코드 작성 -->
      </v-card-text>
      <v-card-actions class="text-center p-0">
        <v-btn flat class="h-button-positive1st m-0"  @click="v_choice">{{v_getLabel('choice','선택')}}</v-btn>
        <v-btn flat class="h-button-negative1st m-0"  @click="v_close" >{{v_getLabel('close','닫기')}}</v-btn>
      </v-card-actions>
      
    </v-card>
  </v-dialog>

</v-form>
</v-app>

</div>

```

# 상세 정보 모음