import React, { useEffect, useState } from "react";

// Function to convert image URL to base64 with compression
const imageUrlToBase64 = async (url: string, quality = 0.7, maxWidth = 300, maxHeight = 150) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      
      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      
      // Set white background to prevent black background
      ctx!.fillStyle = '#ffffff';
      ctx!.fillRect(0, 0, width, height);
      
      // Enable image smoothing for better quality
      ctx!.imageSmoothingEnabled = true;
      ctx!.imageSmoothingQuality = 'high';
      
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Use PNG format to preserve transparency and quality
      const dataURL = canvas.toDataURL("image/png", quality);
      resolve(dataURL);
    };
    img.onerror = (error) => reject(error);
    img.src = url;
  });
};

interface CompressedLogoProps {
  imageUrl: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

const CompressedLogo = ({ imageUrl, alt, className, style }: CompressedLogoProps) => {
  const [base64Image, setBase64Image] = useState("");

  useEffect(() => {
    const convertImageToBase64 = async () => {
      try {
        // Use moderate compression to maintain quality while reducing size
        const base64 = await imageUrlToBase64(imageUrl, 0.8, 200, 100);
        setBase64Image(base64 as string);
      } catch (error) {
        console.error('Failed to compress logo:', error);
        // Fallback to original image if compression fails
        setBase64Image(imageUrl);
      }
    };

    if (imageUrl) {
      convertImageToBase64();
    }
  }, [imageUrl]);

  return (
    <img 
      src={base64Image || imageUrl} 
      className={className} 
      alt={alt}
      style={style}
    />
  );
};

export default CompressedLogo;
