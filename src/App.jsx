import './App.css'
import { useReducer, useRef, createContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import New from "./pages/New";
import Diary from "./pages/Diary";
import Edit from "./pages/Edit";
import Notfound from "./pages/Notfound";

// 1. "/" : 모든 일기를 조화하는 Home 페이지
// 2. "/new" : 새로운 일기를 작성하는 New 페이지
// 3. "/diary" : 일기를 상세히 조회하는 Diary 페이지
// 4. "/edit" : 일기를 수정하는 edit 페이지

const reducer = (state, action) => {
  let nextState;

  switch (action.type) {
    case "INIT" : 
      return action.data;
    case "CREATE" : {
      nextState = [action.data, ...state];
      break;
    }
    case "UPDATE" : {
      nextState = state.map((item) =>
        (String)(item.id) === (String)(action.data.id) 
        ? action.data 
        : item
      );
      break;
    }
    case "DELETE" : {
      nextState = state.filter(
        (item) => (String)(item.id) !== (String)(action.id)
      );
      break;
    }
    default :
      return state;
  }

  localStorage.setItem("diary", JSON.stringify(nextState));
  return nextState;
};

export const DiaryStateContext = createContext();
export const DiaryDispatchContext = createContext();

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, dispatch] = useReducer(reducer, []);
  const dataId = useRef(0);

  useEffect(() => {
    const storedData = localStorage.getItem("diary");

    if (!storedData) {
      setIsLoading(false);
      return;
    }

    const parseData = JSON.parse(storedData);

    if (!Array.isArray(parseData)) {
      setIsLoading(false);
      return;
    }

    let maxId = 0;
    parseData.forEach((item) => {
      if (Number(item.id) > maxId) {
        maxId = Number(item.id);
      }
    });

    dataId.current = maxId + 1;

    dispatch({
      type : "INIT",
      data : parseData, 
    });
    setIsLoading(false);
  }, [])

  // 새로운 일기 추가
  const onCreate = (createdDate, emotionId, content) => {
    dispatch({
      type: "CREATE",
      data: {
        id: dataId.current++,
        createdDate,
        emotionId,
        content,
      },
    });
    dataId.current += 1;
  };

  // 기존 일기 수정
  const onUpdate = (id, createdDate, emotionId, content) => {
    dispatch({
      type: "UPDATE",
      data: {
        id,
        createdDate,
        emotionId,
        content,
      },
    });
  };

  // 기존 일기 삭제
  const onDelete = (id) => {
    dispatch({ type: "DELETE", id });
  };

  if (isLoading) {
    return <div>데이터 로딩중입니다...</div>
  }

  return (
    <>
      <DiaryStateContext.Provider value={data}>
        <DiaryDispatchContext.Provider 
          value={{
            onCreate,
            onUpdate,
            onDelete,
          }}
        >
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/new" element={<New />}></Route>
            <Route path="/diary/:id" element={<Diary />}></Route>
            <Route path="/edit/:id" element={<Edit />}></Route>
            <Route path="*" element={<Notfound />}></Route>
          </Routes>
          </DiaryDispatchContext.Provider>
      </DiaryStateContext.Provider>
    </>
    );
}

export default App