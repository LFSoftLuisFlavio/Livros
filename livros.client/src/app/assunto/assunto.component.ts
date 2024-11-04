import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Assunto } from '../models/Assunto';
import { FormBuilder, FormGroup, NgModel, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AssuntosService } from '../services/assuntos.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-assunto',
  templateUrl: './assunto.component.html',
  styleUrl: './assunto.component.css'
})
export class AssuntoComponent implements OnInit, OnDestroy {

  public assuntos: Assunto[] = [];

  public cadastrar: boolean = true;
  public assuntoForm!: FormGroup;
  private modalRef!: NgbModalRef;
  public tituloModal!: string;
  public msgModal!: string;
  public btnDireito!: boolean;
  public btnEsquerdo!: boolean;
  public msgBotao: string = "Não";
  public idExcluir: Number = 0;

  public isLoading: boolean = true;
  private unsubscriber: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient, private fb: FormBuilder, private modalService: NgbModal, private assuntoService: AssuntosService) {
    this.criarForm();
  }
  ngOnInit() {
    this.carregarassuntos();
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
    this.modalRef = this.modalService.open(content, modalOptions);
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  criarForm() {
    this.assuntoForm = this.fb.group({
      codAs: [0],
      descricao: ['', Validators.required],
      ativo: [true]
    });
  }

  preparaAlteracao(assunto: Assunto) {
    this.assuntoForm.patchValue(assunto);
    this.cadastrar = false;
  }

  btnAlterarClick(contentModal: any) {

    const assuntoOperacao = this.assuntoForm.value;

    if (this.validaDados(assuntoOperacao, contentModal)) {
      this.isLoading = true;

      this.assuntoService.put(assuntoOperacao).subscribe(
        (response) => {
          if (response.success) {
            this.limpaCampos();
            this.carregarassuntos();
            this.openModal(contentModal, "", response.message, true, false, 0);
          } else {
            this.openModal(contentModal, "Erro", response.message, true, false, 0);
          }
        },
        (error) => {
          this.openModal(contentModal, "Erro", 'Erro ao alterar assunto(a): ' + error, true, false, 0);
        }
      );

      this.isLoading = false;
    }

  }

  btnExcluirClick(contentModal: any) {
    //console.log(idExcluir);
    const assuntoExcluir = this.assuntos.find(x => x.codAs === this.idExcluir);
    if (assuntoExcluir) {
      this.isLoading = true;

      this.assuntoService.delete(this.idExcluir).subscribe(
        (response) => {
          if (response.success) {
            this.limpaCampos();
            this.carregarassuntos();
            this.openModal(contentModal, "", response.message, true, false, 0);
          } else {
            this.openModal(contentModal, "Erro", response.message, true, false, 0);
          }
        },
        (error) => {
          this.openModal(contentModal, "Erro", 'Erro ao alterar assunto(a): ' + error, true, false, 0);
        }
      );

      this.isLoading = false;
    } else {
      this.openModal(contentModal, "", "Registro não encontrado!!!", true, false, 0);
    }
  }

  btnCadastrarClick(contentModal: any) {

    const assuntoOperacao = this.assuntoForm.value;

    if (this.validaDados(assuntoOperacao, contentModal)) {
      this.isLoading = true;

      this.assuntoService.post(assuntoOperacao).subscribe(
        (response) => {
          if (response.success) {
            this.limpaCampos();
            this.carregarassuntos();
            this.openModal(contentModal, "", response.message, true, false, 0);
          } else {
            this.openModal(contentModal, "Erro", response.message, true, false, 0);
          }
        },
        (error) => {
          this.openModal(contentModal, "Erro", 'Erro ao adicionar assunto(a): ' + error, true, false, 0);
        }
      );

      this.isLoading = false;
    }
  }

  validaDados(assuntoOperacao: Assunto, contentModal: any): boolean {
    if (assuntoOperacao.descricao === null || assuntoOperacao.descricao === undefined || assuntoOperacao.descricao == "")
      this.openModal(contentModal, "Validação!!!", "Favor, informe a descrição do assunto!!!", true, false, 0);
    else if (assuntoOperacao.descricao.length > 20)
      this.openModal(contentModal, "Validação!!!", "Para a descrição do assunto máximo de 20 caracteres!!!", true, false, 0);
    else if (this.assuntos.find(x => x.descricao.toLowerCase() == assuntoOperacao.descricao.toLowerCase() && x.codAs != assuntoOperacao.codAs && x.ativo))
      this.openModal(contentModal, "Validação!!!", "assunto já cadastrado(a)!!!", true, false, 0);
    else if (!this.assuntoForm.valid)
      this.openModal(contentModal, "Validação!!!", "Favor, informe os dados do assunto!!!", true, false, 0);
    else return true;
    return false;
  }

  limpaCampos() {
    this.cadastrar = true;
    this.idExcluir = 0;
    this.assuntoForm.reset({
      codAs: 0,
      descricao: '',
      ativo: true
    });
  }

  carregarassuntos() {
    this.isLoading = true;

    this.assuntoService.getAll()
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((assuntos: Assunto[]) => {
        this.assuntos = assuntos;
      }, (error: any) => {
        this.isLoading = false;
      }, () => this.isLoading = false
    );
  }
}
