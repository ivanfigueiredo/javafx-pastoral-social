package com.pastoral.social.demo.application.exceptions;

public class PersonalValidationException extends NoStacktraceException {
    public PersonalValidationException(String message) {
        super(message);
    }
}
