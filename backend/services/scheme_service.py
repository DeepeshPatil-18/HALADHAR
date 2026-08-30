"""
Government Scheme Service
Provides verified government scheme and subsidy information for farmers.
Sources: MahaDBT, PM-KISAN, PMFBY, and other official government sources.
"""

from typing import List, Dict, Optional
from datetime import datetime

class SchemeService:
    """Service for managing government scheme information"""
    
    def __init__(self):
        # Real verified schemes from official sources
        # Last updated: 2026-08-27
        self.schemes = self._load_verified_schemes()
    
    def _load_verified_schemes(self) -> List[Dict]:
        """Load verified government schemes from official sources"""
        return [
            # PM-KISAN - Central Government Scheme
            {
                "id": "pm-kisan",
                "name": "प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)",
                "category": "direct_benefit",
                "state": "All India",
                "description": "सभी भूमिधारक किसान परिवारों को प्रति वर्ष ₹6,000 की सीधी आय सहायता",
                "benefit": "₹6,000 प्रति वर्ष (₹2,000 की 3 किस्तें)",
                "subsidy": None,
                "eligibility": [
                    "भूमिधारक किसान परिवार",
                    "खेती योग्य भूमि का स्वामित्व",
                    "आधार कार्ड अनिवार्य",
                ],
                "documents": [
                    "आधार कार्ड",
                    "बैंक खाता पासबुक",
                    "भूमि स्वामित्व दस्तावेज़",
                    "मोबाइल नंबर",
                ],
                "applicationProcess": [
                    "PM-KISAN पोर्टल पर जाएं",
                    "नया किसान पंजीकरण चुनें",
                    "आधार नंबर और विवरण भरें",
                    "दस्तावेज़ अपलोड करें",
                    "सबमिट करें",
                ],
                "deadline": None,
                "officialUrl": "https://pmkisan.gov.in/",
                "source": "भारत सरकार - कृषि मंत्रालय",
                "sourceUrl": "https://pmkisan.gov.in/",
                "lastUpdated": "2026-08-27",
                "applicationUrl": "https://pmkisan.gov.in/RegistrationForm.aspx",
                "statusCheckUrl": "https://pmkisan.gov.in/BeneficiaryStatus.aspx",
            },
            
            # PM Fasal Bima Yojana
            {
                "id": "pmfby",
                "name": "प्रधानमंत्री फसल बीमा योजना (PMFBY)",
                "category": "insurance",
                "state": "All India",
                "description": "प्राकृतिक आपदाओं से फसल नुकसान के लिए व्यापक बीमा कवर",
                "benefit": "फसल नुकसान पर बीमा क्लेम",
                "subsidy": "50-90% सरकारी सब्सिडी (किसान केवल 1.5-2% प्रीमियम भुगतान)",
                "eligibility": [
                    "सभी किसान (भूमिधारक और किराएदार)",
                    "अधिसूचित फसल उगाने वाले",
                    "अधिसूचित क्षेत्र में",
                ],
                "documents": [
                    "आधार कार्ड",
                    "बैंक खाता विवरण",
                    "भूमि रिकॉर्ड / किरायानामा",
                    "बुवाई प्रमाण पत्र",
                ],
                "applicationProcess": [
                    "PMFBY पोर्टल पर जाएं या निकटतम बैंक/CSC पर जाएं",
                    "किसान आवेदन पत्र भरें",
                    "दस्तावेज़ जमा करें",
                    "प्रीमियम भुगतान करें",
                    "बीमा पॉलिसी प्राप्त करें",
                ],
                "deadline": "बुवाई/रोपण के समय (फसल अनुसार)",
                "officialUrl": "https://pmfby.gov.in/",
                "source": "भारत सरकार - कृषि मंत्रालय",
                "sourceUrl": "https://pmfby.gov.in/",
                "lastUpdated": "2026-08-27",
                "applicationUrl": "https://pmfby.gov.in/farmerRegistration",
                "statusCheckUrl": "https://pmfby.gov.in/applicationStatus",
            },
            
            # Maharashtra Farm Mechanization (MahaDBT)
            {
                "id": "maha-farm-mechanization",
                "name": "कृषि यंत्रीकरण योजना - महाराष्ट्र",
                "category": "equipment",
                "state": "Maharashtra",
                "description": "किसानों को कृषि मशीनरी और उपकरण खरीदने के लिए सब्सिडी सहायता",
                "benefit": "कृषि उपकरणों पर सब्सिडी",
                "subsidy": "लागत का 40-50% (किसान श्रेणी अनुसार)",
                "eligibility": [
                    "महाराष्ट्र के किसान",
                    "भूमिधारक",
                    "लघु/सीमांत किसानों को प्राथमिकता",
                ],
                "documents": [
                    "आधार कार्ड",
                    "बैंक पासबुक",
                    "7/12 उतारा",
                    "8-अ",
                    "जाति प्रमाण पत्र (यदि लागू हो)",
                ],
                "applicationProcess": [
                    "MahaDBT पोर्टल पर लॉगिन करें",
                    "कृषि विभाग की योजना चुनें",
                    "ऑनलाइन आवेदन भरें",
                    "दस्तावेज़ अपलोड करें",
                    "आवेदन सबमिट करें",
                    "स्वीकृति के बाद उपकरण खरीदें",
                    "सब्सिडी DBT द्वारा प्राप्त करें",
                ],
                "deadline": None,
                "officialUrl": "https://mahadbt.maharashtra.gov.in/",
                "source": "महाराष्ट्र सरकार - कृषि विभाग",
                "sourceUrl": "https://mahadbt.maharashtra.gov.in/",
                "lastUpdated": "2026-08-27",
                "applicationUrl": "https://mahadbt.maharashtra.gov.in/",
                "statusCheckUrl": "https://mahadbt.maharashtra.gov.in/",
            },
            
            # Micro Irrigation (PMKSY - Per Drop More Crop)
            {
                "id": "pmksy-micro-irrigation",
                "name": "सूक्ष्म सिंचाई (ड्रिप/स्प्रिंकलर) - PMKSY",
                "category": "irrigation",
                "state": "Maharashtra",
                "description": "ड्रिप और स्प्रिंकलर सिंचाई प्रणाली स्थापित करने के लिए सब्सिडी",
                "benefit": "सूक्ष्म सिंचाई उपकरण पर सब्सिडी",
                "subsidy": "लागत का 55% (लघु/सीमांत), 45% (अन्य किसान)",
                "eligibility": [
                    "महाराष्ट्र के सभी किसान",
                    "स्वयं की भूमि या न्यूनतम 7 वर्ष का पट्टा",
                    "पानी का स्रोत (बोर, नदी, तालाब)",
                ],
                "documents": [
                    "आधार कार्ड",
                    "बैंक खाता विवरण",
                    "भूमि दस्तावेज़ (7/12, 8-अ)",
                    "जल स्रोत प्रमाण पत्र",
                ],
                "applicationProcess": [
                    "MahaDBT पोर्टल पर जाएं",
                    "PMKSY - Per Drop More Crop योजना चुनें",
                    "ऑनलाइन फॉर्म भरें",
                    "दस्तावेज़ अपलोड करें",
                    "अनुमोदित विक्रेता से उद्धरण प्रस्तुत करें",
                    "स्वीकृति के बाद स्थापना करवाएं",
                    "सत्यापन के बाद सब्सिडी प्राप्त करें",
                ],
                "deadline": None,
                "officialUrl": "https://mahadbt.maharashtra.gov.in/",
                "source": "महाराष्ट्र सरकार - कृषि विभाग (PMKSY)",
                "sourceUrl": "https://mahadbt.maharashtra.gov.in/",
                "lastUpdated": "2026-08-27",
                "applicationUrl": "https://mahadbt.maharashtra.gov.in/",
                "statusCheckUrl": "https://mahadbt.maharashtra.gov.in/",
            },
            
            # Solar Agriculture Pump
            {
                "id": "pmkusum-solar-pump",
                "name": "सोलर कृषि पंप योजना - PM-KUSUM",
                "category": "solar",
                "state": "Maharashtra",
                "description": "सौर ऊर्जा संचालित कृषि पंप स्थापना के लिए सब्सिडी",
                "benefit": "सोलर पंप स्थापना पर सब्सिडी",
                "subsidy": "केंद्र 30% + राज्य 30% = 60% सब्सिडी, 30% ऋण, 10% किसान योगदान",
                "eligibility": [
                    "महाराष्ट्र के किसान",
                    "डीजल/बिजली पंप वाले या नया पंप चाहने वाले",
                    "उपयुक्त भूमि और जल स्रोत",
                ],
                "documents": [
                    "आधार कार्ड",
                    "बैंक खाता विवरण",
                    "भूमि दस्तावेज़ (7/12, 8-अ)",
                    "बिजली कनेक्शन विवरण (यदि हो)",
                ],
                "applicationProcess": [
                    "MahaDBT/MSEDCL पोर्टल पर जाएं",
                    "PM-KUSUM योजना के लिए आवेदन करें",
                    "दस्तावेज़ जमा करें",
                    "साइट सर्वेक्षण कराएं",
                    "स्वीकृति प्राप्त करें",
                    "अनुमोदित विक्रेता से स्थापना कराएं",
                    "सब्सिडी प्राप्त करें",
                ],
                "deadline": None,
                "officialUrl": "https://mahadbt.maharashtra.gov.in/",
                "source": "महाराष्ट्र सरकार / MNRE",
                "sourceUrl": "https://mahadbt.maharashtra.gov.in/",
                "lastUpdated": "2026-08-27",
                "applicationUrl": "https://mahadbt.maharashtra.gov.in/",
                "statusCheckUrl": "https://mahadbt.maharashtra.gov.in/",
            },
            
            # Protected Cultivation / Polyhouse
            {
                "id": "protected-cultivation-maha",
                "name": "संरक्षित खेती (पॉलीहाउस) सहायता",
                "category": "polyhouse",
                "state": "Maharashtra",
                "description": "पॉलीहाउस, शेडनेट और संरक्षित खेती संरचनाओं के लिए सब्सिडी",
                "benefit": "संरक्षित खेती संरचना पर सब्सिडी",
                "subsidy": "लागत का 50% (अधिकतम सीमा लागू)",
                "eligibility": [
                    "महाराष्ट्र के किसान",
                    "न्यूनतम भूमि आवश्यकता (योजना अनुसार)",
                    "जल स्रोत उपलब्ध",
                ],
                "documents": [
                    "आधार कार्ड",
                    "बैंक पासबुक",
                    "भूमि दस्तावेज़ (7/12, 8-अ)",
                    "जल उपलब्धता प्रमाण",
                ],
                "applicationProcess": [
                    "MahaDBT पोर्टल पर जाएं",
                    "बागवानी/संरक्षित खेती योजना चुनें",
                    "आवेदन पत्र भरें",
                    "तकनीकी प्रस्ताव/उद्धरण संलग्न करें",
                    "दस्तावेज़ अपलोड करें",
                    "स्वीकृति के बाद निर्माण करवाएं",
                    "सत्यापन के बाद सब्सिडी प्राप्त करें",
                ],
                "deadline": None,
                "officialUrl": "https://mahadbt.maharashtra.gov.in/",
                "source": "महाराष्ट्र सरकार - बागवानी विभाग",
                "sourceUrl": "https://mahadbt.maharashtra.gov.in/",
                "lastUpdated": "2026-08-27",
                "applicationUrl": "https://mahadbt.maharashtra.gov.in/",
                "statusCheckUrl": "https://mahadbt.maharashtra.gov.in/",
            },
            
            # Beekeeping (Allied Farming)
            {
                "id": "beekeeping-support-maha",
                "name": "मधुमक्खी पालन सहायता योजना",
                "category": "allied",
                "subcategory": "beekeeping",
                "state": "Maharashtra",
                "description": "मधुमक्खी पालन के लिए बॉक्स, उपकरण और प्रशिक्षण पर सहायता",
                "benefit": "मधुमक्खी बॉक्स और उपकरणों पर सब्सिडी",
                "subsidy": "लागत का 40-50% (श्रेणी अनुसार)",
                "eligibility": [
                    "महाराष्ट्र के किसान/उद्यमी",
                    "प्रशिक्षण प्राप्त (या प्रशिक्षण लेने के इच्छुक)",
                ],
                "documents": [
                    "आधार कार्ड",
                    "बैंक खाता विवरण",
                    "प्रशिक्षण प्रमाण पत्र (यदि हो)",
                ],
                "applicationProcess": [
                    "MahaDBT या बागवानी विभाग पोर्टल पर जाएं",
                    "मधुमक्खी पालन योजना के लिए आवेदन करें",
                    "दस्तावेज़ जमा करें",
                    "प्रशिक्षण में भाग लें (यदि आवश्यक हो)",
                    "स्वीकृति प्राप्त करें",
                    "उपकरण खरीदें",
                    "सब्सिडी प्राप्त करें",
                ],
                "deadline": None,
                "officialUrl": "https://mahadbt.maharashtra.gov.in/",
                "source": "महाराष्ट्र सरकार - बागवानी विभाग",
                "sourceUrl": "https://mahadbt.maharashtra.gov.in/",
                "lastUpdated": "2026-08-27",
                "applicationUrl": "https://mahadbt.maharashtra.gov.in/",
                "statusCheckUrl": "https://mahadbt.maharashtra.gov.in/",
            },
            
            # Mushroom Cultivation (Allied Farming)
            {
                "id": "mushroom-support-maha",
                "name": "मशरूम खेती सहायता योजना",
                "category": "allied",
                "subcategory": "mushroom",
                "state": "Maharashtra",
                "description": "मशरूम उत्पादन इकाई स्थापना और प्रशिक्षण के लिए सहायता",
                "benefit": "मशरूम यूनिट स्थापना पर सब्सिडी",
                "subsidy": "लागत का 40-50%",
                "eligibility": [
                    "महाराष्ट्र के किसान/उद्यमी",
                    "उपयुक्त स्थान उपलब्ध",
                    "प्रशिक्षण लेने के इच्छुक",
                ],
                "documents": [
                    "आधार कार्ड",
                    "बैंक पासबुक",
                    "स्थान विवरण/दस्तावेज़",
                ],
                "applicationProcess": [
                    "MahaDBT पोर्टल पर जाएं",
                    "बागवानी/मशरूम योजना चुनें",
                    "आवेदन भरें",
                    "प्रशिक्षण प्राप्त करें",
                    "यूनिट स्थापना करें",
                    "सत्यापन के बाद सब्सिडी प्राप्त करें",
                ],
                "deadline": None,
                "officialUrl": "https://mahadbt.maharashtra.gov.in/",
                "source": "महाराष्ट्र सरकार - बागवानी विभाग",
                "sourceUrl": "https://mahadbt.maharashtra.gov.in/",
                "lastUpdated": "2026-08-27",
                "applicationUrl": "https://mahadbt.maharashtra.gov.in/",
                "statusCheckUrl": "https://mahadbt.maharashtra.gov.in/",
            },
            
            # Soil Health Card
            {
                "id": "soil-health-card",
                "name": "मृदा स्वास्थ्य कार्ड योजना",
                "category": "modern",
                "state": "All India",
                "description": "मिट्टी की गुणवत्ता जांच और पोषक तत्व सिफारिशें",
                "benefit": "निःशुल्क मिट्टी परीक्षण और सिफारिश कार्ड",
                "subsidy": None,
                "eligibility": [
                    "सभी किसान",
                ],
                "documents": [
                    "आधार कार्ड",
                    "भूमि विवरण",
                ],
                "applicationProcess": [
                    "निकटतम कृषि विभाग कार्यालय में जाएं",
                    "मिट्टी के नमूने जमा करें",
                    "मृदा स्वास्थ्य कार्ड प्राप्त करें",
                ],
                "deadline": None,
                "officialUrl": "https://soilhealth.dac.gov.in/",
                "source": "भारत सरकार - कृषि मंत्रालय",
                "sourceUrl": "https://soilhealth.dac.gov.in/",
                "lastUpdated": "2026-08-27",
                "applicationUrl": "https://soilhealth.dac.gov.in/",
                "statusCheckUrl": None,
            },
        ]
    
    def get_all_schemes(self) -> List[Dict]:
        """Get all available schemes"""
        return self.schemes
    
    def get_scheme_by_id(self, scheme_id: str) -> Optional[Dict]:
        """Get a specific scheme by ID"""
        for scheme in self.schemes:
            if scheme["id"] == scheme_id:
                return scheme
        return None
    
    def get_schemes_by_category(self, category: str) -> List[Dict]:
        """Get schemes filtered by category"""
        return [s for s in self.schemes if s["category"] == category]
    
    def search_schemes(self, query: str) -> List[Dict]:
        """Search schemes by name or description"""
        query_lower = query.lower()
        results = []
        for scheme in self.schemes:
            if (query_lower in scheme["name"].lower() or 
                query_lower in scheme["description"].lower()):
                results.append(scheme)
        return results

# Global instance
scheme_service = SchemeService()
