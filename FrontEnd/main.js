// Selection de l'élement HTML qui va contenir les projets
const gallery = document.querySelector(".gallery"); // La galerie qui contiendra tous les projets
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
    figure.classList.add("work-" + project.id, "filtre_img");

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
      displayWorks(allWorks); // Affiche les projets dans la galerie
      modalWorks(allWorks); // Affiche les projets dans la modale
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des projets :", error);
      alert(
        "Impossible de récupérer les projets. Vérifiez votre connexion ou contactez l'administrateur."
      ); // Suggestion pour l'utilisateur
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
      btnTous.classList.add("btnActive"); // Sélectionné par défaut
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
        button.addEventListener("click", (event) => {
          const id = button.dataset.id; // Récupère l'ID de la catégorie du bouton

          // Filtre les projets selon l'ID de la catégorie
          if (id === "0") {
            // Si "Tous" est sélectionné, on affiche tous les projets
            displayWorks(allWorks);
            filtreClicActif(event);
          } else {
            // Sinon, on filtre les projets de la catégorie sélectionnée
            const projetsFiltres = allWorks.filter(
              (work) => work.categoryId === parseInt(id)
            );
            displayWorks(projetsFiltres);
            filtreClicActif(event);
          }
        });
      });
    });
}

//fonction pour filtre reste sur la catégorie

function filtreClicActif(event) {
  const filtreBtn = document.querySelectorAll(".filtre_bouton");
  for (let i = 0; i < filtreBtn.length; i++) {
    filtreBtn[i].classList.remove("btnActive");
  }
  event.target.classList.add("btnActive");
}

// === Ajout des catégories dans une balise <select> ===
// Cette fonction récupère les catégories depuis l'API et les ajoute dans une balise <select>.
// Cela permet à l'utilisateur de sélectionner une catégorie lors de l'ajout d'un projet.
function ajoutCategorieSelect() {
  fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((categories) => {
      const select = document.getElementById("categorie");
      categories.forEach((categorie) => {
        const option = document.createElement("option");
        option.value = categorie.id; // Définit la valeur de l'option avec l'ID de la catégorie
        option.textContent = categorie.name; // Définit le texte affiché avec le nom de la catégorie
        select.appendChild(option); // Ajoute l'option à la balise <select>
      });
    })
    .catch((error) => {
      console.error("Erreur lors du chargement des catégories :", error);
    });
}

// === Validation du formulaire avant envoi ===
// Cette fonction vérifie que tous les champs du formulaire sont remplis avant de l'envoyer au backend.
// Elle change également l'apparence du bouton "Valider" pour indiquer si le formulaire est prêt à être soumis.
function listenerValidationFormulaire() {
  const validateButton = document.querySelector(".bouton_valider");
  const fileInput = document.getElementById("file");
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("categorie");

  function checkFormCompletion() {
    const isFileSelected = fileInput.files.length > 0;
    const isTitleFilled = titleInput.value.trim() !== "";
    const isCategorySelected = categorySelect.value !== "";

    if (isFileSelected && isTitleFilled && isCategorySelected) {
      validateButton.style.backgroundColor = "#1D6154";
      validateButton.style.color = "#FFFFFF";
      validateButton.style.cursor = "pointer";
    } else {
      validateButton.style.backgroundColor = "#cbd6dc";
      validateButton.style.color = "#306685";
      validateButton.style.cursor = "not-allowed";
    }
  }

  // Ajout des écouteurs d'événements sur les champs pour vérifier la complétion du formulaire
  fileInput.addEventListener("change", checkFormCompletion);
  titleInput.addEventListener("input", checkFormCompletion);
  categorySelect.addEventListener("change", checkFormCompletion);

  // Écouteur pour le clic sur le bouton "Valider"
  validateButton.addEventListener("click", (event) => {
    event.preventDefault();

    // Vérification finale des champs avant soumission
    const image = fileInput.files[0];
    const title = titleInput.value;
    const category = categorySelect.value;

    if (!image || !title || !category) {
      alert("Veuillez remplir tous les champs !"); // Alerte si des champs sont vides
      return;
    }

    console.log("Formulaire valide :", { image, title, category });
    ajouterProjet(image, title, category); // Appel de la fonction pour ajouter le projet
  });
}

