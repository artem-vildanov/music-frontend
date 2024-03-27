<template>
  <header>
    <nav class="navbar bg-body-tertiary">
      <ul class="navbar-nav">
        <li class="nav-item">
          <RouterLink class="nav-link active" to="/">Home</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link active" to="/login">Login</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link active" to="/signup">Signup</RouterLink>
        </li>
      </ul>      
    </nav>
  </header>

  <RouterView />
</template>

<style scoped></style>
