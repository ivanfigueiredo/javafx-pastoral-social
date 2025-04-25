package com.pastoral.social.demo.application.exceptions;

public class SQLExecutionException extends NoStacktraceException {
    public SQLExecutionException(String message) {
        super(message);
    }
}
