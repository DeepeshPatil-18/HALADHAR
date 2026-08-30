-- ============================================================
-- HALADHAR — Full Demo Seed Data
-- Covers: buyer_requirements, groups, schemes, training_resources
-- (farmer_profiles, produce_listings, local_needs, chat_history
--  are user-generated; seeded only minimally as examples)
-- ============================================================

-- ============================================================
-- buyer_requirements
-- ============================================================
INSERT INTO buyer_requirements
  (product, quantity_needed, unit, quality_grade, price_range_min, price_range_max, required_by, state, district, contact_method, status)
VALUES
  ('Soybean',          2000, 'kg',  'Grade A',    4000, 4800,  CURRENT_DATE + INTERVAL '30 days', 'Maharashtra', 'Jalgaon',     'wa.me/919823401111', 'active'),
  ('Onion',            5000, 'kg',  'Medium',     1000, 1600,  CURRENT_DATE + INTERVAL '14 days', 'Maharashtra', 'Nashik',      'wa.me/919823401112', 'active'),
  ('Tomato',            500, 'kg',  'A',          1000, 1500,  CURRENT_DATE + INTERVAL '30 days', 'Maharashtra', 'Nashik',      'wa.me/919876543210', 'active'),
  ('Wheat',            3000, 'kg',  'Grade A',    2100, 2400,  CURRENT_DATE + INTERVAL '45 days', 'Maharashtra', 'Aurangabad',  'wa.me/919823401113', 'active'),
  ('Cotton',           1500, 'kg',  'Long Staple',5800, 6500,  CURRENT_DATE + INTERVAL '20 days', 'Maharashtra', 'Amravati',    'wa.me/919823401114', 'active'),
  ('Turmeric',          300, 'kg',  'Polished',   8000,10500,  CURRENT_DATE + INTERVAL '60 days', 'Maharashtra', 'Sangli',      'wa.me/919823401115', 'active'),
  ('Pomegranate',       400, 'kg',  'Bhagwa',     6000, 8000,  CURRENT_DATE + INTERVAL '21 days', 'Maharashtra', 'Solapur',     'wa.me/919823401116', 'active'),
  ('Chilli (Dry)',      200, 'kg',  'Grade 1',   12000,16000,  CURRENT_DATE + INTERVAL '30 days', 'Maharashtra', 'Latur',       'wa.me/919823401117', 'active'),
  ('Maize',            4000, 'kg',  'Grade A',    1800, 2100,  CURRENT_DATE + INTERVAL '15 days', 'Maharashtra', 'Dhule',       'wa.me/919823401118', 'active'),
  ('Grapes (Table)',    600, 'kg',  'Export',     4500, 6500,  CURRENT_DATE + INTERVAL '10 days', 'Maharashtra', 'Nashik',      'wa.me/919823401119', 'active'),
  ('Oyster Mushroom',   100, 'kg',  'Fresh',       150,  250,  CURRENT_DATE + INTERVAL '14 days', 'Maharashtra', 'Pune',        'wa.me/919876543211', 'active'),
  ('Honey',              50, 'kg',  'Pure',        300,  500,  CURRENT_DATE + INTERVAL '60 days', 'Maharashtra', 'Nashik',      'wa.me/919876543212', 'active'),
  ('Broiler Chicken',   200, 'kg',  'Live',         90,  120,  CURRENT_DATE + INTERVAL '7 days',  'Maharashtra', 'Ahmednagar',  'wa.me/919876543213', 'active'),
  ('Fish (Rohu)',       150, 'kg',  'Fresh',       180,  250,  CURRENT_DATE + INTERVAL '3 days',  'Maharashtra', 'Kolhapur',    'wa.me/919876543214', 'active'),
  ('Milk (Buffalo)',   1000, 'litre','A Grade',     58,   65,  CURRENT_DATE + INTERVAL '7 days',  'Maharashtra', 'Pune',        'wa.me/919823401120', 'active'),
  ('Eggs (Desi)',      5000, 'units','Brown',        7,    9,  CURRENT_DATE + INTERVAL '5 days',  'Maharashtra', 'Nagpur',      'wa.me/919823401121', 'active'),
  ('Banana',           2000, 'kg',  'G9 Cavendish',2200, 2800, CURRENT_DATE + INTERVAL '7 days', 'Maharashtra', 'Jalgaon',     'wa.me/919823401122', 'active'),
  ('Sugarcane',       50000, 'kg',  'Standard',    285,  295,  CURRENT_DATE + INTERVAL '90 days', 'Maharashtra', 'Kolhapur',    'wa.me/919823401123', 'active'),
  ('Groundnut',        1000, 'kg',  'Bold',        5200, 5800, CURRENT_DATE + INTERVAL '25 days', 'Maharashtra', 'Osmanabad',   'wa.me/919823401124', 'active'),
  ('Vermicompost',      500, 'kg',  'Organic',      12,   18,  CURRENT_DATE + INTERVAL '30 days', 'Maharashtra', 'Aurangabad',  'wa.me/919823401125', 'active');


