package com.chat.websocket;

import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import java.util.*;
import java.time.LocalTime;
import com.chat.dao.MessageDAO;

@ServerEndpoint("/chat")
public class ChatEndpoint {

    static Map<String, Session> users = new HashMap<>();

    @OnMessage
    public void onMessage(String msg, Session s) throws Exception {

        if (msg.startsWith("join:")) {

            String user = msg.split(":")[1];
            users.put(user, s);
            sendUsers();
        }

        else if (msg.startsWith("msg:")) {

            String[] p = msg.split(":", 4);

            String sender = p[1];
            String rec = p[2];
            String m = p[3];

            String time = LocalTime.now().toString().substring(0, 5);

            MessageDAO.saveMessage(sender, rec, m);

            String full = sender + "|" + m + "|" + time;

            Session r = users.get(rec);

            if (r != null) {
                r.getBasicRemote().sendText(full);
            }

            s.getBasicRemote().sendText(full);
        }

        else if (msg.startsWith("typing:")) {

            String[] p = msg.split(":");

            Session r = users.get(p[2]);

            if (r != null) {
                r.getBasicRemote().sendText("typing:" + p[1]);
            }
        }

        else if (msg.startsWith("stop:")) {

            String[] p = msg.split(":");

            Session r = users.get(p[2]);

            if (r != null) {
                r.getBasicRemote().sendText("stop:" + p[1]);
            }
        }
    }

    void sendUsers() throws Exception {

        String list = "users:";

        for (String u : users.keySet()) {
            list += u + ",";
        }

        for (Session s : users.values()) {
            s.getBasicRemote().sendText(list);
        }
    }
}