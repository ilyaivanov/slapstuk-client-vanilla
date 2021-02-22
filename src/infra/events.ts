type PubInfo = {
  node: HTMLElement;
  callback: (a: Item) => void;
};

let eventHandlers: { [key: string]: PubInfo[] } = {};

export const addItemListener = (
  type: string,
  node: HTMLElement,
  callback: (a: Item) => void
) => {
  if (!Array.isArray(eventHandlers[type])) eventHandlers[type] = [];

  const handler = { callback, node };
  eventHandlers[type].push(handler);
  return () => {
    const index = eventHandlers[type].indexOf(handler);
    if (index >= 0) eventHandlers[type].splice(index, 1);
  };
};
export const removeHandlersForDeadNodes = () => {
  //TODO: this is quite ugly, i'm removing all handler for removed nodes
  //but otherwise I have a huge memory leak by just simply toggling item visibility
  Object.keys(eventHandlers).forEach((key) => {
    if (eventHandlers[key].find(({ node }) => node.isConnected))
      eventHandlers[key] = eventHandlers[key].filter(
        ({ node }) => node.isConnected
      );
  });
};

export const fireEvent = (type: string, data: Item) => {
  if (Array.isArray(eventHandlers[type])) {
    eventHandlers[type].forEach(({ callback }) => callback(data));
  }
};
