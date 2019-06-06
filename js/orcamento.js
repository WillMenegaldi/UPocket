window.addEventListener('load', listarOrcamentos);
window.addEventListener('load', mostrarMesAtual);
window.addEventListener('load', preencheCards);

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
var cont = 0;

function preencheCards()
{
    let totalOrcamento  = 0;
    let totalReceita    = 0;
    let receitaMensal   = 0;
    let orcamentoMensal = 0;

    let cardReceita = document.querySelector("#orcamento-title-receita");
    let cardDespesa = document.querySelector("#orcamento-title-despesa");
    let cardSaldo   = document.querySelector("#orcamento-title-saldo");

    receitaMensal = database.filter(data => data.categoria == null && data.data.split("-")[1] == mes);
    orcamentoMensal = orcamentosDataBase.filter(orcamento => orcamento.mes == mes);

    for(let i = 0; i < receitaMensal.length; i++)
    {
        totalReceita += receitaMensal[i].valor;
    }

    for(let i = 0; i < orcamentoMensal.length; i++)
    {
        totalOrcamento += orcamentoMensal[i].valor;
    }

    cardReceita.innerHTML = 'R$ ' + totalReceita + ',00';
    cardDespesa.innerHTML = 'R$ ' + totalOrcamento + ',00';
    cardSaldo.innerHTML = 'R$ ' + (receitaMensal - totalOrcamento) + ',00';
}

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
    preencheCards();
}

function listarOrcamentos() {
    let orcamentoMensal = orcamentosDataBase.filter(orcamento => orcamento.mes == mes);
    let catToString = ['','Alimentação','Transporte','Vestuário','Educação','Lazer'];
    
    $('#orcamento-lat').html('');
    
    for (var i = 0; i < orcamentoMensal.length; i++) {
        $('#orcamento-lat').append('<div> <section id="lista-orcamento"> <div id="orcamentos" style="display: flex; flex-direction: row"> <div id="categoria-orcamento">' + catToString[orcamentoMensal[i].idCategoria] + '</div> <div id="valor-orcamento">' + 'R$' + orcamentoMensal[i].valor.toFixed(2) + '</div> <div id="box-progresso"><div id="barra-progresso"><script>progressBar()</script></div></div></div></div>  </section> </div>');
    }
}

function orcamentoModal() {
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
        preencheCards();
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
    let categoriasInseridas =  orcamentosDataBase.filter( data => data.mes == mes);
    let arrayOrcamento      = [0,0,0,0,0]; 
    let vetorSelect         = ["","","","","",""];
    let vetorOptions        = [
        `<option id="orcmnt-alimentacao" value="1"> Alimentação </option>`,
        `<option id="orcmnt-transporte"  value="2"> Transporte  </option>`,
        `<option id="orcmnt-vestuario"   value="3"> Vestuário   </option>`,
        `<option id="orcmnt-educacao"    value="4"> Educação    </option>`,
        `<option id="orcmnt-lazer"       value="5"> Lazer       </option>`];

    if(categoriasInseridas.length > 0){
        for(let i = 0; i < categoriasInseridas.length; i++)
        {                 
            arrayOrcamento[orcamentosDataBase[i].idCategoria-1] = orcamentosDataBase[i].idCategoria;                
        }
    }
    if( arrayOrcamento.filter( data => data != 0).length == 5 ){
        vetorSelect += `<option  value="0" hidden > Todos os orçamentos foram inseridos! </option>` ;
    }else{
        for(let i = 0; i < arrayOrcamento.length; i++){        
            if(arrayOrcamento[i] != " " ){
                vetorSelect[i] += " ";
            }else{
                vetorSelect[i] += vetorOptions[i];
            }             
        }  
    }   
    document.getElementById("modal-form-categoria-orcamento").innerHTML = vetorSelect;       
}

function validaInsercao(data) {
    let categoriasInseridas =  orcamentosDataBase.filter( data => data.mes == mes);
    if (data[0].value <= 0)
    {
        alert("O valor do orçamento deve ser preenchido corretamente!");
        return false;
    }else if(categoriasInseridas.length == 5){
        alert("Todos os orçamentos foram inseridos!");
        return false;
    }else
    {
        let valor = parseFloat(data[0].value); 
        return true;
    }
}

function mesOrcamento(){
    let calendario = new Date();
    let mes = 0;
    mes = calendario.getMonth();
    return mes;
}

function progressBar(){
    let orcamento = orcamentosDataBase;
    let despesas = database;
    let progresso = 0;
    console.log(orcamento);
    for(i=0;i<orcamento.length;i++){
        progresso = orcamento[i].valor;
        progresso = (despesas[i].valor*100)/(progresso);

        if(progresso > 85){
            if(progresso > 100){
                progresso = 100;
            }
            document.getElementById('barra-progresso').style.backgroundImage = 'linear-gradient(to-right, #6cf596,#efe946, #ff000094)';
        }
        
    document.getElementById('barra-progresso').style.width = progresso+'%';//escreve a porcentagem do valor acumulado e coloca a porcentagem
    //não sei, porem acredito que seja alguma variavel, ou indice, ou até mesmo que tenha que criar um elemento separado dessa linha de orçamentos.
    }
}