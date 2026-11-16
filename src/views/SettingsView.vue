<template>
  <main class="settings-page" role="main" aria-labelledby="settings-title">

    <!-- ============ HEADER ============ -->
    <header class="page-header">
      <div>
        <span class="eyebrow">ACCOUNT</span>
        <h1 id="settings-title">Settings</h1>
        <p>Manage your profile, account, preferences and security.</p>
      </div>
      <div class="header-icon" aria-hidden="true">
        <Settings :size="24" />
      </div>
    </header>

    <!-- ============ LAYOUT ============ -->
    <div class="settings-layout">

      <!-- SIDEBAR -->
      <aside class="sidebar" aria-label="Settings sections">
        <div class="sidebar-head">
          <h2>Settings Menu</h2>
          <p>Manage your preferences</p>
        </div>

        <nav
          class="menu"
          role="tablist"
          aria-orientation="vertical"
          @keydown.up.prevent="moveTab(-1)"
          @keydown.down.prevent="moveTab(1)"
        >
          <button
            v-for="(item, i) in menus"
            :key="item.id"
            type="button"
            role="tab"
            :ref="el => { if (el) tabRefs[i] = el }"
            :aria-selected="activeSection === item.id"
            :tabindex="activeSection === item.id ? 0 : -1"
            :class="['menu-item', { active: activeSection === item.id }]"
            @click="switchSection(item.id)"
          >
            <span class="menu-icon" :class="item.color">
              <component :is="item.icon" :size="16" aria-hidden="true" />
            </span>
            <span class="menu-label">{{ item.label }}</span>
            <span v-if="isDirty(item.id)" class="dirty-dot" aria-label="Unsaved changes"></span>
            <ChevronRight
              v-if="activeSection === item.id"
              :size="14"
              class="menu-arrow"
              aria-hidden="true"
            />
          </button>
        </nav>

        <div class="sidebar-foot">
          <div class="support-icon" aria-hidden="true">
            <LifeBuoy :size="15" />
          </div>
          <div>
            <strong>Need help?</strong>
            <p>Contact support or check the help center.</p>
          </div>
        </div>
      </aside>

      <!-- CONTENT -->
      <section class="content" role="tabpanel" :aria-label="activeMenu.label">

        <!-- ========== PROFILE ========== -->
        <template v-if="activeSection === 'general'">
          <header class="panel-head">
            <div>
              <span class="eyebrow">PROFILE SETTINGS</span>
              <h2>User Profile</h2>
              <p>Manage your personal information and contact details.</p>
            </div>
            <div class="panel-icon purple" aria-hidden="true">
              <User :size="20" />
            </div>
          </header>

          <div class="profile-banner">
            <div class="avatar">{{ profile.name.charAt(0).toUpperCase() || 'U' }}</div>
            <div class="profile-info">
              <h3>{{ profile.name || 'Your Name' }}</h3>
              <p>{{ profile.username || 'User profile' }}</p>
              <span class="status-pill">
                <span class="dot"></span>
                Active profile
              </span>
            </div>
          </div>

          <section class="form-section">
            <h3>Basic Information</h3>
            <p class="desc">Enter your personal details.</p>

            <div class="form-grid">
              <div class="field">
                <label for="p-name">Full Name</label>
                <input id="p-name" v-model="profile.name" type="text" placeholder="Enter your full name">
              </div>
              <div class="field">
                <label for="p-username">Username</label>
                <input id="p-username" v-model="profile.username" type="text" placeholder="Enter username">
              </div>
              <div class="field">
                <label for="p-email">Email Address</label>
                <input id="p-email" v-model="profile.email" type="email" placeholder="user@example.com">
                <span v-if="!isValidEmail(profile.email)" class="field-error">
                  Please enter a valid email.
                </span>
              </div>
              <div class="field">
                <label for="p-phone">Phone Number</label>
                <input id="p-phone" v-model="profile.phone" type="tel" placeholder="+250 7XX XXX XXX">
              </div>
              <div class="field full">
                <label for="p-address">Address</label>
                <input id="p-address" v-model="profile.address" type="text" placeholder="Street, City, Country">
              </div>
              <div class="field">
                <label for="p-web">Website</label>
                <input id="p-web" v-model="profile.website" type="url" placeholder="https://www.example.com">
              </div>
              <div class="field">
                <label for="p-year">Birth Year</label>
                <input id="p-year" v-model="profile.birthYear" type="number" placeholder="e.g. 1995">
              </div>
              <div class="field full">
                <label for="p-bio">About Me</label>
                <textarea id="p-bio" v-model="profile.bio" rows="4" placeholder="Write a short description about yourself..."></textarea>
              </div>
            </div>
          </section>
        </template>

        <!-- ========== ACCOUNT ========== -->
        <template v-if="activeSection === 'account'">
          <header class="panel-head">
            <div>
              <span class="eyebrow">ACCOUNT MANAGEMENT</span>
              <h2>My Account</h2>
              <p>Manage your personal account information and profile.</p>
            </div>
            <div class="panel-icon blue" aria-hidden="true">
              <UserCog :size="20" />
            </div>
          </header>

          <div class="account-card">
            <div class="avatar-circle">{{ account.name.charAt(0).toUpperCase() || 'U' }}</div>
            <div class="account-info">
              <h3>{{ account.name || 'User' }}</h3>
              <p>{{ account.email || 'user@example.com' }}</p>
              <span class="role-badge">{{ account.role }}</span>
            </div>
            <span class="verified-badge">
              <CheckCircle2 :size="12" aria-hidden="true" />
              Active
            </span>
          </div>

          <section class="form-section">
            <h3>Personal Information</h3>
            <p class="desc">Update your personal details.</p>

            <div class="form-grid">
              <div class="field">
                <label for="a-name">Full Name</label>
                <input id="a-name" v-model="account.name" type="text" placeholder="Full name">
              </div>
              <div class="field">
                <label for="a-username">Username</label>
                <input id="a-username" v-model="account.username" type="text" placeholder="Username">
              </div>
              <div class="field">
                <label for="a-email">Email Address</label>
                <input id="a-email" v-model="account.email" type="email" placeholder="user@example.com">
              </div>
              <div class="field">
                <label for="a-phone">Phone Number</label>
                <input id="a-phone" v-model="account.phone" type="tel" placeholder="+250 7XX XXX XXX">
              </div>
              <div class="field full">
                <label for="a-role">Role</label>
                <input id="a-role" :value="account.role" type="text" disabled>
                <small class="field-hint">This role is assigned to your user account.</small>
              </div>
            </div>
          </section>

          <div class="notice blue">
            <Info :size="16" aria-hidden="true" />
            <p>Keep your account information up to date so we can contact you correctly.</p>
          </div>
        </template>

        <!-- ========== APPEARANCE ========== -->
        <template v-if="activeSection === 'appearance'">
          <header class="panel-head">
            <div>
              <span class="eyebrow">DISPLAY PREFERENCES</span>
              <h2>Appearance</h2>
              <p>Customize the look and feel of your dashboard.</p>
            </div>
            <div class="panel-icon purple" aria-hidden="true">
              <Palette :size="20" />
            </div>
          </header>

          <section class="form-section">
            <h3>Theme</h3>
            <p class="desc">Choose your preferred dashboard appearance.</p>

            <div class="theme-grid">
              <button
                v-for="t in themes"
                :key="t.id"
                type="button"
                :class="['theme-card', { selected: appearance.theme === t.id }]"
                :aria-pressed="appearance.theme === t.id"
                @click="appearance.theme = t.id"
              >
                <div :class="['theme-preview', t.previewClass]">
                  <div class="preview-sidebar"></div>
                  <div class="preview-content">
                    <div class="preview-line"></div>
                    <div class="preview-card"></div>
                    <div class="preview-card small"></div>
                  </div>
                </div>
                <div class="theme-label">
                  <span>{{ t.label }}</span>
                  <span class="radio-indicator"></span>
                </div>
              </button>
            </div>
          </section>

          <section class="form-section">
            <h3>Accent Color</h3>
            <p class="desc">Pick a color to personalize your dashboard.</p>

            <div class="color-grid">
              <button
                v-for="color in colors"
                :key="color.value"
                type="button"
                :class="['color-option', { selected: appearance.accent === color.value }]"
                :aria-label="`Use ${color.name} accent`"
                :aria-pressed="appearance.accent === color.value"
                @click="appearance.accent = color.value"
              >
                <span class="color-circle" :style="{ background: color.value }">
                  <Check v-if="appearance.accent === color.value" :size="14" aria-hidden="true" />
                </span>
                <small>{{ color.name }}</small>
              </button>
            </div>
          </section>

          <section class="form-section">
            <h3>Display Options</h3>
            <div class="row">
              <div>
                <strong>Compact Sidebar</strong>
                <p>Use a more compact navigation layout.</p>
              </div>
              <button
                type="button"
                class="toggle"
                :class="{ on: appearance.compact }"
                role="switch"
                :aria-checked="appearance.compact"
                @click="appearance.compact = !appearance.compact"
              ><span></span></button>
            </div>
            <div class="row">
              <div>
                <strong>Animations</strong>
                <p>Enable interface transition effects.</p>
              </div>
              <button
                type="button"
                class="toggle"
                :class="{ on: appearance.animations }"
                role="switch"
                :aria-checked="appearance.animations"
                @click="appearance.animations = !appearance.animations"
              ><span></span></button>
            </div>
          </section>
        </template>

        <!-- ========== NOTIFICATIONS ========== -->
        <template v-if="activeSection === 'notifications'">
          <header class="panel-head">
            <div>
              <span class="eyebrow">COMMUNICATION</span>
              <h2>Notifications</h2>
              <p>Choose which updates and alerts you want to receive.</p>
            </div>
            <div class="panel-icon orange" aria-hidden="true">
              <Bell :size="20" />
            </div>
          </header>

          <section class="form-section">
            <h3>Email Notifications</h3>
            <p class="desc">Manage email alerts for school activities.</p>

            <div
              v-for="n in notificationItems"
              :key="n.key"
              class="row with-icon"
            >
              <div class="row-icon" :class="n.color">
                <component :is="n.icon" :size="16" aria-hidden="true" />
              </div>
              <div class="row-text">
                <strong>{{ n.label }}</strong>
                <p>{{ n.description }}</p>
              </div>
              <button
                type="button"
                class="toggle"
                :class="{ on: notifications[n.key] }"
                role="switch"
                :aria-checked="notifications[n.key]"
                :aria-label="n.label"
                @click="notifications[n.key] = !notifications[n.key]"
              ><span></span></button>
            </div>
          </section>
        </template>

        <!-- ========== SECURITY ========== -->
        <template v-if="activeSection === 'security'">
          <header class="panel-head">
            <div>
              <span class="eyebrow">ACCOUNT PROTECTION</span>
              <h2>Security</h2>
              <p>Protect your account and manage your security preferences.</p>
            </div>
            <div class="panel-icon green" aria-hidden="true">
              <ShieldCheck :size="20" />
            </div>
          </header>

          <div class="notice green">
            <ShieldCheck :size="16" aria-hidden="true" />
            <div>
              <strong>Account Security</strong>
              <p>Review your password and additional account protection options.</p>
            </div>
          </div>

          <section class="form-section">
            <h3>Change Password</h3>
            <p class="desc">Use a strong, unique password for your account.</p>

            <form class="password-form" @submit.prevent="changePassword">
              <div class="field">
                <label for="pw-current">Current Password</label>
                <div class="pw-wrap">
                  <input
                    id="pw-current"
                    v-model="password.current"
                    :type="showCurrent ? 'text' : 'password'"
                    placeholder="Enter current password"
                    autocomplete="current-password"
                    required
                  >
                  <button type="button" @click="showCurrent = !showCurrent">
                    {{ showCurrent ? 'Hide' : 'Show' }}
                  </button>
                </div>
              </div>

              <div class="field">
                <label for="pw-new">New Password</label>
                <div class="pw-wrap">
                  <input
                    id="pw-new"
                    v-model="password.newPassword"
                    :type="showNew ? 'text' : 'password'"
                    placeholder="Enter new password"
                    autocomplete="new-password"
                    minlength="8"
                    required
                  >
                  <button type="button" @click="showNew = !showNew">
                    {{ showNew ? 'Hide' : 'Show' }}
                  </button>
                </div>
                <div v-if="password.newPassword" class="strength">
                  <div class="strength-bar">
                    <div
                      class="strength-fill"
                      :class="passwordStrength.level"
                      :style="{ width: passwordStrength.percent + '%' }"
                    ></div>
                  </div>
                  <small :class="passwordStrength.level">{{ passwordStrength.label }}</small>
                </div>
                <small class="field-hint">Use at least 8 characters with letters and numbers.</small>
              </div>

              <div class="field">
                <label for="pw-confirm">Confirm New Password</label>
                <input
                  id="pw-confirm"
                  v-model="password.confirm"
                  type="password"
                  placeholder="Confirm new password"
                  autocomplete="new-password"
                  minlength="8"
                  required
                >
                <span v-if="password.confirm && password.newPassword !== password.confirm" class="field-error">
                  Passwords do not match.
                </span>
              </div>

              <p v-if="passwordError" class="form-error">{{ passwordError }}</p>

              <button type="submit" class="btn-secondary" :disabled="!canChangePassword">
                Update Password
              </button>
            </form>
          </section>

          <section class="form-section">
            <h3>Additional Security</h3>
            <div class="row with-icon">
              <div class="row-icon green"><Lock :size="16" aria-hidden="true" /></div>
              <div class="row-text">
                <strong>Two-Factor Authentication</strong>
                <p>Require an additional verification step when signing in.</p>
              </div>
              <button
                type="button"
                class="toggle"
                :class="{ on: security.twoFactor }"
                role="switch"
                :aria-checked="security.twoFactor"
                @click="security.twoFactor = !security.twoFactor"
              ><span></span></button>
            </div>
            <div class="row with-icon">
              <div class="row-icon blue"><Bell :size="16" aria-hidden="true" /></div>
              <div class="row-text">
                <strong>Login Alerts</strong>
                <p>Receive notifications about new account sign-ins.</p>
              </div>
              <button
                type="button"
                class="toggle"
                :class="{ on: security.loginAlerts }"
                role="switch"
                :aria-checked="security.loginAlerts"
                @click="security.loginAlerts = !security.loginAlerts"
              ><span></span></button>
            </div>
          </section>

          <section class="form-section">
            <h3>Active Session</h3>
            <div class="session-card">
              <div class="session-icon"><Monitor :size="18" aria-hidden="true" /></div>
              <div class="session-info">
                <strong>Current Session</strong>
                <p>Manage your current user session.</p>
                <span class="status-text">
                  <span class="dot"></span>
                  Active now
                </span>
              </div>
              <span class="session-label">This device</span>
            </div>
          </section>
        </template>

        <!-- ========== PREFERENCES ========== -->
        <template v-if="activeSection === 'preferences'">
          <header class="panel-head">
            <div>
              <span class="eyebrow">REGIONAL</span>
              <h2>System Preferences</h2>
              <p>Configure language, timezone, and display preferences.</p>
            </div>
            <div class="panel-icon blue" aria-hidden="true">
              <Globe :size="20" />
            </div>
          </header>

          <section class="form-section">
            <h3>Regional Settings</h3>
            <p class="desc">Customize how information is displayed.</p>

            <div class="form-grid">
              <div class="field">
                <label for="pr-lang">Language</label>
                <select id="pr-lang" v-model="preferences.language">
                  <option>English</option>
                  <option>Kinyarwanda</option>
                  <option>French</option>
                  <option>Swahili</option>
                </select>
              </div>
              <div class="field">
                <label for="pr-tz">Timezone</label>
                <select id="pr-tz" v-model="preferences.timezone">
                  <option value="Africa/Kigali">Africa/Kigali (CAT)</option>
                  <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                  <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="America/New_York">America/New York</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
              <div class="field">
                <label for="pr-date">Date Format</label>
                <select id="pr-date" v-model="preferences.dateFormat">
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
              <div class="field">
                <label for="pr-time">Time Format</label>
                <select id="pr-time" v-model="preferences.timeFormat">
                  <option value="12-hour">12-hour (AM/PM)</option>
                  <option value="24-hour">24-hour</option>
                </select>
              </div>
            </div>
          </section>

          <section class="form-section">
            <h3>Dashboard Preferences</h3>
            <div class="row">
              <div>
                <strong>Show Welcome Message</strong>
                <p>Display a welcome message when opening the dashboard.</p>
              </div>
              <button
                type="button"
                class="toggle"
                :class="{ on: preferences.welcome }"
                role="switch"
                :aria-checked="preferences.welcome"
                @click="preferences.welcome = !preferences.welcome"
              ><span></span></button>
            </div>
            <div class="row">
              <div>
                <strong>Remember Last Page</strong>
                <p>Return to your last visited dashboard section.</p>
              </div>
              <button
                type="button"
                class="toggle"
                :class="{ on: preferences.rememberPage }"
                role="switch"
                :aria-checked="preferences.rememberPage"
                @click="preferences.rememberPage = !preferences.rememberPage"
              ><span></span></button>
            </div>
          </section>

          <div class="preview-box">
            <span class="preview-label">DATE & TIME PREVIEW</span>
            <strong>{{ formattedDate }} · {{ formattedTime }}</strong>
            <p>Example of how dates and times will appear in your dashboard.</p>
          </div>
        </template>

        <!-- ========== SAVE BAR ========== -->
        <footer class="save-bar">
          <div class="save-msg" aria-live="polite">
            <span :class="['save-dot', { dirty: hasChanges }]"></span>
            <span>{{ saveMessage }}</span>
          </div>
          <div class="save-actions">
            <button
              type="button"
              class="btn-ghost"
              :disabled="!hasChanges"
              @click="askReset"
            >
              Reset
            </button>
            <button
              type="button"
              class="btn-primary"
              :disabled="!hasChanges || saving"
              @click="saveSettings"
            >
              <Loader2 v-if="saving" :size="14" class="spin" aria-hidden="true" />
              <Check v-else :size="14" aria-hidden="true" />
              {{ saving ? 'Saving…' : 'Save Changes' }}
            </button>
          </div>
        </footer>

      </section>
    </div>

    <!-- ========== CONFIRM MODAL ========== -->
    <transition name="fade">
      <div
        v-if="confirmState.show"
        class="modal-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        @click.self="cancelConfirm"
      >
        <div class="modal" tabindex="-1" @keydown.esc="cancelConfirm">
          <div class="modal-icon" :class="confirmState.type">
            <component :is="confirmState.type === 'danger' ? 'AlertTriangle' : 'Info'" :size="22" aria-hidden="true" />
          </div>
          <h3 id="confirm-title">{{ confirmState.title }}</h3>
          <p>{{ confirmState.message }}</p>
          <div class="modal-actions">
            <button type="button" class="btn-ghost" @click="cancelConfirm">
              Cancel
            </button>
            <button
              type="button"
              :class="confirmState.type === 'danger' ? 'btn-danger' : 'btn-primary'"
              @click="confirmState.onConfirm"
            >
              {{ confirmState.confirmLabel || 'Confirm' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ========== TOAST ========== -->
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
  Settings, User, UserCog, Palette, Bell, ShieldCheck, Globe,
  LifeBuoy, ChevronRight, Check, CheckCircle2, Info, Lock,
  Monitor, Loader2, AlertTriangle, Mail, HelpCircle, Calendar, Gift
} from "lucide-vue-next";

const DEFAULTS = {
  general: {
    name: "Jane Doe",
    username: "janeuser",
    email: "jane@example.com",
    phone: "+250 788 000 000",
    address: "Kigali, Rwanda",
    website: "https://www.example.com",
    birthYear: "1995",
    bio: "A friendly user who enjoys learning, connecting, and staying organized."
  },
  account: {
    name: "Jane Doe",
    username: "janeuser",
    email: "jane@example.com",
    phone: "+250 788 000 000",
    role: "User"
  },
  appearance: {
    theme: "light",
    accent: "#57409e",
    compact: false,
    animations: true
  },
  notifications: {
    newMembers: true,
    newQuestions: true,
    events: true,
    donations: false,
    system: true
  },
  security: {
    twoFactor: false,
    loginAlerts: true
  },
  preferences: {
    language: "English",
    timezone: "Africa/Kigali",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24-hour",
    welcome: true,
    rememberPage: true
  }
};

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export default {
  name: "SettingsView",

  components: {
    Settings, User, UserCog, Palette, Bell, ShieldCheck, Globe,
    LifeBuoy, ChevronRight, Check, CheckCircle2, Info, Lock,
    Monitor, Loader2, AlertTriangle, Mail, HelpCircle, Calendar, Gift
  },

  data() {
    return {
      activeSection: "general",
      tabRefs: [],

      menus: [
        { id: "general", label: "Profile", icon: "User", color: "purple" },
        { id: "account", label: "My Account", icon: "UserCog", color: "blue" },
        { id: "appearance", label: "Appearance", icon: "Palette", color: "purple" },
        { id: "notifications", label: "Notifications", icon: "Bell", color: "orange" },
        { id: "security", label: "Security", icon: "ShieldCheck", color: "green" },
        { id: "preferences", label: "Preferences", icon: "Globe", color: "blue" }
      ],

      // Each section stores both "current" and "saved" copies for dirty tracking
      profile: clone(DEFAULTS.general),
      account: clone(DEFAULTS.account),
      appearance: clone(DEFAULTS.appearance),
      notifications: clone(DEFAULTS.notifications),
      security: clone(DEFAULTS.security),
      preferences: clone(DEFAULTS.preferences),

      saved: {
        general: clone(DEFAULTS.general),
        account: clone(DEFAULTS.account),
        appearance: clone(DEFAULTS.appearance),
        notifications: clone(DEFAULTS.notifications),
        security: clone(DEFAULTS.security),
        preferences: clone(DEFAULTS.preferences)
      },

      themes: [
        { id: "light", label: "Light Mode", previewClass: "light" },
        { id: "dark", label: "Dark Mode", previewClass: "dark" }
      ],

      colors: [
        { name: "Purple", value: "#57409e" },
        { name: "Blue", value: "#2876c7" },
        { name: "Green", value: "#25845c" },
        { name: "Orange", value: "#d97726" },
        { name: "Rose", value: "#c34c79" },
        { name: "Teal", value: "#218b91" }
      ],

      notificationItems: [
        { key: "newMembers", label: "New Member Registration", description: "Get notified when a new member registers.", icon: "User", color: "purple" },
        { key: "newQuestions", label: "New Questions", description: "Receive alerts when visitors submit questions.", icon: "HelpCircle", color: "blue" },
        { key: "events", label: "Event Reminders", description: "Receive reminders about upcoming events.", icon: "Calendar", color: "green" },
        { key: "donations", label: "Donation Notifications", description: "Receive updates about recorded donations.", icon: "Gift", color: "orange" }
      ],

      password: {
        current: "",
        newPassword: "",
        confirm: ""
      },
      showCurrent: false,
      showNew: false,
      passwordError: "",

      saving: false,
      toast: { show: false, message: "" },
      confirmState: {
        show: false,
        type: "danger",
        title: "",
        message: "",
        confirmLabel: "",
        onConfirm: () => {}
      }
    };
  },

  computed: {
    activeMenu() {
      return this.menus.find(m => m.id === this.activeSection) || this.menus[0];
    },

    currentModel() {
      // Map section id → reactive data key
      const map = {
        general: "profile",
        account: "account",
        appearance: "appearance",
        notifications: "notifications",
        security: "security",
        preferences: "preferences"
      };
      return this[map[this.activeSection]];
    },

    hasChanges() {
      return this.isDirty(this.activeSection);
    },

    saveMessage() {
      return this.hasChanges
        ? "You have unsaved changes."
        : "All changes saved.";
    },

    passwordStrength() {
      const pw = this.password.newPassword;
      if (!pw) return { level: "", label: "", percent: 0 };

      let score = 0;
      if (pw.length >= 8) score++;
      if (pw.length >= 12) score++;
      if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
      if (/\d/.test(pw)) score++;
      if (/[^a-zA-Z0-9]/.test(pw)) score++;

      const levels = [
        { level: "weak", label: "Weak", percent: 20 },
        { level: "weak", label: "Weak", percent: 20 },
        { level: "fair", label: "Fair", percent: 50 },
        { level: "good", label: "Good", percent: 75 },
        { level: "strong", label: "Strong", percent: 95 },
        { level: "strong", label: "Strong", percent: 100 }
      ];
      return levels[Math.min(score, 5)];
    },

    canChangePassword() {
      return (
        this.password.current &&
        this.password.newPassword.length >= 8 &&
        this.password.newPassword === this.password.confirm
      );
    },

    formattedDate() {
      const now = new Date();
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: this.preferences.timezone,
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }).formatToParts(now);

      const v = {};
      parts.forEach(p => { v[p.type] = p.value; });

      if (this.preferences.dateFormat === "MM/DD/YYYY") {
        return `${v.month}/${v.day}/${v.year}`;
      }
      if (this.preferences.dateFormat === "YYYY-MM-DD") {
        return `${v.year}-${v.month}-${v.day}`;
      }
      return `${v.day}/${v.month}/${v.year}`;
    },

    formattedTime() {
      const now = new Date();
      const opts = {
        timeZone: this.preferences.timezone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: this.preferences.timeFormat === "12-hour"
      };
      return new Intl.DateTimeFormat("en-GB", opts).format(now);
    }
  },

  watch: {
    "appearance.theme"(val) {
      this.$emit("theme-change", val);
      document.documentElement.setAttribute("data-theme", val);
    },
    "appearance.accent"(val) {
      this.$emit("accent-change", val);
      document.documentElement.style.setProperty("--accent", val);
    }
  },

  mounted() {
    // Warn before leaving with unsaved changes
    window.addEventListener("beforeunload", this.handleBeforeUnload);
  },

  beforeUnmount() {
    window.removeEventListener("beforeunload", this.handleBeforeUnload);
    clearTimeout(this._toastTimer);
  },

  methods: {
    isValidEmail(email) {
      if (!email) return true;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    // Compare current section state vs saved snapshot
    isDirty(sectionId) {
      const key = sectionId === "general" ? "profile" : sectionId;
      const current = this[key];
      const saved = this.saved[sectionId === "general" ? "general" : sectionId];
      return JSON.stringify(current) !== JSON.stringify(saved);
    },

    switchSection(id) {
      if (id === this.activeSection) return;

      // Guard: warn if current section has unsaved changes
      if (this.hasChanges) {
        this.openConfirm({
          type: "danger",
          title: "Unsaved changes",
          message: "You have unsaved changes in this section. Switch anyway?",
          confirmLabel: "Discard & switch",
          onConfirm: () => {
            this.revertSection();
            this.activeSection = id;
            this.closeConfirm();
          }
        });
        return;
      }

      this.activeSection = id;
    },

    moveTab(dir) {
      const i = this.menus.findIndex(m => m.id === this.activeSection);
      const next = (i + dir + this.menus.length) % this.menus.length;
      this.switchSection(this.menus[next].id);
      this.$nextTick(() => this.tabRefs[next]?.focus());
    },

    revertSection() {
      const map = {
        general: "profile",
        account: "account",
        appearance: "appearance",
        notifications: "notifications",
        security: "security",
        preferences: "preferences"
      };
      const key = map[this.activeSection];
      const savedKey = this.activeSection === "general" ? "general" : this.activeSection;
      this[key] = clone(this.saved[savedKey]);
    },

    askReset() {
      this.openConfirm({
        type: "danger",
        title: "Reset this section?",
        message: "This will restore default values. Unsaved edits will be lost.",
        confirmLabel: "Reset",
        onConfirm: () => {
          const map = {
            general: "profile",
            account: "account",
            appearance: "appearance",
            notifications: "notifications",
            security: "security",
            preferences: "preferences"
          };
          const key = map[this.activeSection];
          this[key] = clone(DEFAULTS[this.activeSection]);
          this.closeConfirm();
          this.showToast("Section reset to defaults.");
        }
      });
    },

    async saveSettings() {
      if (!this.hasChanges || this.saving) return;

      this.saving = true;

      try {
        // Simulate API call — replace with real fetch/axios
        await new Promise(r => setTimeout(r, 700));

        // Snapshot the current values as the new "saved" state
        const map = {
          general: "profile",
          account: "account",
          appearance: "appearance",
          notifications: "notifications",
          security: "security",
          preferences: "preferences"
        };
        const key = map[this.activeSection];
        this.saved[this.activeSection] = clone(this[key]);

        this.$emit("settings-saved", {
          section: this.activeSection,
          data: clone(this[key])
        });

        this.showToast("Settings updated successfully.");
      } catch (err) {
        this.showToast("Failed to save. Please try again.");
      } finally {
        this.saving = false;
      }
    },

    async changePassword() {
      this.passwordError = "";

      if (this.password.newPassword.length < 8) {
        this.passwordError = "New password must be at least 8 characters.";
        return;
      }
      if (this.password.newPassword !== this.password.confirm) {
        this.passwordError = "Passwords do not match.";
        return;
      }

      // Replace with real backend call
      await new Promise(r => setTimeout(r, 500));

      this.password = { current: "", newPassword: "", confirm: "" };
      this.showToast("Password updated successfully.");
    },

    openConfirm({ type, title, message, confirmLabel, onConfirm }) {
      this.confirmState = {
        show: true,
        type,
        title,
        message,
        confirmLabel,
        onConfirm
      };
    },

    closeConfirm() {
      this.confirmState.show = false;
    },

    cancelConfirm() {
      this.closeConfirm();
    },

    showToast(message) {
      this.toast = { show: true, message };
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        this.toast.show = false;
      }, 3000);
    },

    handleBeforeUnload(e) {
      if (this.hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
  }
};
</script>

