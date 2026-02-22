'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { GoogleSignInButton } from './GoogleSignInButton'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode?: 'signin' | 'signup'
}

export function AuthModal({ isOpen, onClose, mode = 'signin' }: AuthModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-8">
        <DialogHeader className="text-center space-y-4">
          <DialogTitle className="text-subheading">
            {mode === 'signin' ? 'Welcome back' : 'Join SideQuest'}
          </DialogTitle>
          <DialogDescription className="text-body text-muted-foreground">
            {mode === 'signin'
              ? 'Sign in to continue your journey'
              : 'Create an account to find or post gigs'}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-8">
          <GoogleSignInButton mode={mode} />
        </div>

        <p className="mt-8 text-center text-body-sm text-muted-foreground">
          By continuing, you agree to our{' '}
          <a href="/terms" className="underline hover:text-foreground transition-colors">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="underline hover:text-foreground transition-colors">
            Privacy Policy
          </a>
        </p>
      </DialogContent>
    </Dialog>
  )
}
