"use client";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./config/firebase-config";
import placeHolder from "./assets/placeholder-icon-design-free-vector.jpg";
import "./home.scss";
import Image from "next/image";

interface Post {
  id: string;
  name: string;
  imageUrl: string;
  test1: string;
  test2: string;
  [key: string]: any;
}

function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "post"),
      (snapShot) => {
        const list: Post[] = snapShot.docs.map((doc) => {
          const data = doc.data() as Post;
          return { id: doc.id, ...data };
        });
        console.log("Fetched Posts:", list);
        setPosts(list);
      },
      (error) => {
        console.error("Error fetching posts:", error);
      }
    );

    return () => unsub();
  }, []);

  return (
    <>
      <div className="home-container">
        <h1>Project List</h1>
        {posts.length > 0 ? (
          <ul className="posts-grid">
            {posts.map((post) => (
              <li className="post-card" key={post.id}>
                <Image
                  width={500}
                  height={500}
                  src={post.imageUrl || placeHolder}
                  alt={post.name || "Unnamed Post"}
                />

                <div className="card-content">
                  <h3>{post.name || "Unnamed Post"}</h3>
                  <p>test1: {post.test1 || "N/A"}</p>
                  <p>test2: {post.test2 || "N/A"}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No projects available</p>
        )}
      </div>
    </>
  );
}

export default Home;
