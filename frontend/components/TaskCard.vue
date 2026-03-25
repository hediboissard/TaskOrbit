<script setup lang="ts">
interface Props {
  task: any
  isDragging?: boolean
}

const props = withDefaults(defineProps<Props>(), { isDragging: false })
const emit = defineEmits<{
  edit: [task: any]
  delete: [taskId: string]
  statusChange: [taskId: string, newStatus: string]
  dragStart: [taskId: string]
  dragEnd: []
}>()

const priorityConfig: Record<string, { label: string; classes: string }> = {
  high: { label: 'Haute', classes: 'bg-red-100 text-red-700 border-red-200' },
  medium: { label: 'Moyenne', classes: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  low: { label: 'Basse', classes: 'bg-green-100 text-green-700 border-green-200' },
}

const statusOptions = [
  { value: 'todo', label: 'À faire' },
  { value: 'inprogress', label: 'En cours' },
  { value: 'done', label: 'Terminé' },
]

const priority = computed(() => priorityConfig[props.task.priority] || priorityConfig.medium)

const isOverdue = computed(() => {
  if (!props.task.deadline) return false
  const deadline = new Date(props.task.deadline)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return deadline < today && props.task.status !== 'done'
})

const formattedDeadline = computed(() => {
  if (!props.task.deadline) return null
  return new Date(props.task.deadline).toLocaleDateString('fr-FR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
})

const projectName = computed(() => {
  const p = props.task.projectId
  if (!p) return null
  return typeof p === 'object' ? p.name : null
})

const taskId = computed(() => props.task._id || props.task.id)

const nextStatuses = computed(() => {
  return statusOptions.filter((s) => s.value !== props.task.status)
})

const onDragStart = (e: DragEvent) => {
  if (!e.dataTransfer) return
  const id = String(taskId.value)
  e.dataTransfer.setData('text/plain', id)
  e.dataTransfer.effectAllowed = 'move'
  emit('dragStart', id)
}

const onDragEnd = () => {
  emit('dragEnd')
}
</script>

<template>
  <div
    draggable="true"
    class="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow group cursor-grab active:cursor-grabbing select-none"
    :class="{ 'opacity-50 ring-2 ring-indigo-300 scale-[0.98]': isDragging }"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <!-- Top row: priority badge + actions -->
    <div class="flex items-center justify-between mb-2">
      <span
        :class="['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', priority.classes]"
      >
        {{ priority.label }}
      </span>
      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          draggable="false"
          @click="emit('edit', task)"
          class="p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
          title="Modifier la tâche"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          type="button"
          draggable="false"
          @click="emit('delete', taskId)"
          class="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Supprimer la tâche"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Title -->
    <h4 class="font-medium text-gray-900 text-sm leading-snug mb-1 line-clamp-2">{{ task.title }}</h4>

    <!-- Description -->
    <p v-if="task.description" class="text-xs text-gray-500 line-clamp-2 mb-2">{{ task.description }}</p>

    <!-- Project name -->
    <div v-if="projectName" class="mb-2">
      <span class="inline-flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
        &#128193; {{ projectName }}
      </span>
    </div>

    <!-- Deadline -->
    <div v-if="formattedDeadline" class="flex items-center gap-1 mb-3">
      <svg class="w-3 h-3 flex-shrink-0" :class="isOverdue ? 'text-red-500' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span :class="['text-xs', isOverdue ? 'text-red-600 font-medium' : 'text-gray-500']">
        {{ isOverdue ? 'En retard : ' : '' }}{{ formattedDeadline }}
      </span>
    </div>

    <!-- Status change buttons -->
    <div class="flex flex-wrap gap-1 pt-2 border-t border-gray-100">
      <button
        v-for="s in nextStatuses"
        :key="s.value"
        type="button"
        draggable="false"
        @click="emit('statusChange', taskId, s.value)"
        class="text-xs px-2 py-1 rounded-lg border transition-colors"
        :class="{
          'border-gray-300 text-gray-600 hover:bg-gray-100': s.value === 'todo',
          'border-orange-300 text-orange-600 hover:bg-orange-50': s.value === 'inprogress',
          'border-green-300 text-green-600 hover:bg-green-50': s.value === 'done',
        }"
      >
        &#8594; {{ s.label }}
      </button>
    </div>
  </div>
</template>
