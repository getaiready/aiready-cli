'use client';

import { motion } from 'framer-motion';
import ParallaxSection from './ParallaxSection';
import { Bot, Code2, ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="container mx-auto px-4 py-24 mb-12">
      <ParallaxSection offset={10}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-slate-900 rounded-3xl p-12 text-center border border-slate-800 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 relative">
            Ready to Unlock Your <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              AI Potential?
            </span>
          </h2>

          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto relative">
            Join elite engineering teams using AIReady to ship faster, reduce
            context costs, and build future-proof codebases.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg inline-flex items-center justify-center gap-2 group"
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <motion.a
              href="mailto:hello@getaiready.dev"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-slate-800 text-white font-bold rounded-xl border border-slate-700 shadow-lg inline-flex items-center justify-center gap-2"
            >
              <Bot className="w-5 h-5 text-blue-400" />
              Book an AI Audit
            </motion.a>
          </div>
        </motion.div>
      </ParallaxSection>
    </section>
  );
}
