SELECT NVL(T1.C_CD, T2.C_CD) C_CD
     , NVL(T1.USER_ID, T2.USER_ID) USER_ID
     , NVL(T1.USER_NM, T2.USER_NM) USER_NM
     , NVL(T1.EMP_ID, T2.EMP_ID) EMP_ID
     , NVL(T1.PWD, T2.PWD) PWD
     , NVL(T1.PER_NO, '') PER_NO
     , NVL(T1.SUPER_YN, T2.SUPER_YN) SUPER_YN
     , NVL(T1.USE_YN, CASE WHEN T2.USE_YN = 'Y' AND TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') BETWEEN NVL(T2.STA_YMD, '19000101') AND NVL(T2.END_YMD, '99991231') THEN 'Y' ELSE 'N' END) USE_YN
     , NVL(T1.PWD_MOD_YMDHMS, T2.PWD_MOD_YMDHMS) PWD_MOD_YMDHMS
     , NVL(T1.ERR_CNT, T2.ERR_CNT) ERR_CNT
     , NVL(T1.LAST_LOGIN_YMDHMS, TO_CHAR(T2.LAST_LOGIN_YMDHMS, 'YYYY-MM-DD HH24.MI.SS')) LAST_LOGIN_YMDHMS
     , NVL(T1.LAST_LOGIN_IP, T2.LAST_LOGIN_IP) LAST_LOGIN_IP
     , NVL(T1.PWD_CHG_MONTH, MONTHS_BETWEEN2(SYSDATE, T2.PWD_MOD_YMDHMS)) PWD_CHG_MONTH
     , NVL(T1.SKIN_CD, T2.SKIN_CD) SKIN_CD
     , NVL(T1.SAVING_TIME_YN, T3.SAVING_TIME_YN) SAVING_TIME_YN
     , NVL(T1.LANG_TYPE, :LANG_TYPE) LANG_TYPE
     , NVL(T1.BASE_LANGUAGE_CD, T3.BASE_LANGUAGE_CD) BASE_LANGUAGE_CD
     , NVL(T1.DMT_USE_YN, T2.DMT_USE_YN) DMT_USE_YN
     , NVL(T1.AUTH_ADMIN_YN, T2.AUTH_ADMIN_YN) AUTH_ADMIN_YN
     , NVL(T1.COM_NTNL_CD, T3.COM_NTNL_CD) COM_NTNL_CD
     , NVL(T1.COM_NM, T3.COM_NM) COM_NM
     , NVL(T1.TIME_ZONE_CD, T3.TIME_ZONE_CD) TIME_ZONE_CD
  FROM (
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
                   AND T6.LOC_CD(+) = T5.LOC_CD
          ) T1
      , SY4100 T2
      , SY5110 T3
 WHERE T1.C_CD(+) = T2.C_CD
   AND T1.USER_ID(+) = T2.USER_ID
   AND T2.C_CD = :C_CD
   AND T2.USER_ID = :USER_ID
   AND T3.C_CD = T2.C_CD;