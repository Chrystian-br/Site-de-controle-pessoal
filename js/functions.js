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
    if(localStorage.listaSalva == undefined || localStorage.listaSalva == 'NaN' || localStorage.listaSalva == ''){
        var lista = [];
        localStorage.listaSalva = lista;
    } else {
        lista = JSON.parse(localStorage.getItem('listaSalva'));
    }

    function item(valor,desc,tipo,data){
        this.valor = valor;
        this.desc = desc;
        this.tipo = tipo;
        this.data = data;
    }

    for(let i = 0; i < lista.length; i++){
        if(lista[i].tipo == 'Crédito'){
            $('tbody').prepend(`<tr style="background-color: darkgreen">
                <td>R$${lista[i].valor}</td>
                <td>${lista[i].tipo}</td>
                <td>${lista[i].data}</td>
                <td>${lista[i].desc}</td>
            </tr>`)
        } else if (lista[i].tipo == 'Despesa variável'){
            $('tbody').prepend(`<tr style="background-color: darkorange">
                <td>R$${lista[i].valor}</td>
                <td>${lista[i].tipo}</td>
                <td>${lista[i].data}</td>
                <td>${lista[i].desc}</td>
            </tr>`)
        } else if (lista[i].tipo == 'Despesa fixa'){
            $('tbody').prepend(`<tr style="background-color: darkred">
                <td>R$${lista[i].valor}</td>
                <td>${lista[i].tipo}</td>
                <td>${lista[i].data}</td>
                <td>${lista[i].desc}</td>
            </tr>`)
        } else if (lista[i].tipo == 'Investido'){
            $('tbody').prepend(`<tr style="background-color: darkblue">
                <td>R$${lista[i].valor}</td>
                <td>${lista[i].tipo}</td>
                <td>${lista[i].data}</td>
                <td>${lista[i].desc}</td>
            </tr>`)
        }
    }

    $('input[type=button]').click(function(){

        if($('#entrada-valor').val() == ''){
            alert('por favor, preencha o campo do valor!')
        } else {
            var addItem = new item($('#entrada-valor').val(), $('#entrada-descricao').val(), $('#entrada-tipo').val(), $('#entrada-data').val())
            lista.push(addItem);

            var listaSalva = JSON.stringify(lista);
            localStorage.listaSalva = listaSalva;
        
            if(addItem.tipo == 'Crédito'){
                $('tbody').prepend(`<tr style="background-color: darkgreen">
                    <td>R$${addItem.valor}</td>
                    <td>${addItem.tipo}</td>
                    <td>${addItem.data}</td>
                    <td>${addItem.desc}</td>
                </tr>`)
            } else if (addItem.tipo == 'Despesa variável'){
                $('tbody').prepend(`<tr style="background-color: darkorange">
                    <td>R$${addItem.valor}</td>
                    <td>${addItem.tipo}</td>
                    <td>${addItem.data}</td>
                    <td>${addItem.desc}</td>
                </tr>`)
            } else if (addItem.tipo == 'Despesa fixa'){
                $('tbody').prepend(`<tr style="background-color: darkred">
                    <td>R$${addItem.valor}</td>
                    <td>${addItem.tipo}</td>
                    <td>${addItem.data}</td>
                    <td>${addItem.desc}</td>
                </tr>`)
            } else if (addItem.tipo == 'Investido'){
                $('tbody').prepend(`<tr style="background-color: darkblue">
                    <td>R$${addItem.valor}</td>
                    <td>${addItem.tipo}</td>
                    <td>${addItem.data}</td>
                    <td>${addItem.desc}</td>
                </tr>`)
            }
        }
    })

    /*****/

    // Criando o cálculo de lucro / saldo / investimento dinâmico, utilizando as informações de entrada
    if($('header .select').text() == 'Relatório'){
        var resultado = 0;
        var investido = 0;

        for(let e = 0; e < lista.length; e++){
            if(lista[e].tipo == 'Crédito'){
                resultado = resultado + Number(lista[e].valor);
            } else if(lista[e].tipo == 'Despesa fixa' || lista[e].tipo == 'Despesa variável'){
                resultado = resultado - Number(lista[e].valor);
            } else if(lista[e].tipo == 'Investido'){
                investido = investido + Number(lista[e].valor);
            }
        }

        $('#lucro-span').html('R$'+resultado)
        $('#inv-span').html('R$'+investido)
        /*****/

        // Adicionando o gráfico no relatório
        var pontos = [];
        var dias = [];
        var meses = [];
        var valores = [];
        var soma = 0;
        var dataSplit;

        for(let n = 0; n < lista.length; n++){
            dataSplit = (lista[n].data).split('/')
            pontos.push({
                dia: dataSplit[0],
                mes: dataSplit[1]
            })

            // Colocando os valores nos pontos
            if(lista[n].tipo == 'Crédito'){
                soma = soma + Number(lista[n].valor);
            } else if(lista[n].tipo == 'Despesa fixa' || lista[n].tipo == 'Despesa variável'){
                soma = soma - Number(lista[n].valor);
            }
            valores.push(soma);
        }

        function ordenarMeses(){
            for(let m = 0; m < pontos.length; m++){
                meses.push(pontos[m].mes)
            }

            return meses.sort()
        }
        
        var ctx = $('#grafico');
        var grafico = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ordenarMeses(), // Fazer com que organize o array de modo crescente de acordo com os meses e dias
                datasets: [{
                    label: 'Grafico',
                    data: valores,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    /*****/

    
})