SELECT *
FROM ALL_COL_COMMENTS
WHERE TABLE_NAME = 'PR3510';
SELECT *
FROM PR3510;
------------------------------------------------------------------------------------------------------------------------
DROP TABLE PR3010 CASCADE CONSTRAINTS PURGE;
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
    GIV_PGR_YN  VARCHAR2(1) DEFAULT 'N'
        CONSTRAINT PR_000000001
            CHECK (GIV_PGR_YN IN ('Y', 'N')),
    GIV_END     VARCHAR2(20),
    NOTE        VARCHAR2(500),
    INS_USER_ID VARCHAR2(20),
    INS_YMDHMS  TIMESTAMP(6),
    MOD_USER_ID VARCHAR2(20),
    MOD_YMDHMS  TIMESTAMP(6),
    INS_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
    MOD_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
    CONSTRAINT PK_I_PR3010
        PRIMARY KEY (C_CD, GIV_STD_ID)
);
------------------------------------------------------------------------------------------------------------------------
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
COMMENT ON COLUMN PR3010.GIV_END IS '지급종료여부';
COMMENT ON COLUMN PR3010.NOTE IS '비고';
COMMENT ON COLUMN PR3010.INS_USER_ID IS '입력자ID';
COMMENT ON COLUMN PR3010.INS_YMDHMS IS '입력일시';
COMMENT ON COLUMN PR3010.MOD_USER_ID IS '작업자ID';
COMMENT ON COLUMN PR3010.MOD_YMDHMS IS '수정일시';
COMMENT ON COLUMN PR3010.INS_GYMDHMS IS '입력일시_현지';
COMMENT ON COLUMN PR3010.MOD_GYMDHMS IS '수정일시_현지';
------------------------------------------------------------------------------------------------------------------------
DROP TABLE PR3110 CASCADE CONSTRAINTS PURGE;
CREATE TABLE PR3110
(
    C_CD        VARCHAR2(20)                NOT NULL,
    GIV_STD_ID  VARCHAR2(20)                NOT NULL,
    UNIF_CD     VARCHAR2(20)                NOT NULL,
    UNIF_NM     VARCHAR2(60)                NOT NULL,
    UNIF_BRAND  VARCHAR2(60)                NOT NULL,
    UNIF_TYPE   VARCHAR2(20)                NOT NULL,
    UNIF_CNT    NUMBER                      NOT NULL,
    GENDER_TYPE VARCHAR2(20)                NOT NULL,
    UNIF_SIZE   VARCHAR2(20)                NOT NULL,
    FILE_TYPE   VARCHAR2(20),
    NOTE        VARCHAR2(500),
    INS_USER_ID VARCHAR2(20)                NULL,
    MOD_USER_ID VARCHAR2(20)                NULL,
    INS_GYMDHMS TIMESTAMP(6) WITH TIME ZONE NULL,
    INS_YMDHMS  TIMESTAMP(6)                NULL,
    MOD_YMDHMS  TIMESTAMP(6)                NULL,
    MOD_GYMDHMS TIMESTAMP(6) WITH TIME ZONE NULL,
    CONSTRAINT PK_I_PR3110
        PRIMARY KEY (C_CD, GIV_STD_ID, UNIF_CD, UNIF_BRAND, UNIF_TYPE, UNIF_SIZE, GENDER_TYPE),
    CONSTRAINT NI_PR3010_PR3110
        FOREIGN KEY (C_CD, GIV_STD_ID) REFERENCES PR3010 ON DELETE CASCADE,
    CONSTRAINT NI_PR3510_PR3110
        FOREIGN KEY (C_CD, UNIF_CD, FILE_TYPE) REFERENCES PR3510 ON DELETE CASCADE
);
------------------------------------------------------------------------------------------------------------------------
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
COMMENT ON COLUMN PR3110.FILE_TYPE IS '유니폼사진유형';
COMMENT ON COLUMN PR3110.NOTE IS '비고';
COMMENT ON COLUMN PR3110.INS_USER_ID IS '입력자ID';
COMMENT ON COLUMN PR3110.MOD_USER_ID IS '작업자ID';
COMMENT ON COLUMN PR3110.INS_GYMDHMS IS '입력일시_현지';
COMMENT ON COLUMN PR3110.INS_YMDHMS IS '입력일시';
COMMENT ON COLUMN PR3110.MOD_YMDHMS IS '수정일시';
COMMENT ON COLUMN PR3110.MOD_GYMDHMS IS '수정일시_현지';
------------------------------------------------------------------------------------------------------------------------
DROP TABLE PR3510 CASCADE CONSTRAINTS PURGE;
CREATE TABLE PR3510
(
    C_CD        VARCHAR2(20)                NOT NULL,
    UNIF_CD     VARCHAR2(20)                NOT NULL,
    FILE_NO     VARCHAR2(60)                NOT NULL,
    FILE_TYPE   VARCHAR2(20)                NOT NULL,
    INS_USER_ID VARCHAR2(20)                NULL,
    MOD_USER_ID VARCHAR2(20)                NULL,
    INS_GYMDHMS TIMESTAMP(6) WITH TIME ZONE NULL,
    INS_YMDHMS  TIMESTAMP(6)                NULL,
    MOD_YMDHMS  TIMESTAMP(6)                NULL,
    MOD_GYMDHMS TIMESTAMP(6) WITH TIME ZONE NULL,
    CONSTRAINT PK_I_PR3510
        PRIMARY KEY (C_CD, UNIF_CD, FILE_TYPE),
    CONSTRAINT NI_SY9030_PR3510
        FOREIGN KEY (C_CD, FILE_NO) REFERENCES SY9030 ON DELETE CASCADE
);
------------------------------------------------------------------------------------------------------------------------
COMMENT ON TABLE PR3510 IS '(PR3510)유니폼파일관리';

