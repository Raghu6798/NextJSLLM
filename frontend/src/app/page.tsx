"use client"

import { useState, useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "bot"; content: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async () => {
    if (!message.trim()) return

    setLoading(true)
    setError("")
    const userMessage = { role: "user" as const, content: message }
    setChatHistory((prev) => [...prev, userMessage])

    try {
      const res = await fetch(`http://127.0.0.1:8000/chat/${encodeURIComponent(message)}`)
      if (res.ok) {
        const data = await res.json()
        const botMessage = { role: "bot" as const, content: data.response }
        setChatHistory((prev) => [...prev, botMessage])
      } else {
        throw new Error(`Failed to fetch response: ${res.status} ${res.statusText}`)
      }
    } catch (error) {
      console.error("Error during fetch:", error)
      setError("An error occurred while fetching the response. Please try again.")
    } finally {
      setLoading(false)
      setMessage("")
    }
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [chatHistory])

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Langchain Chat Bot</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4" ref={scrollAreaRef}>
            {chatHistory.map((chat, index) => (
              <div key={index} className={`mb-4 ${chat.role === "user" ? "text-right" : "text-left"}`}>
                <div
                  className={`inline-block p-2 rounded-lg ${
    chat.role === "user" ? "bg-black text-white" : "bg-gray-200 text-black"
  }`}
                >
                  <ReactMarkdown>{chat.content}</ReactMarkdown>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit()
            }}
            className="flex w-full space-x-2"
          >
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message"
              className="flex-grow"
            />
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send"}
            </Button>
          </form>
        </CardFooter>
      </Card>
      {error && <div className="mt-4 text-center text-red-500">{error}</div>}
    </div>
  )
}
