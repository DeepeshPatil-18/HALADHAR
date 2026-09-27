// =========================================================================
// HALADHAR Translation Extensions
// Additional translations for the HALADHAR redesign
// शेतीच्या प्रत्येक पावलावर.
// =========================================================================

// Language type — mirrors translations.ts, defined locally to avoid circular imports
type Language = 'en' | 'hi' | 'mr';

export type HaladharTranslationKey =
  // HALADHAR Brand
  | 'haladhar.brand' | 'haladhar.tagline'
  // Labour & Machinery
  | 'haladhar.service.labour'
  | 'haladhar.labour.title' | 'haladhar.labour.subtitle'
  | 'haladhar.labour.tabAll' | 'haladhar.labour.tabLabour' | 'haladhar.labour.tabMachinery'
  | 'haladhar.labour.tabRequirements'
  | 'haladhar.labour.available' | 'haladhar.labour.required'
  | 'haladhar.labour.perDay' | 'haladhar.labour.perHour' | 'haladhar.labour.contact'
  | 'haladhar.labour.postBtn' | 'haladhar.labour.postTitle'
  | 'haladhar.labour.postTypeLabel' | 'haladhar.labour.postTypeLabour' | 'haladhar.labour.postTypeMachine'
  | 'haladhar.labour.postNameLabel' | 'haladhar.labour.postNamePlaceholder'
  | 'haladhar.labour.postPhoneLabel' | 'haladhar.labour.postPhonePlaceholder'
  | 'haladhar.labour.postDescLabel' | 'haladhar.labour.postDescPlaceholder'
  | 'haladhar.labour.postRateLabel' | 'haladhar.labour.postRatePlaceholder'
  | 'haladhar.labour.postSubmit' | 'haladhar.labour.postCancel' | 'haladhar.labour.postSuccess'
  | 'haladhar.labour.km' | 'haladhar.labour.verified' | 'haladhar.labour.noResults'
  | 'haladhar.labour.postRequirement' | 'haladhar.labour.requirementPosted'
  | 'haladhar.labour.call' | 'haladhar.labour.whatsapp'
  // Navigation (New 4-tab design)
  | 'haladhar.nav.home' | 'haladhar.nav.myFarm' | 'haladhar.nav.profile' | 'haladhar.nav.services' | 'haladhar.nav.more'
  // Home Page
  | 'haladhar.home.location' | 'haladhar.home.askHaladhar' | 'haladhar.home.askPlaceholder'
  // Suggestions
  | 'haladhar.suggest.rain' | 'haladhar.suggest.irrigate' | 'haladhar.suggest.marketPrice'
  // Services
  | 'haladhar.service.weather' | 'haladhar.service.myCrop' | 'haladhar.service.water'
  | 'haladhar.service.market' | 'haladhar.service.disease' | 'haladhar.service.schemes'
  | 'haladhar.service.education'
  // My Farm
  | 'haladhar.farm.title' | 'haladhar.farm.location' | 'haladhar.farm.size' | 'haladhar.farm.crop'
  | 'haladhar.farm.stage' | 'haladhar.farm.irrigation' | 'haladhar.farm.cropInfo'
  | 'haladhar.farm.land' | 'haladhar.farm.waterInfo' | 'haladhar.farm.expenses'
  // Crop
  | 'haladhar.crop.title' | 'haladhar.crop.status' | 'haladhar.crop.statusGood'
  | 'haladhar.crop.statusModerate' | 'haladhar.crop.statusPoor' | 'haladhar.crop.stage'
  | 'haladhar.crop.planted' | 'haladhar.crop.area' | 'haladhar.crop.takePhoto'
  | 'haladhar.crop.photoInstruction' | 'haladhar.crop.checkDisease'
  // Weather (Farmer-focused)
  | 'haladhar.weather.today' | 'haladhar.weather.forFarming' | 'haladhar.weather.suitableSpray'
  | 'haladhar.weather.notSuitableSpray' | 'haladhar.weather.tomorrowRain'
  // Water
  | 'haladhar.water.title' | 'haladhar.water.shouldIrrigate' | 'haladhar.water.yes'
  | 'haladhar.water.no' | 'haladhar.water.soilMoist' | 'haladhar.water.rainExpected'
  | 'haladhar.water.checkTomorrow' | 'haladhar.water.why' | 'haladhar.water.listen'
  // Market (Simple)
  | 'haladhar.market.title' | 'haladhar.market.perQuintal' | 'haladhar.market.nearbyMarkets'
  | 'haladhar.market.advice' | 'haladhar.market.sellToday' | 'haladhar.market.wait'
  | 'haladhar.market.mandiBhav' | 'haladhar.market.mandiBhavDesc'
  // Disease/Pest
  | 'haladhar.disease.title' | 'haladhar.disease.takePhoto' | 'haladhar.disease.common'
  | 'haladhar.disease.commonPests'
  // Schemes (Simple)
  | 'haladhar.schemes.title' | 'haladhar.schemes.viewInfo' | 'haladhar.schemes.checkEligibility'
  // Education
  | 'haladhar.education.title' | 'haladhar.education.cropInfo' | 'haladhar.education.waterSaving'
  | 'haladhar.education.diseasePest' | 'haladhar.education.modern' | 'haladhar.education.marketInfo'
  // Voice Assistant
  | 'haladhar.voice.speak' | 'haladhar.voice.listening' | 'haladhar.voice.thinking'
  | 'haladhar.voice.tapToSpeak'
  // Profile
  | 'haladhar.profile.title' | 'haladhar.profile.name' | 'haladhar.profile.mobile'
  | 'haladhar.profile.village' | 'haladhar.profile.taluka' | 'haladhar.profile.district'
  | 'haladhar.profile.language' | 'haladhar.profile.edit' | 'haladhar.profile.changeLanguage'
  // Help
  | 'haladhar.help.title' | 'haladhar.help.faq' | 'haladhar.help.askHaladhar'
  | 'haladhar.help.contact' | 'haladhar.help.about'
  // Actions
  | 'haladhar.action.viewInfo' | 'haladhar.action.check' | 'haladhar.action.next'
  | 'haladhar.action.takePhoto' | 'haladhar.action.speakAsk' | 'haladhar.action.moreInfo'
  // Alerts
  | 'haladhar.alert.important' | 'haladhar.alert.avoidSpray' | 'haladhar.alert.rainSoon'
  // Offline
  | 'haladhar.offline.noInternet' | 'haladhar.offline.lastSaved' | 'haladhar.offline.savedAdvice'
  | 'haladhar.offline.savedCrop' | 'haladhar.offline.savedEducation'
  // Status
  | 'haladhar.status.good' | 'haladhar.status.moderate' | 'haladhar.status.poor'
  | 'haladhar.status.suitable' | 'haladhar.status.notSuitable'
  // Assistant mode labels
  | 'haladhar.assist.chat' | 'haladhar.assist.voice'
  | 'haladhar.assist.chatPlaceholder'
  | 'haladhar.assist.voiceLabel' | 'haladhar.assist.chatLabel'
  | 'haladhar.assist.you'
  // Location
  | 'haladhar.location.detecting' | 'haladhar.location.unavailable'
  | 'haladhar.location.setManually' | 'haladhar.location.allow'
  // Sign In
  | 'haladhar.signin.title' | 'haladhar.signin.subtitle'
  | 'haladhar.signin.aadhaarLabel' | 'haladhar.signin.aadhaarPlaceholder'
  | 'haladhar.signin.consent' | 'haladhar.signin.continue'
  | 'haladhar.signin.orDivider' | 'haladhar.signin.guest'
  | 'haladhar.signin.security' | 'haladhar.signin.verifying'
  | 'haladhar.signin.success' | 'haladhar.signin.errorFormat'
  | 'haladhar.signin.errorAuth' | 'haladhar.signin.errorConsent'
  | 'haladhar.signin.guestBadge'
  // Home v2 — voice-first daily context
  | 'haladhar.home.greeting' | 'haladhar.home.voiceCta' | 'haladhar.home.voiceListening'
  | 'haladhar.home.voicePrompt' | 'haladhar.home.voiceExamplesLabel'
  | 'haladhar.home.voiceExample1' | 'haladhar.home.voiceExample2'
  | 'haladhar.home.voiceExample3' | 'haladhar.home.orType' | 'haladhar.home.todayInfo'
  | 'haladhar.home.todayFor' | 'haladhar.home.todayActions' | 'haladhar.home.servicesLabel'
  | 'haladhar.home.noContext' | 'haladhar.home.alertTitle'
  | 'haladhar.home.weatherLabel' | 'haladhar.home.waterLabel'
  | 'haladhar.home.cropLabel' | 'haladhar.home.marketLabel'
  | 'haladhar.home.moreInfo'
  // Voice ask errors
  | 'ask.micPermissionDenied' | 'ask.voiceError';

