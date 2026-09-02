import Link from "next/link";
import { IconType } from "react-icons";

interface HubCardProps {
    href: string;
    kicker: string;
    title: string;
    description: string;
    icon: IconType;
}

export default function HubCard({ href, kicker, title, description, icon: Icon }: HubCardProps) {
    return (
        <Link href={href} className="card card-hover group flex h-full flex-col">
            <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-500/15 text-xl text-emerald-300 ring-1 ring-emerald-400/20 transition group-hover:bg-emerald-500/25">
                    <Icon />
                </span>
                <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-400/80">
                        {kicker}
                    </p>
                    <h3 className="truncate text-base font-semibold text-zinc-100">{title}</h3>
                </div>
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">{description}</p>
        </Link>
    );
}
