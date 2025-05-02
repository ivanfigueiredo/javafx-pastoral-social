package com.pastoral.social.demo.adapters.dao.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDate;

@EqualsAndHashCode(callSuper = true)
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EstoqueEntity extends EntityBase {
    @JsonProperty("id_alimento")
    private Integer idAlimento;
    @JsonProperty("id_produto")
    private Integer idProduto;
    @JsonProperty("item_produto_desc")
    private String itemProdutoDesc;
    @JsonProperty("id")
    private Integer idUnidadeMedidas;
    @JsonProperty("und_medidas")
    private String undMedidas;
    @JsonProperty("id_localizacao")
    private Integer idLocalizacao;
    @JsonProperty("localizacao_desc")
    private String localizacaoDescricao;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate validade;
    @JsonProperty("data_entrada")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate entrada;
    @JsonProperty("data_saida")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate saida;
}
