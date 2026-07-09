import { useEffect, useState } from "react";
import "./App.css";

function StatCard({ number, label, text }) {
  return (
    <article className="stat-card">
      <div className="stat-number">{number}</div>
      <h3>{label}</h3>
      <p>{text}</p>
    </article>
  );
}

function Badge({ children }) {
  return <span className="badge">{children}</span>;
}

function App() {
  const [certificates, setCertificates] = useState([]);
  const [courses, setCourses] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedCertificateId, setSelectedCertificateId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const base = import.meta.env.BASE_URL;

        const [certificatesResponse, coursesResponse, skillsResponse] =
          await Promise.all([
            fetch(`${base}data/certificates.json`),
            fetch(`${base}data/courses.json`),
            fetch(`${base}data/skills.json`)
          ]);

        if (!certificatesResponse.ok || !coursesResponse.ok || !skillsResponse.ok) {
          throw new Error("Impossible de charger les fichiers JSON.");
        }

        const certificatesData = await certificatesResponse.json();
        const coursesData = await coursesResponse.json();
        const skillsData = await skillsResponse.json();

        setCertificates(certificatesData);
        setCourses(coursesData);
        setSkills(skillsData);

        if (certificatesData.length > 0) {
          setSelectedCertificateId(certificatesData[0].id);
        }
      } catch (err) {
        setError(err.message);
      }
    }

    loadData();
  }, []);

  const similarityCourses = courses.filter(
    (course) => course.branch === "similarite"
  );

  const differentiationCourses = courses.filter(
    (course) => course.branch === "differenciation"
  );

  const selectedCertificate = certificates.find(
    (certificate) => certificate.id === selectedCertificateId
  );

  const selectedCourses = courses.filter((course) =>
    course.certificates.includes(selectedCertificateId)
  );

  const selectedSkills = skills.filter((skill) =>
    skill.certificates.includes(selectedCertificateId)
  );

  if (error) {
    return (
      <main className="page">
        <section className="panel">
          <h1>Erreur</h1>
          <p>{error}</p>
          <p>Vérifie que les fichiers JSON sont copiés dans frontend/public/data.</p>
        </section>
      </main>
    );
  }

  return (
    <div className="app">
      <header className="hero">
        <p className="eyebrow">Portfolio intelligent</p>
        <h1>Engineer Method OS</h1>
        <p className="subtitle">
          Transformer mes 4 certificats IBM en cours, compétences, projets et preuves professionnelles.
        </p>
      </header>

      <main className="page">
        <section className="panel">
          <h2>Tableau de bord</h2>

          <div className="stats-grid">
            <StatCard
              number={certificates.length}
              label="Certificats IBM"
              text="Les certificats professionnels utilisés dans le système."
            />
            <StatCard
              number={courses.length}
              label="Cours et concepts"
              text="Les notions apprises dans les certificats."
            />
            <StatCard
              number={skills.length}
              label="Compétences"
              text="Les compétences professionnelles démontrables."
            />
            <StatCard
              number={similarityCourses.length}
              label="Similarités"
              text="Ce qui revient dans plusieurs certificats."
            />
            <StatCard
              number={differentiationCourses.length}
              label="Différenciations"
              text="Ce que chaque certificat ajoute de spécial."
            />
          </div>
        </section>

        <section className="panel">
          <h2>Les 4 certificats</h2>

          <div className="card-grid">
            {certificates.map((certificate) => (
              <article className="card" key={certificate.id}>
                <h3>{certificate.name}</h3>
                <p>
                  <strong>Plateforme :</strong> {certificate.platform}
                </p>
                <p>
                  <strong>Domaine :</strong> {certificate.domain}
                </p>
                <p>
                  <strong>Cours :</strong> {certificate.course_count}
                </p>
                <p>{certificate.main_goal}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>Branches du système</h2>

          <div className="two-columns">
            <div>
              <h3>Branche de similarité</h3>
              <p>Les compétences qui reviennent dans plusieurs certificats.</p>

              <div className="stack">
                {similarityCourses.map((course) => (
                  <article className="mini-card" key={course.id}>
                    <h4>{course.name}</h4>
                    <p>{course.simple_explanation}</p>
                  </article>
                ))}
              </div>
            </div>

            <div>
              <h3>Branche de différenciation</h3>
              <p>Les compétences spéciales ajoutées par certains certificats.</p>

              <div className="stack">
                {differentiationCourses.map((course) => (
                  <article className="mini-card" key={course.id}>
                    <h4>{course.name}</h4>
                    <p>{course.simple_explanation}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="panel">
          <h2>Compétences professionnelles</h2>

          <div className="card-grid">
            {skills.map((skill) => (
              <article className="card" key={skill.id}>
                <h3>{skill.name}</h3>
                <p>
                  <strong>Catégorie :</strong> {skill.category}
                </p>
                <p>
                  <strong>Niveau :</strong> {skill.level}
                </p>
                <p>{skill.description}</p>

                <div className="badge-row">
                  {(skill.proof || []).slice(0, 3).map((proof) => (
                    <Badge key={proof}>{proof}</Badge>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>Chaîne de preuve</h2>
          <p>
            Choisis un certificat pour voir comment il devient une preuve professionnelle.
          </p>

          <select
            value={selectedCertificateId}
            onChange={(event) => setSelectedCertificateId(event.target.value)}
          >
            {certificates.map((certificate) => (
              <option key={certificate.id} value={certificate.id}>
                {certificate.name}
              </option>
            ))}
          </select>

          {selectedCertificate && (
            <div className="proof-box">
              <h3>{selectedCertificate.name}</h3>
              <p>{selectedCertificate.main_goal}</p>

              <h4>Cours liés</h4>
              <div className="badge-row">
                {selectedCourses.map((course) => (
                  <Badge key={course.id}>{course.name}</Badge>
                ))}
              </div>

              <h4>Compétences liées</h4>
              <div className="badge-row">
                {selectedSkills.map((skill) => (
                  <Badge key={skill.id}>{skill.name}</Badge>
                ))}
              </div>

              <p className="chain">
                Certificat → Cours → Compétence → Projet → Preuve professionnelle
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
