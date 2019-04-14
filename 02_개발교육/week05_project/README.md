# 과제 주제 : 사내 유니폼 지급 관리
```
시스템 - 차트종류별샘플(ibchart) : 차트
인사관리 - 직군별/근속별현황 : 차트 샘플
평가관리 - 평가기준관리 : 회차별 유니폼 지급관리
인사관리 - 개인별 증빙관리 : 파일 업로드(웹 표준, ie 구버전 기준별)
(우리는 크롬으로 통일)
```
## 필수 과제
- Master & Detail 형태의 Grid를 이용한 화면

- Procedure를 사용한 대상자 생성

- 결재라인이 있는 신청서

- Crownix를 사용한 Report

- 통계 쿼리를 사용한 현황

- 파일 업로드 컴포넌트를 사용한 파일업로드

## 추가도전과제
- IBChart를 사용한 차트

- 동적 Script를 사용한 화면 구성

- 메일 발송

- 기타 개인적인 도전

## 프로그램
### 유니폼 지급 회차 관리
- (필수)Master & Detail 형태의 Grid 구현

- (필수)유니폼 속성(종류, 사이즈 성별 등) 데이터는 공통코드를 활용

- (필수)유니폼 사진 업로드 기능 구현

### 유니폼 지급 대상자 관리
- (필수)Procedure를 이용하여 대상자를 생성

- (선택)대상자들에게 안내 메일 발송

### 유니폼 지급 신청
- (필수)결재라인이 있는 신청서 구현

- (필수)성별정보를 체크하여 유효한 유니폼만 신청 가능하도록 함

- (필수)유니폼 사진을 신청서에서 확인할 수 있도록 함

- (선택)회차 정보에서 재고를 관리, 신청서 작성 시 재고 체크 후 제한

### 유니폼 지급 관리
- (필수)승인된 유니폼 신청서의 결과를 관리

- (필수)개인별 의류 지급 내역서 Report 기능 구현

- (선택)직원의 유니폼 수령 여부를 체크하는 속성과 기능, 프로그램을 추가

### 유니폼 지급 현황
- (필수)유니폼이 지급된 현황을 제공

- (선택)IBChart를 활용한 현황

- (선택)동적으로 생성한 Dom을 이용한 정보 표시


## 데이터베이스 설계
### 유니폼 지급 회차 관리
```sql
C_CD            회사코드
GIV_SID_ID      지급회차ID
GIV_SID_NM      지급회차명
GIV_YY          지급년도
GIV_PGR_YN      지급진행 여부
GIV_TYPE        지급유형
NOTI_SBJ        공지사항
NOTE            비고
INS_USER_ID     입력자ID
INS_YMDHMS      입력일시
MOD_USER_ID     작업자ID
MOD_YMDHMS      수정일시
INS_GYMDHMS     입력일시_현지
MOD_GYMDHMS     수정일시_현지
```



# 모바일

## 애플
- 컴퓨터와 모바일은 알림에 대한 차이가 있음
- 애플은 엔터프라이즈서버가 존재함
  - 스토어에 등록하려면 2~3개월의 검토기간이 필요함
- WAS, 웹
- 추구하는것은 하이브리드 웹
- 모바일 웹과 웹앱의 차이점
  - 웹표준, 웹접근성 등의 적용은 동일
    - 웹 표준
    - 웹 접근성

- ajax는 서버와 자주 통신해야하므로 프로그램에 오류가 생길 수 있다.
- 입력란(input) 은 최대 2개까지만
- 버튼은 2~3개까지
- 촬영 사진은 고용량이므로 패킷 교환량이 순식간에 올라간다.
  - resize를 통해 원본이미지에서 효율적인 크기/용량의 이미지를 새로 작성한다.


# 콤보

급여관리 - 고정급관리
      ajaxSyncRequestXS($("#S_DSCLASS").val(), "<com:otp value='selPayItem'/>", {S_STA_YM:sta_ym, S_END_YM : end_ym, S_PAYITEM_TYPE : $("#S_PAYITEM_TYPE").val()}, function(xs)
      {
        setCombo(xs, "S_PAYITEM", null, "A");
      });


# 이슈 정리
- 유니폼지급회차관리
  - 유니폼지급대상자관리 팝업창
  - 유니폼상세 사이즈별 도움말 처리
- 유니폼지급대상자관리
  - 복수 데이터 추가
  - 하위 조직까지 검색
- 유니폼신청
- 유니폼신청결재
- 유니폼신청승인
- 유니폼지급현황
- 유니폼신청관리


