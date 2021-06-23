import { Post } from "src/entities/Post";
import { PostComment } from "src/entities/PostComment";
import { Context } from "src/types";
import { queryError, wrapErrors } from "src/utils/errors";
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

@ObjectType()
export class PostCommentResponse {
  @Field(() => [QueryError], { nullable: true })
  errors?: QueryError[];

  @Field(() => PostComment, { nullable: true })
  comment?: PostComment;
}

@ObjectType()
export class PostCommentsResponse {
  @Field(() => [QueryError], { nullable: true })
  errors?: QueryError[];

  @Field(() => [PostComment], { nullable: true })
  comments?: PostComment[];
}

@Resolver()
export class PostCommentResolver {
  @Mutation(() => PostCommentResponse)
  @UseMiddleware(CheckBans)
  async postComment(
    @Arg("id") id: string,
    @Arg("content") content: string,
    @Ctx() { req }: Context
  ): Promise<PostCommentResponse> {
    try {
      content = content.trim();

      const post = await Post.findOne({ id });

      if (!post) return wrapErrors(queryError(400, "post doesn't exist"));

      if (content.length < 5)
        return wrapErrors(queryError(400, "content length must be at least 5"));

      if (content.length > 200)
        return wrapErrors(
          queryError(400, "content length must be no more than 200")
        );

      const comment = await PostComment.create({
        authorId: req.session.user,
        content,
        postId: id,
      }).save();

      return { comment };
    } catch (e) {
      console.error(e);

      return wrapErrors(queryError(500, "internal server error"));
    }
  }

  @Mutation(() => PostCommentResponse)
  @UseMiddleware(CheckBans)
  async editPostComment(
    @Arg("id") id: string,
    @Arg("content") content: string,
    @Ctx() { req }: Context
  ): Promise<PostCommentResponse> {
    try {
      content = content.trim();

      const comment = await PostComment.findOne({ id });

      if (!comment) return wrapErrors(queryError(400, "comment doesn't exist"));

      if (comment.authorId !== req.session.user)
        return wrapErrors(queryError(403, "forbidden"));

      if (content.length < 5)
        return wrapErrors(queryError(400, "content length must be at least 5"));

      if (content.length > 200)
        return wrapErrors(
          queryError(400, "content length must be no more than 200")
        );

      comment.content = content;

      await comment.save();

      return { comment };
    } catch (e) {
      console.error(e);

      return wrapErrors(queryError(500, "internal server error"));
    }
  }

  @Mutation(() => PostCommentResponse)
  @UseMiddleware(CheckBans)
  async deletePostComment(
    @Arg("id") id: string,
    @Ctx() { req }: Context
  ): Promise<PostCommentResponse> {
    try {
      const comment = await PostComment.findOne({ id });

      if (!comment) return wrapErrors(queryError(400, "comment doesn't exist"));

      if (comment.authorId !== req.session.user)
        return wrapErrors(queryError(403, "forbidden"));

      await PostComment.delete(comment);

      return { comment };
    } catch (e) {
      console.error(e);

      return wrapErrors(queryError(500, "internal server error"));
    }
  }

  @Query(() => PostCommentResponse, { nullable: true })
  @UseMiddleware(CheckBans)
  async getPostComment(@Arg("id") id: string): Promise<PostCommentResponse> {
    try {
      const comment = await PostComment.findOne({ id });

      return { comment };
    } catch (e) {
      console.error(e);

      return wrapErrors(queryError(500, "internal server error"));
    }
  }

  @Query(() => PostCommentsResponse, { nullable: true })
  @UseMiddleware(CheckBans)
  async getPostComments(@Arg("id") id: string): Promise<PostCommentsResponse> {
    try {
      const comments = await (async function traverse(
        comments
      ): Promise<PostComment[]> {
        const subcomments = (
          await Promise.all(
            comments.map(async (comment) =>
              traverse(
                await PostComment.find({ where: { parentId: comment.id } })
              )
            )
          )
        ).flat(9007199254740991);

        return [...comments, ...subcomments];
      })(
        await PostComment.find({
          where: {
            postId: id,
          },
        })
      );

      return { comments };
    } catch (e) {
      console.error(e);

      return wrapErrors(queryError(500, "internal server error"));
    }
  }
}
