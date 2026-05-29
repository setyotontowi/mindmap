const ANTI_AI_SLOP_INSTRUCTION = {
    en: `
CRITICAL WRITING DIRECTIVES (ANTI-AI SLOP ENGINE):
1. STRICT BAN ON AI CLICHÉS. You are strictly forbidden from using these words: 'delve', 'testament', 'tapestry', 'furthermore', 'moreover', 'in conclusion', 'crucial', 'vital', 'not only... but also', 'let\\'s embark', 'unlock', 'journey', 'dynamic', 'beacon', 'realm', 'revolutionize', 'pave the way', 'demystify', 'treasure trove', 'blueprint', 'imagine'.
2. ACTIVE VOICE & DIRECTNESS. Avoid excessive passive voice. Write with high-impact, active verbs. Do not use verbose filler phrases.
3. NO CLICHÉ INTROS OR OUTROS. Never open with 'Imagine...' or phrases like 'In the fast-paced world of...', 'Since the dawn of time...', 'In today\\'s digital age...', or similar boilerplate text. Get straight to the point in the first sentence. Do not summarize in the end with a boring 'In summary' or 'In conclusion' section.
4. HUMAN-LIKE FLOW. Write naturally, as a highly skilled domain expert, with varying sentence lengths. Be concise, punchy, and highly informative.
`,
    id: `
PETUNJUK PENULISAN KRITIS (ANTI-AI SLOP ENGINE):
1. LARANGAN KERAS KATA KLISE AI. Anda dilarang keras menggunakan kata-kata klise khas AI seperti: 'delve', 'testament', 'tapestry', 'furthermore', 'moreover', 'in conclusion' (kesimpulannya), 'crucial' (krusial), 'vital', 'not only... but also' (tidak hanya... tetapi juga), 'let\\'s embark' (mari kita memulai), 'unlock' (membuka kunci), 'journey' (perjalanan), 'dynamic' (dinamis), 'beacon', 'realm' (ranah/alam), 'revolutionize' (merevolusi), 'pave the way' (merintis jalan), 'demystify', 'treasure trove' (harta karun), 'blueprint' (cetak biru), 'imagine' (bayangkan). Gunakan padanan kata Indonesia yang lebih alami dan segar.
2. KALIMAT AKTIF & TO-THE-POINT. Batasi penggunaan kalimat pasif berlebihan. Utamakan kalimat aktif yang bertenaga dan langsung. Hindari frasa pengisi yang bertele-tele.
3. HINDARI PEMBUKAAN/PENUTUP KLISE. Dilarang membuka artikel dengan kata 'Bayangkan...' ('Imagine...') atau gaya seperti 'Di dunia yang serba cepat saat ini...', 'Sejak zaman dahulu...', 'Di era digital ini...', atau kalimat templat membosankan lainnya. Langsung masuk ke poin utama sejak kalimat pertama. Jangan menutup artikel dengan bagian kesimpulan klise seperti 'Kesimpulannya...', 'Singkatnya...', atau ringkasan yang mengulang-ulang.
4. ALIRAN GAYA MANUSIA. Menulislah secara alami layaknya seorang pakar ahli manusia yang sangat kompeten, dengan panjang kalimat yang bervariasi. Tulis secara padat, tajam, dan sarat informasi yang berharga.
`
};

const WRITING_STYLES = {
    copywriting: {
        name: { id: "Direct Copywriting (Conversion-Focused)", en: "Direct Copywriting" },
        instruction: {
            id: "Gunakan gaya penulisan Direct Copywriting yang berorientasi pada konversi dan persuasi menggunakan formula teruji (seperti AIDA atau PAS). Buat agar pembaca merasa terpikat dan terdorong untuk bertindak.",
            en: "Use a Direct Copywriting writing style focused on conversion and persuasion using proven formulas (such as AIDA or PAS). Make the reader feel engaged and compelled to take action."
        },
        substyles: {
            aida: {
                name: { id: "AIDA Model", en: "AIDA Model" },
                instruction: {
                    id: "Ikuti formula AIDA secara ketat: Attention (pembuka/kait yang sangat kuat dan menarik) → Interest (sajikan fakta menarik atau data mengejutkan) → Desire (tunjukkan manfaat utama dan solusi bagi pembaca) → Action (ajakan bertindak atau kesimpulan yang kuat).",
                    en: "Strictly follow the AIDA formula: Attention (strong hook/opening) → Interest (intriguing facts or surprising data) → Desire (highlighting benefits and solutions) → Action (compelling call-to-action or conclusion)."
                }
            },
            pas: {
                name: { id: "PAS Formula", en: "PAS Formula" },
                instruction: {
                    id: "Ikuti formula PAS secara ketat: Problem (identifikasi masalah nyata yang dihadapi pembaca) → Agitate (perdalam emosi, konsekuensi, dan rasa sakit dari masalah tersebut) → Solution (sajikan konsep/topik ini sebagai solusi penyelamat terbaik).",
                    en: "Strictly follow the PAS formula: Problem (identify a real problem the reader faces) → Agitate (deepen the emotion, consequence, and pain of the problem) → Solution (present this concept/topic as the ultimate solution)."
                }
            },
            benefit: {
                name: { id: "Benefit-Driven", en: "Benefit-Driven" },
                instruction: {
                    id: "Fokus pada Benefit-Driven: jelaskan setiap fitur atau konsep dengan murni menerjemahkannya langsung ke keuntungan konkret dan nilai praktis yang akan didapatkan oleh pembaca.",
                    en: "Focus on Benefit-Driven content: explain every feature or concept by purely translating it into concrete benefits and practical value for the reader."
                }
            }
        }
    },
    seo: {
        name: { id: "Technical & SEO Content", en: "Technical & SEO Content" },
        instruction: {
            id: "Gunakan gaya penulisan Technical & SEO Content yang padat informasi, fokus pada penyusunan heading (H2/H3) yang logis, terstruktur rapi, mudah dipindai (scannable), dan menjawab Search Intent dengan tepat.",
            en: "Use a Technical & SEO Content writing style: highly informative, focused on logical heading structures (H2/H3), clean layouts, highly scannable, and perfectly addressing Search Intent."
        },
        substyles: {
            intent: {
                name: { id: "Search Intent Alignment", en: "Search Intent Alignment" },
                instruction: {
                    id: "Lakukan penyelarasan Search Intent secara spesifik: jawab niat pencarian pembaca secara langsung dan tuntas di awal paragraf (informasional/transaksional) sebelum masuk ke detail teoritis.",
                    en: "Align closely with Search Intent: directly and thoroughly answer the search intent in the opening paragraphs (informational/transactional) before diving into deep theoretical details."
                }
            },
            semantic: {
                name: { id: "Semantic Keyword Rich", en: "Semantic Keyword Rich" },
                instruction: {
                    id: "Susun penjelasan dengan kaya akan istilah semantik dan keyword/jargon relevan yang memperkuat kedalaman topik, tanpa melakukan keyword stuffing. Buat tulisan tetap mengalir alami namun berbobot tinggi bagi mesin pencari.",
                    en: "Rich in semantic terms and highly relevant keywords/jargon that strengthen topic authority without keyword stuffing. Keep the writing natural yet highly authoritative for search engines."
                }
            },
            tutorial: {
                name: { id: "Actionable Tutorial", en: "Actionable Tutorial" },
                instruction: {
                    id: "Sajikan materi dalam bentuk tutorial langkah-demi-langkah yang praktis, konkret, dan terukur. Berikan panduan yang bisa langsung dieksekusi dengan hasil yang jelas.",
                    en: "Present the material as a highly practical, concrete, and measurable step-by-step tutorial. Provide immediately executable guidelines with clear expected outcomes."
                }
            }
        }
    },
    conversational: {
        name: { id: "Conversational Persona", en: "Conversational Persona" },
        instruction: {
            id: "Gunakan gaya penulisan Conversational Persona yang santai, hangat, dan ramah seperti mengobrol dengan mentor pribadi. Gunakan nada bicara yang bersahabat dan hindari jargon kaku yang menjemukan.",
            en: "Use a Conversational Persona writing style: casual, warm, and friendly, like having a chat with a personal mentor. Use a friendly tone and avoid dry, academic jargon."
        },
        substyles: {
            coach: {
                name: { id: "Friendly Coach", en: "Friendly Coach" },
                instruction: {
                    id: "Gaya Friendly Coach: gunakan kata ganti orang 'saya' dan 'kamu', ajukan pertanyaan retoris untuk memicu pemikiran, tunjukkan empati yang tinggi terhadap proses belajar pembaca, dan berikan dorongan positif.",
                    en: "Friendly Coach style: use 'I' and 'you' pronouns, ask thought-provoking rhetorical questions, show high empathy for the reader's learning journey, and offer constant encouragement."
                }
            },
            analogy: {
                name: { id: "Analogi Membumi", en: "Grounded Analogy" },
                instruction: {
                    id: "Gunakan Analogi Membumi: hilangkan semua istilah rumit dan gantilah dengan analogi dunia nyata sehari-hari yang sangat sederhana, intuitif, dan mudah diingat oleh siapa saja.",
                    en: "Use Grounded Analogies: replace complex jargon with highly simple, intuitive, and memorable real-world analogies from everyday life."
                }
            },
            qa: {
                name: { id: "Q&A Dialogue", en: "Q&A Dialogue" },
                instruction: {
                    id: "Format penjelasan mengalir seperti dialog tanya-jawab (Q&A) interaktif, yang secara antisipatif menjawab keraguan, sanggahan, atau pertanyaan yang biasanya muncul di kepala pembaca.",
                    en: "Format the explanation like an interactive Q&A dialogue, anticipating and directly answering the doubts, concerns, or questions likely to arise in the reader's head."
                }
            }
        }
    },
    storytelling: {
        name: { id: "Story-Driven Content (Copywriting)", en: "Story-Driven Content" },
        instruction: {
            id: "Gunakan gaya penulisan Story-Driven Content yang membungkus informasi/topik menggunakan teknik penceritaan (storytelling) yang emosional, memikat, dan mengalir dengan indah.",
            en: "Use a Story-Driven Content writing style: wrapping the information or topic in an emotional, engaging, and beautifully flowing narrative."
        },
        substyles: {
            hero: {
                name: { id: "Hero's Journey", en: "Hero's Journey" },
                instruction: {
                    id: "Gunakan pola Hero's Journey: awali dengan tantangan/masalah besar, ikuti dengan perjuangan mencari solusi, tampilkan titik balik penemuan (momen eureka), dan akhiri dengan hasil transformasi yang menginspirasi.",
                    en: "Use the Hero's Journey framework: start with a major challenge/adventure, detail the struggle to find a solution, show the eureka moment, and end with the inspiring transformation."
                }
            },
            case: {
                name: { id: "Case Story", en: "Case Story" },
                instruction: {
                    id: "Gunakan Case Story: sajikan sebuah kisah nyata atau studi kasus nyata yang singkat dan kuat untuk membuktikan poin utama serta menunjukkan pengaplikasian nyata dari konsep ini.",
                    en: "Use Case Stories: present a brief, powerful, real-life story or case study to substantiate the main point and illustrate the concrete application of the concept."
                }
            },
            hook: {
                name: { id: "Anecdotal Hook", en: "Anecdotal Hook" },
                instruction: {
                    id: "Buka artikel dengan Anekdot Pendek (Anecdotal Hook) yang sangat menarik dan relevan sebagai pintu masuk yang memikat sebelum mengurai konsep dasar secara mendalam.",
                    en: "Open the article with a highly engaging and relevant short anecdote (Anecdotal Hook) as a captivating gateway before unpacking the underlying concepts in detail."
                }
            }
        }
    },
    analytical: {
        name: { id: "Analytical Case Study", en: "Analytical Case Study" },
        instruction: {
            id: "Gunakan gaya penulisan Analytical Case Study yang mendalam, objektif, logis, terstruktur, berbasis bukti, dan didukung oleh data empiris atau analisis sistematis.",
            en: "Use an Analytical Case Study writing style: deep, objective, highly logical, well-structured, evidence-based, and backed by empirical data or systematic analysis."
        },
        substyles: {
            data: {
                name: { id: "Data-Driven Breakdown", en: "Data-Driven Breakdown" },
                instruction: {
                    id: "Gunakan Data-Driven Breakdown: sajikan metrik konkret, angka, persentase, tren statistik, atau data empiris pendukung untuk memperkuat argumen dan memberikan visualisasi analitis yang tajam.",
                    en: "Use a Data-Driven Breakdown: present concrete metrics, figures, percentages, statistical trends, or supporting empirical data to solidify arguments and provide sharp analytical insights."
                }
            },
            cause: {
                name: { id: "Root-Cause Analysis", en: "Root-Cause Analysis" },
                instruction: {
                    id: "Lakukan Root-Cause Analysis (Sebab-Akibat): bedah masalah secara runut, cari akar penyebab utamanya menggunakan metode analisis sebab-akibat (seperti 5 Whys), dan jelaskan implikasinya secara mendalam.",
                    en: "Perform a Root-Cause Analysis: dissect problems logically, trace down to the primary root cause (using cause-and-effect or the 5 Whys technique), and explain the deep implications systematically."
                }
            },
            principles: {
                name: { id: "First Principles Review", en: "First Principles Review" },
                instruction: {
                    id: "Gunakan First Principles Review: bongkar konsep rumit ini dari elemen penyusunnya yang paling mendasar dan tidak terbantahkan, lalu bangun pemahaman ke atas langkah demi langkah tanpa mengasumsikan apa pun.",
                    en: "Use a First Principles Review: deconstruct this complex concept into its most fundamental, undeniable truth/components, then rebuild the understanding step-by-step without assumptions."
                }
            }
        }
    },
    frameworks: {
        name: { id: "Actionable Frameworks (Thought Leadership)", en: "Actionable Frameworks" },
        instruction: {
            id: "Gunakan gaya penulisan Actionable Frameworks yang mengajarkan metode praktis, model mental, atau kerangka berpikir orisinal yang bisa langsung dipraktikkan oleh pembaca dalam kehidupan sehari-hari.",
            en: "Use an Actionable Frameworks writing style: teaching practical methods, mental models, or original frameworks that the reader can immediately implement in real life."
        },
        substyles: {
            mental: {
                name: { id: "Mental Model", en: "Mental Model" },
                instruction: {
                    id: "Kaitkan topik secara langsung dengan Kerangka Berpikir / Model Mental terkenal (seperti Hukum Pareto 80/20, SWOT, Kuadran Eisenhower, dll.) untuk membantu pembaca mencerna konsep secara struktural.",
                    en: "Directly link the topic with well-known Mental Models (e.g., Pareto Principle, SWOT, Eisenhower Matrix) to help the reader structurally digest and apply the concept."
                }
            },
            playbook: {
                name: { id: "SOP / Playbook", en: "SOP / Playbook" },
                instruction: {
                    id: "Sajikan panduan operasional standar (SOP / Playbook) yang sangat praktis dan terstruktur. Berikan daftar tindakan konkret, template sederhana, atau panduan kerja lapangan.",
                    en: "Present a highly practical, structured Standard Operating Procedure (SOP / Playbook). Provide checklists of concrete actions, simple templates, or field execution guides."
                }
            },
            pitfalls: {
                name: { id: "Pitfall & Best Practices", en: "Pitfalls & Best Practices" },
                instruction: {
                    id: "Tekankan pada Best Practices (praktik terbaik) dan Pitfalls (jebakan/kesalahan umum) di lapangan. Sajikan panduan do's & don'ts yang teruji dan cara menghindarinya secara taktis.",
                    en: "Emphasize field-tested Best Practices and common Pitfalls. Provide clear checklists of do's & don'ts and practical strategies to avoid failures."
                }
            }
        }
    },
    leadership: {
        name: { id: "Insightful Leadership", en: "Insightful Leadership" },
        instruction: {
            id: "Gunakan gaya penulisan Insightful Leadership yang menantang asumsi umum. Tulis dengan nada percakapan yang profesional tanpa jargon korporat. Fokus pada elemen manusia, psikologi, dan alasan 'mengapa' di balik sebuah perilaku.",
            en: "Use an Insightful Leadership writing style that challenges common assumptions. Write in a professional, conversational tone without corporate jargon. Focus on the human element, psychology, and the 'why' behind behaviors."
        },
        substyles: {
            contrarian_analogy: {
                name: { id: "Contrarian Analogy", en: "Contrarian Analogy" },
                instruction: {
                    id: "Buka dengan analogi ilmiah atau sejarah yang unik, lalu hubungkan ke tema bisnis. Tantang kebijaksanaan konvensional sejak awal, dan gunakan subjudul tebal untuk mengurai konsep ke dalam konteks organisasi yang praktis.",
                    en: "Open with a unique scientific or historical analogy, then connect it to a business theme. Challenge conventional wisdom early on, and use bold subheadings to unpack the concept into practical organizational contexts."
                }
            }
        }
    }
};

function updateSubStyleDropdown(styleSelectId, substyleSelectId, selectedSubStyle = 'auto') {
    const styleSelect = document.getElementById(styleSelectId);
    const substyleSelect = document.getElementById(substyleSelectId);
    if (!styleSelect || !substyleSelect) return;
    
    const selectedStyle = styleSelect.value;
    substyleSelect.innerHTML = '';
    
    // Add Auto/Semua Sub-Gaya option
    const autoOpt = document.createElement('option');
    autoOpt.value = 'auto';
    autoOpt.textContent = state.language === 'en' ? '🔮 All Sub-Styles' : '🔮 Semua Sub-Gaya';
    if (selectedSubStyle === 'auto') autoOpt.selected = true;
    substyleSelect.appendChild(autoOpt);
    
    if (selectedStyle !== 'auto' && WRITING_STYLES[selectedStyle]) {
        const substyles = WRITING_STYLES[selectedStyle].substyles;
        for (const [key, value] of Object.entries(substyles)) {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = state.language === 'en' ? value.name.en : value.name.id;
            if (key === selectedSubStyle) opt.selected = true;
            substyleSelect.appendChild(opt);
        }
    }
}

function saveNodeStylePreference() {
    if (!state.activeNode) return;
    const styleSelect = document.getElementById('drawer-style-select');
    const substyleSelect = document.getElementById('drawer-substyle-select');
    if (styleSelect && substyleSelect) {
        state.activeNode.writingStyle = styleSelect.value;
        state.activeNode.writingSubStyle = substyleSelect.value;
        saveState();
    }
}

function getRandomStyleAndSubstyle() {
    const styles = Object.keys(WRITING_STYLES);
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const styleData = WRITING_STYLES[randomStyle];
    const substyles = Object.keys(styleData.substyles);
    const randomSubstyle = substyles[Math.floor(Math.random() * substyles.length)];
    return { style: randomStyle, substyle: randomSubstyle };
}

function getWritingStyleInstruction(style, substyle) {
    const slopRules = state.language === 'en' ? ANTI_AI_SLOP_INSTRUCTION.en : ANTI_AI_SLOP_INSTRUCTION.id;

    let targetStyle = style;
    let targetSubstyle = substyle;

    if (!style || style === 'auto') {
        const randomChoice = getRandomStyleAndSubstyle();
        targetStyle = randomChoice.style;
        targetSubstyle = randomChoice.substyle;
        console.log(`[System Style Engine] Randomly chose style: ${targetStyle}, substyle: ${targetSubstyle}`);
    }

    const styleData = WRITING_STYLES[targetStyle];
    if (!styleData) return slopRules;

    let instr = state.language === 'en' ? styleData.instruction.en : styleData.instruction.id;

    if (targetSubstyle && targetSubstyle !== 'auto' && styleData.substyles[targetSubstyle]) {
        const substyleData = styleData.substyles[targetSubstyle];
        const substyleInstr = state.language === 'en' ? substyleData.instruction.en : substyleData.instruction.id;
        instr += " " + substyleInstr;
    }

    return instr + " " + slopRules;
}

