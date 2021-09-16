$(function(){

    // Abrindo e fechando o menu lateral
    $('.btn-menu').click(function(){
        if($('.sidebar').css('width') > '0px'){
            $('.sidebar').animate({
                'width': '0%',
            }).fadeOut(5);

            $('.btn-menu').animate({
                'left':'2.5%'
            })

            $('main > *').animate({
                'left':'50%'
            })
        } else if($('.sidebar').css('width') == '0px') {
            $('.sidebar').fadeIn(10).animate({
                'width':'20%'
            })

            $('.btn-menu').animate({
                'left':'23%'
            })

            $('main > *').animate({
                'left':'60%'
            })
        }
    })
    /*****/

    // Recebendo as informações do formulário e inserindo-as no localStorage
    $('input[type=button]').click(function(){
        let valor = Number($('#entrada-valor').val());
        let descricao = $('#entrada-descricao').val();
        let tipo = $('#entrada-tipo').val();

        if(tipo == 'investido'){
            $('.investimento p').html(valorInvestido(valor))
        } else {
            $('.lucro p').html(valorLucrado(valor,tipo))
        }
        
    })

    if(localStorage.lucro == undefined){
        localStorage.lucro = 0;
    }

    if(localStorage.investimento == undefined){
        localStorage.investimento = 0;
    } 

    var valorInv = 0;

    function valorInvestido(valor){
        localStorage.investimento = Number(localStorage.investimento) + valor;
        return valorInv += valor;
    }
    
    var valorLucro = 0;

    function valorLucrado(valor,tipo){
        if(tipo == 'credito'){
            localStorage.lucro = Number(localStorage.lucro) + valor;
            return valorLucro += valor;
        } else if(tipo == 'd-fixa' || tipo == "d-variavel"){
            localStorage.lucro = Number(localStorage.lucro) - valor;
            return valorLucro -= valor;
        }

    }
})