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


// === Fonction de gestion de la soumission du formulaire de connexion ===
// Cette fonction est déclenchée lorsque l'utilisateur soumet le formulaire de connexion.
// Elle récupère les valeurs saisies dans les champs email et mot de passe,
// envoie une requête POST à l'API pour vérifier les identifiants,
// et gère la réponse pour connecter l'utilisateur ou afficher un message d'erreur.

fetch("http://localhost:5678/api/users/login", { 
    // Envoi des identifiants à l'API pour vérification via une requête POST
    method: "POST", // Utilisation de la méthode POST pour envoyer des données au serveur
    headers: { 
      "Content-Type": "application/json" // Les données envoyées sont au format JSON
    },
    body: JSON.stringify({ 
      email: email, // Conversion de l'email en chaîne JSON
      password: password // Conversion du mot de passe en chaîne JSON
    })
  })
  .then(data => data.json()) // Conversion de la réponse de l'API en objet JavaScript
  .then(data => { 
    // Traitement des données renvoyées par l'API
    if (data.token) {
        // Si la réponse contient un token, l'utilisateur est connecté
        localStorage.setItem("token", data.token); // Stocke le token dans le localStorage
        window.location.href = "index.html"; // Redirige l'utilisateur vers la page d'accueil
    } else {
        errorLogin.style.visibility = "visible"; // Affiche un message d'erreur si la connexion échoue
    }
    console.log(data); // Affiche la réponse de l'API dans la console pour vérification
  })
  .catch(error => {
    // Gestion des erreurs en cas de problème avec la requête
    console.error("Erreur lors de la connexion :", error);
  });
});