function initUIEventListeners() {
    // 1. Form Chat
    const chatForm = document.getElementById('chat-form');
    if (chatForm) chatForm.addEventListener('submit', handleChatSubmit);

    // 1c. Writing Style Event Listeners
    const drawerStyleSelect = document.getElementById('drawer-style-select');
    const drawerSubstyleSelect = document.getElementById('drawer-substyle-select');
    if (drawerStyleSelect && drawerSubstyleSelect) {
        drawerStyleSelect.addEventListener('change', () => {
            updateSubStyleDropdown('drawer-style-select', 'drawer-substyle-select', 'auto');
            saveNodeStylePreference();
        });
        drawerSubstyleSelect.addEventListener('change', () => {
            saveNodeStylePreference();
        });
    }

    const regenStyleSelect = document.getElementById('regenerate-style-select');
    const regenSubstyleSelect = document.getElementById('regenerate-substyle-select');
    if (regenStyleSelect && regenSubstyleSelect) {
        regenStyleSelect.addEventListener('change', () => {
            updateSubStyleDropdown('regenerate-style-select', 'regenerate-substyle-select', 'auto');
        });
    }

    // 1b. Node Search
    const nodeSearchInput = document.getElementById('mindmap-node-search');
    if (nodeSearchInput) {
        nodeSearchInput.addEventListener('input', (e) => {
            if (typeof searchNode === 'function') {
                searchNode(e.target.value);
            }
        });
    }

    // 2. Settings Modal
    const btnOpenSettings = document.getElementById('btn-open-settings');
    const btnCloseSettings = document.getElementById('btn-close-settings');
    const btnCancelSettings = document.getElementById('btn-cancel-settings');
    const btnSaveSettings = document.getElementById('btn-save-settings');
    const settingsModal = document.getElementById('settings-modal');

    if (btnOpenSettings) btnOpenSettings.addEventListener('click', openSettingsModal);
    if (btnCloseSettings) btnCloseSettings.addEventListener('click', closeSettingsModal);
    if (btnCancelSettings) btnCancelSettings.addEventListener('click', closeSettingsModal);
    if (btnSaveSettings) btnSaveSettings.addEventListener('click', saveSettings);
    
    // Tutup modal jika klik di luar kartu modal
    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) closeSettingsModal();
        });
    }

    const providerSelect = document.getElementById('ai-provider-select');
    if (providerSelect) {
        providerSelect.addEventListener('change', (e) => {
            const selectedProvider = e.target.value;
            const defaultModel = selectedProvider === 'gemini' ? 'gemini-2.5-flash' : 'claude-sonnet-4-6';
            updateModelSelectOptions(selectedProvider, defaultModel);
        });
    }

    const modelSelect = document.getElementById('ai-model-select');
    if (modelSelect) {
        modelSelect.addEventListener('change', (e) => {
            const customGroup = document.getElementById('custom-model-group');
            if (customGroup) {
                customGroup.style.display = e.target.value === 'custom' ? 'flex' : 'none';
            }
        });
    }

    // 3. Zoom Controls
    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnZoomOut = document.getElementById('btn-zoom-out');
    const btnZoomFit = document.getElementById('btn-zoom-fit');
    if (btnZoomIn) btnZoomIn.addEventListener('click', zoomIn);
    if (btnZoomOut) btnZoomOut.addEventListener('click', zoomOut);
    if (btnZoomFit) btnZoomFit.addEventListener('click', zoomFit);

    // 4. Toggle Chat Sidebar
    const btnToggleChat = document.getElementById('btn-toggle-chat');
    if (btnToggleChat) btnToggleChat.addEventListener('click', toggleChatSidebar);

    // 4.5. Mobile Close Chat Sidebar
    const btnCloseChatMobile = document.getElementById('btn-close-chat-mobile');
    if (btnCloseChatMobile) btnCloseChatMobile.addEventListener('click', toggleChatSidebar);

    // Inisialisasi status collapse sidebar sesuai dengan ukuran layar
    if (window.innerWidth <= 768) {
        state.collapsedSidebar = true;
        const sidebar = document.getElementById('chat-sidebar-section');
        if (sidebar) sidebar.classList.add('collapsed');
        const toggleIcon = document.querySelector('#btn-toggle-chat i');
        if (toggleIcon) toggleIcon.setAttribute('data-lucide', 'menu');
    }

    // 5. Drawer Close
    const btnCloseDrawer = document.getElementById('btn-close-drawer');
    if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', closeDetailDrawer);

    const detailDrawerOverlay = document.getElementById('detail-drawer-overlay');
    if (detailDrawerOverlay) {
        detailDrawerOverlay.addEventListener('click', (e) => {
            if (e.target === detailDrawerOverlay) closeDetailDrawer();
        });
    }

    // 6. Status Progress Click
    const statusBtns = document.querySelectorAll('.status-btn');
    statusBtns.forEach(btn => {
        btn.addEventListener('click', handleStatusChange);
    });

    // 7. Drawer Resize
    initDrawerResize();

    // 8. Q&A Form Submit & Panel Toggle
    const qaForm = document.getElementById('drawer-qa-form');
    if (qaForm) {
        qaForm.addEventListener('submit', handleQaSubmit);
    }
    const qaInput = document.getElementById('drawer-qa-input');
    if (qaInput) {
        qaInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (e.shiftKey || e.ctrlKey) {
                    // Biarkan default textarea membuat baris baru
                } else {
                    e.preventDefault();
                    if (qaForm) {
                        qaForm.requestSubmit ? qaForm.requestSubmit() : qaForm.dispatchEvent(new Event('submit'));
                    }
                }
            }
        });
        qaInput.addEventListener('input', () => {
            qaInput.style.height = '24px';
            qaInput.style.height = (qaInput.scrollHeight - 4) + 'px';
        });
    }
    const btnToggleQa = document.getElementById('btn-toggle-drawer-qa');
    if (btnToggleQa) {
        btnToggleQa.addEventListener('click', toggleDrawerQa);
    }

    // 9. History Collapsible Toggler
    const btnToggleHistory = document.getElementById('btn-toggle-history');
    if (btnToggleHistory) {
        btnToggleHistory.addEventListener('click', () => {
            const content = document.getElementById('history-content-list');
            const isOpen = btnToggleHistory.classList.toggle('open');
            if (isOpen) {
                if (content) content.classList.remove('hidden');
                loadHistoryList(); // reload whenever opened
            } else {
                if (content) content.classList.add('hidden');
            }
        });
    }

    // 9.5. Back to History Button
    const btnBackToHistory = document.getElementById('btn-back-to-history');
    if (btnBackToHistory) {
        btnBackToHistory.addEventListener('click', () => {
            switchSidebarMode('history');
        });
    }

    // 10. New Topic Button
    const btnNewTopic = document.getElementById('btn-new-topic');
    if (btnNewTopic) {
        btnNewTopic.addEventListener('click', createNewMindmap);
    }

    // 11. Custom Node Manual CRUD Buttons
    const btnAddSubnode = document.getElementById('btn-add-subnode');
    if (btnAddSubnode) {
        btnAddSubnode.addEventListener('click', openAddNodeModal);
    }
    const btnEditNode = document.getElementById('btn-edit-node');
    if (btnEditNode) {
        btnEditNode.addEventListener('click', openEditNodeModal);
    }
    const btnRegenerateNode = document.getElementById('btn-regenerate-node');
    if (btnRegenerateNode) {
        btnRegenerateNode.addEventListener('click', openRegenerateNodeModal);
    }
    const btnDeleteNode = document.getElementById('btn-delete-node');
    if (btnDeleteNode) {
        btnDeleteNode.addEventListener('click', handleDeleteNode);
    }
    const btnPaginateNode = document.getElementById('btn-paginate-node');
    if (btnPaginateNode) {
        btnPaginateNode.addEventListener('click', () => {
            const active = state.activeNode;
            if (active && active.children && active.children.length > 0) {
                if (typeof paginateTo === 'function') {
                    paginateTo(active);
                }
            } else {
                alert('Node ini tidak memiliki sub-node untuk dijelajahi.');
            }
        });
    }

    // 12. Modal Add Node Controls
    const btnCloseAddNode = document.getElementById('btn-close-add-node');
    const btnCancelAddNode = document.getElementById('btn-cancel-add-node');
    const btnSubmitAddNode = document.getElementById('btn-submit-add-node');
    const addNodeModal = document.getElementById('add-node-modal');

    if (btnCloseAddNode) btnCloseAddNode.addEventListener('click', closeAddNodeModal);
    if (btnCancelAddNode) btnCancelAddNode.addEventListener('click', closeAddNodeModal);
    if (btnSubmitAddNode) btnSubmitAddNode.addEventListener('click', submitAddNode);
    if (addNodeModal) {
        addNodeModal.addEventListener('click', (e) => {
            if (e.target === addNodeModal) closeAddNodeModal();
        });
    }

    // 13. Modal Edit Node Controls
    const btnCloseEditNode = document.getElementById('btn-close-edit-node');
    const btnCancelEditNode = document.getElementById('btn-cancel-edit-node');
    const btnSubmitEditNode = document.getElementById('btn-submit-edit-node');
    const editNodeModal = document.getElementById('edit-node-modal');

    if (btnCloseEditNode) btnCloseEditNode.addEventListener('click', closeEditNodeModal);
    if (btnCancelEditNode) btnCancelEditNode.addEventListener('click', closeEditNodeModal);
    if (btnSubmitEditNode) btnSubmitEditNode.addEventListener('click', submitEditNode);
    if (editNodeModal) {
        editNodeModal.addEventListener('click', (e) => {
            if (e.target === editNodeModal) closeEditNodeModal();
        });
    }

    // 14. Modal Regenerate Node Controls
    const btnCloseRegenerateNode = document.getElementById('btn-close-regenerate-node');
    const btnCancelRegenerateNode = document.getElementById('btn-cancel-regenerate-node');
    const btnSubmitRegenerateNode = document.getElementById('btn-submit-regenerate-node');
    const regenerateNodeModal = document.getElementById('regenerate-node-modal');

    if (btnCloseRegenerateNode) btnCloseRegenerateNode.addEventListener('click', closeRegenerateNodeModal);
    if (btnCancelRegenerateNode) btnCancelRegenerateNode.addEventListener('click', closeRegenerateNodeModal);
    if (btnSubmitRegenerateNode) btnSubmitRegenerateNode.addEventListener('click', submitRegenerateNode);
    if (regenerateNodeModal) {
        regenerateNodeModal.addEventListener('click', (e) => {
            if (e.target === regenerateNodeModal) closeRegenerateNodeModal();
        });
    }

    // 15. Modal Export Controls
    const btnExportSession = document.getElementById('btn-export-session');
    const btnCloseExport = document.getElementById('btn-close-export');
    const btnCancelExport = document.getElementById('btn-cancel-export');
    const exportModal = document.getElementById('export-modal');
    const btnExportPngAction = document.getElementById('btn-export-png-action');
    const btnExportSvgAction = document.getElementById('btn-export-svg-action');
    const btnExportMdAction = document.getElementById('btn-export-md-action');

    if (btnExportSession) btnExportSession.addEventListener('click', openExportModal);
    const btnShareMindmap = document.getElementById('btn-share-mindmap');
    const btnMobileShare = document.getElementById('btn-mobile-share');
    if (btnShareMindmap) btnShareMindmap.addEventListener('click', shareMindmap);
    if (btnMobileShare) btnMobileShare.addEventListener('click', shareMindmap);
    
    const btnSaveToLibrary = document.getElementById('btn-save-to-library');
    if (btnSaveToLibrary) {
        btnSaveToLibrary.addEventListener('click', () => {
            if (!state.currentMindmapId) {
                alert(state.language === 'en' ? 'No active mindmap to save!' : 'Tidak ada mindmap aktif untuk disimpan!');
                return;
            }
            openSaveToLibraryModal();
        });
    }

    if (btnCloseExport) btnCloseExport.addEventListener('click', closeExportModal);
    if (btnCancelExport) btnCancelExport.addEventListener('click', closeExportModal);
    if (exportModal) {
        exportModal.addEventListener('click', (e) => {
            if (e.target === exportModal) closeExportModal();
        });
    }
    if (btnExportPngAction) {
        btnExportPngAction.addEventListener('click', () => {
            exportToPNG();
            closeExportModal();
        });
    }
    if (btnExportSvgAction) {
        btnExportSvgAction.addEventListener('click', () => {
            exportToSVG();
            closeExportModal();
        });
    }
    if (btnExportMdAction) {
        btnExportMdAction.addEventListener('click', () => {
            exportToMarkdown();
            closeExportModal();
        });
    }

    // 16. Highlight & Commentary Events
    document.addEventListener('selectionchange', handleTextSelection);
    
    document.addEventListener('mousedown', (e) => {
        const toolbar = document.getElementById('highlight-toolbar');
        if (toolbar && !toolbar.classList.contains('hidden')) {
            if (!toolbar.contains(e.target)) {
                toolbar.classList.add('hidden');
                window.getSelection().removeAllRanges();
            }
        }
    });

    const colorBtns = document.querySelectorAll('.hl-color-btn');
    colorBtns.forEach(btn => {
        btn.addEventListener('mousedown', (e) => {
            e.preventDefault(); // prevent selection clearing
            const color = btn.getAttribute('data-color');
            addHighlight(color);
        });
    });

    const btnHlNote = document.getElementById('btn-hl-note');
    if (btnHlNote) {
        btnHlNote.addEventListener('mousedown', (e) => {
            e.preventDefault();
            addHighlightWithNote();
        });
    }

    const drawerMdContent = document.getElementById('drawer-markdown-content');
    if (drawerMdContent) {
        drawerMdContent.addEventListener('click', (e) => {
            const mark = e.target.closest('mark[data-highlight="true"]');
            if (mark) {
                const hlId = mark.getAttribute('data-id');
                openCommentaryModalById(hlId);
            }
        });
    }

    const btnCloseCommentary = document.getElementById('btn-close-commentary');
    const btnCancelCommentary = document.getElementById('btn-cancel-commentary');
    const btnSaveCommentary = document.getElementById('btn-save-commentary');
    const btnDeleteCommentary = document.getElementById('btn-delete-commentary');
    const commentaryModal = document.getElementById('commentary-modal');

    if (btnCloseCommentary) btnCloseCommentary.addEventListener('click', closeCommentaryModal);
    if (btnCancelCommentary) btnCancelCommentary.addEventListener('click', closeCommentaryModal);
    if (btnSaveCommentary) btnSaveCommentary.addEventListener('click', saveCommentary);
    if (btnDeleteCommentary) btnDeleteCommentary.addEventListener('click', deleteHighlightFromModal);
    if (commentaryModal) {
        commentaryModal.addEventListener('click', (e) => {
            if (e.target === commentaryModal) closeCommentaryModal();
        });
    }
    
    // REDESIGN: Inisialisasi navigasi tab dan routing multi-screen
    if (typeof initRedesignNavigation === 'function') {
        initRedesignNavigation();
    }

    // 17. Mobile Immersive Custom Actions and Q&A
    const btnMobileToggleQa = document.getElementById('btn-mobile-toggle-qa');
    if (btnMobileToggleQa) {
        btnMobileToggleQa.addEventListener('click', toggleDrawerQa);
    }

    const btnMobileMore = document.getElementById('btn-mobile-more');
    const mobileMoreDropdown = document.getElementById('mobile-more-dropdown');
    if (btnMobileMore && mobileMoreDropdown) {
        btnMobileMore.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMoreDropdown.classList.toggle('open');
        });
        
        document.addEventListener('click', (e) => {
            if (!mobileMoreDropdown.contains(e.target) && e.target !== btnMobileMore) {
                mobileMoreDropdown.classList.remove('open');
            }
        });
    }

    const btnDesktopMore = document.getElementById('btn-desktop-more');
    const desktopMoreDropdown = document.getElementById('desktop-more-dropdown');
    if (btnDesktopMore && desktopMoreDropdown) {
        btnDesktopMore.addEventListener('click', (e) => {
            e.stopPropagation();
            desktopMoreDropdown.classList.toggle('open');
        });
        
        document.addEventListener('click', (e) => {
            if (!desktopMoreDropdown.contains(e.target) && e.target !== btnDesktopMore) {
                desktopMoreDropdown.classList.remove('open');
            }
        });

        desktopMoreDropdown.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                desktopMoreDropdown.classList.remove('open');
            });
        });
    }

    const mobileAddSubnode = document.getElementById('btn-mobile-add-subnode');
    if (mobileAddSubnode) {
        mobileAddSubnode.addEventListener('click', () => {
            const btn = document.getElementById('btn-add-subnode');
            if (btn) btn.click();
            if (mobileMoreDropdown) mobileMoreDropdown.classList.remove('open');
        });
    }

    const mobileEditNode = document.getElementById('btn-mobile-edit-node');
    if (mobileEditNode) {
        mobileEditNode.addEventListener('click', () => {
            const btn = document.getElementById('btn-edit-node');
            if (btn) btn.click();
            if (mobileMoreDropdown) mobileMoreDropdown.classList.remove('open');
        });
    }

    const mobileRegenNode = document.getElementById('btn-mobile-regenerate-node');
    if (mobileRegenNode) {
        mobileRegenNode.addEventListener('click', () => {
            const btn = document.getElementById('btn-regenerate-node');
            if (btn) btn.click();
            if (mobileMoreDropdown) mobileMoreDropdown.classList.remove('open');
        });
    }

    const mobileDeleteNode = document.getElementById('btn-mobile-delete-node');
    if (mobileDeleteNode) {
        mobileDeleteNode.addEventListener('click', () => {
            const btn = document.getElementById('btn-delete-node');
            if (btn) btn.click();
            if (mobileMoreDropdown) mobileMoreDropdown.classList.remove('open');
        });
    }

    const mobilePaginateNode = document.getElementById('btn-mobile-paginate-node');
    if (mobilePaginateNode) {
        mobilePaginateNode.addEventListener('click', () => {
            const btn = document.getElementById('btn-paginate-node');
            if (btn) btn.click();
            if (mobileMoreDropdown) mobileMoreDropdown.classList.remove('open');
        });
    }

    // Hook bookmark buttons
    const btnBookmarkNode = document.getElementById('btn-bookmark-node');
    if (btnBookmarkNode) {
        btnBookmarkNode.addEventListener('click', () => {
            const active = state.activeNode;
            if (!active) return;
            const isBookmarked = state.bookmarks.some(b => b.mindmap_id === state.currentMindmapId && b.node_name === active.name);
            toggleBookmarkState(state.currentMindmapId, active.name, isBookmarked);
            
            // Toggle active class on btnBookmarkNode
            if (isBookmarked) {
                btnBookmarkNode.classList.remove('active');
                btnBookmarkNode.title = 'Bookmark Node Ini';
                showToast(state.language === 'en' ? 'Bookmark removed' : 'Bookmark dihapus');
            } else {
                btnBookmarkNode.classList.add('active');
                btnBookmarkNode.title = 'Hapus Bookmark';
                showToast(state.language === 'en' ? 'Bookmark added' : 'Bookmark ditambahkan');
            }
            const mobileBookmarkText = document.getElementById('mobile-bookmark-text');
            if (mobileBookmarkText) {
                mobileBookmarkText.textContent = isBookmarked ? 'Bookmark Node' : 'Hapus Bookmark';
            }
        });
    }

    const btnMobileBookmarkNode = document.getElementById('btn-mobile-bookmark-node');
    if (btnMobileBookmarkNode) {
        btnMobileBookmarkNode.addEventListener('click', () => {
            const dropdown = document.getElementById('mobile-more-dropdown');
            if (dropdown) dropdown.classList.remove('open');
            if (btnBookmarkNode) btnBookmarkNode.click();
        });
    }
}


// Toggle Sidebar Chat
function toggleChatSidebar() {
    const sidebar = document.getElementById('chat-sidebar-section');
    const toggleIcon = document.querySelector('#btn-toggle-chat i');
    
    state.collapsedSidebar = !state.collapsedSidebar;
    
    if (state.collapsedSidebar) {
        if (sidebar) sidebar.classList.add('collapsed');
        if (toggleIcon) toggleIcon.setAttribute('data-lucide', 'menu');
    } else {
        if (sidebar) sidebar.classList.remove('collapsed');
        if (toggleIcon) toggleIcon.setAttribute('data-lucide', 'x');
    }
    if (window.lucide) window.lucide.createIcons();
    setTimeout(zoomFit, 350); // Sesuaikan visual mindmap setelah resize
}

// Peralihan Mode Sidebar (History vs Chat)
function switchSidebarMode(mode) {
    const sidebar = document.getElementById('chat-sidebar-section');
    if (!sidebar) return;
    if (mode === 'chat') {
        sidebar.classList.remove('mode-history');
        sidebar.classList.add('mode-chat');
        // Auto focus ke input chat ketika masuk ke mode chat
        const chatInput = document.getElementById('chat-input');
        if (chatInput) setTimeout(() => chatInput.focus(), 50);
    } else {
        sidebar.classList.remove('mode-chat');
        sidebar.classList.add('mode-history');
    }
}

const AI_MODELS_BY_PROVIDER = {
    gemini: [
        { value: 'gemini-2.5-flash', text: 'Gemini 2.5 Flash (Default)' },
        { value: 'gemini-2.5-pro', text: 'Gemini 2.5 Pro' },
        { value: 'gemini-1.5-flash', text: 'Gemini 1.5 Flash' },
        { value: 'custom', text: 'Kustom / Custom Model...' }
    ],
    claude: [
        { value: 'claude-sonnet-4-6', text: 'Claude Sonnet 4.6 (Recommended)' },
        { value: 'claude-opus-4-7', text: 'Claude Opus 4.7' },
        { value: 'claude-haiku-4-5', text: 'Claude Haiku 4.5' },
        { value: 'custom', text: 'Kustom / Custom Model...' }
    ],
    deepsek: [
        { value: 'deepseek-chat', text: 'DeepSeek Chat V3 (Default)' },
        { value: 'deepseek-reasoner', text: 'DeepSeek R1 (Reasoning)' },
        { value: 'custom', text: 'Kustom / Custom Model...' }
    ]
};

