// app.vue codes


<template>
  <div class="app-shell">
    <router-view />

    <div class="global-tools">
      <button
        class="tool-button search-button"
        title="Search the whole app"
        aria-label="Open global search"
        @click="openSearch"
      >
        <span class="tool-icon">⌕</span>
        <span class="tool-label">Search</span>
      </button>

      <button
        class="tool-button ai-button"
        title="AI Assistant"
        aria-label="Open AI assistant"
        @click="toggleAssistant"
      >
        <span class="tool-icon">✦</span>
        <span class="tool-label">AI Assistant</span>
      </button>
    </div>

    <!-- GLOBAL SEARCH -->
    <div
      v-if="searchOpen"
      class="overlay"
      @click.self="searchOpen = false"
      @keydown.esc="searchOpen = false"
    >
      <section class="search-panel">
        <div class="panel-heading">
          <div>
            <span class="eyebrow">KITABI DIGITAL PORTFOLIO</span>
            <h2>Search everything</h2>
            <p>Find pages, services, information and visible content.</p>
          </div>
          <button class="close-button" @click="searchOpen = false">✕</button>
        </div>

        <div class="search-input-wrap">
          <span class="input-icon">⌕</span>
          <input
            ref="searchInput"
            v-model="searchQuery"
            placeholder="Search anything in the app..."
            @keydown.enter="selectFirstResult"
            aria-label="Search the application"
          />
          <button
            class="voice-button"
            :class="{ listening: isListening }"
            @click="startVoiceSearch"
            :title="isListening ? 'Stop listening' : 'Search by voice'"
          >
            {{ isListening ? '🔴' : '🎙️' }}
          </button>
        </div>

        <p v-if="isListening" class="voice-status">
          Listening... Speak your search.
        </p>
        <p v-if="voiceError" class="error-message">{{ voiceError }}</p>

        <div class="search-results">
          <p class="result-heading">
            {{ searchQuery.trim() ? 'SEARCH RESULTS' : 'AVAILABLE PAGES' }}
            <span>{{ searchResults.length }}</span>
          </p>

          <button
            v-for="(result, index) in searchResults"
            :key="result.id"
            class="result-item"
            @click="selectResult(result)"
          >
            <span class="result-icon">{{ result.icon }}</span>
            <span class="result-copy">
              <strong>{{ result.title }}</strong>
              <small>{{ result.description }}</small>
            </span>
            <span class="result-type">{{ result.type }}</span>
          </button>

          <div v-if="searchResults.length === 0" class="empty-state">
            <span>🔎</span>
            <strong>No results found</strong>
            <p>Try another keyword or ask the AI assistant.</p>
            <button class="text-action" @click="openAssistantWithQuery">
              Ask AI Assistant →
            </button>
          </div>
        </div>

        <div class="search-footer">
          <span>⌨ Enter to open the first result</span>
          <span>🎙️ Voice search</span>
        </div>
      </section>
    </div>

    <!-- AI ASSISTANT -->
    <section v-if="assistantOpen" class="assistant-panel">
      <header class="assistant-header">
        <div class="assistant-avatar">✦</div>
        <div class="assistant-title">
          <strong>Kitabi AI Assistant</strong>
          <small><span class="online-dot"></span> App assistant</small>
        </div>
        <button class="close-button" @click="assistantOpen = false">✕</button>
      </header>

      <div class="assistant-messages" ref="messagesContainer">
        <div class="welcome-message">
          <div class="welcome-icon">✦</div>
          <h3>How can I help you?</h3>
          <p>Ask about the app, find a page, or search visible information.</p>
          <div class="suggestion-list">
            <button @click="askSuggestion('What services are available?')">
              What services are available?
            </button>
            <button @click="askSuggestion('Find the contact page')">
              Find the contact page
            </button>
            <button @click="askSuggestion('What information is on this page?')">
              Explain this page
            </button>
          </div>
        </div>

        <div
          v-for="(message, index) in chatMessages"
          :key="index"
          class="message-row"
          :class="message.role"
        >
          <div class="message-bubble">
            <p>{{ message.text }}</p>
            <button
              v-if="message.role === 'assistant'"
              class="speak-answer"
              @click="speakText(message.text)"
              title="Read answer aloud"
            >
              🔊 Listen
            </button>
          </div>
        </div>
      </div>

      <form class="assistant-input-area" @submit.prevent="sendMessage">
        <textarea
          v-model="chatInput"
          placeholder="Ask a question..."
          rows="1"
          @keydown.enter.exact.prevent="sendMessage"
          aria-label="Ask the AI assistant"
        ></textarea>
        <button
          type="button"
          class="voice-button"
          :class="{ listening: isListening }"
          @click="startVoiceAssistant"
          title="Speak your question"
        >
          🎙️
        </button>
        <button
          type="submit"
          class="send-button"
          :disabled="!chatInput.trim()"
          aria-label="Send message"
        >
          ➤
        </button>
      </form>

      <p class="assistant-disclaimer">
        Built-in assistant · Answers use available app content
      </p>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const searchOpen = ref(false);
const assistantOpen = ref(false);
const searchQuery = ref("");
const chatInput = ref("");
const chatMessages = ref([]);
const searchInput = ref(null);
const messagesContainer = ref(null);
const isListening = ref(false);
const voiceError = ref("");

let recognition = null;

/*
  These routes must match the routes in src/router/index.js.
  Add more entries when you create new pages.
*/
const appPages = [
  {
    title: "Home",
    path: "/",
    icon: "🏠",
    keywords: "home welcome overview homepage",
    description: "Home page and sector overview",
  },
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: "📊",
    keywords: "dashboard statistics announcements summary",
    description: "Dashboard, statistics and announcements",
  },
  {
    title: "About",
    path: "/about",
    icon: "ℹ️",
    keywords: "about history background mission vision",
    description: "About Kitabi Sector",
  },
  {
    title: "Administration",
    path: "/administration",
    icon: "🏛️",
    keywords: "administration leaders officials management",
    description: "Sector administration and leadership",
  },
  {
    title: "Services",
    path: "/services",
    icon: "🛠️",
    keywords: "services public service citizens assistance",
    description: "Public services and service information",
  },
  {
    title: "Media Center",
    path: "/media",
    icon: "📰",
    keywords: "media news photos videos gallery updates",
    description: "News, photos and media updates",
  },
  {
    title: "Research",
    path: "/research",
    icon: "📚",
    keywords: "research reports documents publications",
    description: "Research, reports and publications",
  },
  {
    title: "Contact Us",
    path: "/contact",
    icon: "✉️",
    keywords: "contact email phone address message support",
    description: "Contact information and contact form",
  },
];

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s/-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getCurrentPageText() {
  const selectors = [
    "main",
    "[role='main']",
    ".main-content",
    ".page-content",
    ".content",
    "article",
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);

    if (element && element.innerText.trim()) {
      return element.innerText
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 30000);
    }
  }

  const app = document.querySelector("#app");

  return (app?.innerText || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 30000);
}

function getCurrentPageLinks() {
  const links = Array.from(document.querySelectorAll("#app a"));

  return links
    .filter((link) => {
      return (
        link.innerText.trim() &&
        link.href &&
        link.origin === window.location.origin
      );
    })
    .map((link, index) => ({
      id: `link-${index}-${link.href}`,
      title: link.innerText.trim().replace(/\s+/g, " "),
      description: link.getAttribute("href") || link.href,
      path: link.pathname,
      icon: "🔗",
      type: "Link",
      score: 0,
    }));
}

const searchResults = computed(() => {
  const query = normalize(searchQuery.value);

  const pages = appPages.map((page) => ({
    ...page,
    type: "Page",
    id: `page-${page.path}`,
    score: 0,
  }));

  const links = getCurrentPageLinks();
  const currentText = normalize(getCurrentPageText());

  if (!query) {
    return pages.slice(0, 8);
  }

  const words = query.split(" ").filter(Boolean);

  const pageMatches = pages
    .map((page) => {
      const searchable = normalize(
        `${page.title} ${page.path} ${page.keywords} ${page.description}`
      );

      let score = 0;

      if (searchable.includes(query)) score += 10;

      words.forEach((word) => {
        if (normalize(page.title).includes(word)) score += 5;
        if (normalize(page.keywords).includes(word)) score += 3;
        if (normalize(page.description).includes(word)) score += 2;
      });

      return { ...page, score };
    })
    .filter((page) => page.score > 0);

  const linkMatches = links
    .map((link) => {
      const searchable = normalize(`${link.title} ${link.description}`);
      const score = words.reduce(
        (total, word) => total + (searchable.includes(word) ? 2 : 0),
        0
      );

      return { ...link, score };
    })
    .filter((link) => link.score > 0);

  const contentMatches = currentText.includes(query)
    ? [
        {
          id: "current-page-content",
          title: `Found content on ${route.name || route.path}`,
          description: "Matching text on the currently displayed page",
          icon: "📄",
          type: "Content",
          path: route.path,
          score: 8,
        },
      ]
    : [];

  const unique = new Map();

  [...pageMatches, ...linkMatches, ...contentMatches]
    .sort((a, b) => b.score - a.score)
    .forEach((item) => {
      const key = `${item.path}-${item.title}`;

      if (!unique.has(key)) unique.set(key, item);
    });

  return Array.from(unique.values()).slice(0, 15);
});

function openSearch() {
  assistantOpen.value = false;
  searchOpen.value = true;
  voiceError.value = "";

  nextTick(() => searchInput.value?.focus());
}

function toggleAssistant() {
  searchOpen.value = false;
  assistantOpen.value = !assistantOpen.value;
}

function selectResult(result) {
  searchOpen.value = false;

  if (result.path && result.path !== route.path) {
    router.push(result.path);
    return;
  }

  if (result.type === "Content") {
    const main =
      document.querySelector("main") ||
      document.querySelector("[role='main']") ||
      document.querySelector(".main-content") ||
      document.querySelector("#app");

    main?.scrollIntoView({ behavior: "smooth", block: "start" });
  } else if (result.path) {
    router.push(result.path);
  }
}

function selectFirstResult() {
  if (searchResults.value.length) {
    selectResult(searchResults.value[0]);
  }
}

function openAssistantWithQuery() {
  assistantOpen.value = true;
  searchOpen.value = false;
  chatInput.value = searchQuery.value;
  sendMessage();
}

function askSuggestion(question) {
  chatInput.value = question;
  sendMessage();
}

function getSentenceMatches(text, query) {
  const words = normalize(query).split(" ").filter((word) => word.length > 2);

  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => {
      const normalizedSentence = normalize(sentence);

      return words.some((word) => normalizedSentence.includes(word));
    })
    .slice(0, 4);
}

function createAssistantAnswer(question) {
  const normalizedQuestion = normalize(question);
  const page = appPages.find((item) => {
    return route.path === item.path;
  });

  const matchingPage = appPages.find((item) => {
    const searchable = normalize(
      `${item.title} ${item.keywords} ${item.description}`
    );

    return (
      normalizedQuestion.includes(normalize(item.title)) ||
      normalizedQuestion.includes(normalize(item.path.replace("/", ""))) ||
      normalize(item.title).includes(normalizedQuestion)
    ) && searchable.length > 0;
  });

  if (
    normalizedQuestion.includes("go to") ||
    normalizedQuestion.includes("open ") ||
    normalizedQuestion.includes("find ") ||
    normalizedQuestion.includes("navigate")
  ) {
    if (matchingPage) {
      router.push(matchingPage.path);

      return `Opening the ${matchingPage.title} page for you.`;
    }

    return "I couldn't identify that page. Try searching for Home, About, Administration, Services, Media Center, Research, or Contact Us.";
  }

  if (
    normalizedQuestion.includes("what page") ||
    normalizedQuestion.includes("current page") ||
    normalizedQuestion.includes("this page")
  ) {
    const text = getCurrentPageText();

    return `You are on the ${page?.title || route.path} page. ${
      text
        ? `Here is some of its content: ${text.slice(0, 700)}`
        : "There is no readable page content available right now."
    }`;
  }

  if (
    normalizedQuestion.includes("service") ||
    normalizedQuestion.includes("available")
  ) {
    const services = appPages.find((item) => item.path === "/services");

    return `You can visit the Services page for service information. ${
      services ? `Open ${services.path} to explore it.` : ""
    }`;
  }

  if (
    normalizedQuestion.includes("contact") ||
    normalizedQuestion.includes("phone") ||
    normalizedQuestion.includes("email")
  ) {
    return "You can visit the Contact Us page to find available contact information and use the contact form.";
  }

  if (
    normalizedQuestion.includes("help") ||
    normalizedQuestion.includes("what can you do") ||
    normalizedQuestion.includes("who are you")
  ) {
    return "I can help you find pages, search visible content, explain the current page, and navigate around the application. For more advanced answers, connect this assistant to an AI backend.";
  }

  const currentText = getCurrentPageText();
  const matches = getSentenceMatches(currentText, question);

  if (matches.length) {
    return `I found this information on the current page:\n\n${matches.join(
      "\n\n"
    )}`;
  }

  const matchingLink = getCurrentPageLinks().find((link) =>
    normalize(`${link.title} ${link.description}`).includes(normalizedQuestion)
  );

  if (matchingLink) {
    return `I found a matching link: ${matchingLink.title}. You can open it from the current page.`;
  }

  return "I couldn't find a reliable answer in the currently available app content. Try the global search, open a relevant page, or connect a real AI service to answer questions across the entire portfolio.";
}

async function sendMessage() {
  const question = chatInput.value.trim();

  if (!question) return;

  chatMessages.value.push({
    role: "user",
    text: question,
  });

  chatInput.value = "";

  await nextTick();
  scrollMessagesToBottom();

  const answer = createAssistantAnswer(question);

  chatMessages.value.push({
    role: "assistant",
    text: answer,
  });

  await nextTick();
  scrollMessagesToBottom();
}

function scrollMessagesToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop =
      messagesContainer.value.scrollHeight;
  }
}

function stopListening() {
  if (recognition) {
    recognition.stop();
  }

  isListening.value = false;
}

function startVoiceSearch() {
  if (isListening.value) {
    stopListening();
    return;
  }

  startRecognition((transcript) => {
    searchQuery.value = transcript;
  });
}

function startVoiceAssistant() {
  if (isListening.value) {
    stopListening();
    return;
  }

  startRecognition((transcript) => {
    chatInput.value = transcript;
  });
}

function startRecognition(onResult) {
  voiceError.value = "";

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    voiceError.value =
      "Voice recognition is not supported in this browser. Try the latest Chrome or Edge.";
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    isListening.value = true;
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;

    onResult(transcript);
  };

  recognition.onerror = (event) => {
    voiceError.value =
      event.error === "not-allowed"
        ? "Allow microphone access in your browser settings to use voice assistance."
        : `Voice recognition error: ${event.error}`;
  };

  recognition.onend = () => {
    isListening.value = false;
  };

  try {
    recognition.start();
  } catch {
    voiceError.value = "Unable to start voice recognition. Please try again.";
    isListening.value = false;
  }
}

function speakText(text) {
  if (!("speechSynthesis" in window)) {
    voiceError.value = "Spoken answers are not supported by this browser.";
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 1;
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
}

onBeforeUnmount(() => {
  if (recognition) recognition.stop();

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
});
</script>

<style>
:root {
  --app-green: #16834a;
  --app-green-dark: #0b6035;
  --app-green-light: #eaf7ef;
  --app-text: #17251d;
  --app-muted: #718078;
  --app-border: #e2eae5;
  --app-surface: #ffffff;
  --app-shadow: 0 20px 70px rgba(15, 40, 25, 0.18);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: Inter, "Segoe UI", Arial, sans-serif;
  color: var(--app-text);
}

button,
input,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

.global-tools {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 9990;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.tool-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 50px;
  padding: 0 19px;
  border: 0;
  border-radius: 15px;
  color: white;
  font-weight: 700;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.18);
  transition: transform 0.2s, box-shadow 0.2s;
}

.tool-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.22);
}

.search-button {
  background: #263b2e;
}

.ai-button {
  background: linear-gradient(135deg, #1b9856, #086336);
}

.tool-icon {
  font-size: 23px;
  line-height: 1;
}

.tool-label {
  font-size: 13px;
}

.overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 9vh 18px 24px;
  background: rgba(8, 20, 12, 0.58);
  backdrop-filter: blur(6px);
  overflow-y: auto;
}

.search-panel {
  width: 100%;
  max-width: 680px;
  max-height: 82vh;
  display: flex;
  flex-direction: column;
  padding: 28px;
  background: white;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 22px;
  box-shadow: var(--app-shadow);
  overflow: hidden;
}

.panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 22px;
}

.eyebrow {
  color: var(--app-green);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.7px;
}

.panel-heading h2 {
  margin: 8px 0;
  font-size: 27px;
  letter-spacing: -0.8px;
}

.panel-heading p {
  margin: 0;
  color: var(--app-muted);
  font-size: 13px;
  line-height: 1.6;
}

.close-button {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border: 0;
  border-radius: 10px;
  background: #f1f5f2;
  color: #405047;
  font-size: 16px;
}

.close-button:hover {
  background: #e3eee6;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 7px 10px 7px 16px;
  border: 1.5px solid #d7e5db;
  border-radius: 14px;
  background: #fbfdfb;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input-wrap:focus-within {
  border-color: var(--app-green);
  box-shadow: 0 0 0 4px rgba(22, 131, 74, 0.09);
}

.input-icon {
  color: var(--app-green);
  font-size: 27px;
}

.search-input-wrap input {
  flex: 1;
  min-width: 0;
  height: 42px;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--app-text);
  font-size: 14px;
}

.voice-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border: 0;
  border-radius: 11px;
  background: var(--app-green-light);
  font-size: 17px;
}

.voice-button:hover {
  background: #d9f0e1;
}

.voice-button.listening {
  background: #ffe5e5;
  animation: pulse 1.2s infinite;
}

.voice-status {
  margin: 10px 0 0;
  color: var(--app-green-dark);
  font-size: 12px;
}

.error-message {
  margin: 10px 0 0;
  color: #b42318;
  font-size: 12px;
}

.search-results {
  min-height: 80px;
  margin-top: 24px;
  overflow-y: auto;
}

.result-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 10px;
  color: #89948d;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.3px;
}

.result-heading span {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: #edf6ef;
  color: var(--app-green-dark);
  font-size: 11px;
}

.result-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 13px 11px;
  text-align: left;
  border: 0;
  border-bottom: 1px solid #f0f3f1;
  border-radius: 10px;
  background: transparent;
  color: var(--app-text);
}

.result-item:hover {
  background: #f2f8f4;
}

.result-icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 12px;
  background: var(--app-green-light);
  font-size: 18px;
}

.result-copy {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.result-copy strong {
  font-size: 13px;
}

.result-copy small {
  overflow: hidden;
  color: var(--app-muted);
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-type {
  padding: 5px 8px;
  border-radius: 7px;
  background: #f0f3f1;
  color: #647269;
  font-size: 10px;
}

.empty-state {
  padding: 28px 12px;
  text-align: center;
}

.empty-state > span {
  font-size: 30px;
}

.empty-state strong {
  display: block;
  margin: 12px 0 6px;
}

.empty-state p {
  color: var(--app-muted);
  font-size: 12px;
}

.text-action {
  padding: 9px 12px;
  border: 0;
  border-radius: 8px;
  background: var(--app-green-light);
  color: var(--app-green-dark);
  font-weight: 700;
  font-size: 12px;
}

.search-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px;
  padding-top: 16px;
  margin-top: 10px;
  border-top: 1px solid var(--app-border);
  color: #7c8980;
  font-size: 10px;
}

.assistant-panel {
  position: fixed;
  right: 24px;
  bottom: 92px;
  z-index: 9995;
  width: min(410px, calc(100vw - 28px));
  height: min(620px, calc(100dvh - 125px));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e1eae3;
  border-radius: 22px;
  background: white;
  box-shadow: var(--app-shadow);
  animation: panel-in 0.2s ease-out;
}

.assistant-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 17px;
  background: linear-gradient(120deg, #106b3b, #16834a);
  color: white;
}

.assistant-avatar {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.16);
  font-size: 25px;
}

.assistant-title {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.assistant-title strong {
  font-size: 14px;
}

.assistant-title small {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #d6f2df;
  font-size: 11px;
}

.online-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #82f0a8;
}

.assistant-header .close-button {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.assistant-messages {
  flex: 1;
  padding: 19px 15px;
  overflow-y: auto;
  background: #fbfdfb;
}

.welcome-message {
  padding: 18px 12px 23px;
  text-align: center;
}

.welcome-icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin: 0 auto 13px;
  border-radius: 16px;
  background: var(--app-green-light);
  color: var(--app-green);
  font-size: 27px;
}

.welcome-message h3 {
  margin: 0 0 8px;
  font-size: 19px;
}

.welcome-message > p {
  max-width: 280px;
  margin: 0 auto 18px;
  color: var(--app-muted);
  font-size: 12px;
  line-height: 1.6;
}

.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.suggestion-list button {
  padding: 11px 12px;
  border: 1px solid #dfeae2;
  border-radius: 10px;
  background: white;
  color: #365442;
  text-align: left;
  font-size: 12px;
}

.suggestion-list button:hover {
  border-color: #9bcbaa;
  background: #f0f8f2;
}

.message-row {
  display: flex;
  margin: 12px 0;
}

.message-row.user {
  justify-content: flex-end;
}

.message-row.assistant {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 88%;
  padding: 12px 14px;
  border-radius: 14px;
  overflow-wrap: anywhere;
}

.message-row.user .message-bubble {
  border-bottom-right-radius: 4px;
  background: var(--app-green);
  color: white;
}

.message-row.assistant .message-bubble {
  border: 1px solid #e5eee7;
  border-bottom-left-radius: 4px;
  background: white;
  color: #25372b;
}

.message-bubble p {
  margin: 0;
  font-size: 12px;
  line-height: 1.7;
  white-space: pre-line;
}

.speak-answer {
  margin-top: 10px;
  padding: 5px 8px;
  border: 0;
  border-radius: 7px;
  background: #edf7ef;
  color: var(--app-green-dark);
  font-size: 10px;
}

.assistant-input-area {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid var(--app-border);
  background: white;
}

.assistant-input-area textarea {
  flex: 1;
  min-width: 0;
  max-height: 100px;
  padding: 12px;
  resize: vertical;
  border: 1px solid #dfe8e1;
  border-radius: 12px;
  outline: none;
  background: #fbfdfb;
  color: var(--app-text);
  font-size: 12px;
}

.assistant-input-area textarea:focus {
  border-color: var(--app-green);
}

.send-button {
  width: 39px;
  height: 39px;
  flex-shrink: 0;
  border: 0;
  border-radius: 12px;
  background: var(--app-green);
  color: white;
  font-size: 19px;
}

.send-button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.assistant-disclaimer {
  margin: 0;
  padding: 0 12px 10px;
  background: white;
  color: #8a968d;
  text-align: center;
  font-size: 9px;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.2);
  }

  50% {
    box-shadow: 0 0 0 6px rgba(220, 38, 38, 0.08);
  }
}

@keyframes panel-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .global-tools {
    right: 14px;
    bottom: 14px;
    gap: 9px;
  }

  .tool-button {
    min-height: 45px;
    padding: 0 14px;
    border-radius: 13px;
  }

  .tool-label {
    font-size: 12px;
  }

  .assistant-panel {
    right: 10px;
    bottom: 75px;
    width: calc(100vw - 20px);
    height: min(590px, calc(100dvh - 95px));
    border-radius: 18px;
  }

  .overlay {
    padding: 5vh 10px 15px;
  }

  .search-panel {
    max-height: 90vh;
    padding: 20px 15px;
    border-radius: 18px;
  }

  .panel-heading h2 {
    font-size: 23px;
  }

  .result-type {
    display: none;
  }
}
</style>



// home page