// ---------------------------------------------------------------------------
// Marathi (Primary)
// ---------------------------------------------------------------------------
export const mr: Record<HaladharTranslationKey, string> = {
  // Brand
  'haladhar.brand': 'KrishiMitra',
  'haladhar.tagline': 'शेतीच्या प्रत्येक पावलावर.',

  // Labour & Machinery
  'haladhar.service.labour': 'मजूर व यंत्रे',
  'haladhar.labour.title': 'मजूर व यंत्रे',
  'haladhar.labour.subtitle': 'जवळचे मजूर आणि कृषी यंत्रे शोधा',
  'haladhar.labour.tabAll': 'सर्व',
  'haladhar.labour.tabLabour': 'मजूर',
  'haladhar.labour.tabMachinery': 'यंत्रे',
  'haladhar.labour.tabRequirements': 'आवश्यकता',
  'haladhar.labour.available': 'उपलब्ध',
  'haladhar.labour.required': 'आवश्यक',
  'haladhar.labour.perDay': '/ दिवस',
  'haladhar.labour.perHour': '/ तास',
  'haladhar.labour.contact': 'संपर्क करा',
  'haladhar.labour.postBtn': '+ जाहिरात द्या',
  'haladhar.labour.postTitle': 'नवीन जाहिरात',
  'haladhar.labour.postTypeLabel': 'प्रकार',
  'haladhar.labour.postTypeLabour': 'मजूर',
  'haladhar.labour.postTypeMachine': 'यंत्र',
  'haladhar.labour.postNameLabel': 'नाव',
  'haladhar.labour.postNamePlaceholder': 'तुमचे पूर्ण नाव',
  'haladhar.labour.postPhoneLabel': 'मोबाईल',
  'haladhar.labour.postPhonePlaceholder': '१०-अंकी नंबर',
  'haladhar.labour.postDescLabel': 'माहिती',
  'haladhar.labour.postDescPlaceholder': 'कौशल्य किंवा यंत्राचे वर्णन करा',
  'haladhar.labour.postRateLabel': 'दर (₹)',
  'haladhar.labour.postRatePlaceholder': 'उदा. ३५०',
  'haladhar.labour.postSubmit': 'जाहिरात प्रकाशित करा',
  'haladhar.labour.postCancel': 'रद्द करा',
  'haladhar.labour.postSuccess': 'जाहिरात यशस्वीरित्या प्रकाशित झाली!',
  'haladhar.labour.km': 'किमी दूर',
  'haladhar.labour.verified': 'तपासलेले',
  'haladhar.labour.noResults': 'या श्रेणीत कोणी नाही',
  'haladhar.labour.postRequirement': 'गरज नोंदवा',
  'haladhar.labour.requirementPosted': 'गरज नोंदवली गेली',
  'haladhar.labour.call': 'फोन करा',
  'haladhar.labour.whatsapp': 'WhatsApp',

  // Navigation
  'haladhar.nav.home': 'मुख्यपृष्ठ',
  'haladhar.nav.myFarm': 'माझी शेती',
  'haladhar.nav.profile': 'माझी माहिती',
  'haladhar.nav.services': 'सेवा',
  'haladhar.nav.more': 'अधिक',

  // Home
  'haladhar.home.location': 'स्थान',
  'haladhar.home.askHaladhar': 'KrishiMitra ला विचारा...',
  'haladhar.home.askPlaceholder': 'तुमचा प्रश्न विचारा...',

  // Suggestions
  'haladhar.suggest.rain': 'आज पाऊस येणार आहे का?',
  'haladhar.suggest.irrigate': 'पाणी कधी द्यायचं?',
  'haladhar.suggest.marketPrice': 'आजचा बाजारभाव किती?',

  // Services
  'haladhar.service.weather': 'हवामान',
  'haladhar.service.myCrop': 'माझं पीक',
  'haladhar.service.water': 'पाणी',
  'haladhar.service.market': 'बाजारभाव',
  'haladhar.service.disease': 'रोग / किड',
  'haladhar.service.schemes': 'सरकारी योजना',
  'haladhar.service.education': 'शेती शिका',

  // My Farm
  'haladhar.farm.title': 'माझी शेती',
  'haladhar.farm.location': 'स्थान',
  'haladhar.farm.size': 'क्षेत्र',
  'haladhar.farm.crop': 'पीक',
  'haladhar.farm.stage': 'पीक अवस्था',
  'haladhar.farm.irrigation': 'पाणी पुरवठा',
  'haladhar.farm.cropInfo': 'पीक माहिती',
  'haladhar.farm.land': 'जमीन',
  'haladhar.farm.waterInfo': 'पाणी',
  'haladhar.farm.expenses': 'खर्च',

  // Crop
  'haladhar.crop.title': 'पीक',
  'haladhar.crop.status': 'स्थिती',
  'haladhar.crop.statusGood': 'चांगली',
  'haladhar.crop.statusModerate': 'मध्यम',
  'haladhar.crop.statusPoor': 'वाईट',
  'haladhar.crop.stage': 'पीक अवस्था',
  'haladhar.crop.planted': 'लावणी',
  'haladhar.crop.area': 'क्षेत्र',
  'haladhar.crop.takePhoto': 'पीकाचा फोटो काढा',
  'haladhar.crop.photoInstruction': 'पान किंवा प्रभावित भागाचा स्पष्ट फोटो काढा.',
  'haladhar.crop.checkDisease': 'रोग / किड तपासा',

  // Weather
  'haladhar.weather.today': 'आजचे हवामान',
  'haladhar.weather.forFarming': 'शेतीसाठी',
  'haladhar.weather.suitableSpray': 'आज फवारणीसाठी हवामान योग्य आहे.',
  'haladhar.weather.notSuitableSpray': 'आज फवारणीसाठी हवामान योग्य नाही.',
  'haladhar.weather.tomorrowRain': 'उद्या पाऊस पडण्याची शक्यता आहे.',

  // Water
  'haladhar.water.title': 'पाणी',
  'haladhar.water.shouldIrrigate': 'आज पाणी द्यायचं का?',
  'haladhar.water.yes': 'हो',
  'haladhar.water.no': 'नाही',
  'haladhar.water.soilMoist': 'जमिनीत पुरेसा ओलावा आहे.',
  'haladhar.water.rainExpected': 'उद्या पावसाची शक्यता आहे.',
  'haladhar.water.checkTomorrow': 'उद्या पुन्हा तपासा.',
  'haladhar.water.why': 'का?',
  'haladhar.water.listen': 'ऐका',

  // Market
  'haladhar.market.title': 'बाजारभाव',
  'haladhar.market.perQuintal': '/ क्विंटल',
  'haladhar.market.nearbyMarkets': 'जवळच्या बाजारपेठा',
  'haladhar.market.advice': 'KrishiMitra चा सल्ला',
  'haladhar.market.sellToday': '50% माल आज विकणे योग्य.',
  'haladhar.market.wait': 'विक्रीसाठी थोडे थांबा.',
  'haladhar.market.mandiBhav': 'आजचा मंडी भाव',
  'haladhar.market.mandiBhavDesc': 'आसपास मंडी आणि बाजारभाव पहा',

  // Disease/Pest
  'haladhar.disease.title': 'रोग / किड',
  'haladhar.disease.takePhoto': 'पीकाचा फोटो काढा',
  'haladhar.disease.common': 'सामान्य रोग',
  'haladhar.disease.commonPests': 'सामान्य किडी',

  // Schemes
  'haladhar.schemes.title': 'सरकारी योजना',
  'haladhar.schemes.viewInfo': 'माहिती पहा',
  'haladhar.schemes.checkEligibility': 'पात्रता तपासा',

  // Education
  'haladhar.education.title': 'शेती शिका',
  'haladhar.education.cropInfo': 'पिकांची माहिती',
  'haladhar.education.waterSaving': 'पाणी बचत',
  'haladhar.education.diseasePest': 'रोग आणि किड',
  'haladhar.education.modern': 'आधुनिक शेती',
  'haladhar.education.marketInfo': 'बाजाराची माहिती',

  // Voice
  'haladhar.voice.speak': 'बोला',
  'haladhar.voice.listening': 'ऐकत आहे...',
  'haladhar.voice.thinking': 'विचार करत आहे...',
  'haladhar.voice.tapToSpeak': 'बोलण्यासाठी टॅप करा',

  // Profile
  'haladhar.profile.title': 'माझी माहिती',
  'haladhar.profile.name': 'नाव',
  'haladhar.profile.mobile': 'मोबाईल',
  'haladhar.profile.village': 'गाव',
  'haladhar.profile.taluka': 'तालुका',
  'haladhar.profile.district': 'जिल्हा',
  'haladhar.profile.language': 'भाषा',
  'haladhar.profile.edit': 'माहिती बदला',
  'haladhar.profile.changeLanguage': 'भाषा बदला',

  // Help
  'haladhar.help.title': 'मदत',
  'haladhar.help.faq': 'वारंवार विचारले जाणारे प्रश्न',
  'haladhar.help.askHaladhar': 'KrishiMitra ला विचारा',
  'haladhar.help.contact': 'संपर्क',
  'haladhar.help.about': 'KrishiMitra बद्दल',

  // Actions
  'haladhar.action.viewInfo': 'माहिती पहा',
  'haladhar.action.check': 'तपासा',
  'haladhar.action.next': 'पुढे जा',
  'haladhar.action.takePhoto': 'फोटो काढा',
  'haladhar.action.speakAsk': 'बोलून विचारा',
  'haladhar.action.moreInfo': 'अधिक माहिती',

  // Alerts
  'haladhar.alert.important': 'महत्त्वाची सूचना',
  'haladhar.alert.avoidSpray': 'आज फवारणी टाळा',
  'haladhar.alert.rainSoon': 'पुढील काही तासांत पावसाची शक्यता आहे.',

  // Offline
  'haladhar.offline.noInternet': 'इंटरनेट उपलब्ध नाही',
  'haladhar.offline.lastSaved': 'शेवटचे जतन केलेले हवामान',
  'haladhar.offline.savedAdvice': 'शेवटचा सल्ला',
  'haladhar.offline.savedCrop': 'माझ्या पिकाची माहिती',
  'haladhar.offline.savedEducation': 'जतन केलेले शिक्षण',

  // Status
  'haladhar.status.good': 'चांगली',
  'haladhar.status.moderate': 'मध्यम',
  'haladhar.status.poor': 'वाईट',
  'haladhar.status.suitable': 'योग्य',
  'haladhar.status.notSuitable': 'योग्य नाही',
  // Assistant mode labels
  'haladhar.assist.chat': '💬 लिहून विचारा',
  'haladhar.assist.voice': '🎤 बोलून विचारा',
  'haladhar.assist.chatPlaceholder': 'तुमचा प्रश्न लिहा...',
  'haladhar.assist.voiceLabel': 'KrishiMitra शी बोलून विचारा',
  'haladhar.assist.chatLabel': 'KrishiMitra सोबत चॅट करा',
  'haladhar.assist.you': 'तुम्ही',
  // Location
  'haladhar.location.detecting': 'स्थान शोधत आहे...',
  'haladhar.location.unavailable': 'स्थान उपलब्ध नाही',
  'haladhar.location.setManually': 'स्थान सेट करा',
  'haladhar.location.allow': 'स्थान परवानगी द्या',
  // Sign In
  'haladhar.signin.title': 'KrishiMitra मध्ये प्रवेश करा',
  'haladhar.signin.subtitle': 'शेतीच्या प्रत्येक पावलावर.',
  'haladhar.signin.aadhaarLabel': 'आधार क्रमांक',
  'haladhar.signin.aadhaarPlaceholder': 'XXXX XXXX XXXX',
  'haladhar.signin.consent': 'आधार आधारित प्रमाणीकरणासाठी पुढे जाण्याची माझी संमती आहे.',
  'haladhar.signin.continue': 'पुढे जा',
  'haladhar.signin.orDivider': 'किंवा',
  'haladhar.signin.guest': 'अतिथी म्हणून पुढे जा',
  'haladhar.signin.security': 'तुमची माहिती सुरक्षित ठेवली जाईल.',
  'haladhar.signin.verifying': 'प्रमाणीकरण सुरू आहे...',
  'haladhar.signin.success': 'प्रवेश यशस्वी',
  'haladhar.signin.errorFormat': 'कृपया १२ अंकी आधार क्रमांक टाका.',
  'haladhar.signin.errorAuth': 'प्रमाणीकरण पूर्ण झाले नाही. पुन्हा प्रयत्न करा.',
  'haladhar.signin.errorConsent': 'पुढे जाण्यासाठी संमती द्या.',
  'haladhar.signin.guestBadge': 'अतिथी',
  // Home v2
  'haladhar.home.greeting':      'नमस्कार शेतकरी बांधवांनो!',
  'haladhar.home.voiceCta':      'बोलून विचारा',
  'haladhar.home.voiceListening':'ऐकत आहे...',
  'haladhar.home.voicePrompt':   'तुमचा प्रश्न बोला...',
  'haladhar.home.voiceExamplesLabel': 'तुम्ही असे विचारू शकता:',
  'haladhar.home.voiceExample1': 'आज पाऊस पडेल का?',
  'haladhar.home.voiceExample2': 'कापसाला पाणी कधी द्यायचं?',
  'haladhar.home.voiceExample3': 'आजचा बाजारभाव किती?',
  'haladhar.home.orType':        'किंवा टाइप करा',
  'haladhar.home.todayInfo':     'आजची माहिती',
  'haladhar.home.todayFor':      'आज तुमच्या शेतासाठी',
  'haladhar.home.todayActions':  'आज काय करावे?',
  'haladhar.home.servicesLabel': 'सेवा',
  'haladhar.home.noContext':     'आजची माहिती उपलब्ध नाही.',
  'haladhar.home.alertTitle':    'महत्त्वाची सूचना',
  'haladhar.home.weatherLabel':  'हवामान',
  'haladhar.home.waterLabel':    'पाणी',
  'haladhar.home.cropLabel':     'पीक',
  'haladhar.home.marketLabel':   'बाजार',
  'haladhar.home.moreInfo':      'अधिक माहिती',
  // Ask errors
  'ask.micPermissionDenied': 'मायक्रोफोन परवानगी नाकारली',
  'ask.voiceError': 'आवाज प्रक्रियेत त्रुटी झाली',
};

