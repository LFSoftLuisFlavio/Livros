using Livros.Server.DTO;
using Livros.Server.Models;
using Livros.Server.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Livros.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LivrosController : ControllerBase
    {
        private readonly IRepository _repository;

        public LivrosController(IRepository livroRepository)
        {
            _repository = livroRepository;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var livro =await _repository.GetAllLivrosAsync();
                if (livro == null || livro.Count() == 0)
                {
                    return NotFound("Nenhum livro encontrado.");
                }
                return Ok(livro);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao consultar: {ex.Message}");
            }
        }

        private async Task<(bool Success, string MessagemRetorno)> ValidaDados(LivroDTO livroDto, int id)
        {
            string txtMsgRetorno = "";
            if (string.IsNullOrEmpty(livroDto.Titulo))
                txtMsgRetorno = "Favor, informe o título!!!";
            else if (livroDto.Titulo.Length > 40)
                txtMsgRetorno = "Para o título do livro máximo de 40 caracteres permitidos!!!";
            else if (string.IsNullOrEmpty(livroDto.Editora))
                txtMsgRetorno = "Favor, informe a editora!!!";
            else if (livroDto.Titulo.Length > 40)
                txtMsgRetorno = "Para a editora do livro máximo de 40 caracteres permitidos!!!";
            if (string.IsNullOrEmpty(livroDto.AnoPublicacao))
                txtMsgRetorno = "Favor, informe o título!!!";
            else if (livroDto.AnoPublicacao.Length != 4)
                txtMsgRetorno = "Para o ano de publicação favor informe 4 dígitos!!!";
            else if (livroDto.AutorCodAus.Count == 0)
                txtMsgRetorno = "Favor, informe pelo menos um(a) autor(a)!!!";
            else if (livroDto.AssuntoCodAs.Count == 0)
                txtMsgRetorno = "Favor, informe pelo menos um assunto!!!";
            else if (_repository.Any<Livro>(x => x.Titulo == livroDto.Titulo && x.Codl != id && x.Ativo))
                txtMsgRetorno = "Registro já existente!!!";
            else if (livroDto.ValorUnitario <= 0)
                txtMsgRetorno = "Valor Unitário deve ser maior quer 0!!!";
            else if (livroDto.EstoqueInicial < 0)
                txtMsgRetorno = "Estoque inicial deve ser maior ou igual a 0!!!";
            else
            {
                livroDto.Ativo = true; 
                Livro livro = new Livro();

                if (id > 0)
                    livro = await _repository.GetLivrosByIdWhithFKAsync(id);

                livro.Titulo = livroDto.Titulo;
                livro.Editora = livroDto.Editora;
                livro.AnoPublicacao = livroDto.AnoPublicacao;
                livro.ValorUnitario = livroDto.ValorUnitario;
                livro.EstoqueInicial = livroDto.EstoqueInicial;
                livro.Ativo = livroDto.Ativo;

                if (id == 0)
                {
                    foreach (var assuntoObj in livroDto.AssuntoCodAs)
                    {
                        Assunto objAs = new Assunto();
                        objAs = await _repository.GetByIdAsync<Assunto>(assuntoObj.CodAs);
                        livro.AssuntoCodAs.Add(objAs);
                    }

                    foreach (var autorObj in livroDto.AutorCodAus)
                    {
                        Autor objAu = new Autor();
                        objAu = await _repository.GetByIdAsync<Autor>(autorObj.CodAu);
                        livro.AutorCodAus.Add(objAu);
                    }
                
                    _repository.Add(livro);
                    txtMsgRetorno = "Cadastrado ";
                }
                else
                {

                    List<Assunto> listAssuntosCadastrados = livro.AssuntoCodAs.ToList();
                    foreach (var item in listAssuntosCadastrados.ToList())
                    {
                        if(!livroDto.AssuntoCodAs.Any(x=>x.CodAs==item.CodAs))
                        {
                            livro.AssuntoCodAs.Remove(item);
                        }
                    }

                    foreach (var assuntoObj in livroDto.AssuntoCodAs)
                    {
                        if (!livro.AssuntoCodAs.Any(x => x.CodAs == assuntoObj.CodAs))
                        {
                            Assunto objAs = new Assunto();
                            objAs = await _repository.GetByIdAsync<Assunto>(assuntoObj.CodAs);
                            livro.AssuntoCodAs.Add(objAs);
                        }                        
                    }

                    List<Autor> listAutoresCadastrados = livro.AutorCodAus.ToList();
                    foreach (var item in listAutoresCadastrados.ToList())
                    {
                        if (!livroDto.AutorCodAus.Any(x => x.CodAu == item.CodAu))
                        {
                            livro.AutorCodAus.Remove(item);
                        }
                    }

                    foreach (var autorObj in livroDto.AutorCodAus)
                    {
                        if (!livro.AutorCodAus.Any(x => x.CodAu == autorObj.CodAu))
                        {
                            Autor objAu = new Autor();
                            objAu = await _repository.GetByIdAsync<Autor>(autorObj.CodAu);
                            livro.AutorCodAus.Add(objAu);
                        }
                    }

                    _repository.Update(livro);
                    txtMsgRetorno = "Alterado ";
                }
                var (success, errorMessage) = await _repository.SaveChangesAsync();
                if (success)
                {
                    txtMsgRetorno += "com Sucesso!!!";
                    return (true, txtMsgRetorno);
                }
                else return (false, errorMessage);
            }
            return (false, txtMsgRetorno);
        }

        [HttpPost]
        public async Task<IActionResult> Post(LivroDTO obj)
        {
            try
            {
                var (success, txtMensagem) = await ValidaDados(obj, 0);
                if (success)
                {
                    return Ok(new { success = true, message = txtMensagem });
                }
                return Ok(new { success = false, message = txtMensagem });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = $"Erro: {ex.Message}" });
            }
        }

        [HttpPut("{LivroId}")]
        public async Task<IActionResult> Put(int LivroId, LivroDTO obj)
        {
            try
            {
                var (success, txtMensagem) = await ValidaDados(obj, LivroId);
                if (success)
                {
                    return Ok(new { success = true, message = txtMensagem });
                }
                return Ok(new { success = false, message = txtMensagem });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = $"Erro: {ex.Message}" });
            }
        }

        [HttpDelete("{LivroId}")]
        public async Task<IActionResult> Delete(int LivroId)
        {
            try
            {
                Livro obj = await _repository.GetByIdAsync<Livro>(LivroId);
                if (obj == null) return NotFound();

                obj.Ativo = false;
                _repository.Update(obj);

                var (success, txtMsgRetorno) = await _repository.SaveChangesAsync();
                if (success)
                {
                    txtMsgRetorno = "Excluído com Sucesso!!!";
                    return Ok(new { success = true, message = txtMsgRetorno });
                }
                return BadRequest(new { success = false, message = txtMsgRetorno });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = $"Erro: {ex.Message}" });
            }
        }
    }
}
