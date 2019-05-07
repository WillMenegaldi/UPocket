document.querySelector("#income-card").addEventListener("click", function(){
    alert('Receita!');
});

document.querySelector("#budget-card").addEventListener("click", function(){
    alert('Despesa!');
});

document.querySelector("#grafico-linha").addEventListener("click", function(){
    alert('Grafico Linha!');
});

document.querySelector("#grafico-rosquinha").addEventListener("click", function(){
    alert('Grafico Rosquinha!');
});

document.querySelector("#add-receita").addEventListener("click", function(){
    abreModal('receita');
});

document.querySelector("#add-despesa").addEventListener("click", function(){
    abreModal('despesa');
});


function abreModal(card) 
{
    if(card == 'receita') 
    {
        console.log("Card Receita");
        /*var cardReceita = document.getElementsByClassName('income');

        for(var i = 0; i < cardReceita.length; i++)
        {
            cardReceita[i].style["color"] = 'navy';
        }
        */
    }
}