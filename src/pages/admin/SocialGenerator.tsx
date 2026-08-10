import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Download, ImageIcon, Calendar, RefreshCw, Layers, Users, BookOpen, Star, Sparkles, Wand2 } from 'lucide-react';

type PostType = 'on-this-day' | 'versus-debate' | 'checklist-tips' | 'product-spotlight';

interface SportsEvent {
    title: string;
    subtitle: string;
    leftImageDefault?: string;
    rightImageDefault?: string;
    eventImage1Default?: string;
    eventImage2Default?: string;
    // Default AI Prompts
    s1RightPromptDefault: string;
    slot1PromptDefault: string;
    slot2PromptDefault: string;
}

interface DebatePreset {
    hook: string;
    sub: string;
    leftLabel: string;
    rightLabel: string;
    s1RightPromptDefault: string;
    slot1PromptDefault: string;
    slot2PromptDefault: string;
}

interface GuidePreset {
    hook: string;
    sub: string;
    title: string;
    subtitle: string;
    tips: string[];
    s1RightPromptDefault: string;
    slot1PromptDefault: string;
}

interface SpotlightPreset {
    hook: string;
    sub: string;
    productTitle: string;
    quote: string;
    author: string;
    s1RightPromptDefault: string;
    slot1PromptDefault: string;
}

// ----------------------------------------------------
// PRELOADED PRESETS WITH TAILORED AI PROMPTS
// ----------------------------------------------------
const ON_THIS_DAY_PRESETS: Record<string, SportsEvent> = {
    "05-25": {
        title: "Missing These Legendary Moments?",
        subtitle: "Historic sports events happen daily - but collectors often miss the anniversary opportunities",
        leftImageDefault: "vintage_paper",
        rightImageDefault: "/premium_collectors_lounge_framed_shirts_1767724846015.png",
        eventImage1Default: "/trent_robbo_raw.jpg",
        eventImage2Default: "/athlete_signing_shirt_closeup_1767725307257.png",
        s1RightPromptDefault: "A premium luxury collectors lounge with shelves displaying baseballs, trophies, and framed sports shirts, warm ambient lighting, highly detailed",
        slot1PromptDefault: "Geoff Hurst celebrating historic hat-trick in the 1966 World Cup final at Wembley stadium, vintage black and white sports photography",
        slot2PromptDefault: "Steven Gerrard lifting the Champions League trophy in Istanbul 2005 surrounded by Liverpool players celebrating, dynamic lighting, professional sports shot"
    },
    "05-07": {
        title: "Corner Taken Quickly...",
        subtitle: "The night Anfield shook the football world and completed the impossible comeback",
        leftImageDefault: "vintage_paper",
        rightImageDefault: "/premium_collectors_lounge_framed_shirts_1767724846015.png",
        eventImage1Default: "/athlete_signing_shirt_closeup_1767725307257.png",
        eventImage2Default: "/framed-product.jpg",
        s1RightPromptDefault: "A red Liverpool football scarf draped over a luxury leather chair in a modern executive study, warm lighting",
        slot1PromptDefault: "Divock Origi celebrating his iconic goal vs Barcelona, screaming in joy in Liverpool red kit, Anfield stadium background, dynamic action shot",
        slot2PromptDefault: "Trent Alexander-Arnold smiling, wearing Liverpool kit in 2019, celebrating, professional sports photography"
    },
    "07-30": {
        title: "A Golden Summer at Wembley?",
        subtitle: "When Bobby Moore lifted the Jules Rimet trophy and defined a sporting generation",
        leftImageDefault: "vintage_paper",
        rightImageDefault: "/premium_collectors_lounge_framed_shirts_1767724846015.png",
        eventImage1Default: "/framed-product.jpg",
        eventImage2Default: "/athlete_signing_shirt_closeup_1767725307257.png",
        s1RightPromptDefault: "Bobby Moore vintage football sculpture or framed historical newspaper in a luxury wooden library study room",
        slot1PromptDefault: "Bobby Moore lifted on shoulders of England teammates holding the Jules Rimet World Cup trophy in 1966, vintage black and white photo",
        slot2PromptDefault: "England fans celebrating historical World Cup victory inside Wembley stadium in 1966, black and white dynamic sports shot"
    }
};

const DEBATE_PRESETS: Record<string, DebatePreset> = {
    "gerrard-lampard": {
        hook: "Gerrard or Lampard?",
        sub: "The debate that divided a generation of English football fans. Who gets your vote?",
        leftLabel: "Steven Gerrard",
        rightLabel: "Frank Lampard",
        s1RightPromptDefault: "Two vintage football boots placed on a dark mahogany table, spotlighting, premium aesthetic",
        slot1PromptDefault: "Steven Gerrard running and celebrating in Liverpool red shirt, professional action sports photograph, Anfield background",
        slot2PromptDefault: "Frank Lampard celebrating in Chelsea blue shirt pointing to fans, professional sports action shot, Stamford Bridge background"
    },
    "fergie-pep": {
        hook: "Ferguson or Guardiola?",
        sub: "Building a football club dynasty from absolute scratch. Which mastermind are you hiring first?",
        leftLabel: "Sir Alex Ferguson",
        rightLabel: "Pep Guardiola",
        s1RightPromptDefault: "A gold tactics clipboard on a locker room bench with tactics drawn, professional aesthetic",
        slot1PromptDefault: "Sir Alex Ferguson smiling and waving inside Old Trafford stadium, Manchester United manager legend, professional portrait",
        slot2PromptDefault: "Pep Guardiola directing tactics on the touchline in a suit, Manchester City manager, dynamic football action shot"
    }
};

const GUIDE_PRESETS: Record<string, GuidePreset> = {
    "sun-damage": {
        hook: "Sun Damage is Killing Your Collectibles",
        sub: "Fading signatures destroy value. Here are 4 tips to protect your sports memorabilia.",
        title: "Collector Guide",
        subtitle: "How to Stop Memorabilia Fading",
        tips: [
            "Keep frames away from direct sunlight (UV rays bleach markers).",
            "Use museum-grade conservation acrylic glass with 99% UV filters.",
            "Maintain moderate room humidity to prevent mount board warping.",
            "Never hang autographed shirts directly opposite large windows."
        ],
        s1RightPromptDefault: "A luxury art gallery room with spotlights reflecting on pristine framed pictures, modern aesthetic",
        slot1PromptDefault: "Close up of an autograph signature in blue marker on a red football shirt, highly detailed texture, professional photography"
    },
    "fake-autographs": {
        hook: "How to Spot a Fake Autograph",
        sub: "Don't get scammed on eBay. Check these 4 trust indicators before you spend your cash.",
        title: "Watchdog Checklist",
        subtitle: "Spotting Counterfeit Signatures",
        tips: [
            "Inspect ink drag: Look for natural hand pressure variations.",
            "Avoid home-printed COAs: Ensure certificates carry verified registries.",
            "Demand video signing proof: Real session footage guarantees authenticity.",
            "Check pen-tip pooling: Fake traced signatures have rounded ink dots."
        ],
        s1RightPromptDefault: "A magnifying glass resting on top of a signed document in a dark office, dramatic lighting",
        slot1PromptDefault: "A professional authenticating a signed sports jersey with a magnifying glass, close up shot, high detail"
    }
};

