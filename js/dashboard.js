window.addEventListener('load', atualizaCards);
window.addEventListener('load', atualizaGrafico);

document.querySelector('#grafico-rosquinha').addEventListener("click", function () {
    abreModalGrafico();
});

document.querySelector("#btn-close-graph").addEventListener("click", function () {
    fechaModalGraph();
});

document.querySelector("#add-despesa").addEventListener("click", function () {
    abreModal('despesa');
});

document.querySelector("#add-receita").addEventListener("click", function () {
    abreModal('receita');
});

document.querySelector("#btn-close").addEventListener("click", function () {
    fechaModal();
});
document.querySelector("#btn-close-line-graph").addEventListener("click", function(){
    fechaModal();
});

document.querySelector("#modal-form-submit").addEventListener("click", function () {
    insert(document.querySelector(".modal-form"));
});

document.querySelector("#modal-orcamento-form-submit").addEventListener("click", function () {
    insertbudgets(document.querySelector(".orcamento-modal-form"));
})

document.querySelector("#mes-anterior").addEventListener("click", function () {
    mostraMes(1);
});
document.querySelector("#mes-posterior").addEventListener("click", function () {
    mostraMes(2);
});
document.querySelector('#income-card').addEventListener("click", function () {
    redirectPara('in-movimentacoes', database);
});
document.querySelector('#budget-card', database).addEventListener("click", function () {
    redirectPara('out-movimentacoes');
})
document.querySelector('#grafico-linha').addEventListener("click", function () {
    redirectPara('orcamento');
})
// var que armazena o mês atual como default, e o selecionado
var mes = new Date().getMonth() + 1;

var database = inicializaDB();
function inicializaDB() {
    let database = localStorage.getItem("UPocketDataBase");

    database = !database ? [] : JSON.parse(database);

    return database;
}

function insert(dataset) {
    let valido = datasetMapping(dataset);
    if (valido) {
        limpaCampos(dataset);
        fechaModal();
        atualizaCards();
        atualizaGrafico();
    }
}

function insertbudgets(dataset) {
    let valido = budgetsMapping(dataset);
    if (valido) {
        anulaCampos(dataset);
        fechaModalLineGraph();
    }
}

function atualizaCards() {
    var cardReceita = document.querySelector("#valor-receita");
    var cardDespesa = document.querySelector("#valor-despesa");
    var cardSaldo = document.querySelector("#valor-saldo");

    setaCardReceitas(cardReceita, database);
    setaCardDespesas(cardDespesa, database);
    setaCardSaldoTotal(cardSaldo, cardReceita, cardDespesa);
}

function atualizaGrafico() {
    let data = retornaDados();
    let total = 0;

    let despesas = database.filter(data => data.categoria != null);
    despesas = checkData(despesas, mes);

    for (var i = 0; i < despesas.length; i++) {
        total += despesas[i].valor;
    }

    if (total == 0) {
        montaGraficoVazio();
        graficoLinha = document.getElementById('linegraph').getContext('2d');
        controiGraficoOrcamento(graficoLinha);
    }
    else {
        preencheGraficos(data);
    }
}

function montaGraficoVazio() {
    let context = document.getElementById('pizzagraph').getContext('2d');
    let settings = {
        tooltips: {
            enabled: false
        },
        legend: {
            display: true,
            position: 'bottom'
        },
        responsive: false,
        cutoutPercentage: 68
    };

    let dados = {
        labels: ["Sem Dados"],
        datasets: [
            {
                borderWidth: 0,
                label: [""],
                data: [1],
                backgroundColor: ['#BBB']
            }
        ]
    };

    let grafico = new Chart(context,
        {
            type: 'doughnut',
            options: settings,
            data: dados
        });

    return grafico;
}


