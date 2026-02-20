import os
import shutil
import hashlib
import json
from pathlib import Path
from typing import List, Dict, Optional
from datetime import datetime
import zipfile
import tempfile
import win32file
import win32con
import pywintypes

class FileSystemTool:
    """God-level Windows File System Manipulation Tool"""
    
    def __init__(self):
        self.file_operations_log = []
    
    def get_file_info(self, path: str) -> Dict:
        """Get comprehensive file information"""
        try:
            p = Path(path)
            stat = p.stat()
            return {
                'path': str(p.absolute()),
                'name': p.name,
                'is_file': p.is_file(),
                'is_dir': p.is_dir(),
                'is_symlink': p.is_symlink(),
                'size': stat.st_size,
                'created': datetime.fromtimestamp(stat.st_ctime).isoformat(),
                'modified': datetime.fromtimestamp(stat.st_mtime).isoformat(),
                'accessed': datetime.fromtimestamp(stat.st_atime).isoformat(),
                'permissions': oct(stat.st_mode),
                'extension': p.suffix
            }
        except Exception as e:
            return {'error': str(e)}
    
    def list_directory(self, path: str, recursive: bool = False) -> List[Dict]:
        """List directory contents with optional recursion"""
        results = []
        try:
            p = Path(path)
            pattern = '**/*' if recursive else '*'
            for item in p.glob(pattern):
                try:
                    stat = item.stat()
                    results.append({
                        'path': str(item),
                        'name': item.name,
                        'is_dir': item.is_dir(),
                        'size': stat.st_size,
                        'modified': datetime.fromtimestamp(stat.st_mtime).isoformat()
                    })
                except:
                    pass
        except Exception as e:
            return [{'error': str(e)}]
        return results
    
    def create_file(self, path: str, content: str = '') -> Dict:
        """Create a new file with content"""
        try:
            p = Path(path)
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text(content)
            return {'status': 'created', 'path': str(p.absolute())}
        except Exception as e:
            return {'error': str(e)}
    
    def delete_file(self, path: str, force: bool = False) -> Dict:
        """Delete a file"""
        try:
            p = Path(path)
            if p.is_file():
                if force and p.exists():
                    os.chmod(path, 0o777)
                p.unlink()
                return {'status': 'deleted', 'path': str(p)}
            return {'error': 'Not a file'}
        except Exception as e:
            return {'error': str(e)}
    
    def delete_directory(self, path: str, recursive: bool = False) -> Dict:
        """Delete a directory"""
        try:
            p = Path(path)
            if p.is_dir():
                if recursive:
                    shutil.rmtree(path)
                else:
                    p.rmdir()
                return {'status': 'deleted', 'path': str(p)}
            return {'error': 'Not a directory'}
        except Exception as e:
            return {'error': str(e)}
    
    def copy_file(self, src: str, dst: str) -> Dict:
        """Copy a file"""
        try:
            shutil.copy2(src, dst)
            return {'status': 'copied', 'source': src, 'destination': dst}
        except Exception as e:
            return {'error': str(e)}
    
    def move_file(self, src: str, dst: str) -> Dict:
        """Move a file"""
        try:
            shutil.move(src, dst)
            return {'status': 'moved', 'source': src, 'destination': dst}
        except Exception as e:
            return {'error': str(e)}
    
    def copy_directory(self, src: str, dst: str) -> Dict:
        """Copy an entire directory"""
        try:
            shutil.copytree(src, dst)
            return {'status': 'copied', 'source': src, 'destination': dst}
        except Exception as e:
            return {'error': str(e)}
    
    def read_file(self, path: str, lines: Optional[int] = None) -> Dict:
        """Read file content"""
        try:
            p = Path(path)
            content = p.read_text()
            if lines:
                content_lines = content.split('\n')[:lines]
                content = '\n'.join(content_lines)
            return {'path': str(p), 'content': content}
        except Exception as e:
            return {'error': str(e)}
    
    def write_file(self, path: str, content: str, append: bool = False) -> Dict:
        """Write content to file"""
        try:
            p = Path(path)
            p.parent.mkdir(parents=True, exist_ok=True)
            if append:
                with open(p, 'a') as f:
                    f.write(content)
            else:
                p.write_text(content)
            return {'status': 'written', 'path': str(p)}
        except Exception as e:
            return {'error': str(e)}
    
    def calculate_hash(self, path: str, algorithm: str = 'md5') -> Dict:
        """Calculate file hash"""
        try:
            hash_obj = hashlib.new(algorithm)
            with open(path, 'rb') as f:
                for chunk in iter(lambda: f.read(4096), b''):
                    hash_obj.update(chunk)
            return {
                'path': path,
                'algorithm': algorithm,
                'hash': hash_obj.hexdigest()
            }
        except Exception as e:
            return {'error': str(e)}
    
    def search_files(self, path: str, pattern: str, recursive: bool = True) -> List[str]:
        """Search for files matching a pattern"""
        results = []
        try:
            p = Path(path)
            glob_pattern = f'**/{pattern}' if recursive else pattern
            results = [str(f) for f in p.glob(glob_pattern)]
        except Exception as e:
            return [{'error': str(e)}]
        return results
    
    def create_archive(self, src: str, dst: str, format: str = 'zip') -> Dict:
        """Create an archive (zip, tar, etc.)"""
        try:
            shutil.make_archive(dst.replace('.zip', ''), format, src)
            return {'status': 'archived', 'source': src, 'destination': f'{dst}.{format}'}
        except Exception as e:
            return {'error': str(e)}
    
    def extract_archive(self, src: str, dst: str) -> Dict:
        """Extract an archive"""
        try:
            with zipfile.ZipFile(src, 'r') as zip_ref:
                zip_ref.extractall(dst)
            return {'status': 'extracted', 'source': src, 'destination': dst}
        except Exception as e:
            return {'error': str(e)}
    
    def change_permissions(self, path: str, mode: int) -> Dict:
        """Change file permissions"""
        try:
            os.chmod(path, mode)
            return {'status': 'permissions_changed', 'path': path, 'mode': oct(mode)}
        except Exception as e:
            return {'error': str(e)}
    
    def set_file_attributes(self, path: str, hidden: bool = False, readonly: bool = False) -> Dict:
        """Set Windows file attributes"""
        try:
            attrs = win32file.GetFileAttributes(path)
            if hidden:
                attrs |= win32con.FILE_ATTRIBUTE_HIDDEN
            if readonly:
                attrs |= win32con.FILE_ATTRIBUTE_READONLY
            win32file.SetFileAttributes(path, attrs)
            return {'status': 'attributes_set', 'path': path}
        except Exception as e:
            return {'error': str(e)}

# Export the tool
file_system_tool = FileSystemTool()
