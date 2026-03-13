'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  Hash,
  Terminal,
  Activity,
  Zap,
  ChevronRight,
  Cpu,
  RefreshCcw,
  MessageSquare,
  Link as LinkIcon,
} from 'lucide-react';
import Modal from '../../../components/Modal';
import LeadForm from '../../../components/LeadForm';
import SystemFlow from '../../../components/SystemFlow';

const BRIDGE_NODES = [
  {
    id: 'lambda',
    data: { label: '[LAMBDA_GATEWAY]', type: 'event' },
    position: { x: 0, y: 0 },
  },
  {
    id: 'bridge',
    data: { label: 'BRIDGE_SERVER', type: 'bus' },
    position: { x: 250, y: 0 },
  },
  {
    id: 'fargate',
    data: { label: '[FARGATE_CONTAINER]', type: 'agent' },
    position: { x: 500, y: 0 },
  },
  {
    id: 'ws',
    data: { label: 'WEBSOCKET_STREAM', type: 'event' },
    position: { x: 750, y: 0 },
  },
];

const BRIDGE_EDGES = [
  {
    id: 'e1',
    source: 'lambda',
    target: 'bridge',
    label: 'HTTP_POST',
    animated: true,
  },
  {
    id: 'e2',
    source: 'bridge',
    target: 'fargate',
    label: 'PIPE_INTENT',
    animated: true,
  },
  {
    id: 'e3',
    source: 'fargate',
    target: 'ws',
    label: 'PERSISTENT_SYNC',
    animated: true,
    style: { stroke: '#00ffa3' },
  },
];

export default function BlogPost() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const apiUrl = process.env.NEXT_PUBLIC_LEAD_API_URL || '';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-cyber-purple/30 selection:text-cyber-purple font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/5">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="ClawMore Logo"
              width={32}
              height={32}
              className="drop-shadow-[0_0_8px_rgba(188,0,255,0.6)]"
            />
            <span className="text-xl font-bold tracking-tight italic glow-text">
              ClawMore
            </span>
          </Link>
          <div className="flex items-center gap-8 text-[11px] font-mono uppercase tracking-widest text-zinc-500">
            <Link
              href="/blog"
              className="hover:text-cyber-purple transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-3 h-3" /> Back to Journal
            </Link>
          </div>
        </div>
      </nav>

      {/* Article Header */}
      <header className="py-24 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(188,0,255,0.05)_0%,_transparent_70%)] opacity-30" />

        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="text-cyber-purple font-mono text-[9px] uppercase tracking-[0.4em] font-black border border-cyber-purple/20 px-2 py-1 bg-cyber-purple/5">
                PROTOCOL_BRIDGE
              </div>
              <div className="flex items-center gap-1.5 text-zinc-600 font-mono text-[9px]">
                <Hash className="w-3 h-3" />
                <span>HASH: bridge-proto</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-600 font-mono text-[9px]">
                <Clock className="w-3 h-3" />
                <span>07 MIN READ</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic leading-[1.1]">
              The Bridge Pattern: <br />
              <span className="text-cyber-purple">HTTP to WebSocket</span>
            </h1>

            <p className="text-xl text-zinc-400 font-light leading-relaxed italic">
              Solving the "Persistent connection" problem in a serverless world.
              How we connect ephemeral Lambda triggers to long-running AI
              streams.
            </p>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <article className="prose prose-invert prose-zinc max-w-none">
              <div className="space-y-12">
                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      01
                    </span>
                    The Connection Paradox
                  </h2>
                  <p className="text-zinc-400 leading-relaxed text-lg">
                    Serverless functions (AWS Lambda) are built for short-lived,
                    request-response cycles. AI agents, however, often require
                    persistent WebSocket connections to maintain "eyes on" a
                    task or to stream long-form reasoning.
                  </p>
                  <p className="text-zinc-400 leading-relaxed text-lg mt-6">
                    If you kill the connection, you kill the agent's context.
                    How do we keep the conversation alive when the underlying
                    compute is designed to die?
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      02
                    </span>
                    The Bridge Server Innovation
                  </h2>
                  <p className="text-zinc-400 leading-relaxed text-lg">
                    We implemented a custom **Bridge Server** inside the Fargate
                    container. This bridge acts as a protocol translator. It
                    accepts ephemeral HTTP POST requests from the Lambda gateway
                    and translates them into persistent internal signals for the
                    OpenClaw core.
                  </p>
                </section>

                <SystemFlow
                  nodes={BRIDGE_NODES}
                  edges={BRIDGE_EDGES}
                  height="350px"
                />

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      03
                    </span>
                    Piping Intent
                  </h2>
                  <p className="text-zinc-400 leading-relaxed text-lg">
                    When a message arrives via Telegram, the Lambda Gateway
                    spins up the Fargate container if it's not already running.
                    The Bridge Server then "re-hydrates" the session state from
                    DynamoDB and establishes a WebSocket connection to the AI
                    provider.
                  </p>
                  <div className="mt-8 p-6 bg-zinc-900/50 border border-white/10 rounded-sm font-mono text-[11px] text-zinc-400">
                    <div className="flex items-center gap-2 text-cyber-purple mb-2">
                      <LinkIcon className="w-3 h-3" />
                      <span>BRIDGE_TRANSLATOR.ts</span>
                    </div>
                    {`// Translating Ephemeral HTTP to Persistent WS
app.post('/gateway/message', async (req, res) => {
  const { userId, text } = req.body;
  
  // Find or create persistent socket for user
  const socket = await SocketMesh.getOrCreate(userId);
  
  // Pipe request body into the persistent stream
  socket.emit('agent:intent', { message: text });
  
  res.status(202).json({ status: 'intent_piped' });
});`}
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      04
                    </span>
                    Stateless But Connected
                  </h2>
                  <p className="text-zinc-400 leading-relaxed text-lg">
                    The Bridge Pattern allows `serverlessclaw` to maintain the
                    illusion of a persistent server while benefiting from the
                    cost savings of ephemeral compute. It's the technical glue
                    that makes the $1/month AI agent possible.
                  </p>
                  <p className="text-zinc-400 leading-relaxed text-lg mt-6">
                    In our next entry, **Omni-Channel Command**, we'll explore
                    how this bridge connects to six different messaging
                    platforms simultaneously.
                  </p>
                </section>
              </div>

              {/* Series Navigation */}
              <div className="mt-24 pt-12 border-t border-white/5">
                <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em] mb-8">
                  Up_Next_In_The_Minimalist
                </div>
                <Link
                  href="/blog/omni-channel-ai-gateway"
                  className="block group"
                >
                  <div className="glass-card p-8 flex items-center justify-between hover:border-cyber-purple/30 transition-all bg-white/[0.01]">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-sm bg-cyber-purple/10 flex items-center justify-center text-cyber-purple border border-cyber-purple/20">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[9px] font-mono text-cyber-purple uppercase tracking-widest mb-1">
                          PART 08 // OMNI_CHANNEL
                        </div>
                        <div className="text-2xl font-black italic group-hover:text-white transition-colors">
                          Omni-Channel Command: One Agent, Six Interfaces
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-zinc-700 group-hover:text-cyber-purple group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </div>
            </article>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-20 bg-black">
        <div className="container mx-auto px-4 text-center text-zinc-700 text-[10px] font-mono uppercase tracking-[0.5em]">
          TERMINAL_LOCKED // 2026 PERPETUAL_EVOLUTION
        </div>
      </footer>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <LeadForm type="waitlist" onSuccess={closeModal} apiUrl={apiUrl} />
      </Modal>
    </div>
  );
}
