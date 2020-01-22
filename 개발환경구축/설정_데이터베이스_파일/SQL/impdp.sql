-- version 2019. 02. 18

-- # 테스트용 유저생성
-- 1. CREATE TS
CREATE TABLESPACE TS_HUNELSTANDARD DATAFILE 'D:\oracle\ORADATA\ORCL\HUNELSTANDARD.DBF' SIZE 100M AUTOEXTEND ON ;

-- 2. CREATE USER
CREATE USER "HUNELSTANDARD"
IDENTIFIED BY "HUNEL!STANDARD"
DEFAULT TABLESPACE TS_HUNELSTANDARD
TEMPORARY TABLESPACE TEMP;

-- 3. GRANT USER
GRANT DBA TO HUNELSTANDARD;

-- 4. IMPDP
--DATA_PUMP_DIR 경로 확인
SELECT * FROM SYS.DBA_DIRECTORIES WHERE DIRECTORY_NAME='DATA_PUMP_DIR';
--DATA_PUMP_DIR 경로 변경
CREATE OR REPLACE DIRECTORY DATA_PUMP_DIR as 'D:\dpdump\';
--IMPDP HUNELSTANDARD/HUNEL!STANDARD DUMPFILE=HUNELSTANDARD.DMP DIRECTORY=DATA_PUMP_DIR REMAP_SCHEMA=DEMO_HUNEL:HUNELSTANDARD REMAP_TABLESPACE=TS_DEMO_HUNEL:TS_HUNELSTANDARD

-- 5. key.properties or license.dat 파일을 위한 디렉토리를 생성
-- 오라클 홈 디렉토리 아래에 HCG_PKG_DIR 폴더를 만들고 HCG_PKG_DIR 폴더 아래에 유저명으로 폴더를 만듭니다.  
-- D:\app\user\product\11.2.0\dbhome_1\HCG_PKG_DIR\HUNELSTANDARD
CREATE DIRECTORY DIR_HUNELSTANDARD AS 'D:\oracle\product\11.2.0\dbhome_1\HCG_PKG_DIR\HUNELSTANDARD';
GRANT READ ON DIRECTORY DIR_HUNELSTANDARD TO HUNELSTANDARD;

-- 5-1. 다음 위치에 key.properties 또는 license.dat 파일을 복사합니다.
-- 위치 : 오라클홈/HCG_PKG_DIR/유저명

-- 6. DB 권한 부여
GRANT EXECUTE ON DBMS_CRYPTO TO HUNELSTANDARD;
EXEC dbms_java.grant_permission('HUNELSTANDARD', 'SYS:java.io.FilePermission', 'D:\oracle\product\11.2.0\dbhome_1\HCG_PKG_DIR\HUNELSTANDARD\license.dat', 'read');
EXEC dbms_java.grant_permission('HUNELSTANDARD', 'SYS:java.security.SecurityPermission', 'putProviderProperty.BC', '' );
EXEC dbms_java.grant_permission('HUNELSTANDARD', 'SYS:java.security.SecurityPermission', 'insertProvider.BC', '' ); 

-- 7. JAVA CLASS 등록
-- 토드에서 컴파일 안된거 Drop 후
-- dropjava -u HUNELSTANDARD/HUNEL!STANDARD@localhost:1521:ORCL -v -r -t *.*
-- loadjava -u HUNELSTANDARD/HUNEL!STANDARD@localhost:1521:ORCL -v -r -t D:\EHR_PROJECT\HUNEL_EHRS_WEB\db\loadjava\*.*

-- 9. DB Package Compile
-- - 먼저 PKG_CRYPTO_CORE.PKS, PKG_CRYPTO_CORE.PKB 파일을 컴파일합니다.
-- - PKG_CRYPTO.PKS, PKG_CRYPTO.PKB 파일을 컴파일합니다.
-- - 권한이 없으면 컴파일시에 오류가 발생하게 됩니다.(9.1을 참고하여 권한부여)
-- - PKG_CRYPTO_CORE.PKG 는 암호화되어 있으므로 수정할 수 없습니다.
-- - 패키지 자체 암복호화 모듈을 안쓴다면 PKG_CRYPTO.PKG 의 F_SET_ENC_DATA, F_GET_DEC_DATA 를 상황에 맞게 수정해야 합니다.

-- # 테스트 용 RET 유저생성

DROP USER HUNELHTMLEHR_RET CASCADE;
-- 10. CREATE TS
-- CREATE TABLESPACE TS_HUNELHTMLEHR_RET DATAFILE 'D:\oracle\ORADATA\ORCL\HUNELHTMLEHR_RET.DBF' SIZE 100M AUTOEXTEND ON ;

-- 11. CREATE USER
CREATE USER "HUNELHTMLEHR_RET"
IDENTIFIED BY "HUNEL!STANDARD"
DEFAULT TABLESPACE TS_HUNELHTMLEHR_RET
TEMPORARY TABLESPACE TEMP;

-- 12. GRANT USER
GRANT DBA TO HUNELHTMLEHR_RET;

-- 13. IMPDP
-- IMPDP HUNELHTMLEHR_RET/HUNEL!STANDARD DUMPFILE=HUNELHTMLEHR_RET_20190201.DMP DIRECTORY=DATA_PUMP_DIR 

-- 14. RET 권한부여(RET 유저 생성 후)
SELECT 'GRANT DELETE, INSERT, SELECT, UPDATE ON ' || :RET_USER || '.' || T1.TABLE_NAME || ' TO ' || :USER_NAME || ';'
  FROM ALL_TABLES T1
 WHERE T1.OWNER = :RET_USER;

