import { useEditor, type Content } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { userMention } from "../../components/ChatEditor/components/UserMention";
import { skillMention } from "../../components/ChatEditor/components/SkillMention";
import { url } from "../../components/ChatEditor/components/Url";
import { image } from "../../components/ChatEditor/components/Image";

export function useChatEditor() {

    const editor = useEditor({
        extensions: [
            StarterKit,
            userMention,
            skillMention,
            url,
            image
        ],

        content: "",
    });

    const getText = () => editor?.getText() ?? "";
    const getHTML = () => editor?.getHTML() ?? "";

    const getJson = () => editor?.getJSON();

    const clearText = () => editor?.commands.clearContent();

    const focusInput = () => editor?.commands.focus();

    const setContent = (text: string) => editor?.commands.setContent(text)
    const insertContent = (content: Content) => {
        editor?.commands.insertContent(content);
    };

    return {
        editor,
        getText,
        clearText,
        focusInput,
        setContent,
        getHTML,
        insertContent,
        getJson
    };
}