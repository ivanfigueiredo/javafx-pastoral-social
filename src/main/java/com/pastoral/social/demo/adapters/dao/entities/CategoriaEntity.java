package com.pastoral.social.demo.adapters.dao.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CategoriaEntity extends EntityBase{
    @JsonProperty("id_categoria")
    private Integer idCategoria;
    @JsonProperty("categoria_desc")
    private String categoriaDescricao;
}
