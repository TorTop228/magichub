import React, { useState, useEffect, useRef } from 'react';
import './CharacterCreator.css';

// === CONSTANTS ===
const EXPORT_W = 990;
const EXPORT_H = 594;
const PREVIEW_AR = EXPORT_W / EXPORT_H;

const ASSETS = {
    backgrounds: [
        { id: 1, src: '/images/backgrounds/1.png' },
        { id: 2, src: '/images/backgrounds/2.png' },
        { id: 3, src: '/images/backgrounds/3.png' },
        { id: 4, src: '/images/backgrounds/4.png' },
    ],
    base: [
        { id: 1, src: '/images/base/1.png' },
        { id: 2, src: '/images/base/2.png' },
        { id: 3, src: '/images/base/3.png' },
        { id: 4, src: '/images/base/4.png' }
    ],
    body: [
        { id: 1, src: '/images/body/1.png' },
        { id: 2, src: '/images/body/2.png' },
        { id: 3, src: '/images/body/3.png' },
        { id: 4, src: '/images/body/4.png' }
    ],
    clothes: [
        { id: 1, src: '/images/clothes/1.png' },
        { id: 2, src: '/images/clothes/2.png' },
        { id: 3, src: '/images/clothes/3.png' },
        { id: 4, src: '/images/clothes/4.png' },
        { id: 5, src: '/images/clothes/5.png' },
        { id: 6, src: '/images/clothes/6.png' },
        { id: 7, src: '/images/clothes/7.png' },
        { id: 8, src: '/images/clothes/8.png' }
    ],
    face: [
        { id: 1, src: '/images/face/1.png' },
        { id: 2, src: '/images/face/2.png' },
        { id: 3, src: '/images/face/3.png' },
        { id: 4, src: '/images/face/4.png' }
    ],
    hair: [
        { id: 1, src: '/images/hair/1.png' },
        { id: 2, src: '/images/hair/2.png' },
        { id: 3, src: '/images/hair/3.png' },
        { id: 4, src: '/images/hair/4.png' },
        { id: 5, src: '/images/hair/5.png' },
        { id: 6, src: '/images/hair/6.png' },
        { id: 7, src: '/images/hair/7.png' },
        { id: 8, src: '/images/hair/8.png' },
        { id: 9, src: '/images/hair/9.png' }
    ],
    hat: [
        { id: 1, src: '/images/hat/1.png' },
        { id: 2, src: '/images/hat/2.png' },
        { id: 3, src: '/images/hat/3.png' }
    ],
    hearts: [
        { id: 1, src: '/images/hearts/1.png' },
        { id: 2, src: '/images/hearts/2.png' },
        { id: 3, src: '/images/hearts/3.png' },
        { id: 4, src: '/images/hearts/4.png' }
    ]
};

