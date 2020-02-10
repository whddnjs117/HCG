-- Version 2020. 02. 10


-- 사전 요구사항
-- > Java Development Kit 설치 (1.8 이상) 설치
-- > HUNEL_EHRS_WEB_STAND 패키지 설치 (eclipse -> import 하면 좋음)
-- > Oracle 11g 설치
-- > Toad for Oracle (버전 상관 없음) 설치


-- 추가 요구사항
-- 사이트에서 새로운 이름으로 프로젝트 개발환경 구축 시 HUNELSTANDARD를 요구하는 프로젝트 명으로 변경
-- IMPDP 명령어 실행 간 REMAP_SCHEMA / REMAP_TABLESPACE를 추가로 설정할 것.
-- 작성 방법은 IMPDP 유저이름/비밀번호 DUMPFILE=덤프파일명.DMP DIRECTORY=덤프파일폴더위치 REMAP_SCHEMA=HUNELSTANDARD:요구프로젝트명 REMAP_TABLESPACE=TS_HUNELSTANDARD:TS_요구프로젝트명


-- #####################################################################################################################
-- ############# [username: system / password: 오라클 설치시 설정한 비밀번호 / ConnectAs : SYSDBA] 로그인 ##############
-- START // # 테스트용 유저생성(Oracle Home 설정 위치 꼭 기억) 시작



-- 1. Table Space 생성
DROP TABLESPACE TS_HUNELSTANDARD INCLUDING CONTENTS AND DATAFILES;
COMMIT; 
--${ORACLE_HOME}/ORADATA/ORCL/HUNELSTANDARD.DBF
CREATE TABLESPACE TS_HUNELSTANDARD DATAFILE 'D:/oracle/ORADATA/ORCL/HUNELSTANDARD.DBF' SIZE 100M AUTOEXTEND ON ;

-- 2. User 생성
DROP USER "HUNELSTANDARD" CASCADE;
COMMIT;
CREATE USER "HUNELSTANDARD"
IDENTIFIED BY "HUNEL!STANDARD"
DEFAULT TABLESPACE TS_HUNELSTANDARD
TEMPORARY TABLESPACE TEMP;

-- 3. GRANT USER
GRANT DBA TO HUNELSTANDARD;

-- 4. IMPDP (명령 프롬프트에서 실행)
-- DATA_PUMP_DIR 경로 확인
-- Default 경로는 ${ORACLE_HOME}/admin/orcl/dpdump/
SELECT * FROM DBA_DIRECTORIES WHERE DIRECTORY_NAME='DATA_PUMP_DIR';
-- DATA_PUMP_DIR 경로 변경(변경하지 않겠다면 실행하지 말 것)
CREATE OR REPLACE DIRECTORY DATA_PUMP_DIR as 'D:/dpdump/';
-- HUNELSTANDARD_{날짜}.7z 파일을 압축 해제 및 DATA_PUMP_DIR 하위로 이동 후 CMD(명령 프롬프트) 실행
-- 파일 이름도 HUNELSTANDARD.DMP 로 변경하면 편함
IMPDP HUNELSTANDARD/HUNEL!STANDARD DUMPFILE=HUNELSTANDARD_20200208.DMP DIRECTORY=DATA_PUMP_DIR
-- 풀 명령어 : IMPDP HUNELSTANDARD/HUNEL!STANDARD DUMPFILE=HUNELSTANDARD.DMP DIRECTORY=DATA_PUMP_DIR REMAP_SCHEMA=HUNELSTANDARD:TO_BE_SCHEMA_NAME REMAP_TABLESPACE=TS_HUNELSTANDARD:TO_BE_TABLESPACE_NAME

-- 5-1. hunel의 key.properties / license.dat 파일을 위한 디렉토리 생성
-- 오라클 홈 디렉토리 아래에 HCG_PKG_DIR 폴더를 만들고 HCG_PKG_DIR 폴더 아래에 유저명으로 폴더 생성
-- ${ORACLE_HOME}/product/11.2.0/dbhome_1/HCG_PKG_DIR/HUNELSTANDARD
CREATE DIRECTORY DIR_HUNELSTANDARD AS 'D:/oracle/product/11.2.0/dbhome_1/HCG_PKG_DIR/HUNELSTANDARD';
GRANT READ ON DIRECTORY DIR_HUNELSTANDARD TO HUNELSTANDARD;

