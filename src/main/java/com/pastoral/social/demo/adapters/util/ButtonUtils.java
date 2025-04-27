package com.pastoral.social.demo.adapters.util;

import javafx.scene.control.Button;
import javafx.scene.paint.Color;
import javafx.scene.shape.SVGPath;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public final class ButtonUtils {
    private static final Map<String, Object> MAP_CONCAT_TEXT_WITH_RESOURCE = new HashMap<>();
    private static final String BUTTON_STYLE = "-fx-background-color: transparent;\n" +
            "    -fx-border-color: transparent;\n" +
            "    -fx-padding: 5;";

    static {
        MAP_CONCAT_TEXT_WITH_RESOURCE.put("Excluir", "m23,4h-6v-2c0-1.103-.897-2-2-2h-6c-1.103,0-2,.897-2,2v2H1v2h1.644l1.703,15.331c.169,1.521,1.451,2.669,2.982,2.669h9.304c1.531,0,2.813-1.147,2.981-2.669l1.703-15.331h1.682v-2Zm-14-2h6v2h-6v-2Zm8.626,19.11c-.056.507-.483.89-.994.89H7.329c-.51,0-.938-.383-.994-.89l-1.679-15.11h14.65l-1.679,15.11Zm-9.583-4.567l2.543-2.543-2.543-2.543,1.414-1.414,2.543,2.543,2.543-2.543,1.414,1.414-2.543,2.543,2.543,2.543-1.414,1.414-2.543-2.543-2.543,2.543-1.414-1.414Z");
        MAP_CONCAT_TEXT_WITH_RESOURCE.put("Editar", "M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.83-1.83z");
    }

    private ButtonUtils() {}

    public static Button createButton(final String text) {
        final Button btn = new Button();
        btn.setGraphic(getSvgGraphic(MAP_CONCAT_TEXT_WITH_RESOURCE.get(text).toString(), text));
        btn.setStyle(String.format(BUTTON_STYLE));
        return btn;
    }

    private static SVGPath getSvgGraphic(final String svgPathContent, final String text) {
        SVGPath svg = new SVGPath();
        svg.setContent(Objects.requireNonNull(svgPathContent));
        svg.setFill(getColor(text));
        svg.setScaleX(1.2);
        svg.setScaleY(1.2);
        return svg;
    }

    private static Color getColor(final String text) {
        return text.equals("Editar") ? Color.YELLOW : Color.RED;
    }
}
