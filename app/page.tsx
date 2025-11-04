'use client';

import { useState, useEffect, useRef } from 'react';

interface Frame {
  svg: string;
  duration: number;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateVideo = async () => {
    setLoading(true);
    setError('');
    setHeadlines([]);
    setFrames([]);
    setCurrentFrame(0);
    setIsPlaying(false);

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Video generation failed');
      }

      const data = await response.json();
      setHeadlines(data.headlines);
      setFrames(data.videoData.frames);
    } catch (err) {
      setError('Failed to generate video. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const playVideo = () => {
    setIsPlaying(true);
    setCurrentFrame(0);
  };

  const pauseVideo = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const resetVideo = () => {
    setIsPlaying(false);
    setCurrentFrame(0);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  useEffect(() => {
    if (isPlaying && frames.length > 0) {
      if (currentFrame < frames.length - 1) {
        timerRef.current = setTimeout(() => {
          setCurrentFrame(prev => prev + 1);
        }, frames[currentFrame].duration * 1000);
      } else {
        setIsPlaying(false);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, currentFrame, frames]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8">
        <h1 className="text-5xl font-bold text-white text-center mb-4">
          आज की Headlines
        </h1>
        <p className="text-xl text-white/80 text-center mb-8">
          Today's Top News in Video Format
        </p>

        <div className="flex justify-center mb-8">
          <button
            onClick={generateVideo}
            disabled={loading}
            className={`px-8 py-4 rounded-full font-semibold text-lg transition-all transform ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 hover:shadow-xl'
            } text-white`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Video...
              </span>
            ) : (
              '🎬 Generate Video'
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {headlines.length > 0 && (
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">📰 Today's Headlines:</h2>
            <ul className="space-y-2">
              {headlines.map((headline, index) => (
                <li key={index} className="text-white/90 text-lg flex items-start">
                  <span className="mr-2">•</span>
                  <span>{headline}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {frames.length > 0 && (
          <div className="bg-black/30 rounded-lg p-4">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">🎥 Your News Video</h2>
            <div className="relative w-full aspect-video bg-black rounded-lg shadow-lg mb-4">
              <div
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: frames[currentFrame]?.svg || '' }}
              />
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={isPlaying ? pauseVideo : playVideo}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                {isPlaying ? '⏸️ Pause' : '▶️ Play'}
              </button>
              <button
                onClick={resetVideo}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                🔄 Reset
              </button>
            </div>
            <div className="mt-4 text-center text-white">
              Frame {currentFrame + 1} of {frames.length}
            </div>
          </div>
        )}
      </div>

      <footer className="mt-8 text-white/60 text-center">
        <p>Powered by AI • Real-time News Updates</p>
      </footer>
    </div>
  );
}
