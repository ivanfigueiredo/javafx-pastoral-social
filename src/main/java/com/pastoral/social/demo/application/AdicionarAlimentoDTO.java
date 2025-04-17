package com.pastoral.social.demo.application;

import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdicionarAlimentoDTO {
    private Integer idCategoria;
    private String marca;
    private LocalDate validade;
    private Integer idLocalizacao;
    private Integer idUndMedida;
}
