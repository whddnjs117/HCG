# 2일차 개발환경 설정
## Oracle Database 11g 설치

<br>

### 진행방법
- [Oracle 설치 Wiki](https://wikidocs.net/3900)
  - 패스워드 : `password`로 설정
  
<br>
<hr>

## Toad for Oracle 설치

<br>

### 진행방법
- sysdba에 sys/password로 세션 로그인
  - 탭 -> file open으로 [import.sql](/configure/sql/impdp.sql) 불러오기
  - 아래 SQL문에서 {$이름} 적혀있는 곳은 상황에 맞게 반드시 수정
- Main User
  - Main User TableSpace 생성
    ```sql
    CREATE TABLESPACE TS_HUNELSTANDARD DATAFILE 'D:\oracle\oradata\orcl\HUNELSTANDARD.DBF' SIZE 100M AUTOEXTEND ON;
    ```
  
    <br>
    <hr>

  - Create User
    ```sql
    CREATE USER "HUNELSTANDARD"
    IDENTIFIED BY "HUNEL!STANDARD"
    DEFAULT TABLESPACE TS_HUNELSTANDARD
    TEMPORARY TABLESPACE TEMP;
    ```

    <br>
    <hr>

  - Grant User
    ```sql
    GRANT DBA TO HUNELSTANDARD;
    ```

    <br>
    <hr>

  - IMPDP(CMD에서 입력)
    ```
    IMPDP {$USER}/{$PASSWORD} DUMPFILE={$HUNELSTANDARD}.DMP DIRECTORY=DATA_PUMP_DIR REMAP_SCHEMA={$USER_ASIS}:{$USER_TOBE`} REMAP_TABLESPACE={$TS_ASIS}:{$TS_TOBE};
    ```
    - `ASIS는 from`, `TOBE는 to`

    <br>
    <hr>

  - 암복호화 Key Mapping
    ```sql
    CREATE DIRECTORY DIR_HUNELSTANDARD AS 'D:\oracle\product\11.2.0\dbhome_1\HCG_PKG_DIR\HUNELSTANDARD';
    
    GRANT READ ON DIRECTORY DIR_HUNELSTANDARD TO HUNELSTANDARD;
    ```
    - 회사 라이센스 아래에 위치하며 key.properties or license.dat 파일을 위한 디렉토리를 생성
    - 해당 위치에 key.properties 또는 license.dat 파일을 복사


    <br>
    <hr>

  - DB 권한 부여
    ```sql
    GRANT EXECUTE ON DBMS_CRYPTO TO HUNELSTANDARD;
    EXEC dbms_java.grant_permission('HUNELSTANDARD', 'SYS:java.io.FilePermission', 'D:\oracle\product\11.2.0\dbhome_1\HCG_PKG_DIR\HUNELSTANDARD\license.dat', 'read');
    EXEC dbms_java.grant_permission('HUNELSTANDARD', 'SYS:java.security.SecurityPermission', 'putProviderProperty.BC', '' );
    EXEC dbms_java.grant_permission('HUNELSTANDARD', 'SYS:java.security.SecurityPermission', 'insertProvider.BC', '' ); 
    ```

    <br>
    <hr>

  - Java Class 등록(CMD에서 입력)
    ```
    dropjava -u HUNELSTANDARD/HUNEL!STANDARD@localhost:1521:ORCL -v -r -t *.*
    loadjava -u HUNELSTANDARD/HUNEL!STANDARD@localhost:1521:ORCL -v -r -t C:\EHR_PROJECT\HUNEL_EHRS_WEB_STAND\db\loadjava\*.*
    ```

    <br>
    <hr>

  - DB Package Compile
    ```
    PKG_CRYPTO_CORE.PKS 우클릭 후 debug
    ```

    <br>
    <hr>

- RET User
  - RET User Tablespace 생성
    ```sql
    CREATE TABLESPACE TS_HUNELHTMLEHR_RET DATAFILE 'D:\oracle\oradata\orcl\HUNELHTMLEHR_RET.DBF' SIZE 100M AUTOEXTEND ON;
    ```

    <br>
    <hr>

  - Create User
    ```sql
    CREATE USER "HUNELHTMLEHR_RET"
    IDENTIFIED BY "HUNEL!STANDARD"
    DEFAULT TABLESPACE TS_HUNELHTMLEHR_RET
    TEMPORARY TABLESPACE TEMP;
    ```

    <br>
    <hr>

  - Grant User
    ```sql
    GRANT DBA TO HUNELHTMLEHR_RET;
    ```

    <br>
    <hr>

  - IMPDP(CMD에서 입력)
    ```
    IMPDP {$USER}/{$PASSWORD} DUMPFILE={$HUNELHTMLEHR_RET}.DMP DIRECTORY=DATA_PUMP_DIR 
    ```

    <br>
    <hr>

- RET 권한 부여
  - RET User 생성 후 실행
    ```sql
    SELECT 'GRANT DELETE, INSERT, SELECT, UPDATE ON ' || :RET_USER || '.' || T1.TABLE_NAME || ' TO ' || :USER_NAME || ';'
    FROM ALL_TABLES T1
    WHERE T1.OWNER = :RET_USER;
    ```
    - Query 실행 후 나오는 입력 창에 `HUNELSTANDARD`과 `HUNELHTMLEHR_RET` `username` 입력
    - 실행 결과를 전체 선택하여 복사 + 붙여넣기 후 Query 실행

    <br>
    <hr>

### 오류
- ORA-12541
  - 원인
    - 오라클 리스너가 동작하지 않을 경우
    - listener.ora 설정 오류
    - listener.log 파일의 용량 초과 
  - 해결방법
    - 리스너 재시작
      ```sh
      > lsnrctl stop
      > lsnrctl start
      ```
    - 설정파일 수정
    - 로그파일 비우기
- ORA-06550
  - 원인
    - 프로시저가 없는 경우
    - 프로시저가 있지만 권한이 없는 경우
  - 해결방법
    - 프로시저 생성
- ORA-01031
  - [참조 사이트](https://savour75.tistory.com/34)
- Login Fail Errors
  - [참조 사이트](https://wikidocs.net/3907)

<br>
<hr>

# 3일차 기능 교육(1)
## Java 설정

<br>

### Eclipse Default 설정
- Eclipse workspace 설정
  - `C:\EHR_PROJECT`
- Eclipse Heap Memory 설정
  - Eclipse.ini
    ```
    -Xms1024m(최소)
    -Xmx1024m(최대)
    ```
- Encoding 설정
  - window - preference - Encoding - `UTF-8, Unix로 변경`
- Code Style 설정
  - General - Editors - Text Editors
    - Displayed tab width : 2
    - Insert spaces for tabs 체크
      - HCG는 TAB을 쓰지 않음
    - Highlight current line 
  - window - preference - Java - Code Style - Formatter - Import
    - [코드 내용](/configure/xml/codeStyle/hunelJavaCodeStyle.xml)
  - window - preference - JavaScript - Code Style - Formatter - Import
    - [코드 내용](/configure/xml/codeStyle/hunelJavaScriptCodeStyle.xml)

<br>
<hr>

### 프로젝트 설정
- Project Import
  - Project Import - Existing Projects into Workspace -  `HUNEL_EHRS_WEB_STAND`
- Project Build Path 설정
  - `HUNEL_EHRS_WEB_STAND` 우클릭 - Build Path - Configure Build Path - Libraries
    - Tomcat - edit - Apache Tomcat 7.0
    - JRE System Library - edit - jdk1.7
    - 좌측 대분류에서 Project Factes - Java version 1.7

<br>
<hr>

### 톰캣 설정
- server.xml
  - Tomcat 추가 완료시 Explorer에 `Servers` 폴더가 표시
  - 내부의 server.xml을 [server.xml](/configure/xml/tomcat/server.xml)로 교체
  - 변경해야하는 부분
    - Default Users : username, password, url
      ```xml
      <Resource auth="Container" connectionProperties="SetBigStringTryClob=true" driverClassName="oracle.jdbc.driver.OracleDriver" factory="org.apache.tomcat.dbcp.dbcp.BasicDataSourceFactory" maxActive="20" maxIdle="10" name="HUNELWEBSTAND" username="HUNELSTANDARD" password="HUNEL!STANDARD" type="javax.sql.DataSource" url="jdbc:oracle:thin:@localhost:1521:orcl" validationQuery="SELECT 1 FROM DUAL"/>
      ```
    - Backup Users : username, password, url
      ```xml
      <Resource auth="Container" connectionProperties="SetBigStringTryClob=true" driverClassName="oracle.jdbc.driver.OracleDriver" factory="org.apache.tomcat.dbcp.dbcp.BasicDataSourceFactory" maxActive="20" maxIdle="10" name="HUNELWEBSTAND_RET" username="HUNELHTMLEHR_RET" password="HUNEL!STANDARD" type="javax.sql.DataSource" url="jdbc:oracle:thin:@localhost:1521:orcl" validationQuery="SELECT 1 FROM DUAL"/>
      ```
  - 주석처리할 부분 : 채용 정보이므로 필요 없음
    ```xml
    <Resource auth="Container" connectionProperties="SetBigStringTryClob=true" driverClassName="oracle.jdbc.driver.OracleDriver" factory="org.apache.tomcat.dbcp.dbcp.BasicDataSourceFactory" maxActive="20" maxIdle="10" name="REEHR" username="REEHR" password="PASSWORD" type="javax.sql.DataSource" url="jdbc:oracle:thin:@1.234.41.25:1521:RND" validationQuery="SELECT 1 FROM DUAL"/>
    ```
- web.xml
  - 위치 : `C:\EHR_PROJECT\HUNEL_EHRS_WEB_STAND\WebRoot\WEB-INF\web.xml`
    ```xml
    <dispatcher></dispatcher> 항목 주석처리
    ```
    ```xml
    톰캣 6의 경우
    <dispatcher>REQUEST</dispatcher>,
    <dispatcher>FORWARD</dispatcher> 태그 주석처리 시 에러 발생
    (제우스 개발서버 소스 가져왔을 경우 주석처리되어있을 수 있음)
    ```

<br>
<hr>

## 로그인
- 관리자 계정 비밀번호 변경
  - 아이디 : SUPER / 비밀번호 : 임의의 값 입력 후 실패
    - Eclipse Consol Error Log -> Sy_main_page.java의 login 메소드 확인
    - Java 에서 확인 후 설정하는 방법
      ```sql
      UPDATE SY4100
      SET PWD = 'D42BA9F396FC63EF936F80EEE3695BE7D2CFC2A2E33557B80E44AE518CBF40BA'
      -- 임의로 지정한 비밀번호 super의 암호화값임.
      WHERE C_CD = '10'
          AND USER_ID = 'SUPER';
      ```

    <br>
    <hr>

    - DB에서 설정하는 방법
      ```sql
      UPDATE HUNELSTANDARD.SY4100 
      SET PWD = HUNELSTANDARD.PKG_CRYPTO.F_SET_ENC_SHA('1')
        , PWD_MOD_YMDHMS = SYSTIMESTAMP
        , ERR_CNT = 0 
      WHERE USER_ID = 'SUPER';

      UPDATE HUNELSTANDARD.RE4010 SET PWD = PKG_CRYPTO.F_SET_ENC_SHA('1') WHERE MAIL = '1@e-hcg.com';
      UPDATE REEHR.RE4010 SET PWD = PKG_CRYPTO.F_SET_ENC_SHA('1') WHERE MAIL = '1@e-hcg.com';
      ```
      - 관련 sql문
        - [1번](/configure/sql/login.sql)
        - [2번](/configure/sql/login2.sql)
        - [3번](/configure/sql/login3.sql)

    <br>
    <hr>

  - 계정 비밀번호 5회 이상 틀렸을 시
    ```sql
    UPDATE SY4100
    SET ERR_CNT = 0
    WHERE C_CD = '10'
        AND USER_ID = 'SUPER';
    ```

<br>
<hr>

## 인쇄
- 인사관리 -> 인사기록출력 -> 성명/사번 조회 -> 선택 -> 인쇄
- system.properties
  - HCG 개발자 서버 : `RD_WEBROOT=http://1.234.41.25:8102`
  - 로컬 테스트 환경 : `RD_WEBROOT=http://localhost:8100`

