import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShieldCheck } from "lucide-react";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import ErrorState from "../components/ui/ErrorState.jsx";
import * as aiService from "../services/aiService.js";
import { getErrorMessage } from "../services/api.js";

export default function AIInsightsPage() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true);
    setError("");
    setResult("");
    try {
      const data = await aiService.getAIRecommendations();
      setResult(data.result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI Insights</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Generate promotion recommendations, training suggestions, and rankings across your team.
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
          <p>
            Employee names and emails never leave the server — only anonymized performance data
            is sent to the AI provider, and results are matched back to names locally.
          </p>
        </div>

        <Button onClick={generate} loading={loading} className="mt-5">
          <Sparkles className="h-4 w-4" />
          {loading ? "Analyzing employees..." : "Generate AI Recommendations"}
        </Button>

        {error && (
          <div className="mt-6">
            <ErrorState message={error} onRetry={generate} />
          </div>
        )}

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 overflow-hidden"
            >
              <div className="rounded-xl border border-brand-100 bg-brand-50/50 p-5 dark:border-brand-500/20 dark:bg-brand-500/5">
                <h3 className="mb-3 font-semibold text-brand-700 dark:text-brand-300">
                  Analysis Result
                </h3>
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {result}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
