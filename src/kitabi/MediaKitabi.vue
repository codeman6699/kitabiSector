<template>
  <div class="media-page">
    <main>
      <div v-if="showNotifications" class="notification-panel">
        <strong>{{ t("media.notifTitle") }}</strong>
        <p>{{ t("media.notifText1") }}</p>
        <p>{{ t("media.notifText2") }}</p>
        <button @click="showNotifications = false">{{ t("media.close") }}</button>
      </div>

      <section class="page-body">
        <div class="page-heading">
          <div>
            <div class="eyebrow"><Images :size="15" /> {{ t("media.eyebrow") }}</div>
            <h1>{{ t("media.title") }}</h1>
            <p>{{ t("media.intro") }}</p>
          </div>
          <button class="outline-button" @click="activeCategory = 'all'">
            <Grid2X2 :size="17" />
            {{ t("media.exploreGallery") }}
          </button>
        </div>

        <section class="featured">
          <img
            src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1600&q=85"
            :alt="t('media.featuredTitle')"
          />
          <div class="featured-shade"></div>
          <div class="featured-content">
            <span class="featured-tag"><Radio :size="14" /> {{ t("media.featuredTag") }}</span>
            <h2>{{ t("media.featuredTitle") }}</h2>
            <p>{{ t("media.featuredText") }}</p>
            <button @click="openFeatured">
              {{ t("media.featuredButton") }} <ArrowRight :size="17" />
            </button>
          </div>
          <div class="featured-pagination">
            <span class="pagination-active"></span>
            <span></span>
            <span></span>
          </div>
        </section>

        <div class="stats-row">
          <div class="stat-item">
            <div class="stat-icon green"><Images :size="21" /></div>
            <div>
              <span>{{ t("media.statPhotos") }}</span>
              <h3>{{ photoCount }}</h3>
              <small>{{ t("media.statPhotosSub") }}</small>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon blue"><Video :size="21" /></div>
            <div>
              <span>{{ t("media.statVideos") }}</span>
              <h3>{{ videoCount }}</h3>
              <small>{{ t("media.statVideosSub") }}</small>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon orange"><Newspaper :size="21" /></div>
            <div>
              <span>{{ t("media.statStories") }}</span>
              <h3>{{ storyCount }}</h3>
              <small>{{ t("media.statStoriesSub") }}</small>
            </div>
          </div>
        </div>

        <section class="gallery-section">
          <div class="section-heading">
            <div>
              <span class="section-kicker">{{ t("media.galleryKicker") }}</span>
              <h2>{{ t("media.galleryTitle") }}</h2>
              <p>{{ t("media.galleryText") }}</p>
            </div>
            <button class="view-all" @click="activeCategory = 'all'">
              {{ t("media.viewAll") }} <ArrowRight :size="16" />
            </button>
          </div>

          <div class="filter-row">
            <div class="category-filters">
              <button
                v-for="category in categories"
                :key="category.key"
                :class="{ selected: activeCategory === category.key }"
                @click="activeCategory = category.key"
              >
                {{ t(category.label) }}
              </button>
            </div>
            <div class="result-count">{{ filteredMedia.length }} {{ t("media.items") }}</div>
          </div>

          <div v-if="filteredMedia.length" class="media-grid">
            <article
              v-for="item in filteredMedia"
              :key="item.id"
              class="media-card"
              @click="openMedia(item)"
            >
              <div class="media-image">
                <img :src="item.image" :alt="t(item.titleKey)" loading="lazy" />
                <span class="media-type">
                  <Video v-if="item.category === 'Videos'" :size="14" />
                  <BookOpen v-else-if="item.category === 'Stories'" :size="14" />
                  <Images v-else :size="14" />
                  {{ t(item.typeLabelKey) }}
                </span>
                <div v-if="item.category === 'Videos'" class="play-button">
                  <Play :size="22" fill="currentColor" />
                </div>
                <button class="card-open" :aria-label="t('media.openMedia')">
                  <ArrowUpRight :size="18" />
                </button>
              </div>
              <div class="media-card-body">
                <div class="media-date">
                  <CalendarDays :size="14" />
                  {{ t(item.dateKey) }}
                </div>
                <h3>{{ t(item.titleKey) }}</h3>
                <p>{{ t(item.descKey) }}</p>
              </div>
            </article>
          </div>

          <div v-else class="empty-state">
            <Search :size="34" />
            <h3>{{ t("media.emptyTitle") }}</h3>
            <p>{{ t("media.emptyText") }}</p>
            <button @click="resetFilters">{{ t("media.emptyReset") }}</button>
          </div>
        </section>

        <section class="bottom-banner">
          <div class="banner-icon"><Camera :size="27" /></div>
          <div>
            <h3>{{ t("media.bannerTitle") }}</h3>
            <p>{{ t("media.bannerText") }}</p>
          </div>
          <button @click="showMediaInfo = true">
            {{ t("media.bannerButton") }} <ArrowRight :size="16" />
          </button>
        </section>
      </section>
    </main>

    <div v-if="selectedMedia" class="modal-backdrop" @click.self="selectedMedia = null">
      <div class="media-modal">
        <button class="modal-close" @click="selectedMedia = null" :aria-label="t('media.close')">
          <X :size="21" />
        </button>
        <img :src="selectedMedia.image" :alt="t(selectedMedia.titleKey)" />
        <div class="modal-content">
          <span class="section-kicker">{{ t(selectedMedia.categoryLabelKey) }} · {{ t(selectedMedia.dateKey) }}</span>
          <h2>{{ t(selectedMedia.titleKey) }}</h2>
          <p>{{ t(selectedMedia.descKey) }}</p>
          <div class="modal-location">
            <MapPin :size="16" /> {{ t("media.locationValue") }}
          </div>
          <button class="primary-button" @click="selectedMedia = null">{{ t("media.closePreview") }}</button>
        </div>
      </div>
    </div>

    <div v-if="showMediaInfo" class="modal-backdrop" @click.self="showMediaInfo = false">
      <div class="info-modal">
        <button class="modal-close" @click="showMediaInfo = false" :aria-label="t('media.close')">
          <X :size="21" />
        </button>
        <div class="info-modal-icon"><Camera :size="27" /></div>
        <h2>{{ t("media.infoTitle") }}</h2>
        <p>{{ t("media.infoText") }}</p>
        <p class="demo-note">{{ t("media.infoNote") }}</p>
        <button class="primary-button" @click="showMediaInfo = false">{{ t("media.infoGotIt") }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  X, Grid2X2, Radio, ArrowRight, Video, Newspaper,
  CalendarDays, MapPin, Play, BookOpen, Camera, Search
} from "lucide-vue-next";

