import Link from "next/link";

export default function OtpPage() {
  const testScenarios = [
    {
      id: "email-login",
      title: "Email Login",
      description: "Initial login screen with email input and login button",
      path: "/otp/email-login"
    },
    {
      id: "totp-verification", 
      title: "TOTP Verification",
      description: "Second screen requiring TOTP code input for authentication",
      path: "/otp/totp-verification"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] p-5">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            🔐 OTP Authentication
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Test scenarios for TOTP (Time-based One-Time Password) authentication flows
          </p>
        </div>

        {/* Test Scenarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {testScenarios.map((scenario) => (
            <Link
              key={scenario.id}
              href={scenario.path}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-200 hover:border-purple-300"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {scenario.id === "email-login" ? "📧" : "🔢"}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {scenario.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {scenario.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Test Categories Overview */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🔐 OTP Test Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">📧</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Email Login</h3>
              <p className="text-sm text-gray-600">Initial authentication step</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">🔢</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">TOTP Verification</h3>
              <p className="text-sm text-gray-600">Time-based one-time password</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">⏰</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Time-based</h3>
              <p className="text-sm text-gray-600">30-second rotating codes</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-red-600 font-bold">🔒</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Security</h3>
              <p className="text-sm text-gray-600">Multi-factor authentication</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-gray-300 text-[0.65rem] font-light tracking-widest">
          2 Tests
        </footer>
      </div>
    </div>
  );
}
