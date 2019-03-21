SELECT T1.C_CD,
                       T1.USER_ID,
                       T1.USER_NM,
                       T1.EMP_ID,
                       T1.PWD,
                       T3.PER_NO,
                       T1.SUPER_YN,
                       CASE WHEN T1.USE_YN = 'Y' AND TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') BETWEEN NVL(T1.STA_YMD, '19000101') AND NVL(T1.END_YMD, '99991231') THEN 'Y' ELSE 'N' END USE_YN,
                       T1.PWD_MOD_YMDHMS,
                       T1.ERR_CNT,
                       TO_CHAR(T1.LAST_LOGIN_YMDHMS, 'YYYY-MM-DD HH24.MI.SS') LAST_LOGIN_YMDHMS,
                       T1.LAST_LOGIN_IP,
                       MONTHS_BETWEEN2(SYSDATE, T1.PWD_MOD_YMDHMS) PWD_CHG_MONTH,
                       T1.SKIN_CD,
                       T2.SAVING_TIME_YN,
                       :LANG_TYPE LANG_TYPE,
                       T2.BASE_LANGUAGE_CD,
                       T1.DMT_USE_YN DMT_USE_YN,
                       T1.AUTH_ADMIN_YN,
                       T2.COM_NTNL_CD,
                       T2.COM_NM,
                       CASE T2.TIMEZONESET_CLASS WHEN '20' THEN T6.TIME_ZONE_CD
                                                   WHEN '30' THEN T3.TIMEZONECD
                                                   ELSE T2.TIME_ZONE_CD END TIME_ZONE_CD
                  FROM SY4100 T1,
                       SY5110 T2,
                       PA1010 T3,
                       PA1020 T4,
                       OM0010 T5,
                       SY5130 T6
                 WHERE T1.C_CD = :C_CD
                   AND UPPER(T1.USER_ID) = UPPER(:USER_ID)
                   AND T2.C_CD = T1.C_CD
                   AND T3.C_CD = T1.C_CD
                   AND T3.EMP_ID = T1.EMP_ID
                   AND T4.C_CD = T3.C_CD
                   AND T4.EMP_ID = T3.EMP_ID
                   AND TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') BETWEEN T4.STA_YMD AND T4.END_YMD
                   AND T4.LAST_YN = 'Y'
                   AND T5.C_CD = T4.C_CD
                   AND T5.ORG_ID = T4.ORG_ID
                   AND TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') BETWEEN T5.STA_YMD AND T5.END_YMD
                   AND T6.C_CD(+) = T5.C_CD
                   AND T6.LOC_CD(+) = T5.LOC_CD;
                   
                   
UPDATE SY4100
SET PWD = 
WHERE

SELECT *
FROM SY4100
WHERE C_CD = '10'
    AND USER_ID = 'SUPER'