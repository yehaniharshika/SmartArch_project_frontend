import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Info } from "lucide-react";
import toast from "react-hot-toast";
import PageWrapper             from "../components/layout/PageWrapper.jsx";
import FileDropzone            from "../components/upload/FileDropzone.jsx";
import AnalysisPipelineProgress from "../components/upload/AnalysisPipelineProgress.jsx";

const TIPS = [
  "High-resolution files give better YOLO detection accuracy.",
  "PDF files are converted at 200 DPI internally.",
  "Ensure dimension annotations are visible for accurate scale detection.",
  "Supported: PNG, JPG, JPEG, PDF up to 20 MB.",
];

export default function UploadPage() {
  const navigate       = useNavigate();
  const [file, setFile]         = useState(null);
  const [step, setStep]         = useState(0);
  const [done, setDone]         = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = () => {
    if (!file) { 
      toast.error("Please select a floor plan file first."); 
      return; 
    }

    setLoading(true);
    setStep(1);

    let s = 1;
    const interval = setInterval(() => {
      s++;
      setStep(s);
      if (s >= 9) {
        clearInterval(interval);
        setTimeout(() => {
          setDone(true);
          setTimeout(() => {
            setLoading(false);
            toast.success("Analysis complete!");
            navigate("/result/1");
          }, 800);
        }, 600);
      }
    }, 900);
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

          {/* ── Left — Upload + submit ─────────────────────────────── */}
          <div className="lg:col-span-3 space-y-6">
            <FileDropzone onFileSelected={setFile} />

            {/* File info summary */}
            {file && !loading && (
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

            {/* Tips */}
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
                { n: "01", label: "Wall positions",       sub: "Every wall detected and measured" },
                { n: "02", label: "Doors & windows",      sub: "Count, size, and position" },
                { n: "03", label: "Room labels",          sub: "OCR reads dimension text" },
                { n: "04", label: "Floor areas",          sub: "Per-room and total in m²" },
                { n: "05", label: "GPT-4o summary",       sub: "Architectural insights" },
                { n: "06", label: "Client share link",    sub: "Instant chatbot for your client" },
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