-- ============================================================
-- groups (WhatsApp farmer network directory)
-- ============================================================
INSERT INTO groups (name, description, enterprise_type, state, district, join_link) VALUES
  ('Nashik Poultry Farmers',        'Group for poultry farmers in Nashik district sharing tips, prices and disease alerts',        'poultry',        'Maharashtra', 'Nashik',      'https://wa.me/919000000001'),
  ('Maharashtra Beekeepers',        'Apiculture farmers across Maharashtra - honey markets, disease prevention, equipment',        'apiculture',     'Maharashtra',  NULL,          'https://wa.me/919000000002'),
  ('Pune Mushroom Growers',         'Mushroom cultivation group for Pune region - spawn sources, buyers, techniques',              'mushroom',       'Maharashtra', 'Pune',        'https://wa.me/919000000003'),
  ('Jalgaon Banana Farmers',        'Banana farmers of Jalgaon - G9 cultivation, export buyers, FPO discussions',                 'horticulture',   'Maharashtra', 'Jalgaon',     'https://wa.me/919000000004'),
  ('Nashik Grape Growers',          'Grape growers in Nashik - export quality, Thompson Seedless, Bangalore Blue tips',           'horticulture',   'Maharashtra', 'Nashik',      'https://wa.me/919000000005'),
  ('Maharashtra Dairy Network',     'Dairy farmers across Maharashtra - buffalo/cow management, cooperative milk rates',          'dairy',          'Maharashtra',  NULL,          'https://wa.me/919000000006'),
  ('Kolhapur Fish Farmers',         'Inland fish farming in Kolhapur - Rohu, Catla, Tilapia farmers network',                    'fishery',        'Maharashtra', 'Kolhapur',    'https://wa.me/919000000007'),
  ('Sangli Turmeric Growers',       'Turmeric farmers in Sangli/Solapur belt - prices, processing, organic certification',        'spices',         'Maharashtra', 'Sangli',      'https://wa.me/919000000008'),
  ('Amravati Cotton Growers',       'Cotton farmers of Vidarbha - BT cotton tips, MSP news, ginning market updates',             'field_crops',    'Maharashtra', 'Amravati',    'https://wa.me/919000000009'),
  ('Maharashtra Soybean Network',   'Soybean farmers across Maharashtra - mandi prices, monsoon timing, pest alerts',            'field_crops',    'Maharashtra',  NULL,          'https://wa.me/919000000010'),
  ('Pune Organic Farmers',          'Organic vegetable and grain farmers in Pune district - PGS certification support',          'organic',        'Maharashtra', 'Pune',        'https://wa.me/919000000011'),
  ('Vidarbha Goat Farmers',         'Goat rearing farmers of Vidarbha - Osmanabadi breed tips, veterinary guidance',             'goat',           'Maharashtra', 'Amravati',    'https://wa.me/919000000012'),
  ('Nagpur Orange Growers',         'Nagpur mandarin orange farmers - pre-cooling, APEDA export, mandi rates',                   'horticulture',   'Maharashtra', 'Nagpur',      'https://wa.me/919000000013'),
  ('Maharashtra FPO Network',       'Farmer Producer Organisation members - collective marketing, input procurement',             'fpo',            'Maharashtra',  NULL,          'https://wa.me/919000000014'),
  ('Marathwada Vermicompost Group', 'Organic input producers in Marathwada - vermicompost, biofertilizer buyers',                'vermicompost',   'Maharashtra', 'Aurangabad',  'https://wa.me/919000000015');


