import './newtab.css';

interface Config {
    bgType: 'image' | 'video';
    blur: number;
    opacity: number;
    accentColor: string;
    bookmarks: any[]; // Define more specifically if needed
}

const clockEl = document.getElementById('clock') as HTMLElement;
const dateEl = document.getElementById('date') as HTMLElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const settingsToggle = document.getElementById('settings-toggle') as HTMLElement;
const closeSettings = document.getElementById('close-settings') as HTMLElement;
const settingsPanel = document.getElementById('settings-panel') as HTMLElement;
const blurSlider = document.getElementById('blur-slider') as HTMLInputElement;
const opacitySlider = document.getElementById('opacity-slider') as HTMLInputElement;
const blurVal = document.getElementById('blur-val') as HTMLElement;
const opacityVal = document.getElementById('opacity-val') as HTMLElement;
const bgVideo = document.getElementById('bg-video') as HTMLVideoElement;
const bgImage = document.getElementById('bg-image') as HTMLElement;
const mediaUpload = document.getElementById('media-upload') as HTMLInputElement;
const dropZone = document.getElementById('drop-zone') as HTMLElement;
const setImageBtn = document.getElementById('set-image') as HTMLElement;
const setVideoBtn = document.getElementById('set-video') as HTMLElement;
const colorDots = document.querySelectorAll('.color-dot') as NodeListOf<HTMLElement>;
const customColorPicker = document.getElementById('custom-color-picker') as HTMLInputElement;
const bookmarksList = document.getElementById('bookmarks-list') as HTMLElement;
const addBookmarkBtn = document.getElementById('add-bookmark-btn') as HTMLElement;
const bookmarkModal = document.getElementById('bookmark-modal') as HTMLElement;
const closeModal = document.getElementById('close-modal') as HTMLElement;
const saveBookmarkBtn = document.getElementById('save-bookmark') as HTMLElement;
const bmNameInput = document.getElementById('bm-name') as HTMLInputElement;
const bmUrlInput = document.getElementById('bm-url') as HTMLInputElement;
const aiPanel = document.getElementById('ai-panel') as HTMLElement;
const aiModeToggle = document.getElementById('ai-mode-toggle') as HTMLElement;
const closeAi = document.getElementById('close-ai') as HTMLElement;
const aiMessages = document.getElementById('ai-messages') as HTMLElement;
const aiInput = document.getElementById('ai-input') as HTMLTextAreaElement;
const sendAiBtn = document.getElementById('send-ai') as HTMLElement;
const geminiKeyInput = document.getElementById('gemini-key') as HTMLInputElement;
const saveKeyBtn = document.getElementById('save-key') as HTMLElement;
const logoUpload = document.getElementById('logo-upload') as HTMLInputElement;
const logoDropZone = document.getElementById('logo-drop-zone') as HTMLElement;
const userLogoImg = document.getElementById('user-logo') as HTMLImageElement;
const logoPlaceholder = document.getElementById('logo-placeholder') as HTMLElement;
const dynamicFavicon = document.getElementById('dynamic-favicon') as HTMLLinkElement;

const extensionStorage = globalThis.chrome?.storage?.local;

let currentConfig: Config = {
    bgType: 'image',
    blur: 10,
    opacity: 40,
    accentColor: '#00f2ff',
    bookmarks: []
};

function getStoredConfig(callback: (res: { config: Config | null }) => void) {
    if (extensionStorage) {
        extensionStorage.get(['config'], (res) => callback(res as { config: Config | null }));
        return;
    }

    const savedConfig = localStorage.getItem('ANIK-config');
    callback({ config: savedConfig ? JSON.parse(savedConfig) : null });
}

function saveStoredConfig() {
    if (extensionStorage) {
        extensionStorage.set({ config: currentConfig });
        return;
    }

    localStorage.setItem('ANIK-config', JSON.stringify(currentConfig));
}


function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    if (clockEl) clockEl.textContent = `${hours}:${minutes}`;

    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', options).toUpperCase();
}
setInterval(updateClock, 1000);
updateClock();

const lensBtn = document.getElementById('lens-btn');

if (lensBtn) {
    lensBtn.addEventListener('click', () => {
        window.open('https://lens.google.com/upload', '_blank');
    });
}


