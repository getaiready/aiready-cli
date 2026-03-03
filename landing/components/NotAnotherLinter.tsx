'use client';

import { motion } from 'framer-motion';
import ParallaxSection from './ParallaxSection';
import { Wrench, Bot } from 'lucide-react';

export function NotAnotherLinter() {
  return (
    <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-slate-50 to-white">
      <ParallaxSection offset={15}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              This is{' '}
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                NOT
              </span>{' '}
              Another Linter
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Linters check code correctness. AIReady checks AI
              understandability.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl border-2 border-slate-200 shadow-lg"
            >
              <div className="mb-4">
                <Wrench className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Traditional Linters
              </h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">→</span>
                  <span>Check syntax and style</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">→</span>
                  <span>Catch common bugs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">→</span>
                  <span>Enforce team conventions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="font-semibold">Optimize for humans</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl border-2 border-blue-300 shadow-lg"
            >
              <div className="mb-4">
                <Bot className="w-10 h-10 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                AIReady
              </h3>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">→</span>
                  <span>Find semantic duplicates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">→</span>
                  <span>Measure context window costs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">→</span>
                  <span>Detect pattern inconsistencies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="font-semibold">
                    Optimize for AI collaboration
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 p-1 rounded-2xl"
          >
            <div className="bg-white p-8 rounded-xl text-center">
              <p className="text-2xl font-bold text-slate-900 mb-4">
                ESLint says "your code is fine." <br />
                AIReady says "your code confuses AI."
              </p>
              <p className="text-slate-600">
                Both are correct. They measure different things.
              </p>
            </div>
          </motion.div>
        </div>
      </ParallaxSection>
    </section>
  );
}