<template>
  <div class="portfolio" :class="{ light: lightTheme }">
    <header class="site-header">
      <a href="#home" class="brand">
        <span class="brand-logo">KS</span>
        <span>KITABI SECTOR<small>DIGITAL PORTFOLIO</small></span>
      </a>

      <button class="mobile-toggle" @click="menuOpen = !menuOpen">
        {{ menuOpen ? '✕' : '☰' }}
      </button>

      <nav :class="{ 'menu-open': menuOpen }">
        <a v-for="link in links" :key="link.id"
           :href="'#' + link.id" @click="menuOpen = false">
          {{ translate(link.label) }}
        </a>
      </nav>

      <div class="nav-tools">
        <form class="search" @submit.prevent="search">
          <span>⌕</span>
          <input v-model.trim="query" placeholder="Search this site..." aria-label="Search this site">
          <button v-if="query" type="button" @click="clearSearch">×</button>
        </form>

        <select v-model="language" aria-label="Language">
          <option value="en">EN</option>
          <option value="rw">RW</option>
        </select>

        <button class="theme-btn" @click="lightTheme = !lightTheme"
                :aria-label="lightTheme ? 'Dark theme' : 'Light theme'">
          {{ lightTheme ? '☾' : '☼' }}
        </button>
      </div>
    </header>

    <main>
      <section id="home" class="hero">
        <div class="hero-shade"></div>
        <div class="hero-content">
          <span class="eyebrow">{{ translate('WELCOME TO') }}</span>
          <h1>Kitabi Sector</h1>
          <h3>Nyamagabe District, Southern Province, Rwanda</h3>
          <p>{{ translate('Discover the beauty, opportunities, and achievements of Kitabi Sector. A land of green hills, culture, innovation, and sustainable development.') }}</p>

          <div class="hero-buttons">
            <a href="#about" class="btn primary">{{ translate('Explore Kitabi') }} →</a>
            <a href="#dashboard" class="btn secondary">{{ translate('View Dashboard') }} ↗</a>
          </div>

          <div class="hero-note">
            <span class="dot"></span>
            {{ translate('Discover our community, services and opportunities') }}
          </div>
        </div>

        <aside class="map-card">
          <div class="section-title">
            <div>
              <h3>Kitabi Sector</h3>
              <small>Community overview</small>
            </div>
            <span class="map-pin">⌖</span>
          </div>

          <div class="map-visual">
            <svg viewBox="0 0 320 270" role="img" aria-label="Illustrative Kitabi community map">
              <defs>
                <linearGradient id="mapFill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#164b29"/>
                  <stop offset="100%" stop-color="#071d13"/>
                </linearGradient>
              </defs>
              <path d="M145 12 L174 25 203 18 222 39 255 45 278 76 301 94 287 119 299 146 276 164 266 191 235 198 218 231 191 218 165 251 139 233 111 244 89 221 65 227 47 204 23 187 34 159 19 137 42 115 37 89 62 72 83 51 111 57 127 34Z"
                    fill="url(#mapFill)" stroke="#80df70" stroke-width="1.7"/>
              <g fill="none" stroke="#6eb66a" stroke-width=".8">
                <path d="M46 115 L93 124 111 57"/>
                <path d="M93 124 L127 160 174 25"/>
                <path d="M127 160 L89 221"/>
                <path d="M127 160 L218 231"/>
                <path d="M127 160 L203 130 278 76"/>
                <path d="M203 130 L235 198"/>
                <path d="M165 251 L165 190 203 130"/>
              </g>
              <g fill="#e8ffe5" stroke="#1d7434" stroke-width="2">
                <circle cx="83" cy="78" r="4"/>
                <circle cx="222" cy="109" r="4"/>
                <circle cx="164" cy="144" r="4"/>
                <circle cx="82" cy="191" r="4"/>
                <circle cx="213" cy="205" r="4"/>
              </g>
              <g fill="#f4fff4" font-size="10" font-weight="600">
                <text x="89" y="76">Kagano</text>
                <text x="229" y="106">Uwingugu</text>
                <text x="171" y="141">Mukungu</text>
                <text x="89" y="188">Mujuga</text>
                <text x="220" y="202">Shyaba</text>
              </g>
            </svg>
          </div>

          <div class="map-footer">
            <span><span class="dot"></span> Kitabi, Rwanda</span>
            <button class="text-link" @click="showDetails('Community map', 'This is an illustrative map, not an official administrative boundary map.')">Map information ↗</button>
          </div>
        </aside>
      </section>

      <section v-if="searched" class="search-results" id="search-results">
        <div class="section-title">
          <div>
            <h3>Search results</h3>
            <small>{{ results.length }} result(s) for "{{ lastQuery }}"</small>
          </div>
          <button class="text-link" @click="clearSearch">Clear ×</button>
        </div>

        <div v-if="results.length" class="results-grid">
          <button v-for="item in results" :key="item.title"
                  class="result-card"
                  @click="showDetails(item.title, item.description)">
            <small>{{ item.category }}</small>
            <strong>{{ item.title }}</strong>
            <span>{{ item.description }}</span>
            <b>View details →</b>
          </button>
        </div>
        <p v-else class="muted">No results found. Try "services", "forest", "education", or "budget".</p>
      </section>

      <section id="dashboard" class="statistics">
        <button v-for="stat in statistics" :key="stat.label" class="stat-card"
                @click="showDetails(stat.label, stat.detail)">
          <span class="stat-icon">{{ stat.icon }}</span>
          <span class="stat-copy">
            <small>{{ stat.label }}</small>
            <strong>{{ stat.value }} <em>{{ stat.unit }}</em></strong>
            <small>{{ stat.caption }}</small>
          </span>
          <span class="stat-arrow">↗</span>
        </button>
      </section>

      <section class="dashboard-grid">
        <article class="panel" id="announcements">
          <div class="section-title">
            <div><small class="eyebrow">STAY INFORMED</small><h3>Announcements</h3></div>
            <button class="text-link" @click="showDetails('Announcements', 'These are sample notices. Replace them with approved announcements from the sector office.')">View all ↗</button>
          </div>

          <button v-for="item in announcements" :key="item.title"
                  class="list-item" @click="showDetails(item.title, item.description)">
            <img :src="item.image" :alt="item.title" loading="lazy">
            <span class="item-copy">
              <strong>{{ item.title }}</strong>
              <small>{{ item.date }}</small>
            </span>
            <span class="arrow">›</span>
          </button>
          <p class="footnote">Sample notices. Confirm official dates before publishing.</p>
        </article>

        <article class="panel" id="news">
          <div class="section-title">
            <div><small class="eyebrow">WHAT'S HAPPENING</small><h3>Latest News</h3></div>
            <button class="text-link" @click="showDetails('Latest news', 'Add verified local news articles, publication dates, and official sources here.')">View all ↗</button>
          </div>

          <button class="featured-news" @click="showDetails(news[0].title, news[0].description)">
            <img :src="news[0].image" :alt="news[0].title" loading="lazy">
            <span class="featured-caption">
              <small>{{ news[0].category }}</small>
              <strong>{{ news[0].title }}</strong>
              <small>{{ news[0].date }}</small>
            </span>
          </button>

          <button v-for="item in news.slice(1)" :key="item.title"
                  class="list-item" @click="showDetails(item.title, item.description)">
            <img :src="item.image" :alt="item.title" loading="lazy">
            <span class="item-copy">
              <strong>{{ item.title }}</strong>
              <small>{{ item.date }}</small>
            </span>
            <span class="arrow">›</span>
          </button>
        </article>

        <article class="panel" id="sectors">
          <div class="section-title">
            <div><small class="eyebrow">DISCOVER KITABI</small><h3>Environment & Attractions</h3></div>
            <button class="text-link" @click="showDetails('Attractions', 'Add verified visitor information and local attractions here.')">Explore ↗</button>
          </div>

          <div class="attraction-grid">
            <button v-for="item in attractions" :key="item.title"
                    class="attraction-card" @click="showDetails(item.title, item.description)">
              <img :src="item.image" :alt="item.title" loading="lazy">
              <span>{{ item.title }}<small>Discover more ↗</small></span>
            </button>
          </div>
        </article>

        <article class="panel" id="services">
          <div class="section-title">
            <div><small class="eyebrow">HERE TO HELP</small><h3>Quick Services</h3></div>
            <button class="text-link" @click="showDetails('Public services', 'These shortcuts provide information only. Connect an approved backend to submit applications or complaints online.')">All services ↗</button>
          </div>

          <div class="service-grid">
            <button v-for="service in services" :key="service.title"
                    class="service-card" @click="showDetails(service.title, service.description)">
              <span>{{ service.icon }}</span>
              <strong>{{ service.title }}</strong>
              <small>{{ service.subtitle }}</small>
            </button>
          </div>

          <div class="help-card">
            <strong>Need assistance?</strong>
            <p>Find information or contact the relevant local authority.</p>
            <a href="#contact" class="text-link">Get help →</a>
          </div>
        </article>
      </section>

      <section id="about" class="panel content-section">
        <small class="eyebrow">OUR COMMUNITY</small>
        <h2>About Kitabi Sector</h2>
        <p class="section-description">Discover the community, landscape, and opportunities that make Kitabi special.</p>

        <div class="info-grid">
          <article>
            <span class="info-icon">⌖</span>
            <h3>Location</h3>
            <p>Kitabi Sector is in Nyamagabe District, Southern Province of Rwanda.</p>
          </article>
          <article>
            <span class="info-icon">♧</span>
            <h3>Environment</h3>
            <p>The surrounding highland environment supports biodiversity, agriculture, and nature-based tourism.</p>
          </article>
          <article>
            <span class="info-icon">♙</span>
            <h3>Community</h3>
            <p>Community participation and accessible public services support local development.</p>
          </article>
        </div>
      </section>

      <section id="administration" class="panel content-section">
        <small class="eyebrow">LOCAL GOVERNANCE</small>
        <h2>Administration</h2>
        <p class="section-description">Local administration supports community development and public service delivery.</p>

        <div class="admin-grid">
          <article class="admin-highlight">
            <span class="info-icon">⌂</span>
            <div>
              <h3>Kitabi Sector Office</h3>
              <p>Contact the relevant local authority for official administrative information, service requirements, and current office contacts.</p>
            </div>
          </article>
          <div class="admin-list">
            <p><strong>01 — Community services</strong><small>Information and guidance for residents.</small></p>
            <p><strong>02 — Local development</strong><small>Community programs and project coordination.</small></p>
            <p><strong>03 — Public information</strong><small>Announcements, notices, and reports.</small></p>
          </div>
        </div>
      </section>

      <section id="research" class="panel content-section">
        <small class="eyebrow">INFORMATION & INSIGHT</small>
        <h2>Research & Data</h2>
        <p class="section-description">Explore reliable information about local development and the environment.</p>

        <div class="info-grid">
          <button v-for="item in researchItems" :key="item.title"
                  class="research-card" @click="showDetails(item.title, item.description)">
            <span class="info-icon">{{ item.icon }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
            <b>Learn more →</b>
          </button>
        </div>
      </section>

      <section id="contact" class="contact-section">
        <div>
          <small class="eyebrow">WE'RE HERE TO HELP</small>
          <h2>Connect with Kitabi Sector</h2>
          <p>For official requests and verified information, contact the relevant sector or district office.</p>
        </div>
        <a class="btn primary" href="https://www.nyamagabe.gov.rw/"
           target="_blank" rel="noopener noreferrer">Visit District Website ↗</a>
      </section>

      <section class="info-footer">
        <div><span>♧</span><p><strong>Natural environment</strong><small>Highland landscape</small></p></div>
        <div><span>♣</span><p><strong>Nature & biodiversity</strong><small>Conservation awareness</small></p></div>
        <div><span>▲</span><p><strong>Local agriculture</strong><small>Community livelihoods</small></p></div>
        <div><span>◇</span><p><strong>Community development</strong><small>Shared progress</small></p></div>
      </section>
    </main>

    <footer class="site-footer">
      <a href="#home" class="footer-brand">
        <span class="brand-logo">KS</span>
        <span>KITABI SECTOR<small>DIGITAL PORTFOLIO</small></span>
      </a>
      <p>Digital Portfolio · Nyamagabe District, Rwanda</p>
      <a href="#home" class="text-link">Back to top ↑</a>
    </footer>

    <button v-if="showTop" class="back-top" aria-label="Back to top" @click="scrollTop">↑</button>

    <div v-if="modal" class="modal-backdrop" @click.self="modal = null">
      <section class="modal" role="dialog" aria-modal="true" :aria-label="modal.title">
        <button class="modal-close" aria-label="Close" @click="modal = null">×</button>
        <small class="eyebrow">KITABI SECTOR · INFORMATION</small>
        <h2>{{ modal.title }}</h2>
        <p>{{ modal.description }}</p>
        <button class="btn primary" @click="modal = null">Close</button>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",

  data() {
    return {
      lightTheme: false,
      menuOpen: false,
      query: "",
      lastQuery: "",
      searched: false,
      language: "en",
      modal: null,
      showTop: false,

      links: [
        { id: "home", label: "Home" },
        { id: "about", label: "About" },
        { id: "administration", label: "Administration" },
        { id: "services", label: "Services" },
        { id: "dashboard", label: "Dashboard" },
        { id: "sectors", label: "Attractions" },
        { id: "news", label: "Media Center" },
        { id: "research", label: "Research" },
        { id: "contact", label: "Contact" }
      ],

      statistics: [
        { icon: "♟", label: "Population", value: "—", unit: "", caption: "Official data needed", detail: "Connect the latest official population data before displaying a figure." },
        { icon: "▦", label: "Cells", value: "5*", unit: "", caption: "Verify officially", detail: "The original page listed 5 cells. Verify the current administrative figure before publishing." },
        { icon: "⌂", label: "Villages", value: "53*", unit: "", caption: "Verify officially", detail: "The original page listed 53 villages. Verify the current administrative figure before publishing." },
        { icon: "♙", label: "Employees", value: "—", unit: "", caption: "Official data needed", detail: "Connect verified public-service staffing data." },
        { icon: "▧", label: "Projects", value: "—", unit: "", caption: "Official data needed", detail: "Connect an official development project register." },
        { icon: "◔", label: "Budget", value: "—", unit: "RWF", caption: "Official data needed", detail: "Use a verified, current public financial report." },
        { icon: "▥", label: "Revenue", value: "—", unit: "RWF", caption: "Official data needed", detail: "Use a verified, current public financial report." },
        { icon: "↗", label: "Expenditure", value: "—", unit: "RWF", caption: "Official data needed", detail: "Use a verified, current public financial report." }
      ],

      announcements: [
        {
          title: "Community Clean-Up Campaign",
          date: "Sample announcement",
          image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=180&q=80",
          description: "Sample community clean-up notice. Add the approved date, location, and official contact before publishing."
        },
        {
          title: "Tree Planting & Environment",
          date: "Sample announcement",
          image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=180&q=80",
          description: "Sample environmental notice. Replace with confirmed details from the sector office."
        },
        {
          title: "Community Meeting",
          date: "Sample announcement",
          image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=180&q=80",
          description: "Sample meeting notice. Add a verified date, venue, agenda, and contact."
        },
        {
          title: "Public Information Session",
          date: "Sample announcement",
          image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=180&q=80",
          description: "Sample public information notice. Replace with an approved announcement."
        }
      ],

      news: [
        {
          title: "Community Infrastructure and Development",
          category: "COMMUNITY DEVELOPMENT",
          date: "Sample feature",
          image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=900&q=85",
          description: "Illustrative news feature. Replace with a verified local article, date, and source."
        },
        {
          title: "Education and Skills Development",
          date: "Sample story",
          image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=180&q=80",
          description: "Sample story about education and skills development. Add verified information before publishing."
        },
        {
          title: "Sustainable Tourism and Nature",
          date: "Sample story",
          image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=180&q=80",
          description: "Sample environmental story. Replace with confirmed local news."
        }
      ],

      attractions: [
        {
          title: "Nyungwe National Park",
          image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80",
          description: "Nyungwe is a major protected forest in southwestern Rwanda. Check official visitor information before planning a visit."
        },
        {
          title: "Green Hills & Landscapes",
          image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=500&q=80",
          description: "Discover the region's green highland scenery. Confirm local visitor access before travelling."
        },
        {
          title: "Water & Nature",
          image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=500&q=80",
          description: "An environmental feature highlighting water resources and conservation."
        },
        {
          title: "Culture & Heritage",
          image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=500&q=80",
          description: "Use this section for verified local cultural sites, heritage, and community traditions."
        }
      ],

      services: [
        { icon: "▣", title: "Certificates", subtitle: "Requirements", description: "Find out about certificate requirements. Confirm the process with the relevant public office." },
        { icon: "▤", title: "Documents", subtitle: "Public information", description: "Add official document requirements, eligibility, fees where applicable, and office contacts." },
        { icon: "▧", title: "Forms", subtitle: "Service forms", description: "Online forms are not connected. Add official form links or a secure backend." },
        { icon: "♙", title: "Complaints", subtitle: "Get assistance", description: "Online complaint submission is not connected. A secure backend and responsible office are required." },
        { icon: "⌂", title: "Projects", subtitle: "Development", description: "Connect official project data, progress, timelines, and responsible offices." },
        { icon: "◔", title: "Budget Info", subtitle: "Public finance", description: "Publish budget summaries from verified official financial reports." },
        { icon: "▥", title: "Statistics", subtitle: "Local data", description: "Connect verified population and public service statistics." },
        { icon: "?", title: "FAQs", subtitle: "Common questions", description: "Add answers about office hours, requirements, and public services." }
      ],

      researchItems: [
        { icon: "▥", title: "Community Statistics", description: "Population and service data from verified official sources." },
        { icon: "♧", title: "Environment Reports", description: "Environmental conservation and natural resource information." },
        { icon: "▤", title: "Development Reports", description: "Local programs, plans, and progress reports." }
      ]
    };
  },

  computed: {
    searchableItems() {
      return [
        ...this.announcements.map(item => ({ ...item, category: "Announcement" })),
        ...this.news.map(item => ({ ...item, category: "News" })),
        ...this.services.map(item => ({ ...item, category: "Service" })),
        ...this.attractions.map(item => ({ ...item, category: "Attraction" })),
        ...this.researchItems.map(item => ({ ...item, category: "Research" })),
        { title: "About Kitabi Sector", category: "Page", description: "Location, environment, and community overview." },
        { title: "Administration", category: "Page", description: "Local governance and public services information." },
        { title: "Contact", category: "Page", description: "Contact the relevant local authority for official information." }
      ];
    },

    results() {
      const term = this.lastQuery.toLowerCase();
      if (!term) return [];
      return this.searchableItems.filter(item =>
        `${item.title} ${item.description} ${item.category}`.toLowerCase().includes(term)
      ).slice(0, 12);
    }
  },

  watch: {
    language(value) {
      document.documentElement.lang = value;
    }
  },

  mounted() {
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    this.handleScroll();
  },

  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    document.body.style.overflow = "";
  },

  methods: {
    translate(text) {
      if (this.language !== "rw") return text;
      const translations = {
        "WELCOME TO": "IKAZE KURI",
        "Explore Kitabi": "Menya Kitabi",
        "View Dashboard": "Reba Imbonerahamwe",
        "Discover the beauty, opportunities, and achievements of Kitabi Sector. A land of green hills, culture, innovation, and sustainable development.": "Menya ubwiza, amahirwe n'ibikorwa by'iterambere by'Umurenge wa Kitabi.",
        "Discover our community, services and opportunities": "Menya abaturage, serivisi n'amahirwe bihari",
        "Home": "Ahabanza",
        "About": "Abo turi bo",
        "Administration": "Ubuyobozi",
        "Services": "Serivisi",
        "Dashboard": "Imibare",
        "Attractions": "Ahantu nyaburanga",
        "Media Center": "Amakuru",
        "Research": "Ubushakashatsi",
        "Contact": "Twandikire"
      };
      return translations[text] || text;
    },

    search() {
      this.lastQuery = this.query;
      this.searched = true;
      this.menuOpen = false;
      this.$nextTick(() => {
        document.getElementById("search-results")?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    },

    clearSearch() {
      this.query = "";
      this.lastQuery = "";
      this.searched = false;
    },

    showDetails(title, description) {
      this.modal = { title, description };
      document.body.style.overflow = "hidden";
    },

    handleScroll() {
      this.showTop = window.scrollY > 400;
    },

    scrollTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: 90px;
}

html, body, #app {
  width: 100%;
  min-height: 100%;
  margin: 0;
  padding: 0;
}

body {
  overflow-x: hidden;
  font-family: Inter, "Segoe UI", Arial, sans-serif;
}

button, input, select {
  font: inherit;
}

button, a {
  -webkit-tap-highlight-color: transparent;
}

button {
  cursor: pointer;
}

a {
  color: inherit;
  text-decoration: none;
}

.portfolio {
  --bg: #03140b;
  --panel: #071b10;
  --soft: #102b1a;
  --text: #f4fff6;
  --muted: #a9c5b0;
  --line: rgba(113,206,128,.19);
  --green: #7cdd79;
  min-height: 100vh;
  color: var(--text);
  background: var(--bg);
  transition: background .2s, color .2s;
}

.portfolio.light {
  --bg: #f1f7f0;
  --panel: #fff;
  --soft: #e9f3e8;
  --text: #142a19;
  --muted: #5d7161;
  --line: rgba(35,92,48,.18);
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  padding: 12px 4.3%;
  border-bottom: 1px solid var(--line);
  background: var(--bg);
  backdrop-filter: blur(18px);
}

.brand, .footer-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 800;
}

.brand > span:last-child, .footer-brand > span:last-child {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.brand small, .footer-brand small {
  color: var(--muted);
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 1.2px;
}

.brand-logo {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(145deg,#36d58c,#087c4c);
  color: #04170c;
  font-weight: 900;
}

.site-header nav {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.site-header nav a {
  padding: 10px 7px;
  border-bottom: 2px solid transparent;
  color: var(--muted);
  font-size: 10px;
  white-space: nowrap;
}

.site-header nav a:hover {
  color: var(--green);
  border-color: var(--green);
}

.nav-tools {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search {
  display: flex;
  align-items: center;
  gap: 7px;
  width: 175px;
  padding: 8px 10px;
  border: 1px solid var(--line);
  border-radius: 25px;
  background: var(--soft);
}

.search span {
  color: var(--green);
  font-size: 20px;
}

.search input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text);
  font-size: 10px;
}

.search button {
  border: 0;
  background: transparent;
  color: var(--muted);
}

.nav-tools select, .theme-btn, .mobile-toggle {
  height: 36px;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: var(--soft);
  color: var(--text);
}

.nav-tools select {
  padding: 0 7px;
  font-size: 10px;
}

.theme-btn {
  width: 36px;
  font-size: 17px;
}

.mobile-toggle {
  display: none;
  width: 38px;
  font-size: 18px;
}

.hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  min-height: 435px;
  padding: 40px 4.3%;
  background: #092516 url('@/assets/images/campus-hero.jpg') center/cover no-repeat;
}

.hero-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg,rgba(0,13,5,.94),rgba(0,17,8,.55) 60%,rgba(0,13,5,.78));
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 590px;
}

.eyebrow {
  color: #78d87b;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.7px;
}

.hero h1 {
  margin: 12px 0;
  font-size: clamp(42px,5.3vw,74px);
  line-height: 1.05;
  letter-spacing: -2px;
}

.hero h3 {
  margin: 12px 0;
  color: #83df80;
  font-size: clamp(13px,1.5vw,18px);
  line-height: 1.5;
}

.hero-content > p {
  max-width: 470px;
  color: #e0ebe1;
  font-size: 12px;
  line-height: 1.9;
}

.hero-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 22px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 42px;
  padding: 11px 16px;
  border: 1px solid transparent;
  border-radius: 7px;
  font-size: 11px;
  font-weight: 700;
  transition: transform .2s, background .2s;
}

.btn:hover {
  transform: translateY(-2px);
}

.primary {
  background: #278b40;
  color: white;
}

.primary:hover {
  background: #36a750;
}

.secondary {
  border-color: rgba(255,255,255,.3);
  background: rgba(0,17,8,.5);
  color: white;
}

.hero-note {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 22px;
  color: #c5d9c9;
  font-size: 10px;
}

.dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #74d776;
}

.map-card {
  position: relative;
  z-index: 1;
  width: 31%;
  min-width: 260px;
  max-width: 355px;
  padding: 17px;
  border: 1px solid rgba(178,222,172,.28);
  border-radius: 14px;
  background: rgba(3,20,11,.82);
  backdrop-filter: blur(15px);
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.section-title h3 {
  margin: 5px 0 0;
  font-size: 16px;
}

.section-title small:not(.eyebrow) {
  color: var(--muted);
  font-size: 10px;
}

.map-pin {
  color: var(--green);
  font-size: 27px;
}

.map-visual svg {
  display: block;
  width: 100%;
  max-height: 240px;
}

.map-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid rgba(255,255,255,.12);
  color: #c1d4c3;
  font-size: 9px;
}

.map-footer > span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.text-link {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--green);
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
}

.statistics {
  display: grid;
  grid-template-columns: repeat(4,minmax(0,1fr));
  gap: 10px;
  padding: 18px 4.3% 5px;
  scroll-margin-top: 90px;
}

.stat-card {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  min-width: 0;
  padding: 16px 12px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: linear-gradient(145deg,var(--soft),var(--panel));
  color: var(--text);
  text-align: left;
}

.stat-card:hover {
  border-color: #4eb85b;
  transform: translateY(-2px);
}

.stat-icon, .info-icon {
  display: grid;
  place-items: center;
  width: 37px;
  height: 37px;
  flex-shrink: 0;
  border-radius: 10px;
  background: rgba(66,201,101,.12);
  color: #65ce70;
  font-size: 21px;
}

.stat-copy {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.stat-copy small {
  color: var(--muted);
  font-size: 9px;
  line-height: 1.4;
}

.stat-copy strong {
  font-size: clamp(18px,1.7vw,24px);
  overflow-wrap: anywhere;
}

.stat-copy em {
  color: var(--muted);
  font-size: 9px;
  font-style: normal;
}

.stat-arrow {
  margin-left: auto;
  color: var(--green);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 14px;
  padding: 15px 4.3% 22px;
}

.panel {
  min-width: 0;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--panel);
  scroll-margin-top: 90px;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  padding: 10px 0;
  border: 0;
  border-bottom: 1px solid var(--line);
  background: transparent;
  color: var(--text);
  text-align: left;
}

.list-item img {
  width: 61px;
  height: 49px;
  flex-shrink: 0;
  border-radius: 7px;
  object-fit: cover;
}

.item-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.item-copy strong {
  font-size: 11px;
  line-height: 1.5;
}

.item-copy small {
  color: var(--muted);
  font-size: 9px;
}

.arrow {
  color: var(--green);
  font-size: 21px;
}

.footnote {
  color: var(--muted);
  font-size: 9px;
  line-height: 1.6;
}

.featured-news {
  position: relative;
  display: block;
  width: 100%;
  height: 185px;
  overflow: hidden;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: var(--soft);
  text-align: left;
}

.featured-news img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.featured-caption {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 35px 13px 12px;
  background: linear-gradient(transparent,rgba(0,10,4,.96));
  color: white;
}

.featured-caption small {
  color: #bfe7bd;
  font-size: 9px;
}

.featured-caption strong {
  font-size: 13px;
}

.attraction-grid {
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 10px;
}

.attraction-card {
  position: relative;
  height: 155px;
  overflow: hidden;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--soft);
  text-align: left;
}

.attraction-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .3s;
}

.attraction-card:hover img {
  transform: scale(1.06);
}

.attraction-card > span {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 25px 10px 10px;
  background: linear-gradient(transparent,rgba(0,10,4,.95));
  color: white;
  font-size: 10px;
  font-weight: 700;
}

.attraction-card small {
  color: #c9e9c9;
  font-size: 9px;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(4,minmax(0,1fr));
  gap: 8px;
}

.service-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 96px;
  padding: 10px 4px;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: var(--soft);
  color: var(--text);
  text-align: center;
}

.service-card:hover, .research-card:hover {
  border-color: #4eb85b;
  transform: translateY(-2px);
}

.service-card > span {
  color: #74c878;
  font-size: 23px;
}

.service-card strong {
  font-size: 10px;
}

.service-card small {
  color: var(--muted);
  font-size: 8px;
}

.help-card {
  margin-top: 13px;
  padding: 13px;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: var(--soft);
}

.help-card strong {
  font-size: 11px;
}

.help-card p {
  color: var(--muted);
  font-size: 10px;
  line-height: 1.6;
}

.content-section {
  margin: 0 4.3% 16px;
}

.content-section h2, .contact-section h2 {
  margin: 8px 0;
  font-size: clamp(23px,3vw,30px);
}

.section-description, .contact-section p {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.8;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3,minmax(0,1fr));
  gap: 12px;
  margin-top: 20px;
}

.info-grid article, .research-card {
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--soft);
}

.info-grid h3, .research-card h3 {
  font-size: 13px;
}

.info-grid p, .research-card p {
  color: var(--muted);
  font-size: 11px;
  line-height: 1.8;
}

.admin-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
}

.admin-highlight {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px;
  border-radius: 10px;
  background: var(--soft);
}

.admin-highlight h3 {
  margin-top: 0;
  font-size: 13px;
}

.admin-highlight p {
  color: var(--muted);
  font-size: 11px;
  line-height: 1.8;
}

.admin-list p {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
}

.admin-list strong {
  font-size: 11px;
}

.admin-list small {
  color: var(--muted);
  font-size: 10px;
}

.research-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: var(--text);
  text-align: left;
}

.research-card b {
  color: var(--green);
  font-size: 10px;
}

.contact-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
  margin: 0 4.3% 18px;
  padding: 25px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: linear-gradient(120deg,var(--soft),var(--panel));
  scroll-margin-top: 90px;
}

.contact-section > div {
  max-width: 650px;
}

.contact-section .btn {
  flex-shrink: 0;
}

.info-footer {
  display: grid;
  grid-template-columns: repeat(4,minmax(0,1fr));
  gap: 8px;
  padding: 20px 4.3%;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.info-footer > div {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 8px;
  border-right: 1px solid var(--line);
}

.info-footer > div:last-child {
  border-right: 0;
}

.info-footer > div > span {
  color: var(--green);
  font-size: 24px;
}

.info-footer p {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 0;
}

.info-footer strong {
  font-size: 10px;
}

.info-footer small {
  color: var(--muted);
  font-size: 9px;
}

.site-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 20px 4.3%;
  color: var(--muted);
  font-size: 10px;
}

.back-top {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 80;
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 50%;
  background: #278b40;
  color: white;
  font-size: 20px;
  box-shadow: 0 6px 22px rgba(0,0,0,.25);
}

.search-results {
  margin: 18px 4.3% 0;
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--panel);
  scroll-margin-top: 90px;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(3,minmax(0,1fr));
  gap: 10px;
}

.result-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--soft);
  color: var(--text);
  text-align: left;
}

.result-card small, .result-card b {
  color: var(--green);
  font-size: 10px;
}

.result-card strong {
  font-size: 12px;
}

.result-card span, .muted {
  color: var(--muted);
  font-size: 10px;
  line-height: 1.7;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(0,8,3,.76);
  backdrop-filter: blur(7px);
}

.modal {
  position: relative;
  width: min(100%,520px);
  padding: 30px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--panel);
  color: var(--text);
  box-shadow: 0 25px 90px rgba(0,0,0,.35);
}

.modal h2 {
  margin: 13px 0;
  font-size: 24px;
}

.modal p {
  margin-bottom: 24px;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.9;
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 14px;
  width: 34px;
  height: 34px;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: var(--soft);
  color: var(--text);
  font-size: 22px;
}

@media (max-width: 1250px) {
  .site-header {
    flex-wrap: wrap;
    gap: 10px;
  }

  .site-header nav {
    gap: 0;
  }

  .site-header nav a {
    padding: 9px 5px;
    font-size: 9px;
  }

  .search {
    width: 145px;
  }
}

@media (max-width: 1000px) {
  .mobile-toggle {
    display: block;
    margin-left: auto;
  }

  .site-header nav {
    display: none;
    order: 4;
    flex-basis: 100%;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .site-header nav.menu-open {
    display: flex;
  }

  .site-header nav a {
    padding: 10px;
    font-size: 11px;
  }

  .nav-tools {
    order: 3;
  }
}

@media (max-width: 720px) {
  .site-header {
    padding: 10px 14px;
  }

  .nav-tools {
    width: 100%;
  }

  .search {
    flex: 1;
    width: auto;
  }

  .hero {
    flex-direction: column;
    align-items: stretch;
    padding: 35px 18px 22px;
  }

  .hero h1 {
    font-size: 47px;
  }

  .map-card {
    width: 100%;
    max-width: none;
    min-width: 0;
  }

  .statistics {
    grid-template-columns: repeat(2,minmax(0,1fr));
    gap: 8px;
    padding: 12px;
  }

  .stat-card {
    padding: 12px 9px;
    gap: 8px;
  }

  .stat-icon {
    width: 32px;
    height: 32px;
  }

  .dashboard-grid {
    grid-template-columns: minmax(0,1fr);
    padding: 5px 12px 15px;
  }

  .panel {
    padding: 15px;
  }

  .content-section, .contact-section {
    margin-right: 12px;
    margin-left: 12px;
  }

  .info-grid, .admin-grid {
    grid-template-columns: minmax(0,1fr);
  }

  .contact-section {
    align-items: flex-start;
    flex-direction: column;
    padding: 20px;
  }

  .info-footer {
    grid-template-columns: repeat(2,minmax(0,1fr));
    padding: 14px 12px;
  }

  .info-footer > div {
    justify-content: flex-start;
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }

  .site-footer {
    flex-wrap: wrap;
    padding: 18px 12px;
  }

  .search-results {
    margin: 12px;
    padding: 15px;
  }

  .results-grid {
    grid-template-columns: minmax(0,1fr);
  }
}

@media (max-width: 400px) {
  .service-grid {
    grid-template-columns: repeat(2,minmax(0,1fr));
  }

  .attraction-grid {
    grid-template-columns: minmax(0,1fr);
  }

  .attraction-card {
    height: 180px;
  }

  .brand {
    font-size: 11px;
  }

  .brand-logo {
    width: 36px;
    height: 36px;
  }
}
</style>


// about page content


<template>
  <div class="about-page">
    <header class="about-header">
      <router-link to="/" class="brand">
        <div class="brand-logo">KS</div>
        <div>
          <h2>Kitabi Sector</h2>
          <span>Digital Portfolio</span>
        </div>
      </router-link>

      <nav class="navigation">
        <router-link to="/">Home</router-link>
        <router-link to="/about" class="active">About Us</router-link>
        <a href="#services">Services</a>
        <a href="#contact">Contact</a>
      </nav>

      <router-link to="/" class="home-button">← Back Home</router-link>
    </header>

    <main>
      <section class="hero">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <span class="eyebrow">WELCOME TO KITABI SECTOR</span>
          <h1>About Our <span>Sector</span></h1>
          <p>
            Discover our community, our values, and our commitment to
            building a better future for every resident.
          </p>
          <div class="breadcrumbs">
            <router-link to="/">Home</router-link>
            <span>/</span>
            <span>About Us</span>
          </div>
        </div>
      </section>

      <section class="intro section">
        <div class="intro-image">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=85"
            alt="Green countryside and agricultural landscape"
          />
          <div class="image-label">
            <span class="label-icon">🌱</span>
            <div>
              <strong>Growing Together</strong>
              <p>A stronger community for everyone</p>
            </div>
          </div>
        </div>

        <div class="intro-content">
          <span class="section-tag">WHO WE ARE</span>
          <h2>Building a Better Future for Kitabi</h2>
          <p>
            Kitabi Sector is a local administrative community in Nyamagabe
            District, Southern Province, Rwanda. This digital portfolio
            provides a central place to learn about the sector, discover
            public services, and access useful community information.
          </p>
          <p>
            We aim to encourage community participation, support local
            development, improve access to information, and promote
            cooperation between residents and local administration.
          </p>

          <div class="intro-points">
            <div><span>✓</span> Community development</div>
            <div><span>✓</span> Accessible public information</div>
            <div><span>✓</span> Transparent local administration</div>
            <div><span>✓</span> Sustainable progress</div>
          </div>

          <a href="#mission" class="primary-button">Discover Our Mission →</a>
        </div>
      </section>

      <section class="values-section section" id="mission">
        <div class="section-heading">
          <span class="section-tag">OUR PURPOSE</span>
          <h2>Mission, Vision & Values</h2>
          <p>The principles that guide our work and our community.</p>
        </div>

        <div class="values-grid">
          <article class="value-card">
            <div class="value-icon green">🎯</div>
            <h3>Our Mission</h3>
            <p>
              To support inclusive community development and make public
              information and services easier for residents to access.
            </p>
          </article>

          <article class="value-card featured">
            <div class="value-icon white">🌍</div>
            <h3>Our Vision</h3>
            <p>
              A connected, informed, and thriving community where residents
              participate in sustainable development and shared progress.
            </p>
          </article>

          <article class="value-card">
            <div class="value-icon gold">🤝</div>
            <h3>Our Values</h3>
            <p>
              Integrity, accountability, teamwork, respect, innovation,
              and service to the community.
            </p>
          </article>
        </div>
      </section>

      <section class="facts-section section">
        <div class="section-heading">
          <span class="section-tag">OUR COMMUNITY</span>
          <h2>Kitabi at a Glance</h2>
          <p>Explore the key areas that contribute to local development.</p>
        </div>

        <div class="facts-grid">
          <article class="fact-card">
            <div class="fact-icon">🏘️</div>
            <h3>Community</h3>
            <p>Supporting residents and strengthening community participation.</p>
          </article>

          <article class="fact-card">
            <div class="fact-icon">🌾</div>
            <h3>Agriculture</h3>
            <p>Encouraging sustainable farming and local economic activities.</p>
          </article>

          <article class="fact-card">
            <div class="fact-icon">🎓</div>
            <h3>Education</h3>
            <p>Promoting learning, skills development, and opportunity.</p>
          </article>

          <article class="fact-card">
            <div class="fact-icon">🏥</div>
            <h3>Well-being</h3>
            <p>Supporting awareness of health and essential community services.</p>
          </article>
        </div>
      </section>

      <section class="services-section section" id="services">
        <div class="section-heading">
          <span class="section-tag">WHAT WE DO</span>
          <h2>Community Services</h2>
          <p>Information and services residents may need in everyday life.</p>
        </div>

        <div class="services-grid">
          <article class="service-card">
            <div class="service-icon">📄</div>
            <div>
              <h3>Administrative Information</h3>
              <p>Find information about local administration and public procedures.</p>
            </div>
            <span class="service-arrow">↗</span>
          </article>

          <article class="service-card">
            <div class="service-icon">👥</div>
            <div>
              <h3>Community Engagement</h3>
              <p>Encourage participation in community activities and development.</p>
            </div>
            <span class="service-arrow">↗</span>
          </article>

          <article class="service-card">
            <div class="service-icon">📢</div>
            <div>
              <h3>News & Announcements</h3>
              <p>Stay informed about notices, activities, and public updates.</p>
            </div>
            <span class="service-arrow">↗</span>
          </article>

          <article class="service-card">
            <div class="service-icon">💬</div>
            <div>
              <h3>Contact & Support</h3>
              <p>Find relevant channels for questions and public inquiries.</p>
            </div>
            <span class="service-arrow">↗</span>
          </article>
        </div>
      </section>

      <section class="cta-section" id="contact">
        <div>
          <span class="cta-label">LET'S WORK TOGETHER</span>
          <h2>Be Part of Kitabi's Development</h2>
          <p>
            A better community starts with informed residents and shared
            responsibility.
          </p>
        </div>
        <a
          href="https://www.nyamagabe.gov.rw/"
          target="_blank"
          rel="noopener noreferrer"
          class="cta-button"
        >
          District Website ↗
        </a>
      </section>
    </main>

    <footer class="footer">
      <div class="footer-brand">
        <div class="brand-logo">KS</div>
        <div>
          <strong>Kitabi Sector</strong>
          <p>Digital Portfolio</p>
        </div>
      </div>

      <p class="copyright">
        © {{ currentYear }} Kitabi Sector Digital Portfolio.
      </p>

      <router-link to="/" class="footer-link">Return to Home ↑</router-link>
    </footer>
  </div>
</template>

<script>
export default {
  name: "AboutView",
  data() {
    return {
      currentYear: new Date().getFullYear()
    };
  }
};
</script>

<style scoped>
.about-page {
  --primary: #116b45;
  --primary-dark: #084c32;
  --accent: #d6a642;
  --text: #192b23;
  --muted: #68776f;
  --surface: #ffffff;
  --background: #f5f8f5;
  min-height: 100vh;
  margin: 0;
  color: var(--text);
  background: var(--background);
  font-family: Inter, "Segoe UI", Arial, sans-serif;
}

.about-page * {
  box-sizing: border-box;
}

.about-header {
  width: 100%;
  min-height: 82px;
  padding: 14px 6%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  background: #fff;
  border-bottom: 1px solid #e8eee9;
}

.brand,
.footer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--text);
}

