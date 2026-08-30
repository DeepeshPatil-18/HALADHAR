// ---------------------------------------------------------------------------
// Complete Translation Dictionaries - All 150+ Keys
// English, Hindi, and Marathi
// ---------------------------------------------------------------------------

export type TranslationKey =
  // App
  | 'app.title' | 'app.subtitle' | 'app.attribution' | 'app.tagline'
  // Navigation & Bottom Nav
  | 'nav.home' | 'nav.schemes' | 'nav.community' | 'nav.ask' | 'nav.bazaar' | 'nav.help'
  | 'nav.weather' | 'nav.market' | 'nav.chat'
  // Language picker
  | 'lang.choose' | 'lang.english' | 'lang.hindi' | 'lang.marathi' | 'lang.changeLanguage'
  // Home screen
  | 'home.title' | 'home.subtitle' | 'home.greeting' | 'home.greetingSubtitle'
  | 'home.whatsAroundMe' | 'home.whatsAroundMeDesc'
  | 'home.schemesTraining' | 'home.schemesTrainingDesc'
  | 'home.community' | 'home.communityDesc'
  | 'home.askKrishiMitra' | 'home.askKrishiMitraDesc'
  | 'home.forYou' | 'home.seeAll' | 'home.mainServices' | 'home.speakQuestion'
  // Header
  | 'header.title' | 'header.changeLanguage'
  // Auth
  | 'auth.signIn' | 'auth.signUp' | 'auth.email' | 'auth.password'
  | 'auth.continue' | 'auth.signOut' | 'auth.createAccount' | 'auth.alreadyHaveAccount'
  | 'auth.forgotPassword' | 'auth.signingIn' | 'auth.signingUp' | 'auth.error'
  | 'auth.signInError' | 'auth.signUpError' | 'auth.noAccount' | 'auth.hasAccount'
  | 'auth.passwordHint'
  // Profile
  | 'profile.title' | 'profile.fullName' | 'profile.phone' | 'profile.state'
  | 'profile.district' | 'profile.taluka' | 'profile.village' | 'profile.enterpriseType'
  | 'profile.primaryCrop' | 'profile.language' | 'profile.save' | 'profile.edit'
  | 'profile.gpsGranted' | 'profile.gpsDenied' | 'profile.gpsRequest'
  | 'profile.selectState' | 'profile.selectDistrict' | 'profile.selectEnterprise'
  | 'profile.saved' | 'profile.error'
  // Enterprise types
  | 'enterprise.poultry' | 'enterprise.fisheries' | 'enterprise.apiculture'
  | 'enterprise.mushroom' | 'enterprise.vermicompost' | 'enterprise.dairy' | 'enterprise.goat'
  // Weather
  | 'weather.title' | 'weather.temperature' | 'weather.humidity' | 'weather.precipitation'
  | 'weather.windSpeed' | 'weather.condition' | 'weather.lastUpdated' | 'weather.unavailable'
  | 'weather.loading' | 'weather.retry' | 'weather.rainWhenQuestion' | 'weather.noRainExpected'
  | 'weather.nextRainExpected' | 'weather.approximately' | 'weather.probability'
  | 'weather.forecastDays' | 'weather.alerts' | 'weather.noAlerts' | 'weather.advisory'
  | 'weather.updateFrequency'
  // Weather - Days
  | 'day.today' | 'day.tomorrow' | 'day.sunday' | 'day.monday' | 'day.tuesday'
  | 'day.wednesday' | 'day.thursday' | 'day.friday' | 'day.saturday'
  // Weather - Months
  | 'month.january' | 'month.february' | 'month.march' | 'month.april'
  | 'month.may' | 'month.june' | 'month.july' | 'month.august'
  | 'month.september' | 'month.october' | 'month.november' | 'month.december'
  // Weather - Short Months
  | 'shortMonth.jan' | 'shortMonth.feb' | 'shortMonth.mar' | 'shortMonth.apr'
  | 'shortMonth.may' | 'shortMonth.jun' | 'shortMonth.jul' | 'shortMonth.aug'
  | 'shortMonth.sep' | 'shortMonth.oct' | 'shortMonth.nov' | 'shortMonth.dec'
  // Mandi prices
  | 'mandi.title' | 'mandi.crop' | 'mandi.location' | 'mandi.minPrice' | 'mandi.maxPrice'
  | 'mandi.modalPrice' | 'mandi.mandiName' | 'mandi.lastUpdated' | 'mandi.unavailable'
  | 'mandi.loading' | 'mandi.retry' | 'mandi.perQuintal' | 'mandi.selectCrop'
  | 'mandi.search' | 'mandi.searchPlaceholder' | 'mandi.backToFeed' | 'mandi.searching'
  | 'mandi.noResults' | 'mandi.todayRates' | 'mandi.latestUpdates'
  // Schemes & Help
  | 'help.title' | 'help.subtitle' | 'help.subsidySchemes' | 'help.governmentSchemes'
  | 'help.contactUs' | 'help.kisanCallCenter' | 'help.callCenter' | 'help.freeService'
  | 'help.disclaimer' | 'help.disclaimerText' | 'help.viewAllSchemes'
  | 'schemes.title' | 'schemes.recommended' | 'schemes.eligibility' | 'schemes.benefits'
  | 'schemes.documents' | 'schemes.process' | 'schemes.applyNow' | 'schemes.sourceUrl'
  | 'schemes.loading' | 'schemes.noSchemes' | 'schemes.cachedNotice' | 'schemes.viewDetails'
  | 'schemes.whatHelp' | 'schemes.whoEligible' | 'schemes.requiredDocs' | 'schemes.howToApply'
  | 'schemes.deadline' | 'schemes.info' | 'schemes.warning'
  | 'schemes.applyButton' | 'schemes.statusButton'
  // Training
  | 'training.title' | 'training.filterLanguage' | 'training.filterEnterprise'
  | 'training.duration' | 'training.viewSource' | 'training.loading' | 'training.noTraining'
  | 'training.cachedNotice' | 'training.language'
  // Market Linkage
  | 'market.title' | 'market.myListings' | 'market.postListing' | 'market.product'
  | 'market.quantity' | 'market.unit' | 'market.quality' | 'market.expectedPrice'
  | 'market.availableFrom' | 'market.pickupDelivery' | 'market.uploadPhoto'
  | 'market.submit' | 'market.potentialBuyers' | 'market.contactBuyer'
  | 'market.sellViaeNAM' | 'market.noListings' | 'market.listingCreated'
  | 'market.pickup' | 'market.delivery' | 'market.both'
  | 'market.sellHeading' | 'market.sellDescription' | 'market.nearestLocations'
  | 'market.locationsFound' | 'market.sellToGovt' | 'market.govDescription'
  | 'market.sellToOrganizations' | 'market.orgDescription' | 'market.comingSoon'
  | 'market.dataSource' | 'market.poweredBy' | 'market.noNearbyLocations'
  | 'market.newSearch' | 'market.sellOptions'
  // Allied Farming / Bazaar
  | 'bazaar.title' | 'bazaar.subtitle' | 'bazaar.seePrices' | 'bazaar.seePricesDesc'
  | 'bazaar.sell' | 'bazaar.sellDesc' | 'bazaar.tip' | 'bazaar.tipText'
  | 'allied.title' | 'allied.subtitle' | 'allied.experimental' | 'allied.experimentalText'
  | 'allied.searchPlaceholder' | 'allied.search' | 'allied.quickFilters'
  | 'allied.popular' | 'allied.commonActivities' | 'allied.allProducts'
  | 'allied.filterLabel' | 'allied.productCount' | 'allied.noProducts'
  | 'allied.tryDifferentSearch' | 'allied.clearFilters' | 'allied.categories'
  | 'allied.visitEnam'
  // Community
  | 'community.title' | 'community.joinGroup' | 'community.askExpert'
  | 'community.noGroups' | 'community.kisanCallCentre' | 'community.whatsappGroups'
  | 'community.connect' | 'community.training' | 'community.guides' | 'community.communities'
  | 'community.upcomingEvents' | 'community.upcomingDescription'
  | 'community.sampleBadge' | 'community.alliedFarmingGuides' | 'community.guideDescription'
  | 'community.communityTitle' | 'community.communityDescription'
  | 'community.sampleLink' | 'community.joinBeforeEntering' | 'community.tip'
  // Events & Details
  | 'event.notFound' | 'event.back' | 'event.details' | 'event.whatYouLearn'
  | 'event.whoCanAttend' | 'event.registration' | 'event.contact' | 'event.note'
  | 'event.sampleData' | 'event.disclaimer'
  // Guides
  | 'guide.notFound' | 'guide.back' | 'guide.gettingStarted'
  | 'guide.requirements' | 'guide.setup' | 'guide.equipment' | 'guide.beginnerSteps'
  | 'guide.marketAndPrice' | 'guide.whereToSell' | 'guide.mandiIntegration'
  | 'guide.govSupport' | 'guide.schemesAvailable' | 'guide.contactLocal'
  | 'guide.trainingPrograms' | 'guide.upcomingTraining' | 'guide.viewPrograms'
  // AI Assistant / Chat
  | 'ask.title' | 'ask.listening' | 'ask.thinking' | 'ask.listen'
  | 'ask.poweredByKisanSLM' | 'ask.poweredBySarvam' | 'ask.usingBrowserSpeech'
  | 'ask.placeholder' | 'ask.send' | 'ask.fallbackLabel' | 'ask.micPermissionDenied'
  | 'ask.voiceError' | 'ask.greetingTitle' | 'ask.greetingSubtitle'
  | 'ask.switchToText' | 'ask.switchToVoice' | 'ask.you' | 'ask.assistant'
  | 'ask.playAudio'
  // Business Planner
  | 'planner.title' | 'planner.flockSize' | 'planner.feedCost' | 'planner.expectedYield'
  | 'planner.marketPrice' | 'planner.cyclesPerYear' | 'planner.totalCost'
  | 'planner.grossRevenue' | 'planner.netProfit' | 'planner.profitMargin'
  | 'planner.roi' | 'planner.breakEven' | 'planner.calculate'
  | 'planner.perUnit' | 'planner.perCycle' | 'planner.narrative'
  // General / offline / errors
  | 'general.loading' | 'general.retry' | 'general.error' | 'general.success'
  | 'general.cancel' | 'general.confirm' | 'general.back' | 'general.next'
  | 'general.refresh' | 'general.noData' | 'general.noDataDescription'
  | 'offline.banner' | 'offline.unavailable'
  | 'error.sessionExpired' | 'error.networkError' | 'error.unknown' | 'error.dataUnavailable';

