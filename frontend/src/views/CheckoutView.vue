<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 h-auto sm:h-16">
          <div class="flex items-center space-x-3">
            <img :src="logo" alt="Simple Orders logo" class="h-8 w-auto" />
            <h1 class="text-xl font-bold text-gray-900">Simple Orders - Checkout</h1>
          </div>
          <div class="flex items-center">
            <router-link
              to="/products"
              class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Back to Products
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div v-if="success" class="rounded-md bg-green-50 p-4 mb-6">
          <p class="text-sm text-green-800">Order placed successfully! Redirecting to orders...</p>
        </div>

        <div v-if="error" class="rounded-md bg-red-50 p-4 mb-6">
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>

        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-5 border-b border-gray-200">
            <h2 class="text-2xl font-bold text-gray-900">Order Summary</h2>
          </div>

          <div class="px-6 py-5">
            <!-- Cart Items -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-4">Items</h3>
              <div class="space-y-4">
                <div
                  v-for="item in cart"
                  :key="item.id"
                  class="flex justify-between items-center border-b pb-4"
                >
                  <div class="flex-1">
                    <h4 class="font-medium text-gray-900">{{ item.name }}</h4>
                    <p class="text-sm text-gray-500">Quantity: {{ item.quantity }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold text-gray-900">{{ formatRupiah(item.price * item.quantity) }}</p>
                    <p class="text-sm text-gray-500">{{ formatRupiah(item.price) }} per item</p>
                  </div>
                </div>
              </div>
              <div class="mt-6 flex justify-between items-center text-xl font-bold">
                <span>Total:</span>
                <span>{{ formatRupiah(totalAmount) }}</span>
              </div>
            </div>

            <!-- Shipping Form -->
            <VForm @submit="handleSubmit" class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-4">Alamat Pengiriman</h3>
                <div class="grid grid-cols-1 gap-4">
                  <div>
                    <label for="alamat" class="block text-sm font-medium text-gray-700">Alamat Lengkap</label>
                    <Field
                      name="alamat"
                      v-model="form.shippingAddress.alamat"
                      rules="required|min:3"
                      v-slot="{ field, errorMessage }"
                    >
                      <input
                        id="alamat"
                        v-bind="field"
                        type="text"
                        class="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm"
                        :class="errorMessage ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'"
                      />
                      <p v-if="errorMessage" class="text-sm text-red-600 mt-1">{{ errorMessage }}</p>
                    </Field>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label for="kelurahan" class="block text-sm font-medium text-gray-700">Kelurahan</label>
                      <Field
                        name="kelurahan"
                        v-model="form.shippingAddress.kelurahan"
                        rules="required|min:2"
                        v-slot="{ field, errorMessage }"
                      >
                        <input
                          id="kelurahan"
                          v-bind="field"
                          type="text"
                          class="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm"
                          :class="errorMessage ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'"
                        />
                        <p v-if="errorMessage" class="text-sm text-red-600 mt-1">{{ errorMessage }}</p>
                      </Field>
                    </div>
                    <div>
                      <label for="kecamatan" class="block text-sm font-medium text-gray-700">Kecamatan</label>
                      <Field
                        name="kecamatan"
                        v-model="form.shippingAddress.kecamatan"
                        rules="required|min:2"
                        v-slot="{ field, errorMessage }"
                      >
                        <input
                          id="kecamatan"
                          v-bind="field"
                          type="text"
                          class="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm"
                          :class="errorMessage ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'"
                        />
                        <p v-if="errorMessage" class="text-sm text-red-600 mt-1">{{ errorMessage }}</p>
                      </Field>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label for="kota" class="block text-sm font-medium text-gray-700">Kota/Kabupaten</label>
                      <Field
                        name="kota"
                        v-model="form.shippingAddress.kota"
                        rules="required|min:3"
                        v-slot="{ field, errorMessage }"
                      >
                        <input
                          id="kota"
                          v-bind="field"
                          type="text"
                          class="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm"
                          :class="errorMessage ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'"
                        />
                        <p v-if="errorMessage" class="text-sm text-red-600 mt-1">{{ errorMessage }}</p>
                      </Field>
                    </div>
                    <div>
                      <label for="provinsi" class="block text-sm font-medium text-gray-700">Provinsi</label>
                      <Field
                        name="provinsi"
                        v-model="form.shippingAddress.provinsi"
                        rules="required|min:2"
                        v-slot="{ field, errorMessage }"
                      >
                        <input
                          id="provinsi"
                          v-bind="field"
                          type="text"
                          class="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm"
                          :class="errorMessage ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'"
                        />
                        <p v-if="errorMessage" class="text-sm text-red-600 mt-1">{{ errorMessage }}</p>
                      </Field>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label for="kodePos" class="block text-sm font-medium text-gray-700">Kode Pos</label>
                      <Field
                        name="kodePos"
                        v-model="form.shippingAddress.kodePos"
                        rules="required|min:3|max:10"
                        v-slot="{ field, errorMessage }"
                      >
                        <input
                          id="kodePos"
                          v-bind="field"
                          type="text"
                          class="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm"
                          :class="errorMessage ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'"
                        />
                        <p v-if="errorMessage" class="text-sm text-red-600 mt-1">{{ errorMessage }}</p>
                      </Field>
                    </div>
                    <div>
                      <label for="negara" class="block text-sm font-medium text-gray-700">Negara</label>
                      <Field
                        name="negara"
                        v-model="form.shippingAddress.negara"
                        rules="required|min:2"
                        v-slot="{ field, errorMessage }"
                      >
                        <input
                          id="negara"
                          v-bind="field"
                          type="text"
                          class="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm"
                          :class="errorMessage ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'"
                        />
                        <p v-if="errorMessage" class="text-sm text-red-600 mt-1">{{ errorMessage }}</p>
                      </Field>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-4">Payment Method</h3>
                <Field
                  name="paymentMethod"
                  v-model="form.paymentMethod"
                  rules="required"
                  v-slot="{ field, errorMessage }"
                >
                  <select
                    v-bind="field"
                    class="block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm"
                    :class="errorMessage ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'"
                  >
                    <option value="">Select payment method</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash_on_delivery">Cash on Delivery</option>
                  </select>
                  <p v-if="errorMessage" class="text-sm text-red-600 mt-1">{{ errorMessage }}</p>
                </Field>
              </div>

              <div class="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
                <button
                  type="button"
                  @click="goBack"
                  class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="loading"
                  class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  <span v-if="loading">Processing...</span>
                  <span v-else>Place Order</span>
                </button>
              </div>
            </VForm>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { orderService } from '../services/order';
import { formatRupiah } from '../utils/currency';
import logo from '../assets/logo.png';
import { Form as VForm, Field } from 'vee-validate';

const router = useRouter();
const cart = ref([]);
const loading = ref(false);
const error = ref('');
const success = ref(false);

const form = ref({
  items: [],
  shippingAddress: {
    alamat: '',
    kelurahan: '',
    kecamatan: '',
    kota: '',
    provinsi: '',
    kodePos: '',
    negara: 'Indonesia',
  },
  paymentMethod: '',
});

const totalAmount = computed(() => {
  return cart.value.reduce((total, item) => total + (item.price * item.quantity), 0);
});

const handleSubmit = async () => {
  if (loading.value) return;
  loading.value = true;
  error.value = '';

  try {
    // Prepare order data
    const orderData = {
      items: cart.value.map(item => ({
        product: item.id,
        quantity: item.quantity,
      })),
      shippingAddress: form.value.shippingAddress,
      paymentMethod: form.value.paymentMethod,
    };

    await orderService.createOrder(orderData);
    success.value = true;
    localStorage.removeItem('cart');

    setTimeout(() => {
      router.push('/orders');
    }, 2000);
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to place order. Please try again.';
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push('/products');
};

onMounted(() => {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart.value = JSON.parse(savedCart);
  } else {
    router.push('/products');
  }
});
</script>
