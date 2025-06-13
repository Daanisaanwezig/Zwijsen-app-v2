<script setup>
import Header from "~/components/Header.vue";
import Button from "~/components/Button.vue";
</script>

<template>
  <div class="page">
    <Header>Home</Header>
    <div class="page-content">
      <div class="home-container">
        <div class="home-logo">
          <img src="../public/logo.svg" alt="Logo" class="logo" />
        </div>
        <div class="welcome-text">
          <h1 class="header__title">Welkom bij de Scan App</h1>
          <p class="body-text">Scan je toetsen en bekijk je resultaten</p>
        </div>
        <div class="home-buttons">
          <Button 
            type="primary" 
            fullWidth 
            @click="$router.push('/scan')"
          >
            Scan toetsen
          </Button>
          <Button 
            type="secondary" 
            fullWidth 
            @click="$router.push('/scans')"
          >
            Bekijk eerdere scans
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: var(--spacing-lg);
}

.home-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 500px;
  margin: 0 auto;
  width: 100%;
}

.home-logo {
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-md);
}

.logo {
  max-width: 150px;
  height: auto;
}

.welcome-text {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  
  h1 {
    margin: 0 0 var(--spacing-xs);
    font-size: 24px;
  }
  
  p {
    margin: 0;
    opacity: 0.8;
  }
}

.home-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}
</style>
