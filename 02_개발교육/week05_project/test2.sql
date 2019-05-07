create table PA1010
(
	C_CD VARCHAR2(20) not null,
	EMP_ID VARCHAR2(20) not null,
	STAT_CD VARCHAR2(20),
	ENTER_TYPE VARCHAR2(20),
	BIZPL_CD VARCHAR2(20),
	RE_GRD_CD VARCHAR2(20),
	ENTER_YMD VARCHAR2(8),
	GRP_YMD VARCHAR2(8),
	RETIRE_YMD VARCHAR2(8),
	EXPT_PROB_END_YMD VARCHAR2(8),
	ATTEND_STA_YMD VARCHAR2(8),
	RET_STA_YMD VARCHAR2(8),
	LAST_MOVE_YMD VARCHAR2(8),
	LAST_PROM_YMD VARCHAR2(8),
	SAL_STEP_YMD VARCHAR2(8),
	DUTY_APP_YMD VARCHAR2(8),
	NEXT_SAL_STEP_YMD VARCHAR2(8),
	LAST_EMP_TITLE_PROM_YMD VARCHAR2(8),
	PER_NO VARCHAR2(36),
	OFR_STA_YMD VARCHAR2(8),
	GENDER_TYPE VARCHAR2(20),
	EMP_NM VARCHAR2(300),
	CHA_EMP_NM VARCHAR2(300),
	ENG_EMP_NM VARCHAR2(300),
	BIRTH_YMD VARCHAR2(8),
	LNS_TYPE VARCHAR2(20),
	MARRY_YN VARCHAR2(1) default 'N'
		constraint YN2036
			check ( MARRY_YN IN ('Y', 'N') ),
	MARRY_YMD VARCHAR2(8),
	FAM_ORGN_NM VARCHAR2(300),
	FAM_MASTER_NM VARCHAR2(300),
	FAM_MASTER_RELA_CD VARCHAR2(20),
	RELIGION_CD VARCHAR2(20),
	HOBBY_TXT VARCHAR2(300),
	SKILL_TXT VARCHAR2(300),
	BODY_HEIGHT NUMBER default 0,
	BODY_WT NUMBER default 0,
	LEFT_SIGHT_NUM NUMBER default 0,
	RIGHT_SIGHT_NUM NUMBER default 0,
	BLOOD_TYPE VARCHAR2(20),
	COLORSENSE_CD VARCHAR2(20),
	HOUSEHOLD_CD VARCHAR2(20),
	IDTY_SCH_YN VARCHAR2(1) default 'N'
		constraint YN2037
			check ( IDTY_SCH_YN IN ('Y', 'N') ),
	NTNL_CD VARCHAR2(20),
	OFFICE_TEL_NO VARCHAR2(300),
	TEL_NO VARCHAR2(300),
	EGC_TEL_NO VARCHAR2(300),
	MOBILE_NO VARCHAR2(300),
	MAIL_ADDR VARCHAR2(150),
	HOMEP_ADDR VARCHAR2(300),
	PHOTO_PATH VARCHAR2(300),
	BF_EMP_ID VARCHAR2(20),
	BASEAREA_CD VARCHAR2(20),
	BIRTH_LOC_CD VARCHAR2(20),
	OUT_DISP_ASSO_CD VARCHAR2(20),
	RET_ORG_NM VARCHAR2(300),
	RET_EMP_GRADE_NM VARCHAR2(300),
	ASSO_EMP_GRADE_NM VARCHAR2(300),
	PSPT_NO VARCHAR2(60),
	PSPT_END_YMD VARCHAR2(8),
	PSPT_KIND_CD VARCHAR2(20),
	UNION_TYPE VARCHAR2(20),
	FIRST_EMP_ID VARCHAR2(20),
	RESI_YN VARCHAR2(1) default 'N'
		constraint YN2038
			check ( RESI_YN IN ('Y', 'N') ),
	REG_DRT_YN VARCHAR2(1) default 'N'
		constraint YN2039
			check ( REG_DRT_YN IN ('Y', 'N') ),
	RECMD_NM VARCHAR2(300),
	GRP_TRANS_YMD VARCHAR2(8),
	RET_RSN_CD VARCHAR2(20),
	RE_TYPE VARCHAR2(20),
	GRADE_STA_YMD VARCHAR2(8),
	SPC_JG_CD VARCHAR2(20),
	CAREER_PROM_POINT NUMBER default 0,
	LOC_CD VARCHAR2(20),
	MEDI_NOTE VARCHAR2(4000),
	OUT_MAIL_ADDR VARCHAR2(150),
	TAX_LOC_CD VARCHAR2(20),
	EMP_TITLE_STD_YMD VARCHAR2(8),
	PROM_STD_YMD VARCHAR2(8),
	EMP_TYPE_CHG_YMD VARCHAR2(8),
	CEN_RNW_YMD VARCHAR2(8),
	RECMD_RELA_CD VARCHAR2(20),
	PHOTO_YN VARCHAR2(1) default 'N'
		constraint YN2040
			check ( PHOTO_YN IN ('Y', 'N') ),
	SIGN_YN VARCHAR2(1) default 'N'
		constraint YN2041
			check ( SIGN_YN IN ('Y', 'N') ),
	BOND_C_CD VARCHAR2(20),
	BOND_ACC_NO VARCHAR2(300),
	INS_USER_ID VARCHAR2(20),
	INS_YMDHMS TIMESTAMP(6),
	MOD_USER_ID VARCHAR2(20),
	MOD_YMDHMS TIMESTAMP(6),
	INS_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
	MOD_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
	ASSO_MON_DDCT_YN VARCHAR2(1) default 'N',
	TIMEZONECD VARCHAR2(20),
	STEP_UP_STD_YMD VARCHAR2(8),
	NEW_ASSIGN_YMD VARCHAR2(8),
	RE_ORDER_NO VARCHAR2(200),
	ATTEND_JG VARCHAR2(20),
	CP_CD VARCHAR2(20),
	EMP_UID VARCHAR2(60),
	PSN_INFO_DATA_STOR_Y_CNT NUMBER default 5 not null,
	PSN_INFO_SEPA_STOR_YN VARCHAR2(1) default 'N',
	constraint PK_I_PA1010
		primary key (C_CD, EMP_ID)
)
/

