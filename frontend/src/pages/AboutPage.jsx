export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header Image */}
          <div className="h-64 sm:h-80 w-full relative">
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Corporate Building" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-lic-blue/70 flex flex-col items-center justify-center text-white px-4">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center">About LIC</h1>
              <p className="text-xl max-w-2xl text-center text-blue-100">Securing lives and fostering financial independence since 1956.</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 sm:p-16 max-w-4xl mx-auto">
            <div className="prose prose-lg text-gray-600">
              <h2 className="text-3xl font-bold text-lic-blue mb-6">Our Legacy of Trust</h2>
              <p className="mb-6 leading-relaxed">
                Life Insurance Corporation (LIC) has been a cornerstone of trust and financial security for millions of families. Established with the objective of spreading life insurance to all corners of the nation, we have grown into one of the largest and most reliable financial institutions globally.
              </p>
              
              <p className="mb-6 leading-relaxed">
                Our mission is to ensure that every individual has access to comprehensive life insurance, empowering them to live with peace of mind. We believe in "Zindagi ke saath bhi, Zindagi ke baad bhi" (With you in life, and beyond).
              </p>

              <div className="grid sm:grid-cols-2 gap-8 my-12">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <h3 className="text-xl font-bold text-lic-blue mb-3">Our Mission</h3>
                  <p className="text-sm">To explore and enhance the quality of life of people through financial security by providing products and services of aspired attributes with competitive returns.</p>
                </div>
                <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                  <h3 className="text-xl font-bold text-yellow-700 mb-3">Our Vision</h3>
                  <p className="text-sm">A trans-nationally competitive financial conglomerate of significance to societies and Pride of India.</p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-lic-blue mb-6">Core Values</h2>
              <ul className="list-disc pl-5 space-y-2 mb-8">
                <li><strong>Excellence:</strong> Continuously improving our services and product offerings.</li>
                <li><strong>Ethics:</strong> Maintaining the highest standards of integrity and transparency.</li>
                <li><strong>Customer Centricity:</strong> Keeping the policyholder at the heart of everything we do.</li>
                <li><strong>Trust:</strong> Honoring our commitments and securing futures.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