-- ============================================================
-- schemes
-- ============================================================
INSERT INTO schemes
  (name, description, eligibility, benefits, required_documents, application_process, official_link, source_url, applicable_states, applicable_enterprise_types)
VALUES
  (
    'PM-KISAN Samman Nidhi',
    'Direct income support of ₹6,000 per year to small and marginal farmers in three equal instalments of ₹2,000 directly to their bank accounts.',
    'Small and marginal farmers with landholding up to 2 hectares. Family must not hold constitutional post, pay income tax, or be retired government employee.',
    '₹6,000 per year in three instalments of ₹2,000 each directly to bank account via DBT.',
    ARRAY['Aadhaar card', 'Bank passbook', '7/12 extract or land record', 'Mobile number linked to Aadhaar'],
    'Register at pmkisan.gov.in or through Common Service Centre (CSC). Village level Patwari or Lekhpal verifies land records.',
    'https://pmkisan.gov.in',
    'https://pmkisan.gov.in/RegistrationForm.aspx',
    ARRAY['Maharashtra','Madhya Pradesh','Uttar Pradesh','Gujarat','Rajasthan','All States'],
    ARRAY['field_crops','horticulture','dairy','poultry','goat','all']
  ),
  (
    'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    'Crop insurance scheme providing financial support to farmers suffering crop loss/damage due to unforeseen events including natural calamities, pests and diseases.',
    'All farmers including sharecroppers and tenant farmers growing notified crops in notified areas. Compulsory for loanee farmers; voluntary for others.',
    'Sum insured based on scale of finance per hectare. Premium: 2% for Kharif, 1.5% for Rabi, 5% for commercial/horticultural crops.',
    ARRAY['Aadhaar card', 'Bank account details', 'Land record / 7-12', 'Sowing certificate'],
    'Apply through nearest bank branch, CSC centre, or online at pmfby.gov.in before cutoff date for each season.',
    'https://pmfby.gov.in',
    'https://pmfby.gov.in',
    ARRAY['Maharashtra','All States'],
    ARRAY['field_crops','horticulture','all']
  ),
  (
    'Kisan Credit Card (KCC)',
    'Provides farmers with timely and adequate credit for agricultural needs including cultivation, maintenance, allied activities and consumption requirements.',
    'All farmers — individual, joint borrowers, tenant farmers, sharecroppers, SHG or JLG members.',
    'Revolving credit limit based on landholding and crops. Interest subvention brings effective interest rate to 4% per annum for loans up to ₹3 lakh.',
    ARRAY['Aadhaar','PAN card','Land records','Passport photo','Bank account'],
    'Apply at nearest bank branch or through PM-KISAN portal. Also available through CSC and regional rural banks.',
    'https://www.nabard.org/auth/writereaddata/tender/1907180417KCC%20Revised%20Scheme.pdf',
    'https://pmkisan.gov.in/kcc',
    ARRAY['All States'],
    ARRAY['all']
  ),
  (
    'National Livestock Mission — Goat Unit',
    'NABARD-backed subsidy for establishing goat farming units to generate rural employment and improve farmer incomes.',
    'BPL/small and marginal farmers, SHGs, FPOs, NGOs. Priority to SC/ST/women beneficiaries.',
    '25–33% capital subsidy on project cost. NABARD provides refinance to lending banks.',
    ARRAY['Aadhaar','BPL card (if applicable)','Project report','Bank loan sanction letter','Land/shed proof'],
    'Submit project report to nearest NABARD district office or through sponsoring bank.',
    'https://www.nabard.org/content1.aspx?id=596',
    'https://nlm.udyamimitra.in',
    ARRAY['Maharashtra','All States'],
    ARRAY['goat','sheep']
  ),
  (
    'Maharashtra Shetkari Yojana — Tractor Subsidy',
    'State government scheme providing subsidy on purchase of tractors to small and marginal farmers for mechanising agriculture.',
    'Small/marginal farmers with landholding 1–5 hectares. Priority to SC/ST farmers and women farmers.',
    'Up to 50% subsidy on tractor cost (subject to ceiling). SC/ST farmers eligible for higher subsidy.',
    ARRAY['7/12 extract','Aadhaar card','Caste certificate (SC/ST)','Bank passbook','Tractor quotation'],
    'Apply through Maharashtra Mahaagri portal or district agriculture office.',
    'https://mahadbt.maharashtra.gov.in',
    'https://agri.maharashtra.gov.in',
    ARRAY['Maharashtra'],
    ARRAY['field_crops','horticulture','all']
  ),
  (
    'National Beekeeping & Honey Mission (NBHM)',
    'Mission to develop beekeeping as an enterprise for additional income generation and pollination support for agriculture.',
    'Individual beekeepers, FPOs, Self Help Groups, cooperatives. Beginners welcome.',
    'Subsidy on bee colonies, hive boxes, extraction equipment. Training support through Khadi & Village Industries.',
    ARRAY['Aadhaar','Bank account','Proof of land/shed for hive placement','Application form'],
    'Apply through KVIC district office or state horticulture/agriculture department.',
    'https://vikaspedia.in/agriculture/apiculture/national-bee-keeping-honey-mission',
    'https://nbhm.gov.in',
    ARRAY['All States'],
    ARRAY['apiculture']
  ),
  (
    'PM Matsya Sampada Yojana (PMMSY)',
    'Flagship scheme for development of fisheries sector — focuses on inland fisheries, aquaculture, seaweed and ornamental fish.',
    'Fishers, fish farmers, SHGs, FPOs, cooperatives, entrepreneurs in fisheries sector.',
    'Capital subsidy up to 40% for general and 60% for SC/ST/women on fish pond construction, equipment, seed, feed.',
    ARRAY['Aadhaar','Bank passbook','Land/pond ownership proof','Project report'],
    'Apply through district fisheries office or online at pmmsy.gov.in',
    'https://pmmsy.dof.gov.in',
    'https://dof.gov.in/pmmsy',
    ARRAY['Maharashtra','All States'],
    ARRAY['fishery','aquaculture']
  ),
  (
    'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
    'Provides end-to-end solutions for irrigation with "Har Khet Ko Pani" and "More Crop Per Drop" approach.',
    'All farmers. Priority to small/marginal farmers, SC/ST farmers, drought-prone areas.',
    'Subsidy on drip and sprinkler irrigation systems. 55% subsidy for small farmers, 45% for others.',
    ARRAY['7/12 extract','Aadhaar','Bank account','Irrigation source proof'],
    'Apply through district agriculture office or MahaDBT portal in Maharashtra.',
    'https://pmksy.gov.in',
    'https://mahadbt.maharashtra.gov.in',
    ARRAY['Maharashtra','All States'],
    ARRAY['field_crops','horticulture','vegetable','all']
  ),
  (
    'Mukhyamantri Shetkari Sahayata Yojana (Maharashtra)',
    'Maharashtra state relief scheme for farmers affected by natural calamities including drought, flood, hailstorm and unseasonal rain.',
    'All crop-growing farmers registered in Maharashtra. Damage must be certified by the district administration.',
    '₹10,000–₹15,000 per hectare compensation for crop loss. Special relief for complete crop failure.',
    ARRAY['7/12','8A extract','Panchanama report','Bank account','Aadhaar'],
    'Apply at taluka/district collectorate within 30 days of calamity notification. Verification by Talathi and Circle Officer.',
    'https://relief.maharashtra.gov.in',
    'https://agri.maharashtra.gov.in/1086/Naisar-Paristhiti',
    ARRAY['Maharashtra'],
    ARRAY['field_crops','horticulture','all']
  ),
  (
    'Organic Farming Scheme — Paramparagat Krishi Vikas Yojana (PKVY)',
    'Promotes organic farming through cluster approach — farmers form groups of 50 who collectively adopt organic farming with certification support.',
    'Farmers willing to form cluster group of at least 50 members and convert to organic practices.',
    '₹31,500 per hectare over 3 years for organic input purchase, certification (PGS/3rd party), and capacity building.',
    ARRAY['Aadhaar','7/12','Group formation certificate','Bank account'],
    'Apply through agriculture department or Jaivik Kheti portal. Cluster formation is mandatory.',
    'https://pgsindia-ncof.gov.in',
    'https://pkvy.gov.in',
    ARRAY['All States'],
    ARRAY['organic','field_crops','horticulture','vegetable']
  );


