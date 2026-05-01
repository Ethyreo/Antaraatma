// ============================================================
// VIJAYHEALS — MOCK DATA STORE
// Admin-managed content — replace with API calls when backend is ready
// ============================================================

import type {
  Program, Course, Module, Lesson, Resource, BlogPost, BlogCategory, BlogTag,
  Testimonial, FAQ, Service, CommunityPost, Announcement, User, Lead,
  Enrollment, Order, ProgressRecord, Certificate, ShipmentStatus, SiteSection } from
'./types';

// ─── USERS ───────────────────────────────────────────────────
export const mockUsers: User[] = [
{
  id: 'user-admin-1',
  fullName: 'Dr. Vijay Singla',
  email: 'admin@antaraatma.com',
  role: 'admin',
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z'
},
{
  id: 'user-student-1',
  fullName: 'Priya Sharma',
  email: 'priya.student@antaraatma.com',
  phone: '+91 98765 43210',
  role: 'student',
  isActive: true,
  createdAt: '2025-01-15T00:00:00Z'
},
{
  id: 'user-student-2',
  fullName: 'Arjun Mehta',
  email: 'arjun@example.com',
  role: 'student',
  isActive: true,
  createdAt: '2025-02-10T00:00:00Z'
}];


// ─── LEADS ───────────────────────────────────────────────────
export const mockLeads: Lead[] = [
{ id: 'lead-1', name: 'Sunita Kapoor', email: 'sunita@example.com', phone: '+91 99001 23456', source: 'Awareness Session', status: 'new', createdAt: '2026-03-28T10:00:00Z' },
{ id: 'lead-2', name: 'Rahul Verma', email: 'rahul@example.com', phone: '+91 88001 23456', source: 'Blog', status: 'contacted', createdAt: '2026-03-25T10:00:00Z' },
{ id: 'lead-3', name: 'Meena Joshi', email: 'meena@example.com', source: 'Referral', status: 'converted', createdAt: '2026-03-20T10:00:00Z' },
{ id: 'lead-4', name: 'Deepak Nair', email: 'deepak@example.com', phone: '+91 77001 23456', source: 'Instagram', status: 'new', createdAt: '2026-04-01T10:00:00Z' },
{ id: 'lead-5', name: 'Kavita Singh', email: 'kavita@example.com', source: 'Awareness Session', status: 'contacted', createdAt: '2026-04-02T10:00:00Z' }];


// ─── SERVICES ────────────────────────────────────────────────
export const mockServices: Service[] = [
{
  id: 'svc-1',
  title: 'One-on-One Naturopathy Consultation',
  slug: 'one-on-one-consultation',
  summary: 'A private, in-depth session with Dr. Vijay Singla to assess your unique healing needs.',
  description: 'In this 60-minute private consultation, Dr. Vijay Singla conducts a comprehensive assessment of your physical, emotional, and energetic state. You receive a personalised healing protocol, dietary guidance, and a structured follow-up plan.',
  ctaLabel: 'Book a Consultation',
  ctaHref: '/awareness-session',
  status: 'published',
  featured: true,
  order: 1,
  createdAt: '2024-01-01T00:00:00Z'
},
{
  id: 'svc-2',
  title: 'Group Healing Circles',
  slug: 'group-healing-circles',
  summary: 'Monthly group sessions focused on collective healing, breathwork, and energy alignment.',
  description: 'These intimate group sessions bring together a small cohort of students for guided breathwork, shared reflection, and collective energy practices. Facilitated by Dr. Vijay Singla, each circle is a safe container for deep healing.',
  ctaLabel: 'Join the Next Circle',
  ctaHref: '/awareness-session',
  status: 'published',
  featured: true,
  order: 2,
  createdAt: '2024-01-01T00:00:00Z'
},
{
  id: 'svc-3',
  title: 'Corporate Wellness Programs',
  slug: 'corporate-wellness',
  summary: 'Structured wellness programs designed for teams and organisations seeking sustainable health.',
  description: 'Tailored for organisations, these programs introduce naturopathic principles into the workplace — covering stress management, energy optimisation, and emotional resilience. Available as half-day workshops or ongoing monthly engagements.',
  ctaLabel: 'Enquire for Your Team',
  ctaHref: '/awareness-session',
  status: 'published',
  featured: false,
  order: 3,
  createdAt: '2024-01-01T00:00:00Z'
},
{
  id: 'svc-4',
  title: 'Personalised Healing Protocols',
  slug: 'personalised-protocols',
  summary: 'Custom healing plans built around your specific health goals and lifestyle.',
  description: 'After an initial assessment, Dr. Vijay Singla designs a fully personalised healing protocol — including dietary adjustments, breathwork sequences, sleep hygiene, and emotional processing practices — reviewed monthly.',
  ctaLabel: 'Start Your Protocol',
  ctaHref: '/awareness-session',
  status: 'published',
  featured: false,
  order: 4,
  createdAt: '2024-01-01T00:00:00Z'
}];


