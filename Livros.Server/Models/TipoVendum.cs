using System;
using System.Collections.Generic;

namespace Livros.Server.Models;

public partial class TipoVendum
{
    public int CodTv { get; set; }

    public string Descricao { get; set; } = null!;

    public decimal PorcentagemDesconto { get; set; }

    public bool Ativo { get; set; }

    public virtual ICollection<Vendum> Venda { get; set; } = new List<Vendum>();
}
