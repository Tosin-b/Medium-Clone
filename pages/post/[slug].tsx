import { GetStaticProps } from 'next'
import React from 'react'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'
import PortableText from 'react-portable-text'

interface Props {
  post: Post
}
function Post({ post }: Props) {
  console.log(post)
  return (
    <main>
      <Header />
      <img
        className="object-cover w-full h-40"
        src={urlFor(post.mainImage).url()!}
        alt=""
      />
      <article className="max-w-3xl p-5 mx-auto">
        <h1 className="mt-10 mb-3 text-3xl ">{post.title} </h1>
        <h2 className="text-xl font-light text-gray-500">{post.description}</h2>
        <div className="flex items-center space-x-2">
          <img
            className="w-10 h-10 border-2 rounded-full"
            src={urlFor(post.author.image).url()!}
            alt=""
          />
          <p className="text-sm font-extralight ">
            {' '}
            Blog post by{' '}
            <span className="text-green-600">{post.author.name}</span> -
            Publsished at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>
        <div>
          <PortableText
            content={post.body}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            serializers={{
                h1: (props:any) =>(
                    <h1 className='my-5 text-2xl font-bold ' {...props}/>
                ),
                h2: (props:any) =>(
                    <h1 className='my-5 text-xl font-bold '{...props}/>
                ),
                li: ({children}: any) =>(
                    <h1 className='ml-4 list-disc'>{children}</h1>
                ),
                link:({href,children}:any) =>(
                    <a href={href} className="text-blue-400 hover:underline">
                        {children}
                    </a>
                ),
                img: (props:any)=>(
                    <img className='object-cover w-full h-40' src={props} alt=''{...props}/>
                )
                
            }}
          />
        </div>
      </article>
    </main>
  )
}

export default Post

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
        _id,
        slug{
        current
      }
      }
      `
  const posts = await sanityClient.fetch(query)
  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))
  return {
    paths,
    fallback: 'blocking',
  }
}
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
          title,
          author ->{
          name,
          image
           },
        description,
        mainImage,
        slug,
      body
      }`

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })
  if (!post) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      post,
    },
    revalidate: 60, /// after 60 s it will update the odl cache
  }
}
