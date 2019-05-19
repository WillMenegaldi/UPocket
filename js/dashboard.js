window.addEventListener('load', atualizaCards);
window.addEventListener('load', atualizaGrafico);

document.querySelector('#grafico-rosquinha').addEventListener("click",function(){
    abreModalGrafico();
});

document.querySelector("#btn-close-graph").addEventListener("click", function(){
    fechaModalGraph();
});

document.querySelector("#add-despesa").addEventListener("click", function(){
    abreModal('despesa');
});

document.querySelector("#add-receita").addEventListener("click", function(){
    abreModal('receita');
});

document.querySelector("#btn-close").addEventListener("click", function(){
    fechaModal();
});

document.querySelector("#modal-form-submit").addEventListener("click", function(){
    insert(document.querySelector(".modal-form"));
});

var database = inicializaDB();

function inicializaDB()
{
    let database = localStorage.getItem("UPocketDataBase");

    database = !database ? [] : JSON.parse(database);

    return database;
}

function insert(dataset)
{
    let valido = datasetMapping(dataset, database);
    if(valido)
    {
        limpaCampos(dataset);
        fechaModal();
        atualizaCards();
        atualizaGrafico();
    }
}

function atualizaCards()
{
    var cardReceita = document.querySelector("#valor-receita");
    var cardDespesa = document.querySelector("#valor-despesa");
    var cardSaldo   = document.querySelector("#valor-saldo");
    
    setaCardReceitas(cardReceita, database);
    setaCardDespesas(cardDespesa, database);
    setaCardSaldoTotal(cardSaldo, cardReceita, cardDespesa);
}

function atualizaGrafico()
{
    let data = retornaDados();
    let total = 0;
    
    let despesas = database.filter(data => data.categoria != null);

    for(var i = 0; i < despesas.length; i++)
    {
        total += despesas[i].valor;
    }

    if(total == 0)
    {
        montaGraficoVazio();
        graficoLinha = document.getElementById('linegraph').getContext('2d');
        controiGraficoOrcamento(graficoLinha);
    }
    else
    {
        preencheGraficos(data);
    }
}

function montaGraficoVazio()
{
    let context = document.getElementById('pizzagraph').getContext('2d');
    let settings = {
        tooltips: {
            enabled: false
        },
        legend: {
            display: true,
            position:'bottom'
        },
        responsive: false,
        cutoutPercentage: 68
    };

    let dados = {
        labels: ["Sem Dados"],
        datasets:[
            {
                borderWidth: 0,
                label: [""],
                data: [1],
                backgroundColor:['#BBB']
            }
        ]
    };

    let grafico = new Chart(context, 
    { 
        type:'doughnut',
        options: settings,
        data: dados
    });

    return grafico;
}

function setaCardReceitas(card, db)
{
    let total = 0;
    let receitas = db.filter(data => data.categoria == null);
    for(var i = 0; i < receitas.length; i++)
    {
        total += receitas[i].valor;
    }
    card.innerHTML = total.toFixed(2).replace(".",",");
}

function setaCardDespesas(card, db)
{
    let total = 0;
    let despesas = db.filter(data => data.categoria != null);

    for(var i = 0; i < despesas.length; i++)
    {
        total += despesas[i].valor;
    }
    card.innerHTML = total.toFixed(2).replace(".",",");
}

function setaCardSaldoTotal(card, receitas, despesas)
{
    card.innerHTML = (parseFloat(receitas.innerHTML) - parseFloat(despesas.innerHTML)).toFixed(2).replace(".",","); 
}

function limpaCampos(campos)
{
    campos[0].value = null;
    campos[1].value = null;
    campos[2].value = null;
    campos[3].value = null;
}

function datasetMapping(data, db)
{
    let valor = validaInsercao(data);

    if(valor)
    {
        let dataset = {
            nome      : data[0].value,
            valor     : parseFloat(data[1].value),
            data      : data[2].value,
            categoria : parseInt(data[3].value) || null
        };
    
        db.push(dataset);
    
        localStorage.setItem("UPocketDataBase", JSON.stringify(db));

        return true;
    }
    else
    {
        return false;
    }
}

