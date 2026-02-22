'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { EmployerLayout } from '@/components/employer/EmployerLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Loader2,
  Send,
  MessageSquare,
  ArrowLeft,
  Search,
  User,
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface Conversation {
  id: string
  student_id: string
  last_message_at: string
  student: {
    first_name: string
    last_name: string
    photo_url: string | null
    college: string
  }
  application?: {
    status: string
  }
  lastMessage?: {
    content: string
    sender_role: string
  }
}

interface Message {
  id: string
  content: string
  sender_role: string
  created_at: string
  is_read: boolean
}

export default function EmployerMessagesPage() {
  const router = useRouter()
  const supabase = createClient()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [userId, setUserId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    const loadConversations = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user

      if (!user) {
        router.push('/?login=required')
        return
      }

      setUserId(user.id)

      const { data: convos } = await supabase
        .from('conversations')
        .select(`
          id,
          student_id,
          last_message_at,
          student:student_profiles(first_name, last_name, photo_url, college),
          application:applications(status)
        `)
        .eq('employer_id', user.id)
        .order('last_message_at', { ascending: false })

      if (convos) {
        // Get last message for each conversation
        const convosWithMessages = await Promise.all(
          convos.map(async (convo: any) => {
            const { data: lastMsg } = await supabase
              .from('messages')
              .select('content, sender_role')
              .eq('conversation_id', convo.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .single()

            return { ...convo, lastMessage: lastMsg || undefined }
          })
        )
        setConversations(convosWithMessages)
      }

      setIsLoading(false)
    }

    loadConversations()
  }, [supabase, router])

  useEffect(() => {
    if (!selectedConversation) return

    const loadMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', selectedConversation.id)
        .order('created_at', { ascending: true })

      if (data) {
        setMessages(data)

        // Mark messages as read
        await supabase
          .from('messages')
          .update({ is_read: true })
          .eq('conversation_id', selectedConversation.id)
          .eq('sender_role', 'student')
          .eq('is_read', false)
      }
    }

    loadMessages()

    // Subscribe to new messages
    const channel = supabase
      .channel(`messages:${selectedConversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversation.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedConversation, supabase])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation || !userId) return

    setIsSending(true)

    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: selectedConversation.id,
        sender_id: userId,
        sender_role: 'employer',
        content: newMessage.trim(),
      })

    if (!error) {
      setNewMessage('')
      // Update last_message_at
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', selectedConversation.id)
    }

    setIsSending(false)
  }

  const filteredConversations = conversations.filter((convo) =>
    searchQuery
      ? `${convo.student?.first_name} ${convo.student?.last_name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      : true
  )

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return format(date, 'h:mm a')
    } else if (diffDays < 7) {
      return format(date, 'EEE')
    } else {
      return format(date, 'MMM d')
    }
  }

  if (isLoading) {
    return (
      <EmployerLayout>
        <div className="flex flex-1 items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </EmployerLayout>
    )
  }

  return (
    <EmployerLayout>
      <div className="bg-muted/30 min-h-full">
        <div className="container py-6 max-w-6xl">
          {/* Back Link */}
          <Link
            href="/employer/applications"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Applications
          </Link>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">
              Dashboard - Inbox
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {conversations.length} Chats
              </span>
            </h1>
          </div>

          <div className="grid gap-6 lg:grid-cols-[320px_1fr] h-[calc(100vh-220px)]">
            {/* Conversations List */}
            <Card className="overflow-hidden">
              <div className="p-3 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <ScrollArea className="h-[calc(100%-60px)]">
                {filteredConversations.length > 0 ? (
                  <div className="divide-y">
                    {filteredConversations.map((convo) => (
                      <button
                        key={convo.id}
                        onClick={() => setSelectedConversation(convo)}
                        className={cn(
                          'w-full p-4 text-left hover:bg-muted/50 transition-colors',
                          selectedConversation?.id === convo.id && 'bg-muted'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage src={convo.student?.photo_url || undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {convo.student?.first_name?.[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-medium truncate text-sm">
                                {convo.student?.first_name} {convo.student?.last_name}
                              </p>
                              <span className="text-xs text-muted-foreground flex-shrink-0">
                                {formatTime(convo.last_message_at)}
                              </span>
                            </div>
                            {convo.lastMessage ? (
                              <p className="text-sm text-muted-foreground truncate">
                                {convo.lastMessage.sender_role === 'employer'
                                  ? 'You: '
                                  : ''}
                                {convo.lastMessage.content}
                              </p>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                Click to start chat
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No conversations yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Conversations with applicants will appear here
                    </p>
                  </div>
                )}
              </ScrollArea>
            </Card>

            {/* Chat Window */}
            <Card className="flex flex-col overflow-hidden">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setSelectedConversation(null)}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={selectedConversation.student?.photo_url || undefined}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {selectedConversation.student?.first_name?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {selectedConversation.student?.first_name}{' '}
                          {selectedConversation.student?.last_name}
                        </p>
                        {selectedConversation.application?.status && (
                          <Badge variant="secondary" className="text-xs">
                            {selectedConversation.application.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/employer/applications">
                        <User className="h-4 w-4 mr-2" />
                        View Profile
                      </Link>
                    </Button>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={cn(
                            'flex',
                            msg.sender_role === 'employer'
                              ? 'justify-end'
                              : 'justify-start'
                          )}
                        >
                          <div
                            className={cn(
                              'max-w-[70%] rounded-lg px-4 py-2',
                              msg.sender_role === 'employer'
                                ? 'bg-foreground text-background'
                                : 'bg-muted'
                            )}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            <p
                              className={cn(
                                'text-xs mt-1',
                                msg.sender_role === 'employer'
                                  ? 'text-background/70'
                                  : 'text-muted-foreground'
                              )}
                            >
                              {format(new Date(msg.created_at), 'MMM d, h:mm a')}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <form onSubmit={sendMessage} className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        disabled={isSending}
                        className="flex-1"
                      />
                      <Button
                        type="submit"
                        disabled={isSending || !newMessage.trim()}
                        className="bg-amber-500 hover:bg-amber-600"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">
                      Select a chat to start messaging
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </EmployerLayout>
  )
}