.brand-logo {
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  color: white;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -1px;
  border-radius: 13px;
  background: linear-gradient(135deg, #16885a, #075034);
  box-shadow: 0 5px 14px #116b4525;
}

.brand h2 {
  margin: 0 0 3px;
  font-size: 17px;
  font-weight: 750;
}

.brand span,
.footer-brand p {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
}

.navigation {
  display: flex;
  align-items: center;
  gap: 30px;
}

.navigation a {
  color: #56655d;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.navigation a:hover,
.navigation a.active {
  color: var(--primary);
}

.navigation a.active {
  position: relative;
}

.navigation a.active::after {
  position: absolute;
  content: "";
  height: 3px;
  width: 20px;
  left: 0;
  bottom: -10px;
  border-radius: 5px;
  background: var(--primary);
}

.home-button,
.primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 19px;
  border-radius: 9px;
  background: var(--primary);
  color: white;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s;
}

.home-button:hover,
.primary-button:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

.hero {
  position: relative;
  min-height: 350px;
  display: flex;
  align-items: center;
  padding: 70px 8%;
  overflow: hidden;
  color: white;
  background:
    linear-gradient(90deg, rgba(5, 47, 31, 0.95), rgba(7, 76, 48, 0.76)),
    url("https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1800&q=85")
    center 48% / cover;
}

.hero-overlay {
  position: absolute;
  width: 360px;
  height: 360px;
  right: 8%;
  top: -130px;
  border: 1px solid #ffffff20;
  border-radius: 50%;
  box-shadow: 0 0 0 45px #ffffff08, 0 0 0 90px #ffffff05;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 720px;
}

.eyebrow,
.section-tag,
.cta-label {
  color: #e4c16e;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2px;
}

.hero h1 {
  margin: 17px 0 14px;
  font-size: clamp(38px, 5vw, 58px);
  line-height: 1.1;
  letter-spacing: -2px;
}

.hero h1 span {
  color: #e4c16e;
}

.hero-content > p {
  max-width: 580px;
  margin: 0;
  color: #e0ece4;
  font-size: 16px;
  line-height: 1.8;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 25px;
  font-size: 13px;
  color: #d2e0d6;
}

.breadcrumbs a {
  color: #e4c16e;
  text-decoration: none;
}

.section {
  padding: 82px 8%;
}

.intro {
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  align-items: center;
  gap: 65px;
  background: #fff;
}

.intro-image {
  position: relative;
  min-width: 0;
}

.intro-image > img {
  display: block;
  width: 100%;
  height: 420px;
  object-fit: cover;
  border-radius: 18px;
}

.image-label {
  position: absolute;
  right: -18px;
  bottom: 24px;
  display: flex;
  align-items: center;
  gap: 13px;
  max-width: 290px;
  padding: 17px 20px;
  border: 1px solid #e5eee6;
  border-radius: 12px;
  background: white;
  box-shadow: 0 12px 35px #102e1d17;
}

.label-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: #e7f4eb;
  font-size: 21px;
}

.image-label strong {
  font-size: 13px;
}

.image-label p {
  margin: 5px 0 0;
  color: var(--muted);
  font-size: 11px;
}

.intro-content .section-tag,
.section-heading .section-tag {
  color: var(--primary);
}

.intro-content h2,
.section-heading h2 {
  margin: 13px 0 18px;
  font-size: clamp(28px, 3vw, 38px);
  line-height: 1.25;
  letter-spacing: -1px;
}

.intro-content > p {
  margin: 0 0 15px;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.9;
}

.intro-points {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 12px;
  margin: 25px 0 30px;
}

.intro-points div {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  font-size: 12px;
  font-weight: 650;
}

.intro-points span {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 19px;
  height: 19px;
  color: var(--primary);
  border-radius: 50%;
  background: #e6f4eb;
  font-size: 12px;
}

.values-section,
.services-section {
  background: var(--background);
}

.section-heading {
  max-width: 650px;
  margin: 0 auto 42px;
  text-align: center;
}

.section-heading h2 {
  margin-bottom: 12px;
}

.section-heading > p {
  margin: 0;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.8;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: auto;
}

.value-card {
  padding: 32px 28px;
  border: 1px solid #e8eee9;
  border-radius: 15px;
  background: white;
  transition: transform 0.25s, box-shadow 0.25s;
}

.value-card:hover,
.fact-card:hover,
.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 14px 35px #153b2510;
}

.value-card.featured {
  color: white;
  border-color: var(--primary);
  background: linear-gradient(145deg, #16774d, #08472f);
}

.value-icon {
  width: 53px;
  height: 53px;
  display: grid;
  place-items: center;
  margin-bottom: 23px;
  border-radius: 14px;
  font-size: 23px;
}

.value-icon.green {
  background: #e6f4eb;
}

.value-icon.white {
  background: #ffffff20;
}

.value-icon.gold {
  background: #fbf1d9;
}

.value-card h3,
.fact-card h3,
.service-card h3 {
  margin: 0 0 12px;
  font-size: 17px;
}

.value-card p,
.fact-card p,
.service-card p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.85;
}

.value-card.featured p {
  color: #d9e9de;
}

.facts-section {
  background: #fff;
}

.facts-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: auto;
}

.fact-card {
  padding: 27px 23px;
  border: 1px solid #e7eee8;
  border-radius: 14px;
  background: #fff;
  transition: transform 0.25s, box-shadow 0.25s;
}

.fact-icon,
.service-icon {
  display: grid;
  place-items: center;
  width: 49px;
  height: 49px;
  margin-bottom: 20px;
  border-radius: 13px;
  background: #eaf5ed;
  font-size: 23px;
}

.fact-card h3 {
  font-size: 15px;
}

.fact-card p {
  font-size: 12px;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  max-width: 1050px;
  margin: auto;
}

.service-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 18px;
  padding: 25px;
  border: 1px solid #e4ebe5;
  border-radius: 14px;
  background: white;
  transition: transform 0.25s, box-shadow 0.25s;
}

.service-icon {
  flex-shrink: 0;
  margin: 0;
}

.service-card h3 {
  font-size: 15px;
}

.service-card p {
  font-size: 12px;
}

.service-arrow {
  margin-left: auto;
  color: var(--primary);
  font-size: 19px;
}

.cta-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  margin: 0;
  padding: 55px 8%;
  color: white;
  background: linear-gradient(120deg, #0c5738, #073b29);
}

.cta-label {
  color: #e4c16e;
}

.cta-section h2 {
  margin: 13px 0 10px;
  font-size: clamp(24px, 3vw, 34px);
  letter-spacing: -0.7px;
}

.cta-section p {
  margin: 0;
  color: #d4e6da;
  font-size: 13px;
  line-height: 1.8;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-height: 48px;
  padding: 0 22px;
  color: #153d2a;
  border-radius: 9px;
  background: #e4c16e;
  font-size: 13px;
  font-weight: 750;
  text-decoration: none;
  transition: transform 0.2s, background 0.2s;
}

.cta-button:hover {
  transform: translateY(-2px);
  background: #f0d38b;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 25px 6%;
  background: #fff;
  border-top: 1px solid #e8eee9;
}

.footer .brand-logo {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  font-size: 15px;
}

.footer-brand strong {
  font-size: 13px;
}

.footer-brand p {
  margin-top: 4px;
  font-size: 11px;
}

.copyright,
.footer-link {
  color: var(--muted);
  font-size: 12px;
}

.footer-link {
  color: var(--primary);
  font-weight: 650;
  text-decoration: none;
}

@media (max-width: 1000px) {
  .about-header {
    padding-right: 4%;
    padding-left: 4%;
  }

  .navigation {
    gap: 17px;
  }

  .section {
    padding: 65px 5%;
  }

  .intro {
    gap: 40px;
  }

  .facts-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .about-header {
    flex-wrap: wrap;
    gap: 17px;
    padding: 15px 5%;
  }

  .navigation {
    order: 3;
    width: 100%;
    justify-content: space-between;
    gap: 10px;
    padding-top: 12px;
    border-top: 1px solid #edf0ed;
  }

  .navigation a {
    font-size: 12px;
  }

  .navigation a.active::after {
    bottom: -7px;
  }

  .home-button {
    min-height: 39px;
    padding: 0 12px;
    font-size: 11px;
  }

  .hero {
    min-height: 310px;
    padding: 55px 6%;
  }

  .hero h1 {
    letter-spacing: -1px;
  }

  .hero-content > p {
    font-size: 14px;
  }

  .section {
    padding: 55px 6%;
  }

  .intro {
    grid-template-columns: 1fr;
    gap: 35px;
  }

  .intro-image > img {
    height: 300px;
  }

  .image-label {
    right: 10px;
    bottom: 15px;
  }

  .intro-points {
    grid-template-columns: 1fr;
  }

  .values-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .value-card {
    padding: 27px;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }

  .cta-section {
    align-items: flex-start;
    flex-direction: column;
    padding: 45px 6%;
  }

  .footer {
    flex-wrap: wrap;
    padding: 24px 5%;
  }

  .copyright {
    order: 3;
    width: 100%;
    margin: 0;
  }
}

@media (max-width: 420px) {
  .brand h2 {
    font-size: 15px;
  }

  .brand-logo {
    width: 40px;
    height: 40px;
  }

  .navigation {
    gap: 7px;
  }

  .navigation a {
    font-size: 11px;
  }

  .facts-grid {
    grid-template-columns: 1fr;
  }

  .service-card {
    gap: 12px;
    padding: 19px 15px;
  }

  .service-icon {
    width: 40px;
    height: 40px;
    font-size: 19px;
  }
}
</style>

// adminstaration page 


<template>
  <div class="administration-page">
    <header class="admin-header">
      <router-link to="/" class="brand">
        <div class="brand-logo">KS</div>
        <div>
          <h2>Kitabi Sector</h2>
          <span>Digital Portfolio</span>
        </div>
      </router-link>

      <nav class="navigation">
        <router-link to="/">Home</router-link>
        <router-link to="/about">About Us</router-link>
        <router-link to="/administration" class="active">Administration</router-link>
      </nav>

      <router-link to="/" class="back-button">← Back Home</router-link>
    </header>

    <main>
      <section class="hero">
        <div class="hero-content">
          <span class="eyebrow">KITABI SECTOR • LEADERSHIP</span>
          <h1>Sector <span>Administration</span></h1>
          <p>
            Learn about local administration, leadership responsibilities,
            and the organizational structure supporting our community.
          </p>
          <div class="breadcrumbs">
            <router-link to="/">Home</router-link>
            <span>/</span>
            <span>Administration</span>
          </div>
        </div>
        <div class="hero-decoration">KS</div>
      </section>

      <section class="overview section">
        <div class="section-heading">
          <span class="section-tag">ADMINISTRATION OVERVIEW</span>
          <h2>Serving the Kitabi Community</h2>
          <p>
            Local administration helps coordinate public services, community
            participation, and development priorities.
          </p>
        </div>

        <div class="overview-grid">
          <article class="overview-card">
            <div class="overview-icon">🏛️</div>
            <h3>Local Governance</h3>
            <p>
              Supporting effective local administration and coordination
              with the district.
            </p>
          </article>

          <article class="overview-card">
            <div class="overview-icon">👥</div>
            <h3>Community Services</h3>
            <p>
              Helping residents access information and understand
              administrative procedures.
            </p>
          </article>

          <article class="overview-card">
            <div class="overview-icon">📊</div>
            <h3>Development Planning</h3>
            <p>
              Coordinating community priorities and supporting local
              development initiatives.
            </p>
          </article>

          <article class="overview-card">
            <div class="overview-icon">🤝</div>
            <h3>Public Participation</h3>
            <p>
              Encouraging cooperation, dialogue, and participation in
              community activities.
            </p>
          </article>
        </div>
      </section>

      <section class="leadership section">
        <div class="section-heading">
          <span class="section-tag">LEADERSHIP TEAM</span>
          <h2>Meet Our Administration</h2>
          <p>
            The administration team is responsible for coordinating local
            activities and supporting residents.
          </p>
        </div>

        <div class="notice">
          <span class="notice-icon">ℹ️</span>
          <p>
            <strong>Official information required:</strong>
            Replace the sample profiles below with verified names, titles,
            photographs, and contact details of current Kitabi Sector officials.
          </p>
        </div>

        <div class="leaders-grid">
          <article class="leader-card" v-for="leader in leaders" :key="leader.role">
            <div class="leader-photo" :class="leader.color">
              <span>{{ leader.initials }}</span>
              <div class="photo-badge">KS</div>
            </div>
            <div class="leader-info">
              <span class="leader-label">SECTOR LEADERSHIP</span>
              <h3>{{ leader.name }}</h3>
              <p class="leader-role">{{ leader.role }}</p>
              <p class="leader-description">{{ leader.description }}</p>
              <button class="profile-button" @click="showProfile(leader)">
                View Responsibilities <span>→</span>
              </button>
            </div>
          </article>
        </div>
      </section>

      <section class="structure-section section">
        <div class="section-heading">
          <span class="section-tag">HOW WE ARE ORGANIZED</span>
          <h2>Administrative Structure</h2>
          <p>
            An illustrative overview of how local administration connects
            with community-level leadership.
          </p>
        </div>

        <div class="structure">
          <div class="structure-level district">
            <span class="structure-icon">🏛️</span>
            <div>
              <strong>Nyamagabe District</strong>
              <p>District-level coordination and oversight</p>
            </div>
          </div>

          <div class="structure-connector"></div>

          <div class="structure-level sector">
            <span class="structure-icon">🏢</span>
            <div>
              <strong>Kitabi Sector</strong>
              <p>Sector-level administration and service coordination</p>
            </div>
          </div>

          <div class="structure-connector"></div>

          <div class="community-levels">
            <div class="structure-level community">
              <span class="structure-icon">🏘️</span>
              <div>
                <strong>Cells</strong>
                <p>Local coordination</p>
              </div>
            </div>

            <div class="structure-level community">
              <span class="structure-icon">👥</span>
              <div>
                <strong>Villages (Imidugudu)</strong>
                <p>Community engagement</p>
              </div>
            </div>
          </div>
          <p class="structure-note">
            Illustrative structure only. Confirm the current official
            administrative organization before publication.
          </p>
        </div>
      </section>

      <section class="responsibilities section">
        <div class="responsibilities-content">
          <span class="section-tag">OUR RESPONSIBILITIES</span>
          <h2>What the Administration Does</h2>
          <p>
            The administration works to connect community needs with
            public services and local development activities.
          </p>

          <div class="responsibility-list">
            <div v-for="item in responsibilities" :key="item.title" class="responsibility-item">
              <span class="check-icon">✓</span>
              <div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="responsibilities-visual">
          <div class="visual-top">
            <span>OUR COMMITMENT</span>
            <span class="visual-symbol">✦</span>
          </div>
          <div class="visual-emblem">🤝</div>
          <h3>Leadership Through Service</h3>
          <p>
            Working together for accountability, community participation,
            and sustainable development.
          </p>
          <div class="visual-bottom">
            <span>COMMUNITY</span>
            <span>TRANSPARENCY</span>
            <span>DEVELOPMENT</span>
          </div>
        </div>
      </section>

      <section class="contact-section" id="contact">
        <div class="contact-icon">💬</div>
        <div class="contact-copy">
          <span>GET IN TOUCH</span>
          <h2>Need Administrative Information?</h2>
          <p>
            Contact the relevant sector or district office for verified
            information about public services and administrative procedures.
          </p>
        </div>
        <a
          href="https://www.nyamagabe.gov.rw/"
          target="_blank"
          rel="noopener noreferrer"
          class="contact-button"
        >
          District Website ↗
        </a>
      </section>
    </main>

    <footer class="admin-footer">
      <div class="footer-brand">
        <div class="brand-logo">KS</div>
        <div>
          <strong>Kitabi Sector</strong>
          <p>Digital Portfolio</p>
        </div>
      </div>
      <p>© {{ currentYear }} Kitabi Sector Digital Portfolio.</p>
      <router-link to="/" class="footer-link">← Back to Home</router-link>
    </footer>

    <div v-if="selectedLeader" class="modal-overlay" @click.self="closeProfile">
      <div class="profile-modal">
        <button class="close-button" @click="closeProfile" aria-label="Close">×</button>
        <div class="modal-avatar">{{ selectedLeader.initials }}</div>
        <span class="section-tag">ROLE & RESPONSIBILITIES</span>
        <h2>{{ selectedLeader.role }}</h2>
        <h3>{{ selectedLeader.name }}</h3>
        <p>{{ selectedLeader.description }}</p>
        <div class="modal-note">
          Official names and individual duties should be confirmed with
          the relevant administration.
        </div>
        <button class="modal-button" @click="closeProfile">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdministrationView",

  data() {
    return {
      currentYear: new Date().getFullYear(),
      selectedLeader: null,

      leaders: [
        {
          initials: "SO",
          name: "Official Name",
          role: "Sector Executive Secretary",
          description:
            "Coordinates sector administration, public service delivery, and implementation of local priorities.",
          color: "leader-green"
        },
        {
          initials: "AD",
          name: "Official Name",
          role: "Administrative Officer",
          description:
            "Supports administrative coordination, records, communication, and the delivery of public services.",
          color: "leader-gold"
        },
        {
          initials: "CD",
          name: "Official Name",
          role: "Community Development Representative",
          description:
            "Supports community engagement and coordination of local development activities.",
          color: "leader-blue"
        }
      ],

      responsibilities: [
        {
          title: "Public Service Coordination",
          description:
            "Help residents find the appropriate public services and administrative information."
        },
        {
          title: "Community Development",
          description:
            "Support local initiatives and coordinate community development priorities."
        },
        {
          title: "Communication & Information",
          description:
            "Share public notices, relevant information, and community updates."
        },
        {
          title: "Accountability & Participation",
          description:
            "Encourage responsible administration and constructive resident participation."
        }
      ]
    };
  },

  methods: {
    showProfile(leader) {
      this.selectedLeader = leader;
      document.body.style.overflow = "hidden";
    },

    closeProfile() {
      this.selectedLeader = null;
      document.body.style.overflow = "";
    }
  },

  beforeUnmount() {
    document.body.style.overflow = "";
  }
};
</script>

<style scoped>
.administration-page {
  --primary: #116b45;
  --primary-dark: #08472f;
  --gold: #d8b15d;
  --text: #192b23;
  --muted: #68776f;
  --background: #f5f8f5;
  color: var(--text);
  background: var(--background);
  font-family: Inter, "Segoe UI", Arial, sans-serif;
  min-height: 100vh;
}

.administration-page * {
  box-sizing: border-box;
}

.admin-header {
  min-height: 82px;
  padding: 14px 6%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
  background: #fff;
  border-bottom: 1px solid #e7eee8;
}

.brand,
.footer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text);
  text-decoration: none;
}

.brand-logo {
  width: 45px;
  height: 45px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 12px;
  color: #fff;
  background: linear-gradient(135deg, #16885a, #075034);
  box-shadow: 0 5px 14px #116b4525;
  font-size: 17px;
  font-weight: 800;
}

.brand h2 {
  margin: 0 0 4px;
  font-size: 17px;
}

.brand span,
.footer-brand p {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
}

.navigation {
  display: flex;
  align-items: center;
  gap: 27px;
}

.navigation a {
  color: #56655d;
  font-size: 13px;
  font-weight: 650;
  text-decoration: none;
}

.navigation a:hover,
.navigation a.active {
  color: var(--primary);
}

.navigation a.active {
  position: relative;
}

.navigation a.active::after {
  position: absolute;
  content: "";
  left: 0;
  bottom: -11px;
  width: 22px;
  height: 3px;
  border-radius: 4px;
  background: var(--primary);
}

.back-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 43px;
  padding: 0 16px;
  border-radius: 8px;
  color: white;
  background: var(--primary);
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
}

.hero {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 340px;
  padding: 65px 8%;
  overflow: hidden;
  color: white;
  background: linear-gradient(115deg, #073c29, #116b45 70%, #1a7952);
}

.hero::before,
.hero::after {
  position: absolute;
  content: "";
  width: 360px;
  height: 360px;
  right: 8%;
  top: -160px;
  border: 1px solid #ffffff1c;
  border-radius: 50%;
}

.hero::after {
  width: 260px;
  height: 260px;
  right: 12%;
  top: -110px;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 690px;
}

.eyebrow,
.section-tag {
  color: #b78c35;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.8px;
}

.eyebrow {
  color: #e4c16e;
}

.hero h1 {
  margin: 17px 0 15px;
  font-size: clamp(37px, 5vw, 56px);
  line-height: 1.12;
  letter-spacing: -1.7px;
}

.hero h1 span {
  color: #e4c16e;
}

.hero-content > p {
  max-width: 590px;
  margin: 0;
  color: #dbe9df;
  font-size: 14px;
  line-height: 1.9;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
  color: #d1e0d6;
  font-size: 12px;
}

.breadcrumbs a {
  color: #e4c16e;
  text-decoration: none;
}

.hero-decoration {
  position: absolute;
  right: 13%;
  bottom: -85px;
  color: #ffffff0b;
  font-size: 280px;
  line-height: 1;
  font-weight: 900;
  pointer-events: none;
}

.section {
  padding: 75px 8%;
}

.section-heading {
  max-width: 680px;
  margin: 0 auto 38px;
  text-align: center;
}

.section-heading .section-tag,
.responsibilities-content .section-tag {
  color: var(--primary);
}

.section-heading h2,
.responsibilities-content h2 {
  margin: 13px 0 12px;
  font-size: clamp(27px, 3vw, 36px);
  letter-spacing: -1px;
  line-height: 1.25;
}

.section-heading > p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.8;
}

.overview {
  background: #fff;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 19px;
}

.overview-card {
  padding: 25px 22px;
  border: 1px solid #e7eee8;
  border-radius: 13px;
  background: #fff;
  transition: transform 0.2s, box-shadow 0.2s;
}

.overview-card:hover,
.leader-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 35px #173b2510;
}

.overview-icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin-bottom: 20px;
  border-radius: 12px;
  background: #e8f4eb;
  font-size: 22px;
}

.overview-card h3 {
  margin: 0 0 10px;
  font-size: 15px;
}

.overview-card p {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.85;
}

.leadership {
  background: var(--background);
}

.notice {
  display: flex;
  align-items: flex-start;
  gap: 13px;
  max-width: 1000px;
  margin: 0 auto 27px;
  padding: 16px 19px;
  border: 1px solid #ead9a9;
  border-radius: 10px;
  background: #fffaf0;
}

.notice-icon {
  font-size: 19px;
}

.notice p {
  margin: 0;
  color: #705c2d;
  font-size: 12px;
  line-height: 1.8;
}

.leaders-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.leader-card {
  overflow: hidden;
  border: 1px solid #e4ebe5;
  border-radius: 14px;
  background: white;
  transition: transform 0.2s, box-shadow 0.2s;
}

.leader-photo {
  position: relative;
  display: grid;
  place-items: center;
  height: 170px;
  overflow: hidden;
}

.leader-photo > span {
  display: grid;
  place-items: center;
  width: 90px;
  height: 90px;
  border: 4px solid #ffffff9c;
  border-radius: 50%;
  color: white;
  font-size: 25px;
  font-weight: 800;
  background: #ffffff20;
  box-shadow: 0 8px 24px #00000012;
}

.leader-green {
  background: linear-gradient(135deg, #d5eddd, #7fbd95);
}

.leader-gold {
  background: linear-gradient(135deg, #f6e9c8, #d6bb7c);
}

.leader-blue {
  background: linear-gradient(135deg, #dcebf2, #8eb9ca);
}

.photo-badge {
  position: absolute;
  right: 16px;
  bottom: 14px;
  display: grid;
  place-items: center;
  width: 33px;
  height: 33px;
  border: 2px solid white;
  border-radius: 50%;
  color: white;
  background: var(--primary);
  font-size: 9px;
  font-weight: 800;
}

.leader-info {
  padding: 24px;
}

.leader-label {
  color: var(--primary);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.4px;
}

.leader-info h3 {
  margin: 11px 0 5px;
  font-size: 18px;
}

.leader-role {
  margin: 0 0 16px;
  color: var(--primary);
  font-size: 12px;
  font-weight: 700;
}

.leader-description {
  min-height: 65px;
  margin: 0 0 20px;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.8;
}

.profile-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 13px 0 0;
  border: 0;
  border-top: 1px solid #edf1ed;
  color: var(--primary);
  background: transparent;
  font: inherit;
  font-size: 12px;
  font-weight: 750;
  cursor: pointer;
}

.profile-button span {
  font-size: 18px;
}

.structure-section {
  background: #fff;
}

.structure {
  max-width: 780px;
  margin: 0 auto;
  padding: 32px;
  border: 1px solid #e7eee8;
  border-radius: 16px;
  background: #f9fbf9;
}

.structure-level {
  display: flex;
  align-items: center;
  gap: 17px;
  width: 100%;
  padding: 19px 22px;
  border: 1px solid #dfe9e1;
  border-radius: 12px;
  background: #fff;
}

.structure-level.district {
  border-left: 4px solid #d6b05b;
}

.structure-level.sector {
  border-left: 4px solid var(--primary);
  background: #f0f8f2;
}

.structure-icon {
  display: grid;
  place-items: center;
  width: 47px;
  height: 47px;
  flex-shrink: 0;
  border-radius: 11px;
  background: #e6f2e9;
  font-size: 21px;
}

.structure-level strong {
  font-size: 14px;
}

.structure-level p {
  margin: 5px 0 0;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.7;
}

.structure-connector {
  width: 2px;
  height: 28px;
  margin: 0 auto;
  background: #b9d5c1;
}

.community-levels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.structure-level.community {
  padding: 16px;
}

.structure-note {
  margin: 22px 0 0;
  color: var(--muted);
  text-align: center;
  font-size: 11px;
  line-height: 1.7;
}

.responsibilities {
  display: grid;
  grid-template-columns: 1fr 0.85fr;
  align-items: center;
  gap: 65px;
  background: var(--background);
}

.responsibilities-content > p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.9;
}

.responsibility-list {
  display: grid;
  gap: 22px;
  margin-top: 29px;
}

.responsibility-item {
  display: flex;
  align-items: flex-start;
  gap: 13px;
}

.check-icon {
  display: grid;
  place-items: center;
  width: 25px;
  height: 25px;
  flex-shrink: 0;
  border-radius: 50%;
  color: var(--primary);
  background: #dff0e4;
  font-size: 13px;
  font-weight: 800;
}

.responsibility-item h3 {
  margin: 2px 0 6px;
  font-size: 14px;
}

.responsibility-item p {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.8;
}

.responsibilities-visual {
  padding: 30px;
  border-radius: 17px;
  color: white;
  background: linear-gradient(145deg, #16774d, #073c29);
  box-shadow: 0 18px 45px #0b4b3020;
}

.visual-top,
.visual-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.visual-top {
  color: #e6c776;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.6px;
}

.visual-symbol {
  font-size: 21px;
}

.visual-emblem {
  display: grid;
  place-items: center;
  width: 95px;
  height: 95px;
  margin: 36px auto 27px;
  border: 1px solid #ffffff35;
  border-radius: 50%;
  background: #ffffff12;
  font-size: 43px;
}

.responsibilities-visual h3 {
  margin: 0 0 12px;
  text-align: center;
  font-size: 21px;
}

.responsibilities-visual > p {
  max-width: 310px;
  margin: 0 auto;
  color: #d3e6d9;
  text-align: center;
  font-size: 12px;
  line-height: 1.9;
}

.visual-bottom {
  flex-wrap: wrap;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ffffff25;
  color: #e6c776;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.8px;
}

.contact-section {
  display: flex;
  align-items: center;
  gap: 23px;
  padding: 43px 8%;
  color: white;
  background: #0a4c32;
}

.contact-icon {
  display: grid;
  place-items: center;
  width: 57px;
  height: 57px;
  flex-shrink: 0;
  border-radius: 14px;
  background: #ffffff14;
  font-size: 25px;
}

.contact-copy {
  flex: 1;
}

.contact-copy > span {
  color: #e4c16e;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.contact-copy h2 {
  margin: 8px 0;
  font-size: clamp(19px, 2.5vw, 26px);
}

.contact-copy p {
  max-width: 650px;
  margin: 0;
  color: #d4e6da;
  font-size: 12px;
  line-height: 1.8;
}

.contact-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  flex-shrink: 0;
  padding: 0 18px;
  border-radius: 8px;
  color: #173c29;
  background: #e4c16e;
  font-size: 12px;
  font-weight: 750;
  text-decoration: none;
}

.admin-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 23px 6%;
  background: white;
}

.footer-brand .brand-logo {
  width: 39px;
  height: 39px;
  font-size: 14px;
}

.footer-brand strong {
  font-size: 13px;
}

.footer-brand p {
  margin-top: 4px;
  font-size: 11px;
}

.admin-footer > p,
.footer-link {
  color: var(--muted);
  font-size: 11px;
}

.footer-link {
  color: var(--primary);
  font-weight: 700;
  text-decoration: none;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 20px;
  background: #061d13b8;
  backdrop-filter: blur(5px);
}

.profile-modal {
  position: relative;
  width: 100%;
  max-width: 460px;
  padding: 35px;
  border-radius: 17px;
  background: white;
  box-shadow: 0 24px 80px #00000025;
}

.close-button {
  position: absolute;
  top: 13px;
  right: 17px;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 8px;
  color: #526157;
  background: #edf3ee;
  font-size: 24px;
  cursor: pointer;
}

.modal-avatar {
  display: grid;
  place-items: center;
  width: 65px;
  height: 65px;
  margin-bottom: 23px;
  border-radius: 50%;
  color: white;
  background: var(--primary);
  font-size: 19px;
  font-weight: 800;
}

.profile-modal h2 {
  margin: 12px 0 8px;
  font-size: 24px;
}

.profile-modal h3 {
  margin: 0 0 13px;
  color: var(--primary);
  font-size: 14px;
}

.profile-modal > p,
.modal-note {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.9;
}

.modal-note {
  margin-top: 20px;
  padding: 13px;
  border-radius: 8px;
  background: #f1f6f1;
}

.modal-button {
  width: 100%;
  min-height: 44px;
  margin-top: 22px;
  border: 0;
  border-radius: 8px;
  color: white;
  background: var(--primary);
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 1050px) {
  .admin-header {
    padding-right: 4%;
    padding-left: 4%;
  }

  .navigation {
    gap: 16px;
  }

  .section {
    padding: 60px 5%;
  }

  .overview-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .responsibilities {
    gap: 35px;
  }
}

@media (max-width: 760px) {
  .admin-header {
    flex-wrap: wrap;
    gap: 15px;
    padding: 14px 5%;
  }

  .navigation {
    order: 3;
    width: 100%;
    justify-content: space-between;
    padding-top: 13px;
    border-top: 1px solid #edf1ed;
  }

  .navigation a {
    font-size: 11px;
  }

  .navigation a.active::after {
    bottom: -7px;
  }

  .back-button {
    min-height: 38px;
    padding: 0 11px;
    font-size: 10px;
  }

  .hero {
    min-height: 300px;
    padding: 50px 6%;
  }

  .hero-decoration {
    right: -10px;
    font-size: 190px;
  }

  .section {
    padding: 52px 6%;
  }

  .leaders-grid {
    grid-template-columns: 1fr;
    max-width: 480px;
    margin: auto;
  }

  .leader-photo {
    height: 155px;
  }

  .leader-description {
    min-height: auto;
  }

  .responsibilities {
    grid-template-columns: 1fr;
    gap: 35px;
  }

  .contact-section {
    align-items: flex-start;
    flex-wrap: wrap;
    padding: 35px 6%;
  }

  .contact-copy {
    flex-basis: calc(100% - 85px);
  }

  .contact-button {
    margin-left: 80px;
  }

  .admin-footer {
    flex-wrap: wrap;
    padding: 22px 5%;
  }

  .admin-footer > p {
    order: 3;
    width: 100%;
    margin: 0;
  }
}

@media (max-width: 480px) {
  .brand h2 {
    font-size: 15px;
  }

  .brand-logo {
    width: 40px;
    height: 40px;
  }

  .navigation {
    gap: 8px;
  }

  .navigation a {
    font-size: 10px;
  }

  .overview-grid {
    grid-template-columns: 1fr;
  }

  .overview-card {
    padding: 22px;
  }

  .structure {
    padding: 17px;
  }

  .structure-level {
    gap: 11px;
    padding: 15px;
  }

  .structure-level strong {
    font-size: 12px;
  }

  .structure-icon {
    width: 38px;
    height: 38px;
    font-size: 18px;
  }

  .community-levels {
    grid-template-columns: 1fr;
  }

  .visual-bottom {
    justify-content: center;
  }

  .contact-copy {
    flex-basis: 100%;
  }

  .contact-icon {
    width: 48px;
    height: 48px;
  }

  .contact-button {
    margin-left: 0;
  }

  .profile-modal {
    padding: 27px 22px;
  }
}
</style>


