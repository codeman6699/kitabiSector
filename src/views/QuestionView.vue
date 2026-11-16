<template>
  <main class="qa-page" role="main" aria-labelledby="qa-title">

    <!-- ============ HERO ============ -->
    <header class="qa-hero">
      <div class="qa-hero-inner">
        <div class="qa-hero-copy">
          <span class="eyebrow">PASTORAL GUIDANCE</span>
          <h1 id="qa-title">Questions <span class="amp">&</span> Answers</h1>
          <p>
            Ask Pastor — find biblical guidance, clarity, and encouragement
            for the questions on your heart. Submit anonymously if you prefer.
          </p>
        </div>
        <div class="qa-hero-stat">
          <span class="stat-num">{{ questions.length }}</span>
          <span class="stat-label">Community questions</span>
        </div>
      </div>
    </header>

    <!-- ============ MAIN LAYOUT ============ -->
    <section class="qa-body">
      <div class="qa-grid">

        <!-- SIDEBAR: ASK FORM -->
        <aside class="ask-panel" aria-labelledby="ask-heading">
          <div class="ask-head">
            <div class="ask-icon">
              <PenLine :size="20" aria-hidden="true" />
            </div>
            <div>
              <h2 id="ask-heading">Ask a Question</h2>
              <p>Your name is optional — questions may be submitted anonymously.</p>
            </div>
          </div>

          <form @submit.prevent="submitQuestion" novalidate>
            <div class="field">
              <label for="fname">
                Your Name <span class="optional">(optional)</span>
              </label>
              <input
                id="fname"
                v-model="form.name"
                type="text"
                maxlength="40"
                placeholder="e.g. Grace"
              >
            </div>

            <div class="field">
              <label for="category">Category</label>
              <select id="category" v-model="form.category" required>
                <option value="" disabled>Select a category</option>
                <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
              </select>
              <span v-if="errors.category" class="field-error">{{ errors.category }}</span>
            </div>

            <div class="field">
              <label for="question">
                Your Question
                <span class="char-count" :class="{ warn: questionLength > 480 }">
                  {{ questionLength }}/500
                </span>
              </label>
              <textarea
                id="question"
                v-model="form.text"
                maxlength="500"
                placeholder="Type your question here..."
                required
              ></textarea>
              <span v-if="errors.text" class="field-error">{{ errors.text }}</span>
            </div>

            <button class="btn-submit" type="submit" :disabled="submitting">
              <span>{{ submitting ? 'Submitting…' : 'Submit Question' }}</span>
              <Send :size="15" aria-hidden="true" />
            </button>

            <div class="form-note">
              <Lock :size="13" aria-hidden="true" />
              Your questions are treated with care and respect.
            </div>
          </form>
        </aside>

        <!-- MAIN: QUESTIONS LIST -->
        <div class="list-panel">
          <div class="list-head">
            <div>
              <h2>Community Questions</h2>
              <p>Explore questions and answers from our community.</p>
            </div>
            <div class="sort-wrap">
              <label for="sort" class="visually-hidden">Sort questions</label>
              <select id="sort" v-model="sortBy" class="sort-select">
                <option value="newest">Newest</option>
                <option value="answered">Answered first</option>
                <option value="pending">Pending first</option>
              </select>
            </div>
          </div>

          <!-- FILTER TABS -->
          <div class="tabs" role="tablist" aria-label="Filter questions">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              type="button"
              role="tab"
              :aria-selected="activeTab === tab.key"
              :class="['tab', { active: activeTab === tab.key }]"
              @click="activeTab = tab.key"
            >
              {{ tab.label }}
              <span class="tab-count">{{ counts[tab.key] }}</span>
            </button>
          </div>

          <!-- EMPTY STATE -->
          <div v-if="!visibleQuestions.length" class="empty-state">
            <Inbox :size="36" aria-hidden="true" />
            <h3>No questions found</h3>
            <p>There are no questions in this category yet.</p>
          </div>

          <!-- QUESTION CARDS -->
          <div v-else class="qa-list">
            <article
              v-for="item in visibleQuestions"
              :key="item.id"
              :class="['qa-card', item.status.toLowerCase()]"
            >
              <div class="qa-card-top">
                <div class="avatar" :class="item.status.toLowerCase()">
                  {{ item.initials }}
                </div>
                <div class="meta">
                  <strong>{{ item.name }}</strong>
                  <small>{{ relativeDate(item.date) }}</small>
                </div>
                <span class="status-pill" :class="item.status.toLowerCase()">
                  <span class="dot"></span>
                  {{ item.status }}
                </span>
              </div>

              <div class="qa-card-body">
                <span class="category-tag">{{ item.category }}</span>
                <h3>{{ item.question }}</h3>

                <p v-if="item.status === 'Answered'" class="answer-preview">
                  {{ item.answer }}
                </p>
                <p v-else class="pending-preview">
                  Awaiting a response from the pastor. You'll be notified when answered.
                </p>
              </div>

              <div class="qa-card-foot">
                <span class="submitted-by">
                  <User :size="12" aria-hidden="true" />
                  Submitted by {{ item.name }}
                </span>

                <button
                  v-if="item.status === 'Answered'"
                  type="button"
                  class="read-btn"
                  :aria-expanded="item.expanded"
                  @click="toggleAnswer(item.id)"
                >
                  {{ item.expanded ? 'Hide Answer' : 'View Answer' }}
                  <ChevronDown
                    :size="14"
                    class="chevron"
                    :class="{ open: item.expanded }"
                    aria-hidden="true"
                  />
                </button>
                <span v-else class="waiting-label">
                  <Clock :size="12" aria-hidden="true" />
                  Awaiting response
                </span>
              </div>

              <transition name="expand">
                <div
                  v-if="item.expanded && item.answer"
                  class="expanded-answer"
                  role="region"
                  aria-label="Pastor's answer"
                >
                  <div class="answer-head">
                    <div class="pastor-avatar">P</div>
                    <div>
                      <strong>Pastor's Answer</strong>
                      <small>Pastoral response</small>
                    </div>
                  </div>
                  <p>{{ item.answer }}</p>
                </div>
              </transition>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- TOAST -->
    <transition name="toast">
      <div v-if="toast.show" class="toast" :class="toast.type" role="status" aria-live="polite">
        <CheckCircle2 v-if="toast.type === 'success'" :size="18" aria-hidden="true" />
        <AlertCircle v-else :size="18" aria-hidden="true" />
        <span>{{ toast.message }}</span>
      </div>
    </transition>

  </main>
