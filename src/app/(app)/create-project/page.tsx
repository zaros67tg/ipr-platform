'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/services/store';
import { ResearchDomain } from '@/types';
import { PlusCircle, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';

export default function CreateProjectPage() {
  const { createProject } = useApp();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [researchQuestion, setResearchQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState<ResearchDomain>('Systems Programming');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [openRoles, setOpenRoles] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !researchQuestion.trim()) return;

    const newProj = createProject({
      title,
      researchQuestion,
      description,
      domain,
      requiredSkills: requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      openRoles: openRoles.split(',').map(r => r.trim()).filter(Boolean),
      repositoryUrl: repositoryUrl.trim() || undefined
    });

    router.push(`/projects/${newProj.slug}`);
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <Link href="/projects" className="inline-flex items-center gap-1.5 text-xs font-mono text-[#A8A198] hover:text-[#C85A32]">
        <ArrowLeft className="w-4 h-4" />
        <span>Cancel</span>
      </Link>

      <div className="border-b border-white/10 pb-4">
        <span className="text-xs font-mono text-[#C85A32] uppercase font-bold tracking-wider">COLLABORATION INITIATION</span>
        <h1 className="text-3xl serif-title text-[#F4F0E8]">Create Research Project Hub</h1>
      </div>

      <form onSubmit={handleSubmit} className="ipr-card p-6 sm:p-8 space-y-6 font-mono text-xs">
        <div>
          <label className="block text-[#A8A198] mb-1 font-bold">PROJECT TITLE *</label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g., Low-Power Neuromorphic Vision Under Severe Constraints"
            className="w-full bg-[#0D0C0B] border border-white/10 rounded p-3 text-sm text-[#F4F0E8] focus:outline-none focus:border-[#C85A32]"
          />
        </div>

        <div>
          <label className="block text-[#A8A198] mb-1 font-bold">PRIMARY RESEARCH QUESTION *</label>
          <input
            type="text"
            required
            value={researchQuestion}
            onChange={e => setResearchQuestion(e.target.value)}
            placeholder="e.g., Can event-driven spike vision algorithms achieve zero-latency object tracking on sub-milliwatt ASIC hardware?"
            className="w-full bg-[#0D0C0B] border border-white/10 rounded p-3 text-sm text-[#F4F0E8] focus:outline-none focus:border-[#C85A32]"
          />
        </div>

        <div>
          <label className="block text-[#A8A198] mb-1 font-bold">RESEARCH DOMAIN *</label>
          <select
            value={domain}
            onChange={e => setDomain(e.target.value as ResearchDomain)}
            className="w-full bg-[#0D0C0B] border border-white/10 rounded p-3 text-sm text-[#F4F0E8] focus:outline-none focus:border-[#C85A32]"
          >
            {[
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
            ].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[#A8A198] mb-1 font-bold">DETAILED DESCRIPTION</label>
          <textarea
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Outline the scientific goals, hardware requirements, or theoretical framework..."
            className="w-full bg-[#0D0C0B] border border-white/10 rounded p-3 text-sm text-[#F4F0E8] focus:outline-none focus:border-[#C85A32] resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#A8A198] mb-1 font-bold">REQUIRED SKILLS (Comma Separated)</label>
            <input
              type="text"
              value={requiredSkills}
              onChange={e => setRequiredSkills(e.target.value)}
              placeholder="C++, CUDA, Spiking Networks"
              className="w-full bg-[#0D0C0B] border border-white/10 rounded p-3 text-xs text-[#F4F0E8] focus:outline-none focus:border-[#C85A32]"
            />
          </div>
          <div>
            <label className="block text-[#A8A198] mb-1 font-bold">OPEN ROLES (Comma Separated)</label>
            <input
              type="text"
              value={openRoles}
              onChange={e => setOpenRoles(e.target.value)}
              placeholder="Mathematical modeller, FPGA Engineer"
              className="w-full bg-[#0D0C0B] border border-white/10 rounded p-3 text-xs text-[#F4F0E8] focus:outline-none focus:border-[#C85A32]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#C85A32] hover:bg-[#B54E29] text-[#F4F0E8] font-bold rounded-lg text-xs font-mono shadow-lg transition-colors inline-flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish Project Hub to Republic</span>
        </button>
      </form>
    </div>
  );
}
