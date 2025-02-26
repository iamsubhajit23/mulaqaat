import React from 'react'
import { Container, Postcard } from '../components'
import services from '../appWrite/config'
import { useState, useEffect } from 'react'

function Allpost() {
    const [posts, setPosts] = useState([])
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const posts = await services.getPosts([]);
                if (posts && posts.documents) {
                    setPosts(posts.documents)
                }
            } catch (error) {
                console.error("🚨 Error fetching posts:", error);
            }
        }
        fetchPosts();
    }, [])

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <Postcard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Allpost