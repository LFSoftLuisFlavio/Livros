using Livros.Server.Models;
using Livros.Server.Repository;
using Microsoft.AspNetCore.Mvc;

namespace Livros.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AutorsController : ControllerBase
    {
        private readonly IRepository _repository;

        public AutorsController(IRepository autorRepository)
        {
            _repository = autorRepository;
        }

        [HttpGet("ById/{autorId}")]
        public async Task<IActionResult> GetById(int autorId)
        {
            try
            {
                var autor = await _repository.GetByIdAsync<Autor>(autorId);
                if (autor == null)
                {
                    return NotFound("Autor não encontrado.");
                }
                return Ok(autor);
            }
            catch (Exception)
            {
                return StatusCode(500, "Erro ao processar a solicitação.");
            }
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var autores = _repository.Where<Autor>(x => x.Ativo==true);
                if (autores == null || autores.Count() == 0)
                {
                    return NotFound("Nenhum autor encontrado.");
                }
                return Ok(autores);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao consultar: {ex.Message}");
            }
        }

        private async Task<(bool Success, string MessagemRetorno)> ValidaDados(Autor obj, int id, bool ativo)
        {
            string txtMsgRetorno = "";
            if (ativo && string.IsNullOrEmpty(obj.Nome))
                txtMsgRetorno = "Favor, informe o nome do(a) autor(a)!!!";
            else if (obj.Nome.Length > 40)
                txtMsgRetorno = "Para o nome do(a) autor(a) máximo de 40 caracteres permitidos!!!";
            else if (ativo && _repository.Any<Autor>(x => x.Nome == obj.Nome && x.CodAu != id && x.Ativo))
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
        public async Task<IActionResult> Post(Autor obj)
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

        [HttpPut("{autorId}")]
        public async Task<IActionResult> Put(int autorId, Autor obj)
        {
            try
            {
                var (success, txtMensagem) = await ValidaDados(obj, autorId, true);
                if (success)
                {
                    return Ok(new { success = true, message = txtMensagem });
                }
                return Ok(new { success = false, message = txtMensagem});
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = $"Erro: {ex.Message}" });
            }
        }

        [HttpDelete("{autorId}")]
        public async Task<IActionResult> Delete(int autorId)
        {
            try
            {
                Autor obj = await _repository.GetByIdAsync<Autor>(autorId);
                if (obj == null) return NotFound();

                var (success, txtMensagem) = await ValidaDados(obj, autorId, false);
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