// ---------------------------------------------------------------------------
// Hindi
// ---------------------------------------------------------------------------
export const hi: Record<HaladharTranslationKey, string> = {
  // Brand
  'haladhar.brand': 'KrishiMitra',
  'haladhar.tagline': 'खेती के हर कदम पर.',

  // Labour & Machinery
  'haladhar.service.labour': 'मजदूर और मशीनरी',
  'haladhar.labour.title': 'मजदूर और मशीनरी',
  'haladhar.labour.subtitle': 'नजदीकी मजदूर और कृषि मशीनरी खोजें',
  'haladhar.labour.tabAll': 'सभी',
  'haladhar.labour.tabLabour': 'मजदूर',
  'haladhar.labour.tabMachinery': 'मशीनरी',
  'haladhar.labour.tabRequirements': 'जरूरत',
  'haladhar.labour.available': 'उपलब्ध',
  'haladhar.labour.required': 'जरूरी',
  'haladhar.labour.perDay': '/ दिन',
  'haladhar.labour.perHour': '/ घंटा',
  'haladhar.labour.contact': 'संपर्क करें',
  'haladhar.labour.postBtn': '+ विज्ञापन दें',
  'haladhar.labour.postTitle': 'नया विज्ञापन',
  'haladhar.labour.postTypeLabel': 'प्रकार',
  'haladhar.labour.postTypeLabour': 'मजदूर',
  'haladhar.labour.postTypeMachine': 'मशीन',
  'haladhar.labour.postNameLabel': 'नाम',
  'haladhar.labour.postNamePlaceholder': 'आपका पूरा नाम',
  'haladhar.labour.postPhoneLabel': 'मोबाइल',
  'haladhar.labour.postPhonePlaceholder': '10-अंकीय नंबर',
  'haladhar.labour.postDescLabel': 'जानकारी',
  'haladhar.labour.postDescPlaceholder': 'कौशल या मशीन का विवरण दें',
  'haladhar.labour.postRateLabel': 'दर (₹)',
  'haladhar.labour.postRatePlaceholder': 'जैसे 350',
  'haladhar.labour.postSubmit': 'विज्ञापन प्रकाशित करें',
  'haladhar.labour.postCancel': 'रद्द करें',
  'haladhar.labour.postSuccess': 'विज्ञापन सफलतापूर्वक प्रकाशित!',
  'haladhar.labour.km': 'किमी दूर',
  'haladhar.labour.verified': 'सत्यापित',
  'haladhar.labour.noResults': 'इस श्रेणी में कोई नहीं',
  'haladhar.labour.postRequirement': 'जरूरत दर्ज करें',
  'haladhar.labour.requirementPosted': 'जरूरत दर्ज की गई',
  'haladhar.labour.call': 'कॉल करें',
  'haladhar.labour.whatsapp': 'WhatsApp',

  // Navigation
  'haladhar.nav.home': 'होम',
  'haladhar.nav.myFarm': 'मेरी खेती',
  'haladhar.nav.profile': 'मेरी जानकारी',
  'haladhar.nav.services': 'सेवाएं',
  'haladhar.nav.more': 'अधिक',

  // Home
  'haladhar.home.location': 'स्थान',
  'haladhar.home.askHaladhar': 'KrishiMitra से पूछें...',
  'haladhar.home.askPlaceholder': 'अपना सवाल पूछें...',

  // Suggestions
  'haladhar.suggest.rain': 'आज बारिश होगी क्या?',
  'haladhar.suggest.irrigate': 'पानी कब देना है?',
  'haladhar.suggest.marketPrice': 'आज का मंडी भाव कितना है?',

  // Services
  'haladhar.service.weather': 'मौसम',
  'haladhar.service.myCrop': 'मेरी फसल',
  'haladhar.service.water': 'पानी',
  'haladhar.service.market': 'मंडी भाव',
  'haladhar.service.disease': 'रोग / कीट',
  'haladhar.service.schemes': 'सरकारी योजनाएं',
  'haladhar.service.education': 'खेती सीखें',

  // My Farm
  'haladhar.farm.title': 'मेरी खेती',
  'haladhar.farm.location': 'स्थान',
  'haladhar.farm.size': 'क्षेत्र',
  'haladhar.farm.crop': 'फसल',
  'haladhar.farm.stage': 'फसल चरण',
  'haladhar.farm.irrigation': 'पानी की आपूर्ति',
  'haladhar.farm.cropInfo': 'फसल जानकारी',
  'haladhar.farm.land': 'जमीन',
  'haladhar.farm.waterInfo': 'पानी',
  'haladhar.farm.expenses': 'खर्च',

  // Crop
  'haladhar.crop.title': 'फसल',
  'haladhar.crop.status': 'स्थिति',
  'haladhar.crop.statusGood': 'अच्छा',
  'haladhar.crop.statusModerate': 'मध्यम',
  'haladhar.crop.statusPoor': 'खराब',
  'haladhar.crop.stage': 'फसल चरण',
  'haladhar.crop.planted': 'बुवाई',
  'haladhar.crop.area': 'क्षेत्र',
  'haladhar.crop.takePhoto': 'फसल की फोटो लें',
  'haladhar.crop.photoInstruction': 'पत्ती या प्रभावित हिस्से की स्पष्ट फोटो लें.',
  'haladhar.crop.checkDisease': 'रोग / कीट जांचें',

  // Weather
  'haladhar.weather.today': 'आज का मौसम',
  'haladhar.weather.forFarming': 'खेती के लिए',
  'haladhar.weather.suitableSpray': 'आज छिड़काव के लिए मौसम उपयुक्त है.',
  'haladhar.weather.notSuitableSpray': 'आज छिड़काव के लिए मौसम उपयुक्त नहीं है.',
  'haladhar.weather.tomorrowRain': 'कल बारिश की संभावना है.',

  // Water
  'haladhar.water.title': 'पानी',
  'haladhar.water.shouldIrrigate': 'आज पानी देना है क्या?',
  'haladhar.water.yes': 'हाँ',
  'haladhar.water.no': 'नहीं',
  'haladhar.water.soilMoist': 'जमीन में पर्याप्त नमी है.',
  'haladhar.water.rainExpected': 'कल बारिश की संभावना है.',
  'haladhar.water.checkTomorrow': 'कल फिर जांचें.',
  'haladhar.water.why': 'क्यों?',
  'haladhar.water.listen': 'सुनें',

  // Market
  'haladhar.market.title': 'मंडी भाव',
  'haladhar.market.perQuintal': '/ क्विंटल',
  'haladhar.market.nearbyMarkets': 'नजदीकी मंडियां',
  'haladhar.market.advice': 'KrishiMitra की सलाह',
  'haladhar.market.sellToday': '50% माल आज बेचना उपयुक्त.',
  'haladhar.market.wait': 'बिक्री के लिए थोड़ा इंतजार करें.',
  'haladhar.market.mandiBhav': 'आज का मंडी भाव',
  'haladhar.market.mandiBhavDesc': 'आसपास मंडी और बाजार भाव देखें',

  // Disease/Pest
  'haladhar.disease.title': 'रोग / कीट',
  'haladhar.disease.takePhoto': 'फसल की फोटो लें',
  'haladhar.disease.common': 'सामान्य रोग',
  'haladhar.disease.commonPests': 'सामान्य कीट',

  // Schemes
  'haladhar.schemes.title': 'सरकारी योजनाएं',
  'haladhar.schemes.viewInfo': 'जानकारी देखें',
  'haladhar.schemes.checkEligibility': 'पात्रता जांचें',

  // Education
  'haladhar.education.title': 'खेती सीखें',
  'haladhar.education.cropInfo': 'फसलों की जानकारी',
  'haladhar.education.waterSaving': 'पानी बचत',
  'haladhar.education.diseasePest': 'रोग और कीट',
  'haladhar.education.modern': 'आधुनिक खेती',
  'haladhar.education.marketInfo': 'बाजार की जानकारी',

  // Voice
  'haladhar.voice.speak': 'बोलें',
  'haladhar.voice.listening': 'सुन रहा है...',
  'haladhar.voice.thinking': 'सोच रहा है...',
  'haladhar.voice.tapToSpeak': 'बोलने के लिए टैप करें',

  // Profile
  'haladhar.profile.title': 'मेरी जानकारी',
  'haladhar.profile.name': 'नाम',
  'haladhar.profile.mobile': 'मोबाइल',
  'haladhar.profile.village': 'गांव',
  'haladhar.profile.taluka': 'तहसील',
  'haladhar.profile.district': 'जिला',
  'haladhar.profile.language': 'भाषा',
  'haladhar.profile.edit': 'जानकारी बदलें',
  'haladhar.profile.changeLanguage': 'भाषा बदलें',

  // Help
  'haladhar.help.title': 'मदद',
  'haladhar.help.faq': 'अक्सर पूछे जाने वाले सवाल',
  'haladhar.help.askHaladhar': 'KrishiMitra से पूछें',
  'haladhar.help.contact': 'संपर्क',
  'haladhar.help.about': 'KrishiMitra के बारे में',

  // Actions
  'haladhar.action.viewInfo': 'जानकारी देखें',
  'haladhar.action.check': 'जांचें',
  'haladhar.action.next': 'आगे बढ़ें',
  'haladhar.action.takePhoto': 'फोटो लें',
  'haladhar.action.speakAsk': 'बोलकर पूछें',
  'haladhar.action.moreInfo': 'अधिक जानकारी',

  // Alerts
  'haladhar.alert.important': 'महत्वपूर्ण सूचना',
  'haladhar.alert.avoidSpray': 'आज छिड़काव टालें',
  'haladhar.alert.rainSoon': 'अगले कुछ घंटों में बारिश की संभावना है.',

  // Offline
  'haladhar.offline.noInternet': 'इंटरनेट उपलब्ध नहीं है',
  'haladhar.offline.lastSaved': 'अंतिम सहेजा गया मौसम',
  'haladhar.offline.savedAdvice': 'अंतिम सलाह',
  'haladhar.offline.savedCrop': 'मेरी फसल की जानकारी',
  'haladhar.offline.savedEducation': 'सहेजी गई शिक्षा',

  // Status
  'haladhar.status.good': 'अच्छा',
  'haladhar.status.moderate': 'मध्यम',
  'haladhar.status.poor': 'खराब',
  'haladhar.status.suitable': 'उपयुक्त',
  'haladhar.status.notSuitable': 'उपयुक्त नहीं',
  // Assistant mode labels
  'haladhar.assist.chat': '💬 लिखकर पूछें',
  'haladhar.assist.voice': '🎤 बोलकर पूछें',
  'haladhar.assist.chatPlaceholder': 'अपना सवाल लिखें...',
  'haladhar.assist.voiceLabel': 'KrishiMitra से बोलकर पूछें',
  'haladhar.assist.chatLabel': 'KrishiMitra से चैट करें',
  'haladhar.assist.you': 'आप',
  // Location
  'haladhar.location.detecting': 'स्थान खोज रहे हैं...',
  'haladhar.location.unavailable': 'स्थान उपलब्ध नहीं',
  'haladhar.location.setManually': 'स्थान सेट करें',
  'haladhar.location.allow': 'स्थान की अनुमति दें',
  // Sign In
  'haladhar.signin.title': 'KrishiMitra में प्रवेश करें',
  'haladhar.signin.subtitle': 'खेती के हर कदम पर.',
  'haladhar.signin.aadhaarLabel': 'आधार नंबर',
  'haladhar.signin.aadhaarPlaceholder': 'XXXX XXXX XXXX',
  'haladhar.signin.consent': 'आधार आधारित प्रमाणीकरण के लिए आगे बढ़ने की मेरी सहमति है।',
  'haladhar.signin.continue': 'आगे बढ़ें',
  'haladhar.signin.orDivider': 'या',
  'haladhar.signin.guest': 'अतिथि के रूप में आगे बढ़ें',
  'haladhar.signin.security': 'आपकी जानकारी सुरक्षित रखी जाएगी।',
  'haladhar.signin.verifying': 'प्रमाणीकरण शुरू है...',
  'haladhar.signin.success': 'सफलतापूर्वक प्रवेश',
  'haladhar.signin.errorFormat': 'कृपया १२ अंकों का आधार नंबर दर्ज करें।',
  'haladhar.signin.errorAuth': 'प्रमाणीकरण पूरा नहीं हुआ। फिर से प्रयास करें।',
  'haladhar.signin.errorConsent': 'आगे बढ़ने के लिए सहमति दें।',
  'haladhar.signin.guestBadge': 'अतिथि',
  // Home v2
  'haladhar.home.greeting':      'नमस्कार किसान भाइयों और बहनों!',
  'haladhar.home.voiceCta':      'बोलकर पूछें',
  'haladhar.home.voiceListening':'सुन रहा है...',
  'haladhar.home.voicePrompt':   'अपना सवाल बोलिए...',
  'haladhar.home.voiceExamplesLabel': 'आप ऐसे पूछ सकते हैं:',
  'haladhar.home.voiceExample1': 'आज बारिश होगी क्या?',
  'haladhar.home.voiceExample2': 'कपास को पानी कब देना है?',
  'haladhar.home.voiceExample3': 'आज का मंडी भाव क्या है?',
  'haladhar.home.orType':        'या टाइप करें',
  'haladhar.home.todayInfo':     'आज की जानकारी',
  'haladhar.home.todayFor':      'आज आपके खेत के लिए',
  'haladhar.home.todayActions':  'आज क्या करें?',
  'haladhar.home.servicesLabel': 'सेवाएं',
  'haladhar.home.noContext':     'आज की जानकारी उपलब्ध नहीं है।',
  'haladhar.home.alertTitle':    'महत्वपूर्ण सूचना',
  'haladhar.home.weatherLabel':  'मौसम',
  'haladhar.home.waterLabel':    'पानी',
  'haladhar.home.cropLabel':     'फसल',
  'haladhar.home.marketLabel':   'मंडी',
  'haladhar.home.moreInfo':      'अधिक जानकारी',
  // Ask errors
  'ask.micPermissionDenied': 'माइक्रोफ़ोन अनुमति अस्वीकृत',
  'ask.voiceError': 'आवाज़ प्रसंस्करण में त्रुटि हुई',
};

