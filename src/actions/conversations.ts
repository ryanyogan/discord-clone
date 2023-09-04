import { db } from "@/lib/db";

interface GetOrCreateParams {
  memberOneId: string;
  memberTwoId: string;
}

// TODO: This horribly slow operations needs to be an upsert.. it makes me
// upset :(
export async function getOrCreateConversation({
  memberOneId,
  memberTwoId,
}: GetOrCreateParams) {
  let conversation = await findConversation({ memberOneId, memberTwoId });

  if (!conversation) {
    await createNewConversation({ memberOneId, memberTwoId });
  }

  return conversation;
}

async function findConversation({
  memberOneId,
  memberTwoId,
}: GetOrCreateParams) {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId }, { memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (_error: any) {
    return null;
  }
}

async function createNewConversation({
  memberOneId,
  memberTwoId,
}: GetOrCreateParams) {
  try {
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (_error: any) {
    return null;
  }
}