// ─── PROGRAMS ────────────────────────────────────────────────
export const mockPrograms: Program[] = [
{
  id: 'prog-awareness',
  title: 'Awareness Session',
  slug: 'awareness-session',
  tagline: 'Your first step into natural healing',
  description: 'A free 1-hour live session that introduces you to naturopathy, Dr. Vijay\'s healing philosophy, and the transformation pathway.',
  longDescription: 'The Awareness Session is the entry point to the Antaraatma ecosystem. In this free, live 1-hour session, Dr. Vijay Singla introduces the foundational principles of naturopathy — why the body holds illness, how emotional patterns create physical symptoms, and what a structured healing journey looks like. This session is the beginning of everything.',
  duration: '1 hour',
  price: 0,
  priceLabel: 'Free',
  priceNote: 'No credit card required',
  paymentType: 'one_time',
  status: 'published',
  featured: true,
  order: 1,
  outcomes: [
  'Understand why your body holds illness',
  'Learn the 3-stage healing pathway',
  'Discover your primary healing blocks',
  'Get a personalised next step recommendation'],

  whoIsItFor: [
  'Anyone curious about natural healing',
  'People who have tried conventional medicine without lasting results',
  'Those seeking a structured, guided approach to wellness'],

  createdAt: '2024-01-01T00:00:00Z'
},
{
  id: 'prog-foundation',
  title: 'Foundation Course',
  slug: 'foundation-course',
  tagline: 'Reset your body in 3 days',
  description: 'A 3-day intensive that resets your physical and energetic body. 1 hour per day, structured for lasting impact.',
  longDescription: 'The Foundation Course is the implementation phase of your healing journey. Over 3 focused days — 1 hour each — Dr. Vijay Singla guides you through a systematic reset of your physical body, breath patterns, and energetic field. This is where understanding becomes practice.',
  duration: '3 days · 1 hour/day',
  price: 999,
  priceLabel: '₹999',
  priceNote: 'One-time payment',
  paymentType: 'one_time',
  status: 'published',
  featured: true,
  order: 2,
  outcomes: [
  'Reset your digestive and nervous system',
  'Establish a daily healing practice',
  'Clear energetic blockages from the body',
  'Build the foundation for deeper transformation'],

  whoIsItFor: [
  'Students who have completed the Awareness Session',
  'Those ready to move from understanding to practice',
  'People seeking a structured 3-day reset'],

  createdAt: '2024-01-01T00:00:00Z'
},
{
  id: 'prog-mastery',
  title: 'Transformation Mastery',
  slug: 'transformation-mastery',
  tagline: 'Deep healing over 3 months',
  description: 'The flagship 3-month program for complete physical, emotional, and energetic transformation under Dr. Vijay\'s direct guidance.',
  longDescription: 'Transformation Mastery is the complete healing journey — a 3-month guided program that takes you from surface-level wellness into deep, lasting transformation. Each month builds on the last, with live sessions, community support, resource access, and direct guidance from Dr. Vijay Singla.',
  duration: '3 months',
  price: 2499,
  priceLabel: '₹2,499/month',
  priceNote: 'Cancel anytime',
  altPrice: 6999,
  altPriceLabel: '₹6,999 full package',
  paymentType: 'subscription',
  status: 'published',
  featured: true,
  order: 3,
  outcomes: [
  'Complete physical and energetic reset',
  'Emotional pattern resolution',
  'Sustainable daily healing practices',
  'Community and ongoing support',
  'Certificate of completion',
  'Physical healing guide book'],

  whoIsItFor: [
  'Students who have completed the Foundation Course',
  'Those committed to deep, lasting transformation',
  'People seeking ongoing guidance and community'],

  createdAt: '2024-01-01T00:00:00Z'
}];


// ─── COURSES ─────────────────────────────────────────────────
export const mockCourses: Course[] = [
{ id: 'course-awareness-1', programId: 'prog-awareness', title: 'Naturopathy Fundamentals', description: 'Core principles of natural healing', order: 1, status: 'published', createdAt: '2024-01-01T00:00:00Z' },
{ id: 'course-foundation-1', programId: 'prog-foundation', title: 'The 3-Day Body Reset', description: 'Systematic physical and energetic reset', order: 1, status: 'published', createdAt: '2024-01-01T00:00:00Z' },
{ id: 'course-mastery-1', programId: 'prog-mastery', title: 'Month 1: Physical Foundation', description: 'Building the physical healing base', order: 1, status: 'published', createdAt: '2024-01-01T00:00:00Z' },
{ id: 'course-mastery-2', programId: 'prog-mastery', title: 'Month 2: Emotional Clearing', description: 'Processing and releasing emotional patterns', order: 2, status: 'published', createdAt: '2024-01-01T00:00:00Z' },
{ id: 'course-mastery-3', programId: 'prog-mastery', title: 'Month 3: Energetic Integration', description: 'Integrating all healing dimensions', order: 3, status: 'published', createdAt: '2024-01-01T00:00:00Z' }];


