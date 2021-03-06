-- 박대리(02096)와 같은 조직에 속하는 사원들의 근무연수, 근무월수, 근무일수를 조회 하시오(근무 기간 계산시 소수점 이하 버림).
-- 재직자는 현재일까지의 근무기간 조회( 입사일 - 현재일 )
-- 퇴직자는 퇴직일까지의 근무기간 조회( 입사일 - 퇴직일 )
-- 조회 컬럼 : 사번(C_CD), 성명(EMP_NM), 입사일(ENTER_YMD), 퇴사일(RETIRE_YMD), 근무년수, 근무월수, 근무일수
SELECT T1.C_CD AS 사번
      ,T1.EMP_NM AS 성명
      ,T2.ORG_ID
      ,T1.ENTER_YMD AS 입사일
      ,(CASE WHEN T1.RETIRE_YMD IS NULL THEN '재직중' ELSE T1.RETIRE_YMD END) AS 퇴사일
      ,TRUNC(CASE WHEN T1.RETIRE_YMD IS NULL THEN (TO_DATE(TO_CHAR(SYSDATE, 'YYYYMMDD')) - TO_DATE(T1.ENTER_YMD, 'YYYYMMDD')) / 365.254 ELSE (TO_DATE(T1.RETIRE_YMD, 'YYYYMMDD') - TO_DATE(T1.ENTER_YMD, 'YYYYMMDD')) / 365.254 END) AS 근무년수
      ,TRUNC(CASE WHEN T1.RETIRE_YMD IS NULL THEN (MONTHS_BETWEEN(TO_DATE(TO_CHAR(SYSDATE, 'YYYYMMDD')), TO_DATE(T1.ENTER_YMD, 'YYYYMMDD'))) ELSE (MONTHS_BETWEEN(TO_DATE(T1.RETIRE_YMD, 'YYYYMMDD'), TO_DATE(T1.ENTER_YMD, 'YYYYMMDD'))) END)
           AS 근무월수
      ,(CASE WHEN T1.RETIRE_YMD IS NULL THEN (TO_DATE(TO_CHAR(SYSDATE, 'YYYYMMDD')) - TO_DATE(ENTER_YMD, 'YYYYMMDD')) ELSE (TO_DATE(T1.RETIRE_YMD, 'YYYYMMDD') - TO_DATE(T1.ENTER_YMD, 'YYYYMMDD')) END) AS 근무일수
  FROM PA1010 T1
      ,PA1020 T2
 WHERE T1.C_CD = T2.C_CD
       AND T2.LAST_YN = 'Y'
       AND T2.EMP_ID = T1.EMP_ID
       AND (T2.ORG_ID, T1.C_CD) IN (SELECT T2.ORG_ID
                                          ,T1.C_CD
                                      FROM PA1010 T1
                                          ,PA1020 T2
                                     WHERE T1.C_CD = T2.C_CD)
       AND T2.ORG_ID IN (SELECT T2.ORG_ID
                           FROM PA1010 T1
                               ,PA1020 T2
                          WHERE T2.C_CD = T1.C_CD AND T2.EMP_ID = T1.EMP_ID AND TO_CHAR(SYSDATE, 'YYYYMMDD') BETWEEN T2.STA_YMD AND T2.END_YMD AND T2.LAST_YN = 'Y' AND T1.EMP_ID = '02096')
       AND TO_CHAR(SYSDATE, 'YYYYMMDD') BETWEEN T2.STA_YMD AND T2.END_YMD;

-- ----------------------------------------------------------------------------------

-- 실습 1
-- 박대리의 입사동기들의 인사정보를 조회
-- 사용테이블 : PA1010 (인사마스터)
--                 PA1020 (발령정보)
--              -> 현재시점의 발령정보중 최종여부가 Y 인 항목

