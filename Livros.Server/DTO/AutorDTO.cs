using System;
using System.Collections.Generic;

namespace Livros.Server.DTO;

public partial class AutorDTO
{
    public int CodAu { get; set; }

    public string Nome { get; set; } = null!;

    public bool Ativo { get; set; }

}