// service page content 


<template>
  <div class="services-page">
    <header class="page-header">
      <router-link to="/" class="brand">
        <div class="brand-logo">KS</div>
        <div>
          <h2>Kitabi Sector</h2>
          <span>Digital Portfolio</span>
        </div>
      </router-link>

      <nav class="navigation">
        <router-link to="/">Home</router-link>
        <router-link to="/about">About Us</router-link>
        <router-link to="/administration">Administration</router-link>
        <router-link to="/services" class="active">Services</router-link>
      </nav>

      <router-link to="/" class="home-button">← Back Home</router-link>
    </header>

    <main>
      <section class="hero">
        <div class="hero-content">
          <span class="eyebrow">PUBLIC SERVICE • COMMUNITY SUPPORT</span>
          <h1>Services for <span>Everyone</span></h1>
          <p>
            Find information about administrative procedures, community
            support, development initiatives, and public services relevant
            to residents of Kitabi Sector.
          </p>
          <a href="#service-directory" class="hero-button">
            Explore Services <span>↓</span>
          </a>
        </div>
        <div class="hero-art">
          <div class="art-circle circle-one"></div>
          <div class="art-circle circle-two"></div>
          <div class="art-icon">🏛️</div>
          <div class="floating-card floating-one">
            <span>✓</span>
            <div>
              <strong>Public Information</strong>
              <small>Easy to access</small>
            </div>
          </div>
          <div class="floating-card floating-two">
            <span>🤝</span>
            <div>
              <strong>Community First</strong>
              <small>Working together</small>
            </div>
          </div>
        </div>
      </section>

      <section class="quick-stats">
        <div class="quick-stat">
          <div class="stat-icon">📄</div>
          <div>
            <strong>Administration</strong>
            <span>Procedures & information</span>
          </div>
        </div>
        <div class="quick-stat">
          <div class="stat-icon">👥</div>
          <div>
            <strong>Community</strong>
            <span>Support & participation</span>
          </div>
        </div>
        <div class="quick-stat">
          <div class="stat-icon">📢</div>
          <div>
            <strong>Information</strong>
            <span>News & announcements</span>
          </div>
        </div>
      </section>

      <section class="directory section" id="service-directory">
        <div class="section-heading">
          <span class="section-tag">SERVICE DIRECTORY</span>
          <h2>How Can We Help You?</h2>
          <p>
            Browse the service categories or search for information you need.
          </p>
        </div>

        <div class="service-tools">
          <div class="search-box">
            <span>⌕</span>
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Search services..."
              aria-label="Search services"
            />
            <button
              v-if="searchQuery"
              class="clear-search"
              @click="searchQuery = ''"
              aria-label="Clear search"
            >
              ×
            </button>
          </div>

          <div class="category-filters">
            <button
              v-for="category in categories"
              :key="category"
              :class="{ selected: selectedCategory === category }"
              @click="selectedCategory = category"
            >
              {{ category }}
            </button>
          </div>
        </div>

        <div v-if="filteredServices.length" class="services-grid">
          <article
            v-for="service in filteredServices"
            :key="service.title"
            class="service-card"
          >
            <div class="card-top">
              <div class="service-icon" :class="service.color">
                {{ service.icon }}
              </div>
              <span class="category-label">{{ service.category }}</span>
            </div>

            <h3>{{ service.title }}</h3>
            <p class="service-description">{{ service.description }}</p>

            <div class="card-footer">
              <span class="availability">
                <span class="availability-dot"></span>
                Information service
              </span>
              <button @click="openService(service)" class="details-button">
                Learn More <span>→</span>
              </button>
            </div>
          </article>
        </div>

        <div v-else class="empty-state">
          <span>🔎</span>
          <h3>No services found</h3>
          <p>Try another keyword or choose a different category.</p>
          <button @click="resetFilters">Reset Filters</button>
        </div>
      </section>

      <section class="steps-section section">
        <div class="steps-content">
          <span class="section-tag">SIMPLE PROCESS</span>
          <h2>How to Access a Service</h2>
          <p>
            Use this simple guide to prepare before contacting the relevant
            office about a public service.
          </p>

          <div class="steps-list">
            <div class="step">
              <div class="step-number">01</div>
              <div>
                <h3>Find Your Service</h3>
                <p>Browse the directory and identify the information you need.</p>
              </div>
            </div>

            <div class="step">
              <div class="step-number">02</div>
              <div>
                <h3>Confirm Requirements</h3>
                <p>Ask the responsible office about documents, fees, and procedures.</p>
              </div>
            </div>

            <div class="step">
              <div class="step-number">03</div>
              <div>
                <h3>Contact the Office</h3>
                <p>Use an official contact channel to confirm the next steps.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="help-card">
          <div class="help-icon">💬</div>
          <span class="help-label">NEED ASSISTANCE?</span>
          <h3>Not sure where to start?</h3>
          <p>
            Consult the relevant local office or visit the Nyamagabe District
            website to find official information.
          </p>
          <a
            href="https://www.nyamagabe.gov.rw/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit District Website ↗
          </a>
          <div class="help-decoration">?</div>
        </div>
      </section>

      <section class="notice-section">
        <span class="notice-icon">ℹ️</span>
        <div>
          <strong>Important information</strong>
          <p>
            This page is an informational portfolio. The service descriptions
            are general examples, not a verified list of services offered
            directly by Kitabi Sector. Confirm official procedures, required
            documents, costs, and processing times with the responsible office.
          </p>
        </div>
      </section>
    </main>

    <footer class="page-footer">
      <div class="footer-brand">
        <div class="brand-logo">KS</div>
        <div>
          <strong>Kitabi Sector</strong>
          <p>Digital Portfolio</p>
        </div>
      </div>
      <p>© {{ currentYear }} Kitabi Sector Digital Portfolio.</p>
      <router-link to="/" class="footer-link">← Back to Home</router-link>
    </footer>

    <div
      v-if="selectedService"
      class="modal-overlay"
      @click.self="closeService"
      @keydown.esc="closeService"
    >
      <div class="service-modal" role="dialog" aria-modal="true">
        <button
          class="modal-close"
          @click="closeService"
          aria-label="Close details"
        >
          ×
        </button>

        <div class="modal-service-icon" :class="selectedService.color">
          {{ selectedService.icon }}
        </div>
        <span class="section-tag">{{ selectedService.category }}</span>
        <h2>{{ selectedService.title }}</h2>
        <p>{{ selectedService.details }}</p>

        <div class="modal-info">
          <strong>What to do next</strong>
          <p>{{ selectedService.nextStep }}</p>
        </div>

        <a
          href="https://www.nyamagabe.gov.rw/"
          target="_blank"
          rel="noopener noreferrer"
          class="modal-link"
        >
          Find Official Information ↗
        </a>
        <button class="modal-done" @click="closeService">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ServicesView",

  data() {
    return {
      currentYear: new Date().getFullYear(),
      searchQuery: "",
      selectedCategory: "All Services",
      selectedService: null,

      categories: [
        "All Services",
        "Administration",
        "Community",
        "Development",
        "Information"
      ],

      services: [
        {
          title: "Administrative Information",
          category: "Administration",
          icon: "📄",
          color: "green",
          description:
            "Learn about local administrative procedures and where to request official guidance.",
          details:
            "Residents can consult the appropriate administrative office to understand public procedures, applicable requirements, and the correct place to submit a request.",
          nextStep:
            "Contact the responsible office to confirm the procedure, required documents, and any applicable fees."
        },
        {
          title: "Civil Documentation Guidance",
          category: "Administration",
          icon: "🪪",
          color: "blue",
          description:
            "Find out where to ask about civil records and related administrative documentation.",
          details:
            "This information category helps residents identify the appropriate public office for questions about civil documentation and official records.",
          nextStep:
            "Confirm the competent office and the current application requirements before preparing documents."
        },
        {
          title: "Community Participation",
          category: "Community",
          icon: "👥",
          color: "purple",
          description:
            "Learn how residents can participate in local meetings and community initiatives.",
          details:
            "Community participation encourages residents to share concerns, discuss local priorities, and take part in appropriate community activities.",
          nextStep:
            "Ask local community leaders or the relevant administrative office about upcoming meetings and activities."
        },
        {
          title: "Community Development",
          category: "Development",
          icon: "🌱",
          color: "green",
          description:
            "Explore information about local development priorities and community initiatives.",
          details:
            "Community development brings residents and relevant institutions together to support local priorities and sustainable improvement.",
          nextStep:
            "Contact the relevant local office to learn about current initiatives and ways to participate."
        },
        {
          title: "Agriculture Information",
          category: "Development",
          icon: "🌾",
          color: "gold",
          description:
            "Find general guidance on agricultural support and where to ask farming-related questions.",
          details:
            "Residents can seek information about available agricultural guidance, farming initiatives, and relevant extension services.",
          nextStep:
            "Ask the responsible agricultural officer or district service about currently available support."
        },
        {
          title: "Education Information",
          category: "Community",
          icon: "🎓",
          color: "blue",
          description:
            "Find guidance on local education information and relevant support channels.",
          details:
            "This category helps residents identify appropriate schools or public offices for education-related information.",
          nextStep:
            "Contact the relevant school or education office to confirm current requirements and available support."
        },
        {
          title: "Public Notices & News",
          category: "Information",
          icon: "📢",
          color: "gold",
          description:
            "Stay informed about public announcements, community events, and important notices.",
          details:
            "Public notices help residents stay informed about relevant community activities, official announcements, and local updates.",
          nextStep:
            "Check official sector or district communication channels for current announcements."
        },
        {
          title: "Feedback & Public Inquiries",
          category: "Information",
          icon: "💬",
          color: "purple",
          description:
            "Learn where to direct questions, feedback, and general public inquiries.",
          details:
            "Residents can seek guidance on how to raise a question or provide feedback through the appropriate official communication channel.",
          nextStep:
            "Identify the responsible office and use its verified contact information to submit your inquiry."
        }
      ]
    };
  },

  computed: {
    filteredServices() {
      const query = this.searchQuery.trim().toLowerCase();

      return this.services.filter((service) => {
        const matchesCategory =
          this.selectedCategory === "All Services" ||
          service.category === this.selectedCategory;

        const matchesSearch =
          !query ||
          service.title.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query) ||
          service.category.toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
      });
    }
  },

  methods: {
    openService(service) {
      this.selectedService = service;
      document.body.style.overflow = "hidden";
    },

    closeService() {
      this.selectedService = null;
      document.body.style.overflow = "";
    },

    resetFilters() {
      this.searchQuery = "";
      this.selectedCategory = "All Services";
    }
  },

  beforeUnmount() {
    document.body.style.overflow = "";
  }
};
</script>

<style scoped>
.services-page {
  --primary: #116b45;
  --primary-dark: #08472f;
  --gold: #d8b15d;
  --text: #192b23;
  --muted: #68776f;
  --background: #f5f8f5;
  min-height: 100vh;
  color: var(--text);
  background: var(--background);
  font-family: Inter, "Segoe UI", Arial, sans-serif;
}

.services-page * {
  box-sizing: border-box;
}

.page-header {
  min-height: 82px;
  padding: 14px 6%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  background: #fff;
  border-bottom: 1px solid #e7eee8;
}

.brand,
.footer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text);
  text-decoration: none;
}

.brand-logo {
  width: 45px;
  height: 45px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 12px;
  color: white;
  background: linear-gradient(135deg, #16885a, #075034);
  font-size: 17px;
  font-weight: 800;
  box-shadow: 0 5px 14px #116b4525;
}

.brand h2 {
  margin: 0 0 4px;
  font-size: 17px;
}

.brand span,
.footer-brand p {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
}

.navigation {
  display: flex;
  align-items: center;
  gap: 23px;
}

.navigation a {
  position: relative;
  color: #56655d;
  font-size: 12px;
  font-weight: 650;
  text-decoration: none;
  transition: color 0.2s;
}

.navigation a:hover,
.navigation a.active {
  color: var(--primary);
}

.navigation a.active::after {
  position: absolute;
  content: "";
  left: 0;
  bottom: -11px;
  width: 22px;
  height: 3px;
  border-radius: 4px;
  background: var(--primary);
}

.home-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 43px;
  padding: 0 16px;
  border-radius: 8px;
  color: white;
  background: var(--primary);
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
}

.hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  min-height: 390px;
  padding: 65px 8%;
  overflow: hidden;
  color: white;
  background: linear-gradient(120deg, #073b29, #116b45 68%, #1a7952);
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 630px;
}

.eyebrow,
.section-tag {
  color: #b78c35;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.7px;
}

.eyebrow {
  color: #e4c16e;
}

.hero h1 {
  margin: 18px 0 15px;
  font-size: clamp(38px, 5vw, 57px);
  line-height: 1.12;
  letter-spacing: -1.6px;
}

.hero h1 span {
  color: #e4c16e;
}

.hero-content > p {
  max-width: 590px;
  margin: 0;
  color: #dce9e0;
  font-size: 14px;
  line-height: 1.9;
}

.hero-button {
  display: inline-flex;
  align-items: center;
  gap: 20px;
  margin-top: 27px;
  padding: 14px 18px;
  border-radius: 8px;
  color: #153b29;
  background: #e4c16e;
  font-size: 12px;
  font-weight: 800;
  text-decoration: none;
  transition: transform 0.2s, background 0.2s;
}

.hero-button:hover {
  transform: translateY(-2px);
  background: #f0d38b;
}

.hero-art {
  position: relative;
  width: 300px;
  height: 270px;
  flex-shrink: 0;
}

.art-circle {
  position: absolute;
  top: 18px;
  left: 36px;
  width: 220px;
  height: 220px;
  border: 1px solid #ffffff2c;
  border-radius: 50%;
}

.circle-two {
  top: 43px;
  left: 61px;
  width: 170px;
  height: 170px;
  background: #ffffff08;
}

.art-icon {
  position: absolute;
  top: 72px;
  left: 98px;
  display: grid;
  place-items: center;
  width: 95px;
  height: 95px;
  border: 1px solid #ffffff32;
  border-radius: 25px;
  background: #ffffff12;
  font-size: 45px;
  box-shadow: 0 20px 40px #001e1325;
}

.floating-card {
  position: absolute;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border: 1px solid #ffffff40;
  border-radius: 11px;
  color: var(--text);
  background: #fff;
  box-shadow: 0 12px 35px #001e1325;
}

.floating-one {
  top: 20px;
  right: -12px;
}

.floating-two {
  bottom: 15px;
  left: -10px;
}

.floating-card > span {
  display: grid;
  place-items: center;
  width: 33px;
  height: 33px;
  border-radius: 9px;
  background: #e6f4eb;
  font-size: 17px;
}

.floating-card strong,
.floating-card small {
  display: block;
  white-space: nowrap;
}

.floating-card strong {
  font-size: 10px;
}

.floating-card small {
  margin-top: 4px;
  color: var(--muted);
  font-size: 9px;
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  padding: 25px 8%;
  border-bottom: 1px solid #e8eee9;
  background: white;
}

.quick-stat {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 20px;
}

.stat-icon {
  display: grid;
  place-items: center;
  width: 47px;
  height: 47px;
  flex-shrink: 0;
  border-radius: 12px;
  background: #eaf5ed;
  font-size: 22px;
}

.quick-stat strong,
.quick-stat span {
  display: block;
}

.quick-stat strong {
  margin-bottom: 5px;
  font-size: 13px;
}

.quick-stat div:last-child span {
  color: var(--muted);
  font-size: 11px;
}

.section {
  padding: 75px 8%;
}

.directory {
  background: var(--background);
}

.section-heading {
  max-width: 650px;
  margin: 0 auto 35px;
  text-align: center;
}

.section-heading .section-tag {
  color: var(--primary);
}

.section-heading h2 {
  margin: 13px 0 12px;
  font-size: clamp(28px, 3vw, 37px);
  letter-spacing: -1px;
}

.section-heading > p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.8;
}

.service-tools {
  display: flex;
  flex-direction: column;
  gap: 22px;
  margin-bottom: 32px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 540px;
  min-height: 51px;
  margin: 0 auto;
  padding: 0 16px;
  border: 1px solid #dfe8e1;
  border-radius: 10px;
  background: white;
  box-shadow: 0 4px 15px #153b2506;
}

.search-box > span {
  color: var(--primary);
  font-size: 27px;
  line-height: 1;
}

.search-box input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  color: var(--text);
  background: transparent;
  font: inherit;
  font-size: 13px;
}

.search-box input::placeholder {
  color: #96a29a;
}

.clear-search {
  border: 0;
  color: var(--muted);
  background: transparent;
  font-size: 22px;
  cursor: pointer;
}

.category-filters {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 9px;
}

.category-filters button {
  min-height: 37px;
  padding: 0 15px;
  border: 1px solid #dfe8e1;
  border-radius: 7px;
  color: #596960;
  background: white;
  font: inherit;
  font-size: 11px;
  font-weight: 650;
  cursor: pointer;
  transition: color 0.2s, background 0.2s, border-color 0.2s;
}

.category-filters button:hover,
.category-filters button.selected {
  border-color: var(--primary);
  color: white;
  background: var(--primary);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 21px;
}

.service-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 24px;
  border: 1px solid #e3ebe4;
  border-radius: 13px;
  background: white;
  transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
}

.service-card:hover {
  transform: translateY(-5px);
  border-color: #c9dfcf;
  box-shadow: 0 15px 35px #123b240d;
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 23px;
}

.service-icon {
  display: grid;
  place-items: center;
  width: 49px;
  height: 49px;
  flex-shrink: 0;
  border-radius: 12px;
  font-size: 23px;
}

.service-icon.green,
.modal-service-icon.green {
  background: #e5f4e9;
}

.service-icon.blue,
.modal-service-icon.blue {
  background: #e5effb;
}

.service-icon.purple,
.modal-service-icon.purple {
  background: #f0e9fc;
}

.service-icon.gold,
.modal-service-icon.gold {
  background: #faf0d8;
}

.category-label {
  padding: 6px 9px;
  border-radius: 5px;
  color: var(--primary);
  background: #eaf5ed;
  font-size: 9px;
  font-weight: 750;
}

.service-card h3 {
  margin: 0 0 11px;
  font-size: 16px;
  line-height: 1.5;
}

.service-description {
  flex: 1;
  margin: 0 0 23px;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.9;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #edf1ed;
}

.availability {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #7b887f;
  font-size: 9px;
}

.availability-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #d6b05b;
}

.details-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  border: 0;
  color: var(--primary);
  background: transparent;
  font: inherit;
  font-size: 11px;
  font-weight: 750;
  cursor: pointer;
}

.details-button span {
  font-size: 16px;
  transition: transform 0.2s;
}

.details-button:hover span {
  transform: translateX(4px);
}

.empty-state {
  padding: 55px 20px;
  text-align: center;
  border: 1px dashed #cddbd0;
  border-radius: 13px;
  background: white;
}

.empty-state > span {
  font-size: 35px;
}

.empty-state h3 {
  margin: 15px 0 8px;
}

.empty-state p {
  color: var(--muted);
  font-size: 13px;
}

.empty-state button {
  margin-top: 10px;
  padding: 11px 16px;
  border: 0;
  border-radius: 7px;
  color: white;
  background: var(--primary);
  font-weight: 700;
  cursor: pointer;
}

.steps-section {
  display: grid;
  grid-template-columns: 1fr 0.8fr;
  align-items: center;
  gap: 65px;
  background: white;
}

.steps-content > .section-tag {
  color: var(--primary);
}

.steps-content h2 {
  margin: 13px 0 12px;
  font-size: clamp(27px, 3vw, 35px);
  letter-spacing: -0.8px;
}

.steps-content > p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.9;
}

.steps-list {
  display: grid;
  gap: 23px;
  margin-top: 29px;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.step-number {
  display: grid;
  place-items: center;
  width: 43px;
  height: 43px;
  flex-shrink: 0;
  border: 1px solid #d7e8db;
  border-radius: 11px;
  color: var(--primary);
  background: #edf6ef;
  font-size: 12px;
  font-weight: 800;
}

.step h3 {
  margin: 2px 0 7px;
  font-size: 14px;
}

.step p {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.8;
}

.help-card {
  position: relative;
  overflow: hidden;
  padding: 33px;
  border-radius: 15px;
  color: white;
  background: linear-gradient(145deg, #16774d, #073c29);
}

.help-icon {
  display: grid;
  place-items: center;
  width: 51px;
  height: 51px;
  margin-bottom: 23px;
  border: 1px solid #ffffff2c;
  border-radius: 13px;
  background: #ffffff12;
  font-size: 24px;
}

.help-label {
  color: #e4c16e;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.6px;
}

.help-card h3 {
  position: relative;
  z-index: 1;
  margin: 12px 0;
  font-size: 25px;
  line-height: 1.3;
}

.help-card > p {
  position: relative;
  z-index: 1;
  margin: 0;
  color: #d4e6da;
  font-size: 12px;
  line-height: 1.9;
}

.help-card > a {
  position: relative;
  z-index: 1;
  display: inline-flex;
  margin-top: 25px;
  padding: 13px 15px;
  border-radius: 8px;
  color: #153b29;
  background: #e4c16e;
  font-size: 11px;
  font-weight: 800;
  text-decoration: none;
}

.help-decoration {
  position: absolute;
  right: 7px;
  bottom: -80px;
  color: #ffffff0b;
  font-size: 240px;
  font-weight: 900;
  pointer-events: none;
}

.notice-section {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin: 0;
  padding: 27px 8%;
  border-top: 1px solid #ead9a9;
  border-bottom: 1px solid #ead9a9;
  background: #fffaf0;
}

.notice-icon {
  font-size: 20px;
}

.notice-section strong {
  color: #705c2d;
  font-size: 12px;
}

.notice-section p {
  max-width: 1000px;
  margin: 7px 0 0;
  color: #786b4c;
  font-size: 11px;
  line-height: 1.9;
}

.page-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 23px 6%;
  background: white;
}

.footer-brand .brand-logo {
  width: 39px;
  height: 39px;
  font-size: 14px;
}

.footer-brand strong {
  font-size: 13px;
}

.footer-brand p {
  margin-top: 4px;
  font-size: 11px;
}

.page-footer > p,
.footer-link {
  color: var(--muted);
  font-size: 11px;
}

.footer-link {
  color: var(--primary);
  font-weight: 700;
  text-decoration: none;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 20px;
  background: #061d13b8;
  backdrop-filter: blur(5px);
}

.service-modal {
  position: relative;
  width: 100%;
  max-width: 490px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 34px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 25px 80px #00000025;
}

.modal-close {
  position: absolute;
  top: 13px;
  right: 15px;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 8px;
  color: #526157;
  background: #edf3ee;
  font-size: 24px;
  cursor: pointer;
}

.modal-service-icon {
  display: grid;
  place-items: center;
  width: 59px;
  height: 59px;
  margin-bottom: 22px;
  border-radius: 13px;
  font-size: 27px;
}

.service-modal .section-tag {
  color: var(--primary);
}

.service-modal h2 {
  margin: 12px 0;
  font-size: 26px;
  line-height: 1.3;
}

.service-modal > p,
.modal-info p {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.9;
}

.modal-info {
  margin-top: 22px;
  padding: 16px;
  border-radius: 9px;
  background: #f0f6f1;
}

.modal-info strong {
  font-size: 12px;
}

.modal-info p {
  margin: 7px 0 0;
}

.modal-link,
.modal-done {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 44px;
  margin-top: 17px;
  border: 0;
  border-radius: 8px;
  font: inherit;
  font-size: 12px;
  font-weight: 750;
  text-decoration: none;
  cursor: pointer;
}

.modal-link {
  color: white;
  background: var(--primary);
}

.modal-done {
  margin-top: 10px;
  color: var(--text);
  background: #edf2ed;
}

@media (max-width: 1050px) {
  .page-header {
    padding-right: 4%;
    padding-left: 4%;
  }

  .navigation {
    gap: 13px;
  }

  .section {
    padding: 60px 5%;
  }

  .services-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .steps-section {
    gap: 35px;
  }

  .hero {
    padding-right: 5%;
    padding-left: 5%;
  }

  .hero-art {
    transform: scale(0.85);
    transform-origin: center right;
    margin-left: -30px;
  }
}

@media (max-width: 760px) {
  .page-header {
    flex-wrap: wrap;
    gap: 15px;
    padding: 14px 5%;
  }

  .navigation {
    order: 3;
    width: 100%;
    justify-content: space-between;
    padding-top: 13px;
    border-top: 1px solid #edf1ed;
  }

  .navigation a {
    font-size: 10px;
  }

  .navigation a.active::after {
    bottom: -7px;
  }

  .home-button {
    min-height: 38px;
    padding: 0 11px;
    font-size: 10px;
  }

  .hero {
    min-height: 330px;
    padding: 48px 6%;
  }

  .hero-art {
    display: none;
  }

  .quick-stats {
    grid-template-columns: 1fr;
    padding: 15px 6%;
  }

  .quick-stat {
    padding: 11px 0;
  }

  .section {
    padding: 52px 6%;
  }

  .steps-section {
    grid-template-columns: 1fr;
    gap: 35px;
  }

  .notice-section {
    padding: 24px 6%;
  }

  .page-footer {
    flex-wrap: wrap;
    padding: 22px 5%;
  }

  .page-footer > p {
    order: 3;
    width: 100%;
    margin: 0;
  }
}

@media (max-width: 480px) {
  .brand h2 {
    font-size: 15px;
  }

  .brand-logo {
    width: 40px;
    height: 40px;
  }

  .navigation {
    gap: 8px;
  }

  .navigation a {
    font-size: 9px;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }

  .category-filters {
    justify-content: flex-start;
  }

  .category-filters button {
    padding: 0 10px;
    font-size: 10px;
  }

  .service-card {
    padding: 21px;
  }

  .help-card {
    padding: 25px;
  }

  .service-modal {
    padding: 28px 22px;
  }
}
</style>

// dashboards page 


<template>
  <div class="dashboard">
    <aside class="sidebar" :class="{ 'sidebar-open': menuOpen }">
      <router-link to="/" class="brand">
        <div class="brand-logo">KS</div>
        <div>
          <h2>Kitabi Sector</h2>
          <span>Digital Portfolio</span>
        </div>
      </router-link>

      <div class="sidebar-label">MAIN MENU</div>

      <nav class="side-nav">
        <router-link to="/dashboard" class="nav-link active">
          <span class="nav-icon">▦</span>
          Dashboard
        </router-link>

        <router-link to="/" class="nav-link">
          <span class="nav-icon">⌂</span>
          Home Page
        </router-link>

        <router-link to="/about" class="nav-link">
          <span class="nav-icon">ⓘ</span>
          About Sector
        </router-link>

        <router-link to="/administration" class="nav-link">
          <span class="nav-icon">♙</span>
          Administration
        </router-link>

        <router-link to="/services" class="nav-link">
          <span class="nav-icon">▤</span>
          Services
        </router-link>
      </nav>

      <div class="sidebar-label management-label">MANAGEMENT</div>

      <nav class="side-nav">
        <button class="nav-link" @click="activePanel = 'announcements'">
          <span class="nav-icon">♧</span>
          Announcements
        </button>

        <button class="nav-link" @click="activePanel = 'community'">
          <span class="nav-icon">♧</span>
          Community
        </button>

        <button class="nav-link" @click="activePanel = 'reports'">
          <span class="nav-icon">▥</span>
          Reports
        </button>

        <button class="nav-link" @click="activePanel = 'settings'">
          <span class="nav-icon">⚙</span>
          Settings
        </button>
      </nav>

      <div class="sidebar-bottom">
        <div class="support-card">
          <div class="support-icon">💬</div>
          <strong>Need assistance?</strong>
          <p>Find official district information and support.</p>
          <a
            href="https://www.nyamagabe.gov.rw/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get Support ↗
          </a>
        </div>

        <router-link to="/" class="logout-link">
          <span class="nav-icon">↩</span>
          Return to Website
        </router-link>
      </div>
    </aside>

    <div v-if="menuOpen" class="sidebar-backdrop" @click="menuOpen = false"></div>

    <div class="main-area">
      <header class="topbar">
        <div class="topbar-left">
          <button class="menu-toggle" @click="menuOpen = !menuOpen" aria-label="Toggle menu">
            ☰
          </button>
          <div>
            <div class="breadcrumb">Pages <span>/</span> Dashboard</div>
            <h1>Dashboard Overview</h1>
          </div>
        </div>

        <div class="topbar-right">
          <label class="top-search">
            <span>⌕</span>
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Search dashboard..."
              aria-label="Search dashboard"
            />
          </label>

          <button
            class="icon-button notification-button"
            @click="showNotifications = !showNotifications"
            aria-label="Show notifications"
          >
            ♧
            <span class="notification-dot"></span>
          </button>

          <div class="profile-menu">
            <div class="profile-avatar">KS</div>
            <div class="profile-details">
              <strong>Sector Portal</strong>
              <span>Portfolio Dashboard</span>
            </div>
          </div>
        </div>

        <div v-if="showNotifications" class="notification-panel">
          <strong>Notifications</strong>
          <p>No live notifications are connected yet.</p>
          <button @click="showNotifications = false">Close</button>
        </div>
      </header>

      <main class="dashboard-content">
        <section class="welcome-banner">
          <div class="welcome-content">
            <span class="welcome-tag">KITABI SECTOR DIGITAL PORTFOLIO</span>
            <h2>Welcome to Your Dashboard 👋</h2>
            <p>
              A central overview of community information, public services,
              announcements, and local development.
            </p>
            <router-link to="/services" class="welcome-button">
              Explore Services <span>→</span>
            </router-link>
          </div>

          <div class="welcome-art">
            <div class="art-ring ring-one"></div>
            <div class="art-ring ring-two"></div>
            <div class="art-building">🏛️</div>
            <span class="art-leaf leaf-one">🌿</span>
            <span class="art-leaf leaf-two">🌱</span>
          </div>
        </section>

        <section class="section-heading">
          <div>
            <span class="section-kicker">AT A GLANCE</span>
            <h2>Sector Summary</h2>
            <p>Overview of key portfolio information.</p>
          </div>

          <span class="demo-badge">DEMO DATA</span>
        </section>

        <div class="stats-grid">
          <article
            v-for="stat in filteredStats"
            :key="stat.title"
            class="stat-card"
          >
            <div class="stat-top">
              <div class="stat-icon" :class="stat.color">{{ stat.icon }}</div>
              <button class="stat-menu" @click="activePanel = stat.panel">···</button>
            </div>
            <p class="stat-title">{{ stat.title }}</p>
            <div class="stat-bottom">
              <h3>{{ stat.value }}</h3>
              <span class="stat-period">{{ stat.period }}</span>
            </div>
            <div class="stat-progress">
              <span :class="stat.color" :style="{ width: stat.progress + '%' }"></span>
            </div>
            <p class="stat-caption">{{ stat.caption }}</p>
          </article>
        </div>

        <div v-if="filteredStats.length === 0" class="empty-state">
          No summary cards match your search.
        </div>

        <section class="middle-grid">
          <article class="panel development-panel">
            <div class="panel-header">
              <div>
                <span class="section-kicker">OVERVIEW</span>
                <h2>Community Development</h2>
              </div>
              <select v-model="selectedPeriod" aria-label="Select reporting period">
                <option value="Quarterly">Quarterly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>

            <div class="chart-legend">
              <span><i class="legend-dot green-dot"></i> Planned activities</span>
              <span><i class="legend-dot gold-dot"></i> Completed activities</span>
            </div>

            <div class="bar-chart">
              <div v-for="bar in chartData" :key="bar.label" class="chart-column">
                <div class="bar-pair">
                  <div class="bar planned" :style="{ height: bar.planned + '%' }">
                    <span>{{ bar.planned }}</span>
                  </div>
                  <div class="bar completed" :style="{ height: bar.completed + '%' }">
                    <span>{{ bar.completed }}</span>
                  </div>
                </div>
                <span class="chart-label">{{ bar.label }}</span>
              </div>
            </div>

            <p class="chart-note">
              Illustrative figures only. Connect verified reporting data to
              display actual progress.
            </p>
          </article>

          <article class="panel quick-actions-panel">
            <div class="panel-header">
              <div>
                <span class="section-kicker">SHORTCUTS</span>
                <h2>Quick Actions</h2>
              </div>
              <span class="shortcut-icon">↗</span>
            </div>

            <div class="quick-actions">
              <button
                v-for="action in quickActions"
                :key="action.title"
                class="quick-action"
                @click="runAction(action)"
              >
                <span class="action-icon" :class="action.color">{{ action.icon }}</span>
                <span class="action-copy">
                  <strong>{{ action.title }}</strong>
                  <small>{{ action.description }}</small>
                </span>
                <span class="action-arrow">→</span>
              </button>
            </div>
          </article>
        </section>

        <section class="bottom-grid">
          <article class="panel announcements-panel">
            <div class="panel-header">
              <div>
                <span class="section-kicker">LATEST UPDATES</span>
                <h2>Recent Announcements</h2>
              </div>
              <button class="text-button" @click="activePanel = 'announcements'">
                View All →
              </button>
            </div>

            <div v-if="filteredAnnouncements.length" class="announcement-list">
              <article
                v-for="item in filteredAnnouncements"
                :key="item.title"
                class="announcement-item"
              >
                <div class="announcement-icon" :class="item.color">
                  {{ item.icon }}
                </div>
                <div class="announcement-copy">
                  <div class="announcement-meta">
                    <span class="announcement-category">{{ item.category }}</span>
                    <span>{{ item.date }}</span>
                  </div>
                  <h3>{{ item.title }}</h3>
                  <p>{{ item.description }}</p>
                </div>
                <button
                  class="announcement-arrow"
                  @click="showAnnouncement(item)"
                  :aria-label="'Read ' + item.title"
                >
                  →
                </button>
              </article>
            </div>

            <div v-else class="empty-state">
              No announcements match your search.
            </div>
          </article>

          <article class="panel information-panel">
            <div class="panel-header">
              <div>
                <span class="section-kicker">SECTOR INFORMATION</span>
                <h2>Portfolio Details</h2>
              </div>
              <span class="information-icon">ⓘ</span>
            </div>

            <div class="information-list">
              <div>
                <span class="info-symbol">📍</span>
                <div>
                  <span>Location</span>
                  <strong>Nyamagabe District, Rwanda</strong>
                </div>
              </div>
              <div>
                <span class="info-symbol">🌐</span>
                <div>
                  <span>Website Status</span>
                  <strong>Portfolio Preview</strong>
                </div>
              </div>
              <div>
                <span class="info-symbol">📊</span>
                <div>
                  <span>Statistics</span>
                  <strong>Awaiting verified data</strong>
                </div>
              </div>
              <div>
                <span class="info-symbol">🗓️</span>
                <div>
                  <span>Current Year</span>
                  <strong>{{ currentYear }}</strong>
                </div>
              </div>
            </div>

            <a
              class="district-link"
              href="https://www.nyamagabe.gov.rw/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Nyamagabe District Website ↗
            </a>
          </article>
        </section>

        <footer class="dashboard-footer">
          <p>© {{ currentYear }} Kitabi Sector Digital Portfolio.</p>
          <div>
            <router-link to="/">Home</router-link>
            <router-link to="/about">About</router-link>
            <router-link to="/services">Services</router-link>
          </div>
        </footer>
      </main>
    </div>

    <div
      v-if="activePanel"
      class="modal-overlay"
      @click.self="closePanel"
      @keydown.esc="closePanel"
    >
      <div class="dashboard-modal" role="dialog" aria-modal="true">
        <button class="modal-close" @click="closePanel" aria-label="Close">×</button>

        <template v-if="selectedAnnouncement">
          <div class="modal-icon">📢</div>
          <span class="section-kicker">{{ selectedAnnouncement.category }}</span>
          <h2>{{ selectedAnnouncement.title }}</h2>
          <p>{{ selectedAnnouncement.description }}</p>
          <p class="modal-note">
            This is sample announcement content. Replace it with an official
            notice before publishing.
          </p>
        </template>

        <template v-else>
          <div class="modal-icon">📋</div>
          <span class="section-kicker">DASHBOARD INFORMATION</span>
          <h2>{{ panelTitle }}</h2>
          <p>{{ panelDescription }}</p>
          <p class="modal-note">
            This dashboard currently uses local demonstration data. Live
            management and reporting require a backend and database.
          </p>
        </template>

        <button class="modal-done" @click="closePanel">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardView",

  data() {
    return {
      currentYear: new Date().getFullYear(),
      menuOpen: false,
      showNotifications: false,
      searchQuery: "",
      selectedPeriod: "Quarterly",
      activePanel: null,
      selectedAnnouncement: null,

      stats: [
        {
          title: "Community Population",
          value: "—",
          period: "Not available",
          caption: "Add verified population figures",
          icon: "♙",
          color: "green",
          progress: 65,
          panel: "population"
        },
        {
          title: "Administrative Cells",
          value: "—",
          period: "Not available",
          caption: "Confirm official cell count",
          icon: "⌂",
          color: "blue",
          progress: 45,
          panel: "cells"
        },
        {
          title: "Public Services",
          value: "8",
          period: "Sample entries",
          caption: "Illustrative service directory",
          icon: "▤",
          color: "gold",
          progress: 75,
          panel: "services"
        },
        {
          title: "Announcements",
          value: "3",
          period: "Sample entries",
          caption: "Illustrative announcements",
          icon: "♧",
          color: "purple",
          progress: 55,
          panel: "announcements"
        }
      ],

      quickActions: [
        {
          title: "Explore Services",
          description: "Browse public service information",
          icon: "▤",
          color: "green",
          action: "services"
        },
        {
          title: "View Administration",
          description: "Explore leadership and structure",
          icon: "♙",
          color: "blue",
          action: "administration"
        },
        {
          title: "About Kitabi",
          description: "Learn about the sector",
          icon: "ⓘ",
          color: "gold",
          action: "about"
        },
        {
          title: "Official District Website",
          description: "Visit the district's public website",
          icon: "↗",
          color: "purple",
          action: "district"
        }
      ],

      quarterlyChart: [
        { label: "Q1", planned: 72, completed: 51 },
        { label: "Q2", planned: 85, completed: 67 },
        { label: "Q3", planned: 66, completed: 44 },
        { label: "Q4", planned: 91, completed: 75 }
      ],

      monthlyChart: [
        { label: "Jan", planned: 65, completed: 48 },
        { label: "Feb", planned: 75, completed: 59 },
        { label: "Mar", planned: 81, completed: 63 },
        { label: "Apr", planned: 68, completed: 52 },
        { label: "May", planned: 90, completed: 72 },
        { label: "Jun", planned: 78, completed: 60 }
      ],

      yearlyChart: [
        { label: "2022", planned: 60, completed: 42 },
        { label: "2023", planned: 72, completed: 56 },
        { label: "2024", planned: 78, completed: 61 },
        { label: "2025", planned: 85, completed: 70 },
        { label: "2026", planned: 90, completed: 73 }
      ],

      announcements: [
        {
          title: "Community Development Updates",
          category: "Community",
          date: "Sample notice",
          icon: "🌱",
          color: "green",
          description:
            "Use this section to share verified information about current community development activities."
        },
        {
          title: "Public Service Information",
          category: "Services",
          date: "Sample notice",
          icon: "📄",
          color: "blue",
          description:
            "Publish official information about public procedures and where residents can seek assistance."
        },
        {
          title: "Community Meetings",
          category: "Events",
          date: "Sample notice",
          icon: "👥",
          color: "gold",
          description:
            "Add confirmed details about community meetings, including dates, locations, and participation requirements."
        }
      ]
    };
  },

  computed: {
    filteredStats() {
      const query = this.searchQuery.trim().toLowerCase();

      if (!query) return this.stats;

      return this.stats.filter((stat) =>
        `${stat.title} ${stat.caption} ${stat.period}`
          .toLowerCase()
          .includes(query)
      );
    },

    filteredAnnouncements() {
      const query = this.searchQuery.trim().toLowerCase();

      if (!query) return this.announcements;

      return this.announcements.filter((item) =>
        `${item.title} ${item.category} ${item.description}`
          .toLowerCase()
          .includes(query)
      );
    },

    chartData() {
      if (this.selectedPeriod === "Monthly") return this.monthlyChart;
      if (this.selectedPeriod === "Yearly") return this.yearlyChart;
      return this.quarterlyChart;
    },

    panelTitle() {
      const titles = {
        population: "Community Population",
        cells: "Administrative Cells",
        services: "Public Services",
        announcements: "Announcements",
        community: "Community Information",
        reports: "Reports & Statistics",
        settings: "Dashboard Settings"
      };

      return titles[this.activePanel] || "Dashboard Information";
    },

    panelDescription() {
      const descriptions = {
        population:
          "The population figure has not been entered. Add a verified number from an official source before displaying it.",
        cells:
          "Enter the confirmed number of administrative cells using official sector or district records.",
        services:
          "The service count represents example entries in this portfolio, not a verified count of official services.",
        announcements:
          "Manage official public notices here after connecting an announcement system or backend.",
        community:
          "This section can present verified information about local community activities and development.",
        reports:
          "Reporting can display verified population, services, budgets, and development progress when connected to real data.",
        settings:
          "This section can later hold user preferences, access control, and dashboard configuration."
      };

      return descriptions[this.activePanel] || "Dashboard information.";
    }
  },

  methods: {
    runAction(action) {
      if (action.action === "district") {
        window.open(
          "https://www.nyamagabe.gov.rw/",
          "_blank",
          "noopener,noreferrer"
        );
        return;
      }

      const routes = {
        services: "/services",
        administration: "/administration",
        about: "/about"
      };

      if (routes[action.action]) {
        this.$router.push(routes[action.action]);
      }
    },

    showAnnouncement(item) {
      this.selectedAnnouncement = item;
      this.activePanel = "announcement-detail";
      document.body.style.overflow = "hidden";
    },

    closePanel() {
      this.activePanel = null;
      this.selectedAnnouncement = null;
      document.body.style.overflow = "";
    }
  },

  beforeUnmount() {
    document.body.style.overflow = "";
  }
};
</script>