function updateModelSelectOptions(provider, selectedModelValue) {
    const modelSelect = document.getElementById('ai-model-select');
    if (!modelSelect) return;
    
    modelSelect.innerHTML = '';
    const models = AI_MODELS_BY_PROVIDER[provider] || [];
    
    // Cek apakah selectedModelValue ada dalam daftar predefined
    const isPredefined = models.some(m => m.value === selectedModelValue);
    let finalSelectedValue = selectedModelValue;
    
    const customGroup = document.getElementById('custom-model-group');
    const customInput = document.getElementById('ai-custom-model-input');
    
    if (selectedModelValue && !isPredefined && selectedModelValue !== 'custom') {
        finalSelectedValue = 'custom';
        if (customInput) {
            customInput.value = selectedModelValue;
        }
    }
    
    models.forEach(model => {
        const opt = document.createElement('option');
        opt.value = model.value;
        opt.textContent = model.text;
        if (model.value === finalSelectedValue) {
            opt.selected = true;
        }
        modelSelect.appendChild(opt);
    });
    
    if (customGroup) {
        customGroup.style.display = finalSelectedValue === 'custom' ? 'flex' : 'none';
    }
}

// Modal Control
function openSettingsModal() {
    const modal = document.getElementById('settings-modal');
    const langSelect = document.getElementById('ai-language-select');
    if (langSelect) {
        langSelect.value = state.language;
    }
    
    const providerSelect = document.getElementById('ai-provider-select');
    if (providerSelect) {
        providerSelect.value = state.aiProvider || 'gemini';
    }
    
    // Migrasi model lama dari 9Router atau model default jika kosong
    let activeModel = state.aiModel || 'gemini-2.5-flash';
    if (state.aiProvider === 'claude' && (!activeModel || activeModel.includes('kr/') || activeModel.includes('latest'))) {
        activeModel = 'claude-sonnet-4-6';
    }
    
    updateModelSelectOptions(state.aiProvider || 'gemini', activeModel);
    
    const themeSelect = document.getElementById('app-theme-select');
    if (themeSelect) {
        themeSelect.value = state.theme || 'system';
    }
    
    if (modal) modal.classList.add('open');
}

function closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (modal) modal.classList.remove('open');
}

function saveSettings() {
    const langSelect = document.getElementById('ai-language-select');
    if (langSelect) {
        state.language = langSelect.value;
        localStorage.setItem('ai_language', state.language);
    }
    
    const providerSelect = document.getElementById('ai-provider-select');
    const modelSelect = document.getElementById('ai-model-select');
    const customInput = document.getElementById('ai-custom-model-input');
    
    if (providerSelect) {
        state.aiProvider = providerSelect.value;
        localStorage.setItem('ai_provider', state.aiProvider);
    }
    
    if (modelSelect) {
        if (modelSelect.value === 'custom' && customInput && customInput.value.trim()) {
            state.aiModel = customInput.value.trim();
        } else {
            state.aiModel = modelSelect.value;
        }
        localStorage.setItem('ai_model', state.aiModel);
    }
    
    const themeSelect = document.getElementById('app-theme-select');
    if (themeSelect) {
        state.theme = themeSelect.value;
        localStorage.setItem('app_theme', state.theme);
        if (typeof applyTheme === 'function') {
            applyTheme(state.theme);
        }
    }
    
    closeSettingsModal();
    
    const message = state.language === 'en'
        ? `Settings saved successfully! Model: ${state.aiModel}`
        : `Pengaturan berhasil disimpan! Model: ${state.aiModel}`;
    appendChatMessage('bot', message);
}

// Chat UI Controls
function appendChatMessage(sender, text) {
    const container = document.getElementById('chat-messages-container');
    if (!container) return null;
    
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender === 'bot' ? 'bot-message' : 'user-message'}`;
    
    const content = document.createElement('div');
    content.className = 'message-content';
    // Format markdown dasar untuk pesan chat sederhana
    content.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    const time = document.createElement('span');
    time.className = 'message-time';
    const now = new Date();
    time.innerText = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    bubble.appendChild(content);
    bubble.appendChild(time);
    container.appendChild(bubble);
    
    // Scroll otomatis ke bawah
    container.scrollTop = container.scrollHeight;
    return bubble;
}

// Render "Thinking..." chat bubble
function showThinkingIndicator() {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;
    
    const bubble = document.createElement('div');
    bubble.className = 'thinking-bubble';
    bubble.id = 'thinking-indicator';
    
    bubble.innerHTML = `
        <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <span style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.4;">AI sedang berpikir...<br><span style="font-size: 0.72rem; opacity: 0.7; display: block;">(ini biasanya membutuhkan waktu sekitar 30 detik)</span></span>
    `;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
}

let loadingTriviaInterval = null;

function startLoadingTrivia() {
    const triviaContainer = document.getElementById('loading-trivia-container');
    const triviaText = document.getElementById('loading-trivia-text');
    if (!triviaContainer || !triviaText) return;

    // Tampilkan container trivia
    triviaContainer.style.display = 'block';

    // Set first trivia immediately
    triviaText.textContent = typeof getRandomTrivia === 'function' ? getRandomTrivia(state.language) : "Loading mind hack...";

    // Hentikan interval lama jika ada (defensif)
    if (loadingTriviaInterval) clearInterval(loadingTriviaInterval);

    // Ganti trivia setiap 10 detik
    loadingTriviaInterval = setInterval(() => {
        triviaText.style.opacity = 0;
        setTimeout(() => {
            triviaText.textContent = typeof getRandomTrivia === 'function' ? getRandomTrivia(state.language) : "Loading...";
            triviaText.style.opacity = 1;
        }, 300);
    }, 10000);
}

function stopLoadingTrivia() {
    if (loadingTriviaInterval) {
        clearInterval(loadingTriviaInterval);
        loadingTriviaInterval = null;
    }
    const triviaContainer = document.getElementById('loading-trivia-container');
    if (triviaContainer) {
        triviaContainer.style.display = 'none';
    }
}

function removeThinkingIndicator() {
    const indicator = document.getElementById('thinking-indicator');
    if (indicator) indicator.remove();
}

// Submit Topik via Chat
// Submit Topik via Chat
async function handleChatSubmit(e) {
    e.preventDefault();
    const inputEl = document.getElementById('chat-input');
    if (!inputEl) return;
    const topic = inputEl.value.trim();
    if (!topic) return;

    // Save to dynamic recent searches (Task #5)
    if (typeof saveRecentSearch === 'function') {
        saveRecentSearch(topic);
    }

    // Reset input
    inputEl.value = '';

    // Masukkan ke chat UI
    appendChatMessage('user', topic);

    // Tampilkan thinking
    showThinkingIndicator();

    // Segera arahkan ke halaman canvas dan tampilkan loading animation
    if (typeof switchScreen === 'function') {
        switchScreen('mindmaps');
    }
    const loadingOverlay = document.getElementById('mindmap-loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('hidden');
        const loadingText = document.getElementById('mindmap-loading-text');
        if (loadingText) {
            loadingText.innerHTML = state.language === 'en'
                ? `Exploring the rabbit hole of <strong>${topic}</strong>...`
                : `Menyelam ke dalam rabbit hole <strong>${topic}</strong>...`;
        }
        startLoadingTrivia();
    }
    const hintText = document.getElementById('mindmap-hint-text');
    if (hintText) hintText.classList.add('hidden');

    try {
        let selectedStyle = 'auto';
        let selectedSubStyle = 'auto';
        if (typeof getRandomStyleAndSubstyle === 'function') {
            const randomChoice = getRandomStyleAndSubstyle();
            selectedStyle = randomChoice.style;
            selectedSubStyle = randomChoice.substyle;
        }
        const styleInstruction = getWritingStyleInstruction(selectedStyle, selectedSubStyle);
        const prompt = state.language === 'en' ? `Analyze the user's input/request: "${topic}". Identify their core intent/topic and rephrase it into a concise, professional, and clear topic title (this will be the Level 0 / root node name).

        Create a structured learning roadmap for this rephrased topic. Generate valid JSON format with a single root node (whose "name" is the rephrased topic) and several main subtopics as its children dynamically. Decide the most relevant number of main subtopics yourself (e.g. 2, 3, 5, or more) based on the scope and complexity of the topic. Provide a brief but clear description (max 10 words) for each node.
 
        Additionally, create an in-depth introductory explanation/article for this rephrased topic (layer 0) in rich Markdown format (use small h3 headings, lists, analogies/examples, and blockquotes. If there are sub-lists, use 2 or 4 spaces indentation). WRITING STYLE STYLE: ${styleInstruction}. Open with an engaging introductory story or hook if relevant (do not force it). Focus on revealing counter-intuitive insights or lesser-known blindspots. Keep it concise, high-density, and limited to about 800-1000 words to prevent truncation.

        The JSON structure must be exactly like this:
        {
          "name": "Rephrased Concise Topic Name based on User's Intention",
          "description": "Brief description of this topic",
          "explanation": "Full explanation content in Markdown format here for the main topic...",
          "children": [
            { "name": "Specific Subtopic 1", "description": "Brief description of sub 1" },
            { "name": "Specific Subtopic 2", "description": "Brief description of sub 2" }
          ]
        }` : `Analisis input/permintaan pengguna: "${topic}". Identifikasi maksud/topik inti mereka dan formulasikan ulang menjadi judul topik yang singkat, profesional, dan jelas (sebagai nama node Level 0 / root).

        Buatlah peta jalan (roadmap) belajar terstruktur untuk topik yang telah diformulasikan ulang tersebut. Hasilkan dalam format JSON yang valid dengan satu node akar (root, yang "name"-nya adalah topik yang telah diformulasikan tersebut) dan beberapa sub-topik utama sebagai anaknya secara dinamis. Tentukan sendiri jumlah sub-topik utama yang paling relevan (misalnya 2, 3, 5, atau lebih) berdasarkan cakupan dan kompleksitas topik tersebut. Berikan deskripsi yang singkat namun jelas (maksimal 10 kata) untuk tiap node. 
 
        Selain itu, buat juga penjelasan/artikel pengantar yang mendalam untuk topik yang telah diformulasikan ulang tersebut (layer 0) dalam format Markdown yang kaya (gunakan judul h3 kecil, list, contoh/analogi, dan blockquote yang menarik. Jika terdapat sub-list, gunakan indentasi 2 atau 4 spasi). GAYA PENULISAN: ${styleInstruction}. Buka dengan cerita pengantar atau narasi pembuka yang menarik jika relevan (jangan dipaksakan jika tidak cocok). Fokuslah untuk membuka "blindspot" baru (aspek mendalam, pemahaman yang kontra-intuitif, atau hal penting yang jarang disadari pembelajar). Tulis penjelasan secara padat, kaya informasi, dan batasi panjang penjelasan maksimal sekitar 800-1000 kata agar tidak terpotong.

        Struktur JSON harus persis seperti ini:
        {
          "name": "Nama Topik Singkat Hasil Formulasi Ulang berdasarkan Maksud Pengguna",
          "description": "Deskripsi singkat topik ini",
          "explanation": "Isi penjelasan lengkap dalam format Markdown di sini untuk topik utama...",
          "children": [
            { "name": "Sub Topik 1", "description": "Deskripsi singkat sub 1" },
            { "name": "Sub Topik 2", "description": "Deskripsi singkat sub 2" }
          ]
        }`;

        const result = await callRouterAI(prompt);
        removeThinkingIndicator();
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
            stopLoadingTrivia();
        }

        if (result && result.name) {
            // Set ID untuk node agar D3 dapat mengontrol transisi
            result.id = 'root';
            if (result.children) {
                result.children.forEach((child, index) => {
                    child.id = `child-${index}-${Date.now()}`;
                });
            }

            // Generate unique ID untuk mindmap baru ini
            state.currentMindmapId = 'mm_' + Date.now();
            localStorage.setItem('current_mindmap_id', state.currentMindmapId);
            state.isOwner = true;

            // Simpan ke state global & reset cache/status progress belajar
            state.mindmapData = result;
            state.nodeCache = {};
            if (result.explanation) {
                state.nodeCache[result.name] = {
                    explanation: result.explanation,
                    subtopics: result.children ? result.children.map(c => ({ name: c.name, description: c.description })) : [],
                    writingStyle: selectedStyle,
                    writingSubStyle: selectedSubStyle
                };
            }
            state.nodeStatuses = {};
            await saveState();

            // Phase 6: Track mindmap creation
            if (typeof trackSessionEvent === 'function') {
                trackSessionEvent(state.currentMindmapId, 'mindmap_create', { name: result.name });
            }

            // Render Mindmap
            initD3Canvas();
            updateMindmap(state.mindmapData);
            zoomFit();

            if (typeof switchScreen === 'function') {
                switchScreen('mindmaps');
            }
            if (typeof updateTableOfContents === 'function') {
                updateTableOfContents();
            }

            // Muat ulang daftar riwayat
            await loadHistoryList();

            // Kembalikan ke mode riwayat
            switchSidebarMode('history');

            const msg = state.language === 'en'
                ? `Initial mindmap to learn **${result.name}** is ready! <br><br>Use your mouse to pan & zoom the mindmap on the right panel. **Click on any node** to start deep diving into the lesson!`
                : `Peta pikiran awal untuk belajar **${result.name}** telah siap! <br><br>Gunakan mouse untuk menggeser & men-zoom mindmap di panel kanan. **Klik pada node manapun** untuk memulai *deep dive* pelajaran!`;
            appendChatMessage('bot', msg);
        } else {
            throw new Error("Gagal mem-parsing format JSON dari AI");
        }
    } catch (error) {
        removeThinkingIndicator();
        const loadingOverlay = document.getElementById('mindmap-loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
            stopLoadingTrivia();
        }
        console.error('Initial generation error:', error);
        const msg = state.language === 'en'
            ? `Sorry, I had trouble creating a mindmap for that topic. Error: *${error.message}*. Please try again!`
            : `Maaf, aku kesulitan membuat mindmap untuk topik tersebut. Masalah: *${error.message}*. Silakan coba lagi!`;
        appendChatMessage('bot', msg);
    }
}

/* ==========================================================================
   DETAIL DRAWER & DEEP DIVE PANEL STYLING
   ========================================================================== */
function openDetailDrawer(title) {
    const drawer = document.getElementById('detail-drawer');
    const drawerTitle = document.getElementById('drawer-node-title');
    const drawerLevel = document.getElementById('drawer-node-level');
    if (!drawer || !drawerTitle || !drawerLevel) return;

    drawerTitle.innerText = title;

    // Start analytics timer for this node view
    if (typeof startDrawerTimer === 'function') {
        startDrawerTimer(title);
    }
    
    // Update mobile drawer title if exists
    const mobileDrawerTitle = document.getElementById('mobile-drawer-node-title');
    if (mobileDrawerTitle) mobileDrawerTitle.innerText = title;
    
    // Reset scroll progress and bar on open
    const colMateri = document.querySelector('.drawer-col-materi');
    if (colMateri) {
        colMateri.scrollTop = 0;
    }
    const bar = document.getElementById('mobile-reading-progress-bar');
    const percentLabel = document.getElementById('mobile-reading-percent');
    const etaLabel = document.getElementById('mobile-reading-eta');
    if (bar) bar.style.width = '0%';
    if (percentLabel) percentLabel.textContent = 'Bacaan: 0%';
    if (etaLabel) etaLabel.textContent = '4 min lagi';
    
    // Cari level kedalaman node secara absolut
    let depth = 0;
    if (state.mindmapData && typeof window.getAncestorNodePath === 'function') {
        const foundPath = window.getAncestorNodePath(state.mindmapData, title);
        if (foundPath.length > 0) {
            depth = foundPath.length - 1;
        }
    } else if (rootNodeData) {
        const found = rootNodeData.descendants().find(d => d.data.name === title);
        if (found) depth = found.depth;
    }
    drawerLevel.innerText = `Level ${depth}`;
    
    // Setup status tombol belajar aktif
    updateDrawerStatusSelector(title);

    // Setup writing style selectors
    const drawerStyleSelect = document.getElementById('drawer-style-select');
    const drawerSubstyleSelect = document.getElementById('drawer-substyle-select');
    if (drawerStyleSelect && drawerSubstyleSelect) {
        if (state.activeNode) {
            drawerStyleSelect.value = state.activeNode.writingStyle || 'auto';
            updateSubStyleDropdown('drawer-style-select', 'drawer-substyle-select', state.activeNode.writingSubStyle || 'auto');
        } else {
            drawerStyleSelect.value = 'auto';
            updateSubStyleDropdown('drawer-style-select', 'drawer-substyle-select', 'auto');
        }
    }

    // Update UI based on ownership
    updateOwnerUI();

    // Tampilkan panel tanya jawab (Q&A) secara default hanya di desktop (lebar > 768px)
    const qaCol = document.getElementById('drawer-col-qa');
    const toggleBtn = document.getElementById('btn-toggle-drawer-qa');
    const mobileToggleBtn = document.getElementById('btn-mobile-toggle-qa');
    if (qaCol) {
        if (window.innerWidth > 768) {
            qaCol.classList.remove('collapsed');
            if (toggleBtn) toggleBtn.classList.add('active');
            if (mobileToggleBtn) mobileToggleBtn.classList.add('active');
        } else {
            qaCol.classList.add('collapsed');
            if (toggleBtn) toggleBtn.classList.remove('active');
            if (mobileToggleBtn) mobileToggleBtn.classList.remove('active');
        }
    }

    // Tampilkan/sembunyikan tombol Telusuri berdasarkan ada/tidaknya children
    const btnPaginate = document.getElementById('btn-paginate-node');
    if (btnPaginate) {
        const hasChildren = state.activeNode && state.activeNode.children && state.activeNode.children.length > 0;
        btnPaginate.style.display = hasChildren ? '' : 'none';
    }

    // Render Lucide icons if available
    if (window.lucide) {
        window.lucide.createIcons();
    }

    drawer.classList.add('open');
}

let drawerLoadingTriviaInterval = null;

function startDrawerLoadingTrivia() {
    const triviaContainer = document.getElementById('drawer-loading-trivia-container');
    const triviaText = document.getElementById('drawer-loading-trivia-text');
    if (!triviaContainer || !triviaText) return;

    // Set first trivia immediately
    triviaText.textContent = typeof getRandomTrivia === 'function' ? getRandomTrivia(state.language) : "Loading mind hack...";

    // Hentikan interval lama jika ada
    if (drawerLoadingTriviaInterval) clearInterval(drawerLoadingTriviaInterval);

    // Ganti trivia setiap 10 detik
    drawerLoadingTriviaInterval = setInterval(() => {
        if (!document.getElementById('drawer-loading-trivia-text')) {
            // Jika element sudah hilang dari DOM (karena render selesai), stop interval!
            stopDrawerLoadingTrivia();
            return;
        }
        triviaText.style.opacity = 0;
        setTimeout(() => {
            const el = document.getElementById('drawer-loading-trivia-text');
            if (el) {
                el.textContent = typeof getRandomTrivia === 'function' ? getRandomTrivia(state.language) : "Loading...";
                el.style.opacity = 1;
            }
        }, 300);
    }, 10000);
}

function stopDrawerLoadingTrivia() {
    if (drawerLoadingTriviaInterval) {
        clearInterval(drawerLoadingTriviaInterval);
        drawerLoadingTriviaInterval = null;
    }
}

function closeDetailDrawer() {
    stopDrawerLoadingTrivia();

    // Stop analytics timer for this node view
    if (typeof stopDrawerTimer === 'function') {
        stopDrawerTimer();
    }

    const drawer = document.getElementById('detail-drawer');
    if (!drawer) return;
    const qaCol = document.getElementById('drawer-col-qa');
    const toggleBtn = document.getElementById('btn-toggle-drawer-qa');
    
    drawer.classList.remove('open');
    state.activeNode = null;
    updateMindmap(state.mindmapData); // Matikan active border pada link

    // Pastikan header & bottom nav terlihat saat detail drawer ditutup
    const header = document.querySelector('.global-header');
    const bottomNav = document.querySelector('.mobile-bottom-nav');
    if (header) header.classList.remove('header-hidden');
    if (bottomNav) bottomNav.classList.remove('nav-hidden');

    // Kembalikan ke layout standard (kecil) setelah transisi tutup selesai agar rapi untuk pemuatan berikutnya
    setTimeout(() => {
        drawer.style.width = ''; // Hapus inline width, kembali ke default CSS
        if (qaCol) qaCol.classList.add('collapsed');
        if (toggleBtn) toggleBtn.classList.remove('active');
    }, 300);
}

function renderDrawerLoading(title) {
    const content = document.getElementById('drawer-markdown-content');
    if (!content) return;
    const loadingText = state.language === 'en'
        ? `Exploring the rabbit hole for <strong>${title}</strong>... <br>Preparing deep theoretical summary & new subtopics.<br><span style="font-size:0.75rem; opacity:0.75; margin-top:0.25rem; display:block;">(this usually takes about 30 seconds)</span>`
        : `Menggali rabbit hole untuk <strong>${title}</strong>... <br>Mempersiapkan rangkuman teori mendalam & sub-topik baru.<br><span style="font-size:0.75rem; opacity:0.75; margin-top:0.25rem; display:block;">(ini biasanya membutuhkan waktu sekitar 30 detik)</span>`;
    content.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:2rem 0; gap:1.25rem;">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <p style="font-size:0.88rem; color:var(--text-muted); text-align:center; line-height:1.45; margin-bottom: 0.5rem;">${loadingText}</p>
            
            <!-- Side Drawer Loading Trivia Box -->
            <div class="loading-trivia-container" id="drawer-loading-trivia-container" style="max-width: 450px; width: 100%; text-align: center; padding: 1rem 1.5rem; background: var(--bg-subtle); border: 1px solid var(--border); border-radius: 12px; box-shadow: var(--shadow-sm);">
                <div style="font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--accent); margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: center; gap: 4px;">
                    <i data-lucide="lightbulb" style="width: 12px; height: 12px;"></i> Brain Hack / Trivia
                </div>
                <p id="drawer-loading-trivia-text" style="font-size: 0.78rem; color: var(--text-2); line-height: 1.45; margin: 0; font-style: italic; transition: opacity 0.3s ease; opacity: 1;">
                    Loading mind hack...
                </p>
            </div>
        </div>
    `;
    const qaList = document.getElementById('qa-messages-list');
    const qaLoadingText = state.language === 'en' ? 'Loading material...' : 'Sedang memuat materi...';
    if (qaList) qaList.innerHTML = `<div style="font-size:0.78rem; color:var(--text-3); text-align:center; padding:1.25rem 0;">${qaLoadingText}</div>`;

    if (window.lucide) {
        window.lucide.createIcons();
    }

    startDrawerLoadingTrivia();
}

