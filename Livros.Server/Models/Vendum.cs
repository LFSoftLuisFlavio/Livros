using System;
using System.Collections.Generic;

namespace Livros.Server.Models;

public partial class Vendum
{
    public int CodV { get; set; }

    public string Cliente { get; set; } = null!;

    public DateTime DataVenda { get; set; }

    public int TipoVendaCodTv { get; set; }

    public bool ConsumidorFinal { get; set; }

    public bool Ativo { get; set; }

    public virtual TipoVendum TipoVendaCodTvNavigation { get; set; } = null!;

    public virtual ICollection<VendaLivro> VendaLivros { get; set; } = new List<VendaLivro>();
}