comment on table PA1010 is '(PA1010)인사기본_기본사항'
/

comment on column PA1010.C_CD is '회사코드'
/

comment on column PA1010.EMP_ID is '사번'
/

comment on column PA1010.STAT_CD is '재직상태'
/

comment on column PA1010.ENTER_TYPE is '입사유형'
/

comment on column PA1010.BIZPL_CD is '사업장코드'
/

comment on column PA1010.RE_GRD_CD is '채용등급코드'
/

comment on column PA1010.ENTER_YMD is '입사일'
/

comment on column PA1010.GRP_YMD is '그룹입사일'
/

comment on column PA1010.RETIRE_YMD is '퇴사일'
/

comment on column PA1010.EXPT_PROB_END_YMD is '예상수습해제일'
/

comment on column PA1010.ATTEND_STA_YMD is '근태기산일'
/

comment on column PA1010.RET_STA_YMD is '퇴직금기산일'
/

comment on column PA1010.LAST_MOVE_YMD is '최종이동일'
/

comment on column PA1010.LAST_PROM_YMD is '최종승진일'
/

comment on column PA1010.SAL_STEP_YMD is '최종승급일'
/

comment on column PA1010.DUTY_APP_YMD is '직책임용일'
/

comment on column PA1010.NEXT_SAL_STEP_YMD is '차기승급일'
/

comment on column PA1010.LAST_EMP_TITLE_PROM_YMD is '최종호칭승진일'
/

comment on column PA1010.PER_NO is '주민번호'
/

comment on column PA1010.OFR_STA_YMD is '임원선임일'
/

comment on column PA1010.GENDER_TYPE is '성별유형'
/

comment on column PA1010.EMP_NM is '사원명'
/

comment on column PA1010.CHA_EMP_NM is '한자사원명'
/

