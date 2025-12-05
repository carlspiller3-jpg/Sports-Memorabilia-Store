interface QuickRepliesProps {
  replies: string[]
  onSelect: (reply: string) => void
}

export function QuickReplies({ replies, onSelect }: QuickRepliesProps) {
  if (!replies || replies.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 px-4 pb-4">
      {replies.map((reply, index) => (
        <button
          key={index}
          onClick={() => onSelect(reply)}
          className="px-4 py-2 bg-white border border-gold/30 text-navy rounded-full text-sm hover:bg-gold/10 transition-colours"
        >
          {reply}
        </button>
      ))}
    </div>
  )
}