```SQL
  INSERT INTO PR3210_TMP (C_CD, EMP_ID, GIV_STD_ID, ORG_ID, EMP_GRADE_CD)
  SELECT T1.C_CD,
         T1.EMP_ID,
         I_GIV_TRG_NM,
         T2.ORG_ID,
         T2.EMP_GRADE_CD
  FROM PA1010 T1,
       PA1020 T2
  WHERE T1.C_CD = I_C_CD
    AND T2.C_CD = T1.C_CD
    AND (I_ORG_ID IS NULL OR T2.ORG_ID = I_ORG_ID)
    AND T2.EMP_ID = T1.EMP_ID
    AND (I_EMP_GRADE_CD IS NULL OR T2.EMP_GRADE_CD = I_EMP_GRADE_CD)
    AND (I_GENDER_TYPE IS NULL OR T1.GENDER_TYPE = I_GENDER_TYPE)
    AND T1.STAT_CD LIKE '1%'
    AND T2.LAST_YN = 'Y'
    AND TO_CHAR(SYSDATE, 'YYYYMMDD') BETWEEN T2.STA_YMD AND T2.END_YMD
    AND T2.ORG_ID IN (
    SELECT O.OBJ_ID
    FROM (
           SELECT T1.*
           FROM SY3020 T1
           WHERE T1.C_CD = '10'
             AND T1.OBJ_TYPE IN (
             SELECT A.OBJ_TYPE
             FROM SY3080 A
             WHERE A.C_CD = '10'
               AND A.OBJ_TREE_TYPE = 'ORGTREE'
           )
             AND TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') BETWEEN T1.STA_YMD AND T1.END_YMD) O
    START WITH O.C_CD = '10'
           AND O.OBJ_TYPE = 'O'
           AND (I_ORG_ID IS NULL OR O.OBJ_ID = I_ORG_ID)
           AND O.PAR_OBJ_TYPE IN ('O', 'RT')
           AND TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') BETWEEN O.STA_YMD AND O.END_YMD
    CONNECT BY PRIOR O.C_CD = O.C_CD
           AND PRIOR O.OBJ_TYPE = O.PAR_OBJ_TYPE
           AND PRIOR O.OBJ_ID = O.PAR_OBJ_ID);
```


SELECT T1.C_CD,
       T1.UNIF_CD,
       T1.UNIF_NM,
       T1.UNIF_BRAND,
       T1.GENDER_TYPE,

       T1.TOP_SIZE,
       CASE
         WHEN T1.TOP_SIZE = 'F' THEN '65'
         WHEN T1.TOP_SIZE = 'S' THEN '70'
         WHEN T1.TOP_SIZE = 'M' THEN '72.5'
         WHEN T1.TOP_SIZE = 'L' THEN '74'
         WHEN T1.TOP_SIZE = 'XL' THEN '76.5'
         END TOP_LEN,
       CASE
         WHEN T1.TOP_SIZE = 'F' THEN '52'
         WHEN T1.TOP_SIZE = 'S' THEN '46'
         WHEN T1.TOP_SIZE = 'M' THEN '49'
         WHEN T1.TOP_SIZE = 'L' THEN '51.5'
         WHEN T1.TOP_SIZE = 'XL' THEN '53'
         END TOP_SHOL,
       CASE
         WHEN T1.TOP_SIZE = 'F' THEN '54'
         WHEN T1.TOP_SIZE = 'S' THEN '52'
         WHEN T1.TOP_SIZE = 'M' THEN '54.5'
         WHEN T1.TOP_SIZE = 'L' THEN '56.5'
         WHEN T1.TOP_SIZE = 'XL' THEN '59'
         END TOP_CHES,
       CASE
         WHEN T1.TOP_SIZE = 'F' THEN '23'
         WHEN T1.TOP_SIZE = 'S' THEN '22'
         WHEN T1.TOP_SIZE = 'M' THEN '23.5'
         WHEN T1.TOP_SIZE = 'L' THEN '25.5'
         WHEN T1.TOP_SIZE = 'XL' THEN '27'
         END TOP_SLEE,

       T1.BOT_SIZE,
       CASE
         WHEN T1.BOT_SIZE = 'F' THEN '90'
         WHEN T1.BOT_SIZE = 'S' THEN '93'
         WHEN T1.BOT_SIZE = 'M' THEN '94'
         WHEN T1.BOT_SIZE = 'L' THEN '95'
         WHEN T1.BOT_SIZE = 'XL' THEN '96'
         END BOT_LEN,
       CASE
         WHEN T1.BOT_SIZE = 'F' THEN '32'
         WHEN T1.BOT_SIZE = 'S' THEN '33'
         WHEN T1.BOT_SIZE = 'M' THEN '36'
         WHEN T1.BOT_SIZE = 'L' THEN '39'
         WHEN T1.BOT_SIZE = 'XL' THEN '42'
         END BOT_WAIS,
       CASE
         WHEN T1.BOT_SIZE = 'F' THEN '33.5'
         WHEN T1.BOT_SIZE = 'S' THEN '35'
         WHEN T1.BOT_SIZE = 'M' THEN '36.5'
         WHEN T1.BOT_SIZE = 'L' THEN '38'
         WHEN T1.BOT_SIZE = 'XL' THEN '39.5'
         END BOT_THIG,
       CASE
         WHEN T1.BOT_SIZE = 'F' THEN '26'
         WHEN T1.BOT_SIZE = 'S' THEN '27'
         WHEN T1.BOT_SIZE = 'M' THEN '28'
         WHEN T1.BOT_SIZE = 'L' THEN '29'
         WHEN T1.BOT_SIZE = 'XL' THEN '30'
         END BOT_LOWE,
       T1.GIV_END_YN,
       T1.FILE_NO,
       T1.NOTE
FROM PR3110 T1
WHERE T1.C_CD = :C_CD
  AND (:UNIF_CD IS NULL OR T1.UNIF_CD = :UNIF_CD)
  AND (:GENDER_TYPE IS NULL OR T1.GENDER_TYPE = :GENDER_TYPE)
  AND (:TOP_SIZE IS NULL OR T1.TOP_SIZE = :TOP_SIZE)
  AND (:BOT_SIZE IS NULL OR T1.BOT_SIZE = :BOT_SIZE)
;