using Livros.Server.Models;

namespace Livros.Server.DTO
{
    public class LivroDTO
    {
        public int Codl { get; set; }

        public string Titulo { get; set; } = null!;

        public string Editora { get; set; } = null!;

        public string AnoPublicacao { get; set; } = null!;

        public decimal ValorUnitario { get; set; }

        public int EstoqueInicial { get; set; }

        public bool Ativo { get; set; }


        public virtual List<AssuntoDTO> AssuntoCodAs { get; set; } = new List<AssuntoDTO>();

        public virtual List<AutorDTO> AutorCodAus { get; set; } = new List<AutorDTO>();
    }
}
