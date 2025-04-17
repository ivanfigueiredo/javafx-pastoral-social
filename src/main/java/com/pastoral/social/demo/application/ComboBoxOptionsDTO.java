package com.pastoral.social.demo.application;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@ToString
@Builder
@AllArgsConstructor
public class ComboBoxOptionsDTO {
    private final Integer idComboBox;
    private final String valorItem;
    private Deparmento deparmento;

    @Data
    @Getter
    @ToString
    @Builder
    @AllArgsConstructor
    public static class Deparmento {
        private final Integer idDeparmento;
        private final String deparmento;
    }
}
