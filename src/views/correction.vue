// home components codes 
<template>
  <div class="home">

    <div class="header">

      <div class="hero">

        <div class="hero1">
          <p>Building minds,</p>
          <span>strengthening character</span>
        </div>

        <div class="hero2">
          <p>
            "Train up a child in the way he should go;
            even when he is old he will not depart from it."
            — Proverbs 22:6
          </p>
        </div>

        <div class="hero3">
          <p>
            Collège de Béthel is a faith-centred school
            community in Rwanda, forming students in
            academics, character, and eternity-minded
            conviction.
          </p>
        </div>

        <div class="hero4">
          <button @click="ShowLearn =true">Learn More</button>
          <button>Contact Us</button>
        </div>
<div v-if="ShowLearn" style="display: flex; width: 30ch; height: 20ch; background: whitesmoke; border: 1px solid #2f2f2f; border-radius: 12px; padding: 20px; text-align: center; justify-content: center; align-items: center; margin-left: 30ch;">
  <p>waguan learn more yakunze klv</p>
</div>

        <div class="numbers">
          <div>
            <h3>1,500+</h3>
            <p>Students</p>
          </div>
          <diV>
            <h3>50+</h3>
            <p>Teachers</p>
          </diV>
          <div>
            <h3>98%</h3>
            <p>Pass Rate</p>
          </div>

        </div>

      </div>

      <div class="side">

        <img
          src="@/assets/images/WIN_20260802_16_47_55_Pro.jpg"
          alt="Béthel Campus"
        >

        <div class="campus-overlay">
          <p class="p1">Béthel Campus, Main Chapel</p>
        </div>

        <div class="join1">

          <p>Week of Prayer</p>

          <h2>May 18 – 24, 2025</h2>

          <small>
            Theme: "Seeking God Together"
          </small>

          <button>Join Us</button>

        </div>

      </div>

    </div>

    <div class="home-features">

      <div class="feature-card">
        <h3>Academic Excellence</h3>
        <p>
          Developing students through strong
          academic foundations and meaningful learning.
        </p>
      </div>

      <div class="feature-card">
        <h3>Character Building</h3>
        <p>
          Helping students develop responsibility,
          discipline, integrity, and strong character.
        </p>
      </div>

      <div class="feature-card">
        <h3>Faith & Community</h3>
        <p>
          Building a Christ-centred community
          focused on faith, service, and eternity.
        </p>
      </div>

    </div>

    <div class="bible-verse">

      <p>
        "Let the word of Christ dwell in you richly..."
      </p>

      <span>
        — Colossians 3:16
      </span>

    </div>

  </div>
</template>

<script>
export default {
  name: "HomeView",
  data() {
    return{
    ShowLearn: false,
    }
  },
  methods: {
    Learn() {
         this.$router.push("/about");
      }
    }

  }

</script>

<style>
* {
  box-sizing: border-box;
}

.home {
  width: 100%;
  min-height: 100vh;
  padding: 35px;
  background:
    radial-gradient(
      circle at 85% 10%,
      rgba(124, 58, 237, 0.08),
      transparent 30%
    ),
    radial-gradient(
      circle at 10% 90%,
      rgba(99, 102, 241, 0.06),
      transparent 30%
    ),
    #fafaff;
  color: #312e81;
}

.header {
  width: 100%;
  min-height: 430px;
  display: flex;
  flex-direction: row;
  position: relative;
}

.hero {
  width: 55%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 20px;
}

.hero1 {
  width: auto;
}

.hero1 p {
  margin: 0;
  color: #312e81;
  font-size: 42px;
  font-weight: 800;
  line-height: 1.1;
}

.hero1 span {
  display: block;
  color: #7c3aed;
  font-size: 42px;
  font-weight: 800;
  line-height: 1.1;
}

.hero2 {
  width: 60ch;
  color: #4c1d95;
  font-size: 15px;
  line-height: 1.7;
}

.hero2 p {
  margin: 0;
}

.hero3 {
  width: 50ch;
  color: #475569;
  font-size: 14px;
  line-height: 1.7;
}

