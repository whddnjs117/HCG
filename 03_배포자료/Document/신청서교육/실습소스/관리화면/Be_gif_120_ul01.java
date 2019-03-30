package biz.bsi.be_gif;

import hcg.hunel.core.action.hunelBaseForm;
import hcg.hunel.core.action.hunelCommonDS;
import hcg.hunel.core.sql.*;

import java.sql.*;

import javax.servlet.http.*;

import common.util.ComboDS;
import common.util.IPreparedData;
import biz.sys.Sys_common;

import java.util.HashMap;

/**<pre>
 *<li>Program Name : Be_gif_120_ul01
 *<li>Description  : 명절선물 관리
 *<li>History      : 2009-09-14 신규개발
 *</pre>
 *@author 정두영
 */
public class Be_gif_120_ul01 extends hunelCommonDS implements IPreparedData
{

    /**
     * 생성자
     * @param conn Connection
     * @param request HttpServletRequest
     */
    public Be_gif_120_ul01(Connection conn, HttpServletRequest request, HttpServletResponse response)
    {
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
          
          hmPreparedData.put("SY110",  comboDS.getCodeCombo(S_C_CD, "SY110", ehrbean.get("LANG_TYPE")) );
          hmPreparedData.put("/GI01",  comboDS.getCodeCombo(S_C_CD, "/GI01", ehrbean.get("LANG_TYPE")) );
          
          return hmPreparedData;
      }
    
    /**
     * 경조금 목록 조회
     * @param form hunelBaseForm
     * @throws SQLException
     */
    public void search01(hunelBaseForm form) throws SQLException
    {
    	HashMap<String, String> authMap = xmlQuery.chkAuthMenu(conn, request, ehrbean, form);
    	authMap.put("COL_EMP", "EMP_ID");
    	
        StringBuffer sb = new StringBuffer();

        String block = sb.toString();
        String query = xmlQuery.getElement(this, "search01", block, authMap);
        VarStatement vstmt = new VarStatement(conn, query, request,authMap);
        vstmt.setParameter("C_CD", ehrbean.getCCD());
        vstmt.setParameter("LANG_TYPE", ehrbean.get("LANG_TYPE"));
        
        log.debug(vstmt.getQueryString());
        setResultSet(SQLUtil.getResultSetWithClose(vstmt));
    }

}