-- **************************************************************************
-- PR3110 유니폼 관리
-- **************************************************************************
CREATE TABLE PR3110
(
  C_CD        VARCHAR2(20)                NOT NULL,
  UNIF_CD     VARCHAR2(20)                NOT NULL,
  UNIF_NM     VARCHAR2(20),
  UNIF_TYPE   VARCHAR2(50)                NOT NULL,
  GENDER_TYPE VARCHAR2(20),
  TOP_SIZE    VARCHAR2(20),
  TOP_LEN     VARCHAR2(20),
  TOP_SHOL    VARCHAR2(20),
  TOP_CHES    VARCHAR2(20),
  TOP_SLEE    VARCHAR2(20),
  BOT_SIZE    VARCHAR2(20),
  BOT_WAIS    VARCHAR2(20),
  BOT_THIG    VARCHAR2(20),
  BOT_LOWE    VARCHAR2(20),
  GIV_END_YN  VARCHAR2(2) DEFAULT 'N',
  FILE_NO     VARCHAR2(60),
  NOTE        VARCHAR2(500),
  INS_USER_ID VARCHAR2(20)                NULL,
  MOD_USER_ID VARCHAR2(20)                NULL,
  INS_GYMDHMS TIMESTAMP(6) WITH TIME ZONE NULL,
  INS_YMDHMS  TIMESTAMP(6)                NULL,
  MOD_YMDHMS  TIMESTAMP(6)                NULL,
  MOD_GYMDHMS TIMESTAMP(6) WITH TIME ZONE NULL,
  CONSTRAINT PK_I_PR3110
    PRIMARY KEY (C_CD, UNIF_CD, UNIF_TYPE),
  CONSTRAINT NI_SY9030_PR3110
    FOREIGN KEY (C_CD, FILE_NO) REFERENCES SY9030
);

CREATE UNIQUE INDEX PK_I_PR3110 ON PR3110
  (C_CD ASC, UNIF_CD ASC);


COMMENT ON TABLE PR3110 IS '(PR3110)유니폼관리';

COMMENT ON COLUMN PR3110.C_CD IS '회사코드';
COMMENT ON COLUMN PR3110.UNIF_CD IS '유니폼코드';
COMMENT ON COLUMN PR3110.UNIF_NM IS '유니폼명';
COMMENT ON COLUMN PR3110.UNIF_TYPE IS '파일유형';
COMMENT ON COLUMN PR3110.GENDER_TYPE IS '성별';
COMMENT ON COLUMN PR3110.UNIF_TYPE IS '유니폼종류';
COMMENT ON COLUMN PR3110.TOP_SIZE IS '상의_사이즈';
COMMENT ON COLUMN PR3110.TOP_LEN IS '상의_총장';
COMMENT ON COLUMN PR3110.TOP_SHOL IS '상의_어깨길이';
COMMENT ON COLUMN PR3110.TOP_CHES IS '상의_가슴단면';
COMMENT ON COLUMN PR3110.TOP_SLEE IS '상의_소매길이';
COMMENT ON COLUMN PR3110.BOT_SIZE IS '하의_사이즈';
COMMENT ON COLUMN PR3110.BOT_WAIS IS '하의_허리단면';
COMMENT ON COLUMN PR3110.BOT_THIG IS '하의_허벅지단면';
COMMENT ON COLUMN PR3110.BOT_LOWE IS '하의_밑위길이';
COMMENT ON COLUMN PR3110.GIV_END_YN IS '지급만료여부';
COMMENT ON COLUMN PR3110.FILE_NO IS '파일번호';
COMMENT ON COLUMN PR3110.NOTE IS '비고';
COMMENT ON COLUMN PR3110.INS_USER_ID IS '입력자ID';
COMMENT ON COLUMN PR3110.MOD_USER_ID IS '작업자ID';
COMMENT ON COLUMN PR3110.INS_GYMDHMS IS '입력일시_현지';
COMMENT ON COLUMN PR3110.INS_YMDHMS IS '입력일시';
COMMENT ON COLUMN PR3110.MOD_YMDHMS IS '수정일시';
COMMENT ON COLUMN PR3110.MOD_GYMDHMS IS '수정일시_현지';
-- **************************************************************************


DROP TABLE PR3110 CASCADE CONSTRAINTS PURGE;


SELECT T1.C_CD,
       T1.UNIF_CD,
       T1.UNIF_NM,
       T1.UNIF_TYPE,
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

WOMEN   신장      가슴둘레    허리둘레    엉덩이둘레
xs      149~156   74~80       57~63       82~88
S       154~160   77~83       60~66       85~91
M       154~160   80~86       63~69       88~94
L       159~166   86~92       69~75       94~100
XL      159~166   92~98       75~81       100~106
XXL     159~166   98~104      81~87       106~112
3XL     159~166   104~110     87~93       112~118


MEN