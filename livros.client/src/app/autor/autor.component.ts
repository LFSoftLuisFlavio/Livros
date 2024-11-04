import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Autor } from '../models/Autor';
import { FormBuilder, FormGroup, NgModel, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AutorService } from '../services/autor.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-autor',
  templateUrl: './autor.component.html',
  styleUrl: './autor.component.css'
})
export class AutorComponent implements OnInit, OnDestroy {

  public autores: Autor[] = []; 

  public cadastrar: boolean = true;
  public autorForm!: FormGroup;
  private modalRef!: NgbModalRef;
  public tituloModal!: string;
  public msgModal!: string;
  public btnDireito!: boolean;
  public btnEsquerdo!: boolean;
  public msgBotao: string = "Não";
  public idExcluir: Number = 0;

  public isLoading: boolean = true;
  private unsubscriber: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient, private fb: FormBuilder, private modalService: NgbModal, private autorService: AutorService) {
    this.criarForm();
  }
  ngOnInit() {
    this.carregarAutores();
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  openModal(content: any, txtTitulo: string, txtMsg: string, visibleBtnDireito: boolean,
    visibleBtnEsquerdo: boolean, idExcluir: Number) {
    const modalOptions: NgbModalOptions = {
      backdrop: 'static', // Impede o fechamento ao clicar fora do modal
      keyboard: false     // Impede o fechamento ao pressionar Esc
    };
    this.idExcluir = idExcluir;
    if (visibleBtnEsquerdo)
      this.msgBotao = "Não";
    else this.msgBotao = "Ok";



    this.tituloModal = txtTitulo;
    this.msgModal = txtMsg;
    this.btnDireito = visibleBtnDireito;
    this.btnEsquerdo = visibleBtnEsquerdo;
    this.modalRef= this.modalService.open(content, modalOptions);
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  criarForm() {
    this.autorForm = this.fb.group({
      codAu: [0],
      nome: ['', Validators.required],
      ativo: [true]
    });
  }

  preparaAlteracao(autor:Autor) {
    this.autorForm.patchValue(autor);
    this.cadastrar = false;
  }

  btnAlterarClick(contentModal: any) {

    const autorOperacao = this.autorForm.value;

    if (this.validaDados(autorOperacao, contentModal)) {
      this.isLoading = true;

      this.autorService.put(autorOperacao).subscribe(
        (response) => {
          if (response.success) {
            this.limpaCampos();
            this.carregarAutores();
            this.openModal(contentModal, "", response.message, true, false, 0);
          } else {
            this.openModal(contentModal, "Erro", response.message, true, false, 0);
          }
        },
        (error) => {
          this.openModal(contentModal, "Erro", 'Erro ao alterar autor(a): ' + error, true, false, 0);
        }
      );

      this.isLoading = false;
    }

  }

  btnExcluirClick(contentModal: any) {
    this.closeModal();
    const autorExcluir = this.autores.find(x => x.codAu === this.idExcluir);
    if (autorExcluir) {
      this.isLoading = true;

      this.autorService.delete(this.idExcluir).subscribe(
        (response) => {
          if (response.success) {
            this.limpaCampos();
            this.carregarAutores();
            this.openModal(contentModal, "", response.message, true, false, 0);
          } else {
            this.openModal(contentModal, "Erro", response.message, true, false, 0);
          }
        },
        (error) => {
          this.openModal(contentModal, "Erro", 'Erro ao excluir autor(a): ' + error, true, false, 0);
        }
      );

      this.isLoading = false;
    } else {
      this.openModal(contentModal, "", "Registro não encontrado!!!", true, false, 0);
    }
  }

  btnCadastrarClick(contentModal: any) {
    
    const autorOperacao = this.autorForm.value;

    if (this.validaDados(autorOperacao, contentModal)) {
      this.isLoading = true;

      this.autorService.post(autorOperacao).subscribe(
        (response) => {
          if (response.success) {
            this.limpaCampos();
            this.carregarAutores();
            this.openModal(contentModal, "", response.message, true, false, 0);
          } else {
            this.openModal(contentModal, "Erro", response.message, true, false, 0);
          }
        },
        (error) => {
          this.openModal(contentModal, "Erro", 'Erro ao adicionar autor(a): '+error, true, false,0);
        }
      );

      this.isLoading = false;
    }
  }

  validaDados(autorOperacao: Autor, contentModal: any): boolean {
    if (autorOperacao.nome === null || autorOperacao.nome === undefined || autorOperacao.nome=="")
      this.openModal(contentModal, "Validação!!!", "Favor, informe o nome do(a) autor(a)!!!", true, false,0);
    else if (autorOperacao.nome.length > 40)
      this.openModal(contentModal, "Validação!!!", "Para o nome do(a) autor(a) máximo de 40 caracteres!!!", true, false,0);
    else if (this.autores.find(x => x.nome.toLowerCase() == autorOperacao.nome.toLowerCase() && x.codAu != autorOperacao.codAu && x.ativo))
      this.openModal(contentModal, "Validação!!!", "Autor(a) já cadastrado(a)!!!", true, false,0);
    else if (!this.autorForm.valid)
      this.openModal(contentModal, "Validação!!!", "Favor, informe os dados do(a) autor(a)!!!", true, false,0);
    else return true;
    return false;
  }

  limpaCampos() {
    this.cadastrar = true;
    this.idExcluir = 0;
    this.autorForm.reset({
      codAu: 0,
      nome: '',
      ativo: true
    });
  }

  carregarAutores() {
    this.isLoading = true;

    this.autorService.getAll()
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((autors: Autor[]) => {
        this.autores = autors;
      }, (error: any) => {
        console.log(error);
      }, () => this.isLoading = false
      );
  }
}