searchInput.addEventListener('keypress', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        }
    }
});


settingsToggle.addEventListener('click', () => settingsPanel.classList.add('open'));
closeSettings.addEventListener('click', () => settingsPanel.classList.remove('open'));


aiModeToggle.addEventListener('click', () => aiPanel.classList.add('open'));
closeAi.addEventListener('click', () => aiPanel.classList.remove('open'));


function saveApiKey() {
    const key = geminiKeyInput.value.trim();
    if (extensionStorage) {
        extensionStorage.set({ geminiApiKey: key }, () => {
            alert('API KEY SECURED.');
        });
    } else {
        localStorage.setItem('ANIK-gemini-key', key);
        alert('API KEY SECURED.');
    }
}

function loadApiKey(callback: (key: string | null) => void) {
    if (extensionStorage) {
        extensionStorage.get(['geminiApiKey'], (res: { [key: string]: any }) => callback(res.geminiApiKey));
    } else {
        callback(localStorage.getItem('ANIK-gemini-key'));
    }
}

saveKeyBtn.addEventListener('click', saveApiKey);


function simpleMarkdown(text: string): string {
    if (!text) return '';
    
    // Protect code blocks
    const codes: string[] = [];
    let processed = text.replace(/```([\s\S]*?)```/g, (_match, code) => {
        codes.push(code);
        return `__CODE_BLOCK_${codes.length - 1}__`;
    });

    processed = processed
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
        .replace(/__(.*?)__/g, '<strong>$1</strong>')   
        .replace(/_(.*?)_/g, '<em>$1</em>')             
        .replace(/`(.*?)`/g, '<code>$1</code>')        
        .replace(/\n\n/g, '</p><p>')                    
        .replace(/\n/g, '<br>')                         
        .replace(/^\s*[-*+]\s+(.*)/gm, '<li>$1</li>')  
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');    

    // Restore code blocks
    codes.forEach((code, i) => {
        processed = processed.replace(`__CODE_BLOCK_${i}__`, `<pre><code>${code.trim()}</code></pre>`);
    });

    return `<p>${processed}</p>`;
}

function addChatMessage(role: 'user' | 'bot', text: string) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-msg ${role}`;
    msgDiv.innerHTML = simpleMarkdown(text);
    aiMessages.appendChild(msgDiv);
    aiMessages.scrollTop = aiMessages.scrollHeight;
}

async function callGroqAPI(prompt: string): Promise<string> {
    return new Promise((resolve) => {
        loadApiKey(async (key) => {
            if (!key) {
                resolve('ERROR: GROQ API KEY MISSING. PLEASE CONFIGURE IN SETTINGS.');
                return;
            }

            try {
                const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${key}`
                    },
                    body: JSON.stringify({
                        model: "llama-3.3-70b-versatile",
                        messages: [
                            { 
                                role: 'system', 
                                content: "You are the ANIK AI CORE, a smart gaming assistant."
                            },
                            {
                                role: 'user',
                                content: prompt
                            }
                        ],
                        temperature: 0.7
                    })
                });

                const data = await response.json();
                
                if (data.error) {
                    resolve(`API ERROR: ${data.error.message.toUpperCase()}`);
                } else if (data.choices && data.choices[0].message) {
                    resolve(data.choices[0].message.content);
                } else {
                    resolve('SYSTEM ERROR: UNEXPECTED_RESPONSE_FORMAT');
                }
            } catch (e) {
                resolve('CONNECTION ERROR: GROQ CORE UNREACHABLE.');
            }
        });
    });
}

async function handleAISubmit() {
    const text = aiInput.value.trim();
    if (!text) return;

    aiInput.value = '';
    aiInput.style.height = 'auto';
    addChatMessage('user', text);

    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'ai-msg bot loading';
    loadingMsg.innerHTML = '<p>ANALYZING...</p>';
    aiMessages.appendChild(loadingMsg);
    aiMessages.scrollTop = aiMessages.scrollHeight;

    const response = await callGroqAPI(text);
    loadingMsg.remove();
    addChatMessage('bot', response);
}

sendAiBtn.addEventListener('click', handleAISubmit);
aiInput.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleAISubmit();
    }
});


