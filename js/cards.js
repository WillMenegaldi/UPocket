
/*Setando ao iniciar */
window.addEventListener('load',atualizaCards );

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
}

function atualizaCards()
{
    var cardReceita = document.querySelector("#valor-receita");
    var cardDespesa = document.querySelector("#valor-despesa");
    var cardSaldo   = document.querySelector("#valor-saldo");
    
    database = JSON.parse(localStorage.UPocketDataBase);

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

    card.innerHTML = total;
}

function setaCardDespesas(card, db)
{
    let total = 0;
    let despesas = db.filter(data => data.categoria != null);

    for(var i = 0; i < despesas.length; i++)
    {
        total += despesas[i].valor;
    }

    card.innerHTML = total;
}

function setaCardSaldoTotal(card, receitas, despesas)
{
    card.innerHTML = (parseInt(receitas.innerHTML) - parseInt(despesas.innerHTML)); 
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
    
    modal.style.display = 'none';
    
    window.onclick = function()
    {
        if(event.target == modal)
        {
            modal.style.display = 'none';
        }
    }
}
