package com.pastoral.social.demo.adapters.controller;

import com.pastoral.social.demo.MainApplication;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.ScrollPane;
import javafx.stage.Stage;
import lombok.Getter;

import java.io.IOException;

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
        stage.setScene(mainScene);
        stage.setTitle("Pastoral Social");
        stage.show();
    }

    public static Scene getRootScene() {
        return mainScene;
    }
}
