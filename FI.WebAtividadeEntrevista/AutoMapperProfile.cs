using AutoMapper;
using FI.AtividadeEntrevista.DML;
using FI.WebAtividadeEntrevista.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebAtividadeEntrevista.Models;

namespace FI.WebAtividadeEntrevista
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Cliente, ClienteModel>().ReverseMap();
            CreateMap<Beneficiario, BeneficiarioModel>().ReverseMap();
        }
    }
}