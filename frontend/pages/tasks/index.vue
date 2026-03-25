<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Tâches' })

const { tasks, loading, error, fetchTasks, updateTaskStatus, deleteTask } = useTasks()
const { fetchProjects } = useProjects()

const showTaskForm = ref(false)
const editingTask = ref<any>(null)
const activeFilters = ref<any>({})

onMounted(async () => {
  await Promise.all([fetchTasks(), fetchProjects()])
})

const filteredTasks = computed(() => {
  let list = [...tasks.value]

  if (activeFilters.value.status) list = list.filter((t) => t.status === activeFilters.value.status)
  if (activeFilters.value.priority) list = list.filter((t) => t.priority === activeFilters.value.priority)
  if (activeFilters.value.projectId) {
    list = list.filter((t) => {
      const tProjId = t.projectId?._id || t.projectId?.id || t.projectId
      return tProjId === activeFilters.value.projectId
    })
  }
  if (activeFilters.value.search) {
    const s = activeFilters.value.search.toLowerCase()
    list = list.filter((t) => t.title?.toLowerCase().includes(s) || t.description?.toLowerCase().includes(s))
  }

  return list
})

const openCreate = () => {
  editingTask.value = null
  showTaskForm.value = true
}

const openEdit = (task: any) => {
  editingTask.value = { ...task }
  showTaskForm.value = true
}

const handleSaved = () => {
  showTaskForm.value = false
  editingTask.value = null
}

const handleStatusChange = async (taskId: string, newStatus: string) => {
  await updateTaskStatus(taskId, newStatus)
}

const handleDelete = async (taskId: string) => {
  await deleteTask(taskId)
}

const handleFilter = (filters: any) => {
  activeFilters.value = filters
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Toutes les tâches</h1>
        <p class="text-gray-500 text-sm mt-0.5">{{ filteredTasks.length }} tâche{{ filteredTasks.length !== 1 ? 's' : '' }}</p>
      </div>
      <button @click="openCreate" class="btn-primary">
        <span class="text-lg leading-none mr-1">+</span> Nouvelle tâche
      </button>
    </div>

    <!-- Error -->
    <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
      {{ error }}
    </div>

    <!-- Filter Bar -->
    <div class="mb-6">
      <TaskFilter @filter="handleFilter" />
    </div>

    <!-- Loading -->
    <div v-if="loading && tasks.length === 0" class="flex justify-center py-16">
      <svg class="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>

    <!-- Kanban Board -->
    <TaskKanban
      v-else
      :tasks="filteredTasks"
      @edit="openEdit"
      @delete="handleDelete"
      @status-change="handleStatusChange"
    />

    <!-- Task Form Modal -->
    <TaskForm
      v-model="showTaskForm"
      :task="editingTask"
      @saved="handleSaved"
    />
  </div>
</template>
