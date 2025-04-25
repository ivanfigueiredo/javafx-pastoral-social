package com.pastoral.social.demo.adapters.dao.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EstoqueEntity extends EntityBase {
    @JsonProperty("id_alimento")
    private Integer idAlimento;
    private String marca;
    @JsonProperty("id_categoria")
    private Integer idCategoria;
    @JsonProperty("categoria_desc")
    private String categoriaDescricao;
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
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private LocalDateTime entrada;
    @JsonProperty("data_saida")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private LocalDateTime saida;
    @JsonProperty("item_na_validade")
    private Boolean itemNaValidade;
}
