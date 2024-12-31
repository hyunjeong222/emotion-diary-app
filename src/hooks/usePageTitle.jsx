import { useEffect } from "react";

const usePateTitle = (title) => {
    useEffect(() => {
        const $title = document.getElementsByTagName("title")[0];
        $title.innerText = title;
    }, [title]);
};

export default usePateTitle;