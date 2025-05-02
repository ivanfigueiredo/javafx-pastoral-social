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
    private ComboBox<ItemProdutoDTO> comboBoxListItemProduto;

    @FXML
    private ComboBox<LocalizacaoDTO> comboBoxListLocalizacao;

    @FXML
    public void onCancelarAtualizacao() {
        this.close();
    }

    @FXML
    public void onFinalizarAtualizacao() {
        final Integer idUND = Objects.nonNull(comboBoxListUND.getSelectionModel().getSelectedItem()) ? comboBoxListUND.getSelectionModel().getSelectedItem().getIdUND() : null;
        final Integer idItemProduto = Objects.nonNull(comboBoxListItemProduto.getSelectionModel().getSelectedItem()) ? comboBoxListItemProduto.getSelectionModel().getSelectedItem().getIdItemProduto() : null;
        final Integer idLocalizacao = Objects.nonNull(comboBoxListLocalizacao.getSelectionModel().getSelectedItem()) ? comboBoxListLocalizacao.getSelectionModel().getSelectedItem().getIdLocalizacao() : null;
        final AtualizarAlimentoDTO atualizarAlimentoDTO = AtualizarAlimentoDTO.builder()
                .idAlimento(this.listarAlimentosDTO.getIdAlimento())
                .idItemProduto(idItemProduto)
                .idLocalizacao(idLocalizacao)
                .idUndMedida(idUND)
                .build();
        try {
            this.atualizarAlimentoUseCase.execute(atualizarAlimentoDTO);
            this.close();
            Alerts.showAlert("Atualização Concluída", null, "Produto atualizado com sucesso", Alert.AlertType.INFORMATION);
            ViewLoader.loadView("/com/pastoral/social/demo/listar-alimentos-view.fxml");
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
        List<ItemProdutoDTO> listCategoria = this.listCategoriaUseCase.execute();
        List<LocalizacaoDTO> listLocalizacao = this.listLocalizacaoUseCase.execute();
        comboBoxListUND.setItems(FXCollections.observableList(listUND));
        comboBoxListItemProduto.setItems(FXCollections.observableList(listCategoria));
        comboBoxListLocalizacao.setItems(FXCollections.observableList(listLocalizacao));
        final Callback<ListView<UnidadeMedidaDTO>, ListCell<UnidadeMedidaDTO>> comboBoxListUndFactory = ComboBoxUtils.<UnidadeMedidaDTO>factory();
        final Callback<ListView<ItemProdutoDTO>, ListCell<ItemProdutoDTO>> comboBoxListCategoryFactory = ComboBoxUtils.<ItemProdutoDTO>factory();
        final Callback<ListView<LocalizacaoDTO>, ListCell<LocalizacaoDTO>> comboBoxListLocalizacaoFactory = ComboBoxUtils.<LocalizacaoDTO>factory();
        comboBoxListUND.setCellFactory(comboBoxListUndFactory);
        comboBoxListUND.setButtonCell(comboBoxListUndFactory.call(null));
        comboBoxListItemProduto.setCellFactory(comboBoxListCategoryFactory);
        comboBoxListItemProduto.setButtonCell(comboBoxListCategoryFactory.call(null));
        comboBoxListLocalizacao.setCellFactory(comboBoxListLocalizacaoFactory);
        comboBoxListLocalizacao.setButtonCell(comboBoxListLocalizacaoFactory.call(null));
        comboBoxListItemProduto.getSelectionModel().select(listarAlimentosDTO.getItemProduto());
        comboBoxListLocalizacao.getSelectionModel().select(listarAlimentosDTO.getLocalizacao());
        comboBoxListUND.getSelectionModel().select(listarAlimentosDTO.getUnidadeMedida());
    }

    private void close() {
        Stage stage = (Stage) comboBoxListItemProduto.getScene().getWindow();
        stage.close();
    }
}
