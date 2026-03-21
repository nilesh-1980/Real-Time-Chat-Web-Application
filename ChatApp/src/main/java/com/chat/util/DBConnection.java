package com.chat.util;

import java.sql.Connection;
import java.sql.DriverManager;

public class DBConnection {
    public static Connection getConnection() throws Exception {
        
        // Oracle driver load
        Class.forName("oracle.jdbc.driver.OracleDriver");

        // Connection
        return DriverManager.getConnection(
            "jdbc:oracle:thin:@localhost:1521:xe", // host:port:SID
            "nilesh",   // apna Oracle username
            "Nilesh"    // apna password
        );
    }
}