'use client'
// app/dashboard/page.js

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ players: 0, assessments: 0 })
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
    } else {
      setUser(user)
      await loadStats()
    }
    setLoading(false)
  }

  async function loadStats() {
    // تعداد بازیکنان
    const { count: playersCount } = await supabase
      .from('players')
      .select('*', { count: 'exact', head: true })
    
    // تعداد ارزیابی‌های امروز
    const today = new Date().toISOString().split('T')[0]
    const { count: assessmentsCount } = await supabase
      .from('assessments')
      .select('*', { count: 'exact', head: true })
      .gte('session_date', today)
    
    setStats({ 
      players: playersCount || 0, 
      assessments: assessmentsCount || 0 
    })
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return <div className="text-center p-8">در حال بارگذاری...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">داشبورد آکادمی</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              خروج
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* کارت‌های آماری */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.players}</div>
            <div className="text-gray-600">تعداد بازیکنان</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{stats.assessments}</div>
            <div className="text-gray-600">ارزیابی امروز</div>
          </div>
        </div>
        
        {/* دکمه‌های اقدام */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/register-player">
            <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg cursor-pointer">
              <div className="text-2xl mb-2">📝</div>
              <div className="font-bold">ثبت بازیکن جدید</div>
              <div className="text-gray-500 text-sm">افزودن بازیکن به آکادمی</div>
            </div>
          </Link>
          
          <Link href="/assessment">
            <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg cursor-pointer">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-bold">ارزیابی تمرین</div>
              <div className="text-gray-500 text-sm">ثبت ارزیابی روزانه</div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}