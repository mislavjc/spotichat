import { Skeleton } from 'components/ui/skeleton';

const LoadingHome = async () => {
  const getRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-screen-md flex-col p-4">
      <div className="flex flex-col space-y-4">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className={`flex ${
              i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
            } items-center justify-between`}
          >
            <Skeleton
              className={`w-[250px]`}
              style={{
                height: getRandomNumber(50, 200),
                width: `${getRandomNumber(50, 80)}%`,
              }}
            />
          </div>
        ))}
      </div>
      <Skeleton
        className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-screen-md"
        style={{ height: '108px' }}
      />
    </main>
  );
};

export default LoadingHome;
