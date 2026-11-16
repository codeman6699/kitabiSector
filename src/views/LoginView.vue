<template>
  <div class="login-page">

    <div class="side1">
      <!-- Add logo image here -->
      <h4>College de Bethel/APARUDE</h4>
      <small>Educating for Eternity</small>

      <p>
        Welcome to the official portal. Please sign in with your
        registered email address to access your dashboard.
      </p>

      <p>
        New here? Click "Create Account" to register as a User,
        Pastor, or Admin.
      </p>
    </div>

    <div class="side2" v-if="showLogin">

      <p>Role</p>
      <select v-model="form.role">
        <option value="">Select role</option>
        <option value="user">User</option>
        <option value="pastor">Pastor</option>
        <option value="admin">Admin</option>
      </select>

      <p>Email</p>
      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        v-model="form.email"
        autocomplete="email"
      >

      <p>Password</p>
      <input
        type="password"
        name="password"
        placeholder="Enter your password"
        v-model="form.password"
        autocomplete="current-password"
      >

      <button @click="login">Sign in</button>

      <div class="switch-section">
        <p>Don't have an account?</p>
        <button @click="showLogin = false" class="switch-button">
          Create Account
        </button>
      </div>

    </div>

    <div class="side22" v-if="!showLogin">

      <p>Role</p>
      <select v-model="form.role">
        <option value="">Select role</option>
        <option value="user">User</option>
        <option value="pastor">Pastor</option>
        <option value="admin">Admin</option>
      </select>

      <p>Name</p>
      <input
        type="text"
        name="name"
        placeholder="Enter your name"
        v-model="form.name"
        autocomplete="name"
      >

      <p>Email</p>
      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        v-model="form.email"
        autocomplete="email"
      >

      <p>Password</p>
      <input
        type="password"
        name="password"
        placeholder="Enter your password"
        v-model="form.password"
        autocomplete="new-password"
      >

      <button @click="createAccount">Create Account</button>

      <div class="switch-section">
        <p>Already have an account?</p>
        <button @click="showLogin = true" class="switch-button">
          Sign in
        </button>
      </div>

    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginView",

  data() {
    return {
      showLogin: true,
      form: {
        name: "",
        email: "",
        password: "",
        role: ""
      }
    };
  },

  methods: {
    login() {
      if (!this.form.email || !this.form.password || !this.form.role) {
        alert("Please select a role and enter your email and password");
        return;
      }

      axios
        .post("http://localhost:3000/login", {
          email: this.form.email,
          password: this.form.password,
          role: this.form.role
        })
        .then((res) => {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          alert(res.data.message);
          this.$router.push("/dashboard");
        })
        .catch((error) => {
          if (error.response) {
            alert(error.response.data.message);
          } else {
            alert("Cannot connect to backend");
          }
        });
    },

    createAccount() {
      if (
        !this.form.name ||
        !this.form.email ||
        !this.form.password ||
        !this.form.role
      ) {
        alert("Please fill in all fields");
        return;
      }

      const data = {
        name: this.form.name,
        email: this.form.email,
        password: this.form.password,
        role: this.form.role
      };

      axios
        .post("http://localhost:3000/insert", data)
        .then((res) => {
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: res.data.id,
              name: this.form.name,
              email: this.form.email,
              role: this.form.role
            })
          );

          alert("Account created successfully!");

          this.form.name = "";
          this.form.email = "";
          this.form.password = "";
          this.form.role = "";

          this.$router.push("/dashboard");
        })
        .catch((error) => {
          if (error.response) {
            alert(error.response.data.message);
          } else {
            alert("Cannot connect to backend");
          }
        });
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

.login-page {
  color: #1e293b;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 0;
  padding: 20px;
  min-height: 100vh;
  padding-top: 10vh;
}