-- 15. VIEW COMPILE

-- 16-0. SUPER 패스워드 변경 1
UPDATE HUNELSTANDARD.SY4100 
SET PWD = HUNELSTANDARD.PKG_CRYPTO.F_SET_ENC_SHA('1')
  , PWD_MOD_YMDHMS = SYSTIMESTAMP
  , ERR_CNT = 0 
WHERE USER_ID = 'SUPER';

-- 16.1 SUPER 패스워드 변경 2(1과 2중 선택)
UPDATE HUNELSTANDARD.RE4010 SET PWD = PKG_CRYPTO.F_SET_ENC_SHA('1') WHERE MAIL = '1@e-hcg.com';
UPDATE HUNELHTMLEHR_RET.RE4010 SET PWD = PKG_CRYPTO.F_SET_ENC_SHA('1') WHERE MAIL = '1@e-hcg.com';

-- 16.2 SUPER 패스워드 5회 오류 초기화
UPDATE SY4100
SET ERR_CNT = 0
WHERE C_CD = '10'
    AND USER_ID = 'SUPER';

-- 13. web.xml 수정하기
-- 이클립스 구동 시 지속적으로 에러창이 뜬다면 web.xml 에서 dispatcher 태그를 주석처리할 것
-- <dispatcher>REQUEST</dispatcher>, <dispatcher>FORWARD</dispatcher>
-- #####################################################################################################################


-- #####################################################################################################################
-- 이하부터는 필요에 따라 실행하고, 꼭 진행하지 않아도 되는 단계임
-- 보통 채용서버는 HR시스템과 별개로 두기 때문

-- # 채용서버 테스트용 유저생성
-- 1. CREATE TS
CREATE TABLESPACE TS_HUNELHTMLEHR_RET DATAFILE 'D:\oracle\ORADATA\ORCL\HUNELHTMLEHR_RET.DBF' SIZE 100M AUTOEXTEND ON ;

-- 2. CREATE USER
CREATE USER "HUNELHTMLEHR_RET"
IDENTIFIED BY "HUNEL!STANDARD"
DEFAULT TABLESPACE TS_HUNELHTMLEHR_RET
TEMPORARY TABLESPACE TEMP;

-- 3. GRANT USER
GRANT DBA TO HUNELHTMLEHR_RET;

-- 4. IMPDP
-- IMPDP HUNELHTMLEHR_RET/HUNEL!STANDARD DUMPFILE=HUNELHTMLEHR_RET.DMP DIRECTORY=DATA_PUMP_DIR REMAP_SCHEMA=DEMO_REEHR:HUNELHTMLEHR_RET REMAP_TABLESPACE=TS_DEMO_REEHR:TS_HUNELHTMLEHR_RET

-- 5. key.properties or license.dat 파일을 위한 디렉토리를 생성
-- 오라클 홈 디렉토리 아래에 HCG_PKG_DIR 폴더를 만들고 HCG_PKG_DIR 폴더 아래에 유저명으로 폴더를 만듭니다.  
-- D:\app\user\product\11.2.0\dbhome_1\HCG_PKG_DIR\HUNELHTMLEHR_RET
CREATE DIRECTORY DIR_HUNELHTMLEHR_RET AS 'D:\oracle\product\11.2.0\dbhome_1\HCG_PKG_DIR\HUNELHTMLEHR_RET';
GRANT READ ON DIRECTORY DIR_HUNELHTMLEHR_RET TO HUNELHTMLEHR_RET;

-- 5-1. 다음 위치에 key.properties 또는 license.dat 파일을 복사합니다.
-- 위치 : 오라클홈/HCG_PKG_DIR/유저명

-- 6. DB 권한 부여
GRANT EXECUTE ON DBMS_CRYPTO TO HUNELHTMLEHR_RET;
EXEC dbms_java.grant_permission('HUNELHTMLEHR_RET', 'SYS:java.io.FilePermission', 'D:\oracle\product\11.2.0\dbhome_1\HCG_PKG_DIR\HUNELHTMLEHR_RET', 'read');
EXEC dbms_java.grant_permission('HUNELHTMLEHR_RET', 'SYS:java.security.SecurityPermission', 'putProviderProperty.BC', '' );
EXEC dbms_java.grant_permission('HUNELHTMLEHR_RET', 'SYS:java.security.SecurityPermission', 'insertProvider.BC', '' ); 

-- 7. JAVA CLASS 등록
-- 토드에서 컴파일 안된거 Drop 후
-- dropjava -u HUNELHTMLEHR_RET/HUNEL!STANDARD@localhost:1521:ORCL -v -r -t *.*
-- loadjava -u HUNELHTMLEHR_RET/HUNEL!STANDARD@localhost:1521:ORCL -v -r -t D:\EHR_PROJECT\HUNEL_EHRS_WEB\db\loadjava\*.*

-- 9. DB Package Compile
-- - 먼저 PKG_CRYPTO_CORE.PKS, PKG_CRYPTO_CORE.PKB 파일을 컴파일합니다.
-- - PKG_CRYPTO.PKS, PKG_CRYPTO.PKB 파일을 컴파일합니다.
-- - 권한이 없으면 컴파일시에 오류가 발생하게 됩니다.(9.1을 참고하여 권한부여)
-- - PKG_CRYPTO_CORE.PKG 는 암호화되어 있으므로 수정할 수 없습니다.
-- - 패키지 자체 암복호화 모듈을 안쓴다면 PKG_CRYPTO.PKG 의 F_SET_ENC_DATA, F_GET_DEC_DATA 를 상황에 맞게 수정해야 합니다.

