"use client";

import React, { useState } from 'react';
import Image from 'next/image';

export default function PoemCard() {
  const [image, setImage] = useState<string>('');
  const [responsePoem, setResponsePoem] = useState<string>('');
  const [audioSrc, setAudioSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await convertToBase64(e.target.files[0]);
      setImage(base64);
      sendImageToApi(base64);
    }
  };

  const sendImageToApi = async (base64Image: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/vision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let result = '';

      reader.read().then(function processText({ done, value }) {
        if (done) {
          setIsLoading(false);
          fetchAudio(result);
          return;
        }

        const textChunk = decoder.decode(value, { stream: true });
        result += textChunk;

        setResponsePoem(result);

        reader.read().then(processText);
      }).catch(error => {
        console.error('Error reading from the stream', error);
        setIsLoading(false);
      });
    } catch (error) {
      setIsLoading(false);
      console.error('Error sending image to API:', error);
    }
  };

  const fetchAudio = async (text: string): Promise<void> => {
    setIsAudioLoading(true);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      const blob = await response.blob();
      setAudioSrc(URL.createObjectURL(blob));
      setIsAudioLoading(false);
    } catch (error) {
      setIsAudioLoading(false);
      console.error('Error fetching audio from API:', error);
    }
  };

  return (
    <div className="relative col-span-1 h-auto overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md md:col-span-2">
      <div className="w-full max-w-2xl p-10 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Upload your sunset picture
        </h2>
        <div className="mt-6">
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <label htmlFor="imageInput" className="cursor-pointer py-2 px-4 bg-[#1d9bf0] hover:bg-blue-500 text-white font-medium rounded-lg transition duration-200">
            Choose a file
          </label>
        </div>
        <div className="mt-6">
          {image && (
            <div className="mt-4">
              <Image src={image} alt="Uploaded" width={600} height={400} className="rounded-lg" />
            </div>
          )}
          {isLoading && (
            <div className="flex justify-center items-center mt-3">
              <div className="loader"></div>
            </div>
          )}
          {responsePoem && (
            <div className="mt-6 rounded-lg shadow-lg max-w-xl mx-auto">
              <div className="prose prose-md">
                <pre className="text-blue-800 bg-blue-100 rounded whitespace-pre-wrap overflow-auto">{responsePoem}</pre>
              </div>
            </div>
          )}
          {isAudioLoading ? (
            // Skeleton loader for audio player
            <div className="mt-4 w-full animate-pulse">
              <div className="bg-gray-300 rounded h-12"></div> {/* Mimics the size of the audio player */}
            </div>
          ) : (
            audioSrc && (
              <audio controls src={audioSrc} className="mt-4 w-full">
                Your browser does not support the audio element.
              </audio>
            )
          )}
        </div>
      </div>
    </div>
  );
}