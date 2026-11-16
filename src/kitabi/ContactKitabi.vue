<template>
  <div class="contact-page">
    <div v-if="showNotifications" class="notification-panel">
      <strong>{{ t("contact.notifTitle") }}</strong>
      <p>{{ t("contact.notifText1") }}</p>
      <p>{{ t("contact.notifText2") }}</p>
      <button @click="showNotifications = false">{{ t("contact.close") }}</button>
    </div>

    <section class="page-body">
      <div class="page-heading">
        <div>
          <div class="eyebrow"><Headset :size="15" /> {{ t("contact.eyebrow") }}</div>
          <h1>{{ t("contact.title") }}</h1>
          <p>{{ t("contact.intro") }}</p>
        </div>
        <div class="availability">
          <span class="availability-dot"></span>
          {{ t("contact.availability") }}
        </div>
      </div>

      <section class="contact-hero">
        <div class="hero-content">
          <span class="hero-tag"><MessageCircle :size="15" /> {{ t("contact.heroTag") }}</span>
          <h2>{{ t("contact.heroTitle1") }}<br />{{ t("contact.heroTitle2") }}</h2>
          <p>{{ t("contact.heroText") }}</p>
          <button @click="scrollToForm">
            {{ t("contact.heroButton") }} <ArrowRight :size="17" />
          </button>
        </div>
        <div class="hero-art">
          <div class="art-ring ring-one"></div>
          <div class="art-ring ring-two"></div>
          <div class="art-card">
            <div class="art-card-icon"><Mail :size="28" /></div>
            <span>{{ t("contact.artTag") }}</span>
            <h3>{{ t("contact.artTitle1") }}<br />{{ t("contact.artTitle2") }}</h3>
            <div class="art-lines"><i></i><i></i><i></i></div>
          </div>
          <div class="art-floating floating-message"><MessageCircle :size="22" /></div>
          <div class="art-floating floating-phone"><Phone :size="22" /></div>
        </div>
      </section>

      <section class="contact-methods">
        <article
          v-for="method in methods"
          :key="method.key"
          class="method-card"
        >
          <div class="method-icon" :class="method.color">
            <component :is="method.icon" :size="23" />
          </div>
          <h3>{{ t(method.titleKey) }}</h3>
          <p>{{ t(method.descKey) }}</p>
          <a
            v-if="method.link"
            :href="method.link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ t(method.actionKey) }} <ArrowUpRight :size="15" />
          </a>
          <button v-else @click="scrollToForm">
            {{ t(method.actionKey) }} <ArrowRight :size="15" />
          </button>
        </article>
      </section>

      <section class="contact-layout">
        <div ref="formSection" class="form-panel">
          <div class="section-heading">
            <span class="section-kicker">{{ t("contact.formKicker") }}</span>
            <h2>{{ t("contact.formTitle") }}</h2>
            <p>{{ t("contact.formText") }}</p>
          </div>

          <div v-if="formSuccess" class="success-message">
            <CheckCircle2 :size="23" />
            <div>
              <strong>{{ t("contact.formSuccessTitle") }}</strong>
              <p>{{ t("contact.formSuccessText") }}</p>
            </div>
            <button @click="formSuccess = false" :aria-label="t('contact.close')">
              <X :size="17" />
            </button>
          </div>

          <form @submit.prevent="submitForm">
            <div class="form-row">
              <div class="form-group">
                <label for="fullName">{{ t("contact.labelName") }} <span>*</span></label>
                <input
                  id="fullName"
                  v-model.trim="form.fullName"
                  required
                  maxlength="100"
                  :placeholder="t('contact.placeholderName')"
                />
              </div>
              <div class="form-group">
                <label for="email">{{ t("contact.labelEmail") }} <span>*</span></label>
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
                <label for="phone">{{ t("contact.labelPhone") }}</label>
                <input
                  id="phone"
                  v-model.trim="form.phone"
                  type="tel"
                  maxlength="30"
                  :placeholder="t('contact.placeholderPhone')"
                />
              </div>
              <div class="form-group">
                <label for="subject">{{ t("contact.labelSubject") }} <span>*</span></label>
                <select id="subject" v-model="form.subject" required>
                  <option value="" disabled>{{ t("contact.subjectPlaceholder") }}</option>
                  <option>{{ t("contact.subjectGeneral") }}</option>
                  <option>{{ t("contact.subjectServices") }}</option>
                  <option>{{ t("contact.subjectCommunity") }}</option>
                  <option>{{ t("contact.subjectResearch") }}</option>
                  <option>{{ t("contact.subjectFeedback") }}</option>
                  <option>{{ t("contact.subjectOther") }}</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="message">{{ t("contact.labelMessage") }} <span>*</span></label>
              <textarea
                id="message"
                v-model.trim="form.message"
                required
                minlength="10"
                maxlength="3000"
                rows="5"
                :placeholder="t('contact.placeholderMessage')"
              ></textarea>
              <div class="character-count">{{ form.message.length }}/3000 {{ t("contact.characters") }}</div>
            </div>

            <label class="privacy-check">
              <input v-model="form.consent" type="checkbox" required />
              <span>{{ t("contact.consent") }}</span>
            </label>

            <button class="submit-button" type="submit">
              <Send :size="17" /> {{ t("contact.submit") }} <ArrowRight :size="17" />
            </button>
            <p class="form-note">
              <LockKeyhole :size="14" />
              {{ t("contact.formNote") }}
            </p>
          </form>
        </div>
      </section>

      <section class="faq-section">
        <div class="section-heading">
          <span class="section-kicker">{{ t("contact.faqKicker") }}</span>
          <h2>{{ t("contact.faqTitle") }}</h2>
          <p>{{ t("contact.faqText") }}</p>
        </div>

        <div class="faq-list">
          <article
            v-for="(faq, index) in faqs"
            :key="faq.key"
            class="faq-item"
            :class="{ 'faq-open': openFaq === index }"
          >
            <button @click="openFaq = openFaq === index ? null : index">
              <span>{{ t(faq.qKey) }}</span>
              <Plus :size="19" />
            </button>
            <div v-if="openFaq === index" class="faq-answer">
              {{ t(faq.aKey) }}
            </div>
          </article>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
