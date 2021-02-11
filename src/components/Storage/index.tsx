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

import './index.module.scss';

import { Card } from '@rmwc/card';
import { Elevation } from '@rmwc/elevation';
import { GridCell } from '@rmwc/grid';
import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import { getProjectIdResult } from '../../store/config/selectors';
import { combineData, handle } from '../../store/utils';
import { EmulatorDisabled } from '../common/EmulatorDisabled';
import { Spinner } from '../common/Spinner';
import {
  StorageApiProvider,
  StorageEmulatedApiProvider,
  useStorageFiles,
} from './StorageApiProvider';
import { StorageCanvas } from './StorageCard/StorageCanvas/StorageCanvas';
import StorageTable from './StorageCard/StorageTable';

export const StorageRoute: React.FC = () => {
  const projectIdResult = useSelector(getProjectIdResult);

  return handle(combineData(projectIdResult), {
    onNone: () => <Spinner span={12} message="Storage Emulator Loading..." />,
    onError: () => <StorageRouteDisabled />,
    onData: () =>
      (false as any) ? (
        <StorageRouteDisabled />
      ) : (
        <StorageEmulatedApiProvider>
          <Storage />
        </StorageEmulatedApiProvider>
      ),
  });
};

export const Storage: React.FC = () => {
  const { files } = useStorageFiles();

  return (
    <GridCell span={12} className="Storage">
      <StorageCanvas />
      <Elevation z="2" wrap>
        <Card>
          <StorageTable files={files!} />
        </Card>
      </Elevation>
    </GridCell>
  );
};

export const StorageRouteDisabled: React.FC = () => (
  <EmulatorDisabled productName="Storage" />
);

export const StorageRouteWrapper: React.FC = () => {
  let { path } = useRouteMatch()!;
  return (
    <Suspense fallback={<div>lol</div>}>
      <StorageApiProvider>
        <Switch>
          <Route path={path + '/:bucket/:path*'} component={StorageRoute} />
          <Redirect from={path} to={path + '/pirojok-a935e.appspot.com'} />
        </Switch>
      </StorageApiProvider>
    </Suspense>
  );
};
export default StorageRouteWrapper;
