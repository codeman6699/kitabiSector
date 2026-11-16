
<template>
  <div class="portfolio">
    <header class="site-header">
      <div class="navbar">
        <a href="#home" class="brand">
          <div class="mark">KS</div>
          <div class="brand-name">
            KITABI SECTOR
            <small>DIGITAL PORTFOLIO</small>
          </div>
        </a>

        <nav class="links">
          <a href="#home" class="active">Home</a>
          <a href="#about">About</a>
          <a href="#administration">Administration</a>
          <a href="#services">Services</a>
          <a href="#dashboard">Dashboards</a>
          <a href="#sectors">Sectors</a>
          <a href="#news">Media Center</a>
          <a href="#research">Research</a>
          <a href="#contact">Contact</a>
        </nav>

        <div class="nav-tools">
          <div class="search-box">
            <span>⌕</span>
            <input type="search" placeholder="Search anything..." />
          </div>

          <button class="icon-btn" aria-label="Language">🌐</button>
          <button class="icon-btn" aria-label="Display theme">☼</button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <section class="hero" id="home">
        <div class="hero-overlay"></div>

        <div class="hero-content">
          <span class="eyebrow">WELCOME TO</span>
          <h1>Kitabi Sector</h1>
          <h3>Nyamagabe District, Southern Province, Rwanda</h3>

          <p>
            Discover the beauty, opportunities, and achievements of Kitabi
            Sector. A land of green hills, culture, innovation, and sustainable
            development.
          </p>

          <div class="hero-buttons">
            <a href="#about" class="btn-primary">Explore Kitabi <span>→</span></a>
            <a href="#dashboard" class="btn-secondary">View Dashboard <span>▥</span></a>
          </div>

          <div class="hero-note">
            <span class="live-dot"></span>
            Discover our community, services and opportunities
          </div>
        </div>

        <aside class="map-card">
          <div class="map-heading">
            <div>
              <h3>Kitabi Sector</h3>
              <span>Community Overview</span>
            </div>
            <span class="map-symbol">⌖</span>
          </div>

          <div class="map-visual">
            <svg viewBox="0 0 320 270" role="img" aria-label="Decorative map illustration of a green region">
              <defs>
                <linearGradient id="mapFill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#164b29"/>
                  <stop offset="100%" stop-color="#071d13"/>
                </linearGradient>
              </defs>
              <path d="M145 12 L174 25 203 18 222 39 255 45 278 76 301 94 287 119 299 146 276 164 266 191 235 198 218 231 191 218 165 251 139 233 111 244 89 221 65 227 47 204 23 187 34 159 19 137 42 115 37 89 62 72 83 51 111 57 127 34Z"
                fill="url(#mapFill)" stroke="#80df70" stroke-width="1.7" stroke-linejoin="round"/>
              <g fill="none" stroke="#6eb66a" stroke-width="0.8" opacity=".65">
                <path d="M46 115 L93 124 111 57"/>
                <path d="M93 124 L127 160 174 25"/>
                <path d="M127 160 L89 221"/>
                <path d="M127 160 L218 231"/>
                <path d="M127 160 L203 130 278 76"/>
                <path d="M203 130 L235 198"/>
                <path d="M165 251 L165 190 203 130"/>
                <path d="M42 175 L127 160 191 218"/>
              </g>
              <g fill="#e8ffe5" stroke="#1d7434" stroke-width="2">
                <circle cx="83" cy="78" r="4"/>
                <circle cx="222" cy="109" r="4"/>
                <circle cx="164" cy="144" r="4"/>
                <circle cx="82" cy="191" r="4"/>
                <circle cx="213" cy="205" r="4"/>
              </g>
              <g fill="#f4fff4" font-size="10" font-weight="600">
                <text x="89" y="76">Kagano</text>
                <text x="229" y="106">Uwingugu</text>
                <text x="171" y="141">Mukungu</text>
                <text x="89" y="188">Mujuga</text>
                <text x="220" y="202">Shyaba</text>
              </g>
            </svg>
          </div>

          <div class="map-footer">
            <span><span class="live-dot"></span> Kitabi, Rwanda</span>
            <a href="#sectors">Explore area ↗</a>
          </div>
        </aside>
      </section>

      <section class="statistics" id="dashboard">
        <article class="stat-card">
          <span class="stat-icon">♟</span>
          <div><span class="stat-label">Population</span><h2>94,732</h2><small>People</small></div>
        </article>
        <article class="stat-card">
          <span class="stat-icon">▦</span>
          <div><span class="stat-label">Cells</span><h2>5</h2><small>Administrative cells</small></div>
        </article>
        <article class="stat-card">
          <span class="stat-icon">⌂</span>
          <div><span class="stat-label">Villages</span><h2>53</h2><small>Imidugudu</small></div>
        </article>
        <article class="stat-card">
          <span class="stat-icon">♙</span>
          <div><span class="stat-label">Employees</span><h2>236</h2><small>Public servants</small></div>
        </article>
        <article class="stat-card">
          <span class="stat-icon">▧</span>
          <div><span class="stat-label">Projects</span><h2>68</h2><small>Development projects</small></div>
        </article>
        <article class="stat-card">
          <span class="stat-icon">◔</span>
          <div><span class="stat-label">Budget</span><h2>5.2B <small>RWF</small></h2><small>Total budget</small></div>
        </article>
        <article class="stat-card">
          <span class="stat-icon">▥</span>
          <div><span class="stat-label">Revenue</span><h2>3.1B <small>RWF</small></h2><small>Total revenue</small></div>
        </article>
        <article class="stat-card">
          <span class="stat-icon">↗</span>
          <div><span class="stat-label">Expenditure</span><h2>2.4B <small>RWF</small></h2><small>Total expenditure</small></div>
        </article>
      </section>

      <section class="dashboard-grid">
        <article class="panel" id="announcements">
          <div class="panel-heading">
            <h3><span class="heading-icon">◈</span> Announcements</h3>
            <a href="#announcements">View all ↗</a>
          </div>

          <a href="#announcements" class="announcement-item">
            <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=120&q=80" alt="Community gathering"/>
            <div><h4>Community Clean-Up Campaign</h4><small>May 15, 2024</small></div>
            <span class="status-dot"></span>
          </a>
          <a href="#announcements" class="announcement-item">
            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=120&q=80" alt="Tree planting"/>
            <div><h4>Tree Planting Season</h4><small>May 10, 2024</small></div>
            <span class="status-dot"></span>
          </a>
          <a href="#announcements" class="announcement-item">
            <img src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=120&q=80" alt="Local event"/>
            <div><h4>Tourism Week Celebration</h4><small>May 5, 2024</small></div>
            <span class="status-dot"></span>
          </a>
          <a href="#announcements" class="announcement-item">
            <img src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=120&q=80" alt="Community meeting"/>
            <div><h4>Public Budget Meeting</h4><small>April 28, 2024</small></div>
            <span class="status-dot"></span>
          </a>
        </article>

        <article class="panel" id="news">
          <div class="panel-heading">
            <h3>Latest News</h3>
            <a href="#news">View all ↗</a>
          </div>

          <a href="#news" class="featured-news">
            <img src="https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=650&q=85" alt="Public building"/>
            <div class="featured-caption">
              <h4>Community Infrastructure and Development</h4>
              <small>May 12, 2024</small>
            </div>
          </a>

          <a href="#news" class="news-item">
            <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=140&q=80" alt="Institution building"/>
            <div><h4>Education and Skills Development in Kitabi</h4><small>May 8, 2024</small></div>
          </a>
          <a href="#news" class="news-item">
            <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=140&q=80" alt="Forest"/>
            <div><h4>Promoting Sustainable Tourism and Nature</h4><small>May 3, 2024</small></div>
          </a>
        </article>

        <article class="panel" id="sectors">
          <div class="panel-heading">
            <h3>Environment & Attractions</h3>
            <a href="#sectors">View all ↗</a>
          </div>

          <div class="attraction-grid">
            <a href="#sectors" class="attraction-card">
              <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80" alt="Lush forest"/>
              <span>Nyungwe National Park</span>
            </a>
            <a href="#sectors" class="attraction-card">
              <img src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400&q=80" alt="Green hills and water"/>
              <span>Natural Landscapes</span>
            </a>
            <a href="#sectors" class="attraction-card">
              <img src="https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=400&q=80" alt="Waterfall"/>
              <span>Waterfalls & Nature</span>
            </a>
            <a href="#sectors" class="attraction-card">
              <img src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&q=80" alt="Architecture"/>
              <span>Local Culture & Heritage</span>
            </a>
          </div>
        </article>

        <article class="panel" id="services">
          <div class="panel-heading">
            <h3>Quick Services</h3>
            <a href="#services">View all ↗</a>
          </div>

          <div class="service-grid">
            <a href="#services" class="service-card"><span>▣</span><small>Certificates</small></a>
            <a href="#services" class="service-card"><span>▤</span><small>Documents</small></a>
            <a href="#services" class="service-card"><span>▧</span><small>Forms</small></a>
            <a href="#services" class="service-card"><span>♙</span><small>Complaints</small></a>
            <a href="#services" class="service-card"><span>▣</span><small>Projects</small></a>
            <a href="#services" class="service-card"><span>◔</span><small>Budget Info</small></a>
            <a href="#services" class="service-card"><span>▥</span><small>Statistics</small></a>
            <a href="#services" class="service-card"><span>?</span><small>FAQs</small></a>
          </div>
        </article>
      </section>

      <section class="info-footer">
        <div><span class="footer-icon">☁</span><p><strong>18°C</strong><small>Cloudy</small></p></div>
        <div><span class="footer-icon">♣</span><p><strong>Nyungwe National Park</strong><small>Nature & biodiversity</small></p></div>
        <div><span class="footer-icon">▲</span><p><strong>Elevation</strong><small>Highland landscape</small></p></div>
        <div><span class="footer-icon">♧</span><p><strong>Natural Resources</strong><small>Water & forests</small></p></div>
        <div><span class="footer-icon">♠</span><p><strong>Protected Forest</strong><small>Conservation</small></p></div>
        <div><span class="footer-icon">♧</span><p><strong>Tea Production</strong><small>Agricultural economy</small></p></div>
      </section>

      <footer class="site-footer" id="contact">
        <a href="#home" class="footer-brand">KS <span>KITABI SECTOR</span></a>
        <p>Digital Portfolio · Nyamagabe District, Rwanda</p>
        <a href="#home">Back to top ↑</a>
      </footer>
    </main>
  </div>
