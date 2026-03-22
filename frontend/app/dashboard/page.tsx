'use client'

import { useRouter } from 'next/navigation'
import { useRepoStore } from '@/store/repoStore'

export default function Dashboard() {
  const router = useRouter()
  const { owner, repo, summary, commits, info } = useRepoStore()

  // 데이터 없으면 홈으로
  if (!summary) {
    router.push('/')
    return null
  }

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-12">
      <div className="max-w-2xl mx-auto">

        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-gray-500 text-sm mb-1">분석 결과</p>
            <h1 className="text-white text-xl font-semibold">
              {owner}/{repo}
            </h1>
          </div>
          <button
            onClick={() => router.push('/')}
            className="text-gray-500 text-sm hover:text-white transition"
          >
            다시 분석하기
          </button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                <p className="text-yellow-400 text-lg font-semibold">
                    ⭐ {info?.stargazers_count?.toLocaleString() ?? '-'}
                </p>
                <p className='text-gray-500 text-xs mt-1'>Stars</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                <p className="text-blue-400 text-lg font-semibold">
                    🍴 {info?.forks_count?.toLocaleString() ?? '-'}
                </p>
                <p className='text-gray-500 text-xs mt-1'>Forks</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                <p className="text-green-400 text-lg font-semibold">
                    💻 {info?.language ?? '-'}
                </p>
                <p className="text-gray-500 text-xs mt-1">언어</p>
            </div>
        </div>

        {/* AI 요약 */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-4">
          <p className="text-gray-400 text-xs font-medium mb-3">AI 요약</p>
          <p className="text-white text-sm leading-relaxed whitespace-pre-line">
            {summary}
          </p>
        </div>

        {/* 커밋 목록 */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-xs font-medium mb-4">최근 커밋</p>
          <div className="space-y-3">
            {commits.slice(0, 10).map((c) => (
              <div key={c.sha} className="flex gap-3 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">
                    {c.commit.message.split('\n')[0]}
                  </p>
                  <p className="text-gray-600 text-xs mt-0.5">
                    {c.commit.author.name} · {new Date(c.commit.author.date).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}