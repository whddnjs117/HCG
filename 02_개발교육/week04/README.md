# 16일차 화면 실습(5)
- 시트(복수건)
- 탭 화면, 프리 폼(단건)
  - vslider
  - ajaxRequestXS
  - ajaxSyncRequestXS
  - ajaxRequestXSProg

# 17일차 화면 실습(6)
- send
- sheet / ajax -> query -> mrs -> setResultSet / addEtcData -> O_RS / O_ETC
- setResultSet = > hashMap("O_RS", mrs) = > O_RSMAP

# 18일차 화면 실습(7)
## 신청서(복리후생)
- 인사관리 - 제증명 신청
- 복리후생 - 경조금 신청
  - 가족 데이터는 인사기본사항에서 가져오는 것
  - 신청이 되었다면 신청서 유형에서 등록했던 결재자에게 결재 요청이 감
  - 결재 관리에서 결재자가 변경할 수 있는 내용이 있음
  - 프로세스는 신청 - 결재 - 승인임
  - 경조금 관리란에 추가가 됨
  - 경조금 승인관리는 일괄 승인이 가능한 화면이며 익숙해지면 사용할 것
  - 경조금 지급 기준을 추가함으로써 해당 경조사에 대한 금액을 default로 설정 가능
- 시스템 - 신청서 - 신청서 유형관리
  - 공통코드에 등록하면 신청서유형 코드에 등록이 가능함
  - 메일과 SMS는 선택한 프로세스에서 발송하는 시스템

## 비즈니스 로직
###  `Sys_appl_abstract` 상속
- 신청서에 공통으로 다루는 비즈니스 로직을 구현
- 신청서의 서버 로직을 처리하는 java 클래스에서 hunelCommonDS 대신 상속 받음
- 신청서 번호(APPL_ID) 자동 채번
  - 첨부된 파일의 서버에서 저장(파일번호 채번, 업로드, 파일 테이블 저장 등)
- 삭제시 관련 파일 삭제 자동 처리
- 결재, 승인, 반려 시 신청서의 상태 자동 변경
  - 결재, 승인, 반려 시 관련자에게 메일, 문자 자동 발송
- 각 비즈니스 로직(저장, 결재, 승인, 삭제 등) 마다 before, after에 해당하는 전처리기, 후처리기 함수 호출

### 프로세스 순서
1. `search01` : 개발자가 반드시 개발해야하는 부분
2. save01
    - 자동처리 : 신청서 번호 채번, 결재선 저장 등의 공통 로직
    - `save01_biz` : 개발자가 반드시 개발해야하는 부분
    - 자동처리 : 파일 업로드, 상태값 변경 등의 공통 로직
3. apply01
   - apply01_before : 필요에 의해 개발
   - 신청서 신청 시 진행되는 공통 로직(상태 변경, 메일 발송 등)
   - apply01_after : 필요에 의해 개발
4. appr01
   - appr01_before : 필요에 의해 개발
   - 결재, 승인시 진행되는 공통 로직
   - appr01_after : 필요에 의해 개발
5. noappr01
   - noappr01_before : 필요에 의해 개발
   - 반려시 진행되는 공통 로직
   - noappr02_after : 필요에 의해 개발
6. `onApplComplete` : 개발자가 반드시 개발해야하는 부분

### 신청서의 기본 테이블
- SY7010(신청서 기본 정보)
  - 신청서번호, 상태, 신청자, 대상자 등의 기본 정보
- SY7020(신청서 결재선 정보)
  - 결재, 승인자 들의 정보 및 상태

### 신청서 JSP
- sys_appl.js
  - 신청서 관련 공통 기능 구현
    - 결재선 관련
    - 파일업로드 관련
    - 신청 기본 정보 관련
- sys_appl_000_c01.jsp
  - sys_appl.js에서 사용할 변수들을 정의
- sys_appl_100_c01.jsp
  - 신청서에서 공통적으로 사용되는 Input(hidden type)을 정의

#### 필수 코드
- 공통 스크립트 include
  ```js
  <script type='text/javascript' src='/common/js/sys_appl.js'></script>
  ```
