"use server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface UpdateServerProps {
  serverId: string;
  name: string;
  imageUrl: string;
}

export async function updateServer({
  serverId,
  name,
  imageUrl,
}: UpdateServerProps) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      throw new Error("No Profile Found");
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });

    return server;
  } catch (error: any) {
    console.log("[SERVER_UPDATE]", error.message);
    throw new Error("Internal Server Error");
  }
}
