export interface KnowledgeEntry {
  keywords: string[];
  topic: string;
  response: string;
  suggestSOS?: boolean;
}

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    keywords: ['flood', 'water', 'submerged', 'inundation', 'overflow', 'drowning', 'बाढ़', 'पानी', 'వరదలు', 'வெள்ளம்', 'వరద'],
    topic: 'Flood Emergency & Safety',
    response: `🌊 **Flood Safety Protocol (SafeGuide Local Guidance)**:
1. **Immediate Safety**: Move to upper floors or sturdy high ground immediately.
2. **Utilities**: Turn off main electricity and gas if water is approaching your property.
3. **Hazardous Motion**: Never walk or drive through flowing water. 6 inches of rapid water can sweep adults off balance.
4. **Drinking Water**: Drink only boiled or bottled water to prevent waterborne contamination.
5. **SOS Request**: If you are trapped, injured, or require immediate evacuation, press the **CONFIRM SOS** button in ResQ to alert the Control Center.`,
    suggestSOS: true
  },
  {
    keywords: ['earthquake', 'tremor', 'shaking', 'quake', 'building crack', 'भूकंप', 'ভূমিকম্প', 'భూకంపం', 'நிலநடுக்கம்'],
    topic: 'Earthquake Action Plan',
    response: `🫨 **Earthquake Safety Protocol**:
1. **Drop, Cover, Hold On**:
   - **Drop** to your hands and knees.
   - **Cover** your head and neck under a sturdy table or desk.
   - **Hold On** until all shaking stops.
2. **If Outdoors**: Move to an open area away from tall buildings, power lines, and brick walls.
3. **If in Bed**: Stay in bed, cover your head with a pillow.
4. **After Tremors**: Check for gas leaks and structural cracks. Do NOT use elevators.`,
    suggestSOS: false
  },
  {
    keywords: ['fire', 'smoke', 'flame', 'burning', 'blast', 'gas leak', 'आग', 'തീപ്പിടുത്തം', 'ஆஃகு', 'మంటలు'],
    topic: 'Fire & Smoke Inhalation Safety',
    response: `🔥 **Fire Safety Protocol**:
1. **Get Low & Go**: Crawl on your hands and knees under toxic smoke toward the nearest exit.
2. **Stop, Drop, Roll**: If clothing catches fire, Stop immediately, Drop to ground, and Roll back and forth.
3. **Door Check**: Feel door handles with the back of your hand before opening. If hot, do NOT open.
4. **Call Fire Department**: Dial **101** or **112** or confirm SOS for Fire & Rescue dispatch in ResQ.`,
    suggestSOS: true
  },
  {
    keywords: ['cyclone', 'storm', 'wind', 'gale', 'hurricane', 'typhoon', 'तूफान', 'తుఫాను', 'புயல்'],
    topic: 'Cyclone & Windstorm Protection',
    response: `🌀 **Cyclone Safety Protocol**:
1. **Stay Indoors**: Remain in the strongest interior room away from windows and glass doors.
2. **Storm Eye Warning**: If the wind drops suddenly, do NOT go outside; it is the eye of the cyclone and violent winds will resume from the opposite direction soon.
3. **Charge Devices**: Keep phone, flashlight, and power bank charged.
4. **Evacuation**: Follow local district magistrate evacuation alerts promptly.`,
    suggestSOS: false
  },
  {
    keywords: ['kit', 'bag', 'preparedness', 'supplies', 'emergency kit', 'checklist', 'सामग्री'],
    topic: 'Emergency Survival Kit',
    response: `🎒 **Recommended 72-Hour Emergency Kit**:
1. **Water**: 3 Liters per person per day (min 3-day supply).
2. **Food**: Dry snacks, canned food, energy bars, ORS packets.
3. **Medical**: First aid kit, prescription medicines, antiseptic.
4. **Tools**: High-beam flashlight, extra batteries, whistle, pocket multi-tool.
5. **Documents**: Copies of Aadhaar, insurance, land documents in waterproof bags.
*You can track your preparation in the **Emergency Kit** tab of ResQ!*`,
    suggestSOS: false
  },
  {
    keywords: ['sos', 'what is sos', 'meaning', 'help meaning', 'how sos works', 'मदद'],
    topic: 'About SOS Feature',
    response: `🚨 **What is SOS in ResQ?**:
SOS stands for Save Our Souls (Emergency Rescue Signal).
In ResQ, entering the **I'm in an Emergency** workflow asks 7 quick progressive questions (Disaster type, severity, people count, special needs, required help, location) and displays a review screen.
**Important**: ResQ only creates a demo incident in the Control Center when you explicitly press **CONFIRM SOS**. Typing keywords in this chat will NEVER send an emergency call automatically.`,
    suggestSOS: false
  }
];