- 신청/결재/승인 프로세스별 jsp include
  ```js
  <%@include file="/sys/sy_appl/sys_appl_000_c01.jsp"%>
  <%@include file="/sys/sy_appl/sys_appl_100_c01.jsp"%>
  ```
- 신청서의 내용을 작성하는 form 영역
  ```js
  <div class="hbox" boxsize="35" id="applButton"></div>
  <div class="hbox" boxsize="125" id="applTop" style="display:none"></div>
  <div class="hbox yscroll" id="maincontent">
  <!-- 이곳에 신청서 내용작성 -->
  </div>
  ```
- 신청서에 대한 공통 영역
  ```js
  <!-- 신청서 공통 start -->
  <div class="hiddenZone">
    <textarea id="xmlApplTypeInfo" >
      <%=hmPreparedData.get("xmlApplTypeInfo") %>
    </textarea>
  </div>
  <!-- end -->
  ```

#### 필요에 따라 개발/추가하는 코드
- 최종적으로 sys_appl.js의 init 함수를 호출
  ```js
  function LoadPage()
  {
    ... // 초기화 전 필요한 로직 기술
    Apply.init();
  }
  ```
- 신청서 공통 조회 함수
  ```js
  function doSearch(applStatus, isReapply) 
  {
    //상태와  재신청 등의 경우에 따라 조회
    //ajax로 조회하여 inputSetValueAuto 등을 이용하여 화면에 데이터를 뿌려준다
  }
  ```
- 함수의 유효성여부 체크
  ```js
  function doValidation()
  {
    //저장전 valid  체크
  }
  ```
- 신청 전 처리함수
  ```js
  // 저장 전 처리함수
  function doSaveBefore() 
  {
    if( !doValidation() )
    {
      return false;    
    }
    ... //validation 외에 저장전 해야 하는 내용을 기술
    return true;
  }

  /**************************************************/

  // 신청 전 처리함수
  function doApplyBefore() 
  {
    if( !doValidation() )
    {
      return false;    
    }
    ... //validation 외에 신청전 해야 하는 내용을 기술
    return true;
  }
  ```

## 실습
- 신청서 메뉴 등록하고 화면에 띄우기
  1. 공통코드 '/SY09' 신청서 코드 땀
  2. 신청서 유형관리에서 상세를 셋팅(프로그램명은 만들 신청서 소스 위치), 승인자 추가
  3. sy_appl_200_m01_???.jsp, sy_appl_210_m01_???.jsp, sy_appl_220_m01_???.jsp 소스 추가
     - 신청 : APPL
     - 결제 : APPR
     - 승인 : ADMIN
  4. 프로그램관리 화면에서 신청, 결제, 승인 프로그램 추가 
  5. 프로파일별메뉴관리 화면에서 신청, 결제, 승인 프로그램 등록

# 19일차 개발 교육 - SVN
https://192.168.1.201:443/svn/REPORT_EHRS_WEB_STAND/

jadclipse

hunel 유저
USER : REPORT_HUNEL
PW : REPORTHUNEL

분리보관유저
USER : HUNELHTMLEHR_RET
PW : REPORT!HUNEL

URL / PORT / SID : 192.168.1.201:1521:orcl

