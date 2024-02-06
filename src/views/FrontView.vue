<template>
    <h2>前台</h2>
    <nav>
        <RouterLink to="/">首頁</RouterLink> |
        <RouterLink to="/about">關於我們</RouterLink> |
        <RouterLink to="/products">產品列表</RouterLink> |
        <RouterLink to="/cart">購物車</RouterLink> |
        <RouterLink to="/login">登入</RouterLink> |
        <RouterLink to="/admin">後台首頁</RouterLink>
    </nav>
    <RouterView />
</template>
