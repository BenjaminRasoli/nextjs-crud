"use client";
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import "./styles/post.scss"; // Make sure the styles are linked

function Page() {
  interface PostData {
    project: string;
    test1: string;
    test2: string;
  }

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  // const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // For preview

  const [formData, setFormData] = useState<PostData>({
    project: "",
    test1: "",
    test2: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(files);
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result as string); // Set preview as base64 string
      };

      if (files[0]) {
        reader.readAsDataURL(files[0]); // Read the first selected file
      }
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFiles) {
      return;
    }

    const image = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      image.append("file", file);
    });
    image.append("upload_preset", "djdus2et"); // Use your actual Cloudinary preset

    const cloudinaryUrl = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    try {
      const response = await fetch(cloudinaryUrl, {
        method: "POST",
        body: image,
      });

      if (response.ok) {
        const data = await response.json();
        return data.secure_url;
      } else {
        console.error("Failed to upload image:", response);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePost = async (e) => {
    e.preventDefault();

    const imageUrl = await handleFileUpload(e);

    if (!imageUrl) {
      console.log("No image uploaded");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "post"), {
        name: formData.project,
        test1: formData.test1,
        test2: formData.test2,
        imageUrl: imageUrl,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <div className="container">
      <h1>Post</h1>

      {/* Image file selection and preview */}
      <form className="loginForm" onSubmit={handleFileUpload}>
        <div className="upload-field">
          <label htmlFor="projectDescription" className="upload-label">
            Project image file
          </label>
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            className="upload-input"
          />
        </div>

        {imagePreview && (
          <div className="image-preview">
            <h3 className="upload-label">Image Preview</h3>
            <img
              src={imagePreview}
              alt="Selected Preview"
              className="image-preview-img"
            />
          </div>
        )}
      </form>

      {/* Form for submitting project details */}
      <form className="loginForm" onSubmit={(e) => handlePost(e)}>
        <input
          name="project"
          value={formData.project}
          type="text"
          placeholder="Project"
          onChange={handleChange}
          className="input-field"
        />
        <input
          name="test1"
          value={formData.test1}
          type="text"
          placeholder="Test 1"
          onChange={handleChange}
          className="input-field"
        />
        <input
          name="test2"
          value={formData.test2}
          type="text"
          placeholder="Test 2"
          onChange={handleChange}
          className="input-field"
        />
        <button type="submit" className="submit-button">
          Post
        </button>
      </form>
    </div>
  );
}

export default Page;
