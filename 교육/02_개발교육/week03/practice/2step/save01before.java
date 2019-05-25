    /**
     * 사원별 학력 입력,수정,삭제
     * 
     * @param form
     *            hunelBaseForm
     * @throws SQLException
     */
    public void save01(hunelBaseForm form) throws SQLException
    {
        char IUD;
        String C_CD, SEQ_NO, EMP_ID;
        CUDSQLManager cud = new CUDSQLManager(conn, request);
        
        int sz = form.getValues("CSTATUS").length;
        
        for (int n = 0; n < sz; n++)
        {
            IUD = form.getValues("CSTATUS")[n].charAt(0);
            
            cud.setTable("PA2020");
            cud.addKey("C_CD", C_CD = StringUtil.nvl(form.getValue("S_C_CD"), ehrbean.getCCD()));
            cud.addKey("EMP_ID", form.getValues("EMP_ID")[n]);
            
            if (IUD == 'I')
            {
                cud.addKeyRaw("SEQ_NO", "(SELECT NVL(MAX(SEQ_NO)+1, 1) FROM PA2020 WHERE C_CD = :K0 AND EMP_ID = :K1)");
            }
            else
            {
                cud.addKey("SEQ_NO", form.getValues("SEQ_NO")[n]);
            }
            
            cud.addField("", form.getValues("")[n]);
            cud.addField("MOD_USER_ID", ehrbean.get("USER_ID"));
            cud.addFieldRaw("MOD_YMDHMS", "SYSTIMESTAMP");
            cud.addFieldRaw("MOD_GYMDHMS", "CURRENT_TIMESTAMP");
            
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