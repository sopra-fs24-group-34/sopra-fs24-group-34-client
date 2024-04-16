import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { User } from "types";
import "styles/views/menu-tabs/Leaderboard.scss";

const Player = ({ user }: { user: User }) => {
  const winPercentage =
    user.totalplayed !== 0 ? (user.totalwins / user.totalplayed) * 100 : 0;

  return (
    <div className="player container">
      <div className="player username">{user.username}</div>
      <div className="player total-wins">
        {user.totalwins !== null ? user.totalwins : 0}
      </div>
      <div className="player total-played">
        {user.totalplayed !== null ? user.totalplayed : 0}
      </div>
      <div className="player win-percentage">
        {isNaN(winPercentage) ? 0 : winPercentage.toFixed(2)}%
      </div>
    </div>
  );
};

const Leaderboard = () => {
  const [users, setUsers] = useState<User[]>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/users");

        await new Promise((resolve) => setTimeout(resolve, 200));

        // Get the returned users and update the state.
        setUsers(response.data);

        console.log("request to:", response.request.responseURL);
        console.log("status code:", response.status);
        console.log("status text:", response.statusText);
        console.log("requested data:", response.data);

        console.log(response);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the users: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the users! See the console for details."
        );
      }
    }

    fetchData();
  }, []);

  // experimental
  const handleSort = (criteria: string) => {
    const sortedUsers = [...users].sort((a, b) => {
      if (a[criteria] < b[criteria]) return -1;
      if (a[criteria] > b[criteria]) return 1;
      
      return 0;
    });

    setUsers(sortedUsers);
  };

  let content = <Spinner />;

  if (users) {
    content = (
      <div className="leaderboard">
        <div className="sorting">
          <Button onClick={() => handleSort("username")}>
            Sort by Username
          </Button>
          <Button onClick={() => handleSort("totalwins")}>
            Sort by Total Wins
          </Button>
        </div>
        <ul className="leaderboard user-list">
          {users.map((user: User) => (
            <li key={user.id}>
              <Player user={user} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return <div>{content}</div>;
};

export default Leaderboard;