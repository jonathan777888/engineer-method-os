const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "data");

function loadJSON(fileName) {
  const filePath = path.join(DATA_PATH, fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const rawData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(rawData);
}

const certificates = loadJSON("certificates.json");
const courses = loadJSON("courses.json");
const skills = loadJSON("skills.json");

function printTitle(title) {
  console.log("\n==================================================");
  console.log(title.toUpperCase());
  console.log("==================================================\n");
}

function printSection(title) {
  console.log(`\n--- ${title} ---\n`);
}

function getSimilarityCourses() {
  return courses.filter((course) => course.branch === "similarite");
}

function getDifferentiationCourses() {
  return courses.filter((course) => course.branch === "differenciation");
}

function getCoursesForCertificate(certificateId) {
  return courses.filter((course) => {
    return course.certificates.includes(certificateId);
  });
}

function getSkillsForCertificate(certificateId) {
  return skills.filter((skill) => {
    return skill.certificates.includes(certificateId);
  });
}

function getCertificateById(certificateId) {
  return certificates.find((certificate) => certificate.id === certificateId);
}

function buildProofChain(certificateId) {
  const certificate = getCertificateById(certificateId);

  if (!certificate) {
    return null;
  }

  return {
    certificate,
    courses: getCoursesForCertificate(certificateId),
    skills: getSkillsForCertificate(certificateId),
    projects: certificate.projects || []
  };
}

function renderDashboard() {
  printTitle("Engineer Method OS - Dashboard");

  console.log("Mission:");
  console.log(
    "Transformer mes certificats, cours, projets et compétences en preuves professionnelles."
  );

  printSection("Résumé des données");
  console.log(`Certificats enregistrés : ${certificates.length}`);
  console.log(`Cours et concepts enregistrés : ${courses.length}`);
  console.log(`Compétences professionnelles enregistrées : ${skills.length}`);

  printSection("Branches principales");
  console.log(`Branche de similarité : ${getSimilarityCourses().length} cours`);
  console.log(
    `Branche de différenciation : ${getDifferentiationCourses().length} cours`
  );

  printSection("Logique centrale");
  console.log("Certificat → Cours → Compétence → Projet → Preuve professionnelle");

  printSection("Commandes disponibles");
  console.log("npm start");
  console.log("npm run dashboard");
  console.log("npm run certificates");
  console.log("npm run similarites");
  console.log("npm run differenciations");
  console.log("node src/app.js proof <certificate-id>");
}

function renderCertificates() {
  printTitle("Certificats");

  certificates.forEach((certificate, index) => {
    console.log(`${index + 1}. ${certificate.name}`);
    console.log(`   ID : ${certificate.id}`);
    console.log(`   Plateforme : ${certificate.platform}`);
    console.log(`   Domaine : ${certificate.domain}`);
    console.log(`   Objectif : ${certificate.main_goal}`);
    console.log("");
  });
}

function renderSimilarityBranch() {
  printTitle("Branche de similarité");

  console.log(
    "Cette branche montre les compétences communes qui reviennent dans plusieurs certificats.\n"
  );

  getSimilarityCourses().forEach((course, index) => {
    console.log(`${index + 1}. ${course.name}`);
    console.log(`   Domaine : ${course.skill_area}`);
    console.log(`   Explication : ${course.simple_explanation}`);
    console.log(`   Certificats liés : ${course.certificates.join(", ")}`);
    console.log("");
  });
}

function renderDifferentiationBranch() {
  printTitle("Branche de différenciation");

  console.log(
    "Cette branche montre ce que chaque certificat ajoute de spécial à mon profil.\n"
  );

  getDifferentiationCourses().forEach((course, index) => {
    console.log(`${index + 1}. ${course.name}`);
    console.log(`   Domaine : ${course.skill_area}`);
    console.log(`   Explication : ${course.simple_explanation}`);
    console.log(`   Certificats liés : ${course.certificates.join(", ")}`);
    console.log("");
  });
}

function renderProofChain(certificateId) {
  const proofChain = buildProofChain(certificateId);

  if (!proofChain) {
    printTitle("Certificat introuvable");
    console.log(`Aucun certificat trouvé avec l'id : ${certificateId}`);
    console.log("\nUtilise la commande suivante pour voir les ids disponibles :");
    console.log("npm run certificates");
    return;
  }

  const { certificate, courses, skills, projects } = proofChain;

  printTitle(`Chaîne de preuve - ${certificate.name}`);

  printSection("1. Certificat");
  console.log(certificate.name);
  console.log(`Plateforme : ${certificate.platform}`);
  console.log(`Domaine : ${certificate.domain}`);
  console.log(`Objectif : ${certificate.main_goal}`);

  printSection("2. Cours et concepts liés");
  if (courses.length === 0) {
    console.log("Aucun cours lié pour le moment.");
  } else {
    courses.forEach((course) => {
      console.log(`- ${course.name} (${course.branch})`);
    });
  }

  printSection("3. Compétences professionnelles liées");
  if (skills.length === 0) {
    console.log("Aucune compétence liée pour le moment.");
  } else {
    skills.forEach((skill) => {
      console.log(`- ${skill.name} | Niveau : ${skill.level}`);
    });
  }

  printSection("4. Projets et preuves");
  if (projects.length === 0) {
    console.log("Aucun projet lié pour le moment.");
  } else {
    projects.forEach((project) => {
      console.log(`- ${project.name}`);
      console.log(`  Description : ${project.description}`);
      console.log(`  Repo : ${project.repo}`);
    });
  }

  printSection("Résumé");
  console.log(
    `${certificate.name} construit une partie de mon profil professionnel en reliant des cours, des compétences et des preuves concrètes.`
  );
}

function renderSkills() {
  printTitle("Compétences professionnelles");

  skills.forEach((skill, index) => {
    console.log(`${index + 1}. ${skill.name}`);
    console.log(`   Catégorie : ${skill.category}`);
    console.log(`   Niveau : ${skill.level}`);
    console.log(`   Description : ${skill.description}`);
    console.log(`   Preuves : ${skill.proof.join(", ")}`);
    console.log("");
  });
}

function runApp() {
  const command = process.argv[2] || "dashboard";
  const argument = process.argv[3];

  if (command === "dashboard") {
    renderDashboard();
    return;
  }

  if (command === "certificates") {
    renderCertificates();
    return;
  }

  if (command === "similarites") {
    renderSimilarityBranch();
    return;
  }

  if (command === "differentiations" || command === "differenciations") {
    renderDifferentiationBranch();
    return;
  }

  if (command === "skills") {
    renderSkills();
    return;
  }

  if (command === "proof") {
    if (!argument) {
      console.log("Tu dois donner l'id d'un certificat.");
      console.log("Exemple : node src/app.js proof ibm-full-stack");
      return;
    }

    renderProofChain(argument);
    return;
  }

  printTitle("Commande inconnue");
  console.log(`Commande reçue : ${command}`);
  console.log("\nCommandes disponibles :");
  console.log("node src/app.js dashboard");
  console.log("node src/app.js certificates");
  console.log("node src/app.js similarites");
  console.log("node src/app.js differentiations");
  console.log("node src/app.js skills");
  console.log("node src/app.js proof <certificate-id>");
}

runApp();
