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
  Coffee: <Coffee className="h-7 w-7" />,
  UtensilsCrossed: <UtensilsCrossed className="h-7 w-7" />,
  BookOpen: <BookOpen className="h-7 w-7" />,
  Dumbbell: <Dumbbell className="h-7 w-7" />,
  Briefcase: <Briefcase className="h-7 w-7" />,
  ShoppingBag: <ShoppingBag className="h-7 w-7" />,
  PartyPopper: <PartyPopper className="h-7 w-7" />,
  Sparkles: <Sparkles className="h-7 w-7" />,
}

const colorMap: Record<string, { bg: string; text: string; glow: string }> = {
  amber: { bg: 'from-amber-500/20 to-amber-500/5', text: 'text-amber-400', glow: 'group-hover:shadow-amber-500/20' },
  orange: { bg: 'from-orange-500/20 to-orange-500/5', text: 'text-orange-400', glow: 'group-hover:shadow-orange-500/20' },
  emerald: { bg: 'from-emerald-500/20 to-emerald-500/5', text: 'text-emerald-400', glow: 'group-hover:shadow-emerald-500/20' },
  blue: { bg: 'from-blue-500/20 to-blue-500/5', text: 'text-blue-400', glow: 'group-hover:shadow-blue-500/20' },
  purple: { bg: 'from-purple-500/20 to-purple-500/5', text: 'text-purple-400', glow: 'group-hover:shadow-purple-500/20' },
  pink: { bg: 'from-pink-500/20 to-pink-500/5', text: 'text-pink-400', glow: 'group-hover:shadow-pink-500/20' },
  violet: { bg: 'from-violet-500/20 to-violet-500/5', text: 'text-violet-400', glow: 'group-hover:shadow-violet-500/20' },
  slate: { bg: 'from-slate-500/20 to-slate-500/5', text: 'text-slate-400', glow: 'group-hover:shadow-slate-500/20' },
}

export function Categories() {
  return (
    <section id="categories" className="relative py-24 md:py-36">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/30 to-background" />

      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm">
            <span className="text-muted-foreground">Diverse Opportunities</span>
          </div>
          <h2 className="text-4xl font-bold md:text-5xl mb-6">
            Explore by <span className="gradient-text">Category</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From cozy cafes to buzzing event venues — find gigs at places you&apos;ll love
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {CATEGORIES.map((category) => {
            const colors = colorMap[category.color] || colorMap.slate
            return (
              <Link
                key={category.slug}
                href={`/gigs?category=${category.slug}`}
                className={`group relative flex flex-col items-center gap-4 rounded-2xl border border-white/5 bg-gradient-to-b ${colors.bg} p-6 md:p-8 transition-all duration-300 hover-lift hover:border-white/10 ${colors.glow} hover:shadow-lg`}
              >
                {/* Icon container */}
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 ${colors.text} transition-transform group-hover:scale-110`}>
                  {iconMap[category.icon]}
                </div>

                {/* Label */}
                <span className="text-center font-medium text-sm md:text-base">{category.name}</span>

                {/* Hover glow */}
                <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
