import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Get dynamic base URL for the application
export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Client-side: use current origin
    return window.location.origin;
  }
  
  // Server-side: use environment variable or default
  return process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || 'http://localhost:3000';
}

// Get form submission URL
export function getFormSubmissionUrl(formId: string) {
  return `${getBaseUrl()}/api/submit?form_id=${formId}`;
}
