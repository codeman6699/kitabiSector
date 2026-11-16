<template>
  <div class="user-dashboard" role="main" aria-label="School Dashboard">

    <!-- Header -->
    <header class="dashboard-header">
      <div>
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <span>Dashboard</span>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Home</span>
        </nav>
        <h1>{{ greeting }}, Welcome Back!</h1>
        <p>Here is what's happening at College de Bethel today.</p>
      </div>

      <div class="header-actions">
        <div class="date-card" role="status" aria-live="polite">
          <CalendarDays :size="19" aria-hidden="true" />
          <div>
            <strong>{{ currentDate }}</strong>
            <span>School Dashboard</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Welcome Banner -->
    <section class="welcome-banner" aria-labelledby="welcome-heading">
      <div class="welcome-content">
        <span class="welcome-tag">
          <Sparkles :size="14" aria-hidden="true" />
          COLLEGE DE BETHEL / APARUDE
        </span>

        <h2 id="welcome-heading">Learning Today.<br />Leading Tomorrow.</h2>

        <p>
          Discover school activities, stay updated with announcements,
          and remain connected with our school community.
        </p>

        <router-link to="/about" class="welcome-btn">
          Discover Our School
          <ArrowRight :size="16" aria-hidden="true" />
        </router-link>
      </div>

      <div class="banner-art" aria-hidden="true">
        <div class="art-ring ring-one"></div>
        <div class="art-ring ring-two"></div>
        <div class="art-center">
          <GraduationCap :size="72" :stroke-width="1.3" />
        </div>
        <span class="art-caption">TEACHING FOR ETERNITY</span>
      </div>
    </section>

    <!-- Statistics -->
    <section class="stats-grid" aria-label="School statistics">
      <article
        v-for="stat in stats"
        :key="stat.id"
        class="stat-card"
        :aria-label="`${stat.title}: ${stat.value}`"
      >
        <div class="stat-top">
          <div class="stat-icon" :class="stat.color">
            <component :is="stat.icon" :size="22" aria-hidden="true" />
          </div>
          <span class="stat-indicator">{{ stat.indicator }}</span>
        </div>
        <span class="stat-title">{{ stat.title }}</span>
        <h3>{{ stat.value }}</h3>
        <p>{{ stat.caption }}</p>
      </article>
    </section>

    <!-- Main Dashboard -->
    <section class="main-grid">

      <!-- Announcements -->
      <div class="dashboard-card">
        <div class="card-heading">
          <div>
            <span class="eyebrow">SCHOOL INFORMATION</span>
            <h2>Latest Announcements</h2>
          </div>
          <button
            type="button"
            class="view-all"
            @click="goToMedia"
            aria-label="View all announcements"
          >
            View all <ArrowRight :size="14" aria-hidden="true" />
          </button>
        </div>

        <div v-if="loading" class="skeleton-list" aria-busy="true">
          <div v-for="n in 3" :key="n" class="skeleton-row"></div>
        </div>

        <div v-else-if="announcements.length" class="announcement-list">
          <article
            v-for="item in announcements"
            :key="item.id"
            class="announcement"
            role="button"
            tabindex="0"
            :aria-label="`${item.title}. ${item.description}`"
            @click="handleAnnouncementClick(item)"
            @keydown.enter="handleAnnouncementClick(item)"
            @keydown.space.prevent="handleAnnouncementClick(item)"
          >
            <div class="announcement-icon" :class="item.color">
              <component :is="item.icon" :size="20" aria-hidden="true" />
            </div>
            <div class="announcement-info">
              <div class="announcement-meta">
                <span class="status" :class="item.statusClass">{{ item.status }}</span>
                <span>{{ item.category }}</span>
              </div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
            <ArrowRight class="item-arrow" :size="17" aria-hidden="true" />
          </article>
        </div>

        <p v-else class="empty-state">No announcements right now. Check back soon.</p>
      </div>

      <!-- Events -->
      <div class="dashboard-card">
        <div class="card-heading">
          <div>
            <span class="eyebrow">SCHOOL CALENDAR</span>
            <h2>Upcoming Events</h2>
          </div>
          <button
            type="button"
            class="view-all"
            @click="goToMedia"
            aria-label="View all events"
          >
            View all <ArrowRight :size="14" aria-hidden="true" />
          </button>
        </div>

        <div v-if="loading" class="skeleton-list" aria-busy="true">
          <div v-for="n in 3" :key="n" class="skeleton-row"></div>
        </div>

        <div v-else-if="events.length" class="event-list">
          <article
            v-for="event in events"
            :key="event.id"
            class="event"
            role="button"
            tabindex="0"
            :aria-label="`${event.title} on ${event.day} ${event.month}, at ${event.location}`"
            @click="handleEventClick(event)"
            @keydown.enter="handleEventClick(event)"
            @keydown.space.prevent="handleEventClick(event)"
          >
            <div class="event-date">
              <strong>{{ event.day }}</strong>
              <span>{{ event.month }}</span>
            </div>
            <div class="event-info">
              <h3>{{ event.title }}</h3>
              <p><MapPin :size="13" aria-hidden="true" /> {{ event.location }}</p>
              <span class="event-label">{{ event.label }}</span>
            </div>
          </article>
        </div>

        <p v-else class="empty-state">No upcoming events scheduled.</p>
      </div>

    </section>

    <!-- Bottom Dashboard -->
    <section class="bottom-grid">

      <!-- Quick Links -->
      <div class="dashboard-card quick-card">
        <div class="card-heading">
          <div>
            <span class="eyebrow">NAVIGATION</span>
            <h2>Explore Your School</h2>
          </div>
        </div>

        <div class="quick-grid">
          <router-link
            v-for="link in quickLinks"
            :key="link.to"
            :to="link.to"
            class="quick-link"
            :aria-label="`${link.title}. ${link.subtitle}`"
          >
            <div class="quick-icon" :class="link.color">
              <component :is="link.icon" :size="20" aria-hidden="true" />
            </div>
            <div>
              <strong>{{ link.title }}</strong>
              <span>{{ link.subtitle }}</span>
            </div>
            <ArrowUpRight :size="17" aria-hidden="true" />
          </router-link>
        </div>
      </div>

      <!-- Inspiration -->
      <div class="inspiration-card">
        <div class="inspiration-heading">
          <Sparkles :size="17" aria-hidden="true" />
          DAILY INSPIRATION
        </div>

        <Quote class="quote-icon" :size="35" aria-hidden="true" />

        <h2>
          Let the word of Christ dwell in you richly.
        </h2>

        <span class="verse-reference">COLOSSIANS 3:16</span>

        <div class="inspiration-line" aria-hidden="true"></div>

        <span class="inspiration-footer">TEACHING FOR ETERNITY</span>
      </div>

    </section>

    <!-- Footer -->
    <footer class="dashboard-footer">
      <span>© {{ currentYear }} College de Bethel / Aparude</span>
      <span>Teaching for Eternity</span>
    </footer>

  </div>
