import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { CloudUpload, FileImage, FileText, X, CheckCircle2 } from "lucide-react";

const ACCEPTED = {
  "image/png":  [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "application/pdf": [".pdf"],
};
const MAX_MB = 20;

export default function FileDropzone({ onFileSelected }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const onDrop = useCallback((accepted, rejected) => {
    setError("");
    if (rejected.length > 0) {
      const err = rejected[0].errors[0];
      if (err.code === "file-too-large")
        setError(`File too large. Max ${MAX_MB} MB allowed.`);
      else if (err.code === "file-invalid-type")
        setError("Invalid file type. Only PNG, JPG, JPEG or PDF.");
      else
        setError(err.message);
      return;
    }
    if (accepted.length > 0) {
      setFile(accepted[0]);
      onFileSelected?.(accepted[0]);
    }
  }, [onFileSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxSize: MAX_MB * 1024 * 1024,
    multiple: false,
  });

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setError("");
    onFileSelected?.(null);
  };

  const isPDF = file?.type === "application/pdf";
  const sizeKB = file ? (file.size / 1024).toFixed(1) : 0;

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-md cursor-pointer
          transition-all duration-300 group
          ${isDragActive
            ? "border-bronze-DEFAULT bg-amber-50/50 drop-active"
            : file
            ? "border-emerald-300 bg-emerald-50/30"
            : "border-stone-300 bg-white hover:border-bronze-DEFAULT hover:bg-stone-50"
          }`}
      >
        <input {...getInputProps()} />

        {/* Dot-grid background */}
        {!file && (
          <div className="absolute inset-0 dot-grid opacity-30 rounded-md pointer-events-none" />
        )}

        <div className="relative p-10 flex flex-col items-center justify-center text-center min-h-[260px]">
          {file ? (
            /* File selected state */
            <div className="space-y-4 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 rounded-md flex items-center justify-center mx-auto">
                {isPDF
                  ? <FileText size={28} className="text-emerald-600" />
                  : <FileImage size={28} className="text-emerald-600" />
                }
              </div>
              <div>
                <p className="font-sans font-medium text-stone-800 mb-1">
                  {file.name}
                </p>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-mono text-xs text-stone-500">{sizeKB} KB</span>
                  <span className="font-mono text-xs text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 size={11} />
                    Ready to analyse
                  </span>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="inline-flex items-center gap-1.5 px-3 py-1.5
                           font-mono text-xs text-stone-500 hover:text-red-600
                           border border-stone-200 hover:border-red-200
                           rounded-sm transition-colors"
              >
                <X size={11} />
                Remove
              </button>
            </div>
          ) : isDragActive ? (
            /* Drag active state */
            <div className="space-y-3 animate-fade-in">
              <div className="w-16 h-16 bg-amber-100 rounded-md flex items-center justify-center mx-auto
                              animate-bounce">
                <CloudUpload size={28} className="text-bronze-DEFAULT" />
              </div>
              <p className="font-display text-2xl text-stone-700">Drop to analyse</p>
            </div>
          ) : (
            /* Default idle state */
            <div className="space-y-5">
              <div className="w-16 h-16 bg-stone-100 rounded-md flex items-center justify-center mx-auto
                              group-hover:bg-stone-200 transition-colors duration-200">
                <CloudUpload size={26} className="text-stone-400 group-hover:text-stone-600 transition-colors" />
              </div>
              <div className="space-y-2">
                <p className="font-display text-2xl text-stone-700">
                  Drop your floor plan here
                </p>
                <p className="font-sans text-sm text-stone-500">
                  or{" "}
                  <span className="text-bronze-DEFAULT underline underline-offset-2 cursor-pointer">
                    browse files
                  </span>
                </p>
              </div>
              <div className="flex items-center justify-center gap-4">
                {["PNG", "JPG", "PDF"].map((ext) => (
                  <span key={ext} className="badge badge-info">{ext}</span>
                ))}
                <span className="font-mono text-xs text-stone-400">Max {MAX_MB} MB</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-sm">
          <X size={13} className="text-red-500 flex-shrink-0" />
          <p className="font-mono text-xs text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
