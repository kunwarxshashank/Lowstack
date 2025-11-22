const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-beige p-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-white text-lg mb-10">
          Welcome to LowStack — a platform dedicated to empowering students and schools with secure, 
          reliable, and accessible educational resources.
        </p>
      </div>



        {/* Privacy Policy */}
        <div className="bg-transparent rounded-lg shadow p-6 border border-white">
          <h2 className="text-2xl font-semibold text-white mb-4">Privacy Policy</h2>
          <p className="text-white">
            <strong>Information We Collect:</strong> We collect minimal information necessary to provide our 
            educational services. This includes school details (name, code, email, mobile), class info, and 
            student details (name, roll number, photo) provided by schools during registration.
          </p>
          <p className="text-white mt-2">
            <strong>How We Use Your Information:</strong> Your data is used solely for educational purposes: 
            account creation, learning content, mentor support, and a safe learning environment. We never sell 
            or share personal info for commercial purposes.
          </p>
          <p className="text-white mt-2">
            <strong>Student Privacy & Safety:</strong> We keep student identity exposure minimal for global 
            connections, implement instant content moderation, and provide 24/7 monitoring. Students can 
            manage sessions and logout other devices.
          </p>
          <p className="text-white mt-2">
            <strong>Data Security:</strong> We implement industry-standard security measures. Data is 
            encrypted in transit and at rest. Our team continuously monitors threats with strict access 
            controls.
          </p>
        </div>
      
    </div>
  );
};

export default PrivacyPolicy;
