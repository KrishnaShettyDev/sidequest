import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Sanitizes a string to prevent XSS attacks
 * Escapes HTML special characters
 */
export function sanitizeHtml(str: string): string {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/**
 * Sanitizes user input for database storage
 * Trims whitespace and removes null bytes
 */
export function sanitizeInput(str: string): string {
  if (!str) return ''
  return str
    .trim()
    .replace(/\0/g, '') // Remove null bytes
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
}

/**
 * Validates and sanitizes a URL
 * Returns empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url) return ''

  const trimmed = url.trim()

  // Only allow http(s) and relative URLs
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    try {
      // Validate it's a proper URL (for absolute URLs)
      if (trimmed.startsWith('http')) {
        new URL(trimmed)
      }
      return trimmed
    } catch {
      return ''
    }
  }

  // Try adding https:// if it looks like a domain
  if (/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(trimmed)) {
    try {
      const withProtocol = `https://${trimmed}`
      new URL(withProtocol)
      return withProtocol
    } catch {
      return ''
    }
  }

  return ''
}

/**
 * Validates phone number format (Indian format)
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return false
  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, '')
  // Indian phone: 10 digits, optionally starting with +91 or 0
  return /^(\+91|0)?[6-9]\d{9}$/.test(cleaned)
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false
  // Basic email validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}
