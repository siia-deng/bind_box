const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function RunnerIllustration() {
  return (
    <img
      src={`${publicBasePath}/hurdle-runner.svg`}
      alt="正在跨栏的 Hurdle Club 人物插画"
      className="mx-auto h-auto w-full max-w-[520px]"
    />
  );
}
