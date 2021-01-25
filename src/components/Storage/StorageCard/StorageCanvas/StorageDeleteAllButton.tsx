import { Button } from '@rmwc/button';
import React from 'react';

import { CustomThemeProvider } from '../../../../themes';
import { useStorageFiles } from '../../StorageApiProvider';

export const StorageDeleteAllButton: React.FC = () => {
  const { deleteAll } = useStorageFiles();
  return (
    <CustomThemeProvider use="warning" wrap>
      <Button unelevated onClick={deleteAll}>
        Delete all files
      </Button>
    </CustomThemeProvider>
  );
};
