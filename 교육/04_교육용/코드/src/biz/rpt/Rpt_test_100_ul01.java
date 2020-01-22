package biz.rpt;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import biz.sys.Sys_common;
import common.util.ComboDS;
import common.util.IPreparedData;
import hcg.hunel.core.action.hunelBaseForm;
import hcg.hunel.core.action.hunelBizException;
import hcg.hunel.core.action.hunelCommonDS;
import hcg.hunel.core.sql.CUDSQLManager;
import hcg.hunel.core.sql.CommonSQL;
import hcg.hunel.core.sql.SQLUtil;
import hcg.hunel.core.sql.VarStatement;

/**
 * Program Name : Rpt_test_100_ul01.java
 * Description : 유니폼 신청 관리
 * Author : 소인성
 * History : 2019.12.18 신규개발
 */
public class Rpt_test_100_ul01 extends hunelCommonDS implements IPreparedData
{
    /**
     * 생성자
     * 
     * @param conn
     *            Connection
     * @param request
     *            HttpServletRequest
     */
    public Rpt_test_100_ul01(Connection conn, HttpServletRequest request, HttpServletResponse response)
    {
        super(conn, request, response);
    }
    
    /**
     * 화면에서 사용할 데이터 준비
     *
     * @param form
     * @throws SQLException
     * @author 소인성
     */
    @Override
    public HashMap<String, String> prepareData(hunelBaseForm form) throws SQLException
    {
        String S_C_CD = ehrbean.getCCD();
        String S_LANG_TYPE = ehrbean.get("LANG_TYPE");
        
        HashMap hmPreparedData = new HashMap();
        ComboDS comboDS = new ComboDS(conn, request, response);
        
        // 신청관리 입력구분 공통코드
        hmPreparedData.put("SY110", comboDS.getCodeCombo(S_C_CD, "SY110", S_LANG_TYPE));
        hmPreparedData.put("/RPT10", comboDS.getCodeCombo(S_C_CD, "/RPT10", S_LANG_TYPE));
        hmPreparedData.put("/RPT20", comboDS.getCodeCombo(S_C_CD, "/RPT20", S_LANG_TYPE));
        hmPreparedData.put("/RPT30", comboDS.getCodeCombo(S_C_CD, "/RPT30", S_LANG_TYPE));
        
        return hmPreparedData;
    }
    
    /**
     * 조회 : 최종 승인된 신청서 + 관리자 일괄 신청내역
     *
     * @param form
     * @throws SQLException
     * @throws hunelBizException
     * @author 소인성
     */
    public void search01(hunelBaseForm form) throws SQLException
    {
        String S_IN_TYPE = form.getValue("S_IN_TYPE");
        String S_RPT_STD_CD = form.getValue("S_RPT_STD_CD");
        String S_RPT_BRAND = form.getValue("S_RPT_BRAND");
        String S_RPT_SIZE = form.getValue("S_RPT_SIZE");
        String S_EMP_ID = form.getValue("S_EMP_ID");
        String S_ORG_ID = form.getValue("S_ORG_ID");
        
        StringBuffer sb = new StringBuffer();
        if (!"".equals(S_EMP_ID.trim()))
            sb.append("AND T1.EMP_ID = :EMP_ID \n");
        if (!"".equals(S_ORG_ID.trim()))
            sb.append("AND T1.ORG_ID IN (").append(CommonSQL.getQuerySubOrgs(":ORG_ID", null)).append(") \n");
        if (!"".equals(S_IN_TYPE.trim()))
            sb.append("AND T2.IN_TYPE = :IN_TYPE \n");
        if (!"".equals(S_RPT_STD_CD.trim()))
            sb.append("AND T2.RPT_STD_CD = :RPT_STD_CD \n");
        if (!"".equals(S_RPT_BRAND.trim()))
            sb.append("AND T3.RPT_BRAND = :RPT_BRAND \n");
        if (!"".equals(S_RPT_SIZE.trim()))
            sb.append("AND T3.RPT_SIZE = :RPT_SIZE \n");
        
        String BLOCK = sb.toString();
        String query = xmlQuery.getElement(this, "search01", BLOCK, null);
        VarStatement vstmt = new VarStatement(conn, query, request);
        
        vstmt.setParameter("C_CD", ehrbean.getCCD());
        vstmt.setParameter("LANG_TYPE", ehrbean.get("LANG_TYPE"));
        if (!"".equals(S_EMP_ID.trim()))
            vstmt.setParameter("EMP_ID", S_EMP_ID);
        if (!"".equals(S_ORG_ID.trim()))
            vstmt.setParameter("ORG_ID", S_ORG_ID);
        
        if (!"".equals(S_IN_TYPE.trim()))
            vstmt.setParameter("IN_TYPE", S_IN_TYPE);
        if (!"".equals(S_RPT_STD_CD.trim()))
            vstmt.setParameter("RPT_STD_CD", S_RPT_STD_CD);
        if (!"".equals(S_RPT_BRAND.trim()))
            vstmt.setParameter("RPT_BRAND", S_RPT_BRAND);
        if (!"".equals(S_RPT_SIZE.trim()))
            vstmt.setParameter("RPT_SIZE", S_RPT_SIZE);
        
        vstmt.setParameter("RPT_YN", form.getValue("S_RPT_YN"));
        
        log.debug(vstmt.getQueryString());
        setResultSet(SQLUtil.getResultSetWithClose(vstmt));
    }
    
