import { TipoVenda } from './TipoVenda';
import { VendaLivro } from './VendaLivro';

export class Venda {
  codV!: number;
  cliente!: string;
  dataVenda!: Date;
  tipo_Venda_CodTv!: number;
  consumidorFinal!: boolean;
  ativo!: boolean;
  tipoVenda?: TipoVenda;
  vendaLivro!: VendaLivro[];
}
