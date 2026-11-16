
<template>
  <div class="app">

    <aside class="sidebar">

      <div class="logo">
        <img
          src="@/assets/images/real logo.png"
          alt="College Logo"
        >

        <div class="logo-text">
          <p>COLLEGE DE BETHEL/APARUDE</p>
          <small>Teaching for Eternity</small>
        </div>
      </div>

      <div class="user-dashboard">

        <div class="dashboard-title">
          <span>MAIN MENU</span>
          <div></div>
        </div>

        <div class="routes">

          <router-link
            v-for="router in routers"
            :key="router.id"
            :to="router.path"
            class="route-link"
          >

            <component
              :is="router.icon"
              class="route-icon"
              :size="18"
              :stroke-width="1.8"
            />

            <span>{{ router.name }}</span>

          </router-link>

        </div>

        <!-- LOGOUT -->
        <button class="button1" @click="logout">

          <LogOut
            :size="17"
            :stroke-width="1.8"
          />

          <span>Logout</span>

        </button>

        <div class="bible-verse">

          <div class="verse-icon">
            ✦
          </div>

          <small>
            "Let the word of Christ dwell in you richly..."
          </small>

          <span>
            — Colossians 3:16
          </span>

        </div>

      </div>

    </aside>

    <main class="main-content">
      <router-view />
    </main>

  </div>
</template>


<script>
import {
  House,
  Info,
  GraduationCap,
  UsersRound,
  Settings,
  LogOut
} from "lucide-vue-next";

export default {

  name: "DashboardView",

  components: {
    House,
    Info,
    GraduationCap,
    UsersRound,
    Settings,
    LogOut
  },

  data() {

    return {

      routers: [
        {
          id: 1,
          path: "/home",
          name: "Home",
          icon: House
        },

        {
          id: 2,
          path: "/about",
          name: "About",
          icon: Info
        },

        {
          id: 3,
          path: "/question",
          name: "question",
          icon: GraduationCap
        },

        {
          id: 4,
          path: "/media",
          name: "media",
          icon: UsersRound
        },

        {
          id: 5,
          path: "/settings",
          name: "Settings",
          icon: Settings
        }
      ]

    };

  },

  methods: {

    logout() {

      localStorage.removeItem("user");

      this.$router.push("/login");

    }

  }

};
</script>


<style>

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
}

.app {
  min-height: 100vh;
}

.sidebar {
  width: 280px;
  min-height: 100vh;

  background: linear-gradient(
    180deg,
    #11102f 0%,
    #1e1b4b 48%,
    #151338 100%
  );

  color: #e0e7ff;

  display: flex;
  flex-direction: column;

  position: fixed;

  top: 0;
  left: 0;
  bottom: 0;

  z-index: 100;

  overflow-y: auto;

  border-right: 1px solid rgba(255, 255, 255, 0.08);

  box-shadow:
    8px 0 30px
    rgba(15, 23, 42, 0.18);
}

.logo {

  min-height: 88px;

  display: flex;
  align-items: center;

  padding: 16px 18px;

  border-bottom:
    1px solid
    rgba(255, 255, 255, 0.08);
}

.logo img {

  width: 65px;
  height: 65px;
  border-radius: 100%;
  object-fit: cover;
  flex-shrink: 0;
  border:
    1px solid
    rgba(196, 181, 253, 0.55);
}

.logo-text {
  padding-left: 12px;
}

.logo-text p {

  color: #ffffff;

  font-size: 12px;

  font-weight: 800;

  line-height: 1.45;
}

.logo-text small {

  display: block;

  margin-top: 4px;

  color: #a5b4fc;

  font-size: 10px;
}

.user-dashboard {

  padding: 25px 16px 20px;
}

.dashboard-title {

  display: flex;
  align-items: center;

  gap: 10px;

  padding: 0 8px;

  margin-bottom: 13px;
}

.dashboard-title span {

  color: #818cf8;

  font-size: 10px;

  font-weight: 800;

  letter-spacing: 1.5px;
}

.dashboard-title div {

  height: 1px;

  flex: 1;

  background:
    rgba(255, 255, 255, 0.1);
}

.routes {

  display: flex;

  flex-direction: column;

  gap: 5px;
}

.route-link {

  position: relative;

  display: flex;
  align-items: center;

  gap: 12px;

  width: 100%;

  min-height: 46px;

  padding: 0 13px;

  border-radius: 10px;

  text-decoration: none;

  color: #a5b4fc;

  border: 1px solid transparent;

  font-size: 13px;

  font-weight: 600;

  transition: all 0.2s ease;
}

.route-icon {
  color: #a5b4fc;
}

.route-link:hover {

  color: #ffffff;

  background:
    rgba(124, 58, 237, 0.18);

  transition: all 0.2s ease;

  transform: translateY(-2px);
}

.route-link.router-link-active {

  color: #ffffff;

  background: linear-gradient(
    90deg,
    rgba(124, 58, 237, 0.8),
    rgba(109, 40, 217, 0.55)
  );

  box-shadow:
    0 6px 18px
    rgba(76, 29, 149, 0.25);
}

.button1 {

  width: 100%;

  min-height: 43px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  margin-top: 18px;

  border:
    1px solid
    rgba(251, 113, 133, 0.16);

  border-radius: 10px;

  background:
    rgba(190, 25, 67, 0.12);

  color: #fda4af;

  cursor: pointer;

  font-size: 12px;

  font-weight: 700;
}

.button1:hover {

  background:
    rgba(190, 25, 67, 0.28);

  color: #ffffff;

  transform: translateY(-2px);

  transition: all 0.2s ease;
}

.bible-verse {

  margin-top: 25px;

  padding: 15px;

  border:
    1px solid
    rgba(255, 255, 255, 0.07);

  border-radius: 12px;

  background:
    rgba(255, 255, 255, 0.035);
}

.verse-icon {

  width: 27px;
  height: 27px;

  display: flex;

  align-items: center;
  justify-content: center;

  margin-bottom: 9px;

  border-radius: 8px;

  background:
    rgba(196, 181, 253, 0.1);

  color: #c4b5fd;
}

.bible-verse small {

  display: block;

  color: #c7d2fe;

  font-size: 10px;

  line-height: 1.6;

  font-style: italic;
}

.bible-verse span {

  display: block;

  margin-top: 7px;

  color: #818cf8;

  font-size: 9px;

  font-weight: 700;
}

.main-content {

  margin-left: 280px;

  width: calc(100% - 280px);

  min-height: 100vh;
}

@media (max-width: 768px) {

  .sidebar {
    width: 240px;
  }

  .main-content {

    margin-left: 240px;

    width: calc(100% - 240px);
  }

}

</style>