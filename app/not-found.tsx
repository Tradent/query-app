export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <a href="/" className="text-2xl font-bold text-indigo-600">
                Query-SE
              </a>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/about" className="text-gray-500 hover:text-gray-700">
                About
              </a>
              <a href="/search" className="text-gray-500 hover:text-gray-700">
                Search
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">404</h1>
          <p className="mt-4 text-xl text-gray-500">Page not found</p>
          <p className="mt-2 text-gray-500">The page you're looking for doesn't exist or has been moved.</p>
          <div className="mt-10">
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go back home
            </a>
          </div>
        </div>
      </main>

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="mt-8 text-center text-base text-gray-400">&copy; 2025 Query-SE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
