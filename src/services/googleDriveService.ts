import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Request Workspace Scopes
export const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => {
  provider.addScope(scope);
});
// Prompt to select account
provider.setCustomParameters({
  prompt: 'select_account',
});

// Flag to indicate if we are in the middle of a sign-in flow.
let isSigningIn = false;
// In-memory token cache (never stored in localStorage/sessionStorage)
let cachedAccessToken: string | null = null;

// Initialize auth state listener.
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Sign-in with Google OAuth popup
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Gagal mendapatkan token akses dari Google Sign-In');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logoutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

/**
 * Cari atau buat folder di Google Drive
 */
export const getOrCreateFolder = async (
  folderName: string,
  parentFolderId?: string,
  accessToken?: string
): Promise<{ id: string; name: string }> => {
  const token = accessToken || cachedAccessToken;
  if (!token) throw new Error('Akses Google Drive belum diotorisasi');

  // Cari apakah folder sudah ada
  let query = `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  if (parentFolderId) {
    query += ` and '${parentFolderId}' in parents`;
  }

  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)&spaces=drive`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (searchRes.ok) {
    const data = await searchRes.json();
    if (data.files && data.files.length > 0) {
      return { id: data.files[0].id, name: data.files[0].name };
    }
  }

  // Jika folder belum ada, buat folder baru
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentFolderId ? [parentFolderId] : undefined,
    }),
  });

  if (!createRes.ok) {
    const errorText = await createRes.text();
    throw new Error(`Gagal membuat folder di Google Drive: ${errorText}`);
  }

  const createdData = await createRes.json();
  return { id: createdData.id, name: createdData.name || folderName };
};

/**
 * Unggah berkas ke folder Google Drive spesifik menggunakan multipart upload
 */
export const uploadFileToDrive = async (
  fileData: Blob,
  fileName: string,
  mimeType: string,
  folderId: string,
  accessToken?: string
): Promise<{ id: string; name: string; webViewLink: string; webContentLink?: string }> => {
  const token = accessToken || cachedAccessToken;
  if (!token) throw new Error('Akses Google Drive belum diotorisasi');

  const metadata = {
    name: fileName,
    parents: [folderId],
    mimeType: mimeType,
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadataPart =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${mimeType}\r\n` +
    'Content-Transfer-Encoding: base64\r\n\r\n';

  // Read blob as base64
  const arrayBuffer = await fileData.arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(arrayBuffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64Data = btoa(binary);

  const multipartRequestBody = metadataPart + base64Data + closeDelimiter;

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal mengunggah berkas ke Google Drive: ${errorText}`);
  }

  const data = await response.json();
  return {
    id: data.id,
    name: data.name,
    webViewLink: data.webViewLink || `https://drive.google.com/file/d/${data.id}/view`,
    webContentLink: data.webContentLink,
  };
};

/**
 * Upload modul materi ke hierarki folder:
 * Root: "SMPN 1 Wonosari - Modul Pembelajaran"
 * Subfolder: "[Nama Mata Pelajaran]"
 */
export const uploadLessonToDriveHierarchy = async (
  fileData: Blob,
  fileName: string,
  subjectName: string,
  mimeType = 'application/pdf',
  accessToken?: string,
  customRootFolderName?: string,
  customSubFolderName?: string
): Promise<{
  fileId: string;
  fileName: string;
  folderId: string;
  folderName: string;
  webViewLink: string;
}> => {
  const token = accessToken || cachedAccessToken;
  if (!token) throw new Error('Akses Google Drive belum diotorisasi');

  const rootName = (customRootFolderName && customRootFolderName.trim()) || 'SMPN 1 Wonosari - Modul Pembelajaran';
  const subName = (customSubFolderName && customSubFolderName.trim()) || subjectName;

  // 1. Dapatkan atau buat folder utama LMS di Drive (otomatis jika belum ada)
  const rootFolder = await getOrCreateFolder(
    rootName,
    undefined,
    token
  );

  // 2. Dapatkan atau buat subfolder mata pelajaran (otomatis jika belum ada)
  const subjectFolder = await getOrCreateFolder(subName, rootFolder.id, token);

  // 3. Unggah berkas ke dalam subfolder tersebut
  const uploaded = await uploadFileToDrive(fileData, fileName, mimeType, subjectFolder.id, token);

  return {
    fileId: uploaded.id,
    fileName: uploaded.name,
    folderId: subjectFolder.id,
    folderName: `${rootFolder.name} / ${subjectFolder.name}`,
    webViewLink: uploaded.webViewLink,
  };
};
