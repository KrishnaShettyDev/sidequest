'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Loader2,
  Send,
  MessageSquare,
  ArrowLeft,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

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
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    const loadConversations = async () => {
      const { data: { session } } = await supabase.auth.getSession(); const user = session?.user

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
          student:student_profiles(first_name, last_name, photo_url, college)
        `)
        .eq('employer_id', user.id)
        .order('last_message_at', { ascending: false }) as { data: Conversation[] | null }

      if (convos) {
        // Get last message for each conversation
        const convosWithMessages = await Promise.all(
          convos.map(async (convo) => {
            const { data: lastMsg } = await supabase
              .from('messages')
              .select('content, sender_role')
              .eq('conversation_id', convo.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .single() as { data: { content: string; sender_role: string } | null }

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
        .order('created_at', { ascending: true }) as { data: Message[] | null }

      if (data) {
        setMessages(data)

        // Mark messages as read
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', selectedConversation.id)
    }

    setIsSending(false)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 pt-24 bg-muted/30">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-8">Messages</h1>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Conversations List */}
            <Card className="lg:col-span-1">
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  {conversations.length > 0 ? (
                    <div className="divide-y">
                      {conversations.map((convo) => (
                        <button
                          key={convo.id}
                          onClick={() => setSelectedConversation(convo)}
                          className={cn(
                            'w-full p-4 text-left hover:bg-muted/50 transition-colors',
                            selectedConversation?.id === convo.id && 'bg-muted'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={convo.student?.photo_url || undefined} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {convo.student?.first_name?.[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {convo.student?.first_name} {convo.student?.last_name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {convo.student?.college}
                              </p>
                              {convo.lastMessage && (
                                <p className="text-sm text-muted-foreground truncate">
                                  {convo.lastMessage.sender_role === 'employer' ? 'You: ' : ''}
                                  {convo.lastMessage.content}
                                </p>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(convo.last_message_at), { addSuffix: true })}
                            </span>
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
              </CardContent>
            </Card>

            {/* Chat Window */}
            <Card className="lg:col-span-2">
              <CardContent className="p-0 h-[600px] flex flex-col">
                {selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setSelectedConversation(null)}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedConversation.student?.photo_url || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {selectedConversation.student?.first_name?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {selectedConversation.student?.first_name} {selectedConversation.student?.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedConversation.student?.college}
                        </p>
                      </div>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={cn(
                              'flex',
                              msg.sender_role === 'employer' ? 'justify-end' : 'justify-start'
                            )}
                          >
                            <div
                              className={cn(
                                'max-w-[70%] rounded-lg px-4 py-2',
                                msg.sender_role === 'employer'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              )}
                            >
                              <p className="text-sm">{msg.content}</p>
                              <p
                                className={cn(
                                  'text-xs mt-1',
                                  msg.sender_role === 'employer'
                                    ? 'text-primary-foreground/70'
                                    : 'text-muted-foreground'
                                )}
                              >
                                {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
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
                          placeholder="Type a message..."
                          disabled={isSending}
                        />
                        <Button type="submit" disabled={isSending || !newMessage.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">Select a conversation to start chatting</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
