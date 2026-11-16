<template>
  <div class="services-page">
    <main>
      <section class="hero">
        <div class="hero-content">
          <span class="eyebrow">{{ t("services.eyebrow") }}</span>
          <h1>{{ t("services.title") }} <span>{{ t("services.titleSpan") }}</span></h1>
          <p>{{ t("services.intro") }}</p>
          <a href="#service-directory" class="hero-button">
            {{ t("services.heroButton") }} <span>↓</span>
          </a>
        </div>
        <div class="hero-art">
          <div class="art-circle circle-one"></div>
          <div class="art-circle circle-two"></div>
          <div class="art-icon">🏛️</div>
          <div class="floating-card floating-one">
            <span>✓</span>
            <div>
              <strong>{{ t("services.artInfo") }}</strong>
              <small>{{ t("services.artInfoSub") }}</small>
            </div>
          </div>
          <div class="floating-card floating-two">
            <span>🤝</span>
            <div>
              <strong>{{ t("services.artCommunity") }}</strong>
              <small>{{ t("services.artCommunitySub") }}</small>
            </div>
          </div>
        </div>
      </section>

      <section class="quick-stats">
        <div class="quick-stat">
          <div class="stat-icon">📄</div>
          <div>
            <strong>{{ t("services.quickAdmin") }}</strong>
            <span>{{ t("services.quickAdminSub") }}</span>
          </div>
        </div>
        <div class="quick-stat">
          <div class="stat-icon">👥</div>
          <div>
            <strong>{{ t("services.quickCommunity") }}</strong>
            <span>{{ t("services.quickCommunitySub") }}</span>
          </div>
        </div>
        <div class="quick-stat">
          <div class="stat-icon">📢</div>
          <div>
            <strong>{{ t("services.quickInfo") }}</strong>
            <span>{{ t("services.quickInfoSub") }}</span>
          </div>
        </div>
      </section>

      <section class="directory section" id="service-directory">
        <div class="section-heading">
          <span class="section-tag">{{ t("services.dirTag") }}</span>
          <h2>{{ t("services.dirTitle") }}</h2>
          <p>{{ t("services.dirText") }}</p>
        </div>

        <div class="service-tools">
          <div class="search-box">
            <span>⌕</span>
            <input
              v-model="searchQuery"
              type="search"
              :placeholder="t('services.searchPlaceholder')"
              :aria-label="t('services.searchPlaceholder')"
            />
            <button
              v-if="searchQuery"
              class="clear-search"
              @click="searchQuery = ''"
              :aria-label="t('search.clear')"
            >
              ×
            </button>
          </div>

          <div class="category-filters">
            <button
              v-for="category in categories"
              :key="category.key"
              :class="{ selected: selectedCategory === category.key }"
              @click="selectedCategory = category.key"
            >
              {{ t(category.label) }}
            </button>
          </div>
        </div>

        <div v-if="filteredServices.length" class="services-grid">
          <article
            v-for="service in filteredServices"
            :key="service.key"
            class="service-card"
            @click="openService(service)"
          >
            <div class="card-top">
              <div class="service-icon" :class="service.color">
                {{ service.icon }}
              </div>
              <span class="category-label">{{ t(service.categoryLabel) }}</span>
            </div>

            <h3>{{ t(service.titleKey) }}</h3>
            <p class="service-description">{{ t(service.descKey) }}</p>

            <div class="card-footer">
              <span class="availability">
                <span class="availability-dot"></span>
                {{ t("services.clickToView") }}
              </span>
              <button class="details-button">
                {{ t("services.viewDetails") }} <span>→</span>
              </button>
            </div>
          </article>
        </div>

        <div v-else class="empty-state">
          <span>🔎</span>
          <h3>{{ t("services.emptyTitle") }}</h3>
          <p>{{ t("services.emptyText") }}</p>
          <button @click="resetFilters">{{ t("services.emptyReset") }}</button>
        </div>
      </section>

      <section class="steps-section section">
        <div class="steps-content">
          <span class="section-tag">{{ t("services.stepsTag") }}</span>
          <h2>{{ t("services.stepsTitle") }}</h2>
          <p>{{ t("services.stepsText") }}</p>

          <div class="steps-list">
            <div class="step">
              <div class="step-number">01</div>
              <div>
                <h3>{{ t("services.step1Title") }}</h3>
                <p>{{ t("services.step1Text") }}</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">02</div>
              <div>
                <h3>{{ t("services.step2Title") }}</h3>
                <p>{{ t("services.step2Text") }}</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">03</div>
              <div>
                <h3>{{ t("services.step3Title") }}</h3>
                <p>{{ t("services.step3Text") }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="help-card">
          <div class="help-icon">💬</div>
          <span class="help-label">{{ t("services.helpLabel") }}</span>
          <h3>{{ t("services.helpTitle") }}</h3>
          <p>{{ t("services.helpText") }}</p>
          <a
            href="https://www.nyamagabe.gov.rw/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ t("services.helpButton") }} ↗
          </a>
          <div class="help-decoration">?</div>
        </div>
      </section>

      <section class="notice-section">
        <span class="notice-icon">ℹ️</span>
        <div>
          <strong>{{ t("services.noticeStrong") }}</strong>
          <p>{{ t("services.noticeText") }}</p>
        </div>
      </section>
    </main>

    <div
      v-if="selectedService"
      class="modal-overlay"
      @click.self="closeService"
      @keydown.esc="closeService"
    >
      <div class="service-modal" role="dialog" aria-modal="true">
        <button class="modal-close" @click="closeService" :aria-label="t('services.modalClose')">
          ×
        </button>

        <div class="modal-service-icon" :class="selectedService.color">
          {{ selectedService.icon }}
        </div>
        <span class="section-tag">{{ t(selectedService.categoryLabel) }}</span>
        <h2>{{ t(selectedService.titleKey) }}</h2>
        <p>{{ t(selectedService.detailsKey) }}</p>

        <div class="modal-info">
          <strong>{{ t("services.modalNext") }}</strong>
          <p>{{ t(selectedService.nextStepKey) }}</p>
        </div>

        <a
          href="https://www.nyamagabe.gov.rw/"
          target="_blank"
          rel="noopener noreferrer"
          class="modal-link"
        >
          {{ t("services.modalLink") }} ↗
        </a>
        <button class="modal-done" @click="closeService">{{ t("services.modalClose") }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ServicesView",
  inject: {
    t: { default: (k) => k },
    language: { default: () => "en" },
    theme: { default: () => "dark" }
  },

  data() {
    return {
      searchQuery: "",
      selectedCategory: "all",
      selectedService: null,

      categories: [
        { key: "all", label: "services.catAll" },
        { key: "Administration", label: "services.catAdmin" },
        { key: "Community", label: "services.catCommunity" },
        { key: "Development", label: "services.catDevelopment" },
        { key: "Information", label: "services.catInfo" }
      ],

      services: [
        {
          key: "admin-info",
          category: "Administration",
          categoryLabel: "services.catAdmin",
          icon: "📄",
          color: "green",
          titleKey: "services.svc1Title",
          descKey: "services.svc1Desc",
          detailsKey: "services.svc1Details",
          nextStepKey: "services.svc1Next"
        },
        {
          key: "civil-doc",
          category: "Administration",
          categoryLabel: "services.catAdmin",
          icon: "🪪",
          color: "blue",
          titleKey: "services.svc2Title",
          descKey: "services.svc2Desc",
          detailsKey: "services.svc2Details",
          nextStepKey: "services.svc2Next"
        },
        {
          key: "community-part",
          category: "Community",
          categoryLabel: "services.catCommunity",
          icon: "👥",
          color: "purple",
          titleKey: "services.svc3Title",
          descKey: "services.svc3Desc",
          detailsKey: "services.svc3Details",
          nextStepKey: "services.svc3Next"
        },
        {
          key: "community-dev",
          category: "Development",
          categoryLabel: "services.catDevelopment",
          icon: "🌱",
          color: "green",
          titleKey: "services.svc4Title",
          descKey: "services.svc4Desc",
          detailsKey: "services.svc4Details",
          nextStepKey: "services.svc4Next"
        },
        {
          key: "agriculture",
          category: "Development",
          categoryLabel: "services.catDevelopment",
          icon: "🌾",
          color: "gold",
          titleKey: "services.svc5Title",
          descKey: "services.svc5Desc",
          detailsKey: "services.svc5Details",
          nextStepKey: "services.svc5Next"
        },
        {
          key: "education",
          category: "Community",
          categoryLabel: "services.catCommunity",
          icon: "🎓",
          color: "blue",
          titleKey: "services.svc6Title",
          descKey: "services.svc6Desc",
          detailsKey: "services.svc6Details",
          nextStepKey: "services.svc6Next"
        },
        {
          key: "notices",
          category: "Information",
          categoryLabel: "services.catInfo",
          icon: "📢",
          color: "gold",
          titleKey: "services.svc7Title",
          descKey: "services.svc7Desc",
          detailsKey: "services.svc7Details",
          nextStepKey: "services.svc7Next"
        },
        {
          key: "feedback",
          category: "Information",
          categoryLabel: "services.catInfo",
          icon: "💬",
          color: "purple",
          titleKey: "services.svc8Title",
          descKey: "services.svc8Desc",
          detailsKey: "services.svc8Details",
          nextStepKey: "services.svc8Next"
        }
      ]
    };
  },

  computed: {
    filteredServices() {
      const q = this.searchQuery.trim().toLowerCase();
      return this.services.filter((service) => {
        const matchesCategory =
          this.selectedCategory === "all" ||
          service.category === this.selectedCategory;
        const matchesSearch =
          !q ||
          this.t(service.titleKey).toLowerCase().includes(q) ||
          this.t(service.descKey).toLowerCase().includes(q) ||
          this.t(service.categoryLabel).toLowerCase().includes(q);
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
      this.selectedCategory = "all";
    }
  },

  beforeUnmount() {
    document.body.style.overflow = "";
  }
};
</script>

<style scoped>
.services-page {
  min-height: 100vh;
  color: var(--text);
  background: var(--bg);
  font-family: Inter, "Segoe UI", Arial, sans-serif;
  transition: background 0.25s ease, color 0.25s ease;
}

.services-page * { box-sizing: border-box; }

.hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  min-height: 390px;
  padding: 65px 8%;
  overflow: hidden;
  color: var(--bg);
  background: linear-gradient(120deg, var(--green-deep, #087c4c), var(--green) 68%);
}

.hero-content { position: relative; z-index: 2; max-width: 630px; }

.eyebrow,
.section-tag {
  color: rgba(3, 20, 11, 0.7);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.7px;
}

[data-theme="light"] .eyebrow,
[data-theme="light"] .section-tag {
  color: rgba(255, 255, 255, 0.85);
}

.hero h1 {
  margin: 18px 0 15px;
  font-size: clamp(38px, 5vw, 57px);
  line-height: 1.12;
  letter-spacing: -1.6px;
}

.hero h1 span { color: rgba(3, 20, 11, 0.6); }

[data-theme="light"] .hero h1 span { color: rgba(255, 255, 255, 0.7); }

.hero-content > p {
  max-width: 590px;
  margin: 0;
  color: rgba(3, 20, 11, 0.8);
  font-size: 14px;
  line-height: 1.9;
}

[data-theme="light"] .hero-content > p { color: rgba(255, 255, 255, 0.9); }

.hero-button {
  display: inline-flex;
  align-items: center;
  gap: 20px;
  margin-top: 27px;
  padding: 14px 18px;
  border-radius: 8px;
  color: var(--green);
  background: var(--bg);
  font-size: 12px;
  font-weight: 800;
  text-decoration: none;
  transition: transform 0.2s, background 0.2s;
}

.hero-button:hover { transform: translateY(-2px); background: var(--soft); }

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
  border: 1px solid rgba(3, 20, 11, 0.15);
  border-radius: 50%;
}

.circle-two {
  top: 43px;
  left: 61px;
  width: 170px;
  height: 170px;
  background: rgba(3, 20, 11, 0.05);
}

.art-icon {
  position: absolute;
  top: 72px;
  left: 98px;
  display: grid;
  place-items: center;
  width: 95px;
  height: 95px;
  border: 1px solid rgba(3, 20, 11, 0.2);
  border-radius: 25px;
  background: rgba(3, 20, 11, 0.1);
  font-size: 45px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.floating-card {
  position: absolute;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: 11px;
  color: var(--text);
  background: var(--panel);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
}

.floating-one { top: 20px; right: -12px; }
.floating-two { bottom: 15px; left: -10px; }

.floating-card > span {
  display: grid;
  place-items: center;
  width: 33px;
  height: 33px;
  border-radius: 9px;
  background: var(--soft);
  font-size: 17px;
}

.floating-card strong,
.floating-card small { display: block; white-space: nowrap; }
.floating-card strong { font-size: 10px; }
.floating-card small { margin-top: 4px; color: var(--muted); font-size: 9px; }

.quick-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  padding: 25px 8%;
  border-bottom: 1px solid var(--line);
  background: var(--panel);
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
  background: var(--soft);
  font-size: 22px;
}

.quick-stat strong,
.quick-stat span { display: block; }
.quick-stat strong { margin-bottom: 5px; font-size: 13px; }
.quick-stat div:last-child span { color: var(--muted); font-size: 11px; }

.section { padding: 75px 8%; }
.directory { background: var(--bg); }

.section-heading {
  max-width: 650px;
  margin: 0 auto 35px;
  text-align: center;
}

.section-heading .section-tag { color: var(--green); }

.section-heading h2 {
  margin: 13px 0 12px;
  font-size: clamp(28px, 3vw, 37px);
  letter-spacing: -1px;
  color: var(--text);
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
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--panel);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.search-box > span {
  color: var(--green);
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

.search-box input::placeholder { color: var(--muted); }

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
  border: 1px solid var(--line);
  border-radius: 7px;
  color: var(--text);
  background: var(--panel);
  font: inherit;
  font-size: 11px;
  font-weight: 650;
  cursor: pointer;
  transition: color 0.2s, background 0.2s, border-color 0.2s;
}

.category-filters button:hover,
.category-filters button.selected {
  border-color: var(--green);
  color: var(--bg);
  background: var(--green);
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
  border: 1px solid var(--line);
  border-radius: 13px;
  background: var(--panel);
  transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
  cursor: pointer;
}

.service-card:hover {
  transform: translateY(-5px);
  border-color: rgba(113, 206, 128, 0.4);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
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
.modal-service-icon.green { background: var(--soft); }
.service-icon.blue,
.modal-service-icon.blue { background: rgba(52, 116, 185, 0.15); }
.service-icon.purple,
.modal-service-icon.purple { background: rgba(124, 85, 174, 0.15); }
.service-icon.gold,
.modal-service-icon.gold { background: rgba(185, 121, 38, 0.15); }

.category-label {
  padding: 6px 9px;
  border-radius: 5px;
  color: var(--green);
  background: var(--soft);
  font-size: 9px;
  font-weight: 750;
}

.service-card h3 {
  margin: 0 0 11px;
  font-size: 16px;
  line-height: 1.5;
  color: var(--text);
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
  border-top: 1px solid var(--line);
}

.availability {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--muted);
  font-size: 9px;
}

.availability-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--green);
}

.details-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  border: 0;
  color: var(--green);
  background: transparent;
  font: inherit;
  font-size: 11px;
  font-weight: 750;
  cursor: pointer;
}

