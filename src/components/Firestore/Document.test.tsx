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

import { Portal } from '@rmwc/base';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { useFirestoreCollection, useFirestoreDocData } from 'reactfire';

import { ApiProvider } from './ApiContext';
import { Document, Root } from './Document';
import { fakeDocumentReference, fakeFirestoreApi } from './testing/models';

jest.mock('reactfire', () => ({
  useFirestoreCollection: jest.fn(),
  useFirestoreDocData: jest.fn(),
}));

describe('Document', () => {
  beforeEach(() => {
    useFirestoreCollection.mockClear();
    useFirestoreDocData.mockClear();
  });

  it('shows the root-id', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Portal />
        <ApiProvider value={fakeFirestoreApi()}>
          <Root />
        </ApiProvider>
      </MemoryRouter>
    );

    expect(getByText(/Root/)).not.toBeNull();
  });

  it('shows the document-id', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Portal />
        <ApiProvider value={fakeFirestoreApi()}>
          <Document reference={fakeDocumentReference({ id: 'my-stuff' })} />
        </ApiProvider>
      </MemoryRouter>
    );

    expect(getByText(/my-stuff/)).not.toBeNull();
  });

  it('shows the root collection-list', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <Portal />
        <ApiProvider value={fakeFirestoreApi()}>
          <Root />
        </ApiProvider>
      </MemoryRouter>
    );

    expect(getByTestId('collection-list')).not.toBeNull();
  });

  it('shows the document collection-list', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <Portal />
        <ApiProvider value={fakeFirestoreApi()}>
          <Document reference={fakeDocumentReference()} />
        </ApiProvider>
      </MemoryRouter>
    );

    expect(getByTestId('collection-list')).not.toBeNull();
  });

  it('shows the selected root-collection', () => {
    useFirestoreCollection.mockReturnValueOnce({ docs: [] });

    const { getByText } = render(
      <MemoryRouter initialEntries={['//cool-coll-1']}>
        <Portal />
        <ApiProvider value={fakeFirestoreApi()}>
          <Root />
        </ApiProvider>
      </MemoryRouter>
    );

    expect(getByText(/cool-coll-1/)).not.toBeNull();
  });

  it('shows the selected document-collection', () => {
    useFirestoreCollection.mockReturnValueOnce({ docs: [] });

    const { getByText } = render(
      <MemoryRouter initialEntries={['//cool-coll-1']}>
        <Portal />
        <ApiProvider value={fakeFirestoreApi()}>
          <Document reference={fakeDocumentReference()} />
        </ApiProvider>
      </MemoryRouter>
    );

    expect(getByText(/cool-coll-1/)).not.toBeNull();
  });
});
