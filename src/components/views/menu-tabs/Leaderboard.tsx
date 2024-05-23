import React, { useEffect, useState } from "react";
import { api } from "helpers/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "components/ui/Spinner";
import { User } from "types";
import "styles/views/menu-tabs/Leaderboard.scss";
import { toastContainerError } from "../Toasts/ToastContainerError";
import { doHandleError } from "helpers/errorHandler";

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
  const [selectedCriteria, setSelectedCriteria] = useState<string>("totalwins");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/users");

        await new Promise((resolve) => setTimeout(resolve, 200));

        // Get the returned users and update the state.
        setUsers(response.data);
      } catch (error) {
        toast.error(doHandleError(error), { containerId: "leaderboard" });
      }
    }

    fetchData();
  }, []);

  const handleSort = (criteria: string) => {
    let sortedUsers = [...users];

    if (criteria === "username") {
      sortedUsers.sort((a, b) => a.username.localeCompare(b.username));
    } else if (criteria === "totalwins") {
      sortedUsers.sort((a, b) => b.totalwins - a.totalwins);
    } else if (criteria === "totalplayed") {
      sortedUsers.sort((a, b) => b.totalplayed - a.totalplayed);
    }

    setUsers(sortedUsers);
    setSelectedCriteria(criteria);
  };

  let content = <Spinner />;

  if (users) {
    content = (
      <div className="leaderboard container">
        <div className="title-row">
          <div className="header">Top players</div>
          <div className="sorting">
            <select
              value={selectedCriteria}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="username">Sort by Username</option>
              <option value="totalwins">Sort by Total Wins</option>
              <option value="totalplayed">Sort by Total Games Played</option>
            </select>
          </div>
          <div className="titles">Total wins</div>
          <div className="titles">Games played</div>
          <div className="titles">Win percentage</div>
        </div>
        <div className="leaderboard user-list">
          {users.map((user: User) => (
            <li style={{ borderRight: 0 }} key={user.id}>
              <Player user={user} />
            </li>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer containerId="leaderboard" {...toastContainerError} />
      {content}
    </div>
  );
};

export default Leaderboard;
