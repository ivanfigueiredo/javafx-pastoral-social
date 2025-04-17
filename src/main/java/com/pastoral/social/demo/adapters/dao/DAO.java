package com.pastoral.social.demo.adapters.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DAO {

    public Connection getConnection() throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/tps_database", "root", "root");
        System.out.println("Banco de dados conectado com sucesso");
        return conn;
    }
}