const CharacterCreator = () => {
    const [selectedBg, setSelectedBg] = useState(ASSETS.backgrounds[0]);
    const [selectedBase, setSelectedBase] = useState(ASSETS.base[0]);
    const [selectedBody, setSelectedBody] = useState(ASSETS.body[0]);
    const [selectedClothes, setSelectedClothes] = useState(ASSETS.clothes[0]);
    const [selectedFace, setSelectedFace] = useState(ASSETS.face[0]);
    const [selectedHair, setSelectedHair] = useState(ASSETS.hair[0]);
    const [selectedHat, setSelectedHat] = useState(ASSETS.hat[0]);
    const [selectedHearts, setSelectedHearts] = useState(ASSETS.hearts[0]);

    const [name, setName] = useState('From:');
    const [description, setDescription] = useState('To:');
    const [message, setMessage] = useState("Happy Valentine's Day!");

    const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

    // ─── DPR compensation ─────────────────────────────────────────────────────
    //
    // hub-styles.css применяет transform: scale(1/dpr) на #dpr-scale-root,
    // чтобы компенсировать масштаб Windows (125%/150%/200%).
    // Это сжимает конструктор вместе со всем остальным.
    //
    // Решение: вычисляем тот же коэффициент и применяем обратный zoom
    // только на .character-creator-wrapper — он нейтрализует родительский scale.
    //
    // zoom работает иначе чем transform: scale —
    // он пересчитывает layout и не ломает дочерние элементы.
    const wrapperRef = useRef(null);

    useEffect(() => {
        // Сохраняем текущую позицию
        const scrollY = window.scrollY;

        // Фиксируем body и сбрасываем скролл
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.overflow = 'hidden';
        document.body.style.width = '100%';
        document.body.style.height = '100%';

        // Находим и убиваем скролл у всех родительских контейнеров
        let parent = wrapperRef.current?.parentElement;
        while (parent) {
            parent.style.overflow = 'hidden';
            parent.style.overflowY = 'hidden';
            parent.style.overflowX = 'hidden';
            parent = parent.parentElement;
        }

        const applyZoom = () => {
            if (!wrapperRef.current) return;

            const root = document.getElementById('dpr-scale-root');
            let dprScale = 1;

            if (root) {
                const val = getComputedStyle(root).getPropertyValue('--dpr-scale').trim();
                const parsed = parseFloat(val);
                if (!isNaN(parsed) && parsed > 0) dprScale = parsed;
            } else {
                const dpr = window.devicePixelRatio || 1;
                const steps = [1, 1.25, 1.5, 1.75, 2];
                const nearest = steps.reduce((a, b) =>
                    Math.abs(b - dpr) < Math.abs(a - dpr) ? b : a
                );
                dprScale = 1 / nearest;
            }

            const zoom = dprScale === 1 ? 1 : (1 / dprScale);
            wrapperRef.current.style.zoom = zoom === 1 ? '' : String(zoom);
        };

        applyZoom();
        window.addEventListener('resize', applyZoom);

        return () => {
            // Возвращаем скролл обратно
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.overflow = '';
            document.body.style.width = '';
            document.body.style.height = '';

            window.scrollTo(0, scrollY);

            let parent = wrapperRef.current?.parentElement;
            while (parent) {
                parent.style.overflow = '';
                parent.style.overflowY = '';
                parent.style.overflowX = '';
                parent = parent.parentElement;
            }

            window.removeEventListener('resize', applyZoom);
        };
    }, []);

    // ─── Handlers ────────────────────────────────────────────────────────────

    const handleMessageChange = (e) => {
        const val = e.target.value;
        if (val.split('\n').length > 6) return;
        if (val.length > 120) return;  // ~20 символов × 6 строк
        setMessage(val);
    };

    const randomize = () => {
        const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
        setSelectedBg(pick(ASSETS.backgrounds));
        setSelectedBase(pick(ASSETS.base));
        setSelectedBody(pick(ASSETS.body));
        setSelectedFace(pick(ASSETS.face));
        setSelectedClothes(pick(ASSETS.clothes));
        setSelectedHair(pick(ASSETS.hair));
        setSelectedHat(pick(ASSETS.hat));
        setSelectedHearts(pick(ASSETS.hearts));
    };

    // ─── Canvas rendering (native, без html2canvas) ───────────────────────────
    //
    // Используем нативный Canvas API напрямую — рисуем img-элементы и текст
    // вручную. Это полностью обходит проблему родительского transform: scale
    // в #dpr-scale-root, которая ломала html2canvas.

    /** Загружает изображение по src и возвращает HTMLImageElement */
    const loadImage = (src) =>
        new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load: ${src}`));
            img.src = src;
        });

    /**
     * Рисует одну картинку на canvas по тем же правилам, что CSS-класс слоя.
     * Все координаты — в процентах от EXPORT_W × EXPORT_H, точно как в CSS.
     */
    const drawLayer = (ctx, img, layerClass) => {
        const W = EXPORT_W;
        const H = EXPORT_H;
        ctx.save();

        if (layerClass === 'layer-bg') {
            // object-fit: cover — заполняем весь холст
            ctx.drawImage(img, 0, 0, W, H);

        } else if (layerClass === 'layer-base') {
            // height: 120%, top: 48%, left: 50%, translate(-50%, -50%)
            const h = H * 1.20;
            const w = (img.naturalWidth / img.naturalHeight) * h;
            const x = W * 0.50 - w / 2;
            const y = H * 0.48 - h / 2;
            ctx.drawImage(img, x, y, w, h);

        } else if (layerClass === 'layer-face') {
            // height: 20%, left: 39.5%, top: 40%, translate(-50%,-50%)
            const h = H * 0.20;
            const w = (img.naturalWidth / img.naturalHeight) * h;
            const x = W * 0.395 - w / 2;
            const y = H * 0.40 - h / 2;
            ctx.drawImage(img, x, y, w, h);

        } else if (layerClass === 'layer-body') {
            // height: 90%, left: 40%, top: 50%, translate(-50%,-50%)
            const h = H * 0.90;
            const w = (img.naturalWidth / img.naturalHeight) * h;
            const x = W * 0.40 - w / 2;
            const y = H * 0.50 - h / 2;
            ctx.drawImage(img, x, y, w, h);

        } else if (layerClass === 'layer-clothes') {
            const h = H * 0.90;
            const w = (img.naturalWidth / img.naturalHeight) * h;
            const x = W * 0.40 - w / 2;
            const y = H * 0.50 - h / 2;
            ctx.drawImage(img, x, y, w, h);

        } else if (layerClass === 'layer-hair') {
            const h = H * 0.90;
            const w = (img.naturalWidth / img.naturalHeight) * h;
            const x = W * 0.40 - w / 2;
            const y = H * 0.50 - h / 2;
            ctx.drawImage(img, x, y, w, h);

        } else if (layerClass === 'layer-hat') {
            const h = H * 0.90;
            const w = (img.naturalWidth / img.naturalHeight) * h;
            const x = W * 0.40 - w / 2;
            const y = H * 0.50 - h / 2;
            ctx.drawImage(img, x, y, w, h);

        } else if (layerClass === 'layer-hearts') {
            // height: 80%, top: 10%, left: 19%
            const h = H * 0.80;
            const w = (img.naturalWidth / img.naturalHeight) * h;
            const x = W * 0.23;
            const y = H * 0.10;
            ctx.drawImage(img, x, y, w, h);
        }

        ctx.restore();
    };

    /**
     * Рисует текстовые поля поверх слоёв.
     * Позиции совпадают с CSS: name — bottom:3% left:3%,
     * extra — bottom:3% right:3%, textarea — right:3% top:15%.
     */
    const drawTexts = (ctx) => {
        const W = EXPORT_W;
        const H = EXPORT_H;
        const fontSize = Math.round(W * 0.022); // ~22px при 990px

        ctx.font = `${fontSize}px 'Indie Flower', cursive`;
        ctx.fillStyle = '#c71585';
        ctx.textBaseline = 'middle';

        // Фон-плашка для полей
        const drawFieldBg = (x, y, w, h) => {
            ctx.save();
            ctx.fillStyle = 'rgba(255,255,255,0.82)';
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, 8);
            ctx.fill();
            // нижняя граница
            ctx.strokeStyle = '#ff69b4';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x, y + h);
            ctx.lineTo(x + w, y + h);
            ctx.stroke();
            ctx.restore();
        };

        const padX = W * 0.012;
        const padY = H * 0.012;
        const fldH = fontSize * 2.4;
        const fldW = W * 0.20;

        // FROM — bottom: 3%, left: 3%
        const fromX = W * 0.03;
        const fromY = H - H * 0.03 - fldH;
        drawFieldBg(fromX, fromY, fldW, fldH);
        ctx.fillStyle = '#c71585';
        ctx.fillText(name || 'From:', fromX + padX, fromY + fldH / 2);

        // TO — bottom: 3%, right: 3%
        const toW = W * 0.20;
        const toX = W - W * 0.03 - toW;
        const toY = H - H * 0.03 - fldH;
        drawFieldBg(toX, toY, toW, fldH);
        ctx.fillStyle = '#c71585';
        ctx.fillText(description || 'To:', toX + padX, toY + fldH / 2);

        // TEXTAREA — right: 3%, top: 15%, width: 28%, min-height: 50%
        const taX = W * (1 - 0.3 - 0.2);
        const taY = H * 0.19;
        const taW = W * 0.2;
        const taH = H * 0.40;
        const lineH = fontSize * 1.6;

        ctx.save();
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.beginPath();
        ctx.roundRect(taX, taY, taW, taH, 16);
        ctx.fill();
        ctx.strokeStyle = '#ffb6c1';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#c71585';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        // Разбиваем текст на строки с word-wrap:
        // 1) Пользователь мог нажать Enter — это явные переносы
        // 2) Внутри каждой строки слова переносятся если не влезают в taW
        const padding = W * 0.015;
        const maxLineW = taW - padding * 2;

        const wrapLine = (rawLine) => {
            const words = rawLine.split(' ');
            const wrapped = [];
            let current = '';
            for (const word of words) {
                const test = current ? current + ' ' + word : word;
                if (ctx.measureText(test).width > maxLineW && current) {
                    wrapped.push(current);
                    current = word;
                } else {
                    current = test;
                }
            }
            if (current) wrapped.push(current);
            return wrapped.length ? wrapped : [''];
        };

        const userLines = (message || '').split('\n');
        const allLines = userLines.flatMap(wrapLine);

        // Клиппируем рисование строго внутри рамки textarea
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(taX, taY, taW, taH, 16);
        ctx.clip();

        const totalTextH = allLines.length * lineH;
        const textStartY = taY + Math.max(padding, (taH - totalTextH) / 2);
        allLines.forEach((line, i) => {
            ctx.fillText(line, taX + taW / 2, textStartY + i * lineH);
        });

        ctx.restore();
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
    };

    /**
     * Главная функция рендера — строит offscreen canvas 990×594
     * полностью независимо от DOM-трансформаций родителя.
     */
    const buildCanvas = async () => {
        // Убеждаемся что шрифт загружен, иначе canvas нарисует его дефолтным
        await document.fonts.load(`22px 'Indie Flower'`);

        const canvas = document.createElement('canvas');
        canvas.width = EXPORT_W;
        canvas.height = EXPORT_H;
        const ctx = canvas.getContext('2d');

        // Слои в порядке z-index
        const layers = [
            { src: selectedBg.src, cls: 'layer-bg' },
            { src: selectedBase.src, cls: 'layer-base' },
            { src: selectedBody.src, cls: 'layer-body' },
            { src: selectedFace.src, cls: 'layer-face' },
            { src: selectedClothes.src, cls: 'layer-clothes' },
            { src: selectedHair.src, cls: 'layer-hair' },
            { src: selectedHat.src, cls: 'layer-hat' },
            { src: selectedHearts.src, cls: 'layer-hearts' },
        ];

        // Загружаем все картинки параллельно
        const images = await Promise.all(layers.map(l => loadImage(l.src)));

        // Рисуем слои
        images.forEach((img, i) => drawLayer(ctx, img, layers[i].cls));

        // Рисуем текст поверх
        drawTexts(ctx);

        return canvas;
    };

    // ─── Save / Share ─────────────────────────────────────────────────────────

    const saveCharacter = async () => {
        try {
            const canvas = await buildCanvas();
            const link = document.createElement('a');
            link.download = `valentine_${name.replace(/[^a-z0-9]/gi, '_')}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error('Save error:', err);
            alert('Ошибка при сохранении. Попробуй ещё раз.');
        }
    };

    const shareToTwitter = async () => {
        try {
            const canvas = await buildCanvas();
            const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));

            try {
                await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                alert('✅ The image has been copied!\n\nTwitter will open — press Ctrl+V (Cmd+V) to paste.');
            } catch {
                // Clipboard API недоступен — скачиваем
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = `valentine_${Date.now()}.png`;
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);
                alert('📥 Image downloaded!\n\nTwitter will open — attach the file manually.');
            }

            setTimeout(() => {
                const text = encodeURIComponent("A little magic for Valentine’s Day 💘༉‧₊˚.\n\nMade with The @magicblock Valentine Creator\n\nby @cryptoo_tor & @wtf4uk\n\nBuild yours → https://magichub-nine.vercel.app");
                window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
            }, 1000);
        } catch (err) {
            console.error('Share error:', err);
            alert('Ошибка при создании изображения. Попробуй ещё раз.');
        }
    };

    // ─── Sections config ──────────────────────────────────────────────────────

    const sections = [
        { title: 'Background', data: ASSETS.backgrounds, current: selectedBg, setter: setSelectedBg },
        { title: 'Base', data: ASSETS.base, current: selectedBase, setter: setSelectedBase },
        { title: 'Body', data: ASSETS.body, current: selectedBody, setter: setSelectedBody },
        { title: 'Face', data: ASSETS.face, current: selectedFace, setter: setSelectedFace },
        { title: 'Clothes', data: ASSETS.clothes, current: selectedClothes, setter: setSelectedClothes },
        { title: 'Hair', data: ASSETS.hair, current: selectedHair, setter: setSelectedHair },
        { title: 'Hat', data: ASSETS.hat, current: selectedHat, setter: setSelectedHat },
        { title: 'Hearts', data: ASSETS.hearts, current: selectedHearts, setter: setSelectedHearts },
    ];

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="character-creator-wrapper" ref={wrapperRef}>

            {/* Welcome overlay */}
            {!hasSeenWelcome && (
                <div className="welcome-overlay">
                    <div className="welcome-card">
                        <h2>❤️ Welcome to Valentine Card Creator! ❤️</h2>
                        <p>Create a cute valentine in one minute: pick a character, clothes, background, hearts, and write a sweet message 💌</p>
                        <p>Everything is ready to download!</p>
                        <div className="welcome-creators">
                            <p>
                                Made with love by:{' '}
                                <a href="https://x.com/cryptoo_tor" target="_blank" rel="noopener noreferrer" className="creator-twitter-link">Tor00_1</a>
                                {' × '}
                                <a href="https://x.com/wtf4uk" target="_blank" rel="noopener noreferrer" className="creator-twitter-link">Wtf4uk</a>
                            </p>
                        </div>
                        <button className="welcome-close-btn" onClick={() => setHasSeenWelcome(true)}>
                            Start creating ❤️
                        </button>
                    </div>
                </div>
            )}

            <div className="creator-container">

                {/* ── LEFT: Preview ── */}
                {/*
                    Структура stage-panel → stage-area → stage-wrap → stage
                    повторяет паттерн reference-сайта.
                    CSS-переменные задают целевое разрешение для scale-расчётов.
                */}
                <div
                    className="stage-panel"
                    style={{
                        '--preview-w': `${EXPORT_W}px`,
                        '--preview-h': `${EXPORT_H}px`,
                        '--preview-ar': PREVIEW_AR,
                    }}
                >
                    <div className="stage-area">
                        <div className="stage-wrap" aria-label="Card preview">
                            {/* ✅ Нативный рендер — ref больше не нужен */}
                            <div className="stage">
                                <img src={selectedBg.src} className="layer layer-bg" alt="Background" draggable="false" />
                                <img src={selectedBase.src} className="layer layer-base" alt="Base" draggable="false" />
                                <img src={selectedBody.src} className="layer layer-body" alt="Body" draggable="false" />
                                <img src={selectedFace.src} className="layer layer-face" alt="Face" draggable="false" />
                                <img src={selectedClothes.src} className="layer layer-clothes" alt="Clothes" draggable="false" />
                                <img src={selectedHair.src} className="layer layer-hair" alt="Hair" draggable="false" />
                                <img src={selectedHat.src} className="layer layer-hat" alt="Hat" draggable="false" />
                                <img src={selectedHearts.src} className="layer layer-hearts" alt="Hearts" draggable="false" />

                                {/* Текстовые поля внутри .stage — позиционируются в % */}
                                <div className="text-overlay text-overlay--from">
                                    <input
                                        type="text"
                                        className="creator-name-input"
                                        value={name}
                                        maxLength={45}
                                        onChange={(e) => setName(e.target.value.slice(0, 45))}
                                    />
                                </div>

                                <input
                                    type="text"
                                    className="creator-extra-text-input"
                                    value={description}
                                    maxLength={45}
                                    onChange={(e) => setDescription(e.target.value.slice(0, 45))}
                                />

                                <textarea
                                    className="creator-center-textarea"
                                    value={message}
                                    onChange={handleMessageChange}
                                    placeholder="Write your message…"
                                    rows={6}
                                    maxLength={120}
                                    style={{ overflow: 'hidden', resize: 'none' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT: Controls ── */}
                <div className="creator-controls-wrapper">
                    <div className="creator-main-actions">
                        <button className="creator-random-btn" onClick={randomize}>🎲 Random</button>
                        <button className="creator-save-btn" onClick={saveCharacter}>💾 Save</button>
                        <button className="creator-share-btn" onClick={shareToTwitter}>🐦 Share</button>
                    </div>

                    <div className="creator-controls-panel">
                        {sections.map((section) => (
                            <div className="creator-section" key={section.title}>
                                <div className="creator-section-title">{section.title}</div>
                                <div className="creator-options-grid">
                                    {section.data.map((item) => (
                                        <button
                                            key={item.id}
                                            className={`creator-option-btn ${section.current.id === item.id ? 'active' : ''}`}
                                            onClick={() => section.setter(item)}
                                            aria-pressed={section.current.id === item.id}
                                        >
                                            <img src={item.src} alt={`${section.title} ${item.id}`} loading="lazy" draggable="false" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="creator-footer">
                <p>
                    💕 Made with love:{' '}
                    <a href="https://x.com/cryptoo_tor" target="_blank" rel="noopener noreferrer" className="creator-twitter-link">Tor00_1</a>
                    {' × '}
                    <a href="https://x.com/wtf4uk" target="_blank" rel="noopener noreferrer" className="creator-twitter-link">Wtf4uk</a>
                    {' 💕'}
                </p>
            </div>

        </div>
    );
};

export default CharacterCreator;