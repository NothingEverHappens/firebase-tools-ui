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

import { act, fireEvent } from '@testing-library/react';
import React from 'react';

import * as apiProvider from '../../StorageApiProvider';
import { renderWithStorage } from '../../testing/StorageTestProviders';
import { UploadButton } from './UploadButton';

describe('UploadButton', () => {
  it('Triggers appropriate callback', async () => {
    jest
      .spyOn(apiProvider, 'useStorageFiles')
      .mockImplementation(() => ({ uploadFiles } as any));

    const uploadFiles = jest.fn();
    const { getByTestId } = await renderWithStorage(async () => {
      return <UploadButton />;
    });

    expect(uploadFiles).not.toHaveBeenCalled();

    const file = new File(['pirojok'], 'lol.png', {
      type: 'text/plain',
    });

    await act(async () => {
      await fireEvent.change(await getByTestId('file-uploader'), {
        target: { files: [file] },
      });
    });

    expect(uploadFiles).toHaveBeenCalled();
  });
});
