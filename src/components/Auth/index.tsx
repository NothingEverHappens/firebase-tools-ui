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

import { Elevation } from '@rmwc/elevation';
import { GridCell } from '@rmwc/grid';
import React from 'react';
import { connect } from 'react-redux';

import { createStructuredSelector } from '../../store';
import { getProjectIdResult } from '../../store/config/selectors';
import { handle } from '../../store/utils';
import { EmulatorDisabled } from '../common/EmulatorDisabled';
import { Spinner } from '../common/Spinner';
import ClearAll from './UsersCard/ClearAll';
import UsersCard from './UsersCard/UsersCard';

export const mapStateToProps = createStructuredSelector({
  projectIdResult: getProjectIdResult,
});

export type PropsFromState = ReturnType<typeof mapStateToProps>;

export const AuthRoute: React.FC<PropsFromState> = ({ projectIdResult }) => {
  return handle(projectIdResult, {
    onNone: () => <Spinner span={12} message="Auth Emulator Loading..." />,
    onError: () => <AuthRouteDisabled />,
    onData: ([projectId]) => <Auth projectId={projectId} />,
  });
};

export interface AuthProps {
  projectId: string;
}

export const Auth: React.FC<AuthProps> = () => (
  <GridCell span={12} className="Auth">
    <ClearAll />
    <Elevation z="2" wrap>
      <UsersCard />
    </Elevation>
  </GridCell>
);

export const AuthRouteDisabled: React.FC = () => (
  <EmulatorDisabled productName="Auth" />
);

export default connect(mapStateToProps)(AuthRoute);