COMMENT ON COLUMN PR3510.C_CD IS '회사코드';
COMMENT ON COLUMN PR3510.FILE_NO IS '파일번호';
COMMENT ON COLUMN PR3510.FILE_TYPE IS '파일유형';
COMMENT ON COLUMN PR3510.UNIF_CD IS '유니폼코드';
COMMENT ON COLUMN PR3510.INS_USER_ID IS '입력자ID';
COMMENT ON COLUMN PR3510.MOD_USER_ID IS '작업자ID';
COMMENT ON COLUMN PR3510.INS_GYMDHMS IS '입력일시_현지';
COMMENT ON COLUMN PR3510.INS_YMDHMS IS '입력일시';
COMMENT ON COLUMN PR3510.MOD_YMDHMS IS '수정일시';
COMMENT ON COLUMN PR3510.MOD_GYMDHMS IS '수정일시_현지';
------------------------------------------------------------------------------------------------------------------------
DROP TABLE PR3210 CASCADE CONSTRAINTS PURGE;
CREATE TABLE PR3210
(
    C_CD         VARCHAR2(20)                NOT NULL,
    GIV_STD_ID   VARCHAR2(60)                NOT NULL,
    EMP_ID       VARCHAR2(60)                NOT NULL,
    ORG_ID       VARCHAR2(60)                NULL,
    EMP_GRADE_CD VARCHAR2(60)                NULL,
    INS_USER_ID  VARCHAR2(20)                NULL,
    MOD_USER_ID  VARCHAR2(20)                NULL,
    INS_GYMDHMS  TIMESTAMP(6) WITH TIME ZONE NULL,
    INS_YMDHMS   TIMESTAMP(6)                NULL,
    MOD_YMDHMS   TIMESTAMP(6)                NULL,
    MOD_GYMDHMS  TIMESTAMP(6) WITH TIME ZONE NULL,
    CONSTRAINT PK_I_PR3210
        PRIMARY KEY (C_CD, GIV_STD_ID, EMP_ID),
    CONSTRAINT NI_PR3010_PR3210
        FOREIGN KEY (C_CD, GIV_STD_ID) REFERENCES PR3010 ON DELETE CASCADE,
    CONSTRAINT NI_PA1010_PR3210
        FOREIGN KEY (C_CD, EMP_ID) REFERENCES PA1010 ON DELETE CASCADE
);
------------------------------------------------------------------------------------------------------------------------
COMMENT ON TABLE PR3210 IS '(PR3210)유니폼지급대상자관리';

