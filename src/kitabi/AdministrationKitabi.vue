<template>
  <div class="administration-page">
    <main>
      <section class="hero">
        <div class="hero-content">
          <span class="eyebrow">{{ t("admin.eyebrow") }}</span>
          <h1>{{ t("admin.title") }} <span>{{ t("admin.titleSpan") }}</span></h1>
          <p>{{ t("admin.intro") }}</p>
          <div class="breadcrumbs">
            <router-link to="/">{{ t("nav.home") }}</router-link>
            <span>/</span>
            <span>{{ t("nav.administration") }}</span>
          </div>
        </div>
        <div class="hero-decoration">KS</div>
      </section>

      <section class="overview section">
        <div class="section-heading">
          <span class="section-tag">{{ t("admin.overviewTag") }}</span>
          <h2>{{ t("admin.overviewTitle") }}</h2>
          <p>{{ t("admin.overviewText") }}</p>
        </div>

        <div class="overview-grid">
          <article class="overview-card">
            <div class="overview-icon">🏛️</div>
            <h3>{{ t("admin.cardGovTitle") }}</h3>
            <p>{{ t("admin.cardGovText") }}</p>
          </article>
          <article class="overview-card">
            <div class="overview-icon">👥</div>
            <h3>{{ t("admin.cardServicesTitle") }}</h3>
            <p>{{ t("admin.cardServicesText") }}</p>
          </article>
          <article class="overview-card">
            <div class="overview-icon">📊</div>
            <h3>{{ t("admin.cardDevTitle") }}</h3>
            <p>{{ t("admin.cardDevText") }}</p>
          </article>
          <article class="overview-card">
            <div class="overview-icon">🤝</div>
            <h3>{{ t("admin.cardParticipationTitle") }}</h3>
            <p>{{ t("admin.cardParticipationText") }}</p>
          </article>
        </div>
      </section>

      <section class="leadership section">
        <div class="section-heading">
          <span class="section-tag">{{ t("admin.leadershipTag") }}</span>
          <h2>{{ t("admin.leadershipTitle") }}</h2>
          <p>{{ t("admin.leadershipText") }}</p>
        </div>

        <div class="notice">
          <span class="notice-icon">ℹ️</span>
          <p>
            <strong>{{ t("admin.noticeStrong") }}</strong>
            {{ t("admin.noticeText") }}
          </p>
        </div>

        <div class="leaders-grid">
          <article class="leader-card" v-for="leader in leaders" :key="leader.role">
            <!-- ✅ Same photo for all, gradient tint per leader -->
            <div class="leader-photo" :style="leaderPhotoStyle(leader)">
              <span>{{ leader.initials }}</span>
              <div class="photo-badge">KS</div>
            </div>
            <div class="leader-info">
              <span class="leader-label">{{ t("admin.leaderLabel") }}</span>
              <h3>{{ leader.name }}</h3>
              <p class="leader-role">{{ leader.role }}</p>
              <p class="leader-description">{{ leader.description }}</p>
              <button class="profile-button" @click="showProfile(leader)">
                {{ t("admin.viewResponsibilities") }} <span>→</span>
              </button>
            </div>
          </article>
        </div>
      </section>

      <section class="structure-section section">
        <div class="section-heading">
          <span class="section-tag">{{ t("admin.structureTag") }}</span>
          <h2>{{ t("admin.structureTitle") }}</h2>
          <p>{{ t("admin.structureText") }}</p>
        </div>

        <div class="structure">
          <div class="structure-level district">
            <span class="structure-icon">🏛️</span>
            <div>
              <strong>{{ t("admin.structureDistrict") }}</strong>
              <p>{{ t("admin.structureDistrictText") }}</p>
            </div>
          </div>

          <div class="structure-connector"></div>

          <div class="structure-level sector">
            <span class="structure-icon">🏢</span>
            <div>
              <strong>{{ t("admin.structureSector") }}</strong>
              <p>{{ t("admin.structureSectorText") }}</p>
            </div>
          </div>

          <div class="structure-connector"></div>

          <div class="community-levels">
            <div class="structure-level community">
              <span class="structure-icon">🏘️</span>
              <div>
                <strong>{{ t("admin.structureCells") }}</strong>
                <p>{{ t("admin.structureCellsText") }}</p>
              </div>
            </div>
            <div class="structure-level community">
              <span class="structure-icon">👥</span>
              <div>
                <strong>{{ t("admin.structureVillages") }}</strong>
                <p>{{ t("admin.structureVillagesText") }}</p>
              </div>
            </div>
          </div>
          <p class="structure-note">{{ t("admin.structureNote") }}</p>
        </div>
      </section>

      <section class="responsibilities section">
        <div class="responsibilities-content">
          <span class="section-tag">{{ t("admin.responsibilitiesTag") }}</span>
          <h2>{{ t("admin.responsibilitiesTitle") }}</h2>
          <p>{{ t("admin.responsibilitiesText") }}</p>

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
            <span>{{ t("admin.commitmentLabel") }}</span>
            <span class="visual-symbol">✦</span>
          </div>
          <div class="visual-emblem">🤝</div>
          <h3>{{ t("admin.commitmentTitle") }}</h3>
          <p>{{ t("admin.commitmentText") }}</p>
          <div class="visual-bottom">
            <span>{{ t("admin.commitmentTag1") }}</span>
            <span>{{ t("admin.commitmentTag2") }}</span>
            <span>{{ t("admin.commitmentTag3") }}</span>
          </div>
        </div>
      </section>

      <section class="contact-section" id="contact">
        <div class="contact-icon">💬</div>
        <div class="contact-copy">
          <span>{{ t("admin.contactTag") }}</span>
          <h2>{{ t("admin.contactTitle") }}</h2>
          <p>{{ t("admin.contactText") }}</p>
        </div>
        <a
          href="https://www.nyamagabe.gov.rw/"
          target="_blank"
          rel="noopener noreferrer"
          class="contact-button"
        >
          {{ t("admin.contactButton") }} ↗
        </a>
      </section>
    </main>

    <div v-if="selectedLeader" class="modal-overlay" @click.self="closeProfile">
      <div class="profile-modal">
        <button class="close-button" @click="closeProfile" :aria-label="t('admin.modalClose')">×</button>
        <div class="modal-avatar">{{ selectedLeader.initials }}</div>
        <span class="section-tag">{{ t("admin.modalTag") }}</span>
        <h2>{{ selectedLeader.role }}</h2>
        <h3>{{ selectedLeader.name }}</h3>
        <p>{{ selectedLeader.description }}</p>
        <div class="modal-note">{{ t("admin.modalNote") }}</div>
        <button class="modal-button" @click="closeProfile">{{ t("admin.modalClose") }}</button>
      </div>
    </div>
  </div>