import {
  Headset, MessageCircle, ArrowUpRight, X, Mail, Phone,
  Globe, MapPin, ArrowRight, Send, LockKeyhole, CheckCircle2, Plus
} from "lucide-vue-next";

export default {
  name: "ContactView",
  components: {
    Headset, MessageCircle, ArrowUpRight, X, Mail, Phone,
    Globe, MapPin, ArrowRight, Send, LockKeyhole, CheckCircle2, Plus
  },
  inject: {
    t: { default: (k) => k },
    language: { default: () => "en" },
    theme: { default: () => "dark" }
  },

  data() {
    return {
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
          key: "email",
          titleKey: "contact.methodEmailTitle",
          descKey: "contact.methodEmailDesc",
          actionKey: "contact.methodEmailAction",
          icon: Mail,
          color: "green",
          link: "https://www.nyamagabe.gov.rw/"
        },
        {
          key: "website",
          titleKey: "contact.methodWebsiteTitle",
          descKey: "contact.methodWebsiteDesc",
          actionKey: "contact.methodWebsiteAction",
          icon: Globe,
          color: "blue",
          link: "https://www.nyamagabe.gov.rw/"
        },
        {
          key: "enquiries",
          titleKey: "contact.methodEnquiriesTitle",
          descKey: "contact.methodEnquiriesDesc",
          actionKey: "contact.methodEnquiriesAction",
          icon: MessageCircle,
          color: "orange",
          link: null
        }
      ],

      faqs: [
        {
          key: "faq1",
          qKey: "contact.faq1Q",
          aKey: "contact.faq1A"
        },
        {
          key: "faq2",
          qKey: "contact.faq2Q",
          aKey: "contact.faq2A"
        },
        {
          key: "faq3",
          qKey: "contact.faq3Q",
          aKey: "contact.faq3A"
        },
        {
          key: "faq4",
          qKey: "contact.faq4Q",
          aKey: "contact.faq4A"
        }
      ]
    };
  },

  methods: {
    scrollToForm() {
      this.$refs.formSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    submitForm() {
      this.formSuccess = true;
      this.$nextTick(() => {
        document.querySelector(".success-message")?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      });
    }
  }
};
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: Inter, "Segoe UI", Arial, sans-serif;
  transition: background 0.25s ease, color 0.25s ease;
}