// ---------------------------------------------------------------------------
// English
// ---------------------------------------------------------------------------
export const en: Record<HaladharTranslationKey, string> = {
  // Brand
  'haladhar.brand': 'KrishiMitra',
  'haladhar.tagline': 'With you at every step of farming.',

  // Labour & Machinery
  'haladhar.service.labour': 'Labour & Machinery',
  'haladhar.labour.title': 'Labour & Machinery',
  'haladhar.labour.subtitle': 'Find nearby farm labour and machinery',
  'haladhar.labour.tabAll': 'All',
  'haladhar.labour.tabLabour': 'Labour',
  'haladhar.labour.tabMachinery': 'Machinery',
  'haladhar.labour.tabRequirements': 'Requirements',
  'haladhar.labour.available': 'Available',
  'haladhar.labour.required': 'Required',
  'haladhar.labour.perDay': '/ day',
  'haladhar.labour.perHour': '/ hour',
  'haladhar.labour.contact': 'Contact',
  'haladhar.labour.postBtn': '+ Post Listing',
  'haladhar.labour.postTitle': 'New Listing',
  'haladhar.labour.postTypeLabel': 'Type',
  'haladhar.labour.postTypeLabour': 'Labour',
  'haladhar.labour.postTypeMachine': 'Machine',
  'haladhar.labour.postNameLabel': 'Name',
  'haladhar.labour.postNamePlaceholder': 'Your full name',
  'haladhar.labour.postPhoneLabel': 'Mobile',
  'haladhar.labour.postPhonePlaceholder': '10-digit number',
  'haladhar.labour.postDescLabel': 'Description',
  'haladhar.labour.postDescPlaceholder': 'Describe skills or machine details',
  'haladhar.labour.postRateLabel': 'Rate (₹)',
  'haladhar.labour.postRatePlaceholder': 'e.g. 350',
  'haladhar.labour.postSubmit': 'Publish Listing',
  'haladhar.labour.postCancel': 'Cancel',
  'haladhar.labour.postSuccess': 'Listing published successfully!',
  'haladhar.labour.km': 'km away',
  'haladhar.labour.verified': 'Verified',
  'haladhar.labour.noResults': 'No listings in this category',
  'haladhar.labour.postRequirement': 'Post Requirement',
  'haladhar.labour.requirementPosted': 'Requirement posted',
  'haladhar.labour.call': 'Call',
  'haladhar.labour.whatsapp': 'WhatsApp',

  // Navigation
  'haladhar.nav.home': 'Home',
  'haladhar.nav.myFarm': 'My Farm',
  'haladhar.nav.profile': 'Profile',
  'haladhar.nav.services': 'Services',
  'haladhar.nav.more': 'More',

  // Home
  'haladhar.home.location': 'Location',
  'haladhar.home.askHaladhar': 'Ask KrishiMitra...',
  'haladhar.home.askPlaceholder': 'Ask your question...',

  // Suggestions
  'haladhar.suggest.rain': 'Will it rain today?',
  'haladhar.suggest.irrigate': 'When should I irrigate?',
  'haladhar.suggest.marketPrice': "What is today's market price?",

  // Services
  'haladhar.service.weather': 'Weather',
  'haladhar.service.myCrop': 'My Crop',
  'haladhar.service.water': 'Water',
  'haladhar.service.market': 'Market Prices',
  'haladhar.service.disease': 'Disease / Pest',
  'haladhar.service.schemes': 'Government Schemes',
  'haladhar.service.education': 'Learn Farming',

  // My Farm
  'haladhar.farm.title': 'My Farm',
  'haladhar.farm.location': 'Location',
  'haladhar.farm.size': 'Area',
  'haladhar.farm.crop': 'Crop',
  'haladhar.farm.stage': 'Crop Stage',
  'haladhar.farm.irrigation': 'Water Supply',
  'haladhar.farm.cropInfo': 'Crop Info',
  'haladhar.farm.land': 'Land',
  'haladhar.farm.waterInfo': 'Water',
  'haladhar.farm.expenses': 'Expenses',

  // Crop
  'haladhar.crop.title': 'Crop',
  'haladhar.crop.status': 'Status',
  'haladhar.crop.statusGood': 'Good',
  'haladhar.crop.statusModerate': 'Moderate',
  'haladhar.crop.statusPoor': 'Poor',
  'haladhar.crop.stage': 'Crop Stage',
  'haladhar.crop.planted': 'Planted',
  'haladhar.crop.area': 'Area',
  'haladhar.crop.takePhoto': 'Take Crop Photo',
  'haladhar.crop.photoInstruction': 'Take a clear photo of leaf or affected area.',
  'haladhar.crop.checkDisease': 'Check Disease / Pest',

  // Weather
  'haladhar.weather.today': "Today's Weather",
  'haladhar.weather.forFarming': 'For Farming',
  'haladhar.weather.suitableSpray': 'Weather is suitable for spraying today.',
  'haladhar.weather.notSuitableSpray': 'Weather is not suitable for spraying today.',
  'haladhar.weather.tomorrowRain': 'Rain expected tomorrow.',

  // Water
  'haladhar.water.title': 'Water',
  'haladhar.water.shouldIrrigate': 'Should I irrigate today?',
  'haladhar.water.yes': 'Yes',
  'haladhar.water.no': 'No',
  'haladhar.water.soilMoist': 'Soil has sufficient moisture.',
  'haladhar.water.rainExpected': 'Rain expected tomorrow.',
  'haladhar.water.checkTomorrow': 'Check again tomorrow.',
  'haladhar.water.why': 'Why?',
  'haladhar.water.listen': 'Listen',

  // Market
  'haladhar.market.title': 'Market Prices',
  'haladhar.market.perQuintal': '/ quintal',
  'haladhar.market.nearbyMarkets': 'Nearby Markets',
  'haladhar.market.advice': "KrishiMitra's Advice",
  'haladhar.market.sellToday': 'Selling 50% produce today is suitable.',
  'haladhar.market.wait': 'Wait a bit for selling.',
  'haladhar.market.mandiBhav': "Today's Mandi Prices",
  'haladhar.market.mandiBhavDesc': 'View nearby mandi and market prices',

  // Disease/Pest
  'haladhar.disease.title': 'Disease / Pest',
  'haladhar.disease.takePhoto': 'Take Crop Photo',
  'haladhar.disease.common': 'Common Diseases',
  'haladhar.disease.commonPests': 'Common Pests',

  // Schemes
  'haladhar.schemes.title': 'Government Schemes',
  'haladhar.schemes.viewInfo': 'View Info',
  'haladhar.schemes.checkEligibility': 'Check Eligibility',

  // Education
  'haladhar.education.title': 'Learn Farming',
  'haladhar.education.cropInfo': 'Crop Information',
  'haladhar.education.waterSaving': 'Water Saving',
  'haladhar.education.diseasePest': 'Disease and Pests',
  'haladhar.education.modern': 'Modern Farming',
  'haladhar.education.marketInfo': 'Market Information',

  // Voice
  'haladhar.voice.speak': 'Speak',
  'haladhar.voice.listening': 'Listening...',
  'haladhar.voice.thinking': 'Thinking...',
  'haladhar.voice.tapToSpeak': 'Tap to speak',

  // Profile
  'haladhar.profile.title': 'My Information',
  'haladhar.profile.name': 'Name',
  'haladhar.profile.mobile': 'Mobile',
  'haladhar.profile.village': 'Village',
  'haladhar.profile.taluka': 'Taluka',
  'haladhar.profile.district': 'District',
  'haladhar.profile.language': 'Language',
  'haladhar.profile.edit': 'Edit Info',
  'haladhar.profile.changeLanguage': 'Change Language',

  // Help
  'haladhar.help.title': 'Help',
  'haladhar.help.faq': 'Frequently Asked Questions',
  'haladhar.help.askHaladhar': 'Ask KrishiMitra',
  'haladhar.help.contact': 'Contact',
  'haladhar.help.about': 'About KrishiMitra',

  // Actions
  'haladhar.action.viewInfo': 'View Info',
  'haladhar.action.check': 'Check',
  'haladhar.action.next': 'Next',
  'haladhar.action.takePhoto': 'Take Photo',
  'haladhar.action.speakAsk': 'Ask by Speaking',
  'haladhar.action.moreInfo': 'More Info',

  // Alerts
  'haladhar.alert.important': 'Important Notice',
  'haladhar.alert.avoidSpray': 'Avoid spraying today',
  'haladhar.alert.rainSoon': 'Rain expected in next few hours.',

  // Offline
  'haladhar.offline.noInternet': 'No Internet Available',
  'haladhar.offline.lastSaved': 'Last Saved Weather',
  'haladhar.offline.savedAdvice': 'Last Advice',
  'haladhar.offline.savedCrop': 'My Crop Information',
  'haladhar.offline.savedEducation': 'Saved Education',

  // Status
  'haladhar.status.good': 'Good',
  'haladhar.status.moderate': 'Moderate',
  'haladhar.status.poor': 'Poor',
  'haladhar.status.suitable': 'Suitable',
  'haladhar.status.notSuitable': 'Not Suitable',
  // Assistant mode labels
  'haladhar.assist.chat': '💬 Type your question',
  'haladhar.assist.voice': '🎤 Speak your question',
  'haladhar.assist.chatPlaceholder': 'Write your question...',
  'haladhar.assist.voiceLabel': 'Talk to KrishiMitra',
  'haladhar.assist.chatLabel': 'Chat with KrishiMitra',
  'haladhar.assist.you': 'You',
  // Location
  'haladhar.location.detecting': 'Detecting location...',
  'haladhar.location.unavailable': 'Location unavailable',
  'haladhar.location.setManually': 'Set location',
  'haladhar.location.allow': 'Allow location',
  // Sign In
  'haladhar.signin.title': 'Sign in to KrishiMitra',
  'haladhar.signin.subtitle': 'With you at every step of farming.',
  'haladhar.signin.aadhaarLabel': 'Aadhaar Number',
  'haladhar.signin.aadhaarPlaceholder': 'XXXX XXXX XXXX',
  'haladhar.signin.consent': 'I consent to proceed with Aadhaar-based authentication.',
  'haladhar.signin.continue': 'Continue',
  'haladhar.signin.orDivider': 'OR',
  'haladhar.signin.guest': 'Continue as Guest',
  'haladhar.signin.security': 'Your information will be kept secure.',
  'haladhar.signin.verifying': 'Verifying...',
  'haladhar.signin.success': 'Signed in successfully',
  'haladhar.signin.errorFormat': 'Please enter a valid 12-digit Aadhaar number.',
  'haladhar.signin.errorAuth': 'Authentication could not be completed. Please try again.',
  'haladhar.signin.errorConsent': 'Please provide consent to continue.',
  'haladhar.signin.guestBadge': 'Guest',
  // Home v2
  'haladhar.home.greeting':      'Namaste, farmer friends!',
  'haladhar.home.voiceCta':      'Speak to KrishiMitra',
  'haladhar.home.voiceListening':'Listening...',
  'haladhar.home.voicePrompt':   'Ask your question...',
  'haladhar.home.voiceExamplesLabel': 'You can ask things like:',
  'haladhar.home.voiceExample1': 'Will it rain today?',
  'haladhar.home.voiceExample2': 'When to water cotton?',
  'haladhar.home.voiceExample3': 'What is today\'s market price?',
  'haladhar.home.orType':        'or type your question',
  'haladhar.home.todayInfo':     'Today\'s Information',
  'haladhar.home.todayFor':      'For your farm today',
  'haladhar.home.todayActions':  'What to do today?',
  'haladhar.home.servicesLabel': 'Services',
  'haladhar.home.noContext':     'Today\'s information is unavailable.',
  'haladhar.home.alertTitle':    'Important Alert',
  'haladhar.home.weatherLabel':  'Weather',
  'haladhar.home.waterLabel':    'Water',
  'haladhar.home.cropLabel':     'Crop',
  'haladhar.home.marketLabel':   'Market',
  'haladhar.home.moreInfo':      'More info',
  // Ask errors
  'ask.micPermissionDenied': 'Microphone permission denied',
  'ask.voiceError': 'Voice processing error occurred',
};

// Export combined translations by language
export const haladharTranslations = {
  mr,
  hi,
  en,
};

// Hook to use HALADHAR translations
export function useHaladharTranslation() {
  const language = (localStorage.getItem('language') || 'mr') as Language;
  
  const ht = (key: HaladharTranslationKey): string => {
    return haladharTranslations[language][key] || key;
  };
  
  return { ht, language };
}