<br>
<hr>

## 톰캣 경로 설정
- [Tomcat Server Location Configure Error 해결방법](https://stackoverflow.com/questions/1012378/eclipse-server-locations-section-disabled-and-need-to-change-to-use-tomcat-ins)
- `Crownix_ERS_Server(설치파일)` 압축 해제
  - 엠투소프트 프로덕트이므로 라이센스(기간제)가 필요함
  - 주기적으로 `HUNEL PORTAL`에 게시, 필요시 본인이 신청하여 다운받을 수 있음
    - [신청 예시](/template/CrownixMail.txt)

<br>

- 톰캣 폴더 -> webapps -> `DataServer, ReportingServer` 폴더 이동
  - 갱신/새로 발급된 `Crownix licence` 덮어쓰기
    - 위치 : `톰캣경로\webapps\DataServer\license\license`
    - 위치 : `톰캣경로\webapps\ReportingServer\license\license`
    - 엠투소프트 license 요청 후 응답 내용 : 라이센스 키를 .js 파일에 덮어쓰기
      - sheet : 그리드
      - org : 화상조직도
- [Reporting Server](http://localhost:8100/ReportingServer/manager/index.html)
  - `username` : admin
  - `password` : hunel(또는 admin)

<br>
<hr>


<br>
<br>
<br>
<br>
---

# Data Flow(정리중)
- JSP에서 서버로 데이터 전송(Form Submit 또는 JS), 곧바로 데이터가 전송되면 문제가 생길 수 있으므로 뷰와 서버 사이에 필터를 위치시킨다. 역할은 불순물을 걸러내는 필터, 오류를 검출하거나 메세지를 출력하는 역할을 한다.
- 서버에서 데이터를 가져오려면 DB에 접속하여 조회해야 한다. 데이터를 가져오면 JSON Genarator가 데이터를 JSON 형태로 변환하여 뷰로 전송한다.
  - 다른 형태로 보내고 싶다면 Generator를 바꾸면 된다. Xml이라던지...
  - S_FORWARD로 데이터 처리 페이지를 변경하면 된다.
  - 없다면 system.properties파일의 S_FORWARD_DEFAULT 값을 이용
- 페이지에서 보내는 정보 : 어떤 클래스(S_DSCLASS)를 호출하고 싶은가, 어떤 메소드(S_DSMETHOD)를 호출하고 싶은가, 어떤 파라미터 정보(S_EMP_ID)를 보내는가
- ResultSet의 단점 : 커넥션이 맺어진 동안에만 데이터가 유지되므로 이를 재정의하여 MemResultSet을 작성하였음.
- 현재 사용중 : ibsheetResultJSON.jsp
- Mybatis와 비슷한 SQLUtils 라는 프레임워크를 넣었음
  - XmlQuery : Xml에 있는 쿼리를 String으로 불러온다.
    - String query = xmlQuery.getElement(this, "search01", null, authMap);
      - 같은 이름을 가진 XML 파일을 찾아라
      - search01 노드의 내용을 가져와라
      - 문자열을 치환하라(null이면 그대로)
      - 권한을 체크하라
  - VarStatement : 쿼리에 들어갈 파라미터를 바인딩하고 쿼리를 실행하여 ResultSet을 반환한다.
    - CallableStatement : 인덱스가 아닌 파라미터로 값을 찾음
    - PreparedStatement : 기존 정보를 유지할 수 있음
    - 두개를 합침으로 Procedure 호출과 Parameter의 안전한 세팅을 한번에 처리함
    - VarStatement는 String으로 데이터를 받을 시 해킹의 위협이 있으므로 객체에 담아 전송하는 것이다.
  - SQLUtil : VarStatement에서 반환받은 ResultSet을 MemResultSet에 담고 Statement를 Close한다.
    - SQLUtil.getResultSetWithClose(vstmt);
  - MemResultSet : 객체에 조회 내용을 담아서 사용한다.
  - CUDSQLManager : insert, update, delete 쿼리문을 데이터 세팅 후 생성할 수 있게 하며 생성된 쿼리는 VarStatement를 이용해 실행
    - CUDSQLManager cud = new CUDSQLManager(conn, request);
    - cud.setTable(“TABLE_NM”);
    - cud.addKey(“EMP_ID”,”123”);
    - cud.addField(“EMP_NM”,”홍길동”);
    - cud.insert();
    - cud.update();
    - cud.delete();
    - sql의 insert문은 키값이 중요하지 않으므로 필드로써 취급한다.
    - sql의 update문은 필드값을 set절에서, 키값을 where절에서 사용한다.
      - 키값을 set에 사용하면 해당 키값이 적용된 모든 테이블의 키값이 변경된다.
    - sql의 delete문은 키값만 적용되고 필드는 무시된다.
      - 필드값을 넣으면 모든 데이터가 삭제된다.
    - 결국 cud 는 키와 필드값을 매핑해주는 것이다.
    - 마지막에 insert, update, delete를 설정하면 된다.
- 필터
  - 뷰에서 서버로 데이터를 보낼 때 공격이 포함되어 있을 수 있으므로 중간에 필터(XSSFilter: Cross Site Script)를 둔다. hunelActionServlet로 금지 문장 목록, 금지 문자 목록을 입력하면 된다.
  - hunelActionServlet 의 역할
    - 세션체크
    - 보안처리
    - 라이센스체크
    - Database 연결
    - Class.method 실행
    - 데이터 반환
    - 연결객체 close
    - 오류 메세지 반환
- AuthMap : 권한
  - AuthTag : 화면에 중요한 데이터가 출력되지 않게 방지
  - MenuActionServlet : 메뉴를 열 수 있는 권한이 있는지 확인
    - HUNEL, Jade : MenuActionServlet
    - 채용면접관 : InterViewMenuActionServlet
    - 채용 Poratal : ReMenuActionServlet
    - OTP key 생성
      - profile id
      - program id
      - program url(물리적인 페이지의 이름)
      - session id
      - + Program Open Time
  - 모든 메뉴, 페이지를 열 때 해당 기능이 작동한다.
  - 로그인을 하지 않으면 작동을 하지 않으므로 오류가 발생할 것이기 때문에 두 메소드를 추가하여 융통성을 향상함
    - getCheckIgnoreUrl
    - getCheckIgnoreUrlOnlySession
  - 프로그램 관리에서 모든 팝업, 탭 페이지를 등록해야하며 팝업 안에 팝업이 일어나도 똑같이 전부 등록해주어야 한다.
- 암호화
  - 단방향, 양방향의 차이점은 복호화 가능여부
    - 단방향 : SHA256, 관리자도 알 수 없음
    - 양방향 : 개인정보 암호화에 사용
      - AES128 : 미국 국방부(옛 JDK는 이게 최신)
      - SEED256 : 국산 암호화
  - serverStartUtil. setEncodlMap();
    - 암호화 컬럼 등록
    - 주민번호, 계좌번호 등을 자동으로 암호화
    - 자바 클래스에서 설정함, DB가 아님
    - 암복호화 예외 컬럼으로 개인정보 보호
  - HunelCryptoUtil에 재정의하여 고객사가 휴넬의 암호화를 원하지 않으면 해당 메소드를 제거하면 됨
- 개인정보보호법
  - 개인정보 접속 기록
    - 조회 : SQLUtil.getResultSetWithClose, SQLUtil.getResultSet;
    - CUD : CUDSQLManager.insert, .update, . delete;
    - 프로시저 : VarStatement.executeUpdate;
      - 프로시저 로그 기록 방법은 TMP라는 글로벌 템포러리 테이블을 생성하여 유지하는데 이 시점에 기록한다.
- 개인정보 분리 보관
  - 쇼핑몰을 위한 법안임
  - 원래는 삭제가 기본이나 퇴직 후 정보를 유지하기 위해서 다른 데이터베이스에 데이터를 순차적으로 이관하여 분리보관하고 몇 년이 지나면 삭제해야한다.
  - PK에는 절대 개인정보가 들어가면 안된다.
  - P_PSN_INFO_SEPA_STOR
- 프로젝스 사이트에서 신입이 하는 것
  - 개발자용 라이센스 : 개발용할 때 필요한 것
    - 동시접속자 제한
    - 회사코드 제한
  - 개발 서버용 라이센스 : IP, MAC 주소 제한
    - 동시접속자 제한
    - 회사코드 제한
    - 유효기간 제한(opt)
  - 운영 서버용 라이센스 : IP, MAC 주소 제한
    - 재직자 수 제한
    - 회사코드 제한
    - 유효기간 제한(opt)
  - IBLeaders 외부 라이센스
    - IBSheet
    - IBOrg : 화상툴
  - 엠투소프트 외부 라이센스(R&D를 통해서 연락)
    - Crownix : 출력물 관리 툴
- SelectList는 자체 라이프 사이클을 가지므로 한개일때는 괜찮으나 여러개일 경우 성능저하의 문제가 있다.
- combo.jsp와 xsheetResultXML.jsp는 otp 적용이 되지 않아 해킹의 위협이 있다.

<br>
<hr>

# 1주차 과제
- [`document.ready(function(){ ... });` 을 분석하시오.](/work/js/firstAnalytics.md)
- [Oracle SQL문을 작성하시오.](/work/sql/fristQuery.md)

<br>
<hr>
