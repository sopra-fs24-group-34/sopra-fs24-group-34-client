/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.username = null;
    this.token = null;
    this.status = null;
    this.friendlist = null; // smailalijagic: added
    this.lobbylist = null; // smailalijagic: added
    Object.assign(this, data);
  }
}

export default User;
