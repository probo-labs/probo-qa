'use client';

import { useState, useEffect } from 'react';

export default function CLSPage() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [animationActive, setAnimationActive] = useState(false);
  const [status, setStatus] = useState('Page loaded - testing layout shifts');

  useEffect(() => {
    // Simulate late font loading
    const fontTimer = setTimeout(() => {
      setFontLoaded(true);
      setStatus('Web font loaded - layout shift occurred');
    }, 1000);

    // Simulate image loading
    const imageTimer = setTimeout(() => {
      setImageLoaded(true);
      setStatus('Image loaded - layout shift occurred');
    }, 1500);

    // Start CSS animation after 2 seconds
    const animationTimer = setTimeout(() => {
      setAnimationActive(true);
      setStatus('CSS animation started - layout shift occurred');
    }, 2000);

    // Stop animation after 1.5 seconds
    const stopAnimationTimer = setTimeout(() => {
      setAnimationActive(false);
      setStatus('All layout shifts complete - page should be stable');
    }, 3500);

    return () => {
      clearTimeout(fontTimer);
      clearTimeout(imageTimer);
      clearTimeout(animationTimer);
      clearTimeout(stopAnimationTimer);
    };
  }, []);

  return (
    <div className="min-h-screen p-8 bg-yellow-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-yellow-900 mb-8">
          Layout Shifts (CLS) Test
        </h1>
        <p className="text-lg text-yellow-700 mb-8">
          This page tests layout shift detection with images, fonts, and animations.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Status</h2>
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded">
                <p className="text-sm text-gray-600">Current Status:</p>
                <p className="text-lg font-semibold text-gray-800">{status}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded">
                <p className="text-sm text-blue-600">Image Loaded:</p>
                <p className="text-lg font-semibold text-blue-800">
                  {imageLoaded ? '✅ Yes' : '⏳ Loading...'}
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded">
                <p className="text-sm text-green-600">Font Loaded:</p>
                <p className="text-lg font-semibold text-green-800">
                  {fontLoaded ? '✅ Yes' : '⏳ Loading...'}
                </p>
              </div>
              <div className="bg-purple-100 p-4 rounded">
                <p className="text-sm text-purple-600">Animation:</p>
                <p className="text-lg font-semibold text-purple-800">
                  {animationActive ? '🟢 Active' : '🔴 Inactive'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Layout Shift Sources</h2>
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 p-4 rounded">
                <h3 className="font-semibold text-red-800">Image without dimensions</h3>
                <p className="text-sm text-red-600">Causes layout shift when loaded</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 p-4 rounded">
                <h3 className="font-semibold text-orange-800">Late web font</h3>
                <p className="text-sm text-orange-600">Changes text rendering after load</p>
              </div>
              <div className="bg-pink-50 border border-pink-200 p-4 rounded">
                <h3 className="font-semibold text-pink-800">CSS animation</h3>
                <p className="text-sm text-pink-600">Temporary layout changes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Layout Shift Elements</h2>
          
          {/* Image without dimensions - causes layout shift */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Image without dimensions:</h3>
            {imageLoaded ? (
              <img 
                src="https://picsum.photos/400/300" 
                alt="Random image that causes layout shift"
                className="rounded-lg shadow-md"
              />
            ) : (
              <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                <p className="text-gray-500">Image loading...</p>
              </div>
            )}
          </div>

          {/* Text with late font loading */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Text with late font loading:</h3>
            <p 
              className={`text-lg transition-all duration-500 ${
                fontLoaded 
                  ? 'font-bold text-blue-600' 
                  : 'font-normal text-gray-600'
              }`}
            >
              This text changes font weight and color when the web font loads, causing a layout shift.
            </p>
          </div>

          {/* CSS animation banner */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">CSS Animation Banner:</h3>
            {animationActive && (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg animate-pulse">
                <p className="text-center font-bold">
                  🎉 This banner appears with animation and causes layout shift!
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Expected Behavior
          </h3>
          <p className="text-yellow-700">
            The waiter should detect layout shifts from images, fonts, and animations, 
            and wait for the page to become visually stable before resolving.
          </p>
        </div>
      </div>
    </div>
  );
}