// ─── MODULES ─────────────────────────────────────────────────
export const mockModules: Module[] = [
{ id: 'mod-aw-1', courseId: 'course-awareness-1', programId: 'prog-awareness', title: 'Why the Body Holds Illness', description: 'Understanding the root causes of physical and emotional blockages', order: 1, status: 'published', focusArea: 'Understanding', createdAt: '2024-01-01T00:00:00Z' },
{ id: 'mod-aw-2', courseId: 'course-awareness-1', programId: 'prog-awareness', title: 'The Healing Pathway Explained', description: 'The 3-stage journey from awareness to transformation', order: 2, status: 'published', focusArea: 'Pathway', createdAt: '2024-01-01T00:00:00Z' },
{ id: 'mod-aw-3', courseId: 'course-awareness-1', programId: 'prog-awareness', title: 'Your Next Step', description: 'Identifying your primary healing block and recommended path', order: 3, status: 'published', focusArea: 'Action', createdAt: '2024-01-01T00:00:00Z' },
{ id: 'mod-fd-1', courseId: 'course-foundation-1', programId: 'prog-foundation', title: 'Day 1: Digestive Reset', description: 'Clearing the gut and establishing clean nutrition', order: 1, status: 'published', focusArea: 'Physical', createdAt: '2024-01-01T00:00:00Z' },
{ id: 'mod-fd-2', courseId: 'course-foundation-1', programId: 'prog-foundation', title: 'Day 2: Breath & Nervous System', description: 'Regulating the nervous system through breathwork', order: 2, status: 'published', focusArea: 'Breath', createdAt: '2024-01-01T00:00:00Z' },
{ id: 'mod-fd-3', courseId: 'course-foundation-1', programId: 'prog-foundation', title: 'Day 3: Energy & Integration', description: 'Clearing energetic blockages and integrating the reset', order: 3, status: 'published', focusArea: 'Energy', createdAt: '2024-01-01T00:00:00Z' },
{ id: 'mod-m1-1', courseId: 'course-mastery-1', programId: 'prog-mastery', title: 'Physical Body Audit', description: 'Comprehensive assessment of physical health patterns', order: 1, status: 'published', focusArea: 'Body', createdAt: '2024-01-01T00:00:00Z' },
{ id: 'mod-m1-2', courseId: 'course-mastery-1', programId: 'prog-mastery', title: 'Nutrition as Medicine', description: 'Food as the primary healing tool', order: 2, status: 'published', focusArea: 'Nutrition', createdAt: '2024-01-01T00:00:00Z' },
{ id: 'mod-m1-3', courseId: 'course-mastery-1', programId: 'prog-mastery', title: 'Sleep & Recovery Protocols', description: 'Optimising rest for deep cellular healing', order: 3, status: 'published', focusArea: 'Recovery', createdAt: '2024-01-01T00:00:00Z' },
{ id: 'mod-m2-1', courseId: 'course-mastery-2', programId: 'prog-mastery', title: 'Emotional Body Mapping', description: 'Identifying where emotions live in the body', order: 1, status: 'published', focusArea: 'Emotions', createdAt: '2024-01-01T00:00:00Z' },
{ id: 'mod-m2-2', courseId: 'course-mastery-2', programId: 'prog-mastery', title: 'Relationship Patterns & Healing', description: 'How relationships shape our physical health', order: 2, status: 'published', focusArea: 'Relationships', createdAt: '2024-01-01T00:00:00Z' },
{ id: 'mod-m2-3', courseId: 'course-mastery-2', programId: 'prog-mastery', title: 'Abundance & Energy Flow', description: 'Clearing blocks to abundance and vitality', order: 3, status: 'published', focusArea: 'Abundance', createdAt: '2024-01-01T00:00:00Z' },
{ id: 'mod-m3-1', courseId: 'course-mastery-3', programId: 'prog-mastery', title: 'Integration Practices', description: 'Weaving all healing dimensions into daily life', order: 1, status: 'published', focusArea: 'Integration', createdAt: '2024-01-01T00:00:00Z' },
{ id: 'mod-m3-2', courseId: 'course-mastery-3', programId: 'prog-mastery', title: 'Sustaining Your Healing', description: 'Building lifelong healing habits and practices', order: 2, status: 'published', focusArea: 'Sustainability', createdAt: '2024-01-01T00:00:00Z' },
{ id: 'mod-m3-3', courseId: 'course-mastery-3', programId: 'prog-mastery', title: 'Certification & Completion', description: 'Celebrating your transformation and next steps', order: 3, status: 'published', focusArea: 'Completion', createdAt: '2024-01-01T00:00:00Z' }];


// ─── LESSONS ─────────────────────────────────────────────────
export const mockLessons: Lesson[] = [
{ id: 'les-aw-1', moduleId: 'mod-aw-1', courseId: 'course-awareness-1', programId: 'prog-awareness', title: 'The Root Cause Framework', description: 'Why symptoms are signals, not the problem', order: 1, status: 'published', accessLevel: 'free', unlockType: 'immediate', isFree: true, duration: '18 min', createdAt: '2024-01-01T00:00:00Z' },
{ id: 'les-aw-2', moduleId: 'mod-aw-1', courseId: 'course-awareness-1', programId: 'prog-awareness', title: 'Emotional Patterns & Physical Illness', description: 'The mind-body connection in naturopathy', order: 2, status: 'published', accessLevel: 'free', unlockType: 'sequential', unlockAfterLessonId: 'les-aw-1', isFree: true, duration: '22 min', createdAt: '2024-01-01T00:00:00Z' },
{ id: 'les-fd-1', moduleId: 'mod-fd-1', courseId: 'course-foundation-1', programId: 'prog-foundation', title: 'Morning Reset Protocol', description: 'Starting Day 1 with intention and clarity', order: 1, status: 'published', accessLevel: 'enrolled', unlockType: 'immediate', isFree: false, duration: '35 min', createdAt: '2024-01-01T00:00:00Z' },
{ id: 'les-fd-2', moduleId: 'mod-fd-1', courseId: 'course-foundation-1', programId: 'prog-foundation', title: 'Gut Healing Foods', description: 'What to eat and what to eliminate on Day 1', order: 2, status: 'published', accessLevel: 'enrolled', unlockType: 'sequential', unlockAfterLessonId: 'les-fd-1', isFree: false, duration: '28 min', createdAt: '2024-01-01T00:00:00Z' },
{ id: 'les-fd-3', moduleId: 'mod-fd-2', courseId: 'course-foundation-1', programId: 'prog-foundation', title: 'Pranayama for Nervous System Reset', description: 'Breath sequences for Day 2', order: 1, status: 'published', accessLevel: 'enrolled', unlockType: 'sequential', unlockAfterLessonId: 'les-fd-2', isFree: false, duration: '40 min', createdAt: '2024-01-01T00:00:00Z' },
{ id: 'les-m1-1', moduleId: 'mod-m1-1', courseId: 'course-mastery-1', programId: 'prog-mastery', title: 'Your Physical Body Audit', description: 'Comprehensive self-assessment for Month 1', order: 1, status: 'published', accessLevel: 'enrolled', unlockType: 'immediate', isFree: false, duration: '45 min', createdAt: '2024-01-01T00:00:00Z' },
{ id: 'les-m1-2', moduleId: 'mod-m1-2', courseId: 'course-mastery-1', programId: 'prog-mastery', title: 'The Healing Kitchen', description: 'Building your naturopathic food environment', order: 1, status: 'published', accessLevel: 'enrolled', unlockType: 'sequential', unlockAfterLessonId: 'les-m1-1', isFree: false, duration: '50 min', createdAt: '2024-01-01T00:00:00Z' }];


