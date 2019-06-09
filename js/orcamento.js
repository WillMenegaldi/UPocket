window.addEventListener('load', listarOrcamentos);
window.addEventListener('load', mostrarMesAtual);
window.addEventListener('load', preencheCards);

$(document).ready(function() {
    $("#input-orcamento").keyup(function() {
        $("#input-orcamento").val(this.value.match(/[0-9]*/));
    });
});

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
    cardSaldo.innerHTML = 'R$ ' + (totalReceita - totalOrcamento) + ',00';
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

    document.getElementById('mes-anterior').innerHTML = `<img src="assets/back-black-button.png" alt="">`;
    document.getElementById('mes-posterior').innerHTML = `<img src="assets/front-black-button.png" alt="">`;
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
                document.getElementById('mes-anterior').innerHTML = `<img src="assets/front-white-button" alt="">`;            
            } else {
                document.getElementById('mes-anterior').innerHTML = `<img src="assets/back-black-button.png" alt="">`;
                document.getElementById('mes-posterior').innerHTML = `<img src="assets/front-black-button.png" alt="">`;

            }
        }
    } else {
        mes = mesDash + 1;
        if (mes <= 12) {
            mesSelecionado.innerHTML = meses[mes];
            if (mes == 12) {
                document.getElementById('mes-posterior').innerHTML = `<img src="assets/front-white-button" alt="">`;
            } else {
                document.getElementById('mes-anterior').innerHTML = `<img src="assets/back-black-button.png" alt="">`;
                document.getElementById('mes-posterior').innerHTML = `<img src="assets/front-black-button.png" alt="">`;
            }
        }
    }
    listarOrcamentos();
    preencheCards();
}

function listarOrcamentos() {
    let orcamentoMensal = orcamentosDataBase.filter(orcamento => orcamento.mes == mes);
    let catToString = ['','Alimentação','Educação','Lazer','Transporte','Vestuário'];
    let orcamentos = ordenar(orcamentoMensal);
    let id = 0;
    
    $('#orcamento-lat').html('');
    
    for (var i = 0; i < orcamentos.length; i++) {
        $('#orcamento-lat').append(
            `<div> 
                <section id="lista-orcamento"> 
                    <div id="orcamentos" style="display: flex; flex-direction: row"> 
                        <div id="categoria-orcamento${id}">
                            ${catToString[orcamentos[i].idCategoria]} 
                        </div> 
                        <div id="valor-orcamento">
                            R$ ${orcamentos[i].valor.toFixed(2)} 
                        </div>
                        <div id="valor-gasto">R$ 0,00</div> 
                        <div id="box-progresso" style="margin-left: -10%;">
                            <div id="barra-progresso${id}">
                                <script>progressBar()
                                </script>
                            </div>
                        </div>
                        <div id="edit"><img src="assets/editar.webp"></div>
                        <div id="delete" class="del" onclick(crud())>
                            <img src="assets/delete.webp">
                        </div>
                    </div>
                </section> 
            </div>`
            );
        id++;
    }
}

function orcamentoModal() {
    let categoriasInseridas =  orcamentosDataBase.filter( data => data.mes == mes);

    if(categoriasInseridas.length == 5)
    {
        alert("Todos os orçamentos referentes à este mês foram inseridos!");
        return false;
    }else
    {        
        exibeSemOrcamento();
        let modalGraph = document.getElementById('container-modal-graph-line');
        modalGraph.style.display = 'block';
    }
   
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
        `<option id="orcmnt-transporte"  value="2"> Educação  </option>`,
        `<option id="orcmnt-vestuario"   value="3"> Lazer   </option>`,
        `<option id="orcmnt-educacao"    value="4"> Transporte    </option>`,
        `<option id="orcmnt-lazer"       value="5"> Vestuário      </option>`];

        if(categoriasInseridas.length > 0){
        for(let i = 0; i < categoriasInseridas.length; i++)
        {                 
            arrayOrcamento[categoriasInseridas[i].idCategoria-1] = orcamentosDataBase[i].idCategoria;                
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
    let orcamentos = inicializaDB();
    let db = inicializaDashboardDB();

    let despesas = db.filter(x => x.categoria != null);
    let progresso = 0;
    let id = 0;

    let orcamentoMensal = orcamentos.filter(x => x.mes == mes);

    for(i=0; i<orcamentoMensal.length; i++){

        let categoriaDespesa = despesas.filter(x => x.categoria == orcamentoMensal[i].idCategoria);
        categoriaDespesa = categoriaDespesa.filter(x => x.data.split("-")[1]  == mes);

        for(j=0; j<categoriaDespesa.length; j++)
        {
            orcamento = orcamentoMensal[i].valor;
            progresso += (categoriaDespesa[j].valor*100)/(orcamento);
        }
        let barra = ('barra-progresso'+ id).toString();

        if(progresso > 85){
            if(progresso > 100){
                progresso = 100;
            }
            //document.getElementById(barra).style["background-image"] = 'linear-gradient(to-right, #6cf596,#efe946, #ff000094)';
        }

        document.getElementById(barra).style.width = progresso+'%';
        
        progresso = 0;
        id++;
    }
}

function ordenar(vetor){
    let qntd = vetor.length;
    let aux = 0;
    let i = 0;

    while(qntd>1){
        for(i=0;i<qntd-1;i++){
        if(vetor[i].idCategoria >   vetor[i+1].idCategoria){
            aux = vetor[i];
            vetor[i] = vetor[i+1];
            vetor[i+1] = aux;
        }}
        qntd-=1;
    }
    return vetor;
}

function crud(){
    return 0;
}