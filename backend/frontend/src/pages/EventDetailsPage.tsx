import { useParams, useNavigate } from 'react-router-dom';
import { HaladharHeader } from '../components/HaladharHeader';
import { mockEvents } from '../data/mockCommunityData';

export function EventDetailsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const event = mockEvents.find((e) => e.id === eventId);

  if (!event) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <HaladharHeader title="Event" />
        <main className="flex-1 content-with-nav">
          <div className="max-w-[420px] mx-auto px-4 py-6">
            <p className="text-center text-gray-600">कार्यक्रम नहीं मिला</p>
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 
                    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleContact = () => {
    if (event.details.contact) {
      window.location.href = `tel:${event.details.contact}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <DashboardHeader />

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

          {/* Event Poster/Image */}
          <div className="relative w-full bg-gray-200" style={{ aspectRatio: '16/9' }}>
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {event.isPlaceholder && (
              <div className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] px-2 py-1 rounded-full shadow-md">
                नमूना डेटा
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="px-4 mt-4">
            {/* Title */}
            <h1 className="text-[22px] font-bold text-gray-900 mb-3">
              {event.title}
            </h1>

            {/* Meta Information */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-[14px] text-gray-700">
                <span>📅</span>
                <span>{formatDate(event.date)} · {event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-[14px] text-gray-700">
                <span>📍</span>
                <span>
                  {event.location.name}, {event.location.district}
                  {event.location.distance && ` · ${event.location.distance} km`}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[14px] text-gray-700">
                <span>🏛️</span>
                <span>आयोजक: {event.organizer}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-[16px] font-bold text-gray-900 mb-2">
                विवरण
              </h2>
              <p className="text-[14px] text-gray-700 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* What You'll Learn */}
            <div className="mb-6">
              <h2 className="text-[16px] font-bold text-gray-900 mb-2">
                📚 आप क्या सीखेंगे?
              </h2>
              <ul className="space-y-2">
                {event.details.whatYouLearn.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-[14px] text-gray-700">
                    <span className="text-[#0b5e2c] mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Who Can Participate */}
            <div className="mb-6">
              <h2 className="text-[16px] font-bold text-gray-900 mb-2">
                👥 कौन भाग ले सकता है?
              </h2>
              <p className="text-[14px] text-gray-700">
                {event.details.whoCanParticipate}
              </p>
            </div>

            {/* Registration Info */}
            <div className="mb-6">
              <h2 className="text-[16px] font-bold text-gray-900 mb-2">
                📝 पंजीकरण
              </h2>
              <p className="text-[14px] text-gray-700 mb-3">
                {event.details.registrationInfo}
              </p>
              {event.details.contact && (
                <button
                  onClick={handleContact}
                  className="w-full bg-[#0b5e2c] text-white py-3 px-4 rounded-lg font-semibold
                           hover:bg-[#0d7436] transition-colors active:scale-[0.98]"
                >
                  📞 संपर्क करें
                </button>
              )}
            </div>

            {/* Disclaimer for Placeholder */}
            {event.isPlaceholder && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <p className="text-[12px] text-orange-900 leading-relaxed">
                  <span className="font-semibold">नोट:</span> यह नमूना कार्यक्रम डेटा है। 
                  असली कार्यक्रम जानकारी बाद में जोड़ी जाएगी।
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
