/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface Model {
  id: string;
  title: string;
}

interface Case {
  id: string;
  text: string;
  models: Model[];
}

type VCSubTask = 'first' | 'second' | 'both';
type Condition = 'clean' | 'noisy';

const NAV_LINKS: { name: string; url: string; icon: React.ReactNode }[] = [];

const CASES: Case[] = [
  { id: 'Case1', text: 'A woman talking followed by a group of people laughing as plastic crinkles.',
    models: [{ id: '1', title: 'STAR' }, { id: '2', title: 'ST5 + FM' }, { id: '3', title: 'GT → ST5 + FM' }, { id: '4', title: 'AlignAudio' }] },
  { id: 'Case2', text: 'A speedboat is racing across water with loud wind noise.',
    models: [{ id: '1', title: 'STAR' }, { id: '2', title: 'ST5 + FM' }, { id: '3', title: 'GT → ST5 + FM' }, { id: '4', title: 'AlignAudio' }] },
  { id: 'Case3', text: 'Motorcycle starting then driving away.',
    models: [{ id: '1', title: 'STAR' }, { id: '2', title: 'ST5 + FM' }, { id: '3', title: 'GT → ST5 + FM' }, { id: '4', title: 'AlignAudio' }] },
  { id: 'Case4', text: 'A woman talks and a baby whispers.',
    models: [{ id: '1', title: 'STAR' }, { id: '2', title: 'ST5 + FM' }, { id: '3', title: 'GT → ST5 + FM' }, { id: '4', title: 'AlignAudio' }] },
  { id: 'Case5', text: 'A man speaks and a vehicle passes.',
    models: [{ id: '1', title: 'STAR' }, { id: '2', title: 'ST5 + FM' }, { id: '3', title: 'GT → ST5 + FM' }, { id: '4', title: 'AlignAudio' }] },
  { id: 'Case6', text: 'Wind is blowing and heavy rain is falling and splashing.',
    models: [{ id: '1', title: 'STAR' }, { id: '2', title: 'ST5 + FM' }, { id: '3', title: 'GT → ST5 + FM' }, { id: '4', title: 'AlignAudio' }] },
  { id: 'Case7', text: 'Speech followed by quietness and a man speaks and laughs.',
    models: [{ id: '1', title: 'STAR' }, { id: '2', title: 'ST5 + FM' }, { id: '3', title: 'GT → ST5 + FM' }, { id: '4', title: 'AlignAudio' }] },
  { id: 'Case8', text: 'A male voice and a machine buzzing.',
    models: [{ id: '1', title: 'STAR' }, { id: '2', title: 'ST5 + FM' }, { id: '3', title: 'GT → ST5 + FM' }, { id: '4', title: 'AlignAudio' }] },
  { id: 'Case9', text: 'A long burp ends in a sigh.',
    models: [{ id: '1', title: 'STAR' }, { id: '2', title: 'ST5 + FM' }, { id: '3', title: 'GT → ST5 + FM' }, { id: '4', title: 'AlignAudio' }] },
  { id: 'Case10', text: 'A gun cocking then firing as metal clanks on a hard surface followed by a man talking during an electronic laser effect as gunshots and explosions go off in the distance.',
    models: [{ id: '1', title: 'STAR' }, { id: '2', title: 'ST5 + FM' }, { id: '3', title: 'GT → ST5 + FM' }, { id: '4', title: 'AlignAudio' }] }
];

const VC_SUBTASKS: { id: VCSubTask; title: string; description: string }[] = [
  { id: 'first', title: 'Noisy Content', description: 'Content speech with added noise' },
  { id: 'second', title: 'Noisy Timber', description: 'Timber reference with added noise' },
  { id: 'both', title: 'Noisy Both', description: 'Both content and timber with added noise' },
];

const VC_MODELS: Model[] = [
  { id: 'AlignAudio', title: 'AlignAudio' },
  { id: 'DiffVC', title: 'DiffVC' },
  { id: 'FreeVC', title: 'FreeVC' },
  { id: 'MeanVC', title: 'MeanVC' },
  { id: 'Noro', title: 'Noro' },
];

interface VCCase {
  id: string;
  text: string;
}