comment on column PA1010.ENG_EMP_NM is '영문사원명'
/

comment on column PA1010.BIRTH_YMD is '생일'
/

comment on column PA1010.LNS_TYPE is '음양유형'
/

comment on column PA1010.MARRY_YN is '결혼여부'
/

comment on column PA1010.MARRY_YMD is '결혼일'
/

comment on column PA1010.FAM_ORGN_NM is '본관'
/

comment on column PA1010.FAM_MASTER_NM is '호주명'
/

comment on column PA1010.FAM_MASTER_RELA_CD is '호주관계코드'
/

comment on column PA1010.RELIGION_CD is '종교코드'
/

comment on column PA1010.HOBBY_TXT is '취미내용'
/

comment on column PA1010.SKILL_TXT is '특기내용'
/

comment on column PA1010.BODY_HEIGHT is '신장'
/

comment on column PA1010.BODY_WT is '체중'
/

comment on column PA1010.LEFT_SIGHT_NUM is '좌시력NUM'
/

comment on column PA1010.RIGHT_SIGHT_NUM is '우시력NUM'
/

comment on column PA1010.BLOOD_TYPE is '혈액형'
/

comment on column PA1010.COLORSENSE_CD is '색각코드'
/

comment on column PA1010.HOUSEHOLD_CD is '주거코드'
/

comment on column PA1010.IDTY_SCH_YN is '신원조회여부'
/

comment on column PA1010.NTNL_CD is '국가코드'
/

comment on column PA1010.OFFICE_TEL_NO is '구내전화번호'
/

comment on column PA1010.TEL_NO is '전화번호'
/

comment on column PA1010.EGC_TEL_NO is '긴급전화번호'
/

comment on column PA1010.MOBILE_NO is '이동전화'
/

comment on column PA1010.MAIL_ADDR is '메일주소'
/

comment on column PA1010.HOMEP_ADDR is '홈페이지주소'
/

comment on column PA1010.PHOTO_PATH is '사진PATH'
/

comment on column PA1010.BF_EMP_ID is '이전사번'
/

comment on column PA1010.BASEAREA_CD is '생활근거지코드'
/

comment on column PA1010.BIRTH_LOC_CD is '출신지역코드'
/

comment on column PA1010.OUT_DISP_ASSO_CD is '외부파견기관코드'
/

comment on column PA1010.RET_ORG_NM is '퇴직소속명'
/

comment on column PA1010.RET_EMP_GRADE_NM is '퇴직직급명'
/

comment on column PA1010.ASSO_EMP_GRADE_NM is '외부기관직급명'
/

comment on column PA1010.PSPT_NO is '여권번호'
/

comment on column PA1010.PSPT_END_YMD is '여권만료일'
/

comment on column PA1010.PSPT_KIND_CD is '여권종류코드'
/

comment on column PA1010.UNION_TYPE is '노조유형'
/

comment on column PA1010.FIRST_EMP_ID is '최초사번'
/

comment on column PA1010.RESI_YN is '거주여부'
/

comment on column PA1010.REG_DRT_YN is '등기이사여부'
/

comment on column PA1010.RECMD_NM is '추천인명'
/

comment on column PA1010.GRP_TRANS_YMD is '그룹전입일'
/

comment on column PA1010.RET_RSN_CD is '퇴직사유코드'
/

comment on column PA1010.RE_TYPE is '채용유형'
/

comment on column PA1010.GRADE_STA_YMD is '직급년차기준일'
/

comment on column PA1010.SPC_JG_CD is '특수직군코드'
/

comment on column PA1010.CAREER_PROM_POINT is '경력승진포인트'
/

comment on column PA1010.LOC_CD is '지역코드'
/

comment on column PA1010.MEDI_NOTE is '병력'
/

comment on column PA1010.OUT_MAIL_ADDR is '외부메일주소'
/

comment on column PA1010.TAX_LOC_CD is '납세지역코드'
/

comment on column PA1010.EMP_TITLE_STD_YMD is '호칭기준일'
/

comment on column PA1010.PROM_STD_YMD is '승진기준일'
/

