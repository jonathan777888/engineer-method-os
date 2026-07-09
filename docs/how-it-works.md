# Comment Engineer Method OS est codé

Engineer Method OS est codé comme une application organisée en plusieurs couches.

Le logiciel ne sert pas seulement à lister des certificats. Il transforme des certificats, des cours, des compétences et des projets en preuves professionnelles.

La logique principale du logiciel est :

```text
Certificat → Cours → Compétence → Projet → Preuve professionnelle
```

---

## 1. Architecture générale du projet

Le projet est organisé comme ceci :

```text
engineer-method-os/
│
├── README.md
│
├── data/
│   ├── certificates.json
│   ├── courses.json
│   └── skills.json
│
├── docs/
│   ├── how-it-works.md
│   ├── architecture.md
│   ├── similarites.md
│   └── differenciations.md
│
└── src/
    └── app.js
```

Chaque dossier a un rôle précis.

---

## 2. Le dossier data

Le dossier `data/` contient les données principales du logiciel.

Ces fichiers fonctionnent comme une petite base de données.

```text
data/certificates.json → contient les certificats
data/courses.json      → contient les cours et concepts appris
data/skills.json       → contient les compétences professionnelles
```

Le logiciel lit ces fichiers pour comprendre mon parcours.

---

## 3. Le fichier certificates.json

Le fichier `certificates.json` contient les certificats.

Chaque certificat est écrit sous forme d'objet JSON.

Exemple simplifié :

```json
{
  "id": "ibm-full-stack",
  "name": "IBM Full Stack Software Developer",
  "platform": "IBM Skills Network / Coursera",
  "domain": "Software Engineering",
  "common_skills": ["GitHub", "Python", "API REST"],
  "unique_contribution": ["React", "Django", "Node.js"],
  "projects": [
    {
      "name": "Online Course Django",
      "repo": "https://github.com/jonathan777888/online-course-django"
    }
  ]
}
```

Le champ le plus important est :

```text
id
```

L'id sert à connecter ce certificat avec les cours et les compétences.

Exemple :

```text
ibm-full-stack
```

Cet id peut ensuite être utilisé dans `courses.json` et `skills.json`.

---

## 4. Le fichier courses.json

Le fichier `courses.json` contient les cours, notions et concepts appris.

Chaque cours indique à quels certificats il est lié.

Exemple :

```json
{
  "id": "python",
  "name": "Python Programming",
  "certificates": [
    "ibm-full-stack",
    "ibm-devops",
    "ibm-ai-python"
  ],
  "branch": "similarite",
  "skill_area": "Programming",
  "simple_explanation": "Python est utilisé pour le backend, les scripts, l'IA et l'automatisation."
}
```

Ici, le cours Python est lié à plusieurs certificats.

Cela permet au logiciel de comprendre que Python est une compétence commune.

---

## 5. Le champ branch

Dans `courses.json`, chaque cours possède un champ :

```text
branch
```

Il peut avoir deux valeurs principales :

```text
similarite
differenciation
```

---

## 6. Branche de similarité

La branche de similarité regroupe ce qui revient dans plusieurs certificats.

Exemples :

```text
Python
GitHub
API REST
Testing
Documentation
Agile
Debugging
```

Dans le code, cela veut dire :

```javascript
const similarCourses = courses.filter(course => course.branch === "similarite");
```

Cette fonction récupère seulement les cours qui appartiennent à la branche de similarité.

Le but est de montrer les fondations communes de mon profil.

---

## 7. Branche de différenciation

La branche de différenciation montre ce que chaque certificat ajoute de spécial.

Exemples :

```text
React
Django
Docker
Kubernetes
CI/CD
Watson NLP
Observation agricole
Lutte intégrée
```

Dans le code, cela veut dire :

```javascript
const uniqueCourses = courses.filter(course => course.branch === "differenciation");
```

Cette fonction récupère les cours spécialisés.

Le but est de montrer la valeur unique de chaque certificat.

---

## 8. Le fichier skills.json

Le fichier `skills.json` transforme les cours en compétences professionnelles.

Exemple :

```json
{
  "id": "backend-development",
  "name": "Backend Development",
  "category": "Web Development",
  "level": "developing",
  "certificates": [
    "ibm-full-stack",
    "ibm-ai-python"
  ],
  "description": "Créer la partie serveur d'une application.",
  "proof": [
    "Django project",
    "Flask Emotion Detection",
    "Express Book Reviews"
  ]
}
```

Ce fichier répond à la question :

```text
Qu'est-ce que je peux réellement faire ?
```

---

## 9. Comment les fichiers sont connectés

Le logiciel connecte les fichiers grâce aux ids.

Exemple :

```text
certificates.json
id: ibm-full-stack
```

Puis dans `courses.json` :

```json
"certificates": ["ibm-full-stack"]
```

Puis dans `skills.json` :

```json
"certificates": ["ibm-full-stack"]
```

Cela permet au logiciel de comprendre :

```text
Le certificat IBM Full Stack est lié à certains cours.
Ces cours sont liés à certaines compétences.
Ces compétences sont liées à des preuves.
```

---

## 10. Logique du logiciel

La logique du logiciel peut être représentée comme ceci :

```text
1. Lire certificates.json
2. Lire courses.json
3. Lire skills.json
4. Afficher tous les certificats
5. Afficher les cours liés à chaque certificat
6. Séparer les cours en similarité et différenciation
7. Afficher les compétences liées
8. Afficher les preuves professionnelles
```