</template>

<script>
import {
  GraduationCap,
  Users,
  BookOpen,
  School,
  CalendarDays,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Megaphone,
  Leaf,
  Church,
  MapPin,
  Building2,
  CircleHelp,
  Images,
  Settings,
  Quote
} from "lucide-vue-next";

export default {
  name: "UserHomeDashboard",

  components: {
    GraduationCap,
    Users,
    BookOpen,
    School,
    CalendarDays,
    ArrowRight,
    ArrowUpRight,
    Sparkles,
    Megaphone,
    Leaf,
    Church,
    MapPin,
    Building2,
    CircleHelp,
    Images,
    Settings,
    Quote
  },

  props: {
    /** Optional: pass a username from parent */
    userName: {
      type: String,
      default: ""
    },
    /** Optional: pass real API data from parent */
    statsData: {
      type: Array,
      default: null
    },
    announcementsData: {
      type: Array,
      default: null
    },
    eventsData: {
      type: Array,
      default: null
    }
  },

  data() {
    const now = new Date();
    return {
      loading: false,
      now,

      // Icons are cached as strings to avoid re-resolving
      stats: this.statsData ?? [
        {
          id: "students",
          title: "Total Students",
          value: "2,500+",
          caption: "Our learning community",
          indicator: "School",
          color: "purple",
          icon: "GraduationCap"
        },
        {
          id: "teachers",
          title: "Our Teachers",
          value: "150+",
          caption: "Dedicated educators",
          indicator: "Staff",
          color: "blue",
          icon: "Users"
        },
        {
          id: "pass-rate",
          title: "Pass Rate",
          value: "98%",
          caption: "Reported academic result",
          indicator: "Academic",
          color: "green",
          icon: "BookOpen"
        },
        {
          id: "institution",
          title: "Our Institution",
          value: "Bethel",
          caption: "United in faith and learning",
          indicator: "Community",
          color: "orange",
          icon: "School"
        }
      ],

      announcements: this.announcementsData ?? [
        {
          id: "welcome",
          status: "Important",
          statusClass: "important",
          category: "School Notice",
          title: "Welcome to Our School Community",
          description: "Stay connected with important school information and updates.",
          color: "purple",
          icon: "Megaphone",
          href: "/media"
        },
        {
          id: "cleanup",
          status: "Activity",
          statusClass: "activity",
          category: "Community",
          title: "Community Clean-Up Campaign",
          description: "Join our community in promoting environmental responsibility.",
          color: "green",
          icon: "Leaf",
          href: "/media"
        },
        {
          id: "prayer",
          status: "Spiritual",
          statusClass: "spiritual",
          category: "Faith & Worship",
          title: "Week of Prayer",
          description: "Come together in prayer, worship, and spiritual growth.",
          color: "orange",
          icon: "Church",
          href: "/media"
        }
      ],

      events: this.eventsData ?? [
        {
          id: "graduation",
          day: "25",
          month: "MAY",
          title: "Graduation Ceremony",
          location: "Main School Campus",
          label: "Academic Event",
          href: "/media"
        },
        {
          id: "spiritual-week",
          day: "28",
          month: "MAY",
          title: "Spiritual Week",
          location: "School Chapel",
          label: "Spiritual Event",
          href: "/media"
        },
        {
          id: "sports",
          day: "05",
          month: "JUN",
          title: "Sports Activities",
          location: "School Playground",
          label: "Sports Event",
          href: "/media"
        }
      ],

      quickLinks: [
        {
          to: "/about",
          title: "About School",
          subtitle: "Discover our institution",
          color: "purple",
          icon: "Building2"
        },
        {
          to: "/question",
          title: "Questions",
          subtitle: "Help and support",
          color: "blue",
          icon: "CircleHelp"
        },
        {
          to: "/media",
          title: "Media Center",
          subtitle: "Photos and school news",
          color: "orange",
          icon: "Images"
        },
        {
          to: "/settings",
          title: "Settings",
          subtitle: "Manage preferences",
          color: "green",
          icon: "Settings"
        }
      ]
    };
  },

  computed: {
    currentDate() {
      return this.now.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    },

    currentYear() {
      return this.now.getFullYear();
    },

    greeting() {
      const h = this.now.getHours();
      if (h < 12) return "Good morning";
      if (h < 18) return "Good afternoon";
      return "Good evening";
    }
  },

  methods: {
    goToMedia() {
      this.$router?.push?.("/media") ?? (window.location.href = "/media");
    },

    handleAnnouncementClick(item) {
      if (!item?.href) return;
      this.$router?.push?.(item.href) ?? (window.location.href = item.href);
      this.$emit("announcement-click", item);
    },

    handleEventClick(event) {
      if (!event?.href) return;
      this.$router?.push?.(event.href) ?? (window.location.href = event.href);
      this.$emit("event-click", event);
    }
  }
};
</script>

