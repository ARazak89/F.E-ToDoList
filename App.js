// ========= datepicker ===========
// Data Picker Initialization
$(document).ready(function () {
  $('input[type="date"]').on('change', function () {
    // Récupérer la date sélectionnée
    const selectedDate = $(this).val();
    console.log('Date sélectionnée : ' + selectedDate);
  });
});
// ========= datepicker ===========
const body = document.body;
let id=0;
// Fonction pour ajouter un élément à la liste
function ajouterElementALaListe() {
  const categorie = document.getElementById('categorie').value;
  const titre = document.getElementById('titre').value;
  const date = document.getElementById('date').value;
  const description = document.getElementById('description').value;
  const statut = document.getElementById('statut').value;
  id++; /* Hassane Abdel-Razak */
  // Créez un nouvel objet représentant l'élément
  const nouvelElement = {
    id: id,
    categorie: categorie,
    titre: titre,
    date: date,
    description: description,
    statut: statut,

  };

  // Ajoutez l'objet à un tableau de tâches
  let listeTaches = JSON.parse(localStorage.getItem('listeTaches')) || [];
  listeTaches.push(nouvelElement);
  localStorage.setItem('listeTaches', JSON.stringify(listeTaches));
  localStorage.setItem('lastID', JSON.stringify(id));

  // Afficher l'élément dans la liste
  afficherElementDansListe(nouvelElement);

  // Effacez les valeurs du formulaire après l'ajout
  document.getElementById('categorie').value = '';
  document.getElementById('titre').value = '';
  document.getElementById('date').value = '';
  document.getElementById('description').value = '';
  document.getElementById('statut').value = 'Nouveau';
  updateDoughnutChart();
}

// Fonction pour afficher un élément dans la liste
function afficherElementDansListe(element) {
  const desc = document.querySelector('.descripTache');
  const liste = document.getElementById('list');
  const nouvelElementLi = document.createElement('li');

  nouvelElementLi.innerHTML = `
    <p> ${element.id}</p>
    <p> ${element.date}</p>
    <p> ${element.titre}</p>
   <p> ${element.categorie}</p>
      <p>
      <button class="voir" data-index="${liste.children.length}"><i class="fa-regular fa-eye"></i></button>
      <button class="modifier" data-index="${liste.children.length}"><i class="fa-regular fa-pen-to-square"></i></button>
      <button class="supprimer" data-index="${liste.children.length}"><i class="fa-solid fa-trash"></i></button>
      </p>
      `;
  liste.appendChild(nouvelElementLi);
  // Associez un gestionnaire d'événements au bouton "voir"
  const boutonVoir = nouvelElementLi.querySelector('.voir');
  boutonVoir.addEventListener('click', function () {
    event.stopPropagation(); // Empêchez la propagation de l'événement de clic pour éviter que les deux actions se produisent en même temps
    voirElement(element, boutonVoir.getAttribute('data-index'));
  });
  // Associez un gestionnaire d'événements au bouton "Modifier"
  const boutonModifier = nouvelElementLi.querySelector('.modifier');
  boutonModifier.addEventListener('click', function () {
    modifierElement(element, boutonModifier.getAttribute('data-index'));
  });

  // Associez un gestionnaire d'événements au bouton "Supprimer"
  const boutonSupprimer = nouvelElementLi.querySelector('.supprimer');
  boutonSupprimer.addEventListener('click', function () {
    supprimerElement(boutonSupprimer.getAttribute('data-index'));
  });

  // Associez un gestionnaire d'événements au texte de l'élément pour afficher la description
  nouvelElementLi.addEventListener('click', function () {
    // Vous pouvez afficher la description de l'élément ici
    const description = element.description;
    desc.innerHTML = `<p>${description}</p>`;
    // alert('Description : ' + description);
  });
}

function masquerTacheInfo() {
  document.querySelector('.tacheInfo').setAttribute('style', 'display:none');
  body.removeEventListener('click', masquerTacheInfo); // Supprime l'événement après utilisation
  console.log('hohohohoh');
}


// Fonction pour voir un élément de la liste
function voirElement(element, index) { 
  /* Hassane Abdel-Razak */
  // Remplissez le formulaire avec les données de l'élément à modifier
  document.querySelector('.tInfodate').textContent = element.date;
  document.querySelector('.tInfoTitre').textContent = element.titre;
  document.querySelector('.tInfoCat').textContent = element.categorie;
  document.querySelector('.tInfoDesc').textContent = element.description;
  document.querySelector('.tInfoStatut').textContent = element.statut;
  document.querySelector('.tacheInfo').setAttribute('style', 'display:block');

  console.log('héhéhéhé');
  body.addEventListener('click', masquerTacheInfo);

  // Empêchez la propagation de l'événement de clic pour éviter que les deux actions se produisent en même temps
  event.stopPropagation();
}