</template>

<script>
export default {
  name: "KitabiDashboard"
};
</script>

<style>
* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: 80px;
}

html,
body,
#app {
  width: 100%;
  min-height: 100%;
  margin: 0;
  padding: 0;
}

body {
  overflow-x: hidden;
  background: #03140b;
  color: #f4fff6;
  font-family: Inter, "Segoe UI", Arial, sans-serif;
}

a {
  color: inherit;
}

.portfolio {
  width: 100%;
  min-height: 100vh;
  background: #03140b;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  border-bottom: 1px solid rgba(113, 206, 128, .16);
  background: rgba(3, 20, 18, .88);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
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
  border: 1px solid rgba(120, 224, 128, .55);
  border-radius: 50%;
  background: linear-gradient(145deg, #36d58c, #087c4c);
  color: #04170c;
  font-weight: 900;
  font-size: 17px;
  box-shadow: 0 0 18px rgba(46, 201, 105, .17);
}

.brand-name {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 16px;
  font-weight: 800;
  white-space: nowrap;
}

.brand-name small {
  color: #a9c5b0;
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
}

.links a {
  padding: 10px 8px;
  border-bottom: 2px solid transparent;
  color: #d5e3d8;
  font-size: 11px;
  text-decoration: none;
  white-space: nowrap;
  transition: color .2s, border-color .2s;
}

.links a:hover,
.links a.active {
  color: #7cdd79;
  border-bottom-color: #42c965;
}

.nav-tools {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 185px;
  padding: 8px 12px;
  border: 1px solid rgba(179, 216, 185, .25);
  border-radius: 30px;
  background: rgba(255, 255, 255, .045);
}

.search-box span {
  color: #a6d9ac;
  font-size: 19px;
}

.search-box input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: white;
  font-size: 10px;
}

