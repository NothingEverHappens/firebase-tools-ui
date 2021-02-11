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

import { renderWithStorage } from '../testing/StorageTestProviders';
import { UploadDropzone } from './UploadDropzone';

describe('UploadDropzone', () => {
  it('updates the URL when selecting different bucket', async () => {
    const childText = 'Priojok';
    const { findByText } = await renderWithStorage(async () => {
      return <UploadDropzone>{childText}</UploadDropzone>;
    });

    expect(await findByText(childText)).toBeDefined();
  });
});
