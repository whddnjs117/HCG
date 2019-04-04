-- PR3010 유니폼 지급 회차 관리
-- PR3100 유니폼 대상자 관리
-- PR3110 유니폼 상세
-- PR3210 유니폼 관리

-- **************************************************************************
-- 유니폼지급회차관리
-- **************************************************************************
CREATE TABLE PR3010
(
  C_CD        VARCHAR2(20) NOT NULL,
  GIV_STD_ID  VARCHAR2(60) NOT NULL,
  GIV_STD_NM  VARCHAR2(300),
  GIV_YY      VARCHAR2(4),
  GIV_TYPE    VARCHAR2(20),
  GIV_TIME_CD VARCHAR2(20),
  STA_YMD     VARCHAR2(8),
  END_YMD     VARCHAR2(8),
  GIV_PGR_YN  VARCHAR2(1) DEFAULT 'Y'
    CONSTRAINT PR_000000001
      CHECK (GIV_PGR_YN IN ('Y', 'N')),
  NOTI_SBJ    CLOB,
  NOTE        VARCHAR2(1000),
  INS_USER_ID VARCHAR2(20),
  INS_YMDHMS  TIMESTAMP(6),
  MOD_USER_ID VARCHAR2(20),
  MOD_YMDHMS  TIMESTAMP(6),
  INS_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
  MOD_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
  CONSTRAINT PK_I_PR3010
    PRIMARY KEY (C_CD, GIV_STD_ID)
);

COMMENT ON TABLE PR3010 IS '(PR3010)유니폼지급회차관리';

COMMENT ON COLUMN PR3010.C_CD IS '회사코드';
COMMENT ON COLUMN PR3010.GIV_STD_ID IS '지급회차ID';
COMMENT ON COLUMN PR3010.GIV_STD_NM IS '지급회차명';
COMMENT ON COLUMN PR3010.GIV_YY IS '지급년도';
COMMENT ON COLUMN PR3010.GIV_TYPE IS '지급유형코드';
COMMENT ON COLUMN PR3010.GIV_TIME_CD IS '지급회차코드';
COMMENT ON COLUMN PR3010.STA_YMD IS '시작일';
COMMENT ON COLUMN PR3010.END_YMD IS '종료일';
COMMENT ON COLUMN PR3010.GIV_PGR_YN IS '신청허가여부';
COMMENT ON COLUMN PR3010.NOTI_SBJ IS '공지사항';
COMMENT ON COLUMN PR3010.NOTE IS '비고';
COMMENT ON COLUMN PR3010.INS_USER_ID IS '입력자ID';
COMMENT ON COLUMN PR3010.INS_YMDHMS IS '입력일시';
COMMENT ON COLUMN PR3010.MOD_USER_ID IS '작업자ID';
COMMENT ON COLUMN PR3010.MOD_YMDHMS IS '수정일시';
COMMENT ON COLUMN PR3010.INS_GYMDHMS IS '입력일시_현지';
COMMENT ON COLUMN PR3010.MOD_GYMDHMS IS '수정일시_현지';
-- **************************************************************************

-- **************************************************************************
-- PR3110 유니폼 관리
-- **************************************************************************
CREATE TABLE PR3110
(
  C_CD        VARCHAR2(20)                NOT NULL,
  GIV_STD_ID  VARCHAR2(60),
  UNIF_CD     VARCHAR2(20)                NOT NULL,
  UNIF_NM     VARCHAR2(20),
  UNIF_BRAND  VARCHAR2(50)                NOT NULL,
  UNIF_TYPE   VARCHAR2(50)                NOT NULL,
  UNIF_CNT    NUMBER,
  GENDER_TYPE VARCHAR2(20),
  UNIF_SIZE   VARCHAR2(20),
  FILE_NO     VARCHAR2(60),
  FILE_TYPE   VARCHAR2(20),
  NOTE        VARCHAR2(500),
  INS_USER_ID VARCHAR2(20)                NULL,
  MOD_USER_ID VARCHAR2(20)                NULL,
  INS_GYMDHMS TIMESTAMP(6) WITH TIME ZONE NULL,
  INS_YMDHMS  TIMESTAMP(6)                NULL,
  MOD_YMDHMS  TIMESTAMP(6)                NULL,
  MOD_GYMDHMS TIMESTAMP(6) WITH TIME ZONE NULL,
  CONSTRAINT PK_I_PR3110
    PRIMARY KEY (C_CD, UNIF_CD),
  CONSTRAINT NI_SY9030_PR3110
    FOREIGN KEY (C_CD, FILE_NO) REFERENCES SY9030 ON DELETE CASCADE,
  CONSTRAINT NI_PR3010_PR3110
    FOREIGN KEY (C_CD, GIV_STD_ID) REFERENCES PR3010 ON DELETE CASCADE
);

