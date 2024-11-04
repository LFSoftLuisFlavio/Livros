import { Livro } from './Livro';
export class Assunto {
  codAs!: Number;
  descricao!: string;
  ativo!: boolean;
  AssuntoCodAs?: Livro;
}
