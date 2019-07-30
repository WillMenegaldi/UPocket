window.addEventListener('load', showGoals);


$(".btn-close-modal").click(closeModal);

$(document).on('click', '.conteudo', function () {
    let id = $(this).attr('id');
    openModal(1, id);
});
$(document).on('click', '#new-goal', function () {
    openModal(2, 0);
});

$(document).on('click', '.btn-adicionar', function () {
    let id = $(this).attr('id');
    $('#options' + id).hide();
    $('#add-money' + id).show();
});
$(document).on('click', '.btn-editar', function () {
    let id = $(this).attr('id');
    openModal(3, id);
});
$(document).on('click', '.btn-concluir', function () {
    let id = $(this).attr('id');
    let database = startDB();
    if (database[id].status == 2) {
        changeStatus(id, 1);
    } else {
        changeStatus(id, 2);
    }
});
$(document).on('click', '.btn-excluir', function () {
    let id = $(this).attr('id');
    changeStatus(id, 0);
});
$(document).on('click', '.add-valor', function () {
    let id = $(this).attr('id');
    validForm(document.querySelector("#form-add-valor" + id), 0, id);
});
$(document).on('click', '.btn-close', function () {
    let id = $(this).attr('id');
    $('#add-money' + id).hide();
    $('#options' + id).show();
});



function startDB() {
    let database = localStorage.getItem("DBGoals");
    database = !database ? [] : JSON.parse(database);
    return database;
}

function openModal(tipo, obj) {
    $('#main-box-modal').html(' ');
    let data = startDB();
    let arrayImg = ['', 'gamepad.png', 'couple.png', 'house.png', 'car.png', 'travel.png', 'piggy-bank.png'];

    if (tipo == 1) {
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
                    <h3>R$  ${formatMoney(data[obj].valorAtual, 2)} / R$ ${formatMoney(data[obj].valorPrevisto, 2)} </h3>
                    <h4> Data:  ${formatDate(data[obj].data)} </h4>
                </div>
                <div>
                    <h4> Você vai precisar economizar R$ ${formatMoney(monthlyForecast(obj),2)} por mês</h4>
                </div>
            </article>
            
            <article>
                <span>${((data[obj].valorAtual / data[obj].valorPrevisto) * 100).toFixed(2)} % </span>
                <canvas id = "grafico-objetivo">   </canvas>                            
            </article>                        
        </section>          
        `);

        let context = document.getElementById('grafico-objetivo').getContext('2d');
        buildGoalsGraph(context, data[obj].valorPrevisto, data[obj].valorAtual);

    }
    else if (tipo == 2) {
        $('#header-box-modal-title').html("Adicionar Objetivo");
        $('#main-box-modal').append(`
            <form class="modal-form">
                <input required placeholder="Descrição objetivo:" class="modal-form-input" type="text" name="name">
                <div>
                    <input required placeholder= "Valor necessário :" id="input-valor-objetivo" class="modal-form-input" type="text"  name="value" maxlength="12">
                    <input required placeholder="Data" class="modal-form-input" type="date" value="${formatCurrentDate()}" name="date">
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
        $('#input-valor-objetivo').mask('#.##0,00', { reverse: true });
        document.querySelector("#modal-form-submit").addEventListener('click', function () {
            if (validForm(document.querySelector(".modal-form"), 1, 0) == 1) {
                goalsMapping(document.querySelector(".modal-form"));
                closeModal();
                showGoals();
            }
        });

    }
    else if (tipo == 3) {
        $('#header-box-modal-title').html("Editar Objetivo");
        $('#main-box-modal').append(`
            <form class="modal-form">
                <input required placeholder="Descrição objetivo:" class="modal-form-input" type="text" name="name" value=" ${data[obj].descricao}">
                <div>
                    <input required id="input-valor-objetivo" class="modal-form-input" type="text"  value="${(data[obj].valorPrevisto).toString()}" maxlength="12">
                    <input required id="input-valor-objetivo" class="modal-form-input" type="number"  value="${(data[obj].valorAtual).toString()}" maxlength="6" hidden>
                    <input required class="modal-form-input" type="date" name="date" value="${data[obj].data}">
                </div>
                    <select name="objetivo" id="modal-form-objetivo">
                        <option value="1"> Diversão </option>
                        <option value="2"> Família </option>
                        <option value="3"> Moradia </option>
                        <option value="4"> Veiculo </option>
                        <option value="5"> Viagem </option>
                        <option value="6"> Outros </option>
                    </select>
                    <input required hidden class="modal-form-input" type="number" value="${(data[obj].status).toString()}" >
                    <input hidden  name="id" value="${data[obj].id}">

                    <button id="modal-form-submit" type="button">Salvar</button>
            </form>       
        `);
        $('#input-valor-objetivo').mask('#.##0,00', { reverse: true });
        $("#modal-form-objetivo").val(data[obj].categoria);
        document.querySelector("#modal-form-submit").addEventListener('click', function () { validForm(document.querySelector(".modal-form"), 2, obj) });

    }
    let modalGraph = document.getElementById('container-modal');
    modalGraph.style.display = 'block';
};

