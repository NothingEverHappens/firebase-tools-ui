import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { FirebaseAppProvider, useStorage } from 'reactfire';
import useSWR from 'swr';

import { getStorageConfigResult } from '../../store/config/selectors';
import { Spinner } from '../common/Spinner';
import { StorageFile } from './types';

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
    Promise.resolve(['pirojok-12121212', 'angular-presentation.appspot.com']);

  const { data: buckets } = useSWR<string[]>('storage/buckets', fetcher, {
    suspense: true,
  });

  return buckets;
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

  const { data, mutate } = useSWR<StorageFile[]>(key, fetcher, {
    suspense: true,
  });

  const files = data || [];

  async function deleteFolder(path: string): Promise<any> {
    console.log('deleteFolder', path);
    const list = await storage.refFromURL(`gs://${bucket}/${path}`).listAll();
    const deletedFiles = list.items.map((item) => deleteFile(item.fullPath));
    const deletedFolders = list.prefixes.map((item) =>
      deleteFolder(item.fullPath)
    );
    return Promise.all([...deletedFiles, ...deletedFolders]);
  }

  async function deleteFile(path: string) {
    console.log('deleteFile', path);
    return storage.refFromURL(`gs://${bucket}/${path}`).delete();
  }

  async function recursivelyDeleteFiles(root: string, paths: string[]) {
    const results = paths.map((path) => {
      const type = files.find((file) => file.fullPath === path)!.type;
      console.log(type, path);
      return type === 'file' ? deleteFile(path) : deleteFolder(path);
    });

    return Promise.all(results);
  }

  async function openAllFiles(paths: string[]) {
    const urls = await Promise.all(
      paths.map(getRef).map((ref) => ref.getDownloadURL())
    );
    debugger;
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
    const newFiles: StorageFile[] = Array.from(uploadedFiles).map((file) => {
      return {
        name: file.name,
        contentType: file.type,
        size: file.size,
        type: 'file',
        updated: new Date().toISOString(),
        timeCreated: new Date().toISOString(),
        bucket,
      } as StorageFile;
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

  function deleteAll() {
    deleteFolder('/');
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
    apiKey: 'AIzaSyBiY1Lg2RIcKtbgqzfE6Vrg28Zjal6ZWHs',
    authDomain: 'angular-presentation.firebaseapp.com',
    databaseURL: 'https://angular-presentation.firebaseio.com',
    projectId: 'angular-presentation',
    storageBucket: 'angular-presentation.appspot.com',
    messagingSenderId: '1087862173437',
    appId: '1:1087862173437:web:0bb7fe324b62580bb31894',
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
