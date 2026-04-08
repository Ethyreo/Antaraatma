import React from 'react';
import { MessageSquare, Heart, ArrowRight } from 'lucide-react';

// Backend integration point: fetch from /api/community/recent?limit=4
const posts = [
  {
    id: 'post-community-001',
    author: 'Arjun M.',
    avatar: 'A',
    time: '2 hours ago',
    content: 'Just finished Module 5! The detox protocol guide is incredibly detailed. Has anyone done the 7-day gentle detox yet?',
    likes: 12,
    replies: 4,
    module: 'Module 5',
  },
  {
    id: 'post-community-002',
    author: 'Meera K.',
    avatar: 'M',
    time: '5 hours ago',
    content: 'Dr. Vijay\'s explanation of the gut-brain axis in Module 2 completely changed how I think about my anxiety. Highly recommend revisiting it.',
    likes: 28,
    replies: 7,
    module: 'Module 2',
  },
  {
    id: 'post-community-003',
    author: 'Rohan D.',
    avatar: 'R',
    time: 'Yesterday',
    content: 'Week 3 check-in: sleep quality noticeably improved. Using the sleep workbook from the vault — it\'s practical and actually works.',
    likes: 19,
    replies: 3,
    module: 'Module 3',
  },
  {
    id: 'post-community-004',
    author: 'Sunita P.',
    avatar: 'S',
    time: 'Yesterday',
    content: 'Reminder that the live Q&A with Dr. Vijay is this Thursday at 7pm IST. Submit your questions in the session thread!',
    likes: 34,
    replies: 11,
    module: 'General',
  },
];

export default function CommunityPulse() {
  return (
    <div className="card-base overflow-hidden">
      <div className="p-5 border-b border-stone-100 flex items-center justify-between">
        <div>
          <p className="section-label mb-0.5">Community</p>
          <p className="text-xs font-sans text-stone-500">Recent discussions</p>
        </div>
        <button className="text-xs font-sans font-500 text-amber-700 hover:text-amber-800 transition-colors flex items-center gap-1">
          Join community
          <ArrowRight size={11} />
        </button>
      </div>
      <div className="divide-y divide-stone-100">
        {posts?.map((post) => (
          <div key={post?.id} className="p-5 hover:bg-stone-50/50 transition-colors cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                <span className="font-serif text-xs text-amber-800">{post?.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-sans font-500 text-stone-700">{post?.author}</span>
                  <span className="status-badge bg-stone-100 text-stone-500 text-2xs">{post?.module}</span>
                  <span className="text-2xs font-sans text-stone-400 ml-auto">{post?.time}</span>
                </div>
                <p className="text-xs font-sans text-stone-600 leading-relaxed line-clamp-2">{post?.content}</p>
                <div className="flex items-center gap-4 mt-2.5">
                  <button className="flex items-center gap-1 text-2xs font-sans text-stone-400 hover:text-red-500 transition-colors">
                    <Heart size={11} />
                    {post?.likes}
                  </button>
                  <button className="flex items-center gap-1 text-2xs font-sans text-stone-400 hover:text-amber-700 transition-colors">
                    <MessageSquare size={11} />
                    {post?.replies} replies
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}