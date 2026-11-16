<template>
  <div class="home-page">
    <main>
      <!-- HERO -->
      <section id="home" class="hero">
        <div class="hero-shade"></div>
        <div class="hero-content">
          <span class="eyebrow">{{ t("home.welcome") }}</span>
          <h1>{{ t("home.heroTitle") }}</h1>
          <h3>{{ t("home.heroSubtitle") }}</h3>
          <p>{{ t("home.heroText") }}</p>

          <div class="hero-buttons">
            <router-link to="/about" class="btn primary">
              {{ t("home.exploreBtn") }} →
            </router-link>
            <router-link to="/dashboards" class="btn secondary">
              {{ t("home.dashboardBtn") }} ↗
            </router-link>
          </div>

          <div class="hero-note">
            <span class="dot"></span>
            {{ t("home.heroNote") }}
          </div>
        </div>

        <aside class="map-card">
          <div class="section-title">
            <div>
              <h3>{{ t("home.mapTitle") }}</h3>
              <small>{{ t("home.mapSub") }}</small>
            </div>
            <span class="map-pin">⌖</span>
          </div>

          <div class="map-visual">
            <svg viewBox="0 0 320 270" role="img" :aria-label="t('home.mapAria')">
              <defs>
                <linearGradient id="mapFill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#164b29" />
                  <stop offset="100%" stop-color="#071d13" />
                </linearGradient>
              </defs>
              <path
                d="M145 12 L174 25 203 18 222 39 255 45 278 76 301 94 287 119 299 146 276 164 266 191 235 198 218 231 191 218 165 251 139 233 111 244 89 221 65 227 47 204 23 187 34 159 19 137 42 115 37 89 62 72 83 51 111 57 127 34Z"
                fill="url(#mapFill)" stroke="#80df70" stroke-width="1.7"
              />
              <g fill="none" stroke="#6eb66a" stroke-width=".8">
                <path d="M46 115 L93 124 111 57" />
                <path d="M93 124 L127 160 174 25" />
                <path d="M127 160 L89 221" />
                <path d="M127 160 L218 231" />
                <path d="M127 160 L203 130 278 76" />
                <path d="M203 130 L235 198" />
                <path d="M165 251 L165 190 203 130" />
              </g>
              <g fill="#e8ffe5" stroke="#1d7434" stroke-width="2">
                <circle cx="83" cy="78" r="4" />
                <circle cx="222" cy="109" r="4" />
                <circle cx="164" cy="144" r="4" />
                <circle cx="82" cy="191" r="4" />
                <circle cx="213" cy="205" r="4" />
              </g>
              <g fill="#f4fff4" font-size="10" font-weight="600">
                <text x="89" y="76">{{ t("home.cell1") }}</text>
                <text x="229" y="106">{{ t("home.cell2") }}</text>
                <text x="171" y="141">{{ t("home.cell3") }}</text>
                <text x="89" y="188">{{ t("home.cell4") }}</text>
                <text x="220" y="202">{{ t("home.cell5") }}</text>
              </g>
            </svg>
          </div>
        </aside>
      </section>

      <!-- STATISTICS -->
      <section id="dashboard" class="statistics">
        <div
          v-for="stat in statistics"
          :key="stat.key"
          class="stat-card"
        >
          <span class="stat-icon">{{ stat.icon }}</span>
          <span class="stat-copy">
            <small>{{ t(stat.labelKey) }}</small>
            <strong>{{ stat.value }} <em>{{ stat.unit }}</em></strong>
            <small>{{ t(stat.captionKey) }}</small>
          </span>
        </div>
      </section>

      <!-- ABOUT QUICK -->
      <section id="about" class="panel content-section">
        <small class="eyebrow">{{ t("home.aboutKicker") }}</small>
        <h2>{{ t("home.aboutTitle") }}</h2>
        <p class="section-description">{{ t("home.aboutText") }}</p>

        <div class="info-grid">
          <article>
            <span class="info-icon">⌖</span>
            <h3>{{ t("home.aboutLocationTitle") }}</h3>
            <p>{{ t("home.aboutLocationText") }}</p>
          </article>
          <article>
            <span class="info-icon">♧</span>
            <h3>{{ t("home.aboutEnvironmentTitle") }}</h3>
            <p>{{ t("home.aboutEnvironmentText") }}</p>
          </article>
          <article>
            <span class="info-icon">♙</span>
            <h3>{{ t("home.aboutCommunityTitle") }}</h3>
            <p>{{ t("home.aboutCommunityText") }}</p>
          </article>
        </div>
      </section>

      <!-- ADMINISTRATION QUICK -->
      <section id="administration" class="panel content-section">
        <small class="eyebrow">{{ t("home.adminKicker") }}</small>
        <h2>{{ t("home.adminTitle") }}</h2>
        <p class="section-description">{{ t("home.adminText") }}</p>

        <div class="admin-grid">
          <article class="admin-highlight">
            <span class="info-icon">⌂</span>
            <div>
              <h3>{{ t("home.adminOfficeTitle") }}</h3>
              <p>{{ t("home.adminOfficeText") }}</p>
            </div>
          </article>
          <div class="admin-list">
            <p>
              <strong>01 — {{ t("home.adminItem1Title") }}</strong>
              <small>{{ t("home.adminItem1Text") }}</small>
            </p>
            <p>
              <strong>02 — {{ t("home.adminItem2Title") }}</strong>
              <small>{{ t("home.adminItem2Text") }}</small>
            </p>
            <p>
              <strong>03 — {{ t("home.adminItem3Title") }}</strong>
              <small>{{ t("home.adminItem3Text") }}</small>
            </p>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section id="contact" class="contact-section">
        <div>
          <small class="eyebrow">{{ t("home.ctaKicker") }}</small>
          <h2>{{ t("home.ctaTitle") }}</h2>
          <p>{{ t("home.ctaText") }}</p>
        </div>
        <a
          class="btn primary"
          href="https://www.nyamagabe.gov.rw/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ t("home.ctaButton") }} ↗
        </a>
      </section>
    </main>

    <button
      v-if="showTop"
      class="back-top"
      :aria-label="t('footer.backToTop')"
      @click="scrollTop"
    >
      ↑
    </button>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  inject: {
    t: { default: (k) => k },
    language: { default: () => "en" },
    theme: { default: () => "dark" }
  },

  data() {
    return {
      showTop: false,

      statistics: [
        { key: "pop", icon: "♟", labelKey: "home.statPop", value: "—", unit: "", captionKey: "home.statPopCap" },
        { key: "cells", icon: "▦", labelKey: "home.statCells", value: "5*", unit: "", captionKey: "home.statCellsCap" },
        { key: "villages", icon: "⌂", labelKey: "home.statVillages", value: "53*", unit: "", captionKey: "home.statVillagesCap" },
        { key: "emp", icon: "♙", labelKey: "home.statEmployees", value: "—", unit: "", captionKey: "home.statEmployeesCap" },
        { key: "projects", icon: "▧", labelKey: "home.statProjects", value: "—", unit: "", captionKey: "home.statProjectsCap" },
        { key: "budget", icon: "◔", labelKey: "home.statBudget", value: "—", unit: "RWF", captionKey: "home.statBudgetCap" },
        { key: "revenue", icon: "▥", labelKey: "home.statRevenue", value: "—", unit: "RWF", captionKey: "home.statRevenueCap" },
        { key: "expend", icon: "↗", labelKey: "home.statExpenditure", value: "—", unit: "RWF", captionKey: "home.statExpenditureCap" }
      ]
    };
  },

  mounted() {
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    this.handleScroll();
  },

  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },

  methods: {
    handleScroll() {
      this.showTop = window.scrollY > 400;
    },
    scrollTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
};
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  color: var(--text);
  background: var(--bg);
  font-family: Inter, "Segoe UI", Arial, sans-serif;
  transition: background 0.25s ease, color 0.25s ease;
}

