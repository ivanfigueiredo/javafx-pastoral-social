package com.pastoral.social.demo.application.dto;

import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LocalizacaoDTO extends DataObjectTransferBase {
    private Integer idLocalizacao;
    private String descricao;
}