function validaInsercao(data)
{
    let valor = parseFloat(data[1].value);

    if(data[0].value && data[1].value && data[2].value)
    {
        if(valor <= 0)
        {
            alert("Deve ser inserido um valor válido.");
            return false;
        }
        else
        {
            return true;
        }
    }
    else
    {
        alert("Todos os campos devem ser preenchidos.");
        return false;
    }
}

function abreModal(card) 
{
    var modal = document.getElementById('container-modal');
    modal.style.display = 'block';

    var headerModal     = document.getElementById("header-box-modal");
    var categoriaModal  = document.getElementById("modal-form-categoria");        
    var enviarModal     = document.getElementById("modal-form-submit");
    var inputModal      = document.getElementsByClassName("modal-form-input");
    var headerTitle     = document.getElementById('header-box-modal-title');
    
    if(card == 'receita') 
    {
        headerTitle.innerHTML                = 'Adicionar Receita';
        headerModal.style.backgroundColor    = 'rgb(21, 76, 10)'; 
        categoriaModal.style.backgroundColor = 'rgb(21, 76, 10)';
        categoriaModal.style.display         = 'none';
        categoriaModal.value                 = null;
        enviarModal.style.backgroundColor    = 'rgb(21, 76, 10)';  

        for(var i = 0; i < inputModal.length; i++)
        {
            inputModal[i].style["border-bottom"] = '3px solid rgb(21, 76, 10)';
            if(i == 0)
            {
                inputModal[i].placeholder = "Descrição da Receita:";  
            }
            else if(i == 1)
            {
                inputModal[i].placeholder = "Valor da Receita:";  
            }
        }
    }
    
    else if(card == 'despesa')
    {
        headerTitle.innerHTML                = 'Adicionar Despesas';        
        categoriaModal.style.display         = 'block';
        headerModal.style.backgroundColor    = 'rgb(153, 36, 42)'; 
        categoriaModal.style.backgroundColor = 'rgb(153, 36, 42)';
        categoriaModal.value                 = 1;
        enviarModal.style.backgroundColor    = 'rgb(153, 36, 42)';

        for(var i = 0; i < inputModal.length; i++)
        {
            inputModal[i].style["border-bottom"] = '3px solid rgb(153, 36, 42)';
          
            if(i == 0)
            {
                inputModal[i].placeholder = "Descrição da Despesa:";  
            }
            else if(i == 1)
            {
                inputModal[i].placeholder = "Valor da Despesa:";  
            }      
        }
    }
    inputModal[0].value = null;
    inputModal[1].value = null;
    inputModal[2].value = new Date().toISOString().slice(0,10);
}

function fechaModal()
{
    var modal = document.getElementById('container-modal');
    var modalGraph=document.getElementById('container-modal-graph');
    
    modal.style.display = 'none';
    modalGraph.style.display='none';
    window.onclick = function()
    {
        if(event.target == modal)
        {
            modal.style.display = 'none';
        }
        else if(event.target == modalGraph)
        {
            modalGraph.style.display='none';
        }
    }
}

function retornaDados()
{   
    data = [];
    
    data.push(retornaTotalCategoria(database, 1));
    data.push(retornaTotalCategoria(database, 2));
    data.push(retornaTotalCategoria(database, 3));
    data.push(retornaTotalCategoria(database, 4));
    data.push(retornaTotalCategoria(database, 5));

    return data;
}

function retornaTotalCategoria(db, categoria) 
{
    let soma = 0
    
    for (x = 0; x < db.length; x++) 
    {
        var database = db[x].categoria == categoria && db[x].valor;
        soma += database;
    }
    
    return soma;
}

function preencheGraficos(data)
{
    let graficoLinha;
    let graficoCategoria;

    graficoLinha = document.getElementById('linegraph').getContext('2d');
    controiGraficoOrcamento(graficoLinha);
    
    graficoCategoria = document.getElementById('pizzagraph').getContext('2d');
    constroiGraficoCategoria(graficoCategoria, data);
}

