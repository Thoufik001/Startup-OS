import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  Archive,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Bot,
  Briefcase,
  Check,
  ChevronRight,
  Circle,
  Clock3,
  Command,
  Copy,
  FileText,
  Folder,
  Globe2,
  GripVertical,
  Home,
  Inbox,
  Layers3,
  List,
  ListChecks,
  ListOrdered,
  MailPlus,
  MessageSquareText,
  Mic,
  MoreHorizontal,
  PanelRightOpen,
  Plus,
  Search,
  Send,
  Settings,
  Sparkles,
  Star,
  Target,
  Trash2,
  Users,
  Wand2,
} from "lucide-react";

const companyProfile = {
  name: "DeployIQ",
  description: "SAP Staff Augmentation",
  brandAccent: "#242424",
  brandAccentHover: "#303030",
  brandAccentSoft: "#F4F4F4",
  brandAccentRing: "#E2E2E2",
};

const appColors = {
  approvedBg: "#EAF7EF",
  approvedText: "#2E7D4F",
  approvedBorder: "#CFECDD",
  verified: "#36b8ee",
  contextWarm: "#3A3A3A",
  sourceRed: "#f05d42",
  sourceBlue: "#2f7dd1",
  sourceGreen: "#1d8f52",
  successGreen: "#28c840",
};

const knowledge = [
  {
    id: "positioning",
    title: "Positioning",
    description: "The approved narrative for what the startup is, who it serves, and why it should win.",
    status: "Approved",
    updated: "2h ago",
    icon: Target,
    section: "Core context",
  },
  {
    id: "value-prop",
    title: "Value Proposition",
    description: "The clear promise we make to the market, written in customer language.",
    status: "Approved",
    updated: "Today",
    icon: BadgeCheck,
    section: "Core context",
  },
  {
    id: "icp",
    title: "ICP & Personas",
    description: "The buyers, users, pains, objections, and situations we are built for.",
    status: "Approved",
    updated: "Yesterday",
    icon: Users,
    section: "Customer",
  },
  {
    id: "competitors",
    title: "Competitor Angles",
    description: "How we compare against alternatives, old workflows, and generic AI tools.",
    status: "Draft",
    updated: "2 days ago",
    icon: Layers3,
    section: "Market",
  },
  {
    id: "proof",
    title: "Proof Materials",
    description: "Customer quotes, evidence, case studies, screenshots, numbers, and wins.",
    status: "Needs update",
    updated: "5 days ago",
    icon: FileText,
    section: "Proof",
  },
  {
    id: "tone",
    title: "Tone of Voice",
    description: "How the brand should sound across posts, pages, emails, and campaigns.",
    status: "Draft",
    updated: "1 week ago",
    icon: MessageSquareText,
    section: "Brand",
  },
  {
    id: "gtm",
    title: "GTM Notes",
    description: "Channels, campaigns, launch ideas, sales angles, and active market learnings.",
    status: "Draft",
    updated: "1 week ago",
    icon: BarChart3,
    section: "Growth",
  },
];

const artifacts = [
  { title: "Founder LinkedIn post", source: "Positioning + ICP", time: "12 min ago", type: "Social" },
  { title: "Landing page hero", source: "Positioning + Value Prop", time: "1h ago", type: "Website" },
  { title: "Cold email sequence", source: "ICP + Proof", time: "3h ago", type: "Sales" },
  { title: "Competitor battlecard", source: "Competitors + Proof", time: "Yesterday", type: "Sales enablement" },
];

const prompts = [
  "Create a founder LinkedIn post using our positioning and ICP",
  "Write a landing page hero from our approved value proposition",
  "Turn proof materials into a short case study draft",
  "Create a competitor battlecard for sales calls",
  "Write a cold email sequence for our ICP",
  "Create a launch campaign brief from GTM notes",
];

const paragraphSeparator = String.fromCharCode(10, 10);

const generatedBody = [
  "Most startups do not have a content problem. They have a context problem.",
  "The positioning sits in one doc. ICP notes live elsewhere. Proof is buried in calls. Competitor angles are scattered across old decks and founder memory.",
  "That is why every new post, landing page, campaign, or sales email starts from zero.",
  "ContextOS gives startup teams one place to define the truth, then uses that approved context to build consistent GTM artifacts.",
].join(paragraphSeparator);

console.assert(generatedBody.includes(paragraphSeparator), "generatedBody should preserve paragraph breaks.");

