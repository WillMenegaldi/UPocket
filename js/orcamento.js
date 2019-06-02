window.addEventListener('load', listarOrcamentos);

var database = inicializaDB();

function inicializaDB() {
    let database = localStorage.getItem("UPocketDataBase");

    database = !database ? [] : JSON.parse(database);

    return database;
}

function listarOrcamentos() {
    $('#orcamento-lat').html('');

    let orcamentos = [
        {
            categoria: "Alimentação",
            orcamento: 1
        },
        {
            categoria: "Transporte",
            orcamento: 2
        },
        {
            categoria: "Roupas",
            orcamento: 3
        }
    ]

    

    for (var i = 0; i < orcamentos.length; i++) {
        $('#orcamento-lat').append('<div> <section> <div style="display: flex; flex-direction: row"> <div>' + orcamentos[i].categoria + '</div> <div>' + 'R$' + orcamentos[i].orcamento.toFixed(2) + '</div > </div> </section> </div>');
    }
}