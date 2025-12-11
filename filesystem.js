// Simulated File System
const FileSystem = {
    root: {
        'C:': {
            type: 'drive',
            children: {
                'Windows': {
                    type: 'folder',
                    children: {
                        'System32': { type: 'folder', children: {} },
                        'explorer.exe': { type: 'file', content: 'Explorer executable' },
                        'notepad.exe': { type: 'file', content: 'Notepad executable' }
                    }
                },
                'Program Files': {
                    type: 'folder',
                    children: {
                        'Paint': { type: 'folder', children: { 'mspaint.exe': { type: 'file', content: '' } } },
                        'Pacman': { type: 'folder', children: { 'pacman.exe': { type: 'file', content: '' } } }
                    }
                },
                'Documents and Settings': {
                    type: 'folder',
                    children: {
                        'Sreyas': {
                            type: 'folder',
                            children: {
                                'My Documents': {
                                    type: 'folder',
                                    children: {
                                        'Resume.txt': { type: 'file', content: 'Sreyas Resume...' },
                                        'Ideas.txt': { type: 'file', content: 'Project ideas...' }
                                    }
                                },
                                'My Pictures': {
                                    type: 'folder',
                                    children: {
                                        'bliss.jpg': { type: 'file', content: 'image-data' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        'D:': {
            type: 'drive',
            label: 'Portfolio',
            children: {
                'About.txt': { type: 'file', content: window.portfolioData ? window.portfolioData.about : 'About me...' },
                'Projects': {
                    type: 'folder',
                    children: {
                        'Kotatsu.txt': { type: 'file', content: 'Kotlin Project...' },
                        'Sudoku.txt': { type: 'file', content: 'Python Project...' }
                    }
                },
                'Skills.txt': { type: 'file', content: window.portfolioData ? window.portfolioData.skills : 'My Skills...' },
                'Contact.txt': { type: 'file', content: window.portfolioData ? window.portfolioData.contact : 'Contact Info...' }
            }
        }
    },

    pathSeparator: '\\',

    resolvePath: function (path) {
        if (!path) return null;
        const parts = path.split(this.pathSeparator).filter(p => p);
        let current = this.root;

        // Handle Drive Letter usually first
        // Simple traversal
        for (let part of parts) {
            if (current[part]) {
                current = current[part];
            } else if (current.children && current.children[part]) {
                current = current.children[part];
            } else {
                return null;
            }
        }
        return current;
    },

    readDir: function (path) {
        if (path === '') return this.root; // Root lists drives
        const node = this.resolvePath(path);
        if (node && (node.type === 'folder' || node.type === 'drive')) {
            return node.children;
        }
        return null;
    },

    readFile: function (path) {
        const node = this.resolvePath(path);
        if (node && node.type === 'file') {
            return node.content;
        }
        return null;
    },

    writeFile: function (path, content) {
        if (!path) return false;
        const lastSep = path.lastIndexOf(this.pathSeparator);
        if (lastSep === -1) return false; // Must be in a folder

        const folderPath = path.substring(0, lastSep);
        const fileName = path.substring(lastSep + 1);

        const folder = this.resolvePath(folderPath);
        if (folder && (folder.type === 'folder' || folder.type === 'drive')) {
            folder.children[fileName] = { type: 'file', content: content };
            return true;
        }
        return false;
    },

    copy: function (srcPath, destPath) {
        const srcNode = this.resolvePath(srcPath);
        if (!srcNode) return false;

        // Simple file copy
        if (srcNode.type === 'file') {
            return this.writeFile(destPath, srcNode.content);
        }
        // Folder copy is complex, skipping for demo or implementing check
        return false;
    }
};

window.FileSystem = FileSystem;
