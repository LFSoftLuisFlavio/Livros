using System;
using System.Collections.Generic;

namespace Livros.Server.Models;

public partial class VendaLivro
{
    public int CodVl { get; set; }

    public int LivroCodl { get; set; }

    public int VendaCodV { get; set; }

    public int Quantidade { get; set; }

    public decimal ValorUnitario { get; set; }

    public decimal ValorDesconto { get; set; }

    public decimal ValorTotal { get; set; }

    public bool Ativo { get; set; }

    public virtual Livro LivroCodlNavigation { get; set; } = null!;

    public virtual Vendum VendaCodVNavigation { get; set; } = null!;
}
