window.addEventListener('load', listarOrcamentos);
window.addEventListener('load', mostrarMesAtual);

document.querySelector("#add-orcamento").addEventListener('click', function(){
    orcamentoModal();
})

document.querySelector("#modal-orcamento-form-submit").addEventListener("click", function () {
    insertbudgets(document.querySelector(".orcamento-modal-form"));
});

document.querySelector("#btn-close-line-graph").addEventListener("click", function () {
    fechaModalLineGraph();
});

document.querySelector("#mes-anterior").addEventListener("click", function () {
    selecionarMes(1);
});
document.querySelector("#mes-posterior").addEventListener("click", function () {
    selecionarMes(2);
});

var mes = new Date().getMonth() + 1;
var orcamentosDataBase = inicializaDB();
var database = inicializaDashboardDB();

function inicializaDashboardDB() {
    let database = localStorage.getItem("UPocketDataBase");

    database = !database ? [] : JSON.parse(database);

    return database;
}

function inicializaDB() {
    let orcamentosDataBase = localStorage.getItem("BudgetsDataBase");
    orcamentosDataBase = !orcamentosDataBase ? [] : JSON.parse(orcamentosDataBase);
    
    return orcamentosDataBase;
}

function mostrarMesAtual(){
    let meses = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    document.getElementById('mes-anterior').innerHTML = `<img src="assets/button-mes+.png" alt="">`;
    document.getElementById('mes-posterior').innerHTML = `<img src="assets/button-mes-.png" alt="">`;
    document.getElementById('mes-selecionado').innerHTML = meses[mes];    
}

function selecionarMes(botao) {
    var mesSelecionado = document.getElementById('mes-selecionado');
    let meses = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    let mesDash ;
    for (let i = 1; i < meses.length; i++) {
        if (mesSelecionado.innerHTML == meses[i]) {
            mesDash = i;
        }
    }    
    if (botao == 1) {
        mes = mesDash - 1;
        if (mes > 0) {
            mesSelecionado.innerHTML = meses[mes];
            if (mes == 1) {
                document.getElementById('mes-anterior').innerHTML = `<img src="assets/button-mes-white.png" alt="">`;            
            } else {
                document.getElementById('mes-anterior').innerHTML = `<img src="assets/button-mes+.png" alt="">`;
                document.getElementById('mes-posterior').innerHTML = `<img src="assets/button-mes-.png" alt="">`;

            }
        }
    } else {
        mes = mesDash + 1;
        if (mes <= 12) {
            mesSelecionado.innerHTML = meses[mes];
            if (mes == 12) {
                document.getElementById('mes-posterior').innerHTML = `<img src="assets/button-mes+white.png" alt="">`;
            } else {
                document.getElementById('mes-anterior').innerHTML = `<img src="assets/button-mes+.png" alt="">`;
                document.getElementById('mes-posterior').innerHTML = `<img src="assets/button-mes-.png" alt="">`;
            }
        }
    }

    listarOrcamentos();
}

function listarOrcamentos() {
    let orcamentoMensal = orcamentosDataBase.filter(orcamento => orcamento.mes == mes);
    
    $('#orcamento-lat').html('');
    
    for (var i = 0; i < orcamentoMensal.length; i++) {
        $('#orcamento-lat').append('<div> <section id="lista-orcamento"> <div id="orcamentos" style="display: flex; flex-direction: row"> <div id="categoria-orcamento">' + orcamentoMensal[i].idCategoria + '</div> <div id="valor-orcamento">' + 'R$' + orcamentoMensal[i].valor.toFixed(2) + '</div> <div id="box-progresso"><div id="barra-progresso"></div></div></div></div>  </section> </div>');
    }
}

function orcamentoModal() {
    mesExtenso();
    exibeSemOrcamento();
    let modalGraph = document.getElementById('container-modal-graph-line');
    modalGraph.style.display = 'block';
};

function insertbudgets(dataset) {
    let valido = budgetsMapping(dataset);
    if (valido) {
        fechaModalLineGraph();
        anulaCampos(dataset);
        listarOrcamentos();
    }
}

function fechaModalLineGraph() {
    let modalLineGraph = document.getElementById('container-modal-graph-line');
    modalLineGraph.style.display = 'none';

    window.onclick = function () {
        if (event.target == modalLineGraph) {
            modalLineGraph.style.display = 'none';
        }
    }
}

function anulaCampos(campos) {
    campos[0].value = null;
}

function budgetsMapping(data) {
    let valor = validaInsercao(data);
    let mes = mesOrcamento() + 1;
    if (valor) {
        let dataset = {
            valor: parseFloat(data[0].value),
            idCategoria: parseInt(data[1].value),
            mes: mes,
        };

        orcamentosDataBase.push(dataset);

        localStorage.setItem("BudgetsDataBase", JSON.stringify(orcamentosDataBase));

        return true;
    }
    else {
        return false;
    }
}

