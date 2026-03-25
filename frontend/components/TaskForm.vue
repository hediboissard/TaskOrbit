<script setup lang="ts">
interface Props {
  modelValue: boolean
  task?: any
  projectId?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: []
}>()

const { createTask, updateTask } = useTasks()
const { projects, fetchProjects } = useProjects()

const isEdit = computed(() => !!props.task && !!(props.task._id || props.task.id))

const form = reactive({
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo',
  deadline: '',
  projectId: '',
})

const errors = reactive({ title: '', projectId: '' })
const loading = ref(false)
const serverError = ref('')

onMounted(() => fetchProjects())

const syncForm = () => {
  if (props.task) {
    form.title = props.task.title || ''
    form.description = props.task.description || ''
    form.priority = props.task.priority || 'medium'
    form.status = props.task.status || 'todo'
    form.deadline = props.task.deadline ? props.task.deadline.split('T')[0] : ''
    const tProjId = props.task.projectId?._id || props.task.projectId?.id || props.task.projectId || ''
    form.projectId = tProjId
  } else {
    form.title = ''
    form.description = ''
    form.priority = 'medium'
    form.status = 'todo'
    form.deadline = ''
    form.projectId = props.projectId || ''
  }
  errors.title = ''
  errors.projectId = ''
  serverError.value = ''
}

watch(() => props.task, syncForm, { immediate: true })
watch(() => props.projectId, (v) => { if (!props.task) form.projectId = v || '' })
watch(() => props.modelValue, (val) => { if (val) syncForm() })

const close = () => emit('update:modelValue', false)

const validate = () => {
  errors.title = ''
  errors.projectId = ''
  if (!form.title.trim()) {
    errors.title = 'Le titre de la tâche est obligatoire'
    return false
  }
  if (!form.projectId) {
    errors.projectId = 'Veuillez sélectionner un projet (chaque tâche doit être rattachée à un projet)'
    return false
  }
  return true
}

const handleSubmit = async () => {
  if (!validate()) return
  loading.value = true
  serverError.value = ''
  try {
    const payload: any = {
      title: form.title.trim(),
      description: form.description,
      priority: form.priority,
      status: form.status,
      projectId: form.projectId,
    }
    if (form.deadline) {
      payload.deadline = new Date(`${form.deadline}T12:00:00`).toISOString()
    }

    if (isEdit.value) {
      const fallbackProj =
        props.task.projectId?._id || props.task.projectId?.id || props.task.projectId
      if (!payload.projectId && fallbackProj) payload.projectId = String(fallbackProj)
      await updateTask(props.task._id || props.task.id, payload)
    } else {
      await createTask(payload)
    }
    emit('saved')
    close()
  } catch (err: any) {
    serverError.value = err.message || 'Impossible d’enregistrer la tâche'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="close">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
            <h2 class="text-lg font-semibold text-gray-900">
              {{ isEdit ? 'Modifier la tâche' : 'Nouvelle tâche' }}
            </h2>
            <button @click="close" class="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 py-5">
            <div v-if="serverError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {{ serverError }}
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Title -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Titre <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.title"
                  type="text"
                  placeholder="ex. Maquette page d’accueil"
                  class="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  :class="errors.title ? 'border-red-400 bg-red-50' : 'border-gray-300'"
                />
                <p v-if="errors.title" class="mt-1 text-xs text-red-600">{{ errors.title }}</p>
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  placeholder="Détails de la tâche…"
                  class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors resize-none"
                />
              </div>

              <!-- Priority + Status row -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                  <select
                    v-model="form.priority"
                    class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="low">Basse</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    v-model="form.status"
                    class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="todo">À faire</option>
                    <option value="inprogress">En cours</option>
                    <option value="done">Terminé</option>
                  </select>
                </div>
              </div>

              <!-- Deadline -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date limite</label>
                <input
                  v-model="form.deadline"
                  type="date"
                  class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <!-- Project -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Projet <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.projectId"
                  class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  :class="errors.projectId ? 'border-red-400 bg-red-50' : ''"
                >
                  <option disabled value="">Choisir un projet</option>
                  <option
                    v-for="p in projects"
                    :key="p._id || p.id"
                    :value="String(p._id || p.id)"
                  >
                    {{ p.name }}
                  </option>
                </select>
                <p v-if="!projects.length" class="mt-1 text-xs text-amber-600">
                  Aucun projet pour le moment. Créez d’abord un projet depuis la page Projets.
                </p>
                <p v-if="errors.projectId" class="mt-1 text-xs text-red-600">{{ errors.projectId }}</p>
              </div>
            </form>
          </div>

          <!-- Footer -->
          <div class="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            <button @click="close" class="flex-1 btn-secondary">Annuler</button>
            <button
              @click="handleSubmit"
              :disabled="loading"
              class="flex-1 btn-primary"
            >
              <svg v-if="loading" class="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {{ loading ? 'Enregistrement…' : (isEdit ? 'Enregistrer' : 'Créer la tâche') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
