const API_DELAY = 500;
const responses = [true, true, false, true, true];
let idx = 0;
const postLikeMapping = new Map<number, boolean>();
export const mockedApiCall = async (postId: number, liked: boolean) => {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, API_DELAY));
  if (!postLikeMapping.get(postId) && !liked) {
    throw new Error("Cannot dislike a post that has not been liked.");
  }
  if (postLikeMapping.get(postId) && liked) {
    throw new Error("Cannot like a post that has already been liked.");
  }
  //   Simulated 80% success rate.
  if (responses[idx++ % responses.length]) {
    postLikeMapping.set(postId, liked);
    return true;
  }
  return false;
};
