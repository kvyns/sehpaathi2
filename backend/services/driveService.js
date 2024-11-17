const { drive } = require('../config/googleDrive');
const streamifier = require('streamifier');

class DriveService {
  static async setPermissions(fileId, userEmail = null) {
    try {
      // Make it accessible to anyone with the link
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone'
        },
        fields: 'id',
      });

      // If userEmail is provided, give them writer access
      if (userEmail) {
        await drive.permissions.create({
          fileId: fileId,
          requestBody: {
            role: 'writer',
            type: 'user',
            emailAddress: userEmail
          },
          fields: 'id',
        });
      }

      // Enable downloading and viewing capabilities
      await drive.files.update({
        fileId: fileId,
        requestBody: {
          copyRequiresWriterPermission: false,
          viewersCanDownload: true,
          viewersCanCopyContent: true
        }
      });
    } catch (error) {
      console.error('Failed to set permissions:', error);
      throw new Error('Failed to set permissions: ' + error.message);
    }
  }

  static async ensureSehpaathiFolder(uid, userEmail) {
    try {
      // Check if Sehpaathi folder exists
      const folderQuery = await drive.files.list({
        q: `name='Sehpaathi_${uid}' and mimeType='application/vnd.google-apps.folder'`,
        fields: 'files(id, name, webViewLink)',
      });

      if (folderQuery.data.files.length > 0) {
        console.log("Folder already exists:", folderQuery.data.files[0].name);
        // Ensure permissions are set correctly even for existing folders
        await this.setPermissions(folderQuery.data.files[0].id, userEmail);
        return {
          id: folderQuery.data.files[0].id,
          webViewLink: folderQuery.data.files[0].webViewLink
        };
      }

      console.log("Creating new folder for user:", uid);

      // Create Sehpaathi folder
      const folderMetadata = {
        name: `Sehpaathi_${uid}`,
        mimeType: 'application/vnd.google-apps.folder',
      };

      const folder = await drive.files.create({
        resource: folderMetadata,
        fields: 'id, name, webViewLink',
      });

      // Set permissions for the new folder
      await this.setPermissions(folder.data.id, userEmail);

      console.log("Folder created and shared with:", userEmail);
      console.log("Folder created with ID:", folder.data.id);
      return {
        id: folder.data.id,
        webViewLink: folder.data.webViewLink
      };
    } catch (error) {
      console.error('Failed to ensure Sehpaathi folder:', error.message);
      throw new Error('Failed to ensure Sehpaathi folder: ' + error.message);
    }
  }

  static async uploadFile(uid, file, folderId) {
    try {
      const fileMetadata = {
        name: file.originalname,
        parents: [folderId],
      };

      const media = {
        mimeType: file.mimetype,
        body: streamifier.createReadStream(file.buffer),
      };

      const uploadedFile = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, name, webViewLink, webContentLink, createdTime',
      });

      // Set permissions for the uploaded file
      await this.setPermissions(uploadedFile.data.id);

      return {
        ...uploadedFile.data,
        downloadUrl: uploadedFile.data.webContentLink
      };
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw new Error('Failed to upload file: ' + error.message);
    }
  }

  static async listFiles(folderId) {
    try {
      const response = await drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        fields: 'files(id, name, webViewLink, webContentLink, createdTime)',
        orderBy: 'createdTime desc',
      });

      // Ensure all files have correct permissions
      await Promise.all(response.data.files.map(file => 
        this.setPermissions(file.id)
      ));

      return response.data.files.map(file => ({
        ...file,
        downloadUrl: file.webContentLink
      }));
    } catch (error) {
      throw new Error('Failed to list files: ' + error.message);
    }
  }

  static async getFile(fileId) {
    try {
      const file = await drive.files.get({
        fileId: fileId,
        fields: 'id, name, webViewLink, webContentLink, size, mimeType',
      });

      // Ensure file has correct permissions
      await this.setPermissions(file.data.id);

      return {
        ...file.data,
        downloadUrl: file.data.webContentLink
      };
    } catch (error) {
      throw new Error('Failed to get file: ' + error.message);
    }
  }
