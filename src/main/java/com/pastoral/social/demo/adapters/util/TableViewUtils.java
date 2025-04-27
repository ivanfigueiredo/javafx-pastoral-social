package com.pastoral.social.demo.adapters.util;

import com.pastoral.social.demo.adapters.controller.Alerts;
import com.pastoral.social.demo.adapters.controller.ModalLoader;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.TableCell;
import javafx.scene.control.TableColumn;
import javafx.scene.layout.HBox;
import javafx.util.Callback;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;
import java.util.function.Function;

public final class TableViewUtils {
    private TableViewUtils() {}

    public static <T> Callback<TableColumn<T, Void>, TableCell<T, Void>> factory(
            Function<T, Button> buttonEdit,
            Function<T, Button> buttonDelete,
            final Consumer<T> onActionDelete,
            Runnable refresh
    ) {
        return column -> new TableCell<>() {
            @Override
            public void updateItem(Void item, boolean empty) {
                super.updateItem(item, empty);
                if (empty) {
                    setGraphic(null);
                } else {
                    T rowData = getTableView().getItems().get(getIndex());
                    final Button btnEdit = buttonEdit.apply(rowData);
                    final Button btnDelete = buttonDelete.apply(rowData);
                    btnDelete.setOnAction(e -> {
                        onActionDelete.accept(rowData);
                        Alerts.showAlert("Delete Concluído", null, "Produto deletado com sucesso", Alert.AlertType.INFORMATION);
                        refresh.run();
                    });
                    btnEdit.setOnAction(event -> ModalLoader.createModal("/com/pastoral/social/demo/atualizar-alimento-view.fxml", event, "Atualizar Alimento", rowData));
                    final List<Button> buttons = new ArrayList<>();
                    buttons.add(btnEdit);
                    buttons.add(btnDelete);
                    final HBox hBox = HBoxUtils.createHBox(buttons);
                    setGraphic(hBox);
                }
            }
        };
    }

    public static <T> Callback<TableColumn<T, Void>, TableCell<T, Void>> factory() {
        return column -> new TableCell<>() {
            @Override
            public void updateItem(Void item, boolean empty) {
                super.updateItem(item, empty);
                if (empty) {
                    setGraphic(null);
                } else {
                    T rowData = getTableView().getItems().get(getIndex());
                    final Button button = ButtonUtils.createButton("Editar");
                    button.setOnAction(event -> ModalLoader.createModal("/com/pastoral/social/demo/atualizar-alimento-view.fxml", event, "Atualizar Alimento", rowData));
                    setGraphic(button);
                }
            }
        };
    }
}
