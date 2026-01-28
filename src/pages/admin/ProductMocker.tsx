import { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Download, Upload, ZoomIn, ZoomOut, Move, Image as ImageIcon, Layers } from 'lucide-react';

const TEMPLATES = [
    {
        id: 'boot',
        name: 'Boot - Living Room',
        src: '/templates/boot_case_empty.png',
        overlay: null,
        type: 'square'
    },
    {
        id: 'boot-navy',
        name: 'Boot - Navy Studio',
        src: '/templates/boot_case_navy_empty.png',
        overlay: null,
        type: 'square'
    },
    {
        id: 'shirt',
        name: 'Shirt - Living Room',
        src: '/templates/shirt_frame_empty.png',
        overlay: null,
        type: 'square'
    },
    {
        id: 'shirt-navy',
        name: 'Shirt - Navy Studio',
        src: '/templates/shirt_frame_navy_empty.png',
        overlay: null,
        type: 'square'
    },
    {
        id: 'poster',
        name: 'Poster - Living Room',
        src: '/templates/poster_frame_empty.png',
        overlay: null,
        type: 'square'
    },
    {
        id: 'poster-navy',
        name: 'Poster - Navy Studio',
        src: '/templates/poster_frame_navy_empty.png',
        overlay: null,
        type: 'square'
    }
];

