import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { User } from "types";
import "styles/views/menu-tabs/Friends.scss";

const AddFriendField = (props) => {
  return (
    <div className="... field">
      <label className="... label">{props.label}</label>
      <input
        type="text"
        className="... input"
        placeholder="Add Friend by Username"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

AddFriendField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const Friend = ({ user }: { user: User }) => (
  <div className="friend container">
    <BaseContainer className="picture">{user.profilePicture}</BaseContainer>
    <div className="value">{user.username}</div>
  </div>
);

const Friends = () => {
  const userId = localStorage.getItem("userId");

  const [friends, setfriends] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<User[]>([]);

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

        /* Not implemented yet
        const responseFriendRequests = await api.get(
          `/users/${userId}/friendRequests`
        );

        console.log("GET responseFriends: ", responseFriends);

        // Get the returned friend requests and update the state.
        setFriendRequests(responseFriendRequests.data);

        console.log(
          "request to:",
          responseFriendRequests.request.responseFriendsURL
        );
        console.log("status code:", responseFriendRequests.status);
        console.log("status text:", responseFriendRequests.statusText);
        console.log("requested data:", responseFriendRequests.data);

        console.log(responseFriends);*/
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
        receiverUsername: newFriendUserName,
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
    <BaseContainer className="friends container">
      <BaseContainer className="friends">
        <ul className="friends-list">
          {friends.map((user: User) => (
            <li key={user.id}>
              <Friend user={user} />
            </li>
          ))}
        </ul>
      </BaseContainer>

      <BaseContainer className="friendRequests">
        <ul className="friendRequests-list">
          {friendRequests.map((user: User) => (
            <li key={user.id}>
              <Friend user={user} />
            </li>
          ))}
        </ul>
      </BaseContainer>

      <BaseContainer className="addFriend">
        <AddFriendField
          label="Add Friend By Username"
          value={newFriendUserName}
          onChange={(un: string) => setNewFriendUserName(un)}
        />
        <Button
          style={{ flex: "2" }}
          onClick={() => {
            () => addFriend();
          }}
        >
          Add Friend
        </Button>
      </BaseContainer>
    </BaseContainer>
  );
};

export default Friends;
