# HCG Code Convention
## Basic Rule
### Space
- java: 4 spaces
  - 그 외 파일(html, jsp, js, css, xml, htc 등): 2 spaces

<br>

### Upper&Lower
- 쿼리, DB프로시저, DB함수 또는 컬럼 변수는 대문자
  - html tag, 속성 은 소문자

<br>

### Tag Attribute Value
- html 속성 값은 큰따옴표("")로 감싼다.

<br>

### Code
- 블록 시작은 구분의 다음 줄부터 시작한다.
  - 이 방식은 Sun 의 코딩 표준 권고안이며, 문장을 별도의 행에 분리하여 가독성이 높고, 소스 이동이 용이하다.

<hr>

- 복잡한 조건식 표현은 피한다.
    ```js
    if ( (elementNo < 0) || (elementNo > maxElement) || elementNo == lastElement )
    {
    　<!-- Code Contents -->
    }
    ```
- `위 소스는 다음과 같이 변경한다.`
  ```js
  boolean isFinished = (elementNo < 0) || (elementNo > maxElement);
  boolean isRepeatedEntry = elementNo == lastElement;
  if (isFinished || isRepeatedEntry)
  {
  　<!-- Code Contents -->
  }
  ```

<hr>

- 조건식에 실행문을 쓰지 않는다.
    ```js
    if ( (file = openFile(fileName, "w") ) != null)
    {
    　<!-- Code Contents -->
    } 
    ```
- `위 소스는 다음과 같이 변경한다.`
  ```js
  file = openFile(fileName, "w");
  if (file != null)
  {
  　<!-- Code Contents -->
  }
  ```
    
<hr>

- 가독성을 위해 모든 연산자의 앞, 뒤에 space를 넣는다.

<br>

## Comment
### Variable Comment
```js
Int loopCnt = 0; // 루프를 위한 카운터 변수
String user_id = ""; // 사용자 ID

// 멀티라인 코멘트
Vector sqlMacro = null; // sql문장내의 macro저장 벡터
String user_nm  = null; // 추가적인 변수 선언에 대한 코멘트
```

<br>

### Code Comment
```js
// 해당 테이블의 정보를 구한다.
vect = remote.selectCodeList2(table_id, col_cd, col_nm, syntax, size);
```
<br>

### JSP Comment
```js
<%--
 Program Name   : sys010_ul01.jsp
 Description    : 코드인덱스를 관리한다.
 Author         : 홍길동
 History        : 2009-07-15 신규개발
                  2009-07-15 무슨 무슨 내용 수정 [수정자이름]
--%>
```
<br>

### JAVA Comment
```java
/**
 * Program Name : Sys011_ul01DS
 * Description  : 사회보험등급표를 관리한다.
 * History      : 2008-08-01 신규개발
                  2009-07-15 무슨무슨 내용 수정 [수정자이름]
 * @author      : 홍길동
 */
```
<br>

### Java Method Comment
```java
/**
* 코드인덱스를 조회한다.
* 
* @param form
* @throws SQLException
*/
```
<br>

### DB Procedure, Function Comment
```sql
/******************************************************
 Program Name   : F_CALC_CALC_MON
 Description    : 급여 계산일수를 구한다.
 Author         : 홍길동
 History        : 2008-08-01 신규개발
                  2009-07-15 무슨 무슨 내용 수정 [수정자이름]
******************************************************/
```
<br>

## Module Naming Rule
> 설계에서 정의되지 않은 서브모듈이 있다면 표준 정의 후 사용한다.
### 조직관리(Organization Management, **`orm`**)
| Sub Module ID        | Sub Module 명           |
| :------------------- |:---------------:        |
| om_bas	           | 조직관리                 |
| om_org	           | 조직도관리 (org. chart)  |
| om_simul	           | 조직simulation           |
| om_to	               | 정원관리, 계획관리        |
| om_work	           | 화상개인업무분장관리      |

<br>

### 직무역량(Job & Competency Management, **`jcm`**)
| Sub Module ID        | Sub Module 명           |
| :------------------- |:---------------:        |
| jm_job 	           | 직무관리                 |

<br>

### 인사운영(Personnal Administration & Staffing, **`pas`**)
| Sub Module ID        | Sub Module 명           |
| :------------------- |:---------------:        |
| pa_bas	           | 인사기본관리                 |
| pa_order 	           | 발령관리             |
| pa_cert	           | 제증명관리                 |
| pa_insur	           | 보증보험관리               |
| pa_stat	           | 인사현황/통계             |
| pa_work	           | 개인업무분장관리            |
| pa_resid	           | 해외주재원관리         |