export default {
  name: "MediaCenterView",
  components: {
    X, Grid2X2, Radio, ArrowRight, Video, Newspaper,
    CalendarDays, MapPin, Play, BookOpen, Camera, Search
  },
  inject: {
    t: { default: (k) => k },
    language: { default: () => "en" },
    theme: { default: () => "dark" }
  },

  data() {
    return {
      searchQuery: "",
      activeCategory: "all",
      selectedMedia: null,
      showMediaInfo: false,
      showNotifications: false,

      categories: [
        { key: "all", label: "media.catAll" },
        { key: "Photos", label: "media.catPhotos" },
        { key: "Videos", label: "media.catVideos" },
        { key: "Stories", label: "media.catStories" }
      ],

      mediaItems: [
        {
          id: 1,
          category: "Photos",
          categoryLabelKey: "media.catPhotos",
          typeLabelKey: "media.typePhoto",
          titleKey: "media.item1Title",
          dateKey: "media.item1Date",
          descKey: "media.item1Desc",
          image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=900&q=80"
        },
        {
          id: 2,
          category: "Photos",
          categoryLabelKey: "media.catPhotos",
          typeLabelKey: "media.typePhoto",
          titleKey: "media.item2Title",
          dateKey: "media.item2Date",
          descKey: "media.item2Desc",
          image: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=900&q=80"
        },
        {
          id: 3,
          category: "Videos",
          categoryLabelKey: "media.catVideos",
          typeLabelKey: "media.typeVideo",
          titleKey: "media.item3Title",
          dateKey: "media.item3Date",
          descKey: "media.item3Desc",
          image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80"
        },
        {
          id: 4,
          category: "Stories",
          categoryLabelKey: "media.catStories",
          typeLabelKey: "media.typeStory",
          titleKey: "media.item4Title",
          dateKey: "media.item4Date",
          descKey: "media.item4Desc",
          image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80"
        },
        {
          id: 5,
          category: "Photos",
          categoryLabelKey: "media.catPhotos",
          typeLabelKey: "media.typePhoto",
          titleKey: "media.item5Title",
          dateKey: "media.item5Date",
          descKey: "media.item5Desc",
          image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80"
        },
        {
          id: 6,
          category: "Videos",
          categoryLabelKey: "media.catVideos",
          typeLabelKey: "media.typeVideo",
          titleKey: "media.item6Title",
          dateKey: "media.item6Date",
          descKey: "media.item6Desc",
          image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80"
        }
      ]
    };
  },

  computed: {
    filteredMedia() {
      const q = this.searchQuery.trim().toLowerCase();
      return this.mediaItems.filter((item) => {
        const matchesCategory =
          this.activeCategory === "all" || item.category === this.activeCategory;
        const matchesSearch =
          !q ||
          this.t(item.titleKey).toLowerCase().includes(q) ||
          this.t(item.descKey).toLowerCase().includes(q);
        return matchesCategory && matchesSearch;
      });
    },
    photoCount() {
      return this.mediaItems.filter((item) => item.category === "Photos").length;
    },
    videoCount() {
      return this.mediaItems.filter((item) => item.category === "Videos").length;
    },
    storyCount() {
      return this.mediaItems.filter((item) => item.category === "Stories").length;
    }
  },

  methods: {
    openMedia(item) {
      this.selectedMedia = item;
    },
    openFeatured() {
      this.selectedMedia = {
        id: 0,
        categoryLabelKey: "media.catFeatured",
        titleKey: "media.featuredTitle",
        dateKey: "media.featuredDate",
        descKey: "media.featuredDesc",
        image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=85"
      };
    },
    resetFilters() {
      this.searchQuery = "";
      this.activeCategory = "all";
    }
  }
};
</script>