<style scoped>
.user-dashboard {
  width: 100%;
  min-width: 0;
  padding: 24px;
  box-sizing: border-box;
  color: #282338;
  font-family: "Inter", "Segoe UI", sans-serif;
}

/* Accessibility baseline */
:focus-visible {
  outline: 2px solid #7135c9;
  outline-offset: 2px;
  border-radius: 6px;
}

/* Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 22px;
}

.breadcrumb {
  display: flex;
  gap: 6px;
  color: #9b94a8;
  font-size: 11px;
  margin-bottom: 7px;
}

.dashboard-header h1 {
  font-size: 25px;
  font-weight: 750;
  margin: 0 0 6px;
  letter-spacing: -0.7px;
}

.dashboard-header p {
  color: #9690a1;
  font-size: 12px;
  margin: 0;
}

.date-card {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 12px 15px;
  background: #fff;
  border: 1px solid #eeeaf4;
  border-radius: 11px;
  color: #7135c9;
}

.date-card strong,
.date-card span {
  display: block;
}

.date-card strong {
  color: #302a40;
  font-size: 11px;
}

.date-card span {
  color: #a39bac;
  font-size: 10px;
  margin-top: 4px;
}

/* Welcome Banner */
.welcome-banner {
  min-height: 205px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 27px 34px;
  overflow: hidden;
  box-sizing: border-box;
  border-radius: 15px;
  color: #fff;
  background: linear-gradient(110deg, #32115f, #6330a5 65%, #8050bd);
  margin-bottom: 19px;
}

.welcome-content {
  position: relative;
  z-index: 2;
  max-width: 570px;
}

.welcome-tag {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #e0cefa;
  font-size: 9px;
  font-weight: 750;
  letter-spacing: 1.7px;
}

.welcome-content h2 {
  font-size: 28px;
  line-height: 1.2;
  margin: 13px 0 9px;
  letter-spacing: -0.7px;
}

.welcome-content p {
  color: #e3d8f2;
  font-size: 11px;
  line-height: 1.7;
  max-width: 440px;
  margin: 0 0 16px;
}

.welcome-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 15px;
  color: #57268e;
  background: #fff;
  border-radius: 7px;
  font-size: 11px;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s;
}

