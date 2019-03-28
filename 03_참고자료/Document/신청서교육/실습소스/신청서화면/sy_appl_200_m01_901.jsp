<%@page language="java" contentType="text/html; charset=utf-8"%>
<%@include file="/common/jsp/header.jsp"%>

<%!String forwardPage = "/sys/sy_appl/sy_appl_200_m01.jsp"; %>
<%@include file="/common/jsp/forwardingPreparedData.jsp" %>

<jsp:forward page="<%=forwardPage%>" >
<jsp:param name="S_APPL_TYPE" value="901" />
<jsp:param name="S_APPL_MODE" value="APPL" />
</jsp:forward>