import { useState, useEffect, useRef, useCallback } from 'react'
import { MessageCircle, X, Loader2 } from 'lucide-react'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { QuickReplies } from './QuickReplies'
import { chatEngine } from '@/lib/chatbot/engine'
import { chatMemory, type Message } from '@/lib/chatbot/memory'
import type { Product } from '@/types/schema'
import { supabase } from '@/lib/supabaseClient'

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [unreadCount, setUnreadCount] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [quickReplies, setQuickReplies] = useState<string[]>([])
  const [currentProducts, setCurrentProducts] = useState<Product[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasInitialized = useRef(false)

  // Scroll references
  const [showScrollButton, setShowScrollButton] = useState(false)
  const desktopMessagesRef = useRef<HTMLDivElement>(null)
  const mobileMessagesRef = useRef<HTMLDivElement>(null)

  const generateId = () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Check lock state helper
  const isShopLocked = () => {
    if (typeof window === 'undefined') return false
    return sessionStorage.getItem("shop_unlocked") !== "true"
  }

  const initializeChat = useCallback(async () => {
    setIsLoading(true)
    const locked = isShopLocked()
    const response = await chatEngine.processMessage('', locked)
    const botMessage: Message = {
      id: generateId(),
      role: 'bot',
      content: response.message,
      timestamp: new Date()
    }
    setMessages([botMessage])
    chatMemory.addMessage(botMessage)
    setQuickReplies(response.quickReplies || [])
    if (response.products) {
      setCurrentProducts(prev => {
        const newProducts = response.products!.filter(p => !prev.find(existing => existing.id === p.id))
        return [...prev, ...newProducts]
      })
    }
    setIsLoading(false)
  }, [])

  // 1. Initialize on Mount
  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    // Clear any existing chat history to start fresh
    chatMemory.clear()

    // Start with fresh greeting
    setTimeout(() => initializeChat(), 0)

    // Clear chat when user leaves the website
    const handleBeforeUnload = () => {
      chatMemory.clear()
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [initializeChat])

  // 2. Listen for Unlock Event
  useEffect(() => {
    const handleUnlock = () => {
      // Add the "Access Granted" message
      const unlockMsg: Message = {
        id: `sys_${Date.now()}`,
        role: 'bot',
        content: "🔓 **ACCESS GRANTED**\n\nWelcome to the Vault. The collection is now available to you.\n\nWe have just stocked some rare F1 and Football items. What would you like to see?",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, unlockMsg])
      chatMemory.addMessage(unlockMsg)

      // Trigger notification
      setUnreadCount(prev => prev + 1)
    }

    window.addEventListener('shop_unlocked', handleUnlock)
    return () => window.removeEventListener('shop_unlocked', handleUnlock)
  }, [])

  // 3. Clear badges on open
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0)
    }
  }, [isOpen])

  // Detect if user has scrolled up
  const handleScroll = () => {
    const container = desktopMessagesRef.current || mobileMessagesRef.current
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50

    setShowScrollButton(!isAtBottom)
  }

  // Always auto-scroll to bottom when messages change
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM has updated
    requestAnimationFrame(() => {
      // Scroll both desktop and mobile containers
      if (desktopMessagesRef.current) {
        desktopMessagesRef.current.scrollTop = desktopMessagesRef.current.scrollHeight
      }
      if (mobileMessagesRef.current) {
        mobileMessagesRef.current.scrollTop = mobileMessagesRef.current.scrollHeight
      }
    })
  }, [messages, currentProducts, isLoading])

  const scrollToBottom = () => {
    const container = desktopMessagesRef.current || mobileMessagesRef.current
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      })
    }
    setShowScrollButton(false)
  }

  const handleSendMessage = async (content: string) => {
    const locked = isShopLocked()

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    chatMemory.addMessage(userMessage)
    setQuickReplies([])

    // Get bot response
    setIsLoading(true)
    const response = await chatEngine.processMessage(content, locked)

    // HANDLE ACTIONS
    if (response.action === 'scroll_waitlist') {
      const waitlist = document.getElementById('waitlist')
      if (waitlist) {
        waitlist.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.location.href = '/#waitlist'
      }
    }

    // HANDLE CAPTURED DATA (Lead Gen)
    if (response.capturedData) {
      try {
        const { email, interest } = response.capturedData

        // 1. Supabase Insert
        const { error } = await supabase
          .from('newsletter_subscribers')
          .insert([{
            email,
            interest: interest || 'General',
            referral_code: 'CHATBOT'
          }])

        if (error && error.code !== '23505') {
          console.error("Supabase Error:", error)
        }

        // 2. Klaviyo Sync
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            referralCode: `INTEREST-${(interest || 'General').toUpperCase()}`
          })
        })
      } catch (e) {
        console.error("Failed to sync interest", e)
      }
    }

    const botMessage: Message = {
      id: generateId(),
      role: 'bot',
      content: response.message,
      timestamp: new Date(),
      productIds: response.products?.map(p => p.id)
    }

    setMessages(prev => [...prev, botMessage])
    chatMemory.addMessage(botMessage)
    setQuickReplies(response.quickReplies || [])
    if (response.products) {
      setCurrentProducts(prev => {
        const newProducts = response.products!.filter(p => !prev.find(existing => existing.id === p.id))
        return [...prev, ...newProducts]
      })
    }
    setIsLoading(false)
  }

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply)
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gold text-navy p-4 rounded-full shadow-2xl hover:bg-gold/90 transition-all hover:scale-110 z-50 group"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-ivory rounded-2xl shadow-2xl flex flex-col z-50 border border-stone/20 md:block hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-charcoal text-ivory p-4 rounded-t-2xl flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center shadow-lg">
                <MessageCircle className="w-5 h-5 text-navy" />
              </div>
              <div>
                <h3 className="font-semibold text-gold">Sports Memorabilia</h3>
                <p className="text-xs text-ivory/70 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Online now
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colours"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={desktopMessagesRef}
            onScroll={handleScroll}
            className="flex-1 min-h-0 max-h-[400px] overflow-y-scroll p-4 bg-ivory flex flex-col scrollbar-custom relative"
          >
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                products={message.productIds ? currentProducts.filter(p => message.productIds?.includes(p.id)) : undefined}
              />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-white border border-stone/20 rounded-2xl px-4 py-3 shadow-sm">
                  <Loader2 className="w-5 h-5 animate-spin text-gold" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />

            {/* Scroll to Bottom Button */}
            {showScrollButton && (
              <button
                onClick={scrollToBottom}
                className="absolute bottom-4 right-4 bg-navy text-white p-2 rounded-full shadow-lg hover:bg-gold hover:text-navy transition-all z-10"
                aria-label="Scroll to bottom"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
            )}
          </div>

          {/* Quick Replies */}
          {quickReplies.length > 0 && !isLoading && (
            <QuickReplies replies={quickReplies} onSelect={handleQuickReply} />
          )}

          {/* Input */}
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      )}

      {/* Mobile Full Screen */}
      {isOpen && (
        <div className="fixed inset-0 bg-ivory z-50 flex flex-col md:hidden animate-in slide-in-from-bottom flex flex-col h-[100dvh]">
          {/* Header */}
          <div className="bg-charcoal text-ivory p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center shadow-lg">
                <MessageCircle className="w-5 h-5 text-navy" />
              </div>
              <div>
                <h3 className="font-semibold text-gold">Sports Memorabilia</h3>
                <p className="text-xs text-ivory/70 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Online now
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colours"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={mobileMessagesRef}
            onScroll={handleScroll}
            className="flex-1 min-h-0 overflow-y-scroll p-4 flex flex-col scrollbar-custom relative bg-ivory"
          >
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                products={message.productIds ? currentProducts.filter(p => message.productIds?.includes(p.id)) : undefined}
              />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-white border border-stone/20 rounded-2xl px-4 py-3 shadow-sm">
                  <Loader2 className="w-5 h-5 animate-spin text-gold" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />

            {/* Scroll to Bottom Button */}
            {showScrollButton && (
              <button
                onClick={scrollToBottom}
                className="absolute bottom-4 right-4 bg-navy text-white p-2 rounded-full shadow-lg hover:bg-gold hover:text-navy transition-all z-10"
                aria-label="Scroll to bottom"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
            )}
          </div>

          {/* Quick Replies */}
          {quickReplies.length > 0 && !isLoading && (
            <QuickReplies replies={quickReplies} onSelect={handleQuickReply} />
          )}

          {/* Input */}
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      )}
    </>
  )
}
