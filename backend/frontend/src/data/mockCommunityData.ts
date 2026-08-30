// Mock data for Community/Events - structured for easy replacement with real backend data

export interface AgriEvent {
  id: string;
  title: string;
  category: 'training' | 'workshop' | 'seminar' | 'demo' | 'program';
  image: string;
  date: string; // ISO date string
  time: string;
  location: {
    name: string;
    district: string;
    distance?: number; // km from user
  };
  organizer: string;
  description: string;
  details: {
    whatYouLearn: string[];
    whoCanParticipate: string;
    registrationInfo: string;
    contact?: string;
  };
  isPlaceholder: boolean; // Mark as placeholder data
}

export interface AlliedGuide {
  id: string;
  title: string;
  icon: string;
  category: 'beekeeping' | 'mushroom' | 'goat' | 'poultry' | 'vermicompost';
  image: string;
  overview: string;
  gettingStarted: {
    requirements: string[];
    setup: string[];
    equipment: string[];
    beginnerSteps: string[];
  };
  market: {
    hasMandiIntegration: boolean;
    sellingInfo: string[];
  };
  government: {
    schemesAvailable: boolean;
    info: string[];
  };
}

export interface FarmerCommunity {
  id: string;
  name: string;
  image: string;
  location: string;
  description: string;
  organization: string;
  members?: string;
  whatsappLink: string; // Placeholder for now
  isPlaceholder: boolean;
}

// Mock Events Data
export const mockEvents: AgriEvent[] = [
  {
    id: 'event-1',
    title: 'मशरूम खेती प्रशिक्षण',
    category: 'training',
    image: '/images/events/event-1.jpg',
    date: '2026-09-12',
    time: '10:00 AM',
    location: {
      name: 'KVK नाशिक',
      district: 'Nashik',
      distance: 8,
    },
    organizer: 'कृषि विज्ञान केंद्र, नाशिक',
    description: 'मशरूम खेती में रुचि रखने वाले किसानों के लिए व्यावहारिक प्रशिक्षण। बटन मशरूम और ओएस्टर मशरूम उत्पादन की पूरी जानकारी।',
    details: {
      whatYouLearn: [
        'मशरूम की विभिन्न किस्में',
        'स्पॉन बनाने की विधि',
        'कम्पोस्ट तैयारी',
        'तापमान और नमी नियंत्रण',
        'रोग प्रबंधन',
        'बाजार और विपणन',
      ],
      whoCanParticipate: 'सभी किसान जो नई खेती शुरू करना चाहते हैं',
      registrationInfo: 'फोन या WhatsApp पर पंजीकरण करें',
      contact: '9876543210',
    },
    isPlaceholder: true,
  },
  {
    id: 'event-2',
    title: 'मधुमक्खी पालन कार्यशाला',
    category: 'workshop',
    image: '/images/events/event-2.jpg',
    date: '2026-09-15',
    time: '9:00 AM',
    location: {
      name: 'कृषि महाविद्यालय, कोपरगांव',
      district: 'Ahmednagar',
      distance: 2,
    },
    organizer: 'महाराष्ट्र शासन - उद्यानिकी विभाग',
    description: 'शहद उत्पादन और मधुमक्खी पालन में करियर बनाने के लिए सरकारी कार्यशाला। मुफ्त प्रशिक्षण और सब्सिडी की जानकारी।',
    details: {
      whatYouLearn: [
        'मधुमक्खी बॉक्स स्थापना',
        'मधुमक्खी कॉलोनी प्रबंधन',
        'शहद निकालना और पैकेजिंग',
        'मोम और अन्य उत्पाद',
        'सरकारी सब्सिडी योजना',
        'बाजार संपर्क',
      ],
      whoCanParticipate: 'कोई भी किसान या युवा उद्यमी',
      registrationInfo: 'ऑनलाइन पंजीकरण: kvk.nashik.gov.in',
      contact: '9876543211',
    },
    isPlaceholder: true,
  },
  {
    id: 'event-3',
    title: 'बकरी पालन व्यवसाय योजना',
    category: 'seminar',
    image: '/images/events/event-3.jpg',
    date: '2026-09-18',
    time: '2:00 PM',
    location: {
      name: 'पशुपालन विभाग, अहमदनगर',
      district: 'Ahmednagar',
      distance: 12,
    },
    organizer: 'पशुपालन विभाग, महाराष्ट्र',
    description: 'बकरी पालन व्यवसाय शुरू करने के लिए सरकारी योजनाओं की पूरी जानकारी। ऋण, प्रशिक्षण और बाजार सहायता।',
    details: {
      whatYouLearn: [
        'बकरी की नस्लें',
        'शेड निर्माण',
        'आहार प्रबंधन',
        'टीकाकरण और स्वास्थ्य',
        'सरकारी सब्सिडी',
        'बैंक ऋण प्रक्रिया',
      ],
      whoCanParticipate: 'नए और अनुभवी पशुपालक',
      registrationInfo: 'कार्यक्रम स्थल पर सीधे आएं',
    },
    isPlaceholder: true,
  },
  {
    id: 'event-4',
    title: 'कुक्कुटपालन आधुनिक तकनीक',
    category: 'training',
    image: '/images/events/event-4.jpg',
    date: '2026-09-20',
    time: '11:00 AM',
    location: {
      name: 'पोल्ट्री अनुसंधान केंद्र',
      district: 'Nashik',
      distance: 15,
    },
    organizer: 'ICAR - पोल्ट्री अनुसंधान',
    description: 'आधुनिक ब्रॉयलर और लेयर पालन की तकनीकें। रोग नियंत्रण और व्यावसायिक मुर्गी पालन की पूरी जानकारी।',
    details: {
      whatYouLearn: [
        'ब्रॉयलर और लेयर फार्मिंग',
        'शेड डिजाइन और वेंटिलेशन',
        'फीड फॉर्मूलेशन',
        'रोग की पहचान',
        'अंडे और मीट का विपणन',
      ],
      whoCanParticipate: 'नए और अनुभवी कुक्कुटपालक',
      registrationInfo: 'ऑनलाइन: poultry.icar.gov.in',
      contact: '9876543212',
    },
    isPlaceholder: true,
  },
  {
    id: 'event-5',
    title: 'वर्मीकम्पोस्ट उत्पादन प्रशिक्षण',
    category: 'demo',
    image: '/images/events/agri-input.avif',
    date: '2026-09-22',
    time: '10:00 AM',
    location: {
      name: 'जैविक खेती केंद्र',
      district: 'Ahmednagar',
      distance: 5,
    },
    organizer: 'KVK अहमदनगर',
    description: 'केंचुआ खाद बनाने का व्यावहारिक प्रदर्शन। घर पर कम लागत में शुरू करें और अतिरिक्त आय कमाएं।',
    details: {
      whatYouLearn: [
        'वर्मी बेड बनाना',
        'केंचुओं की देखभाल',
        'खाद तैयारी चक्र',
        'गुणवत्ता जांच',
        'पैकेजिंग और बिक्री',
      ],
      whoCanParticipate: 'सभी किसान, विशेष रूप से जैविक खेती में रुचि रखने वाले',
      registrationInfo: 'फोन पर पंजीकरण: 02426-XXXXX',
    },
    isPlaceholder: true,
  },
  {
    id: 'event-6',
    title: 'KVK कृषि मेला 2026',
    category: 'program',
    image: '/images/events/event-1.jpg',
    date: '2026-09-25',
    time: '8:00 AM',
    location: {
      name: 'KVK मैदान, नाशिक',
      district: 'Nashik',
      distance: 10,
    },
    organizer: 'कृषि विज्ञान केंद्र नाशिक',
    description: 'तीन दिवसीय कृषि मेला। नई तकनीक, मशीनरी प्रदर्शन, किसान सम्मेलन और विशेषज्ञों से मार्गदर्शन।',
    details: {
      whatYouLearn: [
        'नवीनतम कृषि तकनीक',
        'उन्नत बीज और उर्वरक',
        'कृषि मशीनरी प्रदर्शन',
        'सरकारी योजनाएं',
        'विशेषज्ञ परामर्श',
      ],
      whoCanParticipate: 'सभी किसान और कृषि उद्यमी',
      registrationInfo: 'प्रवेश निःशुल्क - सीधे आएं',
      contact: '02426-234567',
    },
    isPlaceholder: true,
  },
];

