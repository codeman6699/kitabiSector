<template>
  <main class="media-page" role="main" aria-labelledby="media-title">

    <!-- ============ HEADER ============ -->
    <header class="page-header">
      <div>
        <span class="eyebrow">LIBRARY</span>
        <h1 id="media-title">Media Center</h1>
        <p>Watch sermons, listen to worship, and explore our church moments.</p>
      </div>
      <div class="header-actions">
        <button
          v-if="recentlyViewed.length"
          type="button"
          class="recent-btn"
          @click="showRecent = !showRecent"
          :aria-expanded="showRecent"
        >
          <History :size="15" aria-hidden="true" />
          Recent ({{ recentlyViewed.length }})
        </button>
        <div class="header-icon" aria-hidden="true">
          <Library :size="24" />
        </div>
      </div>
    </header>

    <!-- ============ RECENTLY VIEWED ============ -->
    <transition name="slide-down">
      <section
        v-if="showRecent && recentlyViewed.length"
        class="recent-strip"
        aria-label="Recently viewed media"
      >
        <div
          v-for="item in recentlyViewed"
          :key="'recent-' + item.id"
          class="recent-chip"
          @click="openMedia(item)"
        >
          <div class="recent-icon" :class="item.theme">
            <component :is="typeIcon(item.type)" :size="14" />
          </div>
          <span>{{ item.title }}</span>
        </div>
        <button
          type="button"
          class="clear-recent"
          @click="recentlyViewed = []; showRecent = false"
          aria-label="Clear recently viewed"
        >
          <Trash2 :size="13" aria-hidden="true" />
        </button>
      </section>
    </transition>

    <!-- ============ FEATURED ============ -->
    <section class="featured" aria-labelledby="featured-heading">
      <div class="featured-copy">
        <span class="featured-label">
          <Star :size="12" aria-hidden="true" />
          FEATURED SERMON
        </span>
        <h2 id="featured-heading">{{ featured.title }}</h2>
        <p>{{ featured.longDescription }}</p>

        <div class="featured-meta">
          <span><User :size="12" aria-hidden="true" /> {{ featured.author }}</span>
          <span class="dot" aria-hidden="true">•</span>
          <span>{{ featured.category }}</span>
          <span class="dot" aria-hidden="true">•</span>
          <span>{{ featured.duration }}</span>
        </div>

        <button type="button" class="btn-featured" @click="openMedia(featured)">
          <Play :size="15" fill="currentColor" aria-hidden="true" />
          Watch Sermon
        </button>
      </div>

      <div class="featured-visual">
        <div class="visual-rings" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
        <button
          type="button"
          class="hero-play"
          aria-label="Play featured sermon"
          @click="openMedia(featured)"
        >
          <Play :size="24" fill="currentColor" aria-hidden="true" />
        </button>
        <span class="hero-duration">{{ featured.duration }}</span>
      </div>
    </section>

    <!-- ============ STATS ============ -->
    <section class="stats-strip" aria-label="Media at a glance">
      <div v-for="stat in mediaStats" :key="stat.label" class="stat">
        <div class="stat-icon" :class="stat.color">
          <component :is="stat.icon" :size="18" aria-hidden="true" />
        </div>
        <div>
          <strong>{{ stat.value }}</strong>
          <span>{{ stat.label }}</span>
        </div>
      </div>
    </section>

    <!-- ============ LIBRARY ============ -->
    <section class="library" aria-labelledby="library-heading">

      <div class="library-head">
        <div>
          <h2 id="library-heading">Explore Our Media</h2>
          <p>
            {{ filteredMedia.length }} item{{ filteredMedia.length === 1 ? '' : 's' }} in this view
            <span v-if="searchQuery.trim()"> · matching "{{ searchQuery }}"</span>
          </p>
        </div>

        <div class="view-toggle" role="group" aria-label="View density">
          <button
            type="button"
            :class="{ active: viewMode === 'grid' }"
            aria-label="Grid view"
            @click="viewMode = 'grid'"
          >
            <LayoutGrid :size="15" aria-hidden="true" />
          </button>
          <button
            type="button"
            :class="{ active: viewMode === 'list' }"
            aria-label="List view"
            @click="viewMode = 'list'"
          >
            <List :size="15" aria-hidden="true" />
          </button>
        </div>
      </div>

      <!-- Controls -->
      <div class="controls">
        <div class="search-box">
          <Search :size="16" class="search-icon" aria-hidden="true" />
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search sermons, worship, events…"
            aria-label="Search media"
          >
          <button
            v-if="searchQuery"
            type="button"
            class="clear-search"
            aria-label="Clear search"
            @click="searchQuery = ''"
          >
            <X :size="14" aria-hidden="true" />
          </button>
        </div>

        <div class="controls-right">
          <label for="sort" class="visually-hidden">Sort by</label>
          <select id="sort" v-model="sortBy" class="sort-select">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="title">Title A–Z</option>
            <option value="type">Type</option>
          </select>

          <div
            class="tabs"
            role="tablist"
            aria-label="Filter by media type"
            @keydown.left.prevent="moveTab(-1)"
            @keydown.right.prevent="moveTab(1)"
          >
            <button
              v-for="(tab, i) in tabs"
              :key="tab.key"
              type="button"
              role="tab"
              :ref="el => { if (el) tabRefs[i] = el }"
              :aria-selected="activeTab === tab.key"
              :tabindex="activeTab === tab.key ? 0 : -1"
              :class="['tab', { active: activeTab === tab.key }]"
              @click="activeTab = tab.key"
            >
              <component :is="tab.icon" :size="14" aria-hidden="true" />
              {{ tab.label }}
              <span class="tab-count">{{ tabCount(tab.key) }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="media-grid" aria-busy="true">
        <div v-for="n in 6" :key="'sk-' + n" class="skeleton-card">
          <div class="skeleton-thumb"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
      </div>

      <!-- Grid -->
      <div
        v-else-if="visibleMedia.length"
        :class="viewMode === 'grid' ? 'media-grid' : 'media-list'"
      >
        <article
          v-for="item in visibleMedia"
          :key="item.id"
          class="media-card"
          :class="[item.theme, { 'list-mode': viewMode === 'list' }]"
          role="button"
          tabindex="0"
          :aria-label="`Open ${item.title}`"
          @click="openMedia(item)"
          @keydown.enter="openMedia(item)"
          @keydown.space.prevent="openMedia(item)"
        >
          <div class="thumb">
            <div class="thumb-graphic" aria-hidden="true">
              <component :is="typeIcon(item.type)" :size="64" />
            </div>

            <span class="type-badge">
              <component :is="typeIcon(item.type)" :size="11" aria-hidden="true" />
              {{ item.type }}
            </span>

            <div class="card-play" aria-hidden="true">
              <Play v-if="item.type !== 'Photo'" :size="16" fill="currentColor" />
              <Eye v-else :size="16" />
            </div>

            <span v-if="item.duration" class="duration">{{ item.duration }}</span>
          </div>

          <div class="card-body">
            <span class="category-tag">{{ item.category }}</span>
            <h3>{{ item.title }}</h3>
            <p class="desc">{{ item.description }}</p>

            <div class="card-foot">
              <div class="author-avatar">{{ item.initials }}</div>
              <div class="author-meta">
                <strong>{{ item.author }}</strong>
                <small>{{ item.date }}</small>
              </div>
              <button
                type="button"
                class="more-btn"
                :aria-label="`Open ${item.title}`"
                @click.stop="openMedia(item)"
              >
                <MoreHorizontal :size="16" aria-hidden="true" />
              </button>
            </div>
          </div>
        </article>
      </div>

      <!-- Empty -->
      <div v-else class="empty-state">
        <SearchX :size="40" aria-hidden="true" />
        <h3>No media found</h3>
        <p>Try another search term or select a different category.</p>
        <button type="button" @click="resetFilters">Clear filters</button>
      </div>

      <!-- Load More -->
      <div v-if="hasMore && !loading" class="load-more">
        <button type="button" @click="pageSize += 6">
          Load more
          <ChevronDown :size="15" aria-hidden="true" />
        </button>
        <span class="load-more-hint">
          Showing {{ visibleMedia.length }} of {{ filteredMedia.length }}
        </span>
      </div>

    </section>

    <!-- ============ PLAYER MODAL ============ -->
    <transition name="fade">
      <div
        v-if="selectedMedia"
        class="modal-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="player-title"
        @click.self="closeMedia"
      >
        <div
          ref="playerModal"
          class="modal"
          tabindex="-1"
          @keydown.esc="closeMedia"
          @keydown.tab="trapFocus"
        >
          <header class="modal-head">
            <div>
              <span class="eyebrow">NOW PLAYING</span>
              <h3 id="player-title">{{ selectedMedia.title }}</h3>
            </div>
            <button
              type="button"
              class="close-btn"
              aria-label="Close player"
              @click="closeMedia"
            >
              <X :size="18" aria-hidden="true" />
            </button>
          </header>

          <!-- Type-aware screen -->
          <div class="player-screen" :class="selectedMedia.theme">

            <!-- Real video support -->
            <template v-if="selectedMedia.type === 'Video' && selectedMedia.mediaUrl">
              <video
                :src="selectedMedia.mediaUrl"
                controls
                autoplay
                class="native-player"
              ></video>
            </template>

            <!-- Real audio support -->
            <template v-else-if="selectedMedia.type === 'Audio' && selectedMedia.mediaUrl">
              <div class="audio-player-wrap">
                <div class="screen-graphic" aria-hidden="true">
                  <Mic :size="38" />
                </div>
                <div class="screen-title">{{ selectedMedia.title }}</div>
                <audio
                  :src="selectedMedia.mediaUrl"
                  controls
                  autoplay
                  class="native-audio"
                ></audio>
              </div>
            </template>

            <!-- Photo with real image -->
            <template v-else-if="selectedMedia.type === 'Photo' && selectedMedia.mediaUrl">
              <img
                :src="selectedMedia.mediaUrl"
                :alt="selectedMedia.title"
                class="native-photo"
              >
            </template>

            <!-- Mock video (no URL) -->
            <template v-else-if="selectedMedia.type === 'Video'">
              <div class="screen-graphic" aria-hidden="true">
                <Play :size="38" fill="currentColor" />
              </div>
              <div class="screen-title">{{ selectedMedia.title }}</div>
              <div class="progress">
                <div class="progress-fill"></div>
              </div>
              <div class="time-row">
                <span>00:00</span>
                <span>{{ selectedMedia.duration }}</span>
              </div>
            </template>

            <!-- Mock audio (no URL) -->
            <template v-else-if="selectedMedia.type === 'Audio'">
              <div class="screen-graphic" aria-hidden="true">
                <Mic :size="38" />
              </div>
              <div class="screen-title">{{ selectedMedia.title }}</div>
              <div class="audio-controls" aria-hidden="true">
                <span class="ctrl">⏮</span>
                <span class="ctrl primary">▶</span>
                <span class="ctrl">⏭</span>
              </div>
              <div class="progress">
                <div class="progress-fill"></div>
              </div>
              <div class="time-row">
                <span>00:00</span>
                <span>{{ selectedMedia.duration }}</span>
              </div>
            </template>

            <!-- Mock photo (no URL) -->
            <template v-else>
              <div class="screen-graphic" aria-hidden="true">
                <ImageIcon :size="38" />
              </div>
              <div class="screen-title">{{ selectedMedia.title }}</div>
              <p class="photo-note">Photo gallery preview</p>
            </template>
          </div>

          <!-- Meta -->
          <div class="modal-body">
            <div class="modal-meta">
              <span class="category-tag">{{ selectedMedia.category }}</span>
              <span class="meta-dot">•</span>
              <span>{{ selectedMedia.author }}</span>
              <span class="meta-dot">•</span>
              <span>{{ selectedMedia.date }}</span>
            </div>
            <p class="modal-desc">{{ selectedMedia.description }}</p>

            <div class="modal-actions">
              <button type="button" class="btn-ghost" @click="closeMedia">
                Close
              </button>
              <button type="button" class="btn-primary" @click="shareMedia">
                <Share2 :size="14" aria-hidden="true" />
                {{ sharedLabel }}
              </button>
            </div>
          </div>

        </div>
      </div>
    </transition>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toast.show" class="toast" role="status" aria-live="polite">
        <CheckCircle2 :size="16" aria-hidden="true" />
        {{ toast.message }}
      </div>
    </transition>

  </main>
</template>

<script>
import {
  Library, Star, Play, User, Search, X, Mic, Image as ImageIcon,
  MoreHorizontal, ChevronDown, SearchX, Share2,
  Video, Music, Sparkles, Eye,
  History, Trash2, LayoutGrid, List, CheckCircle2
} from "lucide-vue-next";

export default {
  name: "MediaCenter",

  components: {
    Library, Star, Play, User, Search, X, Mic, ImageIcon,
    MoreHorizontal, ChevronDown, SearchX, Share2,
    Video, Music, Sparkles, Eye,
    History, Trash2, LayoutGrid, List, CheckCircle2
  },

  data() {
    return {
      searchQuery: "",
      activeTab: "all",
      sortBy: "newest",
      pageSize: 6,
      selectedMedia: null,
      viewMode: "grid",
      loading: false,
      showRecent: false,
      recentlyViewed: [],
      sharedLabel: "Share",
      toast: { show: false, message: "" },
      tabRefs: [],

      tabs: [
        { key: "all", label: "All", icon: "Sparkles" },
        { key: "Video", label: "Videos", icon: "Video" },
        { key: "Audio", label: "Audio", icon: "Music" },
        { key: "Photo", label: "Photos", icon: "ImageIcon" }
      ],

      featured: {
        id: 0,
        title: "Walking by Faith, Not by Sight",
        type: "Video",
        category: "Sunday Service",
        description: "A message about trusting God's promises and walking in faith.",
        longDescription:
          "Discover how trusting in God's promises can transform your life, strengthen your faith, and give you hope through every season.",
        author: "Pastor John",
        initials: "PJ",
        date: "September 20, 2026",
        duration: "45:20",
        theme: "theme-featured",
        mediaUrl: ""
      },

      media: [
        { id: 1, title: "The Power of Prayer", type: "Video", category: "Sermons", description: "Discover the importance of prayer in your daily Christian life.", author: "Pastor John", initials: "PJ", date: "Sep 20, 2026", isoDate: "2026-09-20", duration: "38:45", theme: "theme-purple", mediaUrl: "" },
        { id: 2, title: "Sunday Worship Session", type: "Audio", category: "Worship", description: "A collection of uplifting praise and worship songs.", author: "Worship Team", initials: "WT", date: "Sep 18, 2026", isoDate: "2026-09-18", duration: "52:10", theme: "theme-blue", mediaUrl: "" },
        { id: 3, title: "Church Community Gathering", type: "Photo", category: "Events", description: "Beautiful moments from our recent church fellowship.", author: "Media Team", initials: "MT", date: "Sep 15, 2026", isoDate: "2026-09-15", duration: "", theme: "theme-orange", mediaUrl: "" },
        { id: 4, title: "Understanding God's Grace", type: "Video", category: "Bible Study", description: "A Bible study exploring God's love, mercy, and grace.", author: "Pastor James", initials: "PJ", date: "Sep 12, 2026", isoDate: "2026-09-12", duration: "42:30", theme: "theme-green", mediaUrl: "" },
        { id: 5, title: "Evening Prayer and Praise", type: "Audio", category: "Prayer", description: "A peaceful prayer session to strengthen your spiritual journey.", author: "Prayer Ministry", initials: "PM", date: "Sep 10, 2026", isoDate: "2026-09-10", duration: "30:15", theme: "theme-pink", mediaUrl: "" },
        { id: 6, title: "Youth Sunday Celebration", type: "Photo", category: "Youth", description: "Highlights and memorable moments from youth Sunday.", author: "Youth Ministry", initials: "YM", date: "Sep 7, 2026", isoDate: "2026-09-07", duration: "", theme: "theme-teal", mediaUrl: "" },
        { id: 7, title: "Living a Life of Faith", type: "Video", category: "Sermons", description: "Practical biblical lessons for living a faithful life.", author: "Pastor John", initials: "PJ", date: "Sep 5, 2026", isoDate: "2026-09-05", duration: "36:20", theme: "theme-blue", mediaUrl: "" },
        { id: 8, title: "Morning Devotional", type: "Audio", category: "Devotion", description: "Begin your day with scripture, reflection, and prayer.", author: "Pastor James", initials: "PJ", date: "Sep 2, 2026", isoDate: "2026-09-02", duration: "18:40", theme: "theme-purple", mediaUrl: "" }
      ]
    };
  },

  computed: {
    mediaStats() {
      return [
        { label: "Videos", value: this.media.filter(m => m.type === "Video").length, icon: "Video", color: "purple" },
        { label: "Audio", value: this.media.filter(m => m.type === "Audio").length, icon: "Music", color: "blue" },
        { label: "Photos", value: this.media.filter(m => m.type === "Photo").length, icon: "ImageIcon", color: "green" },
        { label: "Total items", value: this.media.length, icon: "Library", color: "orange" }
      ];
    },

    filteredMedia() {
      let list = [...this.media];

      if (this.activeTab !== "all") {
        list = list.filter(m => m.type === this.activeTab);
      }

      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase().trim();
        list = list.filter(
          m =>
            m.title.toLowerCase().includes(q) ||
            m.category.toLowerCase().includes(q) ||
            m.author.toLowerCase().includes(q) ||
            m.description.toLowerCase().includes(q)
        );
      }

      switch (this.sortBy) {
        case "newest":
          list.sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate));
          break;
        case "oldest":
          list.sort((a, b) => new Date(a.isoDate) - new Date(b.isoDate));
          break;
        case "title":
          list.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "type":
          list.sort((a, b) => a.type.localeCompare(b.type));
          break;
      }

      return list;
    },

    visibleMedia() {
      return this.filteredMedia.slice(0, this.pageSize);
    },

    hasMore() {
      return this.filteredMedia.length > this.pageSize;
    }
  },

  watch: {
    searchQuery() {
      this.pageSize = 6;
    },
    activeTab() {
      this.pageSize = 6;
    },
    sortBy() {
      this.pageSize = 6;
    }
  },

  methods: {
    typeIcon(type) {
      if (type === "Video") return "Video";
      if (type === "Audio") return "Music";
      return "ImageIcon";
    },

    tabCount(key) {
      if (key === "all") return this.media.length;
      return this.media.filter(m => m.type === key).length;
    },

    moveTab(direction) {
      const current = this.tabs.findIndex(t => t.key === this.activeTab);
      const next = (current + direction + this.tabs.length) % this.tabs.length;
      this.activeTab = this.tabs[next].key;
      this.$nextTick(() => {
        this.tabRefs[next]?.focus();
      });
    },

    openMedia(item) {
      this.selectedMedia = item;

      // Track recently viewed
      this.recentlyViewed = [
        item,
        ...this.recentlyViewed.filter(r => r.id !== item.id)
      ].slice(0, 5);

      this.$nextTick(() => {
        this.$refs.playerModal?.focus();
      });
      document.body.style.overflow = "hidden";
    },

    closeMedia() {
      this.selectedMedia = null;
      document.body.style.overflow = "";
      this.sharedLabel = "Share";
    },

    resetFilters() {
      this.searchQuery = "";
      this.activeTab = "all";
      this.sortBy = "newest";
      this.pageSize = 6;
    },

    async shareMedia() {
      const url = window.location.href;
      try {
        if (navigator.share) {
          await navigator.share({
            title: this.selectedMedia?.title,
            url
          });
        } else if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(url);
          this.sharedLabel = "Copied!";
          this.showToast("Link copied to clipboard");
          setTimeout(() => {
            this.sharedLabel = "Share";
          }, 2000);
        }
      } catch (e) {
        // User cancelled or clipboard failed
      }
    },

    trapFocus(e) {
      const modal = this.$refs.playerModal;
      if (!modal) return;
      const focusable = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },

    showToast(message) {
      this.toast = { show: true, message };
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        this.toast.show = false;
      }, 2500);
    }
  },

  beforeUnmount() {
    document.body.style.overflow = "";
    clearTimeout(this._toastTimer);
  }
};
</script>

