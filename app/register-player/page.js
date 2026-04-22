'use client'
// app/page.js


import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">آکادمی استقلال دوشنبه</h1>
        <Link href="/login" className="text-blue-600 underline">
          ورود به پنل مربیان
        </Link>
      </div>
    </div>
  )
}