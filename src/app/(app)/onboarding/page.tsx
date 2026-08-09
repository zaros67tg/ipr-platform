'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ArrowRight, ArrowLeft, Award, Sparkles } from 'lucide-react';
import { ResearchDomain } from '@/types';

const DOMAINS: ResearchDomain[] = [
  'Theoretical Physics',
  'Systems Programming',
  'Neuroscience',
  'Robotics',
  'Mathematics',
  'Artificial Intelligence',
  'Quantum Computing',
  'Philosophy of Technology',
  'Materials Science',
  'Computational Biology',
  'Cybersecurity',
  'Computer Vision'
];

const SKILL_TAGS = [
  'Theory / Math Specialist',
  'Code / Implementation Specialist',
  'Experimental Validation',
  'LaTeX Derivations',
  'C++',
  'Rust',
  'CUDA Acceleration',
  'Spiking Neural Networks',
  'Category Theory',
  'Post-Quantum Cryptography',
  'ROS 2 Swarm Control'
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedDomains, setSelectedDomains] = useState<string[]>(['Systems Programming', 'Neuroscience']);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Theory / Math Specialist', 'Code / Implementation Specialist']);
  const [lookingFor, setLookingFor] = useState('Code Specialist for Neuromorphic Spiking Simulator');

  const toggleDomain = (d: string) => {
    if (selectedDomains.includes(d)) {
      setSelectedDomains(prev => prev.filter(x => x !== d));
    } else if (selectedDomains.length < 3) {
      setSelectedDomains(prev => [...prev, d]);
    }
  };

  const toggleSkill = (s: string) => {
    if (selectedSkills.includes(s)) {
      setSelectedSkills(prev => prev.filter(x => x !== s));
    } else {
      setSelectedSkills(prev => [...prev, s]);
    }
  };

  const handleFinish = () => {
    router.push('/feed');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#151311] border border-white/15 rounded-2xl shadow-2xl p-8 space-y-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#C85A32] text-[#F4F0E8] font-bold flex items-center justify-center">
              {step}
            </span>
            <span className="text-[#F4F0E8] font-bold">
              {step === 1 ? 'Select Core Research Domains (Max 3)' : step === 2 ? 'Identify Skill Tags' : 'Define Collaboration Needs'}
            </span>
          </div>
          <span className="text-[#746F69]">STEP {step} OF 3</span>
        </div>

        {/* STEP 1: Core Research Domains */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-xs font-serif text-[#A8A198]">
              Choose up to 3 primary domains to customize your research feed and reviewer matching algorithm.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono text-xs">
              {DOMAINS.map(d => {
                const isSelected = selectedDomains.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDomain(d)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      isSelected
                        ? 'bg-[#C85A32]/20 border-[#C85A32] text-[#F4F0E8] font-bold'
                        : 'bg-[#0D0C0B] border-white/10 text-[#A8A198] hover:text-[#F4F0E8]'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Skill Tags */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-xs font-serif text-[#A8A198]">
              Identify your skill profile. The Matchmaking engine pairs Theory specialists with Implementation specialists.
            </p>
            <div className="flex flex-wrap gap-2 font-mono text-xs">
              {SKILL_TAGS.map(s => {
                const isSelected = selectedSkills.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSkill(s)}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      isSelected
                        ? 'bg-[#5A6B43]/20 border-[#5A6B43] text-[#A8C980] font-bold'
                        : 'bg-[#0D0C0B] border-white/10 text-[#A8A198] hover:text-[#F4F0E8]'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Collaboration Needs */}
        {step === 3 && (
          <div className="space-y-4 font-mono text-xs">
            <p className="text-xs font-serif text-[#A8A198]">
              What co-author expertise are you actively seeking for your current research projects?
            </p>
            <div>
              <label className="block text-[#A8A198] mb-2 font-bold">LOOKING FOR COLLABORATOR CALLOUT</label>
              <textarea
                rows={4}
                value={lookingFor}
                onChange={e => setLookingFor(e.target.value)}
                placeholder="e.g., Seeking a numerical implementation programmer experienced with CUDA kernels to formalize stability proofs..."
                className="w-full bg-[#0D0C0B] border border-white/10 rounded-lg p-3 text-xs text-[#F4F0E8] focus:outline-none focus:border-[#C85A32] resize-none"
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 font-mono text-xs">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 bg-[#1C1917] text-[#A8A198] rounded-lg border border-white/10 hover:text-[#F4F0E8] flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 bg-[#C85A32] hover:bg-[#B54E29] text-[#F4F0E8] font-bold rounded-lg flex items-center gap-1.5"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-[#F4F0E8] font-bold rounded-lg flex items-center gap-1.5 shadow-lg"
            >
              <Check className="w-4 h-4" /> Complete Onboarding & Enter Stream
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
