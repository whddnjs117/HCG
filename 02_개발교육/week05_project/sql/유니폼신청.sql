-- auto-generated definition
create table GIF020
(
  C_CD        VARCHAR2(20)     not null,
  GIF_TYPE    VARCHAR2(20)     not null,
  GIF_MON     NUMBER default 0 not null,
  NOTE        VARCHAR2(1500),
  INS_USER_ID VARCHAR2(20),
  INS_YMDHMS  TIMESTAMP(6),
  MOD_USER_ID VARCHAR2(20),
  MOD_YMDHMS  TIMESTAMP(6),
  INS_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
  MOD_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
  constraint PK_I_GIF020
    primary key (C_CD, GIF_TYPE)
)
/

comment on table GIF020 is '(GIF020)실습_명절선물'
/

comment on column GIF020.C_CD is '회사코드'
/

comment on column GIF020.GIF_TYPE is '선물유형'
/

comment on column GIF020.GIF_MON is '회사지원금'
/

comment on column GIF020.NOTE is '비고'
/

comment on column GIF020.INS_USER_ID is '입력자ID'
/

comment on column GIF020.INS_YMDHMS is '입력일시'
/

comment on column GIF020.MOD_USER_ID is '작업자ID'
/

comment on column GIF020.MOD_YMDHMS is '수정일시'
/

comment on column GIF020.INS_GYMDHMS is '입력일시_현지'
/

comment on column GIF020.MOD_GYMDHMS is '수정일시_현지'
/

