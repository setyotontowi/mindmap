// 1. Impor CSS agar dibundel oleh Vite
import '../index.css';

// 2. Impor NPM packages & ekspos ke global window agar kode lama tetap kompatibel
import * as d3 from 'd3';
import { marked } from 'marked';
import { createIcons, icons } from 'lucide';

window.d3 = d3;
window.marked = marked;

// Bungkus createIcons agar panggilan lama `window.lucide.createIcons()` tetap berjalan
window.lucide = {
    createIcons: () => createIcons({ icons }),
};
