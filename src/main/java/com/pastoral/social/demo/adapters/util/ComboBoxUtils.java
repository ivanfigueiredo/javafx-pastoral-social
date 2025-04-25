package com.pastoral.social.demo.adapters.util;

import com.pastoral.social.demo.application.dto.DataObjectTransferBase;
import javafx.scene.control.ListCell;
import javafx.scene.control.ListView;
import javafx.util.Callback;

import java.util.Objects;

public final class ComboBoxUtils {
    private ComboBoxUtils() {}

    public static <T extends DataObjectTransferBase> Callback<ListView<T>, ListCell<T>> factory() {
        return lv -> new ListCell<T>() {
            @Override
            protected void updateItem(T item, boolean empty) {
                super.updateItem(item, empty);
                setText(empty || Objects.isNull(item) ? "" : item.getDescricao());
                setStyle("-fx-font-size: 15pt;");
            }
        };
    }
}