COMMENT ON COLUMN PR3210.C_CD IS '회사코드';
COMMENT ON COLUMN PR3210.EMP_ID IS '사번';
COMMENT ON COLUMN PR3210.GIV_STD_ID IS '지급회차ID';
COMMENT ON COLUMN PR3210.ORG_ID IS '조직코드';
COMMENT ON COLUMN PR3210.EMP_GRADE_CD IS '직급코드';
COMMENT ON COLUMN PR3210.INS_USER_ID IS '입력자ID';
COMMENT ON COLUMN PR3210.MOD_USER_ID IS '작업자ID';
COMMENT ON COLUMN PR3210.INS_GYMDHMS IS '입력일시_현지';
COMMENT ON COLUMN PR3210.INS_YMDHMS IS '입력일시';
COMMENT ON COLUMN PR3210.MOD_YMDHMS IS '수정일시';
COMMENT ON COLUMN PR3210.MOD_GYMDHMS IS '수정일시_현지';
------------------------------------------------------------------------------------------------------------------------
DROP TABLE PR3210_TMP CASCADE CONSTRAINTS PURGE;
CREATE GLOBAL TEMPORARY TABLE PR3210_TMP
(
    C_CD         VARCHAR2(20) NOT NULL,
    EMP_ID       VARCHAR2(60) NOT NULL,
    GIV_STD_ID   VARCHAR2(60),
    ORG_ID       VARCHAR2(60),
    EMP_GRADE_CD VARCHAR2(60),
    CONSTRAINT PK_I_PR3210_TMP
        PRIMARY KEY (C_CD, EMP_ID, GIV_STD_ID)
)
    ON COMMIT DELETE ROWS;
------------------------------------------------------------------------------------------------------------------------
COMMENT ON TABLE PR3210_TMP IS '유니폼지급대상자임시테이블';

COMMENT ON COLUMN PR3210_TMP.C_CD IS '회사코드';
COMMENT ON COLUMN PR3210_TMP.EMP_ID IS '사번';
COMMENT ON COLUMN PR3210_TMP.GIV_STD_ID IS '지급회차ID';
COMMENT ON COLUMN PR3210_TMP.ORG_ID IS '조직코드';
COMMENT ON COLUMN PR3210_TMP.EMP_GRADE_CD IS '직급코드';
------------------------------------------------------------------------------------------------------------------------
DROP TABLE PR3310 CASCADE CONSTRAINTS PURGE;
CREATE TABLE PR3310
(
    C_CD        VARCHAR2(20)     NOT NULL,
    APPL_ID     VARCHAR2(60)     NOT NULL,
    SEQ_NO      NUMBER DEFAULT 0 NOT NULL,
    EMP_ID      VARCHAR2(60)     NOT NULL,
    GIV_STD_ID  VARCHAR2(60)     NOT NULL,
    UNIF_CD     VARCHAR2(20)     NOT NULL,
    GIV_YMD     VARCHAR2(8),
    NOTE        VARCHAR2(500),
    INS_USER_ID VARCHAR2(20),
    INS_YMDHMS  TIMESTAMP(6),
    MOD_USER_ID VARCHAR2(20),
    MOD_YMDHMS  TIMESTAMP(6),
    INS_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
    MOD_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,

    CONSTRAINT PK_I_PR3310
        PRIMARY KEY (C_CD, EMP_ID, APPL_ID, GIV_STD_ID),
    CONSTRAINT NI_SY7010_PR3310
        FOREIGN KEY (C_CD, APPL_ID) REFERENCES SY7010 ON DELETE CASCADE,
    CONSTRAINT NI_PR3210_PR3310
        FOREIGN KEY (C_CD, EMP_ID, GIV_STD_ID) REFERENCES PR3210 ON DELETE CASCADE
);
------------------------------------------------------------------------------------------------------------------------
COMMENT ON TABLE PR3310 IS '(PR3310)유니폼신청';