<style scoped>
.media-page {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: Inter, "Segoe UI", Arial, sans-serif;
  transition: background 0.25s ease, color 0.25s ease;
}

.media-page * { box-sizing: border-box; }

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
  justify-content: space-between;
  align-items: center;
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
  letter-spacing: -1.3px;
}

.page-heading p {
  max-width: 580px;
  margin: 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.8;
}

.outline-button {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 12px 15px;
  white-space: nowrap;
  color: var(--green);
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 9px;
  font-size: 11px;
  font-weight: 700;
  transition: background 0.2s, border-color 0.2s;
}

.outline-button:hover {
  background: var(--soft);
  border-color: rgba(113, 206, 128, 0.4);
}

.featured {
  height: 330px;
  position: relative;
  overflow: hidden;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 17px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.featured > img {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  object-fit: cover;
  object-position: center 47%;
}

.featured-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(3, 20, 11, 0.95) 0%, rgba(3, 20, 11, 0.75) 42%, rgba(3, 20, 11, 0.1) 100%),
    linear-gradient(0deg, rgba(3, 20, 11, 0.4), transparent 55%);
}

.featured-content {
  max-width: 550px;
  position: absolute;
  top: 50%;
  left: 39px;
  transform: translateY(-50%);
  color: var(--bg);
}

.featured-tag {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 10px;
  color: var(--green);
  background: rgba(3, 20, 11, 0.6);
  border: 1px solid var(--line);
  border-radius: 6px;
  font-size: 9px;
  font-weight: 750;
  letter-spacing: 1px;
}

.featured-content h2 {
  margin: 17px 0 11px;
  font-size: clamp(24px, 3vw, 34px);
  font-weight: 800;
  letter-spacing: -0.8px;
  line-height: 1.2;
  color: var(--text);
}

.featured-content p {
  max-width: 420px;
  margin: 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.8;
}

.featured-content > button {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  padding: 12px 15px;
  color: var(--bg);
  background: var(--green);
  border: 0;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
  transition: background 0.2s, transform 0.2s;
}

