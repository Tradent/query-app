import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-earth-100 text-sm border-t border-earth-200">
      <div className="max-w-7xl mx-auto">
        <div className="px-8 py-3 border-b border-earth-200">
          <span className="text-earth-700">Earth & Sun Network</span>
        </div>
        <div className="px-8 py-3 flex flex-col md:flex-row md:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-start">
            <Link href="/about" className="text-earth-700 hover:text-sun-600">
              About
            </Link>
            <Link href="/blockchain-analysis" className="text-earth-700 hover:text-sun-600">
              Blockchain Analysis
            </Link>
            <Link href="/validation-network" className="text-earth-700 hover:text-sun-600">
              Validation Network
            </Link>
            <a href="#" className="text-earth-700 hover:text-sun-600">
              How Search works
            </a>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-start mt-4 md:mt-0">
            <a href="#" className="text-earth-700 hover:text-sun-600">
              Privacy
            </a>
            <a href="#" className="text-earth-700 hover:text-sun-600">
              Terms
            </a>
            <a href="#" className="text-earth-700 hover:text-sun-600">
              Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