COMMENT ON COLUMN PR3310.C_CD IS '회사코드';
COMMENT ON COLUMN PR3310.APPL_ID IS '신청서ID';
COMMENT ON COLUMN PR3310.SEQ_NO IS '신청서별 유니폼 신청내역';
COMMENT ON COLUMN PR3310.EMP_ID IS '사번';
COMMENT ON COLUMN PR3310.GIV_STD_ID IS '선물유형';
COMMENT ON COLUMN PR3310.UNIF_CD IS '유니폼코드';
COMMENT ON COLUMN PR3310.GIV_YMD IS '유니폼수령일';
COMMENT ON COLUMN PR3310.NOTE IS '비고';
COMMENT ON COLUMN PR3310.INS_USER_ID IS '입력자ID';
COMMENT ON COLUMN PR3310.INS_YMDHMS IS '입력일시';
COMMENT ON COLUMN PR3310.MOD_USER_ID IS '작업자ID';
COMMENT ON COLUMN PR3310.MOD_YMDHMS IS '수정일시';
COMMENT ON COLUMN PR3310.INS_GYMDHMS IS '입력일시_현지';
COMMENT ON COLUMN PR3310.MOD_GYMDHMS IS '수정일시_현지';
------------------------------------------------------------------------------------------------------------------------
DROP TABLE PR3410 CASCADE CONSTRAINTS PURGE;
CREATE TABLE PR3410
(
    C_CD        VARCHAR2(20) NOT NULL,
    DATA_ID     VARCHAR2(60) NOT NULL,
    APPL_ID     VARCHAR2(60) NULL,
    EMP_ID      VARCHAR2(20) NULL,
    ORG_ID      VARCHAR2(60) NULL,
    GIV_YMD     VARCHAR2(8)  NULL,
    GIV_YN      VARCHAR2(1) DEFAULT 'N'
        CONSTRAINT PR_000000002
            CHECK (GIV_YN IN ('Y', 'N')),
    GIV_STD_ID  VARCHAR2(60) NULL,
    NOTE        VARCHAR2(500),
    IN_TYPE     VARCHAR2(20) NULL,
    INS_USER_ID VARCHAR2(20) NULL,
    INS_YMDHMS  TIMESTAMP(6) NULL,
    MOD_USER_ID VARCHAR2(20) NULL,
    MOD_YMDHMS  TIMESTAMP(6) NULL,
    INS_GYMDHMS TIMESTAMP(6) NULL,
    MOD_GYMDHMS TIMESTAMP(6) NULL,
    CONSTRAINT PR3410_PK
        PRIMARY KEY (C_CD, DATA_ID),
    CONSTRAINT NI_SY7010_PR3410
        FOREIGN KEY (C_CD, APPL_ID) REFERENCES SY7010 ON DELETE CASCADE
);
------------------------------------------------------------------------------------------------------------------------
COMMENT ON TABLE PR3410 IS '(PR3410)유니폼신청관리';

