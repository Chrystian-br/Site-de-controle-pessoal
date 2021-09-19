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
    } // Fazendo com que a lista seja criada caso não existam transações salvas, mas que mantenha os valores salvos caso já existam.

    function item(valor,desc,tipo,data){
        this.valor = valor;
        this.desc = desc;
        this.tipo = tipo;
        this.data = data;
    }

    for(let i = 0; i < lista.length; i++){ // Colocando todas as transações salvas no localStorage dentro da página, ao abri/atualizar esta.
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
            $('tbody').prepend(`<tr style="background-color: rgba(54, 162, 235, 0.5)">
                <td>R$${lista[i].valor}</td>
                <td>${lista[i].tipo}</td>
                <td>${lista[i].data}</td>
                <td>${lista[i].desc}</td>
            </tr>`)
        }
    }

    $('input[type=button]').click(function(){

        if($('#entrada-valor').val() == '' || $('#entrada-data').val() == ''){
            alert('por favor, preencha os campos obrigatórios!')
        } else {
            var addItem = new item($('#entrada-valor').val(), $('#entrada-descricao').val(), $('#entrada-tipo').val(), $('#entrada-data').val())
            lista.push(addItem);

            var listaSalva = JSON.stringify(lista);
            localStorage.listaSalva = listaSalva;
        
            if(addItem.tipo == 'Crédito'){ // Adicionando as novas transações na página e no localStorage
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
                $('tbody').prepend(`<tr style="background-color: rgba(54, 162, 235, 0.5)">
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

        for(let e in lista){
            if(lista[e].tipo == 'Crédito'){
                resultado = resultado + Number(lista[e].valor);
            } else if(lista[e].tipo == 'Despesa fixa' || lista[e].tipo == 'Despesa variável'){
                resultado = resultado - Number(lista[e].valor);
            } else if(lista[e].tipo == 'Investido'){
                investido = investido + Number(lista[e].valor);
            }
        }

        if(resultado < 0){
            $('#saldo-span').html('-R$'+(resultado * -1)).css('color','red')
        } else if(resultado > 0){
            $('#saldo-span').html('R$'+resultado).css('color','green')
        }

        $('#inv-span').html('R$'+investido).css('color','blue')
        /*****/


        // Adicionando e dinamizando o gráfico no relatório
        var pontos = [];
        var investimento = []
        var dataSplit;

        function addPonto(valor){ // Função para adicionar pontos específicos para cada mês, com a soma de todas as transações mensais
            this.valor = valor;
            this.somaTotal = function(){
                let result = 0;
                for(let b in valor){
                    result = result + Number(valor[b]);
                }
                return result;
            }
        }

        for(let n = 0; n < 12; n++){
            pontos.push(new addPonto([]));
            investimento.push(new addPonto([]));
        }

        for(let d = 0; d < lista.length; d++){
            dataSplit = lista[d].data.split('/')

            if(lista[d].tipo == 'Crédito'){ // Condições para colocar cada valor em seu devido mês
                switch(dataSplit[1]){
                    case '01': pontos[0].valor.push(lista[d].valor);
                    break;
                    case '02': pontos[1].valor.push(lista[d].valor);
                    break;
                    case '03': pontos[2].valor.push(lista[d].valor);
                    break;
                    case '04': pontos[3].valor.push(lista[d].valor);
                    break;
                    case '05': pontos[4].valor.push(lista[d].valor);
                    break;
                    case '06': pontos[5].valor.push(lista[d].valor);
                    break;
                    case '07': pontos[6].valor.push(lista[d].valor);
                    break;
                    case '08': pontos[7].valor.push(lista[d].valor);
                    break;
                    case '09': pontos[8].valor.push(lista[d].valor);
                    break;
                    case '10': pontos[9].valor.push(lista[d].valor);
                    break;
                    case '11': pontos[10].valor.push(lista[d].valor);
                    break;
                    case '12': pontos[11].valor.push(lista[d].valor);
                    break;
                }
            } else if(lista[d].tipo == 'Despesa fixa' || lista[d].tipo == 'Despesa variável'){
                switch(dataSplit[1]){
                    case '01': pontos[0].valor.push(lista[d].valor * (-1));
                    break;
                    case '02': pontos[1].valor.push(lista[d].valor * (-1));
                    break;
                    case '03': pontos[2].valor.push(lista[d].valor * (-1));
                    break;
                    case '04': pontos[3].valor.push(lista[d].valor * (-1));
                    break;
                    case '05': pontos[4].valor.push(lista[d].valor * (-1));
                    break;
                    case '06': pontos[5].valor.push(lista[d].valor * (-1));
                    break;
                    case '07': pontos[6].valor.push(lista[d].valor * (-1));
                    break;
                    case '08': pontos[7].valor.push(lista[d].valor * (-1));
                    break;
                    case '09': pontos[8].valor.push(lista[d].valor * (-1));
                    break;
                    case '10': pontos[9].valor.push(lista[d].valor * (-1));
                    break;
                    case '11': pontos[10].valor.push(lista[d].valor * (-1));
                    break;
                    case '12': pontos[11].valor.push(lista[d].valor * (-1));
                    break;
                }
            } else if(lista[d].tipo == "Investido"){
                switch(dataSplit[1]){
                    case '01': investimento[0].valor.push(lista[d].valor);
                    break;
                    case '02': investimento[1].valor.push(lista[d].valor);
                    break;
                    case '03': investimento[2].valor.push(lista[d].valor);
                    break;
                    case '04': investimento[3].valor.push(lista[d].valor);
                    break;
                    case '05': investimento[4].valor.push(lista[d].valor);
                    break;
                    case '06': investimento[5].valor.push(lista[d].valor);
                    break;
                    case '07': investimento[6].valor.push(lista[d].valor);
                    break;
                    case '08': investimento[7].valor.push(lista[d].valor);
                    break;
                    case '09': investimento[8].valor.push(lista[d].valor);
                    break;
                    case '10': investimento[9].valor.push(lista[d].valor);
                    break;
                    case '11': investimento[10].valor.push(lista[d].valor);
                    break;
                    case '12': investimento[11].valor.push(lista[d].valor);
                    break;
                }
            }
        }

        var pontosCase = []
        var investimentoCase = []
        for(let p in pontos){
            pontosCase.push(pontos[p].somaTotal());
            investimentoCase.push(investimento[p].somaTotal())
        } // Colocando os valores de cada soma das transações mensais em arrays, para aplicá-los no gráfico


        var ctx = $('#grafico');
        var grafico = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
                datasets: [{
                    label: 'Lucro/gasto',
                    data: pontosCase,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 2
                },
                {
                    label: 'Investimento',
                    data: investimentoCase,
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.2)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 2
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