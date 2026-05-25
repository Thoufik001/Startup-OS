import React, { useEffect, useMemo, useRef, useState } from "react";
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
  Home,
  Inbox,
  Layers3,
  List,
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
  name: "Brand",
  description: "Startup workspace",
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

const currentUser = {
  name: "Thoufik",
  role: "Product Designer",
};

const makeSourcePage = (item, index) => ({
  ...item,
  synopsis: item.description,
  aiSummary: `${item.title} combines the saved synopsis, pasted notes, uploaded files, and manual source fields into one usable context block for Build.`,
  sources: [
    { id: `${item.id}-synopsis`, label: "Synopsis form", type: "Manual", versions: [] },
    { id: `${item.id}-notes`, label: index % 2 === 0 ? "Founder notes" : "Pasted notes", type: "Notes", versions: [] },
    { id: `${item.id}-deck`, label: index % 3 === 0 ? "Reference deck" : "Source doc", type: index % 3 === 0 ? "Slides" : "Doc", versions: [] },
  ],
});

const initialSourcePages = knowledge.map(makeSourcePage);

function cloneSourceForVersion(source) {
  const { versions, ...snapshot } = source;
  return {
    ...snapshot,
    blocks: source.blocks?.map((block) => ({ ...block })),
    images: source.images?.map((image) => ({ ...image })),
  };
}

function sourceComparable(source) {
  const snapshot = cloneSourceForVersion(source);
  return JSON.stringify(snapshot);
}

function summarizeSourceDiff(previous, next) {
  const changes = [];
  if (previous.label !== next.label) changes.push("renamed page");
  if (previous.type !== next.type) changes.push(`changed type to ${next.type}`);
  if ((previous.status || "Draft") !== (next.status || "Draft")) changes.push(`changed status to ${next.status || "Draft"}`);
  if ((previous.content || "") !== (next.content || "") || (previous.contentHtml || "") !== (next.contentHtml || "")) changes.push("edited page content");
  if (JSON.stringify(previous.blocks || []) !== JSON.stringify(next.blocks || [])) changes.push("updated document blocks");
  if (JSON.stringify(previous.images || []) !== JSON.stringify(next.images || [])) changes.push("updated image references");
  return changes.length ? changes.join(", ") : "saved page state";
}