// Mock Allied Guides Data
export const alliedGuides: AlliedGuide[] = [
  {
    id: 'guide-beekeeping',
    title: 'मधुमक्खी पालन',
    icon: '🐝',
    category: 'beekeeping',
    image: '/images/events/event-2.jpg',
    overview: 'मधुमक्खी पालन (Beekeeping) एक लाभदायक सहायक व्यवसाय है। शहद और मोम के उत्पादन से अच्छी आय कमा सकते हैं।',
    gettingStarted: {
      requirements: [
        'न्यूनतम 2-3 मधुमक्खी बॉक्स से शुरुआत',
        'फूलों वाली फसलें या बगीचे के पास स्थान',
        'बुनियादी उपकरण (smoker, hive tool, suit)',
        'प्रशिक्षण या अनुभवी व्यक्ति का मार्गदर्शन',
      ],
      setup: [
        'छाया वाली जगह चुनें',
        'पानी का स्रोत पास में हो',
        'बॉक्स को 1-2 फीट की ऊंचाई पर रखें',
        'हवा का अच्छा प्रवाह हो',
      ],
      equipment: [
        'लकड़ी के मधुमक्खी बॉक्स',
        'फ्रेम और वैक्स शीट',
        'स्मोकर',
        'मधुमक्खी सूट और दस्ताने',
        'हाइव टूल',
        'शहद एक्सट्रैक्टर',
      ],
      beginnerSteps: [
        'KVK या कृषि विभाग से प्रशिक्षण लें',
        '2-3 बॉक्स से शुरुआत करें',
        'नियमित निरीक्षण करें',
        'रानी मधुमक्खी की स्थिति जांचें',
        'मौसम के अनुसार देखभाल करें',
      ],
    },
    market: {
      hasMandiIntegration: false,
      sellingInfo: [
        'स्थानीय बाजार में सीधी बिक्री',
        'ऑर्गेनिक स्टोर्स को सप्लाई',
        'ऑनलाइन प्लेटफॉर्म',
        'आयुर्वेदिक कंपनियों को',
      ],
    },
    government: {
      schemesAvailable: true,
      info: [
        'NABARD सब्सिडी योजना',
        'Khadi Board सहायता',
        'कृषि विभाग अनुदान',
        'बैंक ऋण सुविधा',
      ],
    },
  },
  {
    id: 'guide-mushroom',
    title: 'मशरूम खेती',
    icon: '🍄',
    category: 'mushroom',
    image: '/images/events/event-1.jpg',
    overview: 'मशरूम खेती कम जगह में अधिक मुनाफा देने वाला व्यवसाय है। पूरे साल उत्पादन संभव है।',
    gettingStarted: {
      requirements: [
        '10x10 फीट कमरा या शेड',
        'तापमान नियंत्रण (15-25°C)',
        'अंधेरा या कम रोशनी',
        'साफ पानी की व्यवस्था',
      ],
      setup: [
        'कमरे को साफ और कीटाणुरहित करें',
        'शेल्फ या रैक लगाएं',
        'वेंटिलेशन की व्यवस्था',
        'स्प्रे सिस्टम या पानी देने का इंतजाम',
      ],
      equipment: [
        'मशरूम स्पॉन (बीज)',
        'कम्पोस्ट या स्ट्रॉ',
        'पॉलीथीन बैग',
        'थर्मामीटर और हाइग्रोमीटर',
        'स्प्रेयर',
      ],
      beginnerSteps: [
        'बटन मशरूम से शुरू करें',
        'प्रशिक्षण केंद्र से स्पॉन खरीदें',
        'कम्पोस्ट तैयार करें',
        'बुवाई के 25-30 दिन बाद फसल',
      ],
    },
    market: {
      hasMandiIntegration: false,
      sellingInfo: [
        'होटल और रेस्टोरेंट को सीधी सप्लाई',
        'सब्जी मंडी',
        'सुपरमार्केट',
        'ताजा और सूखा दोनों रूप में',
      ],
    },
    government: {
      schemesAvailable: true,
      info: [
        'हॉर्टिकल्चर मिशन',
        'KVK प्रशिक्षण',
        'स्पॉन बैंक सब्सिडी',
      ],
    },
  },
  // Add remaining guides (goat, poultry, vermicompost) similarly
];

