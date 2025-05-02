package com.pastoral.social.demo.adapters.controller;

import com.pastoral.social.demo.adapters.factory.ControllerFactoryRegistry;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.ScrollPane;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.VBox;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.Objects;

@Slf4j
public final class ViewLoader {
    private ViewLoader() {}

    public static synchronized <T> void loadView(final String absolutePath) {
        try {
            FXMLLoader loader = new FXMLLoader(ViewLoader.class.getResource(absolutePath));
            VBox newVBox = loader.load();
            Scene mainScene = MainRootScene.getRootScene();
            BorderPane borderPane = (BorderPane) ((ScrollPane) mainScene.getRoot()).getContent();
            VBox mainVBox = (VBox) borderPane.getCenter();
            mainVBox.getChildren().clear();
            mainVBox.getChildren().add(newVBox);
            T controller = loader.getController();
            if (Objects.nonNull(controller)) {
                ControllerFactoryRegistry.inject(controller);
            }
        } catch (IOException e) {
            log.error(e.getMessage(), e);
            Alerts.showAlert("IO Exception", "Error loading view", e.getMessage(), Alert.AlertType.ERROR);
        }
    }
}
