package com.pastoral.social.demo.adapters.controller;

import com.pastoral.social.demo.application.dto.ListarAlimentosDTO;
import com.pastoral.social.demo.application.port.in.ListarAlimentosUseCase;
import javafx.beans.property.SimpleIntegerProperty;
import javafx.beans.property.SimpleStringProperty;
import javafx.fxml.FXML;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;

import java.util.List;
import java.util.Objects;

public class ListAlimentosController {
    private ListarAlimentosUseCase listarAlimentosUseCase;

    @FXML
    private TableView<ListarAlimentosDTO> tableViewAlimento;

    @FXML
    private TableColumn<ListarAlimentosDTO, Integer> tableColumnIdAlimento;

    @FXML
    private TableColumn<ListarAlimentosDTO, String> tableColumnMarca;

    @FXML
    private TableColumn<ListarAlimentosDTO, String> tableColumnIsValidade;

    @FXML
    private TableColumn<ListarAlimentosDTO, String> tableColumnCategoria;

    @FXML
    private TableColumn<ListarAlimentosDTO, String> tableColumnLocalizacao;

    @FXML
    private TableColumn<ListarAlimentosDTO, String> tableColumnEntrada;

    @FXML
    private TableColumn<ListarAlimentosDTO, String> tableColumnSaida;

    @FXML
    private TableColumn<ListarAlimentosDTO, String> tableColumnUnidadeMedida;

    public void setListarAlimentosUseCase(final ListarAlimentosUseCase listarAlimentosUseCase) {
        this.listarAlimentosUseCase = Objects.requireNonNull(listarAlimentosUseCase);
    }

    public void setup() {
        final List<ListarAlimentosDTO> listarAlimentosDTOList = this.listarAlimentosUseCase.execute();
        tableColumnIdAlimento.setCellValueFactory(cellData -> new SimpleIntegerProperty(cellData.getValue().getIdAlimento()).asObject());
        tableColumnMarca.setCellValueFactory(cellData -> new SimpleStringProperty(cellData.getValue().getMarca()));
        tableColumnIsValidade.setCellValueFactory(cellData -> new SimpleStringProperty(cellData.getValue().getIsValidate()));
        tableColumnCategoria.setCellValueFactory(cellData -> new SimpleStringProperty(cellData.getValue().getCategoria().getDescricao()));
        tableColumnLocalizacao.setCellValueFactory(cellData -> new SimpleStringProperty(cellData.getValue().getLocalizacao().getDescricao()));
        tableColumnEntrada.setCellValueFactory(cellData -> new SimpleStringProperty(cellData.getValue().getEntrada().toString()));
        tableColumnSaida.setCellValueFactory(cellData -> new SimpleStringProperty(Objects.isNull(cellData.getValue().getSaida()) ? "Em Estoque" : cellData.getValue().getSaida().toString()));
        tableColumnUnidadeMedida.setCellValueFactory(cellData -> new SimpleStringProperty(cellData.getValue().getUnidadeMedida().getDescricao()));
        tableViewAlimento.getItems().setAll(listarAlimentosDTOList);
    }
}
