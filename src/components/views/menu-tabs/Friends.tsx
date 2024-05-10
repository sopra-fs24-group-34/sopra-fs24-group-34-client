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

const Friend = ({ key, profilePicture, username, request }) => (
  <div className="friend container">
    <BaseContainer className="picture">{profilePicture}</BaseContainer>
    <div className="value">{username}</div>
    {request && "hello"}
  </div>
);

Friend.propTypes = {
  key: PropTypes.num,
  profilePicture: PropTypes.string,
  username: PropTypes.string,
  request: PropTypes.bool,
};

const Friends = () => {
  const userId = localStorage.getItem("userId");

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
  const answerFriendRequest = async (answer: boolean) => {
    try {
      const requestBody = JSON.stringify({ answer: answer });
      await api.post(
        `/users/${userId}/friendRequests/${friendId}`,
        requestBody
      );

      // Remove the answered friend request from the list.
      setFriendRequests(friendRequests.filter((user) => user.id !== friendId));

      // Add the friend to the friends list if the answer was positive.
      if (answer) {
        setfriends([...friends, inspectedFriend]);
      }
    } catch (error) {
      alert(
        `Something went wrong while answering a friend request: \n${handleError(
          error
        )}`
      );
    }
  };

  return (
    <BaseContainer className="friends base-container">
      <div className="friends content-wrapper">
        <BaseContainer className="friends container">
          <h1 className="friends h1">Friends</h1>
          <ul className="friends list">
            {friends.map((friend) => (
              <Friend
                key={friend.id}
                profilePicture={friend.profilePicture}
                username={friend.username}
                request={false}
              />
            ))}
          </ul>
        </BaseContainer>

        <BaseContainer className="friends requests-container">
          <h1 className="friends h1">requests</h1>
          <ul className="friends list">
            {friendRequests.map((requests) => (
              <Friend
                key={requests.id}
                profilePicture={requests.profilePicture}
                username={requests.username}
                request={true}
              />
            ))}
          </ul>
        </BaseContainer>
      </div>

      <div className="friends add-friend-container">
        <AddFriendField
          value={newFriendUserName}
          onChange={setNewFriendUserName}
        />
        <Button onClick={addFriend}>Add Friend</Button>
      </div>
    </BaseContainer>
  );
};

export default Friends;
