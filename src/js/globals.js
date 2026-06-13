// 1. Impor CSS agar dibundel oleh Vite
import '../index.css';

// 2. Impor NPM packages & ekspos ke global window agar kode lama tetap kompatibel
import * as d3 from 'd3';
import { marked } from 'marked';
import '@phosphor-icons/web/regular';
import '@phosphor-icons/web/fill';

window.d3 = d3;
window.marked = marked;

// Pemetaan nama ikon dari Lucide ke Phosphor
const iconMap = {
    'activity': 'activity',
    'arrow-left': 'arrow-left',
    'arrow-right': 'arrow-right',
    'arrow-up-right': 'arrow-up-right',
    'bar-chart-2': 'chart-bar',
    'bookmark': 'bookmark',
    'book-open': 'book-open',
    'brain': 'brain',
    'calendar': 'calendar',
    'check-circle-2': 'check-circle',
    'chevron-right': 'chevron-right',
    'clock': 'clock',
    'cloud-off': 'cloud-slash',
    'cookie': 'cookie',
    'dna': 'dna',
    'download': 'download-simple',
    'edit-3': 'pencil-simple',
    'external-link': 'arrow-square-out',
    'eye': 'eye',
    'file-code': 'file-code',
    'file-text': 'file-text',
    'git-branch': 'git-branch',
    'help-circle': 'question',
    'highlighter': 'highlighter',
    'history': 'clock-counter-clockwise',
    'image': 'image',
    'info': 'info',
    'languages': 'translate',
    'layers': 'layers',
    'library': 'books',
    'lightbulb': 'lightbulb',
    'log-in': 'sign-in',
    'log-out': 'sign-out',
    'maximize-2': 'corners-out',
    'minimize-2': 'corners-in',
    'message-square': 'chat-circle',
    'minus': 'minus',
    'more-vertical': 'dots-three-vertical',
    'mouse-pointer-click': 'hand-pointing',
    'network': 'git-fork',
    'panel-left-close': 'sidebar-simple',
    'panel-left-open': 'sidebar-simple',
    'plus': 'plus',
    'plus-circle': 'plus-circle',
    'refresh-cw': 'arrows-counter-clockwise',
    'search': 'magnifying-glass',
    'send': 'paper-plane-right',
    'settings': 'gear',
    'share-2': 'share-network',
    'shield': 'shield',
    'shield-alert': 'shield-warning',
    'sparkles': 'sparkles',
    'sticky-note': 'note',
    'sun': 'sun',
    'sword': 'sword',
    'terminal': 'terminal',
    'trash-2': 'trash',
    'trending-up': 'trend-up',
    'user': 'user',
    'x': 'x',
    'zap': 'lightning',
    'menu': 'list'
};

const mapLucideToPhosphor = (name) => {
    return iconMap[name] || name;
};

// Suntikkan gaya dasar CSS untuk elemen i.ph agar ukuran ikon mengikuti gaya lama (width & height)
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        i.ph {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            vertical-align: middle;
            font-size: 1.2em;
            line-height: 1;
        }
    `;
    document.head.appendChild(style);
}

// Wrapper kompabilitas agar pemanggilan window.lucide.createIcons() tetap berjalan lancar
window.lucide = {
    createIcons: () => {
        if (typeof document === 'undefined') return;
        document.querySelectorAll('[data-lucide]').forEach(el => {
            const iconName = el.getAttribute('data-lucide');
            const phName = mapLucideToPhosphor(iconName);
            
            // Hapus kelas CSS lucide/phosphor lama jika ada
            el.className = el.className.replace(/\bph-\S+/g, '').replace(/\bph\b/g, '').trim();
            
            // Tambahkan kelas baru dari Phosphor Icons
            el.classList.add('ph');
            el.classList.add(`ph-${phName}`);
            
            // Sesuaikan ukuran font-size jika terdapat atribut width/height inline
            const width = el.style.width || el.getAttribute('width');
            if (width) {
                el.style.fontSize = (width.endsWith('px') || width.endsWith('em') || width.endsWith('rem') || width.endsWith('%')) ? width : `${width}px`;
            }
            const height = el.style.height || el.getAttribute('height');
            if (height && !width) {
                el.style.fontSize = (height.endsWith('px') || height.endsWith('em') || height.endsWith('rem') || height.endsWith('%')) ? height : `${height}px`;
            }
        });
    }
};
