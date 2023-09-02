"use server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function addMemberToServer({
  role,
  serverId,
  memberId,
}: {
  role: MemberRole;
  serverId: string;
  memberId: string;
}) {
  try {
    const profile = await currentProfile();

    if (!serverId || !profile) {
      throw new Error("Unauthorized or ServerID missing");
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return server;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
