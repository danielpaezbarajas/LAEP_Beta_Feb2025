import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const { t } = useTranslation();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFileUpload(acceptedFiles);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg transition-colors cursor-pointer
        ${isDragActive 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center text-gray-600">
        <Upload className="w-12 h-12 mb-4 text-gray-400" />
        <p className="text-lg font-medium mb-2">
          {isDragActive ? t('dropzoneActive') : t('dropzoneText')}
        </p>
        <p className="text-sm text-gray-500">
          {t('supportedFormats')}
        </p>
      </div>
    </div>
  );
}