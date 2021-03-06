DROP TABLE PR3210_TMP CASCADE CONSTRAINTS PURGE;
CREATE GLOBAL TEMPORARY TABLE PR3210_TMP
(
  C_CD         VARCHAR2(20) NOT NULL,
  EMP_ID       VARCHAR2(60) NOT NULL,
  GIV_STD_ID   VARCHAR2(60),
  ORG_ID       VARCHAR2(60),
  EMP_GRADE_CD VARCHAR2(60)
)
  ON COMMIT DELETE ROWS;
ALTER TABLE PR3210_TMP
  ADD CONSTRAINT PK_I_PR3210_TMP PRIMARY KEY (C_CD, EMP_ID, GIV_STD_ID);

COMMENT ON TABLE PR3210_TMP IS '유니폼지급대상자임시테이블';

COMMENT ON COLUMN PR3210_TMP.C_CD IS '회사코드';
COMMENT ON COLUMN PR3210_TMP.EMP_ID IS '사번';
COMMENT ON COLUMN PR3210_TMP.GIV_STD_ID IS '지급회차ID';
COMMENT ON COLUMN PR3210_TMP.ORG_ID IS '조직코드';
COMMENT ON COLUMN PR3210_TMP.EMP_GRADE_CD IS '직급코드';