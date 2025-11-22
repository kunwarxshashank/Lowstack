const Terms = () => {
  return (
    <div className="min-h-screen bg-beige p-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Terms & Conditions</h1>
        <p className="text-white text-lg mb-10">
          Welcome to LowStack — a platform dedicated to empowering students and schools with secure, 
          reliable, and accessible educational resources.
        </p>
      </div>



        {/* Terms & Conditions */}
        <div className="bg-transparent rounded-lg shadow p-6 border border-white">
          <h2 className="text-2xl font-semibold text-white mb-4">Terms & Conditions</h2>
          <p className="text-white">
            <strong>Platform Usage:</strong> LowStack is an educational platform for students and schools. 
            Users must use the platform responsibly and for educational purposes only. Misuse (e.g., sharing 
            inappropriate content) leads to immediate suspension.
          </p>
          <p className="text-white mt-2">
            <strong>School Registration:</strong> Schools must provide accurate info. By registering, schools 
            agree to our terms and commit to educational use only. They are responsible for their students' 
            behavior.
          </p>
          <p className="text-white mt-2">
            <strong>Content Guidelines:</strong> All content must be educational and suitable for students. 
            18+, harmful, or inappropriate content is strictly prohibited and leads to instant bans. Our 
            moderation team works 24/7 to ensure safety.
          </p>
          <p className="text-white mt-2">
            <strong>Account Security:</strong> Students should keep credentials secure and change passwords 
            immediately. In case of compromise, contact support. Students can manage active sessions themselves.
          </p>
        </div>

    </div>
  );
};

export default Terms;
