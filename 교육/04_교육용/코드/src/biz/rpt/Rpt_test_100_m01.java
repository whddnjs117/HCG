package biz.rpt;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import biz.sys.Sys_common;
import biz.sys.sy_appl.Sys_appl_abstract;
import common.util.ComboDS;
import common.util.IPreparedData;
import common.util.XmlDS;
import hcg.hunel.core.action.hunelBaseForm;
import hcg.hunel.core.action.hunelBizException;
import hcg.hunel.core.sql.CUDSQLManager;
import hcg.hunel.core.sql.MemResultSet;
import hcg.hunel.core.sql.SQLUtil;
import hcg.hunel.core.sql.VarStatement;

/**
 * Program Name : Rpt_test_100_m01.java
 * Description : 유니폼 신청/결재/승인
 * Author : 소인성
 * History : 2019.12.18 신규개발
 */
public class Rpt_test_100_m01 extends Sys_appl_abstract implements IPreparedData
{
    /**
     * 생성자
     * 
     * @param conn
     *            Connection
     * @param request
     *            HttpServletRequest
     */
    public Rpt_test_100_m01(Connection conn, HttpServletRequest request, HttpServletResponse response)
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
        
        hmPreparedData.put("/RPT10", comboDS.getCodeCombo(S_C_CD, "/RPT10", S_LANG_TYPE));
        hmPreparedData.put("/RPT20", comboDS.getCodeCombo(S_C_CD, "/RPT20", S_LANG_TYPE));
        hmPreparedData.put("/RPT30", comboDS.getCodeCombo(S_C_CD, "/RPT30", S_LANG_TYPE));
        
        // 신청서 공통
        String query = xmlQuery.getElement("biz.sys.sy_appl.Sys_appl_common", "getApplType", null);
        VarStatement vstmt = new VarStatement(conn, query);
        vstmt.setParameter("C_CD", S_C_CD);
        vstmt.setParameter("LANG_TYPE", S_LANG_TYPE);
        vstmt.setParameter("APPL_TYPE", form.getValue("S_APPL_TYPE"));
        
        log.debug(vstmt.getQueryString());
        XmlDS xmlDS = new XmlDS(conn, request, response);
        xmlDS.addEtcDataAll(SQLUtil.getResultSetWithClose(vstmt));
        hmPreparedData.put("xmlApplTypeInfo", xmlDS.makeXml());
        
