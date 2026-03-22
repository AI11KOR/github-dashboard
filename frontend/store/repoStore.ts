import { create } from 'zustand'

interface Commit {
  sha: string
  commit: {
    message: string
    author: {
      name: string
      date: string
    }
  }
}

interface RepoInfo {
  stargazers_count: number
  forks_count: number
  language: string
}

interface RepoStore {
  url: string
  owner: string
  repo: string
  summary: string
  commits: Commit[]
  info: RepoInfo | null
  isLoading: boolean
  error: string
  setUrl: (url: string) => void
  setResult: (data: { owner: string; repo: string; summary: string; commits: Commit[]; info: RepoInfo }) => void
  setLoading: (v: boolean) => void
  setError: (msg: string) => void
  reset: () => void
}

export const useRepoStore = create<RepoStore>((set) => ({
  url: '',
  owner: '',
  repo: '',
  summary: '',
  commits: [],
  info: null,
  isLoading: false,
  error: '',
  setUrl: (url) => set({ url }),
  setResult: (data) => set({ ...data }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ summary: '', commits: [], error: '', info: null }),
}))