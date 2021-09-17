$(function(){

    // Abrindo e fechando o menu lateral
    $('.btn-menu').click(function(){
        if($('.sidebar').css('width') > '0px'){
            $('.sidebar').animate({
                'width': '0%',
            }).fadeOut(5);

            $('main > *').animate({
                'left': '5%',
                'width': '90%'
            })

            $('.btn-menu').animate({
                'left':'2.5%'
            })

        } else if($('.sidebar').css('width') == '0px') {
            $('.sidebar').fadeIn(10).animate({
                'width':'20%'
            })

            $('main > *').animate({
                'left': '20%',
                'width':'82.5%'
            })

            $('.btn-menu').animate({
                'left':'23%'
            })

        }
    })
    /*****/

    // Recebendo as informações do formulário e colocando-as no histórico
    function item(valor,desc,tipo){
        this.valor = valor;
        this.desc = desc;
        this.tipo = tipo;
    }

    $('input[type=button]').click(function(){
        var addItem = new item($('#entrada-valor').val(), $('#entrada-descricao').val(), $('#entrada-tipo').val())

        if(addItem.tipo == 'Crédito'){
            $('tbody').prepend(`<tr style="background-color: green">
                <td>R$${addItem.valor}</td>
                <td>${addItem.tipo}</td>
                <td>${addItem.desc}</td>
            </tr>`)
        } else if (addItem.tipo == 'Despesa variável'){
            $('tbody').prepend(`<tr style="background-color: red">
                <td>R$${addItem.valor}</td>
                <td>${addItem.tipo}</td>
                <td>${addItem.desc}</td>
            </tr>`)
        } else if (addItem.tipo == 'Despesa fixa'){
            $('tbody').prepend(`<tr style="background-color: orange">
                <td>R$${addItem.valor}</td>
                <td>${addItem.tipo}</td>
                <td>${addItem.desc}</td>
            </tr>`)
        } else if (addItem.tipo == 'Investido'){
            $('tbody').prepend(`<tr style="background-color: blue">
                <td>R$${addItem.valor}</td>
                <td>${addItem.tipo}</td>
                <td>${addItem.desc}</td>
            </tr>`)
        }
    })
})