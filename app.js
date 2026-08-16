const STORAGE_KEY = "engineer-method-os-project-v1";

const fields = {
  name: document.getElementById("projectName"),
  problem: document.getElementById("projectProblem"),
  users: document.getElementById("projectUsers"),
  mvp: document.getElementById("projectMvp"),
  currentStep: document.getElementById("projectStep")
};

const messagesEl = document.getElementById("messages");
const skillsList = document.getElementById("skillsList");
const chatForm = document.getElementById("chatForm");
const promptEl = document.getElementById("prompt");
const sendButton = document.getElementById("sendButton");
const chatStatus = document.getElementById("chatStatus");
const saveState = document.getElementById("saveState");

let conversation = [];

function getProject() {
  return Object.fromEntries(Object.entries(fields).map(([key, el]) => [key, el.value.trim()]));
}

function setProject(project = {}) {
  Object.entries(fields).forEach(([key, el]) => {
    if (typeof project[key] === "string") el.value = project[key];
  });
}

function saveProject() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getProject()));
  saveState.textContent = "Enregistré";
  setTimeout(() => (saveState.textContent = "Mémoire locale"), 1400);
}

function loadProject() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) setProject(saved);
  } catch (_) {}
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function addMessage(role, text, isError = false) {
  const article = document.createElement("article");
  article.className = `message ${role}`;
  const who = role === "user" ? "Toi" : "Engineer Method OS";
  const avatar = role === "user" ? "JK" : "EM";
  const paragraphs = String(text)
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((part) => `<p class="${isError ? "error-text" : ""}">${escapeHtml(part)}</p>`)
    .join("");
  article.innerHTML = `<div class="avatar">${avatar}</div><div class="bubble"><strong>${who}</strong>${paragraphs}</div>`;
  messagesEl.appendChild(article);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function renderSkills(skills = []) {
  if (!Array.isArray(skills) || skills.length === 0) return;
  skillsList.innerHTML = skills
    .slice(0, 4)
    .map((skill, index) => `
      <article class="skill-card ${index === 0 ? "active" : ""}">
        <span>${escapeHtml(skill.block || `Compétence ${index + 1}`)}</span>
        <h3>${escapeHtml(skill.skill || "Compétence IBM")}</h3>
        <p><strong>Certificat :</strong> ${escapeHtml(skill.certificate || "À préciser")}</p>
        <p><strong>Cours :</strong> ${escapeHtml(skill.course || "À préciser")}</p>
        <p><strong>Pourquoi :</strong> ${escapeHtml(skill.why || "Nécessaire à l'étape actuelle.")}</p>
      </article>`)
    .join("");
}

function applyProjectUpdate(update) {
  if (!update || typeof update !== "object") return;
  const normalized = {};
  for (const key of Object.keys(fields)) {
    if (typeof update[key] === "string" && update[key].trim()) normalized[key] = update[key].trim();
  }
  setProject({ ...getProject(), ...normalized });
  saveProject();
}

async function sendToEngineer(text) {
  const userMessage = { role: "user", content: text };
  conversation.push(userMessage);
  addMessage("user", text);
  sendButton.disabled = true;
  promptEl.disabled = true;
  chatStatus.textContent = "Engineer Method analyse le projet…";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project: getProject(), messages: conversation })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `Erreur ${response.status}`);

    const answer = data.answer || "Je n'ai pas reçu de réponse exploitable.";
    conversation.push({ role: "assistant", content: answer });
    addMessage("assistant", answer);
    applyProjectUpdate(data.projectUpdate);
    renderSkills(data.skills);
    chatStatus.textContent = "Réponse terminée";
  } catch (error) {
    addMessage("assistant", `Le moteur IA n'a pas pu répondre : ${error.message}`, true);
    chatStatus.textContent = "Erreur de connexion IA";
  } finally {
    sendButton.disabled = false;
    promptEl.disabled = false;
    promptEl.focus();
  }
}

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = promptEl.value.trim();
  if (!text) return;
  promptEl.value = "";
  await sendToEngineer(text);
});

document.getElementById("saveProject").addEventListener("click", saveProject);
document.getElementById("resetProject").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  conversation = [];
  setProject({ name: "Nouveau projet", problem: "", users: "", mvp: "", currentStep: "Définition du problème" });
  messagesEl.innerHTML = "";
  addMessage("assistant", "Nouveau projet créé. Décris-moi ce que tu veux construire. Je vais le transformer en projet d'ingénierie tout en t'expliquant les compétences IBM utilisées.");
});

loadProject();
