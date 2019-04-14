-- auto-generated definition
create table GIF210
(
  C_CD                  VARCHAR2(20)          not null,
  APPL_ID               VARCHAR2(60)          not null,
  GIF_TYPE              VARCHAR2(20),
  GIF_MON               NUMBER      default 0 not null,
  NOTE                  VARCHAR2(1500),
  INS_USER_ID           VARCHAR2(20),
  INS_YMDHMS            TIMESTAMP(6),
  MOD_USER_ID           VARCHAR2(20),
  MOD_YMDHMS            TIMESTAMP(6),
  INS_GYMDHMS           TIMESTAMP(6) WITH TIME ZONE,
  MOD_GYMDHMS           TIMESTAMP(6) WITH TIME ZONE,
  PSN_INFO_SEPA_STOR_YN VARCHAR2(1) default 'N',
  CON_YMD               VARCHAR2(8),
  constraint PK_I_GIF210
    primary key (C_CD, APPL_ID)
)
/

comment on table GIF210 is '(GIF210)실습_명절선물신청'
/

comment on column GIF210.C_CD is '회사코드'
/

comment on column GIF210.APPL_ID is '신청서ID'
/

comment on column GIF210.GIF_TYPE is '선물유형'
/

comment on column GIF210.GIF_MON is '회사지원금'
/

comment on column GIF210.NOTE is '비고'
/

comment on column GIF210.INS_USER_ID is '입력자ID'
/

comment on column GIF210.INS_YMDHMS is '입력일시'
/

comment on column GIF210.MOD_USER_ID is '작업자ID'
/

comment on column GIF210.MOD_YMDHMS is '수정일시'
/

comment on column GIF210.INS_GYMDHMS is '입력일시_현지'
/

comment on column GIF210.MOD_GYMDHMS is '수정일시_현지'
/

