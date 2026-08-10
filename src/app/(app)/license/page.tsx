'use client';

import React from 'react';

export default function LicensePage() {
  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 pt-32 pb-24 space-y-12">
      {/* Header */}
      <div className="border-b border-white/10 pb-8">
        <p className="font-ui text-[10px] uppercase tracking-[0.35em] text-white/30 mb-3">
          Open Source License · Software Commons
        </p>
        <h1
          className="font-display text-white leading-none"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 600, letterSpacing: '-0.04em' }}
        >
          MIT License
        </h1>
        <p className="font-ui text-[13px] text-white/40 max-w-2xl mt-4">
          Copyright © 2026 Independent Press of Republic (IPR)
        </p>
      </div>

      {/* Official License Text */}
      <div className="space-y-8 max-w-4xl font-ui text-sm text-white/80 leading-relaxed border border-white/10 p-8 md:p-12 bg-black">
        <p className="font-mono text-xs text-white/50 border-b border-white/10 pb-4">
          SPDX-License-Identifier: MIT
        </p>

        <p>
          Permission is hereby granted, free of charge, to any person obtaining a copy
          of this software and associated documentation files (the "Software"), to deal
          in the Software without restriction, including without limitation the rights
          to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
          copies of the Software, and to permit persons to whom the Software is
          furnished to do so, subject to the following conditions:
        </p>

        <p>
          The above copyright notice and this permission notice shall be included in all
          copies or substantial portions of the Software.
        </p>

        <p className="font-mono text-xs uppercase tracking-wider text-white/60 leading-relaxed pt-4 border-t border-white/10">
          THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
          IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
          FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
          AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
          LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
          OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
          SOFTWARE.
        </p>
      </div>
    </div>
  );
}
