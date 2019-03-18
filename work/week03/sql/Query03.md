# Oracle SQL 연습

## 문제
> 박대리(02096)의 입사동기 중 현재 같은 조직에서 근무하는 직원들의 기본급을 조회하시오. 
- 참조 테이블 및 컬럼
  - PA1010(인사마스터)
    - ENTER_YMD(입사일)
  - PA1020 (발령이력)
    - ORG_ID(조직ID)
  - PY2010 (급여)
    - PAYITEM = ‘P010’
- 출력 컬럼
  - 사번, 성명, 입사일, 부서명, 기본급

```sql
SELECT T1.C_CD
      ,T1.EMP_ID
      ,T1.EMP_NM
      ,T3.MON
                            /* ,(SELECT MON
                                FROM PY2010 --급여정보
                                WHERE PAYITEM = 'P010'
                                AND C_CD = T1.C_CD
                                AND EMP_ID = T1.EMP_ID
                                AND TO_CHAR(SYSDATE,'YYYYMMDD') BETWEEN  STA_YMD AND END_YMD
                            ) MON */
  FROM PA1010 T1            --인사마스터
      ,PA1020 T2          --발령정보
      ,PY2010 T3
  WHERE T2.C_CD = T1.C_CD
    AND T2.EMP_ID = T1.EMP_ID
                            -- 키값으로 조인
    AND TO_CHAR(SYSDATE,'YYYYMMDD') BETWEEN T2.STA_YMD AND T2.END_YMD
                            -- 현재시점의 데이터를 가져오기 위한 조건절
    AND T2.LAST_YN = 'Y'    -- 최종여부
                            -- 박대리의 입사일을 조회
    AND (T1.ENTER_YMD, T2.ORG_ID)  IN (    
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
  AND TO_CHAR(SYSDATE,'YYYYMMDD') BETWEEN T3.STA_YMD(+) AND T3.END_YMD(+);
```

<br>

> 박대리(02096)의 3/15 급여 지급액 합산금액과 공제금액 합산금액을 조회하시오.
- 참조 테이블 및 컬럼
  - PY2010(급여)
    - ENTER_YMD(입사일)
  - PY0100 (급여항목)
    - PAYITEM_TYPE(지급/공제유형, 1:지급, 2:공제)
- 출력 컬럼
  - 사번, 성명, 지급액, 공제액


```sql
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
```

<br>

> 박대리(02096)와 같은 조직에 속하는 사원들의 근무연수, 근무월수, 근무일수를 조회 하시오.
- 조건
  - 근무 기간 계산시 소수점 이하 버림
  - 재직자는 현재일까지의 근무기간 조회 
  - 퇴직자는 퇴직일까지의 근무기간 조회
- 출력 컬럼 : 사번, 성명, 입사일, 퇴사일, 근무년수, 근무월수, 근무일수

```sql
SELECT T1.C_CD AS 사번
      ,T1.EMP_NM AS 성명
      ,T2.ORG_ID
      ,T1.ENTER_YMD AS 입사일
      ,(CASE WHEN T1.RETIRE_YMD IS NULL THEN '재직중' ELSE T1.RETIRE_YMD END) AS 퇴사일
      ,ROUND(CASE WHEN T1.RETIRE_YMD IS NULL THEN (TO_DATE(TO_CHAR(SYSDATE, 'YYYYMMDD')) - TO_DATE(T1.ENTER_YMD, 'YYYYMMDD')) / 365.254 ELSE (TO_DATE(T1.RETIRE_YMD, 'YYYYMMDD') - TO_DATE(T1.ENTER_YMD, 'YYYYMMDD')) / 365.254 END) AS 근무년수
      ,ROUND(CASE WHEN T1.RETIRE_YMD IS NULL THEN (MONTHS_BETWEEN(TO_DATE(TO_CHAR(SYSDATE, 'YYYYMMDD')), TO_DATE(T1.ENTER_YMD, 'YYYYMMDD'))) ELSE (MONTHS_BETWEEN(TO_DATE(T1.RETIRE_YMD, 'YYYYMMDD'), TO_DATE(T1.ENTER_YMD, 'YYYYMMDD'))) END)
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
```

<br>

[완성본](/sql/190307.sql)