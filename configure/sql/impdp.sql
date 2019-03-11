-- # HUNELSTANDARD ��������

-- 0. READY
--sys�� system���� �����Ͽ�

--select sid,serial#,username,status from v$session where schemaname = '����ڸ�(�빮��)';

--select sid,serial#,username,status from v$session where schemaname = 'TESTUSER';

--�������
--       SID    SERIAL# USERNAME                       STATUS
------------ ---------- ------------------------------ --------
--        21       1486 TESTUSER                         INACTIVE
--�ΰ��
-- alter system kill session 'SID,SERIAL#';
-- alter system kill session '21,1486';
--���� ������ �����Ŀ�
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
--CMD �Է� : IMPDP HUNELSTANDARD/HUNEL!STANDARD DUMPFILE=HUNELSTANDARD_20190227.DMP DIRECTORY=DATA_PUMP_DIR REMAP_SCHEMA=HUNELSTANDARD:HUNELSTANDARD REMAP_TABLESPACE=TS_ASIS:TS_TOBE;
--IMPDP HUNELSTANDARD/HUNEL!STANDARD DUMPFILE=HUNELSTANDARD_20190227.DMP DIRECTORY=DATA_PUMP_DIR REMAP_SCHEMA=ASIS:TOBE REMAP_TABLESPACE=TS_ASIS:TS_TOBE
--(������ ������ HUNELSTANDARD, ���̺����̽��� TS_HUNELSTANDARD�� �����˴ϴ�)

-- 5. �Ϻ�ȣȭ�� ���� Ű ���� : ȸ�� ���̼��� �Ʒ��� ���� key.properties or license.dat ������ ���� ���丮�� ����
-- ����Ŭ Ȩ ���丮 �Ʒ��� HCG_PKG_DIR ������ ����� HCG_PKG_DIR ���� �Ʒ��� ���������� ������ ����ϴ�.  
-- D:\app\user\product\11.2.0\dbhome_1\HCG_PKG_DIR\HUNELSTANDARD
-- �������� DB�� �����ؾ��ϴ� ��� HCG_PKG_DIR �Ʒ��� ������ ������ ����, �� �Ʒ��� �޳ڽ��ٴٵ带 ����
CREATE DIRECTORY DIR_HUNELSTANDARD AS 'D:\oracle\product\11.2.0\dbhome_1\HCG_PKG_DIR\HUNELSTANDARD';
GRANT READ ON DIRECTORY DIR_HUNELSTANDARD TO HUNELSTANDARD;

-- 5-1. ���� ��ġ�� key.properties �Ǵ� license.dat ������ �����մϴ�.
-- ��ġ : ����ŬȨ/HCG_PKG_DIR/������

-- 6. DB ���� �ο�
GRANT EXECUTE ON DBMS_CRYPTO TO HUNELSTANDARD;
EXEC dbms_java.grant_permission('HUNELSTANDARD', 'SYS:java.io.FilePermission', 'D:\oracle\product\11.2.0\dbhome_1\HCG_PKG_DIR\HUNELSTANDARD\license.dat', 'read');
EXEC dbms_java.grant_permission('HUNELSTANDARD', 'SYS:java.security.SecurityPermission', 'putProviderProperty.BC', '' );
EXEC dbms_java.grant_permission('HUNELSTANDARD', 'SYS:java.security.SecurityPermission', 'insertProvider.BC', '' ); 

-- 7. JAVA CLASS ���
-- ��忡�� ������ �ȵȰ� Drop ��
-- dropjava -u HUNELSTANDARD/HUNEL!STANDARD@localhost:1521:ORCL -v -r -t *.*
-- loadjava -u HUNELSTANDARD/HUNEL!STANDARD@localhost:1521:ORCL -v -r -t C:\EHR_PROJECT\HUNEL_EHRS_WEB_STAND\db\loadjava\*.*

-- 9. DB Package Compile
-- - ���� PKG_CRYPTO_CORE.PKS, PKG_CRYPTO_CORE.PKB ������ �������մϴ�.
-- - PKG_CRYPTO.PKS, PKG_CRYPTO.PKB ������ �������մϴ�.
-- - ������ ������ �����Ͻÿ� ������ �߻��ϰ� �˴ϴ�.
-- - PKG_CRYPTO_CORE.PKG �� ��ȣȭ�Ǿ� �����Ƿ� ������ �� �����ϴ�.
-- - ��Ű�� ��ü �Ϻ�ȣȭ ����� �Ⱦ��ٸ� PKG_CRYPTO.PKG �� F_SET_ENC_DATA, F_GET_DEC_DATA �� ��Ȳ�� �°� �����ؾ� �մϴ�.