<style scoped>
.dashboard {
  --primary: #116b45;
  --primary-dark: #08472f;
  --background: #f5f7f5;
  --text: #1b2d23;
  --muted: #7b887f;
  min-height: 100vh;
  display: flex;
  color: var(--text);
  background: var(--background);
  font-family: Inter, "Segoe UI", Arial, sans-serif;
}

.dashboard * {
  box-sizing: border-box;
}

.sidebar {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  width: 255px;
  min-width: 255px;
  height: 100vh;
  padding: 25px 17px 18px;
  overflow-y: auto;
  background: #fff;
  border-right: 1px solid #e9eee9;
}

.brand {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 0 5px 28px;
  color: var(--text);
  text-decoration: none;
}

.brand-logo {
  display: grid;
  place-items: center;
  width: 43px;
  height: 43px;
  flex-shrink: 0;
  border-radius: 12px;
  color: white;
  background: linear-gradient(135deg, #16885a, #075034);
  box-shadow: 0 5px 14px #116b4525;
  font-size: 16px;
  font-weight: 850;
}

.brand h2 {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 800;
}

.brand span {
  color: var(--muted);
  font-size: 10px;
}

.sidebar-label {
  padding: 13px 11px 10px;
  color: #a0aaa2;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.management-label {
  margin-top: 22px;
}

.side-nav {
  display: grid;
  gap: 5px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 13px;
  width: 100%;
  min-height: 43px;
  padding: 0 12px;
  border: 0;
  border-radius: 8px;
  color: #6c7a70;
  background: transparent;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.nav-link:hover {
  color: var(--primary);
  background: #f0f7f1;
}

.nav-link.active {
  color: white;
  background: linear-gradient(110deg, #16784d, #0b5838);
  box-shadow: 0 5px 12px #116b451c;
}

.nav-icon {
  display: grid;
  place-items: center;
  width: 21px;
  flex-shrink: 0;
  font-size: 19px;
  line-height: 1;
}

.sidebar-bottom {
  margin-top: auto;
  padding-top: 25px;
}

.support-card {
  position: relative;
  overflow: hidden;
  padding: 17px 15px;
  border: 1px solid #e2ece3;
  border-radius: 11px;
  background: #f5f9f5;
}

.support-icon {
  display: grid;
  place-items: center;
  width: 35px;
  height: 35px;
  margin-bottom: 12px;
  border-radius: 9px;
  background: #e1f1e5;
  font-size: 18px;
}

.support-card strong {
  font-size: 11px;
}

.support-card p {
  margin: 7px 0 12px;
  color: var(--muted);
  font-size: 10px;
  line-height: 1.7;
}

.support-card a {
  color: var(--primary);
  font-size: 10px;
  font-weight: 800;
  text-decoration: none;
}

.logout-link {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-top: 17px;
  padding: 12px 9px;
  color: #66766b;
  font-size: 11px;
  font-weight: 650;
  text-decoration: none;
}

.main-area {
  flex: 1;
  min-width: 0;
}

.topbar {
  position: relative;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  min-height: 88px;
  padding: 16px 32px;
  border-bottom: 1px solid #e8ede8;
  background: white;
}

.topbar-left,
.topbar-right {
  display: flex;
  align-items: center;
}

.topbar-left {
  gap: 14px;
}

.breadcrumb {
  margin-bottom: 6px;
  color: #9aa59c;
  font-size: 10px;
}

.breadcrumb span {
  padding: 0 7px;
}

.topbar h1 {
  margin: 0;
  font-size: 20px;
  letter-spacing: -0.5px;
}

.topbar-right {
  gap: 20px;
}

.top-search {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 230px;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #e5ebe5;
  border-radius: 8px;
  background: #fafcfa;
}

.top-search > span {
  color: var(--primary);
  font-size: 25px;
}

.top-search input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  color: var(--text);
  background: transparent;
  font: inherit;
  font-size: 11px;
}

.top-search input::placeholder {
  color: #9ca79f;
}

.icon-button {
  position: relative;
  display: grid;
  place-items: center;
  width: 37px;
  height: 37px;
  border: 1px solid #e6ece6;
  border-radius: 9px;
  color: #56685c;
  background: white;
  font-size: 19px;
  cursor: pointer;
}

.notification-dot {
  position: absolute;
  top: 7px;
  right: 7px;
  width: 6px;
  height: 6px;
  border: 1px solid white;
  border-radius: 50%;
  background: #d8a63c;
}

.profile-menu {
  display: flex;
  align-items: center;
  gap: 10px;
}

.profile-avatar {
  display: grid;
  place-items: center;
  width: 39px;
  height: 39px;
  border-radius: 11px;
  color: white;
  background: linear-gradient(135deg, #16784d, #08472f);
  font-size: 12px;
  font-weight: 800;
}

.profile-details strong,
.profile-details span {
  display: block;
  white-space: nowrap;
}

.profile-details strong {
  font-size: 11px;
}

.profile-details span {
  margin-top: 4px;
  color: var(--muted);
  font-size: 9px;
}

.menu-toggle {
  display: none;
  width: 36px;
  height: 36px;
  border: 1px solid #e3ebe4;
  border-radius: 8px;
  color: var(--primary);
  background: white;
  font-size: 18px;
  cursor: pointer;
}

.notification-panel {
  position: absolute;
  top: 72px;
  right: 24px;
  z-index: 10;
  width: 260px;
  padding: 20px;
  border: 1px solid #e4ece5;
  border-radius: 12px;
  background: white;
  box-shadow: 0 14px 35px #102d1b18;
}

.notification-panel > strong {
  font-size: 13px;
}

.notification-panel p {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.7;
}

.notification-panel button {
  padding: 8px 13px;
  border: 0;
  border-radius: 7px;
  color: white;
  background: var(--primary);
  font-size: 11px;
  cursor: pointer;
}

.dashboard-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 27px 32px 20px;
}

.welcome-banner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
  min-height: 225px;
  padding: 32px 37px;
  overflow: hidden;
  border-radius: 15px;
  color: white;
  background: linear-gradient(110deg, #0a4a31, #14784e);
  box-shadow: 0 12px 30px #0b4b3010;
}

.welcome-content {
  position: relative;
  z-index: 2;
  max-width: 620px;
}

.welcome-tag {
  color: #e5c573;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.6px;
}

.welcome-content h2 {
  margin: 14px 0 11px;
  font-size: clamp(23px, 2.5vw, 32px);
  letter-spacing: -0.8px;
}

.welcome-content p {
  max-width: 520px;
  margin: 0;
  color: #d4e8db;
  font-size: 12px;
  line-height: 1.9;
}

.welcome-button {
  display: inline-flex;
  align-items: center;
  gap: 19px;
  margin-top: 21px;
  padding: 12px 15px;
  border-radius: 7px;
  color: #153b29;
  background: #e5c36f;
  font-size: 10px;
  font-weight: 800;
  text-decoration: none;
  transition: transform 0.2s;
}

.welcome-button:hover {
  transform: translateY(-2px);
}

.welcome-button span {
  font-size: 16px;
}

.welcome-art {
  position: relative;
  width: 225px;
  height: 180px;
  flex-shrink: 0;
}

.art-ring {
  position: absolute;
  top: 0;
  right: 15px;
  width: 175px;
  height: 175px;
  border: 1px solid #ffffff30;
  border-radius: 50%;
}

.ring-two {
  top: 22px;
  right: 37px;
  width: 130px;
  height: 130px;
  background: #ffffff08;
}

.art-building {
  position: absolute;
  top: 42px;
  right: 74px;
  display: grid;
  place-items: center;
  width: 80px;
  height: 80px;
  border: 1px solid #ffffff2e;
  border-radius: 21px;
  background: #ffffff12;
  font-size: 37px;
}

.art-leaf {
  position: absolute;
  font-size: 27px;
}

.leaf-one {
  right: 5px;
  bottom: 16px;
}

.leaf-two {
  top: 12px;
  left: 7px;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin: 29px 0 18px;
}

.section-kicker {
  color: var(--primary);
  font-size: 9px;
  font-weight: 850;
  letter-spacing: 1.5px;
}

.section-heading h2,
.panel-header h2 {
  margin: 7px 0 5px;
  font-size: 17px;
  letter-spacing: -0.3px;
}

.section-heading p {
  margin: 0;
  color: var(--muted);
  font-size: 10px;
}

.demo-badge {
  padding: 7px 10px;
  border: 1px solid #f0dfb7;
  border-radius: 6px;
  color: #896820;
  background: #fff9e9;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 17px;
}

.stat-card {
  min-width: 0;
  padding: 19px;
  border: 1px solid #e8ede8;
  border-radius: 12px;
  background: white;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 27px #153b250a;
}

.stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 11px;
  font-size: 21px;
}

.stat-icon.green,
.stat-progress span.green,
.action-icon.green {
  color: #116b45;
  background: #e5f4e9;
}

.stat-icon.blue,
.action-icon.blue {
  color: #326cb0;
  background: #e7effa;
}

.stat-icon.gold,
.action-icon.gold {
  color: #987126;
  background: #fbf1d9;
}

.stat-icon.purple,
.action-icon.purple {
  color: #7c55ae;
  background: #f0e9fa;
}

.stat-menu {
  border: 0;
  color: #a1aaa3;
  background: transparent;
  font-size: 23px;
  cursor: pointer;
}

.stat-title {
  margin: 18px 0 9px;
  color: #65746a;
  font-size: 10px;
  font-weight: 600;
}

.stat-bottom {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
}

.stat-bottom h3 {
  margin: 0;
  font-size: 26px;
  letter-spacing: -0.8px;
}

.stat-period {
  color: #9aa49b;
  font-size: 9px;
}

.stat-progress {
  height: 4px;
  margin-top: 17px;
  overflow: hidden;
  border-radius: 5px;
  background: #edf1ed;
}

.stat-progress span {
  display: block;
  height: 100%;
  border-radius: inherit;
}

.stat-progress span.blue {
  background: #5788c9;
}

.stat-progress span.gold {
  background: #d6b05b;
}

.stat-progress span.purple {
  background: #9a79ca;
}

.stat-caption {
  margin: 9px 0 0;
  color: #909b92;
  font-size: 9px;
  line-height: 1.6;
}

.middle-grid,
.bottom-grid {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 18px;
  margin-top: 22px;
}

.panel {
  min-width: 0;
  padding: 22px;
  border: 1px solid #e7ece7;
  border-radius: 12px;
  background: white;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.panel-header h2 {
  margin-bottom: 0;
}

.panel-header select {
  max-width: 115px;
  padding: 9px 10px;
  border: 1px solid #e4ebe4;
  border-radius: 7px;
  outline-color: #b8d7c1;
  color: #65746a;
  background: white;
  font: inherit;
  font-size: 10px;
}

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 17px;
  margin-top: 24px;
  color: #738076;
  font-size: 9px;
}

.chart-legend span {
  display: flex;
  align-items: center;
  gap: 7px;
}

.legend-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 3px;
}

.green-dot {
  background: #16784d;
}

.gold-dot {
  background: #d9b35e;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  gap: 10px;
  height: 200px;
  margin-top: 19px;
  padding: 15px 5px 0;
  border-bottom: 1px solid #e9eee9;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent 39px,
    #edf1ed 40px
  );
}

.chart-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 9px;
  width: 48px;
  height: 100%;
}

.bar-pair {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 5px;
  width: 100%;
  height: 100%;
}

.bar {
  position: relative;
  width: 15px;
  min-height: 5px;
  border-radius: 4px 4px 0 0;
  transition: height 0.3s;
}

.bar.planned {
  background: #16784d;
}

.bar.completed {
  background: #d9b35e;
}

.bar > span {
  position: absolute;
  top: -16px;
  left: 50%;
  color: #7a877d;
  font-size: 8px;
  transform: translateX(-50%);
}

.chart-label {
  flex-shrink: 0;
  padding-bottom: 8px;
  color: #849087;
  font-size: 9px;
}

.chart-note {
  margin: 14px 0 0;
  color: #939e95;
  font-size: 9px;
  line-height: 1.7;
}

.shortcut-icon,
.information-icon {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  color: var(--primary);
  background: #e8f4eb;
  font-size: 17px;
}

.quick-actions {
  display: grid;
  gap: 5px;
  margin-top: 17px;
}

.quick-action {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 0;
  border: 0;
  border-bottom: 1px solid #eff2ef;
  text-align: left;
  background: transparent;
  cursor: pointer;
}

.quick-action:last-child {
  border-bottom: 0;
}

.action-icon {
  display: grid;
  place-items: center;
  width: 41px;
  height: 41px;
  flex-shrink: 0;
  border-radius: 10px;
  font-size: 20px;
}

.action-copy {
  flex: 1;
  min-width: 0;
}

.action-copy strong,
.action-copy small {
  display: block;
}

.action-copy strong {
  font-size: 11px;
}

.action-copy small {
  margin-top: 5px;
  color: #88948b;
  font-size: 9px;
  line-height: 1.5;
}

.action-arrow {
  color: #8b998e;
  font-size: 17px;
  transition: transform 0.2s;
}

.quick-action:hover .action-arrow {
  color: var(--primary);
  transform: translateX(3px);
}

.bottom-grid {
  grid-template-columns: 1.35fr 1fr;
  margin-top: 18px;
}

.text-button {
  border: 0;
  color: var(--primary);
  background: transparent;
  font: inherit;
  font-size: 10px;
  font-weight: 800;
  white-space: nowrap;
  cursor: pointer;
}

.announcement-list {
  margin-top: 17px;
}

.announcement-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 15px 0;
  border-bottom: 1px solid #edf1ed;
}

.announcement-item:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.announcement-icon {
  display: grid;
  place-items: center;
  width: 39px;
  height: 39px;
  flex-shrink: 0;
  border-radius: 10px;
  font-size: 19px;
}

.announcement-icon.green {
  background: #e5f4e9;
}

.announcement-icon.blue {
  background: #e7effa;
}

.announcement-icon.gold {
  background: #fbf1d9;
}

.announcement-copy {
  flex: 1;
  min-width: 0;
}

.announcement-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 9px;
  color: #9aa49b;
  font-size: 8px;
}

.announcement-category {
  color: var(--primary);
  font-weight: 800;
}

.announcement-copy h3 {
  margin: 7px 0 5px;
  font-size: 11px;
  line-height: 1.6;
}

.announcement-copy p {
  margin: 0;
  color: #7d8a80;
  font-size: 9px;
  line-height: 1.8;
}

.announcement-arrow {
  flex-shrink: 0;
  border: 0;
  color: #87968a;
  background: transparent;
  font-size: 17px;
  cursor: pointer;
}

.announcement-arrow:hover {
  color: var(--primary);
}

.information-list {
  display: grid;
  gap: 19px;
  margin-top: 23px;
}

.information-list > div {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-symbol {
  display: grid;
  place-items: center;
  width: 37px;
  height: 37px;
  flex-shrink: 0;
  border-radius: 9px;
  background: #f0f6f1;
  font-size: 17px;
}

.information-list span,
.information-list strong {
  display: block;
}

.information-list div div > span {
  margin-bottom: 5px;
  color: #8b978e;
  font-size: 9px;
}

.information-list strong {
  font-size: 10px;
  line-height: 1.6;
}

.district-link {
  display: block;
  margin-top: 23px;
  padding: 13px;
  border: 1px solid #dceade;
  border-radius: 8px;
  color: var(--primary);
  background: #f5faf6;
  text-align: center;
  font-size: 10px;
  font-weight: 800;
  text-decoration: none;
  transition: background 0.2s;
}

.district-link:hover {
  background: #e8f4eb;
}

.empty-state {
  padding: 25px 10px;
  color: var(--muted);
  text-align: center;
  font-size: 11px;
}

.dashboard-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-top: 25px;
  padding: 20px 0 4px;
  border-top: 1px solid #e4eae4;
}

.dashboard-footer p,
.dashboard-footer a {
  color: #859188;
  font-size: 10px;
}

.dashboard-footer p {
  margin: 0;
}

.dashboard-footer div {
  display: flex;
  gap: 19px;
}

.dashboard-footer a {
  text-decoration: none;
}

.dashboard-footer a:hover {
  color: var(--primary);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 20px;
  background: #061d13b8;
  backdrop-filter: blur(5px);
}

.dashboard-modal {
  position: relative;
  width: 100%;
  max-width: 440px;
  padding: 32px;
  border-radius: 15px;
  background: white;
  box-shadow: 0 25px 80px #00000025;
}

.modal-close {
  position: absolute;
  top: 13px;
  right: 15px;
  width: 33px;
  height: 33px;
  border: 0;
  border-radius: 8px;
  color: #56675b;
  background: #edf3ee;
  font-size: 23px;
  cursor: pointer;
}

.modal-icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  margin-bottom: 21px;
  border-radius: 12px;
  background: #e7f4ea;
  font-size: 24px;
}

.dashboard-modal h2 {
  margin: 12px 0;
  font-size: 24px;
}

.dashboard-modal > p {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.9;
}

.dashboard-modal .modal-note {
  padding: 13px;
  border-radius: 8px;
  background: #f2f6f2;
}

.modal-done {
  width: 100%;
  min-height: 43px;
  margin-top: 13px;
  border: 0;
  border-radius: 8px;
  color: white;
  background: var(--primary);
  font: inherit;
  font-size: 12px;
  font-weight: 750;
  cursor: pointer;
}

.sidebar-backdrop {
  display: none;
}

@media (max-width: 1200px) {
  .sidebar {
    width: 225px;
    min-width: 225px;
  }

  .dashboard-content {
    padding-right: 22px;
    padding-left: 22px;
  }

  .topbar {
    padding-right: 22px;
    padding-left: 22px;
  }

  .topbar-right {
    gap: 12px;
  }

  .top-search {
    width: 185px;
  }

  .stats-grid {
    gap: 11px;
  }

  .stat-card {
    padding: 15px;
  }

  .middle-grid,
  .bottom-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 950px) {
  .sidebar {
    position: fixed;
    z-index: 30;
    top: 0;
    left: 0;
    height: 100dvh;
    transform: translateX(-100%);
    transition: transform 0.25s;
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
  }

  .sidebar-backdrop {
    position: fixed;
    inset: 0;
    z-index: 20;
    display: block;
    background: #061d1375;
  }

  .menu-toggle {
    display: block;
  }

  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .middle-grid,
  .bottom-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 650px) {
  .topbar {
    min-height: 75px;
    padding: 13px 15px;
  }

  .topbar h1 {
    font-size: 16px;
  }

  .top-search {
    width: 38px;
    padding: 0 8px;
    border-color: transparent;
    background: transparent;
  }

  .top-search > span {
    flex-shrink: 0;
  }

  .top-search input {
    width: 0;
    padding: 0;
    opacity: 0;
  }

  .top-search:focus-within {
    position: absolute;
    right: 15px;
    top: 74px;
    width: calc(100% - 30px);
    border-color: #e1e9e2;
    background: white;
    box-shadow: 0 5px 15px #102d1b0c;
  }

  .top-search:focus-within input {
    width: 100%;
    opacity: 1;
  }

  .topbar-right {
    gap: 7px;
  }

  .profile-details {
    display: none;
  }

  .profile-avatar {
    width: 34px;
    height: 34px;
  }

  .dashboard-content {
    padding: 16px 13px;
  }

  .welcome-banner {
    min-height: 225px;
    padding: 24px 21px;
  }

  .welcome-art {
    position: absolute;
    right: -65px;
    bottom: -12px;
    opacity: 0.22;
  }

  .welcome-content {
    max-width: 100%;
  }

  .welcome-content h2 {
    font-size: 24px;
  }

  .welcome-content p {
    max-width: 95%;
  }

  .section-heading {
    align-items: flex-start;
  }

  .stats-grid {
    gap: 10px;
  }

  .stat-card {
    padding: 13px;
  }

  .stat-icon {
    width: 35px;
    height: 35px;
    font-size: 18px;
  }

  .stat-title {
    min-height: 27px;
    line-height: 1.5;
  }

  .stat-bottom h3 {
    font-size: 23px;
  }

  .stat-period {
    font-size: 8px;
  }

  .panel {
    padding: 17px;
  }

  .chart-column {
    width: 32px;
  }

  .bar {
    width: 11px;
  }

  .dashboard-footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .dashboard-footer div {
    gap: 15px;
  }
}

