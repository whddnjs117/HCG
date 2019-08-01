# 쿼리 예제
```sql
-- 락 여부 확인 쿼리

SELECT USERNAME
      ,ACCOUNT_STATUS
      ,LOCK_DATE
  FROM DBA_USERS
 WHERE ACCOUNT_STATUS <> 'OPEN';

ALTER USER SCOTT ACCOUNT UNLOCK;
ALTER USER SCOTT ACCOUNT LOCK;
ALTER USER SCOTT PASSWORD EXPIRE;
ALTER USER SCOTT IDENTIFIED BY TIGER;

-- 락 걸린 테이블 확인

SELECT DO.OBJECT_NAME
      ,DO.OWNER
      ,DO.OBJECT_TYPE
      ,DO.OWNER
      ,VO.XIDUSN
      ,VO.SESSION_ID
      ,VO.LOCKED_MODE
  FROM V$LOCKED_OBJECT VO
      ,DBA_OBJECTS DO
 WHERE VO.OBJECT_ID = DO.OBJECT_ID;

 -- 해당 테이블에 LOCK 이 걸렸는지.

SELECT A.SID
      ,A.SERIAL#
      ,B.TYPE
      ,C.OBJECT_NAME
  FROM V$SESSION A
      ,V$LOCK B
      ,DBA_OBJECTS C
 WHERE A.SID = B.SID
   AND B.ID1 = C.OBJECT_ID
   AND B.TYPE = 'TM'
   AND C.OBJECT_NAME IN ('TB_CO_GENO');

   -- 락발생 사용자와 SQL, OBJECT 조회

  SELECT DISTINCT X.SESSION_ID
                 ,A.SERIAL#
                 ,D.OBJECT_NAME
                 ,A.MACHINE
                 ,A.TERMINAL
                 ,A.PROGRAM
                 ,B.ADDRESS
                 ,B.PIECE
                 ,B.SQL_TEXT
    FROM V$LOCKED_OBJECT X
        ,V$SESSION A
        ,V$SQLTEXT B
        ,DBA_OBJECTS D
   WHERE X.SESSION_ID = A.SID
     AND X.OBJECT_ID = D.OBJECT_ID
     AND A.SQL_ADDRESS = B.ADDRESS
ORDER BY B.ADDRESS
        ,B.PIECE;

-- 현재 접속자의 SQL 분석

  SELECT DISTINCT A.SID
                 ,A.SERIAL#
                 ,A.MACHINE
                 ,A.TERMINAL
                 ,A.PROGRAM
                 ,B.ADDRESS
                 ,B.PIECE
                 ,B.SQL_TEXT
    FROM V$SESSION A
        ,V$SQLTEXT B
   WHERE A.SQL_ADDRESS = B.ADDRESS
ORDER BY A.SID
        ,A.SERIAL#
        ,B.ADDRESS
        ,B.PIECE;

-- 락 세션 죽이기

SELECT A.SID
      ,A.SERIAL#
  FROM V$SESSION A
      ,V$LOCK B
      ,DBA_OBJECTS C
 WHERE A.SID = B.SID
   AND B.ID1 = C.OBJECT_ID
   AND B.TYPE = 'TM'
   AND C.OBJECT_NAME = 'TB_CO_GENO';

-- 락 세션 죽이는 sql 문

  SELECT DISTINCT X.SESSION_ID
                 ,A.SERIAL#
                 ,D.OBJECT_NAME
                 ,A.MACHINE
                 ,A.TERMINAL
                 ,A.PROGRAM
                 ,A.LOGON_TIME
                 ,'ALTER SYSTEM KILL SESSION''' || A.SID || ', ' || A.SERIAL# || ''';'
    FROM GV$LOCKED_OBJECT X
        ,GV$SESSION A
        ,DBA_OBJECTS D
   WHERE X.SESSION_ID = A.SID
     AND X.OBJECT_ID = D.OBJECT_ID
ORDER BY LOGON_TIME;
```

