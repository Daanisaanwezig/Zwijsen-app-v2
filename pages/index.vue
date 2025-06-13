<script setup>
import Header from "~/components/Header.vue";
import Button from "~/components/Button.vue";
</script>

<template>
  <div class="page">
    <Header>Home</Header>
    <div class="page-content">
      <div class="home-container">
        <div class="welcome-section">
          <h2 class="welcome-heading">Welkom bij</h2>
          <div class="logo-container">
            <img src="../public/logo.svg" alt="Logo" class="logo" />
          </div>
          <p class="body-text">Scan je toetsen en bekijk je resultaten</p>
        
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
  padding: 24px;
}

.home-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 500px;
  margin: 0 auto;
  width: 100%;
  padding: 16px 0;
}

.welcome-section {
  text-align: center;
  padding-top: 16px; /* Reduced from 32px for better vertical centering */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.welcome-heading {
  font-family: var(--font-heading);
  font-size: 36px;
  font-weight: 700;
  color: var(--md-sys-color-primary);
  margin: 0 0 16px; /* Reduced from 24px for tighter spacing with logo */
  letter-spacing: -0.5px;
}

.logo-container {
  margin: -4px 0 20px; /* Adjusted from 24px to 20px */
}

.logo {
  max-width: 150px;
  height: auto;
}

.body-text {
  font-size: 18px;
  margin: 0 0 36px; /* Increased from 32px for more space before buttons */
  opacity: 0.8;
  max-width: 320px;
}

.home-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 320px;
}
</style>
