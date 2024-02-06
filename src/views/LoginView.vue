<template>
<div class="container pt-5">
  <h1 class="text-center mb-3">請先登入</h1>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-3">
      <form>
        <div class="form-floating mb-3">
          <input
            type="email"
            class="form-control"
            id="floatingInput"
            placeholder="請輸入電子郵件"
            v-model="user.username"
          />
          <label for="floatingInput">帳號</label>
        </div>
        <div class="form-floating mb-3">
          <input
            type="password"
            class="form-control"
            id="floatingPassword"
            placeholder="請輸入密碼"
            v-model="user.password"
          />
          <label for="floatingPassword">密碼</label>
        </div>
        <!-- 點擊觸發 loginPost -->
        <button
          type="button"
          class="w-100 h-25 btn btn-success"
          @click="loginPost"
        >
          登入
        </button>
      </form>
    </div>
  </div>
</div>
</template>

<script>

import Swal from 'sweetalert2'

const { VITE_URL } = import.meta.env

export default {
  data () {
    return {
    // 名稱必須跟六角 API 相同才能成功請求
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    loginPost () {
      this.axios
        .post(`${VITE_URL}/admin/signin`, this.user)
        .then((res) => {
          // 把回傳的 token 及 expired timestamp 用解構賦值方式存成同名變數
          const { token, expired } = res.data

          // 把 token 及 expired 存到 cookie
          document.cookie = `hexToken=${token}; expires=${new Date(expired)}`

          // 登入成功通知
          Swal.fire({
            title: '登入成功',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })

          // 把資料存到 cookie 後，頁面導到商品頁
          // 用 setTimeout 等通知跑完再跳商品頁
          setTimeout(() => (location.href = '/admin'), 1500)
        })
        .catch((err) => {
          // 加入登入失敗的通知
          Swal.fire({
            title: `${err.response.data.message}`,
            text: '請重新輸入帳號、密碼',
            icon: 'warning',
            showConfirmButton: false,
            timer: 1000
          })

          // 登入失敗時清空欄位重新填寫
          this.user.username = ''
          this.user.password = ''
        })
    }
  }
}

</script>
