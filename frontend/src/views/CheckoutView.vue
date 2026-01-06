<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
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
                    <p class="font-semibold text-gray-900">${{ (item.price * item.quantity).toFixed(2) }}</p>
                    <p class="text-sm text-gray-500">${{ item.price }} each</p>
                  </div>
                </div>
              </div>
              <div class="mt-6 flex justify-between items-center text-xl font-bold">
                <span>Total:</span>
                <span>${{ totalAmount.toFixed(2) }}</span>
              </div>
            </div>

            <!-- Shipping Form -->
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-4">Shipping Address</h3>
                <div class="grid grid-cols-1 gap-4">
                  <div>
                    <label for="street" class="block text-sm font-medium text-gray-700">Street Address</label>
                    <input
                      id="street"
                      v-model="form.shippingAddress.street"
                      type="text"
                      required
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="city" class="block text-sm font-medium text-gray-700">City</label>
                      <input
                        id="city"
                        v-model="form.shippingAddress.city"
                        type="text"
                        required
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label for="state" class="block text-sm font-medium text-gray-700">State</label>
                      <input
                        id="state"
                        v-model="form.shippingAddress.state"
                        type="text"
                        required
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="zipCode" class="block text-sm font-medium text-gray-700">Zip Code</label>
                      <input
                        id="zipCode"
                        v-model="form.shippingAddress.zipCode"
                        type="text"
                        required
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label for="country" class="block text-sm font-medium text-gray-700">Country</label>
                      <input
                        id="country"
                        v-model="form.shippingAddress.country"
                        type="text"
                        required
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-4">Payment Method</h3>
                <select
                  v-model="form.paymentMethod"
                  required
                  class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select payment method</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash_on_delivery">Cash on Delivery</option>
                </select>
              </div>

              <div class="flex justify-between">
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
                  {{ loading ? 'Processing...' : 'Place Order' }}
                </button>
              </div>
            </form>
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

const router = useRouter();
const cart = ref([]);
const loading = ref(false);
const error = ref('');
const success = ref(false);

const form = ref({
  items: [],
  shippingAddress: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
  paymentMethod: '',
});

const totalAmount = computed(() => {
  return cart.value.reduce((total, item) => total + (item.price * item.quantity), 0);
});

const handleSubmit = async () => {
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
