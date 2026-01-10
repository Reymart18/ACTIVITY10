import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { verifyCheckin } from "../../api/checkin.api";

export default function CheckinScanner() {
  const videoRef = useRef(null);
  const readerRef = useRef(null);

  const [scannerRunning, setScannerRunning] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [lastScanned, setLastScanned] = useState("");

  useEffect(() => {
    return () => stopScanner();
  }, []);

  const startScanner = async () => {
    if (scannerRunning) return;

    setError("");
    setResult("");

    try {
      await navigator.mediaDevices.getUserMedia({ video: true });

      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;

      await reader.decodeFromConstraints(
        { video: { facingMode: "environment" } },
        videoRef.current,
        async (scanResult) => {
          if (!scanResult) return;

          const rawText = scanResult.getText();

          // prevent duplicate scans
          if (rawText === lastScanned) return;
          setLastScanned(rawText);

          try {
            // 🔥 PARSE QR JSON
            const parsed = JSON.parse(rawText);

            if (!parsed.referenceCode) {
              setResult("Invalid QR format");
              return;
            }

            // ✅ SEND ONLY referenceCode
            const res = await verifyCheckin(parsed.referenceCode);
            setResult(res.data.message);
            stopScanner();
          } catch (err) {
            console.error(err);
            setResult("Invalid QR code");
          }
        }
      );

      setScannerRunning(true);
    } catch (err) {
      console.error(err);
      setError("Camera permission denied or unavailable");
    }
  };

  const stopScanner = () => {
    if (readerRef.current) {
      readerRef.current.reset();
      readerRef.current = null;
    }
    setScannerRunning(false);
    setLastScanned("");
  };

  return (
    <div className="p-5 bg-[#161E54] border border-white/10 rounded-xl mt-6 text-white max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-3 text-center">
        Event Check-in Scanner
      </h2>

      {error && <p className="text-red-400 text-center mb-2">{error}</p>}

      <video
        ref={videoRef}
        className="w-full rounded-lg border border-white/20 bg-black"
        style={{ height: "300px", objectFit: "cover" }}
        autoPlay
        muted
      />

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

      {result && (
        <p className="mt-4 text-center font-semibold text-green-400">
          {result}
        </p>
      )}
    </div>
  );
}
