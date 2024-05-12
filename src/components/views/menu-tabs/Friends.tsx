import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { User } from "types";
import "styles/views/menu-tabs/Friends.scss";

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
    <BaseContainer className="picture">{profilePicture}</BaseContainer>
    <div className="friends value">{username}</div>
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
  const [inspectedFriend, setInspectedFriend] = useState<User>(null);
  const [friendId, setFriendId] = useState<Number>(null);
  const [ProfileVisible, setProfileVisible] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const responseFriends = await api.get(`/users/${userId}/friends`);
        console.log("GET responseFriends: ", responseFriends);

        // Get the returned friends and update the state.
        setfriends(responseFriends.data);

        console.log("request to:", responseFriends.request.responseFriendsURL);
        console.log("status code:", responseFriends.status);
        console.log("status text:", responseFriends.statusText);
        console.log("requested data:", responseFriends.data);

        console.log(responseFriends);

        const responseFriendRequests = await api.get(
          `/users/${userId}/friends/requests`
        );

        console.log("GET responseFriendRequests: ", responseFriendRequests);

        // Get the returned friend requests and update the state.
        setFriendRequests(responseFriendRequests.data);

        console.log(
          "request to:",
          responseFriendRequests.request.responseFriendsURL
        );
        console.log("status code:", responseFriendRequests.status);
        console.log("status text:", responseFriendRequests.statusText);
        console.log("requested data:", responseFriendRequests.data);

        console.log(responseFriendRequests);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the friends: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the friends! \
          See the console for details."
        );
      }
    }
    fetchData();
  }, []);

  // Add friend by username
  const addFriend = async () => {
    try {
      const requestBody = JSON.stringify({
        senderId: userId,
        receiverUserName: newFriendUserName,
      });
      await api.post(`/users/${userId}/friends/add`, requestBody);

      // Return a message that the friend request was successfully sent.
    } catch (error) {
      alert(
        `Something went wrong while adding a friend: \n${handleError(error)}`
      );
    }
  };

  // Remove friend through popup (I suppose)
  const removeFriend = async () => {
    try {
      await api.delete(`/users/${userId}/friends/${friendId}`); //Mapping incorrect
      // Return a message that the friend was successfully removed.
    } catch (error) {
      alert(
        `Something went wrong while removing a friend: \n${handleError(error)}`
      );
    }
  };

  // Inspect friend by creating a popup (I suppose)
  const inspectFriend = (friend: User) => {
    try {
      setInspectedFriend(friend);
      setProfileVisible(true);
    } catch (error) {
      alert(
        `Something went wrong while inspecting a friend: \n${handleError(
          error
        )}`
      );
    }
  };

  // Answer friend request (Needs accept / decline button in friendRequest container)
  const answerFriendRequest = async (answer: boolean, friendId: number) => {
    try {
      const requestBody = JSON.stringify({ "senderId": friendId, "receiverId": userId, "answer": answer });
      await api.put(`/users/${userId}/friends/answer`, requestBody);

      // Remove the answered friend request from the list.
      setFriendRequests(friendRequests.filter((user) => user.id !== friendId));

      
    } catch (error) {
      alert(
        `Something went wrong while answering a friend request: \n${handleError(
          error
        )}`
      );
    }
  };

  return (
    <BaseContainer className="friends">
      <div className="content-wrapper">
        <BaseContainer className="friends-container">
          <h1 className="h1">Friends</h1>
          <ul className="list">
            {friends.map((friend) => (
              <Friend
                key={friend.id}
                profilePicture={friend.profilePicture}
                username={friend.username}
              />
            ))}
          </ul>
        </BaseContainer>

        <BaseContainer className="friendrequests-container">
          <h1 className="h1">requests</h1>
          <ul className="list">
            {friendRequests.map((requests) => (
              <div key={requests.friendId} style={{ display: "flex", alignItems: "center" }}>
                <Friend
                  key={requests.friendId}
                  profilePicture={requests.friendIcon}
                  username={requests.friendUsername}
                />
                <Button
                  style={{ backgroundColor: "green" }}
                  onClick={() => answerFriendRequest(true, requests.friendId)}
                >
                  Accept
                </Button>
                <Button
                  style={{ backgroundColor: "red" }}
                  onClick={() => answerFriendRequest(false, requests.friendId)}
                >
                  Deny
                </Button>
              </div>
            ))}
          </ul>
        </BaseContainer>
      </div>

      <div className="add-friend-container">
        <AddFriendField
          value={newFriendUserName}
          onChange={setNewFriendUserName}
        />
        <Button onClick={addFriend}>Send Friend Request</Button>
      </div>
    </BaseContainer>
  );
};

export default Friends;
