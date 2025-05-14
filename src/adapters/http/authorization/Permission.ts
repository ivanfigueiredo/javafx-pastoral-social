import { AbilityBuilder, InferSubjects, PureAbility } from '@casl/ability';
import { ConditionsMatcher, MatchConditions, TaggedInterface } from '@casl/ability/dist/types/types';

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
  | 'AprovarEntrega';

export type Action = 
  | 'cadastrar_familia'
  | 'listar_familia'
  | 'editar_familia' 
  | 'cadastrar_item_estoque'
  | 'criar_template_cesta'
  | 'listar_template'
  | 'gerar_cesta'
  | 'entregar_ajuda'
  | 'listar_ajuda'
  | 'visualizar_relatorios'
  | 'aprovar_entrega';

export const ActionType: Record<ActionType, Action> = {
    CadastrarFamilia: 'cadastrar_familia',
    AprovarEntrega: 'aprovar_entrega',
    CadastrarItemEstoque: 'cadastrar_item_estoque',
    CriarTemplateCesta: 'cadastrar_item_estoque',
    EditarFamilia: 'editar_familia',
    EntregarAjuda: 'entregar_ajuda',
    GerarCesta: 'gerar_cesta',
    ListarAjuda: 'listar_ajuda',
    ListarFamilia: 'listar_familia',
    ListarTemplate: 'listar_template',
    VisualizarRelatorios: 'visualizar_relatorios'
}

export type Role = 
    | 'Admin'
    | 'App'
    | 'Moderador';

export interface Payload {
    role: Role
}

type Data = Payload & TaggedInterface<'payload'>;
type Subject = InferSubjects<Data>

export type AppAbility = PureAbility<[Action, Subject]>;

export function defineAbilityFor(): AppAbility {
    const { can, build} = new AbilityBuilder<PureAbility<[Action, Subject], MatchConditions>>(
      PureAbility<[Action, Subject], MatchConditions>
    )
    can<Data>([
        'cadastrar_familia',
        'listar_familia',
        'editar_familia' ,
        'cadastrar_item_estoque',
        'criar_template_cesta',
        'listar_template',
        'gerar_cesta',
        'entregar_ajuda',
        'aprovar_entrega',
        'listar_ajuda',
        'visualizar_relatorios'
    ], 'payload', ["role"], (data: Payload) => data.role === "Admin");
    can<Data>([
        'cadastrar_familia',
        'listar_familia',
        'editar_familia' ,
        'listar_template',
        'gerar_cesta',
        'entregar_ajuda',
        'listar_ajuda',
        'visualizar_relatorios'
    ], 'payload', ["role"], (data: Payload) => data.role === "App");
    can<Data>([
        'cadastrar_familia',
        'listar_familia',
        'editar_familia' ,
        'cadastrar_item_estoque',
        'criar_template_cesta',
        'listar_template',
        'gerar_cesta',
        'entregar_ajuda',
        'listar_ajuda',
        'visualizar_relatorios'
    ], 'payload', ["role"], (data: Payload) => data.role === "Moderador");
    return build({
        conditionsMatcher: ((matchConditions: MatchConditions) => matchConditions) as ConditionsMatcher<unknown>,
        fieldMatcher: (fields) => (field) => fields.includes(field),
    });
}
