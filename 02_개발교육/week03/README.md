# 11일차 화면 실습(1)
- 권한모듈을 추가하고 권한에 해당하는 아이디로 접속했을 때 화면에 출력되게 할 것임.
- [IBSheet참고자료](/work/week03/practice/reference/IBSheetHTML개발자가이드_V7.0.13.pdf)

<br>
<hr>

## Eclipse 작업
- `WebRoot - pra - pr_bas - pr_bas_100_ul01.jsp` 생성
  - /pas/pa_bas/pa_bas_120_ul01.jsp 복사 후 이름 바꾸기
  - [Jsp코드참고](/work/week03/WebRoot/pra/pra_bas/pra_bas_100_ul01.jsp)

<br>
<hr>

## View 작업
- `tomcat server on - localhost:8100 로그인 - 우측 상단 시스템 탭 클릭`

<br>

- 권한 - 프로그램 관리 - 좌측 프로그램 관리 항목 - 추가
![](/work/week03/images/1.jpg)

<br>

- 코드 - 공통코드 - 코드/인덱스명에 `모듈` 입력 - /SY49 클릭 - 하단 코드항목 관리 - 추가
![](/work/week03/images/3.jpg)

<br>

- 권한 - 모듈관리 - 추가 - 모듈 선택 및 체크박스 전부 선택(삭제 빼고)
![](/work/week03/images/4.jpg)

<br>

- 프로파일별메뉴관리 - 프로파일 : HR_Admin, 모듈구분 : 지정한 모듈 이름 검색 - 추가
  - 입력시
  ![](/work/week03/images/5.jpg)

  - 프로그램 등록
  ![](/work/week03/images/5.5.jpg)

  - 완성본
  ![](/work/week03/images/6.jpg)

<br>
<hr>

## 중간점검
- `src - biz - pra - pra_bas - Pra_bas_100_ul01.java` 생성
  - biz.pas.pa_bas.Pa_bas_120_ul01.java 와 Pa_bas_120_ul01.xml 복사
  - [Java코드참고](/work/week03/practice/1step/src/biz/pra/pra_bas/Pra_bas_100_ul01.java)
  - [Xml코드참고](/work/week03/practice/1step/src/biz/pra/pra_bas/Pra_bas_100_ul01.xml)

- `View 다국어프로퍼티`는 Build 후 Build 경로에 넣어주는 것이 옳다.
  - `생성`은 src/하위에 저장되며 Build를 진행하면 classes 하위로 적용된다.
  - `js 생성`은 WebRoot/common/js/MuliLabel로 저장된다.
  - 기존 메세지 출력 방식은 프로퍼티에서 지정된 메세지를 출력하는 것이였으나 최근 성능상의 이슈로 js 파일로 메세지를 관리한다.
  - 최종적으론 DB 프로퍼티를 잘 관리해야한다.

<br>
<hr>

# 12일차 화면 실습(2)
- 정보 조회 및 CRUD 기능을 구현할 것임.
## View 작업
- IBSheet의 컬럼 정보 설정
  - IBSheetHTML 개발가이드_V7.0.13.x의 `4.3.3. 컬럼 정보 설정 참고`
  - EditLen의 길이는 `1500Byte / 한글(자당 3byte)`을 계산한다.

  <br>

  - `최종여부코드`가 `Combo 타입`이므로 `setCombo메소드를 설정`한다.
    ```js
    // 공통 코드는 /SY99 임
    setCombo("<%=hmPreparedData.get("/SY99")%>", arrC, 'LAST_YN', '1');
    ```
    
  <br>

  - initSheetColumn() 메소드로 컬럼 정보를 설정한다.
    ```js
    // common.js에 정의되어 있음
    initSheetColumn(sheet1, arrC, info, 1);
    // Sheet 컬럼의 정보는 무조건 initSheetColumn 메소드 위에 존재해야한다.
    // form에 그리는 메소드는 상관 없다.
    ```

<br>

- IBSheet의 헤더 정보 설정
  - IBSheetHTML 개발가이드_V7.0.13.x의 `4.3.2. 헤더 정보 설정`
    ```js
    var info = {Sort:1,ColMove:1,ColResize:1,HeaderCheck:1};  // HeaderCheck가 0이면 비활성화 됨
    ```
<br>
<hr>

## Eclipse 작업
- `Pra_bas_100_ul01.java의 prepareData 메소드 수정`

<br>

