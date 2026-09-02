'use client';

export default function WorkspacePlaceholder({
    kicker,
    title,
    body,
}: {
    kicker: string;
    title: string;
    body: string;
}) {
    return (
        <div>
            <p className="page-kicker">{kicker}</p>
            <h1 className="page-title">{title}</h1>
            <p className="mt-3 max-w-xl text-sm text-zinc-500">{body}</p>
        </div>
    );
}
