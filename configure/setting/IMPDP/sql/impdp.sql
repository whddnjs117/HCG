-- # HUNELSTANDARD 유저생성

-- 0. READY
--sys나 system으로 접속하여

--select sid,serial#,username,status from v$session where schemaname = '사용자명(대문자)';

--select sid,serial#,username,status from v$session where schemaname = 'TESTUSER';

--결과값이
--       SID    SERIAL# USERNAME                       STATUS
------------ ---------- ------------------------------ --------
--        21       1486 TESTUSER                         INACTIVE
--인경우
-- alter system kill session 'SID,SERIAL#';
-- alter system kill session '21,1486';
--으로 세션을 죽인후에
-- drop user testuser cascade;


--DROP USER "HUNELSTANDARD" CASCADE;

-- 1. CREATE TableSpace
CREATE TABLESPACE TS_HUNELSTANDARD DATAFILE 'D:\oracle\oradata\orcl\HUNELSTANDARD.DBF' SIZE 100M AUTOEXTEND ON;

-- 2. CREATE USER
CREATE USER "HUNELSTANDARD"
IDENTIFIED BY "HUNEL!STANDARD"
DEFAULT TABLESPACE TS_HUNELSTANDARD
TEMPORARY TABLESPACE TEMP;

-- 3. GRANT USER
GRANT DBA TO HUNELSTANDARD;

-- 4. IMPDP
--CMD 입력 : IMPDP HUNELSTANDARD/HUNEL!STANDARD DUMPFILE=HUNELSTANDARD_20190227.DMP DIRECTORY=DATA_PUMP_DIR REMAP_SCHEMA=HUNELSTANDARD:HUNELSTANDARD REMAP_TABLESPACE=TS_ASIS:TS_TOBE;
--IMPDP HUNELSTANDARD/HUNEL!STANDARD DUMPFILE=HUNELSTANDARD_20190227.DMP DIRECTORY=DATA_PUMP_DIR REMAP_SCHEMA=ASIS:TOBE REMAP_TABLESPACE=TS_ASIS:TS_TOBE
--(배포시 유저명 HUNELSTANDARD, 테이블스페이스명 TS_HUNELSTANDARD로 배포됩니다)

-- 5. 암복호화를 위한 키 매핑 : 회사 라이센스 아래에 있음 key.properties or license.dat 파일을 위한 디렉토리를 생성
-- 오라클 홈 디렉토리 아래에 HCG_PKG_DIR 폴더를 만들고 HCG_PKG_DIR 폴더 아래에 유저명으로 폴더를 만듭니다.  
-- D:\app\user\product\11.2.0\dbhome_1\HCG_PKG_DIR\HUNELSTANDARD
-- 여러개의 DB를 구축해야하는 경우 HCG_PKG_DIR 아래에 유저명 폴더를 생성, 그 아래에 휴넬스텐다드를 넣음
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
-- loadjava -u HUNELSTANDARD/HUNEL!STANDARD@localhost:1521:ORCL -v -r -t C:\EHR_PROJECT\HUNEL_EHRS_WEB_STAND\db\loadjava\*.*

-- 9. DB Package Compile
-- - 먼저 PKG_CRYPTO_CORE.PKS, PKG_CRYPTO_CORE.PKB 파일을 컴파일합니다.
-- - PKG_CRYPTO.PKS, PKG_CRYPTO.PKB 파일을 컴파일합니다.
-- - 권한이 없으면 컴파일시에 오류가 발생하게 됩니다.
-- - PKG_CRYPTO_CORE.PKG 는 암호화되어 있으므로 수정할 수 없습니다.
-- - 패키지 자체 암복호화 모듈을 안쓴다면 PKG_CRYPTO.PKG 의 F_SET_ENC_DATA, F_GET_DEC_DATA 를 상황에 맞게 수정해야 합니다.

-- 10. RET 권한부여(RET 유저 생성 후)
SELECT 'GRANT DELETE, INSERT, SELECT, UPDATE ON ' || :RET_USER || '.' || T1.TABLE_NAME || ' TO ' || :USER_NAME || ';'
  FROM ALL_TABLES T1
 WHERE T1.OWNER = :RET_USER
;

-- 11. VIEW COMPILE

-- 12. SUPER 패스워드 변경
UPDATE HUNELSTANDARD.SY4100 
SET PWD = HUNELSTANDARD.PKG_CRYPTO.F_SET_ENC_SHA('1')
  , PWD_MOD_YMDHMS = SYSTIMESTAMP
  , ERR_CNT = 0 
WHERE USER_ID = 'SUPER';

UPDATE HUNELSTANDARD.RE4010 SET PWD = PKG_CRYPTO.F_SET_ENC_SHA('1') WHERE MAIL = '1@e-hcg.com';
UPDATE REEHR.RE4010 SET PWD = PKG_CRYPTO.F_SET_ENC_SHA('1') WHERE MAIL = '1@e-hcg.com';

