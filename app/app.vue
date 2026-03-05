<template>
  <v-app>
    <v-container class="main-container">
      <NuxtLayout />
    </v-container>
  </v-app>
</template>

<style>
@media (min-width: 1800px) {
  .main-container {
    padding: 2rem 13rem;
  }
}

@media (min-width: 1200px) and (max-width: 1799px) {
  .main-container {
    padding: 2rem 7rem;
  }
}

@media (min-width: 900px) and (max-width: 1199px) {
  .main-container {
    padding: 2rem 3rem;
  }
}

@media (min-width: 600px) and (max-width: 899px) {
  .main-container {
    padding: 1rem 2rem;
  }
}
</style>
