import Link from 'next/link'
import {
  Coffee,
  UtensilsCrossed,
  BookOpen,
  Dumbbell,
  Briefcase,
  ShoppingBag,
  PartyPopper,
  Sparkles,
} from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'

const iconMap: Record<string, React.ReactNode> = {
  Coffee: <Coffee className="h-6 w-6" />,
  UtensilsCrossed: <UtensilsCrossed className="h-6 w-6" />,
  BookOpen: <BookOpen className="h-6 w-6" />,
  Dumbbell: <Dumbbell className="h-6 w-6" />,
  Briefcase: <Briefcase className="h-6 w-6" />,
  ShoppingBag: <ShoppingBag className="h-6 w-6" />,
  PartyPopper: <PartyPopper className="h-6 w-6" />,
  Sparkles: <Sparkles className="h-6 w-6" />,
}

export function Categories() {
  return (
    <section id="categories" className="section-spacing">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-title mb-6">
            Explore by <span className="italic">Category</span>
          </h2>
          <p className="text-body-lg text-muted-foreground">
            From cozy cafes to buzzing event venues — find gigs at places you&apos;ll love
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/gigs?category=${category.slug}`}
              className="group card-base card-hover flex flex-col items-center gap-4 p-6 md:p-8 text-center"
            >
              {/* Icon container */}
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                {iconMap[category.icon]}
              </div>

              {/* Label */}
              <span className="font-medium text-sm md:text-base">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