.welcome-btn:hover {
  background: #f1eaff;
  transform: translateY(-2px);
}

.banner-art {
  position: relative;
  width: 210px;
  height: 170px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.art-ring {
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.ring-one {
  width: 155px;
  height: 155px;
}

.ring-two {
  width: 115px;
  height: 115px;
  background: rgba(255, 255, 255, 0.07);
}

.art-center {
  color: #fff;
  z-index: 1;
}

.art-caption {
  position: absolute;
  bottom: 0;
  color: #e4d5f8;
  font-size: 8px;
  letter-spacing: 1.8px;
}

/* Statistics */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 19px;
}

.stat-card {
  background: #fff;
  border: 1px solid #eeeaf4;
  border-radius: 12px;
  padding: 16px;
  min-width: 0;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.stat-card:hover,
.dashboard-card:hover {
  border-color: #d9c7f0;
  box-shadow: 0 7px 20px rgba(61, 33, 100, 0.06);
}

.stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 13px;
}

.stat-icon,
.announcement-icon,
.quick-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  flex-shrink: 0;
}

.stat-icon {
  width: 40px;
  height: 40px;
}

.purple {
  color: #7135c9;
  background: #f0e8ff;
}

.blue {
  color: #397bd2;
  background: #e8f1ff;
}

.green {
  color: #25965c;
  background: #e7f7ed;
}

.orange {
  color: #d68b35;
  background: #fff1df;
}

.stat-indicator {
  color: #aaa3b3;
  font-size: 9px;
  background: #f8f7fa;
  border-radius: 5px;
  padding: 5px 7px;
}

.stat-title {
  color: #8f899d;
  font-size: 10px;
}

.stat-card h3 {
  font-size: 23px;
  margin: 5px 0;
  font-weight: 750;
  letter-spacing: -0.5px;
}

.stat-card p {
  color: #aaa4b2;
  font-size: 9px;
  margin: 0;
}

/* Cards */
.main-grid,
.bottom-grid {
  display: grid;
  grid-template-columns: 1.25fr 0.85fr;
  gap: 17px;
  margin-bottom: 17px;
}

.dashboard-card {
  min-width: 0;
  background: #fff;
  border: 1px solid #eeeaf4;
  border-radius: 13px;
  padding: 19px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.card-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 15px;
}

.eyebrow {
  color: #9871c5;
  font-size: 9px;
  font-weight: 750;
  letter-spacing: 1.2px;
}

.card-heading h2 {
  font-size: 15px;
  margin: 5px 0 0;
  font-weight: 750;
}

.view-all {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #7135c9;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
  font-family: inherit;
  transition: background 0.2s;
}

.view-all:hover {
  background: #f5f0fa;
}

.announcement,
.event {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 13px 0;
  border-bottom: 1px solid #f0edf4;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s;
}

.announcement:hover,
.event:hover {
  background: #faf7ff;
}

.announcement:last-child,
.event:last-child {
  border-bottom: none;
  padding-bottom: 2px;
}

.announcement-icon {
  width: 40px;
  height: 40px;
}

.announcement-info {
  flex: 1;
  min-width: 0;
}

.announcement-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #a29baa;
  font-size: 9px;
  margin-bottom: 5px;
}

.status {
  padding: 4px 7px;
  border-radius: 4px;
  font-size: 8px;
  font-weight: 750;
}

