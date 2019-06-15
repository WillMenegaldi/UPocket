document.querySelector("#obj1").addEventListener('click', function(){ abrirModal(1); });
document.querySelector("#new-goal").addEventListener('click', function(){ abrirModal(2); }); 
$("#btn-close").click(fecharModal);

function abrirModal(tipo){      
    $('#main-box-modal').html(' ');
    if(tipo == 1){
        $('#header-box-modal-title').html("Dtalhamento Objetivo");
        $('#main-box-modal').append(`
        <section>
            <div>
                <img src="assets/couple.png" alt="">  
                <span>
                    Meu Objetivo
                </span>                          
            </div>
        </section>    
        <section>
            <article>
                <div>
                    <h3>R$ 4000,00 / R$ 10000,00</h3>
                    <h4> Data: 24/03/2020 </h4>
                </div>
                <div>
                    <h4> Você vai precisar poupar R$ 600,00 por mês</h4>
                </div>
            </article>
            
            <article>
                <span>100% </span>
                <canvas id = "grafico-objetivo">   </canvas>                            
            </article>                        
        </section>          
        `);
        
        let context = document.getElementById('grafico-objetivo').getContext('2d');
        constroiGraficoCategoria(context);
    }
    else if(tipo == 2){  
        $('#header-box-modal-title').html("Adicionar Objetivo");        
        $('#main-box-modal').append(`
            <form class="modal-form">
                <input required placeholder="Descrição objetivo:" class="modal-form-input" type="text" name="name">
                <div>
                    <input required placeholder= "Valor necessário :" id="input-valor-objetivo" class="modal-form-input" type="number"  name="value" maxlength="6">
                    <input required placeholder="Data" class="modal-form-input" type="date" name="date">
                </div>
                    <select required name="objetivo" id="modal-form-objetivo" name="type">
                        <option value="1"> Moradia </option>
                        <option value="2"> Viagem </option>
                        <option value="3"> Diversão </option>
                        <option value="4"> Veiculo </option>
                        <option value="5"> Familia </option>
                    </select>
                    <button id="modal-form-submit" type="button">Salvar</button>
            </form>       
        `);
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

function constroiGraficoCategoria(context) {
    let settings = {
        legend: {
            display: false
        },
        responsive: false,
        cutoutPercentage: 90
    };

    let dados = {
        labels: [ 'Economizado' , 'Economizar'],
        datasets: [
            {
                borderWidth: 0.5,
                label: 'Categorias',
                data:  [10,2],
                backgroundColor: ['rgb(4, 119, 100)','rgba(20,20,20,.6)']
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