function renderDrawerError(title, errorMsg) {
    stopDrawerLoadingTrivia();
    const content = document.getElementById('drawer-markdown-content');
    if (!content) return;
    const errorTitle = state.language === 'en' ? 'An Error Occurred!' : 'Terjadi Kesalahan!';
    const errorText = state.language === 'en' 
        ? `Failed to load details for "${title}".`
        : `Gagal memuat detail materi untuk "${title}".`;
    content.innerHTML = `
        <div style="padding:1.5rem; background:rgba(244,63,94,0.1); border:1px solid rgba(244,63,94,0.2); border-radius:10px; color:#f87171;">
            <h4 style="margin-bottom:0.5rem;">${errorTitle}</h4>
            <p style="font-size:0.85rem;">${errorText}</p>
            <p style="font-size:0.8rem; font-family:monospace; margin-top:0.5rem; opacity:0.8;">${errorMsg}</p>
        </div>
    `;
}

function renderNodeDetail(title, markdownText) {
    stopDrawerLoadingTrivia();
    
    // Update Bookmark Button Visual Status
    if (state.bookmarks) {
        const isBookmarked = state.bookmarks.some(b => b.mindmap_id === state.currentMindmapId && b.node_name === title);
        const btnBookmark = document.getElementById('btn-bookmark-node');
        if (btnBookmark) {
            if (isBookmarked) {
                btnBookmark.classList.add('active');
                btnBookmark.title = 'Hapus Bookmark';
            } else {
                btnBookmark.classList.remove('active');
                btnBookmark.title = 'Bookmark Node Ini';
            }
        }
        const mobileBookmarkText = document.getElementById('mobile-bookmark-text');
        if (mobileBookmarkText) {
            mobileBookmarkText.textContent = isBookmarked ? 'Hapus Bookmark' : 'Bookmark Node';
        }
    }

    const content = document.getElementById('drawer-markdown-content');
    if (!content) return;
    // Gunakan marked.js untuk merender Markdown ke HTML
    content.innerHTML = marked.parse(markdownText);
    
    // Terapkan sorotan (highlight) dan catatan tempel
    applyHighlights(title);

    // Tampilkan log system style engine jika ada di cache
    const cache = state.nodeCache[title];
    if (cache && cache.writingStyle && WRITING_STYLES[cache.writingStyle]) {
        const styleData = WRITING_STYLES[cache.writingStyle];
        const styleName = state.language === 'en' ? styleData.name.en : styleData.name.id;
        let substyleName = '';
        if (cache.writingSubStyle && cache.writingSubStyle !== 'auto' && styleData.substyles[cache.writingSubStyle]) {
            const substyleData = styleData.substyles[cache.writingSubStyle];
            substyleName = ' - ' + (state.language === 'en' ? substyleData.name.en : substyleData.name.id);
        }
        
        const logHtml = `
            <div class="style-engine-log" style="margin-top: 2.5rem; padding: 0.75rem 1rem; background: var(--bg-subtle); border: 1px solid var(--border); border-radius: 8px; font-size: 0.72rem; color: var(--text-2); display: flex; align-items: center; justify-content: space-between;">
                <span style="display: flex; align-items: center; gap: 6px;">
                    <i data-lucide="terminal" style="width: 14px; height: 14px; color: var(--accent);"></i>
                    <strong>[Style Log]</strong> 
                    <span>Gaya Penulisan: <code>${styleName}${substyleName}</code></span>
                </span>
            </div>
        `;
        content.innerHTML += logHtml;

        // Re-create icons for the newly added lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
    
    // Render Q&A khusus jika kolom Q&A sedang terbuka
    const qaCol = document.getElementById('drawer-col-qa');
    if (qaCol && !qaCol.classList.contains('collapsed')) {
        renderNodeQa(title);
    }
}

function renderNodeQa(nodeName) {
    const qaList = document.getElementById('qa-messages-list');
    const qaInput = document.getElementById('drawer-qa-input');
    const qaForm = document.getElementById('drawer-qa-form');
    if (!qaList || !qaInput) return;

    qaList.innerHTML = '';
    qaInput.value = '';
    qaInput.style.height = '24px';

    if (qaForm) {
        if (!state.isOwner) {
            qaForm.style.display = 'none';
        } else {
            qaForm.style.display = 'flex';
        }
    }

    const nodeData = state.nodeCache[nodeName];
    if (!nodeData) return;

    if (!nodeData.qaHistory) {
        nodeData.qaHistory = [];
    }

    if (nodeData.qaHistory.length === 0) {
        const noDiskText = !state.isOwner
            ? (state.language === 'en' ? 'Q&A is only available for the owner of the mindmap.' : 'Tanya jawab hanya tersedia untuk pemilik mindmap.')
            : (state.language === 'en'
                ? 'No discussion yet for this topic. Ask your first question below!'
                : 'Belum ada diskusi untuk topik ini. Ajukan pertanyaan pertamamu di bawah!');
        qaList.innerHTML = `
            <div style="font-size:0.78rem; color:var(--text-3); text-align:center; padding:1.25rem 0; line-height: 1.45;">
                ${noDiskText}
            </div>
        `;
    } else {
        nodeData.qaHistory.forEach(msg => {
            const bubble = document.createElement('div');
            bubble.className = `qa-bubble ${msg.role === 'user' ? 'user' : 'bot'}`;
            if (msg.role === 'bot') {
                bubble.innerHTML = marked.parse(msg.content);
            } else {
                bubble.textContent = msg.content;
            }
            qaList.appendChild(bubble);
        });
        
        // Auto scroll ke bawah
        setTimeout(() => {
            qaList.scrollTop = qaList.scrollHeight;
        }, 30);
    }
}

// Update UI tombol status progress di drawer
function updateDrawerStatusSelector(nodeName) {
    const status = state.nodeStatuses[nodeName] || 'todo';
    const statusBtns = document.querySelectorAll('.status-btn');
    
    statusBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-status') === status) {
            btn.classList.add('active');
        }
        if (!state.isOwner) {
            btn.style.pointerEvents = 'none';
            btn.style.opacity = btn.classList.contains('active') ? '1' : '0.5';
        } else {
            btn.style.pointerEvents = '';
            btn.style.opacity = '';
        }
    });
}

// Handler perubahan status progress belajar (todo, doing, done)
function handleStatusChange(e) {
    if (!state.isOwner) return;
    if (!state.activeNode) return;
    
    const nodeName = state.activeNode.name;
    const newStatus = e.currentTarget.getAttribute('data-status');
    
    // Update state & persist
    state.nodeStatuses[nodeName] = newStatus;
    saveState();
    
    // Update tombol drawer
    updateDrawerStatusSelector(nodeName);
    
    // Update rendering warna node di mindmap
    updateMindmap(state.mindmapData);

    // Beri apresiasi di chat jika ditandai SELESAI
    if (newStatus === 'done') {
        const msg = state.language === 'en'
            ? `Excellent! You completed the topic **${nodeName}**. Keep up the great work!`
            : `Luar biasa! Kamu telah menyelesaikan pelajaran **${nodeName}**. Terus pertahankan semangat belajarmu!`;
        appendChatMessage('bot', msg);
    } else if (newStatus === 'doing') {
        const msg = state.language === 'en'
            ? `Great! You are now studying **${nodeName}**. Take notes of the important points!`
            : `Semangat! Sekarang kamu sedang mempelajari **${nodeName}**. Catat poin-poin pentingnya ya!`;
        appendChatMessage('bot', msg);
    }
}

/* ==========================================================================
   DRAWER RESIZE
   ========================================================================== */
function initDrawerResize() {
    const handle = document.getElementById('drawer-resize-handle');
    const drawer = document.getElementById('detail-drawer');
    if (!handle || !drawer) return;

    let startX, startWidth;

    handle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        startX = e.clientX;
        startWidth = drawer.offsetWidth;
        drawer.classList.add('resizing');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';

        const onMove = (e) => {
            const delta = startX - e.clientX; // dragging left = wider
            const newWidth = Math.min(
                Math.max(startWidth + delta, 280),
                window.innerWidth * 0.7
            );
            drawer.style.width = `${newWidth}px`;
        };

        const onUp = () => {
            drawer.classList.remove('resizing');
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    });
}

/* ==========================================================================
   DRAWER Q&A SUBMIT HANDLER
   ========================================================================== */