aiInput.addEventListener('input', () => {
    aiInput.style.height = 'auto';
    aiInput.style.height = (aiInput.scrollHeight) + 'px';
});


document.querySelectorAll('.chrome-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const url = (link as HTMLElement).getAttribute('data-url');
        if (url) {
            if (globalThis.chrome && globalThis.chrome.tabs) {
                chrome.tabs.update({ url: url });
            } else {
                window.location.href = url;
            }
        }
    });
});


const DB_NAME = 'ANIKDB';
const STORE_NAME = 'media';

async function initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (e) => {
            const db = (e.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        request.onsuccess = (e) => resolve((e.target as IDBOpenDBRequest).result);
        request.onerror = (e) => reject((e.target as IDBOpenDBRequest).error);
    });
}

async function saveMedia(key: string, blob: Blob): Promise<void> {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(blob, key);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

async function getMedia(key: string): Promise<Blob | undefined> {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}


async function loadBookmarks() {
    if (!globalThis.chrome?.bookmarks) {
        console.warn('Bookmarks API not available');
        return;
    }

    try {
        const tree = await chrome.bookmarks.getTree();
        // Typically, the "Bookmark Bar" is the first child of the root
        const bookmarkBar = tree[0].children?.find(c => c.title.toLowerCase().includes('bar') || c.id === '1') || tree[0].children?.[0];
        
        if (bookmarkBar && bookmarkBar.children) {
            renderBookmarks(bookmarkBar.children);
        }
    } catch (e) {
        console.error('Failed to load bookmarks', e);
    }
}

function renderBookmarks(bookmarks: chrome.bookmarks.BookmarkTreeNode[]) {
    bookmarksList.innerHTML = '';
    
    // Filter to only show links, not folders
    const links = bookmarks.filter(bm => bm.url).slice(0, 15);
    
    links.forEach((bm, index) => {
        const entry = document.createElement('div');
        entry.className = 'bookmark-entry-wrapper';
        entry.setAttribute('draggable', 'true');
        entry.setAttribute('data-id', bm.id);
        entry.setAttribute('data-index', index.toString());
        
        const hostname = bm.url ? new URL(bm.url).hostname : '';
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
        
        entry.innerHTML = `
            <a href="${bm.url}" class="bookmark-entry">
                <div class="bm-info">
                    <img src="${faviconUrl}" class="bm-icon" alt="">
                    <span>${bm.title.toUpperCase() || 'UNTITLED'}</span>
                </div>
            </a>
        `;
        
        // Drag Events
        entry.addEventListener('dragstart', handleDragStart);
        entry.addEventListener('dragover', handleDragOver);
        entry.addEventListener('drop', handleDrop);
        entry.addEventListener('dragend', handleDragEnd);
        
        bookmarksList.appendChild(entry);
    });
}

let dragSrcEl: HTMLElement | null = null;

function handleDragStart(this: HTMLElement, e: DragEvent) {
    this.classList.add('dragging');
    dragSrcEl = this;
    if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    }
}

