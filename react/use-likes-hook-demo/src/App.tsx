import React, { useCallback, useState } from "react";
import "./App.css";
import { HeartIcon } from "./HeartIcon";

const App: React.FC<{}> = () => {
  const [state, setState] = useState({
    liked: false,
    likeCount: 0,
  });

  const { liked, likeCount } = state;

  const like = useCallback(() => {
    setState((prevState) => ({
      liked: true,
      likeCount: prevState.likeCount + 1,
    }));
  }, []);

  const dislike = useCallback(() => {
    setState((prevState) => ({
      liked: false,
      likeCount: prevState.likeCount - 1,
    }));
  }, []);

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