.side1 {
  background: linear-gradient(145deg, #312e81 0%, #7c3aed 50%, #a855f7 100%);
  padding: 20px;
  height: 40ch;
  width: 40ch;
  overflow-y: auto;
  overflow-x: hidden;
  text-align: center;
  color: white;
  box-shadow: 0 10px 30px rgba(79, 70, 229, 0.35);
  border-radius: 18px 0 0 18px;
  flex-shrink: 0;
}

.side1 h4 {
  color: #ffffff;
  margin-top: 20px;
  font-size: 18px;
}

.side1 small {
  color: #ddd6fe;
}

.side1 p {
  padding: 5px;
  margin-top: 30px;
  color: #ede9fe;
  line-height: 1.5;
}

.side2,
.side22 {
  background: linear-gradient(145deg, #ffffff 0%, #f5f3ff 100%);
  padding: 20px;
  height: 40ch;
  width: 40ch;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 0 10px 30px rgba(79, 70, 229, 0.20);
  border-radius: 0 18px 18px 0;
  flex-shrink: 0;
}

.side2 p,
.side22 p {
  padding: 10px;
  font-size: small;
  margin-top: 5px;
  color: #475569;
  font-weight: 600;
}

.side2 input,
.side22 input,
.side2 select,
.side22 select {
  padding: 10px;
  width: 100%;
  margin-top: 10px;
  border-radius: 8px;
  border: 1px solid #c4b5fd;
  background: #faf5ff;
  color: #1e293b;
  outline: none;
}

.side2 input:focus,
.side22 input:focus,
.side2 select:focus,
.side22 select:focus {
  border: 1px solid #7c3aed;
  box-shadow: 0 0 8px rgba(124, 58, 237, 0.25);
}

.side2 > button,
.side22 > button {
  padding: 8px;
  width: 100%;
  margin-top: 15px;
  border-radius: 8px;
  border: 1px solid #7c3aed;
  background: linear-gradient(90deg, #7c3aed, #9333ea);
  color: white;
  cursor: pointer;
  font-weight: 600;
}

.side2 > button:hover,
.side22 > button:hover {
  background: linear-gradient(90deg, #6d28d9, #7e22ce);
  box-shadow: 0 5px 12px rgba(124, 58, 237, 0.3);
}

.switch-section {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
}

.switch-section p {
  padding: 5px;
  margin: 0;
  color: #64748b;
}

.switch-section .switch-button {
  padding: 5px;
  margin: 2px;
  margin-top: 10px;
  border-radius: 8px;
  border: 1px solid #7c3aed;
  font-size: small;
  width: 20ch;
  background: #7c3aed;
  color: white;
  cursor: pointer;
}

.side1::-webkit-scrollbar,
.side2::-webkit-scrollbar,
.side22::-webkit-scrollbar {
  width: 7px;
}

.side1::-webkit-scrollbar-track,
.side2::-webkit-scrollbar-track,
.side22::-webkit-scrollbar-track {
  background: transparent;
}

.side1::-webkit-scrollbar-thumb,
.side2::-webkit-scrollbar-thumb,
.side22::-webkit-scrollbar-thumb {
  background: rgba(124, 58, 237, 0.45);
  border-radius: 10px;
}

.side1::-webkit-scrollbar-thumb:hover,
.side2::-webkit-scrollbar-thumb:hover,
.side22::-webkit-scrollbar-thumb:hover {
  background: #7c3aed;
}

@media (max-width: 850px) {
  .login-page {
    padding-top: 5vh;
  }

  .side1,
  .side2,
  .side22 {
    width: 40ch;
    height: 40ch;
  }
}

@media (max-width: 700px) {
  .login-page {
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
  }

  .side1 {
    border-radius: 18px 18px 0 0;
  }

  .side2 {
    border-radius: 0 0 18px 18px;
  }

  .side22 {
    border-radius: 18px;
  }
}

@media (max-width: 450px) {
  .login-page {
    padding: 10px;
  }

  .side1,
  .side2,
  .side22 {
    width: 100%;
    max-width: 40ch;
  }

  .switch-section {
    flex-wrap: wrap;
  }
}
</style>