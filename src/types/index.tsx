export interface UsuarioProps {
  user_id?: string;
  token?: string;
  nome_completo: string;
  cpf: string;
  matricula: string;
  is_adm: boolean;
  permissao_energia: boolean;
  permissao_agua: boolean;
  permissao_gas: boolean;
  funcao: string;
  created_at?: string;
}

export interface LoginProps {
  matricula: string;
  password: string;
}

export interface LojaProps {
  id?: string;
  nome_loja: string;
  numero_loja: string;
  prefixo_loja: string;
  complexo: string;
  ativa: boolean;
  tem_energia: boolean;
  tem_agua: boolean;
  tem_gas: boolean;
  medidores: MedidorComLeitura[];
}

export interface MedidorComLeitura {
  id?: string;
  tipo_medicao: string;
  localidade: string;
  numero_relogio: string;
  ultima_leitura: number;
  detalhes: string;
  data_instalacao: string;
  quadro_distribuicao: string;
  leituras: LeituraProps[]; // Adicione a leitura aqui, como um array
}

export interface LeituraProps {
  leitura_atual: number;
  consumo_mensal: number;
  mes?: number;
  ano?: number;
  leitura_anterior?: number;
  created_at?: string;
  consumo_anterior?: number;
  foto_url?: string | null;
  detalhes_leitura?: string | null;
  nome_loja_leitura: string;
  medidor_id: string;
  nome_usuario: string;
  medidor?: string;
}
