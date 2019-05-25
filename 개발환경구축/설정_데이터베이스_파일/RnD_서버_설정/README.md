# R & D 서버 설정 방법
> TNS 클라이언트 / LISTENER 서버

## 설정
### 파일 설정
- {oracle 설치 위치}/product/11.2.0/dbhome_1/NETWORK/ADMIN
- sqlnet.ora : `관리자 권한으로 실행`
    ```sh
    # 주석처리하기
    #SQLNET.AUTHENTICATION_SERVICES= (NTS)
    ```

## 클라이언트 설정
- *HOST*
  - **`1.234.41.25`**

<br>

- *PORT*
  - **`1521`**

<br>

- *SID*
  - **`RND`**

<br>

- *USERNAME/PASSWORD*
  - **`HUNELSTANDARD_TAM2 / HUNEL!STANDARD`**

<hr>
<br>

[뒤로](https://github.com/hcgnine/Guide)

<br>
<hr>