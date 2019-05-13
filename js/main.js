window.addEventListener('load', atualizaCards);
window.addEventListener('load', atualizaGrafico);

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

document.querySelector('#grafico-rosquinha').addEventListener("click",function(){
    abreModalGrafico();
});

document.querySelector("#btn-close-graph").addEventListener("click", function(){
    fechaModalGraph();
});

function inicializaDB()
{
    let database = localStorage.getItem("UPocketDataBase");

    if(!database)
    {
        database = [];
    }
    else
    {
        database = JSON.parse(database);
    }

    return database;
}

function insert(dataset)
{
    let database = inicializaDB();
    datasetMapping(dataset, database);
    limpaCampos(dataset);    
    fechaModal();
    atualizaCards();
    atualizaGrafico();
}

function atualizaGrafico()
{
    let database = inicializaDB();
    
    data = [];
    
    data.push(retornaTotalCategoria(database, "alimentacao"));
    data.push(retornaTotalCategoria(database, "transporte"));
    data.push(retornaTotalCategoria(database, "roupas"));
    data.push(retornaTotalCategoria(database, "educacao"));
    data.push(retornaTotalCategoria(database, "lazer"));

    graphic(data);
}

function retornaTotalCategoria(db, categoria) {

    let soma = 0
    
    for (x = 0; x < db.length; x++) 
    {
        var database = db[x].categoria == categoria && db[x].valor;
        soma += database;
    }
    
    return soma;
}

function atualizaCards()
{
    var cardReceita = document.querySelector("#valor-receita");
    var cardDespesa = document.querySelector("#valor-despesa");
    var cardSaldo   = document.querySelector("#valor-saldo");
    
    database = inicializaDB();

    setaCardReceitas(cardReceita, database);
    setaCardDespesas(cardDespesa, database);
    setaCardSaldoTotal(cardSaldo, cardReceita, cardDespesa);
}

function setaCardReceitas(card, db)
{
    let total = 0;
    let receitas = db.filter(data => data.categoria == null);
    for(var i = 0; i < receitas.length; i++)
    {
        total += receitas[i].valor;
    }
    card.innerHTML = total.toFixed(2);
}

function setaCardDespesas(card, db)
{
    let total = 0;
    let despesas = db.filter(data => data.categoria != null);

    for(var i = 0; i < despesas.length; i++)
    {
        total += despesas[i].valor;
    }
    card.innerHTML = total.toFixed(2);
}

function setaCardSaldoTotal(card, receitas, despesas)
{
    card.innerHTML = (parseInt(receitas.innerHTML) - parseInt(despesas.innerHTML)).toFixed(2); 
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
    let dataset = {
        nome      : data[0].value,
        valor     : parseInt(data[1].value),
        data      : data[2].value,
        categoria : data[3].value || null
    };

    db.push(dataset);

    localStorage.setItem("UPocketDataBase", JSON.stringify(db));
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

function graphic(data)
{
    let ctx ;
    
    ctx = document.getElementById('linegraph').getContext('2d'); 
    insertGraficoLinhas( ctx );       
    
    context = document.getElementById('pizzagraph').getContext('2d');
    insertGraficoPizza(context, data);
};
function insertGraficoLinhas( ctx )
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

function insertGraficoPizza(ctx, datasetGraphic)
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
                labels:['Alimentação', 'Vestuário' , 'Transporte', 'Lazer', 'Educacao'],
                datasets:[
                    {
                        borderWidth: 0.5,
                        label:'Categorias',
                        data: datasetGraphic,
                        backgroundColor:['#006400','#89a5c4','#8c092a','#099673','#847502']
                    }
                ]
            }
        });
    return graph;
}

function insertBoxCategorias(){
    
    $('#categorias-lat').html(''); 
    for(var i = 0; i < 5 ; i++){
        var nomeCategoria;
        var valorCategoria; 
        var valorTotal;
        var percentualCategoria;       
        var detalheCor;
        let database;
        
        
        database           = inicializaDB();

    
        if( i == 0 )
        {
            nomeCategoria  = "Alimentação";
            valorCategoria = retornaTotalCategoria(database, "alimentacao");
        }
        else if( i == 1 )
        {            
            nomeCategoria   = "Vestuário";
            valorCategoria  = retornaTotalCategoria(database, "roupas");
        }
        else if( i == 2 )
        {            
            nomeCategoria   = "Transporte";
            valorCategoria  = retornaTotalCategoria(database, "transporte");
        }
        else if( i == 3 )
        {           
            nomeCategoria   = "Lazer";
            valorCategoria  = retornaTotalCategoria(database, "lazer");
        }
        else if( i == 4 )
        {           
            nomeCategoria   = "Educacao";
            valorCategoria  = retornaTotalCategoria(database, "educacao");
        }
        
        valorTotal          = (retornaTotalCategoria(database, "alimentacao")+retornaTotalCategoria(database, "roupas")+retornaTotalCategoria(database, "transporte")+retornaTotalCategoria(database, "lazer")+retornaTotalCategoria(database, "educacao")).toFixed(2);
        percentualCategoria = ((valorCategoria/valorTotal)*100).toFixed(2);        
        
        $( '#categorias-lat' ).append( '<div class="box-categoria">  <section class="box-categoria-img"></section><section class="box-categoria-txt">   <div class="box-categoria-info"> <div id="nome-categoria">'+nomeCategoria+'</div> <div id="valor-categoria">'+valorCategoria.toFixed(2)+'</div ></div>  <div class="box-categoria-info percentual"><div>Percentual</div> <div id="percent-categoria">'+percentualCategoria+'% </div></div> </section></div>' );     
        
        detalheCor =  document.getElementsByClassName('box-categoria-img');

        if(i == 0)
        {
            detalheCor[ i ].style["background"] = '#006400';
        }
        else if(i == 1)
        {            
            detalheCor[ i ].style["background"] = '#89a5c4';
        }
        else if(i == 2)
        {            
            detalheCor[ i ].style["background"] = '#8c092a';
        }
        else if(i == 3)
        {           
            detalheCor[ i ].style["background"] = '#099673';
        }
        else if(i == 4)
        {           
            detalheCor[ i ].style["background"] = '#847502';
        }
    }
}

function abreModalGrafico()
{    
    let ctx                   = document.getElementById('pizzagraph2').getContext('2d');
    var modalGraph            = document.getElementById('container-modal-graph');  
    modalGraph.style.display  = 'block';

    insertGraficoPizza(ctx);
    insertBoxCategorias();
}

function fechaModalGraph()
{
    var modalGraph            = document.getElementById('container-modal-graph');
    modalGraph.style.display  = 'none';

    window.onclick = function()
    {
        if(event.target == modalGraph)
        {
            modalGraph.style.display = 'none';
        }
    }
    graphic();
}