.search-box input::placeholder {
  color: #b2c2b6;
}

.icon-btn {
  display: grid;
  place-items: center;
  width: 35px;
  height: 35px;
  border: 1px solid rgba(179, 216, 185, .14);
  border-radius: 50%;
  background: rgba(255, 255, 255, .045);
  color: white;
  cursor: pointer;
}



.hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 35px;
  min-height: 390px;
  padding: 38px 4.3%;
  background-image: url("https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1920&q=90");
  background-size: cover;
  background-position: center 48%;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(0, 13, 5, .83), rgba(0, 17, 8, .38) 65%, rgba(0, 13, 5, .64));
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 590px;
}

.eyebrow {
  font-size: 21px;
  font-weight: 700;
}

.hero-content h1 {
  margin: 7px 0;
  font-size: clamp(42px, 5.2vw, 76px);
  line-height: 1.06;
  letter-spacing: -2.5px;
}

.hero-content h3 {
  margin: 12px 0 20px;
  color: #80d979;
  font-size: clamp(13px, 1.45vw, 19px);
  font-weight: 600;
}

.hero-content p {
  max-width: 430px;
  color: #e2ebe2;
  font-size: 14px;
  line-height: 1.8;
}

.hero-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 25px;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 17px;
  min-height: 40px;
  padding: 11px 20px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  transition: transform .2s, background .2s;
}

.btn-primary {
  background: #278b40;
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  background: #36a750;
}

