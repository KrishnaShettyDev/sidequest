'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { GraduationCap, Building2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RoleSelectorProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  userEmail: string
  userName?: string
}

export function RoleSelector({
  isOpen,
  onClose,
  userId,
  userEmail,
  userName,
}: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<'student' | 'employer' | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleContinue = async () => {
    if (!selectedRole) return

    setIsLoading(true)
    try {
      // Create profile
      // @ts-expect-error - Supabase types are generated from schema, tables don't exist yet
      const { error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        role: selectedRole,
        onboarding_completed: false,
      })

      if (profileError) throw profileError

      // Create role-specific profile
      if (selectedRole === 'student') {
        const nameParts = userName?.split(' ') || []
        // @ts-expect-error - Supabase types are generated from schema, tables don't exist yet
        const { error: studentError } = await supabase.from('student_profiles').insert({
          id: userId,
          email: userEmail,
          first_name: nameParts[0] || null,
          last_name: nameParts.slice(1).join(' ') || null,
        })
        if (studentError) throw studentError

        router.push('/student/onboarding')
      } else {
        // @ts-expect-error - Supabase types are generated from schema, tables don't exist yet
        const { error: employerError } = await supabase.from('employer_profiles').insert({
          id: userId,
          email: userEmail,
        })
        if (employerError) throw employerError

        router.push('/employer/onboarding')
      }

      onClose()
    } catch (error) {
      console.error('Error creating profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Welcome to SideQuest!</DialogTitle>
          <DialogDescription className="text-center">
            Tell us who you are to get started
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <button
            onClick={() => setSelectedRole('student')}
            className={cn(
              'flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all hover:border-primary hover:bg-primary/5',
              selectedRole === 'student'
                ? 'border-primary bg-primary/5'
                : 'border-border'
            )}
          >
            <div
              className={cn(
                'rounded-full p-4',
                selectedRole === 'student'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              <GraduationCap className="h-8 w-8" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold">I&apos;m a Student</h3>
              <p className="text-sm text-muted-foreground">
                Looking for part-time gigs at cool spots
              </p>
            </div>
          </button>

          <button
            onClick={() => setSelectedRole('employer')}
            className={cn(
              'flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all hover:border-primary hover:bg-primary/5',
              selectedRole === 'employer'
                ? 'border-primary bg-primary/5'
                : 'border-border'
            )}
          >
            <div
              className={cn(
                'rounded-full p-4',
                selectedRole === 'employer'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              <Building2 className="h-8 w-8" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold">I&apos;m an Employer</h3>
              <p className="text-sm text-muted-foreground">
                Looking to hire talented students
              </p>
            </div>
          </button>
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selectedRole || isLoading}
          size="lg"
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Setting up...
            </>
          ) : (
            'Continue'
          )}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
