"use client";
import React, { useContext, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import "./styles/post.scss";
import { AuthContext } from "@/app/context/AuthContext";
import { User } from "@/app/context/AuthReducer";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Page() {
  interface PostData {
    project: string;
    description: string;
    currentUser: User;
  }

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { currentUser } = useContext(AuthContext);

  const [formData, setFormData] = useState<PostData>({
    project: "",
    description: "",
    currentUser: {
      email: "",
      password: "",
      uid: "",
      firstName: "",
      lastName: "",
      userName: "",
    },
  });
  const router = useRouter();

  const [errors, setErrors] = useState({
    project: "",
    description: "",
    file: "",
  });

  const validateForm = (): boolean => {
    const newErrors = {
      project: "",
      description: "",
      file: "",
    };
    if (formData.project.trim() === "") {
      newErrors.project = "Project name cannot be empty.";
    }
    if (formData.description.trim() === "") {
      newErrors.description = "Description name cannot be empty.";
    }
    if (!selectedFiles || selectedFiles.length === 0) {
      newErrors.file = "An image must be uploaded.";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

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

    const cloudinaryPrest = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudinaryPrest) {
      throw new Error("Cloudinary upload preset is not set.");
    }
    image.append("upload_preset", cloudinaryPrest);
    const cloudinaryUrl = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    if (!cloudinaryUrl) {
      throw new Error(
        "Cloudinary API URL is not set in the environment variables."
      );
    }
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

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);

    const imageUrl = await handleFileUpload(e);

    if (!imageUrl) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        file: "Failed to upload the image. Please try again.",
      }));
      return;
    }
    try {
      if (currentUser?.uid) {
        await setDoc(doc(db, "post", currentUser.uid), {
          name: formData.project,
          description: formData.description,
          imageUrl: imageUrl,
          userId: currentUser.uid,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          userName: currentUser.userName,
        });
      } else {
        console.error("No user is logged in or user UID is undefined");
      }

      router.push("/");
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <div>
      {currentUser ? (
        <div className="container">
          <h1 style={{ color: "#cccaca" }}>Post</h1>
          <form className="uploadForm" onSubmit={handleFileUpload}>
            <div className="upload-field">
              <label htmlFor="file" className="custom-file-label">
                Choose File
              </label>
              <input
                type="file"
                name="file"
                id="file"
                onChange={handleFileChange}
                className="upload-input"
              />
              {selectedFiles && selectedFiles.length > 0 && (
                <span className="file-name">{selectedFiles[0].name}</span>
              )}
              {errors.file && <span className="error">{errors.file}</span>}
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

          <form className="uploadForm" onSubmit={(e) => handlePost(e)}>
            <div className="input-group">
              <input
                name="project"
                value={formData.project}
                type="text"
                placeholder="Project"
                onChange={handleChange}
                className="input-field"
                maxLength={15}
              />
              {errors.project && (
                <span className="error">{errors.project}</span>
              )}
            </div>
            <div className="input-group">
              <input
                name="description"
                value={formData.description}
                type="text"
                placeholder="Description"
                onChange={handleChange}
                className="input-field"
              />
              {errors.description && (
                <span className="error">{errors.description}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? "Posting...." : "Post"}
            </button>
          </form>
        </div>
      ) : (
        <div className="post-text">
          Please
          <Link href="/login" className="link">
            login
          </Link>
          or
          <Link href="/signup" className="link">
            sign up
          </Link>
          first
        </div>
      )}
    </div>
  );
}

export default Page;