comment on column PA1010.EMP_TYPE_CHG_YMD is '직원유형변경일'
/

comment on column PA1010.CEN_RNW_YMD is '계약갱신일'
/

comment on column PA1010.RECMD_RELA_CD is '추천인관계코드'
/

comment on column PA1010.PHOTO_YN is '사진여부'
/

comment on column PA1010.SIGN_YN is '사인여부'
/

comment on column PA1010.BOND_C_CD is '증권회사코드'
/

comment on column PA1010.BOND_ACC_NO is '증권계좌번호'
/

comment on column PA1010.INS_USER_ID is '입력자ID'
/

comment on column PA1010.INS_YMDHMS is '입력일시'
/

comment on column PA1010.MOD_USER_ID is '작업자ID'
/

comment on column PA1010.MOD_YMDHMS is '수정일시'
/

comment on column PA1010.INS_GYMDHMS is '입력일시_현지'
/

comment on column PA1010.MOD_GYMDHMS is '수정일시_현지'
/

comment on column PA1010.ASSO_MON_DDCT_YN is '조합비공제여부'
/

comment on column PA1010.TIMEZONECD is 'TIMEZONE코드'
/

comment on column PA1010.STEP_UP_STD_YMD is '승급기준일'
/

comment on column PA1010.NEW_ASSIGN_YMD is '신규보직일'
/

comment on column PA1010.RE_ORDER_NO is '채용기수'
/

comment on column PA1010.ATTEND_JG is '근태직군'
/

comment on column PA1010.CP_CD is '법인코드'
/

comment on column PA1010.EMP_UID is '고유사번'
/

comment on column PA1010.PSN_INFO_DATA_STOR_Y_CNT is '개인정보데이터보관년수'
/

comment on column PA1010.PSN_INFO_SEPA_STOR_YN is '개인정보분리보관여부'
/



create table SY9030
(
	C_CD VARCHAR2(20) not null,
	FILE_NO VARCHAR2(60) not null,
	USE_YN VARCHAR2(1) default 'N'
		constraint YN2227
			check (USE_YN IN ('Y', 'N')),
	NOTE VARCHAR2(4000),
	INS_USER_ID VARCHAR2(20),
	INS_YMDHMS TIMESTAMP(6),
	MOD_USER_ID VARCHAR2(20),
	MOD_YMDHMS TIMESTAMP(6),
	INS_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
	MOD_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
	FILE_UUID VARCHAR2(200),
	constraint PK_I_SY9030
		primary key (C_CD, FILE_NO)
)
/

comment on table SY9030 is '(SY9030)시스템_업로드파일번호'
/

comment on column SY9030.C_CD is '회사코드'
/

comment on column SY9030.FILE_NO is '파일번호'
/

comment on column SY9030.USE_YN is '사용여부'
/

comment on column SY9030.NOTE is '비고'
/

comment on column SY9030.INS_USER_ID is '입력자ID'
/

comment on column SY9030.INS_YMDHMS is '입력일시'
/

comment on column SY9030.MOD_USER_ID is '작업자ID'
/

comment on column SY9030.MOD_YMDHMS is '수정일시'
/

comment on column SY9030.INS_GYMDHMS is '입력일시_현지'
/

comment on column SY9030.MOD_GYMDHMS is '수정일시_현지'
/

