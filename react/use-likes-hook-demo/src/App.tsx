import React, { Reducer, useCallback, useReducer } from "react";
import "./App.css";
import { HeartIcon } from "./HeartIcon";
import { useLikes } from "./hooks/useLikes";
import { mockedApiCall } from "./api";

const likedReducer: Reducer<{ liked: boolean; likeCount: number }, boolean> = (
  state,
  liked
) => {
  const { likeCount } = state;
  if (liked === state.liked) {
    return state;
  }
  return {
    liked,
    likeCount: liked ? likeCount + 1 : likeCount - 1,
  };
};

const App: React.FC<{}> = () => {
  const [state, dispatchLiked] = useReducer(likedReducer, {
    liked: false,
    likeCount: 0,
  });

  const { liked, likeCount } = state;

  const [pushToLikeQueue] = useLikes({
    setLikedState: dispatchLiked,
    postId: 1,
    async mutate(postId, liked) {
      return await mockedApiCall(postId, liked);
    },
  });
  const like = useCallback(() => {
    dispatchLiked(true);
    pushToLikeQueue("like");
  }, [pushToLikeQueue]);

  const dislike = useCallback(() => {
    dispatchLiked(false);
    pushToLikeQueue("dislike");
  }, [pushToLikeQueue]);

  const onClick = useCallback(() => {
    if (liked) {
      dislike();
    } else {
      like();
    }
  }, [liked, like, dislike]);
  return (
    <div className="App">
      <div onClick={onClick} id="heart_container">
        <HeartIcon
          height={96}
          width={96}
          stroke="#aaa"
          fill={liked ? "rgb(207, 102, 121)" : "transparent"}
        />
      </div>
      <p>{likeCount}</p>
    </div>
  );
};

export default App;
