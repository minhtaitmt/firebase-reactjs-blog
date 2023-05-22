import {
    collection,
    endBefore,
    getDocs,
    limit,
    limitToLast,
    orderBy,
    query,
    startAfter,
  } from "firebase/firestore";
  import React from "react";
  import { useEffect } from "react";
  import { useState } from "react";
  import BlogSection from "../components/BlogSection";
  import Pagination from "../components/Pagination";
  import Spinner from "../components/Spinner";
  import { db } from "../firebase";
  
  const Blogs = ({setActive}) => {
    const [loading, setLoading] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastVisible, setLastVisible] = useState(null);
    const [noOfPages, setNoOfPages] = useState(null);
    const [beforePrev, setBeforePrev] = useState(null)
  
    useEffect(() => {
      getBlogsData();
      getTotalOfPages();
      setActive("blogs");
    }, [setActive]);
  
    if (loading) {
      return <Spinner />;
    }
  
    const getBlogsData = async () => {
      setLoading(true);
      const blogRef = collection(db, "blogs");
      const first = query(blogRef, orderBy("title"), limit(6));
      const docSnapshot = await getDocs(first);
      setBlogs(docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLastVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
      setLoading(false);
    };
  
    const getTotalOfPages = async () => {
      const blogRef = collection(db, "blogs");
      const docSnapshot = await getDocs(blogRef);
      const totalBlogs = docSnapshot.size;
      const totalPage = Math.ceil(totalBlogs / 6);
      setNoOfPages(totalPage);
    };
  
    const loadNext = async () => {
      setLoading(true);
      const blogRef = collection(db, "blogs");
      const nextBlogsQuery = query(
        blogRef,
        orderBy("title"),
        startAfter(lastVisible),
        limit(6)
      );
      const nextBlogsSnaphot = await getDocs(nextBlogsQuery);
      setBlogs(
        nextBlogsSnaphot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setBeforePrev(nextBlogsSnaphot.docs[0])
      setLastVisible(nextBlogsSnaphot.docs[nextBlogsSnaphot.docs.length - 1]);
      setLoading(false);
    };

    const loadPrev = async () => {
      setLoading(true);
      const blogRef = collection(db, "blogs");
      const prevBlogsQuery = query(blogRef, orderBy("title"), endBefore(beforePrev), limitToLast(6));
      const prevBlogsSnaphot = await getDocs(prevBlogsQuery);
      setBlogs(
        prevBlogsSnaphot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setBeforePrev(prevBlogsSnaphot.docs[0])
      setLastVisible(prevBlogsSnaphot.docs[prevBlogsSnaphot.docs.length - 1]);
      setLoading(false);
    };
  
    const handlePageChange = (value) => {
      if (value === "Next") {
        setCurrentPage((page) => page + 1);
        loadNext();
      } else if (value === "Prev") {
        setCurrentPage((page) => page - 1);
        loadPrev();
      }
    };
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="blog-heading text-center py-2 mb-4">Daily Blogs</div>
            {blogs?.map((blog) => (
              <div className="col-md-6" key={blog.id}>
                <BlogSection {...blog} />
              </div>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            noOfPages={noOfPages}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    );
  };
  
  export default Blogs;
  