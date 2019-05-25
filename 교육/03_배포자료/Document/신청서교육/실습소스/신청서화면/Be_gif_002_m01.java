package biz.bsi.be_gif;

import hcg.hunel.core.action.hunelBaseForm;
import hcg.hunel.core.action.hunelBizException;
import hcg.hunel.core.sql.CUDSQLManager;
import hcg.hunel.core.sql.SQLUtil;
import hcg.hunel.core.sql.VarStatement;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import common.util.ComboDS;
import common.util.IPreparedData;
import common.util.XmlDS;
import biz.sys.Sys_common;
import biz.sys.sy_appl.Sys_appl_abstract;

/**
 * <pre>
 * <li>Program Name : Be_gif_002_m01
 * <li>Description  : 명절선물 신청
 * <li>History      : 2007-11-16
 * </pre>
 * 
 * @author 박영환
 */
public class Be_gif_002_m01 extends Sys_appl_abstract implements IPreparedData {
    /**
     * 생성자
     * 
     * @param conn Connection
     * @param request HttpServletRequest
     */
    public Be_gif_002_m01( Connection conn, HttpServletRequest request, HttpServletResponse response ) {
        super(conn, request, response);
    }
    
    /**
     * 화면을 불러오기 전에 화면에서 사용할 데이터를 미리 준비한다. 
     * ex) 콤보문자열, XML 데이터 등..
     * @param hunelBaseForm
     * @throws SQLException
     */
    @Override
    public HashMap<String, String> prepareData(hunelBaseForm form) throws SQLException
    {
     
    	  String S_C_CD      = ehrbean.getCCD();

    	  HashMap hmPreparedData = new HashMap();
          ComboDS comboDS = new ComboDS(conn, request, response);
          
          hmPreparedData.put("/GI01",  comboDS.getCodeCombo(S_C_CD, "/GI01", ehrbean.get("LANG_TYPE")) );
         
          String query = xmlQuery.getElement("biz.sys.sy_appl.Sys_appl_common", "getApplType", null);
          VarStatement vstmt = new VarStatement(conn, query);
          vstmt.setParameter("C_CD", S_C_CD);
          vstmt.setParameter("LANG_TYPE",   ehrbean.get("LANG_TYPE"));
          vstmt.setParameter("APPL_TYPE",  form.getValue("S_APPL_TYPE"));
          
          log.debug(vstmt.getQueryString());
          
          XmlDS xmlDS = new XmlDS(conn, request, response);
          xmlDS.addEtcDataAll(SQLUtil.getResultSetWithClose(vstmt));
          hmPreparedData.put("xmlApplTypeInfo", xmlDS.makeXml());
          
          return hmPreparedData;
      }
    /**
     * 신청 조회
     * 
     * @param form
     * @throws SQLException
     */
    public void search01( hunelBaseForm form ) throws SQLException {
        String query = xmlQuery.getElement(this, "search01", null);
        VarStatement vstmt = new VarStatement(conn, query, request);
        
        vstmt.setParameter("C_CD", ehrbean.getCCD());
        vstmt.setParameter("APPL_ID", form.getValue("S_APPL_ID"));
        
        log.debug(vstmt.getQueryString());
        setResultSet(SQLUtil.getResultSetWithClose(vstmt));
    }
    
    @Override
    protected void delete01_before( hunelBaseForm form ) throws SQLException, hunelBizException {
        String S_APPL_ID = form.getValue("S_APPL_ID");
        CUDSQLManager cud = new CUDSQLManager(conn, request);
        cud.setTable("GIF210");
        cud.addKey("C_CD", ehrbean.getCCD());
        cud.addKey("APPL_ID", S_APPL_ID);
        
        cud.delete();
        
    }
    
    @Override
    protected void delete01_after( hunelBaseForm form ) throws SQLException, hunelBizException {
    	log.debug("call delete01_after!");
    }
    
    @Override
    protected void save01_biz( hunelBaseForm form, String S_IUD_MODE, String S_APPL_ID ) throws SQLException, hunelBizException {
        
        CUDSQLManager cud = new CUDSQLManager(conn, request);
        cud.setTable("GIF210");
        cud.addKey("C_CD", ehrbean.getCCD());
        cud.addKey("APPL_ID", S_APPL_ID);
        cud.addField("GIF_TYPE", form.getValue("S_GIF_TYPE"));
        cud.addField("GIF_MON", form.getValue("S_GIF_MON"));
        cud.addField("NOTE", form.getValue("S_NOTE"));
        cud.addField("MOD_USER_ID", ehrbean.get("USER_ID"));
        cud.addFieldRaw("MOD_YMDHMS", "SYSTIMESTAMP");
        cud.addFieldRaw("MOD_GYMDHMS", "CURRENT_TIMESTAMP");
        
        if ("I".equals(S_IUD_MODE)) {
            cud.insert();
        } else if ("U".equals(S_IUD_MODE)) {
            cud.update();
        }
    }
    
    @Override
    protected void apply01_before( hunelBaseForm form ) throws SQLException, hunelBizException {
    	log.debug("call apply01_before!");
    }
    
    @Override
    protected void apply01_after( hunelBaseForm form ) throws SQLException, hunelBizException {
    	log.debug("call apply01_after!");
    }
    
    @Override
    protected void appr01_before( hunelBaseForm form ) throws SQLException, hunelBizException {
        
    }
    
    @Override
    protected void appr01_after( hunelBaseForm form ) throws SQLException, hunelBizException {
    	log.debug("call appr01_after!");
    }
    
    @Override
    protected void noappr01_before( hunelBaseForm form ) throws SQLException, hunelBizException {
    	log.debug("call noappr01_before!");
    }
    
    @Override
    protected void noappr01_after( hunelBaseForm form ) throws SQLException, hunelBizException {
    	log.debug("call noappr01_after!");
    }
    
    public void onApplComplete( hunelBaseForm form ) throws SQLException, hunelBizException {
        String APPL_ID = form.getValue("S_APPL_ID");
        onApplComplete(APPL_ID);
    }
    
    public void onApplComplete( String APPL_ID ) throws SQLException, hunelBizException {
    	Sys_common sys_common = new Sys_common(conn, request, response);
        String DATA_ID = sys_common.selectNEW_TABLE_ID(ehrbean.getCCD(), "GIF220", "DATA_ID", "4");
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
     * 선물유형 정보 조회
     * 
     * @param form hunelBaseForm
     * @throws SQLException
     */
    public void gifType( hunelBaseForm form ) throws SQLException {
        String query = xmlQuery.getElement(this, "gifType", null);
        VarStatement vpstmt = new VarStatement(conn, query, request);
        vpstmt.setParameter("C_CD", ehrbean.getCCD());
        vpstmt.setParameter("GIF_TYPE", form.getValue("S_GIF_TYPE"));
        log.debug(vpstmt.getQueryString());
        addEtcDataAll(SQLUtil.getResultSetWithClose(vpstmt));
    }
    
}