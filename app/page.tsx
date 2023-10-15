import { getServerSession } from 'next-auth';

import { Chat } from 'components/chat';

import { authOptions } from 'lib/auth';
import prisma from 'lib/prisma';

const Home = async () => {
  const user = await getServerSession(authOptions);

  const chat = await prisma.message.findMany({
    where: {
      userId: user?.id ?? undefined,
      AND: {
        role: {
          not: 'function',
        },
      },
    },
  });

  return <Chat initialMessages={chat} user={user} />;
};

export default Home;
