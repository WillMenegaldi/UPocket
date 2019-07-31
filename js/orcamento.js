window.addEventListener('load', listarOrcamentos);
window.addEventListener('load', mostrarMesAtual);
window.addEventListener('load', preencheCards);

document.querySelector("#add-orcamento").addEventListener('click', function(){
    orcamentoModal();
});

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
var pos;
document.addEventListener('click', function(x){detectarID(x)});



function preencheCards()
{
    let database = inicializaDashboardDB();
    let orcamentosDataBase = inicializaDB();
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

    cardReceita.innerHTML = formatMoney(totalReceita, 2) ;
    cardDespesa.innerHTML = formatMoney(totalOrcamento, 2);
    cardSaldo.innerHTML   = formatMoney((totalReceita - totalOrcamento), 2);
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
                document.getElementById('mes-anterior').innerHTML = `<img src="assets/back-white-button.png" alt="">`;            
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
                document.getElementById('mes-posterior').innerHTML = `<img src="assets/front-white-button.png" alt="">`;
            } else {
                document.getElementById('mes-anterior').innerHTML = `<img src="assets/back-black-button.png" alt="">`;
                document.getElementById('mes-posterior').innerHTML = `<img src="assets/front-black-button.png" alt="">`;
            }
        }
    }
    listarOrcamentos();
    preencheCards();
}


function retornaTotalCategoria( categoria) {
    let database = inicializaDashboardDB(); 
    let soma = 0;
    let db = database.filter(data =>  data.data.split("-")[1] == mes);

    for (x = 0; x < db.length; x++) {
        var data = db[x].categoria == categoria && db[x].valor;
        soma += data;
    }
    return soma;
}

function listarOrcamentos() {
    let orcamentosDataBase = inicializaDB();
    let orcamentoMensal = orcamentosDataBase.filter(orcamento => orcamento.mes == mes);
    let catToString = ['','Alimentação','Educação','Lazer','Transporte','Vestuário'];
    let orcamentos = ordenar(orcamentoMensal);
    let id = 0;
    
    $('#orcamento-lat').html('');
    
    for (var i = 0; i < orcamentos.length; i++) {
        if(orcamentos[i].idOrcamento != -1){
            $('#orcamento-lat').append(
                `<div> 
                    <section id="lista-orcamento"> 
                        <div id="orcamentos" style="display: flex; flex-direction: row; margin-bottom: 3%;"> 
                            <div id="categoria-orcamento" style="max-width:125px; width:125px; margin-left: 3%">
                                ${catToString[orcamentos[i].idCategoria]} 
                            </div> 
                            <div id="valor-orcamento">
                                ${formatMoney(orcamentos[i].valor, 2)} 
                            </div>
                            <div id="valor-gasto${id}" style="max-width:125px; width:125px">
                                ${formatMoney(retornaTotalCategoria(orcamentos[i].idCategoria), 2)} 
                            </div> 
                            <div id="box-progresso" style="margin-left: -10%;">
                            <div id="barra-progresso${id}">
                                <script>progressBar()
                                </script>
                            </div>
                        </div>
                        <div  class="edit"><img src="assets/editar.webp" id="${orcamentos[i].idOrcamento}" class="edit"></div>
                        <div  class="del">
                            <img src="assets/delete.webp" id="${orcamentos[i].idOrcamento}" class="del">
                        </div>
                    </div>
                </section> 
            </div>`
            );
            id++;
        }
    }
 
}

