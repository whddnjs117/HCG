-- **************************************************************************
-- 지급유형_탭
-- **************************************************************************
CREATE TABLE PR3591
(
  C_CD        VARCHAR2(20)     NOT NULL,
  GIV_TYPE    VARCHAR2(20)     NOT NULL,
  GIV_TAB     VARCHAR2(20)     NOT NULL,
  ORDER_NO    NUMBER DEFAULT 0 NOT NULL,
  NOTE        VARCHAR2(500),
  INS_USER_ID VARCHAR2(20),
  INS_YMDHMS  TIMESTAMP(6),
  MOD_USER_ID VARCHAR2(20),
  MOD_YMDHMS  TIMESTAMP(6),
  INS_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
  MOD_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
  CONSTRAINT PK_I_PR3591
    PRIMARY KEY (C_CD, GIV_TYPE, GIV_TAB)
);

COMMENT ON TABLE PR3591 IS '(PR3591)지급유형_탭';

COMMENT ON COLUMN PR3591.C_CD IS '회사코드';
COMMENT ON COLUMN PR3591.GIV_TYPE IS '지급유형';
COMMENT ON COLUMN PR3591.GIV_TAB IS '지급TAB';
COMMENT ON COLUMN PR3591.ORDER_NO IS '정렬순서';
COMMENT ON COLUMN PR3591.NOTE IS '비고';
COMMENT ON COLUMN PR3591.INS_USER_ID IS '입력자ID';
COMMENT ON COLUMN PR3591.INS_YMDHMS IS '입력일시';
COMMENT ON COLUMN PR3591.MOD_USER_ID IS '작업자ID';
COMMENT ON COLUMN PR3591.MOD_YMDHMS IS '수정일시';
COMMENT ON COLUMN PR3591.INS_GYMDHMS IS '입력일시_현지';
COMMENT ON COLUMN PR3591.MOD_GYMDHMS IS '수정일시_현지';
-- **************************************************************************