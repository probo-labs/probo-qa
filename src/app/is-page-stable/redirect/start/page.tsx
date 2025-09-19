'use client';

export default function RedirectStartPage() {
  const handleStartRedirect = () => {
    // Navigate to the API route which will return a real HTTP 302 redirect
    window.location.href = '/api/redirect/1';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Redirect Chain Test
        </h1>
        <p className="text-gray-600 mb-8">
          Click the button below to start the redirect chain. You will be redirected through: 
          <br />
          <span className="font-semibold">start → 1 → 2 → 3 → final</span>
        </p>
        <button
          onClick={handleStartRedirect}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          Start Redirection
        </button>
        <div className="mt-6 text-sm text-gray-500">
          <p>This will test your NavTracker's ability to handle multiple HTTP 302 redirects.</p>
        </div>
      </div>
    </div>
  );
}