// Mock Farmer Communities
export const farmerCommunities: FarmerCommunity[] = [
  {
    id: 'comm-1',
    name: 'कोपरगांव कृषक समुदाय',
    image: '/images/communities/kopergaon.jpg',
    location: 'Kopergaon, Ahmednagar',
    description: 'स्थानीय किसानों का समुदाय। मौसम, भाव, और खेती की जानकारी साझा करें।',
    organization: 'KVK Ahmednagar',
    members: '180+ सदस्य',
    whatsappLink: 'https://wa.me/qr/KOPERGAON_PLACEHOLDER',
    isPlaceholder: true,
  },
  {
    id: 'comm-2',
    name: 'नाशिक कृषि समूह',
    image: '/images/communities/nashik.jpg',
    location: 'Nashik District',
    description: 'नाशिक जिले के किसानों का WhatsApp समुदाय। प्याज, अंगूर और सब्जी उत्पादकों के लिए।',
    organization: 'Nashik Agriculture Department',
    members: '450+ सदस्य',
    whatsappLink: 'https://wa.me/qr/NASHIK_PLACEHOLDER',
    isPlaceholder: true,
  },
  {
    id: 'comm-3',
    name: 'KVK प्रशिक्षण समुदाय',
    image: '/images/communities/kvk.jpg',
    location: 'Maharashtra',
    description: 'KVK प्रशिक्षण लेने वाले किसानों का नेटवर्क। नई तकनीक और अनुभव साझा करें।',
    organization: 'Krishi Vigyan Kendra',
    members: '320+ सदस्य',
    whatsappLink: 'https://wa.me/qr/KVK_PLACEHOLDER',
    isPlaceholder: true,
  },
  {
    id: 'comm-4',
    name: 'सहायक खेती समूह',
    image: '/images/communities/allied.jpg',
    location: 'Ahmednagar',
    description: 'मधुमक्खी, मशरूम, बकरी, मुर्गी पालन करने वाले किसानों का समुदाय।',
    organization: 'Allied Farmers Collective',
    members: '210+ सदस्य',
    whatsappLink: 'https://wa.me/qr/ALLIED_PLACEHOLDER',
    isPlaceholder: true,
  },
];