function formatVersionTime(timestamp) {
  if (!timestamp) return "Unknown time";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  return date.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function getContextChangelog(sourcePages) {
  return sourcePages
    .flatMap((page) => (page.sources || []).flatMap((source) => (source.versions || []).map((version) => ({
      ...version,
      sourceName: `${page.title} / ${version.sourceName || source.label}`,
      section: page.section,
    }))))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);
}

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
          className="group absolute -right-1 top-0 z-20 h-full w-2 cursor-col-resize"
        >
          <div className="mx-auto h-full w-px bg-transparent transition group-hover:bg-[#d0d0d0]" />
        </div>
      )}

      <div className="flex h-full shrink-0 flex-col" style={{ width: sidebarWidth }}>
        <div className="flex h-16 items-center gap-3 border-b border-[#f0f0f0] px-5 py-4">
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
                className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors duration-200 ease-in-out ${
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
                  <span className="micro inline-flex items-center gap-1 text-white/72">
                    <Command size={12} strokeWidth={2} />
                    N
                  </span>
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
            <div className="absolute bottom-20 left-5 right-5 z-30 overflow-hidden rounded-lg border border-[#e6e6e6] bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
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
    <header className="flex h-16 items-center justify-between border-b border-[#ececec] bg-white px-5">
      <div className="flex items-center gap-2 text-sm text-[#777]">
        <button className="rounded-lg bg-[#f4f4f4] px-3 py-2 text-[#333]">Context Health</button>
        <button className="rounded-lg px-3 py-2 hover:bg-[#f7f7f7]">Sources</button>
        <button className="rounded-lg px-3 py-2 hover:bg-[#f7f7f7]">Artifacts</button>
        <button className="rounded-lg px-3 py-2 hover:bg-[#f7f7f7]">GTM Library</button>
      </div>
      <div className="hidden w-[320px] items-center gap-2 rounded-lg border border-[#e8e8e8] bg-white px-3 py-2 text-sm text-[#9a9a9a] shadow-[0_1px_2px_rgba(0,0,0,0.03)] md:flex">
        <Search size={15} />
        Search
        <span className="ml-auto text-xs">⌘K</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-[#777]">
        <button className="rounded-lg px-2 py-2 hover:bg-[#f7f7f7]">Profile</button>
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#b9a7ff] to-[#f5f2ff] ring-1 ring-[#ececec]" />
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
        <div className="mt-8 flex max-w-[620px] items-center rounded-lg bg-[#f4f4f4] px-4 py-3 font-mono text-sm text-[#555]">
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
          <div className="mt-8 flex gap-3">
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

function DashboardV2({ setActive, sourcePages = initialSourcePages }) {
  const healthItems = [
    { label: "Positioning", status: "Ready", tone: "strong" },
    { label: "ICP", status: "Ready", tone: "strong" },
    { label: "Proof", status: "Needs evidence", tone: "weak" },
    { label: "Competitors", status: "Draft", tone: "draft" },
  ];
  const keyMetrics = [
    { label: "Source coverage", value: "4/7", detail: "Core context blocks filled" },
    { label: "Traceability", value: "62%", detail: "RAG + web citations" },
  ];
  const recentBuilds = [
    { title: "Founder LinkedIn post", detail: "From Positioning + ICP", time: "12 min ago", type: "Social" },
    { title: "Landing page hero", detail: "From Positioning + Value Prop", time: "1h ago", type: "Website" },
    { title: "Cold email sequence", detail: "From ICP + Proof", time: "3h ago", type: "Email" },
    { title: "Competitor battlecard", detail: "From Competitors + Proof", time: "Yesterday", type: "Sales" },
    { title: "Image prompt", detail: "From Design System + Proof", time: "Yesterday", type: "Visual" },
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
  const [changelogIndex, setChangelogIndex] = useState(0);
  const [buildIndex, setBuildIndex] = useState(0);
  const contextChangelog = getContextChangelog(sourcePages);
  const recentChangelog = contextChangelog.slice(0, 5);
  const recentBuildList = recentBuilds.slice(0, 5);
  const activeChangelogIndex = Math.min(changelogIndex, Math.max(recentChangelog.length - 1, 0));
  const activeBuildIndex = Math.min(buildIndex, Math.max(recentBuildList.length - 1, 0));

  return (
    <div className="mx-auto min-h-full max-w-[1120px] px-4 pb-24 pt-8 sm:px-6 lg:pt-12">
      <section>
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
              <div key={metric.label} className="flex min-h-32 flex-col justify-between rounded-lg bg-[#f7f7f7] p-4">
                <div className="type-label text-[#999]">{metric.label}</div>
                <div>
                  <div className="display text-[#262626]">{metric.value}</div>
                  <div className="type-caption mt-2 text-[#777]">{metric.detail}</div>
                </div>
              </div>
          ))}
        </div>

        <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
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

      <section className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
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

      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-[#e6e6e6] bg-white p-5">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="type-section-title text-[#303030]">Context changelog</h2>
              <p className="type-caption mt-1 text-[#888]">Recent 5 saved source edits.</p>
            </div>
            {recentChangelog.length ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setChangelogIndex((index) => Math.max(index - 1, 0))}
                  disabled={activeChangelogIndex === 0}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-[#e6e6e6] text-[#666] disabled:opacity-35"
                >
                  <ChevronRight size={15} className="rotate-180" />
                </button>
                <span className="type-caption min-w-12 text-center text-[#888]">{activeChangelogIndex + 1} of {recentChangelog.length}</span>
                <button
                  onClick={() => setChangelogIndex((index) => Math.min(index + 1, recentChangelog.length - 1))}
                  disabled={activeChangelogIndex >= recentChangelog.length - 1}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-[#e6e6e6] text-[#666] disabled:opacity-35"
                >
                  <ChevronRight size={15} />
                </button>
                <Clock3 size={17} className="text-[#999]" />
              </div>
            ) : (
              <Clock3 size={17} className="text-[#999]" />
            )}
          </div>

          {recentChangelog.length ? (
            <div className="divide-y divide-[#eeeeee]">
              {recentChangelog.map((entry, index) => (
                <button
                  key={entry.id}
                  onClick={() => { setChangelogIndex(index); setActive("define"); }}
                  className={`grid w-full grid-cols-[minmax(0,1fr)_112px] gap-4 py-3 text-left transition hover:bg-[#fafafa] ${activeChangelogIndex === index ? "text-[#2b2b2b]" : ""}`}
                >
                  <span className="min-w-0">
                    <span className="type-card-title block truncate text-[#333]">{entry.sourceName}</span>
                    <span className="type-caption mt-1 block truncate text-[#777]">{entry.summary} · by {entry.editor}</span>
                  </span>
                  <span className="type-caption text-right text-[#999]">{formatVersionTime(entry.timestamp)}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex min-h-24 items-center rounded-lg bg-[#fafafa] p-4">
              <p className="type-body text-[#666]">No saved source edits yet.</p>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-[#e6e6e6] bg-white p-5">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="type-section-title text-[#303030]">Recent Build</h2>
              <p className="type-caption mt-1 text-[#888]">Recent 5 generated outputs.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBuildIndex((index) => Math.max(index - 1, 0))}
                disabled={activeBuildIndex === 0}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-[#e6e6e6] text-[#666] disabled:opacity-35"
              >
                <ChevronRight size={15} className="rotate-180" />
              </button>
              <span className="type-caption min-w-12 text-center text-[#888]">{activeBuildIndex + 1} of {recentBuildList.length}</span>
              <button
                onClick={() => setBuildIndex((index) => Math.min(index + 1, recentBuildList.length - 1))}
                disabled={activeBuildIndex >= recentBuildList.length - 1}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-[#e6e6e6] text-[#666] disabled:opacity-35"
              >
                <ChevronRight size={15} />
              </button>
              <button onClick={() => setActive("build")} className="type-caption font-medium text-[#555] underline decoration-[#d7d7d7] underline-offset-4 hover:text-[#222]">Open</button>
            </div>
          </div>

          {recentBuildList.length ? (
            <div className="divide-y divide-[#eeeeee]">
              {recentBuildList.map((entry, index) => (
                <button
                  key={entry.title}
                  onClick={() => { setBuildIndex(index); setActive("build"); }}
                  className={`grid w-full grid-cols-[minmax(0,1fr)_88px] gap-4 py-3 text-left transition hover:bg-[#fafafa] ${activeBuildIndex === index ? "text-[#2b2b2b]" : ""}`}
                >
                  <span className="min-w-0">
                    <span className="type-card-title block truncate text-[#333]">{entry.title}</span>
                    <span className="type-caption mt-1 block truncate text-[#777]">{entry.detail}</span>
                  </span>
                  <span className="type-caption text-right text-[#999]">{entry.time}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex min-h-24 items-center rounded-lg bg-[#fafafa] p-4">
              <p className="type-body text-[#666]">No generated outputs yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

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

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function contentToHtml(content) {
  const paragraphs = content
    .split(/\n{2,}/)
    .map((text) => text.trim())
    .filter(Boolean);

  return paragraphs.length
    ? paragraphs.map((text) => `<p>${escapeHtml(text).replaceAll("\n", "<br>")}</p>`).join("")
    : "<p><br></p>";
}

function htmlToPlainText(html) {
  if (!html) return "";
  const element = document.createElement("div");
  element.innerHTML = html;
  return element.innerText.trim();
}

function sourceToPlainText(source, parentTitle) {
  const lines = [
    source.label || source.fileName || "Source page",
    parentTitle ? `Source block: ${parentTitle}` : "",
    source.type ? `Type: ${source.type}` : "",
    "",
  ].filter(Boolean);
  const body = source.textContent || source.content || htmlToPlainText(source.contentHtml) || "";
  const images = source.images?.length
    ? source.images.map((image, index) => `${index + 1}. ${image.fileName} (${formatFileSize(image.fileSize)})`)
    : [];

  if (body) lines.push(body);
  if (images.length) lines.push("", "Images", ...images);
  if (!body && !images.length && source.fileName) lines.push(`${source.fileName} (${formatFileSize(source.fileSize)})`);

  return lines.join("\n");
}

function sourceToExportHtml(source, parentTitle) {
  const safeTitle = escapeHtml(source.label || source.fileName || "Source page");
  const metadata = [parentTitle, source.type, source.uploadedAt ? `Uploaded ${source.uploadedAt}` : ""].filter(Boolean);
  const bodyHtml = source.contentHtml || (source.textContent ? `<pre>${escapeHtml(source.textContent)}</pre>` : contentToHtml(source.content || ""));
  const images = source.images?.length
    ? source.images
    : source.type === "Image" && source.fileDataUrl
      ? [{ fileName: source.fileName || source.label, fileDataUrl: source.fileDataUrl, fileSize: source.fileSize }]
      : [];

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${safeTitle}</title>
  <style>
    body { font-family: "Geist", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #2b2b2b; margin: 48px; }
    h1 { font-size: 32px; line-height: 40px; letter-spacing: -0.04em; margin: 0 0 12px; }
    .meta { color: #777; font-size: 13px; line-height: 20px; margin-bottom: 32px; }
    .content { font-size: 16px; line-height: 28px; }
    .content h1 { font-size: 28px; line-height: 36px; }
    .content h2 { font-size: 24px; line-height: 32px; }
    .content h3 { font-size: 20px; line-height: 28px; }
    .content img { max-width: 100%; border-radius: 8px; }
    figure { break-inside: avoid; margin: 0 0 24px; }
    figcaption { color: #777; font-size: 12px; margin-top: 8px; }
    pre { white-space: pre-wrap; font: inherit; }
  </style>
</head>
<body>
  <h1>${safeTitle}</h1>
  <div class="meta">${metadata.map(escapeHtml).join(" · ")}</div>
  <main class="content">
    ${images.length ? images.map((image) => `<figure><img src="${image.fileDataUrl}" alt="${escapeHtml(image.fileName || "Image reference")}" /><figcaption>${escapeHtml(image.fileName || "Image reference")} · ${formatFileSize(image.fileSize)}</figcaption></figure>`).join("") : bodyHtml}
  </main>
  <script>window.addEventListener("load", () => setTimeout(() => window.print(), 250));</script>
</body>
</html>`;
}

function SourcePageEditor({ source, sourceIcon, fallbackText, saveSource }) {
  const getInitialContent = (page) => page.content || blocksToContent(normalizeSourceBlocks(page, fallbackText));
  const getInitialHtml = (page) => page.contentHtml || contentToHtml(getInitialContent(page));
  const editorRef = useRef(null);
  const [draftSource, setDraftSource] = useState(() => ({
    ...source,
    content: getInitialContent(source),
    contentHtml: getInitialHtml(source),
  }));
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const contentHtml = getInitialHtml(source);
    setDraftSource({
      ...source,
      content: getInitialContent(source),
      contentHtml,
    });
    if (editorRef.current) editorRef.current.innerHTML = contentHtml;
    setDirty(false);
  }, [source]);

  useEffect(() => {
    if (!dirty || sourceComparable(source) === sourceComparable(draftSource)) return undefined;
    const timer = window.setTimeout(() => saveSource(draftSource), 900);
    return () => window.clearTimeout(timer);
  }, [dirty, draftSource, saveSource, source]);

  const updateDraft = (patch) => {
    setDirty(true);
    setDraftSource((current) => ({ ...current, ...patch }));
  };

  const syncEditorContent = () => {
    const editor = editorRef.current;
    if (!editor) return;
    const content = editor.innerText.trim();
    updateDraft({
      content,
      contentHtml: editor.innerHTML,
      blocks: content
        .split(/\n{2,}/)
        .map((text, index) => ({ id: `block-${draftSource.id || draftSource.label}-${index}`, type: "paragraph", text: text.trim() }))
        .filter((block) => block.text),
    });
  };
  const focusEditorEnd = () => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  };
  const applyFormat = (command, value = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    syncEditorContent();
  };
  const { Icon, color } = sourceIcon(draftSource.type);
  const toolbarButtonClass = "label flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-[#555] transition hover:bg-[#eeeeee] hover:text-[#2f2f2f]";

  return (
    <div className="mx-auto max-w-[860px] px-4 pb-24 pt-16 sm:px-6 lg:px-10">
      <div className="mb-6">
        <Icon size={36} strokeWidth={1.7} style={{ color }} />
      </div>
      <input
        value={draftSource.label}
        onChange={(event) => updateDraft({ label: event.target.value })}
        className="display w-full border-0 bg-transparent p-0 text-[#2f2f2f] outline-none placeholder:text-[#b5b5b5]"
        placeholder="Untitled"
      />
      <div className="sticky top-12 z-10 mt-8 flex flex-wrap items-center gap-1 border-y border-[#eeeeee] bg-white/95 py-2 backdrop-blur">
        <button type="button" onClick={() => applyFormat("bold")} className={toolbarButtonClass} title="Bold">
          B
        </button>
        <button type="button" onClick={() => applyFormat("italic")} className={`${toolbarButtonClass} italic`} title="Italic">
          I
        </button>
        <span className="mx-1 h-5 w-px bg-[#e5e5e5]" />
        <button type="button" onClick={() => applyFormat("formatBlock", "H1")} className={toolbarButtonClass} title="Heading 1">
          H1
        </button>
        <button type="button" onClick={() => applyFormat("formatBlock", "H2")} className={toolbarButtonClass} title="Heading 2">
          H2
        </button>
        <button type="button" onClick={() => applyFormat("formatBlock", "H3")} className={toolbarButtonClass} title="Heading 3">
          H3
        </button>
        <button type="button" onClick={() => applyFormat("formatBlock", "P")} className={toolbarButtonClass} title="Paragraph">
          T
        </button>
        <span className="mx-1 h-5 w-px bg-[#e5e5e5]" />
        <button type="button" onClick={() => applyFormat("insertUnorderedList")} className={toolbarButtonClass} title="Bullet list">
          <List size={16} />
        </button>
        <button type="button" onClick={() => applyFormat("insertOrderedList")} className={toolbarButtonClass} title="Numbered list">
          <ListOrdered size={16} />
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Start writing..."
        onInput={syncEditorContent}
        onBlur={syncEditorContent}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const editor = editorRef.current;
          const lastBlock = editor?.lastElementChild;
          if (editor && lastBlock?.textContent?.trim()) {
            editor.insertAdjacentHTML("beforeend", "<p><br></p>");
            syncEditorContent();
          }
          focusEditorEnd();
        }}
        className="source-rich-editor body-lg min-h-[520px] w-full border-0 bg-transparent py-8 text-[#2f2f2f] outline-none"
      />
    </div>
  );
}

function formatFileSize(bytes) {
  if (!bytes) return "Unknown size";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function fileToSource(file, type) {
  const attachment = await fileToAttachment(file);

  return {
    id: `source-${Date.now()}-${file.name}`,
    label: file.name,
    type,
    fileName: attachment.fileName,
    fileType: attachment.fileType,
    fileSize: attachment.fileSize,
    fileDataUrl: attachment.fileDataUrl,
    textContent: attachment.textContent,
    images: type === "Image" ? [attachment] : undefined,
    uploadedAt: "Just now",
    versions: [],
  };
}

async function fileToAttachment(file) {
  const dataUrl = await readFileAsDataUrl(file);
  const isText = file.type.startsWith("text/") || /\.(md|txt|csv)$/i.test(file.name);
  const textContent = isText ? await file.text() : "";

  return {
    id: `file-${Date.now()}-${file.name}`,
    fileName: file.name,
    fileType: file.type || "Unknown type",
    fileSize: file.size,
    fileDataUrl: dataUrl,
    textContent,
  };
}

async function filesToImageSource(files) {
  const images = await Promise.all(files.map(fileToAttachment));
  const totalSize = images.reduce((sum, image) => sum + (image.fileSize || 0), 0);
  const firstImage = images[0];

  return {
    id: `source-images-${Date.now()}`,
    label: images.length === 1 ? firstImage.fileName : `Image references (${images.length})`,
    type: "Image",
    fileName: images.length === 1 ? firstImage.fileName : "Image references",
    fileType: images.length === 1 ? firstImage.fileType : "Image collection",
    fileSize: totalSize,
    fileDataUrl: firstImage.fileDataUrl,
    images,
    uploadedAt: "Just now",
    versions: [],
  };
}

function SourceFilePreview({ source, sourceIcon }) {
  const { Icon, color } = sourceIcon(source.type);
  const images = source.images?.length
    ? source.images
    : source.type === "Image" && source.fileDataUrl
      ? [{
          fileName: source.fileName || source.label,
          fileType: source.fileType,
          fileSize: source.fileSize,
          fileDataUrl: source.fileDataUrl,
        }]
      : [];
  const isImage = source.type === "Image" && images.length > 0;
  const isPdf = source.fileType === "application/pdf" && source.fileDataUrl;
  const hasTextPreview = Boolean(source.textContent);

  return (
    <div className="mx-auto max-w-[920px] px-4 pb-24 pt-16 sm:px-6 lg:px-10">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-[#f4f4f4]">
        <Icon size={26} strokeWidth={1.7} style={{ color }} />
      </div>
      <h1 className="display break-words text-[#2f2f2f]">{source.fileName || source.label}</h1>
      <div className="mt-4 flex flex-wrap gap-3 text-[#777]">
        {isImage && images.length > 1 ? <span className="caption">{images.length} images</span> : null}
        <span className="caption">{source.fileType || source.type}</span>
        <span className="caption">{formatFileSize(source.fileSize)}</span>
        <span className="caption">Uploaded {source.uploadedAt || "Just now"}</span>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-[#e7e7e7] bg-[#f7f7f7]">
        {isImage && images.length > 1 ? (
          <div className="grid gap-4 bg-[#f7f7f7] p-4 sm:grid-cols-2">
            {images.map((image) => (
              <figure key={image.id || image.fileName} className="overflow-hidden rounded-lg border border-[#e1e1e1] bg-white">
                <div className="flex aspect-[4/3] items-center justify-center bg-[#f4f4f4] p-3">
                  <img src={image.fileDataUrl} alt={image.fileName} className="max-h-full max-w-full rounded-md object-contain" />
                </div>
                <figcaption className="flex items-center justify-between gap-3 border-t border-[#eeeeee] px-3 py-2">
                  <span className="body-sm min-w-0 truncate text-[#333]">{image.fileName}</span>
                  <span className="micro shrink-0 text-[#888]">{formatFileSize(image.fileSize)}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : isImage ? (
          <div className="flex min-h-[520px] items-center justify-center bg-[#f7f7f7] p-4">
            <img src={images[0].fileDataUrl} alt={images[0].fileName || source.label} className="max-h-[680px] max-w-full rounded-md object-contain" />
          </div>
        ) : isPdf ? (
          <iframe title={source.fileName || source.label} src={source.fileDataUrl} className="h-[720px] w-full bg-white" />
        ) : hasTextPreview ? (
          <pre className="body-lg min-h-[520px] whitespace-pre-wrap bg-white p-6 text-[#333]">{source.textContent}</pre>
        ) : (
          <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
            <FileText size={38} strokeWidth={1.5} className="text-[#777]" />
            <h2 className="h4 mt-4 text-[#333]">Preview not available</h2>
            <p className="body mt-2 max-w-[460px] text-[#777]">
              This file is attached to the source library. A later backend pass can extract and summarize it for Build.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function DefineView({ createRequest, sourcePages, setSourcePages }) {
  const [selectedId, setSelectedId] = useState(knowledge[0].id);
  const [editing, setEditing] = useState(false);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [selectedSourceIndex, setSelectedSourceIndex] = useState(null);
  const [sourceCopied, setSourceCopied] = useState(false);
  const docInputRef = useRef(null);
  const imageInputRef = useRef(null);
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
    const label = type === "Manual" ? "Untitled page" : "Attached source";
    updateSelected({ sources: [...selected.sources, { id: `source-${Date.now()}`, label, type, versions: [] }] });
    setSelectedSourceIndex(selected.sources.length);
  };
  const handleUploadedFiles = async (event, type) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const uploadedSources = type === "Image"
      ? [await filesToImageSource(files)]
      : await Promise.all(files.map((file) => fileToSource(file, type)));
    updateSelected({ sources: [...selected.sources, ...uploadedSources] });
    setSelectedSourceIndex(selected.sources.length);
    event.target.value = "";
  };
  const selectedSource = selected.sources[selectedSourceIndex] || null;
  const updateSource = (patch) => {
    if (selectedSourceIndex === null) return;
    updateSelected({
      sources: selected.sources.map((source, index) => index === selectedSourceIndex ? { ...source, ...patch } : source),
    });
  };
  const deleteSelectedSource = () => {
    if (selectedSourceIndex === null) return;
    updateSelected({
      sources: selected.sources.filter((_, index) => index !== selectedSourceIndex),
    });
    setSelectedSourceIndex(null);
  };
  const copySelectedSource = async () => {
    if (!selectedSource) return;
    const text = sourceToPlainText(selectedSource, selected.title);
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    setSourceCopied(true);
    window.setTimeout(() => setSourceCopied(false), 1400);
  };
  const exportSelectedSourcePdf = () => {
    if (!selectedSource) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.open();
    printWindow.document.write(sourceToExportHtml(selectedSource, selected.title));
    printWindow.document.close();
  };
  const saveSource = (nextSource) => {
    if (selectedSourceIndex === null) return;
    const previousSource = selected.sources[selectedSourceIndex];
    if (!previousSource || sourceComparable(previousSource) === sourceComparable(nextSource)) return;
    const version = {
      id: `version-${Date.now()}`,
      timestamp: new Date().toISOString(),
      editor: currentUser.name,
      sourceName: previousSource.label,
      summary: summarizeSourceDiff(previousSource, nextSource),
      snapshot: cloneSourceForVersion(previousSource),
    };
    updateSelected({
      sources: selected.sources.map((source, index) => index === selectedSourceIndex ? {
        ...nextSource,
        id: previousSource.id || nextSource.id || `source-${Date.now()}`,
        versions: [version, ...(previousSource.versions || [])].slice(0, 20),
        updated: "Just now",
        lastEditedBy: currentUser.name,
      } : source),
    });
  };
  const restoreSourceVersion = (version) => {
    if (selectedSourceIndex === null) return;
    const previousSource = selected.sources[selectedSourceIndex];
    if (!previousSource || !version?.snapshot) return;
    const restoreRecord = {
      id: `version-${Date.now()}`,
      timestamp: new Date().toISOString(),
      editor: currentUser.name,
      sourceName: previousSource.label,
      summary: `restored version from ${formatVersionTime(version.timestamp)}`,
      snapshot: cloneSourceForVersion(previousSource),
    };
    updateSelected({
      sources: selected.sources.map((source, index) => index === selectedSourceIndex ? {
        ...version.snapshot,
        id: previousSource.id || version.snapshot.id,
        versions: [restoreRecord, ...(previousSource.versions || [])].slice(0, 20),
        updated: "Just now",
        lastEditedBy: currentUser.name,
      } : source),
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
              <div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
                {Array.from({ length: 24 }).map((_, index) => (
                  <span
                    key={index}
                    className="h-8 w-1 shrink-0 rounded-full bg-[var(--context-warm)]"
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
                <button onClick={() => docInputRef.current?.click()} className="label flex h-8 items-center gap-2 rounded-lg border border-[#dedede] px-3 text-[#555] hover:bg-[#f7f7f7]">
                  <FileText size={15} /> Upload Doc
                </button>
                <button onClick={() => imageInputRef.current?.click()} className="label flex h-8 items-center gap-2 rounded-lg border border-[#dedede] px-3 text-[#555] hover:bg-[#f7f7f7]">
                  <Layers3 size={15} /> Add Image
                </button>
                <input
                  ref={docInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md,.csv,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={(event) => handleUploadedFiles(event, "Doc")}
                />
                <input
                  ref={imageInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => handleUploadedFiles(event, "Image")}
                />
              </div>
            </div>
            <div className="space-y-2">
              {selected.sources.map((file, i) => (
                <button key={`${file.label}-${i}`} onClick={() => setSelectedSourceIndex(i)} className="group flex w-full items-center gap-3 rounded-lg px-1 py-2 text-left hover:bg-[#f7f7f7]">
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
          <aside className="source-overlay-panel fixed inset-y-0 right-0 z-50 w-full max-w-[1040px] overflow-y-auto border-l border-[#e5e5e5] bg-white shadow-[-18px_0_44px_rgba(0,0,0,0.10)]">
            <div className="sticky top-0 z-10 flex h-12 items-center justify-between border-b border-[#eeeeee] bg-white px-4">
              <div className="flex items-center gap-2 text-[#777]">
                <button onClick={() => setSelectedSourceIndex(null)} className="rounded-lg p-2 hover:bg-[#f5f5f5]" title="Close source page">
                  <ChevronRight size={18} className="rotate-180" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={copySelectedSource} className="label flex items-center gap-2 rounded-lg px-2 py-1 text-[#555] hover:bg-[#f5f5f5]">
                  {sourceCopied ? <Check size={15} /> : <Copy size={15} />} {sourceCopied ? "Copied" : "Copy contents"}
                </button>
                <button onClick={exportSelectedSourcePdf} className="label flex items-center gap-2 rounded-lg px-2 py-1 text-[#555] hover:bg-[#f5f5f5]">
                  <FileText size={15} /> Export PDF
                </button>
                <button onClick={deleteSelectedSource} className="label flex items-center gap-2 rounded-lg px-2 py-1 text-[#b42318] hover:bg-[#fff7f5]">
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
            {selectedSource.fileDataUrl || selectedSource.images?.length ? (
              <SourceFilePreview source={selectedSource} sourceIcon={sourceIcon} />
            ) : (
              <SourcePageEditor
                source={selectedSource}
                sourceIcon={sourceIcon}
                fallbackText={sourcePreview(selectedSource)}
                saveSource={saveSource}
              />
            )}
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
          className="absolute -left-4 top-5 z-20 flex h-8 w-8 items-center justify-center rounded-lg border border-[#dedede] bg-white text-[#777] shadow-sm transition hover:text-[#333]"
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
      summary: "Approved narrative for what the brand is, who it serves, and why the team should win.",
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
              <div className="ml-auto max-w-[680px] rounded-lg bg-[var(--brand-accent)] px-5 py-4 text-sm leading-6 text-white shadow-sm">
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
                      <div className="absolute bottom-3 left-3 top-3 w-px bg-[#e6e6e6]" />
                      {traceSteps.map((step) => {
                        const Icon = step.icon;
                        return (
                          <div key={step.label} className="relative flex gap-3">
                            <div className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fafafa] text-[#777] ring-1 ring-[#e6e6e6]">
                              <Icon size={13} />
                            </div>
                            <div className="min-w-0 flex-1 pb-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-medium text-[#444]">{step.label}</span>
                                <span className="text-[11px] text-[#999]">{step.type}</span>
                              </div>
                              <p className="mt-1 text-sm leading-6 text-[#777]">{step.detail}</p>
                              <div className="mt-2 flex flex-wrap gap-2">
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
              <article className="rounded-lg bg-[#eeeeee] p-5 sm:p-6">
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
                <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-[#999]">
                  <span>Sources:</span>
                    {output.sources.map((source) => (
                      <button
                        key={source}
                        onClick={() => setSelectedSource(source)}
                        className="rounded-md px-2 py-1 text-[#777] underline decoration-[#d8d8d8] underline-offset-2 transition hover:text-[#333]"
                      >
                        {source}
                      </button>
                    ))}
                  <button
                    onClick={() => setSelectedSource("Web citations")}
                    className="rounded-md px-2 py-1 text-[#8a6414] underline decoration-[#ead8aa] underline-offset-2 transition hover:text-[#66490d]"
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
          <div className="rounded-lg border border-[#d8d8d8] bg-white p-2 shadow-[0_16px_32px_rgba(0,0,0,0.08)]">
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
              className="max-h-40 min-h-10 w-full resize-none bg-transparent px-3 py-2 text-sm leading-6 text-[#333] outline-none placeholder:text-[#8f8f8f]"
            />
            <div className="flex items-center justify-between gap-3 border-t border-[#ededed] px-2 pt-2">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setUploadOpen((open) => !open)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666] transition hover:bg-[#e2e2e2] hover:text-[#222]"
                    title="Attach"
                  >
                    <Plus size={18} />
                  </button>
                  {uploadOpen && (
                    <div className="absolute bottom-10 left-0 z-40 w-[220px] overflow-hidden rounded-lg border border-[#d9d9d9] bg-white py-1 shadow-[0_16px_32px_rgba(0,0,0,0.14)]">
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
              <span className={`relative h-5 w-8 rounded-full transition-colors duration-200 ease-in-out ${searchWeb ? "bg-[var(--brand-accent)]" : "bg-[#c7c7c7]"}`}>
                <span
                      className="absolute left-1 top-1 h-3 w-3 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out"
                      style={{ transform: searchWeb ? "translateX(12px)" : "translateX(0)" }}
                    />
              </span>
                </button>
              </div>
              <div className="flex items-center gap-2">
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
          className="absolute -left-4 top-5 z-20 flex h-8 w-8 items-center justify-center rounded-lg border border-[#dedede] bg-white text-[#777] shadow-sm transition hover:text-[#333]"
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
    <header className="relative z-30 flex h-16 items-center justify-between border-b border-[#ececec] bg-white px-4 sm:px-5">
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
          <div className="absolute left-0 top-12 z-40 w-[280px] overflow-hidden rounded-lg border border-[#e6e6e6] bg-white py-2 shadow-[0_16px_32px_rgba(0,0,0,0.12)]">
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
          <span className="micro ml-auto inline-flex items-center gap-1 text-[#999]">
            <Command size={12} strokeWidth={2} />
            K
          </span>
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
            <div className="absolute right-0 top-11 z-40 w-[280px] overflow-hidden rounded-lg border border-[#e6e6e6] bg-white py-2 shadow-[0_16px_32px_rgba(0,0,0,0.12)]">
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
                      <div className="mt-1 text-xs text-[#999]">{owner} · {time}</div>
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
            <div className="absolute right-0 top-11 z-40 w-[280px] overflow-hidden rounded-lg border border-[#e6e6e6] bg-white py-2 shadow-[0_16px_32px_rgba(0,0,0,0.12)]">
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
                      <div className="mt-1 text-xs text-[#999]">{owner} · {time}</div>
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
      <div className="grid w-full max-w-[460px] grid-cols-3 gap-1 rounded-lg border border-[#e5e5e5] bg-white/94 p-1 shadow-[0_16px_40px_rgba(0,0,0,0.14)] backdrop-blur">
        {items.map((item) => {
          const Icon = item.icon;
          const selected = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`flex h-11 min-w-0 items-center justify-center gap-1 rounded-md px-1 text-[11px] font-medium transition-all duration-200 min-[390px]:gap-2 min-[390px]:px-2 min-[390px]:text-[12px] ${
                selected ? "bg-[var(--brand-accent)] text-white shadow-sm" : "text-[#707070] hover:bg-[#f6f6f6] hover:text-[var(--brand-accent)]"
              }`}
            >
              <Icon size={16} strokeWidth={1.9} className="shrink-0 transition-transform duration-200 ease-in-out min-[390px]:h-4 min-[390px]:w-4" />
              <span className="min-w-0 whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function LandingPage({ onGetStarted }) {
  const [activeUseCase, setActiveUseCase] = useState("content");
  const [teamSize, setTeamSize] = useState(4);
  const [assetsPerWeek, setAssetsPerWeek] = useState(9);
  const productCards = [
    { title: "Context health", detail: "Positioning and ICP are ready. Proof needs evidence.", meta: "68% ready", icon: Target },
    { title: "Define sources", detail: "Synopsis, notes, docs, images, and AI summaries in one library.", meta: "4 of 7 filled", icon: BookOpen },
    { title: "Build artifacts", detail: "Create posts, landing sections, emails, and battlecards from saved context.", meta: "RAG + web", icon: Bot },
    { title: "Source trace", detail: "See what the AI used, where it came from, and what changed.", meta: "Versioned", icon: Clock3 },
  ];
  const steps = [
    ["01", "Define the truth", "Add positioning, ICP, proof, competitor angles, tone, and design references once."],
    ["02", "Generate with context", "Ask Build for GTM outputs that reuse your approved startup memory."],
    ["03", "Trust the output", "Review citations, context trace, and version history before the team ships."],
  ];
  const stats = [
    ["40%", "faster first-draft GTM assets"],
    ["6h -> 15m", "from brief prep to ready draft"],
    ["85%", "less brand-context rework"],
  ];
  const useCases = {
    content: {
      label: "Content",
      headline: "Publish consistent thought leadership without rewriting the brief every time.",
      output: "Founder LinkedIn post",
      context: ["Positioning", "ICP", "Proof Materials"],
      metric: "3.2h saved",
      action: "Build post",
    },
    sales: {
      label: "Sales",
      headline: "Turn proof and competitor notes into sales-ready assets with fewer claim risks.",
      output: "Competitor battlecard",
      context: ["Competitor Angles", "Proof Materials", "ICP"],
      metric: "28% faster prep",
      action: "Build battlecard",
    },
    launch: {
      label: "Launch",
      headline: "Create landing sections, email angles, and image prompts from the same approved truth.",
      output: "Landing hero section",
      context: ["Value Proposition", "Design System", "Proof Materials"],
      metric: "5 assets queued",
      action: "Build launch set",
    },
  };
  const activeCase = useCases[activeUseCase];
  const estimatedWeeklySavings = Math.round(teamSize * assetsPerWeek * 0.7);
  const estimatedMonthlySavings = estimatedWeeklySavings * 4;
  const conversionPoints = [
    "Bring your own OpenAI, Claude, Gemini, or image model key.",
    "Keep draft sources out of Build until the context is ready.",
    "Show citations and source trace so teams trust the output.",
  ];

  return (
    <div className="min-h-screen bg-white text-[#292929]">
      <header className="mx-auto flex max-w-[1160px] items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <button onClick={onGetStarted} className="flex items-center gap-3 text-left">
          <span className="type-card-title text-[#242424]">ContextOS</span>
        </button>
        <nav className="hidden items-center gap-6 type-caption text-[#666] md:flex">
          <button onClick={onGetStarted} className="transition hover:text-[#242424]">Dashboard</button>
          <a href="#how-it-works" className="transition hover:text-[#242424]">How it works</a>
          <a href="#use-cases" className="transition hover:text-[#242424]">Use cases</a>
          <a href="#start" className="transition hover:text-[#242424]">Start</a>
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={onGetStarted} className="label hidden h-9 rounded-lg border border-[#dedede] px-3 text-[#444] transition hover:bg-[#f7f7f7] sm:block">
            View demo
          </button>
          <button onClick={onGetStarted} className="label flex h-9 items-center gap-2 rounded-lg bg-[#2b2b2b] px-3 text-white transition hover:bg-[#333]">
            Get started <ChevronRight size={15} />
          </button>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-[1160px] px-4 pb-16 pt-16 text-center sm:px-6 lg:px-8 lg:pb-24 lg:pt-24">
          <div className="mx-auto inline-flex items-center rounded-lg border border-[#e6e6e6] px-3 py-1 type-caption text-[#666]">
            Startup context for AI execution
          </div>
          <h1 className="display mx-auto mt-5 max-w-[760px] text-[#1f1f1f]">
            Define your startup once. Build every GTM asset from it.
          </h1>
          <p className="body-lg mx-auto mt-4 max-w-[660px] text-[#666]">
            ContextOS gives founders, PMs, and GTM teams one place to store brand truth, source evidence, and design references before asking AI to create.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={onGetStarted} className="label flex h-10 items-center gap-2 rounded-lg bg-[#2b2b2b] px-4 text-white transition hover:bg-[#333]">
              Open dashboard <ChevronRight size={16} />
            </button>
            <button onClick={onGetStarted} className="label h-10 rounded-lg border border-[#dedede] px-4 text-[#444] transition hover:bg-[#f7f7f7]">
              Try Build
            </button>
          </div>

          <div className="mx-auto mt-8 grid max-w-[720px] gap-3 sm:grid-cols-3">
            {stats.map(([value, label]) => (
              <div key={label} className="rounded-lg border border-[#eeeeee] bg-[#fafafa] p-4">
                <div className="h3 text-[#242424]">{value}</div>
                <div className="type-caption mt-1 text-[#777]">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-[1040px] gap-3 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-24">
          <div className="rounded-lg border border-[#e6e6e6] bg-[#fafafa] p-4">
            <div className="rounded-lg border border-[#e7e7e7] bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="type-caption text-[#999]">Define Sources</span>
                <span className="type-caption text-[#777]">7 pages</span>
              </div>
              <div className="mt-4 space-y-2">
                {["Positioning", "ICP & Personas", "Proof Materials", "Design References"].map((item, index) => (
                  <div key={item} className="flex items-center gap-3 rounded-lg bg-[#fafafa] px-3 py-3">
                    <FileText size={17} className={index === 2 ? "text-[#f05d42]" : index === 3 ? "text-[#2f7dd1]" : "text-[#555]"} />
                    <span className="type-card-title flex-1 text-left text-[#333]">{item}</span>
                    <span className="type-caption text-[#999]">{index < 2 ? "Ready" : "Draft"}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white p-4">
                <div className="type-caption text-[#999]">Source coverage</div>
                <div className="display mt-6 text-[#242424]">4/7</div>
              </div>
              <div className="rounded-lg bg-white p-4">
                <div className="type-caption text-[#999]">Traceability</div>
                <div className="display mt-6 text-[#242424]">62%</div>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-lg border border-[#e8e8e8] bg-white p-5">
              <div className="mb-4 grid grid-cols-3 gap-2">
                {Object.entries(useCases).map(([key, item]) => (
                  <button
                    key={key}
                    onClick={() => setActiveUseCase(key)}
                    className={`label h-9 rounded-lg border transition ${activeUseCase === key ? "border-[#2b2b2b] bg-[#2b2b2b] text-white" : "border-[#e5e5e5] bg-white text-[#777] hover:bg-[#fafafa]"}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="type-caption text-[#999]">Selected outcome</div>
                  <h2 className="h4 mt-2 text-[#303030]">{activeCase.output}</h2>
                </div>
                <div className="rounded-lg bg-[#f7f7f7] px-3 py-2 text-right">
                  <div className="type-caption text-[#999]">Impact</div>
                  <div className="type-card-title text-[#242424]">{activeCase.metric}</div>
                </div>
              </div>
              <p className="type-body mt-4 text-[#666]">{activeCase.headline}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {activeCase.context.map((item) => (
                  <span key={item} className="type-caption rounded-md bg-[#f2f2f2] px-2 py-1 text-[#666]">{item}</span>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {productCards.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-lg border border-[#e8e8e8] bg-white p-4 text-left">
                    <div className="flex items-center justify-between">
                      <Icon size={17} className="text-[#555]" />
                      <span className="type-caption text-[#999]">{item.meta}</span>
                    </div>
                    <h2 className="type-card-title mt-5 text-[#303030]">{item.title}</h2>
                    <p className="type-caption mt-2 text-[#777]">{item.detail}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1040px] gap-8 px-4 py-16 sm:px-6 md:grid-cols-[minmax(0,0.9fr)_minmax(360px,1.1fr)] lg:px-8 lg:py-24">
          <div>
            <div className="type-caption text-[#999]">Business case</div>
            <h2 className="h2 mt-3 text-[#242424]">Stop paying the context tax on every new asset.</h2>
            <p className="type-body mt-4 max-w-[440px] text-[#666]">
              Every campaign, post, deck, or sales email starts faster when the team has one reliable source of brand and GTM truth.
            </p>
            <div className="mt-6 space-y-3">
              {conversionPoints.map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#2b2b2b] text-white">
                    <Check size={13} />
                  </span>
                  <span className="type-body text-[#555]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[#e6e6e6] bg-[#fafafa] p-5">
            <div className="flex items-center justify-between">
              <h3 className="h4 text-[#303030]">Savings estimator</h3>
              <span className="type-caption text-[#999]">Prototype metric</span>
            </div>
            <div className="mt-6 grid gap-5">
              <label className="block">
                <div className="mb-2 flex items-center justify-between type-caption text-[#777]">
                  <span>Team members using Build</span>
                  <span>{teamSize}</span>
                </div>
                <input type="range" min="1" max="12" value={teamSize} onChange={(event) => setTeamSize(Number(event.target.value))} className="w-full accent-[#2b2b2b]" />
              </label>
              <label className="block">
                <div className="mb-2 flex items-center justify-between type-caption text-[#777]">
                  <span>Assets created per week</span>
                  <span>{assetsPerWeek}</span>
                </div>
                <input type="range" min="2" max="30" value={assetsPerWeek} onChange={(event) => setAssetsPerWeek(Number(event.target.value))} className="w-full accent-[#2b2b2b]" />
              </label>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white p-4">
                <div className="type-caption text-[#999]">Weekly time returned</div>
                <div className="display mt-4 text-[#242424]">{estimatedWeeklySavings}h</div>
              </div>
              <div className="rounded-lg bg-white p-4">
                <div className="type-caption text-[#999]">Monthly time returned</div>
                <div className="display mt-4 text-[#242424]">{estimatedMonthlySavings}h</div>
              </div>
            </div>
            <button onClick={onGetStarted} className="label mt-5 h-10 w-full rounded-lg bg-[#2b2b2b] px-4 text-white transition hover:bg-[#333] active:scale-[0.98]">
              Build with your context
            </button>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-[1040px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h2 className="h2 text-center text-[#242424]">How it works</h2>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {steps.map(([number, title, text]) => (
              <div key={title} className="rounded-lg border border-[#e6e6e6] bg-[#fafafa] p-5">
                <div className="type-caption text-[#999]">{number}</div>
                <h3 className="h4 mt-6 text-[#303030]">{title}</h3>
                <p className="type-body mt-2 text-[#666]">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="use-cases" className="border-y border-[#eeeeee] bg-[linear-gradient(#f3f3f3_1px,transparent_1px),linear-gradient(90deg,#f3f3f3_1px,transparent_1px)] bg-[size:64px_64px]">
          <div className="mx-auto grid max-w-[1040px] gap-8 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8 lg:py-24">
            {stats.map(([value, label]) => (
              <div key={label} className="text-center">
                <div className="display text-[#242424]">{value}</div>
                <div className="type-caption mt-2 text-[#777]">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-[1040px] gap-8 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <div className="type-caption text-[#999]">For small startup teams</div>
            <h2 className="h2 mt-3 max-w-[420px] text-[#242424]">A brand command center before AI becomes your coworker.</h2>
            <p className="type-body mt-4 max-w-[440px] text-[#666]">
              Keep founder memory, customer proof, positioning, and design references in one system so every output starts from the same truth.
            </p>
          </div>
          <div className="rounded-lg border border-[#e6e6e6] bg-[#fafafa] p-5">
            <div className="space-y-3">
              {["Founder LinkedIn post", "Landing page hero", "Cold email sequence", "Competitor battlecard"].map((item, index) => (
                <div key={item} className="flex items-center justify-between rounded-lg bg-white px-3 py-3">
                  <span className="type-card-title text-[#333]">{item}</span>
                  <span className="type-caption text-[#999]">{index === 0 ? "Ready" : "Queued"}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="start" className="mx-auto max-w-[1040px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="border-t border-[#eeeeee] pt-16 lg:pt-24">
            <h2 className="h2 text-center text-[#242424]">Choose how to get started</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-[#f7f7f7] p-6">
                <h3 className="h4 text-[#303030]">Start with your own brand</h3>
                <p className="type-body mt-2 text-[#666]">Create a workspace, add sources, and build your first grounded artifact.</p>
                <button onClick={onGetStarted} className="label mt-6 h-10 w-full rounded-lg bg-[#2b2b2b] px-4 text-white transition hover:bg-[#333]">
                  Start building
                </button>
              </div>
              <div className="rounded-lg bg-[#f7f7f7] p-6">
                <h3 className="h4 text-[#303030]">Explore the prototype</h3>
                <p className="type-body mt-2 text-[#666]">Open the current example brand workspace and see the full dashboard flow.</p>
                <button onClick={onGetStarted} className="label mt-6 h-10 w-full rounded-lg border border-[#dcdcdc] bg-white px-4 text-[#444] transition hover:bg-[#f7f7f7]">
                  View dashboard
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#eeeeee]">
        <div className="mx-auto flex max-w-[1160px] flex-col gap-4 px-4 py-8 type-caption text-[#888] sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <div className="type-card-title text-[#333]">ContextOS</div>
            <div className="mt-1">Define once. Build with context.</div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 sm:flex sm:gap-6">
            <button onClick={onGetStarted} className="text-left hover:text-[#333]">Dashboard</button>
            <a href="#how-it-works" className="hover:text-[#333]">How it works</a>
            <a href="#use-cases" className="hover:text-[#333]">Use cases</a>
            <button onClick={onGetStarted} className="text-left hover:text-[#333]">Get started</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LandingPageV2({ onGetStarted }) {
  const outcomes = [
    ["40%", "faster first-draft GTM assets"],
    ["6h -> 15m", "from brief prep to ready draft"],
    ["85%", "less brand-context rework"],
  ];
  const workflow = [
    { icon: BookOpen, title: "Define the source of truth", text: "Store positioning, ICP, proof, competitor notes, tone, and design references as source pages." },
    { icon: Bot, title: "Build with grounded context", text: "Ask for posts, landing sections, emails, and sales assets that pull from approved brand memory." },
    { icon: Clock3, title: "Show the work", text: "Use citations, source trace, and version history so teams can trust what AI produced." },
  ];
  const useCases = [
    { icon: MessageSquareText, title: "Founder content", text: "Turn positioning and proof into consistent founder posts." },
    { icon: FileText, title: "Landing pages", text: "Draft hero sections and claims from approved value props." },
    { icon: Briefcase, title: "Sales assets", text: "Create battlecards and email sequences without risky copy." },
    { icon: Wand2, title: "Visual prompts", text: "Use design references to guide image and carousel prompts." },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-white text-[#292929]">
      <header className="mx-auto flex max-w-[1160px] items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <button onClick={onGetStarted} className="type-card-title text-[#242424]">ContextOS</button>
        <nav className="hidden items-center gap-6 type-caption text-[#666] md:flex">
          <a href="#product" className="transition hover:text-[#242424]">Product</a>
          <a href="#workflow" className="transition hover:text-[#242424]">Workflow</a>
          <a href="#outcomes" className="transition hover:text-[#242424]">Outcomes</a>
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={onGetStarted} className="label hidden h-9 rounded-lg border border-[#dedede] px-3 text-[#444] transition hover:bg-[#f7f7f7] active:scale-[0.98] sm:block">
            View demo
          </button>
          <button onClick={onGetStarted} className="label flex h-9 items-center gap-2 rounded-lg bg-[#2b2b2b] px-3 text-white transition hover:bg-[#333] active:scale-[0.98]">
            Get started <ChevronRight size={15} />
          </button>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-[1160px] px-4 pb-20 pt-16 text-center sm:px-6 lg:px-8 lg:pb-24 lg:pt-24">
          <div className="landing-reveal mx-auto inline-flex items-center gap-2 rounded-lg border border-[#e6e6e6] bg-white px-3 py-1 type-caption text-[#666]">
            <span className="landing-status-dot h-2 w-2 rounded-full bg-[#28c840]" />
            Brand memory for startup teams
          </div>
          <h1 className="landing-reveal display mx-auto mt-5 max-w-[820px] text-[#202020]" style={{ "--delay": "80ms" }}>
            Give your brand a brain that builds GTM assets with the right context.
          </h1>
          <p className="landing-reveal body-lg mx-auto mt-4 max-w-[680px] text-[#666]" style={{ "--delay": "140ms" }}>
            ContextOS helps founders, PMs, and GTM teams keep positioning, proof, customer notes, and design references ready for consistent content, sales, and launch assets.
          </p>
          <div className="landing-reveal mt-6 flex flex-wrap justify-center gap-3" style={{ "--delay": "200ms" }}>
            <button onClick={onGetStarted} className="label flex h-10 items-center gap-2 rounded-lg bg-[#2b2b2b] px-4 text-white transition hover:-translate-y-0.5 hover:bg-[#333] active:scale-[0.98]">
              Open dashboard <ChevronRight size={16} />
            </button>
            <a href="#product" className="label flex h-10 items-center rounded-lg border border-[#dedede] px-4 text-[#444] transition hover:-translate-y-0.5 hover:bg-[#f7f7f7]">
              See product
            </a>
          </div>

          <div className="landing-reveal mx-auto mt-10 grid max-w-[760px] gap-3 sm:grid-cols-3" style={{ "--delay": "260ms" }}>
            {outcomes.map(([value, label]) => (
              <div key={label} className="rounded-lg border border-[#eeeeee] bg-[#fafafa] p-4">
                <div className="h3 text-[#242424]">{value}</div>
                <div className="type-caption mt-1 text-[#777]">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="product" className="mx-auto max-w-[1160px] px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24">
          <div className="landing-reveal overflow-hidden rounded-lg border border-[#e6e6e6] bg-[#fafafa] p-2 shadow-[0_24px_80px_rgba(0,0,0,0.08)]">
            <img
              src="https://res.cloudinary.com/de2cfoigc/image/upload/v1779746051/image_2026-05-26_032406541_tvrqez.png"
              alt="ContextOS brand dashboard showing context health, source coverage, recommendations, changelog, and recent builds"
              className="block w-full rounded-md border border-[#eeeeee] bg-white"
            />
          </div>
        </section>

        <section id="workflow" className="mx-auto max-w-[1040px] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <div className="type-caption text-[#999]">Workflow</div>
              <h2 className="h2 mt-3 max-w-[460px] text-[#242424]">From scattered startup memory to reliable AI output.</h2>
              <p className="type-body mt-4 max-w-[440px] text-[#666]">
                Stop rebuilding the same context in every chat. Define it once, keep it fresh, and let Build reuse it.
              </p>
            </div>
            <div className="grid gap-3">
              {workflow.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="landing-reveal flex gap-4 rounded-lg border border-[#e8e8e8] bg-white p-5" style={{ "--delay": `${index * 80}ms` }}>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f4f4f4] text-[#555]">
                      <Icon size={19} />
                    </div>
                    <div>
                      <h3 className="h4 text-[#303030]">{item.title}</h3>
                      <p className="type-body mt-1 text-[#666]">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="outcomes" className="border-y border-[#eeeeee] bg-[linear-gradient(#f3f3f3_1px,transparent_1px),linear-gradient(90deg,#f3f3f3_1px,transparent_1px)] bg-[size:64px_64px]">
          <div className="mx-auto max-w-[1040px] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-[560px] text-center">
              <h2 className="h2 text-[#242424]">Make every GTM asset start from the same truth.</h2>
              <p className="type-body mt-3 text-[#666]">Founders, marketers, and sales teams can finally use AI without re-explaining the company every time.</p>
            </div>
            <div className="mt-10 grid gap-3 md:grid-cols-2">
              {useCases.map(({ icon: Icon, title, text }) => (
                <div key={title} className="group rounded-lg border border-[#e6e6e6] bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#d8d8d8] hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)]">
                  <div className="flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f4f4f4] text-[#555] transition group-hover:bg-[#eeeeee] group-hover:text-[#303030]">
                      <Icon size={18} strokeWidth={1.8} />
                    </div>
                    <div>
                      <h3 className="h4 text-[#303030]">{title}</h3>
                      <p className="type-body mt-2 text-[#666]">{text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1040px] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-8 rounded-lg bg-[#f7f7f7] p-6 md:grid-cols-[1fr_0.9fr] md:p-8">
            <div>
              <div className="type-caption text-[#999]">Business outcome</div>
              <h2 className="h2 mt-3 max-w-[520px] text-[#242424]">Reduce the cost of getting every asset on-brand.</h2>
              <p className="type-body mt-4 max-w-[520px] text-[#666]">
                ContextOS makes your team faster because AI starts with reusable truth instead of founder memory, scattered docs, and pasted briefs.
              </p>
            </div>
            <div className="grid gap-3">
              {["Bring your own model keys", "Exclude draft sources from generation", "Copy or export source-backed outputs"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg bg-white px-4 py-3">
                  <Check size={16} className="text-[#555]" />
                  <span className="type-body text-[#555]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1040px] px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24">
          <div className="border-t border-[#eeeeee] pt-20 text-center lg:pt-24">
            <h2 className="h2 text-[#242424]">Start with the ContextOS workspace.</h2>
            <p className="type-body mx-auto mt-3 max-w-[520px] text-[#666]">
              Open the prototype dashboard, review the source library, and generate your first grounded artifact.
            </p>
            <button onClick={onGetStarted} className="label mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-[#2b2b2b] px-4 text-white transition hover:-translate-y-0.5 hover:bg-[#333] active:scale-[0.98]">
              Open dashboard <ChevronRight size={16} />
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#eeeeee]">
        <div className="mx-auto flex max-w-[1160px] flex-col gap-4 px-4 py-8 type-caption text-[#888] sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <div className="type-card-title text-[#333]">ContextOS</div>
            <div className="mt-1">Define once. Build with context.</div>
          </div>
          <div className="flex flex-wrap gap-5">
            <a href="#product" className="hover:text-[#333]">Product</a>
            <a href="#workflow" className="hover:text-[#333]">Workflow</a>
            <a href="#outcomes" className="hover:text-[#333]">Outcomes</a>
            <button onClick={onGetStarted} className="text-left hover:text-[#333]">Get started</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [hasStarted, setHasStarted] = useState(() => window.location.hash === "#dashboard");
  const [transitionDirection, setTransitionDirection] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [createSourceRequest, setCreateSourceRequest] = useState(0);
  const [sourcePages, setSourcePages] = useState(initialSourcePages);
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

  const startProduct = () => {
    setHasStarted(true);
    navigateTo("dashboard");
    window.history.replaceState(null, "", "#dashboard");
  };

  if (!hasStarted) {
    return (
      <div style={brandTheme}>
        <LandingPageV2 onGetStarted={startProduct} />
      </div>
    );
  }

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
              {active === "dashboard" && <DashboardV2 setActive={navigateTo} sourcePages={sourcePages} />}
              {active === "define" && <DefineView createRequest={createSourceRequest} sourcePages={sourcePages} setSourcePages={setSourcePages} />}
              {active === "build" && <BuildStudioView />}
            </div>
          </div>
        </main>
        <MobileBottomNav active={active} setActive={navigateTo} />
      </div>
    </div>
  );
}
