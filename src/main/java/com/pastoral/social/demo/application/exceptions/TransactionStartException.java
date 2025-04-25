package com.pastoral.social.demo.application.exceptions;

public class TransactionStartException extends NoStacktraceException {
    public TransactionStartException(final String message) {
        super(message);
    }
}
