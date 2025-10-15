const Header = () => {
  return (
    <header className="w-full py-16 px-8 bg-black bg-opacity-60">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
          Report with Ease, <br /> Track with Confidence.
        </h1>
        <p className="text-lg sm:text-xl mb-8">
          Welcome to Marias Heights Community System
        </p>
        <a
          href="#features"
          className="bg-orange-500 px-8 py-3 rounded-full text-lg font-medium transition-transform transform hover:scale-105"
        >
          Learn More
        </a>
      </div>
    </header>
  );
};

export default Header;
