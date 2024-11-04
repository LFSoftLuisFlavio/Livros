import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Livro } from '../models/Livro';
import { Autor } from '../models/Autor';
import { Assunto } from '../models/Assunto';
import { FormBuilder, FormGroup, NgModel, Validators, FormArray } from '@angular/forms';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LivrosService } from '../services/livros.service';
import { AutorService } from '../services/autor.service';
import { AssuntosService } from '../services/assuntos.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-livro',
  templateUrl: './livro.component.html',
  styleUrl: './livro.component.css'
})
export class LivroComponent implements OnInit, OnDestroy {

  public livros: Livro[] = [];
  public autores: Autor[] = [];
  public assuntos: Assunto[] = [];

  public cadastrar: boolean = true;
  public livroForm!: FormGroup;
  public autorForm!: FormGroup;
  public assuntoForm!: FormGroup;
  private modalRef!: NgbModalRef;
  public tituloModal!: string;
  public msgModal!: string;
  public btnDireito!: boolean;
  public btnEsquerdo!: boolean;
  public btnEsquerdoAutor!: boolean;
  public btnEsquerdoAssunto!: boolean;
  public msgBotao: string = "Não";
  public idExcluir: number = 0;

  public isLoading: boolean = false;
  private unsubscriber: Subject<void> = new Subject<void>();
  public autorSelecionado!: Autor;
  public assuntoSelecionado!: Assunto;

