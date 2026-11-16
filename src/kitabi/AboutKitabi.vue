<template>
  <div class="about-page">
    <main>
      <section class="hero">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <span class="eyebrow">{{ t("about.eyebrow") }}</span>
          <h1>{{ t("about.title") }} <span>{{ t("about.titleSpan") }}</span></h1>
          <p>{{ t("about.intro") }}</p>
          <div class="breadcrumbs">
            <router-link to="/">{{ t("nav.home") }}</router-link>
            <span>/</span>
            <span>{{ t("nav.about") }}</span>
          </div>
        </div>
      </section>

      <section class="intro section">
        <div class="intro-image">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=85"
            :alt="t('about.imageAlt')"
          />
          <div class="image-label">
            <span class="label-icon">🌱</span>
            <div>
              <strong>{{ t("about.imageLabelTitle") }}</strong>
              <p>{{ t("about.imageLabelText") }}</p>
            </div>
          </div>
        </div>

        <div class="intro-content">
          <span class="section-tag">{{ t("about.whoTag") }}</span>
          <h2>{{ t("about.whoTitle") }}</h2>
          <p>{{ t("about.whoP1") }}</p>
          <p>{{ t("about.whoP2") }}</p>

          <div class="intro-points">
            <div><span>✓</span> {{ t("about.point1") }}</div>
            <div><span>✓</span> {{ t("about.point2") }}</div>
            <div><span>✓</span> {{ t("about.point3") }}</div>
            <div><span>✓</span> {{ t("about.point4") }}</div>
          </div>

          <a href="#mission" class="primary-button">
            {{ t("about.ctaMission") }} →
          </a>
        </div>
      </section>

      <section class="values-section section" id="mission">
        <div class="section-heading">
          <span class="section-tag">{{ t("about.purposeTag") }}</span>
          <h2>{{ t("about.purposeTitle") }}</h2>
          <p>{{ t("about.purposeText") }}</p>
        </div>

        <div class="values-grid">
          <article class="value-card">
            <div class="value-icon green">🎯</div>
            <h3>{{ t("about.missionTitle") }}</h3>
            <p>{{ t("about.missionText") }}</p>
          </article>

          <article class="value-card featured">
            <div class="value-icon white">🌍</div>
            <h3>{{ t("about.visionTitle") }}</h3>
            <p>{{ t("about.visionText") }}</p>
          </article>

          <article class="value-card">
            <div class="value-icon gold">🤝</div>
            <h3>{{ t("about.valuesTitle") }}</h3>
            <p>{{ t("about.valuesText") }}</p>
          </article>
        </div>
      </section>

      <section class="facts-section section">
        <div class="section-heading">
          <span class="section-tag">{{ t("about.communityTag") }}</span>
          <h2>{{ t("about.communityTitle") }}</h2>
          <p>{{ t("about.communityText") }}</p>
        </div>

        <div class="facts-grid">
          <article class="fact-card">
            <div class="fact-icon">🏘️</div>
            <h3>{{ t("about.factCommunity") }}</h3>
            <p>{{ t("about.factCommunityText") }}</p>
          </article>

          <article class="fact-card">
            <div class="fact-icon">🌾</div>
            <h3>{{ t("about.factAgriculture") }}</h3>
            <p>{{ t("about.factAgricultureText") }}</p>
          </article>

          <article class="fact-card">
            <div class="fact-icon">🎓</div>
            <h3>{{ t("about.factEducation") }}</h3>
            <p>{{ t("about.factEducationText") }}</p>
          </article>

          <article class="fact-card">
            <div class="fact-icon">🏥</div>
            <h3>{{ t("about.factWellbeing") }}</h3>
            <p>{{ t("about.factWellbeingText") }}</p>
          </article>
        </div>
      </section>

      <section class="services-section section" id="services">
        <div class="section-heading">
          <span class="section-tag">{{ t("about.servicesTag") }}</span>
          <h2>{{ t("about.servicesTitle") }}</h2>
          <p>{{ t("about.servicesText") }}</p>
        </div>

        <div class="services-grid">
          <article class="service-card">
            <div class="service-icon">📄</div>
            <div>
              <h3>{{ t("about.serviceAdmin") }}</h3>
              <p>{{ t("about.serviceAdminText") }}</p>
            </div>
            <span class="service-arrow">↗</span>
          </article>

          <article class="service-card">
            <div class="service-icon">👥</div>
            <div>
              <h3>{{ t("about.serviceCommunity") }}</h3>
              <p>{{ t("about.serviceCommunityText") }}</p>
            </div>
            <span class="service-arrow">↗</span>
          </article>

          <article class="service-card">
            <div class="service-icon">📢</div>
            <div>
              <h3>{{ t("about.serviceNews") }}</h3>
              <p>{{ t("about.serviceNewsText") }}</p>
            </div>
            <span class="service-arrow">↗</span>
          </article>

          <article class="service-card">
            <div class="service-icon">💬</div>
            <div>
              <h3>{{ t("about.serviceContact") }}</h3>
              <p>{{ t("about.serviceContactText") }}</p>
            </div>
            <span class="service-arrow">↗</span>
          </article>
        </div>
      </section>

      <section class="cta-section" id="contact">
        <div>
          <span class="cta-label">{{ t("about.ctaTag") }}</span>
          <h2>{{ t("about.ctaTitle") }}</h2>
          <p>{{ t("about.ctaText") }}</p>
        </div>
        <a
          href="https://www.nyamagabe.gov.rw/"
          target="_blank"
          rel="noopener noreferrer"
          class="cta-button"
        >
          {{ t("about.ctaButton") }} ↗
        </a>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: "AboutView",
  inject: {
    t: { default: (k) => k },
    language: { default: () => "en" },
    theme: { default: () => "dark" }
  }
};
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  margin: 0;
  color: var(--text);
  background: var(--bg);
  font-family: Inter, "Segoe UI", Arial, sans-serif;
  transition: background 0.25s ease, color 0.25s ease;
}

