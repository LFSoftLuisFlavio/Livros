import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LivrosService } from '../services/livros.service';
import { TipovendasService } from '../services/tipovendas.service';
import { TipoVenda } from '../models/TipoVenda';
import { FormArray, FormBuilder, FormGroup, NgModel, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Livro } from '../models/Livro';
import { VendaLivro } from '../models/VendaLivro';

@Component({
  selector: 'app-venda',
  templateUrl: './venda.component.html',
  styleUrl: './venda.component.css'
})
export class VendaComponent implements OnInit, OnDestroy {
  private unsubscriber: Subject<void> = new Subject<void>();
  public tipoVendas: TipoVenda[] = [];
  public vendaLivros: VendaLivro[] = [];
  public livros: Livro[] = [];
  public vendaForm!: FormGroup;
  public vendaLivroForm!: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder, private modalService: NgbModal, private livroService: LivrosService,
    private tipoVendaService: TipovendasService) {
    //this.criarForm();
    this.vendaForm = this.fb.group({
      codV: [0],
      dataVenda: [this.getDataAtual(), Validators.required],
      consumidorFinal: ['', Validators.required],
      cliente: [ '', Validators.required],
      ativo: true,
      tipoVendaSelect: [null],
      tipo_Venda_CodTv:'',
      vendaLivro: this.fb.array([]) 
    });

    this.vendaLivroForm = this.fb.group({
      livroSelect: [null],
      quantidade: ['', Validators.required],
      valorUnitario: ['', Validators.required],
      porcentagemDesconto: [{ value: '', disabled: true }],
      valorDesconto: [{ value: '',disabled: true }, Validators.required],
      valorTotal: [{ value: '', disabled: true }, Validators.required],
      ativo:true
    });
  }
  private getDataAtual(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Retorna apenas a parte da data
  }

  ngOnInit() {
    this.carregartipoVendas();
    this.carregarLivros();
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  livroSelecionado() {

    const selecionado = this.vendaLivroForm.value;
    const livroSelecionado = selecionado.livroSelect;

    if (livroSelecionado) {

      this.vendaLivroForm.patchValue({
        valorUnitario: livroSelecionado.valorUnitario
      });
      
    } else {
      this.vendaLivroForm.patchValue({
        valorUnitario: ''
      });
    }
    this.calculaValorTotal();
  }

  calculaValorTotal() {
    var desconto = 0;
    const selecionado = this.vendaForm.value;
    const tipoVendaSelecionado = selecionado.tipoVendaSelect;
    if (tipoVendaSelecionado) {
      desconto = tipoVendaSelecionado.porcentagemDesconto;

      this.vendaLivroForm.patchValue({
        porcentagemDesconto: desconto+" %"
      });
    }

    const infVendaLivro = this.vendaLivroForm.value;
    if (infVendaLivro.quantidade > 0 && infVendaLivro.valorUnitario > 0) {
      var valorDesconto = infVendaLivro.quantidade * infVendaLivro.valorUnitario * desconto / 100;

      var valorTotalLivro = infVendaLivro.quantidade * infVendaLivro.valorUnitario - valorDesconto;

      this.vendaLivroForm.patchValue({
        valorDesconto: valorDesconto.toFixed(2),
        valorTotal: valorTotalLivro.toFixed(2)
      });
    }
    else {
      this.vendaLivroForm.patchValue({
        valorDesconto: '',
        valorTotal: ''
      });
    }
  }
  adicionarLivro() {

    const livroAdd = this.vendaLivroForm.value;
    const arrayLivros = <FormArray>this.vendaForm.get('vendaLivro');

    const vendaLivro: VendaLivro = {
        livro_Codl: livroAdd.livroSelect.codl,
        quantidade: livroAdd.quantidade,
        valorUnitario: livroAdd.valorUnitario,
        valorDesconto: livroAdd.valorDesconto,
        valorTotal: livroAdd.valorTotal,
        livro: livroAdd.livroSelect,
        ativo: true,
        codVl: 0,
        venda_CodV: 0
    };

    arrayLivros.push(this.fb.group(vendaLivro));
    this.vendaLivros.push(vendaLivro);
    this.vendaLivroForm.reset();

  }
  habilitaDesabilitaCliente(value: boolean) {

    const clienteControl = this.vendaForm.get('cliente');

    if (value) {
      clienteControl?.disable();
      this.vendaForm.patchValue({
        cliente: ''
      });
    } else {
      clienteControl?.enable();  
      
    }
  }

  carregartipoVendas() {
    //this.isLoading = true;
    
    this.tipoVendaService.getAll()
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((tipovendas: TipoVenda[]) => {
        this.tipoVendas = tipovendas; 
      }, (error: any) => {
      }
      );
  }
  carregarLivros() {
    this.livroService.getAll()
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((livros: Livro[]) => {
        this.livros = livros;
      }, (error: any) => {
      });
  }

  
}
