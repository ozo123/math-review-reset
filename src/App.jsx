import { useState, useEffect } from 'react';

const subjects = ['NT', 'GT', 'NA', 'MB', 'AP', 'POS'];

const flashCards = {
  NT: [
    { front: 'Definition 1.4: Prime Number', back: 'An integer n > 1 is a prime number if its only positive divisors are 1 and itself.', subject: 'NT', mistake: false },
    { front: 'Theorem 1.6: Fundamental Theorem of Arithmetic', back: 'Every integer n > 0 can be written as a product of primes, uniquely up to reordering. Proof: by induction and Euclid\'s lemma.', subject: 'NT', mistake: false }
  ],
  GT: [
    { front: 'Definition: Graph', back: 'A graph G is an ordered pair (V, E) where V is a set of vertices and E is a set of unordered pairs of distinct vertices, called edges.', subject: 'GT', mistake: false },
    { front: 'Theorem: Euler\'s Formula', back: 'For a connected plane graph with n vertices, m edges, and f faces: n − m + f = 2. Proof by induction or deletion of edges on cycles.', subject: 'GT', mistake: false }
  ],
  NA: [], MB: [], AP: [], POS: []
};

function FlashCard({ front, back, subject, mistake, onToggleMistake, large = false }) {
  const [flipped, setFlipped] = useState(false);
  const sizeClass = large ? 'w-3/4 h-96' : 'w-64 h-40';
  return (
    <div className={`${sizeClass} m-4 p-4 bg-white border rounded-xl shadow relative card-flip`}>
      <div onClick={() => setFlipped(!flipped)} className="w-full h-full cursor-pointer">
        <div className={`w-full h-full transition-transform duration-500 transform ${flipped ? 'rotate-y-180' : ''}`}>
          <div className={`absolute w-full h-full backface-hidden ${flipped ? 'hidden' : 'block'}`}>
            <div className="flex items-center justify-center h-full text-center font-semibold text-gray-800 text-xl px-4">
              {front}
            </div>
          </div>
          <div className={`absolute w-full h-full backface-hidden transform rotate-y-180 ${flipped ? 'block' : 'hidden'}`}>
            <div className="flex items-center justify-center h-full text-center text-base text-gray-600 px-4">
              {back}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-2 left-2 text-xs text-gray-400">科目：{subject}</div>
      <button
        onClick={onToggleMistake}
        className={`absolute bottom-2 right-2 text-xs px-2 py-1 rounded ${mistake ? 'bg-red-400 text-white' : 'bg-gray-200 text-black'}`}>
        {mistake ? '取消易错' : '标为易错'}
      </button>
    </div>
  );
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function App() {
  const [selectedSubject, setSelectedSubject] = useState('NT');
  const [mode, setMode] = useState('all');
  const [shuffleMap, setShuffleMap] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState(flashCards);
  const [onlyMistake, setOnlyMistake] = useState(false);

  const cards = data[selectedSubject] || [];
  const filtered = cards.filter(card =>
    (card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
     card.back.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!onlyMistake || card.mistake)
  );

  useEffect(() => {
    if (mode === 'single') {
      if (!shuffleMap[selectedSubject]) {
        const seq = shuffle(filtered);
        setShuffleMap(prev => ({ ...prev, [selectedSubject]: seq }));
      }
      setCurrentIndex(0);
    }
  }, [mode, selectedSubject]);

  const currentSequence = shuffleMap[selectedSubject] || [];

  useEffect(() => {
    const onKey = e => {
      if (mode !== 'single' || currentSequence.length === 0) return;
      if (e.key === 'ArrowRight') setCurrentIndex(i => (i + 1) % currentSequence.length);
      if (e.key === 'ArrowLeft') setCurrentIndex(i => (i - 1 + currentSequence.length) % currentSequence.length);
      if (e.key === ' ') {
        e.preventDefault();
        document.querySelector('.card-flip div')?.click();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, currentSequence]);

  const toggleMistake = idx => {
    const newData = { ...data };
    newData[selectedSubject][idx].mistake = !newData[selectedSubject][idx].mistake;
    setData(newData);
  };

  const changeSubject = subj => {
    setSelectedSubject(subj);
    setMode('all');
    setSearchTerm('');
    setCurrentIndex(0);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="w-1/6 bg-gray-100 p-4 border-r">
        <h2 className="text-lg font-bold mb-4">科目分类</h2>
        {subjects.map(s => (
          <div
            key={s}
            onClick={() => changeSubject(s)}
            className={`cursor-pointer p-2 rounded mb-2 ${selectedSubject === s ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
          >
            {s}
          </div>
        ))}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">显示模式</h3>
          <button
            onClick={() => setMode('all')}
            className={`w-full text-left p-2 mb-2 rounded ${mode === 'all' ? 'bg-green-500 text-white' : 'hover:bg-gray-200'}`}
          >查看全部</button>
          <button
            onClick={() => setMode('single')}
            className={`w-full text-left p-2 rounded ${mode === 'single' ? 'bg-green-500 text-white' : 'hover:bg-gray-200'}`}
          >随机浏览</button>
          <label className="mt-2 inline-flex items-center text-sm">
            <input
              type="checkbox"
              checked={onlyMistake}
              onChange={() => setOnlyMistake(!onlyMistake)}
              className="mr-2"
            />仅查看易错卡片
          </label>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold mb-2">搜索卡片</h3>
          <input
            type="text"
            placeholder="输入关键词..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      </aside>
      <main className="flex-1 p-6 flex flex-col items-center">
        {mode === 'all' ? (
          <div className="flex flex-wrap justify-start">
            {filtered.map((card, i) => (
              <FlashCard
                key={i}
                front={card.front}
                back={card.back}
                subject={card.subject}
                mistake={card.mistake}
                onToggleMistake={() => toggleMistake(i)}
              />
            ))}
            {!filtered.length && <div className="text-gray-400">暂无可显示卡片。</div>}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {currentSequence.length > 0 ? (
              <>
                <FlashCard
                  front={currentSequence[currentIndex].front}
                  back={currentSequence[currentIndex].back}
                  subject={currentSequence[currentIndex].subject}
                  mistake={currentSequence[currentIndex].mistake}
                  onToggleMistake={() => toggleMistake(currentIndex)}
                  large
                />
                <div className="mt-4 space-x-4">
                  <button
                    onClick={() => setCurrentIndex(i => (i - 1 + currentSequence.length) % currentSequence.length)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >← 上一张</button>
                  <button
                    onClick={() => setCurrentIndex(i => (i + 1) % currentSequence.length)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >下一张 →</button>
                </div>
              </>
            ) : (
              <div className="text-gray-400">暂无可显示卡片。</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
