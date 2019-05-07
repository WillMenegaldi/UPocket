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

document.querySelector("#btn-close").addEventListener("click", function(){
    fechaModal();
});

function abreModal(card) 
{
    var modal= document.getElementById('container-modal');
    modal.style.display ='block';

    
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

function fechaModal(){
    var modal= document.getElementById('container-modal');
    modal.style.display='none';
    window.onclick= function(){
        if(event.target ==modal){
            modal.style.display='none';
        }
    }
}