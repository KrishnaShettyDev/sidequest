'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { CATEGORIES, ALL_AREAS, SCHEDULE_TYPES } from '@/lib/constants'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'

interface GigFiltersProps {
  search: string
  setSearch: (value: string) => void
  category: string
  setCategory: (value: string) => void
  area: string
  setArea: (value: string) => void
  scheduleType: string
  setScheduleType: (value: string) => void
  onClearFilters: () => void
}

export function GigFilters({
  search,
  setSearch,
  category,
  setCategory,
  area,
  setArea,
  scheduleType,
  setScheduleType,
  onClearFilters,
}: GigFiltersProps) {
  const hasActiveFilters = category || area || scheduleType

  const FilterContent = () => (
    <div className="space-y-4">
      {/* Category */}
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map(cat => (
              <SelectItem key={cat.slug} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Area */}
      <div className="space-y-2">
        <Label>Area</Label>
        <Select value={area} onValueChange={setArea}>
          <SelectTrigger>
            <SelectValue placeholder="All areas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All areas</SelectItem>
            {ALL_AREAS.map(a => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Schedule Type */}
      <div className="space-y-2">
        <Label>Schedule</Label>
        <Select value={scheduleType} onValueChange={setScheduleType}>
          <SelectTrigger>
            <SelectValue placeholder="Any schedule" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any schedule</SelectItem>
            {SCHEDULE_TYPES.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="w-full"
        >
          <X className="mr-2 h-4 w-4" />
          Clear all filters
        </Button>
      )}
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search gigs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Mobile Filter Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Filter gigs by category, area, and schedule
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:flex gap-3">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map(cat => (
              <SelectItem key={cat.slug} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={area} onValueChange={setArea}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All areas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All areas</SelectItem>
            {ALL_AREAS.map(a => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={scheduleType} onValueChange={setScheduleType}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Any schedule" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any schedule</SelectItem>
            {SCHEDULE_TYPES.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters (Mobile) */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 md:hidden">
          {category && category !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {CATEGORIES.find(c => c.slug === category)?.name}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setCategory('all')}
              />
            </Badge>
          )}
          {area && area !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {area}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setArea('all')}
              />
            </Badge>
          )}
          {scheduleType && scheduleType !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {SCHEDULE_TYPES.find(t => t.value === scheduleType)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setScheduleType('all')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
