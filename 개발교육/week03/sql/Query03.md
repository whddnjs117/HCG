# Oracle SQL 연습

## 문제
> 박대리(02096)와 동기(입사일자 같은 사원을 동기로 가정)들의 명단을 홍길동,유관순,강감찬 과 같이 1개의 ROW로 , (콤마로 구분) 하여 성명을 나열하시오. 
- (다수 Row -> 1개 Row로 취합하는 작업이며, 여러 방법이 있는데 어느것을 써도 무방)

<br>

- 풀이
  ```sql
  SELECT LISTAGG(T1.EMP_NM, ', ') WITHIN GROUP (ORDER BY T1.EMP_ID) 이름
  FROM PA1010 T1, PA1020 T2
  WHERE T1.ENTER_YMD IN (
    SELECT A.ENTER_YMD
    FROM PA1010 A,
        PA1020 B
    WHERE TO_CHAR(SYSDATE, 'YYYYMMDD') BETWEEN B.STA_YMD AND B.END_YMD
      AND B.EMP_ID = A.EMP_ID
      AND A.EMP_ID = '02096'
      AND B.LAST_YN = 'Y'
  )
  AND T2.LAST_YN = 'Y'
  AND T1.EMP_ID = T2.EMP_ID
  AND TO_CHAR(SYSDATE,'YYYYMMDD') BETWEEN T2.STA_YMD AND T2.END_YMD;
  ```

<br>

> 박대리(02096)의 현재 직급명(대리), 직책명(팀원)을 F_GET_GLOBAL_CDNM 를 참고하여 SUB QUERY, Function을 사용하지 않고 JOIN 을 사용하여 조회하시오.
- 조건 1) 사번/성명/직급명/직책명 출력되도록 함
- [직급 : EMP_GRADE_CD, IDX_CD : '/SY03' ] , [직책 : DUTY_CD, IDX_CD = '/SY05' ]
- [LANG_TYPE : 'ko' ]
- 사용테이블 PA1020, SY5020, SY9820

<br>

- 함수
  ```sql
  CREATE FUNCTION "F_GET_GLOBAL_CDNM"(I_C_CD VARCHAR2,
                                      I_IDX_CD SY5020.IDX_CD%TYPE, -- 코드 인덱스
                                      I_CD SY5020.CD%TYPE, -- 세부 코드
                                      I_LANG_TYPE SY9820.LANG_TYPE%TYPE -- 언어코드
  )
    RETURN SY5020.CD_NM%TYPE
  IS
    V_CD_NM SY5020.CD_NM%TYPE;
  BEGIN

    SELECT NVL(MAX(T2.CD_NM), I_CD) INTO V_CD_NM
    FROM SY5020 T1,
        SY9820 T2
    WHERE T1.C_CD = I_C_CD
      AND T1.IDX_CD = I_IDX_CD
      AND T1.CD = I_CD
      AND T2.C_CD(+) = T1.C_CD
      AND T2.IDX_CD(+) = T1.IDX_CD
      AND T2.CD(+) = T1.CD
      AND T2.LANG_TYPE = I_LANG_TYPE;

    RETURN V_CD_NM;
  END;
  ```

<br>

- 함수를 사용한 풀이
  ```sql
  SELECT T1.EMP_ID
      , F_GET_GLOBAL_CDNM(T1.C_CD, '/SY03', T2.EMP_GRADE_CD, 'ko') "직급"
      , F_GET_GLOBAL_CDNM(T1.C_CD, '/SY05', T2.DUTY_CD, 'ko') "직책"
    FROM PA1010 T1
      , PA1020 T2
      , SY5020 T3,
        SY9820 T4
  WHERE T1.C_CD = :C_CD
    AND T1.EMP_ID = :EMP_ID
    AND T2.C_CD = T1.C_CD
    AND T2.EMP_ID = T1.EMP_ID
    AND T2.LAST_YN = 'Y'
    AND TO_CHAR(SYSDATE, 'YYYYMMDD') BETWEEN T2.STA_YMD AND T2.END_YMD;
  ```

- 풀이
  ```sql
  SELECT T2.EMP_ID 사번, T1.EMP_NM 성명, T2.EMP_GRADE_NM 직급명, T2.DUTY_NM 직책명
  FROM PA1010 T1,
      PA1020 T2,
      SY5020 T3,
      SY9820 T4
  WHERE T3.C_CD = T1.C_CD
    AND T4.C_CD(+) = T3.C_CD
    AND T2.C_CD = T3.C_CD
    ANd T1.EMP_ID = '02096'
    AND T2.EMP_ID = T1.EMP_ID
    AND T3.IDX_CD = '/SY03'
    AND T3.CD = T2.EMP_GRADE_CD
    AND T4.CD(+) = T3.CD
    AND T4.IDX_CD(+) = T3.IDX_CD
    AND T4.LANG_TYPE = 'ko'
    AND T2.STAT_CD LIKE '1%'
    AND T2.LAST_YN = 'Y'
    AND TO_CHAR(SYSDATE, 'YYYYMMDD') BETWEEN T2.STA_YMD AND T2.END_YMD;
  ```

<br>

> 유치원 지원금 대상자를 추출하시오.
- 조건
  - 만6세 (생년월일로 체크) 인 자녀에 대하여 지원
  - 자녀 1명당 유치원 지원금(50,000)을 지원
  - 최대 자녀 2명까지 지원
  - 재직자 대상(재직, 휴직)
- 출력 컬럼 : 사번/성명/금액합계

```sql
SELECT T3.EMP_ID, T1.EMP_NM, 50000 * (CASE WHEN count(*) > 2 then 2 else count(*) end) 금액합계
FROM PA1010 T1, PA2030 T3
WHERE TRUNC(MONTHS_BETWEEN(SYSDATE, TO_DATE(SUBSTR(T3.BIRTH_YMD, 1, 4), 'YYYY')) / 12) = 7
  AND (T3.FAM_CD = '20' OR T3.FAM_CD = '21')
AND T3.EMP_ID = T1.EMP_ID
AND T1.STAT_CD LIke '1%'
GROUP BY T3.EMP_ID, T1.EMP_NM
HAVING count(*) > 0;
```

<br>

[완성본](/sql/190307.sql)