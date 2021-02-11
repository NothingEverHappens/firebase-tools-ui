/**
 * Copyright 2020 Google LLC
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

import { render, waitFor } from '@testing-library/react';
import firebase from 'firebase';
import React, { Suspense, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { useStorage } from 'reactfire';
import configureStore from 'redux-mock-store';

import { AppState } from '../../../store';
import {
  StorageEmulatedApiProvider,
  useStorageFiles,
} from '../StorageApiProvider';

interface RenderOptions {
  path?: string;
}

export const renderWithStorage = async (
  children: (storage: firebase.storage.Storage) => Promise<React.ReactElement>,
  options: RenderOptions = {}
) => {
  const component = render(
    <StorageTestProviders path={options.path}>
      <AsyncStorage callback={children} />
    </StorageTestProviders>
  );

  const clearAll = async () => {
    // Always have empty state in the beginning.
    (await component.findByText('Delete all files')).click();
  };

  await waitFor(() => component.getByTestId(ASYNC_STORAGE_WRAPPER_TEST_ID), {
    // Some test setup can take longer than default 1000ms (esp. cold starts).
    timeout: 5000,
  });

  return {
    ...component,
    clearAll,
  };
};

export const StorageTestProviders: React.FC<RenderOptions> = React.memo(
  ({ children, path = '' }) => {
    const projectId = `${process.env.GCLOUD_PROJECT}-${Date.now()}`;
    const hostAndPort =
      process.env.STORAGE_EMULATOR_HOST ||
      process.env.FIREBASE_STORAGE_EMULATOR_ADDRESS ||
      '111:222';
    if (!projectId || !hostAndPort) {
      throw new Error('StorageTestProviders requires a running Emulator');
    }
    const [host, port] = hostAndPort.split(':');
    const store = configureStore<Pick<AppState, 'config'>>()({
      config: {
        loading: false,
        result: {
          data: {
            projectId,
            storage: { hostAndPort, host, port: Number(port) },
          },
        },
      },
    });

    return (
      <Provider store={store}>
        <StorageEmulatedApiProvider disableDevTools>
          <MemoryRouter initialEntries={[path]}>
            <Suspense
              fallback={<h1 data-testid="fallback">Storage Fallback</h1>}
            >
              {children}
            </Suspense>
          </MemoryRouter>
        </StorageEmulatedApiProvider>
      </Provider>
    );
  }
);

const ASYNC_STORAGE_WRAPPER_TEST_ID = 'AsyncStorage-wrapper';

const AsyncStorage: React.FC<{
  callback: (storage: firebase.storage.Storage) => Promise<React.ReactElement>;
}> = React.memo(({ callback }) => {
  const storage = useStorage();

  const [
    storageChildren,
    setStorageChildren,
  ] = useState<React.ReactElement | null>(null);

  useEffect(() => {
    callback({ ...storage }).then(setStorageChildren);
  }, [callback, storage, setStorageChildren]);

  return storageChildren ? (
    <div data-testid={ASYNC_STORAGE_WRAPPER_TEST_ID}>{storageChildren}</div>
  ) : null;
});