@media (max-width: 370px) {
  .topbar h1 {
    font-size: 14px;
  }

  .breadcrumb {
    font-size: 9px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-title {
    min-height: auto;
  }

  .section-heading h2 {
    font-size: 15px;
  }

  .demo-badge {
    font-size: 8px;
  }
}
</style>

// media center page


<template>
  <div class="media-page">
    <aside class="sidebar" :class="{ 'sidebar-open': menuOpen }">
      <div class="brand">
        <div class="brand-logo">
          <Landmark :size="27" />
        </div>
        <div>
          <h2>Kitabi Sector</h2>
          <p>Digital Portfolio</p>
        </div>
        <button class="close-menu" @click="menuOpen = false">
          <X :size="21" />
        </button>
      </div>

      <div class="menu-label">MAIN MENU</div>

      <nav class="navigation">
        <router-link to="/dashboard" class="nav-link">
          <LayoutDashboard :size="19" />
          <span>Dashboard</span>
        </router-link>
        <router-link to="/" class="nav-link">
          <House :size="19" />
          <span>Home</span>
        </router-link>
        <router-link to="/about" class="nav-link">
          <Info :size="19" />
          <span>About Us</span>
        </router-link>
        <router-link to="/administration" class="nav-link">
          <UsersRound :size="19" />
          <span>Administration</span>
        </router-link>
        <router-link to="/services" class="nav-link">
          <BriefcaseBusiness :size="19" />
          <span>Services</span>
        </router-link>
        <router-link to="/media" class="nav-link active">
          <Images :size="19" />
          <span>Media Center</span>
        </router-link>
      </nav>

      <div class="sidebar-bottom">
        <div class="help-card">
          <div class="help-icon"><MessageCircle :size="20" /></div>
          <h3>Need assistance?</h3>
          <p>Contact your sector administration for more information.</p>
          <a href="https://www.nyamagabe.gov.rw/" target="_blank" rel="noopener noreferrer">
            Get assistance <ArrowUpRight :size="15" />
          </a>
        </div>
        <div class="sidebar-footer">
          <ShieldCheck :size="17" />
          <span>Community · Development · Progress</span>
        </div>
      </div>
    </aside>

    <div
      v-if="menuOpen"
      class="mobile-overlay"
      @click="menuOpen = false"
    ></div>

    <main class="main-content">
      <header class="topbar">
        <button class="menu-toggle" @click="menuOpen = !menuOpen">
          <Menu :size="22" />
        </button>

        <div class="breadcrumb">
          <span>Pages</span>
          <ChevronRight :size="15" />
          <strong>Media Center</strong>
        </div>

        <div class="topbar-right">
          <div class="search-box">
            <Search :size="18" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search media..."
            />
            <kbd>⌕</kbd>
          </div>
          <button class="icon-button" aria-label="Notifications" @click="showNotifications = !showNotifications">
            <Bell :size="19" />
            <span class="notification-dot"></span>
          </button>
          <div class="profile">
            <div class="profile-avatar">KS</div>
            <div class="profile-text">
              <strong>Kitabi Sector</strong>
              <span>Public Portal</span>
            </div>
            <ChevronDown :size="16" />
          </div>
        </div>
      </header>

      <div v-if="showNotifications" class="notification-panel">
        <strong>Notifications</strong>
        <p>You are viewing the Media Center.</p>
        <p>New official announcements will appear here when connected.</p>
        <button @click="showNotifications = false">Close</button>
      </div>

      <section class="page-body">
        <div class="page-heading">
          <div>
            <div class="eyebrow"><Images :size="15" /> OUR STORIES AND MOMENTS</div>
            <h1>Media Center</h1>
            <p>
              Explore photos, videos, and stories showcasing the development
              and community life of Kitabi Sector.
            </p>
          </div>
          <button class="outline-button" @click="activeCategory = 'All'">
            <Grid2X2 :size="17" />
            Explore Gallery
          </button>
        </div>

        <section class="featured">
          <img
            src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1600&q=85"
            alt="Landscape in Africa"
          />
          <div class="featured-shade"></div>
          <div class="featured-content">
            <span class="featured-tag"><Radio :size="14" /> FEATURED STORY</span>
            <h2>Celebrating Community<br />and Local Development</h2>
            <p>
              Discover the people, projects, and initiatives contributing
              to a brighter future for our community.
            </p>
            <button @click="openFeatured">
              Explore the story <ArrowRight :size="17" />
            </button>
          </div>
          <div class="featured-pagination">
            <span class="pagination-active"></span>
            <span></span>
            <span></span>
          </div>
        </section>

        <div class="stats-row">
          <div class="stat-item">
            <div class="stat-icon green"><Images :size="21" /></div>
            <div>
              <span>Photo Gallery</span>
              <h3>{{ photoCount }}</h3>
              <small>Sample gallery items</small>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon blue"><Video :size="21" /></div>
            <div>
              <span>Video Gallery</span>
              <h3>{{ videoCount }}</h3>
              <small>Sample video items</small>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon orange"><Newspaper :size="21" /></div>
            <div>
              <span>Community Stories</span>
              <h3>{{ storyCount }}</h3>
              <small>Sample stories</small>
            </div>
          </div>
        </div>

        <section class="gallery-section">
          <div class="section-heading">
            <div>
              <span class="section-kicker">DISCOVER OUR COMMUNITY</span>
              <h2>Explore Our Media</h2>
              <p>Memorable moments and stories from our community.</p>
            </div>
            <button class="view-all" @click="activeCategory = 'All'">
              View all <ArrowRight :size="16" />
            </button>
          </div>

          <div class="filter-row">
            <div class="category-filters">
              <button
                v-for="category in categories"
                :key="category"
                :class="{ selected: activeCategory === category }"
                @click="activeCategory = category"
              >
                {{ category }}
              </button>
            </div>
            <div class="result-count">{{ filteredMedia.length }} items</div>
          </div>

          <div v-if="filteredMedia.length" class="media-grid">
            <article
              v-for="item in filteredMedia"
              :key="item.id"
              class="media-card"
              @click="openMedia(item)"
            >
              <div class="media-image">
                <img :src="item.image" :alt="item.title" loading="lazy" />
                <span class="media-type">
                  <Video v-if="item.category === 'Videos'" :size="14" />
                  <BookOpen v-else-if="item.category === 'Stories'" :size="14" />
                  <Images v-else :size="14" />
                  {{ item.category === 'Photos' ? 'PHOTO' : item.category === 'Videos' ? 'VIDEO' : 'STORY' }}
                </span>
                <div v-if="item.category === 'Videos'" class="play-button">
                  <Play :size="22" fill="currentColor" />
                </div>
                <button class="card-open" aria-label="View media">
                  <ArrowUpRight :size="18" />
                </button>
              </div>
              <div class="media-card-body">
                <div class="media-date">
                  <CalendarDays :size="14" />
                  {{ item.date }}
                </div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
                <div class="media-card-footer">
                  <span><MapPin :size="14" /> Kitabi Sector</span>
                  <button aria-label="View details"><ArrowRight :size="16" /></button>
                </div>
              </div>
            </article>
          </div>

          <div v-else class="empty-state">
            <Search :size="34" />
            <h3>No media found</h3>
            <p>Try another search term or select a different category.</p>
            <button @click="resetFilters">Clear filters</button>
          </div>
        </section>

        <section class="bottom-banner">
          <div class="banner-icon"><Camera :size="27" /></div>
          <div>
            <h3>Every moment tells a story</h3>
            <p>
              Stay connected with community activities, local initiatives,
              and development updates.
            </p>
          </div>
          <button @click="showMediaInfo = true">
            About our media <ArrowRight :size="16" />
          </button>
        </section>

        <footer class="page-footer">
          <p>© {{ new Date().getFullYear() }} Kitabi Sector Digital Portfolio</p>
          <div>
            <span>Community</span>
            <span class="footer-dot"></span>
            <span>Transparency</span>
            <span class="footer-dot"></span>
            <span>Development</span>
          </div>
        </footer>
      </section>
    </main>

    <div v-if="selectedMedia" class="modal-backdrop" @click.self="selectedMedia = null">
      <div class="media-modal">
        <button class="modal-close" @click="selectedMedia = null" aria-label="Close">
          <X :size="21" />
        </button>
        <img :src="selectedMedia.image" :alt="selectedMedia.title" />
        <div class="modal-content">
          <span class="section-kicker">{{ selectedMedia.category }} · {{ selectedMedia.date }}</span>
          <h2>{{ selectedMedia.title }}</h2>
          <p>{{ selectedMedia.description }}</p>
          <div class="modal-location"><MapPin :size="16" /> Kitabi Sector, Nyamagabe District, Rwanda</div>
          <button class="primary-button" @click="selectedMedia = null">Close preview</button>
        </div>
      </div>
    </div>

    <div v-if="showMediaInfo" class="modal-backdrop" @click.self="showMediaInfo = false">
      <div class="info-modal">
        <button class="modal-close" @click="showMediaInfo = false" aria-label="Close">
          <X :size="21" />
        </button>
        <div class="info-modal-icon"><Camera :size="27" /></div>
        <h2>About the Media Center</h2>
        <p>
          The Media Center is a place to share photos, videos, and stories
          about Kitabi Sector's community life and development.
        </p>
        <p class="demo-note">
          This page currently contains sample content. Replace it with verified
          photos, official videos, and approved community stories.
        </p>
        <button class="primary-button" @click="showMediaInfo = false">Got it</button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Landmark,
  LayoutDashboard,
  House,
  Info,
  UsersRound,
  BriefcaseBusiness,
  Images,
  MessageCircle,
  ArrowUpRight,
  ShieldCheck,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Grid2X2,
  Radio,
  ArrowRight,
  Video,
  Newspaper,
  CalendarDays,
  MapPin,
  Play,
  BookOpen,
  Camera
} from "lucide-vue-next";

export default {
  name: "MediaCenterView",
  components: {
    Landmark,
    LayoutDashboard,
    House,
    Info,
    UsersRound,
    BriefcaseBusiness,
    Images,
    MessageCircle,
    ArrowUpRight,
    ShieldCheck,
    Search,
    Bell,
    ChevronDown,
    ChevronRight,
    Menu,
    X,
    Grid2X2,
    Radio,
    ArrowRight,
    Video,
    Newspaper,
    CalendarDays,
    MapPin,
    Play,
    BookOpen,
    Camera
  },
  data() {
    return {
      menuOpen: false,
      searchQuery: "",
      activeCategory: "All",
      selectedMedia: null,
      showMediaInfo: false,
      showNotifications: false,
      categories: ["All", "Photos", "Videos", "Stories"],
      mediaItems: [
        {
          id: 1,
          title: "Our Beautiful Green Landscape",
          category: "Photos",
          date: "Community Gallery",
          description: "A view of the beautiful natural landscapes found across Rwanda.",
          image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=900&q=80"
        },
        {
          id: 2,
          title: "Building Stronger Communities",
          category: "Photos",
          date: "Community Activities",
          description: "Community participation and collective efforts for local development.",
          image: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=900&q=80"
        },
        {
          id: 3,
          title: "A Look at Rural Life",
          category: "Videos",
          date: "Video Collection",
          description: "A video collection celebrating daily life and the natural environment.",
          image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80"
        },
        {
          id: 4,
          title: "Growing Together",
          category: "Stories",
          date: "Community Stories",
          description: "Stories about cooperation, opportunity, and community progress.",
          image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80"
        },
        {
          id: 5,
          title: "Nature and Our Environment",
          category: "Photos",
          date: "Environment",
          description: "Celebrating the landscapes and natural beauty of our region.",
          image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80"
        },
        {
          id: 6,
          title: "Working Together for Progress",
          category: "Videos",
          date: "Video Collection",
          description: "A sample feature about teamwork and community development.",
          image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80"
        }
      ]
    };
  },
  computed: {
    filteredMedia() {
      const query = this.searchQuery.trim().toLowerCase();

      return this.mediaItems.filter((item) => {
        const matchesCategory =
          this.activeCategory === "All" ||
          item.category === this.activeCategory;

        const matchesSearch =
          !query ||
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
      });
    },
    photoCount() {
      return this.mediaItems.filter(item => item.category === "Photos").length;
    },
    videoCount() {
      return this.mediaItems.filter(item => item.category === "Videos").length;
    },
    storyCount() {
      return this.mediaItems.filter(item => item.category === "Stories").length;
    }
  },
  methods: {
    openMedia(item) {
      this.selectedMedia = item;
      this.menuOpen = false;
    },
    openFeatured() {
      this.selectedMedia = {
        id: 0,
        title: "Celebrating Community and Local Development",
        category: "Featured Story",
        date: "Featured",
        description: "Discover the people, projects, and initiatives contributing to a brighter future for our community. Replace this sample story with verified information from Kitabi Sector.",
        image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=85"
      };
    },
    resetFilters() {
      this.searchQuery = "";
      this.activeCategory = "All";
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.media-page {
  min-height: 100vh;
  background: #f5f7f6;
  color: #172b23;
  font-family: Inter, "Segoe UI", Arial, sans-serif;
}

button,
input {
  font: inherit;
}

button {
  cursor: pointer;
}

.sidebar {
  width: 260px;
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  padding: 27px 18px 18px;
  color: #e8f4ec;
  background: linear-gradient(165deg, #102e25, #164634 55%, #102b23);
  overflow-y: auto;
}

.brand {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 0 5px 32px;
}

.brand-logo {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  color: white;
  background: #279b65;
  border-radius: 13px;
}

.brand h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 750;
  letter-spacing: -0.3px;
}

.brand p {
  margin: 5px 0 0;
  color: #a9c7b8;
  font-size: 11px;
}

.close-menu,
.menu-toggle {
  display: none;
}

.menu-label {
  padding: 0 12px;
  margin-bottom: 12px;
  color: #8aaf9d;
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 1.5px;
}

.navigation {
  display: grid;
  gap: 7px;
}

.nav-link {
  min-height: 46px;
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 0 13px;
  border-radius: 9px;
  color: #bfd6ca;
  text-decoration: none;
  font-size: 13px;
  font-weight: 550;
  transition: background 0.2s, color 0.2s;
}

.nav-link:hover {
  background: #ffffff12;
  color: white;
}

.nav-link.active {
  background: #249b64;
  color: white;
  box-shadow: 0 5px 15px #071d1540;
}

.sidebar-bottom {
  margin-top: auto;
  padding-top: 30px;
}

.help-card {
  padding: 17px;
  background: #ffffff0b;
  border: 1px solid #ffffff16;
  border-radius: 13px;
}

.help-icon {
  width: 35px;
  height: 35px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  color: #a2efc3;
  background: #ffffff12;
}

.help-card h3 {
  margin: 13px 0 7px;
  font-size: 13px;
}

.help-card p {
  margin: 0;
  color: #a9c7b8;
  font-size: 11px;
  line-height: 1.7;
}

.help-card a {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 13px;
  color: #a5f0c2;
  text-decoration: none;
  font-size: 11px;
  font-weight: 700;
}

.sidebar-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding: 0 3px;
  color: #91b3a1;
  font-size: 9px;
}

.main-content {
  min-height: 100vh;
  margin-left: 260px;
}

.topbar {
  height: 76px;
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 0 36px;
  background: #ffffffed;
  border-bottom: 1px solid #e9eeeb;
  backdrop-filter: blur(14px);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #8b9991;
  font-size: 12px;
}

.breadcrumb strong {
  color: #244b39;
  font-weight: 700;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-box {
  width: 235px;
  height: 39px;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 10px;
  color: #8b9991;
  background: #f6f8f7;
  border: 1px solid #e9eeeb;
  border-radius: 9px;
}

.search-box input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #244b39;
  font-size: 11px;
}

.search-box kbd {
  color: #96a29b;
  font-size: 17px;
}

.icon-button {
  position: relative;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  color: #607168;
  background: white;
  border: 1px solid #e8eeea;
  border-radius: 10px;
}

.notification-dot {
  width: 7px;
  height: 7px;
  position: absolute;
  top: 7px;
  right: 7px;
  background: #e39c43;
  border: 1px solid white;
  border-radius: 50%;
}

.profile {
  display: flex;
  align-items: center;
  gap: 9px;
}

.profile-avatar {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  color: #1c7249;
  background: #e0f3e8;
  border-radius: 11px;
  font-size: 11px;
  font-weight: 800;
}

.profile-text {
  display: grid;
  gap: 4px;
}

.profile-text strong {
  color: #263d31;
  font-size: 11px;
}

.profile-text span {
  color: #8a9990;
  font-size: 10px;
}

.profile > svg {
  color: #839188;
}

.notification-panel {
  width: 280px;
  position: fixed;
  top: 67px;
  right: 30px;
  z-index: 150;
  padding: 19px;
  background: white;
  border: 1px solid #e4ebe6;
  border-radius: 13px;
  box-shadow: 0 12px 40px #193c281c;
  font-size: 12px;
}

.notification-panel p {
  color: #75837a;
  line-height: 1.6;
}

.notification-panel button {
  padding: 8px 13px;
  color: white;
  background: #20794d;
  border: 0;
  border-radius: 7px;
}

.page-body {
  max-width: 1600px;
  margin: 0 auto;
  padding: 34px 36px 22px;
}

.page-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 27px;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #278558;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.4px;
}

.page-heading h1 {
  margin: 11px 0 8px;
  color: #193a2a;
  font-size: clamp(27px, 3vw, 35px);
  font-weight: 800;
  letter-spacing: -1.3px;
}

.page-heading p {
  max-width: 580px;
  margin: 0;
  color: #7c8981;
  font-size: 12px;
  line-height: 1.8;
}

.outline-button {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 12px 15px;
  white-space: nowrap;
  color: #286847;
  background: white;
  border: 1px solid #dce8df;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 700;
}

.outline-button:hover {
  background: #edf7f0;
}

.featured {
  height: 330px;
  position: relative;
  overflow: hidden;
  background: #193d2a;
  border-radius: 17px;
  box-shadow: 0 8px 24px #193d2a14;
}

.featured > img {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  object-fit: cover;
  object-position: center 47%;
}

.featured-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #0b2116e8 0%, #102d1bc2 42%, #142d1b1c 100%),
    linear-gradient(0deg, #10231854, transparent 55%);
}

.featured-content {
  max-width: 550px;
  position: absolute;
  top: 50%;
  left: 39px;
  transform: translateY(-50%);
  color: white;
}

.featured-tag {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 10px;
  color: #d3f8df;
  background: #ffffff1a;
  border: 1px solid #ffffff24;
  border-radius: 6px;
  font-size: 9px;
  font-weight: 750;
  letter-spacing: 1px;
}

.featured-content h2 {
  margin: 17px 0 11px;
  font-size: clamp(24px, 3vw, 34px);
  font-weight: 800;
  letter-spacing: -0.8px;
  line-height: 1.2;
}

.featured-content p {
  max-width: 420px;
  margin: 0;
  color: #d7e4da;
  font-size: 12px;
  line-height: 1.8;
}

.featured-content > button {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  padding: 12px 15px;
  color: #17472f;
  background: #e5f5e9;
  border: 0;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
  transition: background 0.2s;
}

.featured-content > button:hover {
  background: white;
}

.featured-pagination {
  position: absolute;
  right: 24px;
  bottom: 23px;
  display: flex;
  gap: 6px;
}

.featured-pagination span {
  width: 6px;
  height: 6px;
  background: #ffffff7a;
  border-radius: 10px;
}

.featured-pagination .pagination-active {
  width: 22px;
  background: white;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin: 22px 0 39px;
}

.stat-item {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  background: white;
  border: 1px solid #e9efeb;
  border-radius: 12px;
}

.stat-icon {
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 12px;
}

.stat-icon.green {
  color: #248352;
  background: #e4f5e9;
}

.stat-icon.blue {
  color: #3474b9;
  background: #e9f2fc;
}

.stat-icon.orange {
  color: #b97926;
  background: #fff2de;
}

.stat-item span {
  display: block;
  color: #829087;
  font-size: 10px;
}

.stat-item h3 {
  margin: 5px 0 4px;
  color: #234432;
  font-size: 24px;
  line-height: 1;
}

.stat-item small {
  color: #9aa59e;
  font-size: 9px;
}

.gallery-section {
  margin-bottom: 31px;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 22px;
}

.section-kicker {
  color: #32895a;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

.section-heading h2 {
  margin: 7px 0 6px;
  color: #1c3b2b;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.section-heading p {
  margin: 0;
  color: #86938b;
  font-size: 11px;
}

.view-all {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 0 9px 10px;
  color: #2b8254;
  background: transparent;
  border: 0;
  font-size: 11px;
  font-weight: 750;
}

.filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-filters button {
  padding: 9px 16px;
  color: #7a8980;
  background: white;
  border: 1px solid #e4ebe6;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 650;
  transition: 0.2s;
}

.category-filters button:hover {
  border-color: #a9d5b9;
}

.category-filters button.selected {
  color: white;
  background: #217a4d;
  border-color: #217a4d;
}

.result-count {
  color: #9aa59e;
  font-size: 10px;
  white-space: nowrap;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.media-card {
  min-width: 0;
  overflow: hidden;
  background: white;
  border: 1px solid #e7ede9;
  border-radius: 13px;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.media-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 26px #183d2612;
}

.media-image {
  height: 175px;
  position: relative;
  overflow: hidden;
  background: #dfe9e1;
}

.media-image > img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 0.35s;
}

.media-card:hover .media-image > img {
  transform: scale(1.045);
}

.media-type {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 9px;
  color: #fff;
  background: #183e2bd9;
  border: 1px solid #ffffff2b;
  border-radius: 6px;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.6px;
}

.play-button {
  width: 47px;
  height: 47px;
  position: absolute;
  top: 50%;
  left: 50%;
  display: grid;
  place-items: center;
  padding-left: 3px;
  color: white;
  background: #1c704ad9;
  border: 1px solid #ffffff80;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.card-open {
  width: 32px;
  height: 32px;
  position: absolute;
  right: 12px;
  bottom: 12px;
  display: grid;
  place-items: center;
  color: white;
  background: #122d23a8;
  border: 1px solid #ffffff3d;
  border-radius: 8px;
}

.media-card-body {
  padding: 16px 16px 13px;
}

.media-date {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #829188;
  font-size: 9px;
}

.media-card-body h3 {
  margin: 11px 0 7px;
  overflow-wrap: anywhere;
  color: #234331;
  font-size: 13px;
  font-weight: 750;
  line-height: 1.45;
}

.media-card-body > p {
  min-height: 35px;
  margin: 0;
  color: #849188;
  font-size: 10px;
  line-height: 1.7;
}

.media-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 15px;
  padding-top: 12px;
  border-top: 1px solid #edf1ee;
}

.media-card-footer > span {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #849188;
  font-size: 9px;
}

.media-card-footer button {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  color: #2b8152;
  background: #eef7f0;
  border: 0;
  border-radius: 8px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 55px 20px;
  color: #7f9386;
  background: white;
  border: 1px dashed #cddbd1;
  border-radius: 13px;
  text-align: center;
}

.empty-state h3 {
  margin: 15px 0 6px;
  color: #234331;
}

.empty-state p {
  font-size: 12px;
}

.empty-state button {
  margin-top: 10px;
  padding: 10px 15px;
  color: white;
  background: #217a4d;
  border: 0;
  border-radius: 8px;
}

.bottom-banner {
  display: flex;
  align-items: center;
  gap: 17px;
  padding: 22px;
  background: linear-gradient(100deg, #e9f5ec, #f6faf7);
  border: 1px solid #dcecdf;
  border-radius: 13px;
}

.banner-icon {
  width: 49px;
  height: 49px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  color: #277e4f;
  background: white;
  border: 1px solid #e0ece2;
  border-radius: 12px;
}

.bottom-banner > div:nth-child(2) {
  flex: 1;
}

.bottom-banner h3 {
  margin: 0 0 6px;
  color: #214732;
  font-size: 13px;
}

.bottom-banner p {
  margin: 0;
  color: #718579;
  font-size: 10px;
  line-height: 1.7;
}

.bottom-banner > button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 13px;
  white-space: nowrap;
  color: white;
  background: #227b4e;
  border: 0;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
}

.bottom-banner > button:hover,
.primary-button:hover {
  background: #155d39;
}

.page-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
  padding: 18px 0 4px;
  border-top: 1px solid #e4ebe6;
}

.page-footer p,
.page-footer > div {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 0;
  color: #94a097;
  font-size: 9px;
}

.footer-dot {
  width: 3px;
  height: 3px;
  background: #a9b8ae;
  border-radius: 50%;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: grid;
  place-items: center;
  overflow-y: auto;
  padding: 24px;
  background: #0b2119b8;
  backdrop-filter: blur(5px);
}

.media-modal,
.info-modal {
  width: min(100%, 650px);
  position: relative;
  overflow: hidden;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 80px #071a103d;
}

.media-modal > img {
  width: 100%;
  max-height: 340px;
  display: block;
  object-fit: cover;
}

.modal-close {
  width: 36px;
  height: 36px;
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  display: grid;
  place-items: center;
  color: #294736;
  background: #ffffffed;
  border: 0;
  border-radius: 50%;
}

.modal-content {
  padding: 25px;
}

.modal-content h2,
.info-modal h2 {
  margin: 9px 0;
  color: #1e412e;
  font-size: 24px;
}

.modal-content > p,
.info-modal > p {
  color: #77867c;
  font-size: 12px;
  line-height: 1.8;
}

.modal-location {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 17px 0;
  color: #73887a;
  font-size: 11px;
}

.primary-button {
  padding: 11px 16px;
  color: white;
  background: #227b4e;
  border: 0;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 750;
}

.info-modal {
  max-width: 440px;
  padding: 30px;
}

.info-modal-icon {
  width: 51px;
  height: 51px;
  display: grid;
  place-items: center;
  color: #247c4e;
  background: #e7f5eb;
  border-radius: 13px;
}

.info-modal h2 {
  margin-top: 18px;
  font-size: 21px;
}

.demo-note {
  padding: 12px;
  background: #f0f7f1;
  border-left: 3px solid #2c925b;
  border-radius: 4px;
}

@media (min-width: 1600px) {
  .page-body {
    padding-right: 48px;
    padding-left: 48px;
  }

  .media-image {
    height: 205px;
  }
}

@media (max-width: 1200px) {
  .topbar {
    padding: 0 24px;
  }

  .page-body {
    padding: 29px 24px 20px;
  }

  .media-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .media-image {
    height: 190px;
  }

  .topbar-right {
    gap: 12px;
  }

  .search-box {
    width: 190px;
  }
}

@media (max-width: 760px) {
  .sidebar {
    width: 275px;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
  }

  .close-menu {
    display: grid;
    place-items: center;
    margin-left: auto;
    color: #d5e6dc;
    background: transparent;
    border: 0;
  }

  .mobile-overlay {
    position: fixed;
    inset: 0;
    z-index: 90;
    background: #081c12a6;
  }

  .main-content {
    margin-left: 0;
  }

  .topbar {
    height: 66px;
    gap: 12px;
    padding: 0 16px;
  }

  .menu-toggle {
    width: 36px;
    height: 36px;
    display: grid;
    flex-shrink: 0;
    place-items: center;
    color: #28563c;
    background: #f1f7f2;
    border: 1px solid #e2ece4;
    border-radius: 9px;
  }

  .breadcrumb {
    flex: 1;
    gap: 5px;
    font-size: 10px;
  }

  .topbar-right {
    gap: 9px;
  }

  .search-box {
    width: 36px;
    height: 36px;
    padding: 0 9px;
    background: white;
    border-color: #e8eeea;
  }

  .search-box input,
  .search-box kbd {
    display: none;
  }

  .search-box:focus-within {
    width: 155px;
  }

  .search-box:focus-within input {
    display: block;
  }

  .search-box:focus-within kbd {
    display: none;
  }

  .profile-text,
  .profile > svg {
    display: none;
  }

  .profile-avatar {
    width: 34px;
    height: 34px;
  }

  .page-body {
    padding: 25px 16px 20px;
  }

  .page-heading {
    align-items: flex-start;
    margin-bottom: 20px;
  }

  .page-heading h1 {
    font-size: 28px;
  }

  .page-heading p {
    font-size: 11px;
  }

  .outline-button {
    padding: 10px;
    font-size: 0;
  }

  .outline-button svg {
    width: 18px;
    height: 18px;
  }

  .featured {
    height: 315px;
  }

  .featured-content {
    right: 20px;
    left: 22px;
  }

  .featured-content h2 {
    font-size: 27px;
  }

  .featured-content p {
    font-size: 11px;
  }

  .stats-row {
    grid-template-columns: 1fr;
    gap: 10px;
    margin: 16px 0 31px;
  }

  .stat-item {
    padding: 15px;
  }

  .stat-icon {
    width: 42px;
    height: 42px;
  }

  .media-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .media-image {
    height: 140px;
  }

  .media-card-body {
    padding: 12px;
  }

  .media-card-body h3 {
    font-size: 12px;
  }

  .media-card-body > p {
    font-size: 10px;
  }

  .section-heading h2 {
    font-size: 20px;
  }

  .bottom-banner {
    align-items: flex-start;
    flex-wrap: wrap;
    padding: 17px;
  }

  .bottom-banner > div:nth-child(2) {
    min-width: 0;
  }

  .bottom-banner > button {
    width: 100%;
  }

  .page-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 420px) {
  .breadcrumb span,
  .breadcrumb > svg {
    display: none;
  }

  .topbar {
    gap: 8px;
    padding: 0 10px;
  }

  .topbar-right {
    gap: 7px;
  }

  .page-body {
    padding-right: 12px;
    padding-left: 12px;
  }

  .page-heading h1 {
    font-size: 25px;
  }

  .featured {
    height: 300px;
  }

  .featured-content h2 {
    font-size: 24px;
  }

  .media-grid {
    grid-template-columns: 1fr;
  }

  .media-image {
    height: 190px;
  }

  .filter-row {
    align-items: flex-start;
    flex-direction: column;
  }

  .category-filters {
    gap: 6px;
  }

  .category-filters button {
    padding: 8px 12px;
  }

  .section-heading p {
    max-width: 230px;
    line-height: 1.6;
  }

  .modal-backdrop {
    padding: 12px;
  }

  .info-modal {
    padding: 23px;
  }
}
</style>

// research page


