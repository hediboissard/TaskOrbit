<script setup lang="ts">
useHead({ title: 'Accueil' })

const { isAuthenticated } = useAuth()
const router = useRouter()

const goOrLogin = (path: string) => {
  if (isAuthenticated.value) {
    router.push(path)
    return
  }
  router.push({ path: '/auth/login', query: { redirect: path } })
}
</script>

<template>
  <div class="-mx-4 sm:-mx-6 lg:-mx-8 -mt-8">
    <section
      class="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white px-4 sm:px-6 lg:px-8 py-20 md:py-28"
    >
      <div
        class="absolute inset-0 opacity-20 pointer-events-none"
        style="
          background-image: radial-gradient(circle at 20% 50%, white 0%, transparent 45%),
            radial-gradient(circle at 80% 20%, white 0%, transparent 40%);
        "
      />
      <div class="relative max-w-3xl mx-auto text-center">
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Pilotez vos projets et tâches en orbite
        </h1>
        <p class="text-lg text-indigo-100 mb-10 max-w-xl mx-auto">
          TaskOrbit centralise vos projets, votre kanban et votre suivi — sans friction.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            v-if="!isAuthenticated"
            type="button"
            class="px-6 py-3 rounded-xl bg-white text-indigo-900 font-semibold shadow-lg hover:bg-indigo-50 transition-colors"
            @click="goOrLogin('/dashboard')"
          >
            Accéder à mon espace
          </button>
          <NuxtLink
            v-else
            to="/dashboard"
            class="px-6 py-3 rounded-xl bg-white text-indigo-900 font-semibold shadow-lg hover:bg-indigo-50 transition-colors text-center"
          >
            Mon tableau de bord
          </NuxtLink>
          <NuxtLink
            to="/auth/register"
            class="px-6 py-3 rounded-xl border-2 border-indigo-300/80 text-white font-semibold hover:bg-white/10 transition-colors text-center"
          >
            Créer un compte
          </NuxtLink>
        </div>
        <p v-if="!isAuthenticated" class="mt-6 text-sm text-indigo-200/90">
          Consultez cette page librement. Pour créer ou modifier des données, la connexion sera demandée.
        </p>
      </div>
    </section>

    <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 class="text-2xl font-bold text-gray-900 text-center mb-10">Ce que vous pouvez faire</h2>
      <div class="grid md:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div class="w-10 h-10 rounded-lg bg-indigo-100 text-xl flex items-center justify-center mb-3">
            &#128193;
          </div>
          <h3 class="font-semibold text-gray-900 mb-2">Projets</h3>
          <p class="text-sm text-gray-600 mb-4">Organisez vos espaces de travail et suivez l’avancement.</p>
          <button
            type="button"
            class="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            @click="goOrLogin('/projects')"
          >
            Voir les projets →
          </button>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div class="w-10 h-10 rounded-lg bg-blue-100 text-xl flex items-center justify-center mb-3">
            &#9989;
          </div>
          <h3 class="font-semibold text-gray-900 mb-2">Tâches</h3>
          <p class="text-sm text-gray-600 mb-4">Kanban, priorités et filtres pour rester concentré.</p>
          <button
            type="button"
            class="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            @click="goOrLogin('/tasks')"
          >
            Voir les tâches →
          </button>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div class="w-10 h-10 rounded-lg bg-green-100 text-xl flex items-center justify-center mb-3">
            &#128200;
          </div>
          <h3 class="font-semibold text-gray-900 mb-2">Tableau de bord</h3>
          <p class="text-sm text-gray-600 mb-4">Statistiques et accès rapide à tout votre espace.</p>
          <button
            type="button"
            class="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            @click="goOrLogin('/dashboard')"
          >
            Ouvrir le tableau de bord →
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
