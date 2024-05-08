export type User = {
  id: number;
  username: string;
  password: string;
  status: string;
  totalwins: number;
  totalplayed: number;
  profilePicture: string;
};

export type Character = {
  id: number;
  image: string;
  name: string;
}
export type Lobby = {
  id: number;
  creator_userid: number;
  invited_userid: number | null;
};