package com.pastoral.social.demo.adapters.controller;

import javafx.scene.control.Alert;

public class Alerts {
    public static void showAlert(final String title, final String header, final String content, final Alert.AlertType type) {
        Alert alert = new Alert(type);
        alert.setTitle(title);
        alert.setHeaderText(header);
        alert.setContentText(content);
        alert.show();
    }
}
