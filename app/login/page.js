'use client'
// app/login/page.js


import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      setMessage('❌ ' + error.message)
    } else {
      setMessage('✅ ورود موفق! در حال انتقال...')
      setTimeout(() => router.push('/dashboard'), 1000)
    }
    setLoading(false)
  }

  async function handleSignUp(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: 'مربی جدید',
          role: 'coach'
        }
      }
    })

    if (error) {
      setMessage('❌ ' + error.message)
    } else {
      setMessage('✅ ثبت‌نام موفق! ایمیل خود را بررسی کنید.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">
          آکادمی استقلال دوشنبه
        </h1>
        <h2 className="text-xl text-center mb-6">ورود مربیان</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">ایمیل</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">رمز عبور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
          >
            {loading ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={handleSignUp}
            disabled={loading}
            className="text-blue-600 hover:underline"
          >
            ثبت‌نام مربی جدید
          </button>
        </div>
        
        {message && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg text-center">
            {message}
          </div>
        )}
      </div>
    </div>
  )
}