COMMENT ON TABLE PR3110 IS '(PR3110)유니폼관리';

COMMENT ON COLUMN PR3110.C_CD IS '회사코드';
COMMENT ON COLUMN PR3110.GIV_STD_ID IS '지급회차ID';
COMMENT ON COLUMN PR3110.UNIF_CD IS '유니폼코드';
COMMENT ON COLUMN PR3110.UNIF_NM IS '유니폼명';
COMMENT ON COLUMN PR3110.UNIF_BRAND IS '유니폼브랜드';
COMMENT ON COLUMN PR3110.GENDER_TYPE IS '성별';
COMMENT ON COLUMN PR3110.UNIF_TYPE IS '유니폼종류';
COMMENT ON COLUMN PR3110.UNIF_CNT IS '유니폼수량';
COMMENT ON COLUMN PR3110.UNIF_SIZE IS '유니폼사이즈';
COMMENT ON COLUMN PR3110.FILE_TYPE IS '파일유형';
COMMENT ON COLUMN PR3110.FILE_NO IS '파일번호';
COMMENT ON COLUMN PR3110.NOTE IS '비고';
COMMENT ON COLUMN PR3110.INS_USER_ID IS '입력자ID';
COMMENT ON COLUMN PR3110.MOD_USER_ID IS '작업자ID';
COMMENT ON COLUMN PR3110.INS_GYMDHMS IS '입력일시_현지';
COMMENT ON COLUMN PR3110.INS_YMDHMS IS '입력일시';
COMMENT ON COLUMN PR3110.MOD_YMDHMS IS '수정일시';
COMMENT ON COLUMN PR3110.MOD_GYMDHMS IS '수정일시_현지';
-- **************************************************************************

-- **************************************************************************
-- PR3110 유니폼 지급 대상자 관리
-- **************************************************************************
CREATE TABLE PR3210
(
  C_CD         VARCHAR2(60) NOT NULL,
  GIV_STD_ID   VARCHAR2(60) NOT NULL,
  EMP_ID       VARCHAR2(60),
  EMP_NM       VARCHAR2(60),
  GENDER_TYPE  VARCHAR2(60),
  ORG_ID       VARCHAR2(60),
  ORG_NM       VARCHAR2(60),
  EMP_GRADE_CD VARCHAR2(60),
  APPL_ID      VARCHAR2(60),
  CONSTRAINT PK_I_PR3210
    PRIMARY KEY (C_CD, GIV_STD_ID),
  CONSTRAINT NI_PR3010_PR3210
    FOREIGN KEY (C_CD, GIV_STD_ID) REFERENCES PR3010 ON DELETE CASCADE,
  CONSTRAINT NI_SY7010_PR3210
    FOREIGN KEY (APPL_ID) REFERENCES SY7010 ON DELETE CASCADE
);

COMMENT ON TABLE PR3210 IS '(PR3110)유니폼지급대상자관리';

COMMENT ON COLUMN PR3210.C_CD IS '회사코드';
COMMENT ON COLUMN PR3210.GIV_STD_ID IS '지급회차ID';
COMMENT ON COLUMN PR3210.EMP_ID IS '사번';
COMMENT ON COLUMN PR3210.EMP_NM IS '사원이름';
COMMENT ON COLUMN PR3210.GENDER_TYPE IS '성별';
COMMENT ON COLUMN PR3210.ORG_ID IS '조직코드';
COMMENT ON COLUMN PR3210.ORG_NM IS '조직명';
COMMENT ON COLUMN PR3210.EMP_GRADE_CD IS '직급코드';
COMMENT ON COLUMN PR3210.APPL_ID IS '신청서번호';
-- **************************************************************************