const LOCALIZED_FALLBACK_INTRO: Record<string, string> = {
  Hindi: `🤖 **SafeGuide AI (सुरक्षा मार्गदर्शक - हिंदी)**:

आपकी सुरक्षा हमारी सर्वोच्च प्राथमिकता है। 

**आपदा सुरक्षा निर्देश**:
1. **शांत रहें**: तुरंत अपने आसपास के खतरों का आकलन करें।
2. **आधिकारिक निर्देश**: ज़िला प्रशासन, एनडीआरएफ (NDRF) और आपदा प्रबंधन के निर्देशों का पालन करें।
3. **आपातकालीन किट**: पीने का पानी, टॉर्च, प्राथमिक चिकित्सा दवाएं और खाद्य सामग्री साथ रखें।
4. **आपातकालीन सहायता (SOS)**: यदि आप तुरंत खतरे में हैं और बचाव की आवश्यकता है, तो ऐप में **🚨 SOS (CONFIRM SOS)** बटन दबाएं।`,

  Telugu: `🤖 **SafeGuide AI (సేఫ్‌గైడ్ AI - తెలుగు)**:

మీ భద్రత మా అత్యున్నత ప్రాధాన్యత.

**విపత్తు భద్రతా మార్గదర్శకాలు**:
1. **శాంతంగా ఉండండి**: మీ చుట్టూ ఉన్న ప్రమాద పరిస్థితిని అంచనా వేయండి.
2. **అధికారిక ఆదేశాలు**: జిల్లా కలెక్టరేట్, NDRF మరియు విపత్తు నిర్వహణ అధికారుల ఆదేశాలను పాటించండి.
3. **ఎమర్జెన్సీ కిట్**: నీరు, టార్చ్ లైట్, ప్రథమ చికిత్స మందులు సిద్ధంగా ఉంచుకోండి.
4. **అత్యవసర సహాయం (SOS)**: మీరు ప్రమాదంలో ఉండి అత్యవసర రక్షణ కావలసి వస్తే, యాప్‌లో **🚨 CONFIRM SOS** నొక్కండి.`,

  Tamil: `🤖 **SafeGuide AI (பாதுகாப்பு வழிகாட்டி - தமிழ்)**:

உங்கள் பாதுகாப்பு எங்கள் முக்கிய முன்னுரிமை.

**பேரிடர் பாதுகாப்பு வழிகாட்டுதல்**:
1. **அமைதியாக இருங்கள்**: சுற்றியுள்ள ஆபத்துகளை உடனடியாகக் கவனியுங்கள்.
2. **அதிகாரப்பூர்வ அறிவிப்புகள்**: மாவட்ட நிர்வாகம் மற்றும் NDRF வழிகாட்டுதல்களைப் பின்பற்றுங்கள்.
3. **அவசர உதவிப் பை**: குடிநீர், டார்ச் லைட், முதலுதவி மருந்துகளைச் சித்தமாக வையுங்கள்.
4. **அவசர உதவி (SOS)**: நீங்கள் உடனடியாக ஆபத்தில் இருந்தால், **🚨 CONFIRM SOS** பொத்தானை அழுத்துங்கள்.`,

  Kannada: `🤖 **SafeGuide AI (ಸುರಕ್ಷತಾ ಮಾರ್ಗದರ್ಶಿ - ಕನ್ನಡ)**:

ನಿಮ್ಮ ಸುರಕ್ಷತೆ ನಮ್ಮ ಮೊದಲ ಆದ್ಯತೆ.

**ವಿಪತ್ತು ಸುರಕ್ಷತಾ ಮಾರ್ಗದರ್ಶನ**:
1. **ಶಾಂತರಾಗಿರಿ**: ತಕ್ಷಣವೇ ನಿಮ್ಮ ಸುತ್ತಲಿನ ಪರಿಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.
2. **ಅಧಿಕೃತ ಸೂಚನೆಗಳು**: ಜಿಲ್ಲಾಡಳಿತ ಹಾಗೂ NDRF ಸೂಚನೆಗಳನ್ನು ಕಡ್ಡಾಯವಾಗಿ ಪಾಲಿಸಿ.
3. **ಎಮರ್ಜೆನ್ಸಿ ಕಿಟ್**: ಕುಡಿಯುವ ನೀರು, ಟಾರ್ಚ್, ಪ್ರಥಮ ಚಿಕಿತ್ಸಾ ಔಷಧಿಗಳನ್ನು ಇಟ್ಟುಕೊಳ್ಳಿ.
4. **ತುರ್ತು ನೆರವು (SOS)**: ನೀವು ಅಪಾಯದಲ್ಲಿದ್ದರೆ ResQ యాప్ నల్లి **🚨 CONFIRM SOS** ಬಟನ್ ಒತ್ತಿ.`,

  Malayalam: `🤖 **SafeGuide AI (സുരക്ഷാ സഹായി - മലയാളം)**:

നിങ്ങളുടെ സുരക്ഷയാണ് ഞങ്ങളുടെ പ്രാഥമിക ലക്ഷ്യം.

**ദുരന്ത നിവാരണ സുരക്ഷാ നിർദ്ദേശങ്ങൾ**:
1. **ശാന്തരായിരിക്കുക**: ചുറ്റുമുള്ള അപകടസാധ്യത വിലയിരുത്തുക.
2. **ഔദ്യോഗിക നിർദ്ദേശങ്ങൾ**: ജില്ലാ കളക്ടറേറ്റ്, NDRF എന്നിവരുടെ നിർദ്ദേശങ്ങൾ പാലിക്കുക.
3. **അടിയന്തര കിറ്റ്**: കുടിവെള്ളം, ടോർച്ച്, മരുന്നുകൾ എന്നിവ കരുതുക.
4. **അടിയന്തര സഹായം (SOS)**: നിങ്ങൾ അപകടത്തിലാണെങ്കിൽ ആപ്പിലെ **🚨 CONFIRM SOS** ബട്ടൺ അമർത്തുക.`,

  Bengali: `🤖 **SafeGuide AI (সুরক্ষা নির্দেশিকা - বাংলা)**:

আপনার নিরাপত্তা আমাদের প্রথম অগ্রাধিকার।

**দুর্যোগ সুরক্ষা নির্দেশিকা**:
1. **শান্ত থাকুন**: আপনার চারপাশের বিপদ মূল্যায়ন করুন।
2. **সরকারি নির্দেশনা**: জেলা প্রশাসন ও NDRF নির্দেশাবলী অনুসরণ করুন।
3. **জরুরি কিট**: পানীয় জল, টর্চ এবং প্রাথমিক চিকিৎসার ওষুধ প্রস্তুত রাখুন।
4. **জরুরি সাহায্য (SOS)**: আপনি বিপদে থাকলে অবিলম্বে অ্যাপের **🚨 CONFIRM SOS** বোতামটি চাপুন।`,

  Marathi: `🤖 **SafeGuide AI (सुरक्षा मार्गदर्शक - मराठी)**:

तुमची सुरक्षितता आमची सर्वोच्च प्राथमिकता आहे.

**आपत्ती सुरक्षा मार्गदर्शक**:
1. **शांत राहा**: तुमच्या सभोवतालच्या धोक्याचा त्वरित अंदाज घ्या.
2. **अधिकृत सूचना**: जिल्हा प्रशासन आणि NDRF च्या सूचनांचे पालन करा.
3. **आपत्कालीन किट**: पिण्याचे पाणी, टॉर्च, प्रथमोपचार औषधे सोबत ठेवा.
4. **आपत्कालीन मदत (SOS)**: जर तुम्ही धोक्यात असाल तर ॲप मधील **🚨 CONFIRM SOS** बटण दाबा.`,

  Gujarati: `🤖 **SafeGuide AI (સુરક્ષા માર્ગદર્શક - ગુજરાતી)**:

તમારી સુરક્ષા અમારી પ્રાથમિકતા છે.

**આપત્તિ સુરક્ષા માર્ગદર્શિકા**:
1. **શાંત રહો**: તમારી આસપાસના જોખમની તપાસ કરો.
2. **સત્તાવાર સૂચનાઓ**: જિલ્લા વહીવટીતંત્ર અને NDRF ની સૂચનાઓનું પાલન કરો.
3. **ઇમરજન્સી કિટ**: પીવાનું પાણી, ટોર્ચ અને દવાઓ સાથે રાખો.
4. **ઇમરજન્સી મદદ (SOS)**: જો તમે જોખમમાં હોવ તો **🚨 CONFIRM SOS** બટન દબાવો.`,

  Punjabi: `🤖 **SafeGuide AI (ਸੁਰੱਖਿਆ ਗਾਈਡ - ਪੰਜਾਬੀ)**:

ਤੁਹਾਡੀ ਸੁਰੱਖਿਆ ਸਾਡੀ ਪਹਿਲੀ ਪਹਿਲ ਹੈ।

**ਆਫ਼ਤ ਸੁਰੱਖਿਆ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼**:
1. **ਸ਼ਾਂਤ ਰਹੋ**: ਆਪਣੇ ਆਲੇ-ਦੁਆਲੇ ਦੇ ਖ਼ਤਰੇ ਦੀ ਜਾਂਚ ਕਰੋ।
2. **ਸਰਕਾਰੀ ਹਦਾਇਤਾਂ**: ਜ਼ਿਲ੍ਹਾ ਪ੍ਰਸ਼ਾਸਨ ਅਤੇ NDRF ਦੇ ਆਦੇਸ਼ਾਂ ਦੀ ਪਾਲਣਾ ਕਰੋ।
3. **ਐਮਰਜੈਂਸੀ ਕਿੱਟ**: ਪੀਣ ਵਾਲਾ ਪਾਣੀ, ਟਾਰਚ ਅਤੇ ਦਵਾਈਆਂ ਤਿਆਰ ਰੱਖੋ।
4. **ਐਮਰਜੈਂਸੀ ਮਦਦ (SOS)**: ਜੇਕਰ ਤੁਸੀਂ ਖ਼ਤਰੇ ਵਿੱਚ ਹੋ ਤਾਂ **🚨 CONFIRM SOS** ਬਟਨ ਦਬਾਓ।`,

  Odia: `🤖 **SafeGuide AI (ସୁରକ୍ଷା ମାର୍ଗଦର୍ଶକ - ଓଡ଼ିଆ)**:

ଆପଣଙ୍କ ସୁରକ୍ଷା ଆମର ପ୍ରାଥମିକତା ।

**ବିପତ୍ତି ସୁରକ୍ଷା ନିୟମ**:
1. **ଶାନ୍ତ ରୁହନ୍ତୁ**: ନିଜ ଚାରିପାଖର ପରିସ୍ଥିତିକୁ ଦେଖନ୍ତୁ ।
2. **ସରକାରୀ ନିର୍ଦ୍ଦେଶ**: ଜିଲ୍ଲା ପ୍ରଶାସନ ଓ NDRF ର ସୂଚନା ମାନନ୍ତୁ ।
3. **ଇମରଜେନ୍ସି କିଟ୍**: ପିଇବା ପାଣି, ଟର୍ଚ୍ଚ ଓ ପ୍ରାଥମିକ ଚିକିତ୍ସା ଔଷଧ ପାଖରେ ରଖନ୍ତୁ ।
4. **ଆପାତକାଳୀନ ସାହାଯ୍ୟ (SOS)**: ଆପଣ ବିପଦରେ ଥିଲେ **🚨 CONFIRM SOS** ବଟନ୍ ଦବାନ୍ତୁ ।`,

  Assamese: `🤖 **SafeGuide AI (সুৰক্ষা নিৰ্দেশক - অসমীয়া)**:

আপোনাৰ সুৰক্ষা আমাৰ প্ৰধান লক্ষ্য।

**দুৰ্যোগ সুৰক্ষা নীতি**:
1. **শান্ত হৈ থাকক**: চৌপাশৰ বিপদ পৰীক্ষা কৰক।
2. **চৰকাৰী নিৰ্দেশনা**: জিলা প্ৰশাসন আৰু NDRF ৰ নিৰ্দেশ মানি চলক।
3. **জৰুৰী কিট**: খোৱাপানী, টৰ্চ লাইট আৰু প্ৰাথমিক চিকিৎসা সামগ্ৰী মজুত ৰাখক।
4. **জৰুৰী সাহায্য (SOS)**: জৰুৰী অৱস্থাত **🚨 CONFIRM SOS** বুটাম টিপক।`,

  Urdu: `🤖 **SafeGuide AI (حفاظتی رہنما - اردو)**:

آپ کی حفاظت ہماری پہلی ترجیح ہے۔

**آفت سے بچاؤ کے اصول**:
1. **پرسکون رہیں**: اپنے اردگرد کے خطرات کا جائزہ لیں۔
2. **سرکاری ہدایات**: ضلعی انتظامیہ اور NDRF کی ہدایات پر عمل کریں۔
3. **ہنگامی کٹ**: پینے کا پانی، ٹارچ اور ادویات تیار رکھیں۔
4. **ہنگامی امداد (SOS)**: اگر آپ خطرے میں ہیں تو **🚨 CONFIRM SOS** بٹن دبائیں۔`,

  Nepali: `🤖 **SafeGuide AI (सुरक्षा मार्गदर्शक - नेपाली)**:

तपाईंको सुरक्षा हाम्रो पहिलो प्राथमिकता हो।

**विपद् सुरक्षा निर्देशिका**:
1. **शान्त रहनुहोस्**: आफ्नो वरपरको वातावरणको सुरक्षा जाँच्नुहोस्।
2. **आधिकारिक सूचना**: जिल्ला प्रशासन तथा NDRF को निर्देशन पालना गर्नुहोस्।
3. **आपत्कालीन किट**: पिउने पानी, टर्च र प्राथमिक उपचार औषधि तयारी अवस्थामा राख्नुहोस्।
4. **आपत्कालीन सहायता (SOS)**: तपाईं खतरामा हुनुहुन्छ भने **🚨 CONFIRM SOS** थिच्नुहोस्।`
};