<template>
  <div class="research-page">
    <aside class="sidebar" :class="{ 'sidebar-open': menuOpen }">
      <div class="brand">
        <div class="brand-logo">
          <Landmark :size="26" />
        </div>
        <div>
          <h2>Kitabi Sector</h2>
          <p>Digital Portfolio</p>
        </div>
        <button class="close-menu" @click="menuOpen = false">
          <X :size="21" />
        </button>
      </div>

      <div class="menu-label">MAIN MENU</div>

      <nav class="navigation">
        <router-link to="/dashboard" class="nav-link">
          <LayoutDashboard :size="19" />
          <span>Dashboard</span>
        </router-link>
        <router-link to="/" class="nav-link">
          <House :size="19" />
          <span>Home</span>
        </router-link>
        <router-link to="/about" class="nav-link">
          <Info :size="19" />
          <span>About Us</span>
        </router-link>
        <router-link to="/administration" class="nav-link">
          <UsersRound :size="19" />
          <span>Administration</span>
        </router-link>
        <router-link to="/services" class="nav-link">
          <BriefcaseBusiness :size="19" />
          <span>Services</span>
        </router-link>
        <router-link to="/media" class="nav-link">
          <Images :size="19" />
          <span>Media Center</span>
        </router-link>
        <router-link to="/research" class="nav-link active">
          <Microscope :size="19" />
          <span>Research</span>
        </router-link>
      </nav>

      <div class="sidebar-bottom">
        <div class="help-card">
          <div class="help-icon"><BookOpen :size="20" /></div>
          <h3>Knowledge Center</h3>
          <p>Explore research, community information, and development resources.</p>
          <a href="https://www.nyamagabe.gov.rw/" target="_blank" rel="noopener noreferrer">
            Official resources <ArrowUpRight :size="15" />
          </a>
        </div>
        <div class="sidebar-footer">
          <ShieldCheck :size="17" />
          <span>Knowledge · Innovation · Progress</span>
        </div>
      </div>
    </aside>

    <div v-if="menuOpen" class="mobile-overlay" @click="menuOpen = false"></div>

    <main class="main-content">
      <header class="topbar">
        <button class="menu-toggle" @click="menuOpen = !menuOpen">
          <Menu :size="22" />
        </button>

        <div class="breadcrumb">
          <span>Pages</span>
          <ChevronRight :size="15" />
          <strong>Research</strong>
        </div>

        <div class="topbar-right">
          <div class="search-box">
            <Search :size="18" />
            <input v-model="searchQuery" placeholder="Search research..." />
          </div>
          <button class="icon-button" @click="showNotifications = !showNotifications" aria-label="Notifications">
            <Bell :size="19" />
            <span class="notification-dot"></span>
          </button>
          <div class="profile">
            <div class="profile-avatar">KS</div>
            <div class="profile-text">
              <strong>Kitabi Sector</strong>
              <span>Public Portal</span>
            </div>
            <ChevronDown :size="16" />
          </div>
        </div>
      </header>

      <div v-if="showNotifications" class="notification-panel">
        <strong>Notifications</strong>
        <p>You are viewing the Research Center.</p>
        <p>New research announcements will appear here when available.</p>
        <button @click="showNotifications = false">Close</button>
      </div>

      <section class="page-body">
        <div class="page-heading">
          <div>
            <div class="eyebrow"><Microscope :size="15" /> KNOWLEDGE AND DISCOVERY</div>
            <h1>Research Center</h1>
            <p>
              Explore research topics, community studies, and development
              resources relevant to Kitabi Sector.
            </p>
          </div>
          <button class="primary-button" @click="showResearchInfo = true">
            <Plus :size="17" /> Research Guidelines
          </button>
        </div>

        <section class="hero-banner">
          <div class="hero-content">
            <span class="hero-tag"><Lightbulb :size="15" /> KNOWLEDGE FOR DEVELOPMENT</span>
            <h2>Research Today.<br />Improve Tomorrow.</h2>
            <p>
              Discover insights and information that can support informed
              decisions, sustainable development, and community progress.
            </p>
            <button @click="scrollToLibrary">
              Explore research <ArrowRight :size="17" />
            </button>
          </div>
          <div class="hero-graphic">
            <div class="graphic-circle circle-one"></div>
            <div class="graphic-circle circle-two"></div>
            <div class="graphic-card">
              <div class="graphic-icon"><Microscope :size="35" /></div>
              <span>RESEARCH & INSIGHTS</span>
              <strong>Knowledge<br />in Action</strong>
              <div class="graphic-lines"><i></i><i></i><i></i></div>
            </div>
            <div class="floating-icon floating-book"><BookOpen :size="22" /></div>
            <div class="floating-icon floating-chart"><ChartNoAxesCombined :size="22" /></div>
          </div>
        </section>

        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-icon green"><FileText :size="22" /></div>
            <div>
              <span>Research Records</span>
              <h3>{{ researchItems.length }}</h3>
              <small>Sample records</small>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon blue"><CheckCircle2 :size="22" /></div>
            <div>
              <span>Published</span>
              <h3>{{ countByStatus("Published") }}</h3>
              <small>Sample published records</small>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon orange"><Clock3 :size="22" /></div>
            <div>
              <span>In Progress</span>
              <h3>{{ countByStatus("In Progress") }}</h3>
              <small>Sample ongoing records</small>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon purple"><FolderOpen :size="22" /></div>
            <div>
              <span>Research Topics</span>
              <h3>{{ topicCount }}</h3>
              <small>Across the sample library</small>
            </div>
          </div>
        </div>

        <section class="topics-section">
          <div class="section-heading">
            <div>
              <span class="section-kicker">BROWSE BY INTEREST</span>
              <h2>Research Categories</h2>
              <p>Find information by subject area.</p>
            </div>
          </div>

          <div class="topics-grid">
            <button
              v-for="topic in topics"
              :key="topic.name"
              class="topic-card"
              :class="{ 'topic-selected': activeTopic === topic.name }"
              @click="selectTopic(topic.name)"
            >
              <div class="topic-icon" :class="topic.color">
                <component :is="topic.icon" :size="23" />
              </div>
              <div class="topic-text">
                <h3>{{ topic.name }}</h3>
                <p>{{ topic.description }}</p>
              </div>
              <ArrowUpRight :size="17" class="topic-arrow" />
            </button>
          </div>
        </section>

        <section ref="librarySection" class="library-section">
          <div class="section-heading library-heading">
            <div>
              <span class="section-kicker">RESEARCH LIBRARY</span>
              <h2>Research and Publications</h2>
              <p>Browse available records and their publication status.</p>
            </div>
            <button class="export-button" @click="exportResearch">
              <Download :size="16" /> Export CSV
            </button>
          </div>

          <div class="library-toolbar">
            <div class="library-search">
              <Search :size="17" />
              <input v-model="searchQuery" placeholder="Search titles, topics, descriptions..." />
            </div>
            <select v-model="statusFilter" aria-label="Filter by status">
              <option value="All">All statuses</option>
              <option value="Published">Published</option>
              <option value="In Progress">In Progress</option>
              <option value="Draft">Draft</option>
            </select>
            <select v-model="yearFilter" aria-label="Filter by year">
              <option value="All">All years</option>
              <option v-for="year in availableYears" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>

          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>RESEARCH TITLE</th>
                  <th>CATEGORY</th>
                  <th>YEAR</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredResearch" :key="item.id">
                  <td>
                    <div class="research-title-cell">
                      <div class="document-icon"><FileText :size="19" /></div>
                      <div>
                        <strong>{{ item.title }}</strong>
                        <span>{{ item.description }}</span>
                      </div>
                    </div>
                  </td>
                  <td><span class="category-label">{{ item.category }}</span></td>
                  <td>{{ item.year }}</td>
                  <td>
                    <span class="status-pill" :class="statusClass(item.status)">
                      <span></span>{{ item.status }}
                    </span>
                  </td>
                  <td>
                    <button class="view-button" @click="viewResearch(item)">
                      View <ArrowUpRight :size="14" />
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredResearch.length === 0">
                  <td colspan="5" class="empty-cell">
                    <Search :size="28" />
                    <strong>No research records found</strong>
                    <span>Try changing your search or filters.</span>
                    <button @click="resetFilters">Clear filters</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="table-footer">
            <span>Showing {{ filteredResearch.length }} of {{ researchItems.length }} records</span>
            <button @click="resetFilters">Reset filters <RotateCcw :size="14" /></button>
          </div>
        </section>

        <section class="research-cta">
          <div class="cta-icon"><GraduationCap :size="28" /></div>
          <div>
            <h3>Interested in contributing to research?</h3>
            <p>
              Contact the appropriate local administration to discuss research
              opportunities and information requests.
            </p>
          </div>
          <a href="https://www.nyamagabe.gov.rw/" target="_blank" rel="noopener noreferrer">
            Official website <ArrowUpRight :size="16" />
          </a>
        </section>

        <footer class="page-footer">
          <p>© {{ new Date().getFullYear() }} Kitabi Sector Digital Portfolio</p>
          <div>Knowledge <span>•</span> Innovation <span>•</span> Development</div>
        </footer>
      </section>
    </main>

    <div v-if="selectedResearch" class="modal-backdrop" @click.self="selectedResearch = null">
      <div class="research-modal">
        <button class="modal-close" @click="selectedResearch = null" aria-label="Close">
          <X :size="20" />
        </button>
        <div class="modal-document-icon"><FileText :size="28" /></div>
        <span class="section-kicker">RESEARCH RECORD</span>
        <h2>{{ selectedResearch.title }}</h2>
        <p>{{ selectedResearch.description }}</p>
        <div class="detail-list">
          <div><span>Category</span><strong>{{ selectedResearch.category }}</strong></div>
          <div><span>Year</span><strong>{{ selectedResearch.year }}</strong></div>
          <div><span>Status</span><strong>{{ selectedResearch.status }}</strong></div>
          <div><span>Source</span><strong>{{ selectedResearch.source }}</strong></div>
        </div>
        <p class="demo-notice">
          This is demonstration content, not a verified research publication.
          Replace it with an official record before publishing.
        </p>
        <button class="primary-button modal-done" @click="selectedResearch = null">Close details</button>
      </div>
    </div>

    <div v-if="showResearchInfo" class="modal-backdrop" @click.self="showResearchInfo = false">
      <div class="research-modal guidelines-modal">
        <button class="modal-close" @click="showResearchInfo = false" aria-label="Close">
          <X :size="20" />
        </button>
        <div class="modal-document-icon"><BookOpen :size="28" /></div>
        <span class="section-kicker">RESEARCH GUIDELINES</span>
        <h2>Using the Research Center</h2>
        <p>Use this section to organize community research and development resources.</p>
        <ul>
          <li>Use reliable sources and verify research findings.</li>
          <li>Record the author, publication year, and source.</li>
          <li>Obtain permission before publishing personal or confidential information.</li>
          <li>Clearly identify draft, ongoing, and published research.</li>
        </ul>
        <button class="primary-button modal-done" @click="showResearchInfo = false">Understood</button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Landmark,
  LayoutDashboard,
  House,
  Info,
  UsersRound,
  BriefcaseBusiness,
  Images,
  Microscope,
  BookOpen,
  MessageCircle,
  ArrowUpRight,
  ShieldCheck,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Plus,
  Lightbulb,
  ArrowRight,
  FileText,
  CheckCircle2,
  Clock3,
  FolderOpen,
  Download,
  RotateCcw,
  GraduationCap,
  Leaf,
  Sprout,
  ChartNoAxesCombined,
  Droplets,
  HeartPulse,
  Wheat,
  Building2
} from "lucide-vue-next";

export default {
  name: "ResearchView",
  components: {
    Landmark,
    LayoutDashboard,
    House,
    Info,
    UsersRound,
    BriefcaseBusiness,
    Images,
    Microscope,
    BookOpen,
    MessageCircle,
    ArrowUpRight,
    ShieldCheck,
    Search,
    Bell,
    ChevronDown,
    ChevronRight,
    Menu,
    X,
    Plus,
    Lightbulb,
    ArrowRight,
    FileText,
    CheckCircle2,
    Clock3,
    FolderOpen,
    Download,
    RotateCcw,
    GraduationCap,
    Leaf,
    Sprout,
    ChartNoAxesCombined,
    Droplets,
    HeartPulse,
    Wheat,
    Building2
  },
  data() {
    return {
      menuOpen: false,
      searchQuery: "",
      statusFilter: "All",
      yearFilter: "All",
      activeTopic: "All",
      selectedResearch: null,
      showResearchInfo: false,
      showNotifications: false,
      topics: [
        {
          name: "Agriculture",
          description: "Farming and food security",
          icon: Wheat,
          color: "green"
        },
        {
          name: "Environment",
          description: "Nature and sustainability",
          icon: Leaf,
          color: "blue"
        },
        {
          name: "Community",
          description: "People and development",
          icon: UsersRound,
          color: "orange"
        },
        {
          name: "Education",
          description: "Learning and skills",
          icon: BookOpen,
          color: "purple"
        },
        {
          name: "Public Health",
          description: "Health and wellbeing",
          icon: HeartPulse,
          color: "red"
        },
        {
          name: "Infrastructure",
          description: "Roads and public facilities",
          icon: Building2,
          color: "teal"
        }
      ],
      researchItems: [
        {
          id: 1,
          title: "Sustainable Agriculture and Food Security",
          category: "Agriculture",
          year: "2025",
          status: "Published",
          description: "Sample record for agricultural practices and food security research.",
          source: "Sample entry"
        },
        {
          id: 2,
          title: "Environmental Conservation and Land Use",
          category: "Environment",
          year: "2025",
          status: "In Progress",
          description: "Sample record covering environmental protection and sustainable land use.",
          source: "Sample entry"
        },
        {
          id: 3,
          title: "Community Participation in Local Development",
          category: "Community",
          year: "2024",
          status: "Published",
          description: "Sample record about community engagement in development initiatives.",
          source: "Sample entry"
        },
        {
          id: 4,
          title: "Access to Education and Learning Resources",
          category: "Education",
          year: "2024",
          status: "Draft",
          description: "Sample record about education access and learning opportunities.",
          source: "Sample entry"
        },
        {
          id: 5,
          title: "Public Health Awareness and Prevention",
          category: "Public Health",
          year: "2025",
          status: "In Progress",
          description: "Sample record about health education and prevention initiatives.",
          source: "Sample entry"
        },
        {
          id: 6,
          title: "Rural Infrastructure and Service Access",
          category: "Infrastructure",
          year: "2023",
          status: "Published",
          description: "Sample record about infrastructure and access to essential services.",
          source: "Sample entry"
        }
      ]
    };
  },
  computed: {
    filteredResearch() {
      const query = this.searchQuery.trim().toLowerCase();

      return this.researchItems.filter(item => {
        const matchesSearch =
          !query ||
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.source.toLowerCase().includes(query);

        const matchesStatus =
          this.statusFilter === "All" || item.status === this.statusFilter;

        const matchesYear =
          this.yearFilter === "All" || item.year === this.yearFilter;

        const matchesTopic =
          this.activeTopic === "All" || item.category === this.activeTopic;

        return matchesSearch && matchesStatus && matchesYear && matchesTopic;
      });
    },
    topicCount() {
      return new Set(this.researchItems.map(item => item.category)).size;
    },
    availableYears() {
      return [...new Set(this.researchItems.map(item => item.year))].sort().reverse();
    }
  },
  methods: {
    countByStatus(status) {
      return this.researchItems.filter(item => item.status === status).length;
    },
    statusClass(status) {
      return status.toLowerCase().replace(/\s+/g, "-");
    },
    selectTopic(topic) {
      this.activeTopic = this.activeTopic === topic ? "All" : topic;
      this.$refs.librarySection?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    },
    scrollToLibrary() {
      this.$refs.librarySection?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    },
    viewResearch(item) {
      this.selectedResearch = item;
    },
    resetFilters() {
      this.searchQuery = "";
      this.statusFilter = "All";
      this.yearFilter = "All";
      this.activeTopic = "All";
    },
    exportResearch() {
      const headers = ["Title", "Category", "Year", "Status", "Description", "Source"];
      const rows = this.filteredResearch.map(item => [
        item.title,
        item.category,
        item.year,
        item.status,
        item.description,
        item.source
      ]);

      const escapeCSV = value =>
        `"${String(value).replace(/"/g, '""')}"`;

      const csv = [headers, ...rows]
        .map(row => row.map(escapeCSV).join(","))
        .join("\r\n");

      const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;"
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "kitabi-research-records.csv";
      link.click();
      URL.revokeObjectURL(url);
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.research-page {
  min-height: 100vh;
  background: #f5f7f6;
  color: #1c3326;
  font-family: Inter, "Segoe UI", Arial, sans-serif;
}

button,
input,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

.sidebar {
  width: 260px;
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  padding: 27px 18px 18px;
  color: #e8f4ec;
  background: linear-gradient(165deg, #102e25, #164634 55%, #102b23);
  overflow-y: auto;
}

.brand {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 0 5px 32px;
}

.brand-logo {
  width: 44px;
  height: 44px;
  display: grid;
  flex-shrink: 0;
  place-items: center;
  color: white;
  background: #279b65;
  border-radius: 13px;
}

.brand h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 750;
}

.brand p {
  margin: 5px 0 0;
  color: #a9c7b8;
  font-size: 11px;
}

.close-menu,
.menu-toggle {
  display: none;
}

.menu-label {
  padding: 0 12px;
  margin-bottom: 12px;
  color: #8aaf9d;
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 1.5px;
}

.navigation {
  display: grid;
  gap: 7px;
}

.nav-link {
  min-height: 46px;
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 0 13px;
  color: #bfd6ca;
  border-radius: 9px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 550;
  transition: 0.2s;
}

.nav-link:hover {
  color: white;
  background: #ffffff12;
}

.nav-link.active {
  color: white;
  background: #249b64;
  box-shadow: 0 5px 15px #071d1540;
}

.sidebar-bottom {
  margin-top: auto;
  padding-top: 30px;
}

.help-card {
  padding: 17px;
  background: #ffffff0b;
  border: 1px solid #ffffff16;
  border-radius: 13px;
}

.help-icon {
  width: 35px;
  height: 35px;
  display: grid;
  place-items: center;
  color: #a2efc3;
  background: #ffffff12;
  border-radius: 10px;
}

.help-card h3 {
  margin: 13px 0 7px;
  font-size: 13px;
}

.help-card p {
  margin: 0;
  color: #a9c7b8;
  font-size: 11px;
  line-height: 1.7;
}

.help-card a {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 13px;
  color: #a5f0c2;
  text-decoration: none;
  font-size: 11px;
  font-weight: 700;
}

.sidebar-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  color: #91b3a1;
  font-size: 9px;
}

.main-content {
  min-height: 100vh;
  margin-left: 260px;
}

.topbar {
  height: 76px;
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 0 36px;
  background: #ffffffed;
  border-bottom: 1px solid #e9eeeb;
  backdrop-filter: blur(14px);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #8b9991;
  font-size: 12px;
}

.breadcrumb strong {
  color: #244b39;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  width: 220px;
  height: 39px;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 11px;
  color: #8b9991;
  background: #f6f8f7;
  border: 1px solid #e9eeeb;
  border-radius: 9px;
}

.search-box input {
  width: 100%;
  min-width: 0;
  color: #244b39;
  background: transparent;
  border: 0;
  outline: 0;
  font-size: 11px;
}

.icon-button {
  width: 38px;
  height: 38px;
  position: relative;
  display: grid;
  place-items: center;
  color: #607168;
  background: white;
  border: 1px solid #e8eeea;
  border-radius: 10px;
}

.notification-dot {
  width: 7px;
  height: 7px;
  position: absolute;
  top: 7px;
  right: 7px;
  background: #e39c43;
  border: 1px solid white;
  border-radius: 50%;
}

.profile {
  display: flex;
  align-items: center;
  gap: 9px;
}

.profile-avatar {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  color: #1c7249;
  background: #e0f3e8;
  border-radius: 11px;
  font-size: 11px;
  font-weight: 800;
}

.profile-text {
  display: grid;
  gap: 4px;
}

.profile-text strong {
  color: #263d31;
  font-size: 11px;
}

.profile-text span {
  color: #8a9990;
  font-size: 10px;
}

.profile > svg {
  color: #839188;
}

.notification-panel {
  width: 280px;
  position: fixed;
  top: 67px;
  right: 30px;
  z-index: 150;
  padding: 19px;
  background: white;
  border: 1px solid #e4ebe6;
  border-radius: 13px;
  box-shadow: 0 12px 40px #193c281c;
  font-size: 12px;
}

.notification-panel p {
  color: #75837a;
  line-height: 1.6;
}

.notification-panel button {
  padding: 8px 13px;
  color: white;
  background: #20794d;
  border: 0;
  border-radius: 7px;
}

.page-body {
  max-width: 1650px;
  margin: 0 auto;
  padding: 34px 36px 22px;
}

.page-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 27px;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #278558;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.4px;
}

.page-heading h1 {
  margin: 11px 0 8px;
  color: #193a2a;
  font-size: clamp(27px, 3vw, 35px);
  font-weight: 800;
  letter-spacing: -1px;
}

.page-heading p {
  max-width: 590px;
  margin: 0;
  color: #7c8981;
  font-size: 12px;
  line-height: 1.8;
}

.primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 12px 15px;
  color: white;
  background: #227b4e;
  border: 0;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 750;
  white-space: nowrap;
}

.primary-button:hover {
  background: #155d39;
}

.hero-banner {
  min-height: 295px;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 35px 40px;
  color: white;
  background: linear-gradient(112deg, #123b2b, #1d7048 72%, #278458);
  border-radius: 17px;
}

.hero-content {
  max-width: 530px;
  position: relative;
  z-index: 2;
}

.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 10px;
  color: #d3f8df;
  background: #ffffff12;
  border: 1px solid #ffffff26;
  border-radius: 6px;
  font-size: 9px;
  font-weight: 750;
  letter-spacing: 0.9px;
}

.hero-content h2 {
  margin: 18px 0 11px;
  font-size: clamp(29px, 3vw, 39px);
  font-weight: 800;
  letter-spacing: -1.1px;
  line-height: 1.13;
}

.hero-content p {
  max-width: 450px;
  margin: 0;
  color: #d5e9dc;
  font-size: 12px;
  line-height: 1.8;
}

.hero-content > button {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-top: 19px;
  padding: 12px 15px;
  color: #17472f;
  background: #e5f5e9;
  border: 0;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
}

.hero-graphic {
  width: 300px;
  height: 290px;
  position: absolute;
  top: 0;
  right: 6%;
}

.graphic-circle {
  position: absolute;
  border: 1px solid #ffffff1c;
  border-radius: 50%;
}

.circle-one {
  width: 260px;
  height: 260px;
  top: 15px;
  right: 4px;
}

.circle-two {
  width: 205px;
  height: 205px;
  top: 43px;
  right: 31px;
}

.graphic-card {
  width: 180px;
  position: absolute;
  top: 52px;
  right: 45px;
  padding: 21px;
  color: #234633;
  background: #f7fcf8;
  border: 1px solid #ffffff90;
  border-radius: 15px;
  box-shadow: 0 18px 40px #061e1235;
  transform: rotate(4deg);
}

.graphic-icon {
  width: 43px;
  height: 43px;
  display: grid;
  place-items: center;
  color: #258152;
  background: #e3f4e8;
  border-radius: 11px;
}

.graphic-card > span {
  display: block;
  margin-top: 17px;
  color: #7c9584;
  font-size: 7px;
  font-weight: 800;
  letter-spacing: 1px;
}

.graphic-card > strong {
  display: block;
  margin-top: 7px;
  font-size: 20px;
  line-height: 1.1;
}

.graphic-lines {
  display: grid;
  gap: 5px;
  margin-top: 14px;
}

.graphic-lines i {
  height: 4px;
  background: #dbe9de;
  border-radius: 4px;
}

.graphic-lines i:nth-child(2) {
  width: 80%;
}

.graphic-lines i:nth-child(3) {
  width: 57%;
}

.floating-icon {
  width: 45px;
  height: 45px;
  position: absolute;
  z-index: 3;
  display: grid;
  place-items: center;
  color: #236b45;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px #082b1a33;
}

.floating-book {
  top: 32px;
  right: 195px;
  transform: rotate(-9deg);
}

.floating-chart {
  right: 7px;
  bottom: 39px;
  transform: rotate(7deg);
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 15px;
  margin: 22px 0 36px;
}

.stat-card {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 18px 15px;
  background: white;
  border: 1px solid #e9efeb;
  border-radius: 12px;
}

.stat-icon {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 12px;
}

.stat-icon.green {
  color: #248352;
  background: #e4f5e9;
}

.stat-icon.blue {
  color: #3474b9;
  background: #e9f2fc;
}

.stat-icon.orange {
  color: #b97926;
  background: #fff2de;
}

.stat-icon.purple {
  color: #8254b6;
  background: #f1eaff;
}

.stat-card span {
  display: block;
  color: #829087;
  font-size: 10px;
}

.stat-card h3 {
  margin: 5px 0 4px;
  color: #234432;
  font-size: 24px;
  line-height: 1;
}

.stat-card small {
  color: #9aa59e;
  font-size: 9px;
}

.topics-section,
.library-section {
  margin-bottom: 37px;
  scroll-margin-top: 95px;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 20px;
}

.section-kicker {
  color: #32895a;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

.section-heading h2 {
  margin: 7px 0 6px;
  color: #1c3b2b;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.section-heading p {
  margin: 0;
  color: #86938b;
  font-size: 11px;
}

.topics-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 13px;
}

.topic-card {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 17px 14px;
  text-align: left;
  background: white;
  border: 1px solid #e6ede8;
  border-radius: 12px;
  transition: 0.2s;
}

.topic-card:hover,
.topic-card.topic-selected {
  border-color: #9bcbae;
  box-shadow: 0 5px 16px #1e75430c;
  transform: translateY(-2px);
}

.topic-card.topic-selected {
  background: #f1f9f3;
}

.topic-icon {
  width: 43px;
  height: 43px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 11px;
}

.topic-icon.green {
  color: #258152;
  background: #e4f5e9;
}

.topic-icon.blue {
  color: #3474b9;
  background: #e9f2fc;
}

.topic-icon.orange {
  color: #b97926;
  background: #fff2de;
}

.topic-icon.purple {
  color: #8254b6;
  background: #f1eaff;
}

.topic-icon.red {
  color: #c45b5b;
  background: #ffebeb;
}

.topic-icon.teal {
  color: #16877f;
  background: #e0f6f3;
}

.topic-text {
  min-width: 0;
  flex: 1;
}

.topic-text h3 {
  margin: 0 0 6px;
  color: #274633;
  font-size: 12px;
}

.topic-text p {
  margin: 0;
  color: #8b9890;
  font-size: 9px;
  line-height: 1.5;
}

.topic-arrow {
  flex-shrink: 0;
  color: #91a196;
}

.library-heading {
  margin-bottom: 21px;
}

.export-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 13px;
  color: #2c7149;
  background: white;
  border: 1px solid #dce8df;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 750;
  white-space: nowrap;
}

.export-button:hover {
  background: #eef7f0;
}

.library-toolbar {
  display: flex;
  gap: 11px;
  margin-bottom: 16px;
}

.library-search {
  min-width: 150px;
  height: 40px;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 12px;
  color: #829087;
  background: white;
  border: 1px solid #e4ebe6;
  border-radius: 8px;
}

.library-search input {
  width: 100%;
  min-width: 0;
  color: #2b4635;
  background: transparent;
  border: 0;
  outline: 0;
  font-size: 11px;
}

.library-toolbar select {
  max-width: 150px;
  height: 40px;
  padding: 0 11px;
  color: #617468;
  background: white;
  border: 1px solid #e4ebe6;
  border-radius: 8px;
  outline: 0;
  font-size: 10px;
}

.table-container {
  overflow-x: auto;
  background: white;
  border: 1px solid #e6ede8;
  border-radius: 12px;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

thead {
  background: #f8faf8;
}

th {
  padding: 14px 16px;
  color: #8b9990;
  border-bottom: 1px solid #e8eee9;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.7px;
  white-space: nowrap;
}

td {
  padding: 15px 16px;
  color: #66786c;
  border-bottom: 1px solid #edf1ee;
  font-size: 10px;
  white-space: nowrap;
}

tbody tr:last-child td {
  border-bottom: 0;
}

tbody tr:hover:not(:last-child) {
  background: #fbfdfb;
}

.research-title-cell {
  min-width: 260px;
  display: flex;
  align-items: center;
  gap: 11px;
}

.document-icon {
  width: 39px;
  height: 39px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  color: #318154;
  background: #eaf5ed;
  border-radius: 9px;
}

.research-title-cell > div:last-child {
  display: grid;
  gap: 5px;
}

.research-title-cell strong {
  max-width: 290px;
  overflow: hidden;
  color: #294a35;
  font-size: 11px;
  text-overflow: ellipsis;
}

.research-title-cell span {
  max-width: 300px;
  overflow: hidden;
  color: #929e95;
  font-size: 9px;
  text-overflow: ellipsis;
}

.category-label {
  padding: 6px 8px;
  color: #477258;
  background: #edf6ef;
  border-radius: 5px;
  font-size: 9px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 9px;
  border-radius: 6px;
  font-size: 9px;
  font-weight: 700;
}

.status-pill > span {
  width: 6px;
  height: 6px;
  background: currentColor;
  border-radius: 50%;
}

.status-pill.published {
  color: #278052;
  background: #e8f6ec;
}

.status-pill.in-progress {
  color: #a66c20;
  background: #fff3df;
}

.status-pill.draft {
  color: #7c6bb2;
  background: #f1edfc;
}

.view-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  color: #277b4d;
  background: #edf7f0;
  border: 0;
  border-radius: 7px;
  font-size: 10px;
  font-weight: 750;
}

.view-button:hover {
  background: #dff0e4;
}

.empty-cell {
  padding: 40px 15px;
  color: #8c9a90;
  text-align: center;
}

.empty-cell svg,
.empty-cell strong,
.empty-cell span {
  display: block;
  margin: 8px auto;
}

.empty-cell strong {
  color: #31513d;
}

.empty-cell button {
  padding: 8px 12px;
  color: white;
  background: #227b4e;
  border: 0;
  border-radius: 7px;
}

.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 4px 0;
  color: #8c9991;
  font-size: 10px;
}

.table-footer button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #477458;
  background: transparent;
  border: 0;
  font-size: 10px;
}

.research-cta {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px;
  background: linear-gradient(100deg, #e9f5ec, #f6faf7);
  border: 1px solid #dcecdf;
  border-radius: 13px;
}

.cta-icon {
  width: 49px;
  height: 49px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  color: #277e4f;
  background: white;
  border: 1px solid #e0ece2;
  border-radius: 12px;
}

.research-cta > div:nth-child(2) {
  flex: 1;
}

.research-cta h3 {
  margin: 0 0 6px;
  color: #214732;
  font-size: 13px;
}

.research-cta p {
  margin: 0;
  color: #718579;
  font-size: 10px;
  line-height: 1.7;
}

.research-cta > a {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 11px 13px;
  color: white;
  background: #227b4e;
  border-radius: 8px;
  text-decoration: none;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
}

.page-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
  padding: 18px 0 4px;
  border-top: 1px solid #e4ebe6;
}

.page-footer p,
.page-footer > div {
  margin: 0;
  color: #94a097;
  font-size: 9px;
}

.page-footer > div {
  display: flex;
  gap: 8px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: grid;
  place-items: center;
  overflow-y: auto;
  padding: 24px;
  background: #0b2119b8;
  backdrop-filter: blur(5px);
}

.research-modal {
  width: min(100%, 540px);
  position: relative;
  padding: 30px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 80px #071a103d;
}

.modal-close {
  width: 36px;
  height: 36px;
  position: absolute;
  top: 13px;
  right: 13px;
  display: grid;
  place-items: center;
  color: #294736;
  background: #f1f6f2;
  border: 0;
  border-radius: 50%;
}

.modal-document-icon {
  width: 50px;
  height: 50px;
  display: grid;
  place-items: center;
  margin-bottom: 18px;
  color: #258152;
  background: #e5f4e9;
  border-radius: 12px;
}

.research-modal h2 {
  margin: 9px 0 12px;
  color: #1e412e;
  font-size: 23px;
  line-height: 1.35;
}

.research-modal > p {
  color: #77867c;
  font-size: 12px;
  line-height: 1.8;
}

.detail-list {
  margin-top: 20px;
  border-top: 1px solid #e7eee8;
}

.detail-list > div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #e7eee8;
  font-size: 11px;
}

.detail-list span {
  color: #89978e;
}

.detail-list strong {
  color: #31513d;
  text-align: right;
}

.research-modal .demo-notice {
  padding: 12px;
  color: #87652b;
  background: #fff7e9;
  border-radius: 7px;
  font-size: 10px;
}

.modal-done {
  margin-top: 10px;
}

.guidelines-modal ul {
  padding-left: 20px;
  color: #65776a;
  font-size: 12px;
  line-height: 2;
}

@media (min-width: 1600px) {
  .page-body {
    padding-right: 48px;
    padding-left: 48px;
  }
}

@media (max-width: 1250px) {
  .topbar {
    padding: 0 24px;
  }

  .page-body {
    padding: 29px 24px 20px;
  }

  .stats-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .topics-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hero-graphic {
    right: 1%;
    opacity: 0.8;
  }
}

