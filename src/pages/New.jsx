import Header from "../components/Header";
import Button from "../components/Button";
import Editor from "../components/Editor";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { DiaryDispatchContext } from "../App";
import usePateTitle from "../hooks/usePageTitle";

const New = () => {
    const { onCreate } = useContext(DiaryDispatchContext);
    const nav = useNavigate();
    usePateTitle("새 일기 쓰기");

    const onSubmit = (input) => {
        onCreate(
            input.createdDate.getTime(), 
            input.emotionId, 
            input.content
        );
        nav("/", {replace: true});
    };

    return (
        <div>
            <Header
                headText={"새 일기 쓰기"}
                leftChild={
                    <Button onClick={() => nav(-1)} 
                    text={"< 뒤로가기"}/>
                }
            />
            <Editor onSubmit={onSubmit} />
        </div>
    )
}

export default New;