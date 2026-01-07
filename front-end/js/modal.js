// MODAL CONTROL


// stores the new task addition area (modal)
const newTaskArea = document.getElementById('newTaskArea');

// button that opens the modal
const openModalButton = document.getElementById('openModalButton');
openModalButton.addEventListener("click", openModal);

// opens/closes the modal
function openModal() {
    newTaskArea.classList.toggle('activeNewTaskArea');
}

// button that closes the modal
const closeModalButton = document.getElementById('closeModalButton');
closeModalButton.addEventListener("click", closeModal);

// closes the modal
function closeModal() {
    newTaskArea.classList.remove('activeNewTaskArea');
}
