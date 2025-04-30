// Selection de l'élement HTML qui va contenir les projets
const gallery = document.querySelector(".gallery");
const filtre = document.getElementById("filtre");

let allWorks = []; //Variable globale pour stocker tous les projets récupérés depuis l'API

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
    gallery.appendChild(figure);
  });
}

// Appel de l'API pour récupérer les projets depuis le serveur et les afficher dynamiquement
function apiWorks() {
  fetch("http://localhost:5678/api/works")
    
    .then((reponse) => reponse.json())// Puis on transforme la réponse en JSON

    
    .then((data) => {// Puis on va traiter les données reçues
      allWorks = data; // On stocke les projets dans la variable globale pour pouvoir les filtrer plus tard

      // On vérifie la réponse dans la console pour afficher les données, puis après on les affichera dans le DOM
      console.log(data);

      // On enleve la galerie pour qu'apres on ajoute les projets
      gallery.innerHTML = "";

      //Boucle pour chaque projet reçu de l'API
      data.forEach((project) => {
        //Création des elements HTML
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");

        // Puis on ajoute les données du projet dans les balises
        img.src = project.imageUrl;
        img.alt = project.title;
        figcaption.textContent = project.title;

        // Pour finir, on construit la structure HTML et on l'insert dans le DOM
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
      });
    });
}


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

// Verifie si un token est present dans le localStorage (cela signifie que l'utilisateur est connecté)
if (localStorage.getItem("token")){
  const login = document.querySelector(".login") //On selectionne l'element avec la classe "login"

  document.querySelector(".logout").style.display = "flex";// Affiche le bouton logout
  document.querySelector(".edition_mode").style.display = "flex"; // affiche la barre du mode edition
  document.querySelector(".modifier").style.display = "flex"; // affiche le bouton modifier
  login.style.display = "none"; // on masque le bouton login car l'utilisateur est connecté

  // On ajoute un écouteur sur le bouton logout, en cliquant on supprime le token et on redirige vers l'accueil
  document.querySelector(".logout").addEventListener("click", () => {
    localStorage.removeItem("token"); // supprime le token du localStorage
    window.location.href = "index.html"; // redirige vers la page d'accueil
  })
}

// Appel des fonctions au chargement de la page
apiWorks();
apiCategorie();