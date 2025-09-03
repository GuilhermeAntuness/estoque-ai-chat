import { useState, useEffect } from "react";
import { toast } from "sonner";
import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";
import { getConfig, saveConfig as saveConfigApi } from "@/api/configApi";
import { sendMessage as sendMessageApi } from "@/api/chatApi";

interface Message {
  role: "user" | "system";
  content: string;
}

interface Config {
  apikey: string;
  doc: string;
}

const Index = () => {
  const [apiKey, setApiKey] = useState("");
  const [documentation, setDocumentation] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Load config on mount
  useEffect(() => {
    loadConfig();
    
    // Load session from localStorage
    const savedSession = localStorage.getItem("estoque_ai_session");
    if (savedSession) {
      setSessionId(savedSession);
    }

    // Load messages from localStorage
    const savedMessages = localStorage.getItem("estoque_ai_messages");
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error("Error parsing saved messages:", error);
      }
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("estoque_ai_messages", JSON.stringify(messages));
    }
  }, [messages]);

  const loadConfig = async () => {
    try {
      const config: Config = await getConfig();
      setApiKey(config.apikey || "");
      setDocumentation(config.doc || "");
    } catch (error) {
      console.error("Error loading config:", error);
      toast.error("Erro ao carregar configuração");
    }
  };

  const saveConfig = async () => {
    setIsLoading(true);
    try {
      await saveConfigApi({ apikey: apiKey, doc: documentation });
      toast.success("Configuração salva com sucesso!");
    } catch (error) {
      console.error("Error saving config:", error);
      toast.error("Erro ao salvar configuração");
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    if (!apiKey.trim()) {
      toast.error("Por favor, configure sua API Key primeiro");
      return;
    }

    // Add user message to chat
    const userMessage: Message = { role: "user", content: message };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const data = await sendMessageApi(message, sessionId);
      
      // Update session ID
      if (data.session) {
        setSessionId(data.session);
        localStorage.setItem("estoque_ai_session", data.session);
      }

      // Add system response to chat
      const systemMessage: Message = { 
        role: "system", 
        content: data.resposta || "Resposta não encontrada" 
      };
      setMessages(prev => [...prev, systemMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Erro ao enviar mensagem");
      
      // Add error message to chat
      const errorMessage: Message = {
        role: "system",
        content: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setSessionId("");
    localStorage.removeItem("estoque_ai_session");
    localStorage.removeItem("estoque_ai_messages");
    toast.success("Nova conversa iniciada!");
  };

  return (
    <div className="h-screen bg-gradient-background overflow-hidden">
      {/* Fixed Layout Container */}
      <div className="h-full flex gap-6 p-6">
        {/* Sidebar - Fixed width and height */}
        <div className="w-80 flex-shrink-0">
          <Sidebar
            apiKey={apiKey}
            setApiKey={setApiKey}
            documentation={documentation}
            setDocumentation={setDocumentation}
            onSaveConfig={saveConfig}
            onNewConversation={startNewConversation}
            isLoading={isLoading}
          />
        </div>

        {/* Main Chat Area - Flexible width, fixed height */}
        <div className="flex-1 min-w-0">
          <ChatArea
            messages={messages}
            onSendMessage={sendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;