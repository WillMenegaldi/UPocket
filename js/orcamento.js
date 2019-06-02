
document.querySelector("#modal-orcamento-form-submit").addEventListener("click", function () {
    insertbudgets(document.querySelector(".orcamento-modal-form"));
});

document.querySelector("#btn-close-line-graph").addEventListener("click", function () {
    fechaModalLineGraph();
});


let database = inicializaDB();

function inicializaDB() {
    let database = localStorage.getItem("UPocketDataBase");

    database = !database ? [] : JSON.parse(database);

    return database;
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

    if (valor) {
        let dataset = {
            orcamento: parseFloat(data[0].value),
            categoria: parseInt(data[1].value),
            tipo: "orcamento"
        };

        database.push(dataset);

        localStorage.setItem("UPocketDataBase", JSON.stringify(database));

        return true;
    }
    else {
        return false;
    }
}

function exibeSemOrcamento() {
    let existeOrcamento = [];
    let qntd = 0;
    let check = [0, 0, 0, 0, 0];
    let categoria = [];
    for (i = 0; i < database.length; i++) {
        if (database[i].tipo == "orcamento") {
            existeOrcamento[qntd] = database[i];
            qntd += 1;
        }
    }
    for (i = 0; i < qntd; i++) {
        for (j = 1; j < 6; j++) {
            if (existeOrcamento[i].categoria == j) {
                categoria[j] = existeOrcamento[i].categoria;
            }
        }
    }
    console.log(categoria);
    if (categoria[1]) {
        console.log(categoria[1]);
        if (check[0] == 0) {
            document.getElementById("orcmnt-alimentacao").style.display = 'none';
            document.getElementById("orcmnt-alimentacao").innerHTML = 'Selecione uma categoria';
            console.log(check);
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

function mesExtenso() {
    let calendario = new Date();
    let mesSelecionado = 'abc';
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