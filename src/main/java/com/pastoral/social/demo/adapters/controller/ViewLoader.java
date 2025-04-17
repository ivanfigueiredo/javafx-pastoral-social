package com.pastoral.social.demo.adapters.controller;

import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.ScrollPane;
import javafx.scene.layout.VBox;

import java.io.IOException;
import java.util.function.Consumer;

public class ViewLoader {
    public static synchronized <T> void loadView(String absolutePath, Consumer<T> initializingAction) {
        try {
            FXMLLoader loader = new FXMLLoader(ViewLoader.class.getResource(absolutePath));
            VBox newVBox = loader.load();

            Scene mainScene = MainRootScene.getRootScene();
            VBox mainVBox = (VBox) ((ScrollPane) mainScene.getRoot()).getContent();

            Node mainMenu = mainVBox.getChildren().get(0);
            mainVBox.getChildren().clear();
            mainVBox.getChildren().add(mainMenu);
            mainVBox.getChildren().addAll(newVBox.getChildren());

            T controller = loader.getController();
            initializingAction.accept(controller);
        } catch (IOException e) {
            Alerts.showAlert("IO Exception", "Error loading view", e.getMessage(), Alert.AlertType.ERROR);
        }
    }
}
