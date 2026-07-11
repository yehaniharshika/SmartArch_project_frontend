import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Info } from "lucide-react";
import toast from "react-hot-toast";
import PageWrapper              from "../components/layout/PageWrapper.jsx";
import FileDropzone             from "../components/upload/FileDropzone.jsx";
import AnalysisPipelineProgress from "../components/upload/AnalysisPipelineProgress.jsx";
import { useUpload } from "../hooks/useUpload.js";

const TIPS = [
  "High-resolution files give better YOLO detection accuracy.",
  "PDF files are converted at 200 DPI internally.",
  "Ensure dimension annotations are visible for accurate scale detection.",
  "Supported: PNG, JPG, JPEG, PDF up to 20 MB.",
];

export default function UploadPage() {
  const navigate = useNavigate();
  const { status, step, result, error, upload, reset } = useUpload();

  const [file, setFile]               = useState(null);
  const [projectName, setProjectName] = useState("");

  const loading = status === "uploading" || status === "analysing";
  const done    = status === "done";

  // Reset any leftover state from a previous visit to this page
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Surface backend/connection errors to the user — never fail silently
  useEffect(() => {
    if (status === "error" && error) {
      toast.error(error);
    }
  }, [status, error]);

  // On success, hand off to the result page using the REAL project_id
  // returned by the backend (not a hardcoded id)
  useEffect(() => {
    if (done && result?.project_id) {
      toast.success("Analysis complete!");
      const timer = setTimeout(() => {
        navigate(`/result/${result.project_id}`);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [done, result, navigate]);

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select a floor plan file first.");
      return;
    }
    if (!projectName.trim()) {
      toast.error("Please enter a project name.");
      return;
    }

    try {
      await upload(projectName.trim(), file);
      // success path handled by the effect above once `result` updates
    } catch (err) {
      // error already reflected in `error` state / toast via the effect above
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-10">

        {/* Page header */}
        <div className="mb-10 space-y-1">
          <p
            className="label-mono text-bronze-DEFAULT"
            style={{ fontFamily: "'Saira', sans-serif" }}
          >
            New Analysis
          </p>
          <h1
            className="font-display text-display-lg text-stone-900"
            style={{ fontFamily: "'Saira', sans-serif" }}
          >
            Upload floor plan
          </h1>
          <p
            className="text-sm text-stone-500"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            Upload your architectural drawing to begin AI analysis.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">

          {/* ── Left — Project name, upload + submit ────────────────── */}
          <div className="lg:col-span-3 space-y-6">

            {/* Project name — required by the backend */}
            {!loading && !done && (
              <div className="space-y-1.5">
                <label
                  htmlFor="project-name"
                  className="label-mono text-stone-500 block"
                  style={{ fontFamily: "'Saira', sans-serif" }}
                >
                  Project name
                </label>
                <input
                  id="project-name"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Villa Serenova"
                  maxLength={255}
                  className="w-full px-4 py-3 bg-white border border-stone-200
                             rounded-sm text-sm text-stone-700
                             focus:outline-none focus:ring-1 focus:ring-bronze-DEFAULT
                             focus:border-bronze-DEFAULT"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                />
              </div>
            )}

            <FileDropzone onFileSelected={setFile} />

            {/* File info summary */}
            {file && !loading && !done && (
              <div className="flex items-center justify-between px-4 py-3
                              bg-stone-50 border border-stone-200 rounded-sm">
                <div className="space-y-0.5">
                  <p
                    className="font-sans text-sm text-stone-700 font-medium"
                    style={{ fontFamily: "'Saira', sans-serif" }}
                  >
                    {file.name}
                  </p>
                  <p className="font-mono text-xs text-stone-400">
                    {(file.size / 1024).toFixed(1)} KB · {file.type || "unknown type"}
                  </p>
                </div>
                <button onClick={handleSubmit} className="btn-primary">
                  Analyse
                  <ArrowRight size={14} />
                </button>
              </div>
            )}

            {loading && (
              <div className="animate-fade-in">
                <AnalysisPipelineProgress currentStep={step} done={done} />
              </div>
            )}

            {status === "error" && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-sm">
                <p
                  className="text-sm text-red-700"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  {error || "Analysis failed. Please try again."}
                </p>
                <button
                  onClick={() => reset()}
                  className="mt-2 text-xs font-medium text-red-700 underline"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Tips */}
            {!loading && !done && (
              <div className="border border-stone-200 rounded-md p-5 space-y-3 bg-white">
                <div className="flex items-center gap-2">
                  <Info size={13} className="text-bronze-DEFAULT" />
                  <p
                    className="label-mono text-bronze-DEFAULT"
                    style={{ fontFamily: "'Saira', sans-serif" }}
                  >
                    Upload tips
                  </p>
                </div>
                <ul className="space-y-2">
                  {TIPS.map((tip) => (
                    <li key={tip} className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-stone-400 rounded-full mt-2 flex-shrink-0" />
                      <span
                        className="text-xs text-stone-500 leading-relaxed"
                        style={{ fontFamily: "'Fredoka', sans-serif" }}
                      >
                        {tip}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ── Right — What happens next ───────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card p-5 space-y-4">
              <p
                className="label-mono text-stone-500"
                style={{ fontFamily: "'Saira', sans-serif" }}
              >
                What gets extracted
              </p>
              {[
                { n: "01", label: "Wall positions",    sub: "Every wall detected and measured" },
                { n: "02", label: "Doors & windows",   sub: "Count, size, and position" },
                { n: "03", label: "Room labels",       sub: "Custom detector + OCR reads dimension text" },
                { n: "04", label: "Floor areas",       sub: "Per-room and total in sq.ft / m²" },
                { n: "05", label: "AI summary",        sub: "Architectural insights via Gemini" },
                { n: "06", label: "Client share link", sub: "Instant chatbot for your client" },
              ].map(({ n, label, sub }) => (
                <div key={n} className="flex items-start gap-3">
                  <span className="font-mono text-xs text-stone-300 mt-0.5 flex-shrink-0 w-5">{n}</span>
                  <div>
                    <p
                      className="text-sm text-stone-700 font-medium leading-none mb-0.5"
                      style={{ fontFamily: "'Saira', sans-serif" }}
                    >
                      {label}
                    </p>
                    <p
                      className="font-mono text-xs text-stone-400"
                      style={{ fontFamily: "'Fredoka', sans-serif" }}
                    >
                      {sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}