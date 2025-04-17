// Appel à l'API pour récupérer les projets 
fetch("http://localhost:5678/api/works")
    // Puis on transforme la réponse en JSON
    .then(reponse => reponse.json())
    // Puis on va traiter les données reçues
    .then(data => {
        // On vérifie la réponse dans la console pour afficher les données
        console.log(data);

    })