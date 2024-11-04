import { Assunto } from './Assunto';
import { Autor } from './Autor';
import { Venda } from './Venda';

export class Livro {
  codl!: number;
  titulo!: string;
  editora!: string;
  anoPublicacao!: string;
  valorUnitario!: number;
  estoqueInicial!: number;
  ativo!: boolean;
  assuntoCodAs: Assunto[] = [];
  autorCodAus: Autor[]=[];
  vendaLivros: Venda[]=[]; 
}
