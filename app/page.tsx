import Link from "next/link";

const modules = [
    {
        title: "Face detection",
        body: "Find faces in a still or a live camera feed. Same browser path you already use for Play / Stop.",
    },
    {
        title: "Face recognition",
        body: "Match against a group dataset. Build encodings from profiles, then identify people in video.",
    },
    {
        title: "Profiles & groups",
        body: "People records, reference images, and datasets for recognition, vigilance, and access lists.",
    },
    {
        title: "Live pipeline",
        body: "Origin, processor, and destination as an explicit graph — webcam or device into the recognizer and back.",
    },
];

const Home = () => {
    return (
        <div className="min-h-screen">
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

            <main className="mx-auto w-[min(1120px,calc(100%-1.5rem))] pb-24 pt-16">
                <p className="page-kicker">Computer vision workspace</p>
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
                    Detect, recognize, and gate access — from a browser camera or a device feed.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400">
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

                <div className="mt-20 grid gap-4 sm:grid-cols-2">
                    {modules.map((item) => (
                        <div key={item.title} className="card card-hover">
                            <h2 className="text-base font-semibold text-zinc-100">{item.title}</h2>
                            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.body}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Home;
