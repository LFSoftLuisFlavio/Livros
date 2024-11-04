import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TipoVenda } from '../models/TipoVenda';
import { FormBuilder, FormGroup, NgModel, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TipovendasService } from '../services/tipovendas.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-tipovenda',
  templateUrl: './tipovenda.component.html',
  styleUrl: './tipovenda.component.css'
})
export class TipovendaComponent implements OnInit, OnDestroy {

  public tipoVendas: TipoVenda[] = [];

  public cadastrar: boolean = true;
  public tipoVendaForm!: FormGroup;
  private modalRef!: NgbModalRef;
  public tituloModal!: string;
  public msgModal!: string;
  public btnDireito!: boolean;
  public btnEsquerdo!: boolean;
  public msgBotao: string = "Não";
  public idExcluir: Number = 0;

  public isLoading: boolean = true;
  private unsubscriber: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient, private fb: FormBuilder, private modalService: NgbModal, private tipoVendaService: TipovendasService) {
    this.criarForm();
  }
  ngOnInit() {
    this.carregartipoVendas();
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
    this.tipoVendaForm = this.fb.group({
      codTv: [0],
      descricao: ['', Validators.required],
      ativo: [true],
      porcentagemDesconto:[0]
    });
  }

  preparaAlteracao(tipoVenda: TipoVenda) {
    this.tipoVendaForm.patchValue(tipoVenda);
    this.cadastrar = false;
  }

  btnAlterarClick(contentModal: any) {

    const tipoVendaOperacao = this.tipoVendaForm.value;

    if (this.validaDados(tipoVendaOperacao, contentModal)) {
      this.isLoading = true;

      this.tipoVendaService.put(tipoVendaOperacao).subscribe(
        (response) => {
          if (response.success) {
            this.limpaCampos();
            this.carregartipoVendas();
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
    const assuntoExcluir = this.tipoVendas.find(x => x.codTv === this.idExcluir);
    if (assuntoExcluir) {
      this.isLoading = true;

      this.tipoVendaService.delete(this.idExcluir).subscribe(
        (response) => {
          if (response.success) {
            this.limpaCampos();
            this.carregartipoVendas();
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

    const tipoVendaOperacao = this.tipoVendaForm.value;

    if (this.validaDados(tipoVendaOperacao, contentModal)) {
      this.isLoading = true;

      this.tipoVendaService.post(tipoVendaOperacao).subscribe(
        (response) => {
          if (response.success) {
            this.limpaCampos();
            this.carregartipoVendas();
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

  validaDados(tipoVendaOperacao: TipoVenda, contentModal: any): boolean {    
    if (tipoVendaOperacao.descricao === null || tipoVendaOperacao.descricao === undefined || tipoVendaOperacao.descricao == "")
      this.openModal(contentModal, "Validação!!!", "Favor, informe a descrição do tipo de venda!!!", true, false, 0);
    else if (tipoVendaOperacao.descricao.length > 20)
      this.openModal(contentModal, "Validação!!!", "Para a descrição do tipo de venda máximo de 20 caracteres!!!", true, false, 0);
    else if (this.tipoVendas.find(x => x.descricao.toLowerCase() == tipoVendaOperacao.descricao.toLowerCase() && x.codTv != tipoVendaOperacao.codTv && x.ativo))
      this.openModal(contentModal, "Validação!!!", "Tipo de Venda já cadastrado(a)!!!", true, false, 0);
    else if (tipoVendaOperacao.porcentagemDesconto < 0 || tipoVendaOperacao.porcentagemDesconto > 100)
      this.openModal(contentModal, "Validação!!!", "A porcentagem do Desconto deve ser um número de 0 a 100!!!", true, false, 0);
    else if (!this.tipoVendaForm.valid)
      this.openModal(contentModal, "Validação!!!", "Favor, informe os dados do tipo de venda!!!", true, false, 0);

    else return true;
    return false;
  }

  limpaCampos() {
    this.cadastrar = true;
    this.idExcluir = 0;
    this.tipoVendaForm.reset({
      codTv: 0,
      descricao: '',
      ativo: true,
      porcentagemDesconto: 0
    });
  }

  carregartipoVendas() {
    this.isLoading = true;

    this.tipoVendaService.getAll()
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((tipovendas: TipoVenda[]) => {
        this.tipoVendas = tipovendas;
      }, (error: any) => {
        this.isLoading = false;
      }, () => this.isLoading = false
      );
  }
}
