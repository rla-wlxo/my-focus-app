'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white px-6 py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <section className="space-y-6 lg:max-w-2xl">
          <p className="inline-flex rounded-full bg-blue-500/15 px-4 py-2 text-sm font-medium text-blue-200 ring-1 ring-blue-500/20">
            FocusTracker
          </p>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            쉽고 빠르게 iPhone 앱과 페어링하세요.
          </h1>

          <p className="max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
            버튼을 눌러 6자리 페어링 코드를 생성하고, 아이폰 앱에서 입력하면 자동으로 연결됩니다. 시선 추적과 심박수 연동을 간편하게 시작해보세요.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push('/tracker')}
              className="inline-flex items-center justify-center rounded-2xl bg-blue-500 px-6 py-4 text-base font-semibold text-white shadow-xl shadow-blue-500/20 transition hover:bg-blue-400"
            >
              페어링 시작하기
            </button>
            <button
              type="button"
              onClick={() => router.push('/result')}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-600 bg-slate-900/80 px-6 py-4 text-base font-semibold text-slate-200 transition hover:border-slate-400 hover:text-white"
            >
              결과 페이지 보기
            </button>
          </div>
        </section>

        <section className="grid gap-5 rounded-[2rem] bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/50 ring-1 ring-white/5 lg:w-[540px]">
          <div className="rounded-3xl bg-gradient-to-r from-blue-500/15 via-slate-900 to-slate-950 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">페어링 안내</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">아이폰과의 연결을 간편하게</h2>
            <p className="mt-2 text-slate-300">
              페어링 버튼을 누르면 6자리 코드를 바로 생성합니다. 아이폰 앱을 열고 해당 코드를 입력하면 연결 상태를 바로 확인할 수 있습니다.
            </p>
          </div>

          <div className="rounded-3xl bg-slate-950/80 p-6">
            <h3 className="text-lg font-semibold text-white">주요 기능</h3>
            <ul className="mt-4 space-y-3 text-slate-300">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                <span>아이폰 앱 전용 6자리 코드 생성</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-sky-400"></span>
                <span>연결 대기 상태 및 활성화 상태 실시간 확인</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-violet-400"></span>
                <span>페어링 후 심박수 측정 결과 확인</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}

