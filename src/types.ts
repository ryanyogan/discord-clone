import { Member, Profile, Server } from "@prisma/client";
import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketServer } from "socket.io";

export type ServerWithMemberProfiles = Server & {
  members: (Member & { profile: Profile })[];
};

export type SocketResponse = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketServer;
    };
  };
};
