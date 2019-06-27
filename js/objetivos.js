window.addEventListener('load', showGoals);
$(".btn-close-modal").click(fecharModal);
$(document).on('click', '.conteudo', function(){ 
    let id = $(this).attr('id',);
    abrirModal(1, id);    
});
$(document).on('click','#new-goal', function(){     
    abrirModal(2, 0);  
});

$(document).on('click','.btn-adicionar',function(){
    let id = $(this).attr('id',);
    $('#options'   + id).hide();
    $('#add-money' + id).show();   
});
$(document).on('click','.btn-editar',function(){ 
    let id = $(this).attr('id',);
    abrirModal(3, id);    
});
$(document).on('click', '.btn-close', function(){ 
    let id = $(this).attr('id',);
    $('#add-money' + id).hide();
    $('#options'   + id).show();   
});

$(document).on('click', '.add-valor', function(){
    let id = $(this).attr('id',);
    addValor(document.querySelector("#form-add-valor" + id), id);
});


function inicializarDB() {
    let database = localStorage.getItem("DBGoals");
    database = !database ? [] : JSON.parse(database);
    return database;
}

function abrirModal(tipo, obj) {
    $('#main-box-modal').html(' ');
    let data     = inicializarDB();
    let arrayImg = ['', 'gamepad.png', 'couple.png', 'house.png', 'car.png', 'travel.png', 'piggy-bank.png'];

    if (tipo == 1) 
    {
        $('#header-box-modal-title').html("Detalhamento Objetivo");
        $('#main-box-modal').append(`
        <section>
            <div>
                <img src="assets/${arrayImg[data[obj].categoria]}" alt="">  
                <span>
                    ${data[obj].descricao}
                </span>                          
            </div>
        </section>    
        <section>
            <article>
                <div>
                    <h3>R$  ${data[obj].valorAtual} / R$ ${data[obj].valorPrevisto} </h3>
                    <h4> Data:  ${formatarData(data[obj].data)} </h4>
                </div>
                <div>
                    <h4> Você vai precisar poupar R$ ${previsaoMensal(obj).toFixed(2)} por mês</h4>
                </div>
            </article>
            
            <article>
                <span>${((data[obj].valorAtual/data[obj].valorPrevisto)*100).toFixed(2)} % </span>
                <canvas id = "grafico-objetivo">   </canvas>                            
            </article>                        
        </section>          
        `);

        let context = document.getElementById('grafico-objetivo').getContext('2d');
        constroiGraficoCategoria(context,data[obj].valorPrevisto,data[obj].valorAtual);
    }
    else if (tipo == 2) 
    {
        $('#header-box-modal-title').html("Adicionar Objetivo");
        $('#main-box-modal').append(`
            <form class="modal-form">
                <input required placeholder="Descrição objetivo:" class="modal-form-input" type="text" name="name">
                <div>
                    <input required placeholder= "Valor necessário :" id="input-valor-objetivo" class="modal-form-input" type="number"  name="value" maxlength="6">
                    <input required placeholder="Data" class="modal-form-input" type="date" value="${dataAtualFormatada()}" name="date">
                </div>
                    <select required name="objetivo" id="modal-form-objetivo" name="type">
                        <option value="1"> Diversão </option>
                        <option value="2"> Família </option>
                        <option value="3"> Moradia </option>
                        <option value="4"> Veiculo </option>
                        <option value="5"> Viagem </option>
                        <option value="6"> Outros </option>
                    </select>
                    <button id="modal-form-submit" type="button">Salvar</button>
            </form>       
        `);
        document.querySelector("#modal-form-submit").addEventListener('click', function () { insertGoal(document.querySelector(".modal-form")) });

    }
    else if (tipo == 3) 
    {
        $('#header-box-modal-title').html("Editar Objetivo");
        $('#main-box-modal').append(`
            <form class="modal-form">
                <input required placeholder="Descrição objetivo:" class="modal-form-input" type="text" name="name" value=" ${data[obj].descricao}">
                <div>
                    <input required id="input-valor-objetivo" class="modal-form-input" type="number"  value="${(data[obj].valorPrevisto).toString()}" maxlength="6">
                    <input required id="input-valor-objetivo" class="modal-form-input" type="number"  value="${(data[obj].valorAtual).toString()}" maxlength="6" hidden>
                    <input required class="modal-form-input" type="date" name="date" value="${data[obj].data}">
                </div>
                    <select required name="objetivo" id="modal-form-objetivo" name="type" value=" ${(obj).toString()}">
                        <option value="1"> Diversão </option>
                        <option value="2"> Família </option>
                        <option value="3"> Moradia </option>
                        <option value="4"> Veiculo </option>
                        <option value="5"> Viagem </option>
                        <option value="6"> Outros </option>
                    </select>
                    <input required hidden class="modal-form-input" type="number" value="${(data[obj].status).toString()}" >

                    <button id="modal-form-submit" type="button">Salvar</button>
            </form>       
        `);
        document.querySelector("#modal-form-submit").addEventListener('click', function () { editGoals(document.querySelector(".modal-form"),obj) });

    }
    let modalGraph           = document.getElementById('container-modal');
    modalGraph.style.display = 'block';
};

