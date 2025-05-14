"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (rating: number, review?: string) => void
  title: string
  type: "movie" | "tv"
}

export default function RatingDialog({ open, onOpenChange, onSubmit, title, type }: RatingDialogProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [review, setReview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) return

    setIsSubmitting(true)
    await onSubmit(rating, review)
    setIsSubmitting(false)
    resetForm()
  }

  const resetForm = () => {
    setRating(0)
    setHoverRating(0)
    setReview("")
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) resetForm()
        onOpenChange(newOpen)
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate this {type}</DialogTitle>
          <DialogDescription>Share your thoughts about {title}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-4 space-y-6">
          <div className="flex items-center justify-center space-x-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
              >
                <Star
                  className={cn(
                    "w-8 h-8 transition-all",
                    (hoverRating || rating) >= value ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground",
                  )}
                />
              </button>
            ))}
          </div>

          <div className="text-center">
            <span className="text-2xl font-bold">{rating || hoverRating || "?"}</span>
            <span className="text-lg">/10</span>
          </div>

          <Textarea
            placeholder="Write your review (optional)"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={rating === 0 || isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Rating"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