En JavaScript, la logique ressemble à ceci :

```javascript
const certificates = loadJSON("data/certificates.json");
const courses = loadJSON("data/courses.json");
const skills = loadJSON("data/skills.json");

const similarCourses = courses.filter(course => course.branch === "similarite");
const differentCourses = courses.filter(course => course.branch === "differenciation");

function getCoursesForCertificate(certificateId) {
  return courses.filter(course => course.certificates.includes(certificateId));
}

function getSkillsForCertificate(certificateId) {
  return skills.filter(skill => skill.certificates.includes(certificateId));
}
```

---

## 11. Fonction : trouver les cours d'un certificat

Cette fonction sert à savoir quels cours appartiennent à un certificat.

```javascript
function getCoursesForCertificate(certificateId) {
  return courses.filter(course => {
    return course.certificates.includes(certificateId);
  });
}
```

Exemple :

```javascript
getCoursesForCertificate("ibm-full-stack");
```

Résultat attendu :

```text
Python
GitHub
React
Django
API REST
Testing
Documentation
```

---

## 12. Fonction : trouver les compétences d'un certificat

Cette fonction sert à savoir quelles compétences professionnelles sont liées à un certificat.

```javascript
function getSkillsForCertificate(certificateId) {
  return skills.filter(skill => {
    return skill.certificates.includes(certificateId);
  });
}
```

Exemple :

```javascript
getSkillsForCertificate("ibm-devops");
```

Résultat attendu :

```text
DevOps Foundation
Cloud Deployment
Testing and Quality Control
Git and GitHub
```

---

## 13. Fonction : créer une chaîne de preuve

Engineer Method OS doit montrer une chaîne claire :

```text
Certificat → Cours → Compétence → Preuve
```

Exemple :

```javascript
function buildProofChain(certificateId) {
  const certificate = certificates.find(cert => cert.id === certificateId);
  const relatedCourses = getCoursesForCertificate(certificateId);
  const relatedSkills = getSkillsForCertificate(certificateId);

  return {
    certificate,
    courses: relatedCourses,
    skills: relatedSkills
  };
}
```

Exemple d'utilisation :

```javascript
buildProofChain("ibm-full-stack");
```

Le logiciel peut ensuite afficher :

```text
IBM Full Stack
→ Django
→ Backend Development
→ Online Course Django
→ Preuve GitHub
```

---

## 14. Partie affichage

La partie affichage sert à montrer les données à l'utilisateur.

L'application peut afficher plusieurs sections :

```text
1. Tableau de bord
2. Liste des certificats
3. Branche de similarité
4. Branche de différenciation
5. Compétences professionnelles
6. Projets et preuves
7. Prochaines étapes
```

Chaque section est générée à partir des fichiers JSON.

---

## 15. Exemple de carte de certificat

Dans l'interface, un certificat peut être affiché comme une carte.

Exemple logique :

```javascript
function renderCertificateCard(certificate) {
  return `
    <section class="certificate-card">
      <h2>${certificate.name}</h2>
      <p>${certificate.platform}</p>
      <p>${certificate.main_goal}</p>
    </section>
  `;
}
```

Le but est de transformer les données JSON en contenu lisible.

---

## 16. Exemple de carte de compétence

Une compétence peut aussi être affichée comme une carte.

```javascript
function renderSkillCard(skill) {
  return `
    <section class="skill-card">
      <h2>${skill.name}</h2>
      <p>Niveau : ${skill.level}</p>
      <p>${skill.description}</p>
    </section>
  `;
}
```

Cela permet de montrer clairement ce que je sais faire.

---

## 17. Exemple de filtre par branche

Le logiciel peut afficher seulement les similarités :

```javascript
function getSimilarityBranch() {
  return courses.filter(course => course.branch === "similarite");
}
```

Ou seulement les différenciations :

```javascript
function getDifferentiationBranch() {
  return courses.filter(course => course.branch === "differenciation");
}
```

Cela permet de séparer :

```text
ce qui est commun
```

et

```text
ce qui est spécial
```

---

## 18. Ce que l'application doit montrer

L'application doit montrer que mon parcours est structuré.

Elle doit faire comprendre :

```text
Je n'ai pas seulement plusieurs certificats.
J'ai une méthode.
J'ai des compétences.
J'ai des projets.
J'ai des preuves.
```

---

## 19. Résumé du fonctionnement codé

Engineer Method OS fonctionne avec cette logique :

```text
Données JSON
→ Fonctions JavaScript
→ Filtres
→ Connexions entre ids
→ Affichage en sections
→ Preuves professionnelles
```

Le code est donc organisé en trois couches :

```text
1. Data layer
   Les fichiers JSON qui stockent les certificats, cours et compétences.

2. Logic layer
   Les fonctions JavaScript qui filtrent, connectent et organisent les données.

3. Display layer
   L'interface qui affiche les certificats, les branches, les compétences et les preuves.
```

---

## 20. Objectif final du code

Le code doit permettre de répondre automatiquement à ces questions :

```text
Quels certificats ai-je ?
Quels cours ai-je appris ?
Quelles compétences reviennent souvent ?
Qu'est-ce que chaque certificat ajoute de spécial ?
Quels projets prouvent mes compétences ?
Quelle est ma progression vers le métier d'ingénieur logiciel ?
```

Engineer Method OS est donc codé comme un système de transformation :

```text
apprentissage brut → structure → compétence → preuve → portfolio professionnel
```