.details-button span { font-size: 16px; transition: transform 0.2s; }
.service-card:hover .details-button span { transform: translateX(4px); }

.empty-state {
  padding: 55px 20px;
  text-align: center;
  border: 1px dashed var(--line);
  border-radius: 13px;
  background: var(--panel);
}

.empty-state > span { font-size: 35px; }
.empty-state h3 { margin: 15px 0 8px; color: var(--text); }
.empty-state p { color: var(--muted); font-size: 13px; }

.empty-state button {
  margin-top: 10px;
  padding: 11px 16px;
  border: 0;
  border-radius: 7px;
  color: var(--bg);
  background: var(--green);
  font-weight: 700;
  cursor: pointer;
}

.steps-section {
  display: grid;
  grid-template-columns: 1fr 0.8fr;
  align-items: center;
  gap: 65px;
  background: var(--bg);
}

.steps-content > .section-tag { color: var(--green); }

.steps-content h2 {
  margin: 13px 0 12px;
  font-size: clamp(27px, 3vw, 35px);
  letter-spacing: -0.8px;
  color: var(--text);
}

.steps-content > p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.9;
}

.steps-list { display: grid; gap: 23px; margin-top: 29px; }

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
  border: 1px solid var(--line);
  border-radius: 11px;
  color: var(--green);
  background: var(--soft);
  font-size: 12px;
  font-weight: 800;
}