-- 10. RET ���Ѻο�(RET ���� ���� ��)
SELECT 'GRANT DELETE, INSERT, SELECT, UPDATE ON ' || :RET_USER || '.' || T1.TABLE_NAME || ' TO ' || :USER_NAME || ';'
  FROM ALL_TABLES T1
 WHERE T1.OWNER = :RET_USER
;

-- 11. VIEW COMPILE

-- 12. SUPER �н����� ����
UPDATE HUNELSTANDARD.SY4100 
SET PWD = HUNELSTANDARD.PKG_CRYPTO.F_SET_ENC_SHA('1')
  , PWD_MOD_YMDHMS = SYSTIMESTAMP
  , ERR_CNT = 0 
WHERE USER_ID = 'SUPER';

UPDATE HUNELSTANDARD.RE4010 SET PWD = PKG_CRYPTO.F_SET_ENC_SHA('1') WHERE MAIL = '1@e-hcg.com';
UPDATE REEHR.RE4010 SET PWD = PKG_CRYPTO.F_SET_ENC_SHA('1') WHERE MAIL = '1@e-hcg.com';

-- 13. web.xml �����ϱ�
-- ��Ĺ 6�� ��� <dispatcher>REQUEST</dispatcher> , <dispatcher>FORWARD</dispatcher> �±װ� �ּ�ó�� �Ǿ����� ��� �����߻��ϹǷ� Ȯ�ο���, (���콺 ���߼��� �ҽ� �������� ��� �ּ�ó���Ǿ����� �� ����)




-- # RET ��������

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




-- # ä�뼭�� ��������
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

-- 5. key.properties or license.dat ������ ���� ���丮�� ����
-- ����Ŭ Ȩ ���丮 �Ʒ��� HCG_PKG_DIR ������ ����� HCG_PKG_DIR ���� �Ʒ��� ���������� ������ ����ϴ�.  
-- D:\app\user\product\11.2.0\dbhome_1\HCG_PKG_DIR\REEHR
CREATE DIRECTORY DIR_REEHR AS 'C:\app\HCG\product\11.2.0\dbhome_1\HCG_PKG_DIR\REEHR';
GRANT READ ON DIRECTORY DIR_REEHR TO REEHR;

-- 5-1. ���� ��ġ�� key.properties �Ǵ� license.dat ������ �����մϴ�.
-- ��ġ : ����ŬȨ/HCG_PKG_DIR/������

-- 6. DB ���� �ο�
GRANT EXECUTE ON DBMS_CRYPTO TO REEHR;
EXEC dbms_java.grant_permission('REEHR', 'SYS:java.io.FilePermission', 'C:\app\HCG\product\11.2.0\dbhome_1\HCG_PKG_DIR\REEHR', 'read');
EXEC dbms_java.grant_permission('REEHR', 'SYS:java.security.SecurityPermission', 'putProviderProperty.BC', '' );
EXEC dbms_java.grant_permission('REEHR', 'SYS:java.security.SecurityPermission', 'insertProvider.BC', '' ); 

-- 7. JAVA CLASS ���
-- ��忡�� ������ �ȵȰ� Drop ��
-- dropjava -u REEHR/HUNEL!STANDARD@localhost:1521:ORCL -v -r -t *.*
-- loadjava -u REEHR/HUNEL!STANDARD@localhost:1521:ORCL -v -r -t C:\EHR_PROJECT\HUNEL_RE_EHRS_WEB\db\loadjava\*.*

-- 9. DB Package Compile
-- - ���� PKG_CRYPTO_CORE.PKS, PKG_CRYPTO_CORE.PKB ������ �������մϴ�.
-- - PKG_CRYPTO.PKS, PKG_CRYPTO.PKB ������ �������մϴ�.
-- - ������ ������ �����Ͻÿ� ������ �߻��ϰ� �˴ϴ�.(9.1�� �����Ͽ� ���Ѻο�)
-- - PKG_CRYPTO_CORE.PKG �� ��ȣȭ�Ǿ� �����Ƿ� ������ �� �����ϴ�.
-- - ��Ű�� ��ü �Ϻ�ȣȭ ����� �Ⱦ��ٸ� PKG_CRYPTO.PKG �� F_SET_ENC_DATA, F_GET_DEC_DATA �� ��Ȳ�� �°� �����ؾ� �մϴ�.