.featured-content > button:hover {
  background: var(--green-strong, #36d58c);
  transform: translateY(-2px);
}

.featured-pagination {
  position: absolute;
  right: 24px;
  bottom: 23px;
  display: flex;
  gap: 6px;
}

.featured-pagination span {
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 10px;
}

.featured-pagination .pagination-active {
  width: 22px;
  background: var(--green);
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin: 22px 0 39px;
}

.stat-item {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 12px;
}

.stat-icon {
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 12px;
}

.stat-icon.green { color: var(--green); background: var(--soft); }
.stat-icon.blue { color: #70b4f0; background: rgba(52, 116, 185, 0.15); }
.stat-icon.orange { color: #f0b35d; background: rgba(185, 121, 38, 0.15); }

[data-theme="light"] .stat-icon.blue { color: #326cb0; background: #e7effa; }
[data-theme="light"] .stat-icon.orange { color: #987126; background: #fbf1d9; }

.stat-item span { display: block; color: var(--muted); font-size: 10px; }
.stat-item h3 { margin: 5px 0 4px; color: var(--text); font-size: 24px; line-height: 1; }
.stat-item small { color: var(--muted); font-size: 9px; }

.gallery-section { margin-bottom: 31px; }

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 22px;
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

.view-all {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 0 9px 10px;
  color: var(--green);
  background: transparent;
  border: 0;
  font-size: 11px;
  font-weight: 750;
}

.filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-filters button {
  padding: 9px 16px;
  color: var(--muted);
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 8px;
  font-size: 10px;
  font-weight: 650;
  transition: 0.2s;
}

.category-filters button:hover { border-color: rgba(113, 206, 128, 0.4); }

.category-filters button.selected {
  color: var(--bg);
  background: var(--green);
  border-color: var(--green);
}

.result-count {
  color: var(--muted);
  font-size: 10px;
  white-space: nowrap;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.media-card {
  min-width: 0;
  overflow: hidden;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 13px;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  cursor: pointer;
}

.media-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.3);
  border-color: rgba(113, 206, 128, 0.4);
}

.media-image {
  height: 175px;
  position: relative;
  overflow: hidden;
  background: var(--soft);
}

.media-image > img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 0.35s;
}

.media-card:hover .media-image > img { transform: scale(1.045); }

.media-type {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 9px;
  color: var(--bg);
  background: rgba(3, 20, 11, 0.85);
  border: 1px solid var(--line);
  border-radius: 6px;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.6px;
}

.play-button {
  width: 47px;
  height: 47px;
  position: absolute;
  top: 50%;
  left: 50%;
  display: grid;
  place-items: center;
  padding-left: 3px;
  color: var(--bg);
  background: rgba(124, 221, 121, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.card-open {
  width: 32px;
  height: 32px;
  position: absolute;
  right: 12px;
  bottom: 12px;
  display: grid;
  place-items: center;
  color: var(--text);
  background: rgba(3, 20, 11, 0.7);
  border: 1px solid var(--line);
  border-radius: 8px;
}

.media-card-body { padding: 16px 16px 13px; }

.media-date {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--muted);
  font-size: 9px;
}

.media-card-body h3 {
  margin: 11px 0 7px;
  overflow-wrap: anywhere;
  color: var(--text);
  font-size: 13px;
  font-weight: 750;
  line-height: 1.45;
}

.media-card-body > p {
  min-height: 35px;
  margin: 0;
  color: var(--muted);
  font-size: 10px;
  line-height: 1.7;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 55px 20px;
  color: var(--muted);
  background: var(--panel);
  border: 1px dashed var(--line);
  border-radius: 13px;
  text-align: center;
}

.empty-state h3 { margin: 15px 0 6px; color: var(--text); }
.empty-state p { font-size: 12px; }

.empty-state button {
  margin-top: 10px;
  padding: 10px 15px;
  color: var(--bg);
  background: var(--green);
  border: 0;
  border-radius: 8px;
  font-weight: 700;
}

.bottom-banner {
  display: flex;
  align-items: center;
  gap: 17px;
  padding: 22px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 13px;
}

.banner-icon {
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

.bottom-banner > div:nth-child(2) { flex: 1; }
.bottom-banner h3 { margin: 0 0 6px; color: var(--text); font-size: 13px; }
.bottom-banner p { margin: 0; color: var(--muted); font-size: 10px; line-height: 1.7; }

.bottom-banner > button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 13px;
  white-space: nowrap;
  color: var(--bg);
  background: var(--green);
  border: 0;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  transition: background 0.2s;
}

.bottom-banner > button:hover,
.primary-button:hover {
  background: var(--green-strong, #36d58c);
}

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

.media-modal,
.info-modal {
  width: min(100%, 650px);
  position: relative;
  overflow: hidden;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: 0 20px 80px rgba(0, 0, 0, 0.5);
}

.media-modal > img {
  width: 100%;
  max-height: 340px;
  display: block;
  object-fit: cover;
}

.modal-close {
  width: 36px;
  height: 36px;
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  display: grid;
  place-items: center;
  color: var(--text);
  background: var(--soft);
  border: 1px solid var(--line);
  border-radius: 50%;
  transition: background 0.2s;
}

.modal-close:hover { background: var(--bg); }

.modal-content { padding: 25px; }
.modal-content h2,
.info-modal h2 { margin: 9px 0; color: var(--text); font-size: 24px; }
.modal-content > p,
.info-modal > p { color: var(--muted); font-size: 12px; line-height: 1.8; }

.modal-location {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 17px 0;
  color: var(--green);
  font-size: 11px;
}

.primary-button {
  padding: 11px 16px;
  color: var(--bg);
  background: var(--green);
  border: 0;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 750;
  transition: background 0.2s;
}

.info-modal {
  max-width: 440px;
  padding: 30px;
}

.info-modal-icon {
  width: 51px;
  height: 51px;
  display: grid;
  place-items: center;
  color: var(--green);
  background: var(--soft);
  border-radius: 13px;
}

.info-modal h2 { margin-top: 18px; font-size: 21px; }

.demo-note {
  padding: 12px;
  background: var(--soft);
  border-left: 3px solid var(--green);
  border-radius: 4px;
}

@media (min-width: 1600px) {
  .page-body { padding-right: 48px; padding-left: 48px; }
  .media-image { height: 205px; }
}

@media (max-width: 1200px) {
  .page-body { padding: 29px 24px 20px; }
  .media-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .media-image { height: 190px; }
}

@media (max-width: 760px) {
  .page-body { padding: 25px 16px 20px; }
  .page-heading { align-items: flex-start; margin-bottom: 20px; }
  .page-heading h1 { font-size: 28px; }
  .page-heading p { font-size: 11px; }
  .outline-button { padding: 10px; font-size: 0; }
  .outline-button svg { width: 18px; height: 18px; }
  .featured { height: 315px; }
  .featured-content { right: 20px; left: 22px; }
  .featured-content h2 { font-size: 27px; }
  .featured-content p { font-size: 11px; }
  .stats-row { grid-template-columns: 1fr; gap: 10px; margin: 16px 0 31px; }
  .stat-item { padding: 15px; }
  .stat-icon { width: 42px; height: 42px; }
  .media-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .media-image { height: 140px; }
  .media-card-body { padding: 12px; }
  .media-card-body h3 { font-size: 12px; }
  .media-card-body > p { font-size: 10px; }
  .section-heading h2 { font-size: 20px; }
  .bottom-banner { align-items: flex-start; flex-wrap: wrap; padding: 17px; }
  .bottom-banner > div:nth-child(2) { min-width: 0; }
  .bottom-banner > button { width: 100%; }
}

@media (max-width: 420px) {
  .page-body { padding-right: 12px; padding-left: 12px; }
  .page-heading h1 { font-size: 25px; }
  .featured { height: 300px; }
  .featured-content h2 { font-size: 24px; }
  .media-grid { grid-template-columns: 1fr; }
  .media-image { height: 190px; }
  .filter-row { align-items: flex-start; flex-direction: column; }
  .category-filters { gap: 6px; }
  .category-filters button { padding: 8px 12px; }
  .section-heading p { max-width: 230px; line-height: 1.6; }
  .modal-backdrop { padding: 12px; }
  .info-modal { padding: 23px; }
}
</style>