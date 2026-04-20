import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Upload, Download, ImageIcon, Settings, Check, HelpCircle } from 'lucide-react';

export function AssetGenerator() {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [originalFilename, setOriginalFilename] = useState<string>("processed_asset");
    const [isMount, setIsMount] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processedOutputUrl, setProcessedOutputUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        setOriginalFilename(file.name.replace(/\.[^/.]+$/, ""));
        
        const reader = new FileReader();
        reader.onload = (event) => {
            setImageSrc(event.target?.result as string);
            setProcessedOutputUrl(null); // Reset output when new file added
        };
        reader.readAsDataURL(file);
    };

    const processImage = async () => {
        if (!imageSrc || !canvasRef.current) return;
        setIsProcessing(true);

        const img = new Image();
        img.src = imageSrc;
        
        img.onload = () => {
            const canvas = canvasRef.current!;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) return;

            // 1. Draw raw image to a temp canvas to find bounding box and crop white
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = img.width;
            tempCanvas.height = img.height;
            const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
            if (!tempCtx) return;
            
            tempCtx.drawImage(img, 0, 0);
            const imgData = tempCtx.getImageData(0, 0, img.width, img.height);
            const data = imgData.data;
            
            let minX = img.width, minY = img.height, maxX = 0, maxY = 0;
            // Simple threshold to ignore white/off-white background
            for (let y = 0; y < img.height; y++) {
                for (let x = 0; x < img.width; x++) {
                    const i = (y * img.width + x) * 4;
                    const r = data[i]; const g = data[i+1]; const b = data[i+2];
                    
                    if (r < 240 || g < 240 || b < 240) { // Not white
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }
            
            // Validation if nothing found
            if (minX > maxX || minY > maxY) {
                minX = 0; minY = 0; maxX = img.width; maxY = img.height;
            }

            const cropWidth = maxX - minX;
            const cropHeight = maxY - minY;
            
            // 2. Extract cropped image
            const croppedCanvas = document.createElement('canvas');
            croppedCanvas.width = cropWidth;
            croppedCanvas.height = cropHeight;
            const cropCtx = croppedCanvas.getContext('2d');
            cropCtx?.drawImage(tempCanvas, minX, minY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
            
            // 3. Handle Framing if Mount
            const frameThickness = 40;
            let finalFramedCanvas = croppedCanvas;
            
            if (isMount) {
                finalFramedCanvas = document.createElement('canvas');
                finalFramedCanvas.width = cropWidth + (frameThickness * 2);
                finalFramedCanvas.height = cropHeight + (frameThickness * 2);
                const frameCtx = finalFramedCanvas.getContext('2d');
                if (frameCtx) {
                    // Draw outer black frame
                    frameCtx.fillStyle = '#111111';
                    frameCtx.fillRect(0, 0, finalFramedCanvas.width, finalFramedCanvas.height);
                    
                    // Outer Bevel (Dark Gray)
                    frameCtx.strokeStyle = '#333333';
                    frameCtx.lineWidth = 2;
                    frameCtx.strokeRect(1, 1, finalFramedCanvas.width - 2, finalFramedCanvas.height - 2);

                    // Inner depth line
                    frameCtx.strokeStyle = '#000000';
                    frameCtx.lineWidth = 2;
                    frameCtx.strokeRect(frameThickness-1, frameThickness-1, cropWidth+2, cropHeight+2);
                    
                    // Paste mount inside
                    frameCtx.drawImage(croppedCanvas, frameThickness, frameThickness);
                }
            }
            
            // 4. Target constraints (1024x1024, 95% crop)
            const TARGET_SIZE = 1024;
            const TARGET_MARGIN = 0.95;
            const maxDim = TARGET_SIZE * TARGET_MARGIN;
            
            const fw = finalFramedCanvas.width;
            const fh = finalFramedCanvas.height;
            
            let scale = 1;
            if (fw > fh) {
                scale = maxDim / fw;
            } else {
                scale = maxDim / fh;
            }
            
            const renderW = fw * scale;
            const renderH = fh * scale;
            const x = (TARGET_SIZE - renderW) / 2;
            const y = (TARGET_SIZE - renderH) / 2;
            
            // 5. Final render to main canvas
            canvas.width = TARGET_SIZE;
            canvas.height = TARGET_SIZE;
            
            // White solid background
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, TARGET_SIZE, TARGET_SIZE);
            
            // Drop Shadow Setup
            ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
            ctx.shadowBlur = 30;
            ctx.shadowOffsetX = 10;
            ctx.shadowOffsetY = 15;
            
            // Draw Main Image
            ctx.drawImage(finalFramedCanvas, x, y, renderW, renderH);

            // Clean up Shadow so it doesn't apply to subsequent operations
            ctx.shadowColor = 'transparent';
            
            setProcessedOutputUrl(canvas.toDataURL('image/jpeg', 0.95));
            setIsProcessing(false);
        };
    };

    const handleDownload = () => {
        if (!processedOutputUrl) return;
        const a = document.createElement('a');
        a.href = processedOutputUrl;
        a.download = `${originalFilename}_shopify_v3.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="min-h-screen bg-ivory pt-36 pb-12 px-4">
            <Helmet><title>Shopify Asset Generator | Admin</title></Helmet>
            <div className="container mx-auto max-w-4xl">
                
                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-navy/10">
                    <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center shadow-lg text-gold">
                        <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-navy">Shopify Asset Generator</h1>
                        <p className="text-navy/60 font-medium">Auto-crop, frame, shadow, and scale to 1024x1024 standard.</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-stone/20 overflow-hidden mb-8 p-8">
                    
                    {/* Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="font-bold text-navy text-lg flex items-center gap-2 mb-4">
                                <Upload className="w-5 h-5 text-gold" /> Step 1: Upload Raw Image
                            </h3>
                            <div className="border-2 border-dashed border-navy/20 rounded-lg p-6 text-center hover:bg-stone/5 transition-colors group relative cursor-pointer">
                                <input 
                                    type="file" 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                />
                                <div className="pointer-events-none">
                                    <div className="mx-auto w-10 h-10 bg-navy/5 text-navy/40 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm font-medium text-navy/80">{imageSrc ? "Change Image" : "Drop an image here or click to browse"}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-navy text-lg flex items-center gap-2 mb-4">
                                <Settings className="w-5 h-5 text-gold" /> Step 2: Configuration
                            </h3>
                            
                            <div className="space-y-4">
                                <label className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-all ${!isMount ? 'border-navy bg-navy/5' : 'border-stone/20 overflow-hidden hover:border-navy/30'}`}>
                                    <div className="mt-0.5">
                                        <input 
                                            type="radio" 
                                            name="frametype" 
                                            checked={!isMount} 
                                            onChange={() => setIsMount(false)}
                                            className="w-4 h-4 text-navy focus:ring-navy cursor-pointer" 
                                        />
                                    </div>
                                    <div>
                                        <p className="font-bold text-navy">Already Framed</p>
                                        <p className="text-xs text-navy/60 mt-1">Image has a frame built in. Crop whitespace and scale.</p>
                                    </div>
                                </label>

                                <label className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-all ${isMount ? 'border-navy bg-navy/5' : 'border-stone/20 overflow-hidden hover:border-navy/30'}`}>
                                    <div className="mt-0.5">
                                        <input 
                                            type="radio" 
                                            name="frametype" 
                                            checked={isMount} 
                                            onChange={() => setIsMount(true)}
                                            className="w-4 h-4 text-navy focus:ring-navy cursor-pointer" 
                                        />
                                    </div>
                                    <div>
                                        <p className="font-bold text-navy">Just a Mount</p>
                                        <p className="text-xs text-navy/60 mt-1">Automatically generates a premium black rim around the edges.</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-stone/10 pt-8 flex justify-center">
                        <button 
                            disabled={!imageSrc || isProcessing}
                            onClick={processImage}
                            className={`px-8 py-3 rounded-md font-bold text-lg flex items-center gap-3 transition-colors ${!imageSrc ? 'bg-stone/20 text-stone/40 cursor-not-allowed' : 'bg-navy text-white hover:bg-navy/90 hover:shadow-lg'}`}
                        >
                            <Settings className={`w-5 h-5 ${isProcessing ? 'animate-spin' : ''}`} /> 
                            {isProcessing ? 'Processing Engine...' : 'Generate Asset'}
                        </button>
                    </div>

                </div>

                {/* Output Area */}
                {processedOutputUrl && (
                    <div className="bg-white rounded-xl shadow-lg border border-gold/40 p-10 flex flex-col md:flex-row gap-10 items-center animate-fade-in">
                        <div className="flex-1 w-full flex justify-center bg-stone/5 border border-stone/20 rounded-lg p-2">
                            <img src={processedOutputUrl} alt="Processed Final" className="rounded shadow-sm max-w-full h-auto object-contain bg-white" />
                        </div>
                        
                        <div className="w-full md:w-80 flex flex-col gap-6">
                            <div>
                                <h3 className="font-serif text-2xl font-bold text-navy mb-2">Final Render Ready</h3>
                                <div className="space-y-2 mt-4 text-sm text-navy/80">
                                    <p className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Resolution: 1024x1024px</p>
                                    <p className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Subject Scale: 95% Padding</p>
                                    <p className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Cast Shadow Applied</p>
                                    {isMount && <p className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Black Frame Injected</p>}
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleDownload}
                                className="w-full py-4 bg-gold hover:bg-gold/90 text-navy font-bold rounded-lg flex items-center justify-center gap-3 transition-all hover:-translate-y-1 hover:shadow-lg"
                            >
                                <Download className="w-5 h-5" /> Download Asset
                            </button>
                        </div>
                    </div>
                )}
                
                {/* Hidden canvas for off-screen processing */}
                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

            </div>
        </div>
    );
}

