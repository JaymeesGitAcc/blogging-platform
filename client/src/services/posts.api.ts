import { api } from "@/lib/api";

const getPostBySlug = async (slug:string | undefined) => {
    try {
        if(!slug)
            return null
        const response = await api.get(`/api/posts/${slug}`)
        const { data } = response.data
        // console.log(response);
        
        return { 
            postId: data._id,
            title: data.title,
            imageUrl: data?.coverImage?.url ,
            content: data.content,
            likes: data.likes,
            views: data.views,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            status: data.status,
            author: {
                authorId: data.author._id,
                name: data.author.name, 
                email: data.author.email
            },
            tags: data.tags
        }
    } catch (error:any) {
        console.log("getPostBySlug Error ::", error.message);
        return null
    }
}

const togglePostLike = async (postId:string | undefined) => {
    try {
        const response = await api.put(`/api/posts/${postId}/like`)
        // console.log(response);
        return response.data
    } catch (error:any) {
        console.log("togglePostLike Error::", error.message);
        return null
    }
}

export { getPostBySlug, togglePostLike }