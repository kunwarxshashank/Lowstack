const Aboutus = () => {
  return (
    <div className="min-h-screen bg-beige p-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">About Us</h1>
        <p className="text-white text-lg mb-10">
          Welcome to LowStack — a platform dedicated to empowering students and schools with secure, 
          reliable, and accessible educational resources.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* About Us */}
        <div className="bg-transparent rounded-lg shadow p-6 border border-white md:col-span-2">
          <h2 className="text-2xl font-semibold text-white mb-4">About Us</h2>
          <p className="text-white">
            LowStack is an innovative educational platform built to bridge the gap between schools, 
            students, and digital learning. We focus on providing high-quality study materials, 
            practice papers, and mentorship support while ensuring the safety and privacy of every learner. 
          </p>
          <p className="text-white mt-2">
            Our mission is to make learning more engaging and accessible, helping students reach their 
            full potential. With strong security, real-time support, and a commitment to responsible use, 
            LowStack creates a trusted space for collaborative education.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Aboutus;
