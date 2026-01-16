import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { verifyCheckin } from "../../api/events.api";

export default function QrScannerPage() {
  const qrRegionRef = useRef(null);
  const scannerRef = useRef(null);
  const lastFrameText = useRef(null); // prevent rapid duplicate scans
  const [scannerRunning, setScannerRunning] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [results, setResults] = useState([]); // array of { text, message, success }
  const [manualCode, setManualCode] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    return () => stopScanner(); // cleanup on unmount
  }, []);

  const startScanner = () => {
    if (scannerRunning) return;

    if (!qrRegionRef.current) {
      setError("QR region not found");
      return;
    }

    setError("");
    setStatus("Initializing camera...");
    setResults([]);

    const html5QrCode = new Html5Qrcode("qr-reader");
    scannerRef.current = html5QrCode;

    html5QrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          // Prevent rapid duplicate scans (2 seconds window)
          if (decodedText === lastFrameText.current) return;
          lastFrameText.current = decodedText;
          setTimeout(() => (lastFrameText.current = null), 2000);

          setStatus("QR detected! Processing...");

          try {
            const parsed = JSON.parse(decodedText);

            if (!parsed.referenceCode) {
              addResult(decodedText, "Invalid QR format", false);
              setStatus("Ready to scan");
              return;
            }

            const res = await verifyCheckin(parsed.referenceCode);

            // Format the message with name and seat type
            const name = res.data.name || "Unknown";
            const seatType = res.data.seatType || "Standard";
            const seatIcon = seatType === "VIP" ? "👑" : "🪑";
            const displayMessage = res.data.success 
              ? `✅ Checked in: ${name} (${seatIcon} ${seatType})`
              : res.data.message;

            addResult(decodedText, displayMessage, res.data.success);

            setStatus("Ready to scan");
          } catch (err) {
            console.error(err);
            addResult(decodedText, "Invalid QR code", false);
            setStatus("Ready to scan");
          }
        },
        (errorMessage) => {
          // ignored per-frame errors
        }
      )
      .then(() => {
        setScannerRunning(true);
        setStatus("Ready to scan");
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to start camera. Check permissions.");
        setStatus("");
      });
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current
        .stop()
        .then(() => {
          scannerRef.current.clear();
          scannerRef.current = null;
          setScannerRunning(false);
          setStatus("");
        })
        .catch((err) => {
          console.error("Failed to stop scanner", err);
          setStatus("");
        });
    }
  };

  const addResult = (text, message, success) => {
    setResults((prev) => {
      // Prevent duplicate messages
      if (prev.some((r) => r.message === message)) return prev;
      return [...prev, { text, message, success }];
    });
  };

  const handleManualCheckIn = async (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    
    setProcessing(true);
    setError("");
    setStatus("Processing manual check-in...");

    try {
      const res = await verifyCheckin(manualCode.trim());

      // Format the message with name and seat type
      const name = res.data.name || "Unknown";
      const seatType = res.data.seatType || "Standard";
      const seatIcon = seatType === "VIP" ? "👑" : "🪑";
      const displayMessage = res.data.success 
        ? `✅ Checked in: ${name} (${seatIcon} ${seatType})`
        : res.data.message;

      addResult(manualCode, displayMessage, res.data.success);
      setStatus(res.data.success ? "Check-in successful!" : "Check-in failed");
      setManualCode(""); // Clear input on success
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Invalid reference code";
      addResult(manualCode, errorMsg, false);
      setStatus("Check-in failed");
    } finally {
      setProcessing(false);
      setTimeout(() => setStatus(""), 3000);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">QR Scanner</h1>
        <p className="text-gray-400 mt-1">Scan attendee tickets for event check-in</p>
      </div>

      {/* Scanner Card */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-[#2D132C] to-[#1A1520] border border-white/10 rounded-xl p-8 text-white shadow-xl">
          <h2 className="text-2xl font-semibold mb-6 text-center">Event Check-in Scanner</h2>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
              <p className="text-red-300 text-center font-medium">{error}</p>
            </div>
          )}

          <div
            id="qr-reader"
            ref={qrRegionRef}
            className="w-full rounded-lg border-2 border-white/20 bg-black overflow-hidden"
            style={{ height: "400px" }}
          ></div>

          {status && (
            <div className="mt-4 bg-pink-500/20 border border-pink-500/50 rounded-lg p-3">
              <p className="text-center text-gray-200 font-medium">{status}</p>
            </div>
          )}

          <div className="flex justify-center mt-6 gap-4">
            {!scannerRunning ? (
              <button
                onClick={startScanner}
                className="px-8 py-3 bg-pink-500 hover:bg-pink-600 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                🎥 Start Scanner
              </button>
            ) : (
              <button
                onClick={stopScanner}
                className="px-8 py-3 bg-gray-600 hover:bg-gray-700 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                ⏹️ Stop Scanner
              </button>
            )}
          </div>

          {/* Manual Check-in Section */}
          <div className="mt-8 border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Or Enter Reference Code Manually</h3>
            <form onSubmit={handleManualCheckIn} className="flex gap-3">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                placeholder="Enter reference code (e.g., ABC123)"
                className="flex-1 px-4 py-3 bg-white/5 text-white border border-white/20 rounded-lg outline-none focus:ring-2 focus:ring-pink-400 transition"
                disabled={processing}
              />
              <button
                type="submit"
                disabled={processing || !manualCode.trim()}
                className="px-6 py-3 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-all shadow-lg"
              >
                {processing ? "Processing..." : "Check In"}
              </button>
            </form>
          </div>

          {/* Scan Results */}
          {results.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 text-center">Recent Check-ins</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto bg-black/30 rounded-lg p-4">
                {results.map((r, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-l-4 ${
                      r.success
                        ? "bg-green-500/10 border-green-400"
                        : "bg-red-500/10 border-red-400"
                    }`}
                  >
                    <p
                      className={`font-semibold ${
                        r.success ? "text-green-300" : "text-red-300"
                      }`}
                    >
                      {r.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="text-2xl">ℹ️</span> How to Use
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-pink-400 font-bold">1.</span>
              <span>Click "Start Scanner" to activate your camera and scan QR codes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-400 font-bold">2.</span>
              <span>Or manually enter the reference code and click "Check In"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-400 font-bold">3.</span>
              <span>The system will automatically verify and check in the attendee</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-400 font-bold">4.</span>
              <span>Check-in results will appear below the scanner</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
