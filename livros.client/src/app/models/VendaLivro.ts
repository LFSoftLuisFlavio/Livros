import { Livro } from './Livro';
import { Venda } from './Venda';

export class VendaLivro {
  codVl!: number;
  livro_Codl!: Number;
  venda_CodV!: number;
  quantidade!: number;
  valorUnitario!: number;
  valorDesconto!: number;
  valorTotal!: number;
  ativo!: boolean;
  livro!: Livro[];
  venda?: Venda;
}
