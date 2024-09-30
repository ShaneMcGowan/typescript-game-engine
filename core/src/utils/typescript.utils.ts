export function assertUnreachable(x: never): never {
    console.log(x);
    throw new Error("Didn't expect to get here");
}