function handleDragOver(e: DragEvent) {
    if (e.preventDefault) e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(this: HTMLElement, e: DragEvent) {
    if (e.stopPropagation) e.stopPropagation();
    
    if (dragSrcEl !== this) {
        const sourceId = dragSrcEl?.getAttribute('data-id');
        const targetIndex = parseInt(this.getAttribute('data-index') || '0');
        
        if (sourceId && globalThis.chrome?.bookmarks) {
            chrome.bookmarks.move(sourceId, { index: targetIndex }, () => {
                loadBookmarks();
            });
        }
    }
    return false;
}

function handleDragEnd(this: HTMLElement) {
    this.classList.remove('dragging');
    document.querySelectorAll('.bookmark-entry-wrapper').forEach(el => el.classList.remove('over'));
}

async function addBookmark(name: string, url: string) {
    if (!name || !url) return;
    let formattedUrl = url;
    if (!url.startsWith('http')) formattedUrl = `https://${url}`;
    
    if (globalThis.chrome?.bookmarks) {
        const tree = await chrome.bookmarks.getTree();
        const bookmarkBar = tree[0].children?.find(c => c.title.toLowerCase().includes('bar') || c.id === '1') || tree[0].children?.[0];
        
        if (bookmarkBar) {
            chrome.bookmarks.create({
                parentId: bookmarkBar.id,
                title: name,
                url: formattedUrl
            }, () => {
                loadBookmarks();
                closeBookmarkModal();
            });
        }
    }
}

function openBookmarkModal() {
    bookmarkModal.classList.add('open');
    bmNameInput.focus();
}

function closeBookmarkModal() {
    bookmarkModal.classList.remove('open');
    bmNameInput.value = '';
    bmUrlInput.value = '';
}

function applyConfig() {
    document.documentElement.style.setProperty('--blur-val', `${currentConfig.blur}px`);
    document.documentElement.style.setProperty('--dim-val', (currentConfig.opacity / 100).toString());
    document.documentElement.style.setProperty('--accent-primary', currentConfig.accentColor);
    document.documentElement.style.setProperty('--accent-glow', `${currentConfig.accentColor}66`);

    blurVal.textContent = `${currentConfig.blur}px`;
    opacityVal.textContent = `${currentConfig.opacity}%`;

    if (currentConfig.bgType === 'video') {
        bgVideo.style.display = 'block';
        bgImage.style.display = 'none';
        setImageBtn.classList.remove('active');
        setVideoBtn.classList.add('active');
    } else {
        bgVideo.style.display = 'none';
        bgImage.style.display = 'block';
        setImageBtn.classList.add('active');
        setVideoBtn.classList.remove('active');
    }

    let presetMatch = false;
    colorDots.forEach(dot => {
        if (dot.dataset.color?.toLowerCase() === currentConfig.accentColor.toLowerCase()) {
            dot.classList.add('active');
            presetMatch = true;
        } else {
            dot.classList.remove('active');
        }
    });

    customColorPicker.value = currentConfig.accentColor;
    const parent = customColorPicker.parentElement;
    if (parent) {
        if (!presetMatch) {
            parent.style.borderColor = 'white';
            parent.style.boxShadow = `0 0 15px ${currentConfig.accentColor}`;
        } else {
            parent.style.borderColor = 'transparent';
            parent.style.boxShadow = 'none';
        }
    }
}

async function loadSavedMedia() {
    try {
        const blob = await getMedia('background');
        if (blob) {
            const url = URL.createObjectURL(blob);
            if (blob.type.startsWith('video')) {
                bgVideo.src = url;
            } else {
                bgImage.style.backgroundImage = `url(${url})`;
            }
        }
    } catch (e) {
        console.error('Failed to load media', e);
    }
}

if (globalThis.chrome?.bookmarks) {
    chrome.bookmarks.onCreated.addListener(loadBookmarks);
    chrome.bookmarks.onRemoved.addListener(loadBookmarks);
    chrome.bookmarks.onMoved.addListener(loadBookmarks);
    chrome.bookmarks.onChanged.addListener(loadBookmarks);
}


async function saveLogo(file: File) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    userLogoImg.src = url;
    userLogoImg.style.display = 'block';
    logoPlaceholder.style.display = 'none';
    dynamicFavicon.href = url;
    
    await saveMedia('user-logo', file);
}

async function loadLogo() {
    try {
        const blob = await getMedia('user-logo');
        if (blob) {
            const url = URL.createObjectURL(blob);
            userLogoImg.src = url;
            userLogoImg.style.display = 'block';
            logoPlaceholder.style.display = 'none';
            dynamicFavicon.href = url;
        }
    } catch (e) {
        console.error('Failed to load logo', e);
    }
}

logoDropZone.addEventListener('click', () => logoUpload.click());

logoUpload.addEventListener('change', (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        saveLogo(target.files[0]);
    }
});

logoDropZone.addEventListener('dragover', (e: DragEvent) => {
    e.preventDefault();
    logoDropZone.style.borderColor = 'white';
    logoDropZone.style.boxShadow = '0 0 15px var(--accent-glow)';
});

logoDropZone.addEventListener('dragleave', () => {
    logoDropZone.style.borderColor = 'var(--accent-primary)';
    logoDropZone.style.boxShadow = 'none';
});

logoDropZone.addEventListener('drop', (e: DragEvent) => {
    e.preventDefault();
    logoDropZone.style.borderColor = 'var(--accent-primary)';
    logoDropZone.style.boxShadow = 'none';
    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
        saveLogo(e.dataTransfer.files[0]);
    }
});

