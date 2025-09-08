
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from 'next/navigation'
import { Suspense, use } from "react";
import { NotesContentRenderer } from "@/components/notes-content-renderer";

const notesData: { [key: string]: { en: { title: string, content: string }, hi: { title: string, content: string } } } = {
  'knowing-our-numbers': {
    en: {
      title: 'Chapter 1: Knowing Our Numbers',
      content: `### Comparing Numbers
- To compare two numbers, we look at the number of digits. The number with more digits is greater.
- If the number of digits is the same, we compare the digits from the leftmost place.
- **Example:** Comparing 4875 and 3542. Both have 4 digits. The leftmost digit in 4875 is 4 and in 3542 is 3. Since 4 > 3, 4875 > 3542.

### Large Numbers
- We use commas to read and write large numbers.
- **Indian System of Numeration:** We use commas after the 3rd, 5th, and 7th digits from the right. The periods are ones, thousands, lakhs, crores.
- **Example:** 5,08,01,592 is read as 'Five crore eight lakh one thousand five hundred ninety-two'.
- **International System of Numeration:** We use commas after every 3 digits from the right. The periods are ones, thousands, millions, billions.
- **Example:** 50,801,592 is read as 'Fifty million, eight hundred one thousand, five hundred ninety-two'.

### Estimation
- Estimation is finding a number that is close enough to the right answer.
- **Rounding to the nearest tens:** Look at the ones digit. If it is 5 or more, round up. If it is less than 5, round down.
- **Example:** 58 is rounded to 60. 52 is rounded to 50.
- **Rounding to the nearest hundreds:** Look at the tens digit.
- **Example:** 648 is rounded to 600. 688 is rounded to 700.
- **Rounding to the nearest thousands:** Look at the hundreds digit.
- **Example:** 2573 is rounded to 3000. 2345 is rounded to 2000.

### Roman Numerals
- A system of numerical notation based on letters of the ancient Roman alphabet.
- I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000.
- **Rules:**
- - A symbol is not repeated more than three times.
- - If a symbol of smaller value is written to the right of a symbol of greater value, its value gets added. (e.g., VI = 5 + 1 = 6).
- - If a symbol of smaller value is written to the left of a symbol of greater value, its value is subtracted. (e.g., IV = 5 - 1 = 4).
`
    },
    hi: {
      title: 'अध्याय 1: अपनी संख्याओं की जानकारी',
      content: `### संख्याओं की तुलना
- दो संख्याओं की तुलना करने के लिए, हम अंकों की संख्या देखते हैं। अधिक अंकों वाली संख्या बड़ी होती है।
- यदि अंकों की संख्या समान है, तो हम सबसे बाईं ओर के स्थान से अंकों की तुलना करते हैं।
- **उदाहरण:** 4875 और 3542 की तुलना। दोनों में 4 अंक हैं। 4875 में सबसे बायां अंक 4 है और 3542 में 3 है। चूँकि 4 > 3, इसलिए 4875 > 3542।

### बड़ी संख्याएँ
- हम बड़ी संख्याओं को पढ़ने और लिखने के लिए अल्पविराम का उपयोग करते हैं।
- **भारतीय संख्यांकन पद्धति:** हम दाईं ओर से तीसरे, पांचवें और सातवें अंक के बाद अल्पविराम का उपयोग करते हैं। आवर्त क्रमशः इकाई, हजार, लाख, करोड़ हैं।
- **उदाहरण:** 5,08,01,592 को 'पांच करोड़ आठ लाख एक हजार पांच सौ बानवे' पढ़ा जाता है।
- **अंतर्राष्ट्रीय संख्यांकन पद्धति:** हम दाईं ओर से प्रत्येक 3 अंकों के बाद अल्पविराम का उपयोग करते हैं। आवर्त क्रमशः इकाई, हजार, मिलियन, बिलियन हैं।
- **उदाहरण:** 50,801,592 को 'पचास मिलियन, आठ सौ एक हजार, पांच सौ बानवे' पढ़ा जाता है।

### आकलन (Estimation)
- आकलन एक ऐसी संख्या ज्ञात करना है जो सही उत्तर के काफी करीब हो।
- **निकटतम दहाई तक सन्निकटन:** इकाई अंक को देखें। यदि यह 5 या अधिक है, तो इसे बढ़ा दें। यदि यह 5 से कम है, तो इसे घटा दें।
- **उदाहरण:** 58 को 60 तक सन्निकटित किया जाता है। 52 को 50 तक सन्निकटित किया जाता है।
- **निकटतम सौ तक सन्निकटन:** दहाई अंक को देखें।
- **उदाहरण:** 648 को 600 तक सन्निकटित किया जाता है। 688 को 700 तक सन्निकटित किया जाता है।
- **निकटतम हजार तक सन्निकटन:** सौ के अंक को देखें।
- **उदाहरण:** 2573 को 3000 तक सन्निकटित किया जाता है। 2345 को 2000 तक सन्निकटित किया जाता है।

### रोमन संख्यांक
- प्राचीन रोमन वर्णमाला के अक्षरों पर आधारित एक संख्यात्मक अंकन प्रणाली।
- I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000।
- **नियम:**
- - एक प्रतीक को तीन बार से अधिक दोहराया नहीं जाता है।
- - यदि छोटे मान का प्रतीक बड़े मान के प्रतीक के दाईं ओर लिखा जाता है, तो उसका मान जुड़ जाता है (जैसे, VI = 5 + 1 = 6)।
- - यदि छोटे मान का प्रतीक बड़े मान के प्रतीक के बाईं ओर लिखा जाता है, तो उसका मान घटाया जाता है (जैसे, IV = 5 - 1 = 4)।
`
    }
  },
  'whole-numbers': {
    en: {
      title: 'Chapter 2: Whole Numbers',
      content: `### Introduction to Whole Numbers
- **Natural Numbers:** Counting numbers 1, 2, 3, 4, ... are called natural numbers.
- **Whole Numbers:** Natural numbers along with zero (0) form the collection of whole numbers. So, 0, 1, 2, 3, ... are whole numbers.
- Every natural number is a whole number, but 0 is a whole number which is not a natural number.

### The Number Line
- A number line is a visual representation of numbers on a straight line.
- To represent whole numbers, we draw a line, mark a point 0 on it. Then we mark points 1, 2, 3, ... at equal distances to the right of 0.
- **Operations on the number line:**
- - **Addition:** To add 3 and 4, start from 3 and make 4 jumps to the right. You reach 7. So, 3 + 4 = 7.
- - **Subtraction:** To subtract 5 from 7, start from 7 and make 5 jumps to the left. You reach 2. So, 7 - 5 = 2.
- - **Multiplication:** To multiply 3 by 4, start from 0, make 3 jumps of 4 units each to the right. You reach 12. So, 3 x 4 = 12.

### Properties of Whole Numbers
- **Closure Property:** Whole numbers are closed under addition and multiplication. If a and b are two whole numbers, then a + b and a × b are also whole numbers.
- **Commutative Property:** Addition and multiplication are commutative for whole numbers. a + b = b + a and a × b = b × a.
- **Associative Property:** Addition and multiplication are associative for whole numbers. (a + b) + c = a + (b + c) and (a × b) × c = a × (b × c).
- **Distributive Property of Multiplication over Addition:** a × (b + c) = (a × b) + (a × c).
- **Identity for Addition:** Zero is the additive identity. a + 0 = a.
- **Identity for Multiplication:** One is the multiplicative identity. a × 1 = a.
`
    },
    hi: {
      title: 'अध्याय 2: पूर्ण संख्याएँ',
      content: `### पूर्ण संख्याओं का परिचय
- **प्राकृत संख्याएँ:** गिनती की संख्याएँ 1, 2, 3, 4, ... प्राकृत संख्याएँ कहलाती हैं।
- **पूर्ण संख्याएँ:** प्राकृत संख्याएँ शून्य (0) के साथ मिलकर पूर्ण संख्याओं का संग्रह बनाती हैं। तो, 0, 1, 2, 3, ... पूर्ण संख्याएँ हैं।
- प्रत्येक प्राकृत संख्या एक पूर्ण संख्या है, लेकिन 0 एक पूर्ण संख्या है जो प्राकृत संख्या नहीं है।

### संख्या रेखा
- संख्या रेखा एक सीधी रेखा पर संख्याओं का एक दृश्य प्रतिनिधित्व है।
- पूर्ण संख्याओं को दर्शाने के लिए, हम एक रेखा खींचते हैं, उस पर एक बिंदु 0 अंकित करते हैं। फिर हम 0 के दाईं ओर समान दूरी पर बिंदु 1, 2, 3, ... अंकित करते हैं।
- **संख्या रेखा पर संक्रियाएँ:**
- - **योग:** 3 और 4 को जोड़ने के लिए, 3 से शुरू करें और दाईं ओर 4 छलांग लगाएं। आप 7 पर पहुँचते हैं। तो, 3 + 4 = 7।
- - **घटाव:** 7 में से 5 घटाने के लिए, 7 से शुरू करें और बाईं ओर 5 छलांग लगाएं। आप 2 पर पहुँचते हैं। तो, 7 - 5 = 2।
- - **गुणा:** 3 को 4 से गुणा करने के लिए, 0 से शुरू करें, प्रत्येक 4 इकाइयों की 3 छलांग दाईं ओर लगाएं। आप 12 पर पहुँचते हैं। तो, 3 x 4 = 12।

### पूर्ण संख्याओं के गुणधर्म
- **संवृत गुण:** पूर्ण संख्याएँ योग और गुणन के अंतर्गत संवृत होती हैं। यदि a और b दो पूर्ण संख्याएँ हैं, तो a + b और a × b भी पूर्ण संख्याएँ होंगी।
- **क्रमविनिमेय गुण:** योग और गुणन पूर्ण संख्याओं के लिए क्रमविनिमेय हैं। a + b = b + a और a × b = b × a।
- **साहचर्य गुण:** योग और गुणन पूर्ण संख्याओं के लिए साहचर्य हैं। (a + b) + c = a + (b + c) और (a × b) × c = a × (b × c)।
- **योग पर गुणन का वितरण गुण:** a × (b + c) = (a × b) + (a × c)।
- **योज्य तत्समक:** शून्य योज्य तत्समक है। a + 0 = a।
- **गुणन तत्समक:** एक गुणन तत्समक है। a × 1 = a।
`
    }
  },
  'playing-with-numbers': {
    en: {
      title: 'Chapter 3: Playing with Numbers',
      content: `### Factors and Multiples
- **Factor:** A factor of a number is an exact divisor of that number.
- **Example:** Factors of 12 are 1, 2, 3, 4, 6, and 12.
- **Multiple:** A number is a multiple of each of its factors.
- **Example:** Multiples of 3 are 3, 6, 9, 12, ...

### Prime and Composite Numbers
- **Prime Numbers:** Numbers having exactly two factors, 1 and the number itself.
- **Example:** 2, 3, 5, 7, 11, ...
- **Composite Numbers:** Numbers having more than two factors.
- **Example:** 4, 6, 8, 9, 10, ...
- **Note:** 1 is neither a prime nor a composite number.

### Tests for Divisibility of Numbers
- **Divisibility by 2:** If the ones digit is 0, 2, 4, 6, or 8.
- **Divisibility by 3:** If the sum of the digits is divisible by 3.
- **Divisibility by 4:** If the number formed by the last two digits is divisible by 4.
- **Divisibility by 5:** If the ones digit is 0 or 5.
- **Divisibility by 6:** If the number is divisible by both 2 and 3.
- **Divisibility by 8:** If the number formed by the last three digits is divisible by 8.
- **Divisibility by 9:** If the sum of the digits is divisible by 9.
- **Divisibility by 10:** If the ones digit is 0.
- **Divisibility by 11:** Find the difference between the sum of the digits at odd places (from the right) and the sum of the digits at even places. If the difference is either 0 or divisible by 11, then the number is divisible by 11.

### HCF and LCM
- **Highest Common Factor (HCF):** The HCF of two or more given numbers is the highest of their common factors.
- **Lowest Common Multiple (LCM):** The LCM of two or more given numbers is the lowest of their common multiples.
`
    },
    hi: {
      title: 'अध्याय 3: संख्याओं के साथ खेलना',
      content: `### गुणनखंड और गुणज
- **गुणनखंड:** किसी संख्या का गुणनखंड उस संख्या का एक सटीक भाजक होता है।
- **उदाहरण:** 12 के गुणनखंड 1, 2, 3, 4, 6 और 12 हैं।
- **गुणज:** एक संख्या अपने प्रत्येक गुणनखंड का एक गुणज होती है।
- **उदाहरण:** 3 के गुणज 3, 6, 9, 12, ... हैं।

### अभाज्य और भाज्य संख्याएँ
- **अभाज्य संख्याएँ:** वे संख्याएँ जिनके ठीक दो गुणनखंड होते हैं, 1 और स्वयं वह संख्या।
- **उदाहरण:** 2, 3, 5, 7, 11, ...
- **भाज्य संख्याएँ:** वे संख्याएँ जिनके दो से अधिक गुणनखंड होते हैं।
- **उदाहरण:** 4, 6, 8, 9, 10, ...
- **नोट:** 1 न तो अभाज्य संख्या है और न ही भाज्य संख्या।

### संख्याओं की विभाज्यता की जाँच
- **2 से विभाज्यता:** यदि इकाई का अंक 0, 2, 4, 6, या 8 हो।
- **3 से विभाज्यता:** यदि अंकों का योग 3 से विभाज्य हो।
- **4 से विभाज्यता:** यदि अंतिम दो अंकों से बनी संख्या 4 से विभाज्य हो।
- **5 से विभाज्यता:** यदि इकाई का अंक 0 या 5 हो।
- **6 से विभाज्यता:** यदि संख्या 2 और 3 दोनों से विभाज्य हो।
- **8 से विभाज्यता:** यदि अंतिम तीन अंकों से बनी संख्या 8 से विभाज्य हो।
- **9 से विभाज्यता:** यदि अंकों का योग 9 से विभाज्य हो।
- **10 से विभाज्यता:** यदि इकाई का अंक 0 हो।
- **11 से विभाज्यता:** विषम स्थानों (दाईं ओर से) के अंकों के योग और सम स्थानों के अंकों के योग के बीच का अंतर ज्ञात करें। यदि अंतर या तो 0 है या 11 से विभाज्य है, तो संख्या 11 से विभाज्य है।

### महत्तम समापवर्तक (HCF) और लघुत्तम समापवर्त्य (LCM)
- **महत्तम समापवर्तक (HCF):** दो या दो से अधिक दी गई संख्याओं का HCF उनके सार्व गुणनखंडों में सबसे बड़ा होता है।
- **लघुत्तम समापवर्त्य (LCM):** दो या दो से अधिक दी गई संख्याओं का LCM उनके सार्व गुणजों में सबसे छोटा होता है।
`
    }
  },
    'basic-geometrical-ideas': {
    en: {
        title: 'Chapter 4: Basic Geometrical Ideas',
        content: `### Points, Lines, and Planes
- **Point:** A point determines a location. It is usually denoted by a capital letter.
- **Line Segment:** The shortest distance between two points. It has two endpoints. A line segment joining points A and B is denoted by AB.
- **Line:** When a line segment is extended on both sides indefinitely, we get a line. It has no endpoints.
- **Ray:** A part of a line that starts at a point (called the starting point or initial point) and goes on endlessly in a specified direction.
- **Intersecting Lines:** If two lines have one common point, they are called intersecting lines.
- **Parallel Lines:** Two lines in a plane are said to be parallel if they do not meet.

### Curves
- **Curve:** Any drawing (straight or non-straight) done without lifting the pencil may be called a curve.
- **Simple Curve:** A curve that does not cross itself.
- **Open Curve:** A curve where the endpoints do not meet.
- **Closed Curve:** A curve where the endpoints meet, enclosing an area.

### Polygons
- **Polygon:** A simple closed figure made up entirely of line segments.
- **Sides:** The line segments forming a polygon.
- **Vertices:** The meeting point of a pair of sides.
- **Adjacent Sides:** Any two sides with a common endpoint.
- **Adjacent Vertices:** The endpoints of the same side.
- **Diagonals:** A line segment connecting two non-consecutive vertices of a polygon.

### Angles
- **Angle:** An angle is made up of two rays starting from a common initial point.
- **Vertex:** The common initial point.
- **Arms (or sides):** The two rays forming the angle.
- **Interior and Exterior:** An angle divides the plane into three parts: the interior of the angle, the angle itself, and the exterior of the angle.

### Triangles and Quadrilaterals
- **Triangle:** A three-sided polygon. It has 3 sides, 3 vertices, and 3 angles.
- **Quadrilateral:** A four-sided polygon. It has 4 sides, 4 vertices, and 4 angles.
`
    },
    hi: {
        title: 'अध्याय 4: आधारभूत ज्यामितीय अवधारणाएँ',
        content: `### बिंदु, रेखाएँ और तल
- **बिंदु:** एक बिंदु एक स्थान को निर्धारित करता है। इसे आमतौर पर एक बड़े अक्षर से दर्शाया जाता है।
- **रेखाखंड:** दो बिंदुओं के बीच की सबसे छोटी दूरी। इसके दो अंत बिंदु होते हैं। बिंदु A और B को मिलाने वाले रेखाखंड को AB से दर्शाया जाता है।
- **रेखा:** जब एक रेखाखंड को दोनों तरफ अनिश्चित काल तक बढ़ाया जाता है, तो हमें एक रेखा मिलती है। इसका कोई अंत बिंदु नहीं होता है।
- **किरण:** एक रेखा का वह भाग जो एक बिंदु (जिसे प्रारंभिक बिंदु कहा जाता है) से शुरू होता है और एक निर्दिष्ट दिशा में अंतहीन रूप से चलता है।
- **प्रतिच्छेदी रेखाएँ:** यदि दो रेखाओं में एक उभयनिष्ठ बिंदु होता है, तो उन्हें प्रतिच्छेदी रेखाएँ कहा जाता है।
- **समांतर रेखाएँ:** एक तल में दो रेखाएँ समांतर कहलाती हैं यदि वे मिलती नहीं हैं।

### वक्र
- **वक्र:** पेंसिल उठाए बिना किया गया कोई भी चित्र (सीधा या गैर-सीधा) वक्र कहा जा सकता है।
- **सरल वक्र:** एक वक्र जो स्वयं को नहीं काटता है।
- **खुला वक्र:** एक वक्र जहाँ अंत बिंदु नहीं मिलते हैं।
- **बंद वक्र:** एक वक्र जहाँ अंत बिंदु मिलते हैं, एक क्षेत्र को घेरते हैं।

### बहुभुज
- **बहुभुज:** पूरी तरह से रेखाखंडों से बनी एक सरल बंद आकृति।
- **भुजाएँ:** एक बहुभुज बनाने वाले रेखाखंड।
- **शीर्ष:** भुजाओं के एक जोड़े का मिलन बिंदु।
- **आसन्न भुजाएँ:** एक उभयनिष्ठ अंत बिंदु वाली कोई भी दो भुजाएँ।
- **आसन्न शीर्ष:** एक ही भुजा के अंत बिंदु।
- **विकर्ण:** एक बहुभुज के दो गैर-क्रमागत शीर्षों को मिलाने वाला एक रेखाखंड।

### कोण
- **कोण:** एक कोण एक उभयनिष्ठ प्रारंभिक बिंदु से शुरू होने वाली दो किरणों से बनता है।
- **शीर्ष:** उभयनिष्ठ प्रारंभिक बिंदु।
- **भुजाएँ:** कोण बनाने वाली दो किरणें।
- **अभ्यंतर और बहिर्भाग:** एक कोण तल को तीन भागों में विभाजित करता है: कोण का अभ्यंतर, स्वयं कोण, और कोण का बहिर्भाग।

### त्रिभुज और चतुर्भुज
- **त्रिभुज:** एक तीन भुजाओं वाला बहुभुज। इसकी 3 भुजाएँ, 3 शीर्ष और 3 कोण होते हैं।
- **चतुर्भुज:** एक चार भुजाओं वाला बहुभुज। इसकी 4 भुजाएँ, 4 शीर्ष और 4 कोण होते हैं।
`
    }
},
  'understanding-elementary-shapes': {
    en: {
        title: 'Chapter 5: Understanding Elementary Shapes',
        content: `### Measuring Line Segments
- **Comparison by Observation:** Just by looking at them. This method is not always accurate.
- **Comparison by Tracing:** Using tracing paper to compare lengths.
- **Comparison using Ruler and a Divider:** A ruler measures length in cm and mm. A divider is used to compare lengths more accurately than just using a ruler.

### Angles - Right and Straight
- **Right Angle:** An angle that measures exactly 90°. It is like a corner of a square.
- **Straight Angle:** An angle that measures exactly 180°. It forms a straight line.
- **Complete Angle:** An angle that measures 360°. It represents a full turn.

### Angles - Acute, Obtuse and Reflex
- **Acute Angle:** An angle that is less than a right angle (less than 90°).
- **Obtuse Angle:** An angle that is greater than a right angle but less than a straight angle (between 90° and 180°).
- **Reflex Angle:** An angle that is greater than a straight angle (more than 180° but less than 360°).

### Triangles
- **Naming triangles based on sides:**
- - **Scalene Triangle:** A triangle with all three sides of different lengths.
- - **Isosceles Triangle:** A triangle with two sides of equal length.
- - **Equilateral Triangle:** A triangle with all three sides of equal length.
- **Naming triangles based on angles:**
- - **Acute Angled Triangle:** A triangle where all angles are acute.
- - **Right Angled Triangle:** A triangle with one right angle.
- - **Obtuse Angled Triangle:** A triangle with one obtuse angle.

### Quadrilaterals
- **Rectangle:** A quadrilateral with opposite sides equal and all angles right angles.
- **Square:** A rectangle with all four sides equal.
- **Parallelogram:** A quadrilateral with opposite sides parallel.
- **Rhombus:** A parallelogram with all four sides of equal length.
- **Trapezium:** A quadrilateral with one pair of parallel sides.
`
    },
    hi: {
        title: 'अध्याय 5: प्रारंभिक आकारों को समझना',
        content: `### रेखाखंडों को मापना
- **अवलोकन द्वारा तुलना:** केवल उन्हें देखकर। यह विधि हमेशा सटीक नहीं होती है।
- **अनुरेखण द्वारा तुलना:** लंबाइयों की तुलना करने के लिए ट्रेसिंग पेपर का उपयोग करना।
- **रूलर और डिवाइडर का उपयोग करके तुलना:** एक रूलर सेमी और मिमी में लंबाई मापता है। केवल रूलर का उपयोग करने की तुलना में लंबाइयों की अधिक सटीक तुलना करने के लिए एक डिवाइडर का उपयोग किया जाता है।

### कोण - समकोण और ऋजु कोण
- **समकोण:** एक कोण जो ठीक 90° का होता है। यह एक वर्ग के कोने जैसा होता है।
- **ऋजु कोण:** एक कोण जो ठीक 180° का होता है। यह एक सीधी रेखा बनाता है।
- **संपूर्ण कोण:** एक कोण जो 360° का होता है। यह एक पूर्ण घुमाव को दर्शाता है।

### कोण - न्यून, अधिक और प्रतिवर्ती
- **न्यून कोण:** एक कोण जो समकोण से कम होता है (90° से कम)।
- **अधिक कोण:** एक कोण जो समकोण से बड़ा लेकिन ऋजु कोण से कम होता है (90° और 180° के बीच)।
- **प्रतिवर्ती कोण:** एक कोण जो ऋजु कोण से बड़ा होता है (180° से अधिक लेकिन 360° से कम)।

### त्रिभुज
- **भुजाओं के आधार पर त्रिभुजों का नामकरण:**
- - **विषमबाहु त्रिभुज:** एक त्रिभुज जिसकी तीनों भुजाएँ अलग-अलग लंबाई की होती हैं।
- - **समद्विबाहु त्रिभुज:** एक त्रिभुज जिसकी दो भुजाएँ समान लंबाई की होती हैं।
- - **समबाहु त्रिभुज:** एक त्रिभुज जिसकी तीनों भुजाएँ समान लंबाई की होती हैं।
- **कोणों के आधार पर त्रिभुजों का नामकरण:**
- - **न्यून कोण त्रिभुज:** एक त्रिभुज जहाँ सभी कोण न्यून होते हैं।
- - **समकोण त्रिभुज:** एक समकोण वाला त्रिभुज।
- - **अधिक कोण त्रिभुज:** एक अधिक कोण वाला त्रिभुज।

### चतुर्भुज
- **आयत:** एक चतुर्भुज जिसकी सम्मुख भुजाएँ बराबर और सभी कोण समकोण होते हैं।
- **वर्ग:** एक आयत जिसकी चारों भुजाएँ बराबर होती हैं।
- **समांतर चतुर्भुज:** एक चतुर्भुज जिसकी सम्मुख भुजाएँ समांतर होती हैं।
- **समचतुर्भुज:** एक समांतर चतुर्भुज जिसकी चारों भुजाएँ समान लंबाई की होती हैं।
- **समलंब:** एक चतुर्भुज जिसकी समांतर भुजाओं का एक युग्म होता है।
`
    }
},
  'integers': {
    en: {
        title: 'Chapter 6: Integers',
        content: `### What are Integers?
- Integers are a collection of whole numbers and their negative counterparts.
- The set of integers is denoted by Z = {..., -3, -2, -1, 0, 1, 2, 3, ...}.
- **Positive Integers:** 1, 2, 3, ...
- **Negative Integers:** -1, -2, -3, ...
- **Zero (0)** is an integer that is neither positive nor negative.

### Integers on a Number Line
- We can represent integers on a number line.
- Positive integers are to the right of 0, and negative integers are to the left of 0.
- As we move to the right on the number line, the value of the integer increases.
- As we move to the left, the value of the integer decreases.
- **Example:** -3 < -1, and 2 > -5.

### Addition of Integers
- **Adding two positive integers:** Add them like whole numbers. Ex: (+3) + (+4) = 7.
- **Adding two negative integers:** Add their absolute values and put a negative sign. Ex: (-3) + (-4) = -7.
- **Adding a positive and a negative integer:** Find the difference between their absolute values and take the sign of the integer with the greater absolute value. Ex: (-7) + (+4) = -3. Ex: (+7) + (-4) = 3.

### Subtraction of Integers
- To subtract an integer from another integer, we add the additive inverse (opposite) of the integer that is being subtracted.
- **Additive Inverse:** The additive inverse of an integer 'a' is '-a'. The sum of an integer and its additive inverse is 0.
- **Example:** To subtract 5 from 3, we do 3 - 5. This is the same as 3 + (-5), which equals -2.
- **Example:** To subtract (-5) from 3, we do 3 - (-5). This is the same as 3 + 5, which equals 8.
`
    },
    hi: {
        title: 'अध्याय 6: पूर्णांक',
        content: `### पूर्णांक क्या हैं?
- पूर्णांक पूर्ण संख्याओं और उनके ऋणात्मक समकक्षों का एक संग्रह है।
- पूर्णांकों के समुच्चय को Z = {..., -3, -2, -1, 0, 1, 2, 3, ...} से दर्शाया जाता है।
- **धनात्मक पूर्णांक:** 1, 2, 3, ...
- **ऋणात्मक पूर्णांक:** -1, -2, -3, ...
- **शून्य (0)** एक पूर्णांक है जो न तो धनात्मक है और न ही ऋणात्मक।

### संख्या रेखा पर पूर्णांक
- हम संख्या रेखा पर पूर्णांकों को दर्शा सकते हैं।
- धनात्मक पूर्णांक 0 के दाईं ओर होते हैं, और ऋणात्मक पूर्णांक 0 के बाईं ओर होते हैं।
- जैसे-जैसे हम संख्या रेखा पर दाईं ओर बढ़ते हैं, पूर्णांक का मान बढ़ता है।
- जैसे-जैसे हम बाईं ओर बढ़ते हैं, पूर्णांक का मान घटता है।
- **उदाहरण:** -3 < -1, और 2 > -5।

### पूर्णांकों का योग
- **दो धनात्मक पूर्णांकों को जोड़ना:** उन्हें पूर्ण संख्याओं की तरह जोड़ें। उदा: (+3) + (+4) = 7।
- **दो ऋणात्मक पूर्णांकों को जोड़ना:** उनके निरपेक्ष मानों को जोड़ें और एक ऋणात्मक चिह्न लगाएं। उदा: (-3) + (-4) = -7।
- **एक धनात्मक और एक ऋणात्मक पूर्णांक को जोड़ना:** उनके निरपेक्ष मानों के बीच का अंतर ज्ञात करें और बड़े निरपेक्ष मान वाले पूर्णांक का चिह्न लें। उदा: (-7) + (+4) = -3। उदा: (+7) + (-4) = 3।

### पूर्णांकों का घटाव
- एक पूर्णांक से दूसरे पूर्णांक को घटाने के लिए, हम उस पूर्णांक का योज्य प्रतिलोम (विपरीत) जोड़ते हैं जिसे घटाया जा रहा है।
- **योज्य प्रतिलोम:** एक पूर्णांक 'a' का योज्य प्रतिलोम '-a' है। एक पूर्णांक और उसके योज्य प्रतिलोम का योग 0 होता है।
- **उदाहरण:** 3 में से 5 घटाने के लिए, हम 3 - 5 करते हैं। यह 3 + (-5) के समान है, जो -2 के बराबर है।
- **उदाहरण:** 3 में से (-5) घटाने के लिए, हम 3 - (-5) करते हैं। यह 3 + 5 के समान है, जो 8 के बराबर है।
`
    }
},
  'fractions': {
    en: {
        title: 'Chapter 7: Fractions',
        content: `### What is a Fraction?
- A fraction is a number representing a part of a whole.
- It is written as a/b, where 'a' is the numerator and 'b' is the denominator. The denominator cannot be zero.

### Types of Fractions
- **Proper Fraction:** A fraction where the numerator is less than the denominator. It represents a part less than a whole. Ex: 1/2, 3/4.
- **Improper Fraction:** A fraction where the numerator is greater than or equal to the denominator. It represents a whole and a part. Ex: 5/4, 7/3.
- **Mixed Fraction:** An improper fraction can be written as a combination of a whole and a proper fraction. Ex: 5/4 can be written as 1 1/4.

### Equivalent Fractions
- Fractions that represent the same value.
- To find an equivalent fraction, you can multiply or divide both the numerator and the denominator by the same non-zero number.
- **Example:** 1/2 is equivalent to 2/4, 3/6, etc.

### Comparing Fractions
- **Like Fractions (same denominator):** The fraction with the greater numerator is greater. Ex: 5/7 > 3/7.
- **Unlike Fractions (different denominators):** Convert them into like fractions by finding the LCM of the denominators. Then compare.
- **Example:** To compare 2/3 and 3/4. LCM of 3 and 4 is 12. 2/3 = 8/12 and 3/4 = 9/12. Since 9/12 > 8/12, then 3/4 > 2/3.

### Operations on Fractions
- **Addition/Subtraction of Like Fractions:** Add/subtract the numerators and keep the denominator the same.
- **Addition/Subtraction of Unlike Fractions:** First, convert them to like fractions, then add/subtract.
`
    },
    hi: {
        title: 'अध्याय 7: भिन्न',
        content: `### भिन्न क्या है?
- भिन्न एक संख्या है जो एक पूर्ण के एक हिस्से का प्रतिनिधित्व करती है।
- इसे a/b के रूप में लिखा जाता है, जहाँ 'a' अंश है और 'b' हर है। हर शून्य नहीं हो सकता।

### भिन्न के प्रकार
- **उचित भिन्न:** एक भिन्न जहाँ अंश हर से कम होता है। यह एक पूर्ण से कम हिस्से का प्रतिनिधित्व करता है। उदा: 1/2, 3/4।
- **विषम भिन्न:** एक भिन्न जहाँ अंश हर से बड़ा या बराबर होता है। यह एक पूर्ण और एक हिस्से का प्रतिनिधित्व करता है। उदा: 5/4, 7/3।
- **मिश्रित भिन्न:** एक विषम भिन्न को एक पूर्ण और एक उचित भिन्न के संयोजन के रूप में लिखा जा सकता है। उदा: 5/4 को 1 1/4 के रूप में लिखा जा सकता है।

### तुल्य भिन्न
- वे भिन्न जो समान मान का प्रतिनिधित्व करती हैं।
- एक तुल्य भिन्न खोजने के लिए, आप अंश और हर दोनों को समान गैर-शून्य संख्या से गुणा या भाग कर सकते हैं।
- **उदाहरण:** 1/2, 2/4, 3/6, आदि के तुल्य है।

### भिन्नों की तुलना
- **समान भिन्न (समान हर):** बड़े अंश वाली भिन्न बड़ी होती है। उदा: 5/7 > 3/7।
- **असमान भिन्न (अलग-अलग हर):** हरों का LCM ज्ञात करके उन्हें समान भिन्नों में बदलें। फिर तुलना करें।
- **उदाहरण:** 2/3 और 3/4 की तुलना करने के लिए। 3 और 4 का LCM 12 है। 2/3 = 8/12 और 3/4 = 9/12। चूँकि 9/12 > 8/12, तो 3/4 > 2/3।

### भिन्नों पर संक्रियाएँ
- **समान भिन्नों का योग/घटाव:** अंशों को जोड़ें/घटाएँ और हर को वही रखें।
- **असमान भिन्नों का योग/घटाव:** पहले, उन्हें समान भिन्नों में बदलें, फिर जोड़ें/घटाएँ।
`
    }
},
  'decimals': {
    en: {
        title: 'Chapter 8: Decimals',
        content: `### Understanding Decimals
- Decimals are a way of writing numbers that are not whole numbers. They are another way to write fractions.
- The dot in a decimal number is called a decimal point.
- **Place Value:** The place value of digits to the right of the decimal point are tenths (1/10), hundredths (1/100), thousandths (1/1000), and so on.
- **Example:** In 23.456, 4 is in the tenths place, 5 is in the hundredths place, and 6 is in the thousandths place.

### Comparing Decimals
- To compare decimals, first compare the whole number part.
- If the whole number parts are equal, compare the tenths digits.
- If the tenths digits are also equal, compare the hundredths digits, and so on.
- **Example:** 12.5 > 12.45 because the tenths digit 5 is greater than 4.

### Using Decimals
- **Money:** We use decimals to represent money. For example, ₹5 and 50 paise is written as ₹5.50.
- **Length:** We use decimals to represent length. For example, 5 cm 3 mm = 5.3 cm. (Since 10 mm = 1 cm).
- **Weight:** We use decimals to represent weight. For example, 2 kg 500 g = 2.5 kg. (Since 1000 g = 1 kg).

### Addition and Subtraction of Decimals
- To add or subtract decimals, write the numbers one below the other with the decimal points lined up.
- Add or subtract as you would with whole numbers.
- Place the decimal point in the answer directly below the decimal points in the numbers being added or subtracted.
- **Example:** 21.36 + 37.35.
-   21.36
- + 37.35
- --------
-   58.71
`
    },
    hi: {
        title: 'अध्याय 8: दशमलव',
        content: `### दशमलव को समझना
- दशमलव उन संख्याओं को लिखने का एक तरीका है जो पूर्ण संख्याएँ नहीं हैं। वे भिन्न लिखने का एक और तरीका हैं।
- दशमलव संख्या में बिंदु को दशमलव बिंदु कहा जाता है।
- **स्थानीय मान:** दशमलव बिंदु के दाईं ओर के अंकों का स्थानीय मान दशांश (1/10), शतांश (1/100), सहस्रांश (1/1000), आदि है।
- **उदाहरण:** 23.456 में, 4 दशांश स्थान पर है, 5 शतांश स्थान पर है, और 6 सहस्रांश स्थान पर है।

### दशमलव की तुलना
- दशमलव की तुलना करने के लिए, पहले पूर्ण संख्या भाग की तुलना करें।
- यदि पूर्ण संख्या भाग बराबर हैं, तो दशांश अंकों की तुलना करें।
- यदि दशांश अंक भी बराबर हैं, तो शतांश अंकों की तुलना करें, और इसी तरह आगे।
- **उदाहरण:** 12.5 > 12.45 क्योंकि दशांश अंक 5, 4 से बड़ा है।

### दशमलव का उपयोग
- **धन:** हम धन का प्रतिनिधित्व करने के लिए दशमलव का उपयोग करते हैं। उदाहरण के लिए, ₹5 और 50 पैसे को ₹5.50 लिखा जाता है।
- **लंबाई:** हम लंबाई का प्रतिनिधित्व करने के लिए दशमलव का उपयोग करते हैं। उदाहरण के लिए, 5 सेमी 3 मिमी = 5.3 सेमी। (चूंकि 10 मिमी = 1 सेमी)।
- **वजन:** हम वजन का प्रतिनिधित्व करने के लिए दशमलव का उपयोग करते हैं। उदाहरण के लिए, 2 किलो 500 ग्राम = 2.5 किलो। (चूंकि 1000 ग्राम = 1 किलो)।

### दशमलव का योग और घटाव
- दशमलव को जोड़ने या घटाने के लिए, संख्याओं को एक के नीचे एक लिखें और दशमलव बिंदुओं को एक सीध में रखें।
- जैसे आप पूर्ण संख्याओं के साथ करते हैं वैसे ही जोड़ें या घटाएँ।
- उत्तर में दशमलव बिंदु को सीधे जोड़ी या घटाई जा रही संख्याओं के दशमलव बिंदुओं के नीचे रखें।
- **उदाहरण:** 21.36 + 37.35।
-   21.36
- + 37.35
- --------
-   58.71
`
    }
},
  'data-handling': {
    en: {
        title: 'Chapter 9: Data Handling',
        content: `### Introduction to Data
- **Data:** A collection of numbers gathered to give some information.
- **Recording Data:** We need to organize data to draw meaningful inferences. We can use a frequency distribution table.
- **Tally Marks:** A quick way to keep track of numbers in groups of five. The fifth tally mark is a diagonal line across the first four.

### Pictograph
- A pictograph represents data through pictures of objects.
- It helps answer the questions on the data at a glance.
- A key or scale must be provided to understand the pictograph. For example, one symbol might represent 10 items.

### Bar Graph
- A bar graph is a display of information using bars of uniform width, their heights being proportional to the respective values.
- **Drawing a Bar Graph:**
- - Draw two perpendicular lines: one horizontal (x-axis) and one vertical (y-axis).
- - Along the horizontal axis, choose a uniform width for bars and a uniform gap between them.
- - Choose a suitable scale to determine the heights of the bars along the vertical axis.
- **Interpreting a Bar Graph:** A bar graph can be used to compare quantities easily.
`
    },
    hi: {
        title: 'अध्याय 9: आँकड़ों का प्रबंधन',
        content: `### आँकड़ों का परिचय
- **आँकड़े:** कुछ जानकारी देने के लिए एकत्रित की गई संख्याओं का एक संग्रह।
- **आँकड़ों को रिकॉर्ड करना:** सार्थक निष्कर्ष निकालने के लिए हमें आँकड़ों को व्यवस्थित करने की आवश्यकता है। हम एक बारंबारता बंटन सारणी का उपयोग कर सकते हैं।
- **मिलान चिह्न:** पाँच के समूहों में संख्याओं का हिसाब रखने का एक त्वरित तरीका। पाँचवाँ मिलान चिह्न पहले चार पर एक विकर्ण रेखा होती है।

### चित्रालेख
- एक चित्रालेख वस्तुओं के चित्रों के माध्यम से आँकड़ों का प्रतिनिधित्व करता है।
- यह एक नज़र में आँकड़ों पर प्रश्नों का उत्तर देने में मदद करता है।
- चित्रालेख को समझने के लिए एक कुंजी या पैमाना प्रदान किया जाना चाहिए। उदाहरण के लिए, एक प्रतीक 10 वस्तुओं का प्रतिनिधित्व कर सकता है।

### दंड आलेख
- एक दंड आलेख एक समान चौड़ाई के दंडों का उपयोग करके जानकारी का एक प्रदर्शन है, जिनकी ऊँचाई संबंधित मानों के समानुपाती होती है।
- **एक दंड आलेख बनाना:**
- - दो लंबवत रेखाएँ खींचें: एक क्षैतिज (x-अक्ष) और एक ऊर्ध्वाधर (y-अक्ष)।
- - क्षैतिज अक्ष के साथ, दंडों के लिए एक समान चौड़ाई और उनके बीच एक समान अंतर चुनें।
- - ऊर्ध्वाधर अक्ष के साथ दंडों की ऊँचाई निर्धारित करने के लिए एक उपयुक्त पैमाना चुनें।
- **एक दंड आलेख की व्याख्या:** एक दंड आलेख का उपयोग मात्राओं की आसानी से तुलना करने के लिए किया जा सकता है।
`
    }
},
  'mensuration': {
    en: {
        title: 'Chapter 10: Mensuration',
        content: `### Perimeter
- **Perimeter:** The distance around a closed figure.
- **Perimeter of a Rectangle:** 2 × (length + breadth).
- **Perimeter of a Square:** 4 × length of a side.
- **Perimeter of an Equilateral Triangle:** 3 × length of a side.

### Area
- **Area:** The amount of surface enclosed by a closed figure.
- **Area of a Rectangle:** length × breadth.
- **Area of a Square:** side × side.
- **Units:** Area is measured in square units, like square centimeters (cm²) or square meters (m²).

### Finding Area of Irregular Shapes
- We can find the area of an irregular shape by placing it on a squared paper.
- **Method:**
- - Count the number of full squares enclosed.
- - Count the number of half squares enclosed.
- - Count the number of squares more than half enclosed.
- - Ignore the squares less than half enclosed.
- - The approximate area is the sum of the counts from the first three steps.
`
    },
    hi: {
        title: 'अध्याय 10: क्षेत्रमिति',
        content: `### परिमाप
- **परिमाप:** एक बंद आकृति के चारों ओर की दूरी।
- **आयत का परिमाप:** 2 × (लंबाई + चौड़ाई)।
- **वर्ग का परिमाप:** 4 × एक भुजा की लंबाई।
- **समबाहु त्रिभुज का परिमाप:** 3 × एक भुजा की लंबाई।

### क्षेत्रफल
- **क्षेत्रफल:** एक बंद आकृति द्वारा घेरी गई सतह की मात्रा।
- **आयत का क्षेत्रफल:** लंबाई × चौड़ाई।
- **वर्ग का क्षेत्रफल:** भुजा × भुजा।
- **इकाइयाँ:** क्षेत्रफल को वर्ग इकाइयों में मापा जाता है, जैसे वर्ग सेंटीमीटर (cm²) या वर्ग मीटर (m²)।

### अनियमित आकृतियों का क्षेत्रफल ज्ञात करना
- हम एक अनियमित आकृति को एक वर्गांकित कागज पर रखकर उसका क्षेत्रफल ज्ञात कर सकते हैं।
- **विधि:**
- - घेरे गए पूर्ण वर्गों की संख्या गिनें।
- - घेरे गए आधे वर्गों की संख्या गिनें।
- - आधे से अधिक घेरे गए वर्गों की संख्या गिनें।
- - आधे से कम घेरे गए वर्गों को अनदेखा करें।
- - अनुमानित क्षेत्रफल पहले तीन चरणों की गिनती का योग है।
`
    }
},
  'algebra': {
    en: {
        title: 'Chapter 11: Algebra',
        content: `### Introduction to Algebra
- Algebra is a branch of mathematics that uses letters to represent numbers.
- **Variable:** A letter that can take various values. Its value is not fixed. Variables are usually represented by letters like x, y, z, a, b, etc.
- **Constant:** A value that does not change. Ex: 5, -10, 2/3.

### Expressions
- **Expression:** A combination of constants, variables, and operations (+, -, ×, ÷).
- **Example:** 2x + 5 is an expression.
- Expressions are formed by performing operations on variables and constants. For example, the expression 4xy + 7 is formed from variables x and y and constants 4 and 7.

### Equations
- **Equation:** A statement that two expressions are equal. It has an equal sign (=).
- **Example:** 2x + 5 = 15 is an equation.
- An equation has two sides: the Left Hand Side (LHS) and the Right Hand Side (RHS).
- **Solution of an Equation:** A value of the variable which makes the equation a true statement.
- **Solving an Equation:** Finding the solution. We can use trial-and-error method or systematic methods like balancing.
`
    },
    hi: {
        title: 'अध्याय 11: बीजगणित',
        content: `### बीजगणित का परिचय
- बीजगणित गणित की एक शाखा है जो संख्याओं का प्रतिनिधित्व करने के लिए अक्षरों का उपयोग करती है।
- **चर:** एक अक्षर जो विभिन्न मान ले सकता है। इसका मान निश्चित नहीं होता है। चरों को आमतौर पर x, y, z, a, b, आदि जैसे अक्षरों से दर्शाया जाता है।
- **अचर:** एक मान जो बदलता नहीं है। उदा: 5, -10, 2/3।

### व्यंजक
- **व्यंजक:** अचरों, चरों और संक्रियाओं (+, -, ×, ÷) का एक संयोजन।
- **उदाहरण:** 2x + 5 एक व्यंजक है।
- व्यंजक चरों और अचरों पर संक्रियाएँ करके बनाए जाते हैं। उदाहरण के लिए, व्यंजक 4xy + 7 चर x और y और अचर 4 और 7 से बना है।

### समीकरण
- **समीकरण:** एक कथन कि दो व्यंजक बराबर हैं। इसमें एक बराबर का चिह्न (=) होता है।
- **उदाहरण:** 2x + 5 = 15 एक समीकरण है।
- एक समीकरण के दो पक्ष होते हैं: बायाँ पक्ष (LHS) और दायाँ पक्ष (RHS)।
- **समीकरण का हल:** चर का एक मान जो समीकरण को एक सत्य कथन बनाता है।
- **समीकरण को हल करना:** हल खोजना। हम प्रयत्न और भूल विधि या संतुलन जैसी व्यवस्थित विधियों का उपयोग कर सकते हैं।
`
    }
},
  'ratio-and-proportion': {
    en: {
        title: 'Chapter 12: Ratio and Proportion',
        content: `### Ratio
- **Ratio:** A way of comparing two quantities of the same kind by division.
- The ratio of a to b is written as a : b or a/b.
- The two quantities in a ratio must have the same units.
- A ratio is in its simplest form if the two terms have no common factor other than 1.
- **Example:** The ratio of 20 cm to 100 cm is 20:100, which simplifies to 1:5.

### Proportion
- **Proportion:** A statement that two ratios are equal.
- If two ratios a:b and c:d are equal, we say that a, b, c, d are in proportion. This is written as a : b :: c : d.
- **Terms:** 'a' and 'd' are called the extreme terms. 'b' and 'c' are called the middle terms.
- **Rule of Proportion:** If four numbers are in proportion, then Product of extremes = Product of means. So, a × d = b × c.
- **Example:** Are 1, 2, 3, 6 in proportion? Product of extremes = 1 × 6 = 6. Product of means = 2 × 3 = 6. Since they are equal, the numbers are in proportion.

### Unitary Method
- The method in which we first find the value of one unit and then the value of the required number of units is called the unitary method.
- **Example:** If the cost of 6 pens is ₹30, what is the cost of 10 pens?
- - Cost of 6 pens = ₹30
- - Cost of 1 pen = ₹30 / 6 = ₹5
- - Cost of 10 pens = ₹5 × 10 = ₹50.
`
    },
    hi: {
        title: 'अध्याय 12: अनुपात और समानुपात',
        content: `### अनुपात
- **अनुपात:** एक ही प्रकार की दो मात्राओं की विभाजन द्वारा तुलना करने का एक तरीका।
- a का b से अनुपात a : b या a/b के रूप में लिखा जाता है।
- अनुपात में दोनों मात्राओं की इकाइयाँ समान होनी चाहिए।
- एक अनुपात अपने सरलतम रूप में होता है यदि दोनों पदों का 1 के अलावा कोई उभयनिष्ठ गुणनखंड न हो।
- **उदाहरण:** 20 सेमी का 100 सेमी से अनुपात 20:100 है, जो सरल होकर 1:5 हो जाता है।

### समानुपात
- **समानुपात:** एक कथन कि दो अनुपात बराबर हैं।
- यदि दो अनुपात a:b और c:d बराबर हैं, तो हम कहते हैं कि a, b, c, d समानुपात में हैं। इसे a : b :: c : d के रूप में लिखा जाता है।
- **पद:** 'a' और 'd' को चरम पद कहा जाता है। 'b' और 'c' को मध्य पद कहा जाता है।
- **समानुपात का नियम:** यदि चार संख्याएँ समानुपात में हैं, तो चरम पदों का गुणनफल = मध्य पदों का गुणनफल। तो, a × d = b × c।
- **उदाहरण:** क्या 1, 2, 3, 6 समानुपात में हैं? चरम पदों का गुणनफल = 1 × 6 = 6। मध्य पदों का गुणनफल = 2 × 3 = 6। चूँकि वे बराबर हैं, संख्याएँ समानुपात में हैं।

### ऐकिक विधि
- वह विधि जिसमें हम पहले एक इकाई का मान ज्ञात करते हैं और फिर आवश्यक संख्या में इकाइयों का मान ज्ञात करते हैं, ऐकिक विधि कहलाती है।
- **उदाहरण:** यदि 6 पेनों की कीमत ₹30 है, तो 10 पेनों की कीमत क्या है?
- - 6 पेनों की कीमत = ₹30
- - 1 पेन की कीमत = ₹30 / 6 = ₹5
- - 10 पेनों की कीमत = ₹5 × 10 = ₹50।
`
    }
},

  'food-where-does-it-come-from': {
    en: {
      title: 'Chapter 1: Food: Where Does It Come From?',
      content: `### Food Variety
- We eat different kinds of food at different times.
- There seems to be so much variety in the food that we eat.

### Food Ingredients
- **Ingredients:** Materials needed to prepare a food item.
- **Example:** To prepare vegetable curry, we need different kinds of vegetables, salt, spices, oil and so on.

### Food Materials and Sources
- **Sources of Food:** The main sources of our food are plants and animals.
- **Plant Sources:** We get fruits, vegetables, grains, cereals, pulses, etc., from plants.
- - **Parts of a plant as food:** We eat different parts of plants like roots (carrot, radish), stems (potato, ginger), leaves (spinach, cabbage), flowers (cauliflower), fruits (apple, banana), and seeds (wheat, rice).
- **Animal Sources:** We get milk, eggs, meat, chicken, fish, etc., from animals.
- - **Products from animals:** Milk is used to make products like butter, cream, cheese, and curd.

### What Do Animals Eat?
- Animals are grouped into three categories based on what they eat:
- **Herbivores:** Animals that eat only plants.
- - **Example:** Cow, goat, deer.
- **Carnivores:** Animals that eat only other animals.
- - **Example:** Lion, tiger.
- **Omnivores:** Animals that eat both plants and animals.
- - **Example:** Bear, crow, human beings.
`
    },
    hi: {
      title: 'अध्याय 1: भोजन: यह कहाँ से आता है?',
      content: `### भोजन में विविधता
- हम अलग-अलग समय पर अलग-अलग तरह का खाना खाते हैं।
- हम जो भोजन करते हैं, उसमें बहुत विविधता प्रतीत होती है।

### खाद्य सामग्री
- **सामग्री:** किसी खाद्य पदार्थ को तैयार करने के लिए आवश्यक सामग्री।
- **उदाहरण:** सब्जी करी तैयार करने के लिए, हमें विभिन्न प्रकार की सब्जियां, नमक, मसाले, तेल आदि की आवश्यकता होती है।

### खाद्य सामग्री और उनके स्रोत
- **भोजन के स्रोत:** हमारे भोजन के मुख्य स्रोत पौधे और जानवर हैं।
- **पौधों से स्रोत:** हमें पौधों से फल, सब्जियां, अनाज, दालें आदि मिलते हैं।
- - **भोजन के रूप में पौधे के भाग:** हम पौधों के विभिन्न भाग खाते हैं जैसे जड़ें (गाजर, मूली), तने (आलू, अदरक), पत्तियां (पालक, पत्ता गोभी), फूल (फूलगोभी), फल (सेब, केला), और बीज (गेहूं, चावल)।
- **जानवरों से स्रोत:** हमें जानवरों से दूध, अंडे, मांस, चिकन, मछली आदि मिलते हैं।
- - **जानवरों से उत्पाद:** दूध का उपयोग मक्खन, क्रीम, पनीर और दही जैसे उत्पाद बनाने के लिए किया जाता है।

### जानवर क्या खाते हैं?
- जानवरों को उनके खाने के आधार पर तीन श्रेणियों में बांटा गया है:
- **शाकाहारी:** वे जानवर जो केवल पौधे खाते हैं।
- - **उदाहरण:** गाय, बकरी, हिरण।
- **मांसाहारी:** वे जानवर जो केवल दूसरे जानवरों को खाते हैं।
- - **उदाहरण:** शेर, बाघ।
- **सर्वाहारी:** वे जानवर जो पौधे और जानवर दोनों खाते हैं।
- - **उदाहरण:** भालू, कौआ, मनुष्य।
`
    }
  },
  'default': {
    en: {
      title: 'Notes Not Found',
      content: 'Detailed notes for this chapter will be available soon. Please check back later.'
    },
    hi: {
      title: 'नोट्स नहीं मिले',
      content: 'इस अध्याय के विस्तृत नोट्स जल्द ही उपलब्ध होंगे। कृपया बाद में फिर से देखें।'
    }
  }
};


function NotesContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') === 'hi' ? 'hi' : 'en';
  
  const chapterNotes = notesData[slug] || notesData['default'];
  const notes = chapterNotes[lang];

  return (
     <div className="container mx-auto py-12 px-4 md:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{notes.title}</CardTitle>
          <CardDescription>Detailed notes for your study and revision.</CardDescription>
        </CardHeader>
        <CardContent>
          <NotesContentRenderer content={notes.content} />
        </CardContent>
      </Card>
    </div>
  )
}

export default function NotesDetailsPage({ params }: { params: { slug: string } }) {
    const { slug } = use(params);
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NotesContent slug={slug} />
        </Suspense>
    )
}
