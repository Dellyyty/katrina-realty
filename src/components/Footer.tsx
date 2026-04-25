import { agent } from '../data/agent';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-black/10 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="font-display text-2xl text-black">
            Kirton Sherrod<sup className="text-[0.5em] ml-0.5">®</sup>
          </div>
          <p className="text-xs mt-2" style={{ color: '#6F6F6F' }}>
            {agent.title} · {agent.brokerage}
          </p>
        </div>
        <div className="text-xs" style={{ color: '#6F6F6F' }}>
          © {new Date().getFullYear()} {agent.name}. Licensed in MD, DC, PA. Equal Housing Opportunity.
        </div>
        <a
          href="/admin"
          className="text-xs hover:text-black transition-colors"
          style={{ color: '#6F6F6F' }}
        >
          Admin
        </a>
      </div>
    </footer>
  );
}
