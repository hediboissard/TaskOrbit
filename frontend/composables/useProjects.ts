import { ref } from 'vue'

const projects = ref<any[]>([])

export const useProjects = () => {
  const api = useApi()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProjects = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await api.get('/projects')
      projects.value = data.projects || data
    } catch (err: any) {
      error.value = err.message || 'Impossible de charger les projets'
    } finally {
      loading.value = false
    }
  }

  const createProject = async (projectData: { name: string; description?: string }) => {
    loading.value = true
    error.value = null
    try {
      const data = await api.post('/projects', projectData)
      const newProject = data.project || data
      projects.value.push(newProject)
      return newProject
    } catch (err: any) {
      error.value = err.message || 'Impossible de créer le projet'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProject = async (id: string, projectData: { name?: string; description?: string }) => {
    loading.value = true
    error.value = null
    try {
      const data = await api.put(`/projects/${id}`, projectData)
      const updated = data.project || data
      const index = projects.value.findIndex((p) => p._id === id || p.id === id)
      if (index !== -1) projects.value[index] = updated
      return updated
    } catch (err: any) {
      error.value = err.message || 'Impossible de mettre à jour le projet'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteProject = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await api.del(`/projects/${id}`)
      projects.value = projects.value.filter((p) => p._id !== id && p.id !== id)
    } catch (err: any) {
      error.value = err.message || 'Impossible de supprimer le projet'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  }
}