// ---------------------------------------------------------------------------
// English strings
// ---------------------------------------------------------------------------
const en: Record<TranslationKey, string> = {
  // App
  'app.title': 'KrishiMitra',
  'app.subtitle': 'Team Airavata',
  'app.attribution': 'Agriculture Assistant Platform',
  'app.tagline': 'Empowering farmers with knowledge',

  // Navigation
  'nav.home': 'Home',
  'nav.schemes': 'Schemes',
  'nav.community': 'Community',
  'nav.ask': 'Ask KrishiMitra',
  'nav.bazaar': 'Bazaar',
  'nav.help': 'Help',
  'nav.weather': 'Weather',
  'nav.market': 'Market',
  'nav.chat': 'Chat',

  // Language picker
  'lang.choose': 'Choose your language',
  'lang.english': 'English',
  'lang.hindi': 'हिंदी',
  'lang.marathi': 'मराठी',
  'lang.changeLanguage': 'Change language',

  // Home screen
  'home.title': 'KrishiMitra',
  'home.subtitle': 'Your agricultural advisor',
  'home.greeting': 'नमस्ते, किसान!',
  'home.greetingSubtitle': 'Welcome to your agricultural companion',
  'home.whatsAroundMe': "What's Around Me",
  'home.whatsAroundMeDesc': 'Weather, mandi prices & local needs',
  'home.schemesTraining': 'Schemes & Training',
  'home.schemesTrainingDesc': 'Government schemes and learning resources',
  'home.community': 'Community',
  'home.communityDesc': 'Connect with farmers and experts',
  'home.askKrishiMitra': 'Ask KrishiMitra',
  'home.askKrishiMitraDesc': 'Voice-first AI agricultural advisor',
  'home.forYou': 'For You',
  'home.seeAll': 'See all',
  'home.mainServices': 'Main Services',
  'home.speakQuestion': 'Speak your question',

  // Header
  'header.title': 'KrishiMitra',
  'header.changeLanguage': 'Language',

  // Auth
  'auth.signIn': 'Sign In',
  'auth.signUp': 'Sign Up',
  'auth.email': 'Email address',
  'auth.password': 'Password',
  'auth.continue': 'Continue',
  'auth.signOut': 'Sign Out',
  'auth.createAccount': 'Create account',
  'auth.alreadyHaveAccount': 'Already have an account? Sign in',
  'auth.forgotPassword': 'Forgot password?',
  'auth.signingIn': 'Signing in…',
  'auth.signingUp': 'Creating account…',
  'auth.error': 'Authentication failed. Please check your credentials.',
  'auth.signInError': 'Sign-in failed. Please check your credentials.',
  'auth.signUpError': 'Sign-up failed. Please try again.',
  'auth.noAccount': "Don't have an account?",
  'auth.hasAccount': 'Already have an account?',
  'auth.passwordHint': 'Minimum 6 characters',

  // Profile
  'profile.title': 'My Profile',
  'profile.fullName': 'Full name',
  'profile.phone': 'Phone number',
  'profile.state': 'State',
  'profile.district': 'District',
  'profile.taluka': 'Taluka / Block',
  'profile.village': 'Village',
  'profile.enterpriseType': 'Enterprise type',
  'profile.primaryCrop': 'Primary crop',
  'profile.language': 'Preferred language',
  'profile.save': 'Save profile',
  'profile.edit': 'Edit profile',
  'profile.gpsGranted': 'Location access granted',
  'profile.gpsDenied': 'Location access denied — using entered address',
  'profile.gpsRequest': 'Allow location access for better results',
  'profile.selectState': 'Select state',
  'profile.selectDistrict': 'Select district',
  'profile.selectEnterprise': 'Select enterprise type',
  'profile.saved': 'Profile saved successfully',
  'profile.error': 'Failed to save profile. Please try again.',

  // Enterprise types
  'enterprise.poultry': 'Poultry',
  'enterprise.fisheries': 'Fisheries',
  'enterprise.apiculture': 'Apiculture (Beekeeping)',
  'enterprise.mushroom': 'Mushroom Cultivation',
  'enterprise.vermicompost': 'Vermicomposting',
  'enterprise.dairy': 'Dairy',
  'enterprise.goat': 'Goat Rearing',

  // Weather
  'weather.title': 'Current Weather',
  'weather.temperature': 'Temperature',
  'weather.humidity': 'Humidity',
  'weather.precipitation': 'Precipitation probability',
  'weather.windSpeed': 'Wind speed',
  'weather.condition': 'Condition',
  'weather.lastUpdated': 'Last updated',
  'weather.unavailable': 'Weather data unavailable',
  'weather.loading': 'Loading weather…',
  'weather.retry': 'Retry',
  'weather.rainWhenQuestion': 'When will it rain?',
  'weather.noRainExpected': 'No rain expected in the next 7 days',
  'weather.nextRainExpected': 'Next rain expected',
  'weather.approximately': 'approximately',
  'weather.probability': 'Probability',
  'weather.forecastDays': '7-day forecast',
  'weather.alerts': 'Weather alerts',
  'weather.noAlerts': 'No active weather alerts',
  'weather.advisory': 'Advisory',
  'weather.updateFrequency': 'Updated every 3 hours',

  // Days of week
  'day.today': 'Today',
  'day.tomorrow': 'Tomorrow',
  'day.sunday': 'Sunday',
  'day.monday': 'Monday',
  'day.tuesday': 'Tuesday',
  'day.wednesday': 'Wednesday',
  'day.thursday': 'Thursday',
  'day.friday': 'Friday',
  'day.saturday': 'Saturday',

  // Months
  'month.january': 'January',
  'month.february': 'February',
  'month.march': 'March',
  'month.april': 'April',
  'month.may': 'May',
  'month.june': 'June',
  'month.july': 'July',
  'month.august': 'August',
  'month.september': 'September',
  'month.october': 'October',
  'month.november': 'November',
  'month.december': 'December',

  // Short months
  'shortMonth.jan': 'Jan',
  'shortMonth.feb': 'Feb',
  'shortMonth.mar': 'Mar',
  'shortMonth.apr': 'Apr',
  'shortMonth.may': 'May',
  'shortMonth.jun': 'Jun',
  'shortMonth.jul': 'Jul',
  'shortMonth.aug': 'Aug',
  'shortMonth.sep': 'Sep',
  'shortMonth.oct': 'Oct',
  'shortMonth.nov': 'Nov',
  'shortMonth.dec': 'Dec',

  // Mandi prices
  'mandi.title': 'Mandi Prices',
  'mandi.crop': 'Crop',
  'mandi.location': 'Location',
  'mandi.minPrice': 'Minimum price',
  'mandi.maxPrice': 'Maximum price',
  'mandi.modalPrice': 'Modal price',
  'mandi.mandiName': 'Mandi name',
  'mandi.lastUpdated': 'Last updated',
  'mandi.unavailable': 'Price data unavailable',
  'mandi.loading': 'Loading prices…',
  'mandi.retry': 'Retry',
  'mandi.perQuintal': '₹/quintal',
  'mandi.selectCrop': 'Select crop',
  'mandi.search': 'Search markets',
  'mandi.searchPlaceholder': 'Search by crop or market name',
  'mandi.backToFeed': 'Back to feed',
  'mandi.searching': 'Searching markets…',
  'mandi.noResults': 'No markets found for this crop',
  'mandi.todayRates': "Today's rates",
  'mandi.latestUpdates': 'Latest updates',

  // Schemes & Help
  'help.title': 'Help & Support',
  'help.subtitle': 'Government schemes and assistance',
  'help.subsidySchemes': 'Subsidy Schemes',
  'help.governmentSchemes': 'Government Schemes Available',
  'help.contactUs': 'Contact Us',
  'help.kisanCallCenter': 'Kisan Call Centre',
  'help.callCenter': 'Call Centre: 1800-180-1551 (Toll-free)',
  'help.freeService': 'Free agricultural advisory service',
  'help.disclaimer': 'Disclaimer',
  'help.disclaimerText': 'Information provided is for guidance purposes. Always verify with official sources.',
  'help.viewAllSchemes': 'View all schemes',

  // Schemes
  'schemes.title': 'Government Schemes',
  'schemes.recommended': 'Recommended for you',
  'schemes.eligibility': 'Eligibility',
  'schemes.benefits': 'Benefits',
  'schemes.documents': 'Documents required',
  'schemes.process': 'Application process',
  'schemes.applyNow': 'Apply now',
  'schemes.sourceUrl': 'Source',
  'schemes.loading': 'Loading schemes…',
  'schemes.noSchemes': 'No schemes found for your profile',
  'schemes.cachedNotice': 'Last updated',
  'schemes.viewDetails': 'View details',
  'schemes.whatHelp': 'What does this scheme provide?',
  'schemes.whoEligible': 'Who is eligible?',
  'schemes.requiredDocs': 'Required documents',
  'schemes.howToApply': 'How to apply',
  'schemes.deadline': 'Application deadline',
  'schemes.info': 'Information',
  'schemes.warning': 'Important note',
  'schemes.applyButton': 'Apply for this scheme',
  'schemes.statusButton': 'Check application status',

  // Training
  'training.title': 'Training Resources',
  'training.filterLanguage': 'Filter by language',
  'training.filterEnterprise': 'Filter by enterprise',
  'training.duration': 'Duration',
  'training.viewSource': 'View source',
  'training.loading': 'Loading training resources…',
  'training.noTraining': 'No training resources found',
  'training.cachedNotice': 'Last updated',
  'training.language': 'Language',

  // Market Linkage
  'market.title': 'Market Linkage',
  'market.myListings': 'My listings',
  'market.postListing': 'Post new listing',
  'market.product': 'Product',
  'market.quantity': 'Quantity',
  'market.unit': 'Unit',
  'market.quality': 'Quality / grade',
  'market.expectedPrice': 'Expected price (₹)',
  'market.availableFrom': 'Available from',
  'market.pickupDelivery': 'Pickup / delivery',
  'market.uploadPhoto': 'Upload photo (optional)',
  'market.submit': 'Submit listing',
  'market.potentialBuyers': 'potential buyers found',
  'market.contactBuyer': 'Contact buyer',
  'market.sellViaeNAM': 'Sell via e-NAM',
  'market.noListings': 'No listings yet',
  'market.listingCreated': 'Listing created successfully',
  'market.pickup': 'Pickup',
  'market.delivery': 'Delivery',
  'market.both': 'Both',
  'market.sellHeading': 'Sell Your Produce',
  'market.sellDescription': 'Connect with buyers directly and get better prices',
  'market.nearestLocations': 'Nearest selling locations',
  'market.locationsFound': 'locations found',
  'market.sellToGovt': 'Sell to Government',
  'market.govDescription': 'Participate in government procurement schemes',
  'market.sellToOrganizations': 'Sell to Organizations',
  'market.orgDescription': 'Supply to bulk buyers and organizations',
  'market.comingSoon': 'Coming soon',
  'market.dataSource': 'Data source',
  'market.poweredBy': 'Powered by Agricultural Markets',
  'market.noNearbyLocations': 'No nearby locations found',
  'market.newSearch': 'Try a new search',
  'market.sellOptions': 'Different ways to sell',

  // Bazaar
  'bazaar.title': 'Bazaar',
  'bazaar.subtitle': 'Market prices and selling opportunities',
  'bazaar.seePrices': 'See Prices',
  'bazaar.seePricesDesc': 'View current mandi and market rates',
  'bazaar.sell': 'Sell Produce',
  'bazaar.sellDesc': 'Connect with buyers and get better prices',
  'bazaar.tip': 'Tip',
  'bazaar.tipText': 'Check prices daily for the best selling opportunity',

  // Allied Farming
  'allied.title': 'Allied Farming Hub',
  'allied.subtitle': 'Poultry, dairy, fisheries, and more',
  'allied.experimental': 'Experimental',
  'allied.experimentalText': 'This section includes experimental features',
  'allied.searchPlaceholder': 'Search for products, practices, or markets',
  'allied.search': 'Search',
  'allied.quickFilters': 'Quick filters',
  'allied.popular': 'Popular',
  'allied.commonActivities': 'Common Activities',
  'allied.allProducts': 'All Products',
  'allied.filterLabel': 'Filter by',
  'allied.productCount': 'products',
  'allied.noProducts': 'No products found',
  'allied.tryDifferentSearch': 'Try a different search',
  'allied.clearFilters': 'Clear filters',
  'allied.categories': 'Categories',
  'allied.visitEnam': 'Visit e-NAM marketplace',

  // Community
  'community.title': 'Community',
  'community.joinGroup': 'Join group',
  'community.askExpert': 'Ask an Expert',
  'community.noGroups': 'No groups found for your area',
  'community.kisanCallCentre': 'Kisan Call Centre: 1800-180-1551',
  'community.whatsappGroups': 'WhatsApp Groups',
  'community.connect': 'Connect with Farmers',
  'community.training': 'Training Programs',
  'community.guides': 'Guides & Practices',
  'community.communities': 'Local Communities',
  'community.upcomingEvents': 'Upcoming Events',
  'community.upcomingDescription': 'Join farming events in your area',
  'community.sampleBadge': 'Featured',
  'community.alliedFarmingGuides': 'Allied Farming Guides',
  'community.guideDescription': 'Learn practices for poultry, dairy, and more',
  'community.communityTitle': 'Local Farming Communities',
  'community.communityDescription': 'Connect with farmers near you',
  'community.sampleLink': 'Join community',
  'community.joinBeforeEntering': 'Join a community to participate',
  'community.tip': 'Tip: Active participation helps you learn faster',

  // Events & Details
  'event.notFound': 'Event not found',
  'event.back': 'Back to events',
  'event.details': 'Event Details',
  'event.whatYouLearn': 'What you will learn',
  'event.whoCanAttend': 'Who can attend',
  'event.registration': 'Registration',
  'event.contact': 'Contact information',
  'event.note': 'Note',
  'event.sampleData': 'Sample event data',
  'event.disclaimer': 'Please verify details with event organizers',

  // Guides
  'guide.notFound': 'Guide not found',
  'guide.back': 'Back to guides',
  'guide.gettingStarted': 'Getting Started',
  'guide.requirements': 'Requirements',
  'guide.setup': 'Setup & Installation',
  'guide.equipment': 'Equipment & Tools Needed',
  'guide.beginnerSteps': 'Beginner Steps',
  'guide.marketAndPrice': 'Market & Pricing',
  'guide.whereToSell': 'Where to sell your produce',
  'guide.mandiIntegration': 'Mandi integration for direct sales',
  'guide.govSupport': 'Government Support',
  'guide.schemesAvailable': 'Schemes available for this enterprise',
  'guide.contactLocal': 'Contact your local agricultural office',
  'guide.trainingPrograms': 'Training Programs',
  'guide.upcomingTraining': 'Upcoming training near you',
  'guide.viewPrograms': 'View available programs',

  // AI Assistant / Chat
  'ask.title': 'Ask KrishiMitra',
  'ask.listening': 'Listening…',
  'ask.thinking': 'KisanSLM is thinking…',
  'ask.listen': '🔊 Listen',
  'ask.poweredByKisanSLM': 'Powered by KisanSLM',
  'ask.poweredBySarvam': 'Powered by Sarvam AI',
  'ask.usingBrowserSpeech': 'Using browser speech',
  'ask.placeholder': 'Type or speak your question…',
  'ask.send': 'Send',
  'ask.fallbackLabel': 'Curated Answer',
  'ask.micPermissionDenied': 'Microphone permission denied. Please enable it in browser settings.',
  'ask.voiceError': 'Voice recognition failed. Please try again or type your question.',
  'ask.greetingTitle': 'Hello! I am KrishiMitra',
  'ask.greetingSubtitle': 'Your personal farming assistant. Ask me anything about agriculture.',
  'ask.switchToText': 'Switch to text',
  'ask.switchToVoice': 'Switch to voice',
  'ask.you': 'You',
  'ask.assistant': 'KrishiMitra',
  'ask.playAudio': '▶ Play audio',

  // Business Planner
  'planner.title': 'Business Planner',
  'planner.flockSize': 'Flock / herd size',
  'planner.feedCost': 'Feed cost per unit (₹)',
  'planner.expectedYield': 'Expected yield per cycle',
  'planner.marketPrice': 'Market price per unit (₹)',
  'planner.cyclesPerYear': 'Cycles per year',
  'planner.totalCost': 'Total cost',
  'planner.grossRevenue': 'Gross revenue',
  'planner.netProfit': 'Net profit',
  'planner.profitMargin': 'Profit margin',
  'planner.roi': 'Return on investment',
  'planner.breakEven': 'Break-even units',
  'planner.calculate': 'Calculate',
  'planner.perUnit': 'per unit',
  'planner.perCycle': 'per cycle',
  'planner.narrative': 'KisanSLM Advisory',

  // General / offline / errors
  'general.loading': 'Loading…',
  'general.retry': 'Retry',
  'general.error': 'An error occurred',
  'general.success': 'Success',
  'general.cancel': 'Cancel',
  'general.confirm': 'Confirm',
  'general.back': 'Back',
  'general.next': 'Next',
  'general.refresh': 'Refresh',
  'general.noData': 'No data available',
  'general.noDataDescription': 'Try checking back later or refresh the page',
  'offline.banner': 'You are offline. Some features are unavailable.',
  'offline.unavailable': 'Unavailable offline',
  'error.sessionExpired': 'Your session has expired. Please sign in again.',
  'error.networkError': 'Network error. Please check your connection.',
  'error.unknown': 'An unknown error occurred. Please try again.',
  'error.dataUnavailable': 'Data is currently unavailable. Please try again later.',
};

