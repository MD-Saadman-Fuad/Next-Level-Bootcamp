
import "./globals.css";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <header className="py-4 border-b">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">My Blog</h1>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
