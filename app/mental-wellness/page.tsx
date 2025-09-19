'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useMentalHealthChat } from '@/lib/hooks'
import { aiUtils } from '@/lib/ai'
import { Brain, MessageCircle, Send, Heart, Smile, Frown, Meh, RefreshCw, Lightbulb, Users, Activity } from 'lucide-react'
import { toast } from 'sonner'

export default function MentalWellnessPage() {
  const { conversation, loading, error, sendMessage, clearConversation } = useMentalHealthChat()
  const [message, setMessage] = useState('')
  const [sessionType, setSessionType] = useState<'CHAT' | 'MOOD_CHECK' | 'STRESS_ASSESSMENT' | 'GUIDED_MEDITATION'>('CHAT')
  const [moodBefore, setMoodBefore] = useState<number>(5)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [conversation])

  const handleSendMessage = async () => {
    if (!message.trim()) return

    try {
      await sendMessage({
        message,
        sessionType,
        moodBefore: sessionType === 'MOOD_CHECK' ? moodBefore : undefined
      })
      setMessage('')
    } catch (err) {
      toast.error('Failed to send message')
    }
  }

  const handleQuickMessage = (quickMessage: string) => {
    setMessage(quickMessage)
  }

  const moodEmojis = [
    { value: 1, emoji: '😢', label: 'Very Sad' },
    { value: 2, emoji: '😞', label: 'Sad' },
    { value: 3, emoji: '😐', label: 'Neutral' },
    { value: 4, emoji: '🙂', label: 'Good' },
    { value: 5, emoji: '😊', label: 'Happy' },
    { value: 6, emoji: '😄', label: 'Very Happy' },
    { value: 7, emoji: '🤗', label: 'Excited' },
    { value: 8, emoji: '😍', label: 'Amazing' },
    { value: 9, emoji: '🥰', label: 'Blissful' },
    { value: 10, emoji: '🤩', label: 'Euphoric' }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Mental Wellness
            </h1>
            <p className="text-muted-foreground">AI-powered mental health support and guidance</p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={clearConversation}
              disabled={conversation.length === 0}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              New Session
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Session Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Session Type */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Session Type
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={sessionType} onValueChange={(value: any) => setSessionType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CHAT">General Chat</SelectItem>
                    <SelectItem value="MOOD_CHECK">Mood Check</SelectItem>
                    <SelectItem value="STRESS_ASSESSMENT">Stress Assessment</SelectItem>
                    <SelectItem value="GUIDED_MEDITATION">Guided Meditation</SelectItem>
                  </SelectContent>
                </Select>

                {sessionType === 'MOOD_CHECK' && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Current Mood (1-10)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {moodEmojis.map((mood) => (
                        <Button
                          key={mood.value}
                          variant={moodBefore === mood.value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setMoodBefore(mood.value)}
                          className="flex items-center gap-2"
                        >
                          <span>{mood.emoji}</span>
                          <span className="text-xs">{mood.value}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Prompts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Quick Starters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(aiUtils.mentalHealthPrompts).map(([category, prompts]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-sm font-medium capitalize">{category.replace('_', ' ')}</h4>
                    {prompts.slice(0, 2).map((prompt, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="w-full text-left justify-start h-auto py-2 px-3"
                        onClick={() => handleQuickMessage(prompt)}
                      >
                        <span className="text-xs text-muted-foreground line-clamp-2">{prompt}</span>
                      </Button>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Wellness Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Wellness Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Badge variant="outline" className="w-full justify-start">
                    <Activity className="w-3 h-3 mr-2" />
                    Take deep breaths
                  </Badge>
                  <Badge variant="outline" className="w-full justify-start">
                    <Users className="w-3 h-3 mr-2" />
                    Connect with others
                  </Badge>
                  <Badge variant="outline" className="w-full justify-start">
                    <Smile className="w-3 h-3 mr-2" />
                    Practice gratitude
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3"
          >
            <Card className="h-[700px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Mental Health Assistant
                </CardTitle>
                <CardDescription>
                  A safe space to talk about your mental health and get support
                </CardDescription>
              </CardHeader>

              {/* Chat Messages */}
              <CardContent className="flex-1 flex flex-col">
                <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4">
                  <div className="space-y-4">
                    {conversation.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12"
                      >
                        <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Welcome to Your Mental Wellness Space</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                          This is a safe, confidential space where you can talk about your feelings, stress, or any mental health concerns.
                        </p>
                        <Badge variant="secondary" className="mb-4">
                          Your privacy is protected
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          Start by typing a message or selecting a quick starter from the sidebar.
                        </p>
                      </motion.div>
                    )}

                    <AnimatePresence>
                      {conversation.map((msg, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-4 ${
                              msg.type === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                            <p className="text-xs opacity-70 mt-2">
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {loading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="bg-muted rounded-lg p-4 max-w-[80%]">
                          <div className="flex items-center gap-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span className="text-sm text-muted-foreground">AI is thinking...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>

                {error && (
                  <div className="mt-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                    {error}
                  </div>
                )}

                <Separator className="my-4" />

                {/* Message Input */}
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share what's on your mind..."
                    className="flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    disabled={loading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || loading}
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-2 text-center">
                  This AI assistant provides support but is not a replacement for professional mental health care.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