SELECT T1.EMP_ID
         ,T1.EMP_NM
         ,T1.ENTER_YMD
        ,T2.ORG_NM
  FROM PA1010 T1 --인사마스터
          ,PA1020 T2  --발령정보
  WHERE T2.C_CD = T1.C_CD
    AND T2.EMP_ID = T1.EMP_ID
   -- 키값으로 조인
    AND TO_CHAR(SYSDATE,'YYYYMMDD') BETWEEN T2.STA_YMD AND T2.END_YMD
  -- 현재시점의 데이터를 가져오기 위한 조건절
    AND T2.LAST_YN = 'Y'  -- 최종여부

    AND (T1.ENTER_YMD, T2.ORG_ID)  IN (    -- 박대리의 입사일을 조회
                                      SELECT T1.ENTER_YMD, T2.ORG_ID
                                        FROM PA1010 T1 , PA1020 T2
                                       WHERE T2.C_CD = T1.C_CD
                                           AND T2.EMP_ID = T1.EMP_ID
                                           AND TO_CHAR(SYSDATE,'YYYYMMDD') BETWEEN T2.STA_YMD AND T2.END_YMD
                                           AND T2.LAST_YN ='Y'
                                           AND T1.EMP_ID ='02096' );

-- ----------------------------------------------------------------------------------

-- 아웃조인 사용
-- 성명 : 테스트임원 , 사번 : 200000, 제대일 조회

SELECT T1.EMP_ID
         ,T1.EMP_NM
         ,T2.STA_YMD  --입대일
         ,T2.END_YMD  --제대일
  FROM PA1010 T1  --인사마스터
          ,PA2070 T2 --병역정보
 WHERE T1.EMP_ID= '200000'
    --  OUT JOIN
      AND T2.C_CD(+) = T1.C_CD
      AND T2.EMP_ID(+) = T1.EMP_ID

-- ----------------------------------------------------------------------------------

-- 함수 사용
-- 성명 (인사마스터)

 SELECT T1.EMP_ID
          ,T1.ORG_NM
          ,F_GET_EMPNM(T1.C_CD, T1.EMP_ID) AS EMP_NM
          ,(SELECT EMP_NM
                FROM PA1010
               WHERE C_CD = T1.C_CD
                 AND EMP_ID = T1.EMP_ID
            ) AS EMP_NM2
    FROM PA1020 T1
  WHERE T1.EMP_ID = '02096'
     AND TO_CHAR(SYSDATE,'YYYYMMDD') BETWEEN T1.STA_YMD AND T1.END_YMD
     AND T1.LAST_YN = 'Y'

-- ----------------------------------------------------------------------------------

-- 실습 2

SELECT T1.C_CD
          , T1.EMP_ID
          ,T1.EMP_NM
           ,T3.MON
          /*  ,(SELECT MON
                 FROM PY2010 --급여정보
                WHERE PAYITEM = 'P010'
                  AND C_CD = T1.C_CD
                  AND EMP_ID = T1.EMP_ID
                  AND TO_CHAR(SYSDATE,'YYYYMMDD') BETWEEN  STA_YMD AND END_YMD
            ) MON  */
  FROM PA1010 T1 --인사마스터
          ,PA1020 T2  --발령정보
          ,PY2010 T3
  WHERE T2.C_CD = T1.C_CD
    AND T2.EMP_ID = T1.EMP_ID
   -- 키값으로 조인
    AND TO_CHAR(SYSDATE,'YYYYMMDD') BETWEEN T2.STA_YMD AND T2.END_YMD
  -- 현재시점의 데이터를 가져오기 위한 조건절
    AND T2.LAST_YN = 'Y'  -- 최종여부
    AND (T1.ENTER_YMD, T2.ORG_ID)  IN (    -- 박대리의 입사일을 조회
                                      SELECT T1.ENTER_YMD, T2.ORG_ID
                                        FROM PA1010 T1 , PA1020 T2
                                       WHERE T2.C_CD = T1.C_CD
                                           AND T2.EMP_ID = T1.EMP_ID
                                           AND TO_CHAR(SYSDATE,'YYYYMMDD') BETWEEN T2.STA_YMD AND T2.END_YMD
                                           AND T2.LAST_YN ='Y'
                                           AND T1.EMP_ID ='02096' )
  AND T3.C_CD(+) = T1.C_CD
  AND T3.EMP_ID(+) = T1.EMP_ID
  AND T3.PAYITEM = 'P010'
   AND TO_CHAR(SYSDATE,'YYYYMMDD') BETWEEN T3.STA_YMD(+) AND T3.END_YMD(+)