function mostraMes(botao) {

    var mesSelecionado = document.getElementById('mes-selecionado');
    let meses = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    if (botao == 1) {
        mes = mesAtual(meses) - 1;
        if (mes > 0) {
            mesSelecionado.innerHTML = meses[mes];
            atualizaCards();
            atualizaGrafico();
            if (mes == 1) {
                document.querySelector("#mes-anterior").style.color = 'rgb(30,30,30,.6)';
            } else {
                document.querySelector("#mes-anterior").style.color = 'rgba(10,10,10,.9)';
            }
        }
    } else {
        mes = mesAtual(meses) + 1;
        if (mes <= 12) {
            mesSelecionado.innerHTML = meses[mes];
            atualizaCards();
            atualizaGrafico();
            if (mes == 12) {
                document.querySelector("#mes-posterior").style.color = 'rgba(30,30,30,.6)';
            } else {
                document.querySelector("#mes-posterior").style.color = 'rgba(10,10,10,.9)';
            }
        }
    }
}
// checando qual mes está o h2 de destaque
function mesAtual(meses) {
    let selected = document.querySelector("#mes-selecionado");
    for (let i = 1; i < meses.length; i++) {
        if (selected.innerHTML == meses[i]) {
            return i;
        }
    }
}
//Filtro o array anterior de acordo com o mes desejado
function checkData(dados, mes) {
    return dados.filter(dados => dados.data.split("-")[1] == mes);
}

function setaCardReceitas(card, db) {
    let total = 0;
    let receitas = db.filter(data => data.categoria == null);
    receitas = checkData(receitas, mes);

    for (var i = 0; i < receitas.length; i++) {
        total += receitas[i].valor;
    }
    card.innerHTML = total.toFixed(2).replace(".", ",");
}

function setaCardDespesas(card, db) {
    let total = 0;
    let despesas = db.filter(data => data.categoria != null);
    despesas = checkData(despesas, mes);

    for (var i = 0; i < despesas.length; i++) {
        total += despesas[i].valor;
    }
    card.innerHTML = total.toFixed(2).replace(".", ",");
}

function setaCardSaldoTotal(card, receitas, despesas) {
    card.innerHTML = (parseFloat(receitas.innerHTML) - parseFloat(despesas.innerHTML)).toFixed(2).replace(".", ",");
}

function limpaCampos(campos) {
    campos[0].value = null;
    campos[1].value = null;
    campos[2].value = null;
    campos[3].value = null;
}

function datasetMapping(data) {
    let valor = validaInsercao(data);

    if (valor) {
        let dataset = {
            nome: data[0].value,
            valor: parseFloat(data[1].value),
            data: data[2].value,
            categoria: parseInt(data[3].value) || null
        };

        database.push(dataset);

        localStorage.setItem("UPocketDataBase", JSON.stringify(database));

        return true;
    }
    else {
        return false;
    }
}

function budgetsMapping(data) {
    let valor = validaInsercao(data);

    if (valor) {
        let dataset = {
            orcamento: data[0].value,
            data: parseFloat(data[1].value),
            categoria: parseInt(data[2].value)
        };
    
    database.push(dataset);

    localStorage.setItem("UPocketDataBase", JSON.stringify(database));

    return true;
    }
    else {
        return false;
    }
}

function validaInsercao(data) {
    let valor = parseFloat(data[1].value);

    if (data[0].value && data[1].value && data[2].value) {
        if (valor <= 0) {
            alert("Deve ser inserido um valor válido.");
            return false;
        }
        else {
            return true;
        }
    }
    else {
        alert("Todos os campos devem ser preenchidos.");
        return false;
    }
}

function abreModal(card) {
    var modal = document.getElementById('container-modal');
    modal.style.display = 'block';

    var headerModal = document.getElementById("header-box-modal");
    var categoriaModal = document.getElementById("modal-form-categoria");
    var enviarModal = document.getElementById("modal-form-submit");
    var inputModal = document.getElementsByClassName("modal-form-input");
    var headerTitle = document.getElementById('header-box-modal-title');

    if (card == 'receita') {
        headerTitle.innerHTML = 'Adicionar Receita';
        headerModal.style.backgroundColor = 'rgb(21, 76, 10)';
        categoriaModal.style.backgroundColor = 'rgb(21, 76, 10)';
        categoriaModal.style.display = 'none';
        categoriaModal.value = null;
        enviarModal.style.backgroundColor = 'rgb(21, 76, 10)';

        for (var i = 0; i < inputModal.length; i++) {
            inputModal[i].style["border-bottom"] = '3px solid rgb(21, 76, 10)';
            if (i == 0) {
                inputModal[i].placeholder = "Descrição da Receita:";
            }
            else if (i == 1) {
                inputModal[i].placeholder = "Valor da Receita:";
            }
        }
    }

    else if (card == 'despesa') {
        headerTitle.innerHTML = 'Adicionar Despesas';
        categoriaModal.style.display = 'block';
        headerModal.style.backgroundColor = 'rgb(153, 36, 42)';
        categoriaModal.style.backgroundColor = 'rgb(153, 36, 42)';
        categoriaModal.value = 1;
        enviarModal.style.backgroundColor = 'rgb(153, 36, 42)';

        for (var i = 0; i < inputModal.length; i++) {
            inputModal[i].style["border-bottom"] = '3px solid rgb(153, 36, 42)';

            if (i == 0) {
                inputModal[i].placeholder = "Descrição da Despesa:";
            }
            else if (i == 1) {
                inputModal[i].placeholder = "Valor da Despesa:";
            }
        }
    }
    inputModal[0].value = null;
    inputModal[1].value = null;
    inputModal[2].value = new Date().toISOString().slice(0, 10);
}

