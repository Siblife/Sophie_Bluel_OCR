// Selection de l'élement HTML qui va contenir les projets
const gallery = document.querySelector(".gallery"); // La galerie qui contiendra tous les projets
const gallerymodale = document.querySelector(".projets_flex");
const filtre = document.getElementById("filtre"); // La section des boutons filtres

let allWorks = []; //Variable globale pour stocker tous les projets récupérés depuis l'API

// === Fonction d'affichage des projets dans la galerie ===
// Cette fonction vide la galerie existante, puis crée dynamiquement les éléments HTML
// (figure, image, titre) pour chaque projet et les insère dans la galerie.

// Fonction pour afficher les projets dans la galerie
function displayWorks(works) {
  gallery.innerHTML = ""; // Réinitialiser la galerie avant d'ajouter les nouveaux projets

  works.forEach((project) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    img.src = project.imageUrl; // URL de l'image du projet
    img.alt = project.title; // Texte alternatif pour l'image
    figcaption.textContent = project.title; // Titre du projet

    // Ajouter les éléments dans la structure de la galerie
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure); // Clone l'élément pour l'ajouter à la modale
  });
}

// === Récupération des projets depuis l'API ===
// Cette fonction fait un appel GET à l'API pour récupérer tous les projets.
// Elle les stocke dans la variable globale `allWorks`, les affiche dans la galerie,
// et les log dans la console pour vérification.

// Appel de l'API pour récupérer les projets depuis le serveur et les afficher dynamiquement
function apiWorks() {
  return fetch("http://localhost:5678/api/works") // Retourne la Promise
    .then((reponse) => reponse.json()) // Transforme la réponse en JSON
    .then((data) => {
      allWorks = data; // Stocke les projets dans la variable globale
      console.log("Projets récupérés :", allWorks); // Vérifie les données dans la console
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des projets :", error);
    });
}

// === Récupération des catégories et création des boutons de filtre ===
// Cette fonction interroge l'API pour récupérer les catégories,
// crée un bouton pour chaque catégorie (y compris un bouton "Tous"),
// puis ajoute un gestionnaire d'événement pour filtrer les projets selon la catégorie choisie.

function apiCategorie() {
  fetch("http://localhost:5678/api/categories")
    .then((reponse) => reponse.json())
    .then((data) => {
      //Création du bouton Tous
      const btnTous = document.createElement("button");
      btnTous.classList.add("filtre_bouton");
      btnTous.textContent = "Tous";
      btnTous.dataset.id = "0"; // ID = 0 pour "Tous"
      filtre.appendChild(btnTous);
      // Création des boutons pour chaque catégorie
      data.forEach((categorie) => {
        const btn = document.createElement("button");
        btn.classList.add("filtre_bouton");
        btn.textContent = categorie.name;
        btn.dataset.id = categorie.id; // On stocke l'ID de la catégorie dans chaque bouton

        // Ajouter le bouton dans le DOM
        filtre.appendChild(btn);
      });

      // Ajouter l'événement 'click' sur chaque bouton pour filtrer les projets
      const boutons = document.querySelectorAll(".filtre_bouton");
      boutons.forEach((button) => {
        button.addEventListener("click", () => {
          const id = button.dataset.id; // Récupère l'ID de la catégorie du bouton

          // Filtre les projets selon l'ID de la catégorie
          if (id === "0") {
            // Si "Tous" est sélectionné, on affiche tous les projets
            displayWorks(allWorks);
          } else {
            // Sinon, on filtre les projets de la catégorie sélectionnée
            const projetsFiltres = allWorks.filter(
              (work) => work.categoryId === parseInt(id)
            );
            displayWorks(projetsFiltres);
          }
        });
      });
    });
}


function listenerOuvertureModal() {
  document.querySelector(".modifier").addEventListener("click", () => {
    document.querySelector(".modale_background").style.display = "flex";
    listenerModalProjet();
  });
  document.querySelector(".edition_mode").addEventListener("click", () => {
    document.querySelector(".modale_background").style.display = "flex";
    
  });
}

function listenerModalProjet () {
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".modale_background").style.display = "none";
  });
}

function modalWorks(works) {
  // Sélection de l'élément HTML qui contiendra les projets dans la modale
  const projetFlex = document.querySelector(".projets_flex");

  // Parcours de la liste des projets pour les afficher dynamiquement
  works.forEach((project) => {
    // Création des éléments HTML nécessaires pour chaque projet
    const figure = document.createElement("figure"); // Conteneur pour l'image et l'icône
    const img = document.createElement("img"); // Élément image pour afficher la photo du projet
    const poubelle = document.createElement("i"); // Icône de poubelle pour la suppression

    // Configuration des attributs de l'image
    img.src = project.imageUrl; // URL de l'image du projet
    img.alt = project.title; // Texte alternatif pour l'image

    // Ajout de la classe CSS de l'icône de poubelle pour son style
    poubelle.classList.add("fa-solid", "fa-trash"); // Classes FontAwesome pour l'icône

    // Ajout des éléments dans la structure HTML de la modale
    figure.appendChild(img); // Ajout de l'image au conteneur
    figure.appendChild(poubelle); // Ajout de l'icône de poubelle au conteneur
    projetFlex.appendChild(figure); // Ajout du conteneur complet à la section des projets
  });
}

// === Exécution automatique au chargement de la page ===
// On récupère et affiche tous les projets
// On génère les filtres à partir des catégories
// Appel des fonctions au chargement de la page

async function codeExec() {

// === Gestion de l'affichage conditionnel si l'utilisateur est connecté ===
// Si un token est présent dans le localStorage :
// - On affiche les éléments d'administration (logout, édition, modifier)
// - On masque le bouton login
// - On ajoute un événement sur le bouton logout pour déconnecter l'utilisateur

// Verifie si un token est present dans le localStorage (cela signifie que l'utilisateur est connecté)

  if (localStorage.getItem("token")) {
    const login = document.querySelector(".login"); //On selectionne l'element avec la classe "login"
  
    document.querySelector(".logout").style.display = "flex"; // Affiche le bouton logout
    document.querySelector(".edition_projet").style.display = "flex"; // affiche la barre du mode edition
    document.querySelector(".modifier").style.display = "flex"; // affiche le bouton modifier
    document.querySelector(".edition_header").style.display = "flex";
    login.style.display = "none"; // on masque le bouton login car l'utilisateur est connecté
    listenerOuvertureModal();
    // On ajoute un écouteur sur le bouton logout, en cliquant on supprime le token et on redirige vers l'accueil
    document.querySelector(".logout").addEventListener("click", () => {
      localStorage.removeItem("token"); // supprime le token du localStorage
      window.location.href = "index.html"; // redirige vers la page d'accueil
    });
  }

  await apiWorks(); 
  displayWorks(allWorks);// Attend que les projets soient récupérés et stockés dans allWorks
  modalWorks(allWorks); // Appelle modalWorks avec les données récupérées
  apiCategorie(); // Appelle apiCategorie indépendamment
}

codeExec();
