"use server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function deleteServer({
  serverId,
}: {
  serverId: string | undefined;
}) {
  try {
    const profile = await currentProfile();
    if (!profile || !serverId) {
      throw new Error("Unauthorized");
    }

    await db.server.delete({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
}
