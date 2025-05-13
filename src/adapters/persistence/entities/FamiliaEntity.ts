import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { FamiliaDificuldadeEntity } from "./FamiliaDificuldadeEntity";
import { AjudaRecebidaEntity } from "./AjudaRecebidaEntity";
import { CestaGeradaEntity } from "./CestaGeradaEntity";
import { ComunidadeEntity } from "./ComunidadeEntity";

@Entity('TPS_FAMILIA')
export class FamiliaEntity {
  @PrimaryGeneratedColumn({ name: 'id_familia' })
  id: number;

  @Column({ name: 'nome_representante' })
  nomeRepresentante: string;

  @Column({ nullable: true })
  idade: number;

  @Column({ name: 'cpf_rg', nullable: true })
  cpfRg: string;

  @Column({ nullable: true })
  telefone: string;

  @Column({ nullable: true })
  endereco: string;

  @Column({ name: 'qtd_pessoas_residencia', nullable: true })
  qtdPessoasResidencia: number;

  @Column({ name: 'qtd_pessoas_empregadas', nullable: true })
  qtdPessoasEmpregadas: number;

  @Column({ name: 'criancas_frequentam_escola', default: false })
  criancasFrequentamEscola: boolean;

  @Column({ name: 'membro_com_problema_saude', default: false })
  membroComProblemaSaude: boolean;

  @Column({ name: 'ja_recebeu_ajuda', default: false })
  jaRecebeuAjuda: boolean;

  @Column({ name: 'deseja_participar_cursos', default: false })
  desejaParticiparCursos: boolean;

  @Column({ nullable: true })
  observacao: string | null;

  @Column({ name: 'data_cadastro', type: 'timestamptz', default: () => 'NOW()' })
  dataCadastro: Date;

  @OneToMany(() => FamiliaDificuldadeEntity, (fd) => fd.familia)
  dificuldades: FamiliaDificuldadeEntity[];

  @OneToMany(() => AjudaRecebidaEntity, (ar) => ar.familia)
  ajudasRecebidas: AjudaRecebidaEntity[];

  @OneToMany(() => CestaGeradaEntity, (cg) => cg.familia)
  cestasGeradas: CestaGeradaEntity[];

  @ManyToOne(() => ComunidadeEntity, comunidadeEntity => comunidadeEntity.familiasComunidade)
  @JoinColumn({ name: 'id_comunidade' })
  comunidade: ComunidadeEntity;

  constructor(
    id: number,
    nomeRepresentante: string,
    idade: number,
    cpfRg: string,
    telefone: string,
    endereco: string,
    qtdPessoasResidencia: number,
    qtdPessoasEmpregadas: number,
    criancasFrequentamEscola: boolean,
    membroComProblemaSaude: boolean,
    jaRecebeuAjuda: boolean,
    desejaParticiparCursos: boolean,
    observacao: string | null,
    dataCadastro: Date,
    comunidade: ComunidadeEntity,
    dificuldades: FamiliaDificuldadeEntity[],
    ajudasRecebidas: AjudaRecebidaEntity[],
    cestasGeradas: CestaGeradaEntity[]
  ) {
    this.id = id;
    this.nomeRepresentante = nomeRepresentante;
    this.idade = idade;
    this.cpfRg = cpfRg;
    this.telefone = telefone;
    this.endereco = endereco;
    this.qtdPessoasResidencia = qtdPessoasResidencia;
    this.qtdPessoasEmpregadas = qtdPessoasEmpregadas;
    this.criancasFrequentamEscola = criancasFrequentamEscola;
    this.membroComProblemaSaude = membroComProblemaSaude;
    this.jaRecebeuAjuda = jaRecebeuAjuda;
    this.desejaParticiparCursos = desejaParticiparCursos;
    this.observacao = observacao;
    this.dataCadastro = dataCadastro;
    this.dificuldades = dificuldades;
    this.ajudasRecebidas = ajudasRecebidas;
    this.cestasGeradas = cestasGeradas;
    this.comunidade = comunidade;
  }
}
