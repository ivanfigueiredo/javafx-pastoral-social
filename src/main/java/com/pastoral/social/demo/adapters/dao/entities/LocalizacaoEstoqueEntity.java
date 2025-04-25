package com.pastoral.social.demo.adapters.dao.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LocalizacaoEstoqueEntity extends EntityBase{
    @JsonProperty("id_localizacao")
    private Integer idLocalizacao;
    @JsonProperty("localizacao_desc")
    private String descricao;
}
