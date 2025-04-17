package com.pastoral.social.demo.adapters.dao.transaction;

import com.pastoral.social.demo.application.port.out.UnitOfWork;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Objects;

public class Transacional implements UnitOfWork {
    private final Connection conn;

    public Transacional(final Connection conn) {
        this.conn = Objects.requireNonNull(conn);
    }

    @Override
    public void startTransaction() {
        try {
            this.conn.setAutoCommit(false);
        } catch (SQLException e) {
            System.out.println("startTransaction" + e.getMessage());
            this.closeSilently();
        }
    }

    @Override
    public void commit() {
        try {
            this.conn.commit();
        } catch (SQLException e) {
            System.out.println("commit" + e.getMessage());
        } finally {
            this.closeSilently();
        }
    }

    @Override
    public void rollback() {
        try {
            this.conn.rollback();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        } finally {
            this.closeSilently();
        }
    }

    private void closeSilently() {
        try {
            this.conn.close();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }
}
