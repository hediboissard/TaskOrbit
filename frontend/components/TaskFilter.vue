<script setup lang="ts">
interface Props {
  hideProjectFilter?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  filter: [filters: { status?: string; priority?: string; projectId?: string; search?: string }]
}>()

const { projects, fetchProjects } = useProjects()

onMounted(() => fetchProjects())

const filters = reactive({
  status: '',
  priority: '',
  projectId: '',
  search: '',
})

const emitFilter = () => {
  const active: any = {}
  if (filters.status) active.status = filters.status
  if (filters.priority) active.priority = filters.priority
  if (filters.projectId) active.projectId = filters.projectId
  if (filters.search.trim()) active.search = filters.search.trim()
  emit('filter', active)
}

watch(filters, emitFilter, { deep: true })

const clearFilters = () => {
  filters.status = ''
  filters.priority = ''
  filters.projectId = ''
  filters.search = ''
}

const hasActiveFilters = computed(
  () => !!(filters.status || filters.priority || filters.projectId || filters.search.trim())
)

const statusLabel = (s: string) =>
  ({ todo: 'À faire', inprogress: 'En cours', done: 'Terminé' } as Record<string, string>)[s] || s

const priorityLabel = (p: string) =>
  ({ high: 'Haute', medium: 'Moyenne', low: 'Basse' } as Record<string, string>)[p] || p
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 px-4 py-3">
    <div class="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3">
      <!-- Search -->
      <div class="relative flex-1 min-w-[180px]">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="filters.search"
          type="text"
          placeholder="Rechercher des tâches…"
          class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        />
      </div>

      <!-- Status -->
      <select
        v-model="filters.status"
        class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white min-w-[130px]"
      >
        <option value="">Tous les statuts</option>
        <option value="todo">À faire</option>
        <option value="inprogress">En cours</option>
        <option value="done">Terminé</option>
      </select>

      <!-- Priority -->
      <select
        v-model="filters.priority"
        class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white min-w-[130px]"
      >
        <option value="">Toutes les priorités</option>
        <option value="high">Haute</option>
        <option value="medium">Moyenne</option>
        <option value="low">Basse</option>
      </select>

      <!-- Project filter (conditionally shown) -->
      <select
        v-if="!hideProjectFilter"
        v-model="filters.projectId"
        class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white min-w-[150px]"
      >
        <option value="">Tous les projets</option>
        <option
          v-for="p in projects"
          :key="p._id || p.id"
          :value="p._id || p.id"
        >
          {{ p.name }}
        </option>
      </select>

      <!-- Clear button -->
      <button
        v-if="hasActiveFilters"
        @click="clearFilters"
        class="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Réinitialiser
      </button>
    </div>

    <!-- Active filter chips -->
    <div v-if="hasActiveFilters" class="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-gray-100">
      <span v-if="filters.status" class="inline-flex items-center gap-1 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
        Statut : {{ statusLabel(filters.status) }}
        <button @click="filters.status = ''" class="ml-1 hover:text-indigo-900">&#215;</button>
      </span>
      <span v-if="filters.priority" class="inline-flex items-center gap-1 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
        Priorité : {{ priorityLabel(filters.priority) }}
        <button @click="filters.priority = ''" class="ml-1 hover:text-indigo-900">&#215;</button>
      </span>
      <span v-if="filters.projectId && !hideProjectFilter" class="inline-flex items-center gap-1 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
        Projet : {{ projects.find(p => (p._id || p.id) === filters.projectId)?.name || filters.projectId }}
        <button @click="filters.projectId = ''" class="ml-1 hover:text-indigo-900">&#215;</button>
      </span>
      <span v-if="filters.search.trim()" class="inline-flex items-center gap-1 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
        Recherche : « {{ filters.search }} »
        <button @click="filters.search = ''" class="ml-1 hover:text-indigo-900">&#215;</button>
      </span>
    </div>
  </div>
</template>
