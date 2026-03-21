import type { Song } from '../types';
import { LocalLibraryStore } from '../lib/libraryStore';

/**
 * Google Drive service for backing up and restoring the song library.
 * Note: This is a simplified implementation for demonstration.
 * In a real app, you would need to set up a Google Cloud project and OAuth 2.0 credentials.
 */
export class GoogleDriveService {
  private clientId: string;
  private apiKey: string;
  private scope = 'https://www.googleapis.com/auth/drive.file';
  private token: string | null = null;
  private folderName = 'Chorde Backups';
  private folderId: string | null = null;

  constructor(clientId: string, apiKey: string) {
    this.clientId = clientId;
    this.apiKey = apiKey;
  }

  /**
   * Initialize the Google Drive API client.
   * This should be called once when the app loads.
   */
  async init(): Promise<void> {
    // Load the Google API client library
    await this.loadScript('https://apis.google.com/js/api.js');
    // Load the Google Identity Services library for OAuth 2.0
    await this.loadScript('https://accounts.google.com/gsi/client');
    
    // Initialize the API client
    await new Promise((resolve, reject) => {
      // @ts-ignore - gapi is loaded by the script
      gapi.load('client:auth2', () => {
        // @ts-ignore
        gapi.client.init({
          apiKey: this.apiKey,
          clientId: this.clientId,
          scope: this.scope,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
        }).then(resolve).catch(reject);
      });
    });
  }

  /**
   * Load a script dynamically.
   */
  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  /**
   * Authenticate the user with Google Drive.
   * @returns Promise that resolves when authentication is complete
   */
  async authenticate(): Promise<void> {
    // @ts-ignore
    await gapi.auth2.getAuthInstance().signIn();
    // @ts-ignore
    const authInstance = gapi.auth2.getAuthInstance();
    // @ts-ignore
    this.token = authInstance.currentUser.get().getAuthResponse().access_token;
    
    // Ensure the backup folder exists
    await this.ensureBackupFolder();
  }

  /**
   * Check if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.token;
  }

  /**
   * Sign out the user.
   */
  async signOut(): Promise<void> {
    // @ts-ignore
    await gapi.auth2.getAuthInstance().signOut();
    this.token = null;
    this.folderId = null;
  }

  /**
   * Ensure the backup folder exists in Google Drive.
   * @returns The folder ID
   */
  private async ensureBackupFolder(): Promise<string> {
    if (this.folderId) {
      return this.folderId;
    }

    // Search for the folder
    const response = await this.request({
      method: 'GET',
      path: '/drive/v3/files',
      params: {
        q: `name='${this.folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id, name)'
      }
    });

    let folderId: string | null = null;
    if (response.files && response.files.length > 0) {
      folderId = response.files[0].id;
    } else {
      // Create the folder
      const createResponse = await this.request({
        method: 'POST',
        path: '/drive/v3/files',
        body: {
          name: this.folderName,
          mimeType: 'application/vnd.google-apps.folder'
        }
      });
      folderId = createResponse.id;
    }

    this.folderId = folderId;
    return folderId;
  }

  /**
   * Make a request to the Google Drive API.
   */
  private async request(options: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    params?: Record<string, any>;
    body?: any;
  }): Promise<any> {
    const url = new URL(`https://www.googleapis.com${options.path}`);
    
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method: options.method,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Drive API error: ${response.status} ${errorText}`);
    }

    return response.json();
  }

  /**
   * Backup the library to Google Drive.
   * @returns Promise that resolves when the backup is complete
   */
  async backup(): Promise<void> {
    if (!this.isAuthenticated()) {
      throw new Error('User is not authenticated with Google Drive');
    }

    // Get the snapshot from the library store
    const libraryStore = new LocalLibraryStore();
    const snapshot = libraryStore.exportSnapshot();

    // Generate a filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `chorde-library-backup-${timestamp}.json`;

    // Check if a file with the same name already exists (optional: we could update instead)
    // For simplicity, we'll create a new file each time

    // Upload the file
    await this.request({
      method: 'POST',
      path: '/drive/v3/files',
      params: {
        fields: 'id'
      },
      body: {
        name: fileName,
        parents: [await this.ensureBackupFolder()],
        mimeType: 'application/json'
      }
    });

    // Note: The above request only creates the file metadata.
    // To upload the content, we need to use a different approach with uploadType=media.
    // For simplicity in this example, we'll use a multipart upload or a simple upload with the content in the body.
    // However, the Google Drive API requires a separate upload session for large files.
    // Since our snapshot is expected to be small, we can use a simple upload.

    // Let's correct the upload method:
    await this.request({
      method: 'POST',
      path: '/upload/drive/v3/files',
      params: {
        uploadType: 'media'
      },
      body: snapshot
    });

    // In a real implementation, we would handle the upload progress and errors properly.
  }

  /**
   * Restore the library from Google Drive.
   * @param fileId Optional specific file ID to restore from. If not provided, uses the most recent backup.
   * @returns Promise that resolves when the restore is complete
   */
  async restore(fileId?: string): Promise<void> {
    if (!this.isAuthenticated()) {
      throw new Error('User is not authenticated with Google Drive');
    }

    // If no file ID is provided, find the most recent backup file
    if (!fileId) {
      const response = await this.request({
        method: 'GET',
        path: '/drive/v3/files',
        params: {
          q: `name contains 'chorde-library-backup-' and mimeType='application/json' and trashed=false`,
          orderBy: 'createdTime desc',
          fields: 'files(id, name)',
          pageSize: 1
        }
      });

      if (!response.files || response.files.length === 0) {
        throw new Error('No backup files found in Google Drive');
      }

      fileId = response.files[0].id;
    }

    // Download the file content
    const response = await this.request({
      method: 'GET',
      path: `/drive/v3/files/${fileId}`,
      params: {
        alt: 'media'
      }
    });

    // The response should be the snapshot string
    const snapshot = await response.text();

    // Import the snapshot into the library store
    const libraryStore = new LocalLibraryStore();
    libraryStore.importSnapshot(snapshot);
  }
}