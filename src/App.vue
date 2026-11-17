<template>
  <div class="portfolio" :data-theme="theme" id="top">
    <!-- ✅ FIX 1: Transition + SplashIntro correctly wired -->
    <Transition name="splash">
      <SplashIntro
        v-if="showSplash"
        @finish="showSplash = false"
      />
    </Transition>

    <header class="site-header">
      <div class="navbar">
        <a href="/" class="brand">
          <div class="mark">KS</div>
          <div class="brand-name">
            {{ t("brand.name") }}
            <small>{{ t("brand.tagline") }}</small>
          </div>
        </a>

        <nav class="links">
          <router-link to="/">{{ t("nav.home") }}</router-link>
          <router-link to="/about">{{ t("nav.about") }}</router-link>
          <router-link to="/administration">{{ t("nav.administration") }}</router-link>
          <router-link to="/services">{{ t("nav.services") }}</router-link>
          <router-link to="/dashboards">{{ t("nav.dashboard") }}</router-link>
          <router-link to="/news">{{ t("nav.media") }}</router-link>
          <router-link to="/research">{{ t("nav.research") }}</router-link>
          <router-link to="/contact">{{ t("nav.contact") }}</router-link>
        </nav>

        <div class="nav-tools">
          <div class="search-wrapper" ref="searchWrapper">
            <div class="search-box">
              <Search :size="16" aria-hidden="true" />
              <input
                v-model="query"
                type="search"
                :placeholder="t('search.placeholder')"
                :aria-label="t('search.placeholder')"
                @focus="searchFocused = true"
                @keyup.enter="goToFirstResult"
              />
              <button
                v-if="query"
                class="clear-btn"
                @click="clearSearch"
                :aria-label="t('search.clear')"
              >
                <X :size="14" />
              </button>
            </div>

            <transition name="fade">
              <div
                v-if="searchFocused && (query.trim() || suggestions.length)"
                class="search-results"
              >
                <template v-if="query.trim()">
                  <div v-if="results.length" class="results-list">
                    <router-link
                      v-for="item in results"
                      :key="item.title"
                      :to="item.path"
                      class="result-item"
                      @click="closeSearch"
                    >
                      <div class="result-icon" :class="item.color">
                        <component :is="item.icon" :size="16" />
                      </div>
                      <div class="result-copy">
                        <strong>{{ item.title }}</strong>
                        <small>{{ item.description }}</small>
                      </div>
                      <ArrowUpRight :size="14" class="result-arrow" />
                    </router-link>
                  </div>
                  <div v-else class="no-results">
                    <Search :size="20" />
                    <p>{{ t("search.noResults") }}</p>
                    <small>"{{ query }}"</small>
                  </div>
                </template>
                <template v-else>
                  <div class="results-header">
                    <span>{{ t("search.quickLinks") }}</span>
                  </div>
                  <router-link
                    v-for="item in suggestions"
                    :key="item.title"
                    :to="item.path"
                    class="result-item"
                    @click="closeSearch"
                  >
                    <div class="result-icon" :class="item.color">
                      <component :is="item.icon" :size="16" />
                    </div>
                    <div class="result-copy">
                      <strong>{{ item.title }}</strong>
                      <small>{{ item.description }}</small>
                    </div>
                    <ArrowUpRight :size="14" class="result-arrow" />
                  </router-link>
                </template>
              </div>
            </transition>
          </div>

          <select v-model="language" :aria-label="t('lang.label')" class="lang-select">
            <option value="en">EN</option>
            <option value="rw">RW</option>
            <option value="fr">FR</option>
            <option value="sw">SW</option>
          </select>

          <button
            class="theme-btn"
            @click="toggleTheme"
            :aria-label="theme === 'dark' ? t('theme.toLight') : t('theme.toDark')"
          >
            <Moon v-if="theme === 'dark'" :size="18" />
            <Sun v-else :size="18" />
          </button>
        </div>
      </div>
    </header>

    <router-view />

    <footer class="site-footer" id="contact">
      <div class="footer-main">
        <div class="footer-brand-col">
          <a href="/" class="footer-brand">
            <div class="mark">KS</div>
            <span>{{ t("brand.name") }}</span>
          </a>
          <p class="footer-tagline">{{ t("footer.tagline") }}</p>
          <p class="footer-note">
            <Info :size="14" />
            {{ t("footer.note") }}
          </p>
        </div>

        <div class="footer-links-col">
          <h4>{{ t("footer.explore") }}</h4>
          <router-link to="/"><Home :size="14" /> {{ t("nav.home") }}</router-link>
          <router-link to="/about"><Users :size="14" /> {{ t("nav.about") }}</router-link>
          <router-link to="/services"><Briefcase :size="14" /> {{ t("nav.services") }}</router-link>
          <router-link to="/news"><Newspaper :size="14" /> {{ t("nav.media") }}</router-link>
        </div>

        <div class="footer-links-col">
          <h4>{{ t("footer.resources") }}</h4>
          <router-link to="/research"><FlaskConical :size="14" /> {{ t("nav.research") }}</router-link>
          <router-link to="/dashboards"><LayoutDashboard :size="14" /> {{ t("nav.dashboard") }}</router-link>
          <router-link to="/administration"><Building2 :size="14" /> {{ t("nav.administration") }}</router-link>
          <router-link to="/contact"><Mail :size="14" /> {{ t("nav.contact") }}</router-link>
        </div>

        <div class="footer-links-col">
          <h4>{{ t("footer.contact") }}</h4>
          <p><MapPin :size="14" /> {{ t("footer.location") }}</p>
          <p><Clock :size="14" /> {{ t("footer.hours") }}</p>
          <a href="#contact"><Mail :size="14" /> {{ t("footer.contactLink") }}</a>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© {{ currentYear }} {{ t("footer.rights") }}</p>
        <a href="#top" class="back-to-top">
          {{ t("footer.backToTop") }} <ArrowUp :size="14" />
        </a>
      </div>
    </footer>

    <transition name="slide-up">
      <div v-if="showWelcome" class="welcome-toast">
        <div class="welcome-icon">👋</div>
        <div class="welcome-copy">
          <strong>{{ t("welcome.title") }}</strong>
          <p>{{ t("welcome.message") }}</p>
        </div>
        <button @click="dismissWelcome" :aria-label="t('welcome.close')">
          <X :size="16" />
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
import {
  Search, Sun, Moon, Home, Users, Briefcase, Newspaper,
  FlaskConical, LayoutDashboard, Building2, Mail, MapPin,
  Clock, Info, ArrowUp, ArrowUpRight, X, FileText
} from "lucide-vue-next";
import SplashIntro from "./components/SplashIntro.vue";