function exibeSemOrcamento() {
    let orcamentos = [];
    let qntd = 0;
    let check = [0, 0, 0, 0, 0];
    let categoria = [];

    for (i = 0; i < orcamentosDataBase.length; i++) {
            orcamentos[qntd] = orcamentosDataBase[i];
            qntd += 1;
    }
    
    for (i = 0; i < qntd; i++) {
        for (j = 1; j < 6; j++) {
            if (orcamentos[i].idCategoria == j) {
                categoria[j] = orcamentos[i].idCategoria;
            }
        }
    }
    if (categoria[1]) {
        if (check[0] == 0) {
            document.getElementById("orcmnt-alimentacao").style.display = 'none';
            document.getElementById("orcmnt-alimentacao").innerHTML = 'Selecione uma categoria';
            check[0] = 1;
        }
    }

    if (categoria[2]) {
        if (check[1] == 0) {
            document.getElementById("orcmnt-transporte").style.display = "none";
            document.getElementById("orcmnt-transporte").innerHTML = 'Selecione uma categoria';
            check[1] = 1;
        }
    }
    if (categoria[3]) {
        if (check[2] == 0) {
            document.getElementById("orcmnt-vestuario").style.display = "none";
            document.getElementById("orcmnt-vestuario").innerHTML = 'Selecione uma categoria';
            check[2] = 1;
        }
    }
    if (categoria[4]) {
        if (check[3] == 0) {
            document.getElementById("orcmnt-educacao").style.display = "none";
            document.getElementById("orcmnt-educacao").innerHTML = 'Selecione uma categoria';
            check[3] = 1;
        }
    }
    if (categoria[5]) {
        if (check[4] == 0) {
            document.getElementById("orcmnt-lazer").style.display = "none";
            document.getElementById("orcmnt-lazer").innerHTML = 'Todas as categorias de orçamento para esse mês foi preenchida';
            check[4] = 1;
        }
    }
}

function validaInsercao(data) {
    let valor = parseFloat(data[0].value);

    if (data[0].value && data[1].value > 0) {
        if (valor <= 0) {
            alert("Deve ser inserido um valor válido.");
            return false;
        }
        else {
            return true;
        }
    }
    else if (data[1].value == 0) {
        alert("Por favor insira uma categoria");
        return false;
    }
    else if (valor <= 0) {
        alert("O valor do orçamento deve ser preenchido");
        return false;
    }
}

function mesOrcamento(){
    let calendario = new Date();
    let mes = 0;
    mes = calendario.getMonth();
    return mes;
}

function mesExtenso() {
    let calendario = new Date();
    let mes = calendario.getMonth();
    let ano = calendario.getFullYear();
    let nomeMes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    switch (mes) {
        case 0:
            document.getElementById('header-box-modal-linha').innerHTML = nomeMes[0] + ' ' + "de" + ' ' + ano;
            break;
        case 1:
            document.getElementById('header-box-modal-linha').innerHTML = nomeMes[1] + ' ' + "de" + ' ' + ano;
            break;
        case 2:
            document.getElementById('header-box-modal-linha').innerHTML = nomeMes[2] + ' ' + "de" + ' ' + ano;
            break;
        case 3:
            document.getElementById('header-box-modal-linha').innerHTML = nomeMes[3] + ' ' + "de" + ' ' + ano;
            break;
        case 4:
            document.getElementById('header-box-modal-linha').innerHTML = nomeMes[4] + ' ' + "de" + ' ' + ano;
            break;
        case 5:
            document.getElementById('header-box-modal-linha').innerHTML = nomeMes[5] + ' ' + "de" + ' ' + ano;
            break;
        case 6:
            document.getElementById('header-box-modal-linha').innerHTML = nomeMes[6] + ' ' + "de" + ' ' + ano;
            break;
        case 7:
            document.getElementById('header-box-modal-linha').innerHTML = nomeMes[7] + ' ' + "de" + ' ' + ano;
            break;
        case 8:
            document.getElementById('header-box-modal-linha').innerHTML = nomeMes[8] + ' ' + "de" + ' ' + ano;
            break;
        case 9:
            document.getElementById('header-box-modal-linha').innerHTML = nomeMes[9] + ' ' + "de" + ' ' + ano;
            break;
        case 10:
            document.getElementById('header-box-modal-linha').innerHTML = nomeMes[10] + ' ' + "de" + ' ' + ano;
            break;
        case 11:
            document.getElementById('header-box-modal-linha').innerHTML = nomeMes[11] + ' ' + "de" + ' ' + ano;
            break;
    }
}