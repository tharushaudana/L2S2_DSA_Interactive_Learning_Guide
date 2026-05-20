import { useState } from 'react';
import {
  BarChart2, GitMerge, Zap, Network, Search, Footprints,
  Trash2, Scale, RefreshCw, GraduationCap, BookOpen, Menu, X
} from 'lucide-react';

import SortingBasics from './pages/SortingBasics';
import MergeSort from './pages/MergeSort';
import QuickSort from './pages/QuickSort';
import TreesIntro from './pages/TreesIntro';
import BSTOperations from './pages/BSTOperations';
import Traversals from './pages/Traversals';
import BSTDeletion from './pages/BSTDeletion';
import AVLIntro from './pages/AVLIntro';
import AVLImplementation from './pages/AVLImplementation';
import ExamPrep from './pages/ExamPrep';

const LECTURES = [
  {
    group: 'Sorting Algorithms',
    items: [
      { id: 'L1', label: 'L1: Basics & Sorting', shortLabel: 'L1', icon: BarChart2, sub: 'Bubble · Selection · Insertion · Recursion' },
      { id: 'L2', label: 'L2: Merge Sort', shortLabel: 'L2', icon: GitMerge, sub: 'Divide & Conquer' },
      { id: 'L3', label: 'L3: Quick Sort', shortLabel: 'L3', icon: Zap, sub: 'Partitioning & Pivot' },
    ],
  },
  {
    group: 'Trees & BST',
    items: [
      { id: 'L4', label: 'L4: Trees Intro', shortLabel: 'L4', icon: Network, sub: 'Terminology & Types' },
      { id: 'L5', label: 'L5: BST Operations', shortLabel: 'L5', icon: Search, sub: 'Search & Insert' },
      { id: 'L6', label: 'L6: Traversals', shortLabel: 'L6', icon: Footprints, sub: 'DFS & BFS' },
      { id: 'L7', label: 'L7: BST Deletion', shortLabel: 'L7', icon: Trash2, sub: '3 Cases & Complexity' },
    ],
  },
  {
    group: 'AVL Trees',
    items: [
      { id: 'L8', label: 'L8: AVL Intro', shortLabel: 'L8', icon: Scale, sub: 'Balance Factor & Rotations' },
      { id: 'L9', label: 'L9: AVL Implementation', shortLabel: 'L9', icon: RefreshCw, sub: 'Interactive Inserter' },
    ],
  },
  {
    group: 'Review',
    items: [
      { id: 'exam', label: 'Exam Prep', shortLabel: '📋', icon: GraduationCap, sub: 'Flashcards & Cheat Sheet' },
    ],
  },
];

const PAGE_MAP = {
  L1: SortingBasics,
  L2: MergeSort,
  L3: QuickSort,
  L4: TreesIntro,
  L5: BSTOperations,
  L6: Traversals,
  L7: BSTDeletion,
  L8: AVLIntro,
  L9: AVLImplementation,
  exam: ExamPrep,
};

export default function App() {
  const [activePage, setActivePage] = useState('L1');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const PageComponent = PAGE_MAP[activePage] || SortingBasics;

  const handleNav = (id) => {
    setActivePage(id);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <nav className={`
        fixed md:sticky top-0 left-0 h-screen w-72 bg-white border-r border-slate-200 shadow-lg z-30 flex flex-col
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent flex items-center gap-2">
              <BookOpen size={22} className="text-indigo-600" />
              DSA Study Guide
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">IN 2111 · UoM · All 9 Lectures</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Nav groups */}
        <div className="flex-grow overflow-y-auto p-3 space-y-5">
          {LECTURES.map(group => (
            <div key={group.group}>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">{group.group}</p>
              <div className="space-y-1">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all text-left group
                        ${isActive
                          ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                      <Icon size={18} className={`mt-0.5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                      <div className="min-w-0">
                        <p className={`font-medium text-sm leading-tight ${isActive ? 'text-indigo-700' : ''}`}>{item.label}</p>
                        <p className={`text-xs truncate mt-0.5 ${isActive ? 'text-indigo-500' : 'text-slate-400'}`}>{item.sub}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 text-center">Mr. Nadana Swasthi · Faculty of IT, UoM</p>
        </div>
      </nav>

      {/* Mobile top bar */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
        <button onClick={() => setSidebarOpen(true)} className="text-slate-600 hover:text-slate-900">
          <Menu size={22} />
        </button>
        <h1 className="text-base font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          DSA Study Guide
        </h1>
        <span className="ml-auto text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
          {LECTURES.flatMap(g => g.items).find(i => i.id === activePage)?.shortLabel}
        </span>
      </div>

      {/* Main content */}
      <main className="flex-grow min-w-0 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-4 md:p-8">
          <PageComponent key={activePage} />
        </div>
      </main>
    </div>
  );
}
