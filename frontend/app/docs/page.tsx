"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ClientLayout } from "../client-layout";
import { formatChatId } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  BarChart3,
  EyeOff,
  Lightbulb,
  Shield
} from "lucide-react";

export default function DocsPage() {
  const router = useRouter();

  const handleSelectChat = (chatId: number) => {
    router.push(`/?chat=${formatChatId(chatId)}`);
  };

  const handleNewChat = () => {
    router.push('/');
  };

  return (
    <ClientLayout
      onSelectChat={handleSelectChat}
      onNewChat={handleNewChat}
    >
      <div className="max-w-8xl px-16 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2">Documentation</h1>
          <p className="text-muted-foreground">
            Learn how to use LLM Council's advanced features to create sophisticated multi-agent deliberations.
          </p>
        </div>

        {/* Quick Start */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Quick Start</h2>
          </div>
          <div className="grid gap-4">
            <div className="border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Add Your API Key</h3>
                  <p className="text-muted-foreground">
                    Enter your OpenRouter API key in the settings to enable model access
                  </p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Select Models</h3>
                  <p className="text-muted-foreground">
                    Choose which AI models will participate in the deliberation
                  </p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Ask Your Question</h3>
                  <p className="text-muted-foreground">
                    Type your question or task and let the council deliberate. All three aggregation methods are computed automatically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Aggregation Methods - Always Visible */}
        {/* Advanced Features */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Advanced Features</h2>
          </div>
          
          <Accordion type="single" collapsible className="space-y-2">
            {/* Aggregation Methods */}
            <AccordionItem value="aggregation" className="border-b">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <div className="font-semibold">Aggregation Methods</div>
                    <div className="text-sm text-muted-foreground">Choose how responses are ranked and scored</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6 space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  The council uses explicit pairwise comparisons where each model compares every pair of responses. All three aggregation methods are computed simultaneously, giving you multiple perspectives on the rankings. When all methods agree, you have high confidence. When they diverge, it reveals interesting insights about what "better" means.
                </p>
                <div className="space-y-4">
                  <div className="border-2 border-primary/30 rounded-lg p-6 bg-gradient-to-br from-primary/5 to-transparent">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="text-sm">Borda Count</Badge>
                      <Badge variant="outline" className="text-xs">Primary</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Points-based system from pairwise wins. Major wins (≫) count 3x, minor wins (&gt;) count 1x. Simple and intuitive.
                    </p>
                    <div className="bg-background/50 rounded p-3 text-xs font-mono">
                      Pairwise comparisons → Weighted points → Total scores
                    </div>
                  </div>
                  
                  <div className="border-2 border-muted rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="text-sm">Bradley-Terry</Badge>
                      <Badge variant="outline" className="text-xs">Probabilistic</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Statistical model estimating relative strength from pairwise outcomes. Uses logistic regression for robust rankings.
                    </p>
                    <div className="bg-muted/50 rounded p-3 text-xs font-mono">
                      Pairwise outcomes → Strength estimation → Win probabilities
                    </div>
                  </div>
                  
                  <div className="border-2 border-muted rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="text-sm">ELO Rating</Badge>
                      <Badge variant="outline" className="text-xs">With Confidence Intervals</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Chess-style rating with bootstrap confidence intervals (1000 iterations). Shows rating ± uncertainty range.
                    </p>
                    <div className="bg-muted/50 rounded p-3 text-xs font-mono">
                      Initial 1000 → Pairwise updates → Rating ± 95% CI
                    </div>
                  </div>
                </div>
                <div className="mt-6 border-l-4 border-primary pl-4">
                  <p className="text-sm font-medium mb-2">All Methods Computed Automatically</p>
                  <p className="text-xs text-muted-foreground">
                    You'll see all three rankings side-by-side in the results. The "Primary" method determines the default sort order, but you can compare all three to gain deeper insights. Click column headers to sort by any method.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Anonymization */}
            <AccordionItem value="anonymization" className="border-b">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <EyeOff className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <div className="font-semibold">Anonymization</div>
                    <div className="text-sm text-muted-foreground">Anonymous review mode</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enable anonymous review mode where models don't see each other's identities during peer review. This reduces bias and encourages more honest, objective feedback.
                </p>
                <div className="border-2 border-primary/20 rounded-lg p-5 bg-gradient-to-br from-primary/5 to-transparent">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    How It Works
                  </h4>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>1. Model identities are hidden during pairwise comparisons</p>
                    <p>2. Responses are labeled as "A1", "A2", etc. instead of model names</p>
                    <p>3. Reduces confirmation bias and brand preferences</p>
                    <p>4. Promotes objective assessment based on content quality alone</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Peer Review */}
            <AccordionItem value="peer-review" className="border-b">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <div className="font-semibold">Peer Review</div>
                    <div className="text-sm text-muted-foreground">Always enabled for quality assurance</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  All models automatically perform explicit pairwise comparisons of each other's responses. Each model compares every pair and judges which is better and by how much.
                </p>
                <div className="border-2 border-primary/20 rounded-lg p-5 bg-gradient-to-br from-primary/5 to-transparent">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    How It Works
                  </h4>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>1. Each model generates its initial response to your task</p>
                    <p>2. Every model compares all pairs of responses (O(N²) comparisons)</p>
                    <p>3. For each pair, the model explicitly judges: [[A≫B]] (significantly better), [[A&gt;B]] (slightly better), [[A=B]] (equal), [[B&gt;A]], or [[B≫A]]</p>
                    <p>4. All judgments are aggregated using three methods simultaneously</p>
                    <p>5. Final rankings show which models produced the best responses</p>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded">
                  <p className="text-sm font-medium mb-1">Note: Explicit Pairwise Comparisons</p>
                  <p className="text-xs text-muted-foreground">
                    With N models, this requires N × (N-1)/2 comparisons per judge. For 3 models: 3 comparisons. For 5 models: 10 comparisons. This is more expensive than simple ranking but captures true preference intensity.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Tips & Best Practices */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Tips & Best Practices</h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Lightbulb className="h-5 w-5 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Choose Diverse Models</h3>
                <p className="text-sm text-muted-foreground">
                  Select models with different strengths and perspectives. Diversity leads to richer deliberations and better insights.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Lightbulb className="h-5 w-5 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Understand the Aggregation Methods</h3>
                <p className="text-sm text-muted-foreground">
                  All three methods are computed automatically. When they agree, you have robust consensus. When they diverge, it reveals nuanced differences in how quality is measured. Borda favors consistent performance, Bradley-Terry emphasizes head-to-head strength, and ELO provides dynamic competitive ratings with uncertainty estimates.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Lightbulb className="h-5 w-5 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Check ELO Confidence Intervals</h3>
                <p className="text-sm text-muted-foreground">
                  Hover over the ± symbol in ELO ratings to see confidence intervals. Narrow intervals mean high confidence, wide intervals mean uncertainty. If two models' intervals overlap significantly, their ranking difference may not be meaningful.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Lightbulb className="h-5 w-5 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Review Both Perspectives and Synthesis</h3>
                <p className="text-sm text-muted-foreground">
                  The individual perspectives show you each model's thinking, while the synthesis provides a unified conclusion. Both are valuable for different purposes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
