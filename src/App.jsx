import { useState } from "react";

const subjects = ["NT", "GT", "NA", "MB", "AP", "POS"];

const flashCards = {
  NT: [
    { front: "定义：素数", back: "大于 1 的自然数，除了 1 和它本身外不能被整除。" },
    { front: "定理：无限多素数", back: "反证法：假设只有有限个素数，构造一个新的数 p1*p2*...*pn + 1，必含有新的素因子，矛盾。" }
  ],
  GT: [
    { front: "定义：图", back: "由顶点集和边集组成的二元组 G = (V, E)。" }
  ],
  NA: [],
  MB: [],
  AP: [],
  POS: []
};

function FlashCard({ front, back }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="w-64 h-40 m-4 p-4 bg-white border rounded-xl shadow cursor-pointer relative perspective"
    >
      <div className={`w-full h-full transition-transform duration-500 transform ${flipped ? "rotate-y-180" : ""}`}>
        <div className={`absolute w-full h-full backface-hidden ${flipped ? "hidden" : "block"}`}>
          <div className="flex items-center justify-center h-full text-center font-semibold text-gray-800">{front}</div>
        </div>
        <div className={`absolute w-full h-full backface-hidden transform rotate-y-180 ${flipped ? "block" : "hidden"}`}>
          <div className="flex items-center justify-center h-full text-center text-sm text-gray-600">{back}</div>
        </div>
      </div>
    </div>
  );
}

function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function App() {
  const [selectedSubject, setSelectedSubject] = useState("NT");
  const [mode, setMode] = useState("all"); // "all" 或 "single"
  const [shuffledCards, setShuffledCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const cards = flashCards[selectedSubject] || [];

  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (newMode === "single") {
      const shuffled = shuffle(cards);
      setShuffledCards(shuffled);
      setCurrentIndex(0);
    }
  };

  const handleSubjectChange = (subject) => {
    setSelectedSubject(subject);
    setMode("all");
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-1/6 bg-gray-100 p-4 border-r">
        <h2 className="text-lg font-bold mb-4">科目分类</h2>
        {subjects.map((subject) => (
          <div
            key={subject}
            onClick={() => handleSubjectChange(subject)}
            className={`cursor-pointer p-2 rounded mb-2 ${
              selectedSubject === subject ? "bg-blue-500 text-white" : "hover:bg-gray-200"
            }`}
          >
            {subject}
          </div>
        ))}

        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-2">显示模式</h3>
          <button
            className={`w-full text-left p-2 rounded mb-2 ${mode === "all" ? "bg-green-500 text-white" : "hover:bg-gray-200"}`}
            onClick={() => handleModeChange("all")}
          >
            查看全部
          </button>
          <button
            className={`w-full text-left p-2 rounded ${mode === "single" ? "bg-green-500 text-white" : "hover:bg-gray-200"}`}
            onClick={() => handleModeChange("single")}
          >
            随机浏览
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center">
        {mode === "all" ? (
          <div className="flex flex-wrap justify-start items-start">
            {cards.map((card, index) => (
              <FlashCard key={index} front={card.front} back={card.back} />
            ))}
            {cards.length === 0 && <div className="text-gray-400">该科目暂无卡片内容。</div>}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {shuffledCards.length > 0 ? (
              <>
                <FlashCard
                  front={shuffledCards[currentIndex].front}
                  back={shuffledCards[currentIndex].back}
                />
                <div className="mt-4 space-x-4">
                  <button
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() =>
                      setCurrentIndex((prev) => (prev - 1 + shuffledCards.length) % shuffledCards.length)
                    }
                  >
                    ← 上一张
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() =>
                      setCurrentIndex((prev) => (prev + 1) % shuffledCards.length)
                    }
                  >
                    下一张 →
                  </button>
                </div>
              </>
            ) : (
              <div className="text-gray-400">该科目暂无卡片内容。</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
