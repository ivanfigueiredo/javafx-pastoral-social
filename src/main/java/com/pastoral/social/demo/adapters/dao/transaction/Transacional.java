package com.pastoral.social.demo.adapters.dao.transaction;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.pastoral.social.demo.adapters.dao.DAO;
import com.pastoral.social.demo.adapters.dao.entities.EntityBase;
import com.pastoral.social.demo.application.exceptions.SQLExecutionException;
import com.pastoral.social.demo.application.exceptions.TransactionCommitException;
import com.pastoral.social.demo.application.exceptions.TransactionStartException;
import com.pastoral.social.demo.application.port.out.UnitOfWork;
import lombok.extern.slf4j.Slf4j;

import java.sql.*;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
public class Transacional<T extends EntityBase> implements UnitOfWork, TransacionalPersistence<T> {
    private final Connection conn;
    private final ObjectMapper objectMapper;
    private final Class<T> type;

    public Transacional(final Class<T> type) throws SQLException {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        final DAO dao = new DAO();
        this.conn = dao.getConnection();
        this.type = type;
    }

    @Override
    public void startTransaction() {
        try {
            this.conn.setAutoCommit(false);
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            this.closeSilently();
            throw new TransactionStartException("Erro ao fazer start numa transacao");
        }
    }

    @Override
    public void commit() {
        try {
            this.conn.commit();
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            throw new TransactionCommitException("Erro ao comitar transacoes");
        } finally {
            this.closeSilently();
        }
    }

    @Override
    public void rollback() {
        try {
            this.conn.rollback();
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
        } finally {
            this.closeSilently();
        }
    }

    private void closeSilently() {
        try {
            this.conn.close();
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
        }
    }

    @Override
    public void saveOrUpdate(final String SQL, final Map<String, Object> data) {
        int i = 1;
        try(PreparedStatement ps = this.conn.prepareStatement(SQL)) {
            for (Object value: data.values()) {
                ps.setObject(i, value);
                i++;
            }
            ps.executeUpdate();
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            throw new SQLExecutionException("Erro ao persistir dados");
        }
    }

    @Override
    public List<T> find(final String SQL) {
        final List<Map<String, Object>> result = findQuery(SQL);
        return result.stream()
                .map(m -> objectMapper.convertValue(m, this.type))
                .collect(Collectors.toList());
    }

    @Override
    public void delete(String SQL, Map<String, Object> data) {
        saveOrUpdate(SQL, data);
    }


    private List<Map<String, Object>> findQuery(final String SQL) {
        try(Connection conn = this.conn;
            PreparedStatement ps = conn.prepareStatement(SQL);
            ResultSet rs = ps.executeQuery()
        ) {
            ResultSetMetaData meta = rs.getMetaData();
            int colCount = meta.getColumnCount();
            List<Map<String,Object>> rows = new ArrayList<>();
            while(rs.next()) {
                Map<String,Object> row = new LinkedHashMap<>();
                for (int i = 1; i <= colCount; i++) {
                    row.put(meta.getColumnLabel(i), rs.getObject(i));
                }
                rows.add(row);
            }
            return rows;
        }
        catch (SQLException e) {
            log.error(e.getMessage(), e);
            return new ArrayList<>();
        }
    }
}
