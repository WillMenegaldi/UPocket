window.addEventListener('load', graphic);

function graphic()
{
    let context = document.getElementById('linegraph').getContext('2d');
    
    let graph = new Chart(context,
    {
        type:'line',
        options :{
            responsive:false,
            /* coloca-se os dois valores */
            tooltips: {
                mode: 'index'
            },
            scales: {
                yAxes: [{
                  ticks: {
                    fontSize: 8
                  }
                }],
                xAxes: [{
                  ticks: {
                    fontSize: 7
                  }
                }]
            },
            legend: {
                /*Setando visibilidade e colocando ele embaixo*/
                display: false,
                position:'bottom',
                labels:{                    
                    /* Ativando o bloco de legenda e colocando como circulo*/
                    usePointStyle:true,
                    fontSize: 1,
                    pointStyle:'circle',
                    fontSize: (detectar_mobile() ? 7 : 102)
                }
            }
        },
        data: {
            labels: ['Alimentação', 'Roupas', 'Gasolina', 'Lazer', 'Escola'],
            datasets: [
                {              
                    /*Aumenta o tamanho da bolinha*/
                    pointRadius:2,
                    data: [2000, 1000, 500, 9000, 1000, 400],
                    borderColor:"#0c8e10",
                    /* Colocando cor de fundo*/
                    backgroundColor:'rgba(32,130,19,0.5)',
                    label: 'Orçamento'
                },
                {
                    label:'Gastos',
                    data: [2500, 100, 5000, 1000, 5000, 400],
                    backgroundColor:'rgba(145,33,33,0.4)',
                    borderColor:"#991c09"
                }                
            ]
        }

    });

    let ctx = document.getElementById('pizzagraph').getContext('2d');

    let graphP = new Chart(ctx,{
        type:'doughnut',
        options: {
            legend: {
                display: false
            },
            responsive: false,
            cutoutPercentage: 67
        },
        data:{
            labels:['Alimentação', 'Roupas', 'Gasolina', 'Lazer', 'Escola'],
            datasets:[
                {
                    borderWidth: 0.5,
                    label:'Categorias',
                    data: [2000, 1000, 1000, 1000, 400],
                    backgroundColor:['#006400','#89a5c4','#8c092a','#099673','#847502']
                }
            ]
        }
    });
};