-- 5-2. 위에서 생성한 디렉토리에 key.properties 또는 license.dat 파일을 복사
-- key.properties 또는 license.dat 파일 위치 : {huenl_java_project}/WebRoot/WEB-INF/license
-- 복사할 위치 : ${ORACLE_HOME}/product/11.2.0/dbhome_1/HCG_PKG_DIR/유저명

-- 6. DB 권한 부여
GRANT EXECUTE ON DBMS_CRYPTO TO HUNELSTANDARD;
EXEC dbms_java.grant_permission('HUNELSTANDARD', 'SYS:java.io.FilePermission', 'D:/oracle/product/11.2.0/dbhome_1/HCG_PKG_DIR/HUNELSTANDARD/license.dat', 'read');
EXEC dbms_java.grant_permission('HUNELSTANDARD', 'SYS:java.security.SecurityPermission', 'putProviderProperty.BC', '' );
EXEC dbms_java.grant_permission('HUNELSTANDARD', 'SYS:java.security.SecurityPermission', 'insertProvider.BC', '' ); 
-- END // # 테스트용 유저생성(Oracle Home 설정 위치 꼭 기억) 종료
-- #####################################################################################################################


-- #####################################################################################################################
-- START // # # 테스트 용 RET 유저생성 시작

-- 7. Table Space 생성
DROP USER HUNELHTMLEHR_RET CASCADE;
CREATE TABLESPACE TS_HUNELHTMLEHR_RET DATAFILE 'D:/oracle/ORADATA/ORCL/HUNELHTMLEHR_RET.DBF' SIZE 100M AUTOEXTEND ON ;

-- 8. User 생성
CREATE USER "HUNELHTMLEHR_RET"
IDENTIFIED BY "HUNEL!STANDARD"
DEFAULT TABLESPACE TS_HUNELHTMLEHR_RET
TEMPORARY TABLESPACE TEMP;

-- 9. GRANT USER
GRANT DBA TO HUNELHTMLEHR_RET;

-- 10. IMPDP (명령 프롬프트에서 실행)
IMPDP HUNELHTMLEHR_RET/HUNEL!STANDARD DUMPFILE=HUNELHTMLEHR_RET.DMP DIRECTORY=DATA_PUMP_DIR 
-- 풀 명령어 : IMPDP HUNELHTMLEHR_RET/HUNEL!STANDARD DUMPFILE=HUNELHTMLEHR_RET.DMP DIRECTORY=DATA_PUMP_DIR REMAP_SCHEMA=DEMO_HUNEL:HUNELSTANDARD REMAP_TABLESPACE=TS_DEMO_HUNEL:TS_HUNELSTANDARD

-- END // # 테스트용 유저생성 종료
-- #####################################################################################################################


-- #####################################################################################################################
-- ################## [username: HUNELSTANDARD / password: HUNEL!STANDARD / ConnectAs : NOMAL] 로그인 ##################
-- START // # 권한 및 컴파일

