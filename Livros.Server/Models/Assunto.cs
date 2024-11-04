using System;
using System.Collections.Generic;

namespace Livros.Server.Models;

public partial class Assunto
{
    public int CodAs { get; set; }

    public string Descricao { get; set; } = null!;

    public bool Ativo { get; set; }

    public virtual ICollection<Livro> LivroCodls { get; set; } = new List<Livro>();
}
