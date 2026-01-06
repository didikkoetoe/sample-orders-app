<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center space-y-4">
        <div class="flex justify-center">
          <img :src="logo" alt="Simple Orders logo" class="h-32 w-auto drop-shadow-sm" />
        </div>
        <h2 class="text-3xl font-extrabold text-gray-900">
          {{ isLogin ? 'Sign in to your account' : 'Create new account' }}
        </h2>
      </div>
      <VForm class="mt-8 space-y-6" @submit="handleSubmit" :initial-values="form">
        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>
        <div class="space-y-4">
          <div v-if="!isLogin">
            <label for="name" class="sr-only">Name</label>
            <Field
              name="name"
              v-model="form.name"
              :rules="isLogin ? '' : 'required|min:2'"
              v-slot="{ field, errorMessage }"
            >
              <div>
                <input
                  id="name"
                  v-bind="field"
                  type="text"
                  class="appearance-none block w-full px-4 py-3 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm"
                  :class="errorMessage ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'"
                  placeholder="Full name"
                />
                <p v-if="errorMessage" class="text-xs text-red-600 mt-1">{{ errorMessage }}</p>
              </div>
            </Field>
          </div>
          <div>
            <label for="email" class="sr-only">Email address</label>
            <Field
              name="email"
              v-model="form.email"
              rules="required|email"
              v-slot="{ field, errorMessage }"
            >
              <div>
                <input
                  id="email"
                  v-bind="field"
                  type="email"
                  class="appearance-none block w-full px-4 py-3 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm"
                  :class="errorMessage ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'"
                  placeholder="Email address"
                />
                <p v-if="errorMessage" class="text-xs text-red-600 mt-1">{{ errorMessage }}</p>
              </div>
            </Field>
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <Field
              name="password"
              v-model="form.password"
              :rules="isLogin ? 'required|min:6' : 'required|min:8'"
              v-slot="{ field, errorMessage }"
            >
              <div class="relative">
                <input
                  id="password"
                  v-bind="field"
                  :type="showPassword ? 'text' : 'password'"
                  class="appearance-none block w-full px-4 py-3 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm pr-12"
                  :class="errorMessage ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'"
                  placeholder="Password"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label="Toggle password visibility"
                >
                  <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.98 8.223A10.477 10.477 0 0 0 2.458 12C3.732 16.057 7.522 19 12 19c1.674 0 3.26-.34 4.696-.955M6.228 6.228A10.45 10.45 0 0 1 12 5c4.478 0 8.268 2.943 9.542 7a10.523 10.523 0 0 1-4.51 5.345M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.243 4.243L9.88 9.88" />
                  </svg>
                </button>
                <p v-if="errorMessage" class="text-xs text-red-600 mt-1">{{ errorMessage }}</p>
              </div>
            </Field>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {{ loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Sign up') }}
          </button>
        </div>

        <div class="text-center">
          <button
            type="button"
            @click="toggleMode"
            class="text-indigo-600 hover:text-indigo-500 text-sm"
          >
            {{ isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in' }}
          </button>
        </div>
      </VForm>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/auth';
import logo from '../assets/logo.png';
import { Form as VForm, Field } from 'vee-validate';

const router = useRouter();
const isLogin = ref(true);
const loading = ref(false);
const error = ref('');
const showPassword = ref(false);

const form = ref({
  name: '',
  email: '',
  password: '',
});

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  error.value = '';
  showPassword.value = false;
  form.value = {
    name: '',
    email: '',
    password: '',
  };
};

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';

  try {
    if (isLogin.value) {
      await authService.login(form.value.email, form.value.password);
    } else {
      await authService.register(form.value.name, form.value.email, form.value.password);
    }
    router.push('/products');
  } catch (err) {
    error.value = err.response?.data?.message || 'Authentication failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
