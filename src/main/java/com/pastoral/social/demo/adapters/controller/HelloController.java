package com.pastoral.social.demo.adapters.controller;

import com.pastoral.social.demo.adapters.factory.ResolveDependencyFactory;
import com.pastoral.social.demo.application.AdicionarAlimentoDTO;
import com.pastoral.social.demo.application.port.in.AdicionarAlimentoUseCase;
import com.pastoral.social.demo.application.port.in.TestUseCase;
import javafx.fxml.FXML;
import javafx.scene.control.Label;

import java.time.LocalDate;
import java.util.Arrays;

public class HelloController {

    @FXML
    private Label welcomeText;

    @FXML
    protected void onHelloButtonClick() {
        final AdicionarAlimentoUseCase adicionarAlimentoUseCase = ResolveDependencyFactory.createAdicionarAlimentoUseCase();
        final TestUseCase testUseCase = ResolveDependencyFactory.createTestUseCase();
        System.out.println(Arrays.toString(testUseCase.execute().toArray()));
        final AdicionarAlimentoDTO dto = AdicionarAlimentoDTO.builder()
                .marca("Turquesa")
                .validade(LocalDate.now())
                .idCategoria(1)
                .idLocalizacao(2)
                .idUndMedida(3)
                        .build();
        adicionarAlimentoUseCase.execute(dto);
        welcomeText.setText("Welcome to JavaFX Application!");
    }
}