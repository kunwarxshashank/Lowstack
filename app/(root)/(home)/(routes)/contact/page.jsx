const Contact = () => {
  return (
    <div className="min-h-screen bg-beige p-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
        <p className="text-white text-lg mb-10">
          Welcome to LowStack — a platform dedicated to empowering students and schools with secure, 
          reliable, and accessible educational resources.
        </p>
      </div>

        {/* Contact Information */}
        <div className="bg-transparent rounded-lg shadow p-6 border border-white col-span-1 md:col-span-2">
          <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
          <p className="text-white">
            <strong>Email:</strong>{" "}
            <a href="mailto:screation190@gmail.com" className="underline">
              screation190@gmail.com
            </a>
          </p>
          <p className="text-white mt-2">
            <strong>Phone:</strong>{" "}
            <a href="tel:+917999649285" className="underline">
              +91 79996 49285
            </a>
          </p>
        </div>
      </div>
  );
};

export default Contact;
