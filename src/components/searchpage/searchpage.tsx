import React, { useState } from "react";
import {useAddUserMutation, useGetFollowersMutation,useGetReposMutation,} from "./redux/githubApi";
import githubIcon from "./githubIcon.svg"

interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
}

function OtherPage() {
  const [username, setUsername] = useState("");
  const [ searchUser, { isLoading: searchLoading, isError: searchError, data: searchData },] = useAddUserMutation(); 
  const [ getUserFollowers, { isLoading: followersLoading, data: followersData }, ] = useGetFollowersMutation();
  const [getRepos, { isLoading: reposLoading, data: userRepos }] =useGetReposMutation();
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = () => {
    searchUser(username);
    getUserFollowers(username);
    getRepos(username);
    setSearchPerformed(true);
  };
  const handleChangeUsername = (event:any) => {
    const value = event.target.value;
    if (/^[0-9a-zA-Z]*$/.test(value) || value === "") {
      setUsername(value);
    }
  };




  const renderSearchResult = () => {
    if (searchError) {
      return <div className="text-red-500 font-bold">Error while performing search.</div>;
    }
    if (searchLoading || followersLoading || reposLoading) {
      return <div className="text-gray-500 italic">Searching...</div>;
    }
    if (!searchPerformed) {
      return null; // Ничего не отображаем, если поиск еще не был выполнен
    }
    if (!searchData || !searchData.items || searchData.items.length === 0) {
      return <div className="text-red-500">User is not found.</div>;
    }
    const user = searchData.items[0];
    return (
      <div className="text-white bg-gray-800 border border-gray-700 p-4 rounded-lg shadow-md flex">
      <div className="mr-4">
        <img
          src={user.avatar_url}
          alt="Avatar"
          className="w-20 h-20 rounded-full max-w-xs"
          
        />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Searching results</h2>
        <div>
          <p>Login: {user.login}</p>
          <p>Followers: {followersData.length}</p>
          <p>GitHub Profile: <a href={user.html_url} className="text-blue-400 hover:text-blue-500">{user.login}</a></p>
          {userRepos && userRepos.length > 0 ? (
            <div>
              <p>Last 5 repositories:</p>
              <ul>
                {userRepos.slice(0, 5).map((repo: Repo) => (
                  <li key={repo.id}>
                    <a href={repo.html_url} className="text-blue-400 hover:text-blue-500">{repo.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No repositories</p>
          )}
        </div>
      </div>
    </div>
  )}    

  return (
    <div style={{ height: "100vh" }} className="bg-slate-700">
      <div className="bg-black h-16 flex items-center justify-center text-white font-semibold text-2xl">
        GitHub Profiles
      </div>

      <div className="flex items-start justify-start mb-1">
        <input
          type="text"
          placeholder="Enter user name"
          className="px-2 py-1 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-2/10 ml-20 mt-3"
          value={username}
          onChange={handleChangeUsername}
        />
        <button
          className="bg-black text-white font-semibold lowercase text-xs px-2 pb-2 pt-1 rounded shadow hover:shadow-md outline-none focus:outline-none ml-2 mt-3 flex items-center" // 
          type="button"
          onClick={handleSearch}
          disabled={!username || searchLoading}
        >
          <img src={githubIcon} alt="GitHub Icon" className="w-4 h-4 mr-2 " /> 
          {searchLoading ? "Searching..." : "Search user"}
        </button>
      </div>

      {renderSearchResult()}
    </div>
  );
}
export default OtherPage;
