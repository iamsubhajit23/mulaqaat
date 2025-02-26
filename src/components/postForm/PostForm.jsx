import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Input, RTE, Button, Select } from '../index'
import services from '../../appWrite/config'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'

function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, getValues, control } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  })
  const navigate = useNavigate()
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    console.log("Submitting data :", data);
    if (post) {
      const file = data.image[0] ? await services.uploadFile(data.image[0]) : null;
      if (file) {
        services.deleteFile(post.featuredImage);
      }
      const dbPost = await services.updatePost(post.$id, {
        ...data,
        featuredImage: file ? file.$id : undefined,
      })

      if (dbPost) {
        navigate(`/post/${dbPost.$id}`)
      }
    }
    else {
      const file = await services.uploadFile(data.image[0]);

      if (file) {
        const fileId = file.$id
        data.featuredImage = fileId
        const dbPost = await services.createPost({
          title: data.title,
          slug: data.slug,
          content: data.content,
          status: data.status,
          featuredImage: data.featuredImage,
          userId: userData.$id,
        });


        if (dbPost) {
          navigate(`/post/${dbPost.$id}`)
        }
      }
    }
  }

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
    } return "";
  }, []);

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
          }}
        />
        <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          onChange={(e) => setValue("image", e.target.files)}
        />

        {post && (
          <div className="w-full mb-4 flex justify-center items-center">
            <img
              src={services.previewFile(post.featuredImage)}
              alt={post.title}
              className="rounded-lg shadow-lg border border-gray-300 object-cover"
              style={{
                maxWidth: "100%",
                maxHeight: "250px",
                width: "auto",
                height: "auto"
              }}
            />
          </div>
        )}

        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  )
}

export default PostForm