function fecharModal() {
    let modalLineGraph           = document.getElementById('container-modal');
    modalLineGraph.style.display = 'none';
    window.onclick = function () {
        if (event.target == modalLineGraph) {
            modalLineGraph.style.display = 'none';
        }
    }
}

function constroiGraficoCategoria(context, valorP, valorA) {
    let settings = {
        legend: {
            display: false
        },
        responsive: false,
        cutoutPercentage: 90
    };

    let dados = {
        labels: ['Economizado', 'Economizar'],
        datasets: [
            {
                borderWidth: 0.5,
                data: [valorA, (valorP-valorA)],
                backgroundColor: ['rgb(4, 119, 100)', 'rgba(20,20,20,.6)']
            }
        ]
    };

    let graficoObjetivo = new Chart(context,
        {
            type: 'doughnut',
            options: settings,
            data: dados
        });

    return graficoObjetivo;
}

function goalsMapping(form) {
    let database = inicializarDB();
    let dados    = form;
    if (dados) 
    {
        let data =
        {
            descricao     : dados[0].value,
            valorPrevisto : parseFloat(dados[1].value),
            valorAtual    : 0,
            data          : dados[2].value,
            categoria     : parseInt(dados[3].value),
            status        : 1
        };
        database.push(data);
        localStorage.setItem("DBGoals", JSON.stringify(database));
        return true;        
    } else 
    {
        return false;
    }
}

function insertGoal(form) {
    if (goalsMapping(form)) 
    {
        fecharModal();
        showGoals();
    }
}

function progressBar(){
    let objetivo, previsto, atual, progresso;
    objetivo = inicializarDB();
    id       = 0;    
    for(i=0; i < objetivo.length; i++)
    {
        previsto  = objetivo[i].valorPrevisto;
        atual     = objetivo[i].valorAtual;
        progresso = (atual/previsto)*100;  
        let barra = ('barra-progresso'+id).toString();

        if(progresso < 50)
        {
            document.getElementById(barra).style.backgroundColor = '#ff7734';
        }
        if(progresso >= 50 )
        {
            document.getElementById(barra).style.backgroundColor = '#fbf390';
        }
        if(progresso > 89)
        {
            if(progresso > 100)
            {
                progresso = 100;
            }
            document.getElementById(barra).style.backgroundColor = '#6cf596';
        }
        document.getElementById(barra).style.width = progresso+'%';        
        progresso = 0;
        id++
    }
}

