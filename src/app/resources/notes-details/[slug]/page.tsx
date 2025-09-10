
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from 'next/navigation'
import { Suspense, use } from "react";
import { NotesContentRenderer } from "@/components/notes-content-renderer";
import { BookOpen } from "lucide-react";

const notesData: { [key: string]: { en: { title: string, content: string }, hi: { title: string, content: string } } } = {
  'real-numbers': {
    en: {
      title: 'Chapter 1: Real Numbers',
      content: `### Euclid's Division Lemma
- For any two given positive integers a and b, there exist unique whole numbers q and r such that **a = bq + r**, where **0 ≤ r < b**.
- Here, 'a' is the dividend, 'b' is the divisor, 'q' is the quotient, and 'r' is the remainder.
- This lemma is used to find the Highest Common Factor (HCF) of two positive integers.

### Euclid's Division Algorithm
- An algorithm is a series of well-defined steps which gives a procedure for solving a type of problem.
- It is a technique to compute the HCF of two given positive integers.
- **Steps to find HCF(a, b) where a > b:**
- - **Step 1:** Apply Euclid’s division lemma to a and b to find whole numbers q and r such that a = bq + r, 0 ≤ r < b.
- - **Step 2:** If r = 0, the HCF is b. If r ≠ 0, apply the division lemma to b and r.
- - **Step 3:** Continue the process till the remainder is zero. The divisor at this stage will be the required HCF.

### The Fundamental Theorem of Arithmetic
- Every composite number can be expressed (factorised) as a product of primes, and this factorisation is unique, apart from the order in which the prime factors occur.
- This is also known as the **Unique Prime Factorization Theorem**.
- **Example:** 36 = 2 × 2 × 3 × 3 = 2² × 3²
- The prime factorization of a natural number is unique, except for the order of its factors.

### HCF and LCM using Prime Factorization
- **HCF (Highest Common Factor):** Product of the smallest power of each common prime factor in the numbers.
- **LCM (Lowest Common Multiple):** Product of the greatest power of each prime factor involved in the numbers.
- **Important Property:** For any two positive integers a and b, **HCF(a, b) × LCM(a, b) = a × b**.

### Revisiting Irrational Numbers
- **Rational Numbers:** A number that can be written in the form p/q, where p and q are integers and q ≠ 0. Their decimal expansion is either terminating or non-terminating recurring.
- **Irrational Numbers:** A number that cannot be written in the form p/q. Their decimal expansion is non-terminating and non-recurring.
- **Example:** √2, √3, √5, π
- **Theorem:** If a prime number 'p' divides a², then 'p' also divides 'a', where 'a' is a positive integer. This theorem is used to prove the irrationality of numbers like √2.

### Decimal Expansions of Rational Numbers
- Let x be a rational number whose decimal expansion terminates. Then x can be expressed in the form p/q, where p and q are coprime, and the prime factorisation of q is of the form **2ⁿ5ᵐ**, where n, m are non-negative integers.
- Let x = p/q be a rational number, such that the prime factorisation of q is not of the form 2ⁿ5ᵐ. Then, x has a decimal expansion which is **non-terminating recurring** (repeating).
`
    },
    hi: {
      title: 'अध्याय 1: वास्तविक संख्याएँ',
      content: `### यूक्लिड की विभाजन प्रमेयिका
- दो दिए गए धनात्मक पूर्णांकों a और b के लिए, ऐसी अद्वितीय पूर्ण संख्याएँ q और r मौजूद हैं कि **a = bq + r**, जहाँ **0 ≤ r < b**।
- यहाँ, 'a' भाज्य है, 'b' भाजक है, 'q' भागफल है, और 'r' शेषफल है।
- इस प्रमेयिका का उपयोग दो धनात्मक पूर्णांकों का महत्तम समापवर्तक (HCF) ज्ञात करने के लिए किया जाता है।

### यूक्लिड की विभाजन एल्गोरिथ्म
- एक एल्गोरिथ्म सुपरिभाषित चरणों की एक श्रृंखला है जो एक प्रकार की समस्या को हल करने के लिए एक प्रक्रिया देती है।
- यह दो दिए गए धनात्मक पूर्णांकों का HCF परिकलित करने की एक तकनीक है।
- **HCF(a, b) ज्ञात करने के चरण जहाँ a > b:**
- - **चरण 1:** a और b पर यूक्लिड की विभाजन प्रमेयिका का प्रयोग करके पूर्ण संख्याएँ q और r ज्ञात करें ताकि a = bq + r, 0 ≤ r < b हो।
- - **चरण 2:** यदि r = 0 है, तो HCF b है। यदि r ≠ 0 है, तो b और r पर विभाजन प्रमेयिका का प्रयोग करें।
- - **चरण 3:** प्रक्रिया को तब तक जारी रखें जब तक शेषफल शून्य न हो जाए। इस चरण में भाजक ही आवश्यक HCF होगा।

### अंकगणित की आधारभूत प्रमेय
- प्रत्येक भाज्य संख्या को अभाज्य संख्याओं के एक गुणनफल के रूप में व्यक्त (गुणनखंडित) किया जा सकता है, तथा यह गुणनखंडन अभाज्य गुणनखंडों के आने वाले क्रम के बिना अद्वितीय होता है।
- इसे **अद्वितीय अभाज्य गुणनखंडन प्रमेय** के रूप में भी जाना जाता है।
- **उदाहरण:** 36 = 2 × 2 × 3 × 3 = 2² × 3²
- एक प्राकृत संख्या का अभाज्य गुणनखंडन, उसके गुणनखंडों के क्रम को छोड़कर, अद्वितीय होता है।

### अभाज्य गुणनखंडन का उपयोग करके HCF और LCM
- **HCF (महत्तम समापवर्तक):** संख्याओं में प्रत्येक उभयनिष्ठ अभाज्य गुणनखंड की सबसे छोटी घात का गुणनफल।
- **LCM (लघुत्तम समापवर्त्य):** संख्याओं में शामिल प्रत्येक अभाज्य गुणनखंड की सबसे बड़ी घात का गुणनफल।
- **महत्वपूर्ण गुण:** किन्हीं दो धनात्मक पूर्णांकों a और b के लिए, **HCF(a, b) × LCM(a, b) = a × b**।

### अपरिमेय संख्याओं का पुनरीक्षण
- **परिमेय संख्याएँ:** एक संख्या जिसे p/q के रूप में लिखा जा सकता है, जहाँ p और q पूर्णांक हैं और q ≠ 0। उनका दशमलव प्रसार या तो सांत होता है या असांत आवर्ती।
- **अपरिमेय संख्याएँ:** एक संख्या जिसे p/q के रूप में नहीं लिखा जा सकता है। उनका दशमलव प्रसार असांत और अनावर्ती होता है।
- **उदाहरण:** √2, √3, √5, π
- **प्रमेय:** यदि एक अभाज्य संख्या 'p', a² को विभाजित करती है, तो 'p', 'a' को भी विभाजित करेगी, जहाँ 'a' एक धनात्मक पूर्णांक है। इस प्रमेय का उपयोग √2 जैसी संख्याओं की अपरिमेयता सिद्ध करने के लिए किया जाता है।

### परिमेय संख्याओं का दशमलव प्रसार
- मान लीजिए x एक परिमेय संख्या है जिसका दशमलव प्रसार सांत है। तब x को p/q के रूप में व्यक्त किया जा सकता है, जहाँ p और q सह-अभाज्य हैं, और q का अभाज्य गुणनखंडन **2ⁿ5ᵐ** के रूप का है, जहाँ n, m गैर-ऋणात्मक पूर्णांक हैं।
- मान लीजिए x = p/q एक परिमेय संख्या है, जैसे कि q का अभाज्य गुणनखंडन 2ⁿ5ᵐ के रूप का नहीं है। तब, x का एक दशमलव प्रसार होता है जो **असांत आवर्ती** (दोहराव वाला) होता है।
`
    }
  },
  'chemical-reactions-and-equations': {
    en: {
      title: 'Chapter 1: Chemical Reactions and Equations',
      content: `### Chemical Reactions
- A chemical reaction is a process that leads to the chemical transformation of one set of chemical substances to another.
- **Reactants:** The substances that undergo chemical change in the reaction.
- **Products:** The new substances formed during the reaction.
- **Observations that help determine a chemical reaction:**
- - Change in state
- - Change in colour
- - Evolution of a gas
- - Change in temperature

### Chemical Equations
- A chemical equation is the symbolic representation of a chemical reaction in the form of symbols and formulae.
- **Word Equation:** Magnesium + Oxygen → Magnesium oxide
- **Symbolic Equation:** 2Mg + O₂ → 2MgO

### Balanced Chemical Equations
- A balanced chemical equation has an equal number of atoms of each element on both sides of the equation.
- **Law of Conservation of Mass:** Mass can neither be created nor destroyed in a chemical reaction. Therefore, the total mass of the elements present in the products must be equal to the total mass of the elements present in the reactants.
- **Steps to Balance a Chemical Equation (Hit and Trial Method):**
- - 1. Write the word equation and then the skeletal chemical equation.
- - 2. List the number of atoms of different elements present in the unbalanced equation.
- - 3. Start balancing with the compound that contains the maximum number of atoms. It may be a reactant or a product.
- - 4. Balance the elements one by one by putting coefficients.
- - 5. Check the correctness of the balanced equation by counting the atoms of each element on both sides.
- - 6. Write symbols of the physical state of reactants and products (s for solid, l for liquid, g for gas, aq for aqueous).

### Types of Chemical Reactions
- **Combination Reaction:** A reaction in which two or more reactants combine to form a single product.
- - **Example:** CaO(s) + H₂O(l) → Ca(OH)₂(aq) (Quick lime + Water → Slaked lime)
- - Burning of coal: C(s) + O₂(g) → CO₂(g)
- **Decomposition Reaction:** A reaction in which a single reactant breaks down to give simpler products.
- - **Thermal Decomposition:** Decomposition carried out by heating.
- - - **Example:** 2FeSO₄(s) --(Heat)--> Fe₂O₃(s) + SO₂(g) + SO₃(g)
- - **Electrolytic Decomposition (Electrolysis):** Decomposition carried out by passing electricity.
- - - **Example:** 2H₂O(l) --(Electrolysis)--> 2H₂(g) + O₂(g)
- - **Photolytic Decomposition (Photolysis):** Decomposition carried out in the presence of sunlight.
- - - **Example:** 2AgCl(s) --(Sunlight)--> 2Ag(s) + Cl₂(g)
- **Displacement Reaction:** A reaction in which a more reactive element displaces a less reactive element from its compound.
- - **Example:** Fe(s) + CuSO₄(aq) → FeSO₄(aq) + Cu(s) (Iron displaces Copper)
- **Double Displacement Reaction:** A reaction in which there is an exchange of ions between the reactants.
- - **Example:** Na₂SO₄(aq) + BaCl₂(aq) → BaSO₄(s) + 2NaCl(aq)
- - **Precipitation Reaction:** Any reaction that produces a precipitate (an insoluble solid). The above example is also a precipitation reaction as BaSO₄ is a white precipitate.
- **Oxidation and Reduction (Redox Reactions):**
- - **Oxidation:** The gain of oxygen or loss of hydrogen. A substance is oxidized if it gains oxygen or loses hydrogen.
- - **Reduction:** The loss of oxygen or gain of hydrogen. A substance is reduced if it loses oxygen or gains hydrogen.
- - **Oxidizing Agent:** The substance which gives oxygen or gains hydrogen.
- - **Reducing Agent:** The substance which gains oxygen or gives hydrogen.
- - **Example:** CuO + H₂ → Cu + H₂O. Here, CuO is reduced to Cu, and H₂ is oxidized to H₂O. CuO is the oxidizing agent, and H₂ is the reducing agent.

### Effects of Oxidation in Daily Life
- **Corrosion:** The process where metals are attacked by substances around it such as moisture, acids, etc.
- - **Example:** Rusting of iron (formation of a reddish-brown coating of hydrated ferric oxide), black coating on silver, green coating on copper.
- **Rancidity:** The process of oxidation of fats and oils in food, resulting in an unpleasant smell and taste.
- - **Prevention:** It can be prevented by adding antioxidants, storing food in airtight containers, or flushing food packages with nitrogen gas.
`
    },
    hi: {
      title: 'अध्याय 1: रासायनिक अभिक्रियाएँ एवं समीकरण',
      content: `### रासायनिक अभिक्रियाएँ
- रासायनिक अभिक्रिया एक ऐसी प्रक्रिया है जिसमें एक या अधिक रासायनिक पदार्थ परिवर्तित होकर दूसरे रासायनिक पदार्थ बनाते हैं।
- **अभिकारक:** वे पदार्थ जो अभिक्रिया में रासायनिक परिवर्तन से गुजरते हैं।
- **उत्पाद:** अभिक्रिया के दौरान बनने वाले नए पदार्थ।
- **अवलोकन जो रासायनिक अभिक्रिया का निर्धारण करने में मदद करते हैं:**
- - अवस्था में परिवर्तन
- - रंग में परिवर्तन
- - गैस का उत्सर्जन
- - तापमान में परिवर्तन

### रासायनिक समीकरण
- रासायनिक समीकरण प्रतीकों और सूत्रों के रूप में एक रासायनिक अभिक्रिया का प्रतीकात्मक प्रतिनिधित्व है।
- **शब्द समीकरण:** मैग्नीशियम + ऑक्सीजन → मैग्नीशियम ऑक्साइड
- **प्रतीकात्मक समीकरण:** 2Mg + O₂ → 2MgO

### संतुलित रासायनिक समीकरण
- एक संतुलित रासायनिक समीकरण में समीकरण के दोनों पक्षों में प्रत्येक तत्व के परमाणुओं की संख्या बराबर होती है।
- **द्रव्यमान संरक्षण का नियम:** किसी रासायनिक अभिक्रिया में द्रव्यमान का न तो निर्माण किया जा सकता है और न ही विनाश। इसलिए, उत्पादों में मौजूद तत्वों का कुल द्रव्यमान अभिकारकों में मौजूद तत्वों के कुल द्रव्यमान के बराबर होना चाहिए।
- **रासायनिक समीकरण को संतुलित करने के चरण (हिट एंड ट्रायल विधि):**
- - 1. शब्द समीकरण और फिर कंकालीय रासायनिक समीकरण लिखें।
- - 2. असंतुलित समीकरण में मौजूद विभिन्न तत्वों के परमाणुओं की संख्या को सूचीबद्ध करें।
- - 3. उस यौगिक से संतुलन शुरू करें जिसमें परमाणुओं की अधिकतम संख्या हो। यह एक अभिकारक या उत्पाद हो सकता है।
- - 4. गुणांक लगाकर एक-एक करके तत्वों को संतुलित करें।
- - 5. दोनों पक्षों में प्रत्येक तत्व के परमाणुओं की गिनती करके संतुलित समीकरण की शुद्धता की जाँच करें।
- - 6. अभिकारकों और उत्पादों की भौतिक अवस्था के प्रतीक लिखें (s ठोस के लिए, l तरल के लिए, g गैस के लिए, aq जलीय विलयन के लिए)।

### रासायनिक अभिक्रियाओं के प्रकार
- **संयोजन अभिक्रिया:** एक अभिक्रिया जिसमें दो या दो से अधिक अभिकारक मिलकर एक एकल उत्पाद बनाते हैं।
- - **उदाहरण:** CaO(s) + H₂O(l) → Ca(OH)₂(aq) (बिना बुझा चूना + पानी → बुझा हुआ चूना)
- - कोयले का दहन: C(s) + O₂(g) → CO₂(g)
- **वियोजन अभिक्रिया:** एक अभिक्रिया जिसमें एक एकल अभिकारक टूटकर सरल उत्पाद देता है।
- - **ऊष्मीय वियोजन:** गर्म करके किया गया वियोजन।
- - - **उदाहरण:** 2FeSO₄(s) --(ऊष्मा)--> Fe₂O₃(s) + SO₂(g) + SO₃(g)
- - **विद्युत-अपघटनी वियोजन (विद्युत-अपघटन):** विद्युत प्रवाहित करके किया गया वियोजन।
- - - **उदाहरण:** 2H₂O(l) --(विद्युत-अपघटन)--> 2H₂(g) + O₂(g)
- - **प्रकाशीय वियोजन (प्रकाश-अपघटन):** सूर्य के प्रकाश की उपस्थिति में किया गया वियोजन।
- - - **उदाहरण:** 2AgCl(s) --(सूर्य का प्रकाश)--> 2Ag(s) + Cl₂(g)
- **विस्थापन अभिक्रिया:** एक अभिक्रिया जिसमें एक अधिक क्रियाशील तत्व अपने यौगिक से कम क्रियाशील तत्व को विस्थापित करता है।
- - **उदाहरण:** Fe(s) + CuSO₄(aq) → FeSO₄(aq) + Cu(s) (लोहा तांबे को विस्थापित करता है)
- **द्विविस्थापन अभिक्रिया:** एक अभिक्रिया जिसमें अभिकारकों के बीच आयनों का आदान-प्रदान होता है।
- - **उदाहरण:** Na₂SO₄(aq) + BaCl₂(aq) → BaSO₄(s) + 2NaCl(aq)
- - **अवक्षेपण अभिक्रिया:** कोई भी अभिक्रिया जो एक अवक्षेप (एक अघुलनशील ठोस) उत्पन्न करती है। उपरोक्त उदाहरण भी एक अवक्षेपण अभिक्रिया है क्योंकि BaSO₄ एक सफेद अवक्षेप है।
- **उपचयन और अपचयन (रेडॉक्स अभिक्रियाएँ):**
- - **उपचयन (ऑक्सीकरण):** ऑक्सीजन का लाभ या हाइड्रोजन की हानि। यदि कोई पदार्थ ऑक्सीजन प्राप्त करता है या हाइड्रोजन खोता है तो वह उपचयित होता है।
- - **अपचयन:** ऑक्सीजन की हानि या हाइड्रोजन का लाभ। यदि कोई पदार्थ ऑक्सीजन खोता है या हाइड्रोजन प्राप्त करता है तो वह अपचयित होता है।
- - **उपचायक (ऑक्सीकारक):** वह पदार्थ जो ऑक्सीजन देता है या हाइड्रोजन प्राप्त करता है।
- - **अपचायक:** वह पदार्थ जो ऑक्सीजन प्राप्त करता है या हाइड्रोजन देता है।
- - **उदाहरण:** CuO + H₂ → Cu + H₂O। यहाँ, CuO का Cu में अपचयन होता है, और H₂ का H₂O में उपचयन होता है। CuO उपचायक है, और H₂ अपचायक है।

### दैनिक जीवन में उपचयन के प्रभाव
- **संक्षारण:** वह प्रक्रिया जिसमें धातुएँ अपने आस-पास के पदार्थों जैसे नमी, अम्ल आदि द्वारा आक्रमित होती हैं।
- - **उदाहरण:** लोहे में जंग लगना (जलयोजित फेरिक ऑक्साइड की लाल-भूरी परत का बनना), चांदी पर काली परत, तांबे पर हरी परत।
- **विकृतगंधिता:** भोजन में वसा और तेलों के उपचयन की प्रक्रिया, जिसके परिणामस्वरूप एक अप्रिय गंध और स्वाद होता है।
- - **रोकथाम:** इसे प्रतिऑक्सीकारक मिलाकर, भोजन को वायुरोधी कंटेनरों में संग्रहीत करके, या खाद्य पैकेजों को नाइट्रोजन गैस से फ्लश करके रोका जा सकता है।
`
    }
  },
  'acids-bases-and-salts': {
    en: {
      title: 'Chapter 2: Acids, Bases and Salts',
      content: `### Properties of Acids and Bases
- **Acids:**
- - Have a sour taste.
- - Turn blue litmus paper red.
- - Give H⁺ ions in aqueous solution.
- - Examples: Hydrochloric acid (HCl), Sulphuric acid (H₂SO₄), Nitric acid (HNO₃), Acetic acid (CH₃COOH).
- **Bases:**
- - Have a bitter taste.
- - Turn red litmus paper blue.
- - Feel soapy to touch.
- - Give OH⁻ ions in aqueous solution.
- - Examples: Sodium hydroxide (NaOH), Potassium hydroxide (KOH), Calcium hydroxide (Ca(OH)₂).
- **Alkalis:** Bases which are soluble in water are called alkalis.

### Indicators
- **Indicators:** Substances which change their colour or odour in different types of substances.
- **Natural Indicators:** Litmus (from lichens), Turmeric.
- **Synthetic Indicators:** Methyl orange, Phenolphthalein.
- **Olfactory Indicators:** Substances which have a different odour in acidic and basic mediums. Ex: Onion, Vanilla essence.

### Chemical Properties of Acids and Bases
- **Reaction of Acids with Metals:** Acid + Metal → Salt + Hydrogen gas. (e.g., 2HCl + Zn → ZnCl₂ + H₂)
- **Reaction of Bases with Metals:** Base + Metal → Salt + Hydrogen gas. (e.g., 2NaOH + Zn → Na₂ZnO₂ + H₂)
- **Reaction of Acids with Metal Carbonates/Hydrogen Carbonates:** Acid + Metal Carbonate → Salt + Carbon dioxide + Water. (e.g., 2HCl + Na₂CO₃ → 2NaCl + CO₂ + H₂O)
- **Neutralisation Reaction:** Acid + Base → Salt + Water. (e.g., HCl + NaOH → NaCl + H₂O)
- **Reaction of Acids with Metallic Oxides:** Metallic Oxide + Acid → Salt + Water. (Metallic oxides are basic in nature).
- **Reaction of Bases with Non-metallic Oxides:** Non-metallic Oxide + Base → Salt + Water. (Non-metallic oxides are acidic in nature).

### pH Scale
- **pH Scale:** A scale for measuring hydrogen ion concentration in a solution.
- The 'p' in pH stands for 'potenz' in German, meaning power.
- pH = 7 → Neutral solution (e.g., pure water).
- pH < 7 → Acidic solution.
- pH > 7 → Basic solution.
- The strength of an acid or base depends on the number of H⁺ or OH⁻ ions produced.

### More about Salts
- **Salts:** An ionic compound formed from the neutralisation reaction of an acid and a base.
- **Family of Salts:** Salts having the same positive or negative radicals are said to belong to a family. (e.g., NaCl and KCl belong to the family of chloride salts).
- **pH of Salts:**
- - Salts of a strong acid and a strong base are neutral with pH value of 7.
- - Salts of a strong acid and a weak base are acidic with pH value less than 7.
- - Salts of a strong base and a weak acid are basic in nature, with pH value more than 7.

### Common Chemicals from Common Salt (NaCl)
- **Sodium Hydroxide (NaOH):** Produced by the electrolysis of an aqueous solution of NaCl (brine). This is called the chlor-alkali process.
- **Bleaching Powder (CaOCl₂):** Produced by the action of chlorine on dry slaked lime.
- **Baking Soda (NaHCO₃):** Sodium hydrogen carbonate. Used in baking, as an antacid, and in soda-acid fire extinguishers.
- **Washing Soda (Na₂CO₃·10H₂O):** Sodium carbonate. Used in glass, soap, and paper industries, and for removing permanent hardness of water.
- **Plaster of Paris (CaSO₄·½H₂O):** Calcium sulphate hemihydrate. On mixing with water, it changes to gypsum, a hard solid mass. Used for supporting fractured bones and for making decorative materials.`
    },
    hi: {
      title: 'अध्याय 2: अम्ल, क्षारक एवं लवण',
      content: `### अम्ल और क्षारक के गुण
- **अम्ल:**
- - स्वाद में खट्टे होते हैं।
- - नीले लिटमस पत्र को लाल कर देते हैं।
- - जलीय विलयन में H⁺ आयन देते हैं।
- - उदाहरण: हाइड्रोक्लोरिक अम्ल (HCl), सल्फ्यूरिक अम्ल (H₂SO₄), नाइट्रिक अम्ल (HNO₃), एसिटिक अम्ल (CH₃COOH)।
- **क्षारक:**
- - स्वाद में कड़वे होते हैं।
- - लाल लिटमस पत्र को नीला कर देते हैं।
- - छूने में साबुन जैसे लगते हैं।
- - जलीय विलयन में OH⁻ आयन देते हैं।
- - उदाहरण: सोडियम हाइड्रॉक्साइड (NaOH), पोटेशियम हाइड्रॉक्साइड (KOH), कैल्शियम हाइड्रॉक्साइड (Ca(OH)₂)।
- **क्षार:** जल में घुलनशील क्षारक को क्षार कहते हैं।

### सूचक
- **सूचक:** वे पदार्थ जो विभिन्न प्रकार के पदार्थों में अपना रंग या गंध बदल देते हैं।
- **प्राकृतिक सूचक:** लिटमस (लाइकेन से), हल्दी।
- **संश्लेषित सूचक:** मेथिल ऑरेंज, फेनोल्फथेलिन।
- **गंधीय सूचक:** वे पदार्थ जिनकी गंध अम्लीय और क्षारीय माध्यमों में भिन्न होती है। उदा: प्याज, वैनिला एसेंस।

### अम्ल और क्षारक के रासायनिक गुण
- **अम्लों की धातुओं के साथ अभिक्रिया:** अम्ल + धातु → लवण + हाइड्रोजन गैस। (उदा., 2HCl + Zn → ZnCl₂ + H₂)
- **क्षारकों की धातुओं के साथ अभिक्रिया:** क्षारक + धातु → लवण + हाइड्रोजन गैस। (उदा., 2NaOH + Zn → Na₂ZnO₂ + H₂)
- **अम्लों की धातु कार्बोनेट/हाइड्रोजन कार्बोनेट के साथ अभिक्रिया:** अम्ल + धातु कार्बोनेट → लवण + कार्बन डाइऑक्साइड + जल। (उदा., 2HCl + Na₂CO₃ → 2NaCl + CO₂ + H₂O)
- **उदासीनीकरण अभिक्रिया:** अम्ल + क्षारक → लवण + जल। (उदा., HCl + NaOH → NaCl + H₂O)
- **अम्लों की धात्विक ऑक्साइडों के साथ अभिक्रिया:** धात्विक ऑक्साइड + अम्ल → लवण + जल। (धात्विक ऑक्साइड प्रकृति में क्षारीय होते हैं)।
- **क्षारकों की अधात्विक ऑक्साइडों के साथ अभिक्रिया:** अधात्विक ऑक्साइड + क्षारक → लवण + जल। (अधात्विक ऑक्साइड प्रकृति में अम्लीय होते हैं)।

### pH स्केल
- **pH स्केल:** किसी विलयन में हाइड्रोजन आयन सांद्रता को मापने के लिए एक पैमाना।
- pH में 'p' जर्मन में 'पोटेंज़' के लिए है, जिसका अर्थ है शक्ति।
- pH = 7 → उदासीन विलयन (उदा., शुद्ध जल)।
- pH < 7 → अम्लीय विलयन।
- pH > 7 → क्षारीय विलयन।
- किसी अम्ल या क्षारक की प्रबलता उत्पन्न H⁺ या OH⁻ आयनों की संख्या पर निर्भर करती है।

### लवणों के बारे में अधिक जानकारी
- **लवण:** एक आयनिक यौगिक जो एक अम्ल और एक क्षारक की उदासीनीकरण अभिक्रिया से बनता है।
- **लवणों का परिवार:** समान धनात्मक या ऋणात्मक मूलक वाले लवणों को एक परिवार से संबंधित कहा जाता है। (उदा., NaCl और KCl क्लोराइड लवणों के परिवार से संबंधित हैं)।
- **लवणों का pH:**
- - एक प्रबल अम्ल और एक प्रबल क्षारक के लवण 7 के pH मान के साथ उदासीन होते हैं।
- - एक प्रबल अम्ल और एक दुर्बल क्षारक के लवण 7 से कम pH मान के साथ अम्लीय होते हैं।
- - एक प्रबल क्षारक और एक दुर्बल अम्ल के लवण प्रकृति में क्षारीय होते हैं, जिनका pH मान 7 से अधिक होता है।

### साधारण नमक (NaCl) से सामान्य रसायन
- **सोडियम हाइड्रॉक्साइड (NaOH):** NaCl (ब्राइन) के जलीय विलयन के विद्युत अपघटन द्वारा उत्पादित। इसे क्लोर-क्षार प्रक्रिया कहा जाता है।
- **विरंजक चूर्ण (CaOCl₂):** शुष्क बुझे हुए चूने पर क्लोरीन की क्रिया द्वारा उत्पादित।
- **बेकिंग सोडा (NaHCO₃):** सोडियम हाइड्रोजन कार्बोनेट। बेकिंग में, एक एंटासिड के रूप में, और सोडा-एसिड अग्निशामक में उपयोग किया जाता है।
- **धोने का सोडा (Na₂CO₃·10H₂O):** सोडियम कार्बोनेट। कांच, साबुन और कागज उद्योगों में, और पानी की स्थायी कठोरता को दूर करने के लिए उपयोग किया जाता है।
- **प्लास्टर ऑफ पेरिस (CaSO₄·½H₂O):** कैल्शियम सल्फेट हेमीहाइड्रेट। पानी के साथ मिलाने पर, यह जिप्सम, एक कठोर ठोस द्रव्यमान में बदल जाता है। टूटी हुई हड्डियों को सहारा देने और सजावटी सामग्री बनाने के लिए उपयोग किया जाता है।`
    }
  },
    'metals-and-non-metals': {
    en: {
      title: 'Chapter 3: Metals and Non-metals',
      content: `### Physical Properties of Metals
- **Lustre:** Metals have a shining surface.
- **Hardness:** Metals are generally hard.
- **Malleability:** Some metals can be beaten into thin sheets.
- **Ductility:** The ability of metals to be drawn into thin wires.
- **Conductors of Heat and Electricity:** Metals are good conductors of heat and have high melting points. They are also good conductors of electricity.
- **Sonorous:** Metals that produce a sound on striking a hard surface are said to be sonorous.

### Physical Properties of Non-Metals
- Non-metals are either solids or gases except for bromine which is a liquid.
- Non-metals do not have lustre, are not sonorous or malleable. They are poor conductors of heat and electricity.

### Chemical Properties of Metals
- **Reaction with Air:** Metals combine with oxygen to form metal oxides. Metal oxide + Water → Metal hydroxide.
- **Reaction with Water:** Metals react with water to produce metal oxide and hydrogen gas. Metal oxide that is soluble in water dissolves in it to further form metal hydroxide.
- **Reaction with Acids:** Metal + Dilute acid → Salt + Hydrogen.
- **Reaction with Solutions of other Metal Salts:** Reactive metals can displace less reactive metals from their compounds in solution or molten form.

### The Reactivity Series
- The reactivity series is a list of metals arranged in the order of their decreasing activities.
- **K > Na > Ca > Mg > Al > Zn > Fe > Pb > H > Cu > Hg > Ag > Au**

### How do Metals and Non-metals React?
- The reactivity of elements is the tendency to attain a completely filled valence shell.
- Atoms of the metals lose electrons from their valence shells to form cations.
- Atoms of the non-metals gain electrons in the valence shell to form anions.
- **Ionic Compounds:** The compounds formed by the transfer of electrons from a metal to a non-metal are known as ionic compounds or electrovalent compounds.

### Properties of Ionic Compounds
- **Physical Nature:** They are solid and hard due to the strong force of attraction between the positive and negative ions.
- **Melting and Boiling Points:** They have high melting and boiling points.
- **Solubility:** Generally soluble in water and insoluble in solvents such as kerosene, petrol, etc.
- **Conduction of Electricity:** Ionic compounds in the solid state do not conduct electricity. However, they conduct electricity in the molten state.

### Occurrence of Metals
- **Minerals:** The elements or compounds which occur naturally in the earth’s crust are known as minerals.
- **Ores:** Minerals from which metals can be extracted profitably are called ores.

### Extraction of Metals
- **Enrichment of Ores:** Removal of the gangue from ores.
- **Extracting Metals Low in the Activity Series:** By heating them in the air.
- **Extracting Metals in the Middle of the Activity Series:** By calcination or roasting.
- **Extracting Metals towards the Top of the Activity Series:** By electrolysis.

### Refining of Metals
- The most widely used method for refining impure metals is electrolytic refining.

### Corrosion
- The surface of some metals gets corroded when they are exposed to moist air for a long period of time. This is called corrosion.

### Prevention of Corrosion
- **Rusting of iron can be prevented by painting, oiling, greasing, galvanising, chrome plating, anodising or making alloys.**

### Alloys
- **Alloy:** An alloy is a homogeneous mixture of two or more metals, or a metal and a non-metal.`
    },
    hi: {
      title: 'अध्याय 3: धातु एवं अधातु',
      content: `### धातुओं के भौतिक गुणधर्म
- **धात्विक चमक:** धातुओं की सतह चमकदार होती है।
- **कठोरता:** धातुएँ सामान्यतः कठोर होती हैं।
- **आघातवर्ध्यता:** कुछ धातुओं को पीटकर पतली चादर बनाया जा सकता है।
- **तन्यता:** धातुओं को पतले तार के रूप में खींचने की क्षमता को तन्यता कहते हैं।
- **ऊष्मा तथा विद्युत के चालक:** धातुएँ ऊष्मा की सुचालक होती हैं तथा उनका गलनांक अधिक होता है। वे विद्युत की भी सुचालक होती हैं।
- **ध्वानिक:** जो धातुएँ किसी कठोर सतह से टकराने पर आवाज़ उत्पन्न करती हैं, उन्हें ध्वानिक कहते हैं।

### अधातुओं के भौतिक गुणधर्म
- अधातुएँ या तो ठोस या गैस होती हैं, सिवाय ब्रोमीन के जो एक द्रव है।
- अधातुओं में चमक नहीं होती, वे ध्वानिक या आघातवर्ध्य नहीं होती हैं। वे ऊष्मा और विद्युत की कुचालक होती हैं।

### धातुओं के रासायनिक गुणधर्म
- **वायु के साथ अभिक्रिया:** धातुएँ ऑक्सीजन के साथ मिलकर धातु ऑक्साइड बनाती हैं। धातु ऑक्साइड + जल → धातु हाइड्रॉक्साइड।
- **जल के साथ अभिक्रिया:** धातुएँ जल के साथ अभिक्रिया करके धातु ऑक्साइड और हाइड्रोजन गैस उत्पन्न करती हैं। जो धातु ऑक्साइड जल में घुलनशील होते हैं, वे उसमें घुलकर आगे धातु हाइड्रॉक्साइड बनाते हैं।
- **अम्लों के साथ अभिक्रिया:** धातु + तनु अम्ल → लवण + हाइड्रोजन।
- **अन्य धातु लवणों के विलयनों के साथ अभिक्रिया:** अभिक्रियाशील धातुएँ कम अभिक्रियाशील धातुओं को उनके यौगिकों से विलयन या गलित रूप में विस्थापित कर सकती हैं।

### सक्रियता श्रेणी
- सक्रियता श्रेणी धातुओं की एक सूची है जिसे उनकी घटती हुई गतिविधियों के क्रम में व्यवस्थित किया गया है।
- **K > Na > Ca > Mg > Al > Zn > Fe > Pb > H > Cu > Hg > Ag > Au**

### धातुएँ एवं अधातुएँ कैसे अभिक्रिया करती हैं?
- तत्वों की अभिक्रियाशीलता पूरी तरह से भरे हुए संयोजकता कोश को प्राप्त करने की प्रवृत्ति है।
- धातुओं के परमाणु धनायन बनाने के लिए अपने संयोजकता कोशों से इलेक्ट्रॉन खो देते हैं।
- अधातुओं के परमाणु ऋणायन बनाने के लिए संयोजकता कोश में इलेक्ट्रॉन प्राप्त करते हैं।
- **आयनिक यौगिक:** एक धातु से एक अधातु में इलेक्ट्रॉनों के स्थानांतरण द्वारा बने यौगिकों को आयनिक यौगिक या वैद्युतसंयोजक यौगिक के रूप में जाना जाता है।

### आयनिक यौगिकों के गुणधर्म
- **भौतिक प्रकृति:** धनात्मक और ऋणात्मक आयनों के बीच मजबूत आकर्षण बल के कारण वे ठोस और कठोर होते हैं।
- **गलनांक एवं क्वथनांक:** इनके गलनांक एवं क्वथनांक उच्च होते हैं।
- **घुलनशीलता:** सामान्यतः जल में विलेय तथा केरोसिन, पेट्रोल आदि जैसे विलायकों में अविलेय।
- **विद्युत चालकता:** ठोस अवस्था में आयनिक यौगिक विद्युत का चालन नहीं करते हैं। हालाँकि, वे गलित अवस्था में विद्युत का चालन करते हैं।

### धातुओं की प्राप्ति
- **खनिज:** पृथ्वी की भूपर्पटी में प्राकृतिक रूप से पाए जाने वाले तत्वों या यौगिकों को खनिज के रूप में जाना जाता है।
- **अयस्क:** वे खनिज जिनसे धातुओं का निष्कर्षण लाभप्रद रूप से किया जा सकता है, अयस्क कहलाते हैं।

### धातुओं का निष्कर्षण
- **अयस्कों का समृद्धीकरण:** अयस्कों से गैंग को हटाना।
- **सक्रियता श्रेणी में नीचे आने वाली धातुओं का निष्कर्षण:** उन्हें हवा में गर्म करके।
- **सक्रियता श्रेणी के मध्य में स्थित धातुओं का निष्कर्षण:** निस्तापन या भर्जन द्वारा।
- **सक्रियता श्रेणी में सबसे ऊपर की धातुओं का निष्कर्षण:** विद्युत अपघटन द्वारा।

### धातुओं का परिष्करण
- अशुद्ध धातुओं के परिष्करण के लिए सबसे व्यापक रूप से उपयोग की जाने वाली विधि विद्युत अपघटनी परिष्करण है।

### संक्षारण
- कुछ धातुओं की सतह संक्षारित हो जाती है जब वे लंबे समय तक नम हवा के संपर्क में रहती हैं। इसे संक्षारण कहते हैं।

### संक्षारण से सुरक्षा
- **लोहे को जंग लगने से पेंट करके, तेल लगाकर, ग्रीस लगाकर, यशदलेपन, क्रोमियम लेपन, एनोडीकरण या मिश्रधातु बनाकर रोका जा सकता है।**

### मिश्रधातु
- **मिश्रधातु:** एक मिश्रधातु दो या दो से अधिक धातुओं, या एक धातु और एक अधातु का एक समांगी मिश्रण है।`
    }
  },
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
'components-of-food': {
    en: {
      title: 'Chapter 2: Components of Food',
      content: `### What do different food items contain?
- **Nutrients:** The components of food that our body needs to grow, to get energy, and to stay healthy.
- **Major Nutrients:** Carbohydrates, Proteins, Fats, Vitamins, and Minerals.
- **Other Components:** Food also contains dietary fibres and water which are also needed by our body.

### Carbohydrates, Fats, and Proteins
- **Carbohydrates:** Mainly provide energy to our body. Found in bread, potatoes, rice, and fruits.
- **Fats:** Also provide energy, in fact, much more than carbohydrates. Found in oil, ghee, butter, and nuts.
- **Proteins:** Needed for the growth and repair of our body. Often called ‘body building’ foods. Found in pulses, milk, eggs, and meat.

### Vitamins and Minerals
- **Vitamins:** Help in protecting our body against diseases. They also help in keeping our eyes, bones, teeth, and gums healthy.
- - **Examples:** Vitamin A (keeps skin and eyes healthy), Vitamin C (helps body to fight against many diseases), Vitamin D (helps our body to use calcium for bones and teeth).
- **Minerals:** Needed by our body in small amounts for proper growth and to maintain good health.
- - **Examples:** Iodine, Phosphorus, Iron, Calcium.

### Balanced Diet
- **Balanced Diet:** A diet that contains all the nutrients that our body needs, in right quantities, along with a good amount of roughage and water.
- **Deficiency Diseases:** Diseases that occur due to the lack of nutrients over a long period are called deficiency diseases.
`
    },
    hi: {
      title: 'अध्याय 2: भोजन के घटक',
      content: `### विभिन्न खाद्य पदार्थों में क्या होता है?
- **पोषक तत्व:** भोजन के वे घटक जिनकी हमारे शरीर को वृद्धि, ऊर्जा प्राप्त करने और स्वस्थ रहने के लिए आवश्यकता होती है।
- **मुख्य पोषक तत्व:** कार्बोहाइड्रेट, प्रोटीन, वसा, विटामिन और खनिज।
- **अन्य घटक:** भोजन में आहारी रेशे और पानी भी होते हैं जिनकी हमारे शरीर को आवश्यकता होती है।

### कार्बोहाइड्रेट, वसा और प्रोटीन
- **कार्बोहाइड्रेट:** मुख्य रूप से हमारे शरीर को ऊर्जा प्रदान करते हैं। रोटी, आलू, चावल और फलों में पाए जाते हैं।
- **वसा:** ऊर्जा भी प्रदान करते हैं, वास्तव में, कार्बोहाइड्रेट से बहुत अधिक। तेल, घी, मक्खन और मेवों में पाए जाते हैं।
- **प्रोटीन:** हमारे शरीर की वृद्धि और मरम्मत के लिए आवश्यक हैं। इन्हें अक्सर 'शरीर सौष्ठव' खाद्य पदार्थ कहा जाता है। दालों, दूध, अंडे और मांस में पाए जाते हैं।

### विटामिन और खनिज
- **विटामिन:** हमारे शरीर को रोगों से बचाने में मदद करते हैं। वे हमारी आँखों, हड्डियों, दाँतों और मसूड़ों को स्वस्थ रखने में भी मदद करते हैं।
- - **उदाहरण:** विटामिन ए (त्वचा और आँखों को स्वस्थ रखता है), विटामिन सी (शरीर को कई बीमारियों से लड़ने में मदद करता है), विटामिन डी (हमारे शरीर को हड्डियों और दाँतों के लिए कैल्शियम का उपयोग करने में मदद करता है)।
- **खनिज:** हमारे शरीर को उचित वृद्धि और अच्छे स्वास्थ्य को बनाए रखने के लिए कम मात्रा में आवश्यक हैं।
- - **उदाहरण:** आयोडीन, फास्फोरस, लोहा, कैल्शियम।

### संतुलित आहार
- **संतुलित आहार:** एक ऐसा आहार जिसमें वे सभी पोषक तत्व होते हैं जिनकी हमारे शरीर को आवश्यकता होती है, सही मात्रा में, साथ ही अच्छी मात्रा में रूक्षांश और पानी भी होता है।
- **अभावजन्य रोग:** वे रोग जो लंबे समय तक पोषक तत्वों की कमी के कारण होते हैं, अभावजन्य रोग कहलाते हैं।
`
    }
},
'fibre-to-fabric': {
    en: {
      title: 'Chapter 3: Fibre to Fabric',
      content: `### Variety in Fabrics
- Fabrics are made up of yarns and yarns are further made up of fibres.

### Fibres
- **Natural Fibres:** The fibres which are obtained from plants and animals.
- - **Plant Fibres:** Cotton (from cotton bolls), Jute (from the stem of the jute plant).
- - **Animal Fibres:** Wool (from the fleece of sheep or goat), Silk (from the cocoon of silkworm).
- **Synthetic Fibres:** Fibres made from chemical substances.
- - **Examples:** Polyester, Nylon, Acrylic.

### Some Plant Fibres
- **Cotton:** Grown in fields. The fruits of the cotton plant (cotton bolls) are about the size of a lemon. After maturing, the bolls burst open and the seeds covered with cotton fibres can be seen.
- - **Ginning:** The process of separating fibres from the seeds by combing.
- **Jute:** Obtained from the stem of the jute plant. It is cultivated during the rainy season. The stems of the harvested plants are immersed in water for a few days. The stems rot and fibres are separated by hand.

### Spinning Cotton Yarn
- **Spinning:** The process of making yarn from fibres.
- - In this process, fibres from a mass of cotton wool are drawn out and twisted. This brings the fibres together to form a yarn.
- - Devices used for spinning: Hand spindle (takli) and spinning wheel (charkha).

### Yarn to Fabric
- **Weaving:** The process of arranging two sets of yarns together to make a fabric. It is done on looms.
- **Knitting:** A single yarn is used to make a piece of fabric. It can be done by hand or on machines.
`
    },
    hi: {
      title: 'अध्याय 3: तंतु से वस्त्र तक',
      content: `### वस्त्रों में विविधता
- वस्त्र धागों से बनते हैं और धागे आगे तंतुओं से बनते हैं।

### तंतु
- **प्राकृतिक तंतु:** वे तंतु जो पौधों और जानवरों से प्राप्त होते हैं।
- - **पादप तंतु:** कपास (कपास के गोलों से), जूट (जूट के पौधे के तने से)।
- - **जांतव तंतु:** ऊन (भेड़ या बकरी के ऊन से), रेशम (रेशमकीट के कोकून से)।
- **संश्लिष्ट तंतु:** रासायनिक पदार्थों से बने तंतु।
- - **उदाहरण:** पॉलिएस्टर, नायलॉन, ऐक्रेलिक।

### कुछ पादप तंतु
- **कपास:** खेतों में उगाया जाता है। कपास के पौधे के फल (कपास गोलक) लगभग नींबू के आकार के होते हैं। परिपक्व होने के बाद, गोले फट जाते हैं और कपास के तंतुओं से ढके बीज देखे जा सकते हैं।
- - **ओटना:** कंघी करके बीजों से तंतुओं को अलग करने की प्रक्रिया।
- **जूट:** जूट के पौधे के तने से प्राप्त होता है। इसकी खेती बरसात के मौसम में की जाती है। कटी हुई पौधों के तनों को कुछ दिनों के लिए पानी में डुबोया जाता है। तने सड़ जाते हैं और तंतुओं को हाथ से अलग किया जाता है।

### सूती धागे की कताई
- **कताई:** तंतुओं से धागा बनाने की प्रक्रिया।
- - इस प्रक्रिया में, रूई के एक पुंज से रेशों को निकालकर ऐंठा जाता है। इससे रेशे एक साथ मिलकर धागा बनाते हैं।
- - कताई के लिए उपयोग किए जाने वाले उपकरण: तकली और चरखा।

### धागे से वस्त्र
- **बुनाई:** वस्त्र बनाने के लिए धागों के दो सेटों को एक साथ व्यवस्थित करने की प्रक्रिया। यह करघों पर किया जाता है।
- **बुनाई:** एक ही धागे का उपयोग करके वस्त्र का एक टुकड़ा बनाया जाता है। यह हाथ से या मशीनों पर किया जा सकता है।
`
    }
},
'sorting-materials-into-groups': {
    en: {
      title: 'Chapter 4: Sorting Materials into Groups',
      content: `### Objects Around Us
- We see a large variety of objects around us. They have different shapes, colours and uses.
- Objects are made of one or more materials. These materials may be glass, metal, plastics, wood, cotton, paper, mud or soil.

### Properties of Materials
- We group objects based on their properties.
- **Appearance:** Materials can look different from each other. Some are shiny (lustre), others are not. Ex: Metals are generally lustrous.
- **Hardness:** Materials can be hard or soft. Hard materials are difficult to compress, while soft materials can be compressed easily. Ex: Iron is hard, cotton is soft.
- **Soluble or Insoluble:** Some substances completely disappear or dissolve in water (soluble), while others do not (insoluble). Ex: Salt is soluble, sand is insoluble.
- **Float or Sink:** Some materials float on water, while others sink. Ex: Wood floats, a stone sinks.
- **Transparency:**
- - **Transparent:** Substances or materials through which things can be seen clearly. Ex: Glass, water.
- - **Opaque:** Substances through which you are not able to see. Ex: Wood, cardboard.
- - **Translucent:** Materials through which objects can be seen, but not clearly. Ex: Butter paper.
`
    },
    hi: {
      title: 'अध्याय 4: वस्तुओं के समूह बनाना',
      content: `### हमारे चारों ओर की वस्तुएँ
- हम अपने चारों ओर विभिन्न प्रकार की वस्तुएँ देखते हैं। उनके अलग-अलग आकार, रंग और उपयोग होते हैं।
- वस्तुएँ एक या एक से अधिक पदार्थों से बनी होती हैं। ये पदार्थ कांच, धातु, प्लास्टिक, लकड़ी, कपास, कागज, कीचड़ या मिट्टी हो सकते हैं।

### पदार्थों के गुण
- हम वस्तुओं को उनके गुणों के आधार पर समूहित करते हैं।
- **दिखावट:** पदार्थ एक दूसरे से अलग दिख सकते हैं। कुछ चमकदार (द्युति) होते हैं, अन्य नहीं। उदा: धातुएँ आमतौर पर चमकदार होती हैं।
- **कठोरता:** पदार्थ कठोर या नरम हो सकते हैं। कठोर पदार्थों को संपीड़ित करना मुश्किल होता है, जबकि नरम पदार्थों को आसानी से संपीड़ित किया जा सकता है। उदा: लोहा कठोर है, कपास नरम है।
- **विलेय या अविलेय:** कुछ पदार्थ पानी में पूरी तरह से गायब हो जाते हैं या घुल जाते हैं (विलेय), जबकि अन्य नहीं होते (अविलेय)। उदा: नमक विलेय है, रेत अविलेय है।
- **तैरना या डूबना:** कुछ पदार्थ पानी पर तैरते हैं, जबकि अन्य डूब जाते हैं। उदा: लकड़ी तैरती है, पत्थर डूब जाता है।
- **पारदर्शिता:**
- - **पारदर्शी:** वे पदार्थ जिनसे वस्तुएँ स्पष्ट रूप से देखी जा सकती हैं। उदा: कांच, पानी।
- - **अपारदर्शी:** वे पदार्थ जिनसे आप देख नहीं सकते। उदा: लकड़ी, गत्ता।
- - **पारभासी:** वे पदार्थ जिनसे वस्तुएँ देखी जा सकती हैं, लेकिन स्पष्ट रूप से नहीं। उदा: बटर पेपर।
`
    }
},
'separation-of-substances': {
    en: {
      title: 'Chapter 5: Separation of Substances',
      content: `### Why do we separate substances?
- To remove impurities or harmful components.
- To separate two different but useful components.
- To obtain a pure sample of a substance.

### Methods of Separation
- **Handpicking:** This method can be used for separating slightly larger sized impurities like pieces of dirt, stone, and husk from wheat, rice or pulses.
- **Threshing:** The process that is used to separate grain from stalks etc.
- **Winnowing:** This method is used to separate heavier and lighter components of a mixture by wind or by blowing air.
- **Sieving:** Sieving is used when components of a mixture have different sizes. A sieve with suitable pore size is used.
- **Sedimentation, Decantation and Filtration:**
- - **Sedimentation:** When the heavier component in a mixture settles after water is added to it, the process is called sedimentation.
- - **Decantation:** When the water (along with the dust) is removed, the process is called decantation.
- - **Filtration:** The process of separating insoluble solid particles from a liquid by passing it through a filter.
- **Evaporation:** The process of conversion of water into its vapour is called evaporation. This can be used to separate a solid dissolved in a liquid.
- **Condensation:** The process of conversion of water vapour into its liquid form is called condensation.
`
    },
    hi: {
      title: 'अध्याय 5: पदार्थों का पृथक्करण',
      content: `### हम पदार्थों को क्यों अलग करते हैं?
- अशुद्धियों या हानिकारक घटकों को हटाने के लिए।
- दो अलग-अलग लेकिन उपयोगी घटकों को अलग करने के लिए।
- किसी पदार्थ का शुद्ध नमूना प्राप्त करने के लिए।

### पृथक्करण की विधियाँ
- **हस्तचयन:** इस विधि का उपयोग गेहूं, चावल या दालों से गंदगी, पत्थर और भूसी जैसे थोड़े बड़े आकार की अशुद्धियों को अलग करने के लिए किया जा सकता है।
- **थ्रेशिंग:** वह प्रक्रिया जिसका उपयोग अनाज को डंठल आदि से अलग करने के लिए किया जाता है।
- **निष्पावन:** इस विधि का उपयोग हवा या बहती हवा द्वारा मिश्रण के भारी और हल्के घटकों को अलग करने के लिए किया जाता है।
- **चालन:** चालन का उपयोग तब किया जाता है जब मिश्रण के घटकों के आकार अलग-अलग होते हैं। उपयुक्त छिद्र आकार की छलनी का उपयोग किया जाता है।
- **अवसादन, निस्तारण और निस्यंदन:**
- - **अवसादन:** जब किसी मिश्रण में भारी घटक पानी मिलाने के बाद नीचे बैठ जाता है, तो इस प्रक्रिया को अवसादन कहते हैं।
- - **निस्तारण:** जब पानी (धूल के साथ) को हटा दिया जाता है, तो इस प्रक्रिया को निस्तारण कहते हैं।
- - **निस्यंदन:** एक फिल्टर से गुजारकर एक तरल से अघुलनशील ठोस कणों को अलग करने की प्रक्रिया।
- **वाष्पीकरण:** पानी के वाष्प में बदलने की प्रक्रिया को वाष्पीकरण कहते हैं। इसका उपयोग किसी तरल में घुले ठोस को अलग करने के लिए किया जा सकता है।
- **संघनन:** जल वाष्प के उसके तरल रूप में बदलने की प्रक्रिया को संघनन कहते हैं।
`
    }
},
'changes-around-us': {
    en: {
      title: 'Chapter 6: Changes Around Us',
      content: `### Can all changes be reversed?
- **Reversible Changes:** Changes that can be reversed to bring back the original substance.
- - **Example:** Melting of ice into water. Water can be frozen back to ice. Folding a paper.
- **Irreversible Changes:** Changes that cannot be reversed.
- - **Example:** Burning of paper. Cooking of food. Growth of a plant.

### Could there be other ways to bring a change?
- **Expansion and Contraction:**
- - **Expansion:** The increase in size of an object on heating.
- - **Contraction:** The decrease in size of an object on cooling.
- - This property is used in fixing a metal rim on a wooden wheel. The metal rim is made slightly smaller than the wooden wheel. On heating, the rim expands and fits onto the wheel. On cooling, it contracts and fits tightly.
- **Melting:** The process in which a solid changes into a liquid on heating.
- **Evaporation:** The process in which a liquid changes into a gas.
`
    },
    hi: {
      title: 'अध्याय 6: हमारे चारों ओर के परिवर्तन',
      content: `### क्या सभी परिवर्तन उत्क्रमित किए जा सकते हैं?
- **उत्क्रमणीय परिवर्तन:** वे परिवर्तन जिन्हें मूल पदार्थ को वापस लाने के लिए उत्क्रमित किया जा सकता है।
- - **उदाहरण:** बर्फ का पानी में पिघलना। पानी को वापस बर्फ में जमाया जा सकता है। कागज को मोड़ना।
- **अनुत्क्रमणीय परिवर्तन:** वे परिवर्तन जिन्हें उत्क्रमित नहीं किया जा सकता है।
- - **उदाहरण:** कागज का जलना। भोजन का पकना। एक पौधे की वृद्धि।

### क्या परिवर्तन लाने के अन्य तरीके हो सकते हैं?
- **प्रसार और संकुचन:**
- - **प्रसार:** गर्म करने पर किसी वस्तु के आकार में वृद्धि।
- - **संकुचन:** ठंडा करने पर किसी वस्तु के आकार में कमी।
- - इस गुण का उपयोग लकड़ी के पहिये पर धातु का रिम लगाने में किया जाता है। धातु का रिम लकड़ी के पहिये से थोड़ा छोटा बनाया जाता है। गर्म करने पर, रिम फैलता है और पहिये पर फिट हो जाता है। ठंडा होने पर, यह सिकुड़ता है और कसकर फिट हो जाता है।
- **गलन:** वह प्रक्रिया जिसमें कोई ठोस गर्म करने पर द्रव में बदल जाता है।
- **वाष्पीकरण:** वह प्रक्रिया जिसमें कोई द्रव गैस में बदल जाता है।
`
    }
},
'getting-to-know-plants': {
    en: {
      title: 'Chapter 7: Getting to Know Plants',
      content: `### Herbs, Shrubs and Trees
- **Herbs:** Plants with green and tender stems. They are usually short and may not have many branches.
- **Shrubs:** Some plants have the stem branching out near the base. The stem is hard but not very thick.
- **Trees:** Some plants are very tall and have a hard and thick brown stem. The stems have branches in the upper part, much above the ground.

### Stem and Leaf
- **Stem:** Conducts water from roots to the leaves and other parts and food from leaves to other parts of the plant.
- **Leaf:**
- - **Petiole:** The part of a leaf by which it is attached to the stem.
- - **Lamina:** The broad, green part of the leaf.
- - **Veins:** Lines on the leaf.
- - **Midrib:** A thick vein in the middle of the leaf.
- - **Transpiration:** The process by which water comes out of leaves in the form of vapour.
- - **Photosynthesis:** The process by which leaves prepare their food in the presence of sunlight using carbon dioxide and water.

### Root
- **Functions:** Anchor the plant to the soil, absorb water and minerals from the soil.
- **Types of Roots:**
- - **Tap Root:** A main root from which smaller roots, called lateral roots, arise. Ex: Carrot, Radish.
- - **Fibrous Root:** All roots seem similar and there is no main root. Ex: Wheat, Rice.

### Flower
- **Parts of a Flower:** Sepals, Petals, Stamens, and Pistil.
- - **Stamens:** The male part of the flower. It has an anther and a filament.
- - **Pistil:** The innermost part of a flower. It has stigma, style, and ovary. The ovary contains ovules.
`
    },
    hi: {
      title: 'अध्याय 7: पौधों को जानिए',
      content: `### शाक, झाड़ी और वृक्ष
- **शाक:** हरे और कोमल तने वाले पौधे। वे आमतौर पर छोटे होते हैं और उनमें कई शाखाएँ नहीं हो सकती हैं।
- **झाड़ी:** कुछ पौधों में तना आधार के पास से शाखित होता है। तना कठोर होता है लेकिन बहुत मोटा नहीं होता।
- **वृक्ष:** कुछ पौधे बहुत ऊँचे होते हैं और उनका तना कठोर और मोटा भूरा होता है। तनों में ऊपरी भाग में, जमीन से बहुत ऊपर शाखाएँ होती हैं।

### तना और पत्ती
- **तना:** जड़ों से पत्तियों और अन्य भागों तक पानी और पत्तियों से पौधे के अन्य भागों तक भोजन पहुँचाता है।
- **पत्ती:**
- - **पर्णवृंत:** पत्ती का वह भाग जिससे वह तने से जुड़ी होती है।
- - **पटल:** पत्ती का चौड़ा, हरा भाग।
- - **शिराएँ:** पत्ती पर रेखाएँ।
- - **मध्यशिरा:** पत्ती के बीच में एक मोटी शिरा।
- - **वाष्पोत्सर्जन:** वह प्रक्रिया जिससे पानी वाष्प के रूप में पत्तियों से बाहर निकलता है।
- - **प्रकाश संश्लेषण:** वह प्रक्रिया जिससे पत्तियाँ सूर्य के प्रकाश की उपस्थिति में कार्बन डाइऑक्साइड और पानी का उपयोग करके अपना भोजन तैयार करती हैं।

### जड़
- **कार्य:** पौधे को मिट्टी में स्थिर रखना, मिट्टी से पानी और खनिजों को अवशोषित करना।
- **जड़ों के प्रकार:**
- - **मूसला जड़:** एक मुख्य जड़ जिससे छोटी जड़ें निकलती हैं, जिन्हें पार्श्व जड़ें कहते हैं। उदा: गाजर, मूली।
- - **झकड़ा जड़:** सभी जड़ें समान दिखाई देती हैं और कोई मुख्य जड़ नहीं होती है। उदा: गेहूँ, चावल।

### फूल
- **फूल के भाग:** बाह्यदल, पंखुड़ियाँ, पुंकेसर और स्त्रीकेसर।
- - **पुंकेसर:** फूल का नर भाग। इसमें परागकोश और तंतु होता है।
- - **स्त्रीकेसर:** फूल का सबसे भीतरी भाग। इसमें वर्तिकाग्र, वर्तिका और अंडाशय होता है। अंडाशय में बीजांड होते हैं।
`
    }
},
'body-movements': {
    en: {
      title: 'Chapter 8: Body Movements',
      content: `### Human Body and its Movements
- **Joints:** The places where two parts of our body seem to be joined together.
- **Ball and Socket Joint:** Allows movement in all directions. Found in the shoulder and hip.
- **Pivotal Joint:** Allows the head to move forwards and backwards, and turn to the right and left. Found where our neck joins the head.
- **Hinge Joint:** Allows only back-and-forth movements. Found in the elbow and knee.
- **Fixed Joint:** The bones cannot move at these joints. Found in the skull.

### Skeleton
- **Skeleton:** The framework of bones in our body which gives shape and support.
- **Rib Cage:** The ribs join the chest bone and the backbone together to form a box. It protects the heart and lungs.
- **Backbone:** Made up of many small bones called vertebrae. It protects the spinal cord.
- **Shoulder Bones:** Formed by the collar bone and the shoulder blade.
- **Pelvic Bones:** They enclose the portion of your body below the stomach.
- **Skull:** Protects the brain.
- **Cartilage:** Additional parts of the skeleton that are not as hard as bones and can be bent. Found in the ear and nose.

### Gait of Animals
- **Earthworm:** Moves by alternate expansion and contraction of the body using muscles. Tiny bristles on the underside of the body help in gripping the ground.
- **Snail:** Moves with the help of a muscular foot.
- **Cockroach:** Can walk, climb, and fly. It has three pairs of legs and two pairs of wings.
- **Birds:** Fly in the air and walk on the ground. Their bones are hollow and light.
- **Fish:** Has a streamlined body. Moves by forming loops on alternate sides of the body with the help of fins.
- **Snakes:** Have a long backbone and many thin muscles. They slither on the ground in loops.
`
    },
    hi: {
      title: 'अध्याय 8: शरीर में गति',
      content: `### मानव शरीर और उसकी गतियाँ
- **जोड़:** वे स्थान जहाँ हमारे शरीर के दो हिस्से एक साथ जुड़े हुए प्रतीत होते हैं।
- **कंदुक-खल्लिका संधि:** सभी दिशाओं में गति की अनुमति देता है। कंधे और कूल्हे में पाया जाता है।
- **धुराग्र संधि:** सिर को आगे और पीछे ले जाने और दाएं और बाएं मुड़ने की अनुमति देता है। जहाँ हमारी गर्दन सिर से जुड़ती है वहाँ पाया जाता है।
- **हिंज संधि:** केवल आगे-पीछे की गति की अनुमति देता है। कोहनी और घुटने में पाया जाता है।
- **अचल संधि:** इन जोड़ों पर हड्डियाँ हिल नहीं सकतीं। खोपड़ी में पाया जाता है।

### कंकाल
- **कंकाल:** हमारे शरीर में हड्डियों का ढांचा जो आकार और सहारा देता है।
- **पसली पिंजर:** पसलियाँ छाती की हड्डी और रीढ़ की हड्डी से मिलकर एक बक्सा बनाती हैं। यह हृदय और फेफड़ों की रक्षा करता है।
- **रीढ़ की हड्डी:** कई छोटी हड्डियों से बनी होती है जिन्हें कशेरुका कहते हैं। यह मेरुरज्जु की रक्षा करती है।
- **कंधे की हड्डियाँ:** कॉलर बोन और शोल्डर ब्लेड से बनती हैं।
- **श्रोणि अस्थियाँ:** वे आपके पेट के नीचे के हिस्से को घेरती हैं।
- **खोपड़ी:** मस्तिष्क की रक्षा करती है।
- **उपास्थि:** कंकाल के अतिरिक्त भाग जो हड्डियों जितने कठोर नहीं होते और जिन्हें मोड़ा जा सकता है। कान और नाक में पाया जाता है।

### जंतुओं की चाल
- **केंचुआ:** मांसपेशियों का उपयोग करके शरीर के वैकल्पिक विस्तार और संकुचन द्वारा चलता है। शरीर के नीचे की तरफ छोटे-छोटे शूक जमीन को पकड़ने में मदद करते हैं।
- **घोंघा:** एक पेशीय पाद की मदद से चलता है।
- **तिलचट्टा:** चल, चढ़ और उड़ सकता है। इसके तीन जोड़ी पैर और दो जोड़ी पंख होते हैं।
- **पक्षी:** हवा में उड़ते हैं और जमीन पर चलते हैं। उनकी हड्डियाँ खोखली और हल्की होती हैं।
- **मछली:** इसका शरीर धारा रेखीय होता है। पंखों की मदद से शरीर के वैकल्पिक पक्षों पर लूप बनाकर चलती है।
- **साँप:** इनकी एक लंबी रीढ़ की हड्डी और कई पतली मांसपेशियाँ होती हैं। वे लूप में जमीन पर सरकते हैं।
`
    }
},
'the-living-organisms-and-their-surroundings': {
    en: {
      title: 'Chapter 9: The Living Organisms and Their Surroundings',
      content: `### Habitat and Adaptation
- **Habitat:** The surroundings where an organism lives. It provides food, water, air, shelter, and other needs.
- **Adaptation:** The presence of specific features and habits which enable an organism to live naturally in a place.

### A Journey Through Different Habitats
- **Terrestrial Habitats:** The plants and animals that live on land.
- - **Deserts:** Camels have long legs to keep their bodies away from the hot sand. They excrete small amounts of urine, their dung is dry and they do not sweat. Desert plants lose very little water through transpiration.
- - **Mountain Regions:** Trees are normally cone-shaped with sloping branches. Animals have thick fur to protect them from cold.
- - **Grasslands:** Lions have eyes in front of their face which allows them to have a correct idea about the location of their prey. A deer has strong teeth for chewing hard plant stems.
- **Aquatic Habitats:**
- - **Oceans:** Most organisms have streamlined bodies to help them move easily in water.
- - **Ponds and Lakes:** Plants have roots that are much reduced in size. Frogs can live both on land and in water.

### Characteristics of Organisms
- **Do all organisms need food?** Yes, food gives organisms the energy they need to grow and for other life processes.
- **Do all organisms show growth?** Yes, all living things grow.
- **Do all organisms respire?** Respiration is necessary for all living organisms. It is through respiration that the body finally obtains energy from the food it takes.
- **Do all organisms respond to stimuli?** Changes in our surroundings that make us respond to them are called stimuli.
- **Living organisms and excretion:** The process of getting rid of wastes by the living organisms is known as excretion.
- **Do all organisms reproduce their own kind?** The process by which living things produce more of their own kind is called reproduction.
- **Do all organisms move?** Most living things move from one place to another. Plants are generally anchored in soil so they do not move.
`
    },
    hi: {
      title: 'अध्याय 9: सजीव एवं उनका परिवेश',
      content: `### आवास एवं अनुकूलन
- **आवास:** वह परिवेश जिसमें कोई जीव रहता है। यह भोजन, पानी, हवा, आश्रय और अन्य जरूरतें प्रदान करता है।
- **अनुकूलन:** विशिष्ट विशेषताओं और आदतों की उपस्थिति जो किसी जीव को किसी स्थान पर स्वाभाविक रूप से रहने में सक्षम बनाती है।

### विभिन्न आवासों की यात्रा
- **स्थलीय आवास:** वे पौधे और जानवर जो जमीन पर रहते हैं।
- - **मरुस्थल:** ऊंटों के लंबे पैर होते हैं जो उनके शरीर को गर्म रेत से दूर रखते हैं। वे कम मात्रा में मूत्र उत्सर्जित करते हैं, उनका गोबर सूखा होता है और उन्हें पसीना नहीं आता है। मरुस्थलीय पौधे वाष्पोत्सर्जन के माध्यम से बहुत कम पानी खोते हैं।
- - **पर्वतीय क्षेत्र:** पेड़ सामान्य रूप से ढलान वाली शाखाओं के साथ शंकु के आकार के होते हैं। जानवरों को ठंड से बचाने के लिए मोटी खाल होती है।
- - **घास के मैदान:** शेरों की आंखें उनके चेहरे के सामने होती हैं जो उन्हें अपने शिकार के स्थान के बारे में सही विचार रखने की अनुमति देती हैं। एक हिरण के पास कठोर पौधों के तनों को चबाने के लिए मजबूत दांत होते हैं।
- **जलीय आवास:**
- - **महासागर:** अधिकांश जीवों के शरीर सुव्यवस्थित होते हैं ताकि उन्हें पानी में आसानी से चलने में मदद मिल सके।
- - **तालाब और झीलें:** पौधों की जड़ें आकार में बहुत कम हो जाती हैं। मेंढक जमीन और पानी दोनों में रह सकते हैं।

### सजीवों के लक्षण
- **क्या सभी जीवों को भोजन की आवश्यकता होती है?** हां, भोजन जीवों को वृद्धि और अन्य जीवन प्रक्रियाओं के लिए आवश्यक ऊर्जा देता है।
- **क्या सभी जीव वृद्धि दर्शाते हैं?** हां, सभी सजीव वस्तुएं बढ़ती हैं।
- **क्या सभी जीव श्वसन करते हैं?** श्वसन सभी सजीव जीवों के लिए आवश्यक है। श्वसन के माध्यम से ही शरीर अंततः अपने द्वारा लिए गए भोजन से ऊर्जा प्राप्त करता है।
- **क्या सभी जीव उद्दीपनों के प्रति अनुक्रिया करते हैं?** हमारे परिवेश में परिवर्तन जो हमें उनके प्रति अनुक्रिया करने पर मजबूर करते हैं, उद्दीपन कहलाते हैं।
- **सजीव जीव और उत्सर्जन:** सजीव जीवों द्वारा अपशिष्टों से छुटकारा पाने की प्रक्रिया को उत्सर्जन के रूप में जाना जाता है।
- **क्या सभी जीव अपनी तरह का प्रजनन करते हैं?** वह प्रक्रिया जिसके द्वारा सजीव वस्तुएं अपनी तरह का अधिक उत्पादन करती हैं, प्रजनन कहलाती है।
- **क्या सभी जीव गति करते हैं?** अधिकांश सजीव वस्तुएं एक स्थान से दूसरे स्थान पर जाती हैं। पौधे आम तौर पर मिट्टी में स्थिर होते हैं इसलिए वे हिलते नहीं हैं।
`
    }
},
'motion-and-measurement-of-distances': {
    en: {
      title: 'Chapter 10: Motion and Measurement of Distances',
      content: `### Story of Transport
- Early humans moved on foot. For transport across water, boats were used. The invention of the wheel made a great change in modes of transport.

### Measurement
- **Measurement:** The comparison of an unknown quantity with some known quantity. This known fixed quantity is called a unit.
- **Standard Units of Measurement:** For the sake of uniformity, scientists all over the world have accepted a set of standard units of measurement. This system of units is now known as the International System of Units (SI units).
- - The SI unit of length is a metre (m).
- - 1 metre = 100 centimetres (cm).
- - 1 centimetre = 10 millimetres (mm).
- - 1 kilometre (km) = 1000 metres (m).

### Correct Measurement of Length
- Use a suitable device (like a ruler or measuring tape).
- Place the scale in contact with the object along its length.
- Your eye must be exactly in front of the point where the measurement is to be taken.

### Motion
- **Rest:** An object is at rest if its position does not change with time.
- **Motion:** An object is in motion if its position changes with time.
- **Types of Motion:**
- - **Rectilinear Motion:** Motion in a straight line.
- - **Circular Motion:** Motion of an object along a circular path.
- - **Periodic Motion:** Motion that repeats itself after a certain period of time. Ex: Motion of a pendulum.
`
    },
    hi: {
      title: 'अध्याय 10: गति एवं दूरियों का मापन',
      content: `### परिवहन की कहानी
- आदिमानव पैदल चलते थे। पानी के पार परिवहन के लिए, नावों का उपयोग किया जाता था। पहिये के आविष्कार ने परिवहन के साधनों में एक बड़ा बदलाव किया।

### मापन
- **मापन:** किसी अज्ञात राशि की किसी ज्ञात राशि से तुलना। इस ज्ञात निश्चित राशि को इकाई कहा जाता है।
- **मापन की मानक इकाइयाँ:** एकरूपता के लिए, दुनिया भर के वैज्ञानिकों ने मापन की मानक इकाइयों का एक सेट स्वीकार किया है। इकाइयों की इस प्रणाली को अब अंतर्राष्ट्रीय मात्रक प्रणाली (SI मात्रक) के रूप में जाना जाता है।
- - लंबाई का SI मात्रक मीटर (m) है।
- - 1 मीटर = 100 सेंटीमीटर (cm)।
- - 1 सेंटीमीटर = 10 मिलीमीटर (mm)।
- - 1 किलोमीटर (km) = 1000 मीटर (m)।

### लंबाई का सही मापन
- एक उपयुक्त उपकरण (जैसे रूलर या मापने का टेप) का उपयोग करें।
- पैमाने को वस्तु की लंबाई के साथ संपर्क में रखें।
- आपकी आँख ठीक उस बिंदु के सामने होनी चाहिए जहाँ से माप लिया जाना है।

### गति
- **विराम:** कोई वस्तु विराम में होती है यदि समय के साथ उसकी स्थिति नहीं बदलती है।
- **गति:** कोई वस्तु गति में होती है यदि समय के साथ उसकी स्थिति बदलती है।
- **गति के प्रकार:**
- - **सरल रेखीय गति:** एक सीधी रेखा में गति।
- - **वृत्तीय गति:** एक वृत्ताकार पथ के साथ किसी वस्तु की गति।
- - **आवर्ती गति:** वह गति जो एक निश्चित समय अवधि के बाद खुद को दोहराती है। उदा: एक लोलक की गति।
`
    }
},
'light-shadows-and-reflections': {
    en: {
      title: 'Chapter 11: Light, Shadows and Reflections',
      content: `### Luminous and Non-Luminous Objects
- **Luminous Objects:** Objects that give out or emit their own light. Ex: Sun, torch, candle.
- **Non-Luminous Objects:** Objects that do not emit their own light but are visible when light from a luminous object falls on them. Ex: Moon, chair, book.

### Transparent, Opaque and Translucent Objects
- **Transparent:** If you are able to see clearly through an object, it is allowing light to pass through it and is transparent.
- **Opaque:** If you cannot see through an object at all, it is an opaque object.
- **Translucent:** Objects that allow some light to pass through them.

### Shadows
- A shadow is formed when an opaque object comes in the path of light.
- A shadow needs a screen where it is formed.
- The colour of the shadow is always black, irrespective of the colour of the object.

### Pinhole Camera
- A simple camera without a lens but with a tiny aperture (the pinhole).
- It forms an inverted image of an object. The image is real.

### Mirrors and Reflections
- **Reflection:** The bouncing back of light from a shiny surface like a mirror.
- **Image:** A reflection gives a clear image. The image formed by a plane mirror is erect, of the same size as the object, and is formed at the same distance behind the mirror as the object is in front of it.
`
    },
    hi: {
      title: 'अध्याय 11: प्रकाश – छायाएँ एवं परावर्तन',
      content: `### दीप्त और अदीप्त वस्तुएँ
- **दीप्त वस्तुएँ:** वे वस्तुएँ जो अपना प्रकाश स्वयं उत्सर्जित करती हैं। उदा: सूर्य, टॉर्च, मोमबत्ती।
- **अदीप्त वस्तुएँ:** वे वस्तुएँ जो अपना प्रकाश स्वयं उत्सर्जित नहीं करती हैं, लेकिन जब किसी दीप्त वस्तु का प्रकाश उन पर पड़ता है तो वे दिखाई देती हैं। उदा: चंद्रमा, कुर्सी, किताब।

### पारदर्शी, अपारदर्शी और पारभासी वस्तुएँ
- **पारदर्शी:** यदि आप किसी वस्तु के आर-पार स्पष्ट रूप से देख सकते हैं, तो वह प्रकाश को अपने में से गुजरने दे रही है और पारदर्शी है।
- **अपारदर्शी:** यदि आप किसी वस्तु के आर-पार बिल्कुल नहीं देख सकते हैं, तो वह एक अपारदर्शी वस्तु है।
- **पारभासी:** वे वस्तुएँ जो कुछ प्रकाश को अपने में से गुजरने देती हैं।

### छायाएँ
- छाया तब बनती है जब कोई अपारदर्शी वस्तु प्रकाश के मार्ग में आ जाती है।
- छाया के लिए एक पर्दे की आवश्यकता होती है जहाँ वह बनती है।
- वस्तु के रंग के बावजूद, छाया का रंग हमेशा काला होता है।

### सूचीछिद्र कैमरा
- एक सरल कैमरा जिसमें लेंस नहीं होता लेकिन एक छोटा छिद्र (पिनहोल) होता है।
- यह किसी वस्तु का उल्टा प्रतिबिंब बनाता है। प्रतिबिंब वास्तविक होता है।

### दर्पण और परावर्तन
- **परावर्तन:** दर्पण जैसी चमकदार सतह से प्रकाश का वापस उछलना।
- **प्रतिबिंब:** परावर्तन एक स्पष्ट प्रतिबिंब देता है। समतल दर्पण द्वारा बनाया गया प्रतिबिंब सीधा, वस्तु के समान आकार का होता है, और दर्पण के पीछे उतनी ही दूरी पर बनता है जितनी दूरी पर वस्तु उसके सामने होती है।
`
    }
},
'electricity-and-circuits': {
    en: {
      title: 'Chapter 12: Electricity and Circuits',
      content: `### Electric Cell and Bulb
- **Electric Cell:** A source of electricity. It has two terminals: a positive (+) terminal and a negative (-) terminal.
- **Electric Bulb:** Has a filament that is connected to two terminals. The bulb glows when electricity passes through it.

### Electric Circuit
- **Electric Circuit:** A closed path for electricity to flow.
- An electric circuit consists of an electric cell, a bulb, and wires.
- The bulb glows only when the circuit is complete or closed.

### Electric Switch
- **Switch:** A simple device that is used to either break the electric circuit or to complete it.
- When the switch is 'ON', the circuit is closed and current flows.
- When the switch is 'OFF', the circuit is open and current does not flow.

### Conductors and Insulators
- **Conductors:** Materials that allow electric current to pass through them.
- - **Examples:** Metals like copper, aluminum, iron.
- **Insulators:** Materials that do not allow electric current to pass through them.
- - **Examples:** Rubber, plastic, wood.
`
    },
    hi: {
      title: 'अध्याय 12: विद्युत् तथा परिपथ',
      content: `### विद्युत् सेल और बल्ब
- **विद्युत् सेल:** विद्युत् का एक स्रोत। इसके दो टर्मिनल होते हैं: एक धनात्मक (+) टर्मिनल और एक ऋणात्मक (-) टर्मिनल।
- **विद्युत् बल्ब:** इसमें एक फिलामेंट होता है जो दो टर्मिनलों से जुड़ा होता है। जब इसमें से विद्युत् प्रवाहित होती है तो बल्ब जल उठता है।

### विद्युत् परिपथ
- **विद्युत् परिपथ:** विद्युत् के प्रवाहित होने का एक बंद पथ।
- एक विद्युत् परिपथ में एक विद्युत् सेल, एक बल्ब और तार होते हैं।
- बल्ब तभी जलता है जब परिपथ पूरा या बंद होता है।

### विद्युत् स्विच
- **स्विच:** एक सरल उपकरण जिसका उपयोग या तो विद्युत् परिपथ को तोड़ने या उसे पूरा करने के लिए किया जाता है।
- जब स्विच 'ON' होता है, तो परिपथ बंद हो जाता है और धारा प्रवाहित होती है।
- जब स्विच 'OFF' होता है, तो परिपथ खुला होता है और धारा प्रवाहित नहीं होती है।

### चालक और विद्युतरोधी
- **चालक:** वे पदार्थ जो अपने में से विद्युत् धारा को प्रवाहित होने देते हैं।
- - **उदाहरण:** तांबा, एल्यूमीनियम, लोहा जैसी धातुएँ।
- **विद्युतरोधी:** वे पदार्थ जो अपने में से विद्युत् धारा को प्रवाहित नहीं होने देते हैं।
- - **उदाहरण:** रबर, प्लास्टिक, लकड़ी।
`
    }
},
'what-where-how-and-when': {
    en: {
        title: 'Chapter 1: What, Where, How and When?',
        content: `### Finding out what happened
- **Sources of the Past:** Archaeologists and historians study several sources to tell us about the past. These sources include manuscripts, inscriptions, and archaeology (which includes exploring and excavating to find tools, weapons, pots, buildings, etc.).
- **Manuscripts:** These were usually written on palm leaf or on the specially prepared bark of a tree known as the birch. They dealt with all kinds of subjects: religious beliefs and practices, the lives of kings, medicine and science.
- **Inscriptions:** These are writings on relatively hard surfaces such as stone or metal. Kings often got their orders inscribed so that people could see, read and obey them.

### What do dates mean?
- Years are generally counted from the date assigned to the birth of Jesus Christ.
- **BC (Before Christ):** Refers to dates before the birth of Christ. Years are counted backwards.
- **AD (Anno Domini):** Meaning 'in the year of the Lord'. Refers to dates after the birth of Christ.
- **CE (Common Era) and BCE (Before Common Era):** Sometimes used instead of AD and BC.
`
    },
    hi: {
        title: 'अध्याय 1: क्या, कहाँ, कैसे और कब?',
        content: `### क्या हुआ था यह पता लगाना
- **अतीत के स्रोत:** पुरातत्वविद और इतिहासकार अतीत के बारे में हमें बताने के लिए कई स्रोतों का अध्ययन करते हैं। इन स्रोतों में पांडुलिपियाँ, शिलालेख और पुरातत्व (जिसमें उपकरण, हथियार, बर्तन, भवन आदि खोजने के लिए अन्वेषण और खुदाई शामिल है) शामिल हैं।
- **पांडुलिपियाँ:** ये आमतौर पर ताड़ के पत्ते पर या भोज नामक पेड़ की विशेष रूप से तैयार छाल पर लिखी जाती थीं। वे सभी प्रकार के विषयों से संबंधित थीं: धार्मिक विश्वास और प्रथाएं, राजाओं का जीवन, चिकित्सा और विज्ञान।
- **शिलालेख:** ये पत्थर या धातु जैसी अपेक्षाकृत कठोर सतहों पर लिखे गए लेख हैं। राजा अक्सर अपने आदेशों को अंकित करवाते थे ताकि लोग उन्हें देख, पढ़ और उनका पालन कर सकें।

### तिथियों का क्या अर्थ है?
- वर्षों की गणना आम तौर पर ईसा मसीह के जन्म को सौंपी गई तिथि से की जाती है।
- **ईसा पूर्व (Before Christ):** ईसा मसीह के जन्म से पहले की तारीखों को संदर्भित करता है। वर्षों की गणना पीछे की ओर की जाती है।
- **ईस्वी (Anno Domini):** जिसका अर्थ है 'प्रभु के वर्ष में'। ईसा मसीह के जन्म के बाद की तारीखों को संदर्भित करता है।
- **सा.सं. (Common Era) और सा.सं.पू. (Before Common Era):** कभी-कभी ईस्वी और ईसा पूर्व के बजाय उपयोग किया जाता है।
`
    }
},
'from-hunting-gathering-to-growing-food': {
    en: {
        title: 'Chapter 2: From Hunting-Gathering to Growing Food',
        content: `### The earliest people: why were they on the move?
- People who lived in the subcontinent as early as two million years ago are described as hunter-gatherers.
- They hunted wild animals, caught fish and birds, gathered fruits, roots, nuts, seeds, leaves, stalks and eggs.
- They moved from place to place in search of food, water, and shelter.

### A changing environment
- Around 12,000 years ago, there were major changes in the climate of the world, with a shift to relatively warm conditions.
- This led to the development of grasslands in many areas. This also led to an increase in the number of deer, antelope, goat, sheep and cattle, i.e. animals that survived on grass.

### The beginning of farming and herding
- People observed plants and how they grew. This may have led them to think about growing plants on their own. In this way people became farmers.
- People also tamed animals by leaving food for them near their shelters. The first animal to be tamed was the wild ancestor of the dog. Later, people encouraged animals that were relatively gentle to come near the camps where they lived. These animals such as sheep, goat, cattle and also the pig lived in herds and most of them ate grass. People protected these animals from attacks by other wild animals. This is how they became herders.
`
    },
    hi: {
        title: 'अध्याय 2: आखेट-संग्रह से भोजन उत्पादन तक',
        content: `### आरंभिक मानव: वे इधर-उधर क्यों घूमते थे?
- जो लोग उपमहाद्वीप में दो मिलियन वर्ष पहले रहते थे, उन्हें शिकारी-संग्राहक के रूप में वर्णित किया गया है।
- वे जंगली जानवरों का शिकार करते थे, मछली और पक्षियों को पकड़ते थे, फल, जड़ें, मेवे, बीज, पत्ते, डंठल और अंडे इकट्ठा करते थे।
- वे भोजन, पानी और आश्रय की तलाश में एक स्थान से दूसरे स्थान पर जाते थे।

### बदलता पर्यावरण
- लगभग 12,000 साल पहले, दुनिया की जलवायु में बड़े बदलाव हुए, अपेक्षाकृत गर्म परिस्थितियों की ओर बदलाव हुआ।
- इससे कई क्षेत्रों में घास के मैदानों का विकास हुआ। इससे हिरण, मृग, बकरी, भेड़ और मवेशियों की संख्या में भी वृद्धि हुई, यानी घास पर जीवित रहने वाले जानवर।

### खेती और पशुपालन की शुरुआत
- लोगों ने पौधों और वे कैसे उगते हैं, इसका अवलोकन किया। इससे उन्हें अपने दम पर पौधे उगाने के बारे में सोचने पर मजबूर किया होगा। इस तरह लोग किसान बन गए।
- लोगों ने अपने आश्रयों के पास जानवरों के लिए भोजन छोड़कर उन्हें पालतू भी बनाया। पालतू बनाया जाने वाला पहला जानवर कुत्ते का जंगली पूर्वज था। बाद में, लोगों ने उन जानवरों को प्रोत्साहित किया जो अपेक्षाकृत कोमल थे, वे उन शिविरों के पास आते थे जहाँ वे रहते थे। भेड़, बकरी, मवेशी और सूअर जैसे ये जानवर झुंड में रहते थे और उनमें से अधिकांश घास खाते थे। लोगों ने इन जानवरों को अन्य जंगली जानवरों के हमलों से बचाया। इस तरह वे पशुपालक बन गए।
`
    }
},
'in-the-earliest-cities': {
    en: {
        title: 'Chapter 3: In the Earliest Cities',
        content: `### The story of Harappa
- Harappan cities were discovered around 150 years ago in Punjab (present-day Pakistan).
- These cities developed about 4700 years ago.

### What was special about these cities?
- **City Structure:** Many of these cities were divided into two or more parts.
- - The part to the west was smaller but higher, described as the **citadel**.
- - The part to the east was larger but lower, called the **lower town**.
- - Walls of baked brick were built around each part.
- **Great Bath:** In Mohenjodaro, a very special tank, which archaeologists call the Great Bath, was built in the citadel area.
- **Fire Altars:** Cities like Kalibangan and Lothal had fire altars, where sacrifices may have been performed.
- **Storehouses:** Cities like Mohenjodaro, Harappa, and Lothal had elaborate storehouses.
- **Houses, drains and streets:** Houses were either one or two storeys high, with rooms built around a courtyard. Most houses had a separate bathing area, and some had wells to supply water. Cities had covered drains, laid out in straight lines.

### Life in the city
- **Rulers:** People who planned the construction of special buildings in the city.
- **Scribes:** People who knew how to write, who helped prepare the seals.
- **Crafts persons:** Men and women who made all kinds of things — either in their own homes, or in special workshops.
- **Seals:** Archaeologists have found seals with engravings of animals on them. The Harappans also made seals out of stone. These are generally rectangular and have an animal carved on them.

### New crafts in the city
- Most of the objects that have been found by archaeologists are made of stone, shell and metal, including copper, bronze, gold and silver.
- The Harappans also made pots with beautiful black designs.
- Cotton was probably grown at Mehrgarh from about 7000 years ago.
`
    },
    hi: {
        title: 'अध्याय 3: आरंभिक नगर',
        content: `### हड़प्पा की कहानी
- हड़प्पा के शहरों की खोज लगभग 150 साल पहले पंजाब (वर्तमान पाकिस्तान) में हुई थी।
- ये शहर लगभग 4700 साल पहले विकसित हुए थे।

### इन शहरों में क्या खास था?
- **शहर की संरचना:** इनमें से कई शहर दो या दो से अधिक भागों में विभाजित थे।
- - पश्चिम का भाग छोटा लेकिन ऊँचा था, जिसे **गढ़** कहा जाता है।
- - पूर्व का भाग बड़ा लेकिन निचला था, जिसे **निचला शहर** कहा जाता था।
- - प्रत्येक भाग के चारों ओर पकी हुई ईंट की दीवारें बनाई गई थीं।
- **महान स्नानागार:** मोहनजोदड़ो में, एक बहुत ही खास तालाब, जिसे पुरातत्वविद महान स्नानागार कहते हैं, गढ़ क्षेत्र में बनाया गया था।
- **अग्निकुंड:** कालीबंगन और लोथल जैसे शहरों में अग्निकुंड थे, जहाँ शायद यज्ञ किए जाते थे।
- **भंडार गृह:** मोहनजोदड़ो, हड़प्पा और लोथल जैसे शहरों में विस्तृत भंडार गृह थे।
- **घर, नाले और सड़कें:** घर या तो एक या दो मंजिला ऊँचे होते थे, जिनमें एक आंगन के चारों ओर कमरे बने होते थे। अधिकांश घरों में एक अलग स्नान क्षेत्र था, और कुछ में पानी की आपूर्ति के लिए कुएँ थे। शहरों में ढकी हुई नालियाँ थीं, जो सीधी रेखाओं में बिछाई गई थीं।

### शहर में जीवन
- **शासक:** वे लोग जिन्होंने शहर में विशेष भवनों के निर्माण की योजना बनाई।
- **लिपिक:** वे लोग जो लिखना जानते थे, जो मुहरें तैयार करने में मदद करते थे।
- **शिल्पकार:** पुरुष और महिलाएँ जो सभी प्रकार की चीजें बनाते थे - या तो अपने घरों में, या विशेष कार्यशालाओं में।
- **मुहरें:** पुरातत्वविदों को जानवरों की नक्काशी वाली मुहरें मिली हैं। हड़प्पावासियों ने पत्थर से भी मुहरें बनाईं। ये आम तौर पर आयताकार होती हैं और उन पर एक जानवर खुदा होता है।

### शहर में नए शिल्प
- पुरातत्वविदों द्वारा पाई गई अधिकांश वस्तुएं पत्थर, शंख और धातु से बनी हैं, जिनमें तांबा, कांसा, सोना और चांदी शामिल हैं।
- हड़प्पावासियों ने सुंदर काले डिजाइनों वाले बर्तन भी बनाए।
- कपास शायद मेहरगढ़ में लगभग 7000 साल पहले उगाया जाता था।
`
    }
},
'the-earth-in-the-solar-system': {
    en: {
        title: 'Chapter 1: The Earth in the Solar System',
        content: `### Celestial Bodies
- The sun, the moon and all those objects shining in the night sky are called celestial bodies.
- **Stars:** Some celestial bodies are very big and hot. They are made up of gases. They have their own heat and light, which they emit in large amounts.
- **Constellations:** Various patterns formed by different groups of stars. Ursa Major or Big Bear is one such constellation.

### The Solar System
- The sun, eight planets, satellites and some other celestial bodies known as asteroids and meteoroids form the solar system.
- **The Sun:** The sun is in the centre of the solar system. It is a huge and made up of extremely hot gases.
- **Planets:** There are eight planets in our solar system. In order of their distance from the sun, they are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus and Neptune.
- **The Earth:** The third nearest planet to the sun. It is a unique planet in the solar system because conditions favourable to support life are probably found only on the earth. It is also called a blue planet.
- **The Moon:** Our earth has only one satellite, that is, the moon. Its diameter is only one-quarter that of the earth.
- **Asteroids:** Tiny bodies which move around the sun. They are found between the orbits of Mars and Jupiter.
- **Meteoroids:** The small pieces of rocks which move around the sun.
`
    },
    hi: {
        title: 'अध्याय 1: सौरमंडल में पृथ्वी',
        content: `### खगोलीय पिंड
- सूर्य, चंद्रमा और वे सभी वस्तुएँ जो रात के आकाश में चमकती हैं, खगोलीय पिंड कहलाती हैं।
- **तारे:** कुछ खगोलीय पिंड बहुत बड़े और गर्म होते हैं। वे गैसों से बने होते हैं। उनकी अपनी ऊष्मा और प्रकाश होता है, जिसे वे बड़ी मात्रा में उत्सर्जित करते हैं।
- **नक्षत्रमंडल:** तारों के विभिन्न समूहों द्वारा बनाए गए विभिन्न पैटर्न। सप्तर्षि या बड़ा भालू एक ऐसा ही नक्षत्रमंडल है।

### सौर मंडल
- सूर्य, आठ ग्रह, उपग्रह और कुछ अन्य खगोलीय पिंड जिन्हें क्षुद्रग्रह और उल्कापिंड के रूप में जाना जाता है, सौर मंडल का निर्माण करते हैं।
- **सूर्य:** सूर्य सौर मंडल के केंद्र में है। यह विशाल है और अत्यधिक गर्म गैसों से बना है।
- **ग्रह:** हमारे सौर मंडल में आठ ग्रह हैं। सूर्य से उनकी दूरी के क्रम में, वे हैं: बुध, शुक्र, पृथ्वी, मंगल, बृहस्पति, शनि, यूरेनस और नेपच्यून।
- **पृथ्वी:** सूर्य का तीसरा निकटतम ग्रह। यह सौर मंडल में एक अनूठा ग्रह है क्योंकि जीवन का समर्थन करने के लिए अनुकूल परिस्थितियां शायद केवल पृथ्वी पर ही पाई जाती हैं। इसे नीला ग्रह भी कहा जाता है।
- **चंद्रमा:** हमारी पृथ्वी का केवल एक उपग्रह है, वह है चंद्रमा। इसका व्यास पृथ्वी के व्यास का केवल एक-चौथाई है।
- **क्षुद्रग्रह:** छोटे पिंड जो सूर्य के चारों ओर घूमते हैं। वे मंगल और बृहस्पति की कक्षाओं के बीच पाए जाते हैं।
- **उल्कापिंड:** चट्टानों के छोटे-छोटे टुकड़े जो सूर्य के चारों ओर घूमते हैं।
`
    }
},
'globe-latitudes-and-longitudes': {
    en: {
        title: 'Chapter 2: Globe: Latitudes and Longitudes',
        content: `### Globe and Axis
- **Globe:** A true model (miniature form) of the earth.
- **Axis:** An imaginary line passing through the centre of the Earth on which it rotates. The two points on the globe through which the needle passes are two poles – North Pole and South Pole.

### Latitudes
- **Equator:** An imaginary circular line that divides the globe into two equal parts. The northern half is known as the Northern Hemisphere and the southern half is the Southern Hemisphere.
- **Parallels of Latitudes:** All parallel circles from the equator up to the poles are called parallels of latitudes. Latitudes are measured in degrees.
- **Important Parallels of Latitude:**
- - Tropic of Cancer (23½° N)
- - Tropic of Capricorn (23½° S)
- - Arctic Circle at 66½° north of the equator.
- - Antarctic Circle at 66½° south of the equator.
- **Heat Zones of the Earth:**
- - **Torrid Zone:** Receives the maximum heat. Area between the Tropic of Cancer and the Tropic of Capricorn.
- - **Temperate Zones:** Have moderate temperatures. Areas between the Tropic of Cancer and the Arctic Circle in the Northern Hemisphere, and the Tropic of Capricorn and the Antarctic Circle in the Southern Hemisphere.
- - **Frigid Zones:** Very cold. Areas lying between the Arctic Circle and the North Pole, and the Antarctic Circle and the South Pole.

### Longitudes
- **Meridians of Longitude:** The lines of reference running from the North Pole to the South Pole. The distances between them are measured in degrees of longitude.
- **Prime Meridian:** The meridian which passes through Greenwich, where the British Royal Observatory is located. Its value is 0° longitude.
- **Longitude and Time:** Longitudes help us to calculate time. As the earth rotates from west to east, places east of Greenwich will be ahead of Greenwich time and those to the west will be behind it.
- **Standard Time:** The local time of places which are on different meridians are bound to differ. To maintain uniformity, the local time of some central meridian of a country is adopted as the standard time for the country. In India, the longitude of 82½° E is treated as the standard meridian.
`
    },
    hi: {
        title: 'अध्याय 2: ग्लोब: अक्षांश एवं देशांतर',
        content: `### ग्लोब और अक्ष
- **ग्लोब:** पृथ्वी का एक सच्चा मॉडल (लघु रूप)।
- **अक्ष:** पृथ्वी के केंद्र से गुजरने वाली एक काल्पनिक रेखा जिस पर वह घूमती है। ग्लोब पर दो बिंदु जिनसे सुई गुजरती है, वे दो ध्रुव हैं - उत्तरी ध्रुव और दक्षिणी ध्रुव।

### अक्षांश
- **विषुवत वृत्त:** एक काल्पनिक वृत्ताकार रेखा जो ग्लोब को दो बराबर भागों में विभाजित करती है। उत्तरी आधे भाग को उत्तरी गोलार्ध और दक्षिणी आधे भाग को दक्षिणी गोलार्ध के रूप में जाना जाता है।
- **अक्षांश के समांतर वृत्त:** विषुवत वृत्त से ध्रुवों तक के सभी समांतर वृत्तों को अक्षांश के समांतर वृत्त कहा जाता है। अक्षांशों को डिग्री में मापा जाता है।
- **महत्वपूर्ण अक्षांश समांतर रेखाएँ:**
- - कर्क रेखा (23½° उत्तर)
- - मकर रेखा (23½° दक्षिण)
- - आर्कटिक वृत्त विषुवत वृत्त के 66½° उत्तर में।
- - अंटार्कटिक वृत्त विषुवत वृत्त के 66½° दक्षिण में।
- **पृथ्वी के ताप कटिबंध:**
- - **उष्ण कटिबंध:** अधिकतम ऊष्मा प्राप्त करता है। कर्क रेखा और मकर रेखा के बीच का क्षेत्र।
- - **शीतोष्ण कटिबंध:** मध्यम तापमान होता है। उत्तरी गोलार्ध में कर्क रेखा और आर्कटिक वृत्त के बीच के क्षेत्र, और दक्षिणी गोलार्ध में मकर रेखा और अंटार्कटिक वृत्त के बीच के क्षेत्र।
- - **शीत कटिबंध:** बहुत ठंडा। आर्कटिक वृत्त और उत्तरी ध्रुव, और अंटार्कटिक वृत्त और दक्षिणी ध्रुव के बीच स्थित क्षेत्र।

### देशांतर
- **देशांतर के याम्योत्तर:** उत्तरी ध्रुव से दक्षिणी ध्रुव तक चलने वाली संदर्भ रेखाएँ। उनके बीच की दूरियों को देशांतर के डिग्री में मापा जाता है।
- **प्रमुख याम्योत्तर:** वह याम्योत्तर जो ग्रीनविच से होकर गुजरता है, जहाँ ब्रिटिश रॉयल वेधशाला स्थित है। इसका मान 0° देशांतर है।
- **देशांतर और समय:** देशांतर हमें समय की गणना करने में मदद करते हैं। चूंकि पृथ्वी पश्चिम से पूर्व की ओर घूमती है, ग्रीनविच के पूर्व के स्थान ग्रीनविच समय से आगे होंगे और पश्चिम के स्थान इससे पीछे होंगे।
- **मानक समय:** अलग-अलग याम्योत्तरों पर स्थित स्थानों का स्थानीय समय अलग-अलग होना तय है। एकरूपता बनाए रखने के लिए, किसी देश के कुछ केंद्रीय याम्योत्तर के स्थानीय समय को देश के लिए मानक समय के रूप में अपनाया जाता है। भारत में, 82½° पूर्व के देशांतर को मानक याम्योत्तर माना जाता है।
`
    }
},
'understanding-diversity': {
    en: {
        title: 'Chapter 1: Understanding Diversity',
        content: `### What is Diversity?
- Diversity means understanding that each individual is unique, and recognizing our individual differences.
- These can be along the dimensions of race, ethnicity, gender, sexual orientation, socio-economic status, age, physical abilities, religious beliefs, political beliefs, or other ideologies.

### Diversity in India
- India is a country of many diversities. We speak different languages, have various types of food, celebrate different festivals, practise different religions.
- **Factors influencing diversity:**
- - **Historical Factors:** The past of a region influences its diversity. For example, people traveled to new lands for trade, to settle, or because of famines and wars. When they settled, their cultures mixed with the local culture, creating new, diverse cultures.
- - **Geographical Factors:** The geography of a place influences what people do for a living, what they eat, and what they wear. For example, people in coastal areas are likely to be involved in fishing and eat more fish.

### Unity in Diversity
- Despite the vast diversity, there is an underlying unity that binds all Indians.
- This phrase was coined by Jawaharlal Nehru, the first Prime Minister of India, in his book 'The Discovery of India'.
- The Indian national struggle for freedom from British rule is a great example of unity in diversity, where people from different cultural, religious and regional backgrounds came together for a common cause.
`
    },
    hi: {
        title: 'अध्याय 1: विविधता की समझ',
        content: `### विविधता क्या है?
- विविधता का अर्थ है यह समझना कि प्रत्येक व्यक्ति अद्वितीय है, और हमारे व्यक्तिगत मतभेदों को पहचानना।
- ये नस्ल, जातीयता, लिंग, यौन अभिविन्यास, सामाजिक-आर्थिक स्थिति, आयु, शारीरिक क्षमताओं, धार्मिक विश्वासों, राजनीतिक विश्वासों या अन्य विचारधाराओं के आयामों के साथ हो सकते हैं।

### भारत में विविधता
- भारत कई विविधताओं का देश है। हम अलग-अलग भाषाएँ बोलते हैं, विभिन्न प्रकार के भोजन करते हैं, अलग-अलग त्योहार मनाते हैं, अलग-अलग धर्मों का पालन करते हैं।
- **विविधता को प्रभावित करने वाले कारक:**
- - **ऐतिहासिक कारक:** किसी क्षेत्र का अतीत उसकी विविधता को प्रभावित करता है। उदाहरण के लिए, लोग व्यापार के लिए, बसने के लिए, या अकाल और युद्धों के कारण नई भूमि की यात्रा करते थे। जब वे बस गए, तो उनकी संस्कृतियाँ स्थानीय संस्कृति के साथ मिल गईं, जिससे नई, विविध संस्कृतियों का निर्माण हुआ।
- - **भौगोलिक कारक:** किसी स्थान का भूगोल इस बात को प्रभावित करता है कि लोग जीवनयापन के लिए क्या करते हैं, वे क्या खाते हैं और वे क्या पहनते हैं। उदाहरण के लिए, तटीय क्षेत्रों के लोग मछली पकड़ने में शामिल होने और अधिक मछली खाने की संभावना रखते हैं।

### अनेकता में एकता
- विशाल विविधता के बावजूद, एक अंतर्निहित एकता है जो सभी भारतीयों को बांधती है।
- यह वाक्यांश भारत के पहले प्रधानमंत्री जवाहरलाल नेहरू ने अपनी पुस्तक 'भारत की खोज' में गढ़ा था।
- ब्रिटिश शासन से स्वतंत्रता के लिए भारतीय राष्ट्रीय संघर्ष अनेकता में एकता का एक बड़ा उदाहरण है, जहाँ विभिन्न सांस्कृतिक, धार्मिक और क्षेत्रीय पृष्ठभूमि के लोग एक साझा उद्देश्य के लिए एक साथ आए।
`
    }
},
'diversity-and-discrimination': {
    en: {
        title: 'Chapter 2: Diversity and Discrimination',
        content: `### Prejudice and Stereotype
- **Prejudice:** To judge other people negatively or see them as inferior. When we fix people into one image, we create a stereotype.
- **Stereotype:** A fixed, over-generalized belief about a particular group or class of people. For example, believing that people from a certain region are lazy.

### Inequality and Discrimination
- **Discrimination:** Happens when people act on their prejudices or stereotypes. It is the practice of unfairly treating a person or group of people differently from other people or groups of people.
- **Reasons for discrimination:** People can be discriminated against because of their religion, region, economic background, gender, or caste.
- **Caste System:** In the caste system, communities/groups of people were placed in a sort of ladder where each caste was either above or below the other. Those who were placed at the top of this ladder called themselves upper caste and saw themselves as superior. The groups who were placed at the bottom of the ladder were seen as unworthy and called ‘untouchables’.

### Striving for Equality
- The Indian Constitution recognizes all Indians as equal.
- It states that the state shall not discriminate against any citizen on grounds only of religion, race, caste, sex, place of birth or any of them.
- Untouchability has been abolished and its practice is a punishable offence.
`
    },
    hi: {
        title: 'अध्याय 2: विविधता एवं भेदभाव',
        content: `### पूर्वाग्रह और रूढ़िवादिता
- **पूर्वाग्रह:** दूसरे लोगों को नकारात्मक रूप से आंकना या उन्हें हीन समझना। जब हम लोगों को एक ही छवि में बांधते हैं, तो हम एक रूढ़िवादी धारणा बनाते हैं।
- **रूढ़िवादिता:** किसी विशेष समूह या वर्ग के लोगों के बारे में एक निश्चित, अति-सामान्यीकृत विश्वास। उदाहरण के लिए, यह मानना कि एक निश्चित क्षेत्र के लोग आलसी होते हैं।

### असमानता और भेदभाव
- **भेदभाव:** तब होता है जब लोग अपने पूर्वाग्रहों या रूढ़ियों पर कार्य करते हैं। यह किसी व्यक्ति या लोगों के समूह के साथ अन्य लोगों या लोगों के समूहों से अलग अनुचित व्यवहार करने की प्रथा है।
- **भेदभाव के कारण:** लोगों के साथ उनके धर्म, क्षेत्र, आर्थिक पृष्ठभूमि, लिंग या जाति के कारण भेदभाव किया जा सकता है।
- **जाति व्यवस्था:** जाति व्यवस्था में, समुदायों/लोगों के समूहों को एक प्रकार की सीढ़ी में रखा गया था जहाँ प्रत्येक जाति या तो दूसरे के ऊपर या नीचे थी। जो लोग इस सीढ़ी के शीर्ष पर रखे गए थे, वे खुद को उच्च जाति कहते थे और खुद को श्रेष्ठ समझते थे। जो समूह सीढ़ी के नीचे रखे गए थे, उन्हें अयोग्य माना जाता था और 'अछूत' कहा जाता था।

### समानता के लिए संघर्ष
- भारतीय संविधान सभी भारतीयों को समान मानता है।
- यह कहता है कि राज्य किसी भी नागरिक के खिलाफ केवल धर्म, नस्ल, जाति, लिंग, जन्म स्थान या इनमें से किसी के आधार पर भेदभाव नहीं करेगा।
- अस्पृश्यता को समाप्त कर दिया गया है और इसका अभ्यास एक दंडनीय अपराध है।
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
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-accent text-white p-8">
            <div className="flex items-center gap-4">
                <div className="bg-white/20 p-4 rounded-full">
                    <BookOpen className="w-8 h-8" />
                </div>
                <div>
                    <CardTitle className="text-3xl font-bold">{notes.title}</CardTitle>
                    <CardDescription className="text-primary-foreground/80 mt-1">
                        Detailed notes for your study and revision.
                    </CardDescription>
                </div>
            </div>
        </div>
        <CardContent className="p-6 md:p-8">
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
