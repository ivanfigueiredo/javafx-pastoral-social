package com.pastoral.social.demo.application.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AtualizarAlimentoDTO {
    private Integer idAlimento;
    private Integer idItemProduto;
    private Integer idUndMedida;
    private Integer idLocalizacao;
}
