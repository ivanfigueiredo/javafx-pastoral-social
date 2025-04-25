package com.pastoral.social.demo.adapters.dao.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UnidadeMedidaEntity extends EntityBase{
    @JsonProperty("id")
    private Integer idUnidadeMedida;
    @JsonProperty("und_medidas")
    private String unidadeMedidasDesc;
}
