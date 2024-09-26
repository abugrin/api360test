import { Button } from "./button";

export interface Send {
    chat_id?: string, 
    text: string,
    login?: string,
    thread_id?: number,
    disable_web_page_preview?: boolean
    inline_keyboard?: Button[]
  }