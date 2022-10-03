const userModule = (function () {
  let userAddress = {};
  let users = [];
  let userId = 0;

  return {
    create: (username, password) => {
      if (!userAddress.hasOwnProperty(username)) {
        let user = { id: userId, username, password };
        userAddress[username] = users.length + "";
        users.push(user);
        userId++;

        return user;
      } else {
        return users[userAddress[username]];
      }
    },
    get: (username) => {
      return userAddress[username] ? users[userAddress[username]] : null;
    },
  };
})();

console.log(userModule.create("Eden", "hi"));
console.log(userModule.create("Eden", "hi"));
console.log(userModule.create("Eden", "hi"));