-- **************************************************************************
-- PR3210_TMP 유니폼 지급 대상자 임시테이블
-- **************************************************************************
CREATE GLOBAL TEMPORARY TABLE PR3210_TMP
(
  C_CD         VARCHAR2(60) NOT NULL,
  EMP_ID       VARCHAR2(60) NOT NULL,
  GIV_STD_ID   VARCHAR2(60) NOT NULL,
  ORG_ID       VARCHAR2(60),
  EMP_GRADE_CD VARCHAR2(60)
)
  ON COMMIT DELETE ROWS;

ALTER TABLE PR3210_TMP
  ADD CONSTRAINT PK_I_PR3210_TMP PRIMARY KEY (C_CD, EMP_ID, GIV_STD_ID);

COMMENT ON TABLE PR3210_TMP IS '유니폼지급대상자임시테이블';

COMMENT ON COLUMN PR3210_TMP.C_CD IS '회사코드';
COMMENT ON COLUMN PR3210_TMP.EMP_ID IS '사번';
COMMENT ON COLUMN PR3210_TMP.GIV_STD_ID IS '지급회차ID';
COMMENT ON COLUMN PR3210_TMP.ORG_ID IS '조직코드';
COMMENT ON COLUMN PR3210_TMP.EMP_GRADE_CD IS '직급코드';


CREATE TABLE PR3210_TMP2
(
  C_CD         VARCHAR2(60) NOT NULL,
  EMP_ID       VARCHAR2(60) NOT NULL,
  EMP_GRADE_CD VARCHAR2(60)
);

ALTER TABLE PR3210_TMP2
  ADD CONSTRAINT PK_I_PR3210_TMP2 PRIMARY KEY (C_CD, EMP_ID);

COMMENT ON TABLE PR3210_TMP2 IS '유니폼지급대상자임시테이블';

COMMENT ON COLUMN PR3210_TMP2.C_CD IS '회사코드';
COMMENT ON COLUMN PR3210_TMP2.EMP_ID IS '사번';
COMMENT ON COLUMN PR3210_TMP2.GIV_STD_ID IS '지급회차ID';
COMMENT ON COLUMN PR3210_TMP2.ORG_ID IS '조직코드';
COMMENT ON COLUMN PR3210_TMP2.EMP_GRADE_CD IS '직급코드';
-- **************************************************************************
-----------------------------------------------------------------------------
DROP TABLE PR3210_TMP CASCADE CONSTRAINTS PURGE;
-----------------------------------------------------------------------------
SELECT *
FROM PR3210_TMP;
-----------------------------------------------------------------------------

-- **************************************************************************
-- 프로시저
-- **************************************************************************

CREATE PROCEDURE P_PR_UNIF_TARG_CHEK(I_C_CD IN VARCHAR2 := NULL,
                                     I_EMP_ID IN VARCHAR2 := NULL,
                                     I_GIV_STD_ID IN VARCHAR2 := NULL,
                                     I_ORG_ID IN VARCHAR2 := NULL,
                                     I_EMP_GRADE_CD IN VARCHAR2 := NULL)
IS
  /***********************************************************************
   PROGRAM NAME   : P_PR_UNIF_TARG_CHEK
   DESCRIPTION    : 유니폼 지급 대상자 등록
   AUTHOR         : 소인성
   HISTORY        : 2019.04.03 신규개발
  ***********************************************************************/

BEGIN

  INSERT INTO PR3210_TMP
  (C_CD,
   EMP_ID,
   GIV_STD_ID,
   ORG_ID,
   EMP_GRADE_CD,
   APPL_ID)
  SELECT T1.C_CD,
         T1.EMP_ID,
         T4.GIV_STD_ID,
         T2.ORG_ID,
         T2.EMP_GRADE_CD,
         T3.APPL_ID
  FROM PA1010 T1,
       PA1020 T2,
       SY7010 T3,
       PR3010 T4
  WHERE T1.C_CD = I_C_CD
    AND T1.EMP_ID = I_EMP_ID
    AND T4.GIV_STD_ID = I_GIV_STD_ID
    AND T2.ORG_ID = I_ORG_ID
    AND T2.EMP_GRADE_CD = I_EMP_GRADE_CD
    AND T3.APPL_ID = I_APPL_ID;

