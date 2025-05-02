package com.pastoral.social.demo.adapters.controller;

import com.pastoral.social.demo.adapters.util.ComboBoxUtils;
import com.pastoral.social.demo.adapters.util.ValidatorUtils;
import com.pastoral.social.demo.application.dto.AdicionarAlimentoDTO;
import com.pastoral.social.demo.application.dto.ItemProdutoDTO;
import com.pastoral.social.demo.application.dto.LocalizacaoDTO;
import com.pastoral.social.demo.application.dto.UnidadeMedidaDTO;
import com.pastoral.social.demo.application.exceptions.InternalServerErrorException;
import com.pastoral.social.demo.application.port.in.AdicionarAlimentoUseCase;
import com.pastoral.social.demo.application.port.in.ListCategoriaUseCase;
import com.pastoral.social.demo.application.port.in.ListLocalizacaoUseCase;
import com.pastoral.social.demo.application.port.in.ListUnidadeDeMedidasUseCase;
import javafx.collections.FXCollections;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.util.Callback;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Slf4j
public class CadastroAlimentoController {
    private AdicionarAlimentoUseCase adicionarAlimentoUseCase;
    private ListUnidadeDeMedidasUseCase listUnidadeDeMedidasUseCase;
    private ListCategoriaUseCase listCategoriaUseCase;
    private ListLocalizacaoUseCase listLocalizacaoUseCase;

    @FXML
    private ComboBox<UnidadeMedidaDTO> comboBoxListUND;

    @FXML
    private ComboBox<ItemProdutoDTO> comboBoxListItemProduto;

    @FXML
    private ComboBox<LocalizacaoDTO> comboBoxListLocalizacao;

    @FXML
    private DatePicker datePickerDataValidade;

    @FXML
    private Label formErrorLabel;

    @FXML
    public void onCancelarCadastro() {
        ViewLoader.loadView("/com/pastoral/social/demo/no-content-view.fxml");
    }

    @FXML
    public void onFinalizarCadastro() {
        final Integer idUND = Objects.nonNull(comboBoxListUND.getSelectionModel().getSelectedItem()) ? comboBoxListUND.getSelectionModel().getSelectedItem().getIdUND() : null;
        final Integer idItemProduto = Objects.nonNull(comboBoxListItemProduto.getSelectionModel().getSelectedItem()) ? comboBoxListItemProduto.getSelectionModel().getSelectedItem().getIdItemProduto() : null;
        final Integer idLocalizacao = Objects.nonNull(comboBoxListLocalizacao.getSelectionModel().getSelectedItem()) ? comboBoxListLocalizacao.getSelectionModel().getSelectedItem().getIdLocalizacao() : null;
        final LocalDate validade = datePickerDataValidade.getValue();
        final AdicionarAlimentoDTO adicionarAlimentoDTO = AdicionarAlimentoDTO.builder()
                .idUndMedida(idUND)
                .idItemProduto(idItemProduto)
                .validade(validade)
                .idLocalizacao(idLocalizacao)
                .build();
        final String concatErrors = ValidatorUtils.validate(adicionarAlimentoDTO);
        if (!concatErrors.isEmpty()) {
            formErrorLabel.setText(concatErrors);
            return;
        }
        try {
            this.adicionarAlimentoUseCase.execute(adicionarAlimentoDTO);
            Alerts.showAlert("Cadastro Concluído", null, "Produto salvo com sucesso", Alert.AlertType.INFORMATION);
            ViewLoader.loadView("/com/pastoral/social/demo/cadastro-alimento-form.fxml");
        } catch (InternalServerErrorException e) {
            log.error(e.getMessage(), e);
            Alerts.showAlert("Erro Interno", null, e.getMessage(), Alert.AlertType.ERROR);
        }
    }

    public void setAdicionarAlimentoUseCase(final AdicionarAlimentoUseCase adicionarAlimentoUseCase) {
        this.adicionarAlimentoUseCase = Objects.requireNonNull(adicionarAlimentoUseCase);
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
    }
}
