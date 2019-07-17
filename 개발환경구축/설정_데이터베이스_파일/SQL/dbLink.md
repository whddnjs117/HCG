# Function
```sql
CREATE OR REPLACE FUNCTION "F_GET_TABLE_COMPARE_VALUE"
(
    I_TARGET_OWNER  VARCHAR2
   ,I_SOURCE_OWNER  VARCHAR2
)
    /***********************************************************************
     Program Name   : F_GET_TABLE_COMPARE_VALUE
     Description    : OWNER 별 소유 테이블명 비교 후 다른 테이블 정보 갯수 가져오기
     Author         : 소인성
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
/
```

# Procedure
```sql
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
```