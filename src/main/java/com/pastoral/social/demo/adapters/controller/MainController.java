package com.pastoral.social.demo.adapters.controller;

import javafx.fxml.FXML;
import javafx.scene.control.MenuItem;


public class MainController {
    @FXML
    public MenuItem menuItemCadastrarAlimento;

    @FXML
    public MenuItem menuItemListarAlimentos;

    @FXML
    public MenuItem menuItemCriarCesta;

    @FXML
    public MenuItem menuItemListarCestas;

    @FXML
    public MenuItem menuItemCriarModelo;

    @FXML
    public MenuItem menuItemListarModelos;

    @FXML
    public MenuItem menuItemDefinirTemplate;

    @FXML
    public MenuItem menuItemListarTemplate;


    @FXML
    public void onMenuItemCadastrarAlimentoAction() {
        ViewLoader.loadView("/com/pastoral/social/demo/cadastro-alimento-form.fxml");
    }

    @FXML
    public void onMenuItemListarAlimentosAction() {
        ViewLoader.loadView("/com/pastoral/social/demo/alimento-list-view.fxml");
    }

    @FXML
    public void onMenuItemCriarCestaAction() {

    }

    @FXML
    public void onMenuItemListarCestasAction() {

    }

    @FXML
    public void onMenuItemCriarModeloAction() {

    }

    @FXML
    public void onMenuItemListarModelosAction() {

    }

    @FXML
    public void onMenuItemDefinirTemplateAction() {

    }

    @FXML
    public void onMenuItemListarTemplateAction() {

    }
}