.btn-secondary {
  border: 1px solid rgba(255, 255, 255, .3);
  background: rgba(0, 17, 8, .45);
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, .12);
}

.hero-note {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 23px;
  color: #c5d9c9;
  font-size: 10px;
}

.live-dot,
.status-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #74d776;
  flex-shrink: 0;
}

.map-card {
  position: relative;
  z-index: 1;
  width: 31%;
  min-width: 270px;
  padding: 18px;
  border: 1px solid rgba(178, 222, 172, .22);
  border-radius: 12px;
  background: rgba(3, 20, 11, .68);
  box-shadow: 0 15px 35px rgba(0, 0, 0, .23);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
}

.map-heading,
.map-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.map-heading h3 {
  margin: 0 0 5px;
  font-size: 15px;
}

.map-heading div > span {
  color: #7ddd78;
  font-size: 11px;
}

.map-symbol {
  color: #82db78;
  font-size: 26px;
}

.map-visual {
  margin: 8px 0;
}

.map-visual svg {
  display: block;
  width: 100%;
  max-height: 245px;
}

.map-footer {
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, .1);
  color: #c1d4c3;
  font-size: 10px;
}

.map-footer > span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.map-footer a {
  color: #85df7c;
  text-decoration: none;
}

.statistics {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  gap: 7px;
  padding: 0 4.3%;
}

.stat-card {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  min-width: 0;
  padding: 17px 10px;
  border: 1px solid rgba(155, 198, 140, .2);
  border-radius: 9px;
  background: linear-gradient(145deg, rgba(30, 54, 31, .8), rgba(5, 23, 12, .85));
}

.stat-icon {
  color: #55b75b;
  font-size: 25px;
  font-weight: 700;
}

.stat-card > div {
  min-width: 0;
}

.stat-label {
  font-size: 11px;
  white-space: nowrap;
}

.stat-card h2 {
  margin: 8px 0 5px;
  font-size: clamp(16px, 1.45vw, 23px);
  white-space: nowrap;
}

.stat-card h2 small {
  font-size: 9px;
}

.stat-card div > small {
  color: #b5c6b7;
  font-size: 9px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1.05fr 1.08fr 1.02fr;
  gap: 12px;
  padding: 15px 4.3% 18px;
}

.panel {
  min-width: 0;
  padding: 14px;
  border: 1px solid rgba(151, 194, 130, .23);
  border-radius: 9px;
  background: rgba(6, 27, 14, .91);
}

.panel-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
}

.panel-heading h3 {
  margin: 0;
  font-size: 13px;
}

.heading-icon {
  color: #80d975;
}

.panel-heading > a {
  color: #7fdb77;
  font-size: 10px;
  text-decoration: none;
  white-space: nowrap;
}

.announcement-item,
.news-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 0;
  border-bottom: 1px solid rgba(255, 255, 255, .065);
  text-decoration: none;
}

.announcement-item:last-child,
.news-item:last-child {
  border-bottom: 0;
}

.announcement-item img {
  width: 52px;
  height: 42px;
  border-radius: 5px;
  object-fit: cover;
}

.announcement-item > div,
.news-item > div {
  flex: 1;
  min-width: 0;
}

.announcement-item h4,
.news-item h4 {
  margin: 0 0 5px;
  font-size: 10px;
  font-weight: 500;
  line-height: 1.45;
}

.announcement-item small,
.news-item small,
.featured-caption small {
  color: #a9baac;
  font-size: 9px;
}

.featured-news {
  position: relative;
  display: block;
  height: 150px;
  overflow: hidden;
  border-radius: 6px;
  text-decoration: none;
}

.featured-news > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.featured-caption {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 28px 11px 10px;
  background: linear-gradient(transparent, rgba(0, 10, 4, .95));
}

.featured-caption h4 {
  margin: 0 0 5px;
  font-size: 12px;
  line-height: 1.4;
}

.news-item img {
  width: 55px;
  height: 39px;
  border-radius: 4px;
  object-fit: cover;
}

.attraction-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.attraction-card {
  position: relative;
  height: 119px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, .08);
  border-radius: 6px;
  text-decoration: none;
}

.attraction-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .3s;
}

.attraction-card:hover img {
  transform: scale(1.05);
}

.attraction-card span {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 22px 8px 8px;
  background: linear-gradient(transparent, rgba(0, 10, 4, .95));
  font-size: 10px;
  line-height: 1.4;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 9px;
}

.service-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 94px;
  padding: 8px 3px;
  border: 1px solid rgba(151, 194, 130, .18);
  border-radius: 8px;
  background: rgba(35, 61, 37, .42);
  text-align: center;
  text-decoration: none;
  transition: background .2s, border-color .2s;
}

