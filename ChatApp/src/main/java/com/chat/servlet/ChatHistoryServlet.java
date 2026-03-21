package com.chat.servlet;

import java.io.*;
import java.util.*;
import com.chat.dao.MessageDAO;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

@WebServlet("/history")
public class ChatHistoryServlet extends HttpServlet {

    protected void doGet(HttpServletRequest req, HttpServletResponse res)
    throws IOException {

        String u1 = req.getParameter("u1");
        String u2 = req.getParameter("u2");

        res.setContentType("text/plain");

        List<String> list = MessageDAO.getMessages(u1, u2);

        PrintWriter out = res.getWriter();

        for (String s : list) {
            out.println(s);
        }
    }
}