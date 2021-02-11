import { Typography } from '@rmwc/typography';
import React from 'react';

import styles from './Storage.module.scss';
import { UploadDropzone } from './UploadDropzone';

export const StorageZeroState: React.FC = () => {
  return (
    <div className={styles.zeroState}>
      <UploadDropzone>
        <Typography
          tag="div"
          use="body2"
          aria-live="polite"
          theme="textSecondaryOnBackground"
        >
          There are no files here yet
        </Typography>

        <Typography
          use="body1"
          aria-live="polite"
          theme="textSecondaryOnBackground"
        >
          Drag and drop files here to upload.
        </Typography>
      </UploadDropzone>
    </div>
  );
};
