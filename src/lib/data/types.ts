// ============================================================
// VIJAYHEALS — CENTRAL DATA TYPES
// All entities are admin-managed; frontend renders from these
// ============================================================

export type PublishStatus = 'draft' | 'published' | 'archived' | 'unpublished';
export type AccessLevel = 'free' | 'enrolled' | 'premium' | 'admin';
export type LessonUnlockType = 'immediate' | 'sequential' | 'date' | 'progress';
export type ResourceType = 'ebook' | 'pdf' | 'audio' | 'video' | 'guide' | 'worksheet';
export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'paused';
export type PaymentType = 'one_time' | 'subscription' | 'package';
export type UserRole = 'admin' | 'student' | 'guest';
export type CommunityCategory = 'Gratitude' | 'Good Karma' | 'Reflection' | 'Healing Win';

// ─── USER ────────────────────────────────────────────────────
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  isActive: boolean;
}

// ─── LEAD ────────────────────────────────────────────────────
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: string;
  status: 'new' | 'contacted' | 'converted' | 'lost';
  notes?: string;
  createdAt: string;
}

// ─── SERVICE ─────────────────────────────────────────────────
export interface Service {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  ctaLabel: string;
  ctaHref: string;
  status: PublishStatus;
  featured: boolean;
  order: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
}

// ─── PROGRAM ─────────────────────────────────────────────────
export interface Program {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  longDescription: string;
  imageUrl?: string;
  imageAlt?: string;
  duration: string;
  price: number;
  priceLabel: string;
  priceNote?: string;
  altPrice?: number;
  altPriceLabel?: string;
  paymentType: PaymentType;
  status: PublishStatus;
  featured: boolean;
  order: number;
  outcomes: string[];
  whoIsItFor: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
}

// ─── COURSE ──────────────────────────────────────────────────
export interface Course {
  id: string;
  programId: string;
  title: string;
  description: string;
  order: number;
  status: PublishStatus;
  createdAt: string;
}

// ─── MODULE ──────────────────────────────────────────────────
export interface Module {
  id: string;
  courseId: string;
  programId: string;
  title: string;
  description: string;
  order: number;
  status: PublishStatus;
  focusArea?: string;
  createdAt: string;
}

// ─── LESSON ──────────────────────────────────────────────────
export interface Lesson {
  id: string;
  moduleId: string;
  courseId: string;
  programId: string;
  title: string;
  description: string;
  content?: string;
  videoUrl?: string;
  duration?: string;
  order: number;
  status: PublishStatus;
  accessLevel: AccessLevel;
  unlockType: LessonUnlockType;
  unlockAfterLessonId?: string;
  unlockDate?: string;
  isFree: boolean;
  createdAt: string;
}

// ─── LESSON ASSET ────────────────────────────────────────────
export interface LessonAsset {
  id: string;
  lessonId: string;
  title: string;
  type: ResourceType;
  url: string;
  order: number;
}

// ─── RESOURCE ────────────────────────────────────────────────
export interface Resource {
  id: string;
  title: string;
  description: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
  type: ResourceType;
  fileUrl: string;
  accessLevel: AccessLevel;
  programId?: string;
  lessonId?: string;
  featured: boolean;
  status: PublishStatus;
  order: number;
  createdAt: string;
}

// ─── ENROLLMENT ──────────────────────────────────────────────
export interface Enrollment {
  id: string;
  userId: string;
  programId: string;
  orderId?: string;
  enrolledAt: string;
  expiresAt?: string;
  status: 'active' | 'expired' | 'cancelled';
}

// ─── ORDER ───────────────────────────────────────────────────
export interface Order {
  id: string;
  userId: string;
  programId: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  paymentType: PaymentType;
  paymentProvider?: string;
  paymentRef?: string;
  couponCode?: string;
  discountAmount?: number;
  createdAt: string;
}

// ─── SUBSCRIPTION ────────────────────────────────────────────
export interface Subscription {
  id: string;
  userId: string;
  programId: string;
  orderId: string;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelledAt?: string;
  createdAt: string;
}

// ─── PROGRESS RECORD ─────────────────────────────────────────
export interface ProgressRecord {
  id: string;
  userId: string;
  lessonId: string;
  moduleId: string;
  courseId: string;
  programId: string;
  completedAt?: string;
  isCompleted: boolean;
  progressPercent: number;
  lastAccessedAt: string;
}

// ─── CERTIFICATE ─────────────────────────────────────────────
export interface Certificate {
  id: string;
  userId: string;
  programId: string;
  issuedAt: string;
  certificateUrl: string;
  isEligible: boolean;
}

// ─── BLOG CATEGORY ───────────────────────────────────────────
export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
}

// ─── BLOG TAG ────────────────────────────────────────────────
export interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

// ─── BLOG POST ───────────────────────────────────────────────
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  tags: string[];
  tagSlugs: string[];
  publishedAt: string;
  status: PublishStatus;
  featured: boolean;
  wordCount: number;
  readTimeMinutes: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt: string;
}

// ─── TESTIMONIAL ─────────────────────────────────────────────
export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  avatarUrl?: string;
  content: string;
  programId?: string;
  rating: number;
  featured: boolean;
  status: PublishStatus;
  order: number;
  createdAt: string;
}

// ─── FAQ ─────────────────────────────────────────────────────
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  programId?: string;
  category?: string;
  order: number;
  status: PublishStatus;
}

// ─── ANNOUNCEMENT ────────────────────────────────────────────
export interface Announcement {
  id: string;
  title: string;
  body: string;
  targetRole: UserRole | 'all';
  status: PublishStatus;
  publishedAt: string;
  expiresAt?: string;
  createdAt: string;
}

// ─── COMMUNITY POST ──────────────────────────────────────────
export interface CommunityPost {
  id: string;
  userId: string;
  authorName: string;
  authorAvatarUrl?: string;
  category: CommunityCategory;
  title: string;
  body: string;
  reactions: number;
  commentCount: number;
  isPinned: boolean;
  isModerated: boolean;
  status: PublishStatus;
  createdAt: string;
}

// ─── COMMUNITY COMMENT ───────────────────────────────────────
export interface CommunityComment {
  id: string;
  postId: string;
  userId: string;
  authorName: string;
  authorAvatarUrl?: string;
  body: string;
  reactions: number;
  status: PublishStatus;
  createdAt: string;
}

// ─── SHIPMENT STATUS ─────────────────────────────────────────
export interface ShipmentStatus {
  id: string;
  userId: string;
  orderId: string;
  productName: string;
  trackingNumber?: string;
  carrier?: string;
  status: 'processing' | 'shipped' | 'in_transit' | 'delivered' | 'returned';
  estimatedDelivery?: string;
  updatedAt: string;
}

// ─── SITE SECTION ────────────────────────────────────────────
export interface SiteSection {
  id: string;
  key: string;
  label: string;
  content: Record<string, string | string[] | boolean | number>;
  status: PublishStatus;
  updatedAt: string;
}

// ─── SEO METADATA ────────────────────────────────────────────
export interface SeoMetadata {
  id: string;
  pageKey: string;
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;
  updatedAt: string;
}
