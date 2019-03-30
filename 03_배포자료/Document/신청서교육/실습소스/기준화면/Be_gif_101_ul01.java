package biz.bsi.be_gif;

import hcg.hunel.core.action.*;
import hcg.hunel.core.sql.*;
import hcg.hunel.core.util.StringUtil;

import java.sql.*;
import java.util.HashMap;

import javax.servlet.http.*;

import common.util.ComboDS;
import common.util.IPreparedData;

/**<pre>
 *<li>Program Name : Be_gif_101_ul01
 *<li>Description  : 경조금 처리기준
 *<li>History      : 2007.11.16 신규개발
 *</pre>
 *@author 박영환
 */
public class Be_gif_101_ul01 extends hunelCommonDS implements IPreparedData
{

    /**
     * 생성자
     * @param conn Connection
     * @param request HttpServletRequest
     */
    public Be_gif_101_ul01(Connection conn, HttpServletRequest request, HttpServletResponse response)
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
          
          hmPreparedData.put("/GI01",  comboDS.getCodeCombo(S_C_CD, "/GI01", ehrbean.get("LANG_TYPE")) );
            
          return hmPreparedData;
      }

    
    /**
     * 경조금 처리 기준 조회
     * @param form hunelBaseForm
     * @throws SQLException
     */
    public void search01(hunelBaseForm form) throws SQLException
    {
        String query = xmlQuery.getElement(this, "search01", null);
        VarStatement vstmt = new VarStatement(conn, query, request);
        vstmt.setParameter("C_CD", ehrbean.getCCD());
        log.debug(vstmt.getQueryString());
        setResultSet(SQLUtil.getResultSetWithClose(vstmt));
    }

    public void save01(hunelBaseForm form) throws SQLException, hunelBizException
    {
        CUDSQLManager cud = new CUDSQLManager(conn, request);
        int sz = form.getValues("CSTATUS").length;
        String CSTATUS;
        for (int n = 0; n < sz; n++)
        {
            CSTATUS = form.getValues("CSTATUS")[n];
            
            cud.setTable("GIF020");
            cud.addKey("C_CD", ehrbean.getCCD());
            cud.addKey("GIF_TYPE", form.getValues("GIF_TYPE")[n]);
            cud.addField("GIF_MON", form.getValues("GIF_MON")[n]);
            cud.addField("NOTE", form.getValues("NOTE")[n]);
            cud.addField("MOD_USER_ID", ehrbean.get("USER_ID"));
            cud.addFieldRaw("MOD_YMDHMS", "SYSTIMESTAMP");
            cud.addFieldRaw("MOD_GYMDHMS", "CURRENT_TIMESTAMP");
            switch (form.getValues("CSTATUS")[n].charAt(0))
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
                default :
                {
                    log.info("Not found case!");
                }
            }
        }
    }
    
}