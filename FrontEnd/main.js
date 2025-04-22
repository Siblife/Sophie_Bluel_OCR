// Sélection de l'élément HTML qui va contenir les projets
const gallery = document.querySelector(".gallery");
const filtre = document.getElementById("filtre");

// Variable globale pour stocker tous les projets récupérés depuis l'API
let allWorks = [];

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

// Fonction pour récupérer les projets depuis l'API et les afficher dynamiquement
function apiWorks() {
  fetch("http://localhost:5678/api/works")
    .then((reponse) => reponse.json()) // Conversion de la réponse en JSON
    .then((data) => {
      allWorks = data; // On stocke les projets dans la variable globale pour pouvoir les filtrer plus tard
      displayWorks(allWorks); // Afficher tous les projets dans la galerie
    });
}

// Fonction pour récupérer les catégories et créer les boutons de filtre
function apiCategorie() {
  fetch("http://localhost:5678/api/categories")
    .then((reponse) => reponse.json()) // Conversion de la réponse en JSON
    .then((data) => {
      // Création du bouton "Tous" pour afficher tous les projets
      const btnTous = document.createElement("button");
      btnTous.classList.add("filtre_bouton");
      btnTous.textContent = "Tous";
      btnTous.dataset.id = "0"; // ID = 0 pour "Tous"
      filtre.appendChild(btnTous);

      // Création des boutons pour chaque catégorie
      data.forEach((categorie) => {
        const btn = document.createElement("button");
        btn.classList.add("filtre_bouton");
        btn.textContent = categorie.name; // Nom de la catégorie
        btn.dataset.id = categorie.id; // ID de la catégorie dans chaque bouton
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

// Appel des fonctions pour charger les projets et les catégories dès le chargement de la page
apiWorks();
apiCategorie();
