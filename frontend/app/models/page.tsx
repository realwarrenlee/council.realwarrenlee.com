"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { formatChatId } from "@/lib/format";
import { ClientLayout } from "../client-layout";

function RolesPage() {
  const [availableModels, setAvailableModels] = React.useState<string[]>([]);
  const [newModelInput, setNewModelInput] = React.useState("");
  const [modelDescriptions, setModelDescriptions] = React.useState<Record<string, string>>({});
  const [loadingDescriptions, setLoadingDescriptions] = React.useState(false);

  React.useEffect(() => {
    const savedAvailableModels = localStorage.getItem("llm-council-available-models");
    if (savedAvailableModels) {
      setAvailableModels(JSON.parse(savedAvailableModels));
    }
  }, []);

  // Fetch model descriptions from OpenRouter
  React.useEffect(() => {
    const fetchModelDescriptions = async () => {
      if (availableModels.length === 0) return;
      
      setLoadingDescriptions(true);
      try {
        const response = await fetch("https://openrouter.ai/api/v1/models");
        const data = await response.json();
        
        const descriptions: Record<string, string> = {};
        data.data.forEach((model: any) => {
          descriptions[model.id] = model.description || model.name || "";
        });
        
        setModelDescriptions(descriptions);
      } catch (error) {
        console.error("Failed to fetch model descriptions:", error);
      } finally {
        setLoadingDescriptions(false);
      }
    };

    fetchModelDescriptions();
  }, [availableModels]);

  const saveAvailableModels = (models: string[]) => {
    localStorage.setItem("llm-council-available-models", JSON.stringify(models));
    setAvailableModels(models);
  };

  const addCustomModel = () => {
    if (!newModelInput.trim()) return;
    const modelId = newModelInput.trim();
    if (!availableModels.includes(modelId)) {
      saveAvailableModels([...availableModels, modelId]);
    }
    setNewModelInput("");
  };

  const removeCustomModel = (model: string) => {
    saveAvailableModels(availableModels.filter((m) => m !== model));
  };

  const getModelDisplayName = (modelId: string) => {
    // Extract the model name from the ID (e.g., "openrouter/aurora-alpha" -> "Aurora Alpha")
    const parts = modelId.split('/');
    const name = parts[parts.length - 1];
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getModelDescription = (modelId: string) => {
    if (loadingDescriptions) {
      return "Loading...";
    }
    const description = modelDescriptions[modelId] || getModelDisplayName(modelId);
    // Truncate to 90 characters
    if (description.length > 90) {
      return description.substring(0, 90) + "...";
    }
    return description;
  };

  const router = useRouter();

  const handleNewChat = () => {
    router.push("/");
  };

  const handleSelectChat = (chatId: number) => {
    router.push(`/?chat=${formatChatId(chatId)}`);
  };

  return (
    <ClientLayout onNewChat={handleNewChat} onSelectChat={handleSelectChat}>
      <div className="max-w-8xl px-16 py-12">
        <h1 className="text-2xl font-semibold mb-2">Models</h1>
        <p className="text-muted-foreground mb-8">
          Manage available models for deliberation
        </p>

        {/* Manage Models Section */}
        <div className="mb-8 border rounded-lg p-4">
          <h2 className="text-lg font-medium mb-4">Add Models</h2>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Add model ID (e.g., anthropic/claude-opus-4)"
              value={newModelInput}
              onChange={(e) => setNewModelInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomModel()}
            />
            <Button onClick={addCustomModel} disabled={!newModelInput.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">Model</TableHead>
              <TableHead className="w-[70%]">Description</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {availableModels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  No models added yet. Add a model above to get started.
                </TableCell>
              </TableRow>
            ) : (
              availableModels.map((model) => (
                <TableRow key={model}>
                  <TableCell className="font-medium">
                    {model}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {getModelDescription(model)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCustomModel(model)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </ClientLayout>
  );
}

export default function Page() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <RolesPage />
    </React.Suspense>
  );
}
