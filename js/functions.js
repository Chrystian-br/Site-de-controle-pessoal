$(function(){

    // Abrindo e fechando o menu lateral
    $('.btn-menu').click(function(){
        if($('.sidebar').css('display') == 'block'){
            $('.sidebar').animate({
                'width': '0%',
            }).fadeOut(5);

            $('main > *').animate({
                'left': '5%',
                'width': '90%'
            })

            $('.btn-menu').animate({
                'left':'4%'
            })

        } else if($('.sidebar').css('display') == 'none') {
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

    // Recebendo as informações do formulário, colocando-as no histórico e salvando-as no localStorage
    if(localStorage.listaSalva == undefined || localStorage.listaSalva == 'NaN'){
        var lista = [];
        localStorage.listaSalva = lista;
    } else {
        lista = JSON.parse(localStorage.getItem('listaSalva'));
    }

    function item(valor,desc,tipo){
        this.valor = valor;
        this.desc = desc;
        this.tipo = tipo;
    }

    for(let i = 0; i < lista.length; i++){
        if(lista[i].tipo == 'Crédito'){
            $('tbody').prepend(`<tr style="background-color: darkgreen">
                <td>R$${lista[i].valor}</td>
                <td>${lista[i].tipo}</td>
                <td>${lista[i].desc}</td>
            </tr>`)
        } else if (lista[i].tipo == 'Despesa variável'){
            $('tbody').prepend(`<tr style="background-color: darkorange">
                <td>R$${lista[i].valor}</td>
                <td>${lista[i].tipo}</td>
                <td>${lista[i].desc}</td>
            </tr>`)
        } else if (lista[i].tipo == 'Despesa fixa'){
            $('tbody').prepend(`<tr style="background-color: darkred">
                <td>R$${lista[i].valor}</td>
                <td>${lista[i].tipo}</td>
                <td>${lista[i].desc}</td>
            </tr>`)
        } else if (lista[i].tipo == 'Investido'){
            $('tbody').prepend(`<tr style="background-color: darkblue">
                <td>R$${lista[i].valor}</td>
                <td>${lista[i].tipo}</td>
                <td>${lista[i].desc}</td>
            </tr>`)
        }
    }

    $('input[type=button]').click(function(){

        if($('#entrada-valor').val() == ''){
            alert('por favor, preencha o campo do valor!')
        } else {
            var addItem = new item($('#entrada-valor').val(), $('#entrada-descricao').val(), $('#entrada-tipo').val())
            lista.push(addItem);

            var listaSalva = JSON.stringify(lista);
            localStorage.listaSalva = listaSalva;
        
            if(addItem.tipo == 'Crédito'){
                $('tbody').prepend(`<tr style="background-color: darkgreen">
                    <td>R$${addItem.valor}</td>
                    <td>${addItem.tipo}</td>
                    <td>${addItem.desc}</td>
                </tr>`)
            } else if (addItem.tipo == 'Despesa variável'){
                $('tbody').prepend(`<tr style="background-color: darkorange">
                    <td>R$${addItem.valor}</td>
                    <td>${addItem.tipo}</td>
                    <td>${addItem.desc}</td>
                </tr>`)
            } else if (addItem.tipo == 'Despesa fixa'){
                $('tbody').prepend(`<tr style="background-color: darkred">
                    <td>R$${addItem.valor}</td>
                    <td>${addItem.tipo}</td>
                    <td>${addItem.desc}</td>
                </tr>`)
            } else if (addItem.tipo == 'Investido'){
                $('tbody').prepend(`<tr style="background-color: darkblue">
                    <td>R$${addItem.valor}</td>
                    <td>${addItem.tipo}</td>
                    <td>${addItem.desc}</td>
                </tr>`)
            }
        }
    })

    /*****/
})