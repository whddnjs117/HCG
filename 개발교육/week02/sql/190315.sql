

SELECT SUM(CASE WHEN T1.EMP_NM LIKE '안%' THEN T1.MON ELSE 0  END) AS MON
  FROM (

        SELECT T1.NUM
               ,CASE WHEN T1.NUM = 1 THEN '유관순'
                     WHEN T1.NUM = 2 THEN '안창호'
                     WHEN T1.NUM = 3 THEN '안중근'
                     WHEN T1.NUM = 4 THEN '김구'
                     WHEN T1.NUM = 5 THEN '윤봉길'
                 end EMP_NM
               ,DECODE(T1.NUM, 1,'유관순',2,'ㅇㅇㅇ',3,'ㅇㅇ' ) TEST
               ,CASE WHEN T1.NUM = 1 THEN 35000
                     WHEN T1.NUM = 2 THEN 40000
                     WHEN T1.NUM = 3 THEN 45000
                     WHEN T1.NUM = 4 THEN 50000
                     WHEN T1.NUM = 5 THEN 55000
                 end mon
          FROM (SELECT LEVEL NUM FROM DUAL CONNECT BY LEVEL <= 5 ) T1
          
  
   ) T1
  
  -- WHERE T1.EMP_NM LIKE '안%'

-------------------------------------------------------------------------------------
P1010
-- 여자인원수, 남자인원수, 여자비율, 남자비율 
GENDER_TYPE : 남자 ;M, 여자 :F


SELECT  ROUND(T1.M_CNT / (T1.M_CNT + T1.F_CNT) * 100 ,2)   AS 남자비율 
       ,ROUND(T1.F_CNT / (T1.M_CNT + T1.F_CNT) * 100,2)   AS 여자비율 
       ,T1.M_CNT
       ,T1.F_CNT
  FROM (
        SELECT NVL(SUM(CASE WHEN T1.GENDER_TYPE = 'M' THEN 1 ELSE 0 END),0) M_CNT
                 ,NVL(SUM(CASE WHEN T1.GENDER_TYPE = 'F' THEN 1 ELSE 0 END),0) F_CNT
              
          FROM PA1010 T1
              ,PA1020 T2
          WHERE T2.C_CD = T1.C_CD
            AND T2.EMP_ID = T1.EMP_ID
            AND TO_CHAR(SYSDATE,'YYYYYMMDD') BETWEEN T2.STA_YMD AND T2.END_YMD
            AND T2.LAST_YN = 'Y'
            AND T2.STAT_CD LIKE '1%'
          
   ) T1

----------------------------------------------------------------------

WITH TABLE_DATA  -- 재활용해서 사용할때 
 AS (

  SELECT T1.NUM
       ,CASE WHEN T1.NUM = 1 THEN '유관순'
             WHEN T1.NUM = 2 THEN '안창호'
             WHEN T1.NUM = 3 THEN '안중근'
             WHEN T1.NUM = 4 THEN '김구'
             WHEN T1.NUM = 5 THEN '윤봉길'
         END AS EMP_NM
          ,CASE WHEN T1.NUM = 1 THEN '인사팀'
             WHEN T1.NUM = 2 THEN '인사팀'
             WHEN T1.NUM = 3 THEN '인사팀'
             WHEN T1.NUM = 4 THEN '총무팀'
             WHEN T1.NUM = 5 THEN '총무팀'
         END AS ORG_NM
       ,CASE WHEN T1.NUM = 1 THEN '대리'
             WHEN T1.NUM = 2 THEN '대리'
             WHEN T1.NUM = 3 THEN '과장'
             WHEN T1.NUM = 4 THEN '과장'
             WHEN T1.NUM = 5 THEN '과장'
         END GRADE_NM
       ,CASE WHEN T1.NUM = 1 THEN 35000
              WHEN T1.NUM = 2 THEN 40000
              WHEN T1.NUM = 3 THEN 45000
              WHEN T1.NUM = 4 THEN 50000
              WHEN T1.NUM = 5 THEN 55000
         END AS MON
  FROM (SELECT LEVEL NUM FROM DUAL CONNECT BY LEVEL <= 5 ) T1
  
   )
   SELECT T1.ORG_NM
         ,T1.GRADE_NM
         ,SUM(T1.MON)
     FROM TABLE_DATA T1
  GROUP BY T1.GRADE_NM, T1.ORG_NM
  ORDER BY T1.ORG_NM, T1.GRADE_NM

---------------------------------------------------------------
-- 2018년도 월별 입사타,퇴사자 인원을 조회 
 -- 월단위로 조회 (ROW = 12개 )
 
 
 SELECT T2.NUM
       ,NVL(SUM(CASE WHEN LPAD(T2.NUM,2,'0') = SUBSTR(T1.ENTER_YMD,5,2) THEN 1 
                     ELSE 0 END),0) AS 입사인원 
       ,NVL(SUM(CASE WHEN LPAD(T2.NUM,2,'0') = SUBSTR(T1.RETIRE_YMD,5,2) THEN 1 
                     ELSE 0 END),0) AS 퇴사인원 
                     -- 추출한 NUM 과 입/퇴사월 을 비교 
                     -- NUM 이 1자리 일수 있으므로 2자리로 변경 - LPAD 
   FROM PA1010 T1
       ,(SELECT LEVEL NUM FROM DUAL CONNECT BY LEVEL <= 12 ) T2 --12개 ROW 를 임의로 추출 
  WHERE (T1.ENTER_YMD LIKE '2018%' OR T1.RETIRE_YMD LIKE '2018%') --입사이자 또는 퇴사자 
   
    AND ( SUBSTR(T1.ENTER_YMD ,1,4) = '2018' OR SUBSTR(T1.RETIRE_YMD ,1,4) = '2018') -- X
    
   AND 1 = CASE WHEN T2.직급 ='대리' AND T2.ORG_ID ='2222' THEN 1   
                 WHEN T2.직급 ='과장' AND T2.ORG_ID ='33333' THEN 1
                 ELSE 0 
             END  -- 조건이 복잡할때는 조건절에 CASE 를 사용하여 처리가능 
  GROUP BY T2.NUM 
  ORDER BY T2.NUM
  
  
 