END;
-- **************************************************************************
CALL P_PR_UNIF_TARG_CHEK();
-----------------------------------------------------------------------------
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

SELECT *
FROM PR3110;
-----------------------------------------------------------------------------
SELECT TABLE_NAME, COLUMN_NAME
FROM ALL_TAB_COLUMNS
WHERE COLUMN_NAME LIKE '%STD%';
-----------------------------------------------------------------------------
SELECT TABLE_NAME, COLUMN_NAME
FROM ALL_COL_COMMENTS
WHERE COMMENTS LIKE '%신청일%';
-----------------------------------------------------------------------------
DROP TABLE PR3010 CASCADE CONSTRAINTS PURGE;
-----------------------------------------------------------------------------
DROP TABLE PR3110 CASCADE CONSTRAINTS PURGE;
-----------------------------------------------------------------------------
DROP TABLE PR3210 CASCADE CONSTRAINTS PURGE;
-----------------------------------------------------------------------------
SELECT *
FROM PR3010;
-----------------------------------------------------------------------------
SELECT *
FROM PR3110;
-----------------------------------------------------------------------------
SELECT *
FROM PA2265;
-----------------------------------------------------------------------------
DROP PROCEDURE P_PR_UNIF_TARG_CHEK;
-----------------------------------------------------------------------------
DROP TABLE PR3100 CASCADE CONSTRAINTS PURGE;
-----------------------------------------------------------------------------
SELECT *
FROM PA1020
WHERE C_CD = '10'
  AND EMP_ID = '02096'
  AND STAT_CD LIKE '1%'
  AND LAST_YN = 'Y'
  AND TO_CHAR(SYSDATE, 'YYYYMMDD') BETWEEN STA_YMD AND END_YMD;
-----------------------------------------------------------------------------
SELECT *
FROM PR3100;
-----------------------------------------------------------------------------
CALL P_PR_UNIF_TARG_CHEK('10', '02096', '90010', '6010', '20190403-2PT');
-----------------------------------------------------------------------------
SELECT EMP_NM,
       ORG_NM,
       (SELECT GENDER_TYPE
        FROM PA1020
        WHERE C_CD = '10'
          AND EMP_ID = '02096'
          AND ORG_ID = '90010'
          AND LAST_YN = 'Y'
          AND TO_CHAR(SYSDATE, 'YYYYMMDD') BETWEEN STA_YMD AND END_YMD
       ) GENDER_TYPE
FROM PA1010 T1,
     PA1020 T2
WHERE T1.C_CD = '10'
  AND T2.C_CD = T1.C_CD
  AND T1.EMP_ID = '02096'
  AND T2.EMP_ID = T1.EMP_ID
  AND T2.ORG_ID = '90010'
  AND T2.EMP_GRADE_CD = '6010'
  AND T1.STAT_CD LIKE '1%'
  AND T2.LAST_YN = 'Y'
  AND TO_CHAR(SYSDATE, 'YYYYMMDD') BETWEEN T2.STA_YMD AND T2.END_YMD;
-----------------------------------------------------------------------------
DROP PROCEDURE TEMP_TBL;
-----------------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE TEMP_TBL
IS
BEGIN
--   INSERT INTO PR3210_TMP
--     (C_CD, EMP_ID, GIV_STD_ID, ORG_ID, EMP_GRADE_CD)
END;
-----------------------------------------------------------------------------
CALL TEMP_TBL();
-----------------------------------------------------------------------------
INSERT INTO PR3210_TMP (C_CD, EMP_ID, GIV_STD_ID, ORG_ID, EMP_GRADE_CD) VALUES ('10', '02096', '201090404-TjY', '90010', '6010');

SELECT * FROM PR3210_TMP;

SELECT T2.C_CD, T2.EMP_ID, T4.GIV_STD_ID, T3.ORG_ID, T3.EMP_GRADE_CD
FROM PR3210_TMP T1, PA1010 T2, PA1020 T3, PR3010 T4
WHERE ;


SELECT ORG_ID, EMP_GRADE_CD
FROM PA1020
WHERE C_CD = '10'
AND EMP_ID = '02096'
AND LAST_YN = 'Y'
AND TO_CHAR(SYSDATE, 'YYYYMMDD') BETWEEN STA_YMD AND END_YMD
;