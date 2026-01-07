// scripts responsible for interactions on the website>>>





// script responsible for displaying the modal>>>

//atribui ao botão 'openModalButton' o evento que executa a função openModal()
const openModalButton = document.getElementById('openModalButton');
openModalButton.addEventListener("click", openModal);

//armazena a área de adição de nova tarefa (elemento html)
const newTaskArea = document.getElementById('newTaskArea');

//ao executar, altera a classe do elemento newTaskArea de 'newTaskArea' para 'newTaskArea activeNewTaskArea'
function openModal(){
    newTaskArea.classList.toggle('activeNewTaskArea')

    return
}




