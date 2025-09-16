
export const schoolPrograms = [
  { name: "CLASS V", href: "/school?class=Class 5" },
  { name: "CLASS VI", href: "/school?class=Class 6" },
  { name: "CLASS VII", href: "/school?class=Class 7" },
  { name: "CLASS VIII", href: "/school?class=Class 8" },
  { name: "CLASS IX", href: "/school?class=Class 9" },
  { name: "CLASS X", href: "/school?class=Class 10" },
  { name: "CLASS XI", href: "/school?class=Class 11" },
  { name: "CLASS XII", href: "/school?class=Class 12" },
];

export const competitivePrograms = [
  { name: "JEE", href: "/category/iit-jee" },
  { name: "NEET", href: "/category/neet" },
  { name: "GATE", href: "/category/gate" },
  { name: "CUET", href: "/category/cuet" },
  { name: "CBSE", href: "/school" },
  { name: "NIOS", href: "/school" },
  { name: "CLAT", href: "/category/cuet" },
  { name: "SSC", href: "/category/ssc" },
  { name: "DELHI POLICE", href: "/category/delhi-police" },
];

export const allPrograms = [...schoolPrograms, ...competitivePrograms];