function closeModal() {
    let modalLineGraph = document.getElementById('container-modal');
    modalLineGraph.style.display = 'none';
    window.onclick = function () {
        if (event.target == modalLineGraph) {
            modalLineGraph.style.display = 'none';
        }
    }
}

function buildGoalsGraph(context, valorP, valorA) {
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
                data: [valorA, (valorP - valorA)],
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

function validForm(form, tipo, obj) {
    if (tipo > 0) {
        if (form[0].value == false || form[1].value == false) {
            alert("Preencha todos os campos!");
        } else if (form[1].value < 0) {
            alert("Apenas valores maiores que 0!");
        } else {
            if (tipo == 1) {
                return 1;
            } else {
                if (editGoals(form, obj)) {
                    closeModal();
                    showGoals();
                }
            }
        }

    } else {
        if (form[0].value == false) {
            alert("Preencha o campo!");
        } else if (form[0].value < 0) {
            alert("Apenas valores maiores que 0!");
        } else {
            addGoalsValue(form, obj);
            showGoals();
        }
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

function goalsMapping(form) {
    let database, cancelados;   

    database = startDB();
    if(database.length == 4)
    {
        cancelados =  database.filter(data=>data.status == 0);
        if (form) 
        {
            let data =
            {
                id            : cancelados[0].id,
                descricao     : form[0].value,
                valorPrevisto : formatMoney(form[1].value, 1),
                valorAtual    : 0,
                data          : form[2].value,
                categoria     : parseInt(form[3].value),
                status        : 1
            };
            database[cancelados[0].id] = data;              
            localStorage.setItem("DBGoals", JSON.stringify(database));   
            return true;
        }else 
        {
            return false;
        }
    }else{
        if (form) 
        {
            let data =
            {
                id            : database.length,
                descricao     : form[0].value,
                valorPrevisto : formatMoney(form[1].value, 1),
                valorAtual    : 0,
                data          : form[2].value,
                categoria     : parseInt(form[3].value),
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
}

function showGoals() {
    let database;
    database = startDB();
    database = database.filter(data => data.status != 0);
    if (database.length > 0) {
        let arrayImg = ['', 'gamepad.png', 'couple.png', 'house.png', 'car.png', 'travel.png', 'piggy-bank.png'];
        let set = '';

        $('#main-objetivos').html('');
        for (let i = 0; i < database.length; i++) {
            set +=
                `
                <article class="box-objetivo">
                    <section class ="conteudo " id="${database[i].id}">
                        <section >
                            <div> <img src="assets/${arrayImg[database[i].categoria]}" alt=""></div>
                            <div>   
                                <h2>${database[i].descricao}</h2>
                                <h4 id="data-objetivo${i}">Data: ${formatDate(database[i].data)} </h4>
                            </div>
                        </section>
                        <section>
                            <div id="box-progresso">
                                <div id="barra-progresso${database[i].id}">
                                    <script>
                                    progressBar();
                                    </script>
                                </div>
                            </div>

                            <div id="valores">
                                ${formatMoney(database[i].valorAtual, 2)} de ${formatMoney(database[i].valorPrevisto, 2)}
                            </div>

                        </section>            
                    </section>
                    <section class="options" id="options${database[i].id}">
                        <img  class="btn-adicionar" id="${database[i].id}" src="assets/plus.png"    alt="Adicionar" title = "Adicionar valor ao objetivo">
                        <img  class="btn-concluir"  id="${database[i].id}" src="assets/success.png" alt="Concluir"  title = "Concluir objetivo">
                        <img  class="btn-excluir"   id="${database[i].id}" src="assets/error.png"   alt="Excluir"   title = "Excluir objetivo">
                        <img  class="btn-editar"    id="${database[i].id}" src="assets/edit.png"    alt="Editar"    title = "Editar objetivo">
                    </section>
                    <section class="add-money"  id ="add-money${database[i].id}" display="none">
                            <form id="form-add-valor${database[i].id}">
                                <input type="text" class="input-economia" name="valor" maxlength="12">
                                <button class = "add-valor" id="${database[i].id}"  type="button" name="salvar">Salvar </button>
                                <span class="btn-close"  id="${database[i].id}">&times;</span>
                            </form>
                    </section>
                </article>                            
            `;
        }

        if (database.length < 4) {
            set +=
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

        $('.input-economia').mask('#.##0,00', { reverse: true });

        for (let i = 0; i < database.length; i++) {
            if (database[i].status == 2) {
                $("article.box-objetivo:nth-child(" + (i + 1) + ")").css("background-color", "#147180");
                $("h4#data-objetivo" + i).html("Concluido");
            }
        }
    }
    if (database.length == 4) {
        $('#new-goal').hide();
    }
}

function progressBar() {
    let objetivo, previsto, atual, progresso;
    objetivo = startDB();
    id = 0;
    if (objetivo.length > 0) {
        for (i = 0; i < objetivo.length; i++) {
            previsto = objetivo[i].valorPrevisto;
            atual = objetivo[i].valorAtual;
            progresso = (atual / previsto) * 100;
            let barra = ('barra-progresso' + id).toString();

            if (progresso < 50) {
                document.getElementById(barra).style.backgroundColor = '#ff7734';
            }
            if (progresso >= 50) {
                document.getElementById(barra).style.backgroundColor = '#fbf390';
            }
            if (progresso > 89) {
                if (progresso > 100) {
                    progresso = 100;
                }
                document.getElementById(barra).style.backgroundColor = '#6cf596';
            }
            document.getElementById(barra).style.width = progresso + '%';
            progresso = 0;
            id++
        }

    }

}

function monthlyForecast(obj) {
    let database, mesAtual, anoAtual, mesPrevisto, anoPrevisto, valorMensal;
    database = startDB();
    mesAtual = new Date().getMonth() + 1;
    anoAtual = new Date().getFullYear();
    mesPrevisto = parseInt((database[obj].data).split("-")[1]);
    anoPrevisto = parseInt((database[obj].data).split("-")[0]);
    if (anoPrevisto == anoAtual) {
        if (mesPrevisto <= mesAtual) {
            valorMensal = database[obj].valorPrevisto / (1);
        } else {
            valorMensal = database[obj].valorPrevisto / (mesPrevisto - mesAtual);
        }
    } else if (anoPrevisto == (anoAtual + 1)) {
        valorMensal = database[obj].valorPrevisto / ((12 - mesAtual) + mesPrevisto);
    } else if (anoPrevisto > (anoAtual + 1)) {
        valorMensal = database[obj].valorPrevisto / ((12 - mesAtual) + mesPrevisto + (12 * ((anoPrevisto - anoAtual) - 1)));
    }
    return valorMensal;
}

function editGoals(form, obj) {
    let database = startDB();
    let dados = form;
    if (dados) {
        let data =
        {
            id: parseInt(dados[6].value),
            descricao: dados[0].value,
            valorPrevisto: formatMoney(dados[1].value, 1),
            valorAtual: parseFloat(dados[2].value),
            data: dados[3].value,
            categoria: parseInt(dados[4].value),
            status: parseInt(dados[5].value)
        };

        database[obj] = data;
        localStorage.setItem("DBGoals", JSON.stringify(database));
        return true;
    } else {
        return false;
    }
}

function addGoalsValue(form, obj) {
    let database = startDB();
    let soma = parseFloat(database[obj].valorAtual) + formatMoney(form[0].value, 1);
    database[obj] = (
        {
            id: database[obj].id,
            descricao: database[obj].descricao,
            valorPrevisto: parseFloat(database[obj].valorPrevisto),
            valorAtual: (soma),
            data: database[obj].data,
            categoria: parseInt(database[obj].categoria),
            status: parseInt(database[obj].status)
        });
    localStorage.setItem("DBGoals", JSON.stringify(database));
}

function changeStatus(obj, value) {
    let database = startDB();
    database[obj] = (
        {
            id: database[obj].id,
            descricao: database[obj].descricao,
            valorPrevisto: parseFloat(database[obj].valorPrevisto),
            valorAtual: parseFloat(database[obj].valorAtual),
            data: database[obj].data,
            categoria: parseInt(database[obj].categoria),
            status: value
        });
    localStorage.setItem("DBGoals", JSON.stringify(database));
    showGoals();
}

function formatCurrentDate() {
    var dNow = new Date();
    var localdate = dNow.getFullYear().toString() + '-' + (dNow.getMonth() + 1).toString().padStart(2, '0') + '-' + dNow.getDate().toString().padStart(2, '0');
    return localdate;
}

function formatDate(data) {
    let dia, mes, ano;
    dia = data.split("-")[2];
    mes = data.split("-")[1];
    ano = data.split("-")[0];
    return dia + "-" + mes + "-" + ano;
}
