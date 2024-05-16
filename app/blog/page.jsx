import FristBlog from "../../components/FristBlog";
import OtherBlogs from "../../components/OtherBlogs";



async function fetchBlogs() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/blog`, {
    cache: "no-store"
  });
  if (res.ok) {
    return res.json();
  }

}

const Blog = async () => {

  const blogs = await fetchBlogs();

  const fristBlog = blogs && blogs[0];// single data convert
  const otherBlogs = blogs?.length > 0 && blogs.slice(1);
  console.log(fristBlog);

  return (
    <div>
      {blogs?.length > 0 ? (
        <>
          <div className="container">
            <h2 className="text-center my-10">
              <span className="text-primaryColor">Trending</span>{" "}Blog
            </h2>
            <FristBlog fristBlog={fristBlog} />
            <OtherBlogs otherBlogs={otherBlogs} />
          </div>
        </>
      ) : (
        <h2>No Blogs...</h2>
      )}
    </div>
  )
}

export default Blog