<template>
  <main class="about" role="main" aria-labelledby="about-title">

    <!-- ============ HERO ============ -->
    <section class="hero" aria-labelledby="about-title">
      <div class="hero-inner">
        <div class="hero-copy">
          <span class="eyebrow">COLLÈGE DE BÉTHEL · APARUDE</span>
          <h1 id="about-title">
            Growing in Knowledge,<br>
            Character <span class="accent">&</span> Faith
          </h1>
          <p class="hero-lede">
            A faith-centred school community committed to educating
            students for academic excellence, responsible character,
            and a life of purpose.
          </p>

          <div class="hero-cta">
            <router-link to="/media" class="btn btn-primary">
              Explore Our Campus
              <ArrowRight :size="16" aria-hidden="true" />
            </router-link>
            <router-link to="/question" class="btn btn-ghost">
              Contact Admissions
            </router-link>
          </div>
        </div>

        <div class="hero-visual">
          <div class="hero-image">
            <img
              :src="heroImage"
              alt="Collège de Béthel campus"
              width="640"
              height="440"
              loading="eager"
              decoding="async"
              @error="onImageError"
            >
          </div>
          <div class="credential-badge">
            <GraduationCap :size="20" aria-hidden="true" />
            <div>
              <strong>Est. 2005</strong>
              <span>Teaching for Eternity</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ STAT STRIP ============ -->
    <section class="stat-strip" aria-label="School at a glance">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="stat"
      >
        <strong>{{ stat.value }}</strong>
        <span>{{ stat.label }}</span>
      </div>
    </section>

    <!-- ============ IDENTITY ============ -->
    <section class="identity" aria-labelledby="identity-heading">
      <div class="section-head">
        <span class="eyebrow">OUR IDENTITY</span>
        <h2 id="identity-heading">Who We Are</h2>
      </div>

      <div class="identity-grid">
        <div class="identity-narrative">
          <p class="lead">
            Collège de Béthel exists to shape young people who think
            deeply, act with integrity, and live with purpose.
          </p>
          <p>
            We bring together education, discipline, faith, and community
            to prepare students for their future — not just for exams, but
            for life. Our environment is structured, warm, and intentional,
            designed so that every learner can discover and develop their
            God-given abilities.
          </p>
        </div>

        <aside class="identity-facts" aria-label="Our mission and vision">
          <article v-for="fact in facts" :key="fact.title" class="fact">
            <div class="fact-icon" :class="fact.color">
              <component :is="fact.icon" :size="18" aria-hidden="true" />
            </div>
            <div>
              <h3>{{ fact.title }}</h3>
              <p>{{ fact.body }}</p>
            </div>
          </article>
        </aside>
      </div>
    </section>

    <!-- ============ VALUES ============ -->
    <section class="values" aria-labelledby="values-heading">
      <div class="section-head">
        <span class="eyebrow">WHAT WE VALUE</span>
        <h2 id="values-heading">Building More Than Academic Success</h2>
        <p class="section-sub">
          Three commitments shape everything we do — in the classroom,
          on the field, and in the community.
        </p>
      </div>

      <div class="values-grid">
        <article
          v-for="(value, index) in values"
          :key="value.title"
          class="value"
        >
          <span class="value-number">{{ String(index + 1).padStart(2, "0") }}</span>
          <h3>{{ value.title }}</h3>
          <p>{{ value.body }}</p>
        </article>
      </div>
    </section>

    <!-- ============ FAITH / VERSE BANNER ============ -->
    <section class="faith" aria-labelledby="faith-heading">
      <div class="faith-inner">
        <div class="faith-copy">
          <span class="eyebrow light">OUR FOUNDATION</span>
          <h2 id="faith-heading">Built on Faith, Learning for Eternity</h2>
          <p>
            Every subject, every lesson, every conversation is grounded in
            the conviction that education is ultimately about formation —
            of the mind, the character, and the soul.
          </p>
        </div>

        <blockquote class="faith-verse">
          <Quote :size="28" class="quote-icon" aria-hidden="true" />
          <p>“{{ verse.text }}”</p>
          <cite>{{ verse.reference }}</cite>
        </blockquote>
      </div>
    </section>

  </main>
</template>

<script>
import { ArrowRight, GraduationCap, Quote, Compass, Target } from "lucide-vue-next";

