using System;
using System.Collections.Generic;

namespace Livros.Server.Models;

public partial class Livro
{
    public int Codl { get; set; }

    public string Titulo { get; set; } = null!;

    public string Editora { get; set; } = null!;

    public string AnoPublicacao { get; set; } = null!;

    public decimal ValorUnitario { get; set; }

    public int EstoqueInicial { get; set; }

    public bool Ativo { get; set; }

    public virtual ICollection<VendaLivro> VendaLivros { get; set; } = new List<VendaLivro>();

    public virtual ICollection<Assunto> AssuntoCodAs { get; set; } = new List<Assunto>();

    public virtual ICollection<Autor> AutorCodAus { get; set; } = new List<Autor>();
}
