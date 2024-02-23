"use client";
import { Button } from "@/components/ui/button";
import { ChangeEvent, memo } from "react";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  chatId: string;
  handleSubmit: any;
  loading: boolean;
  onInputChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void;
  input: string;
};

function MessageForm({ handleSubmit, loading, onInputChange, input }: Props) {
  const calculateHeight = (element: HTMLTextAreaElement) => {
    const computedStyle = window.getComputedStyle(element);
    const paddingTop = parseInt(
      computedStyle.getPropertyValue("padding-top"),
      10
    );
    const paddingBottom = parseInt(
      computedStyle.getPropertyValue("padding-bottom"),
      10
    );
    const totalPadding = paddingTop + paddingBottom;
    const scrollHeight = element.scrollHeight - totalPadding;
    element.style.height = `${scrollHeight}px`;
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e);
    calculateHeight(e.target);

    if (e.target.value.trim() === "") {
      e.target.style.height = "48px";
    }
  };

  return (
    <form
      className="flex justify-between gap-x-4"
      onSubmit={(e) => {
        handleSubmit(e);
        const textarea = e.currentTarget.querySelector("textarea");
        if (textarea) {
          textarea.style.height = "48px";
        }
      }}
    >
      <Textarea
        name="message"
        placeholder="Type a message..."
        value={input}
        onChange={handleInputChange}
        className="w-full min-h-12 h-12 max-h-[200px] md:max-h-[300px] overflow-y-auto resize-none p-3 custom-scrollbar"
      />
      <Button
        type="submit"
        disabled={loading || !input}
        className="self-end h-12"
      >
        Send
        {loading && "ing"}
      </Button>
    </form>
  );
}

export default memo(MessageForm);
