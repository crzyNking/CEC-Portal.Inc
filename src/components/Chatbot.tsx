import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { useChatStore, getWelcomeMessages, getSystemPrompt } from '../store/chatStore'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../lib/supabase'

const CHAT_API_URL = '/api/chat'

const dotStyle1 = { animationDelay: '0ms' }
const dotStyle2 = { animationDelay: '150ms' }
const dotStyle3 = { animationDelay: '300ms' }
const gridPattern = { backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }
const textareaMinHeight = { minHeight: '40px' }

export function Chatbot() {
  const messages = useChatStore((s) => s.messages)
  const isLoading = useChatStore((s) => s.isLoading)
  const isOpen = useChatStore((s) => s.isOpen)
  const addMessage = useChatStore((s) => s.addMessage)
  const setIsLoading = useChatStore((s) => s.setIsLoading)
  const setIsOpen = useChatStore((s) => s.setIsOpen)
  const saveChatHistory = useChatStore((s) => s.saveChatHistory)
  const loadChatHistory = useChatStore((s) => s.loadChatHistory)
  const userData = useChatStore((s) => s.userData)
  const fetchUserData = useChatStore((s) => s.fetchUserData)
  const user = useAuthStore((s) => s.user)

  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const lastMessageCount = useRef(messages.length)
  const abortRef = useRef<AbortController | null>(null)
  const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const displayMessages = useMemo(
    () => messages.filter((m) => m.role !== 'system'),
    [messages]
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      focusTimerRef.current = setTimeout(() => inputRef.current?.focus(), 100)
    }
    return () => {
      if (focusTimerRef.current) clearTimeout(focusTimerRef.current)
    }
  }, [isOpen])

  useEffect(() => {
    if (user) {
      fetchUserData(user.id).then(() => {
        loadChatHistory(user.id)
      })
    } else {
      useChatStore.setState({ messages: getWelcomeMessages(), userData: null })
    }
  }, [user, loadChatHistory, fetchUserData])

  useEffect(() => {
    if (user && messages.length > lastMessageCount.current && messages.some((m) => m.role === 'user')) {
      saveChatHistory(user.id)
    }
    lastMessageCount.current = messages.length
  }, [messages, user, saveChatHistory])

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    addMessage({ role: 'user', content: userMessage })
    setIsLoading(true)

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const systemPrompt = getSystemPrompt(userData)
      const conversationHistory = [
        { role: 'system', content: systemPrompt },
        ...messages
          .filter((m) => m.role === 'user' || m.role === 'assistant')
          .map((m) => ({ role: m.role, content: m.content })),
        { role: 'user' as const, content: userMessage },
      ]

      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          model: 'z-ai/glm-5.2:free',
          messages: conversationHistory,
        }),
        signal: controller.signal,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error?.message || `HTTP ${response.status}`)
      }

      const reply = data.choices?.[0]?.message?.content || 'No response generated.'
      addMessage({ role: 'assistant', content: reply })
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      if (error instanceof TypeError && error.message.includes('abort')) return
      const message = error instanceof Error ? error.message : 'Something went wrong'
      addMessage({ role: 'assistant', content: `Error: ${message}` })
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, messages, userData, addMessage, setIsLoading])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }, [sendMessage])

  const handleToggle = useCallback(() => setIsOpen(!isOpen), [isOpen, setIsOpen])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }, [])

  const handleInput = useCallback((e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement
    target.style.height = 'auto'
    target.style.height = Math.min(target.scrollHeight, 96) + 'px'
  }, [])

  return (
    <>
      <button
        onClick={handleToggle}
        aria-label={isOpen ? 'Close chatbot' : 'Open chatbot'}
        aria-expanded={isOpen}
        className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center overflow-hidden ${
          isOpen
            ? 'bg-gray-800 dark:bg-gray-700 shadow-gray-800/25 dark:shadow-black/30 rotate-90'
            : 'shadow-[#1E4E8C]/25 hover:shadow-xl hover:shadow-[#1E4E8C]/30 hover:scale-105 active:scale-95'
        }`}
      >
        {isOpen ? (
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
                    <img src="https://static.wikia.nocookie.net/wreckitralph/images/2/2d/Knowsmore.png/revision/latest?cb=20190204230437" alt="KnowsMore" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239333ea"><circle cx="12" cy="8" r="4"/><path d="M12 14c-6 0-8 3-8 3v1h16v-1s-2-3-8-3z"/></svg>' }} />
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 left-4 right-4 sm:bottom-24 sm:left-auto sm:right-6 z-50 w-auto sm:w-[380px] max-w-[400px]" role="dialog" aria-label="Chatbot">
          <div className="rounded-[1.5rem] border border-gray-200/50 dark:border-white/[0.06] bg-white/95 dark:bg-[#0f0f1a]/95 backdrop-blur-xl shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden">
            <div className="relative px-5 py-4 bg-gradient-to-r from-[#0B1F3A] to-[#1E4E8C]">
              <div className="absolute inset-0 opacity-20" style={gridPattern} />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl overflow-hidden bg-white/20">
          <img src="https://static.wikia.nocookie.net/wreckitralph/images/2/2d/Knowsmore.png/revision/latest?cb=20190204230437" alt="KnowsMore" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239333ea"><circle cx="12" cy="8" r="4"/><path d="M12 14c-6 0-8 3-8 3v1h16v-1s-2-3-8-3z"/></svg>' }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">KnowsMore</h3>
                    <p className="text-xs text-white/70">Powered by KnowsMore</p>
                  </div>
                </div>
                <button onClick={handleToggle} className="p-2 rounded-lg hover:bg-white/20 transition-colors">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="h-[280px] sm:h-[350px] overflow-y-auto px-4 sm:px-5 py-3 sm:py-4 space-y-3 sm:space-y-4">
              {displayMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[85%]">
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div className="w-5 h-5 rounded-md overflow-hidden">
                           <img src="https://static.wikia.nocookie.net/wreckitralph/images/2/2d/Knowsmore.png/revision/latest?cb=20190204230437" alt="AI" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239333ea"><circle cx="12" cy="8" r="4"/><path d="M12 14c-6 0-8 3-8 3v1h16v-1s-2-3-8-3z"/></svg>' }} />
                        </div>
                        <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">KnowsMore</span>
                      </div>
                    )}
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-[#0B1F3A] to-[#1E4E8C] text-white rounded-br-md'
                          : 'bg-gray-100 dark:bg-white/[0.06] text-gray-900 dark:text-gray-200 rounded-bl-md'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%]">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-5 h-5 rounded-md overflow-hidden">
                         <img src="https://static.wikia.nocookie.net/wreckitralph/images/2/2d/Knowsmore.png/revision/latest?cb=20190204230437" alt="AI" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239333ea"><circle cx="12" cy="8" r="4"/><path d="M12 14c-6 0-8 3-8 3v1h16v-1s-2-3-8-3z"/></svg>' }} />
                      </div>
                      <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">KnowsMore</span>
                    </div>
                    <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-gray-100 dark:bg-white/[0.06]">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={dotStyle1} />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={dotStyle2} />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={dotStyle3} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 py-3 border-t border-gray-200/50 dark:border-white/[0.06] bg-gray-50/80 dark:bg-white/[0.02]">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask KnowsMore anything..."
                  rows={1}
                  className="flex-1 resize-none px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#1E4E8C]/50 focus:ring-1 focus:ring-[#1E4E8C]/50 max-h-24"
                  style={textareaMinHeight}
                  onInput={handleInput}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-[#0B1F3A] to-[#1E4E8C] text-white shadow-md shadow-[#1E4E8C]/20 transition-all duration-200 hover:shadow-lg hover:shadow-[#1E4E8C]/30 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