async function handleQaSubmit(e) {
    e.preventDefault();
    const qaInput = document.getElementById('drawer-qa-input');
    const qaList = document.getElementById('qa-messages-list');
    if (!qaInput || !qaList || !state.activeNode) return;

    const question = qaInput.value.trim();
    if (!question) return;

    const nodeName = state.activeNode.name;
    const nodeData = state.nodeCache[nodeName];
    if (!nodeData) return;

    // Bersihkan placeholder jika ada
    if (nodeData.qaHistory.length === 0) {
        qaList.innerHTML = '';
    }

    // 1. Render Pertanyaan User
    const userBubble = document.createElement('div');
    userBubble.className = 'qa-bubble user';
    userBubble.textContent = question;
    qaList.appendChild(userBubble);
    
    // Auto scroll
    qaList.scrollTop = qaList.scrollHeight;

    // Bersihkan input
    qaInput.value = '';
    qaInput.style.height = '24px';

    // Simpan ke cache & localstorage
    nodeData.qaHistory.push({ role: 'user', content: question });
    saveState();

    // 2. Render Loading Indicator Tutor AI
    const loadingBubble = document.createElement('div');
    loadingBubble.className = 'qa-bubble bot';
    loadingBubble.innerHTML = `
        <div class="typing-dots" style="padding: 4px 0;">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    qaList.appendChild(loadingBubble);
    qaList.scrollTop = qaList.scrollHeight;

    try {
        const rootTopicName = state.mindmapData.name;
        const systemInstruction = state.language === 'en' ? `You are an AI teaching assistant (AI tutor) for the subtopic "${nodeName}" under the main topic "${rootTopicName}".
Your task is to answer the learner's questions directly, concisely, and to-the-point as necessary (like a normal chat conversation).
It is STRICTLY FORBIDDEN to write answers in the form of long articles with large headings (like #, ##, or ###).
Provide a brief, concise, friendly explanation focusing directly on the question. Use only 1-2 short paragraphs or simple bullet-points if needed.
You must always return the answer in a structured JSON format:
{
  "answer": "your short chat answer content using simple Markdown format (e.g. bold, inline code, or bullet-points without large headings)"
}` : `Kamu adalah asisten pengajar (tutor AI) untuk sub-topik "${nodeName}" di bawah topik utama "${rootTopicName}".
Tugas Anda adalah menjawab pertanyaan pembelajar secara langsung, ringkas, dan to-the-point seperlunya saja (seperti percakapan chat biasa).
DILARANG keras menulis jawaban dalam bentuk format artikel panjang dengan judul besar (seperti #, ##, atau ###).
Berikan penjelasan yang singkat, padat, ramah, dan berfokus langsung pada pertanyaan. Cukup gunakan 1-2 paragraf pendek atau bullet-points sederhana bila diperlukan.
Anda wajib selalu mengembalikan jawaban dalam format JSON terstruktur dengan format:
{
  "answer": "isi jawaban chat singkat Anda menggunakan format Markdown sederhana (misalnya bold, inline code, atau bullet-point tanpa heading besar)"
}`;

        let historyString = '';
        if (nodeData.qaHistory && nodeData.qaHistory.length > 1) {
            const previousHistory = nodeData.qaHistory.slice(0, -1);
            historyString = previousHistory.map(h => {
                const label = h.role === 'user' ? (state.language === 'en' ? 'Learner' : 'Pembelajar') : 'Tutor';
                return `[${label}]: ${h.content}`;
            }).join('\n');
        }

        const prompt = state.language === 'en' ? `Current material explanation context:
"${nodeData.explanation}"

${historyString ? `Previous Q&A history:\n${historyString}\n` : ''}
Learner's question:
"${question}"

Answer the question directly and concisely (to-the-point) in a friendly and casual English, maintaining context from the previous Q&A history if relevant. Do not use large headers (#, ##, ###). Keep your answer brief as if replying to a chat message. Return in JSON format: { "answer": "..." }.` : `Konteks penjelasan materi saat ini:
"${nodeData.explanation}"

${historyString ? `Riwayat tanya jawab sebelumnya:\n${historyString}\n` : ''}
Pertanyaan pembelajar:
"${question}"

Jawablah pertanyaan tersebut secara langsung seperlunya saja (to-the-point) dengan bahasa Indonesia yang santai dan ramah, serta menjaga konteks dari riwayat tanya jawab sebelumnya jika relevan. Jangan gunakan judul/header besar (#, ##, ###). Jadikan jawaban Anda singkat layaknya membalas pesan chat. Kembalikan dalam format JSON: { "answer": "..." }.`;

        // Panggil AI API
        const result = await callRouterAI(prompt, systemInstruction);
        const answerMarkdown = result.answer || 'Maaf, aku tidak dapat merumuskan jawaban saat ini.';

        // Hapus loading indicator
        loadingBubble.remove();

        // 3. Render Jawaban AI
        const botBubble = document.createElement('div');
        botBubble.className = 'qa-bubble bot';
        botBubble.innerHTML = marked.parse(answerMarkdown);
        qaList.appendChild(botBubble);
        
        // Auto scroll
        qaList.scrollTop = qaList.scrollHeight;

        // Simpan ke history cache & localStorage
        nodeData.qaHistory.push({ role: 'bot', content: answerMarkdown });
        saveState();

        // Re-inisialisasi ikon lucide baru
        if (window.lucide) window.lucide.createIcons();
    } catch (error) {
        console.error('Gagal memproses tanya jawab:', error);
        loadingBubble.remove();

        const errorBubble = document.createElement('div');
        errorBubble.className = 'qa-bubble bot';
        errorBubble.style.color = '#ef4444';
        errorBubble.style.border = '1px solid #fecaca';
        errorBubble.style.background = '#fef2f2';
        errorBubble.textContent = `Error: ${error.message || 'Gagal menghubungi tutor AI. Silakan coba lagi.'}`;
        qaList.appendChild(errorBubble);
        qaList.scrollTop = qaList.scrollHeight;
    }
}

/* ==========================================================================
   DRAWER SIDE-BY-SIDE Q&A COLLAPSIBLE TOGGLER
   ========================================================================== */
function toggleDrawerQa() {
    const qaCol = document.getElementById('drawer-col-qa');
    const toggleBtn = document.getElementById('btn-toggle-drawer-qa');
    const mobileToggleBtn = document.getElementById('btn-mobile-toggle-qa');
    if (!qaCol || !state.activeNode) return;

    const isCollapsed = qaCol.classList.contains('collapsed');

    if (isCollapsed) {
        // Buka panel Q&A ke samping sebagai card terpisah / slide-in
        qaCol.classList.remove('collapsed');
        if (toggleBtn) toggleBtn.classList.add('active');
        if (mobileToggleBtn) mobileToggleBtn.classList.add('active');
        
        // Render Q&A khusus node aktif
        renderNodeQa(state.activeNode.name);
    } else {
        // Tutup panel Q&A
        qaCol.classList.add('collapsed');
        if (toggleBtn) toggleBtn.classList.remove('active');
        if (mobileToggleBtn) mobileToggleBtn.classList.remove('active');
    }
}

async function loadHistoryList() {
    try {
        const res = await fetch('/api/mindmaps');
        if (!res.ok) throw new Error('Gagal mengambil riwayat');
        const mindmaps = await res.json();
        
        // Render to legacy sidebar container if it exists
        const container = document.getElementById('history-list-container');
        if (container) {
            container.innerHTML = '';
            if (mindmaps.length === 0) {
                container.innerHTML = `<div style="font-size: 0.72rem; color: var(--text-3); text-align: center; padding: 10px 0;">Belum ada mindmap.</div>`;
            } else {
                mindmaps.forEach(mm => {
                    const item = document.createElement('div');
                    const isActive = mm.id === state.currentMindmapId;
                    item.className = `history-item ${isActive ? 'active' : ''}`;
                    
                    let dateStr = '';
                    try {
                        const date = new Date(mm.updated_at);
                        dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
                    } catch (e) {
                        dateStr = mm.updated_at;
                    }
                    
                    item.innerHTML = `
                        <div class="history-item-left">
                            <span class="history-item-title" title="${mm.name}">${mm.name}</span>
                            <span class="history-item-date">${dateStr}</span>
                        </div>
                        <button class="history-item-delete" title="Hapus mindmap ini" data-id="${mm.id}">
                            <i data-lucide="trash-2"></i>
                        </button>
                    `;
                    
                    item.addEventListener('click', (e) => {
                        if (e.target.closest('.history-item-delete')) return;
                        loadMindmapById(mm.id);
                    });
                    
                    const deleteBtn = item.querySelector('.history-item-delete');
                    deleteBtn.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        if (confirm(`Apakah Anda yakin ingin menghapus mindmap "${mm.name}"?`)) {
                            await deleteMindmapById(mm.id);
                        }
                    });
                    
                    container.appendChild(item);
                });
            }
        }

        // REDESIGN: Render cards to the main Dashboard page
        const cardsContainer = document.getElementById('redesign-history-cards-container');
        if (cardsContainer) {
            cardsContainer.innerHTML = '';
            if (mindmaps.length === 0) {
                cardsContainer.innerHTML = `<div style="font-size: 0.88rem; color: var(--text-3); text-align: center; padding: 3rem 0; width: 100%;">Belum ada riwayat eksplorasi. Silakan cari topik baru untuk memulai!</div>`;
            } else {
                mindmaps.forEach(mm => {
                    const card = document.createElement('div');
                    card.className = 'history-progress-card';
                    
                    let dateStr = '';
                    try {
                        const date = new Date(mm.updated_at);
                        dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                    } catch (e) {
                        dateStr = mm.updated_at;
                    }
                    
                    // Hitung jumlah node, progress done, & tingkat kedalaman (level) maksimum
                    let totalNodes = 1;
                    let doneNodes = 0;
                    let maxDepth = 1;
                    
                    const getTreeDepth = (node) => {
                        if (!node) return 0;
                        if (!node.children || node.children.length === 0) {
                            return 1;
                        }
                        let maxChildDepth = 0;
                        node.children.forEach(c => {
                            const d = getTreeDepth(c);
                            if (d > maxChildDepth) maxChildDepth = d;
                        });
                        return maxChildDepth + 1;
                    };
                    
                    if (mm.tree_data) {
                        try {
                            const treeObj = typeof mm.tree_data === 'string' ? JSON.parse(mm.tree_data) : mm.tree_data;
                            maxDepth = getTreeDepth(treeObj);
                            
                            const countNodes = (node) => {
                                let count = 1;
                                if (node.children) {
                                    node.children.forEach(c => { count += countNodes(c); });
                                }
                                return count;
                            };
                            totalNodes = countNodes(treeObj);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                    
                    let statusesObj = {};
                    if (mm.node_statuses) {
                        try {
                            statusesObj = typeof mm.node_statuses === 'string' ? JSON.parse(mm.node_statuses) : mm.node_statuses;
                        } catch (e) {
                            console.error(e);
                        }
                    }
                    doneNodes = Object.values(statusesObj).filter(s => s === 'done').length || 0;
                    
                    const progressPercent = Math.round((doneNodes / totalNodes) * 100) || 0;
                    
                    card.innerHTML = `
                        <div class="card-mobile-icon-wrapper">
                            <div class="card-mobile-icon">
                                <i data-lucide="book-open"></i>
                            </div>
                        </div>
                        <div class="card-info-left">
                            <div class="card-topic-title">${mm.name}</div>
                            <div class="card-meta-row">
                                <div class="card-meta-item card-meta-calendar"><i data-lucide="calendar"></i><span>${dateStr}</span></div>
                                <div class="card-meta-item"><i data-lucide="git-branch"></i><span>${totalNodes} Nodes</span></div>
                            </div>
                        </div>
                        <div class="card-progress-right">
                            <span class="progress-label-micro">Progress</span>
                            <div class="progress-bar-outer">
                                <div class="progress-bar-inner" style="width: ${progressPercent}%;"></div>
                            </div>
                            <span class="progress-percent-bold">${progressPercent}%</span>
                            ${progressPercent === 100 ? `
                            <div class="card-badge-completed">
                                <i data-lucide="check-circle-2"></i>
                                <span>Selesai</span>
                            </div>
                            ` : ''}
                        </div>
                        <button class="card-delete-btn" title="Hapus mindmap ini">
                            <i data-lucide="trash-2"></i>
                        </button>
                        <div class="card-chevron-btn"><i data-lucide="chevron-right"></i></div>
                    `;
                    
                    card.addEventListener('click', (e) => {
                        if (e.target.closest('.card-delete-btn')) return;
                        loadMindmapById(mm.id);
                        switchScreen('mindmaps');
                    });
                    
                    const cardDeleteBtn = card.querySelector('.card-delete-btn');
                    cardDeleteBtn.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        if (confirm(`Apakah Anda yakin ingin menghapus mindmap "${mm.name}"?`)) {
                            await deleteMindmapById(mm.id);
                        }
                    });
                    
                    cardsContainer.appendChild(card);
                });
            }
        }
        
        // REDESIGN: Render recent searches on the Dashboard Exploration subview dynamically
        const recentContainer = document.getElementById('recent-searches-dashboard-container');
        if (recentContainer) {
            recentContainer.innerHTML = '';
            if (mindmaps.length === 0) {
                recentContainer.innerHTML = `<div style="font-size: 0.78rem; color: var(--text-3); font-style: italic; padding: 0.5rem 0;">Belum ada pencarian terakhir</div>`;
            } else {
                mindmaps.slice(0, 3).forEach(mm => {
                    const item = document.createElement('div');
                    item.className = 'recent-search-item';
                    item.style.cssText = 'padding: 10px 14px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-card); font-size: 0.8rem; color: var(--text-main); cursor: pointer; transition: background var(--t), border-color var(--t);';
                    item.innerText = mm.name;
                    item.addEventListener('click', () => {
                        loadMindmapById(mm.id);
                        switchScreen('mindmaps');
                    });
                    recentContainer.appendChild(item);
                });
            }
        }
        
        if (window.lucide) window.lucide.createIcons();
    } catch (e) {
        console.error('Gagal memuat daftar riwayat:', e);
        const container = document.getElementById('history-list-container');
        if (container) {
            container.innerHTML = `<div style="font-size: 0.72rem; color: #ef4444; text-align: center; padding: 10px 0;">Gagal memuat riwayat. Silakan restart server.</div>`;
        }
    }
}

async function loadMindmapById(id) {
    state.currentMindmapId = id;
    localStorage.setItem('current_mindmap_id', id);
    
    // Sinkronkan
    await syncFromDatabase(id);
    
    // Pastikan berada di mode riwayat
    switchSidebarMode('history');
    
    // Tampilkan pesan di chat bahwa mindmap berhasil dimuat
    if (state.mindmapData) {
        appendChatMessage('bot', `Mindmap **${state.mindmapData.name}** berhasil dimuat! Mari lanjutkan belajar. 📚`);
    }
    
    if (typeof updateMobileHeaderTitle === 'function') {
        updateMobileHeaderTitle();
    }
}

async function deleteMindmapById(id) {
    try {
        const res = await fetch(`/api/mindmap/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Gagal menghapus');
        
        // Jika mindmap yang dihapus adalah yang sedang aktif
        if (id === state.currentMindmapId) {
            // Coba ambil mindmap lain dari list yang tersisa
            const listRes = await fetch('/api/mindmaps');
            if (listRes.ok) {
                const list = await listRes.json();
                if (list && list.length > 0) {
                    // Load yang teratas
                    await loadMindmapById(list[0].id);
                } else {
                    // DB benar-benar kosong
                    state.currentMindmapId = null;
                    localStorage.removeItem('current_mindmap_id');
                    state.mindmapData = null;
                    state.nodeCache = {};
                    state.nodeStatuses = {};
                    saveState(true);
                    
                    // Bersihkan canvas
                    d3.select('#mindmap-svg').selectAll('*').remove();
                    document.getElementById('mindmap-hint-text').classList.remove('hidden');
                    
                    appendChatMessage('bot', 'Semua mindmap telah dihapus. Silakan tulis topik baru di kolom chat untuk memulai!');
                    
                    // Update daftar riwayat di sidebar agar terupdate
                    await loadHistoryList();
                }
            }
        } else {
            // Cukup refresh history list
            await loadHistoryList();
        }
    } catch (e) {
        console.error('Gagal menghapus mindmap:', e);
        alert('Gagal menghapus mindmap: ' + e.message);
    }
}

function createNewMindmap() {
    // Reset state local
    state.currentMindmapId = 'mm_' + Date.now();
    localStorage.setItem('current_mindmap_id', state.currentMindmapId);
    state.isOwner = true;
    state.mindmapData = null;
    state.nodeCache = {};
    state.nodeStatuses = {};
    
    // Bersihkan canvas & status localstorage
    localStorage.removeItem('mindmap_data');
    localStorage.removeItem('node_cache');
    localStorage.removeItem('node_statuses');
    
    d3.select('#mindmap-svg').selectAll('*').remove();
    document.getElementById('mindmap-hint-text').classList.remove('hidden');
    
    appendChatMessage('bot', 'Siap membuat mindmap baru! Silakan tulis topik belajar berikutnya yang ingin kamu jelajahi di bawah ini.');
    
    // Aktifkan mode chat
    switchSidebarMode('chat');
    
    // Refresh list history agar state active terupdate
    loadHistoryList();
}

/* ==========================================================================
   Fase 5: MANUAL NODE CRUD & MODAL CONTROLLERS
   ========================================================================== */

function openAddNodeModal() {
    if (!state.activeNode) return;
    const modal = document.getElementById('add-node-modal');
    const parentTitleEl = document.getElementById('add-node-parent-title');
    const titleInput = document.getElementById('add-node-title-input');
    const descInput = document.getElementById('add-node-desc-input');

    if (parentTitleEl) parentTitleEl.innerText = state.activeNode.name;
    if (titleInput) titleInput.value = '';
    if (descInput) descInput.value = '';

    if (modal) modal.classList.add('open');
}

function closeAddNodeModal() {
    const modal = document.getElementById('add-node-modal');
    if (modal) modal.classList.remove('open');
}

function openEditNodeModal() {
    if (!state.activeNode) return;
    const modal = document.getElementById('edit-node-modal');
    const titleInput = document.getElementById('edit-node-title-input');
    const descInput = document.getElementById('edit-node-desc-input');

    if (titleInput) titleInput.value = state.activeNode.name;
    if (descInput) descInput.value = state.activeNode.description || '';

    if (modal) modal.classList.add('open');
}

function closeEditNodeModal() {
    const modal = document.getElementById('edit-node-modal');
    if (modal) modal.classList.remove('open');
}

function submitAddNode(e) {
    e.preventDefault();
    if (!state.activeNode) return;

    const titleInput = document.getElementById('add-node-title-input');
    const descInput = document.getElementById('add-node-desc-input');
    if (!titleInput || !descInput) return;
    
    const title = titleInput.value.trim();
    const desc = descInput.value.trim();

    if (!title) {
        alert(state.language === 'en' ? 'Please enter a title' : 'Silakan masukkan judul sub-topik');
        return;
    }

    // Hindari duplikasi sub-node di parent yang sama
    if (!state.activeNode.children) {
        state.activeNode.children = [];
    }

    const exists = state.activeNode.children.some(child => child.name.toLowerCase() === title.toLowerCase());
    if (exists) {
        alert(state.language === 'en' 
            ? 'A subtopic with this title already exists under this node.' 
            : 'Sub-topik dengan judul ini sudah ada di bawah node ini.');
        return;
    }

    // Buat node kustom baru
    const newNode = {
        id: `custom-${state.activeNode.name}-${title}-${Date.now()}`,
        name: title,
        description: desc || (state.language === 'en' ? 'Custom Subtopic' : 'Sub-topik Kustom'),
        children: []
    };

    state.activeNode.children.push(newNode);
    
    // Simpan ke cache agar penjelasannya bisa ditulis manual atau otomatis saat di-deep dive
    state.nodeCache[title] = {
        explanation: state.language === 'en' 
            ? `### ${title}\n\nThis is a custom subtopic created manually under **${state.activeNode.name}**.\n\nDescription: *${newNode.description}*`
            : `### ${title}\n\nIni adalah sub-topik kustom yang dibuat secara manual di bawah **${state.activeNode.name}**.\n\nDeskripsi: *${newNode.description}*`,
        subtopics: []
    };

    saveState();
    updateMindmap(state.mindmapData);
    closeAddNodeModal();

    const msg = state.language === 'en'
        ? `Successfully added new subtopic **${title}** manually under **${state.activeNode.name}**!`
        : `Berhasil menambahkan sub-topik baru **${title}** secara manual di bawah **${state.activeNode.name}**!`;
    appendChatMessage('bot', msg);
}

function submitEditNode(e) {
    e.preventDefault();
    if (!state.activeNode) return;

    const titleInput = document.getElementById('edit-node-title-input');
    const descInput = document.getElementById('edit-node-desc-input');
    if (!titleInput || !descInput) return;
    
    const newTitle = titleInput.value.trim();
    const newDesc = descInput.value.trim();

    if (!newTitle) {
        alert(state.language === 'en' ? 'Please enter a title' : 'Silakan masukkan judul');
        return;
    }

    const oldTitle = state.activeNode.name;

    // Jika mengganti judul utama (root node), perbarui nama mindmap utama
    const isRoot = state.activeNode.id === 'root';
    if (isRoot) {
        state.mindmapData.name = newTitle;
    }

    // Cari node di tree dan update datanya
    state.activeNode.name = newTitle;
    state.activeNode.description = newDesc;

    // Migrasi cache & status progress jika ada perubahan nama
    if (oldTitle !== newTitle) {
        // Cache penjelasan
        if (state.nodeCache[oldTitle]) {
            state.nodeCache[newTitle] = state.nodeCache[oldTitle];
            delete state.nodeCache[oldTitle];
            
            // Perbarui judul h3 di isi markdown penjelasan jika menggunakan template bawaan
            let currentExp = state.nodeCache[newTitle].explanation;
            if (currentExp.startsWith(`### ${oldTitle}`)) {
                state.nodeCache[newTitle].explanation = currentExp.replace(`### ${oldTitle}`, `### ${newTitle}`);
            }
        }
        
        // Status progress (todo, doing, done)
        if (state.nodeStatuses[oldTitle]) {
            state.nodeStatuses[newTitle] = state.nodeStatuses[oldTitle];
            delete state.nodeStatuses[oldTitle];
        }
    }

    saveState();
    updateMindmap(state.mindmapData);
    closeEditNodeModal();

    // Perbarui drawer yang sedang terbuka
    const drawerTitle = document.getElementById('drawer-node-title');
    if (drawerTitle) drawerTitle.innerText = newTitle;

    if (state.nodeCache[newTitle]) {
        renderNodeDetail(newTitle, state.nodeCache[newTitle].explanation);
    }

    const msg = state.language === 'en'
        ? `Node **${oldTitle}** was successfully edited to **${newTitle}**!`
        : `Node **${oldTitle}** berhasil diubah menjadi **${newTitle}**!`;
    appendChatMessage('bot', msg);
    
    // Muat ulang history jika root diubah namanya
    if (isRoot) {
        loadHistoryList();
    }
}

function handleDeleteNode() {
    if (!state.activeNode) return;

    // Larang menghapus root node agar mindmap tetap utuh
    if (state.activeNode.id === 'root') {
        alert(state.language === 'en' 
            ? 'You cannot delete the root node. Create a new mindmap instead!' 
            : 'Anda tidak dapat menghapus node akar (root). Silakan buat mindmap baru jika ingin mengganti topik!');
        return;
    }

    const confirmMsg = state.language === 'en'
        ? `Are you sure you want to delete "${state.activeNode.name}" and all its subtopics? This action cannot be undone.`
        : `Apakah Anda yakin ingin menghapus "${state.activeNode.name}" dan seluruh sub-cabang di bawahnya? Tindakan ini tidak bisa dibatalkan.`;

    if (!confirm(confirmMsg)) return;

    const nodeToDelete = state.activeNode;

    // Fungsi rekursif untuk mencari parent dan menghapus child
    function removeNodeRecursively(parent, targetId) {
        if (!parent.children) return false;
        const index = parent.children.findIndex(child => child.id === targetId || child.name === targetId);
        if (index !== -1) {
            parent.children.splice(index, 1);
            return true;
        }
        for (let child of parent.children) {
            if (removeNodeRecursively(child, targetId)) {
                return true;
            }
        }
        return false;
    }

    // Fungsi rekursif untuk membersihkan cache & status dari sub-tree yang dihapus
    function cleanSubtreeData(node) {
        if (node.name) {
            delete state.nodeCache[node.name];
            delete state.nodeStatuses[node.name];
        }
        if (node.children) {
            node.children.forEach(cleanSubtreeData);
        }
    }

    // Hapus dari tree
    const deleted = removeNodeRecursively(state.mindmapData, nodeToDelete.id || nodeToDelete.name);

    if (deleted) {
        // Bersihkan seluruh data sub-tree
        cleanSubtreeData(nodeToDelete);

        saveState();
        closeDetailDrawer();
        updateMindmap(state.mindmapData);

        const msg = state.language === 'en'
            ? `Node **${nodeToDelete.name}** and all its branches were deleted successfully.`
            : `Node **${nodeToDelete.name}** beserta seluruh cabangnya berhasil dihapus.`;
        appendChatMessage('bot', msg);
    } else {
        alert(state.language === 'en' ? 'Failed to delete node.' : 'Gagal menghapus node.');
    }
}

function openRegenerateNodeModal() {
    if (!state.activeNode) return;
    const modal = document.getElementById('regenerate-node-modal');
    const displayEl = document.getElementById('regenerate-node-title-display');
    const promptInput = document.getElementById('regenerate-custom-prompt');
    if (displayEl) displayEl.innerText = state.activeNode.name;
    if (promptInput) promptInput.value = '';

    // Pre-populate style selectors in regenerate modal
    const styleSelect = document.getElementById('regenerate-style-select');
    const substyleSelect = document.getElementById('regenerate-substyle-select');
    if (styleSelect && substyleSelect) {
        styleSelect.value = state.activeNode.writingStyle || 'auto';
        updateSubStyleDropdown('regenerate-style-select', 'regenerate-substyle-select', state.activeNode.writingSubStyle || 'auto');
    }

    if (modal) modal.classList.add('open');
}

function closeRegenerateNodeModal() {
    const modal = document.getElementById('regenerate-node-modal');
    const promptInput = document.getElementById('regenerate-custom-prompt');
    if (promptInput) promptInput.value = '';
    if (modal) modal.classList.remove('open');
}

async function submitRegenerateNode(e) {
    e.preventDefault();
    if (!state.activeNode) return;

    const targetNode = state.activeNode; // Capture node reference to survive drawer closure!
    const nodeName = targetNode.name;
    const nodeDesc = targetNode.description || '';
    const rootTopicName = state.mindmapData.name;

    // Ambil instruksi eksplorasi khusus
    const promptInput = document.getElementById('regenerate-custom-prompt');
    const customPrompt = promptInput ? promptInput.value.trim() : '';

    // Ambil opsi dari radio input
    const radios = document.getElementsByName('regenerate-scope');
    let scope = 'keep';
    for (let r of radios) {
        if (r.checked) scope = r.value;
    }

    // Ambil opsi gaya penulisan terpilih dari modal
    const regenStyleSelect = document.getElementById('regenerate-style-select');
    const regenSubstyleSelect = document.getElementById('regenerate-substyle-select');
    let selectedStyle = regenStyleSelect ? regenStyleSelect.value : 'auto';
    let selectedSubStyle = regenSubstyleSelect ? regenSubstyleSelect.value : 'auto';

    if (selectedStyle === 'auto' && typeof getRandomStyleAndSubstyle === 'function') {
        const randomChoice = getRandomStyleAndSubstyle();
        selectedStyle = randomChoice.style;
        selectedSubStyle = randomChoice.substyle;
    }

    // Simpan pilihan gaya penulisan ini ke state node
    targetNode.writingStyle = selectedStyle;
    targetNode.writingSubStyle = selectedSubStyle;
    
    // Sinkronkan ke dropdown detail drawer agar sama/sinkron
    const drawerStyleSelect = document.getElementById('drawer-style-select');
    const drawerSubstyleSelect = document.getElementById('drawer-substyle-select');
    if (drawerStyleSelect && drawerSubstyleSelect) {
        drawerStyleSelect.value = selectedStyle;
        updateSubStyleDropdown('drawer-style-select', 'drawer-substyle-select', selectedSubStyle);
    }

    const styleInstruction = getWritingStyleInstruction(selectedStyle, selectedSubStyle);

    closeRegenerateNodeModal();

    // 1. Tampilkan loading di drawer dan canvas
    renderDrawerLoading(nodeName);
    targetNode.loading = true;
    updateMindmap(state.mindmapData);

    const thinkingMsg = state.language === 'en'
        ? `Regenerating material portal for **${nodeName}**... I am rebuilding the deep theoretical summary. 🔄`
        : `Membangun ulang portal materi untuk **${nodeName}**... Aku sedang merancang kembali penjelasan teorinya. 🔄`;
    appendChatMessage('bot', thinkingMsg);

    try {
        let result;
        if (scope === 'keep') {
            // Hanya buat ulang penjelasan, pertahaman sub-node di bawahnya
            const existingSubtopicList = targetNode.children ? targetNode.children.map(c => c.name).join(', ') : '';
            const prompt = state.language === 'en' ? `You are an expert tutor. The user is currently learning the main topic "${rootTopicName}" and wants you to regenerate the deep-dive explanation for the subtopic "${nodeName}" (Description: "${nodeDesc}").
            The existing subtopics under this node are: [${existingSubtopicList}].
            ${customPrompt ? `ADDITIONAL USER INSTRUCTION / FOCUS AREA: "${customPrompt}"\n` : ''}
            
            Your task is:
            Create an in-depth explanation/material in English using rich Markdown format (use small h3 headings, lists, analogies/examples, and blockquotes). WRITING STYLE STYLE: ${styleInstruction}. Open with an engaging introductory story or hook if relevant (do not force it). Focus on revealing counter-intuitive insights or lesser-known blindspots. Keep it concise, high-density, and limited to about 800-1000 words to prevent truncation.
            
            Return the result in JSON with exactly this format:
            {
              "explanation": "Full explanation content in Markdown format here..."
            }` : `Kamu adalah tutor ahli. Pengguna sedang mempelajari topik utama "${rootTopicName}" dan ingin Anda membuat ulang penjelasan materi yang mendalam untuk sub-topik "${nodeName}" (Deskripsi: "${nodeDesc}").
            Sub-topik yang sudah ada di bawah node ini adalah: [${existingSubtopicList}].
            ${customPrompt ? `INSTRUKSI TAMBAHAN / FOKUS UTAMA DARI PENGGUNA: "${customPrompt}"\n` : ''}
            
            Tugasmu adalah:
            Buat penjelasan materi yang mendalam dalam Bahasa Indonesia menggunakan format Markdown yang kaya (gunakan judul h3 kecil, list, contoh/analogi, dan blockquote yang menarik). GAYA PENULISAN: ${styleInstruction}. Buka dengan cerita pengantar atau narasi pembuka yang menarik jika relevan (jangan dipaksakan jika tidak cocok). Fokuslah untuk membuka "blindspot" baru (aspek mendalam, pemahaman yang kontra-intuitif, atau hal penting yang jarang disadari pembelajar). Tulis penjelasan secara padat, kaya informasi, dan batasi panjang penjelasan maksimal sekitar 800-1000 kata agar tidak terpotong.
            
            Kembalikan hasilnya dalam JSON dengan format persis seperti ini:
            {
              "explanation": "Isi penjelasan lengkap dalam format Markdown di sini..."
            }`;

            result = await callRouterAI(prompt);

            // Validasi respon JSON
            if (result && result.explanation) {
                // Update cache penjelasan, tapi pertahankan subtopics lama di cache
                if (!state.nodeCache[nodeName]) {
                    state.nodeCache[nodeName] = { explanation: '', subtopics: [] };
                }
                state.nodeCache[nodeName].explanation = result.explanation;
                state.nodeCache[nodeName].writingStyle = selectedStyle;
                state.nodeCache[nodeName].writingSubStyle = selectedSubStyle;
            } else {
                throw new Error("Respon AI tidak sesuai format");
            }
        } else if (scope === 'subtopics') {
            // Hanya buat ulang sub-topik baru, pertahankan penjelasan materi lama
            const prompt = state.language === 'en' ? `You are an expert tutor. The user is currently learning the main topic "${rootTopicName}" and wants you to regenerate ONLY the subtopics/milestones under the subtopic "${nodeName}" (Description: "${nodeDesc}") to dynamically expand their mindmap.
            ${customPrompt ? `ADDITIONAL USER INSTRUCTION / FOCUS AREA: "${customPrompt}"\n` : ''}
            
            Your task is:
            Generate several next, more specific subtopics/milestones under "${nodeName}". Decide the most relevant number of subtopics yourself (e.g. 2, 3, 5, or more) based on the scope and complexity. Do not make subtopics that are too generic.
            
            Return the result in JSON with exactly this format:
            {
              "subtopics": [
                { "name": "Specific Subtopic 1", "description": "Brief description 1" },
                { "name": "Specific Subtopic 2", "description": "Brief description 2" }
              ]
            }` : `Kamu adalah tutor ahli. Pengguna sedang mempelajari topik utama "${rootTopicName}" dan ingin Anda membuat ulang HANYA sub-topik/milestone di bawah sub-topik "${nodeName}" (Deskripsi: "${nodeDesc}") untuk memperluas mindmap mereka secara dinamis.
            ${customPrompt ? `INSTRUKSI TAMBAHAN / FOKUS UTAMA DARI PENGGUNA: "${customPrompt}"\n` : ''}
            
            Tugasmu adalah:
            Hasilkan beberapa sub-topik/milestone berikutnya yang lebih spesifik di bawah "${nodeName}" untuk memperluas mindmap mereka secara dinamis. Tentukan sendiri jumlah sub-topik yang paling relevan (misalnya 2, 3, 5, atau lebih) berdasarkan cakupan dan kompleksitas materinya. Jangan buat sub-topik yang terlalu umum.
            
            Kembalikan hasilnya dalam JSON dengan format persis seperti ini:
            {
              "subtopics": [
                { "name": "Sub-topik Spesifik 1", "description": "Deskripsi singkat 1" },
                { "name": "Sub-topik Spesifik 2", "description": "Deskripsi singkat 2" }
              ]
            }`;

            result = await callRouterAI(prompt);

            // Validasi respon JSON
            if (result && result.subtopics) {
                // Fungsi pembantu rekursif untuk membersihkan cache anak-anak lama sebelum diganti
                function cleanSubtreeData(node) {
                    if (node.name) {
                        delete state.nodeCache[node.name];
                        delete state.nodeStatuses[node.name];
                    }
                    if (node.children) {
                        node.children.forEach(cleanSubtreeData);
                    }
                }

                // Bersihkan data lama di bawah node ini
                if (targetNode.children) {
                    targetNode.children.forEach(cleanSubtreeData);
                }

                // Kosongkan dan ganti children
                targetNode.children = [];

                // Update cache subtopics baru, pertahankan penjelasan lama
                if (!state.nodeCache[nodeName]) {
                    state.nodeCache[nodeName] = { explanation: '', subtopics: [] };
                }
                state.nodeCache[nodeName].subtopics = result.subtopics || [];

                // Tambah children baru
                if (result.subtopics && result.subtopics.length > 0) {
                    result.subtopics.forEach(sub => {
                        sub.id = `${nodeName}-${sub.name}-${Date.now()}`;
                        targetNode.children.push(sub);
                    });
                }
            } else {
                throw new Error("Respon AI tidak sesuai format");
            }
        } else {
            // Buat ulang penjelasan & buat ulang sub-node baru
            const prompt = state.language === 'en' ? `You are an expert tutor. The user is currently learning the main topic "${rootTopicName}" and wants to deep-dive into the subtopic "${nodeName}" (Description: "${nodeDesc}").
            ${customPrompt ? `ADDITIONAL USER INSTRUCTION / FOCUS AREA: "${customPrompt}"\n` : ''}
            
            Your tasks are:
            1. Create an in-depth explanation/material in English using rich Markdown format (use small h3 headings, lists, analogies/examples, and blockquotes). WRITING STYLE STYLE: ${styleInstruction}. Open with an engaging introductory story or hook if relevant (do not force it). Focus on revealing counter-intuitive insights or lesser-known blindspots. Keep it concise, high-density, and limited to about 800-1000 words to prevent truncation.
            2. Generate several next, more specific subtopics/milestones under "${nodeName}" to dynamically expand their mindmap. Decide the most relevant number of subtopics yourself (e.g. 2, 3, 5, or more) based on the scope and complexity of the material. Do not make subtopics that are too generic.
    
            Return the result in JSON with exactly this format:
            {
              "explanation": "Full explanation content in Markdown format here...",
              "subtopics": [
                { "name": "Specific Subtopic 1", "description": "Brief description 1" },
                { "name": "Specific Subtopic 2", "description": "Brief description 2" }
              ]
            }` : `Kamu adalah tutor ahli. Pengguna sedang mempelajari topik utama "${rootTopicName}" dan ingin melakukan deep-dive ke sub-topik "${nodeName}" (Deskripsi: "${nodeDesc}").
            ${customPrompt ? `INSTRUKSI TAMBAHAN / FOKUS UTAMA DARI PENGGUNA: "${customPrompt}"\n` : ''}
            
            Tugasmu adalah:
            1. Buat penjelasan materi yang mendalam dalam Bahasa Indonesia menggunakan format Markdown yang kaya (gunakan judul h3 kecil, list, contoh/analogi, dan blockquote yang menarik). GAYA PENULISAN: ${styleInstruction}. Buka dengan cerita pengantar atau narasi pembuka yang menarik jika relevan (jangan dipaksakan jika tidak cocok). Fokuslah untuk membuka "blindspot" baru (aspek mendalam, pemahaman yang kontra-intuitif, atau hal penting yang jarang disadari pembelajar). Tulis penjelasan secara padat, kaya informasi, dan batasi panjang penjelasan maksimal sekitar 800-1000 kata agar tidak terpotong.
            2. Hasilkan beberapa sub-topik/milestone berikutnya yang lebih spesifik di bawah "${nodeName}" untuk memperluas mindmap mereka secara dinamis. Tentukan sendiri jumlah sub-topik yang paling relevan (misalnya 2, 3, 5, atau lebih) berdasarkan cakupan dan kompleksitas materinya. Jangan buat sub-topik yang terlalu umum.
    
            Kembalikan hasilnya dalam JSON dengan format persis seperti ini:
            {
              "explanation": "Isi penjelasan lengkap dalam format Markdown di sini...",
              "subtopics": [
                { "name": "Sub-topik Spesifik 1", "description": "Deskripsi singkat 1" },
                { "name": "Sub-topik Spesifik 2", "description": "Deskripsi singkat 2" }
              ]
            }`;

            result = await callRouterAI(prompt);

            // Validasi respon JSON
            if (result && result.explanation) {
                // Fungsi pembantu rekursif untuk membersihkan cache anak-anak lama sebelum diganti
                function cleanSubtreeData(node) {
                    if (node.name) {
                        delete state.nodeCache[node.name];
                        delete state.nodeStatuses[node.name];
                    }
                    if (node.children) {
                        node.children.forEach(cleanSubtreeData);
                    }
                }

                // Bersihkan data lama di bawah node ini
                if (targetNode.children) {
                    targetNode.children.forEach(cleanSubtreeData);
                }

                // Kosongkan dan ganti children
                targetNode.children = [];

                // Simpan cache baru
                state.nodeCache[nodeName] = {
                    explanation: result.explanation,
                    subtopics: result.subtopics || [],
                    writingStyle: selectedStyle,
                    writingSubStyle: selectedSubStyle
                };

                // Tambah children baru
                if (result.subtopics && result.subtopics.length > 0) {
                    result.subtopics.forEach(sub => {
                        sub.id = `${nodeName}-${sub.name}-${Date.now()}`;
                        targetNode.children.push(sub);
                    });
                }
            } else {
                throw new Error("Respon AI tidak sesuai format");
            }
        }

        // Hapus loading status
        delete targetNode.loading;

        saveState();
        updateMindmap(state.mindmapData);

        // Render isi penjelasan baru hanya jika drawer masih aktif pada node ini
        if (state.activeNode === targetNode) {
            renderNodeDetail(nodeName, state.nodeCache[nodeName].explanation);
        }

        const msg = state.language === 'en'
            ? `Successfully regenerated material for **${nodeName}**! 🔄`
            : `Berhasil membangun ulang materi untuk **${nodeName}**! 🔄`;
        appendChatMessage('bot', msg);

    } catch (error) {
        console.error('Regeneration error:', error);
        if (targetNode) {
            delete targetNode.loading;
        }
        updateMindmap(state.mindmapData);
        
        const msg = state.language === 'en'
            ? `Sorry, I failed to regenerate material for **${nodeName}**. Error message: *${error.message}*.`
            : `Maaf, aku gagal membangun ulang materi untuk **${nodeName}**. Masalah: *${error.message}*.`;
        appendChatMessage('bot', msg);
        
        if (state.activeNode === targetNode) {
            renderDrawerError(nodeName, error.message);
        }
    }
}

function openExportModal() {
    const modal = document.getElementById('export-modal');
    if (modal) modal.classList.add('open');
}

function closeExportModal() {
    const modal = document.getElementById('export-modal');
    if (modal) modal.classList.remove('open');
}

function exportToSVG() {
    // [ignoring loop detection]
    if (!rootNodeData || !state.mindmapData) {
        alert(state.language === 'en' ? 'No mindmap data to export.' : 'Tidak ada data mindmap untuk diekspor.');
        return;
    }
    const originalSvg = document.getElementById('mindmap-svg');
    if (!originalSvg) return;
    const clonedSvg = originalSvg.cloneNode(true);
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    let maxNode = null;
    rootNodeData.descendants().forEach(d => {
        if (d.y < minY) minY = d.y;
        if (d.y > maxY) {
            maxY = d.y;
            maxNode = d;
        }
        if (d.x < minX) minX = d.x;
        if (d.x > maxX) maxX = d.x;
    });
    const maxNodeWidth = maxNode ? getNodeWidth(maxNode.data) : 180;
    const graphWidth = (maxY - minY) + maxNodeWidth + 100;
    const graphHeight = (maxX - minX) + nodeHeight + 100;
    clonedSvg.setAttribute('viewBox', `${minY - 50} ${minX - 50} ${graphWidth} ${graphHeight}`);
    clonedSvg.setAttribute('width', graphWidth);
    clonedSvg.setAttribute('height', graphHeight);
    const mainGroup = clonedSvg.querySelector('.main-group');
    if (mainGroup) {
        mainGroup.removeAttribute('transform');
    }
    const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    styleEl.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        svg {
            background-color: #f9f9f9;
        }
        .link {
            fill: none;
            stroke: #d4d4d8;
            stroke-width: 1.5px;
            stroke-linecap: round;
        }
        .link.active {
            stroke: #2563eb;
        }
        .node-card {
            background: #ffffff;
            border: 1px solid #e4e4e7;
            border-radius: 6px;
            padding: 0.5rem 0.65rem;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            font-family: 'Inter', system-ui, sans-serif;
        }
        .node-title {
            font-size: 0.78rem;
            font-weight: 600;
            color: #09090b;
            line-height: 1.25;
        }
        .node-desc {
            font-size: 0.68rem;
            color: #71717a;
            line-height: 1.3;
            margin-top: 3px;
        }
        .node-card.level-0 { border-left: 3px solid #18181b; }
        .node-card.level-0 .node-title { color: #18181b; }
        .node-card.level-1 { border-left: 3px solid #2563eb; }
        .node-card.level-1 .node-title { color: #2563eb; }
        .node-card.level-2 { border-left: 3px solid #16a34a; }
        .node-card.level-2 .node-title { color: #16a34a; }
        .node-card.level-3 { border-left: 3px solid #9333ea; }
        .node-card.level-3 .node-title { color: #9333ea; }
        .node-card.status-doing::after {
            content: '';
            position: absolute;
            bottom: 5px;
            right: 6px;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #f59e0b;
        }
        .node-card.status-done::after {
            content: '';
            position: absolute;
            bottom: 5px;
            right: 6px;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #22c55e;
        }
    `;
    clonedSvg.insertBefore(styleEl, clonedSvg.firstChild);
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clonedSvg);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mindmap-${state.mindmapData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function exportToPNG() {
    if (!rootNodeData || !state.mindmapData) {
        alert(state.language === 'en' ? 'No mindmap data to export.' : 'Tidak ada data mindmap untuk diekspor.');
        return;
    }
    const originalSvg = document.getElementById('mindmap-svg');
    if (!originalSvg) return;
    const clonedSvg = originalSvg.cloneNode(true);
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    let maxNode = null;
    rootNodeData.descendants().forEach(d => {
        if (d.y < minY) minY = d.y;
        if (d.y > maxY) {
            maxY = d.y;
            maxNode = d;
        }
        if (d.x < minX) minX = d.x;
        if (d.x > maxX) maxX = d.x;
    });
    const maxNodeWidth = maxNode ? getNodeWidth(maxNode.data) : 180;
    const graphWidth = (maxY - minY) + maxNodeWidth + 100;
    const graphHeight = (maxX - minX) + nodeHeight + 100;
    clonedSvg.setAttribute('viewBox', `${minY - 50} ${minX - 50} ${graphWidth} ${graphHeight}`);
    clonedSvg.setAttribute('width', graphWidth);
    clonedSvg.setAttribute('height', graphHeight);
    const mainGroup = clonedSvg.querySelector('.main-group');
    if (mainGroup) {
        mainGroup.removeAttribute('transform');
    }
    const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    styleEl.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        svg {
            background-color: #f9f9f9;
        }
        .link {
            fill: none;
            stroke: #d4d4d8;
            stroke-width: 1.5px;
            stroke-linecap: round;
        }
        .link.active {
            stroke: #2563eb;
        }
        .node-card {
            background: #ffffff;
            border: 1px solid #e4e4e7;
            border-radius: 6px;
            padding: 0.5rem 0.65rem;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            font-family: 'Inter', system-ui, sans-serif;
        }
        .node-title {
            font-size: 0.78rem;
            font-weight: 600;
            color: #09090b;
            line-height: 1.25;
        }
        .node-desc {
            font-size: 0.68rem;
            color: #71717a;
            line-height: 1.3;
            margin-top: 3px;
        }
        .node-card.level-0 { border-left: 3px solid #18181b; }
        .node-card.level-0 .node-title { color: #18181b; }
        .node-card.level-1 { border-left: 3px solid #2563eb; }
        .node-card.level-1 .node-title { color: #2563eb; }
        .node-card.level-2 { border-left: 3px solid #16a34a; }
        .node-card.level-2 .node-title { color: #16a34a; }
        .node-card.level-3 { border-left: 3px solid #9333ea; }
        .node-card.level-3 .node-title { color: #9333ea; }
        .node-card.status-doing::after {
            content: '';
            position: absolute;
            bottom: 5px;
            right: 6px;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #f59e0b;
        }
        .node-card.status-done::after {
            content: '';
            position: absolute;
            bottom: 5px;
            right: 6px;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #22c55e;
        }
    `;
    clonedSvg.insertBefore(styleEl, clonedSvg.firstChild);
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clonedSvg);
    const img = new Image();
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    img.onload = function() {
        const canvas = document.createElement('canvas');
        const scale = 2;
        canvas.width = graphWidth * scale;
        canvas.height = graphHeight * scale;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#f9f9f9';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0, graphWidth, graphHeight);
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `mindmap-${state.mindmapData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    img.onerror = function(err) {
        console.error('Gagal merender gambar PNG:', err);
        alert(state.language === 'en' ? 'Failed to export to PNG. Please try SVG format instead.' : 'Gagal mengekspor ke PNG. Silakan coba format SVG.');
        URL.revokeObjectURL(url);
    };
    img.src = url;
}

function exportToMarkdown() {
    if (!state.mindmapData) {
        alert(state.language === 'en' ? 'No mindmap data to export.' : 'Tidak ada data mindmap untuk diekspor.');
        return;
    }
    const exploredExplanations = [];
    function traverse(node, depth = 0) {
        if (!node) return;
        const cache = state.nodeCache[node.name];
        if (cache && cache.explanation) {
            exploredExplanations.push({
                name: node.name,
                depth: depth,
                explanation: cache.explanation
            });
        }
        if (node.children) {
            node.children.forEach(child => traverse(child, depth + 1));
        }
    }
    traverse(state.mindmapData);
    if (exploredExplanations.length === 0) {
        alert(state.language === 'en' 
            ? 'You have not explored any nodes in this mindmap yet.' 
            : 'Anda belum mengeksplorasi node manapun di mindmap ini.');
        return;
    }
    let markdownContent = `# Rangkuman Belajar: ${state.mindmapData.name}\n\n`;
    markdownContent += `*Dokumen ini berisi kumpulan materi belajar terpadu yang diekspor dari sesi belajar **Rabbit Hole Mindmap Learner** pada ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}.*\n\n`;
    markdownContent += `Jumlah Topik Dieksplorasi: **${exploredExplanations.length}**\n\n`;
    markdownContent += `--- \n\n`;
    exploredExplanations.forEach((item, index) => {
        markdownContent += `## ${index + 1}. ${item.name} (Level ${item.depth})\n\n`;
        markdownContent += `${item.explanation}\n\n`;
        markdownContent += `--- \n\n`;
    });
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `materi-${state.mindmapData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ==========================================================================
// HIGHLIGHT & COMMENTARY (STICKY NOTES) HELPERS
// ==========================================================================
let activeHighlightId = null;

function handleTextSelection() {
    if (!state.isOwner) return;
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    const toolbar = document.getElementById('highlight-toolbar');
    
    if (selectedText.length > 1) {
        const container = document.getElementById('drawer-markdown-content');
        if (container && selection.anchorNode && container.contains(selection.anchorNode)) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            if (toolbar) {
                toolbar.classList.remove('hidden');
                const toolbarHeight = 40;
                const toolbarWidth = toolbar.offsetWidth || 180;
                
                const top = rect.top + window.scrollY - toolbarHeight - 8;
                const left = rect.left + window.scrollX + (rect.width / 2) - (toolbarWidth / 2);
                
                toolbar.style.top = `${Math.max(top, 10)}px`;
                toolbar.style.left = `${Math.max(left, 10)}px`;
            }
            return;
        }
    }
    
    if (toolbar && !toolbar.classList.contains('hidden')) {
        toolbar.classList.add('hidden');
    }
}

function addHighlight(color) {
    if (!state.activeNode) return;
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    if (!selectedText) return;
    
    const nodeName = state.activeNode.name;
    const cache = state.nodeCache[nodeName];
    if (!cache) return;
    
    if (!cache.highlights) {
        cache.highlights = [];
    }
    
    const hlId = `hl-${Date.now()}`;
    const newHl = {
        id: hlId,
        text: selectedText,
        color: color,
        note: ""
    };
    
    cache.highlights.push(newHl);
    saveState();
    
    // Hapus selection & sembunyikan toolbar sebelum render ulang menghapus node DOM
    const toolbar = document.getElementById('highlight-toolbar');
    if (toolbar) toolbar.classList.add('hidden');
    selection.removeAllRanges();
    
    // Re-render to apply immediately
    renderNodeDetail(nodeName, cache.explanation);
}

function addHighlightWithNote() {
    if (!state.activeNode) return;
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    if (!selectedText) return;
    
    const nodeName = state.activeNode.name;
    const cache = state.nodeCache[nodeName];
    if (!cache) return;
    
    if (!cache.highlights) {
        cache.highlights = [];
    }
    
    const hlId = `hl-${Date.now()}`;
    const newHl = {
        id: hlId,
        text: selectedText,
        color: "yellow", // default color
        note: ""
    };
    
    cache.highlights.push(newHl);
    saveState();
    
    // Hapus selection & sembunyikan toolbar sebelum render ulang menghapus node DOM
    const toolbar = document.getElementById('highlight-toolbar');
    if (toolbar) toolbar.classList.add('hidden');
    selection.removeAllRanges();
    
    renderNodeDetail(nodeName, cache.explanation);
    
    // Langsung buka modal catatan
    setTimeout(() => {
        openCommentaryModalById(hlId);
    }, 50);
}

function openCommentaryModalById(hlId) {
    if (!state.activeNode) return;
    const nodeName = state.activeNode.name;
    const cache = state.nodeCache[nodeName];
    if (!cache || !cache.highlights) return;
    
    const hl = cache.highlights.find(h => h.id === hlId);
    if (!hl) return;
    
    activeHighlightId = hlId;
    
    const modal = document.getElementById('commentary-modal');
    const textDisplay = document.getElementById('commentary-highlight-text');
    const noteInput = document.getElementById('commentary-note-input');
    
    if (textDisplay) textDisplay.textContent = `"${hl.text}"`;
    if (noteInput) noteInput.value = hl.note || '';
    
    if (modal) modal.classList.add('open');
}

function closeCommentaryModal() {
    const modal = document.getElementById('commentary-modal');
    if (modal) modal.classList.remove('open');
    activeHighlightId = null;
}

function saveCommentary() {
    if (!state.activeNode || !activeHighlightId) return;
    const nodeName = state.activeNode.name;
    const cache = state.nodeCache[nodeName];
    if (!cache || !cache.highlights) return;
    
    const hl = cache.highlights.find(h => h.id === activeHighlightId);
    if (hl) {
        const noteInput = document.getElementById('commentary-note-input');
        hl.note = noteInput ? noteInput.value.trim() : '';
        saveState();
        renderNodeDetail(nodeName, cache.explanation);
    }
    closeCommentaryModal();
}

function deleteHighlightFromModal() {
    if (!state.activeNode || !activeHighlightId) return;
    const nodeName = state.activeNode.name;
    const cache = state.nodeCache[nodeName];
    if (!cache || !cache.highlights) return;
    
    cache.highlights = cache.highlights.filter(h => h.id !== activeHighlightId);
    saveState();
    renderNodeDetail(nodeName, cache.explanation);
    closeCommentaryModal();
}

function showToast(message) {
    let toast = document.getElementById('custom-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'custom-toast';
        toast.style.position = 'fixed';
        toast.style.bottom = '24px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%) translateY(100px)';
        toast.style.background = '#18181b';
        toast.style.color = '#ffffff';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '8px';
        toast.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)';
        toast.style.zIndex = '9999';
        toast.style.fontFamily = 'Inter, system-ui, sans-serif';
        toast.style.fontSize = '0.875rem';
        toast.style.fontWeight = '500';
        toast.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease';
        toast.style.opacity = '0';
        toast.style.display = 'flex';
        toast.style.alignItems = 'center';
        toast.style.gap = '8px';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<span style="color: #22c55e;">✓</span> ${message}`;
    
    // Trigger animation
    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(-50%) translateY(0)';
        toast.style.opacity = '1';
    });

    // Clear existing timeout if any
    if (toast.timeoutId) {
        clearTimeout(toast.timeoutId);
    }

    toast.timeoutId = setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(100px)';
        toast.style.opacity = '0';
    }, 3000);
}

async function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (e) {
            console.warn('navigator.clipboard failed, trying fallback...', e);
        }
    }
    
    // Fallback using temporary textarea
    try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.top = '0';
        textarea.style.left = '0';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (successful) return true;
    } catch (err) {
        console.error('Fallback copy failed:', err);
    }
    return false;
}

async function shareMindmap() {
    if (!state.currentMindmapId) {
        alert(state.language === 'en' ? 'No active mindmap to share!' : 'Tidak ada mindmap aktif untuk dibagikan!');
        return;
    }
    const shareUrl = `${window.location.origin}${window.location.pathname}?id=${state.currentMindmapId}`;
    const copied = await copyToClipboard(shareUrl);
    if (copied) {
        const msg = state.language === 'en'
            ? `🔗 **Link copied!** You can share this mindmap with others: <br><a href="${shareUrl}" target="_blank" class="share-link-toast">${shareUrl}</a>`
            : `🔗 **Link berhasil disalin!** Kamu bisa membagikan mindmap ini ke orang lain: <br><a href="${shareUrl}" target="_blank" class="share-link-toast">${shareUrl}</a>`;
        appendChatMessage('bot', msg);
        showToast(state.language === 'en' ? 'Share link copied to clipboard!' : 'Link bagikan telah disalin ke clipboard!');
    } else {
        prompt(state.language === 'en' ? 'Copy this link to share:' : 'Salin link ini untuk membagikan:', shareUrl);
    }
}

function updateOwnerUI() {
    const ownerOnlyIds = [
        'btn-add-subnode',
        'btn-edit-node',
        'btn-regenerate-node',
        'btn-delete-node'
    ];
    
    ownerOnlyIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (state.isOwner) {
                el.style.display = '';
            } else {
                el.style.display = 'none';
            }
        }
    });
    
    const mobileMore = document.getElementById('btn-mobile-more');
    if (mobileMore) {
        mobileMore.style.display = state.isOwner ? '' : 'none';
    }

    const styleSelectorWrap = document.querySelector('.style-selector-wrap');
    if (styleSelectorWrap) {
        styleSelectorWrap.style.display = state.isOwner ? 'flex' : 'none';
    }
}

