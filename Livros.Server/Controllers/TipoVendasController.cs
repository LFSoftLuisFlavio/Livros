using Livros.Server.Models;
using Livros.Server.Repository;
using Microsoft.AspNetCore.Mvc;

namespace Livros.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TipoVendasController : ControllerBase
    {
        private readonly IRepository _repository;

        public TipoVendasController(IRepository tipoVendaRepository)
        {
            _repository = tipoVendaRepository;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var tipoVenda = _repository.Where<TipoVendum>(x => x.Ativo == true);
                if (tipoVenda == null || tipoVenda.Count() == 0)
                {
                    return NotFound("Nenhum tipo de venda encontrado.");
                }
                return Ok(tipoVenda);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao consultar: {ex.Message}");
            }
        }

        private async Task<(bool Success, string MessagemRetorno)> ValidaDados(TipoVendum obj, int id, bool ativo)
        {
            string txtMsgRetorno = "";
            if (ativo && string.IsNullOrEmpty(obj.Descricao))
                txtMsgRetorno = "Favor, informe a descrição do tipo de venda!!!";
            else if (obj.Descricao.Length > 20)
                txtMsgRetorno = "Para a descrição do tipo de venda máximo de 20 caracteres permitidos!!!";
            else if (ativo && _repository.Any<TipoVendum>(x => x.Descricao == obj.Descricao && x.CodTv != id && x.Ativo))
                txtMsgRetorno = "Registro já existente!!!";
            else if (ativo && obj.PorcentagemDesconto < 0 || obj.PorcentagemDesconto>100)
                txtMsgRetorno = "A porcentagem do Desconto deve ser um número de 0 a 100!!!";
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
        public async Task<IActionResult> Post(TipoVendum obj)
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

        [HttpPut("{TipoVendumId}")]
        public async Task<IActionResult> Put(int TipoVendumId, TipoVendum obj)
        {
            try
            {
                var (success, txtMensagem) = await ValidaDados(obj, TipoVendumId, true);
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

        [HttpDelete("{TipoVendumId}")]
        public async Task<IActionResult> Delete(int TipoVendumId)
        {
            try
            {
                TipoVendum obj = await _repository.GetByIdAsync<TipoVendum>(TipoVendumId);
                if (obj == null) return NotFound();

                var (success, txtMensagem) = await ValidaDados(obj, TipoVendumId, false);
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