<br>

### 근태(Time & Absence Management, **`tam`**)
| Sub Module ID        | Sub Module 명           |
| :------------------- |:---------------:        |
|tm_bas|	근태기준, 근무조관리|
|tm_day|	일근태관리|
|tm_month	|월근태관리|
|tm_quota|	연월차관리|
|tm_stat	|근태통계/현황|

<br>

### 급여(Payroll & Compensation Management, **`pcm`**)
| Sub Module ID        | Sub Module 명           |
| :------------------- |:---------------:        |
|py_bas|	급여기준|
|py_calc|	급여계산|
|py_garnish|	채권압류|
|rt_pen|	퇴직연금 |
|rt_ret|	퇴직금/퇴직충당금|
|py_stat|	급여통계/현황|

<br>

### 소득정산(Adjustment, **`adj`**)
| Sub Module ID        | Sub Module 명           |
| :------------------- |:---------------:        |
|adj_bas|	소득정산기준|
|adj_com|	소득정산 공통|
|adj_exec|	소득정산 수행|
|adj_ret|	퇴직자 소득정산|
|adj_stat|	소득정산출력|

<br>

### 복리후생(Benefit & Social Insurance, **`bsi`**)
| Sub Module ID        | Sub Module 명           |
| :------------------- |:---------------:        |
|be_si|	사회보험(국민연금,건강보험,고용보험,산재보험)|
|be_con|	경조금|
|be_scho|	학자금|
|be_cafe|	선택적복리후생|
|be_club|	동호회|
|be_loan|	대출|
|be_condo|	콘도, 휴게소, 문화시설|

<br>

### 채용(Job Based Recruiting Management, **`rem`**)
| Sub Module ID        | Sub Module 명           |
| :------------------- |:---------------:        |
|re_appl|	입사지원자관리|
|re_bas|	채용기본정보관리|
|re_common|	채용공통|
|re_doc|	서류전형관리|
|re_home|	채용홈페이지연동관리|
|re_intv|	면접관리|
|re_stat|	채용통계(맞춤통계)|
|re_step|	단계별합격자관리|

<br>

### 총무(General Management, **`gen`**)
| Sub Module ID        | Sub Module 명           |
| :------------------- |:---------------:        |
|ge_ncard|	명함|
|ge_aut|	차량관리|
|ge_eqp|	소모품관리|
|ge_doc|	문서수발|
|ge_btr|	출장관리|

<br>

### 평가관리(Performance Evaluation & Management, **`pem`**)
| Sub Module ID        | Sub Module 명           |
| :------------------- |:---------------:        |
pm_bas	평가기준
pm_main	평가메인
op_org	조직성과
pm_exec	평가수행
pm_raise	승격
pm_stat	평가통계/현황

<br>

### 보상관리(Compensation Management, **`cm`**)
| Sub Module ID        | Sub Module 명           |
| :------------------- |:---------------:        |
|cm_bas|	보상기준|
|cm_bonus|	보상시뮬레이션|

<br>

### 경력개발(Career Development Planning, **`cdp`**)
| Sub Module ID        | Sub Module 명           |
| :------------------- |:---------------:        |
|cd_cp|	경력경로관리|
|cd_idp| 	경력개발(이동)계획|
|cd_pubc| 	사내공모|
|cd_talent| 	핵심인재관리|
|cd_mentor |	멘토링|
|cd_sp|	후임자관리|
|cd_match| 	profile match-up|

<br>

### 교육연수(Training & Event Management, **`temp`**)
| Sub Module ID        | Sub Module 명           |
| :------------------- |:---------------:        |
|te_bas|	교육기준|
|te_plan|	교육계획|
|te_course|	과정관리|
|te_event| 	교육시행|
|te_lang|	어학검정|
|te_que|	교육설문(ehrd)|
|te_scho|	학술연수|
|te_result|	교육결과(이력/실적)|
|te_stat|	교육통계/현황|

<br>

### 시스템(System Administration, **`sys`**)
| Sub Module ID        | Sub Module 명           |
| :------------------- |:---------------:        |
|sy_cd|	코드관리(공통코드)|
|sy_bas|	코드기준(공통코드 外)|
|sy_obj|	객체관리|
|sy_auth|	권한관리|
|sy_appl|	신청서|
|sy_log|	log|
|sy_main|	초기(main)화면, 게시판|
|sy_batch|	배치처리|
|sy_com|	공통기본기능|
|sy_sql|	조건검색|
|sy_widget|	위젯관리|
