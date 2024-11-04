import { Component } from '@angular/core';
import { RelatoriosService } from '../services/relatorios.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {

  constructor(private relatoriosService: RelatoriosService) {

  }

  baixarAcervo() {
    this.relatoriosService.getRelatorioPdf().subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'relatorio.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Erro ao baixar o relatório', error);
    });
  }
}
