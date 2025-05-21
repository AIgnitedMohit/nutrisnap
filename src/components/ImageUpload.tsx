
import React, { useRef, useCallback } from 'react';
import { UploadIcon } from './Icons'; // Using a HeroIcon style SVG

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  currentImageUrl: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, currentImageUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="w-full p-6 bg-slate-700 rounded-lg shadow-lg text-center">
      <input
        id="imageUploadInput"
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      {currentImageUrl ? (
        <div className="mb-4">
          <img 
            src={currentImageUrl} 
            alt="Selected meal" 
            className="max-h-72 w-auto mx-auto rounded-md object-contain shadow-md"
          />
        </div>
      ) : (
        <div className="mb-4 p-8 border-2 border-dashed border-slate-500 rounded-lg">
          <UploadIcon className="h-16 w-16 mx-auto text-slate-400 mb-3" />
          <p className="text-slate-300">Click below to upload an image of your food.</p>
          <p className="text-xs text-slate-400 mt-1">PNG, JPG, GIF, WEBP accepted.</p>
        </div>
      )}
      <button
        onClick={handleUploadClick}
        className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 flex items-center justify-center space-x-2"
      >
        <UploadIcon className="h-5 w-5" />
        <span>{currentImageUrl ? 'Change Image' : 'Upload Image'}</span>
      </button>
    </div>
  );
};

export default ImageUpload;