</template>

<script>
// ✅ Single shared image — same file for all three leaders
import leaderImg from "../assets/images/kennedy.png";

export default {
  name: "AdministrationView",
  inject: {
    t: { default: (k) => k },
    language: { default: () => "en" },
    theme: { default: () => "dark" }
  },

  data() {
    return {
      currentYear: new Date().getFullYear(),
      selectedLeader: null,
      leaders: [
        {
          initials: "SEO",
          name: "NZEYIMANA Ettienne",
          role: "Sector Executive Secretary",
          description: "Coordinates sector administration, public service delivery, and implementation of local priorities.",
          color: "leader-green",
          image: leaderImg
        },
        {
          initials: "AD",
          name: "GASORE JEAN Claude",
          role: "Administrative Officer",
          description: "Supports administrative coordination, records, communication, and the delivery of public services.",
          color: "leader-gold",
          image: leaderImg
        },
        {
          initials: "CDR",
          name: "NZEYIMANA ELIE Kennedy",
          role: "Community Development Representative",
          description: "Supports community engagement and coordination of local development activities.",
          color: "leader-blue",
          image: leaderImg
        }
      ],
      responsibilities: [
        {
          title: "Public Service Coordination",
          description: "Help residents find the appropriate public services and administrative information."
        },
        {
          title: "Community Development",
          description: "Support local initiatives and coordinate community development priorities."
        },
        {
          title: "Communication & Information",
          description: "Share public notices, relevant information, and community updates."
        },
        {
          title: "Accountability & Participation",
          description: "Encourage responsible administration and constructive resident participation."
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
    },
    /**
     * Same photo for every leader, but each keeps a unique color tint
     * so the three cards are visually distinct.
     */
    leaderPhotoStyle(leader) {
      const gradients = {
        "leader-green": "linear-gradient(135deg, rgba(17,59,38,.55), rgba(7,80,52,.55))",
        "leader-gold": "linear-gradient(135deg, rgba(59,46,17,.55), rgba(84,67,15,.55))",
        "leader-blue": "linear-gradient(135deg, rgba(17,42,59,.55), rgba(15,64,84,.55))"
      };
      const gradient = gradients[leader.color] || "none";

      return {
        backgroundImage: `${gradient}, url(${leader.image})`,
        backgroundSize: "cover, cover",
        backgroundPosition: "center, center",
        backgroundRepeat: "no-repeat, no-repeat"
      };
    }
  },

  beforeUnmount() {
    document.body.style.overflow = "";
  }
};
</script>

<style scoped>
.administration-page {
  color: var(--text);
  background: var(--bg);
  font-family: Inter, "Segoe UI", Arial, sans-serif;
  min-height: 100vh;
  transition: background 0.25s ease, color 0.25s ease;
}

.administration-page * { box-sizing: border-box; }

.hero {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 340px;
  padding: 65px 8%;
  overflow: hidden;
  color: var(--text);
  background:
    linear-gradient(115deg, rgba(3, 20, 11, 0.95), rgba(7, 27, 16, 0.8)),
    url("https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1800&q=85")
    center 48% / cover;
  border-bottom: 1px solid var(--line);
}

.hero::before,
.hero::after {
  position: absolute;
  content: "";
  width: 360px;
  height: 360px;
  right: 8%;
  top: -160px;
  border: 1px solid var(--line);
  border-radius: 50%;
}

.hero::after { width: 260px; height: 260px; right: 12%; top: -110px; }

.hero-content { position: relative; z-index: 1; max-width: 690px; }

.eyebrow,
.section-tag {
  color: var(--green);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.8px;
}

.hero h1 {
  margin: 17px 0 15px;
  font-size: clamp(37px, 5vw, 56px);
  line-height: 1.12;
  letter-spacing: -1.7px;
}

.hero h1 span { color: var(--green); }

.hero-content > p {
  max-width: 590px;
  margin: 0;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.9;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
  color: var(--muted);
  font-size: 12px;
}

.breadcrumbs a { color: var(--green); text-decoration: none; }

.hero-decoration {
  position: absolute;
  right: 13%;
  bottom: -85px;
  color: rgba(255, 255, 255, 0.03);
  font-size: 280px;
  line-height: 1;
  font-weight: 900;
  pointer-events: none;
}

[data-theme="light"] .hero-decoration { color: rgba(17, 107, 69, 0.05); }

.section { padding: 75px 8%; }

.section-heading {
  max-width: 680px;
  margin: 0 auto 38px;
  text-align: center;
}

.section-heading .section-tag,
.responsibilities-content .section-tag {
  color: var(--green);
}

.section-heading h2,
.responsibilities-content h2 {
  margin: 13px 0 12px;
  font-size: clamp(27px, 3vw, 36px);
  letter-spacing: -1px;
  line-height: 1.25;
  color: var(--text);
}

.section-heading > p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.8;
}

.overview { background: var(--bg); }

.overview-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 19px;
}

