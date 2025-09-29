'use server';

import { TopperTestimonialsClient } from "./topper-testimonials-client";
import { getTopperTestimonials } from "@/app/actions";

export async function ToppersTestimonials() {
  const testimonialsResult = await getTopperTestimonials();
  const testimonials = testimonialsResult.success ? testimonialsResult.data : [];

  return <TopperTestimonialsClient testimonials={testimonials as any[]} />;
}
