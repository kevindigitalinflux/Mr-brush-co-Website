import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

export type ScreenKey = 'overview' | 'evidence' | 'complaints' | 'history'

export interface AppMockupProps {
  activeScreen: ScreenKey
  onScreenChange: (s: ScreenKey) => void
}

// ── Shared micro-components ───────────────────────────────────────────────────

function CheckCircle({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
      <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Screens ───────────────────────────────────────────────────────────────────

function OverviewScreen() {
  return (
    <div className="flex flex-col gap-3 px-4 pt-4 pb-3 h-full overflow-hidden">

      {/* Greeting */}
      <div>
        <p className="font-body text-[10px] text-[#737874]">Good afternoon,</p>
        <h2 className="font-heading font-bold text-[20px] text-[#3D3B3A] leading-tight tracking-[-0.3px]">Jamie D.</h2>
        <p className="font-body text-[8px] text-[#9A9A94] tracking-[0.5px] uppercase mt-0.5">MON, 9 JUNE 2026</p>
      </div>

      {/* Stat tiles */}
      <div className="flex gap-2">
        {[
          { value: '14', label: 'Cleans this month', colour: '#B8A77A' },
          { value: '0',  label: 'Open issues',       colour: '#2F4A3D' },
          { value: 'Today', label: 'Last resolved',  colour: '#2F4A3D', small: true },
        ].map((tile) => (
          <div key={tile.label} className="flex-1 bg-white border border-[#D0CFCA] rounded-[10px] px-2 py-2.5 flex flex-col items-center gap-0.5">
            <span className="font-heading font-bold leading-none text-center" style={{ color: tile.colour, fontSize: tile.small ? '11px' : '18px' }}>
              {tile.value}
            </span>
            <span className="font-body text-[8px] text-[#737874] text-center leading-tight">{tile.label}</span>
          </div>
        ))}
      </div>

      {/* Site status card */}
      <div className="bg-white border border-[#D0CFCA] rounded-[10px] overflow-hidden">
        <div className="bg-[#3D3B3A] px-3 py-2.5 flex items-center justify-between">
          <div className="min-w-0">
            <p className="font-heading font-semibold text-[11px] text-white truncate">Riverfront Tower</p>
            <p className="font-body text-[8px] text-white/45 mt-0.5">14 Eldon Street, London</p>
          </div>
          <span className="flex items-center gap-1 bg-[#2F4A3D] text-white font-heading font-bold text-[8px] px-2 py-1 rounded-full uppercase tracking-[0.4px] shrink-0 ml-2">
            <CheckCircle size={8} /> All Clear
          </span>
        </div>
        <div className="px-3 py-2.5 flex items-center justify-between">
          <p className="font-body text-[9px] text-[#737874]">Last cleaned: <span className="text-[#3D3B3A] font-bold">Mon 9 June</span></p>
          <span className="font-body text-[9px] text-[#B8A77A]">View →</span>
        </div>
      </div>

      {/* Recent evidence strip */}
      <div className="bg-white border border-[#D0CFCA] rounded-[10px] px-3 py-2.5">
        <div className="flex items-center justify-between mb-2">
          <p className="font-heading font-semibold text-[10px] text-[#3D3B3A]">Recent Evidence</p>
          <span className="font-body text-[9px] text-[#B8A77A]">View all →</span>
        </div>
        <div className="flex gap-1.5">
          {['/service-office-cleaning.png', '/service-kitchen-cleaning.png', '/service-deep-cleaning.png'].map((src, i) => (
            <div key={i} className="w-[52px] h-[52px] rounded-[8px] overflow-hidden bg-[#E3E3DD] shrink-0">
              <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
          <div className="w-[52px] h-[52px] rounded-[8px] bg-[#F0EFEA] border border-[#D0CFCA] flex items-center justify-center shrink-0">
            <span className="font-body text-[9px] text-[#434B4D]">+5</span>
          </div>
        </div>
      </div>

    </div>
  )
}

function EvidenceScreen() {
  const photos = [
    { src: '/service-office-cleaning.png',  zone: 'Reception',  time: '8m ago'  },
    { src: '/service-kitchen-cleaning.png', zone: 'Kitchen',    time: '31m ago' },
    { src: '/service-deep-cleaning.png',    zone: 'Floor 3',    time: '14m ago' },
    { src: '/service-flexible-addons.png',  zone: 'Meeting Rm', time: '1h ago'  },
  ]
  return (
    <div className="flex flex-col gap-3 px-4 pt-4 pb-3 h-full overflow-hidden">
      <div>
        <h2 className="font-heading font-bold text-[15px] text-[#3D3B3A]">Evidence Feed</h2>
        <p className="font-body text-[9px] text-[#737874] mt-0.5">Riverfront Tower · Today · 18 photos</p>
      </div>
      <div className="grid grid-cols-2 gap-2 flex-1">
        {photos.map((p) => (
          <div key={p.zone} className="relative rounded-[10px] overflow-hidden bg-[#E3E3DD]">
            <img src={p.src} alt={p.zone} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 px-2 pb-2">
              <p className="font-heading font-semibold text-white text-[9px] truncate">{p.zone}</p>
              <p className="font-body text-white/65 text-[8px]">{p.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ComplaintsScreen() {
  const steps = ['Received', 'Acknowledged', 'In Progress', 'Resolved']
  const active = 2
  return (
    <div className="flex flex-col gap-3 px-4 pt-4 pb-3 h-full overflow-hidden">
      <h2 className="font-heading font-bold text-[15px] text-[#3D3B3A]">Complaints</h2>

      {/* Complaint card */}
      <div className="bg-white border border-[#D0CFCA] rounded-[10px] p-3 flex flex-col gap-2.5">
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-full bg-[#FDF6E3] flex items-center justify-center shrink-0 mt-0.5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#B8A77A" strokeWidth="2.5" />
              <line x1="12" y1="9" x2="12" y2="13" stroke="#B8A77A" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="17" r="0.5" fill="#B8A77A" stroke="#B8A77A" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-heading font-semibold text-[11px] text-[#3D3B3A] leading-snug">Bin overflowing in stairwell A</p>
            <p className="font-body text-[8px] text-[#737874] mt-0.5">Filed 6 Jun · Riverfront Tower</p>
          </div>
          <span className="font-body text-[8px] font-bold uppercase tracking-[0.5px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full shrink-0">In Progress</span>
        </div>

        {/* Status stepper */}
        <div className="flex items-center">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 border-2 ${i <= active ? 'bg-[#2F4A3D] border-[#2F4A3D]' : 'bg-white border-[#D0CFCA]'}`} />
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px ${i < active ? 'bg-[#2F4A3D]' : 'bg-[#D0CFCA]'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between -mt-1">
          {['Rcvd', 'Ack.', 'In Prog.', 'Resolved'].map((s, i) => (
            <p key={s} className={`font-body text-[7.5px] ${i <= active ? 'text-[#2F4A3D] font-bold' : 'text-[#D0CFCA]'}`}>{s}</p>
          ))}
        </div>

        <div className="bg-[#F5F4EF] rounded-[7px] px-2.5 py-2">
          <p className="font-body text-[9px] text-[#737874] italic leading-snug">"Team notified. Resolving before the next visit."</p>
        </div>
      </div>

      {/* Resolved badge */}
      <div className="flex items-center gap-2 bg-[#EEF6F1] border border-[#2F4A3D]/20 rounded-[10px] px-3 py-2.5">
        <span className="text-[#2F4A3D]"><CheckCircle size={13} /></span>
        <p className="font-body text-[9px] text-[#2F4A3D]">1 complaint resolved this month</p>
      </div>
    </div>
  )
}

function HistoryScreen() {
  const shifts = [
    { day: '9',  month: 'Jun', site: 'Riverfront Tower', zones: '12/12', done: true,  pct: 100, cleaner: 'Maria, James' },
    { day: '7',  month: 'Jun', site: 'Riverfront Tower', zones: '12/12', done: true,  pct: 100, cleaner: 'Maria, James' },
    { day: '4',  month: 'Jun', site: 'Riverfront Tower', zones: '11/12', done: false, pct: 92,  cleaner: 'Maria' },
  ]
  return (
    <div className="flex flex-col gap-3 px-4 pt-4 pb-3 h-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-[15px] text-[#3D3B3A]">History</h2>
        <span className="font-body text-[9px] text-[#737874] bg-white border border-[#D0CFCA] px-2 py-1 rounded-full">June 2026</span>
      </div>

      <div className="flex flex-col gap-2">
        {shifts.map((s) => (
          <div key={`${s.day}-${s.month}`} className="bg-white border border-[#D0CFCA] rounded-[10px] px-3 py-2.5 flex items-center gap-2.5">
            {/* Date block */}
            <div className="w-9 shrink-0 text-center">
              <p className="font-heading font-bold text-[17px] text-[#3D3B3A] leading-none">{s.day}</p>
              <p className="font-body text-[8px] text-[#434B4D] uppercase tracking-[0.5px] mt-0.5">{s.month}</p>
            </div>
            <div className="w-px h-8 bg-[#D0CFCA] shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <p className="font-heading font-semibold text-[10px] text-[#3D3B3A] truncate">{s.site}</p>
                <span className={`font-body font-bold text-[7px] uppercase tracking-[0.6px] px-1.5 py-0.5 rounded-full shrink-0 ${s.done ? 'bg-[#EEF6F1] text-[#2F4A3D]' : 'bg-gray-100 text-[#434B4D]'}`}>
                  {s.done ? 'Done' : 'Part'}
                </span>
              </div>
              <p className="font-body text-[8px] text-[#434B4D]">{s.zones} zones · <span className="text-[#B8A77A]">{s.cleaner}</span></p>
              <div className="mt-1.5 h-1 rounded-full bg-[#F0EFEA] overflow-hidden">
                <div className={`h-full rounded-full ${s.done ? 'bg-[#2F4A3D]' : 'bg-[#B8A77A]'}`} style={{ width: `${s.pct}%` }} />
              </div>
            </div>
            <span className="text-[#D0CFCA] shrink-0"><ChevronRight /></span>
          </div>
        ))}
      </div>

      <div className="mt-auto bg-white border border-[#D0CFCA] rounded-[10px] px-3 py-2.5 flex items-center justify-between">
        <div>
          <p className="font-heading font-semibold text-[10px] text-[#3D3B3A]">June Summary</p>
          <p className="font-body text-[8px] text-[#737874] mt-0.5">14 visits · 34 photos · 0 open issues</p>
        </div>
        <button className="font-body text-[8px] font-semibold text-white bg-[#3D3B3A] px-2.5 py-1.5 rounded-[6px] flex items-center gap-1">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          PDF
        </button>
      </div>
    </div>
  )
}

// ── Nav SVG icons (exact match to ClientNav.tsx) ──────────────────────────────

function NavOverviewIcon({ active }: { active: boolean }) {
  const s = active ? '#FFFFFF' : '#434B4D'
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={s} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 22V12h6v10" stroke={s} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function NavEvidenceIcon({ active }: { active: boolean }) {
  const s = active ? '#FFFFFF' : '#434B4D'
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke={s} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="4" stroke={s} strokeWidth="2" />
    </svg>
  )
}

function NavComplaintsIcon({ active }: { active: boolean }) {
  const s = active ? '#FFFFFF' : '#434B4D'
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={s} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="9" x2="12" y2="13" stroke={s} strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.5" fill={s} stroke={s} strokeWidth="1.5" />
    </svg>
  )
}

function NavHistoryIcon({ active }: { active: boolean }) {
  const s = active ? '#FFFFFF' : '#434B4D'
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke={s} strokeWidth="2" />
      <path d="M12 7v5l3 3" stroke={s} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const NAV_TABS: { key: ScreenKey; label: string; Icon: (p: { active: boolean }) => JSX.Element }[] = [
  { key: 'overview',   label: 'Overview',   Icon: NavOverviewIcon   },
  { key: 'evidence',   label: 'Evidence',   Icon: NavEvidenceIcon   },
  { key: 'complaints', label: 'Complaints', Icon: NavComplaintsIcon },
  { key: 'history',    label: 'History',    Icon: NavHistoryIcon    },
]

// ── Export ────────────────────────────────────────────────────────────────────

/** Interactive phone-frame mockup of the Mr Brush client portal.
 *  Matches the real app's nav, colours, and screen layouts exactly.
 *  Screens switch via scroll (parent-controlled) or tap on the bottom nav. */
export function AppMockup({ activeScreen, onScreenChange }: AppMockupProps) {
  const screenRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = screenRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' })
    })
    return () => ctx.revert()
  }, [activeScreen])

  return (
    <div className="w-[248px] mx-auto select-none">
      {/* Phone shell */}
      <div className="bg-[#111110] rounded-[40px] p-[5px] shadow-[0_48px_120px_rgba(0,0,0,0.75)] border border-white/[0.05]">
        <div className="rounded-[36px] overflow-hidden bg-[#F5F4EF] flex flex-col">

          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-3 pb-1.5 bg-[#F5F4EF] shrink-0">
            <span className="font-heading font-bold text-[11px] text-[#3D3B3A]">9:41</span>
            <div className="flex items-center gap-1.5">
              {/* Signal bars */}
              <svg width="15" height="11" viewBox="0 0 15 11" fill="none" aria-hidden="true">
                <rect x="0" y="7" width="3" height="4" rx="0.5" fill="#3D3B3A" />
                <rect x="4" y="4.5" width="3" height="6.5" rx="0.5" fill="#3D3B3A" />
                <rect x="8" y="2" width="3" height="9" rx="0.5" fill="#3D3B3A" />
                <rect x="12" y="0" width="3" height="11" rx="0.5" fill="#3D3B3A" opacity="0.3" />
              </svg>
              {/* Battery */}
              <svg width="19" height="11" viewBox="0 0 19 11" fill="none" aria-hidden="true">
                <rect x="0.5" y="0.5" width="16" height="10" rx="2.5" stroke="#3D3B3A" strokeOpacity="0.35" />
                <rect x="2" y="2" width="12" height="7" rx="1.5" fill="#3D3B3A" />
                <path d="M17.5 3.5v4" stroke="#3D3B3A" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Screen area */}
          <div className="h-[370px] overflow-hidden shrink-0">
            <div ref={screenRef} className="h-full">
              {activeScreen === 'overview'   && <OverviewScreen />}
              {activeScreen === 'evidence'   && <EvidenceScreen />}
              {activeScreen === 'complaints' && <ComplaintsScreen />}
              {activeScreen === 'history'    && <HistoryScreen />}
            </div>
          </div>

          {/* Bottom nav — exact match to ClientNav.tsx */}
          <div className="bg-white border-t border-[#E3E3DD] flex items-center justify-around shrink-0" style={{ height: '56px' }}>
            {NAV_TABS.map(({ key, label, Icon }) => {
              const isActive = activeScreen === key
              return (
                <button
                  key={key}
                  onClick={() => onScreenChange(key)}
                  aria-label={label}
                  className="flex flex-col items-center gap-0.5 flex-1 py-1.5"
                >
                  <div className={`w-9 h-6 rounded-full flex items-center justify-center transition-colors duration-150 ${isActive ? 'bg-[#B8A77A]' : 'bg-transparent'}`}>
                    <Icon active={isActive} />
                  </div>
                  <span className={`text-[8.5px] tracking-[0.2px] font-body ${isActive ? 'text-[#B8A77A] font-bold' : 'text-[#434B4D]'}`}>
                    {label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* iOS home indicator */}
          <div className="bg-white pb-2.5 flex justify-center pt-1 shrink-0">
            <div className="w-16 h-[3px] bg-[#3D3B3A]/10 rounded-full" />
          </div>

        </div>
      </div>
    </div>
  )
}