function applyHighlights(nodeName) {
    const container = document.getElementById('drawer-markdown-content');
    if (!container) return;
    
    const cache = state.nodeCache[nodeName];
    if (!cache || !cache.highlights || cache.highlights.length === 0) return;
    
    cache.highlights.forEach(hl => {
        highlightTextInDOM(container, hl.text, hl.id, hl.color, hl.note);
    });
}

function highlightTextInDOM(container, searchText, id, color, note) {
    if (!searchText) return;
    
    const walk = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
    let node;
    const nodesToProcess = [];
    
    while (node = walk.nextNode()) {
        if (node.parentElement.tagName === 'MARK' || node.parentElement.closest('button, form, input, textarea')) {
            continue;
        }
        if (node.nodeValue.includes(searchText)) {
            nodesToProcess.push(node);
        }
    }
    
    nodesToProcess.forEach(textNode => {
        const val = textNode.nodeValue;
        const index = val.indexOf(searchText);
        if (index === -1) return;
        
        const before = val.substring(0, index);
        const match = val.substring(index, index + searchText.length);
        const after = val.substring(index + searchText.length);
        
        const fragment = document.createDocumentFragment();
        
        if (before) {
            fragment.appendChild(document.createTextNode(before));
        }
        
        const mark = document.createElement('mark');
        mark.className = `hl-${color}`;
        mark.setAttribute('data-id', id);
        mark.setAttribute('data-highlight', 'true');
        if (note) {
            mark.setAttribute('data-note', note);
            mark.setAttribute('title', note);
        }
        mark.textContent = match;
        fragment.appendChild(mark);
        
        if (after) {
            fragment.appendChild(document.createTextNode(after));
        }
        
        textNode.parentNode.replaceChild(fragment, textNode);
    });
}

