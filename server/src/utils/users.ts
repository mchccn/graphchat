import { User } from "src/entities/User";

export const io = (user: User) =>
  new (class UserIO {
    constructor(private user: User) {}

    isHigherThan(user: User) {
      const roles = [
        "sysadmin",
        "administrator",
        "moderator",
        "veteran",
        "user",
      ];

      return (
        roles[roles.indexOf(this.user.role)] > roles[roles.indexOf(user.role)]
      );
    }
  })(user);
