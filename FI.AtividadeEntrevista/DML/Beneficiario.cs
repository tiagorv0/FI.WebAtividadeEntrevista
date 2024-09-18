namespace FI.AtividadeEntrevista.DML
{
    public class Beneficiario
    {
        /// <summary>
        /// Id
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        /// CPF
        /// </summary>
        public string Cpf { get; set; }

        /// <summary>
        /// Nome
        /// </summary>
        public string Nome { get; set; }

        /// <summary>
        /// Id do Cliente
        /// </summary>
        public long IdCliente { get; set; }

        /// <summary>
        /// Id do Cliente
        /// </summary>
        public virtual Cliente Cliente { get; set; }
    }
}
