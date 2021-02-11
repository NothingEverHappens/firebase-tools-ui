import { Icon } from '@rmwc/icon';
/**
 * Map between mime types and material icons.
 */
import React from 'react';

import styles from './StorageIcon.module.scss';

const MIME_TYPE_ICON_MAP: { [mimeType: string]: string } = {
  // adobe illustrator
  'application/illustrator': 'drive_ai',
  // microsoft word
  'application/msword': 'drive_ms_word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'drive_ms_word',
  // microsoft powerpoint
  'application/vnd.ms-powerpoint': 'drive_ms_powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    'drive_ms_powerpoint',
  // microsoft excel
  'application/vnd.ms-excel': 'drive_ms_excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    'drive_ms_excel',
  // adobe acrobat
  'application/pdf': 'drive_pdf',
  // adobe photoshop
  'application/photoshop': 'drive_ps',
  'application/psd': 'drive_ps',
  'application/x-photoshop': 'drive_ps',
  'image/photoshop': 'drive_ps',
  'image/psd': 'drive_ps',
  'image/x-photoshop': 'drive_ps',
  'image/x-psd': 'drive_ps',
  // images
  'image/gif': 'photo',
  'image/jpg': 'photo',
  'image/jpeg': 'photo',
  'image/png': 'photo',
  'image/svg+xml': 'photo',
  'image/webp': 'photo',
  // audio
  'audio/m4a': 'drive_audio',
  'audio/mp3': 'drive_audio',
  'audio/mpeg': 'drive_audio',
  'audio/wav': 'drive_audio',
  'audio/x-ms-wma': 'drive_audio',
  // video
  'video/avi': 'drive_video',
  'video/mp4': 'drive_video',
  'video/mpeg': 'drive_video',
  'video/quicktime': 'drive_video',
  'video/x-ms-wmv': 'drive_video',
  // zip, csv, tsv
  'application/zip': 'drive_zip',
  'application/csv': 'csv',
  'text/csv': 'csv',
  'text/tsv': 'tsv',
  'text/tab-separated-values': 'tsv',
  // text documents
  'text/javascript': 'drive_document',
  'text/plain': 'drive_document',
  'text/x-log': 'drive_document',
  folder: 'folder_open',
};

export interface StorageIconProps {
  contentType: string;
}

export const StorageIcon: React.FC<StorageIconProps> = ({ contentType }) => {
  const icon = MIME_TYPE_ICON_MAP[contentType];
  return (
    <Icon
      icon={icon}
      className={`material-icons-extended ${styles.storageIcon}`}
    />
  );
};
