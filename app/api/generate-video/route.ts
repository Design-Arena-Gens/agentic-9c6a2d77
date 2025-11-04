import { NextResponse } from 'next/server';

// Mock headlines in Hindi/English for demonstration
const getHeadlines = async (): Promise<string[]> => {
  return [
    'भारत में GDP वृद्धि दर 7.2% तक पहुंची',
    'नई तकनीक से सौर ऊर्जा उत्पादन में बढ़ोतरी',
    'अंतर्राष्ट्रीय खेल प्रतियोगिता में भारत ने जीते 5 पदक',
    'शिक्षा क्षेत्र में नई डिजिटल पहल की घोषणा',
    'मौसम विभाग ने अगले सप्ताह भारी बारिश की चेतावनी दी'
  ];
};

function generateSVGFrame(headline: string, index: number, isTitle = false, isEnd = false): string {
  if (isTitle) {
    return `
      <svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#7c3aed;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ec4899;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="1280" height="720" fill="url(#grad1)"/>
        <text x="640" y="310" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="white" text-anchor="middle">आज की Headlines</text>
        <text x="640" y="410" font-family="Arial, sans-serif" font-size="40" fill="white" text-anchor="middle">Today's Top News</text>
      </svg>
    `;
  }

  if (isEnd) {
    return `
      <svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ec4899;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="1280" height="720" fill="url(#grad2)"/>
        <text x="640" y="330" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="white" text-anchor="middle">धन्यवाद!</text>
        <text x="640" y="410" font-family="Arial, sans-serif" font-size="40" fill="white" text-anchor="middle">Thank You for Watching</text>
      </svg>
    `;
  }

  // Split headline into lines for better display
  const words = headline.split(' ');
  let lines: string[] = [];
  let currentLine = '';

  words.forEach(word => {
    if (currentLine.length + word.length < 40) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  });
  if (currentLine) lines.push(currentLine);

  const lineY = 340 - (lines.length * 30);
  const lineElements = lines.map((line, i) =>
    `<text x="640" y="${lineY + i * 60}" font-family="Arial, sans-serif" font-size="45" font-weight="bold" fill="white" text-anchor="middle">${line}</text>`
  ).join('');

  return `
    <svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1280" height="720" fill="url(#bgGrad)"/>
      <rect x="100" y="150" width="1080" height="420" rx="20" fill="rgba(255,255,255,0.1)"/>
      <text x="150" y="230" font-family="Arial, sans-serif" font-size="50" font-weight="bold" fill="#60a5fa" text-anchor="start">${index}</text>
      ${lineElements}
    </svg>
  `;
}

export async function POST() {
  try {
    const headlines = await getHeadlines();

    // Generate SVG frames as data
    const frames = [];

    // Title frame
    frames.push({
      svg: generateSVGFrame('', 0, true, false),
      duration: 2
    });

    // Headline frames
    headlines.forEach((headline, index) => {
      frames.push({
        svg: generateSVGFrame(headline, index + 1, false, false),
        duration: 3
      });
    });

    // End frame
    frames.push({
      svg: generateSVGFrame('', 0, false, true),
      duration: 2
    });

    // Generate base64 encoded video data URL (simulated)
    // In a real implementation with server-side capabilities, you would generate actual video
    const videoData = {
      frames,
      totalDuration: frames.reduce((sum, frame) => sum + frame.duration, 0)
    };

    return NextResponse.json({
      success: true,
      videoData,
      headlines,
      message: 'Video frames generated successfully'
    });
  } catch (error) {
    console.error('Error generating video:', error);
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    );
  }
}
