import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Standard middleware
  app.use(express.json());

  // In-memory system logs storage to allow dynamic updates when user executes a transmission!
  const systemLogs = [
    {
      timestamp: "2026-06-30:14:02",
      eventType: "COMMIT_PUSH",
      description: "Refactor: Optimization of Sentinel eBPF kernel probes",
      hash: "8f2a1c0"
    },
    {
      timestamp: "2026-06-30:11:45",
      eventType: "DEPLOY_SUCCESS",
      description: "OpenGRC v1.2.4 successfully pushed to production",
      hash: "4e5d9b1"
    },
    {
      timestamp: "2026-06-30:09:12",
      eventType: "PATCH_APPLIED",
      description: "Fix: Zero-Trust Access token renewal issue",
      hash: "a2c4e6g"
    },
    {
      timestamp: "2026-06-30:05:30",
      eventType: "DB_SYNC",
      description: "Migration: Audit log table expansion in OpenGRC",
      hash: "7b3f9d2"
    }
  ];

  // API endpoints
  app.get("/api/logs", (req, res) => {
    res.json(systemLogs);
  });

  app.post("/api/transmission", async (req, res) => {
    const { sourceId, contactVector, dataStream } = req.body;
    
    if (!sourceId || !contactVector || !dataStream) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        throw new Error("GEMINI_API_KEY is not set or is using placeholder");
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      const prompt = `ANALYZING INCOMING TRANSMISSION DATASTREAM:
Source ID: ${sourceId}
Contact Vector: ${contactVector}
Payload: ${dataStream}

Provide your system analysis. Categorize the request (e.g. HIRING, COOPERATION, GENERAL QUERY, THREAT TESTING, etc.), assign a THREAT_LEVEL (LOW, MEDIUM, HIGH), and generate a professional, robotic, terminal-appropriate system message response.
The response must be a valid JSON object matching this schema EXACTLY:
{
  "classification": "string",
  "threatLevel": "LOW" | "MEDIUM" | "HIGH",
  "decryptedResponse": "string",
  "hexAck": "string",
  "acknowledgement": "string"
}
Ensure there is no markdown codeblock wrapper like \`\`\`json, just pure raw JSON. Keep the decryptedResponse and acknowledgement short, under 120 characters, written in all-caps, system engineering lingo.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are the Core Kernel AI (SAADHAN_P_SYS Core) of a high-performance cyber-brutalist engineering system. Respond strictly in valid raw JSON with keys: classification, threatLevel, decryptedResponse, hexAck, acknowledgement. Ensure decryptedResponse and acknowledgement use uppercase technical lingo. Keep it very stylized, futuristic, and professional.",
          responseMimeType: "application/json"
        }
      });

      const resultText = response.text || "{}";
      const parsed = JSON.parse(resultText.trim());

      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16).replace(' ', ':');
      const logEntry = {
        timestamp,
        eventType: "TRANSMIT_ACK",
        description: `ACK from ${sourceId.toUpperCase()}: [${parsed.classification}] ${parsed.acknowledgement}`,
        hash: parsed.hexAck || Math.random().toString(16).substring(2, 9)
      };

      systemLogs.unshift(logEntry);

      res.json({
        success: true,
        analysis: parsed,
        logEntry
      });

    } catch (error: any) {
      console.warn("Using offline fallback mode due to:", error.message || error);
      
      // Local fallback generation
      const classifications = ["HIRING", "COOPERATION", "QUERY", "UPLINK_PING"];
      const randomClass = classifications[Math.floor(Math.random() * classifications.length)];
      const threatLevel = sourceId.toLowerCase().includes("hack") || dataStream.toLowerCase().includes("select") ? "MEDIUM" : "LOW";
      
      const fallbackAnalysis = {
        classification: randomClass,
        threatLevel: threatLevel,
        decryptedResponse: `LOCAL_DECRYPT_STABLE_V1 // INTEGRITY_VERIFIED`,
        hexAck: Math.random().toString(16).substring(2, 9),
        acknowledgement: `OFFLINE_ACK // TRANSMISSION_RECEIVED // SECURE_LOGGED_SUCCESSFULLY`
      };

      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16).replace(' ', ':');
      const logEntry = {
        timestamp,
        eventType: "LOCAL_RECOVERY",
        description: `LOCAL_ACK from ${sourceId.toUpperCase()}: ${fallbackAnalysis.acknowledgement}`,
        hash: fallbackAnalysis.hexAck
      };

      systemLogs.unshift(logEntry);

      res.json({
        success: true,
        analysis: fallbackAnalysis,
        logEntry,
        offlineFallback: true
      });
    }
  });

  // Serve Vite in development, static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
