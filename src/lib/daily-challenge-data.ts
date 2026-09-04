export interface ChallengeQuestion {
  id: string;
  subject: 'Mathematics' | 'Science' | 'Reasoning' | 'General Knowledge';
  question: string;
  options: [string, string, string, string];
  correctIndex: number; // 0 for A, 1 for B, 2 for C, 3 for D
  explanation: string;
}

export type ClassLevel = '6' | '7' | '8' | '9' | '10';

export interface DailySet {
  id: string;
  questions: ChallengeQuestion[];
}

export const CLASS_QUESTIONS: Record<ClassLevel, DailySet[]> = {
  '6': [
    {
      id: 'c6_set1',
      questions: [
        {
          id: 'c6_s1_q1',
          subject: 'Mathematics',
          question: 'What is the value of 3/4 + 2/4 expressed in simplest form?',
          options: ['5/4', '5/8', '1/4', '6/4'],
          correctIndex: 0,
          explanation: 'When adding fractions with like denominators, add the numerators: 3 + 2 = 5. So, 3/4 + 2/4 = 5/4.',
        },
        {
          id: 'c6_s1_q2',
          subject: 'Science',
          question: 'Which component of food is primarily responsible for growth and repairing damaged tissues in our body?',
          options: ['Carbohydrates', 'Fats', 'Proteins', 'Vitamins'],
          correctIndex: 2,
          explanation: 'Proteins are body-building foods essential for growth, muscle building, and tissue repair.',
        },
        {
          id: 'c6_s1_q3',
          subject: 'Reasoning',
          question: 'Find the next number in the sequence: 4, 8, 12, 16, ?',
          options: ['18', '20', '22', '24'],
          correctIndex: 1,
          explanation: 'This is an arithmetic sequence where 4 is added each time: 16 + 4 = 20.',
        },
        {
          id: 'c6_s1_q4',
          subject: 'Science',
          question: 'Which of the following is a good electrical conductor?',
          options: ['Plastic ruler', 'Dry wood', 'Iron nail', 'Rubber eraser'],
          correctIndex: 2,
          explanation: 'Metals like iron allow electricity to pass through them easily, making an iron nail a conductor.',
        },
        {
          id: 'c6_s1_q5',
          subject: 'Mathematics',
          question: 'If the side of a square garden is 12 meters, what is its perimeter?',
          options: ['24 meters', '36 meters', '48 meters', '144 meters'],
          correctIndex: 2,
          explanation: 'Perimeter of a square = 4 × side length = 4 × 12 = 48 meters.',
        },
      ],
    },
    {
      id: 'c6_set2',
      questions: [
        {
          id: 'c6_s2_q1',
          subject: 'Mathematics',
          question: 'Which of the following integers is the smallest?',
          options: ['-15', '-3', '0', '2'],
          correctIndex: 0,
          explanation: 'On a number line, numbers further to the left are smaller. -15 is smaller than -3, 0, and 2.',
        },
        {
          id: 'c6_s2_q2',
          subject: 'Science',
          question: 'What process do green plants use to synthesize their own food using sunlight?',
          options: ['Respiration', 'Photosynthesis', 'Transpiration', 'Fermentation'],
          correctIndex: 1,
          explanation: 'Photosynthesis is the process by which green plants make food from carbon dioxide and water using sunlight and chlorophyll.',
        },
        {
          id: 'c6_s2_q3',
          subject: 'Reasoning',
          question: 'Which word does NOT belong with the others?',
          options: ['Circle', 'Square', 'Triangle', 'Cylinder'],
          correctIndex: 3,
          explanation: 'Circle, square, and triangle are two-dimensional flat plane shapes, while a cylinder is three-dimensional.',
        },
        {
          id: 'c6_s2_q4',
          subject: 'Mathematics',
          question: 'What is the greatest common factor (HCF) of 18 and 24?',
          options: ['2', '3', '6', '12'],
          correctIndex: 2,
          explanation: 'Factors of 18 are 1, 2, 3, 6, 9, 18. Factors of 24 are 1, 2, 3, 4, 6, 8, 12, 24. The highest common factor is 6.',
        },
        {
          id: 'c6_s2_q5',
          subject: 'Science',
          question: 'Which vitamin is synthesized in our body when exposed to sunlight?',
          options: ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'],
          correctIndex: 3,
          explanation: 'Human skin synthesizes Vitamin D naturally when exposed to sunlight.',
        },
      ],
    },
    {
      id: 'c6_set3',
      questions: [
        {
          id: 'c6_s3_q1',
          subject: 'Mathematics',
          question: 'What is the place value of 7 in the decimal 24.573?',
          options: ['7 units', '7 tenths', '7 hundredths', '7 thousandths'],
          correctIndex: 2,
          explanation: 'In 24.573, 5 is in the tenths place, and 7 is in the hundredths place (0.07).',
        },
        {
          id: 'c6_s3_q2',
          subject: 'Science',
          question: 'Which part of the plant absorbs water and minerals from the soil?',
          options: ['Roots', 'Leaves', 'Stem', 'Flowers'],
          correctIndex: 0,
          explanation: 'Roots anchor the plant and absorb essential water and dissolved minerals from the soil.',
        },
        {
          id: 'c6_s3_q3',
          subject: 'Reasoning',
          question: 'If CLOCK is coded as 3-12-15-3-11, how is BOOK coded?',
          options: ['2-15-15-11', '2-14-14-11', '1-15-15-10', '2-15-14-11'],
          correctIndex: 0,
          explanation: 'Each letter is replaced by its alphabetical position: B=2, O=15, O=15, K=11.',
        },
        {
          id: 'c6_s3_q4',
          subject: 'Mathematics',
          question: 'How many lines of symmetry does a regular equilateral triangle have?',
          options: ['1', '2', '3', 'Infinite'],
          correctIndex: 2,
          explanation: 'An equilateral triangle has 3 lines of symmetry passing through each vertex to the midpoint of the opposite side.',
        },
        {
          id: 'c6_s3_q5',
          subject: 'General Knowledge',
          question: 'Which gas makes up approximately 78% of the Earth’s atmosphere?',
          options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Argon'],
          correctIndex: 1,
          explanation: 'Nitrogen gas accounts for roughly 78% of Earth’s atmospheric composition.',
        },
      ],
    },
  ],
  '7': [
    {
      id: 'c7_set1',
      questions: [
        {
          id: 'c7_s1_q1',
          subject: 'Mathematics',
          question: 'Solve for x: 3x - 7 = 14',
          options: ['x = 5', 'x = 7', 'x = 8', 'x = 9'],
          correctIndex: 1,
          explanation: '3x = 14 + 7 => 3x = 21 => x = 7.',
        },
        {
          id: 'c7_s1_q2',
          subject: 'Science',
          question: 'What is the normal human body temperature on the Celsius scale?',
          options: ['35°C', '37°C', '39°C', '98.6°C'],
          correctIndex: 1,
          explanation: 'Average normal human body temperature is approximately 37°C (which corresponds to 98.6°F).',
        },
        {
          id: 'c7_s1_q3',
          subject: 'Reasoning',
          question: 'Book is to Reading as Fork is to: ?',
          options: ['Writing', 'Eating', 'Cooking', 'Drinking'],
          correctIndex: 1,
          explanation: 'A book is an instrument used for reading; a fork is an instrument used for eating.',
        },
        {
          id: 'c7_s1_q4',
          subject: 'Science',
          question: 'What type of mirror is commonly used as a rear-view mirror in vehicles?',
          options: ['Plane mirror', 'Concave mirror', 'Convex mirror', 'Cylindrical mirror'],
          correctIndex: 2,
          explanation: 'Convex mirrors always produce erect, diminished images and provide a wider field of view.',
        },
        {
          id: 'c7_s1_q5',
          subject: 'Mathematics',
          question: 'What is the area of a circle with radius 7 cm? (Take π = 22/7)',
          options: ['44 cm²', '88 cm²', '154 cm²', '196 cm²'],
          correctIndex: 2,
          explanation: 'Area = πr² = (22/7) × 7 × 7 = 22 × 7 = 154 cm².',
        },
      ],
    },
    {
      id: 'c7_set2',
      questions: [
        {
          id: 'c7_s2_q1',
          subject: 'Mathematics',
          question: 'Evaluate: (-8) × (-5) - (-10)',
          options: ['-50', '30', '50', '-30'],
          correctIndex: 2,
          explanation: '(-8) × (-5) = +40. Then 40 - (-10) = 40 + 10 = 50.',
        },
        {
          id: 'c7_s2_q2',
          subject: 'Science',
          question: 'What turns blue litmus paper red?',
          options: ['Acidic solution', 'Basic solution', 'Neutral solution', 'Pure water'],
          correctIndex: 0,
          explanation: 'Acids turn blue litmus red, whereas bases turn red litmus blue.',
        },
        {
          id: 'c7_s2_q3',
          subject: 'Reasoning',
          question: 'Look at the series: 2, 6, 18, 54, ... What comes next?',
          options: ['108', '148', '162', '216'],
          correctIndex: 2,
          explanation: 'Each number is multiplied by 3: 54 × 3 = 162.',
        },
        {
          id: 'c7_s2_q4',
          subject: 'Science',
          question: 'Which organ pumps blood throughout the human body?',
          options: ['Lungs', 'Heart', 'Kidneys', 'Liver'],
          correctIndex: 1,
          explanation: 'The heart is a muscular organ that acts as a continuous pump driving circulation.',
        },
        {
          id: 'c7_s2_q5',
          subject: 'Mathematics',
          question: 'Two angles are supplementary. If one angle is 115°, what is the other angle?',
          options: ['65°', '75°', '85°', '95°'],
          correctIndex: 0,
          explanation: 'Supplementary angles sum to 180°. 180° - 115° = 65°.',
        },
      ],
    },
    {
      id: 'c7_set3',
      questions: [
        {
          id: 'c7_s3_q1',
          subject: 'Mathematics',
          question: 'A bag contains 3 red balls and 5 blue balls. What is the probability of picking a blue ball?',
          options: ['3/8', '5/8', '3/5', '5/3'],
          correctIndex: 1,
          explanation: 'Total balls = 8. Blue balls = 5. Probability = 5/8.',
        },
        {
          id: 'c7_s3_q2',
          subject: 'Science',
          question: 'What is the green pigment in plant leaves that traps light energy?',
          options: ['Carotene', 'Chlorophyll', 'Haemoglobin', 'Melanin'],
          correctIndex: 1,
          explanation: 'Chlorophyll is the green pigment that absorbs light energy necessary for photosynthesis.',
        },
        {
          id: 'c7_s3_q3',
          subject: 'Reasoning',
          question: 'Pointing to a photo, Raman said, "She is my mother\'s only daughter." Who is she to Raman?',
          options: ['Aunt', 'Sister', 'Niece', 'Cousin'],
          correctIndex: 1,
          explanation: 'Raman’s mother’s daughter is Raman’s sister.',
        },
        {
          id: 'c7_s3_q4',
          subject: 'Mathematics',
          question: 'If 40% of a number is 80, what is the number?',
          options: ['160', '200', '240', '320'],
          correctIndex: 1,
          explanation: '0.40 × X = 80 => X = 80 / 0.40 = 200.',
        },
        {
          id: 'c7_s3_q5',
          subject: 'General Knowledge',
          question: 'Which instrument measures atmospheric pressure?',
          options: ['Thermometer', 'Barometer', 'Anemometer', 'Hygrometer'],
          correctIndex: 1,
          explanation: 'A barometer is used to measure atmospheric pressure.',
        },
      ],
    },
  ],
  '8': [
    {
      id: 'c8_set1',
      questions: [
        {
          id: 'c8_s1_q1',
          subject: 'Mathematics',
          question: 'What is the square root of 1.44?',
          options: ['0.12', '1.2', '12', '1.44'],
          correctIndex: 1,
          explanation: '1.2 × 1.2 = 1.44, so the square root of 1.44 is 1.2.',
        },
        {
          id: 'c8_s1_q2',
          subject: 'Science',
          question: 'What is the SI unit of force?',
          options: ['Joule', 'Pascal', 'Newton', 'Watt'],
          correctIndex: 2,
          explanation: 'Force is measured in Newtons (N) in the SI metric system.',
        },
        {
          id: 'c8_s1_q3',
          subject: 'Reasoning',
          question: 'If SOUTH-EAST becomes NORTH, and NORTH-EAST becomes WEST, what will WEST become?',
          options: ['SOUTH-EAST', 'SOUTH', 'NORTH-WEST', 'SOUTH-WEST'],
          correctIndex: 0,
          explanation: 'The directions are rotated 135° clockwise. Rotating West by 135° clockwise gives South-East.',
        },
        {
          id: 'c8_s1_q4',
          subject: 'Science',
          question: 'Which organelle is universally known as the "Powerhouse of the Cell"?',
          options: ['Ribosome', 'Nucleus', 'Mitochondria', 'Chloroplast'],
          correctIndex: 2,
          explanation: 'Mitochondria generate most of the chemical energy needed by the cell (ATP).',
        },
        {
          id: 'c8_s1_q5',
          subject: 'Mathematics',
          question: 'Simplify: (2³)² × 2⁻⁴',
          options: ['2', '4', '8', '16'],
          correctIndex: 1,
          explanation: '(2³)² = 2⁶. Then 2⁶ × 2⁻⁴ = 2^(6 - 4) = 2² = 4.',
        },
      ],
    },
    {
      id: 'c8_set2',
      questions: [
        {
          id: 'c8_s2_q1',
          subject: 'Mathematics',
          question: 'A shopkeeper offers a 20% discount on an item marked at ₹500. What is the selling price?',
          options: ['₹380', '₹400', '₹420', '₹450'],
          correctIndex: 1,
          explanation: 'Discount = 20% of 500 = ₹100. Selling Price = 500 - 100 = ₹400.',
        },
        {
          id: 'c8_s2_q2',
          subject: 'Science',
          question: 'Which non-metal is stored under water because it catches fire readily in air?',
          options: ['Sulfur', 'Carbon', 'Phosphorus', 'Iodine'],
          correctIndex: 2,
          explanation: 'White phosphorus is highly reactive and catches fire when exposed to air, so it is kept immersed in water.',
        },
        {
          id: 'c8_s2_q3',
          subject: 'Reasoning',
          question: 'Complete the pattern: AZ, BY, CX, DW, ?',
          options: ['EV', 'EU', 'FU', 'FV'],
          correctIndex: 0,
          explanation: 'First letters go forward (A, B, C, D, E); second letters go backward (Z, Y, X, W, V). Next is EV.',
        },
        {
          id: 'c8_s2_q4',
          subject: 'Science',
          question: 'Sound waves cannot travel through which of the following?',
          options: ['Water', 'Steel', 'Air', 'Vacuum'],
          correctIndex: 3,
          explanation: 'Sound requires a material medium to propagate; it cannot travel through a vacuum.',
        },
        {
          id: 'c8_s2_q5',
          subject: 'Mathematics',
          question: 'What is the sum of the interior angles of a pentagon (5 sides)?',
          options: ['360°', '540°', '720°', '900°'],
          correctIndex: 1,
          explanation: 'Sum = (n - 2) × 180° = (5 - 2) × 180° = 3 × 180° = 540°.',
        },
      ],
    },
    {
      id: 'c8_set3',
      questions: [
        {
          id: 'c8_s3_q1',
          subject: 'Mathematics',
          question: 'Factorize completely: x² - 49',
          options: ['(x - 7)²', '(x + 7)²', '(x - 7)(x + 7)', '(x - 49)(x + 1)'],
          correctIndex: 2,
          explanation: 'Using difference of squares: a² - b² = (a - b)(a + b). Hence x² - 7² = (x - 7)(x + 7).',
        },
        {
          id: 'c8_s3_q2',
          subject: 'Science',
          question: 'Which gas is responsible for the greenhouse effect and global warming?',
          options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'],
          correctIndex: 2,
          explanation: 'Carbon dioxide traps heat in the atmosphere, driving the greenhouse effect.',
        },
        {
          id: 'c8_s3_q3',
          subject: 'Reasoning',
          question: 'If 5 * 3 = 28 and 9 * 1 = 82, what is 7 * 4 = ?',
          options: ['51', '53', '55', '65'],
          correctIndex: 1,
          explanation: 'Rule: (First - Second) followed by (First + Second). (7 - 4) = 3 and (7 + 4) = 11? Or (5*5)+3 = 28; (9*9)+1 = 82; so (7*7)+4 = 49+4 = 53.',
        },
        {
          id: 'c8_s3_q4',
          subject: 'Mathematics',
          question: 'What is the volume of a cube whose edge length is 5 cm?',
          options: ['25 cm³', '100 cm³', '125 cm³', '150 cm³'],
          correctIndex: 2,
          explanation: 'Volume = edge³ = 5 × 5 × 5 = 125 cm³.',
        },
        {
          id: 'c8_s3_q5',
          subject: 'General Knowledge',
          question: 'Which celestial body is known as the "Morning Star" and "Evening Star"?',
          options: ['Mars', 'Venus', 'Jupiter', 'Mercury'],
          correctIndex: 1,
          explanation: 'Venus shines brightly before sunrise and after sunset, earning it these titles.',
        },
      ],
    },
  ],
  '9': [
    {
      id: 'c9_set1',
      questions: [
        {
          id: 'c9_s1_q1',
          subject: 'Mathematics',
          question: 'Which of the following numbers is irrational?',
          options: ['√16', '√25', '√7', '0.333...'],
          correctIndex: 2,
          explanation: '√7 is non-terminating and non-repeating, making it an irrational number. √16=4 and √25=5 are rational.',
        },
        {
          id: 'c9_s1_q2',
          subject: 'Science',
          question: 'According to Newton’s Second Law of Motion, Force is equal to:',
          options: ['Mass / Acceleration', 'Mass × Acceleration', 'Mass × Velocity', 'Acceleration / Mass'],
          correctIndex: 1,
          explanation: 'Newton’s second law states F = m × a (Force = Mass × Acceleration).',
        },
        {
          id: 'c9_s1_q3',
          subject: 'Reasoning',
          question: 'In a certain code, TEACHER is written as VGCEJGT. How is CHILDREN written in that code?',
          options: ['EJKNFTGP', 'EJKNFITP', 'EKJNITGP', 'EJKNFTIP'],
          correctIndex: 0,
          explanation: 'Each letter is shifted forward by +2 positions in the alphabet: C->E, H->J, I->K, L->N, D->F, R->T, E->G, N->P.',
        },
        {
          id: 'c9_s1_q4',
          subject: 'Science',
          question: 'Which tissue in vascular plants is responsible for transporting water from roots upward?',
          options: ['Phloem', 'Xylem', 'Parenchyma', 'Collenchyma'],
          correctIndex: 1,
          explanation: 'Xylem conducts water and dissolved minerals upward, while phloem transports food sugars.',
        },
        {
          id: 'c9_s1_q5',
          subject: 'Mathematics',
          question: 'If the polynomial P(x) = 2x² - 3x + k has a zero at x = 2, what is the value of k?',
          options: ['-2', '2', '-4', '4'],
          correctIndex: 0,
          explanation: 'P(2) = 2(2)² - 3(2) + k = 0 => 2(4) - 6 + k = 0 => 8 - 6 + k = 0 => 2 + k = 0 => k = -2.',
        },
      ],
    },
    {
      id: 'c9_set2',
      questions: [
        {
          id: 'c9_s2_q1',
          subject: 'Mathematics',
          question: 'In which quadrant does the coordinate point (-4, 5) lie?',
          options: ['Quadrant I', 'Quadrant II', 'Quadrant III', 'Quadrant IV'],
          correctIndex: 1,
          explanation: 'When x is negative and y is positive, the point lies in Quadrant II.',
        },
        {
          id: 'c9_s2_q2',
          subject: 'Science',
          question: 'What is the universal gravitational constant G approximately equal to?',
          options: ['9.8 m/s²', '6.67 × 10⁻¹¹ N m²/kg²', '3.0 × 10⁸ m/s', '1.6 × 10⁻¹⁹ C'],
          correctIndex: 1,
          explanation: 'The universal gravitational constant G = 6.674 × 10⁻¹¹ N·m²/kg².',
        },
        {
          id: 'c9_s2_q3',
          subject: 'Reasoning',
          question: 'Choose the odd one out: 64, 125, 216, 343, 512, 729, 1000',
          options: ['64', '125', '216', 'All are perfect cubes'],
          correctIndex: 3,
          explanation: 'All numbers listed are cubes of 4, 5, 6, 7, 8, 9, 10.',
        },
        {
          id: 'c9_s2_q4',
          subject: 'Science',
          question: 'What is the molar mass of water (H₂O)? (Atomic masses: H = 1, O = 16)',
          options: ['17 g/mol', '18 g/mol', '20 g/mol', '32 g/mol'],
          correctIndex: 1,
          explanation: 'Mass = 2 × (1) + 16 = 18 g/mol.',
        },
        {
          id: 'c9_s2_q5',
          subject: 'Mathematics',
          question: 'The diagonal of a square is 10√2 cm. What is its perimeter?',
          options: ['20 cm', '40 cm', '50 cm', '80 cm'],
          correctIndex: 1,
          explanation: 'Diagonal = side × √2 => side = 10 cm. Perimeter = 4 × 10 = 40 cm.',
        },
      ],
    },
    {
      id: 'c9_set3',
      questions: [
        {
          id: 'c9_s3_q1',
          subject: 'Mathematics',
          question: 'Evaluate (x + 3)(x - 3) using standard algebraic identity:',
          options: ['x² - 6', 'x² - 9', 'x² + 9', 'x² - 6x + 9'],
          correctIndex: 1,
          explanation: '(a + b)(a - b) = a² - b² => x² - 3² = x² - 9.',
        },
        {
          id: 'c9_s3_q2',
          subject: 'Science',
          question: 'Which state of matter has neither fixed shape nor fixed volume?',
          options: ['Solid', 'Liquid', 'Gas', 'Colloid'],
          correctIndex: 2,
          explanation: 'Gases have no fixed shape and no fixed volume; they completely occupy any container.',
        },
        {
          id: 'c9_s3_q3',
          subject: 'Reasoning',
          question: 'If A is taller than B, B is taller than C, and D is taller than A, who is the shortest?',
          options: ['A', 'B', 'C', 'D'],
          correctIndex: 2,
          explanation: 'Order: D > A > B > C. C is the shortest.',
        },
        {
          id: 'c9_s3_q4',
          subject: 'Science',
          question: 'What is the rate of doing work or rate of energy transfer called?',
          options: ['Power', 'Torque', 'Pressure', 'Momentum'],
          correctIndex: 0,
          explanation: 'Power is defined as work done divided by time taken (P = W / t).',
        },
        {
          id: 'c9_s3_q5',
          subject: 'General Knowledge',
          question: 'Who formulated the Three Laws of Planetary Motion?',
          options: ['Isaac Newton', 'Galileo Galilei', 'Johannes Kepler', 'Nicolaus Copernicus'],
          correctIndex: 2,
          explanation: 'Johannes Kepler formulated the three empirical laws describing orbital planetary motion.',
        },
      ],
    },
  ],
  '10': [
    {
      id: 'c10_set1',
      questions: [
        {
          id: 'c10_s1_q1',
          subject: 'Mathematics',
          question: 'What are the roots of the quadratic equation x² - 5x + 6 = 0?',
          options: ['2 and 3', '-2 and -3', '1 and 6', '-1 and -6'],
          correctIndex: 0,
          explanation: 'Factoring: (x - 2)(x - 3) = 0, giving roots x = 2 and x = 3.',
        },
        {
          id: 'c10_s1_q2',
          subject: 'Science',
          question: 'According to Ohm’s Law, at constant temperature, current (I) is directly proportional to:',
          options: ['Resistance', 'Potential difference (Voltage)', 'Power', 'Heat'],
          correctIndex: 1,
          explanation: 'Ohm’s law states V = I × R, meaning current I is directly proportional to applied voltage V.',
        },
        {
          id: 'c10_s1_q3',
          subject: 'Reasoning',
          question: 'If sin θ = 3/5 in a right triangle, what is the value of cos θ?',
          options: ['4/5', '3/4', '5/4', '1/2'],
          correctIndex: 0,
          explanation: 'Using cos²θ = 1 - sin²θ = 1 - 9/25 = 16/25 => cos θ = 4/5.',
        },
        {
          id: 'c10_s1_q4',
          subject: 'Science',
          question: 'What is the chemical formula of bleaching powder?',
          options: ['NaHCO₃', 'Na₂CO₃·10H₂O', 'CaOCl₂', 'CaSO₄·½H₂O'],
          correctIndex: 2,
          explanation: 'Bleaching powder is calcium oxychloride, represented by CaOCl₂.',
        },
        {
          id: 'c10_s1_q5',
          subject: 'Mathematics',
          question: 'What is the 10th term of the Arithmetic Progression: 2, 7, 12, 17, ...?',
          options: ['42', '47', '52', '57'],
          correctIndex: 1,
          explanation: 'a = 2, common difference d = 5. a₁₀ = a + (10 - 1)d = 2 + 9(5) = 2 + 45 = 47.',
        },
      ],
    },
    {
      id: 'c10_set2',
      questions: [
        {
          id: 'c10_s2_q1',
          subject: 'Mathematics',
          question: 'If the discriminant of ax² + bx + c = 0 is greater than zero (D > 0), the roots are:',
          options: ['Real and equal', 'Real and distinct', 'Complex / No real roots', 'Zero'],
          correctIndex: 1,
          explanation: 'When discriminant b² - 4ac > 0, the quadratic has two distinct real roots.',
        },
        {
          id: 'c10_s2_q2',
          subject: 'Science',
          question: 'What is the power of a lens having a focal length of +0.5 meters?',
          options: ['+0.5 D', '+1.0 D', '+2.0 D', '+5.0 D'],
          correctIndex: 2,
          explanation: 'Power P = 1 / f(in meters) = 1 / 0.5 = +2.0 Dioptres.',
        },
        {
          id: 'c10_s2_q3',
          subject: 'Reasoning',
          question: 'Find the missing number in the matrix: [2, 3, 13], [4, 1, 17], [5, 2, ?]',
          options: ['25', '27', '29', '31'],
          correctIndex: 2,
          explanation: 'Rule: First² + Second² = Third. 2² + 3² = 4 + 9 = 13; 4² + 1² = 16 + 1 = 17; 5² + 2² = 25 + 4 = 29.',
        },
        {
          id: 'c10_s2_q4',
          subject: 'Science',
          question: 'Which enzyme in human saliva begins the digestion of dietary starches?',
          options: ['Pepsin', 'Salivary Amylase', 'Trypsin', 'Lipase'],
          correctIndex: 1,
          explanation: 'Salivary amylase (ptyalin) breaks down starches into simpler sugars in the mouth.',
        },
        {
          id: 'c10_s2_q5',
          subject: 'Mathematics',
          question: 'The distance between points (0, 0) and (6, 8) in a Cartesian plane is:',
          options: ['10', '12', '14', '100'],
          correctIndex: 0,
          explanation: 'Distance = √(6² + 8²) = √(36 + 64) = √100 = 10 units.',
        },
      ],
    },
    {
      id: 'c10_set3',
      questions: [
        {
          id: 'c10_s3_q1',
          subject: 'Mathematics',
          question: 'What is the value of (tan 45° + cot 45°)?',
          options: ['0', '1', '2', '√3'],
          correctIndex: 2,
          explanation: 'tan 45° = 1 and cot 45° = 1. So 1 + 1 = 2.',
        },
        {
          id: 'c10_s3_q2',
          subject: 'Science',
          question: 'Which of the following metals is so soft that it can be easily cut with a kitchen knife?',
          options: ['Iron', 'Sodium', 'Aluminium', 'Copper'],
          correctIndex: 1,
          explanation: 'Alkali metals like Sodium and Potassium have low density and can be cut cleanly with a knife.',
        },
        {
          id: 'c10_s3_q3',
          subject: 'Reasoning',
          question: 'Complete the sequence: 3, 5, 9, 17, 33, ?',
          options: ['49', '60', '65', '67'],
          correctIndex: 2,
          explanation: 'Differences are 2, 4, 8, 16, 32. So 33 + 32 = 65 (or 2n - 1 progression).',
        },
        {
          id: 'c10_s3_q4',
          subject: 'Science',
          question: 'What is the functional unit of the human kidney?',
          options: ['Neuron', 'Nephron', 'Alveolus', 'Villus'],
          correctIndex: 1,
          explanation: 'Nephrons are the microscopic structural and functional filtration units of the kidney.',
        },
        {
          id: 'c10_s3_q5',
          subject: 'General Knowledge',
          question: 'Which scientist is known as the "Father of Genetics" for his experiments on pea plants?',
          options: ['Charles Darwin', 'Gregor Mendel', 'Louis Pasteur', 'Alexander Fleming'],
          correctIndex: 1,
          explanation: 'Gregor Johann Mendel discovered the fundamental laws of inheritance through his work on pea plants.',
        },
      ],
    },
  ],
};

/**
 * Returns a deterministic daily question set for the selected class based on today's calendar date.
 */
export function getDailyQuestionsForClass(classLevel: ClassLevel, dateStr?: string): ChallengeQuestion[] {
  const sets = CLASS_QUESTIONS[classLevel] || CLASS_QUESTIONS['8'];
  const today = dateStr || new Date().toISOString().split('T')[0];
  
  // Hash the date string into a consistent daily integer index
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = (hash * 31 + today.charCodeAt(i)) % 1000000;
  }
  
  const setIndex = Math.abs(hash) % sets.length;
  return sets[setIndex].questions;
}
