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

const host = 'localhost';
const port = 5002;
// const sampleConfig: StorageConfig = {
//   host,
//   port,
//   hostAndPort: '${host}:${port}',
// };
//
describe('StorageRoute', () => {
  it('renders loading when projectId is not ready', async () => {
    const { getByText } = await renderWithStorage(async () => <StorageRoute />);

    expect(getByText('Loading Storage SDK')).not.toBeNull();
  });
});
//
//   it('renders loading when config is not ready', () => {
//     const { getByText } = render(
//       <StorageRoute
//         storageUsersResult={{ data: [] }}
//         projectIdResult={{ data: 'pirojok' }}
//         storageConfigResult={undefined}
//       />,
//     );
//     expect(getByText('Storage Emulator Loading...')).not.toBeNull();
//   });
//
//   it('renders error when loading config fails', () => {
//     const { getByText } = render(
//       <StorageRoute
//         projectIdResult={{ data: 'pirojok' }}
//         storageConfigResult={{ error: { message: 'Oh, snap!' } }}
//         storageUsersResult={{ data: [] }}
//       />,
//     );
//     expect(getByText(/not running/)).not.toBeNull();
//   });
//
//   it('displays storage', async () => {
//     const store = getMockStorageStore();
//
//     const { getByText } = render(
//       <Provider store={store}>
//         // Ripples cause "not wrapped in act()" warning.
//         <RMWCProvider ripple={false}>
//           <StorageRoute
//             storageUsersResult={{ data: [] }}
//             projectIdResult={{ data: 'pirojok' }}
//             storageConfigResult={{ data: sampleConfig }}
//           />
//         </RMWCProvider>
//       </Provider>,
//     );
//     expect(getByText(/No users for this project yet/)).not.toBeNull();
//   });
// });