-- 13. web.xml 수정하기
-- 톰캣 6의 경우 <dispatcher>REQUEST</dispatcher> , <dispatcher>FORWARD</dispatcher> 태그가 주석처리 되어있을 경우 에러발생하므로 확인요함, (제우스 개발서버 소스 가져왔을 경우 주석처리되어있을 수 있음)




-- # RET 유저생성

DROP USER HUNELHTMLEHR_RET CASCADE;
-- 1. CREATE TS
CREATE TABLESPACE TS_HUNELHTMLEHR_RET DATAFILE 'D:\oracle\oradata\orcl\HUNELHTMLEHR_RET.DBF' SIZE 100M AUTOEXTEND ON ;

-- 2. CREATE USER
CREATE USER "HUNELHTMLEHR_RET"
IDENTIFIED BY "HUNEL!STANDARD"
DEFAULT TABLESPACE TS_HUNELHTMLEHR_RET
TEMPORARY TABLESPACE TEMP;

-- 3. GRANT USER
GRANT DBA TO HUNELHTMLEHR_RET;

-- 4. IMPDP
--IMPDP HUNELHTMLEHR_RET/HUNEL!STANDARD DUMPFILE=HUNELHTMLEHR_RET_20190201.DMP DIRECTORY=DATA_PUMP_DIR 




-- # 채용서버 유저생성
-- 1. CREATE TS
CREATE TABLESPACE TS_REEHR DATAFILE 'C:\app\HCG\ORADATA\ORCL\REEHR.DBF' SIZE 100M AUTOEXTEND ON ;

-- 2. CREATE USER
CREATE USER "REEHR"
IDENTIFIED BY "HUNEL!STANDARD"
DEFAULT TABLESPACE TS_REEHR
TEMPORARY TABLESPACE TEMP;

-- 3. GRANT USER
GRANT DBA TO REEHR;

-- 4. IMPDP
--IMPDP REEHR/HUNEL!STANDARD DUMPFILE=REEHR.DMP DIRECTORY=DATA_PUMP_DIR REMAP_SCHEMA=ASIS:TOBE REMAP_TABLESPACE=TS_ASIS:TS_TOBE

-- 5. key.properties or license.dat 파일을 위한 디렉토리를 생성
-- 오라클 홈 디렉토리 아래에 HCG_PKG_DIR 폴더를 만들고 HCG_PKG_DIR 폴더 아래에 유저명으로 폴더를 만듭니다.  
-- D:\app\user\product\11.2.0\dbhome_1\HCG_PKG_DIR\REEHR
CREATE DIRECTORY DIR_REEHR AS 'C:\app\HCG\product\11.2.0\dbhome_1\HCG_PKG_DIR\REEHR';
GRANT READ ON DIRECTORY DIR_REEHR TO REEHR;

-- 5-1. 다음 위치에 key.properties 또는 license.dat 파일을 복사합니다.
-- 위치 : 오라클홈/HCG_PKG_DIR/유저명

-- 6. DB 권한 부여
GRANT EXECUTE ON DBMS_CRYPTO TO REEHR;
EXEC dbms_java.grant_permission('REEHR', 'SYS:java.io.FilePermission', 'C:\app\HCG\product\11.2.0\dbhome_1\HCG_PKG_DIR\REEHR', 'read');
EXEC dbms_java.grant_permission('REEHR', 'SYS:java.security.SecurityPermission', 'putProviderProperty.BC', '' );
EXEC dbms_java.grant_permission('REEHR', 'SYS:java.security.SecurityPermission', 'insertProvider.BC', '' ); 

-- 7. JAVA CLASS 등록
-- 토드에서 컴파일 안된거 Drop 후
-- dropjava -u REEHR/HUNEL!STANDARD@localhost:1521:ORCL -v -r -t *.*
-- loadjava -u REEHR/HUNEL!STANDARD@localhost:1521:ORCL -v -r -t C:\EHR_PROJECT\HUNEL_RE_EHRS_WEB\db\loadjava\*.*

-- 9. DB Package Compile
-- - 먼저 PKG_CRYPTO_CORE.PKS, PKG_CRYPTO_CORE.PKB 파일을 컴파일합니다.
-- - PKG_CRYPTO.PKS, PKG_CRYPTO.PKB 파일을 컴파일합니다.
-- - 권한이 없으면 컴파일시에 오류가 발생하게 됩니다.(9.1을 참고하여 권한부여)
-- - PKG_CRYPTO_CORE.PKG 는 암호화되어 있으므로 수정할 수 없습니다.
-- - 패키지 자체 암복호화 모듈을 안쓴다면 PKG_CRYPTO.PKG 의 F_SET_ENC_DATA, F_GET_DEC_DATA 를 상황에 맞게 수정해야 합니다.

