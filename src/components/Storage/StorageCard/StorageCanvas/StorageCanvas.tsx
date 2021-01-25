import React from 'react';

import { BucketPicker } from './BucketPicker';
import styles from './StorageCanvas.module.scss';
import { StorageDeleteAllButton } from './StorageDeleteAllButton';

export const StorageCanvas: React.FC = () => {
  return (
    <div className={styles.canvasWrapper}>
      <BucketPicker></BucketPicker>
      <StorageDeleteAllButton></StorageDeleteAllButton>
    </div>
  );
};
