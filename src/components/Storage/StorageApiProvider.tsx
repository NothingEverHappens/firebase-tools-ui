import firebase from 'firebase';
import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { FirebaseAppProvider, useStorage } from 'reactfire';
import useSWR from 'swr';

import { getStorageConfigResult } from '../../store/config/selectors';
import { Spinner } from '../common/Spinner';
import { StorageItem } from './types';

export const StorageApiContext = React.createContext(null as any);

export const StorageApiProvider: React.FC = React.memo((props) => {
  const data = useSelector(getStorageConfigResult);
  return <StorageApiContext.Provider value={data} {...props} />;
});

export function removeTrailingSlash(path = '') {
  return path.replace(/\/?$/, '');
}

export function useBucket(): [string, (bucket: string) => void] {
  const history = useHistory();
  const buckets = useStorageBuckets();
  const params = useParams<{ bucket: string }>();
  const bucket = params.bucket || buckets![0];

  function setBucket(bucket: string) {
    // TODO: Use a const
    history.push(`/storage/${bucket}`);
  }

  return [bucket, setBucket];
}

export function useStorageBuckets() {
  const fetcher = () =>
    Promise.resolve(['pirojok-12121212', 'pirojok-a935e.appspot.com']);

  const { data: buckets } = useSWR<string[]>('storage/buckets', fetcher, {
    suspense: true,
  });

  return buckets;
}

async function deleteFile(
  storage: firebase.storage.Storage,
  bucket: string,
  path: string
) {
  return storage.refFromURL(`gs://${bucket}/${path}`).delete();
}

export async function deleteFolder(
  storage: firebase.storage.Storage,
  bucket: string,
  path: string
): Promise<any> {
  console.log('deleteFolder', path);
  const list = await storage.refFromURL(`gs://${bucket}/${path}`).listAll();
  const deletedFiles = list.items.map((item) =>
    deleteFile(storage, bucket, item.fullPath)
  );
  const deletedFolders = list.prefixes.map((item) =>
    deleteFolder(storage, bucket, item.fullPath)
  );
  return Promise.all([...deletedFiles, ...deletedFolders]);
}

export function useStorageFiles() {
  const [bucket] = useBucket();
  const storage = useStorage();
  const params = useParams<{ path?: string }>();
  const path = removeTrailingSlash(params['path']);
  const key = `storage/bucket/${bucket}/${path}`;

  function getRef(path: string) {
    return storage.refFromURL(`gs://${bucket}/${path}`);
  }

  const fetcher = async () => {
    return getRef(path)
      .listAll()
      .then((result) => {
        return Promise.all([
          ...result.prefixes.map((prefix) => {
            return {
              ...prefix,
              fullPath: prefix.fullPath,
              name: prefix.name,
              type: 'folder',
            };
          }),
          ...result.items.map((item) => item.getMetadata()),
        ]);
      });
  };

  const { data, mutate } = useSWR<StorageItem[]>(key, fetcher, {
    suspense: true,
  });

  const files = data || [];

  async function recursivelyDeleteFiles(root: string, paths: string[]) {
    const results = paths.map((path) => {
      const type = files.find((file) => file.fullPath === path)!.type;
      console.log(type, path);
      return type === 'file'
        ? deleteFile(storage, bucket, path)
        : deleteFolder(storage, bucket, path);
    });

    return Promise.all(results);
  }

  async function openAllFiles(paths: string[]) {
    const urls = await Promise.all(
      paths.map(getRef).map((ref) => ref.getDownloadURL())
    );

    urls.forEach((url) => {
      const a: HTMLAnchorElement = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.click();
    });
  }

  async function remove(filePathsToRemove: string[]) {
    const remainingFiles = files.filter(
      (file) => !filePathsToRemove.includes(file.fullPath)
    );

    mutate(remainingFiles, false);

    try {
      await recursivelyDeleteFiles(path, filePathsToRemove);
    } catch {
      debugger;
    }
    mutate();
  }

  function refresh() {
    mutate();
  }

  async function uploadFiles(uploadedFiles: FileList) {
    const newFiles: StorageItem[] = Array.from(uploadedFiles).map((file) => {
      return {
        name: file.name,
        contentType: file.type,
        size: file.size,
        type: 'file',
        updated: new Date().toISOString(),
        timeCreated: new Date().toISOString(),
        bucket,
      } as StorageItem;
    });

    const newFileNames = new Set(newFiles.map((file) => file.name));
    const remainingFiles = files.filter((file) => !newFileNames.has(file.name));

    mutate([...newFiles, ...remainingFiles], false);

    await Promise.all(
      [...uploadedFiles].map((file) => {
        const url = `gs://${removeTrailingSlash(bucket)}/${
          path ? removeTrailingSlash(path) + '/' : ''
        }${file.name}`;
        return storage
          .refFromURL(url)
          .put(file)
          .then((a) => {
            return a.metadata;
          });
      })
    );

    mutate();
  }

  async function deleteAll() {
    mutate([], false);
    await deleteFolder(storage, bucket, '/');
    mutate();
  }

  return {
    files: data,
    uploadFiles,
    remove,
    path,
    refresh,
    deleteAll,
    openAllFiles,
  };
}

/**
 * Provide a local-FirebaseApp with a FirestoreSDK connected to
 * the Emulator Hub.
 */
export const StorageEmulatedApiProvider: React.FC<{
  disableDevTools?: boolean;
}> = React.memo(({ children, disableDevTools }) => {
  // Firebase
  const firebaseConfig = {
    apiKey: 'AIzaSyAMitdPyFRqQ0P6P1H7p8ZfALhjk6zGO1Q',
    authDomain: 'pirojok-a935e.firebaseapp.com',
    databaseURL: 'https://pirojok-a935e.firebaseio.com',
    projectId: 'pirojok-a935e',
    storageBucket: 'pirojok-a935e.appspot.com',
    messagingSenderId: '129383800470',
    appId: '1:129383800470:web:79dc30c4213e5cb1a26cb7',
    measurementId: 'G-1QTN8GT6HV',
  };

  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <StorageApiProvider>
        <Suspense
          fallback={<Spinner message="Loading Storage SDK" span={12} />}
        >
          {children}
        </Suspense>
      </StorageApiProvider>
    </FirebaseAppProvider>
  );
});
