<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Tableau de bord' })

const { user } = useAuth()
const { projects, fetchProjects } = useProjects()
const { tasks, fetchTasks } = useTasks()

onMounted(async () => {
  await Promise.all([fetchProjects(), fetchTasks()])
})

const totalProjects = computed(() => projects.value.length)
const totalTasks = computed(() => tasks.value.length)
const todoTasks = computed(() => tasks.value.filter((t) => t.status === 'todo').length)
const inProgressTasks = computed(() => tasks.value.filter((t) => t.status === 'inprogress').length)
const doneTasks = computed(() => tasks.value.filter((t) => t.status === 'done').length)
const highPriorityTasks = computed(() => tasks.value.filter((t) => t.priority === 'high').length)

const stats = computed(() => [
  {
    label: 'Projets',
    value: totalProjects.value,
    icon: '&#128193;',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    iconBg: 'bg-indigo-100',
  },
  {
    label: 'Tâches',
    value: totalTasks.value,
    icon: '&#9989;',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    iconBg: 'bg-blue-100',
  },
  {
    label: 'À faire',
    value: todoTasks.value,
    icon: '&#128203;',
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    iconBg: 'bg-gray-200',
  },
  {
    label: 'En cours',
    value: inProgressTasks.value,
    icon: '&#9654;',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    iconBg: 'bg-orange-100',
  },
  {
    label: 'Terminé',
    value: doneTasks.value,
    icon: '&#127881;',
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    iconBg: 'bg-green-100',
  },
  {
    label: 'Priorité haute',
    value: highPriorityTasks.value,
    icon: '&#128680;',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    iconBg: 'bg-red-100',
  },
])
</script>

<template>
  <div>
    <!-- Welcome Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">
        Bon retour, <span class="text-indigo-600">{{ user?.username || user?.email || 'Utilisateur' }}</span> !
      </h1>
      <p class="text-gray-500 mt-1">Voici un aperçu de votre espace de travail.</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.label"
        :class="['rounded-xl border p-4 flex flex-col items-center text-center', stat.bg, stat.border]"
      >
        <div :class="['w-10 h-10 rounded-full flex items-center justify-center text-xl mb-2', stat.iconBg]">
          <span v-html="stat.icon" />
        </div>
        <span :class="['text-3xl font-bold', stat.text]">{{ stat.value }}</span>
        <span class="text-xs text-gray-500 mt-1 font-medium">{{ stat.label }}</span>
      </div>
    </div>

    <!-- Quick Navigation -->
    <div class="mb-8">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Accès rapide</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NuxtLink
          to="/projects"
          class="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all group"
        >
          <div class="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-2xl group-hover:bg-indigo-200 transition-colors">
            &#128193;
          </div>
          <div>
            <p class="font-semibold text-gray-900">Mes projets</p>
            <p class="text-sm text-gray-500">{{ totalProjects }} projet{{ totalProjects !== 1 ? 's' : '' }}</p>
          </div>
          <span class="ml-auto text-gray-400 group-hover:text-indigo-500 transition-colors">&#8594;</span>
        </NuxtLink>

        <NuxtLink
          to="/tasks"
          class="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all group"
        >
          <div class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-2xl group-hover:bg-blue-200 transition-colors">
            &#9989;
          </div>
          <div>
            <p class="font-semibold text-gray-900">Toutes les tâches</p>
            <p class="text-sm text-gray-500">{{ totalTasks }} tâche{{ totalTasks !== 1 ? 's' : '' }}</p>
          </div>
          <span class="ml-auto text-gray-400 group-hover:text-indigo-500 transition-colors">&#8594;</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Recent Activity -->
    <div>
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Vue d’ensemble des statuts</h2>
      <div class="bg-white rounded-xl border border-gray-200 p-6">
        <div v-if="totalTasks === 0" class="text-center text-gray-400 py-8">
          <p class="text-4xl mb-3">&#128203;</p>
          <p class="text-gray-500">Pas encore de tâches. <NuxtLink to="/tasks" class="text-indigo-600 hover:underline">Créer votre première tâche</NuxtLink></p>
        </div>
        <div v-else>
          <!-- Progress bar -->
          <div class="flex rounded-full overflow-hidden h-4 mb-4">
            <div
              class="bg-gray-300 transition-all"
              :style="{ width: totalTasks ? `${(todoTasks / totalTasks) * 100}%` : '0%' }"
            />
            <div
              class="bg-orange-400 transition-all"
              :style="{ width: totalTasks ? `${(inProgressTasks / totalTasks) * 100}%` : '0%' }"
            />
            <div
              class="bg-green-500 transition-all"
              :style="{ width: totalTasks ? `${(doneTasks / totalTasks) * 100}%` : '0%' }"
            />
          </div>
          <div class="flex flex-wrap gap-4 text-sm">
            <span class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-gray-300 inline-block" />
              <span class="text-gray-600">À faire : <strong>{{ todoTasks }}</strong></span>
            </span>
            <span class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-orange-400 inline-block" />
              <span class="text-gray-600">En cours : <strong>{{ inProgressTasks }}</strong></span>
            </span>
            <span class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-green-500 inline-block" />
              <span class="text-gray-600">Terminé : <strong>{{ doneTasks }}</strong></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