- **View의 추가 버튼에 대한 설정부분**
  ```java
    /**
     * 화면을 불러오기 전에 화면에서 사용할 데이터를 미리 준비한다.
     * ex) 콤보문자열, XML 데이터 등..
     * 
     * @param hunelBaseForm
     * @throws SQLException
     */
    @Override
    public HashMap<String, String> prepareData(hunelBaseForm form) throws SQLException
    {
        String S_C_CD = ehrbean.getCCD();
        String S_LANG_TYPE = ehrbean.get("LANG_TYPE");
        
        HashMap hmPreparedData = new HashMap();
        ComboDS comboDS = new ComboDS(conn, request, response);
        
        // 공통 코드 부분에 대한 설정
        hmPreparedData.put("/SY99", comboDS.getCodeCombo(S_C_CD, "/SY99", S_LANG_TYPE));
        
        return hmPreparedData;
    }
  ```
  - View의 `최종여부코드`에 대한 콤보를 설정하기 위해 hmPreparedData를 설정
    - 여기를 설정하지 않으면 콤보박스가 `null`로 표기된다.
      
      ![null표시](/work/week03/images/6.5.jpg)

      ![yn표시](/work/week03/images/6.6.jpg)

<br>

- **레코드의 조회에 대한 설정부분**
  - `Pra_bas_100_ul01.xml` 수정
  - 조회를 위한 Query 추가
    ```xml
    <?xml version='1.0' encoding='utf-8'?>
    <SQLResource version='1'>

    <query name='search01'><![CDATA[
    SELECT T1.C_CD,
          T1.EMP_ID,
          T1.SEQ_NO,
          T1.EQUIP_CD,
          T1.STA_YMD,
          T1.END_YMD,
          T1.LAST_YN,
          T1.NOTE,
          T1.INS_USER_ID,
          T1.MOD_USER_ID,
          T1.INS_YMDHMS,
          T1.INS_GYMDHMS,
          T1.MOD_YMDHMS,
          T1.MOD_GYMDHMS
    FROM ZZ1010 T1
    WHERE T1.C_CD = :C_CD
      AND T1.EMP_ID = :EMP_ID
      AND T1.END_YMD = :STA_YMD
      AND T1.STA_YMD = :END_YMD
    ]]></query>

    </SQLResource>
    ```
    - Parameter를 받는 컬럼의 콜론에 space가 있을 경우 에러 발생
      - ex) `: C_CD`

        ![에러사진](/work/week03/images/7.jpg)

    <br>

- `XML 등록 시 주의사항`
  - XML에서 설정을 할 수도, Java에서 설정을 할 수도 있다.
  - XML
    - EMP_ID의 값이 들어오지 않을 수 있으므로 Default 값을 설정해줘야 한다.
      ```sql
      AND (:EMP_ID IS NULL OR T1.EMP_ID = :EMP_ID)
      ```

    <br>

    - `시작일 ~ 종료일`의 설정도 범위 검색이므로 주의해야 한다.
      - 시작일은 `종료일보다 작고` 종료일은 `시작일보다 크면` 된다.
        ```sql
        AND T1.END_YMD >= :STA_YMD
        AND T1.STA_YMD <= :END_YMD
        ```

      <br>

      - Null 값으로 검색될 수 있으므로 Null에 대한 처리도 해야 한다.
        ```sql
        AND T1.END_YMD >= NVM(:STA_YMD, '19000101')
        AND T1.STA_YMD <= NVL(:END_YMD, '99991231')
        ```
        - 19000101은 임의의 Min 값, 99991231은 임의의 Max 값이다.
    
      <br>

  - Java
    ```java
        /**
         * 사번관리 조회
         * 
         * @param form hunelBaseForm
         * @throws SQLException
         */
        public void search01(hunelBaseForm form) throws SQLException
        {
            //동적 쿼리부분 삭제
            // String S_C_CD = ehrbean.getCCD();
            // StringBuffer sb = new StringBuffer(100);
            // sb.append("AND NVL(T1.WEEK_FINANC_YN, 'N') = 'N' \n");
            String S_C_CD = ehrbean.getCCD();

            // String query = xmlQuery.getElement(this, "search01", block,null);
            String query = xmlQuery.getElement(this, "search01", null);
            
            VarStatement vstmt = new VarStatement(conn, query, request, null);

            // 값 수정
            // vstmt.setParameter("C_CD", S_C_CD);
            // vstmt.setParameter("STA_YMD", form.getValue("S_STA_YMD"));
            // vstmt.setParameter("END_YMD", form.getValue("S_END_YMD"));

            vstmt.setParameter("C_CD", ehrbean.getCCD());
            vstmt.setParameter("EMP_ID",  form.getValue("S_EMP_ID"));
            vstmt.setParameter("STA_YMD", form.getValue("S_STA_YMD"));
            vstmt.setParameter("END_YMD", form.getValue("S_END_YMD"));
            log.debug(vstmt.getQueryString());
            setResultSet(SQLUtil.getResultSetWithClose(vstmt));
        }
    ```
    - 기존 코드에서 동적 쿼리 생성부분은 현재 필요 없으므로 삭제
      - xmlQuery.getElement(this, "search01", block,null); 의 block 제거

    <br>

    - vstmt에 대한 Parameter 설정(XML과 통신하는 부분)
      - Null에 대한 처리는 Java에서도 할 수 있다.
        ```java
        // 기본적으로 Optional한 메소드들은 명시적으로 값을 넣어주자(Default)
        // 필수조건이라면 Null 체크를 할 필요는 없다.
        // 이런 부분은 KeyField(필수 조건)도 아니므로 SQL에서 처리하는 것이 옳은 것 같다.
        vstmt.setParameter("STA_YMD", StringUtil.nvl(form.getValue("S_STA_YMD"), "19000101"));
        vstmt.setParameter("END_YMD", StringUtil.nvl(form.getValue("S_END_YMD"), "99991231"));
        ```

