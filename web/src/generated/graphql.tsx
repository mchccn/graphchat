import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type AvatarResponse = {
  __typename?: 'AvatarResponse';
  errors?: Maybe<Array<QueryError>>;
  success?: Maybe<Scalars['Boolean']>;
};


export type DirectMessage = {
  __typename?: 'DirectMessage';
  id: Scalars['String'];
  sender: User;
  receiver: User;
  content: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type DirectMessageResponse = {
  __typename?: 'DirectMessageResponse';
  errors?: Maybe<Array<QueryError>>;
  message?: Maybe<DirectMessage>;
};

export type DirectMessagesResponse = {
  __typename?: 'DirectMessagesResponse';
  errors?: Maybe<Array<QueryError>>;
  messages?: Maybe<Array<DirectMessage>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  changeAvatar: AvatarResponse;
  block: UserBlockResponse;
  unblock: UserBlocksResponse;
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
  register: UserResponse;
  login: UserResponse;
  updateUser?: Maybe<UserResponse>;
  deleteUser: UserResponse;
  logout: Scalars['Boolean'];
};


export type MutationChangeAvatarArgs = {
  avatar: Scalars['Upload'];
};


export type MutationBlockArgs = {
  id: Scalars['String'];
};


export type MutationUnblockArgs = {
  id: Scalars['String'];
};


export type MutationAddFriendArgs = {
  id: Scalars['String'];
};


export type MutationAcceptFriendArgs = {
  id: Scalars['Float'];
};


export type MutationIgnoreFriendArgs = {
  id: Scalars['Float'];
};


export type MutationRemoveFriendArgs = {
  id: Scalars['String'];
};


export type MutationSendDmArgs = {
  message: Scalars['String'];
  receiver: Scalars['String'];
};


export type MutationEditDmArgs = {
  content: Scalars['String'];
  id: Scalars['String'];
};


export type MutationDeleteDmArgs = {
  id: Scalars['String'];
};


export type MutationBanArgs = {
  length?: Maybe<Scalars['Float']>;
  reason: Scalars['String'];
  id: Scalars['String'];
};


export type MutationEditBanArgs = {
  data: UserBanEditInput;
  case: Scalars['Float'];
};


export type MutationUnbanArgs = {
  id: Scalars['String'];
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
  id: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  fetchBlocks: UserBlocksResponse;
  getDMs: DirectMessagesResponse;
  fetchBans: UserBansResponse;
  me?: Maybe<User>;
  user: UserResponse;
};


export type QueryFetchBlocksArgs = {
  id: Scalars['String'];
};


export type QueryGetDMsArgs = {
  limit?: Maybe<Scalars['Float']>;
  offset?: Maybe<Scalars['Float']>;
  sender: Scalars['String'];
};


export type QueryFetchBansArgs = {
  id: Scalars['String'];
};


export type QueryUserArgs = {
  id: Scalars['String'];
};

export type QueryError = {
  __typename?: 'QueryError';
  status: Scalars['Int'];
  message: Scalars['String'];
};

export type UpdateUserInput = {
  description?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};


export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  username: Scalars['String'];
  email: Scalars['String'];
  displayName: Scalars['String'];
  avatar: Scalars['String'];
  description: Scalars['String'];
  status: Scalars['String'];
  role: UserRole;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type UserBan = {
  __typename?: 'UserBan';
  case: Scalars['Int'];
  offender: Scalars['String'];
  moderator: Scalars['String'];
  reason: Scalars['String'];
  expires: Scalars['DateTime'];
  createdAt: Scalars['String'];
};

export type UserBanEditInput = {
  reason: Scalars['String'];
  expires: Scalars['DateTime'];
};

export type UserBanResponse = {
  __typename?: 'UserBanResponse';
  errors?: Maybe<Array<QueryError>>;
  ban?: Maybe<UserBan>;
};

export type UserBansResponse = {
  __typename?: 'UserBansResponse';
  errors?: Maybe<Array<QueryError>>;
  bans?: Maybe<Array<UserBan>>;
};

export type UserBlock = {
  __typename?: 'UserBlock';
  id: Scalars['Int'];
  user: User;
  blocked: User;
};

export type UserBlockResponse = {
  __typename?: 'UserBlockResponse';
  errors?: Maybe<Array<QueryError>>;
  block?: Maybe<UserBlock>;
};

export type UserBlocksResponse = {
  __typename?: 'UserBlocksResponse';
  errors?: Maybe<Array<QueryError>>;
  blocks?: Maybe<Array<UserBlock>>;
};

export type UserFriend = {
  __typename?: 'UserFriend';
  id: Scalars['Int'];
  user: User;
  friended: User;
};

export type UserFriendRequest = {
  __typename?: 'UserFriendRequest';
  id: Scalars['Int'];
  user: User;
  friend: User;
};

export type UserFriendRequestResponse = {
  __typename?: 'UserFriendRequestResponse';
  errors?: Maybe<Array<QueryError>>;
  request?: Maybe<UserFriendRequest>;
};

export type UserFriendResponse = {
  __typename?: 'UserFriendResponse';
  errors?: Maybe<Array<QueryError>>;
  friend?: Maybe<UserFriend>;
};

export type UserFriendsResponse = {
  __typename?: 'UserFriendsResponse';
  errors?: Maybe<Array<QueryError>>;
  friends?: Maybe<Array<UserFriend>>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<QueryError>>;
  user?: Maybe<User>;
};

export enum UserRole {
  Sysadmin = 'SYSADMIN',
  Admin = 'ADMIN',
  Moderator = 'MODERATOR',
  Veteran = 'VETERAN',
  User = 'USER'
}

export type UsernamePasswordEmailInput = {
  username: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
};

export type UsernamePasswordInput = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'QueryError' }
      & Pick<QueryError, 'status' | 'message'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id'>
    )> }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'QueryError' }
      & Pick<QueryError, 'status' | 'message'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id'>
    )> }
  ) }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'email' | 'displayName' | 'avatar' | 'status'>
  )> }
);


export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(input: {username: $username, password: $password}) {
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
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($username: String!, $email: String!, $password: String!) {
  register(input: {username: $username, email: $email, password: $password}) {
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
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

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
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    username
    email
    displayName
    avatar
    status
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;