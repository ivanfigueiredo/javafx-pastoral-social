package com.pastoral.social.demo.adapters.util;

import javafx.scene.control.Button;
import javafx.scene.layout.HBox;

import java.util.List;

public final class HBoxUtils {
    private static final Integer ESPACAMENTO = 10; // 10px

    private HBoxUtils() {}

    public static HBox createHBox(final List<Button> buttons) {
        final HBox hBox = new HBox(ESPACAMENTO);
        buttons.forEach(item -> hBox.getChildren().add(item));
        return hBox;
    }
}
