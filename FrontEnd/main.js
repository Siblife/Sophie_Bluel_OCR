const gallery = document.querySelector(".gallery");

// Appel de l'API pour récupérer les projets depuis le serveur
async function API () {fetch("http://localhost:5678/api/works")
  // Puis on transforme la réponse en JSON
  .then((reponse) => reponse.json())
  // Puis on va traiter les données reçues
  .then((data) => {
    // On vérifie la réponse dans la console pour afficher les données, puis après on les affichera dans le DOM
    gallery.innerHTML = "";
    data.forEach((project) => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const figcaption = document.createElement("figcaption");
    
        img.src = project.imageUrl;
        figcaption.textContent = project.title;
    
        figure.appendChild(img)
        gallery.appendChild(figure)
        figure.appendChild(figcaption)
    });
  });
}

