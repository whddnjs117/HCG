--1. 박대리(02096)과 동기(입사일자 같은 사원을 동기로 가정) 들의 명단을
-- 홍길동,유관순,강감찬 과 같인 ROW 1개로 , (콤마로 구분) 하여 성명을 나열하시오. (여러 방법이 있는데 어느것을 써도 무방 )


--2. 박대리의  현재 직급명(대리), 직책명(팀원)을   F_GET_GLOBAL_CDNM 를 참고하여
-- SUB QUERY, 함수를 사용하지 않고 JOIN 을 사용하여 조회
-- [직급 : EMP_GRADE_CD,  IDX_CD : '/SY03' ] ,  [직책 : DUTY_CD, IDX_CD = '/SY05' ]
-- [LANG_TYPE : 'ko' ]
-- 사용테이블 PA1020, SY5020, SY9820
-- 사번/성명/직급명/직책명


-- 3. 만6세 (생년월일로 체크) 인 자녀에 대하여  유지원 지원금(50000) 을 지원합니다.
-- 자녀는 최대 2명까지, 대상자(재직,퇴직)를 추출하십시오.
-- PA2030 (자녀테이블), FAM_CD (가족관계코드), FAM_CD -> 20 : 자 , 21 : 녀
-- 사번/성명/금액합계

----------------------------------------------------------------------


--1-----------------------------------------------------------------
SELECT WM_CONCAT(T1.EMP_NM) AS EMP_NM1  -- 오라클10~ 12C
      ,LISTAGG(T1.EMP_NM, ',') WITHIN GROUP(ORDER BY T1.EMP_NM) AS EMP_NM2 --오라클 11.2
      ,LTRIM(SUBSTR(XMLAGG(XMLELEMENT(X,',' || T1.EMP_NM) ORDER BY T1.EMP_NM).EXTRACT('//text()').GETSTRINGVAL(), 2)) AS EMP_NM3
      ,T1.ENTER_YMD
  FROM PA1010 T1
 WHERE T1.ENTER_YMD = (SELECT ENTER_YMD FROM PA1010 WHERE EMP_ID = '02096')
 GROUP BY T1.ENTER_YMD
;


--2-----------------------------------------------------------------
SELECT T1.EMP_ID
      ,T3.CD_NM AS EMP_GRADE_NM
      ,T5.CD_NM AS DUTY_NM
  FROM PA1020 T1
      ,SY5020 T2
      ,SY9820 T3
      ,SY5020 T4
      ,SY9820 T5
 WHERE T1.C_CD = '10'
   AND T1.EMP_ID = '02096'
   AND TO_CHAR(SYSDATE,'YYYYMMDD') BETWEEN T1.STA_YMD AND T1.END_YMD
   AND T1.LAST_YN = 'Y'
   AND T2.C_CD = T1.C_CD
   AND T2.IDX_CD = '/SY03'
   AND T2.CD = T1.EMP_GRADE_CD
   AND T3.C_CD(+) = T2.C_CD
   AND T3.IDX_CD(+) = T2.IDX_CD
   AND T3.CD(+) = T2.CD
   AND T3.LANG_TYPE(+) = 'ko'
   AND T4.C_CD = T1.C_CD
   AND T4.IDX_CD = '/SY05'
   AND T4.CD = T1.DUTY_CD
   AND T5.C_CD(+) = T4.C_CD
   AND T5.IDX_CD(+) = T4.IDX_CD
   AND T5.CD(+) = T4.CD
   AND T5.LANG_TYPE(+) = 'ko'
;