export function getLocalFallbackResponse(
  userText: string,
  disasterType?: string,
  language = 'English'
): { reply: string; suggestSOS: boolean } {
  const lower = userText.toLowerCase();

  let matchedEntry: KnowledgeEntry | undefined = undefined;
  for (const entry of KNOWLEDGE_BASE) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      matchedEntry = entry;
      break;
    }
  }

  const suggestSOS =
    matchedEntry?.suggestSOS ||
    lower.includes('help') ||
    lower.includes('danger') ||
    lower.includes('rescue') ||
    lower.includes('trapped') ||
    lower.includes('मदद') ||
    lower.includes('సహాయం') ||
    lower.includes('உதவி');

  if (matchedEntry) {
    // If language is hindi, telugu, etc., append language badge header
    const langIntro = LOCALIZED_FALLBACK_INTRO[language];
    if (langIntro) {
      return {
        reply: `${langIntro}\n\n---\n${matchedEntry.response}`,
        suggestSOS
      };
    }
    return { reply: matchedEntry.response, suggestSOS };
  }

  const customIntro = LOCALIZED_FALLBACK_INTRO[language];
  if (customIntro) {
    return {
      reply: customIntro,
      suggestSOS
    };
  }

  return {
    reply: `🤖 **SafeGuide AI (ResQ Knowledge Assistant)**:

I am here to help you prepare for and stay safe during emergency situations.

**General Disaster Guidance**:
1. **Stay Calm**: Assess your immediate surroundings for danger.
2. **Official Channels**: Follow instructions from District Collectorate, NDRF, and Disaster Management Authorities.
3. **Emergency Kit**: Ensure water, flashlight, and essential medicines are accessible.
4. **Emergency Assistance**: If you are in active danger and require rescue, please use the **🚨 SOS Emergency Workflow** on the home screen to submit a confirmed request to the Control Center.

*Query analyzed in local disaster safety mode.*`,
    suggestSOS
  };
}