<style scoped>
.settings-page {
  --accent: #57409e;
  min-height: 100vh;
  padding: 30px;
  background: #f5f6fb;
  color: #292642;
  font-family: "Inter", "Segoe UI", sans-serif;
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

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #f1ecfd;
  color: #6d4fc4;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* LAYOUT */
.settings-layout {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  align-items: start;
  gap: 22px;
  max-width: 1280px;
  margin: 0 auto;
}

/* SIDEBAR */
.sidebar {
  padding: 20px 14px;
  background: #fff;
  border: 1px solid #ece9f5;
  border-radius: 14px;
  box-shadow: 0 5px 20px rgba(39, 32, 76, 0.04);
  position: sticky;
  top: 20px;
}

.sidebar-head {
  padding: 0 8px 16px;
  border-bottom: 1px solid #f0eef5;
}

.sidebar-head h2 {
  margin: 0 0 5px;
  font-size: 14px;
  font-weight: 800;
  color: #1e1b3a;
}

.sidebar-head p {
  margin: 0;
  font-size: 11px;
  color: #8a879a;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 12px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  min-height: 44px;
  padding: 0 10px;
  border: 1px solid transparent;
  border-radius: 9px;
  background: transparent;
  color: #6a6780;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.menu-item:hover {
  background: #f7f5fc;
  color: #5a3fae;
}

.menu-item.active {
  border-color: #e8e0f8;
  background: #f1ecfd;
  color: #5a3fae;
  font-weight: 700;
}

.menu-icon {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.menu-icon.purple { background: #f1ecfd; color: #6d4fc4; }
.menu-icon.blue { background: #e8f3ff; color: #3b7fc4; }
.menu-icon.green { background: #e5f7ed; color: #2a8b5f; }
.menu-icon.orange { background: #fff1e3; color: #c9803a; }

.menu-item.active .menu-icon {
  background: #e4daf8;
}

.menu-label {
  flex: 1;
}

.menu-arrow {
  color: #a9a2bf;
  flex-shrink: 0;
}

.dirty-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d97726;
  flex-shrink: 0;
}

.sidebar-foot {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin: 20px 0 0;
  padding: 12px;
  background: #f8f6fd;
  border-radius: 9px;
}

.support-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e8e0f8;
  color: #6d4fc4;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sidebar-foot strong {
  display: block;
  color: #55448a;
  font-size: 11px;
  font-weight: 700;
}

.sidebar-foot p {
  margin: 4px 0 0;
  color: #8a879a;
  font-size: 10px;
  line-height: 1.5;
}

/* CONTENT */
.content {
  min-width: 0;
  background: #fff;
  border: 1px solid #ece9f5;
  border-radius: 14px;
  box-shadow: 0 5px 20px rgba(39, 32, 76, 0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* PANEL HEAD */
.panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 26px 28px 22px;
  border-bottom: 1px solid #f0eef5;
}

.panel-head h2 {
  margin: 6px 0 6px;
  font-size: 20px;
  font-weight: 800;
  color: #1e1b3a;
  letter-spacing: -0.3px;
}

.panel-head p {
  margin: 0;
  font-size: 12px;
  color: #8a879a;
  line-height: 1.6;
}

.panel-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.panel-icon.purple { background: #f1ecfd; color: #6d4fc4; }
.panel-icon.blue { background: #e8f3ff; color: #3b7fc4; }
.panel-icon.green { background: #e5f7ed; color: #2a8b5f; }
.panel-icon.orange { background: #fff1e3; color: #c9803a; }

/* FORM SECTIONS */
.form-section {
  padding: 22px 28px;
  border-top: 1px solid #f5f2fa;
}

.form-section:first-of-type {
  border-top: none;
}

.form-section h3 {
  margin: 0 0 5px;
  font-size: 14px;
  font-weight: 800;
  color: #2c2946;
}

.form-section > .desc {
  margin: 0 0 18px;
  font-size: 11px;
  color: #8a879a;
  line-height: 1.6;
}

/* PROFILE BANNER */
.profile-banner {
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 22px 28px 6px;
  padding: 18px;
  background: linear-gradient(110deg, #faf8ff, #fff);
  border: 1px solid #eee9f8;
  border-radius: 12px;
}

.avatar {
  width: 62px;
  height: 62px;
  border-radius: 14px;
  background: linear-gradient(135deg, #6f56b0, #3d2d72);
  color: #fff;
  font-size: 26px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #fff;
  box-shadow: 0 4px 12px rgba(75, 53, 130, 0.18);
  flex-shrink: 0;
}

.profile-info h3 {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 800;
  color: #2c2946;
}

.profile-info p {
  margin: 0 0 8px;
  font-size: 11px;
  color: #8a879a;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 700;
  color: #2a8b5f;
}

.status-pill .dot,
.status-text .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2a8b5f;
}

/* ACCOUNT CARD */
.account-card {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 22px 28px 6px;
  padding: 16px;
  background: #fcfbfe;
  border: 1px solid #ece9f5;
  border-radius: 12px;
}

.avatar-circle {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7055b1, #443080);
  color: #fff;
  font-size: 22px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.account-info {
  flex: 1;
  min-width: 0;
}

.account-info h3 {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 800;
}

.account-info p {
  margin: 0 0 8px;
  font-size: 11px;
  color: #8a879a;
  overflow-wrap: anywhere;
}

.role-badge {
  display: inline-block;
  padding: 4px 9px;
  border-radius: 5px;
  background: #f1ecfd;
  color: #5a3fae;
  font-size: 10px;
  font-weight: 700;
}

.verified-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 10px;
  border-radius: 20px;
  background: #e5f7ed;
  color: #2a8b5f;
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;
}

/* FORM GRID */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 18px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
}

.field.full {
  grid-column: 1 / -1;
}

.field label {
  font-size: 11px;
  font-weight: 700;
  color: #403b59;
}

.field input,
.field textarea,
.field select {
  width: 100%;
  padding: 11px 13px;
  border: 1px solid #e4e1ef;
  border-radius: 9px;
  background: #fbfafe;
  color: #1e1b3a;
  font-family: inherit;
  font-size: 12px;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  outline: none;
}

.field textarea {
  min-height: 90px;
  resize: vertical;
  line-height: 1.6;
}

.field input:focus,
.field textarea:focus,
.field select:focus {
  border-color: #8b6fdb;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(139, 111, 219, 0.12);
}

.field input:disabled {
  background: #f1f0f5;
  color: #89869a;
  cursor: not-allowed;
}

.field input::placeholder,
.field textarea::placeholder {
  color: #adabbe;
}

.field-error {
  color: #c9464b;
  font-size: 10px;
  font-weight: 500;
}

.field-hint {
  color: #9794a5;
  font-size: 10px;
  line-height: 1.5;
}

/* THEME GRID */
.theme-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  max-width: 520px;
}

.theme-card {
  padding: 8px;
  border: 1px solid #e7e4f0;
  border-radius: 11px;
  background: #fff;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.theme-card.selected {
  border: 2px solid #6d4fc4;
  padding: 7px;
  box-shadow: 0 0 0 3px rgba(109, 79, 196, 0.1);
}

.theme-preview {
  display: flex;
  gap: 6px;
  height: 100px;
  padding: 9px;
  border-radius: 7px;
  overflow: hidden;
}

.theme-preview.light { background: #f0eff6; }
.theme-preview.dark { background: #242238; }

.preview-sidebar {
  width: 23%;
  border-radius: 3px;
}

.light .preview-sidebar { background: #57409e; }
.dark .preview-sidebar { background: #514477; }

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 7px;
  flex: 1;
  padding-top: 3px;
}

.preview-line {
  width: 55%;
  height: 6px;
  border-radius: 5px;
}

.light .preview-line { background: #c6c1d7; }
.dark .preview-line { background: #67627c; }

.preview-card {
  flex: 1;
  border-radius: 4px;
}

.light .preview-card { background: #fff; border: 1px solid #e4e1ec; }
.dark .preview-card { background: #343148; border: 1px solid #3c3954; }

.preview-card.small { flex: 0.6; }

.theme-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 11px 3px 3px;
  font-size: 11px;
  font-weight: 700;
  color: #4b4663;
}

.radio-indicator {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid #d5d0e0;
  flex-shrink: 0;
}

.theme-card.selected .radio-indicator {
  border: 5px solid #6d4fc4;
}

/* COLOR GRID */
.color-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.color-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  padding: 5px;
  border: 1px solid transparent;
  border-radius: 9px;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
}

.color-option.selected {
  border-color: #ddd4f2;
  background: #faf8ff;
}

.color-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-option small {
  font-size: 10px;
  color: #79758d;
  font-weight: 600;
}

/* ROW */
.row {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 14px 0;
  border-bottom: 1px solid #f0eef5;
  min-width: 0;
}

.row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.row > div:first-child:not(.row-icon) {
  flex: 1;
  min-width: 0;
}

.row.with-icon {
  align-items: flex-start;
}

.row strong {
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: 700;
  color: #2c2946;
}

.row p {
  margin: 0;
  font-size: 11px;
  color: #8a879a;
  line-height: 1.5;
}

.row-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.row-icon.purple { background: #f1ecfd; color: #6d4fc4; }
.row-icon.blue { background: #e8f3ff; color: #3b7fc4; }
.row-icon.green { background: #e5f7ed; color: #2a8b5f; }
.row-icon.orange { background: #fff1e3; color: #c9803a; }

.row-text {
  flex: 1;
  min-width: 0;
}

/* TOGGLE */
.toggle {
  position: relative;
  width: 38px;
  height: 22px;
  padding: 3px;
  border: none;
  border-radius: 20px;
  background: #d8d6e0;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s;
}

.toggle span {
  display: block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s;
}

.toggle.on {
  background: #6d4fc4;
}

.toggle.on span {
  transform: translateX(16px);
}

/* NOTICE */
.notice {
  display: flex;
  gap: 10px;
  margin: 22px 28px;
  padding: 14px;
  border-radius: 10px;
  align-items: flex-start;
  font-size: 11px;
  line-height: 1.6;
}

.notice.blue {
  background: #f4f9ff;
  border: 1px solid #e6effb;
  color: #3b7fc4;
}

.notice.blue p {
  color: #5a7ea3;
  margin: 0;
}

.notice.green {
  background: #f3fbf6;
  border: 1px solid #d9eee2;
  color: #2a8b5f;
}

.notice.green strong {
  display: block;
  color: #2a8b5f;
  font-size: 11px;
  margin-bottom: 3px;
}

.notice.green p {
  color: #5a8a70;
  margin: 0;
}

/* PASSWORD FORM */
.password-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 500px;
}

.pw-wrap {
  display: flex;
  align-items: center;
  border: 1px solid #e4e1ef;
  border-radius: 9px;
  background: #fbfafe;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.pw-wrap:focus-within {
  border-color: #8b6fdb;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(139, 111, 219, 0.12);
}

.pw-wrap input {
  flex: 1;
  border: none;
  background: transparent;
  box-shadow: none;
  padding: 11px 13px;
}

.pw-wrap input:focus {
  border: none;
  box-shadow: none;
  background: transparent;
}

.pw-wrap button {
  border: none;
  background: transparent;
  color: #6d4fc4;
  font-family: inherit;
  font-size: 11px;
  font-weight: 700;
  padding: 0 12px;
  cursor: pointer;
}

.strength {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.strength-bar {
  height: 4px;
  background: #f0eef5;
  border-radius: 3px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s, background 0.3s;
}

.strength-fill.weak { background: #c9464b; }
.strength-fill.fair { background: #c9803a; }
.strength-fill.good { background: #3b7fc4; }
.strength-fill.strong { background: #2a8b5f; }

.strength small {
  font-size: 10px;
  font-weight: 700;
}

.strength small.weak { color: #c9464b; }
.strength small.fair { color: #c9803a; }
.strength small.good { color: #3b7fc4; }
.strength small.strong { color: #2a8b5f; }

.form-error {
  margin: 0;
  color: #c9464b;
  font-size: 11px;
  font-weight: 500;
}

.btn-secondary {
  align-self: flex-start;
  padding: 10px 18px;
  border: 1px solid #e1d9f1;
  border-radius: 9px;
  background: #f4f0fc;
  color: #5a3fae;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-secondary:hover:not(:disabled) {
  background: #eae2fa;
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* SESSION */
.session-card {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 15px;
  background: #fcfbfe;
  border: 1px solid #eae8f1;
  border-radius: 10px;
}

.session-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f1ecfd;
  color: #6d4fc4;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.session-info {
  flex: 1;
  min-width: 0;
}

.session-info strong {
  font-size: 12px;
  font-weight: 700;
  color: #2c2946;
}

.session-info p {
  margin: 3px 0 5px;
  font-size: 10px;
  color: #8a879a;
}

.status-text {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 700;
  color: #2a8b5f;
}

.session-label {
  padding: 6px 9px;
  border-radius: 5px;
  background: #e5f7ed;
  color: #2a8b5f;
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;
}

/* PREVIEW BOX */
.preview-box {
  margin: 0 28px 22px;
  padding: 16px;
  background: #f9f7fe;
  border: 1px solid #e9e2f8;
  border-radius: 10px;
}

.preview-label {
  display: block;
  margin-bottom: 8px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #8c7bb7;
}

.preview-box strong {
  display: block;
  font-size: 18px;
  color: #45336e;
  font-weight: 800;
}

.preview-box p {
  margin: 5px 0 0;
  font-size: 11px;
  color: #8a879a;
}

/* SAVE BAR */
.save-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 13px;
  padding: 14px 28px;
  border-top: 1px solid #eeecf4;
  background: rgba(255, 255, 255, 0.98);
  position: sticky;
  bottom: 0;
}

.save-msg {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #6a6780;
  font-weight: 500;
}

.save-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #2a8b5f;
}

.save-dot.dirty {
  background: #d97726;
}

.save-actions {
  display: flex;
  gap: 9px;
}

.btn-ghost,
.btn-primary,
.btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 16px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}

.btn-ghost {
  border: 1px solid #e4e1ef;
  background: #fff;
  color: #5c5a72;
}

.btn-ghost:hover:not(:disabled) {
  background: #f7f5fd;
}

.btn-primary {
  border: 1px solid #6d4fc4;
  background: #6d4fc4;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #5a3fae;
  transform: translateY(-1px);
}

.btn-danger {
  border: 1px solid #c9464b;
  background: #c9464b;
  color: #fff;
}

.btn-danger:hover:not(:disabled) {
  background: #a83a3f;
}

.btn-ghost:disabled,
.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.spin {
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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
  background: rgba(20, 14, 40, 0.6);
  backdrop-filter: blur(6px);
}

.modal {
  width: 100%;
  max-width: 420px;
  padding: 28px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 20px 60px rgba(20, 15, 40, 0.3);
  outline: none;
  text-align: center;
}

.modal-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  margin: 0 auto 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-icon.danger {
  background: #fff0ef;
  color: #c9464b;
}

.modal-icon.info {
  background: #f4f9ff;
  color: #3b7fc4;
}

.modal h3 {
  margin: 0 0 8px;
  font-size: 17px;
  font-weight: 800;
  color: #1e1b3a;
}

.modal p {
  margin: 0 0 22px;
  font-size: 13px;
  color: #6a6780;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* TOAST */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1100;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 13px 18px;
  background: #1e5e46;
  color: #e8fff5;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 12px 32px rgba(20, 12, 46, 0.22);
  max-width: 380px;
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

/* RESPONSIVE */
@media (max-width: 1050px) {
  .settings-layout {
    grid-template-columns: 220px minmax(0, 1fr);
    gap: 16px;
  }
  .panel-head { padding: 22px; }
  .form-section { padding: 20px 22px; }
  .profile-banner, .account-card { margin-left: 22px; margin-right: 22px; }
  .notice { margin-left: 22px; margin-right: 22px; }
  .save-bar { padding: 14px 22px; }
  .preview-box { margin-left: 22px; margin-right: 22px; }
}

@media (max-width: 760px) {
  .settings-page { padding: 20px; }
  .settings-layout { grid-template-columns: 1fr; }
  .sidebar { position: static; }
  .menu { flex-direction: row; flex-wrap: wrap; }
  .menu-item { width: auto; flex: 1; min-width: 130px; }
  .menu-arrow { display: none; }
  .sidebar-foot { display: none; }
}

@media (max-width: 620px) {
  .settings-page { padding: 14px; }
  .page-header { flex-direction: column; align-items: flex-start; }
  .page-header h1 { font-size: 24px; }
  .panel-head { padding: 20px; }
  .form-section { padding: 18px 20px; }
  .form-grid { grid-template-columns: 1fr; }
  .field.full { grid-column: auto; }
  .theme-grid { grid-template-columns: 1fr; max-width: none; }
  .profile-banner, .account-card { margin-left: 20px; margin-right: 20px; flex-wrap: wrap; }
  .notice { margin-left: 20px; margin-right: 20px; }
  .preview-box { margin-left: 20px; margin-right: 20px; }
  .save-bar {
    flex-direction: column;
    align-items: stretch;
    padding: 14px 20px;
  }
  .save-actions { display: flex; }
  .save-actions button { flex: 1; justify-content: center; }
  .modal-actions { flex-direction: column-reverse; }
  .modal-actions button { width: 100%; justify-content: center; }
  .toast { bottom: 16px; right: 16px; left: 16px; max-width: none; }
}

@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
</style>