import { Post } from "src/entities/Post";
import { Context } from "src/types";
import { queryError, wrapErrors } from "src/utils/errors";
import { toSlug } from "src/utils/slugs";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { QueryError } from "./errors/QueryError";
import CheckBans from "./guards/banned";
import { UpdatePostInput } from "./inputs/UpdatePostInput";

@ObjectType()
export class PostResponse {
  @Field(() => [QueryError], { nullable: true })
  errors?: QueryError[];

  @Field(() => Post, { nullable: true })
  post?: Post;
}

@ObjectType()
export class PostsResponse {
  @Field(() => [QueryError], { nullable: true })
  errors?: QueryError[];

  @Field(() => [Post], { nullable: true })
  posts?: Post[];
}

@Resolver()
export class PostResolver {
  @Mutation(() => PostResponse)
  @UseMiddleware(CheckBans)
  async post(
    @Arg("title") title: string,
    @Arg("content") content: string,
    @Ctx() { req }: Context
  ): Promise<PostResponse> {
    try {
      title = title.trim();
      content = content.trim();

      if (title.length < 5)
        return wrapErrors(queryError(400, "title length must be at least 5"));

      if (title.length > 100)
        return wrapErrors(
          queryError(400, "title length must be no more than 100")
        );

      if (content.length < 5)
        return wrapErrors(queryError(400, "content length must be at least 5"));

      if (content.length > 250)
        return wrapErrors(
          queryError(400, "content length must be no more than 250")
        );

      const post = await Post.create({
        authorId: req.session.user,
        content,
        title,
        slug: toSlug(title),
      }).save();

      return { post };
    } catch (e) {
      console.error(e);

      return wrapErrors(queryError(500, "internal server error"));
    }
  }

  @Mutation(() => PostResponse)
  @UseMiddleware(CheckBans)
  async editPost(
    @Arg("id") id: string,
    @Arg("data") { title, content }: UpdatePostInput,
    @Ctx() { req }: Context
  ): Promise<PostResponse> {
    try {
      const post = await Post.findOne({ id });

      if (!post) return wrapErrors(queryError(400, "post doesn't exist"));

      if (post.authorId !== req.session.user)
        return wrapErrors(queryError(403, "forbidden"));

      if (title) {
        title = title.trim();

        if (title.length < 5)
          return wrapErrors(queryError(400, "title length must be at least 5"));

        if (title.length > 100)
          return wrapErrors(
            queryError(400, "title length must be no more than 100")
          );

        post.title = title;

        post.slug = toSlug(title);
      }

      if (content) {
        content = content.trim();

        if (content.length < 5)
          return wrapErrors(
            queryError(400, "content length must be at least 5")
          );

        if (content.length > 250)
          return wrapErrors(
            queryError(400, "content length must be no more than 250")
          );

        post.content = content;
      }

      await post.save();

      return { post };
    } catch (e) {
      console.error(e);

      return wrapErrors(queryError(500, "internal server error"));
    }
  }

  @Mutation(() => PostResponse)
  @UseMiddleware(CheckBans)
  async deletePost(
    @Arg("id") id: string,
    @Ctx() { req }: Context
  ): Promise<PostResponse> {
    try {
      const post = await Post.findOne({ id });

      if (!post) return wrapErrors(queryError(400, "post doesn't exist"));

      if (post.authorId !== req.session.user)
        return wrapErrors(queryError(403, "forbidden"));

      await Post.delete(post);

      return { post };
    } catch (e) {
      console.error(e);

      return wrapErrors(queryError(500, "internal server error"));
    }
  }

  @Query(() => PostResponse)
  @UseMiddleware(CheckBans)
  async getPost(@Arg("id") id: string): Promise<PostResponse> {
    try {
      const post = await Post.findOne({ id });

      return { post };
    } catch (e) {
      console.error(e);

      return wrapErrors(queryError(500, "internal server error"));
    }
  }
}
