/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { fireEvent } from '@testing-library/react';
import React from 'react';

import { renderWithStorage } from '../testing/StorageTestProviders';
import { createFakeFile, createFakeFolder } from '../testing/testUtils';
import { StorageItem } from '../types';
import { StorageTable } from './StorageTable';

describe('StorageTable', () => {
  const folderName = 'pirojokFolder';
  const fileName = 'pirojok';
  it('Displays zero state if there are no files', async () => {
    const files: StorageItem[] = [];
    const { findByText } = await renderWithStorage(async () => {
      return <StorageTable files={files} />;
    });

    expect(
      await findByText('There are no files here yet', {}, { timeout: 5000 })
    ).toBeDefined();
  });

  it('displays list of files', async () => {
    const files: StorageItem[] = [
      createFakeFolder({ name: folderName }),
      createFakeFile({ name: fileName }),
    ];
    const { findByText, getByText, findAllByRole } = await renderWithStorage(
      async () => {
        return <StorageTable files={files} />;
      }
    );

    expect(await findByText(fileName, {}, { timeout: 5000 })).toBeDefined();
    expect(getByText(folderName)).toBeDefined();

    const rows = await findAllByRole('row', {}, { timeout: 5000 });
    expect(rows.length).toBe(3);
  });

  it.only('opens side panel', async () => {
    const files: StorageItem[] = [
      createFakeFolder({ name: folderName }),
      createFakeFile({ name: fileName }),
    ];
    const {
      findByText,
      getByText,
      findAllByRole,
      findAllByText,
      debug,
    } = await renderWithStorage(async () => {
      return <StorageTable files={files} />;
    });

    expect(await findByText(fileName, {}, { timeout: 5000 })).toBeDefined();
    expect(getByText(folderName)).toBeDefined();

    const rows = await findAllByRole('row', {}, { timeout: 5000 });

    // Open file
    rows[2].click();

    expect(getByText('Updated')).toBeDefined();
  });

  it.only('file selection', async () => {
    const files: StorageItem[] = [
      createFakeFolder({ name: folderName }),
      createFakeFile({ name: fileName }),
    ];

    const { getByLabelText, debug } = await renderWithStorage(async () => {
      return <StorageTable files={files} />;
    });

    const selectAll = (await getByLabelText('Select all')) as HTMLInputElement;

    const fileCheckbox = (await getByLabelText(fileName)) as HTMLInputElement;
    const folderCheckbox = (await getByLabelText(
      folderName
    )) as HTMLInputElement;

    expect(selectAll.indeterminate).toBe(false);
    expect(selectAll.checked).toBe(false);
    debugger;
    fileCheckbox.click();
    expect(selectAll.indeterminate).toBe(true);
    expect(selectAll.checked).toBe(false);
    // TODO(kirjs): Select all
    debug();
  });
});
