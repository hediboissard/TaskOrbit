<script setup lang="ts">
const { user, isAuthenticated, logout } = useAuth()
const route = useRoute()
const router = useRouter()
const mobileMenuOpen = ref(false)

const navLinks = [
  { label: 'Tableau de bord', to: '/dashboard' },
  { label: 'Projets', to: '/projects' },
  { label: 'Tâches', to: '/tasks' },
]

const isActive = (path: string) => route.path === path || route.path.startsWith(path + '/')

const goProtected = (path: string) => {
  mobileMenuOpen.value = false
  if (isAuthenticated.value) {
    router.push(path)
    return
  }
  router.push({ path: '/auth/login', query: { redirect: path } })
}

const handleLogout = () => {
  mobileMenuOpen.value = false
  logout()
}
</script>

<template>
  <nav class="bg-indigo-900 shadow-lg sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <NuxtLink to="/" class="flex items-center gap-2 group">
            <div class="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center group-hover:bg-indigo-400 transition-colors">
              <span class="text-white text-sm font-bold">T</span>
            </div>
            <span class="text-white font-bold text-xl tracking-tight">TaskOrbit</span>
          </NuxtLink>
        </div>

        <!-- Desktop Nav Links -->
        <div class="hidden md:flex items-center gap-1">
          <template v-for="link in navLinks" :key="link.to">
            <NuxtLink
              v-if="isAuthenticated"
              :to="link.to"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive(link.to)
                  ? 'bg-indigo-700 text-white'
                  : 'text-indigo-200 hover:text-white hover:bg-indigo-800'
              ]"
            >
              {{ link.label }}
            </NuxtLink>
            <button
              v-else
              type="button"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive(link.to)
                  ? 'bg-indigo-700 text-white'
                  : 'text-indigo-200 hover:text-white hover:bg-indigo-800'
              ]"
              @click="goProtected(link.to)"
            >
              {{ link.label }}
            </button>
          </template>
        </div>

        <!-- Right: User + Logout -->
        <div class="flex items-center gap-3">
          <div v-if="!isAuthenticated" class="hidden md:flex items-center gap-2">
            <NuxtLink
              to="/auth/login"
              class="px-3 py-1.5 text-sm font-medium text-indigo-200 hover:text-white transition-colors"
            >
              Connexion
            </NuxtLink>
            <NuxtLink
              to="/auth/register"
              class="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors"
            >
              Inscription
            </NuxtLink>
          </div>
          <div v-if="isAuthenticated" class="hidden md:flex items-center gap-3">
            <div class="flex items-center gap-2 text-sm text-indigo-200">
              <div class="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                {{ (user?.username || user?.email || 'U')[0].toUpperCase() }}
              </div>
              <span>{{ user?.username || user?.email }}</span>
            </div>
            <button
              @click="handleLogout"
              class="px-3 py-1.5 text-xs font-medium text-indigo-200 border border-indigo-600 rounded-lg hover:bg-indigo-700 hover:text-white transition-colors"
            >
              Déconnexion
            </button>
          </div>

          <!-- Mobile hamburger -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 text-indigo-200 hover:text-white hover:bg-indigo-800 rounded-lg transition-colors"
          >
            <svg v-if="!mobileMenuOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden pb-3 pt-1 border-t border-indigo-800">
        <div class="space-y-1 mb-3">
          <template v-for="link in navLinks" :key="link.to">
            <NuxtLink
              v-if="isAuthenticated"
              :to="link.to"
              class="block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              :class="[
                isActive(link.to)
                  ? 'bg-indigo-700 text-white'
                  : 'text-indigo-200 hover:text-white hover:bg-indigo-800'
              ]"
              @click="mobileMenuOpen = false"
            >
              {{ link.label }}
            </NuxtLink>
            <button
              v-else
              type="button"
              :class="[
                'w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive(link.to)
                  ? 'bg-indigo-700 text-white'
                  : 'text-indigo-200 hover:text-white hover:bg-indigo-800'
              ]"
              @click="goProtected(link.to)"
            >
              {{ link.label }}
            </button>
          </template>
        </div>
        <div
          v-if="!isAuthenticated"
          class="flex flex-col gap-2 px-4 pt-2 border-t border-indigo-800"
        >
          <NuxtLink
            to="/auth/login"
            class="block text-center py-2.5 rounded-lg text-sm font-medium text-indigo-200 border border-indigo-600 hover:bg-indigo-800"
            @click="mobileMenuOpen = false"
          >
            Connexion
          </NuxtLink>
          <NuxtLink
            to="/auth/register"
            class="block text-center py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500"
            @click="mobileMenuOpen = false"
          >
            Inscription
          </NuxtLink>
        </div>
        <div v-if="isAuthenticated" class="flex items-center justify-between px-4 pt-2 border-t border-indigo-800">
          <span class="text-sm text-indigo-300">{{ user?.username || user?.email }}</span>
          <button
            @click="handleLogout"
            class="px-3 py-1.5 text-xs font-medium text-indigo-200 border border-indigo-600 rounded-lg hover:bg-indigo-700 hover:text-white transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
