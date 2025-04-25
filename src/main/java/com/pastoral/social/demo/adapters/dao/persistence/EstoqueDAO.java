package com.pastoral.social.demo.adapters.dao.persistence;

import com.pastoral.social.demo.adapters.dao.entities.EstoqueEntity;
import com.pastoral.social.demo.adapters.dao.transaction.TransacionalPersistence;
import com.pastoral.social.demo.application.dto.*;
import com.pastoral.social.demo.application.port.out.EstoqueRepository;

import java.sql.*;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

public class EstoqueDAO implements EstoqueRepository {
    private final TransacionalPersistence<EstoqueEntity> persistence;

    public EstoqueDAO(final TransacionalPersistence<EstoqueEntity> persistence) {
        this.persistence = Objects.requireNonNull(persistence);
    }

    @Override
    public void save(AdicionarAlimentoDTO dto) {
        final String SQL = "INSERT INTO tps_estoque_alimentos (id_categoria, marca, validade, id_localizacao, item_na_validade, id_und_medida) VALUES (?,?,?,?,?,?)";
        final boolean PRODUTO_NA_VALIDADE = true;
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("idCategoria", dto.getIdCategoria());
        map.put("marca", dto.getMarca());
        map.put("validade", Date.valueOf(dto.getValidade()));
        map.put("idLocalizacao", dto.getIdLocalizacao());
        map.put("itemNaValidade", PRODUTO_NA_VALIDADE);
        map.put("idUndMedida", dto.getIdUndMedida());
        persistence.saveOrUpdate(SQL, map);
    }

    @Override
    public List<ListarAlimentosDTO> find() {
        final String SQL = "select tea.id_alimento, tea.marca, tea.validade, tea.item_na_validade, tea.data_entrada, tea.data_saida, tc.id_categoria, tc.categoria_desc, tum.id, tum.und_medidas, tle.id_localizacao, tle.localizacao_desc from tps_estoque_alimentos tea\n" +
                "left join tps_categoria tc on tc.id_categoria = tea.id_categoria\n" +
                "left join tps_unidade_medida tum on tum.id = tea.id_und_medida\n" +
                "left join tps_localizacao_estoque tle on tle.id_localizacao = tea.id_localizacao;";
        List<EstoqueEntity> estoqueEntityList = this.persistence.find(SQL);
        return estoqueEntityList.stream()
                .map(item -> ListarAlimentosDTO.builder()
                        .idAlimento(item.getIdAlimento())
                        .marca(item.getMarca())
                        .isValidate(isProdutoNaValidade(item.getValidade()))
                        .entrada(item.getEntrada().toLocalDate())
                        .saida(Objects.isNull(item.getSaida()) ? null : item.getSaida().toLocalDate())
                        .localizacao(LocalizacaoDTO.builder()
                                .idLocalizacao(item.getIdLocalizacao())
                                .descricao(item.getLocalizacaoDescricao())
                                .build()
                        )
                        .categoria(CategoriaDTO.builder()
                                .idCategoria(item.getIdCategoria())
                                .descricao(item.getCategoriaDescricao())
                                .build()
                        )
                        .unidadeMedida(UnidadeMedidaDTO.builder()
                                .idUND(item.getIdUnidadeMedidas())
                                .descricao(item.getUndMedidas())
                                .build()
                        )
                        .build())
                .collect(Collectors.toList());
    }

    private Boolean isProdutoNaValidade(final LocalDate validade) {
        return validade.isBefore(LocalDate.now());
    }
}