.home-page * { box-sizing: border-box; }

.hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  min-height: 435px;
  padding: 40px 4.3%;
  background:
    url("../assets/images/campus-hero.jpg")
    center/cover no-repeat;
}

.hero-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(0,13,5,.94), rgba(0,17,8,.55) 60%, rgba(0,13,5,.78));
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
  font-size: clamp(42px, 5.3vw, 74px);
  line-height: 1.05;
  letter-spacing: -2px;
}

.hero h3 {
  margin: 12px 0;
  color: #83df80;
  font-size: clamp(13px, 1.5vw, 18px);
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
  text-decoration: none;
  transition: transform .2s, background .2s;
}

.btn:hover { transform: translateY(-2px); }

.primary {
  background: var(--green);
  color: var(--bg);
}

.primary:hover { background: var(--green-strong, #36d58c); }

.secondary {
  border-color: rgba(255,255,255,.3);
  background: rgba(0,17,8,.5);
  color: white;
}

.secondary:hover { background: rgba(255,255,255,.12); }

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
  border: 1px solid var(--line);
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

.section-title h3 { margin: 5px 0 0; font-size: 16px; color: #fff; }
.section-title small:not(.eyebrow) { color: #a9c5b0; font-size: 10px; }
.map-pin { color: #7cdd79; font-size: 27px; }
.map-visual svg { display: block; width: 100%; max-height: 240px; }

.statistics {
  display: grid;
  grid-template-columns: repeat(4,minmax(0,1fr));
  gap: 10px;
  padding: 18px 4.3% 5px;
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

.stat-copy { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.stat-copy small { color: var(--muted); font-size: 9px; line-height: 1.4; }
.stat-copy strong { font-size: clamp(18px,1.7vw,24px); overflow-wrap: anywhere; color: var(--text); }
.stat-copy em { color: var(--muted); font-size: 9px; font-style: normal; }

.panel {
  min-width: 0;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--panel);
  margin: 0 4.3% 16px;
}

.content-section h2 {
  margin: 8px 0;
  font-size: clamp(23px,3vw,30px);
  color: var(--text);
}

.section-description {
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

.info-grid article {
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--soft);
}

.info-grid h3 { font-size: 13px; color: var(--text); }
.info-grid p { color: var(--muted); font-size: 11px; line-height: 1.8; }

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

.admin-highlight h3 { margin-top: 0; font-size: 13px; color: var(--text); }
.admin-highlight p { color: var(--muted); font-size: 11px; line-height: 1.8; }

.admin-list p {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
}

.admin-list strong { font-size: 11px; color: var(--text); }
.admin-list small { color: var(--muted); font-size: 10px; }

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
}

.contact-section > div { max-width: 650px; }
.contact-section h2 { color: var(--text); }
.contact-section p { color: var(--muted); font-size: 12px; line-height: 1.8; }
.contact-section .btn { flex-shrink: 0; }

.back-top {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 80;
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 50%;
  background: var(--green);
  color: var(--bg);
  font-size: 20px;
  box-shadow: 0 6px 22px rgba(0,0,0,.25);
  cursor: pointer;
}

@media (max-width: 1250px) {
  .statistics { grid-template-columns: repeat(2,minmax(0,1fr)); }
}

@media (max-width: 900px) {
  .hero {
    flex-direction: column;
    align-items: stretch;
    padding: 35px 18px 22px;
  }
  .hero h1 { font-size: 47px; }
  .map-card { width: 100%; max-width: none; min-width: 0; }
  .statistics { padding: 12px; }
  .info-grid, .admin-grid { grid-template-columns: 1fr; }
  .contact-section { flex-direction: column; align-items: flex-start; padding: 20px; margin: 0 12px 16px; }
  .panel { margin: 0 12px 14px; }
}

@media (max-width: 500px) {
  .statistics { grid-template-columns: 1fr; }
  .hero h1 { font-size: 40px; }
}
</style>