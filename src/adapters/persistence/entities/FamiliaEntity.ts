import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { FamiliaDificuldadeEntity } from "./FamiliaDificuldadeEntity";
import { AjudaRecebidaEntity } from "./AjudaRecebidaEntity";
import { ComunidadeEntity } from "./ComunidadeEntity";

@Entity('tps_familia')
export class FamiliaEntity {
  @PrimaryGeneratedColumn({ name: 'id_familia' })
  id!: number;

  @Column({ name: 'nome_representante', type: 'varchar' })
  nomeRepresentante: string;

  @Column({ nullable: true, type: 'int4' })
  idade: number | null;

  @Column({ name: 'cpf_rg', type: 'varchar', nullable: true })
  cpfRg: string | null;

  @Column({ nullable: true, type: 'varchar' })
  telefone: string | null;

  @Column({ nullable: true, type: 'varchar' })
  endereco: string | null;

  @Column({ name: 'qtd_pessoas_residencia', type: 'int4', nullable: true })
  qtdPessoasResidencia: number | null;

  @Column({ name: 'qtd_pessoas_empregadas', type: 'int4', nullable: true })
  qtdPessoasEmpregadas: number | null;

  @Column({ name: 'criancas_frequentam_escola', type: 'bool', default: false })
  criancasFrequentamEscola: boolean | null;

  @Column({ name: 'membro_com_problema_saude', type: 'bool', default: false })
  membroComProblemaSaude: boolean | null;

  @Column({ name: 'ja_recebeu_ajuda', type: 'bool', default: false })
  jaRecebeuAjuda: boolean | null;

  @Column({ name: 'deseja_participar_cursos', type: 'bool', default: false })
  desejaParticiparCursos: boolean | null;

  @Column({ type: 'varchar', nullable: true })
  observacao: string | null;

  @Column({ name: 'data_cadastro', type: 'timestamptz', default: () => 'NOW()' })
  dataCadastro: Date;

  @OneToMany(() => FamiliaDificuldadeEntity, (fd) => fd.familia)
  dificuldades: FamiliaDificuldadeEntity[] = [];

  @OneToMany(() => AjudaRecebidaEntity, (ar) => ar.familia)
  ajudasRecebidas: AjudaRecebidaEntity[] = [];

  @ManyToOne(() => ComunidadeEntity, comunidadeEntity => comunidadeEntity.familiasComunidade, {
    eager: true
  })
  @JoinColumn({ name: 'id_comunidade' })
  comunidade: ComunidadeEntity;

  constructor(
    nomeRepresentante: string,
    idade: number,
    cpfRg: string| null,
    telefone: string | null,
    endereco: string | null,
    qtdPessoasResidencia: number | null,
    qtdPessoasEmpregadas: number | null,
    criancasFrequentamEscola: boolean | null,
    membroComProblemaSaude: boolean | null,
    jaRecebeuAjuda: boolean | null,
    desejaParticiparCursos: boolean | null,
    observacao: string | null,
    dataCadastro: Date,
    comunidade: ComunidadeEntity,
    dificuldades: FamiliaDificuldadeEntity[],
    ajudasRecebidas: AjudaRecebidaEntity[]
  ) {
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
    this.comunidade = comunidade;
  }
}
