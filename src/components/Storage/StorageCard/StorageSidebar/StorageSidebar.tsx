import { IconButton } from '@rmwc/icon-button';
import { Typography } from '@rmwc/typography';
import React from 'react';

import { formatBytes } from '../../../common/formatBytes';
import { StorageFile } from '../../types';
import styles from './StorageSidebar.module.scss';

interface StorageSidebarProps {
  file: StorageFile;
  onClose: () => void;
}

export const StorageSidebar: React.FC<StorageSidebarProps> = ({
  file,
  onClose,
}) => {
  return (
    <aside className={styles.sidebar}>
      <header>
        <Typography use="headline6">{file.name}</Typography>
        <IconButton onClick={onClose} icon="cancel" />
      </header>
      <dl className={styles.metadata}>
        <dt>
          <Typography use="body2" theme="secondary">
            name
          </Typography>
        </dt>
        <dd>
          <Typography use="body2">{file.name}</Typography>
        </dd>

        <dt>
          <Typography use="body2" theme="secondary">
            size
          </Typography>
        </dt>
        <dd>
          <Typography use="body2">{formatBytes(file.size)}</Typography>
        </dd>

        <dt>
          <Typography use="body2" theme="secondary">
            type
          </Typography>
        </dt>
        <dd>
          <Typography use="body2">{file.contentType}</Typography>
        </dd>

        <dt>
          <Typography use="body2" theme="secondary">
            created
          </Typography>
        </dt>
        <dd>
          <Typography use="body2">{file.timeCreated}</Typography>
        </dd>

        <dt>
          <Typography use="body2" theme="secondary">
            Updated
          </Typography>
        </dt>
        <dd>
          <Typography use="body2">{file.updated}</Typography>
        </dd>
      </dl>
    </aside>
  );
};

export default StorageSidebar;
