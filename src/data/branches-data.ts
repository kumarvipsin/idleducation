export interface BranchFacility {
  title: string;
  description: string;
  iconName: string;
}

export interface BranchCourse {
  title: string;
  badge: string;
  classes: string;
  description: string;
  subjects: string[];
}

export interface BranchFaq {
  q: string;
  a: string;
}

export interface BranchInfo {
  id: string;
  slug: string;
  aliases: string[];
  name: string;
  shortName: string;
  tagline: string;
  shortArea: string;
  fullAddress: string;
  pincode: string;
  landmark: string;
  nearestMetro: string;
  metroLine: string;
  metroDistance: string;
  phone: string;
  altPhone: string;
  email: string;
  timingsWeekday: string;
  timingsSunday: string;
  mapLink: string;
  mapEmbedQuery: string;
  imageUrl: string;
  rating: string;
  reviewCount: string;
  overview: string;
  transportInfo: string;
  batchSize: string;
  facilities: BranchFacility[];
  courses: BranchCourse[];
  faqs: BranchFaq[];
}

export const BRANCHES_DATA: BranchInfo[] = [
  {
    id: "budh-vihar",
    slug: "budh-vihar",
    aliases: ["budhvihar", "budh-vihar-delhi"],
    name: "Budh Vihar Branch",
    shortName: "Budh Vihar",
    tagline: "Excellence in CBSE Board Preparation & Personal Mentorship",
    shortArea: "Budh Vihar Phase-1, North-West Delhi",
    fullAddress: "Phase-1, Main Kanjhawala Road, Budh Vihar, Delhi - 110086",
    pincode: "110086",
    landmark: "Near Pocket-D Park & Brahm Shakti Hospital Road",
    nearestMetro: "Rithala Metro Station",
    metroLine: "Red Line",
    metroDistance: "Approx. 7-8 mins by E-Rickshaw / Auto",
    phone: "8860040010",
    altPhone: "+91 8860040010",
    email: "info@idleducation.in",
    timingsWeekday: "Monday to Saturday: 8:00 AM – 8:30 PM",
    timingsSunday: "Sunday: 9:00 AM – 2:00 PM (Doubt Counters & Test Series)",
    mapLink: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6",
    mapEmbedQuery: "Budh+Vihar+Phase+1+Delhi+110086",
    imageUrl: "/idlbranch.png",
    rating: "4.9",
    reviewCount: "420+ Reviews",
    overview:
      "IDL Education Budh Vihar Centre is a premier offline learning destination serving students across Budh Vihar Phase 1 & 2, Rohini Sectors 20-22, and Pooth Kalan. Equipped with 4K touch-interactive panels, air-conditioned study spaces, dedicated 1-on-1 faculty doubt counters, and comprehensive printed modules, this centre empowers CBSE students to excel in board exams and competitive entrances.",
    transportInfo: "Localized van and cab pickup/drop services available across Budh Vihar Phase 1, Phase 2, and nearby Rohini sectors.",
    batchSize: "Max 25-30 students per batch for focused individual attention",
    facilities: [
      {
        title: "Smart Interactive Panels",
        description: "Modern high-resolution touch displays for conceptual visualization and interactive 3D problem solving.",
        iconName: "Monitor",
      },
      {
        title: "Air-Conditioned Classrooms",
        description: "Fully climate-controlled spaces with ergonomic benches built for long, comfortable study sessions.",
        iconName: "Wind",
      },
      {
        title: "Daily 1-on-1 Doubt Counters",
        description: "Dedicated subject mentors available 6 days a week to clear doubts outside regular class hours.",
        iconName: "HelpCircle",
      },
      {
        title: "Silent Reading Library",
        description: "Quiet self-study area stocked with NCERT exemplars, reference books, and past 10 years question banks.",
        iconName: "BookOpen",
      },
      {
        title: "Biometric Attendance & SMS",
        description: "Automated student check-in/check-out with real-time SMS notifications sent directly to parents.",
        iconName: "Fingerprint",
      },
      {
        title: "24/7 CCTV Surveillance",
        description: "Complete round-the-clock camera monitoring ensuring a safe, disciplined, and secure campus environment.",
        iconName: "ShieldCheck",
      },
    ],
    courses: [
      {
        title: "CBSE Class 9th & 10th Board Mastery",
        badge: "Foundation & Boards",
        classes: "Class 9 & 10",
        description: "Comprehensive NCERT syllabus coverage, weekly chapter tests, conceptual problem-solving, and board exam simulation.",
        subjects: ["Mathematics", "Science (Physics, Chemistry, Biology)", "Social Science", "English"],
      },
      {
        title: "CBSE Class 11th & 12th Science Stream",
        badge: "Senior Secondary",
        classes: "Class 11 & 12",
        description: "Rigorous concept clarity, board numerical drills, practical guidance, and competitive foundation.",
        subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
      },
      {
        title: "CBSE Class 11th & 12th Commerce Stream",
        badge: "Commerce Specialist",
        classes: "Class 11 & 12",
        description: "Deep ledger problem practice, micro/macro economics masterclasses, and case study solving techniques.",
        subjects: ["Accountancy", "Economics", "Business Studies", "Applied Mathematics"],
      },
      {
        title: "CUET (UG) Target Entrance Program",
        badge: "Entrance Exam",
        classes: "Class 12 & Passouts",
        description: "Subject domain revision, General Test speed techniques, and computer-based proctored mock drills.",
        subjects: ["Domain Subjects", "General Aptitude Test", "English Language"],
      },
    ],
    faqs: [
      {
        q: "What are the office visiting hours for IDL Education Budh Vihar?",
        a: "Our Budh Vihar centre is open from Monday to Saturday between 8:00 AM and 8:30 PM, and on Sundays from 9:00 AM to 2:00 PM for demo classes, parent counseling, and doubt sessions.",
      },
      {
        q: "Can I take a free demo class before enrolling at Budh Vihar?",
        a: "Yes! IDL Education offers 2 complimentary trial demo classes for any student. You can click 'Book Free Demo' or visit the centre directly to schedule your demo slot.",
      },
      {
        q: "What is the batch size at Budh Vihar branch?",
        a: "We maintain a strict maximum limit of 25 to 30 students per batch to guarantee personal faculty attention and individual doubt resolution.",
      },
      {
        q: "Is transport or van facility available for Budh Vihar?",
        a: "Yes, localized cab and van pickup/drop routes are operated for students coming from Budh Vihar Phase 1, Phase 2, Krishan Vihar, and adjoining Rohini sectors.",
      },
    ],
  },
  {
    id: "krishna-vihar",
    slug: "krishna-vihar",
    aliases: ["krishan-vihar", "krishnavihar", "krishanvihar"],
    name: "Krishna Vihar Branch",
    shortName: "Krishna Vihar",
    tagline: "Premier Offline Coaching Right Opposite Rohini Sector 24",
    shortArea: "Main Sultanpuri Road, Krishan Vihar, Delhi",
    fullAddress: "Main Sultanpuri Road, Krishan Vihar, Opposite Rohini Sector 24, Delhi - 110086",
    pincode: "110086",
    landmark: "Opposite Sector 24 Rohini, Near Pooth Kalan Chowk",
    nearestMetro: "Rithala Metro Station",
    metroLine: "Red Line",
    metroDistance: "Approx. 8-9 mins via Rohini Sector 24 Road",
    phone: "8860040010",
    altPhone: "+91 8860040010",
    email: "info@idleducation.in",
    timingsWeekday: "Monday to Saturday: 8:00 AM – 8:30 PM",
    timingsSunday: "Sunday: 9:00 AM – 2:00 PM (Weekly Mock Tests & Remedial Sessions)",
    mapLink: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6",
    mapEmbedQuery: "Krishan+Vihar+Main+Sultanpuri+Road+Delhi+110086",
    imageUrl: "/idlbranch.png",
    rating: "4.9",
    reviewCount: "385+ Reviews",
    overview:
      "IDL Education Krishna Vihar (Krishan Vihar) Centre is strategically located on Main Sultanpuri Road, conveniently accessible to students from Rohini Sectors 23, 24, 25, Pooth Kalan, and Sultanpuri. With small batch sizes, regular proctored test series, printed chapter modules, and expert mentors, this branch provides the ideal academic atmosphere for high board percentiles.",
    transportInfo: "Direct connectivity from Rohini Sectors 20-25, Pooth Kalan, and Sultanpuri with designated van routes.",
    batchSize: "Max 25-30 students per batch",
    facilities: [
      {
        title: "Smart Digital Classrooms",
        description: "Interactive smart screens with multimedia teaching tools to simplify complex Science and Maths theories.",
        iconName: "Monitor",
      },
      {
        title: "Personalized Faculty Mentoring",
        description: "Regular 1-on-1 feedback sessions after every weekly test to identify and fix conceptual weak spots.",
        iconName: "Users",
      },
      {
        title: "Weekly Proctored Mock Tests",
        description: "Full-length OMR and subjective board-pattern mock tests with performance analytics shared with parents.",
        iconName: "FileCheck",
      },
      {
        title: "Air-Conditioned & Power Backup",
        description: "100% power-backed air-conditioned classrooms ensuring zero interruption during crucial preparation periods.",
        iconName: "Wind",
      },
      {
        title: "Printed Modules & Question Banks",
        description: "Exclusively curated IDL study material, chapter summaries, formula sheets, and past 15-year questions.",
        iconName: "BookOpen",
      },
      {
        title: "Safe Campus & CCTV Monitored",
        description: "Round-the-clock surveillance, secure entry, and disciplined environment for complete peace of mind.",
        iconName: "ShieldCheck",
      },
    ],
    courses: [
      {
        title: "CBSE Class 9th & 10th Complete Board Prep",
        badge: "Foundation & Boards",
        classes: "Class 9 & 10",
        description: "Thorough NCERT coverage, diagrammatic science understanding, mathematical speed drills, and pre-board series.",
        subjects: ["Mathematics", "Science", "Social Science", "English"],
      },
      {
        title: "CBSE Class 11th & 12th Science (PCM / PCB)",
        badge: "Senior Secondary",
        classes: "Class 11 & 12",
        description: "In-depth derivation mastering, formula application, board question framing, and practical guidance.",
        subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
      },
      {
        title: "CBSE Class 11th & 12th Commerce",
        badge: "Commerce Excellence",
        classes: "Class 11 & 12",
        description: "Balance sheet accuracy drills, economic theory visualization, and business management case studies.",
        subjects: ["Accountancy", "Economics", "Business Studies", "Applied Maths"],
      },
      {
        title: "CUET (UG) Crash & Target Batches",
        badge: "Entrance Exam",
        classes: "Class 12 & Droppers",
        description: "Targeted university entrance coaching with time-management techniques and chapter-wise mock tests.",
        subjects: ["General Test", "Domain Subjects", "Language Test"],
      },
    ],
    faqs: [
      {
        q: "Where exactly is the Krishna Vihar branch located?",
        a: "Our Krishna Vihar centre is located on Main Sultanpuri Road, right opposite Sector 24 Rohini, near Pooth Kalan Chowk in North-West Delhi (Pincode: 110086).",
      },
      {
        q: "How can parents track student progress at Krishna Vihar?",
        a: "Parents receive automated SMS updates for daily attendance and detailed scorecards after each weekly mock test, alongside scheduled Parent-Teacher Meetings (PTMs).",
      },
      {
        q: "Are weekend doubt clearing sessions available?",
        a: "Yes! Every Sunday between 9:00 AM and 2:00 PM, subject specialists are stationed at the branch specifically for doubt clarification and remedial teaching.",
      },
      {
        q: "Can I book an offline demo class at Krishna Vihar?",
        a: "Yes, you can register online or call +91 8860040010 to reserve your free 2-day trial demo batch.",
      },
    ],
  },
  {
    id: "mangolpuri",
    slug: "mangolpuri",
    aliases: ["mangol-puri", "mangol_puri", "mangalpuri"],
    name: "Mangolpuri Branch",
    shortName: "Mangolpuri",
    tagline: "West Delhi's Leading Destination for Board & Competitive Success",
    shortArea: "Block I & Q Main Market Road, Mangol Puri, Delhi",
    fullAddress: "Block I & Q Main Market Road, Mangol Puri, Delhi - 110083",
    pincode: "110083",
    landmark: "Near Sanjay Gandhi Memorial Hospital & Q-Block Bus Terminal",
    nearestMetro: "Peeragarhi Metro Station",
    metroLine: "Green Line",
    metroDistance: "Approx. 6 mins by E-Rickshaw / Bus",
    phone: "8860040010",
    altPhone: "+91 8860040010",
    email: "info@idleducation.in",
    timingsWeekday: "Monday to Saturday: 8:00 AM – 8:30 PM",
    timingsSunday: "Sunday: 9:00 AM – 2:00 PM (Doubt Counters & Test Series)",
    mapLink: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6",
    mapEmbedQuery: "Mangol+Puri+Block+Q+Delhi+110083",
    imageUrl: "/idlbranch.png",
    rating: "4.8",
    reviewCount: "510+ Reviews",
    overview:
      "IDL Education Mangolpuri Centre is a powerhouse of academic training for West Delhi students from Mangolpuri, Peeragarhi, Paschim Vihar, and Nangloi. Driven by highly experienced educators with 10+ years of CBSE mentorship, this centre combines rigorous classroom coaching, state-of-the-art interactive smart boards, and exhaustive test series to deliver top board marks year after year.",
    transportInfo: "Well connected by DTC buses via Q-Block terminal and local e-rickshaw routes connecting Peeragarhi & Paschim Vihar.",
    batchSize: "Max 25-30 students per batch",
    facilities: [
      {
        title: "Senior Master Faculty",
        description: "Seasoned teachers with 10+ years of CBSE board paper evaluation and rank-producing experience.",
        iconName: "GraduationCap",
      },
      {
        title: "Interactive Smart Panels",
        description: "Engaging visual teaching using 4K digital display screens and live graph/formula demonstrations.",
        iconName: "Monitor",
      },
      {
        title: "Full-Length Board Test Series",
        description: "Regular pre-board simulation papers evaluated strictly per CBSE marking scheme guidelines.",
        iconName: "FileCheck",
      },
      {
        title: "Air-Conditioned Study Classrooms",
        description: "Spacious, well-ventilated, and fully climate-controlled rooms with power backup.",
        iconName: "Wind",
      },
      {
        title: "Regular Parent-Teacher Interaction",
        description: "Periodic counseling sessions and progress discussions to keep parents updated on student trajectory.",
        iconName: "Users",
      },
      {
        title: "Biometric Attendance & Security",
        description: "Digital card/biometric attendance logging and continuous CCTV coverage across all floors.",
        iconName: "ShieldCheck",
      },
    ],
    courses: [
      {
        title: "CBSE Class 9th & 10th Board Foundation",
        badge: "Foundation & Boards",
        classes: "Class 9 & 10",
        description: "Strong grounding in Science numericals, algebraic clarity, English language mastery, and SST answer writing.",
        subjects: ["Mathematics", "Science", "Social Science", "English"],
      },
      {
        title: "CBSE Class 11th & 12th Science Stream",
        badge: "Senior Secondary",
        classes: "Class 11 & 12",
        description: "Rigorous step-by-step problem-solving, board question forecasting, and laboratory practical guidance.",
        subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
      },
      {
        title: "CBSE Class 11th & 12th Commerce",
        badge: "Commerce Specialist",
        classes: "Class 11 & 12",
        description: "Conceptual clarity in accountancy conventions, macroeconomics graphs, and business study case analysis.",
        subjects: ["Accountancy", "Economics", "Business Studies", "Applied Maths"],
      },
      {
        title: "CUET Entrance & Scholarship Batches",
        badge: "Entrance Exam",
        classes: "Class 12 & Droppers",
        description: "Intensive domain prep, mock tests under timed conditions, and university admission guidance.",
        subjects: ["General Test", "Domain Subjects", "Language Test"],
      },
    ],
    faqs: [
      {
        q: "What is the landmark for IDL Education Mangolpuri?",
        a: "The centre is located near Sanjay Gandhi Memorial Hospital and the Q-Block Bus Terminal on Main Market Road, Mangol Puri, Delhi - 110083.",
      },
      {
        q: "Which is the nearest metro station to Mangolpuri branch?",
        a: "Peeragarhi Metro Station on the Green Line is the nearest station, approximately 6 minutes away by e-rickshaw or feeder bus.",
      },
      {
        q: "Does Mangolpuri branch provide printed study material?",
        a: "Yes, every enrolled student receives complete printed IDL modules, chapter worksheets, formula handbooks, and previous 10 years question banks with solutions.",
      },
      {
        q: "Are separate batches available for Science and Commerce?",
        a: "Yes, we run dedicated, separate stream-wise batches for Science (PCM/PCB) and Commerce (with & without Maths) with customized timetables.",
      },
    ],
  },
  {
    id: "mukherjee-nagar",
    slug: "mukherjee-nagar",
    aliases: ["mukharji-nagar", "mukherjeenagar", "mukharjinagar"],
    name: "Mukherjee Nagar Branch",
    shortName: "Mukherjee Nagar",
    tagline: "Flagship Academic Hub in North Delhi's Education District",
    shortArea: "Near Batra Cinema, Mukherjee Nagar, Delhi",
    fullAddress: "Commercial Complex, Near Batra Cinema, Mukherjee Nagar, Delhi - 110009",
    pincode: "110009",
    landmark: "Near Batra Cinema & Delhi University North Campus",
    nearestMetro: "GTB Nagar / Vishwavidyalaya Metro Station",
    metroLine: "Yellow Line",
    metroDistance: "Approx. 5 mins walk / e-rickshaw from GTB Nagar Metro Gate No. 2",
    phone: "8860040010",
    altPhone: "+91 8860040010",
    email: "info@idleducation.in",
    timingsWeekday: "Monday to Saturday: 8:00 AM – 9:00 PM",
    timingsSunday: "Sunday: 9:00 AM – 3:00 PM (Masterclasses, Topper Talks & Tests)",
    mapLink: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6",
    mapEmbedQuery: "Mukherjee+Nagar+Batra+Cinema+Delhi+110009",
    imageUrl: "/idlbranch.png",
    rating: "4.9",
    reviewCount: "680+ Reviews",
    overview:
      "IDL Education Mukherjee Nagar is our flagship centre situated in India's most celebrated educational hub. Located minutes from Delhi University North Campus and GTB Nagar Metro Station, this premier facility brings together Delhi's finest board and entrance mentors, high-tech smart classrooms, a comprehensive reference library, and an intensive peer learning culture.",
    transportInfo: "Unmatched connectivity via Delhi Metro Yellow Line (GTB Nagar & Vishwavidyalaya stations) and North Campus bus routes.",
    batchSize: "Max 25-30 students per batch",
    facilities: [
      {
        title: "Flagship Learning Infrastructure",
        description: "State-of-the-art campus featuring 4K interactive digital screens and high-speed research WiFi.",
        iconName: "Building2",
      },
      {
        title: "DU & Premier University Mentors",
        description: "Faculty team comprising veteran educators and University toppers with proven All-India board results.",
        iconName: "GraduationCap",
      },
      {
        title: "Reference & Self-Study Library",
        description: "Quiet library equipped with national reference textbooks, NCERT exemplars, and competitive prep materials.",
        iconName: "BookOpen",
      },
      {
        title: "Doubt Clearance Stations",
        description: "Continuous faculty presence for on-demand doubt resolution before and after classroom lectures.",
        iconName: "HelpCircle",
      },
      {
        title: "Air-Conditioned Soundproof Halls",
        description: "Acoustically designed, climate-controlled classrooms built to maximize student focus and retention.",
        iconName: "Wind",
      },
      {
        title: "24x7 CCTV & Biometric Safety",
        description: "Strict safety protocols with round-the-clock surveillance and automated parent SMS notifications.",
        iconName: "ShieldCheck",
      },
    ],
    courses: [
      {
        title: "CBSE Class 9th & 10th Advanced Foundation",
        badge: "Flagship Foundation",
        classes: "Class 9 & 10",
        description: "Mastery in Science, Mathematics, Social Science, and English with emphasis on Olympiad and Board topper percentiles.",
        subjects: ["Mathematics", "Science", "Social Science", "English"],
      },
      {
        title: "CBSE Class 11th & 12th Science (PCM / PCB)",
        badge: "Senior Secondary",
        classes: "Class 11 & 12",
        description: "Intensive concept building, numerical mastery, board exam answer-formatting, and practical exam guidance.",
        subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
      },
      {
        title: "CBSE Class 11th & 12th Commerce Stream",
        badge: "Commerce Excellence",
        classes: "Class 11 & 12",
        description: "Comprehensive Accountancy, Economics, BST, and Applied Maths coaching with real-life case analyses.",
        subjects: ["Accountancy", "Economics", "Business Studies", "Applied Maths"],
      },
      {
        title: "CUET (UG) Super-30 Target Batches",
        badge: "Premier Entrance",
        classes: "Class 12 & Droppers",
        description: "Specialized coaching targeting top Delhi University colleges (SRCC, St. Stephen's, Hindu, Hansraj).",
        subjects: ["General Test", "Domain Subjects", "Language Test"],
      },
    ],
    faqs: [
      {
        q: "Why is the Mukherjee Nagar branch called the flagship centre?",
        a: "Our Mukherjee Nagar centre features our most comprehensive infrastructure, largest reference library, and hosts masterclasses and topper interaction seminars in Delhi's historic educational corridor.",
      },
      {
        q: "How far is the branch from GTB Nagar Metro Station?",
        a: "It is approximately 5 minutes by e-rickshaw or a 10-minute walk from GTB Nagar Metro Station (Gate No. 2) on the Yellow Line.",
      },
      {
        q: "Are specialized CUET (UG) batches offered here?",
        a: "Yes! Mukherjee Nagar is our central hub for CUET (UG) preparation, offering domain-specific mock tests and dedicated General Test aptitude workshops.",
      },
      {
        q: "Can outstation or non-local students attend classes here?",
        a: "Yes, many students from across Delhi NCR, Haryana, and UP attend batches at Mukherjee Nagar, with multiple nearby student PGs and transport options available.",
      },
    ],
  },
];

export function getBranchBySlug(slug: string): BranchInfo | undefined {
  const normalized = slug.toLowerCase().trim();
  return BRANCHES_DATA.find(
    (b) => b.slug === normalized || b.aliases.includes(normalized) || b.id === normalized
  );
}