    /**
     * 저장 : 관리자 일괄 신청
     *
     * @param form
     * @throws SQLException
     * @throws hunelBizException
     * @author 소인성
     */
    public void save01(hunelBaseForm form) throws SQLException
    {
        HashMap<String, String> authMap = new HashMap<String, String>();
        authMap.put("EMP_ID", "EMP_ID");
        xmlQuery.chkAuthTrans(conn, request, ehrbean, form, authMap);
        
        // 복수 건 저장, 수정, 삭제 코드
        // View의 입력, 수정, 삭제 구분(I, U, D) 
        char CSTATUS;
        CUDSQLManager cud = new CUDSQLManager(conn, request);
        
        // DATA_ID 채번을 위한 객체 생성
        Sys_common sys_common = new Sys_common(conn, request, response);
        
        int sz = form.getValues("CSTATUS").length;
        for (int n = 0; n < sz; n++)
        {
            CSTATUS = form.getValues("CSTATUS")[n].charAt(0);
            
            cud.setTable("RPT0020");
            
            cud.addKey("C_CD", ehrbean.getCCD());
            if (CSTATUS == 'I')
            {
                // 함수 실행, DATA_ID 생성
                String DATA_ID = sys_common.selectNEW_TABLE_ID(ehrbean.getCCD(), "RPT0020", "DATA_ID", "4");
                cud.addKey("DATA_ID", DATA_ID);
            }
            else
            {
                cud.addKey("DATA_ID", form.getValues("DATA_ID")[n]);
            }
            
            cud.addField("APPL_ID", form.getValues("APPL_ID")[n]);
            cud.addField("EMP_ID", form.getValues("EMP_ID")[n]);
            cud.addField("RPT_YMD", form.getValues("RPT_YMD")[n]);
            cud.addField("RPT_CNT", form.getValues("RPT_CNT")[n]);
            cud.addField("RPT_BRAND", form.getValues("RPT_BRAND")[n]);
            cud.addField("RPT_SIZE", form.getValues("RPT_SIZE")[n]);
            cud.addField("RPT_YN", "N");
            cud.addField("RPT_STD_CD", form.getValues("RPT_STD_CD")[n]);
            cud.addField("IN_TYPE", form.getValues("IN_TYPE")[n]);
            cud.addField("APPL_YMD", form.getValues("APPL_YMD")[n]);
            cud.addField("NOTE", form.getValues("NOTE")[n]);
            
            cud.addField("MOD_USER_ID", ehrbean.get("USER_ID"));
            cud.addFieldRaw("MOD_YMDHMS", "SYSTIMESTAMP");
            cud.addFieldRaw("MOD_GYMDHMS", "CURRENT_TIMESTAMP");
            
            switch (CSTATUS)
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
}