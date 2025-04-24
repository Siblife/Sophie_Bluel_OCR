const form = document.querySelector(".login_form"); //Selectionne le formulaire de connexion grace a sa classe

form.addEventListener("submit", function (event) { //On ajoute un écouteur d'evenement sur le formulaire
    event.preventDefault(); //Ici on va empecher le comportement par défaut de notre formulaire

//Ici on va recuperer nos elements HTML de l'input HTML email et password    
const emailInput = document.getElementById("email"); 
const passwordInput = document.getElementById("password");

//Puis on va recuperer la valeur saisie de l'email et du password
const email = emailInput.value;
const password = passwordInput.value;
});