# 자주 발생하는 Lock 문제들
- `Parent-Child` 관계로 묶인 테이블에서 Child 테이블에 Index 없이 테이블을 수정하게 되면 Parent 테이블에 *TABLE LEVEL SHARE Lock* 이 걸리며 Parent 테이블에 대한 모든 Update가 금지된다.
- 블럭의 PCTFREE 가 매우 작다면 한 블럭에 여러개의 레코드가 들어 있기 때문에 한 블럭에 과도한 트랜잭션이 들어와서 블럭의 Transaction Layer 가 Release 되기를 기다리게 되는 경우도 있다.
- Transaction 을 직접 처리하는 경우(@Transaction 이 아닌 @Override 사용시) COMMIT 이나 ROLLBACK 하지 않고 바로 빠져 나가는 경우에도 Lock 이 발생될 수 있다. 거래가 바로 빠져 나가는 경우는 exception 이 발생했으나 catch 를 제대로 하지 못 한 경우가 흔하다.

<br>

#Lock의 유형
- 데이터의 동시성(Concurrency)을 보장하기 위해 오라클은 Lock과 Transaction을 사용한다.
- Lock은 같은 자원을 Access 하는 사용자들 상호간에 해를 끼치는 것을 예방하기 위한 메카니즘이다.
- Lock의 종류
  - Exclusive : Lock이 걸린 자원의 공유를 허용하지 않는다.
  - Share : 자원에 대해 수행되는 명령의 유형에 따라 Lock된 자원의 공유되는 것을  허용한다.
오라클에서의 Lock의 일반적인 범주
  - Data or DML (row Locks TX and table Locks TM) : 동시에 다중의 사용자에 의해
    access되는 테이블 데이타의 보호를 위해 사용된다.
  - Dictionary or DDL(TD) : 트랜잭션에서 access되는 테이블과 같은 Object의 정의를
    보호하기 위해서 사용한다.
  - Internal and Latches (RT, MR) : SGA 영역에서의 내부적인 데이타베이스와 메모리
    구조를 보호하기 위해 사용한다.
1. TABLE LockS
  테이블의 특정한 row를 수정하는 문장은 항상 그러한 row에 대해 exclusive row Lock
  을 획득하고 테이블 Lock을 전유한다.
  (1) Row Share Table Locks (RS)
      - row를 Lock 시키고 Lock된 테이블을 UPDATE 할 목적이다.
      - 모든 row를 SELECT 하려는 다른 트랜잭션을 허용한다.
      - 동일 테이블에서 Lock 되지 않은 row를 INSERT, UPDATE, DELETE 하는 다른  트랜잭션을 허용한다.
      - 테이블에 대한 ROW SHARE, ROW EXCLUSIVE, SHARE, SHARE ROW EXCLUSIVE Lock
        을 획득하려는 다른 트랜잭션을 허용한다.
      - EXCLUSIVE 모드에서의 테이블 Locking으로부터 다른 트랜잭션을 예방한다.
  (2) Row Exclusive Table Locks (RX)
      - row를 Lock 시키고 테이블에서 row를 변화시킨다.
      - 모든 row를 SELECT 하려는 다른 트랜잭션을 허용한다.
      - 동일 테이블에서 Lock 되지 않은 row를 INSERT, UPDATE, DELETE 하는 다른
        트랜잭션을 허용한다.
      - 테이블에 대한 ROW SHARE, ROW EXCLUSIVE Lock을 획득하려는 다른 트랜잭션을
        허용한다.
      - SHARE, EXCLUSIVE, SHARE ROW EXCLUSIVE 모드에서의 테이블 Locking으로부터
        다른 트랜잭션을 예방한다.
  (3) Share Table Locks (S)
      - 다른 트랜잭션을 제공하지 않는 테이블에서 row를 INSERT, UPDATE, DELETE
        하는 것이 SHARE Lock을 홀딩한다.
      - 동일 테이블에서 지정된 row를 QUERY 또는 Lock 하려는 다른 트랜잭션을  허용한다.
      - 테이블에 대해 더 나아가 SHARE Lock을 얻으려는 다른 트랜잭션을 허용한다.
      - EXCLUSIVE 또는 SHARE ROW EXCLUSIVE 모드로 테이블을 Locking 하는 것으로
        부터 다른 트랜잭션을 보호한다.
  (4) Share Row Exclusive Table Locks (SRX)
      - 테이블에 row를 INSERT, UPDATE, DELETE 한다.
      - 동일 테이블에서 지정된 row를 QUERY 또는 Lock 하려는 다른 트랜잭션을   허용한다.
      - SHARE, EXCLUSIVE 또는 SHARE ROW EXCLUSIVE 모드로 테이블을 Locking 하는 것으로
        부터 다른 트랜잭션을 보호한다.
  (5) Exclusive Table Locks (S)
      - 테이블에 row를 INSERT, UPDATE, DELETE 한다.
      - 동일 테이블에서 지정된 row를 QUERY하는 것에 대해서만 다른 트랜잭션을
        허용한다.
      - 어떠한 Lock 문장을 내리는 것으로부터 다른 트랜잭션을 보호한다.
