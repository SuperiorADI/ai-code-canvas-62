import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FileNode, flattenFiles } from './fileSystem';

export async function downloadProject(fileSystem: FileNode, projectName: string = 'ai-project'): Promise<void> {
  const zip = new JSZip();
  
  const files = flattenFiles(fileSystem);
  
  files.forEach(file => {
    if (file.content) {
      // Remove leading slash and add to zip
      const path = file.path.startsWith('/') ? file.path.slice(1) : file.path;
      zip.file(path, file.content);
    }
  });
  
  // Generate the zip file
  const blob = await zip.generateAsync({ type: 'blob' });
  
  // Download it
  saveAs(blob, `${projectName}.zip`);
}
