"use server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

interface Params {
  serverId: string;
}

export async function generateInviteLink({ serverId }: Params) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      throw new Error("Unauthorized");
    }

    if (!serverId) {
      throw new Error("Server ID is missing");
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    revalidatePath(`/`);

    return server;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
