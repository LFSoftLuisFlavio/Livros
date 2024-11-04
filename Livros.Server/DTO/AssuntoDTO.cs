
using System;
using System.Collections.Generic;

namespace Livros.Server.DTO;

public partial class AssuntoDTO
{
    public int CodAs { get; set; }

    public string Descricao { get; set; } = null!;

    public bool Ativo { get; set; }
}
