import { useParams, useNavigate } from 'react-router-dom';
import { HaladharHeader } from '../components/HaladharHeader';
import { alliedGuides } from '../data/mockCommunityData';

export function AlliedGuideDetailsPage() {
  const { guideId } = useParams<{ guideId: string }>();
  const navigate = useNavigate();

  const guide = alliedGuides.find((g) => g.id === guideId);

  if (!guide) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <HaladharHeader title="Guide" />
        <main className="flex-1 content-with-nav">
          <div className="max-w-[420px] mx-auto px-4 py-6">
            <p className="text-center text-gray-600">गाइड नहीं मिली</p>
            <button
              onClick={() => navigate('/community')}
              className="mt-4 text-[#0b5e2c] font-semibold"
            >
              ← वापस जाएं
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      {/* TODO: Add proper header component */}
      <div className="p-4 border-b">
        <h1 className="text-lg font-semibold">Guide Details</h1>
      </div>

      <main className="flex-1 content-with-nav pb-6">
        <div className="max-w-[420px] mx-auto">
          {/* Back Button */}
          <div className="px-4 py-3">
            <button
              onClick={() => navigate('/community')}
              className="text-[#0b5e2c] font-semibold flex items-center gap-2"
            >
              <span>←</span>
              <span>वापस</span>
            </button>
          </div>

          {/* Guide Image Header */}
          <div className="relative w-full bg-gray-200" style={{ aspectRatio: '16/9' }}>
            <img
              src={guide.image}
              alt={guide.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-4 left-4 bg-white rounded-full p-3 shadow-lg">
              <span className="text-[36px]">{guide.icon}</span>
            </div>
          </div>

          {/* Header */}
          <div className="px-4 mb-6 mt-4">
            <h1 className="text-[24px] font-bold text-gray-900 mb-2">
              {guide.title}
            </h1>
            <p className="text-[14px] text-gray-700 leading-relaxed">
              {guide.overview}
            </p>
          </div>

          {/* Getting Started */}
          <div className="px-4 mb-6">
            <h2 className="text-[18px] font-bold text-gray-900 mb-3">
              🚀 शुरुआत कैसे करें?
            </h2>

            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
              <h3 className="text-[15px] font-bold text-gray-900 mb-2">
                आवश्यकताएं
              </h3>
              <ul className="space-y-1.5">
                {guide.gettingStarted.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-[13px] text-gray-700">
                    <span className="text-[#0b5e2c] mt-0.5">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
              <h3 className="text-[15px] font-bold text-gray-900 mb-2">
                सेटअप
              </h3>
              <ul className="space-y-1.5">
                {guide.gettingStarted.setup.map((step, index) => (
                  <li key={index} className="flex items-start gap-2 text-[13px] text-gray-700">
                    <span className="text-[#0b5e2c] font-bold">{index + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
              <h3 className="text-[15px] font-bold text-gray-900 mb-2">
                उपकरण
              </h3>
              <ul className="space-y-1.5">
                {guide.gettingStarted.equipment.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-[13px] text-gray-700">
                    <span className="text-[#0b5e2c] mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="text-[15px] font-bold text-gray-900 mb-2">
                शुरुआती कदम
              </h3>
              <ul className="space-y-1.5">
                {guide.gettingStarted.beginnerSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-2 text-[13px] text-gray-700">
                    <span className="text-[#0b5e2c] font-bold">{index + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Market & Selling */}
          <div className="px-4 mb-6">
            <h2 className="text-[18px] font-bold text-gray-900 mb-3">
              💰 बाजार और भाव
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              {guide.market.hasMandiIntegration && (
                <div className="mb-3 p-3 bg-green-50 rounded-lg">
                  <p className="text-[12px] text-green-900">
                    ✓ मंडी भाव एकीकरण उपलब्ध
                  </p>
                </div>
              )}
              <h3 className="text-[15px] font-bold text-gray-900 mb-2">
                🛒 कहाँ बेचें?
              </h3>
              <ul className="space-y-1.5">
                {guide.market.sellingInfo.map((info, index) => (
                  <li key={index} className="flex items-start gap-2 text-[13px] text-gray-700">
                    <span className="text-[#0b5e2c] mt-0.5">•</span>
                    <span>{info}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Government Support */}
          <div className="px-4 mb-6">
            <h2 className="text-[18px] font-bold text-gray-900 mb-3">
              🏛️ सरकारी सहायता
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              {guide.government.schemesAvailable ? (
                <>
                  <p className="text-[13px] text-gray-700 mb-3">
                    इस व्यवसाय के लिए सरकारी योजनाएं उपलब्ध हैं:
                  </p>
                  <ul className="space-y-1.5">
                    {guide.government.info.map((scheme, index) => (
                      <li key={index} className="flex items-start gap-2 text-[13px] text-gray-700">
                        <span className="text-[#0b5e2c] mt-0.5">✓</span>
                        <span>{scheme}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate('/help')}
                    className="mt-4 w-full bg-[#0b5e2c] text-white py-2.5 px-4 rounded-lg font-semibold text-[14px]
                             hover:bg-[#0d7436] transition-colors active:scale-[0.98]"
                  >
                    योजनाएं देखें →
                  </button>
                </>
              ) : (
                <p className="text-[13px] text-gray-600">
                  विशिष्ट योजनाओं के लिए अपने स्थानीय कृषि विभाग से संपर्क करें।
                </p>
              )}
            </div>
          </div>

          {/* Training Events */}
          <div className="px-4 mb-6">
            <h2 className="text-[18px] font-bold text-gray-900 mb-3">
              📍 प्रशिक्षण कार्यक्रम
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-[13px] text-blue-900 mb-2">
                इस विषय पर आगामी प्रशिक्षण कार्यक्रम देखें
              </p>
              <button
                onClick={() => navigate('/community')}
                className="text-[13px] text-[#0b5e2c] font-semibold"
              >
                कार्यक्रम देखें →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
