'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type FormData = {
  title: string;
  slug: string;
  level: string;
  format: string;
  price: string;
  currency: string;
  duration: string;
  shortDescription: string;
  prerequisite: string;
  status: string;
};

interface Props {
  onClose: () => void;
}

export default function CreateProgramModal({ onClose }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
    defaultValues: {
      currency: '₹',
      status: 'draft',
      level: 'Core',
      format: 'Self-paced',
    },
  });

  const titleValue = watch('title');

  // Auto-generate slug from title
  React.useEffect(() => {
    if (titleValue) {
      setValue('slug', titleValue.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
  }, [titleValue, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          slug: data.slug,
          tagline: data.shortDescription,
          description: data.shortDescription,
          long_description: data.shortDescription,
          duration: data.duration,
          price: parseFloat(data.price) || 0,
          price_label: `₹${data.price}`,
          payment_type: 'one_time',
          status: data.status,
          featured: false,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        toast.error(json.error || 'Failed to create program.');
      } else {
        toast.success(`Program "${data.title}" created as ${data.status}`);
        onClose();
        // Reload page to refresh program list
        window.location.reload();
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-sm shadow-modal w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="font-serif text-lg text-stone-900">Create New Program</p>
            <p className="text-xs font-sans text-stone-500">All fields required unless marked optional</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-sm transition-colors"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-sans font-500 text-stone-700 mb-1.5" htmlFor="prog-title">
              Program Title
            </label>
            <input
              id="prog-title"
              type="text"
              className="input-base"
              placeholder="e.g. Advanced Gut Healing Program"
              {...register('title', { required: 'Title is required', minLength: { value: 5, message: 'Title too short' } })}
            />
            {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-sans font-500 text-stone-700 mb-1.5" htmlFor="prog-slug">
              URL Slug
            </label>
            <p className="text-xs font-sans text-stone-400 mb-1.5">Auto-generated from title. Edit if needed.</p>
            <input
              id="prog-slug"
              type="text"
              className="input-base font-mono text-xs"
              placeholder="advanced-gut-healing-program"
              {...register('slug', { required: 'Slug is required' })}
            />
            {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug.message}</p>}
          </div>

          {/* Level + Format */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans font-500 text-stone-700 mb-1.5" htmlFor="prog-level">
                Program Level
              </label>
              <select
                id="prog-level"
                className="input-base"
                {...register('level', { required: 'Level is required' })}
              >
                <option value="Entry">Entry</option>
                <option value="Core">Core</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-sans font-500 text-stone-700 mb-1.5" htmlFor="prog-format">
                Delivery Format
              </label>
              <select
                id="prog-format"
                className="input-base"
                {...register('format', { required: 'Format is required' })}
              >
                <option value="Self-paced">Self-paced</option>
                <option value="Self-paced + Live">Self-paced + Live</option>
                <option value="Live Online">Live Online</option>
                <option value="Mentored Program">Mentored Program</option>
              </select>
            </div>
          </div>

          {/* Price + Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans font-500 text-stone-700 mb-1.5" htmlFor="prog-price">
                Price (₹)
              </label>
              <input
                id="prog-price"
                type="number"
                min={0}
                className="input-base tabular-nums"
                placeholder="12000"
                {...register('price', { required: 'Price is required', min: { value: 0, message: 'Must be 0 or more' } })}
              />
              {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-sans font-500 text-stone-700 mb-1.5" htmlFor="prog-duration">
                Duration
              </label>
              <input
                id="prog-duration"
                type="text"
                className="input-base"
                placeholder="e.g. 8 weeks"
                {...register('duration', { required: 'Duration is required' })}
              />
              {errors.duration && <p className="text-xs text-red-600 mt-1">{errors.duration.message}</p>}
            </div>
          </div>

          {/* Short description */}
          <div>
            <label className="block text-xs font-sans font-500 text-stone-700 mb-1.5" htmlFor="prog-desc">
              Short Description
            </label>
            <p className="text-xs font-sans text-stone-400 mb-1.5">Shown on program cards and enrollment pages. Max 200 characters.</p>
            <textarea
              id="prog-desc"
              rows={3}
              className="input-base resize-none"
              placeholder="A focused program description that explains what the student will achieve..."
              {...register('shortDescription', {
                required: 'Description is required',
                maxLength: { value: 200, message: 'Max 200 characters' },
              })}
            />
            {errors.shortDescription && <p className="text-xs text-red-600 mt-1">{errors.shortDescription.message}</p>}
          </div>

          {/* Prerequisite */}
          <div>
            <label className="block text-xs font-sans font-500 text-stone-700 mb-1.5" htmlFor="prog-prereq">
              Prerequisite
              <span className="ml-1 text-stone-400 font-400">(optional)</span>
            </label>
            <input
              id="prog-prereq"
              type="text"
              className="input-base"
              placeholder="e.g. Foundation Course required"
              {...register('prerequisite')}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-sans font-500 text-stone-700 mb-1.5" htmlFor="prog-status">
              Initial Status
            </label>
            <select
              id="prog-status"
              className="input-base"
              {...register('status')}
            >
              <option value="draft">Draft — not visible to students</option>
              <option value="published">Published — live on platform</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost text-xs py-2 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 bg-amber-800 text-amber-50 text-xs font-sans font-500 px-5 py-2 rounded-sm hover:bg-amber-900 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ minWidth: '120px' }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Program'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}