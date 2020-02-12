<%@ page import="java.io.*"%>
<%@ page import="java.util.*"%>
<%@ page import="java.lang.*"%>
<%@ page import="java.net.URLEncoder"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
  pageEncoding="UTF-8"%>
<%
    String logPath = "C:/EHR_PROJECT/HUNEL_EHRS_WEB_STAND/logs/";
//       String logPath = "D:/CCHRPYTMBN/SKCC_PTBHR_WEB/src/main/resources/logs/";
      String fileName = request.getParameter("log_filenmae") == null ? "" : request.getParameter("log_filename");

      String logStr = "";
      if ("".equals(fileName.trim()) == false) {
        fileName = logPath + fileName.trim().replaceAll("\\.\\.", "");

        //System.out.println(fileName);

        long preEndPoint = request.getParameter("preEndPoint") == null
            ? 0
            : Long.parseLong(request.getParameter("preEndPoint") + "");

        StringBuffer log = new StringBuffer();
        long startPoint = 0;
        long endPoint = 0;

        RandomAccessFile file = null;

        String str = "";

        try {
          file = new RandomAccessFile(fileName, "r");

          endPoint = file.length();
          // System.out.println(file.length());

          startPoint = preEndPoint > 0 ? preEndPoint : endPoint < 2000 ? 0 : endPoint - 2000;

          file.seek(startPoint);

          while ((str = file.readLine()) != null) {
            // System.out.println(str);
            log.append(str);
            log.append("\n");
            endPoint = file.getFilePointer();
            file.seek(endPoint);
          }

        } catch (FileNotFoundException e) {
          log.append("File does not exist.");
          e.printStackTrace();
        } catch (Exception e) {
          log.append("Sorry. An error has occurred.");
          e.printStackTrace();
        } finally {
          try {
            file.close();
          } catch (Exception e) {

          }
        }
        if (log.toString() == null) {
          logStr = "";
        } else {
          logStr = URLEncoder.encode(new String(log.toString().getBytes("ISO-8859-1"), "UTF-8"), "UTF-8")
              .replaceAll("\\+", "%20");
          // System.out.println(logStr);
          // consoleLog.val(logStr);
        }
        out.println("{\"endPoint\":\"" + endPoint + "\", \"log\":\"" + logStr + "\"}");
        System.out.println("<====================================== out print");
      } else {
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>::::</title>
<script src="/common/iborg/lib/jquery-1.11.2.min.js"></script>
<style type="text/css">
* {
  margin: 0;
  padding: 0;
}

#header {
  position: fixed;
  top: 0;
  left: 100%;
  width: 100%;
  height: 10%;
}

#console {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 90%;
  background-color: black;
  color: white;
  font-size: 15px;
}

#runningFlag {
  color: red;
}
</style>
</head>
<body>
  <div id="header">
    <h2>개발서버 로그(안 쓸때는 꺼주세요)</h2>
    포함 문자열(해당 라인만 포함) <input id="grep" type="text" /> 제외 문자열(해당 라인 제외)
    <input id="grepV" type="text" /> <br /> <input id="startTail"
      type="button" value="로그조회시작">&nbsp;&nbsp;&nbsp; <input
      id="stopTail" type="button" value="로그조회중지">&nbsp;&nbsp;&nbsp;
    조회상태 : <span id="runningFlag"></span>
  </div>
  <textarea id="console"></textarea>
</body>
<script type="text/javascript">
var endPoint = 0;
var tailFlag = false;
var fileName;
var consoleLog;
var grep;
var grepV;
var pattern;
var patternV;
var runningFlag;
var match;
var logdata;

$(document).ready(function() {
    consoleLog = $("#console");
    runningFlag = $("#runningFlag");

    function startTail() {
        runningFlag.html("로그조회중");
        fileName = "ehr.log"; // 출력할 로그 파일명
        grep = $.trim($("#grep").val());
        grepV = $.trim($("#grepV").val());
        pattern = new RegExp(".*" + grep + ".*\\n", "g");
        patternV = new RegExp(".*" + grepV + ".*\\n", "g");

        requestLog(tailFlag);
    }

    function requestLog(tailFlag) {
        if (tailFlag) {
            $.ajax({
                type: "POST",
                url: "/log.jsp", // 해당 소스파일 이름
                dataType: {
                    "log_filename": fileName,
                    "preEndPoint": endPoint
                },
                success: function(rv) {
                    var data = eval("(" + rv + ")");

                    endPoint = data.endPoint == false ? 0 : data.endPoint;
                    logData = decodeURIComponent(data.log);
                    if (grep != false) {
                        match = logdata.match(pattern);
                        logdata = match ? match.join("") : "";
                    }
                    if (grepV != false) {
                        logData = logdata.replace(patternV, "");
                    }
                    // console.log("success");
                    // console.log("1", data);
                    consoleLog.val(consoleLog.val() + logdata);
                    consoleLog.scrollTop(consoleLog.prop("scrollHeight"));

                    setTimeout(requestLog, 1000);
                },
                error: function(error) {
                    // console.log("err");
                    // console.log(error);
                }
            });
        }
    }

    $("#startTail").on("click", function() {
        tailFlag = true;
        startTail();
    });

    $("#startTail").on("click", function() {
        tailFlag = false;
        runningFlag.html("중지됨");
    });
});
</script>
</html>
<%
    }
%>
