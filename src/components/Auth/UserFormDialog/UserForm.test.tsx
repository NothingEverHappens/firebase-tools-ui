import { Portal } from '@rmwc/base';
import { act, fireEvent, render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';

import { createRemoteDataLoaded } from '../../../store/utils';
import { createFakeUser, getMockAuthStore } from '../test_utils';
import { AuthUser } from '../types';
import { UserForm, UserFormProps } from './UserForm';

describe('UserForm', () => {
  const displayName = 'pirojok';
  const phoneNumber = '+1 555-555-0100';

  function setup(testProps: Partial<UserFormProps>) {
    const store = getMockAuthStore();
    const updateUser = jest.fn();
    const createUser = jest.fn();
    const clearAuthUserDialogData = jest.fn();
    const props = {
      authUserDialogData: undefined,
      updateUser,
      createUser: createUser,
      clearAuthUserDialogData,
      ...testProps,
    };
    const methods = render(
      <Provider store={store}>
        <Portal />
        <UserForm {...props} />
      </Provider>
    );

    const triggerValidation = async () => {
      await act(async () => {
        fireEvent.submit(methods.getByTestId('user-form'));
      });
    };

    return {
      updateUser,
      createUser,
      clearAuthUserDialogData,
      triggerValidation,
      ...methods,
    };
  }

  it('calls onUpdate on form submit if user is provided', async () => {
    const user = createFakeUser({
      displayName,
      phoneNumber,
    });

    const {
      triggerValidation,
      getByText,
      updateUser,
      queryByText,
      clearAuthUserDialogData,
    } = setup({
      authUserDialogData: createRemoteDataLoaded(user),
    });

    // Appropriate title is set
    getByText('Edit User ' + displayName);
    expect(queryByText('Save and create another')).toBeNull();

    expect(updateUser).not.toHaveBeenCalled();

    await triggerValidation();
    expect(updateUser).toHaveBeenCalledWith({
      localId: user.localId,
      user: jasmine.objectContaining({
        displayName,
        phoneNumber,
      }),
    });
    expect(clearAuthUserDialogData).toHaveBeenCalled();
  });

  it('calls onCreate on form submit if user is provided', async () => {
    const {
      triggerValidation,
      getByText,
      getByLabelText,
      createUser,
      clearAuthUserDialogData,
    } = setup({});

    expect(createUser).not.toHaveBeenCalled();

    getByText('Add a user');

    const input = getByLabelText(/Phone/) as HTMLInputElement;

    await act(async () => {
      await fireEvent.change(input, {
        target: { value: phoneNumber },
      });
      await fireEvent.blur(input);
    });

    await triggerValidation();

    expect(createUser).toHaveBeenCalled();
    expect(clearAuthUserDialogData).toHaveBeenCalled();
  });

  it('calls onCreate, but does not close the form when "create and new" clicked', async () => {
    const {
      triggerValidation,
      getByLabelText,
      getByText,
      createUser,
      clearAuthUserDialogData,
    } = setup({});

    expect(createUser).not.toHaveBeenCalled();

    const input = getByLabelText(/Phone/) as HTMLInputElement;

    await act(async () => {
      await fireEvent.change(input, {
        target: { value: phoneNumber },
      });
      await fireEvent.blur(input);
    });

    await triggerValidation();

    await act(async () => {
      await fireEvent.click(getByText('Save and create another'));
    });

    expect(createUser).toHaveBeenCalled();
    expect(clearAuthUserDialogData).toHaveBeenCalled();
  });

  it('does not call onSave on form submit if there are errors', async () => {
    const { triggerValidation, updateUser } = setup({
      authUserDialogData: createRemoteDataLoaded({
        phoneNumber: '',
      } as AuthUser),
    });

    await triggerValidation();

    expect(updateUser).not.toHaveBeenCalled();
  });
});