export default {
  name: "App",

  components: {
    Search, Sun, Moon, Home, Users, Briefcase, Newspaper,
    FlaskConical, LayoutDashboard, Building2, Mail, MapPin,
    Clock, Info, ArrowUp, ArrowUpRight, X, FileText,
    SplashIntro // ✅ FIX 2: register the component
  },

  data() {
    return {
      theme: "dark",
      language: "en",
      query: "",
      searchFocused: false,
      showWelcome: false,
      showSplash: true, // ✅ FIX 3: declare it inside data() — this was the missing piece

      translations: {
        /* ============================================================
           ENGLISH
           ============================================================ */
        en: {
          "brand.name": "KITABI SECTOR",
          "brand.tagline": "DIGITAL PORTFOLIO",
          "nav.home": "Home",
          "nav.about": "About",
          "nav.administration": "Administration",
          "nav.services": "Services",
          "nav.dashboard": "Dashboard",
          "nav.media": "Media Center",
          "nav.research": "Research",
          "nav.contact": "Contact",
          "search.placeholder": "Search anything...",
          "search.clear": "Clear search",
          "search.noResults": "No results found",
          "search.quickLinks": "Quick links",
          "lang.label": "Select language",
          "theme.toLight": "Switch to light theme",
          "theme.toDark": "Switch to dark theme",
          "footer.tagline": "Digital Portfolio · Nyamagabe District, Rwanda",
          "footer.note": "Sample content — verify all official information before publishing.",
          "footer.explore": "Explore",
          "footer.resources": "Resources",
          "footer.contact": "Contact",
          "footer.location": "Kitabi Sector, Nyamagabe District, Rwanda",
          "footer.hours": "Mon – Fri, 8:00 – 17:00",
          "footer.contactLink": "Contact the sector office",
          "footer.rights": "Kitabi Sector with kennedy Dev(codeman) · All rights reserved",
          "footer.backToTop": "Back to top",
          "welcome.title": "Murakaza neza! Welcome!",
          "welcome.message": "Explore Kitabi Sector's digital portfolio — services, research, and community updates.",
          "welcome.close": "Dismiss",

          /* ABOUT */
          "about.eyebrow": "WELCOME TO KITABI SECTOR",
          "about.title": "About Our",
          "about.titleSpan": "Sector",
          "about.intro": "Discover our community, our values, and our commitment to building a better future for every resident.",
          "about.imageAlt": "Green countryside and agricultural landscape",
          "about.imageLabelTitle": "Growing Together",
          "about.imageLabelText": "A stronger community for everyone",
          "about.whoTag": "WHO WE ARE",
          "about.whoTitle": "Building a Better Future for Kitabi",
          "about.whoP1": "Kitabi Sector is a local administrative community in Nyamagabe District, Southern Province, Rwanda. This digital portfolio provides a central place to learn about the sector, discover public services, and access useful community information.",
          "about.whoP2": "We aim to encourage community participation, support local development, improve access to information, and promote cooperation between residents and local administration.",
          "about.point1": "Community development",
          "about.point2": "Accessible public information",
          "about.point3": "Transparent local administration",
          "about.point4": "Sustainable progress",
          "about.ctaMission": "Discover Our Mission",
          "about.purposeTag": "OUR PURPOSE",
          "about.purposeTitle": "Mission, Vision & Values",
          "about.purposeText": "The principles that guide our work and our community.",
          "about.missionTitle": "Our Mission",
          "about.missionText": "To support inclusive community development and make public information and services easier for residents to access.",
          "about.visionTitle": "Our Vision",
          "about.visionText": "A connected, informed, and thriving community where residents participate in sustainable development and shared progress.",
          "about.valuesTitle": "Our Values",
          "about.valuesText": "Integrity, accountability, teamwork, respect, innovation, and service to the community.",
          "about.communityTag": "OUR COMMUNITY",
          "about.communityTitle": "Kitabi at a Glance",
          "about.communityText": "Explore the key areas that contribute to local development.",
          "about.factCommunity": "Community",
          "about.factCommunityText": "Supporting residents and strengthening community participation.",
          "about.factAgriculture": "Agriculture",
          "about.factAgricultureText": "Encouraging sustainable farming and local economic activities.",
          "about.factEducation": "Education",
          "about.factEducationText": "Promoting learning, skills development, and opportunity.",
          "about.factWellbeing": "Well-being",
          "about.factWellbeingText": "Supporting awareness of health and essential community services.",
          "about.servicesTag": "WHAT WE DO",
          "about.servicesTitle": "Community Services",
          "about.servicesText": "Information and services residents may need in everyday life.",
          "about.serviceAdmin": "Administrative Information",
          "about.serviceAdminText": "Find information about local administration and public procedures.",
          "about.serviceCommunity": "Community Engagement",
          "about.serviceCommunityText": "Encourage participation in community activities and development.",
          "about.serviceNews": "News & Announcements",
          "about.serviceNewsText": "Stay informed about notices, activities, and public updates.",
          "about.serviceContact": "Contact & Support",
          "about.serviceContactText": "Find relevant channels for questions and public inquiries.",
          "about.ctaTag": "LET'S WORK TOGETHER",
          "about.ctaTitle": "Be Part of Kitabi's Development",
          "about.ctaText": "A better community starts with informed residents and shared responsibility.",
          "about.ctaButton": "District Website",

          /* ADMIN */
          "admin.eyebrow": "KITABI SECTOR • LEADERSHIP",
          "admin.title": "Sector",
          "admin.titleSpan": "Administration",
          "admin.intro": "Learn about local administration, leadership responsibilities, and the organizational structure supporting our community.",
          "admin.overviewTag": "ADMINISTRATION OVERVIEW",
          "admin.overviewTitle": "Serving the Kitabi Community",
          "admin.overviewText": "Local administration helps coordinate public services, community participation, and development priorities.",
          "admin.cardGovTitle": "Local Governance",
          "admin.cardGovText": "Supporting effective local administration and coordination with the district.",
          "admin.cardServicesTitle": "Community Services",
          "admin.cardServicesText": "Helping residents access information and understand administrative procedures.",
          "admin.cardDevTitle": "Development Planning",
          "admin.cardDevText": "Coordinating community priorities and supporting local development initiatives.",
          "admin.cardParticipationTitle": "Public Participation",
          "admin.cardParticipationText": "Encouraging cooperation, dialogue, and participation in community activities.",
          "admin.leadershipTag": "LEADERSHIP TEAM",
          "admin.leadershipTitle": "Meet Our Administration",
          "admin.leadershipText": "The administration team is responsible for coordinating local activities and supporting residents.",
          "admin.noticeStrong": "Official information required:",
          "admin.noticeText": "Replace the sample profiles below with verified names, titles, photographs, and contact details of current Kitabi Sector officials.",
          "admin.leaderLabel": "SECTOR LEADERSHIP",
          "admin.viewResponsibilities": "View Responsibilities",
          "admin.structureTag": "HOW WE ARE ORGANIZED",
          "admin.structureTitle": "Administrative Structure",
          "admin.structureText": "An illustrative overview of how local administration connects with community-level leadership.",
          "admin.structureDistrict": "Nyamagabe District",
          "admin.structureDistrictText": "District-level coordination and oversight",
          "admin.structureSector": "Kitabi Sector",
          "admin.structureSectorText": "Sector-level administration and service coordination",
          "admin.structureCells": "Cells",
          "admin.structureCellsText": "Local coordination",
          "admin.structureVillages": "Villages (Imidugudu)",
          "admin.structureVillagesText": "Community engagement",
          "admin.structureNote": "Illustrative structure only. Confirm the current official administrative organization before publication.",
          "admin.responsibilitiesTag": "OUR RESPONSIBILITIES",
          "admin.responsibilitiesTitle": "What the Administration Does",
          "admin.responsibilitiesText": "The administration works to connect community needs with public services and local development activities.",
          "admin.commitmentLabel": "OUR COMMITMENT",
          "admin.commitmentTitle": "Leadership Through Service",
          "admin.commitmentText": "Working together for accountability, community participation, and sustainable development.",
          "admin.commitmentTag1": "COMMUNITY",
          "admin.commitmentTag2": "TRANSPARENCY",
          "admin.commitmentTag3": "DEVELOPMENT",
          "admin.contactTag": "GET IN TOUCH",
          "admin.contactTitle": "Need Administrative Information?",
          "admin.contactText": "Contact the relevant sector or district office for verified information about public services and administrative procedures.",
          "admin.contactButton": "District Website",
          "admin.modalTag": "ROLE & RESPONSIBILITIES",
          "admin.modalNote": "Official names and individual duties should be confirmed with the relevant administration.",
          "admin.modalClose": "Close",

          /* SERVICES */
          "services.eyebrow": "PUBLIC SERVICE • COMMUNITY SUPPORT",
          "services.title": "Services for",
          "services.titleSpan": "Everyone",
          "services.intro": "Find information about administrative procedures, community support, development initiatives, and public services relevant to residents of Kitabi Sector.",
          "services.heroButton": "Explore Services",
          "services.artInfo": "Public Information",
          "services.artInfoSub": "Easy to access",
          "services.artCommunity": "Community First",
          "services.artCommunitySub": "Working together",
          "services.quickAdmin": "Administration",
          "services.quickAdminSub": "Procedures & information",
          "services.quickCommunity": "Community",
          "services.quickCommunitySub": "Support & participation",
          "services.quickInfo": "Information",
          "services.quickInfoSub": "News & announcements",
          "services.dirTag": "SERVICE DIRECTORY",
          "services.dirTitle": "How Can We Help You?",
          "services.dirText": "Browse the service categories or search for information you need.",
          "services.searchPlaceholder": "Search services...",
          "services.catAll": "All Services",
          "services.catAdmin": "Administration",
          "services.catCommunity": "Community",
          "services.catDevelopment": "Development",
          "services.catInfo": "Information",
          "services.clickToView": "Click to view",
          "services.viewDetails": "View Details",
          "services.emptyTitle": "No services found",
          "services.emptyText": "Try another keyword or choose a different category.",
          "services.emptyReset": "Reset Filters",
          "services.stepsTag": "SIMPLE PROCESS",
          "services.stepsTitle": "How to Access a Service",
          "services.stepsText": "Use this simple guide to prepare before contacting the relevant office about a public service.",
          "services.step1Title": "Find Your Service",
          "services.step1Text": "Browse the directory and identify the information you need.",
          "services.step2Title": "Confirm Requirements",
          "services.step2Text": "Ask the responsible office about documents, fees, and procedures.",
          "services.step3Title": "Contact the Office",
          "services.step3Text": "Use an official contact channel to confirm the next steps.",
          "services.helpLabel": "NEED ASSISTANCE?",
          "services.helpTitle": "Not sure where to start?",
          "services.helpText": "Consult the relevant local office or visit the Nyamagabe District website to find official information.",
          "services.helpButton": "Visit District Website",
          "services.noticeStrong": "Important information",
          "services.noticeText": "This page is an informational portfolio. The service descriptions are general examples, not a verified list of services offered directly by Kitabi Sector. Confirm official procedures, required documents, costs, and processing times with the responsible office.",
          "services.modalNext": "What to do next",
          "services.modalLink": "Find Official Information",
          "services.modalClose": "Close",
          "services.svc1Title": "Administrative Information",
          "services.svc1Desc": "Learn about local administrative procedures and where to request official guidance.",
          "services.svc1Details": "Residents can consult the appropriate administrative office to understand public procedures, applicable requirements, and the correct place to submit a request.",
          "services.svc1Next": "Contact the responsible office to confirm the procedure, required documents, and any applicable fees.",
          "services.svc2Title": "Civil Documentation Guidance",
          "services.svc2Desc": "Find out where to ask about civil records and related administrative documentation.",
          "services.svc2Details": "This information category helps residents identify the appropriate public office for questions about civil documentation and official records.",
          "services.svc2Next": "Confirm the competent office and the current application requirements before preparing documents.",
          "services.svc3Title": "Community Participation",
          "services.svc3Desc": "Learn how residents can participate in local meetings and community initiatives.",
          "services.svc3Details": "Community participation encourages residents to share concerns, discuss local priorities, and take part in appropriate community activities.",
          "services.svc3Next": "Ask local community leaders or the relevant administrative office about upcoming meetings and activities.",
          "services.svc4Title": "Community Development",
          "services.svc4Desc": "Explore information about local development priorities and community initiatives.",
          "services.svc4Details": "Community development brings residents and relevant institutions together to support local priorities and sustainable improvement.",
          "services.svc4Next": "Contact the relevant local office to learn about current initiatives and ways to participate.",
          "services.svc5Title": "Agriculture Information",
          "services.svc5Desc": "Find general guidance on agricultural support and where to ask farming-related questions.",
          "services.svc5Details": "Residents can seek information about available agricultural guidance, farming initiatives, and relevant extension services.",
          "services.svc5Next": "Ask the responsible agricultural officer or district service about currently available support.",
          "services.svc6Title": "Education Information",
          "services.svc6Desc": "Find guidance on local education information and relevant support channels.",
          "services.svc6Details": "This category helps residents identify appropriate schools or public offices for education-related information.",
          "services.svc6Next": "Contact the relevant school or education office to confirm current requirements and available support.",
          "services.svc7Title": "Public Notices & News",
          "services.svc7Desc": "Stay informed about public announcements, community events, and important notices.",
          "services.svc7Details": "Public notices help residents stay informed about relevant community activities, official announcements, and local updates.",
          "services.svc7Next": "Check official sector or district communication channels for current announcements.",
          "services.svc8Title": "Feedback & Public Inquiries",
          "services.svc8Desc": "Learn where to direct questions, feedback, and general public inquiries.",
          "services.svc8Details": "Residents can seek guidance on how to raise a question or provide feedback through the appropriate official communication channel.",
          "services.svc8Next": "Identify the responsible office and use its verified contact information to submit your inquiry.",

          /* DASHBOARD */
          "dashboard.tag": "KITABI SECTOR DIGITAL PORTFOLIO",
          "dashboard.welcome": "Welcome to Your Dashboard",
          "dashboard.welcomeText": "A central overview of community information, public services, announcements, and local development.",
          "dashboard.exploreServices": "Explore Services",
          "dashboard.glance": "AT A GLANCE",
          "dashboard.summary": "Sector Summary",
          "dashboard.summaryText": "Overview of key portfolio information.",
          "dashboard.demoBadge": "DEMO DATA",
          "dashboard.overview": "OVERVIEW",
          "dashboard.devTitle": "Community Development",
          "dashboard.periodLabel": "Reporting period",
          "dashboard.periodQuarterly": "Quarterly",
          "dashboard.periodMonthly": "Monthly",
          "dashboard.periodYearly": "Yearly",
          "dashboard.planned": "Planned activities",
          "dashboard.completed": "Completed activities",
          "dashboard.chartNote": "Illustrative figures only. Connect verified reporting data to display actual progress.",
          "dashboard.shortcuts": "SHORTCUTS",
          "dashboard.quickTitle": "Quick Actions",
          "dashboard.latestUpdates": "LATEST UPDATES",
          "dashboard.announceTitle": "Recent Announcements",
          "dashboard.viewAll": "View All",
          "dashboard.readMore": "Read announcement",
          "dashboard.sectorInfo": "SECTOR INFORMATION",
          "dashboard.portfolioTitle": "Portfolio Details",
          "dashboard.location": "Location",
          "dashboard.locationValue": "Nyamagabe District, Rwanda",
          "dashboard.websiteStatus": "Website Status",
          "dashboard.websiteValue": "Portfolio Preview",
          "dashboard.statistics": "Statistics",
          "dashboard.statisticsValue": "Awaiting verified data",
          "dashboard.currentYear": "Current Year",
          "dashboard.districtLink": "Visit Nyamagabe District Website",
          "dashboard.close": "Close",
          "dashboard.infoKicker": "DASHBOARD INFORMATION",
          "dashboard.demoNote": "This dashboard currently uses local demonstration data. Live management and reporting require a backend and database.",
          "dashboard.announceNote": "This is sample announcement content. Replace it with an official notice before publishing.",
          "dashboard.notAvailable": "Not available",
          "dashboard.sampleEntries": "Sample entries",
          "dashboard.statPopulation": "Community Population",
          "dashboard.statPopulationCap": "Add verified population figures",
          "dashboard.statCells": "Administrative Cells",
          "dashboard.statCellsCap": "Confirm official cell count",
          "dashboard.statServices": "Public Services",
          "dashboard.statServicesCap": "Illustrative service directory",
          "dashboard.statAnnounce": "Announcements",
          "dashboard.statAnnounceCap": "Illustrative announcements",
          "dashboard.actionExplore": "Explore Services",
          "dashboard.actionExploreText": "Browse public service information",
          "dashboard.actionAdmin": "View Administration",
          "dashboard.actionAdminText": "Explore leadership and structure",
          "dashboard.actionAbout": "About Kitabi",
          "dashboard.actionAboutText": "Learn about the sector",
          "dashboard.actionDistrict": "Official District Website",
          "dashboard.actionDistrictText": "Visit the district's public website",
          "dashboard.panelPopulation": "Community Population",
          "dashboard.panelPopulationText": "The population figure has not been entered. Add a verified number from an official source before displaying it.",
          "dashboard.panelCells": "Administrative Cells",
          "dashboard.panelCellsText": "Enter the confirmed number of administrative cells using official sector or district records.",
          "dashboard.panelServices": "Public Services",
          "dashboard.panelServicesText": "The service count represents example entries in this portfolio, not a verified count of official services.",
          "dashboard.panelAnnouncements": "Announcements",
          "dashboard.panelAnnouncementsText": "Manage official public notices here after connecting an announcement system or backend.",
          "dashboard.ann1Title": "Community Development Updates",
          "dashboard.ann1Category": "Community",
          "dashboard.ann1Date": "Sample notice",
          "dashboard.ann1Desc": "Use this section to share verified information about current community development activities.",
          "dashboard.ann2Title": "Public Service Information",
          "dashboard.ann2Category": "Services",
          "dashboard.ann2Date": "Sample notice",
          "dashboard.ann2Desc": "Publish official information about public procedures and where residents can seek assistance.",
          "dashboard.ann3Title": "Community Meetings",
          "dashboard.ann3Category": "Events",
          "dashboard.ann3Date": "Sample notice",
          "dashboard.ann3Desc": "Add confirmed details about community meetings, including dates, locations, and participation requirements.",

          /* MEDIA */
          "media.notifTitle": "Notifications",
          "media.notifText1": "You are viewing the Media Center.",
          "media.notifText2": "New official announcements will appear here when connected.",
          "media.close": "Close",
          "media.eyebrow": "OUR STORIES AND MOMENTS",
          "media.title": "Media Center",
          "media.intro": "Explore photos, videos, and stories showcasing the development and community life of Kitabi Sector.",
          "media.exploreGallery": "Explore Gallery",
          "media.featuredTag": "FEATURED STORY",
          "media.featuredTitle": "Celebrating Community and Local Development",
          "media.featuredText": "Discover the people, projects, and initiatives contributing to a brighter future for our community.",
          "media.featuredButton": "Explore the story",
          "media.featuredDate": "Featured",
          "media.featuredDesc": "Discover the people, projects, and initiatives contributing to a brighter future for our community. Replace this sample story with verified information from Kitabi Sector.",
          "media.statPhotos": "Photo Gallery",
          "media.statPhotosSub": "Sample gallery items",
          "media.statVideos": "Video Gallery",
          "media.statVideosSub": "Sample video items",
          "media.statStories": "Community Stories",
          "media.statStoriesSub": "Sample stories",
          "media.galleryKicker": "DISCOVER OUR COMMUNITY",
          "media.galleryTitle": "Explore Our Media",
          "media.galleryText": "Memorable moments and stories from our community.",
          "media.viewAll": "View all",
          "media.catAll": "All",
          "media.catPhotos": "Photos",
          "media.catVideos": "Videos",
          "media.catStories": "Stories",
          "media.catFeatured": "Featured Story",
          "media.items": "items",
          "media.typePhoto": "PHOTO",
          "media.typeVideo": "VIDEO",
          "media.typeStory": "STORY",
          "media.openMedia": "View media",
          "media.emptyTitle": "No media found",
          "media.emptyText": "Try another search term or select a different category.",
          "media.emptyReset": "Clear filters",
          "media.bannerTitle": "Every moment tells a story",
          "media.bannerText": "Stay connected with community activities, local initiatives, and development updates.",
          "media.bannerButton": "About our media",
          "media.locationValue": "Kitabi Sector, Nyamagabe District, Rwanda",
          "media.closePreview": "Close preview",
          "media.infoTitle": "About the Media Center",
          "media.infoText": "The Media Center is a place to share photos, videos, and stories about Kitabi Sector's community life and development.",
          "media.infoNote": "This page currently contains sample content. Replace it with verified photos, official videos, and approved community stories.",
          "media.infoGotIt": "Got it",
          "media.item1Title": "Our Beautiful Green Landscape",
          "media.item1Date": "Community Gallery",
          "media.item1Desc": "A view of the beautiful natural landscapes found across Rwanda.",
          "media.item2Title": "Building Stronger Communities",
          "media.item2Date": "Community Activities",
          "media.item2Desc": "Community participation and collective efforts for local development.",
          "media.item3Title": "A Look at Rural Life",
          "media.item3Date": "Video Collection",
          "media.item3Desc": "A video collection celebrating daily life and the natural environment.",
          "media.item4Title": "Growing Together",
          "media.item4Date": "Community Stories",
          "media.item4Desc": "Stories about cooperation, opportunity, and community progress.",
          "media.item5Title": "Nature and Our Environment",
          "media.item5Date": "Environment",
          "media.item5Desc": "Celebrating the landscapes and natural beauty of our region.",
          "media.item6Title": "Working Together for Progress",
          "media.item6Date": "Video Collection",
          "media.item6Desc": "A sample feature about teamwork and community development.",

          /* RESEARCH */
          "research.notifTitle": "Notifications",
          "research.notifText1": "You are viewing the Research Center.",
          "research.notifText2": "New research announcements will appear here when available.",
          "research.close": "Close",
          "research.eyebrow": "KNOWLEDGE AND DISCOVERY",
          "research.title": "Research Center",
          "research.intro": "Explore research topics, community studies, and development resources relevant to Kitabi Sector.",
          "research.guidelinesBtn": "Research Guidelines",
          "research.heroTag": "KNOWLEDGE FOR DEVELOPMENT",
          "research.heroTitle1": "Research Today.",
          "research.heroTitle2": "Improve Tomorrow.",
          "research.heroText": "Discover insights and information that can support informed decisions, sustainable development, and community progress.",
          "research.heroButton": "Explore research",
          "research.heroCardTag": "RESEARCH & INSIGHTS",
          "research.heroCardTitle1": "Knowledge",
          "research.heroCardTitle2": "in Action",
          "research.statRecords": "Research Records",
          "research.statRecordsSub": "Sample records",
          "research.statPublished": "Published",
          "research.statPublishedSub": "Sample published records",
          "research.statProgress": "In Progress",
          "research.statProgressSub": "Sample ongoing records",
          "research.statTopics": "Research Topics",
          "research.statTopicsSub": "Across the sample library",
          "research.topicsKicker": "BROWSE BY INTEREST",
          "research.topicsTitle": "Research Categories",
          "research.topicsText": "Find information by subject area.",
          "research.topicAgriculture": "Agriculture",
          "research.topicAgricultureText": "Farming and food security",
          "research.topicEnvironment": "Environment",
          "research.topicEnvironmentText": "Nature and sustainability",
          "research.topicCommunity": "Community",
          "research.topicCommunityText": "People and development",
          "research.topicEducation": "Education",
          "research.topicEducationText": "Learning and skills",
          "research.topicHealth": "Public Health",
          "research.topicHealthText": "Health and wellbeing",
          "research.topicInfrastructure": "Infrastructure",
          "research.topicInfrastructureText": "Roads and public facilities",
          "research.libraryKicker": "RESEARCH LIBRARY",
          "research.libraryTitle": "Research and Publications",
          "research.libraryText": "Browse available records and their publication status.",
          "research.exportBtn": "Export CSV",
          "research.searchPlaceholder": "Search titles, topics, descriptions...",
          "research.statusLabel": "Filter by status",
          "research.statusAll": "All statuses",
          "research.statusPublished": "Published",
          "research.statusProgress": "In Progress",
          "research.statusDraft": "Draft",
          "research.yearLabel": "Filter by year",
          "research.yearAll": "All years",
          "research.thTitle": "RESEARCH TITLE",
          "research.thCategory": "CATEGORY",
          "research.thYear": "YEAR",
          "research.thStatus": "STATUS",
          "research.thAction": "ACTION",
          "research.viewBtn": "View",
          "research.emptyTitle": "No research records found",
          "research.emptyText": "Try changing your search or filters.",
          "research.emptyReset": "Clear filters",
          "research.ctaTitle": "Interested in contributing to research?",
          "research.ctaText": "Contact the appropriate local administration to discuss research opportunities and information requests.",
          "research.ctaButton": "Official website",
          "research.modalKicker": "RESEARCH RECORD",
          "research.detailCategory": "Category",
          "research.detailYear": "Year",
          "research.detailStatus": "Status",
          "research.detailSource": "Source",
          "research.demoNotice": "This is demonstration content, not a verified research publication. Replace it with an official record before publishing.",
          "research.modalClose": "Close details",
          "research.guideKicker": "RESEARCH GUIDELINES",
          "research.guideTitle": "Using the Research Center",
          "research.guideText": "Use this section to organize community research and development resources.",
          "research.guide1": "Use reliable sources and verify research findings.",
          "research.guide2": "Record the author, publication year, and source.",
          "research.guide3": "Obtain permission before publishing personal or confidential information.",
          "research.guide4": "Clearly identify draft, ongoing, and published research.",
          "research.guideUnderstood": "Understood",
          "research.sourceSample": "Sample entry",
          "research.r1Title": "Sustainable Agriculture and Food Security",
          "research.r1Desc": "Sample record for agricultural practices and food security research.",
          "research.r2Title": "Environmental Conservation and Land Use",
          "research.r2Desc": "Sample record covering environmental protection and sustainable land use.",
          "research.r3Title": "Community Participation in Local Development",
          "research.r3Desc": "Sample record about community engagement in development initiatives.",
          "research.r4Title": "Access to Education and Learning Resources",
          "research.r4Desc": "Sample record about education access and learning opportunities.",
          "research.r5Title": "Public Health Awareness and Prevention",
          "research.r5Desc": "Sample record about health education and prevention initiatives.",
          "research.r6Title": "Rural Infrastructure and Service Access",
          "research.r6Desc": "Sample record about infrastructure and access to essential services.",

          /* CONTACT */
          "contact.notifTitle": "Notifications",
          "contact.notifText1": "You are viewing the Contact Center.",
          "contact.notifText2": "New messages will appear here when notifications are connected.",
          "contact.close": "Close",
          "contact.eyebrow": "WE ARE READY TO HELP",
          "contact.title": "Contact Us",
          "contact.intro": "Get in touch with us for information, assistance, or questions about services and development in Kitabi Sector.",
          "contact.availability": "Public information portal",
          "contact.heroTag": "LET'S CONNECT",
          "contact.heroTitle1": "Your voice matters.",
          "contact.heroTitle2": "We're listening.",
          "contact.heroText": "We value your questions, feedback, and ideas. Connect with the appropriate office for guidance and support.",
          "contact.heroButton": "Send us a message",
          "contact.artTag": "COMMUNITY SUPPORT",
          "contact.artTitle1": "We're here",
          "contact.artTitle2": "to listen.",
          "contact.methodEmailTitle": "Email Enquiries",
          "contact.methodEmailDesc": "Find official contact information through the district website.",
          "contact.methodEmailAction": "Visit website",
          "contact.methodWebsiteTitle": "Official Website",
          "contact.methodWebsiteDesc": "Access official district information, announcements, and resources.",
          "contact.methodWebsiteAction": "Explore website",
          "contact.methodEnquiriesTitle": "General Enquiries",
          "contact.methodEnquiriesDesc": "Prepare a message for a question, suggestion, or service enquiry.",
          "contact.methodEnquiriesAction": "Write a message",
          "contact.formKicker": "SEND AN ENQUIRY",
          "contact.formTitle": "How can we help you?",
          "contact.formText": "Complete the form below to prepare your message.",
          "contact.formSuccessTitle": "Message prepared successfully",
          "contact.formSuccessText": "Your message has been prepared. This demo does not send it to a server.",
          "contact.labelName": "Full name",
          "contact.labelEmail": "Email address",
          "contact.labelPhone": "Phone number",
          "contact.labelSubject": "Subject",
          "contact.labelMessage": "Your message",
          "contact.placeholderName": "Enter your full name",
          "contact.placeholderPhone": "Optional phone number",
          "contact.placeholderMessage": "Tell us how we can assist you...",
          "contact.subjectPlaceholder": "Select a subject",
          "contact.subjectGeneral": "General Information",
          "contact.subjectServices": "Public Services",
          "contact.subjectCommunity": "Community Development",
          "contact.subjectResearch": "Research and Information",
          "contact.subjectFeedback": "Feedback or Suggestion",
          "contact.subjectOther": "Other Enquiry",
          "contact.consent": "I confirm that the information provided is accurate and may be used to respond to my enquiry.",
          "contact.characters": "characters",
          "contact.submit": "Prepare message",
          "contact.formNote": "Please do not include passwords or sensitive personal information.",
          "contact.faqKicker": "QUICK ANSWERS",
          "contact.faqTitle": "Frequently Asked Questions",
          "contact.faqText": "Find helpful information before sending an enquiry.",
          "contact.faq1Q": "How can I ask about local public services?",
          "contact.faq1A": "Select Public Services in the contact form and explain the service you need. Consult the official district website for verified contact details.",
          "contact.faq2Q": "How can I share a suggestion about community development?",
          "contact.faq2A": "Choose Feedback or Suggestion and describe your idea clearly. The form on this demonstration page does not send submissions to the administration.",
          "contact.faq3Q": "How do I find official contact information?",
          "contact.faq3A": "Visit the Nyamagabe District official website at nyamagabe.gov.rw to look for current public contact information.",
          "contact.faq4Q": "Will I receive a response after submitting this form?",
          "contact.faq4A": "Not yet. This frontend demonstration validates your entries and displays a confirmation, but sending and receiving messages requires a backend or a connected email service.",

          /* HOME */
          "home.welcome": "WELCOME TO",
          "home.heroTitle": "Kitabi Sector",
          "home.heroSubtitle": "Nyamagabe District, Southern Province, Rwanda",
          "home.heroText": "Discover the beauty, opportunities, and achievements of Kitabi Sector. A land of green hills, culture, innovation, and sustainable development.",
          "home.exploreBtn": "Explore Kitabi",
          "home.dashboardBtn": "View Dashboard",
          "home.heroNote": "Discover our community, services and opportunities",
          "home.mapTitle": "Kitabi Sector",
          "home.mapSub": "Community overview",
          "home.mapAria": "Illustrative Kitabi community map",
          "home.cell1": "Kagano",
          "home.cell2": "Uwingugu",
          "home.cell3": "Mukungu",
          "home.cell4": "Mujuga",
          "home.cell5": "Shyaba",
          "home.statPop": "Population",
          "home.statPopCap": "Official data needed",
          "home.statCells": "Cells",
          "home.statCellsCap": "Verify officially",
          "home.statVillages": "Villages",
          "home.statVillagesCap": "Verify officially",
          "home.statEmployees": "Employees",
          "home.statEmployeesCap": "Official data needed",
          "home.statProjects": "Projects",
          "home.statProjectsCap": "Official data needed",
          "home.statBudget": "Budget",
          "home.statBudgetCap": "Official data needed",
          "home.statRevenue": "Revenue",
          "home.statRevenueCap": "Official data needed",
          "home.statExpenditure": "Expenditure",
          "home.statExpenditureCap": "Official data needed",
          "home.aboutKicker": "OUR COMMUNITY",
          "home.aboutTitle": "About Kitabi Sector",
          "home.aboutText": "Discover the community, landscape, and opportunities that make Kitabi special.",
          "home.aboutLocationTitle": "Location",
          "home.aboutLocationText": "Kitabi Sector is in Nyamagabe District, Southern Province of Rwanda.",
          "home.aboutEnvironmentTitle": "Environment",
          "home.aboutEnvironmentText": "The surrounding highland environment supports biodiversity, agriculture, and nature-based tourism.",
          "home.aboutCommunityTitle": "Community",
          "home.aboutCommunityText": "Community participation and accessible public services support local development.",
          "home.adminKicker": "LOCAL GOVERNANCE",
          "home.adminTitle": "Administration",
          "home.adminText": "Local administration supports community development and public service delivery.",
          "home.adminOfficeTitle": "Kitabi Sector Office",
          "home.adminOfficeText": "Contact the relevant local authority for official administrative information, service requirements, and current office contacts.",
          "home.adminItem1Title": "Community services",
          "home.adminItem1Text": "Information and guidance for residents.",
          "home.adminItem2Title": "Local development",
          "home.adminItem2Text": "Community programs and project coordination.",
          "home.adminItem3Title": "Public information",
          "home.adminItem3Text": "Announcements, notices, and reports.",
          "home.ctaKicker": "WE'RE HERE TO HELP",
          "home.ctaTitle": "Connect with Kitabi Sector",
          "home.ctaText": "For official requests and verified information, contact the relevant sector or district office.",
          "home.ctaButton": "Visit District Website"
        },

        /* ============================================================
           KINYARWANDA
           ============================================================ */
        rw: {
          "brand.name": "UMURENGE WA KITABI",
          "brand.tagline": "URUBUGA MBARU",
          "nav.home": "Ahabanza",
          "nav.about": "Abo turi bo",
          "nav.administration": "Ubuyobozi",
          "nav.services": "Serivisi",
          "nav.dashboard": "Imibare",
          "nav.media": "Amakuru",
          "nav.research": "Ubushakashatsi",
          "nav.contact": "Twandikire",
          "search.placeholder": "Shakisha...",
          "search.clear": "Siba",
          "search.noResults": "Nta byabonetse",
          "search.quickLinks": "Ihuza ryihuse",
          "lang.label": "Hitamo ururimi",
          "theme.toLight": "Hindura mu ifoto yera",
          "theme.toDark": "Hindura mu ifoto yijimye",
          "footer.tagline": "Urubuga mbara · Akarere ka Nyamagabe, u Rwanda",
          "footer.note": "Ibi ni urugero — genzura amakuru yose yemewe mbere yo gutangaza.",
          "footer.explore": "Reba",
          "footer.resources": "Ibikoresho",
          "footer.contact": "Twandikire",
          "footer.location": "Umurenge wa Kitabi, Akarere ka Nyamagabe, u Rwanda",
          "footer.hours": "Kuwa mbere – Kuwa gatanu, 8:00 – 17:00",
          "footer.contactLink": "Twandikire ibiro by'umurenge",
          "footer.rights": "Umurenge wa Kitabi na kennedy Dev(codeman) · Uburenganzira bwose burafitwe",
          "footer.backToTop": "Subira hejuru",
          "welcome.title": "Murakaza neza!",
          "welcome.message": "Menya urubuga mbara rw'Umurenge wa Kitabi — serivisi, ubushakashatsi n'amakuru y'abaturage.",
          "welcome.close": "Funga",

          "about.eyebrow": "IKAZE KURI UMURENGE WA KITABI",
          "about.title": "Abo turi bo mu",
          "about.titleSpan": "Murenge",
          "about.intro": "Menya abaturage, indangagaciro, n'ubwitange bwacu bwo kubaka ejo hazaza heza ku baturage bose.",
          "about.imageAlt": "Imisozi ibisi n'ubutaka bw'ubuhinzi",
          "about.imageLabelTitle": "Guteza Imbere hamwe",
          "about.imageLabelText": "Umuryango ukomeye kuri bose",
          "about.whoTag": "TURI BANDE",
          "about.whoTitle": "Kubaka Ejo Hazaza Heza kuri Kitabi",
          "about.whoP1": "Umurenge wa Kitabi ni umurenge w'ubuyobozi bw'ibanze mu Karere ka Nyamagabe, Intara y'Amajyepfo, u Rwanda. Uru rubuga mbara rutanga ahantu hamwe ho kwiga ku murenge, kumenya serivisi za Leta, n'amakuru y'abaturage.",
          "about.whoP2": "Dufite intego yo guteza imbere uruhare rw'abaturage, gushyigikira iterambere ry'ibanze, kunoza uburyo bwo kubona amakuru, no guteza imbere ubufatanye hagati y'abaturage n'ubuyobozi bw'ibanze.",
          "about.point1": "Iterambere ry'abaturage",
          "about.point2": "Amakuru y'abaturage yoroheje",
          "about.point3": "Ubuyobozi bw'ibanze busobanutse",
          "about.point4": "Iterambere rirambye",
          "about.ctaMission": "Menya Intego Yacu",
          "about.purposeTag": "INTEGO YACU",
          "about.purposeTitle": "Intego, Icyerekezo n'Indangagaciro",
          "about.purposeText": "Amahame ayobora akazi kacu n'abaturage bacu.",
          "about.missionTitle": "Intego Yacu",
          "about.missionText": "Gushyigikira iterambere ry'abaturage ririmo bose no korohereza abaturage kubona amakuru na serivisi za Leta.",
          "about.visionTitle": "Icyerekezo Cyacu",
          "about.visionText": "Umuryango uhujwe, ufite amakuru, kandi uteza imbere aho abaturage bagira uruhare mu iterambere rirambye n'iterambere rusange.",
          "about.valuesTitle": "Indangagaciro Zacu",
          "about.valuesText": "Ubunyangamugayo, kwishyira ukizana, gukorera hamwe, kubaha, guhanga udushya, no gukorera umuryango.",
          "about.communityTag": "UMURYANGO WACU",
          "about.communityTitle": "Kitabi mu Nshamake",
          "about.communityText": "Reba ibice by'ingenzi bigira uruhare mu iterambere ry'ibanze.",
          "about.factCommunity": "Umuryango",
          "about.factCommunityText": "Gushyigikira abaturage no gukomeza uruhare rw'abaturage.",
          "about.factAgriculture": "Ubuhinzi",
          "about.factAgricultureText": "Guteza imbere ubuhinzi burambye n'ibikorwa by'ubukungu bw'ibanze.",
          "about.factEducation": "Uburezi",
          "about.factEducationText": "Guteza imbere kwiga, ubumenyi n'amahirwe.",
          "about.factWellbeing": "Ubuzima",
          "about.factWellbeingText": "Gushyigikira ubumenyi ku buzima na serivisi z'ibanze z'umuryango.",
          "about.servicesTag": "IBYO DUKORA",
          "about.servicesTitle": "Serivisi z'Umuryango",
          "about.servicesText": "Amakuru na serivisi abaturage bashobora gukenera mu buzima bwa buri munsi.",
          "about.serviceAdmin": "Amakuru y'Ubuyobozi",
          "about.serviceAdminText": "Shakisha amakuru ku buyobozi bw'ibanze n'inzira za Leta.",
          "about.serviceCommunity": "Uruhare rw'Abaturage",
          "about.serviceCommunityText": "Guteza imbere uruhare mu bikorwa by'umuryango n'iterambere.",
          "about.serviceNews": "Amakuru n'Itangazo",
          "about.serviceNewsText": "Menya amatangazo, ibikorwa n'amakuru agezweho.",
          "about.serviceContact": "Twandikire n'Ubufasha",
          "about.serviceContactText": "Shakisha uburyo bwo kubaza no kubona ubufasha.",
          "about.ctaTag": "DUKORERE HAMWE",
          "about.ctaTitle": "Ba Umwe mu Iterambere rya Kitabi",
          "about.ctaText": "Umuryango mwiza utangira ku baturage bafite amakuru n'inshingano zisangiwe.",
          "about.ctaButton": "Urubuga rw'Akarere",

          "admin.eyebrow": "UMURENGE WA KITABI • UBUYOBOZI",
          "admin.title": "Ubuyobozi bw'",
          "admin.titleSpan": "Umurenge",
          "admin.intro": "Menya ku buyobozi bw'ibanze, inshingano z'ubuyobozi, n'imiterere y'ubuyobozi ishyigikira umuryango wacu.",
          "admin.overviewTag": "INCAMAKE Y'UBUYOBOZI",
          "admin.overviewTitle": "Gukorera Umuryango wa Kitabi",
          "admin.overviewText": "Ubuyobozi bw'ibanze bufasha guhuza serivisi za Leta, uruhare rw'abaturage, n'ibyihutirwa by'iterambere.",
          "admin.cardGovTitle": "Ubuyobozi bw'Ibanze",
          "admin.cardGovText": "Gushyigikira ubuyobozi bw'ibanze bukora neza no guhuza n'akarere.",
          "admin.cardServicesTitle": "Serivisi z'Umuryango",
          "admin.cardServicesText": "Gufasha abaturage kubona amakuru no gusobanukirwa inzira z'ubuyobozi.",
          "admin.cardDevTitle": "Gutegura Iterambere",
          "admin.cardDevText": "Guhuza ibyihutirwa by'umuryango no gushyigikira gahunda z'iterambere ry'ibanze.",
          "admin.cardParticipationTitle": "Uruhare rwa Rubanda",
          "admin.cardParticipationText": "Guteza imbere ubufatanye, ibiganiro, n'uruhare mu bikorwa by'umuryango.",
          "admin.leadershipTag": "ITSINDA RY'UBUYOBOZI",
          "admin.leadershipTitle": "Menya Ubuyobozi Bwacu",
          "admin.leadershipText": "Itsinda ry'ubuyobozi rishinzwe guhuza ibikorwa by'ibanze no gushyigikira abaturage.",
          "admin.noticeStrong": "Amakuru yemewe arakenewe:",
          "admin.noticeText": "Simbuza amakarita y'urugero hepfo n'amazina yemewe, imyanya, amafoto, n'amakuru yo kuvugana n'abayobozi ba Kitabi bariho.",
          "admin.leaderLabel": "UBUYOBOZI BW'UMURENGE",
          "admin.viewResponsibilities": "Reba Inshingano",
          "admin.structureTag": "UKO TUGENZE",
          "admin.structureTitle": "Imiterere y'Ubuyobozi",
          "admin.structureText": "Incamake y'urugero ku ko ubuyobozi bw'ibanze buhuzwa n'ubuyobozi bw'umuryango.",
          "admin.structureDistrict": "Akarere ka Nyamagabe",
          "admin.structureDistrictText": "Guhuza no kugenzura ku rwego rw'akarere",
          "admin.structureSector": "Umurenge wa Kitabi",
          "admin.structureSectorText": "Ubuyobozi bw'umurenge no guhuza serivisi",
          "admin.structureCells": "Utugari",
          "admin.structureCellsText": "Guhuza ku rwego rw'ibanze",
          "admin.structureVillages": "Imidugudu",
          "admin.structureVillagesText": "Uruhare rw'umuryango",
          "admin.structureNote": "Imiterere y'urugero gusa. Emeza imiterere yemewe y'ubuyobozi mbere yo gutangaza.",
          "admin.responsibilitiesTag": "INSHINGANO ZACU",
          "admin.responsibilitiesTitle": "Icyo Ubuyobozi Bukora",
          "admin.responsibilitiesText": "Ubuyobozi bukora kugira ngo buhuze ibyihutirwa by'umuryango na serivisi za Leta n'ibikorwa by'iterambere ry'ibanze.",
          "admin.commitmentLabel": "UBWITANGE BWACU",
          "admin.commitmentTitle": "Ubuyobozi mu Murimo",
          "admin.commitmentText": "Gukorera hamwe ku bushishozi, uruhare rw'abaturage, n'iterambere rirambye.",
          "admin.commitmentTag1": "UMURYANGO",
          "admin.commitmentTag2": "UBWIRINGIRIZE",
          "admin.commitmentTag3": "ITERAMBERE",
          "admin.contactTag": "DUHUZE",
          "admin.contactTitle": "Ukeneye Amakuru y'Ubuyobozi?",
          "admin.contactText": "Vugana n'ibiro by'umurenge cyangwa akarere bikwiye kubona amakuru yemewe ku serivisi za Leta n'inzira z'ubuyobozi.",
          "admin.contactButton": "Urubuga rw'Akarere",
          "admin.modalTag": "INSHINGANO N'INSHINGANO",
          "admin.modalNote": "Amazina yemewe n'inshingano z'umuntu ku giti cye bagomba kwemezwa n'ubuyobozi bukwiye.",
          "admin.modalClose": "Funga",

          "services.eyebrow": "SERIVISI ZA LETA • UBUFASHA BW'UMURYANGO",
          "services.title": "Serivisi ku",
          "services.titleSpan": "Bose",
          "services.intro": "Shakisha amakuru ku nzira z'ubuyobozi, ubufasha bw'umuryango, gahunda z'iterambere, na serivisi za Leta zireba abaturage b'Umurenge wa Kitabi.",
          "services.heroButton": "Reba Serivisi",
          "services.artInfo": "Amakuru ya Leta",
          "services.artInfoSub": "Byoroshye kubona",
          "services.artCommunity": "Umuryango Mbere",
          "services.artCommunitySub": "Gukorera hamwe",
          "services.quickAdmin": "Ubuyobozi",
          "services.quickAdminSub": "Inzira n'amakuru",
          "services.quickCommunity": "Umuryango",
          "services.quickCommunitySub": "Ubufasha n'uruhare",
          "services.quickInfo": "Amakuru",
          "services.quickInfoSub": "Amakuru n'amatangazo",
          "services.dirTag": "URUTONDE RWA SERIVISI",
          "services.dirTitle": "Twagufasha Dute?",
          "services.dirText": "Reba ibyiciro bya serivisi cyangwa shakisha amakuru ukeneye.",
          "services.searchPlaceholder": "Shakisha serivisi...",
          "services.catAll": "Serivisi Zose",
          "services.catAdmin": "Ubuyobozi",
          "services.catCommunity": "Umuryango",
          "services.catDevelopment": "Iterambere",
          "services.catInfo": "Amakuru",
          "services.clickToView": "Kanda urebe",
          "services.viewDetails": "Reba Ibisobanuro",
          "services.emptyTitle": "Nta serivisi zabonetse",
          "services.emptyText": "Gerageza ijambo rindi cyangwa hitamo ikindi cyiciro.",
          "services.emptyReset": "Subiza Ibihinduka",
          "services.stepsTag": "INZIRA YOROSHYE",
          "services.stepsTitle": "Uko Wabona Serivisi",
          "services.stepsText": "Koresha ubu buyobozi bworoshye kugira ngo witegure mbere yo kuvugana n'ibiro bikwiye ku bijyanye na serivisi ya Leta.",
          "services.step1Title": "Shakisha Serivisi Yawe",
          "services.step1Text": "Reba urutonde kandi umenye amakuru ukeneye.",
          "services.step2Title": "Emeza Ibisabwa",
          "services.step2Text": "Baza ibiro bishinzwe ku nyandiko, amafaranga, n'inzira.",
          "services.step3Title": "Vugana n'Ibiro",
          "services.step3Text": "Koresha uburyo bwemewe bwo kuvugana kugira ngo wemeze intambwe zikurikira.",
          "services.helpLabel": "UKENEYE UBUFASHA?",
          "services.helpTitle": "Ntuzi aho watangira?",
          "services.helpText": "Baza ibiro by'ibanze bikwiye cyangwa sura urubuga rw'Akarere ka Nyamagabe kubona amakuru yemewe.",
          "services.helpButton": "Sura Urubuga rw'Akarere",
          "services.noticeStrong": "Amakuru y'ingenzi",
          "services.noticeText": "Uru rubuga ni urubuga rw'amakuru. Ibisobanuro bya serivisi ni ingero rusange, ntabwo ari urutonde rwemewe rwa serivisi zitangwa n'Umurenge wa Kitabi. Emeza inzira zemewe, inyandiko zisabwa, amafaranga, n'igihe cyo gutunganya n'ibiro bishinzwe.",
          "services.modalNext": "Icyo ukurikiza",
          "services.modalLink": "Shakisha Amakuru Yemewe",
          "services.modalClose": "Funga",
          "services.svc1Title": "Amakuru y'Ubuyobozi",
          "services.svc1Desc": "Menya ku nzira z'ubuyobozi bw'ibanze n'aho ushobora gusaba ubuyobozi bwemewe.",
          "services.svc1Details": "Abaturage bashobora kubaza ibiro by'ubuyobozi bikwiye kugira ngo basobanukirwe inzira za Leta, ibisabwa, n'ahantu hakwiye kohereza ubusabe.",
          "services.svc1Next": "Vugana n'ibiro bishinzwe kugira ngo wemeze inzira, inyandiko zisabwa, n'amafaranga akwiye.",
          "services.svc2Title": "Ubuyobozi ku Nyandiko z'Umubano",
          "services.svc2Desc": "Menya aho ubaza ku nyandiko z'umubano n'izindi nyandiko z'ubuyobozi zifitanye isano.",
          "services.svc2Details": "Iki cyiciro cy'amakuru gifasha abaturage kumenya ibiro bya Leta bikwiye ku bibazo by'inyandiko z'umubano n'inyandiko zemewe.",
          "services.svc2Next": "Emeza ibiro bikwiye n'ibisabwa bigezweho mbere yo gutegura inyandiko.",
          "services.svc3Title": "Uruhare rw'Abaturage",
          "services.svc3Desc": "Menya uko abaturage bashobora kwitabira inama z'ibanze n'ibikorwa by'umuryango.",
          "services.svc3Details": "Uruhare rw'abaturage ruteza imbere abaturage gusangiza ibibazo, kuganira ku byihutirwa by'ibanze, no kwitabira ibikorwa by'umuryango bikwiye.",
          "services.svc3Next": "Baza abayobozi b'umuryango cyangwa ibiro by'ubuyobozi bikwiye ku bijyanye n'inama n'ibikorwa biri imbere.",
          "services.svc4Title": "Iterambere ry'Umuryango",
          "services.svc4Desc": "Reba amakuru ku byihutirwa by'iterambere ry'ibanze n'ibikorwa by'umuryango.",
          "services.svc4Details": "Iterambere ry'umuryango rihuza abaturage n'inzego zibikwiye gushyigikira ibyihutirwa by'ibanze n'iterambere rirambye.",
          "services.svc4Next": "Vugana n'ibiro by'ibanze bikwiye kugira ngo umenye ibikorwa biriho n'uburyo bwo kwitabira.",
          "services.svc5Title": "Amakuru y'Ubuhinzi",
          "services.svc5Desc": "Shakisha ubuyobozi rusange ku bufasha bw'ubuhinzi n'aho ubaza ibibazo bijyanye n'ubuhinzi.",
          "services.svc5Details": "Abaturage bashobora gushaka amakuru ku buyobozi bw'ubuhinzi buboneka, ibikorwa by'ubuhinzi, na serivisi z'ubuhinzi zikwiye.",
          "services.svc5Next": "Baza umukozi ushinzwe ubuhinzi cyangwa serivisi y'akarere ku bufasha buboneka ubu.",
          "services.svc6Title": "Amakuru y'Uburezi",
          "services.svc6Desc": "Shakisha ubuyobozi ku makuru y'uburezi bw'ibanze n'uburyo bwo kubona ubufasha.",
          "services.svc6Details": "Iki cyiciro gifasha abaturage kumenya amashuri akwiye cyangwa ibiro bya Leta ku makuru y'uburezi.",
          "services.svc6Next": "Vugana n'ishuri rikwiye cyangwa ibiro by'uburezi kugira ngo wemeze ibisabwa bigezweho n'ubufasha buboneka.",
          "services.svc7Title": "Amatangazo n'Amakuru ya Leta",
          "services.svc7Desc": "Menya amatangazo ya Leta, ibikorwa by'umuryango, n'amatangazo y'ingenzi.",
          "services.svc7Details": "Amatangazo ya Leta afasha abaturage kumenya ibikorwa by'umuryango bikwiye, amatangazo yemewe, n'amakuru y'ibanze.",
          "services.svc7Next": "Reba uburyo bwemewe bwo kuvugana n'umurenge cyangwa akarere kubona amatangazo agezweho.",
          "services.svc8Title": "Ibitekerezo n'Ibibazo bya Leta",
          "services.svc8Desc": "Menya aho wohereza ibibazo, ibitekerezo, n'ibibazo rusange bya Leta.",
          "services.svc8Details": "Abaturage bashobora gushaka ubuyobozi ku uko batanga ikibazo cyangwa ibitekerezo binyuze mu buryo bwemewe bwo kuvugana.",
          "services.svc8Next": "Mena ibiro bishinzwe kandi ukoreshe amakuru yabyo yemewe yo kohereza ikibazo cyawe.",

          "dashboard.tag": "URUBUGA MBARU RW'UMURENGE WA KITABI",
          "dashboard.welcome": "Murakaza neza ku Imbonerahamwe Yawe",
          "dashboard.welcomeText": "Incamake y'ibanze ku makuru y'umuryango, serivisi za Leta, amatangazo, n'iterambere ry'ibanze.",
          "dashboard.exploreServices": "Reba Serivisi",
          "dashboard.glance": "MU NSHAMAKE",
          "dashboard.summary": "Incamake y'Umurenge",
          "dashboard.summaryText": "Incamake ku makuru y'ingenzi y'urubuga.",
          "dashboard.demoBadge": "AMAKURU Y'URUGERO",
          "dashboard.overview": "INCAMAKE",
          "dashboard.devTitle": "Iterambere ry'Umuryango",
          "dashboard.periodLabel": "Igihe cyo gutangaza",
          "dashboard.periodQuarterly": "Buri gihembwe",
          "dashboard.periodMonthly": "Buri kwezi",
          "dashboard.periodYearly": "Buri mwaka",
          "dashboard.planned": "Ibikorwa biteganyijwe",
          "dashboard.completed": "Ibikorwa byarangiye",
          "dashboard.chartNote": "Imibare y'urugero gusa. Huza amakuru yemewe yo gutangaza kugira ngo werekane aho bigeze.",
          "dashboard.shortcuts": "INZIRA ZIHUSE",
          "dashboard.quickTitle": "Ibikorwa Byihuse",
          "dashboard.latestUpdates": "AMAKURU AGEZWEHO",
          "dashboard.announceTitle": "Amatangazo Aheruka",
          "dashboard.viewAll": "Reba Byose",
          "dashboard.readMore": "Soma itangazo",
          "dashboard.sectorInfo": "AMAKURU Y'UMURENGE",
          "dashboard.portfolioTitle": "Ibisobanuro by'Urubuga",
          "dashboard.location": "Aho iherereye",
          "dashboard.locationValue": "Akarere ka Nyamagabe, u Rwanda",
          "dashboard.websiteStatus": "Imimerere y'Urubuga",
          "dashboard.websiteValue": "Igerageza ry'Urubuga",
          "dashboard.statistics": "Imibare",
          "dashboard.statisticsValue": "Hategetswe amakuru yemewe",
          "dashboard.currentYear": "Umwaka Uriho",
          "dashboard.districtLink": "Sura Urubuga rw'Akarere ka Nyamagabe",
          "dashboard.close": "Funga",
          "dashboard.infoKicker": "AMAKURU Y'IMBONERAHAMWE",
          "dashboard.demoNote": "Iyi mbonerahamwe ikoresha amakuru y'urugero gusa. Imicungire n'itangazwa bisaba sisitemu n'ububiko bw'amakuru.",
          "dashboard.announceNote": "Iri ni itangazo ry'urugero. Risimbuze itangazo ryemewe mbere yo gutangaza.",
          "dashboard.notAvailable": "Ntibiboneka",
          "dashboard.sampleEntries": "Ingero z'amakuru",
          "dashboard.statPopulation": "Abaturage b'Umuryango",
          "dashboard.statPopulationCap": "Ongeraho imibare yemewe y'abaturage",
          "dashboard.statCells": "Utugari tw'Ubuyobozi",
          "dashboard.statCellsCap": "Emeza umubare w'utugari wemewe",
          "dashboard.statServices": "Serivisi za Leta",
          "dashboard.statServicesCap": "Urutonde rwa serivisi z'urugero",
          "dashboard.statAnnounce": "Amatangazo",
          "dashboard.statAnnounceCap": "Amatangazo y'urugero",
          "dashboard.actionExplore": "Reba Serivisi",
          "dashboard.actionExploreText": "Reba amakuru ya serivisi za Leta",
          "dashboard.actionAdmin": "Reba Ubuyobozi",
          "dashboard.actionAdminText": "Menya ubuyobozi n'imiterere",
          "dashboard.actionAbout": "Kuri Kitabi",
          "dashboard.actionAboutText": "Menya ku murenge",
          "dashboard.actionDistrict": "Urubuga rw'Akarere",
          "dashboard.actionDistrictText": "Sura urubuga rwa Leta rw'akarere",
          "dashboard.panelPopulation": "Abaturage b'Umuryango",
          "dashboard.panelPopulationText": "Umubare w'abaturage ntubarwaga. Ongeraho umubare wemewe uhereye ku isoko ryemewe mbere yo kuwerekana.",
          "dashboard.panelCells": "Utugari tw'Ubuyobozi",
          "dashboard.panelCellsText": "Andika umubare wemewe w'utugari ukoresheje inyandiko zemewe z'umurenge cyangwa akarere.",
          "dashboard.panelServices": "Serivisi za Leta",
          "dashboard.panelServicesText": "Umubare wa serivisi ugereranya ingero mu rubuga, ntabwo ari umubare wemewe wa serivisi za Leta.",
          "dashboard.panelAnnouncements": "Amatangazo",
          "dashboard.panelAnnouncementsText": "Cunga amatangazo ya Leta hano nyuma yo guhuza sisitemu y'amatangazo cyangwa backend.",
          "dashboard.ann1Title": "Amakuru ku Iterambere ry'Umuryango",
          "dashboard.ann1Category": "Umuryango",
          "dashboard.ann1Date": "Itangazo ry'urugero",
          "dashboard.ann1Desc": "Koresha iki gice gusangiza amakuru yemewe ku bikorwa by'iterambere ry'umuryango birimo.",
          "dashboard.ann2Title": "Amakuru ku Serivisi za Leta",
          "dashboard.ann2Category": "Serivisi",
          "dashboard.ann2Date": "Itangazo ry'urugero",
          "dashboard.ann2Desc": "Tangaza amakuru yemewe ku nzira za Leta n'aho abaturage bashobora kubona ubufasha.",
          "dashboard.ann3Title": "Inama z'Umuryango",
          "dashboard.ann3Category": "Ibikorwa",
          "dashboard.ann3Date": "Itangazo ry'urugero",
          "dashboard.ann3Desc": "Ongeraho ibisobanuro byemejwe ku nama z'umuryango, harimo amatariki, ahantu, n'ibisabwa mu kwitabira.",

          "media.notifTitle": "Amatangazo",
          "media.notifText1": "Urareba Ikigo cy'Amakuru.",
          "media.notifText2": "Amatangazo mashya azagaragara hano iyo ahuze.",
          "media.close": "Funga",
          "media.eyebrow": "INKURU N'IBIHE BYACU",
          "media.title": "Ikigo cy'Amakuru",
          "media.intro": "Reba amafoto, videwo, n'inkuru byerekana iterambere n'ubuzima bw'umuryango w'Umurenge wa Kitabi.",
          "media.exploreGallery": "Reba Amafoto",
          "media.featuredTag": "INKURU Y'IBANZE",
          "media.featuredTitle": "Kwizihiza Umuryango n'Iterambere ry'Ibanze",
          "media.featuredText": "Menya abantu, imishinga, na gahunda zigira uruhare mu ejo hazaza heza h'umuryango wacu.",
          "media.featuredButton": "Reba inkuru",
          "media.featuredDate": "Ibanze",
          "media.featuredDesc": "Menya abantu, imishinga, na gahunda zigira uruhare mu ejo hazaza heza h'umuryango wacu. Hindura iyi nkuru y'urugero n'amakuru yemewe yo mu Murenge wa Kitabi.",
          "media.statPhotos": "Amafoto",
          "media.statPhotosSub": "Ingero z'amafoto",
          "media.statVideos": "Videwo",
          "media.statVideosSub": "Ingero za videwo",
          "media.statStories": "Inkuru z'Umuryango",
          "media.statStoriesSub": "Ingero z'inkuru",
          "media.galleryKicker": "MENYA UMURYANGO WACU",
          "media.galleryTitle": "Reba Amakuru Yacu",
          "media.galleryText": "Ibihe bitazibagirana n'inkuru z'umuryango wacu.",
          "media.viewAll": "Reba byose",
          "media.catAll": "Byose",
          "media.catPhotos": "Amafoto",
          "media.catVideos": "Videwo",
          "media.catStories": "Inkuru",
          "media.catFeatured": "Inkuru y'Ibanze",
          "media.items": "ibintu",
          "media.typePhoto": "IFOTO",
          "media.typeVideo": "VIDEWO",
          "media.typeStory": "INKURU",
          "media.openMedia": "Reba amakuru",
          "media.emptyTitle": "Nta makuru abonetse",
          "media.emptyText": "Gerageza irindi jambo cyangwa hitamo ikindi cyiciro.",
          "media.emptyReset": "Siba ibihinduka",
          "media.bannerTitle": "Buri gihe kibara inkuru",
          "media.bannerText": "Komeza uhuze n'ibikorwa by'umuryango, gahunda z'ibanze, n'amakuru y'iterambere.",
          "media.bannerButton": "Ku bijyanye n'amakuru yacu",
          "media.locationValue": "Umurenge wa Kitabi, Akarere ka Nyamagabe, u Rwanda",
          "media.closePreview": "Funga",
          "media.infoTitle": "Ku bijyanye n'Ikigo cy'Amakuru",
          "media.infoText": "Ikigo cy'Amakuru ni ahantu ho gusangiza amafoto, videwo, n'inkuru ku buzima bw'umuryango n'iterambere ry'Umurenge wa Kitabi.",
          "media.infoNote": "Uru rupapuro rurimo ibintu by'urugero. Bisimbuze n'amafoto yemewe, videwo zemewe, n'inkuru zemewe z'umuryango.",
          "media.infoGotIt": "Nabyumvise",
          "media.item1Title": "Imisozi Yacu Ibyatsi Bishyira",
          "media.item1Date": "Amafoto y'Umuryango",
          "media.item1Desc": "Reba imisozi myiza y'ibidukikije iboneka mu Rwanda.",
          "media.item2Title": "Kubaka Umuryango Ukomeye",
          "media.item2Date": "Ibikorwa by'Umuryango",
          "media.item2Desc": "Uruhare rw'abaturage n'imbaraga zisangiwe mu iterambere ry'ibanze.",
          "media.item3Title": "Reba Ubuzima bw'Icyaro",
          "media.item3Date": "Videwo",
          "media.item3Desc": "Videwo yerekana ubuzima bwa buri munsi n'ibidukikije.",
          "media.item4Title": "Gukura Hamwe",
          "media.item4Date": "Inkuru z'Umuryango",
          "media.item4Desc": "Inkuru ku bufatanye, amahirwe, n'iterambere ry'umuryango.",
          "media.item5Title": "Ibidukikije n'Ahantu Hacu",
          "media.item5Date": "Ibidukikije",
          "media.item5Desc": "Kwizihiza imisozi n'ubwiza bw'ibidukikije mu karere kacu.",
          "media.item6Title": "Gukorera Hamwe mu Iterambere",
          "media.item6Date": "Videwo",
          "media.item6Desc": "Ingero zerekana gukorera hamwe n'iterambere ry'umuryango.",

          "research.notifTitle": "Amatangazo",
          "research.notifText1": "Urareba Ikigo cy'Ubushakashatsi.",
          "research.notifText2": "Amatangazo mashya y'ubushakashatsi azagaragara hano iyo abonetse.",
          "research.close": "Funga",
          "research.eyebrow": "UBUMENYI N'UBUSHAKASHATSI",
          "research.title": "Ikigo cy'Ubushakashatsi",
          "research.intro": "Reba ingingo z'ubushakashatsi, ubushakashatsi bw'umuryango, n'ibikoresho by'iterambere bijyanye n'Umurenge wa Kitabi.",
          "research.guidelinesBtn": "Amabwiriza y'Ubushakashatsi",
          "research.heroTag": "UBUMENYI KU ITERAMBERE",
          "research.heroTitle1": "Ubushakashatsi Uyu Munsi.",
          "research.heroTitle2": "Tegura Ejo Hazaza.",
          "research.heroText": "Menya ubushishozi n'amakuru ashobora gushyigikira ibyemezo bifite amakuru, iterambere rirambye, n'iterambere ry'umuryango.",
          "research.heroButton": "Reba ubushakashatsi",
          "research.heroCardTag": "UBUSHAKASHATSI N'UBUMENYI",
          "research.heroCardTitle1": "Ubumenyi",
          "research.heroCardTitle2": "mu Bikorwa",
          "research.statRecords": "Inyandiko z'Ubushakashatsi",
          "research.statRecordsSub": "Ingero z'inyandiko",
          "research.statPublished": "Byatangajwe",
          "research.statPublishedSub": "Ingero z'inyandiko zatangajwe",
          "research.statProgress": "Birakomeje",
          "research.statProgressSub": "Ingero z'inyandiko zikomeje",
          "research.statTopics": "Ingingo z'Ubushakashatsi",
          "research.statTopicsSub": "Mu ngeri zose z'ubushakashatsi",
          "research.topicsKicker": "REBA UKURIKIJE INTERESI",
          "research.topicsTitle": "Ibyiciro by'Ubushakashatsi",
          "research.topicsText": "Shakisha amakuru ukurikije urwego.",
          "research.topicAgriculture": "Ubuhinzi",
          "research.topicAgricultureText": "Ubuhinzi n'umutekano w'ibiribwa",
          "research.topicEnvironment": "Ibidukikije",
          "research.topicEnvironmentText": "Ibidukikije n'iterambere rirambye",
          "research.topicCommunity": "Umuryango",
          "research.topicCommunityText": "Abantu n'iterambere",
          "research.topicEducation": "Uburezi",
          "research.topicEducationText": "Kwiga n'ubumenyi",
          "research.topicHealth": "Ubuzima Rusange",
          "research.topicHealthText": "Ubuzima n'ubuzima bwiza",
          "research.topicInfrastructure": "Ibikorwa Remezo",
          "research.topicInfrastructureText": "Imiyoboro n'ibikorwa bya Leta",
          "research.libraryKicker": "ISOMBO RY'UBUSHAKASHATSI",
          "research.libraryTitle": "Ubushakashatsi n'Ibitangajwe",
          "research.libraryText": "Reba inyandiko ziboneka n'imimerere y'itangazwa ryazo.",
          "research.exportBtn": "Ohereza CSV",
          "research.searchPlaceholder": "Shakisha imitwe, ingingo, ibisobanuro...",
          "research.statusLabel": "Shungura ku mimerere",
          "research.statusAll": "Imimerere yose",
          "research.statusPublished": "Byatangajwe",
          "research.statusProgress": "Birakomeje",
          "research.statusDraft": "Inyandiko y'ibanze",
          "research.yearLabel": "Shungura ku mwaka",
          "research.yearAll": "Imyaka yose",
          "research.thTitle": "UMUTWE W'UBUSHAKASHATSI",
          "research.thCategory": "ICYICIRO",
          "research.thYear": "UMWAKA",
          "research.thStatus": "IMIMERERE",
          "research.thAction": "IGIKORWA",
          "research.viewBtn": "Reba",
          "research.emptyTitle": "Nta nyandiko z'ubushakashatsi zabonetse",
          "research.emptyText": "Gerageza uhindure ubushakashatsi cyangwa ibihinduka.",
          "research.emptyReset": "Siba ibihinduka",
          "research.ctaTitle": "Ufite icyifuzo cyo gutanga uruhare mu bushakashatsi?",
          "research.ctaText": "Vugana n'ubuyobozi bw'ibanze bukwiye kugira ngo muganire ku mahirwe y'ubushakashatsi n'ibisabwa by'amakuru.",
          "research.ctaButton": "Urubuga rwemewe",
          "research.modalKicker": "INYANDIKO Y'UBUSHAKASHATSI",
          "research.detailCategory": "Icyiciro",
          "research.detailYear": "Umwaka",
          "research.detailStatus": "Imimerere",
          "research.detailSource": "Inkomoko",
          "research.demoNotice": "Ibi ni ibintu by'urugero, ntabwo ari inyandiko y'ubushakashatsi yemewe. Bisimbuze n'inyandiko yemewe mbere yo gutangaza.",
          "research.modalClose": "Funga ibisobanuro",
          "research.guideKicker": "AMABWIRIZA Y'UBUSHAKASHATSI",
          "research.guideTitle": "Gukoresha Ikigo cy'Ubushakashatsi",
          "research.guideText": "Koresha iki gice gutunganya ubushakashatsi bw'umuryango n'ibikoresho by'iterambere.",
          "research.guide1": "Koresha inkomoko zizewe kandi wemeze ibisubizo by'ubushakashatsi.",
          "research.guide2": "Andika umwanditsi, umwaka w'itangazwa, n'inkomoko.",
          "research.guide3": "Bona uruhushya mbere yo gutangaza amakuru bwite cyangwa ay'ibanga.",
          "research.guide4": "Menya neza inyandiko z'ibanze, zikomeje, n'izatangajwe.",
          "research.guideUnderstood": "Nabyumvise",
          "research.sourceSample": "Ingero y'amakuru",
          "research.r1Title": "Ubuhinzi Burambye n'Umutekano w'Ibiribwa",
          "research.r1Desc": "Ingero y'inyandiko ku bikorwa by'ubuhinzi n'ubushakashatsi bw'umutekano w'ibiribwa.",
          "research.r2Title": "Kurengera Ibidukikije n'Imikoreshereze y'Ubutaka",
          "research.r2Desc": "Ingero y'inyandiko ku kurengera ibidukikije n'imikoreshereze y'ubutaka burambye.",
          "research.r3Title": "Uruhare rw'Abaturage mu Iterambere ry'Ibanze",
          "research.r3Desc": "Ingero y'inyandiko ku ruhare rw'abaturage mu gahunda z'iterambere.",
          "research.r4Title": "Kubona Uburezi n'Ibikoresho byo Kwiga",
          "research.r4Desc": "Ingero y'inyandiko ku kubona uburezi n'amahirwe yo kwiga.",
          "research.r5Title": "Ubumenyi ku Buzima Rusange no Kwirinda",
          "research.r5Desc": "Ingero y'inyandiko ku burezi bw'ubuzima n'uburyo bwo kwirinda.",
          "research.r6Title": "Ibikorwa Remezo by'Icyaro no Kubona Serivisi",
          "research.r6Desc": "Ingero y'inyandiko ku bikorwa remezo no kubona serivisi z'ibanze.",

          "contact.notifTitle": "Amatangazo",
          "contact.notifText1": "Urareba Ikigo cy'Itumanaho.",
          "contact.notifText2": "Ubutumwa bushya buzagaragara hano iyo ubutumwa buhujwe.",
          "contact.close": "Funga",
          "contact.eyebrow": "TURI TEGUYE GUFASHA",
          "contact.title": "Twandikire",
          "contact.intro": "Twandikire ushaka amakuru, ubufasha, cyangwa ibibazo ku serivisi n'iterambere ry'Umurenge wa Kitabi.",
          "contact.availability": "Urubuga rw'amakuru ya Leta",
          "contact.heroTag": "DUHUZE",
          "contact.heroTitle1": "Ijwi ryawe ni ingenzi.",
          "contact.heroTitle2": "Turumva.",
          "contact.heroText": "Duhaga agaciro ibibazo byawe, ibitekerezo n'ibyifuzo. Huza n'ibiro bikwiye kubona ubuyobozi n'ubufasha.",
          "contact.heroButton": "Duhereze ubutumwa",
          "contact.artTag": "UBUFASHA BW'UMURYANGO",
          "contact.artTitle1": "Turi hano",
          "contact.artTitle2": "kumva.",
          "contact.methodEmailTitle": "Ubutumwa bwa Imeyili",
          "contact.methodEmailDesc": "Shakisha amakuru yemewe yo kuvugana ku rubuga rw'akarere.",
          "contact.methodEmailAction": "Sura urubuga",
          "contact.methodWebsiteTitle": "Urubuga Rwemewe",
          "contact.methodWebsiteDesc": "Reba amakuru yemewe y'akarere, amatangazo n'ibikoresho.",
          "contact.methodWebsiteAction": "Reba urubuga",
          "contact.methodEnquiriesTitle": "Ibibazo Rusange",
          "contact.methodEnquiriesDesc": "Tegura ubutumwa ku kibazo, igitekerezo cyangwa ikibazo cya serivisi.",
          "contact.methodEnquiriesAction": "Andika ubutumwa",
          "contact.formKicker": "OHEREZA IKIGANIRO",
          "contact.formTitle": "Twagufasha dute?",
          "contact.formText": "Uzuza ifishi iri hepfo kugira ngo utegure ubutumwa bwawe.",
          "contact.formSuccessTitle": "Ubutumwa bwateguwe neza",
          "contact.formSuccessText": "Ubutumwa bwawe bwateguwe. Iki gerageza nticyobohereza kuri seriveri.",
          "contact.labelName": "Amazina yombi",
          "contact.labelEmail": "Aderesi imeyili",
          "contact.labelPhone": "Numero ya telefoni",
          "contact.labelSubject": "Impamvu",
          "contact.labelMessage": "Ubutumwa bwawe",
          "contact.placeholderName": "Andika amazina yawe yombi",
          "contact.placeholderPhone": "Numero ya telefoni (bidategetswe)",
          "contact.placeholderMessage": "Tubwire uko twagufasha...",
          "contact.subjectPlaceholder": "Hitamo impamvu",
          "contact.subjectGeneral": "Amakuru Rusange",
          "contact.subjectServices": "Serivisi za Leta",
          "contact.subjectCommunity": "Iterambere ry'Umuryango",
          "contact.subjectResearch": "Ubushakashatsi n'Amakuru",
          "contact.subjectFeedback": "Ibitekerezo cyangwa Icyifuzo",
          "contact.subjectOther": "Ikindi Kibazo",
          "contact.consent": "Ndemeza ko amakuru yatanzwe ari ukuri kandi ashobora gukoreshwa mu gusubiza ikibazo cyanjye.",
          "contact.characters": "inyuguti",
          "contact.submit": "Tegura ubutumwa",
          "contact.formNote": "Ntukoreshe amagambo banga cyangwa amakuru bwite y'ingenzi.",
          "contact.faqKicker": "IBISUBIZO BYIHUSE",
          "contact.faqTitle": "Ibibazo Bikunze Kubazwa",
          "contact.faqText": "Shakisha amakuru afasha mbere yo kohereza ikibazo.",
          "contact.faq1Q": "Nabaza nte ku serivisi za Leta z'ibanze?",
          "contact.faq1A": "Hitamo Serivisi za Leta mu ifishi yo kuvugana kandi usobanure serivisi ukeneye. Reba urubuga rwemewe rw'akarere kubona amakuru yemewe yo kuvugana.",
          "contact.faq2Q": "Natangaza nte igitekerezo ku iterambere ry'umuryango?",
          "contact.faq2A": "Hitamo Ibitekerezo cyangwa Icyifuzo kandi usobanure igitekerezo cyawe neza. Ifishi iri kuri uru rupapuro rw'urugero ntiyohereza ibisubizo ku buyobozi.",
          "contact.faq3Q": "Nabona nte amakuru yemewe yo kuvugana?",
          "contact.faq3A": "Sura urubuga rwemewe rw'Akarere ka Nyamagabe kuri nyamagabe.gov.rw urebe amakuru agezweho yo kuvugana.",
          "contact.faq4Q": "Nzabona igisubizo nyuma yo kohereza iyi fishi?",
          "contact.faq4A": "Ntibirabaho. Iki gerageza cy'uruhande rw'imbere cyemeza ibyanditswe kandi kigaragaza ikimenyetso, ariko kohereza no kwakira ubutumwa bisaba sisitemu cyangwa serivisi ya imeyili ihujwe.",

          "home.welcome": "IKAZE KURI",
          "home.heroTitle": "Umurenge wa Kitabi",
          "home.heroSubtitle": "Akarere ka Nyamagabe, Intara y'Amajyepfo, u Rwanda",
          "home.heroText": "Menya ubwiza, amahirwe n'ibikorwa by'iterambere by'Umurenge wa Kitabi. Igihugu cy'imisozi ibisi, umuco, guhanga udushya n'iterambere rirambye.",
          "home.exploreBtn": "Menya Kitabi",
          "home.dashboardBtn": "Reba Imbonerahamwe",
          "home.heroNote": "Menya abaturage, serivisi n'amahirwe bihari",
          "home.mapTitle": "Umurenge wa Kitabi",
          "home.mapSub": "Incamake y'umuryango",
          "home.mapAria": "Ikarita y'urugero y'umuryango wa Kitabi",
          "home.cell1": "Kagano",
          "home.cell2": "Uwingugu",
          "home.cell3": "Mukungu",
          "home.cell4": "Mujuga",
          "home.cell5": "Shyaba",
          "home.statPop": "Abaturage",
          "home.statPopCap": "Hakenewe amakuru yemewe",
          "home.statCells": "Utugari",
          "home.statCellsCap": "Emeza ku mugaragaro",
          "home.statVillages": "Imidugudu",
          "home.statVillagesCap": "Emeza ku mugaragaro",
          "home.statEmployees": "Abakozi",
          "home.statEmployeesCap": "Hakenewe amakuru yemewe",
          "home.statProjects": "Imishinga",
          "home.statProjectsCap": "Hakenewe amakuru yemewe",
          "home.statBudget": "Ingengo y'imari",
          "home.statBudgetCap": "Hakenewe amakuru yemewe",
          "home.statRevenue": "Amafaranga yinjiye",
          "home.statRevenueCap": "Hakenewe amakuru yemewe",
          "home.statExpenditure": "Amafaranga yasohotse",
          "home.statExpenditureCap": "Hakenewe amakuru yemewe",
          "home.aboutKicker": "UMURYANGO WACU",
          "home.aboutTitle": "Ku byerekeye Umurenge wa Kitabi",
          "home.aboutText": "Menya umuryango, ibidukikije n'amahirwe bituma Kitabi iba idasanzwe.",
          "home.aboutLocationTitle": "Aho iherereye",
          "home.aboutLocationText": "Umurenge wa Kitabi uri mu Karere ka Nyamagabe, Intara y'Amajyepfo y'u Rwanda.",
          "home.aboutEnvironmentTitle": "Ibidukikije",
          "home.aboutEnvironmentText": "Ibidukikije bimbere mu misozi bishyigikira urusobe rw'ibinyabuzima, ubuhinzi n'ubukerarugendo bushingiye ku bidukikije.",
          "home.aboutCommunityTitle": "Umuryango",
          "home.aboutCommunityText": "Uruhare rw'abaturage na serivisi za Leta zoroheje bishyigikira iterambere ry'ibanze.",
          "home.adminKicker": "UBUYOBOZI BW'IBANZE",
          "home.adminTitle": "Ubuyobozi",
          "home.adminText": "Ubuyobozi bw'ibanze bushyigikira iterambere ry'umuryango no gutanga serivisi za Leta.",
          "home.adminOfficeTitle": "Ibiro by'Umurenge wa Kitabi",
          "home.adminOfficeText": "Vugana n'ubuyobozi bw'ibanze bukwiye kubona amakuru yemewe y'ubuyobozi, ibisabwa bya serivisi n'abo wahamagara ubu.",
          "home.adminItem1Title": "Serivisi z'umuryango",
          "home.adminItem1Text": "Amakuru n'ubuyobozi ku baturage.",
          "home.adminItem2Title": "Iterambere ry'ibanze",
          "home.adminItem2Text": "Gahunda z'umuryango no guhuza imishinga.",
          "home.adminItem3Title": "Amakuru ya Leta",
          "home.adminItem3Text": "Amatangazo, amakuru n'amatangazo.",
          "home.ctaKicker": "TURI HANO GUFASHA",
          "home.ctaTitle": "Huza n'Umurenge wa Kitabi",
          "home.ctaText": "Ku byifuzo byemewe n'amakuru yemewe, vugana n'ibiro by'umurenge cyangwa akarere bikwiye.",
          "home.ctaButton": "Sura Urubuga rw'Akarere"
        },

        /* ============================================================
           FRENCH — fill in with translations (falls back to EN if empty)
           ============================================================ */
        fr: {},

        /* ============================================================
           SWAHILI — fill in with translations (falls back to EN if empty)
           ============================================================ */
        sw: {}
      },

      searchIndex: [
        { title: "Home", description: "Welcome to Kitabi Sector", path: "/", icon: Home, color: "green", keywords: "home welcome mwanzo accueil ahabanza" },
        { title: "About", description: "Mission, vision, community", path: "/about", icon: Info, color: "blue", keywords: "about mission vision community kuhusu à propos" },
        { title: "Administration", description: "Leadership and structure", path: "/administration", icon: Building2, color: "gold", keywords: "administration leaders government utawala ubuyobozi" },
        { title: "Services", description: "Public services and procedures", path: "/services", icon: Briefcase, color: "green", keywords: "services certificates documents huduma serivisi" },
        { title: "Dashboard", description: "Statistics and development", path: "/dashboards", icon: LayoutDashboard, color: "purple", keywords: "dashboard statistics data imibare dashibodi" },
        { title: "Media Center", description: "Photos, videos, and stories", path: "/news", icon: Newspaper, color: "gold", keywords: "news media photos videos amakuru habari médiathèque" },
        { title: "Research", description: "Research records and publications", path: "/research", icon: FlaskConical, color: "blue", keywords: "research studies publications ubushakashatsi utafiti" },
        { title: "Contact", description: "Send a message or find contacts", path: "/contact", icon: Mail, color: "green", keywords: "contact email message twandikire mawasiliano" },
        { title: "Agriculture", description: "Farming and food security", path: "/services", icon: FileText, color: "green", keywords: "agriculture farming ubuhinzi kilimo" },
        { title: "Education", description: "Learning and skills", path: "/services", icon: FileText, color: "blue", keywords: "education schools uburezi elimu" },
        { title: "Health", description: "Public health services", path: "/services", icon: FileText, color: "gold", keywords: "health wellness ubuzima afya" }
      ]
    };
  },

  computed: {
    currentYear() { return new Date().getFullYear(); },
    suggestions() { return this.searchIndex.slice(0, 4); },
    results() {
      const q = this.query.trim().toLowerCase();
      if (!q) return [];
      return this.searchIndex.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.keywords.toLowerCase().includes(q)
      ).slice(0, 8);
    }
  },

  provide() {
    return {
      t: (key) => this.t(key),
      language: () => this.language,
      theme: () => this.theme
    };
  },

  watch: {
    language(value) {
      document.documentElement.lang = value;
      localStorage.setItem("ks-language", value);
    },
    theme(value) {
      document.documentElement.setAttribute("data-theme", value);
      localStorage.setItem("ks-theme", value);
    },
    // ✅ FIX 4: lock body scroll while splash is visible
    showSplash(value) {
      document.body.style.overflow = value ? "hidden" : "";
    }
  },

  mounted() {
    const savedTheme = localStorage.getItem("ks-theme");
    this.theme = savedTheme
      || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", this.theme);

    const savedLang = localStorage.getItem("ks-language");
    if (savedLang) this.language = savedLang;
    document.documentElement.lang = this.language;

    // ✅ FIX 5: lock scroll immediately on mount (splash is visible by default)
    document.body.style.overflow = "hidden";

    const shownThisSession = sessionStorage.getItem("ks-welcome-shown");
    if (!shownThisSession) {
      // Only show the welcome toast AFTER the splash is done
      setTimeout(() => { this.showWelcome = true; }, 4200);
      sessionStorage.setItem("ks-welcome-shown", "1");
      setTimeout(() => { this.showWelcome = false; }, 11000);
    }

    document.addEventListener("click", this.handleClickOutside);
  },

  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
    document.body.style.overflow = "";
  },

  methods: {
    t(key) {
      return this.translations[this.language]?.[key]
        ?? this.translations.en[key]
        ?? key;
    },
    toggleTheme() {
      this.theme = this.theme === "dark" ? "light" : "dark";
    },
    clearSearch() { this.query = ""; },
    goToFirstResult() {
      if (this.results.length) {
        this.$router.push(this.results[0].path);
        this.closeSearch();
      }
    },
    closeSearch() {
      this.searchFocused = false;
      this.query = "";
    },
    handleClickOutside(event) {
      if (this.$refs.searchWrapper && !this.$refs.searchWrapper.contains(event.target)) {
        this.searchFocused = false;
      }
    },
    dismissWelcome() { this.showWelcome = false; }
  }
};
</script>

