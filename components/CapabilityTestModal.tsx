'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertCircle, Award, Brain, ArrowRight, RefreshCw, Zap } from 'lucide-react';

interface Question {
  id: string;
  skill: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const testQuestions: Question[] = [
  {
    id: 't1',
    skill: 'First aid',
    question: 'In a medical emergency with severe arterial bleeding from a lower leg, what is the primary initial action?',
    options: [
      'Apply direct, continuous pressure to the wound with a clean pad',
      'Rinse the leg with warm water for 5 minutes',
      'Apply a loose bandage and elevate above heart level',
      'Wait for professional medical response before touching the area'
    ],
    correctIndex: 0,
    explanation: 'Direct, firm, continuous pressure stops most external bleeding by enabling natural clotting.'
  },
  {
    id: 't2',
    skill: 'Offline navigation',
    question: 'When navigating without GPS, what is the function of a "handrail"?',
    options: [
      'A physical fence or rope you must hold at all times',
      'A prominent linear feature (like a river, road, or ridge) to guide your direction',
      'A landmark you step over to mark your start point',
      'A specific constellation used for night bearing'
    ],
    correctIndex: 1,
    explanation: 'Handrails are linear landscape features that prevent disorientation while allowing steady forward movement.'
  },
  {
    id: 't3',
    skill: 'Water & sanitation',
    question: 'How long must water be held at a rolling boil to destroy biological pathogens at sea level?',
    options: [
      '10 seconds',
      '1 full minute',
      '10 minutes',
      '30 minutes'
    ],
    correctIndex: 1,
    explanation: 'A rolling boil for 1 full minute kills bacteria, viruses, and parasites at standard altitudes.'
  }
];

interface CapabilityTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteTest: (score: number, total: number) => void;
}

export default function CapabilityTestModal({
  isOpen,
  onClose,
  onCompleteTest
}: CapabilityTestModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = testQuestions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true);
    if (selectedOption === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < testQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsFinished(true);
      onCompleteTest(score + (selectedOption === currentQ.correctIndex ? 1 : 0), testQuestions.length);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-6 relative overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-stone-900 text-white rounded-xl">
                  <Brain size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">Resilience Capability Test</h3>
                  <p className="text-xs text-stone-500 font-mono">
                    {!isFinished ? `Question ${currentIndex + 1} of ${testQuestions.length}` : 'Assessment Complete'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {!isFinished ? (
              <div className="space-y-6">
                {/* Skill Category Tag */}
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                  Target Skill: {currentQ.skill}
                </span>

                {/* Question Prompt */}
                <h4 className="text-base font-semibold text-stone-900 leading-snug">
                  {currentQ.question}
                </h4>

                {/* Options List */}
                <div className="space-y-2.5">
                  {currentQ.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQ.correctIndex;

                    let btnStyle = 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100';
                    if (isSelected && !isSubmitted) {
                      btnStyle = 'bg-stone-900 border-stone-900 text-white shadow-xs';
                    } else if (isSubmitted) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-medium';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-50 border-rose-300 text-rose-900';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isSubmitted}
                        className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm transition-all flex items-start space-x-3 cursor-pointer ${btnStyle}`}
                      >
                        <span className="w-5 h-5 rounded-full border border-stone-300 flex items-center justify-center shrink-0 text-xs font-mono mt-0.5">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1 leading-snug">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs leading-relaxed text-stone-700 space-y-1"
                  >
                    <span className="font-bold text-stone-900 uppercase tracking-wider block font-mono text-[10px]">
                      Explanation
                    </span>
                    <p>{currentQ.explanation}</p>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex justify-end">
                  {!isSubmitted ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={selectedOption === null}
                      className="bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all flex items-center space-x-2 cursor-pointer"
                    >
                      <span>Confirm Choice</span>
                      <Zap size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all flex items-center space-x-2 cursor-pointer shadow-xs"
                    >
                      <span>{currentIndex < testQuestions.length - 1 ? 'Next Question' : 'View Results'}</span>
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Finish Screen */
              <div className="text-center space-y-6 py-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Award size={32} />
                </div>

                <div className="space-y-1">
                  <h4 className="text-xl font-bold text-stone-900">Assessment Complete</h4>
                  <p className="text-sm text-stone-600">
                    You scored <strong className="text-stone-900">{score}</strong> out of{' '}
                    <strong className="text-stone-900">{testQuestions.length}</strong> on the resilience evaluation.
                  </p>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 leading-relaxed">
                  Your capability profile skill ratings have been automatically updated to reflect your confirmed baseline knowledge.
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <RefreshCw size={14} />
                    <span>Retake Test</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
