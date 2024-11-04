import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AutorComponent } from './autor/autor.component';
import { NavComponent } from './nav/nav.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AssuntoComponent } from './assunto/assunto.component';
import { TipovendaComponent } from './tipovenda/tipovenda.component';
import { VendaComponent } from './venda/venda.component';
import { LivroComponent } from './livro/livro.component';

@NgModule({
  declarations: [
    AppComponent,
    AutorComponent,
    NavComponent,
    AssuntoComponent,
    TipovendaComponent,
    VendaComponent,
    LivroComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    AppRoutingModule, FormsModule,
    ReactiveFormsModule, NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