const VC_PAIR_TEXTS: Record<string, string> = {
  4: "Mary would sit and watch me by the hour together. Then she would take lessons and a docile intelligent, ascidious people she made.",
  5: "Each Congress, an ordinary course, meets for the first time about one year after its members are elected by the people. And the influence of politics during the interim needs always to be taken into account.",
  10: "How much of human suffering I have not only relieved, but actually annihilated, and in a glow of conscious virtue, I stood watching the unloading of the cart, still holding the magic watch open in my hand, as I was curious to see what would happen when we again reach the exact time at which I had put back the hand.",
  15: "and I have myself so little money, why should I look for a fortune?",
  16: "I weren't prowling around, sir. I fell overboard off of the steamboat.",
  21: "most, if not all, belong to the class that is increaseable, although it may be with much difficulty. Even when the exact thing cannot be duplicated, as a bust by an ancient sculptor or an autograph of a dead author, many substitutes, serving the same or closely related once, affect and limit the demand and thus increase the supply.",
  22: "I joined a society pledged to work for a better future. According to my lights, I do what poor work I can in that spirit.",
  31: "such a thing never came into my heads or now that you have put it there I could almost believe it.",
  35: "Mr. Blackwell, Mr. Gaunt's partner, arrived from the United States.",
  110: "This will at least be safe, and as to success, we must leave it to time.",
};

const VC_CASES: Record<VCSubTask, VCCase[]> = {
  first: [
    { id: 'pair_22', text: VC_PAIR_TEXTS[22] },
    { id: 'pair_4', text: VC_PAIR_TEXTS[4] },
    { id: 'pair_5', text: VC_PAIR_TEXTS[5] },
  ],
  second: [
    { id: 'pair_110', text: VC_PAIR_TEXTS[110] },
    { id: 'pair_21', text: VC_PAIR_TEXTS[21] },
    { id: 'pair_31', text: VC_PAIR_TEXTS[31] },
  ],
  both: [
    { id: 'pair_10', text: VC_PAIR_TEXTS[10] },
    { id: 'pair_15', text: VC_PAIR_TEXTS[15] },
    { id: 'pair_16', text: VC_PAIR_TEXTS[16] },
    { id: 'pair_35', text: VC_PAIR_TEXTS[35] },
  ],
};

function getVCAudioPath(condition: Condition, subtask: VCSubTask, pair: string, filename: string): string {
  return `samples/vc/${condition}/${subtask}/${pair}/${filename}`;
}

