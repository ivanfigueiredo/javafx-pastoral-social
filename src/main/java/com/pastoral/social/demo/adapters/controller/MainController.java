package com.pastoral.social.demo.adapters.controller;

import com.pastoral.social.demo.adapters.util.ColorEnum;
import javafx.fxml.FXML;
import javafx.scene.control.Button;

import static com.pastoral.social.demo.adapters.util.SVGPathUtils.*;
import static com.pastoral.social.demo.adapters.util.StringResource.*;


public class MainController {
    @FXML
    private Button buttonCesta;

    @FXML
    private Button buttonBuscar;

    @FXML
    private Button buttonCategorizar;

    @FXML
    private Button buttonRelatorio;

    @FXML
    public void onMenuItemCadastrarAlimentoAction() {
        ViewLoader.loadView("/com/pastoral/social/demo/cadastro-alimento-form.fxml");
    }

    @FXML
    public void onMenuItemListarAlimentosAction() {
        ViewLoader.loadView("/com/pastoral/social/demo/listar-alimentos-view.fxml");
    }

    @FXML
    public void onMenuItemCriarCestaAction() {

    }

    @FXML
    public void onMenuItemListarCestasAction() {

    }

    @FXML
    public void onMenuItemListarModelosAction() {
        ViewLoader.loadView("/com/pastoral/social/demo/listar-modelos-view.fxml");
    }

    @FXML
    public void onMenuItemListarTemplateAction() {
        ViewLoader.loadView("/com/pastoral/social/demo/listar-templates-view.fxml");
    }

    @FXML
    public void initialize() {
        buttonCesta.setGraphic(getSvgGraphic(CESTA_SVG, ColorEnum.findColor("Cesta")));
        buttonBuscar.setGraphic(getSvgGraphic(BUSCAR_SVG, ColorEnum.findColor("Buscar")));
        buttonCategorizar.setGraphic(getSvgGraphic(CATEGORIZAR_SVG, ColorEnum.findColor("Categorizar")));
        buttonRelatorio.setGraphic(getSvgGraphic(RELATORIO_SVG, ColorEnum.findColor("Relatorio")));
    }
}
