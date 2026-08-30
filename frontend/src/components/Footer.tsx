export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About KrishiMitra</h3>
            <p className="text-gray-400">
              An AI-powered agricultural advisory platform supporting farmers in Marathi, Hindi, and English.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition">Home</a></li>
              <li><a href="#" className="hover:text-white transition">AI Assistant</a></li>
              <li><a href="#" className="hover:text-white transition">Schemes</a></li>
              <li><a href="#" className="hover:text-white transition">Market</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-400">
              <a href="mailto:info@krishimitra.com" className="hover:text-white transition">
                info@krishimitra.com
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-4 text-center text-gray-400">
          <p>&copy; {currentYear} KrishiMitra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
