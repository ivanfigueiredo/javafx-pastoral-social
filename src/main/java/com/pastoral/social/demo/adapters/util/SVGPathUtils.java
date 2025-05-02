package com.pastoral.social.demo.adapters.util;

import javafx.scene.paint.Color;
import javafx.scene.shape.SVGPath;

import java.util.Objects;

public final class SVGPathUtils {
    private SVGPathUtils() {}

    public static SVGPath getSvgGraphic(final String svgPathContent, final Color color) {
        SVGPath svg = new SVGPath();
        svg.setContent(Objects.requireNonNull(svgPathContent));
        svg.setFill(color);
        svg.setScaleX(0.9);
        svg.setScaleY(0.9);
        return svg;
    }
}