// ─── RESOURCES ───────────────────────────────────────────────
export const mockResources: Resource[] = [
{ id: 'res-1', title: 'The Healing Kitchen Guide', description: 'A comprehensive guide to naturopathic nutrition and food as medicine', type: 'ebook', fileUrl: '#', accessLevel: 'enrolled', programId: 'prog-foundation', featured: true, status: 'published', order: 1, createdAt: '2024-01-01T00:00:00Z' },
{ id: 'res-2', title: 'Daily Breathwork Sequences', description: 'Audio-guided pranayama practices for morning and evening', type: 'audio', fileUrl: '#', accessLevel: 'enrolled', programId: 'prog-foundation', featured: true, status: 'published', order: 2, createdAt: '2024-01-01T00:00:00Z' },
{ id: 'res-3', title: 'Emotional Body Map Worksheet', description: 'A reflective worksheet to identify where emotions live in your body', type: 'worksheet', fileUrl: '#', accessLevel: 'enrolled', programId: 'prog-mastery', featured: true, status: 'published', order: 3, createdAt: '2024-01-01T00:00:00Z' },
{ id: 'res-4', title: 'Sleep Optimisation Protocol', description: 'A step-by-step guide to restorative sleep through naturopathic practices', type: 'pdf', fileUrl: '#', accessLevel: 'enrolled', programId: 'prog-mastery', featured: false, status: 'published', order: 4, createdAt: '2024-01-01T00:00:00Z' },
{ id: 'res-5', title: 'Awareness Session Workbook', description: 'Companion workbook for the free Awareness Session', type: 'pdf', fileUrl: '#', accessLevel: 'free', programId: 'prog-awareness', featured: false, status: 'published', order: 5, createdAt: '2024-01-01T00:00:00Z' },
{ id: 'res-6', title: 'Transformation Mastery Video Series', description: 'Supplementary video content for Mastery students', type: 'video', fileUrl: '#', accessLevel: 'premium', programId: 'prog-mastery', featured: false, status: 'published', order: 6, createdAt: '2024-01-01T00:00:00Z' }];


// ─── BLOG CATEGORIES ─────────────────────────────────────────
export const mockBlogCategories: BlogCategory[] = [
{ id: 'cat-1', name: 'Naturopathy Basics', slug: 'naturopathy-basics', description: 'Foundational principles of natural healing', order: 1 },
{ id: 'cat-2', name: 'Healing Nutrition', slug: 'healing-nutrition', description: 'Food as medicine and naturopathic diet', order: 2 },
{ id: 'cat-3', name: 'Breathwork & Energy', slug: 'breathwork-energy', description: 'Pranayama, energy practices, and vitality', order: 3 },
{ id: 'cat-4', name: 'Emotional Healing', slug: 'emotional-healing', description: 'Mind-body connection and emotional wellness', order: 4 },
{ id: 'cat-5', name: 'Student Stories', slug: 'student-stories', description: 'Transformation journeys from our community', order: 5 }];


// ─── BLOG TAGS ────────────────────────────────────────────────
export const mockBlogTags: BlogTag[] = [
{ id: 'tag-1', name: 'Gut Health', slug: 'gut-health' },
{ id: 'tag-2', name: 'Breathwork', slug: 'breathwork' },
{ id: 'tag-3', name: 'Sleep', slug: 'sleep' },
{ id: 'tag-4', name: 'Detox', slug: 'detox' },
{ id: 'tag-5', name: 'Stress', slug: 'stress' },
{ id: 'tag-6', name: 'Immunity', slug: 'immunity' },
{ id: 'tag-7', name: 'Transformation', slug: 'transformation' }];