-- 11. JAVA CLASS 등록(가. 또는 나. 방법 중 하나만 하면 됨)
-- 가. 토드 schema broswer에서 Java 카테고리로 검색 -> 전체 선택 후 우클릭 -> compile 클릭
-- 나-1. CMD>> dropjava -u HUNELSTANDARD/HUNEL!STANDARD@localhost:1521:ORCL -v -r -t *.*
-- 나-2. CMD>> loadjava -u HUNELSTANDARD/HUNEL!STANDARD@localhost:1521:ORCL -v -r -t D:/EHR_PROJECT/HUNEL_EHRS_WEB/db/loadjava/*.*

-- 12. DB Package Compile
-- 토드 schema broswer에서 Packages 카테고리로 검색 -> PKG_CRYPTO_CORE, PKG_CRYPTO 선택 후 우클릭 -> compile -> compile with debug 클릭
-- 권한이 없으면 컴파일 시 오류 발생(6번 항목 참고하여 권한 부여)
-- PKG_CRYPTO_CORE는 암호화 상태이므로 수정불가

-- 13. RET 권한부여(RET 유저 생성 후)
-- 아래 쿼리 실행 및 쿼리 결과(Data Grid)를 전체 선택 후 복사
SELECT 'GRANT DELETE, INSERT, SELECT, UPDATE ON ' || :RET_USER || '.' || T1.TABLE_NAME || ' TO ' || :USER_NAME || ';'
  FROM ALL_TABLES T1
 WHERE T1.OWNER = :RET_USER;
-- 복사한 쿼리 결과를 다른 에디터 창에 붙여넣기 후 전체 실행

-- 14. VIEW COMPILE
-- 토드 schema broswer에서 Views 카테고리로 검색 -> 전체 선택 후 우클릭 -> Compile all invalid views in the schema 클릭

-- END // # 권한 및 컴파일
-- #####################################################################################################################


-- #####################################################################################################################
-- START // # 데이터 조작

-- 15-1. SUPER 패스워드 변경 1
UPDATE HUNELSTANDARD.SY4100 
SET PWD = HUNELSTANDARD.PKG_CRYPTO.F_SET_ENC_SHA('1')
  , PWD_MOD_YMDHMS = SYSTIMESTAMP
  , ERR_CNT = 0 
WHERE USER_ID = 'SUPER';

-- 15-2. SUPER 패스워드 변경 2(1과 2중 선택)
UPDATE HUNELSTANDARD.RE4010 SET PWD = PKG_CRYPTO.F_SET_ENC_SHA('1') WHERE MAIL = '1@e-hcg.com';
UPDATE HUNELHTMLEHR_RET.RE4010 SET PWD = PKG_CRYPTO.F_SET_ENC_SHA('1') WHERE MAIL = '1@e-hcg.com';

-- 16. SUPER 패스워드 5회 오류 초기화
UPDATE SY4100
SET ERR_CNT = 0
WHERE C_CD = '10'
    AND USER_ID = 'SUPER';

-- 17. hunel 패키지의 web.xml 수정하기
-- 이클립스 구동 시 지속적으로 에러창이 뜬다면 web.xml 에서 dispatcher 태그를 주석처리할 것
-- <dispatcher>REQUEST</dispatcher>, <dispatcher>FORWARD</dispatcher>

-- END // # 데이터 조작
-- #####################################################################################################################


-- #####################################################################################################################
-- 이하부터는 필요에 따라 실행하고, 꼭 진행하지 않아도 되는 단계임
-- 보통 채용서버는 HR시스템과 별개로 두기 때문

-- # 채용서버 테스트용 유저생성
-- 1. CREATE TS
CREATE TABLESPACE TS_HUNELHTMLEHR_RET DATAFILE 'D:/oracle/ORADATA/ORCL/HUNELHTMLEHR_RET.DBF' SIZE 100M AUTOEXTEND ON ;

-- 2. CREATE USER
CREATE USER "HUNELHTMLEHR_RET"
IDENTIFIED BY "HUNEL!STANDARD"
DEFAULT TABLESPACE TS_HUNELHTMLEHR_RET
TEMPORARY TABLESPACE TEMP;

-- 3. GRANT USER
GRANT DBA TO HUNELHTMLEHR_RET;

-- 4. IMPDP
-- IMPDP HUNELHTMLEHR_RET/HUNEL!STANDARD DUMPFILE=HUNELHTMLEHR_RET.DMP DIRECTORY=DATA_PUMP_DIR REMAP_SCHEMA=DEMO_REEHR:HUNELHTMLEHR_RET REMAP_TABLESPACE=TS_DEMO_REEHR:TS_HUNELHTMLEHR_RET

-- 5-1. hunel의 key.properties / license.dat 파일을 위한 디렉토리 생성
-- 오라클 홈 디렉토리 아래에 HCG_PKG_DIR 폴더를 만들고 HCG_PKG_DIR 폴더 아래에 유저명으로 폴더 생성
-- ${ORACLE_HOME}/product/11.2.0/dbhome_1/HCG_PKG_DIR/HUNELHTMLEHR_RET
CREATE DIRECTORY DIR_HUNELHTMLEHR_RET AS 'D:/oracle/product/11.2.0/dbhome_1/HCG_PKG_DIR/HUNELHTMLEHR_RET';
GRANT READ ON DIRECTORY DIR_HUNELHTMLEHR_RET TO HUNELHTMLEHR_RET;

-- 5-2. 위에서 생성한 디렉토리에 key.properties 또는 license.dat 파일을 복사
-- key.properties 또는 license.dat 파일 위치 : {huenl_java_project}/WebRoot/WEB-INF/license
-- 복사할 위치 : ${ORACLE_HOME}/product/11.2.0/dbhome_1/HCG_PKG_DIR/유저명

-- 6. DB 권한 부여
GRANT EXECUTE ON DBMS_CRYPTO TO HUNELHTMLEHR_RET;
EXEC dbms_java.grant_permission('HUNELHTMLEHR_RET', 'SYS:java.io.FilePermission', 'D:/oracle/product/11.2.0/dbhome_1/HCG_PKG_DIR/HUNELHTMLEHR_RET', 'read');
EXEC dbms_java.grant_permission('HUNELHTMLEHR_RET', 'SYS:java.security.SecurityPermission', 'putProviderProperty.BC', '' );
EXEC dbms_java.grant_permission('HUNELHTMLEHR_RET', 'SYS:java.security.SecurityPermission', 'insertProvider.BC', '' ); 

-- 7. JAVA CLASS 등록(가. 또는 나. 방법 중 하나만 하면 됨)
-- 가. 토드 schema broswer에서 Java 카테고리로 검색 -> 전체 선택 후 우클릭 -> compile 클릭
-- 나-1. CMD>> dropjava -u HUNELSTANDARD/HUNEL!STANDARD@localhost:1521:ORCL -v -r -t *.*
-- 나-2. CMD>> loadjava -u HUNELSTANDARD/HUNEL!STANDARD@localhost:1521:ORCL -v -r -t D:/EHR_PROJECT/HUNEL_EHRS_WEB/db/loadjava/*.*

-- 8. DB Package Compile
-- 토드 schema broswer에서 Packages 카테고리로 검색 -> PKG_CRYPTO_CORE, PKG_CRYPTO 선택 후 우클릭 -> compile -> compile with debug 클릭
-- 권한이 없으면 컴파일 시 오류 발생(6번 항목 참고하여 권한 부여)
-- PKG_CRYPTO_CORE는 암호화 상태이므로 수정불가


---------------------- 번외 ----------------------
-- DBLink 용 Function
CREATE OR REPLACE FUNCTION "F_GET_TABLE_COMPARE_VALUE"
(
    I_TARGET_OWNER  VARCHAR2
   ,I_SOURCE_OWNER  VARCHAR2
)
    /***********************************************************************
     Program Name   : F_GET_TABLE_COMPARE_VALUE
     Description    : OWNER 별 소유 테이블명 비교 후 다른 테이블 정보 갯수 가져오기
     Author         : ***
     History        : 2019.07.04 신규개발
    ***********************************************************************/
    RETURN VARCHAR2
