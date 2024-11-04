import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutorComponent } from './autor/autor.component';
import { AssuntoComponent } from './assunto/assunto.component';
import { TipovendaComponent } from './tipovenda/tipovenda.component';
import { LivroComponent } from './livro/livro.component';
import { VendaComponent } from './venda/venda.component';

const routes: Routes = [
  { path: 'autor', component: AutorComponent },
  { path: 'assunto', component: AssuntoComponent },
  { path: 'tipovenda', component: TipovendaComponent },
  { path: 'venda', component: VendaComponent },
  { path: 'livro', component: LivroComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
