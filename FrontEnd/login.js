const form = document.querySelector(".login_form"); //Selectionne le formulaire de connexion grace a sa classe
const errorLogin = document.querySelector(".error_login"); //Selection de la div contenant le message d'erreur

form.addEventListener("submit", function (event) { //On ajoute un écouteur d'evenement sur le formulaire
    event.preventDefault(); //Ici on va empecher le comportement par défaut de notre formulaire

//Ici on va recuperer nos elements HTML de l'input HTML email et password    
const emailInput = document.getElementById("email"); 
const passwordInput = document.getElementById("password");

/* Puis on va recuperer la valeur saisie de l'email et du password */
const email = emailInput.value;
const password = passwordInput.value;

errorLogin.style.visibility = "hidden"; //On masque le message d'erreur avant d'envoyer la requete


fetch("http://localhost:5678/api/users/login", { //Envoi des identifiants a l'API pour vérification via une requete POST
    method: "POST", // Utilisation de la méthode POST pour envoyer des données au serveur
    headers: { // Les données envoyées en JSON vers les en-tetes
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ // Onconvertit les identifiants en chaine JSON pour les envoyer
      email: email,
      password: password
    })
  })
  .then(data => data.json()) // On convertit la réponse de l'API en objet javascript
  .then(data => { // On traite les données renvoyées par l'API
    // Si la réponse contient bien le Token, l'utilisateur est connecté
    if (data.token) {
        localStorage.setItem("token", data.token); //Si le token est présent, la connexion va marcher
        window.location.href = "index.html"; // Et la connexion va rediriger vers la page d'accueil
    } else {
        errorLogin.style.visibility = "visible"; // Affichage du message d'erreur si la connexion échoue
    }
    // On vérifie la réponse de l'API dans la console
    console.log(data);
  })
  
})