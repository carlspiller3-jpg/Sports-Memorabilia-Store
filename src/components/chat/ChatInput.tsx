import { Send } from "lucide-react"
import { useState, KeyboardEvent, useRef, useEffect } from "react"

interface ChatInputProps {
    onSend: (message: string) => void
    disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [input, setInput] = useState("")
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleSend = () => {
        if (input.trim() && !disabled) {
            onSend(input.trim())
            setInput("")
            // Reset height
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto'
            }
        }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
        }
    }, [input])

    return (
        <div className="p-4 border-t border-stone/10 bg-white">
            <div className="relative flex items-end gap-2">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    disabled={disabled}
                    rows={1}
                    className="flex-1 bg-stone/5 border-0 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-gold resize-none max-h-32 scrollbar-hide"
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim() || disabled}
                    className="p-3 bg-navy text-white rounded-xl hover:bg-navy/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
