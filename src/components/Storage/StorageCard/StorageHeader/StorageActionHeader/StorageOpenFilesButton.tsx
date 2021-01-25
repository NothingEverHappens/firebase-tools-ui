import { Button } from '@rmwc/button';
import React from 'react';

import { useStorageFiles } from '../../../StorageApiProvider';

interface StorageDeleteButtonProps {
  selectedFilesPaths: string[];
}

export const StorageOpenFilesButton: React.FC<StorageDeleteButtonProps> = ({
  selectedFilesPaths,
}) => {
  const { openAllFiles } = useStorageFiles();
  return (
    <Button
      unelevated
      onClick={() => {
        openAllFiles(selectedFilesPaths);
      }}
    >
      Open
    </Button>
  );
};
