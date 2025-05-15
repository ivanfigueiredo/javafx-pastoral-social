import { AbilityBuilder, InferSubjects, PureAbility } from '@casl/ability';
import { ConditionsMatcher, MatchConditions, TaggedInterface } from '@casl/ability/dist/types/types';
import { Connection } from '../../persistence/database/Connection';
import { RoleEntity } from '../../persistence/entities/RoleEntity';

type ActionType = 
  | 'CadastrarFamilia'
  | 'ListarFamilia'
  | 'EditarFamilia' 
  | 'CadastrarItemEstoque'
  | 'CriarTemplateCesta'
  | 'ListarTemplate'
  | 'GerarCesta'
  | 'EntregarAjuda'
  | 'ListarAjuda'
  | 'VisualizarRelatorios'
  | 'AprovarEntrega'
  | 'ListarEstoque'
  | 'ListarLocalizacao'
  | 'ListarUND'
  | 'ListarItemProduto'

export type Action = 
    | 'cadastrar_familia'
    | 'listar_familia'
    | 'editar_familia'
    | 'cadastrar_item_estoque'
    | 'criar_template_cesta'
    | 'listar_template'
    | 'gerar_cesta'
    | 'entregar_ajuda'
    | 'aprovar_ajuda'
    | 'listar_ajuda'
    | 'visualizar_relatorios'
    | 'listar_estoque'
    | 'listar_localizacao'
    | 'listar_und'
    | 'listar_item_produto'

export const ActionType: Record<ActionType, Action> = {
    CadastrarFamilia: 'cadastrar_familia',
    ListarFamilia: 'listar_familia',
    EditarFamilia: 'editar_familia',
    CadastrarItemEstoque: 'cadastrar_item_estoque',
    CriarTemplateCesta: 'cadastrar_item_estoque',
    ListarTemplate: 'listar_template',
    GerarCesta: 'gerar_cesta',
    EntregarAjuda: 'entregar_ajuda',
    AprovarEntrega: 'aprovar_ajuda',
    ListarAjuda: 'listar_ajuda',
    VisualizarRelatorios: 'visualizar_relatorios',
    ListarEstoque: 'listar_estoque',
    ListarLocalizacao: 'listar_localizacao',
    ListarUND: 'listar_und',
    ListarItemProduto: 'listar_item_produto'
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

    constructor(private readonly connection: Connection) {
        this.abilityBuilder = new AbilityBuilder<PureAbility<[Action, Subject], MatchConditions>>(
            PureAbility<[Action, Subject], MatchConditions>
        )
    }

    private async findPermissions(): Promise<{tr_role_desc: Role; tp_action: string;}[]> {
        return this.connection.getDataSourcer()
            .getRepository(RoleEntity)
            .createQueryBuilder('tr')
            .leftJoin('tr.rolePermissions', 'trp')
            .leftJoin('trp.permission', 'tp')
            .select([
                'tr.description',
                'tp.action'
            ])
            .getRawMany();
    }

    private async getPermissions(): Promise<Permission[]> {
        const result = await this.findPermissions();
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