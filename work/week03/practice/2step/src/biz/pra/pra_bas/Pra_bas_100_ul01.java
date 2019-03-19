package biz.pra.pra_bas;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import common.util.ComboDS;
import common.util.IPreparedData;
import hcg.hunel.core.action.hunelBaseForm;
import hcg.hunel.core.action.hunelCommonDS;
import hcg.hunel.core.sql.CUDSQLManager;
import hcg.hunel.core.sql.SQLUtil;
import hcg.hunel.core.sql.VarStatement;
import hcg.hunel.core.util.StringUtil;


/**<pre>
 *<li>Program Name : Pr_bas_100_ul01.java
 *<li>Description  : 개인별 노트북렌탈관리
 *<li>History      : 2019.03.18 신규개발
 *</pre>
 *@author 소인성
 */
public class Pra_bas_100_ul01 extends hunelCommonDS implements IPreparedData
{

    /**
     * 생성자
     * @param conn Connection
     * @param request HttpServletRequest
     */
    public Pra_bas_100_ul01(Connection conn, HttpServletRequest request, HttpServletResponse response)
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
        
        hmPreparedData.put("/SY99", comboDS.getCodeCombo(S_C_CD, "/SY99", S_LANG_TYPE));
        
        return hmPreparedData;
    }

    /**
     * 사번관리 조회
     * 
     * @param form hunelBaseForm
     * @throws SQLException
     */
    public void search01(hunelBaseForm form) throws SQLException
    {
        String S_C_CD = ehrbean.getCCD();
        String query = xmlQuery.getElement(this, "search01", null);
        
        VarStatement vstmt = new VarStatement(conn, query, request, null);
        vstmt.setParameter("C_CD", S_C_CD);
        vstmt.setParameter("EMP_ID",  form.getValue("S_EMP_ID"));
        vstmt.setParameter("STA_YMD", form.getValue("S_STA_YMD"));
        vstmt.setParameter("END_YMD", form.getValue("S_END_YMD"));
        // 기본적으로 Optional한 함수들은 명시적으로 값을 넣어주자(Default)
        // 필수조건이라면 Null 체크를 할 필요는 없다.
        // 이런 부분은 KeyField도 아니므로 SQL에서 처리하는 것이 옳은 것 같다.
//        vstmt.setParameter("STA_YMD", StringUtil.nvl(form.getValue("S_STA_YMD"), "19000101"));
//        vstmt.setParameter("END_YMD", StringUtil.nvl(form.getValue("S_END_YMD"), "99991231"));
        log.debug(vstmt.getQueryString());
        setResultSet(SQLUtil.getResultSetWithClose(vstmt));
    }

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
}