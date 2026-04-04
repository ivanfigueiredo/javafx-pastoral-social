import { Logger } from "pino";
import { ListarAjudasUseCase } from "../port/in/ListarAjudasUseCase";
import { AjudaRepository } from "../port/out/AjudaRepository";
import { InternalServerErrorException } from "../exceptions/InternalServerErrorException";
import { AjudaFilterQueryDTO } from "../dto/AjudaFilterQueryDTO";
import { StatusAjudaEnum } from "../../adapters/persistence/entities/StatusAjudaEnum";
import { TipoAjudaEnum } from "../dto/enuns/TipoAjudaEnum";
import { OpcaoListaDTO } from "../dto/OpcaoListaDTO";
import { PaginatedDTO } from "../dto/PaginatedDTO";
import { AjudaRecebidaEntity } from "../../adapters/persistence/entities/AjudaRecebidaEntity";
import { TipoDoacaoEnum } from "../../adapters/persistence/entities/TipoDoacaoEnum";
import { CestaGeradaEntity } from "../../adapters/persistence/entities/CestaGeradaEntity";
import { ItemTemplateEntity } from "../../adapters/persistence/entities/ItemTemplateEntity";
import { UnidadeMedidaEnum } from "../dto/enuns/UnidadeMedidaEnum";

export class ListarAjudasService implements ListarAjudasUseCase {
    private readonly logger: Logger;
    
    constructor(
        logger: Logger,
        private readonly ajudaRepository: AjudaRepository
    ) {
        this.logger = logger.child({ service: "ListarAjudasUseCase" })
    }

    public async listarAjudas(dto: AjudaFilterQueryDTO): Promise<PaginatedDTO> {
        try {
            const [ajudas, totalAjuda] = await this.ajudaRepository.findAjudas(dto);
            const result: Result[] = ajudas.map(ajuda => ({
                id: ajuda.id,
                representante: ajuda.familia.nomeRepresentante,
                endereco: ajuda.familia.endereco,
                statusAjuda: ajuda.statusAjuda.valueOf(),
                observacao: (ajuda.observacao != null && ajuda.observacao !== undefined && ajuda.observacao !== "") ? 
                    this.getObservacao(JSON.parse(ajuda.observacao)) : undefined,
                tipoAjuda: ajuda.tipoAjuda.descricao!,
                dataEntrega: (ajuda.dataEntrega != null) ? ajuda.dataEntrega.toISOString() : null,
                cesta: this.getCesta(ajuda)
            }));
            const response = {
                total: totalAjuda,
                pendentes: ajudas.filter(ajuda => ajuda.statusAjuda === StatusAjudaEnum.AGUARDANDO_APROVACAO).length,
                concluidas: ajudas.filter(ajuda => ajuda.statusAjuda === StatusAjudaEnum.ENTREGUE).length,
                data: result
            }
            return new PaginatedDTO(parseInt(`${dto.page}`), totalAjuda, Math.ceil(totalAjuda / dto.pageSize), response);
        } catch (e: any) {
            this.logger.error({error: e.message}, 'Erro ao cancelar cesta');
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }

    private getObservacao(observacao: {[key: string]: string}): string | undefined {
        if (observacao.detalhe) {
            return observacao.detalhe;
        }
        return undefined;
    }   

    private getCesta(ajuda: AjudaRecebidaEntity): {[key:string]: any} | undefined {
        if (ajuda.tipoAjuda.id === TipoAjudaEnum.CESTA_BASICA && (ajuda.cestaGerada !== null && ajuda.cestaGerada !== undefined)) {
            const cesta = ajuda.cestaGerada;
            return {
                identificadorCesta: cesta.identificadorCesta!,
                descricao: cesta.template.descricao,
                itens: cesta.template.itensTemplate.map(item => ({
                    idItemProduto: item.itemProduto.id,
                    nomeProduto: item.itemProduto.itemProdutoDesc,
                    quantidade: item.quantidade,
                    detalhe: this.calculatePeso(item)
                }))
            }
        }
        return undefined;
    }

    private calculatePeso(itemTemplate: ItemTemplateEntity): string | undefined {
        if (itemTemplate.itemProduto.unidadeMedida!.undMedidas == UnidadeMedidaEnum.KG) {
            return `${itemTemplate.quantidade}${itemTemplate.itemProduto.unidadeMedida!.undMedidas}`;
        } else if (itemTemplate.itemProduto.unidadeMedida!.undMedidas == UnidadeMedidaEnum.G) {
            const sum = itemTemplate.itemProduto.valorMedida! * itemTemplate.quantidade;
            const converteKG = (sum / 1000);
            return (converteKG >= 1) ? `${converteKG}${UnidadeMedidaEnum.KG}` : `${sum}${UnidadeMedidaEnum.G}`;
        } else if (itemTemplate.itemProduto.unidadeMedida!.undMedidas == UnidadeMedidaEnum.ML) {
            const sum = itemTemplate.itemProduto.valorMedida! * itemTemplate.quantidade;
            const converteKG = (sum / 1000);
            return (converteKG >= 1) ? `${converteKG}${UnidadeMedidaEnum.L}` : `${sum}${UnidadeMedidaEnum.ML}`;
        } else if (itemTemplate.itemProduto.unidadeMedida!.undMedidas == UnidadeMedidaEnum.L) {
            return `${itemTemplate.quantidade}${UnidadeMedidaEnum.L}`;
        }
    }
        

    public async listarAjudasOpcaoLista(): Promise<OpcaoListaDTO[]> {
        try {
            const ajudas = await this.ajudaRepository.findAjudasOpcaoLista();
            return ajudas;
        } catch (e: any) {
            this.logger.error({error: e.message}, 'Erro ao listar opções de ajuda');
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }
}

type Result = {
    id: number | null,
    representante: string,
    endereco: string | null,
    statusAjuda: string,
    tipoAjuda: string,
    dataEntrega: string | null
}