.about-page * {
  box-sizing: border-box;
}

.primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 19px;
  border-radius: 9px;
  background: var(--green);
  color: var(--bg);
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s;
}

.primary-button:hover {
  background: var(--green-strong, #36d58c);
  transform: translateY(-2px);
}

.hero {
  position: relative;
  min-height: 350px;
  display: flex;
  align-items: center;
  padding: 70px 8%;
  overflow: hidden;
  color: var(--text);
  background:
    linear-gradient(90deg, rgba(3, 20, 11, 0.95), rgba(7, 27, 16, 0.8)),
    url("https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1800&q=85")
    center 48% / cover;
  border-bottom: 1px solid var(--line);
}

.hero-overlay {
  position: absolute;
  width: 360px;
  height: 360px;
  right: 8%;
  top: -130px;
  border: 1px solid var(--line);
  border-radius: 50%;
  box-shadow: 0 0 0 45px rgba(124, 221, 121, 0.03), 0 0 0 90px rgba(124, 221, 121, 0.01);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 720px;
}

.eyebrow,
.section-tag,
.cta-label {
  color: var(--green);
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
  color: var(--green);
}

.hero-content > p {
  max-width: 580px;
  margin: 0;
  color: var(--muted);
  font-size: 16px;
  line-height: 1.8;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 25px;
  font-size: 13px;
  color: var(--muted);
}

.breadcrumbs a {
  color: var(--green);
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
  background: var(--bg);
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
  border: 1px solid var(--line);
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
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--panel);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
}

.label-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: var(--soft);
  font-size: 21px;
}

.image-label strong {
  font-size: 13px;
  color: var(--text);
}

.image-label p {
  margin: 5px 0 0;
  color: var(--muted);
  font-size: 11px;
}

.intro-content .section-tag,
.section-heading .section-tag {
  color: var(--green);
}

.intro-content h2,
.section-heading h2 {
  margin: 13px 0 18px;
  font-size: clamp(28px, 3vw, 38px);
  line-height: 1.25;
  letter-spacing: -1px;
  color: var(--text);
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
  color: var(--text);
}

.intro-points span {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 19px;
  height: 19px;
  color: var(--green);
  border-radius: 50%;
  background: var(--soft);
  font-size: 12px;
}

.values-section,
.services-section {
  background: var(--bg);
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
  border: 1px solid var(--line);
  border-radius: 15px;
  background: var(--panel);
  transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
}

.value-card:hover,
.fact-card:hover,
.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.2);
  border-color: rgba(113, 206, 128, 0.4);
}

.value-card.featured {
  color: var(--bg);
  border-color: var(--green);
  background: linear-gradient(145deg, var(--green), var(--green-deep, #087c4c));
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
  background: var(--soft);
}

.value-icon.white {
  background: rgba(255, 255, 255, 0.2);
}

.value-icon.gold {
  background: #2a2314;
}

[data-theme="light"] .value-icon.gold {
  background: #fbf1d9;
}

.value-card h3,
.fact-card h3,
.service-card h3 {
  margin: 0 0 12px;
  font-size: 17px;
  color: var(--text);
}

.value-card.featured h3 {
  color: var(--bg);
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
  color: rgba(3, 20, 11, 0.8);
}

[data-theme="light"] .value-card.featured {
  color: #ffffff;
}

[data-theme="light"] .value-card.featured h3,
[data-theme="light"] .value-card.featured p {
  color: #ffffff;
}

.facts-section {
  background: var(--bg);
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
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--panel);
  transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
}

.fact-icon,
.service-icon {
  display: grid;
  place-items: center;
  width: 49px;
  height: 49px;
  margin-bottom: 20px;
  border-radius: 13px;
  background: var(--soft);
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
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--panel);
  transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
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
  color: var(--green);
  font-size: 19px;
}

.cta-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  margin: 0;
  padding: 55px 8%;
  color: var(--text);
  background: var(--panel);
  border-top: 1px solid var(--line);
}

.cta-label {
  color: var(--green);
}

.cta-section h2 {
  margin: 13px 0 10px;
  font-size: clamp(24px, 3vw, 34px);
  letter-spacing: -0.7px;
}

.cta-section p {
  margin: 0;
  color: var(--muted);
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
  color: var(--bg);
  border-radius: 9px;
  background: var(--green);
  font-size: 13px;
  font-weight: 750;
  text-decoration: none;
  transition: transform 0.2s, background 0.2s;
}

.cta-button:hover {
  transform: translateY(-2px);
  background: var(--green-strong, #36d58c);
}

@media (max-width: 1000px) {
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
}

@media (max-width: 420px) {
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