// ─── BLOG POSTS ──────────────────────────────────────────────
export const mockBlogPosts: BlogPost[] = [
{
  id: 'post-1',
  title: 'Why Your Body Holds Illness: The Naturopathic Perspective',
  slug: 'why-body-holds-illness-naturopathic-perspective',
  excerpt: 'Most people treat symptoms. Naturopathy asks a different question: why is the body creating this symptom in the first place? Understanding this changes everything.',
  body: `## The Symptom Is Not the Problem

When we experience pain, fatigue, or illness, our first instinct is to make the symptom stop. We reach for a painkiller, an antacid, a sleeping pill. And while these offer temporary relief, they rarely address what the body is actually communicating.

Naturopathy begins with a different premise: **the symptom is a signal, not the problem.**

Your body is extraordinarily intelligent. It does not create pain, inflammation, or dysfunction randomly. Every symptom is the body's attempt to restore balance — to communicate that something in the internal or external environment needs to change.

## The Three Layers of Illness

In naturopathic practice, illness typically operates across three interconnected layers:

**1. The Physical Layer**
This is where most conventional medicine focuses — the tissue, the organ, the measurable biomarker. But the physical layer is often the last to show symptoms, not the first to be affected.

**2. The Energetic Layer**
Before physical symptoms appear, there is usually a disruption in the body's energetic field — in the flow of prana, in the nervous system's regulation, in the quality of sleep and recovery. This layer is subtle but foundational.

**3. The Emotional Layer**
Unprocessed emotions — grief, fear, resentment, chronic stress — do not simply disappear. They are stored in the body's tissues, in the fascia, in the gut, in the chest. Over time, this emotional residue creates the conditions for physical illness.

## What This Means for Healing

True healing requires working across all three layers simultaneously. You cannot resolve chronic gut issues through diet alone if the emotional patterns driving the gut-brain axis remain unaddressed. You cannot sustain energy through supplements if your nervous system is chronically dysregulated.

This is the foundation of the Antaraatma approach — a structured, layered healing pathway that begins with awareness and moves toward complete integration.

The first step is always the same: **understand what your body is trying to tell you.**`,
  coverImageUrl: "https://images.unsplash.com/photo-1582556904644-15ab1a33a63d",
  coverImageAlt: 'Serene mountain landscape representing natural healing and inner peace',
  authorId: 'user-admin-1',
  authorName: 'Dr. Vijay Singla',
  categoryId: 'cat-1',
  categoryName: 'Naturopathy Basics',
  categorySlug: 'naturopathy-basics',
  tags: ['Gut Health', 'Stress', 'Transformation'],
  tagSlugs: ['gut-health', 'stress', 'transformation'],
  publishedAt: '2026-03-15T09:00:00Z',
  status: 'published',
  featured: true,
  wordCount: 380,
  readTimeMinutes: 2,
  seoTitle: 'Why Your Body Holds Illness — Naturopathic Perspective | Antaraatma',
  seoDescription: 'Discover why naturopathy treats the root cause of illness, not just symptoms. Learn about the three layers of illness and what true healing requires.',
  createdAt: '2026-03-10T00:00:00Z'
},
{
  id: 'post-2',
  title: 'The Healing Power of Conscious Breathing',
  slug: 'healing-power-conscious-breathing',
  excerpt: 'Breath is the one physiological function that bridges the conscious and unconscious mind. Learning to use it intentionally is one of the most powerful healing tools available.',
  body: `## Breath as Medicine

Of all the healing practices available to us, conscious breathing is perhaps the most immediate and accessible. Unlike diet changes or lifestyle shifts that take weeks to show results, breathwork can shift your nervous system state within minutes.

## The Nervous System Connection

Your breath is directly connected to your autonomic nervous system — the system that governs your stress response, your digestion, your immune function, and your capacity for rest and recovery.

When you breathe shallowly and rapidly (as most people do under chronic stress), you activate the sympathetic nervous system — the fight-or-flight response. This is useful in genuine emergencies, but devastating when it becomes your default state.

Slow, deep, diaphragmatic breathing activates the parasympathetic nervous system — the rest-and-digest response. This is where healing happens.

## Three Foundational Practices

**1. 4-7-8 Breathing**
Inhale for 4 counts, hold for 7, exhale for 8. This pattern rapidly shifts the nervous system toward calm and is particularly effective before sleep.

**2. Alternate Nostril Breathing (Nadi Shodhana)**
This pranayama practice balances the left and right hemispheres of the brain, reduces anxiety, and improves focus. Practice for 5–10 minutes each morning.

**3. Box Breathing**
Inhale for 4, hold for 4, exhale for 4, hold for 4. Used by military personnel and elite athletes to regulate stress response in high-pressure situations.

## Starting Your Practice

Begin with just 5 minutes each morning. Sit comfortably, close your eyes, and simply observe your natural breath for the first minute. Then introduce one of the practices above.

Consistency matters more than duration. Five minutes daily will transform your nervous system regulation within two weeks.`,
  coverImageUrl: "https://img.rocket.new/generatedImages/rocket_gen_img_1a82c19fb-1772199230830.png",
  coverImageAlt: 'Person practicing meditation and breathwork in a peaceful natural setting',
  authorId: 'user-admin-1',
  authorName: 'Dr. Vijay Singla',
  categoryId: 'cat-3',
  categoryName: 'Breathwork & Energy',
  categorySlug: 'breathwork-energy',
  tags: ['Breathwork', 'Stress', 'Sleep'],
  tagSlugs: ['breathwork', 'stress', 'sleep'],
  publishedAt: '2026-03-22T09:00:00Z',
  status: 'published',
  featured: false,
  wordCount: 340,
  readTimeMinutes: 2,
  seoTitle: 'The Healing Power of Conscious Breathing | Antaraatma',
  seoDescription: 'Learn how breathwork activates the parasympathetic nervous system and accelerates healing. Three foundational practices to start today.',
  createdAt: '2026-03-18T00:00:00Z'
},
{
  id: 'post-3',
  title: 'Food as Medicine: The Naturopathic Approach to Nutrition',
  slug: 'food-as-medicine-naturopathic-nutrition',
  excerpt: 'In naturopathy, food is not just fuel — it is information. Every meal either supports or disrupts your body\'s healing processes. Here is how to eat for genuine health.',
  body: `## Rethinking What Food Does

Modern nutrition science focuses primarily on macronutrients and calories. Naturopathy takes a broader view: food is information that communicates with your cells, your gut microbiome, your immune system, and your hormonal environment.

This perspective changes how we approach eating entirely.

## The Gut as the Foundation

In naturopathic practice, the gut is considered the foundation of all health. Approximately 70% of the immune system resides in the gut. The gut-brain axis directly influences mood, cognition, and emotional regulation. The gut microbiome affects everything from inflammation to hormonal balance.

This means that healing the gut is often the first priority — regardless of what symptoms you are experiencing.

## Foods That Heal

**Anti-inflammatory foods**: Turmeric, ginger, leafy greens, berries, and omega-3-rich foods reduce systemic inflammation — the underlying driver of most chronic illness.

**Prebiotic foods**: Garlic, onions, leeks, asparagus, and bananas feed the beneficial bacteria in your gut microbiome.

**Probiotic foods**: Fermented foods like yoghurt, kefir, kimchi, and sauerkraut introduce beneficial bacteria directly.

**Liver-supporting foods**: Bitter greens, cruciferous vegetables, and lemon water support the liver's detoxification processes.

## Foods That Disrupt

Refined sugar, processed seed oils, ultra-processed foods, and excessive alcohol all disrupt gut integrity, increase inflammation, and impair the body's natural healing processes.

The goal is not perfection — it is a consistent shift toward foods that support your body's intelligence.`,
  coverImageUrl: "https://img.rocket.new/generatedImages/rocket_gen_img_1b9d28c10-1772540474138.png",
  coverImageAlt: 'Fresh vegetables and healing foods arranged beautifully on a wooden surface',
  authorId: 'user-admin-1',
  authorName: 'Dr. Vijay Singla',
  categoryId: 'cat-2',
  categoryName: 'Healing Nutrition',
  categorySlug: 'healing-nutrition',
  tags: ['Gut Health', 'Detox', 'Immunity'],
  tagSlugs: ['gut-health', 'detox', 'immunity'],
  publishedAt: '2026-03-29T09:00:00Z',
  status: 'published',
  featured: false,
  wordCount: 360,
  readTimeMinutes: 2,
  seoTitle: 'Food as Medicine: Naturopathic Nutrition Guide | Antaraatma',
  seoDescription: 'Discover how naturopathy uses food as medicine. Learn which foods heal and which disrupt, and how to eat for genuine, lasting health.',
  createdAt: '2026-03-25T00:00:00Z'
},
{
  id: 'post-4',
  title: 'How Priya Reversed 8 Years of Chronic Fatigue in 3 Months',
  slug: 'priya-reversed-chronic-fatigue-transformation',
  excerpt: 'After years of inconclusive tests and temporary fixes, Priya found a structured healing pathway that addressed the root cause of her exhaustion. This is her story.',
  body: `## The Beginning

Priya Sharma had been tired for eight years. Not the kind of tired that a good night's sleep fixes — the deep, bone-level exhaustion that makes ordinary life feel like an extraordinary effort.

She had seen specialists. She had tried supplements, elimination diets, and meditation apps. Each offered temporary relief, but nothing lasted.

"I had almost accepted that this was just how I was going to feel," she says.

## Finding the Root Cause

When Priya joined the Awareness Session, she expected another set of generic wellness advice. What she found instead was a framework that finally made sense of her experience.

"Dr. Vijay explained that chronic fatigue is rarely just a physical problem. It's usually the body's response to a combination of physical depletion, nervous system dysregulation, and unprocessed emotional load. That description fit me exactly."

## The Three-Month Journey

Through the Foundation Course and then Transformation Mastery, Priya worked systematically through each layer of her healing:

**Month 1** focused on her physical body — gut healing, sleep optimisation, and eliminating the foods that were driving her inflammation.

**Month 2** addressed her emotional patterns — specifically the chronic anxiety and people-pleasing that had kept her nervous system in a constant state of alert.

**Month 3** was about integration — building sustainable practices that would maintain her healing without requiring constant effort.

## The Outcome

"By the end of Month 3, I had more energy than I had in my twenties. But more than that, I understood my body for the first time. I knew what it needed and why."

Priya now facilitates a local healing circle and has completed her certification.`,
  coverImageUrl: "https://images.unsplash.com/photo-1557727306-ee7d64f5380b",
  coverImageAlt: 'Woman smiling in a bright outdoor setting, representing health transformation and vitality',
  authorId: 'user-admin-1',
  authorName: 'Dr. Vijay Singla',
  categoryId: 'cat-5',
  categoryName: 'Student Stories',
  categorySlug: 'student-stories',
  tags: ['Transformation', 'Stress', 'Gut Health'],
  tagSlugs: ['transformation', 'stress', 'gut-health'],
  publishedAt: '2026-04-01T09:00:00Z',
  status: 'published',
  featured: false,
  wordCount: 390,
  readTimeMinutes: 2,
  seoTitle: 'How Priya Reversed Chronic Fatigue in 3 Months | Antaraatma',
  seoDescription: 'Read how Priya Sharma reversed 8 years of chronic fatigue through the Antaraatma naturopathy program. A real transformation story.',
  createdAt: '2026-03-28T00:00:00Z'
}];