<!-- ============================================================
     GLOBAL THEME — applies to ALL pages
     ============================================================ -->
<style>
:root,
[data-theme="dark"] {
  --bg: #03140b;
  --panel: #071b10;
  --soft: #102b1a;
  --text: #f4fff6;
  --muted: #a9c5b0;
  --line: rgba(113, 206, 128, 0.19);
  --green: #7cdd79;
  --green-strong: #36d58c;
  --green-deep: #087c4c;
  --overlay-bg: rgba(3, 20, 11, 0.88);
}

[data-theme="light"] {
  --bg: #f5f8f5;
  --panel: #ffffff;
  --soft: #eef4f0;
  --text: #192b23;
  --muted: #68776f;
  --line: rgba(17, 107, 69, 0.18);
  --green: #116b45;
  --green-strong: #16885a;
  --green-deep: #075034;
  --overlay-bg: rgba(255, 255, 255, 0.9);
}

*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 90px; }
html, body, #app { width: 100%; min-height: 100%; margin: 0; padding: 0; }

body {
  overflow-x: hidden;
  background: var(--bg);
  color: var(--text);
  font-family: Inter, "Segoe UI", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background 0.25s ease, color 0.25s ease;
}

a { color: inherit; }
::selection { background: var(--green); color: var(--bg); }

