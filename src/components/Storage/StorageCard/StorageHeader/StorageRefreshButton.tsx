import { IconButton } from '@rmwc/icon-button';
import React from 'react';

import { useStorageFiles } from '../../StorageApiProvider';

export const StorageRefreshButton: React.FC = () => {
  const { refresh } = useStorageFiles();
  return (
    <IconButton
      onClick={refresh}
      icon="refresh"
      label="Refresh"
      theme="secondary"
    />
  );
};