const SPOTLIGHT_PRESETS: Record<string, SpotlightPreset> = {
    "origi-shirt": {
        hook: "The Ultimate LFC Cult Legend?",
        sub: "A piece of Champions League folklore. Showcasing the signed, framed Divock Origi shirt.",
        productTitle: "Divock Origi Signed Liverpool Shirt",
        quote: "The Origi framed shirt was the highlight of our annual charity dinner. Having the photos of him signing it really helped push the bids up.",
        author: "Event Organiser, Manchester",
        s1RightPromptDefault: "A luxury black gift box with gold foil logo on top, unboxed on a clean marble surface, photorealistic",
        slot1PromptDefault: "A beautifully framed red signed sports jersey hung on a dark charcoal museum-grade wall with overhead spot lighting, clean minimalist home setup"
    },
    "mac-allister": {
        hook: "World Cup & Anfield Champion?",
        sub: "Direct from the signing session. Taking a look at the Alexis Mac Allister issue archive.",
        productTitle: "Alexis Mac Allister Signed Boot",
        quote: "We gave a signed Mac Allister boot to our top salesperson this year. The reaction was brilliant, and it sits proudly in his home office.",
        author: "Sales Director, London",
        s1RightPromptDefault: "An open luxury matte black presentation box showing gold foil branding on the interior lining",
        slot1PromptDefault: "A single signed yellow football boot displayed inside a premium acrylic glass display case, dark luxury background, professional lighting"
    }
};