//   static async deleteFile(uid, fileId) {
//     try {
//       // First verify if the file is in user's Sehpaathi folder
//       const folderId = await this.ensureSehpaathiFolder(uid);
      
//       const file = await drive.files.get({
//         fileId: fileId,
//         fields: 'parents'
//       });
//       console.log("Sehpaathi Folder ID:", folderId);
//       console.log("File Parents:", file.data.parents);
//       console.log("File ID", fileId);
      
      
//       if (!file.data.parents || !file.data.parents.includes(folderId)) {
//         throw new Error('File not found in user\'s Sehpaathi folder');
//         // throw new Error(!file.data.parents)
//       }

//       // Delete the file
//       await drive.files.delete({
//         fileId: fileId
//       });

//       return { success: true, message: 'File deleted successfully' };
//     } catch (error) {
//       if (error.code === 404) {
//         throw new Error('File not found');
//       }
//       throw new Error('Failed to delete file: ' + error.message);
//     }
//   }

static async deleteFile(uid, fileId) {
    try {
      // Extract and log the Sehpaathi folder ID
      const { id: folderId } = await this.ensureSehpaathiFolder(uid);
      console.log("Sehpaathi Folder ID:", folderId);
      console.log("File ID to delete:", fileId);
  
      // Check if file exists in the folder
      const file = await drive.files.get({
        fileId: fileId,
        fields: 'parents'
      });
  
      if (!file.data.parents || !file.data.parents.includes(folderId)) {
        throw new Error("File not found in user's Sehpaathi folder");
      }
  
      // Attempt to delete the file
      await drive.files.delete({
        fileId: fileId,
      });
  
      return { success: true, message: 'File deleted successfully' };
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      if (error.code === 404 || error.response?.status === 404) {
        throw new Error('File not found');
      }
      throw new Error('Failed to delete file: ' + error.message);
    }
  }
  

  static async deleteMultipleFiles(uid, fileIds) {
    try {
      const folderId = await this.ensureSehpaathiFolder(uid);
      const results = await Promise.allSettled(
        fileIds.map(async (fileId) => {
          try {
            await this.deleteFile(uid, fileId);
            return { fileId, success: true };
          } catch (error) {
            return { fileId, success: false, error: error.message };
          }
        })
      );

      return results.map(result => {
        if (result.status === 'fulfilled') {
          return result.value;
        }
        return { success: false, error: result.reason };
      });
    } catch (error) {
      throw new Error('Failed to delete files: ' + error.message);
    }
  }

  static async ensureAdminFolder() {
    try {
      // Check if the folder already exists
      const folderQuery = await drive.files.list({
        q: `name='Sehpaathi-Admin' and mimeType='application/vnd.google-apps.folder'`,
        fields: 'files(id, name, webViewLink)',
      });
  
      if (folderQuery.data.files.length > 0) {
        const existingFolder = {
          id: folderQuery.data.files[0].id,
          webViewLink: folderQuery.data.files[0].webViewLink,
        };
        
        // Share the existing folder
        // await this.setPermissions(existingFolder.id, 'kd.kavyansh2003@gmail.com'); // Replace with the email
        return existingFolder;
      }
  
      // Create the folder
      const folderMetadata = {
        name: 'Sehpaathi-Admin',
        mimeType: 'application/vnd.google-apps.folder',
      };
  
      const folder = await drive.files.create({
        resource: folderMetadata,
        fields: 'id, name, webViewLink',
      });
  
      // Share the newly created folder
      await this.setPermissions(folder.data.id, 'user_email@example.com'); // Replace with the email
  
      return {
        id: folder.data.id,
        webViewLink: folder.data.webViewLink,
      };
    } catch (error) {
      console.error('Failed to ensure or share admin folder:', error);
      throw new Error('Failed to ensure or share admin folder: ' + error.message);
    }
  }

  static async ensureSubFolder(parentFolderId, folderName) {
    try {
      // Check if folder already exists in the parent folder
      const folderQuery = await drive.files.list({
        q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and '${parentFolderId}' in parents and trashed=false`,
        fields: 'files(id, name, webViewLink)',
      });
  
      // If folder exists, return its details
      if (folderQuery.data.files.length > 0) {
        const existingFolder = {
          id: folderQuery.data.files[0].id,
          webViewLink: folderQuery.data.files[0].webViewLink,
        };
  
        console.log(`Subfolder '${folderName}' already exists in parent folder`, existingFolder);
  
        // Ensure permissions are set correctly even for existing folders
        // await this.setPermissions(existingFolder.id, 'kd.kavyansh2003@gmail.com'); // Replace with the email
        return existingFolder;
      }
  
      console.log(`Creating new subfolder '${folderName}' in parent folder`);
  
      // Create new subfolder
      const folderMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentFolderId],
      };
  
      const folder = await drive.files.create({
        resource: folderMetadata,
        fields: 'id, name, webViewLink',
      });
  
      // Set permissions for the new folder
      // await this.setPermissions(folder.data.id, 'kd.kavyansh2003@gmail.com'); // Replace with the email
  
      console.log(`Subfolder created with ID: ${folder.data.id}`);
      return {
        id: folder.data.id,
        webViewLink: folder.data.webViewLink,
      };
    } catch (error) {
      console.error(`Failed to ensure subfolder '${folderName}':`, error);
      throw new Error(`Failed to ensure subfolder '${folderName}': ${error.message}`);
    }
  }
  

  static async uploadAdminFile(file, branch, semester, subject, category) {
    try {
      // Create/get main admin folder
      const adminFolder = await this.ensureAdminFolder();
      
      // Create/get branch folder
      const branchFolder = await this.ensureSubFolder(adminFolder.id, branch);
      
      // Create/get semester folder
      const semesterFolder = await this.ensureSubFolder(branchFolder.id, `Semester ${semester}`);

      // Create/get subject folder
      const subjectFolder = await this.ensureSubFolder(semesterFolder.id, subject);
      
      // Create/get category folder (Class Notes, Lecture PPTs, etc.)
      const categoryFolder = await this.ensureSubFolder(subjectFolder.id, category);

      // Upload file to the category folder
      const fileMetadata = {
        name: file.originalname,
        parents: [categoryFolder.id],
      };

      const media = {
        mimeType: file.mimetype,
        body: streamifier.createReadStream(file.buffer),
      };

      const uploadedFile = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, name, webViewLink, webContentLink, createdTime',
      });

      await this.setPermissions(uploadedFile.data.id);

      return {
        ...uploadedFile.data,
        downloadUrl: uploadedFile.data.webContentLink,
        branch,
        semester,
        subject,
        category
      };
    } catch (error) {
      console.error('Failed to upload admin file:', error);
      throw new Error('Failed to upload admin file: ' + error.message);
    }
  }

  static async listAdminFiles(branch = null, semester = null, subject = null, category = null) {
    try {
      const adminFolder = await this.ensureAdminFolder();
      let targetFolderId = adminFolder.id;
      
      if (branch) {
        const branchFolder = await this.ensureSubFolder(adminFolder.id, branch);
        targetFolderId = branchFolder.id;
        
        if (semester) {
          const semesterFolder = await this.ensureSubFolder(branchFolder.id, `Semester ${semester}`);
          targetFolderId = semesterFolder.id;

          if (subject) {
            const subjectFolder = await this.ensureSubFolder(semesterFolder.id, subject);
            targetFolderId = subjectFolder.id;
          
            if (category) {
              const categoryFolder = await this.ensureSubFolder(subjectFolder.id, category);
              targetFolderId = categoryFolder.id;
            }
          }
        }
      }

      const response = await drive.files.list({
        q: `'${targetFolderId}' in parents and trashed=false`,
        fields: 'files(id, name, webViewLink, webContentLink, createdTime, mimeType)',
        orderBy: 'createdTime desc',
      });

      return response.data.files.map(file => ({
        ...file,
        downloadUrl: file.webContentLink
      }));
    } catch (error) {
      throw new Error('Failed to list admin files: ' + error.message);
    }
  }

}

module.exports = DriveService;