create table SY7010
(
	C_CD VARCHAR2(20) not null,
	APPL_ID VARCHAR2(60) not null,
	APPL_EMP_NM VARCHAR2(300),
	APPL_TYPE VARCHAR2(20),
	APPL_EMP_ID VARCHAR2(20),
	TRG_EMP_ID VARCHAR2(20),
	TRG_EMP_NM VARCHAR2(300),
	APPL_STAT_CD VARCHAR2(20),
	APPL_YMD VARCHAR2(8),
	APPR_YMD VARCHAR2(8),
	APPL_HMS VARCHAR2(18),
	APPR_HMS VARCHAR2(18),
	APPL_TXT VARCHAR2(4000),
	TEMP_APPR VARCHAR2(20),
	FILE_NO VARCHAR2(60),
	RE_APPL_YN VARCHAR2(1) default 'N'
		constraint YN_856992152
			check (RE_APPL_YN IN ('Y', 'N')),
	BF_APPL_ID VARCHAR2(60),
	RCG_ADM_EMP_ID VARCHAR2(20),
	ADM_YN VARCHAR2(1) default 'N'
		constraint YN_775730346
			check (ADM_YN IN ('Y', 'N')),
	NOTE VARCHAR2(4000),
	INS_USER_ID VARCHAR2(20),
	INS_YMDHMS TIMESTAMP(6),
	MOD_USER_ID VARCHAR2(20),
	MOD_YMDHMS TIMESTAMP(6),
	INS_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
	MOD_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
	constraint PK_I_SY7010
		primary key (C_CD, APPL_ID),
	constraint NI_SY9030_SY7010
		foreign key (C_CD, FILE_NO) references SY9030
)
/

comment on table SY7010 is '(SY7010)신청서_기본'
/

comment on column SY7010.C_CD is '회사코드'
/

comment on column SY7010.APPL_ID is '신청서ID'
/

comment on column SY7010.APPL_EMP_NM is '신청자사원명'
/

comment on column SY7010.APPL_TYPE is '신청서유형'
/

comment on column SY7010.APPL_EMP_ID is '신청자사번'
/

comment on column SY7010.TRG_EMP_ID is '대상자사번'
/

comment on column SY7010.TRG_EMP_NM is '대상자사원명'
/

comment on column SY7010.APPL_STAT_CD is '신청서상태코드'
/

comment on column SY7010.APPL_YMD is '신청일자'
/

comment on column SY7010.APPR_YMD is '결재일'
/

comment on column SY7010.APPL_HMS is '신청시분초'
/

comment on column SY7010.APPR_HMS is '결재시분초'
/

comment on column SY7010.APPL_TXT is '신청내용'
/

comment on column SY7010.TEMP_APPR is '임시결재선'
/

comment on column SY7010.FILE_NO is '신청서파일번호'
/

comment on column SY7010.RE_APPL_YN is '재신청여부'
/

comment on column SY7010.BF_APPL_ID is '이전신청서ID'
/

comment on column SY7010.RCG_ADM_EMP_ID is '승인담당자사번'
/

comment on column SY7010.ADM_YN is '담당자승인여부'
/

comment on column SY7010.NOTE is '비고'
/

comment on column SY7010.INS_USER_ID is '입력자ID'
/

comment on column SY7010.INS_YMDHMS is '입력일시'
/

comment on column SY7010.MOD_USER_ID is '작업자ID'
/

comment on column SY7010.MOD_YMDHMS is '수정일시'
/

comment on column SY7010.INS_GYMDHMS is '입력일시_현지'
/

comment on column SY7010.MOD_GYMDHMS is '수정일시_현지'
/



create table PR3010
(
	C_CD VARCHAR2(20) not null,
	GIV_STD_ID VARCHAR2(60) not null,
	GIV_STD_NM VARCHAR2(300),
	GIV_YY VARCHAR2(4),
	GIV_TYPE VARCHAR2(20),
	GIV_TIME_CD VARCHAR2(20),
	STA_YMD VARCHAR2(8),
	END_YMD VARCHAR2(8),
	GIV_PGR_YN VARCHAR2(1) default 'N'
		constraint PR_000000001
			check (GIV_PGR_YN IN ('Y', 'N')),
	GIV_END VARCHAR2(20),
	NOTE VARCHAR2(500),
	INS_USER_ID VARCHAR2(20),
	INS_YMDHMS TIMESTAMP(6),
	MOD_USER_ID VARCHAR2(20),
	MOD_YMDHMS TIMESTAMP(6),
	INS_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
	MOD_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
	constraint PK_I_PR3010
		primary key (C_CD, GIV_STD_ID)
)
/

comment on table PR3010 is '(PR3010)유니폼지급회차관리'
/

comment on column PR3010.C_CD is '회사코드'
/

