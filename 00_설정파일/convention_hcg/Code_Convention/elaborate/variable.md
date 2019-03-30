# 목차

- [변수](#변수)
    - [Java, JSP 변수명](#java-jsp-변수명)
    - [JavaScript 변수명](#javascript-변수명)
    - [사용자 정의 변수](#사용자-정의-변수)

<br>
<br>
<hr>

# 변수
## Java, JSP 변수명
- 클래스 명칭은 기본적으로 파스칼 표기법을 사용한다.
- 일반 변수명은 기본적으로 카멜표기법을 사용한다.
- 지역변수 : DB컬럼명이나 파라미터를 저장하는 변수는 이름을 동일하게 사용한다( 대문자 ).
    ```java
    String S_PGM_ID = form.getValue("S_PGM_ID");
    String S_SEL_YN = StringUtil.nvl(request.getParameter("S_SEL_YN"),"N");
    ```
- 전역변수 : 지역변수와 구별하기 위해 "m_"을 첨자로 붙인다( 소문자 ).
    ```java
    String m_abc = null;
    ```

<br>

[뒤로](https://github.com/InSeong-So/HCG_OJT) / [위로](#목차)

<br>
<hr>

## JavaScript 변수명
- 일반 변수명은 기본적으로 `카멜표기법`을 사용한다.
- 지역변수 : DB컬럼명이나 파라미터를 저장하는 변수는 이름을 동일하게 사용한다( 대문자 ).
    ```js
    var S_EMP_ID = $("#S_SAVENAME").val(); 
    ```
- 전역변수 : 지역변수와 구별하기 위해 "g_"를 첨자로 붙인다( 소문자 ).
    ```js
    var g_time = new Date;
    ```

<br>

[뒤로](https://github.com/InSeong-So/HCG_OJT) / [위로](#목차)

<br>
<hr>

## 사용자 정의 변수
- 같은 의미의 변수명은 모든 페이지에서 동일하게 사용하며, 변수의 재사용을 권한다.
- 단어의 의미를 결합하여 사용하되, 분리된 의미를 연결할땐 ‘_’를 사용한다.
- 예제
    | 접미사     | 의미   | 예제 |
    | :-------- |:------ |:------ |
    |_ymdhms| 년월일시분초|sta_ymdhms / 시작일시 |
    |_ymd| 년월일|end_ymd / 종료일 |
    |_ym| 년월|job_ym / 작업년월 |
    |_yy| 년|adapt_yy / 적용년도 |
    |_mm| 월|adapt_mm / 적용월 |
    |_dd| 일|adapt_dd / 적용일 |
    |_hms| 시분초|sta_hms / 시작시간 |
    |_type| 유형|prg_type / 프로그램유형 |
    |_rate| 비율|prog_rate / 진행율 |
    |_pro| 백분율|- / - |
    |_num| 수|tot_num / 총수 |
    |_grd| 등급|pens_grd / 국민연금등급 |
    |_yn| 여부|use_yn / 사용여부 |
    |_cd| 코드|code_cd / 코드 |
    |_nm| 이름|coded_nm / 코드명 |
    |_cnt| 건수|process_cnt / 처리건수 |
    |_class| 구분 또는 분류|job_class / 직무분류 |
    |_mon| ~금/~액/~비/~가|tot_mon / 총액 |
    |_rank| 순위|tot_rank / 전체순위 |
    |_tax| 세금/세|incom_tax / 소득세  |
    
<br>

[뒤로](https://github.com/InSeong-So/HCG_OJT) / [위로](#목차)

<br>
<hr>
