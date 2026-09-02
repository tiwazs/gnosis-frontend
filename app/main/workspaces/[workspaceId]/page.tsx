'use client';

import Link from "next/link";
import { useParams } from "next/navigation";
import { useRequireSession } from "../../../../lib/useRequireSession";
import { useQuery } from "react-query";
import {
    MdDevices,
    MdOutlinePersonOutline,
    MdOutlineGroups,
} from "react-icons/md";
import { getWorkspace } from "../../../../services/workspaceService";
import HubCard from "./HubCard";
import MainMenuCard from "../../MainMenuCard";

const defaultDescription =
    "Deploy vision and IoT services from this workspace, then attach the devices, profiles, and groups they use.";

export default function WorkspaceHomePage() {
    const params = useParams();
    const workspaceId = String(params.workspaceId || "");

    const { data: session, status } = useRequireSession();

    const jwt = session?.accessToken;
    const query = useQuery(
        ["workspace", workspaceId, jwt],
        () => getWorkspace(jwt as string, workspaceId),
        {
            enabled: Boolean(workspaceId && jwt),
        },
    );
    const workspace = query.data;

    if (status === "loading" || query.isLoading) {
        return <div className="text-emerald-400/80">Loading...</div>;
    }

    if (query.isError) {
        return (
            <div className="empty-state">
                {(query.error as Error).message || "Could not load workspace"}
            </div>
        );
    }

    if (!workspace) {
        return (
            <div className="empty-state">
                Workspace not found.{" "}
                <Link href="/main" className="text-emerald-400 hover:text-emerald-300">
                    Back to workspaces
                </Link>
            </div>
        );
    }

    const base = `/main/workspaces/${workspace.id}`;
    const description = workspace.description?.trim() || defaultDescription;

    const services = [
        {
            title: "Face Detection",
            description: "Find faces in stills or a live feed. Snap a photo, upload a file, or stream from the browser camera.",
            icon: "/main_menu_images/face_detection_icon.png",
            href: `${base}/face-detection`,
        },
        {
            title: "Face Recognition",
            description: "Match faces against a group dataset. Build encodings, then identify people from snaps or live video.",
            icon: "/main_menu_images/face_recognition_icon.png",
            href: `${base}/face-recognition`,
        },
        {
            title: "IoT Control",
            description: "Connect workspace devices and send control commands from a single console.",
            icon: "/main_menu_images/continuous_vigilance_icon.png",
            href: `${base}/iot-control`,
        },
        {
            title: "Access Control",
            description: "Build allow lists and run a door or site as a recognition-backed gate.",
            icon: "/main_menu_images/access_control_icon.png",
            href: `${base}/access-control`,
        },
        {
            title: "Continuous Vigilance",
            description: "Keep a persistent feed running and retain detections over time.",
            icon: "/main_menu_images/continuous_vigilance_icon.png",
            href: `${base}/continuous-vigilance`,
        },
    ];

    const resources = [
        {
            title: "Devices",
            description: "Hardware registered to this workspace: cameras, gates, and edge clients.",
            icon: MdDevices,
            href: `${base}/devices`,
        },
        {
            title: "Profiles",
            description: "People records and reference images used for recognition, groups, and access lists.",
            icon: MdOutlinePersonOutline,
            href: `${base}/profiles`,
        },
        {
            title: "Groups",
            description: "Bundle profiles into datasets for recognition, vigilance, and access control.",
            icon: MdOutlineGroups,
            href: `${base}/groups`,
        },
    ];

    return (
        <div className="space-y-10">
            <div>
                <h1 className="page-title">{workspace.name}</h1>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">{description}</p>
            </div>

            <section>
                <p className="page-kicker">Deploy</p>
                <h2 className="page-title text-xl">Services</h2>
                <p className="mt-2 text-sm text-zinc-500">
                    Run these pipelines inside this workspace.
                </p>
                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                        <MainMenuCard
                            key={service.title}
                            title={service.title}
                            description={service.description}
                            icon={service.icon}
                            redirectPath={service.href}
                        />
                    ))}
                </div>
            </section>

            <section>
                <p className="page-kicker">Library</p>
                <h2 className="page-title text-xl">Resources</h2>
                <p className="mt-2 text-sm text-zinc-500">
                    Objects created for use by the services above.
                </p>
                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {resources.map((resource) => (
                        <HubCard
                            key={resource.title}
                            kicker="Resource"
                            title={resource.title}
                            description={resource.description}
                            icon={resource.icon}
                            href={resource.href}
                        />
                    ))}
                </div>
            </section>

            <section>
                <p className="page-kicker">Playbooks</p>
                <h2 className="page-title text-xl">Example flows</h2>
                <p className="mt-2 text-sm text-zinc-500">
                    Typical ways to wire services and resources together.
                </p>
                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <article className="card">
                        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-400/80">
                            Example
                        </p>
                        <h3 className="mt-2 text-base font-semibold text-zinc-100">Face recognition</h3>
                        <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm leading-relaxed text-zinc-400">
                            <li>Create profiles and attach reference images.</li>
                            <li>Group those profiles into a dataset.</li>
                            <li>Run access control, continuous vigilance, or plain recognition against the group.</li>
                        </ol>
                    </article>
                    <article className="card">
                        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-400/80">
                            Example
                        </p>
                        <h3 className="mt-2 text-base font-semibold text-zinc-100">IoT control</h3>
                        <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm leading-relaxed text-zinc-400">
                            <li>Get an IoT device and install the Gnosis client on it.</li>
                            <li>Connect the client to this workspace.</li>
                            <li>Control the device from IoT Control.</li>
                        </ol>
                    </article>
                </div>
            </section>
        </div>
    );
}