-- ----------------------------------------------------------------------------------

-- 실습 3

SELECT T1.EMP_ID
         ,T1.EMP_NM
         ,SUM(CASE WHEN T3.PAYITEM_TYPE = '1' THEN T2.MON ELSE 0 END) AS  지급액
         ,SUM(CASE WHEN T3.PAYITEM_TYPE = '2' THEN T2.MON ELSE 0 END)  AS  공제액
  FROM PA1010 T1
        ,PY2010 T2
        ,PY0100 T3
  WHERE T1.EMP_ID = '02096'

    AND T2.C_CD = T1.C_CD
    AND T2.EMP_ID = T1.EMP_ID
    AND '20190315' BETWEEN T2.STA_YMD AND T2.END_YMD

    AND T3.C_CD = T2.C_CD
    AND T3.PAYITEM = T2.PAYITEM
    GROUP BY T1.EMP_ID, T1.EMP_NM

-- ----------------------------------------------------------------------------------

-- =====================================
-- 길수석님이 작성한 쿼리들
-- =====================================

SELECT T1.EMP_ID
        ,T1.EMP_NM
        ,T1.ENTER_YMD
        ,T2.ORG_NM
  FROM PA1010 T1
        ,PA1020 T2
  WHERE T2.C_CD = T1.C_CD
    AND T2.EMP_ID = T1.EMP_ID
    AND TO_CHAR(SYSDATE,'YYYYMMDD') BETWEEN T2.STA_YMD AND T2.END_YMD
    AND T2.LAST_YN = 'Y'

    AND T1.ENTER_YMD = (
                                      SELECT T1.ENTER_YMD
                                        FROM PA1010 T1
                                       WHERE T1.EMP_ID ='02096'
                                      )
;

SELECT T1.EMP_ID
          ,T1.EMP_NM
          ,T2.STA_YMD
          ,T2.END_YMD
  FROM PA1010 T1
         ,PA2070 T2
 WHERE T1.EMP_ID= '200000'
    -- 조인
      AND T2.C_CD(+) = T1.C_CD
      AND T2.EMP_ID(+) = T1.EMP_ID
;

SELECT T1.EMP_ID
         ,T1.EMP_NM
         ,T1.ENTER_YMD
        ,T2.ORG_NM
        ,(SELECT MON
             FROM PY2010
            WHERE C_CD = T1.C_CD
               AND EMP_ID = T1.EMP_ID
               AND TO_CHAR(SYSDATE,'YYYYMMDD') BETWEEN STA_YMD AND END_YMD
               AND PAYITEM = 'P010'
            ) AS MON
  FROM PA1010 T1 --인사마스터
         ,PA1020 T2  --발령정보
  WHERE T2.C_CD = T1.C_CD
    AND T2.EMP_ID = T1.EMP_ID
   -- 키값으로 조인
    AND TO_CHAR(SYSDATE,'YYYYMMDD') BETWEEN T2.STA_YMD AND T2.END_YMD
  -- 현재시점의 데이터를 가져오기 위한 조건절
    AND T2.LAST_YN = 'Y'  -- 최종여부

    AND ( T1.ENTER_YMD  , T2.ORG_ID ) IN
                                                          (    -- 박대리의 입사일을 조회
                                                              SELECT T1.ENTER_YMD, T2.ORG_ID
                                                                FROM PA1010 T1
                                                                      ,PA1020 T2
                                                               WHERE T1.EMP_ID ='02096'
                                                                 AND T2.C_CD = T1.C_CD
                                                                 AND T2.EMP_ID = T1.EMP_ID
                                                                  AND TO_CHAR(SYSDATE,'YYYYMMDD') BETWEEN T2.STA_YMD AND T2.END_YMD
                                                                  AND T2.LAST_YN = 'Y'
                                                        )
