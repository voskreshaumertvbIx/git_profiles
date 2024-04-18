import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const githubApi = createApi({
  reducerPath: 'githubApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.github.com' }), 
  endpoints: (builder) => ({
    addUser: builder.mutation({
      query: (username) => ({
        url: `/search/users?q=${username}`,
        method: 'GET',
      }),
    }),
    getFollowers: builder.mutation({
      query:(username) =>({
      url:`/users/${username}/followers`,// URL для получения списка подписчико
      method:'GET',
    }), 
    }),
    getRepos: builder.mutation({
      query: (username) => ({
        url: `users/${username}/repos`,
        method: 'GET',
      }),
      }),
  }),
});

export const { useAddUserMutation, useGetFollowersMutation, useGetReposMutation} = githubApi;


