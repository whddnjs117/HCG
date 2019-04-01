create PROCEDURE              "P_PM2_PPR_EVU"
(
    I_C_CD        IN     VARCHAR2
   ,I_EVU_STD_ID  IN     VARCHAR2
   ,I_EMP_EVU_NO  IN     VARCHAR2 -- 사원평가번호
   ,I_LANG_TYPE   IN     VARCHAR2 -- 언어타입
   ,I_MOD_USER_ID IN     VARCHAR2
   ,O_ERRORCODE      OUT VARCHAR2 --결과코드
   ,O_ERRORMESG      OUT VARCHAR2 --결과메시지
)
IS
    /***********************************************************************
     Program Name   : P_PM2_PPR_EVU
     Description    : 평가준비
     Author         : 이길환
     History        : 2015-07-10
    ***********************************************************************/
    V_EVU_TYPE          VARCHAR2(20); -- 평가유형
BEGIN
    O_ERRORCODE      := '0';

    -- 평가유형조회
    SELECT T1.EVU_TYPE
      INTO V_EVU_TYPE
      FROM PM5010 T1
     WHERE 1 = 1 AND T1.C_CD = I_C_CD AND T1.EVU_STD_ID = I_EVU_STD_ID;

    -- 대상자 생성
    DELETE TMP_TAB10;

    -- 기생성자자는 제외
    INSERT INTO TMP_TAB10
                (
                    COL1 -- C_CD
                   ,COL2 -- EVU_STD_ID
                   ,COL3 -- EMP_EVU_NO
                   ,COL4 -- 평가 초기상태
                   ,COL5
                   ,COL6 -- 목표합의 대상여부
                   ,COL7 -- 중간정검 대상여부
                   ,COL8 -- 평가준비 대상여부
                )
          SELECT MAX(T1.C_CD)
                ,MAX(T1.EVU_STD_ID)
                ,T1.EMP_EVU_NO
                ,'C' || MIN(T2.ORDER_NO)
                ,MAX(T1.EVU_STAT_CD)
                ,NVL2(MIN(T3.ORDER_NO), 'A', '')
                ,NVL2(MIN(T4.ORDER_NO), 'D', '')
                ,CASE WHEN MIN(T3.ORDER_NO) IS NULL AND MIN(T4.ORDER_NO) IS NULL THEN 'Y' ELSE 'N' END -- 목표합의자, 중간정검자가 없으면 평가준비 대상자이다.
            FROM PM5210 T1
                ,PM5230 T2
                ,PM5230 T3
                ,PM5230 T4
           WHERE T1.C_CD = I_C_CD
                 AND T1.EVU_STD_ID = I_EVU_STD_ID
                 AND T1.TRG_YN = 'Y'
                 AND (I_EMP_EVU_NO IS NULL
                      OR T1.EMP_EVU_NO = I_EMP_EVU_NO)
                 AND T2.C_CD = T1.C_CD
                 AND T2.EVU_STD_ID = T1.EVU_STD_ID
                 AND T2.EMP_EVU_NO = T1.EMP_EVU_NO
                 AND T2.EVU_CLASS = '30'
                 AND T3.C_CD(+) = T1.C_CD
                 AND T3.EVU_STD_ID(+) = T1.EVU_STD_ID
                 AND T3.EMP_EVU_NO(+) = T1.EMP_EVU_NO
                 AND T3.EVU_CLASS(+) = '10'
                 AND T4.C_CD(+) = T1.C_CD
                 AND T4.EVU_STD_ID(+) = T1.EVU_STD_ID
                 AND T4.EMP_EVU_NO(+) = T1.EMP_EVU_NO
                 AND T4.EVU_CLASS(+) = '20'
        GROUP BY T1.EMP_EVU_NO;

    -- 목표합의, 중간정검단계가 완료 되었는지 확인
    UPDATE TMP_TAB10
       SET COL8              = 'Y'
     WHERE (COL1, COL2, COL3) IN (SELECT COL1
                                        ,COL2
                                        ,COL3
                                    FROM TMP_TAB10
                                   WHERE COL8 = 'N' AND COL5 = COALESCE(COL7, COL6) || 'E');

    -- 이전단계가 완료 안되었다면 평가준비대상자 제외
    DELETE TMP_TAB10
     WHERE COL8 = 'N';

    -- 평가준비여부 체크
    UPDATE PM5215
       SET EVU_PPR_YN        = 'Y'
     WHERE (C_CD, EVU_STD_ID, EMP_EVU_NO) IN (SELECT COL1
                                                    ,COL2
                                                    ,COL3
                                                FROM TMP_TAB10)
           AND EVU_CLASS = '30';

    -- 평가진행상태 업데이트
    MERGE INTO PM5210 T1
         USING (SELECT COL1 C_CD
                      ,COL2 EVU_STD_ID
                      ,COL3 EMP_EVU_NO
                      ,COL4 EVU_STAT_CD
                  FROM TMP_TAB10) T2
            ON (T1.C_CD = T2.C_CD AND T1.EVU_STD_ID = T2.EVU_STD_ID AND T1.EMP_EVU_NO = T2.EMP_EVU_NO)
    WHEN MATCHED THEN
        UPDATE SET T1.EVU_STAT_CD    = T2.EVU_STAT_CD;

    -- 목표설정이 존재하는 대상자는 제외
    DELETE TMP_TAB10
     WHERE (COL1, COL2, COL3) IN (SELECT T1.C_CD
                                        ,T1.EVU_STD_ID
                                        ,T1.EMP_EVU_NO
                                    FROM PM5250 T1
                                   WHERE T1.C_CD = I_C_CD
                                         AND T1.EVU_STD_ID = I_EVU_STD_ID
                                         AND (I_EMP_EVU_NO IS NULL
                                              OR T1.EMP_EVU_NO = I_EMP_EVU_NO));

    -- 목표이력번호 생성
    INSERT INTO PM5250
                (
                    C_CD
                   ,EVU_STD_ID
                   ,EMP_EVU_NO
                   ,GOAL_HIS_NO
                   ,LAST_YN
                   ,NOTE
                   ,INS_USER_ID
                   ,INS_YMDHMS
                   ,MOD_USER_ID
                   ,MOD_YMDHMS
                   ,INS_GYMDHMS
                   ,MOD_GYMDHMS
                )
        SELECT COL1
              ,COL2
              ,COL3
              ,1
              ,'Y'
              ,''
              ,I_MOD_USER_ID INS_USER_ID
              ,SYSTIMESTAMP INS_YMDHMS
              ,I_MOD_USER_ID MOD_USER_ID
              ,SYSTIMESTAMP MOD_YMDHMS
              ,CURRENT_TIMESTAMP INS_GYMDHMS
              ,CURRENT_TIMESTAMP MOD_GYMDHMS
          FROM TMP_TAB10;

    -- 고정항목 생성
    P_PM2_CRE_FIX_ITEM(I_C_CD, I_EVU_STD_ID, I_MOD_USER_ID, O_ERRORCODE, O_ERRORMESG);

    IF V_EVU_TYPE = 'CMP' THEN
        -- 역량항목 생성
        P_PM2_CRE_COMP_ITEM(I_C_CD
                           ,I_EVU_STD_ID
                           ,I_LANG_TYPE
                           ,I_MOD_USER_ID
                           ,O_ERRORCODE
                           ,O_ERRORMESG);
    ELSIF V_EVU_TYPE = 'MUL' THEN
        -- 다면평가주 평가상태 초기화
        UPDATE PM5230
           SET EVU_STAT_CD       = 'C1'
         WHERE (C_CD, EVU_STD_ID, EMP_EVU_NO) IN (SELECT COL1
                                                        ,COL2
                                                        ,COL3
                                                    FROM TMP_TAB10);

        -- 고정항목 생성
        P_PM2_CRE_MUL_ITEM(I_C_CD
                          ,I_EVU_STD_ID
                          ,I_LANG_TYPE
                          ,I_MOD_USER_ID
                          ,O_ERRORCODE
                          ,O_ERRORMESG);
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        O_ERRORCODE      := SQLCODE;
        O_ERRORMESG      := SQLERRM;
END;


/