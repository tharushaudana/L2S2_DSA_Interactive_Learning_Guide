import { useState } from 'react';
import { GraduationCap, Filter } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Card } from '../components/ui/Card';
import { FlashcardGrid } from '../components/ui/FlashcardGrid';
import { InfoBox } from '../components/ui/InfoBox';
import { EXAM_QUESTIONS } from '../data/examQuestions';

const TOPICS = ['All', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9'];
const TOPIC_LABELS = {
  All: 'All Topics',
  L1: 'L1: Basics & Sorting',
  L2: 'L2: Merge Sort',
  L3: 'L3: Quick Sort',
  L4: 'L4: Trees Intro',
  L5: 'L5: BST',
  L6: 'L6: Traversals',
  L7: 'L7: BST Deletion',
  L8: 'L8: AVL Intro',
  L9: 'L9: AVL Implementation',
};

export default function ExamPrep() {
  const [activeTopic, setActiveTopic] = useState('All');

  const filteredQuestions = activeTopic === 'All'
    ? EXAM_QUESTIONS
    : EXAM_QUESTIONS.filter(q => q.topic === activeTopic);

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={GraduationCap}
        title="Exam Preparation"
        description="Flashcards covering all 9 lectures. Click any card to reveal the answer."
      />

      <InfoBox variant="exam">
        <strong>Study tip:</strong> Go through each card, try to answer mentally, then reveal. Focus extra time on cards you got wrong. Topics marked with ⚠️ are commonly tested.
      </InfoBox>

      {/* Topic filter */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-slate-500" />
          <span className="text-sm font-semibold text-slate-700">Filter by Topic:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map(t => (
            <button
              key={t}
              onClick={() => setActiveTopic(t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTopic === t
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {TOPIC_LABELS[t]}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Showing {filteredQuestions.length} of {EXAM_QUESTIONS.length} flashcards
        </p>
      </Card>

      <FlashcardGrid questions={filteredQuestions} />

      {/* Quick reference summary */}
      <Card className="bg-slate-900 border-slate-800">
        <h3 className="text-lg font-bold text-white mb-4">Quick Reference: Complexity Cheat Sheet</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left p-2 text-slate-400 font-semibold">Algorithm / Structure</th>
                <th className="text-left p-2 text-slate-400 font-semibold">Best</th>
                <th className="text-left p-2 text-slate-400 font-semibold">Average</th>
                <th className="text-left p-2 text-slate-400 font-semibold">Worst</th>
                <th className="text-left p-2 text-slate-400 font-semibold">Space</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {[
                ['Bubble Sort', 'O(n)*', 'O(n²)', 'O(n²)', 'O(1)'],
                ['Selection Sort', 'O(n²)', 'O(n²)', 'O(n²)', 'O(1)'],
                ['Insertion Sort', 'O(n)*', 'O(n²)', 'O(n²)', 'O(1)'],
                ['Merge Sort', 'O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)'],
                ['Quick Sort', 'O(n log n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
                ['BST Operations', 'O(log n)', 'O(log n)', 'O(n)', 'O(n)'],
                ['AVL Operations', 'O(log n)', 'O(log n)', 'O(log n)', 'O(n)'],
              ].map(([name, ...cells]) => (
                <tr key={name} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="p-2 text-slate-200 font-sans font-medium">{name}</td>
                  {cells.map((cell, i) => (
                    <td key={i} className={`p-2 ${
                      cell.includes('log') ? 'text-green-400' :
                      cell.includes('n²') ? 'text-red-400' :
                      cell === 'O(n)' ? 'text-yellow-400' :
                      'text-slate-300'
                    }`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-2">* O(n) best case with optimization (early termination for Bubble, naturally for Insertion)</p>
      </Card>
    </div>
  );
}
