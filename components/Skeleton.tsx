
import React from 'react';

export const ProductSkeleton: React.FC = () => (
  <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
    <div className="h-48 md:h-64 bg-gray-200" />
    <div className="p-6 space-y-4">
      <div className="h-4 bg-gray-200 rounded w-1/4" />
      <div className="h-6 bg-gray-200 rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-10 w-10 bg-gray-200 rounded-xl" />
      </div>
    </div>
  </div>
);

export const OrderSkeleton: React.FC = () => (
  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 animate-pulse space-y-3">
    <div className="flex justify-between">
      <div className="h-3 bg-gray-200 rounded w-20" />
      <div className="h-4 bg-gray-200 rounded w-12" />
    </div>
    <div className="h-3 bg-gray-200 rounded w-32" />
    <div className="flex gap-2">
      <div className="h-6 bg-gray-200 rounded-lg w-16" />
      <div className="h-6 bg-gray-200 rounded-lg w-16" />
    </div>
  </div>
);

export const Spinner: React.FC<{ size?: string; color?: string }> = ({ size = "w-5 h-5", color = "text-white" }) => (
  <svg className={`animate-spin ${size} ${color}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
