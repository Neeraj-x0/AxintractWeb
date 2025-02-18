/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "@/lib";
import { FiUpload, FiSend, FiImage, FiDownload } from "react-icons/fi";
import Image from "next/image";
import "./style.css";
import { AxiosError } from "axios";

const AnimatedPosterGenerator: React.FC = () => {
  // State management
  const [title, setTitle] = useState(
    "Celebrate the Festival of Lights with Axintract"
  );
  const [note, setNote] = useState(
    "Wishing you a joyful Diwali filled with prosperity! May this festival bring success and positivity into your life."
  );
  const [icon, setFestiveImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [background, setBackground] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const noteCharLimit = 255;
  const titleCharLimit = 75;

  // Function to handle festive image upload
  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFestiveImage(e.target.files[0]);
      setError(null); // Clear error when user takes action
    }
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBackground(e.target.files[0]);
      setError(null); // Clear error when user takes action
    }
  };

  // Function to generate poster by making API call
  const generatePoster = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!icon) {
      setError("Please upload an image");
      return;
    }

    e.preventDefault();
    setIsGenerating(true);
    setError(null);

    // Create FormData object for API call
    const formData = new FormData();

    // Ensure note doesn't exceed character limit
    if (note.length > noteCharLimit) {
      formData.append("note", note.substring(0, noteCharLimit));
    } else {
      formData.append("note", note);
    }

    if (title.length > titleCharLimit) {
      formData.append("title", title.substring(0, titleCharLimit));
    } else {
      formData.append("title", title);
    }

    formData.append("icon", icon);
    formData.append("background", background || "");

    try {
      // Send the API request
      const response = await axios.post("/api/generate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob", // Expect an image back
      });
      // Create a URL for the blob data
      const imageUrl = URL.createObjectURL(response.data);
      setPreviewUrl(imageUrl);
      setIsComplete(true);
      setTimeout(() => {
        setIsComplete(false);
      }, 3000);
    } catch (err: unknown) {
      console.log(err);
      // Check if the error is an AxiosError and if a response is available
      if (err instanceof AxiosError && err.response?.data) {
        // Assuming server returns an object with status and message
        const serverMessage = (err.response.data as { message?: string })
          .message;
        setError(
          serverMessage || "Failed to generate poster. Please try again."
        );
      } else {
        setError("Failed to generate poster. Please try again.");
      }
      // Optionally clear the error message after a period of time
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to download the generated poster
  const downloadPoster = () => {
    if (previewUrl) {
      const link = document.createElement("a");
      link.href = previewUrl;
      link.download = "diwali_poster.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 min-h-screen p-4 md:p-8 flex flex-col items-center justify-center relative">
      {/* Main Container */}
      <div className="container w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Form Section */}
          <div className="form-section w-full md:w-1/2 p-6 md:p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              <span className="bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent">
                Poster Generator
              </span>
            </h2>
            {error && (
              <div className="error-message mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={generatePoster}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                  <span className="text-xs text-gray-500">
                    ({title.length}/{titleCharLimit})
                  </span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value.substring(0, titleCharLimit))
                  }
                  className={`input-field w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none hover-scale ${
                    title.length > titleCharLimit * 0.9
                      ? "approaching-limit"
                      : ""
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note{" "}
                  <span className="text-xs text-gray-500">
                    ({note.length}/{noteCharLimit})
                  </span>
                </label>
                <textarea
                  value={note}
                  onChange={(e) =>
                    setNote(e.target.value.substring(0, noteCharLimit))
                  }
                  className={`input-field w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-24 hover-scale ${
                    note.length > noteCharLimit * 0.9 ? "approaching-limit" : ""
                  }`}
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Image (Optional)
                  </label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors hover-scale">
                    <input
                      type="file"
                      onChange={handleBackgroundUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*"
                    />
                    <FiImage className="text-gray-400 text-2xl mb-2" />
                    <span className="text-sm text-gray-500">
                      {background ? background.name : "Upload Image"}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Right Side Icon
                  </label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors hover-scale">
                    <input
                      type="file"
                      onChange={handleIconUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*"
                      required
                    />
                    <FiImage className="text-gray-400 text-2xl mb-2" />
                    <span className="text-sm text-gray-500">
                      {icon ? icon.name : "Upload Image"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className={`btn-generate w-full py-3 rounded-lg flex items-center justify-center text-white font-medium ${
                  isGenerating
                    ? "bg-indigo-300"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } shadow-lg hover-scale`}
              >
                {isGenerating ? (
                  <div className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <FiSend className="mr-2" />
                    Generate Poster
                  </>
                )}
              </button>

              {isComplete && (
                <div className="success-alert p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg mt-4">
                  Poster generated successfully!
                </div>
              )}
            </form>
          </div>

          {/* Preview Section */}
          <div className="preview-section w-full md:w-1/2 bg-gray-50 p-6 md:p-8 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-gray-100">
            {previewUrl ? (
              <div className="generated-preview w-full flex flex-col items-center">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Preview
                </h3>
                <div className="relative w-full aspect-square max-w-md rounded-xl overflow-hidden shadow-2xl mb-6">
                  <Image
                    src={previewUrl}
                    alt="Generated Poster"
                    className="w-full h-full object-cover"
                    width={800}
                    height={800}
                  />
                </div>

                <button
                  onClick={downloadPoster}
                  className="btn-download py-2 px-6 rounded-lg flex items-center justify-center text-white font-medium bg-indigo-600 hover:bg-indigo-700 shadow-lg hover-scale"
                >
                  <FiDownload className="mr-2" />
                  Download
                </button>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center">
                <div className="w-full aspect-square max-w-md bg-gray-200 rounded-xl flex items-center justify-center">
                  <p className="text-gray-500 text-center px-8">
                    Fill out the form and generate your custom poster
                  </p>
                </div>
                <canvas
                  ref={canvasRef}
                  width="800"
                  height="800"
                  className="hidden"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedPosterGenerator;
