<script setup lang="ts">
interface Props {
  tasks: any[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  edit: [task: any]
  delete: [taskId: string]
  statusChange: [taskId: string, newStatus: string]
}>()

const columns = [
  {
    key: 'todo',
    label: 'À faire',
    headerClasses: 'bg-blue-50 border-blue-200 text-blue-800',
    countClasses: 'bg-blue-200 text-blue-900',
    emptyText: 'Aucune tâche à faire',
  },
  {
    key: 'inprogress',
    label: 'En cours',
    headerClasses: 'bg-orange-50 border-orange-200 text-orange-800',
    countClasses: 'bg-orange-200 text-orange-900',
    emptyText: 'Aucune tâche en cours',
  },
  {
    key: 'done',
    label: 'Terminé',
    headerClasses: 'bg-green-50 border-green-200 text-green-800',
    countClasses: 'bg-green-200 text-green-900',
    emptyText: 'Aucune tâche terminée',
  },
]

const getColumnTasks = (status: string) =>
  props.tasks.filter((t) => t.status === status)

const draggingTaskId = ref<string | null>(null)
const dragOverColumn = ref<string | null>(null)

const onColumnDragOver = (e: DragEvent, columnKey: string) => {
  e.preventDefault()
  dragOverColumn.value = columnKey
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
}

const onColumnDrop = (e: DragEvent, targetStatus: string) => {
  e.preventDefault()
  dragOverColumn.value = null
  const id = e.dataTransfer?.getData('text/plain')
  if (!id) return
  const task = props.tasks.find((t) => String(t._id || t.id) === id)
  if (!task || task.status === targetStatus) return
  emit('statusChange', id, targetStatus)
}

const clearDragState = () => {
  draggingTaskId.value = null
  dragOverColumn.value = null
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div
      v-for="column in columns"
      :key="column.key"
      class="flex flex-col min-h-[400px]"
    >
      <!-- Column Header -->
      <div
        :class="['flex items-center justify-between px-4 py-2.5 rounded-t-xl border', column.headerClasses]"
      >
        <span class="font-semibold text-sm">{{ column.label }}</span>
        <span
          :class="['inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold', column.countClasses]"
        >
          {{ getColumnTasks(column.key).length }}
        </span>
      </div>

      <!-- Column Body (drop zone) -->
      <div
        class="flex-1 bg-gray-50 rounded-b-xl border border-t-0 border-gray-200 p-3 space-y-3 min-h-[280px] transition-colors"
        :class="{
          'bg-indigo-50/80 ring-2 ring-inset ring-indigo-300': dragOverColumn === column.key,
        }"
        @dragover="onColumnDragOver($event, column.key)"
        @drop="onColumnDrop($event, column.key)"
      >
        <!-- Empty State (ne capte pas le drop pour laisser la zone parente) -->
        <div
          v-if="getColumnTasks(column.key).length === 0"
          class="pointer-events-none flex items-center justify-center h-32 text-gray-400 text-sm italic border-2 border-dashed border-gray-200 rounded-xl"
        >
          {{ column.emptyText }}
        </div>

        <TaskCard
          v-for="task in getColumnTasks(column.key)"
          :key="task._id || task.id"
          :task="task"
          :is-dragging="draggingTaskId === String(task._id || task.id)"
          @edit="emit('edit', $event)"
          @delete="emit('delete', $event)"
          @status-change="(taskId, newStatus) => emit('statusChange', taskId, newStatus)"
          @drag-start="(id) => (draggingTaskId = id)"
          @drag-end="clearDragState"
        />
      </div>
    </div>
  </div>
</template>
