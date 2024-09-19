lstBeneficiarios = [];
$('#formCadastro').submit(function (e) {
    e.preventDefault();

    var cpf = $(this).find("#Cpf").val();

    if (!ValidaCPF(cpf)) {
        ModalDialog("Ocorreu um erro", "Cpf inválido");
        return;
    }

    $.ajax({
        url: urlPost,
        method: "POST",
        data: {
            "Nome": $(this).find("#Nome").val(),
            "CEP": $(this).find("#CEP").val(),
            "Email": $(this).find("#Email").val(),
            "Sobrenome": $(this).find("#Sobrenome").val(),
            "Nacionalidade": $(this).find("#Nacionalidade").val(),
            "Estado": $(this).find("#Estado").val(),
            "Cidade": $(this).find("#Cidade").val(),
            "Logradouro": $(this).find("#Logradouro").val(),
            "Telefone": $(this).find("#Telefone").val(),
            "Cpf": cpf,
            "Beneficiarios": lstBeneficiarios
        },
        error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
        success:
            function (r) {
                ModalDialog("Sucesso!", r)
                $("#formCadastro")[0].reset();
            }
    });
})


const ModalDialog = (titulo, texto) => {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}

const ModalBeneficiarios = () => {
    $('#ModalBeneficiarios').modal('show');
}

const AddBeneficiario = () => {
    var cpf = $('#CpfBeneficiario').val();
    var nome = $('#NomeBeneficiario').val();

    if (!ValidaCPF(cpf)) {
        ModalDialog("Ocorreu um erro", "Cpf inválido");
        return;
    }

    if (document.getElementById(cpf)) {
        ModalDialog("Ocorreu um erro", "Beneficiário com CPF já cadastrado");
        return;
    }

    AddBeneficiarioTable(nome, cpf);

    lstBeneficiarios.push({ "Nome": nome, "Cpf": cpf })

    $('#CpfBeneficiario').val("");
    $('#NomeBeneficiario').val("");
}

const AddBeneficiarioTable = (nome, cpf) => {
    $('#tBodyBeneficiario').append(
        `
        <tr id="${cpf}">
            <td>${cpf}</td>
            <td>${nome}</td>
            <td>
                <button class="btn btn-primary btn-sm alterar">Alterar</button>
                <button class="btn btn-primary btn-sm exclui" type="button">Excluir</button>
            </td>
        </tr>
    `)
}

const SubmitAlterarBeneficiario = () => {
    var cpf = $('#CpfBeneficiario').val();
    var nome = $('#NomeBeneficiario').val();

    for (let i = 0; i < lstBeneficiarios.length; i++) {
        if (lstBeneficiarios[i].Cpf == cpf) {
            lstBeneficiarios[i].Cpf = cpf;
            lstBeneficiarios[i].Nome = nome;
        }
    }

    AddBeneficiarioTable(nome, cpf);

    $('#CpfBeneficiario').val("");
    $('#NomeBeneficiario').val("");
    $('#IncluirBeneficiario').show();
    $('#AlterarBeneficiario').hide();
}

$("#tBodyBeneficiario").on('click', '.alterar', function () {
    var cpf = $(this).closest('tr').attr('id');
    var beneficiario = lstBeneficiarios.find(x => x.Cpf == cpf);

    $('#CpfBeneficiario').val(cpf);
    $('#NomeBeneficiario').val(beneficiario.Nome);

    $(this).closest('tr').remove();

    $('#IncluirBeneficiario').hide();
    $('#AlterarBeneficiario').show();
})

$("#tBodyBeneficiario").on('click', '.exclui', function () {
    var cpf = $(this).closest('tr').attr('id');
    $(this).closest('tr').remove();
    lstBeneficiarios = lstBeneficiarios.filter(x => x.Cpf != cpf);
});

const ValidaCPF = (cpf) => {
    var Soma = 0
    var Resto

    var strCPF = String(cpf).replace(/[^\d]/g, '')

    if (strCPF.length !== 11)
        return false

    if ([
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999',
    ].indexOf(strCPF) !== -1)
        return false

    for (i = 1; i <= 9; i++)
        Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);

    Resto = (Soma * 10) % 11

    if ((Resto == 10) || (Resto == 11))
        Resto = 0

    if (Resto != parseInt(strCPF.substring(9, 10)))
        return false

    Soma = 0

    for (i = 1; i <= 10; i++)
        Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i)

    Resto = (Soma * 10) % 11

    if ((Resto == 10) || (Resto == 11))
        Resto = 0

    if (Resto != parseInt(strCPF.substring(10, 11)))
        return false

    return true
}