  constructor(private http: HttpClient, private fb: FormBuilder, private modalService: NgbModal, private livroService: LivrosService,
    private autorService: AutorService, private assuntoService: AssuntosService) {
    this.livroForm = this.fb.group({
      codl: [0],
      titulo: ['', Validators.required],
      editora: ['', Validators.required],
      anoPublicacao: ['', Validators.required],
      valorUnitario: [0, Validators.required],
      estoqueInicial: [0, Validators.required],
      ativo: true,
      AssuntoCodAs: this.fb.array([]),
      autorCodAus: this.fb.array([])
    });

    this.autorForm = this.fb.group({
      autorSelected: [null]
    });

    this.assuntoForm = this.fb.group({
      assuntoSelected: [null]
    });
  }
  ngOnInit() {
    this.carregarAutores();
    this.carregarassuntos();
    this.carregarLivros();
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  validaDados(livroOperacao: Livro, contentModal: any): boolean {
    const anoPublicacao = livroOperacao.anoPublicacao;
    const estoqueInicial = livroOperacao.estoqueInicial;
    const arrayAutores = <FormArray>this.livroForm.get('autorCodAus');
    const arrayAssuntos = <FormArray>this.livroForm.get('AssuntoCodAs');

    if (livroOperacao.titulo === null || livroOperacao.titulo === undefined || livroOperacao.titulo == "")
      this.openModal(contentModal, "Validação!!!", "Favor, informe o título!!!", true, false, false, false, 0);
    else if (livroOperacao.titulo.length > 40)
      this.openModal(contentModal, "Validação!!!", "Para o título máximo de 40 caracteres!!!", true, false, false, false, 0);
    else if (livroOperacao.editora === null || livroOperacao.editora === undefined || livroOperacao.editora == "")
      this.openModal(contentModal, "Validação!!!", "Favor, informe a editora!!!", true, false, false, false, 0);
    else if (livroOperacao.editora.length > 40)
      this.openModal(contentModal, "Validação!!!", "Para a editora máximo de 40 caracteres!!!", true, false, false, false, 0);
    else if (livroOperacao.anoPublicacao === null || livroOperacao.anoPublicacao === undefined || livroOperacao.anoPublicacao == "")
      this.openModal(contentModal, "Validação!!!", "Favor, informe a editora!!!", true, false, false, false, 0);
    //else if (livroOperacao.anoPublicacao > 999 && livroOperacao.anoPublicacao <=9999)
    //  this.openModal(contentModal, "Validação!!!", "Para o ano de publicação favor, informe 4 caracteres!!!", true, false, false, false, 0);
    else if (!Number.isInteger(Number(anoPublicacao)))
      this.openModal(contentModal, "Validação!!!", "O campo ano de publicação deve ser um número inteiro!!!", true, false, false, false, 0);
    else if (livroOperacao.valorUnitario <= 0)
      this.openModal(contentModal, "Validação!!!", "O valor unitário deve ser maior que 0!!!", true, false, false, false, 0);
    else if (livroOperacao.estoqueInicial < 0)
      this.openModal(contentModal, "Validação!!!", "O estoque inicial deve ser maior ou igual a 0!!!", true, false, false, false, 0);
    else if (this.livros.find(x => x.titulo.toLowerCase() == livroOperacao.titulo.toLowerCase() && x.codl != livroOperacao.codl && x.ativo))
      this.openModal(contentModal, "Validação!!!", "Livro já cadastrado!!!", true, false, false, false, 0);
    else if (!arrayAutores)
      this.openModal(contentModal, "Validação!!!", "Favor, informe pelo menos um(a) autor(a)!!!", true, false, false, false, 0);
    else if (!arrayAssuntos)
      this.openModal(contentModal, "Validação!!!", "Favor, informe pelo menos um assunto!!!", true, false, false, false, 0);
    else if (!this.livroForm.valid)
      this.openModal(contentModal, "Validação!!!", "Favor, os dados do livro!!!", true, false, false, false, 0);
    else return true;
    return false;
  }

  getAutores(authors: Autor[]): string {
    return authors.map(author => author.nome).join(', ');
  }

  getAssuntos(subjects: Assunto[]): string {
    return subjects.map(subject => subject.descricao).join(', ');
  }

  btnCadastrarClick(contentModal: any) {

    const livroOperacao = this.livroForm.value;

    if (this.validaDados(livroOperacao, contentModal)) {
      this.isLoading = true;

      this.livroService.post(livroOperacao).subscribe(
        (response) => {
          if (response.success) {
            this.limpaCampos();
            this.carregarLivros();
            this.openModal(contentModal, "", response.message, true, false, false, false, 0);
          } else {
            this.openModal(contentModal, "Erro", response.message, true, false, false, false, 0);
          }
        },
        (error) => {
          this.openModal(contentModal, "Erro", 'Erro ao adicionar livro: ' + error, true, false, false, false, 0);
        }
      );

      this.isLoading = false;
    }
  }

  get assuntoCodAs(): FormArray {
    return this.livroForm.get('AssuntoCodAs') as FormArray; // Casting para FormArray
  }

  get autorCodAus(): FormArray {
    return this.livroForm.get('autorCodAus') as FormArray; // Casting para FormArray
  }

  openModal(content: any, txtTitulo: string, txtMsg: string, visibleBtnDireito: boolean,
    visibleBtnEsquerdo: boolean, visibleBtnEsquerdoAutor: boolean, visibleBtnEsquerdoAssunto: boolean, idExcluir: number) {
    const modalOptions: NgbModalOptions = {
      backdrop: 'static', // Impede o fechamento ao clicar fora do modal
      keyboard: false     // Impede o fechamento ao pressionar Esc
    };
    this.idExcluir = idExcluir;
    if (visibleBtnEsquerdo || visibleBtnEsquerdoAssunto || visibleBtnEsquerdoAutor)
      this.msgBotao = "Não";
    else this.msgBotao = "Ok";

    this.tituloModal = txtTitulo;
    this.msgModal = txtMsg;
    this.btnDireito = visibleBtnDireito;
    this.btnEsquerdoAutor = visibleBtnEsquerdoAutor;
    this.btnEsquerdoAssunto = visibleBtnEsquerdoAssunto;
    this.btnEsquerdo = visibleBtnEsquerdo;
    this.modalRef = this.modalService.open(content, modalOptions);

  }

  btnExcluirClickAutor(contentModal: any) {
    this.closeModal();
    if (this.idExcluir > 0) {

      const arrayAutores = <FormArray>this.livroForm.get('autorCodAus');
      const autorParaExcluir = arrayAutores.controls.findIndex(control => {
        return control.value.codAu == this.idExcluir;
      });

      arrayAutores.removeAt(autorParaExcluir);
      this.openModal(contentModal, "Aviso", "Autor(a) excluído(a) com Sucesso!!!", true, false, false, false, 0);

    } else {
      this.openModal(contentModal, "Aviso", "Favor selecione um(a) Autor(a) para excluir!!!", true, false, false, false, 0);
    }
  }

  btnExcluirClickAssunto(contentModal: any) {
    this.closeModal();
    if (this.idExcluir > 0) {
      const arrayAssunto = <FormArray>this.livroForm.get('AssuntoCodAs');
      const assuntoParaExcluir = arrayAssunto.controls.findIndex(control => {
        return control.value.codAs === this.idExcluir;
      });

      arrayAssunto.removeAt(assuntoParaExcluir);
      this.openModal(contentModal, "Aviso", "Assunto excluído com Sucesso!!!", true, false, false, false, 0);

    } else {
      this.openModal(contentModal, "Aviso", "Favor selecione um Assunto para excluir!!!", true, false, false, false, 0);
    }
  }

  adicionarAutor(contentModal: any) {
    const selecionado = this.autorForm.value;
    this.autorSelecionado = selecionado.autorSelected;

    if (this.autorSelecionado) {
      const arrayAutores = <FormArray>this.livroForm.get('autorCodAus');
      const autorJaAdicionado = arrayAutores.controls.some(control => {
        return control.value.codAu === this.autorSelecionado.codAu;
      });

      if (autorJaAdicionado) {
        this.openModal(contentModal, "Aviso", "Autor(a) já Adicionado(a)!!!", true, false, false, false, 0);
      } else {
        arrayAutores.push(this.fb.group(this.autorSelecionado));
        this.autorForm.reset();
      }
    } else {
      this.openModal(contentModal, "Aviso", "Favor selecione um(a) Autor(a)!!!", true, false, false, false, 0);
    }
  }

  adicionarAssunto(contentModal: any) {
    const selecionado = this.assuntoForm.value;
    this.assuntoSelecionado = selecionado.assuntoSelected;

    if (this.assuntoSelecionado) {
      const arrayAssuntos = <FormArray>this.livroForm.get('AssuntoCodAs');
      const assuntoJaAdicionado = arrayAssuntos.controls.some(control => {
        return control.value.codAs === this.assuntoSelecionado.codAs;
      });

      if (assuntoJaAdicionado) {
        this.openModal(contentModal, "Aviso", "Assunto já Adicionado!!!", true, false, false, false, 0);
      } else {
        arrayAssuntos.push(this.fb.group(this.assuntoSelecionado));
        this.assuntoForm.reset();
      }
    } else {
      this.openModal(contentModal, "Aviso", "Favor selecione um assunto!!!", true, false, false, false, 0);
    }
  }

  preparaAlteracao(livro: Livro) {
    this.livroForm.patchValue(livro);


    this.clearFormArray(this.livroForm.get('AssuntoCodAs') as FormArray);
    this.clearFormArray(this.livroForm.get('autorCodAus') as FormArray);

    livro.assuntoCodAs.forEach((assunto: any) => {
      const arrayAssuntos = <FormArray>this.livroForm.get('AssuntoCodAs');
      arrayAssuntos.push(this.fb.group(assunto));
    });

    livro.autorCodAus.forEach((autor: any) => {
      const arrayAutores = <FormArray>this.livroForm.get('autorCodAus');
      arrayAutores.push(this.fb.group(autor));
    });

    this.cadastrar = false;
  }

  clearFormArray(formArray: FormArray): void {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  btnAlterarClick(contentModal: any) {
    const livroOperacao = this.livroForm.value;

    if (this.validaDados(livroOperacao, contentModal)) {
      this.isLoading = true;

      this.livroService.put(livroOperacao).subscribe(
        (response) => {
          if (response.success) {
            this.limpaCampos();
            this.carregarLivros();
            this.openModal(contentModal, "", response.message, true, false, false, false, 0);
          } else {
            this.openModal(contentModal, "Erro", response.message, true, false, false, false, 0);
          }
        },
        (error) => {
          this.openModal(contentModal, "Erro", 'Erro ao alterar autor(a): ' + error, true, false, false, false, 0);
        }
      );

      this.isLoading = false;
    }
  }
  btnExcluirClick(contentModal: any) {
    this.closeModal();
    const livroExcluir = this.livros.find(x => x.codl === this.idExcluir);
    if (livroExcluir) {
      this.isLoading = true;

      this.livroService.delete(this.idExcluir).subscribe(
        (response) => {
          if (response.success) {
            this.limpaCampos();
            this.carregarLivros();
            this.openModal(contentModal, "", response.message, true, false, false, false, 0);
          } else {
            this.openModal(contentModal, "Erro", response.message, true, false, false, false, 0);
          }
        },
        (error) => {
          this.openModal(contentModal, "Erro", 'Erro ao excluir autor(a): ' + error, true, false, false, false, 0);
        }
      );

      this.isLoading = false;
    } else {
      this.openModal(contentModal, "", "Registro não encontrado!!!", true, false, false, false, 0);
    }
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  limpaCampos() {
    this.carregarassuntos();
    this.carregarAutores();

    this.cadastrar = true;
    this.idExcluir = 0;
    this.livroForm.reset({
      codl: 0,
      titulo: '',
      editora: '',
      anoPublicacao: '',
      valorUnitario: 0,
      estoqueInicial: 0,
      ativo: true,
      AssuntoCodAs: [],
      autorCodAus: []
    });
    this.clearFormArray(this.livroForm.get('AssuntoCodAs') as FormArray);
    this.clearFormArray(this.livroForm.get('autorCodAus') as FormArray);
  }

  carregarAutores() {
    this.autorService.getAll()
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((autors: Autor[]) => {
        this.autores = autors;
      }, (error: any) => {
        console.log(error);
      });
  }

  carregarassuntos() {

    this.assuntoService.getAll()
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((assuntos: Assunto[]) => {
        this.assuntos = assuntos;
      }, (error: any) => {
        console.log(error);
      });
  }

  carregarLivros() {
    this.isLoading = true;
    this.livroService.getAll()
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((livros: Livro[]) => {
        this.livros = livros;
      }, (error: any) => {
        this.isLoading = false
      }, () => this.isLoading = false);
  }
}
