import { useState, useRef, useEffect } from 'react'

export default function Chat({ systemPrompt }) {
  // Keep conversation in memory until refresh
  const [messages, setMessages] = useState([
    { role: 'system', content: systemPrompt }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef(null)

  // Replace with your OpenRouter API key (or another provider).
  // WARNING: This exposes the key publicly. For production, proxy via server.
  const OPENROUTER_API_KEY = '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'

  useEffect(() => {
    // scroll to bottom on new message
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  const appendMessage = (msg) => {
    setMessages(prev => [...prev, msg])
  }

  const send = async () => {
    const text = input.trim()
    if (!text) return

    const newUserMessage = { role: 'user', content: text }
    const newMessages = [...messages, newUserMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const body = {
        model: 'google/gemini-2.5-flash',
        messages: newMessages,
      }

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.text()
        appendMessage({
          role: 'assistant',
          content: '⚠️ API error: ' + res.status + ' - ' + err,
        })
        setLoading(false)
        return
      }

      const data = await res.json()
      // Try multiple possible shapes
      const reply =
        (data?.choices && data.choices[0]?.message?.content) ||
        data?.choices?.[0]?.text ||
        JSON.stringify(data)
      appendMessage({ role: 'assistant', content: reply })
    } catch (e) {
      appendMessage({
        role: 'assistant',
        content: '⚠️ Network or parsing error: ' + e.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const clearConversation = () => {
    setMessages([{ role: 'system', content: systemPrompt }])
  }

  return (
    <div className="chat">
      <div className="chat-window" ref={listRef}>
        {messages.filter(m => m.role !== 'system').map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'msg user' : 'msg assistant'}>
            {/* <div className="role">{m.role}</div> */}
            <div className="content">{m.content}</div>
          </div>
        ))}
        {loading && <div className="msg assistant"><div className="content">typing…</div></div>}
      </div>

      <div className="controls">
        {/* <textarea
          rows={2}
          placeholder="Say something (like how you're feeling)..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
        /> */}
        <input
          type="text"
          placeholder="Whisper your desires..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          className="textInput"
        />
        <div className="buttons">
          <button onClick={send} disabled={loading}>Send</button>
          <button onClick={clearConversation}>Clear Chat</button>
        </div>
      </div>

      <div className="hint">
        <strong>Note:</strong> Its just an AI model.
      </div>
    </div>
  )
}
