const WhyCommunitySystem = () => {
  return (
    <section className="py-20 px-8 bg-gray-800">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-6">Why Community System?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-orange-500 p-6 rounded-lg shadow-md">
            <h3 className="font-bold mb-3">Our Vision</h3>
            <p>Empowering communities with modern solutions.</p>
          </div>
          <div className="bg-orange-500 p-6 rounded-lg shadow-md">
            <h3 className="font-bold mb-3">Our Mission</h3>
            <p>Building trust through transparency and engagement.</p>
          </div>
          <div className="bg-orange-500 p-6 rounded-lg shadow-md">
            <h3 className="font-bold mb-3">Our Values</h3>
            <p>Commitment to service, quality, and innovation.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyCommunitySystem;