.overview-card {
  padding: 25px 22px;
  border: 1px solid var(--line);
  border-radius: 13px;
  background: var(--panel);
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}

.overview-card:hover,
.leader-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.25);
  border-color: rgba(113, 206, 128, 0.4);
}

.overview-icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin-bottom: 20px;
  border-radius: 12px;
  background: var(--soft);
  font-size: 22px;
}

.overview-card h3 { margin: 0 0 10px; font-size: 15px; color: var(--text); }
.overview-card p { margin: 0; color: var(--muted); font-size: 12px; line-height: 1.85; }

.leadership { background: var(--bg); }

.notice {
  display: flex;
  align-items: flex-start;
  gap: 13px;
  max-width: 1000px;
  margin: 0 auto 27px;
  padding: 16px 19px;
  border: 1px solid rgba(216, 177, 93, 0.3);
  border-radius: 10px;
  background: rgba(216, 177, 93, 0.08);
}

.notice-icon { font-size: 19px; }
.notice p { margin: 0; color: #d8b15d; font-size: 12px; line-height: 1.8; }

.leaders-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.leader-card {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--panel);
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}

/* ✅ No hardcoded url — image comes from the inline :style binding */
.leader-photo {
  position: relative;
  display: grid;
  place-items: center;
  height: 170px;
  overflow: hidden;
  background-color: #113b26; /* fallback tint while photo loads */
}

