using FI.AtividadeEntrevista.BLL;
using WebAtividadeEntrevista.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FI.AtividadeEntrevista.DML;
using FI.WebAtividadeEntrevista.Models;
using AutoMapper;
using FI.WebAtividadeEntrevista.App_Start;
using System.Reflection;

namespace WebAtividadeEntrevista.Controllers
{
    public class ClienteController : Controller
    {
        readonly IMapper mapper = AutoMapperConfig._mapper;

        public ActionResult Index()
        {
            return View();
        }


        public ActionResult Incluir()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Incluir(ClienteModel model)
        {
            BoCliente bo = new BoCliente();

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }

            if (bo.VerificarExistencia(model.Cpf))
            {
                Response.StatusCode = 400;
                return Json("CPF Existente!");
            }

            model.Id = bo.Incluir(new Cliente()
            {
                CEP = model.CEP,
                Cidade = model.Cidade,
                Email = model.Email,
                Estado = model.Estado,
                Logradouro = model.Logradouro,
                Nacionalidade = model.Nacionalidade,
                Nome = model.Nome,
                Sobrenome = model.Sobrenome,
                Telefone = model.Telefone,
                Cpf = model.Cpf
            });

            if (model.Beneficiarios.Count > 0) {
                var boB = new BoBeneficiario();

                foreach (var beneficiario in model.Beneficiarios)
                {
                    boB.Incluir(new Beneficiario()
                    {
                        Nome = beneficiario.Nome,
                        Cpf= beneficiario.Cpf,
                        IdCliente = model.Id
                    });
                }
            }

           
            return Json("Cadastro efetuado com sucesso");
        }

        [HttpPost]
        public JsonResult Alterar(ClienteModel model)
        {
            BoCliente bo = new BoCliente();
       
            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }

            bo.Alterar(new Cliente()
            {
                Id = model.Id,
                CEP = model.CEP,
                Cidade = model.Cidade,
                Email = model.Email,
                Estado = model.Estado,
                Logradouro = model.Logradouro,
                Nacionalidade = model.Nacionalidade,
                Nome = model.Nome,
                Sobrenome = model.Sobrenome,
                Telefone = model.Telefone,
                Cpf = model.Cpf
            });

            var boB = new BoBeneficiario();
            var beneficiarios = boB.ListarByIdCliente(model.Id);

            var modelBeneficiarios = mapper.Map<List<Beneficiario>>(model.Beneficiarios);

            BeneficiariosParaIncluir(modelBeneficiarios, beneficiarios, boB, model.Id);
            BeneficiariosParaRemover(modelBeneficiarios, beneficiarios, boB, model.Id);

            modelBeneficiarios.Where(x => beneficiarios.Any(b => b.Id == x.Id))
                                                                  .ToList()
                                                                  .ForEach(x => boB.Alterar(x));

            return Json("Cadastro alterado com sucesso");
        }

        private void BeneficiariosParaIncluir(List<Beneficiario> beneficiariosNovos, List<Beneficiario> beneficiariosExistentes, BoBeneficiario banco, long clienteId)
        {
            var beneficiariosParaIncluir = beneficiariosNovos.Where(x => !beneficiariosExistentes.Any(b => b.Id == x.Id));

            if (beneficiariosParaIncluir.Any())
            {
                foreach (var beneficiario in beneficiariosParaIncluir)
                {
                    beneficiario.IdCliente = clienteId;
                    banco.Incluir(beneficiario);
                }
            }
        }

        private void BeneficiariosParaRemover(List<Beneficiario> beneficiariosNovos, List<Beneficiario> beneficiariosExistentes, BoBeneficiario banco, long clienteId)
        {
            var beneficiariosParaRemover = beneficiariosExistentes.Where(x => !beneficiariosNovos.Any(b => b.Id == x.Id));

            if (beneficiariosParaRemover.Any())
            {
                foreach (var beneficiario in beneficiariosParaRemover)
                {
                    banco.Excluir(beneficiario.Id);
                }
            }
        }

        [HttpGet]
        public ActionResult Alterar(long id)
        {
            BoCliente bo = new BoCliente();
            Cliente cliente = bo.Consultar(id);
            Models.ClienteModel model = null;

            if (cliente != null)
            {
                model = new ClienteModel()
                {
                    Id = cliente.Id,
                    CEP = cliente.CEP,
                    Cidade = cliente.Cidade,
                    Email = cliente.Email,
                    Estado = cliente.Estado,
                    Logradouro = cliente.Logradouro,
                    Nacionalidade = cliente.Nacionalidade,
                    Nome = cliente.Nome,
                    Sobrenome = cliente.Sobrenome,
                    Telefone = cliente.Telefone,
                    Cpf = cliente.Cpf
                };

                var boB = new BoBeneficiario();
                var beneficiarios = boB.ListarByIdCliente(model.Id);

                if (beneficiarios.Count > 0)
                {
                    model.Beneficiarios = new List<BeneficiarioModel>();
                    foreach (var item in beneficiarios)
                    {
                        model.Beneficiarios.Add(new BeneficiarioModel()
                        {
                            Id = item.Id,
                            Nome = item.Nome,
                            Cpf = item.Cpf,
                            IdCliente = item.IdCliente,
                        });
                    }
                }
            }

            return View(model);
        }

        [HttpPost]
        public JsonResult ClienteList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                int qtd = 0;
                string campo = string.Empty;
                string crescente = string.Empty;
                string[] array = jtSorting.Split(' ');

                if (array.Length > 0)
                    campo = array[0];

                if (array.Length > 1)
                    crescente = array[1];

                List<Cliente> clientes = new BoCliente().Pesquisa(jtStartIndex, jtPageSize, campo, crescente.Equals("ASC", StringComparison.InvariantCultureIgnoreCase), out qtd);

                //Return result to jTable
                return Json(new { Result = "OK", Records = clientes, TotalRecordCount = qtd });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }
    }
}