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
                      <span class="font-medium">Alamat Pengiriman:</span>
                      {{ formatShippingAddress(order.shippingAddress) }}
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
                  @click="printOrder(order)"
                  class="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Print Invoice
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

  <!-- Order Detail Modal -->
  <div v-if="showDetail" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
    <div class="bg-white rounded-lg shadow-2xl max-w-3xl w-full overflow-hidden">
      <div class="flex justify-between items-center px-6 py-4 border-b">
        <div>
          <h3 class="text-xl font-semibold">Order Details</h3>
          <p class="text-sm text-gray-500">Order #{{ detailOrderId }}</p>
        </div>
        <button @click="closeDetail" class="text-gray-500 hover:text-gray-700">✕</button>
      </div>

      <div class="p-6 space-y-4">
        <div v-if="detailLoading" class="text-center text-gray-600">Loading order...</div>
        <div v-else>
          <div v-if="detailError" class="rounded-md bg-red-50 p-4">
            <p class="text-sm text-red-800">{{ detailError }}</p>
          </div>
          <div v-else-if="selectedOrder">
            <div class="flex flex-wrap gap-4 items-center">
              <span :class="getStatusClass(selectedOrder.status)" class="px-3 py-1 rounded-full text-sm font-medium">
                {{ selectedOrder.status?.toUpperCase() }}
              </span>
              <span v-if="selectedOrder.isPaid" class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                PAID
              </span>
              <span v-else class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                UNPAID
              </span>
              <span class="text-sm text-gray-600">Date: {{ formatDate(selectedOrder.createdAt) }}</span>
            </div>

            <div class="grid sm:grid-cols-2 gap-4 mt-4">
              <div>
                <h4 class="font-semibold text-gray-800 mb-1">Alamat Pengiriman</h4>
                <p class="text-sm text-gray-700 whitespace-pre-line">
                  {{ formatShippingAddress(selectedOrder.shippingAddress, { lineBreak: '\n' }) }}
                </p>
              </div>
              <div>
                <h4 class="font-semibold text-gray-800 mb-1">Payment</h4>
                <p class="text-sm text-gray-700">{{ formatPaymentMethod(selectedOrder.paymentMethod) }}</p>
              </div>
            </div>

            <div class="mt-4">
              <h4 class="font-semibold text-gray-800 mb-2">Items</h4>
              <div class="overflow-x-auto">
                <table class="min-w-full border border-gray-200 text-sm">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-3 py-2 text-left border-b">Item</th>
                      <th class="px-3 py-2 text-center border-b">Qty</th>
                      <th class="px-3 py-2 text-right border-b">Price</th>
                      <th class="px-3 py-2 text-right border-b">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in selectedOrder.items" :key="item.id" class="border-b last:border-b-0">
                      <td class="px-3 py-2">{{ item.product?.name || 'Product' }}</td>
                      <td class="px-3 py-2 text-center">{{ item.quantity }}</td>
                      <td class="px-3 py-2 text-right">{{ formatRupiah(item.price) }}</td>
                      <td class="px-3 py-2 text-right">{{ formatRupiah(item.price * item.quantity) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="text-right font-bold text-lg mt-3">Total: {{ formatRupiah(selectedOrder.totalAmount) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
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
const showDetail = ref(false);
const detailLoading = ref(false);
const selectedOrder = ref(null);
const detailError = ref('');

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
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
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

const formatShippingAddress = (address, { lineBreak = ', ' } = {}) => {
  if (!address) return '-';
  const parts = [
    address.alamat,
    address.kelurahan ? `Kel. ${address.kelurahan}` : null,
    address.kecamatan ? `Kec. ${address.kecamatan}` : null,
    address.kota,
    address.provinsi,
    address.kodePos ? `Kode Pos ${address.kodePos}` : null,
    address.negara || 'Indonesia',
  ].filter(Boolean);

  return parts.join(lineBreak);
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

const viewOrderDetails = async (order) => {
  detailLoading.value = true;
  detailError.value = '';
  showDetail.value = true;
  selectedOrder.value = null;

  try {
    const data = await orderService.getOrder(order.id);
    selectedOrder.value = data;
  } catch (err) {
    detailError.value = 'Failed to load order details. Please try again.';
  } finally {
    detailLoading.value = false;
  }
};

const closeDetail = () => {
  showDetail.value = false;
  selectedOrder.value = null;
  detailError.value = '';
};

const printOrder = (order) => {
  const itemsRows = (order.items || [])
    .map(
      (item) => `
        <tr>
          <td style="padding:8px;border:1px solid #e5e7eb;">${item.product?.name || 'Product'}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:right;">${formatRupiah(item.price)}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:right;">${formatRupiah(item.price * item.quantity)}</td>
        </tr>
      `
    )
    .join('');

  const shippingAddressHtml = formatShippingAddress(order.shippingAddress, { lineBreak: '<br />' });

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Invoice #${order.id || ''}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 24px; color: #111827; }
          h1 { margin-bottom: 4px; }
          .muted { color: #6b7280; font-size: 12px; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
          .summary { margin-top: 16px; }
          table { border-collapse: collapse; width: 100%; margin-top: 12px; }
          .totals { text-align: right; margin-top: 12px; font-size: 16px; font-weight: 700; }
          .badge { display: inline-block; padding: 4px 8px; border-radius: 9999px; font-size: 12px; background: #e5e7eb; color: #111827; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>Invoice</h1>
            <div class="muted">Order #${order.id || ''}</div>
            <div class="muted">Date: ${formatDate(order.createdAt)}</div>
          </div>
          <div>
            <span class="badge">${order.status?.toUpperCase() || 'PENDING'}</span>
            ${order.isPaid ? '<span class="badge" style="background:#d1fae5;color:#065f46;margin-left:8px;">PAID</span>' : ''}
          </div>
        </div>

        <div class="summary">
          <strong>Alamat Pengiriman:</strong><br />
          ${shippingAddressHtml}
        </div>

        <table>
          <thead>
            <tr>
              <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Item</th>
              <th style="padding:8px;border:1px solid #e5e7eb;text-align:center;">Qty</th>
              <th style="padding:8px;border:1px solid #e5e7eb;text-align:right;">Price</th>
              <th style="padding:8px;border:1px solid #e5e7eb;text-align:right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <div class="totals">Total: ${formatRupiah(order.totalAmount)}</div>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank', 'width=900,height=650');
  if (!printWindow) return;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
  printWindow.document.close();
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

const detailOrderId = computed(() => selectedOrder.value?.id || selectedOrder.value?._id || '');

onMounted(() => {
  loadOrders();
});
</script>