::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--soft); border-radius: 10px; border: 2px solid var(--bg); }
::-webkit-scrollbar-thumb:hover { background: var(--green); }
</style>

<!-- ============================================================
     COMPONENT STYLES
     ============================================================ -->
<style scoped>
.portfolio {
  width: 100%;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  transition: background 0.25s ease, color 0.25s ease;
}

/* HEADER */
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  border-bottom: 1px solid var(--line);
  background: var(--overlay-bg);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  transition: background 0.25s ease, border-color 0.25s ease;
}

.navbar {
  width: 100%;
  min-height: 66px;
  padding: 10px 4.3%;
  display: flex;
  align-items: center;
  gap: 25px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 11px;
  flex-shrink: 0;
  text-decoration: none;
}

.mark {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border: 1px solid rgba(120, 224, 128, 0.55);
  border-radius: 50%;
  background: linear-gradient(145deg, var(--green-strong), var(--green-deep));
  color: #ffffff;
  font-weight: 900;
  font-size: 17px;
  box-shadow: 0 0 18px rgba(46, 201, 105, 0.17);
  flex-shrink: 0;
}

.brand-name {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 16px;
  font-weight: 800;
  white-space: nowrap;
  color: var(--text);
}

.brand-name small {
  color: var(--muted);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 1px;
}