// ---------------------------------------------------------------------------
// Hindi strings (Devanagari)
// ---------------------------------------------------------------------------
const hi: Record<TranslationKey, string> = {
  // App
  'app.title': 'कृषिमित्र',
  'app.subtitle': 'Team Airavata',
  'app.attribution': 'कृषि सहायक मंच',
  'app.tagline': 'किसानों को ज्ञान देकर सशक्त करें',

  // Navigation
  'nav.home': 'होम',
  'nav.schemes': 'योजनाएँ',
  'nav.community': 'समुदाय',
  'nav.ask': 'कृषिमित्र से पूछें',
  'nav.bazaar': 'बाज़ार',
  'nav.help': 'मदद',
  'nav.weather': 'मौसम',
  'nav.market': 'बाज़ार',
  'nav.chat': 'बातचीत',

  // Language picker
  'lang.choose': 'अपनी भाषा चुनें',
  'lang.english': 'English',
  'lang.hindi': 'हिंदी',
  'lang.marathi': 'मराठी',
  'lang.changeLanguage': 'भाषा बदलें',

  // Home screen
  'home.title': 'कृषिमित्र',
  'home.subtitle': 'आपका कृषि सलाहकार',
  'home.greeting': 'नमस्ते, किसान!',
  'home.greetingSubtitle': 'आपके कृषि साथी में आपका स्वागत है',
  'home.whatsAroundMe': 'मेरे आस-पास क्या है',
  'home.whatsAroundMeDesc': 'मौसम, मंडी भाव और स्थानीय जरूरतें',
  'home.schemesTraining': 'योजनाएँ और प्रशिक्षण',
  'home.schemesTrainingDesc': 'सरकारी योजनाएँ और शिक्षण सामग्री',
  'home.community': 'समुदाय',
  'home.communityDesc': 'किसानों और विशेषज्ञों से जुड़ें',
  'home.askKrishiMitra': 'कृषिमित्र से पूछें',
  'home.askKrishiMitraDesc': 'वॉयस-फर्स्ट AI कृषि सलाहकार',
  'home.forYou': 'आपके लिए',
  'home.seeAll': 'सभी देखें',
  'home.mainServices': 'मुख्य सेवाएँ',
  'home.speakQuestion': 'अपना सवाल बोलें',

  // Header
  'header.title': 'कृषिमित्र',
  'header.changeLanguage': 'भाषा',

  // Auth
  'auth.signIn': 'साइन इन करें',
  'auth.signUp': 'साइन अप करें',
  'auth.email': 'ईमेल पता',
  'auth.password': 'पासवर्ड',
  'auth.continue': 'जारी रखें',
  'auth.signOut': 'साइन आउट',
  'auth.createAccount': 'खाता बनाएँ',
  'auth.alreadyHaveAccount': 'पहले से खाता है? साइन इन करें',
  'auth.forgotPassword': 'पासवर्ड भूल गए?',
  'auth.signingIn': 'साइन इन हो रहा है…',
  'auth.signingUp': 'खाता बनाया जा रहा है…',
  'auth.error': 'प्रमाणीकरण विफल। कृपया अपनी जानकारी जाँचें।',
  'auth.signInError': 'साइन इन विफल। कृपया अपनी जानकारी जाँचें।',
  'auth.signUpError': 'साइन अप विफल। कृपया पुनः प्रयास करें।',
  'auth.noAccount': 'खाता नहीं है?',
  'auth.hasAccount': 'पहले से खाता है?',
  'auth.passwordHint': 'कम से कम 6 अक्षर',

  // Profile
  'profile.title': 'मेरी प्रोफ़ाइल',
  'profile.fullName': 'पूरा नाम',
  'profile.phone': 'फ़ोन नंबर',
  'profile.state': 'राज्य',
  'profile.district': 'जिला',
  'profile.taluka': 'तालुका / ब्लॉक',
  'profile.village': 'गाँव',
  'profile.enterpriseType': 'उद्यम का प्रकार',
  'profile.primaryCrop': 'मुख्य फसल',
  'profile.language': 'पसंदीदा भाषा',
  'profile.save': 'प्रोफ़ाइल सहेजें',
  'profile.edit': 'प्रोफ़ाइल संपादित करें',
  'profile.gpsGranted': 'स्थान की अनुमति दी गई',
  'profile.gpsDenied': 'स्थान की अनुमति नहीं — दर्ज पते का उपयोग हो रहा है',
  'profile.gpsRequest': 'बेहतर परिणामों के लिए स्थान की अनुमति दें',
  'profile.selectState': 'राज्य चुनें',
  'profile.selectDistrict': 'जिला चुनें',
  'profile.selectEnterprise': 'उद्यम का प्रकार चुनें',
  'profile.saved': 'प्रोफ़ाइल सफलतापूर्वक सहेजी गई',
  'profile.error': 'प्रोफ़ाइल सहेजने में विफल। कृपया पुनः प्रयास करें।',

  // Enterprise types
  'enterprise.poultry': 'मुर्गीपालन',
  'enterprise.fisheries': 'मत्स्य पालन',
  'enterprise.apiculture': 'मधुमक्खी पालन',
  'enterprise.mushroom': 'मशरूम उत्पादन',
  'enterprise.vermicompost': 'वर्मीकम्पोस्ट',
  'enterprise.dairy': 'डेयरी',
  'enterprise.goat': 'बकरी पालन',

  // Weather
  'weather.title': 'वर्तमान मौसम',
  'weather.temperature': 'तापमान',
  'weather.humidity': 'आर्द्रता',
  'weather.precipitation': 'वर्षा की संभावना',
  'weather.windSpeed': 'हवा की गति',
  'weather.condition': 'मौसम की स्थिति',
  'weather.lastUpdated': 'अंतिम अपडेट',
  'weather.unavailable': 'मौसम डेटा उपलब्ध नहीं',
  'weather.loading': 'मौसम लोड हो रहा है…',
  'weather.retry': 'पुनः प्रयास करें',
  'weather.rainWhenQuestion': 'कब बारिश होगी?',
  'weather.noRainExpected': 'अगले 7 दिनों में कोई बारिश की उम्मीद नहीं है',
  'weather.nextRainExpected': 'अगली बारिश की उम्मीद',
  'weather.approximately': 'लगभग',
  'weather.probability': 'संभावना',
  'weather.forecastDays': '7 दिन का पूर्वानुमान',
  'weather.alerts': 'मौसम सचेतियाँ',
  'weather.noAlerts': 'कोई सक्रिय मौसम सचेती नहीं',
  'weather.advisory': 'सलाह',
  'weather.updateFrequency': 'हर 3 घंटे में अपडेट',

  // Days of week
  'day.today': 'आज',
  'day.tomorrow': 'कल',
  'day.sunday': 'रविवार',
  'day.monday': 'सोमवार',
  'day.tuesday': 'मंगलवार',
  'day.wednesday': 'बुधवार',
  'day.thursday': 'गुरुवार',
  'day.friday': 'शुक्रवार',
  'day.saturday': 'शनिवार',

  // Months
  'month.january': 'जनवरी',
  'month.february': 'फरवरी',
  'month.march': 'मार्च',
  'month.april': 'अप्रैल',
  'month.may': 'मई',
  'month.june': 'जून',
  'month.july': 'जुलाई',
  'month.august': 'अगस्त',
  'month.september': 'सितंबर',
  'month.october': 'अक्टूबर',
  'month.november': 'नवंबर',
  'month.december': 'दिसंबर',

  // Short months
  'shortMonth.jan': 'जन',
  'shortMonth.feb': 'फर',
  'shortMonth.mar': 'मार्च',
  'shortMonth.apr': 'अप्र',
  'shortMonth.may': 'मई',
  'shortMonth.jun': 'जून',
  'shortMonth.jul': 'जुल',
  'shortMonth.aug': 'अग',
  'shortMonth.sep': 'सित',
  'shortMonth.oct': 'अक्ट',
  'shortMonth.nov': 'नव',
  'shortMonth.dec': 'दिस',

  // Mandi prices
  'mandi.title': 'मंडी भाव',
  'mandi.crop': 'फसल',
  'mandi.location': 'स्थान',
  'mandi.minPrice': 'न्यूनतम मूल्य',
  'mandi.maxPrice': 'अधिकतम मूल्य',
  'mandi.modalPrice': 'मॉडल मूल्य',
  'mandi.mandiName': 'मंडी का नाम',
  'mandi.lastUpdated': 'अंतिम अपडेट',
  'mandi.unavailable': 'मूल्य डेटा उपलब्ध नहीं',
  'mandi.loading': 'मूल्य लोड हो रहे हैं…',
  'mandi.retry': 'पुनः प्रयास करें',
  'mandi.perQuintal': '₹/क्विंटल',
  'mandi.selectCrop': 'फसल चुनें',
  'mandi.search': 'बाजार खोजें',
  'mandi.searchPlaceholder': 'फसल या बाजार के नाम से खोजें',
  'mandi.backToFeed': 'फीड पर वापस जाएँ',
  'mandi.searching': 'बाजार खोज रहे हैं…',
  'mandi.noResults': 'इस फसल के लिए कोई बाजार नहीं मिला',
  'mandi.todayRates': 'आज के दाम',
  'mandi.latestUpdates': 'नवीनतम अपडेट',

  // Schemes & Help
  'help.title': 'मदद और समर्थन',
  'help.subtitle': 'सरकारी योजनाएँ और सहायता',
  'help.subsidySchemes': 'अनुदान योजनाएँ',
  'help.governmentSchemes': 'उपलब्ध सरकारी योजनाएँ',
  'help.contactUs': 'हमसे संपर्क करें',
  'help.kisanCallCenter': 'किसान कॉल सेंटर',
  'help.callCenter': 'कॉल सेंटर: 1800-180-1551 (टोल-फ्री)',
  'help.freeService': 'मुफ्त कृषि सलाह सेवा',
  'help.disclaimer': 'अस्वीकरण',
  'help.disclaimerText': 'दी गई जानकारी केवल मार्गदर्शन के लिए है। हमेशा आधिकारिक स्रोतों से सत्यापित करें।',
  'help.viewAllSchemes': 'सभी योजनाएँ देखें',

  // Schemes
  'schemes.title': 'सरकारी योजनाएँ',
  'schemes.recommended': 'आपके लिए अनुशंसित',
  'schemes.eligibility': 'पात्रता',
  'schemes.benefits': 'लाभ',
  'schemes.documents': 'आवश्यक दस्तावेज़',
  'schemes.process': 'आवेदन प्रक्रिया',
  'schemes.applyNow': 'अभी आवेदन करें',
  'schemes.sourceUrl': 'स्रोत',
  'schemes.loading': 'योजनाएँ लोड हो रही हैं…',
  'schemes.noSchemes': 'आपकी प्रोफ़ाइल के लिए कोई योजना नहीं मिली',
  'schemes.cachedNotice': 'अंतिम अपडेट',
  'schemes.viewDetails': 'विवरण देखें',
  'schemes.whatHelp': 'यह योजना क्या प्रदान करती है?',
  'schemes.whoEligible': 'कौन पात्र है?',
  'schemes.requiredDocs': 'आवश्यक दस्तावेज़',
  'schemes.howToApply': 'आवेदन कैसे करें',
  'schemes.deadline': 'आवेदन की अंतिम तारीख',
  'schemes.info': 'जानकारी',
  'schemes.warning': 'महत्वपूर्ण नोट',
  'schemes.applyButton': 'इस योजना के लिए आवेदन करें',
  'schemes.statusButton': 'आवेदन स्थिति जाँचें',

  // Training
  'training.title': 'प्रशिक्षण संसाधन',
  'training.filterLanguage': 'भाषा के अनुसार फ़िल्टर करें',
  'training.filterEnterprise': 'उद्यम के अनुसार फ़िल्टर करें',
  'training.duration': 'अवधि',
  'training.viewSource': 'स्रोत देखें',
  'training.loading': 'प्रशिक्षण संसाधन लोड हो रहे हैं…',
  'training.noTraining': 'कोई प्रशिक्षण संसाधन नहीं मिला',
  'training.cachedNotice': 'अंतिम अपडेट',
  'training.language': 'भाषा',

  // Market Linkage
  'market.title': 'बाज़ार लिंकेज',
  'market.myListings': 'मेरी सूचियाँ',
  'market.postListing': 'नई सूची पोस्ट करें',
  'market.product': 'उत्पाद',
  'market.quantity': 'मात्रा',
  'market.unit': 'इकाई',
  'market.quality': 'गुणवत्ता / ग्रेड',
  'market.expectedPrice': 'अपेक्षित मूल्य (₹)',
  'market.availableFrom': 'उपलब्धता की तारीख',
  'market.pickupDelivery': 'पिकअप / डिलीवरी',
  'market.uploadPhoto': 'फ़ोटो अपलोड करें (वैकल्पिक)',
  'market.submit': 'सूची सबमिट करें',
  'market.potentialBuyers': 'संभावित खरीदार मिले',
  'market.contactBuyer': 'खरीदार से संपर्क करें',
  'market.sellViaeNAM': 'e-NAM के माध्यम से बेचें',
  'market.noListings': 'अभी तक कोई सूची नहीं',
  'market.listingCreated': 'सूची सफलतापूर्वक बनाई गई',
  'market.pickup': 'पिकअप',
  'market.delivery': 'डिलीवरी',
  'market.both': 'दोनों',
  'market.sellHeading': 'अपनी उपज बेचें',
  'market.sellDescription': 'सीधे खरीदारों से जुड़ें और बेहतर कीमत पाएँ',
  'market.nearestLocations': 'निकटतम बिक्रय स्थान',
  'market.locationsFound': 'स्थान मिले',
  'market.sellToGovt': 'सरकार को बेचें',
  'market.govDescription': 'सरकारी खरीद योजनाओं में भाग लें',
  'market.sellToOrganizations': 'संगठनों को बेचें',
  'market.orgDescription': 'बल्क खरीदारों और संगठनों को आपूर्ति करें',
  'market.comingSoon': 'जल्द आ रहा है',
  'market.dataSource': 'डेटा स्रोत',
  'market.poweredBy': 'कृषि बाजारों द्वारा संचालित',
  'market.noNearbyLocations': 'कोई पास का स्थान नहीं मिला',
  'market.newSearch': 'नई खोज करें',
  'market.sellOptions': 'बेचने के विभिन्न तरीके',

  // Bazaar
  'bazaar.title': 'बाज़ार',
  'bazaar.subtitle': 'बाजार के भाव और बिक्रय के अवसर',
  'bazaar.seePrices': 'भाव देखें',
  'bazaar.seePricesDesc': 'वर्तमान मंडी और बाजार दरें देखें',
  'bazaar.sell': 'उपज बेचें',
  'bazaar.sellDesc': 'खरीदारों से जुड़ें और बेहतर कीमत पाएँ',
  'bazaar.tip': 'सुझाव',
  'bazaar.tipText': 'सर्वोत्तम विक्रय अवसर के लिए प्रतिदिन कीमतें जाँचें',

  // Allied Farming
  'allied.title': 'सहायक कृषि हब',
  'allied.subtitle': 'मुर्गीपालन, डेयरी, मत्स्य पालन और अन्य',
  'allied.experimental': 'प्रायोगिक',
  'allied.experimentalText': 'इस अनुभाग में प्रायोगिक सुविधाएँ शामिल हैं',
  'allied.searchPlaceholder': 'उत्पादों, प्रथाओं या बाजारों को खोजें',
  'allied.search': 'खोजें',
  'allied.quickFilters': 'त्वरित फ़िल्टर',
  'allied.popular': 'लोकप्रिय',
  'allied.commonActivities': 'सामान्य गतिविधियाँ',
  'allied.allProducts': 'सभी उत्पाद',
  'allied.filterLabel': 'फ़िल्टर करें',
  'allied.productCount': 'उत्पाद',
  'allied.noProducts': 'कोई उत्पाद नहीं मिला',
  'allied.tryDifferentSearch': 'एक अलग खोज करें',
  'allied.clearFilters': 'फ़िल्टर साफ करें',
  'allied.categories': 'श्रेणियाँ',
  'allied.visitEnam': 'e-NAM बाजारस्थल पर जाएँ',

  // Community
  'community.title': 'समुदाय',
  'community.joinGroup': 'समूह में शामिल हों',
  'community.askExpert': 'विशेषज्ञ से पूछें',
  'community.noGroups': 'आपके क्षेत्र में कोई समूह नहीं मिला',
  'community.kisanCallCentre': 'किसान कॉल सेंटर: 1800-180-1551',
  'community.whatsappGroups': 'WhatsApp समूह',
  'community.connect': 'किसानों से जुड़ें',
  'community.training': 'प्रशिक्षण कार्यक्रम',
  'community.guides': 'गाइड और प्रथाएँ',
  'community.communities': 'स्थानीय समुदाय',
  'community.upcomingEvents': 'आने वाली घटनाएँ',
  'community.upcomingDescription': 'अपने क्षेत्र में कृषि घटनाओं में शामिल हों',
  'community.sampleBadge': 'विशेष',
  'community.alliedFarmingGuides': 'सहायक कृषि गाइड',
  'community.guideDescription': 'मुर्गीपालन, डेयरी और अन्य प्रथाएँ जानें',
  'community.communityTitle': 'स्थानीय कृषि समुदाय',
  'community.communityDescription': 'आपके पास के किसानों से जुड़ें',
  'community.sampleLink': 'समुदाय में शामिल हों',
  'community.joinBeforeEntering': 'भाग लेने के लिए एक समुदाय में शामिल हों',
  'community.tip': 'सुझाव: सक्रिय भागीदारी आपको तेजी से सीखने में मदद करती है',

  // Events & Details
  'event.notFound': 'घटना नहीं मिली',
  'event.back': 'घटनाओं पर वापस जाएँ',
  'event.details': 'घटना विवरण',
  'event.whatYouLearn': 'आप क्या सीखेंगे',
  'event.whoCanAttend': 'कौन भाग ले सकता है',
  'event.registration': 'पंजीकरण',
  'event.contact': 'संपर्क जानकारी',
  'event.note': 'नोट',
  'event.sampleData': 'नमूना घटना डेटा',
  'event.disclaimer': 'कृपया घटना आयोजकों के साथ विवरण सत्यापित करें',

  // Guides
  'guide.notFound': 'गाइड नहीं मिली',
  'guide.back': 'गाइड पर वापस जाएँ',
  'guide.gettingStarted': 'शुरुआत करना',
  'guide.requirements': 'आवश्यकताएँ',
  'guide.setup': 'सेटअप और स्थापना',
  'guide.equipment': 'आवश्यक उपकरण और उपकरण',
  'guide.beginnerSteps': 'शुरुआत के कदम',
  'guide.marketAndPrice': 'बाजार और मूल्य निर्धारण',
  'guide.whereToSell': 'अपनी उपज कहाँ बेचें',
  'guide.mandiIntegration': 'सीधी बिक्रय के लिए मंडी एकीकरण',
  'guide.govSupport': 'सरकारी समर्थन',
  'guide.schemesAvailable': 'इस उद्यम के लिए उपलब्ध योजनाएँ',
  'guide.contactLocal': 'अपने स्थानीय कृषि कार्यालय से संपर्क करें',
  'guide.trainingPrograms': 'प्रशिक्षण कार्यक्रम',
  'guide.upcomingTraining': 'आपके पास आने वाला प्रशिक्षण',
  'guide.viewPrograms': 'उपलब्ध कार्यक्रम देखें',

  // AI Assistant / Chat
  'ask.title': 'कृषिमित्र से पूछें',
  'ask.listening': 'सुन रहा है…',
  'ask.thinking': 'KisanSLM सोच रहा है…',
  'ask.listen': '🔊 सुनें',
  'ask.poweredByKisanSLM': 'KisanSLM द्वारा संचालित',
  'ask.poweredBySarvam': 'Sarvam AI द्वारा संचालित',
  'ask.usingBrowserSpeech': 'ब्राउज़र वाक् उपयोग हो रहा है',
  'ask.placeholder': 'अपना प्रश्न टाइप करें या बोलें…',
  'ask.send': 'भेजें',
  'ask.fallbackLabel': 'संकलित उत्तर',
  'ask.micPermissionDenied': 'माइक्रोफ़ोन की अनुमति अस्वीकार। कृपया ब्राउज़र सेटिंग में सक्षम करें।',
  'ask.voiceError': 'आवाज़ पहचान विफल। कृपया पुनः प्रयास करें या प्रश्न टाइप करें।',
  'ask.greetingTitle': 'नमस्ते! मैं कृषिमित्र हूँ',
  'ask.greetingSubtitle': 'आपका व्यक्तिगत कृषि सहायक। मुझसे कृषि के बारे में कुछ भी पूछें।',
  'ask.switchToText': 'पाठ में स्विच करें',
  'ask.switchToVoice': 'वॉयस में स्विच करें',
  'ask.you': 'आप',
  'ask.assistant': 'कृषिमित्र',
  'ask.playAudio': '▶ ऑडियो चलाएँ',

  // Business Planner
  'planner.title': 'व्यवसाय योजनाकार',
  'planner.flockSize': 'झुंड / पशु संख्या',
  'planner.feedCost': 'प्रति इकाई चारे की लागत (₹)',
  'planner.expectedYield': 'प्रति चक्र अपेक्षित उत्पादन',
  'planner.marketPrice': 'बाज़ार मूल्य प्रति इकाई (₹)',
  'planner.cyclesPerYear': 'वार्षिक चक्र संख्या',
  'planner.totalCost': 'कुल लागत',
  'planner.grossRevenue': 'सकल राजस्व',
  'planner.netProfit': 'शुद्ध लाभ',
  'planner.profitMargin': 'लाभ मार्जिन',
  'planner.roi': 'निवेश पर प्रतिफल',
  'planner.breakEven': 'ब्रेक-ईवन इकाइयाँ',
  'planner.calculate': 'गणना करें',
  'planner.perUnit': 'प्रति इकाई',
  'planner.perCycle': 'प्रति चक्र',
  'planner.narrative': 'KisanSLM सलाह',

  // General / offline / errors
  'general.loading': 'लोड हो रहा है…',
  'general.retry': 'पुनः प्रयास करें',
  'general.error': 'कोई त्रुटि हुई',
  'general.success': 'सफल',
  'general.cancel': 'रद्द करें',
  'general.confirm': 'पुष्टि करें',
  'general.back': 'वापस',
  'general.next': 'आगे',
  'general.refresh': 'ताज़ा करें',
  'general.noData': 'कोई डेटा उपलब्ध नहीं',
  'general.noDataDescription': 'बाद में फिर से जाँचने का प्रयास करें या पृष्ठ को ताज़ा करें',
  'offline.banner': 'आप ऑफ़लाइन हैं। कुछ सुविधाएँ उपलब्ध नहीं हैं।',
  'offline.unavailable': 'ऑफ़लाइन उपलब्ध नहीं',
  'error.sessionExpired': 'आपका सत्र समाप्त हो गया है। कृपया पुनः साइन इन करें।',
  'error.networkError': 'नेटवर्क त्रुटि। कृपया अपना कनेक्शन जाँचें।',
  'error.unknown': 'एक अज्ञात त्रुटि हुई। कृपया पुनः प्रयास करें।',
  'error.dataUnavailable': 'डेटा अभी उपलब्ध नहीं है। कृपया बाद में पुनः प्रयास करें।',
};

