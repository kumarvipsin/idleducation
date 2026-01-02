
'use server';

import { TopperTestimonialsClient } from "./topper-testimonials-client";
import { getTopperTestimonials } from "@/app/actions";
import type { TTopperTestimonial } from "@/app/actions/types";

export async function ToppersTestimonials({ testimonials }: { testimonials: TTopperTestimonial[] }) {
  return <TopperTestimonialsClient testimonials={testimonials} />;
}
