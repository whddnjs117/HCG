# 부록 : ServerClass 설치

## Oracle 11g Release 2 `Server Class` 로 설치
> 이 문서는 `서버 클래스` 설치 순서를 기록해놓은 것임
>> `데스크톱 클래스` 설치 순서는 [여기](설치_오라클_images/README.md) 참고

<hr>

### setup 실행

![setup_실행](설치_오라클_images/images/00-4.jpg)

<hr>

### 보안갱신 구성
- `My Oracle Support를 통해 보안 갱신 수신` 체크 해제 후 다음 선택

    ![설치_01](설치_오라클_images/images/01.jpg)

- `Popup 창 전자 메일 주소를 제공하지 않습니다.` 의 "예" 를 선택

    ![설치_02](설치_오라클_images/images/02.jpg)

<hr>

### 설치 옵션
- `데이터베이스 생성 및 구성` 체크 후 다음 선택

    ![설치_03](설치_오라클_images/images/03.jpg)

<hr>

### 시스템 클래스
- 데이터베이스 최소화하여 설치할 것이므로 `서버 클래스` 체크

    ![설치_04](설치_오라클_images/images/50.jpg)

<hr>

### Grid 설치 옵션
- `단일 인스턴스 데이터베이스 설치` 체크 후 다음 선택

    ![설치_05](설치_오라클_images/images/51.jpg)

<hr>

### 설치 유형
- `고급 설치` 체크 후 다음 선택

    ![설치_06](설치_오라클_images/images/52.jpg)

<hr>

### 제품 언어
- `영어`가 맨 위로, `한국어`가 영어 아래로 오게 선택

    ![설치_07](설치_오라클_images/images/53.jpg)

<hr>

### 데이터베이스 버전
- `Enterprise Edition` 체크 후 다음 선택

    ![설치_08](설치_오라클_images/images/54.jpg)

<hr>

### 설치 위치
- 데이터베이스를 설치할 베이스 경로를 확인하고 다음 선택

    ![설치_09](설치_오라클_images/images/55.jpg)

<hr>

### 구성 유형
- `일반용/트랜잭션 처리` 체크 후 다음 선택

    ![설치_10](설치_오라클_images/images/56.jpg)

<hr>

### 데이터베이스 식별자
- `전역 데이터베이스 이름`과 `Oracle SID`를 **orcl** 입력 후 다음 선택

    ![설치_11](설치_오라클_images/images/57.jpg)

<hr>

### 구성 옵션
- `메모리` 탭 부분에서 사용자 임의로 메모리 사용 지정

    ![설치_12](설치_오라클_images/images/58.jpg)

- `문자 집합` 탭 부분에서 `유니코드(AL32UTF8) 사용` 체크 후 다음 선택

    ![설치_13](설치_오라클_images/images/59.jpg)

<hr>

### 관리 옵션
- 다음 선택

    ![설치_14](설치_오라클_images/images/60.jpg)

<hr>

### 데이터베이스 저장 영역
- `데이터베이스 파일 위치 지정` 위치 확인 후 다음 선택

    ![설치_15](설치_오라클_images/images/61.jpg)

<hr>

### 백업 및 복구
- 사용자 임의로 `자동 백업을 사용할 것인지 아닌지`를 체크 후 다음 선택

    ![설치_16](설치_오라클_images/images/62.jpg)

<hr>

### 스키마 비밀번호
- 계정의 암호를 `다르게` 변경하거나 혹은 `동일하게` 사용자 임의로 체크 후 다음 선택

    ![설치_17](설치_오라클_images/images/63.jpg)

<hr>

### 요약
- 최종 설치할 정보 확인 후 완료 선택

    ![설치_18](설치_오라클_images/images/64.jpg)

<hr>

### 제품 설치

![설치_08](설치_오라클_images/images/08.jpg)

<hr>

![설치_09](설치_오라클_images/images/09.jpg)

<hr>

![설치_10](설치_오라클_images/images/10.jpg)

  - `비밀번호 관리`를 선택하면 잠글 계정과 잠그지 않을 계정 확인 가능

    ![설치_11](설치_오라클_images/images/11.jpg)

<hr>

### 설치 완료

![설치_12](설치_오라클_images/images/12.jpg)

<hr>

## Oracle Database Batch 작성
### 오라클 서비스 정상 작동 확인

![설치_13](설치_오라클_images/images/13.jpg)

- 오라클은 컴퓨터 시작과 동시에 자동으로 켜짐
  - 이는 RAM 및 컴퓨터 자원을 소모하게 됨
  - 사용자 임의로 On/Off가 가능해야 함

<hr>

### 오라클 서비스 수동으로 변경하기
- `시작 - 서비스 검색 - Oracle 항목으로 이동`
  - `시작 유형`이 **자동** 인 항목들에 우클릭
  - `속성` 선택 후 자동을 **수동**으로 변경

<hr>

### 배치 파일 ~~작성하기~~첨부
- [오라클 서비스 시작 및 종료](00_설정파일/setting/ORACLE_INSTALL/batch/)

<hr>

## Reference
[CURVC ALM Space](https://confluence.curvc.com/pages/viewpage.action?pageId=4358773)