comment on column PR3010.GIV_STD_ID is '지급회차ID'
/

comment on column PR3010.GIV_STD_NM is '지급회차명'
/

comment on column PR3010.GIV_YY is '지급년도'
/

comment on column PR3010.GIV_TYPE is '지급유형코드'
/

comment on column PR3010.GIV_TIME_CD is '지급회차코드'
/

comment on column PR3010.STA_YMD is '시작일'
/

comment on column PR3010.END_YMD is '종료일'
/

comment on column PR3010.GIV_PGR_YN is '신청허가여부'
/

comment on column PR3010.GIV_END is '지급종료여부'
/

comment on column PR3010.NOTE is '비고'
/

comment on column PR3010.INS_USER_ID is '입력자ID'
/

comment on column PR3010.INS_YMDHMS is '입력일시'
/

comment on column PR3010.MOD_USER_ID is '작업자ID'
/

comment on column PR3010.MOD_YMDHMS is '수정일시'
/

comment on column PR3010.INS_GYMDHMS is '입력일시_현지'
/

comment on column PR3010.MOD_GYMDHMS is '수정일시_현지'
/



create table PR3110
(
	C_CD VARCHAR2(20) not null,
	GIV_STD_ID VARCHAR2(20) not null,
	UNIF_CD VARCHAR2(20) not null,
	UNIF_NM VARCHAR2(60) not null,
	UNIF_BRAND VARCHAR2(60) not null,
	UNIF_TYPE VARCHAR2(20) not null,
	UNIF_CNT NUMBER not null,
	GENDER_TYPE VARCHAR2(20) not null,
	UNIF_SIZE VARCHAR2(20) not null,
	FILE_TYPE VARCHAR2(20),
	NOTE VARCHAR2(500),
	INS_USER_ID VARCHAR2(20),
	MOD_USER_ID VARCHAR2(20),
	INS_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
	INS_YMDHMS TIMESTAMP(6),
	MOD_YMDHMS TIMESTAMP(6),
	MOD_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
	constraint PK_I_PR3110
		primary key (C_CD, GIV_STD_ID, UNIF_CD, UNIF_BRAND, UNIF_TYPE, UNIF_SIZE, GENDER_TYPE),
	constraint NI_PR3010_PR3110
		foreign key (C_CD, GIV_STD_ID) references PR3010
			on delete cascade
)
/

comment on table PR3110 is '(PR3110)유니폼관리'
/

comment on column PR3110.C_CD is '회사코드'
/

comment on column PR3110.GIV_STD_ID is '지급회차ID'
/

comment on column PR3110.UNIF_CD is '유니폼코드'
/

comment on column PR3110.UNIF_NM is '유니폼명'
/

comment on column PR3110.UNIF_BRAND is '유니폼브랜드'
/

comment on column PR3110.UNIF_TYPE is '유니폼종류'
/

comment on column PR3110.GENDER_TYPE is '성별'
/

comment on column PR3110.UNIF_SIZE is '유니폼사이즈'
/

comment on column PR3110.FILE_TYPE is '유니폼사진유형'
/

comment on column PR3110.NOTE is '비고'
/

comment on column PR3110.INS_USER_ID is '입력자ID'
/

comment on column PR3110.MOD_USER_ID is '작업자ID'
/

comment on column PR3110.INS_GYMDHMS is '입력일시_현지'
/

comment on column PR3110.INS_YMDHMS is '입력일시'
/

comment on column PR3110.MOD_YMDHMS is '수정일시'
/

comment on column PR3110.MOD_GYMDHMS is '수정일시_현지'
/



create table PR3210
(
	C_CD VARCHAR2(20) not null,
	GIV_STD_ID VARCHAR2(60) not null,
	EMP_ID VARCHAR2(60) not null,
	ORG_ID VARCHAR2(60),
	EMP_GRADE_CD VARCHAR2(60),
	INS_USER_ID VARCHAR2(20),
	MOD_USER_ID VARCHAR2(20),
	INS_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
	INS_YMDHMS TIMESTAMP(6),
	MOD_YMDHMS TIMESTAMP(6),
	MOD_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
	constraint PK_I_PR3210
		primary key (C_CD, GIV_STD_ID, EMP_ID),
	constraint NI_PA1010_PR3210
		foreign key (C_CD, EMP_ID) references PA1010
			on delete cascade,
	constraint NI_PR3010_PR3210
		foreign key (C_CD, GIV_STD_ID) references PR3010
			on delete cascade
)
/