function controiGraficoOrcamento( ctx )
{
    let graph = new Chart( ctx ,
        {
            type:'line',
            options :{
                responsive:false,
                tooltips: {
                    mode: 'index'
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            fontSize: 9
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontSize: 9
                        }
                    }]
                },
                legend: {
                    display: false,
                    position:'bottom',
                    labels:{                    
                        usePointStyle:true,
                        fontSize: 1,
                        pointStyle:'circle',
                    }
                }
            },
            data: {
                labels: ['Alimentação', 'Roupas', 'Gasolina', 'Lazer', 'Educacao'],
                datasets: [
                    {              
                        pointRadius:2,
                        data: [2000, 1000, 500, 9000, 1000, 400],
                        borderColor:"#0c8e10",
                        backgroundColor:'rgba(32,130,19,0.5)',
                        label: 'Orçamento'
                    },
                    {
                        label:'Gastos',
                        data: [2500, 100, 5000, 1000, 5000, 400],
                        backgroundColor:'rgba(145,33,33,0.4)',
                        borderColor:"#991c09"
                    }                
                ]
            }
    
        });
        return graph;
}

function constroiGraficoCategoria(context, dadosGrafico)
{
    let settings = {
        legend: {
            display: false
        },
        responsive: false,
        cutoutPercentage: 68
    };

    let dados = {
        labels:['Alimentação', 'Transporte', 'Roupas', 'Educação', 'Lazer'],
        datasets:[
            {
                borderWidth: 0.5,
                label:'Categorias',
                data: dadosGrafico,
                backgroundColor:['#006600','#cc00cc','#dd0000','#f4c430','#0000bb']
            }
        ]
    };

    let graficoDespesas = new Chart(context, 
    { 
        type:'doughnut',
        options: settings,
        data: dados
    });

    return graficoDespesas;
}

function insertBoxCategorias(data)
{    
    $('#categorias-lat').html('');

    let categorias = [
        {
            nomeCategoria  : "Alimentação",
            valorCategoria : data[0],
            cor: '#006600'
        },
        {            
            nomeCategoria  : "Transporte",
            valorCategoria : data[1],
            cor: '#cc00cc'
        },
        {            
            nomeCategoria  : "Roupas",
            valorCategoria : data[2],
            cor: '#dd0000'
        },
        {           
            nomeCategoria  : "Educação",
            valorCategoria : data[3],
            cor: '#f4c430'
        },
        {              
            nomeCategoria  : "Lazer",
            valorCategoria : data[4],
            cor: '#0000bb'
        }
    ]

    let j = 0;
    
    for(var i = 0; i < categorias.length; i++)
    {
        if(categorias[i].valorCategoria != 0 )
        {
            let detalheCor;
            let valorTotal = (data[0]+data[1]+data[2]+data[3]+data[4]).toFixed(2);
            let percentualCategoria = ((categorias[i].valorCategoria/valorTotal)*100).toFixed(2);    

            $( '#categorias-lat' ).append( '<div class="box-categoria">  <section class="box-categoria-img"></section><section class="box-categoria-txt">   <div class="box-categoria-info"> <div id="nome-categoria">'+categorias[i].nomeCategoria+'</div> <div id="valor-categoria">'+categorias[i].valorCategoria.toFixed(2)+'</div > </div>  <div class="box-categoria-info percentual"><div>Percentual</div> <div id="percent-categoria">'+percentualCategoria+'% </div></div> </section></div>' );
            detalheCor = document.getElementsByClassName('box-categoria-img');
            detalheCor[j].style["background"] = categorias[i].cor;
            j++;
        }
    }
}
function abreModalGrafico()
{    
    let ctx        = document.getElementById('pizzagraph2').getContext('2d');
    let modalGraph = document.getElementById('container-modal-graph');
    
    let data = retornaDados();
    let total = 0;
    
    let despesas = database.filter(x => x.categoria != null);

    for(var i = 0; i < despesas.length; i++)
    {
        total += despesas[i].valor;
    }

    if(total == 0)
    {
        alert('Não há dados a serem detalhados.');
    }
    else
    {  
        modalGraph.style.display = 'block';

        constroiGraficoCategoria(ctx, data);
        insertBoxCategorias(data);
    }
}

function fechaModalGraph()
{
    let modalGraph           = document.getElementById('container-modal-graph');
    modalGraph.style.display = 'none';

    window.onclick = function()
    {
        if(event.target == modalGraph)
        {
            modalGraph.style.display = 'none';
        }
    }
}
