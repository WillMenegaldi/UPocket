window.addEventListener('load', showGoals);


$(".btn-close-modal").click(fecharModal);


document.querySelector("#new-goal").addEventListener('click', function () { abrirModal(2) });
document.querySelector("#conteudo0").addEventListener('click', function () { abrirModal(1, 0) });
document.querySelector("#conteudo1").addEventListener('click', function () { abrirModal(1, 1) });
document.querySelector("#conteudo2").addEventListener('click', function () { abrirModal(1, 2) });
document.querySelector("#conteudo3").addEventListener('click', function () { abrirModal(1, 3) });



document.querySelector(".btn-adicionar0").addEventListener('click', function () { 
    $('.options0').hide();
    $('#add-money0').show(); 
});
document.querySelector(".btn-adicionar1").addEventListener('click', function () { 
    $('.options1').hide();
    $('#add-money1').show(); 
});
document.querySelector(".btn-adicionar2").addEventListener('click', function () { 
    $('.options2').hide();
    $('#add-money2').show(); 
});
document.querySelector(".btn-adicionar3").addEventListener('click', function () { 
    $('.options3').hide();
    $('#add-money3').show(); 
});



document.querySelector(".close-add0").addEventListener('click', function () { 
    $('#add-money0').hide(); 
    $('.options0').show();
});

document.querySelector(".close-add1").addEventListener('click', function () { 
    $('#add-money1').hide(); 
    $('.options1').show();
});

document.querySelector(".close-add2").addEventListener('click', function () { 
    $('#add-money2').hide(); 
    $('.options2').show();
});

document.querySelector(".close-add3").addEventListener('click', function () { 
    $('#add-money3').hide(); 
    $('.options3').show();
});


///botoes de salvar
document.querySelector("#add-valor0").addEventListener('click', function () { 
    somarValores(document.querySelector("#form-add-valor0"), 0);
    
    $('#add-money0').hide(); 
    $('.options0').show();
    showGoals();
});
document.querySelector("#add-valor1").addEventListener('click', function () { 
    somarValores(document.querySelector("#form-add-valor1"), 1);
    
    $('#add-money1').hide(); 
    $('.options1').show();
    showGoals();
});
document.querySelector("#add-valor2").addEventListener('click', function () { 
    somarValores(document.querySelector("#form-add-valor2"), 2);
    
    $('#add-money2').hide(); 
    $('.options2').show();
    showGoals();
});
document.querySelector("#add-valor3").addEventListener('click', function () { 
    somarValores(document.querySelector("#form-add-valor3"), 3);
    
    $('#add-money3').hide(); 
    $('.options3').show();
    showGoals();
});


function somarValores(form, obj){
    let database = inicializarDB();
    let soma = parseFloat(database[obj].valorAtual) + parseFloat(form[0].value);
    database[obj] = (
    {
        descricao: database[obj].descricao,
        valorPrevisto: parseFloat(database[obj].valorPrevisto),
        valorAtual: parseFloat(soma),
        data: database[obj].data,
        categoria: parseInt(database[obj].categoria)
    });
    localStorage.setItem("DBGoals", JSON.stringify(database));
}







function abrirModal(tipo, obj) {
    $('#main-box-modal').html(' ');
    let data = inicializarDB();
    let arrayImg = ['', 'gamepad.png', 'couple.png', 'house.png', 'car.png', 'travel.png', 'piggy-bank.png'];

    if (tipo == 1) {
        $('#header-box-modal-title').html("Dtalhamento Objetivo");
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
                    <h4> Data:  ${data[obj].data} </h4>
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
    else if (tipo == 2) {
        $('#header-box-modal-title').html("Adicionar Objetivo");
        $('#main-box-modal').append(`
            <form class="modal-form">
                <input required placeholder="Descrição objetivo:" class="modal-form-input" type="text" name="name">
                <div>
                    <input required placeholder= "Valor necessário :" id="input-valor-objetivo" class="modal-form-input" type="number"  name="value" maxlength="6">
                    <input required placeholder="Data" class="modal-form-input" type="date" name="date">
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
    let modalGraph = document.getElementById('container-modal');
    modalGraph.style.display = 'block';
};

function fecharModal() {
    let modalLineGraph = document.getElementById('container-modal');
    modalLineGraph.style.display = 'none';
    window.onclick = function () {
        if (event.target == modalLineGraph) {
            modalLineGraph.style.display = 'none';
        }
    }
}

function constroiGraficoCategoria(context,valorP,valorA) {
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
                data: [valorA, valorP],
                backgroundColor: ['rgb(4, 119, 100)', 'rgba(20,20,20,.6)']
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


// Crud

function inicializarDB() {
    let database = localStorage.getItem("DBGoals");
    database = !database ? [] : JSON.parse(database);
    return database;
}
function insertGoal(form) {
    if (goalsMapping(form)) {
        fecharModal();
        showGoals();

    }
}
function goalsMapping(form) {
    let dados = form;
    let database = inicializarDB();
    if (dados) {
        let data =
        {
            descricao: dados[0].value,
            valorPrevisto: parseFloat(dados[1].value),
            valorAtual: 0,
            data: dados[2].value,
            categoria: parseInt(dados[3].value)
        };

        database.push(data);

        localStorage.setItem("DBGoals", JSON.stringify(database));
        return true;
    } else {
        return false;
    }
}

function showGoals() {
    let database = inicializarDB();

    $('#obj0').hide();
    $('#obj1').hide();
    $('#obj2').hide();
    $('#obj3').hide();


    if (database.length > 0) {
        let arrayImg = ['', 'gamepad.png', 'couple.png', 'house.png', 'car.png', 'travel.png', 'piggy-bank.png'];
        for (let i = 0; i < database.length; i++) {
            $('#conteudo'+i).html('');
            let set = '';
            set =
                `
            <section >
                <div> <img src="assets/${arrayImg[database[i].categoria]}" alt=""></div>
                <div>   
                    <h2>${database[i].descricao}</h2>
                    <h4>Data objetivo: ${database[i].data} </h4>
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
            `;
            $('#conteudo' + i ).prepend(set);
            $('#obj' + i).show();
        }
    }
    if (database.length == 4) {
        $('#new-goal').hide();
    }
}



function progressBar(){
    let objetivo, previsto, atual, progresso;
    objetivo = inicializarDB();
    id = 0;    
    for(i=0; i < objetivo.length; i++){
        previsto = objetivo[i].valorPrevisto;
        atual = objetivo[i].valorAtual;

        progresso = (atual/previsto)*100;  

        let barra = ('barra-progresso'+id).toString();

        if(progresso < 50){
            document.getElementById(barra).style.backgroundColor = '#ff7734';
        }

        if(progresso >= 50 ){
            document.getElementById(barra).style.backgroundColor = '#fbf390';
        }

        if(progresso > 89){
            if(progresso > 100){
                progresso = 100;
            }
            document.getElementById(barra).style.backgroundColor = '#6cf596';
        }
        document.getElementById(barra).style.width = progresso+'%';        
        progresso = 0;
        id++
    }
}



function previsaoMensal(obj){        
    let mesAtual =  new Date().getMonth() + 1;
    let database = inicializarDB();
    let mesPrevisto = (database[obj].data).split("-")[1];
    let valorMensal = database[obj].valorPrevisto/(mesPrevisto - mesAtual)
    return valorMensal;
}

