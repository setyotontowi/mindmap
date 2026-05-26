/* ==========================================================================
   9ROUTER API CLIENT (OpenAI Compatible via Backend Proxy)
   ========================================================================== */
function getSystemInstructions() {
    if (state.language === 'en') {
        return `You are an expert tutor and professional learning architect. Your task is to help the user learn any topic through dynamic, structured mindmaps and interactive, deep-dive learning guides.`;
    }
    return `Anda adalah tutor ahli dan arsitek pembelajaran profesional. Tugas Anda adalah membantu pengguna mempelajari topik apa saja melalui peta pikiran (mindmap) terstruktur yang dinamis dan panduan belajar mendalam (deep dive) dalam Bahasa Indonesia yang interaktif.`;
}

async function callRouterAI(prompt, systemInstruction = null) {
    if (!systemInstruction) {
        systemInstruction = getSystemInstructions();
    }
    
    // API Key warning check. Since we have backend fallback, we only warn if both are empty.
    // However, if state.apiKey is not present, we will let the proxy handle it or open the settings.
    // Let's allow calling without state.apiKey if backend process.env has it.
    
    const url = '/api/ai/completions';

    const requestBody = {
        messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
        stream: false,
        max_tokens: 8192,
        provider: state.aiProvider || 'gemini',
        model: state.aiModel || 'gemini-2.5-flash'
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errText = await response.text();
            let errMsg = 'Gagal terhubung ke AI Proxy API';
            try {
                const errData = JSON.parse(errText);
                errMsg = errData.error?.message || errMsg;
            } catch (e) {
                errMsg = errText || errMsg;
            }
            throw new Error(errMsg);
        }

        const rawText = await response.text();
        let jsonText = '';

        // Deteksi jika respon berupa format Server-Sent Events (SSE) stream
        if (rawText.trim().startsWith('data:')) {
            const lines = rawText.split('\n');
            for (const line of lines) {
                const cleanLine = line.trim();
                if (!cleanLine) continue;
                if (cleanLine.startsWith('data:')) {
                    const dataStr = cleanLine.replace(/^data:\s*/, '');
                    if (dataStr === '[DONE]') continue;
                    try {
                        const chunk = JSON.parse(dataStr);
                        const content = chunk.choices?.[0]?.delta?.content || chunk.choices?.[0]?.message?.content || '';
                        jsonText += content;
                    } catch (err) {
                        console.warn('Gagal memparsing chunk:', err, dataStr);
                    }
                }
            }
        } else {
            // Respon JSON standar
            const data = JSON.parse(rawText);
            jsonText = data.choices[0].message.content;
        }

        // Antisipasi jika LLM membungkus JSON dengan markdown code blocks ```json ... ```
        let cleanJsonText = jsonText.trim();
        if (cleanJsonText.startsWith('```')) {
            cleanJsonText = cleanJsonText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
        }

        return JSON.parse(cleanJsonText);
    } catch (error) {
        console.error('AI Proxy API Error:', error);
        throw error;
    }
}

