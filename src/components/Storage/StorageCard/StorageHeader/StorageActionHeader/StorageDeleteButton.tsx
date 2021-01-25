import { Button } from '@rmwc/button';
import React from 'react';

import { useStorageFiles } from '../../../StorageApiProvider';

interface StorageDeleteButtonProps {
  selectedFilesPaths: string[];
  clearSelection: () => void;
}

export const StorageDeleteButton: React.FC<StorageDeleteButtonProps> = ({
  clearSelection,
  selectedFilesPaths,
}) => {
  const { remove } = useStorageFiles();
  return (
    <Button
      unelevated
      outlined={true}
      onClick={() => {
        remove(selectedFilesPaths);
        clearSelection();
      }}
    >
      Delete
    </Button>
  );
};
