import TopBar from './topBar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <div className="min-h-screen">
        <TopBar />
        <div className="page-shell">
          {children}
        </div>
      </div>
  )
}
