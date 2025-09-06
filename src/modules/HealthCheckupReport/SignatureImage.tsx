import Toast from "@components/Common/Toast";
import React, { useEffect, useState } from "react";

// Function to convert image URL to base64 with compression
const imageUrlToBase64 = async (url: string, quality = 1.0) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      const format = quality < 1 ? "image/jpeg" : "image/png";
      const dataURL = canvas.toDataURL(format, quality);
      resolve(dataURL);
    };
    img.onerror = (error) => reject(error);
    img.src = url;
  });
};

const SignatureImage = ({ imageUrl }: {imageUrl: string}) => {
  const [base64Image, setBase64Image] = useState("");

  useEffect(() => {
    const convertImageToBase64 = async () => {
      try {
        const base64 = await imageUrlToBase64(imageUrl, 0.5);
        setBase64Image(base64 as string);
      } catch (error) {
        Toast("error", '', 'Fail to generate base64 data')
      }
    };

    if (imageUrl) {
      convertImageToBase64();
    }
  }, [imageUrl]);

  return <img src={base64Image} className="sign-img" alt="Signature" />;
};

export default SignatureImage;