/* ==========================================================================
   AUTHENTICATION & PROFILE HANDLING
   ========================================================================== */
async function checkAuthStatus() {
    try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
            const data = await res.json();
            if (data.authenticated) {
                state.currentUser = data.user;
            } else {
                state.currentUser = null;
            }
        }
    } catch (e) {
        console.warn('Gagal memverifikasi status autentikasi:', e);
        state.currentUser = null;
    }
    renderUserProfile();
}

function renderUserProfile() {
    const profileArea = document.getElementById('user-profile-area');
    if (!profileArea) return;

    if (state.currentUser) {
        profileArea.innerHTML = `
            <div class="user-avatar-wrapper" id="user-avatar-wrapper">
                <img src="${state.currentUser.picture || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}" alt="${state.currentUser.name}" class="user-avatar" id="user-avatar-img" />
                <div class="user-dropdown" id="user-dropdown">
                    <div style="font-size: 0.72rem; font-weight: 600; padding: 4px 8px; border-bottom: 1px solid var(--border); margin-bottom: 4px; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px;">
                        ${state.currentUser.name}
                    </div>
                    <button id="btn-profile-settings" class="dropdown-item">
                        <i data-lucide="settings"></i>
                        <span>Pengaturan</span>
                    </button>
                    <button id="btn-logout" class="dropdown-item">
                        <i data-lucide="log-out"></i>
                        <span>Keluar</span>
                    </button>
                </div>
            </div>
        `;
    } else {
        profileArea.innerHTML = `
            <div class="user-avatar-wrapper" id="user-avatar-wrapper">
                <div class="user-avatar" id="user-avatar-img" style="display: flex; align-items: center; justify-content: center; background: var(--bg-subtle); color: var(--text-2); cursor: pointer;">
                    <i data-lucide="user" style="width: 16px; height: 16px;"></i>
                </div>
                <div class="user-dropdown" id="user-dropdown">
                    <a href="/api/auth/google" class="dropdown-item" style="text-decoration: none;">
                        <i data-lucide="log-in"></i>
                        <span>Masuk</span>
                    </a>
                    <button id="btn-profile-settings" class="dropdown-item">
                        <i data-lucide="settings"></i>
                        <span>Pengaturan</span>
                    </button>
                </div>
            </div>
        `;
    }

    // Bind event listeners for the unified dropdown
    const avatarWrapper = document.getElementById('user-avatar-wrapper');
    const dropdown = document.getElementById('user-dropdown');
    
    if (avatarWrapper && dropdown) {
        avatarWrapper.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('open');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            dropdown.classList.remove('open');
        });
    }

    // Bind Settings Button
    const btnProfileSettings = document.getElementById('btn-profile-settings');
    if (btnProfileSettings) {
        btnProfileSettings.addEventListener('click', (e) => {
            e.stopPropagation();
            if (dropdown) dropdown.classList.remove('open');
            openSettingsModal();
        });
    }

    // Bind Logout Button (if logged in)
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', async (e) => {
            e.stopPropagation();
            try {
                const res = await fetch('/api/auth/logout', { method: 'POST' });
                if (res.ok) {
                    state.currentUser = null;
                    state.currentMindmapId = null;
                    localStorage.removeItem('current_mindmap_id');
                    window.location.reload();
                }
            } catch (err) {
                console.error('Logout failed:', err);
            }
        });
    }

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

/* ==========================================================================
   REDESIGN ROUTING & INTERACTIVE NAVIGATION STATE
   ========================================================================== */

function updateMobileHeaderTitle() {
    const brandLogo = document.querySelector('.brand-logo');
    if (brandLogo) {
        const mindmapView = document.getElementById('screen-mindmap-view');
        const isMindmapScreen = mindmapView && !mindmapView.classList.contains('hidden');
        if (isMindmapScreen && state.mindmapData && state.mindmapData.name) {
            brandLogo.textContent = state.mindmapData.name;
        } else {
            brandLogo.innerHTML = '<i data-lucide="brain" style="display: inline-block; vertical-align: middle; margin-right: 6px; width: 18px; height: 18px;"></i>Rabbit Hole';
            if (window.lucide) window.lucide.createIcons();
        }
    }
}

function switchScreen(screenName) {
    const tabs = {
        'search': { tabId: 'tab-search', viewId: 'screen-search-view' },
        'mindmaps': { tabId: 'tab-mindmaps', viewId: 'screen-mindmap-view' },
        'content': { tabId: 'tab-content', viewId: 'screen-content-view' },
        'dashboard': { tabId: 'tab-dashboard', viewId: 'screen-dashboard-view' }
    };
    
    const selected = tabs[screenName];
    if (!selected) return;
    
    // Remove active class from all tabs
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    // Add active class to selected tab
    const tabEl = document.getElementById(selected.tabId);
    if (tabEl) tabEl.classList.add('active');
    
    // Hide all screens
    document.querySelectorAll('.screen-container').forEach(screen => {
        if (screen.id) {
            screen.classList.add('hidden');
        }
    });
    // Show selected screen
    const viewEl = document.getElementById(selected.viewId);
    if (viewEl) viewEl.classList.remove('hidden');
    
    // If switching to mindmaps, trigger a zoom fit to ensure canvas is perfectly sized
    if (screenName === 'mindmaps' && typeof zoomFit === 'function') {
        setTimeout(zoomFit, 100);
    }
    
    // Sinkronisasi status aktif tombol navigasi bawah mobile
    document.querySelectorAll('.mobile-nav-item').forEach(item => item.classList.remove('active'));
    if (screenName === 'search') {
        const activeNav = document.getElementById('btn-mobile-nav-create');
        if (activeNav) activeNav.classList.add('active');
    } else if (screenName === 'mindmaps') {
        const activeNav = document.getElementById('btn-mobile-nav-mindmap');
        if (activeNav) activeNav.classList.add('active');
    } else if (screenName === 'dashboard') {
        const activeNav = document.getElementById('btn-mobile-nav-history');
        if (activeNav) activeNav.classList.add('active');
    }
    
    // Pastikan header & bottom nav terlihat saat ganti screen
    const header = document.querySelector('.global-header');
    const bottomNav = document.querySelector('.mobile-bottom-nav');
    if (header) header.classList.remove('header-hidden');
    if (bottomNav) bottomNav.classList.remove('nav-hidden');
    
    // Perbarui judul header mobile
    updateMobileHeaderTitle();
}

function switchDashboardSubview(subviewName) {
    const subviews = {
        'history': { menuItemId: 'history-menu-item-history', elementId: 'subview-history' },
        'exploration': { menuItemId: 'history-menu-item-exploration', elementId: 'subview-exploration' },
        'reader': { menuItemId: 'history-menu-item-reader', elementId: 'subview-reader' },
        'library': { menuItemId: 'history-menu-item-library', elementId: 'subview-library' },
        'bookmarks': { menuItemId: 'history-menu-item-bookmarks', elementId: 'subview-bookmarks' },
        'stats': { menuItemId: 'history-menu-item-stats', elementId: 'subview-stats' }
    };
    
    const selected = subviews[subviewName];
    if (!selected) return;
    
    // Remove active class from all dashboard sub-menu items
    document.querySelectorAll('.history-menu-item').forEach(btn => btn.classList.remove('active'));
    // Add active class to selected menu item
    const btnEl = document.getElementById(selected.menuItemId);
    if (btnEl) btnEl.classList.add('active');
    
    // Hide all subview content areas
    document.querySelectorAll('#screen-dashboard-view .history-main-content').forEach(view => {
        view.classList.add('hidden');
    });
    // Show selected subview
    const viewEl = document.getElementById(selected.elementId);
    if (viewEl) viewEl.classList.remove('hidden');
    
    // If switching to exploration, make sure icons are rendered
    if (subviewName === 'exploration' && window.lucide) {
        window.lucide.createIcons();
    }
    
    if (subviewName === 'library' && typeof window.renderLibraryGrid === 'function') {
        window.renderLibraryGrid();
    }
    if (subviewName === 'bookmarks' && typeof window.renderBookmarksList === 'function') {
        window.renderBookmarksList();
    }
    if (window.lucide) {
        window.lucide.createIcons();
    }
    
    // Pastikan header & bottom nav terlihat saat ganti subview
    const header = document.querySelector('.global-header');
    const bottomNav = document.querySelector('.mobile-bottom-nav');
    if (header) header.classList.remove('header-hidden');
    if (bottomNav) bottomNav.classList.remove('nav-hidden');
}

function initRedesignNavigation() {
    // 1. Hook Header Navigation Tabs
    const tabSearch = document.getElementById('tab-search');
    const tabMindmaps = document.getElementById('tab-mindmaps');
    const tabContent = document.getElementById('tab-content');
    const tabDashboard = document.getElementById('tab-dashboard');
    
    if (tabSearch) tabSearch.addEventListener('click', () => switchScreen('search'));
    if (tabMindmaps) tabMindmaps.addEventListener('click', () => switchScreen('mindmaps'));
    if (tabContent) tabContent.addEventListener('click', () => switchScreen('content'));
    if (tabDashboard) tabDashboard.addEventListener('click', () => switchScreen('dashboard'));

    // 1.8. Hook Mobile Bottom Navigation Items
    const btnMobileNavHistory = document.getElementById('btn-mobile-nav-history');
    const btnMobileNavMindmap = document.getElementById('btn-mobile-nav-mindmap');
    const btnMobileNavCreate = document.getElementById('btn-mobile-nav-create');
    
    if (btnMobileNavHistory) {
        btnMobileNavHistory.addEventListener('click', () => {
            closeDetailDrawer();
            switchScreen('dashboard');
            switchDashboardSubview('history');
        });
    }
    if (btnMobileNavMindmap) {
        btnMobileNavMindmap.addEventListener('click', () => {
            closeDetailDrawer();
            switchScreen('mindmaps');
        });
    }
    if (btnMobileNavCreate) {
        btnMobileNavCreate.addEventListener('click', () => {
            closeDetailDrawer();
            switchScreen('search');
            const chatInput = document.getElementById('chat-input');
            if (chatInput) setTimeout(() => chatInput.focus(), 150);
        });
    }
    
    // Hook Mobile Header Search & Floating Action Button
    const btnMobileHeaderSearch = document.getElementById('btn-mobile-header-search');
    const btnMobileFab = document.getElementById('btn-mobile-fab');
    
    if (btnMobileHeaderSearch) {
        btnMobileHeaderSearch.addEventListener('click', () => {
            switchScreen('search');
            const chatInput = document.getElementById('chat-input');
            if (chatInput) setTimeout(() => chatInput.focus(), 150);
        });
    }
    if (btnMobileFab) {
        btnMobileFab.addEventListener('click', () => {
            switchScreen('search');
            const chatInput = document.getElementById('chat-input');
            if (chatInput) setTimeout(() => chatInput.focus(), 150);
        });
    }

    // 1.5. Hook Dashboard Sub-sidebar Items
    const menuHistory = document.getElementById('history-menu-item-history');
    const menuExploration = document.getElementById('history-menu-item-exploration');
    const menuReader = document.getElementById('history-menu-item-reader');
    const menuLibrary = document.getElementById('history-menu-item-library');
    
    if (menuHistory) menuHistory.addEventListener('click', () => switchDashboardSubview('history'));
    if (menuExploration) menuExploration.addEventListener('click', () => switchDashboardSubview('exploration'));
    if (menuReader) menuReader.addEventListener('click', () => switchDashboardSubview('reader'));
    if (menuLibrary) menuLibrary.addEventListener('click', () => switchDashboardSubview('library'));
    
    const menuBookmarks = document.getElementById('history-menu-item-bookmarks');
    if (menuBookmarks) menuBookmarks.addEventListener('click', () => switchDashboardSubview('bookmarks'));

    const menuStats = document.getElementById('history-menu-item-stats');
    if (menuStats) menuStats.addEventListener('click', () => switchDashboardSubview('stats'));

    // Library category filters click binding
    document.querySelectorAll('.library-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.library-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (typeof window.renderLibraryGrid === 'function') {
                window.renderLibraryGrid();
            }
        });
    });
    
    // 2. Hook "New Research" Buttons
    const btnNewTopicSearch = document.getElementById('btn-new-topic');
    const btnNewTopicDashboard = document.getElementById('btn-new-topic-dashboard');
    
    if (btnNewTopicSearch) btnNewTopicSearch.addEventListener('click', () => switchScreen('search'));
    if (btnNewTopicDashboard) btnNewTopicDashboard.addEventListener('click', () => switchScreen('search'));
    
    // 3. Hook Suggested Pills
    const suggestedPills = document.querySelectorAll('.suggested-pill');
    suggestedPills.forEach(pill => {
        pill.addEventListener('click', (e) => {
            const inputEl = document.getElementById('chat-input');
            if (inputEl) {
                inputEl.value = pill.innerText.replace(/^[✨🧠💻🌱📊🧪🏛️] /, '').trim();
                handleChatSubmit(e);
            }
        });
    });
    
    // 3.6. Hook Dashboard Exploration Form
    const explorationForm = document.getElementById('dashboard-exploration-form');
    if (explorationForm) {
        explorationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputDashboard = document.getElementById('dashboard-exploration-input');
            const inputChat = document.getElementById('chat-input');
            if (inputDashboard && inputChat) {
                inputChat.value = inputDashboard.value;
                inputDashboard.value = '';
                handleChatSubmit(e);
            }
        });
    }

    // 3.7. Hook Dashboard Suggested Topic Pills
    const suggestedPillsDashboard = document.querySelectorAll('.suggested-pill-dashboard');
    suggestedPillsDashboard.forEach(pill => {
        pill.addEventListener('click', (e) => {
            const inputDashboard = document.getElementById('dashboard-exploration-input');
            const inputChat = document.getElementById('chat-input');
            if (inputDashboard && inputChat) {
                inputChat.value = pill.innerText.replace(/^[✨🧠💻🌱📊🧪🏛️] /, '').trim();
                inputDashboard.value = '';
                handleChatSubmit(e);
            }
        });
    });
    // 3.8. Hook Clear Searches Button
    const btnClearRecent = document.getElementById('btn-clear-recent-dashboard');
    if (btnClearRecent) {
        btnClearRecent.addEventListener('click', () => {
            const recentContainer = document.getElementById('recent-searches-dashboard-container');
            if (recentContainer) {
                recentContainer.innerHTML = `<div style="font-size: 0.78rem; color: var(--text-3); font-style: italic; padding: 0.5rem 0;">Belum ada pencarian terakhir</div>`;
            }
        });
    }
    
    const btnClearRecentMain = document.getElementById('btn-clear-recent');
    if (btnClearRecentMain) {
        btnClearRecentMain.addEventListener('click', () => {
            localStorage.setItem('recentSearches', JSON.stringify([]));
            renderRecentSearches();
        });
    }
    
    // Initialize dynamic recent searches (Task #5)
    renderRecentSearches();
    
    // 4. Set Default Screen
    if (state.mindmapData) {
        switchScreen('mindmaps');
        updateTableOfContents();
    } else {
        switchScreen('search');
    }
    
    // 5. Scroll Progress Listener for Mobile Reading (Task #4)
    const colMateri = document.querySelector('.drawer-col-materi');
    if (colMateri) {
        colMateri.addEventListener('scroll', () => {
            const scrollTop = colMateri.scrollTop;
            const scrollHeight = colMateri.scrollHeight;
            const clientHeight = colMateri.clientHeight;
            const totalScrollable = scrollHeight - clientHeight;
            
            let percent = 0;
            if (totalScrollable > 0) {
                percent = Math.round((scrollTop / totalScrollable) * 100);
            }
            
            const bar = document.getElementById('mobile-reading-progress-bar');
            const percentLabel = document.getElementById('mobile-reading-percent');
            const etaLabel = document.getElementById('mobile-reading-eta');
            
            if (bar) bar.style.width = `${percent}%`;
            if (percentLabel) percentLabel.textContent = `Bacaan: ${percent}%`;
            
            if (etaLabel) {
                const remainingMin = Math.max(1, Math.ceil((1 - (percent / 100)) * 4));
                etaLabel.textContent = percent === 100 ? 'Selesai' : `${remainingMin} min lagi`;
            }
        });
    }

    // 6. Mobile Drawer Back Button
    const mobileBackBtn = document.getElementById('btn-mobile-drawer-back');
    if (mobileBackBtn) {
        mobileBackBtn.addEventListener('click', () => {
            closeDetailDrawer();
        });
    }

    // 7. Scroll listener to auto-hide navbar and bottom bar on mobile scroll
    let lastScrollTops = new Map();
    document.addEventListener('scroll', (event) => {
        if (window.innerWidth > 768) return;
        
        let target = event.target;
        if (!target || !(target instanceof Element)) return;
        
        // ONLY apply this hide/show logic inside the detail/article page reader (.drawer-col-materi)
        if (!target.closest('.drawer-col-materi')) return;
        
        const scrollTop = target.scrollTop;
        const lastScrollTop = lastScrollTops.get(target) || 0;
        const delta = scrollTop - lastScrollTop;
        
        // Threshold check to avoid jittering
        if (Math.abs(delta) < 10) return;
        
        const header = document.querySelector('.global-header');
        const bottomNav = document.querySelector('.mobile-bottom-nav');
        
        if (scrollTop <= 20) {
            // Always show at the very top
            if (header) header.classList.remove('header-hidden');
            if (bottomNav) bottomNav.classList.remove('nav-hidden');
        } else if (delta > 0) {
            // Scroll down -> hide
            if (header) header.classList.add('header-hidden');
            if (bottomNav) bottomNav.classList.add('nav-hidden');
        } else {
            // Scroll up -> show
            if (header) header.classList.remove('header-hidden');
            if (bottomNav) bottomNav.classList.remove('nav-hidden');
        }
        
        lastScrollTops.set(target, scrollTop);
    }, true);
}