function showGoals() {
    let database = inicializarDB();

    if (database.length > 0) {
        let arrayImg = ['', 'gamepad.png', 'couple.png', 'house.png', 'car.png', 'travel.png', 'piggy-bank.png'];
        let set      = '';
        
        $('#main-objetivos').html('');
        for (let i = 0; i < database.length; i++) {
            set +=
                `
                <article class="box-objetivo" >
                    <section class ="conteudo " id="${i}">
                        <section >
                            <div> <img src="assets/${arrayImg[database[i].categoria]}" alt=""></div>
                            <div>   
                                <h2>${database[i].descricao}</h2>
                                <h4>Data objetivo: ${formatarData(database[i].data)} </h4>
                            </div>
                        </section>
                        <section>
                            <div id="box-progresso">
                                <div id="barra-progresso${i}">
                                    <script>
                                    progressBar();
                                    </script>
                                </div>
                            </div>

                            <div id="valores">
                                R$  ${(database[i].valorAtual).toFixed(2)} de R$ ${(database[i].valorPrevisto).toFixed(2)}
                            </div>

                        </section>            
                    </section>
                    <section class="options" id="options${i}">
                        <img  class="btn-adicionar" id="${i}" src="assets/plus.png" alt="">
                        <img  class="btn-completar" id="${i}" src="assets/success.png" alt="">
                        <img  class="btn-excluir"   id="${i}" src="assets/error.png" alt="">
                        <img  class="btn-editar"    id="${i}" src="assets/edit.png" alt="">
                    </section>
                    <section class="add-money"  id ="add-money${i}" display="none">
                            <form id="form-add-valor${i}">
                                <input type="number" name="valor">
                                <button class = "add-valor" id="${i}" type="button" name="salvar">Salvar </button>
                                <span class="btn-close"  id="${i}">&times;</span>
                            </form>
                    </section>
                </article>                            
            `;

        }
        if(database.length < 4){
            set+=
            `
            <article class="box-objetivo" id="new-goal">
                <div> <img src="assets/add.webp" alt=""></div>

                <div id="label-objetivo">
                    Novo Objetivo
                </div>

                </section>
            </article>
            `        
        }
        $('#main-objetivos').prepend(set);
    }
    if (database.length == 4) {
        $('#new-goal').hide();
    }
}

function previsaoMensal(obj){    
    let database    = inicializarDB();    
    let mesAtual    =  new Date().getMonth() + 1;
    let mesPrevisto = (database[obj].data).split("-")[1];
    let valorMensal = database[obj].valorPrevisto/(mesPrevisto - mesAtual);
    return valorMensal;
}

function editGoals(form,obj) {
    let database = inicializarDB();
    let dados    = form;
    if (dados) 
    {
        let data =
        {
            descricao     : dados[0].value,
            valorPrevisto : parseFloat(dados[1].value),
            valorAtual    : parseFloat(dados[2].value),
            data          : dados[3].value,
            categoria     : parseInt(dados[4].value),
            status        : parseInt(dados[5].value)
        };

        database[obj] = data;
        localStorage.setItem("DBGoals", JSON.stringify(database));   
        fecharModal();
        showGoals();
        return true;
    }else 
    {
        return false;
    }
}

function addValor(form, obj){
    let database = inicializarDB();
    let soma     = parseFloat(database[obj].valorAtual) + parseFloat(form[0].value);
    database[obj] = (
    {
        descricao     : database[obj].descricao,
        valorPrevisto : parseFloat(database[obj].valorPrevisto),
        valorAtual    : parseFloat(soma),
        data          : database[obj].data,
        categoria     : parseInt(database[obj].categoria),
        status        : parseInt(database[obj].status)
    });
    localStorage.setItem("DBGoals", JSON.stringify(database));
    showGoals();
}

function dataAtualFormatada(){
    var dNow      = new Date();
    var localdate =  dNow.getFullYear().toString() + '-' + (dNow.getMonth()+1).toString().padStart(2, '0') + '-' +  dNow.getDate().toString().padStart(2, '0');
    return localdate;
}

function formatarData(data){
    let dia, mes, ano;
    dia = data.split("-")[2];
    mes = data.split("-")[1];
    ano = data.split("-")[0];
    return dia + "-" + mes + "-" + ano;
}