.hero3 p {
  margin: 0;
}

.hero4 {
  display: flex;
  gap: 10px;
}

.hero4 button {
  width: 20ch;
  padding: 10px;
  background: #312e81;
  color: #ffffff;
  border: 1px solid #312e81;
  border-radius: 12px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.hero4 button:hover {
  background: #4c1d95;
  transform: translateY(-2px);
}

.side {
  width: 45%;
  height: 300px;
  position: absolute;
  top: 0;
  right: 0;
  background: #312e81;
  border-radius: 15px;
  overflow: visible;
  box-shadow: 0 15px 35px rgba(49, 46, 129, 0.18);
}

.side img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
}

.campus-overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 15px;
  border-radius: 0 0 15px 15px;
  background: linear-gradient(
    transparent,
    rgba(17, 16, 47, 0.9)
  );
}

.p1 {
  margin: 0;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
}

.join1 {
  width: 250px;
  min-height: 200px;
  position: absolute;
  right: -30px;
  bottom: -115px;
  padding: 20px;
  background: linear-gradient(145deg,#4c1d95,#7c3aed);
  border-radius: 14px;
  color: #ffffff;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}
.join1:hover{
  transform: translateY(-10px);
   transition: all 0.2s ease;
}

.join1 p {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 700;
}

.join1 h2 {
  margin-bottom: 10px;
  color: #ddd6fe;
  font-size: 15px;
}

.join1 small {
  display: block;
  padding: 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #ede9fe;
  font-size: 10px;
  line-height: 1.5;
}

.join1 button {
  width: 100%;
  margin-top: 12px;
  padding: 9px;
  border: none;
  border-radius: 8px;
  background: #ffffff;
  color: #4c1d95;
  cursor: pointer;
  font-size: 11px;
  font-weight: 800;
}

.join1 button:hover {
  background: #f5f3ff;
}

.home-features {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 70px;
}

.feature-card {
  min-height: 160px;
  padding: 25px;
  border: 1px solid #e9d5ff;
  border-radius: 15px;
  background: #ffffff;
  color: #312e81;
  transition: all 0.2s ease;
  box-shadow: 0 5px 20px rgba(49, 46, 129, 0.05);
}

.feature-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(124, 58, 237, 0.12);
}

.feature-card h3 {
  margin-bottom: 10px;
  color: #4c1d95;
  font-size: 16px;
}

.feature-card p {
  color: #64748b;
  font-size: 12px;
  line-height: 1.7;
}

.bible-verse {
  width: 100%;
  margin-top: 25px;
  padding: 25px;
  border-radius: 15px;
  background: #f5f3ff;
  border: 1px solid #ddd6fe;
  text-align: center;
}

.bible-verse p {
  color: #4c1d95;
  font-size: 14px;
  font-style: italic;
}

.bible-verse span {
  display: block;
  margin-top: 8px;
  color: #7c3aed;
  font-size: 11px;
  font-weight: 700;
}

@media (max-width: 1100px) {
  .hero {
    width: 50%;
  }

  .hero1 p,
  .hero1 span {
    font-size: 34px;
  }

  .side {
    width: 42%;
  }
}

@media (max-width: 850px) {
  .home {
    padding: 20px;
  }

  .header {
    min-height: auto;
    flex-direction: column;
    gap: 80px;
  }

  .hero {
    width: 100%;
  }

  .hero2,
  .hero3 {
    width: 100%;
  }

  .side {
    position: relative;
    top: auto;
    right: auto;
    width: 100%;
  }

  .home-features {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero1 p,
  .hero1 span {
    font-size: 30px;
  }
}
.numbers{
  margin: 20px;
  display: flex;
  flex-direction: row;
  gap: 40px;
}
.numbers div{
  padding: 10px;
  border: 1px solid #4c1d95;
  border-radius: 12px;
  text-align: center;
}
.numbers h3{
  margin: 0;
  color: #312e81;
  font-size: 22px;
  font-weight: 800;
  line-height: 1.1;
}
.numbers div:hover{
  transform: translateY(-10px);
   transition: all 0.2s ease;
}
</style>