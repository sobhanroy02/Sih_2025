// Get token from environment variable
const HF_ACCESS_TOKEN = process.env.NEXT_PUBLIC_HUGGING_FACE_TOKEN || '';

interface Detection {
  label: string;
  score: number;
  box?: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  };
}

interface ClassificationResult {
  category: string;
  confidence: number;
  originalLabel: string;
  suggestedTitle: string;
}

export async function classifyImage(imageFile: File) {
  try {
    // Convert the image file to base64
    const base64Image = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove data URL prefix
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });

    // Make request to Hugging Face API - Using a model fine-tuned for infrastructure and object detection
    const response = await fetch(
      'https://api-inference.huggingface.co/models/facebook/detr-resnet-50',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: base64Image })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to classify image');
    }

    const predictions = (await response.json()) as Detection[];
    
    // Analyze all detected objects in the image
    const detections = predictions || [];
    
    // Define keywords that map to different categories
    const categoryKeywords = {
      infrastructure: ['pothole', 'road', 'pavement', 'crack', 'hole', 'street', 'sidewalk'],
      utilities: ['pole', 'wire', 'light', 'electricity', 'transformer', 'lamp', 'bulb'],
      sanitation: ['garbage', 'waste', 'trash', 'bin', 'dump', 'sewage', 'drain'],
      environment: ['tree', 'water', 'flood', 'plant', 'pollution'],
      transportation: ['traffic', 'signal', 'sign', 'vehicle', 'bus', 'car'],
      safety: ['construction', 'fence', 'barrier', 'warning', 'danger']
    };

    // Find matches between detected objects and categories
    let bestMatch = { category: 'other', confidence: 0, label: '' };
    
    for (const detection of detections) {
      const detectedLabel = detection.label.toLowerCase();
      const confidence = detection.score;

      // Check each category's keywords
      for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(keyword => detectedLabel.includes(keyword)) && confidence > bestMatch.confidence) {
          bestMatch = {
            category,
            confidence,
            label: detectedLabel
          };
        }
      }
    }

    // Map common objects to specific issue types
    const specificIssueMap: { [key: string]: string } = {
      'pothole': 'Road Pothole Issue',
      'crack': 'Road Surface Crack',
      'garbage': 'Garbage Collection Required',
      'pole': 'Electric Pole Issue',
      'light': 'Street Light Problem',
      'wire': 'Exposed Wire Issue',
      'water': 'Water Logging Issue',
      'tree': 'Fallen Tree Problem',
      'signal': 'Traffic Signal Malfunction'
    };

    // Generate specific title based on detected object
    let suggestedTitle = 'General Issue Report';
    for (const [keyword, title] of Object.entries(specificIssueMap)) {
      if (bestMatch.label.includes(keyword)) {
        suggestedTitle = title;
        break;
      }
    }

    const result: ClassificationResult = {
      category: bestMatch.category,
      confidence: bestMatch.confidence,
      originalLabel: bestMatch.label,
      suggestedTitle: suggestedTitle
    };

    console.log('Image Analysis Result:', {
      detections: detections.map((d: Detection) => ({ label: d.label, confidence: d.score })),
      selectedCategory: bestMatch.category,
      confidence: bestMatch.confidence,
      title: suggestedTitle
    });

    return result;

  } catch (error) {
    console.error('Error classifying image:', error);
    return null;
  }
}