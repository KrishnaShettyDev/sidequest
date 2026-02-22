'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OnboardingProgressProps {
  currentStep: number
  steps: { title: string; description: string }[]
}

export function OnboardingProgress({ currentStep, steps }: OnboardingProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep

          return (
            <div key={index} className="flex items-center">
              {/* Step circle */}
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-all',
                  isCompleted
                    ? 'border-primary bg-primary text-primary-foreground'
                    : isCurrent
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-muted-foreground/30 text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  stepNumber
                )}
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 w-12 md:w-20',
                    stepNumber < currentStep ? 'bg-primary' : 'bg-muted-foreground/30'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Current step info */}
      <div className="mt-4 text-center">
        <h2 className="text-lg font-semibold">{steps[currentStep - 1]?.title}</h2>
        <p className="text-sm text-muted-foreground">
          {steps[currentStep - 1]?.description}
        </p>
      </div>
    </div>
  )
}
