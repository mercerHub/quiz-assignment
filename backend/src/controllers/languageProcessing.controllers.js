import fs from "fs";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import path from "path";
import { fileURLToPath } from "url";
import Groq from "groq-sdk";

const groq = new Groq();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedAudioTypes = [
  "audio/mpeg", // MP3
  "audio/wav", // WAV
  "audio/ogg", // OGG
  "audio/mp4", // MP4 audio (e.g., M4A)
  "audio/m4a", // M4A
  "audio/wave", // WAVE
];

const processAudioWithLLM = async (filePath) => {
  try {
    // Create a translation job using the Groq client
    const translation = await groq.audio.translations.create({
      file: fs.createReadStream(filePath), // Path to the uploaded audio file
      model: "whisper-large-v3", // Model to use for transcription
      prompt: "Specify context or spelling", // Optional
      response_format: "json", // Optional
      temperature: 0.0, // Optional
    });

    // Return the transcribed text
    return translation.text;
  } catch (error) {
    console.error("Error processing audio with Groq:", error);
    throw new Error("Error processing audio.");
  }
};

export const uploadAudio = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ApiError(400, "Please upload a file"));
  }

  const fileMimeType = req.file.mimetype;
  if (!allowedAudioTypes.includes(fileMimeType)) {
    console.log("Invalid audio file type:", fileMimeType);
    return next(new ApiError(400, "Please upload a valid audio file"));
  }

  const filePath = path.join(__dirname, "public/temp", req.file.filename);

  try {
    // Feed the audio to an LLM for processing
    console.log(filePath);
    const processedContent = await processAudioWithLLM('./public/temp/'+req.file.filename);

    res.status(200).json(new ApiResponse(200, "Success", processedContent));
  } catch (error) {
    console.error("Error processing audio:", error);
    res.status(500).send("Error processing audio.");
  } finally {
    // Delete the uploaded file
    fs.unlinkSync(filePath);
  }
});