function orcamentoModal() {
    let orcamentosDataBase = inicializaDB();
    let categoriasInseridas =  orcamentosDataBase.filter( data => data.mes == mes);
    let i;
    let del = 0;

    if( categoriasInseridas.length > 0 ){
        for( i=0; i < categoriasInseridas.length; i++ ){

            if( categoriasInseridas[i].idOrcamento == -1 ){
                break;
            }
        }
    }
    if( i != categoriasInseridas.length -1 ){
        del = 1;
    }

    if(categoriasInseridas.length == 5 && del == 0)
    {
        alert("Todos os orçamentos referentes à este mês foram inseridos!");
        return false;
    }else
    {        
        exibeSemOrcamento();
        let modalGraph = document.getElementById('container-modal-graph-line');
        let submitEdit = document.getElementById('modal-orcamento-form-submit-edit');
        let submitNew  = document.getElementById('modal-orcamento-form-submit');
        submitNew.style.display  = 'block';
        submitEdit.style.display = 'none';
        modalGraph.style.display = 'block';
    }

    $('#input-orcamento').mask('#.##0,00', { reverse: true });
   
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
    let orcamentosDataBase = inicializaDB();
    let valor = validaInsercao(data);
    let dataset;
    if (valor) {
            dataset = {
                idOrcamento: createNewID(),
                valor: formatMoney(data[0].value, 1),
                idCategoria: parseInt(data[1].value),
                mes: mes
            };

        let indice = searchDeleted();

        if(indice == -1 ){

        orcamentosDataBase.push(dataset);
        }
        else{
            orcamentosDataBase[indice].idOrcamento = dataset.idOrcamento;
            orcamentosDataBase[indice].valor = dataset.valor;
            orcamentosDataBase[indice].idCategoria = dataset.idCategoria;
            orcamentosDataBase[indice].mes = dataset.mes
        }

        localStorage.setItem("BudgetsDataBase", JSON.stringify(orcamentosDataBase));

        return true;
    }
    else {
        return false;
    }
}


