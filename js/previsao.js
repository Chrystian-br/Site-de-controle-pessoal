$(function(){
    /* Renda Mensal */

    // Salvando a renda mensal
    $(document).on('click','#btn-salario', () => {
        var valorSalario = $('#valor-salario').val();

        localStorage.salario = valorSalario;

        $('.lista-ganhos-mensais tr').html(`
            <td>R$${valorSalario}</td>
            <td><i class="far fa-edit"></i></td>`)

        calcularCarteira();
    })

    // Permitindo a edição da renda mensal
    $(document).on('click','.far.fa-edit', () => {
        $('.lista-ganhos-mensais tr').html(`
        <td><input type="number" min="0" id="valor-salario" placeholder="* Digite sua renda mensal"></td>
        <td><input type="button" id="btn-salario" value="Salvar"></td>`)
        
        $('.lista-ganhos-mensais input[type=number]').val(valorSalario)
    })

    // Carregando a renda mensal caso a página seja recarregada
    if(localStorage.salario != '' && localStorage.salario != undefined && localStorage.salario != 'NaN'){
        valorSalario = localStorage.salario;

        $('.lista-ganhos-mensais tr').html(`
            <td>R$${valorSalario}</td>
            <td><i class="far fa-edit"></i></td>`)
    }

    /*****/

    /* Despesas Mensais */

    // Adicionando item na lista de Despesas Mensais
    if(localStorage.listaDespesa == '' || localStorage.listaDespesa == undefined || localStorage.listaDespesa == 'NaN'){
        var listaDesp = [];
    } else {
        listaDesp = JSON.parse(localStorage.listaDespesa)

        for(let i = 0; i < listaDesp.length; i++){
            $('.lista-despesas-mensais').append(`<tr>
            <td>R$${listaDesp[i].valor}</td>
            <td class="desc">${listaDesp[i].desc}</td>
            <td><i class="fas fa-times"></i></td>
        </tr>`)
        }
    }

    $('#btn-despesa').click(function(){
        var valorDesp = $('#valor-despesa').val();
        var descDesp = $('#descricao-despesa').val();

        listaDesp.push({
            valor: valorDesp,
            desc: descDesp
        })

        localStorage.listaDespesa = JSON.stringify(listaDesp);
        listaDesp = JSON.parse(localStorage.listaDespesa)

        $('.lista-despesas-mensais').append(`<tr>
            <td>R$${valorDesp}</td>
            <td class="desc">${descDesp}</td>
            <td><i class="fas fa-times"></i></td>
        </tr>`)

        calcularCarteira();
    })

    // Removendo um item da lista
    function removerItem(item, lista){
        let itemDesc = item.parent().parent().find('td.desc').text();

        let listaFormatada = lista.filter(function(obj){
            if(obj.desc == itemDesc){
                console.log('sim')
                return false;
            } else {
                console.log('nao')
                return true;
            }
        })
        return listaFormatada;
    }

    $(document).on('click', '.lista-despesas-mensais .fas.fa-times', function(){
        listaDesp = removerItem($(this), listaDesp);
        localStorage.listaDespesa = JSON.stringify(listaDesp);
        $(this).parent().parent().remove();

        calcularCarteira();
    })

    /******/

    /* Previsões */

    // Adicionando itens à lista de previsões
    if(localStorage.listaPrevisao == '' || localStorage.listaPrevisao == 'NaN' || localStorage.listaPrevisao == undefined){
        var listaPrev = [];
    } else {
        listaPrev = JSON.parse(localStorage.listaPrevisao)

        for(let l = 0; l < listaPrev.length; l++){
            $('.lista-previsoes tbody').append(`
        <tr>
            <td>
                <span>R$${listaPrev[l].valor}</span>
                <select class="parcela-select">
                </select>
            </td>
            <td>${listaPrev[l].juros}%</td>
            <td class="desc">${listaPrev[l].desc}</td>
            <td><i class="fas fa-times"></i></td>
        </tr>`)
        }

        for(let o = 1; o <= 24; o++){
            $('.parcela-select').append(`
            <option>${o}x</option>
            `)
        }
    }

    $('#btn-previsao').click(() => {
        var valorPrev = $('#valor-previsao').val();
        var jurosPrev = $('#juros-previsao').val();
        var descPrev = $('#descricao-previsao').val();

        listaPrev.push({
            valor: valorPrev,
            juros: jurosPrev,
            desc: descPrev
        })

        localStorage.listaPrevisao = JSON.stringify(listaPrev);
        listaPrev = JSON.parse(localStorage.listaPrevisao)

        $('.lista-previsoes tbody').append(`
        <tr>
            <td>
                <span>R$${valorPrev}</span>
                <select class="parcela-select">
                </select>
            </td>
            <td>${jurosPrev}%</td>
            <td class="desc">${descPrev}</td>
            <td><i class="fas fa-times"></i></td>
        </tr>`)

        for(let o = 1; o <= 24; o++){
            $('.parcela-select').append(`
            <option>${o}x</option>
            `)
        }

        calcularCarteira();
    })

    // Calculando o valor da compra, com base em quantas vezes será feito
    var listaPrecos = []
    for(let l in listaPrev){
        listaPrecos.push(listaPrev[l].valor)
    }

    function calcularValor(item, lista){
        let itemDesc = item.parent().parent().find('td:nth-of-type(3)').text();
        let vezes = Number(((item.val()).split('x'))[0]);
        
        for(let i = 0; i < lista.length; i++){

            if(lista[i].desc == itemDesc){
                var valor = Number(lista[i].valor)
                var juros = Number(lista[i].juros)

                listaPrecos[i] = valor / vezes

            }  
        }
    
        return ((valor + (valor * (juros/100))) / vezes).toFixed(2)
    }

    $(document).on('change','.parcela-select', function(){
        listaPrev = JSON.parse(localStorage.listaPrevisao);

        $(this).parent().find('span').html(`R$${calcularValor($(this), listaPrev)}`);
        $(this).parent().parent().find('td:nth-of-type(2)').css('text-decoration','none');
        
        calcularCarteira();
    });

    // Removendo item da lista
    $(document).on('click','.lista-previsoes .fas.fa-times', function(){
        listaPrev = removerItem($(this), listaPrev)
        localStorage.listaPrevisao = JSON.stringify(listaPrev);
        $(this).parent().parent().remove();

        calcularCarteira();
    })


    // Calculando a carteira mensal
    calcularCarteira();
    function calcularCarteira(){
        var previsao = 0;

        for(let p in listaPrecos){
            previsao += Number(listaPrecos[p])
        }

        var salario = Number(localStorage.salario);
        var despesa = 0;

        for(let d in listaDesp){
            despesa += Number(listaDesp[d].valor)
        }

        $('#saldo-mensal span').html(`R$${(salario - (despesa + previsao)).toFixed(2)}`)
    }


})