package biz.pra.pra_bas;

import hcg.hunel.core.action.hunelBaseForm;
import hcg.hunel.core.action.hunelBizException;
import hcg.hunel.core.action.hunelCommonDS;
import hcg.hunel.core.sql.*;
import hcg.hunel.core.util.*;

import java.sql.*;
import java.io.*;
import java.util.*;

import javax.servlet.http.*;

import common.util.ComboDS;
import common.util.IPreparedData;
import common.util.XmlDS;
import common.util.hunelCryptoUtil;


/**<pre>
 *<li>Program Name : Pr_bas_100_ul01.java
 *<li>Description  : 개인별 노트북렌탈관리
 *<li>History      : 2019.03.18 신규개발
 *</pre>
 *@author 소인성
 */
public class Pr_bas_100_ul01 extends hunelCommonDS implements IPreparedData
{

    /**
     * 생성자
     * @param conn Connection
     * @param request HttpServletRequest
     */
    public Pr_bas_100_ul01(Connection conn, HttpServletRequest request, HttpServletResponse response)
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
        String S_LANG_TYPE = ehrbean.get("LANG_TYPE");
        
        HashMap hmPreparedData = new HashMap();
        ComboDS comboDS = new ComboDS(conn, request, response);
        
        return hmPreparedData;
    }

    /**
     * 사번관리 조회
     * @param form hunelBaseForm
     * @throws SQLException
     */
    public void search01(hunelBaseForm form) throws SQLException
    {
        String S_C_CD = ehrbean.getCCD();
        StringBuffer sb = new StringBuffer(100);
        sb.append("AND NVL(T1.WEEK_FINANC_YN, 'N') = 'N' \n");
        String block = sb.toString();
        String query = xmlQuery.getElement(this, "search01", block,null);
        
        VarStatement vstmt = new VarStatement(conn, query, request,null);
        vstmt.setParameter("C_CD", S_C_CD);
        vstmt.setParameter("STA_YMD", form.getValue("S_STA_YMD"));
        vstmt.setParameter("END_YMD", form.getValue("S_END_YMD"));
        log.debug(vstmt.getQueryString());
        setResultSet(SQLUtil.getResultSetWithClose(vstmt));
    }

    public void save01(hunelBaseForm form) throws SQLException, hunelBizException
    {
        int sz = form.getValues( "CSTATUS" ).length;
        String query = xmlQuery.getElement(this, "P_PA_MAKE_NEW_EMP_ID", null);
        VarStatement vstmt = new VarStatement(conn, query, request);    
        String IUD;
        for (int n = 0; n < sz; n++)
        {    
                IUD =form.getValues("CSTATUS")[n];
                if(!IUD.equals("R"))
                {
                        vstmt.setParameter("C_CD", ehrbean.getCCD());
                        vstmt.setParameter("IUD", IUD);
                        vstmt.setParameter("EMP_ID", form.getValues("EMP_ID")[n]);
                        
                        vstmt.setParameter("EMP_NM", form.getValues("EMP_NM")[n]);
                        vstmt.setParameter("PER_NO", form.getValues("PER_NO")[n]);
                        vstmt.setParameter("EMP_TYPE", form.getValues("EMP_TYPE")[n]);
                        vstmt.setParameter("RE_TYPE", form.getValues("RE_TYPE")[n]);
                        vstmt.setParameter("RE_GRD_CD", form.getValues("RE_GRD_CD")[n]);
                        vstmt.setParameter("EXPT_ENTER_YMD", form.getValues("EXPT_ENTER_YMD")[n]);
                        vstmt.setParameter("STD_YY", form.getValues("STD_YY")[n]);
                        vstmt.setParameter("BF_C_CD", form.getValues("BF_C_CD")[n]);
                        vstmt.setParameter("BF_EMP_ID", form.getValues("BF_EMP_ID")[n]);
                        vstmt.setParameter("MOD_USER_ID", ehrbean.get("USER_ID"));
                        vstmt.setParameter("CRT_PWD", hunelCryptoUtil.getEncrypt2(StringUtil.substr(form.getValues("PER_NO")[n],6,7)));
                        log.debug(StringUtil.substr(form.getValues("PER_NO")[n],6,7));
                        
                        vstmt.registerOutputParameter("O_ERRORCODE");
                        vstmt.registerOutputParameter("O_ERRORMESG");
                
                        log.debug(vstmt.getQueryString());
                        
                        
                        
                        vstmt.executeUpdate();
                        
                        String O_ERRORMESG = vstmt.getString("O_ERRORMESG");
                        if (!"0".equals(vstmt.getString("O_ERRORCODE")))
                        {
                        
                                vstmt.close();
                            throw new hunelBizException(O_ERRORMESG, ehrbean.getLocale(), true);
                        }
                }

        }
        vstmt.close();
    }
}