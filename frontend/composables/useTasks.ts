import { ref } from 'vue'

const tasks = ref<any[]>([])

export const useTasks = () => {
  const api = useApi()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchTasks = async (filters?: { projectId?: string; status?: string; priority?: string }) => {
    loading.value = true
    error.value = null
    try {
      let path = '/tasks'
      if (filters) {
        const params = new URLSearchParams()
        if (filters.projectId) params.append('projectId', filters.projectId)
        if (filters.status) params.append('status', filters.status)
        if (filters.priority) params.append('priority', filters.priority)
        const qs = params.toString()
        if (qs) path += `?${qs}`
      }
      const data = await api.get(path)
      tasks.value = data.tasks || data
    } catch (err: any) {
      error.value = err.message || 'Impossible de charger les tâches'
    } finally {
      loading.value = false
    }
  }

  const createTask = async (taskData: {
    title: string
    description?: string
    priority?: string
    status?: string
    deadline?: string
    projectId?: string
  }) => {
    loading.value = true
    error.value = null
    try {
      const data = await api.post('/tasks', taskData)
      const newTask = data.task || data
      tasks.value.push(newTask)
      return newTask
    } catch (err: any) {
      error.value = err.message || 'Impossible de créer la tâche'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTask = async (id: string, taskData: any) => {
    loading.value = true
    error.value = null
    try {
      const data = await api.put(`/tasks/${id}`, taskData)
      const updated = data.task || data
      const index = tasks.value.findIndex((t) => t._id === id || t.id === id)
      if (index !== -1) tasks.value[index] = updated
      return updated
    } catch (err: any) {
      error.value = err.message || 'Impossible de mettre à jour la tâche'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTaskStatus = async (id: string, status: string) => {
    loading.value = true
    error.value = null
    try {
      const data = await api.patch(`/tasks/${id}/status`, { status })
      const updated = data.task || data
      const index = tasks.value.findIndex((t) => t._id === id || t.id === id)
      if (index !== -1) tasks.value[index] = { ...tasks.value[index], ...updated }
      return updated
    } catch (err: any) {
      error.value = err.message || 'Impossible de mettre à jour le statut'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTask = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await api.del(`/tasks/${id}`)
      tasks.value = tasks.value.filter((t) => t._id !== id && t.id !== id)
    } catch (err: any) {
      error.value = err.message || 'Impossible de supprimer la tâche'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
  }
}
