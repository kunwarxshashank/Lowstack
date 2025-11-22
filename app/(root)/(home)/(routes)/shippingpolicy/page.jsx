const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-beige p-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Shipping Policy</h1>
        <p className="text-white text-lg mb-10">
          Welcome to LowStack — a platform dedicated to empowering students and schools with secure, 
          reliable, and accessible educational resources.
        </p>
      </div>



        {/* Shipping Policy */}
        <div className="bg-transparent rounded-lg shadow p-6 border border-white">
          <h2 className="text-2xl font-semibold text-white mb-4">Shipping Policy</h2>
          <p className="text-white">
            All digital content such as notes and PYQs are delivered instantly via the user dashboard or email 
            after successful purchase. There are no physical shipments. Please ensure your email and account 
            details are correct to avoid delivery issues.
          </p>
        </div>


    </div>
  );
};

export default ShippingPolicy;
