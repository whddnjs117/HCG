-- **************************************************************************
-- PR3265 유니폼증빙파일
-- **************************************************************************
create table PR3265
(
  C_CD        VARCHAR2(20) not null,
  UNIF_CD     VARCHAR2(20) not null,
  FILE_TYPE   VARCHAR2(20) not null,
  NOTE        VARCHAR2(4000),
  FILE_NO     VARCHAR2(60),
  INS_USER_ID VARCHAR2(20),
  INS_YMDHMS  TIMESTAMP(6),
  MOD_USER_ID VARCHAR2(20),
  MOD_YMDHMS  TIMESTAMP(6),
  INS_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
  MOD_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
  constraint PK_I_PR3265
    primary key (C_CD, UNIF_CD, FILE_TYPE),
  constraint NI_SY9030_PR3265
    foreign key (C_CD, FILE_NO) references SY9030
);

comment on table PR3265 is '(PR3265)유니폼_증빙파일';

comment on column PR3265.C_CD is '회사코드';
comment on column PR3265.UNIF_CD is '유니폼코드';
comment on column PR3265.FILE_TYPE is '파일유형';
comment on column PR3265.NOTE is '비고';
comment on column PR3265.FILE_NO is '파일번호';
comment on column PR3265.INS_USER_ID is '입력자ID';
comment on column PR3265.INS_YMDHMS is '입력일시';
comment on column PR3265.MOD_USER_ID is '작업자ID';
comment on column PR3265.MOD_YMDHMS is '수정일시';
comment on column PR3265.INS_GYMDHMS is '입력일시_현지';
comment on column PR3265.MOD_GYMDHMS is '수정일시_현지';
-- **************************************************************************