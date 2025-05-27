// index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Math Review App</title>
</head>
<body class="bg-white">
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>

// package.json
{
  "name": "math-review-reset",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24",
    "tailwindcss": "^3.3.2",
    "vite": "^4.4.9"
  }
}

// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.',
  base: './'
})

// tailwind.config.js
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: { extend: {} },
  plugins: []
}

// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}

// src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// src/App.jsx
import { useState, useEffect } from 'react'

const subjects = ['NT', 'GT', 'NA', 'MB', 'AP', 'POS']

// flashCards: 示例结构，具体内容按需替换或导入
const flashCards = {
  NT: [
    { front: 'Definition 1.4: Prime Number', back: 'An integer n > 1 is said to be a prime number if the only positive integers that divide n are 1 and n itself.', subject: 'NT', mistake: false },
    { front: 'Theorem 1.6: Fundamental Theorem of Arithmetic', back: 'Every integer n > 0 can be written as a product of primes, uniquely up to reordering. Proof: by induction and Euclid\'s lemma.', subject: 'NT', mistake: false }
  ],
  GT: [], NA: [], MB: [], AP: [], POS: []
}

function FlashCard({ front, back, subject, mistake, onToggleMistake, large = false }) {
  const [flipped, setFlipped] = useState(false)
  const sizeClass = large ? 'w-2/3 h-[60vh]' : 'w-64 h-48'
  return (
    <div className={`${sizeClass} m-4 p-4 bg-white border rounded-xl shadow relative`}>
      <div onClick={() => setFlipped(!flipped)} className="w-full h-full cursor-pointer">
        <div className={`w-full h-full transition-transform duration-500 transform ${flipped ? 'rotate-y-180' : ''}`}>
          <div className={`absolute w-full h-full backface-hidden ${flipped ? 'hidden' : 'block'}`}>
            <div className="flex items-center justify-center h-full text-center font-semibold text-gray-800 text-xl px-4">{front}</div>
          </div>
          <div className={`absolute w-full h-full backface-hidden transform rotate-y-180 ${flipped ? 'block' : 'hidden'}`}>
            <div className="flex items-center justify-center h-full text-center text-base text-gray-600 px-4">{back}</div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-2 left-2 text-xs text-gray-400">科目：{subject}</div>
      <button onClick={onToggleMistake} className={`absolute bottom-2 right-2 text-xs px-2 py-1 rounded ${mistake ? 'bg-red-400 text-white' : 'bg-gray-200 text-black'}`}>{mistake ? '取消易错' : '标为易错'}</button>
    </div>
  )
}

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default function App() {
  const [selectedSubject, setSelectedSubject] = useState('NT')
  const [mode, setMode] = useState('all')
  const [shuffledCards, setShuffledCards] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [data, setData] = useState(flashCards)
  const [onlyMistake, setOnlyMistake] = useState(false)

  const cards = data[selectedSubject] || []
  const filtered = cards.filter(card =>
    (card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.back.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!onlyMistake || card.mistake)
  )

  useEffect(() => {
    if (mode === 'single') {
      setShuffledCards(shuffle(filtered))
      setCurrentIndex(0)
    }
  }, [mode, filtered])

  useEffect(() => {
    const onKey = e => {
      if (mode !== 'single' || !shuffledCards.length) return
      if (e.key === 'ArrowRight') setCurrentIndex(i => (i + 1) % shuffledCards.length)
      if (e.key === 'ArrowLeft') setCurrentIndex(i => (i - 1 + shuffledCards.length) % shuffledCards.length)
      if (e.key === ' ') { e.preventDefault(); document.querySelector('.card-flip > div')?.click() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode, shuffledCards])

  const toggleMistake = i => {
    const newData = { ...data }
    newData[selectedSubject][i].mistake = !newData[selectedSubject][i].mistake
    setData(newData)
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-1/6 bg-gray-100 p-4 border-r">
        <h2 className="text-lg font-bold mb-4">科目分类</h2>
        {subjects.map(s => (
          <div key={s} onClick={()=>{setSelectedSubject(s);setMode('all');setSearchTerm('')}} className={`cursor-pointer p-2 rounded mb-2 ${selectedSubject===s?'bg-blue-500 text-white':'hover:bg-gray-200'}`}>{s}</div>
        ))}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">显示模式</h3>
          <button onClick={()=>setMode('all')} className={`w-full text-left p-2 mb-2 rounded ${mode==='all'?'bg-green-500 text-white':'hover:bg-gray-200'}`}>查看全部</button>
          <button onClick={()=>setMode('single')} className={`w-full text-left p-2 rounded ${mode==='single'?'bg-green-500 text-white':'hover:bg-gray-200'}`}>随机浏览</button>
          <label className="mt-2 inline-flex items-center text-sm"><input type="checkbox" checked={onlyMistake} onChange={()=>setOnlyMistake(!onlyMistake)} className="mr-2"/>仅查看易错卡片</label>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold mb-2">搜索卡片</h3>
          <input type="text" placeholder="输入关键词..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="w-full p-2 border rounded"/>
        </div>
      </aside>
      <main className="flex-1 p-6 flex flex-col items-center">
        {mode==='all'? (
          <div className="flex flex-wrap">
            {filtered.map((c,i)=><FlashCard key={i} front={c.front} back={c.back} subject={c.subject} mistake={c.mistake} onToggleMistake={()=>toggleMistake(i)}/>)}
            {!filtered.length&&<div className="text-gray-400">暂无可显示卡片。</div>}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {shuffledCards.length?
              <>  <div className="card-flip"><FlashCard front={shuffledCards[currentIndex].front} back={shuffledCards[currentIndex].back} subject={shuffledCards[currentIndex].subject} mistake={shuffledCards[currentIndex].mistake} onToggleMistake={()=>toggleMistake(currentIndex)} large/></div>
                <div className="mt-4 space-x-4"><button onClick={()=>setCurrentIndex(i=> (i-1+shuffledCards.length)%shuffledCards.length)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">← 上一张</button><button onClick={()=>setCurrentIndex(i=> (i+1)%shuffledCards.length)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">下一张 →</button></div>
              </>
              :<div className="text-gray-400">暂无可显示卡片。</div>
            }
          </div>
        )}
      </main>
    </div>
  )
}
