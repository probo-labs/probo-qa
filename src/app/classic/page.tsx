import Image from "next/image";

export default function ClassicPage() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Classic Load Test
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          This is a baseline test with static content, CSS, and images. 
          The waiter should resolve quickly once the page is steady.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Static Content</h2>
            <p className="text-gray-700 mb-4">
              This page contains static text, images, and CSS styling. 
              No dynamic content or network requests after initial load.
            </p>
            <div className="space-y-4">
              <div className="bg-blue-100 p-4 rounded">
                <p className="text-blue-800">✅ Static text content</p>
              </div>
              <div className="bg-green-100 p-4 rounded">
                <p className="text-green-800">✅ CSS styling applied</p>
              </div>
              <div className="bg-purple-100 p-4 rounded">
                <p className="text-purple-800">✅ Images loaded</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Test Images</h2>
            <div className="space-y-4">
              <Image
                src="/next.svg"
                alt="Next.js logo"
                width={120}
                height={25}
                className="dark:invert"
              />
              <Image
                src="/vercel.svg"
                alt="Vercel logo"
                width={100}
                height={20}
                className="dark:invert"
              />
              <Image
                src="/globe.svg"
                alt="Globe icon"
                width={80}
                height={80}
                className="dark:invert"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Expected Behavior
          </h3>
          <p className="text-yellow-700">
            The waiter should detect that the page is stable after initial load 
            since there are no ongoing network requests or DOM changes.
          </p>
        </div>
      </div>
    </div>
  );
}