.service-card:hover {
  border-color: #4eb85b;
  background: rgba(45, 105, 49, .42);
}

.service-card span {
  color: #74c878;
  font-size: 25px;
  font-weight: 700;
}

.service-card small {
  font-size: 9px;
}

.info-footer {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
  padding: 18px 4.3%;
  border-top: 1px solid rgba(151, 194, 130, .2);
  border-bottom: 1px solid rgba(151, 194, 130, .15);
  background: rgba(0, 15, 7, .65);
}

.info-footer > div {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-width: 0;
  padding: 5px;
  border-right: 1px solid rgba(151, 194, 130, .12);
}

.info-footer > div:last-child {
  border-right: 0;
}

.footer-icon {
  color: #75c978;
  font-size: 25px;
}

.info-footer p {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
  margin: 0;
}

.info-footer strong {
  font-size: 10px;
}

.info-footer small {
  color: #b5c4b7;
  font-size: 9px;
}

.site-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 18px 4.3%;
  color: #a9bcae;
  font-size: 10px;
}

.site-footer p {
  margin: 0;
}

.footer-brand {
  color: #78d77a;
  font-weight: 900;
  text-decoration: none;
}

.footer-brand span {
  margin-left: 6px;
  color: #dcebe0;
  font-size: 10px;
}

.site-footer > a:last-child {
  color: #80d979;
  text-decoration: none;
}

@media (min-width: 1600px) {
  .navbar,
  .hero,
  .statistics,
  .dashboard-grid,
  .info-footer,
  .site-footer {
    padding-left: max(4.3%, calc((100% - 1600px) / 2));
    padding-right: max(4.3%, calc((100% - 1600px) / 2));
  }
}

@media (max-width: 1250px) {
  .navbar {
    gap: 12px;
  }

  .links {
    gap: 0;
  }

  .links a {
    padding: 10px 5px;
    font-size: 10px;
  }

  .search-box {
    width: 145px;
  }

  .statistics {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .dashboard-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .stat-card h2 {
    font-size: 21px;
  }
}

@media (max-width: 850px) {
  .navbar {
    flex-wrap: wrap;
    padding: 10px 18px;
  }

  .links {
    order: 3;
    flex-basis: 100%;
    justify-content: flex-start;
    overflow-x: auto;
  }

  .links a {
    padding: 9px 10px;
    font-size: 11px;
  }

  .nav-tools {
    margin-left: auto;
  }

  .hero {
    align-items: stretch;
    gap: 25px;
    padding: 35px 22px;
  }

  .map-card {
    width: 38%;
    min-width: 225px;
    padding: 13px;
  }

  .map-visual svg {
    min-height: 175px;
  }

  .statistics {
    padding: 0 15px;
  }

  .dashboard-grid {
    padding: 15px;
  }

  .info-footer {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    padding: 15px;
  }
}

@media (max-width: 600px) {
  .brand-name {
    font-size: 13px;
  }

  .search-box {
    width: 125px;
  }

  .hero {
    flex-direction: column;
    padding: 38px 18px 22px;
  }

  .hero-content h1 {
    font-size: 48px;
    letter-spacing: -1.5px;
  }

  .hero-content h3 {
    line-height: 1.5;
  }

  .hero-content p {
    font-size: 13px;
  }

  .map-card {
    width: 100%;
    min-width: 0;
  }

  .map-visual svg {
    max-height: 230px;
  }

  .statistics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    padding: 12px;
  }

  .stat-card {
    padding: 15px 10px;
  }

  .stat-card h2 {
    font-size: 20px;
  }

  .dashboard-grid {
    grid-template-columns: minmax(0, 1fr);
    padding: 5px 12px 15px;
  }

  .panel {
    padding: 14px;
  }

  .attraction-card {
    height: 145px;
  }

  .service-card {
    min-height: 88px;
  }

  .info-footer {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .info-footer > div {
    justify-content: flex-start;
    border-right: 0;
    border-bottom: 1px solid rgba(151, 194, 130, .1);
  }

  .site-footer {
    flex-wrap: wrap;
    padding: 18px;
  }
}

@media (max-width: 360px) {
  .nav-tools {
    gap: 4px;
  }

  .search-box {
    width: 110px;
  }

  .icon-btn {
    width: 30px;
    height: 30px;
  }

  .hero-content h1 {
    font-size: 40px;
  }

  .stat-icon {
    font-size: 21px;
  }

  .stat-label {
    font-size: 10px;
  }

  .stat-card h2 {
    font-size: 17px;
  }
}
</style>
