"use client";
import React, { useContext, useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import "./styles/post.scss";
import { AuthContext } from "@/app/context/AuthContext";
import { User } from "@/app/context/AuthReducer";
import { useRouter, usePathname } from "next/navigation";

function Page() {
  interface PostData {
    project: string;
    description: string;
    currentUser: User;
  }

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { currentUser } = useContext(AuthContext);

  const [formData, setFormData] = useState<PostData>({
    project: "",
    description: "",
    currentUser: { email: "", password: "", uid: "" },
  });

  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      setFormData((prevData) => ({
        ...prevData,
        currentUser: currentUser,
      }));
    }
  }, [currentUser]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(files);
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };

      if (files[0]) {
        reader.readAsDataURL(files[0]);
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
    image.append("upload_preset", "djdus2et");
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
        description: formData.description,
        imageUrl: imageUrl,
        currentUser: currentUser.uid,
      });
      console.log("Document written with ID: ", docRef.id);
      router.push("/");
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <div className="container">
      <h1>Post</h1>

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
          name="description"
          value={formData.description}
          type="text"
          placeholder="Description"
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