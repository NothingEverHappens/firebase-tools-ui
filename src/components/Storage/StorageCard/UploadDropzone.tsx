import { Typography } from '@rmwc/typography';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import { useStorageFiles } from '../StorageApiProvider';
import styles from './Storage.module.scss';

export interface UploadButtonProps {}

export const UploadDropzone: React.FC<UploadButtonProps> = ({ children }) => {
  const { uploadFiles } = useStorageFiles();
  const onDrop = useCallback(
    (files) => {
      uploadFiles(files);
    },
    [uploadFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  });

  return (
    <div {...getRootProps()} className={styles.dropzoneWrapper}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <Typography
          use="body2"
          aria-live="polite"
          theme="textSecondaryOnBackground"
        >
          Drop files...
        </Typography>
      ) : (
        <div>{children}</div>
      )}
    </div>
  );
};
