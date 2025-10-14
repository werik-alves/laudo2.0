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
