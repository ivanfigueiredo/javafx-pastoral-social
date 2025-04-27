package com.pastoral.social.demo.adapters.dao.transaction;

import java.util.List;
import java.util.Map;

public interface TransacionalPersistence<T> {
    void saveOrUpdate(String SQL, Map<String, Object> data);
    List<T> find(String SQL);
    void delete(String SQL, Map<String, Object> data);
}
