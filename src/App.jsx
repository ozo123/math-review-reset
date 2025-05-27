import { useState, useEffect } from 'react';

const subjects = ['NT', 'GT', 'NA', 'MB', 'AP', 'POS'];

const flashCards = {
  NT: [
    { front: 'Definition 1.4: Prime Number', back: 'An integer n > 1 is a prime number if its only positive divisors are 1 and itself.', subject: 'NT', mistake: false },
    { front: 'Theorem 1.6: Fundamental Theorem of Arithmetic', back: 'Every integer n > 0 can be written as a product of primes, uniquely up to reordering. Proof: by induction and Euclid\'s lemma.', subject: 'NT', mistake: false }
  ],
  GT: [],
  NA: [],
  MB: [],
  AP: [],
  POS: []
};

function FlashCard({ front, back, subject, mistake, onToggleMistake, large = false }) {
  const [flipped, setFlipped] = useState(false);
  const sizeClass = large ? 'w-2/3 h-[60vh]' : 'w-64 h-48';
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
  const [shuffleMap, setShuffleMap] = useState({}); // store sequence per subject
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

  // initialize shuffle sequence once per subject when entering single mode
  useEffect(() => {
    if (mode === 'single') {
      if (!shuffleMap[selectedSubject]) {
        const seq = shuffle(filtered);
        setShuffleMap(prev => ({ ...prev, [selectedSubject]: seq }));
      }
      setCurrentIndex(0);
    }
  }, [mode, selectedSubject]);

  // get current sequence for single mode
  const currentSequence = shuffleMap[selectedSubject] || [];

  // keyboard shortcuts
  useEffect(() => {
    const onKeyDown = e => {
      if (mode !== 'single' || !currentSequence.length) return;
      if (e.key === 'ArrowRight') {
        setCurrentIndex(i => (i + 1) % currentSequence.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex(i => (i - 1 + currentSequence.length) % currentSequence.length);
      } else if (e.key === ' ') {
        e.preventDefault();
        const flipContainer = document.querySelector('.card-flip div');
        if (flipContainer) flipContainer.click();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mode, currentSequence]);

  const toggleMistake = index => {
    const newData = { ...data };
    newData[selectedSubject][index].mistake = !newData[selectedSubject][index].mistake;
    setData(newData);
  };

  const handleSubjectClick = subject => {
    setSelectedSubject(subject);
    setMode('all');
    setSearchTerm('');
    setCurrentIndex(0);
  };

  const handleModeChange = newMode => {
    setMode(newMode);
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar omitted for brevity, unchanged */}
      {/* ... */}
      <main className="flex-1 p-6 flex flex-col items-center">
        {mode === 'all' ? (
          <div className="flex flex-wrap justify-start">
            {filtered.map((card, idx) => (
              <FlashCard
                key={idx}
                front={card.front}
                back={card.back}
                subject={card.subject}
                mistake={card.mistake}
                onToggleMistake={() => toggleMistake(idx)}
              />
            ))}
            {filtered.length === 0 && <div className="text-gray-400">暂无可显示卡片。</div>}
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
                  >
                    ← 上一张
                  </button>
                  <button
                    onClick={() => setCurrentIndex(i => (i + 1) % currentSequence.length)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    下一张 →
                  </button>
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