```xml
<!-- 로컬 테스트 환경-->
<Service name="HUNELWEBSTAND">
  <Connector URIEncoding="utf-8" compressableMimeType="text/html,text/plain,text/xml,text/html,application/json,text/css,application/javascript,application/x-javascript" compression="on" compressionMinSize="256" connectionTimeout="20000" port="8100" protocol="HTTP/1.1" redirectPort="8443"/>
  <Connector URIEncoding="utf-8" maxParameterCount="-1" maxPostSize="-1" port="8297" protocol="AJP/1.3" redirectPort="8443"/>
  <Engine defaultHost="localhost" name="HUNELWEBSTAND">
    <Realm className="org.apache.catalina.realm.UserDatabaseRealm" resourceName="UserDatabase"/>
    <Host appBase="webapps" autoDeploy="true" name="localhost" unpackWARs="true" xmlNamespaceAware="false" xmlValidation="false">
      <Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs" pattern="common" prefix="hunel_access_log." resolveHosts="false" suffix=".txt"/>
        <Context docBase="C:/EHR_PROJECT/HUNEL_EHRS_WEB_STAND/WebRoot" path="" privileged="true" reloadable="true">
        <Resource auth="Container" connectionProperties="SetBigStringTryClob=true" driverClassName="oracle.jdbc.driver.OracleDriver" factory="org.apache.tomcat.dbcp.dbcp.BasicDataSourceFactory" maxActive="20" maxIdle="10" name="HUNELWEBSTAND" password="HUNEL!STANDARD" type="javax.sql.DataSource" url="jdbc:oracle:thin:@localhost:1521:orcl" username="HUNELSTANDARD" validationQuery="SELECT 1 FROM DUAL"/>
        <Resource auth="Container" connectionProperties="SetBigStringTryClob=true" driverClassName="oracle.jdbc.driver.OracleDriver"  factory="org.apache.tomcat.dbcp.dbcp.BasicDataSourceFactory" maxActive="20" maxIdle="10" name="HUNELWEBSTAND_RET" password="HUNEL!STANDARD" type="javax.sql.DataSource" url="jdbc:oracle:thin:@localhost:1521:orcl" username="HUNELHTMLEHR_RET" validationQuery="SELECT 1 FROM DUAL"/>
      </Context>
      </Host>
  </Engine>
</Service>

<!-- 서버 프로젝트 환경-->
<Service name="REPORT_HUNELWEBSTAND">
  <Connector URIEncoding="utf-8" compressableMimeType="text/html,text/plain,text/xml,text/html,application/json,text/css,application/javascript,application/x-javascript" compression="on" compressionMinSize="256" connectionTimeout="20000" port="8200" protocol="HTTP/1.1" redirectPort="8443"/>
  <Connector URIEncoding="utf-8" maxParameterCount="-1" maxPostSize="-1" port="8297" protocol="AJP/1.3" redirectPort="8443"/>
  <Engine defaultHost="localhost" name="REPORT_HUNELWEBSTAND">
    <Realm className="org.apache.catalina.realm.UserDatabaseRealm" resourceName="UserDatabase"/>
    <Host appBase="webapps" autoDeploy="true" name="localhost" unpackWARs="true" xmlNamespaceAware="false" xmlValidation="false">
      <Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs" pattern="common" prefix="hunel_access_log." resolveHosts="false" suffix=".txt"/>
        <Context docBase="C:/EHR_PROJECT/REPORT_EHRS_WEB_STAND/WebRoot" path="" privileged="true" reloadable="true">
        <Resource auth="Container" connectionProperties="SetBigStringTryClob=true" driverClassName="oracle.jdbc.driver.OracleDriver" factory="org.apache.tomcat.dbcp.dbcp.BasicDataSourceFactory" maxActive="20" maxIdle="10" name="HUNELWEBSTAND" password="REPORT!HUNEL" type="javax.sql.DataSource" url="jdbc:oracle:thin:@192.168.1.201:1521:orcl" username="REPORT_HUNEL" validationQuery="SELECT 1 FROM DUAL"/>
        <Resource auth="Container" connectionProperties="SetBigStringTryClob=true" driverClassName="oracle.jdbc.driver.OracleDriver" factory="org.apache.tomcat.dbcp.dbcp.BasicDataSourceFactory" maxActive="20" maxIdle="10" name="HUNELWEBSTAND_RET" password="REPORT!HUNEL" type="javax.sql.DataSource" url="jdbc:oracle:thin:@192.168.1.201:1521:orcl" username="HUNELHTMLEHR_RET" validationQuery="SELECT 1 FROM DUAL"/>
      </Context>
    </Host>
  </Engine>
</Service>
```


# 20일차 개발교육 - Report Designer
- admin / hunel
- RD_WEBROOT=localhost:8100
- report.common.param : 폰트 설정 파일
- secure.enable

- tomcat installation 방법