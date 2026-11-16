
import { createRouter, createWebHistory } from "vue-router";


import HomeKitabi from "@/kitabi/HomeKitabi.vue";
import AboutKitabi from "@/kitabi/AboutKitabi.vue";
import AdministrationKitabi from "@/kitabi/AdministrationKitabi.vue";
import ServicesKitabi from "@/kitabi/ServicesKitabi.vue";
import DashboardsKitabi from "@/kitabi/DashboardsKitabi.vue";
import MediaKitabi from "@/kitabi/MediaKitabi.vue";
import ResearchKitabi from "@/kitabi/ResearchKitabi.vue";
import ContactKitabi from "@/kitabi/ContactKitabi.vue";

/*
 import LoginView from "../views/LoginView.vue";
import HomeView from "../views/HomeView.vue";
import AboutView from "@/views/AboutView.vue";
import QuestionView from "@/views/QuestionView.vue";
import MediaView from "@/views/MediaView.vue";
import SettingsView from "@/views/SettingsView.vue"; */


const routes = [

  { path: "/", name: "home", component: HomeKitabi},
  { path: "/about", name: "about", component: AboutKitabi},
  { path: "/administration", name: "administration", component: AdministrationKitabi},
  { path: "/services", name: "services", component: ServicesKitabi},
  { path: "/dashboards", name: "dashboards", component: DashboardsKitabi},
  { path: "/news", name: "news", component: MediaKitabi},
  { path: "/research", name: "research", component: ResearchKitabi},
  { path: "/contact", name: "contact", component: ContactKitabi}
] 

/*
  const routes = [


  { path: "/login", name: "login", component: LoginView},
  { path: "/", name: "home", component: HomeView},
  { path: "/about", name: "about", component: AboutView},
  { path: "/question", name: "question", component: QuestionView},
  { path: "/media", name: "media", component: MediaView},
  { path: "/settings", name: "settings", component: SettingsView}

    
]; 
*/
const router = createRouter({

  history: createWebHistory(),

 routes

});

export default router;
