import { SupportedLanguage } from './types';

export const translations: Record<SupportedLanguage, {
  appName: string;
  appTagline: string;
  navAssistant: string;
  navRegister: string;
  navTrack: string;
  navDashboard: string;
  navCieDemo: string;
  emergencyBannerTitle: string;
  emergencyBannerDesc: string;
  emergencyCall: string;
  welcomeGreeting: string;
  quickActionRegister: string;
  quickActionTrack: string;
  quickActionGuidance: string;
  quickActionCollegeSample: string;
  quickActionWaterSample: string;
  inputPlaceholder: string;
  send: string;
  categoryEducation: string;
  categoryPublicServices: string;
  categoryBanking: string;
  categoryHealthcare: string;
  categoryWorkplace: string;
  categoryTechnical: string;
  priorityUrgent: string;
  priorityMedium: string;
  priorityStandard: string;
  statusSubmitted: string;
  statusUnderReview: string;
  statusInInvestigation: string;
  statusAssigned: string;
  statusResolved: string;
  statusEscalated: string;
  draftTitle: string;
  draftNotice: string;
  confirmAndSubmit: string;
  submissionSuccess: string;
  complaintIdLabel: string;
  trackThisComplaint: string;
  downloadReceipt: string;
  feedbackQuestion: string;
  feedbackHelpful: string;
  feedbackSubmit: string;
  feedbackThanks: string;
}> = {
  English: {
    appName: 'GrievanceAI Portal',
    appTagline: 'Intelligent AI Grievance Redressal & Resolution System',
    navAssistant: 'AI Assistant',
    navRegister: 'Direct Registration',
    navTrack: 'Track Grievance',
    navDashboard: 'Officer Portal',
    navCieDemo: 'CIE Architecture & Viva',
    emergencyBannerTitle: 'Immediate Safety / Life Threat Notice',
    emergencyBannerDesc: 'For active physical danger, building collapse, or urgent medical emergencies, immediately dial National Emergency 112 / Ambulance 108.',
    emergencyCall: 'Emergency Hotline: 112',
    welcomeGreeting: 'Hello! Welcome to the AI Grievance Redressal Assistant. I am here to help you register, classify, and track your grievances transparently.',
    quickActionRegister: 'Register a Complaint',
    quickActionTrack: 'Track Existing Complaint',
    quickActionGuidance: 'Grievance Guidance & Escalation',
    quickActionCollegeSample: 'College Marksheet Issue (CIE Sample)',
    quickActionWaterSample: 'Drinking Water Contamination (CIE Sample)',
    inputPlaceholder: 'Describe your grievance, enter a complaint ID, or ask a question...',
    send: 'Send',
    categoryEducation: 'Education',
    categoryPublicServices: 'Public Services',
    categoryBanking: 'Banking & Finance',
    categoryHealthcare: 'Healthcare',
    categoryWorkplace: 'Workplace Issues',
    categoryTechnical: 'Technical & Cyber',
    priorityUrgent: 'Urgent Priority',
    priorityMedium: 'Medium Priority',
    priorityStandard: 'Standard Priority',
    statusSubmitted: 'Submitted',
    statusUnderReview: 'Under Review',
    statusInInvestigation: 'In Investigation',
    statusAssigned: 'Assigned to Officer',
    statusResolved: 'Resolved',
    statusEscalated: 'Escalated',
    draftTitle: 'AI-Generated Grievance Summary & Routing',
    draftNotice: 'Please review the generated complaint details before final submission to the database.',
    confirmAndSubmit: 'Confirm & Submit to Database',
    submissionSuccess: 'Grievance Successfully Registered in Database!',
    complaintIdLabel: 'Official Complaint Reference ID',
    trackThisComplaint: 'Track Resolution Timeline',
    downloadReceipt: 'Print / Save Official Receipt',
    feedbackQuestion: 'Was this AI grievance assistance helpful to you?',
    feedbackHelpful: 'Yes, this was helpful',
    feedbackSubmit: 'Submit Feedback',
    feedbackThanks: 'Thank you for your valuable feedback! It helps improve our grievance redressal system.'
  },
  Hindi: {
    appName: 'शिकायत निवारण AI पोर्टल',
    appTagline: 'बुद्धिमान AI-संचालित शिकायत निवारण एवं समाधान प्रणाली',
    navAssistant: 'AI सहायक',
    navRegister: 'सीधा पंजीकरण',
    navTrack: 'शिकायत स्थिति ट्रैक करें',
    navDashboard: 'अधिकारी पोर्टल',
    navCieDemo: 'CIE वास्तुकला एवं वाइवा',
    emergencyBannerTitle: 'आपातकालीन सुरक्षा एवं जीवन रक्षा सूचना',
    emergencyBannerDesc: 'सक्रिय शारीरिक खतरे, आपातकालीन दुर्घटना या त्वरित चिकित्सा सहायता हेतु कृपया तुरंत 112 अथवा 108 डायल करें।',
    emergencyCall: 'आपातकालीन हेल्पलाइन: 112',
    welcomeGreeting: 'नमस्ते! AI शिकायत निवारण सहायक में आपका स्वागत है। मैं आपकी शिकायतों को निष्पक्षता से दर्ज करने, श्रेणीबद्ध करने और ट्रैक करने में मदद करूँगा।',
    quickActionRegister: 'नई शिकायत दर्ज करें',
    quickActionTrack: 'शिकायत की स्थिति ट्रैक करें',
    quickActionGuidance: 'निवारण मार्गदर्शन व चरण',
    quickActionCollegeSample: 'कॉलेज मार्कशीट समस्या (CIE नमूना)',
    quickActionWaterSample: 'दूषित पेयजल आपूर्ति (CIE नमूना)',
    inputPlaceholder: 'अपनी शिकायत का विवरण लिखें या शिकायत संदर्भ संख्या दर्ज करें...',
    send: 'भेजें',
    categoryEducation: 'शिक्षा',
    categoryPublicServices: 'सार्वजनिक सेवाएं',
    categoryBanking: 'बैंकिंग एवं वित्त',
    categoryHealthcare: 'स्वास्थ्य सेवाएं',
    categoryWorkplace: 'कार्यस्थल समस्याएं',
    categoryTechnical: 'तकनीकी व साइबर',
    priorityUrgent: 'अत्यंत गंभीर (प्राथमिकता)',
    priorityMedium: 'मध्यम प्राथमिकता',
    priorityStandard: 'सामान्य प्राथमिकता',
    statusSubmitted: 'दर्ज किया गया',
    statusUnderReview: 'समीक्षाधीन',
    statusInInvestigation: 'जांच जारी',
    statusAssigned: 'अधिकारी को सौंपा गया',
    statusResolved: 'समाधान संपन्न',
    statusEscalated: 'उच्चाधिकारी को प्रेषित',
    draftTitle: 'AI द्वारा तैयार शिकायत सारांश एवं विभाग आवंटन',
    draftNotice: 'कृपया डेटाबेस में अंतिम रूप से दर्ज करने से पूर्व विवरण की समीक्षा करें।',
    confirmAndSubmit: 'पुष्टि करें और डेटाबेस में दर्ज करें',
    submissionSuccess: 'आपकी शिकायत सफलतापूर्वक डेटाबेस में दर्ज कर ली गई है!',
    complaintIdLabel: 'आधिकारिक शिकायत संदर्भ संख्या (ID)',
    trackThisComplaint: 'समाधान समयरेखा देखें',
    downloadReceipt: 'पावती रसीद प्रिंट / डाउनलोड करें',
    feedbackQuestion: 'क्या यह AI शिकायत मार्गदर्शन आपके लिए उपयोगी रहा?',
    feedbackHelpful: 'हाँ, यह उपयोगी था',
    feedbackSubmit: 'प्रतिक्रिया जमा करें',
    feedbackThanks: 'आपकी बहुमूल्य प्रतिक्रिया के लिए धन्यवाद! इससे प्रणाली में सुधार होता है।'
  },
  Marathi: {
    appName: 'तक्रार निवारण AI पोर्टल',
    appTagline: 'बुद्धिमान AI-आधारित तक्रार निवारण आणि निराकरण प्रणाली',
    navAssistant: 'AI सहाय्यक',
    navRegister: 'थेट तक्रार नोंदणी',
    navTrack: 'तक्रारीची स्थिती तपासा',
    navDashboard: 'अधिकारी पोर्टल',
    navCieDemo: 'CIE आर्किटेक्चर आणि व्हायव्हा',
    emergencyBannerTitle: 'तातडीची सुरक्षितता व आपत्कालीन सूचना',
    emergencyBannerDesc: 'जीवघेण्या धोक्यासाठी किंवा तातडीच्या वैद्यकीय मदतीसाठी कृपया तात्काळ ११२ किंवा १०८ वर संपर्क साधावा.',
    emergencyCall: 'आपत्कालीन हेल्पलाईन: ११२',
    welcomeGreeting: 'नमस्कार! AI तक्रार निवारण सहाय्यकामध्ये आपले स्वागत आहे. मी आपल्या तक्रारींची पारदर्शकपणे नोंदणी, वर्गीकरण आणि ट्रॅकिंग करण्यासाठी येथे आहे.',
    quickActionRegister: 'नवीन तक्रार नोंदवा',
    quickActionTrack: 'तक्रारीची स्थिती तपासा',
    quickActionGuidance: 'निवारण मार्गदर्शन व टप्पे',
    quickActionCollegeSample: 'महाविद्यालयीन गुणपत्रिका विलंब (CIE नमुना)',
    quickActionWaterSample: 'दूषित पिण्याचे पाणी पुरवठा (CIE नमुना)',
    inputPlaceholder: 'आपल्या तक्रारीचे वर्णन लिहा किंवा तक्रार क्रमांक प्रविष्ट करा...',
    send: 'पाठवा',
    categoryEducation: 'शिक्षण',
    categoryPublicServices: 'सार्वजनिक सेवा',
    categoryBanking: 'बँकिंग व वित्त',
    categoryHealthcare: 'आरोग्य सेवा',
    categoryWorkplace: 'कामाच्या ठिकाणच्या समस्या',
    categoryTechnical: 'तांत्रिक व सायबर',
    priorityUrgent: 'तातडीचे (उच्च प्राधान्य)',
    priorityMedium: 'मध्यम प्राधान्य',
    priorityStandard: 'सामान्य प्राधान्य',
    statusSubmitted: 'नोंदणीकृत',
    statusUnderReview: 'पुनरावलोकनाधीन',
    statusInInvestigation: 'तपास सुरू',
    statusAssigned: 'अधिकाऱ्याकडे सोपवले',
    statusResolved: 'निराकरण झाले',
    statusEscalated: 'वरिष्ठ प्राधिकरणाकडे वर्ग',
    draftTitle: 'AI-निर्मित तक्रार सारांश आणि विभाग वाटप',
    draftNotice: 'कृपया डेटाबेसमध्ये अंतिम सादर करण्यापूर्वी तयार केलेल्या तपशिलांची पडताळणी करा.',
    confirmAndSubmit: 'पुष्टी करा आणि डेटाबेसमध्ये सबमिट करा',
    submissionSuccess: 'तक्रार अधिकृतपणे डेटाबेसमध्ये नोंदवली गेली आहे!',
    complaintIdLabel: 'अधिकृत तक्रार संदर्भ क्रमांक (ID)',
    trackThisComplaint: 'निराकरण टाइमलाइन पहा',
    downloadReceipt: 'पावती प्रिंट / डाउनलोड करा',
    feedbackQuestion: 'हे AI तक्रार निवारण सहाय्य आपल्यासाठी उपयुक्त ठरले का?',
    feedbackHelpful: 'होय, हे खूप उपयुक्त होते',
    feedbackSubmit: 'अभिप्राय सबमिट करा',
    feedbackThanks: 'आपल्या मोलाच्या अभिप्रायाबद्दल धन्यवाद! यामुळे आमची प्रणाली अधिक सक्षम होते.'
  }
};