2. DICTIONARY LockS
  Dictionary Lock은 Object에 대한 DDL 명령이 수행되는 동안 Object의 정의를  보호한다.
3. INTERNAL LockS 과 LATCHES
  Latches 와 Internal Lock은 메모리 구조를 보호하기 위한 메카니즘이다.
  - Latches 는 SGA 영역에 있는 shared data structure를 보호하기 위한 low-level    연속 메카니즘이다.
  - InternalLock은 data dictionary entry를 보호하고 database file, tablespace,  rollback segment를 Lock한다.
  Latches 와 Internal Locks는 데이타베이스 사용자에 의해 컨트롤 될 수 없다.

Lock에 대한 모니터
   Lock contention 과 병목현상은 시스템의 효능을 저하시킨다.
   1. 모니터 방법
      (1) SQL*DBA 모니터 Lock display
      (2) V$Lock view
      (3) utlLockt.sql 이라는 스크립트 화일의 내용을 확인
          (Lock이 된 자원을 기다리는 사용자가 있는지를 보여줌)
   2. SQL*DBA Lock monitor 를 사용한 모니터 방법
      Lock 모니터의 Resource ID 1 필드는 DBA_OBJECTS 에서의 object_id 이다.
      Lock 모니터의 특정한 Resource ID 1 과 일치하는 테이블명을 찾기 위해서는   다음 Query를 사용한다.
      SQL> SELECT owner, object_id, object_name, object_type
           FROM dba_objects
           WHERE object_id = resource id #;
      ▶ Lock monitor의 컬럼들
      Username : 연결된 사용자의 명
      Session ID : 사용자 연결을 식별하기 위해 오라클에서 제공되는 ID
      Serial Number : 세션의 시리얼 번호로 각각의 세션을 유일한 번호로 지정하기 위해  Session ID를 함께 사용한다.
      Lock Type : TM은 데이타 조작에 대해 dictionary Lock을 표시한다.
                  Resource ID 1 필드는 Lock이 걸린 테이블의 ID이다.
                  테이블명을 찾아보려면 DBA_OBJECTS 쿼리를 사용한다.
                  TM Lock은 트랜잭션 Lock이다.
                  지시하는 row는 Lock이 걸리거나 Lock 되기 위해 요청된다.
      Resource ID 1 : TM 형태의 Lock에 대해 DBA_OBJECTS view로 찾은 테이블 ID를 보여준다. 다른 값은 무시될 수 있다.
      Resource ID 2 : 내부적으로 Lock의 형태를 식별하기 위해 사용한다.
      Mode Held : 자원을 쥐고 있는 Lock의 모드를 나타낸다.
      Mode Requested : 자원에게 요청된 Lock의 모드를 나타낸다.