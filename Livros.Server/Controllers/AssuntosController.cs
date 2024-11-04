using Livros.Server.Models;
using Livros.Server.Repository;
using Microsoft.AspNetCore.Mvc;

namespace Livros.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssuntosController : ControllerBase
    {
        private readonly IRepository _repository;

        public AssuntosController(IRepository assuntoRepository)
        {
            _repository = assuntoRepository;
        }
        
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            Livro obj = new Livro();
            
            try
            {
                var assuntos = _repository.Where<Assunto>(x => x.Ativo == true);
                if (assuntos == null || assuntos.Count() == 0)
                {
                    return NotFound("Nenhum assunto encontrado.");
                }
                return Ok(assuntos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao consultar: {ex.Message}");
            }
        }

        private async Task<(bool Success, string MessagemRetorno)> ValidaDados(Assunto obj, int id, bool ativo)
        {
            string txtMsgRetorno = "";
            if (ativo && string.IsNullOrEmpty(obj.Descricao))
                txtMsgRetorno = "Favor, informe a descrição do assunto!!!";
            else if (obj.Descricao.Length > 20)
                txtMsgRetorno = "Para a descrição do assunto máximo de 20 caracteres permitidos!!!";
            else if (ativo && _repository.Any<Assunto>(x => x.Descricao == obj.Descricao && x.CodAs != id && x.Ativo))
                txtMsgRetorno = "Registro já existente!!!";
            else
            {
                obj.Ativo = ativo;
                if (id == 0)
                {
                    _repository.Add(obj);
                    txtMsgRetorno = "Cadastrado ";
                }
                else
                {
                    _repository.Update(obj);
                    if (ativo)
                        txtMsgRetorno = "Alterado ";
                    else txtMsgRetorno = "Excluído ";
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
        public async Task<IActionResult> Post(Assunto obj)
        {
            try
            {
                var (success, txtMensagem) = await ValidaDados(obj, 0, true);
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

        [HttpPut("{assuntoId}")]
        public async Task<IActionResult> Put(int assuntoId, Assunto obj)
        {
            try
            {
                var (success, txtMensagem) = await ValidaDados(obj, assuntoId, true);
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

        [HttpDelete("{assuntoId}")]
        public async Task<IActionResult> Delete(int assuntoId)
        {
            try
            {
                Assunto obj = await _repository.GetByIdAsync<Assunto>(assuntoId);
                if (obj == null) return NotFound();

                var (success, txtMensagem) = await ValidaDados(obj, assuntoId, false);
                if (success)
                {
                    return Ok(new { success = true, message = txtMensagem });
                }
                return BadRequest(new { success = false, message = txtMensagem });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = $"Erro: {ex.Message}" });
            }
        }
    }
}