// ─── TESTIMONIALS ────────────────────────────────────────────
export const mockTestimonials: Testimonial[] = [
{ id: 'test-1', name: 'Priya Sharma', role: 'Transformation Mastery Graduate', content: 'I had been dealing with chronic fatigue for 8 years. After 3 months with Dr. Vijay, I have more energy than I did in my twenties. This program changed my life.', programId: 'prog-mastery', rating: 5, featured: true, status: 'published', order: 1, createdAt: '2026-01-15T00:00:00Z' },
{ id: 'test-2', name: 'Arjun Mehta', role: 'Foundation Course Graduate', content: 'The 3-day reset was exactly what I needed. I came in skeptical and left with a completely different relationship with my body. The breathwork alone was worth it.', programId: 'prog-foundation', rating: 5, featured: true, status: 'published', order: 2, createdAt: '2026-02-10T00:00:00Z' },
{ id: 'test-3', name: 'Sunita Kapoor', role: 'Transformation Mastery Student', content: 'Dr. Vijay\'s approach is unlike anything I\'ve experienced. He doesn\'t just treat symptoms — he helps you understand your body at a level that creates lasting change.', programId: 'prog-mastery', rating: 5, featured: true, status: 'published', order: 3, createdAt: '2026-02-28T00:00:00Z' },
{ id: 'test-4', name: 'Meena Joshi', role: 'Awareness Session Attendee', content: 'I attended the free session expecting a sales pitch. Instead, I got the most clarity about my health I\'ve ever had in an hour. I enrolled in the Foundation Course immediately.', programId: 'prog-awareness', rating: 5, featured: false, status: 'published', order: 4, createdAt: '2026-03-05T00:00:00Z' },
{ id: 'test-5', name: 'Rahul Verma', role: 'Foundation Course Graduate', content: 'The gut healing protocol in Day 1 alone resolved a digestive issue I\'d had for 3 years. I\'m now in Month 2 of Mastery and the transformation continues.', programId: 'prog-foundation', rating: 5, featured: false, status: 'published', order: 5, createdAt: '2026-03-12T00:00:00Z' }];


// ─── FAQs ─────────────────────────────────────────────────────
export const mockFAQs: FAQ[] = [
{ id: 'faq-1', question: 'What is naturopathy?', answer: 'Naturopathy is a system of healthcare that uses natural therapies — including nutrition, breathwork, herbal medicine, and lifestyle modification — to support the body\'s innate healing capacity. It treats the whole person, not just symptoms.', order: 1, status: 'published' },
{ id: 'faq-2', question: 'Is the Awareness Session really free?', answer: 'Yes, completely free. No credit card required. The Awareness Session is Dr. Vijay\'s gift to anyone seeking clarity about their health. It is a genuine 1-hour educational session, not a sales presentation.', order: 2, status: 'published' },
{ id: 'faq-3', question: 'Do I need to complete the Awareness Session before the Foundation Course?', answer: 'It is strongly recommended. The Awareness Session provides the foundational understanding that makes the Foundation Course significantly more effective. However, it is not a strict prerequisite.', order: 3, status: 'published' },
{ id: 'faq-4', question: 'Can I cancel the monthly Mastery subscription?', answer: 'Yes, you can cancel at any time. Your access continues until the end of the current billing period. There are no cancellation fees.', programId: 'prog-mastery', order: 4, status: 'published' },
{ id: 'faq-5', question: 'Is the Foundation Course suitable for beginners?', answer: 'Absolutely. The Foundation Course is designed for people at any stage of their health journey. No prior knowledge of naturopathy is required.', programId: 'prog-foundation', order: 5, status: 'published' },
{ id: 'faq-6', question: 'What is included in the Transformation Mastery program?', answer: 'Transformation Mastery includes 3 months of structured curriculum, live group sessions with Dr. Vijay, access to the Resource Vault, the Talk to Uni community, progress tracking, a certificate of completion, and a physical healing guide book.', programId: 'prog-mastery', order: 6, status: 'published' },
{ id: 'faq-7', question: 'How is progress tracked?', answer: 'Your progress is tracked at the lesson, module, and course level. You can see your completion percentage for each program, and the system automatically unlocks new content as you progress.', order: 7, status: 'published' }];


