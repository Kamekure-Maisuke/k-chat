const users = [];

// ユーザー配列作成
const userJoin = (id, username, room) => {
  const user = { id, username, room };
  users.push(user);
  return user;
}

// ユーザー取得
const getCurrentUser = (id) => {
  return users.find(user => user.id === id);
}

// 退出処理
const userLeave = (id) => {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// 部屋のユーザー情報取得
const getRoomUsers = (room) => {
  return users.filter(user => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};
