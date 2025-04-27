package com.pastoral.social.demo.adapters.controller;

import com.pastoral.social.demo.adapters.factory.ControllerFactoryRegistry;
import javafx.event.ActionEvent;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.image.Image;
import javafx.scene.layout.Pane;
import javafx.stage.Modality;
import javafx.stage.Stage;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.Objects;

@Slf4j
public final class ModalLoader {
    private ModalLoader() {}

    public static synchronized <T extends ControllerModalBase<D>, D> void createModal(final String absolutePath, final ActionEvent event, final String title, final D data) {
        try {
            FXMLLoader loader = new FXMLLoader(ModalLoader.class.getResource(absolutePath));
            Pane pane = loader.load();
            Stage dialogStage = new Stage();
            Stage parentStage = currentStage(event);
            Image icon = new Image(Objects.requireNonNull(ModalLoader.class.getResourceAsStream("/com/pastoral/social/demo/icon.png")));
            dialogStage.getIcons().add(icon);
            dialogStage.setTitle(title);
            dialogStage.setScene(new Scene(pane));
            dialogStage.setResizable(false);
            dialogStage.initOwner(parentStage);
            dialogStage.initModality(Modality.WINDOW_MODAL);
            T controller = loader.getController();
            if (Objects.nonNull(controller)) {
                ControllerFactoryRegistry.inject(controller);
                controller.setData(data);
                controller.setup();
            }
            dialogStage.showAndWait();
        } catch (IOException e) {
            log.error(e.getMessage(), e);
            Alerts.showAlert("IO Exception", "Error loading view", e.getMessage(), Alert.AlertType.ERROR);
        }
    }

    private static Stage currentStage(final ActionEvent event) {
        return (Stage) ((Node) event.getSource()).getScene().getWindow();
    }
}
