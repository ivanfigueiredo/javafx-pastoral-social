package com.pastoral.social.demo.adapters.util;

import javafx.scene.control.TextField;

import java.util.Objects;

public final class TextFieldUtils {
    private TextFieldUtils() {}

    public static void restrictToAlphabeticInput(final TextField textField) {
        textField.textProperty().addListener((obs, oldValue, newValue) -> {
            if (Objects.nonNull(newValue)) {
                boolean isOnlyLetters = newValue.matches("[a-zA-Z]*");
                if (!isOnlyLetters) {
                    textField.setText(oldValue);
                }
            }
        });
    }
}