</template>

<script>
import {
  PenLine, Send, Lock, User, Clock, ChevronDown, Inbox,
  CheckCircle2, AlertCircle
} from "lucide-vue-next";

export default {
  name: "QuestionView",

  components: {
    PenLine, Send, Lock, User, Clock, ChevronDown, Inbox,
    CheckCircle2, AlertCircle
  },

  data() {
    return {
      categories: ["Spiritual", "Biblical", "Doctrine", "Personal"],

      form: {
        name: "",
        text: "",
        category: ""
      },

      errors: {},
      submitting: false,

      activeTab: "all",
      sortBy: "newest",

      tabs: [
        { key: "all", label: "All Questions" },
        { key: "answered", label: "Answered" },
        { key: "pending", label: "Pending" }
      ],

      toast: { show: false, type: "success", message: "" },

      questions: [
        {
          id: 1,
          initials: "GR",
          name: "Grace",
          date: "2025-05-06",
          category: "Biblical",
          question: "What is the Sabbath in the Bible?",
          status: "Answered",
          answer:
            "The Sabbath is a day of rest and worship established by God. In Exodus 20:8-11, believers are reminded to remember the Sabbath day and keep it holy. It is an opportunity to rest, reflect, and draw closer to God.",
          expanded: false
        },
        {
          id: 2,
          initials: "JD",
          name: "John",
          date: "2025-05-08",
          category: "Spiritual",
          question: "How can I strengthen my relationship with God?",
          status: "Pending",
          answer: "",
          expanded: false
        },
        {
          id: 3,
          initials: "MK",
          name: "Michael",
          date: "2025-05-10",
          category: "Doctrine",
          question: "Why is forgiveness important in Christianity?",
          status: "Answered",
          answer:
            "Forgiveness is central to Christian faith. Jesus teaches believers to forgive others as God forgives them. See Matthew 6:14-15 and Ephesians 4:32.",
          expanded: false
        }
      ]
    };
  },

  computed: {
    questionLength() {
      return this.form.text.length;
    },

    counts() {
      return {
        all: this.questions.length,
        answered: this.questions.filter(q => q.status === "Answered").length,
        pending: this.questions.filter(q => q.status === "Pending").length
      };
    },

    visibleQuestions() {
      let list = [...this.questions];

      // Filter by tab
      if (this.activeTab !== "all") {
        list = list.filter(
          q => q.status.toLowerCase() === this.activeTab
        );
      }

      // Sort
      if (this.sortBy === "newest") {
        list.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else if (this.sortBy === "answered") {
        list.sort((a, b) => {
          if (a.status === b.status) return new Date(b.date) - new Date(a.date);
          return a.status === "Answered" ? -1 : 1;
        });
      } else if (this.sortBy === "pending") {
        list.sort((a, b) => {
          if (a.status === b.status) return new Date(b.date) - new Date(a.date);
          return a.status === "Pending" ? -1 : 1;
        });
      }

      return list;
    }
  },

  methods: {
    relativeDate(iso) {
      const now = new Date();
      const then = new Date(iso);
      const diffDays = Math.floor((now - then) / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

      return then.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    },

    validate() {
      this.errors = {};

      if (!this.form.category) {
        this.errors.category = "Please select a category.";
      }

      const text = this.form.text.trim();
      if (!text) {
        this.errors.text = "Please write your question.";
      } else if (text.length < 10) {
        this.errors.text = "Question is too short — please add more detail.";
      }

      return Object.keys(this.errors).length === 0;
    },

    async submitQuestion() {
      if (!this.validate()) {
        this.showToast("error", "Please fix the errors above.");
        return;
      }

      this.submitting = true;

      // Simulate API delay
      await new Promise(r => setTimeout(r, 600));

      const submittedName = this.form.name.trim() || "Anonymous";

      const newQuestion = {
        id: Date.now(),
        initials:
          submittedName === "Anonymous"
            ? "AN"
            : submittedName.slice(0, 2).toUpperCase(),
        name: submittedName,
        date: new Date().toISOString().slice(0, 10),
        category: this.form.category,
        question: this.form.text.trim(),
        status: "Pending",
        answer: "",
        expanded: false
      };

      this.questions.unshift(newQuestion);

      this.form = { name: "", text: "", category: "" };
      this.errors = {};
      this.submitting = false;
      this.activeTab = "all";

      this.showToast("success", "Your question has been submitted successfully.");
    },

    toggleAnswer(id) {
      const item = this.questions.find(q => q.id === id);
      if (item) item.expanded = !item.expanded;
    },

    showToast(type, message) {
      this.toast = { show: true, type, message };
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        this.toast.show = false;
      }, 3500);
    }
  },

  beforeUnmount() {
    clearTimeout(this._toastTimer);
  }
};
</script>

