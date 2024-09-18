
$(document).ready(function () {
    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        var cpf = $(this).find("#Cpf").val().replace('.', '').replace('-', '');
        if (!validarCPF(cpf)) {

        }
        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "Cpf": cpf,
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
    
})

function ModalDialog(titulo, texto) {
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


$('#Cpf').mask("000.000.000-00", {
    onKeyPress: function (input_value, event, element, options) {
        element.mask(get_mask, options);
    }
});

function validarCPF(input_cpf) {
    if (input_cpf) {
        var input = input_cpf.toString();

        var numeros = [];
        var pesos_A = [10, 9, 8, 7, 6, 5, 4, 3, 2];
        var pesos_B = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
        var sum = 0;
        var x1 = 0;
        var x2 = 0;

        for (var i = 0; i = 2) {
            x1 = 11 - mod;
        }

        sum = 0;
        for (var i = 0; i = 2) {
            x2 = 11 - mod;
        }

        if (x1 == input[9] && x2 == input[10]) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};