import "./App.css";

function App() {
  return (
    <main className="app">
      <section className="hero">
        <h1>Engineer Method OS</h1>
        <p>
          Transformer mes certificats, mes cours, mes compétences et mes modèles
          de code en une méthode professionnelle.
        </p>
      </section>

      <section className="grid">
        <div className="card">
          <h2>Branche de similarité</h2>
          <p>
            Regroupe les cours communs entre mes certificats : Software
            Engineering, GitHub, React, Node.js, Python, Docker et plus.
          </p>
        </div>

        <div className="card">
          <h2>Branche de différenciation</h2>
          <p>
            Montre ce que chaque certificat apporte de spécial : JavaScript,
            DevOps, IA, Full Stack, Cloud, Testing et sécurité.
          </p>
        </div>

        <div className="card">
          <h2>Carnet de modèles</h2>
          <p>
            Garde les modèles de code importants avec une explication simple,
            une utilité et un projet lié.
          </p>
        </div>

        <div className="card">
          <h2>Preuves professionnelles</h2>
          <p>
            Transforme mes apprentissages en projets visibles pour GitHub,
            LinkedIn, Micro1 et les employeurs.
          </p>
        </div>
      </section>
    </main>
  );
}

export default App;