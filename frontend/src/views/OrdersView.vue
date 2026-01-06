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
          <h2 class="text-2xl font-bold text-gray-900">My Orders</h2>
          <VForm @submit.prevent>
            <Field name="status" v-model="statusFilter" v-slot="{ field }">
              <select
                v-bind="field"
                @change="loadOrders"
                class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </Field>
          </VForm>
        </div>

        <div v-if="loading" class="text-center py-12">
          <p class="text-gray-500">Loading orders...</p>
        </div>

        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-500">{{ error }}</p>
        </div>

        <div v-else-if="orders.length === 0" class="text-center py-12">
          <p class="text-gray-500 mb-4">No orders found.</p>
          <router-link
            to="/products"
            class="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Start shopping
          </router-link>
        </div>

        <div v-else class="space-y-6">
          <div
            v-for="order in orders"
            :key="order.id"
            class="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <div>
                <p class="text-sm text-gray-500">Order #{{ order.id.slice(-8) }}</p>
                <p class="text-sm text-gray-500">{{ formatDate(order.createdAt) }}</p>
              </div>
              <div class="flex items-center space-x-4">
                <span :class="getStatusClass(order.status)" class="px-3 py-1 rounded-full text-sm font-medium">
                  {{ order.status.toUpperCase() }}
                </span>
                <span v-if="order.isPaid" class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  PAID
                </span>
                <span v-else class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  UNPAID
                </span>
              </div>
            </div>

            <div class="px-6 py-4">
              <div class="space-y-3">
                <div
                  v-for="item in order.items"
                  :key="item.id"
                  class="flex justify-between items-center"
                >
                  <div class="flex-1">
                    <h4 class="font-medium text-gray-900">{{ item.product?.name || 'Product' }}</h4>
                    <p class="text-sm text-gray-500">Quantity: {{ item.quantity }} × {{ formatRupiah(item.price) }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold text-gray-900">{{ formatRupiah(item.price * item.quantity) }}</p>
                  </div>
                </div>
              </div>

              <div class="mt-4 pt-4 border-t border-gray-200">
                <div class="flex justify-between items-center">
                  <div>
                    <p class="text-sm text-gray-600">
                      <span class="font-medium">Shipping to:</span>
                      {{ order.shippingAddress?.street }}, {{ order.shippingAddress?.city }},
                      {{ order.shippingAddress?.state }} {{ order.shippingAddress?.zipCode }}
                    </p>
                    <p class="text-sm text-gray-600 mt-1">
                      <span class="font-medium">Payment:</span>
                      {{ formatPaymentMethod(order.paymentMethod) }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-gray-500">Total Amount</p>
                    <p class="text-2xl font-bold text-gray-900">{{ formatRupiah(order.totalAmount) }}</p>
                  </div>
                </div>
              </div>

              <div class="mt-4 flex justify-end space-x-2">
                <button
                  @click="viewOrderDetails(order)"
                  class="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View Details
                </button>
                <button
                  v-if="order.status === 'pending'"
                  @click="cancelOrder(order.id)"
                  class="px-4 py-2 text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { orderService } from '../services/order';
import { authService } from '../services/auth';
import { formatRupiah } from '../utils/currency';
import logo from '../assets/logo.png';
import { Form as VForm, Field } from 'vee-validate';

const router = useRouter();
const orders = ref([]);
const loading = ref(false);
const error = ref('');
const statusFilter = ref('');

const loadOrders = async () => {
  loading.value = true;
  error.value = '';

  try {
    const params = {};
    if (statusFilter.value) params.status = statusFilter.value;

    const response = await orderService.getMyOrders(params);
    orders.value = response.results || response;
  } catch (err) {
    error.value = 'Failed to load orders. Please try again.';
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatPaymentMethod = (method) => {
  const methods = {
    credit_card: 'Credit Card',
    debit_card: 'Debit Card',
    paypal: 'PayPal',
    bank_transfer: 'Bank Transfer',
    cash_on_delivery: 'Cash on Delivery',
  };
  return methods[method] || method;
};

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const viewOrderDetails = (order) => {
  // Can expand to show a modal with more details
  console.log('View order:', order);
};

const cancelOrder = async (orderId) => {
  if (!confirm('Are you sure you want to cancel this order?')) return;

  try {
    await orderService.updateOrder(orderId, { status: 'cancelled' });
    loadOrders();
  } catch (err) {
    error.value = 'Failed to cancel order. Please try again.';
  }
};

const handleLogout = () => {
  authService.logout();
  router.push('/login');
};

onMounted(() => {
  loadOrders();
});
</script>
