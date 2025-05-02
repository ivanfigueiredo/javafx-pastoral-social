package com.pastoral.social.demo.adapters.util;

import javafx.scene.control.Button;

import java.util.HashMap;
import java.util.Map;

import static com.pastoral.social.demo.adapters.util.SVGPathUtils.getSvgGraphic;
import static com.pastoral.social.demo.adapters.util.StringResource.*;

public final class ButtonUtils {
    private static final Map<String, Object> MAP_CONCAT_TEXT_WITH_RESOURCE = new HashMap<>();
    private static final String BUTTON_STYLE = "-fx-background-color: transparent;\n" +
            "    -fx-border-color: transparent;\n" +
            "    -fx-padding: 5;";

    static {
        MAP_CONCAT_TEXT_WITH_RESOURCE.put("Excluir", EXCLUIR_SVG);
        MAP_CONCAT_TEXT_WITH_RESOURCE.put("Editar", EDITAR_SVG);
    }

    private ButtonUtils() {}

    public static Button createButton(final String text) {
        final Button btn = new Button();
        btn.setGraphic(getSvgGraphic(MAP_CONCAT_TEXT_WITH_RESOURCE.get(text).toString(), ColorEnum.findColor(text)));
        btn.setStyle(String.format(BUTTON_STYLE));
        return btn;
    }
}