-- ============================================================
-- training_resources
-- ============================================================
INSERT INTO training_resources
  (topic, crop_activity, language, duration, material_description, source_link, enterprise_type)
VALUES
  -- Soybean
  ('Soybean Cultivation Practices',           'sowing',       'mr', '45 min', 'ICAR-IISR video on soybean seed selection, spacing, recommended varieties for Vidarbha and Marathwada', 'https://icar.org.in/content/soybean-cultivation', 'field_crops'),
  ('Soybean Pest & Disease Management',       'protection',   'hi', '30 min', 'KVK Jalgaon module on yellow mosaic virus, girdle beetle and pod borer management in soybean',         'https://kvk.icar.gov.in/soybean-pest',           'field_crops'),
  ('Soybean Harvest & Storage',               'harvest',      'en', '20 min', 'Post-harvest management — threshing, moisture testing, storage in hermetic bags for soybean',           'https://icar.org.in/soybean-postharvest',         'field_crops'),

  -- Onion
  ('Onion Nursery to Transplanting',          'sowing',       'mr', '40 min', 'NHRDF module on onion nursery bed preparation, seedling management, transplanting spacing for Nashik belt', 'https://nhrdf.org/onion-nursery',               'horticulture'),
  ('Onion Basal Rot & Thrips Control',        'protection',   'hi', '25 min', 'Integrated pest management for thrips and Fusarium basal rot in onion — KVK Nasik recommendations',     'https://kvk.icar.gov.in/onion-ipm',              'horticulture'),
  ('Onion Storage & Grading',                 'harvest',      'en', '35 min', 'Low-cost ventilated storage structure design, grading standards, packaging for export quality onion',    'https://nhrdf.org/onion-storage',                'horticulture'),

  -- Cotton
  ('BT Cotton Cultivation Guide',             'sowing',       'mr', '50 min', 'CICR recommended practices for BT cotton in Vidarbha — soil preparation, spacing, water management',    'https://cicr.org.in/bt-cotton-guide',            'field_crops'),
  ('Pink Bollworm Management in Cotton',      'protection',   'hi', '30 min', 'CICR advisory on pink bollworm — monitoring, pheromone traps, need-based insecticide schedule',         'https://cicr.org.in/pink-bollworm',              'field_crops'),

  -- Banana
  ('G9 Banana Cultivation',                   'sowing',       'mr', '45 min', 'NRCB guide on G9 Cavendish banana for Jalgaon district — corm treatment, spacing, fertilizer schedule', 'https://nrcb.res.in/g9-banana',                  'horticulture'),
  ('Banana Sigatoka & Panama Wilt Management','protection',   'mr', '25 min', 'NHB advisory on yellow sigatoka, Panama wilt disease identification and cultural control in banana',    'https://nhb.gov.in/banana-disease',              'horticulture'),

  -- Dairy
  ('Dairy Farming Fundamentals',              'management',   'hi', '60 min', 'NDRI module on HF/Jersey/crossbred cow management, housing, feeding standards for 5–10 cow unit',      'https://ndri.res.in/dairy-fundamentals',          'dairy'),
  ('Mastitis Prevention & Milk Quality',      'health',       'mr', '30 min', 'KVK Pune advisory on mastitis detection, California Mastitis Test, milking hygiene protocols',          'https://kvk.icar.gov.in/mastitis',               'dairy'),
  ('Silage Making from Maize',                'feeding',      'en', '40 min', 'IGFRI guide on maize silage preparation using plastic bag and pit method for dairy cattle feeding',     'https://igfri.res.in/silage-maize',              'dairy'),

  -- Goat
  ('Osmanabadi Goat Rearing',                 'management',   'mr', '45 min', 'Introductory module on Osmanabadi goat breed characteristics, housing, feeding and health care',        'https://cirg.res.in/osmanabadi',                 'goat'),
  ('Goat Disease Prevention — PPR & FMD',     'health',       'hi', '20 min', 'CIRG advisory on PPR and FMD vaccination schedule, symptoms identification and biosecurity measures',  'https://cirg.res.in/ppr-fmd-prevention',         'goat'),

  -- Poultry
  ('Backyard Poultry Management',             'management',   'mr', '35 min', 'ICAR-DFMD beginner module on desi chicken rearing — brooding, feeding, disease prevention for 200 birds', 'https://dfmd.icar.gov.in/backyard-poultry',   'poultry'),
  ('Newcastle Disease Prevention',            'health',       'hi', '20 min', 'Rajiv Gandhi Centre advisory on Newcastle disease — vaccination schedule, biosecurity, outbreak response', 'https://icar.org.in/newcastle-disease',        'poultry'),

  -- Fishery
  ('Inland Fish Farming — Rohu & Catla',      'management',   'mr', '50 min', 'CIFA guide on composite fish culture with Rohu, Catla and Mrigal — pond preparation, stocking density', 'https://cifa.nic.in/composite-fish-culture',   'fishery'),
  ('Fish Disease Management',                 'health',       'hi', '25 min', 'CIBA advisory on common bacterial and fungal diseases in freshwater fish farming — prevention and cure',  'https://ciba.res.in/fish-disease',             'fishery'),

  -- Mushroom
  ('Oyster Mushroom Cultivation',             'management',   'mr', '40 min', 'ICAR-DMR step-by-step guide on substrate preparation, bag filling, spawn run and fruiting body harvest', 'https://dmr.icar.gov.in/oyster-mushroom',      'mushroom'),
  ('Mushroom Contamination Control',          'protection',   'hi', '20 min', 'Managing Trichoderma and bacterial blotch contamination — sterilisation, hygiene and spawn quality tips',  'https://dmr.icar.gov.in/contamination-control','mushroom'),

  -- Beekeeping
  ('Beekeeping for Beginners',                'management',   'mr', '45 min', 'KVIC guide on Apis cerana and Apis mellifera colony management, seasonal movement, honey extraction',  'https://kvic.gov.in/beekeeping-beginners',       'apiculture'),
  ('Bee Disease & Pest Management',           'health',       'en', '30 min', 'AICRP-HC advisory on Varroa mite, sacbrood virus, chalk brood identification and organic treatments',  'https://kvic.gov.in/bee-disease',                'apiculture'),

  -- Organic / Vermicompost
  ('Vermicomposting Setup',                   'management',   'mr', '30 min', 'ICAR-IARI module on bed construction, Eisenia fetida/Lumbricus earthworm species, moisture management', 'https://iari.res.in/vermicompost-setup',         'vermicompost'),
  ('Organic Certification — PGS India',       'marketing',    'hi', '35 min', 'Step-by-step guide on Participatory Guarantee System (PGS) certification for organic farmers in India', 'https://pgsindia-ncof.gov.in/pgscertification',  'organic'),

  -- Market & Finance
  ('Using e-NAM Platform',                    'marketing',    'hi', '25 min', 'Step-by-step tutorial on registering on e-NAM, uploading produce, bidding process and payment receipt', 'https://www.enam.gov.in/web/',                   'field_crops'),
  ('FPO Formation & Benefits',                'management',   'mr', '50 min', 'NABARD guide on forming a Farmer Producer Organisation — registration, capital, marketing advantage',   'https://www.nabard.org/content1.aspx?id=585',    'fpo'),
  ('Kisan Credit Card Application',           'finance',      'hi', '20 min', 'How to apply for KCC — documents, bank process, interest subvention and revolving credit usage guide',  'https://pmkisan.gov.in/kcc',                     'all');
