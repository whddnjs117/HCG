SELECT T1.C_CD -- 회사코드
      ,T1.EMP_ID -- 사번
      ,F_GET_EMPNM( :C_CD, T1.EMP_ID) EMP_NM -- 사원명
      ,F_GET_GLOBAL_OBJNM( :C_CD, 'O', F_GET_GLOBAL_UP_ORGID_NM('10', T3.ORG_ID, '', TO_CHAR(SYSDATE, 'YYYYMMDD'), :LANG_TYPE), TO_CHAR(SYSDATE, 'YYYYMMDD'), :LANG_TYPE) UP_ORG_NM -- 상위조직
      , T3.ORG_ID -- 조직코드
      ,F_GET_GLOBAL_OBJNM( :C_CD, 'O', T3.ORG_ID, TO_CHAR(SYSDATE, 'YYYYMMDD'), :LANG_TYPE) ORG_NM -- 현재조직
      ,T3.EMP_GRADE_CD -- 직급코드
      ,F_GET_GLOBAL_CDNM( :C_CD, '/SY03', T3.EMP_GRADE_CD, :LANG_TYPE) EMP_GRADE_NM -- 직급
      ,T3.SAL_STEP_CD -- 호봉코드
      ,T3.SAL_STEP_NM -- 호봉
      ,T3.POST_CD -- 직위코드
      ,F_GET_GLOBAL_CDNM( :C_CD, '/SY04', T3.POST_CD, :LANG_TYPE) POST_NM -- 직위
      ,T3.DUTY_CD -- 직책코드
      ,F_GET_GLOBAL_CDNM( :C_CD, '/SY05', T3.DUTY_CD, :LANG_TYPE) DUTY_NM -- 직책
      ,T2.ENTER_YMD -- 입사일
      ,F_GET_YM_TERM_GLOBAL_NM(NULL, T2.ENTER_YMD, LEAST(TO_CHAR(SYSDATE, 'YYYYMMDD'), NVL(T2.RETIRE_YMD, '99991231')), :LANG_TYPE) SNRT_Y_CNT1 -- 근속년수(X년X월)
      ,F_CALC_TERM2('Y', T2.ENTER_YMD, LEAST(TO_CHAR(SYSDATE, 'YYYYMMDD'), NVL(T2.RETIRE_YMD, '99991231'))) || '년' SNRT_Y_CNT2 -- 근속년수(X)
      ,ROUND(F_CALC_TERM2('M', T2.ENTER_YMD, LEAST(TO_CHAR(SYSDATE, 'YYYYMMDD'), NVL(T2.RETIRE_YMD, '99991231'))), 1) || '개월' SNRT_Y_CNT3 -- 근속년수(X.XXX...)
      ,T2.PER_NO PER_NO -- 주민등록번호 암호화
      ,T2.PER_NO 주민등록번호 -- 주민등록번호 복호화
      ,T1.FIRST_RETRO_YMD -- 최초 소급일
  FROM PY1010 T1 -- 개인급여기본 테이블
      ,VR_PA1010 T2
      ,(SELECT T1.C_CD
              ,T1.EMP_ID
              ,T2.ORG_ID
              ,T2.EMP_GRADE_CD
              ,T2.POST_CD
              ,T2.DUTY_CD
              ,T2.SAL_STEP_CD
              ,T2.SAL_STEP_NM
          FROM VR_PA1010 T1
              ,PA1020 T2
         WHERE 1 = 1
               AND T1.C_CD = :C_CD
               AND T1.STAT_CD LIKE '1%'
               AND T2.C_CD = T1.C_CD
               AND T2.EMP_ID = T1.EMP_ID
               AND TO_CHAR(SYSDATE, 'YYYYMMDD') BETWEEN T2.STA_YMD AND T2.END_YMD
               AND T2.LAST_YN = 'Y') T3
 WHERE 1 = 1
       AND T1.C_CD = :C_CD
       AND T2.C_CD = T1.C_CD
       AND T2.EMP_ID = T1.EMP_ID
       AND T2.STAT_CD LIKE '1%'
       AND T3.C_CD = T1.C_CD
       AND T3.EMP_ID = T1.EMP_ID