getStoredConfig((result) => {
    chrome.storage.local.get(['extensionEnabled'], (storageRes) => {
        if (storageRes.extensionEnabled === false) {
            window.location.href = 'https://www.google.com/';
            return;
        }

        if (result.config) {
            currentConfig = { ...currentConfig, ...result.config };
            blurSlider.value = currentConfig.blur.toString();
            opacitySlider.value = currentConfig.opacity.toString();
            customColorPicker.value = currentConfig.accentColor;
            applyConfig();
        }
        loadBookmarks();
        loadSavedMedia();
        loadLogo();
        loadApiKey((key) => {
            if (key) geminiKeyInput.value = key;
        });
    });
});


customColorPicker.addEventListener('input', () => {
    currentConfig.accentColor = customColorPicker.value;
    applyConfig();
});

customColorPicker.addEventListener('change', () => {
    saveStoredConfig();
});

addBookmarkBtn.addEventListener('click', openBookmarkModal);
closeModal.addEventListener('click', closeBookmarkModal);
saveBookmarkBtn.addEventListener('click', () => {
    addBookmark(bmNameInput.value.trim(), bmUrlInput.value.trim());
});

bookmarkModal.addEventListener('click', (e: MouseEvent) => {
    if (e.target === bookmarkModal) closeBookmarkModal();
});


const bookmarksWidget = document.getElementById('bookmarks-widget') as HTMLElement;

bookmarksWidget.addEventListener('dragover', (e: DragEvent) => {
    e.preventDefault();
    bookmarksWidget.classList.add('drag-active');
});

bookmarksWidget.addEventListener('dragleave', () => {
    bookmarksWidget.classList.remove('drag-active');
});

bookmarksWidget.addEventListener('drop', (e: DragEvent) => {
    e.preventDefault();
    bookmarksWidget.classList.remove('drag-active');
    
    const url = e.dataTransfer?.getData('text/plain');
    if (url && (url.startsWith('http') || url.includes('.'))) {
        openBookmarkModal();
        bmUrlInput.value = url;
        try {
            const domain = new URL(url).hostname.split('.')[0];
            bmNameInput.value = domain.charAt(0).toUpperCase() + domain.slice(1);
        } catch (err) {}
    }
});

blurSlider.addEventListener('input', () => {
    currentConfig.blur = parseInt(blurSlider.value);
    applyConfig();
});

blurSlider.addEventListener('change', () => {
    saveStoredConfig();
});

opacitySlider.addEventListener('input', () => {
    currentConfig.opacity = parseInt(opacitySlider.value);
    applyConfig();
});

opacitySlider.addEventListener('change', () => {
    saveStoredConfig();
});

setImageBtn.addEventListener('click', () => {
    currentConfig.bgType = 'image';
    applyConfig();
    saveStoredConfig();
});

setVideoBtn.addEventListener('click', () => {
    currentConfig.bgType = 'video';
    applyConfig();
    saveStoredConfig();
});

colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
        currentConfig.accentColor = dot.dataset.color || '#00f2ff';
        applyConfig();
        saveStoredConfig();
    });
});


dropZone.addEventListener('click', () => mediaUpload.click());

mediaUpload.addEventListener('change', async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    if (file.type.startsWith('video')) {
        bgVideo.src = url;
        currentConfig.bgType = 'video';
    } else {
        bgImage.style.backgroundImage = `url(${url})`;
        currentConfig.bgType = 'image';
    }

    applyConfig();
    await saveMedia('background', file);
    saveStoredConfig();
});

dropZone.addEventListener('dragover', (e: DragEvent) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--accent-primary)';
    dropZone.style.background = 'rgba(0, 242, 255, 0.05)';
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = 'var(--accent-primary)';
    dropZone.style.background = 'rgba(255, 255, 255, 0.02)';
});

dropZone.addEventListener('drop', async (e: DragEvent) => {
    e.preventDefault();
    dropZone.style.background = 'rgba(255, 255, 255, 0.02)';
    const file = e.dataTransfer?.files[0];
    if (!file) return;

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    mediaUpload.files = dataTransfer.files;
    mediaUpload.dispatchEvent(new Event('change'));
});
