package com.pastoral.social.demo.adapters.dao;

import lombok.extern.slf4j.Slf4j;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

@Slf4j
public class DAO {

    public Connection getConnection() throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/tps_database", "root", "root");
        log.info("Banco de dados conectado com sucesso");
        return conn;
    }
}