--2 EX 1------------------------------------------------------------
-- 순수 조인 버전
SELECT T1.EMP_ID
     , T4.CD_NM "직급"
     , T6.CD_NM "직책"
  FROM PA1010 T1
     , PA1020 T2 -- 직책(DUTY_CD), 직급(EMP_GRADE_CD)
     , SY5020 T3 -- 직급코드 가져올 테이블
     , SY9820 T4 -- 직급코드의 다국어 명칭을 가져올 테이블
     , SY5020 T5 -- 직급코드 가져올 테이블
     , SY9820 T6 -- 직급코드의 다국어 명칭을 가져올 테이블
 WHERE T1.C_CD = :C_CD
   AND T1.EMP_ID = :EMP_ID
   AND T2.C_CD = T1.C_CD
   AND T2.EMP_ID = T1.EMP_ID
   AND T2.LAST_YN = 'Y'
   AND TO_CHAR(SYSDATE, 'YYYYMMDD') BETWEEN T2.STA_YMD AND T2.END_YMD
   
   -- 직급코드와 직급코드의 다국어명칭 가져오기
   AND T3.C_CD = T2.C_CD
   AND T3.IDX_CD= '/SY03'
   AND T3.CD = T2.EMP_GRADE_CD
   AND T4.C_CD = T3.C_CD
   AND T4.IDX_CD = T3.IDX_CD
   AND T4.CD = T3.CD
   AND T4.LANG_TYPE = :LANG_TYPE
   
   -- 직책코드와 직책코드의 다국어명칭 가져오기
   AND T5.C_CD = T2.C_CD
   AND T5.IDX_CD= '/SY05'
   AND T5.CD = T2.DUTY_CD
   AND T6.C_CD = T5.C_CD
   AND T6.IDX_CD = T5.IDX_CD
   AND T6.CD = T5.CD
   AND T6.LANG_TYPE = :LANG_TYPE
;


--2 EX 2------------------------------------------------------------
-- SY5020_LANG 뷰 적용 버전
SELECT T1.EMP_ID
     , T3.CD_NM "직급"
     , T4.CD_NM "직책"
  FROM PA1010 T1
     , PA1020 T2 -- 직책(DUTY_CD), 직급(EMP_GRADE_CD)
     , SY5020_LANG T3 -- 직급 다국어 코드
     , SY5020_LANG T4
 WHERE T1.C_CD = :C_CD
   AND T1.EMP_ID = :EMP_ID
   AND T2.C_CD = T1.C_CD
   AND T2.EMP_ID = T1.EMP_ID
   AND T2.LAST_YN = 'Y'
   AND TO_CHAR(SYSDATE, 'YYYYMMDD') BETWEEN T2.STA_YMD AND T2.END_YMD
   
   -- 직급코드와 직급코드의 다국어명칭 가져오기
   AND T3.C_CD = T2.C_CD
   AND T3.IDX_CD = '/SY03'
   AND T3.CD = T2.EMP_GRADE_CD
   AND T3.LANG_TYPE = :LANG_TYPE

   -- 직책코드와 직책코드의 다국어명칭 가져오기
   AND T4.C_CD = T2.C_CD
   AND T4.IDX_CD = '/SY05'
   AND T4.CD = T2.DUTY_CD
   AND T4.LANG_TYPE = :LANG_TYPE
;


--3-----------------------------------------------------------------
 SELECT T1.EMP_ID
       ,T1.EMP_NM
       ,LEAST(SUM(50000),100000) AS MON
   FROM PA1010 T1
       ,PA1020 T2
       ,PA2030 T3
  WHERE T1.C_CD = '10'
    AND T2.C_CD = T1.C_CD
    AND T2.EMP_ID = T1.EMP_ID
    AND TO_CHAR(SYSDATE,'YYYYMMDD') BETWEEN T2.STA_YMD AND T2.END_YMD
    AND T2.LAST_YN = 'Y'
    AND T2.STAT_CD LIKE '1%'
    AND T3.C_CD = T2.C_CD
    AND T3.EMP_ID = T2.EMP_ID
    AND T3.FAM_CD IN ('20','21')
    AND T3.BIRTH_YMD IS NOT NULL
    AND FLOOR(MONTHS_BETWEEN(SYSDATE, TO_DATE(T3.BIRTH_YMD, 'YYYYMMDD')) / 12) = 6
  GROUP BY T1.EMP_ID
          ,T1.EMP_NM
;
