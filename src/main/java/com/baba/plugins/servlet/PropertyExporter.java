package com.baba.plugins.servlet;


import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Writer;
import java.util.Objects;
import java.util.stream.Collectors;

public class PropertyExporter extends HttpServlet {

    public PropertyExporter() {
    }

    @Override
    protected void doGet(
            final HttpServletRequest httpServletRequest,
            final HttpServletResponse httpServletResponse) throws IOException {

        httpServletResponse.setStatus(HttpServletResponse.SC_OK);
        httpServletResponse.setContentType("text/plain; charset=UTF-8");
        httpServletResponse.setCharacterEncoding("UTF-8");

        try (Writer writer = httpServletResponse.getWriter()) {
            PrintWriter out = httpServletResponse.getWriter();

            String pathInfo = httpServletRequest.getPathInfo();
            String[] pathParts = pathInfo.split("/");
            String reportId = pathParts[pathParts.length - 1];

            String report = "";
            if(Objects.nonNull(reportId)) {
                report = (String) getServletConfig().getServletContext().getAttribute(reportId);
            }
            out.print(report);
            writer.flush();
        }
    }

    @Override
    protected void doPost(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws IOException {
        String requestBody = httpServletRequest.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
        try {

            String pathInfo = httpServletRequest.getPathInfo();
            String[] pathParts = pathInfo.split("/");
            String reportId = pathParts[pathParts.length - 1];

            JSONObject jsonObj = new JSONObject(requestBody);
            JSONArray reportJson = jsonObj.getJSONArray("reportJson");

            StringBuilder sb = new StringBuilder();

            for(int i = 0; i < reportJson.length(); i++) {
                JSONObject item = (JSONObject) reportJson.get(i);
                String key = item.get("key").toString();
                String value = item.get("value").toString();
                if(StringUtils.contains(key, "CLOVER")) {
                    key = key.replace(".", "_");
                    sb.append(key).append(" ").append(value).append("\n");
                }
            }

            String outputString = StringUtils.chomp(sb.toString());

            getServletConfig().getServletContext().setAttribute(reportId, outputString);

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
}
