"use client";

export default function Home() {
  return (
    <div className="relative min-h-screen font-sans overflow-x-hidden ">

      <main className="flex flex-col items-center justify-center px-6 pt-32 pb-24 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white max-w-4xl">
          Smarter Travel Decisions,{" "}
          <span className="text-blue-400">Proactively Managed</span>
        </h2>

        <p className="mt-6 text-lg text-gray-300 max-w-2xl">
          A centralized travel hub for individuals and corporations.
          Enforce company policies, manage bookings, and receive proactive
          alerts when disruptions happen.
        </p>

        <div className="mt-10">
          <button
          onClick={()=>{window.location.href = "/booking"}}
           className="px-8 cursor-pointer py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Get Started
          </button>
        </div>
      </main>

      <section className="px-6 py-20">
        <h3 className="text-3xl font-bold text-center text-white">
          How It Works
        </h3>

        <div className="mt-12 grid gap-8 max-w-6xl mx-auto md:grid-cols-3">
          <div className="p-6 rounded-lg border border-white/10">
            <h4 className="text-xl font-semibold text-white">
              1. Book Your Trip
            </h4>
            <p className="mt-3 text-gray-300">
              Create bookings for work or leisure. Corporate trips are
              automatically checked against company policy limits.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-white/10">
            <h4 className="text-xl font-semibold text-white">
              2. Policy Enforcement
            </h4>
            <p className="mt-3 text-gray-300">
              Instantly validate flight prices for corporate users and prevent
              out-of-policy bookings before they happen.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-white/10">
            <h4 className="text-xl font-semibold text-white">
              3. Proactive Alerts
            </h4>
            <p className="mt-3 text-gray-300">
              Get real-time resolution suggestions when flights are delayed —
              from lounge access to hotel notifications.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <h3 className="text-3xl font-bold text-center text-white">
          Key Features
        </h3>

        <div className="mt-12 grid gap-8 max-w-6xl mx-auto md:grid-cols-2">
          <div className="p-6 border border-white/10 rounded-lg">
            <h4 className="text-lg font-semibold text-white">
              Corporate & Personal Modes
            </h4>
            <p className="mt-3 text-gray-300">
              Seamlessly switch between work and personal travel contexts
              without managing multiple accounts.
            </p>
          </div>

          <div className="p-6 border border-white/10 rounded-lg">
            <h4 className="text-lg font-semibold text-white">
              Centralized Dashboard
            </h4>
            <p className="mt-3 text-gray-300">
              View all your bookings, alerts, and recommendations in one place.
            </p>
          </div>

          <div className="p-6 border border-white/10 rounded-lg">
            <h4 className="text-lg font-semibold text-white">
              Real-Time Disruption Handling
            </h4>
            <p className="mt-3 text-gray-300">
              Automatically receive intelligent suggestions when travel plans
              change unexpectedly.
            </p>
          </div>

          <div className="p-6 border border-white/10 rounded-lg">
            <h4 className="text-lg font-semibold text-white">
              Policy-Aware Booking Engine
            </h4>
            <p className="mt-3 text-gray-300">
              Ensure compliance with corporate travel rules without slowing
              down employees.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <h3 className="text-3xl font-bold text-center text-white">
          Who Is This For?
        </h3>

        <div className="mt-12 grid gap-8 max-w-5xl mx-auto md:grid-cols-2">
          <div className="p-6 border border-white/10 rounded-lg">
            <h4 className="text-xl font-semibold text-white">
              Individuals & Couples
            </h4>
            <p className="mt-3 text-gray-300">
              Perfect for honeymooners and frequent travelers who want proactive
              support when plans change.
            </p>
          </div>

          <div className="p-6 border border-white/10 rounded-lg">
            <h4 className="text-xl font-semibold text-white">
              Corporate Teams
            </h4>
            <p className="mt-3 text-gray-300">
              Designed for companies that need strict travel policies and
              automated disruption management.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 text-center">
        <h3 className="text-3xl font-bold text-white">
          Ready to Travel Smarter?
        </h3>
        <p className="mt-4 text-lg text-gray-300">
          Start managing your travel proactively today.
        </p>

        <div className="mt-8">
          <button
          onClick={()=>{window.location.href = "/booking"}}
           className="px-8 py-3 text-lg font-semibold text-white bg-blue-600 cursor-pointer rounded-lg hover:bg-blue-700">
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
}
