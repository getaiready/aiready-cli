'use client';

import { motion } from 'framer-motion';
import ParallaxSection from './ParallaxSection';
import { BarChart3, Handshake, Rocket } from 'lucide-react';

export function ConsultantsSection() {
  const items = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Professional Audits',
      desc: 'Generate PDF or JSON reports to provide clear, data-backed ROI for potential AI initiatives.',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      icon: <Handshake className="w-8 h-8" />,
      title: 'Transition Advisory',
      desc: 'Use metrics like Context Fragmentation to guide teams during architectural transitions.',
      color: 'from-indigo-600 to-purple-600',
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Remediation Roadmap',
      desc: 'Focus effort where it matters most: eliminating token waste and deep import chains.',
      color: 'from-purple-600 to-pink-600',
    },
  ];

  return (
    <section className="py-24 bg-slate-900 border-y border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="container mx-auto px-4 relative">
        <ParallaxSection offset={10}>
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Built for{' '}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  AI Consultants
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Empower your practice with high-precision codebase discovery and
                AI-readiness scoring.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="relative group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/[0.08] transition-all"
                >
                  <div
                    className={`w-14 h-14 rounded-xl mb-4 flex items-center justify-center text-white shadow-lg bg-gradient-to-r ${item.color}`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-20 text-center">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://getaiready.dev/docs#consulting"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-black rounded-full shadow-2xl hover:bg-slate-100 transition-all"
              >
                View Consulting Playbook
              </motion.a>
            </div>
          </div>
        </ParallaxSection>
      </div>
    </section>
  );
}
