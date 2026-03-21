package com.chat.dao;

import java.sql.*;
import java.util.*;
import com.chat.util.DBConnection;

public class MessageDAO {

    public static void saveMessage(String s, String r, String m) {
        try {
            Connection c = DBConnection.getConnection();

            PreparedStatement ps = c.prepareStatement(
                "insert into messages values(msg_seq.nextval,?,?,?,systimestamp,0)");

            ps.setString(1, s);
            ps.setString(2, r);
            ps.setString(3, m);

            ps.executeUpdate();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static List<String> getMessages(String u1, String u2) {

        List<String> list = new ArrayList<>();

        try {
            Connection c = DBConnection.getConnection();

            PreparedStatement ps = c.prepareStatement(
                "select sender,message,to_char(time,'HH24:MI') from messages " +
                "where (sender=? and receiver=?) or (sender=? and receiver=?) order by time"
            );

            ps.setString(1, u1);
            ps.setString(2, u2);
            ps.setString(3, u2);
            ps.setString(4, u1);

            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                list.add(rs.getString(1) + "|" + rs.getString(2) + "|" + rs.getString(3));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return list;
    }
}