<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Projets' })

const { projects, loading, error, fetchProjects, deleteProject } = useProjects()

const showForm = ref(false)
const editingProject = ref<any>(null)
const deleteConfirmId = ref<string | null>(null)
const deleteLoading = ref(false)

onMounted(() => fetchProjects())

const openCreate = () => {
  editingProject.value = null
  showForm.value = true
}

const openEdit = (project: any) => {
  editingProject.value = { ...project }
  showForm.value = true
}

const handleSaved = () => {
  showForm.value = false
  editingProject.value = null
}

const confirmDelete = (id: string) => {
  deleteConfirmId.value = id
}

const handleDelete = async () => {
  if (!deleteConfirmId.value) return
  deleteLoading.value = true
  try {
    await deleteProject(deleteConfirmId.value)
    deleteConfirmId.value = null
  } catch {
    // error handled in composable
  } finally {
    deleteLoading.value = false
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Mes projets</h1>
        <p class="text-gray-500 text-sm mt-0.5">{{ projects.length }} projet{{ projects.length !== 1 ? 's' : '' }}</p>
      </div>
      <button @click="openCreate" class="btn-primary">
        <span class="text-lg leading-none mr-1">+</span> Nouveau projet
      </button>
    </div>

    <!-- Error -->
    <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
      {{ error }}
    </div>

    <!-- Loading -->
    <div v-if="loading && projects.length === 0" class="flex justify-center py-16">
      <svg class="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && projects.length === 0" class="text-center py-16 bg-white rounded-xl border border-gray-200">
      <div class="text-5xl mb-4">&#128193;</div>
      <h3 class="text-lg font-semibold text-gray-700">Aucun projet pour le moment</h3>
      <p class="text-gray-500 text-sm mt-1 mb-4">Créez votre premier projet pour organiser vos tâches.</p>
      <button @click="openCreate" class="btn-primary">Créer un projet</button>
    </div>

    <!-- Projects Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="project in projects"
        :key="project._id || project.id"
        class="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow flex flex-col"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-xl flex-shrink-0">
            &#128193;
          </div>
          <div class="flex gap-1 ml-2">
            <button
              @click="openEdit(project)"
              class="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Modifier le projet"
            >
              &#9998;
            </button>
            <button
              @click="confirmDelete(project._id || project.id)"
              class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Supprimer le projet"
            >
              &#128465;
            </button>
          </div>
        </div>

        <NuxtLink :to="`/projects/${project._id || project.id}`" class="flex-1">
          <h3 class="font-semibold text-gray-900 hover:text-indigo-600 transition-colors">{{ project.name }}</h3>
          <p v-if="project.description" class="text-sm text-gray-500 mt-1 line-clamp-2">{{ project.description }}</p>
          <p v-else class="text-sm text-gray-400 mt-1 italic">Aucune description</p>
        </NuxtLink>

        <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <span>{{ project.taskCount ?? 0 }} tâche{{ (project.taskCount ?? 0) !== 1 ? 's' : '' }}</span>
          <span>{{ formatDate(project.createdAt) }}</span>
        </div>
      </div>
    </div>

    <!-- Project Form Modal -->
    <ProjectForm
      v-model="showForm"
      :project="editingProject"
      @saved="handleSaved"
    />

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div v-if="deleteConfirmId" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
          <div class="text-center mb-4">
            <div class="text-4xl mb-3">&#9888;</div>
            <h3 class="text-lg font-semibold text-gray-900">Supprimer le projet ?</h3>
            <p class="text-sm text-gray-500 mt-1">Cette action est irréversible. Toutes les tâches associées seront supprimées.</p>
          </div>
          <div class="flex gap-3">
            <button
              @click="deleteConfirmId = null"
              class="flex-1 btn-secondary"
            >
              Annuler
            </button>
            <button
              @click="handleDelete"
              :disabled="deleteLoading"
              class="flex-1 btn-danger"
            >
              {{ deleteLoading ? 'Suppression…' : 'Supprimer' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
