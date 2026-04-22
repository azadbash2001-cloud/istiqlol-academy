'use client'
// app/assessment/page.js


import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AssessmentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [players, setPlayers] = useState([])
  const [formData, setFormData] = useState({
    player_id: '',
    session_date: new Date().toISOString().slice(0, 16),
    session_type: 'تمرین فنی',
    rpe_borg: 5,
    fatigue_index: 5,
    sleep_quality: 7,
    technique_score: 7,
    intelligence_score: 7,
    physical_score: 7,
    mental_score: 7,
    personality_score: 7,
    commitment_score: 7,
    coach_notes: ''
  })

  // بررسی احراز هویت و بارگذاری لیست بازیکنان
  useEffect(() => {
    checkUser()
    loadPlayers()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
    }
  }

  async function loadPlayers() {
    const { data, error } = await supabase
      .from('players')
      .select('id, full_name, player_code, age_group')
      .order('full_name')
    
    if (error) {
      console.error('خطا در بارگذاری بازیکنان:', error)
    } else {
      setPlayers(data || [])
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setMessage('❌ لطفاً ابتدا وارد شوید')
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('assessments')
      .insert([{
        player_id: formData.player_id,
        coach_name: user.email,
        session_date: formData.session_date,
        session_type: formData.session_type,
        rpe_borg: parseInt(formData.rpe_borg),
        fatigue_index: parseInt(formData.fatigue_index),
        sleep_quality: parseInt(formData.sleep_quality),
        technique_score: parseInt(formData.technique_score),
        intelligence_score: parseInt(formData.intelligence_score),
        physical_score: parseInt(formData.physical_score),
        mental_score: parseInt(formData.mental_score),
        personality_score: parseInt(formData.personality_score),
        commitment_score: parseInt(formData.commitment_score),
        coach_notes: formData.coach_notes
      }])

    if (error) {
      setMessage('❌ خطا در ثبت ارزیابی: ' + error.message)
    } else {
      setMessage('✅ ارزیابی با موفقیت ثبت شد!')
      // بازنشانی فرم
      setFormData({
        player_id: '',
        session_date: new Date().toISOString().slice(0, 16),
        session_type: 'تمرین فنی',
        rpe_borg: 5,
        fatigue_index: 5,
        sleep_quality: 7,
        technique_score: 7,
        intelligence_score: 7,
        physical_score: 7,
        mental_score: 7,
        personality_score: 7,
        commitment_score: 7,
        coach_notes: ''
      })
      
      // بعد از ۲ ثانیه به داشبورد برمی‌گردد
      setTimeout(() => router.push('/dashboard'), 2000)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto">
        {/* دکمه بازگشت */}
        <div className="mb-4">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            ← بازگشت به داشبورد
          </Link>
        </div>
        
        {/* فرم ارزیابی */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-center mb-6">
            ارزیابی روزانه تمرین
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* بخش اطلاعات پایه */}
            <div className="border-b pb-4 mb-4">
              <h2 className="text-lg font-bold mb-4 text-gray-700">📋 اطلاعات پایه</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">بازیکن *</label>
                  <select
                    name="player_id"
                    value={formData.player_id}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">انتخاب کنید</option>
                    {players.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.full_name} - {p.age_group} - {p.player_code}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">تاریخ و زمان *</label>
                  <input
                    name="session_date"
                    type="datetime-local"
                    value={formData.session_date}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">نوع جلسه</label>
                  <select
                    name="session_type"
                    value={formData.session_type}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  >
                    <option>تمرین فنی</option>
                    <option>تمرین تاکتیکی</option>
                    <option>مسابقه</option>
                    <option>آماده‌سازی</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* بخش شاخص‌های فشار و خستگی */}
            <div className="border-b pb-4 mb-4">
              <h2 className="text-lg font-bold mb-4 text-gray-700">💪 شاخص‌های فشار و خستگی</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">RPE بورگ (۰-۱۰)</label>
                  <input
                    name="rpe_borg"
                    type="range"
                    min="0"
                    max="10"
                    value={formData.rpe_borg}
                    onChange={handleChange}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600">{formData.rpe_borg}</div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">شاخص خستگی (۱-۱۰)</label>
                  <input
                    name="fatigue_index"
                    type="range"
                    min="1"
                    max="10"
                    value={formData.fatigue_index}
                    onChange={handleChange}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600">{formData.fatigue_index}</div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">کیفیت خواب (۱-۱۰)</label>
                  <input
                    name="sleep_quality"
                    type="range"
                    min="1"
                    max="10"
                    value={formData.sleep_quality}
                    onChange={handleChange}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600">{formData.sleep_quality}</div>
                </div>
              </div>
            </div>
            
            {/* بخش ارزیابی شش‌محوره */}
            <div className="border-b pb-4 mb-4">
              <h2 className="text-lg font-bold mb-4 text-gray-700">📊 ارزیابی شش‌محوره (۱-۱۰)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">تکنیک</label>
                  <input
                    name="technique_score"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.technique_score}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">هوش بازی</label>
                  <input
                    name="intelligence_score"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.intelligence_score}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">فیزیک</label>
                  <input
                    name="physical_score"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.physical_score}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">ذهن</label>
                  <input
                    name="mental_score"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.mental_score}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">شخصیت</label>
                  <input
                    name="personality_score"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.personality_score}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">تعهد</label>
                  <input
                    name="commitment_score"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.commitment_score}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
            
            {/* بخش یادداشت */}
            <div>
              <label className="block text-gray-700 mb-1">یادداشت مربی</label>
              <textarea
                name="coach_notes"
                value={formData.coach_notes}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="3"
                placeholder="نکات مهم، موفقیت‌ها، نگرانی‌ها..."
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700"
            >
              {loading ? 'در حال ثبت...' : 'ثبت ارزیابی'}
            </button>
            
            {message && (
              <div className={`p-3 rounded-lg text-center ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}