// Fonction pour modifier un élément de la liste
function modifierElement(element, index) {
  // Remplissez le formulaire avec les données de l'élément à modifier
  document.getElementById('categorie').value = element.categorie;
  document.getElementById('titre').value = element.titre;
  document.getElementById('date').value = element.date;
  document.getElementById('description').value = element.description;
  document.getElementById('statut').value = element.statut;

  // Supprimez l'élément de la liste
  supprimerElement(index);
  updateDoughnutChart();
}

// Fonction pour supprimer un élément de la liste
function supprimerElement(index) {
  const listeTaches = JSON.parse(localStorage.getItem('listeTaches')) || [];
  listeTaches.splice(index, 1);
  localStorage.setItem('listeTaches', JSON.stringify(listeTaches));
  id=id-1;
  localStorage.setItem('lastID', JSON.stringify(id));

  const liste = document.getElementById('list');
  liste.removeChild(liste.children[index]);
  updateDoughnutChart();
}

// Associez la fonction d'ajout à l'événement "submit" du formulaire
const formulaire = document.querySelector('.ajouterTache');
formulaire.addEventListener('submit', function (e) {
  e.preventDefault(); // Empêche le formulaire de se soumettre normalement
  ajouterElementALaListe(); // Appelle la fonction d'ajout
});

// Au chargement de la page, récupérez la liste depuis le localStorage et affichez-la
window.addEventListener('load', function () {
  const lastId = JSON.parse(localStorage.getItem('lastID'))|| 0;
  console.log(lastId);
  id = parseInt(lastId); // Assurez-vous que id est un nombre entier
  const listeTaches = JSON.parse(localStorage.getItem('listeTaches')) || [];
  listeTaches.forEach(function (element) {
    afficherElementDansListe(element);
  });
  updateDoughnutChart();
});

// ====================================doughnut =================
// Récupérez le canvas avec l'ID "doughnutChart"
const doughnutChartCanvas = document.getElementById('doughnutChart');

// Fonction pour mettre à jour le graphique en anneau
function updateDoughnutChart() {
  // Récupérez les tâches depuis le localStorage
  const listeTaches = JSON.parse(localStorage.getItem('listeTaches')) || [];

  // Comptez le nombre de tâches dans chaque statut
  let nouveauCount = 0;
  let enCoursCount = 0;
  let termineCount = 0;

  listeTaches.forEach(function (element) {
    if (element.statut === 'Nouveau') {
      nouveauCount++;
    } else if (element.statut === 'En Cours') {
      enCoursCount++;
    } else if (element.statut === 'Terminé') {
      termineCount++;
    }
  });
/* Hassane Abdel-Razak */
  // Données du graphique basées sur les compteurs
  const data = {
    labels: ['Nouveau', 'En Cours', 'Terminé'],
    datasets: [{
      data: [nouveauCount, enCoursCount, termineCount],
      backgroundColor: ['#FF5733', '#33FF57', '#5733FF'],
    }],
  };

  // Configuration du graphique en anneau
  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  // Créez ou mettez à jour le graphique en anneau
  if (window.myDoughnutChart) {
    window.myDoughnutChart.data = data;
    window.myDoughnutChart.update();
  } else {
    window.myDoughnutChart = new Chart(doughnutChartCanvas, {
      type: 'doughnut',
      data: data,
      options: doughnutChartOptions,
    });
  }
}

// Appelez la fonction pour mettre à jour le graphique lors du chargement de la page
document.addEventListener('DOMContentLoaded', function () {
  const ajouter = document.getElementById('ajouter');
  const notification = document.querySelector('.notification');
  const contenu = document.querySelector('.contenu');
  // Ajoutez un gestionnaire d'événements pour le bouton "Ajouter"
  ajouter.addEventListener('click', function (event) {
    // Affichez la notification
    contenu.textContent = "L'enregistrement s'est effectué avec succès";
    notification.style.display = 'block';
    // Masquez la notification après 3 secondes (3000 millisecondes)
    setTimeout(function () {
      notification.style.display = 'none';
    }, 3000);
  });
});


