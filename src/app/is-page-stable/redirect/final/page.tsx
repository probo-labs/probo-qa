import Link from 'next/link';

export default function RedirectFinalPage() {
  return (
    <div className="min-h-screen p-8 bg-green-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-green-900 mb-8">
          🎉 Redirect Chain Complete!
        </h1>
        <p className="text-lg text-green-700 mb-8">
          You&apos;ve successfully navigated through the redirect chain:
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Redirect Path</h2>
          <div className="space-y-2 text-lg">
            <div className="flex items-center space-x-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">1</span>
              <span>/is-page-stable/redirect/start</span>
              <span className="text-gray-500">→</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">2</span>
              <span>/is-page-stable/redirect/1</span>
              <span className="text-gray-500">→</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">3</span>
              <span>/is-page-stable/redirect/2</span>
              <span className="text-gray-500">→</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">4</span>
              <span>/is-page-stable/redirect/3</span>
              <span className="text-gray-500">→</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">✓</span>
              <span className="font-semibold">/is-page-stable/redirect/final</span>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Expected Behavior
          </h3>
          <p className="text-yellow-700">
            The waiter should handle multiple document navigations (302 redirects) 
            and resolve once the final page is stable.
          </p>
        </div>
        
        <div className="text-center">
          <Link 
            href="/is-page-stable/redirect/start"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Test Again
          </Link>
        </div>
      </div>
    </div>
  );
}
