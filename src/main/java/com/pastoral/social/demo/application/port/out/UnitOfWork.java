package com.pastoral.social.demo.application.port.out;

public interface UnitOfWork {
    void startTransaction();
    void commit();
    void rollback();
}