;

SELECT T1.C_CD
          , T1.EMP_ID
          ,T1.EMP_NM
          ,T1.ENTER_YMD
          ,T2.ORG_NM
          ,T3.MON
          /*
          ,(SELECT MON
                 FROM PY2010 --급여정보
                WHERE PAYITEM = 'P010'
                  AND C_CD = T1.C_CD
                  AND EMP_ID = T1.EMP_ID
                  AND TO_CHAR(SYSDATE,'YYYYMMDD') BETWEEN  STA_YMD AND END_YMD
            ) MON
    */
  FROM PA1010 T1 --인사마스터
          ,PA1020 T2  --발령정보
          ,PY2010 T3
  WHERE T2.C_CD = T1.C_CD
    AND T2.EMP_ID = T1.EMP_ID
   -- 키값으로 조인
    AND TO_CHAR(SYSDATE,'YYYYMMDD') BETWEEN T2.STA_YMD AND T2.END_YMD
  -- 현재시점의 데이터를 가져오기 위한 조건절
    AND T2.LAST_YN = 'Y'  -- 최종여부

    AND (T1.ENTER_YMD, T2.ORG_ID)  IN (    -- 박대리의 입사일을 조회
                                      SELECT T1.ENTER_YMD, T2.ORG_ID
                                        FROM PA1010 T1 , PA1020 T2
                                       WHERE T2.C_CD = T1.C_CD
                                           AND T2.EMP_ID = T1.EMP_ID
                                           AND TO_CHAR(SYSDATE,'YYYYMMDD') BETWEEN T2.STA_YMD AND T2.END_YMD
                                           AND T2.LAST_YN ='Y'
                                           AND T1.EMP_ID ='02096' )
  AND T3.C_CD(+) = T1.C_CD
  AND T3.EMP_ID(+) = T1.EMP_ID
  AND T3.PAYITEM = 'P010'
   AND TO_CHAR(SYSDATE,'YYYYMMDD') BETWEEN T3.STA_YMD(+) AND T3.END_YMD(+)
;


SELECT T1.EMP_ID
         ,T1.EMP_NM
         ,SUM(CASE WHEN T3.PAYITEM_TYPE = '1' THEN T2.MON ELSE 0 END) AS  지급액
         ,SUM(CASE WHEN T3.PAYITEM_TYPE = '2' THEN T2.MON ELSE 0 END)  AS  공제액
  FROM PA1010 T1
        ,PY2010 T2
        ,PY0100 T3
  WHERE T1.EMP_ID = '02096'

    AND T2.C_CD = T1.C_CD
    AND T2.EMP_ID = T1.EMP_ID
    AND '20190315' BETWEEN T2.STA_YMD AND T2.END_YMD

    AND T3.C_CD = T2.C_CD
    AND T3.PAYITEM = T2.PAYITEM
    GROUP BY T1.EMP_ID, T1.EMP_NM
;


SELECT T1.EMP_ID
         ,T1.EMP_NM
         ,(
           SELECT SUM(A.MON)
             FROM PY2010 A
                   ,PY0100 B
              WHERE B.C_cD = A.C_CD
              AND B.PAYITEM = A.PAYITEM
               AND '20190315' BETWEEN A.STA_YMD AND A.END_YMD
               AND B.PAYITEM_TYPE = '1'
               AND A.C_CD =  T1.C_CD
               AND A.EMP_ID = T1.EMP_ID
          ) AS 지급액
          ,(
          SELECT SUM(A.MON)
             FROM PY2010 A
                   ,PY0100 B
              WHERE B.C_cD = A.C_CD
              AND B.PAYITEM = A.PAYITEM
               AND '20190315' BETWEEN A.STA_YMD AND A.END_YMD
               AND B.PAYITEM_TYPE = '2'
               AND A.C_CD =  T1.C_CD
               AND A.EMP_ID = T1.EMP_ID

           ) 공제액
  FROM PA1010 T1
  WHERE T1.EMP_ID = '02096'
;