.links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.links a {
  padding: 10px 8px;
  border-bottom: 2px solid transparent;
  color: var(--text);
  font-size: 11px;
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.2s, border-color 0.2s;
}

.links a:hover,
.links a.router-link-active {
  color: var(--green);
  border-bottom-color: var(--green);
}

.nav-tools {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* SEARCH */
.search-wrapper { position: relative; }

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 220px;
  padding: 8px 12px;
  border: 1px solid var(--line);
  border-radius: 30px;
  background: var(--soft);
  color: var(--green);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-box:focus-within {
  border-color: var(--green);
  box-shadow: 0 0 0 3px rgba(124, 221, 121, 0.15);
}

.search-box input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text);
  font-size: 11px;
}

.search-box input::placeholder { color: var(--muted); }

.clear-btn {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border: 0;
  border-radius: 50%;
  background: var(--line);
  color: var(--text);
  cursor: pointer;
  flex-shrink: 0;
}

.search-results {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 380px;
  max-width: calc(100vw - 40px);
  padding: 8px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--panel);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.35);
  z-index: 200;
  max-height: 420px;
  overflow-y: auto;
}

.results-header {
  padding: 8px 10px 6px;
  color: var(--muted);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.results-list { display: flex; flex-direction: column; }

.result-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  color: var(--text);
  text-decoration: none;
  transition: background 0.15s;
}

