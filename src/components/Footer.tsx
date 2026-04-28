import { agent } from '../data/agent';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-black/10 pt-16 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 items-start">
          <div>
            <img
              src="/kks-logo.png"
              alt="KKS Home Group of Samson Properties"
              className="h-40 sm:h-48 w-auto mb-4"
              loading="lazy"
            />
            <p className="text-sm" style={{ color: '#6F6F6F' }}>
              {agent.title} · {agent.brokerage}
            </p>
            <p className="text-xs mt-3" style={{ color: '#6F6F6F' }}>
              {agent.certifications.join(' · ')}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] mb-4 text-black">Contact</p>
            <ul className="space-y-2 text-sm" style={{ color: '#6F6F6F' }}>
              <li>
                <a href={`tel:${agent.phone.replace(/\D/g, '')}`} className="hover:text-black transition-colors">
                  {agent.phone} <span className="text-xs">(DIRECT)</span>
                </a>
              </li>
              <li>
                <a href={`tel:${agent.officePhone.replace(/\D/g, '')}`} className="hover:text-black transition-colors">
                  {agent.officePhone} <span className="text-xs">(SAMSON office)</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${agent.email}`} className="hover:text-black transition-colors break-all">
                  {agent.email}
                </a>
              </li>
              <li className="pt-2">
                <div className="text-black">{agent.officeName}</div>
                <div>{agent.officeAddress}</div>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] mb-4 text-black">Connect</p>
            <ul className="space-y-2 text-sm" style={{ color: '#6F6F6F' }}>
              <li>
                <a href={agent.websiteUrl} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                  SAMSON PROPERTIES Profile →
                </a>
              </li>
              <li>
                <a href={agent.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                  Instagram @kkstherealtor →
                </a>
              </li>
              <li>
                <a href={agent.zillowUrl} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                  Zillow Reviews · 5.0 ★ →
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-black/10 flex flex-col-reverse md:flex-row justify-between items-start md:items-center gap-6">
          <div className="text-xs" style={{ color: '#6F6F6F' }}>
            © {new Date().getFullYear()} {agent.name}. Licensed in {agent.licensedStates.join(', ')}. Equal Housing Opportunity.
          </div>
          <div className="flex items-center gap-4">
            <img
              src="/eho-realtor.png"
              alt="Equal Housing Opportunity · REALTOR®"
              className="h-12 w-auto"
              loading="lazy"
            />
            <a href="/admin" className="text-xs hover:text-black transition-colors" style={{ color: '#6F6F6F' }}>
              Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
