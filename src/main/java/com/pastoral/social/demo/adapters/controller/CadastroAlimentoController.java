package com.pastoral.social.demo.adapters.controller;

import com.pastoral.social.demo.adapters.util.ComboBoxUtils;
import com.pastoral.social.demo.adapters.util.ValidatorUtils;
import com.pastoral.social.demo.application.dto.AdicionarAlimentoDTO;
import com.pastoral.social.demo.application.dto.CategoriaDTO;
import com.pastoral.social.demo.application.dto.LocalizacaoDTO;
import com.pastoral.social.demo.application.dto.UnidadeMedidaDTO;
import com.pastoral.social.demo.application.port.in.AdicionarAlimentoUseCase;
import com.pastoral.social.demo.application.port.in.ListCategoriaUseCase;
import com.pastoral.social.demo.application.port.in.ListLocalizacaoUseCase;
import com.pastoral.social.demo.application.port.in.ListUnidadeDeMedidasUseCase;
import javafx.collections.FXCollections;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.util.Callback;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

import static com.pastoral.social.demo.adapters.util.TextFieldUtils.restrictToAlphabeticInput;

public class CadastroAlimentoController {
    private AdicionarAlimentoUseCase adicionarAlimentoUseCase;
    private ListUnidadeDeMedidasUseCase listUnidadeDeMedidasUseCase;
    private ListCategoriaUseCase listCategoriaUseCase;
    private ListLocalizacaoUseCase listLocalizacaoUseCase;

    @FXML
    private ComboBox<UnidadeMedidaDTO> comboBoxListUND;

    @FXML
    private ComboBox<CategoriaDTO> comboBoxListCategoria;

    @FXML
    private ComboBox<LocalizacaoDTO> comboBoxListLocalizacao;

    @FXML
    private DatePicker datePickerDataValidade;

    @FXML
    private Label formErrorLabel;

    @FXML
    private TextField textFieldMarca;

    @FXML
    public void onCancelarCadastro() {
        ViewLoader.loadView("/com/pastoral/social/demo/no-content-view.fxml");
    }

    @FXML
    public void onFinalizarCadastro() {
        final Integer idUND = Objects.nonNull(comboBoxListUND.getSelectionModel().getSelectedItem()) ? comboBoxListUND.getSelectionModel().getSelectedItem().getIdUND() : null;
        final Integer idCategoria = Objects.nonNull(comboBoxListCategoria.getSelectionModel().getSelectedItem()) ? comboBoxListCategoria.getSelectionModel().getSelectedItem().getIdCategoria() : null;
        final Integer idLocalizacao = Objects.nonNull(comboBoxListLocalizacao.getSelectionModel().getSelectedItem()) ? comboBoxListLocalizacao.getSelectionModel().getSelectedItem().getIdLocalizacao() : null;
        final String marca = textFieldMarca.getText();
        final LocalDate validade = datePickerDataValidade.getValue();
        final AdicionarAlimentoDTO adicionarAlimentoDTO = AdicionarAlimentoDTO.builder()
                .idUndMedida(idUND)
                .marca(marca)
                .idCategoria(idCategoria)
                .validade(validade)
                .idLocalizacao(idLocalizacao)
                .build();
        final String concatErrors = ValidatorUtils.validate(adicionarAlimentoDTO);
        if (!concatErrors.isEmpty()) {
            formErrorLabel.setText(concatErrors);
            return;
        }
        this.adicionarAlimentoUseCase.execute(adicionarAlimentoDTO);
        Alerts.showAlert("Cadastro Concluído", null, "Produto salvo com sucesso", Alert.AlertType.INFORMATION);
        ViewLoader.loadView("/com/pastoral/social/demo/cadastro-alimento-form.fxml");

    }

    @FXML
    public void initialize() {
        restrictToAlphabeticInput(textFieldMarca);
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
    }
}
