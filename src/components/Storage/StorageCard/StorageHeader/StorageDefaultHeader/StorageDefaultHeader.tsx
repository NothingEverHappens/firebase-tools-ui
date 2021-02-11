import React from 'react';
import { useHistory } from 'react-router-dom';

import {
  CardActionBar,
  CardActionBarActions,
} from '../../../../common/CardActionBar';
import { CopyButton } from '../../../../common/CopyButton';
import { InteractiveBreadCrumbBar } from '../../../../common/InteractiveBreadCrumbBar';
import { useBucket, useStorageFiles } from '../../../StorageApiProvider';
import styles from './StorageHeader.module.scss';
import { StorageRefreshButton } from './StorageRefreshButton';
import { StorageUploadButton } from './StorageUploadButton';

export const StorageDefaultHeader: React.FC = () => {
  const { path } = useStorageFiles();
  const history = useHistory();
  const [bucket] = useBucket();

  return (
    <>
      <CardActionBar className={styles.storageHeader}>
        <CopyButton textToCopy="pikachu" icon="link" />
        <InteractiveBreadCrumbBar
          rootEl={<div style={{ whiteSpace: 'nowrap' }}>gs://{bucket}</div>}
          base={`/storage/${bucket}`}
          path={path}
          onNavigate={(newPath: string) => {
            history.push(`/storage/${bucket}/${newPath}`);
          }}
        />
        <CardActionBarActions>
          <StorageRefreshButton></StorageRefreshButton>
          <StorageUploadButton />
        </CardActionBarActions>
      </CardActionBar>
    </>
  );
};