function updateTableOfContents() {
    const tocContainer = document.getElementById('redesign-toc-container');
    if (!tocContainer) return;
    
    tocContainer.innerHTML = '';
    
    if (!state.mindmapData) {
        tocContainer.innerHTML = `<div style="font-size:0.75rem; color:var(--text-3); padding:10px 12px; text-align:center;">No active research</div>`;
        return;
    }
    
    // Set Exploration Title in Content Sidebar
    const researchTitle = document.getElementById('sidebar-research-title');
    if (researchTitle) {
        researchTitle.innerText = state.mindmapData.name;
    }
    
    // Traverse hierarchical state.mindmapData to get pre-order list of nodes
    const nodeList = [];
    const traverse = (node, depth = 0) => {
        nodeList.push({ name: node.name, depth: depth, data: node });
        if (node.children) {
            node.children.forEach(c => traverse(c, depth + 1));
        }
    };
    traverse(state.mindmapData);
    
    nodeList.forEach(item => {
        const btn = document.createElement('button');
        const isActive = state.activeNode && state.activeNode.name === item.name;
        btn.className = `toc-item ${isActive ? 'active' : ''}`;
        
        // Add indentation margin based on node level/depth
        btn.style.paddingLeft = `${12 + item.depth * 12}px`;
        
        // Add indicator based on node status
        const status = state.nodeStatuses[item.name] || 'todo';
        let iconName = 'book';
        let iconColor = 'var(--text-3)';
        if (status === 'doing') {
            iconName = 'book-open';
            iconColor = 'var(--accent)';
        }
        if (status === 'done') {
            iconName = 'check-circle';
            iconColor = '#10b981';
        }
        
        btn.innerHTML = `<i data-lucide="${iconName}" style="width: 14px; height: 14px; margin-right: 6px; display: inline-block; vertical-align: middle; color: ${iconColor};"></i><span>${item.name}</span>`;
        
        btn.addEventListener('click', () => {
            selectAndOpenNode(item.name);
        });
        
        tocContainer.appendChild(btn);
    });
    if (window.lucide) window.lucide.createIcons();
}

function selectAndOpenNode(nodeName) {
    if (!rootNodeData) return;
    const foundD3Node = rootNodeData.descendants().find(d => d.data.name === nodeName);
    if (foundD3Node) {
        handleNodeClick(foundD3Node);
    }
}

/* ==========================================================================
   DYNAMIC RECENT SEARCHES (TASK #5)
   ========================================================================== */
function loadRecentSearches() {
    let searches = [];
    try {
        const stored = localStorage.getItem('recentSearches');
        if (stored) {
            searches = JSON.parse(stored);
        } else {
            searches = [
                "Neural architectures for LLMs",
                "Modernist architectural theory 1920-1940",
                "Quantum cryptography basics",
                "History of semantic web protocols"
            ];
            localStorage.setItem('recentSearches', JSON.stringify(searches));
        }
    } catch (e) {
        searches = [
            "Neural architectures for LLMs",
            "Modernist architectural theory 1920-1940",
            "Quantum cryptography basics",
            "History of semantic web protocols"
        ];
    }
    return searches;
}

function saveRecentSearch(query) {
    if (!query) return;
    let searches = loadRecentSearches();
    searches = searches.filter(s => s.toLowerCase() !== query.toLowerCase());
    searches.unshift(query);
    searches = searches.slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(searches));
    renderRecentSearches();
}

function renderRecentSearches() {
    const container = document.getElementById('recent-searches-container');
    if (!container) return;
    const searches = loadRecentSearches();
    container.innerHTML = '';
    
    if (searches.length === 0) {
        container.innerHTML = `<div class="empty-recent-searches" style="font-size: 0.85rem; color: var(--text-3); font-style: italic; padding: 0.5rem 0;">Belum ada riwayat pencarian</div>`;
        return;
    }
    
    searches.forEach(search => {
        const item = document.createElement('div');
        item.className = 'recent-search-item';
        
        item.innerHTML = `
            <i data-lucide="history" class="history-icon" style="width: 16px; height: 16px; margin-right: 12px; color: var(--text-3); flex-shrink: 0;"></i>
            <span class="recent-search-text" style="flex: 1; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${search}</span>
            <i data-lucide="chevron-right" class="arrow-icon" style="width: 16px; height: 16px; color: var(--text-3); flex-shrink: 0;"></i>
        `;
        
        item.addEventListener('click', (e) => {
            const chatInput = document.getElementById('chat-input');
            if (chatInput) {
                chatInput.value = search;
                handleChatSubmit(e);
            }
        });
        container.appendChild(item);
    });
    
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

/* ==========================================================================
   BREADCRUMB UI (Phase 3 M2)
   ========================================================================== */

/**
 * Render breadcrumb navigation bar berdasarkan state.breadcrumbs.
 * Breadcrumbs menunjukkan path dari root asli ke viewRoot saat ini.
 * Klik breadcrumb item -> paginate ke level itu.
 * Klik root icon -> resetPagination().
 */
function renderBreadcrumbs() {
    const bar = document.getElementById('breadcrumb-bar');
    if (!bar) return;

    const crumbs = state.breadcrumbs || [];

    if (crumbs.length === 0) {
        bar.classList.add('hidden');
        return;
    }

    bar.classList.remove('hidden');

    let html = '';

    // Root icon — always shown when breadcrumbs exist
    html += `<span class="breadcrumb-root" title="Kembali ke root" data-index="-1">🏠 Root</span>`;

    // Render each breadcrumb item
    crumbs.forEach((crumb, idx) => {
        const isLast = idx === crumbs.length - 1;
        html += `<span class="breadcrumb-sep">›</span>`;
        if (isLast) {
            // Last item = active / non-clickable
            html += `<span class="breadcrumb-item active">${escapeHtml(crumb.name)}</span>`;
        } else {
            html += `<span class="breadcrumb-item" data-index="${idx}">${escapeHtml(crumb.name)}</span>`;
        }
    });

    bar.innerHTML = html;

    // Attach click handlers
    bar.querySelectorAll('.breadcrumb-item[data-index]').forEach(el => {
        el.addEventListener('click', () => {
            const idx = parseInt(el.getAttribute('data-index'), 10);
            paginateToBreadcrumbIndex(idx);
        });
    });

    // Root click handler
    const rootEl = bar.querySelector('.breadcrumb-root');
    if (rootEl) {
        rootEl.addEventListener('click', () => {
            if (typeof resetPagination === 'function') {
                resetPagination();
            }
        });
    }

    // Auto-scroll to end
    bar.scrollLeft = bar.scrollWidth;
}

/**
 * Paginate ke breadcrumb pada index tertentu.
 * Semua breadcrumb setelah index itu dihapus.
 * @param {number} idx - Index breadcrumb tujuan
 */
function paginateToBreadcrumbIndex(idx) {
    if (idx < 0 || idx >= state.breadcrumbs.length) return;

    // Target node adalah breadcrumb[idx]
    const target = state.breadcrumbs[idx];
    state.breadcrumbs = state.breadcrumbs.slice(0, idx + 1);

    // Set viewRoot ke target node
    if (target.name === state.mindmapData.name) {
        state.viewRoot = null;
        if (typeof window.collapseDescendants === 'function') {
            window.collapseDescendants(state.mindmapData);
        }
    } else {
        state.viewRoot = findNodeByName(state.mindmapData, target.name);
        if (state.viewRoot) {
            state.viewRoot.collapsed = false;
            if (typeof window.collapseDescendants === 'function') {
                window.collapseDescendants(state.viewRoot);
            }
        }
    }

    renderBreadcrumbs();
    if (typeof updateMindmap === 'function') {
        updateMindmap(state.mindmapData);
    }
    setTimeout(() => {
        if (typeof zoomFit === 'function') {
            zoomFit();
        }
    }, 100);
    saveState(true);
}

/**
 * Escape HTML special characters untuk mencegah XSS di breadcrumb.
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}

/* ==========================================================================
   PHASE 10 & 11: PREMIUM LIBRARY & BOOKMARKS RENDERERS & ACTIONS
   ========================================================================== */

function openSaveToLibraryModal() {
    let overlay = document.getElementById('save-lib-modal-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'save-lib-modal-overlay';
        overlay.className = 'save-lib-modal-overlay';
        overlay.innerHTML = `
            <div class="save-lib-modal">
                <div class="save-lib-modal-header">
                    <h3>Simpan ke Library</h3>
                    <button class="save-lib-modal-close" id="btn-close-save-lib"><i data-lucide="x"></i></button>
                </div>
                <div class="save-lib-modal-body">
                    <div class="save-lib-modal-label">Pilih Kategori:</div>
                    <select class="save-lib-modal-select" id="save-lib-category-select">
                        <option value="Buku">Buku</option>
                        <option value="Jurnal">Jurnal Akademik</option>
                        <option value="Koleksi Pribadi">Koleksi Pribadi</option>
                    </select>
                </div>
                <div class="save-lib-modal-footer">
                    <button class="save-lib-btn-cancel" id="btn-cancel-save-lib">Batal</button>
                    <button class="save-lib-btn-save" id="btn-submit-save-lib">Simpan</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        
        // Bind events
        document.getElementById('btn-close-save-lib').addEventListener('click', closeSaveToLibraryModal);
        document.getElementById('btn-cancel-save-lib').addEventListener('click', closeSaveToLibraryModal);
        document.getElementById('btn-submit-save-lib').addEventListener('click', () => {
            const category = document.getElementById('save-lib-category-select').value;
            toggleLibraryState(state.currentMindmapId, category, false);
            showToast(state.language === 'en' ? 'Saved to library!' : 'Disimpan ke perpustakaan!');
            closeSaveToLibraryModal();
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeSaveToLibraryModal();
        });
    }
    
    // Check current category if already saved
    if (state.library) {
        const exists = state.library.find(item => item.id === state.currentMindmapId);
        if (exists) {
            document.getElementById('save-lib-category-select').value = exists.category || 'Buku';
        }
    }
    
    overlay.classList.add('open');
    if (window.lucide) window.lucide.createIcons();
}

function closeSaveToLibraryModal() {
    const overlay = document.getElementById('save-lib-modal-overlay');
    if (overlay) overlay.classList.remove('open');
}

function renderLibraryGrid() {
    const container = document.getElementById('library-grid-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Get active filter category
    const activeBtn = document.querySelector('.library-filter-btn.active');
    const activeCategory = activeBtn ? activeBtn.getAttribute('data-category') : 'all';
    
    // Filter library items
    const items = (state.library || []).filter(item => {
        if (activeCategory === 'all') return true;
        return item.category === activeCategory;
    });
    
    if (items.length === 0) {
        container.innerHTML = `
            <div style="font-size: 0.85rem; color: var(--text-3); text-align: center; padding: 5rem 0; width: 100%;">
                <i data-lucide="library" style="width: 48px; height: 48px; color: var(--border-color); margin-bottom: 12px; display: block; margin-left: auto; margin-right: auto;"></i>
                <div>${state.language === 'en' ? 'No curated materials found in this category.' : 'Belum ada materi terkurasi di kategori ini.'}</div>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
    }
    
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'library-card';
        
        // Count total nodes inside tree
        let totalNodes = 1;
        const countNodes = (n) => {
            let count = 1;
            if (n.children) {
                n.children.forEach(c => { count += countNodes(c); });
            }
            return count;
        };
        if (item.tree_data) {
            totalNodes = countNodes(item.tree_data);
        }
        
        // Count done progress
        const doneNodes = Object.values(item.node_statuses || {}).filter(s => s === 'done').length || 0;
        const progressPercent = Math.round((doneNodes / totalNodes) * 100) || 0;
        
        let dateStr = '';
        try {
            const date = new Date(item.saved_at || item.updated_at);
            dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        } catch (e) {
            dateStr = item.saved_at || '';
        }
        
        let displayCategory = item.category || 'Buku';
        if (displayCategory === 'Jurnal') displayCategory = 'Jurnal Akademik';
        
        card.innerHTML = `
            <div class="library-card-header">
                <span class="library-card-category-badge">${displayCategory}</span>
                <button class="library-card-remove-btn" title="Hapus dari Library" data-id="${item.id}">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
            <div class="library-card-title" title="${item.name}">${item.name}</div>
            
            <div class="card-progress-right" style="width: 100%; margin: 8px 0; display: block;">
                <div class="progress-bar-outer">
                    <div class="progress-bar-inner" style="width: ${progressPercent}%;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--text-3); margin-top: 4px;">
                    <span>Progress Belajar</span>
                    <span style="font-weight: 700; color: var(--text);">${progressPercent}%</span>
                </div>
            </div>
            
            <div class="library-card-meta">
                <div class="library-card-meta-item"><i data-lucide="calendar"></i><span>${dateStr}</span></div>
                <div class="library-card-meta-item"><i data-lucide="git-branch"></i><span>${totalNodes} Nodes</span></div>
            </div>
            
            <div class="library-card-actions">
                <button class="library-card-btn btn-export-notes" data-id="${item.id}"><i data-lucide="download"></i>Notes</button>
                <button class="library-card-btn btn-open-mm" data-id="${item.id}"><i data-lucide="external-link"></i>Buka</button>
            </div>
        `;
        
        // Open mindmap click
        card.querySelector('.btn-open-mm').addEventListener('click', (e) => {
            e.stopPropagation();
            loadMindmapById(item.id);
            switchScreen('mindmaps');
        });
        
        // Export notes click
        card.querySelector('.btn-export-notes').addEventListener('click', (e) => {
            e.stopPropagation();
            exportMindmapNotesToMarkdown(item);
        });
        
        // Remove from Library click
        card.querySelector('.library-card-remove-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(state.language === 'en' ? `Remove "${item.name}" from your library?` : `Hapus "${item.name}" dari perpustakaan Anda?`)) {
                toggleLibraryState(item.id, item.category, true);
                showToast(state.language === 'en' ? 'Removed from library' : 'Dihapus dari perpustakaan');
            }
        });
        
        container.appendChild(card);
    });
    
    if (window.lucide) window.lucide.createIcons();
}

function renderBookmarksList() {
    const container = document.getElementById('redesign-bookmarks-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!state.bookmarks || state.bookmarks.length === 0) {
        container.innerHTML = `
            <div style="font-size: 0.85rem; color: var(--text-3); text-align: center; padding: 5rem 0; width: 100%;">
                <i data-lucide="bookmark" style="width: 48px; height: 48px; color: var(--border-color); margin-bottom: 12px; display: block; margin-left: auto; margin-right: auto;"></i>
                <div>${state.language === 'en' ? 'No bookmarked articles yet.' : 'Belum ada penjelasan materi yang di-bookmark.'}</div>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
    }
    
    state.bookmarks.forEach(bm => {
        const card = document.createElement('div');
        card.className = 'bookmark-card';
        
        let dateStr = '';
        try {
            const date = new Date(bm.created_at);
            dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            dateStr = bm.created_at || '';
        }
        
        const rawSnippet = bm.explanation || 'Pilih "Buka Node" untuk membaca penjelasan mendalam mengenai topik ini.';
        const snippet = rawSnippet.replace(/[#*`]/g, '').trim().substring(0, 180) + '...';
        
        card.innerHTML = `
            <div class="bookmark-card-header">
                <span class="bookmark-card-path">${bm.mindmap_name || 'Mind Map'}</span>
                <span class="bookmark-card-time"><i data-lucide="clock"></i>${dateStr}</span>
            </div>
            <div class="bookmark-card-title">${bm.node_name}</div>
            <div class="bookmark-card-snippet">${snippet}</div>
            <div class="bookmark-card-meta">
                <button class="bookmark-card-remove-btn" data-mindmap="${bm.mindmap_id}" data-node="${bm.node_name}">
                    <i data-lucide="trash-2"></i><span>Hapus Bookmark</span>
                </button>
                <button class="bookmark-card-link-btn" data-mindmap="${bm.mindmap_id}" data-node="${bm.node_name}">
                    <i data-lucide="arrow-up-right"></i><span>Buka Node</span>
                </button>
            </div>
        `;
        
        // Remove click
        card.querySelector('.bookmark-card-remove-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleBookmarkState(bm.mindmap_id, bm.node_name, true);
            showToast(state.language === 'en' ? 'Bookmark removed' : 'Bookmark dihapus');
        });
        
        // Link to node click
        card.addEventListener('click', () => {
            loadMindmapById(bm.mindmap_id).then(() => {
                switchScreen('mindmaps');
                setTimeout(() => {
                    if (typeof selectAndOpenNode === 'function') {
                        selectAndOpenNode(bm.node_name);
                    }
                }, 400);
            });
        });
        
        card.querySelector('.bookmark-card-link-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            loadMindmapById(bm.mindmap_id).then(() => {
                switchScreen('mindmaps');
                setTimeout(() => {
                    if (typeof selectAndOpenNode === 'function') {
                        selectAndOpenNode(bm.node_name);
                    }
                }, 400);
            });
        });
        
        container.appendChild(card);
    });
    
    if (window.lucide) window.lucide.createIcons();
}

function exportMindmapNotesToMarkdown(item) {
    if (!item || !item.name) return;
    
    const tree = item.tree_data;
    const cache = item.node_cache || {};
    
    let markdown = `# 📚 Ringkasan Lengkap Belajar: ${item.name}\n\n`;
    markdown += `*Koleksi terkurasi dari Rabbithole Mindmap Learner*\n`;
    markdown += `*Kategori: ${item.category || 'Buku'} | Tanggal Ekspor: ${new Date().toLocaleDateString('id-ID')}*\n\n`;
    markdown += `---\n\n`;
    
    // Pre-order traversal to compile explanation
    const compileNotes = (node, path = []) => {
        const currentPath = [...path, node.name];
        const cacheData = cache[node.name];
        
        if (cacheData && cacheData.explanation) {
            markdown += `## 🧭 ${currentPath.join(' ➔ ')}\n\n`;
            markdown += `${cacheData.explanation}\n\n`;
            markdown += `---\n\n`;
        }
        
        if (node.children && node.children.length > 0) {
            node.children.forEach(c => compileNotes(c, currentPath));
        }
    };
    
    if (tree) {
        compileNotes(tree);
    } else {
        markdown += `*Tidak ada data catatan penjelasan.*`;
    }
    
    // Download Markdown File
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const link = document.createElement('a');
    const filename = `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_curated_notes.md`;
    
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Ekspos ke global window agar kompatibel dengan modul lain
window.getRandomStyleAndSubstyle = getRandomStyleAndSubstyle;
window.getWritingStyleInstruction = getWritingStyleInstruction;
window.initUIEventListeners = initUIEventListeners;
window.appendChatMessage = appendChatMessage;
window.openDetailDrawer = openDetailDrawer;
window.closeDetailDrawer = closeDetailDrawer;
window.renderDrawerLoading = renderDrawerLoading;
window.renderDrawerError = renderDrawerError;
window.renderNodeDetail = renderNodeDetail;
window.switchScreen = switchScreen;
window.loadHistoryList = loadHistoryList;
window.checkAuthStatus = checkAuthStatus;
window.updateTableOfContents = updateTableOfContents;
window.renderBreadcrumbs = renderBreadcrumbs;
window.paginateToBreadcrumbIndex = paginateToBreadcrumbIndex;
window.openSaveToLibraryModal = openSaveToLibraryModal;
window.closeSaveToLibraryModal = closeSaveToLibraryModal;
window.renderLibraryGrid = renderLibraryGrid;
window.renderBookmarksList = renderBookmarksList;
window.exportMindmapNotesToMarkdown = exportMindmapNotesToMarkdown;

