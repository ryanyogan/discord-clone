"use server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function leaveServer({
  serverId,
}: {
  serverId: string | undefined;
}) {
  try {
    const profile = await currentProfile();
    if (!profile || !serverId) {
      throw new Error("Unauthorized");
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
}
