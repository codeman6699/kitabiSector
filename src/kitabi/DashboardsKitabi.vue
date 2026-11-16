<template>
  <div class="dashboard">
    <main class="dashboard-content">
      <section class="welcome-banner">
        <div class="welcome-content">
          <span class="welcome-tag">{{ t("dashboard.tag") }}</span>
          <h2>{{ t("dashboard.welcome") }} 👋</h2>
          <p>{{ t("dashboard.welcomeText") }}</p>
          <router-link to="/services" class="welcome-button">
            {{ t("dashboard.exploreServices") }} <span>→</span>
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
          <span class="section-kicker">{{ t("dashboard.glance") }}</span>
          <h2>{{ t("dashboard.summary") }}</h2>
          <p>{{ t("dashboard.summaryText") }}</p>
        </div>
        <span class="demo-badge">{{ t("dashboard.demoBadge") }}</span>
      </section>

      <div class="stats-grid">
        <article
          v-for="stat in stats"
          :key="stat.key"
          class="stat-card"
        >
          <div class="stat-top">
            <div class="stat-icon" :class="stat.color">{{ stat.icon }}</div>
            <button class="stat-menu" @click="activePanel = stat.panelKey">···</button>
          </div>
          <p class="stat-title">{{ t(stat.titleKey) }}</p>
          <div class="stat-bottom">
            <h3>{{ stat.value }}</h3>
            <span class="stat-period">{{ t(stat.periodKey) }}</span>
          </div>
          <div class="stat-progress">
            <span :class="stat.color" :style="{ width: stat.progress + '%' }"></span>
          </div>
          <p class="stat-caption">{{ t(stat.captionKey) }}</p>
        </article>
      </div>

      <section class="middle-grid">
        <article class="panel development-panel">
          <div class="panel-header">
            <div>
              <span class="section-kicker">{{ t("dashboard.overview") }}</span>
              <h2>{{ t("dashboard.devTitle") }}</h2>
            </div>
            <select v-model="selectedPeriod" :aria-label="t('dashboard.periodLabel')">
              <option value="Quarterly">{{ t("dashboard.periodQuarterly") }}</option>
              <option value="Monthly">{{ t("dashboard.periodMonthly") }}</option>
              <option value="Yearly">{{ t("dashboard.periodYearly") }}</option>
            </select>
          </div>

          <div class="chart-legend">
            <span><i class="legend-dot green-dot"></i> {{ t("dashboard.planned") }}</span>
            <span><i class="legend-dot gold-dot"></i> {{ t("dashboard.completed") }}</span>
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

          <p class="chart-note">{{ t("dashboard.chartNote") }}</p>
        </article>

        <article class="panel quick-actions-panel">
          <div class="panel-header">
            <div>
              <span class="section-kicker">{{ t("dashboard.shortcuts") }}</span>
              <h2>{{ t("dashboard.quickTitle") }}</h2>
            </div>
            <span class="shortcut-icon">↗</span>
          </div>

          <div class="quick-actions">
            <button
              v-for="action in quickActions"
              :key="action.key"
              class="quick-action"
              @click="runAction(action)"
            >
              <span class="action-icon" :class="action.color">{{ action.icon }}</span>
              <span class="action-copy">
                <strong>{{ t(action.titleKey) }}</strong>
                <small>{{ t(action.descKey) }}</small>
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
              <span class="section-kicker">{{ t("dashboard.latestUpdates") }}</span>
              <h2>{{ t("dashboard.announceTitle") }}</h2>
            </div>
            <button class="text-button" @click="activePanel = 'announcements'">
              {{ t("dashboard.viewAll") }} →
            </button>
          </div>

          <div class="announcement-list">
            <article
              v-for="item in announcements"
              :key="item.key"
              class="announcement-item"
            >
              <div class="announcement-icon" :class="item.color">
                {{ item.icon }}
              </div>
              <div class="announcement-copy">
                <div class="announcement-meta">
                  <span class="announcement-category">{{ t(item.categoryKey) }}</span>
                  <span>{{ t(item.dateKey) }}</span>
                </div>
                <h3>{{ t(item.titleKey) }}</h3>
                <p>{{ t(item.descKey) }}</p>
              </div>
              <button
                class="announcement-arrow"
                @click="showAnnouncement(item)"
                :aria-label="t('dashboard.readMore')"
              >
                →
              </button>
            </article>
          </div>
        </article>

        <article class="panel information-panel">
          <div class="panel-header">
            <div>
              <span class="section-kicker">{{ t("dashboard.sectorInfo") }}</span>
              <h2>{{ t("dashboard.portfolioTitle") }}</h2>
            </div>
            <span class="information-icon">ⓘ</span>
          </div>

          <div class="information-list">
            <div>
              <span class="info-symbol">📍</span>
              <div>
                <span>{{ t("dashboard.location") }}</span>
                <strong>{{ t("dashboard.locationValue") }}</strong>
              </div>
            </div>
            <div>
              <span class="info-symbol">🌐</span>
              <div>
                <span>{{ t("dashboard.websiteStatus") }}</span>
                <strong>{{ t("dashboard.websiteValue") }}</strong>
              </div>
            </div>
            <div>
              <span class="info-symbol">📊</span>
              <div>
                <span>{{ t("dashboard.statistics") }}</span>
                <strong>{{ t("dashboard.statisticsValue") }}</strong>
              </div>
            </div>
            <div>
              <span class="info-symbol">🗓️</span>
              <div>
                <span>{{ t("dashboard.currentYear") }}</span>
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
            {{ t("dashboard.districtLink") }} ↗
          </a>
        </article>
      </section>
    </main>

    <div
      v-if="activePanel"
      class="modal-overlay"
      @click.self="closePanel"
      @keydown.esc="closePanel"
    >
      <div class="dashboard-modal" role="dialog" aria-modal="true">
        <button class="modal-close" @click="closePanel" :aria-label="t('dashboard.close')">×</button>

        <template v-if="selectedAnnouncement">
          <div class="modal-icon">📢</div>
          <span class="section-kicker">{{ t(selectedAnnouncement.categoryKey) }}</span>
          <h2>{{ t(selectedAnnouncement.titleKey) }}</h2>
          <p>{{ t(selectedAnnouncement.descKey) }}</p>
          <p class="modal-note">{{ t("dashboard.announceNote") }}</p>
        </template>

        <template v-else>
          <div class="modal-icon">📋</div>
          <span class="section-kicker">{{ t("dashboard.infoKicker") }}</span>
          <h2>{{ t(panelTitleKey) }}</h2>
          <p>{{ t(panelDescKey) }}</p>
          <p class="modal-note">{{ t("dashboard.demoNote") }}</p>
        </template>

        <button class="modal-done" @click="closePanel">{{ t("dashboard.close") }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardView",
  inject: {
    t: { default: (k) => k },
    language: { default: () => "en" },
    theme: { default: () => "dark" }
  },

  data() {
    return {
      currentYear: new Date().getFullYear(),
      selectedPeriod: "Quarterly",
      activePanel: null,
      selectedAnnouncement: null,

      stats: [
        {
          key: "population",
          titleKey: "dashboard.statPopulation",
          periodKey: "dashboard.notAvailable",
          captionKey: "dashboard.statPopulationCap",
          value: "—",
          icon: "♙",
          color: "green",
          progress: 65,
          panelKey: "population"
        },
        {
          key: "cells",
          titleKey: "dashboard.statCells",
          periodKey: "dashboard.notAvailable",
          captionKey: "dashboard.statCellsCap",
          value: "—",
          icon: "⌂",
          color: "blue",
          progress: 45,
          panelKey: "cells"
        },
        {
          key: "services",
          titleKey: "dashboard.statServices",
          periodKey: "dashboard.sampleEntries",
          captionKey: "dashboard.statServicesCap",
          value: "8",
          icon: "▤",
          color: "gold",
          progress: 75,
          panelKey: "services"
        },
        {
          key: "announcements",
          titleKey: "dashboard.statAnnounce",
          periodKey: "dashboard.sampleEntries",
          captionKey: "dashboard.statAnnounceCap",
          value: "3",
          icon: "♧",
          color: "purple",
          progress: 55,
          panelKey: "announcements"
        }
      ],

      quickActions: [
        {
          key: "explore",
          titleKey: "dashboard.actionExplore",
          descKey: "dashboard.actionExploreText",
          icon: "▤",
          color: "green",
          action: "services"
        },
        {
          key: "admin",
          titleKey: "dashboard.actionAdmin",
          descKey: "dashboard.actionAdminText",
          icon: "♙",
          color: "blue",
          action: "administration"
        },
        {
          key: "about",
          titleKey: "dashboard.actionAbout",
          descKey: "dashboard.actionAboutText",
          icon: "ⓘ",
          color: "gold",
          action: "about"
        },
        {
          key: "district",
          titleKey: "dashboard.actionDistrict",
          descKey: "dashboard.actionDistrictText",
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
          key: "dev",
          titleKey: "dashboard.ann1Title",
          categoryKey: "dashboard.ann1Category",
          dateKey: "dashboard.ann1Date",
          descKey: "dashboard.ann1Desc",
          icon: "🌱",
          color: "green"
        },
        {
          key: "services",
          titleKey: "dashboard.ann2Title",
          categoryKey: "dashboard.ann2Category",
          dateKey: "dashboard.ann2Date",
          descKey: "dashboard.ann2Desc",
          icon: "📄",
          color: "blue"
        },
        {
          key: "meetings",
          titleKey: "dashboard.ann3Title",
          categoryKey: "dashboard.ann3Category",
          dateKey: "dashboard.ann3Date",
          descKey: "dashboard.ann3Desc",
          icon: "👥",
          color: "gold"
        }
      ]
    };
  },

  computed: {
    chartData() {
      if (this.selectedPeriod === "Monthly") return this.monthlyChart;
      if (this.selectedPeriod === "Yearly") return this.yearlyChart;
      return this.quarterlyChart;
    },

    panelTitleKey() {
      const titles = {
        population: "dashboard.panelPopulation",
        cells: "dashboard.panelCells",
        services: "dashboard.panelServices",
        announcements: "dashboard.panelAnnouncements"
      };
      return titles[this.activePanel] || "dashboard.infoKicker";
    },

    panelDescKey() {
      const descriptions = {
        population: "dashboard.panelPopulationText",
        cells: "dashboard.panelCellsText",
        services: "dashboard.panelServicesText",
        announcements: "dashboard.panelAnnouncementsText"
      };
      return descriptions[this.activePanel] || "dashboard.demoNote";
    }
  },

  methods: {
    runAction(action) {
      if (action.action === "district") {
        window.open("https://www.nyamagabe.gov.rw/", "_blank", "noopener,noreferrer");
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
  min-height: 100vh;
  display: flex;
  color: var(--text);
  background: var(--bg);
  font-family: Inter, "Segoe UI", Arial, sans-serif;
  transition: background 0.25s ease, color 0.25s ease;
}

.dashboard * { box-sizing: border-box; }

.dashboard-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 27px 32px 20px;
  width: 100%;
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
  color: var(--bg);
  background: linear-gradient(110deg, var(--green-deep, #087c4c), var(--green));
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
}

.welcome-content { position: relative; z-index: 2; max-width: 620px; }

.welcome-tag {
  color: rgba(3, 20, 11, 0.7);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.6px;
}

[data-theme="light"] .welcome-tag { color: rgba(255, 255, 255, 0.85); }

.welcome-content h2 {
  margin: 14px 0 11px;
  font-size: clamp(23px, 2.5vw, 32px);
  letter-spacing: -0.8px;
}

.welcome-content p {
  max-width: 520px;
  margin: 0;
  color: rgba(3, 20, 11, 0.8);
  font-size: 12px;
  line-height: 1.9;
}

[data-theme="light"] .welcome-content p { color: rgba(255, 255, 255, 0.9); }

.welcome-button {
  display: inline-flex;
  align-items: center;
  gap: 19px;
  margin-top: 21px;
  padding: 12px 15px;
  border-radius: 7px;
  color: var(--green);
  background: var(--bg);
  font-size: 10px;
  font-weight: 800;
  text-decoration: none;
  transition: transform 0.2s;
}

.welcome-button:hover { transform: translateY(-2px); }
.welcome-button span { font-size: 16px; }

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
  border: 1px solid rgba(3, 20, 11, 0.15);
  border-radius: 50%;
}

.ring-two {
  top: 22px;
  right: 37px;
  width: 130px;
  height: 130px;
  background: rgba(3, 20, 11, 0.05);
}

.art-building {
  position: absolute;
  top: 42px;
  right: 74px;
  display: grid;
  place-items: center;
  width: 80px;
  height: 80px;
  border: 1px solid rgba(3, 20, 11, 0.2);
  border-radius: 21px;
  background: rgba(3, 20, 11, 0.1);
  font-size: 37px;
}

.art-leaf { position: absolute; font-size: 27px; }
.leaf-one { right: 5px; bottom: 16px; }
.leaf-two { top: 12px; left: 7px; }

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin: 29px 0 18px;
}

.section-kicker {
  color: var(--green);
  font-size: 9px;
  font-weight: 850;
  letter-spacing: 1.5px;
}

.section-heading h2,
.panel-header h2 {
  margin: 7px 0 5px;
  font-size: 17px;
  letter-spacing: -0.3px;
  color: var(--text);
}

.section-heading p {
  margin: 0;
  color: var(--muted);
  font-size: 10px;
}

.demo-badge {
  padding: 7px 10px;
  border: 1px solid rgba(216, 177, 93, 0.3);
  border-radius: 6px;
  color: #d8b15d;
  background: rgba(216, 177, 93, 0.08);
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
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--panel);
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 27px rgba(0, 0, 0, 0.2);
  border-color: rgba(113, 206, 128, 0.4);
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

.stat-icon.green { color: var(--green); background: var(--soft); }
.stat-icon.blue { color: #70b4f0; background: rgba(52, 116, 185, 0.15); }
.stat-icon.gold { color: #f0b35d; background: rgba(185, 121, 38, 0.15); }
.stat-icon.purple { color: #b195e0; background: rgba(124, 85, 174, 0.15); }

[data-theme="light"] .stat-icon.blue { color: #326cb0; background: #e7effa; }
[data-theme="light"] .stat-icon.gold { color: #987126; background: #fbf1d9; }
[data-theme="light"] .stat-icon.purple { color: #7c55ae; background: #f0e9fa; }

.stat-menu {
  border: 0;
  color: var(--muted);
  background: transparent;
  font-size: 23px;
  cursor: pointer;
}

.stat-title {
  margin: 18px 0 9px;
  color: var(--muted);
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
  color: var(--text);
}

.stat-period { color: var(--muted); font-size: 9px; }

.stat-progress {
  height: 4px;
  margin-top: 17px;
  overflow: hidden;
  border-radius: 5px;
  background: var(--soft);
}

.stat-progress span {
  display: block;
  height: 100%;
  border-radius: inherit;
}

.stat-progress span.green { background: var(--green); }
.stat-progress span.blue { background: #5788c9; }
.stat-progress span.gold { background: #d6b05b; }
.stat-progress span.purple { background: #9a79ca; }

.stat-caption {
  margin: 9px 0 0;
  color: var(--muted);
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
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--panel);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.panel-header h2 { margin-bottom: 0; }

.panel-header select {
  max-width: 115px;
  padding: 9px 10px;
  border: 1px solid var(--line);
  border-radius: 7px;
  outline-color: var(--green);
  color: var(--text);
  background: var(--soft);
  font: inherit;
  font-size: 10px;
  cursor: pointer;
}

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 17px;
  margin-top: 24px;
  color: var(--muted);
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

.green-dot { background: var(--green); }
.gold-dot { background: #d9b35e; }

.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  gap: 10px;
  height: 200px;
  margin-top: 19px;
  padding: 15px 5px 0;
  border-bottom: 1px solid var(--line);
  background: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent 39px,
    var(--soft) 40px
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

.bar.planned { background: var(--green); }
.bar.completed { background: #d9b35e; }

.bar > span {
  position: absolute;
  top: -16px;
  left: 50%;
  color: var(--muted);
  font-size: 8px;
  transform: translateX(-50%);
}

.chart-label {
  flex-shrink: 0;
  padding-bottom: 8px;
  color: var(--muted);
  font-size: 9px;
}

.chart-note {
  margin: 14px 0 0;
  color: var(--muted);
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
  color: var(--green);
  background: var(--soft);
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
  border-bottom: 1px solid var(--line);
  text-align: left;
  background: transparent;
  cursor: pointer;
}

.quick-action:last-child { border-bottom: 0; }

.action-icon {
  display: grid;
  place-items: center;
  width: 41px;
  height: 41px;
  flex-shrink: 0;
  border-radius: 10px;
  font-size: 20px;
}

.action-icon.green { color: var(--green); background: var(--soft); }
.action-icon.blue { color: #70b4f0; background: rgba(52, 116, 185, 0.15); }
.action-icon.gold { color: #f0b35d; background: rgba(185, 121, 38, 0.15); }
.action-icon.purple { color: #b195e0; background: rgba(124, 85, 174, 0.15); }

[data-theme="light"] .action-icon.blue { color: #326cb0; background: #e7effa; }
[data-theme="light"] .action-icon.gold { color: #987126; background: #fbf1d9; }
[data-theme="light"] .action-icon.purple { color: #7c55ae; background: #f0e9fa; }

.action-copy { flex: 1; min-width: 0; }
.action-copy strong,
.action-copy small { display: block; }
.action-copy strong { font-size: 11px; color: var(--text); }
.action-copy small {
  margin-top: 5px;
  color: var(--muted);
  font-size: 9px;
  line-height: 1.5;
}

.action-arrow {
  color: var(--muted);
  font-size: 17px;
  transition: transform 0.2s, color 0.2s;
}

.quick-action:hover .action-arrow {
  color: var(--green);
  transform: translateX(3px);
}

.bottom-grid {
  grid-template-columns: 1.35fr 1fr;
  margin-top: 18px;
}

.text-button {
  border: 0;
  color: var(--green);
  background: transparent;
  font: inherit;
  font-size: 10px;
  font-weight: 800;
  white-space: nowrap;
  cursor: pointer;
}

.announcement-list { margin-top: 17px; }

.announcement-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 15px 0;
  border-bottom: 1px solid var(--line);
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

.announcement-icon.green { background: var(--soft); }
.announcement-icon.blue { background: rgba(52, 116, 185, 0.15); }
.announcement-icon.gold { background: rgba(185, 121, 38, 0.15); }

.announcement-copy { flex: 1; min-width: 0; }

.announcement-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 9px;
  color: var(--muted);
  font-size: 8px;
}

.announcement-category { color: var(--green); font-weight: 800; }
.announcement-copy h3 { margin: 7px 0 5px; font-size: 11px; line-height: 1.6; color: var(--text); }
.announcement-copy p { margin: 0; color: var(--muted); font-size: 9px; line-height: 1.8; }

.announcement-arrow {
  flex-shrink: 0;
  border: 0;
  color: var(--muted);
  background: transparent;
  font-size: 17px;
  cursor: pointer;
  transition: color 0.2s;
}

.announcement-arrow:hover { color: var(--green); }

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
  background: var(--soft);
  font-size: 17px;
}

.information-list span,
.information-list strong { display: block; }

.information-list div div > span {
  margin-bottom: 5px;
  color: var(--muted);
  font-size: 9px;
}

.information-list strong {
  font-size: 10px;
  line-height: 1.6;
  color: var(--text);
}

.district-link {
  display: block;
  margin-top: 23px;
  padding: 13px;
  border: 1px solid var(--line);
  border-radius: 8px;
  color: var(--green);
  background: var(--soft);
  text-align: center;
  font-size: 10px;
  font-weight: 800;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s;
}

.district-link:hover {
  background: rgba(113, 206, 128, 0.1);
  transform: translateY(-2px);
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

.dashboard-modal {
  position: relative;
  width: 100%;
  max-width: 440px;
  padding: 32px;
  border-radius: 15px;
  background: var(--panel);
  border: 1px solid var(--line);
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
}

.modal-close {
  position: absolute;
  top: 13px;
  right: 15px;
  width: 33px;
  height: 33px;
  border: 0;
  border-radius: 8px;
  color: var(--muted);
  background: var(--soft);
  font-size: 23px;
  cursor: pointer;
  transition: color 0.2s;
}

.modal-close:hover { color: var(--text); }

.modal-icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  margin-bottom: 21px;
  border-radius: 12px;
  background: var(--soft);
  font-size: 24px;
}

.dashboard-modal h2 { margin: 12px 0; font-size: 24px; color: var(--text); }
.dashboard-modal > p { color: var(--muted); font-size: 12px; line-height: 1.9; }
.dashboard-modal .modal-note {
  padding: 13px;
  border-radius: 8px;
  background: var(--soft);
}

.modal-done {
  width: 100%;
  min-height: 43px;
  margin-top: 13px;
  border: 0;
  border-radius: 8px;
  color: var(--bg);
  background: var(--green);
  font: inherit;
  font-size: 12px;
  font-weight: 750;
  cursor: pointer;
  transition: background 0.2s;
}

.modal-done:hover { background: var(--green-strong, #36d58c); }

@media (max-width: 1200px) {
  .dashboard-content { padding-right: 22px; padding-left: 22px; }
  .stats-grid { gap: 11px; }
  .stat-card { padding: 15px; }
  .middle-grid, .bottom-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 950px) {
  .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .middle-grid, .bottom-grid { grid-template-columns: 1fr; }
}

@media (max-width: 650px) {
  .dashboard-content { padding: 16px 13px; }
  .welcome-banner { min-height: 225px; padding: 24px 21px; }
  .welcome-art {
    position: absolute;
    right: -65px;
    bottom: -12px;
    opacity: 0.22;
  }
  .welcome-content { max-width: 100%; }
  .welcome-content h2 { font-size: 24px; }
  .welcome-content p { max-width: 95%; }
  .section-heading { align-items: flex-start; }
  .stats-grid { gap: 10px; }
  .stat-card { padding: 13px; }
  .stat-icon { width: 35px; height: 35px; font-size: 18px; }
  .stat-title { min-height: 27px; line-height: 1.5; }
  .stat-bottom h3 { font-size: 23px; }
  .stat-period { font-size: 8px; }
  .panel { padding: 17px; }
  .chart-column { width: 32px; }
  .bar { width: 11px; }
}

@media (max-width: 370px) {
  .stats-grid { grid-template-columns: 1fr; }
  .stat-title { min-height: auto; }
  .section-heading h2 { font-size: 15px; }
  .demo-badge { font-size: 8px; }
}
</style>