function fechaModal() {
    var modal = document.getElementById('container-modal');
    var modalGraph = document.getElementById('container-modal-graph');
    var modalGraphLine = document.getElementById('container-modal-graph-line');

    modal.style.display = 'none';
    modalGraph.style.display = 'none';
    modalGraphLine.style.display = 'none'
    window.onclick = function () {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
        else if (event.target == modalGraph) {
            modalGraph.style.display = 'none';
        }
        else if (event.targe == modalGraphLine){
            modalGraphLine.style.display = 'none';
        }
    }
}

function retornaDados() {
    data = [];

    data.push(retornaTotalCategoria(database, 1));
    data.push(retornaTotalCategoria(database, 2));
    data.push(retornaTotalCategoria(database, 3));
    data.push(retornaTotalCategoria(database, 4));
    data.push(retornaTotalCategoria(database, 5));

    return data;
}

function retornaTotalCategoria(db, categoria) {
    let soma = 0
    db = checkData(db, mes);

    for (x = 0; x < db.length; x++) {
        var database = db[x].categoria == categoria && db[x].valor;
        soma += database;
    }

    return soma;
}

function redirectPara(pagina, db) {//Lê os dados  do Ls e deixa os separados para serem exibidos posteriormente
    let dados = db;
    let nome = '';
    let valor = '';
    let data = '';
    let categoria = '';
    if (pagina == 'in-movimentacoes') {//caso clique em receita
        dados = dados.filter(data => data.categoria == null);
        for (i=0;i<dados.length;i++){
            nome = dados[i].nome;
            valor = dados[i].valor;
            data = dados[i].data;
        }
    }
    else if (pagina == 'out-movimentacoes') {//caso clique em despesa
        dados = dados.filter(data => data.categoria == !null);
        for(i=0;i<dados.length;i++){
            nome = dados[i].nome;
            valor = dados[i].valor;
            categoria = dador[i].categoria;
            data = dados[i].data;
        }
        window.location.href="#";
    }
    else if (pagina == 'orcamento') {
        window.location.href="orcamento.html";
        document.querySelector("#add-orcamento").addEventListener('onclick',  abreModalOrcamento())
    };
}

function preencheGraficos(data) {
    let graficoLinha;
    let graficoCategoria;

    graficoLinha = document.getElementById('linegraph').getContext('2d');
    controiGraficoOrcamento(graficoLinha);

    graficoCategoria = document.getElementById('pizzagraph').getContext('2d');
    constroiGraficoCategoria(graficoCategoria, data);
}

function controiGraficoOrcamento(ctx) {
    let graph = new Chart(ctx,
        {
            type: 'line',
            options: {
                responsive: false,
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
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        fontSize: 1,
                        pointStyle: 'circle',
                    }
                }
            },
            data: {
                labels: ['Alimentação', 'Roupas', 'Gasolina', 'Lazer', 'Educacao'],
                datasets: [
                    {
                        pointRadius: 2,
                        data: [2000, 1000, 500, 9000, 1000, 400],
                        borderColor: "#0c8e10",
                        backgroundColor: 'rgba(32,130,19,0.5)',
                        label: 'Orçamento'
                    },
                    {
                        label: 'Gastos',
                        data: [2500, 100, 5000, 1000, 5000, 400],
                        backgroundColor: 'rgba(145,33,33,0.4)',
                        borderColor: "#991c09"
                    }
                ]
            }

        });
    return graph;
}

