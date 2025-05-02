package com.pastoral.social.demo.adapters.controller;

import com.pastoral.social.demo.adapters.util.ButtonUtils;
import com.pastoral.social.demo.adapters.util.TableViewUtils;
import com.pastoral.social.demo.application.dto.ListarAlimentosDTO;
import com.pastoral.social.demo.application.port.in.ExcluirAlimentoUseCase;
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
    private ExcluirAlimentoUseCase excluirAlimentoUseCase;

    @FXML
    private TableView<ListarAlimentosDTO> tableViewAlimento;

    @FXML
    private TableColumn<ListarAlimentosDTO, Integer> tableColumnIdAlimento;

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

    @FXML
    private TableColumn<ListarAlimentosDTO, Void> tableColumnAction;

    public void setListarAlimentosUseCase(final ListarAlimentosUseCase listarAlimentosUseCase) {
        this.listarAlimentosUseCase = Objects.requireNonNull(listarAlimentosUseCase);
    }

    public void setExcluirAlimentoUseCase(final ExcluirAlimentoUseCase excluirAlimentoUseCase) {
        this.excluirAlimentoUseCase = Objects.requireNonNull(excluirAlimentoUseCase);
    }

    public void setup() {
        final List<ListarAlimentosDTO> listarAlimentosDTOList = this.listarAlimentosUseCase.execute();
        tableColumnIdAlimento.setCellValueFactory(cellData -> new SimpleIntegerProperty(cellData.getValue().getIdAlimento()).asObject());
        tableColumnIsValidade.setCellValueFactory(cellData -> new SimpleStringProperty(cellData.getValue().getIsValidate()));
        tableColumnCategoria.setCellValueFactory(cellData -> new SimpleStringProperty(cellData.getValue().getItemProduto().getDescricao()));
        tableColumnLocalizacao.setCellValueFactory(cellData -> new SimpleStringProperty(cellData.getValue().getLocalizacao().getDescricao()));
        tableColumnEntrada.setCellValueFactory(cellData -> new SimpleStringProperty(cellData.getValue().getEntrada().toString()));
        tableColumnSaida.setCellValueFactory(cellData -> new SimpleStringProperty(Objects.isNull(cellData.getValue().getSaida()) ? "Em Estoque" : cellData.getValue().getSaida().toString()));
        tableColumnUnidadeMedida.setCellValueFactory(cellData -> new SimpleStringProperty(cellData.getValue().getUnidadeMedida().getDescricao()));
        tableColumnAction.setCellFactory(
                TableViewUtils.<ListarAlimentosDTO>factory(
                        row -> ButtonUtils.createButton("Editar"),
                        row -> ButtonUtils.createButton("Excluir"),
                        row -> excluirAlimentoUseCase.execute(row.getIdAlimento()),
                        this::redirect
                )
        );
        tableViewAlimento.getItems().setAll(listarAlimentosDTOList);
        tableViewAlimento.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY);
        tableViewAlimento.setStyle("-fx-font-size: 13pt;");
    }

    public void redirect() {
        ViewLoader.loadView("/com/pastoral/social/demo/listar-alimentos-view.fxml");
    }
}
