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

import { renderWithStorage } from '../../testing/StorageTestProviders';
import { BucketPicker } from './BucketPicker';

describe('BucketPicket', () => {
  it('updates the URL when selecting different bucket', async () => {
    const render1 = await renderWithStorage(async () => {
      return <BucketPicker />;
    });

    fireEvent.change(await render1.findByTestId('bucket-picker'), {
      target: { value: 'pirojok-121212' },
    });

    // TODO(kirjs): Fix this test
  });
});