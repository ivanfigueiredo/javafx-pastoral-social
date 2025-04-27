package com.pastoral.social.demo.adapters.controller;

import com.pastoral.social.demo.adapters.util.ComboBoxUtils;
import com.pastoral.social.demo.application.dto.*;
import com.pastoral.social.demo.application.exceptions.InternalServerErrorException;
import com.pastoral.social.demo.application.port.in.AtualizarAlimentoUseCase;
import com.pastoral.social.demo.application.port.in.ListCategoriaUseCase;
import com.pastoral.social.demo.application.port.in.ListLocalizacaoUseCase;
import com.pastoral.social.demo.application.port.in.ListUnidadeDeMedidasUseCase;
import javafx.collections.FXCollections;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.stage.Stage;
import javafx.util.Callback;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Objects;

@Slf4j
public class AtualizarAlimentoModalController extends ControllerModalBase<ListarAlimentosDTO> {
    private ListarAlimentosDTO listarAlimentosDTO;

    private ListUnidadeDeMedidasUseCase listUnidadeDeMedidasUseCase;
    private ListCategoriaUseCase listCategoriaUseCase;
    private ListLocalizacaoUseCase listLocalizacaoUseCase;
    private AtualizarAlimentoUseCase atualizarAlimentoUseCase;

    @FXML
    private ComboBox<UnidadeMedidaDTO> comboBoxListUND;

    @FXML
    private ComboBox<CategoriaDTO> comboBoxListCategoria;

    @FXML
    private ComboBox<LocalizacaoDTO> comboBoxListLocalizacao;

    @FXML
    private TextField textFieldMarca;

    @FXML
    public void onCancelarAtualizacao() {
        this.close();
    }

    @FXML
    public void onFinalizarAtualizacao() {
        final Integer idUND = Objects.nonNull(comboBoxListUND.getSelectionModel().getSelectedItem()) ? comboBoxListUND.getSelectionModel().getSelectedItem().getIdUND() : null;
        final Integer idCategoria = Objects.nonNull(comboBoxListCategoria.getSelectionModel().getSelectedItem()) ? comboBoxListCategoria.getSelectionModel().getSelectedItem().getIdCategoria() : null;
        final Integer idLocalizacao = Objects.nonNull(comboBoxListLocalizacao.getSelectionModel().getSelectedItem()) ? comboBoxListLocalizacao.getSelectionModel().getSelectedItem().getIdLocalizacao() : null;
        final String marca = textFieldMarca.getText();
        final AtualizarAlimentoDTO atualizarAlimentoDTO = AtualizarAlimentoDTO.builder()
                .idAlimento(this.listarAlimentosDTO.getIdAlimento())
                .idCategoria(idCategoria)
                .idLocalizacao(idLocalizacao)
                .idUndMedida(idUND)
                .marca(marca)
                .build();
        try {
            this.atualizarAlimentoUseCase.execute(atualizarAlimentoDTO);
            this.close();
            Alerts.showAlert("Atualização Concluída", null, "Produto atualizado com sucesso", Alert.AlertType.INFORMATION);
            ViewLoader.loadView("/com/pastoral/social/demo/alimento-list-view.fxml");
        } catch (InternalServerErrorException e) {
            log.error(e.getMessage(), e);
            Alerts.showAlert("Erro Interno", null, e.getMessage(), Alert.AlertType.ERROR);
        }
    }

    @Override
    public void setData(final ListarAlimentosDTO data) {
        this.listarAlimentosDTO = data;
    }

    public void setListUnidadeDeMedidasUseCase(final ListUnidadeDeMedidasUseCase listUnidadeDeMedidasUseCase) {
        this.listUnidadeDeMedidasUseCase = Objects.requireNonNull(listUnidadeDeMedidasUseCase);
    }

    public void setListCategoriaUseCase(final ListCategoriaUseCase listCategoriaUseCase) {
        this.listCategoriaUseCase = Objects.requireNonNull(listCategoriaUseCase);
    }

    public void setListLocalizacaoUseCase(final ListLocalizacaoUseCase localizacaoUseCase) {
        this.listLocalizacaoUseCase = Objects.requireNonNull(localizacaoUseCase);
    }

    public void setAtualizarAlimentoUseCase(final AtualizarAlimentoUseCase atualizarAlimentoUseCase) {
        this.atualizarAlimentoUseCase = Objects.requireNonNull(atualizarAlimentoUseCase);
    }

    @Override
    public void setup() {
        List<UnidadeMedidaDTO> listUND = this.listUnidadeDeMedidasUseCase.execute();
        List<CategoriaDTO> listCategoria = this.listCategoriaUseCase.execute();
        List<LocalizacaoDTO> listLocalizacao = this.listLocalizacaoUseCase.execute();
        comboBoxListUND.setItems(FXCollections.observableList(listUND));
        comboBoxListCategoria.setItems(FXCollections.observableList(listCategoria));
        comboBoxListLocalizacao.setItems(FXCollections.observableList(listLocalizacao));
        final Callback<ListView<UnidadeMedidaDTO>, ListCell<UnidadeMedidaDTO>> comboBoxListUndFactory = ComboBoxUtils.<UnidadeMedidaDTO>factory();
        final Callback<ListView<CategoriaDTO>, ListCell<CategoriaDTO>> comboBoxListCategoryFactory = ComboBoxUtils.<CategoriaDTO>factory();
        final Callback<ListView<LocalizacaoDTO>, ListCell<LocalizacaoDTO>> comboBoxListLocalizacaoFactory = ComboBoxUtils.<LocalizacaoDTO>factory();
        comboBoxListUND.setCellFactory(comboBoxListUndFactory);
        comboBoxListUND.setButtonCell(comboBoxListUndFactory.call(null));
        comboBoxListCategoria.setCellFactory(comboBoxListCategoryFactory);
        comboBoxListCategoria.setButtonCell(comboBoxListCategoryFactory.call(null));
        comboBoxListLocalizacao.setCellFactory(comboBoxListLocalizacaoFactory);
        comboBoxListLocalizacao.setButtonCell(comboBoxListLocalizacaoFactory.call(null));
        textFieldMarca.setText(this.listarAlimentosDTO.getMarca());
        comboBoxListCategoria.getSelectionModel().select(listarAlimentosDTO.getCategoria());
        comboBoxListLocalizacao.getSelectionModel().select(listarAlimentosDTO.getLocalizacao());
        comboBoxListUND.getSelectionModel().select(listarAlimentosDTO.getUnidadeMedida());
    }

    private void close() {
        Stage stage = (Stage) textFieldMarca.getScene().getWindow();
        stage.close();
    }
}