.step h3 { margin: 2px 0 7px; font-size: 14px; color: var(--text); }
.step p { margin: 0; color: var(--muted); font-size: 12px; line-height: 1.8; }

.help-card {
  position: relative;
  overflow: hidden;
  padding: 33px;
  border-radius: 15px;
  color: var(--bg);
  background: linear-gradient(145deg, var(--green), var(--green-deep, #087c4c));
}

.help-icon {
  display: grid;
  place-items: center;
  width: 51px;
  height: 51px;
  margin-bottom: 23px;
  border: 1px solid rgba(3, 20, 11, 0.2);
  border-radius: 13px;
  background: rgba(3, 20, 11, 0.1);
  font-size: 24px;
}

[data-theme="light"] .help-icon {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.15);
}

.help-label {
  color: rgba(3, 20, 11, 0.6);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.6px;
}

[data-theme="light"] .help-label { color: rgba(255, 255, 255, 0.85); }

.help-card h3 {
  position: relative;
  z-index: 1;
  margin: 12px 0;
  font-size: 25px;
  line-height: 1.3;
  color: var(--bg);
}

[data-theme="light"] .help-card h3 { color: #ffffff; }

.help-card > p {
  position: relative;
  z-index: 1;
  margin: 0;
  color: rgba(3, 20, 11, 0.8);
  font-size: 12px;
  line-height: 1.9;
}

[data-theme="light"] .help-card > p { color: rgba(255, 255, 255, 0.9); }

.help-card > a {
  position: relative;
  z-index: 1;
  display: inline-flex;
  margin-top: 25px;
  padding: 13px 15px;
  border-radius: 8px;
  color: var(--green);
  background: var(--bg);
  font-size: 11px;
  font-weight: 800;
  text-decoration: none;
  transition: transform 0.2s;
}

.help-card > a:hover { transform: translateY(-2px); }

.help-decoration {
  position: absolute;
  right: 7px;
  bottom: -80px;
  color: rgba(3, 20, 11, 0.05);
  font-size: 240px;
  font-weight: 900;
  pointer-events: none;
}

[data-theme="light"] .help-decoration { color: rgba(255, 255, 255, 0.08); }

.notice-section {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin: 0;
  padding: 27px 8%;
  border-top: 1px solid rgba(216, 177, 93, 0.3);
  border-bottom: 1px solid rgba(216, 177, 93, 0.3);
  background: rgba(216, 177, 93, 0.08);
}

.notice-icon { font-size: 20px; }
.notice-section strong { color: #d8b15d; font-size: 12px; }
.notice-section p {
  max-width: 1000px;
  margin: 7px 0 0;
  color: #b89552;
  font-size: 11px;
  line-height: 1.9;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(3, 20, 11, 0.85);
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
  background: var(--panel);
  border: 1px solid var(--line);
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
}

.modal-close {
  position: absolute;
  top: 13px;
  right: 15px;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 8px;
  color: var(--muted);
  background: var(--soft);
  font-size: 24px;
  cursor: pointer;
  transition: color 0.2s;
}

.modal-close:hover { color: var(--text); }

.modal-service-icon {
  display: grid;
  place-items: center;
  width: 59px;
  height: 59px;
  margin-bottom: 22px;
  border-radius: 13px;
  font-size: 27px;
}

.service-modal .section-tag { color: var(--green); }

.service-modal h2 {
  margin: 12px 0;
  font-size: 26px;
  line-height: 1.3;
  color: var(--text);
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
  background: var(--soft);
}

.modal-info strong { font-size: 12px; color: var(--text); }
.modal-info p { margin: 7px 0 0; }

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
  transition: background 0.2s;
}

.modal-link { color: var(--bg); background: var(--green); }
.modal-link:hover { background: var(--green-strong, #36d58c); }
.modal-done { margin-top: 10px; color: var(--text); background: var(--soft); }

@media (max-width: 1050px) {
  .section { padding: 60px 5%; }
  .services-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .steps-section { gap: 35px; }
  .hero { padding-right: 5%; padding-left: 5%; }
  .hero-art {
    transform: scale(0.85);
    transform-origin: center right;
    margin-left: -30px;
  }
}

@media (max-width: 760px) {
  .hero { min-height: 330px; padding: 48px 6%; }
  .hero-art { display: none; }
  .quick-stats { grid-template-columns: 1fr; padding: 15px 6%; }
  .quick-stat { padding: 11px 0; }
  .section { padding: 52px 6%; }
  .steps-section { grid-template-columns: 1fr; gap: 35px; }
  .notice-section { padding: 24px 6%; }
}

@media (max-width: 480px) {
  .services-grid { grid-template-columns: 1fr; }
  .category-filters { justify-content: flex-start; }
  .category-filters button { padding: 0 10px; font-size: 10px; }
  .service-card { padding: 21px; }
  .help-card { padding: 25px; }
  .service-modal { padding: 28px 22px; }
}
</style>