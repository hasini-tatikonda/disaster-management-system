import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  Loader2,
  ShieldAlert,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  Globe,
  Check,
  AlertCircle,
  Activity,
  Volume1
} from 'lucide-react';
import { askSafeGuideAI } from '../../services/aiService';
import { ChatMessage, LanguageCode } from '../../types';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../../locales/translations';

interface SafeGuideAIPageProps {
  onOpenSOSModal: () => void;
}

const LANGUAGE_CONFIG: Record<
  string,
  {
    name: string;
    speechCode: string;
    nativeName: string;
    quickPrompts: string[];
    welcomeMessage: string;
  }
> = {
  en: {
    name: 'English',
    speechCode: 'en-IN',
    nativeName: 'English',
    quickPrompts: [
      'What should I do during an earthquake?',
      'Water is entering my house. What to do?',
      'How should I prepare for a cyclone?',
      'What should I keep in my emergency kit?',
      'What does SOS mean?'
    ],
    welcomeMessage: `👋 Hello! I am **SafeGuide AI**, your DisasterSafe emergency assistant.

Ask me any natural-language question about disaster safety, flood evacuation, earthquake drop-cover-hold, cyclone preparation, or emergency kit checklist.

🌐 **Language**: English
🎙️ **Voice Assistant Active**: Tap the **Microphone** button below to speak or tap **Listen** to hear answers aloud in English.`
  },
  hi: {
    name: 'Hindi',
    speechCode: 'hi-IN',
    nativeName: 'हिन्दी',
    quickPrompts: [
      'भूकंप के दौरान क्या करना चाहिए?',
      'घर में पानी भर रहा है, क्या करें?',
      'तूफान (चक्रवात) की तैयारी कैसे करें?',
      'इमरजेंसी किट में क्या रखें?',
      'SOS का क्या मतलब है?'
    ],
    welcomeMessage: `👋 नमस्ते! मैं **SafeGuide AI** हूँ, आपका आपदा सुरक्षा सहायक।

आप मुझसे आपदा सुरक्षा, बाढ़ से बचाव, भूकंप सुरक्षा नियमों, चक्रवात की तैयारी या इमरजेंसी किट की जानकारी हिंदी में पूछ सकते हैं।

🌐 **चयनित भाषा**: हिन्दी
🎙️ **वॉइस असिस्टेंट सक्रिय**: हिंदी में बोलने के लिए नीचे **माइक बटन** दबाएं या उत्तर सुनने के लिए **आवाज सुनें** दबाएं।`
  },
  te: {
    name: 'Telugu',
    speechCode: 'te-IN',
    nativeName: 'తెలుగు',
    quickPrompts: [
      'భూకంపం వచ్చినప్పుడు ఏమి చేయాలి?',
      'ఇంట్లోకి వరద నీరు వస్తోంది, ఏమి చేయాలి?',
      'తుఫాను నుండి ఎలా రక్షించుకోవాలి?',
      'ఎమర్జెన్సీ కిట్‌లో ఏమి ఉండాలి?',
      'SOS అంటే ఏమిటి?'
    ],
    welcomeMessage: `👋 నమస్కారం! నేను **SafeGuide AI**, మీ విపత్తు భద్రతా సహాయకుడిని.

విపత్తు భద్రత, వరద నివారణ, భూకంప చర్యలు, తుఫాను రక్షణ లేదా ఎమర్జెన్సీ కిట్ గురించి తెలుగులో నన్ను అడగండి.

🌐 **ఎంచుకున్న భాష**: తెలుగు
🎙️ **వాయిస్ అసిస్టెంట్ సిద్ధంగా ఉంది**: మైక్ బటన్ నొక్కి తెలుగులో మాట్లాడండి!`
  },
  ta: {
    name: 'Tamil',
    speechCode: 'ta-IN',
    nativeName: 'தமிழ்',
    quickPrompts: [
      'நிலநடுக்கத்தின் போது என்ன செய்ய வேண்டும்?',
      'வீட்டுக்குள் வெள்ள நீர் நுழைகிறது, என்ன செய்வது?',
      'புயலுக்கு எவ்வாறு தயாராவது?',
      'அவசர உதவிப் பையில் என்ன இருக்க வேண்டும்?',
      'SOS என்றால் என்ன?'
    ],
    welcomeMessage: `👋 வணக்கம்! நான் **SafeGuide AI**, உங்கள் பேரிடர் பாதுகாப்பு உதவியாளன்.

பேரிடர் பாதுகாப்பு, வெள்ளத்திலிருந்து தப்பித்தல், நிலநடுக்க பாதுகாப்பு, புயல் தயாரிப்பு பற்றி தமிழில் கேளுங்கள்.

🌐 **தேர்ந்தெடுக்கப்பட்ட மொழி**: தமிழ்
🎙️ **குரல் உதவி தயாராக உள்ளது**: தமிழில் பேச கீழே உள்ள மைக் பொத்தானை அழுத்தவும்!`
  },
  kn: {
    name: 'Kannada',
    speechCode: 'kn-IN',
    nativeName: 'ಕನ್ನಡ',
    quickPrompts: [
      'ಭೂಕಂಪದ ಸಮಯದಲ್ಲಿ ಏನು ಮಾಡಬೇಕು?',
      'ಮನೆಗೆ ನೀರು ನುಗ್ಗುತ್ತಿದೆ, ಏನು ಮಾಡಬೇಕು?',
      'ಚಂಡಮಾರುತಕ್ಕೆ ಹೇಗೆ ಸಿದ್ಧರಾಗಬೇಕು?',
      'ಎಮರ್ಜೆನ್ಸಿ ಕಿಟ್‌ನಲ್ಲಿ ಏನಿರಬೇಕು?',
      'SOS ಎಂದರೆ ಏನು?'
    ],
    welcomeMessage: `👋 ನಮಸ್ಕಾರ! ನಾನು **SafeGuide AI**, ನಿಮ್ಮ ವಿಪತ್ತು ಸುರಕ್ಷತಾ ಸಹಾಯಕ.

ವಿಪತ್ತು ಸುರಕ್ಷತೆ, ಪ್ರವಾಹ ಮುನ್ನೆಚ್ಚರಿಕೆ, ಭೂಕಂಪ ಸುರಕ್ಷತೆ ಮತ್ತು ಎಮರ್ಜೆನ್ಸಿ ಕಿಟ್ ಕುರಿತು ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ.

🌐 **ಆಯ್ಕೆ ಮಾಡಿದ ಭಾಷೆ**: ಕನ್ನಡ
🎙️ **ವಾಯ್ಸ್ ಸಹಾಯಕ ಸಕ್ರಿಯವಾಗಿದೆ**: ಮೈಕ್ ಬಟನ್ ಒತ್ತಿ ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ!`
  },
  ml: {
    name: 'Malayalam',
    speechCode: 'ml-IN',
    nativeName: 'മലയാളം',
    quickPrompts: [
      'ഭൂകമ്പ സമയത്ത് എന്ത് ചെയ്യണം?',
      'വീട്ടിൽ വെള്ളം കയറുന്നു, എന്ത് ചെയ്യണം?',
      'ചുഴലിക്കാറ്റിനെ നേരിടാൻ എന്ത് ചെയ്യണം?',
      'അടിയന്തര കിറ്റിൽ എന്തൊക്കെ വേണം?',
      'SOS എന്നാൽ എന്ത്?'
    ],
    welcomeMessage: `👋 നമസ്കാരം! ഞാൻ **SafeGuide AI**, നിങ്ങളുടെ ദുരന്ത നിവാരണ സഹായി.

ദുരന്ത നിവാരണം, പ്രളയ മുന്നറിയിപ്പ്, ഭൂകമ്പ സുരക്ഷ എന്നിവയെക്കുറിച്ച് മലയാളത്തിൽ ചോദിക്കൂ.

🌐 **തിരഞ്ഞെടുത്ത ഭാഷ**: മലയാളം
🎙️ **വോയിസ് അസിസ്റ്റന്റ് ലഭ്യമാണ്**: മൈക്ക് ബട്ടൺ അമർത്തി സംസാരിക്കൂ!`
  },
  bn: {
    name: 'Bengali',
    speechCode: 'bn-IN',
    nativeName: 'বাংলা',
    quickPrompts: [
      'ভূমিকম্পের সময় কী করা উচিত?',
      'বাড়িতে জল ঢুকছে, কী করব?',
      'ঘূর্ণিঝড়ের জন্য কীভাবে প্রস্তুতি নেব?',
      'জরুরি কিটে কী কী রাখা উচিত?',
      'SOS এর অর্থ কী?'
    ],
    welcomeMessage: `👋 নমস্কার! আমি **SafeGuide AI**, আপনার দুর্যোগ সুরক্ষা সহকারী।

দুর্যোগ সুরক্ষা, বন্যা সতর্কবার্তা, ভূমিকম্প নিরাপত্তা এবং জরুরি কিট সম্পর্কে বাংলায় জিজ্ঞাসা করুন।

🌐 **নির্বাচিত ভাষা**: বাংলা
🎙️ **ভয়েস অ্যাসিস্ট্যান্ট সক্রিয়**: মাইক বোতাম চেপে বাংলায় কথা বলুন!`
  },
  mr: {
    name: 'Marathi',
    speechCode: 'mr-IN',
    nativeName: 'मराठी',
    quickPrompts: [
      'भूकंपाच्या वेळी काय करावे?',
      'घरात पाणी शिरत आहे, काय करावे?',
      'चक्रीवादळाची तयारी कशी करावी?',
      'इमर्जन्सी किटमध्ये काय ठेवावे?',
      'SOS म्हणजे काय?'
    ],
    welcomeMessage: `👋 नमस्कार! मी **SafeGuide AI** आहे, तुमचा आपत्ती सुरक्षा सहाय्यक.

आपत्ती सुरक्षा, पूर व्यवस्थापन, भूकंप सुरक्षा नियम आणि इमर्जन्सी किटबद्दल मराठीत विचारा.

🌐 **निवडलेली भाषा**: मराठी
🎙️ **व्हॉइस असिस्टंट सक्रिय**: माइक बटण दाबून मराठीत बोला!`
  },
  gu: {
    name: 'Gujarati',
    speechCode: 'gu-IN',
    nativeName: 'ગુજરાતી',
    quickPrompts: [
      'ભૂકંપ દરમિયાન શું કરવું જોઈએ?',
      'ઘરમાં પાણી ભરાઈ રહ્યું છે, શું કરવું?',
      'વાવાઝોડા માટે કેવી રીતે તૈયારી કરવી?',
      'ઇમરજન્સી કિટમાં શું રાખવું?',
      'SOS નો અર્થ શું છે?'
    ],
    welcomeMessage: `👋 નમસ્તે! હું **SafeGuide AI** છું, તમારો આપત્તિ સુરક્ષા સહાયક.

આપત્તિ સુરક્ષા, પૂર નિવારણ, ભૂકંપ સુરક્ષા અને ઇમરજન્સી કિટ વિશે ગુજરાતીમાં પૂછો.

🌐 **પસંદ કરેલ ભાષા**: ગુજરાતી
🎙️ **વોઇસ આસિસ્ટન્ટ સક્રિય**: માઇક બટન દબાવીને ગુજરાતીમાં બોલો!`
  },
  pa: {
    name: 'Punjabi',
    speechCode: 'pa-IN',
    nativeName: 'ਪੰਜਾਬੀ',
    quickPrompts: [
      'ਭੂਚਾਲ ਦੌਰਾਨ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?',
      'ਘਰ ਵਿੱਚ ਪਾਣੀ ਵੜ ਰਿਹਾ ਹੈ, ਕੀ ਕਰੀਏ?',
      'ਤੂਫ਼ਾਨ ਦੀ ਤਿਆਰੀ ਕਿਵੇਂ ਕਰੀਏ?',
      'ਐਮਰਜੈਂਸੀ ਕਿੱਟ ਵਿੱਚ ਕੀ ਰੱਖੀਏ?',
      'SOS ਦਾ ਕੀ ਮਤਲਬ ਹੈ?'
    ],
    welcomeMessage: `👋 ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ! ਮੈਂ **SafeGuide AI** ਹਾਂ, ਤੁਹਾਡਾ ਆਫ਼ਤ ਸੁਰੱਖਿਆ ਸਹਾਇਕ।

ਆਫ਼ਤ ਸੁਰੱਖਿਆ, ਹੜ੍ਹ ਤੋਂ ਬਚਾਅ, ਭੂਚਾਲ ਸੁਰੱਖਿਆ ਅਤੇ ਐਮਰਜੈਂਸੀ ਕਿੱਟ ਬਾਰੇ ਪੰਜਾਬੀ ਵਿੱਚ ਪੁੱਛੋ।

🌐 **ਚੁਣੀ ਗਈ ਭਾਸ਼ਾ**: ਪੰਜਾਬੀ
🎙️ **ਵੌਇਸ ਸਹਾਇਕ ਸਰਗਰਮ**: ਮਾਈਕ ਬਟਨ ਦਬਾ ਕੇ ਪੰਜਾਬੀ ਵਿੱਚ ਬੋਲੋ!`
  },
  or: {
    name: 'Odia',
    speechCode: 'or-IN',
    nativeName: 'ଓଡ଼ିଆ',
    quickPrompts: [
      "ଭୂକମ୍ପ ସମୟରେ କ'ଣ କରିବା ଉଚିତ୍?",
      "ଘରେ ପାଣି ପଶୁଛି, କ'ଣ କରିବି?",
      "ବାତ୍ୟା ପାଇଁ କିପରି ପ୍ରସ୍ତୁତ ହେବି?",
      "ଇମରଜେନ୍ସି କିଟ୍‌ରେ କ'ଣ ରଖିବି?",
      "SOS ର ଅର୍ଥ କ'ଣ?"
    ],
    welcomeMessage: `👋 ନମସ୍କାର! ମୁଁ **SafeGuide AI**, ଆପଣଙ୍କ ବିପତ୍ତି ସୁରକ୍ଷା ସହାୟକ ।

ବିପତ୍ତି ସୁରକ୍ଷା, ବନ୍ୟା, ବାତ୍ୟା ଓ ଭୂକମ୍ପ ସୁରକ୍ଷା ବିଷୟରେ ଓଡ଼ିଆରେ ପଚାରନ୍ତୁ ।

🌐 **ମନୋନୀତ ଭାଷା**: ଓଡ଼ିଆ
🎙️ **ଭଏସ୍ ଆସିଷ୍ଟାଣ୍ଟ ସକ୍ରିୟ**: ମାଇକ୍ ବଟନ୍ ଦବାଇ ଓଡ଼ିଆରେ କୁହନ୍ତୁ!`
  },
  as: {
    name: 'Assamese',
    speechCode: 'as-IN',
    nativeName: 'অসমীয়া',
    quickPrompts: [
      "ভূমিকম্পৰ সময়ত কি কৰা উচিত?",
      "ঘৰত পানী সোমাইছে, কি কৰিম?",
      "ঘূৰ্ণীবতাহৰ বাবে কেনেকৈ প্ৰস্তুত হ'ম?",
      "জৰুৰী কিটত কি কি ৰাখিব লাগে?",
      "SOS ৰ অৰ্থ কি?"
    ],
    welcomeMessage: `👋 নমস্কাৰ! মই **SafeGuide AI**, আপোনাৰ দুৰ্যোগ সুৰক্ষা সহায়ক।

দুৰ্যোগ সুৰক্ষা, বানপানী, ভূমিকম্প আৰু জৰুৰী কিট বিষয়ে অসমীয়াত সোধক।

🌐 **বাচনি কৰা ভাষা**: অসমীয়া
🎙️ **ভয়েছ সহায়ক সক্ৰিয়**: মাইক বুটাম টিপি অসমীয়াত কওক!`
  },
  ur: {
    name: 'Urdu',
    speechCode: 'ur-IN',
    nativeName: 'اردو',
    quickPrompts: [
      'زلزلے کے دوران کیا کرنا چاہیے؟',
      'گھر میں پانی بھر رہا ہے، کیا کریں؟',
      'طوفان سے بچاؤ کی تیاری کیسے کریں؟',
      'ہنگامی کٹ میں کیا ہونا چاہیے؟',
      'SOS کا کیا مطلب ہے؟'
    ],
    welcomeMessage: `👋 السلام علیکم! میں **SafeGuide AI** ہوں، آپ کا آفت سے بچاؤ کا معاون۔

آفت سے بچاؤ، سیلاب، زلزلے اور ہنگامی کٹ کے بارے میں اردو میں پوچھیں۔

🌐 **منتخب زبان**: اردو
🎙️ **وائس اسسٹنٹ فعال**: مائیک بٹن دبا کر اردو میں بولیں!`
  },
  ne: {
    name: 'Nepali',
    speechCode: 'ne-NP',
    nativeName: 'नेपाली',
    quickPrompts: [
      'भूकम्पको बेला के गर्ने?',
      'घरमा पानी पस्दैछ, के गर्ने?',
      'आँधीबेहरीको तयारी कसरी गर्ने?',
      'आपत्कालीन किटमा के के राख्ने?',
      'SOS को अर्थ के हो?'
    ],
    welcomeMessage: `👋 नमस्ते! म **SafeGuide AI** हुँ, तपाईंको विपद् सुरक्षा सहायक।

विपद् सुरक्षा, बाढी, भूकम्प र आपत्कालीन किटबारे नेपालीमा सोध्नुहोस्।

🌐 **छानिएको भाषा**: नेपाली
🎙️ **भ्वाइस सहायक सक्रिय**: माइक थिचेर नेपालीमा बोल्नुहोस्!`
  }
};