export function ProductMocker() {
    const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Canvas Refs
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setUploadedImage(event.target?.result as string);
                // Reset transform
                setScale(1);
                setPosition({ x: 0, y: 0 });
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleDownload = () => {
        if (!canvasRef.current) return;

        // Create a temporary link
        const link = document.createElement('a');
        link.download = `product-mockup-${selectedTemplate.id}-${Date.now()}.png`;
        link.href = canvasRef.current.toDataURL('image/png', 1.0);
        link.click();
    };

    // Draw Loop
    // In a real app we might use `useEffect` to draw whenever state changes
    // ideally with requestAnimationFrame for smoothness, but simple effect is fine here.
    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Draw Template Background
        const bgImg = new Image();
        bgImg.src = selectedTemplate.src;

        // We need to wait for image load if not cached, but for this reactive cycle
        // we assume it loads or we use an onLoad handler.
        // For simplicity in this demo, let's assume images are primed or handle async roughly.
        // A better way is to load images into state/refs.

        if (bgImg.complete) {
            ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        } else {
            bgImg.onload = () => ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        }

        // 2. Draw User Image (Middle Layer)
        if (uploadedImage) {
            const userImg = new Image();
            userImg.src = uploadedImage;

            // Render logic
            const renderUserImg = () => {
                ctx.save();

                // For a boot case, we ideally want to mask it to the "inside" area.
                // For now, we rely on the user scaling/positioning it "on" the table/grass.

                // Move to center to scale/rotate
                const centerX = canvas.width / 2 + position.x;
                const centerY = canvas.height / 2 + position.y;

                ctx.translate(centerX, centerY);
                ctx.scale(scale, scale);

                // Draw centered
                // We want to maintain aspect ratio but fit it reasonably initially
                // For now, just draw native size centered
                ctx.drawImage(userImg, -userImg.width / 2, -userImg.height / 2);

                ctx.restore();

                // Redraw background overlay if we had one (e.g. glass glints)
                // if (selectedTemplate.overlay) ...
            };

            if (userImg.complete) {
                renderUserImg();
            } else {
                userImg.onload = renderUserImg;
            }
        }
    };

    // Trigger draw on changes
    // Note: This is a bit inefficient (Creating new Image objects) but suffices for this mock tool.
    // In production, preload images.
    useState(() => {
        // Initial load
        setTimeout(draw, 100);
    });

    // Re-draw when dependencies change
    // Using a timeout to ensure images are ready/state is settled
    setTimeout(draw, 0);


    // Mouse Handlers for Dragging
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => setIsDragging(false);


    return (
        <div className="min-h-screen bg-ivory text-charcoal pt-24 pb-12 px-4 md:px-8">
            <Helmet>
                <title>Product Image Mocker | Admin</title>
                <meta name="robots" content="noindex" />
            </Helmet>

            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="font-serif text-3xl text-navy">Product Image Mocker</h1>
                        <p className="text-charcoal/60">Generate standardized shopify product asset images.</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleDownload}
                            className={`bg-navy text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-navy/90 transition-all shadow-lg shadow-navy/20 ${!uploadedImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={!uploadedImage}
                        >
                            <Download className="w-5 h-5" />
                            Download Asset
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Controls Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Template Selection */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-navy/5">
                            <h3 className="font-bold text-navy text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Layers className="w-4 h-4" /> 1. Select Scenario
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                                {TEMPLATES.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setSelectedTemplate(t)}
                                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left group ${selectedTemplate.id === t.id
                                            ? 'bg-navy/5 border-navy/30 ring-1 ring-navy/10'
                                            : 'bg-ivory border-transparent hover:bg-ivory/80'
                                            }`}
                                    >
                                        <img src={t.src} className="w-12 h-12 object-cover rounded border border-navy/10" alt={t.name} />
                                        <div>
                                            <p className={`font-bold text-sm ${selectedTemplate.id === t.id ? 'text-navy' : 'text-charcoal/70'}`}>{t.name}</p>
                                            <p className="text-[10px] text-charcoal/40 uppercase tracking-wider">{t.type} Asset</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Upload */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-navy/5">
                            <h3 className="font-bold text-navy text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Upload className="w-4 h-4" /> 2. Upload Product
                            </h3>
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-navy/20 rounded-lg cursor-pointer hover:bg-navy/5 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <ImageIcon className="w-8 h-8 text-charcoal/30 mb-2" />
                                    <p className="text-sm text-charcoal/60"><span className="font-bold text-navy">Click to upload</span> raw item</p>
                                    <p className="text-xs text-charcoal/40 mt-1">PNG (Transparent) recommended</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        </div>

                        {/* Adjustments */}
                        {uploadedImage && (
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-navy/5 animate-in fade-in slide-in-from-bottom-2">
                                <h3 className="font-bold text-navy text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Move className="w-4 h-4" /> 3. Adjust Layout
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <label className="text-xs font-bold text-charcoal/50">Scale Size</label>
                                            <span className="text-xs font-mono text-navy">{Math.round(scale * 100)}%</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <ZoomOut className="w-4 h-4 text-charcoal/40" />
                                            <input
                                                type="range"
                                                min="0.1"
                                                max="2.0"
                                                step="0.01"
                                                value={scale}
                                                onChange={(e) => setScale(parseFloat(e.target.value))}
                                                className="w-full"
                                            />
                                            <ZoomIn className="w-4 h-4 text-charcoal/40" />
                                        </div>
                                    </div>

                                    <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100 leading-relaxed">
                                        <span className="font-bold block mb-1">💡 Tip:</span>
                                        Click and drag the image in the preview area to position your product perfectly inside the frame or case.
                                    </div>

                                    <button
                                        onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }); }}
                                        className="w-full py-2 text-xs font-bold text-charcoal/50 hover:text-navy border border-dashed border-navy/10 rounded hover:bg-navy/5"
                                    >
                                        Reset Position
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Canvas / Preview Area */}
                    <div className="lg:col-span-8">
                        <div
                            className="bg-zinc-900 rounded-xl shadow-2xl border border-navy/10 p-8 flex items-center justify-center min-h-[600px] relative overflow-hidden"
                            ref={containerRef}
                        >
                            {/* Canvas */}
                            <div className="relative shadow-2xl">
                                <canvas
                                    ref={canvasRef}
                                    width={1024}
                                    height={1024}
                                    className="max-w-full h-auto max-h-[70vh] cursor-move bg-white"
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                />
                                {/* Overlay text if needed */}
                                {!uploadedImage && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur text-sm font-bold">
                                            Upload an image to start compositing
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="text-center text-xs text-charcoal/40 mt-4">
                            Canvas Resolution: 1024 x 1024px (Square)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductMocker;