IS
    V_TABLE_COMPARE_CNT VARCHAR2(500);
BEGIN
    WITH MAP_M
         AS (SELECT A.OWNER
                   ,A.TABLE_NAME
                   ,A.COLUMN_NAME
                   ,A.DATA_TYPE || '(' || DECODE(A.DATA_TYPE, 'number', A.DATA_PRECISION || DECODE(A.DATA_SCALE, 0, '', ',' || A.DATA_SCALE), A.DATA_LENGTH) || ')' AS DATA_TYPE
               FROM ALL_TAB_COLUMNS A
                   ,ALL_TAB_COMMENTS B
                   ,ALL_COL_COMMENTS C
              WHERE A.OWNER = :SOURCE
                AND B.OWNER = A.OWNER
                AND C.OWNER = A.OWNER
                AND B.TABLE_NAME = A.TABLE_NAME
                AND C.TABLE_NAME = A.TABLE_NAME
                AND C.COLUMN_NAME = A.COLUMN_NAME
                AND (A.TABLE_NAME, A.COLUMN_NAME) NOT IN (SELECT T1.TABLE_NAME
                                                                ,T1.COLUMN_NAME
                                                            FROM ALL_TAB_COLUMNS T1
                                                                ,ALL_TAB_COMMENTS T2
                                                                ,ALL_COL_COMMENTS T3
                                                           WHERE T1.OWNER = :TARGET
                                                             AND T2.OWNER = T1.OWNER
                                                             AND T3.OWNER = T1.OWNER
                                                             AND T2.TABLE_NAME = T1.TABLE_NAME
                                                             AND T3.TABLE_NAME = T1.TABLE_NAME
                                                             AND T3.COLUMN_NAME = T1.COLUMN_NAME))
    SELECT COUNT(*) TOTAL
      INTO V_TABLE_COMPARE_CNT
      FROM MAP_M T1
          ,ALL_TAB_COMMENTS T2
          ,ALL_COL_COMMENTS T3
     WHERE 1 = 1
       AND T2.OWNER = T1.OWNER
       AND T3.OWNER = T1.OWNER
       AND T2.TABLE_NAME = T1.TABLE_NAME
       AND T3.TABLE_NAME = T1.TABLE_NAME
       AND T3.COLUMN_NAME = T1.COLUMN_NAME;

    RETURN V_TABLE_COMPARE_CNT;