// ─── COMMUNITY POSTS ─────────────────────────────────────────
export const mockCommunityPosts: CommunityPost[] = [
{ id: 'cp-1', userId: 'user-student-1', authorName: 'Priya S.', category: 'Healing Win', title: 'First full night of sleep in 3 years', body: 'After implementing the sleep protocol from Month 1, I slept through the night for the first time in years. I woke up and cried. This is what healing feels like.', reactions: 47, commentCount: 12, isPinned: true, isModerated: false, status: 'published', createdAt: '2026-04-01T08:00:00Z' },
{ id: 'cp-2', userId: 'user-student-2', authorName: 'Arjun M.', category: 'Gratitude', title: 'Grateful for this community', body: 'Three months ago I was skeptical about online healing programs. Today I am writing this with a body that feels genuinely different. Thank you Dr. Vijay and everyone here.', reactions: 38, commentCount: 8, isPinned: false, isModerated: false, status: 'published', createdAt: '2026-03-28T10:00:00Z' },
{ id: 'cp-3', userId: 'user-student-1', authorName: 'Meena J.', category: 'Reflection', title: 'Week 3 reflection — the emotional layer', body: 'I did not expect the emotional work to be this intense. The body mapping exercise in Module 4 brought up grief I had been carrying for 10 years. It was hard. It was necessary.', reactions: 29, commentCount: 15, isPinned: false, isModerated: false, status: 'published', createdAt: '2026-03-25T14:00:00Z' },
{ id: 'cp-4', userId: 'user-student-2', authorName: 'Rahul V.', category: 'Good Karma', title: 'Sharing the gut healing protocol with my family', body: 'My mother has had digestive issues for years. I shared the Day 1 protocol with her and she called me last week to say her symptoms had reduced by 80%. Healing is contagious.', reactions: 52, commentCount: 19, isPinned: false, isModerated: false, status: 'published', createdAt: '2026-03-20T09:00:00Z' }];


// ─── ENROLLMENTS ─────────────────────────────────────────────
export const mockEnrollments: Enrollment[] = [
{ id: 'enr-1', userId: 'user-student-1', programId: 'prog-mastery', orderId: 'ord-1', enrolledAt: '2026-01-15T00:00:00Z', status: 'active' },
{ id: 'enr-2', userId: 'user-student-1', programId: 'prog-foundation', orderId: 'ord-2', enrolledAt: '2025-12-01T00:00:00Z', status: 'active' },
{ id: 'enr-3', userId: 'user-student-2', programId: 'prog-foundation', orderId: 'ord-3', enrolledAt: '2026-02-10T00:00:00Z', status: 'active' }];


// ─── ORDERS ──────────────────────────────────────────────────
export const mockOrders: Order[] = [
{ id: 'ord-1', userId: 'user-student-1', programId: 'prog-mastery', amount: 2499, currency: 'INR', status: 'paid', paymentType: 'subscription', createdAt: '2026-01-15T00:00:00Z' },
{ id: 'ord-2', userId: 'user-student-1', programId: 'prog-foundation', amount: 999, currency: 'INR', status: 'paid', paymentType: 'one_time', createdAt: '2025-12-01T00:00:00Z' },
{ id: 'ord-3', userId: 'user-student-2', programId: 'prog-foundation', amount: 999, currency: 'INR', status: 'paid', paymentType: 'one_time', createdAt: '2026-02-10T00:00:00Z' }];


// ─── PROGRESS RECORDS ────────────────────────────────────────
export const mockProgressRecords: ProgressRecord[] = [
{ id: 'pr-1', userId: 'user-student-1', lessonId: 'les-m1-1', moduleId: 'mod-m1-1', courseId: 'course-mastery-1', programId: 'prog-mastery', isCompleted: true, progressPercent: 100, completedAt: '2026-01-20T00:00:00Z', lastAccessedAt: '2026-01-20T00:00:00Z' },
{ id: 'pr-2', userId: 'user-student-1', lessonId: 'les-m1-2', moduleId: 'mod-m1-2', courseId: 'course-mastery-1', programId: 'prog-mastery', isCompleted: true, progressPercent: 100, completedAt: '2026-01-27T00:00:00Z', lastAccessedAt: '2026-01-27T00:00:00Z' },
{ id: 'pr-3', userId: 'user-student-1', lessonId: 'les-fd-1', moduleId: 'mod-fd-1', courseId: 'course-foundation-1', programId: 'prog-foundation', isCompleted: true, progressPercent: 100, completedAt: '2025-12-05T00:00:00Z', lastAccessedAt: '2025-12-05T00:00:00Z' }];


// ─── CERTIFICATES ────────────────────────────────────────────
export const mockCertificates: Certificate[] = [
{ id: 'cert-1', userId: 'user-student-1', programId: 'prog-foundation', issuedAt: '2025-12-10T00:00:00Z', certificateUrl: '#', isEligible: true }];


// ─── SHIPMENT STATUS ─────────────────────────────────────────
export const mockShipments: ShipmentStatus[] = [
{ id: 'ship-1', userId: 'user-student-1', orderId: 'ord-1', productName: 'Healing Guide Book', trackingNumber: 'IND123456789', carrier: 'India Post', status: 'in_transit', estimatedDelivery: '2026-04-10', updatedAt: '2026-04-03T00:00:00Z' }];


