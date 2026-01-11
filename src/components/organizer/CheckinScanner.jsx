import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { verifyCheckin } from "../../api/events.api";

export default function CheckinScanner() {
  const qrRegionRef = useRef(null);
  const scannerRef = useRef(null);
  const lastFrameText = useRef(null); // prevent rapid duplicate scans
  const [scannerRunning, setScannerRunning] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [results, setResults] = useState([]); // array of { text, message, success }

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

            // Add message only if it doesn't already exist in results
            addResult(decodedText, res.data.message || "Check-in successful", res.data.success);

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

  return (
    <div className="p-5 bg-[#161E54] border border-white/10 rounded-xl mt-6 text-white max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-3 text-center">Event Check-in Scanner</h2>

      {error && <p className="text-red-400 text-center mb-2">{error}</p>}

      <div
        id="qr-reader"
        ref={qrRegionRef}
        className="w-full rounded-lg border border-white/20 bg-black"
        style={{ height: "300px" }}
      ></div>

      <p className="mt-2 text-center text-gray-300 italic">{status}</p>

      <div className="flex justify-center mt-4 gap-3">
        {!scannerRunning ? (
          <button
            onClick={startScanner}
            className="px-4 py-2 bg-[#249E94] rounded hover:bg-[#1f8b82]"
          >
            Start Scanner
          </button>
        ) : (
          <button
            onClick={stopScanner}
            className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600"
          >
            Stop Scanner
          </button>
        )}
      </div>

      {results.length > 0 && (
        <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
          {results.map((r, idx) => (
            <p
              key={idx}
              className={`text-center font-semibold ${r.success ? "text-green-400" : "text-red-400"}`}
            >
              {r.message}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
