window.addEventListener('load', graphic);

var BD = inicializaDB();/*<-------inicializa database na variavel BD*/
var totalAlimentacao = gastoAlimentacao();
var totalGasolina = gastoGasolina();
var totalEscola = gastoEscola();
var totalRoupas = gastoRoupas();
var totalLazer = gastoLazer();

function inicializaDB() /*<---------Função que inicializa o banco de dados*/ {
    let bancoDados = localStorage.getItem("UPocketDataBase");
    if (!bancoDados) {
        bancoDados = [];
    }
    else {
        bancoDados = JSON.parse(bancoDados);
    }
    return bancoDados;
}


function gastoAlimentacao() {
    database = JSON.parse(localStorage.UPocketDataBase);
    db = database;
    var soma = 0
    for (x = 0; x < db.length; x++) {
        var database = db[x].categoria == "alimentacao" && db[x].valor;
        soma += database;
    }
    return soma;
}

function gastoGasolina() {
    database = JSON.parse(localStorage.UPocketDataBase);
    db = database;
    var soma = 0
    for (x = 0; x < db.length; x++) {
        var database = db[x].categoria == "transporte" && db[x].valor;
        soma += database;
    }
    return soma;
}

function gastoRoupas() {
    database = JSON.parse(localStorage.UPocketDataBase);
    db = database;
    var soma = 0
    for (x = 0; x < db.length; x++) {
        var database = db[x].categoria == "roupas" && db[x].valor;
        soma += database;
    }
    return soma;
}
function gastoLazer() {
    database = JSON.parse(localStorage.UPocketDataBase);
    db = database;
    var soma = 0
    for (x = 0; x < db.length; x++) {
        var database = db[x].categoria == "lazer" && db[x].valor;
        soma += database;
    }
    return soma;
}

function gastoEscola() {
    database = JSON.parse(localStorage.UPocketDataBase);
    db = database;
    var soma = 0
    for (x = 0; x < db.length; x++) {
        var database = db[x].categoria == "estudos" && db[x].valor;
        soma += database;
        console.log(database);
    }
    return soma;
}
function graphic()
{
    let ctx ;
    ctx  =  document.getElementById('linegraph').getContext('2d'); 
    insertGraficoLinhas( ctx );       
    ctx  =  document.getElementById('pizzagraph').getContext('2d');
    insertGraficoPizza( ctx );
};
function insertGraficoLinhas( ctx )
{
    let graph = new Chart( ctx ,
        {
            type:'line',
            options :{
                responsive:false,

                /* coloca-se os dois valores */
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
                    /*Setando visibilidade e colocando ele embaixo*/
                    display: false,
                    position:'bottom',
                    labels:{                    
                        /* Ativando o bloco de legenda e colocando como circulo*/
                        usePointStyle:true,
                        fontSize: 1,
                        pointStyle:'circle',
                    }
                }
            },
            data: {
                labels: ['Alimentação', 'Roupas', 'Gasolina', 'Lazer', 'Escola'],
                datasets: [
                    {              
                        /*Aumenta o tamanho da bolinha*/
                        pointRadius:2,
                        data: [2000, 1000, 500, 9000, 1000, 400],
                        borderColor:"#0c8e10",
                        /* Colocando cor de fundo*/
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

function insertGraficoPizza( ctx )
{    
    let graph = new Chart( ctx , 
        {
            type:'doughnut',
            options: {
                legend: {
                    display: false
                },
                responsive: false,
                cutoutPercentage: 67
            },
            data:{
                labels:['Alimentação', 'Roupas', 'Gasolina', 'Lazer', 'Escola'],
                datasets:[
                    {
                        borderWidth: 0.5,
                        label:'Categorias',
                        data: [totalAlimentacao, totalRoupas, totalGasolina, totalLazer, totalEscola],
                        backgroundColor:['#006400','#89a5c4','#8c092a','#099673','#847502']
                    }
                ]
            }
        });
    return graph;
}

/*Abertura e fechamentodo modal do gráfico*/
document.querySelector('#grafico-rosquinha').addEventListener("click",function(){
    abreModalGrafico();
});
document.querySelector("#btn-close-graph").addEventListener("click", function(){
    fechaModalGraph();
});
/*Abrindo e fechando o modal gráfico*/
function abreModalGrafico()
{    
    let ctx                   =   document.getElementById('pizzagraph2').getContext('2d');
    var modalGraph            =   document.getElementById('container-modal-graph');  
    modalGraph.style.display  =  'block';

    insertGraficoPizza(ctx);

    /* Setando os boxs das categorias de acordo com a quantidade*/    
    $('#categorias-lat').html('');   
    for(var i = 0; i <= 3 ; i++){
        var nomeCategoria         =  'Alimentação';
        var imagem                =  '<img width="70%" height="80%" src="assets/icon-green-bag.png" alt="">';
        var nomeCategoria         =  'Alimentação';
        var valorCategoria        =  3000;
        var valorTotal            =  5000;
        var percentualCategoria   =  (valorCategoria/valorTotal)*100;
        
        $( '#categorias-lat' ).append( '<div class="box-categoria">  <section class="box-categoria-img">'+imagem+'</section><section class="box-categoria-txt">   <div class="box-categoria-info"> <div id="nome-categoria">'+nomeCategoria+'</div> <div id="valor-categoria">'+valorCategoria+'</div ></div>  <div class="box-categoria-info percentual"><div>Percentual</div> <div id="percent-categoria">'+percentualCategoria+'% </div></div> </section></div>' );     
    }   
}

function fechaModalGraph()
{
    var modalGraph            =  document.getElementById('container-modal-graph');
    modalGraph.style.display  =  'none';

    window.onclick = function()
    {
        if(event.target == modalGraph)
        {
            modalGraph.style.display  =  'none';
        }
    }
}