.important {
  color: #d75e58;
  background: #fff0ef;
}

.activity {
  color: #397bd2;
  background: #eaf3ff;
}

.spiritual {
  color: #8050bd;
  background: #f1eaff;
}

.announcement-info h3,
.event-info h3 {
  font-size: 11px;
  font-weight: 700;
  margin: 0 0 5px;
}

.announcement-info p {
  color: #9d97a7;
  font-size: 9px;
  line-height: 1.5;
  margin: 0;
}

.item-arrow {
  color: #aaa2b2;
  flex-shrink: 0;
}

/* Events */
.event-date {
  width: 47px;
  height: 49px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  background: #f1eaff;
  color: #7135c9;
  border-radius: 8px;
}

.event-date strong {
  font-size: 18px;
}

.event-date span {
  font-size: 8px;
  font-weight: 800;
}

.event-info {
  min-width: 0;
}

.event-info p {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #9e97a8;
  font-size: 9px;
  margin: 0 0 6px;
}

.event-label {
  display: inline-block;
  color: #8063a5;
  background: #f5f0fa;
  padding: 4px 7px;
  border-radius: 4px;
  font-size: 8px;
}

/* Quick Links */
.quick-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
}

.quick-link {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 11px;
  border: 1px solid #f0edf4;
  border-radius: 9px;
  color: #302a40;
  text-decoration: none;
  min-width: 0;
  transition: background 0.2s, border-color 0.2s;
}

.quick-link:hover {
  background: #faf7ff;
  border-color: #d9c6f1;
}

.quick-icon {
  width: 35px;
  height: 35px;
}

.quick-link > div:nth-child(2) {
  flex: 1;
  min-width: 0;
}

.quick-link strong,
.quick-link span {
  display: block;
}

.quick-link strong {
  font-size: 10px;
}

.quick-link span {
  color: #a09aaa;
  font-size: 9px;
  margin-top: 4px;
}

.quick-link > svg:last-child {
  color: #a69bad;
  flex-shrink: 0;
}

/* Inspiration */
.inspiration-card {
  padding: 21px 24px;
  border-radius: 13px;
  color: #fff;
  background: linear-gradient(140deg, #301452, #6032a0);
  overflow: hidden;
}

.inspiration-heading {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ddc8fa;
  font-size: 9px;
  font-weight: 750;
  letter-spacing: 1.3px;
}

.quote-icon {
  color: #c5a2ef;
  margin: 14px 0 5px;
}

.inspiration-card h2 {
  max-width: 300px;
  font-family: Georgia, serif;
  font-size: 19px;
  font-weight: 500;
  line-height: 1.5;
  margin: 0 0 12px;
}

.verse-reference {
  color: #d6c0f2;
  font-size: 9px;
  font-weight: 750;
  letter-spacing: 1.5px;
}

.inspiration-line {
  width: 38px;
  height: 2px;
  background: #c5a2ef;
  margin: 17px 0 10px;
}

.inspiration-footer {
  color: #d5c0ee;
  font-size: 8px;
  letter-spacing: 1.5px;
}

/* Footer */
.dashboard-footer {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 17px 2px 4px;
  color: #a39cab;
  font-size: 9px;
}

/* Loading skeleton */
.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-row {
  height: 56px;
  border-radius: 8px;
  background: linear-gradient(90deg, #f3effa 25%, #ece4f7 37%, #f3effa 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}

@keyframes shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
}

.empty-state {
  color: #9d97a7;
  font-size: 11px;
  text-align: center;
  padding: 20px 0;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}

/* Responsive */
@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .main-grid,
  .bottom-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 650px) {
  .user-dashboard {
    padding: 14px;
  }

  .dashboard-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .dashboard-header h1 {
    font-size: 21px;
  }

  .date-card {
    width: 100%;
    box-sizing: border-box;
  }

  .welcome-banner {
    padding: 23px 19px;
  }

  .welcome-content h2 {
    font-size: 23px;
  }

  .banner-art {
    display: none;
  }

  .stats-grid {
    gap: 9px;
  }

  .stat-card {
    padding: 12px;
  }

  .stat-card h3 {
    font-size: 19px;
  }

  .dashboard-card {
    padding: 14px;
  }

  .quick-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-footer {
    flex-direction: column;
  }
}

@media (max-width: 370px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>