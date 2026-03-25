<script setup lang="ts">
import { safeRedirectPath } from '~/utils/authRedirect'

definePageMeta({ layout: 'auth' })
useHead({ title: 'Inscription' })

const { register } = useAuth()
const router = useRouter()
const route = useRoute()

const redirectAfterRegister = computed(() => safeRedirectPath(route.query.redirect as string | undefined))

const form = reactive({ username: '', email: '', password: '' })
const errors = reactive({ username: '', email: '', password: '' })
const serverError = ref('')
const loading = ref(false)

const validate = () => {
  errors.username = ''
  errors.email = ''
  errors.password = ''
  let valid = true

  if (!form.username.trim()) {
    errors.username = 'Le nom d’utilisateur est obligatoire'
    valid = false
  }

  if (!form.email) {
    errors.email = 'L’e-mail est obligatoire'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Veuillez saisir une adresse e-mail valide'
    valid = false
  }

  if (!form.password) {
    errors.password = 'Le mot de passe est obligatoire'
    valid = false
  } else if (form.password.length < 6) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    valid = false
  }

  return valid
}

const handleSubmit = async () => {
  if (!validate()) return
  loading.value = true
  serverError.value = ''
  try {
    await register(form.username, form.email, form.password)
    await router.push(redirectAfterRegister.value || '/dashboard')
  } catch (err: any) {
    serverError.value = err.message || 'L’inscription a échoué. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-md">
    <!-- Logo / Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur mb-4">
        <span class="text-3xl">&#9880;</span>
      </div>
      <h1 class="text-3xl font-bold text-white">TaskOrbit</h1>
      <p class="text-indigo-200 mt-1">Créez votre compte</p>
    </div>

    <!-- Card -->
    <div class="bg-white rounded-2xl shadow-2xl p-8">
      <!-- Server Error -->
      <div v-if="serverError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
        <span class="text-red-500 mt-0.5">&#9888;</span>
        <p class="text-sm text-red-700">{{ serverError }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- Username -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Nom d’utilisateur</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            autocomplete="username"
            placeholder="johndoe"
            class="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            :class="errors.username ? 'border-red-400 bg-red-50' : 'border-gray-300'"
          />
          <p v-if="errors.username" class="mt-1 text-xs text-red-600">{{ errors.username }}</p>
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Adresse e-mail</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            autocomplete="email"
            placeholder="you@example.com"
            class="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            :class="errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'"
          />
          <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            autocomplete="new-password"
            placeholder="Au moins 6 caractères"
            class="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            :class="errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'"
          />
          <p v-if="errors.password" class="mt-1 text-xs text-red-600">{{ errors.password }}</p>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2.5 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg v-if="loading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {{ loading ? 'Création du compte…' : 'Créer un compte' }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-gray-600">
        Vous avez déjà un compte ?
        <NuxtLink
          :to="{ path: '/auth/login', query: route.query.redirect ? { redirect: route.query.redirect } : {} }"
          class="text-indigo-600 font-medium hover:text-indigo-700"
        >
          Se connecter
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
