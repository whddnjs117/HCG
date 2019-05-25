    /**
     * 사원별 학력 입력,수정,삭제
     * 
     * @param form hunelBaseForm
     * @throws SQLException
     */
    public void save01(hunelBaseForm form) throws SQLException
    {
        char IUD;
        String C_CD, SEQ_NO, EMP_ID;
        CUDSQLManager cud = new CUDSQLManager(conn, request);
        
        int sz = form.getValues("CSTATUS").length;
        // 파라미터에서 만든걸 꺼내 쓰는 것. request.getParameter(); 와 같다고 생각해도 무방
        // getValues는 Array 형태이다.
        // 그런데 이렇게 되면 여러 Row를 동시에 추가할 때, 컬럼값이 여러갠데 데이터를 어떻게 처리하지?
        //     case "<com:otp value='save01' />":
        //        {
        //            var paramSub = FormQueryStringEnc(document.f1);
        //            sheet1.DoSave("/commonAction.do", paramSub);  // web.xml에 정의, 어느 서블릿에 포워딩할지
        //          }
        // 항목이 배열로 반환한다.
        
        for (int n = 0; n < sz; n++)
        {
            // Row별로 순회하며 Query문을 실행하는 것
            IUD = form.getValues("CSTATUS")[n].charAt(0);       // Insert Update Delete, CSTATUS는 상태 컬럼
            
            cud.setTable("ZZ1010");     // 테이블 지정
            cud.addKey("C_CD", StringUtil.nvl(form.getValue("S_C_CD"), ehrbean.getCCD()));
            cud.addKey("EMP_ID", form.getValues("EMP_ID")[n]);
            
            if (IUD == 'I')
            {
                // Insert 할 때는
                cud.addKeyRaw("SEQ_NO", "(SELECT NVL(MAX(SEQ_NO)+1, 1) FROM ZZ1010 WHERE C_CD = :K0 AND EMP_ID = :K1)");
                // SEQ_NO를 호출해서 해당 값으로 컨트롤 하는 것
            }
            else
            {
                // Update, Delete 할 때는
                cud.addKey("SEQ_NO", form.getValues("SEQ_NO")[n]);
            }
            
            // jsp에서 정의한 컬럼들
            cud.addField("STA_YMD",             form.getValues("STA_YMD")[n]);
            cud.addField("END_YMD",             form.getValues("END_YMD")[n]);
            cud.addField("EQUIP_CD",            form.getValues("EQUIP_CD")[n]);
            cud.addField("NOTE",                form.getValues("NOTE")[n]);
            cud.addField("LAST_YN",             form.getValues("LAST_YN")[n]);
            
            cud.addField("MOD_USER_ID",         ehrbean.get("USER_ID"));
            cud.addFieldRaw("MOD_YMDHMS",       "SYSTIMESTAMP");
            cud.addFieldRaw("MOD_GYMDHMS",      "CURRENT_TIMESTAMP");
            
            switch (IUD)
            {
                case 'I':
                {
                    cud.insert();
                    
                }
                    break;
                case 'U':
                {
                    cud.update();
                }
                    break;
                case 'D':
                {
                    cud.delete();
                }
                    break;
                default:
                {
                    log.info("Not found case!");
                }
            }
        }
        
    }