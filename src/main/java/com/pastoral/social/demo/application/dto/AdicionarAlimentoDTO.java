package com.pastoral.social.demo.application.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

import static com.pastoral.social.demo.application.dto.MessageResource.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdicionarAlimentoDTO {
    @NotNull(message = MESSAGE_ID_CATEGORIA)
    private Integer idCategoria;
    private String marca;
    @NotNull(message = MESSAGE_VALIDADE)
    private LocalDate validade;
    @NotNull(message = MESSAGE_ID_LOCALIZACAO)
    private Integer idLocalizacao;
    @NotNull(message = MESSAGE_ID_UNIDADE_MEDIDA)
    private Integer idUndMedida;
}