<style scoped>
.qa-page {
  min-height: 100vh;
  background: #f7f6fb;
  color: #1e1b3a;
  font-family: "Inter", "Segoe UI", sans-serif;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

:focus-visible {
  outline: 2px solid #6d4fc4;
  outline-offset: 2px;
  border-radius: 6px;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

/* ============ HERO ============ */
.qa-hero {
  background:
    radial-gradient(800px 300px at 100% 0%, rgba(109, 79, 196, 0.08), transparent 60%),
    linear-gradient(180deg, #ffffff 0%, #f7f6fb 100%);
  border-bottom: 1px solid #ece9f5;
  padding: 44px 32px 40px;
}

.qa-hero-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 30px;
}

.eyebrow {
  color: #7c5cd6;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.8px;
}

.qa-hero-copy h1 {
  margin: 10px 0 0;
  font-size: 36px;
  line-height: 1.15;
  letter-spacing: -1px;
  color: #1e1b3a;
  font-weight: 800;
}

.qa-hero-copy h1 .amp {
  font-family: Georgia, serif;
  font-style: italic;
  font-weight: 400;
  color: #7c5cd6;
}

.qa-hero-copy p {
  margin: 14px 0 0;
  max-width: 560px;
  color: #5c5a72;
  font-size: 14px;
  line-height: 1.75;
}

.qa-hero-stat {
  text-align: right;
  flex-shrink: 0;
}

.stat-num {
  display: block;
  font-size: 44px;
  font-weight: 800;
  letter-spacing: -1.5px;
  color: #6d4fc4;
  line-height: 1;
}

.stat-label {
  display: block;
  margin-top: 6px;
  color: #8e8b9d;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

/* ============ GRID ============ */
.qa-body {
  padding: 32px;
}

.qa-grid {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(320px, 380px) minmax(0, 1fr);
  gap: 26px;
  align-items: start;
}

/* ============ ASK PANEL ============ */
.ask-panel {
  background: #fff;
  border: 1px solid #ece9f5;
  border-radius: 16px;
  padding: 26px;
  box-shadow: 0 8px 26px rgba(46, 33, 87, 0.05);
  position: sticky;
  top: 24px;
}

.ask-head {
  display: flex;
  gap: 13px;
  align-items: flex-start;
  margin-bottom: 22px;
}

.ask-icon {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background: #f1ecfd;
  color: #6d4fc4;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ask-head h2 {
  margin: 0 0 5px;
  font-size: 18px;
  font-weight: 800;
  color: #1e1b3a;
  letter-spacing: -0.3px;
}

.ask-head p {
  margin: 0;
  color: #8a879a;
  font-size: 11px;
  line-height: 1.6;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 15px;
}

.field label {
  font-size: 12px;
  font-weight: 700;
  color: #2c2946;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.optional {
  color: #a4a1b5;
  font-weight: 500;
  font-size: 11px;
}

.char-count {
  color: #a4a1b5;
  font-size: 10px;
  font-weight: 500;
}

.char-count.warn {
  color: #c97e35;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  padding: 11px 13px;
  border: 1px solid #e4e1ef;
  border-radius: 9px;
  background: #fbfafe;
  color: #1e1b3a;
  font-family: inherit;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.field textarea {
  min-height: 120px;
  resize: vertical;
  line-height: 1.6;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  border-color: #8b6fdb;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(139, 111, 219, 0.12);
}

.field input::placeholder,
.field textarea::placeholder {
  color: #adabbe;
}

.field-error {
  color: #c9464b;
  font-size: 11px;
  font-weight: 500;
}

.btn-submit {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 12px 18px;
  border: none;
  border-radius: 9px;
  background: #6d4fc4;
  color: #fff;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 6px;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  box-shadow: 0 6px 16px rgba(109, 79, 196, 0.25);
}

.btn-submit:hover:not(:disabled) {
  background: #5a3fae;
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.form-note {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
  padding: 10px 12px;
  background: #f7f5fd;
  border-radius: 8px;
  color: #7a7691;
  font-size: 10px;
  line-height: 1.5;
}

/* ============ LIST PANEL ============ */
.list-panel {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.list-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
}

.list-head h2 {
  margin: 0 0 5px;
  font-size: 20px;
  font-weight: 800;
  color: #1e1b3a;
  letter-spacing: -0.4px;
}

.list-head p {
  margin: 0;
  color: #8a879a;
  font-size: 12px;
}

.sort-select {
  padding: 9px 12px;
  border: 1px solid #e4e1ef;
  border-radius: 8px;
  background: #fff;
  color: #2c2946;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  outline: none;
}

/* TABS */
.tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 13px;
  border: 1px solid #e7e4f0;
  border-radius: 9px;
  background: #fff;
  color: #6a6780;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.tab:hover {
  border-color: #c4b4e8;
  color: #5a3fae;
}

.tab.active {
  background: #6d4fc4;
  border-color: #6d4fc4;
  color: #fff;
}

.tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 5px;
  background: #f1ecfd;
  color: #6d4fc4;
  font-size: 10px;
  font-weight: 700;
}

.tab.active .tab-count {
  background: rgba(255, 255, 255, 0.22);
  color: #fff;
}

/* ============ Q&A CARD ============ */
.qa-list {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.qa-card {
  background: #fff;
  border: 1px solid #ece9f5;
  border-radius: 14px;
  padding: 19px 21px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.qa-card:hover {
  border-color: #d5caee;
  box-shadow: 0 8px 20px rgba(46, 33, 87, 0.06);
}

.qa-card.pending {
  background: linear-gradient(180deg, #fffdf8 0%, #fff 100%);
}

.qa-card-top {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
  background: #eee9fc;
  color: #5a3fae;
}

.avatar.pending {
  background: #fff3e0;
  color: #b47b24;
}

.meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.meta strong {
  font-size: 13px;
  color: #1e1b3a;
  font-weight: 700;
}

.meta small {
  font-size: 11px;
  color: #9794a7;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 11px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3px;
  flex-shrink: 0;
}

.status-pill .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.status-pill.answered {
  background: #e8f8f0;
  color: #22865d;
}

.status-pill.pending {
  background: #fff3df;
  color: #b47b24;
}

.qa-card-body {
  padding: 15px 0 13px;
}

.category-tag {
  display: inline-block;
  padding: 4px 9px;
  border-radius: 5px;
  background: #f1ecfd;
  color: #5a3fae;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3px;
  margin-bottom: 9px;
}

.qa-card-body h3 {
  margin: 0 0 9px;
  font-size: 15px;
  font-weight: 700;
  color: #1e1b3a;
  line-height: 1.5;
}

.answer-preview {
  margin: 0;
  color: #5c5a72;
  font-size: 12px;
  line-height: 1.75;
}

.pending-preview {
  margin: 0;
  color: #a58a5c;
  font-size: 12px;
  line-height: 1.7;
  font-style: italic;
}

.qa-card-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding-top: 13px;
  border-top: 1px solid #f0eef7;
  flex-wrap: wrap;
}

.submitted-by {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #9794a7;
  font-size: 11px;
}

.read-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 4px;
  border: none;
  background: transparent;
  color: #6d4fc4;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  border-radius: 6px;
}

.read-btn:hover {
  color: #4a2f8f;
  background: #f4f0fd;
}

.chevron {
  transition: transform 0.2s;
}

.chevron.open {
  transform: rotate(180deg);
}

.waiting-label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #b47b24;
  font-size: 11px;
  font-weight: 600;
}

/* ============ EXPANDED ANSWER ============ */
.expanded-answer {
  margin-top: 14px;
  padding: 16px 18px;
  border-left: 3px solid #6d4fc4;
  background: #faf8fe;
  border-radius: 8px;
}

.answer-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.pastor-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6d4fc4, #8b6fdb);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
}

.answer-head strong {
  display: block;
  font-size: 12px;
  color: #4a2f8f;
  font-weight: 800;
}

.answer-head small {
  display: block;
  font-size: 10px;
  color: #9794a7;
  margin-top: 2px;
}

.expanded-answer p {
  margin: 0;
  color: #4a4661;
  font-size: 12px;
  line-height: 1.8;
}

/* Expand transition */
.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ============ EMPTY STATE ============ */
.empty-state {
  background: #fff;
  border: 1px dashed #ddd7ec;
  border-radius: 14px;
  padding: 50px 20px;
  text-align: center;
  color: #9c8acb;
}

.empty-state h3 {
  margin: 14px 0 6px;
  font-size: 15px;
  color: #2c2946;
  font-weight: 700;
}

.empty-state p {
  margin: 0;
  font-size: 12px;
  color: #8a879a;
}

/* ============ TOAST ============ */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 18px;
  border-radius: 11px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 12px 32px rgba(20, 12, 46, 0.22);
  z-index: 100;
  max-width: 360px;
}

.toast.success {
  background: #1e5e46;
  color: #e8fff5;
}

.toast.error {
  background: #a03539;
  color: #fff;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

/* ============ RESPONSIVE ============ */
@media (max-width: 1024px) {
  .qa-hero { padding: 36px 24px 32px; }
  .qa-hero-copy h1 { font-size: 30px; }
  .stat-num { font-size: 36px; }
  .qa-body { padding: 24px; }
  .qa-grid { grid-template-columns: 1fr; }
  .ask-panel { position: static; }
}

@media (max-width: 620px) {
  .qa-hero { padding: 28px 18px 26px; }
  .qa-hero-inner { flex-direction: column; align-items: flex-start; gap: 20px; }
  .qa-hero-copy h1 { font-size: 26px; }
  .qa-hero-stat { text-align: left; }
  .stat-num { font-size: 30px; }
  .qa-body { padding: 16px; }
  .ask-panel { padding: 20px; }
  .qa-card { padding: 16px; }
  .qa-card-body h3 { font-size: 14px; }
  .list-head h2 { font-size: 18px; }
  .toast { bottom: 16px; right: 16px; left: 16px; max-width: none; }
}

@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
</style>