COMMENT ON TABLE PR3410 IS '(PR3410)유니폼신청관리';
COMMENT ON COLUMN PR3410.C_CD IS '회사코드';
COMMENT ON COLUMN PR3410.DATA_ID IS '자료ID';
COMMENT ON COLUMN PR3410.APPL_ID IS '신청서ID';
COMMENT ON COLUMN PR3410.EMP_ID IS '사번';
COMMENT ON COLUMN PR3410.ORG_ID IS '조직코드';
COMMENT ON COLUMN PR3410.GIV_YMD IS '유니폼수령일';
COMMENT ON COLUMN PR3410.GIV_YN IS '지급완료여부';
COMMENT ON COLUMN PR3410.GIV_STD_ID IS '지급회차ID';
COMMENT ON COLUMN PR3410.NOTE IS '비고';
COMMENT ON COLUMN PR3410.IN_TYPE IS '입력유형';
COMMENT ON COLUMN PR3410.INS_USER_ID IS '입력자ID';
COMMENT ON COLUMN PR3410.INS_YMDHMS IS '입력일시';
COMMENT ON COLUMN PR3410.MOD_USER_ID IS '작업자ID';
COMMENT ON COLUMN PR3410.MOD_YMDHMS IS '수정일시';
COMMENT ON COLUMN PR3410.INS_GYMDHMS IS '입력일시_현지';
COMMENT ON COLUMN PR3410.MOD_GYMDHMS IS '수정일시_현지';
------------------------------------------------------------------------------------------------------------------------
DROP PROCEDURE P_PR_UNIF_TARG_CHEK;
-- CALL P_PR_UNIF_TARG_CHEK('10', '123', '', '', '', '', '');
-----------------------------------------------------------------------------
CREATE PROCEDURE "P_PR_UNIF_TARG_CHEK"(I_C_CD VARCHAR2,
                                       I_GIV_ID VARCHAR2,
                                       I_ORG_ID VARCHAR2,
                                       I_EMP_GRADE_CD VARCHAR2,
                                       I_GENDER_TYPE VARCHAR2,
                                       I_BATCH_TYPE VARCHAR2,
                                       I_ONLY_CHECK VARCHAR2,
                                       I_MOD_USER_ID VARCHAR2,
                                       O_ERRORCODE OUT VARCHAR2, -- 처리코드
                                       O_ERRORMESG OUT VARCHAR2) -- 처리내역
IS

