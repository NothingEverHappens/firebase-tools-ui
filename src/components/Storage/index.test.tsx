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

import React from 'react';

import { StorageRoute } from './index';
import { renderWithStorage } from './testing/StorageTestProviders';
import { uploadFile } from './testing/testUtils';

const host = 'localhost';
const port = 5002;
// const sampleConfig: StorageConfig = {
//   host,
//   port,
//   hostAndPort: '${host}:${port}',
// };
//
describe('StorageRoute', () => {
  // it('renders loading when projectId is not ready', async () => {
  //   const { getByText } = await renderWithStorage(async () => <StorageRoute/>);
  //
  //   expect(getByText('Loading Storage SDK')).not.toBeNull();
  // });
  //
  // it('renders zero state', async () => {
  //   const { getByTestId, findByText, findByTestId, getByText, queryByText } = await renderWithStorage(async () =>
  //     <StorageRoute/>);
  //
  //   await findByText('There are no files here yet', {}, { timeout: 5000 });
  //
  // });

  it('Allows to upload files', async () => {
    const {
      getByTestId,
      findByText,
      getByText,
      queryByText,
      clearAll,
    } = await renderWithStorage(async () => <StorageRoute />);

    await clearAll();

    await findByText('There are no files here yet', {}, { timeout: 5004 });

    const filename = 'lol.png';

    expect(queryByText(filename)).toBeNull();
    await uploadFile(
      (await getByTestId('file-uploader')) as HTMLInputElement,
      filename
    );

    expect(getByText(filename)).toBeDefined();
  });
});
