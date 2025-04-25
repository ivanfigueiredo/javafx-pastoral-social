package com.pastoral.social.demo.application.exceptions;

public class NoStacktraceException extends RuntimeException {
    protected NoStacktraceException(final String message) {
        this(message, null);
    }

    protected NoStacktraceException(final String message, final Throwable cause) {
        super(message, cause, true, false);
    }
}
