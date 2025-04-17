// Sélection de l'élement HTML qui va contenir les projets
const gallery = document.querySelector(".gallery");

// Appel de l'API pour récupérer les projets depuis le serveur et les affiche dynamiquement
async function API () {fetch("http://localhost:5678/api/works")

  // Puis on transforme la réponse en JSON
  .then((reponse) => reponse.json())

  // Puis on va traiter les données reçues
  .then((data) => {

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
        figure.appendChild(img)
        gallery.appendChild(figure)
        figure.appendChild(figcaption)
    });
  });
}

// Une fois la boucle parametrer, on appel la fonction pour lancer l'affichage
API();
