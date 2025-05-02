package com.pastoral.social.demo.adapters.util;


import javafx.scene.paint.Color;
import lombok.Getter;

import java.util.Arrays;

@Getter
public enum ColorEnum {
    Editar(Color.YELLOW),
    Excluir(Color.RED),
    Cesta(Color.GREEN),
    Categorizar(Color.ORANGE),
    Relatorio(Color.BLACK),
    Buscar(Color.BLUE);

    private final Color color;

    ColorEnum(Color color) {
        this.color = color;
    }

    public static Color findColor(final String value) {
        return Arrays.stream(ColorEnum.values())
                .filter(color -> color.name().equalsIgnoreCase(value))
                .map(ColorEnum::getColor)
                .findFirst()
                .orElse(null);
    }
}
