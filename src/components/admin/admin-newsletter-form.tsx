'use client'

import type React from 'react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { adminNewsletterContent } from '@/data/content/admin-content'
import { toastContent } from '@/data/content/toast-content'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { useStatusTimer } from '@/hooks/use-status-timer'
import { broadcastNewsletter } from '@/lib/actions/newsletter-actions'
import type { BlogPost } from '@/types/blog'

export function AdminNewsletterForm({ blogs }: { blogs: BlogPost[] }) {
  const [adminSecret, setAdminSecret] = useState('')
  const [selectedBlogSlug, setSelectedBlogSlug] = useState(blogs[0]?.slug || '')
  const [loading, setLoading] = useState(false)
  const { success, countdown, startCountdown, resetStatus } = useStatusTimer('admin-newsletter')
  const { error: errorSound } = useSoundEffects()

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    setLoading(true)
    resetStatus()

    if (!adminSecret) {
      errorSound()
      toast.error(toastContent.newsletter.passwordRequired)
      setLoading(false)
      return
    }

    try {
      const response = await broadcastNewsletter(selectedBlogSlug, adminSecret)

      if (!response.success) {
        errorSound()
        toast.error(response.error)
      } else {
        toast.success(toastContent.newsletter.broadcastSuccess(response.data.count))
        setAdminSecret('')
        startCountdown(3)
      }
    } catch {
      errorSound()
      toast.error(toastContent.newsletter.unexpectedError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="space-y-3">
        <Select
          value={selectedBlogSlug}
          onValueChange={setSelectedBlogSlug}
          disabled={loading || countdown > 0}
        >
          <SelectTrigger>
            <SelectValue placeholder={adminNewsletterContent.blogSelectPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {blogs.map((blog) => (
              <SelectItem key={blog.slug} value={blog.slug}>
                <span className="text-balance">{blog.title}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="password"
          value={adminSecret}
          onChange={(e) => setAdminSecret(e.target.value)}
          placeholder={adminNewsletterContent.adminPasswordPlaceholder}
          disabled={loading || countdown > 0}
          required
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading || countdown > 0}
          isPending={loading}
          isSuccess={success}
          countdown={countdown}
          loadingText={adminNewsletterContent.buttonLoading}
          successText={adminNewsletterContent.buttonSuccess}
          successIcon={Icons.mailCheck}
          defaultText={adminNewsletterContent.buttonDefault}
          defaultIcon={Icons.broadcast}
        />
      </div>
    </form>
  )
}
