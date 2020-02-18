# 목차

- [목차](#%eb%aa%a9%ec%b0%a8)
- [메소드](#%eb%a9%94%ec%86%8c%eb%93%9c)
  - [JavaScript Function](#javascript-function)
  - [Java Method](#java-method)
  - [XML query name](#xml-query-name)

<br>
<br>
<hr>

# 메소드
## JavaScript Function
- JavaScript의 doAction Function 파라미터 값(sAction)을 Java의 Method명, XML query의 name명으로 동일하게 맞춰준다.

    | 파일 종류     | 유형   | 동일 값 |
    | :-------- |:------ |:------ |
    |.JSP|	`Function(파라미터)[doAction(sAction)]`|	save01|
    |.JAVA|	Method|	save01|
    |.XML|	Query|	save01|

    <br>

- 자주 사용하는 아래의 Method들은 이름을 지켜주며, 필요에 따라 시퀀셜하게 번호를 붙여준다.

    | 기능     | Method Name   | 예시 |
    | :-------- |:------ |:------ |
    |조회|	searchXX|	search01, search02|
    |추가|	insertXX|	Insert01, Insert02|
    |삭제|	deleteXX|	delete01, delete02|
    |저장|	saveXX|	save01, save02|
    |실행|	execXX|	exec01, exec02|
    |엑셀 다운로드|	down2excelXX|	down2excel01, down2excel02|
    |엑셀 업로드|	upload2excelXX|	upload2excel01, upload2excel02|

    <br>

- 축약형(Abbreviation)과 두문자어형(頭文字語: Acronym)을 이름에 사용할 경우에는 전부 대문자로 지정하지 않는다.(카멜표기법)

    | 올바른 방법     | 틀린 방법   |
    | :-------- |:------ |
    |exportHtmlSource()|	exportHTMLSource()|
    |openDvdPlayer()|	openDVDPlayer()|

    <br>

- 메소드의 이름은 대소문자를 혼용할 수 있지만 반드시 동사를 사용하며 소문자로 시작한다.(카멜표기법)
    ```js
    getName(), computeTotalWidth()
    ```

    <br>

- 명확한  이름을 주어야 하는 경우가 아닌 일반적인 변수의 이름은 타입의 이름과 동일하게 지정한다.
  - 옳은 방법
    ```js
    void setTopic (Topic topic)
    --------------------------------
    void connect (Database database)
    ```
  - 틀린 방법
    ```js
    void setTopic (Topic value) 
    void setTopic (Topic aTopic) 
    void setTopic (Topic x)
    --------------------------------
    void connect (Database db) 
    void connect (Database oracleDB)
    ```

    <br>

- 호출하려는 객체의 이름을 통해 의미를 짐작할 수 있다면, 메소드의  이름을 간략화할 수 있다.
  - 옳은 방법
    ```js
    line.getLength()
    ```
  - 틀린 방법
    ```js
    line.getLineLength()
    ```

<br>

[위로](#목차)

<br>
<hr>

## Java Method
- JavaScript의 hidden object, S_DSMETHOD value값과 동일하다.
- JavaScript의 doAction Parameter값과 동일하다.
- 기본적으로 카멜표기법을 사용한다.

<br>

[위로](#목차)

<br>
<hr>

## XML query name
- JavaScript의 hidden object, S_DSMETHOD value값과 동일하다.
- JavaScript의 doAction Parameter값과 동일하다.
- Java Method명과 동일하다.

<br>

[위로](#목차)

<br>
<hr>