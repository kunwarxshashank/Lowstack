const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-beige p-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Refund Policy</h1>
        <p className="text-white text-lg mb-10">
          Welcome to LowStack — a platform dedicated to empowering students and schools with secure, 
          reliable, and accessible educational resources.
        </p>
      </div>

        {/* Refund Policy */}
        <div className="bg-transparent rounded-lg shadow p-6 border border-white">
          <h2 className="text-2xl font-semibold text-white mb-4">Refund Policy</h2>
          <p className="text-white">
            Due to the digital nature of our products, all sales are final. Refunds are only granted in case of 
            technical issues preventing delivery. Please contact support within 7 days of purchase for assistance 
            with undelivered content.
          </p>
        </div>

    </div>
  );
};

export default RefundPolicy;
