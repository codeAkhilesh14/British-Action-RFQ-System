import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiArrowRight, FiLayers, FiShoppingBag, FiZap } from "react-icons/fi";

const Home = () => {
  const { isAuthenticated, userData } = useSelector((state) => state.user);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center rounded-full bg-blue-100 p-4 mb-6 dark:bg-slate-800">
            <FiShoppingBag className="text-blue-600 text-3xl dark:text-blue-300" />
          </div>
          <h1 className="text-5xl font-bold mb-4">British Auction RFQ System</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            The modern way to manage Request for Quotations through British auction bidding.
            Connect buyers with suppliers in real-time.
          </p>

          {!isAuthenticated ? (
            <div className="flex flex-col gap-4 sm:flex-row justify-center">
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                Get Started <FiArrowRight />
              </Link>
              <Link
                to="/login"
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-xl hover:bg-blue-50 transition dark:border-slate-400 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Login
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row justify-center">
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                Go to Dashboard <FiArrowRight />
              </Link>
              {userData?.role === "buyer" && (
                <Link
                  to="/create-rfq"
                  className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-xl hover:bg-blue-50 transition dark:border-slate-400 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  Create RFQ
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-20 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-8 rounded-3xl border border-slate-200 bg-slate-50 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-slate-800 dark:text-blue-300">
                <FiLayers size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Create RFQs</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Buyers can easily create detailed RFQs with custom timelines and requirements.
              </p>
            </div>
            <div className="p-8 rounded-3xl border border-slate-200 bg-slate-50 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-slate-800 dark:text-blue-300">
                <FiZap size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">British Auction Bidding</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Suppliers place decreasing bids to keep the auction competitive and efficient.
              </p>
            </div>
            <div className="p-8 rounded-3xl border border-slate-200 bg-slate-50 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-slate-800 dark:text-blue-300">
                <FiArrowRight size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Monitor bid activity and auction progress from one modern dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {[
              { label: "Sign Up", description: "Create an account as buyer or supplier" },
              { label: "Create/Browse RFQs", description: "Buyers create, suppliers browse available RFQs" },
              { label: "Place Lower Bids", description: "Suppliers bid lower amounts to compete" },
              { label: "Auction Ends", description: "Lowest bidder wins the contract" },
            ].map((step, index) => (
              <div key={step.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-900">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white text-xl font-bold">
                  {index + 1}
                </div>
                <h4 className="font-semibold mb-2">{step.label}</h4>
                <p className="text-slate-600 dark:text-slate-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">
            Join buyers and suppliers using our modern RFQ platform.
          </p>
          {!isAuthenticated && (
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3 text-blue-600 font-bold hover:bg-slate-100 transition"
            >
              Sign Up Now <FiArrowRight />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
