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

export default function App() {
  const [selectedSubject, setSelectedSubject] = useState("NT");

  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-1/6 bg-gray-100 p-4 border-r">
        <h2 className="text-lg font-bold mb-4">科目分类</h2>
        {subjects.map((subject) => (
          <div
            key={subject}
            onClick={() => setSelectedSubject(subject)}
            className={`cursor-pointer p-2 rounded mb-2 ${
              selectedSubject === subject ? "bg-blue-500 text-white" : "hover:bg-gray-200"
            }`}
          >
            {subject}
          </div>
        ))}
      </div>

      <div className="flex-1 p-6 flex flex-wrap justify-start items-start">
        {(flashCards[selectedSubject] || []).map((card, index) => (
          <FlashCard key={index} front={card.front} back={card.back} />
        ))}
        {(!flashCards[selectedSubject] || flashCards[selectedSubject].length === 0) && (
          <div className="text-gray-400">该科目暂无卡片内容。</div>
        )}
      </div>
    </div>
  );
}
