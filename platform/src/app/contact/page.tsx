import { auth } from '@/app/api/auth/[...nextauth]/route';
import {
  getUserByEmail,
  listUserRepositories,
  listUserTeams,
  Team,
  TeamMember,
} from '@/lib/db';
import PlatformShell from '@/components/PlatformShell';
import { Mail, Phone, Linkedin, MapPin, ExternalLink } from 'lucide-react';

export default async function ContactPage() {
  const session = await auth();

  let user = null;
  let repos: any[] = [];
  let teams: (TeamMember & { team: Team })[] = [];
  let overallScore = null;

  if (session?.user?.email) {
    user = await getUserByEmail(session.user.email);
    if (user) {
      repos = await listUserRepositories(user.id);
      teams = await listUserTeams(user.id);

      const reposWithScores = repos.filter(
        (r) => r.aiScore !== null && r.aiScore !== undefined
      );
      overallScore =
        reposWithScores.length > 0
          ? Math.round(
              reposWithScores.reduce((sum, r) => sum + (r.aiScore || 0), 0) /
                reposWithScores.length
            )
          : null;
    }
  }

  return (
    <PlatformShell
      user={user ? (user as any) : null}
      teams={teams}
      overallScore={overallScore}
    >
      <div className="py-20 px-4 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              Get in <span className="gradient-text-animated">Touch</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Have questions about AIReady? We're here to help you optimize your
              codebase for the AI era.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="glass-card rounded-3xl p-8 border-cyan-500/20">
                <h2 className="text-2xl font-bold text-white mb-8">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-all">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">
                        Email
                      </p>
                      <a
                        href="mailto:team@getaiready.dev"
                        className="text-white hover:text-cyan-400 transition-colors"
                      >
                        team@getaiready.dev
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20 group-hover:bg-blue-500/20 transition-all">
                      <Linkedin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">
                        LinkedIn
                      </p>
                      <a
                        href="https://www.linkedin.com/in/caopengau"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-blue-400 transition-colors flex items-center gap-1"
                      >
                        Peng Cao <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-400 border border-green-500/20 group-hover:bg-green-500/20 transition-all">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">
                        Phone
                      </p>
                      <a
                        href="tel:+61411311011"
                        className="text-white hover:text-green-400 transition-colors"
                      >
                        +61 411 311 011
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group pt-4 border-t border-slate-800">
                    <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-700">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">
                        Location
                      </p>
                      <p className="text-white">Sydney, Australia</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-8 border-purple-500/20">
              <h2 className="text-2xl font-bold text-white mb-6">
                Our Mission
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                AIReady was built on a simple premise: code that is easy for
                humans to understand is a baseline, but code that is optimized
                for autonomous AI agents is the new standard for engineering
                velocity.
              </p>
              <p className="text-slate-400 leading-relaxed">
                We're here to help you bridge the gap between legacy manual
                coding and the future of agent-native autonomous engineering.
              </p>
              <div className="mt-12 p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-500/20">
                <p className="text-white font-bold mb-2">Technical Advisory</p>
                <p className="text-sm text-slate-400">
                  Looking for a custom implementation or an AI-readiness roadmap
                  for your enterprise? Reach out to discuss our consulting
                  services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PlatformShell>
  );
}