@media (max-width: 760px) {
  .sidebar {
    width: 275px;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
  }

  .close-menu {
    display: grid;
    place-items: center;
    margin-left: auto;
    color: #d5e6dc;
    background: transparent;
    border: 0;
  }

  .mobile-overlay {
    position: fixed;
    inset: 0;
    z-index: 90;
    background: #081c12a6;
  }

  .main-content {
    margin-left: 0;
  }

  .topbar {
    height: 66px;
    gap: 12px;
    padding: 0 16px;
  }

  .menu-toggle {
    width: 36px;
    height: 36px;
    display: grid;
    flex-shrink: 0;
    place-items: center;
    color: #28563c;
    background: #f1f7f2;
    border: 1px solid #e2ece4;
    border-radius: 9px;
  }

  .breadcrumb {
    flex: 1;
    gap: 5px;
    font-size: 10px;
  }

  .topbar-right {
    gap: 8px;
  }

  .topbar-right > .search-box {
    width: 36px;
    padding: 0 9px;
  }

  .topbar-right > .search-box input {
    display: none;
  }

  .profile-text,
  .profile > svg {
    display: none;
  }

  .profile-avatar {
    width: 34px;
    height: 34px;
  }

  .page-body {
    padding: 25px 16px 20px;
  }

  .page-heading {
    align-items: flex-start;
    margin-bottom: 20px;
  }

  .page-heading h1 {
    font-size: 28px;
  }

  .page-heading p {
    font-size: 11px;
  }

  .page-heading > button {
    padding: 10px;
    font-size: 0;
  }

  .page-heading > button svg {
    width: 18px;
    height: 18px;
  }

  .hero-banner {
    min-height: 290px;
    padding: 25px 22px;
  }

  .hero-content {
    max-width: 100%;
  }

  .hero-content h2 {
    font-size: 29px;
  }

  .hero-content p {
    max-width: 390px;
    font-size: 11px;
  }

  .hero-graphic {
    right: -130px;
    opacity: 0.2;
  }

  .stats-row {
    gap: 10px;
    margin: 16px 0 30px;
  }

  .stat-card {
    padding: 13px 11px;
    gap: 9px;
  }

  .stat-icon {
    width: 38px;
    height: 38px;
  }

  .stat-card span {
    font-size: 9px;
  }

  .stat-card h3 {
    font-size: 21px;
  }

  .topics-grid {
    gap: 10px;
  }

  .topic-card {
    padding: 13px 10px;
    gap: 9px;
  }

  .topic-icon {
    width: 37px;
    height: 37px;
  }

  .topic-text h3 {
    font-size: 11px;
  }

  .topic-text p {
    font-size: 9px;
  }

  .library-toolbar {
    flex-wrap: wrap;
  }

  .library-search {
    flex-basis: 100%;
  }

  .library-toolbar select {
    flex: 1;
    max-width: none;
  }

  .table-container table {
    min-width: 750px;
  }

  .research-cta {
    align-items: flex-start;
    flex-wrap: wrap;
    padding: 17px;
  }

  .research-cta > div:nth-child(2) {
    min-width: 0;
  }

  .research-cta > a {
    width: 100%;
    justify-content: center;
  }

  .page-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 420px) {
  .breadcrumb span,
  .breadcrumb > svg {
    display: none;
  }

  .topbar {
    gap: 8px;
    padding: 0 10px;
  }

  .page-body {
    padding-right: 12px;
    padding-left: 12px;
  }

  .page-heading h1 {
    font-size: 25px;
  }

  .hero-banner {
    min-height: 305px;
  }

  .hero-content h2 {
    font-size: 26px;
  }

  .stats-row {
    grid-template-columns: 1fr;
  }

  .topics-grid {
    grid-template-columns: 1fr;
  }

  .section-heading h2 {
    font-size: 19px;
  }

  .library-heading {
    align-items: flex-start;
  }

  .export-button {
    padding: 9px;
    font-size: 0;
  }

  .export-button svg {
    width: 17px;
    height: 17px;
  }

  .modal-backdrop {
    padding: 12px;
  }

  .research-modal {
    padding: 23px;
  }

  .table-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>

// contact page


<template>
  <div class="contact-page">
    <aside class="sidebar" :class="{ 'sidebar-open': menuOpen }">
      <div class="brand">
        <div class="brand-logo">
          <Landmark :size="26" />
        </div>
        <div>
          <h2>Kitabi Sector</h2>
          <p>Digital Portfolio</p>
        </div>
        <button class="close-menu" @click="menuOpen = false">
          <X :size="21" />
        </button>
      </div>

      <div class="menu-label">MAIN MENU</div>

      <nav class="navigation">
        <router-link to="/dashboard" class="nav-link">
          <LayoutDashboard :size="19" />
          <span>Dashboard</span>
        </router-link>
        <router-link to="/" class="nav-link">
          <House :size="19" />
          <span>Home</span>
        </router-link>
        <router-link to="/about" class="nav-link">
          <Info :size="19" />
          <span>About Us</span>
        </router-link>
        <router-link to="/administration" class="nav-link">
          <UsersRound :size="19" />
          <span>Administration</span>
        </router-link>
        <router-link to="/services" class="nav-link">
          <BriefcaseBusiness :size="19" />
          <span>Services</span>
        </router-link>
        <router-link to="/media" class="nav-link">
          <Images :size="19" />
          <span>Media Center</span>
        </router-link>
        <router-link to="/research" class="nav-link">
          <Microscope :size="19" />
          <span>Research</span>
        </router-link>
        <router-link to="/contact" class="nav-link active">
          <Headset :size="19" />
          <span>Contact Us</span>
        </router-link>
      </nav>

      <div class="sidebar-bottom">
        <div class="help-card">
          <div class="help-icon"><MessageCircle :size="20" /></div>
          <h3>We're here to help</h3>
          <p>Have questions? Reach out to the appropriate sector administration.</p>
          <a href="https://www.nyamagabe.gov.rw/" target="_blank" rel="noopener noreferrer">
            Official resources <ArrowUpRight :size="15" />
          </a>
        </div>
        <div class="sidebar-footer">
          <ShieldCheck :size="17" />
          <span>Service · Trust · Community</span>
        </div>
      </div>
    </aside>

    <div v-if="menuOpen" class="mobile-overlay" @click="menuOpen = false"></div>

    <main class="main-content">
      <header class="topbar">
        <button class="menu-toggle" @click="menuOpen = !menuOpen">
          <Menu :size="22" />
        </button>

        <div class="breadcrumb">
          <span>Pages</span>
          <ChevronRight :size="15" />
          <strong>Contact Us</strong>
        </div>

        <div class="topbar-right">
          <div class="search-box">
            <Search :size="18" />
            <input v-model="searchQuery" placeholder="Search contact options..." />
          </div>
          <button class="icon-button" aria-label="Notifications" @click="showNotifications = !showNotifications">
            <Bell :size="19" />
            <span class="notification-dot"></span>
          </button>
          <div class="profile">
            <div class="profile-avatar">KS</div>
            <div class="profile-text">
              <strong>Kitabi Sector</strong>
              <span>Public Portal</span>
            </div>
            <ChevronDown :size="16" />
          </div>
        </div>
      </header>

      <div v-if="showNotifications" class="notification-panel">
        <strong>Notifications</strong>
        <p>You are viewing the Contact Center.</p>
        <p>New messages will appear here when notifications are connected.</p>
        <button @click="showNotifications = false">Close</button>
      </div>

      <section class="page-body">
        <div class="page-heading">
          <div>
            <div class="eyebrow"><Headset :size="15" /> WE ARE READY TO HELP</div>
            <h1>Contact Us</h1>
            <p>
              Get in touch with us for information, assistance, or questions
              about services and development in Kitabi Sector.
            </p>
          </div>
          <div class="availability">
            <span class="availability-dot"></span>
            Public information portal
          </div>
        </div>

        <section class="contact-hero">
          <div class="hero-content">
            <span class="hero-tag"><MessageCircle :size="15" /> LET'S CONNECT</span>
            <h2>Your voice matters.<br />We're listening.</h2>
            <p>
              We value your questions, feedback, and ideas.
              Connect with the appropriate office for guidance and support.
            </p>
            <button @click="scrollToForm">
              Send us a message <ArrowRight :size="17" />
            </button>
          </div>
          <div class="hero-art">
            <div class="art-ring ring-one"></div>
            <div class="art-ring ring-two"></div>
            <div class="art-card">
              <div class="art-card-icon"><Mail :size="28" /></div>
              <span>COMMUNITY SUPPORT</span>
              <h3>We're here<br />to listen.</h3>
              <div class="art-lines"><i></i><i></i><i></i></div>
            </div>
            <div class="art-floating floating-message"><MessageCircle :size="22" /></div>
            <div class="art-floating floating-phone"><Phone :size="22" /></div>
          </div>
        </section>

        <section class="contact-methods">
          <article
            v-for="method in filteredMethods"
            :key="method.title"
            class="method-card"
          >
            <div class="method-icon" :class="method.color">
              <component :is="method.icon" :size="23" />
            </div>
            <h3>{{ method.title }}</h3>
            <p>{{ method.description }}</p>
            <a
              v-if="method.link"
              :href="method.link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ method.action }} <ArrowUpRight :size="15" />
            </a>
            <button v-else @click="scrollToForm">
              {{ method.action }} <ArrowRight :size="15" />
            </button>
          </article>
          <div v-if="filteredMethods.length === 0" class="no-methods">
            No contact options match your search.
          </div>
        </section>

        <section class="contact-layout">
          <div ref="formSection" class="form-panel">
            <div class="section-heading">
              <span class="section-kicker">SEND AN ENQUIRY</span>
              <h2>How can we help you?</h2>
              <p>Complete the form below to prepare your message.</p>
            </div>

            <div v-if="formSuccess" class="success-message">
              <CheckCircle2 :size="23" />
              <div>
                <strong>Message prepared successfully</strong>
                <p>Your message has been prepared. This demo does not send it to a server.</p>
              </div>
              <button @click="formSuccess = false" aria-label="Dismiss"><X :size="17" /></button>
            </div>

            <form @submit.prevent="submitForm">
              <div class="form-row">
                <div class="form-group">
                  <label for="fullName">Full name <span>*</span></label>
                  <input
                    id="fullName"
                    v-model.trim="form.fullName"
                    required
                    maxlength="100"
                    placeholder="Enter your full name"
                  />
                </div>
                <div class="form-group">
                  <label for="email">Email address <span>*</span></label>
                  <input
                    id="email"
                    v-model.trim="form.email"
                    type="email"
                    required
                    maxlength="254"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="phone">Phone number</label>
                  <input
                    id="phone"
                    v-model.trim="form.phone"
                    type="tel"
                    maxlength="30"
                    placeholder="Optional phone number"
                  />
                </div>
                <div class="form-group">
                  <label for="subject">Subject <span>*</span></label>
                  <select id="subject" v-model="form.subject" required>
                    <option value="" disabled>Select a subject</option>
                    <option>General Information</option>
                    <option>Public Services</option>
                    <option>Community Development</option>
                    <option>Research and Information</option>
                    <option>Feedback or Suggestion</option>
                    <option>Other Enquiry</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="message">Your message <span>*</span></label>
                <textarea
                  id="message"
                  v-model.trim="form.message"
                  required
                  minlength="10"
                  maxlength="3000"
                  rows="5"
                  placeholder="Tell us how we can assist you..."
                ></textarea>
                <div class="character-count">{{ form.message.length }}/3000 characters</div>
              </div>

              <label class="privacy-check">
                <input v-model="form.consent" type="checkbox" required />
                <span>I confirm that the information provided is accurate and may be used to respond to my enquiry.</span>
              </label>

              <button class="submit-button" type="submit">
                <Send :size="17" /> Prepare message <ArrowRight :size="17" />
              </button>
              <p class="form-note">
                <LockKeyhole :size="14" />
                Please do not include passwords or sensitive personal information.
              </p>
            </form>
          </div>

          <aside class="contact-aside">
            <div class="office-card">
              <div class="office-top">
                <div class="office-icon"><Landmark :size="25" /></div>
                <span class="office-label">PUBLIC INFORMATION</span>
              </div>
              <h3>Kitabi Sector</h3>
              <p>
                For official enquiries, consult the relevant local administration
                or the Nyamagabe District official website.
              </p>
              <div class="office-detail">
                <MapPin :size="18" />
                <div>
                  <strong>Location</strong>
                  <span>Kitabi Sector, Nyamagabe District, Rwanda</span>
                </div>
              </div>
              <div class="office-detail">
                <Globe :size="18" />
                <div>
                  <strong>Official website</strong>
                  <a href="https://www.nyamagabe.gov.rw/" target="_blank" rel="noopener noreferrer">
                    nyamagabe.gov.rw
                  </a>
                </div>
              </div>
              <a
                class="website-button"
                href="https://www.nyamagabe.gov.rw/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit official website <ArrowUpRight :size="16" />
              </a>
            </div>

            <div class="guidance-card">
              <div class="guidance-icon"><Lightbulb :size="21" /></div>
              <h3>Before contacting us</h3>
              <p>Help us direct your enquiry by providing:</p>
              <ul>
                <li><Check :size="15" /> A clear subject</li>
                <li><Check :size="15" /> A brief explanation</li>
                <li><Check :size="15" /> Accurate contact details</li>
              </ul>
            </div>

            <div class="emergency-note">
              <ShieldAlert :size="20" />
              <div>
                <strong>Urgent assistance?</strong>
                <p>For emergencies, contact the appropriate local emergency services directly.</p>
              </div>
            </div>
          </aside>
        </section>

        <section class="faq-section">
          <div class="section-heading">
            <span class="section-kicker">QUICK ANSWERS</span>
            <h2>Frequently Asked Questions</h2>
            <p>Find helpful information before sending an enquiry.</p>
          </div>

          <div class="faq-list">
            <article
              v-for="(faq, index) in faqs"
              :key="faq.question"
              class="faq-item"
              :class="{ 'faq-open': openFaq === index }"
            >
              <button @click="openFaq = openFaq === index ? null : index">
                <span>{{ faq.question }}</span>
                <Plus :size="19" />
              </button>
              <div v-if="openFaq === index" class="faq-answer">
                {{ faq.answer }}
              </div>
            </article>
          </div>
        </section>

        <footer class="page-footer">
          <p>© {{ new Date().getFullYear() }} Kitabi Sector Digital Portfolio</p>
          <div>Service <span>•</span> Transparency <span>•</span> Community</div>
        </footer>
      </section>
    </main>
  </div>
</template>

<script>
import {
  Landmark,
  LayoutDashboard,
  House,
  Info,
  UsersRound,
  BriefcaseBusiness,
  Images,
  Microscope,
  Headset,
  MessageCircle,
  ArrowUpRight,
  ShieldCheck,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Mail,
  Phone,
  Globe,
  MapPin,
  ArrowRight,
  Send,
  LockKeyhole,
  Lightbulb,
  Check,
  CheckCircle2,
  ShieldAlert,
  Plus
} from "lucide-vue-next";

export default {
  name: "ContactView",
  components: {
    Landmark,
    LayoutDashboard,
    House,
    Info,
    UsersRound,
    BriefcaseBusiness,
    Images,
    Microscope,
    Headset,
    MessageCircle,
    ArrowUpRight,
    ShieldCheck,
    Search,
    Bell,
    ChevronDown,
    ChevronRight,
    Menu,
    X,
    Mail,
    Phone,
    Globe,
    MapPin,
    ArrowRight,
    Send,
    LockKeyhole,
    Lightbulb,
    Check,
    CheckCircle2,
    ShieldAlert,
    Plus
  },
  data() {
    return {
      menuOpen: false,
      searchQuery: "",
      showNotifications: false,
      formSuccess: false,
      openFaq: null,
      form: {
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        consent: false
      },
      methods: [
        {
          title: "Email Enquiries",
          description: "Find official contact information through the district website.",
          action: "Visit website",
          icon: Mail,
          color: "green",
          link: "https://www.nyamagabe.gov.rw/"
        },
        {
          title: "Official Website",
          description: "Access official district information, announcements, and resources.",
          action: "Explore website",
          icon: Globe,
          color: "blue",
          link: "https://www.nyamagabe.gov.rw/"
        },
        {
          title: "General Enquiries",
          description: "Prepare a message for a question, suggestion, or service enquiry.",
          action: "Write a message",
          icon: MessageCircle,
          color: "orange",
          link: null
        }
      ],
      faqs: [
        {
          question: "How can I ask about local public services?",
          answer: "Select Public Services in the contact form and explain the service you need. Consult the official district website for verified contact details."
        },
        {
          question: "How can I share a suggestion about community development?",
          answer: "Choose Feedback or Suggestion and describe your idea clearly. The form on this demonstration page does not send submissions to the administration."
        },
        {
          question: "How do I find official contact information?",
          answer: "Visit the Nyamagabe District official website at nyamagabe.gov.rw to look for current public contact information."
        },
        {
          question: "Will I receive a response after submitting this form?",
          answer: "Not yet. This frontend demonstration validates your entries and displays a confirmation, but sending and receiving messages requires a backend or a connected email service."
        }
      ]
    };
  },
  computed: {
    filteredMethods() {
      const query = this.searchQuery.trim().toLowerCase();

      if (!query) return this.methods;

      return this.methods.filter(method =>
        `${method.title} ${method.description} ${method.action}`
          .toLowerCase()
          .includes(query)
      );
    }
  },
  methods: {
    scrollToForm() {
      this.$refs.formSection?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    },
    submitForm() {
      this.formSuccess = true;

      const subject = encodeURIComponent(this.form.subject);
      const body = encodeURIComponent(
        `Name: ${this.form.fullName}\nEmail: ${this.form.email}\nPhone: ${this.form.phone || "Not provided"}\n\nMessage:\n${this.form.message}`
      );

      this.$nextTick(() => {
        const successMessage = document.querySelector(".success-message");
        successMessage?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      });

      this.preparedMessage = { subject, body };
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.contact-page {
  min-height: 100vh;
  background: #f5f7f6;
  color: #1c3326;
  font-family: Inter, "Segoe UI", Arial, sans-serif;
}

button,
input,
textarea,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

.sidebar {
  width: 260px;
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  padding: 27px 18px 18px;
  color: #e8f4ec;
  background: linear-gradient(165deg, #102e25, #164634 55%, #102b23);
  overflow-y: auto;
}

.brand {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 0 5px 32px;
}

.brand-logo {
  width: 44px;
  height: 44px;
  display: grid;
  flex-shrink: 0;
  place-items: center;
  color: white;
  background: #279b65;
  border-radius: 13px;
}

.brand h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 750;
}

.brand p {
  margin: 5px 0 0;
  color: #a9c7b8;
  font-size: 11px;
}

.close-menu,
.menu-toggle {
  display: none;
}

.menu-label {
  padding: 0 12px;
  margin-bottom: 12px;
  color: #8aaf9d;
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 1.5px;
}

.navigation {
  display: grid;
  gap: 7px;
}

.nav-link {
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 0 13px;
  color: #bfd6ca;
  border-radius: 9px;
  text-decoration: none;
  font-size: 12px;
  font-weight: 550;
  transition: 0.2s;
}

.nav-link:hover {
  color: white;
  background: #ffffff12;
}

.nav-link.active {
  color: white;
  background: #249b64;
  box-shadow: 0 5px 15px #071d1540;
}

.sidebar-bottom {
  margin-top: auto;
  padding-top: 26px;
}

.help-card {
  padding: 16px;
  background: #ffffff0b;
  border: 1px solid #ffffff16;
  border-radius: 13px;
}

.help-icon {
  width: 35px;
  height: 35px;
  display: grid;
  place-items: center;
  color: #a2efc3;
  background: #ffffff12;
  border-radius: 10px;
}

.help-card h3 {
  margin: 12px 0 7px;
  font-size: 13px;
}

.help-card p {
  margin: 0;
  color: #a9c7b8;
  font-size: 11px;
  line-height: 1.7;
}

.help-card a {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  color: #a5f0c2;
  text-decoration: none;
  font-size: 11px;
  font-weight: 700;
}

.sidebar-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
  color: #91b3a1;
  font-size: 9px;
}

.main-content {
  min-height: 100vh;
  margin-left: 260px;
}

.topbar {
  height: 76px;
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 0 36px;
  background: #ffffffed;
  border-bottom: 1px solid #e9eeeb;
  backdrop-filter: blur(14px);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #8b9991;
  font-size: 12px;
}

.breadcrumb strong {
  color: #244b39;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.search-box {
  width: 220px;
  height: 39px;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 11px;
  color: #8b9991;
  background: #f6f8f7;
  border: 1px solid #e9eeeb;
  border-radius: 9px;
}

.search-box input {
  width: 100%;
  min-width: 0;
  color: #244b39;
  background: transparent;
  border: 0;
  outline: 0;
  font-size: 11px;
}

.icon-button {
  width: 38px;
  height: 38px;
  position: relative;
  display: grid;
  place-items: center;
  color: #607168;
  background: white;
  border: 1px solid #e8eeea;
  border-radius: 10px;
}

.notification-dot {
  width: 7px;
  height: 7px;
  position: absolute;
  top: 7px;
  right: 7px;
  background: #e39c43;
  border: 1px solid white;
  border-radius: 50%;
}

.profile {
  display: flex;
  align-items: center;
  gap: 9px;
}

.profile-avatar {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  color: #1c7249;
  background: #e0f3e8;
  border-radius: 11px;
  font-size: 11px;
  font-weight: 800;
}

.profile-text {
  display: grid;
  gap: 4px;
}

.profile-text strong {
  color: #263d31;
  font-size: 11px;
}

.profile-text span {
  color: #8a9990;
  font-size: 10px;
}

.profile > svg {
  color: #839188;
}

.notification-panel {
  width: 280px;
  position: fixed;
  top: 67px;
  right: 30px;
  z-index: 150;
  padding: 19px;
  background: white;
  border: 1px solid #e4ebe6;
  border-radius: 13px;
  box-shadow: 0 12px 40px #193c281c;
  font-size: 12px;
}

.notification-panel p {
  color: #75837a;
  line-height: 1.6;
}

.notification-panel button {
  padding: 8px 13px;
  color: white;
  background: #20794d;
  border: 0;
  border-radius: 7px;
}

.page-body {
  max-width: 1600px;
  margin: 0 auto;
  padding: 34px 36px 22px;
}

.page-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 26px;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #278558;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.3px;
}

.page-heading h1 {
  margin: 11px 0 8px;
  color: #193a2a;
  font-size: clamp(27px, 3vw, 35px);
  font-weight: 800;
  letter-spacing: -1px;
}

.page-heading p {
  max-width: 590px;
  margin: 0;
  color: #7c8981;
  font-size: 12px;
  line-height: 1.8;
}

.availability {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  color: #477258;
  background: white;
  border: 1px solid #e2ebe4;
  border-radius: 9px;
  font-size: 10px;
  white-space: nowrap;
}

.availability-dot {
  width: 7px;
  height: 7px;
  background: #31a36a;
  border-radius: 50%;
}

.contact-hero {
  min-height: 310px;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 35px 40px;
  color: white;
  background: linear-gradient(112deg, #123b2b, #1d7048 72%, #278458);
  border-radius: 17px;
}

.hero-content {
  max-width: 550px;
  position: relative;
  z-index: 2;
}

.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 10px;
  color: #d3f8df;
  background: #ffffff12;
  border: 1px solid #ffffff26;
  border-radius: 6px;
  font-size: 9px;
  font-weight: 750;
  letter-spacing: 1px;
}

.hero-content h2 {
  margin: 18px 0 11px;
  font-size: clamp(29px, 3vw, 39px);
  font-weight: 800;
  letter-spacing: -1.1px;
  line-height: 1.13;
}

.hero-content p {
  max-width: 445px;
  margin: 0;
  color: #d5e9dc;
  font-size: 12px;
  line-height: 1.8;
}

.hero-content > button {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-top: 19px;
  padding: 12px 15px;
  color: #17472f;
  background: #e5f5e9;
  border: 0;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
}

.hero-art {
  width: 300px;
  height: 290px;
  position: absolute;
  top: 10px;
  right: 5%;
}

.art-ring {
  position: absolute;
  border: 1px solid #ffffff1c;
  border-radius: 50%;
}

.ring-one {
  width: 260px;
  height: 260px;
  top: 15px;
  right: 4px;
}

.ring-two {
  width: 205px;
  height: 205px;
  top: 43px;
  right: 31px;
}

.art-card {
  width: 185px;
  position: absolute;
  top: 52px;
  right: 45px;
  padding: 21px;
  color: #234633;
  background: #f7fcf8;
  border: 1px solid #ffffff90;
  border-radius: 15px;
  box-shadow: 0 18px 40px #061e1235;
  transform: rotate(4deg);
}

.art-card-icon {
  width: 43px;
  height: 43px;
  display: grid;
  place-items: center;
  color: #258152;
  background: #e3f4e8;
  border-radius: 11px;
}

.art-card > span {
  display: block;
  margin-top: 17px;
  color: #7c9584;
  font-size: 7px;
  font-weight: 800;
  letter-spacing: 0.8px;
}

.art-card h3 {
  margin: 7px 0 0;
  font-size: 21px;
  line-height: 1.1;
}

.art-lines {
  display: grid;
  gap: 5px;
  margin-top: 14px;
}

.art-lines i {
  height: 4px;
  background: #dbe9de;
  border-radius: 4px;
}

.art-lines i:nth-child(2) {
  width: 80%;
}

.art-lines i:nth-child(3) {
  width: 57%;
}

.art-floating {
  width: 45px;
  height: 45px;
  position: absolute;
  z-index: 3;
  display: grid;
  place-items: center;
  color: #236b45;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px #082b1a33;
}

.floating-message {
  top: 32px;
  right: 195px;
  transform: rotate(-9deg);
}

.floating-phone {
  right: 7px;
  bottom: 39px;
  transform: rotate(7deg);
}

.contact-methods {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin: 23px 0 37px;
}

.method-card {
  min-width: 0;
  padding: 22px;
  background: white;
  border: 1px solid #e6ede8;
  border-radius: 13px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.method-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px #183d2610;
}

.method-icon {
  width: 47px;
  height: 47px;
  display: grid;
  place-items: center;
  border-radius: 12px;
}

.method-icon.green {
  color: #258152;
  background: #e4f5e9;
}

.method-icon.blue {
  color: #3474b9;
  background: #e9f2fc;
}

.method-icon.orange {
  color: #b97926;
  background: #fff2de;
}

.method-card h3 {
  margin: 16px 0 8px;
  color: #234331;
  font-size: 14px;
}

.method-card p {
  min-height: 39px;
  margin: 0;
  color: #849188;
  font-size: 11px;
  line-height: 1.8;
}

.method-card a,
.method-card > button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 17px;
  padding: 0;
  color: #2b8254;
  background: transparent;
  border: 0;
  text-decoration: none;
  font-size: 11px;
  font-weight: 750;
}

.no-methods {
  grid-column: 1 / -1;
  padding: 25px;
  color: #78877e;
  background: white;
  border-radius: 12px;
  text-align: center;
}

.contact-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(260px, 0.85fr);
  align-items: start;
  gap: 22px;
  margin-bottom: 40px;
}

.form-panel {
  min-width: 0;
  padding: 27px;
  background: white;
  border: 1px solid #e6ede8;
  border-radius: 14px;
  scroll-margin-top: 95px;
}

.section-heading {
  margin-bottom: 24px;
}

.section-kicker {
  color: #32895a;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

.section-heading h2 {
  margin: 8px 0 7px;
  color: #1c3b2b;
  font-size: 23px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.section-heading p {
  margin: 0;
  color: #86938b;
  font-size: 11px;
  line-height: 1.7;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 15px;
}

.form-group {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}

.form-group label {
  color: #385642;
  font-size: 11px;
  font-weight: 700;
}

.form-group label span {
  color: #d85d55;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  min-width: 0;
  padding: 12px;
  color: #294633;
  background: #fbfcfb;
  border: 1px solid #e1e9e3;
  border-radius: 8px;
  outline: none;
  font-size: 11px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input,
.form-group select {
  height: 42px;
}

.form-group textarea {
  min-height: 125px;
  resize: vertical;
  line-height: 1.7;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #53a878;
  box-shadow: 0 0 0 3px #2c9a5812;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #a3aea6;
}

.character-count {
  align-self: flex-end;
  margin-top: -2px;
  color: #96a199;
  font-size: 9px;
}

.privacy-check {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  margin: 1px 0 20px;
  color: #718177;
  font-size: 10px;
  line-height: 1.7;
  cursor: pointer;
}

.privacy-check input {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  margin-top: 1px;
  accent-color: #278554;
}

.submit-button {
  width: 100%;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  color: white;
  background: #227b4e;
  border: 0;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 750;
  transition: background 0.2s;
}

.submit-button:hover {
  background: #155d39;
}

.form-note {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 6px;
  margin: 13px 0 0;
  color: #93a097;
  font-size: 9px;
  line-height: 1.6;
  text-align: center;
}

.form-note svg {
  flex-shrink: 0;
}

.success-message {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  margin-bottom: 21px;
  padding: 14px;
  color: #267447;
  background: #edf8f0;
  border: 1px solid #d2ebd9;
  border-radius: 9px;
}

.success-message > div {
  flex: 1;
}

.success-message strong {
  font-size: 12px;
}

.success-message p {
  margin: 5px 0 0;
  color: #64836d;
  font-size: 10px;
  line-height: 1.7;
}

.success-message button {
  padding: 2px;
  color: #548563;
  background: transparent;
  border: 0;
}

.contact-aside {
  display: grid;
  gap: 17px;
}

.office-card {
  padding: 22px;
  background: linear-gradient(155deg, #143c2b, #1b6040);
  border-radius: 14px;
  color: white;
}

.office-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.office-icon {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  color: #c1f2d0;
  background: #ffffff14;
  border: 1px solid #ffffff20;
  border-radius: 12px;
}

.office-label {
  color: #b4d7c0;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.8px;
}

.office-card h3 {
  margin: 19px 0 8px;
  font-size: 19px;
}

.office-card > p {
  margin: 0 0 21px;
  color: #c4dfce;
  font-size: 11px;
  line-height: 1.8;
}

.office-detail {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  padding: 14px 0;
  border-top: 1px solid #ffffff20;
}

.office-detail > svg {
  flex-shrink: 0;
  color: #b5e8c7;
}

.office-detail > div {
  display: grid;
  gap: 6px;
}

.office-detail strong {
  color: #e9f6ed;
  font-size: 10px;
}

.office-detail span,
.office-detail a {
  color: #c4dfce;
  font-size: 10px;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.office-detail a {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.website-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  margin-top: 13px;
  padding: 12px;
  color: #1b5938;
  background: #e5f5e9;
  border-radius: 8px;
  text-decoration: none;
  font-size: 11px;
  font-weight: 800;
}

.guidance-card {
  padding: 21px;
  background: white;
  border: 1px solid #e6ede8;
  border-radius: 13px;
}

.guidance-icon {
  width: 39px;
  height: 39px;
  display: grid;
  place-items: center;
  color: #a87523;
  background: #fff2dc;
  border-radius: 10px;
}

.guidance-card h3 {
  margin: 14px 0 7px;
  color: #294835;
  font-size: 13px;
}

.guidance-card > p {
  margin: 0;
  color: #87948b;
  font-size: 10px;
  line-height: 1.7;
}

.guidance-card ul {
  display: grid;
  gap: 11px;
  padding: 0;
  margin: 17px 0 0;
  list-style: none;
}

.guidance-card li {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #5f7465;
  font-size: 10px;
}

.guidance-card li svg {
  color: #2e945c;
}

.emergency-note {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  padding: 15px;
  color: #a56b25;
  background: #fff7e9;
  border: 1px solid #f2e5cc;
  border-radius: 11px;
}

.emergency-note > svg {
  flex-shrink: 0;
}

.emergency-note strong {
  font-size: 11px;
}

.emergency-note p {
  margin: 6px 0 0;
  color: #92774e;
  font-size: 10px;
  line-height: 1.7;
}

.faq-section {
  max-width: 900px;
  margin: 0 auto 38px;
}

.faq-section > .section-heading {
  margin-bottom: 20px;
}

.faq-list {
  display: grid;
  gap: 9px;
}

.faq-item {
  overflow: hidden;
  background: white;
  border: 1px solid #e5ece7;
  border-radius: 10px;
}

.faq-item > button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 16px 18px;
  color: #2b4936;
  background: transparent;
  border: 0;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
}

.faq-item > button svg {
  flex-shrink: 0;
  color: #39835a;
  transition: transform 0.2s;
}

.faq-open > button svg {
  transform: rotate(45deg);
}

.faq-answer {
  padding: 0 18px 17px;
  color: #7b8a80;
  font-size: 11px;
  line-height: 1.8;
}

.page-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
  padding: 18px 0 4px;
  border-top: 1px solid #e4ebe6;
}

.page-footer p,
.page-footer > div {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: #94a097;
  font-size: 9px;
}

@media (max-width: 1250px) {
  .topbar {
    padding: 0 24px;
  }

  .page-body {
    padding: 29px 24px 20px;
  }

  .contact-layout {
    grid-template-columns: minmax(0, 1.3fr) minmax(245px, 0.8fr);
    gap: 16px;
  }

  .hero-art {
    right: 0;
    opacity: 0.75;
  }

  .hero-content {
    max-width: 65%;
  }
}

@media (max-width: 900px) {
  .contact-layout {
    grid-template-columns: 1fr;
  }

  .contact-aside {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .office-card {
    grid-row: span 2;
  }

  .hero-art {
    right: -100px;
    opacity: 0.25;
  }
}

@media (max-width: 760px) {
  .sidebar {
    width: 275px;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
  }

  .close-menu {
    display: grid;
    place-items: center;
    margin-left: auto;
    color: #d5e6dc;
    background: transparent;
    border: 0;
  }

  .mobile-overlay {
    position: fixed;
    inset: 0;
    z-index: 90;
    background: #081c12a6;
  }

  .main-content {
    margin-left: 0;
  }

  .topbar {
    height: 66px;
    gap: 12px;
    padding: 0 16px;
  }

  .menu-toggle {
    width: 36px;
    height: 36px;
    display: grid;
    flex-shrink: 0;
    place-items: center;
    color: #28563c;
    background: #f1f7f2;
    border: 1px solid #e2ece4;
    border-radius: 9px;
  }

  .breadcrumb {
    flex: 1;
    gap: 5px;
    font-size: 10px;
  }

  .topbar-right {
    gap: 8px;
  }

  .topbar-right > .search-box {
    width: 36px;
    padding: 0 9px;
  }

  .topbar-right > .search-box input {
    display: none;
  }

  .profile-text,
  .profile > svg {
    display: none;
  }

  .profile-avatar {
    width: 34px;
    height: 34px;
  }

  .page-body {
    padding: 25px 16px 20px;
  }

  .page-heading {
    align-items: flex-start;
  }

  .page-heading h1 {
    font-size: 28px;
  }

  .page-heading p {
    font-size: 11px;
  }

  .availability {
    padding: 9px;
    font-size: 0;
  }

  .contact-hero {
    min-height: 300px;
    padding: 25px 22px;
  }

  .hero-content {
    max-width: 100%;
  }

  .hero-content h2 {
    font-size: 29px;
  }

  .hero-content p {
    max-width: 380px;
    font-size: 11px;
  }

  .contact-methods {
    grid-template-columns: 1fr;
    gap: 11px;
    margin: 16px 0 30px;
  }

  .method-card {
    padding: 17px;
  }

  .method-card h3 {
    margin-top: 12px;
  }

  .method-card p {
    min-height: auto;
  }

  .form-panel {
    padding: 20px;
  }

  .contact-aside {
    grid-template-columns: 1fr;
  }

  .office-card {
    grid-row: auto;
  }

  .page-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 460px) {
  .breadcrumb span,
  .breadcrumb > svg {
    display: none;
  }

  .topbar {
    gap: 8px;
    padding: 0 10px;
  }

  .page-body {
    padding-right: 12px;
    padding-left: 12px;
  }

  .page-heading h1 {
    font-size: 25px;
  }

  .contact-hero {
    min-height: 310px;
  }

  .hero-content h2 {
    font-size: 26px;
  }

  .hero-art {
    right: -170px;
    opacity: 0.13;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .form-panel {
    padding: 17px;
  }

  .section-heading h2 {
    font-size: 20px;
  }

  .faq-item > button {
    padding: 14px;
    font-size: 10px;
  }

  .modal-backdrop {
    padding: 12px;
  }
}
</style>
