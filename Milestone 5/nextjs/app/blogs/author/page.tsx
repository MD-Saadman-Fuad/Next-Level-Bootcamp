// "use client";
import React from "react";

const page = async () => {
  const post = await fetch("https://jsonplaceholder.typicode.com/posts");
  const postData = await post.json();
  console.log(postData);
  return <div>Author Page</div>;
};

export default page;