export default {
  name: "AboutView",

  components: { ArrowRight, GraduationCap, Quote, Compass, Target },

  props: {
    heroImage: {
      type: String,
      default: () => require("@/assets/images/kennedy.png")
    }
  },

  data() {
    return {
      stats: [
        { value: "20+", label: "Years of Service" },
        { value: "2,500+", label: "Students" },
        { value: "150+", label: "Educators" },
        { value: "98%", label: "Pass Rate" }
      ],

      facts: [
        {
          title: "Our Mission",
          body:
            "To provide quality education while developing students who demonstrate integrity, responsibility, discipline, service, and strong Christian values.",
          icon: "Target",
          color: "purple"
        },
        {
          title: "Our Vision",
          body:
            "A generation of knowledgeable, responsible, and faith-filled young people prepared to make a positive difference in their families, communities, and society.",
          icon: "Compass",
          color: "blue"
        }
      ],

      values: [
        {
          title: "Academic Excellence",
          body:
            "Encouraging students to pursue knowledge, creativity, discipline, and continuous improvement."
        },
        {
          title: "Strong Character",
          body:
            "Developing honesty, responsibility, respect, discipline, and leadership in everyday life."
        },
        {
          title: "Faith & Service",
          body:
            "Helping students grow spiritually and understand the importance of serving others and their community."
        }
      ],

      verse: {
        text: "Train up a child in the way he should go: and when he is old, he will not depart from it.",
        reference: "PROVERBS 22:6"
      }
    };
  },

  methods: {
    onImageError(event) {
      event.target.style.display = "none";
      event.target.parentElement?.classList.add("image-fallback");
    }
  }
};
</script>

<style scoped>
.about {
  width: 100%;
  min-height: 100vh;
  background: #faf9ff;
  color: #1e1b4b;
  font-family: "Inter", "Segoe UI", sans-serif;
  box-sizing: border-box;
}

:focus-visible {
  outline: 2px solid #7c3aed;
  outline-offset: 3px;
  border-radius: 6px;
}

/* Shared */
.eyebrow {
  color: #7c3aed;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.6px;
}

.eyebrow.light {
  color: #c4b5fd;
}

.section-head {
  max-width: 720px;
  margin-bottom: 36px;
}

.section-head h2 {
  font-size: 30px;
  line-height: 1.2;
  margin: 10px 0 0;
  letter-spacing: -0.6px;
  color: #1e1b4b;
}

.section-sub {
  margin: 14px 0 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.7;
  max-width: 560px;
}

/* ============ HERO ============ */
.hero {
  padding: 60px 60px 50px;
  background:
    radial-gradient(1200px 400px at 100% -10%, rgba(124, 58, 237, 0.08), transparent 60%),
    linear-gradient(180deg, #ffffff 0%, #faf9ff 100%);
  border-bottom: 1px solid #ece9f7;
}

.hero-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 60px;
  align-items: center;
}

.hero-copy h1 {
  font-size: 46px;
  line-height: 1.1;
  margin: 16px 0 0;
  letter-spacing: -1.2px;
  color: #1e1b4b;
  font-weight: 800;
}

.hero-copy h1 .accent {
  color: #7c3aed;
  font-style: italic;
  font-family: Georgia, serif;
  font-weight: 400;
}

.hero-lede {
  margin: 20px 0 0;
  max-width: 520px;
  color: #475569;
  font-size: 15px;
  line-height: 1.8;
}

.hero-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 12px 20px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.btn-primary {
  color: #fff;
  background: #4c1d95;
  box-shadow: 0 8px 20px rgba(76, 29, 149, 0.25);
}

.btn-primary:hover {
  background: #5b21b6;
  transform: translateY(-2px);
}

.btn-ghost {
  color: #4c1d95;
  background: transparent;
  border: 1px solid #ddd6fe;
}

.btn-ghost:hover {
  background: #f5f3ff;
}

.hero-visual {
  position: relative;
}

