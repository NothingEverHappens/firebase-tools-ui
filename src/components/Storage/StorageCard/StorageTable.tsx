import { randomId } from '@rmwc/base';
import { Checkbox } from '@rmwc/checkbox';
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableContent,
  DataTableHead,
  DataTableHeadCell,
  DataTableRow,
} from '@rmwc/data-table';
import React, { useEffect, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

import { formatBytes } from '../../common/formatBytes';
import { removeTrailingSlash } from '../StorageApiProvider';
import { StorageItem } from '../types';
import { StorageIcon } from './Shared/StorageIcon';
import styles from './Storage.module.scss';
import { StorageActionHeader } from './StorageHeader/StorageActionHeader/StorageActionHeader';
import { StorageDefaultHeader } from './StorageHeader/StorageDefaultHeader/StorageDefaultHeader';
import StorageSidebar from './StorageSidebar/StorageSidebar';
import { StorageZeroState } from './StorageZeroState';

interface StorageTableRowProps {
  file: StorageItem;
  onToggle: (file: StorageItem) => void;
  onOpen: (file: StorageItem) => void;
  checked: boolean;
  selected: boolean;
}

export const StorageTableRow: React.FC<StorageTableRowProps> = ({
  file,
  onToggle,
  checked,
  onOpen,
  selected,
}) => {
  const { url } = useRouteMatch();
  const [labelId] = useState(randomId('storage-table'));
  const [checkboxId] = useState(randomId('storage-table'));

  return (
    <DataTableRow
      tabIndex={0}
      role="row button"
      selected={selected}
      onClick={() => {
        onOpen(file);
      }}
    >
      <DataTableCell>
        <Checkbox
          id={checkboxId}
          aria-labelledby={labelId}
          onChange={() => onToggle(file)}
          onClick={(e) => e.stopPropagation()}
          checked={checked}
        />
      </DataTableCell>
      <DataTableCell id={labelId}>
        {file.type === 'file' ? (
          <>
            <StorageIcon contentType={file.contentType!} />
            {file.name}
          </>
        ) : (
          <>
            <StorageIcon contentType="folder" />
            <Link to={removeTrailingSlash(url) + '/' + file.name}>
              {file.name}
            </Link>
          </>
        )}
      </DataTableCell>
      <DataTableCell>
        {file.type === 'folder' ? <>&mdash;</> : formatBytes(file.size)}
      </DataTableCell>
      <DataTableCell>
        {file.type === 'folder' ? 'folder' : file.contentType}
      </DataTableCell>
      <DataTableCell>
        {file.type === 'folder' ? <>&mdash;</> : file.updated}
      </DataTableCell>
    </DataTableRow>
  );
};

interface StorageTableProps {
  files: StorageItem[];
}

export const StorageTable: React.FC<StorageTableProps> = ({ files }) => {
  const [selectedFilesPaths, setSelectedFilesPaths] = useState(
    new Set<string>()
  );
  const [selectedFile, setSelectedFile] = useState<StorageItem | null>(null);

  const toggleCheckbox = (file: StorageItem) => {
    const path = file.fullPath;
    selectedFilesPaths.has(path)
      ? selectedFilesPaths.delete(path)
      : selectedFilesPaths.add(path);
    setSelectedFilesPaths(new Set([...selectedFilesPaths]));
  };

  const clearSelection = () => {
    setSelectedFilesPaths(new Set());
    setSelectedFile(null);
  };

  useEffect(() => {
    if (files.length === 0) {
      clearSelection();
    }
  }, [files]);

  const toggleAll = () => {
    if (selectedFilesPaths.size < files.length) {
      return setSelectedFilesPaths(
        new Set([...files.map((file) => file.fullPath)])
      );
    }

    if (selectedFilesPaths.size === files.length) {
      return clearSelection();
    }
  };

  return (
    <>
      {selectedFilesPaths.size === 0 && <StorageDefaultHeader />}
      {selectedFilesPaths.size > 0 && (
        <StorageActionHeader
          clearSelection={clearSelection}
          selectedFilesPaths={[...selectedFilesPaths]}
        />
      )}
      <div className={styles.storageWrapper}>
        <div className={styles.storageTableWrapper}>
          <DataTable className={styles.storageTableWrapper}>
            <DataTableContent>
              <DataTableHead>
                <DataTableRow>
                  <DataTableHeadCell>
                    <Checkbox
                      disabled={files.length === 0}
                      onClick={toggleAll}
                      aria-label={
                        selectedFilesPaths.size === files.length
                          ? 'Select none'
                          : 'Select all'
                      }
                      indeterminate={
                        selectedFilesPaths.size > 0 &&
                        selectedFilesPaths.size < files.length
                      }
                      checked={
                        selectedFilesPaths.size > 0 &&
                        selectedFilesPaths.size === files.length
                      }
                    />
                  </DataTableHeadCell>
                  <DataTableHeadCell>Name</DataTableHeadCell>
                  <DataTableHeadCell>Size</DataTableHeadCell>
                  <DataTableHeadCell>Type</DataTableHeadCell>
                  <DataTableHeadCell>Last Modified</DataTableHeadCell>
                </DataTableRow>
              </DataTableHead>
              <DataTableBody>
                {files.map((file) => (
                  <StorageTableRow
                    key={file.name}
                    file={file}
                    selected={selectedFile === file}
                    checked={selectedFilesPaths.has(file.fullPath)}
                    onToggle={toggleCheckbox}
                    onOpen={setSelectedFile}
                  />
                ))}
              </DataTableBody>
            </DataTableContent>
          </DataTable>
          {files.length === 0 && <StorageZeroState />}
        </div>
        {selectedFile && selectedFile.type === 'file' && (
          <StorageSidebar
            file={selectedFile}
            onClose={() => {
              setSelectedFile(null);
            }}
          />
        )}
      </div>
    </>
  );
};

export default StorageTable;
