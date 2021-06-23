import * as Apollo from "@apollo/client";
import { gql } from "@apollo/client";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type DirectMessage = {
  __typename?: "DirectMessage";
  id: Scalars["String"];
  sender: User;
  receiver: User;
  content: Scalars["String"];
  createdAt: Scalars["String"];
  updatedAt: Scalars["String"];
};

export type DirectMessageResponse = {
  __typename?: "DirectMessageResponse";
  errors?: Maybe<Array<QueryError>>;
  message?: Maybe<DirectMessage>;
};

export type DirectMessagesResponse = {
  __typename?: "DirectMessagesResponse";
  errors?: Maybe<Array<QueryError>>;
  messages?: Maybe<Array<DirectMessage>>;
};

export type Mutation = {
  __typename?: "Mutation";
  postComment: PostCommentResponse;
  editPostComment: PostCommentResponse;
  deletePostComment: PostCommentResponse;
  post: PostResponse;
  editPost: PostResponse;
  deletePost: PostResponse;
  block: UserBlockResponse;
  unblock: UserBlocksResponse;
  register: UserResponse;
  login: UserResponse;
  updateUser?: Maybe<UserResponse>;
  deleteUser: UserResponse;
  logout: Scalars["Boolean"];
  follow: UserFollowResponse;
  unfollow: UserFollowResponse;
  addFriend: UserFriendRequestResponse;
  acceptFriend: UserFriendResponse;
  ignoreFriend: UserFriendRequestResponse;
  removeFriend: UserFriendResponse;
  fetchFriends: UserFriendsResponse;
  sendDM: DirectMessageResponse;
  editDM: DirectMessageResponse;
  deleteDM: DirectMessageResponse;
  ban: UserBanResponse;
  editBan: UserBanResponse;
  unban: UserBansResponse;
};

export type MutationPostCommentArgs = {
  content: Scalars["String"];
  id: Scalars["String"];
};

export type MutationEditPostCommentArgs = {
  content: Scalars["String"];
  id: Scalars["String"];
};

export type MutationDeletePostCommentArgs = {
  id: Scalars["String"];
};

export type MutationPostArgs = {
  content: Scalars["String"];
  title: Scalars["String"];
};

export type MutationEditPostArgs = {
  data: UpdatePostInput;
  id: Scalars["String"];
};

export type MutationDeletePostArgs = {
  id: Scalars["String"];
};

export type MutationBlockArgs = {
  id: Scalars["String"];
};

export type MutationUnblockArgs = {
  id: Scalars["String"];
};

export type MutationRegisterArgs = {
  input: UsernamePasswordEmailInput;
};

export type MutationLoginArgs = {
  input: UsernamePasswordInput;
};

export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
};

export type MutationDeleteUserArgs = {
  id: Scalars["String"];
};

export type MutationFollowArgs = {
  id: Scalars["String"];
};

export type MutationUnfollowArgs = {
  id: Scalars["String"];
};

export type MutationAddFriendArgs = {
  id: Scalars["String"];
};

export type MutationAcceptFriendArgs = {
  id: Scalars["Float"];
};

export type MutationIgnoreFriendArgs = {
  id: Scalars["Float"];
};

export type MutationRemoveFriendArgs = {
  id: Scalars["String"];
};

export type MutationSendDmArgs = {
  message: Scalars["String"];
  receiver: Scalars["String"];
};

export type MutationEditDmArgs = {
  content: Scalars["String"];
  id: Scalars["String"];
};

export type MutationDeleteDmArgs = {
  id: Scalars["String"];
};

export type MutationBanArgs = {
  length?: Maybe<Scalars["Float"]>;
  reason: Scalars["String"];
  id: Scalars["String"];
};

export type MutationEditBanArgs = {
  data: UserBanEditInput;
  case: Scalars["Float"];
};

export type MutationUnbanArgs = {
  id: Scalars["String"];
};

export type Post = {
  __typename?: "Post";
  id: Scalars["String"];
  author: User;
  title: Scalars["String"];
  slug: Scalars["String"];
  content: Scalars["String"];
  likes: Scalars["Int"];
};

export type PostComment = {
  __typename?: "PostComment";
  id: Scalars["String"];
  post: Post;
  author: User;
  parent: PostComment;
  content: Scalars["String"];
  likes: Scalars["Int"];
};

export type PostCommentResponse = {
  __typename?: "PostCommentResponse";
  errors?: Maybe<Array<QueryError>>;
  comment?: Maybe<PostComment>;
};

export type PostCommentsResponse = {
  __typename?: "PostCommentsResponse";
  errors?: Maybe<Array<QueryError>>;
  comments?: Maybe<Array<PostComment>>;
};

export type PostResponse = {
  __typename?: "PostResponse";
  errors?: Maybe<Array<QueryError>>;
  post?: Maybe<Post>;
};

export type Query = {
  __typename?: "Query";
  getPostComment?: Maybe<PostCommentResponse>;
  getPostComments?: Maybe<PostCommentsResponse>;
  getPost?: Maybe<PostResponse>;
  fetchBlocks: UserBlocksResponse;
  me?: Maybe<User>;
  user: UserResponse;
  fetchFollowed: UsersResponse;
  fetchFollowers: UsersResponse;
  getDMs: DirectMessagesResponse;
  fetchBans: UserBansResponse;
};

export type QueryGetPostCommentArgs = {
  id: Scalars["String"];
};

export type QueryGetPostCommentsArgs = {
  id: Scalars["String"];
};

