package com.pastoral.social.demo.adapters.controller;

import com.pastoral.social.demo.adapters.factory.ResolveDependencyFactory;
import com.pastoral.social.demo.application.ComboBoxOptionsDTO;
import com.pastoral.social.demo.application.port.in.ListComboBoxUseCase;
import javafx.collections.FXCollections;
import javafx.fxml.FXML;
import javafx.scene.control.ComboBox;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class TestController {

    @FXML
    private ComboBox<String> comboBoxAlimento;

    @FXML
    private ComboBox<String> comboBoxCesta;

    @FXML
    private ComboBox<String> comboBoxTemplate;

    @FXML
    public void onComboboxAlimentoActions() {
        final String value = comboBoxAlimento.getSelectionModel().getSelectedItem();
        System.out.println("=======================>>>>>>>>>>>>>> VALUE " + value);
    }

    @FXML
    public void onComboboxTemplateActions() {
        final String value = comboBoxTemplate.getSelectionModel().getSelectedItem();
        System.out.println("=======================>>>>>>>>>>>>>> VALUE " + value);
    }

    @FXML
    public void onComboboxCestaActions() {
        final String value = comboBoxCesta.getSelectionModel().getSelectedItem();
        System.out.println("=======================>>>>>>>>>>>>>> VALUE " + value);
    }


    @FXML
    public void initialize() {
        final ListComboBoxUseCase listComboBoxUseCase = ResolveDependencyFactory.createListComboBoxUseCase();
        final List<ComboBoxOptionsDTO> comboBoxOptionsDTOList = listComboBoxUseCase.execute();
        Map<String, List<String>> agrupadoPorDepartamento = comboBoxOptionsDTOList.stream()
                .collect(Collectors.groupingBy(
                        dto -> dto.getDeparmento().getDeparmento(),
                        Collectors.mapping(ComboBoxOptionsDTO::getValorItem, Collectors.toList())
                ));
        if (agrupadoPorDepartamento.containsKey("Alimento")) {
            List<String> items = agrupadoPorDepartamento.get("Alimento");
            comboBoxAlimento.setItems(FXCollections.observableList(items));
            comboBoxAlimento.setPromptText("Alimento");
        }
        if (agrupadoPorDepartamento.containsKey("Cesta")) {
            List<String> items = agrupadoPorDepartamento.get("Cesta");
            comboBoxCesta.setItems(FXCollections.observableList(items));
            comboBoxCesta.setPromptText("Cesta");
        }
        if (agrupadoPorDepartamento.containsKey("Template Cesta")) {
            List<String> items = agrupadoPorDepartamento.get("Template Cesta");
            comboBoxTemplate.setItems(FXCollections.observableList(items));
            comboBoxTemplate.setPromptText("Template Cesta");
        }
    }
}
