
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, X, Bot, User } from 'lucide-react';
import { askChatbot } from '@/ai/flows/chat';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { AnimatePresence, motion } from 'framer-motion';

type Message = {
  text: string;
  sender: 'user' | 'bot';
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const botResponse = await askChatbot(input);
      const botMessage: Message = { text: botResponse, sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: 'bot',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 z-50"
          >
            <Card className="w-80 h-[28rem] shadow-lg rounded-xl flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between p-4 bg-primary text-primary-foreground rounded-t-xl">
                <div className="flex items-center gap-2">
                   <Bot className="w-6 h-6" />
                   <CardTitle className="text-base">IDL EDUCATION Assistant</CardTitle>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary/80" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden">
                 <ScrollArea className="h-full" ref={scrollAreaRef}>
                  <div className="p-4 space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex items-end gap-2 ${
                          message.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                         {message.sender === 'bot' && (
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={14}/></AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                            message.sender === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          {message.text}
                        </div>
                         {message.sender === 'user' && (
                          <Avatar className="w-6 h-6">
                             <AvatarFallback><User size={14}/></AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                       <div className="flex items-end gap-2 justify-start">
                         <Avatar className="w-6 h-6">
                           <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={14}/></AvatarFallback>
                         </Avatar>
                         <div className="max-w-[80%] rounded-lg px-3 py-2 text-sm bg-muted flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-pulse delay-0"></span>
                            <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-pulse delay-150"></span>
                            <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-pulse delay-300"></span>
                         </div>
                       </div>
                    )}
                  </div>
                 </ScrollArea>
              </CardContent>
              <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                      <Input
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                          placeholder="Type a message..."
                          disabled={isLoading}
                      />
                      <Button onClick={handleSend} disabled={isLoading}>
                          <Send className="h-4 w-4" />
                      </Button>
                  </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        className="fixed bottom-4 right-4 rounded-full h-16 w-16 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>
    </>
  );
}
