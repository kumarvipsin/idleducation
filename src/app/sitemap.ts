import { type MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://idleducation.in'

  const staticRoutes = [
    '/',
    '/about',
    '/achievements',
    '/contact',
    '/director',
    '/login',
    '/signup',
    '/notifications',
    '/school',
    '/resources/ncert-solutions',
    '/resources/notes',
    '/resources/previous-year-questions',
    '/resources/reference-books',
  ]

  const staticUrls = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as 'monthly',
    priority: route === '/' ? 1 : 0.8,
  }))

  const categorySlugs = [
    'neet',
    'iit-jee',
    'school-preparation',
    'cuet',
    'govt-job-exams',
    'defence',
  ]

  const categoryUrls = categorySlugs.map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as 'weekly',
    priority: 0.9,
  }))

  return [...staticUrls, ...categoryUrls]
}