// ─── ANNOUNCEMENTS ───────────────────────────────────────────
export const mockAnnouncements: Announcement[] = [
{ id: 'ann-1', title: 'April Awareness Session — Register Now', body: 'The next free Awareness Session is on April 12, 2026. Limited spots available. Register at the link below.', targetRole: 'all', status: 'published', publishedAt: '2026-04-01T00:00:00Z', expiresAt: '2026-04-12T00:00:00Z', createdAt: '2026-04-01T00:00:00Z' },
{ id: 'ann-2', title: 'New Resource Added: Sleep Optimisation Protocol', body: 'A new PDF resource has been added to the Resource Vault for all enrolled students.', targetRole: 'student', status: 'published', publishedAt: '2026-03-25T00:00:00Z', createdAt: '2026-03-25T00:00:00Z' }];


// ─── SITE SECTIONS ───────────────────────────────────────────
export const mockSiteSections: SiteSection[] = [
{
  id: 'ss-1',
  key: 'homepage_hero',
  label: 'Homepage Hero',
  content: {
    headline: 'Heal from within.',
    subheadline: 'Naturally.',
    body: 'Dr. Vijay Singla guides you through a structured healing pathway — grounded in naturopathy, designed for lasting transformation.',
    primaryCta: 'Join the Free Awareness Session',
    secondaryCta: 'Explore the Journey'
  },
  status: 'published',
  updatedAt: '2026-04-01T00:00:00Z'
},
{
  id: 'ss-2',
  key: 'homepage_about',
  label: 'Homepage About Section',
  content: {
    headline: 'A different kind of healer',
    body: 'Dr. Vijay Singla has spent 12 years in clinical naturopathic practice, guiding over 2,400 students through structured healing journeys. His approach combines ancient wisdom with modern understanding of the body\'s healing intelligence.',
    yearsExperience: '12',
    studentsHealed: '2,400+',
    completionRate: '94%'
  },
  status: 'published',
  updatedAt: '2026-04-01T00:00:00Z'
}];


// ─── HELPER FUNCTIONS ────────────────────────────────────────
export function getProgramById(id: string): Program | undefined {
  return mockPrograms.find((p) => p.id === id);
}

export function getCoursesByProgram(programId: string): Course[] {
  return mockCourses.filter((c) => c.programId === programId).sort((a, b) => a.order - b.order);
}

export function getModulesByCourse(courseId: string): Module[] {
  return mockModules.filter((m) => m.courseId === courseId).sort((a, b) => a.order - b.order);
}

export function getModulesByProgram(programId: string): Module[] {
  return mockModules.filter((m) => m.programId === programId).sort((a, b) => a.order - b.order);
}

export function getLessonsByModule(moduleId: string): Lesson[] {
  return mockLessons.filter((l) => l.moduleId === moduleId).sort((a, b) => a.order - b.order);
}

export function getFeaturedPrograms(): Program[] {
  return mockPrograms.filter((p) => p.featured && p.status === 'published').sort((a, b) => a.order - b.order);
}

export function getFeaturedTestimonials(): Testimonial[] {
  return mockTestimonials.filter((t) => t.featured && t.status === 'published').sort((a, b) => a.order - b.order);
}

export function getFeaturedBlogPost(): BlogPost | undefined {
  return mockBlogPosts.find((p) => p.featured && p.status === 'published');
}

export function getPublishedBlogPosts(): BlogPost[] {
  return mockBlogPosts.filter((p) => p.status === 'published').sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return mockBlogPosts.find((p) => p.slug === slug && p.status === 'published');
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  return mockBlogPosts.
  filter((p) => p.id !== post.id && p.status === 'published' && (p.categoryId === post.categoryId || p.tags.some((t) => post.tags.includes(t)))).
  slice(0, limit);
}

export function getFAQsByProgram(programId?: string): FAQ[] {
  const faqs = mockFAQs.filter((f) => f.status === 'published');
  if (programId) return faqs.filter((f) => !f.programId || f.programId === programId).sort((a, b) => a.order - b.order);
  return faqs.filter((f) => !f.programId).sort((a, b) => a.order - b.order);
}

export function getPublishedServices(): Service[] {
  return mockServices.filter((s) => s.status === 'published').sort((a, b) => a.order - b.order);
}

export function getUserEnrollments(userId: string): Enrollment[] {
  return mockEnrollments.filter((e) => e.userId === userId && e.status === 'active');
}

export function getUserProgress(userId: string, programId: string): ProgressRecord[] {
  return mockProgressRecords.filter((p) => p.userId === userId && p.programId === programId);
}

export function calculateProgramProgress(userId: string, programId: string): number {
  const lessons = mockLessons.filter((l) => l.programId === programId);
  if (lessons.length === 0) return 0;
  const completed = mockProgressRecords.filter((p) => p.userId === userId && p.programId === programId && p.isCompleted).length;
  return Math.round(completed / lessons.length * 100);
}

export function isLessonUnlocked(lessonId: string, userId: string): boolean {
  const lesson = mockLessons.find((l) => l.id === lessonId);
  if (!lesson) return false;
  if (lesson.isFree || lesson.unlockType === 'immediate') return true;
  if (lesson.unlockType === 'sequential' && lesson.unlockAfterLessonId) {
    return mockProgressRecords.some((p) => p.userId === userId && p.lessonId === lesson.unlockAfterLessonId && p.isCompleted);
  }
  return false;
}

export function getAccessibleResources(userId: string): Resource[] {
  const enrollments = getUserEnrollments(userId);
  const enrolledProgramIds = enrollments.map((e) => e.programId);
  return mockResources.filter((r) => {
    if (r.accessLevel === 'free') return true;
    if (r.accessLevel === 'enrolled' && r.programId && enrolledProgramIds.includes(r.programId)) return true;
    return false;
  });
}