// === Ajout d'un projet au backend ===
// Cette fonction envoie un nouveau projet au backend via une requête POST.
function ajouterProjet(image, title, category) {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("title", title);
  formData.append("category", category);

  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Erreur lors de l'ajout du projet");
      }
    })
    .then((data) => {
      console.log("Projet ajouté :", data);
      alert("Projet ajouté avec succès !");
      document.querySelector(".ajout_projet").style.display = "none";
      const formulairePhoto = document.querySelector("form");
      document.querySelector(".fa-image").style.display = "flex";
      document.querySelector(".bouton_ajouter").style.display = "flex";
      document.querySelector(".ajouter_photo p").style.display = "flex";
      document.querySelector(".ajouter_photo img").remove();
      formulairePhoto.reset();
      document.querySelector(".ombre").classList.remove("fond_ombre");
      const tabWorks = document.querySelectorAll(".filtre_img");
      for (let i = 0; i < tabWorks.length; i++) {
        tabWorks[i].classList.remove("brightness_img");
      }
      apiWorks(); // Recharge les projets pour mettre à jour la galerie
    })
    .catch((error) => {
      console.error("Erreur :", error);
      alert("Une erreur est survenue lors de l'ajout du projet.");
    });
}

// === Fonction d'écoute pour l'ouverture de la modale ===
// Cette fonction ajoute des écouteurs d'événements sur les boutons "modifier" et "édition".
// Lorsqu'un bouton est cliqué, elle affiche la modale et initialise l'evenement de fermeture.

function listenerOuvertureModal() {
  document.querySelector(".modifier").addEventListener("click", () => {
    document.querySelector(".modale_background").style.display = "flex"; // Affiche la modale
    document.querySelector(".ombre").classList.add("fond_ombre");
    const tabWorks = document.querySelectorAll(".filtre_img");
    for (let i = 0; i < tabWorks.length; i++) {
      tabWorks[i].classList.add("brightness_img");
    }
    listenerModalProjet(); // Initialise l'écouteur pour la fermeture
  });
  document.querySelector(".edition_mode").addEventListener("click", () => {
    document.querySelector(".modale_background").style.display = "flex"; // Affiche la modale
    document.querySelector(".ombre").classList.add("fond_ombre");
    listenerModalProjet();
    const tabWorks = document.querySelectorAll(".filtre_img");
    for (let i = 0; i < tabWorks.length; i++) {
      tabWorks[i].classList.add("brightness_img");
    }
  });

  const modale1 = document.querySelector(".modale_background");
  const modale2 = document.querySelector(".ajout_projet");

  document.addEventListener("click", (event) => {
    if (
      !modale1.contains(event.target) &&
      !modale2.contains(event.target) &&
      !document.querySelector(".modifier").contains(event.target) &&
      !document.querySelector(".edition_mode").contains(event.target)
    ) {
      modale1.style.display = "none"; // Masque la première modale
      modale2.style.display = "none"; // Masque la deuxième modale
      document.querySelector(".ombre").classList.remove("fond_ombre");
      const tabWorks = document.querySelectorAll(".filtre_img");
      for (let i = 0; i < tabWorks.length; i++) {
        tabWorks[i].classList.remove("brightness_img");
      }
    }
  });
}

// === Fonction d'écoute pour la fermeture de la modale ===
// Cette fonction ajoute un écouteur sur l'icône de fermeture (croix),
// qui masque la modale lorsqu'on clique dessus.

function listenerModalProjet() {
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".modale_background").style.display = "none"; //Masque la modale
    document.querySelector(".ombre").classList.remove("fond_ombre");
    const tabWorks = document.querySelectorAll(".filtre_img");
    for (let i = 0; i < tabWorks.length; i++) {
      tabWorks[i].classList.remove("brightness_img");
    }
  });
}

// === Fonction d'écoute pour l'ouverture de la modale d'ajout de projet ===
// Cette fonction ajoute un écouteur sur le bouton "button_modale",
// qui masque la modale actuelle et affiche la modale d'ajout de projet.

function listenerGalerieAjouterPhoto() {
  document.querySelector(".button_modale").addEventListener("click", () => {
    document.querySelector(".modale_background").style.display = "none";
    document.querySelector(".ajout_projet").style.display = "flex";
    retourArrow();
    closeModal2();
  });
}

// === Fonction d'écoute sur la fleche de la modale 2 pour retourner sur la 1ere modale ===

function retourArrow() {
  document.querySelector(".fa-arrow-left").addEventListener("click", () => {
    document.querySelector(".ajout_projet").style.display = "none";
    document.querySelector(".modale_background").style.display = "flex";
  });
}

