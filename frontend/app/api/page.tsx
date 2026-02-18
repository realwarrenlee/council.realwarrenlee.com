"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, EyeOff, Trash2, RefreshCw, Copy, Check } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { formatChatId } from "@/lib/format";
import { ClientLayout } from "../client-layout";

interface ApiKey {
  id: string;
  name: string;
  key: string;
}

interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  pricing?: {
    prompt: string;
    completion: string;
  };
  context_length?: number;
}

function ApiKeyPage() {
  const [apiKeys, setApiKeys] = React.useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = React.useState("");
  const [newKeyValue, setNewKeyValue] = React.useState("");
  const [showKeys, setShowKeys] = React.useState<Record<string, boolean>>({});

  const [models, setModels] = React.useState<OpenRouterModel[]>([]);
  const [filteredModels, setFilteredModels] = React.useState<OpenRouterModel[]>([]);
  const [modelsLoading, setModelsLoading] = React.useState(false);
  const [modelsError, setModelsError] = React.useState("");
  const [priceFilter, setPriceFilter] = React.useState<"all" | "free" | "paid">("all");
  const [activeApiKey, setActiveApiKey] = React.useState("");
  const [copiedModelId, setCopiedModelId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const saved = localStorage.getItem("llm-council-api-keys");
    if (saved) {
      const keys = JSON.parse(saved);
      setApiKeys(keys);
      if (keys.length > 0) {
        setActiveApiKey(keys[0].key);
      }
    }
  }, []);

  const fetchModels = async (apiKey: string) => {
    if (!apiKey) return;

    setModelsLoading(true);
    setModelsError("");

    try {
      const res = await fetch("https://openrouter.ai/api/v1/models", {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch models");

      const data = await res.json();
      const fetchedModels = data.data || [];
      setModels(fetchedModels);
      applyFilter(fetchedModels, priceFilter);
    } catch (err) {
      setModelsError(err instanceof Error ? err.message : "Failed to fetch models");
      setModels([]);
      setFilteredModels([]);
    } finally {
      setModelsLoading(false);
    }
  };

  const applyFilter = (modelList: OpenRouterModel[], filter: "all" | "free" | "paid") => {
    if (filter === "all") {
      setFilteredModels(modelList);
    } else if (filter === "free") {
      setFilteredModels(modelList.filter((m) => {
        const promptPrice = parseFloat(m.pricing?.prompt || "0");
        const completionPrice = parseFloat(m.pricing?.completion || "0");
        return promptPrice === 0 && completionPrice === 0;
      }));
    } else if (filter === "paid") {
      setFilteredModels(modelList.filter((m) => {
        const promptPrice = parseFloat(m.pricing?.prompt || "0");
        const completionPrice = parseFloat(m.pricing?.completion || "0");
        return promptPrice > 0 || completionPrice > 0;
      }));
    }
  };

  const handleFilterChange = (filter: "all" | "free" | "paid") => {
    setPriceFilter(filter);
    applyFilter(models, filter);
  };

  const saveApiKeys = (keys: ApiKey[]) => {
    localStorage.setItem("llm-council-api-keys", JSON.stringify(keys));
    setApiKeys(keys);
  };

  const addApiKey = () => {
    if (!newKeyName.trim() || !newKeyValue.trim()) return;

    const newKey: ApiKey = {
      id: crypto.randomUUID(),
      name: newKeyName.trim(),
      key: newKeyValue.trim(),
    };

    saveApiKeys([...apiKeys, newKey]);
    setNewKeyName("");
    setNewKeyValue("");

    if (apiKeys.length === 0) {
      setActiveApiKey(newKey.key);
      fetchModels(newKey.key);
    }
  };

  const deleteApiKey = (id: string) => {
    const updated = apiKeys.filter((k) => k.id !== id);
    saveApiKeys(updated);

    const deleted = apiKeys.find((k) => k.id === id);
    if (deleted && deleted.key === activeApiKey) {
      setActiveApiKey(updated.length > 0 ? updated[0].key : "");
      setModels([]);
    }
  };

  const toggleShowKey = (id: string) => {
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return "****";
    return key.slice(0, 4) + "****" + key.slice(-4);
  };

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (num === 0) return "Free";
    return `$${(num * 1000000).toFixed(2)}/M tokens`;
  };
  const copyModelId = async (modelId: string) => {
    try {
      await navigator.clipboard.writeText(modelId);
      setCopiedModelId(modelId);
      setTimeout(() => setCopiedModelId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
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
        <h1 className="text-2xl font-semibold mb-2">API Keys</h1>
        <p className="text-muted-foreground mb-8">
          Manage your OpenRouter API keys and view available models
        </p>

        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Add API Key</h2>
          <div className="space-y-4">
            <Input
              placeholder="Name (e.g., Personal, Work)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
            />
            <Input
              placeholder="API key"
              value={newKeyValue}
              onChange={(e) => setNewKeyValue(e.target.value)}
            />
            <Button
              onClick={addApiKey}
              disabled={!newKeyName.trim() || !newKeyValue.trim()}
            >
              Add API Key
            </Button>
          </div>
        </div>

        <Table className="mb-12">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/5">Name</TableHead>
              <TableHead className="w-4/5">API Key</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  No API keys added yet
                </TableCell>
              </TableRow>
            ) : (
              apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-medium">{apiKey.name}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleShowKey(apiKey.id)}
                      >
                        {showKeys[apiKey.id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteApiKey(apiKey.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Available Models Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Available Models</h2>
            <div className="flex items-center gap-2">
              <select
                className="px-3 py-1.5 border rounded-md text-sm bg-background"
                value={priceFilter}
                onChange={(e) => handleFilterChange(e.target.value as "all" | "free" | "paid")}
              >
                <option value="all">All models</option>
                <option value="free">Free only</option>
                <option value="paid">Paid only</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchModels(activeApiKey)}
                disabled={!activeApiKey || modelsLoading}
              >
                <RefreshCw className={`h-4 w-4 ${modelsLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>

          {modelsError && (
            <p className="text-destructive text-sm mb-4">{modelsError}</p>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-2/5">Model</TableHead>
                <TableHead className="w-1/5">Context</TableHead>
                <TableHead className="w-1/5">Prompt Price</TableHead>
                <TableHead className="w-1/5">Completion Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModels.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    {modelsLoading ? "Loading models..." : "Click refresh to load models"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredModels.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{model.name || model.id}</div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyModelId(model.id)}
                        >
                          {copiedModelId === model.id ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {model.context_length ? formatNumber(model.context_length) : "-"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {model.pricing ? formatPrice(model.pricing.prompt) : "-"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {model.pricing ? formatPrice(model.pricing.completion) : "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {filteredModels.length > 0 && (
            <p className="text-center text-muted-foreground text-sm mt-4">
              Showing {filteredModels.length} of {models.length} models
            </p>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}

export default function Page() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ApiKeyPage />
    </React.Suspense>
  );
}
