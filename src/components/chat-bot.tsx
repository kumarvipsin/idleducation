'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { askChatbot } from '@/ai/flows/chat';
import { MessageSquare, Send, X, Bot, User, Loader } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setMessages([{ sender: 'bot', text: "Hello! How can I help you today?" }]);
    }
  }, [isOpen]);

  useEffect(() => {
    // @ts-ignore
    scrollAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const botResponse = await askChatbot(input);
      const botMessage: Message = { sender: 'bot', text: botResponse };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
      const errorMessage: Message = {
        sender: 'bot',
        text: 'Sorry, something went wrong. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="icon"
          className="rounded-full w-16 h-16 shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-8 w-8" /> : <MessageSquare className="h-8 w-8" />}
        </Button>
      </div>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50">
          <Card className="w-[350px] h-[500px] flex flex-col shadow-2xl">
            <CardHeader className="flex flex-row items-center gap-2">
              <Bot className="w-6 h-6 text-primary" />
              <CardTitle>IDL EDUCATION Assistant</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 ${
                        message.sender === 'user' ? 'justify-end' : ''
                      }`}
                    >
                      {message.sender === 'bot' && (
                        <Avatar className="w-8 h-8">
                            <AvatarFallback>
                                <Bot />
                            </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[80%] ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                       {message.sender === 'user' && (
                        <Avatar className="w-8 h-8">
                            <AvatarFallback>
                                <User />
                            </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                     <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8">
                            <AvatarFallback>
                                <Bot />
                            </AvatarFallback>
                        </Avatar>
                        <div className="rounded-lg px-4 py-2 max-w-[80%] bg-muted flex items-center">
                            <Loader className="w-5 h-5 animate-spin" />
                        </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
