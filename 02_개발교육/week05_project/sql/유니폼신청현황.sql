-- auto-generated definition
create table GIF220
(
  C_CD        VARCHAR2(20)     not null,
  DATA_ID     VARCHAR2(60)     not null,
  EMP_ID      VARCHAR2(20),
  GIF_TYPE    VARCHAR2(20),
  GIF_MON     NUMBER default 0 not null,
  NOTE        VARCHAR2(4000),
  IN_TYPE     VARCHAR2(20),
  APPL_ID     VARCHAR2(60),
  INS_USER_ID VARCHAR2(20),
  INS_YMDHMS  TIMESTAMP(6),
  MOD_USER_ID VARCHAR2(20),
  MOD_YMDHMS  TIMESTAMP(6),
  INS_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
  MOD_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
  CON_YMD     VARCHAR2(8),
  constraint PK_I_GIF220
    primary key (C_CD, DATA_ID)
)
/

comment on table GIF220 is '(GIF220)실습_명절선물관리'
/

comment on column GIF220.C_CD is '회사코드'
/

comment on column GIF220.DATA_ID is '자료ID'
/

comment on column GIF220.EMP_ID is '사번'
/

comment on column GIF220.GIF_TYPE is '선물유형'
/

comment on column GIF220.GIF_MON is '회사지원금'
/

comment on column GIF220.NOTE is '비고'
/

comment on column GIF220.IN_TYPE is '입력유형'
/

comment on column GIF220.APPL_ID is '신청서ID'
/

comment on column GIF220.INS_USER_ID is '입력자ID'
/

comment on column GIF220.INS_YMDHMS is '입력일시'
/

comment on column GIF220.MOD_USER_ID is '작업자ID'
/

comment on column GIF220.MOD_YMDHMS is '수정일시'
/

comment on column GIF220.INS_GYMDHMS is '입력일시_현지'
/

comment on column GIF220.MOD_GYMDHMS is '수정일시_현지'
/

