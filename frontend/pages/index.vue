<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Accueil' })

onMounted(() => {
  const token = localStorage.getItem('auth_token')
  navigateTo(token ? '/dashboard' : '/auth/login', { replace: true })
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <p class="text-gray-500 text-sm">Redirection…</p>
  </div>
</template>