        return hmPreparedData;
    }
    
    /**
     * 신청서 조회(공통)
     *
     * @param form
     * @throws SQLException
     * @throws hunelBizException
     */
    public void search01(hunelBaseForm form) throws SQLException
    {
        String query = xmlQuery.getElement(this, "search01", null);
        VarStatement vstmt = new VarStatement(conn, query, request);
        
        vstmt.setParameter("C_CD", ehrbean.getCCD());
        vstmt.setParameter("APPL_ID", form.getValue("S_APPL_ID"));
        
        log.debug(vstmt.getQueryString());
        setResultSet(SQLUtil.getResultSetWithClose(vstmt));
    }
    
    /**
     * 신청서 삭제 전 처리 메소드(공통)
     *
     * @param form
     * @throws SQLException
     * @throws hunelBizException
     */
    @Override
    protected void delete01_before(hunelBaseForm form) throws SQLException, hunelBizException
    {
        log.debug("call delete01_before!");
        
    }
    
    /**
     * 신청서 삭제 후 처리 메소드(공통)
     *
     * @param form
     * @throws SQLException
     * @throws hunelBizException
     */
    @Override
    protected void delete01_after(hunelBaseForm form) throws SQLException, hunelBizException
    {
        log.debug("call delete01_after!");
    }
    
    /**
     * 저장 : 신청서 저장 로직
     *
     * @param form
     * @throws SQLException
     * @throws hunelBizException
     * @author 소인성
     */
    @Override
    protected void save01_biz(hunelBaseForm form, String S_IUD_MODE, String S_APPL_ID) throws SQLException, hunelBizException
    {
        
        CUDSQLManager cud = new CUDSQLManager(conn, request);
        
        cud.setTable("RPT0010");
        
        cud.addKey("C_CD", ehrbean.getCCD());
        cud.addKey("APPL_ID", S_APPL_ID);
        cud.addKey("RPT_STD_CD", form.getValue("S_RPT_STD_CD"));
        
        cud.addField("EMP_ID", form.getValue("S_TARGET_EMP_ID"));
        cud.addField("RPT_YMD", form.getValue("S_RPT_YMD"));
        cud.addField("RPT_CNT", form.getValue("S_RPT_CNT"));
        cud.addField("RPT_BRAND", form.getValue("S_RPT_BRAND"));
        cud.addField("RPT_SIZE", form.getValue("S_RPT_SIZE"));
        cud.addField("APPL_YMD", form.getValue("S_APPL_YMD"));
        cud.addField("NOTE", form.getValue("S_NOTE"));
        
        cud.addField("MOD_USER_ID", ehrbean.get("USER_ID"));
        cud.addFieldRaw("MOD_YMDHMS", "SYSTIMESTAMP");
        cud.addFieldRaw("MOD_GYMDHMS", "CURRENT_TIMESTAMP");
        
        if ("I".equals(S_IUD_MODE))
        {
            cud.insert();
        }
        else if ("U".equals(S_IUD_MODE))
        {
            cud.update();
        }
    }
    
    /**
     * 신청서 전후 처리 메소드(공통)
     *
     * @param form
     * @throws SQLException
     * @throws hunelBizException
     */
    @Override
    protected void apply01_before(hunelBaseForm form) throws SQLException, hunelBizException
    {
        log.debug("call apply01_before!");
    }
    
    /**
     * 신청서 전후 처리 메소드(공통)
     *
     * @param form
     * @throws SQLException
     * @throws hunelBizException
     */
    @Override
    protected void apply01_after(hunelBaseForm form) throws SQLException, hunelBizException
    {
        log.debug("call apply01_after!");
    }
    
    /**
     * 신청서 전후 처리 메소드(공통)
     *
     * @param form
     * @throws SQLException
     * @throws hunelBizException
     */
    @Override
    protected void appr01_before(hunelBaseForm form) throws SQLException, hunelBizException
    {
        log.debug("call appr01_before!");
    }
    
    /**
     * 신청서 전후 처리 메소드(공통)
     *
     * @param form
     * @throws SQLException
     * @throws hunelBizException
     */
    @Override
    protected void appr01_after(hunelBaseForm form) throws SQLException, hunelBizException
    {
        log.debug("call appr01_after!");
    }
    
    /**
     * 신청서 전후 처리 메소드(공통)
     *
     * @param form
     * @throws SQLException
     * @throws hunelBizException
     */
    @Override
    protected void noappr01_before(hunelBaseForm form) throws SQLException, hunelBizException
    {
        log.debug("call noappr01_before!");
    }
    
    /**
     * 신청서 전후 처리 메소드(공통)
     *
     * @param form
     * @throws SQLException
     * @throws hunelBizException
     */
    @Override
    protected void noappr01_after(hunelBaseForm form) throws SQLException, hunelBizException
    {
        log.debug("call noappr01_after!");
    }
    
    /**
     * 굳이 필요 없는 메소드임, Validation용
     *
     * @param form
     * @throws SQLException
     * @throws hunelBizException
     */
    public void onApplComplete(hunelBaseForm form) throws SQLException, hunelBizException
    {
        onApplComplete(form.getValue("S_APPL_ID"));
    }
    
    /**
     * 신청서 작업이 완료된 후 처리 메소드
     *
     * @param form
     * @throws SQLException
     * @throws hunelBizException
     * @author 소인성
     */
    public void onApplComplete(String APPL_ID) throws SQLException, hunelBizException
    {
        Sys_common sys_common = new Sys_common(conn, request, response);
        String DATA_ID = sys_common.selectNEW_TABLE_ID(ehrbean.getCCD(), "RPT0020", "DATA_ID", "4");
        String query = xmlQuery.getElement(this, "onApplComplete", null);
        
        VarStatement vpstmt = new VarStatement(conn, query, request);
        vpstmt.setParameter("C_CD", ehrbean.getCCD());
        vpstmt.setParameter("APPL_ID", APPL_ID);
        vpstmt.setParameter("DATA_ID", DATA_ID);
        vpstmt.setParameter("MOD_USER_ID", ehrbean.get("USER_ID"));
        
        log.debug(vpstmt.getQueryString());
        
        vpstmt.executeUpdate();
        
        vpstmt.close();
    }
    
    /**
     * 사원정보조회
     * 
     * @param hunelBaseForm
     * @throws SQLException
     */
    public void changeTRG(hunelBaseForm form) throws SQLException
    {
        HashMap<String, String> authMap = xmlQuery.chkAuthMenu(conn, request, ehrbean, form);
        authMap.put("COL_EMP", "EMP_ID");
        authMap.put("COL_ORG", "ORG_ID");
        
        String query = xmlQuery.getElement(this, "changeTRG", null, authMap);
        VarStatement vstmt = new VarStatement(conn, query, request, authMap);
        
        vstmt.setParameter("C_CD", ehrbean.getCCD());
        vstmt.setParameter("EMP_ID", form.getValue("S_EMP_ID"));
        vstmt.setParameter("LANG_TYPE", ehrbean.get("LANG_TYPE"));
        
        if (log.isDebugEnabled())
        {
            log.debug("\n======================================\n" + vstmt.getQueryString() + "\n ======================================");
        }
        
        setResultSet(SQLUtil.getResultSetWithClose(vstmt));
    }
    
}