<br>

- 조회 확인

  ![조회결과](/work/week03/images/8.jpg)
  - 데이터가 없으므로 정상적인 결과이다.

<br>
<hr>

## View 작업
- 칼럼 추가시 Default 값 설정(jsp)
  ```js
  // inputSetValueAuto("F_STA_YMD", addYmd("<%=TO_YMD%>", "D", -7));
  // inputSetValueAuto("F_END_YMD", addYmd("<%=TO_YMD%>", "D", 7));
  // 기간 조회 default 값 설정
  // header_nologin.jsp에 존재
  inputSetValueAuto("F_STA_YMD", "<%=TO_YY%>" + "0101");
  inputSetValueAuto("F_END_YMD", "<%=TO_YY%>" + "1231");
  ```
  - TO_YY는 이미 설정되어 있는 값으로 호출하여 사용한다.
    - 첫번째는 2019+0131, 20191231이라는 의미이다.

  <br>

  - insert01 메소드 설정(jsp)
    - 미설정시 마주하는 화면
      
      ![에러화면](/work/week03/images/9.jpg)

    <br>

    - `doAction 메소드 수정`
      ```js
      case "<com:otp value='insert01' />":      // 입력
      {
        // 시트 로우 추가, common.js 에 정의되어있음, 절대 인덱스를 리턴함
        var Row = sheetDataInsert(sheet1);
        
        // 불필요하므로 삭제
        // sheet1.SetCellValue(Row,"STD_YY", "<%=TO_YY%>");
        // sheet1.SetCellValue(Row,"EXPT_ENTER_YMD", "<%=TO_YMD%>");
        // sheet1.SetCellValue(Row, "C_CD",$('#S_C_CD').val());
        // ajaxRequestXSProg($("#S_DSCLASS").val(), "<com:otp value='sh_NTNL_CODE' />",  {}, function(xs){
        // var ETC_COM_NTNL_CD = xs.GetEtcData("COM_NTNL_CD");
        // sheet1.SetCellValue(Row, "COM_NTNL_CD",ETC_COM_NTNL_CD);
        // });
        sheet1.SetCellValue(Row,"STA_YMD", "<%=TO_YY%>" + "0101");
        sheet1.SetCellValue(Row,"END_YMD", "<%=TO_YY%>" + "1231");
        sheet1.SetCellValue(Row,"LAST_YN", "N");
      }
      break;
      ```

      <br>

    - 설정 후 화면

      ![출력화면](/work/week03/images/10.jpg)

<br>

- 칼럼 복사 메소드 수정(jsp)
  ```js
  case "<com:otp value='copy01' />":
  {
    var Row = sheet1.DataCopy();
    // 필요 없음
    // sheet1.SetCellValue(Row,"STD_YY", "<%=TO_YY%>");
  }
  break;
  ```

<br>

- jsp코드를 작성함에 있어서 반드시 포함해야하는 메소드
  ```js
  function sheet1_OnSearchEnd(ErrCode, ErrMsg)
  {
    // 휴넬 공통코드, 에러를 체크하고 에러가 있으면 메세지를 출력한다.
    // 코드를 수정할 일은 절대 없음. 그대로 가져다 쓰면 됨
    if ( ! doCheckMsg(ErrMsg) ) return;
    if ( ErrCode )
    {
      alert(ajaxMsg("MSG_ALERT_SEARCH_FAIL") + (ErrMsg ? "\n\n"+ ErrMsg : ""));
    }
    // 다음 로직을 추가할 것이라면 else 문으로 함
  // else
  //     alert("조회완료!");
  }
  ```

<br>

