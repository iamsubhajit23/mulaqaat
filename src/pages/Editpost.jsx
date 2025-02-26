import React, { useState, useEffect } from 'react'
import { Container, PostForm } from '../components'
import services from '../appWrite/config'
import { useParams, useNavigate } from 'react-router-dom'

function Editpost() {
    const [post, setPosts] = useState(null)
    const { slug } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (slug) {
            services.getPost(slug).then((post) => {
                if (post) {
                    console.log("Post data:", post);
                    setPosts(post)
                }
            }).catch((error) =>{
                console.error("error fetching post: ", error)
            })
        }
        else {
            navigate('/')
        }
    }, [slug, navigate])
    return post ? (
        <div className='py-8'>
            <Container>
                <PostForm post={post} />
            </Container>
        </div>
      ) : null
}

export default Editpost