package com.pastoral.social.demo.application.port.out;

import com.pastoral.social.demo.application.dto.AdicionarAlimentoDTO;
import com.pastoral.social.demo.application.dto.AtualizarAlimentoDTO;
import com.pastoral.social.demo.application.dto.ListarAlimentosDTO;

import java.util.List;

public interface EstoqueRepository {
    void save(AdicionarAlimentoDTO dto);
    List<ListarAlimentosDTO> find();
    void delete(Integer idAlimento);
    void update(AtualizarAlimentoDTO dto);
}
