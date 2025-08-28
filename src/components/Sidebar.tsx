import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { History, MessageSquarePlus, Save } from "lucide-react";

interface SidebarProps {
  apiKey: string;
  setApiKey: (value: string) => void;
  documentation: string;
  setDocumentation: (value: string) => void;
  onSaveConfig: () => void;
  onNewConversation: () => void;
  isLoading?: boolean;
}

const Sidebar = ({
  apiKey,
  setApiKey,
  documentation,
  setDocumentation,
  onSaveConfig,
  onNewConversation,
  isLoading = false
}: SidebarProps) => {
  return (
    <Card className="h-full bg-card border-border shadow-elevated">
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key" className="text-card-foreground font-medium">
              API Key
            </Label>
            <Input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Insira sua API Key..."
              className="bg-input border-border focus:ring-accent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentation" className="text-card-foreground font-medium">
              Documentação Operacional
            </Label>
            <Textarea
              id="documentation"
              value={documentation}
              onChange={(e) => setDocumentation(e.target.value)}
              placeholder="Cole aqui sua documentação operacional..."
              className="min-h-[120px] bg-input border-border focus:ring-accent resize-none"
            />
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-border">
          <Button
            onClick={onSaveConfig}
            disabled={isLoading}
            className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Configuração
          </Button>

          <Button
            variant="outline"
            className="w-full border-border hover:bg-muted"
            disabled
          >
            <History className="w-4 h-4 mr-2" />
            Histórico da Conversa
          </Button>

          <Button
            variant="secondary"
            onClick={onNewConversation}
            className="w-full bg-secondary hover:bg-secondary/80"
          >
            <MessageSquarePlus className="w-4 h-4 mr-2" />
            Nova Conversa
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Sidebar;