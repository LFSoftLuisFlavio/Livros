using FastReport.Export.PdfSimple;
using Livros.Server.DTO;
using Livros.Server.Models;
using Livros.Server.Repository;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Livros.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RelatorioController : Controller
    {
        private readonly IRepository _repository;

        public RelatorioController(IRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("GetRelatorio")]
        public async Task<IActionResult> Index()
        {
            var caminhoReport = Path.Combine(Directory.GetCurrentDirectory(), @"Relatorios\relatorio.frx");
            var reportFile = caminhoReport;

            var freport = new FastReport.Report();
            var listagem = await _repository.GetLivrosDoAutorAsync();

            freport.Dictionary.RegisterBusinessObject(listagem, "lista", 10, true);
            freport.Report.Save(reportFile);



            return Ok("Gerado com Sucesso!!!");
        }

        [HttpGet("GetRelatorioPDF")]
        public async Task<IActionResult> GetRelatorioPdf()
        {
            var caminhoReport = Path.Combine(Directory.GetCurrentDirectory(), @"Relatorios\relatorio.frx");
            var reportFile = caminhoReport;

            var freport = new FastReport.Report();
            var listagem = await _repository.GetLivrosDoAutorAsync();

            freport.Load(reportFile);
            freport.Dictionary.RegisterBusinessObject(listagem, "lista", 10, true);
            freport.Report.Prepare();

            var pdfExport = new PDFSimpleExport();

            using MemoryStream ms = new MemoryStream();
            pdfExport.Export(freport, ms);
            ms.Position = 0; // Reseta a posição do stream para o início

            return File(ms.ToArray(), "application/pdf", "relatorio.pdf");
        }

        //[HttpGet("GetRelatorioPDF")]
        //public async IActionResult GetRelatorioPdf()
        //{
        //    var caminhoReport = Path.Combine(Directory.GetCurrentDirectory(), @"Relatorios\relatorio.frx");
        //    var reportFile = caminhoReport;

        //    var freport = new FastReport.Report();
        //    var listagem = await _repository.GetLivrosDoAutorAsync();

        //    freport.Load(reportFile);
        //    freport.Dictionary.RegisterBusinessObject(listagem, "lista", 10, true);
        //    freport.Report.Prepare();

        //    var pdfExport = new PDFSimpleExport();

        //    using MemoryStream ms = new MemoryStream();
        //    pdfExport.Export(freport, ms);
        //    ms.Flush();

        //    return File(ms.ToArray(), "application/pdf");
        //}
    }
}
