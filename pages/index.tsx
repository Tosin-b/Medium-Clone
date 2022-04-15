import Head from 'next/head'
import Header from '../components/Header'
import Banner from '../components/Banner'
import { sanityClient,urlFor } from '../sanity'
import {Post} from '../typings'
import Link from 'next/link'
interface Props{
  posts:[Post];
}
export default function Home({posts}: Props) {
  console.log(posts)
  return (
    <div className='mx-auto max-w-7xl'>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />

      </Head>
      <Header/>
  <Banner/>
  {/*  Posts*/}
  <div className='grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 lg:grid-cols-3 md:gap-6 lg:p-6'>
    {posts.map(post =>(
      <Link key={post._id} href={`/post/${post.slug?.current}`}>
        <div className='overflow-hidden border rounded-lg cursor-pointer group' >
          <img className='object-cover w-full transition-transform duration-200 ease-in-out h-60 group-hover:scale-105' src={urlFor(post.mainImage).url()} alt=''/>
          <div className='flex justify-between p-5 bg-white'>
            <div >
              <p className='text-lg font-bold'>{post.title}</p>
              <p className='text-xs'> {post.description} by {post.author.name}</p>
            </div>
            <img className='w-12 h-12 rounded-full' src={urlFor(post.author.image).url()} alt=''/>
          </div>
        </div>
      </Link>
    ))}
  </div>
    </div>
  )
}
export const getServerSideProps = async ()=>{
  const query = `*[_type == "post"]{
    _id,
    _createdAt,
    title,
    slug,
    author ->{
    name,
    image
     },
  description,
  mainImage,
  slug
  }`;
 
  const posts  = await sanityClient.fetch(query)
  return {
    props:{
      posts,
    }
  }
}
 