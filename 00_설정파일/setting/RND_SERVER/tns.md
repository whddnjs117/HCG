# R & D 서버
- TNS 클라이언트
- LISTENER 서버

<br>
<hr>

## 설정
### 파일 설정
- {oracle 설치 위치}/product\11.2.0\dbhome_1\NETWORK\ADMIN
- sqlnet.ora : `관리자 권한으로 실행`
    ```sh
    # 주석처리하기
    #SQLNET.AUTHENTICATION_SERVICES= (NTS)
    ```

<br>
<hr>

## 클라이언트 설정
- host : `1.234.41.25`
- port : `1521`
- SID : `RND`
- user/pw : `HUNELSTANDARD_TAM2 / HUNEL!STANDARD`

<br>

[뒤로](https://github.com/InSeong-So/HCG_OJT)

<br>
<hr>
