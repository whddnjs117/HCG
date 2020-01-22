DROP TABLE RPT0010 CASCADE CONSTRAINTS PURGE;
CREATE TABLE RPT0010
(
    C_CD           VARCHAR2 (20) NOT NULL,
    APPL_ID        VARCHAR2 (60) NOT NULL,
    EMP_ID         VARCHAR2 (60) NOT NULL,
    RPT_STD_CD     VARCHAR2 (60) NOT NULL,
    RPT_YMD        VARCHAR2 (8),
    RPT_CNT        NUMBER DEFAULT 1 NOT NULL,
    RPT_BRAND      VARCHAR2 (60) NOT NULL,
    RPT_SIZE       VARCHAR2 (60) NOT NULL,
    APPL_YMD       VARCHAR2 (8) NULL,
    NOTE           VARCHAR2 (1500),
    INS_USER_ID    VARCHAR2 (20),
    INS_YMDHMS     TIMESTAMP (6),
    MOD_USER_ID    VARCHAR2 (20),
    MOD_YMDHMS     TIMESTAMP (6),
    INS_GYMDHMS    TIMESTAMP (6) WITH TIME ZONE,
    MOD_GYMDHMS    TIMESTAMP (6) WITH TIME ZONE,
    CONSTRAINT PK_I_RPT0010 PRIMARY KEY (C_CD, APPL_ID, RPT_STD_CD),
    CONSTRAINT NI_SY7010_RPT0010 FOREIGN KEY (C_CD, APPL_ID)
        REFERENCES SY7010 ON DELETE CASCADE,
    CONSTRAINT NI_PA1010_RPT0010 FOREIGN KEY (C_CD, EMP_ID)
        REFERENCES PA1010 ON DELETE CASCADE
);

COMMENT ON TABLE RPT0010 IS '(RPT0010)유니폼신청';

COMMENT ON COLUMN RPT0010.C_CD IS '회사코드';
COMMENT ON COLUMN RPT0010.APPL_ID IS '신청서ID';
COMMENT ON COLUMN RPT0010.EMP_ID IS '사번';
COMMENT ON COLUMN RPT0010.RPT_STD_CD IS '지급회차코드';
COMMENT ON COLUMN RPT0010.RPT_YMD IS '수령일';
COMMENT ON COLUMN RPT0010.RPT_CNT IS '유니폼수량';
COMMENT ON COLUMN RPT0010.RPT_BRAND IS '유니폼브랜드';
COMMENT ON COLUMN RPT0010.RPT_SIZE IS '유니폼사이즈';
COMMENT ON COLUMN RPT0010.APPL_YMD IS '신청일';
COMMENT ON COLUMN RPT0010.NOTE IS '비고';
COMMENT ON COLUMN RPT0010.INS_USER_ID IS '입력자ID';
COMMENT ON COLUMN RPT0010.INS_YMDHMS IS '입력일시';
COMMENT ON COLUMN RPT0010.MOD_USER_ID IS '작업자ID';
COMMENT ON COLUMN RPT0010.MOD_YMDHMS IS '수정일시';
COMMENT ON COLUMN RPT0010.INS_GYMDHMS IS '입력일시_현지';
COMMENT ON COLUMN RPT0010.MOD_GYMDHMS IS '수정일시_현지';

--

DROP TABLE RPT0020 CASCADE CONSTRAINTS PURGE;
CREATE TABLE RPT0020
(
    C_CD           VARCHAR2 (20) NOT NULL,
    DATA_ID        VARCHAR2 (60) NOT NULL,
    APPL_ID        VARCHAR2 (60) NULL,
    EMP_ID         VARCHAR2 (20) NULL,
    RPT_YMD        VARCHAR2 (8) NULL,
    RPT_CNT        NUMBER DEFAULT 1 NOT NULL,
    RPT_BRAND      VARCHAR2 (60) NOT NULL,
    RPT_SIZE       VARCHAR2 (60) NOT NULL,
    RPT_YN         VARCHAR2 (20) NULL,
    RPT_STD_CD     VARCHAR2 (60) NULL,
    IN_TYPE        VARCHAR2 (20) NULL,
    APPL_YMD       VARCHAR2 (8) NULL,
    NOTE           VARCHAR2 (4000) NULL,
    INS_USER_ID    VARCHAR2 (20) NULL,
    INS_YMDHMS     TIMESTAMP (6) NULL,
    MOD_USER_ID    VARCHAR2 (20) NULL,
    MOD_YMDHMS     TIMESTAMP (6) NULL,
    INS_GYMDHMS    TIMESTAMP (6) NULL,
    MOD_GYMDHMS    TIMESTAMP (6) NULL,
    CONSTRAINT RPT0020_PK PRIMARY KEY (C_CD, DATA_ID),
    CONSTRAINT NI_SY7010_RPT0020 FOREIGN KEY (C_CD, APPL_ID)
        REFERENCES SY7010 ON DELETE CASCADE
);

COMMENT ON TABLE RPT0020 IS '(RPT0020)유니폼신청관리';

COMMENT ON TABLE RPT0020 IS '(RPT0020)유니폼신청관리';
COMMENT ON COLUMN RPT0020.C_CD IS '회사코드';
COMMENT ON COLUMN RPT0020.DATA_ID IS '자료ID';
COMMENT ON COLUMN RPT0020.APPL_ID IS '신청서ID';
COMMENT ON COLUMN RPT0020.EMP_ID IS '사번';
COMMENT ON COLUMN RPT0020.RPT_YMD IS '수령일';
COMMENT ON COLUMN RPT0020.RPT_CNT IS '유니폼수량';
COMMENT ON COLUMN RPT0020.RPT_BRAND IS '유니폼브랜드';
COMMENT ON COLUMN RPT0020.RPT_SIZE IS '유니폼사이즈';
COMMENT ON COLUMN RPT0020.RPT_YN IS '수령여부';
COMMENT ON COLUMN RPT0020.RPT_STD_CD IS '지급회차코드';
COMMENT ON COLUMN RPT0020.IN_TYPE IS '입력유형';
COMMENT ON COLUMN RPT0020.APPL_YMD IS '신청일';
COMMENT ON COLUMN RPT0020.NOTE IS '비고';
COMMENT ON COLUMN RPT0020.INS_USER_ID IS '입력자ID';
COMMENT ON COLUMN RPT0020.INS_YMDHMS IS '입력일시';
COMMENT ON COLUMN RPT0020.MOD_USER_ID IS '작업자ID';
COMMENT ON COLUMN RPT0020.MOD_YMDHMS IS '수정일시';
COMMENT ON COLUMN RPT0020.INS_GYMDHMS IS '입력일시_현지';
COMMENT ON COLUMN RPT0020.MOD_GYMDHMS IS '수정일시_현지';