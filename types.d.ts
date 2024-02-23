type MessagesViewRef = {
  scrollToBottom: () => void;
  scrollToTop: () => void;
  atBottom: (callback: (atBottom: boolean) => void) => void;
  atTop: (callback: (atTop: boolean) => void) => void;
  onScroll: (callback: (scrollPosition: number) => void) => void;
};

type Chat = {
  id: string;
  name: string | null;
  ownerId: string;
  createdAt: Date;
};