function constroiGraficoCategoria(context, dadosGrafico) {
    let settings = {
        legend: {
            display: false
        },
        responsive: false,
        cutoutPercentage: 68
    };

    let dados = {
        labels: ['Alimentação', 'Transporte', 'Roupas', 'Educação', 'Lazer'],
        datasets: [
            {
                borderWidth: 0.5,
                label: 'Categorias',
                data: dadosGrafico,
                backgroundColor: ['#006600', '#cc00cc', '#dd0000', '#f4c430', '#0000bb']
            }
        ]
    };

    let graficoDespesas = new Chart(context,
        {
            type: 'doughnut',
            options: settings,
            data: dados
        });

    return graficoDespesas;
}

function insertBoxCategorias(data) {
    $('#categorias-lat').html('');

    let categorias = [
        {
            nomeCategoria: "Alimentação",
            valorCategoria: data[0],
            cor: '#006600'
        },
        {
            nomeCategoria: "Transporte",
            valorCategoria: data[1],
            cor: '#cc00cc'
        },
        {
            nomeCategoria: "Roupas",
            valorCategoria: data[2],
            cor: '#dd0000'
        },
        {
            nomeCategoria: "Educação",
            valorCategoria: data[3],
            cor: '#f4c430'
        },
        {
            nomeCategoria: "Lazer",
            valorCategoria: data[4],
            cor: '#0000bb'
        }
    ]

    let j = 0;

    for (var i = 0; i < categorias.length; i++) {
        if (categorias[i].valorCategoria != 0) {
            let detalheCor;
            let valorTotal = (data[0] + data[1] + data[2] + data[3] + data[4]).toFixed(2);
            let percentualCategoria = ((categorias[i].valorCategoria / valorTotal) * 100).toFixed(2);

            $('#categorias-lat').append('<div class="box-categoria">  <section class="box-categoria-img"></section><section class="box-categoria-txt">   <div class="box-categoria-info"> <div id="nome-categoria">' + categorias[i].nomeCategoria + '</div> <div id="valor-categoria">' + 'R$' + categorias[i].valorCategoria.toFixed(2) + '</div > </div>  <div class="box-categoria-info percentual"><div>Percentual</div> <div id="percent-categoria">' + percentualCategoria + '% </div></div> </section></div>');
            detalheCor = document.getElementsByClassName('box-categoria-img');
            detalheCor[j].style["background"] = categorias[i].cor;
            j++;
        }
    }
}
function abreModalGrafico() {
    let ctx = document.getElementById('pizzagraph2').getContext('2d');
    let modalGraph = document.getElementById('container-modal-graph');

    let data = retornaDados();
    let total = 0;

    let despesas = database.filter(x => x.categoria != null);

    for (var i = 0; i < despesas.length; i++) {
        total += despesas[i].valor;
    }

    if (total == 0) {
        alert('Não há dados a serem detalhados.');
    }
    else {
        modalGraph.style.display = 'block';

        constroiGraficoCategoria(ctx, data);
        insertBoxCategorias(data);
    }
}
function abreModalOrcamento(){
    let modalGraph = document.getElementById('container-modal-graph-line');
    modalGraph.style.display = 'block';
    exibeSemOrcamento();
}

function fechaModalGraph() {
    let modalGraph = document.getElementById('container-modal-graph');
    modalGraph.style.display = 'none';

    window.onclick = function () {
        if (event.target == modalGraph) {
            modalGraph.style.display = 'none';
        }
    }
}
function fechaModalLineGraph(){
    let modalLineGraph = document.getElementById('container-modal-graph');
    modalLineGraph.style.display = 'none';

    window.onclick = function(){
        if (event.taget == modalLineGraph) {
            modalLineGraph.style.display = 'none';
        }
    }
}

function exibeSemOrcamento(){
    if(data.categoria[1]){
        document.getElementById("orcmnt-alimentacao").outerHTML = "";
    }

    if(data.categoria[2]){
        document.getElementById("orcmnt-transporte").outerHTML = "";
    }
    
    if(data.categoria[3]){
        document.getElementById("orcmnt-vestuario").outerHTML = "";
    }

    if(data.categoria[4]){
        document.getElementById("orcmnt-educacao").outerHTML = "";
    }
    
    if(data.categoria[5]){
        document.getElementById("orcmnt-lazer").outerHTML = "";
    }
}