function exibeSemOrcamento() {
    let orcamentosDataBase = inicializaDB();
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
            arrayOrcamento[categoriasInseridas[i].idCategoria-1] = categoriasInseridas[i].idCategoria;                
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
    let orcamentosDataBase = inicializaDB();
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
    let progresso = 0;
    let id = 0;

    let orcamentoMensal = orcamentos.filter(x => x.mes == mes);
    orcamentoMensal     = ordenar(orcamentoMensal);

    for(i=0; i < orcamentoMensal.length; i++){
        orcamento = orcamentoMensal[i].valor;

        if(orcamentoMensal[i].idCategoria != 0 && orcamentoMensal[i].idOrcamento != -1){

            progresso = (retornaTotalCategoria(orcamentoMensal[i].idCategoria)*100)/(orcamento);

            let barra = ('barra-progresso'+ id).toString();

            document.getElementById(barra).innerHTML = '<div class="porcentagem">'+progresso.toFixed(2)+'%</div>';
    
            if(progresso > 59){
                document.getElementById(barra).style.backgroundColor = '#fbf390';
            }
    
            if(progresso > 79){
                document.getElementById(barra).style.backgroundColor = '#ff7734';
            }
    
            if(progresso > 89){
                if(progresso > 100){
                    progresso = 100;
                }
                document.getElementById(barra).style.backgroundColor = '#f55b5b';
            }
            document.getElementById(barra).style.width = progresso+'%';
            
            progresso = 0;
            id += 1;
        }

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

function detectarID(x){
    let localId = x.target.id;
    localId = localId.replace(/\D/g,'');
    localId = parseInt(localId);
    if (isNaN(localId)) {
        return 0;
    }
    else if (typeof localId == "number") {

        let estrutura = {
                funcao: x.target.className
            }
        if(estrutura.funcao == "del"){
            crud(1, localId);
        }
        else{
            crud(2,localId);
        }

    }
}

function crud(op, id){
    
    if(op == 1){
        deleteBudget(id);
    }
    else{
        editBudget(id);
    }
}

function deleteBudget(id){
    let db = inicializaDB();
    let i;
    for(i=0; id != db[i].idOrcamento; i++){};
    db[i].idOrcamento = -1;
    db[i].valor = 0;
    db[i].idCategoria = 0;

    localStorage.setItem("BudgetsDataBase", JSON.stringify(db));
    listarOrcamentos();
    preencheCards();
}

function searchDeleted(){
    let db = inicializaDB();
    let i;
    for(i= 0; i < db.length; i++){
        if(db[i].idOrcamento == -1){
            return i;
        }
    }
    return -1;
}

function editBudget(id){
    let db = inicializaDB();
    let i;
    let data;
    for(i=0; id != db[i].idOrcamento; i++){};
    editBudgetModal(db[i].idCategoria);
    pos = i;
    document.querySelector("#modal-orcamento-form-submit-edit").addEventListener("click", function () {

        data = document.querySelector(".orcamento-modal-form");

        let valor = formatMoney(data[0].value, 1);
        let valid = check(valor);
        let db = inicializaDB();

        if (valid){        
            db[pos].valor = valor;
            localStorage.setItem("BudgetsDataBase", JSON.stringify(db));
            fechaModalLineGraph();
            anulaCampos(data);
            listarOrcamentos();
            preencheCards();            
        }
    });
}

function editBudgetModal(idCat){
    let modalGraph = document.getElementById('container-modal-graph-line');
    let submitNew = document.getElementById('modal-orcamento-form-submit');
    let submitEdit  = document.getElementById('modal-orcamento-form-submit-edit');
    submitNew.style.display  = 'none';
    submitEdit.style.display =  'block';
    modalGraph.style.display = 'block';
    let vetorOptions         = [
        `<option id="orcmnt-alimentacao" value="1"> Alimentação </option>`,
        `<option id="orcmnt-educacao"  value="2"> Educação  </option>`,
        `<option id="orcmnt-lazer"   value="3"> Lazer   </option>`,
        `<option id="orcmnt-transporte"    value="4"> Transporte    </option>`,
        `<option id="orcmnt-vestuario"       value="5"> Vestuário      </option>`];
    document.getElementById("modal-form-categoria-orcamento").innerHTML = vetorOptions[idCat-1];
    document.getElementById("header-box-modal-linha").innerHTML = "Editar orçamento";
    $('#input-orcamento').mask('#.##0,00', { reverse: true });
}

function createNewID(){
    let db = inicializaDB();
    let i;
    let tam = db.length;
    let id = 1;
    if(tam >= 1 && db[0].idOrcamento != -1){
        if(tam == 1){
            id += 1
            return id;
        }
        else{
            let greater = db[tam-1].idOrcamento

            for (i = 1 ; db[i].idOrcamento < tam ;i++) {
                if(greater < db[i].idOrcamento){

                    greater = db[i].idOrcamento

                }
                else if(db[i].idOrcamento == -1){
                    i = i+1
                    return i;
                }
            }
            greater += 1;
            return greater;

        }
    }
    else{
        return 1;
    }
}

function check(valor){        
    if (valor <= 0)
    {
        alert("O valor do orçamento deve ser preenchido corretamente!");
        return false;
    }
    else{
        return valor;
    }
}

function formatMoney(strMoney, action) {
    let moldeMoney;
    if (action == 1) 
    {
        let reais, moedas, parte1, parte2, parte3;
        reais  = (strMoney).split(",")[0];
        moedas = (strMoney).split(",")[1];
        parte1 = reais.split(".")[0];
        parte2 = reais.split(".")[1];
        parte3 = reais.split(".")[2];

        if (reais.split(".").length == 1) 
        {
            moldeMoney = parseFloat(parte1) + (parseFloat(moedas) / 100);
        }else if (reais.split(".").length == 2) 
        {
            moldeMoney = (parseFloat(parte1) * 1000) + parseFloat(parte2) + (parseFloat(moedas) / 100);
        }else if (reais.split(".").length == 3) 
        {
            moldeMoney = (parseFloat(parte1) * 1000000) + (parseFloat(parte2) * 1000) + parseFloat(parte3) + (parseFloat(moedas) / 100);
        }
        return moldeMoney;
    }else if(action == 2)
    {
        let formatter;
        formatter = new Intl.NumberFormat('pt-BR', 
        {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
        });
        moldeMoney = formatter.format(strMoney);        
        return moldeMoney;
    }
}