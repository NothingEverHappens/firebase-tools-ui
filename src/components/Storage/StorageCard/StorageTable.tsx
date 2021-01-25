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
import React, { useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

import { formatBytes } from '../../common/formatBytes';
import { removeTrailingSlash } from '../StorageApiProvider';
import { StorageFile } from '../types';
import styles from './Storage.module.scss';
import { StorageActionHeader } from './StorageHeader/StorageActionHeader/StorageActionHeader';
import { StorageHeader } from './StorageHeader/StorageHeader';
import StorageSidebar from './StorageSidebar/StorageSidebar';
import { StorageZeroState } from './StorageZeroState';

interface StorageTableRowProps {
  file: StorageFile;
  onToggle: (file: StorageFile) => void;
  onOpen: (file: StorageFile) => void;
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
  return (
    <DataTableRow selected={selected} onClick={() => onOpen(file)}>
      <DataTableCell>
        <Checkbox
          onChange={() => onToggle(file)}
          onClick={(e) => e.stopPropagation()}
          checked={checked}
        />
      </DataTableCell>
      <DataTableCell>
        {file.type === 'file' ? (
          file.name
        ) : (
          <Link to={removeTrailingSlash(url) + '/' + file.name}>
            {file.name}
          </Link>
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
  files: StorageFile[];
}

export const StorageTable: React.FC<StorageTableProps> = ({ files }) => {
  const [selectedFilesPaths, setSelectedFilesPaths] = useState(
    new Set<string>()
  );
  const [selectedFile, setSelectedFile] = useState<StorageFile | null>(
    files[0]
  );

  const toggleCheckbox = (file: StorageFile) => {
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
      {selectedFilesPaths.size === 0 && <StorageHeader />}
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
