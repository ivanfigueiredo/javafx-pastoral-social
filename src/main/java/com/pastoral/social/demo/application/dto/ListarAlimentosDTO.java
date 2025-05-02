package com.pastoral.social.demo.application.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ListarAlimentosDTO {
    private Integer idAlimento;
    private String isValidate;
    private LocalDate entrada;
    private LocalDate saida;
    private UnidadeMedidaDTO unidadeMedida;
    private ItemProdutoDTO itemProduto;
    private LocalizacaoDTO localizacao;
}
