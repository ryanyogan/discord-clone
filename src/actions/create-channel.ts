"use server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";

interface CreateChannelProps {
  name: string;
  type: ChannelType;
  serverId: string | string[];
}

export async function createChannel({
  name,
  type,
  serverId,
}: CreateChannelProps) {
  try {
    const profile = await currentProfile();

    if (!profile || !serverId) {
      throw new Error("Unauthorized");
    }

    if (name === "general") {
      throw new Error("Name may not be 'general'");
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    });

    return server;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