comment on table PR3210 is '(PR3210)유니폼지급대상자관리'
/

comment on column PR3210.C_CD is '회사코드'
/

comment on column PR3210.GIV_STD_ID is '지급회차ID'
/

comment on column PR3210.EMP_ID is '사번'
/

comment on column PR3210.ORG_ID is '조직코드'
/

comment on column PR3210.EMP_GRADE_CD is '직급코드'
/

comment on column PR3210.INS_USER_ID is '입력자ID'
/

comment on column PR3210.MOD_USER_ID is '작업자ID'
/

comment on column PR3210.INS_GYMDHMS is '입력일시_현지'
/

comment on column PR3210.INS_YMDHMS is '입력일시'
/

comment on column PR3210.MOD_YMDHMS is '수정일시'
/

comment on column PR3210.MOD_GYMDHMS is '수정일시_현지'
/



create global temporary table PR3210_TMP
(
	C_CD VARCHAR2(20) not null,
	EMP_ID VARCHAR2(60) not null,
	GIV_STD_ID VARCHAR2(60) not null,
	ORG_ID VARCHAR2(60),
	EMP_GRADE_CD VARCHAR2(60),
	INS_USER_ID VARCHAR2(20),
	MOD_USER_ID VARCHAR2(20),
	INS_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
	INS_YMDHMS TIMESTAMP(6),
	MOD_YMDHMS TIMESTAMP(6),
	MOD_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
	constraint PK_I_PR3210_TMP
		primary key (C_CD, EMP_ID, GIV_STD_ID)
)
on commit delete rows
/

comment on column PR3210_TMP.INS_USER_ID is '입력자ID'
/





create table PR3310
(
	C_CD VARCHAR2(20) not null,
	APPL_ID VARCHAR2(60) not null,
	SEQ_NO NUMBER default 0 not null,
	EMP_ID VARCHAR2(60) not null,
	GIV_STD_ID VARCHAR2(60) not null,
	UNIF_CD VARCHAR2(20) not null,
	GIV_YMD VARCHAR2(8),
	NOTE VARCHAR2(500),
	INS_USER_ID VARCHAR2(20),
	INS_YMDHMS TIMESTAMP(6),
	MOD_USER_ID VARCHAR2(20),
	MOD_YMDHMS TIMESTAMP(6),
	INS_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
	MOD_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
	constraint PK_I_PR3310
		primary key (C_CD, APPL_ID, SEQ_NO),
	constraint NI_PR3210_PR3310
		foreign key (C_CD, GIV_STD_ID, EMP_ID) references PR3210
			on delete cascade,
	constraint NI_SY7010_PR3310
		foreign key (C_CD, APPL_ID) references SY7010
			on delete cascade
)
/

comment on table PR3310 is '(PR3310)유니폼신청'
/

comment on column PR3310.C_CD is '회사코드'
/

comment on column PR3310.APPL_ID is '신청서ID'
/

comment on column PR3310.SEQ_NO is '신청서별 유니폼 신청내역'
/

comment on column PR3310.EMP_ID is '사번'
/

comment on column PR3310.GIV_STD_ID is '선물유형'
/

comment on column PR3310.UNIF_CD is '유니폼코드'
/

comment on column PR3310.GIV_YMD is '유니폼수령일'
/

comment on column PR3310.NOTE is '비고'
/

comment on column PR3310.INS_USER_ID is '입력자ID'
/

comment on column PR3310.INS_YMDHMS is '입력일시'
/

comment on column PR3310.MOD_USER_ID is '작업자ID'
/

comment on column PR3310.MOD_YMDHMS is '수정일시'
/

