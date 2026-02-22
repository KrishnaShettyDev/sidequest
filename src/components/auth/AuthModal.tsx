'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { GoogleSignInButton } from './GoogleSignInButton'
import { Briefcase } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode?: 'signin' | 'signup'
}

export function AuthModal({ isOpen, onClose, mode = 'signin' }: AuthModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Briefcase className="h-6 w-6 text-primary-foreground" />
          </div>
          <DialogTitle className="text-2xl">
            {mode === 'signin' ? 'Welcome back!' : 'Join SideQuest'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'signin'
              ? 'Sign in to continue your journey'
              : 'Create an account to find or post gigs'}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <GoogleSignInButton mode={mode} />
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          By continuing, you agree to our{' '}
          <a href="/terms" className="underline hover:text-primary">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="underline hover:text-primary">
            Privacy Policy
          </a>
        </p>
      </DialogContent>
    </Dialog>
  )
}
