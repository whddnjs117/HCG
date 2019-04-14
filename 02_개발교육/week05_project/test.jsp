<body >
    <form id="f1" name="f1" onSubmit="return false;">
        <input type="hidden" id="S_DSCLASS" name="S_DSCLASS" value="<com:otp value='biz.rpt.rp_isso.appl.Rpt_isso_120_ul01' />" />
        <input type="hidden" id="S_DSMETHOD" name="S_DSMETHOD" />
        <input type="hidden" id="S_SAVENAME" name="S_SAVENAME" />
        <div class="wbox">
            <div class="hbox" boxsize="84">          
                <!--// 타이틀 -->
                <div class="headTit">
                    <h2 class="titA"><%=StringUtil.nvl(request.getParameter("X_MENU_NM"), resourceLabel.getString("bsi_menu_0021"))%></h2>
                </div>
                <!-- 타이틀 //-->
                <!--// search -->
                <div class="search_typeA clearFix">
                    <div class="searchA">
                        <div class="sch_area" onKeyDown="if(enterKeyDown(event))doAction('<com:otp value='search01' />');">
                            <div class="clearFix"></div>
                        </div>
                        <com:auth btnAuth="READ"><span class="btn_search"><input type="button" value="<com:label key='search' def='검색' />" onClick="doAction('<com:otp value='search01' />');" class="search" /></span></com:auth>
                    </div>
                </div>
                <!-- search //-->
            </div>
            <div class="hbox">
                <div class="vbox">
                    <div class="hbox" boxsize="35">
                        <!--// 타이틀 -->
                        <div class="headTit">
                            <h3 class="titB"><%=StringUtil.nvl(request.getParameter("X_MENU_NM"), resourceLabel.getString("bsi_menu_0021"))%></h3>
                            <!--// 버튼 -->
                            <div class="btn_areaR">
                                <com:auth btnAuth="PRINT"><span class="btn"><input type="button" value="DOWN" onClick="doAction('<com:otp value='down2excel01' />');" class="ex" BA_TYPE="PRINT" /></span></com:auth>
                            </div>
                            <!-- 버튼 //-->
                        </div>
                        <!-- 타이틀 //-->
                    </div>
                    <!--// 그리드 -->
                    <div class="vbox">
                        <script>writeIBSheet(Page.SKIN_PATH, "sheet1");</script>
                    </div>
                    <!-- 그리드 //-->
                </div>
                <!--// 슬라이더 -->
                <div class="vslider"></div>
                <!-- 슬라이더 //-->
                <div class="vbox">
                    <div class="vbox">
                        <div class="vbox">
                            <div class="hbox" boxsize="35">
                                <div class="headTit">
                                    <h3 class="titB">pie 차트
                                        <select class="chartCombo" id="pieCombo" onchange="pieChartDraw()">
                                            <option value="pie">파이</option> 
                                            <option value="pie_innersize">도넛</option> 
                                        </select>
                                    </h3>
                                </div>
                            </div>
                            <div class="hbox">
                            <script type="text/javascript">createIBChart("pieChart", "100%", "100%");</script>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</body>