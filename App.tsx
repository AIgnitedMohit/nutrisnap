import React, { useState, useCallback } from 'react';
import { OverallNutritionResponse } from './types';
import { analyzeImageAndGetNutrition } from './services/geminiService';
import ImageUpload from './components/ImageUpload';
import NutritionDisplay from './components/NutritionDisplay';
import NutritionChart from './components/NutritionChart';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import UserProfile from './components/UserProfile';
import { CameraIcon, SparklesIcon, LightBulbIcon } from './components/Icons'; // Using HeroIcons style

const App: React.FC = () => {
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [nutritionData, setNutritionData] = useState<OverallNutritionResponse | null>(null);

  const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64String = result.split(',')[1];
        if (base64String) {
          resolve({ base64: base64String, mimeType: file.type });
        } else {
          reject(new Error("Failed to convert file to base64 string."));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageSelect = useCallback((file: File) => {
    setSelectedImageFile(file);
    setSelectedImageUrl(URL.createObjectURL(file));
    setNutritionData(null);
    setError(null);
  }, []);

  const handleAnalyzeImage = useCallback(async () => {
    if (!selectedImageFile) {
      setError("Please select an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setNutritionData(null);

    try {
      const { base64, mimeType } = await fileToBase64(selectedImageFile);
      const data = await analyzeImageAndGetNutrition(base64, mimeType);
      setNutritionData(data);
    } catch (err) {
      console.error("Analysis error:", err);
      if (err instanceof Error) {
        setError(err.message || "An unknown error occurred during analysis.");
      } else {
        setError("An unknown error occurred during analysis.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedImageFile]);

  const handleClear = useCallback(() => {
    setSelectedImageFile(null);
    setSelectedImageUrl(null);
    setNutritionData(null);
    setError(null);
    setIsLoading(false);
    const fileInput = document.getElementById('imageUploadInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Reset file input
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-slate-100 p-4 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-5xl mb-8 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <LightBulbIcon className="h-12 w-12 text-yellow-400" />
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-teal-400 to-sky-400">
              NutriSnap AI
            </h1>
            <p className="text-slate-300 text-lg">Upload a food image and get instant nutritional insights!</p>
          </div>
        </div>
        <UserProfile />
      </header>

      <main className="w-full max-w-5xl bg-slate-800 bg-opacity-70 backdrop-blur-md shadow-2xl rounded-xl p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Left Column: Image Upload and Controls */}
          <div className="space-y-6">
            <ImageUpload onImageSelect={handleImageSelect} currentImageUrl={selectedImageUrl} />
            
            {selectedImageFile && (
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={handleAnalyzeImage}
                  disabled={isLoading || !selectedImageFile}
                  className="w-full flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 flex items-center justify-center space-x-2"
                >
                  <SparklesIcon className="h-5 w-5" />
                  <span>{isLoading ? 'Analyzing...' : 'Analyze Nutrition'}</span>
                </button>
                <button
                  onClick={handleClear}
                  className="w-full sm:w-auto bg-slate-600 hover:bg-slate-700 text-slate-200 font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-75"
                >
                  Clear
                </button>
              </div>
            )}
            {isLoading && <LoadingSpinner />}
          </div>

          {/* Right Column: Results */}
          <div className="space-y-6">
            {error && <ErrorDisplay message={error} />}
            
            {!isLoading && !error && !nutritionData && (
              <div className="p-6 bg-slate-700 rounded-lg text-center text-slate-300">
                <CameraIcon className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                <h3 className="text-xl font-semibold mb-2">Ready for Analysis</h3>
                <p>Upload an image of your meal. NutriSnap will identify food items and estimate their nutrition.</p>
              </div>
            )}

            {nutritionData && (
              <>
                {nutritionData.summary && (
                    <div className="p-4 bg-slate-700 rounded-lg prose prose-invert prose-sm max-w-none">
                        <p className="text-lg font-semibold text-sky-300">AI Summary:</p>
                        <p>{nutritionData.summary}</p>
                    </div>
                )}
                <NutritionChart data={nutritionData} />
                <NutritionDisplay data={nutritionData} />
              </>
            )}
          </div>
        </div>
      </main>
      <footer className="w-full max-w-5xl mt-12 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} NutriSnap AI. Powered by Gemini.</p>
        <p>Nutritional information is an estimate and should not be used for medical purposes.</p>
      </footer>
    </div>
  );
};

export default App;
