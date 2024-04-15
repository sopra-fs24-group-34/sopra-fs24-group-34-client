export type User = {
  id: number;
  username: string;
  password: string;
  status: string;
  totalwins: number;
  totalplayed: number;
};

export type Lobby = {
  id: number;
  creator_userid: number;
  invited_userid: number | null;
};