// ---------------------------------------------------------------------------
// Marathi strings (Devanagari)
// ---------------------------------------------------------------------------
const mr: Record<TranslationKey, string> = {
  // App
  'app.title': 'कृषिमित्र',
  'app.subtitle': 'Team Airavata',
  'app.attribution': 'शेती सहाय्यक व्यासपीठ',
  'app.tagline': 'शेतकऱ्यांना ज्ञानाने सशक्त करा',

  // Navigation
  'nav.home': 'मुख्यपृष्ठ',
  'nav.schemes': 'योजना',
  'nav.community': 'समुदाय',
  'nav.ask': 'कृषिमित्राला विचारा',
  'nav.bazaar': 'बाजार',
  'nav.help': 'मदत',
  'nav.weather': 'हवामान',
  'nav.market': 'बाजार',
  'nav.chat': 'चर्चा',

  // Language picker
  'lang.choose': 'तुमची भाषा निवडा',
  'lang.english': 'English',
  'lang.hindi': 'हिंदी',
  'lang.marathi': 'मराठी',
  'lang.changeLanguage': 'भाषा बदला',

  // Home screen
  'home.title': 'कृषिमित्र',
  'home.subtitle': 'तुमचा कृषी सल्लागार',
  'home.greeting': 'नमस्ते, शेतकरी!',
  'home.greetingSubtitle': 'तुमच्या शेती सहाय्यकामध्ये स्वागतम्',
  'home.whatsAroundMe': 'माझ्या आसपास काय आहे',
  'home.whatsAroundMeDesc': 'हवामान, बाजारभाव आणि स्थानिक गरजा',
  'home.schemesTraining': 'योजना आणि प्रशिक्षण',
  'home.schemesTrainingDesc': 'शासकीय योजना आणि शिकण्याची साधने',
  'home.community': 'समुदाय',
  'home.communityDesc': 'शेतकरी आणि तज्ज्ञांशी संपर्क साधा',
  'home.askKrishiMitra': 'कृषिमित्राला विचारा',
  'home.askKrishiMitraDesc': 'आवाज-प्रथम AI कृषी सल्लागार',
  'home.forYou': 'तुमच्यासाठी',
  'home.seeAll': 'सर्व पाहा',
  'home.mainServices': 'मुख्य सेवा',
  'home.speakQuestion': 'तुमचा प्रश्न बोला',

  // Header
  'header.title': 'कृषिमित्र',
  'header.changeLanguage': 'भाषा',

  // Auth
  'auth.signIn': 'साइन इन करा',
  'auth.signUp': 'साइन अप करा',
  'auth.email': 'ईमेल पत्ता',
  'auth.password': 'पासवर्ड',
  'auth.continue': 'पुढे जा',
  'auth.signOut': 'साइन आउट',
  'auth.createAccount': 'खाते तयार करा',
  'auth.alreadyHaveAccount': 'आधीपासून खाते आहे? साइन इन करा',
  'auth.forgotPassword': 'पासवर्ड विसरलात?',
  'auth.signingIn': 'साइन इन होत आहे…',
  'auth.signingUp': 'खाते तयार होत आहे…',
  'auth.error': 'प्रमाणीकरण अयशस्वी. कृपया तुमची माहिती तपासा.',
  'auth.signInError': 'साइन इन अयशस्वी. कृपया तुमची माहिती तपासा.',
  'auth.signUpError': 'साइन अप अयशस्वी. कृपया पुन्हा प्रयत्न करा.',
  'auth.noAccount': 'खाते नाही?',
  'auth.hasAccount': 'आधीपासून खाते आहे?',
  'auth.passwordHint': 'किमान 6 अक्षरे',

  // Profile
  'profile.title': 'माझी प्रोफाइल',
  'profile.fullName': 'पूर्ण नाव',
  'profile.phone': 'फोन नंबर',
  'profile.state': 'राज्य',
  'profile.district': 'जिल्हा',
  'profile.taluka': 'तालुका / ब्लॉक',
  'profile.village': 'गाव',
  'profile.enterpriseType': 'उद्योगाचा प्रकार',
  'profile.primaryCrop': 'मुख्य पीक',
  'profile.language': 'पसंतीची भाषा',
  'profile.save': 'प्रोफाइल जतन करा',
  'profile.edit': 'प्रोफाइल संपादित करा',
  'profile.gpsGranted': 'स्थान परवानगी दिली गेली',
  'profile.gpsDenied': 'स्थान परवानगी नाकारली — प्रविष्ट पत्ता वापरला जात आहे',
  'profile.gpsRequest': 'चांगल्या परिणामांसाठी स्थान परवानगी द्या',
  'profile.selectState': 'राज्य निवडा',
  'profile.selectDistrict': 'जिल्हा निवडा',
  'profile.selectEnterprise': 'उद्योगाचा प्रकार निवडा',
  'profile.saved': 'प्रोफाइल यशस्वीरित्या जतन केली',
  'profile.error': 'प्रोफाइल जतन करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.',

  // Enterprise types
  'enterprise.poultry': 'कुक्कुटपालन',
  'enterprise.fisheries': 'मत्स्यपालन',
  'enterprise.apiculture': 'मधुमक्षिकापालन',
  'enterprise.mushroom': 'मशरूम लागवड',
  'enterprise.vermicompost': 'गांडूळ खत',
  'enterprise.dairy': 'दुग्धव्यवसाय',
  'enterprise.goat': 'शेळीपालन',

  // Weather
  'weather.title': 'सध्याचे हवामान',
  'weather.temperature': 'तापमान',
  'weather.humidity': 'आर्द्रता',
  'weather.precipitation': 'पर्जन्याची शक्यता',
  'weather.windSpeed': 'वाऱ्याचा वेग',
  'weather.condition': 'हवामानाची स्थिती',
  'weather.lastUpdated': 'शेवटचे अपडेट',
  'weather.unavailable': 'हवामान डेटा उपलब्ध नाही',
  'weather.loading': 'हवामान लोड होत आहे…',
  'weather.retry': 'पुन्हा प्रयत्न करा',
  'weather.rainWhenQuestion': 'कधी पाऊस पडेल?',
  'weather.noRainExpected': 'पुढील 7 दिवसांत कोणताही पाऊस अपेक्षित नाही',
  'weather.nextRainExpected': 'पुढील पाऱ्याची अपेक्षा',
  'weather.approximately': 'अंदाजे',
  'weather.probability': 'संभावना',
  'weather.forecastDays': '7 दिवसांचा अंदाज',
  'weather.alerts': 'हवामान सतर्कता',
  'weather.noAlerts': 'कोणतीही सक्रिय हवामान सतर्कता नाही',
  'weather.advisory': 'सल्ला',
  'weather.updateFrequency': 'प्रत्येक 3 तासांनी अपडेट',

  // Days of week
  'day.today': 'आज',
  'day.tomorrow': 'उद्या',
  'day.sunday': 'रविवार',
  'day.monday': 'सोमवार',
  'day.tuesday': 'मंगळवार',
  'day.wednesday': 'बुधवार',
  'day.thursday': 'गुरुवार',
  'day.friday': 'शुक्रवार',
  'day.saturday': 'शनिवार',

  // Months
  'month.january': 'जानेवारी',
  'month.february': 'फेब्रुवारी',
  'month.march': 'मार्च',
  'month.april': 'एप्रिल',
  'month.may': 'मे',
  'month.june': 'जून',
  'month.july': 'जुलै',
  'month.august': 'ऑगस्ट',
  'month.september': 'सप्टेंबर',
  'month.october': 'ऑक्टोबर',
  'month.november': 'नोव्हेंबर',
  'month.december': 'डिसेंबर',

  // Short months
  'shortMonth.jan': 'जान',
  'shortMonth.feb': 'फेब',
  'shortMonth.mar': 'मार्च',
  'shortMonth.apr': 'एप्र',
  'shortMonth.may': 'मे',
  'shortMonth.jun': 'जून',
  'shortMonth.jul': 'जुल',
  'shortMonth.aug': 'ऑग',
  'shortMonth.sep': 'सप्ट',
  'shortMonth.oct': 'ऑक्ट',
  'shortMonth.nov': 'नोव्ह',
  'shortMonth.dec': 'डिस',

  // Mandi prices
  'mandi.title': 'बाजारभाव',
  'mandi.crop': 'पीक',
  'mandi.location': 'स्थान',
  'mandi.minPrice': 'किमान भाव',
  'mandi.maxPrice': 'कमाल भाव',
  'mandi.modalPrice': 'मॉडल भाव',
  'mandi.mandiName': 'बाजाराचे नाव',
  'mandi.lastUpdated': 'शेवटचे अपडेट',
  'mandi.unavailable': 'भाव डेटा उपलब्ध नाही',
  'mandi.loading': 'भाव लोड होत आहेत…',
  'mandi.retry': 'पुन्हा प्रयत्न करा',
  'mandi.perQuintal': '₹/क्विंटल',
  'mandi.selectCrop': 'पीक निवडा',
  'mandi.search': 'बाजार शोधा',
  'mandi.searchPlaceholder': 'पीक किंवा बाजाराचे नाव खोजा',
  'mandi.backToFeed': 'फीडवर परत जा',
  'mandi.searching': 'बाजार शोधत आहे…',
  'mandi.noResults': 'या पिकाचा कोणताही बाजार सापडला नाही',
  'mandi.todayRates': 'आजचे दर',
  'mandi.latestUpdates': 'नवीनतम अपडेट्स',

  // Schemes & Help
  'help.title': 'मदत आणि समर्थन',
  'help.subtitle': 'शासकीय योजना आणि सहायता',
  'help.subsidySchemes': 'अनुदान योजना',
  'help.governmentSchemes': 'उपलब्ध शासकीय योजना',
  'help.contactUs': 'आमच्याशी संपर्क साधा',
  'help.kisanCallCenter': 'किसान कॉल सेंटर',
  'help.callCenter': 'कॉल सेंटर: 1800-180-1551 (मुक्त)',
  'help.freeService': 'मुक्त कृषी सल्ला सेवा',
  'help.disclaimer': 'अस्वीकरण',
  'help.disclaimerText': 'दिलेली माहिती केवळ मार्गदर्शनार्थ आहे. नेहमी अधिकृत स्रोतांसह तपासा.',
  'help.viewAllSchemes': 'सर्व योजना पाहा',

  // Schemes
  'schemes.title': 'शासकीय योजना',
  'schemes.recommended': 'तुमच्यासाठी शिफारस केलेले',
  'schemes.eligibility': 'पात्रता',
  'schemes.benefits': 'लाभ',
  'schemes.documents': 'आवश्यक कागदपत्रे',
  'schemes.process': 'अर्ज प्रक्रिया',
  'schemes.applyNow': 'आत्ता अर्ज करा',
  'schemes.sourceUrl': 'स्रोत',
  'schemes.loading': 'योजना लोड होत आहेत…',
  'schemes.noSchemes': 'तुमच्या प्रोफाइलसाठी कोणतीही योजना आढळली नाही',
  'schemes.cachedNotice': 'शेवटचे अपडेट',
  'schemes.viewDetails': 'तपशील पाहा',
  'schemes.whatHelp': 'या योजनेद्वारे काय मिळते?',
  'schemes.whoEligible': 'कोण पात्र आहे?',
  'schemes.requiredDocs': 'आवश्यक कागदपत्रे',
  'schemes.howToApply': 'अर्ज कसे करायचा',
  'schemes.deadline': 'अर्ज करण्याची शेवटची तारीख',
  'schemes.info': 'माहिती',
  'schemes.warning': 'महत्वाचे सूचना',
  'schemes.applyButton': 'या योजनेसाठी अर्ज करा',
  'schemes.statusButton': 'अर्जाची स्थिती तपासा',

  // Training
  'training.title': 'प्रशिक्षण साधने',
  'training.filterLanguage': 'भाषेनुसार फिल्टर करा',
  'training.filterEnterprise': 'उद्योगानुसार फिल्टर करा',
  'training.duration': 'कालावधी',
  'training.viewSource': 'स्रोत पाहा',
  'training.loading': 'प्रशिक्षण साधने लोड होत आहेत…',
  'training.noTraining': 'कोणतेही प्रशिक्षण साधन आढळले नाही',
  'training.cachedNotice': 'शेवटचे अपडेट',
  'training.language': 'भाषा',

  // Market Linkage
  'market.title': 'बाजार संपर्क',
  'market.myListings': 'माझ्या याद्या',
  'market.postListing': 'नवीन यादी पोस्ट करा',
  'market.product': 'उत्पादन',
  'market.quantity': 'प्रमाण',
  'market.unit': 'एकक',
  'market.quality': 'गुणवत्ता / दर्जा',
  'market.expectedPrice': 'अपेक्षित भाव (₹)',
  'market.availableFrom': 'उपलब्धतेची तारीख',
  'market.pickupDelivery': 'पिकअप / डिलिव्हरी',
  'market.uploadPhoto': 'फोटो अपलोड करा (पर्यायी)',
  'market.submit': 'यादी सबमिट करा',
  'market.potentialBuyers': 'संभाव्य खरेदीदार सापडले',
  'market.contactBuyer': 'खरेदीदाराशी संपर्क करा',
  'market.sellViaeNAM': 'e-NAM द्वारे विका',
  'market.noListings': 'अद्याप कोणतीही यादी नाही',
  'market.listingCreated': 'यादी यशस्वीरित्या तयार केली',
  'market.pickup': 'पिकअप',
  'market.delivery': 'डिलिव्हरी',
  'market.both': 'दोन्ही',
  'market.sellHeading': 'तुमचे उत्पादन विका',
  'market.sellDescription': 'थेट खरेदीदारांशी संपर्क साधा आणि चांगले दर मिळवा',
  'market.nearestLocations': 'जवळपास विक्रय केंद्रे',
  'market.locationsFound': 'केंद्रे सापडली',
  'market.sellToGovt': 'शासनाला विका',
  'market.govDescription': 'शासकीय खरेदी योजनांमध्ये भाग घ्या',
  'market.sellToOrganizations': 'संस्थांना विका',
  'market.orgDescription': 'मोठ्या खरेदीदारांना आणि संस्थांना पुरवा',
  'market.comingSoon': 'लवकरच येणार',
  'market.dataSource': 'डेटा स्रोत',
  'market.poweredBy': 'कृषी बाजारांद्वारे चालवले',
  'market.noNearbyLocations': 'जवळपास कोणतेही केंद्र आढळले नाही',
  'market.newSearch': 'नई शोध करा',
  'market.sellOptions': 'विक्रयण करण्याचे विविध मार्ग',

  // Bazaar
  'bazaar.title': 'बाजार',
  'bazaar.subtitle': 'बाजारभाव आणि विक्रयण संधी',
  'bazaar.seePrices': 'दर पाहा',
  'bazaar.seePricesDesc': 'सध्याचे बाजार आणि बाजारभाव पाहा',
  'bazaar.sell': 'उत्पादन विका',
  'bazaar.sellDesc': 'खरेदीदारांशी संपर्क साधा आणि चांगले दर मिळवा',
  'bazaar.tip': 'सूचना',
  'bazaar.tipText': 'सर्वोत्तम विक्रयण संधीसाठी दैनिक दरे तपासा',

  // Allied Farming
  'allied.title': 'सहायक शेती हब',
  'allied.subtitle': 'कुक्कुटपालन, दुग्धव्यवसाय, मत्स्यपालन आणि इतर',
  'allied.experimental': 'प्रायोगिक',
  'allied.experimentalText': 'या विभागामध्ये प्रायोगिक वैशिष्ट्ये आहेत',
  'allied.searchPlaceholder': 'उत्पादन, प्रथा किंवा बाजार शोधा',
  'allied.search': 'शोधा',
  'allied.quickFilters': 'द्रुत फिल्टर',
  'allied.popular': 'लोकप्रिय',
  'allied.commonActivities': 'सामान्य क्रियाकलाप',
  'allied.allProducts': 'सर्व उत्पादन',
  'allied.filterLabel': 'फिल्टर करा',
  'allied.productCount': 'उत्पादन',
  'allied.noProducts': 'कोणतेही उत्पादन आढळले नाही',
  'allied.tryDifferentSearch': 'वेगळी शोध करून पहा',
  'allied.clearFilters': 'फिल्टर साफ करा',
  'allied.categories': 'श्रेणी',
  'allied.visitEnam': 'e-NAM बाजारात भेट द्या',

  // Community
  'community.title': 'समुदाय',
  'community.joinGroup': 'गटात सामील व्हा',
  'community.askExpert': 'तज्ज्ञांना विचारा',
  'community.noGroups': 'तुमच्या क्षेत्रात कोणताही गट आढळला नाही',
  'community.kisanCallCentre': 'किसान कॉल सेंटर: 1800-180-1551',
  'community.whatsappGroups': 'WhatsApp गट',
  'community.connect': 'शेतकऱ्यांशी संपर्क साधा',
  'community.training': 'प्रशिक्षण कार्यक्रम',
  'community.guides': 'मार्गदर्शक आणि प्रथा',
  'community.communities': 'स्थानिक समुदाय',
  'community.upcomingEvents': 'आसन्न कार्यक्रम',
  'community.upcomingDescription': 'तुमच्या क्षेत्रातील शेती कार्यक्रमांमध्ये सामील व्हा',
  'community.sampleBadge': 'विशेष',
  'community.alliedFarmingGuides': 'सहायक शेती मार्गदर्शक',
  'community.guideDescription': 'कुक्कुटपालन, दुग्धव्यवसाय आणि इतर प्रथा जाणून घ्या',
  'community.communityTitle': 'स्थानिक शेती समुदाय',
  'community.communityDescription': 'तुमच्या आसपास असलेल्या शेतकऱ्यांशी संपर्क साधा',
  'community.sampleLink': 'समुदायात सामील व्हा',
  'community.joinBeforeEntering': 'भाग घेण्यासाठी समुदायात सामील व्हा',
  'community.tip': 'सूचना: सक्रिय भागीदारी तुम्हाला वेगाने शिकण्यात मदत करते',

  // Events & Details
  'event.notFound': 'कार्यक्रम आढळला नाही',
  'event.back': 'कार्यक्रमांवर परत जा',
  'event.details': 'कार्यक्रमाचे तपशील',
  'event.whatYouLearn': 'तुम्ही काय शিकाल',
  'event.whoCanAttend': 'कोण सामील होऊ शकते',
  'event.registration': 'नोंदणी',
  'event.contact': 'संपर्क माहिती',
  'event.note': 'सूचना',
  'event.sampleData': 'नमुना कार्यक्रम डेटा',
  'event.disclaimer': 'कृपया कार्यक्रम आयोजकांसह तपशील सत्यापित करा',

  // Guides
  'guide.notFound': 'मार्गदर्शक आढळला नाही',
  'guide.back': 'मार्गदर्शकांवर परत जा',
  'guide.gettingStarted': 'सुरुवात करणे',
  'guide.requirements': 'आवश्यकता',
  'guide.setup': 'सेटअप आणि स्थापना',
  'guide.equipment': 'आवश्यक उपकरणे आणि साधने',
  'guide.beginnerSteps': 'सुरुवातीचे पाय',
  'guide.marketAndPrice': 'बाजार आणि किंमत',
  'guide.whereToSell': 'तुमचे उत्पादन कोथे विका',
  'guide.mandiIntegration': 'थेट विक्रयणासाठी बाजार एकीकरण',
  'guide.govSupport': 'शासकीय समर्थन',
  'guide.schemesAvailable': 'या उद्योगासाठी उपलब्ध योजना',
  'guide.contactLocal': 'तुमच्या स्थानिक शेती कार्यालयाशी संपर्क साधा',
  'guide.trainingPrograms': 'प्रशिक्षण कार्यक्रम',
  'guide.upcomingTraining': 'तुमच्या आसपास आसन्न प्रशिक्षण',
  'guide.viewPrograms': 'उपलब्ध कार्यक्रम पाहा',

  // AI Assistant / Chat
  'ask.title': 'कृषिमित्राला विचारा',
  'ask.listening': 'ऐकत आहे…',
  'ask.thinking': 'KisanSLM विचार करत आहे…',
  'ask.listen': '🔊 ऐका',
  'ask.poweredByKisanSLM': 'KisanSLM द्वारे चालवले',
  'ask.poweredBySarvam': 'Sarvam AI द्वारे चालवले',
  'ask.usingBrowserSpeech': 'ब्राउझर वाणी वापरली जात आहे',
  'ask.placeholder': 'तुमचा प्रश्न टाइप करा किंवा बोला…',
  'ask.send': 'पाठवा',
  'ask.fallbackLabel': 'संकलित उत्तर',
  'ask.micPermissionDenied': 'मायक्रोफोन परवानगी नाकारली. कृपया ब्राउझर सेटिंग्जमध्ये सक्षम करा.',
  'ask.voiceError': 'आवाज ओळख अयशस्वी. कृपया पुन्हा प्रयत्न करा किंवा प्रश्न टाइप करा.',
  'ask.greetingTitle': 'नमस्ते! मी कृषिमित्र आहे',
  'ask.greetingSubtitle': 'तुमचा व्यक्तिगत शेती सहाय्यक. मला शेतीबद्दल काहीही विचारा.',
  'ask.switchToText': 'मजकुरात स्विच करा',
  'ask.switchToVoice': 'आवाजात स्विच करा',
  'ask.you': 'तुम्ही',
  'ask.assistant': 'कृषिमित्र',
  'ask.playAudio': '▶ ऑडियो चला',

  // Business Planner
  'planner.title': 'व्यवसाय नियोजक',
  'planner.flockSize': 'कळप / प्राणी संख्या',
  'planner.feedCost': 'प्रति एकक खाद्य खर्च (₹)',
  'planner.expectedYield': 'प्रति चक्र अपेक्षित उत्पादन',
  'planner.marketPrice': 'बाजार भाव प्रति एकक (₹)',
  'planner.cyclesPerYear': 'वार्षिक चक्र संख्या',
  'planner.totalCost': 'एकूण खर्च',
  'planner.grossRevenue': 'एकूण उत्पन्न',
  'planner.netProfit': 'निव्वळ नफा',
  'planner.profitMargin': 'नफा मार्जिन',
  'planner.roi': 'गुंतवणुकीवर परतावा',
  'planner.breakEven': 'ब्रेक-ईव्हन एकके',
  'planner.calculate': 'गणना करा',
  'planner.perUnit': 'प्रति एकक',
  'planner.perCycle': 'प्रति चक्र',
  'planner.narrative': 'KisanSLM सल्ला',

  // General / offline / errors
  'general.loading': 'लोड होत आहे…',
  'general.retry': 'पुन्हा प्रयत्न करा',
  'general.error': 'एक त्रुटी आली',
  'general.success': 'यशस्वी',
  'general.cancel': 'रद्द करा',
  'general.confirm': 'पुष्टी करा',
  'general.back': 'मागे',
  'general.next': 'पुढे',
  'general.refresh': 'पुन्हा लोड करा',
  'general.noData': 'कोणताही डेटा उपलब्ध नाही',
  'general.noDataDescription': 'नंतर पुन्हा तपासून पहा किंवा पृष्ठ रीफ्रेश करा',
  'offline.banner': 'तुम्ही ऑफलाइन आहात. काही वैशिष्ट्ये उपलब्ध नाहीत.',
  'offline.unavailable': 'ऑफलाइन उपलब्ध नाही',
  'error.sessionExpired': 'तुमचे सत्र संपले आहे. कृपया पुन्हा साइन इन करा.',
  'error.networkError': 'नेटवर्क त्रुटी. कृपया तुमचे कनेक्शन तपासा.',
  'error.unknown': 'एक अज्ञात त्रुटी आली. कृपया पुन्हा प्रयत्न करा.',
  'error.dataUnavailable': 'डेटा सध्या उपलब्ध नाही. कृपया नंतर पुन्हा प्रयत्न करा.',
};

// ---------------------------------------------------------------------------
// Combined export
// ---------------------------------------------------------------------------
export const translations: Record<'en' | 'hi' | 'mr', Record<TranslationKey, string>> = { en, hi, mr };

export type Language = 'en' | 'hi' | 'mr';
