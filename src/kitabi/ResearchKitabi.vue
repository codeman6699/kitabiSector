<template>
  <div class="research-page">
    <main>
      <div v-if="showNotifications" class="notification-panel">
        <strong>{{ t("research.notifTitle") }}</strong>
        <p>{{ t("research.notifText1") }}</p>
        <p>{{ t("research.notifText2") }}</p>
        <button @click="showNotifications = false">{{ t("research.close") }}</button>
      </div>

      <section class="page-body">
        <div class="page-heading">
          <div>
            <div class="eyebrow"><Microscope :size="15" /> {{ t("research.eyebrow") }}</div>
            <h1>{{ t("research.title") }}</h1>
            <p>{{ t("research.intro") }}</p>
          </div>
          <button class="primary-button" @click="showResearchInfo = true">
            <Plus :size="17" /> {{ t("research.guidelinesBtn") }}
          </button>
        </div>

        <section class="hero-banner">
          <div class="hero-content">
            <span class="hero-tag"><Lightbulb :size="15" /> {{ t("research.heroTag") }}</span>
            <h2>{{ t("research.heroTitle1") }}<br />{{ t("research.heroTitle2") }}</h2>
            <p>{{ t("research.heroText") }}</p>
            <button @click="scrollToLibrary">
              {{ t("research.heroButton") }} <ArrowRight :size="17" />
            </button>
          </div>
          <div class="hero-graphic">
            <div class="graphic-circle circle-one"></div>
            <div class="graphic-circle circle-two"></div>
            <div class="graphic-card">
              <div class="graphic-icon"><Microscope :size="35" /></div>
              <span>{{ t("research.heroCardTag") }}</span>
              <strong>{{ t("research.heroCardTitle1") }}<br />{{ t("research.heroCardTitle2") }}</strong>
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
              <span>{{ t("research.statRecords") }}</span>
              <h3>{{ researchItems.length }}</h3>
              <small>{{ t("research.statRecordsSub") }}</small>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon blue"><CheckCircle2 :size="22" /></div>
            <div>
              <span>{{ t("research.statPublished") }}</span>
              <h3>{{ countByStatus("Published") }}</h3>
              <small>{{ t("research.statPublishedSub") }}</small>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon orange"><Clock3 :size="22" /></div>
            <div>
              <span>{{ t("research.statProgress") }}</span>
              <h3>{{ countByStatus("In Progress") }}</h3>
              <small>{{ t("research.statProgressSub") }}</small>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon purple"><FolderOpen :size="22" /></div>
            <div>
              <span>{{ t("research.statTopics") }}</span>
              <h3>{{ topicCount }}</h3>
              <small>{{ t("research.statTopicsSub") }}</small>
            </div>
          </div>
        </div>

        <section class="topics-section">
          <div class="section-heading">
            <div>
              <span class="section-kicker">{{ t("research.topicsKicker") }}</span>
              <h2>{{ t("research.topicsTitle") }}</h2>
              <p>{{ t("research.topicsText") }}</p>
            </div>
          </div>

          <div class="topics-grid">
            <button
              v-for="topic in topics"
              :key="topic.key"
              class="topic-card"
              :class="{ 'topic-selected': activeTopic === topic.key }"
              @click="selectTopic(topic.key)"
            >
              <div class="topic-icon" :class="topic.color">
                <component :is="topic.icon" :size="23" />
              </div>
              <div class="topic-text">
                <h3>{{ t(topic.nameKey) }}</h3>
                <p>{{ t(topic.descKey) }}</p>
              </div>
              <ArrowUpRight :size="17" class="topic-arrow" />
            </button>
          </div>
        </section>

        <section ref="librarySection" class="library-section">
          <div class="section-heading library-heading">
            <div>
              <span class="section-kicker">{{ t("research.libraryKicker") }}</span>
              <h2>{{ t("research.libraryTitle") }}</h2>
              <p>{{ t("research.libraryText") }}</p>
            </div>
            <button class="export-button" @click="exportResearch">
              <Download :size="16" /> {{ t("research.exportBtn") }}
            </button>
          </div>

          <div class="library-toolbar">
            <div class="library-search">
              <Search :size="17" />
              <input v-model="searchQuery" :placeholder="t('research.searchPlaceholder')" />
            </div>
            <select v-model="statusFilter" :aria-label="t('research.statusLabel')">
              <option value="All">{{ t("research.statusAll") }}</option>
              <option value="Published">{{ t("research.statusPublished") }}</option>
              <option value="In Progress">{{ t("research.statusProgress") }}</option>
              <option value="Draft">{{ t("research.statusDraft") }}</option>
            </select>
            <select v-model="yearFilter" :aria-label="t('research.yearLabel')">
              <option value="All">{{ t("research.yearAll") }}</option>
              <option v-for="year in availableYears" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>

          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>{{ t("research.thTitle") }}</th>
                  <th>{{ t("research.thCategory") }}</th>
                  <th>{{ t("research.thYear") }}</th>
                  <th>{{ t("research.thStatus") }}</th>
                  <th>{{ t("research.thAction") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredResearch" :key="item.id">
                  <td>
                    <div class="research-title-cell">
                      <div class="document-icon"><FileText :size="19" /></div>
                      <div>
                        <strong>{{ t(item.titleKey) }}</strong>
                        <span>{{ t(item.descKey) }}</span>
                      </div>
                    </div>
                  </td>
                  <td><span class="category-label">{{ t(item.categoryLabelKey) }}</span></td>
                  <td>{{ item.year }}</td>
                  <td>
                    <span class="status-pill" :class="statusClass(item.status)">
                      <span></span>{{ t(item.statusLabelKey) }}
                    </span>
                  </td>
                  <td>
                    <button class="view-button" @click="viewResearch(item)">
                      {{ t("research.viewBtn") }} <ArrowUpRight :size="14" />
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredResearch.length === 0">
                  <td colspan="5" class="empty-cell">
                    <Search :size="28" />
                    <strong>{{ t("research.emptyTitle") }}</strong>
                    <span>{{ t("research.emptyText") }}</span>
                    <button @click="resetFilters">{{ t("research.emptyReset") }}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="research-cta">
          <div class="cta-icon"><GraduationCap :size="28" /></div>
          <div>
            <h3>{{ t("research.ctaTitle") }}</h3>
            <p>{{ t("research.ctaText") }}</p>
          </div>
          <a href="https://www.nyamagabe.gov.rw/" target="_blank" rel="noopener noreferrer">
            {{ t("research.ctaButton") }} <ArrowUpRight :size="16" />
          </a>
        </section>
      </section>
    </main>

    <div v-if="selectedResearch" class="modal-backdrop" @click.self="selectedResearch = null">
      <div class="research-modal">
        <button class="modal-close" @click="selectedResearch = null" :aria-label="t('research.close')">
          <X :size="20" />
        </button>
        <div class="modal-document-icon"><FileText :size="28" /></div>
        <span class="section-kicker">{{ t("research.modalKicker") }}</span>
        <h2>{{ t(selectedResearch.titleKey) }}</h2>
        <p>{{ t(selectedResearch.descKey) }}</p>
        <div class="detail-list">
          <div><span>{{ t("research.detailCategory") }}</span><strong>{{ t(selectedResearch.categoryLabelKey) }}</strong></div>
          <div><span>{{ t("research.detailYear") }}</span><strong>{{ selectedResearch.year }}</strong></div>
          <div><span>{{ t("research.detailStatus") }}</span><strong>{{ t(selectedResearch.statusLabelKey) }}</strong></div>
          <div><span>{{ t("research.detailSource") }}</span><strong>{{ t(selectedResearch.sourceKey) }}</strong></div>
        </div>
        <p class="demo-notice">{{ t("research.demoNotice") }}</p>
        <button class="primary-button modal-done" @click="selectedResearch = null">{{ t("research.modalClose") }}</button>
      </div>
    </div>

    <div v-if="showResearchInfo" class="modal-backdrop" @click.self="showResearchInfo = false">
      <div class="research-modal guidelines-modal">
        <button class="modal-close" @click="showResearchInfo = false" :aria-label="t('research.close')">
          <X :size="20" />
        </button>
        <div class="modal-document-icon"><BookOpen :size="28" /></div>
        <span class="section-kicker">{{ t("research.guideKicker") }}</span>
        <h2>{{ t("research.guideTitle") }}</h2>
        <p>{{ t("research.guideText") }}</p>
        <ul>
          <li>{{ t("research.guide1") }}</li>
          <li>{{ t("research.guide2") }}</li>
          <li>{{ t("research.guide3") }}</li>
          <li>{{ t("research.guide4") }}</li>
        </ul>
        <button class="primary-button modal-done" @click="showResearchInfo = false">{{ t("research.guideUnderstood") }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Microscope, BookOpen, ArrowUpRight, Search, X, Plus, Lightbulb,
  ArrowRight, FileText, CheckCircle2, Clock3, FolderOpen, Download,
  GraduationCap, Leaf, Wheat, ChartNoAxesCombined, HeartPulse,
  UsersRound, Building2
} from "lucide-vue-next";

export default {
  name: "ResearchView",
  components: {
    Microscope, BookOpen, ArrowUpRight, Search, X, Plus, Lightbulb,
    ArrowRight, FileText, CheckCircle2, Clock3, FolderOpen, Download,
    GraduationCap, Leaf, Wheat, ChartNoAxesCombined, HeartPulse,
    UsersRound, Building2
  },
  inject: {
    t: { default: (k) => k },
    language: { default: () => "en" },
    theme: { default: () => "dark" }
  },

  data() {
    return {
      searchQuery: "",
      statusFilter: "All",
      yearFilter: "All",
      activeTopic: "All",
      selectedResearch: null,
      showResearchInfo: false,
      showNotifications: false,

      topics: [
        { key: "Agriculture", nameKey: "research.topicAgriculture", descKey: "research.topicAgricultureText", icon: Wheat, color: "green" },
        { key: "Environment", nameKey: "research.topicEnvironment", descKey: "research.topicEnvironmentText", icon: Leaf, color: "blue" },
        { key: "Community", nameKey: "research.topicCommunity", descKey: "research.topicCommunityText", icon: UsersRound, color: "orange" },
        { key: "Education", nameKey: "research.topicEducation", descKey: "research.topicEducationText", icon: BookOpen, color: "purple" },
        { key: "Public Health", nameKey: "research.topicHealth", descKey: "research.topicHealthText", icon: HeartPulse, color: "red" },
        { key: "Infrastructure", nameKey: "research.topicInfrastructure", descKey: "research.topicInfrastructureText", icon: Building2, color: "teal" }
      ],

      researchItems: [
        {
          id: 1,
          category: "Agriculture",
          categoryLabelKey: "research.topicAgriculture",
          year: "2025",
          status: "Published",
          statusLabelKey: "research.statusPublished",
          titleKey: "research.r1Title",
          descKey: "research.r1Desc",
          sourceKey: "research.sourceSample"
        },
        {
          id: 2,
          category: "Environment",
          categoryLabelKey: "research.topicEnvironment",
          year: "2025",
          status: "In Progress",
          statusLabelKey: "research.statusProgress",
          titleKey: "research.r2Title",
          descKey: "research.r2Desc",
          sourceKey: "research.sourceSample"
        },
        {
          id: 3,
          category: "Community",
          categoryLabelKey: "research.topicCommunity",
          year: "2024",
          status: "Published",
          statusLabelKey: "research.statusPublished",
          titleKey: "research.r3Title",
          descKey: "research.r3Desc",
          sourceKey: "research.sourceSample"
        },
        {
          id: 4,
          category: "Education",
          categoryLabelKey: "research.topicEducation",
          year: "2024",
          status: "Draft",
          statusLabelKey: "research.statusDraft",
          titleKey: "research.r4Title",
          descKey: "research.r4Desc",
          sourceKey: "research.sourceSample"
        },
        {
          id: 5,
          category: "Public Health",
          categoryLabelKey: "research.topicHealth",
          year: "2025",
          status: "In Progress",
          statusLabelKey: "research.statusProgress",
          titleKey: "research.r5Title",
          descKey: "research.r5Desc",
          sourceKey: "research.sourceSample"
        },
        {
          id: 6,
          category: "Infrastructure",
          categoryLabelKey: "research.topicInfrastructure",
          year: "2023",
          status: "Published",
          statusLabelKey: "research.statusPublished",
          titleKey: "research.r6Title",
          descKey: "research.r6Desc",
          sourceKey: "research.sourceSample"
        }
      ]
    };
  },

  computed: {
    filteredResearch() {
      const q = this.searchQuery.trim().toLowerCase();
      return this.researchItems.filter((item) => {
        const matchesSearch =
          !q ||
          this.t(item.titleKey).toLowerCase().includes(q) ||
          this.t(item.descKey).toLowerCase().includes(q) ||
          this.t(item.categoryLabelKey).toLowerCase().includes(q);
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
      return new Set(this.researchItems.map((item) => item.category)).size;
    },
    availableYears() {
      return [...new Set(this.researchItems.map((item) => item.year))].sort().reverse();
    }
  },

  methods: {
    countByStatus(status) {
      return this.researchItems.filter((item) => item.status === status).length;
    },
    statusClass(status) {
      return status.toLowerCase().replace(/\s+/g, "-");
    },
    selectTopic(topic) {
      this.activeTopic = this.activeTopic === topic ? "All" : topic;
      this.$refs.librarySection?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    scrollToLibrary() {
      this.$refs.librarySection?.scrollIntoView({ behavior: "smooth", block: "start" });
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
      const rows = this.filteredResearch.map((item) => [
        this.t(item.titleKey),
        this.t(item.categoryLabelKey),
        item.year,
        this.t(item.statusLabelKey),
        this.t(item.descKey),
        this.t(item.sourceKey)
      ]);
      const escapeCSV = (v) => `"${String(v).replace(/"/g, '""')}"`;
      const csv = [headers, ...rows].map((row) => row.map(escapeCSV).join(",")).join("\r\n");
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
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
.research-page {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: Inter, "Segoe UI", Arial, sans-serif;
  transition: background 0.25s ease, color 0.25s ease;
}

.research-page * { box-sizing: border-box; }

.notification-panel {
  width: 280px;
  position: fixed;
  top: 67px;
  right: 30px;
  z-index: 150;
  padding: 19px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 13px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  font-size: 12px;
}

.notification-panel p { color: var(--muted); line-height: 1.6; }

.notification-panel button {
  padding: 8px 13px;
  color: var(--bg);
  background: var(--green);
  border: 0;
  border-radius: 7px;
  font-weight: 700;
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
  color: var(--green);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.4px;
}

.page-heading h1 {
  margin: 11px 0 8px;
  color: var(--text);
  font-size: clamp(27px, 3vw, 35px);
  font-weight: 800;
  letter-spacing: -1px;
}

.page-heading p {
  max-width: 590px;
  margin: 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.8;
}

.primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 12px 15px;
  color: var(--bg);
  background: var(--green);
  border: 0;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 750;
  white-space: nowrap;
  transition: background 0.2s, transform 0.2s;
}

.primary-button:hover {
  background: var(--green-strong, #36d58c);
  transform: translateY(-2px);
}

.hero-banner {
  min-height: 295px;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 35px 40px;
  color: var(--bg);
  background: linear-gradient(112deg, var(--green-deep, #087c4c), var(--green));
  border-radius: 17px;
}

.hero-content { max-width: 530px; position: relative; z-index: 2; }

.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 10px;
  color: var(--bg);
  background: rgba(3, 20, 11, 0.15);
  border: 1px solid rgba(3, 20, 11, 0.2);
  border-radius: 6px;
  font-size: 9px;
  font-weight: 750;
  letter-spacing: 0.9px;
}

[data-theme="light"] .hero-tag {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
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
  color: rgba(3, 20, 11, 0.8);
  font-size: 12px;
  line-height: 1.8;
}

[data-theme="light"] .hero-content p { color: rgba(255, 255, 255, 0.9); }

.hero-content > button {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-top: 19px;
  padding: 12px 15px;
  color: var(--green);
  background: var(--bg);
  border: 0;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
  transition: transform 0.2s;
}

.hero-content > button:hover { transform: translateY(-2px); }

.hero-graphic {
  width: 300px;
  height: 290px;
  position: absolute;
  top: 0;
  right: 6%;
}

.graphic-circle {
  position: absolute;
  border: 1px solid rgba(3, 20, 11, 0.15);
  border-radius: 50%;
}

.circle-one { width: 260px; height: 260px; top: 15px; right: 4px; }
.circle-two { width: 205px; height: 205px; top: 43px; right: 31px; }

.graphic-card {
  width: 180px;
  position: absolute;
  top: 52px;
  right: 45px;
  padding: 21px;
  color: var(--text);
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 15px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.3);
  transform: rotate(4deg);
}

.graphic-icon {
  width: 43px;
  height: 43px;
  display: grid;
  place-items: center;
  color: var(--green);
  background: var(--soft);
  border-radius: 11px;
}

.graphic-card > span {
  display: block;
  margin-top: 17px;
  color: var(--muted);
  font-size: 7px;
  font-weight: 800;
  letter-spacing: 1px;
}

.graphic-card > strong {
  display: block;
  margin-top: 7px;
  font-size: 20px;
  line-height: 1.1;
  color: var(--text);
}

.graphic-lines { display: grid; gap: 5px; margin-top: 14px; }
.graphic-lines i { height: 4px; background: var(--line); border-radius: 4px; }
.graphic-lines i:nth-child(2) { width: 80%; }
.graphic-lines i:nth-child(3) { width: 57%; }

.floating-icon {
  width: 45px;
  height: 45px;
  position: absolute;
  z-index: 3;
  display: grid;
  place-items: center;
  color: var(--green);
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.floating-book { top: 32px; right: 195px; transform: rotate(-9deg); }
.floating-chart { right: 7px; bottom: 39px; transform: rotate(7deg); }

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
  background: var(--panel);
  border: 1px solid var(--line);
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

.stat-icon.green { color: var(--green); background: var(--soft); }
.stat-icon.blue { color: #70b4f0; background: rgba(52, 116, 185, 0.15); }
.stat-icon.orange { color: #f0b35d; background: rgba(185, 121, 38, 0.15); }
.stat-icon.purple { color: #b195e0; background: rgba(124, 85, 174, 0.15); }

[data-theme="light"] .stat-icon.blue { color: #326cb0; background: #e7effa; }
[data-theme="light"] .stat-icon.orange { color: #987126; background: #fbf1d9; }
[data-theme="light"] .stat-icon.purple { color: #7c55ae; background: #f0e9fa; }

.stat-card span { display: block; color: var(--muted); font-size: 10px; }
.stat-card h3 { margin: 5px 0 4px; color: var(--text); font-size: 24px; line-height: 1; }
.stat-card small { color: var(--muted); font-size: 9px; }

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
  color: var(--green);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

.section-heading h2 {
  margin: 7px 0 6px;
  color: var(--text);
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.section-heading p { margin: 0; color: var(--muted); font-size: 11px; }

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
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 12px;
  transition: 0.2s;
}

.topic-card:hover,
.topic-card.topic-selected {
  border-color: rgba(113, 206, 128, 0.4);
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.topic-card.topic-selected { background: var(--soft); }

.topic-icon {
  width: 43px;
  height: 43px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 11px;
}

.topic-icon.green { color: var(--green); background: var(--soft); }
.topic-icon.blue { color: #70b4f0; background: rgba(52, 116, 185, 0.15); }
.topic-icon.orange { color: #f0b35d; background: rgba(185, 121, 38, 0.15); }
.topic-icon.purple { color: #b195e0; background: rgba(124, 85, 174, 0.15); }
.topic-icon.red { color: #e57373; background: rgba(196, 91, 91, 0.15); }
.topic-icon.teal { color: #58c9c1; background: rgba(22, 135, 127, 0.15); }

[data-theme="light"] .topic-icon.blue { color: #326cb0; background: #e7effa; }
[data-theme="light"] .topic-icon.orange { color: #987126; background: #fbf1d9; }
[data-theme="light"] .topic-icon.purple { color: #7c55ae; background: #f0e9fa; }
[data-theme="light"] .topic-icon.red { color: #b04141; background: #ffe9e9; }
[data-theme="light"] .topic-icon.teal { color: #0e6e68; background: #e0f6f3; }

.topic-text { min-width: 0; flex: 1; }
.topic-text h3 { margin: 0 0 6px; color: var(--text); font-size: 12px; }
.topic-text p { margin: 0; color: var(--muted); font-size: 9px; line-height: 1.5; }
.topic-arrow { flex-shrink: 0; color: var(--muted); }

.library-heading { margin-bottom: 21px; }

.export-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 13px;
  color: var(--green);
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 8px;
  font-size: 10px;
  font-weight: 750;
  white-space: nowrap;
  transition: background 0.2s;
}

.export-button:hover { background: var(--soft); }

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
  color: var(--muted);
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 8px;
}

.library-search input {
  width: 100%;
  min-width: 0;
  color: var(--text);
  background: transparent;
  border: 0;
  outline: 0;
  font-size: 11px;
}

.library-search input::placeholder { color: var(--muted); }

.library-toolbar select {
  max-width: 150px;
  height: 40px;
  padding: 0 11px;
  color: var(--text);
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 8px;
  outline: 0;
  font-size: 10px;
  cursor: pointer;
}

.table-container {
  overflow-x: auto;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 12px;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

thead { background: var(--soft); }

th {
  padding: 14px 16px;
  color: var(--muted);
  border-bottom: 1px solid var(--line);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.7px;
  white-space: nowrap;
}

td {
  padding: 15px 16px;
  color: var(--muted);
  border-bottom: 1px solid var(--line);
  font-size: 10px;
  white-space: nowrap;
}

tbody tr:last-child td { border-bottom: 0; }
tbody tr:hover:not(:last-child) { background: var(--soft); }

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
  color: var(--green);
  background: var(--soft);
  border-radius: 9px;
}

.research-title-cell > div:last-child {
  display: grid;
  gap: 5px;
}

.research-title-cell strong {
  max-width: 290px;
  overflow: hidden;
  color: var(--text);
  font-size: 11px;
  text-overflow: ellipsis;
}

.research-title-cell span {
  max-width: 300px;
  overflow: hidden;
  color: var(--muted);
  font-size: 9px;
  text-overflow: ellipsis;
}

.category-label {
  padding: 6px 8px;
  color: var(--green);
  background: var(--soft);
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

.status-pill.published { color: var(--green); background: rgba(124, 221, 121, 0.1); }
.status-pill.in-progress { color: #f0b35d; background: rgba(185, 121, 38, 0.15); }
.status-pill.draft { color: #b195e0; background: rgba(124, 85, 174, 0.15); }

[data-theme="light"] .status-pill.in-progress { color: #987126; background: #fbf1d9; }
[data-theme="light"] .status-pill.draft { color: #7c55ae; background: #f0e9fa; }

.view-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  color: var(--green);
  background: var(--soft);
  border: 0;
  border-radius: 7px;
  font-size: 10px;
  font-weight: 750;
  transition: background 0.2s;
}

.view-button:hover { background: rgba(113, 206, 128, 0.15); }

.empty-cell {
  padding: 40px 15px;
  color: var(--muted);
  text-align: center;
}

.empty-cell svg,
.empty-cell strong,
.empty-cell span { display: block; margin: 8px auto; }
.empty-cell strong { color: var(--text); }

.empty-cell button {
  padding: 8px 12px;
  color: var(--bg);
  background: var(--green);
  border: 0;
  border-radius: 7px;
  font-weight: 700;
}

.research-cta {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 13px;
}

.cta-icon {
  width: 49px;
  height: 49px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  color: var(--green);
  background: var(--soft);
  border: 1px solid var(--line);
  border-radius: 12px;
}

.research-cta > div:nth-child(2) { flex: 1; }
.research-cta h3 { margin: 0 0 6px; color: var(--text); font-size: 13px; }
.research-cta p { margin: 0; color: var(--muted); font-size: 10px; line-height: 1.7; }

.research-cta > a {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 11px 13px;
  color: var(--bg);
  background: var(--green);
  border-radius: 8px;
  text-decoration: none;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
  transition: background 0.2s;
}

.research-cta > a:hover { background: var(--green-strong, #36d58c); }

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: grid;
  place-items: center;
  overflow-y: auto;
  padding: 24px;
  background: rgba(3, 20, 11, 0.85);
  backdrop-filter: blur(5px);
}

.research-modal {
  width: min(100%, 540px);
  position: relative;
  padding: 30px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: 0 20px 80px rgba(0, 0, 0, 0.5);
}

.modal-close {
  width: 36px;
  height: 36px;
  position: absolute;
  top: 13px;
  right: 13px;
  display: grid;
  place-items: center;
  color: var(--muted);
  background: var(--soft);
  border: 0;
  border-radius: 50%;
  transition: color 0.2s;
}

.modal-close:hover { color: var(--text); }

.modal-document-icon {
  width: 50px;
  height: 50px;
  display: grid;
  place-items: center;
  margin-bottom: 18px;
  color: var(--green);
  background: var(--soft);
  border-radius: 12px;
}

.research-modal h2 { margin: 9px 0 12px; color: var(--text); font-size: 23px; line-height: 1.35; }
.research-modal > p { color: var(--muted); font-size: 12px; line-height: 1.8; }

.detail-list {
  margin-top: 20px;
  border-top: 1px solid var(--line);
}

.detail-list > div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
  font-size: 11px;
}

.detail-list span { color: var(--muted); }
.detail-list strong { color: var(--text); text-align: right; }

.research-modal .demo-notice {
  padding: 12px;
  color: #f0b35d;
  background: rgba(185, 121, 38, 0.15);
  border-radius: 7px;
  font-size: 10px;
}

.modal-done { margin-top: 10px; }

.guidelines-modal ul {
  padding-left: 20px;
  color: var(--muted);
  font-size: 12px;
  line-height: 2;
}

@media (min-width: 1600px) {
  .page-body { padding-right: 48px; padding-left: 48px; }
}

@media (max-width: 1250px) {
  .page-body { padding: 29px 24px 20px; }
  .stats-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .topics-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .hero-graphic { right: 1%; opacity: 0.8; }
}

@media (max-width: 760px) {
  .page-body { padding: 25px 16px 20px; }
  .page-heading { align-items: flex-start; margin-bottom: 20px; }
  .page-heading h1 { font-size: 28px; }
  .page-heading p { font-size: 11px; }
  .page-heading > button { padding: 10px; font-size: 0; }
  .page-heading > button svg { width: 18px; height: 18px; }
  .hero-banner { min-height: 290px; padding: 25px 22px; }
  .hero-content { max-width: 100%; }
  .hero-content h2 { font-size: 29px; }
  .hero-content p { max-width: 390px; font-size: 11px; }
  .hero-graphic { right: -130px; opacity: 0.2; }
  .stats-row { gap: 10px; margin: 16px 0 30px; }
  .stat-card { padding: 13px 11px; gap: 9px; }
  .stat-icon { width: 38px; height: 38px; }
  .stat-card span { font-size: 9px; }
  .stat-card h3 { font-size: 21px; }
  .topics-grid { gap: 10px; }
  .topic-card { padding: 13px 10px; gap: 9px; }
  .topic-icon { width: 37px; height: 37px; }
  .topic-text h3 { font-size: 11px; }
  .topic-text p { font-size: 9px; }
  .library-toolbar { flex-wrap: wrap; }
  .library-search { flex-basis: 100%; }
  .library-toolbar select { flex: 1; max-width: none; }
  .table-container table { min-width: 750px; }
  .research-cta { align-items: flex-start; flex-wrap: wrap; padding: 17px; }
  .research-cta > div:nth-child(2) { min-width: 0; }
  .research-cta > a { width: 100%; justify-content: center; }
}

@media (max-width: 420px) {
  .page-body { padding-right: 12px; padding-left: 12px; }
  .page-heading h1 { font-size: 25px; }
  .hero-banner { min-height: 305px; }
  .hero-content h2 { font-size: 26px; }
  .stats-row { grid-template-columns: 1fr; }
  .topics-grid { grid-template-columns: 1fr; }
  .section-heading h2 { font-size: 19px; }
  .library-heading { align-items: flex-start; }
  .export-button { padding: 9px; font-size: 0; }
  .export-button svg { width: 17px; height: 17px; }
  .modal-backdrop { padding: 12px; }
  .research-modal { padding: 23px; }
}
</style>