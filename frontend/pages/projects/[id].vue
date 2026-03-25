<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const projectId = computed(() => route.params.id as string)

const { projects, fetchProjects, updateProject } = useProjects()
const { tasks, loading: tasksLoading, fetchTasks, createTask, updateTask, updateTaskStatus, deleteTask } = useTasks()

const project = computed(() =>
  projects.value.find((p) => (p._id || p.id) === projectId.value)
)

useHead({
  title: computed(() => project.value?.name || 'Projet'),
})

const showTaskForm = ref(false)
const editingTask = ref<any>(null)
const showEditProject = ref(false)

const activeFilters = ref<any>({})

const filteredTasks = computed(() => {
  let list = tasks.value.filter((t) => {
    const tProjId = t.projectId?._id || t.projectId?.id || t.projectId
    return tProjId === projectId.value
  })

  if (activeFilters.value.status) list = list.filter((t) => t.status === activeFilters.value.status)
  if (activeFilters.value.priority) list = list.filter((t) => t.priority === activeFilters.value.priority)
  if (activeFilters.value.search) {
    const s = activeFilters.value.search.toLowerCase()
    list = list.filter((t) => t.title?.toLowerCase().includes(s) || t.description?.toLowerCase().includes(s))
  }

  return list
})

onMounted(async () => {
  await fetchProjects()
  await fetchTasks({ projectId: projectId.value })
})

const openCreateTask = () => {
  editingTask.value = null
  showTaskForm.value = true
}

const openEditTask = (task: any) => {
  editingTask.value = { ...task }
  showTaskForm.value = true
}

const handleTaskSaved = () => {
  showTaskForm.value = false
  editingTask.value = null
}

const handleStatusChange = async (taskId: string, newStatus: string) => {
  await updateTaskStatus(taskId, newStatus)
}

const handleDeleteTask = async (taskId: string) => {
  await deleteTask(taskId)
}

const handleFilter = (filters: any) => {
  activeFilters.value = filters
}
</script>

<template>
  <div>
    <!-- Back link -->
    <NuxtLink to="/projects" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-4 transition-colors">
      &#8592; Retour aux projets
    </NuxtLink>

    <!-- Project Header -->
    <div v-if="project" class="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ project.name }}</h1>
          <p v-if="project.description" class="text-gray-500 mt-1">{{ project.description }}</p>
          <p v-else class="text-gray-400 mt-1 italic text-sm">Aucune description</p>
        </div>
        <button
          @click="showEditProject = true"
          class="btn-secondary flex items-center gap-1.5"
        >
          &#9998; Modifier le projet
        </button>
      </div>
    </div>

    <!-- Loading state for project -->
    <div v-else class="bg-white rounded-xl border border-gray-200 p-6 mb-6 animate-pulse">
      <div class="h-7 bg-gray-200 rounded w-48 mb-2" />
      <div class="h-4 bg-gray-100 rounded w-72" />
    </div>

    <!-- Tasks section header -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-800">Tâches</h2>
      <button @click="openCreateTask" class="btn-primary">
        <span class="text-lg leading-none mr-1">+</span> Ajouter une tâche
      </button>
    </div>

    <!-- Filter -->
    <div class="mb-4">
      <TaskFilter @filter="handleFilter" :hide-project-filter="true" />
    </div>

    <!-- Kanban Board -->
    <TaskKanban
      :tasks="filteredTasks"
      @edit="openEditTask"
      @delete="handleDeleteTask"
      @status-change="handleStatusChange"
    />

    <!-- Task Form Modal -->
    <TaskForm
      v-model="showTaskForm"
      :task="editingTask"
      :project-id="projectId"
      @saved="handleTaskSaved"
    />

    <!-- Edit Project Modal -->
    <ProjectForm
      v-model="showEditProject"
      :project="project"
      @saved="showEditProject = false"
    />
  </div>
</template>
