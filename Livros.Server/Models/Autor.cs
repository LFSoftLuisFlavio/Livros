using System;
using System.Collections.Generic;

namespace Livros.Server.Models;

public partial class Autor
{
    public int CodAu { get; set; }

    public string Nome { get; set; } = null!;

    public bool Ativo { get; set; }

    public virtual ICollection<Livro> LivroCodls { get; set; } = new List<Livro>();
}