comment on column PR3310.INS_GYMDHMS is '입력일시_현지'
/

comment on column PR3310.MOD_GYMDHMS is '수정일시_현지'
/




create table PR3410
(
	C_CD VARCHAR2(20) not null,
	DATA_ID VARCHAR2(60) not null,
	APPL_ID VARCHAR2(60),
	EMP_ID VARCHAR2(20),
	ORG_ID VARCHAR2(60),
	GIV_YMD VARCHAR2(8),
	GIV_YN VARCHAR2(1) default 'N'
		constraint PR_000000002
			check (GIV_YN IN ('Y', 'N')),
	GIV_STD_ID VARCHAR2(60),
	NOTE VARCHAR2(500),
	IN_TYPE VARCHAR2(20),
	INS_USER_ID VARCHAR2(20),
	INS_YMDHMS TIMESTAMP(6),
	MOD_USER_ID VARCHAR2(20),
	MOD_YMDHMS TIMESTAMP(6),
	INS_GYMDHMS TIMESTAMP(6),
	MOD_GYMDHMS TIMESTAMP(6),
	UNIF_CD VARCHAR2(60),
	constraint PR3410_PK
		primary key (C_CD, DATA_ID),
	constraint NI_SY7010_PR3410
		foreign key (C_CD, APPL_ID) references SY7010
			on delete cascade
)
/

comment on table PR3410 is '(PR3410)유니폼신청관리'
/

comment on column PR3410.C_CD is '회사코드'
/

comment on column PR3410.DATA_ID is '자료ID'
/

comment on column PR3410.APPL_ID is '신청서ID'
/

comment on column PR3410.EMP_ID is '사번'
/

comment on column PR3410.ORG_ID is '조직코드'
/

comment on column PR3410.GIV_YMD is '유니폼수령일'
/

comment on column PR3410.GIV_YN is '지급완료여부'
/

comment on column PR3410.GIV_STD_ID is '지급회차ID'
/

comment on column PR3410.NOTE is '비고'
/

comment on column PR3410.IN_TYPE is '입력유형'
/

comment on column PR3410.INS_USER_ID is '입력자ID'
/

comment on column PR3410.INS_YMDHMS is '입력일시'
/

comment on column PR3410.MOD_USER_ID is '작업자ID'
/

comment on column PR3410.MOD_YMDHMS is '수정일시'
/

comment on column PR3410.INS_GYMDHMS is '입력일시_현지'
/

comment on column PR3410.MOD_GYMDHMS is '수정일시_현지'
/



create table PR3510
(
	C_CD VARCHAR2(20) not null,
	UNIF_CD VARCHAR2(20) not null,
	FILE_NO VARCHAR2(60),
	FILE_TYPE VARCHAR2(20) not null,
	INS_USER_ID VARCHAR2(20),
	MOD_USER_ID VARCHAR2(20),
	INS_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
	INS_YMDHMS TIMESTAMP(6),
	MOD_YMDHMS TIMESTAMP(6),
	MOD_GYMDHMS TIMESTAMP(6) WITH TIME ZONE,
	constraint PK_I_PR3510
		primary key (C_CD, UNIF_CD, FILE_TYPE),
	constraint NI_SY9030_PR3510
		foreign key (C_CD, FILE_NO) references SY9030
			on delete cascade
)
/

comment on table PR3510 is '(PR3510)유니폼파일관리'
/

comment on column PR3510.C_CD is '회사코드'
/

comment on column PR3510.UNIF_CD is '유니폼코드'
/

comment on column PR3510.FILE_NO is '파일번호'
/

comment on column PR3510.FILE_TYPE is '파일유형'
/

comment on column PR3510.INS_USER_ID is '입력자ID'
/

comment on column PR3510.MOD_USER_ID is '작업자ID'
/

comment on column PR3510.INS_GYMDHMS is '입력일시_현지'
/

comment on column PR3510.INS_YMDHMS is '입력일시'
/

comment on column PR3510.MOD_YMDHMS is '수정일시'
/

comment on column PR3510.MOD_GYMDHMS is '수정일시_현지'
/

