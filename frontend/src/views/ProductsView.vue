<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-3">
            <img :src="logo" alt="Simple Orders logo" class="h-8 w-auto" />
            <h1 class="text-xl font-bold text-gray-900">Simple Orders</h1>
          </div>
          <div class="flex items-center space-x-4">
            <router-link
              to="/products"
              class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Products
            </router-link>
            <router-link
              to="/orders"
              class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              My Orders
            </router-link>
            <button
              @click="handleLogout"
              class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="flex justify-between items-start mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Products</h2>
          <VForm class="flex space-x-4" @submit.prevent>
            <Field name="search" v-model="searchQuery" rules="max:100" v-slot="{ field, errorMessage }">
              <div class="flex flex-col">
                <input
                  v-bind="field"
                  type="text"
                  placeholder="Search products..."
                  class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  :class="errorMessage ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'"
                  @input="handleSearch"
                />
                <p v-if="errorMessage" class="text-sm text-red-600 mt-1">{{ errorMessage }}</p>
              </div>
            </Field>
            <Field name="category" v-model="selectedCategory" v-slot="{ field }">
              <select
                v-bind="field"
                @change="handleFilter"
                class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Storage">Storage</option>
              </select>
            </Field>
          </VForm>
        </div>

        <div v-if="loading" class="text-center py-12">
          <p class="text-gray-500">Loading products...</p>
        </div>

        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-500">{{ error }}</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="product in products"
            :key="product.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
          >
            <img
              :src="product.imageUrl"
              :alt="product.name"
              class="w-full h-48 object-cover"
            />
            <div class="p-4 flex flex-col flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ product.name }}</h3>
              <p class="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[3.5rem]">{{ product.description }}</p>
              <div class="flex justify-between items-center mb-4 mt-auto">
                <span class="text-2xl font-bold text-indigo-600">{{ formatRupiah(product.price) }}</span>
                <span class="text-sm text-gray-500">Stock: {{ product.stock }}</span>
              </div>
              <button
                @click="addToCart(product)"
                :disabled="product.stock === 0"
                class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Cart Summary -->
        <div v-if="cart.length > 0" class="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Cart ({{ cart.length }})</h3>
            <button @click="clearCart" class="text-red-600 text-sm hover:text-red-800">Clear</button>
          </div>
          <div class="space-y-2 mb-4 max-h-48 overflow-y-auto">
            <div v-for="item in cart" :key="item.id" class="flex justify-between items-center text-sm">
              <span class="flex-1">{{ item.name }}</span>
              <div class="flex items-center space-x-2">
                <button @click="decreaseQuantity(item)" class="text-gray-600 hover:text-gray-800">-</button>
                <span class="w-8 text-center">{{ item.quantity }}</span>
                <button @click="increaseQuantity(item)" class="text-gray-600 hover:text-gray-800">+</button>
                <button @click="removeFromCart(item)" class="text-red-600 hover:text-red-800 ml-2">×</button>
              </div>
            </div>
          </div>
          <div class="border-t pt-4">
            <div class="flex justify-between mb-4">
              <span class="font-semibold">Total:</span>
              <span class="font-bold text-xl">{{ formatRupiah(cartTotal) }}</span>
            </div>
            <button
              @click="proceedToCheckout"
              class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { productService } from '../services/product';
import { authService } from '../services/auth';
import { formatRupiah } from '../utils/currency';
import logo from '../assets/logo.png';
import { Form as VForm, Field } from 'vee-validate';

const router = useRouter();
const products = ref([]);
const loading = ref(false);
const error = ref('');
const searchQuery = ref('');
const selectedCategory = ref('');
const cart = ref([]);

const cartTotal = computed(() => {
  return cart.value.reduce((total, item) => total + (item.price * item.quantity), 0);
});

const loadProducts = async () => {
  loading.value = true;
  error.value = '';

  try {
    const params = {};
    if (searchQuery.value) params.name = searchQuery.value;
    if (selectedCategory.value) params.category = selectedCategory.value;

    const response = await productService.getProducts(params);
    products.value = response.results || response;
  } catch (err) {
    error.value = 'Failed to load products. Please try again.';
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  loadProducts();
};

const handleFilter = () => {
  loadProducts();
};

const addToCart = (product) => {
  const existingItem = cart.value.find(item => item.id === product.id);
  if (existingItem) {
    if (existingItem.quantity < product.stock) {
      existingItem.quantity++;
    }
  } else {
    cart.value.push({ ...product, quantity: 1 });
  }
};

const removeFromCart = (item) => {
  const index = cart.value.findIndex(i => i.id === item.id);
  if (index > -1) {
    cart.value.splice(index, 1);
  }
};

const increaseQuantity = (item) => {
  const product = products.value.find(p => p.id === item.id);
  if (item.quantity < product.stock) {
    item.quantity++;
  }
};

const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    item.quantity--;
  }
};

const clearCart = () => {
  cart.value = [];
};

const proceedToCheckout = () => {
  localStorage.setItem('cart', JSON.stringify(cart.value));
  router.push('/checkout');
};

const handleLogout = () => {
  authService.logout();
  router.push('/login');
};

onMounted(() => {
  loadProducts();
});
</script>
