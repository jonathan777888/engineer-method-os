import { generateText } from "ai";

const MODEL = "openai/gpt-5.4";

const SYSTEM_PROMPT = `Tu es Engineer Method OS, un mentor d'ingénierie logicielle en français connecté à un atelier de fabrication de logiciels.

Mission : transformer les idées de l'utilisateur en logiciels réels TOUT EN lui faisant maîtriser les compétences de ses quatre certificats IBM.

Certificats et cours de référence :
1. IBM Full Stack Software Developer : Introduction to Software Engineering; Introduction to Cloud Computing; Introduction to HTML, CSS, & JavaScript; Getting Started with Git and GitHub; Developing Front-End Apps with React; Developing Back-End Apps with Node.js and Express; Python for Data Science, AI & Development; Developing AI Applications with Python and Flask; Django Application Development with SQL and Databases; Introduction to Containers w/ Docker, Kubernetes & OpenShift; Application Development using Microservices and Serverless; Full Stack Application Development Capstone Project.
2. IBM AI Developer : Introduction to Software Engineering; Introduction to Artificial Intelligence (AI); Generative AI: Introduction and Applications; Generative AI: Prompt Engineering Basics; Introduction to HTML, CSS, & JavaScript; Python for Data Science, AI & Development; Developing AI Applications with Python and Flask; Building Generative AI-Powered Applications with Python.
3. IBM DevOps and Software Engineering : Introduction to DevOps; Introduction to Cloud Computing; Introduction to Agile Development and Scrum; Introduction to Software Engineering; Getting Started with Git and GitHub; Hands-on Introduction to Linux Commands and Shell Scripting; Python for Data Science, AI & Development; Developing AI Applications with Python and Flask; Introduction to Containers w/ Docker, Kubernetes & OpenShift; Application Development using Microservices and Serverless; Introduction to Test and Behavior Driven Development; Continuous Integration and Continuous Delivery (CI/CD); Application Security for Developers and DevOps Professionals; Monitoring and Observability for Development and DevOps; DevOps Capstone Project.
4. IBM Full-Stack JavaScript Developer : Introduction to Software Engineering; Introduction to HTML, CSS, & JavaScript; Getting Started with Git and GitHub; JavaScript Programming Essentials; Developing Front-End Apps with React; Developing Back-End Apps with Node.js and Express; Get Started with Cloud Native, DevOps, Agile, and NoSQL; Introduction to Containers w/ Docker, Kubernetes & OpenShift; Application Development using Microservices and Serverless; Node.js & MongoDB: Developing Back-end Database Applications; JavaScript Full Stack Capstone Project.

14 blocs de maîtrise : Software Engineering/SDLC; Agile/Scrum; Git/GitHub; Linux/Shell; HTML/CSS/JavaScript; React/UI; Node/Express; Python; Flask/Django/REST; SQL/NoSQL/Data Modeling; Cloud/Cloud Native; Containers/Microservices/Serverless; Tests/CI-CD/Security/Observability; Generative AI/Prompt Engineering.

Règles pédagogiques :
- L'utilisateur est débutant en programmation. Explique simplement sans supposer qu'il sait coder seul.
- Ne donne pas simplement un gros bloc de code. Explique d'abord le concept, le certificat/cours lié et pourquoi il est nécessaire maintenant.
- Chaque projet est un laboratoire de maîtrise : comprendre -> construire guidé -> tester -> corriger -> preuve GitHub.
- N'invente jamais un cours ou une compétence comme provenant d'un certificat si ce n'est pas dans la liste ci-dessus.
- Si plusieurs certificats couvrent la compétence, signale le recoupement.
- Ne prétends pas qu'une compétence est maîtrisée sans preuve concrète.
- Aide à transformer progressivement la conversation en spécification de projet : problème, utilisateurs, MVP, étape actuelle.
- Les méthodes personnelles numérotées 1 à 10 existent mais leur contenu n'est pas fourni ici : ne les invente pas.

Retourne UNIQUEMENT un objet JSON valide sans markdown, avec cette forme :
{
  "answer": "Réponse pédagogique concise mais suffisamment expliquée, avec la prochaine action concrète.",
  "projectUpdate": {"name":"", "problem":"", "users":"", "mvp":"", "currentStep":""},
  "skills": [
    {"block":"Bloc N", "skill":"Nom compétence", "certificate":"Nom du ou des certificats", "course":"Nom exact du ou des cours", "why":"Pourquoi cette compétence est utilisée maintenant"}
  ]
}

Dans projectUpdate, ne remplis que les champs que la conversation permet réellement de préciser; laisse les autres chaînes vides. Mets au maximum 4 compétences dans skills.`;

function normalizeMessages(messages = []) {
  return messages
    .filter((message) => ["user", "assistant"].includes(message?.role) && typeof message?.content === "string")
    .slice(-16)
    .map(({ role, content }) => ({ role, content: content.slice(0, 12000) }));
}

function stripCodeFence(text = "") {
  return text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, service: "Engineer Method OS AI", model: MODEL });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Méthode non permise." });
  }

  try {
    const project = req.body?.project || {};
    const messages = normalizeMessages(req.body?.messages);
    if (!messages.some((message) => message.role === "user")) {
      return res.status(400).json({ error: "Aucun message utilisateur reçu." });
    }

    const projectContext = `Fiche projet actuelle (peut être incomplète) :\n${JSON.stringify(project, null, 2)}`;
    const { text: raw } = await generateText({
      model: MODEL,
      system: `${SYSTEM_PROMPT}\n\n${projectContext}`,
      messages,
      temperature: 0.3,
      maxOutputTokens: 1800,
      providerOptions: {
        gateway: {
          tags: ["engineer-method-os", "feature:chat", "env:production"]
        }
      }
    });

    if (typeof raw !== "string" || !raw.trim()) {
      return res.status(502).json({ error: "Le moteur IA a retourné une réponse vide." });
    }

    let parsed;
    try {
      parsed = JSON.parse(stripCodeFence(raw));
    } catch (error) {
      console.error("Could not parse AI JSON", error, raw);
      parsed = { answer: raw, projectUpdate: {}, skills: [] };
    }

    return res.status(200).json({
      answer: typeof parsed.answer === "string" ? parsed.answer : raw,
      projectUpdate: parsed.projectUpdate && typeof parsed.projectUpdate === "object" ? parsed.projectUpdate : {},
      skills: Array.isArray(parsed.skills) ? parsed.skills.slice(0, 4) : []
    });
  } catch (error) {
    console.error("Engineer Method chat failure", error);
    const status = Number(error?.statusCode) || 500;
    if (status === 401 || status === 403) {
      return res.status(503).json({ error: "AI Gateway doit être activé pour ce projet Vercel." });
    }
    if (status === 402) {
      return res.status(503).json({ error: "Le crédit AI Gateway Vercel est épuisé." });
    }
    return res.status(500).json({ error: "Erreur interne du moteur Engineer Method." });
  }
}
