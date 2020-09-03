import { act, fireEvent, render } from '@testing-library/react';
import React from 'react';

import { AddAuthUserPayload } from '../types';
import UserForm from './UserForm';

describe('UserForm', () => {
  const displayName = 'pirojok';

  function setup(user?: AddAuthUserPayload) {
    const onSave = jest.fn();
    const onClose = jest.fn();
    const methods = render(
      <UserForm onSave={onSave} user={user} onClose={onClose} />
    );

    const triggerValidation = async () => {
      await act(async () => {
        fireEvent.submit(methods.getByTestId('user-form'));
      });
    };
    return {
      onSave,
      onClose,
      triggerValidation,
      ...methods,
    };
  }

  it('calls onSave on form submit', async () => {
    const { triggerValidation, onSave, onClose } = setup({ displayName });

    expect(onSave).not.toHaveBeenCalled();

    await triggerValidation();
    expect(onClose).toHaveBeenCalled();
    expect(onSave).toHaveBeenCalledWith(
      jasmine.objectContaining({
        displayName: 'pirojok',
      })
    );
  });

  it('calls onSave, but does not close the form when "create and new" clicked.', async () => {
    const { getByText, getByLabelText, onSave, onClose } = setup({
      displayName: '',
    });

    const input = getByLabelText('Display name') as HTMLInputElement;

    fireEvent.change(input, {
      target: { value: displayName },
    });

    await act(async () => {
      fireEvent.click(getByText('Save and create another'));
    });

    // Resets the form
    expect(input.value).toBe('');
    // Create user
    expect(onSave).toHaveBeenCalledWith(
      jasmine.objectContaining({
        displayName: 'pirojok',
      })
    );

    // But doesn't close the dialog.
    expect(onClose).not.toHaveBeenCalled();
  });

  it('sets input values based on passed user value', async () => {
    const email = 'lol@lol.lol';
    const password = 'qwerty';
    const { getByLabelText, queryByLabelText } = setup({
      displayName,
      email,
      password,
    });
    expect((getByLabelText('Display name') as HTMLInputElement).value).toBe(
      displayName
    );
    expect(
      (queryByLabelText('Email/Password (optional)') as HTMLInputElement).value
    ).toBe(email);
    expect((queryByLabelText('Password') as HTMLInputElement).value).toBe(
      password
    );
  });

  it('does not call onSave on form submit if there are errors', async () => {
    const { triggerValidation, onSave, onClose } = setup({ displayName: '' });

    await triggerValidation();

    expect(onSave).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
});
