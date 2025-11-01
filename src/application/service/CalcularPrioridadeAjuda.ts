import { AjudaRecebidaEntity } from "../../adapters/persistence/entities/AjudaRecebidaEntity";
import { FamiliaEntity } from "../../adapters/persistence/entities/FamiliaEntity";
import { PrioridadeEnum } from "../dto/enuns/PrioridadeEnum";
import { PrioridadePesoEnum } from "../dto/enuns/PrioridadePesoEnum";

export class CalcularPrioridadeAjuda {
    private countPeso: number;
    private _prioridade: PrioridadeEnum;


    constructor(familia: FamiliaEntity) {
        this.countPeso = 0;
        this.calcularDificuldades(familia);
        this.calcularMembroComProblemaSaude(familia);
        this.calcularPessoasEmpregadas(familia);
        this.calcularPessoasPorResidencia(familia);
        this.calcularDiasUltimaAjudaRecebida(familia);
        this.calculaQuantasAjudasRecebeuNosUltimo30Dias(familia);
        this._prioridade = this.definePrioridade();
    }

    private calcularDificuldades(familia: FamiliaEntity): void {
        this.countPeso += familia.dificuldades.reduce((acc, item) => acc + item.dificuldade!.dificuldadeTipoAjuda!.peso!, 0);
    }

    private calcularMembroComProblemaSaude(familia: FamiliaEntity): void {
        if (familia.membroComProblemaSaude) {
            this.countPeso += PrioridadePesoEnum.MEMBRO_COM_PROBLEMA_SAUDE;
        }
    }

    private calcularPessoasEmpregadas(familia: FamiliaEntity): void {
        if (familia.qtdPessoasEmpregadas !== null) {
            this.countPeso -= (familia.qtdPessoasEmpregadas * PrioridadePesoEnum.PESSOA_EMPREGADA);
        }
    }

    private calcularPessoasPorResidencia(familia: FamiliaEntity): void {
        if (familia.qtdPessoasResidencia != null) {
            this.countPeso += (familia.qtdPessoasResidencia * PrioridadePesoEnum.PESSOAS_POR_RESIDENCIA);
        }
    }

    private calcularDiasUltimaAjudaRecebida(familia: FamiliaEntity): void {
        const ajudaRecebida = this.getUltimaAjuda(familia);
        this.countPeso += (this.calcularDiasPassados(ajudaRecebida) > 30) ? PrioridadePesoEnum.RECEBEU_AJUDA_COM_MAIS_30_DIAS 
            :   PrioridadePesoEnum.RECEBEU_AJUDA_COM_MENOS_30_DIAS;
    }

    private calculaQuantasAjudasRecebeuNosUltimo30Dias(familia: FamiliaEntity): void {
        let countAjudasRecebidasEm30Dias = 0;
        for (const ajuda of familia.ajudasRecebidas) {
            if (this.calcularDiasPassados(ajuda) <= 30) {
                countAjudasRecebidasEm30Dias++;
            }
        }
        this.countPeso -= (countAjudasRecebidasEm30Dias * PrioridadePesoEnum.RECEBEU_AJUDA_COM_MENOS_30_DIAS);
    }

    private calcularDiasPassados(ajudaRecebida: AjudaRecebidaEntity | null): number {
        const dataAtual = new Date();
        if (ajudaRecebida && ajudaRecebida.dataEntrega != null) {
            const dataAnterior = new Date(ajudaRecebida.dataEntrega);
            const diferencaMs = (dataAtual.getTime() - dataAnterior.getTime());
            const diasPassados = Math.floor(diferencaMs / (1000 * 60 * 60 * 24));
            return diasPassados;
        }
        return 0;
    }

    private getUltimaAjuda(familia: FamiliaEntity): AjudaRecebidaEntity | null {
        const ajudasOrdenadas = familia.ajudasRecebidas.sort((a, b) => b.id! - a.id!);
        if (ajudasOrdenadas.length > 0) {
            return ajudasOrdenadas[0]
        }
        return null;
    }

    private definePrioridade(): PrioridadeEnum {
        return this.countPeso >= 100 ? PrioridadeEnum.ALTA : ((this.countPeso >= 80) ? PrioridadeEnum.MEDIA : PrioridadeEnum.BAIXA);
    }

    public get prioridade(): PrioridadeEnum {
        return this._prioridade;
    }
}