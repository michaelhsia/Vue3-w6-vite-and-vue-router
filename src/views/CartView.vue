<template>
  <h1>
    購物車列表
  </h1>
  <!-- 用 store 存起來 -->
  <VueLoading :active='isLoading' />
  <table class='table align-middle'>
    <thead>
      <tr>
        <th></th>
        <th>品名</th>
        <th>數量/單位</th>
        <th>單價</th>
        <th>小計</th>
      </tr>
    </thead>
    <tbody>
      <!-- item.id 與 item.product.id 不同，刪除購物車應該是用 cartId -->
      <tr v-for='item in carts' :key='item.title'>
        <td width='50'>
          <a class='link-success link-opacity-10-hover' @click='delSingleCart(item.id)'><span class='material-icons'>
              close </span></a>
        </td>
        <td width='100'>{{ item.product.title }}</td>
        <td width='100'>
          <div class='input-group'>
            <input type='number' class='form-control border-success' aria-label='Amount (to the nearest dollar)'
              :value='item.qty' @change='(evt) => updateCartProduct(item.id, item.product.id, evt)' />
            <span class='input-group-text bg-success text-white border-success'>{{ item.product.unit }}</span>
          </div>
        </td>
        <td width='50'>{{ `$ ${item.product.price} ` }}</td>
        <!-- 可能要用 product 跑 forEach 把對應的 cart 的 id 比對後，做數量增減 -->
        <td width='50' class='text-end'>
          {{ `$ ${item.final_total} ` }}
        </td>
      </tr>
    </tbody>
    <tfoot>
      <template v-if='carts.length !== 0'>
        <tr>
          <td colspan='2'>
            <button type='button' class='btn btn-outline-danger' @click='delAllCart'>
              清除購物車
            </button>
          </td>
          <td colspan='2' class='text-end'>總計</td>
          <td class='text-end'>{{ `$ ${total} ` }}</td>
        </tr>
      </template>
      <template v-else>
        <p class='text-secondary p-2'>請先將商品加入購物車</p>
      </template>
    </tfoot>
  </table>
  <!-- 驗證表單 -->
  <VForm ref='form' v-slot='{ errors }' @submit='submitOrder'>
    <div class='mb-3'>
      <label for='email' class='form-label'>Email</label>
      <VField id='email' name='email' type='email' class='form-control' :class="{ 'is-invalid': errors['email'] }"
        rules='email|required' v-model='form.data.user.email' placeholder='請輸入 Email'></VField>
      <ErrorMessage name='email' class='invalid-feedback'></ErrorMessage>
    </div>
    <div class='mb-3'>
      <label for='name' class='form-label'>收件人姓名</label>
      <VField id='name' name='姓名' type='text' class='form-control' :class="{ 'is-invalid': errors['姓名'] }"
        rules='required' v-model='form.data.user.name' placeholder='請輸入姓名'></VField>
      <ErrorMessage name='姓名' class='invalid-feedback'></ErrorMessage>
    </div>
    <div class='mb-3'>
      <label class='form-label' for='tel'>收件人電話</label>
      <VField id='tel' name='電話' type='tel' class='form-control' :class="{ 'is-invalid': errors['電話'] }" :rules='isPhone'
        v-model='form.data.user.tel' placeholder='請輸入電話'>
      </VField>
      <ErrorMessage name='電話' class='invalid-feedback'></ErrorMessage>
    </div>
    <div class='mb-3'>
      <label class='form-label' for='address'>收件人地址</label>
      <VField id='address' name='地址' type='text' class='form-control' :class="{ 'is-invalid': errors['地址'] }"
        rules='required' v-model='form.data.user.address' placeholder='請輸入地址'>
      </VField>
      <ErrorMessage name='地址' class='invalid-feedback'></ErrorMessage>
    </div>
    <div class='mb-3'>
      <label for='message' class='form-label'>留言</label>
      <!-- 用 as 可以讓 textarea 套用 VField 驗證 -->
      <VField id='message' name='留言' class='form-control' :class="{ 'is-invalid': errors['留言'] }"
        rules='required|min:10|max:250' rows='10' v-model='form.data.message' as='textarea'></VField>
      <ErrorMessage name='留言' class='invalid-feedback'></ErrorMessage>
    </div>
    <div class='text-end'>
      <button type='submit' class='btn btn-success'>送出訂單</button>
    </div>
  </VForm>
</template>

<script>
// sweetalert
import Swal from 'sweetalert2'

const { VITE_URL, VITE_PATH } = import.meta.env

export default {
  data () {
    return {
      // 購物車資料
      carts: [],

      // 表單 post 資訊
      form: {
        data: {
          user: {
            name: '',
            email: '',
            tel: '',
            address: ''
          },
          message: ''
        }
      }
    }
  },
  methods: {
    // product 物件為所有商品中的某一項，點擊查看更多後，會把 product 賦予給 detailProduct，再透過 props 傳到 detailModal，進而渲染 detailModal 介面
    openModal (product) {
      this.detailProduct = product
      this.$refs.detailModal.openModal()
    },
    getCart () {
      this.axios
        .get(`${VITE_URL}/api/${VITE_PATH}/cart`)
        .then((res) => {
          this.carts = res.data.data.carts
        })
        .catch((err) => {
          Swal.fire({
            title: `${err.response.data.message}`,
            icon: 'warning',
            showConfirmButton: false,
            timer: 1500
          })
        })
    },
    delSingleCart (cartId) {
      this.axios
        .delete(`${VITE_URL}/api/${VITE_PATH}/cart/${cartId}`)
        .then((res) => {
          setTimeout(() => {
            Swal.fire({
              title: `${res.data.message}`,
              icon: 'success',
              showConfirmButton: false,
              timer: 1500
            })
          }, 1200)

          this.getCart()
        })
        .catch((err) => {
          Swal.fire({
            title: `${err.response.data.message}`,
            icon: 'warning',
            showConfirmButton: false,
            timer: 1500
          })
        })
    },
    delAllCart () {
      this.axios
        .delete(`${VITE_URL}/api/${VITE_PATH}/carts`)
        .then((res) => {
          setTimeout(() => {
            Swal.fire({
              title: `${res.data.message}`,
              icon: 'success',
              showConfirmButton: false,
              timer: 1500
            })
          }, 1200)

          this.getCart()
        })
        .catch((err) => {
          Swal.fire({
            title: `${err.response.data.message}`,
            icon: 'warning',
            showConfirmButton: false,
            timer: 1500
          })
        })
    },
    // 表單電話驗證
    isPhone (value) {
      const phoneNumber = /^(09)[0-9]{8}$/
      return phoneNumber.test(value) ? true : '需要正確的電話號碼'
    },
    // 提交訂單後會自動清空購物車
    submitOrder () {
      this.axios
        .post(`${VITE_URL}/api/${VITE_PATH}/order`, this.form)
        .then((res) => {
          //   用 ref 抓取表單 DOM，在提交成功後清空表單
          this.$refs.form.resetForm()

          setTimeout(() => {
            Swal.fire({
              title: `${res.data.message}`,
              icon: 'success',
              showConfirmButton: false,
              timer: 1500
            })
          }, 1200)
        })
        .catch((err) => {
          Swal.fire({
            title: `${err.response.data.message}`,
            icon: 'warning',
            showConfirmButton: false,
            timer: 1500
          })
        })
    }
  },
  computed: {
    total () {
      return this.carts.reduce(
        (finalTotal, current) => finalTotal + current.final_total,
        0
      )
    }
  },
  mounted () {
    this.getCart()
  }
}
</script>

<style></style>
