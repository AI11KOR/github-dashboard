'use client'

import { useRouter } from 'next/navigation'
import { useRepoStore } from '@/store/repoStore'

export default function Home() {
  const router = useRouter()
  const { url, setUrl, setResult, setLoading, setError, reset, isLoading, error } = useRepoStore()

  const handleAnalyze = async () => {
    if (!url.trim()) return
    reset()
    setLoading(true)

    try {
      // const res = await fetch('http://localhost:5000/api/analyze', {
        const res = await fetch('https://github-dashboard-backend-e45d.onrender.com/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      setResult({
        owner: data.owner,
        repo: data.repo,
        summary: data.summary,
        commits: data.commits,
        info: data.info,
      })
      router.push('/dashboard')
    } catch (e) {
      setError('분석 중 오류가 발생했어요. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-xl">

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold text-white mb-2">
            GitHub Repo 분석기
          </h1>
          <p className="text-gray-400 text-sm">
            repo 주소를 넣으면 AI가 3초 만에 요약해드려요
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            placeholder="https://github.com/facebook/react"
            className="flex-1 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-500"
          />
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="bg-white text-gray-950 font-medium text-sm px-5 py-3 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition"
          >
            {isLoading ? '분석 중...' : '분석하기'}
          </button>
        </div>

        {error && (
          <p className="mt-3 text-red-400 text-sm text-center">
            {error}
          </p>
        )}
      
        {isLoading && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">GitHub 데이터 수집 중...</p>
          </div>
        )}

        <p className="mt-4 text-center text-gray-600 text-xs">
          예시: https://github.com/vercel/next.js
        </p>
      </div>
    </main>
  )
}