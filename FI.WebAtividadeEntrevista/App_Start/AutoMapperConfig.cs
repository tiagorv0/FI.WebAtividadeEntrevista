using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FI.WebAtividadeEntrevista.App_Start
{
    public static class AutoMapperConfig
    {
        public static IMapper _mapper { get; set; }

        public static void Register()
        {
            var mapperConfig = new MapperConfiguration(
                config =>
                {
                    config.AddProfile<AutoMapperProfile>();
                }
            );

            _mapper = mapperConfig.CreateMapper();
        }
    }
}