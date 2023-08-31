import { Member, Profile, Server } from "@prisma/client";

export type ServerWithMemberProfiles = Server & {
  members: (Member & { profile: Profile })[];
};