export type QueryGetPostArgs = {
  id: Scalars["String"];
};

export type QueryFetchBlocksArgs = {
  id: Scalars["String"];
};

export type QueryUserArgs = {
  id: Scalars["String"];
};

export type QueryGetDMsArgs = {
  limit?: Maybe<Scalars["Float"]>;
  offset?: Maybe<Scalars["Float"]>;
  sender: Scalars["String"];
};

export type QueryFetchBansArgs = {
  id: Scalars["String"];
};

export type QueryError = {
  __typename?: "QueryError";
  status: Scalars["Float"];
  message: Scalars["String"];
};

export type UpdatePostInput = {
  title?: Maybe<Scalars["String"]>;
  content?: Maybe<Scalars["String"]>;
};

export type UpdateUserInput = {
  description?: Maybe<Scalars["String"]>;
  displayName?: Maybe<Scalars["String"]>;
  status?: Maybe<Scalars["String"]>;
};

export type User = {
  __typename?: "User";
  id: Scalars["String"];
  username: Scalars["String"];
  email: Scalars["String"];
  displayName: Scalars["String"];
  avatar: Scalars["String"];
  description: Scalars["String"];
  status: Scalars["String"];
  role: UserRole;
  createdAt: Scalars["String"];
  updatedAt: Scalars["String"];
};

export type UserBan = {
  __typename?: "UserBan";
  case: Scalars["Int"];
  offender: Scalars["String"];
  moderator: Scalars["String"];
  reason: Scalars["String"];
  expires: Scalars["DateTime"];
  createdAt: Scalars["String"];
};

export type UserBanEditInput = {
  reason: Scalars["String"];
  expires: Scalars["DateTime"];
};

export type UserBanResponse = {
  __typename?: "UserBanResponse";
  errors?: Maybe<Array<QueryError>>;
  ban?: Maybe<UserBan>;
};

export type UserBansResponse = {
  __typename?: "UserBansResponse";
  errors?: Maybe<Array<QueryError>>;
  bans?: Maybe<Array<UserBan>>;
};

export type UserBlock = {
  __typename?: "UserBlock";
  id: Scalars["Int"];
  user: User;
  blocked: User;
};

export type UserBlockResponse = {
  __typename?: "UserBlockResponse";
  errors?: Maybe<Array<QueryError>>;
  block?: Maybe<UserBlock>;
};

export type UserBlocksResponse = {
  __typename?: "UserBlocksResponse";
  errors?: Maybe<Array<QueryError>>;
  blocks?: Maybe<Array<UserBlock>>;
};

export type UserFollow = {
  __typename?: "UserFollow";
  id: Scalars["Int"];
  user: User;
  followed: User;
};

export type UserFollowResponse = {
  __typename?: "UserFollowResponse";
  errors?: Maybe<Array<QueryError>>;
  follow?: Maybe<UserFollow>;
};

export type UserFriend = {
  __typename?: "UserFriend";
  id: Scalars["Int"];
  user: User;
  friended: User;
};

export type UserFriendRequest = {
  __typename?: "UserFriendRequest";
  id: Scalars["Int"];
  user: User;
  friend: User;
};

export type UserFriendRequestResponse = {
  __typename?: "UserFriendRequestResponse";
  errors?: Maybe<Array<QueryError>>;
  request?: Maybe<UserFriendRequest>;
};

export type UserFriendResponse = {
  __typename?: "UserFriendResponse";
  errors?: Maybe<Array<QueryError>>;
  friend?: Maybe<UserFriend>;
};

export type UserFriendsResponse = {
  __typename?: "UserFriendsResponse";
  errors?: Maybe<Array<QueryError>>;
  friends?: Maybe<Array<UserFriend>>;
};

export type UserResponse = {
  __typename?: "UserResponse";
  errors?: Maybe<Array<QueryError>>;
  user?: Maybe<User>;
};

export enum UserRole {
  Sysadmin = "SYSADMIN",
  Admin = "ADMIN",
  Moderator = "MODERATOR",
  Veteran = "VETERAN",
  User = "USER",
}

export type UsernamePasswordEmailInput = {
  username: Scalars["String"];
  password: Scalars["String"];
  email: Scalars["String"];
};

export type UsernamePasswordInput = {
  username: Scalars["String"];
  password: Scalars["String"];
};

export type UsersResponse = {
  __typename?: "UsersResponse";
  errors?: Maybe<Array<QueryError>>;
  users?: Maybe<Array<User>>;
};

export type RegisterMutationVariables = Exact<{
  username: Scalars["String"];
  email: Scalars["String"];
  password: Scalars["String"];
}>;

export type RegisterMutation = { __typename?: "Mutation" } & {
  register: { __typename?: "UserResponse" } & {
    errors?: Maybe<
      Array<
        { __typename?: "QueryError" } & Pick<QueryError, "status" | "message">
      >
    >;
    user?: Maybe<{ __typename?: "User" } & Pick<User, "id">>;
  };
};

export const RegisterDocument = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(
      input: { username: $username, email: $email, password: $password }
    ) {
      errors {
        status
        message
      }
      user {
        id
      }
    }
  }
`;
export type RegisterMutationFn = Apollo.MutationFunction<
  RegisterMutation,
  RegisterMutationVariables
>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      username: // value for 'username'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisterMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RegisterMutation,
    RegisterMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(
    RegisterDocument,
    options
  );
}
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<
  RegisterMutation,
  RegisterMutationVariables
>;