.hero-image {
  position: relative;
  aspect-ratio: 16 / 11;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 30px 60px -20px rgba(49, 46, 129, 0.35);
  background: linear-gradient(135deg, #ede9fe, #ddd6fe);
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero-image.image-fallback::after {
  content: "Collège de Béthel";
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7c3aed;
  font-weight: 800;
  font-size: 15px;
  letter-spacing: 1.2px;
}

.credential-badge {
  position: absolute;
  left: -20px;
  bottom: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #ede9fe;
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(49, 46, 129, 0.15);
  color: #7c3aed;
}

.credential-badge strong,
.credential-badge span {
  display: block;
}

.credential-badge strong {
  color: #1e1b4b;
  font-size: 12px;
}

.credential-badge span {
  color: #94a3b8;
  font-size: 10px;
  margin-top: 3px;
}

/* ============ STAT STRIP ============ */
.stat-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  max-width: 1280px;
  margin: 0 auto;
  padding: 30px 60px;
  border-bottom: 1px solid #ece9f7;
}

.stat {
  text-align: center;
  padding: 8px 0;
  border-right: 1px solid #f0ecfa;
}

.stat:last-child {
  border-right: none;
}

.stat strong {
  display: block;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.6px;
  color: #4c1d95;
}

.stat span {
  display: block;
  margin-top: 6px;
  color: #64748b;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

/* ============ IDENTITY ============ */
.identity {
  max-width: 1280px;
  margin: 0 auto;
  padding: 70px 60px 50px;
}

.identity-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 50px;
  align-items: start;
}

.identity-narrative .lead {
  font-size: 19px;
  line-height: 1.6;
  color: #1e1b4b;
  font-weight: 500;
  margin: 0 0 18px;
}

.identity-narrative p {
  color: #475569;
  font-size: 14px;
  line-height: 1.85;
  margin: 0;
}

.identity-facts {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.fact {
  display: flex;
  gap: 14px;
  padding: 18px 20px;
  background: #fff;
  border: 1px solid #ece9f7;
  border-left: 3px solid #7c3aed;
  border-radius: 10px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.fact:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(49, 46, 129, 0.08);
}

.fact-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
}

.fact-icon.purple {
  color: #7135c9;
  background: #f0e8ff;
}

.fact-icon.blue {
  color: #397bd2;
  background: #e8f1ff;
}

.fact h3 {
  margin: 0 0 6px;
  font-size: 13px;
  color: #4c1d95;
  font-weight: 800;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.fact p {
  margin: 0;
  color: #64748b;
  font-size: 12px;
  line-height: 1.75;
}

/* ============ VALUES ============ */
.values {
  background: #f5f3ff;
  padding: 70px 60px;
  border-top: 1px solid #ece9f7;
  border-bottom: 1px solid #ece9f7;
}

.values > .section-head,
.values > .values-grid {
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.value {
  position: relative;
  padding: 28px 24px 24px;
  background: #fff;
  border: 1px solid #e9e4f7;
  border-radius: 14px;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.value:hover {
  transform: translateY(-4px);
  border-color: #c4b5fd;
  box-shadow: 0 16px 34px rgba(76, 29, 149, 0.1);
}

.value-number {
  display: inline-block;
  font-family: Georgia, serif;
  font-size: 13px;
  font-weight: 700;
  color: #a78bfa;
  letter-spacing: 1px;
  margin-bottom: 14px;
}

.value h3 {
  margin: 0 0 10px;
  font-size: 16px;
  color: #1e1b4b;
  font-weight: 800;
}

.value p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.75;
}

/* ============ FAITH BANNER ============ */
.faith {
  background:
    radial-gradient(800px 300px at 0% 100%, rgba(167, 139, 250, 0.25), transparent 60%),
    linear-gradient(135deg, #2e1065 0%, #4c1d95 60%, #5b21b6 100%);
  color: #fff;
  padding: 70px 60px;
}

.faith-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  align-items: center;
}

.faith-copy h2 {
  font-size: 30px;
  line-height: 1.25;
  margin: 12px 0 18px;
  letter-spacing: -0.5px;
  color: #fff;
}

.faith-copy p {
  margin: 0;
  max-width: 460px;
  color: #ddd6fe;
  font-size: 14px;
  line-height: 1.85;
}

.faith-verse {
  margin: 0;
  padding: 32px 34px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 16px;
  backdrop-filter: blur(8px);
}

.quote-icon {
  color: #c4b5fd;
  margin-bottom: 14px;
}

.faith-verse p {
  margin: 0;
  font-family: Georgia, serif;
  font-size: 19px;
  line-height: 1.6;
  color: #fff;
  font-style: italic;
}

.faith-verse cite {
  display: block;
  margin-top: 16px;
  color: #c4b5fd;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.4px;
  font-style: normal;
}

/* ============ RESPONSIVE ============ */
@media (max-width: 1024px) {
  .hero { padding: 45px 30px; }
  .hero-inner { gap: 40px; }
  .hero-copy h1 { font-size: 38px; }
  .stat-strip { padding: 24px 30px; }
  .stat strong { font-size: 24px; }
  .identity { padding: 55px 30px 40px; }
  .identity-grid { grid-template-columns: 1fr; gap: 30px; }
  .values { padding: 55px 30px; }
  .faith { padding: 55px 30px; }
  .faith-inner { grid-template-columns: 1fr; gap: 30px; }
}

@media (max-width: 720px) {
  .hero { padding: 36px 20px 30px; }
  .hero-inner { grid-template-columns: 1fr; gap: 32px; }
  .hero-copy h1 { font-size: 32px; }
  .hero-lede { font-size: 14px; }
  .credential-badge { left: 12px; bottom: 12px; }
  .stat-strip {
    grid-template-columns: repeat(2, 1fr);
    padding: 20px;
    gap: 16px 0;
  }
  .stat:nth-child(2) { border-right: none; }
  .stat:nth-child(-n+2) { border-bottom: 1px solid #f0ecfa; padding-bottom: 16px; }
  .identity { padding: 45px 20px 30px; }
  .section-head h2 { font-size: 24px; }
  .values { padding: 45px 20px; }
  .values-grid { grid-template-columns: 1fr; }
  .faith { padding: 45px 20px; }
  .faith-copy h2 { font-size: 24px; }
  .faith-verse { padding: 24px; }
}

@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; animation: none !important; }
}
</style>