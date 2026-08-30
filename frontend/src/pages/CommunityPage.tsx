import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HaladharHeader } from '../components/HaladharHeader';
import { mockEvents, alliedGuides, farmerCommunities } from '../data/mockCommunityData';
import { MapPin, BookOpen, Users, Calendar, ChevronRight } from 'lucide-react';

type TabType = 'events' | 'guides' | 'communities';

export function CommunityPage() {
  const [activeTab, setActiveTab] = useState<TabType>('events');
  const navigate = useNavigate();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 
                    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
    const monthShort = ['जन', 'फर', 'मार', 'अप्रै', 'मई', 'जून', 
                        'जुल', 'अग', 'सित', 'अक्टू', 'नव', 'दिस'];
    return {
      day: date.getDate(),
      month: monthShort[date.getMonth()],
      full: `${date.getDate()} ${months[date.getMonth()]}`
    };
  };

  // Sort events by date (upcoming first)
  const sortedEvents = [...mockEvents].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <HaladharHeader title="Community" />

      <main className="flex-1 content-with-nav">
        <div className="max-w-[420px] mx-auto">
          {/* Header */}
          <div className="px-4 py-5">
            <h1 className="text-[28px] font-bold text-gray-900 mb-1 leading-tight">
              कृषि से जुड़ें
            </h1>
            <p className="text-[14px] text-gray-600">
              प्रशिक्षण, गाइड और किसान समुदाय
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 px-4">
            <button
              onClick={() => setActiveTab('events')}
              className={`flex-1 py-3 text-[13px] font-semibold border-b-2 transition-colors
                         flex items-center justify-center gap-1.5 ${
                activeTab === 'events'
                  ? 'border-[#0b5e2c] text-[#0b5e2c]'
                  : 'border-transparent text-gray-500'
              }`}
            >
              <MapPin size={16} strokeWidth={2} />
              <span>आसपास</span>
            </button>
            <button
              onClick={() => setActiveTab('guides')}
              className={`flex-1 py-3 text-[13px] font-semibold border-b-2 transition-colors
                         flex items-center justify-center gap-1.5 ${
                activeTab === 'guides'
                  ? 'border-[#0b5e2c] text-[#0b5e2c]'
                  : 'border-transparent text-gray-500'
              }`}
            >
              <BookOpen size={16} strokeWidth={2} />
              <span>गाइड</span>
            </button>
            <button
              onClick={() => setActiveTab('communities')}
              className={`flex-1 py-3 text-[13px] font-semibold border-b-2 transition-colors
                         flex items-center justify-center gap-1.5 ${
                activeTab === 'communities'
                  ? 'border-[#0b5e2c] text-[#0b5e2c]'
                  : 'border-transparent text-gray-500'
              }`}
            >
              <Users size={16} strokeWidth={2} />
              <span>समुदाय</span>
            </button>
          </div>

          {/* Content */}
          <div className="pb-6">
            {/* Events Feed */}
            {activeTab === 'events' && (
              <div className="mt-4">
                <div className="px-4 mb-4">
                  <h2 className="text-[16px] font-bold text-gray-900 mb-1">
                    आगामी कार्यक्रम
                  </h2>
                  <p className="text-[12px] text-gray-600">
                    आपके क्षेत्र के कृषि प्रशिक्षण और कार्यक्रम
                  </p>
                </div>

                {/* Event Feed - Large cards */}
                <div className="space-y-4">
                  {sortedEvents.map((event) => {
                    const dateInfo = formatDate(event.date);
                    
                    return (
                      <div
                        key={event.id}
                        onClick={() => navigate(`/community/event/${event.id}`)}
                        className="bg-white mx-4 rounded-xl overflow-hidden border border-gray-200 
                                 hover:shadow-lg transition-all cursor-pointer active:scale-[0.99]"
                      >
                        {/* Event Image */}
                        <div className="relative w-full bg-gray-200" style={{ aspectRatio: '16/9' }}>
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          {event.isPlaceholder && (
                            <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] px-2 py-1 rounded-full shadow-md">
                              नमूना
                            </div>
                          )}
                          {/* Date Badge */}
                          <div className="absolute bottom-2 left-2 bg-white rounded-lg px-3 py-1.5 shadow-md">
                            <div className="text-[18px] font-bold text-gray-900 leading-none">
                              {dateInfo.day}
                            </div>
                            <div className="text-[10px] text-gray-600 leading-none mt-0.5">
                              {dateInfo.month}
                            </div>
                          </div>
                        </div>

                        {/* Event Info */}
                        <div className="p-4">
                          <h3 className="text-[16px] font-bold text-gray-900 mb-2 leading-tight">
                            {event.title}
                          </h3>

                          <div className="space-y-1.5 mb-3">
                            <div className="flex items-center gap-2 text-[12px] text-gray-600">
                              <Calendar size={14} strokeWidth={2} className="text-gray-400" />
                              <span>{dateInfo.full} · {event.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[12px] text-gray-600">
                              <MapPin size={14} strokeWidth={2} className="text-gray-400" />
                              <span>
                                {event.location.name}
                                {event.location.distance && ` · ${event.location.distance} km`}
                              </span>
                            </div>
                          </div>

                          <p className="text-[13px] text-gray-700 leading-relaxed line-clamp-2 mb-3">
                            {event.description}
                          </p>

                          <div className="text-[11px] text-gray-500 mb-3">
                            आयोजक: {event.organizer}
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-[13px] text-[#0b5e2c] font-semibold flex items-center gap-1">
                              <span>जानें</span>
                              <ChevronRight size={16} strokeWidth={2.5} />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Allied Guides */}
            {activeTab === 'guides' && (
              <div className="mt-4 px-4">
                <div className="mb-4">
                  <h2 className="text-[16px] font-bold text-gray-900 mb-1">
                    सहायक खेती गाइड
                  </h2>
                  <p className="text-[12px] text-gray-600">
                    शुरुआत करने के लिए संपूर्ण मार्गदर्शिकाएं
                  </p>
                </div>

                <div className="space-y-3">
                  {alliedGuides.map((guide) => (
                    <div
                      key={guide.id}
                      onClick={() => navigate(`/community/guide/${guide.id}`)}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden
                               hover:shadow-lg transition-all cursor-pointer active:scale-[0.99]"
                    >
                      {/* Guide image header */}
                      <div className="relative h-32 bg-gray-200">
                        <img
                          src={guide.image}
                          alt={guide.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      
                      {/* Guide info */}
                      <div className="p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="text-[16px] font-bold text-gray-900 mb-1 leading-tight">
                              {guide.title}
                            </h3>
                            <p className="text-[13px] text-gray-600 line-clamp-2 leading-snug">
                              {guide.overview}
                            </p>
                          </div>
                          <ChevronRight size={20} strokeWidth={2} className="text-[#0b5e2c] flex-shrink-0" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Farmer Communities */}
            {activeTab === 'communities' && (
              <div className="mt-4 px-4">
                <div className="mb-4">
                  <h2 className="text-[16px] font-bold text-gray-900 mb-1">
                    किसान समुदाय
                  </h2>
                  <p className="text-[12px] text-gray-600">
                    WhatsApp समूहों से जुड़ें और अनुभव साझा करें
                  </p>
                </div>

                <div className="space-y-3">
                  {farmerCommunities.map((community) => (
                    <a
                      key={community.id}
                      href={community.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-white rounded-xl border border-gray-200 overflow-hidden
                               hover:shadow-lg transition-all active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-3 p-4">
                        <div className="w-14 h-14 bg-[#0b5e2c]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Users size={24} strokeWidth={2} className="text-[#0b5e2c]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[16px] font-bold text-gray-900 mb-0.5 leading-tight">
                            {community.name}
                          </h3>
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1">
                            <MapPin size={12} strokeWidth={2} />
                            <span>{community.location}</span>
                          </div>
                          <p className="text-[13px] text-gray-600 line-clamp-1">
                            {community.description}
                          </p>
                          {community.members && (
                            <p className="text-[11px] text-gray-500 mt-1">
                              {community.members}
                            </p>
                          )}
                        </div>
                        <ChevronRight size={20} strokeWidth={2} className="text-green-600 flex-shrink-0" />
                      </div>
                      {community.isPlaceholder && (
                        <div className="bg-orange-50 border-t border-orange-200 px-4 py-2">
                          <p className="text-[10px] text-orange-900">
                            नमूना लिंक - असली WhatsApp समूह बाद में जोड़े जाएंगे
                          </p>
                        </div>
                      )}
                    </a>
                  ))}
                </div>

                {/* Info Box */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-[12px] text-blue-900 leading-relaxed">
                    <span className="font-semibold">सुझाव:</span> समुदायों में शामिल होने से पहले 
                    सुनिश्चित करें कि वे आपके क्षेत्र और रुचि से संबंधित हैं।
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
