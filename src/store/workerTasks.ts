import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type TaskProof = {
  taskId: string
  fileName: string
  dataUrl: string // base64 data URL for preview/demo
  uploadedAt: string // ISO string
}

interface WorkerTasksState {
  proofs: Record<string, TaskProof>
  setProof: (proof: TaskProof) => void
  removeProof: (taskId: string) => void
  getProofsArray: () => TaskProof[]
}

export const useWorkerTasksStore = create<WorkerTasksState>()(
  persist(
    (set, get) => ({
      proofs: {},
      setProof: (proof) => set((state) => ({ proofs: { ...state.proofs, [proof.taskId]: proof } })),
      removeProof: (taskId) => set((state) => {
        const next = { ...state.proofs }
        delete next[taskId]
        return { proofs: next }
      }),
      getProofsArray: () => Object.values(get().proofs).sort((a,b) => (b.uploadedAt > a.uploadedAt ? 1 : -1)),
    }),
    {
      name: 'worker-tasks-proofs',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
