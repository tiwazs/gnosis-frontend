import Link from "next/link";

const modules = [
    {
        title: "Face detection",
        kicker: "Find",
        body: "Lock onto faces in a still or a live camera feed — the same Play / Stop path you already use in the workspace.",
    },
    {
        title: "Face recognition",
        kicker: "Match",
        body: "Build encodings from profiles, then identify people against a group dataset in video.",
    },
    {
        title: "Profiles & groups",
        kicker: "Organize",
        body: "People records, reference images, and datasets for recognition, vigilance, and access lists.",
    },
    {
        title: "Live pipeline",
        kicker: "Route",
        body: "Origin, processor, and destination as an explicit graph — webcam or device into the recognizer and back.",
    },
];

const steps = [
    { n: "01", title: "Enroll", body: "Create profiles, attach reference images, and group the people you care about." },
    { n: "02", title: "Wire the feed", body: "Point a browser camera or a device origin at detection or recognition." },
    { n: "03", title: "Act on matches", body: "Gate access, watch a live overlay, and keep the pipeline explicit end to end." },
];

const Home = () => {
    return (
        <div className="relative min-h-screen overflow-hidden">
            <div className="pointer-events-none absolute inset-0 landing-grid" />
            <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 top-40 h-80 w-80 rounded-full bg-fuchsia-700/15 blur-3xl" />

            <header className="sticky top-0 z-20 border-b border-white/5 bg-[#120e16]/80 backdrop-blur-xl">
                <div className="mx-auto flex h-14 w-[min(1120px,calc(100%-1.5rem))] items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5">
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/20 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-400/25">
                            G
                        </span>
                        <span className="text-sm font-semibold tracking-wide text-zinc-100">Gnosis</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Link href="/login" className="btn-secondary px-3 py-1.5 text-sm">
                            Sign in
                        </Link>
                        <Link href="/signup" className="btn-primary px-3 py-1.5 text-sm">
                            Get started
                        </Link>
                    </div>
                </div>
            </header>

            <main className="relative mx-auto w-[min(1120px,calc(100%-1.5rem))] pb-24 pt-12 sm:pt-16">
                <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
                    <div>
                        <p className="page-kicker">Computer vision workspace</p>
                        <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl sm:leading-[1.1]">
                            See the feed. Name the face. Gate the door.
                        </h1>
                        <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-400">
                            Gnosis is the control plane for live face pipelines: profiles and groups in one place,
                            detection or recognition on the recognizer, signaling through the main API.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link href="/signup" className="btn-primary">
                                Create an account
                            </Link>
                            <Link href="/login" className="btn-secondary">
                                Sign in with GitHub
                            </Link>
                        </div>
                        <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/5 pt-6">
                            <div>
                                <dt className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Modes</dt>
                                <dd className="mt-1 text-lg font-semibold text-zinc-100">Detect / ID</dd>
                            </div>
                            <div>
                                <dt className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Origins</dt>
                                <dd className="mt-1 text-lg font-semibold text-zinc-100">Cam / device</dd>
                            </div>
                            <div>
                                <dt className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Graph</dt>
                                <dd className="mt-1 text-lg font-semibold text-zinc-100">3 hops</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="landing-float relative">
                        <div className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-black/40 shadow-glow">
                            <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
                                <div className="flex items-center gap-2">
                                    <span className="landing-live h-2 w-2 rounded-full bg-emerald-400" />
                                    <span className="text-xs font-medium text-zinc-300">Live feed · webcam</span>
                                </div>
                                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
                                    MATCH 98%
                                </span>
                            </div>
                            <div className="relative aspect-[4/3] bg-gradient-to-br from-zinc-800 via-[#1a1520] to-black">
                                <div className="absolute inset-6 rounded-2xl border border-dashed border-white/10" />
                                <div className="absolute left-[22%] top-[18%] h-[58%] w-[38%] rounded-2xl border-2 border-emerald-400/80 shadow-[0_0_24px_rgba(52,211,153,0.35)]">
                                    <span className="absolute -left-0.5 -top-0.5 h-3 w-3 border-l-2 border-t-2 border-emerald-300" />
                                    <span className="absolute -right-0.5 -top-0.5 h-3 w-3 border-r-2 border-t-2 border-emerald-300" />
                                    <span className="absolute -bottom-0.5 -left-0.5 h-3 w-3 border-b-2 border-l-2 border-emerald-300" />
                                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 border-b-2 border-r-2 border-emerald-300" />
                                    <span className="absolute -bottom-8 left-0 whitespace-nowrap rounded-md bg-emerald-500/90 px-2 py-0.5 text-[11px] font-semibold text-emerald-950">
                                        Ava Chen · enrolled
                                    </span>
                                </div>
                                <div className="landing-scan pointer-events-none absolute inset-x-8 top-8 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] text-zinc-500">
                                    <span>1920 × 1080</span>
                                    <span>processor · recognition</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-px bg-white/5 text-center text-[11px]">
                                <div className="bg-[#1a1520] px-2 py-3">
                                    <p className="font-medium text-emerald-300">origin</p>
                                    <p className="mt-0.5 text-zinc-500">webcam</p>
                                </div>
                                <div className="bg-[#1a1520] px-2 py-3">
                                    <p className="font-medium text-emerald-300">processor</p>
                                    <p className="mt-0.5 text-zinc-500">recognizer</p>
                                </div>
                                <div className="bg-[#1a1520] px-2 py-3">
                                    <p className="font-medium text-emerald-300">destination</p>
                                    <p className="mt-0.5 text-zinc-500">overlay</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="mt-20">
                    <p className="page-kicker">Workspace</p>
                    <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">Four surfaces, one pipeline</h2>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        {modules.map((item) => (
                            <div key={item.title} className="card card-hover">
                                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-400/80">
                                    {item.kicker}
                                </p>
                                <h3 className="mt-2 text-base font-semibold text-zinc-100">{item.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.body}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-20 overflow-hidden rounded-3xl border border-white/5 bg-gnosis-raised/40 p-6 sm:p-10">
                    <p className="page-kicker">How it runs</p>
                    <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">From enrollment to a live overlay</h2>
                    <ol className="mt-8 grid gap-6 md:grid-cols-3">
                        {steps.map((step) => (
                            <li key={step.n} className="relative">
                                <span className="font-mono text-sm text-emerald-400/70">{step.n}</span>
                                <h3 className="mt-2 text-lg font-semibold text-zinc-100">{step.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{step.body}</p>
                            </li>
                        ))}
                    </ol>
                    <svg className="mt-8 hidden h-8 w-full text-emerald-400/40 md:block" viewBox="0 0 800 24" fill="none" aria-hidden>
                        <path className="landing-path" d="M8 12 H792" stroke="currentColor" strokeWidth="2" />
                        <circle cx="8" cy="12" r="4" fill="#34d399" />
                        <circle cx="400" cy="12" r="4" fill="#34d399" />
                        <circle cx="792" cy="12" r="4" fill="#34d399" />
                    </svg>
                </section>

                <section className="mt-20 rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 via-transparent to-fuchsia-700/10 px-6 py-12 text-center sm:px-12">
                    <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
                        Spin up a workspace and point a camera at it.
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
                        Sign in, enroll a profile, pick a group, and run detection or recognition from the browser.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <Link href="/signup" className="btn-primary">
                            Get started
                        </Link>
                        <Link href="/login" className="btn-secondary">
                            I already have an account
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;