// === Fonction fermeture modale2 avec la croix ===
function closeModal2() {
  document.querySelector(".close2").addEventListener("click", () => {
    document.querySelector(".ajout_projet").style.display = "none"; //Masque la modale
    document.querySelector(".ombre").classList.remove("fond_ombre");
    const tabWorks = document.querySelectorAll(".filtre_img");
    for (let i = 0; i < tabWorks.length; i++) {
      tabWorks[i].classList.remove("brightness_img");
    }
  });
}

// === Fonction d'affichage des projets dans la modale ===
// Cette fonction prend une liste de projets et les affiche dans la modale sous forme de figures.
// Chaque figure contient une image du projet et une icône de poubelle pour la suppression future.

function modalWorks(works) {
  // Sélection de l'élément HTML qui contiendra les projets dans la modale
  const projetFlex = document.querySelector(".projets_flex");
  projetFlex.innerHTML = "";
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

    poubelle.addEventListener("click", () => {
      figure.remove(); // Enleve les projets de la modale
      document.querySelector(".work-" + project.id).remove(); //Supprime de la gallery
      fetch("http://localhost:5678/api/works/" + project.id, {
        // Supprime de l'api
        method: "DELETE",
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
    });
    // Ajout des éléments dans la structure HTML de la modale
    figure.appendChild(img); // Ajout de l'image au conteneur
    figure.appendChild(poubelle); // Ajout de l'icône de poubelle au conteneur
    projetFlex.appendChild(figure); // Ajout du conteneur complet à la section des projets
  });
}

// === Ajout d'un ecouteur sur le bouton ajouter une photo pour avoir la prevu de l'image ===
//
//

// Ajout d'un écouteur d'événement sur l'input de type file pour afficher une prévisualisation de l'image sélectionnée
const fileInput = document.getElementById("file");
const ajouterPhotoDiv = document.querySelector(".ajouter_photo");

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0]; // Récupère le fichier sélectionné

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      // Crée une balise img pour afficher l'image
      const img = document.createElement("img");
      img.src = e.target.result; // URL de l'image
      img.alt = "Prévisualisation de l'image";
      img.style.maxWidth = "100%";
      img.style.maxHeight = "100%";

      // Vide le contenu actuel de la div et ajoute l'image
      document.querySelector(".fa-image").style.display = "none";
      document.querySelector(".bouton_ajouter").style.display = "none";
      document.querySelector(".ajouter_photo p").style.display = "none";
      ajouterPhotoDiv.appendChild(img);
    };

    reader.readAsDataURL(file); // Lit le fichier comme une URL
  }
});

// === Exécution automatique au chargement de la page ===
// Cette fonction s'exécute automatiquement au chargement de la page.
// Elle récupère les projets et les catégories depuis l'API,
// configure l'affichage en fonction de la connexion utilisateur,
// puis initialise les modales et les filtres dynamiques.

async function codeExec() {
  // === Gestion de l'affichage conditionnel si l'utilisateur est connecté ===
  // Si un token est présent dans le localStorage :
  // - On affiche les éléments d'administration (logout, édition, modifier)
  // - On masque le bouton login
  // - Active la modale via les boutons
  // - Ajoute un événement "logout" pour supprimer le token et rediriger l'utilisateur

  // Verifie si un token est present dans le localStorage (cela signifie que l'utilisateur est connecté)

  if (localStorage.getItem("token")) {
    const login = document.querySelector(".login"); //On selectionne l'element avec la classe "login"

    document.querySelector(".logout").style.display = "flex"; // Affiche le bouton logout
    document.querySelector(".edition_projet").style.display = "flex"; // affiche la barre du mode edition
    document.querySelector(".modifier").style.display = "flex"; // affiche le bouton modifier
    document.querySelector(".edition_header").style.display = "flex";
    filtre.style.display = "none";
    login.style.display = "none"; // on masque le bouton login car l'utilisateur est connecté
    listenerOuvertureModal(); // Active les boutons d'ouverture de la modale

    // On ajoute un écouteur sur le bouton logout, en cliquant on supprime le token et on redirige vers l'accueil
    document.querySelector(".logout").addEventListener("click", () => {
      localStorage.removeItem("token"); // supprime le token du localStorage
      window.location.href = "index.html"; // redirige vers la page d'accueil
    });
  }

  await apiWorks();
  displayWorks(allWorks); // Attend que les projets soient récupérés et stockés dans allWorks
  modalWorks(allWorks); // Appelle modalWorks avec les données récupérées
  apiCategorie(); // Appelle apiCategorie indépendamment
  listenerGalerieAjouterPhoto();
  ajoutCategorieSelect();
  listenerValidationFormulaire();
}

codeExec();
