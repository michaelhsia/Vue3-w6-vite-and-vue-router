<template>
  <h2>後台</h2>
  <nav>
    <RouterLink to='/admin/products'>產品列表</RouterLink> |
    <RouterLink to='/admin/order'>訂單列表</RouterLink> |
    <RouterLink to='/'>回到前台</RouterLink>
  </nav>
  <RouterView />
</template>

<script>
import Swal from 'sweetalert2'
import axios from 'axios'

const { VITE_URL } = import.meta.env

export default {
  // 直接在後台 RouterView 做登入驗證
  methods: {
    checkUser () {
      this.axios
        .post(`${VITE_URL}/api/user/check`)
        // 有登入就抓取外部資料渲染畫面
        .then((res) => console.log(res.data))
        .catch((err) => {
          // 未登入的提醒
          Swal.fire({
            title: `${err.response.data.message}`,
            icon: 'warning',
            showConfirmButton: false,
            timer: 1000
          })

          // 觸發 backToLogin
          this.$router.push('../login')
        })
    }
  },
  mounted () {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    )

    axios.defaults.headers.common.Authorization = token

    this.checkUser()
  }
}

</script>

<style></style>