function StatusBadge({ status }) {
  const styles = {
    Approved: "border-[var(--approved-border)] bg-[var(--approved-bg)] text-[var(--approved-text)]",
    Draft: "bg-[#F6F6F6] text-[#747474] border-[#ECECEC]",
    "Needs update": "bg-[#FFF7E8] text-[#9A6A10] border-[#F4E0B8]",
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] ${styles[status]}`}>
      {status === "Approved" ? <Check size={11} /> : <Circle size={8} />}
      {status}
    </span>
  );
}

function IconRail({ active, setActive }) {
  const items = [
    { id: "dashboard", icon: Command, label: "Dashboard" },
    { id: "define", icon: Inbox, label: "Define" },
    { id: "build", icon: Wand2, label: "Build" },
    { id: "artifacts", icon: Briefcase, label: "Artifacts" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="hidden w-[72px] shrink-0 border-r border-[#ececec] bg-white py-5 md:flex md:flex-col md:items-center md:justify-between">
      <div className="flex flex-col items-center gap-4">
        <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand-accent)] text-white shadow-sm">
          <Sparkles size={18} />
        </button>
        <div className="flex flex-col gap-2">
          {items.map((item) => {
            const Icon = item.icon;
            const selected = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => item.id !== "artifacts" && item.id !== "settings" && setActive(item.id)}
                title={item.label}
                className={`flex h-10 w-10 items-center justify-center rounded-lg transition ${
                  selected ? "bg-white text-[var(--brand-accent)] shadow-[0_1px_4px_rgba(0,0,0,0.08)] ring-1 ring-[#e9e9e9]" : "text-[#8a8a8a] hover:bg-white hover:text-[#333]"
                }`}
              >
                <Icon size={18} strokeWidth={1.8} />
              </button>
            );
          })}
        </div>
      </div>
      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#e8e8e8] to-white ring-1 ring-[#dedede]" />
    </aside>
  );
}

function LeftSidebar({ active, setActive, collapsed, setCollapsed, sidebarWidth, setSidebarWidth, onCreateSource }) {
  const mainNav = [
    ["dashboard", "Brand Dashboard", Globe2],
    ["define", "Define Sources", BookOpen],
    ["build", "Build Artifacts", Bot],
  ];

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [recentMenuOpen, setRecentMenuOpen] = useState(null);
  const [recentSectionOpen, setRecentSectionOpen] = useState(true);

  const profileMenuItems = [
    "Account settings",
    "API keys",
    "Team members",
    "Log out",
  ];

  const recentMenuItems = ["Open", "Rename", "Duplicate", "Move to archive", "Delete"];
  const recentSources = knowledge.slice(0, 4).map((item) => item.title);
  const recentBuildArtifacts = artifacts.slice(0, 4).map((item) => item.title);
  const contextLabel = active === "define" ? "Recent sources" : active === "build" ? "Recent artifacts" : null;
  const contextItems = active === "define" ? recentSources : active === "build" ? recentBuildArtifacts : [];
  const contextAction = active === "define"
    ? { label: "New Source", Icon: Plus, onClick: onCreateSource }
    : active === "build"
      ? { label: "New Artifact", Icon: Plus, onClick: () => setActive("build") }
      : null;

  const startResize = (event) => {
    if (collapsed) return;
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = sidebarWidth;

    const onMouseMove = (moveEvent) => {
      const nextWidth = Math.min(360, Math.max(228, startWidth + moveEvent.clientX - startX));
      setSidebarWidth(nextWidth);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <aside
      className="relative hidden shrink-0 overflow-hidden border-r border-[#ececec] bg-[#fcfcfc] transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] lg:flex lg:flex-col"
      style={{ width: collapsed ? 72 : sidebarWidth }}
    >
      {!collapsed && (
        <div
          onMouseDown={startResize}
          title="Resize sidebar"
          className="group absolute right-[-4px] top-0 z-20 h-full w-2 cursor-col-resize"
        >
          <div className="mx-auto h-full w-px bg-transparent transition group-hover:bg-[#d0d0d0]" />
        </div>
      )}

      <div className="flex h-full shrink-0 flex-col" style={{ width: sidebarWidth }}>
        <div className="flex h-[73px] items-center gap-3 border-b border-[#f0f0f0] px-5 py-4">
          <button
            onClick={() => collapsed ? setCollapsed(false) : setActive("dashboard")}
            title={collapsed ? "Expand sidebar" : "Brand Dashboard"}
            className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-accent)] text-white shadow-sm transition-all duration-200 ease-in-out"
          >
            <Sparkles size={18} className="block group-hover:hidden" />
            <ChevronRight size={18} className="hidden group-hover:block" />
          </button>

          <div className="min-w-0 flex-1 overflow-hidden transition-opacity duration-200 ease-in-out" style={{ opacity: collapsed ? 0 : 1 }}>
            <div className="truncate text-sm font-semibold text-[#2b2b2b]">{companyProfile.name}</div>
            <div className="truncate text-xs text-[#888]">{companyProfile.description}</div>
          </div>

          <button
            onClick={() => setCollapsed(true)}
            title="Collapse sidebar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#777] transition-all duration-200 ease-in-out hover:bg-[#f3f3f3] hover:text-[#222]"
            style={{ opacity: collapsed ? 0 : 1, pointerEvents: collapsed ? "none" : "auto" }}
          >
            <ChevronRight size={18} className="rotate-180" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="space-y-1">
            {mainNav.map(([id, label, Icon]) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                title={label}
                className={`relative flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-sm transition-colors duration-200 ease-in-out ${
                  active === id && !collapsed ? "bg-[#f3f3f3] text-[#262626]" : "text-[#666] hover:bg-[#f7f7f7]"
                }`}
              >
                {collapsed && active === id && (
                  <span className="pointer-events-none absolute left-0 top-1/2 h-10 w-10 -translate-y-1/2 rounded-lg bg-[#f3f3f3]" />
                )}
                <span className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center">
                  <Icon size={18} strokeWidth={1.8} />
                </span>
                <span
                  className="whitespace-nowrap transition-opacity duration-200 ease-in-out"
                  style={{ opacity: collapsed ? 0 : 1, pointerEvents: collapsed ? "none" : "auto" }}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>

          {!collapsed && contextLabel && (
            <div className="mt-6 border-t border-[#eeeeee] pt-4">
              {contextAction && (
                <button
                  onClick={contextAction.onClick}
                  className="mb-4 flex h-9 w-full items-center justify-between rounded-lg bg-[var(--brand-accent)] px-3 text-sm font-medium text-white transition hover:bg-[var(--brand-accent-hover)]"
                >
                  <span className="flex items-center gap-2">
                    <contextAction.Icon size={15} /> {contextAction.label}
                  </span>
                  <span className="rounded-md bg-white/12 px-1.5 py-0.5 text-[11px] font-medium text-white/72">Cmd N</span>
                </button>
              )}
              <button
                onClick={() => setRecentSectionOpen((open) => !open)}
                className="mb-2 flex w-full items-center justify-between rounded-lg px-1 py-1 text-left type-label text-[#999] transition hover:bg-[#f5f5f5] hover:text-[#555]"
              >
                <span>{contextLabel}</span>
                <ChevronRight size={14} className={`shrink-0 transition-transform duration-200 ${recentSectionOpen ? "rotate-90" : ""}`} />
              </button>
              {recentSectionOpen && (
                <div className="space-y-1">
                  {contextItems.map((item) => (
                    <button
                      key={item}
                      onClick={() => setActive(active === "define" ? "define" : "build")}
                      className="flex w-full items-center rounded-lg px-2 py-2 text-left text-sm text-[#555] transition hover:bg-[#f5f5f5] hover:text-[#222]"
                    >
                      <span className="min-w-0 truncate">{item}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        <div className="relative border-t border-[#f0f0f0] px-5 py-4">
          <div className="flex w-full items-center gap-3 rounded-lg px-0 py-2 text-left">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-accent)] text-sm font-semibold text-white">
              TH
            </div>
            <div className="min-w-0 flex-1 overflow-hidden transition-opacity duration-200 ease-in-out" style={{ opacity: collapsed ? 0 : 1 }}>
              <div className="truncate text-sm font-medium text-[#333]">Thoufik</div>
              <div className="truncate text-xs text-[#8a8a8a]">Product Designer</div>
            </div>
            <button
              onClick={(event) => {
                event.stopPropagation();
                setProfileMenuOpen((open) => !open);
              }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#8a8a8a] transition hover:bg-[#eaeaea] hover:text-[#333]"
              style={{ opacity: collapsed ? 0 : 1, pointerEvents: collapsed ? "none" : "auto" }}
              title="Profile options"
            >
              <MoreHorizontal size={16} />
            </button>
          </div>

          {!collapsed && profileMenuOpen && (
            <div className="absolute bottom-[76px] left-5 right-5 z-30 overflow-hidden rounded-lg border border-[#e6e6e6] bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
              <div className="py-1">
                {profileMenuItems.map((item) => (
                  <button
                    key={item}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-[#f5f5f5] ${
                      item === "Log out" ? "text-[#b42318]" : "text-[#444]"
                    }`}
                  >
                    {item}
                    {item !== "Log out" && <ChevronRight size={14} className="text-[#aaa]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="flex h-[64px] items-center justify-between border-b border-[#ececec] bg-white px-5">
      <div className="flex items-center gap-2 text-sm text-[#777]">
        <button className="rounded-lg bg-[#f4f4f4] px-3 py-1.5 text-[#333]">Context Health</button>
        <button className="rounded-lg px-3 py-1.5 hover:bg-[#f7f7f7]">Sources</button>
        <button className="rounded-lg px-3 py-1.5 hover:bg-[#f7f7f7]">Artifacts</button>
        <button className="rounded-lg px-3 py-1.5 hover:bg-[#f7f7f7]">GTM Library</button>
      </div>
      <div className="hidden w-[320px] items-center gap-2 rounded-lg border border-[#e8e8e8] bg-white px-3 py-2 text-sm text-[#9a9a9a] shadow-[0_1px_2px_rgba(0,0,0,0.03)] md:flex">
        <Search size={15} />
        Search
        <span className="ml-auto text-xs">⌘K</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-[#777]">
        <button className="rounded-lg px-2 py-1.5 hover:bg-[#f7f7f7]">Profile</button>
        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#b9a7ff] to-[#f5f2ff] ring-1 ring-[#ececec]" />
      </div>
    </header>
  );
}

function Dashboard({ setActive }) {
  return (
    <div className="mx-auto min-h-full max-w-[820px] px-8 py-12 pb-24">
      <div className="mb-12 border-b border-[#ededed] pb-8">
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-lg border border-[#ececec] bg-white text-[var(--brand-accent)] shadow-sm">
          <Sparkles size={30} strokeWidth={1.6} />
        </div>
        <h1 className="text-[32px] font-semibold leading-tight tracking-[-0.04em] text-[#292929]">Your startup context, ready for AI execution</h1>
        <p className="mt-4 max-w-[620px] text-[15px] leading-7 text-[#666]">
          Define your positioning, ICP, proof, competitors, tone, and GTM notes once. Then build consistent marketing and sales artifacts from approved sources.
        </p>
        <div className="mt-7 flex max-w-[620px] items-center rounded-lg bg-[#f4f4f4] px-4 py-3 font-mono text-sm text-[#555]">
          define company truth → build GTM artifacts
          <button className="ml-auto text-[#777]">⧉</button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[360px_1fr]">
        <div className="rounded-lg border border-[#e9e9e9] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="mb-4 flex gap-2">
            <span className="h-3 w-3 rounded-lg bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-lg bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-lg bg-[var(--success-green)]" />
          </div>
          <div className="space-y-4 text-sm text-[#777]">
            <div className="flex items-center gap-3"><Target size={15} /> positioning source approved</div>
            <div className="flex items-center gap-3"><Users size={15} /> ICP and personas mapped</div>
            <div className="flex items-center gap-3"><BadgeCheck size={15} /> proof materials linked</div>
            <div className="flex items-center gap-3"><Globe2 size={15} /> GTM notes ready</div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <h2 className="text-[26px] font-semibold tracking-[-0.04em] text-[#292929]">Define truth. Build output.</h2>
          <p className="mt-4 text-[15px] leading-7 text-[#666]">The product is intentionally simple: maintain approved company context, then generate GTM assets from it.</p>
          <div className="mt-7 flex gap-3">
            <button onClick={() => setActive('define')} className="rounded-lg bg-[var(--brand-accent)] px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-[var(--brand-accent-hover)]">Add Source</button>
            <button onClick={() => setActive('build')} className="rounded-lg border border-[#e6e6e6] bg-white px-5 py-3 text-sm font-medium text-[#444] hover:bg-[#f7f7f7]">Build Artifact</button>
          </div>
        </div>
      </div>

      <div className="mt-12 pb-16">
        <h2 className="text-[26px] font-semibold tracking-[-0.04em] text-[#292929]">Context health</h2>
        <p className="mt-3 text-[15px] leading-7 text-[#666]">Build quality depends on the coverage and approval status of your Define sources.</p>
        <div className="mt-6 space-y-4">
          {['Positioning', 'ICP', 'Proof', 'Competitors'].map((item, index) => {
            const value = [95, 88, 52, 61][index];
            return (
              <div key={item}>
                <div className="mb-2 flex justify-between text-sm text-[#777]"><span>{item}</span><span>{value}%</span></div>
                <div className="h-2 rounded-lg bg-[#f0f0f0]"><div className="h-2 rounded-lg bg-[var(--brand-accent)]" style={{ width: `${value}%` }} /></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DashboardV2({ setActive }) {
  const healthItems = [
    { label: "Positioning", status: "Ready", tone: "strong" },
    { label: "ICP", status: "Ready", tone: "strong" },
    { label: "Proof", status: "Needs evidence", tone: "weak" },
    { label: "Competitors", status: "Draft", tone: "draft" },
  ];
  const keyMetrics = [
    { label: "Source coverage", value: "4/7", detail: "Core context blocks filled" },
    { label: "Traceability", value: "62%", detail: "Sources and web citations attached" },
  ];
  const recentArtifacts = [
    ["Founder LinkedIn post", "12 min ago"],
    ["Landing page hero", "1h ago"],
    ["Cold email sequence", "3h ago"],
    ["Competitor battlecard", "Yesterday"],
  ];
  const recommendations = [
    { title: "Capture proof", detail: "Add 3 customer wins or screenshots.", view: "define" },
    { title: "Build a founder post", detail: "Ready with Positioning + ICP context.", view: "build" },
    { title: "Add design references", detail: "Needed before visual artifacts.", view: "define" },
  ];
  const missingContext = [
    "No customer proof added",
    "No design references added",
    "Competitor notes are still draft",
  ];

  return (
    <div className="mx-auto min-h-full max-w-[1120px] px-4 py-5 pb-24 sm:px-6 lg:py-7">
      <section className="rounded-lg border border-[#e6e6e6] bg-white p-5 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(150px,1fr)_minmax(150px,1fr)] lg:items-stretch">
          <div className="lg:pr-8">
            <div className="type-label text-[#999]">Context health</div>
            <h1 className="type-page-title mt-2 max-w-[720px] text-[#262626]">
              {companyProfile.name} context is 68% ready for GTM output.
            </h1>
            <p className="type-body mt-3 max-w-[680px] text-[#666]">
              Positioning and ICP are strong. Proof and design references need work before generating stronger sales and landing page assets.
            </p>
          </div>
          {keyMetrics.map((metric) => (
              <div key={metric.label} className="flex min-h-[132px] flex-col justify-between rounded-lg bg-[#f7f7f7] p-4">
                <div className="type-label text-[#999]">{metric.label}</div>
                <div>
                  <div className="h1 text-[#262626]">{metric.value}</div>
                  <div className="type-caption mt-2 text-[#777]">{metric.detail}</div>
                </div>
              </div>
          ))}
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {healthItems.map((item) => (
            <button key={item.label} onClick={() => setActive("define")} className="flex items-center justify-between gap-3 rounded-lg border border-[#eeeeee] bg-[#fafafa] px-3 py-3 text-left transition hover:bg-white">
              <span className="type-card-title text-[#333]">{item.label}</span>
              <span className={`type-caption rounded-md px-2 py-1 ${item.tone === "strong" ? "border border-[var(--approved-border)] bg-[var(--approved-bg)] text-[var(--approved-text)]" : "bg-[#f1f1f1] text-[#777]"}`}>
                {item.status}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-lg border border-[#e6e6e6] bg-white p-5 sm:p-6">
          <div className="type-label text-[#999]">Next best move</div>
          <h2 className="type-section-title mt-2 text-[#303030]">Add 3 proof points, then build a founder LinkedIn post.</h2>
          <p className="type-body mt-2 max-w-[620px] text-[#666]">
            This improves trust for sales and landing page assets, while still letting you ship a useful content artifact today.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={() => setActive("define")} className="label h-9 rounded-lg border border-[#dedede] bg-white px-3 text-[#444] transition hover:bg-[#f7f7f7]">
              Add proof
            </button>
            <button onClick={() => setActive("build")} className="label h-9 rounded-lg bg-[var(--brand-accent)] px-3 text-white transition hover:bg-[var(--brand-accent-hover)]">
              Build post
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-[#e6e6e6] bg-white p-5">
          <h2 className="type-section-title text-[#303030]">Missing context</h2>
          <div className="mt-4 space-y-3">
            {missingContext.map((item) => (
              <button key={item} onClick={() => setActive("define")} className="flex w-full items-center gap-3 text-left">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#aaa]" />
                <span className="type-body text-[#555]">{item}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-lg border border-[#e6e6e6] bg-white p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="type-section-title text-[#303030]">Recommendations</h2>
          <button onClick={() => setActive("build")} className="type-body font-medium text-[#555] underline decoration-[#d7d7d7] underline-offset-4 hover:text-[#222]">Open Build</button>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {recommendations.map((item, index) => (
            <button key={item.title} onClick={() => setActive(item.view)} className="rounded-lg border border-[#eeeeee] bg-[#fafafa] p-3 text-left transition hover:bg-white">
              <div className="flex items-center gap-2">
                <span className={`micro flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${index === 0 ? "bg-[var(--brand-accent)] text-white" : "bg-[#f1f1f1] text-[#666]"}`}>
                  {index + 1}
                </span>
                <span className="type-card-title truncate text-[#333]">{item.title}</span>
              </div>
              <p className="type-caption mt-2 text-[#777]">{item.detail}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-lg border border-[#e6e6e6] bg-white p-5">
        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 className="type-section-title text-[#303030]">Recent artifacts</h2>
          <button onClick={() => setActive("build")} className="type-body font-medium text-[#555] underline decoration-[#d7d7d7] underline-offset-4 hover:text-[#222]">Open Build</button>
        </div>
        <div className="divide-y divide-[#eeeeee]">
          {recentArtifacts.map(([title, time]) => (
            <button key={title} onClick={() => setActive("build")} className="grid w-full grid-cols-[minmax(0,1fr)_90px] gap-4 py-3 text-left transition hover:bg-[#fafafa]">
              <span className="type-card-title truncate text-[#333]">{title}</span>
              <span className="type-body text-right text-[#999]">{time}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

const blockOptions = [
  { type: "paragraph", label: "Text", shortcut: "", mark: "T" },
  { type: "h1", label: "Heading 1", shortcut: "#", mark: "H1" },
  { type: "h2", label: "Heading 2", shortcut: "##", mark: "H2" },
  { type: "h3", label: "Heading 3", shortcut: "###", mark: "H3" },
  { type: "h4", label: "Heading 4", shortcut: "####", mark: "H4" },
  { type: "bullet", label: "Bulleted list", shortcut: "-", icon: List },
  { type: "number", label: "Numbered list", shortcut: "1.", icon: ListOrdered },
  { type: "todo", label: "To-do list", shortcut: "[]", icon: ListChecks },
];

function normalizeSourceBlocks(source, fallbackText) {
  if (source.blocks?.length) return source.blocks;
  return fallbackText
    .split(/\n{2,}/)
    .map((text, index) => ({ id: `block-${source.label}-${index}`, type: "paragraph", text: text.trim() }))
    .filter((block) => block.text);
}

function blocksToContent(blocks) {
  return blocks.map((block) => block.text).join("\n\n");
}

function SourcePageEditor({ source, parentTitle, sourceIcon, fallbackText, updateSource }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuBlockId, setMenuBlockId] = useState(null);
  const [filter, setFilter] = useState("");
  const blocks = normalizeSourceBlocks(source, fallbackText);
  const commitBlocks = (nextBlocks) => updateSource({ blocks: nextBlocks, content: blocksToContent(nextBlocks) });
  const updateBlock = (id, patch) => {
    commitBlocks(blocks.map((block) => block.id === id ? { ...block, ...patch } : block));
  };
  const addBlockAfter = (id, type = "paragraph", text = "") => {
    const index = blocks.findIndex((block) => block.id === id);
    const nextBlock = { id: `block-${Date.now()}`, type, text };
    const nextBlocks = [...blocks];
    nextBlocks.splice(index + 1, 0, nextBlock);
    commitBlocks(nextBlocks);
    setMenuBlockId(nextBlock.id);
  };
  const applyBlockType = (type) => {
    const targetId = menuBlockId || blocks[0]?.id;
    if (!targetId) return;
    updateBlock(targetId, { type, text: blocks.find((block) => block.id === targetId)?.text.replace(/^\/\w*/, "").trimStart() || "" });
    setMenuOpen(false);
    setFilter("");
  };
  const filteredOptions = blockOptions.filter((option) => option.label.toLowerCase().includes(filter.toLowerCase()));
  const { Icon, color } = sourceIcon(source.type);

  return (
    <div className="mx-auto max-w-[940px] px-7 py-12 sm:px-12 lg:px-16">
      <div className="mb-8">
        <Icon size={34} strokeWidth={1.7} style={{ color }} />
      </div>
      <input
        value={source.label}
        onChange={(event) => updateSource({ label: event.target.value })}
        className="display w-full border-0 bg-transparent p-0 text-[#2f2f2f] outline-none placeholder:text-[#b5b5b5]"
        placeholder="Untitled"
      />
      <div className="mt-7 grid max-w-[520px] grid-cols-[120px_minmax(0,1fr)] gap-x-4 gap-y-3 border-b border-[#eeeeee] pb-7">
        <div className="caption text-[#999]">Type</div>
        <select
          value={source.type}
          onChange={(event) => updateSource({ type: event.target.value })}
          className="body-sm w-fit rounded-md border border-transparent bg-transparent px-1 text-[#555] outline-none hover:border-[#e5e5e5] hover:bg-[#fafafa]"
        >
          <option>Manual</option>
          <option>Notes</option>
          <option>Doc</option>
          <option>Image</option>
        </select>
        <div className="caption text-[#999]">Used by</div>
        <div className="body-sm text-[#555]">{parentTitle}</div>
        <div className="caption text-[#999]">Status</div>
        <select
          value={source.status || "Draft"}
          onChange={(event) => updateSource({ status: event.target.value })}
          className="body-sm w-fit rounded-md border border-transparent bg-transparent px-1 text-[#555] outline-none hover:border-[#e5e5e5] hover:bg-[#fafafa]"
        >
          <option>Draft</option>
          <option>Ready</option>
          <option>Needs context</option>
        </select>
      </div>

      <div className="relative mt-10 space-y-1">
        {blocks.map((block, index) => {
          const option = blockOptions.find((item) => item.type === block.type) || blockOptions[0];
          const BlockIcon = option.icon;
          const isHeading = block.type.startsWith("h");
          const textClass = block.type === "h1"
            ? "h1"
            : block.type === "h2"
              ? "h2"
              : block.type === "h3"
                ? "h3"
                : block.type === "h4"
                  ? "h4"
                  : "body-lg";
          return (
            <div key={block.id} className="group relative flex items-start gap-3">
              <div className="absolute -left-16 top-1 hidden items-center gap-1 text-[#a5a5a5] group-hover:flex">
                <button
                  onClick={() => { setMenuBlockId(block.id); setMenuOpen(true); }}
                  className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-[#f1f1f1] hover:text-[#555]"
                  title="Add block"
                >
                  <Plus size={18} />
                </button>
                <button className="flex h-7 w-7 cursor-grab items-center justify-center rounded-md hover:bg-[#f1f1f1] hover:text-[#555]" title="Drag to move">
                  <GripVertical size={17} />
                </button>
              </div>
              {block.type === "bullet" && <div className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#383838]" />}
              {block.type === "number" && <div className="body-lg w-7 shrink-0 text-[#555]">{index + 1}.</div>}
              {block.type === "todo" && <input type="checkbox" className="mt-2.5 h-4 w-4 shrink-0 accent-[#383838]" />}
              <textarea
                value={block.text}
                onFocus={() => setMenuBlockId(block.id)}
                onChange={(event) => {
                  const value = event.target.value;
                  updateBlock(block.id, { text: value });
                  if (value.endsWith("/") || value.includes("/")) {
                    setMenuBlockId(block.id);
                    setMenuOpen(true);
                    setFilter(value.split("/").pop());
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    addBlockAfter(block.id);
                  }
                  if (event.key === "Escape") {
                    setMenuOpen(false);
                    setFilter("");
                  }
                }}
                rows={isHeading ? 1 : Math.max(1, Math.ceil((block.text.length || 20) / 80))}
                placeholder={index === 0 ? "Type '/' for commands" : ""}
                className={`${textClass} min-h-[34px] flex-1 resize-none overflow-hidden border-0 bg-transparent p-0 text-[#2f2f2f] outline-none placeholder:text-[#aaa]`}
              />
              {BlockIcon && <span className="sr-only"><BlockIcon size={16} /></span>}
            </div>
          );
        })}

        {menuOpen && (
          <div className="absolute left-[-14px] top-8 z-20 w-[420px] max-w-[calc(100vw-40px)] overflow-hidden rounded-xl border border-[#e5e5e5] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.14)]">
            <div className="px-4 py-3">
              <div className="label text-[#777]">Basic blocks</div>
              <div className="mt-3 max-h-[340px] overflow-y-auto pr-1">
                {filteredOptions.map((option, index) => {
                  const OptionIcon = option.icon;
                  return (
                    <button
                      key={option.type}
                      onClick={() => applyBlockType(option.type)}
                      className={`flex w-full items-center gap-4 rounded-lg px-3 py-2.5 text-left ${index === 0 ? "bg-[#f1f0ef]" : "hover:bg-[#f7f7f7]"}`}
                    >
                      <div className="flex w-8 shrink-0 items-center justify-center text-[#333]">
                        {OptionIcon ? <OptionIcon size={21} strokeWidth={1.8} /> : <span className="h4">{option.mark}</span>}
                      </div>
                      <div className="label flex-1 text-[#333]">{option.label}</div>
                      {option.shortcut && <div className="body-sm text-[#aaa]">{option.shortcut}</div>}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="border-t border-[#eeeeee] px-3 py-3">
              <input
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                autoFocus
                placeholder="Type to filter..."
                className="body w-full rounded-lg bg-[#f4f4f4] px-3 py-2 text-[#555] outline-none placeholder:text-[#999]"
              />
            </div>
            <button onClick={() => setMenuOpen(false)} className="flex w-full items-center justify-between border-t border-[#eeeeee] px-4 py-3 text-left">
              <span className="label text-[#444]">Close menu</span>
              <span className="body-sm text-[#aaa]">esc</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DefineView({ createRequest }) {
  const makeSourcePage = (item, index) => ({
    ...item,
    synopsis: item.description,
    aiSummary: `${item.title} combines the saved synopsis, pasted notes, uploaded files, and manual source fields into one usable context block for Build.`,
    sources: [
      { label: "Synopsis form", type: "Manual" },
      { label: index % 2 === 0 ? "Founder notes" : "Pasted notes", type: "Notes" },
      { label: index % 3 === 0 ? "Reference deck" : "Source doc", type: index % 3 === 0 ? "Slides" : "Doc" },
    ],
  });
  const [sourcePages, setSourcePages] = useState(() => knowledge.map(makeSourcePage));
  const [selectedId, setSelectedId] = useState(knowledge[0].id);
  const [editing, setEditing] = useState(false);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [selectedSourceIndex, setSelectedSourceIndex] = useState(null);
  const selected = sourcePages.find((item) => item.id === selectedId) || sourcePages[0];
  const SelectedIcon = selected.icon;
  const updateSelected = (patch) => {
    setSourcePages((pages) => pages.map((page) => page.id === selected.id ? { ...page, ...patch, updated: "Just now" } : page));
  };
  const addPage = () => {
    const page = {
      id: `custom-${Date.now()}`,
      title: "Untitled source",
      description: "Describe what this source block should teach Build.",
      synopsis: "",
      aiSummary: "Add a synopsis, notes, and source files. The AI summary will combine them into a clean working context.",
      status: "Draft",
      updated: "Just now",
      icon: BookOpen,
      section: "Custom",
      sources: [{ label: "Synopsis form", type: "Manual" }],
    };
    setSourcePages((pages) => [page, ...pages]);
    setSelectedId(page.id);
    setEditing(true);
    setMobileDetailOpen(true);
  };
  useEffect(() => {
    if (createRequest > 0) addPage();
  }, [createRequest]);
  const deletePage = () => {
    if (sourcePages.length === 1) return;
    const remaining = sourcePages.filter((page) => page.id !== selected.id);
    setSourcePages(remaining);
    setSelectedId(remaining[0].id);
    setEditing(false);
    setMobileDetailOpen(false);
  };
  const attachSource = (type) => {
    const label = type === "Image" ? "Image reference" : type === "Doc" ? "Uploaded doc" : type === "Manual" ? "Untitled page" : "Pasted text";
    updateSelected({ sources: [...selected.sources, { label, type }] });
    setSelectedSourceIndex(selected.sources.length);
  };
  const selectedSource = selected.sources[selectedSourceIndex] || null;
  const updateSource = (patch) => {
    if (selectedSourceIndex === null) return;
    updateSelected({
      sources: selected.sources.map((source, index) => index === selectedSourceIndex ? { ...source, ...patch } : source),
    });
  };
  const sourcePreview = (file) => {
    if (file.content) return file.content;
    if (file.type === "Manual") return selected.synopsis || "Add the short manual synopsis for this source block.";
    if (file.type === "Image") return "Visual references and grouped examples that Build can use for design-aware artifacts.";
    if (file.type === "Doc" || file.type === "Slides") return "Uploaded material that will be extracted, summarized, and cited when Build uses this block.";
    return "Pasted working notes, raw observations, call snippets, or founder memory for this source.";
  };
  const sourceIcon = (type) => {
    if (type === "Image") return { Icon: Layers3, color: appColors.sourceBlue };
    if (type === "Note" || type === "Notes") return { Icon: MessageSquareText, color: appColors.sourceGreen };
    if (type === "Manual") return { Icon: BookOpen, color: appColors.sourceRed };
    return { Icon: FileText, color: "#555555" };
  };

  return (
    <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 bg-[#fafafa] lg:grid-cols-[390px_minmax(0,1fr)]">
      <section className={`${mobileDetailOpen ? "hidden lg:block" : "block"} border-r border-[#ececec] bg-[#fafafa] p-4 sm:p-6`}>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="type-page-title text-[#333]">Define Sources</div>
            <div className="type-body mt-1 text-[#777]">Notion-style context pages for Build</div>
          </div>
        </div>

        <div className="mb-5 rounded-lg border border-[#e9e9e9] bg-white p-4">
          <div className="min-w-0">
            <div className="space-y-2">
              <div className="type-card-title text-[#333]">Source coverage</div>
              <div className="type-body text-[#777]">4 of 7 context pages are ready for basic GTM output.</div>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex min-w-0 flex-1 items-center gap-[3px] overflow-hidden">
                {Array.from({ length: 24 }).map((_, index) => (
                  <span
                    key={index}
                    className="h-7 w-1.5 shrink-0 rounded-full bg-[var(--context-warm)]"
                    style={{ opacity: index < 14 ? 1 : 0.18 }}
                  />
                ))}
              </div>
              <div className="shrink-0 text-right">
                <div className="h3 text-[#333]">57%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-[#e9e9e9] bg-white">
          <div className="flex items-center justify-between border-b border-[#eeeeee] px-5 py-4">
            <div className="type-section-title text-[#333]">Source library</div>
            <div className="type-caption text-[#999]">{sourcePages.length} pages</div>
          </div>
          <div>
            {sourcePages.map((item) => {
              const Icon = item.icon;
              const active = selected.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setSelectedId(item.id); setEditing(false); setSelectedSourceIndex(null); setMobileDetailOpen(true); }}
                  className={`flex w-full gap-4 border-b border-[#f0f0f0] px-4 py-4 text-left transition last:border-0 ${active ? 'bg-[#f7f7f7]' : 'bg-white hover:bg-[#fafafa]'}`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f3f3f3] text-[#555]"><Icon size={18} /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <div className="type-card-title truncate text-[#333]">{item.title}</div>
                      <ChevronRight size={16} className="shrink-0 text-[#aaa] lg:hidden" />
                    </div>
                    <div className="type-caption mt-1 text-[#888]">{item.section} · {item.updated}</div>
                    <p className="type-body mt-2 line-clamp-2 text-[#555]">{item.synopsis || item.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`${mobileDetailOpen ? "block" : "hidden lg:block"} overflow-y-auto bg-white px-4 py-5 sm:px-8 lg:px-10 lg:py-8`}>
        <div className="mb-6 flex items-center justify-between gap-3">
          <button onClick={() => setMobileDetailOpen(false)} className="label flex h-9 items-center gap-2 rounded-lg border border-[#e7e7e7] bg-white px-3 text-[#555] hover:bg-[#f8f8f8] lg:hidden">
            <ArrowRight size={15} className="rotate-180" /> Sources
          </button>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setEditing((value) => !value)} className="label h-9 rounded-lg border border-[#e7e7e7] bg-white px-3 text-[#555] hover:bg-[#f8f8f8]">
              {editing ? "Done" : "Edit"}
            </button>
            <button onClick={deletePage} className="label flex h-9 items-center gap-2 rounded-lg border border-[#e7e7e7] bg-white px-3 text-[#b42318] hover:bg-[#fff7f5]"><Trash2 size={15} /> Delete</button>
          </div>
        </div>

        <div>
        <div className="max-w-[760px]">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#f1f1f1] text-[#333]"><SelectedIcon size={22} /></div>
            <div>
              {editing ? (
                <input value={selected.title} onChange={(event) => updateSelected({ title: event.target.value })} className="h3 w-full rounded-lg border border-[#dddddd] px-3 py-2 text-[#333] outline-none focus:border-[#aaa]" />
              ) : (
                <div className="h3 flex items-center gap-2 text-[#333]">{selected.title} <BadgeCheck size={18} className="text-[var(--verified-blue)]" /></div>
              )}
              <div className="type-body mt-1 text-[#8a8a8a]">Section: {selected.section}</div>
            </div>
          </div>

          <div className="rounded-lg border border-[#e9e9e9] bg-[#fafafa] p-4 sm:p-5">
            <div className="mb-4">
              <div className="type-section-title text-[#333]">✦ AI Summary</div>
              <div className="type-body mt-1 text-[#8a8a8a]">The summary Build reads first, generated from every source page below.</div>
            </div>
            {editing ? (
              <textarea value={selected.aiSummary} onChange={(event) => updateSelected({ aiSummary: event.target.value })} rows={5} className="type-body w-full resize-none rounded-lg border border-[#dddddd] bg-white px-3 py-3 text-[#555] outline-none focus:border-[#aaa]" />
            ) : (
              <p className="type-body text-[#555]">{selected.aiSummary}</p>
            )}
          </div>

          <div className="mt-10">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="type-section-title text-[#333]">Source pages</div>
                <div className="type-body text-[#777]">Notion-like pages for synopsis forms, notes, uploaded docs, and visual references.</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => attachSource("Manual")} className="label flex h-8 items-center gap-2 rounded-lg bg-[var(--brand-accent)] px-3 text-white hover:bg-[var(--brand-accent-hover)]">
                  <Plus size={15} /> Create Page
                </button>
                <button onClick={() => attachSource("Doc")} className="label flex h-8 items-center gap-2 rounded-lg border border-[#dedede] px-3 text-[#555] hover:bg-[#f7f7f7]">
                  <FileText size={15} /> Upload Doc
                </button>
                <button onClick={() => attachSource("Image")} className="label flex h-8 items-center gap-2 rounded-lg border border-[#dedede] px-3 text-[#555] hover:bg-[#f7f7f7]">
                  <Layers3 size={15} /> Add Image
                </button>
                <button onClick={() => attachSource("Note")} className="label flex h-8 items-center gap-2 rounded-lg border border-[#dedede] px-3 text-[#555] hover:bg-[#f7f7f7]">
                  <MessageSquareText size={15} /> Paste Text
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {selected.sources.map((file, i) => (
                <button key={`${file.label}-${i}`} onClick={() => setSelectedSourceIndex(i)} className="group flex w-full items-center gap-3 rounded-lg px-1 py-1.5 text-left hover:bg-[#f7f7f7]">
                  {(() => {
                    const { Icon, color } = sourceIcon(file.type);
                    return <Icon size={25} strokeWidth={1.8} className="shrink-0" style={{ color }} />;
                  })()}
                  <span className="h4 inline max-w-full truncate border-b border-[#d9d9d9] text-[#333] group-hover:border-[#999]">{file.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        </div>
        {selectedSource && createPortal(
          <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-[1040px] overflow-y-auto border-l border-[#e5e5e5] bg-white shadow-[-18px_0_44px_rgba(0,0,0,0.10)]">
            <div className="sticky top-0 z-10 flex h-12 items-center justify-between border-b border-[#eeeeee] bg-white px-4">
              <div className="flex items-center gap-2 text-[#777]">
                <button onClick={() => setSelectedSourceIndex(null)} className="rounded-lg p-1.5 hover:bg-[#f5f5f5]" title="Close source page">
                  <ChevronRight size={18} className="rotate-180" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="label rounded-lg px-2 py-1 text-[#555] hover:bg-[#f5f5f5]">Share</button>
                <MoreHorizontal size={18} className="text-[#777]" />
              </div>
            </div>
            <SourcePageEditor
              source={selectedSource}
              parentTitle={selected.title}
              sourceIcon={sourceIcon}
              fallbackText={sourcePreview(selectedSource)}
              updateSource={updateSource}
            />
          </aside>,
          document.body
        )}
      </section>
    </div>
  );
}

function BuildView() {
  const [message, setMessage] = useState("");
  const [generated, setGenerated] = useState(false);

  const output = useMemo(() => ({
    title: "LinkedIn post draft",
    body: generatedBody,
    sources: ["Positioning", "ICP", "Proof Materials"],
  }), []);

  return (
    <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 bg-[#fafafa] lg:grid-cols-[440px_minmax(0,1fr)]">
      <section className="border-r border-[#ececec] bg-[#fafafa] p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="text-[26px] font-medium tracking-[-0.04em] text-[#444]">Build Artifacts</div>
            <div className="mt-1 text-sm text-[#888]">Create GTM output from Define</div>
          </div>
          <button className="rounded-lg bg-[var(--brand-accent)] px-4 py-2 text-sm font-medium text-white shadow-sm"><Send size={15} className="inline" /> Run</button>
        </div>

        <div className="mb-5 rounded-lg border border-[#e9e9e9] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#fff7f2] text-[#e56f4d]"><Bot size={22} /></div>
            <div>
              <div className="font-medium text-[#333]">Artifact Builder</div>
              <div className="text-sm text-[#777]">Grounded in approved sources</div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-[#e9e9e9] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between border-b border-[#eeeeee] px-5 py-4">
            <div className="flex items-center gap-3 text-[20px] text-[#666]"><span className="h-5 w-5 rounded-md border border-[#d9d9d9]" /> Build requests</div>
            <MoreHorizontal size={18} className="text-[#8a8a8a]" />
          </div>
          <div className="p-4">
            <div className="space-y-2">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => { setMessage(prompt); setGenerated(true); }}
                  className="w-full rounded-lg border border-[#ededed] bg-white px-4 py-4 text-left text-sm leading-6 text-[#555] hover:bg-[#fafafa]"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-[#e9e9e9] bg-white p-4">
          <div className="flex items-center gap-2 rounded-lg bg-[#f4f4f4] px-3 py-3">
            <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ask Build to create..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#999]" />
            <button onClick={() => setGenerated(true)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand-accent)] text-white"><Send size={15} /></button>
          </div>
        </div>
      </section>

      <section className="overflow-y-auto bg-white px-10 py-8">
        <div className="mb-8 flex items-center gap-3">
          <button className="rounded-lg border border-[#e7e7e7] bg-white p-2 text-[#777] hover:bg-[#f8f8f8]"><Archive size={18} /></button>
          <button className="rounded-lg border border-[#e7e7e7] bg-white p-2 text-[#777] hover:bg-[#f8f8f8]"><Trash2 size={18} /></button>
          <button className="rounded-lg border border-[#e7e7e7] bg-white p-2 text-[#777] hover:bg-[#f8f8f8]"><Star size={18} /></button>
        </div>

        <div className="max-w-[820px]">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#f1f1f1] text-[#333]"><Bot size={24} /></div>
            <div>
              <div className="flex items-center gap-2 text-[24px] font-semibold tracking-[-0.03em] text-[#333]">Artifact Builder <BadgeCheck size={18} className="text-[var(--verified-blue)]" /></div>
              <div className="text-[17px] text-[#8a8a8a]">From: Define workspace</div>
            </div>
          </div>

          {!generated ? (
            <div>
              <h1 className="mt-8 text-[30px] font-semibold tracking-[-0.04em] text-[#333]">What GTM artifact should we build?</h1>
              <p className="mt-6 text-[18px] leading-8 text-[#555]">Choose an artifact type on the left or type your own request. Build will use approved Define sources and avoid unsupported claims.</p>
              <div className="mt-8 rounded-lg border border-[#e9e9e9] bg-[#fafafa] p-6">
                <div className="font-medium text-[#333]">Available Define sources</div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {knowledge.slice(0, 4).map((item) => (
                    <div key={item.id} className="rounded-lg border border-[#ededed] bg-white p-4">
                      <div className="font-medium text-[#444]">{item.title}</div>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#777]">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="mt-8 text-[30px] font-semibold tracking-[-0.04em] text-[#333]">{output.title}</h1>
              <div className="mt-6 whitespace-pre-line text-[18px] leading-8 text-[#555]">{output.body}</div>
              <div className="mt-10">
                <div className="mb-4 flex items-center gap-3 text-[17px] font-medium text-[#333]">Define sources used <span className="text-sm font-normal text-[#999]">Secure by context.ai</span></div>
                <div className="grid gap-3 md:grid-cols-3">
                  {output.sources.map((source, index) => (
                    <div key={source} className="rounded-lg border border-[#e8e8e8] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-white"
                          style={{ backgroundColor: index === 0 ? appColors.sourceRed : index === 1 ? appColors.sourceBlue : appColors.sourceGreen }}
                        ><FileText size={17} /></div>
                        <div>
                          <div className="text-sm font-medium text-[#444]">{source}</div>
                          <div className="text-xs text-[#888]">Approved source</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <aside
        className={`relative hidden shrink-0 border-l border-[#ececec] bg-[#fbfbfb] transition-[width] duration-300 ease-in-out xl:block ${
          rightRailCollapsed ? "w-12" : "w-[300px]"
        }`}
      >
        <button
          onClick={() => setRightRailCollapsed((collapsed) => !collapsed)}
          className="absolute left-[-14px] top-5 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-[#dedede] bg-white text-[#777] shadow-sm transition hover:text-[#333]"
          title={rightRailCollapsed ? "Expand right rail" : "Collapse right rail"}
        >
          <ChevronRight size={15} className={`transition-transform duration-200 ease-in-out ${rightRailCollapsed ? "rotate-180" : ""}`} />
        </button>
        <div className={`sticky top-6 px-4 py-6 transition-opacity duration-200 ${rightRailCollapsed ? "pointer-events-none opacity-0" : "opacity-100"}`}>
          {selectedSource ? (
            <section className="space-y-5">
              <button
                onClick={() => setSelectedSource(null)}
                className="flex items-center gap-2 text-sm text-[#777] transition hover:text-[#333]"
              >
                <ChevronRight size={15} className="rotate-180" />
                Back to rail
              </button>
              <div>
                <div className="text-xs font-medium text-[#999]">Source inspector</div>
                <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.03em] text-[#2f2f2f]">{selectedSource}</h2>
                <div className="mt-1 text-sm text-[#777]">{sourceDetails[selectedSource]?.type}</div>
              </div>
              <div className="space-y-4 border-t border-[#e8e8e8] pt-4">
                <div>
                  <div className="mb-1 text-xs font-medium text-[#999]">AI summary</div>
                  <p className="text-sm leading-6 text-[#555]">{sourceDetails[selectedSource]?.summary}</p>
                </div>
                <div>
                  <div className="mb-1 text-xs font-medium text-[#999]">Snippet used</div>
                  <p className="rounded-lg bg-white p-3 text-sm leading-6 text-[#555] ring-1 ring-[#ededed]">{sourceDetails[selectedSource]?.snippet}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-[#999]">Updated</div>
                    <div className="mt-1 text-[#555]">{sourceDetails[selectedSource]?.updated}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#999]">Owner</div>
                    <div className="mt-1 text-[#555]">{sourceDetails[selectedSource]?.owner}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2 border-t border-[#e8e8e8] pt-4">
                <button className="flex h-9 w-full items-center justify-center rounded-lg bg-[var(--brand-accent)] text-sm font-medium text-white transition hover:bg-[var(--brand-accent-hover)]">
                  Open source
                </button>
                <button className="flex h-9 w-full items-center justify-center rounded-lg border border-[#dedede] bg-white text-sm text-[#555] transition hover:bg-[#f7f7f7]">
                  Pin to artifact
                </button>
              </div>
            </section>
          ) : (
            <div className="space-y-8">
              <section>
                <div className="mb-3 text-xs font-medium text-[#999]">Artifacts</div>
                <div className="space-y-2">
                  {[
                    ["Post draft", "LinkedIn"],
                    ["Image prompt", "Visual"],
                    ["Landing section", "Website"],
                  ].map(([name, type]) => (
                    <button key={name} className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-white hover:shadow-sm">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#666] ring-1 ring-[#e8e8e8]">
                        <FileText size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-[#444]">{name}</div>
                        <div className="text-xs text-[#999]">{type}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="mb-3 text-xs font-medium text-[#999]">Sources</div>
                <div className="space-y-2">
                  {[
                    ["Define", "Positioning, ICP, Proof"],
                    ["Design System", "Theme references"],
                    ["Web", "Citations enabled"],
                  ].map(([name, meta]) => (
                    <button key={name} className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-white hover:shadow-sm">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#666] ring-1 ring-[#e8e8e8]">
                        {name === "Web" ? <Globe2 size={15} /> : <BookOpen size={15} />}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-[#444]">{name}</div>
                        <div className="truncate text-xs text-[#999]">{meta}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function BuildStudioView() {
  const [message, setMessage] = useState("");
  const [generated, setGenerated] = useState(false);
  const [traceOpen, setTraceOpen] = useState(false);
  const [searchWeb, setSearchWeb] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const [rightRailCollapsed, setRightRailCollapsed] = useState(false);

  const output = useMemo(() => ({
    title: "LinkedIn post draft",
    body: generatedBody,
    sources: ["Positioning", "ICP", "Proof Materials"],
  }), []);

  const sourceDetails = {
    Positioning: {
      type: "Define block",
      summary: "Approved narrative for what DeployIQ is, who it serves, and why the team should win.",
      snippet: "ContextOS gives startup teams one place to define the truth, then uses that approved context to build consistent GTM artifacts.",
      updated: "2h ago",
      owner: "Thoufik",
    },
    ICP: {
      type: "Define block",
      summary: "Buyer and user context for early-stage startup teams, PMs, founders, marketing, and GTM teams.",
      snippet: "The draft keeps the language focused on small teams who are getting started and need usable context before scaling execution.",
      updated: "Yesterday",
      owner: "Team",
    },
    "Proof Materials": {
      type: "Source page",
      summary: "Evidence, examples, screenshots, and customer proof that can safely support artifact claims.",
      snippet: "When proof is missing, Build avoids invented numbers or unsupported customer outcomes.",
      updated: "5 days ago",
      owner: "Growth",
    },
    "Web citations": {
      type: "Web",
      summary: "External citation layer for market checks, company facts, product thinking, and trust signals.",
      snippet: "Web search was enabled for this artifact, so citations can be attached when external facts are used.",
      updated: "Live",
      owner: "Search web",
    },
  };

  const runPrompt = (prompt = message) => {
    setMessage(prompt);
    if (prompt.trim()) {
      setGenerated(true);
      setTraceOpen(false);
      setCopied(false);
    }
  };

  const copyOutput = async () => {
    const text = `${output.title}\n\n${output.body}`;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const traceSteps = [
    {
      icon: BookOpen,
      label: "Read workspace context",
      detail: "Scanned Positioning, ICP, Value Proposition, and Proof Materials from Define.",
      sources: ["Positioning", "ICP", "Proof"],
      type: "Workspace",
    },
    {
      icon: Search,
      label: "Checked web signals",
      detail: "Looked for market language, category cues, and citation candidates before drafting.",
      sources: ["Website", "LinkedIn", "Search results"],
      type: "Web",
    },
    {
      icon: BadgeCheck,
      label: "Filtered unsupported claims",
      detail: "Avoided numbers, customer outcomes, and competitive claims that were not backed by source material.",
      sources: ["Proof rules", "Brand safety"],
      type: "Guardrail",
    },
    {
      icon: Wand2,
      label: "Composed artifact",
      detail: "Merged startup context with the requested format and prepared reusable output.",
      sources: ["Artifact brief"],
      type: "Generation",
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#fafafa]">
      <section className="mx-auto flex w-full max-w-[920px] flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-1 flex-col justify-end pb-4">
          {!generated ? (
            <div className="mx-auto flex w-full max-w-[760px] flex-1 flex-col justify-center py-8">
              <div className="mb-8">
                <h1 className="text-[30px] font-semibold leading-tight tracking-[-0.04em] text-[#292929] sm:text-[36px]">What should we create?</h1>
                <p className="mt-4 max-w-[620px] text-[15px] leading-7 text-[#666]">
                  Ask for copy, sales assets, launch ideas, image prompts, or design-aware artifacts. Build uses your saved context and shows the sources behind the answer.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {prompts.slice(0, 4).map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => runPrompt(prompt)}
                    className="rounded-lg border border-[#e6e6e6] bg-white p-4 text-left text-sm leading-6 text-[#555] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#fcfcfc] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-[760px] space-y-6 py-6">
              <div className="ml-auto max-w-[680px] rounded-2xl bg-[var(--brand-accent)] px-5 py-4 text-sm leading-6 text-white shadow-sm">
                {message}
              </div>
              <div>
                <button
                  onClick={() => setTraceOpen((open) => !open)}
                  className="flex items-center gap-2 text-sm text-[#777] transition hover:text-[#333]"
                >
                  <ChevronRight size={15} className={`transition-transform duration-200 ease-in-out ${traceOpen ? "rotate-90" : ""}`} />
                  <span>Context trace</span>
                  <span className="text-xs text-[#999]">RAG + web</span>
                </button>

                <div className={`grid transition-all duration-300 ease-in-out ${traceOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <div className="relative mt-4 space-y-3 pl-1">
                      <div className="absolute bottom-3 left-[13px] top-3 w-px bg-[#e6e6e6]" />
                      {traceSteps.map((step) => {
                        const Icon = step.icon;
                        return (
                          <div key={step.label} className="relative flex gap-3">
                            <div className="z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fafafa] text-[#777] ring-1 ring-[#e6e6e6]">
                              <Icon size={13} />
                            </div>
                            <div className="min-w-0 flex-1 pb-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-medium text-[#444]">{step.label}</span>
                                <span className="text-[11px] text-[#999]">{step.type}</span>
                              </div>
                              <p className="mt-1 text-sm leading-6 text-[#777]">{step.detail}</p>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {step.sources.map((source) => (
                                  <span key={source} className="text-[11px] text-[#999]">
                                    {source}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <article className="rounded-xl bg-[#eeeeee] p-5 sm:p-6">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <h1 className="text-[26px] font-semibold tracking-[-0.04em] text-[#292929]">{output.title}</h1>
                  <button
                    onClick={copyOutput}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                      copied ? "bg-white text-[#333]" : "text-[#777] hover:bg-white hover:text-[#333]"
                    }`}
                    title={copied ? "Copied" : "Copy response"}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <div className="whitespace-pre-line text-[16px] leading-8 text-[#555]">{output.body}</div>
                <div className="mt-5 flex flex-wrap items-center gap-1.5 text-xs text-[#999]">
                  <span>Sources:</span>
                    {output.sources.map((source) => (
                      <button
                        key={source}
                        onClick={() => setSelectedSource(source)}
                        className="rounded-md px-1.5 py-0.5 text-[#777] underline decoration-[#d8d8d8] underline-offset-2 transition hover:text-[#333]"
                      >
                        {source}
                      </button>
                    ))}
                  <button
                    onClick={() => setSelectedSource("Web citations")}
                    className="rounded-md px-1.5 py-0.5 text-[#8a6414] underline decoration-[#ead8aa] underline-offset-2 transition hover:text-[#66490d]"
                  >
                    Web citations
                  </button>
                </div>
                <div className="mt-5 flex flex-wrap gap-2 border-t border-[#dddddd] pt-4">
                  <button className="flex h-9 items-center gap-2 rounded-lg bg-[var(--brand-accent)] px-3 text-sm font-medium text-white transition hover:bg-[var(--brand-accent-hover)]">
                    <Wand2 size={15} />
                    Generate post
                  </button>
                  <button className="flex h-9 items-center gap-2 rounded-lg border border-[#e7e7e7] bg-white px-3 text-sm text-[#666] transition hover:bg-[#f8f8f8]">
                    <Sparkles size={15} />
                    Turn into image prompt
                  </button>
                </div>
              </article>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 mx-auto w-full max-w-[760px] bg-gradient-to-t from-[#fafafa] via-[#fafafa] to-transparent pt-5">
          <div className="rounded-2xl border border-[#d8d8d8] bg-white p-2 shadow-[0_14px_34px_rgba(0,0,0,0.08)]">
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  runPrompt();
                }
              }}
              placeholder="Ask Build to create a launch post, sales email, image prompt, landing section..."
              rows={1}
              className="max-h-[160px] min-h-[42px] w-full resize-none bg-transparent px-3 py-2 text-sm leading-6 text-[#333] outline-none placeholder:text-[#8f8f8f]"
            />
            <div className="flex items-center justify-between gap-3 border-t border-[#ededed] px-2 pt-2">
              <div className="flex items-center gap-1.5">
                <div className="relative">
                  <button
                    onClick={() => setUploadOpen((open) => !open)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666] transition hover:bg-[#e2e2e2] hover:text-[#222]"
                    title="Attach"
                  >
                    <Plus size={18} />
                  </button>
                  {uploadOpen && (
                    <div className="absolute bottom-10 left-0 z-40 w-[220px] overflow-hidden rounded-xl border border-[#d9d9d9] bg-white py-1 shadow-[0_14px_34px_rgba(0,0,0,0.14)]">
                      <button className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-[#444] transition hover:bg-[#f5f5f5]">
                        <Sparkles size={15} />
                        Upload image
                      </button>
                      <button className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-[#444] transition hover:bg-[#f5f5f5]">
                        <FileText size={15} />
                        Upload PDF or doc
                      </button>
                      <button className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-[#444] transition hover:bg-[#f5f5f5]">
                        <BookOpen size={15} />
                        Add from sources
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSearchWeb((enabled) => !enabled)}
                  className={`flex h-8 items-center gap-2 rounded-lg px-2 text-sm transition ${
                    searchWeb ? "bg-[#f7f7f7] text-[#444] shadow-sm ring-1 ring-[#d8d8d8]" : "text-[#666] hover:bg-[#e2e2e2] hover:text-[#222]"
                  }`}
                  title="Search web"
                >
                  <Globe2 size={15} />
                  Search web
              <span className={`relative h-[18px] w-8 rounded-full transition-colors duration-200 ease-in-out ${searchWeb ? "bg-[var(--brand-accent)]" : "bg-[#c7c7c7]"}`}>
                    <span
                      className="absolute left-0.5 top-0.5 h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out"
                      style={{ transform: searchWeb ? "translateX(14px)" : "translateX(0)" }}
                    />
                  </span>
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#666] transition hover:bg-[#e2e2e2] hover:text-[#222]" title="Voice input">
                  <Mic size={17} />
                </button>
                <button
                  onClick={() => runPrompt()}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-accent)] text-white transition hover:bg-[var(--brand-accent-hover)] disabled:cursor-not-allowed disabled:bg-[#c9c9c9]"
                  disabled={!message.trim()}
                  title="Generate artifact"
                >
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <aside
        className={`relative hidden shrink-0 border-l border-[#ececec] bg-[#fbfbfb] transition-[width] duration-300 ease-in-out xl:block ${
          rightRailCollapsed ? "w-12" : "w-[300px]"
        }`}
      >
        <button
          onClick={() => setRightRailCollapsed((collapsed) => !collapsed)}
          className="absolute left-[-14px] top-5 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-[#dedede] bg-white text-[#777] shadow-sm transition hover:text-[#333]"
          title={rightRailCollapsed ? "Expand right rail" : "Collapse right rail"}
        >
          <ChevronRight size={15} className={`transition-transform duration-200 ease-in-out ${rightRailCollapsed ? "rotate-180" : ""}`} />
        </button>
        <div className={`sticky top-6 px-4 py-6 transition-opacity duration-200 ${rightRailCollapsed ? "pointer-events-none opacity-0" : "opacity-100"}`}>
          {selectedSource ? (
            <section className="space-y-5">
              <button
                onClick={() => setSelectedSource(null)}
                className="flex items-center gap-2 text-sm text-[#777] transition hover:text-[#333]"
              >
                <ChevronRight size={15} className="rotate-180" />
                Back to rail
              </button>
              <div>
                <div className="text-xs font-medium text-[#999]">Source inspector</div>
                <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.03em] text-[#2f2f2f]">{selectedSource}</h2>
                <div className="mt-1 text-sm text-[#777]">{sourceDetails[selectedSource]?.type}</div>
              </div>
              <div className="space-y-4 border-t border-[#e8e8e8] pt-4">
                <div>
                  <div className="mb-1 text-xs font-medium text-[#999]">AI summary</div>
                  <p className="text-sm leading-6 text-[#555]">{sourceDetails[selectedSource]?.summary}</p>
                </div>
                <div>
                  <div className="mb-1 text-xs font-medium text-[#999]">Snippet used</div>
                  <p className="rounded-lg bg-white p-3 text-sm leading-6 text-[#555] ring-1 ring-[#ededed]">{sourceDetails[selectedSource]?.snippet}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-[#999]">Updated</div>
                    <div className="mt-1 text-[#555]">{sourceDetails[selectedSource]?.updated}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#999]">Owner</div>
                    <div className="mt-1 text-[#555]">{sourceDetails[selectedSource]?.owner}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2 border-t border-[#e8e8e8] pt-4">
                <button className="flex h-9 w-full items-center justify-center rounded-lg bg-[var(--brand-accent)] text-sm font-medium text-white transition hover:bg-[var(--brand-accent-hover)]">
                  Open source
                </button>
                <button className="flex h-9 w-full items-center justify-center rounded-lg border border-[#dedede] bg-white text-sm text-[#555] transition hover:bg-[#f7f7f7]">
                  Pin to artifact
                </button>
              </div>
            </section>
          ) : (
            <div className="space-y-8">
              <section>
                <div className="mb-3 text-xs font-medium text-[#999]">Artifacts</div>
                <div className="space-y-2">
                  {[
                    ["Post draft", "LinkedIn"],
                    ["Image prompt", "Visual"],
                    ["Landing section", "Website"],
                  ].map(([name, type]) => (
                    <button key={name} className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-white hover:shadow-sm">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#666] ring-1 ring-[#e8e8e8]">
                        <FileText size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-[#444]">{name}</div>
                        <div className="text-xs text-[#999]">{type}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="mb-3 text-xs font-medium text-[#999]">Sources</div>
                <div className="space-y-2">
                  {[
                    ["Define", "Positioning, ICP, Proof"],
                    ["Design System", "Theme references"],
                    ["Web", "Citations enabled"],
                  ].map(([name, meta]) => (
                    <button key={name} className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-white hover:shadow-sm">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#666] ring-1 ring-[#e8e8e8]">
                        {name === "Web" ? <Globe2 size={15} /> : <BookOpen size={15} />}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-[#444]">{name}</div>
                        <div className="truncate text-xs text-[#999]">{meta}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function WorkspaceTopbar({ active, setActive }) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [desktopHistoryOpen, setDesktopHistoryOpen] = useState(false);
  const profileMenuItems = [
    "Account settings",
    "API keys",
    "Team members",
    "Log out",
  ];
  const pageLabels = {
    dashboard: "Dashboard",
    define: "Define",
    build: "Build",
  };
  const mobileMenuItems = [
    ["dashboard", "Home", Home],
    ["define", "Define sources", BookOpen],
    ["build", "Build artifacts", Bot],
  ];

  return (
    <header className="relative z-30 flex h-[64px] items-center justify-between border-b border-[#ececec] bg-white px-4 sm:px-5">
      <div className="relative flex min-w-0 items-center gap-3 lg:hidden">
        <button
          onClick={() => setWorkspaceMenuOpen((open) => !open)}
          title="Workspace menu"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-accent)] text-white shadow-sm lg:hidden"
        >
          <Sparkles size={18} />
        </button>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-[#2b2b2b]">{companyProfile.name}</div>
          <div className="hidden truncate text-xs text-[#888] sm:block">{companyProfile.description}</div>
        </div>

        {workspaceMenuOpen && (
          <div className="absolute left-0 top-12 z-40 w-[280px] overflow-hidden rounded-xl border border-[#e6e6e6] bg-white py-2 shadow-[0_14px_36px_rgba(0,0,0,0.12)]">
            <div className="border-b border-[#f0f0f0] px-3 pb-2">
              <div className="truncate text-sm font-semibold text-[#333]">{companyProfile.name}</div>
              <div className="truncate text-xs text-[#888]">{companyProfile.description}</div>
            </div>
            <div className="py-1">
              {mobileMenuItems.map(([id, label, Icon]) => (
                <button
                  key={id}
                  onClick={() => {
                    setActive(id);
                    setWorkspaceMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition hover:bg-[#f5f5f5] ${
                    active === id ? "text-[var(--brand-accent)]" : "text-[#555]"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="hidden min-w-0 items-center gap-3 lg:flex">
        <div className="text-sm font-medium text-[#333]">{pageLabels[active]}</div>
        <div className="h-1 w-1 rounded-full bg-[#c8c8c8]" />
        <div className="text-sm text-[#999]">Saved 12s ago</div>
      </div>

      <div className="ml-auto hidden items-center gap-2 lg:flex">
        <div className="flex w-[340px] items-center gap-2 rounded-lg border border-[#e8e8e8] bg-white px-3 py-2 text-sm text-[#9a9a9a] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <Search size={15} />
          Search workspace
          <span className="ml-auto text-xs">Cmd K</span>
        </div>
        <div className="relative">
          <button
            onClick={() => setDesktopHistoryOpen((open) => !open)}
            className="flex h-9 items-center gap-2 rounded-lg px-3 text-sm text-[#666] transition hover:bg-[#f7f7f7] hover:text-[#333]"
          >
            <Clock3 size={15} />
            Version history
            <ChevronRight size={14} className={`transition-transform duration-200 ease-in-out ${desktopHistoryOpen ? "rotate-90" : ""}`} />
          </button>

          {desktopHistoryOpen && (
            <div className="absolute right-0 top-11 z-40 w-[280px] overflow-hidden rounded-xl border border-[#e6e6e6] bg-white py-2 shadow-[0_14px_36px_rgba(0,0,0,0.12)]">
              <div className="border-b border-[#f0f0f0] px-3 pb-2">
                <div className="text-sm font-medium text-[#333]">Version history</div>
                <div className="text-xs text-[#888]">Recent workspace changes</div>
              </div>
              <div className="py-1">
                {[
                  ["Updated Build artifact prompt", "Thoufik", "2 min ago"],
                  ["Added Proof Materials source", "Growth", "28 min ago"],
                  ["Edited Positioning summary", "Thoufik", "1h ago"],
                  ["Connected web citations", "System", "Today"],
                ].map(([title, owner, time]) => (
                  <button key={title} className="flex w-full items-start gap-3 px-3 py-2 text-left transition hover:bg-[#f7f7f7]">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#b8b8b8]" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm text-[#444]">{title}</div>
                      <div className="mt-0.5 text-xs text-[#999]">{owner} · {time}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative flex items-center gap-2 text-sm text-[#777] lg:hidden">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e8e8e8] bg-white text-[#777] shadow-sm transition hover:bg-[#f7f7f7] hover:text-[var(--brand-accent)] lg:hidden"
          title="Search"
        >
          <Search size={17} />
        </button>
        <div className="relative lg:hidden">
          <button
            onClick={() => setHistoryOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e8e8e8] bg-white text-[#777] shadow-sm transition hover:bg-[#f7f7f7] hover:text-[var(--brand-accent)]"
            title="Version history"
          >
            <Clock3 size={16} />
          </button>
          {historyOpen && (
            <div className="absolute right-0 top-11 z-40 w-[280px] overflow-hidden rounded-xl border border-[#e6e6e6] bg-white py-2 shadow-[0_14px_36px_rgba(0,0,0,0.12)]">
              <div className="border-b border-[#f0f0f0] px-3 pb-2">
                <div className="text-sm font-medium text-[#333]">Version history</div>
                <div className="text-xs text-[#888]">Recent workspace changes</div>
              </div>
              <div className="py-1">
                {[
                  ["Updated Build artifact prompt", "Thoufik", "2 min ago"],
                  ["Added Proof Materials source", "Growth", "28 min ago"],
                  ["Edited Positioning summary", "Thoufik", "1h ago"],
                  ["Connected web citations", "System", "Today"],
                ].map(([title, owner, time]) => (
                  <button key={title} className="flex w-full items-start gap-3 px-3 py-2 text-left transition hover:bg-[#f7f7f7]">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#b8b8b8]" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm text-[#444]">{title}</div>
                      <div className="mt-0.5 text-xs text-[#999]">{owner} · {time}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => setProfileMenuOpen((open) => !open)}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand-accent)] text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-accent-hover)]"
          title="Profile options"
        >
          TH
        </button>

        {profileMenuOpen && (
          <div className="absolute right-0 top-11 z-40 w-[240px] overflow-hidden rounded-lg border border-[#e6e6e6] bg-white py-1 shadow-[0_12px_34px_rgba(0,0,0,0.10)]">
            <div className="py-1">
              {profileMenuItems.map((item) => (
                <button
                  key={item}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-[#f5f5f5] ${
                    item === "Log out" ? "text-[#b42318]" : "text-[#444]"
                  }`}
                >
                  {item}
                  {item !== "Log out" && <ChevronRight size={14} className="text-[#aaa]" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function MobileBottomNav({ active, setActive }) {
  const items = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "define", label: "Define", icon: BookOpen },
    { id: "build", label: "Build", icon: Bot },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-3 z-40 flex justify-center px-3 lg:hidden">
      <div className="grid w-full max-w-[460px] grid-cols-3 gap-1 rounded-2xl border border-[#e5e5e5] bg-white/94 p-1 shadow-[0_14px_38px_rgba(0,0,0,0.14)] backdrop-blur">
        {items.map((item) => {
          const Icon = item.icon;
          const selected = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`flex h-11 min-w-0 items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-medium transition-all duration-200 min-[390px]:gap-1.5 min-[390px]:px-2 min-[390px]:text-[12px] ${
                selected ? "bg-[var(--brand-accent)] text-white shadow-sm" : "text-[#707070] hover:bg-[#f6f6f6] hover:text-[var(--brand-accent)]"
              }`}
            >
              <Icon size={16} strokeWidth={1.9} className="shrink-0 transition-transform duration-[250ms] ease-in-out min-[390px]:h-[17px] min-[390px]:w-[17px]" />
              <span className="min-w-0 whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [transitionDirection, setTransitionDirection] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [createSourceRequest, setCreateSourceRequest] = useState(0);
  const viewOrder = ["dashboard", "define", "build"];
  const brandTheme = {
    "--brand-accent": companyProfile.brandAccent,
    "--brand-accent-hover": companyProfile.brandAccentHover,
    "--brand-accent-soft": companyProfile.brandAccentSoft,
    "--brand-accent-ring": companyProfile.brandAccentRing,
    "--approved-bg": appColors.approvedBg,
    "--approved-text": appColors.approvedText,
    "--approved-border": appColors.approvedBorder,
    "--verified-blue": appColors.verified,
    "--context-warm": appColors.contextWarm,
    "--success-green": appColors.successGreen,
  };

  const navigateTo = (nextActive) => {
    const currentIndex = viewOrder.indexOf(active);
    const nextIndex = viewOrder.indexOf(nextActive);
    const nextDirection = Math.sign(nextIndex - currentIndex);

    if (nextDirection !== 0) {
      setTransitionDirection(nextDirection);
    }

    setActive(nextActive);
  };

  return (
    <div className="min-h-screen bg-white text-[#292929]" style={brandTheme}>
      <div className="flex h-screen min-h-screen w-full overflow-hidden bg-white">
        <LeftSidebar
          active={active}
          setActive={navigateTo}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          sidebarWidth={sidebarWidth}
          setSidebarWidth={setSidebarWidth}
          onCreateSource={() => {
            navigateTo("define");
            setCreateSourceRequest((request) => request + 1);
          }}
        />
        <main className="flex min-w-0 flex-1 flex-col bg-white">
          <WorkspaceTopbar active={active} setActive={navigateTo} />
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-24 lg:pb-0">
            <div
              key={active}
              className="min-h-full animate-[contentSlide_240ms_ease-in-out] will-change-transform"
              style={{ "--content-enter-x": `${transitionDirection * 18}px` }}
            >
              {active === "dashboard" && <DashboardV2 setActive={navigateTo} />}
              {active === "define" && <DefineView createRequest={createSourceRequest} />}
              {active === "build" && <BuildStudioView />}
            </div>
          </div>
        </main>
        <MobileBottomNav active={active} setActive={navigateTo} />
      </div>
    </div>
  );
}
