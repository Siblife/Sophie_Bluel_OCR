// Appel à l'API pour récupérer les projets depuis le serveur
fetch("http://localhost:5678/api/works")
  // Puis on transforme la réponse en JSON
  .then((reponse) => reponse.json())
  // Puis on va traiter les données reçues
  .then((data) => {
    // On vérifie la réponse dans la console pour afficher les données, puis après on les affichera dans le DOM
    console.log(data);
  });

const gallery = document.querySelector(".gallery");

data.forEach((project) => {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");

  project.
});
