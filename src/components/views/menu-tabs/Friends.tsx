import React, { useEffect, useState } from "react";
import { api } from "helpers/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/menu-tabs/Friends.scss";
import { doHandleError } from "../../../helpers/errorHandler";
import { toastContainerError } from "../Toasts/ToastContainerError";
import { toastContainerSuccess } from "../Toasts/ToastContainerSuccess";

const AddFriendField = (props) => {
  return (
    <div className="friends field">
      <input
        type="text"
        className="friends input"
        placeholder="Add Friend by Username"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

AddFriendField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const Friend = ({ key, profilePicture, username }) => (
  <div className="container">
    <BaseContainer className="picture">
      <img src={profilePicture} alt="Profile" />
    </BaseContainer>
    <div className="value">{username}</div>
  </div>
);

Friend.propTypes = {
  key: PropTypes.num,
  profilePicture: PropTypes.string,
  username: PropTypes.string,
};

const Friends = () => {
  const userId = Number(localStorage.getItem("userId"));

  const [friends, setfriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  const [newFriendUserName, setNewFriendUserName] = useState<string>("");
  const [reload, setReload] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const responseFriends = await api.get(`/users/${userId}/friends`);

        // Get the returned friends and update the state.
        setfriends(responseFriends.data);

        const responseFriendRequests = await api.get(
          `/users/${userId}/friends/requests`
        );
        // Get the returned friend requests and update the state.
        setFriendRequests(responseFriendRequests.data);
      } catch (error) {
        toast.error(doHandleError(error), {containerId: "friend"});
      }
    }
    fetchData();
  }, [reload]);

  // Add friend by username
  const addFriend = async () => {
    try {
      const requestBody = JSON.stringify({
        senderId: userId,
        receiverUserName: newFriendUserName,
      });
      await api.post("/users/friends/add", requestBody);

      // Return a message that the friend request was successfully sent.
      toast.success("Friend request sent!", {containerId: "friend"});
    } catch (error) {
      if (error.response.status === 404) {
        toast.error("User not found.", {containerId: "friend"});
      } else {
        toast.error(doHandleError(error), {containerId: "friend"});
      }
    }
  };

  // Remove friend
  const removeFriend = async (friendId: number) => {
    try {
      await api.delete(`/users/${userId}/friends/delete/${friendId}`); //Mapping incorrect
      setReload(!reload);
      // Return a message that the friend was successfully removed.
      toast.success("Friend successfully removed!", {containerId: "friend"});
    } catch (error) {
      toast.error(doHandleError(error), {containerId: "friend"});
    }
  };

  // Answer friend request
  const answerFriendRequest = async (answer: boolean, friendId: number) => {
    try {
      const requestBody = JSON.stringify({
        senderId: friendId,
        receiverId: userId,
        answer: answer,
      });
      await api.put("/users/friends/answer", requestBody);

      // Remove the answered friend request from the list.
      toast.success("Friend request successfully answered!", {containerId: "friend"});
      setReload(!reload);
    } catch (error) {
      toast.error(doHandleError(error), {containerId: "friend"});
    }
  };

  return (
    <div className="friends">
      <ToastContainer containerId="friend" {...toastContainerError} />
      <div className="content-wrapper">
        <div
          className="friends-container"
        >
          <h1 className="h1">Friends</h1>
          <ul className="list">
            {friends.map((friend) => (
              <div
                key={friend.friendId}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Friend
                  key={friend.friendId}
                  profilePicture={friend.friendIcon}
                  username={friend.friendUsername}
                />
                <Button
                  style={{ backgroundColor: "red", marginBottom: "15px" }}
                  onClick={() => removeFriend(friend.friendId)}
                >
                  Remove Friend
                </Button>
              </div>
            ))}
          </ul>
        </div>

        <div
          className="requests-container"
        >
          <h1 className="h1">Friend requests</h1>
          <ul className="list">
            {friendRequests.map(
              (requests) =>
                requests.friendId !== userId && (
                  <div
                    key={requests.friendId}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    <Friend
                      key={requests.friendId}
                      profilePicture={requests.friendIcon}
                      username={requests.friendUsername}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                        marginBottom: "15px",
                      }}
                    >
                      <Button
                        style={{
                          backgroundColor: "green",
                          marginRight: "10px",
                        }}
                        onClick={() =>
                          answerFriendRequest(true, requests.friendId)
                        }
                      >
                        Accept
                      </Button>
                      <Button
                        style={{ backgroundColor: "red" }}
                        onClick={() =>
                          answerFriendRequest(false, requests.friendId)
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                )
            )}
          </ul>
        </div>
      </div>

      <div
        className="add-friend-container"
        onKeyDown={(e) => {
          {
            if (e.key === "Enter" && newFriendUserName) {
              addFriend();
            }
          }
        }}
      >
        <AddFriendField
          value={newFriendUserName}
          onChange={setNewFriendUserName}
        />
        <Button onClick={addFriend} disabled={!newFriendUserName}>
          Send Friend Request
        </Button>
      </div>
    </div>
  );
};

export default Friends;
