<template>
  <div class="container py-3">
    <h1>前台</h1>
    <nav class="mb-3">
      <RouterLink to="/">首頁</RouterLink> |
      <RouterLink to="/about">關於我們</RouterLink> |
      <RouterLink to="/products">產品列表</RouterLink> |
      <RouterLink to="/cart">購物車</RouterLink> |
      <RouterLink to="/login">登入</RouterLink> |
      <RouterLink to="/admin">後台首頁</RouterLink>
    </nav>
    <RouterView />
  </div>
</template>

<script></script>

<style></style>
