import { act, fireEvent } from '@testing-library/react';

import { StorageFile, StorageFolder } from '../types';

export async function uploadFile(
  fileInput: HTMLInputElement,
  name = 'lol.png'
) {
  const file = new File(['pirojok'], name, {
    type: 'text/plain',
  });

  await act(async () => {
    await fireEvent.change(fileInput, {
      target: { files: [file] },
    });
  });
}

export function createFakeFile(file: Partial<StorageFile> = {}): StorageFile {
  return {
    type: 'file',
    name: 'pirojok',
    contentType: 'food/pirojok',
    updated: new Date().toISOString(),
    timeCreated: new Date().toISOString(),
    fullPath: 'folder/pirojok',
    bucket: 'any',
    size: 777,
    downloadURLs: [],
    generation: '',
    metageneration: '',
    ...file,
  };
}

export function createFakeFolder(
  folder: Partial<StorageFolder> = {}
): StorageFolder {
  return {
    type: 'folder',
    name: 'pirojok',
    fullPath: 'folder/pirojok',
    ...folder,
  };
}
