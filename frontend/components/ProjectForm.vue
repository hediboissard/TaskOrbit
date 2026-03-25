<script setup lang="ts">
interface Props {
  modelValue: boolean
  project?: any
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: []
}>()

const { createProject, updateProject } = useProjects()

const isEdit = computed(() => !!props.project && !!(props.project._id || props.project.id))

const form = reactive({ name: '', description: '' })
const errors = reactive({ name: '' })
const loading = ref(false)
const serverError = ref('')

// Sync form with project prop
watch(
  () => props.project,
  (newProject) => {
    if (newProject) {
      form.name = newProject.name || ''
      form.description = newProject.description || ''
    } else {
      form.name = ''
      form.description = ''
    }
    errors.name = ''
    serverError.value = ''
  },
  { immediate: true }
)

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      // reset on close
      if (!props.project) {
        form.name = ''
        form.description = ''
      }
      errors.name = ''
      serverError.value = ''
    }
  }
)

const close = () => emit('update:modelValue', false)

const validate = () => {
  errors.name = ''
  if (!form.name.trim()) {
    errors.name = 'Le nom du projet est obligatoire'
    return false
  }
  return true
}

const handleSubmit = async () => {
  if (!validate()) return
  loading.value = true
  serverError.value = ''
  try {
    if (isEdit.value) {
      await updateProject(props.project._id || props.project.id, { name: form.name, description: form.description })
    } else {
      await createProject({ name: form.name, description: form.description })
    }
    emit('saved')
    close()
  } catch (err: any) {
    serverError.value = err.message || 'Impossible d’enregistrer le projet'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="close">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-900">
              {{ isEdit ? 'Modifier le projet' : 'Nouveau projet' }}
            </h2>
            <button @click="close" class="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 py-5">
            <!-- Server Error -->
            <div v-if="serverError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {{ serverError }}
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Name -->
              <div>
                <label for="project-name" class="block text-sm font-medium text-gray-700 mb-1">
                  Nom du projet <span class="text-red-500">*</span>
                </label>
                <input
                  id="project-name"
                  v-model="form.name"
                  type="text"
                  placeholder="ex. Refonte du site web"
                  class="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  :class="errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'"
                />
                <p v-if="errors.name" class="mt-1 text-xs text-red-600">{{ errors.name }}</p>
              </div>

              <!-- Description -->
              <div>
                <label for="project-description" class="block text-sm font-medium text-gray-700 mb-1">
                  Description <span class="text-gray-400 font-normal">(facultatif)</span>
                </label>
                <textarea
                  id="project-description"
                  v-model="form.description"
                  rows="3"
                  placeholder="Brève description du projet…"
                  class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors resize-none"
                />
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
              {{ loading ? 'Enregistrement…' : (isEdit ? 'Enregistrer' : 'Créer le projet') }}
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
