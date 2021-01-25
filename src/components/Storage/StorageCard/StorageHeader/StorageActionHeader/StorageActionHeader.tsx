import { IconButton } from '@rmwc/icon-button';
import { Typography } from '@rmwc/typography';
import React from 'react';

import { CardActionBar } from '../../../../common/CardActionBar';
import styles from './StorageActionHeader.module.scss';
import { StorageDeleteButton } from './StorageDeleteButton';
import { StorageOpenFilesButton } from './StorageOpenFilesButton';

interface StorageActionHeaderProps {
  selectedFilesPaths: string[];
  clearSelection: () => void;
}

export const StorageActionHeader: React.FC<StorageActionHeaderProps> = ({
  selectedFilesPaths,
  clearSelection,
}) => {
  return (
    <>
      <CardActionBar theme="primaryBg">
        <IconButton
          icon="cancel"
          onClick={clearSelection}
          theme="textPrimaryOnDark"
        />

        <span>
          <Typography use="body2" theme="textPrimaryOnDark">
            {selectedFilesPaths.length} item
            {selectedFilesPaths.length > 0 && 's'}
          </Typography>
        </span>
        <div className={styles.buttonWrapper}>
          <StorageDeleteButton
            selectedFilesPaths={selectedFilesPaths}
            clearSelection={clearSelection}
          ></StorageDeleteButton>
          <StorageOpenFilesButton
            selectedFilesPaths={selectedFilesPaths}
          ></StorageOpenFilesButton>
        </div>
      </CardActionBar>
    </>
  );
};