.leader-photo > span {
  display: grid;
  place-items: center;
  width: 90px;
  height: 90px;
  border: 4px solid rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  color: white;
  font-size: 25px;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  z-index: 1;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
}

/* Kept only as color-identity tokens (harmless) */
.leader-green { --leader-tint: #113b26; }
.leader-gold  { --leader-tint: #3b2e11; }
.leader-blue  { --leader-tint: #112a3b; }

.photo-badge {
  position: absolute;
  right: 16px;
  bottom: 14px;
  display: grid;
  place-items: center;
  width: 33px;
  height: 33px;
  border: 2px solid var(--panel);
  border-radius: 50%;
  color: var(--bg);
  background: var(--green);
  font-size: 9px;
  font-weight: 800;
  z-index: 1;
}

.leader-info { padding: 24px; }

.leader-label {
  color: var(--green);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.4px;
}

.leader-info h3 { margin: 11px 0 5px; font-size: 18px; color: var(--text); }
.leader-role { margin: 0 0 16px; color: var(--green); font-size: 12px; font-weight: 700; }
.leader-description { min-height: 65px; margin: 0 0 20px; color: var(--muted); font-size: 12px; line-height: 1.8; }

.profile-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 13px 0 0;
  border: 0;
  border-top: 1px solid var(--line);
  color: var(--green);
  background: transparent;
  font: inherit;
  font-size: 12px;
  font-weight: 750;
  cursor: pointer;
  transition: color 0.2s;
}

.profile-button:hover { color: var(--green-strong, #36d58c); }
.profile-button span { font-size: 18px; }

.structure-section { background: var(--bg); }

.structure {
  max-width: 780px;
  margin: 0 auto;
  padding: 32px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--panel);
}

.structure-level {
  display: flex;
  align-items: center;
  gap: 17px;
  width: 100%;
  padding: 19px 22px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--soft);
}

.structure-level.district { border-left: 4px solid #d6b05b; }

.structure-level.sector {
  border-left: 4px solid var(--green);
  background: rgba(113, 206, 128, 0.08);
}

.structure-icon {
  display: grid;
  place-items: center;
  width: 47px;
  height: 47px;
  flex-shrink: 0;
  border-radius: 11px;
  background: var(--bg);
  font-size: 21px;
}

.structure-level strong { font-size: 14px; color: var(--text); }
.structure-level p { margin: 5px 0 0; color: var(--muted); font-size: 11px; line-height: 1.7; }

.structure-connector {
  width: 2px;
  height: 28px;
  margin: 0 auto;
  background: var(--line);
}

.community-levels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.structure-level.community { padding: 16px; }

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
  background: var(--bg);
}

.responsibilities-content > p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.9;
}

.responsibility-list { display: grid; gap: 22px; margin-top: 29px; }

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
  color: var(--green);
  background: var(--soft);
  font-size: 13px;
  font-weight: 800;
}

.responsibility-item h3 { margin: 2px 0 6px; font-size: 14px; color: var(--text); }
.responsibility-item p { margin: 0; color: var(--muted); font-size: 12px; line-height: 1.8; }

.responsibilities-visual {
  padding: 30px;
  border-radius: 17px;
  color: var(--bg);
  background: linear-gradient(145deg, var(--green), var(--green-deep, #087c4c));
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.3);
}

.visual-top,
.visual-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.visual-top {
  color: rgba(3, 20, 11, 0.7);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.6px;
}

[data-theme="light"] .visual-top { color: rgba(255, 255, 255, 0.85); }

.visual-symbol { font-size: 21px; }

.visual-emblem {
  display: grid;
  place-items: center;
  width: 95px;
  height: 95px;
  margin: 36px auto 27px;
  border: 1px solid rgba(3, 20, 11, 0.2);
  border-radius: 50%;
  background: rgba(3, 20, 11, 0.1);
  font-size: 43px;
}

[data-theme="light"] .visual-emblem {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.15);
}

.responsibilities-visual h3 {
  margin: 0 0 12px;
  text-align: center;
  font-size: 21px;
  color: var(--bg);
}

