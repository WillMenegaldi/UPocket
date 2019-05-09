document.querySelector("#add-despesa").addEventListener("click", function(){
    abreModal('despesa');
});

document.querySelector("#add-receita").addEventListener("click", function(){
    abreModal('receita');
});

document.querySelector("#btn-close").addEventListener("click", function(){
    fechaModal();
});

document.querySelector("#modal-form-submit").addEventListener("click", function(){
    validaInsercao(document.querySelector("#modal-form-submit"));
});

function abreModal(card) 
{
    var modal = document.getElementById('container-modal');
    
    modal.style.display = 'block';

    var headerModal     = document.getElementById("header-box-modal");
    var categoriaModal  = document.getElementById("modal-form-categoria");        
    var enviarModal     = document.getElementById("modal-form-submit");
    var inputModal      = document.getElementsByClassName("modal-form-input");
    var headerTitle     = document.getElementById('header-box-modal-title');

    
    if(card == 'receita') 
    {
        headerTitle.innerHTML                = 'Adicionar Receita';
        headerModal.style.backgroundColor    = 'rgb(21, 76, 10)'; 
        categoriaModal.style.backgroundColor = 'rgb(21, 76, 10)';
        categoriaModal.style.display         = 'none';  
        enviarModal.style.backgroundColor    = 'rgb(21, 76, 10)';  
          
        for(var i = 0; i < inputModal.length; i++)
        {
            inputModal[i].style["border-bottom"] = '3px solid rgb(21, 76, 10)';
            if(i == 0)
            {
                inputModal[i].placeholder = "Descrição da Receita:";  
            }
            else if(i == 1)
            {
                inputModal[i].placeholder = "Valor da Receita:";  
            }
        }
    }
    else if(card == 'despesa')
    {
        headerTitle.innerHTML='Adicionar Despesas';
        
        categoriaModal.style.display         = 'block';
        headerModal.style.backgroundColor    = 'rgb(153, 36, 42)'; 
        categoriaModal.style.backgroundColor = 'rgb(153, 36, 42)';  
        enviarModal.style.backgroundColor    = 'rgb(153, 36, 42)';

        for(var i = 0; i < inputModal.length; i++)
        {
            inputModal[i].style["border-bottom"] = '3px solid rgb(153, 36, 42)';
          
            if(i == 0)
            {
                inputModal[i].placeholder = "Descrição da Despesa:";  
            }
            else if(i == 1)
            {
                inputModal[i].placeholder = "Valor da Despesa:";  
            }      
        }
    }
}

function fechaModal()
{
    var modal = document.getElementById('container-modal');
    
    modal.style.display = 'none';
    
    window.onclick = function()
    {
        if(event.target == modal)
        {
            modal.style.display = 'none';
        }
    }
}
