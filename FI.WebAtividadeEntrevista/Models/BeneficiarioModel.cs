using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace FI.WebAtividadeEntrevista.Models
{
    public class BeneficiarioModel
    {
        public long Id { get; set; }

        /// <summary>
        /// Nome
        /// </summary>
        [Required]
        public string Nome { get; set; }

        /// <summary>
        /// CPF
        /// </summary>
        [Required]
        [MinLength(11, ErrorMessage = "CPF deve ter 11 dígitos")]
        public string Cpf { get; set; }

        /// <summary>
        /// Id do Cliente
        /// </summary>
        [Required]
        public long IdCliente { get; set; }
    }
}