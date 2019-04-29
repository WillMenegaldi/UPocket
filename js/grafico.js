/* /////////Fazendo executar assim que for iniciada a pagina */
window.addEventListener('load',graphic);
/* ///////////////////// Função que chama o gráfico //////////////////*/
function graphic(){
        /*GRAFICO DE LINHAS*/
        /*Pegando o obeto canvas e o contexto*/
        let context= document.getElementById('linegraph').getContext('2d');
        /*Instanciando uma nova classe chart*/
        let graph = new Chart(context,{
            /*Tipo de gráfico*/
            type:'line',
            /*Desabilita a função de responsividade automática, que atrapalha muito no seu controle pessoal*/
            options :{
                responsive:false,
                legend: {
                    labels: {
                    // This more specific font property overrides the global property
                    fontColor: 'black',
                    fontFamily:'Tahoma',
                    fontSize:20
                    }                    
                }
            },
            /*Informações contidas*/
            data: {
                /*Informa a lista de dados que vão ser inseridos para analise, no caso as categorias*/
                labels: ['Alimentação', 'Roupas', 'Gasolina', 'Lazer', 'Escola'],
                /*Informa os valores correspondentes aos indices indicados a cima*/            
                datasets: [
                    {
                        //titulo, e valores
                        label: 'Orçamento',
                        data: [2000, 1000, 500, 9000, 1000, 400],
                        /*inserindo cor da lina*/
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
        /*GRAFICO DE PIZZA*/
        let ctx=document.getElementById('pizzagraph').getContext('2d');
        let graphP=new Chart(ctx,{
            type:'pie',
            options: {
                /*tirando a legenda*/
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