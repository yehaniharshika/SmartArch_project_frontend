import { useState } from "react";
import { Copy, CheckCheck, Share2, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

export default function ShareLinkPanel({ shareUrl, shareToken }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      toast.success("Share link copied!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-stone-900 rounded-md p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Share2 size={16} className="text-bronze-light" />
        <p className="font-sans text-sm font-medium text-arch-cream">
          Client Chatbot Link
        </p>
      </div>

      <p className="font-sans text-xs text-stone-400 leading-relaxed">
        Share this link with your client. They can ask questions about the floor plan
        — dimensions, areas, design suggestions — without needing to log in.
      </p>

      {/* URL display + copy */}
      <div className="flex items-stretch gap-2">
        <div className="flex-1 bg-stone-800 border border-stone-700 rounded-sm px-3 py-2.5
                        flex items-center overflow-hidden">
          <p className="font-mono text-xs text-stone-300 truncate">{shareUrl}</p>
        </div>
        <button
          onClick={handleCopy}
          className={`px-3 rounded-sm border text-xs font-mono flex items-center gap-1.5
            transition-all duration-200 flex-shrink-0
            ${copied
              ? "bg-emerald-700 border-emerald-600 text-emerald-100"
              : "bg-stone-700 border-stone-600 text-stone-300 hover:bg-stone-600"
            }`}
        >
          {copied ? <CheckCheck size={13} /> : <Copy size={13} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Token info */}
      <div className="flex items-center justify-between pt-2 border-t border-stone-700">
        <p className="font-mono text-[10px] text-stone-500">
          Token: {shareToken?.slice(0, 20)}…
        </p>
        <a
          href={shareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-mono text-[10px] text-bronze-light
                     hover:text-bronze-DEFAULT transition-colors"
        >
          Preview <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
}
