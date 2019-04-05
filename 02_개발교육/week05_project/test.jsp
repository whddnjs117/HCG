<form id="f1" name="f1" style="margin:0;" onSubmit="return false;" >

<input type="hidden" id="S_DSCLASS"        name="S_DSCLASS"         value="<com:otp value="biz.rpt.rp_isso.Rpt_isso_100_ul01" />" />
<input type="hidden" id="S_DSMETHOD"       name="S_DSMETHOD" />
<input type="hidden" id="S_SAVENAME"       name="S_SAVENAME" />
<input type="hidden" id="S_GIV_STD_ID"         name="S_GIV_STD_ID" />

<div class="wbox">
    <div class="hbox" boxsize="35">
        <!--// 타이틀 -->
        <div class="headTit">
            <h2 class="titA"><%=StringUtil.nvl(request.getParameter("X_MENU_NM"), resourceLabel.getString("mm_attn_aggr"))%></h2>
            <!-- // 버튼 -->
            <div class="btn_areaR">
                <com:auth btnAuth="WRITE"><span class="btn"><input type="button" value="<com:label key='aggr_exec' def='집계실행' />" class="blt" onclick="doAction('<com:otp value='batch01' />');" BA_TYPE="WRITE" /></span></com:auth>
            </div>
            <!-- 버튼 //-->
        </div>
        <!-- 타이틀 //-->
    </div>

    <div class="hbox" boxsize="80">
    <!--// 입력테이블 -->
        <table class="table_item">
            <colgroup>
                <col width="120px" />
                <col width="*" />
            </colgroup>
            <tr>
                <th class="blt"><com:label key='giv_std_nm' def='지급회차명' /></th>
                <td>
                    <span class="item_area">
                        <select id="S_GIV_TRG_NM" name="S_GIV_TRG_NM" class="insert_select" korname="커스텀콤보"></select>
                    </span>
                </td>
            </tr>  
            <tr>
                <th class="blt"><com:label key='trg_emp' def='대상자 조회' /></th>
                <td>
                    <span class="item_area">
                        <jsp:include page="/sys/sy_com/sy_com_181_c01.jsp" flush="true" >
                            <jsp:param name="S_MODE01" value="0060" />
                            <jsp:param name="S_REQUIRED" value="N" />
                            <jsp:param name="S_SIZE" value="10" />
                        </jsp:include>
                    </span>
                </td>
            </tr>
        </table>             
    </div>

    <div class="hbox">
        <div class="vbox">
            <div class="hbox" boxsize="35">
                <div class="headTit">
                    <h3 class="titB">
                        <%=StringUtil.nvl(request.getParameter("X_MENU_NM"), resourceLabel.getString("crt_emp_id"))%>
                    </h3>
                    <div class="btn_areaR">
                        <span class="btn"><com:auth btnAuth="WRITE"><input type="button" onFocus="blur()" class="insert" BA_TYPE="WRITE" value="<com:label key='insert' def='추가' />" onClick="doAction('<com:otp value='insert01' />');" /></com:auth></span>
                        <span class="btn"><com:auth btnAuth="WRITE"><input type="button" onFocus="blur()" class="copy" BA_TYPE="WRITE" value="<com:label key='copy' def='복사' />" onClick="doAction('<com:otp value='copy01' />');" /></com:auth></span>
                        <span class="btn"><com:auth btnAuth="WRITE"><input type="button" onFocus="blur()" class="save" BA_TYPE="WRITE" value="<com:label key='save' def='저장'/>" onClick="doAction('<com:otp value='save01' />');" /></com:auth></span>
                        <span class="btn"><com:auth btnAuth="PRINT"><input type="button" onFocus="blur()" class="ex" BA_TYPE="PRINT" value="DOWN" onClick="doAction('<com:otp value='down2excel01' />');" /></com:auth></span>
                        <span class="btn"><com:auth btnAuth="WRITE"><input type="button" value="UP" onclick="doAction('<com:otp value='upload2excel01' />');" class="exup" BA_TYPE="WRITE" /></com:auth></span>
                    </div>
                </div>
            </div>
            <!--// 그리드영역 -->
            <div class="hbox">
                <script >writeIBSheet(Page.SKIN_PATH, "sheet1");</script>
            </div>
            <!-- 그리드영역 //-->
        </div>
    </div>
</div>
</form>