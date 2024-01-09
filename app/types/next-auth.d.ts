import type { Session, User } from "next-auth";
// import type { JWT } from "next-auth/jwt";

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: User;
  }
}
