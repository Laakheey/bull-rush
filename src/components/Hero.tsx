import { Link } from "react-router-dom";

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-20"></div>

      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Grow Your finances with
            <span className="block text-yellow-300">
              High-Yield Token Investments
            </span>
          </h1>

          <p className="text-lg md:text-xl mb-10 text-gray-100 max-w-2xl mx-auto">
            Register today, buy tokens, and choose flexible plans: earn{" "}
            <strong>10% monthly</strong> returns or lock in for 12 months to get{" "}
            <strong>3x your investment</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/sign-up"
              className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition transform hover:scale-105 text-lg"
            >
              Get Started Now
            </Link>

            <Link
              to="/sign-in"
              className="px-8 py-4 bg-transparent border-2 border-white font-semibold rounded-lg hover:bg-white hover:text-indigo-600 transition transform hover:scale-105 text-lg"
            >
              Already Have Account?
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold">10%</div>
              <div className="text-sm uppercase tracking-wider mt-2">
                Monthly Returns
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">3x</div>
              <div className="text-sm uppercase tracking-wider mt-2">
                In 12 Months
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">Secure</div>
              <div className="text-sm uppercase tracking-wider mt-2">
                Token-Based
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 120L60 100C120 80 240 40 360 30C480 20 600 20 720 30C840 40 960 60 1080 70C1200 80 1320 80 1380 80L1440 80V120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