function VCSection() {
  return (
    <div className="space-y-12">
      {VC_SUBTASKS.map((subtask) => (
        <div key={subtask.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-violet-500" />
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500">
                {subtask.title}
              </h4>
              <span className="text-xs text-slate-400">— {subtask.description}</span>
            </div>
          </div>

          <div className="p-6 space-y-10">
            {VC_CASES[subtask.id].map((vcCase, pairIdx) => (
              <div key={vcCase.id}>
                {/* Case header */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-wider">
                    Case {pairIdx + 1}
                  </span>
                </div>
                {vcCase.text && (
                  <p className="text-lg text-slate-700 font-medium mb-6">
                    &ldquo;{vcCase.text}&rdquo;
                  </p>
                )}

                <div className="space-y-6">
                  {(['clean', 'noisy'] as Condition[]).map((condition) => (
                    <div key={condition} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${condition === 'clean' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500">
                          {condition === 'clean' ? 'Clean Condition' : 'Noisy Condition'}
                        </h4>
                      </div>

                      {/* Row 1: content + timber inputs */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-xl p-4 border border-dashed border-slate-300">
                          <span className="block text-xs font-bold text-slate-400 uppercase mb-2">Content</span>
                          <audio controls className="w-full h-8" src={getVCAudioPath(condition, subtask.id, vcCase.id, 'content.wav')} />
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-dashed border-slate-300">
                          <span className="block text-xs font-bold text-slate-400 uppercase mb-2">Timber</span>
                          <audio controls className="w-full h-8" src={getVCAudioPath(condition, subtask.id, vcCase.id, 'timber.wav')} />
                        </div>
                      </div>

                      {/* Row 2: model outputs */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {VC_MODELS.map((model) => (
                          <div
                            key={model.id}
                            className={`rounded-xl p-4 border transition-all ${
                              model.id === 'AlignAudio'
                                ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200'
                                : 'bg-white border-slate-100'
                            }`}
                          >
                            <span className={`block text-xs font-bold uppercase mb-2 ${
                              model.id === 'AlignAudio' ? 'text-blue-600' : 'text-slate-400'
                            }`}>
                              {model.title}
                              {model.id === 'AlignAudio' && (
                                <span className="ml-1 text-[10px] bg-blue-600 text-white px-1 rounded">Ours</span>
                              )}
                            </span>
                            <audio controls className="w-full h-8" src={getVCAudioPath(condition, subtask.id, vcCase.id, `${model.id}.wav`)} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'sta' | 'vc'>('sta');

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-4">
          AlignAudio
        </h1>
        <h2 className="text-2xl font-medium text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
          AlignAudio: Dual-Alignment for Noise-Robust Speech-to-Audio Generation
        </h2>

        {/* Navigation Links */}
        <nav className="flex items-center justify-center gap-4 text-sm font-medium">
          {NAV_LINKS.map((link, idx) => (
            <React.Fragment key={link.name}>
              <a
                href={link.url}
                className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 transition-colors px-2 py-1 rounded-md hover:bg-blue-50"
              >
                {link.icon}
                {link.name}
              </a>
              {idx < NAV_LINKS.length - 1 && (
                <span className="text-slate-300">|</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Task Tabs */}
        <div className="flex justify-center mt-6">
          <div className="inline-flex bg-white rounded-xl p-1 shadow-sm border border-slate-200">
            <button
              onClick={() => setActiveTab('sta')}
              className={`px-7 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                activeTab === 'sta'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              STA Task
            </button>
            <button
              onClick={() => setActiveTab('vc')}
              className={`px-7 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                activeTab === 'vc'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              VC Task
            </button>
          </div>
        </div>
      </header>

      {/* Abstract Section */}
      <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 mb-12">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
          Abstract
        </h3>
        <p className="text-slate-700 leading-relaxed text-lg">
          <strong>Speech-conditioned generation</strong> refers to the process of mapping speech signals to other modalities. Prior end-to-end speech-conditioned generative models achieve high fidelity in clean acoustic conditions, but their performance degrades substantially under environmental noise. While prior noise-robust approaches have achieved significant success in feature-level purification, the critical alignment during the downstream generation phase remains largely unexplored. To address this, we propose <strong>AlignAudio</strong>, a noise-robust generative framework based on dual alignment: (i) aligning the representations of clean and noisy speech to preserve semantic cues, and (ii) enforcing generation-level consistency within a flow-matching paradigm to ensure temporal coherence. Experiments on speech-to-audio (STA) and voice cloning (VC) tasks demonstrate that AlignAudio maintains performance comparable to baselines on clean speech while significantly outperforming them across various noisy conditions.
        </p>
      </section>

      {/* Tab Content */}
      {activeTab === 'sta' ? (
        /* ========== STA Samples ========== */
        <div className="space-y-12">
          {CASES.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
                    {item.id}
                  </span>
                </div>
                <p className="text-lg text-slate-700 font-medium">
                  &ldquo;{item.text}&rdquo;
                </p>
              </div>

              <div className="p-6 space-y-8">
                {/* Real Human Condition */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500">
                      Real Human Condition
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Input Speech */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-dashed border-slate-300">
                      <span className="block text-xs font-bold text-slate-400 uppercase mb-2">Input Speech</span>
                      <audio controls className="w-full h-8" src={`samples/human/${item.id.replace('Case', '')}.wav`} />
                    </div>

                    {/* AlignAudio */}
                    <div className="rounded-xl p-4 border bg-blue-50 border-blue-200 ring-1 ring-blue-200">
                      <span className="block text-xs font-bold uppercase mb-2 text-blue-600">
                        AlignAudio
                        <span className="ml-1 text-[10px] bg-blue-600 text-white px-1 rounded">Ours</span>
                      </span>
                      <audio controls className="w-full h-8" src={`samples/human-res/${item.id.replace('Case', '')}.wav`} />
                    </div>
                  </div>
                </div>

                {(['clean', 'noisy'] as const).map((condition) => (
                  <div key={condition} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${condition === 'clean' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500">
                        {condition === 'clean' ? 'Clean Condition' : 'Noisy Condition'}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {/* Input Speech */}
                      <div className="bg-slate-50 rounded-xl p-4 border border-dashed border-slate-300">
                        <span className="block text-xs font-bold text-slate-400 uppercase mb-2">Input Speech</span>
                        <audio controls className="w-full h-8" src={`samples/${item.id}/${condition}_speech.wav`} />
                      </div>

                      {/* Models */}
                      {item.models.map((model) => (
                        <div
                          key={model.id}
                          className={`rounded-xl p-4 border transition-all ${
                            model.id === '4'
                              ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200'
                              : 'bg-white border-slate-100'
                          }`}
                        >
                          <span className={`block text-xs font-bold uppercase mb-2 ${
                            model.id === '4' ? 'text-blue-600' : 'text-slate-400'
                          }`}>
                            {model.title}
                            {model.id === '4' && <span className="ml-1 text-[10px] bg-blue-600 text-white px-1 rounded">Ours</span>}
                          </span>

                          {condition === 'clean' && model.id === '3' ? (
                            <div className="h-8 flex items-center justify-center text-[10px] text-slate-400 text-center leading-tight">
                              Not processed by SE module
                            </div>
                          ) : (
                            <audio controls className="w-full h-8" src={`samples/${item.id}/${condition}_${model.id}.wav`} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ========== VC Samples ========== */
        <VCSection />
      )}

      <footer className="mt-20 pb-12 text-center text-slate-400 text-sm">
        <p>© 2026 AlignAudio Project. All rights reserved.</p>
      </footer>
    </div>
  );
}
