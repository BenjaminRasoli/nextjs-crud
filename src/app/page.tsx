"use client";
import { useContext, useEffect, useState } from "react";
import { db } from "./config/firebase-config";
import placeHolder from "./assets/placeholder-icon-design-free-vector.jpg";
import "./home.scss";
import Image from "next/image";
import { AuthContext } from "./context/AuthContext";
import { User } from "./context/AuthReducer";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { BarLoader } from "react-spinners";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

interface Post {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  currentUser: User;
  [key: string]: any;
}

function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { currentUser } = useContext(AuthContext);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Post>>({});

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "post"),
      (snapShot) => {
        const list: Post[] = snapShot.docs.map((doc) => {
          const data = doc.data() as Post;
          return { ...data, id: doc.id };
        });

        setPosts(list);
      },
      (error) => {
        console.error("Error fetching posts:", error);
      }
    );

    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "post", id));
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEditClick = (post: Post) => {
    setEditingPostId(post.id);
    setEditFormData(post);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async (id: string) => {
    try {
      const postRef = doc(db, "post", id);
      await setDoc(postRef, editFormData);
      setEditingPostId(null);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleCancel = () => {
    setEditingPostId(null);
  };

  return (
    <>
      <div className="container">
        <h1 className="home-h1">Project List</h1>
        {posts.length > 0 ? (
          <section className="post-grid">
            {posts.map((post) => (
              <div className="post-card" key={post.id}>
                <div>
                  <Image
                    width={500}
                    height={500}
                    src={post.imageUrl || placeHolder}
                    alt={post.name || "Unnamed Post"}
                    className="post-image"
                  />
                </div>
                <div className="card-content">
                  {editingPostId === post.id ? (
                    <>
                      <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={editFormData.name || ""}
                        onChange={handleEditChange}
                      />
                      <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={editFormData.description || ""}
                        onChange={handleEditChange}
                      />

                      <button onClick={() => handleSave(post.id)}>Save</button>
                      <button onClick={handleCancel}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <h3>{post.name || "Unnamed Post"}</h3>
                      <p className="post-description">
                        <b> description:</b> {post.description || "N/A"}
                      </p>
                      <p>
                        <b> owner:</b> {post.userName || "N/A"}
                      </p>
                      {post.id === currentUser?.uid ? (
                        <>
                          <div className="card-buttons">
                            <button
                              className="trashIcon"
                              onClick={() => handleDelete(post.id)}
                            >
                              <MdDelete size={30} />
                            </button>
                            <button
                              className="editIcon"
                              onClick={() => handleEditClick(post)}
                            >
                              <FaEdit size={30} />
                            </button>
                          </div>
                        </>
                      ) : null}
                    </>
                  )}
                </div>
              </div>
            ))}
          </section>
        ) : (
          <div>
            <BarLoader />
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