[data-theme="light"] .responsibilities-visual h3 { color: #ffffff; }

.responsibilities-visual > p {
  max-width: 310px;
  margin: 0 auto;
  color: rgba(3, 20, 11, 0.8);
  text-align: center;
  font-size: 12px;
  line-height: 1.9;
}

[data-theme="light"] .responsibilities-visual > p { color: rgba(255, 255, 255, 0.9); }

.visual-bottom {
  flex-wrap: wrap;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(3, 20, 11, 0.2);
  color: rgba(3, 20, 11, 0.7);
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.8px;
}

[data-theme="light"] .visual-bottom {
  border-color: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.85);
}

.contact-section {
  display: flex;
  align-items: center;
  gap: 23px;
  padding: 43px 8%;
  color: var(--text);
  background: var(--panel);
  border-top: 1px solid var(--line);
}

.contact-icon {
  display: grid;
  place-items: center;
  width: 57px;
  height: 57px;
  flex-shrink: 0;
  border-radius: 14px;
  background: var(--soft);
  font-size: 25px;
}

.contact-copy { flex: 1; }

.contact-copy > span {
  color: var(--green);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.contact-copy h2 { margin: 8px 0; font-size: clamp(19px, 2.5vw, 26px); }

.contact-copy p {
  max-width: 650px;
  margin: 0;
  color: var(--muted);
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
  color: var(--bg);
  background: var(--green);
  font-size: 12px;
  font-weight: 750;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s;
}

.contact-button:hover {
  background: var(--green-strong, #36d58c);
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

.profile-modal {
  position: relative;
  width: 100%;
  max-width: 460px;
  padding: 35px;
  border-radius: 17px;
  background: var(--panel);
  border: 1px solid var(--line);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5);
}

.close-button {
  position: absolute;
  top: 13px;
  right: 17px;
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

.close-button:hover { color: var(--text); }

.modal-avatar {
  display: grid;
  place-items: center;
  width: 65px;
  height: 65px;
  margin-bottom: 23px;
  border-radius: 50%;
  color: var(--bg);
  background: var(--green);
  font-size: 19px;
  font-weight: 800;
}

.profile-modal h2 { margin: 12px 0 8px; font-size: 24px; color: var(--text); }
.profile-modal h3 { margin: 0 0 13px; color: var(--green); font-size: 14px; }
.profile-modal > p,
.modal-note { color: var(--muted); font-size: 12px; line-height: 1.9; }
.modal-note {
  margin-top: 20px;
  padding: 13px;
  border-radius: 8px;
  background: var(--soft);
}

.modal-button {
  width: 100%;
  min-height: 44px;
  margin-top: 22px;
  border: 0;
  border-radius: 8px;
  color: var(--bg);
  background: var(--green);
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.modal-button:hover { background: var(--green-strong, #36d58c); }

@media (max-width: 1050px) {
  .section { padding: 60px 5%; }
  .overview-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .responsibilities { gap: 35px; }
}

@media (max-width: 760px) {
  .hero { min-height: 300px; padding: 50px 6%; }
  .hero-decoration { right: -10px; font-size: 190px; }
  .section { padding: 52px 6%; }
  .leaders-grid { grid-template-columns: 1fr; max-width: 480px; margin: auto; }
  .leader-photo { height: 155px; }
  .leader-description { min-height: auto; }
  .responsibilities { grid-template-columns: 1fr; gap: 35px; }
  .contact-section {
    align-items: flex-start;
    flex-wrap: wrap;
    padding: 35px 6%;
  }
  .contact-copy { flex-basis: calc(100% - 85px); }
  .contact-button { margin-left: 80px; }
}

@media (max-width: 480px) {
  .overview-grid { grid-template-columns: 1fr; }
  .overview-card { padding: 22px; }
  .structure { padding: 17px; }
  .structure-level { gap: 11px; padding: 15px; }
  .structure-level strong { font-size: 12px; }
  .structure-icon { width: 38px; height: 38px; font-size: 18px; }
  .community-levels { grid-template-columns: 1fr; }
  .visual-bottom { justify-content: center; }
  .contact-copy { flex-basis: 100%; }
  .contact-icon { width: 48px; height: 48px; }
  .contact-button { margin-left: 0; }
  .profile-modal { padding: 27px 22px; }
}
</style>