END;

-- DBLink 용 Procedure
CREATE GLOBAL TEMPORARY TABLE TEMP_OWNER_TABLE_COMPARE(COL1                VARCHAR2(4000)
                                                      ,COL2                VARCHAR2(4000)
                                                      ,COL3                VARCHAR2(4000)
                                                      ,COL3                VARCHAR2(4000)
                                                      ,COL3                VARCHAR2(4000)
                                                      ,COL3                VARCHAR2(4000));

CREATE TABLE OWNER_TABLE_COMPARE(OWNER               VARCHAR2(4000)
                                ,TABLE_NAME          VARCHAR2(4000)
                                ,TABLE_COMMENT       VARCHAR2(4000)
                                ,COLUMN_NAME         VARCHAR2(4000)
                                ,DATA_TYPE           VARCHAR2(4000)
                                ,COLUMN_COMMENT      VARCHAR2(4000)
                                ,INS_GYMDHMS         TIMESTAMP(6) WITH TIME ZONE);
                                
CALL P_TABLE_COMPARE('GRSEHR', 'GRSEHR_RET');

DROP PROCEDURE P_TABLE_COMPARE;

CREATE OR REPLACE PROCEDURE P_TABLE_COMPARE
(
    I_TARGET_OWNER  VARCHAR2
   ,I_SOURCE_OWNER  VARCHAR2
)
IS
    V_TEMP_VAL          NUMBER;
    V_VAL               NUMBER;
    V_SQL               VARCHAR2(4000);