- 추가된 컬럼의 사번에 돋보기(검색) 버튼 눌러도 작동하도록 설정한다.
  - jsp에 메소드 추가(참고 : WebRoot/cdp/cd_talent/cd_talent_110_ul01.jsp)
    ```js
    function sheet1_OnPopupClick(Row, Col) 
    {
      var colnm = sheet1.ColSaveName(Col);
      switch ( colnm )
      {
        case "EMP_ID":
        {
          ModalUtil.open({title:"<com:label key='search_emp' def='직원찾기' />", url: "/sys/sy_com/sy_com_150_p01.jsp", param: {S_SELMODE:"S"}}, function(rv){
            if(rv != null)
            {
              var grid = rv;
              for ( var row = 0; row < grid.RowCount; row++ )
              {
                sheet1.SetCellValue(Row, "EMP_ID", grid_GetCellValue(grid, row, "EMP_ID"));
                sheet1.SetCellValue(Row, "EMP_NM", grid_GetCellValue(grid, row, "EMP_NM"));
                sheet1.SetCellValue(Row, "ORG_NM", grid_GetCellValue(grid, row, "ORG_NM"));
                sheet1.SetCellValue(Row, "EMP_GRADE_NM", grid_GetCellValue(grid, row, "EMP_GRADE_NM"));
                sheet1.SetCellValue(Row, "DUTY_NM", grid_GetCellValue(grid, row, "DUTY_NM"));
                break; // 한개만 가져오므로
              }
            }
          });
        }
        break;
      }
    }
    ```
    
    <br>

    - 메소드 추가 후 화면으로 가서 `시스템 - 프로그램 관리 클릭`
    
      ![등록화면](/work/week03/images/11.jpg)
    - 등록한 프로그램 검색, 클릭 후 우측 프로그램별 팝업관리 창 확인
    - 사원추가, 조직추가 버튼을 클릭하여 레코드 삽입
      - 자주 사용하는 팝업창이므로 버튼을 별도로 분리해놓음

<br>

- 적용 후 사번의 돋보기(검색) 버튼 클릭 시 화면

  ![적용화면](/work/week03/images/12.jpg)
  ![적용화면](/work/week03/images/13.jpg)
  ![적용화면](/work/week03/images/14.jpg)

<br>
<hr>

## Eclipse 작업
- save기능을 구현할 것임
  - `src/biz/pas/pa_bas/Pa_bas_240_ul01.java`의 save01 메소드임
  - [소스코드](/work/week03/practice/2step/save01before.java)

<br>

- 기존 save01은 삭제해도 무방
  - [소스코드](/work/week03/practice/2step/save01after.java)
  - *해당 항목에 대한 설명은 소스코드를 참고하는 것이 좋다.*

<br>
<hr>

## 중간점검
- 사진

  ![1](/work/week03/images/15.jpg)
  ![2](/work/week03/images/16.jpg)
  ![3](/work/week03/images/17.jpg)

<br>

- 코드
  - [Java코드참고](/work/week03/practice/2step/src/biz/pra/pra_bas/Pra_bas_100_ul01.java)
  - [Xml코드참고](/work/week03/practice/2step/src/biz/pra/pra_bas/Pra_bas_100_ul01.xml)
  - [Jsp코드참고](/work/week03/practice/2step/WebRoot/pra/pra_bas/pra_bas_100_ul01.jsp)

<br>
<hr>

# 13일차 화면 실습(3)
- 테이블의 `최종여부` 컬럼을 `반납여부`로 교체할 것임
  - [SQL](/work/week03/practice/sql/190320_practice_pre.sql)
  - jsp, java, xml 파일의 "LAST_YN"을 "RETURN_YN"으로 변경

- 메뉴의 h2태그를 설정하지 않았는데 자동으로 가져옴 : 다국어프로퍼티 작동
  ```js
  <h2 class="titA">
    <%=StringUtil.nvl(request.getParameter("X_MENU_NM"), resourceLabel.getString("crt_emp_id"))%>
  </h2>
  ```

- 브랜드 컬럼에 넣을 공통코드를 추가할 것임
  - 코드 인덱스 추가(ZZ01)
    - `/ZZ01`과 `ZZ01`의 차이

  ![코드인덱스](/work/week03/images/18.jpg)
  ![공통코드](/work/week03/images/19.jpg)

- 컬럼 정보 설정과 조회, 추가 작성해보기
  - pm_bas_560_f04.jsp
    ```js
    <span><select id="S_COPY_PROFILE_ID" name="S_COPY_PROFILE_ID" class="insert_select"></select></span>
    ```

<br>
<hr>

# 14일차 화면 실습(4)

<br>
<hr>

# 3주차 과제
- [Oracle SQL문을 작성하시오.](/work/week03/sql/Query03.md)

