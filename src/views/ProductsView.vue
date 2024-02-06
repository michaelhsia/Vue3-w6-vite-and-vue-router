<template>
  <h1>產品列表</h1>
  <VueLodaing :active='isLoading' />
  <table class='table align-middle'>
    <thead>
      <tr>
        <th width='100' scope='col'>圖片</th>
        <th width='100' scope='col'>商品名稱</th>
        <th width='100' scope='col'>價格</th>
        <th width='200' scope='col'>編輯</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for='product in products' :key='product.id'>
        <td>
          <img :src='product.imageUrl' :alt='product.title'
            class='table-img rounded-circle obj-fit-cover obj-position-center' />
        </td>
        <td>{{ product.title }}</td>
        <td>
          <span class='text-decoration-line-through me-2'>{{ `原價 $ ${product.origin_price} 元` }}</span><span
            class='text-danger'>{{ `特價 $ ${product.price} 元` }}</span>
        </td>
        <td>
          <div class='btn-group' role='group' aria-label='Basic example'>
            <!-- 點擊查看更多按鈕時，會把對應商品「物件」作為參數傳到資料中賦予給暫時的變數 detailProduct，才得以渲染 detailModal -->
            <button type='button' class='btn btn-outline-success' @click='openModal(product)'>
              查看更多
            </button>
            <button type='button' class='btn btn-outline-danger' @click='addCartProduct(product.id)'>
              加入購物車
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <DetailProduct ref="detailModal" :product="detailProduct" @add-to-cart="addCartProduct" />
</template>

<script>
import DetailProduct from '../components/DetailProduct.vue'
import Swal from 'sweetalert2'
const { VITE_URL, VITE_PATH } = import.meta.env

export default {
  data () {
    return {
      isLoading: false,
      // 完成商品資料
      products: [],

      // 購物車資料
      carts: [],
      detailProduct: {}
    }
  },
  components: {
    DetailProduct
  },
  methods: {
    // product 物件為所有商品中的某一項，點擊查看更多後，會把 product 賦予給 detailProduct，再透過 props 傳到 detailModal，進而渲染 detailModal 介面
    openModal (product) {
      this.detailProduct = product
      this.$refs.detailModal.openModal()
    },
    getProductData () {
      this.axios
        .get(`${VITE_URL}/api/${VITE_PATH}/products/all`)
        .then((res) => {
          this.products = res.data.products
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
    // 如果透過「查看更多」視窗(detailModal)觸發會使用到 emit，如果透過「加入購物車」按鈕會傳入 productId，而 qty 使用預設值 1
    addCartProduct (productId, qty = 1) {
      // 呼叫載入效果
      this.isLoading = true

      const data = {
        data: {
          product_id: productId,
          qty // 等於 qty: qty
        }
      }
      this.axios
        .post(`${VITE_URL}/api/${VITE_PATH}/cart`, data)
        .then((res) => {
          // 可以用外層 DOM 呼叫內層元件方法
          this.$refs.detailModal.closeModal()

          this.isLoading = false

          // 彈出視窗效果
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
    },
    // 綁定 input change 事件
    updateCartProduct (cartId, productId, event) {
      this.isLoading = true

      const data = {
        data: {
          product_id: productId,
          // 要轉成數字型別所以乘上 1
          qty: event.target.value * 1
        }
      }
      this.axios
        .put(`${VITE_URL}/api/${VITE_PATH}/cart/${cartId}`, data)
        .then((res) => {
          this.getCart()

          this.isLoading = false

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
      // 呼叫載入效果
      this.isLoading = true
      this.axios
        .delete(`${VITE_URL}/api/${VITE_PATH}/cart/${cartId}`)
        .then((res) => {
          this.getCart()
          this.isLoading = false

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
    },
    delAllCart () {
      this.isLoading = true
      this.axios
        .delete(`${VITE_URL}/api/${VITE_PATH}/carts`)
        .then((res) => {
          this.getCart()
          this.isLoading = false

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
    this.getProductData()
    this.getCart()
  }
}
</script>

<style lang="scss">
.table-img {
  width: 150px;
  height: 150px;
}

.obj-fit-cover {
  object-fit: cover;
}

.obj-position-center {
  object-position: center;
}
</style>
