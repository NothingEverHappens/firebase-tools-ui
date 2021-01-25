import { IconButton, IconButtonProps } from '@rmwc/icon-button';
import { HTMLProps } from '@rmwc/types';
import * as RMWC from '@rmwc/types';
import React, { useCallback, useState } from 'react';

interface CopyButtonProps extends HTMLProps<IconButtonProps> {
  textToCopy: string;
  icon?: RMWC.IconPropT;
}

function useClipboard(text: string) {
  const [isTextCopied, setIsTextCopied] = useState(false);
  return {
    isTextCopied,
    writeText: useCallback(() => {
      return navigator.clipboard
        .writeText(text)
        .then(() => setIsTextCopied(true))
        .catch(() => setIsTextCopied((isTextCopied) => isTextCopied));
    }, [text]),
  };
}

export function CopyButton({
  textToCopy: text,
  label,
  theme,
  icon = 'content_copy',
}: CopyButtonProps) {
  label = label || 'Copy';
  theme = theme || 'textPrimaryOnBackground';
  const { writeText } = useClipboard(text);
  return (
    <IconButton theme={theme} icon={icon} label={label} onClick={writeText} />
  );
}
