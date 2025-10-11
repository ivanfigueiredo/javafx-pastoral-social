import { AbilityBuilder, InferSubjects, PureAbility } from '@casl/ability';
import { ConditionsMatcher, MatchConditions, TaggedInterface } from '@casl/ability/dist/types/types';
import { RoleRepository } from './RoleRepository';

type ActionType = 
  | 'CadastrarFamilia'
  | 'ListarFamilia'
  | 'EditarFamilia' 
  | 'CadastrarItemEstoque'
  | 'CriarModeloTemplate'
  | 'ListarTemplate'
  | 'GerarCesta'
  | 'EntregarAjuda'
  | 'ListarAjuda'
  | 'VisualizarRelatorios'
  | 'AprovarEntrega'
  | 'DeletarEstoque'
  | 'ListarEstoque'
  | 'ListarLocalizacao'
  | 'ListarUND'
  | 'ListarItemProduto'
  | 'ListarDificuldade'
  | 'ConsultarGeracaoModelo'
  | 'ListarComunidades'
  | 'AssociarFamiliaAjuda'
  | 'ListarTipoTemplate'

export type Action = 
    | 'cadastrar_familia'
    | 'listar_familia'
    | 'editar_familia'
    | 'cadastrar_item_estoque'
    | 'criar_modelo_template'
    | 'listar_template'
    | 'gerar_cesta'
    | 'entregar_ajuda'
    | 'aprovar_ajuda'
    | 'deletar_estoque'
    | 'listar_ajuda'
    | 'visualizar_relatorios'
    | 'listar_estoque'
    | 'listar_localizacao'
    | 'listar_und'
    | 'listar_item_produto'
    | 'listar_dificuldade'
    | 'consultar_geracao_modelo'
    | 'listar_comunidade'
    | 'associar_familia_ajuda'
    | 'listar_tipo_template'

export const ActionType: Record<ActionType, Action> = {
    CadastrarFamilia: 'cadastrar_familia',
    ListarFamilia: 'listar_familia',
    EditarFamilia: 'editar_familia',
    CadastrarItemEstoque: 'cadastrar_item_estoque',
    CriarModeloTemplate: 'criar_modelo_template',
    ListarTemplate: 'listar_template',
    GerarCesta: 'gerar_cesta',
    EntregarAjuda: 'entregar_ajuda',
    AprovarEntrega: 'aprovar_ajuda',
    ListarAjuda: 'listar_ajuda',
    VisualizarRelatorios: 'visualizar_relatorios',
    ListarEstoque: 'listar_estoque',
    ListarLocalizacao: 'listar_localizacao',
    ListarUND: 'listar_und',
    ListarItemProduto: 'listar_item_produto',
    DeletarEstoque: 'deletar_estoque',
    ListarDificuldade: 'listar_dificuldade',
    ConsultarGeracaoModelo: 'consultar_geracao_modelo',
    AssociarFamiliaAjuda: 'associar_familia_ajuda',
    ListarComunidades: 'listar_comunidade',
    ListarTipoTemplate: 'listar_tipo_template'
}

export type Role = 
    | 'Admin'
    | 'App'
    | 'Moderador';

export interface RolePermission {
    role: Role
}

type Data = RolePermission & TaggedInterface<'RolePermission'>;
type Subject = InferSubjects<Data>

export type AppAbility = PureAbility<[Action, Subject]>;
type MatchCallback = (data: RolePermission) => boolean;

export interface Permission {
    role: Role;
    actions: Action[]
}

export class AbilityPermission {
    private readonly abilityBuilder: AbilityBuilder<PureAbility<[Action, Subject], MatchConditions>>;

    constructor(private readonly roleRepository: RoleRepository) {
        this.abilityBuilder = new AbilityBuilder<PureAbility<[Action, Subject], MatchConditions>>(
            PureAbility<[Action, Subject], MatchConditions>
        )
    }

    private async getPermissions(): Promise<Permission[]> {
        const result = await this.roleRepository.findPermissions();
        const permissions: Permission[] = [
            {role: "Admin", actions: []},
            {role: "App", actions: []},
            {role: "Moderador", actions: []}
        ];
        for (const item of result) {
            if (item.tr_role_desc === 'Admin') {
                const perm = permissions.find(item => item.role === "Admin")
                perm!.actions.push(item.tp_action as Action);
            } else if (item.tr_role_desc === "App") {
                const perm = permissions.find(item => item.role === "App")
                perm!.actions.push(item.tp_action as Action);
            } else {
                const perm = permissions.find(item => item.role === "Moderador")
                perm!.actions.push(item.tp_action as Action);
            }
        }
        return permissions;
    }

    private defineCan(actions: Action[], match: MatchCallback): void {
        this.abilityBuilder.can<Data>(actions, "RolePermission", "role", match);
    }

    
    public async setupPermissions(): Promise<void> {
        const result = await this.getPermissions();
        for (const perm of result) {
            this.defineCan(perm.actions, (data: RolePermission) => data.role === perm.role)
        }
    }

    public getAppAbility(): AppAbility {
        return this.abilityBuilder.build({
            conditionsMatcher: ((matchConditions: MatchConditions) => matchConditions) as ConditionsMatcher<unknown>,
            fieldMatcher: (fields) => (field) => fields.includes(field),
        })
    }
}