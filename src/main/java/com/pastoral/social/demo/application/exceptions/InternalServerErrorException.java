package com.pastoral.social.demo.application.exceptions;

public class InternalServerErrorException extends NoStacktraceException {
    public InternalServerErrorException(String message) {
        super(message);
    }
}
