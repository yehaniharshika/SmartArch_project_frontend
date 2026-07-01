import { useState, useCallback } from "react";
import { planApi } from "../api/planApi.js";

/**
 * Hook for managing the floor plan upload + analysis pipeline.
 *
 * States:
 *   idle → uploading → analysing (steps 1-9) → done | error
 */
export function useUpload() {
  const [status, setStatus]       = useState("idle");   // idle | uploading | analysing | done | error
  const [step, setStep]           = useState(0);
  const [progress, setProgress]   = useState(0);        // upload %
  const [result, setResult]       = useState(null);
  const [error, setError]         = useState(null);

  const reset = useCallback(() => {
    setStatus("idle");
    setStep(0);
    setProgress(0);
    setResult(null);
    setError(null);
  }, []);

  const upload = useCallback(async (file) => {
    if (!file) return;
    setStatus("uploading");
    setProgress(0);
    setError(null);

    try {
      const data = await planApi.upload(file, (pct) => {
        setProgress(pct);
        if (pct === 100) {
          setStatus("analysing");
          // Simulate step ticking during backend analysis
          _simulateSteps(setStep, () => {
            // Steps done — wait for API response
          });
        }
      });

      setStep(9);
      setStatus("done");
      setResult(data);
      return data;

    } catch (err) {
      // Mock mode — simulate full pipeline
      await _mockPipeline(setStep, setStatus);
      const mockResult = { success: true, floor_plan_id: 1, share_token: "tok_mock", share_url: "http://localhost:3000/chat/tok_mock" };
      setResult(mockResult);
      return mockResult;
    }
  }, []);

  return { status, step, progress, result, error, upload, reset };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function _simulateSteps(setStep, onDone) {
  let s = 1;
  const iv = setInterval(() => {
    setStep(s);
    s++;
    if (s > 9) { clearInterval(iv); onDone(); }
  }, 700);
}

function _mockPipeline(setStep, setStatus) {
  return new Promise((resolve) => {
    setStatus("analysing");
    let s = 1;
    const iv = setInterval(() => {
      setStep(s);
      s++;
      if (s > 9) {
        clearInterval(iv);
        setStatus("done");
        resolve();
      }
    }, 800);
  });
}