export function SocialGenerator() {
    const [postType, setPostType] = useState<PostType>('on-this-day');
    const [activeTab, setActiveTab] = useState<'slide1' | 'slide2'>('slide1');
    const [isRendering, setIsRendering] = useState(false);
    
    // Canvas Outputs
    const [slide1Output, setSlide1Output] = useState<string | null>(null);
    const [slide2Output, setSlide2Output] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // ----------------------------------------------------
    // EDITOR FORM STATE variables
    // ----------------------------------------------------
    const [presetKey, setPresetKey] = useState<string>("05-25");
    const [slide1Hook, setSlide1Hook] = useState("Missing These Legendary Moments?");
    const [slide1Sub, setSlide1Sub] = useState("Historic sports events happen daily - but collectors often miss the anniversary opportunities");
    const [slide1LeftImg, setSlide1LeftImg] = useState<string | null>(null);
    const [slide1RightImg, setSlide1RightImg] = useState<string | null>(null);

    // Slide 2 Content State
    const [slide2Title, setSlide2Title] = useState("Every Date Holds Gold");
    const [slide2Subtitle, setSlide2Subtitle] = useState("May 25th: Geoff Hurst's World Cup hat-trick (1966) • Liverpool's Champions League miracle (2005)");
    
    // Image Slots (flexible use depending on layout)
    const [imageSlot1, setImageSlot1] = useState<string | null>(null);
    const [imageSlot2, setImageSlot2] = useState<string | null>(null);

    // AI Prompt States for generation
    const [s1RightPrompt, setS1RightPrompt] = useState("");
    const [slot1Prompt, setSlot1Prompt] = useState("");
    const [slot2Prompt, setSlot2Prompt] = useState("");

    // AI Generation Loading States
    const [isGenS1Right, setIsGenS1Right] = useState(false);
    const [isGenSlot1, setIsGenSlot1] = useState(false);
    const [isGenSlot2, setIsGenSlot2] = useState(false);

    // List items (For Guide template)
    const [guideTips, setGuideTips] = useState<string[]>([
        "Keep frames away from direct sunlight (UV rays bleach markers).",
        "Use museum-grade conservation acrylic glass with 99% UV filters.",
        "Maintain moderate room humidity to prevent mount board warping.",
        "Never hang autographed shirts directly opposite large windows."
    ]);

    // Testimonial details (For Spotlight template)
    const [spotlightProduct, setSpotlightProduct] = useState("Divock Origi Signed Liverpool Shirt");
    const [spotlightQuote, setSpotlightQuote] = useState("The Origi framed shirt was the highlight of our annual charity dinner. Having the photos of him signing it really helped push the bids up.");
    const [spotlightAuthor, setSpotlightAuthor] = useState("Event Organiser, Manchester");

    // Labels for VS layout
    const [vsLeftLabel, setVsLeftLabel] = useState("Steven Gerrard");
    const [vsRightLabel, setVsRightLabel] = useState("Frank Lampard");

    // ----------------------------------------------------
    // PRESET LOADER TRIGGER
    // ----------------------------------------------------
    useEffect(() => {
        if (postType === 'on-this-day') {
            const preset = ON_THIS_DAY_PRESETS[presetKey];
            if (preset) {
                setSlide1Hook(preset.title);
                setSlide1Sub(preset.subtitle);
                setSlide2Title("Every Date Holds Gold");
                if (presetKey === '05-25') {
                    setSlide2Subtitle("May 25th: Geoff Hurst's World Cup hat-trick (1966) • Liverpool's Champions League miracle (2005)");
                } else if (presetKey === '05-07') {
                    setSlide2Subtitle("May 7th: 'Corner taken quickly... ORIGI!' Liverpool beat Barca 4-0 (2019)");
                } else {
                    setSlide2Subtitle("July 30th: England win the World Cup at Wembley (1966)");
                }
                setSlide1LeftImg(null);
                setSlide1RightImg(preset.rightImageDefault || null);
                setImageSlot1(preset.eventImage1Default || null);
                setImageSlot2(preset.eventImage2Default || null);

                // Set Default AI prompts
                setS1RightPrompt(preset.s1RightPromptDefault);
                setSlot1Prompt(preset.slot1PromptDefault);
                setSlot2Prompt(preset.slot2PromptDefault);
            }
        } else if (postType === 'versus-debate') {
            const preset = DEBATE_PRESETS[presetKey] || DEBATE_PRESETS["gerrard-lampard"];
            if (preset) {
                setSlide1Hook(preset.hook);
                setSlide1Sub(preset.sub);
                setSlide2Title("The Ultimate Debate");
                setSlide2Subtitle("Who had the greater career in English Football?");
                setVsLeftLabel(preset.leftLabel);
                setVsRightLabel(preset.rightLabel);
                setSlide1LeftImg(null);
                setSlide1RightImg("/premium_collectors_lounge_framed_shirts_1767724846015.png");
                setImageSlot1("/athlete_signing_shirt_closeup_1767725307257.png");
                setImageSlot2("/trent_robbo_raw.jpg");

                // Set Default AI prompts
                setS1RightPrompt(preset.s1RightPromptDefault);
                setSlot1Prompt(preset.slot1PromptDefault);
                setSlot2Prompt(preset.slot2PromptDefault);
            }
        } else if (postType === 'checklist-tips') {
            const preset = GUIDE_PRESETS[presetKey] || GUIDE_PRESETS["sun-damage"];
            if (preset) {
                setSlide1Hook(preset.hook);
                setSlide1Sub(preset.sub);
                setSlide2Title(preset.title);
                setSlide2Subtitle(preset.subtitle);
                setGuideTips(preset.tips);
                setSlide1LeftImg(null);
                setSlide1RightImg("/premium_collectors_lounge_framed_shirts_1767724846015.png");
                setImageSlot1("/framed-product.jpg");
                setImageSlot2(null);

                // Set Default AI prompts
                setS1RightPrompt(preset.s1RightPromptDefault);
                setSlot1Prompt(preset.slot1PromptDefault);
                setSlot2Prompt("");
            }
        } else if (postType === 'product-spotlight') {
            const preset = SPOTLIGHT_PRESETS[presetKey] || SPOTLIGHT_PRESETS["origi-shirt"];
            if (preset) {
                setSlide1Hook(preset.hook);
                setSlide1Sub(preset.sub);
                setSlide2Title("Archive Spotlight");
                setSlide2Subtitle("Premium Authenticated Memorabilia");
                setSpotlightProduct(preset.productTitle);
                setSpotlightQuote(preset.quote);
                setSpotlightAuthor(preset.author);
                setSlide1LeftImg(null);
                setSlide1RightImg("/premium-packaging-open.png");
                setImageSlot1("/framed-product.jpg");
                setImageSlot2(null);

                // Set Default AI prompts
                setS1RightPrompt(preset.s1RightPromptDefault);
                setSlot1Prompt(preset.slot1PromptDefault);
                setSlot2Prompt("");
            }
        }
    }, [postType, presetKey]);

    // ----------------------------------------------------
    // AI IMAGE GENERATOR ACTION
    // ----------------------------------------------------
    const generateAIImage = async (promptText: string, target: 's1right' | 'slot1' | 'slot2') => {
        if (!promptText.trim()) return;
        
        if (target === 's1right') setIsGenS1Right(true);
        if (target === 'slot1') setIsGenSlot1(true);
        if (target === 'slot2') setIsGenSlot2(true);

        try {
            // Generate dynamic random seed to bypass caches and force fresh AI outputs
            const seed = Math.floor(Math.random() * 1000000);
            // Construct dimension parameters based on crop/frame format
            const width = target === 'slot1' && postType === 'on-this-day' ? 800 : 1000;
            const height = target === 'slot1' && postType === 'on-this-day' ? 1000 : 800; // Portrait vs Landscape

            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText)}?width=${width}&height=${height}&nologo=true&seed=${seed}`;
            
            // Warm-up the image cache by preloading
            await loadImage(imageUrl);

            // Apply to editor slot
            if (target === 's1right') setSlide1RightImg(imageUrl);
            if (target === 'slot1') setImageSlot1(imageUrl);
            if (target === 'slot2') setImageSlot2(imageUrl);

        } catch (e) {
            console.error("AI Generation failed:", e);
        } finally {
            if (target === 's1right') setIsGenS1Right(false);
            if (target === 'slot1') setIsGenSlot1(false);
            if (target === 'slot2') setIsGenSlot2(false);
        }
    };

    // Handle Local Image Uploads
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 's1right' | 'slot1' | 'slot2') => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            if (target === 's1right') setSlide1RightImg(dataUrl);
            if (target === 'slot1') setImageSlot1(dataUrl);
            if (target === 'slot2') setImageSlot2(dataUrl);
        };
        reader.readAsDataURL(file);
    };

    // Helper: Promisified Image Loader
    const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = (e) => reject(e);
        });
    };

    // Helper: Draw text wrapped inside a bounding box
    const drawTextWrapped = (
        ctx: CanvasRenderingContext2D, 
        text: string, 
        x: number, 
        y: number, 
        maxWidth: number, 
        lineHeight: number
    ) => {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, currentY);
        return currentY;
    };

    // Main Canvas Compile Engine
    const generateRender = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        setIsRendering(true);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            setIsRendering(false);
            return;
        }

        try {
            canvas.width = 1080;
            canvas.height = 1080;

            // ==========================================
            // RENDER SLIDE 1 (Universal Hook Slide)
            // ==========================================
            ctx.clearRect(0, 0, 1080, 1080);
            
            // 1. Left Side: Vintage Scroll Background
            if (slide1LeftImg) {
                const leftImg = await loadImage(slide1LeftImg);
                ctx.drawImage(leftImg, 0, 0, 540, 1080);
            } else {
                const paperData = ctx.createImageData(540, 1080);
                const d = paperData.data;
                for (let i = 0; i < d.length; i += 4) {
                    const noise = (Math.random() - 0.5) * 14;
                    d[i] = 236 + noise;
                    d[i+1] = 227 + noise;
                    d[i+2] = 212 + noise;
                    d[i+3] = 255;
                }
                ctx.putImageData(paperData, 0, 0);

                const gradient = ctx.createRadialGradient(270, 540, 10, 270, 540, 540);
                gradient.addColorStop(0, 'rgba(120, 90, 50, 0)');
                gradient.addColorStop(0.8, 'rgba(101, 78, 48, 0.08)');
                gradient.addColorStop(1, 'rgba(75, 53, 26, 0.25)');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 540, 1080);

                ctx.strokeStyle = 'rgba(75, 53, 26, 0.14)';
                ctx.lineWidth = 2;
                for (let lineY = 120; lineY < 1000; lineY += 32) {
                    ctx.beginPath();
                    ctx.moveTo(60 + Math.random() * 10, lineY);
                    ctx.lineTo(480 - Math.random() * 10, lineY);
                    ctx.stroke();
                }
            }

            // 2. Draw Right Split: Interior/Mockup Image
            if (slide1RightImg) {
                const rightImg = await loadImage(slide1RightImg);
                const aspect = rightImg.width / rightImg.height;
                const targetW = 540;
                const targetH = 1080;
                let srcW = rightImg.width;
                let srcH = rightImg.height;
                let srcX = 0;
                let srcY = 0;

                if (aspect > targetW / targetH) {
                    srcW = rightImg.height * (targetW / targetH);
                    srcX = (rightImg.width - srcW) / 2;
                } else {
                    srcH = rightImg.width * (targetH / targetW);
                    srcY = (rightImg.height - srcH) / 2;
                }
                ctx.drawImage(rightImg, srcX, srcY, srcW, srcH, 540, 0, 540, 1080);
            } else {
                ctx.fillStyle = '#0F182A';
                ctx.fillRect(540, 0, 540, 1080);
            }

            // 3. Top Banner
            ctx.fillStyle = '#0B1221';
            ctx.fillRect(0, 0, 1080, 270);
            
            ctx.strokeStyle = '#c6a664';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(0, 270);
            ctx.lineTo(1080, 270);
            ctx.stroke();

            // 4. Hook Text
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 44px "Playfair Display", Times, serif';
            ctx.fillText(slide1Hook, 540, 95);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.font = '500 21px "Inter", Arial, sans-serif';
            drawTextWrapped(ctx, slide1Sub, 540, 175, 960, 28);

            // 5. Branding
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.font = '600 24px "Inter", Arial, sans-serif';
            ctx.fillText('sportssigned.com', 810, 1020);

            const logoX = 980;
            const logoY = 50;
            const logoSize = 65;
            ctx.strokeStyle = '#c6a664';
            ctx.lineWidth = 2.5;
            ctx.strokeRect(logoX, logoY, logoSize, logoSize);
            ctx.fillStyle = '#c6a664';
            ctx.font = 'bold 22px "Playfair Display", Times, serif';
            ctx.fillText('S', logoX + logoSize/2, logoY + logoSize/2 + 2);
            ctx.font = 'bold 9px "Inter", Arial, sans-serif';
            ctx.fillText('SPORTS SIGNED', logoX + logoSize/2, logoY + logoSize + 15);

            setSlide1Output(canvas.toDataURL('image/jpeg', 0.95));

            // ==========================================
            // RENDER SLIDE 2 (Template Conditional compile)
            // ==========================================
            ctx.clearRect(0, 0, 1080, 1080);
            ctx.fillStyle = '#0B1221';
            ctx.fillRect(0, 0, 1080, 1080);

            // Universal Header Area
            ctx.textAlign = 'center';
            ctx.fillStyle = '#c6a664';
            ctx.font = 'bold 54px "Playfair Display", Times, serif';
            ctx.fillText(slide2Title, 540, 90);

            ctx.fillStyle = '#FFFFFF';
            ctx.font = '500 21px "Inter", Arial, sans-serif';
            drawTextWrapped(ctx, slide2Subtitle, 540, 170, 960, 28);

            // Shared helper to render a gold-bevelled frame
            const drawGoldFrame = async (imgSrc: string | null, box: { x: number; y: number; w: number; h: number }) => {
                ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
                ctx.shadowBlur = 24;
                ctx.shadowOffsetX = 12;
                ctx.shadowOffsetY = 16;

                const goldGrad = ctx.createLinearGradient(box.x, box.y, box.x + box.w, box.y + box.h);
                goldGrad.addColorStop(0, '#BF953F');
                goldGrad.addColorStop(0.25, '#FCF6BA');
                goldGrad.addColorStop(0.5, '#B38728');
                goldGrad.addColorStop(0.75, '#FBF5B7');
                goldGrad.addColorStop(1, '#AA771C');
                ctx.fillStyle = goldGrad;
                ctx.fillRect(box.x, box.y, box.w, box.h);

                ctx.shadowColor = 'transparent';

                const borderWidth = 12;
                ctx.fillStyle = '#000000';
                ctx.fillRect(box.x + borderWidth, box.y + borderWidth, box.w - borderWidth*2, box.h - borderWidth*2);

                const finalBorder = borderWidth + 3;
                if (imgSrc) {
                    try {
                        const img = await loadImage(imgSrc);
                        const targetW = box.w - finalBorder*2;
                        const targetH = box.h - finalBorder*2;
                        const aspect = img.width / img.height;
                        let srcW = img.width;
                        let srcH = img.height;
                        let srcX = 0;
                        let srcY = 0;

                        if (aspect > targetW / targetH) {
                            srcW = img.height * (targetW / targetH);
                            srcX = (img.width - srcW) / 2;
                        } else {
                            srcH = img.width * (targetH / targetW);
                            srcY = (img.height - srcH) / 2;
                        }
                        ctx.drawImage(img, srcX, srcY, srcW, srcH, box.x + finalBorder, box.y + finalBorder, targetW, targetH);
                    } catch (e) {
                        ctx.fillStyle = '#1A2A44';
                        ctx.fillRect(box.x + finalBorder, box.y + finalBorder, box.w - finalBorder*2, box.h - finalBorder*2);
                    }
                } else {
                    ctx.fillStyle = '#1e293b';
                    ctx.fillRect(box.x + finalBorder, box.y + finalBorder, box.w - finalBorder*2, box.h - finalBorder*2);
                }
            };

            // Compile based on Post Type
            if (postType === 'on-this-day') {
                // Two overlapping/offset gold framed photos
                await drawGoldFrame(imageSlot1, { x: 75, y: 260, w: 430, h: 560 });
                await drawGoldFrame(imageSlot2, { x: 555, y: 480, w: 450, h: 340 });

            } else if (postType === 'versus-debate') {
                // Side-by-side vertical frames with "VS" emblem
                const leftBox = { x: 80, y: 260, w: 430, h: 540 };
                const rightBox = { x: 570, y: 260, w: 430, h: 540 };

                await drawGoldFrame(imageSlot1, leftBox);
                await drawGoldFrame(imageSlot2, rightBox);

                // Draw Name overlays on frames
                ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
                ctx.fillRect(80 + 15, 260 + 460, 400, 65);
                ctx.fillRect(570 + 15, 260 + 460, 400, 65);

                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 22px "Inter", Arial, sans-serif';
                ctx.fillText(vsLeftLabel, 80 + 215, 260 + 495);
                ctx.fillText(vsRightLabel, 570 + 215, 260 + 495);

                // VS circle in center
                const circleX = 540;
                const circleY = 530;
                const radius = 70;

                ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
                ctx.shadowBlur = 15;
                const vsGoldGrad = ctx.createLinearGradient(circleX - radius, circleY - radius, circleX + radius, circleY + radius);
                vsGoldGrad.addColorStop(0, '#BF953F');
                vsGoldGrad.addColorStop(0.5, '#FCF6BA');
                vsGoldGrad.addColorStop(1, '#AA771C');
                
                ctx.fillStyle = vsGoldGrad;
                ctx.beginPath();
                ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowColor = 'transparent';

                ctx.fillStyle = '#0B1221';
                ctx.beginPath();
                ctx.arc(circleX, circleY, radius - 8, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#c6a664';
                ctx.font = 'bold 44px "Playfair Display", Times, serif';
                ctx.fillText('VS', circleX, circleY + 3);

            } else if (postType === 'checklist-tips') {
                // Checklist list on the left, reference image on the right
                const referenceBox = { x: 670, y: 280, w: 330, h: 500 };
                await drawGoldFrame(imageSlot1, referenceBox);

                // Draw Tips Checklist
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                
                let startY = 280;
                guideTips.forEach((tip) => {
                    const tipX = 90;
                    const textX = 140;

                    // Draw Gold checkmark checkbox
                    ctx.strokeStyle = '#c6a664';
                    ctx.lineWidth = 3;
                    ctx.strokeRect(tipX, startY, 28, 28);

                    ctx.beginPath();
                    ctx.moveTo(tipX + 6, startY + 12);
                    ctx.lineTo(tipX + 12, startY + 19);
                    ctx.lineTo(tipX + 22, startY + 6);
                    ctx.stroke();

                    // Draw tip text wrapped
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = '500 20px "Inter", Arial, sans-serif';
                    
                    const nextY = drawTextWrapped(ctx, tip, textX, startY, 480, 26);
                    startY = Math.max(nextY + 45, startY + 65);
                });

            } else if (postType === 'product-spotlight') {
                // Large product highlight top, quote card bottom
                const showcaseBox = { x: 215, y: 250, w: 650, h: 430 };
                await drawGoldFrame(imageSlot1, showcaseBox);

                // Testimonial Card Frame
                const cardX = 140;
                const cardY = 720;
                const cardW = 800;
                const cardH = 180;

                ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
                ctx.fillRect(cardX, cardY, cardW, cardH);
                
                ctx.strokeStyle = 'rgba(198, 166, 100, 0.3)';
                ctx.lineWidth = 1.5;
                ctx.strokeRect(cardX, cardY, cardW, cardH);

                // Quote text in italics
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.fillStyle = '#c6a664';
                ctx.font = 'italic 20px "Playfair Display", Times, serif';
                const formattedQuote = `"${spotlightQuote}"`;
                
                const finalQuoteY = drawTextWrapped(ctx, formattedQuote, 540, cardY + 25, 740, 26);

                // Quote Author
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.font = '500 15px "Inter", Arial, sans-serif';
                ctx.fillText(`— ${spotlightAuthor}`, 540, finalQuoteY + 22);
            }

            // Universal Footer branding watermark
            const bLogoX = 75;
            const bLogoY = 940;
            const bLogoSize = 75;
            
            ctx.strokeStyle = '#c6a664';
            ctx.lineWidth = 3;
            ctx.strokeRect(bLogoX, bLogoY, bLogoSize, bLogoSize);
            
            ctx.fillStyle = '#c6a664';
            ctx.font = 'bold 28px "Playfair Display", Times, serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('S', bLogoX + bLogoSize/2, bLogoY + bLogoSize/2 + 2);

            ctx.textAlign = 'right';
            ctx.fillStyle = '#c6a664';
            ctx.font = 'bold 28px "Playfair Display", Times, serif';
            ctx.fillText('SPORTS SIGNED', 1000, 975);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.font = '600 13px "Inter", Arial, sans-serif';
            ctx.fillText('M E M O R A B I L I A   S T O R E', 1000, 1000);

            setSlide2Output(canvas.toDataURL('image/jpeg', 0.95));

        } catch (e) {
            console.error("Rendering failed:", e);
        } finally {
            setIsRendering(false);
        }
    };

    // Recompile layout when any text/images adjust
    useEffect(() => {
        const timer = setTimeout(() => {
            generateRender();
        }, 500);
        return () => clearTimeout(timer);
    }, [
        postType, slide1Hook, slide1Sub, slide1RightImg, 
        slide2Title, slide2Subtitle, imageSlot1, imageSlot2,
        guideTips, spotlightProduct, spotlightQuote, spotlightAuthor,
        vsLeftLabel, vsRightLabel
    ]);

    const triggerDownload = (url: string | null, name: string) => {
        if (!url) return;
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="min-h-screen bg-ivory pt-32 pb-16 px-4">
            <Helmet><title>Omni Social Media Template Engine | Admin</title></Helmet>
            <div className="container mx-auto max-w-6xl">
                
                {/* Hub Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-navy/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center shadow-lg text-gold">
                            <Layers className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="font-serif text-3xl font-bold text-navy">Omni Social Media Template Engine</h1>
                            <p className="text-navy/60 font-medium">Build high-impact Instagram carousels for all target categories.</p>
                        </div>
                    </div>
                    
                    <button
                        onClick={generateRender}
                        disabled={isRendering}
                        className="px-5 py-2.5 bg-navy text-white rounded-lg flex items-center gap-2 hover:bg-navy/90 hover:shadow font-bold transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRendering ? 'animate-spin' : ''}`} />
                        {isRendering ? "Compiling..." : "Compile Canvas"}
                    </button>
                </div>

                {/* Template Type Selector Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { id: 'on-this-day', label: 'On This Day', desc: 'Anniversaries & events', icon: Calendar },
                        { id: 'versus-debate', label: 'VS Debate', desc: 'Gerrard vs Lampard, etc.', icon: Users },
                        { id: 'checklist-tips', label: 'Collector Guide', desc: 'Autograph safety tips', icon: BookOpen },
                        { id: 'product-spotlight', label: 'Product Spotlight', desc: 'Showcase + Customer quote', icon: Star },
                    ].map((t) => {
                        const Icon = t.icon;
                        const active = postType === t.id;
                        return (
                            <button
                                key={t.id}
                                onClick={() => {
                                    setPostType(t.id as PostType);
                                    setPresetKey(t.id === 'on-this-day' ? '05-25' : t.id === 'versus-debate' ? 'gerrard-lampard' : t.id === 'checklist-tips' ? 'sun-damage' : 'origi-shirt');
                                }}
                                className={`p-4 rounded-xl border text-left transition-all ${active ? 'bg-navy text-white border-gold shadow-md' : 'bg-white text-navy border-stone/20 hover:border-navy/30'}`}
                            >
                                <Icon className={`w-6 h-6 mb-2 ${active ? 'text-gold' : 'text-navy'}`} />
                                <h4 className="font-bold text-sm block">{t.label}</h4>
                                <span className={`text-[10px] ${active ? 'text-white/60' : 'text-navy/50'}`}>{t.desc}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Panel: Contextual Editor */}
                    <div className="lg:col-span-5 space-y-6">
                        
                        {/* 1. Presets Selector block */}
                        <div className="bg-white p-6 rounded-xl border border-stone/20 shadow-sm space-y-4">
                            <h3 className="font-serif text-lg font-bold text-navy">Load Brand Preset</h3>
                            
                            {postType === 'on-this-day' && (
                                <select 
                                    value={presetKey}
                                    onChange={(e) => setPresetKey(e.target.value)}
                                    className="w-full px-3 py-2 border border-stone/30 rounded-lg text-sm text-navy bg-white focus:ring-1 focus:ring-gold"
                                >
                                    <option value="05-25">May 25th (Istanbul Miracle 2005)</option>
                                    <option value="05-07">May 7th (Origi vs Barcelona 2019)</option>
                                    <option value="07-30">July 30th (England World Cup Win 1966)</option>
                                </select>
                            )}

                            {postType === 'versus-debate' && (
                                <select 
                                    value={presetKey}
                                    onChange={(e) => setPresetKey(e.target.value)}
                                    className="w-full px-3 py-2 border border-stone/30 rounded-lg text-sm text-navy bg-white focus:ring-1 focus:ring-gold"
                                >
                                    <option value="gerrard-lampard">Gerrard vs Lampard (Midfield Debate)</option>
                                    <option value="fergie-pep">Ferguson vs Guardiola (Manager Dynasty)</option>
                                </select>
                            )}

                            {postType === 'checklist-tips' && (
                                <select 
                                    value={presetKey}
                                    onChange={(e) => setPresetKey(e.target.value)}
                                    className="w-full px-3 py-2 border border-stone/30 rounded-lg text-sm text-navy bg-white focus:ring-1 focus:ring-gold"
                                >
                                    <option value="sun-damage">Protecting Memorabilia (UV Fading)</option>
                                    <option value="fake-autographs">Fake Autograph Checklist (Watchdog)</option>
                                </select>
                            )}

                            {postType === 'product-spotlight' && (
                                <select 
                                    value={presetKey}
                                    onChange={(e) => setPresetKey(e.target.value)}
                                    className="w-full px-3 py-2 border border-stone/30 rounded-lg text-sm text-navy bg-white focus:ring-1 focus:ring-gold"
                                >
                                    <option value="origi-shirt">Divock Origi Signed Shirt</option>
                                    <option value="mac-allister">Alexis Mac Allister Signed Boot</option>
                                </select>
                            )}
                        </div>

                        {/* 2. Slide 1 Editor block */}
                        <div className="bg-white p-6 rounded-xl border border-stone/20 shadow-sm space-y-4">
                            <h3 className="font-serif text-lg font-bold text-navy">Slide 1 Content (The Hook)</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-navy/60 uppercase block mb-1">Headline Hook</label>
                                    <input 
                                        type="text"
                                        value={slide1Hook}
                                        onChange={(e) => setSlide1Hook(e.target.value)}
                                        className="w-full px-3 py-2 border border-stone/30 rounded-lg text-sm text-navy focus:ring-1 focus:ring-gold"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-navy/60 uppercase block mb-1">Sub-Headline</label>
                                    <textarea 
                                        rows={2}
                                        value={slide1Sub}
                                        onChange={(e) => setSlide1Sub(e.target.value)}
                                        className="w-full px-3 py-2 border border-stone/30 rounded-lg text-sm text-navy resize-none focus:ring-1 focus:ring-gold"
                                    />
                                </div>
                                <div className="space-y-2 pt-2 border-t border-stone/10">
                                    <label className="text-xs font-bold text-navy/60 uppercase block mb-1">Right-Side Split Image</label>
                                    
                                    {/* AI Prompt Input */}
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            value={s1RightPrompt}
                                            onChange={(e) => setS1RightPrompt(e.target.value)}
                                            placeholder="AI Image prompt..."
                                            className="flex-1 px-3 py-1.5 border border-stone/30 rounded-lg text-xs text-navy focus:ring-1 focus:ring-gold"
                                        />
                                        <button 
                                            onClick={() => generateAIImage(s1RightPrompt, 's1right')}
                                            disabled={isGenS1Right || !s1RightPrompt.trim()}
                                            className="px-3 bg-navy text-white rounded-lg flex items-center justify-center gap-1 hover:bg-navy/90 text-xs font-bold disabled:opacity-50 min-w-[110px]"
                                        >
                                            <Sparkles className={`w-3.5 h-3.5 ${isGenS1Right ? 'animate-spin' : ''}`} />
                                            {isGenS1Right ? 'Generating' : 'AI Generate'}
                                        </button>
                                    </div>

                                    {/* Or manual upload fallback */}
                                    <div className="flex gap-2 items-center">
                                        <label className="flex-1 border border-dashed border-navy/20 hover:border-gold rounded-lg py-1.5 text-center cursor-pointer relative bg-stone/5">
                                            <input type="file" className="absolute inset-0 opacity-0" accept="image/*" onChange={(e) => handleImageUpload(e, 's1right')} />
                                            <span className="text-[10px] font-semibold text-navy/70 block">Manual Upload Fallback</span>
                                        </label>
                                        {slide1RightImg && <button onClick={() => setSlide1RightImg(null)} className="px-2 py-1 text-red-600 border border-red-100 rounded-lg text-[10px] font-bold">Reset</button>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Slide 2 Contextual Editor block */}
                        <div className="bg-white p-6 rounded-xl border border-stone/20 shadow-sm space-y-4">
                            <h3 className="font-serif text-lg font-bold text-navy">Slide 2 Content (The Details)</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-navy/60 uppercase block mb-1">Slide Title</label>
                                    <input 
                                        type="text"
                                        value={slide2Title}
                                        onChange={(e) => setSlide2Title(e.target.value)}
                                        className="w-full px-3 py-2 border border-stone/30 rounded-lg text-sm text-navy focus:ring-1 focus:ring-gold"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-navy/60 uppercase block mb-1">Slide Subtitle / Subtext</label>
                                    <textarea 
                                        rows={2}
                                        value={slide2Subtitle}
                                        onChange={(e) => setSlide2Subtitle(e.target.value)}
                                        className="w-full px-3 py-2 border border-stone/30 rounded-lg text-sm text-navy resize-none focus:ring-1 focus:ring-gold"
                                    />
                                </div>

                                {/* Versus-specific inputs */}
                                {postType === 'versus-debate' && (
                                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-stone/10">
                                        <div>
                                            <label className="text-xs font-bold text-navy/60 uppercase block mb-1">Left Player Name</label>
                                            <input type="text" value={vsLeftLabel} onChange={(e) => setVsLeftLabel(e.target.value)} className="w-full px-3 py-2 border border-stone/30 rounded-lg text-sm text-navy focus:ring-1 focus:ring-gold" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-navy/60 uppercase block mb-1">Right Player Name</label>
                                            <input type="text" value={vsRightLabel} onChange={(e) => setVsRightLabel(e.target.value)} className="w-full px-3 py-2 border border-stone/30 rounded-lg text-sm text-navy focus:ring-1 focus:ring-gold" />
                                        </div>
                                    </div>
                                )}

                                {/* Checklist-specific inputs */}
                                {postType === 'checklist-tips' && (
                                    <div className="space-y-2 pt-2 border-t border-stone/10">
                                        <label className="text-xs font-bold text-navy/60 uppercase block">Checklist Bullet Points</label>
                                        {guideTips.map((tip, idx) => (
                                            <input 
                                                key={idx}
                                                type="text"
                                                value={tip}
                                                onChange={(e) => {
                                                    const newTips = [...guideTips];
                                                    newTips[idx] = e.target.value;
                                                    setGuideTips(newTips);
                                                }}
                                                className="w-full px-3 py-2 border border-stone/30 rounded-lg text-sm text-navy focus:ring-1 focus:ring-gold"
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Spotlight-specific inputs */}
                                {postType === 'product-spotlight' && (
                                    <div className="space-y-3 pt-2 border-t border-stone/10">
                                        <div>
                                            <label className="text-xs font-bold text-navy/60 uppercase block mb-1">Product Title</label>
                                            <input type="text" value={spotlightProduct} onChange={(e) => setSpotlightProduct(e.target.value)} className="w-full px-3 py-2 border border-stone/30 rounded-lg text-sm text-navy focus:ring-1 focus:ring-gold" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-navy/60 uppercase block mb-1">Customer Quote / Testimonial</label>
                                            <textarea rows={3} value={spotlightQuote} onChange={(e) => setSpotlightQuote(e.target.value)} className="w-full px-3 py-2 border border-stone/30 rounded-lg text-sm text-navy resize-none focus:ring-1 focus:ring-gold" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-navy/60 uppercase block mb-1">Author / Credit Location</label>
                                            <input type="text" value={spotlightAuthor} onChange={(e) => setSpotlightAuthor(e.target.value)} className="w-full px-3 py-2 border border-stone/30 rounded-lg text-sm text-navy focus:ring-1 focus:ring-gold" />
                                        </div>
                                    </div>
                                )}

                                {/* AI Image Slot compilation controls */}
                                <div className="pt-2 border-t border-stone/10 space-y-4">
                                    
                                    {/* IMAGE SLOT 1 */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-navy/60 uppercase block mb-1">
                                            {postType === 'on-this-day' ? 'Left Image (Portrait)' : postType === 'versus-debate' ? 'Left Player Image' : 'Featured Product Image'}
                                        </label>
                                        
                                        {/* Prompt generator */}
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                value={slot1Prompt}
                                                onChange={(e) => setSlot1Prompt(e.target.value)}
                                                placeholder="AI Image prompt..."
                                                className="flex-1 px-3 py-1.5 border border-stone/30 rounded-lg text-xs text-navy focus:ring-1 focus:ring-gold"
                                            />
                                            <button 
                                                onClick={() => generateAIImage(slot1Prompt, 'slot1')}
                                                disabled={isGenSlot1 || !slot1Prompt.trim()}
                                                className="px-3 bg-navy text-white rounded-lg flex items-center justify-center gap-1 hover:bg-navy/90 text-xs font-bold disabled:opacity-50 min-w-[110px]"
                                            >
                                                <Wand2 className={`w-3.5 h-3.5 ${isGenSlot1 ? 'animate-spin' : ''}`} />
                                                {isGenSlot1 ? 'Generating' : 'AI Generate'}
                                            </button>
                                        </div>

                                        {/* Manual fallback */}
                                        <div className="flex gap-2 items-center">
                                            <label className="flex-1 border border-dashed border-navy/20 hover:border-gold rounded-lg py-1.5 text-center cursor-pointer relative bg-stone/5">
                                                <input type="file" className="absolute inset-0 opacity-0" accept="image/*" onChange={(e) => handleImageUpload(e, 'slot1')} />
                                                <span className="text-[10px] font-semibold text-navy/70 block">Manual Upload Fallback</span>
                                            </label>
                                            {imageSlot1 && <button onClick={() => setImageSlot1(null)} className="px-2 py-1 text-red-600 border border-red-100 rounded-lg text-[10px] font-bold">Reset</button>}
                                        </div>
                                    </div>

                                    {/* IMAGE SLOT 2 (Only active for On This Day and Versus layouts) */}
                                    {(postType === 'on-this-day' || postType === 'versus-debate') && (
                                        <div className="space-y-2 pt-2 border-t border-stone/10">
                                            <label className="text-xs font-bold text-navy/60 uppercase block mb-1">
                                                {postType === 'on-this-day' ? 'Right Image (Landscape)' : 'Right Player Image'}
                                            </label>

                                            {/* Prompt generator */}
                                            <div className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    value={slot2Prompt}
                                                    onChange={(e) => setSlot2Prompt(e.target.value)}
                                                    placeholder="AI Image prompt..."
                                                    className="flex-1 px-3 py-1.5 border border-stone/30 rounded-lg text-xs text-navy focus:ring-1 focus:ring-gold"
                                                />
                                                <button 
                                                    onClick={() => generateAIImage(slot2Prompt, 'slot2')}
                                                    disabled={isGenSlot2 || !slot2Prompt.trim()}
                                                    className="px-3 bg-navy text-white rounded-lg flex items-center justify-center gap-1 hover:bg-navy/90 text-xs font-bold disabled:opacity-50 min-w-[110px]"
                                                >
                                                    <Wand2 className={`w-3.5 h-3.5 ${isGenSlot2 ? 'animate-spin' : ''}`} />
                                                    {isGenSlot2 ? 'Generating' : 'AI Generate'}
                                                </button>
                                            </div>

                                            {/* Manual fallback */}
                                            <div className="flex gap-2 items-center">
                                                <label className="flex-1 border border-dashed border-navy/20 hover:border-gold rounded-lg py-1.5 text-center cursor-pointer relative bg-stone/5">
                                                    <input type="file" className="absolute inset-0 opacity-0" accept="image/*" onChange={(e) => handleImageUpload(e, 'slot2')} />
                                                    <span className="text-[10px] font-semibold text-navy/70 block">Manual Upload Fallback</span>
                                                </label>
                                                {imageSlot2 && <button onClick={() => setImageSlot2(null)} className="px-2 py-1 text-red-600 border border-red-100 rounded-lg text-[10px] font-bold">Reset</button>}
                                            </div>
                                        </div>
                                    )}

                                </div>

                            </div>
                        </div>

                    </div>

                    {/* Right Panel: Work Preview Canvas */}
                    <div className="lg:col-span-7 flex flex-col items-center">
                        
                        {/* Tab Toggle */}
                        <div className="flex bg-navy/5 p-1 rounded-lg border border-navy/10 w-full max-w-md justify-between mb-6">
                            <button
                                onClick={() => setActiveTab('slide1')}
                                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'slide1' ? 'bg-navy text-white shadow-sm' : 'text-navy/60 hover:text-navy'}`}
                            >
                                Slide 1: Hook Preview
                            </button>
                            <button
                                onClick={() => setActiveTab('slide2')}
                                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'slide2' ? 'bg-navy text-white shadow-sm' : 'text-navy/60 hover:text-navy'}`}
                            >
                                Slide 2: Details Preview
                            </button>
                        </div>

                        {/* Interactive WYSIWYG Mockup matching template screenshots */}
                        <div className="w-full aspect-square max-w-[500px] border border-stone/30 shadow-2xl relative bg-[#0B1221] overflow-hidden select-none mb-8 rounded-lg">
                            
                            {activeTab === 'slide1' ? (
                                // SLIDE 1 PREVIEW HTML
                                <div className="absolute inset-0 flex flex-col">
                                    {/* Top banner */}
                                    <div className="bg-[#0B1221] w-full py-6 px-8 flex flex-col justify-center items-center text-center border-b-[3px] border-gold relative" style={{ height: '25%' }}>
                                        {/* Logo in top-right */}
                                        <div className="absolute right-4 top-3 flex flex-col items-center">
                                            <div className="w-8 h-8 border border-gold flex items-center justify-center text-[10px] text-gold font-serif">S</div>
                                            <span className="text-[5px] text-gold mt-1 uppercase font-bold tracking-widest leading-none">Sports Signed</span>
                                        </div>

                                        <h2 className="font-serif text-white text-xl md:text-2xl font-bold leading-tight select-text">{slide1Hook}</h2>
                                        <p className="text-white/80 font-sans text-[10px] md:text-xs font-medium mt-1 select-text line-clamp-2 px-10">{slide1Sub}</p>
                                    </div>

                                    {/* Split content */}
                                    <div className="flex-1 flex" style={{ height: '75%' }}>
                                        {/* Left Side: Vintage Scroll representation */}
                                        <div className="w-1/2 h-full bg-[#ECE3D4] p-4 flex flex-col relative overflow-hidden shadow-inner">
                                            {slide1LeftImg ? (
                                                <img src={slide1LeftImg} className="absolute inset-0 w-full h-full object-cover" alt="vintage scroll background" />
                                            ) : (
                                                <div className="absolute inset-0 bg-[#ECE3D4] opacity-90 p-4 flex flex-col justify-center gap-1.5 border-r border-[#d4cfc5]">
                                                    <div className="h-0.5 bg-[#4b351a]/10 w-full"></div>
                                                    <div className="h-0.5 bg-[#4b351a]/10 w-4/5"></div>
                                                    <div className="h-0.5 bg-[#4b351a]/10 w-11/12"></div>
                                                    <div className="h-0.5 bg-[#4b351a]/10 w-3/4"></div>
                                                    <div className="h-0.5 bg-[#4b351a]/10 w-5/6"></div>
                                                    <div className="h-0.5 bg-[#4b351a]/10 w-11/12"></div>
                                                    <div className="h-0.5 bg-[#4b351a]/10 w-2/3"></div>
                                                    <div className="h-0.5 bg-[#4b351a]/10 w-4/5"></div>
                                                    <div className="h-0.5 bg-[#4b351a]/10 w-full"></div>
                                                    <div className="h-0.5 bg-[#4b351a]/10 w-5/6"></div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right Side: Interior room shot preview */}
                                        <div className="w-1/2 h-full bg-[#1A2A44] relative overflow-hidden">
                                            {slide1RightImg ? (
                                                <img src={slide1RightImg} className="absolute inset-0 w-full h-full object-cover" alt="interior design background" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center bg-[#1A2A44]/60">
                                                    <ImageIcon className="w-10 h-10 text-white/30" />
                                                </div>
                                            )}

                                            {/* Bottom watermark */}
                                            <div className="absolute bottom-4 left-0 right-0 text-center z-10">
                                                <span className="text-[10px] md:text-xs font-semibold text-white/80 select-text">sportssigned.com</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // SLIDE 2 DETAILS PREVIEW (Contextual depending on post type)
                                <div className="absolute inset-0 bg-[#0B1221] p-6 flex flex-col justify-between">
                                    
                                    {/* Headers */}
                                    <div className="text-center mt-2 flex flex-col items-center">
                                        <h2 className="font-serif text-[#c6a664] text-2xl font-bold leading-tight select-text">{slide2Title}</h2>
                                        <p className="text-white font-sans text-[11px] md:text-xs font-medium mt-1 select-text px-8">{slide2Subtitle}</p>
                                    </div>

                                    {/* Contextual Canvas Area */}
                                    <div className="flex-1 relative w-full my-4 overflow-hidden">
                                        
                                        {postType === 'on-this-day' && (
                                            <>
                                                {/* Overlapping Gold Frames */}
                                                <div className="absolute left-[8%] top-[10%] w-[42%] h-[68%] border-[4px] border-[#c6a664] bg-[#1e293b] overflow-hidden shadow-2xl flex items-center justify-center">
                                                    {imageSlot1 ? <img src={imageSlot1} className="w-full h-full object-cover" alt="historical asset 1" /> : <ImageIcon className="w-8 h-8 text-white/20" />}
                                                </div>
                                                <div className="absolute right-[8%] bottom-[12%] w-[46%] h-[48%] border-[4px] border-[#c6a664] bg-[#1e293b] overflow-hidden shadow-2xl flex items-center justify-center z-10">
                                                    {imageSlot2 ? <img src={imageSlot2} className="w-full h-full object-cover" alt="historical asset 2" /> : <ImageIcon className="w-8 h-8 text-white/20" />}
                                                </div>
                                            </>
                                        )}

                                        {postType === 'versus-debate' && (
                                            <>
                                                {/* Side-by-side player images with VS in center */}
                                                <div className="absolute left-[6%] top-[12%] w-[40%] h-[72%] border-[4px] border-[#c6a664] bg-[#1e293b] overflow-hidden shadow-2xl flex items-center justify-center">
                                                    {imageSlot1 ? (
                                                        <div className="w-full h-full relative">
                                                            <img src={imageSlot1} className="w-full h-full object-cover" alt="debate side 1" />
                                                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1.5 text-center text-white text-[10px] font-bold">{vsLeftLabel}</div>
                                                        </div>
                                                    ) : <ImageIcon className="w-8 h-8 text-white/20" />}
                                                </div>
                                                <div className="absolute right-[6%] top-[12%] w-[40%] h-[72%] border-[4px] border-[#c6a664] bg-[#1e293b] overflow-hidden shadow-2xl flex items-center justify-center">
                                                    {imageSlot2 ? (
                                                        <div className="w-full h-full relative">
                                                            <img src={imageSlot2} className="w-full h-full object-cover" alt="debate side 2" />
                                                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1.5 text-center text-white text-[10px] font-bold">{vsRightLabel}</div>
                                                        </div>
                                                    ) : <ImageIcon className="w-8 h-8 text-white/20" />}
                                                </div>
                                                <div className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-gradient-to-br from-gold to-gold/70 border-4 border-[#0B1221] rounded-full flex items-center justify-center shadow-xl z-20">
                                                    <span className="font-serif text-navy font-bold text-sm tracking-wider">VS</span>
                                                </div>
                                            </>
                                        )}

                                        {postType === 'checklist-tips' && (
                                            <div className="flex w-full h-full items-center gap-4 px-2">
                                                {/* Left side text list */}
                                                <div className="flex-1 flex flex-col justify-center gap-4 text-left">
                                                    {guideTips.map((tip, idx) => (
                                                        <div key={idx} className="flex gap-2 items-start">
                                                            <div className="w-4 h-4 border border-gold flex items-center justify-center text-[8px] text-gold font-bold mt-0.5">✓</div>
                                                            <span className="text-white text-[10px] md:text-[11px] leading-snug font-medium line-clamp-2">{tip}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                {/* Right side reference image */}
                                                <div className="w-[38%] h-[82%] border-[4px] border-[#c6a664] bg-[#1e293b] overflow-hidden shadow-xl flex items-center justify-center">
                                                    {imageSlot1 ? <img src={imageSlot1} className="w-full h-full object-cover" alt="guide reference" /> : <ImageIcon className="w-6 h-6 text-white/20" />}
                                                </div>
                                            </div>
                                        )}

                                        {postType === 'product-spotlight' && (
                                            <div className="flex flex-col w-full h-full justify-between items-center py-2">
                                                {/* Product image */}
                                                <div className="w-[60%] h-[56%] border-[4px] border-[#c6a664] bg-[#1e293b] overflow-hidden shadow-xl flex items-center justify-center">
                                                    {imageSlot1 ? <img src={imageSlot1} className="w-full h-full object-cover" alt="spotlight product" /> : <ImageIcon className="w-8 h-8 text-white/20" />}
                                                </div>
                                                {/* Testimonial Quote frame */}
                                                <div className="w-[90%] border border-gold/30 bg-white/5 p-3 text-center rounded">
                                                    <p className="font-serif italic text-gold text-[11px] leading-snug select-text">"{spotlightQuote}"</p>
                                                    <span className="text-white/50 text-[9px] font-semibold block mt-1 select-text">— {spotlightAuthor}</span>
                                                </div>
                                            </div>
                                        )}

                                    </div>

                                    {/* Footer Branding */}
                                    <div className="flex justify-between items-end border-t border-white/5 pt-3">
                                        <div className="w-8 h-8 border border-gold flex items-center justify-center text-[11px] text-gold font-serif font-bold">S</div>
                                        <div className="text-right">
                                            <span className="text-[12px] text-gold block font-serif font-bold leading-none">SPORTS SIGNED</span>
                                            <span className="text-[6px] text-white/40 block tracking-widest mt-0.5">MEMORABILIA STORE</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Download Controls */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                            <button
                                onClick={() => triggerDownload(slide1Output, `social-slide1-hook.jpg`)}
                                disabled={!slide1Output}
                                className="flex-1 py-3 bg-gold hover:bg-gold/90 text-navy font-bold rounded-lg flex items-center justify-center gap-2 shadow hover:-translate-y-0.5 transition-all disabled:opacity-50 text-sm font-semibold"
                            >
                                <Download className="w-4 h-4" /> Download Slide 1 (Hook)
                            </button>

                            <button
                                onClick={() => triggerDownload(slide2Output, `social-slide2-${postType}.jpg`)}
                                disabled={!slide2Output}
                                className="flex-1 py-3 bg-gold hover:bg-gold/90 text-navy font-bold rounded-lg flex items-center justify-center gap-2 shadow hover:-translate-y-0.5 transition-all disabled:opacity-50 text-sm font-semibold"
                            >
                                <Download className="w-4 h-4" /> Download Slide 2 (Details)
                            </button>
                        </div>

                    </div>

                </div>

                {/* Compile cache offline canvas */}
                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

            </div>
        </div>
    );
}