.contact-page * { box-sizing: border-box; }
button, input, textarea, select { font: inherit; }
button { cursor: pointer; }

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
  color: var(--green);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.3px;
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

.availability {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  color: var(--muted);
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 9px;
  font-size: 10px;
  white-space: nowrap;
}

.availability-dot {
  width: 7px;
  height: 7px;
  background: var(--green);
  border-radius: 50%;
}

.contact-hero {
  min-height: 310px;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 35px 40px;
  color: var(--bg);
  background: linear-gradient(112deg, var(--green-deep, #087c4c), var(--green));
  border-radius: 17px;
}

.hero-content { max-width: 550px; position: relative; z-index: 2; }

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
  letter-spacing: 1px;
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
  max-width: 445px;
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

.hero-art {
  width: 300px;
  height: 290px;
  position: absolute;
  top: 10px;
  right: 5%;
}

.art-ring {
  position: absolute;
  border: 1px solid rgba(3, 20, 11, 0.15);
  border-radius: 50%;
}

.ring-one { width: 260px; height: 260px; top: 15px; right: 4px; }
.ring-two { width: 205px; height: 205px; top: 43px; right: 31px; }

.art-card {
  width: 185px;
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

.art-card-icon {
  width: 43px;
  height: 43px;
  display: grid;
  place-items: center;
  color: var(--green);
  background: var(--soft);
  border-radius: 11px;
}

.art-card > span {
  display: block;
  margin-top: 17px;
  color: var(--muted);
  font-size: 7px;
  font-weight: 800;
  letter-spacing: 0.8px;
}

.art-card h3 {
  margin: 7px 0 0;
  font-size: 21px;
  line-height: 1.1;
  color: var(--text);
}

.art-lines { display: grid; gap: 5px; margin-top: 14px; }
.art-lines i { height: 4px; background: var(--line); border-radius: 4px; }
.art-lines i:nth-child(2) { width: 80%; }
.art-lines i:nth-child(3) { width: 57%; }

.art-floating {
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

.floating-message { top: 32px; right: 195px; transform: rotate(-9deg); }
.floating-phone { right: 7px; bottom: 39px; transform: rotate(7deg); }

.contact-methods {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin: 23px 0 37px;
}

.method-card {
  min-width: 0;
  padding: 22px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 13px;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}

.method-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
  border-color: rgba(113, 206, 128, 0.4);
}

.method-icon {
  width: 47px;
  height: 47px;
  display: grid;
  place-items: center;
  border-radius: 12px;
}

.method-icon.green { color: var(--green); background: var(--soft); }
.method-icon.blue { color: #70b4f0; background: rgba(52, 116, 185, 0.15); }
.method-icon.orange { color: #f0b35d; background: rgba(185, 121, 38, 0.15); }

[data-theme="light"] .method-icon.blue { color: #326cb0; background: #e7effa; }
[data-theme="light"] .method-icon.orange { color: #987126; background: #fbf1d9; }

.method-card h3 { margin: 16px 0 8px; color: var(--text); font-size: 14px; }

.method-card p {
  min-height: 39px;
  margin: 0;
  color: var(--muted);
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
  color: var(--green);
  background: transparent;
  border: 0;
  text-decoration: none;
  font-size: 11px;
  font-weight: 750;
}

.contact-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 22px;
  margin-bottom: 40px;
}

.form-panel {
  min-width: 0;
  padding: 27px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 14px;
  scroll-margin-top: 95px;
}

.section-heading { margin-bottom: 24px; }

.section-kicker {
  color: var(--green);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

.section-heading h2 {
  margin: 8px 0 7px;
  color: var(--text);
  font-size: 23px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.section-heading p {
  margin: 0;
  color: var(--muted);
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
  color: var(--text);
  font-size: 11px;
  font-weight: 700;
}

.form-group label span { color: #e57373; }

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  min-width: 0;
  padding: 12px;
  color: var(--text);
  background: var(--soft);
  border: 1px solid var(--line);
  border-radius: 8px;
  outline: none;
  font-size: 11px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input,
.form-group select { height: 42px; }

.form-group textarea {
  min-height: 125px;
  resize: vertical;
  line-height: 1.7;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--green);
  box-shadow: 0 0 0 3px rgba(124, 221, 121, 0.15);
}

.form-group input::placeholder,
.form-group textarea::placeholder { color: var(--muted); }

.character-count {
  align-self: flex-end;
  margin-top: -2px;
  color: var(--muted);
  font-size: 9px;
}

.privacy-check {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  margin: 1px 0 20px;
  color: var(--muted);
  font-size: 10px;
  line-height: 1.7;
  cursor: pointer;
}

.privacy-check input {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  margin-top: 1px;
  accent-color: var(--green);
}

.submit-button {
  width: 100%;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  color: var(--bg);
  background: var(--green);
  border: 0;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 750;
  transition: background 0.2s, transform 0.2s;
}

.submit-button:hover {
  background: var(--green-strong, #36d58c);
  transform: translateY(-2px);
}

.form-note {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 6px;
  margin: 13px 0 0;
  color: var(--muted);
  font-size: 9px;
  line-height: 1.6;
  text-align: center;
}

.form-note svg { flex-shrink: 0; }

.success-message {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  margin-bottom: 21px;
  padding: 14px;
  color: var(--green);
  background: var(--soft);
  border: 1px solid var(--line);
  border-radius: 9px;
}

.success-message > div { flex: 1; }
.success-message strong { font-size: 12px; color: var(--text); }
.success-message p {
  margin: 5px 0 0;
  color: var(--muted);
  font-size: 10px;
  line-height: 1.7;
}
.success-message button {
  padding: 2px;
  color: var(--muted);
  background: transparent;
  border: 0;
}

.faq-section {
  max-width: 900px;
  margin: 0 auto 38px;
}

.faq-section > .section-heading { margin-bottom: 20px; }

.faq-list { display: grid; gap: 9px; }

.faq-item {
  overflow: hidden;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 10px;
}

.faq-item > button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 16px 18px;
  color: var(--text);
  background: transparent;
  border: 0;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
}

.faq-item > button svg {
  flex-shrink: 0;
  color: var(--green);
  transition: transform 0.2s;
}

.faq-open > button svg { transform: rotate(45deg); }

.faq-answer {
  padding: 0 18px 17px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.8;
}

@media (max-width: 1250px) {
  .page-body { padding: 29px 24px 20px; }
  .hero-art { right: 0; opacity: 0.75; }
  .hero-content { max-width: 65%; }
}

@media (max-width: 900px) {
  .hero-art { right: -100px; opacity: 0.25; }
}

@media (max-width: 760px) {
  .page-body { padding: 25px 16px 20px; }
  .page-heading { align-items: flex-start; }
  .page-heading h1 { font-size: 28px; }
  .page-heading p { font-size: 11px; }
  .availability { padding: 9px; font-size: 0; }
  .contact-hero { min-height: 300px; padding: 25px 22px; }
  .hero-content { max-width: 100%; }
  .hero-content h2 { font-size: 29px; }
  .hero-content p { max-width: 380px; font-size: 11px; }
  .contact-methods { grid-template-columns: 1fr; gap: 11px; margin: 16px 0 30px; }
  .method-card { padding: 17px; }
  .method-card h3 { margin-top: 12px; }
  .method-card p { min-height: auto; }
  .form-panel { padding: 20px; }
}

@media (max-width: 460px) {
  .page-body { padding-right: 12px; padding-left: 12px; }
  .page-heading h1 { font-size: 25px; }
  .contact-hero { min-height: 310px; }
  .hero-content h2 { font-size: 26px; }
  .hero-art { right: -170px; opacity: 0.13; }
  .form-row { grid-template-columns: 1fr; gap: 0; }
  .form-panel { padding: 17px; }
  .section-heading h2 { font-size: 20px; }
  .faq-item > button { padding: 14px; font-size: 10px; }
}
</style>