package com.pastoral.social.demo.adapters.util;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.hibernate.validator.messageinterpolation.ParameterMessageInterpolator;

import java.util.*;

public final class ValidatorUtils {
    private static final ValidatorFactory factory = Validation
            .byDefaultProvider()
            .configure()
            .messageInterpolator(new ParameterMessageInterpolator())
            .buildValidatorFactory();
    private static final Validator validator = factory.getValidator();

    private ValidatorUtils() {}

    public static <T> String validate(T object) {
        Set<ConstraintViolation<T>> violations = validator.validate(object);
        final List<String> listErrors = new ArrayList<>();
        for (ConstraintViolation<T> violation : violations) {
            listErrors.add(violation.getMessage());
        }
        return String.join("\n", listErrors);
    }
}
