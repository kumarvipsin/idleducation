'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { askChatbot } from '@/ai/flows/chat';
import { MessageSquare, Send, X, Bot, User, Loader, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ sender: 'bot', text: "Hello! How can I help you today?" }]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
          className="rounded-full w-16 h-16 shadow-lg bg-primary hover:bg-primary/90 transition-transform hover:scale-110"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-8 w-8" /> : <MessageSquare className="h-8 w-8" />}
        </Button>
      </div>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50">
          <Card className="w-[350px] h-[500px] flex flex-col shadow-2xl rounded-2xl border-border/40">
            <CardHeader className="flex flex-row items-center gap-3 p-4 border-b">
                <div className="bg-primary/10 p-2 rounded-full">
                    <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <CardTitle className="text-lg">AI Assistant</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 ${
                        message.sender === 'user' ? 'justify-end' : ''
                      }`}
                    >
                      {message.sender === 'bot' && (
                        <Avatar className="w-8 h-8 border-2 border-primary/20">
                            <AvatarFallback className="bg-primary/10">
                                <Bot className="text-primary"/>
                            </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-xl px-4 py-2 max-w-[80%] text-sm ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground rounded-br-none'
                            : 'bg-muted rounded-bl-none'
                        }`}
                      >
                        <p>{message.text}</p>
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
                        <Avatar className="w-8 h-8 border-2 border-primary/20">
                            <AvatarFallback className="bg-primary/10">
                                <Bot className="text-primary"/>
                            </AvatarFallback>
                        </Avatar>
                        <div className="rounded-xl px-4 py-2 max-w-[80%] bg-muted rounded-bl-none flex items-center space-x-2">
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></span>
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse delay-300"></span>
                        </div>
                    </div>
                  )}
                   <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  disabled={isLoading}
                  className="rounded-full focus-visible:ring-1"
                />
                <Button type="submit" size="icon" disabled={isLoading} className="rounded-full">
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
