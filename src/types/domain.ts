export type EstadoEquipamento = "funcionando" | "nao_funcionando" | "";
export type Necessidade = "substituido" | "enviar_conserto" | "descartado" | "";

export type SetorType = {
  id: number;
  nome: string;
};

export type LojaType = {
  id: number;
  nome: string;
};

export type Equipamento = {
  id: number;
  nome: string;
  modelo_id: number;
  setor_id: number;
  loja_id: number;
  estado: EstadoEquipamento;
  necessidade: Necessidade;
};