BEGIN

    DBMS_OUTPUT.PUT_LINE('임시테이블에 값 삽입');

    IF
        I_ONLY_CHECK = 'Y' THEN

        DBMS_OUTPUT.PUT_LINE('하위 조직 포함');

        INSERT INTO PR3210_TMP (C_CD,
                                EMP_ID,
                                GIV_STD_ID,
                                ORG_ID,
                                EMP_GRADE_CD)
        SELECT T1.C_CD,
               T1.EMP_ID,
               I_GIV_ID,
               T2.ORG_ID,
               T2.EMP_GRADE_CD
        FROM PA1010 T1,
             PA1020 T2
        WHERE T1.C_CD = I_C_CD
          AND T2.C_CD = T1.C_CD
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
                   AND ('00000' IS NULL OR O.OBJ_ID = '00000')
                   AND O.PAR_OBJ_TYPE IN ('O', 'RT')
                   AND TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') BETWEEN O.STA_YMD AND O.END_YMD
            CONNECT BY PRIOR O.C_CD = O.C_CD
                   AND PRIOR O.OBJ_TYPE = O.PAR_OBJ_TYPE
                   AND PRIOR O.OBJ_ID = O.PAR_OBJ_ID);

    ELSE

        DBMS_OUTPUT.PUT_LINE('하위 조직 미포함');

        INSERT INTO PR3210_TMP (C_CD,
                                EMP_ID,
                                GIV_STD_ID,
                                ORG_ID,
                                EMP_GRADE_CD)
        SELECT T1.C_CD,
               T1.EMP_ID,
               I_GIV_ID,
               T2.ORG_ID,
               T2.EMP_GRADE_CD
        FROM PA1010 T1,
             PA1020 T2
        WHERE T1.C_CD = I_C_CD
          AND T2.C_CD = T1.C_CD
          AND T2.EMP_ID = T1.EMP_ID
          AND (I_EMP_GRADE_CD IS NULL OR T2.EMP_GRADE_CD = I_EMP_GRADE_CD)
          AND (I_GENDER_TYPE IS NULL OR T1.GENDER_TYPE = I_GENDER_TYPE)
          AND T1.STAT_CD LIKE '1%'
          AND T2.LAST_YN = 'Y'
          AND TO_CHAR(SYSDATE, 'YYYYMMDD') BETWEEN T2.STA_YMD AND T2.END_YMD
          AND T2.ORG_ID IN (SELECT ORG_ID
                            FROM PA1020
                            WHERE C_CD = I_C_CD
                              AND TO_CHAR(SYSDATE, 'YYYYMMDD') BETWEEN STA_YMD AND END_YMD
                              AND LAST_YN = 'Y'
                              AND (I_ORG_ID IS NULL OR ORG_ID = I_ORG_ID)
        );
    END IF;

    DBMS_OUTPUT.PUT_LINE('임시테이블 값 삽입 완료');

    IF
        I_BATCH_TYPE = 'NEW' THEN

        DELETE
        FROM PR3210;

        DBMS_OUTPUT.PUT_LINE('PR3210 테이블에 값 새로 삽입');

        INSERT INTO PR3210(C_CD,
                           GIV_STD_ID,
                           EMP_ID,
                           ORG_ID,
                           EMP_GRADE_CD,
                           INS_USER_ID,
                           INS_YMDHMS,
                           MOD_USER_ID,
                           MOD_YMDHMS,
                           INS_GYMDHMS,
                           MOD_GYMDHMS)
        SELECT T3.C_CD,
               T3.GIV_STD_ID,
               T3.EMP_ID,
               T3.ORG_ID,
               T3.EMP_GRADE_CD,
               I_MOD_USER_ID,
               SYSTIMESTAMP,
               I_MOD_USER_ID,
               SYSTIMESTAMP,
               CURRENT_TIMESTAMP,
               CURRENT_TIMESTAMP
        FROM PA1010 T1,
             PA1020 T2,
             PR3210_TMP T3
        WHERE T2.C_CD = T1.C_CD
          AND T3.C_CD = T2.C_CD
          AND T3.ORG_ID = T2.ORG_ID
          AND T1.EMP_ID = T2.EMP_ID
          AND T3.EMP_ID = T1.EMP_ID
          AND T2.LAST_YN = 'Y'
          AND TO_CHAR(SYSDATE, 'YYYYMMDD') BETWEEN T2.STA_YMD AND T2.END_YMD
        ORDER BY T3.EMP_ID;

        DBMS_OUTPUT.PUT_LINE('PR3210 테이블에 값 새로 삽입 완료');

    ELSE

        DBMS_OUTPUT.PUT_LINE('PR3210 테이블에 값 추가');

        MERGE INTO
            PR3210 T1
        USING (
            SELECT C.C_CD,
                   C.EMP_ID,
                   C.GIV_STD_ID,
                   C.ORG_ID,
                   C.EMP_GRADE_CD
            FROM PA1010 A,
                 PA1020 B,
                 PR3210_TMP C
            WHERE B.C_CD = A.C_CD
              AND C.C_CD = B.C_CD
              AND C.ORG_ID = B.ORG_ID
              AND A.EMP_ID = B.EMP_ID
              AND C.EMP_ID = A.EMP_ID
              AND B.LAST_YN = 'Y'
              AND TO_CHAR(SYSDATE, 'YYYYMMDD') BETWEEN B.STA_YMD AND B.END_YMD
            ORDER BY C.EMP_ID
        ) T2
        ON (
            T1.EMP_ID = T2.EMP_ID
            )

        WHEN MATCHED THEN
            UPDATE
            SET T1.C_CD         = T2.C_CD,
                T1.GIV_STD_ID   = T2.GIV_STD_ID,
                T1.ORG_ID       = T2.ORG_ID,
                T1.EMP_GRADE_CD = T2.EMP_GRADE_CD

        WHEN NOT MATCHED THEN
            INSERT (T1.C_CD,
                    T1.EMP_ID,
                    T1.GIV_STD_ID,
                    T1.ORG_ID,
                    T1.EMP_GRADE_CD)
            VALUES (T2.C_CD,
                    T2.EMP_ID,
                    T2.GIV_STD_ID,
                    T2.ORG_ID,
                    T2.EMP_GRADE_CD);

        DBMS_OUTPUT.PUT_LINE('PR3210 테이블에 값 추가 완료');

    END IF;

    O_ERRORCODE := '0';
EXCEPTION
    WHEN OTHERS THEN
        O_ERRORMESG := SQLERRM;
        O_ERRORCODE := SQLCODE;

END;
