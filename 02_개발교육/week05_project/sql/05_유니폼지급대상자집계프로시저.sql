DROP PROCEDURE P_PR_UNIF_TARG_CHEK;
-----------------------------------------------------------------------------
CREATE PROCEDURE "P_PR_UNIF_TARG_CHEK"(I_C_CD VARCHAR2,
                                       I_GIV_TRG_NM VARCHAR2,
                                       I_ORG_NM VARCHAR2,
                                       I_EMP_GRADE_CD VARCHAR2,
                                       I_GENDER_TYPE VARCHAR2,
                                       I_BATCH_TYPE VARCHAR2,
                                       I_ONLY_CHECK VARCHAR2)
IS

BEGIN

  DBMS_OUTPUT.PUT_LINE('임시테이블에 값 삽입');

  IF
    I_ONLY_CHECK = 'Y' THEN

    DBMS_OUTPUT.PUT_LINE('하위 조직 포함');

    INSERT INTO PR3210_TMP (C_CD, EMP_ID, GIV_STD_ID, ORG_ID, EMP_GRADE_CD)
    SELECT T1.C_CD,
          T1.EMP_ID,
          I_GIV_TRG_NM,
          T2.ORG_ID,
          T2.EMP_GRADE_CD
    FROM PA1010 T1,
        PA1020 T2
    WHERE T1.C_CD = I_C_CD
      AND T2.C_CD = T1.C_CD
      AND (I_ORG_NM IS NULL OR T2.ORG_NM = I_ORG_NM)
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
                          AND (I_ORG_NM IS NULL OR ORG_NM = I_ORG_NM)
                        );
  
  ELSE

  DBMS_OUTPUT.PUT_LINE('하위 조직 미포함');

    INSERT INTO PR3210_TMP (C_CD, EMP_ID, GIV_STD_ID, ORG_ID, EMP_GRADE_CD)
    SELECT T1.C_CD,
          T1.EMP_ID,
          I_GIV_TRG_NM,
          T2.ORG_ID,
          T2.EMP_GRADE_CD
    FROM PA1010 T1,
        PA1020 T2
    WHERE T1.C_CD = I_C_CD
      AND T2.C_CD = T1.C_CD
      AND (I_ORG_NM IS NULL OR T2.ORG_NM = I_ORG_NM)
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
                          AND (I_ORG_NM IS NULL OR ORG_NM = I_ORG_NM)
                        );
  END IF;

  IF
    I_BATCH_TYPE = 'NEW' THEN

    DELETE FROM PR3210;

    DBMS_OUTPUT.PUT_LINE('PR3210 테이블에 값 새로 삽입');

    INSERT INTO PR3210(C_CD, EMP_ID, GIV_STD_ID, EMP_NM, GENDER_TYPE, ORG_ID, ORG_NM, EMP_GRADE_CD, APPL_ID)
    SELECT T3.C_CD,
           T3.EMP_ID,
           T3.GIV_STD_ID,
           T1.EMP_NM,
           T1.GENDER_TYPE,
           T3.ORG_ID,
           T2.ORG_NM,
           T3.EMP_GRADE_CD,
           NULL
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
             A.EMP_NM,
             A.GENDER_TYPE,
             C.ORG_ID,
             B.ORG_NM,
             C.EMP_GRADE_CD,
             NULL
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
          T1.EMP_NM       = T2.EMP_NM,
          T1.GENDER_TYPE  = T2.GENDER_TYPE,
          T1.ORG_ID       = T2.ORG_ID,
          T1.ORG_NM       = T2.ORG_NM,
          T1.EMP_GRADE_CD = T2.EMP_GRADE_CD,
          T1.APPL_ID      = NULL

    WHEN NOT MATCHED THEN
      INSERT (T1.C_CD,
              T1.EMP_ID,
              T1.GIV_STD_ID,
              T1.EMP_NM,
              T1.GENDER_TYPE,
              T1.ORG_ID,
              T1.ORG_NM,
              T1.EMP_GRADE_CD,
              T1.APPL_ID)
      VALUES (T2.C_CD,
              T2.EMP_ID,
              T2.GIV_STD_ID,
              T2.EMP_NM,
              T2.GENDER_TYPE,
              T2.ORG_ID,
              T2.ORG_NM,
              T2.EMP_GRADE_CD,
              NULL);

    DBMS_OUTPUT.PUT_LINE('PR3210 테이블에 값 추가 완료');

  END IF;

END;