export const SafeGuideAIPage: React.FC<SafeGuideAIPageProps> = ({ onOpenSOSModal }) => {
  const { activeLanguage, setLanguage } = useApp();

  const currentLangConfig = LANGUAGE_CONFIG[activeLanguage] || LANGUAGE_CONFIG.en;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestSOSBanner, setSuggestSOSBanner] = useState(false);

  // Voice Input (Speech-to-Text) State
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const recognitionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Voice Output (Text-to-Speech) State
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Update Messages when active language changes
  useEffect(() => {
    const welcomeText = currentLangConfig.welcomeMessage;
    setMessages([
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [activeLanguage]);

  // Load available speech synthesis voices
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Voice Output Reader Function
  const speakText = (msgId: string, rawText: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean text for speech
    const cleanText = rawText
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#/g, '')
      .replace(/_/g, '')
      .replace(/🌐/g, '')
      .replace(/🎙️/g, '')
      .replace(/🚨/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = currentLangConfig.speechCode;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Match best available voice for language
    if (availableVoices.length > 0) {
      const langPrefix = currentLangConfig.speechCode.split('-')[0].toLowerCase();
      const matchedVoice = availableVoices.find(
        v =>
          v.lang.toLowerCase() === currentLangConfig.speechCode.toLowerCase() ||
          v.lang.toLowerCase().startsWith(langPrefix)
      );
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
    }

    utterance.onend = () => {
      setSpeakingMsgId(null);
    };

    utterance.onerror = () => {
      setSpeakingMsgId(null);
    };

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Stop recording media streams
  const stopAudioCapture = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setAudioLevel(0);
  };

  // Toggle Voice Input Listening with robust Browser Permissions & Fallbacks
  const toggleListening = async () => {
    setSpeechError(null);

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      stopAudioCapture();
      setIsListening(false);
      return;
    }

    // Step 1: Explicitly request Microphone Permission via getUserMedia
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        // Visual Audio Level Meter using Web Audio API
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const analyser = audioCtx.createAnalyser();
          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);
          analyser.fftSize = 64;
          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          const checkLevel = () => {
            if (!mediaStreamRef.current) return;
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
            requestAnimationFrame(checkLevel);
          };
          checkLevel();
        } catch (e) {
          // Audio visualizer non-critical
        }
      }
    } catch (err: any) {
      console.warn('Microphone getUserMedia error:', err);
      setSpeechError(
        `Microphone access was denied or blocked by browser permissions. Please allow microphone access in your browser or select a voice prompt below.`
      );
      return;
    }

    // Step 2: Speech Recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      stopAudioCapture();
      setSpeechError(
        `Speech Recognition API is not supported in this browser environment. You can tap any prompt below or type your message in ${currentLangConfig.nativeName}.`
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = currentLangConfig.speechCode;
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');

        setInputPrompt(transcript);

        if (event.results[0].isFinal) {
          setIsListening(false);
          stopAudioCapture();
          if (transcript.trim()) {
            handleSend(transcript);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech Recognition error:', event.error);
        setIsListening(false);
        stopAudioCapture();

        if (event.error === 'not-allowed') {
          setSpeechError(
            `Microphone permission blocked. Click the lock/site settings icon in your browser address bar to allow microphone access for this website.`
          );
        } else if (event.error === 'no-speech') {
          setSpeechError(`No speech detected. Please speak clearly into your microphone or try again.`);
        } else {
          setSpeechError(`Voice recognition stopped (${event.error}). Please try speaking again or select a quick question.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        stopAudioCapture();
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
      stopAudioCapture();
      setSpeechError(`Could not initiate voice recognition: ${err?.message || 'Unknown error'}`);
    }
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    const res = await askSafeGuideAI(textToSend, undefined, currentLangConfig.name);

    const assistantMsgId = `msg-${Date.now() + 1}`;
    const assistantMsg: ChatMessage = {
      id: assistantMsgId,
      sender: 'assistant',
      text: res.reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isFallback: res.isFallback
    };

    setMessages(prev => [...prev, assistantMsg]);
    setLoading(false);

    if (res.suggestSOS) {
      setSuggestSOSBanner(true);
    }

    // Auto Voice Readout if enabled
    if (autoSpeak) {
      speakText(assistantMsgId, res.reply);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-12">
      {/* Top Header with Voice Output Toggle */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white">SafeGuide AI Assistant</h1>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 rounded-full border border-indigo-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Multilingual Voice AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Instant AI disaster guidance in 14 Indian languages with full voice input & speak options.
            </p>
          </div>
        </div>

        {/* Voice Auto-Readout Switch */}
        <button
          onClick={() => setAutoSpeak(!autoSpeak)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            autoSpeak
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
          }`}
          title="Toggle automatic voice readout of AI answers"
        >
          {autoSpeak ? <Volume2 className="w-4 h-4 text-yellow-300 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          <span>Voice Output: {autoSpeak ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Language Selector Strip */}
      <div className="bg-slate-100 dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-extrabold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-indigo-500" />
            <span>Select AI Language / भाषा चुनें:</span>
          </span>
          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-800">
            Active: {currentLangConfig.nativeName} ({currentLangConfig.name})
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          {SUPPORTED_LANGUAGES.map(lang => {
            const isSelected = activeLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as LanguageCode)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <span>{lang.nativeName}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Voice Assistant Mode Banner */}
      <div className="p-3 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-2xl border border-indigo-800/60 shadow-md flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0">
            <Mic className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <span className="font-extrabold text-indigo-200 block">
              🎙️ Speak in {currentLangConfig.nativeName} ({currentLangConfig.name})
            </span>
            <span className="text-[11px] text-slate-300">
              Tap <strong>Microphone</strong> to speak or <strong>Listen</strong> on any message to hear speech.
            </span>
          </div>
        </div>

        <button
          onClick={toggleListening}
          className={`px-3.5 py-2 rounded-xl font-black text-xs shrink-0 flex items-center gap-1.5 transition-all shadow-md ${
            isListening
              ? 'bg-red-600 text-white animate-pulse ring-2 ring-red-400'
              : 'bg-indigo-500 hover:bg-indigo-400 text-white'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>{isListening ? `Listening (${currentLangConfig.nativeName})...` : `Tap to Speak (${currentLangConfig.nativeName})`}</span>
        </button>
      </div>

      {/* Active Microphone Audio Level Waveform Indicator */}
      {isListening && (
        <div className="p-3 bg-red-600 text-white rounded-2xl flex items-center justify-between gap-3 shadow-lg text-xs font-bold animate-pulse">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 animate-spin text-yellow-300" />
            <span>Listening to your microphone in {currentLangConfig.nativeName}... Speak now!</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-24 bg-red-950/60 h-2.5 rounded-full overflow-hidden border border-red-400">
              <div
                className="bg-yellow-400 h-full transition-all duration-75"
                style={{ width: `${Math.max(10, audioLevel)}%` }}
              ></div>
            </div>
            <button
              onClick={toggleListening}
              className="px-2.5 py-1 bg-black text-white rounded-lg text-xs"
            >
              Done / Stop
            </button>
          </div>
        </div>
      )}

      {/* Speech Error Banner with Guidance */}
      {speechError && (
        <div className="p-3.5 bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/40 text-amber-900 dark:text-amber-200 rounded-2xl flex items-start gap-2.5 text-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Microphone / Speech Notice:</span>
            <p>{speechError}</p>
            <p className="text-[11px] opacity-90">
              💡 <strong>Tip:</strong> You can click any quick voice prompt below in {currentLangConfig.nativeName} to ask instantly!
            </p>
          </div>
        </div>
      )}

      {/* Localized Quick Prompt Chips */}
      <div className="space-y-1">
        <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          <span>Quick Questions in {currentLangConfig.nativeName}:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
          {currentLangConfig.quickPrompts.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:border-indigo-300 text-slate-700 dark:text-slate-200 font-medium transition-all shrink-0 border border-slate-200 dark:border-slate-800 shadow-2xs"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Suggest SOS Banner */}
      {suggestSOSBanner && (
        <div className="p-3.5 bg-red-600 text-white rounded-2xl flex items-center justify-between gap-3 shadow-lg animate-bounce">
          <div className="flex items-center gap-2 text-xs font-bold">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>Are you in active danger requiring emergency rescue assistance?</span>
          </div>
          <button
            onClick={onOpenSOSModal}
            className="px-4 py-1.5 bg-yellow-400 text-black font-black text-xs rounded-xl shadow-md shrink-0 hover:scale-105 transition-transform"
          >
            CONFIRM SOS REQUEST
          </button>
        </div>
      )}

      {/* Chat Messages Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xs min-h-[420px] max-h-[520px] overflow-y-auto space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2.5 relative group ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none font-medium shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              <div
                className={`text-[10px] flex items-center justify-between opacity-80 pt-1 border-t ${
                  msg.sender === 'user'
                    ? 'text-indigo-200 border-indigo-500/40'
                    : 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/60'
                }`}
              >
                <span>{msg.timestamp}</span>

                {/* Speaker Button to read message aloud */}
                {msg.sender === 'assistant' && (
                  <button
                    onClick={() => speakText(msg.id, msg.text)}
                    className={`flex items-center gap-1 font-bold px-2 py-0.5 rounded-lg text-[10px] transition-colors ${
                      speakingMsgId === msg.id
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-200'
                    }`}
                    title={`Listen in ${currentLangConfig.nativeName}`}
                  >
                    {speakingMsgId === msg.id ? (
                      <>
                        <VolumeX className="w-3 h-3 text-white" />
                        <span>Stop Voice</span>
                      </>
                    ) : (
                      <>
                        <Volume1 className="w-3 h-3" />
                        <span>Listen ({currentLangConfig.nativeName})</span>
                      </>
                    )}
                  </button>
                )}

                {msg.isFallback && <span className="italic font-mono text-[9px]">(Local Offline Assistant)</span>}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center shrink-0 shadow-2xs">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 p-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>SafeGuide AI is analyzing disaster guidance in {currentLangConfig.nativeName} ({currentLangConfig.name})...</span>
          </div>
        )}
      </div>

      {/* Input Box with Microphone Voice Button */}
      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Voice Input Mic Button */}
        <button
          onClick={toggleListening}
          className={`p-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center shrink-0 ${
            isListening
              ? 'bg-red-600 text-white animate-bounce ring-4 ring-red-600/30'
              : 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-200 border border-indigo-300 dark:border-indigo-800'
          }`}
          title={isListening ? 'Stop Listening' : `Speak in ${currentLangConfig.nativeName} (${currentLangConfig.name})`}
        >
          {isListening ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
        </button>

        <input
          type="text"
          placeholder={
            isListening
              ? `Listening to your voice (${currentLangConfig.nativeName})...`
              : `Ask in ${currentLangConfig.nativeName} (${currentLangConfig.name}) or tap Mic...`
          }
          value={inputPrompt}
          onChange={e => setInputPrompt(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-transparent px-2 py-2 text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
        />

        <button
          onClick={() => handleSend()}
          disabled={loading || !inputPrompt.trim()}
          className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl font-bold text-xs transition-colors shadow-2xs flex items-center justify-center shrink-0"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </div>

      <p className="text-[10px] text-center text-slate-400 dark:text-slate-500">
        SafeGuide AI supports speech recognition and voice readout across 14 Indian languages. In critical life-threatening situations, always follow District Collectorate and NDRF emergency broadcasts.
      </p>
    </div>
  );
};
