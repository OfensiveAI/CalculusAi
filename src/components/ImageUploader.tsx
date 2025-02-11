import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageUpload(acceptedFiles[0]);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className="flex justify-center rounded-xl border-2 border-dashed border-white/25 px-6 py-8 cursor-pointer hover:border-white/40 transition-colors bg-white/5 backdrop-blur group"
    >
      <div className="text-center">
        <PhotoIcon className="mx-auto h-12 w-12 text-white/50 group-hover:text-white/70 transition-colors" aria-hidden="true" />
        <div className="mt-4 flex text-sm leading-6 text-white/70">
          <input {...getInputProps()} />
          <p className="relative">
            {isDragActive ? (
              <span className="text-white/90">Drop your image here...</span>
            ) : (
              <span>
                Upload a photo of your math problem
                <span className="text-white/50"> or drag and drop</span>
              </span>
            )}
          </p>
        </div>
        <p className="text-xs leading-5 text-white/50">PNG, JPG up to 10MB</p>
      </div>
    </div>
  );
}