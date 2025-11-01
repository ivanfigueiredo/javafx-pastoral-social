import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { EstoqueEntity } from "./EstoqueEntity";

@Entity('tps_localizacao_estoque', {schema: 'estoque'})
export class LocalizacaoEntity {
  @PrimaryGeneratedColumn({ name: 'id_localizacao' })
  id: number;

  @Column({ name: 'descricao_completa', type: 'text' })
  descricao: string | null;

  @Column({ name: 'prateleira', type: 'int4', nullable: false })
  prateleira: number | null;

  @Column({ name: 'estante', type: 'int4', nullable: false })
  estante: number | null;

  @Column({ name: 'linha', type: 'int4', nullable: false })
  linha: number | null;

  @Column({ name: 'coluna', type: 'int4', nullable: false })
  coluna: number | null;

  @Column({ name: 'is_disponivel', type: 'boolean', nullable: false })
  isDisponivel: boolean | null;

  @OneToMany(() => EstoqueEntity, estoque => estoque.localizacao)
  estoques: EstoqueEntity[] = [];

  constructor(
    id: number,
    descricao: string | null,
    prateleira: number | null,
    estante: number | null,
    linha: number | null,
    coluna: number | null,
    isDisponivel: boolean | null,
    estoques: EstoqueEntity[]
  ) {
    this.id = id;
    this.descricao = descricao;
    this.prateleira = prateleira;
    this.linha = linha;
    this.coluna = coluna;
    this.estante = estante;
    this.isDisponivel = isDisponivel;
    this.estoques = estoques;
  }
}