.result-item:hover { background: var(--soft); }

.result-icon {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  flex-shrink: 0;
}

.result-icon.green { color: var(--green); background: var(--soft); }
.result-icon.blue { color: #70b4f0; background: rgba(52, 116, 185, 0.15); }
.result-icon.gold { color: #f0b35d; background: rgba(185, 121, 38, 0.15); }
.result-icon.purple { color: #b195e0; background: rgba(124, 85, 174, 0.15); }

[data-theme="light"] .result-icon.blue { color: #326cb0; background: #e7effa; }
[data-theme="light"] .result-icon.gold { color: #987126; background: #fbf1d9; }
[data-theme="light"] .result-icon.purple { color: #7c55ae; background: #f0e9fa; }

.result-copy {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.result-copy strong { font-size: 12px; color: var(--text); }
.result-copy small {
  font-size: 10px;
  color: var(--muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.result-arrow { color: var(--muted); flex-shrink: 0; }

.no-results { padding: 24px 16px; text-align: center; color: var(--muted); }
.no-results svg { color: var(--muted); margin-bottom: 8px; }
.no-results p { margin: 0 0 4px; font-size: 12px; color: var(--text); }
.no-results small { font-size: 10px; color: var(--muted); }

/* TOOLS */
.lang-select {
  padding: 7px 10px;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: var(--soft);
  color: var(--text);
  font-size: 11px;
  cursor: pointer;
}

.theme-btn {
  display: grid;
  place-items: center;
  width: 35px;
  height: 35px;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: var(--soft);
  color: var(--text);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s, color 0.2s;
}

.theme-btn:hover {
  background: var(--green);
  color: #ffffff;
  transform: rotate(15deg);
}

/* FOOTER */
.site-footer {
  margin-top: 40px;
  padding: 40px 4.3% 0;
  border-top: 1px solid var(--line);
  background: var(--panel);
  color: var(--muted);
  transition: background 0.25s ease;
}

.footer-main {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
  gap: 32px;
  padding-bottom: 30px;
}

.footer-brand-col { display: flex; flex-direction: column; gap: 12px; }

.footer-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--green);
  font-weight: 900;
  font-size: 14px;
  text-decoration: none;
}

.footer-brand .mark { width: 36px; height: 36px; font-size: 14px; }
.footer-tagline { margin: 0; color: var(--muted); font-size: 12px; line-height: 1.6; }

.footer-note {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin: 0;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.5;
}

.footer-links-col { display: flex; flex-direction: column; gap: 10px; }

.footer-links-col h4 {
  margin: 0 0 4px;
  color: var(--text);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.footer-links-col a,
.footer-links-col p {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.5;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links-col a:hover { color: var(--green); }
.footer-links-col svg { flex-shrink: 0; color: var(--green); }

.footer-bottom {
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  gap: 15px;
  padding: 18px 0;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 11px;
}

.footer-bottom p { margin: 0; }

.back-to-top {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--green);
  text-decoration: none;
  transition: gap 0.2s;
}

.back-to-top:hover { gap: 10px; }

/* WELCOME TOAST */
.welcome-toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 500;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  max-width: 380px;
  padding: 16px 16px 16px 14px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--panel);
  color: var(--text);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
}

.welcome-icon {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 10px;
  background: var(--soft);
  font-size: 20px;
}

.welcome-copy { flex: 1; min-width: 0; }
.welcome-copy strong { display: block; margin-bottom: 4px; font-size: 13px; color: var(--text); }
.welcome-copy p { margin: 0; color: var(--muted); font-size: 11px; line-height: 1.5; }

.welcome-toast button {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  border: 0;
  border-radius: 50%;
  background: var(--soft);
  color: var(--text);
  cursor: pointer;
}

/* TRANSITIONS */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; transform: translateY(-4px); }

.slide-up-enter-active,
.slide-up-leave-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.slide-up-enter-from,
.slide-up-leave-to { opacity: 0; transform: translateY(20px); }

/* ✅ FIX 6: splash transition — fade out the overlay when showSplash becomes false */
.splash-leave-active { transition: opacity 0.5s ease; }
.splash-leave-to { opacity: 0; }

/* RESPONSIVE */
@media (max-width: 1250px) {
  .navbar { gap: 12px; }
  .links { gap: 0; }
  .links a { padding: 10px 5px; font-size: 10px; }
  .search-box { width: 160px; }
}

@media (max-width: 950px) {
  .search-box { width: 42px; padding: 10px; justify-content: center; }
  .search-box input,
  .search-box .clear-btn { display: none; }
  .search-box:focus-within {
    position: absolute;
    right: 12px;
    top: 70px;
    width: calc(100% - 24px);
    z-index: 250;
  }
  .search-box:focus-within input,
  .search-box:focus-within .clear-btn { display: block; }
}

@media (max-width: 850px) {
  .navbar { flex-wrap: wrap; padding: 10px 18px; }
  .links {
    order: 3;
    flex-basis: 100%;
    justify-content: flex-start;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
  }
  .links a { padding: 9px 10px; font-size: 11px; }
  .nav-tools { margin-left: auto; }
  .footer-main { grid-template-columns: 1fr 1fr; gap: 24px; }
  .footer-brand-col { grid-column: 1 / -1; }
  .search-results {
    position: fixed;
    top: 130px;
    left: 12px;
    right: 12px;
    width: auto;
  }
  .welcome-toast { left: 16px; right: 16px; bottom: 16px; max-width: none; }
}

@media (max-width: 600px) {
  .brand-name { font-size: 13px; }
  .site-footer { padding: 30px 18px 0; }
  .footer-main { grid-template-columns: 1fr; gap: 20px; }
  .footer-bottom { flex-wrap: wrap; padding: 16px 0; }
}

@media (max-width: 360px) {
  .nav-tools { gap: 4px; }
  .theme-btn { width: 30px; height: 30px; }
}
</style>