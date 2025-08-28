import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, Bot } from "lucide-react";
import ChatMessage from "./ChatMessage";

interface Message {
  role: "user" | "system";
  content: string;
}

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

const ChatArea = ({ messages, onSendMessage, isLoading = false }: ChatAreaProps) => {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputMessage.trim() && !isLoading) {
      onSendMessage(inputMessage.trim());
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <Card className="border-border shadow-lg mb-4">
        <div className="p-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 bg-gradient-primary rounded-full shadow-glow">
              <Bot className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Estoque.AI
          </h1>
          <p className="text-muted-foreground mt-2">
            Seu assistente inteligente para gestão de estoque
          </p>
        </div>
      </Card>

      {/* Messages Area */}
      <Card className="flex-1 border-border shadow-elevated overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="p-4 bg-muted rounded-full inline-block mb-4">
                    <Bot className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-lg">
                    Pronto para ajudar! Faça sua primeira pergunta.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    role={message.role}
                    content={message.content}
                  />
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-card border border-border rounded-2xl px-4 py-3 shadow-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4">
            <div className="flex gap-3">
              <Textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Pergunte alguma coisa..."
                className="flex-1 min-h-[44px] max-h-32 resize-none bg-input border-border focus:ring-accent"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!inputMessage.trim() || isLoading}
                size="icon"
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow min-w-[44px] h-[44px]"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatArea;