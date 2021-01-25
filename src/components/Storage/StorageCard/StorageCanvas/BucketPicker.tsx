import { Select } from '@rmwc/select';
import React from 'react';

import { useBucket, useStorageBuckets } from '../../StorageApiProvider';

export const BucketPicker: React.FC = () => {
  const buckets = useStorageBuckets();
  const [bucket, setBucket] = useBucket();

  const goToBucket = (e: any) => {
    setBucket(e.target.value);
  };

  return (
    <Select
      name="bucket"
      data-testid="bucket-picker"
      placeholder="Bucket"
      icon="home"
      outlined
      value={bucket}
      onChange={(e) => goToBucket(e)}
      options={buckets}
    />
  );
};