<style scoped>
.media-page {
  min-height: 100vh;
  background: #f7f6fb;
  color: #1e1b3a;
  font-family: "Inter", "Segoe UI", sans-serif;
  padding: 32px;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

:focus-visible {
  outline: 2px solid #6d4fc4;
  outline-offset: 2px;
  border-radius: 6px;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

/* HEADER */
.page-header {
  max-width: 1280px;
  margin: 0 auto 26px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
}

.eyebrow {
  color: #7c5cd6;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.8px;
}

.page-header h1 {
  margin: 8px 0 0;
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.8px;
  color: #1e1b3a;
}

.page-header p {
  margin: 10px 0 0;
  color: #5c5a72;
  font-size: 13px;
  line-height: 1.6;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.recent-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 13px;
  border: 1px solid #e4e1ef;
  background: #fff;
  color: #5a3fae;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  border-radius: 9px;
  cursor: pointer;
  transition: background 0.2s;
}

.recent-btn:hover {
  background: #f5f1ff;
}

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #f1ecfd;
  color: #6d4fc4;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* RECENT STRIP */
.recent-strip {
  max-width: 1280px;
  margin: 0 auto 20px;
  padding: 12px;
  background: #fff;
  border: 1px solid #ece9f5;
  border-radius: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.recent-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 10px 6px 6px;
  background: #f7f5fd;
  border: 1px solid #ece9f5;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  color: #2c2946;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  max-width: 240px;
}

.recent-chip span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recent-chip:hover {
  background: #f1ecfd;
  border-color: #c4b4e8;
}

.recent-icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.clear-recent {
  margin-left: auto;
  border: none;
  background: transparent;
  color: #8a879a;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
}

.clear-recent:hover {
  background: #f1ecfd;
  color: #5a3fae;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* FEATURED */
.featured {
  max-width: 1280px;
  margin: 0 auto 26px;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  background: linear-gradient(120deg, #2a1f52 0%, #4a3385 55%, #6d4fc4 100%);
  border-radius: 18px;
  overflow: hidden;
  min-height: 300px;
  box-shadow: 0 12px 36px rgba(46, 34, 95, 0.18);
}

.featured-copy {
  padding: 38px 40px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.featured-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #d8c7ff;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.8px;
  margin-bottom: 14px;
}

.featured-copy h2 {
  margin: 0 0 14px;
  font-size: 28px;
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: -0.5px;
  max-width: 460px;
}

.featured-copy > p {
  margin: 0;
  color: #ddd5f0;
  font-size: 13px;
  line-height: 1.85;
  max-width: 470px;
}

.featured-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 18px;
  color: #d2c6ea;
  font-size: 11px;
  font-weight: 500;
}

.featured-meta span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.featured-meta .dot {
  opacity: 0.5;
}

.btn-featured {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  padding: 12px 20px;
  border: none;
  border-radius: 9px;
  background: #fff;
  color: #4a3385;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  align-self: flex-start;
  transition: transform 0.2s, background 0.2s;
}

.btn-featured:hover {
  transform: translateY(-2px);
  background: #f0eaff;
}

.featured-visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background: radial-gradient(ellipse at 60% 40%, #9b80d0, #56438e 48%, #2e2654);
}

.visual-rings span {
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.visual-rings span:nth-child(1) { width: 280px; height: 280px; }
.visual-rings span:nth-child(2) { width: 210px; height: 210px; }
.visual-rings span:nth-child(3) { width: 140px; height: 140px; }

.hero-play {
  position: relative;
  z-index: 2;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: transform 0.2s, background 0.2s;
}

.hero-play:hover {
  transform: scale(1.08);
  background: rgba(255, 255, 255, 0.35);
}

.hero-duration {
  position: absolute;
  right: 18px;
  bottom: 16px;
  z-index: 3;
  padding: 5px 10px;
  border-radius: 5px;
  background: rgba(20, 14, 40, 0.72);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
}

/* STATS */
.stats-strip {
  max-width: 1280px;
  margin: 0 auto 26px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 17px 19px;
  background: #fff;
  border: 1px solid #ece9f5;
  border-radius: 13px;
  min-width: 0;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.purple { background: #f1ecfd; color: #6d4fc4; }
.stat-icon.blue { background: #e8f3ff; color: #3b7fc4; }
.stat-icon.green { background: #e5f7ed; color: #2a8b5f; }
.stat-icon.orange { background: #fff1e3; color: #c9803a; }

.stat strong {
  display: block;
  font-size: 22px;
  font-weight: 800;
  color: #1e1b3a;
  letter-spacing: -0.5px;
  line-height: 1.1;
}

.stat span {
  display: block;
  margin-top: 3px;
  font-size: 11px;
  color: #8a879a;
  font-weight: 500;
}

/* LIBRARY */
.library {
  max-width: 1280px;
  margin: 0 auto;
  padding: 28px;
  background: #fff;
  border: 1px solid #ece9f5;
  border-radius: 16px;
  box-shadow: 0 6px 22px rgba(46, 33, 87, 0.04);
}

.library-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 22px;
}

.library-head h2 {
  margin: 0 0 6px;
  font-size: 20px;
  font-weight: 800;
  color: #1e1b3a;
  letter-spacing: -0.4px;
}

.library-head p {
  margin: 0;
  font-size: 12px;
  color: #8a879a;
}

.view-toggle {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: #f7f5fd;
  border-radius: 9px;
  flex-shrink: 0;
}

.view-toggle button {
  border: none;
  background: transparent;
  color: #8a879a;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.view-toggle button:hover {
  color: #5a3fae;
}

.view-toggle button.active {
  background: #fff;
  color: #6d4fc4;
  box-shadow: 0 1px 3px rgba(46, 33, 87, 0.08);
}

/* CONTROLS */
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
  padding-bottom: 22px;
  border-bottom: 1px solid #f0eef7;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 12px;
  height: 42px;
  width: 320px;
  max-width: 100%;
  background: #fbfafe;
  border: 1px solid #e4e1ef;
  border-radius: 9px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-box:focus-within {
  border-color: #8b6fdb;
  box-shadow: 0 0 0 3px rgba(139, 111, 219, 0.12);
  background: #fff;
}

.search-icon {
  color: #8a879a;
  flex-shrink: 0;
}

.search-box input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: 13px;
  color: #1e1b3a;
}

.search-box input::placeholder {
  color: #adabbe;
}

.clear-search {
  border: none;
  background: #f1ecfd;
  color: #6d4fc4;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.controls-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.sort-select {
  padding: 10px 12px;
  border: 1px solid #e4e1ef;
  border-radius: 8px;
  background: #fff;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  color: #2c2946;
  cursor: pointer;
  outline: none;
}

.tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 13px;
  border: 1px solid #e7e4f0;
  border-radius: 9px;
  background: #fff;
  color: #6a6780;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.tab:hover {
  border-color: #c4b4e8;
  color: #5a3fae;
}

.tab.active {
  background: #6d4fc4;
  border-color: #6d4fc4;
  color: #fff;
}

.tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 5px;
  background: #f1ecfd;
  color: #6d4fc4;
  font-size: 10px;
  font-weight: 700;
}

.tab.active .tab-count {
  background: rgba(255, 255, 255, 0.22);
  color: #fff;
}

/* MEDIA GRID */
.media-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.media-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.media-card {
  min-width: 0;
  background: #fff;
  border: 1px solid #ece9f5;
  border-radius: 13px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
}

.media-card:hover {
  transform: translateY(-4px);
  border-color: #d5caee;
  box-shadow: 0 14px 30px rgba(46, 33, 87, 0.1);
}

.media-card.list-mode {
  display: grid;
  grid-template-columns: 240px 1fr;
}

.media-card.list-mode:hover {
  transform: translateX(3px);
}

.thumb {
  position: relative;
  height: 170px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.media-card.list-mode .thumb {
  height: 100%;
  min-height: 140px;
}

.thumb-graphic {
  color: rgba(255, 255, 255, 0.15);
  z-index: 1;
}

.thumb::before,
.thumb::after {
  content: "";
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.thumb::before { width: 210px; height: 210px; }
.thumb::after { width: 140px; height: 140px; }

.type-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 9px;
  background: rgba(20, 14, 40, 0.4);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  border-radius: 6px;
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.16);
}

.card-play {
  position: relative;
  z-index: 2;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.55);
  background: rgba(255, 255, 255, 0.22);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
  transition: transform 0.2s, background 0.2s;
}

.media-card:hover .card-play {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.36);
}

.duration {
  position: absolute;
  right: 10px;
  bottom: 10px;
  z-index: 3;
  padding: 5px 8px;
  border-radius: 5px;
  background: rgba(20, 14, 40, 0.72);
  color: #fff;
  font-size: 10px;
  font-weight: 600;
}

.card-body {
  padding: 15px 17px 17px;
}

.media-card.list-mode .card-body {
  padding: 16px 20px;
}

.category-tag {
  display: inline-block;
  padding: 4px 9px;
  background: #f1ecfd;
  color: #5a3fae;
  font-size: 10px;
  font-weight: 700;
  border-radius: 5px;
  letter-spacing: 0.2px;
  margin-bottom: 10px;
}

.card-body h3 {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 700;
  color: #1e1b3a;
  line-height: 1.5;
}

.desc {
  margin: 0;
  font-size: 11px;
  color: #6f6c84;
  line-height: 1.7;
  min-height: 34px;
}

.media-card.list-mode .desc {
  min-height: 0;
}

.card-foot {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: 14px;
  padding-top: 13px;
  border-top: 1px solid #f0eef7;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: #eee9fc;
  color: #5a3fae;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  flex-shrink: 0;
}

.author-meta {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.author-meta strong {
  font-size: 11px;
  font-weight: 700;
  color: #2c2946;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.author-meta small {
  font-size: 10px;
  color: #9794a7;
}

.more-btn {
  flex-shrink: 0;
  border: none;
  background: transparent;
  color: #8a879a;
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.more-btn:hover {
  background: #f1ecfd;
  color: #5a3fae;
}

/* SKELETON */
.skeleton-card {
  background: #fff;
  border: 1px solid #ece9f5;
  border-radius: 13px;
  overflow: hidden;
}

.skeleton-thumb {
  height: 170px;
  background: linear-gradient(90deg, #f3effa 25%, #ece4f7 37%, #f3effa 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}

.skeleton-line {
  height: 12px;
  margin: 14px 17px 0;
  border-radius: 4px;
  background: linear-gradient(90deg, #f3effa 25%, #ece4f7 37%, #f3effa 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}

.skeleton-line.short {
  width: 60%;
  margin-bottom: 17px;
}

@keyframes shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
}

/* EMPTY */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #9c8acb;
}

.empty-state h3 {
  margin: 16px 0 8px;
  font-size: 16px;
  color: #2c2946;
  font-weight: 800;
}

.empty-state p {
  margin: 0 0 18px;
  font-size: 12px;
  color: #8a879a;
}

.empty-state button {
  padding: 10px 16px;
  background: #6d4fc4;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

/* LOAD MORE */
.load-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 26px;
}

.load-more button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 20px;
  border: 1px solid #ded7f1;
  background: #fff;
  color: #5a3fae;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  border-radius: 9px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.load-more button:hover {
  background: #f5f1ff;
  border-color: #c4b4e8;
}

.load-more-hint {
  font-size: 11px;
  color: #8a879a;
  font-weight: 500;
}

/* MODAL */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(20, 14, 40, 0.7);
  backdrop-filter: blur(6px);
}

.modal {
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  overflow-y: auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(20, 15, 40, 0.3);
  outline: none;
}

.modal-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 22px 24px 16px;
}

.modal-head .eyebrow {
  font-size: 10px;
  margin-bottom: 6px;
  display: block;
}

.modal-head h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #1e1b3a;
  letter-spacing: -0.3px;
}

.close-btn {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 8px;
  background: #f1ecfd;
  color: #5a3fae;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.close-btn:hover {
  background: #e5ddfa;
}

.player-screen {
  position: relative;
  margin: 0 24px;
  min-height: 260px;
  border-radius: 12px;
  padding: 28px;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.native-player {
  width: 100%;
  border-radius: 8px;
  max-height: 360px;
}

.native-audio {
  width: 100%;
  max-width: 320px;
  margin-top: 12px;
}

.audio-player-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.native-photo {
  width: 100%;
  max-height: 380px;
  object-fit: cover;
  border-radius: 8px;
}

.screen-graphic {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}

.screen-title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 18px;
  text-align: center;
}

.progress {
  width: 100%;
  max-width: 320px;
  height: 4px;
  background: rgba(255, 255, 255, 0.22);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  width: 0%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 3px;
  animation: progressGrow 2s ease forwards;
}

@keyframes progressGrow {
  to { width: 42%; }
}

.time-row {
  width: 100%;
  max-width: 320px;
  display: flex;
  justify-content: space-between;
  margin-top: 9px;
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.75);
}

.audio-controls {
  display: flex;
  gap: 18px;
  align-items: center;
  margin-bottom: 18px;
}

.audio-controls .ctrl {
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
}

.audio-controls .ctrl.primary {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-note {
  margin: 0;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.75);
}

.modal-body {
  padding: 20px 24px 24px;
}

.modal-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #6f6c84;
  margin-bottom: 12px;
}

.meta-dot {
  color: #c4b4e8;
}

.modal-desc {
  margin: 0 0 20px;
  font-size: 12px;
  line-height: 1.8;
  color: #5c5a72;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-ghost,
.btn-primary {
  padding: 10px 18px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  transition: background 0.2s, transform 0.15s;
}

.btn-ghost {
  background: transparent;
  border: 1px solid #e4e1ef;
  color: #5c5a72;
}

.btn-ghost:hover {
  background: #f7f5fd;
}

.btn-primary {
  background: #6d4fc4;
  border: none;
  color: #fff;
}

.btn-primary:hover {
  background: #5a3fae;
  transform: translateY(-1px);
}

/* Toast */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1100;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 12px 16px;
  background: #1e5e46;
  color: #e8fff5;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 12px 32px rgba(20, 12, 46, 0.22);
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

/* Modal fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* THEMES */
.theme-featured { background: radial-gradient(ellipse at 60% 40%, #9b80d0, #56438e 48%, #2e2654); }
.theme-purple { background: linear-gradient(135deg, #6d53ae, #38275f); }
.theme-blue { background: linear-gradient(135deg, #5796c5, #315782); }
.theme-orange { background: linear-gradient(135deg, #e7a75c, #a9613f); }
.theme-green { background: linear-gradient(135deg, #5b9c7c, #285b4d); }
.theme-pink { background: linear-gradient(135deg, #d888b1, #995279); }
.theme-teal { background: linear-gradient(135deg, #56b7b0, #327a86); }

/* RESPONSIVE */
@media (max-width: 1050px) {
  .featured { grid-template-columns: 1fr; }
  .featured-visual { min-height: 220px; }
  .media-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .stats-strip { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .media-card.list-mode { grid-template-columns: 200px 1fr; }
}

@media (max-width: 750px) {
  .media-page { padding: 20px; }
  .controls { flex-direction: column; align-items: stretch; }
  .search-box { width: 100%; }
  .controls-right { flex-direction: column; align-items: stretch; }
  .sort-select { width: 100%; }
  .media-card.list-mode {
    grid-template-columns: 1fr;
  }
  .media-card.list-mode .thumb {
    height: 180px;
  }
}

@media (max-width: 550px) {
  .media-page { padding: 14px; }
  .page-header { flex-direction: column; align-items: flex-start; }
  .page-header h1 { font-size: 24px; }
  .header-actions { width: 100%; justify-content: space-between; }
  .featured-copy { padding: 26px 22px; }
  .featured-copy h2 { font-size: 22px; }
  .library { padding: 18px; }
  .media-grid { grid-template-columns: 1fr; }
  .tab { padding: 8px 10px; font-size: 11px; }
  .modal-actions { flex-direction: column-reverse; }
  .btn-ghost, .btn-primary { justify-content: center; width: 100%; }
  .toast { bottom: 16px; right: 16px; left: 16px; }
}

@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
</style>