window.addEventListener('load', graphic);

function graphic()
{
    let context = document.getElementById('linegraph').getContext('2d');
    
    let graph = new Chart(context,
    {
        type:'line',
        options :{
            responsive:false,
            legend: {
                labels: {
                fontColor: 'black',
                fontFamily:'Tahoma',
                fontSize: 20
                }                    
            }
        },
        data: {
            labels: ['Alimentação', 'Roupas', 'Gasolina', 'Lazer', 'Escola'],
            datasets: [
                {
                    label: 'Orçamento',
                    data: [2000, 1000, 500, 9000, 1000, 400],
                    borderColor:"#0c8e10",   
                },
                {
                    label:'Gastos',
                    data: [2500, 100, 5000, 1000, 5000, 400],
                    borderColor:"#991c09"
                }                
            ]
        }

    });
    
    let ctx=document.getElementById('pizzagraph').getContext('2d');
    let graphP=new Chart(ctx,{
        type:'pie',
        options: {
            responsive:false ,
                legend: {
                    display: false
                }
        },
        data:{
            labels:['Alimentação', 'Roupas', 'Gasolina', 'Lazer', 'Escola'],    
            datasets:[
                {
                    label:'Categorias',
                    data: [2000, 1000, 1000, 1000, 400],
                    backgroundColor:['#798899','#89a5c4','#8c092a','#099673','#847502']
                }
            ], 
        }
    });
};