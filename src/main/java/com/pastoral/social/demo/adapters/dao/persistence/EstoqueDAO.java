package com.pastoral.social.demo.adapters.dao.persistence;

import com.pastoral.social.demo.adapters.dao.entities.EstoqueEntity;
import com.pastoral.social.demo.adapters.dao.transaction.TransacionalPersistence;
import com.pastoral.social.demo.application.dto.*;
import com.pastoral.social.demo.application.port.out.EstoqueRepository;

import java.sql.Date;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

public class EstoqueDAO implements EstoqueRepository {
    private final TransacionalPersistence<EstoqueEntity> persistence;

    public EstoqueDAO(final TransacionalPersistence<EstoqueEntity> persistence) {
        this.persistence = Objects.requireNonNull(persistence);
    }

    @Override
    public void save(AdicionarAlimentoDTO dto) {
        final String SQL = "INSERT INTO tps_estoque_alimentos (id_item_produto, validade, id_localizacao, id_und_medida, data_entrada) VALUES (?,?,?,?,?)";
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("idItemProduto", dto.getIdItemProduto());
        map.put("validade", Date.valueOf(dto.getValidade()));
        map.put("idLocalizacao", dto.getIdLocalizacao());
        map.put("idUndMedida", dto.getIdUndMedida());
        map.put("dataEntrada", LocalDate.now());
        persistence.saveOrUpdate(SQL, map);
    }

    @Override
    public List<ListarAlimentosDTO> find() {
        final String SQL = "select tea.id_alimento, tea.validade, tea.data_entrada, tea.data_saida, tip.id_produto, tip.item_produto_desc, tum.id, tum.und_medidas, tle.id_localizacao, tle.localizacao_desc from tps_estoque_alimentos tea\n" +
                "left join tps_item_produto tip on tip.id_produto = tea.id_item_produto\n" +
                "left join tps_unidade_medida tum on tum.id = tea.id_und_medida\n" +
                "left join tps_localizacao_estoque tle on tle.id_localizacao = tea.id_localizacao;";
        List<EstoqueEntity> estoqueEntityList = this.persistence.find(SQL);
        return estoqueEntityList.stream()
                .map(item -> ListarAlimentosDTO.builder()
                        .idAlimento(item.getIdAlimento())
                        .isValidate(isProdutoNaValidade(item.getValidade()))
                        .entrada(item.getEntrada())
                        .saida(Objects.isNull(item.getSaida()) ? null : item.getSaida())
                        .localizacao(LocalizacaoDTO.builder()
                                .idLocalizacao(item.getIdLocalizacao())
                                .descricao(item.getLocalizacaoDescricao())
                                .build()
                        )
                        .itemProduto(ItemProdutoDTO.builder()
                                .idItemProduto(item.getIdProduto())
                                .descricao(item.getItemProdutoDesc())
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

    @Override
    public void delete(final Integer idAlimento) {
        final String SQL = "delete from tps_estoque_alimentos where id_alimento = ?";
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id_alimento", idAlimento);
        this.persistence.delete(SQL, map);
    }

    @Override
    public void update(final AtualizarAlimentoDTO dto) {
        final String SQL = "update tps_estoque_alimentos set id_item_produto = ?, id_und_medida = ?, id_localizacao = ? where id_alimento = ?";
        final Map<String, Object> map = new LinkedHashMap<>();
        map.put("id_item_produto", dto.getIdItemProduto());
        map.put("id_und_medida", dto.getIdUndMedida());
        map.put("id_localizacao", dto.getIdLocalizacao());
        map.put("id_alimento", dto.getIdAlimento());
        this.persistence.saveOrUpdate(SQL, map);
    }

    private String isProdutoNaValidade(final LocalDate validade) {
        return validade.isAfter(LocalDate.now()) ? "Sim" : "Não";
    }
}