BEGIN
--    SELECT (SELECT NVL(MIN(CASE WHEN TABLE_NAME IS NOT NULL THEN 1 ELSE 0 END), 0)
--              FROM USER_TABLES
--             WHERE TABLE_NAME = 'TEMP_OWNER_TABLE_COMPARE')
--               TEMP_VAL
--          ,(SELECT NVL(MIN(CASE WHEN TABLE_NAME IS NOT NULL THEN 1 ELSE 0 END), 0)
--              FROM USER_TABLES
--             WHERE TABLE_NAME = 'OWNER_TABLE_COMPARE')
--               VAL
--      INTO V_TEMP_VAL
--          ,V_VAL
--      FROM DUAL;
--
--    DBMS_OUTPUT.PUT_LINE('INSERT BEFORE DATA CONFIRM!');
--
--    IF V_TEMP_VAL = 1 THEN
--        V_SQL            := 'DROP TABLE TEMP_OWNER_TABLE_COMPARE';
--
--        EXECUTE IMMEDIATE V_SQL;
--    END IF;
--    
--    IF V_VAL = 1 THEN
--        V_SQL            := 'DROP TABLE OWNER_TABLE_COMPARE';
--
--        EXECUTE IMMEDIATE V_SQL;
--    END IF;
--
--    V_SQL            := 'CREATE GLOBAL TEMPORARY TABLE TEMP_OWNER_TABLE_COMPARE(
--                                                                                    COL1                VARCHAR2(4000)
--                                                                                   ,COL2                VARCHAR2(4000)
--                                                                                   ,COL3                VARCHAR2(4000)
--                                                                                   ,COL4                VARCHAR2(4000)
--                                                                                   ,COL5                VARCHAR2(4000)
--                                                                                   ,COL6                VARCHAR2(4000))';
--
--    EXECUTE IMMEDIATE V_SQL;
--
--    DBMS_OUTPUT.PUT_LINE('CREATE TEMP_TABLE SUCCESS!');
--
--    V_SQL            := 'CREATE TABLE OWNER_TABLE_COMPARE(
--                                                              OWNER               VARCHAR2(4000)
--                                                             ,TABLE_NAME          VARCHAR2(4000)
--                                                             ,TABLE_COMMENT       VARCHAR2(4000)
--                                                             ,COLUMN_NAME         VARCHAR2(4000)
--                                                             ,DATA_TYPE           VARCHAR2(4000)
--                                                             ,COLUMN_COMMENT      VARCHAR2(4000)
--                                                             ,INS_GYMDHMS         TIMESTAMP(6) WITH TIME ZONE)';
--
--    EXECUTE IMMEDIATE V_SQL;
--
--    DBMS_OUTPUT.PUT_LINE('CREATE TABLE SUCCESS!');

    DBMS_OUTPUT.PUT_LINE('TEMP_TABLE DATA INSERT START!');

    INSERT INTO TEMP_OWNER_TABLE_COMPARE
                (
                    COL1
                   ,COL2
                   ,COL3
                   ,COL4
                   ,COL5
                   ,COL6
                )
        WITH MAP_M
             AS (SELECT A.OWNER
                       ,A.TABLE_NAME
                       ,A.COLUMN_NAME
                       ,A.DATA_TYPE || '(' || DECODE(A.DATA_TYPE, 'number', A.DATA_PRECISION || DECODE(A.DATA_SCALE, 0, '', ',' || A.DATA_SCALE), A.DATA_LENGTH) || ')' AS DATA_TYPE
                   FROM ALL_TAB_COLUMNS A
                       ,ALL_TAB_COMMENTS B
                       ,ALL_COL_COMMENTS C
                  WHERE A.OWNER = I_SOURCE_OWNER
                    AND B.OWNER = A.OWNER
                    AND C.OWNER = A.OWNER
                    AND B.TABLE_NAME = A.TABLE_NAME
                    AND C.TABLE_NAME = A.TABLE_NAME
                    AND C.COLUMN_NAME = A.COLUMN_NAME
                    AND (A.TABLE_NAME, A.COLUMN_NAME) NOT IN (SELECT T1.TABLE_NAME
                                                                    ,T1.COLUMN_NAME
                                                                FROM ALL_TAB_COLUMNS T1
                                                                    ,ALL_TAB_COMMENTS T2
                                                                    ,ALL_COL_COMMENTS T3
                                                               WHERE T1.OWNER = I_TARGET_OWNER
                                                                 AND T2.OWNER = T1.OWNER
                                                                 AND T3.OWNER = T1.OWNER
                                                                 AND T2.TABLE_NAME = T1.TABLE_NAME
                                                                 AND T3.TABLE_NAME = T1.TABLE_NAME
                                                                 AND T3.COLUMN_NAME = T1.COLUMN_NAME))
        SELECT T2.OWNER
              ,T2.TABLE_NAME
              ,T2.COMMENTS AS TABLE_COMMENT
              ,T3.COLUMN_NAME
              ,T1.DATA_TYPE
              ,T3.COMMENTS AS COLUMN_COMMENT
          FROM MAP_M T1
              ,ALL_TAB_COMMENTS T2
              ,ALL_COL_COMMENTS T3
         WHERE 1 = 1
           AND T2.OWNER = T1.OWNER
           AND T3.OWNER = T1.OWNER
           AND T2.TABLE_NAME = T1.TABLE_NAME
           AND T3.TABLE_NAME = T1.TABLE_NAME
           AND T3.COLUMN_NAME = T1.COLUMN_NAME;

    DBMS_OUTPUT.PUT_LINE('TEMP_TABLE DATA INSERT SUCCESS!');

    DBMS_OUTPUT.PUT_LINE('TEMP_TABLE TO TABLE DATA INSERT START!');

    INSERT INTO OWNER_TABLE_COMPARE
                (
                    OWNER
                   ,TABLE_NAME
                   ,TABLE_COMMENT
                   ,COLUMN_NAME
                   ,DATA_TYPE
                   ,COLUMN_COMMENT
                   ,INS_GYMDHMS
                )
        SELECT COL1
              ,COL2
              ,COL3
              ,COL4
              ,COL5
              ,COL6
              ,SYSDATE
          FROM TEMP_OWNER_TABLE_COMPARE;

    DBMS_OUTPUT.PUT_LINE('TEMP_TABLE TO TABLE DATA INSERT SUCCESS!');
    DBMS_OUTPUT.PUT_LINE('FINISHED!');
END;