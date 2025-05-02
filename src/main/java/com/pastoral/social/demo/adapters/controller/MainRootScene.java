package com.pastoral.social.demo.adapters.controller;

import com.pastoral.social.demo.MainApplication;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.ScrollPane;
import javafx.scene.image.Image;
import javafx.stage.Screen;
import javafx.stage.Stage;
import lombok.Getter;

import java.io.IOException;
import java.util.Objects;

@Getter
public class MainRootScene extends Application {
    private static Scene mainScene;

    @Override
    public void start(Stage stage) throws IOException {
        FXMLLoader fxmlLoader = new FXMLLoader(MainApplication.class.getResource("main-view.fxml"));
        ScrollPane scrollPane = fxmlLoader.load();
        scrollPane.setFitToHeight(true);
        scrollPane.setFitToWidth(true);
        mainScene = new Scene(scrollPane);
//        mainScene.getStylesheets().add("/com/pastoral/social/demo/style.css");
        stage.setScene(mainScene);
        stage.setTitle("Pastoral Social");
        Image icon = new Image(Objects.requireNonNull(getClass().getResourceAsStream("/com/pastoral/social/demo/icon.png")));
        stage.getIcons().add(icon);
        stage.setResizable(false);
        stage.setWidth(Screen.getPrimary().getVisualBounds().getWidth());
        stage.setHeight(Screen.getPrimary().getVisualBounds().getHeight());
        stage.show();
    }

    public static Scene getRootScene() {
        return mainScene;
    }
}
