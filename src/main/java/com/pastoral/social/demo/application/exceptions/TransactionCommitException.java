package com.pastoral.social.demo.application.exceptions;

public class TransactionCommitException extends NoStacktraceException {
    public TransactionCommitException(String message) {
        super(message);
    }
}
