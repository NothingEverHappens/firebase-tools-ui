import { Button } from '@rmwc/button';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import { useStorageFiles } from '../../../StorageApiProvider';

export interface UploadButtonProps {}

export const StorageUploadButton: React.FC<UploadButtonProps> = () => {
  const { uploadFiles } = useStorageFiles();
  const onDrop = useCallback(
    (files) => {
      uploadFiles(files);
    },
    [uploadFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Button unelevated {...getRootProps()}>
      <input data-testid="file-uploader" {...getInputProps()} />
      {isDragActive ? <p>Drop files...</p> : <p>Upload file</p>}
    </Button>
  );
};
