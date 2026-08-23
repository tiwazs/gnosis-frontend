import LoginForm from "./loginForm";

const LoginPage = () => {
    return (
        <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <img src="/login_bkg_image.png" className="h-full w-full object-cover opacity-30" alt="" />
                <div className="absolute inset-0 bg-gradient-to-b from-gnosis-bg/40 via-gnosis-bg/80 to-gnosis-bg" />
            </div>
            <div className="relative w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/20 text-lg font-semibold text-emerald-300 ring-1 ring-emerald-400/30">
                        G
                    </div>
                    <p className="page-kicker">Gnosis</p>
                    <h1 className="page-title">Sign in</h1>
                </div>
                <LoginForm/>
            </div>
        </div>
    );
};

export default LoginPage;
